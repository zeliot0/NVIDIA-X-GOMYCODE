import re
from typing import Dict, Any, List, Tuple


# Regex patterns categorized by threat signals with multilingual support (EN, FR, AR)
PATTERNS = {
    "urgency": {
        "label": "Urgency & Pressure",
        "severity": "high",
        "weight": 20,
        "regex": re.compile(
            r"\b(urgent|immediately|act now|action required|suspended|suspension|limited time|"
            r"within 24 hours?|expires soon|immediate response|account suspended|final notice|"
            r"immédiatement|urgent|action requise|sous 24h|suspendu|délai|bloqué|"
            r"عاجل|فوراً|فورا|خلال 24 ساعة|تم تعليق|تنبيه أخير)\b",
            re.IGNORECASE | re.UNICODE,
        ),
    },
    "credential_request": {
        "label": "Credential Request",
        "severity": "critical",
        "weight": 30,
        "regex": re.compile(
            r"\b(password|verify your password|verify password|credentials|login details|"
            r"verify your account|confirm your password|sign in here|update credentials|"
            r"mot de passe|identifiants?|connexion|vérifier votre compte|confirmez vos identifiants|"
            r"كلمة المرور|كلمة السر|تسجيل الدخول|تأكيد الحساب|تحديث البيانات الشخصية)\b",
            re.IGNORECASE | re.UNICODE,
        ),
    },
    "otp_request": {
        "label": "OTP / 2FA Code Request",
        "severity": "critical",
        "weight": 35,
        "regex": re.compile(
            r"\b(otp|one-time password|verification code|security code|2fa code|auth code|"
            r"code received|sms code|share the code|send me the code|"
            r"code de vérification|code de sécurité|code sms|code reçu|"
            r"رمز التحقق|رمز التأكيد|رمز الأمان|كود التحقق)\b",
            re.IGNORECASE | re.UNICODE,
        ),
    },
    "financial_context": {
        "label": "Financial Context",
        "severity": "medium",
        "weight": 15,
        "regex": re.compile(
            r"\b(bank|bank account|credit card|debit card|billing|unauthorized transaction|"
            r"wire transfer|invoice|refund|payment declined|overdue|cryptocurrency|bitcoin|wallet|"
            r"compte bancaire|carte bancaire|virement|transaction suspecte|facture|remboursement|"
            r"حساب بنكي|بطاقة بنكية|تحويل بنكي|معاملة مالية|بطاقة ائتمان)\b",
            re.IGNORECASE | re.UNICODE,
        ),
    },
    "suspicious_action": {
        "label": "Suspicious Action / Link",
        "severity": "medium",
        "weight": 20,
        "regex": re.compile(
            r"\b(click here|click the link|verify immediately|download attachment|open attachment|"
            r"cliquez ici|suivez le lien|télécharger la pièce jointe|ouvrez le fichier|"
            r"اضغط هنا|انقر هنا|افتح الرابط|تحميل المرفق)\b|"
            r"(https?://\S+|bit\.ly/\S+|tinyurl\.com/\S+|t\.co/\S+)",
            re.IGNORECASE | re.UNICODE,
        ),
    },
    "threats_coercion": {
        "label": "Threats & Coercion",
        "severity": "high",
        "weight": 25,
        "regex": re.compile(
            r"\b(legal action|arrest warrant|lawsuit|police|court|account termination|"
            r"permanently closed|frozen immediately|"
            r"poursuites judiciaires|mandat d'arrêt|tribunal|police|fermeture définitive|"
            r"إجراءات قانونية|أمر توقيف|الشرطة|المحكمة|إغلاق نهائي)\b",
            re.IGNORECASE | re.UNICODE,
        ),
    },
    "fake_rewards": {
        "label": "Fake Reward / Lottery",
        "severity": "high",
        "weight": 25,
        "regex": re.compile(
            r"\b(congratulations|you won|lottery|claim your prize|selected as winner|"
            r"million dollars|gift card|exclusive reward|"
            r"félicitations|vous avez gagné|loterie|réclamez votre prix|gain exceptionnel|"
            r"مبروك|تهانينا|ربحت|جائزة كبرى|سحب الحظ)\b",
            re.IGNORECASE | re.UNICODE,
        ),
    },
}


