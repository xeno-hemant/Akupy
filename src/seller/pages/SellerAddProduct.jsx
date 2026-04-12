import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, ChevronDown, Save } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import useAuthStore from '../../store/useAuthStore';
import API from '../../config/apiRoutes';
import api from '../../utils/apiHelper';

const GREEN = '#22C55E';
const CATEGORIES = ['Fashion', 'Electronics', 'Home & Living', 'Plants', 'Books', 'Food & Beverage', 'Sports', 'Lifestyle', 'Accessories', 'Toys'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

// ── Fix: useState cannot be used inside .map() — extract as component ──
function ChannelToggle({ label, defaultOn }) {
    const [on, setOn] = useState(defaultOn);
    return (
        <label className="flex items-center justify-between py-2 cursor-pointer">
            <span className="text-sm font-medium" style={{ color: '#374151' }}>{label}</span>
            <div className="relative w-9 h-5 ml-3 flex-shrink-0" onClick={() => setOn(o => !o)}>
                <div className="w-9 h-5 rounded-full transition-colors" style={{ background: on ? GREEN : '#CBD5E1' }} />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow"
                    style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }} />
            </div>
        </label>
    );
}

function SectionCard({ title, children, collapsible = false }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className={`flex items-center justify-between px-5 py-4 ${collapsible ? 'cursor-pointer select-none' : ''}`}
                style={{ borderBottom: open ? '1px solid #F8F9FA' : 'none' }}
                onClick={() => collapsible && setOpen(o => !o)}>
                <h3 className="text-sm font-black" style={{ color: '#0F172A' }}>{title}</h3>
                {collapsible && <ChevronDown className="w-4 h-4 transition-transform" style={{ color: '#94A3B8', transform: open ? 'rotate(180deg)' : '' }} />}
            </div>
            {open && <div className="p-5">{children}</div>}
        </div>
    );
}

function InputField({ label, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            {label && <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>{label}</label>}
            <input
                {...props}
                className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none transition-colors font-medium"
                style={{ background: '#F8FAFC', borderColor: focused ? GREEN : '#E2E8F0', color: '#1E293B' }}
                onFocus={e => { setFocused(true); props.onFocus?.(e); }}
                onBlur={e => { setFocused(false); props.onBlur?.(e); }}
            />
        </div>
    );
}

function TextareaField({ label, rows = 4, ...props }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            {label && <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>{label}</label>}
            <textarea
                rows={rows}
                {...props}
                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 outline-none transition-colors font-medium resize-none"
                style={{ background: '#F8FAFC', borderColor: focused ? GREEN : '#E2E8F0', color: '#1E293B' }}
                onFocus={e => { setFocused(true); props.onFocus?.(e); }}
                onBlur={e => { setFocused(false); props.onBlur?.(e); }}
            />
        </div>
    );
}

