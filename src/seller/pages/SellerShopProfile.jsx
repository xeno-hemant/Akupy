import React, { useState, useEffect } from 'react';
import { Upload, Save, Instagram, Globe, Facebook, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SellerLayout from '../layout/SellerLayout';
import useAuthStore from '../../store/useAuthStore';
import API from '../../config/apiRoutes';
import api from '../../utils/apiHelper';

const GREEN = '#22C55E';

function Field({ label, children, hint }) {
    return (
        <div>
            <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>{label}</label>
            {children}
            {hint && <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{hint}</p>}
        </div>
    );
}

function Input({ ...props }) {
    const [f, setF] = useState(false);
    return (
        <input {...props}
            className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-medium"
            style={{ background: '#F8FAFC', borderColor: f ? GREEN : '#E2E8F0', color: '#1E293B', ...props.style }}
            onFocus={e => { setF(true); props.onFocus?.(e); }}
            onBlur={e => { setF(false); props.onBlur?.(e); }}
        />
    );
}

function Textarea({ rows = 4, ...props }) {
    const [f, setF] = useState(false);
    return (
        <textarea rows={rows} {...props}
            className="w-full px-3 py-2.5 text-sm rounded-lg border-2 outline-none font-medium resize-none"
            style={{ background: '#F8FAFC', borderColor: f ? GREEN : '#E2E8F0', color: '#1E293B' }}
            onFocus={e => { setF(true); props.onFocus?.(e); }}
            onBlur={e => { setF(false); props.onBlur?.(e); }}
        />
    );
}

export default function SellerShopProfile() {
    const navigate = useNavigate();
    const { user, token } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [banner, setBanner] = useState(null);
    const [logo, setLogo] = useState(null);
    const [form, setForm] = useState({
        shopName: user?.businessName || '',
        tagline: '',
        businessType: 'individual',
        gst: '',
        address: '',
        email: user?.email || '',
        phone: '',
        returnPolicy: 'Returns accepted within 7 days of delivery for unused items in original packaging.',
        shippingPolicy: 'Orders are processed within 1-2 business days. Delivery in 3-7 business days.',
        instagram: '',
        facebook: '',
        website: '',
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(API.SELLER_SHOP);
                const d = res.data;
                const shop = d.shop || d; // Handle both direct and nested response
                setForm({
                    shopName: shop.name || '',
                    tagline: shop.tagline || '',
                    businessType: shop.businessType || 'individual',
                    gst: shop.gst || '',
                    address: shop.address || '',
                    email: shop.email || user?.email || '',
                    phone: shop.phone || '',
                    returnPolicy: shop.returnPolicy || 'Returns accepted within 7 days of delivery for unused items in original packaging.',
                    shippingPolicy: shop.shippingPolicy || 'Orders are processed within 1-2 business days. Delivery in 3-7 business days.',
                    instagram: shop.socialLinks?.instagram || '',
                    facebook: shop.socialLinks?.facebook || '',
                    website: shop.socialLinks?.website || '',
                });
                setLogo(shop.logo);
                setBanner(shop.banner);
            } catch (err) {
                console.error("Error loading shop profile:", err);
            }
        };
        load();
    }, [user]);

    const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleUpload = async (file, type) => {
        if (!file) return;
        const data = new FormData();
        data.append('image', file);
        try {
            const res = await api.post(API.UPLOAD, data, true);
            const url = res.data.imageUrl; // Absolute Cloudinary URL
            if (type === 'logo') setLogo(url);
            else setBanner(url);
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleSave = async (e) => {
        e?.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: form.shopName,
                tagline: form.tagline,
                businessType: form.businessType,
                gst: form.gst,
                address: form.address,
                email: form.email,
                phone: form.phone,
                returnPolicy: form.returnPolicy,
                shippingPolicy: form.shippingPolicy,
                socialLinks: {
                    instagram: form.instagram,
                    facebook: form.facebook,
                    website: form.website
                },
                logo,
                banner
            };

            const res = await api.put(API.SELLER_SHOP, payload);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Save failed:", err);
            const msg = err.response?.data?.message || err.message;
            alert("Failed to save changes: " + msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SellerLayout>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/seller/dashboard')}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">
                            {user?.role === 'service_provider' ? 'Settings' : 'Shop Settings'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage your public presence</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="max-w-xl">
                <div className="space-y-6">

                    {/* Logo & Status */}
                    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer group overflow-hidden"
                                onClick={() => document.getElementById('logo-input').click()}>
                                {logo ? (
                                    <img src={logo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-5 h-5 mx-auto text-gray-400 group-hover:text-green-500" />
                                        <span className="text-[10px] font-bold text-gray-400">Logo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-[10px] text-white font-bold">Change</span>
                                </div>
                                <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) handleUpload(f, 'logo'); }} />
                            </div>

                            <div className="flex-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shop Status</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newStatus = (form.shopStatus || 'open') === 'open' ? 'closed' : 'open';
                                            setForm(p => ({ ...p, shopStatus: newStatus }));
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                            (form.shopStatus || 'open') === 'open' 
                                                ? 'bg-green-100 text-green-600 ring-1 ring-green-200' 
                                                : 'bg-red-100 text-red-600 ring-1 ring-red-200'
                                        }`}
                                    >
                                        {(form.shopStatus || 'open') === 'open' ? '🟢 Open Now' : '🔴 Closed'}
                                    </button>
                                    <span className="text-[11px] text-gray-400 font-medium">Click to toggle availability</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Field label={user?.role === 'service_provider' ? "Professional Name *" : "Shop Name *"}>
                                <Input value={form.shopName} onChange={F('shopName')} placeholder="e.g. Akupy Store" required />
                            </Field>
                            <Field label="City *">
                                <Input value={form.address} onChange={F('address')} placeholder="e.g. Mumbai, Maharashtra" required />
                            </Field>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
                        <Field label="Description">
                            <Textarea rows={4} value={form.tagline} onChange={F('tagline')} placeholder="A brief about what you do..." />
                        </Field>
                    </div>

                    {/* Banner (Small Preview) */}
                    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Shop Banner</label>
                        <div className="relative w-full h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer group overflow-hidden"
                            onClick={() => document.getElementById('banner-input').click()}>
                            {banner ? (
                                <img src={banner} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-4 h-4 mx-auto text-gray-400 group-hover:text-green-500" />
                                    <span className="text-[10px] font-bold text-gray-400">Upload Banner</span>
                                </div>
                            )}
                            <input id="banner-input" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) handleUpload(f, 'banner'); }} />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button type="submit" disabled={saving}
                            className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all active:scale-95 shadow-xl flex items-center gap-2 justify-center"
                            style={{ background: saved ? '#16A34A' : GREEN }}>
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : saved ? '✓ Settings Saved' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </SellerLayout>
    );
}
