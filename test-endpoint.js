// Simple test to call the Next.js API endpoint
const http = require('http');

const postData = JSON.stringify({
    messages: [{
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: Date.now()
    }],
    currentPlan: null
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Testing Next.js API endpoint...\n');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('\nResponse:');
        try {
            const json = JSON.parse(body);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log(body);
        }
    });
});

req.on('error', (e) => {
    console.error('Request failed:', e.message);
});

req.write(postData);
req.end();
