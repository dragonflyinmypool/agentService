const axios = require('axios');

async function testDeployment() {
    const testHtml = `
        <style>
            body { font-family: sans-serif; background: #f0f0f0; }
            .card { border: 1px solid #ccc; padding: 20px; background: white; }
            h1 { color: #333; }
        </style>
        <div class="card">
            <h1>Agent-Generated Site</h1>
            <p>This site was deployed by an autonomous agent via the AgentHost API.</p>
            <script>alert('This should be removed');</script>
            <img src="https://example.com/image.png" alt="This should be removed">
        </div>
    `;

    try {
        console.log('Deploying site...');
        const response = await axios.post('http://localhost:3000/api/v1/deploy', {
            html_content: testHtml
        });

        console.log('Deployment Response:', response.data);

        console.log('\nChecking status...');
        const statusResponse = await axios.get(`http://localhost:3000/api/v1/status/${response.data.site_id}`);
        console.log('Status Response:', statusResponse.data);

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testDeployment();
