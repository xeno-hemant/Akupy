import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Tag, Warehouse, Store, Gift, Star, Users,
    DollarSign, Landmark, Receipt, Settings, Bell, Headphones, ChevronRight,
    LogOut, X, BarChart2, Package, Wrench, MessageCircle, Megaphone
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const NAVY = '#1A1A2E';
const GREEN = '#22C55E';
const TEXT = '#E2E8F0';
const MUTED = '#94A3B8';

const getNavSections = (user) => {
    const isSP = user?.role === 'service_provider';
    
    return [
        {
            label: 'MAIN',
            items: [
                { 
                    label: isSP ? 'My Services' : 'Products', 
                    icon: isSP ? Wrench : Tag, 
                    path: isSP ? '/seller/services' : '/seller/products' 
                },
                { 
                    label: isSP ? 'Bookings' : 'Orders', 
                    icon: Package, 
                    path: '/seller/orders', 
                    badge: 'pendingOrders' 
                },
                { 
                    label: 'Messages', 
                    icon: MessageCircle, 
                    path: '/seller/messages' 
                },
                { 
                    label: 'Earnings', 
                    icon: DollarSign, 
                    path: '/seller/earnings' 
                },
                {
                    label: 'Advertise',
                    icon: Megaphone,
                    path: '/seller/advertise'
                },
                { 
                    label: isSP ? 'Settings' : 'Shop Settings', 
                    icon: Settings, 
                    path: '/seller/settings' 
                },
            ]
        }
    ];
};

export default function SellerSidebar({ isOpen, onClose, collapsed }) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const shopName = user?.fullName || user?.businessName || user?.name || (user?.role === 'service_provider' ? 'Service Profile' : 'My Shop');
    const shopInitial = shopName.charAt(0).toUpperCase();

    const sections = getNavSections(user);

    const SidebarContent = () => (
        <div className="flex flex-col h-full overflow-hidden" style={{ background: NAVY }}>
            {/* Logo + Portal label */}
            <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {/* akupy logo */}
                <svg viewBox="0 0 100 105" className="w-8 h-8 flex-shrink-0" fill="white" fillRule="evenodd" clipRule="evenodd">
                    <path fillRule="evenodd" clipRule="evenodd" d="M50 3 L95 100 H74 L50 30 L26 100 H5 Z M50 32 L67 79 H33 Z M44 56 Q44 51 50 51 Q56 51 56 56 L58 79 H42 Z M47 46 Q47 42 50 42 Q53 42 53 46 L53 52 H47 Z" />
                </svg>
                {!collapsed && (
                    <div className="min-w-0">
                        <div className="font-black text-white text-lg leading-none tracking-tight">
                            akupy<span style={{ color: GREEN }}>.</span>
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: MUTED }}>
                            {user?.role === 'service_provider' ? 'Service Portal' : 'Seller Portal'}
                        </div>
                    </div>
                )}
                {/* Mobile close */}
                {isOpen !== undefined && (
                    <button onClick={onClose} className="ml-auto p-1 rounded-lg xl:hidden" style={{ color: MUTED }}>
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Shop info */}
            {!collapsed && (
                <div className="px-4 py-3 mx-3 mt-3 rounded-xl flex items-center gap-3 cursor-pointer group transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onClick={() => { navigate('/seller/shop'); onClose?.(); }}
                >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${GREEN}, #16A34A)`, color: '#fff' }}>
                        {shopInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold truncate" style={{ color: TEXT }}>{shopName}</div>
                        <div className="text-[11px] font-semibold flex items-center gap-1 mt-0.5" style={{ color: GREEN }}>
                            {user?.role === 'service_provider' ? 'View Services' : 'View Store'} <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            )}

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                {sections.map((section, idx) => (
                    <div key={section.label} className="mb-1">
                        {!collapsed && (
                            <div className="px-3 pt-4 pb-1.5 text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: '#475569' }}>
                                {section.label}
                            </div>
                        )}
                        {section.items.map((item) => {
                            if (item.role && item.role !== user?.role) return null;
                            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={(e) => {
                                        if (item.path === '/seller/help') {
                                            e.preventDefault();
                                            window.dispatchEvent(new CustomEvent('open-ai-help'));
                                        }
                                        onClose?.();
                                    }}
                                    title={collapsed ? item.label : undefined}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all relative group"
                                    style={{
                                        background: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
                                        color: isActive ? GREEN : MUTED,
                                        borderLeft: isActive ? `3px solid ${GREEN}` : '3px solid transparent',
                                    }}
                                >
                                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="text-sm font-semibold flex-1">{item.label}</span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Bottom: user + logout */}
            <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {!collapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                            style={{ background: 'rgba(255,255,255,0.1)', color: TEXT }}>
                            {(user?.email || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate" style={{ color: TEXT }}>{user?.name || user?.email || 'Seller'}</div>
                            <div className="text-[10px] truncate" style={{ color: MUTED }}>{user?.email || ''}</div>
                        </div>
                        <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: MUTED }}>
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleLogout} className="w-full flex justify-center p-2 rounded-lg hover:text-red-400" style={{ color: MUTED }}>
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* DESKTOP Sidebar */}
            <aside className="hidden xl:flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 shadow-xl" style={{ width: collapsed ? 64 : 240 }}>
                <SidebarContent />
            </aside>

            {/* MOBILE Drawer */}
            {isOpen && (
                <div className="xl:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                    <aside className="relative flex flex-col w-72 h-full shadow-2xl z-10" style={{ background: NAVY }}>
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </>
    );
}
