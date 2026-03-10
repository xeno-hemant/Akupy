import React, { useState } from 'react';
import useTryOnStore from '../../store/useTryOnStore';
import { X, Ruler, Camera, ChevronRight } from 'lucide-react';
import ManualProfileForm from './ManualProfileForm';
import CameraScanner from './CameraScanner';

export default function TryOnOnboardingModal() {
    const {
        isOnboardingOptionsOpen,
        isManualFormOpen,
        isScannerOpen,
        closeAllModals,
        openManualForm,
        openScanner
    } = useTryOnStore();

    if (!isOnboardingOptionsOpen && !isManualFormOpen && !isScannerOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={closeAllModals}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#3d3830] border border-white/10 rounded-3xl shadow-2xl flex flex-col z-10 animate-fade-in-up">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 bg-[#3d3830]/95 backdrop-blur-sm z-20">
                    <h2 className="text-xl md:text-2xl font-heading font-black text-white/90">
                        Create Your <span style={{ color: '#8E867B' }}>Body Clone</span>
                    </h2>
                    <button
                        onClick={closeAllModals}
                        className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Dynamic Content */}
                <div className="p-6 md:p-10 flex-grow min-h-[400px]">
                    {isOnboardingOptionsOpen && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="text-center mb-8">
                                <p className="text-[#8b8ba0] text-lg font-body max-w-xl mx-auto">
                                    To try on clothes virtually, we need to create a 3D avatar that matches your unique body shape. How would you like to set it up?
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Option A */}
                                <button
                                    onClick={openManualForm}
                                    className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 overflow-hidden"
                                    style={{ '--hover-bg': 'rgba(142,134,123,0.1)', '--hover-border': 'rgba(142,134,123,0.5)' }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; e.currentTarget.style.borderColor = 'var(--hover-border)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                >
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'rgba(142,134,123,0.1)' }}>
                                        <Ruler className="w-8 h-8" style={{ color: '#8E867B' }} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Manual Measurements</h3>
                                    <p className="text-[#8b8ba0] text-sm mb-6 flex-grow">
                                        Input your height, weight, and general measurements. Fast and simple.
                                    </p>
                                    <div className="flex items-center font-semibold text-sm" style={{ color: '#8E867B' }}>
                                        Quick Setup <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </button>

                                {/* Option B */}
                                <button
                                    onClick={openScanner}
                                    className="group relative flex flex-col items-center text-center p-8 rounded-2xl transition-all hover:-translate-y-1 overflow-hidden"
                                    style={{ border: '1px solid rgba(142,134,123,0.3)', background: 'linear-gradient(to bottom, rgba(142,134,123,0.1), transparent)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(142,134,123,0.2), transparent)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(142,134,123,0.15)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(142,134,123,0.1), transparent)'; e.currentTarget.style.boxShadow = 'none' }}
                                >
                                    <div className="absolute top-4 right-4 text-[#F3F0E2] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md" style={{ background: '#8E867B' }}>
                                        Recommended
                                    </div>
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'rgba(142,134,123,0.2)' }}>
                                        <Camera className="w-8 h-8" style={{ color: '#8E867B' }} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">360° Body Scan</h3>
                                    <p className="text-[#8b8ba0] text-sm mb-6 flex-grow">
                                        Use your camera to capture your body in 360°. AI will automatically extract highly accurate measurements.
                                    </p>
                                    <div className="flex items-center font-semibold text-sm" style={{ color: '#8E867B' }}>
                                        Start Scan <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {isManualFormOpen && <ManualProfileForm />}
                    {isScannerOpen && <CameraScanner />}

                </div>
            </div>
        </div>
    );
}
