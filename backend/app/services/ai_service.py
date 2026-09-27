import json
import base64
import hashlib
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

SYSTEM_INCIDENT_PROMPT = """You are the SAFEAI Emergency Incident Response Commander & Fraud Legal Specialist.
A user has experienced a potential cyber incident (e.g., clicked a phishing link, entered credentials, authorized a fraudulent transaction, or had an account hijacked).
Generate an emergency containment action plan, ready-to-use formal bank dispute letter, and official cybercrime police complaint draft.

Return ONLY strict JSON matching this schema:
{
  "severity": "CRITICAL" | "HIGH" | "MEDIUM",
  "summary": "Clear executive summary of the incident and immediate risk",
  "containment_timeline": [
    {"phase": "0-15 Minutes (Immediate Containment)", "actions": ["Step 1", "Step 2"]},
    {"phase": "1-2 Hours (Credential & Session Isolation)", "actions": ["Step 1", "Step 2"]},
    {"phase": "24-48 Hours (Financial & Legal Remediation)", "actions": ["Step 1", "Step 2"]}
  ],
  "bank_dispute_letter": "Formal ready-to-copy letter for bank/credit card fraud department citing unauthorized transactions and consumer protection rules",
  "police_report_draft": "Formal ready-to-copy cybercrime complaint narrative for law enforcement",
  "platform_recovery_steps": ["Step 1", "Step 2", "Step 3"]
}
"""

SYSTEM_PSYCH_PROMPT = """You are an expert Cyber-Psychologist specializing in social engineering, psychological manipulation, and cognitive bias exploitation.
Analyze the provided text to deconstruct the emotional triggers, psychological pressure vectors, and manipulation techniques used by the attacker.

Return ONLY strict JSON matching this schema:
{
  "manipulation_score": integer (0 to 100),
  "primary_vector": "string (e.g., Fear & Coercion, Artificial Urgency, Trust Impersonation, Greed / Reward)",
  "cialdini_principles": {
    "authority": integer (0 to 100),
    "scarcity_urgency": integer (0 to 100),
    "fear_penalty": integer (0 to 100),
    "greed_gain": integer (0 to 100),
    "social_proof": integer (0 to 100)
  },
  "exploited_cognitive_bias": "string (e.g., Hyperbolic Discounting, Ostrich Effect, Sunk Cost)",
  "psychological_breakdown": "Explanation of how the text attempts to bypass the victim's rational thought process",
  "defense_mindset": "Mental checkpoint or rule of thumb to neutralize this specific emotional trigger"
}
"""

SYSTEM_CRYPTO_PROMPT = """You are the SAFEAI Web3 & Smart Contract Security Auditor.
Analyze the provided cryptocurrency address, transaction call, smart contract request, or airdrop message for wallet drainers, permit2 approval scams, address poisoning, and honeypots.

Return ONLY strict JSON matching this schema:
{
  "risk": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "threat_type": "string (e.g., Permit2 Approval Drainer, Fake Airdrop Lure, Address Poisoning, Honeypot)",
  "drain_risk_level": "None" | "Partial" | "Total Wallet Drain",
  "explanation": "Simple explanation of how the scam works",
  "attack_vector": "Technical mechanism (e.g., setApprovalForAll, eth_sign blind signing)",
  "recommendations": ["Step 1", "Step 2", "Step 3"]
}
"""


def _get_active_ai_provider():
    """Detect whether Groq or OpenAI credentials are active."""
    if settings.GROQ_API_KEY and len(settings.GROQ_API_KEY) > 10 and not settings.GROQ_API_KEY.startswith("your_"):
        return {
            "name": "groq",
            "api_url": "https://api.groq.com/openai/v1/chat/completions",
            "api_key": settings.GROQ_API_KEY,
            "text_model": "openai/gpt-oss-20b",
            "fallback_model": "qwen/qwen3.8-27b",
        }
    if settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY) > 10 and not settings.OPENAI_API_KEY.startswith("your_"):
        return {
            "name": "openai",
            "api_url": "https://api.openai.com/v1/chat/completions",
            "api_key": settings.OPENAI_API_KEY,
            "text_model": "gpt-4o-mini",
            "fallback_model": "gpt-4o-mini",
        }
    return None


