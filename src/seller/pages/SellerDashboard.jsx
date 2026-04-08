import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    DollarSign, ShoppingCart, Package, Star, TrendingUp,
    Plus, Gift, ExternalLink, AlertTriangle, MessageSquare,
    ArrowUpRight, ArrowRight, Wrench
} from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import StatCard from '../components/StatCard';
import useAuthStore from '../../store/useAuthStore';

// ── Inline sparkline (no external dep) ─────────────────────────────────
function Sparkline({ data, color = '#22C55E', height = 32 }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 80;
    const h = height;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-20" style={{ height }}>
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Mini bar chart ────────────────────────────────────────────────────
function MiniBar({ data, color = '#3B82F6' }) {
    const max = Math.max(...data);
    return (
        <div className="flex items-end gap-0.5 h-8">
            {data.map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, background: `${color}${i === data.length - 1 ? 'FF' : '80'}` }} />
            ))}
        </div>
    );
}

// ── Status badge ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const MAP = {
        pending: { bg: '#FEF9C3', color: '#CA8A04', label: 'Pending' },
        processing: { bg: '#DBEAFE', color: '#2563EB', label: 'Processing' },
        shipped: { bg: '#EDE9FE', color: '#7C3AED', label: 'Shipped' },
        delivered: { bg: '#DCFCE7', color: '#16A34A', label: 'Delivered' },
        cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' },
    };
    const s = MAP[status?.toLowerCase()] || { bg: '#F1F5F9', color: '#64748B', label: status };
    return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
}

// ── Initial Empty Data ─────────────────────────────────────────
const DEMO_ORDERS = [];
const DEMO_PRODUCTS = [];
const DEMO_LOW_STOCK = [];
const DEMO_REVIEWS = [];

const REVENUE_DATA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const REVENUE_MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const ORDER_DONUT_DATA = [
    { label: 'Delivered', value: 0, color: '#22C55E' },
    { label: 'Shipped', value: 0, color: '#8B5CF6' },
    { label: 'Processing', value: 0, color: '#3B82F6' },
    { label: 'Pending', value: 0, color: '#F59E0B' },
    { label: 'Cancelled', value: 0, color: '#EF4444' },
];

