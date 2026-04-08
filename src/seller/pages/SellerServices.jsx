import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, MapPin, Clock, Tag, IndianRupee, Loader, AlertCircle, CheckCircle } from 'lucide-react';
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
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get(API.MY_SERVICES);
            setServices(res.data.services || []);
        } catch { setServices([]); } finally { setLoading(false); }
    };

    useEffect(() => { fetchServices(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
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
        setEditingId(svc._id);
        setShowForm(true);
    };

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.serviceName.trim() || !form.price) { showToast('error', 'Service name and price are required'); return; }
        setSaving(true);
        try {
            if (editingId) {
                await api.put(API.SERVICE_DETAIL(editingId), form);
                showToast('success', 'Service updated!');
            } else {
                await api.post(API.SERVICES, form);
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
                <div>
                    <h1 className="text-2xl font-black text-gray-900">My Services</h1>
                    <p className="text-sm text-gray-500 mt-0.5">List services you offer to customers</p>
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
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-black text-lg text-gray-900 mb-5">{editingId ? 'Edit Service' : 'New Service'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Service Name */}
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Service Name *</label>
                            <input type="text" value={form.serviceName} onChange={e => handleChange('serviceName', e.target.value)}
                                placeholder="e.g. Home Cleaning, AC Repair, Math Tuition..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" required />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Category</label>
                            <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Price Type + Price */}
                        <div className="flex gap-3">
                            <div className="w-36 flex-shrink-0">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Price Type</label>
                                <select value={form.priceType} onChange={e => handleChange('priceType', e.target.value)}
                                    className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors">
                                    {PRICE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Price (₹) *</label>
                                <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)}
                                    placeholder="0" min="0" step="1"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" required />
                            </div>
                        </div>

                        {/* City + State */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">City</label>
                            <input type="text" value={form.city} onChange={e => handleChange('city', e.target.value)}
                                placeholder="Mumbai"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">State</label>
                            <input type="text" value={form.state} onChange={e => handleChange('state', e.target.value)}
                                placeholder="Maharashtra"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" />
                        </div>

                        {/* Availability */}
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Availability</label>
                            <input type="text" value={form.availability} onChange={e => handleChange('availability', e.target.value)}
                                placeholder="e.g. Mon-Sat, 9am-6pm | Weekends only"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Contact Phone</label>
                            <input type="tel" value={form.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)}
                                placeholder="+91 XXXXXXXXXX"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">WhatsApp Number</label>
                            <input type="tel" value={form.contactWhatsApp} onChange={e => handleChange('contactWhatsApp', e.target.value)}
                                placeholder="+91 XXXXXXXXXX"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 transition-colors" />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                            <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
                                placeholder="Describe your service, experience, what's included..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-green-400 transition-colors resize-none" />
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex gap-3 pt-2">
                            <button type="submit" disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60 transition-all active:scale-95"
                                style={{ background: '#22C55E' }}>
                                {saving ? <Loader className="w-4 h-4 animate-spin" /> : null}
                                {saving ? 'Saving...' : editingId ? 'Update Service' : 'List Service'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
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
                            <div className="p-5">
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
