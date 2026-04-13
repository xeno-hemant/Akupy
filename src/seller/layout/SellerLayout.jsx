import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerTopbar from './SellerTopbar';
import useAuthStore from '../../store/useAuthStore';

export default function SellerLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore();

    // Show login banner overlay if not logged in — no redirect (avoids white screen)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F8F9FA' }}>
                <div className="text-center max-w-sm w-full">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <img src="/akupy-logo.jpg" alt="Akupy" style={{ height: '36px', width: 'auto', filter: 'brightness(0)' }} />
                        <div className="text-2xl font-black" style={{ color: '#0F172A' }}>akupy<span style={{ color: '#22C55E' }}>.</span></div>
                    </div>
                    <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FDF4' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" className="w-7 h-7">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-black mb-2" style={{ color: '#0F172A' }}>Seller Portal</h2>
                        <p className="text-sm mb-6" style={{ color: '#64748B' }}>Login to your akupy account to access the seller dashboard.</p>
                        <Link to="/dashboard"
                            className="block w-full py-3 rounded-xl font-bold text-white text-sm text-center transition-all active:scale-95"
                            style={{ background: '#22C55E' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                            onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}>
                            Login / Sign Up
                        </Link>
                        <Link to="/" className="block mt-3 text-sm font-semibold" style={{ color: '#94A3B8' }}>
                            ← Back to akupy
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const sidebarWidth = collapsed ? 64 : 240;

    return (
        <div className="min-h-screen flex" style={{ background: '#F8F9FA' }}>
            {/* Sidebar */}
            <SellerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={collapsed}
            />

            {/* Main area */}
            <div
                className="flex-1 flex flex-col min-w-0 transition-all duration-300"
                style={{ marginLeft: 0 }}
            >
                {/* Desktop: push content right by sidebar width */}
                <style>{`
          @media (min-width: 1280px) {
            .seller-main { margin-left: ${sidebarWidth}px; }
          }
        `}</style>

                <div className="seller-main flex-1 flex flex-col min-h-screen">
                    <SellerTopbar
                        onMenuClick={() => setSidebarOpen(true)}
                        sidebarWidth={sidebarWidth}
                    />

                    {/* Page Content */}
                    <main
                        className="flex-1 overflow-auto"
                        style={{
                            paddingTop: 60, // topbar height
                            background: '#F8F9FA',
                            minHeight: '100vh',
                        }}
                    >
                        <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Tablet: collapse toggle button */}
            <button
                onClick={() => setCollapsed(prev => !prev)}
                className="hidden xl:flex fixed bottom-6 left-4 z-40 w-8 h-8 rounded-full items-center justify-center shadow-lg transition-all"
                style={{
                    background: '#1A1A2E',
                    color: '#94A3B8',
                    left: collapsed ? 72 : 248,
                    border: '2px solid rgba(255,255,255,0.1)',
                }}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`w-3.5 h-3.5 transition-transform ${collapsed ? '' : 'rotate-180'}`}>
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
        </div>
    );
}
