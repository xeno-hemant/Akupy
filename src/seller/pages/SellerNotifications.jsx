import React, { useState } from 'react';
import { Bell, Package, Star, DollarSign, Settings, CheckCheck } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';

const ICON_MAP = { order: Package, review: Star, payout: DollarSign, system: Settings, default: Bell };
const COLOR_MAP = { order: '#3B82F6', review: '#F59E0B', payout: '#22C55E', system: '#8B5CF6', default: '#64748B' };

const NOTIFS = [];

const FILTERS = ['All', 'Orders', 'Reviews', 'Payouts', 'System'];

export default function SellerNotifications() {
    const [notifs, setNotifs] = useState(NOTIFS);
    const [filter, setFilter] = useState('All');

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const filtered = filter === 'All' ? notifs :
        notifs.filter(n => {
            if (filter === 'Orders') return n.type === 'order';
            if (filter === 'Reviews') return n.type === 'review';
            if (filter === 'Payouts') return n.type === 'payout';
            if (filter === 'System') return n.type === 'system';
            return true;
        });

    const unreadCount = notifs.filter(n => !n.read).length;

    return (
        <SellerLayout>
            <div className="max-w-2xl space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black" style={{ color: '#0F172A' }}>Notifications</h2>
                        {unreadCount > 0 && (
                            <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors"
                            style={{ borderColor: '#E2E8F0', color: '#22C55E' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#F0FDF4'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                            <CheckCheck className="w-4 h-4" /> Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2 flex-wrap">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className="px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
                            style={filter === f
                                ? { background: '#22C55E', color: '#fff', borderColor: '#22C55E' }
                                : { background: '#fff', color: '#64748B', borderColor: '#E2E8F0' }
                            }>
                            {f}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: '#64748B' }} />
                            <p className="font-semibold text-sm" style={{ color: '#94A3B8' }}>No notifications here</p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: '#F8F9FA' }}>
                            {filtered.map(n => {
                                const Icon = ICON_MAP[n.type] || ICON_MAP.default;
                                const color = COLOR_MAP[n.type] || COLOR_MAP.default;
                                return (
                                    <div key={n.id}
                                        className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors"
                                        style={{ background: n.read ? 'transparent' : '#F8FAFF' }}
                                        onClick={() => markRead(n.id)}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : '#F8FAFF'}
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${color}18`, color }}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 justify-between">
                                                <span className={`text-sm font-${n.read ? 'semibold' : 'black'}`} style={{ color: '#0F172A' }}>{n.title}</span>
                                                <span className="text-[11px] flex-shrink-0" style={{ color: '#94A3B8' }}>{n.time}</span>
                                            </div>
                                            <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{n.desc}</p>
                                        </div>
                                        {!n.read && (
                                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: '#22C55E' }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
