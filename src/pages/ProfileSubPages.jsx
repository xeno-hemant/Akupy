import React from 'react';
import { Package, Ticket, MapPin, Smartphone, User, Star, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WishlistPage from './WishlistPage';
import EditProfilePage from './EditProfilePage';

const CONFIG = {
    orders: { title: 'My Orders', icon: Package, emptyMsg: 'You haven\'t placed any orders yet.' },
    coupons: { title: 'Available Coupons', icon: Ticket, emptyMsg: 'No active coupons available right now.' },
    addresses: { title: 'Delivery Addresses', icon: MapPin, emptyMsg: 'No addresses saved yet.' },
    devices: { title: 'Manage Devices', icon: Smartphone, emptyMsg: 'Only this device is currently logged in.' },
    reviews: { title: 'Reviews & Ratings', icon: Star, emptyMsg: 'You haven\'t reviewed any products yet.' },
};

export default function ProfileSubPages({ type }) {
    const navigate = useNavigate();

    // Route to real pages
    if (type === 'wishlist') return <WishlistPage />;
    if (type === 'edit-profile') return <EditProfilePage />;

    const config = CONFIG[type] || CONFIG.orders;
    const Icon = config.icon;

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-xl mx-auto" style={{ background: '#F5F5F7' }}>
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 mb-8 text-gray-500 font-semibold hover:text-black transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-gray-300" />
                </div>
                <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">{config.title}</h1>
                <p className="text-gray-500 font-medium">{config.emptyMsg}</p>
                
                <div className="mt-10 pt-10 border-t border-gray-50">
                    <button 
                        onClick={() => navigate('/shop')}
                        className="px-8 py-3 rounded-full bg-[#1A1A1A] text-white font-bold text-sm tracking-wide transition-transform active:scale-95"
                    >
                        Keep Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

