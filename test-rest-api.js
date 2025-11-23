const fs = require('fs');
const path = require('path');
const https = require('https');

async function testRestAPI() {
    try {
        // Read API key
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("❌ No API key found");
            return;
        }

        console.log("Testing Gemini API via REST...\n");
        console.log("API Key:", apiKey.substring(0, 15) + "...\n");

        // Test 1: Try to list models (this should work if API is enabled)
        console.log("🧪 Test 1: Listing available models...");
        await testEndpoint(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            'GET'
        );

        // Test 2: Try generateContent with gemini-pro
        console.log("\n🧪 Test 2: Testing gemini-pro model...");
        await testGenerateContent(apiKey, 'gemini-pro');

        // Test 3: Try gemini-1.5-flash
        console.log("\n🧪 Test 3: Testing gemini-1.5-flash model...");
        await testGenerateContent(apiKey, 'gemini-1.5-flash');

    } catch (error) {
        console.error("Error:", error.message);
    }
}

function testEndpoint(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode} ${res.statusMessage}`);

                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        if (json.models) {
                            console.log(`✅ SUCCESS! Found ${json.models.length} models:`);
                            json.models.slice(0, 5).forEach(m => {
                                console.log(`   - ${m.name}`);
                            });
                        } else {
                            console.log("✅ Response:", body.substring(0, 200));
                        }
                    } catch (e) {
                        console.log("✅ Response:", body.substring(0, 200));
                    }
                } else {
                    console.log("❌ Error response:", body);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error("❌ Request failed:", e.message);
            reject(e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testGenerateContent(apiKey, modelName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const postData = JSON.stringify({
            contents: [{
                parts: [{
                    text: "Say hello in one word"
                }]
            }]
        });

        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode} ${res.statusMessage}`);

                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                        console.log(`✅ SUCCESS! Response: ${text}`);
                    } catch (e) {
                        console.log("✅ Got response:", body.substring(0, 200));
                    }
                } else {
                    console.log("❌ Error response:", body);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error("❌ Request failed:", e.message);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

testRestAPI();
