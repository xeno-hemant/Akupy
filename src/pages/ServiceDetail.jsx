import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Clock, IndianRupee, Phone, Star,
    MessageCircle, Share2, Tag, CheckCircle
} from 'lucide-react';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';
import useShareProduct from '../hooks/useShareProduct';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';

const CATEGORY_COLORS = {
    Tutor: '#3B82F6', Repair: '#F59E0B', Cleaning: '#10B981', Beauty: '#EC4899',
    Delivery: '#8B5CF6', Photography: '#EF4444', Design: '#06B6D4', Consulting: '#F97316', Other: '#6B7280'
};

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const { share, copied } = useShareProduct();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(API.SERVICE_DETAIL(serviceId));
                setService(res.data.service);
            } catch { /* show error */ } finally { setLoading(false); }
        };
        load();
    }, [serviceId]);

    const handleWhatsApp = () => {
        const phone = service.contactWhatsApp || service.contactPhone || '';
        const num = phone.replace(/\D/g, '');
        const msg = encodeURIComponent(`Hi, I found your service "${service.serviceName}" on Akupy. I'm interested!`);
        window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    };

    const handleCall = () => {
        window.location.href = `tel:${service.contactPhone}`;
    };

    const { startChatWithSeller } = useChatStore();
    const { token } = useAuthStore();

    const handleChat = async () => {
        if (!token) { navigate('/login'); return; }
        const sellerId = service.sellerId?._id || service.sellerId || service.shopId?.userId;
        const conversationId = await startChatWithSeller(sellerId);
        if (conversationId) navigate(`/chat/${conversationId}`);
    };

    const handleShare = () => {
        share({ productId: serviceId, productName: service?.serviceName });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: 80, background: '#F5F0E8' }}>
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
        </div>
    );

    if (!service) return (
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: 80, background: '#F5F0E8' }}>
            <p className="text-gray-500 font-semibold">Service not found</p>
            <button onClick={() => navigate('/shop')} className="mt-4 text-green-600 font-bold text-sm hover:underline">← Go Home</button>
        </div>
    );

    const catColor = CATEGORY_COLORS[service.category] || '#6B7280';

    return (
        <div className="min-h-screen pb-32" style={{ background: '#F5F0E8', paddingTop: 80 }}>
            {/* Toast */}
            {copied && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Link copied!
                </div>
            )}

            <div className="max-w-2xl mx-auto px-4 md:px-6">
                {/* Back */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                    {/* Image or category banner */}
                    {service.images?.length > 0 ? (
                        <img src={service.images[0]} alt={service.serviceName}
                            className="w-full h-56 object-cover" />
                    ) : (
                        <div className="w-full h-40 flex items-center justify-center text-white text-6xl font-black"
                            style={{ background: `linear-gradient(135deg, ${catColor}22, ${catColor}44)` }}>
                            <span className="text-5xl">{service.serviceName?.[0]?.toUpperCase()}</span>
                        </div>
                    )}

                    <div className="p-6">
                        {/* Category badge */}
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full mb-3"
                            style={{ background: `${catColor}18`, color: catColor }}>
                            <Tag className="w-3 h-3" /> {service.category}
                        </span>

                        <h1 className="text-2xl font-black text-gray-900 mb-2">{service.serviceName}</h1>

                        {/* Price */}
                        <div className="flex items-center gap-1.5 text-3xl font-black text-gray-900 mb-4">
                            <IndianRupee className="w-6 h-6" />
                            {service.price?.toLocaleString('en-IN')}
                            <span className="text-lg font-normal text-gray-400 ml-1">
                                {service.priceType === 'Per Hour' ? '/ hour' : 'fixed'}
                            </span>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-1 gap-3 mb-5">
                            {(service.city || service.state) && (
                                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    {[service.city, service.state].filter(Boolean).join(', ')}
                                </div>
                            )}
                            {service.availability && (
                                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600">
                                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                                    </div>
                                    {service.availability}
                                </div>
                            )}
                            {service.rating > 0 && (
                                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600">
                                    <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                                    </div>
                                    {service.rating.toFixed(1)} ({service.reviewCount} reviews)
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {service.description && (
                            <div className="pt-4 border-t border-gray-50">
                                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">About this service</h3>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Provider card */}
                {service.sellerId && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                        <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Service Provider</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-black text-xl text-green-600">
                                {service.sellerId?.fullName?.[0]?.toUpperCase() || 'S'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{service.sellerId?.fullName || 'Service Provider'}</p>
                                {service.shopId?.name && (
                                    <p className="text-sm text-gray-500">{service.shopId.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-100 shadow-lg">
                <div className="max-w-2xl mx-auto flex gap-3">
                    {/* Share */}
                    <button onClick={handleShare}
                        className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-50 transition-colors">
                        <Share2 className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Call */}
                    {service.contactPhone && (
                        <button onClick={handleCall}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 border-green-500 text-green-600 hover:bg-green-50 transition-colors">
                            <Phone className="w-4 h-4" /> Call Seller
                        </button>
                    )}

                    {/* WhatsApp — primary CTA */}
                    <button onClick={handleWhatsApp}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
                        style={{ background: '#25D366' }}>
                        <MessageCircle className="w-4 h-4" /> Book via WhatsApp
                    </button>

                    {/* In-app Chat */}
                    <button onClick={handleChat}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gray-900 text-white transition-all active:scale-95">
                        💬 Ask Provider
                    </button>
                </div>
            </div>
        </div>
    );
}
