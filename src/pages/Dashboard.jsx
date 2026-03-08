import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    operatingHours: '',
    description: ''
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses/me`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            category: data.category || '',
            address: data.address || '',
            operatingHours: data.operatingHours || '',
            description: data.description || ''
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses`, {
        method: 'POST', // The upsertBusiness controller we made handles both Create and Update via POST
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-6 pt-28 md:p-16 md:pt-32">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-black/5 p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-medium text-[#080808]">Business Dashboard</h1>
          <button 
            onClick={logout}
            className="px-6 py-3 rounded-full border border-black/20 hover:bg-black/5 transition-colors font-medium w-full md:w-auto"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-black/5">
          <h2 className="text-xl font-semibold mb-2 text-[#080808]">Account Details</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-4 text-sm break-all">
            <div><span className="text-gray-400 block">Email</span><span className="font-mono text-black">{user.email}</span></div>
            <div><span className="text-gray-400 block">Account Type</span><span className="capitalize text-primary font-medium">{user.role === 'user' ? 'Shopper' : 'Business'}</span></div>
          </div>
        </div>

        {user.role === 'business' && (
          loading ? (
            <div className="py-12 text-center text-gray-500">Loading profile data...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-[#080808]">Public Storefront</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input 
                  type="text" 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                  placeholder="e.g. Coffee Shop, Web Design"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Operating Hours</label>
                <input 
                  type="text" 
                  value={formData.operatingHours} 
                  onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                  placeholder="e.g. Mon-Fri 9am-5pm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors min-h-[120px] resize-y"
                placeholder="Tell customers what makes your business special..."
              />
            </div>

            <div className="pt-6 flex items-center gap-4 border-t border-gray-100">
              <button 
                type="submit"
                disabled={saveStatus === 'saving'}
                className="bg-primary text-[#080808] font-semibold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Profile'}
              </button>
              
              {saveStatus === 'success' && <span className="text-green-600 font-medium">Profile updated successfully!</span>}
              {saveStatus === 'error' && <span className="text-red-600 font-medium">Error saving profile.</span>}
            </div>
          </form>
          )
        )}

        {user.role === 'user' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-[#080808]">My Activity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-primary rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Saved Stores</h3>
                <p className="text-gray-500 text-sm">You haven't saved any stores to your favorites yet.</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href="/discover" className="text-primary font-medium text-sm hover:underline">Explore businesses →</a>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">My Reviews</h3>
                <p className="text-gray-500 text-sm">Your past reviews and ratings will appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