def analyze_text_security(text: str) -> Dict[str, Any]:
    """
    Deterministic cybersecurity rule engine for text analysis.
    Identifies phishing indicators, social engineering triggers, urgency,
    credential harvesting, and financial scam patterns.
    """
    if not text or not text.strip():
        return {
            "risk": "LOW",
            "score": 0,
            "threat_type": "None",
            "confidence": 1.0,
            "indicators": [],
            "indicator_details": [],
            "explanation": "No text content provided for security analysis.",
            "attacker_goal": "None",
            "recommendations": ["Enter text or a message to analyze."],
            "educational_tip": "Always be mindful of unexpected messages asking for personal information.",
            "uncertainty": None,
        }

    detected_indicators = []
    indicator_details = []
    base_score = 0

    # Scan text against all cybersecurity pattern groups
    for cat_key, config in PATTERNS.items():
        matches = config["regex"].findall(text)
        if matches:
            # Flatten match results if regex contains groups
            flat_matches = []
            for m in matches:
                if isinstance(m, tuple):
                    flat_matches.extend([x for x in m if x])
                else:
                    flat_matches.append(m)

            evidence_str = ", ".join(list(set(flat_matches))[:3])
            detected_indicators.append(config["label"])
            indicator_details.append({
                "type": cat_key,
                "evidence": evidence_str,
                "severity": config["severity"],
            })
            base_score += config["weight"]

    # Synergy multipliers for classic phishing and social engineering attack patterns
    categories_found = {d["type"] for d in indicator_details}
    
    # Critical Phishing Combo: Urgency + Credential Request + (Action or Financial)
    if "urgency" in categories_found and "credential_request" in categories_found:
        base_score += 25
    
    # Credential Harvesting / Social Engineering: OTP request
    if "otp_request" in categories_found:
        base_score += 25
        if "urgency" in categories_found or "financial_context" in categories_found:
            base_score += 15

    # Scam / Coercion: Threat + Financial
    if "threats_coercion" in categories_found and "financial_context" in categories_found:
        base_score += 20

    # Fake Reward + Action: Classic Advance-Fee Scam
    if "fake_rewards" in categories_found and "suspicious_action" in categories_found:
        base_score += 20

    # Cap score between 0 and 100
    final_score = min(max(base_score, 0), 100)

    # Determine risk category
    if final_score >= 80:
        risk_level = "CRITICAL"
    elif final_score >= 55:
        risk_level = "HIGH"
    elif final_score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Classify threat type
    if "otp_request" in categories_found:
        threat_type = "OTP Interception / Social Engineering"
        attacker_goal = "Intercept two-factor authentication codes to bypass account security and hijack accounts."
    elif "credential_request" in categories_found and ("urgency" in categories_found or "suspicious_action" in categories_found):
        threat_type = "Phishing / Credential Harvesting"
        attacker_goal = "Steal account credentials (passwords/logins) by impersonating a trusted service."
    elif "fake_rewards" in categories_found:
        threat_type = "Advance-Fee Scam / Fake Reward"
        attacker_goal = "Lure the victim with promises of prizes into paying fees or submitting sensitive personal details."
    elif "threats_coercion" in categories_found:
        threat_type = "Extortion / Scareware"
        attacker_goal = "Frighten the user with fake legal or financial penalties into immediate compliance."
    elif "financial_context" in categories_found and "suspicious_action" in categories_found:
        threat_type = "Financial Fraud / Fake Notification"
        attacker_goal = "Direct the victim to a fraudulent payment portal or bogus transaction confirmation."
    elif final_score > 0:
        threat_type = "Suspicious Communication"
        attacker_goal = "Unclear from text alone, but exhibits social engineering indicators."
    else:
        threat_type = "Safe / Low Risk"
        attacker_goal = "None detected."

    # Build plain-language explanation
    explanation = _build_explanation(risk_level, detected_indicators, text)

    # Build recommended actions
    recommendations = _build_recommendations(risk_level, categories_found)

    # Build educational tip
    educational_tip = _build_educational_tip(categories_found)

    confidence = 0.95 if detected_indicators else 0.85

    return {
        "risk": risk_level,
        "score": final_score,
        "threat_type": threat_type,
        "confidence": confidence,
        "indicators": detected_indicators,
        "indicator_details": indicator_details,
        "explanation": explanation,
        "attacker_goal": attacker_goal,
        "recommendations": recommendations,
        "educational_tip": educational_tip,
        "uncertainty": "Deterministic keyword and pattern analysis. Verification via official channels is always advised.",
    }


