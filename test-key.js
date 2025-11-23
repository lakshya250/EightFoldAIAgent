const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("API Key not found in .env.local");
            return;
        }

        if (!responseGen.ok) {
            console.error("Generate Error Status:", responseGen.status);
            console.error("Generate Error Text:", responseGen.statusText);
            const errText = await responseGen.text();
            console.error("Generate Error Body:", errText);
        } else {
            const dataGen = await responseGen.json();
            console.log("Generate Success:", JSON.stringify(dataGen, null, 2));
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

test();
