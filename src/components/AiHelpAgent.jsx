import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Mail, MessageSquare } from 'lucide-react';

export default function AiHelpAgent({ onClose }) {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm Akupy AI. How can I assist you today? Whether you're a shopper or a seller, I'm here to help." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Logic
        setTimeout(() => {
            let response = "";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
                response = "You can track your orders in the 'My Orders' section of your dashboard. If you don't see your order there, it might still be processing.";
            } else if (lowerMsg.includes('seller') || lowerMsg.includes('sell')) {
                response = "To start selling, register as a business. You'll then get access to a powerful dashboard to list products and manage orders.";
            } else if (lowerMsg.includes('payment') || lowerMsg.includes('refund')) {
                response = "Payments are processed securely via our gateway. For refund requests, please go to the order details page and click 'Request Refund'.";
            } else if (lowerMsg.includes('login') || lowerMsg.includes('password')) {
                response = "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link on the login page.";
            } else {
                response = "I'm not quite sure about that. Let me connect you with our support team. You can reach us at xeno.hemant@gmail.com for direct assistance.";
            }

            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
                {/* Header */}
                <div className="p-4 md:p-6 flex items-center justify-between border-b" style={{ background: '#F8FAFC' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-white">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#0F172A]">Akupy Support AI</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Always Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F8FAFC] hide-scrollbar">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-[#22C55E] text-white rounded-tr-none' 
                                : 'bg-white text-[#1E293B] rounded-tl-none border border-gray-100'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-12 pl-4 pr-12 rounded-xl border transition-all text-sm outline-none"
                            style={{ background: '#F1F5F9', borderColor: '#E2E8F0' }}
                            onFocus={e => e.target.style.borderColor = '#22C55E'}
                            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#22C55E] text-white shadow-lg active:scale-95 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-[#94A3B8] uppercase px-1">
                        <span>Email Support: xeno.hemant@gmail.com</span>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Live Chat
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
