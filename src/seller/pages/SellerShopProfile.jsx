import React, { useState } from 'react';
import { Upload, Save, Instagram, Globe, Facebook } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import useAuthStore from '../../store/useAuthStore';

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
    const { user } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [banner, setBanner] = useState(null);
    const [logo, setLogo] = useState(null);
    const [form, setForm] = useState({
        shopName: user?.businessName || 'My Shop',
        tagline: 'Quality products, fast delivery',
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

    const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSave = (e) => {
        e?.preventDefault();
        setSaving(true);
        setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1200);
    };

    return (
        <SellerLayout>
            <form onSubmit={handleSave}>
                <div className="space-y-5 max-w-3xl">

                    {/* Banner Upload */}
                    <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        {/* Banner area */}
                        <div className="relative w-full h-36 cursor-pointer group" style={{ background: banner ? undefined : 'linear-gradient(135deg, #1A1A2E, #16213E)' }}
                            onClick={() => document.getElementById('banner-input').click()}>
                            {banner && <img src={banner} alt="banner" className="w-full h-full object-cover" />}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
                                    <Upload className="w-4 h-4" /> Upload Banner (1200×300)
                                </div>
                            </div>
                            <input id="banner-input" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) setBanner(URL.createObjectURL(f)); }} />

                            {/* Shop logo */}
                            <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer overflow-hidden"
                                style={{ background: logo ? undefined : GREEN }}
                                onClick={ev => { ev.stopPropagation(); document.getElementById('logo-input').click(); }}>
                                {logo ? <img src={logo} className="w-full h-full object-cover" /> :
                                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-white">
                                        {form.shopName.charAt(0).toUpperCase()}
                                    </div>
                                }
                                <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) setLogo(URL.createObjectURL(f)); }} />
                            </div>
                        </div>
                        <div className="px-6 pt-12 pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Shop Name *">
                                    <Input value={form.shopName} onChange={F('shopName')} placeholder="Your Shop Name" required />
                                </Field>
                                <Field label="Tagline">
                                    <Input value={form.tagline} onChange={F('tagline')} placeholder="e.g. Quality products, fast delivery" />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-4" style={{ color: '#0F172A' }}>Business Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Business Type">
                                <select value={form.businessType} onChange={F('businessType')}
                                    className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-medium"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#374151' }}>
                                    <option value="individual">Individual / Sole Proprietor</option>
                                    <option value="company">Private Limited Company</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                            </Field>
                            <Field label="GST Number" hint="Optional but recommended">
                                <Input value={form.gst} onChange={F('gst')} placeholder="22AAAAA0000A1Z5" />
                            </Field>
                            <Field label="Contact Email *">
                                <Input type="email" value={form.email} onChange={F('email')} placeholder="shop@example.com" />
                            </Field>
                            <Field label="Contact Phone">
                                <Input type="tel" value={form.phone} onChange={F('phone')} placeholder="+91 98765 43210" />
                            </Field>
                            <div className="md:col-span-2">
                                <Field label="Business Address">
                                    <Textarea rows={2} value={form.address} onChange={F('address')} placeholder="Full address including city, state, pincode" />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Policies */}
                    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-4" style={{ color: '#0F172A' }}>Policies</h3>
                        <div className="space-y-4">
                            <Field label="Return Policy">
                                <Textarea rows={3} value={form.returnPolicy} onChange={F('returnPolicy')} />
                            </Field>
                            <Field label="Shipping Policy">
                                <Textarea rows={3} value={form.shippingPolicy} onChange={F('shippingPolicy')} />
                            </Field>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-4" style={{ color: '#0F172A' }}>Social Links</h3>
                        <div className="space-y-3">
                            {[
                                { key: 'instagram', Icon: Instagram, placeholder: 'instagram.com/yourshop', color: '#E1306C' },
                                { key: 'facebook', Icon: Facebook, placeholder: 'facebook.com/yourshop', color: '#1877F2' },
                                { key: 'website', Icon: Globe, placeholder: 'yourwebsite.com', color: '#64748B' },
                            ].map(({ key, Icon, placeholder, color }) => (
                                <div key={key} className="relative">
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color }} />
                                    <Input style={{ paddingLeft: 36 }} value={form[key]} onChange={F(key)} placeholder={placeholder} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="sticky bottom-4">
                        <button type="submit" disabled={saving}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl font-black text-white transition-all active:scale-95 shadow-lg flex items-center gap-2 justify-center"
                            style={{ background: saved ? '#16A34A' : GREEN }}
                            onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#16A34A'; }}
                            onMouseLeave={e => { if (!saving && !saved) e.currentTarget.style.background = GREEN; }}>
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : saved ? '✓ Changes Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </SellerLayout>
    );
}
