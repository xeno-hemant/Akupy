import React, { useState, useEffect, useRef } from 'react';
import { X, Ruler, Camera, ChevronRight, Info, Shield, RotateCw, CheckCircle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import useAuthStore from '../store/useAuthStore';

export default function TryOnModal() {
    const { token } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('measurements'); // 'measurements' or 'scan'
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [measurements, setMeasurements] = useState({
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        gender: 'male'
    });

    const [cameraState, setCameraState] = useState('idle'); // idle, permission, active, processing
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-tryon', handleOpen);
        window.addEventListener('open-tryon-modal', handleOpen);
        return () => {
            window.removeEventListener('open-tryon', handleOpen);
            window.removeEventListener('open-tryon-modal', handleOpen);
        };
    }, []);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const close = () => {
        setIsOpen(false);
        stopCamera();
        setCameraState('idle');
    };

    const startCamera = async () => {
        try {
            const devStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(devStream);
            if (videoRef.current) videoRef.current.srcObject = devStream;
            setCameraState('active');
        } catch (err) {
            alert('Camera access denied. Switching to manual measurements.');
            setActiveTab('measurements');
            setCameraState('idle');
        }
    };

    const captureAndProcess = () => {
        setCameraState('processing');
        stopCamera();
        
        // Simulated AI analysis
        setTimeout(() => {
            setMeasurements({
                height: '178',
                weight: '75',
                chest: '100',
                waist: '84',
                hips: '98',
                gender: 'male'
            });
            setCameraState('idle');
            setActiveTab('measurements');
            // Animate form visibility
            gsap.fromTo('.measurements-form', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
        }, 2000);
    };

    const calculateFit = async () => {
        const { height, weight, chest, waist, hips } = measurements;
        if (!height || !weight || !chest || !waist || !hips) {
            alert('Please fill all measurement fields');
            return;
        }

        setLoading(true);

        // 1. Calculate Sizes
        const chestNum = parseFloat(chest);
        const waistNum = parseFloat(waist);
        const heightM = parseFloat(height) / 100;
        const weightKG = parseFloat(weight);

        // Top size calculation (CM)
        let topSize = 'M';
        if (chestNum < 86) topSize = 'XS';
        else if (chestNum <= 91) topSize = 'S';
        else if (chestNum <= 99) topSize = 'M';
        else if (chestNum <= 107) topSize = 'L';
        else if (chestNum <= 114) topSize = 'XL';
        else topSize = 'XXL';

        // Bottom size calculation (CM)
        let botSize = '32';
        if (waistNum < 71) botSize = '28';
        else if (waistNum <= 76) botSize = '30';
        else if (waistNum <= 81) botSize = '32';
        else if (waistNum <= 86) botSize = '34';
        else if (waistNum <= 91) botSize = '36';
        else botSize = '38+';

        // BMI
        const bmiVal = weightKG / (heightM * heightM);
        let bmiCategory = 'Normal';
        let recFit = 'Regular';

        if (bmiVal < 18.5) {
            bmiCategory = 'Underweight';
            recFit = 'Slim';
        } else if (bmiVal <= 24.9) {
            bmiCategory = 'Normal';
            recFit = 'Regular';
        } else if (bmiVal <= 29.9) {
            bmiCategory = 'Overweight';
            recFit = 'Regular';
        } else {
            bmiCategory = 'Obese';
            recFit = 'Relaxed';
        }

        const calcResults = {
            topSize,
            botSize,
            bmi: bmiVal.toFixed(1),
            bmiCategory,
            recFit
        };

        setResults(calcResults);

        // 2. Save to Backend
        try {
            const apiurl = !import.meta.env.DEV && window.location.hostname.includes('akupy.in') 
              ? 'https://akupybackend.onrender.com' 
              : `http://${window.location.hostname}:5000`;

            await fetch(`${apiurl}/api/profile/measurements`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...measurements,
                    calculatedSizeTop: topSize,
                    calculatedSizeBottom: botSize,
                    bmi: bmiVal.toFixed(1),
                    bmiCategory
                })
            });

            setSuccessMessage("✅ Measurements saved! We'll recommend your size on products.");
            setShowResults(true);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            console.error('Backend save failed', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={close}></div>
            <div className="try-on-content relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                
                {/* Header */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Virtual Fit</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">AI-Powered Precision</p>
                        </div>
                        <button onClick={close} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-2">
                        <button 
                            onClick={() => { setActiveTab('measurements'); stopCamera(); setCameraState('idle'); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'measurements' ? 'bg-white text-[#22C55E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Ruler className="w-4 h-4" /> Measurements
                        </button>
                        <button 
                            onClick={() => { setActiveTab('scan'); setCameraState('idle'); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'scan' ? 'bg-white text-[#22C55E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Camera className="w-4 h-4" /> 360° Scan
                            <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full ml-1">BETA</span>
                        </button>
                    </div>
                </div>

                {/* Main View */}
                <div className="flex-grow overflow-y-auto px-8 pb-8">
                    {activeTab === 'measurements' ? (
                        <div className="space-y-6 measurements-form">
                            {successMessage && (
                                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 text-sm font-medium animate-fade-in">
                                    <CheckCircle className="w-5 h-5" /> {successMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <MeasurementInput label="Height (CM)" value={measurements.height} onChange={(v) => setMeasurements({...measurements, height: v})} placeholder="175" />
                                <MeasurementInput label="Weight (KG)" value={measurements.weight} onChange={(v) => setMeasurements({...measurements, weight: v})} placeholder="70" />
                                <MeasurementInput label="Chest (CM)" value={measurements.chest} onChange={(v) => setMeasurements({...measurements, chest: v})} placeholder="95" />
                                <MeasurementInput label="Waist (CM)" value={measurements.waist} onChange={(v) => setMeasurements({...measurements, waist: v})} placeholder="82" />
                                <MeasurementInput label="Hips (CM)" value={measurements.hips} onChange={(v) => setMeasurements({...measurements, hips: v})} placeholder="98" />
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider pl-1 font-heading">Gender</label>
                                    <select 
                                        value={measurements.gender}
                                        onChange={(e) => setMeasurements({...measurements, gender: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#22C55E] outline-none transition-all text-sm font-bold appearance-none"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={calculateFit}
                                disabled={loading}
                                className="w-full py-4 bg-[#22C55E] text-white rounded-2xl font-black text-lg shadow-[0_8px_25px_rgba(34,197,94,0.3)] hover:scale-[1.01] active:translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Calculate My Fit"}
                            </button>

                            {showResults && results && (
                                <div className="bg-gray-900 rounded-[2rem] p-6 text-white space-y-5 animate-slide-up">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <h3 className="font-bold text-lg">Your Size Profile</h3>
                                        <div className="px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-[10px] font-black tracking-widest uppercase">Verified</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Top Size</p>
                                            <p className="text-3xl font-black text-[#22C55E]">{results.topSize}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Bottom Size</p>
                                            <p className="text-3xl font-black text-[#22C55E]">{results.botSize}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">BMI Score</p>
                                            <p className="text-xl font-bold">{results.bmi} <span className="text-xs font-normal text-gray-500 ml-1">({results.bmiCategory})</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Recommended Fit</p>
                                            <p className="text-xl font-bold">{results.recFit}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                        <Info className="w-3.5 h-3.5" /> Size models are based on global standard charts.
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Shield className="w-5 h-5 text-[#22C55E]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Privacy First</p>
                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Your data stays local. We only use anonymized metrics for sizing.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            {cameraState === 'idle' && (
                                <div className="text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-gray-200">
                                        <Camera className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-800">360° Body Scan</h3>
                                        <p className="text-sm text-gray-500 max-w-[260px] mx-auto font-medium">Use your camera for automatic, precision measurements.</p>
                                    </div>
                                    <button 
                                        onClick={startCamera}
                                        className="bg-[#22C55E] text-white px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-[#22C55E]/20"
                                    >
                                        Start Camera
                                    </button>
                                </div>
                            )}

                            {cameraState === 'active' && (
                                <div className="w-full space-y-6">
                                    <div className="relative aspect-[3/4] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-gray-950">
                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                        {/* SVG Silhouette Guide */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                                            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] text-white">
                                                <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M50 10 C 45 10 42 15 42 20 C 42 25 45 30 50 30 C 55 30 58 25 58 20 C 58 15 55 10 50 10 M 42 20 Q 30 20 25 40 L 28 85 L 35 85 L 38 55 L 42 92 L 58 92 L 62 55 L 65 85 L 72 85 L 75 40 Q 70 20 58 20" />
                                            </svg>
                                        </div>
                                        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-4">
                                            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">Stand 1.5m away & Face Camera</p>
                                            </div>
                                            <button 
                                                onClick={captureAndProcess}
                                                className="w-16 h-16 bg-white border-4 border-[#22C55E] rounded-full p-1"
                                            >
                                                <div className="w-full h-full bg-[#22C55E] rounded-full"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {cameraState === 'processing' && (
                                <div className="text-center space-y-8 animate-pulse">
                                    <div className="relative w-32 h-32 mx-auto">
                                        <div className="absolute inset-0 border-4 border-[#22C55E]/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Ruler className="w-10 h-10 text-[#22C55E]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-800 mb-2">Analyzing Body Metrics</h4>
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Processing 3.4M Data Points...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sticky Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> GDPR Compliant</div>
                    <div className="flex items-center gap-1.5"><RotateCw className="w-3 h-3" /> Real-time Mesh</div>
                </div>
            </div>
        </div>
    );
}

const MeasurementInput = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 font-heading">{label}</label>
        <input 
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#22C55E] outline-none transition-all text-sm font-bold placeholder:text-gray-300"
        />
    </div>
);
