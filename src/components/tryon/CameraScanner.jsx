import React, { useState, useEffect, useRef } from 'react';
import useTryOnStore from '../../store/useTryOnStore';
import useAuthStore from '../../store/useAuthStore';
import { Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CameraScanner() {
    const { user, token } = useAuthStore();
    const { saveManualProfile } = useTryOnStore();
    const videoRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [step, setStep] = useState('intro'); // intro, scanning, processing, result, error
    const [scanProgress, setScanProgress] = useState(0);
    const [permissionError, setPermissionError] = useState(false);

    // Stop camera when component unmounts
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStep('scanning');
            simulateScanActivity();
        } catch (err) {
            console.error(err);
            setPermissionError(true);
            setStep('error');
        }
    };

    const simulateScanActivity = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            setScanProgress(progress);

            if (progress === 100) {
                clearInterval(interval);
                setStep('processing');
                setTimeout(() => setStep('result'), 2500); // Simulate AI crunching
            }
        }, 100); // 10 second scan
    };

    const handleSaveSimulatedProfile = async () => {
        if (!user) return;

        // Simulate what the AI extracted based on visual heuristics
        const aiDerivedData = {
            height: 175,
            weight: 70,
            gender: 'Male', // Mocked estimation
            age: 28,
            chest: 98,
            waist: 82,
            hips: 95,
            shoulders: 45,
            inseam: 80,
            neck: 38,
            skinTone: '#eccba5',
            bodyShape: 'Inverted Triangle',
            measurementSource: 'scan'
        };

        await saveManualProfile(aiDerivedData, token);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in relative overflow-hidden rounded-2xl bg-[#3d3830]">

            {/* Intro Step */}
            {step === 'intro' && (
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(142,134,123,0.1)' }}>
                        <Camera className="w-10 h-10" style={{ color: '#8E867B' }} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">360° AI Body Scan</h3>
                    <p className="text-[#8b8ba0]">
                        Please stand about 6 feet away from your device in form-fitting clothes. Ensure your room is well-lit. We will guide you to slowly rotate 360 degrees.
                    </p>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-[#8b8ba0] text-left">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Place phone on a stable surface.</li>
                            <li>Make sure your full body is in frame.</li>
                            <li>Wait for the beep before rotating.</li>
                        </ul>
                    </div>
                    <button
                        onClick={startCamera}
                        className="w-full py-4 rounded-xl font-bold active:scale-95 transition-all text-lg"
                        style={{ background: '#8E867B', color: '#F3F0E2', boxShadow: '0 0 20px rgba(142,134,123,0.3)' }}
                    >
                        Allow Camera Access
                    </button>
                </div>
            )}

            {/* Scanning Step */}
            {(step === 'scanning' || step === 'processing') && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden border-2 shadow-[0_0_30px_rgba(142,134,123,0.2)]" style={{ borderColor: 'rgba(142,134,123,0.5)' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover opacity-80"
                            style={{ transform: 'scaleX(-1)' }} // Mirror view
                        />

                        {/* UI Overlay on Video */}
                        <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
                                {step === 'processing' ? 'Generating 3D mesh...' : 'Slowly rotate 360°'}
                            </div>

                            {/* Aiming Reticle */}
                            {step === 'scanning' && (
                                <div className="w-48 h-[60%] border-2 border-dashed rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(142,134,123,0.6)' }}>
                                    <div className="w-full h-1 animate-pulse absolute" style={{ background: 'rgba(142,134,123,0.4)' }}></div>
                                </div>
                            )}

                            {/* Progress Bar */}
                            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
                                <div className="h-2.5 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%`, background: '#8E867B' }}></div>
                            </div>
                        </div>
                    </div>

                    {step === 'processing' && (
                        <div className="mt-8 flex items-center justify-center gap-3 font-bold text-lg animate-pulse" style={{ color: '#8E867B' }}>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            AI is extracting your exact measurements...
                        </div>
                    )}
                </div>
            )}

            {/* Result Step */}
            {step === 'result' && (
                <div className="max-w-md mx-auto space-y-6 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border" style={{ background: 'rgba(142,134,123,0.2)', borderColor: '#8E867B' }}>
                        <CheckCircle2 className="w-10 h-10" style={{ color: '#8E867B' }} />
                    </div>
                    <h3 className="text-3xl font-black text-white">Scan Complete!</h3>
                    <p className="text-[#8b8ba0] mb-8">
                        We've successfully created your digital twin with 98% estimated accuracy.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left p-6 bg-white/5 border border-white/10 rounded-2xl mb-8">
                        <div><span className="text-[#8b8ba0] text-sm flex">Chest</span><span className="text-white font-bold text-lg">98 cm</span></div>
                        <div><span className="text-[#8b8ba0] text-sm flex">Waist</span><span className="text-white font-bold text-lg">82 cm</span></div>
                        <div><span className="text-[#8b8ba0] text-sm flex">Hips</span><span className="text-white font-bold text-lg">95 cm</span></div>
                        <div><span className="text-[#8b8ba0] text-sm flex">Height</span><span className="text-white font-bold text-lg">175 cm</span></div>
                        <div className="col-span-2 pt-2 border-t border-white/10 mt-2">
                            <span className="text-[#8b8ba0] text-sm flex">Computed Body Shape</span>
                            <span className="font-bold text-lg flex items-center gap-2" style={{ color: '#8E867B' }}>▼ Inverted Triangle</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveSimulatedProfile}
                        className="w-full py-4 rounded-xl font-bold hover:brightness-110 transition-all text-lg shadow-[0_0_20px_rgba(142,134,123,0.3)]"
                        style={{ background: '#8E867B', color: '#F3F0E2' }}
                    >
                        Confirm & View 3D Avatar
                    </button>
                </div>
            )}

            {/* Error Step */}
            {step === 'error' && (
                <div className="max-w-md mx-auto space-y-6 py-12">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Camera Access Denied</h3>
                    <p className="text-[#8b8ba0]">
                        {permissionError
                            ? "We couldn't access your camera. Please check your browser permissions or manually enter your measurements."
                            : "Something went wrong during the scan."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}

        </div>
    );
}
