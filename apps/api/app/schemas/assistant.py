from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    image_url: Optional[str] = Field(None, description="Optional base64 data URI or image URL from camera/upload")


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    persona: Optional[str] = Field("mentor", description="mentor, coder, career, interviewer")
    model: Optional[str] = Field("gemini-2.0-flash", description="AI model to use")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    include_student_context: Optional[bool] = Field(True, description="Attach student career and roadmap context")
    api_key: Optional[str] = Field(None, description="Optional custom Gemini or OpenAI API key")


class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str
    model: str
    persona: str
    created_at: str


class PromptSuggestion(BaseModel):
    id: str
    title: str
    prompt: str
    category: str
    icon: str


class PersonaInfo(BaseModel):
    id: str
    name: str
    description: str
    badge: str
    system_prompt: str
    suggested_model: str
