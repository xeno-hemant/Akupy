import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import SellerLayout from '../layout/SellerLayout';
import { Search, Filter, Download, Eye, Check, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../config/apiRoutes';
import api from '../../utils/apiHelper';
import axios from 'axios';

function StatusBadge({ status }) {
    const MAP = {
        pending: { bg: '#FEF9C3', color: '#CA8A04' },
        processing: { bg: '#DBEAFE', color: '#2563EB' },
        shipped: { bg: '#EDE9FE', color: '#7C3AED' },
        delivered: { bg: '#DCFCE7', color: '#16A34A' },
        cancelled: { bg: '#FEE2E2', color: '#DC2626' },
    };
    const s = MAP[status?.toLowerCase()] || { bg: '#F1F5F9', color: '#64748B' };
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold capitalize" style={{ background: s.bg, color: s.color }}>
            {status}
        </span>
    );
}

const TABS = [
    { label: 'All', value: 'all', count: 0 },
    { label: 'Pending', value: 'pending', count: 0 },
    { label: 'Processing', value: 'processing', count: 0 },
    { label: 'Shipped', value: 'shipped', count: 0 },
    { label: 'Delivered', value: 'delivered', count: 0 },
    { label: 'Cancelled', value: 'cancelled', count: 0 },
];

const PAYMENT_ICONS = { upi: '📱', card: '💳', cod: '💵' };

export default function SellerOrders() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await api.get(API.SELLER_ORDERS);
                if (res.data) setOrders(res.data);
            } catch (err) {
                console.error("Fetch orders failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filtered = orders.filter(o => {
        const matchTab = activeTab === 'all' || o.status === activeTab;
        const matchSearch = !search || o._id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const selectAll = () => setSelected(paginated.map(o => o._id));
    const clearSelect = () => setSelected([]);

    const SkRow = () => (
        <tr style={{ borderBottom: '1px solid #F8F9FA' }}>
            {[40, 100, 120, 140, 80, 80, 100].map((w, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 rounded animate-pulse" style={{ width: w, background: '#F1F5F9' }} />
                </td>
            ))}
        </tr>
    );

    return (
        <SellerLayout>
            <div className="space-y-5">

                {/* Tab Filters */}
                <div className="flex gap-1 flex-wrap">
                    {TABS.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => { setActiveTab(tab.value); setPage(1); }}
                            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            style={activeTab === tab.value
                                ? { background: '#22C55E', color: '#fff' }
                                : { background: '#fff', color: '#64748B', border: '1px solid #E2E8F0' }
                            }
                        >
                            {tab.label}
                            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black"
                                style={{ background: activeTab === tab.value ? 'rgba(255,255,255,0.25)' : '#F1F5F9' }}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, customer..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg outline-none border"
                            style={{ background: '#fff', borderColor: '#E2E8F0', color: '#1E293B' }}
                            onFocus={e => e.target.style.borderColor = '#22C55E'}
                            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold border transition-colors"
                        style={{ background: '#fff', borderColor: '#E2E8F0', color: '#374151' }}>
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold border transition-colors"
                        style={{ background: '#fff', borderColor: '#E2E8F0', color: '#374151' }}>
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>

                {/* Bulk Actions */}
                {selected.length > 0 && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                        <span className="text-sm font-bold" style={{ color: '#16A34A' }}>{selected.length} selected</span>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#8B5CF6' }}
                            onClick={() => { }}>Mark as Shipped</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#EF4444' }}
                            onClick={() => { }}>Cancel Selected</button>
                        <button className="ml-auto text-xs font-bold" style={{ color: '#64748B' }} onClick={clearSelect}>Clear</button>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px]">
                            <thead style={{ borderBottom: '2px solid #F8F9FA' }}>
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input type="checkbox" onChange={e => e.target.checked ? selectAll() : clearSelect()}
                                            checked={selected.length === paginated.length && paginated.length > 0}
                                            className="w-4 h-4 rounded" style={{ accentColor: '#22C55E' }} />
                                    </th>
                                    {['Order ID', 'Customer', 'Product', 'Amount', 'Payment', 'Date', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? Array.from({ length: 6 }).map((_, i) => <SkRow key={i} />) :
                                    paginated.map((o) => (
                                        <tr key={o._id} className="transition-colors cursor-pointer"
                                            style={{ borderBottom: '1px solid #F8F9FA' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td className="px-4 py-3">
                                                <input type="checkbox" checked={selected.includes(o._id)} onChange={() => toggleSelect(o._id)}
                                                    className="w-4 h-4 rounded" style={{ accentColor: '#22C55E' }} />
                                            </td>
                                            <td className="px-4 py-3 text-xs font-black" style={{ color: '#22C55E' }}>#{o._id}</td>
                                            <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#0F172A' }}>{o.customer}</td>
                                            <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{o.product}</td>
                                            <td className="px-4 py-3 text-sm font-bold" style={{ color: '#0F172A' }}>₹{o.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm">{PAYMENT_ICONS[o.payment]} {o.payment.toUpperCase()}</td>
                                            <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8' }}>{o.date}</td>
                                            <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button className="p-1.5 rounded-lg transition-colors" title="View" style={{ color: '#64748B' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#22C55E'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg transition-colors" title="Accept" style={{ color: '#64748B' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#F0FDF4'; e.currentTarget.style.color = '#22C55E'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg transition-colors" title="Cancel" style={{ color: '#64748B' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                        <XIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #F8F9FA' }}>
                        <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
                            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                                style={{ color: '#64748B' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const p = i + Math.max(1, page - 2);
                                if (p > totalPages) return null;
                                return (
                                    <button key={p} onClick={() => setPage(p)}
                                        className="w-8 h-8 rounded-lg text-sm font-bold transition-colors"
                                        style={page === p ? { background: '#22C55E', color: '#fff' } : { color: '#64748B' }}
                                        onMouseEnter={e => { if (page !== p) e.currentTarget.style.background = '#F1F5F9'; }}
                                        onMouseLeave={e => { if (page !== p) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                                style={{ color: '#64748B' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
