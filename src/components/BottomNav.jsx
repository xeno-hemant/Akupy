import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3x3, ShoppingCart, User, Globe, EyeOff, Bot } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Home, path: '/shop' },
    { id: 'categories', label: 'Categories', icon: Grid3x3, path: '/discover' },
    { id: 'fab', label: '', icon: null, path: null }, // FAB placeholder
    { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard' },
];

const FAB_ACTIONS = [
    {
        id: 'tryon',
        label: '3D Try-On',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
        ),
        angle: 210, // left
    },
    {
        id: 'incognito',
        label: 'Incognito',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
        ),
        angle: 270, // top center
    },
    {
        id: 'ai',
        label: 'AI Assistant',
        icon: () => (
            <div className="flex flex-col items-center leading-none">
                <span className="text-xs font-black" style={{ color: '#22C55E' }}>AI</span>
                <span className="w-1 h-1 rounded-full bg-[#22C55E] mt-0.5"></span>
            </div>
        ),
        angle: 330, // right
    },
];

export default function BottomNav() {
    const [fabOpen, setFabOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { getTotalItems } = useCartStore();

    const isActive = (path) => path && location.pathname === path;

    const handleFabAction = (action) => {
        setFabOpen(false);
        if (action.id === 'tryon') navigate('/wardrobe');
        if (action.id === 'incognito') {
            window.dispatchEvent(new CustomEvent('toggle-incognito'));
        }
        if (action.id === 'ai') window.dispatchEvent(new CustomEvent('open-ai-chat'));
    };

    // Calculate positions for radial arc (semicircle upward)
    const getPosition = (angle) => {
        const radius = 72;
        const rad = (angle * Math.PI) / 180;
        return {
            x: Math.cos(rad) * radius,
            y: -Math.sin(rad) * radius, // negative because y increases downward
        };
    };

    return (
        <>
            {/* FAB Backdrop */}
            {fabOpen && (
                <div
                    className="fixed inset-0 z-[998]"
                    style={{
                        background: 'rgba(44, 42, 39, 0.85)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={() => setFabOpen(false)}
                />
            )}

            {/* FAB Radial Menu */}
            {fabOpen && (
                <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
                    {FAB_ACTIONS.map((action, i) => {
                        const pos = getPosition(action.angle);
                        return (
                            <button
                                key={action.id}
                                className="absolute flex flex-col items-center gap-1.5 pointer-events-auto"
                                style={{
                                    left: `calc(50% + ${pos.x}px - 28px)`,
                                    top: `calc(50% + ${pos.y}px - 28px)`,
                                    width: 56,
                                    height: 56,
                                    animation: `bounceIn 0.${3 + i}s cubic-bezier(0.68,-0.55,0.265,1.55) both`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                                onClick={() => handleFabAction(action)}
                            >
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ background: '#FFFFFF', color: '#1A1A1A', border: '2px solid #22C55E' }}
                                >
                                    <action.icon />
                                </div>
                                <span
                                    className="text-[10px] font-bold text-center whitespace-nowrap"
                                    style={{ color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                                >
                                    {action.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Bottom Nav Bar — only visible below 1200px */}
            <nav
                className="fixed bottom-0 left-0 w-full z-[997] xl:hidden"
                style={{
                    background: '#FFFFFF',
                    borderTop: '1px solid #F3F4F6',
                    boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
                }}
            >
                <div className="flex items-end justify-around px-2 py-2 max-w-lg mx-auto h-[70px]">
                    {NAV_ITEMS.map((item) => {
                        if (item.id === 'fab') {
                            return (
                                <button
                                    key="fab"
                                    onClick={() => setFabOpen(prev => !prev)}
                                    className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all active:scale-95 -mt-5"
                                    style={{
                                        background: fabOpen
                                            ? '#16A34A'
                                            : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                                        boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
                                        transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                        transition: 'all 0.3s cubic-bezier(0.68,-0.55,0.265,1.55)'
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-6 h-6">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                            );
                        }

                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.id}
                                onClick={() => item.path && navigate(item.path)}
                                className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all relative"
                                style={{ color: active ? '#22C55E' : '#6B7280', minWidth: 44, minHeight: 44 }}
                            >
                                <div className="relative">
                                    <Icon className="w-5 h-5" />
                                    {item.id === 'cart' && getTotalItems() > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#22C55E] text-white">
                                            {getTotalItems()}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-semibold">{item.label}</span>
                                {active && (
                                    <span
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                        style={{ background: '#22C55E' }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
