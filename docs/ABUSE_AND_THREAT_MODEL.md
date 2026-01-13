# Abuse and Threat Model

## Threat: Phishing and Credential Theft
Even without JavaScript, static HTML can be used to create pixel-perfect replicas of login pages (e.g., Google, Bank of America).
- **Mitigation**: 
    - Forced "Malicious Site" headers if a site is reported.
    - Automated scanning of common phishing keywords (e.g., "Login", "Password", "Verify Account") during upload.
    - All external form actions (`<form action="...">`) could be restricted to a whitelist or require a confirmation interstitial for users.

## Threat: Malicious Content Hosting
Hosting illegal, copyrighted, or harmful static assets.
- **Mitigation**:
    - Centralized Control: As the host, we reserve the right to `rm -rf` any folder at any time.
    - Public Reporting: A simple "Report Abuse" link on the service homepage or via a global footer injection.
    - Hash-based blocking: If a known malicious file is deleted, its hash is added to a blacklist to prevent re-upload.

## Threat: JavaScript and Media Injection
An agent might try to hide JS or host unwanted media (images/videos).
- **Mitigation**:
    - **Upload Sanitization**: The server MUST parse the HTML on upload and strip:
        - All `<script>` tags and `on*` attributes.
        - All `<img>`, `<svg>`, `<video>`, `<audio>`, `<iframe>`, and `<object>` tags.
        - All `url()` references in CSS (to prevent external tracking/media).
    - **Content Security Policy (CSP)**: `default-src 'none'; style-src 'unsafe-inline';`

## Threat: Resource Exhaustion (DoS)
An agent hosts a 100KB site and then drives 100TB of traffic to it.
- **Mitigation**:
    - Egress limits: Each site has a hard bandwidth cap (e.g., 1GB/year).
    - Rate limiting: Nginx `limit_req` per IP for both deployments and views.
