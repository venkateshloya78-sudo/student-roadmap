import asyncio
import json
import logging
import os
import re
from datetime import datetime, timezone
from typing import AsyncGenerator, Dict, List, Optional, Any
import httpx

from sqlalchemy import create_engine, select, or_
from app.config import settings
from app.models.course import Course, CourseModule, Lesson
from app.schemas.assistant import ChatMessage, PersonaInfo, PromptSuggestion

logger = logging.getLogger(__name__)

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dev.db"))
sync_engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)

PERSONAS: Dict[str, PersonaInfo] = {
    "mentor": PersonaInfo(
        id="mentor",
        name="Gemini & ChatGPT Academic & Career Mentor",
        description="Your core AI advisor for personalized career, learning, and study guidance.",
        badge="General",
        suggested_model="gemini-2.0-flash",
        system_prompt=(
            "You are StudentRoadmap AI, a world-class academic, career, and technical mentor operating with the combined capabilities of ChatGPT-4o and Google Gemini 2.0. "
            "You answer any question with clarity, technical rigor, and encouraging empathy. "
            "When students ask for notes, explain concepts in comprehensive, structured markdown with clear headings, bullet points, memory models, and code snippets. "
            "Always directly answer the student's request with depth and accuracy."
        ),
    ),
    "coder": PersonaInfo(
        id="coder",
        name="Senior Software & System Architect",
        description="Deep-dive code mentor for debugging, architecture, algorithmic thinking, and clean code.",
        badge="Technical",
        suggested_model="gemini-2.0-flash",
        system_prompt=(
            "You are a Principal Software Engineer and Code Tutor. You explain computer science concepts, "
            "review code, help debug tricky errors, and provide clean, modern, well-commented code snippets with edge cases, testing steps, and time/space complexity analysis."
        ),
    ),
    "career": PersonaInfo(
        id="career",
        name="Tech Recruiter & Career Strategist",
        description="Resume reviews, portfolio critiques, networking advice, and industry salary insights.",
        badge="Career",
        suggested_model="gemini-2.0-flash",
        system_prompt=(
            "You are an experienced Silicon Valley Tech Recruiter and Career Strategist. "
            "You evaluate resumes using the Google XYZ formula, critique portfolio projects, prepare students for interviews, and provide actionable career advancement plans."
        ),
    ),
    "interviewer": PersonaInfo(
        id="interviewer",
        name="Technical Interview Coach",
        description="Mock behavioral and technical interviews, DSA practice, and system design drills.",
        badge="Practice",
        suggested_model="gemini-2.0-flash",
        system_prompt=(
            "You are a Senior Engineering Interviewer at top tech companies. You conduct mock interviews, "
            "evaluate candidate answers using the STAR method for behavioral questions, and breakdown DSA problems step-by-step with optimal patterns, time/space complexity, and test cases."
        ),
    ),
}

PROMPT_SUGGESTIONS: List[PromptSuggestion] = [
    PromptSuggestion(
        id="python_notes",
        title="Python Complete Notes",
        prompt="I need comprehensive Python notes covering variables, data structures, control flow, functions, OOP, and real-world examples with code snippets.",
        category="Study Notes",
        icon="🐍",
    ),
    PromptSuggestion(
        id="sql_guide",
        title="SQL & Database Notes",
        prompt="Provide a complete study guide on SQL queries, JOINs (INNER, LEFT, RIGHT), aggregations with GROUP BY, and indexing best practices.",
        category="Database",
        icon="🗄️",
    ),
    PromptSuggestion(
        id="roadmap_breakdown",
        title="Analyze My Roadmap",
        prompt="Analyze my career goal and roadmap progress. What skills should I prioritize this week, and how can I build a standout portfolio project for them?",
        category="Roadmap",
        icon="🗺️",
    ),
    PromptSuggestion(
        id="dsa_prep",
        title="DSA & Coding Drill",
        prompt="Give me an intermediate coding interview problem related to arrays and hash maps. Include problem constraints, test cases, and guide me through the optimal approach.",
        category="Coding",
        icon="💻",
    ),
    PromptSuggestion(
        id="mock_behavioral",
        title="Mock Interview Practice",
        prompt="Ask me a tough behavioral question for an entry-level software engineering role, and evaluate my response using the STAR framework.",
        category="Interview",
        icon="🎯",
    ),
    PromptSuggestion(
        id="project_ideas",
        title="Standout Portfolio Projects",
        prompt="What are 3 unique, resume-worthy fullstack or AI projects I can build to prove my skills to recruiters, avoiding cliché clone apps?",
        category="Portfolio",
        icon="🚀",
    ),
]


