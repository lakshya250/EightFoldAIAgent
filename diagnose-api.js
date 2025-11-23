const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function diagnoseAPI() {
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

        console.log("API Key format check:");
        console.log("- Length:", apiKey.length);
        console.log("- Starts with 'AIza':", apiKey.startsWith('AIza'));
        console.log("- First 15 chars:", apiKey.substring(0, 15));

        // Try different model names
        const models = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'models/gemini-pro'];

        for (const modelName of models) {
            console.log(`\n🧪 Testing model: ${modelName}`);
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent("Say 'Hello'");
                const response = await result.response;
                const text = response.text();

                console.log(`✅ SUCCESS with ${modelName}!`);
                console.log("Response:", text);
                break;
            } catch (error) {
                console.log(`❌ Failed with ${modelName}:`, error.status, error.statusText);
                if (error.errorDetails) {
                    console.log("Details:", error.errorDetails);
                }
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

diagnoseAPI();
