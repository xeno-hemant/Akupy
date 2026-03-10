import React, { useState } from 'react';
import { Plus, Copy, Edit2, Trash2, X, RefreshCw } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';

const GREEN = '#22C55E';

const COUPONS_DEMO = [
    { id: 1, code: 'SAVE20', type: 'percent', value: 20, minOrder: 500, used: 45, limit: 100, expiry: 'Mar 31, 2026', active: true },
    { id: 2, code: 'FLAT100', type: 'fixed', value: 100, minOrder: 300, used: 12, limit: 50, expiry: 'Apr 15, 2026', active: true },
    { id: 3, code: 'WELCOME15', type: 'percent', value: 15, minOrder: 0, used: 88, limit: 100, expiry: 'Feb 28, 2026', active: false },
    { id: 4, code: 'SUMMER25', type: 'percent', value: 25, minOrder: 1000, used: 30, limit: 200, expiry: 'Jun 30, 2026', active: true },
];

function genCode() {
    return 'AK' + Math.random().toString(36).toUpperCase().substring(2, 8);
}

export default function SellerCoupons() {
    const [coupons, setCoupons] = useState(COUPONS_DEMO);
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(null);
    const [form, setForm] = useState({ code: '', type: 'percent', value: '', minOrder: '', limit: '', expiry: '' });
    const [saving, setSaving] = useState(false);

    const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(code);
        setTimeout(() => setCopied(null), 1500);
    };

    const toggleActive = (id) => setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    const deleteCoupon = (id) => setCoupons(prev => prev.filter(c => c.id !== id));

    const handleCreate = (e) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setCoupons(prev => [...prev, {
                id: Date.now(), code: form.code || genCode(), type: form.type,
                value: Number(form.value), minOrder: Number(form.minOrder || 0),
                used: 0, limit: Number(form.limit || 999), expiry: form.expiry || '—', active: true,
            }]);
            setSaving(false);
            setShowModal(false);
            setForm({ code: '', type: 'percent', value: '', minOrder: '', limit: '', expiry: '' });
        }, 800);
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
                    {coupons.map(c => {
                        const pct = Math.min(100, Math.round((c.used / c.limit) * 100));
                        const isExpired = !c.active || c.used >= c.limit;
                        return (
                            <div key={c.id} className="rounded-xl p-5 transition-all"
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
                                            {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                        </div>
                                        {c.minOrder > 0 && <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Min. order ₹{c.minOrder}</p>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: c.active ? '#DCFCE7' : '#F1F5F9', color: c.active ? '#16A34A' : '#94A3B8' }}>
                                            {c.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Usage bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: '#64748B' }}>Usage: {c.used}/{c.limit}</span>
                                        <span className="text-xs font-bold" style={{ color: pct >= 80 ? '#EF4444' : '#94A3B8' }}>{pct}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? '#EF4444' : GREEN }} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>Expires {c.expiry}</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => toggleActive(c.id)} className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors"
                                            style={{ borderColor: c.active ? '#EF4444' : GREEN, color: c.active ? '#EF4444' : GREEN }}
                                            onMouseEnter={e => { e.currentTarget.style.background = c.active ? '#FEF2F2' : '#F0FDF4'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                            {c.active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#94A3B8' }}
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
