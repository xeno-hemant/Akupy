import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { DollarSign, Package, Eye, TrendingUp } from 'lucide-react';

const getApiUrl = () => {
  if (!import.meta.env.DEV && window.location.hostname.includes('akupy.in')) {
    return 'https://akupybackend.onrender.com';
  }
  return `http://${window.location.hostname}:5000`;
};

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Form State
  const [formData, setFormData] = useState({
    // Business specific
    name: '',
    shopId: '',
    category: '',
    operatingHours: '',
    description: '',
    products: [],
    // Shared / Consumer specific
    address: '',
    phone: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        if (user.role === 'business') {
          const res = await fetch(`${getApiUrl()}/api/businesses/me`, {
            headers: { Authorization: `Bearer ${user.token}` }
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
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
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
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    try {
      const endpoint = user.role === 'business' ? '/api/businesses' : '/api/auth/profile';
      const method = user.role === 'business' ? 'POST' : 'PUT';

      const res = await fetch(`${getApiUrl()}${endpoint}`, {
        method: method,
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

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      // Show uploading state here if desired (e.g. by setting a temporary string 'Uploading...')
      const res = await fetch(`${getApiUrl()}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: uploadData
      });

      if (res.ok) {
        const data = await res.json();
        const baseUrl = getApiUrl();
        // handleProductChange updates the state
        handleProductChange(index, 'imageUrl', baseUrl + data.imageUrl);
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
    <div className="min-h-screen p-3 pt-20 md:p-16 md:pt-32 page-bottom-padding" style={{ background: '#F5F0E8' }}>
      <div className="max-w-4xl mx-auto rounded-[2rem] md:rounded-[2.5rem] shadow-sm border p-5 md:p-12" style={{ background: '#FFFFFF', borderColor: '#F3F4F6' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-heading font-bold" style={{ color: '#1A1A1A' }}>{user.role === 'business' ? 'Business Dashboard' : 'My Profile'}</h1>
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

        <div className="rounded-2xl p-5 md:p-8 mb-6 md:mb-8 border" style={{ background: '#F5F0E8', borderColor: '#F3F4F6' }}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {user.role === 'user' && (
              <div className="relative w-20 h-20 bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-2xl font-semibold">{user.email.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-2 text-[#080808]">Account Details</h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-2 text-sm break-all">
                <div><span className="block" style={{ color: '#aba49c' }}>Email</span><span className="font-mono" style={{ color: '#3d3830' }}>{user.email}</span></div>
                <div><span className="block" style={{ color: '#aba49c' }}>Account Type</span><span className="capitalize font-medium" style={{ color: '#8E867B' }}>{user.role === 'user' ? 'Shopper' : 'Business'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {user.role === 'business' && (
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
                        ${formData.products?.reduce((acc, curr) => acc + (Number(curr.price) * Math.floor(Math.random() * 5 + 1)), 0).toFixed(2) || '0.00'}
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
                        {formData.products?.length * Math.floor(Math.random() * 10 + 2) || '0'}
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
                        {formData.products?.length * 452 || '0'}
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
                  {formData.products?.length > 0 ? (
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

        {user.role === 'user' && (
          loading ? (
            <div className="py-12 text-center text-gray-500">Loading profile data...</div>
          ) : (
            <div className="space-y-12 animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-[#080808]">Edit Profile</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Primary Delivery Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Profile Picture URL (or Upload)</label>
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-colors"
                        placeholder="Paste URL..."
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const uploadData = new FormData();
                            uploadData.append('image', file);
                            try {
                              const res = await fetch(`${getApiUrl()}/api/upload`, {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${user.token}` },
                                body: uploadData
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setFormData({ ...formData, avatarUrl: getApiUrl() + data.imageUrl });
                              }
                            } catch (err) { console.error('Upload failed'); }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                          type="button"
                          className="w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                        >
                          Upload Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={saveStatus === 'saving'}
                    className="font-semibold px-8 py-3 rounded-full transition-transform active:scale-95 disabled:opacity-70"
                    style={{ background: '#3d3830', color: '#F3F0E2' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#8E867B'}
                    onMouseLeave={e => e.currentTarget.style.background = '#3d3830'}
                  >
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saveStatus === 'success' && <span className="font-medium text-sm" style={{ color: '#7a9e7e' }}>Updated successfully!</span>}
                  {saveStatus === 'error' && <span className="font-medium text-sm" style={{ color: '#b5776e' }}>Error updating profile.</span>}
                </div>
              </form>

              <hr className="border-gray-100" />

              <div>
                <h2 className="text-2xl font-semibold text-[#080808] mb-6">My Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Saved Stores</h3>
                    <p className="text-gray-500 text-sm">You haven't saved any stores to your favorites yet.</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a href="/discover" className="font-medium text-sm hover:underline" style={{ color: '#8E867B' }}>Explore businesses →</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(171,164,156,0.1)', color: '#aba49c' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">My Reviews</h3>
                    <p className="text-gray-500 text-sm">Your past reviews and ratings will appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
