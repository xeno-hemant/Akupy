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

            <div className="flex flex-col xl:flex-row gap-6">

                {/* LEFT COLUMN */}
                <div className="flex-1 space-y-5 min-w-0">

                    {/* Basic Info */}
                    <SectionCard title="Basic Information">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Product Title *</label>
                                <input type="text" placeholder="e.g. Acid Wash Oversized Tee" value={form.name} onChange={F('name')}
                                    className="w-full h-11 px-3 text-base rounded-lg border-2 outline-none font-bold"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
                                    onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                            </div>
                            <TextareaField label="Description" rows={5} placeholder="Describe your product..." value={form.description} onChange={F('description')} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Category</label>
                                    <select value={form.category} onChange={F('category')} className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-medium"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <InputField label="Sub-category" placeholder="e.g. T-Shirts" value={form.subcat} onChange={F('subcat')} />
                            </div>
                        </div>
                    </SectionCard>

                    {/* Media */}
                    <SectionCard title="Media">
                        <div
                            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                            style={{ borderColor: images.length ? GREEN : '#CBD5E1', background: images.length ? '#F0FDF4' : '#F8FAFC' }}
                            onDrop={handleImageDrop} onDragOver={e => e.preventDefault()}
                            onClick={() => fileRef.current?.click()}>
                            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageDrop} />
                            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: images.length ? GREEN : '#94A3B8' }} />
                            <p className="text-sm font-bold" style={{ color: images.length ? GREEN : '#64748B' }}>
                                {images.length ? `${images.length} image(s) uploaded` : 'Drag images here or click to upload'}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>JPG, PNG, WEBP — Max 5MB each</p>
                        </div>
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {images.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden" style={{ background: '#F8F9FA' }}>
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                        <button className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white"
                                            style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}>
                                            <X className="w-3 h-3" />
                                        </button>
                                        {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: GREEN, color: '#fff' }}>Main</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    {/* Pricing */}
                    <SectionCard title="Pricing">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>MRP / Compare-at (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: '#94A3B8' }}>₹</span>
                                    <input type="number" placeholder="0.00" value={form.mrp} onChange={F('mrp')}
                                        className="w-full h-10 pl-7 pr-3 text-sm rounded-lg border-2 outline-none"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#64748B' }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Cost per Item (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: '#94A3B8' }}>₹</span>
                                    <input type="number" placeholder="0.00" value={form.cost} onChange={F('cost')}
                                        className="w-full h-10 pl-7 pr-3 text-sm rounded-lg border-2 outline-none"
                                        style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#64748B' }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                                </div>
                            </div>
                        </div>
                        {margin !== null && (
                            <div className="mt-3 flex items-center gap-2 text-sm">
                                <span style={{ color: '#64748B' }}>Estimated Margin:</span>
                                <span className="font-black" style={{ color: margin > 30 ? GREEN : margin > 10 ? '#F59E0B' : '#EF4444' }}>{margin}%</span>
                            </div>
                        )}
                        <label className="flex items-center gap-3 mt-4 cursor-pointer">
                            <div className="relative w-9 h-5">
                                <input type="checkbox" className="sr-only peer" checked={chargeTax} onChange={e => setChargeTax(e.target.checked)} />
                                <div className="w-9 h-5 rounded-full transition-colors" style={{ background: chargeTax ? GREEN : '#CBD5E1' }} />
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: chargeTax ? 'translateX(16px)' : 'translateX(0)' }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#374151' }}>Charge tax on this product</span>
                        </label>
                    </SectionCard>

                    {/* Inventory */}
                    <SectionCard title="Inventory">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="SKU" placeholder="e.g. SKU-1001" value={form.sku} onChange={F('sku')} />
                            <InputField label="Barcode" placeholder="ISBN, UPC, etc." value={form.barcode} onChange={F('barcode')} />
                        </div>
                        <label className="flex items-center gap-3 mt-4 cursor-pointer">
                            <div className="relative w-9 h-5">
                                <input type="checkbox" className="sr-only peer" checked={trackQty} onChange={e => setTrackQty(e.target.checked)} />
                                <div className="w-9 h-5 rounded-full transition-colors" style={{ background: trackQty ? GREEN : '#CBD5E1' }} />
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: trackQty ? 'translateX(16px)' : 'translateX(0)' }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#374151' }}>Track quantity</span>
                        </label>
                        {trackQty && (
                            <div className="mt-4">
                                <InputField label="Quantity" type="number" placeholder="0" value={form.quantity} onChange={F('quantity')} />
                            </div>
                        )}
                    </SectionCard>

                    {/* Variants */}
                    <SectionCard title="Variants">
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                            <div className="relative w-9 h-5">
                                <input type="checkbox" className="sr-only" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} />
                                <div className="w-9 h-5 rounded-full transition-colors" style={{ background: hasVariants ? GREEN : '#CBD5E1' }} />
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: hasVariants ? 'translateX(16px)' : 'translateX(0)' }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#374151' }}>This product has variants</span>
                        </label>

                        {hasVariants && (
                            <div>
                                <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {SIZE_OPTIONS.map(s => (
                                        <button key={s} onClick={() => toggleSize(s)}
                                            className="px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all"
                                            style={selectedSizes.includes(s)
                                                ? { background: GREEN, borderColor: GREEN, color: '#fff' }
                                                : { background: '#F8FAFC', borderColor: '#E2E8F0', color: '#64748B' }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                {selectedSizes.length > 0 && (
                                    <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid #F1F5F9' }}>
                                        <table className="w-full text-sm">
                                            <thead style={{ background: '#F8F9FA' }}>
                                                <tr>{['Variant', 'Price', 'Stock', 'SKU'].map(h => (
                                                    <th key={h} className="px-3 py-2 text-left text-xs font-black" style={{ color: '#94A3B8' }}>{h}</th>
                                                ))}</tr>
                                            </thead>
                                            <tbody>
                                                {selectedSizes.map(s => (
                                                    <tr key={s} style={{ borderTop: '1px solid #F1F5F9' }}>
                                                        <td className="px-3 py-2 font-bold" style={{ color: '#0F172A' }}>{s}</td>
                                                        <td className="px-3 py-2"><input type="number" placeholder={form.price || '0'} className="w-20 h-8 px-2 text-sm rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></td>
                                                        <td className="px-3 py-2"><input type="number" placeholder="0" className="w-20 h-8 px-2 text-sm rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></td>
                                                        <td className="px-3 py-2"><input type="text" placeholder={`${form.sku || 'SKU'}-${s}`} className="w-28 h-8 px-2 text-sm rounded border outline-none" style={{ borderColor: '#E2E8F0' }} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </SectionCard>

                    {/* Shipping */}
                    <SectionCard title="Shipping">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InputField label="Weight (kg)" type="number" placeholder="0.0" value={form.weight} onChange={F('weight')} />
                            <InputField label="Length (cm)" type="number" placeholder="0" />
                            <InputField label="Width (cm)" type="number" placeholder="0" />
                            <InputField label="Height (cm)" type="number" placeholder="0" />
                        </div>
                        <div className="mt-4">
                            <InputField label="Estimated Delivery Time" placeholder="e.g. 3-5 business days" value={form.deliveryTime} onChange={F('deliveryTime')} />
                        </div>
                    </SectionCard>

                    {/* SEO */}
                    <SectionCard title="🔍 SEO" collapsible>
                        <div className="space-y-4">
                            <InputField label="SEO Title" placeholder="Page title for search engines" value={form.seoTitle} onChange={F('seoTitle')} />
                            <TextareaField label="Meta Description" rows={3} placeholder="Brief description for search engines (max 160 chars)" value={form.seoDesc} onChange={F('seoDesc')} />
                            <div className="p-4 rounded-xl" style={{ background: '#F8F9FA', border: '1px solid #E2E8F0' }}>
                                <p className="text-[10px] uppercase font-bold mb-2" style={{ color: '#94A3B8' }}>Google Preview</p>
                                <div className="text-blue-600 text-sm font-medium truncate">{form.seoTitle || form.name || 'Product Title — akupy'}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>akupy.in/shop/{form.category?.toLowerCase() || 'category'}/...</div>
                                <div className="text-xs mt-1 line-clamp-2" style={{ color: '#374151' }}>{form.seoDesc || form.description || 'Product description will appear here...'}</div>
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full xl:w-72 flex-shrink-0 space-y-4">

                    {/* Publish Status */}
                    <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-3" style={{ color: '#0F172A' }}>Publish</h3>
                        <select value={status} onChange={e => setStatus(e.target.value)}
                            className="w-full h-10 px-3 text-sm rounded-lg border-2 outline-none font-semibold mb-4"
                            style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#374151' }}>
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                        </select>
                        <div className="space-y-2">
                            <button className="w-full py-2.5 rounded-lg font-semibold text-sm border-2 transition-colors"
                                style={{ borderColor: '#E2E8F0', color: '#374151' }}
                                onClick={() => handleSave(false)} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button className="w-full py-2.5 rounded-lg font-bold text-sm text-white transition-all active:scale-95"
                                style={{ background: GREEN }}
                                onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                                onMouseLeave={e => e.currentTarget.style.background = GREEN}
                                onClick={() => handleSave(true)} disabled={saving}>
                                {saving ? 'Publishing...' : 'Publish Product'}
                            </button>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-3" style={{ color: '#0F172A' }}>Organization</h3>
                        <div className="space-y-3">
                            <InputField label="Brand" placeholder="e.g. Nike, Local Brand" />
                            <div>
                                <label className="block text-xs font-bold mb-1" style={{ color: '#374151' }}>Tags</label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {tags.map(t => (
                                        <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#F0FDF4', color: GREEN }}>
                                            {t} <button onClick={() => setTags(prev => prev.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <input type="text" placeholder="Add tag, press Enter" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                                    className="w-full h-9 px-3 text-sm rounded-lg border-2 outline-none"
                                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1E293B' }}
                                    onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                            </div>
                        </div>
                    </div>

                    {/* Sales Channels */}
                    <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <h3 className="text-sm font-black mb-3" style={{ color: '#0F172A' }}>Sales Channels</h3>
                        <ChannelToggle label="akupy Marketplace" defaultOn={true} />
                        <ChannelToggle label="Featured on Homepage" defaultOn={false} />
                        <ChannelToggle label="Include in Sale" defaultOn={false} />
                    </div>

                    {/* Main Image Preview */}
                    {images.length > 0 && (
                        <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <h3 className="text-sm font-black mb-3" style={{ color: '#0F172A' }}>Thumbnail</h3>
                            <img src={images[0]} alt="main" className="w-full aspect-square object-cover rounded-xl" />
                            <button className="w-full mt-2 py-2 text-xs font-bold border-2 rounded-lg transition-colors"
                                style={{ borderColor: '#E2E8F0', color: '#64748B' }} onClick={() => fileRef.current?.click()}>
                                Change main image
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
