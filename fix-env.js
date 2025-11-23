const fs = require('fs');
const path = require('path');

console.log('🔧 Updating .env.local for Gemini Free Tier...\n');

const envPath = path.join(__dirname, '.env.local');

try {
    // Read current .env.local
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Replace NEXT_PUBLIC_GEMINI_API_KEY with GEMINI_API_KEY
    const updatedContent = envContent.replace(
        /NEXT_PUBLIC_GEMINI_API_KEY=/g,
        'GEMINI_API_KEY='
    );

    // Check if any changes were made
    if (envContent === updatedContent) {
        console.log('✅ .env.local already uses GEMINI_API_KEY (no changes needed)');
    } else {
        // Write updated content
        fs.writeFileSync(envPath, updatedContent, 'utf8');
        console.log('✅ Successfully updated .env.local');
        console.log('   Changed: NEXT_PUBLIC_GEMINI_API_KEY → GEMINI_API_KEY\n');
        console.log('⚠️  IMPORTANT: Restart your dev server for changes to take effect:');
        console.log('   1. Stop the server (Ctrl+C)');
        console.log('   2. Run: npm run dev\n');
    }

    // Verify the API key exists
    const match = updatedContent.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1].trim()) {
        console.log('✅ API key found in .env.local');
    } else {
        console.log('❌ No API key found! Please add your Gemini API key to .env.local');
    }

} catch (error) {
    console.error('❌ Error updating .env.local:', error.message);
    console.log('\n📝 Please manually update .env.local:');
    console.log('   Change: NEXT_PUBLIC_GEMINI_API_KEY=your_key');
    console.log('   To:     GEMINI_API_KEY=your_key');
}
