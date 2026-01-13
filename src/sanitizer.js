const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Extremely strict whitelist
const ALLOWED_TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 
    'b', 'i', 'strong', 'em', 'u', 's', 'small', 'code', 'pre',
    'div', 'span', 'blockquote', 'q', 'cite',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'style', 'section', 'article', 'main', 'header', 'footer', 'nav'
];

const ALLOWED_ATTR = ['class', 'id', 'style'];

/**
 * Sanitizes HTML string based on ultra-minimalist MVP rules.
 * @param {string} html 
 * @returns {string} Clean HTML
 */
function sanitize(html) {
    let clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ALLOWED_TAGS,
        ALLOWED_ATTR: ALLOWED_ATTR,
        FORCE_BODY: true,
        ADD_TAGS: ['style'] // Ensure style tags are kept but content sanitized
    });

    // Post-processing to strip url() and other external refs from style content
    // This is a simple regex approach for the MVP
    clean = clean.replace(/url\s*\([^)]*\)/gi, 'none');
    
    // Also remove any remote imports in style tags
    clean = clean.replace(/@import\s+[^;]+;/gi, '');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
    <title>AgentHost Site</title>
</head>
<body>
    ${clean}
</body>
</html>`;
}

module.exports = { sanitize };
