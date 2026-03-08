import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const containerRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setStatus('loading');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'business' })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        console.error(data.message);
      }
    } catch (err) {
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

  return (
    <section ref={containerRef} className="w-full bg-background px-6 md:px-16 py-32">
      <div className="cta-content max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-24 text-center flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-heading font-medium text-[#080808] mb-6 tracking-tight">
          Ready for Discovery?
        </h2>
        <p className="text-[#080808]/80 text-lg md:text-2xl font-body max-w-2xl mb-12">
          Join the platform where local businesses meet global reach without compromising privacy.
        </p>

        {status === 'success' ? (
          <div className="bg-[#080808] text-white rounded-2xl px-10 py-8 text-center animate-fade-in shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">Welcome to Akupy!</h3>
            <p className="text-white/80">Your business profile has been requested. Check your email to verify.</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col md:flex-row gap-4 w-full justify-center max-w-xl">
            <input 
              type="email" 
              placeholder="Business Email" 
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
              {status === 'loading' ? 'Joining...' : status === 'error' ? 'Failed - Try Again' : 'Register Now'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
