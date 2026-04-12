import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Send, Check, CheckCheck, User as UserIcon, MessageSquare } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import useChatStore from '../../store/useChatStore';
import useAuthStore from '../../store/useAuthStore';

export default function SellerMessages() {
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
        fetchConversations,
        initSocket,
        loading,
        token
    } = useChatStore();
    
    const { user } = useAuthStore();

    useEffect(() => {
        if (!token) return;
        initSocket(token);
        fetchConversations();
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
        
        await sendMessage(activeConversation._id, currentText, recipientId, 'seller');
    };

    const handleConvClick = (conv) => {
        setActiveConversation(conv);
        navigate(`/seller/messages/${conv._id}`);
    };

    return (
        <SellerLayout>
            <div className="h-[calc(100vh-180px)] flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                
                {/* Conversations List */}
                <div className={`w-full md:w-80 border-r flex flex-col ${conversationId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-black text-gray-900 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search chats..." className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-10 text-center opacity-30">
                                <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                                <p className="text-xs font-bold uppercase">No chats yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const other = conv.participants.find(p => p._id !== user.id) || {};
                                const isActive = conversationId === conv._id;
                                return (
                                    <button 
                                        key={conv._id}
                                        onClick={() => handleConvClick(conv)}
                                        className={`w-full p-4 flex items-center gap-3 border-b border-gray-50 transition-colors ${isActive ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={other.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${other.fullName || 'U'}`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="font-bold text-gray-900 truncate">{other.fullName || 'Shopper'}</h4>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                    {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{conv.lastMessage || 'Start a conversation'}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-[#F9FAFB] ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <header className="p-4 bg-white border-b flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigate('/seller/messages')} className="p-2 md:hidden">
                                        <Search className="w-5 h-5 rotate-90" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                        <img src={activeConversation.otherParticipant?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${activeConversation.otherParticipant?.fullName || 'U'}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{activeConversation.otherParticipant?.fullName || 'Customer'}</h3>
                                        <p className="text-[10px] text-green-600 font-bold uppercase">Customer</p>
                                    </div>
                                </div>
                            </header>

                            {/* Messages */}
                            <div 
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-4"
                            >
                                {messages.map((msg, i) => {
                                    const isMe = msg.senderId === user.id;
                                    return (
                                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                                                isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
                                            }`}>
                                                <p className="leading-relaxed">{msg.message}</p>
                                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start opacity-40'}`}>
                                                    <span className="text-[9px] font-bold">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && (
                                                        msg.read ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="p-4 bg-white border-t flex items-center gap-3">
                                <input 
                                    type="text" 
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    placeholder="Reply to customer..."
                                    className="flex-1 h-12 px-5 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all text-sm font-medium" 
                                />
                                <button 
                                    type="submit"
                                    disabled={!text.trim()}
                                    className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-30"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold">Select a conversation</h3>
                            <p className="text-sm">Choose a customer to start replying</p>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
