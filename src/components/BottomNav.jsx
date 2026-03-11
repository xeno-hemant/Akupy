import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3x3, ShoppingCart, User, Plus, Shirt, Shield, Bot } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';

const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: Home, path: '/shop' },
    { id: 'categories', label: 'Categories', icon: Grid3x3, path: '/discover' },
    { id: 'fab', label: '', icon: Plus, isFab: true },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard' },
];

export default function BottomNav() {
    const { user } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const { getTotalItems } = useCartStore();
    const { isIncognitoActive } = useFeatureStore();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Dynamically adjust profile path
    const items = NAV_ITEMS.map(item =>
        item.id === 'profile'
            ? { ...item, path: (user?.role === 'seller' || location.pathname === '/sell') ? '/seller/dashboard' : '/dashboard' }
            : item
    );

    const isActive = (path) => path && location.pathname === path;

    const handleAction = (id) => {
        setIsMenuOpen(false);
        if (id === 'tryon') window.dispatchEvent(new CustomEvent('open-tryon-modal'));
        if (id === 'incognito') {
            window.dispatchEvent(new CustomEvent('toggle-incognito'));
        }
        if (id === 'ai') window.dispatchEvent(new CustomEvent('open-ai-chat'));
    };

    const FAB_ACTIONS = [
        { id: 'tryon', label: 'Try-On', icon: Shirt, angle: 150 }, // Left-top
        { id: 'incognito', label: 'Incognito', icon: Shield, angle: 90, active: isIncognitoActive }, // Top
        { id: 'ai', label: 'Assistant', icon: Bot, angle: 30 }, // Right-top
    ];

    return (
        <>
            {/* Backdrop Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-[998] bg-[#0A0F1E]/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Radial Menu Buttons */}
            <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-[999] pointer-events-none transition-all duration-500 xl:hidden ${isMenuOpen ? 'opacity-100 scale-100 translate-y-[-80px]' : 'opacity-0 scale-50 translate-y-0'
                }`}>
                <div className="relative w-72 h-48">
                    {/* Dark Navy Semicircle Backdrop */}
                    <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-80 h-48 bg-[#0A192F] rounded-t-full shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/5" />

                    {FAB_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        const radius = 120;
                        const radian = (action.angle * Math.PI) / 180;
                        const x = Math.cos(radian) * radius;
                        const y = Math.sin(radian) * radius;

                        return (
                            <div
                                key={action.id}
                                className="absolute bottom-0 left-1/2 pointer-events-auto"
                                style={{
                                    transform: `translate(calc(-50% + ${x}px), ${-y}px)`,
                                }}
                            >
                                <button
                                    onClick={() => handleAction(action.id)}
                                    className={`flex flex-col items-center gap-2 group transition-all duration-300 hover:scale-110 active:scale-95`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-2 transition-colors ${action.active ? 'bg-[#22C55E] border-[#22C55E]' : 'bg-white border-transparent'
                                        }`}>
                                        <Icon
                                            size={28}
                                            className={action.active ? 'text-white' : 'text-[#1A1A1A]'}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-white tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md">
                                        {action.label}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <nav
                className="fixed bottom-0 left-0 w-full z-[1000] xl:hidden"
                style={{
                    background: '#FFFFFF',
                    borderTop: '1px solid #F3F4F6',
                    boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
                }}
            >
                <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto h-[75px] relative">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        if (item.isFab) {
                            return (
                                <div key={item.id} className="w-16 h-16 flex-shrink-0 relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="absolute left-1/2 -translate-x-1/2 -translate-y-8 flex items-center justify-center w-16 h-16 rounded-full bg-[#22C55E] text-white shadow-[0_8px_25px_rgba(34,197,94,0.4)] border-4 border-white transition-all duration-500 hover:scale-110 active:scale-95 z-[1001]"
                                        style={{ transform: `translate(-50%, -12px) rotate(${isMenuOpen ? '135deg' : '0deg'})` }}
                                    >
                                        <Plus className="w-8 h-8" />
                                    </button>
                                </div>
                            );
                        }

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
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
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

