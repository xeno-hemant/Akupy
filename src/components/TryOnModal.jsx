import React, { useState, useEffect, useRef } from 'react';
import { X, Ruler, Camera, ChevronRight, Info, Shield, RotateCw } from 'lucide-react';
import gsap from 'gsap';

export default function TryOnModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('measurements'); // 'measurements' or 'scan'
    const [measurements, setMeasurements] = useState({
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: ''
    });
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);

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
            onComplete: () => {
                setIsOpen(false);
                stopCamera();
            }
        });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsScanning(true);
            }
        } catch (err) {
            console.error("Camera access denied", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-end justify-center bg-black/60 backdrop-blur-md">
            <div className="try-on-content w-full h-[95vh] md:h-[92vh] bg-white rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Drag Handle for Mobile */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 md:hidden" />

                {/* Header with Tabs */}
                <div className="px-6 md:px-12 pt-4 pb-0 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight">Virtual Fit</h2>
                        <button onClick={close} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex gap-8">
                        <TabButton 
                            active={activeTab === 'measurements'} 
                            onClick={() => { setActiveTab('measurements'); stopCamera(); }}
                            icon={<Ruler className="w-4 h-4" />}
                            label="Measurements"
                        />
                        <TabButton 
                            active={activeTab === 'scan'} 
                            onClick={() => { setActiveTab('scan'); startCamera(); }}
                            icon={<Camera className="w-4 h-4" />}
                            label="360° Scan"
                            isNew
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow overflow-y-auto">
                    {activeTab === 'measurements' ? (
                        <div className="p-6 md:p-12 flex flex-col md:flex-row gap-12">
                            {/* Left: Input Form */}
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Build your 3D physique</h3>
                                    <p className="text-sm text-gray-500">Enter your core metrics for a precision size match.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <MeasurementInput label="Height (cm)" value={measurements.height} onChange={(v) => setMeasurements({...measurements, height: v})} placeholder="175" />
                                    <MeasurementInput label="Weight (kg)" value={measurements.weight} onChange={(v) => setMeasurements({...measurements, weight: v})} placeholder="70" />
                                    <MeasurementInput label="Chest (in)" value={measurements.chest} onChange={(v) => setMeasurements({...measurements, chest: v})} placeholder="38" />
                                    <MeasurementInput label="Waist (in)" value={measurements.waist} onChange={(v) => setMeasurements({...measurements, waist: v})} placeholder="32" />
                                    <div className="col-span-2">
                                        <MeasurementInput label="Hips (in)" value={measurements.hips} onChange={(v) => setMeasurements({...measurements, hips: v})} placeholder="36" />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-[#22C55E] text-white rounded-2xl font-black text-lg shadow-[0_8px_25px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                                    Calculate My Fit
                                </button>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                    <Shield className="w-4 h-4 text-[#22C55E] mt-0.5" />
                                    <p className="text-xs text-gray-500 leading-relaxed">Your metrics are processed securely and never shared with third parties. Used only for size prediction.</p>
                                </div>
                            </div>

                            {/* Right: Silhouette Visualization */}
                            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8F9FA] rounded-[3rem] border border-gray-100 min-h-[400px] relative overflow-hidden group">
                                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <RotateCw className="w-3 h-3 animate-spin-slow" /> Live Preview
                                </div>
                                
                                {/* Animated Silhouette */}
                                <div className="w-48 h-80 relative animate-float">
                                    <svg viewBox="0 0 100 200" className="w-full h-full text-gray-200 fill-current drop-shadow-2xl">
                                        <path d="M50 10 C40 10 35 20 35 30 C35 40 40 50 50 50 C60 50 65 40 65 30 C65 20 60 10 50 10 M35 55 L20 100 C15 110 25 120 30 110 L40 70 L60 70 L70 110 C75 120 85 110 80 100 L65 55 Z M40 75 L40 190 C40 195 45 195 45 190 L45 120 L55 120 L55 190 C55 195 60 195 60 190 L60 75 Z" />
                                    </svg>
                                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gray-200/50 blur-xl rounded-full scale-150 -z-10" />
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="font-bold text-gray-800">Size Prediction: <span className="text-[#22C55E]">Large (L)</span></p>
                                    <p className="text-xs text-gray-400 mt-1">Based on regular fit preference</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
                            <div className="max-w-md w-full text-center">
                                <div className="relative w-full aspect-[4/3] bg-black rounded-[2rem] overflow-hidden mb-8 shadow-2xl border-4 border-gray-900 group">
                                    {isScanning ? (
                                        <>
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
                                            {/* Scanner UI Overlays */}
                                            <div className="absolute inset-0 border-[3px] border-[#22C55E]/30 m-4 rounded-xl" />
                                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#22C55E] shadow-[0_0_15px_#22C55E] animate-pulse" />
                                            <div className="absolute bottom-6 inset-x-0 flex justify-center">
                                                <div className="px-4 py-2 bg-[#22C55E] text-white text-xs font-black rounded-full animate-bounce">
                                                    Stand 6ft away & Rotate Slowly
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <Camera className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    
                                    {/* Coming Soon Overlay */}
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                        <div className="px-4 py-1.5 bg-[#F59E0B] text-black text-[10px] font-black rounded-full uppercase tracking-tighter mb-4 shadow-lg animate-pulse">
                                            Coming Soon
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">3D Body Scan 2.0</h3>
                                        <p className="text-sm opacity-70 px-8">Real-time point-cloud generation using NeRF technology. Stay tuned!</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-500 text-sm">360° Scan requires a high-resolution front camera and stable lighting.</p>
                                    <div className="flex justify-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ active, onClick, icon, label, isNew }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 pb-4 border-b-2 transition-all relative ${
            active ? 'border-[#22C55E] text-[#1A1A1A] font-bold' : 'border-transparent text-gray-400 font-medium hover:text-gray-600'
        }`}
    >
        {icon}
        <span>{label}</span>
        {isNew && (
            <span className="absolute -top-1 -right-4 w-2 h-2 bg-[#F59E0B] rounded-full" />
        )}
    </button>
);

const MeasurementInput = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1">{label}</label>
        <input 
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/5 outline-none transition-all text-sm font-bold"
        />
    </div>
);
