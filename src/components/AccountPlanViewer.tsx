'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Edit2, Save, X } from 'lucide-react';
import { AccountPlan, PlanSection } from '@/types';
import { cn } from '@/lib/utils';

interface AccountPlanViewerProps {
    plan: AccountPlan | null;
    onUpdateSection: (sectionId: string, newContent: string) => void;
}

export default function AccountPlanViewer({ plan, onUpdateSection }: AccountPlanViewerProps) {
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    if (!plan) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))] p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
                    <Edit2 size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">No Account Plan Yet</h3>
                <p className="text-sm max-w-xs">Start a conversation to research a company and generate an account plan.</p>
            </div>
        );
    }

    const handleStartEdit = (section: PlanSection) => {
        setEditingSection(section.id);
        setEditContent(section.content);
    };

    const handleSaveEdit = (sectionId: string) => {
        onUpdateSection(sectionId, editContent);
        setEditingSection(null);
    };

    const handleCancelEdit = () => {
        setEditingSection(null);
        setEditContent('');
    };

    return (
        <div className="h-full overflow-y-auto bg-[hsl(var(--background))]">
            <div className="max-w-3xl mx-auto p-8 space-y-8">
                <div className="border-b border-[hsl(var(--border))] pb-6">
                    <h1 className="text-3xl font-bold tracking-tight">{plan.companyName}</h1>
                    <p className="text-[hsl(var(--muted-foreground))] mt-2">Strategic Account Plan</p>
                </div>

                <div className="space-y-8">
                    {plan.sections.map((section) => (
                        <div key={section.id} className="group relative border border-[hsl(var(--border))] rounded-xl p-6 bg-[hsl(var(--card))] transition-all hover:shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-[hsl(var(--primary))]">{section.title}</h2>

                                {editingSection !== section.id ? (
                                    <button
                                        onClick={() => handleStartEdit(section)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] rounded-md"
                                        title="Edit Section"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleSaveEdit(section.id)}
                                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-md"
                                            title="Save"
                                        >
                                            <Save size={16} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-md"
                                            title="Cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editingSection === section.id ? (
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full min-h-[200px] p-4 bg-[hsl(var(--muted))] rounded-md border border-[hsl(var(--input))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] font-mono text-sm resize-y"
                                />
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none text-[hsl(var(--card-foreground))]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {section.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
