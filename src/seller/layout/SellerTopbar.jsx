import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const PAGE_TITLES = {
    '/seller/dashboard': 'Dashboard',
    '/seller/orders': 'Orders',
    '/seller/products': 'Products',
    '/seller/products/new': 'Add New Product',
    '/seller/inventory': 'Inventory',
    '/seller/earnings': 'Earnings & Finance',
    '/seller/shop': 'Service Profile',
    '/seller/coupons': 'Coupons & Offers',
    '/seller/reviews': 'Reviews',
    '/seller/customers': 'Customers',
    '/seller/notifications': 'Notifications',
    '/seller/settings': 'Portal Settings',
    '/seller/help': 'Help & Support',
};

export default function SellerTopbar({ onMenuClick, sidebarWidth = 240 }) {
    const location = useLocation();
    const { user } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const title = PAGE_TITLES[location.pathname] || (user?.role === 'service_provider' ? 'Service Portal' : 'Seller Portal');
    const notifications = 0; // Reset dummy data

    return (
        <header
            className="fixed top-0 right-0 z-30 flex items-center gap-4 px-4 h-[60px] transition-all duration-300"
            style={{
                left: 0,
                paddingLeft: window.innerWidth >= 1280 ? `${sidebarWidth + 16}px` : '16px',
                background: '#FFFFFF',
                borderBottom: '1px solid #F1F5F9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
        >
            {/* Mobile Hamburger — appears at left edge ignoring sidebar padding */}
            <button
                onClick={onMenuClick}
                className="xl:hidden flex-shrink-0 p-2 rounded-lg transition-colors"
                style={{
                    position: 'absolute',
                    left: 16,
                    color: '#64748B',
                    background: 'transparent'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link to="/seller/dashboard" className="mr-6 hidden xl:block">
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 100 100" className="w-8 h-8">
                        <line x1="2" y1="30" x2="24" y2="30" stroke="#22C55E" strokeWidth="9" strokeLinecap="round" />
                        <line x1="0" y1="50" x2="20" y2="50" stroke="#22C55E" strokeWidth="9" strokeLinecap="round" />
                        <line x1="4" y1="70" x2="24" y2="70" stroke="#22C55E" strokeWidth="9" strokeLinecap="round" />
                        <path d="M22 22 L78 22 L72 78 L28 78 Z" fill="#22C55E" />
                        <circle cx="38" cy="90" r="8" fill="#16A34A" />
                        <circle cx="62" cy="90" r="8" fill="#16A34A" />
                    </svg>
                    <div className="text-xl font-black" style={{ color: '#0F172A' }}>akupy<span style={{ color: '#22C55E' }}>.</span></div>
                </div>
            </Link>

            {/* Page Title & Breadcrumb */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center md:gap-3">
                <div className="flex items-center gap-2">
                    <Link 
                        to="/seller/dashboard" 
                        className="text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 md:py-1 rounded bg-[#E2E8F0] text-[#64748B] hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all"
                    >
                        Dashboard
                    </Link>
                    <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
                </div>
                <h1 className="text-sm md:text-lg font-bold text-[#1E293B] truncate max-w-[150px] md:max-w-none">
                    {title}
                </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-auto hidden sm:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                    <input
                        type="text"
                        placeholder="Search orders, products..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 text-sm outline-none rounded-lg border transition-all"
                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                        onFocus={e => { e.target.style.borderColor = '#22C55E'; e.target.style.background = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; }}
                    />
                </div>
            </div>

            {/* Right Icons */}
            <div className="ml-auto flex items-center gap-2">
                {/* Notification Bell */}
                <button className="relative p-2 rounded-lg transition-colors" style={{ color: '#64748B' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[9px] font-black rounded-full text-white"
                            style={{ background: '#EF4444' }}>
                            {notifications}
                        </span>
                    )}
                </button>

                {/* Avatar Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                        style={{ color: '#0F172A' }}
                        onClick={() => setDropdownOpen(prev => !prev)}
                        onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                        onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                            style={{ background: '#22C55E', color: '#fff' }}>
                            {(user?.name || user?.email || 'S').charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:block text-sm font-semibold">{user?.fullName || user?.name || (user?.role === 'service_provider' ? 'Service Person' : 'Seller')}</span>
                        <ChevronDown className="w-3.5 h-3.5 hidden md:block" style={{ color: '#94A3B8' }} />
                    </button>

                    {dropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                            <div className="absolute right-0 top-full mt-1 w-52 rounded-xl shadow-xl z-50 overflow-hidden"
                                style={{ background: '#fff', border: '1px solid #F1F5F9' }}>
                                <div className="px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <div className="text-sm font-bold" style={{ color: '#0F172A' }}>{user?.fullName || user?.name || (user?.role === 'service_provider' ? 'Service Person' : 'Seller')}</div>
                                    <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{user?.email || ''}</div>
                                </div>
                                <button className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors" style={{ color: '#EF4444' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => { setDropdownOpen(false); /* logout handled in sidebar */ }}>
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
