# Constraints

## Content Constraints
- **Single HTML file only**: Exactly one `index.html` file provided as a string.
- **Text & CSS only**: No images, videos, audio, or fonts (even if Base64 encoded).
- **No JavaScript**: All `<script>` tags and inline handlers will be stripped.
- **No external assets**: No links to external CSS or JS.
- **Size Limit**: 100 KB total payload size.

## Operational Constraints
- **One-time upload**: Files must be sent in a single batch.
- **No edits after submission**: The site is final once deployed.
- **No renewals or extensions**: The 365-day limit is hard.
- **No custom domains**: All sites are hosted on subpaths or generated subdomains.
- **No support or recovery**: If files are lost or the URL is forgotten, there is no recovery mechanism.

## Limits
- **Hard file size limit**: 100 KB.
- **Hard expiration at 365 days**: Total lifetime is exactly one year.
- **Hard deletion after expiry**: Data is wiped immediately upon expiration.
- **Zero Media Policy**: No `<img>`, `<svg>`, `<video>`, or `<audio>` tags allowed.