export default function SellerAddProduct() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { id } = useParams();
    const fileRef = useRef();
    const isEdit = Boolean(id);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [images, setImages] = useState([]);
    const [hasVariants, setHasVariants] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [status, setStatus] = useState('draft');
    const [chargeTax, setChargeTax] = useState(true);
    const [trackQty, setTrackQty] = useState(true);
    const [imageFiles, setImageFiles] = useState([]); // Store actual File objects

    const [form, setForm] = useState({
        name: '', description: '', category: '', price: '', mrp: '', cost: '',
        sku: '', barcode: '', quantity: '', weight: '', deliveryTime: '3-5 days',
        seoTitle: '', seoDesc: '', featured: false,
    });

    const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const margin = form.price && form.cost
        ? Math.round(((form.price - form.cost) / form.price) * 100)
        : null;

    const handleImageDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer?.files || e.target.files || []);
        
        // Add to preview
        const urls = files.map(f => URL.createObjectURL(f));
        setImages(prev => [...prev, ...urls]);
        
        // Add actual files for later upload
        setImageFiles(prev => [...prev, ...files]);
    };

    const toggleSize = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            setTags(prev => [...prev, tagInput.trim()]);
            setTagInput('');
            e.preventDefault();
        }
    };

    const handleSave = async (publish = false) => {
        setSaving(true);
        try {
            // 1. Upload new images first
            const finalImages = [];
            
            // Loop through existing images (if editing, some might be URLs already)
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                if (img.startsWith('http')) {
                    // Keep existing Cloudinary URLs
                    finalImages.push({ url: img });
                } else if (img.startsWith('blob:')) {
                    // Find corresponding File object and upload
                    const fileIndex = images.slice(0, i).filter(u => u.startsWith('blob:')).length;
                    const file = imageFiles[fileIndex];
                    if (file) {
                        const data = new FormData();
                        data.append('image', file);
                        const uploadRes = await api.post(API.UPLOAD, data, true);
                        finalImages.push({ 
                            url: uploadRes.data.imageUrl,
                            cloudinaryPublicId: uploadRes.data.cloudinaryPublicId 
                        });
                    }
                }
            }

            // 2. Prepare product body
            const body = { 
                ...form, 
                status: publish ? 'active' : status, 
                images: finalImages, 
                tags, 
                hasVariants, 
                sizes: selectedSizes,
                weight: Number(form.weight) || 0,
                quantity: Number(form.quantity) || 0,
                price: Number(form.price) || 0,
                mrp: Number(form.mrp) || 0,
                cost: Number(form.cost) || 0
            };

            // 3. Save to backend
            const url = isEdit ? `${API.SELLER_PRODUCTS}/${id}` : API.SELLER_PRODUCTS;
            if (isEdit) {
                await api.put(url, body);
            } else {
                await api.post(url, body);
            }

            setSaved(true);
            setTimeout(() => { navigate('/seller/products'); }, 1500);
        } catch (err) { 
            console.error("Save failed:", err);
            alert("Failed to save product: " + (err.response?.data?.message || err.message));
        }
        finally { setSaving(false); }
    };

    return (
        <SellerLayout>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/seller/products')} className="p-2 rounded-lg transition-colors" style={{ color: '#64748B' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-black" style={{ color: '#0F172A' }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
                    <p className="text-sm" style={{ color: '#64748B' }}>Fill in the details below</p>
                </div>
                {saved && (
                    <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                        ✓ Saved!
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6 max-w-4xl mx-auto">

                {/* Main Form Area */}
                <div className="space-y-5 min-w-0">

                    {/* REQUIRED FIELDS */}
                    <SectionCard title="Required Details">
                        <div className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Product Name *</label>
                                <input type="text" placeholder="e.g. Acid Wash Oversized Tee" value={form.name} onChange={F('name')}
                                    className="w-full h-11 px-3 text-base rounded-lg border-2 outline-none font-bold"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                    onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Price (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: '#94A3B8' }}>₹</span>
                                        <input type="number" placeholder="0.00" value={form.price} onChange={F('price')}
                                            className="w-full h-10 pl-7 pr-3 text-sm rounded-lg border-2 outline-none font-bold"
                                            style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                            onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                    </div>
                                </div>
                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Category *</label>
                                    <select value={form.category} onChange={F('category')} className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-medium"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}>
                                        <option value="">Select category</option>
                                        {['Fashion', 'Electronics', 'Food', 'Home', 'Beauty', 'Gadgets', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>Product Images (Max 4) *</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {images.slice(0, 4).map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                            <button className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg"
                                                style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 4 && (
                                        <div
                                            className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-green-50 hover:border-green-400 group"
                                            style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}
                                            onClick={() => fileRef.current?.click()}
                                        >
                                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                                            <span className="text-[10px] font-bold text-gray-400 mt-1">Upload</span>
                                            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageDrop} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Stock Quantity *</label>
                                <input type="number" placeholder="e.g. 50" value={form.quantity} onChange={F('quantity')}
                                    className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                                    onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                            </div>
                        </div>
                    </SectionCard>

                    {/* OPTIONAL FIELDS */}
                    <SectionCard title="More Details ▼" collapsible>
                        <div className="space-y-4">
                            <TextareaField label="Description" rows={4} placeholder="Tell customers about your product..." value={form.description} onChange={F('description')} />
                            
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Discount %</label>
                                <input type="number" placeholder="e.g. 10" value={form.discount} onChange={F('discount')}
                                    className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                                />
                            </div>

                            {/* Sizes - Multi Select */}
                            <div>
                                <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                        <button key={s} onClick={() => toggleSize(s)}
                                            className="px-4 py-2 rounded-lg text-sm font-black border-2 transition-all shadow-sm"
                                            style={selectedSizes.includes(s)
                                                ? { background: GREEN, borderColor: GREEN, color: '#fff', transform: 'scale(1.05)' }
                                                : { background: '#fff', borderColor: '#E2E8F0', color: '#64748B' }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors - Max 5 */}
                            <div>
                                <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>Available Colors (Max 5)</label>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {(form.colors || []).map((c, i) => (
                                        <div key={i} className="relative group">
                                            <div className="w-9 h-9 rounded-full border-2 border-white shadow-md ring-1 ring-gray-100" style={{ background: c }} />
                                            <button onClick={() => setForm(p => ({ ...p, colors: p.colors.filter((_, j) => j !== i) }))}
                                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {(form.colors || []).length < 5 && (
                                        <input type="color" className="w-9 h-9 rounded-full border-none cursor-pointer bg-transparent"
                                            onChange={e => setForm(p => ({ ...p, colors: [...(p.colors || []), e.target.value] }))} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3 pt-4">
                        <button className="flex-1 py-3.5 rounded-xl font-black text-sm text-white transition-all active:scale-95 shadow-xl"
                            style={{ background: GREEN }}
                            onClick={() => handleSave(true)} disabled={saving}>
                            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}
                        </button>
                        <button className="px-8 py-3.5 rounded-xl font-bold text-sm text-gray-400 border-2 transition-colors border-gray-100 hover:bg-gray-50"
                            onClick={() => navigate('/seller/products')} disabled={saving}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
