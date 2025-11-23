import { NextResponse } from 'next/server';
import { performResearch } from '@/lib/agent';

export async function POST(req: Request) {
    try {
        const { company } = await req.json();
        const response = await performResearch(company);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in research route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