// ── Donut Chart (pure SVG) ────────────────────────────────────────────
function DonutChart({ data }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    let cumulative = 0;
    const R = 70, cx = 90, cy = 90, strokeW = 22;
    const circ = 2 * Math.PI * R;

    const segments = data.map(d => {
        const pct = d.value / total;
        const offset = circ * (1 - cumulative);
        cumulative += pct;
        return { ...d, pct, offset, dash: circ * pct };
    });

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <svg viewBox="0 0 180 180" className="w-40 h-40 flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
                {segments.map((seg, i) => (
                    <circle key={i} cx={cx} cy={cy} r={R}
                        fill="none" stroke={seg.color} strokeWidth={strokeW}
                        strokeDasharray={`${seg.dash} ${circ - seg.dash}`}
                        strokeDashoffset={-seg.offset}
                        style={{ transform: 'rotate(0deg)', transition: 'stroke-dasharray 0.5s' }}
                    />
                ))}
                <text x={cx} y={cy + 6} textAnchor="middle" style={{ fontSize: 22, fontWeight: 900, fill: '#0F172A', transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}>
                    {total}
                </text>
            </svg>
            <div className="flex flex-col gap-2">
                {data.map(d => (
                    <div key={d.label} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-sm font-semibold" style={{ color: '#64748B' }}>{d.label}</span>
                        <span className="text-sm font-black ml-auto pl-4" style={{ color: '#0F172A' }}>{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Revenue Line Chart (pure SVG) ─────────────────────────────────────
function RevenueChart({ data, labels, period, onPeriodChange }) {
    const max = Math.max(...data);
    const min = 0;
    const W = 500, H = 140;
    const padL = 48, padR = 16, padT = 10, padB = 30;
    const cW = W - padL - padR;
    const cH = H - padT - padB;

    const pts = data.map((v, i) => ({
        x: padL + (i / (data.length - 1)) * cW,
        y: padT + cH - ((v - min) / (max - min || 1)) * cH,
    }));
    const polyPoints = pts.map(p => `${p.x},${p.y}`).join(' ');
    const areaPoints = `${pts[0].x},${padT + cH} ${polyPoints} ${pts[pts.length - 1].x},${padT + cH}`;

    return (
        <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Revenue Overview</h3>
                <div className="flex gap-1">
                    {['Week', 'Month', 'Year'].map(p => (
                        <button key={p} onClick={() => onPeriodChange(p)}
                            className="px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                            style={period === p
                                ? { background: '#22C55E', color: '#fff' }
                                : { background: '#F1F5F9', color: '#64748B' }
                            }>
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[300px]" style={{ height: H }}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const y = padT + cH * (1 - t);
                        return (
                            <g key={i}>
                                <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                                <text x={padL - 6} y={y + 4} textAnchor="end" style={{ fontSize: 9, fill: '#94A3B8' }}>
                                    {t === 0 ? '0' : `₹${((max * t) / 1000).toFixed(0)}K`}
                                </text>
                            </g>
                        );
                    })}
                    {/* Area fill */}
                    <polygon points={areaPoints} fill="url(#gr)" opacity="0.15" />
                    <defs>
                        <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22C55E" />
                            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Line */}
                    <polyline points={polyPoints} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Dots */}
                    {pts.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#22C55E" stroke="#fff" strokeWidth="2" />
                    ))}
                    {/* X labels — show fewer on narrow */}
                    {labels.map((l, i) => {
                        if (data.length > 8 && i % 2 !== 0) return null;
                        return (
                            <text key={i} x={pts[i].x} y={H - 2} textAnchor="middle" style={{ fontSize: 9, fill: '#94A3B8' }}>{l}</text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────
export default function SellerDashboard() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('Month');
    const shopName = user?.businessName || user?.name || 'Shop';

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <SellerLayout>
            <div className="space-y-6">

                {/* ── Greeting Row ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black" style={{ color: '#0F172A' }}>
                            {greeting}, {shopName}! 👋
                        </h2>
                        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                            {dateStr} · Here's what's happening today
                        </p>
                    </div>
                    <Link
                        to="/seller/shop"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm border-2 transition-all"
                        style={{ borderColor: '#22C55E', color: '#22C55E' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#22C55E'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#22C55E'; }}
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Store
                    </Link>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard loading={loading} title="Total Revenue" value="₹0" subtext="No sales yet" icon={DollarSign} accentColor="#F59E0B" />
                    <StatCard loading={loading} title="Total Orders" value="0" subtext="No orders yet" icon={ShoppingCart} accentColor="#3B82F6" />
                    <StatCard loading={loading} title="Products Listed" value="0" subtext="Add your first product" icon={Package} accentColor="#8B5CF6" />
                    <StatCard loading={loading} title="Avg. Rating" value="0 ★" subtext="No reviews yet" icon={Star} accentColor="#22C55E" />
                </div>

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                    {/* Revenue Chart (60%) */}
                    <div className="xl:col-span-3 rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <RevenueChart data={REVENUE_DATA} labels={REVENUE_MONTHS} period={period} onPeriodChange={setPeriod} />
                    </div>

                    {/* Order Status Donut (40%) */}
                    <div className="xl:col-span-2 rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-base font-black mb-4" style={{ color: '#0F172A' }}>Order Status</h3>
                        <DonutChart data={ORDER_DONUT_DATA} />
                    </div>
                </div>

                {/* ── Recent Orders + Top Products ── */}
                <div className="grid grid-cols-1 xl:grid-cols-11 gap-4">
                    {/* Recent Orders (55%) */}
                    <div className="xl:col-span-6 rounded-xl" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F8F9FA' }}>
                            <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Recent Orders</h3>
                            <Link to="/seller/orders" className="text-xs font-bold flex items-center gap-1" style={{ color: '#22C55E' }}>
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto min-h-[200px] flex flex-col">
                            <table className="w-full min-w-[500px]">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #F8F9FA' }}>
                                        {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-xs font-bold" style={{ color: '#94A3B8' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEMO_ORDERS.length > 0 ? DEMO_ORDERS.map((o, i) => (
                                        <tr key={i} className="transition-colors cursor-pointer"
                                            style={{ borderBottom: '1px solid #F8F9FA' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td className="px-4 py-3 text-xs font-black" style={{ color: '#22C55E' }}>{o.id}</td>
                                            <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#0F172A' }}>{o.customer}</td>
                                            <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{o.product}</td>
                                            <td className="px-4 py-3 text-sm font-bold" style={{ color: '#0F172A' }}>{o.amount}</td>
                                            <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                                            <td className="px-4 py-3 text-xs font-medium" style={{ color: '#94A3B8' }}>{o.date}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-12 text-center text-sm font-medium" style={{ color: '#94A3B8' }}>
                                                <div className="flex flex-col items-center gap-2">
                                                    <ShoppingCart className="w-8 h-8 opacity-20" />
                                                    No orders received yet
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products (45%) */}
                    <div className="xl:col-span-5 rounded-xl" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F8F9FA' }}>
                            <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Top Products</h3>
                            <Link to="/seller/products" className="text-xs font-bold flex items-center gap-1" style={{ color: '#22C55E' }}>
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-4 space-y-3 min-h-[200px] flex flex-col">
                            {DEMO_PRODUCTS.length > 0 ? DEMO_PRODUCTS.map((p, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-6 text-sm font-black text-center flex-shrink-0" style={{ color: '#CBD5E1' }}>
                                        {p.rank}
                                    </span>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black"
                                        style={{ background: '#F1F5F9', color: '#64748B' }}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate" style={{ color: '#0F172A' }}>{p.name}</div>
                                        <div className="mt-1 h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                                            <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: '#22C55E' }} />
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-black" style={{ color: '#0F172A' }}>{p.units}</div>
                                        <div className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{p.revenue}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[94A3B8] text-sm py-8">
                                    <Package className="w-8 h-8 opacity-20" />
                                    No products listed yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Quick Actions + Low Stock + Reviews ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                    {/* Quick Actions */}
                    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-4" style={{ color: '#0F172A' }}>Quick Actions</h3>
                        <div className="space-y-2.5">
                            <Link to="/seller/products/new"
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
                                style={{ background: '#22C55E' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                                onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}>
                                <Plus className="w-4 h-4" /> Add New Product
                            </Link>
                            {[
                                { label: 'Create Coupon', to: '/seller/coupons', icon: Gift },
                                { label: 'View Pending Orders', to: '/seller/orders?status=pending', icon: Package },
                                { label: 'Manage Services', to: '/seller/services', icon: Wrench },
                            ].map(({ label, to, icon: Icon }) => (
                                <Link key={to} to={to}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-all"
                                    style={{ borderColor: '#E2E8F0', color: '#374151' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.color = '#22C55E'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}>
                                    <Icon className="w-4 h-4" /> {label}
                                </Link>
                            ))}
                            <Link to="/seller/earnings"
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-all"
                                style={{ borderColor: '#F59E0B', color: '#F59E0B' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                <DollarSign className="w-4 h-4" /> Withdraw Earnings
                            </Link>
                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="rounded-xl" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid #FEF2F2', background: '#FFF5F5', borderRadius: '12px 12px 0 0' }}>
                            <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
                            <h3 className="text-sm font-black" style={{ color: '#DC2626' }}>Low Stock Alert</h3>
                            <span className="ml-auto text-xs font-black px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                                {DEMO_LOW_STOCK.length}
                            </span>
                        </div>
                        <div className="divide-y" style={{ borderColor: '#F8F9FA' }}>
                            {DEMO_LOW_STOCK.map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{item.name}</div>
                                        <div className="text-xs font-bold mt-0.5" style={{ color: item.qty <= 2 ? '#EF4444' : '#F59E0B' }}>
                                            Only {item.qty} left
                                        </div>
                                    </div>
                                    <Link to="/seller/inventory" className="text-xs font-bold" style={{ color: '#22C55E' }}>
                                        Restock →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="rounded-xl" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F8F9FA' }}>
                            <h3 className="text-sm font-black" style={{ color: '#0F172A' }}>Latest Reviews</h3>
                            <Link to="/seller/reviews" className="text-xs font-bold" style={{ color: '#22C55E' }}>View All</Link>
                        </div>
                        <div className="divide-y min-h-[140px] flex flex-col" style={{ borderColor: '#F8F9FA' }}>
                            {DEMO_REVIEWS.length > 0 ? DEMO_REVIEWS.map((r, i) => (
                                <div key={i} className="px-5 py-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold" style={{ color: '#0F172A' }}>{r.customer}</span>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <span key={j} style={{ color: j < r.rating ? '#F59E0B' : '#E2E8F0', fontSize: 11 }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs line-clamp-2 mb-1" style={{ color: '#64748B' }}>{r.text}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{r.product}</span>
                                        <Link to="/seller/reviews" className="text-[10px] font-bold" style={{ color: '#22C55E' }}>Reply →</Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 text-sm" style={{ color: '#94A3B8' }}>
                                    <Star className="w-6 h-6 opacity-20" />
                                    No reviews yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </SellerLayout>
    );
}
