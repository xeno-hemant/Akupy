import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Info, CheckCheck, Check } from 'lucide-react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';

export default function ChatPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        sendMessage,
        loading,
        fetchConversations,
        initSocket,
    } = useChatStore();

    const { user, token } = useAuthStore();

    // Init socket & fetch conversations
    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        initSocket(token);
        if (conversations.length === 0) fetchConversations();
    }, [token]);

    // Set active conversation from URL param
    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conv = conversations.find(c => c._id === conversationId);
            if (conv) setActiveConversation(conv);
        }
    }, [conversationId, conversations]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!text.trim() || !activeConversation) return;
        const currentText = text.trim();
        setText('');
        inputRef.current?.focus();
        const recipientId = activeConversation.participants?.find(p => p._id !== user?.id && p._id !== user?._id)?._id;
        await sendMessage(activeConversation._id, currentText, recipientId, 'user');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const shop = activeConversation?.otherParticipant?.shopDetail || {};
    const sellerName = shop.ownerName || shop.name || activeConversation?.otherParticipant?.fullName || 'Seller';
    const shopName = shop.name || '';
    const avatarSeed = shop.name || sellerName || 'A';
    const avatarUrl = shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=22c55e&fontColor=ffffff`;
    const isOnline = shop.shopStatus !== 'closed';

    const formatTime = (ts) => {
        if (!ts) return '';
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, msg) => {
        const date = formatDate(msg.createdAt);
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});

    const myId = user?.id || user?._id;

    if (loading && !activeConversation) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center" style={{ paddingTop: '80px' }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm font-medium">Loading conversation...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 flex flex-col"
            style={{ paddingTop: '0px', zIndex: 60, background: '#E5DDD5' }}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center gap-3 px-3 py-2 flex-shrink-0"
                style={{
                    background: '#128C7E',
                    minHeight: '60px',
                    paddingTop: 'max(env(safe-area-inset-top), 12px)',
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors flex-shrink-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative flex-shrink-0">
                    <img
                        src={avatarUrl}
                        alt={sellerName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                        onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=075E54&fontColor=ffffff`; }}
                    />
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-[15px] leading-tight truncate">{sellerName}</h3>
                    <p className="text-green-100 text-xs truncate">
                        {shopName ? `${shopName} • ` : ''}{isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    {shop.phone && (
                        <a
                            href={`tel:${shop.phone}`}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                        </a>
                    )}
                    <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* ── Shop Info Bar (if owner name / contact available) ── */}
            {(shop.ownerName || shop.phone || shop.email) && (
                <div
                    className="flex items-center gap-2 px-4 py-2 text-xs flex-shrink-0"
                    style={{ background: '#FFF3E0', borderBottom: '1px solid #FFE0B2' }}
                >
                    <span className="text-orange-700 font-semibold">
                        📋 Owner: {shop.ownerName || sellerName}
                        {shop.phone ? ` · ${shop.phone}` : ''}
                    </span>
                </div>
            )}

            {/* ── Messages Area ── */}
            <div
                className="flex-1 overflow-y-auto px-3 py-2"
                style={{
                    background: '#E5DDD5',
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' opacity='0.05'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3C/svg%3E\")",
                    paddingBottom: '12px',
                }}
            >
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block bg-[#FFF9C4] text-gray-600 text-xs px-4 py-2 rounded-full font-semibold shadow-sm">
                            👋 Start the conversation with {sellerName}
                        </div>
                    </div>
                )}

                {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                        {/* Date Divider */}
                        <div className="flex justify-center my-3">
                            <span className="bg-[#E0F2F1] text-teal-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                                {date}
                            </span>
                        </div>

                        {msgs.map((msg, i) => {
                            const isMe = msg.senderId === myId || msg.senderId?.toString() === myId?.toString();
                            const showAvatar = !isMe && (i === 0 || msgs[i - 1]?.senderId?.toString() !== msg.senderId?.toString());

                            return (
                                <div key={msg._id || i} className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    {/* Avatar placeholder for alignment */}
                                    {!isMe && (
                                        <div className="w-8 flex-shrink-0" />
                                    )}

                                    <div
                                        className="max-w-[80%] sm:max-w-[65%] relative"
                                        style={{
                                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.13))',
                                        }}
                                    >
                                        {/* Message bubble */}
                                        <div
                                            className="py-1.5 px-3 text-sm leading-relaxed break-words"
                                            style={{
                                                background: isMe ? '#DCF8C6' : '#FFFFFF',
                                                borderRadius: isMe
                                                    ? '12px 12px 4px 12px'
                                                    : '12px 12px 12px 4px',
                                                color: '#1A1A1A',
                                            }}
                                        >
                                            <p style={{ wordBreak: 'break-word' }}>{msg.message}</p>
                                            <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-end'}`}>
                                                <span className="text-[10px] text-gray-400 select-none">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                                {isMe && (
                                                    msg.read
                                                        ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                                        : <Check className="w-3.5 h-3.5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div
                className="flex items-end gap-2 px-3 py-2 flex-shrink-0"
                style={{
                    background: '#F0F0F0',
                    paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
                    minHeight: '56px',
                }}
            >
                <div
                    className="flex-1 flex items-end rounded-3xl overflow-hidden"
                    style={{ background: '#FFFFFF', minHeight: '44px' }}
                >
                    <textarea
                        ref={inputRef}
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                            // Auto resize
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 text-sm outline-none resize-none"
                        style={{
                            background: 'transparent',
                            color: '#1A1A1A',
                            maxHeight: '120px',
                            lineHeight: '1.4',
                        }}
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                    style={{
                        background: text.trim() ? '#128C7E' : '#9CA3AF',
                        color: '#FFFFFF',
                    }}
                >
                    <Send className="w-5 h-5" style={{ transform: 'rotate(0deg)' }} />
                </button>
            </div>
        </div>
    );
}
