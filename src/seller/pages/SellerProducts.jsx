import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Grid, List, Edit2, Copy, Trash2, Filter } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import useAuthStore from '../../store/useAuthStore';
import API from '../../config/apiRoutes';
import api from '../../utils/apiHelper';

function StockBadge({ qty, status }) {
    if (status === 'out_of_stock') return <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#DC2626' }}>Out of Stock</span>;
    if (status === 'low_stock' || qty <= 5) return <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>{qty} left</span>;
    return <span className="text-sm font-semibold" style={{ color: '#22C55E' }}>{qty}</span>;
}

function StatusPill({ status }) {
    const M = { active: { bg: '#DCFCE7', color: '#16A34A', label: 'Active' }, draft: { bg: '#F1F5F9', color: '#64748B', label: 'Draft' }, out_of_stock: { bg: '#FEE2E2', color: '#DC2626', label: 'Out of Stock' }, low_stock: { bg: '#FEF9C3', color: '#CA8A04', label: 'Low Stock' } };
    const s = M[status] || M.draft;
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

export default function SellerProducts() {
    const { user } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('table');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get(API.SELLER_PRODUCTS);
                // Handle different response formats
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else if (res.data && res.data.products) {
                    setProducts(res.data.products);
                    setPagination({
                        totalPages: res.data.totalPages || 1,
                        currentPage: res.data.currentPage || 1
                    });
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Load products failed:", err);
                setProducts([]);
            }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = products.filter(p => {
        const ms = filterStatus === 'all' || p.status === filterStatus;
        const mq = !search || p.name.toLowerCase().includes(search.toLowerCase());
        return ms && mq;
    });

    const SkeletonRow = () => (
        <tr style={{ borderBottom: '1px solid #F8F9FA' }}>
            {[60, 200, 100, 80, 60, 80, 80].map((w, i) => (
                <td key={i} className="px-4 py-3"><div className="h-4 rounded animate-pulse" style={{ width: w, background: '#F1F5F9' }} /></td>
            ))}
        </tr>
    );

    return (
        <SellerLayout>
            <div className="space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black" style={{ color: '#0F172A' }}>Products</h2>
                        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{products.length} total products</p>
                    </div>
                    <Link to="/seller/products/new"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm text-white transition-all active:scale-95"
                        style={{ background: '#22C55E' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                        onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}>
                        <Plus className="w-4 h-4" /> Add New Product
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg outline-none border"
                            style={{ background: '#fff', borderColor: '#E2E8F0', color: '#1E293B' }}
                            onFocus={e => e.target.style.borderColor = '#22C55E'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>

                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="h-10 px-3 text-sm rounded-lg border outline-none font-semibold"
                        style={{ background: '#fff', borderColor: '#E2E8F0', color: '#374151' }}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="low_stock">Low Stock</option>
                    </select>

                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="h-10 px-3 text-sm rounded-lg border outline-none font-semibold"
                        style={{ background: '#fff', borderColor: '#E2E8F0', color: '#374151' }}>
                        <option value="newest">Newest</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="sales">Most Sold</option>
                    </select>

                    {/* View toggle */}
                    <div className="flex gap-1 ml-auto">
                        <button onClick={() => setView('table')} className="p-2 rounded-lg border transition-colors"
                            style={{ background: view === 'table' ? '#22C55E' : '#fff', borderColor: view === 'table' ? '#22C55E' : '#E2E8F0', color: view === 'table' ? '#fff' : '#64748B' }}>
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={() => setView('grid')} className="p-2 rounded-lg border transition-colors"
                            style={{ background: view === 'grid' ? '#22C55E' : '#fff', borderColor: view === 'grid' ? '#22C55E' : '#E2E8F0', color: view === 'grid' ? '#fff' : '#64748B' }}>
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* TABLE VIEW */}
                {view === 'table' && (
                    <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead style={{ borderBottom: '2px solid #F8F9FA' }}>
                                    <tr>
                                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Sales', 'Actions'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />) :
                                        filtered.map(p => (
                                            <tr key={p._id} className="transition-colors"
                                                style={{ borderBottom: '1px solid #F8F9FA' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                                                            style={{ background: '#F8F9FA', border: '1px solid #F1F5F9' }}>
                                                            {p.images && p.images.length > 0 ? (
                                                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xl">{p.emoji || '📦'}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold line-clamp-1" style={{ color: '#0F172A' }}>{p.name}</div>
                                                            <div className="text-xs font-medium" style={{ color: '#94A3B8' }}>{p.sku || p._id.slice(-6).toUpperCase()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{p.category}</td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-bold" style={{ color: '#0F172A' }}>₹{p.price.toLocaleString()}</div>
                                                    {p.salePrice && <div className="text-xs line-through" style={{ color: '#94A3B8' }}>₹{p.salePrice.toLocaleString()}</div>}
                                                </td>
                                                <td className="px-4 py-3"><StockBadge qty={p.stock} status={p.status} /></td>
                                                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                                                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#64748B' }}>{p.sales}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Link to={`/seller/products/${p._id}/edit`} className="p-1.5 rounded-lg transition-colors" title="Edit" style={{ color: '#64748B' }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#3B82F6'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                        <button className="p-1.5 rounded-lg transition-colors" title="Duplicate" style={{ color: '#64748B' }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#FEF9C3'; e.currentTarget.style.color = '#CA8A04'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 rounded-lg transition-colors" title="Delete" style={{ color: '#64748B' }}
                                                            onClick={() => setConfirmDelete(p._id)}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* GRID VIEW */}
                {view === 'grid' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {loading ? Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: '#fff', border: '1px solid #F1F5F9' }}>
                                <div className="w-full h-32 rounded-lg mb-3" style={{ background: '#F1F5F9' }} />
                                <div className="h-4 w-3/4 rounded mb-2" style={{ background: '#F1F5F9' }} />
                                <div className="h-3 w-1/2 rounded" style={{ background: '#F1F5F9' }} />
                            </div>
                        )) : filtered.map(p => (
                            <div key={p._id} className="rounded-xl overflow-hidden group transition-all"
                                style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}>
                                <div className="relative w-full h-36 flex items-center justify-center overflow-hidden" style={{ background: '#F8F9FA' }}>
                                    {p.images && p.images.length > 0 ? (
                                        <img src={p.images[0]} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                        <span className="text-5xl">{p.emoji || '📦'}</span>
                                    )}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                        <Link to={`/seller/products/${p._id}/edit`} className="p-2 rounded-lg text-white" style={{ background: '#22C55E' }}>
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 rounded-lg text-white" style={{ background: '#EF4444' }} onClick={() => setConfirmDelete(p._id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <StatusPill status={p.status} />
                                    <h4 className="text-sm font-bold mt-2 line-clamp-1" style={{ color: '#0F172A' }}>{p.name}</h4>
                                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{p.category}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-black" style={{ color: '#0F172A' }}>₹{p.price.toLocaleString()}</span>
                                        <span className="text-xs font-semibold" style={{ color: p.stock === 0 ? '#EF4444' : '#64748B' }}>
                                            {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirm Delete Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <div className="rounded-2xl p-6 max-w-sm w-full" style={{ background: '#fff' }}>
                            <h3 className="text-lg font-black mb-2" style={{ color: '#0F172A' }}>Delete Product?</h3>
                            <p className="text-sm mb-6" style={{ color: '#64748B' }}>This action cannot be undone. The product will be permanently removed.</p>
                            <div className="flex gap-3">
                                <button className="flex-1 py-2.5 rounded-lg border font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                                    onClick={() => setConfirmDelete(null)}>Cancel</button>
                                <button className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: '#EF4444' }}
                                    onClick={async () => {
                                        try {
                                            await api.delete(`${API.SELLER_PRODUCTS}/${confirmDelete}`);
                                            setProducts(prev => prev.filter(p => p._id !== confirmDelete));
                                            setConfirmDelete(null);
                                        } catch (err) {
                                            console.error("Delete failed:", err);
                                            alert("Failed to delete product: " + (err.response?.data?.message || err.message));
                                        }
                                    }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
