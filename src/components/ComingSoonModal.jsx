import React, { useEffect, useRef } from 'react';
import { X, Globe, Shirt, Shield } from 'lucide-react';
import gsap from 'gsap';

export default function ComingSoonModal({ isOpen, onClose, feature }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(backdropRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current, 
        { opacity: 0, y: 50, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const contentMap = {
    discover: {
      icon: <Globe className="w-12 h-12 text-[#22C55E]" />,
      title: "Discover Nearby",
      description: "Explore local shops and service providers around you with our interactive discovery system."
    },
    globe: {
      icon: <Globe className="w-12 h-12 text-[#22C55E]" />,
      title: "Globe Shop",
      description: "Discover shops from around the world on an interactive 3D globe. Explore local businesses globally."
    },
    tryon: {
      icon: <Shirt className="w-12 h-12 text-[#3B82F6]" />,
      title: "360° Try-On",
      description: "Virtually try clothes and accessories using AI before you buy. See how it looks on you."
    },
    incognito: {
      icon: <Shield className="w-12 h-12 text-[#8E867B]" />,
      title: "Incognito Mode",
      description: "Shop privately without revealing your identity to sellers. Complete anonymity."
    }
  };

  const data = contentMap[feature] || contentMap.globe;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col items-center p-8 text-center"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Large Feature Icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner" style={{ background: '#F5F0E8' }}>
          {data.icon}
        </div>

        {/* Feature Name */}
        <h2 className="text-2xl font-heading font-black text-[#1A1A1A] mb-3">
          {data.title}
        </h2>

        {/* Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 mb-6">
          🚀 Coming Soon
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8 px-2">
          {data.description}
        </p>

        {/* Action Button (Close) */}
        <button 
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg"
          style={{ background: '#1A1A1A' }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
