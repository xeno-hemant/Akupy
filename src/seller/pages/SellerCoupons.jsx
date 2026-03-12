import React, { useState, useEffect } from 'react';
import { Plus, Copy, Edit2, Trash2, X, RefreshCw } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import API from '../../config/apiRoutes';
import api from '../../utils/apiHelper';

const GREEN = '#22C55E';

function genCode() {
    return 'AK' + Math.random().toString(36).toUpperCase().substring(2, 8);
}

export default function SellerCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(null);
    const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', limit: '', expiry: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await api.get(API.SELLER_COUPONS);
            setCoupons(res.data.coupons || []);
        } catch (err) {
            console.error("Failed to fetch coupons", err);
        } finally {
            setLoading(false);
        }
    };

    const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(code);
        setTimeout(() => setCopied(null), 1500);
    };

    const toggleActive = async (id) => {
        try {
            const res = await api.put(`${API.SELLER_COUPONS}/${id}/toggle`);
            setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: res.data.isActive } : c));
        } catch (err) {
            alert("Failed to toggle coupon");
        }
    };

    const deleteCoupon = async (id) => {
        if (!window.confirm("Delete this coupon?")) return;
        try {
            await api.delete(`${API.SELLER_COUPONS}/${id}`);
            setCoupons(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert("Failed to delete coupon");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                code: form.code || genCode(),
                discountType: form.type === 'percent' ? 'percentage' : 'fixed',
                discountValue: Number(form.value),
                minOrderValue: Number(form.minOrder || 0),
                maxUsage: form.limit ? Number(form.limit) : null,
                expiryDate: form.expiry
            };
            const res = await api.post(API.SELLER_COUPONS, payload);
            setCoupons(prev => [...prev, res.data.coupon]);
            setShowModal(false);
            setForm({ code: '', type: 'percent', value: '', minOrder: '', limit: '', expiry: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create coupon");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SellerLayout>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black" style={{ color: '#0F172A' }}>Coupons & Offers</h2>
                        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{coupons.length} coupons created</p>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm text-white"
                        style={{ background: GREEN }}
                        onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                        onMouseLeave={e => e.currentTarget.style.background = GREEN}>
                        <Plus className="w-4 h-4" /> Create Coupon
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold">Loading your coupons...</div>
                    ) : coupons.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                             <p className="text-gray-400 font-bold">No coupons found. Create your first one!</p>
                        </div>
                    ) : coupons.map(c => {
                        const pct = c.maxUsage ? Math.min(100, Math.round((c.usedCount / c.maxUsage) * 100)) : 0;
                        const isExpired = !c.isActive || (c.maxUsage && c.usedCount >= c.maxUsage) || (new Date(c.expiryDate) < new Date());
                        return (
                            <div key={c._id} className="rounded-xl p-5 transition-all"
                                style={{
                                    background: '#fff', border: `1px solid ${isExpired ? '#F1F5F9' : '#E9FDF0'}`,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                    opacity: isExpired ? 0.7 : 1,
                                }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono font-black text-lg tracking-wider" style={{ color: '#0F172A' }}>{c.code}</span>
                                            <button onClick={() => copyCode(c.code)} className="p-1 rounded transition-colors" style={{ color: '#94A3B8' }}
                                                onMouseEnter={e => e.currentTarget.style.color = GREEN} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            {copied === c.code && <span className="text-[10px] font-bold" style={{ color: GREEN }}>Copied!</span>}
                                        </div>
                                        <div className="text-xl font-black" style={{ color: GREEN }}>
                                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                        </div>
                                        {c.minOrderValue > 0 && <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Min. order ₹{c.minOrderValue}</p>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: c.isActive ? '#DCFCE7' : '#F1F5F9', color: c.isActive ? '#16A34A' : '#94A3B8' }}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Usage bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: '#64748B' }}>Usage: {c.usedCount}/{c.maxUsage || '∞'}</span>
                                        <span className="text-xs font-bold" style={{ color: pct >= 80 ? '#EF4444' : '#94A3B8' }}>{pct}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? '#EF4444' : GREEN }} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>Expires {new Date(c.expiryDate).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => toggleActive(c._id)} className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors"
                                            style={{ borderColor: c.isActive ? '#EF4444' : GREEN, color: c.isActive ? '#EF4444' : GREEN }}
                                            onMouseEnter={e => { e.currentTarget.style.background = c.isActive ? '#FEF2F2' : '#F0FDF4'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                            {c.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => deleteCoupon(c._id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#94A3B8' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="rounded-2xl w-full max-w-md" style={{ background: '#fff' }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Create Coupon</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ color: '#64748B' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Coupon Code</label>
                                <div className="flex gap-2">
                                    <input value={form.code} onChange={F('code')} placeholder="e.g. SAVE20"
                                        className="flex-1 h-10 px-3 text-sm rounded-lg border-2 outline-none font-mono font-bold uppercase"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                    <button type="button" onClick={() => setForm(p => ({ ...p, code: genCode() }))}
                                        className="p-2 rounded-lg border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                                        title="Auto-generate">
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Discount Type</label>
                                    <select value={form.type} onChange={F('type')}
                                        className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-medium"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#374151' }}>
                                        <option value="percent">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Value {form.type === 'percent' ? '(%)' : '(₹)'}</label>
                                    <input type="number" value={form.value} onChange={F('value')} placeholder="20" required
                                        className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-bold"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Min. Cart Value (₹)</label>
                                    <input type="number" value={form.minOrder} onChange={F('minOrder')} placeholder="0"
                                        className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Usage Limit</label>
                                    <input type="number" value={form.limit} onChange={F('limit')} placeholder="100"
                                        className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Expiry Date</label>
                                <input type="date" value={form.expiry} onChange={F('expiry')}
                                    className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                    onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-lg border font-semibold text-sm" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white" style={{ background: GREEN }}>
                                    {saving ? 'Creating...' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SellerLayout>
    );
}
