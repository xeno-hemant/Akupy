import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, CheckCircle, XCircle, Save, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

// Helper to get initials avatar color
function getAvatarColor(name) {
    const colors = ['#22C55E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#10B981'];
    const idx = (name?.charCodeAt(0) || 65) % colors.length;
    return colors[idx];
}

export default function EditProfilePage() {
    const navigate = useNavigate();
    const { user, token, setAuth } = useAuthStore();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [phone, setPhone] = useState(''); // read-only
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Load current profile
    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(API.ME);
                const u = res.data.user || res.data;
                setForm({
                    fullName: u.fullName || '',
                    email: u.email || '',
                    city: u.city || '',
                    state: u.state || '',
                    pincode: u.pincode || '',
                });
                setPhone(u.phone || '');
                setAvatarUrl(u.avatarUrl || '');
            } catch (err) {
                console.error('Profile load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Name is required';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = 'Invalid email format';
        }
        if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
            errs.pincode = 'Pincode must be 6 digits';
        }
        return errs;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showToast('error', 'Please upload an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { showToast('error', 'Image must be under 5MB'); return; }

        setAvatarUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.post(API.UPLOAD, formData, true); // multipart
            const url = res.data.imageUrl;
            if (url) {
                // Save avatar URL to backend
                await api.put(API.PROFILE_AVATAR, { avatarUrl: url });
                setAvatarUrl(url);
                // Update auth store
                const meRes = await api.get(API.ME);
                const u = meRes.data.user || meRes.data;
                setAuth(u, token);
                showToast('success', 'Profile picture updated!');
            }
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setSaving(true);
        try {
            const res = await api.put(API.PROFILE_UPDATE, form);
            if (res.data.success) {
                // Update auth store with new user data
                const updatedUser = { ...user, ...res.data.user };
                setAuth(updatedUser, token);
                showToast('success', 'Profile updated successfully!');
            } else {
                showToast('error', res.data.message || 'Failed to save');
            }
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const initial = (form.fullName?.[0] || user?.email?.[0] || 'U').toUpperCase();
    const avatarBg = getAvatarColor(form.fullName || user?.email);

    return (
        <div className="min-h-screen pb-24" style={{ background: '#F5F0E8', paddingTop: '80px' }}>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 px-5 py-3 rounded-full shadow-lg text-sm font-bold transition-all ${
                    toast.type === 'success' ? 'bg-[#22C55E] text-white' : 'bg-[#EF4444] text-white'
                }`}>
                    {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            <div className="max-w-lg mx-auto px-4">
                {/* Back button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 mb-6 text-gray-500 font-semibold hover:text-gray-900 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </button>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Header with Avatar */}
                    <div className="px-6 py-8 text-center" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)' }}>
                        <div className="relative inline-block mb-4">
                            <div
                                className="w-24 h-24 rounded-full overflow-hidden mx-auto flex items-center justify-center text-3xl font-black text-white shadow-md"
                                style={{ background: avatarUrl ? 'transparent' : avatarBg }}
                            >
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : initial}
                            </div>

                            {/* Upload button overlay */}
                            <label
                                htmlFor="avatar-upload"
                                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-gray-100 shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                {avatarUploading ? (
                                    <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4 text-gray-500" />
                                )}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={avatarUploading}
                            />
                        </div>

                        <h1 className="text-xl font-black text-gray-900">Edit Profile</h1>
                        <p className="text-sm text-gray-500 mt-1">Tap the camera to change your photo</p>
                    </div>

                    {/* Form */}
                    {loading ? (
                        <div className="p-8 text-center text-gray-400 text-sm font-semibold">Loading...</div>
                    ) : (
                        <form onSubmit={handleSave} className="p-6 space-y-5">

                            {/* Phone (read-only) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Phone Number <span className="normal-case text-gray-400 font-normal">(cannot be changed)</span>
                                </label>
                                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <span className="text-gray-400">🇮🇳</span>
                                    <span className="font-semibold text-gray-400 text-sm">{phone || '+91 xxxxxxxxxx'}</span>
                                    <span className="ml-auto text-[10px] font-bold text-gray-300 uppercase tracking-wider">Locked</span>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={e => handleChange('fullName', e.target.value)}
                                    placeholder="Your full name"
                                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium text-gray-800 outline-none transition-all ${
                                        errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-[#22C55E] focus:bg-white'
                                    }`}
                                />
                                {errors.fullName && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    placeholder="your@email.com"
                                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium text-gray-800 outline-none transition-all ${
                                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-[#22C55E] focus:bg-white'
                                    }`}
                                />
                                {errors.email && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.email}</p>}
                            </div>

                            {/* Location row: City + State */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                                    <input
                                        type="text"
                                        value={form.city}
                                        onChange={e => handleChange('city', e.target.value)}
                                        placeholder="Mumbai"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-[#22C55E] focus:bg-white text-sm font-medium text-gray-800 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                                    <input
                                        type="text"
                                        value={form.state}
                                        onChange={e => handleChange('state', e.target.value)}
                                        placeholder="Maharashtra"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-[#22C55E] focus:bg-white text-sm font-medium text-gray-800 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pincode</label>
                                <input
                                    type="text"
                                    value={form.pincode}
                                    onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="400001"
                                    inputMode="numeric"
                                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium text-gray-800 outline-none transition-all ${
                                        errors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-[#22C55E] focus:bg-white'
                                    }`}
                                />
                                {errors.pincode && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.pincode}</p>}
                            </div>

                            {/* Save button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
                                style={{ background: '#22C55E', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}
                            >
                                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
