import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

export default function AiAssistantDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hey there! I am your Akupy Shopping Assistant. What are you looking for today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-ai-chat', handleOpen);
        return () => window.removeEventListener('open-ai-chat', handleOpen);
    }, []);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo('.ai-drawer',
                { x: '100%' },
                { x: '0%', duration: 0.5, ease: 'power3.out' }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const close = () => {
        gsap.to('.ai-drawer', {
            x: '100%',
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => setIsOpen(false)
        });
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post(API.AI_CHAT, { message: currentInput });
            const data = res.data;
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: data.reply,
                recommendations: data.recommendations
            }]);
        } catch (error) {
            console.error("AI Chat error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10002] flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={close} />

            <div className="ai-drawer w-full max-w-md h-full bg-white shadow-2xl flex flex-col relative z-10 transition-transform">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#1A1A1A] text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-heading font-bold text-lg leading-tight">🤖 akupy AI Assistant</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={close} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#F8F9FA]">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-[#1A1A1A] text-white rounded-tr-none'
                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.text}

                                {msg.recommendations && msg.recommendations.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 gap-3">
                                        {msg.recommendations.map((prod) => (
                                            <div key={prod.id} className="bg-white rounded-xl p-3 border border-gray-100 flex gap-3 shadow-sm hover:border-[#22C55E]/30 transition-all">
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                    {prod.image && <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-bold text-sm text-[#1A1A1A] truncate">{prod.name}</h4>
                                                    <p className="text-[#22C55E] font-bold text-sm">₹{prod.price}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium truncate">Sold by {prod.shopName}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] p-4 rounded-2xl text-sm bg-white text-gray-400 shadow-sm border border-gray-100 rounded-tl-none flex items-center gap-2">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce [animation-delay:0.2s]">●</span>
                                <span className="animate-bounce [animation-delay:0.4s]">●</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 p-1.5 bg-[#F3F4F6] rounded-full focus-within:ring-2 ring-[#22C55E]/20 transition-all shadow-inner">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything about shopping..."
                            className="flex-grow bg-transparent border-none focus:outline-none px-4 text-sm font-medium"
                        />
                        <button
                            onClick={handleSend}
                            className="w-10 h-10 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#22C55E]/30"
                        >
                            <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-4">
                        <Sparkles className="w-3 h-3 text-[#22C55E]" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Akupy AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
