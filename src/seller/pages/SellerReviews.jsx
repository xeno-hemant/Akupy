import React, { useState } from 'react';
import { Star, Send, ChevronDown } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';

const GREEN = '#22C55E';

const REVIEWS = [
    { id: 1, customer: 'Priya S.', initials: 'PS', rating: 5, text: 'Absolutely love the quality! The fabric is super soft and the fit is perfect. Will definitely buy from this shop again. Highly recommend!', product: 'Acid Wash Oversized Tee', productEmoji: '👕', date: 'Mar 10, 2026', helpful: 12, reply: '' },
    { id: 2, customer: 'Rahul M.', initials: 'RM', rating: 4, text: 'Great product overall. The headphones sound quality is amazing. Packaging could have been a bit better, but the product itself is 10/10.', product: 'Sony WH-1000XM5', productEmoji: '🎧', date: 'Mar 9, 2026', helpful: 8, reply: 'Thank you Rahul! We are working on improving our packaging. Glad you love the sound quality!' },
    { id: 3, customer: 'Ayesha K.', initials: 'AK', rating: 5, text: 'The monstera arrived in perfect condition, well-packed with care. Healthy leaves, beautiful plant. Worth every rupee!', product: 'Monstera Deliciosa', productEmoji: '🌿', date: 'Mar 8, 2026', helpful: 24, reply: '' },
    { id: 4, customer: 'Vikram S.', initials: 'VS', rating: 3, text: 'The wallet is decent quality but the stitching on one corner seems a bit off. Customer service was helpful though.', product: 'Leather Bifold Wallet', productEmoji: '👜', date: 'Mar 7, 2026', helpful: 3, reply: '' },
    { id: 5, customer: 'Sneha P.', initials: 'SP', rating: 5, text: 'The candles smell absolutely divine! They last for hours. Already ordered a second set as gifts.', product: 'Soy Wax Candle Set', productEmoji: '🕯️', date: 'Mar 6, 2026', helpful: 18, reply: '' },
];

const RATING_DIST = [
    { stars: 5, pct: 60, count: 144 },
    { stars: 4, pct: 25, count: 60 },
    { stars: 3, pct: 10, count: 24 },
    { stars: 2, pct: 3, count: 7 },
    { stars: 1, pct: 2, count: 5 },
];

function Stars({ n, small }) {
    return (
        <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < n ? '#F59E0B' : '#E2E8F0', fontSize: small ? 12 : 16 }}>★</span>
            ))}
        </div>
    );
}

export default function SellerReviews() {
    const [filter, setFilter] = useState('all');
    const [reviews, setReviews] = useState(REVIEWS);
    const [replyOpen, setReplyOpen] = useState(null);
    const [replyText, setReplyText] = useState('');

    const filtered = filter === 'all' ? reviews :
        filter === 'negative' ? reviews.filter(r => r.rating <= 3) :
            filter === 'unreplied' ? reviews.filter(r => !r.reply) :
                reviews.filter(r => r.rating === Number(filter));

    const submitReply = (id) => {
        if (!replyText.trim()) return;
        setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r));
        setReplyOpen(null);
        setReplyText('');
    };

    const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

    return (
        <SellerLayout>
            <div className="space-y-5">

                {/* Rating Summary */}
                <div className="rounded-xl p-6" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="text-center flex-shrink-0">
                            <div className="text-6xl font-black" style={{ color: '#0F172A' }}>{avgRating}</div>
                            <Stars n={Math.round(avgRating)} />
                            <div className="text-xs mt-1 font-semibold" style={{ color: '#94A3B8' }}>240 reviews</div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                            {RATING_DIST.map(({ stars, pct, count }) => (
                                <div key={stars} className="flex items-center gap-3">
                                    <button className="text-xs font-bold flex-shrink-0 w-4 text-right" style={{ color: '#64748B' }}
                                        onClick={() => setFilter(String(stars))}>
                                        {stars}★
                                    </button>
                                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: '#F59E0B' }} />
                                    </div>
                                    <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#94A3B8' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex gap-2 flex-wrap">
                    {['all', '5', '4', '3', 'negative', 'unreplied'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all border"
                            style={filter === f
                                ? { background: GREEN, color: '#fff', borderColor: GREEN }
                                : { background: '#fff', color: '#64748B', borderColor: '#E2E8F0' }
                            }>
                            {f === 'all' ? 'All' : f === 'negative' ? '⚠ Critical' : f === 'unreplied' ? '💬 Unreplied' : `${f}★`}
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filtered.map(r => (
                        <div key={r.id} className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                                    style={{ background: '#F0FDF4', color: GREEN }}>
                                    {r.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm" style={{ color: '#0F172A' }}>{r.customer}</span>
                                            <Stars n={r.rating} small />
                                        </div>
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>{r.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-base">{r.productEmoji}</span>
                                        <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>{r.product}</span>
                                    </div>
                                    <p className="text-sm mt-2 leading-relaxed" style={{ color: '#374151' }}>{r.text}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>👍 {r.helpful} helpful</span>
                                        {!r.reply && (
                                            <button className="text-xs font-bold flex items-center gap-1" style={{ color: GREEN }}
                                                onClick={() => setReplyOpen(r.id === replyOpen ? null : r.id)}>
                                                <Send className="w-3 h-3" /> Reply
                                            </button>
                                        )}
                                    </div>

                                    {/* Existing Reply */}
                                    {r.reply && (
                                        <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: '#F0FDF4', borderLeft: `3px solid ${GREEN}` }}>
                                            <p className="text-xs font-black mb-1" style={{ color: GREEN }}>Your reply:</p>
                                            <p style={{ color: '#374151' }}>{r.reply}</p>
                                        </div>
                                    )}

                                    {/* Reply input */}
                                    {replyOpen === r.id && !r.reply && (
                                        <div className="mt-3 flex gap-2">
                                            <textarea
                                                rows={2}
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                placeholder="Write your reply..."
                                                className="flex-1 px-3 py-2 text-sm rounded-xl border-2 outline-none resize-none"
                                                style={{ borderColor: GREEN, background: '#F8FAFC', color: '#1E293B' }}
                                            />
                                            <button onClick={() => submitReply(r.id)}
                                                className="px-3 py-2 rounded-xl text-sm font-bold text-white flex-shrink-0 self-end"
                                                style={{ background: GREEN }}>
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="py-12 text-center" style={{ color: '#94A3B8' }}>
                            <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-semibold">No reviews found for this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
