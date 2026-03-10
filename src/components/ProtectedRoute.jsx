import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

// ProtectedSellerRoute: /seller/* routes must check user.role === 'seller'
export const ProtectedSellerRoute = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/shop" state={{ from: location }} replace />;
    }

    if (user.role !== 'seller') {
        window.dispatchEvent(new CustomEvent('incognito-toast', {
            detail: { message: "Seller portal is for sellers only" }
        }));
        return <Navigate to="/" replace />;
    }

    return children;
};

// ProtectedShopperRoute: If seller tries to access shopper pages, redirect to /seller/dashboard
export const ProtectedShopperRoute = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) return null;

    if (user?.role === 'seller' && !location.pathname.startsWith('/seller')) {
        // Some routes like /logout or /profile might be shared, but generally shoppers pages are for shoppers
        // We only redirect if it's a known shopper-only page area
        const shopperOnlyPaths = ['/shop', '/discover', '/cart', '/checkout', '/wardrobe', '/dashboard'];
        if (shopperOnlyPaths.some(path => location.pathname.startsWith(path))) {
            return <Navigate to="/seller/dashboard" replace />;
        }
    }

    return children;
};
