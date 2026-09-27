import re
from urllib.parse import urlparse, unquote
from typing import Dict, Any, List

SUSPICIOUS_TLDS = {
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "buzz", "click", "rest", "cam", "fit",
    "work", "icu", "loan", "club", "live"
}

KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly", "ow.ly", "cutt.ly"
}

BRAND_KEYWORDS = [
    "paypal", "apple", "google", "microsoft", "amazon", "netflix", "facebook",
    "instagram", "whatsapp", "banc", "bank", "chase", "wells", "citi", "crypto", "binance"
]

CREDENTIAL_PATH_KEYWORDS = [
    "login", "signin", "sign-in", "log-in", "verify", "verification", "secure",
    "update", "account", "banking", "authenticate", "confirm", "wallet", "password"
]

IP_REGEX = re.compile(r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")


def analyze_url(raw_url: str) -> Dict[str, Any]:
    """
    Safely analyzes a URL without making HTTP requests or visiting the website.
    Evaluates domain structure, protocol security, IP obfuscation, punycode,
    credential harvesting paths, and brand spoofing patterns.
    """
    cleaned_url = raw_url.strip()
    if not cleaned_url.startswith(("http://", "https://")):
        # If user pasted just domain or path, prepend https:// for uniform parsing
        parsed = urlparse("https://" + cleaned_url)
        has_original_scheme = False
    else:
        parsed = urlparse(cleaned_url)
        has_original_scheme = True

    indicators: List[str] = []
    indicator_details: List[Dict[str, str]] = []
    score = 0

    hostname = (parsed.hostname or "").lower()
    path = unquote(parsed.path or "").lower()
    query = unquote(parsed.query or "").lower()
    full_str = cleaned_url.lower()

    # 1. Scheme Check
    if has_original_scheme and parsed.scheme == "http":
        indicators.append("Insecure Protocol (HTTP)")
        indicator_details.append({
            "type": "insecure_http",
            "evidence": "URL uses unencrypted http:// protocol",
            "severity": "medium"
        })
        score += 25

    # 2. IP address check instead of domain name
    if IP_REGEX.match(hostname):
        indicators.append("Raw IP Address Hostname")
        indicator_details.append({
            "type": "ip_hostname",
            "evidence": f"Domain is direct IP address: {hostname}",
            "severity": "critical"
        })
        score += 45

    # 3. Punycode check (Internationalized Domain Names spoofing)
    if "xn--" in hostname:
        indicators.append("Punycode / Homograph Attack Signal")
        indicator_details.append({
            "type": "punycode",
            "evidence": f"Hostname contains punycode: {hostname}",
            "severity": "critical"
        })
        score += 40

    # 4. URL Shortener detection
    if hostname in KNOWN_SHORTENERS:
        indicators.append("URL Shortener Detected")
        indicator_details.append({
            "type": "url_shortener",
            "evidence": f"URL uses shortening service: {hostname}",
            "severity": "medium"
        })
        score += 20

    # 5. Suspicious or High-Risk TLD
    parts = hostname.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    if tld in SUSPICIOUS_TLDS:
        indicators.append(f"Suspicious Top-Level Domain (.{tld})")
        indicator_details.append({
            "type": "suspicious_tld",
            "evidence": f"Top level domain is often leveraged in disposable campaigns: .{tld}",
            "severity": "high"
        })
        score += 25

    # 6. Excessive Subdomains (Domain spoofing / deep nesting)
    if len(parts) > 4:
        indicators.append("Excessive Subdomains")
        indicator_details.append({
            "type": "excessive_subdomains",
            "evidence": f"Hostname contains {len(parts)} domain labels: {hostname}",
            "severity": "high"
        })
        score += 30

    # 7. Brand Impersonation in Domain / Subdomain
    matched_brands = [b for b in BRAND_KEYWORDS if b in hostname]
    # Check if brand appears in hostname but is NOT the legitimate apex domain
    for brand in matched_brands:
        legit_domains = [f"{brand}.com", f"{brand}.net", f"{brand}.org", f"{brand}.fr"]
        if not any(hostname.endswith(legit) for legit in legit_domains):
            indicators.append(f"Potential Brand Spoofing ({brand.capitalize()})")
            indicator_details.append({
                "type": "brand_spoofing",
                "evidence": f"Suspected brand keyword '{brand}' found in suspicious hostname: {hostname}",
                "severity": "critical"
            })
            score += 40
            break

    # 8. Credential & Verification Path Keywords
    found_path_keywords = [kw for kw in CREDENTIAL_PATH_KEYWORDS if kw in path or kw in query]
    if found_path_keywords:
        indicators.append("Credential or Verification Path Pattern")
        indicator_details.append({
            "type": "credential_path",
            "evidence": f"Sensitive keywords in path/query: {', '.join(found_path_keywords[:3])}",
            "severity": "high"
        })
        score += 25

    # 9. Misleading '@' symbol (Browser authority trick)
    if "@" in cleaned_url:
        indicators.append("URL Authority Obfuscation ('@' symbol)")
        indicator_details.append({
            "type": "authority_trick",
            "evidence": "URL contains '@' sign used to deceive user regarding actual target host",
            "severity": "critical"
        })
        score += 35

    # 10. Excessive Length
    if len(cleaned_url) > 120:
        indicators.append("Abnormally Long URL Structure")
        indicator_details.append({
            "type": "excessive_length",
            "evidence": f"URL length is {len(cleaned_url)} characters",
            "severity": "low"
        })
        score += 15

    final_score = min(max(score, 0), 100)

    if final_score >= 80:
        risk = "CRITICAL"
        threat_type = "Malicious / Phishing URL"
        attacker_goal = "Lure the target to a fake login portal or credential-harvesting destination."
    elif final_score >= 55:
        risk = "HIGH"
        threat_type = "Suspicious URL"
        attacker_goal = "Phishing or redirecting to an unauthorized deceptive destination."
    elif final_score >= 25:
        risk = "MEDIUM"
        threat_type = "Potentially Deceptive URL"
        attacker_goal = "Obfuscate landing destination or track user clicks."
    else:
        risk = "LOW"
        threat_type = "Standard / Legitimate Looking URL"
        attacker_goal = "None detected."

    explanation = _build_url_explanation(risk, hostname, indicators)
    recommendations = _build_url_recommendations(risk, indicators)
    educational_tip = (
        "Always verify the exact domain name before entering passwords. Scammers often register "
        "look-alike domains (e.g., paypa1-update.com) that resemble authentic services."
    )

    return {
        "risk": risk,
        "score": final_score,
        "threat_type": threat_type,
        "confidence": 0.92,
        "indicators": indicators,
        "indicator_details": indicator_details,
        "explanation": explanation,
        "attacker_goal": attacker_goal,
        "recommendations": recommendations,
        "educational_tip": educational_tip,
        "uncertainty": "Static structural analysis without active browsing (safe execution mode).",
    }


def _build_url_explanation(risk: str, hostname: str, indicators: List[str]) -> str:
    if risk in ("HIGH", "CRITICAL"):
        return (
            f"The link targeting '{hostname}' exhibits strong indicators of a fraudulent or phishing website. "
            f"Issues detected: {', '.join(indicators) if indicators else 'Deceptive structure'}."
        )
    elif risk == "MEDIUM":
        return (
            f"The URL shows several suspicious attributes ({', '.join(indicators)}). "
            f"Exercise caution and avoid providing credentials if redirected."
        )
    else:
        return f"No malicious URL structural anomalies or deceptive brand patterns were identified for '{hostname}'."


def _build_url_recommendations(risk: str, indicators: List[str]) -> List[str]:
    recs = []
    if risk in ("HIGH", "CRITICAL"):
        recs.append("Do NOT click or open this link.")
        recs.append("Do NOT submit any credentials, phone numbers, or credit card details on this destination.")
        recs.append("If this link was received in a message from an alleged service, navigate to the official website manually.")
        recs.append("Report the URL as phishing/fraud to your security provider or browser.")
    elif risk == "MEDIUM":
        recs.append("Avoid opening this link on untrusted networks.")
        recs.append("Inspect the full domain carefully before entering any personal data.")
    else:
        recs.append("Link appears structurally standard. Always verify HTTPS certificate validity in your browser.")

    return recs
