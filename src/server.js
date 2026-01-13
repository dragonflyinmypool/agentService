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

// Simple homepage
app.get('/', (req, res) => {
    res.send('<h1>AgentHost API (Test MVP)</h1><p>Agents: Read <a href="/llms.txt">/llms.txt</a> for instructions.</p>');
});

app.listen(PORT, () => {
    console.log(`AgentHost MVP running at ${BASE_URL}`);
});
