import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, MapPin, Clock, Tag, IndianRupee, Loader, AlertCircle, CheckCircle, Upload, X, Wrench, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/apiHelper';
import API from '../../config/apiRoutes';

const CATEGORIES = ['Tutor', 'Repair', 'Cleaning', 'Beauty', 'Delivery', 'Photography', 'Design', 'Consulting', 'Other'];
const PRICE_TYPES = ['Fixed', 'Per Hour'];

function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 px-5 py-3 rounded-full shadow-lg text-sm font-bold ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
        </div>
    );
}

const EMPTY_FORM = { serviceName: '', description: '', category: 'Other', priceType: 'Fixed', price: '', city: '', state: '', availability: '', contactPhone: '', contactWhatsApp: '' };

export default function SellerServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [images, setImages] = useState([]); // Previews (blob/http)
    const [imageFiles, setImageFiles] = useState([]); // Actual File objects
    const fileRef = useRef();

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get(API.MY_SERVICES);
            setServices(res.data.services || []);
        } catch { setServices([]); } finally { setLoading(false); }
    };

    useEffect(() => { fetchServices(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setImages([]); setImageFiles([]); setShowForm(true); };
    const openEdit = (svc) => {
        setForm({
            serviceName: svc.serviceName || '',
            description: svc.description || '',
            category: svc.category || 'Other',
            priceType: svc.priceType || 'Fixed',
            price: svc.price || '',
            city: svc.city || '',
            state: svc.state || '',
            availability: svc.availability || '',
            contactPhone: svc.contactPhone || '',
            contactWhatsApp: svc.contactWhatsApp || '',
        });
        setImages(svc.images || []);
        setImageFiles([]);
        setEditingId(svc._id);
        setShowForm(true);
    };

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleImageDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer?.files || e.target.files || []);
        const urls = files.map(f => URL.createObjectURL(f));
        setImages(prev => [...prev, ...urls]);
        setImageFiles(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        const item = images[index];
        if (item.startsWith('blob:')) {
            const fileIndex = images.slice(0, index).filter(u => u.startsWith('blob:')).length;
            setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.serviceName.trim() || !form.price) { showToast('error', 'Service name and price are required'); return; }
        setSaving(true);
        try {
            // Upload images first
            const finalImages = [];
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                if (img.startsWith('http')) {
                    finalImages.push(img);
                } else if (img.startsWith('blob:')) {
                    const fileIndex = images.slice(0, i).filter(u => u.startsWith('blob:')).length;
                    const file = imageFiles[fileIndex];
                    if (file) {
                        const data = new FormData();
                        data.append('image', file);
                        const uploadRes = await api.post(API.UPLOAD, data, true);
                        finalImages.push(uploadRes.data.imageUrl);
                    }
                }
            }

            const body = { ...form, images: finalImages };

            if (editingId) {
                await api.put(API.SERVICE_DETAIL(editingId), body);
                showToast('success', 'Service updated!');
            } else {
                await api.post(API.SERVICES, body);
                showToast('success', 'Service listed!');
            }
            setShowForm(false);
            fetchServices();
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to save service');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        setDeleting(id);
        try {
            await api.delete(API.SERVICE_DETAIL(id));
            showToast('success', 'Service deleted');
            fetchServices();
        } catch { showToast('error', 'Failed to delete'); } finally { setDeleting(null); }
    };

    const handleToggle = async (svc) => {
        try {
            await api.put(API.SERVICE_DETAIL(svc._id), { isActive: !svc.isActive });
            fetchServices();
        } catch { showToast('error', 'Failed to toggle'); }
    };

    return (
        <div className="space-y-6">
            <Toast toast={toast} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/seller/dashboard')}
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">My Services</h1>
                        <p className="text-sm text-gray-500 mt-0.5">List services you offer to customers</p>
                    </div>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
                    style={{ background: '#22C55E' }}
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowForm(false)}
                                className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors text-gray-500"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h2 className="font-black text-lg text-gray-900">{editingId ? 'Edit Service' : 'New Service'}</h2>
                        </div>
                    </div>
                    <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                        {/* REQUIRED SECTION */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Required Information</h3>
                            
                            {/* Service Name */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Service Name *</label>
                                <input type="text" value={form.serviceName} onChange={e => handleChange('serviceName', e.target.value)}
                                    placeholder="e.g. Home Cleaning, AC Repair, Math Tuition..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-black text-gray-800 outline-none focus:border-green-400 transition-colors" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Category *</label>
                                    <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors">
                                        {['Tutor', 'Repair', 'Cleaning', 'Beauty', 'Delivery', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">City *</label>
                                    <input type="text" value={form.city} onChange={e => handleChange('city', e.target.value)}
                                        placeholder="e.g. Mumbai, Delhi, Prayagraj"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" required />
                                </div>
                            </div>

                            {/* Price Type + Price */}
                            <div className="flex gap-3">
                                <div className="w-36 flex-shrink-0">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Price Type *</label>
                                    <select value={form.priceType} onChange={e => handleChange('priceType', e.target.value)}
                                        className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors">
                                        {['Fixed', 'Per Hour'].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Price (₹) *</label>
                                    <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)}
                                        placeholder="0" min="0" step="1"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-black text-gray-800 outline-none focus:border-green-400 transition-colors" required />
                                </div>
                            </div>
                        </div>

                        {/* OPTIONAL SECTION (COLLAPSIBLE) */}
                        <div className="pt-2">
                            <details className="group border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/30">
                                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-white border-b border-gray-50">
                                    <span className="text-sm font-black text-gray-700">More Details ▼</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="p-5 space-y-5">
                                    {/* Description */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                                        <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
                                            placeholder="Describe what you offer, your experience, what's included..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-green-400 transition-colors resize-none" />
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Availability</label>
                                        <input type="text" value={form.availability} onChange={e => handleChange('availability', e.target.value)}
                                            placeholder="e.g. Mon-Sat, 9am-6pm | Weekends only"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" />
                                    </div>

                                    {/* Service Images */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Service Images</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div
                                                onClick={() => fileRef.current?.click()}
                                                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all"
                                            >
                                                <Upload className="w-5 h-5 text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-400">Add</span>
                                                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageDrop} />
                                            </div>
                                            {images.map((src, i) => (
                                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white"><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button type="submit" disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm text-white disabled:opacity-60 transition-all active:scale-95 shadow-xl"
                                style={{ background: '#22C55E' }}>
                                {saving ? <Loader className="w-4 h-4 animate-spin" /> : null}
                                {saving ? 'Saving...' : editingId ? 'Update Service' : 'List Service'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-8 py-4 rounded-xl font-bold text-sm text-gray-400 border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            )}

            {/* Services List */}
            {loading ? (
                <div className="flex justify-center py-16"><Loader className="w-8 h-8 animate-spin text-gray-300" /></div>
            ) : services.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 px-8">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-8 h-8 text-green-300" />
                    </div>
                    <h3 className="font-black text-lg text-gray-900 mb-2">No services listed yet</h3>
                    <p className="text-gray-500 text-sm mb-6">Add your first service to start getting bookings</p>
                    <button onClick={openAdd}
                        className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
                        style={{ background: '#22C55E' }}>
                        <Plus className="w-4 h-4 inline mr-2" />Add First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {services.map(svc => (
                        <div key={svc._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${svc.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
                            {/* Service Image Preview */}
                            <div className="h-40 relative bg-gray-100">
                                {svc.images?.[0] ? (
                                    <img src={svc.images[0]} alt={svc.serviceName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Wrench className="w-10 h-10 text-gray-300" />
                                    </div>
                                )}
                                {!svc.isActive && (
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                                        <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Inactive</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 pt-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-[15px] text-gray-900 line-clamp-1">{svc.serviceName}</h3>
                                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1"
                                            style={{ background: '#F0FDF4', color: '#16A34A' }}>
                                            {svc.category}
                                        </span>
                                    </div>
                                    <button onClick={() => handleToggle(svc)} title={svc.isActive ? 'Deactivate' : 'Activate'}>
                                        {svc.isActive
                                            ? <ToggleRight className="w-7 h-7 text-green-500" />
                                            : <ToggleLeft className="w-7 h-7 text-gray-300" />
                                        }
                                    </button>
                                </div>

                                <div className="flex items-center gap-1.5 text-[13px] font-black text-gray-900 mb-2">
                                    <IndianRupee className="w-3.5 h-3.5" />
                                    {svc.price.toLocaleString('en-IN')}
                                    <span className="text-[11px] font-normal text-gray-400">
                                        {svc.priceType === 'Per Hour' ? '/ hr' : 'fixed'}
                                    </span>
                                </div>

                                {svc.city && (
                                    <p className="text-[12px] text-gray-400 flex items-center gap-1 mb-1">
                                        <MapPin className="w-3 h-3" /> {svc.city}{svc.state ? `, ${svc.state}` : ''}
                                    </p>
                                )}
                                {svc.availability && (
                                    <p className="text-[12px] text-gray-400 flex items-center gap-1 mb-2">
                                        <Clock className="w-3 h-3" /> {svc.availability}
                                    </p>
                                )}
                                {svc.description && (
                                    <p className="text-[12px] text-gray-500 line-clamp-2 mb-3">{svc.description}</p>
                                )}

                                <div className="flex gap-2 pt-2 border-t border-gray-50">
                                    <button onClick={() => openEdit(svc)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors">
                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(svc._id)} disabled={deleting === svc._id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold text-red-500 border border-red-100 hover:bg-red-50 transition-colors">
                                        {deleting === svc._id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
