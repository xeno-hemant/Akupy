import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAuthStore from '../store/useAuthStore';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, error: authError, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Default to business if on the sell page, otherwise user
  const [role, setRole] = useState(location.pathname === '/sell' ? 'business' : 'user'); 
  const [authMode, setAuthMode] = useState('register'); // 'login' or 'register'
  const [status, setStatus] = useState('idle'); // idle, loading, error

  const [monetizationPlan, setMonetizationPlan] = useState(''); // 'commission' or 'subscription'
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  // OTP States
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [isWakingUp, setIsWakingUp] = useState(false); // true when Render is cold-starting

  const isProdHost = window.location.hostname.includes('akupy.in');
  const fallbackUrl = isProdHost ? 'https://akupybackend.onrender.com' : `http://${window.location.hostname}:5000`;
  const apiUrl = import.meta.env.VITE_API_URL || fallbackUrl;

  // On Render free tier, the server can take 50s to wake up from sleep.
  // This helper adds a 65s timeout and shows a wakeup message after 4s.
  const fetchWithTimeout = async (url, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65 second timeout
    let wakeupTimer = null;
    
    if (isProdHost) {
      // After 4 seconds show the "Server waking up" message
      wakeupTimer = setTimeout(() => setIsWakingUp(true), 4000);
    }
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timeoutId);
      clearTimeout(wakeupTimer);
      setIsWakingUp(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    clearError();
    if (!email || !password) return;
    
    // If registering as a business and no plan selected yet, show modal first
    if (authMode === 'register' && role === 'business' && !monetizationPlan) {
      setShowPricingModal(true);
      return;
    }

    if (authMode === 'login') {
      executeLogin();
    } else if (!showOtpField) {
      requestOtp();
    } else {
      verifyOtpAndRegister();
    }
  };

  const executeLogin = async () => {
    setStatus('loading');
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setStatus('error');
    }
  };

  const requestOtp = async () => {
    setStatus('loading');
    try {
      const response = await fetchWithTimeout(`${apiUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setShowOtpField(true);
        setStatus('idle');
        if (showPricingModal) setShowPricingModal(false); // Hide pricing modal if it was open
      } else {
        const errData = await response.json();
        useAuthStore.setState({ error: errData.message || 'Error sending OTP' });
        setStatus('error');
        setShowPricingModal(false);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        useAuthStore.setState({ error: 'Server took too long to respond. Please try again.' });
      } else {
        useAuthStore.setState({ error: 'Server error. Please check your connection.' });
      }
      setStatus('error');
      setIsWakingUp(false);
      setShowPricingModal(false);
    }
  };

  const verifyOtpAndRegister = async () => {
    setStatus('loading');
    try {
      // 1. Verify OTP
      const otpRes = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      if (!otpRes.ok) {
        const errData = await otpRes.json();
        useAuthStore.setState({ error: errData.message || 'Invalid OTP' });
        setStatus('error');
        return;
      }

      // 2. Proceed to Registration
      const payload = { email, password, role };
      if (role === 'business' && monetizationPlan) {
        payload.monetizationPlan = monetizationPlan;
      }

      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        await login(email, password);
        setShowOtpField(false);
        navigate('/dashboard');
      } else {
        const errData = await response.json();
        useAuthStore.setState({ error: errData.message || 'User already exists or invalid data' });
        setStatus('error');
      }
    } catch (err) {
      useAuthStore.setState({ error: 'Server error. Please check your connection.' });
      setStatus('error');
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Listen for the smart onboarding choices from the Hero section
  useEffect(() => {
    const handleOpenAuth = (e) => {
      if (e.detail && e.detail.role) {
        setRole(e.detail.role);
      }
    };
    window.addEventListener('open-auth', handleOpenAuth);
    return () => window.removeEventListener('open-auth', handleOpenAuth);
  }, []);

  return (
    <section id="register-section" ref={containerRef} className="w-full bg-background px-4 md:px-16 py-12 md:py-32">
      <div className="cta-content max-w-5xl mx-auto bg-primary rounded-3xl md:rounded-[2.5rem] p-6 py-12 md:p-24 text-center flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-7xl font-heading font-medium text-[#080808] mb-3 md:mb-6 tracking-tight">
          Join the Platform
        </h2>
        <p className="text-[#080808]/80 text-sm md:text-2xl font-body max-w-2xl mb-8 md:mb-12">
          Whether you're exploring local gems or listing your store, Akupy is your ultimate connection.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="bg-white/10 px-6 py-3 rounded-full text-[#080808] font-medium border border-black/10">
              Logged in as <span className="font-bold">{user.email}</span>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#080808] text-white rounded-full px-12 py-5 text-xl font-semibold hover:bg-[#080808]/90 transition-transform hover:scale-105 active:scale-95 duration-200 shadow-xl"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl">
            {/* Auth Mode Toggle */}
            <div className="flex justify-center mb-6 gap-6">
              <button 
                type="button"
                onClick={() => setAuthMode('register')}
                className={`text-lg font-bold transition-colors pb-1 border-b-2 ${authMode === 'register' ? 'border-[#080808] text-[#080808]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Register
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); clearError(); setStatus('idle'); setShowOtpField(false); }}
                className={`text-base md:text-lg font-bold transition-colors pb-1 border-b-2 ${authMode === 'login' ? 'border-[#080808] text-[#080808]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Log In
              </button>
            </div>

            {/* Role Toggle (Only show if registering) */}
            {authMode === 'register' && (
              <div className="flex justify-center mb-6 bg-white/20 p-1 rounded-full w-max mx-auto border border-black/10">
                <button 
                  type="button"
                  onClick={() => setRole('user')}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${role === 'user' ? 'bg-white text-black shadow-sm' : 'text-[#080808]/70 hover:text-black'}`}
                >
                  I'm a Shopper
                </button>
              <button 
                type="button"
                onClick={() => setRole('business')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${role === 'business' ? 'bg-white text-black shadow-sm' : 'text-[#080808]/70 hover:text-black'}`}
              >
                I'm a Business
              </button>
            </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col md:flex-row gap-3 md:gap-4 w-full justify-center">
              {showOtpField ? (
                // OTP Input Field
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors w-full md:w-auto flex-grow text-center tracking-[0.5em] text-lg font-mono"
                  required
                />
              ) : (
                // Email & Password Fields
                <>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors w-full md:w-auto flex-grow text-sm md:text-base"
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors w-full md:w-auto flex-grow text-sm md:text-base"
                    required
                  />
                </>
              )}
              
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-[#080808] text-white rounded-xl md:rounded-full px-8 md:px-10 py-3 md:py-4 font-semibold hover:bg-[#080808]/90 transition-transform active:scale-95 duration-200 disabled:opacity-70 flex items-center justify-center min-w-[140px] text-sm md:text-base"
              >
                {status === 'loading' 
                  ? (isWakingUp ? '🌐 Connecting...' : 'Processing...')
                  : showOtpField 
                    ? 'Verify & Register'
                    : status === 'error' 
                      ? 'Retry' 
                      : 'Continue'}
              </button>
            </form>
            
            {isWakingUp && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium animate-fade-in flex items-center gap-2">
                <span>⏳</span>
                <span>Server is waking up from sleep mode (Render free tier). This may take up to 30-60 seconds — please wait, do not click again!</span>
              </div>
            )}

            {showOtpField && (
              <p className="text-sm font-medium text-[#080808]/60 mt-4 animate-fade-in">
                We've sent a code to <span className="font-bold text-[#080808]">{email}</span>. Valid for 5 minutes.
              </p>
            )}

            {/* Display Backend Authentication Errors */}
            {(authError || status === 'error') && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium animate-fade-in">
                {authError || 'An unexpected error occurred. Please try again.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing Modal for Sellers */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 py-12 md:p-8 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-12 shadow-2xl relative text-left flex flex-col">
              <button 
                onClick={() => setShowPricingModal(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="text-center mb-6 md:mb-10 pt-4 md:pt-0">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#080808] mb-2 md:mb-4">Choose Your Selling Plan</h3>
                <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">Select how you want to grow your business on Akupy. You can change this later in your dashboard.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">
                {/* Option 1: Commission */}
                <div 
                  className="border-2 border-gray-200 hover:border-black rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 relative group flex flex-col items-center text-center"
                  onClick={() => {
                    setMonetizationPlan('commission');
                    setTimeout(() => requestOtp(), 0);
                  }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Pay as you earn</h4>
                  <div className="text-3xl md:text-4xl font-heading font-black text-black mb-2 md:mb-4">2% <span className="text-sm md:text-lg text-gray-400 font-medium">/ sale</span></div>
                  <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 max-w-[250px]">Perfect for small businesses or new sellers testing the waters.</p>
                  
                  <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600 w-full text-left pl-2 md:pl-4">
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> No upfront costs</li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited product listings</li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Basic analytics</li>
                  </ul>
                  <div className="mt-6 md:mt-8 w-full bg-black text-white py-2 md:py-3 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-sm md:text-base">
                    {status === 'loading' ? 'Processing...' : 'Select Plan'}
                  </div>
                </div>

                {/* Option 2: Subscription */}
                <div 
                  className="border-2 border-primary bg-[#F0FDF4] hover:shadow-lg rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-300 relative group flex flex-col items-center text-center mt-2 md:mt-0"
                  onClick={() => {
                    setMonetizationPlan('subscription');
                    setTimeout(() => requestOtp(), 0);
                  }}
                >
                  <div className="absolute -top-3 right-4 md:right-6 bg-black text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm">RECOMMENDED</div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-primary rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">High Volume</h4>
                  <div className="text-3xl md:text-4xl font-heading font-black text-black mb-2 md:mb-4">₹6,000 <span className="text-sm md:text-lg text-gray-500 font-medium">/ mo</span></div>
                  <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 max-w-[250px]">Keep 100% of your profits. Best for established stores making {'>'} ₹300k/mo.</p>
                  
                  <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700 w-full text-left pl-2 md:pl-4">
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 0% transaction fees</li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Priority placement ranking</li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced analytics & insights</li>
                  </ul>
                  <div className="mt-6 md:mt-8 w-full bg-primary text-black py-2 md:py-3 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-sm md:text-base">
                    {status === 'loading' ? 'Processing...' : 'Select Priority Plan'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
