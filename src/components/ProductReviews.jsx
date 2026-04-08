import React, { useState, useEffect, useCallback } from 'react';
import { Star, ThumbsUp, Pencil, Send } from 'lucide-react';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';
import useAuthStore from '../store/useAuthStore';

// ─── Star Rating Input ────────────────────────────────────────────────────────
function StarInput({ value, onChange, size = 24 }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110 active:scale-90"
                    style={{ lineHeight: 1 }}
                >
                    <Star
                        style={{
                            width: size, height: size,
                            color: '#F59E0B',
                            fill: n <= (hover || value) ? '#F59E0B' : 'none',
                            strokeWidth: 2
                        }}
                    />
                </button>
            ))}
        </div>
    );
}

// ─── Single Review Card ───────────────────────────────────────────────────────
function ReviewCard({ review }) {
    const displayName = review.userId?.fullName || 'User';
    const avatar = review.userId?.avatarUrl;
    const initial = (displayName[0] || 'U').toUpperCase();
    const date = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
        : '';

    return (
        <div className="py-5 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: '#8E867B' }}>
                    {avatar ? <img src={avatar} alt={displayName} className="w-full h-full object-cover" /> : initial}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[13px] text-gray-900">{displayName}</span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">{date}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} style={{ width: 13, height: 13, color: '#F59E0B', fill: n <= review.rating ? '#F59E0B' : 'none' }} />
                        ))}
                    </div>
                    {review.title && <p className="font-semibold text-sm text-gray-800 mb-1">{review.title}</p>}
                    {review.body && <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>}
                    {/* Seller reply */}
                    {review.sellerReply && (
                        <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-[11px] font-bold text-gray-500 mb-1">Seller Reply</p>
                            <p className="text-sm text-gray-600">{review.sellerReply}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Write / Edit Review Form ─────────────────────────────────────────────────
function ReviewForm({ productId, existingReview, onSubmitted }) {
    const { token } = useAuthStore();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [title, setTitle] = useState(existingReview?.title || '');
    const [body, setBody] = useState(existingReview?.body || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = Boolean(existingReview?._id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) { setError('Please select a star rating'); return; }
        if (!token) { setError('You must be logged in to review'); return; }
        setError('');
        setLoading(true);
        try {
            const payload = { productId, rating, title: title.trim(), body: body.trim() };
            let res;
            if (isEdit) {
                res = await api.put(`${API.REVIEWS}/${existingReview._id}`, payload);
            } else {
                res = await api.post(API.REVIEWS, payload);
            }
            if (res.data?.success) {
                onSubmitted(res.data.review, res.data.avgRating, res.data.totalReviews);
            } else {
                setError(res.data?.message || 'Something went wrong');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mt-2">
            <h3 className="font-bold text-[14px] text-gray-800 mb-4">
                {isEdit ? '✏️ Edit Your Review' : '✍️ Write a Review'}
            </h3>

            <div className="mb-4">
                <p className="text-[12px] font-semibold text-gray-500 mb-2">Your Rating *</p>
                <StarInput value={rating} onChange={setRating} size={28} />
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Review title (optional)"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 outline-none focus:border-[#22C55E] transition-colors"
                />
            </div>

            <div className="mb-4">
                <textarea
                    placeholder="Share your experience with this product..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-[#22C55E] transition-colors resize-none"
                />
            </div>

            {error && <p className="text-red-500 text-[12px] font-semibold mb-3">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-60"
                style={{ background: '#22C55E', boxShadow: '0 4px 12px rgba(34,197,94,0.25)' }}
            >
                {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                    <Send className="w-4 h-4" />
                )}
                {loading ? 'Submitting...' : isEdit ? 'Update Review' : 'Submit Review'}
            </button>
        </form>
    );
}

// ─── Rating Summary Bar ───────────────────────────────────────────────────────
function RatingSummary({ avgRating, totalReviews }) {
    const rounded = Math.round(avgRating * 10) / 10;
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="text-center flex-shrink-0">
                <div className="text-5xl font-black text-gray-900">{rounded || '—'}</div>
                <div className="flex items-center justify-center gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} style={{ width: 14, height: 14, color: '#F59E0B', fill: n <= Math.round(avgRating) ? '#F59E0B' : 'none' }} />
                    ))}
                </div>
                <div className="text-[11px] text-gray-400 font-semibold">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</div>
            </div>
        </div>
    );
}

// ─── Main ProductReviews Component ───────────────────────────────────────────
export default function ProductReviews({ productId }) {
    const { user, token } = useAuthStore();
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [myReview, setMyReview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = useCallback(async (p = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`${API.REVIEWS_BY_PRODUCT(productId)}?page=${p}&limit=8`);
            const d = res.data;
            if (d.success) {
                setReviews(p === 1 ? d.reviews : prev => [...prev, ...d.reviews]);
                setAvgRating(d.avgRating || 0);
                setTotalReviews(d.totalReviews || 0);
                setTotalPages(d.totalPages || 1);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    }, [productId]);

    const fetchMyReview = useCallback(async () => {
        if (!token) return;
        try {
            const res = await api.get(API.MY_REVIEW(productId));
            if (res.data.success) setMyReview(res.data.review);
        } catch { /* ignore */ }
    }, [productId, token]);

    useEffect(() => { fetchReviews(1); }, [fetchReviews]);
    useEffect(() => { fetchMyReview(); }, [fetchMyReview]);

    const handleReviewSubmitted = (review, avg, total) => {
        setMyReview(review);
        setShowForm(false);
        setAvgRating(avg || avgRating);
        setTotalReviews(total || totalReviews);
        // Refresh reviews list
        fetchReviews(1);
    };

    return (
        <div className="mt-8 pt-8" style={{ borderTop: '1px solid #E8E0D6' }}>
            <h2 className="text-xl font-heading font-black text-gray-900 mb-6">
                Ratings & Reviews
            </h2>

            <RatingSummary avgRating={avgRating} totalReviews={totalReviews} />

            {/* CTA to write review */}
            {user && !showForm && (
                <div className="mb-6">
                    {myReview ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#22C55E] text-[#22C55E] font-bold text-sm transition-all hover:bg-[#F0FDF4]"
                        >
                            <Pencil className="w-4 h-4" /> Edit Your Review
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
                            style={{ background: '#1A1A1A' }}
                        >
                            <Star className="w-4 h-4" /> Write a Review
                        </button>
                    )}
                </div>
            )}

            {/* Review form */}
            {showForm && (
                <div className="mb-6">
                    <ReviewForm
                        productId={productId}
                        existingReview={myReview}
                        onSubmitted={handleReviewSubmitted}
                    />
                    <button
                        onClick={() => setShowForm(false)}
                        className="mt-2 text-sm text-gray-400 hover:text-gray-600 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Not logged in CTA */}
            {!user && (
                <p className="text-sm text-gray-500 mb-6">
                    <a href="/login" className="text-[#22C55E] font-semibold underline">Log in</a> to write a review.
                </p>
            )}

            {/* Reviews list */}
            {loading && reviews.length === 0 ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="py-5 border-b border-gray-100">
                            <div className="flex gap-3">
                                <div className="skeleton-shimmer w-9 h-9 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton-line md" />
                                    <div className="skeleton-line sm" style={{ width: '30%' }} />
                                    <div className="skeleton-line md" style={{ width: '80%' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                <div>
                    {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
                    {page < totalPages && (
                        <button
                            onClick={() => { const next = page + 1; setPage(next); fetchReviews(next); }}
                            className="mt-4 w-full py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Load More Reviews
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
