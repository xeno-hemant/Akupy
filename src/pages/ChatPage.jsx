import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical, Check, CheckCheck } from 'lucide-react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';

export default function ChatPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const scrollRef = useRef(null);

    const { 
        conversations, 
        activeConversation, 
        setActiveConversation, 
        messages, 
        sendMessage, 
        loading, 
        fetchConversations,
        initSocket,
        token
    } = useChatStore();
    
    const { user } = useAuthStore();

    useEffect(() => {
        if (!token) return;
        initSocket(token);
        if (conversations.length === 0) fetchConversations();
    }, [token]);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conv = conversations.find(c => c._id === conversationId);
            if (conv) setActiveConversation(conv);
        }
    }, [conversationId, conversations]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !activeConversation) return;

        const recipientId = activeConversation.participants.find(p => p._id !== user.id)?._id;
        const currentText = text;
        setText('');
        
        await sendMessage(activeConversation._id, currentText, recipientId, 'user');
    };

    if (loading && !activeConversation) {
        return <div className="min-h-screen pt-24 text-center">Loading conversation...</div>;
    }

    const otherMember = activeConversation?.otherParticipant || {};
    const shop = otherMember.shopDetail || {};

    return (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col md:static md:h-[calc(100vh-80px)] md:mt-20">
            {/* Header */}
            <header className="p-4 border-b flex items-center gap-3 bg-white shadow-sm z-10">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
                    <img src={shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.name || 'S'}`} alt="" className="w-full h-full object-cover" />
                    {shop.shopStatus !== 'closed' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-black text-gray-900 leading-none">{shop.name || 'Akupy Seller'}</h3>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-green-600 mt-1">
                        {shop.shopStatus === 'closed' ? '🔴 Closed' : '🟢 Online'}
                    </p>
                </div>
                <button className="p-2 text-gray-400">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </header>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F0E8] hide-scrollbar pb-24 md:pb-4"
            >
                {messages.length === 0 && (
                    <div className="text-center py-10 opacity-40">
                        <div className="text-4xl mb-2">💬</div>
                        <p className="text-xs font-bold uppercase tracking-widest">Start your conversation</p>
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === user.id;
                    return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm relative ${
                                    isMe 
                                    ? 'bg-[#E3FFD6] text-gray-800 rounded-tr-none' 
                                    : 'bg-white text-gray-800 rounded-tl-none'
                                }`}
                            >
                                <p className="leading-relaxed">{msg.message}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-[9px] opacity-40 font-bold">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && (
                                        msg.read ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <form 
                onSubmit={handleSend}
                className="p-4 border-t bg-white flex items-center gap-3 sticky bottom-0 md:relative"
            >
                <input 
                    type="text" 
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 h-12 px-5 rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm font-medium"
                />
                <button 
                    type="submit"
                    disabled={!text.trim()}
                    className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 disabled:opacity-50 disabled:scale-100"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
