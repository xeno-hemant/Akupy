import React, { useState, useEffect } from 'react';
import { DollarSign, Package, Eye, TrendingUp, Ticket, MapPin, Headphones, Smartphone, User as UserIcon, Star, History, Heart, Bell, Globe, ChevronRight, Pencil } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const getApiUrl = () => {
  if (!import.meta.env.DEV && window.location.hostname.includes('akupy.in')) {
    return 'https://akupybackend.onrender.com';
  }
  return `http://${window.location.hostname}:5000`;
};
const QuickAction = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center h-20 w-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group p-3"
  >
    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:scale-110" style={{ background: `${color}15`, color: color }}>
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <span className="text-[12px] font-bold text-gray-800 tracking-tight">{label}</span>
  </button>
);

const Section = ({ title, children }) => (
  <div className="animate-fade-in mt-4">
    <h3 className="text-[14px] font-bold mb-2 text-[#1A1A1A] px-1">{title}</h3>
    <div className="bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
      {children}
    </div>
  </div>
);

const ListItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between h-11 px-3 border-b border-gray-50 last:border-0 group transition-colors hover:bg-gray-50/50 rounded-lg"
  >
    <div className="flex items-center gap-3 text-gray-700">
      <div className="transition-colors">
        {React.cloneElement(icon, { className: 'w-[18px] h-[18px]' })}
      </div>
      <span className="text-[13px] font-semibold">{label}</span>
    </div>
    <ChevronRight className="w-[14px] h-[14px] text-gray-300 group-hover:text-gray-500 transition-colors" />
  </button>
);

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Form State
  const [formData, setFormData] = useState({
    // Business specific
    name: '',
    shopId: '',
    category: '',
    address: '',
    operatingHours: '',
    description: '',
    products: [],
    // Consumer/Shopper specific
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        if (user.role === 'seller') {
          const res = await fetch(`${getApiUrl()}/api/businesses/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              name: data.name || '',
              shopId: data.shopId || '',
              category: data.category || '',
              address: data.address || '',
              operatingHours: data.operatingHours || '',
              description: data.description || '',
              products: data.products || []
            }));
          }
        } else {
          // Fetch Consumer Profile
          const res = await fetch(`${getApiUrl()}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              fullName: data.fullName || '',
              email: data.email || '',
              address: data.address || '',
              phone: data.phone || '',
              avatarUrl: data.avatarUrl || ''
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    try {
      const endpoint = user.role === 'seller' ? '/api/businesses' : '/api/auth/profile';
      const method = user.role === 'seller' ? 'POST' : 'PUT';

      const res = await fetch(`${getApiUrl()}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errorData = await res.json();
        setSaveStatus(errorData.message || 'error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', description: '', price: '', imageUrl: '', inStock: true }]
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    if (field === 'price') {
      updatedProducts[index][field] = Number(value) || 0;
    } else {
      updatedProducts[index][field] = value;
    }
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const handleImageUpload = async (index, file, isAvatar = false) => {
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch(`${getApiUrl()}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });

      if (res.ok) {
        const data = await res.json();
        const baseUrl = getApiUrl();
        const fullUrl = baseUrl + data.imageUrl;
        
        if (isAvatar) {
          setFormData(prev => ({ ...prev, avatarUrl: fullUrl }));
          // Auto-save avatar for shopper
          await fetch(`${getApiUrl()}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...formData, avatarUrl: fullUrl })
          });
        } else {
          handleProductChange(index, 'imageUrl', fullUrl);
        }
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-4 md:py-10 page-bottom-padding" style={{ background: '#F5F5F7' }}>
      <div className={`max-w-xl mx-auto ${user.role !== 'seller' ? 'shadow-sm border border-gray-100 min-h-[calc(100vh-160px)] pb-20' : 'p-5 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border shadow-sm'}`} style={{ background: '#FFFFFF', borderColor: '#F3F4F6' }}>
        {user.role === 'seller' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-heading font-bold" style={{ color: '#1A1A1A' }}>Business Dashboard</h1>
            <button
              onClick={logout}
              className="px-6 py-2.5 md:py-3 rounded-full border-2 font-semibold w-full md:w-auto text-sm md:text-base transition-colors"
              style={{ borderColor: '#EF4444', color: '#EF4444' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
            >
              Logout
            </button>
          </div>
        )}


        {user.role === 'seller' && (
          loading ? (
            <div className="py-12 text-center text-gray-500">Loading profile data...</div>
          ) : (
            <div className="space-y-12 animate-fade-in">
              {/* Analytics Header */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-[#080808]">Business Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Earnings */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#DCFCE7', color: '#22C55E' }}>
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Earnings</p>
                      <h4 className="text-2xl font-heading font-bold text-[#080808]">
                        ${(formData.products || []).reduce((acc, curr, idx) => acc + (Number(curr.price || 0) * (idx % 3 + 1)), 0).toFixed(2)}
                      </h4>
                      <p className="text-xs font-medium flex items-center gap-1 mt-1" style={{ color: '#22C55E' }}><TrendingUp className="w-3 h-3" /> Based on simulation</p>
                    </div>
                  </div>

                  {/* Items Sold */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Items Sold</p>
                      <h4 className="text-2xl font-heading font-bold text-[#080808]">
                        {(formData.products || []).length * 12 || '0'}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">Total lifetime sales</p>
                    </div>
                  </div>

                  {/* Store Views */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                      <Eye className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Store Views</p>
                      <h4 className="text-2xl font-heading font-bold text-[#080808]">
                        {(formData.products || []).length * 452 || '0'}
                      </h4>
                      <p className="text-xs font-medium flex items-center gap-1 mt-1" style={{ color: '#c4a882' }}>This month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6 text-[#080808]">Recent Transactions</h2>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden">
                  {(formData.products || []).length > 0 ? (
                    <div className="space-y-4">
                      {formData.products.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#080808]">Guest Checkout</span>
                            <span className="text-sm text-gray-500">Purchased 1x {item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold" style={{ color: '#7a9e7e' }}>+${Number(item.price).toFixed(2)}</span>
                            <span className="block text-xs text-gray-400">Just now</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      No transactions recorded yet. Add products to your catalog to begin selling.
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 my-8 md:my-10" />

              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-[#080808]">Public Storefront Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Shop ID (Unique Link)</label>
                    <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-200 focus-within:border-primary transition-colors">
                      <input
                        type="text"
                        value={formData.shopId}
                        onChange={(e) => setFormData({ ...formData, shopId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="w-full px-4 py-3 bg-transparent outline-none transition-colors"
                        placeholder="e.g. zudio"
                      />
                      <span className="flex items-center px-4 bg-gray-100 text-gray-500 font-mono text-sm border-l border-gray-200">.akupy.in</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Operating Hours</label>
                    <input
                      type="text"
                      value={formData.operatingHours}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                      placeholder="e.g. Mon-Fri 9am-5pm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors min-h-[120px] resize-y"
                    placeholder="Tell customers what makes your business special..."
                  />
                </div>

                {/* Product Catalog Management */}
                <div className="pt-8 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-[#080808]">Product Catalog</h3>
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(142,134,123,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(142,134,123,0.1)'}
                    >
                      + Add Product
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.products.map((product, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-sm font-medium"
                        >
                          Remove
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Product Name</label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none transition-colors text-sm"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Price ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={product.price}
                              onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none transition-colors text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1 mb-4">
                          <label className="text-xs font-semibold text-gray-500 uppercase">Image</label>
                          <div className="flex flex-col md:flex-row gap-3">
                            <input
                              type="url"
                              value={product.imageUrl}
                              onChange={(e) => handleProductChange(index, 'imageUrl', e.target.value)}
                              className="flex-grow px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none transition-colors text-sm"
                              placeholder="Paste URL or upload file..."
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button
                                type="button"
                                className="w-full md:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors"
                              >
                                Upload File
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                          <textarea
                            value={product.description}
                            onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none transition-colors text-sm min-h-[60px] resize-y"
                          />
                        </div>
                      </div>
                    ))}

                    {formData.products.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                        No products added yet. Click "+ Add Product" to build your catalog.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-4 border-t border-gray-100 mt-8">
                  <button
                    type="submit"
                    disabled={saveStatus === 'saving'}
                    className="font-semibold px-8 py-4 rounded-xl transition-colors disabled:opacity-70"
                    style={{ background: '#8E867B', color: '#F3F0E2' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#3d3830'}
                    onMouseLeave={e => e.currentTarget.style.background = '#8E867B'}
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Profile'}
                  </button>

                  {saveStatus === 'success' && <span className="font-medium" style={{ color: '#7a9e7e' }}>Profile updated successfully!</span>}
                  {saveStatus !== 'idle' && saveStatus !== 'saving' && saveStatus !== 'success' && (
                    <span className="font-medium" style={{ color: '#b5776e' }}>
                      {saveStatus === 'error' ? 'Error saving profile.' : saveStatus}
                    </span>
                  )}
                </div>
              </form>
            </div>
          )
        )}

        {user.role !== 'seller' && (
          loading ? (
            <div className="py-12 text-center text-gray-500">Loading profile data...</div>
          ) : (
            <div className="animate-fade-in">
              {/* User Banner */}
              <div className="px-6 py-10 md:py-12 mb-8 flex justify-between items-center border-b border-gray-100" style={{ background: '#EEF2FF', color: '#1A1A1A' }}>
                <div>
                  <h2 className="text-[13px] font-semibold opacity-70 tracking-wide uppercase mb-1">Welcome back,</h2>
                  <h1 className="text-[22px] md:text-[26px] font-black tracking-tight">{formData.fullName || user?.email?.split('@')[0] || 'User'}</h1>
                </div>
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input').click()}>
                  <input 
                    type="file" 
                    id="avatar-input" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(null, e.target.files[0], true)}
                  />
                  <div className="w-12 h-12 rounded-full shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: '#22C55E' }}>
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-[24px] font-bold">{(formData.fullName || user?.email || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-8">
                {/* Quick Actions Grid (2x2) */}
                <div className="grid grid-cols-2 gap-2">
                  <QuickAction
                    icon={<Package className="w-6 h-6" />}
                    label="My Orders"
                    onClick={() => navigate('/orders')}
                    color="#6366F1"
                  />
                  <QuickAction
                    icon={<Ticket className="w-6 h-6" />}
                    label="Coupons"
                    onClick={() => navigate('/coupons')}
                    color="#F59E0B"
                  />
                  <QuickAction
                    icon={<MapPin className="w-6 h-6" />}
                    label="Addresses"
                    onClick={() => navigate('/addresses')}
                    color="#10B981"
                  />
                  <QuickAction
                    icon={<Headphones className="w-6 h-6" />}
                    label="Help Center"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-ai-help'))}
                    color="#EC4899"
                  />
                </div>

                {/* Account Settings */}
                <Section title="Account Settings">
                  <ListItem icon={<Smartphone className="w-5 h-5" />} label="Manage Devices" onClick={() => navigate('/devices')} />
                  <ListItem icon={<UserIcon className="w-5 h-5" />} label="Edit Profile" onClick={() => navigate('/edit-profile')} />
                </Section>

                {/* My Activity */}
                <Section title="My Activity">
                  <ListItem icon={<Star className="w-5 h-5" />} label="Reviews & Ratings" onClick={() => navigate('/reviews')} />
                  <ListItem icon={<History className="w-5 h-5" />} label="Order History" onClick={() => navigate('/orders')} />
                  <ListItem icon={<Heart className="w-5 h-5" />} label="Wishlist" onClick={() => navigate('/wishlist')} />
                </Section>

                {/* Preferences */}
                <Section title="Preferences">
                  <div className="flex items-center justify-between h-11 px-3 border-b border-gray-50 last:border-0 group">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Bell className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold">Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked={localStorage.getItem('akupy_notifications') === 'true'}
                        onChange={(e) => localStorage.setItem('akupy_notifications', e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between h-11 px-3 last:border-0 group">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Globe className="w-[18px] h-[18px]" />
                      <span className="text-[13px] font-semibold">Language</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 font-medium text-xs">
                      English <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Section>

                {/* Logout Button */}
                <div className="pt-2 pb-12">
                  <button
                    onClick={logout}
                    className="w-full h-11 rounded-xl font-bold text-[14px] transition-all active:scale-[0.98] border border-[#FEE2E2] bg-[#FFF5F5]"
                    style={{ color: '#EF4444' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
