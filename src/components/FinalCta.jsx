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
  const { user, login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Default to business if on the sell page, otherwise user
  const [role, setRole] = useState(location.pathname === '/sell' ? 'business' : 'user'); 
  const [authMode, setAuthMode] = useState('register'); // 'login' or 'register'
  const [status, setStatus] = useState('idle'); // idle, loading, error

  const [monetizationPlan, setMonetizationPlan] = useState(''); // 'commission' or 'subscription'
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // If registering as a business and no plan selected yet, show modal first
    if (authMode === 'register' && role === 'business' && !monetizationPlan) {
      setShowPricingModal(true);
      return;
    }

    executeAuth();
  };

  const executeAuth = async () => {
    setStatus('loading');
    
    if (authMode === 'login') {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setStatus('error');
      }
    } else {
      // Register logic
      try {
        const payload = { email, password, role };
        if (role === 'business' && monetizationPlan) {
          payload.monetizationPlan = monetizationPlan;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          // If register succeeds, log them in automatically
          await login(email, password);
          setShowPricingModal(false);
          navigate('/dashboard');
        } else {
          // Maybe it failed because user already exists. Fall back to error.
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
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
    <section id="register-section" ref={containerRef} className="w-full bg-background px-6 md:px-16 py-32">
      <div className="cta-content max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-24 text-center flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-heading font-medium text-[#080808] mb-6 tracking-tight">
          Join the Platform
        </h2>
        <p className="text-[#080808]/80 text-lg md:text-2xl font-body max-w-2xl mb-12">
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
                onClick={() => setAuthMode('login')}
                className={`text-lg font-bold transition-colors pb-1 border-b-2 ${authMode === 'login' ? 'border-[#080808] text-[#080808]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
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

            <form onSubmit={handleAuth} className="flex flex-col md:flex-row gap-4 w-full justify-center">
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-4 rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors w-full md:w-auto flex-grow"
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-6 py-4 rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors w-full md:w-auto flex-grow"
                required
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-[#080808] text-white rounded-full px-10 py-4 font-semibold hover:bg-[#080808]/90 transition-transform active:scale-95 duration-200 disabled:opacity-70 flex items-center justify-center min-w-[160px]"
              >
                {status === 'loading' ? 'Authenticating...' : status === 'error' ? 'Failed - Try Again' : 'Continue'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Pricing Modal for Sellers */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowPricingModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="text-center mb-10">
              <h3 className="text-3xl font-heading font-bold text-[#080808] mb-4">Choose Your Selling Plan</h3>
              <p className="text-gray-500 max-w-xl mx-auto">Select how you want to grow your business on Akupy. You can change this later in your dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Commission */}
              <div 
                className="border-2 border-gray-200 hover:border-black rounded-2xl p-8 cursor-pointer transition-all duration-300 relative group flex flex-col items-center text-center"
                onClick={() => {
                  setMonetizationPlan('commission');
                  // Give state a moment to update before executing
                  setTimeout(() => executeAuth(), 0);
                }}
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
                </div>
                <h4 className="text-2xl font-bold mb-2">Pay as you earn</h4>
                <div className="text-4xl font-heading font-black text-black mb-4">2% <span className="text-lg text-gray-400 font-medium">/ sale</span></div>
                <p className="text-gray-500 text-sm mb-6 max-w-[250px]">Perfect for small businesses or new sellers testing the waters.</p>
                
                <ul className="space-y-3 text-sm text-gray-600 w-full text-left pl-4">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> No upfront costs</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited product listings</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Basic analytics</li>
                </ul>
                <div className="mt-8 w-full bg-black text-white py-3 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {status === 'loading' ? 'Processing...' : 'Select Plan'}
                </div>
              </div>

              {/* Option 2: Subscription */}
              <div 
                className="border-2 border-primary bg-[#F0FDF4] hover:shadow-lg rounded-2xl p-8 cursor-pointer transition-all duration-300 relative group flex flex-col items-center text-center"
                onClick={() => {
                  setMonetizationPlan('subscription');
                  setTimeout(() => executeAuth(), 0);
                }}
              >
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <h4 className="text-2xl font-bold mb-2">High Volume</h4>
                <div className="text-4xl font-heading font-black text-black mb-4">₹6,000 <span className="text-lg text-gray-500 font-medium">/ mo</span></div>
                <p className="text-gray-600 text-sm mb-6 max-w-[250px]">Keep 100% of your profits. Best for established stores making {'>'} ₹300k/mo.</p>
                
                <ul className="space-y-3 text-sm text-gray-700 w-full text-left pl-4">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 0% transaction fees</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Priority placement ranking</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced analytics & insights</li>
                </ul>
                <div className="mt-8 w-full bg-primary text-black py-3 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  {status === 'loading' ? 'Processing...' : 'Select Priority Plan'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
