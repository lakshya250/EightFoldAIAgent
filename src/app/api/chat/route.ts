import { NextResponse } from 'next/server';
import { processChat } from '@/lib/agent';

export async function POST(req: Request) {
    try {
        // console.log('[Chat Route] Received request');
        const body = await req.json();
        // console.log('[Chat Route] Parsed body:', JSON.stringify(body).substring(0, 100));

        const { messages, currentPlan } = body;
        // console.log('[Chat Route] Messages count:', messages?.length);

        const response = await processChat(messages, currentPlan);
        // console.log('[Chat Route] Got response from processChat');

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('[Chat Route] Error:', error.message);
        console.error('[Chat Route] Error stack:', error.stack);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message
        }, { status: 500 });
    }
}
