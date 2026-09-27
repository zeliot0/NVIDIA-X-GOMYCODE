import re
import math
import secrets
import string
import io
from email.parser import HeaderParser
from typing import Dict, Any, List
from PIL import Image
from app.services.url_service import analyze_url

try:
    import pyzbar.pyzbar as pyzbar
except ImportError:
    pyzbar = None

COMMON_PASSWORDS = {
    "password", "123456", "12345678", "1234", "qwerty", "12345", "dragon",
    "p@ssword", "welcome", "admin", "letmein", "football", "iloveyou",
    "master", "monkey", "sunshine", "princess", "secret", "login", "safeai"
}

KEYBOARD_WALKS = ["qwerty", "asdfgh", "zxcvbn", "123456", "654321", "abcdef"]


def audit_password(password: str) -> Dict[str, Any]:
    """
    Performs comprehensive cryptographic entropy analysis, crack-time estimation,
    pattern vulnerability checking, and secure passphrase generation.
    """
    if not password:
        return {
            "score": 0,
            "strength": "EMPTY",
            "entropy_bits": 0,
            "crack_time_offline": "0 seconds",
            "crack_time_online": "0 seconds",
            "vulnerabilities": ["Password cannot be blank."],
            "recommendations": ["Enter a passphrase with at least 14 characters."],
            "suggested_alternatives": _generate_passphrase_suggestions(),
        }

    length = len(password)
    has_lower = bool(re.search(r"[a-z]", password))
    has_upper = bool(re.search(r"[A-Z]", password))
    has_digit = bool(re.search(r"\d", password))
    has_symbol = bool(re.search(r"[^a-zA-Z0-9]", password))

    # Calculate character pool size (N)
    pool_size = 0
    if has_lower: pool_size += 26
    if has_upper: pool_size += 26
    if has_digit: pool_size += 10
    if has_symbol: pool_size += 32
    if pool_size == 0: pool_size = 1

    # Shannon / Combinatorial entropy: E = L * log2(N)
    entropy = round(length * math.log2(pool_size), 1)

    vulnerabilities = []
    if length < 8:
        vulnerabilities.append("Critical: Length is under 8 characters (vulnerable to instant brute-force).")
    elif length < 12:
        vulnerabilities.append("Warning: Length is under 12 characters.")

    if not has_upper: vulnerabilities.append("Missing uppercase letters.")
    if not has_lower: vulnerabilities.append("Missing lowercase letters.")
    if not has_digit: vulnerabilities.append("Missing numerical digits.")
    if not has_symbol: vulnerabilities.append("Missing special symbols or punctuation.")

    lower_pw = password.lower()
    if lower_pw in COMMON_PASSWORDS:
        vulnerabilities.append("CRITICAL: Matches top 100 most common passwords in global data breaches!")

    for walk in KEYBOARD_WALKS:
        if walk in lower_pw:
            vulnerabilities.append(f"Contains predictable keyboard walk pattern ('{walk}').")
            break

    if re.search(r"(.)\1{2,}", password):
        vulnerabilities.append("Contains 3 or more repeated identical characters.")

    # Calculate crack times
    # Offline GPU cluster: 10^10 hashes/sec (10 billion/s)
    # Online throttled web form: 100 attempts/sec
    combinations = pool_size ** length
    offline_seconds = combinations / (10 ** 10)
    online_seconds = combinations / 100

    def format_time(seconds: float) -> str:
        if seconds < 1: return "Instant (< 1 second)"
        if seconds < 60: return f"{round(seconds)} seconds"
        if seconds < 3600: return f"{round(seconds / 60)} minutes"
        if seconds < 86400: return f"{round(seconds / 3600)} hours"
        if seconds < 31536000: return f"{round(seconds / 86400)} days"
        years = seconds / 31536000
        if years < 1000: return f"{round(years)} years"
        if years < 1000000: return f"{round(years / 1000)} thousand years"
        if years < 1000000000: return f"{round(years / 1000000)} million years"
        return "Centuries (Practically Uncrackable)"

    # Compute score (0 - 100)
    score = min(max(int((entropy / 80) * 100), 0), 100)
    if length < 8: score = min(score, 25)
    if lower_pw in COMMON_PASSWORDS: score = min(score, 10)

    if score >= 85:
        strength = "BEAST / QUANTUM GRADE"
    elif score >= 65:
        strength = "STRONG"
    elif score >= 40:
        strength = "MODERATE"
    else:
        strength = "WEAK"

    recommendations = []
    if length < 14:
        recommendations.append("Increase length to 14+ characters to defeat modern multi-GPU cracking rigs.")
    if not has_symbol:
        recommendations.append("Incorporate symbols like @, #, $, %, ^, &, *.")
    if "Passphrase" not in recommendations:
        recommendations.append("Consider using a 4-word passphrase (e.g. 'purple-velvet-falcon-harbor') for high entropy and easy memory.")

    return {
        "score": score,
        "strength": strength,
        "entropy_bits": entropy,
        "length": length,
        "character_types": {
            "lowercase": has_lower,
            "uppercase": has_upper,
            "numbers": has_digit,
            "symbols": has_symbol,
        },
        "crack_time_offline": format_time(offline_seconds),
        "crack_time_online": format_time(online_seconds),
        "vulnerabilities": vulnerabilities,
        "recommendations": recommendations,
        "suggested_alternatives": _generate_passphrase_suggestions(),
    }


