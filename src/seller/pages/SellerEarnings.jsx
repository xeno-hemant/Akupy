import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, Calendar, Download, Landmark } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import StatCard from '../components/StatCard';

const MONTHLY = Array(12).fill(0);
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const PAYOUTS = [];
const TRANSACTIONS = [];

function BarChart({ data, labels }) {
    const max = Math.max(...data);
    return (
        <div>
            <div className="flex items-end gap-2 h-40 mb-2">
                {data.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg transition-all duration-700 relative group"
                            style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? '#F59E0B' : '#22C55E', opacity: i === data.length - 1 ? 1 : 0.65 }}>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10"
                                style={{ background: '#0F172A', color: '#fff' }}>
                                ₹{(v / 1000).toFixed(1)}K
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex">
                {labels.map((l, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] font-semibold" style={{ color: i === labels.length - 1 ? '#F59E0B' : '#94A3B8' }}>{l}</div>
                ))}
            </div>
        </div>
    );
}

const payoutStatus = { paid: { bg: '#DCFCE7', color: '#16A34A', label: 'Paid' }, processing: { bg: '#FEF9C3', color: '#CA8A04', label: 'Processing' }, failed: { bg: '#FEE2E2', color: '#DC2626', label: 'Failed' } };

export default function SellerEarnings() {
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrew, setWithdrew] = useState(false);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => { setWithdrawing(false); setWithdrew(true); }, 2000);
    };

    return (
        <SellerLayout>
            <div className="space-y-6">

                {/* Top Stats */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard title="Total Earned (Lifetime)" value="₹0" icon={DollarSign} accentColor="#F59E0B" />
                    <StatCard title="This Month" value="₹0" trendValue="0%" trend="up" subtext="vs last month" icon={ArrowUpRight} accentColor="#22C55E" />
                    <StatCard title="Pending Payout" value="₹0" icon={Calendar} accentColor="#8B5CF6" />
                    <StatCard title="Next Payout Date" value="--" icon={Landmark} accentColor="#3B82F6" subtext="No pending payout" />
                </div>

                {/* Earnings Chart */}
                <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Monthly Earnings</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Last 12 months · Hover bars for details</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                            <Download className="w-3 h-3" /> Export
                        </button>
                    </div>
                    <BarChart data={MONTHLY} labels={MONTHS} />
                </div>

                {/* Withdraw */}
                <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #F59E0B30' }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black" style={{ color: '#78350F' }}>Pending Balance</h3>
                            <p className="text-3xl font-black mt-1" style={{ color: '#92400E' }}>₹0</p>
                            <p className="text-sm mt-1" style={{ color: '#B45309' }}>Available for withdrawal. Minimum payout: ₹500</p>
                            <div className="flex items-center gap-2 mt-2 text-sm font-semibold" style={{ color: '#B45309' }}>
                                <Landmark className="w-4 h-4" />
                                Linked: HDFC Bank ****4521
                            </div>
                        </div>
                        {withdrew ? (
                            <div className="px-6 py-3 rounded-xl font-bold text-white" style={{ background: '#22C55E' }}>✓ Withdrawal Requested!</div>
                        ) : (
                            <button onClick={handleWithdraw} disabled={withdrawing}
                                className="px-6 py-3 rounded-xl font-black text-base transition-all active:scale-95 shadow-lg disabled:opacity-70"
                                style={{ background: '#F59E0B', color: '#fff' }}
                                onMouseEnter={e => { if (!withdrawing) e.currentTarget.style.background = '#D97706'; }}
                                onMouseLeave={e => { if (!withdrawing) e.currentTarget.style.background = '#F59E0B'; }}>
                                {withdrawing ? 'Processing...' : 'Withdraw ₹12,300'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Payout History */}
                <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F8F9FA' }}>
                        <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Payout History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[550px]">
                            <thead style={{ borderBottom: '1px solid #F8F9FA' }}>
                                <tr>
                                    {['Payout ID', 'Date', 'Amount', 'Bank Account', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PAYOUTS.map((p, i) => {
                                    const s = payoutStatus[p.status];
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid #F8F9FA' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td className="px-4 py-3 text-sm font-bold" style={{ color: '#22C55E' }}>{p.id}</td>
                                            <td className="px-4 py-3 text-sm" style={{ color: '#0F172A' }}>{p.date}</td>
                                            <td className="px-4 py-3 text-sm font-black" style={{ color: '#0F172A' }}>{p.amount}</td>
                                            <td className="px-4 py-3 text-sm font-mono" style={{ color: '#64748B' }}>{p.bank}</td>
                                            <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F8F9FA' }}>
                        <h3 className="text-base font-black" style={{ color: '#0F172A' }}>Transaction History</h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                            <Download className="w-3 h-3" /> Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead style={{ borderBottom: '1px solid #F8F9FA' }}>
                                <tr>
                                    {['Order ID', 'Product', 'Buyer', 'Sale Amount', 'Platform Fee', 'Net Earned', 'Date'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TRANSACTIONS.map((t, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #F8F9FA' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-4 py-3 text-xs font-black" style={{ color: '#22C55E' }}>{t.orderId}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: '#0F172A' }}>{t.product}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: '#64748B' }}>{t.buyer}</td>
                                        <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#0F172A' }}>{t.amount}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: '#EF4444' }}>-{t.fee}</td>
                                        <td className="px-4 py-3 text-sm font-black" style={{ color: '#22C55E' }}>{t.net}</td>
                                        <td className="px-4 py-3 text-xs" style={{ color: '#94A3B8' }}>{t.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </SellerLayout>
    );
}
