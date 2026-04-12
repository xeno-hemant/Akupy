import React, { useState } from 'react';
import { Check, Zap, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import api from '../../utils/apiHelper';
import API from '../../config/apiRoutes';

export default function SellerAdvertise() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const PLANS = [
        {
            id: 'basic',
            name: 'Basic Plan',
            price: 299,
            icon: Zap,
            color: '#F97316',
            features: [
                'Listed in Top Shops Near You',
                'Orange "Sponsored" badge',
                'Local city targeting',
                '30 Days visibility'
            ]
        },
        {
            id: 'featured',
            name: 'Featured Plan',
            price: 599,
            icon: Star,
            color: '#F59E0B',
            isPopular: true,
            features: [
                'Top position in Top Shops',
                'Gold "⭐ Featured" badge',
                'Highlighted card design',
                'Priority ranking over Basic',
                '30 Days visibility'
            ]
        }
    ];

    const handleAdvertise = async (plan) => {
        setLoading(true);
        try {
            // 1. Create Order
            const { data } = await api.post(`${API.SELLER_SHOP}/advertise`, { plan: plan.id });
            
            if (!data.success) throw new Error(data.message);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "Akupy Ads",
                description: `Advertise My Shop - ${plan.name}`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post(`${API.SELLER_SHOP}/advertise/verify`, {
                            ...response,
                            plan: plan.id
                        });
                        if (verifyRes.data.success) {
                            setSuccess(true);
                            window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Ad activated successfully!' } }));
                        }
                    } catch (err) {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "Seller Name",
                },
                theme: { color: "#22C55E" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Ad creation error:', err);
            alert(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <SellerLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Check className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Campaign Activated!</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        Your shop is now being advertised. It will appear in the "Top Shops" section for the next 30 days.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout>
            <div className="max-w-4xl mx-auto py-4">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">📢 Advertise My Shop</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Get more visibility and attract new customers in your city by featuring your shop on the Akupy home page.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {PLANS.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`relative bg-white rounded-[40px] p-8 border-2 transition-all hover:shadow-xl ${
                                plan.isPopular ? 'border-amber-400 shadow-lg' : 'border-gray-100'
                            }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                    Recommended
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${plan.color}15` }}>
                                    <plan.icon size={28} style={{ color: plan.color }} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                                    <p className="text-2xl font-black text-gray-900">₹{plan.price}<span className="text-sm font-bold text-gray-400">/30 days</span></p>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-600">
                                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleAdvertise(plan)}
                                disabled={loading}
                                className={`w-full py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                    plan.isPopular 
                                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200' 
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                            >
                                {loading ? 'Processing...' : 'Activate Plan'} <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ / Info */}
                <div className="mt-16 bg-blue-50 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-blue-900 mb-1">Guaranteed Transparency</h4>
                        <p className="text-sm text-blue-700/70 font-medium">
                            Your advertisement starts immediately after payment verification. You will receive an email confirmation with your campaign duration.
                        </p>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
