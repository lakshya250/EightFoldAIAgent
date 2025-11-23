const fs = require('fs');
const path = require('path');

async function testAPI() {
    try {
        // Read API key from .env.local
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("❌ API Key not found in .env.local");
            return;
        }

        console.log("✅ API Key found:", apiKey.substring(0, 10) + "...");

        // Test Gemini API directly
        const { GoogleGenerativeAI } = require('@google/generative-ai');

        console.log("\n🧪 Testing Gemini API directly...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

        const result = await model.generateContent("What is AI in one sentence?");
        const response = await result.response;
        const text = response.text();

        console.log("✅ Direct API Test SUCCESS!");
        console.log("Response:", text);

        // Test via Next.js API route
        console.log("\n🧪 Testing Next.js API route...");
        const fetch = require('node-fetch');

        const apiResponse = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{
                    id: '1',
                    role: 'user',
                    content: 'What is AI?',
                    timestamp: Date.now()
                }]
            })
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("❌ API Route Error:", apiResponse.status);
            console.error("Error details:", errorText);
        } else {
            const data = await apiResponse.json();
            console.log("✅ API Route Test SUCCESS!");
            console.log("Response:", data.message);
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Full error:", error);
        if (error.response) {
            console.error("Response:", await error.response.text());
        }
    }
}

testAPI();
