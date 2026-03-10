import React from 'react';
import useTryOnStore from '../../store/useTryOnStore';
import { X, Share2, Info } from 'lucide-react';
import VirtualTryOnCanvas from './VirtualTryOnCanvas';
import FitAnalysisPanel from './FitAnalysisPanel';
import AIStylistPanel from './AIStylistPanel';

export default function TryOnViewerModal() {
    const { isTryOnModalOpen, closeAllModals, activeTryOnProduct } = useTryOnStore();

    if (!isTryOnModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#3d3830]/95 backdrop-blur-xl transition-opacity duration-300"
                onClick={closeAllModals}
            />

            {/* Main Container */}
            <div className="relative w-full h-full max-w-[1400px] bg-[#13131f] md:border border-white/10 md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 animate-fade-in-up">

                {/* Left: 3D Canvas Area */}
                <div className="relative w-full md:w-3/5 lg:w-2/3 h-[50vh] md:h-full bg-black/40 border-r border-white/5 flex flex-col">

                    <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8E867B' }}></span>
                        <span className="text-white font-bold text-sm tracking-widest uppercase">Live Fitting</span>
                    </div>

                    <button
                        onClick={closeAllModals}
                        className="md:hidden absolute top-6 right-6 z-20 p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* 3D Scene */}
                    <div className="flex-grow">
                        <VirtualTryOnCanvas />
                    </div>

                    {/* Action Bar Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all">
                            <Share2 className="w-4 h-4" /> Share Look
                        </button>
                    </div>
                </div>

                {/* Right: Evaluation Panels */}
                <div className="w-full md:w-2/5 lg:w-1/3 h-[50vh] md:h-full overflow-y-auto bg-[#13131f] flex flex-col relative">

                    <button
                        onClick={closeAllModals}
                        className="hidden md:flex absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-6 md:p-8 space-y-8 pt-16 md:pt-8 min-h-max">

                        {/* Context Header */}
                        {activeTryOnProduct ? (
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="w-20 h-20 rounded-xl bg-black/50 overflow-hidden flex-shrink-0">
                                    {activeTryOnProduct.imageUrl ? (
                                        <img src={activeTryOnProduct.imageUrl} alt={activeTryOnProduct.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-white/30">No Img</div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-white font-bold text-lg line-clamp-1">{activeTryOnProduct.name}</h3>
                                    <span className="font-black" style={{ color: '#8E867B' }}>${activeTryOnProduct.price}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                                No product selected.
                            </div>
                        )}

                        {/* Simulated AI Panels */}
                        {activeTryOnProduct && (
                            <>
                                <FitAnalysisPanel product={activeTryOnProduct} />
                                <AIStylistPanel product={activeTryOnProduct} />
                            </>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