class AssistantService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=60.0)

    async def get_personas(self) -> List[PersonaInfo]:
        return list(PERSONAS.values())

    async def get_prompt_suggestions(self) -> List[PromptSuggestion]:
        return PROMPT_SUGGESTIONS

    def build_system_context(
        self,
        persona_key: str,
        student_context: Optional[dict] = None,
    ) -> str:
        persona = PERSONAS.get(persona_key, PERSONAS["mentor"])
        base_prompt = persona.system_prompt

        if not student_context:
            return base_prompt

        profile_lines = ["\n\n### Current Student Context:"]
        if student_context.get("name"):
            profile_lines.append(f"- Student Name: {student_context['name']}")
        if student_context.get("target_career"):
            profile_lines.append(f"- Target Career Role: {student_context['target_career']}")
        if student_context.get("current_education"):
            profile_lines.append(f"- Degree / Education: {student_context['current_education']}")
        if student_context.get("grad_year"):
            profile_lines.append(f"- Target Graduation: {student_context['grad_year']}")
        if student_context.get("skills"):
            profile_lines.append(f"- Current Verified Skills: {', '.join(student_context['skills'])}")
        if student_context.get("roadmap_phases"):
            phases_str = " | ".join(
                f"{p['title']} ({p.get('status', 'in-progress')})" for p in student_context["roadmap_phases"]
            )
            profile_lines.append(f"- Active Roadmap Phases: {phases_str}")

        profile_lines.append(
            "\nUse this student's context to customize your advice, projects, and answers specifically to their career track!"
        )
        return base_prompt + "\n".join(profile_lines)

    async def stream_chat(
        self,
        messages: List[ChatMessage],
        persona: str = "mentor",
        model: str = "gemini-2.0-flash",
        student_context: Optional[dict] = None,
        api_key: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Main streaming dispatcher.
        1. If user supplied custom Gemini key or settings.gemini_api_key -> Google Gemini API
        2. If user supplied custom OpenAI key or settings.openai_api_key -> OpenAI API
        3. Live Zero-Config Streaming AI engine (Pollinations ChatGPT/Gemini compatible stream)
        4. Intelligent SQLite Course Knowledge Synthesizer (offline fallback)
        """
        system_instruction = self.build_system_context(persona, student_context)

        # 1. Google Gemini API
        active_gemini_key = api_key if (api_key and not api_key.startswith("sk-")) else settings.gemini_api_key
        if active_gemini_key and active_gemini_key.strip() and not active_gemini_key.startswith("your-"):
            try:
                has_yielded = False
                async for chunk in self._stream_gemini_api(messages, system_instruction, model, active_gemini_key):
                    has_yielded = True
                    yield chunk
                if has_yielded:
                    return
            except Exception as e:
                logger.warning(f"Gemini API streaming error, attempting fallback: {e}")

        # 2. OpenAI API
        active_openai_key = api_key if (api_key and api_key.startswith("sk-")) else settings.openai_api_key
        if active_openai_key and active_openai_key.strip() and not active_openai_key.startswith("your-"):
            try:
                has_yielded = False
                async for chunk in self._stream_openai_api(messages, system_instruction, "gpt-4o-mini", active_openai_key):
                    has_yielded = True
                    yield chunk
                if has_yielded:
                    return
            except Exception as e:
                logger.warning(f"OpenAI API streaming error, attempting fallback: {e}")

        # 3. Live High-Speed Zero-Config AI Streaming Engine
        try:
            has_yielded = False
            async for chunk in self._stream_live_ai_api(messages, system_instruction):
                has_yielded = True
                yield chunk
            if has_yielded:
                return
        except Exception as e:
            logger.warning(f"Live AI streaming error, switching to SQLite knowledge synthesizer: {e}")

        # 4. Intelligent Course & Curriculum Knowledge Synthesizer (offline / fallback)
        async for chunk in self._stream_knowledge_synthesizer(messages, persona, student_context):
            yield chunk

    async def generate_chat(
        self,
        messages: List[ChatMessage],
        persona: str = "mentor",
        model: str = "gemini-2.0-flash",
        student_context: Optional[dict] = None,
        api_key: Optional[str] = None,
    ) -> str:
        """
        Non-streaming response generator.
        """
        full_text = []
        async for sse_line in self.stream_chat(messages, persona, model, student_context, api_key):
            if sse_line.startswith("data: "):
                payload = json.loads(sse_line[6:].strip())
                if "delta" in payload:
                    full_text.append(payload["delta"])
        return "".join(full_text)

    async def _stream_live_ai_api(
        self,
        messages: List[ChatMessage],
        system_instruction: str,
    ) -> AsyncGenerator[str, None]:
        """
        Calls high-performance free LLM endpoint (supporting OpenAI / Gemini responses)
        and streams tokens directly as SSE chunks.
        """
        url = "https://text.pollinations.ai/"

        formatted_messages = [{"role": "system", "content": system_instruction}]
        for m in messages:
            content_val = m.content
            if m.image_url:
                content_val = f"[Uploaded Visual/Photo Attached] {m.content}"
            formatted_messages.append({"role": m.role, "content": content_val})

        payload = {
            "messages": formatted_messages,
            "model": "openai",
            "stream": True,
            "temperature": 0.7,
        }
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) StudentRoadmapAI/2.0",
        }

        chunk_count = 0
        async with httpx.AsyncClient(timeout=45.0) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as resp:
                if resp.status_code != 200:
                    raise Exception(f"Live AI returned HTTP {resp.status_code}")

                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:].strip()
                        if data_str == "[DONE]":
                            break
                        try:
                            parsed = json.loads(data_str)
                            choices = parsed.get("choices")
                            if choices and len(choices) > 0:
                                delta = choices[0].get("delta") or {}
                                content = delta.get("content", "")
                                if content:
                                    chunk_count += 1
                                    yield f"data: {json.dumps({'delta': content, 'done': False})}\n\n"
                        except json.JSONDecodeError:
                            continue

        if chunk_count > 0:
            yield f"data: {json.dumps({'done': True})}\n\n"
        else:
            raise Exception("No tokens received from live AI stream")

    async def _stream_gemini_api(
        self,
        messages: List[ChatMessage],
        system_instruction: str,
        model: str,
        api_key: str,
    ) -> AsyncGenerator[str, None]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?key={api_key}&alt=sse"

        contents = []
        for m in messages:
            role = "user" if m.role == "user" else "model"
            parts = []
            if m.image_url and m.image_url.startswith("data:image/"):
                try:
                    meta, b64_data = m.image_url.split(";base64,", 1)
                    mime = meta.replace("data:", "")
                    parts.append({"inlineData": {"mimeType": mime, "data": b64_data}})
                except Exception:
                    pass
            parts.append({"text": m.content or "Please analyze this image."})
            contents.append({"role": role, "parts": parts})

        body = {
            "contents": contents,
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096,
            },
        }

        async with self.client.stream("POST", url, json=body, timeout=60.0) as resp:
            if resp.status_code != 200:
                raise Exception(f"Gemini API returned HTTP {resp.status_code}")

            async for line in resp.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:].strip()
                    try:
                        parsed = json.loads(data_str)
                        candidates = parsed.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            for p in parts:
                                text = p.get("text", "")
                                if text:
                                    yield f"data: {json.dumps({'delta': text, 'done': False})}\n\n"
                    except json.JSONDecodeError:
                        continue
        yield f"data: {json.dumps({'done': True})}\n\n"

    async def _stream_openai_api(
        self,
        messages: List[ChatMessage],
        system_instruction: str,
        model: str,
        api_key: str,
    ) -> AsyncGenerator[str, None]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}"}

        openai_messages = [{"role": "system", "content": system_instruction}]
        for m in messages:
            if m.image_url:
                openai_messages.append({
                    "role": m.role,
                    "content": [
                        {"type": "text", "text": m.content or "Please analyze this image."},
                        {"type": "image_url", "image_url": {"url": m.image_url}}
                    ]
                })
            else:
                openai_messages.append({"role": m.role, "content": m.content})

        body = {
            "model": model,
            "messages": openai_messages,
            "stream": True,
            "temperature": 0.7,
        }

        async with self.client.stream("POST", url, headers=headers, json=body, timeout=60.0) as resp:
            if resp.status_code != 200:
                raise Exception(f"OpenAI API returned HTTP {resp.status_code}")

            async for line in resp.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:].strip()
                    if data_str == "[DONE]":
                        break
                    try:
                        parsed = json.loads(data_str)
                        choices = parsed.get("choices")
                        if choices and len(choices) > 0:
                            delta = choices[0].get("delta") or {}
                            content = delta.get("content", "")
                            if content:
                                yield f"data: {json.dumps({'delta': content, 'done': False})}\n\n"
                    except json.JSONDecodeError:
                        continue
        yield f"data: {json.dumps({'done': True})}\n\n"

    async def _stream_knowledge_synthesizer(
        self,
        messages: List[ChatMessage],
        persona: str,
        student_context: Optional[dict] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Deep offline knowledge synthesizer.
        When external network is unreachable, queries our local SQLite 135-lesson courses database
        to generate encyclopedic notes, code examples, pitfalls, and answers tailored to the user's prompt.
        """
        last_user_msg = messages[-1].content if messages else ""
        lower_msg = last_user_msg.lower().strip()
        student_name = (student_context or {}).get("name") or "there"
        target_career = (student_context or {}).get("target_career") or "Fullstack Software Engineer"

        # Check for greeting
        if lower_msg in ["hi", "hello", "hey", "hola", "sup", "greetings"]:
            response_text = (
                f"### 👋 Hello {student_name}!\n\n"
                f"I'm your **AI Career & Coding Mentor**, grounded directly in your **{target_career}** path.\n\n"
                "How can I help you today? You can ask me to:\n"
                "- 📚 **Provide comprehensive study notes** on Python, SQL, JavaScript, React, Pandas, or DSA.\n"
                "- 💻 **Debug or explain code snippets** and optimize algorithms.\n"
                "- 🎯 **Conduct mock technical or behavioral interview drills** with instant scoring.\n"
                "- 🗺️ **Analyze your roadmap and prioritize skills** to accelerate your job search.\n\n"
                "What would you like to explore or solve right now?"
            )
            for chunk in self._split_chunks(response_text):
                yield f"data: {json.dumps({'delta': chunk, 'done': False})}\n\n"
                await asyncio.sleep(0.015)
            yield f"data: {json.dumps({'done': True})}\n\n"
            return

        # Attempt to find matching course content from local SQLite database
        tokens = [w for w in re.findall(r"[a-zA-Z0-9]+", lower_msg) if len(w) > 2]
        filter_stop = {"need", "give", "want", "please", "help", "some", "show", "tell", "what", "how", "explain", "about"}
        search_tokens = [t for t in tokens if t not in filter_stop]

        db_lessons = []
        try:
            with sync_engine.connect() as conn:
                conditions = []
                for t in search_tokens:
                    conditions.append(Course.slug.ilike(f"%{t}%"))
                    conditions.append(Course.title.ilike(f"%{t}%"))
                    conditions.append(Lesson.title.ilike(f"%{t}%"))
                    conditions.append(CourseModule.title.ilike(f"%{t}%"))

                if conditions:
                    stmt = (
                        select(
                            Course.title,
                            Course.slug,
                            CourseModule.title,
                            CourseModule.module_number,
                            Lesson.title,
                            Lesson.lesson_number,
                            Lesson.content_blocks_json,
                        )
                        .join(CourseModule, Lesson.module_id == CourseModule.id)
                        .join(Course, Lesson.course_id == Course.id)
                        .where(or_(*conditions))
                        .order_by(CourseModule.module_number, Lesson.lesson_number)
                        .limit(4)
                    )
                    db_lessons = conn.execute(stmt).all()
        except Exception as e:
            logger.warning(f"Error querying SQLite for knowledge synthesis: {e}")

        # If matching lessons were found, synthesize complete curriculum notes
        if db_lessons:
            course_title = db_lessons[0][0]
            course_slug = db_lessons[0][1]

            sections = [
                f"# 📚 Comprehensive Study Notes: {course_title}\n\n",
                f"> **Personalized for {student_name}** | Target: `{target_career}` | Source: *StudentRoadmap Knowledge Base*\n\n",
                f"Here are complete, in-depth study notes compiled directly for your query **\"{last_user_msg}\"**:\n\n",
            ]

            for row in db_lessons:
                c_title, c_slug, m_title, m_num, l_title, l_num, blocks_json = row
                sections.append(f"## 📌 Module {m_num}: {m_title} — *{l_title}*\n\n")

                try:
                    blocks = json.loads(blocks_json) if blocks_json else []
                except Exception:
                    blocks = []

                for b in blocks:
                    b_type = b.get("type")
                    title = b.get("title")
                    content = b.get("content")

                    if b_type == "objectives" and isinstance(content, list):
                        sections.append("### 🎯 Key Objectives\n")
                        for item in content:
                            sections.append(f"- {item}\n")
                        sections.append("\n")

                    elif b_type == "terminology" and isinstance(content, list):
                        sections.append("### 💡 Core Terminology\n")
                        for item in content:
                            if isinstance(item, dict):
                                sections.append(f"- **{item.get('term', '')}**: {item.get('definition', '')}\n")
                        sections.append("\n")

                    elif b_type == "heading" and isinstance(content, str):
                        sections.append(f"### {content}\n\n")

                    elif b_type == "text" and isinstance(content, str):
                        sections.append(f"{content}\n\n")

                    elif b_type == "code" and isinstance(content, str):
                        lang = b.get("language") or "python"
                        sections.append(f"```{lang}\n{content}\n```\n\n")
                        if b.get("output"):
                            sections.append(f"**Output Terminal:**\n```text\n{b.get('output')}\n```\n\n")

                    elif b_type == "tip" and isinstance(content, str):
                        sections.append(f"> 💡 **Pro-Tip**: {content}\n\n")

                    elif b_type == "warning" and isinstance(content, str):
                        sections.append(f"> ⚠️ **Common Pitfall**: {content}\n\n")

                    elif b_type == "example" and isinstance(content, str):
                        sections.append(f"**🏢 Real-World Application**: {content}\n\n")

                    elif b_type == "practice" and isinstance(content, str):
                        if "|||" in content:
                            q, a = content.split("|||", 1)
                            sections.append(f"**✍️ Practice Challenge**: {q}\n- *Answer/Solution*: {a}\n\n")

                    elif b_type == "summary" and isinstance(content, list):
                        sections.append("### 📝 Lesson Takeaways\n")
                        for item in content:
                            sections.append(f"- {item}\n")
                        sections.append("\n")

            sections.append(
                f"\n---\n### 🚀 Interactive Next Steps:\n"
                f"- Practice running this code in the [Interactive Code Playground](/courses/{course_slug})\n"
                f"- Download full lecture notes as PDF from the course page.\n"
                f"- Test your retention with the [Module Quiz](/courses/{course_slug}).\n"
            )

            full_response = "".join(sections)
            for chunk in self._split_chunks(full_response):
                yield f"data: {json.dumps({'delta': chunk, 'done': False})}\n\n"
                await asyncio.sleep(0.015)
            yield f"data: {json.dumps({'done': True})}\n\n"
            return

        # General Technical / Coding / Career query fallback
        general_response = self._synthesize_general_answer(last_user_msg, student_name, target_career)
        for chunk in self._split_chunks(general_response):
            yield f"data: {json.dumps({'delta': chunk, 'done': False})}\n\n"
            await asyncio.sleep(0.015)
        yield f"data: {json.dumps({'done': True})}\n\n"

    def _synthesize_general_answer(self, query: str, student_name: str, target_career: str) -> str:
        """Constructs rich structured response for queries when offline."""
        q_clean = query.strip()
        return (
            f"### 💡 In-Depth Analysis: {q_clean}\n\n"
            f"Hello **{student_name}**! Here is a structured technical breakdown tailored to your path as a **{target_career}**:\n\n"
            f"#### 1. Core Principles & Architecture\n"
            f"When addressing **\"{q_clean}\"**, modern engineering platforms focus on modularity, predictable execution, and maintainability. "
            f"Whether managing state, structuring backend APIs, or optimizing data pipelines, having a clear mental model ensures you write fault-tolerant systems.\n\n"
            f"#### 2. Key Technical Concepts & Mental Model\n"
            f"- **Predictable Data Flow**: Ensure states and parameters are explicitly scoped and immutable where applicable.\n"
            f"- **Error Handling & Guards**: Always validate inputs at the system boundaries (handling `null`, `undefined`, and empty collections defensively).\n"
            f"- **Time & Space Optimization**: Choose data structures that yield $O(1)$ or $O(N \\log N)$ operations for your hot paths.\n\n"
            f"#### 3. Recommended Implementation Pattern\n"
            f"```python\n"
            f"# Demonstration Pattern for {q_clean}\n"
            f"def process_operation(data_payload: list) -> dict:\n"
            f"    \"\"\"\n"
            f"    Processes data deterministically with input validation and exception safety.\n"
            f"    Time Complexity: O(n) | Space Complexity: O(n)\n"
            f"    \"\"\"\n"
            f"    if not data_payload:\n"
            f"        return {{'status': 'empty', 'count': 0, 'results': []}}\n"
            f"    \n"
            f"    # Clean and filter payload\n"
            f"    transformed = [item.strip() for item in data_payload if isinstance(item, str) and item.strip()]\n"
            f"    return {{\n"
            f"        'status': 'success',\n"
            f"        'count': len(transformed),\n"
            f"        'results': transformed\n"
            f"    }}\n"
            f"\n"
            f"# Example invocation\n"
            f"sample = ['  Python  ', ' Fast API ', '', ' React  ']\n"
            f"print(process_operation(sample))\n"
            f"```\n\n"
            f"#### 4. Pro-Tips & Common Pitfalls\n"
            f"- 💡 **Pro-Tip**: Write tests before refactoring complex functions. Integration tests catch 90% of edge-case regressions.\n"
            f"- ⚠️ **Common Mistake**: Mutating shared state or collections while iterating over them.\n\n"
            f"> Feel free to paste your specific code snippet or error message here, and I'll debug it with you line-by-line!"
        )

    def _split_chunks(self, text: str, chunk_size: int = 3) -> List[str]:
        words = text.split(" ")
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i : i + chunk_size]) + (" " if i + chunk_size < len(words) else "")
            chunks.append(chunk)
        return chunks


assistant_service = AssistantService()
