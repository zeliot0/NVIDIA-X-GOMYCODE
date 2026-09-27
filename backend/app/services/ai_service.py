import json
import base64
from typing import Dict, Any, List, Optional
import httpx
from app.config import settings
from app.services.security_service import analyze_text_security

SYSTEM_SECURITY_AGENT_PROMPT = """You are SAFEAI, an advanced AI Personal Cybersecurity Assistant.
Your core mission is: "Don't just detect the threat. Understand it."
Analyze the provided user submission (message, communication, or transcript) and return a strict JSON response.

Security Assessment Principles:
1. Distinguish clearly between observed facts, inferences, and uncertainty.
2. Explain the risk in simple language that non-technical users can easily understand.
3. Identify the attacker's underlying goal (e.g. credential theft, financial fraud, malware delivery).
4. Provide immediate, defensive action steps (never advise hacking back or visiting links).
5. Never request passwords, OTPs, or private user details.
6. Support multilingual submissions (English, French, Arabic, Tunisian Arabic).

Return ONLY valid JSON matching this schema:
{
  "risk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "score": integer (0 to 100),
  "threat_type": "string",
  "confidence": float (0.0 to 1.0),
  "indicators": ["string", "string"],
  "explanation": "Clear plain-language explanation of the threat",
  "attacker_goal": "What the attacker wants to achieve",
  "recommendations": ["Step 1", "Step 2", "Step 3"],
  "educational_tip": "Security tip explaining the tactic and defense",
  "uncertainty": "Notes on any ambiguities or missing context"
}
"""

SYSTEM_COACH_PROMPT = """You are the SAFEAI Cybersecurity Coach.
Your mission is to educate ordinary internet users about cybersecurity, online safety, phishing, passwords, MFA/2FA, social engineering, and safe browsing.
Be friendly, clear, authoritative, and practical. Do not use overly complex jargon without explaining it.
Always emphasize:
- Never share OTPs or passwords.
- Verify through official, independent channels.
- Use password managers and authenticator apps.
Return your response as JSON with:
{
  "response": "Detailed, friendly, clear advice in markdown",
  "educational_tips": ["Tip 1", "Tip 2"],
  "suggested_questions": ["Question 1", "Question 2", "Question 3"]
}
"""


async def analyze_text_with_ai(text: str, security_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Combines deterministic security signals with LLM deep semantic reasoning.
    Falls back reliably to deterministic context if API key is not configured.
    """
    deterministic = security_context or analyze_text_security(text)

    if not settings.OPENAI_API_KEY or len(settings.OPENAI_API_KEY) < 10:
        return deterministic

    try:
        user_prompt = f"""Analyze this content for cybersecurity threats:
Input Content:
---
{text}
---

Deterministic Security Engine Findings:
- Detected Risk: {deterministic.get('risk')}
- Detected Indicators: {', '.join(deterministic.get('indicators', []))}
- Base Score: {deterministic.get('score')}
"""

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": SYSTEM_SECURITY_AGENT_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2
                },
                timeout=20.0
            )

            if response.status_code == 200:
                data = response.json()
                parsed = json.loads(data["choices"][0]["message"]["content"])
                parsed["indicator_details"] = deterministic.get("indicator_details", [])
                return parsed
    except Exception:
        pass

    return deterministic


async def analyze_image_with_ai(image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    """
    Analyzes screenshot using AI Vision to detect brand spoofing, fake login screens,
    and deceptive popups.
    """
    b64_image = base64.b64encode(image_bytes).decode("utf-8")
    data_uri = f"data:{mime_type};base64,{b64_image}"

    if settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY) > 10:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": SYSTEM_SECURITY_AGENT_PROMPT},
                            {
                                "role": "user",
                                "content": [
                                    {"type": "text", "text": "Analyze this screenshot for phishing, fake login fields, brand spoofing, or scam popups."},
                                    {"type": "image_url", "image_url": {"url": data_uri}}
                                ]
                            }
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.2
                    },
                    timeout=25.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return json.loads(data["choices"][0]["message"]["content"])
        except Exception:
            pass

    from app.services.image_service import analyze_image_screenshot
    return await analyze_image_screenshot(image_bytes, "screenshot.png", mime_type)


async def security_chat(message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Cybersecurity Coach chat assistant.
    Provides conversational security education and advice.
    """
    if settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY) > 10:
        try:
            messages = [{"role": "system", "content": SYSTEM_COACH_PROMPT}]
            if history:
                for h in history[-6:]:
                    messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
            messages.append({"role": "user", "content": message})

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": messages,
                        "response_format": {"type": "json_object"},
                        "temperature": 0.4
                    },
                    timeout=20.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return json.loads(data["choices"][0]["message"]["content"])
        except Exception:
            pass

    # Built-in intelligent cybersecurity coach knowledge base
    return _generate_coach_knowledge_response(message)


