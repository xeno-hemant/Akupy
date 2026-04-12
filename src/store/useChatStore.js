import { create } from 'zustand';
import { io } from 'socket.io-client';
import api from '../utils/apiHelper';
import API from '../config/apiRoutes';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE = SOCKET_URL.endsWith('/') ? SOCKET_URL.slice(0, -1) : SOCKET_URL;

const useChatStore = create((set, get) => ({
    socket: null,
    conversations: [],
    activeConversation: null,
    messages: [],
    unreadTotal: 0,
    loading: false,

    initSocket: (token) => {
        if (get().socket) return;
        const socket = io(SOCKET_URL, {
            auth: { token }
        });

        socket.on('connect', () => console.log('Chat Socket Connected'));
        
        socket.on('new_message', (data) => {
            const { activeConversation, messages } = get();
            if (activeConversation && activeConversation._id === data.conversationId) {
                set({ messages: [...messages, data] });
            } else {
                // Update unread count for the conversation
                get().fetchConversations();
            }
        });

        socket.on('notification', (data) => {
            // Trigger global toast if needed
            window.dispatchEvent(new CustomEvent('chat-notification', { detail: data }));
            set(state => ({ unreadTotal: state.unreadTotal + 1 }));
        });

        set({ socket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    fetchConversations: async () => {
        set({ loading: true });
        try {
            const res = await api.get(`${BASE}/api/v1/chat/conversations`);
            if (res.data.success) {
                set({ conversations: res.data.conversations });
            }
        } catch (err) {
            console.error("Fetch conversations failed", err);
        } finally {
            set({ loading: false });
        }
    },

    setActiveConversation: (conv) => {
        set({ activeConversation: conv, messages: [] });
        if (conv && get().socket) {
            get().socket.emit('join_conversation', conv._id);
            get().fetchMessages(conv._id);
        }
    },

    fetchMessages: async (conversationId) => {
        try {
            const res = await api.get(`${BASE}/api/v1/chat/${conversationId}/messages`);
            if (res.data.success) {
                set({ messages: res.data.messages });
            }
        } catch (err) {
            console.error("Fetch messages failed", err);
        }
    },

    sendMessage: async (conversationId, text, recipientId, senderType) => {
        try {
            const res = await api.post(`${BASE}/api/v1/chat/${conversationId}/send`, { message: text });
            if (res.data.success) {
                const newMessage = res.data.message;
                set(state => ({ messages: [...state.messages, newMessage] }));
                
                if (get().socket) {
                    get().socket.emit('send_message', {
                        conversationId,
                        message: text,
                        recipientId,
                        senderType
                    });
                }
                return true;
            }
        } catch (err) {
            console.error("Send message failed", err);
            return false;
        }
    },

    startChatWithSeller: async (sellerId) => {
        try {
            const res = await api.post(`${BASE}/api/v1/chat/start`, { sellerId });
            if (res.data.success) {
                return res.data.conversationId;
            }
        } catch (err) {
            console.error("Start chat failed", err);
        }
        return null;
    }
}));

export default useChatStore;
