const axios = require('axios');

async function testDeployment() {
    const testHtml = `
        <style>
            body { font-family: sans-serif; background: #e0f7fa; }
            .card { border: 2px solid #00796b; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #004d40; }
        </style>
        <div class="card">
            <h1>Remote Deployment Successful!</h1>
            <p>This site was deployed to the Hetzner server from a remote machine.</p>
        </div>
    `;

    const REMOTE_IP = '157.180.95.179';

    try {
        console.log(`Deploying site to http://${REMOTE_IP}...`);
        const response = await axios.post(`http://${REMOTE_IP}/api/v1/deploy`, {
            html_content: testHtml
        });

        console.log('Deployment Response:', response.data);

        console.log('\nChecking status...');
        const statusResponse = await axios.get(`http://${REMOTE_IP}/api/v1/status/${response.data.site_id}`);
        console.log('Status Response:', statusResponse.data);
        console.log(`\nView your site at: ${response.data.url}`);

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testDeployment();
