// Test the research endpoint
const http = require('http');

const postData = JSON.stringify({
    company: 'Microsoft'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/research',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Testing Research API endpoint...\n');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('\nResponse:');
        try {
            const json = JSON.parse(body);
            console.log('Message:', json.message);
            if (json.plan) {
                console.log('\n✅ Account Plan Generated!');
                console.log('Company:', json.plan.companyName);
                console.log('Sections:', json.plan.sections.length);
                json.plan.sections.forEach(s => {
                    console.log(`  - ${s.title}`);
                });
            }
        } catch (e) {
            console.log(body.substring(0, 500));
        }
    });
});

req.on('error', (e) => {
    console.error('Request failed:', e.message);
});

req.write(postData);
req.end();
