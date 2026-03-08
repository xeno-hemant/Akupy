import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAuthStore from '../store/useAuthStore';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'business'
  const [status, setStatus] = useState('idle'); // idle, loading, error

  // Simple handler to try and login OR register
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setStatus('loading');
    
    // Attempt Login first through Zustand
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      // If login fails, attempt to register them instead
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role })
        });
        
        if (response.ok) {
          // If register succeeds, log them in automatically
          await login(email, password);
          navigate('/dashboard');
        } else {
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
            {/* Role Toggle */}
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
    </section>
  );
}
