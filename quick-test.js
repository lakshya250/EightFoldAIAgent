const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function quickTest() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("❌ No API key found in .env.local");
            return;
        }

        console.log("🧪 Quick Gemini API Test\n");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

        console.log("Asking: 'What is AI in one sentence?'");
        const result = await model.generateContent("What is AI in one sentence?");
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS!");
        console.log("Response:", text);
        console.log("\n🎉 Your Gemini API is working correctly!");

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        if (error.status) {
            console.error("Status:", error.status, error.statusText);
        }
    }
}

quickTest();
