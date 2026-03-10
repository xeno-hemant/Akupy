import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, XCircle, CheckCircle, Download, Upload } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import useAuthStore from '../../store/useAuthStore';
import StatCard from '../components/StatCard';

const DEMO = Array.from({ length: 14 }, (_, i) => ({
    _id: `inv_${i + 1}`,
    emoji: ['👕', '🎧', '🌿', '👜', '🕯️', '💡', '👗', '☕', '🧥', '🔊', '📚', '🖼️', '🎁', '🧴'][i],
    name: ['Acid Wash Tee', 'Sony WH-1000XM5', 'Monstera Deliciosa', 'Leather Wallet', 'Soy Candles', 'LED Lamp', 'Cotton Kurta', 'Handcrafted Mug', 'Denim Jacket', 'Wireless Speaker', 'Art of Living', 'Canvas Print', 'Gift Box Set', 'Skincare Kit'][i],
    sku: `SKU-${1000 + i}`,
    category: ['Fashion', 'Electronics', 'Plants', 'Accessories', 'Lifestyle', 'Home', 'Fashion', 'Lifestyle', 'Fashion', 'Electronics', 'Books', 'Home', 'Lifestyle', 'Beauty'][i],
    stock: [42, 8, 0, 15, 3, 0, 24, 56, 11, 7, 32, 0, 4, 19][i],
    threshold: 5,
    updated: 'Mar 10, 2026',
}));

function getStatus(stock) {
    if (stock === 0) return 'out';
    if (stock <= 5) return 'low';
    return 'ok';
}

const STATUS_COLORS = {
    ok: '#22C55E', low: '#F59E0B', out: '#EF4444',
};

export default function SellerInventory() {
    const { user } = useAuthStore();
    const [items, setItems] = useState(DEMO);
    const [editing, setEditing] = useState({});
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

    const filtered = items.filter(it => {
        const st = getStatus(it.stock);
        const ms = filterStatus === 'all' || st === filterStatus;
        const mq = !search || it.name.toLowerCase().includes(search.toLowerCase());
        return ms && mq;
    });

    const updateStock = (id, val) => {
        setItems(prev => prev.map(it => it._id === id ? { ...it, stock: Math.max(0, Number(val)) } : it));
        setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    const stats = {
        total: items.length,
        ok: items.filter(i => getStatus(i.stock) === 'ok').length,
        low: items.filter(i => getStatus(i.stock) === 'low').length,
        out: items.filter(i => getStatus(i.stock) === 'out').length,
    };

    return (
        <SellerLayout>
            <div className="space-y-5">

                {/* Summary cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard title="Total SKUs" value={stats.total} icon={Package} accentColor="#3B82F6" />
                    <StatCard title="In Stock" value={stats.ok} icon={CheckCircle} accentColor="#22C55E" />
                    <StatCard title="Low Stock" value={stats.low} icon={AlertTriangle} accentColor="#F59E0B" subtext="< 5 units" />
                    <StatCard title="Out of Stock" value={stats.out} icon={XCircle} accentColor="#EF4444" />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full h-10 pl-4 pr-4 text-sm rounded-lg border outline-none"
                            style={{ background: '#fff', borderColor: '#E2E8F0', color: '#1E293B' }}
                            onFocus={e => e.target.style.borderColor = '#22C55E'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                    {['all', 'ok', 'low', 'out'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className="px-4 py-2 rounded-lg text-sm font-bold transition-all border"
                            style={filterStatus === s
                                ? { background: STATUS_COLORS[s] || '#22C55E', color: '#fff', borderColor: STATUS_COLORS[s] || '#22C55E' }
                                : { background: '#fff', color: '#64748B', borderColor: '#E2E8F0' }
                            }>
                            {s === 'all' ? 'All' : s === 'ok' ? 'In Stock' : s === 'low' ? 'Low Stock' : 'Out of Stock'}
                        </button>
                    ))}
                    <div className="flex gap-2 ml-auto">
                        <button className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold border" style={{ background: '#fff', borderColor: '#E2E8F0', color: '#374151' }}>
                            <Upload className="w-4 h-4" /> Import CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold border" style={{ background: '#fff', borderColor: '#E2E8F0', color: '#374151' }}>
                            <Download className="w-4 h-4" /> Template
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead style={{ borderBottom: '2px solid #F8F9FA' }}>
                                <tr>
                                    {['Product', 'SKU', 'Category', 'Current Stock', 'Threshold', 'Status', 'Updated', 'Update'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #F8F9FA' }}>
                                        {Array.from({ length: 8 }).map((_, j) => (
                                            <td key={j} className="px-4 py-3"><div className="h-4 rounded animate-pulse" style={{ background: '#F1F5F9', width: 70 }} /></td>
                                        ))}
                                    </tr>
                                )) : filtered.map(it => {
                                    const st = getStatus(it.stock);
                                    const isEditing = it._id in editing;
                                    return (
                                        <tr key={it._id}
                                            style={{ borderBottom: '1px solid #F8F9FA', background: st === 'out' ? '#FFFBFB' : 'transparent' }}
                                            onMouseEnter={e => { if (st !== 'out') e.currentTarget.style.background = '#F8FAFC'; }}
                                            onMouseLeave={e => { if (st !== 'out') e.currentTarget.style.background = 'transparent'; }}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{it.emoji}</span>
                                                    <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{it.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: '#94A3B8' }}>{it.sku}</td>
                                            <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{it.category}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-lg font-black" style={{ color: STATUS_COLORS[st] }}>{it.stock}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#94A3B8' }}>{it.threshold}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[st] }} />
                                                    <span className="text-xs font-bold" style={{ color: STATUS_COLORS[st] }}>
                                                        {st === 'ok' ? 'In Stock' : st === 'low' ? 'Low Stock' : 'Out of Stock'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8' }}>{it.updated}</td>
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            defaultValue={it.stock}
                                                            min="0"
                                                            className="w-20 h-8 px-2 text-sm rounded-lg border-2 outline-none font-bold"
                                                            style={{ borderColor: '#22C55E', background: '#F0FDF4', color: '#0F172A' }}
                                                            onKeyDown={e => e.key === 'Enter' && updateStock(it._id, e.target.value)}
                                                            id={`stock-${it._id}`}
                                                        />
                                                        <button className="px-2 py-1 rounded-lg text-xs font-black text-white" style={{ background: '#22C55E' }}
                                                            onClick={() => updateStock(it._id, document.getElementById(`stock-${it._id}`).value)}>
                                                            Save
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-colors"
                                                        style={{ borderColor: '#22C55E', color: '#22C55E' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#22C55E'; e.currentTarget.style.color = '#fff'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#22C55E'; }}
                                                        onClick={() => setEditing(prev => ({ ...prev, [it._id]: true }))}>
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
