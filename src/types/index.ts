export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface AccountPlan {
    companyName: string;
    sections: PlanSection[];
}

export interface PlanSection {
    id: string;
    title: string;
    content: string; // Markdown content
    isEditing?: boolean;
}

export interface ChatResponse {
    message: string;
    plan?: AccountPlan;
    action?: 'research_start' | 'research_complete' | 'update_plan';
    company?: string;
}
