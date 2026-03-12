import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import useTryOnStore from '../store/useTryOnStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';
import { Star } from 'lucide-react';

export default function BusinessProfile() {
  const { id } = useParams();
  const { user, token } = useAuthStore();
  const { addToCart } = useCartStore();
  const { isIncognitoActive } = useFeatureStore();
  const { openTryOnForProduct } = useTryOnStore();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('idle');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, revRes] = await Promise.all([
          api.get(API.BUSINESS_BY_ID(id)),
          api.get(API.BUSINESS_REVIEWS(id))
        ]);

        if (bizRes?.data) setBusiness(bizRes.data);
        if (revRes?.data) setReviews(revRes.data);
      } catch (err) {
        console.error("Failed to load profile details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to leave a review.");
    setReviewStatus('submitting');

    try {
      const res = await api.post(API.BUSINESS_REVIEWS(id), { rating, comment });
      const data = res.data;

      if (data) {
        setReviewStatus('success');
        // Add new review to top of list
        setReviews([{ ...data, user: { email: user.email } }, ...reviews]);
        setComment('');
      } else {
        setReviewStatus('error');
      }
    } catch (err) {
      setReviewStatus('error');
      // Extract the most specific error message from the backend
      const errMsg = err.response?.data?.message || err.message || 'Error submitting review';
      alert(errMsg);
    }
  };

  if (loading) return <div className="min-h-screen bg-background pt-32 text-center text-gray-500">Loading Profile...</div>;
  if (!business) return <div className="min-h-screen bg-background pt-32 text-center text-[#080808] text-2xl font-semibold">Business not found.</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-black/5 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20" style={{ background: 'rgba(142,134,123,0.1)' }}></div>

          <Link to="/discover" className="text-sm font-semibold text-gray-400 hover:text-[#080808] transition-colors mb-8 inline-block relative z-10">← Back to Discover</Link>

          {business.logo && (
            <div className="w-20 h-20 rounded-3xl overflow-hidden mb-6 border border-black/5 p-1 bg-white shadow-sm relative z-10">
              <img src={typeof business.logo === 'object' ? business.logo.url : (business.logoUrl || business.logo)} alt={business.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B' }}>
            {business.category || 'Local Service'}
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-medium text-[#080808] tracking-tight mb-4 flex items-center gap-4">
            {business.name}
          </h1>

          <p className="text-gray-500 text-lg mb-8 max-w-2xl text-balance">
            {business.description || 'This business has not provided a detailed description yet.'}
          </p>

          {!isIncognitoActive && (
            <div className="flex flex-col md:flex-row gap-8 py-8 border-t border-b border-gray-100 mb-8">
              <div>
                <span className="block text-sm text-gray-400 font-medium mb-1">Address</span>
                <span className="text-[#080808] font-medium leading-relaxed">{business.address || 'Location information not available'}</span>
              </div>
              <div className="md:ml-auto">
                <span className="block text-sm text-gray-400 font-medium mb-1">Contact</span>
                <span className="text-[#080808] font-medium">{business.phone || business.email || 'No contact info provided'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        {business.products && business.products.length > 0 && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-black/5 shadow-sm mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-medium text-[#080808] mb-8">Products & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {business.products.map((product) => (
                <div key={product._id || product.name} className="border border-gray-100 rounded-3xl overflow-hidden group transition-colors shadow-sm relative flex flex-col" style={{ borderColor: 'rgba(142,134,123,0.1)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(142,134,123,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(142,134,123,0.1)'}>
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${isIncognitoActive ? 'blur-md scale-110' : 'group-hover:scale-105'}`} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-[#080808] mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold" style={{ color: '#8E867B' }}>${Number(product.price).toFixed(2)}</span>

                        {(product.garmentType && product.garmentType !== 'none') && (
                          <button
                            onClick={() => openTryOnForProduct(product)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 px-4 py-1.5 rounded-full text-xs font-bold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.4)] flex items-center gap-1 border border-yellow-300"
                          >
                            👗 Try This On
                          </button>
                        )}
                      </div>

                      <button
                        disabled={!product.inStock}
                        onClick={() => addToCart(product, business)}
                        className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-colors disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                        style={{ background: '#8E867B', color: '#F3F0E2' }}
                      >
                        {product.inStock ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-black/5 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-heading font-medium text-[#080808] mb-8">Community Reviews</h2>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-12 border border-black/5">
              <h3 className="font-semibold text-lg mb-4">Write a Review</h3>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-transform ${rating >= num ? '' : 'bg-white text-gray-300 border border-gray-200'} hover:scale-105`}
                      style={rating >= num ? { background: '#8E867B', color: '#F3F0E2' } : {}}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary min-h-[100px] resize-none mb-4"
                required
              />
              <button
                type="submit"
                disabled={reviewStatus === 'submitting'}
                className="px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
                style={{ background: '#8E867B', color: '#F3F0E2' }}
              >
                {reviewStatus === 'submitting' ? 'Posting...' : 'Post Review'}
              </button>
              {reviewStatus === 'success' && <p className="font-medium mt-4" style={{ color: '#8E867B' }}>Review posted successfully!</p>}
            </form>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-black/5 text-center">
              <p className="text-gray-500 mb-4">You must be logged in to leave a review.</p>
              <Link to="/" className="inline-block px-8 py-3 rounded-full font-semibold transition-colors" style={{ background: '#8E867B', color: '#F3F0E2' }}>
                Register or Login
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length > 0 ? reviews.map(review => (
              <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-[#080808] flex items-center gap-2">
                    {isIncognitoActive ? (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-sm border border-gray-200">
                        Anonymous Buyer
                      </span>
                    ) : (
                      <>{review.user?.email || 'Anonymous'}</>
                    )}
                  </div>
                  <div className="flex gap-1" style={{ color: '#8E867B' }}>
                    {Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
