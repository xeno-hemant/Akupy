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
    <div className="min-h-screen bg-[#F0FDF4] p-8 md:p-16">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-black/5 p-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-heading font-medium text-[#080808]">Business Dashboard</h1>
          <button 
            onClick={logout}
            className="px-6 py-3 rounded-full border border-black/20 hover:bg-black/5 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-black/5">
          <h2 className="text-xl font-semibold mb-2 text-[#080808]">Account Details</h2>
          <div className="flex gap-8 mt-4 text-sm">
            <div><span className="text-gray-400 block">Email</span><span className="font-mono text-black">{user.email}</span></div>
            <div><span className="text-gray-400 block">Role</span><span className="capitalize text-primary font-medium">{user.role}</span></div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading profile data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-[#080808]">Public Profile</h2>
            
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
        )}
      </div>
    </div>
  );
}