def _generate_coach_knowledge_response(query: str) -> Dict[str, Any]:
    q = query.lower()

    if "otp" in q or "one-time" in q or "verification code" in q:
        return {
            "response": (
                "### Why you should NEVER share an OTP\n\n"
                "An **OTP (One-Time Password)** is the second factor in Two-Factor Authentication (2FA). "
                "When someone asks you for an OTP:\n\n"
                "1. **They already have your password or username** and are attempting to sign in right now.\n"
                "2. The OTP was sent to **your** device to confirm that it is truly you authorizing the action.\n"
                "3. **Legitimate organizations, banks, and tech companies will NEVER call, email, or message you to ask for your OTP.**\n\n"
                "If someone contacts you asking for an OTP, **hang up immediately** and change your password."
            ),
            "educational_tips": [
                "Never read OTP codes aloud to incoming callers.",
                "Switch to app-based authenticators (like Google Authenticator) which are immune to SIM-swapping.",
                "Treat your OTP like your bank PIN."
            ],
            "suggested_questions": [
                "How do scammers trick people into sharing OTPs?",
                "What should I do if I accidentally shared my OTP?",
                "Why are authenticator apps safer than SMS codes?"
            ]
        }
    elif "phish" in q or "email" in q or "recognize" in q or "fake" in q:
        return {
            "response": (
                "### How to Recognize a Phishing Message\n\n"
                "Phishing attacks rely on social engineering to trigger impulsive actions. Look for these **red flags**:\n\n"
                "- **Artificial Urgency**: 'Your account will be suspended within 24 hours!'\n"
                "- **Unusual Sender Address**: Look past the display name to the actual email address (e.g., `support@mail-security-bank.xyz` instead of official domain).\n"
                "- **Generic Greetings**: 'Dear Customer' instead of your name.\n"
                "- **Requests for Sensitive Actions**: Clicking a link to 'verify' credentials or update payment details.\n"
                "- **Mismatched Links**: Hovering over the link reveals a completely different destination address.\n\n"
                "**Golden Rule**: Never click the link in an unexpected alert. Open your browser and navigate to the official website directly."
            ),
            "educational_tips": [
                "Always check the domain in your browser address bar.",
                "Legitimate banks never threaten immediate suspension without formal notice.",
                "Use a password manager; it will refuse to autofill on fake domains."
            ],
            "suggested_questions": [
                "What is the difference between phishing and spear phishing?",
                "How do I check if a link is safe before clicking?",
                "What should I do if I clicked a phishing link?"
            ]
        }
    elif "password" in q:
        return {
            "response": (
                "### Password Security Best Practices\n\n"
                "Weak and reused passwords are the #1 cause of account takeovers. Follow these core guidelines:\n\n"
                "- **Use Passphrases**: Combine 4-5 unrelated words (e.g., `purple-elephant-guitar-mountain`) for high entropy that is easy to remember.\n"
                "- **Never Reuse Passwords**: If one site suffers a data breach, attackers test that credential across hundreds of popular services (Credential Stuffing).\n"
                "- **Adopt a Password Manager**: Tools like Bitwarden, 1Password, or Apple Keychain generate unique 20+ character passwords and autofill securely.\n"
                "- **Always Enable 2FA**: Even if a password leaks, 2FA prevents unauthorized logins."
            ),
            "educational_tips": [
                "Change passwords immediately if you receive unauthorized login alerts.",
                "Check 'Have I Been Pwned' to see if your email has appeared in data breaches.",
                "Avoid personal details like birthdays, pets' names, or sports teams."
            ],
            "suggested_questions": [
                "Is it safe to store passwords in my web browser?",
                "What is a passphrase vs a password?",
                "How does two-factor authentication protect my accounts?"
            ]
        }
    else:
        return {
            "response": (
                "### Cybersecurity Guidance from SAFEAI\n\n"
                "Welcome to the SAFEAI Cybersecurity Coach. I am here to help you navigate digital risks with confidence.\n\n"
                "The three pillars of everyday cybersecurity are:\n"
                "1. **Pause before reacting**: Cybercriminals exploit fear, panic, and curiosity.\n"
                "2. **Verify independently**: Never use links or phone numbers provided in unsolicited messages.\n"
                "3. **Harden your accounts**: Unique passwords + multi-factor authentication stop 99% of automated attacks.\n\n"
                "Feel free to ask me about any suspicious communication, security concept, or defensive habit!"
            ),
            "educational_tips": [
                "Keep your operating system and web browser updated with security patches.",
                "Be suspicious of unsolicited requests for urgent action or money.",
                "Back up essential files to an encrypted external drive or secure cloud."
            ],
            "suggested_questions": [
                "Why should I never share an OTP?",
                "How can I recognize a phishing email?",
                "What should I do if I accidentally clicked a suspicious link?"
            ]
        }
