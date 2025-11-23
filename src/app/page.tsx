'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import AccountPlanViewer from '@/components/AccountPlanViewer';
import { Message, AccountPlan } from '@/types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hello! I\'m your Company Research Assistant powered by Gemini AI. I can help you:\n\n• Research any company (just say "Research [Company Name]")\n• Answer questions about companies, products, and markets\n• Generate strategic account plans\n\nWhat would you like to know?',
      timestamp: Date.now(),
    },
  ]);
  const [accountPlan, setAccountPlan] = useState<AccountPlan | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentPlan: accountPlan
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();

      // Add assistant message
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Update plan if provided
      if (data.plan) {
        setAccountPlan(data.plan);
      }

      // Handle actions
      if (data.action === 'research_start' && data.company) {
        await handleResearch(data.company);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResearch = async (company: string) => {
    setIsTyping(true);
    try {
      // Simulate delay for "research"
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) throw new Error('Failed to research');

      const data = await response.json();

      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }]);

      if (data.plan) {
        setAccountPlan(data.plan);
      }
    } catch (error) {
      console.error('Error researching:', error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I couldn't complete the research. Please try again.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUpdateSection = (sectionId: string, newContent: string) => {
    if (!accountPlan) return;

    setAccountPlan({
      ...accountPlan,
      sections: accountPlan.sections.map((section) =>
        section.id === sectionId ? { ...section, content: newContent } : section
      ),
    });
  };

  const handleClearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: '👋 Hello! I\'m your Company Research Assistant powered by Gemini AI. I can help you:\n\n• Research any company (just say "Research [Company Name]")\n• Answer questions about companies, products, and markets\n• Generate strategic account plans\n\nWhat would you like to know?',
      timestamp: Date.now(),
    }]);
    setAccountPlan(null);
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[hsl(var(--background))]">
      {/* Left Panel: Chat */}
      <div className="w-[450px] shrink-0 h-full border-r border-[hsl(var(--border))]">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          isTyping={isTyping}
        />
      </div>

      {/* Right Panel: Account Plan */}
      <div className="flex-1 h-full overflow-hidden">
        <AccountPlanViewer
          plan={accountPlan}
          onUpdateSection={handleUpdateSection}
        />
      </div>
    </main>
  );
}
