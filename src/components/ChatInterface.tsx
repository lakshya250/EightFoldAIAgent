'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    onClearChat?: () => void;
    isTyping?: boolean;
}

export default function ChatInterface({ messages, onSendMessage, onClearChat, isTyping }: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-[hsl(var(--card))] border-r border-[hsl(var(--border))]">
            {/* Header */}
            <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))]">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">Research Assistant</h2>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Online</p>
                    </div>
                </div>
                {onClearChat && (
                    <button
                        onClick={onClearChat}
                        className="text-xs px-3 py-1.5 rounded-md bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] transition-colors"
                        title="Clear chat history"
                    >
                        Clear Chat
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[80%] animate-fade-in",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user'
                                ? "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
                                : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                        )}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-tr-sm"
                                : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-tl-sm"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 max-w-[80%] animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center shrink-0 text-[hsl(var(--primary-foreground))]">
                            <Bot size={16} />
                        </div>
                        <div className="bg-[hsl(var(--muted))] p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[hsl(var(--border))]">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a company..."
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--input))] rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
