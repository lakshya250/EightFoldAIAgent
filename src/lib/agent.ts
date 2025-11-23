import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, AccountPlan, ChatResponse } from '@/types';

// Initialize Gemini API (server-side only for free tier)
const apiKey = process.env.GEMINI_API_KEY;
// console.log('[Agent Init] API Key status:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');
if (!apiKey) {
    console.error('[Agent Init] ERROR: GEMINI_API_KEY is not set in environment variables');
    console.error('[Agent Init] Available env vars:', Object.keys(process.env).filter(k => k.includes('GEMINI')));
}
const genAI = new GoogleGenerativeAI(apiKey || '');
// Use the latest available model - gemini-2.5-flash is fast and free
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
console.log('[Agent Init] Model initialized: models/gemini-2.5-flash');

export async function processChat(messages: Message[], currentPlan: AccountPlan | null): Promise<ChatResponse> {
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content.toLowerCase();

    // Check for research intent
    if (content.includes('research') || content.includes('analyze') || content.includes('account plan')) {
        // Extract company name (simple heuristic)
        const words = content.split(' ');
        const companyIndex = words.findIndex(w => w.includes('research') || w.includes('analyze') || w.includes('for')) + 1;
        let company = words.slice(companyIndex).join(' ').replace(/[?.!]/g, '').trim();

        // Fallback if company name is not obvious, try to find capitalized words in original content
        if (!company || company.length < 2) {
            const match = lastMessage.content.match(/research\s+([A-Z][a-zA-Z0-9\s]+)/i);
            if (match) company = match[1];
        }

        if (company) {
            return {
                message: `I'll start researching ${company} for you using the Gemini API. This involves gathering real-time insights and generating a strategic account plan.`,
                action: 'research_start',
                company: company
            };
        }
    }

    // Default conversation using Gemini
    try {
        console.log("inside try for sending or messaging")
        console.log(messages)
        const chat = model.startChat({
            history: messages.slice(0, -1).map(m => ({
                role: 'user',
                parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(lastMessage.content);
        const response = await result.response;
        const text = response.text();

        return {
            message: text
        };
    } catch (error: any) {
        console.error('Error details:', {
            message: error?.message,
            status: error?.status,
            statusText: error?.statusText
        });
        return {
            message: "I'm having trouble connecting to Gemini right now. Please make sure your API key is configured."
        };
    }
}

export async function performResearch(company: string): Promise<ChatResponse> {
    console.log("preforming research")
    try {
        console.log("inside try block")
        const prompt = `
      Act as a senior strategic account manager. Conduct a comprehensive research on "${company}" and generate a strategic account plan.
      
      Return the response in the following JSON format ONLY (no markdown code blocks):
      {
        "companyName": "${company}",
        "sections": [
          {
            "id": "overview",
            "title": "Company Overview",
            "content": "Detailed overview of the company, its mission, and recent performance."
          },
          {
            "id": "strategy",
            "title": "Strategic Priorities",
            "content": "Key strategic initiatives and goals for the next 1-3 years."
          },
          {
            "id": "opportunities",
            "title": "Key Opportunities",
            "content": "Specific opportunities for partnership or sales."
          },
          {
            "id": "risks",
            "title": "Potential Risks",
            "content": "Risks associated with this account."
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown formatting from JSON response
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const plan: AccountPlan = JSON.parse(jsonString);

        return {
            message: `I've completed the research for ${company} using Gemini. Here is the strategic account plan based on the latest insights.`,
            plan: plan,
            action: 'research_complete'
        };
    } catch (error: any) {
        console.error('Gemini Research Error:', error);
        console.error('Error details:', {
            message: error?.message,
            status: error?.status,
            statusText: error?.statusText
        });
        return {
            message: "I encountered an error while researching. Please check your API key and try again."
        };
    }
}