def _generate_passphrase_suggestions() -> List[str]:
    wordlist = [
        "cosmic", "falcon", "harbor", "velvet", "shield", "beacon", "crypto",
        "quantum", "sapphire", "glacier", "phoenix", "canyon", "echo", "matrix"
    ]
    suggestions = []
    for _ in range(3):
        picked = [secrets.choice(wordlist) for _ in range(3)]
        num = secrets.randbelow(90) + 10
        sym = secrets.choice(["!", "$", "#", "@", "%"])
        suggestions.append(f"{picked[0].capitalize()}-{picked[1]}-{picked[2]}{num}{sym}")
    return suggestions


def analyze_email_header(raw_headers: str) -> Dict[str, Any]:
    """
    Parses and analyzes email headers for SPF, DKIM, DMARC authentication,
    friendly name spoofing, and IP routing irregularities.
    """
    if not raw_headers or not raw_headers.strip():
        raise ValueError("Please provide raw email headers.")

    parser = HeaderParser()
    parsed = parser.parsestr(raw_headers)

    from_header = parsed.get("From", "")
    to_header = parsed.get("To", "")
    subject = parsed.get("Subject", "")
    date = parsed.get("Date", "")
    return_path = parsed.get("Return-Path", "")
    reply_to = parsed.get("Reply-To", "")
    auth_results = parsed.get("Authentication-Results", "")
    received_list = parsed.get_all("Received") or []

    indicators = []
    score = 0

    # 1. From vs Return-Path Spoofing Check
    from_match = re.search(r"<([^>]+)>", from_header)
    from_email = from_match.group(1).lower() if from_match else from_header.lower()
    return_match = re.search(r"<([^>]+)>", return_path)
    return_email = return_match.group(1).lower() if return_match else return_path.lower()

    # Friendly name spoofing detection (e.g. From: "PayPal Security" <hacker@gmail.com>)
    friendly_name = from_header.split("<")[0].replace('"', '').strip() if "<" in from_header else ""
    suspicious_brands = ["paypal", "apple", "microsoft", "google", "bank", "chase", "wells fargo", "support", "security"]

    is_display_name_spoofed = False
    for brand in suspicious_brands:
        if brand in friendly_name.lower():
            from_domain = from_email.split("@")[-1] if "@" in from_email else ""
            if brand not in from_domain:
                indicators.append(f"Display Name Spoofing Detected: Claiming to be '{friendly_name}' from unrelated address '{from_email}'")
                score += 45
                is_display_name_spoofed = True
                break

    # Return-Path Mismatch
    if from_email and return_email and from_email.split("@")[-1] != return_email.split("@")[-1]:
        indicators.append(f"Return-Path Domain Mismatch ('{from_email}' vs '{return_email}')")
        score += 30

    # Reply-To Mismatch
    if reply_to:
        reply_match = re.search(r"<([^>]+)>", reply_to)
        reply_email = reply_match.group(1).lower() if reply_match else reply_to.lower()
        if from_email and reply_email.split("@")[-1] != from_email.split("@")[-1]:
            indicators.append(f"Reply-To Mismatch: Replies are redirected to '{reply_email}'")
            score += 25

    # 2. SPF / DKIM / DMARC checks
    auth_lower = auth_results.lower()
    spf_status = "UNKNOWN"
    dkim_status = "UNKNOWN"
    dmarc_status = "UNKNOWN"

    if "spf=pass" in auth_lower:
        spf_status = "PASS"
    elif "spf=fail" in auth_lower or "spf=softfail" in auth_lower:
        spf_status = "FAIL"
        indicators.append("SPF Authentication Failed (Sending server not authorized by domain)")
        score += 35

    if "dkim=pass" in auth_lower:
        dkim_status = "PASS"
    elif "dkim=fail" in auth_lower:
        dkim_status = "FAIL"
        indicators.append("DKIM Signature Failed (Message was altered or forgery detected)")
        score += 35

    if "dmarc=pass" in auth_lower:
        dmarc_status = "PASS"
    elif "dmarc=fail" in auth_lower:
        dmarc_status = "FAIL"
        indicators.append("DMARC Policy Violation")
        score += 30

    if not auth_results:
        indicators.append("No Authentication-Results header present (Unverified relay)")
        score += 15

    final_score = min(max(score, 0), 100)
    if final_score >= 70:
        risk = "CRITICAL"
        verdict = "High-Likelihood Email Spoofing / Phishing"
    elif final_score >= 40:
        risk = "HIGH"
        verdict = "Suspicious Email Headers / Unaligned Sender"
    elif final_score >= 20:
        risk = "MEDIUM"
        verdict = "Minor Header Inconsistencies"
    else:
        risk = "LOW"
        verdict = "Valid & Authenticated Email Headers"

    return {
        "risk": risk,
        "score": final_score,
        "verdict": verdict,
        "from": from_header,
        "to": to_header,
        "subject": subject,
        "date": date,
        "return_path": return_path,
        "reply_to": reply_to,
        "authentication": {
            "spf": spf_status,
            "dkim": dkim_status,
            "dmarc": dmarc_status,
        },
        "hop_count": len(received_list),
        "indicators": indicators,
        "display_name_spoofed": is_display_name_spoofed,
        "recommendation": (
            "Do not trust this email or download attachments. The sender identity is spoofed."
            if final_score >= 40 else
            "Headers appear consistent with standard mail delivery."
        ),
    }


