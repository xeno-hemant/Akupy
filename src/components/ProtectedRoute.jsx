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
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (user.role !== 'seller' && user.role !== 'service_provider') {
        window.dispatchEvent(new CustomEvent('incognito-toast', {
            detail: { message: "Seller portal is for sellers only" }
        }));
        return <Navigate to="/shop" replace />;
    }

    return children;
};

// ProtectedShopperRoute: If seller tries to access shopper pages, redirect to /seller/dashboard
export const ProtectedShopperRoute = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) return null;

    if (user?.role === 'seller' && location.pathname === '/dashboard') {
        // Sellers should go to seller portal when clicking "Dashboard"
        return <Navigate to="/seller/dashboard" replace />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};
