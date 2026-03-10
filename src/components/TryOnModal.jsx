import React, { useState, useEffect } from 'react';
import { X, Upload, Info, Shield } from 'lucide-react';
import gsap from 'gsap';

export default function TryOnModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-tryon-modal', handleOpen);
        return () => window.removeEventListener('open-tryon-modal', handleOpen);
    }, []);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo('.try-on-content',
                { y: '100%' },
                { y: '0%', duration: 0.6, ease: 'power4.out' }
            );
        }
    }, [isOpen]);

    const close = () => {
        gsap.to('.try-on-content', {
            y: '100%',
            duration: 0.4,
            ease: 'power4.in',
            onComplete: () => setIsOpen(false)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-end justify-center bg-black/40 backdrop-blur-sm">
            <div className="try-on-content w-full h-[95vh] md:h-[90vh] bg-white rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-6 md:px-12 md:py-8 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">3D Try-On</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold rounded-full uppercase tracking-wider">Coming Soon</span>
                        </div>
                    </div>
                    <button onClick={close} className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                    <div className="max-w-2xl w-full text-center py-12">
                        <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-gray-200">
                            <Upload className="w-8 h-8 text-gray-400" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-heading font-bold mb-4">Upload your photo</h3>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            Our AI is currently being trained to create your perfect 3D clone.
                            Soon you'll be able to see how any outfit fits you instantly.
                        </p>

                        <button className="px-10 py-4 bg-[#1A1A1A] text-white rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all opacity-50 cursor-not-allowed">
                            Select Photo
                        </button>

                        <div className="mt-20 flex flex-col md:flex-row gap-6 text-left">
                            <div className="flex-1 p-6 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                                        <Info className="w-4 h-4 text-[#22C55E]" />
                                    </div>
                                    <h4 className="font-bold">How it works</h4>
                                </div>
                                <p className="text-sm text-gray-600">We use advanced neural radiance fields (NeRF) to generate a 1:1 scale digital twin of your physique.</p>
                            </div>
                            <div className="flex-1 p-6 bg-[#F8F9FA] rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-[#22C55E]" />
                                    </div>
                                    <h4 className="font-bold">Privacy First</h4>
                                </div>
                                <p className="text-sm text-gray-600">Your photos are processed locally and deleted immediately after clone generation. We never store your raw images.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
