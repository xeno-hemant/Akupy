import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';

export default function BusinessProfile() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { isIncognitoActive } = useFeatureStore();
  
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
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses/${id}`),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses/${id}/reviews`)
        ]);

        if (bizRes.ok) setBusiness(await bizRes.json());
        if (revRes.ok) setReviews(await revRes.json());
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses/${id}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await res.json();
      
      if (res.ok) {
        setReviewStatus('success');
        // Add new review to top of list
        setReviews([{...data, user: { email: user.email }}, ...reviews]);
        setComment('');
      } else {
        setReviewStatus('error');
        alert(data.message || 'Error submitting review');
      }
    } catch (err) {
      setReviewStatus('error');
    }
  };

  if (loading) return <div className="min-h-screen bg-background pt-32 text-center text-gray-500">Loading Profile...</div>;
  if (!business) return <div className="min-h-screen bg-background pt-32 text-center text-[#080808] text-2xl font-semibold">Business not found.</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-black/5 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <Link to="/discover" className="text-sm font-semibold text-gray-400 hover:text-[#080808] transition-colors mb-8 inline-block relative z-10">← Back to Discover</Link>
          
          <div className="inline-block px-4 py-2 bg-green-50 text-primary rounded-full text-sm font-semibold mb-6">
            {business.category || 'Local Service'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-medium text-[#080808] tracking-tight mb-4">
            {isIncognitoActive ? 'Anonymous Store' : business.name}
          </h1>
          
          <p className="text-gray-500 text-lg mb-8 max-w-2xl text-balance">
            {isIncognitoActive 
              ? 'Store details are hidden while browsing in Incognito mode to protect your privacy and ensure unbiased shopping.' 
              : (business.description || 'This business has not provided a detailed description yet.')}
          </p>

          <div className="flex flex-col md:flex-row gap-8 py-8 border-t border-b border-gray-100 mb-8">
            <div>
              <span className="block text-sm text-gray-400 font-medium mb-1">Operating Hours</span>
              <span className="text-[#080808] font-medium">{business.operatingHours || 'Not specified'}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-400 font-medium mb-1">Address</span>
              <span className="text-[#080808] font-medium">{isIncognitoActive ? 'Hidden in Incognito' : (business.address || 'Address pending')}</span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        {business.products && business.products.length > 0 && (
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-black/5 shadow-sm mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-medium text-[#080808] mb-8">Products & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {business.products.map((product) => (
                <div key={product._id || product.name} className="border border-gray-100 rounded-3xl overflow-hidden group hover:border-primary/30 transition-colors shadow-sm relative flex flex-col">
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
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <span className="text-xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                      <button 
                        disabled={!product.inStock}
                        onClick={() => addToCart(product, business)}
                        className="bg-[#080808] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-black/80 transition-colors disabled:opacity-50 active:scale-95"
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
                  {[1,2,3,4,5].map(num => (
                    <button 
                      type="button" 
                      key={num}
                      onClick={() => setRating(num)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-transform ${rating >= num ? 'bg-primary text-[#080808]' : 'bg-white text-gray-300 border border-gray-200'} hover:scale-105`}
                    >
                      ★
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
                className="bg-[#080808] text-white px-8 py-3 rounded-full font-semibold hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {reviewStatus === 'submitting' ? 'Posting...' : 'Post Review'}
              </button>
              {reviewStatus === 'success' && <p className="text-primary font-medium mt-4">Review posted successfully!</p>}
            </form>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-black/5 text-center">
              <p className="text-gray-500 mb-4">You must be logged in to leave a review.</p>
              <Link to="/" className="inline-block bg-[#080808] text-white px-8 py-3 rounded-full font-semibold hover:bg-black/80 transition-colors">
                Register or Login
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length > 0 ? reviews.map(review => (
              <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-[#080808]">{review.user?.email || 'Anonymous'}</div>
                  <div className="flex gap-1 text-primary">
                    {Array.from({length: review.rating}).map((_, i) => <span key={i}>★</span>)}
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
