import { X, CheckCircle2, ShoppingBag, EyeOff, UserSquare2 } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import useFeatureStore from '../store/useFeatureStore';

export default function FeatureActionModal({ isOpen, onClose, feature, onTryOnSuccess }) {
  const modalRef = useRef(null);
  const bgRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { setGlobeShop, setIncognito } = useFeatureStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);

      gsap.fromTo(bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)', delay: 0.1 }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, feature]);

  const handleAction = () => {
    setIsLoading(true);
    // Simulate processing delay
    setTimeout(() => {

      if (feature === 'tryon' && onTryOnSuccess) {
        onTryOnSuccess();
        return; // Skip setting step 2 for tryon, directly opens viewer
      }

      setStep(2);

      if (feature === 'globe') setGlobeShop(true);
      if (feature === 'incognito') setIncognito(true);
    }, 1500);
  };

  if (!isOpen || !feature) return null;

  const contentMap = {
    globe: {
      icon: <ShoppingBag className="w-8 h-8" style={{ color: '#3d3830' }} />,
      title: "Activate Globe Shop",
      price: "₹99/month",
      desc: "Unlock access to international sellers. Note: Additional import duties and higher delivery fees will apply to global orders.",
      actionText: "Subscribe Now",
      successText: "Globe Shop is now active! You can now browse international stores.",
      color: "style-globe" // handled below
    },
    incognito: {
      icon: <EyeOff className="w-8 h-8" style={{ color: '#3d3830' }} />,
      title: "Enable Incognito Mode",
      price: "₹99/month",
      desc: "Your identity will be completely hidden from sellers, and your browsing history will not be stored in our database.",
      actionText: "Enable Privacy",
      successText: "You are now invisible. Incognito mode is active.",
      color: "style-incognito"
    },
    tryon: {
      icon: <UserSquare2 className="w-8 h-8" style={{ color: '#3d3830' }} />,
      title: "360° Try-On Setup",
      price: "Free",
      desc: "Let's create your 3D body clone. We'll need a few measurements and a 360-degree video scan to generate your avatar.",
      actionText: "Start Scanning",
      successText: "Processing scan... Your 3D clone will be ready in your profile shortly.",
      color: "style-tryon"
    }
  };

  const data = contentMap[feature];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-black/5 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-10">
          {step === 1 ? (
            <div className="animate-fade-in flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner"
                style={{
                  background: feature === 'globe' ? '#F0EADD' : feature === 'incognito' ? '#E8E0D6' : '#c4a882'
                }}
              >
                {data.icon}
              </div>

              <h2 className="text-2xl font-heading font-black text-[#080808] mb-2">{data.title}</h2>
              {data.price && (
                <div className="inline-block bg-gray-100 text-[#080808] font-bold px-4 py-1.5 rounded-full text-sm mb-4 border border-gray-200">
                  {data.price}
                </div>
              )}

              <p className="text-gray-600 leading-relaxed mb-8">
                {data.desc}
              </p>

              <button
                onClick={handleAction}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold transition-all transform active:scale-95 flex justify-center items-center gap-2 ${isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : ''}`}
                style={!isLoading ? { background: '#8E867B', color: '#F3F0E2' } : {}}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : data.actionText}
              </button>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(122,158,126,0.15)' }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: '#7a9e7e' }} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-[#080808] mb-4">Success!</h2>
              <p className="text-gray-600 mb-8">{data.successText}</p>

              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-[#080808] font-semibold rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