def _build_explanation(risk: str, indicators: List[str], text: str) -> str:
    if risk == "CRITICAL":
        return (
            f"This message demonstrates clear characteristics of a high-risk security threat. "
            f"It combines high-urgency language with direct attempts to obtain credentials, codes, or immediate action. "
            f"Detected triggers: {', '.join(indicators)}."
        )
    elif risk == "HIGH":
        return (
            f"The message shows strong indications of social engineering or phishing. "
            f"It prompts the recipient to take sensitive actions under pressure. "
            f"Key indicators identified: {', '.join(indicators)}."
        )
    elif risk == "MEDIUM":
        return (
            f"The message exhibits some suspicious elements ({', '.join(indicators)}). "
            f"While it may be legitimate in specific contexts, caution is advised before clicking links or replying."
        )
    else:
        return (
            "No common phishing, social engineering, or scam indicators were detected in this message. "
            "However, always remain vigilant with unknown contacts."
        )


def _build_recommendations(risk: str, categories: set) -> List[str]:
    recs = []
    if "otp_request" in categories:
        recs.append("Never share an OTP, SMS code, or verification code with anyone over phone, text, or email.")
    if "credential_request" in categories:
        recs.append("Do not enter your password, username, or personal credentials through any link provided.")
    if "suspicious_action" in categories:
        recs.append("Do not click links or download any files attached to this message.")
    if "financial_context" in categories or "urgency" in categories:
        recs.append("Verify your account status by manually visiting the official website or opening the official banking app directly.")

    if risk in ("HIGH", "CRITICAL"):
        recs.append("If you already provided sensitive details or credentials, immediately change your password and contact the service provider.")
        recs.append("Block the sender and report the message as spam or phishing.")
    elif risk == "MEDIUM":
        recs.append("Verify the sender's identity through an independent, verified contact method before taking any action.")
    else:
        recs.append("No immediate defensive action is required, but verify sender authenticity if unexpected.")

    return recs[:5]


def _build_educational_tip(categories: set) -> str:
    if "otp_request" in categories:
        return (
            "Legitimate organizations and banks will never ask you to disclose an SMS verification code or OTP. "
            "Codes are meant only for you to enter into the official website or app to log in."
        )
    elif "urgency" in categories:
        return (
            "Cybercriminals use artificial urgency (like threats of account suspension) to trigger panic so you act quickly "
            "without stopping to verify whether the notification is authentic."
        )
    elif "fake_rewards" in categories:
        return (
            "If an offer seems too good to be true, it almost certainly is. Unsolicited prizes and lotteries are common lures "
            "designed to harvest personal information or upfront processing fees."
        )
    elif "credential_request" in categories:
        return (
            "Always check the URL in your browser address bar. Real services will direct you to their official domain, "
            "whereas phishing links lead to spoofed replica websites."
        )
    else:
        return (
            "Regularly reviewing suspicious patterns helps develop a strong security instinct. When in doubt, always "
            "check through a separate, trusted channel."
        )