def scan_qr_code(image_bytes: bytes) -> Dict[str, Any]:
    """
    Decodes QR code image and runs the decoded target URL through Safe URL Analyzer.
    """
    if pyzbar is None:
        raise RuntimeError("QR decoding library pyzbar is not installed.")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        decoded_objects = pyzbar.decode(image)
    except Exception as e:
        raise ValueError(f"Failed to process image for QR decoding: {str(e)}")

    if not decoded_objects:
        return {
            "found_qr": False,
            "message": "No QR code could be detected in this image. Please ensure the QR code is clear and well-lit.",
            "url_analysis": None
        }

    qr_data = decoded_objects[0].data.decode("utf-8", errors="ignore")
    qr_type = decoded_objects[0].type

    is_url = qr_data.startswith(("http://", "https://", "www.")) or "." in qr_data

    url_result = None
    if is_url:
        url_result = analyze_url(qr_data)

    return {
        "found_qr": True,
        "qr_type": qr_type,
        "payload": qr_data,
        "is_url": is_url,
        "url_analysis": url_result
    }


def get_trending_threats() -> List[Dict[str, Any]]:
    """
    Curated global cyber threat intelligence radar of active scams and attacks.
    """
    return [
        {
            "id": "radar-1",
            "title": "Quishing (Malicious QR Code Infiltration)",
            "severity": "CRITICAL",
            "category": "QR Phishing",
            "description": "Criminals paste fraudulent QR stickers over parking meters, restaurant menus, and EV chargers to hijack payments and steal banking credentials.",
            "tactics": ["Physical tampering", "Silent URL redirection", "Fake payment gateways"],
            "defense": "Preview destination URLs before opening. Never scan QR codes from unexpected postal letters or emails."
        },
        {
            "id": "radar-2",
            "title": "AI Voice Clone Impersonation (Emergency Scam)",
            "severity": "CRITICAL",
            "category": "Vishing / Deepfake",
            "description": "Scammers use 3-second audio clips from social media to clone the voice of family members, calling relatives in distress demanding urgent wire transfers or bail money.",
            "tactics": ["Voice cloning", "Urgent emotional pressure", "Immediate cryptocurrency/wire request"],
            "defense": "Establish a private family 'safe word'. Hang up and call the family member back directly on their known phone number."
        },
        {
            "id": "radar-3",
            "title": "Postal Delivery SMS Trap ('Package Redelivery Fee')",
            "severity": "HIGH",
            "category": "Smishing",
            "description": "Mass SMS campaigns impersonating postal couriers (DHL, USPS, La Poste, Aramex) claiming a package is delayed pending a $1.50 custom fee to harvest credit card data.",
            "tactics": ["Small plausible fee lure", "Brand spoofing", "Card credential harvesting"],
            "defense": "Never click SMS links regarding parcels. Track shipments directly inside the official courier app using your tracking code."
        },
        {
            "id": "radar-4",
            "title": "Microsoft 365 / Google Workspace Session Hijacking",
            "severity": "CRITICAL",
            "category": "Reverse Proxy Phishing",
            "description": "Attackers deploy Adversary-in-the-Middle (AiTM) proxies to capture session session cookies in real-time, completely bypassing SMS-based 2FA.",
            "tactics": ["AiTM proxies", "Cookie theft", "Bypassing SMS 2FA"],
            "defense": "Switch to FIDO2 WebAuthn passkeys or app-based authenticator with number matching."
        },
        {
            "id": "radar-5",
            "title": "Fake Job Offer & Telegram Task Scams",
            "severity": "HIGH",
            "category": "Advance-Fee Fraud",
            "description": "Unsolicited WhatsApp/Telegram offers promising high daily earnings for rating hotel products or subscribing to YouTube channels, leading to upfront deposit demands.",
            "tactics": ["Fake high income lure", "Pyramid deposit scheme", "Cryptocurrency transfer"],
            "defense": "Legitimate employers never conduct interviews strictly via Telegram and never ask employees to deposit money to unlock tasks."
        }
    ]