async def _execute_ai_json_call(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> Optional[Dict[str, Any]]:
    provider = _get_active_ai_provider()
    if not provider:
        return None

    for model_name in [provider["text_model"], provider.get("fallback_model")]:
        if not model_name:
            continue
        try:
            async with httpx.AsyncClient(verify=False) as client:
                response = await client.post(
                    provider["api_url"],
                    headers={
                        "Authorization": f"Bearer {provider['api_key']}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": temperature
                    },
                    timeout=25.0
                )
                if response.status_code == 200:
                    content = response.json()["choices"][0]["message"]["content"]
                    return json.loads(content)
        except Exception as e:
            print(f"AI JSON call with model {model_name} error: {e}")
    return None


async def analyze_text_with_ai(text: str, security_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Combines deterministic security signals with LLM deep semantic reasoning (Groq or OpenAI).
    Falls back reliably to deterministic context if API call fails or key is missing.
    """
    deterministic = security_context or analyze_text_security(text)
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
    ai_result = await _execute_ai_json_call(SYSTEM_SECURITY_AGENT_PROMPT, user_prompt, temperature=0.2)
    if ai_result:
        ai_result["indicator_details"] = deterministic.get("indicator_details", [])
        return ai_result

    return deterministic


async def analyze_image_with_ai(image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    """
    Analyzes screenshot using AI Vision or visual heuristic analysis.
    """
    from app.services.image_service import analyze_image_screenshot
    return await analyze_image_screenshot(image_bytes, "screenshot.png", mime_type)


async def security_chat(message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Cybersecurity Coach chat assistant powered by Groq or OpenAI.
    """
    provider = _get_active_ai_provider()
    if provider:
        messages = [{"role": "system", "content": SYSTEM_COACH_PROMPT}]
        if history:
            for h in history[-6:]:
                messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
        messages.append({"role": "user", "content": message})

        for model_name in [provider["text_model"], provider.get("fallback_model")]:
            if not model_name:
                continue
            try:
                async with httpx.AsyncClient(verify=False) as client:
                    response = await client.post(
                        provider["api_url"],
                        headers={
                            "Authorization": f"Bearer {provider['api_key']}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": model_name,
                            "messages": messages,
                            "response_format": {"type": "json_object"},
                            "temperature": 0.4
                        },
                        timeout=20.0
                    )
                    if response.status_code == 200:
                        content = response.json()["choices"][0]["message"]["content"]
                        return json.loads(content)
            except Exception as e:
                print(f"Groq coach model {model_name} attempt error: {e}")

    return _generate_coach_knowledge_response(message)


async def generate_incident_response_with_ai(incident_type: str, details: str, estimated_loss: str = "") -> Dict[str, Any]:
    """
    AI Emergency Incident Responder: generates containment protocol, bank dispute draft, and police complaint.
    """
    prompt = f"""Incident Type: {incident_type}
Estimated Financial Loss: {estimated_loss or 'Unknown / None reported'}
Incident Narrative:
---
{details}
---
"""
    ai_result = await _execute_ai_json_call(SYSTEM_INCIDENT_PROMPT, prompt, temperature=0.3)
    if ai_result:
        return ai_result

    # High quality deterministic incident response fallback
    return {
        "severity": "CRITICAL" if "card" in details.lower() or "bank" in details.lower() or "password" in details.lower() else "HIGH",
        "summary": f"Security breach containment for {incident_type}. Sensitive credentials or assets may be exposed.",
        "containment_timeline": [
            {
                "phase": "0-15 Minutes (Immediate Containment)",
                "actions": [
                    "Freeze compromised payment cards via your mobile banking application immediately.",
                    "Disconnect the affected device from the local Wi-Fi and mobile data to halt malware callbacks.",
                    "Log out of all active sessions remotely using Google/Apple/Microsoft account security portals."
                ]
            },
            {
                "phase": "1-2 Hours (Credential & Session Isolation)",
                "actions": [
                    "Change passwords for your primary email and bank from an uncompromised secondary device.",
                    "Revoke authorized OAuth application permissions and active API tokens.",
                    "Generate new two-factor authentication recovery codes."
                ]
            },
            {
                "phase": "24-48 Hours (Financial & Legal Remediation)",
                "actions": [
                    "Submit formal fraud dispute claim to your bank fraud department citing unauthorized charges.",
                    "File an official cybercrime report with national law enforcement.",
                    "Place a 90-day fraud alert on your credit profile with credit bureaus."
                ]
            }
        ],
        "bank_dispute_letter": (
            "Dear Fraud Operations Department,\n\n"
            f"I am writing to formally dispute unauthorized activity on my account regarding an incident occurring on {details[:60]}...\n\n"
            "This transaction was executed without my informed consent as a direct result of fraudulent deception/impersonation. "
            "Under applicable consumer protection regulations (including Regulation E / Electronic Fund Transfer Act), I request an immediate "
            "freeze, reversal of unauthorized charges, and reissuance of protected account credentials.\n\n"
            "Sincerely,\n[Your Name]\nAccount ending in: [XXXX]"
        ),
        "police_report_draft": (
            f"CYBERCRIME INCIDENT COMPLAINT\n"
            f"Offense: Computer Fraud & Online Impersonation ({incident_type})\n"
            f"Incident Summary: On this date, the victim was targeted by deceptive electronic communications leading to {details[:120]}...\n"
            "Requested Action: Formal investigation of digital fraudulent identifiers and preservation of relevant server transmission logs."
        ),
        "platform_recovery_steps": [
            "Use the account recovery flow at the official service website.",
            "Verify backup security email and phone number are not altered by the attacker.",
            "Enable hardware security key or authenticator app."
        ]
    }


async def audit_psychological_triggers_with_ai(text: str) -> Dict[str, Any]:
    """
    Deconstructs psychological manipulation, emotional levers, and cognitive biases.
    """
    user_prompt = f"Analyze psychological manipulation vectors in this text:\n---\n{text}\n---"
    ai_result = await _execute_ai_json_call(SYSTEM_PSYCH_PROMPT, user_prompt, temperature=0.2)
    if ai_result:
        return ai_result

    # Deterministic psychological heuristic breakdown
    lower = text.lower()
    has_urgency = any(w in lower for w in ["urgent", "immediately", "within", "now", "hours", "expire"])
    has_fear = any(w in lower for w in ["suspended", "arrest", "blocked", "legal", "court", "penalty"])
    has_authority = any(w in lower for w in ["bank", "security", "department", "officer", "police", "microsoft"])
    has_greed = any(w in lower for w in ["won", "prize", "lottery", "gift", "reward", "million"])

    return {
        "manipulation_score": 85 if (has_urgency and (has_fear or has_authority)) else 45,
        "primary_vector": "Fear & Artificial Urgency" if has_urgency else "Authority Impersonation",
        "cialdini_principles": {
            "authority": 85 if has_authority else 20,
            "scarcity_urgency": 95 if has_urgency else 15,
            "fear_penalty": 90 if has_fear else 10,
            "greed_gain": 80 if has_greed else 5,
            "social_proof": 30
        },
        "exploited_cognitive_bias": "Hyperbolic Discounting & Panic Bias",
        "psychological_breakdown": (
            "The message induces acute psychological pressure by combining perceived institutional authority "
            "with a sudden threat of loss, triggering the instinctive 'fight-or-flight' amygdala response "
            "to prevent rational skepticism."
        ),
        "defense_mindset": "Pause and breathe. Institutional organizations do not conduct emergency enforcement via unsolicited links."
    }


async def audit_crypto_web3_with_ai(payload: str) -> Dict[str, Any]:
    """
    Web3 and Smart Contract Drainer Sentry.
    """
    user_prompt = f"Audit this Web3 / crypto payload or address:\n---\n{payload}\n---"
    ai_result = await _execute_ai_json_call(SYSTEM_CRYPTO_PROMPT, user_prompt, temperature=0.2)
    if ai_result:
        return ai_result

    # Heuristic fallback for Web3
    lower = payload.lower()
    is_drainer_keyword = any(k in lower for k in ["permit", "setapprovalforall", "drainer", "airdrop", "claim", "free mint"])
    return {
        "risk": "CRITICAL" if is_drainer_keyword else "MEDIUM",
        "threat_type": "Permit2 / Token Drainer Phishing Lure" if is_drainer_keyword else "Unverified Web3 Signature Request",
        "drain_risk_level": "Total Wallet Drain" if is_drainer_keyword else "Partial",
        "explanation": "Scammers disguise token approval functions (e.g. Permit2 or setApprovalForAll) as free airdrops or NFT mints to siphon all wallet tokens.",
        "attack_vector": "Blind signing unauthorized allowance transaction",
        "recommendations": [
            "Never sign transactions containing 'setApprovalForAll' on unfamiliar websites.",
            "Use a burner wallet with minimal balances for interacting with new dApps.",
            "Inspect token allowances using revoke.cash to remove dormant contract approvals."
        ]
    }


def simulate_breach_check(query: str) -> Dict[str, Any]:
    """
    Simulates dark web exposure intelligence for an email or username safely without exposing real PII.
    """
    cleaned = query.strip().lower()
    # Deterministic hash to generate consistent synthetic breach profile
    h = int(hashlib.sha256(cleaned.encode()).hexdigest()[:8], 16)

    BREACH_CATALOG = [
        {"name": "LinkedIn Corporate Breach", "year": 2021, "records": "700 Million", "data": ["Emails", "Full Names", "Salaries", "Phone Numbers"]},
        {"name": "Canva Creative Network", "year": 2019, "records": "139 Million", "data": ["Usernames", "Emails", "Salted Bcrypt Hashes", "Cities"]},
        {"name": "Adobe Systems Exposure", "year": 2013, "records": "153 Million", "data": ["Emails", "Password Hints", "Encrypted Passwords"]},
        {"name": "Dropbox Cloud Storage Incident", "year": 2016, "records": "68 Million", "data": ["Emails", "Hashed Passwords"]},
        {"name": "Collection #1 Credential Stuffing Dump", "year": 2019, "records": "773 Million", "data": ["Plaintext Passwords", "Emails"]}
    ]

    # Select 1 to 3 breaches based on hash
    count = (h % 3) + 1
    selected_breaches = [BREACH_CATALOG[(h + i) % len(BREACH_CATALOG)] for i in range(count)]

    exposed_types = set()
    for b in selected_breaches:
        for d in b["data"]:
            exposed_types.add(d)

    compromise_score = min(count * 28 + 15, 95)
    return {
        "query": cleaned,
        "compromise_score": compromise_score,
        "threat_rating": "CRITICAL EXPOSURE" if compromise_score > 70 else "HIGH EXPOSURE",
        "total_breaches_found": len(selected_breaches),
        "breaches": selected_breaches,
        "exposed_data_types": list(exposed_types),
        "credential_stuffing_risk": "High - Attackers frequently replay leaked credentials against banking, social, and shopping platforms.",
        "action_plan": [
            "Immediately change the password for this email account using an independent device.",
            "Never reuse this password across other services.",
            "Enable Multi-Factor Authentication (MFA) with an authenticator app.",
            "Check for unauthorized forwarding filters inside your email inbox settings."
        ]
    }


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
