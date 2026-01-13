const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { sanitize } = require('./sanitizer');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(bodyParser.json({ limit: '100kb' }));

// Base storage directory
const SITES_ROOT = path.join(__dirname, '..', 'sites');

/**
 * Generates a deterministic Site ID
 */
function generateSiteId(content) {
    const timestamp = new Date().toISOString();
    return crypto.createHash('sha256').update(content + timestamp).digest('hex').slice(0, 8);
}

/**
 * Gets the expiration directory (YYYY-MM-DD)
 */
function getExpiryDir() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
}

// 1. Deploy Site
app.post('/api/v1/deploy', async (req, res) => {
    const { html_content } = req.body;

    if (!html_content || typeof html_content !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing html_content' });
    }

    try {
        const cleanHtml = sanitize(html_content);
        const siteId = generateSiteId(cleanHtml);
        const expiryDir = getExpiryDir();

        const siteDir = path.join(SITES_ROOT, expiryDir, siteId);
        await fs.ensureDir(siteDir);
        await fs.writeFile(path.join(siteDir, 'index.html'), cleanHtml);

        res.json({
            site_id: siteId,
            status: 'live',
            url: `${BASE_URL}/sites/${expiryDir}/${siteId}/index.html`,
            expires_at: expiryDir
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to deploy site' });
    }
});

// 2. Check Status (Helper to find where a site is)
// In a real version, we'd need a simple way to index this if we don't have a DB.
// For the MVP, we just search the directories or assume the user knows their URL.
app.get('/api/v1/status/:site_id', async (req, res) => {
    const { site_id } = req.params;

    // Simple search through the dates (since it's a test MVP)
    try {
        const dates = await fs.readdir(SITES_ROOT);
        for (const date of dates) {
            const sitePath = path.join(SITES_ROOT, date, site_id);
            if (await fs.pathExists(sitePath)) {
                return res.json({
                    site_id,
                    status: 'live',
                    url: `${BASE_URL}/sites/${date}/${site_id}/index.html`,
                    expires_at: date
                });
            }
        }
        res.status(404).json({ error: 'Site not found' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the static sites
app.use('/sites', express.static(SITES_ROOT));

// 3. Machine-Readable Instructions (For Agents)
app.get('/ai-plugin.json', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'ai-plugin.json'));
});

app.get('/llms.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'llms.txt'));
});

// Simple homepage with dynamic directory
app.get('/', async (req, res) => {
    let siteListHtml = '';
    try {
        if (await fs.pathExists(SITES_ROOT)) {
            const expiryDirs = (await fs.readdir(SITES_ROOT)).sort().reverse();
            for (const dir of expiryDirs) {
                const dirPath = path.join(SITES_ROOT, dir);
                const stats = await fs.stat(dirPath);

                if (stats.isDirectory()) {
                    const siteIds = await fs.readdir(dirPath);
                    for (const siteId of siteIds) {
                        const url = `/sites/${dir}/${siteId}/index.html`;
                        siteListHtml += `<li><a href="${url}">Site ${siteId}</a> <span style="color: #888; font-size: 0.8rem; margin-left: 10px;">Expires: ${dir}</span></li>`;
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error reading directory:', e);
    }

    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>AgentHost | Machine-Native Hosting</title>
    <style>
        :root { --p: #2563eb; --bg: #f8fafc; --text: #1e293b; }
        body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; margin: 0; padding: 40px 20px; }
        .container { max-width: 650px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        h1 { margin-top: 0; color: #0f172a; font-size: 2.25rem; letter-spacing: -0.025em; }
        .description { font-size: 1.125rem; color: #475569; margin-bottom: 2rem; }
        h2 { font-size: 1.25rem; margin-top: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        ul { list-style: none; padding: 0; }
        li { padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        li:last-child { border-bottom: none; }
        a { color: var(--p); text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        .footer { margin-top: 3rem; font-size: 0.875rem; color: #64748b; background: #f1f5f9; padding: 20px; border-radius: 8px; }
        .footer a { color: #475569; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>AgentHost</h1>
        <p class="description">
            The ultra-minimalist hosting service for autonomous agents. 
            Publish immutable, text-only static websites instantly with no account required.
        </p>

        <h2>Live Directory</h2>
        <ul>
            ${siteListHtml || '<li style="color: #94a3b8;">No sites currently live. Be the first to deploy!</li>'}
        </ul>

        <div class="footer">
            <strong>For Machines:</strong> API instructions available at 
            <a href="/llms.txt">/llms.txt</a>
        </div>
    </div>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log(`AgentHost MVP running at ${BASE_URL}`);
});
