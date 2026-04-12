import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAuthStore from '../store/useAuthStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, verifyLogin, error: authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Default to business if on the sell page, otherwise user
  const [role, setRole] = useState(location.pathname === '/sell' ? 'seller' : 'user');
  const [authMode, setAuthMode] = useState('register'); // 'login', 'register', or 'forgot'
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isWakingUp, setIsWakingUp] = useState(false);

  const isProdHost = !import.meta.env.DEV && window.location.hostname.includes('akupy.in');

  // Helper with wakeup logic for Render
  const requestWithWakeup = async (apiCallFn) => {
    let wakeupTimer = null;
    if (isProdHost) wakeupTimer = setTimeout(() => setIsWakingUp(true), 11000);
    try {
      const response = await apiCallFn();
      return response;
    } finally {
      if (wakeupTimer) clearTimeout(wakeupTimer);
      setIsWakingUp(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    clearError();
    
    // Validate fields based on mode
    if (!email) return;
    if (authMode !== 'forgot' && !password) return;
    if (authMode === 'forgot' && showOtpField && !password) {
      useAuthStore.setState({ error: 'Please enter a new password' });
      return;
    }

    if (authMode === 'register' && role === 'seller') {
      await requestOtp();
      return;
    }

    if (authMode === 'forgot') {
      if (!showOtpField) {
        await requestResetOtp();
      } else {
        await executeResetPassword();
      }
    } else if (authMode === 'login') {
      if (!showOtpField) {
        await executeLogin();
      } else {
        await executeVerifyLogin();
      }
    } else if (!showOtpField) {
      await requestOtp();
    } else {
      await verifyOtpAndRegister();
    }
  };

  const executeLogin = async () => {
    setStatus('loading');
    const result = await login(email, password);
    if (result.success) {
      if (result.otpRequired) {
        setShowOtpField(true);
        setStatus('idle');
      } else {
        // Fallback for direct login if backend allows it
        const roleToUse = result.user?.role || role; 
        navigate(['seller', 'business'].includes(roleToUse) ? '/seller/dashboard' : '/dashboard');
      }
    } else {
      setStatus('error');
    }
  };

  const executeVerifyLogin = async () => {
    setStatus('loading');
    const result = await verifyLogin(email, otp);
    if (result.success) {
      const roleToUse = result.user.role;
      navigate(['seller', 'business'].includes(roleToUse) ? '/seller/dashboard' : '/dashboard');
    } else {
      setStatus('error');
    }
  };

  const requestOtp = async () => {
    setStatus('loading');
    try {
      const payload = { email };
      if (authMode === 'register') {
        payload.password = password;
        payload.role = role;
      }
      const res = await requestWithWakeup(() => api.post(authMode === 'register' ? API.REGISTER : API.SEND_OTP, payload));
      if (res.data) {
        setShowOtpField(true);
        setStatus('idle');
        
        if (res.data.devOtp) {
          console.log('%c[AKUPY DEV MODE]', 'color: #22C55E; font-weight: bold; font-size: 14px;', `Your verification code is: ${res.data.devOtp}`);
          alert(`Dev Mode: Verification code is ${res.data.devOtp} (also logged to console)`);
        }
      } else {
        const errorMsg = 'Error sending OTP';
        useAuthStore.setState({ error: errorMsg });
        setStatus('error');
        setShowPricingModal(false);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        useAuthStore.setState({ error: 'Request timed out. Server may be waking up. Please try again.' });
      } else {
        useAuthStore.setState({ error: err.response?.data?.message || 'Server error. Please check your connection.' });
      }
      setStatus('error');
      setIsWakingUp(false);
      setShowPricingModal(false);
    }
  };

  const executeResetPassword = async () => {
    setStatus('loading');
    try {
      if (!resetToken) {
        // Step 2: Verify OTP and get Refresh Token
        const res = await requestWithWakeup(() => api.post(API.VERIFY_RESET_OTP, { email, otp }));
        if (res.data?.success) {
          setResetToken(res.data.resetToken);
          setStatus('idle');
          // Now the user can enter the password and click again to reset
        } else {
          useAuthStore.setState({ error: res.data?.message || 'Invalid OTP' });
          setStatus('error');
        }
      } else {
        // Step 3: Final Reset with Token
        const res = await requestWithWakeup(() => api.post(API.RESET_PASSWORD, { 
          resetToken, 
          newPassword: password 
        }));
        if (res.data?.success) {
          alert('Password reset successful! You can now log in.');
          setAuthMode('login');
          setShowOtpField(false);
          setOtp('');
          setPassword('');
          setResetToken('');
          setStatus('idle');
        } else {
          useAuthStore.setState({ error: res.data?.message || 'Reset failed' });
          setStatus('error');
        }
      }
    } catch (err) {
      setStatus('error');
      useAuthStore.setState({ error: err.response?.data?.message || 'An error occurred during reset' });
      console.error(err);
    }
  };

  const requestResetOtp = async () => {
    setStatus('loading');
    try {
      const res = await requestWithWakeup(() => api.post(API.FORGOT_PASSWORD, { email }));
      if (res.data?.success) {
        setShowOtpField(true);
        setStatus('idle');
        if (res.data.devOtp) {
          alert(`Dev Mode: Reset code is ${res.data.devOtp}`);
        }
      } else {
        useAuthStore.setState({ error: res.data?.message || 'Failed to send OTP' });
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
      useAuthStore.setState({ error: err.response?.data?.message || 'An error occurred while sending OTP' });
      console.error(err);
    }
  };

  const verifyOtpAndRegister = async () => {
    setStatus('loading');
    try {
      const payload = { email, password, role };
      const otpRes = await requestWithWakeup(() => api.post(API.VERIFY_REGISTER, { ...payload, otp }));
      if (otpRes.data && otpRes.data.success) {
        // Registration successful! The backend already logged us in (returned token + user)
        const loggedInUser = otpRes.data.user;
        const token = otpRes.data.token;
        
        // Update store
        useAuthStore.getState().setAuth(loggedInUser, token);
        
        setShowOtpField(false);
        const roleToUse = loggedInUser.role || role;
        navigate(roleToUse === 'seller' ? '/seller/dashboard' : '/dashboard');
      } else {
        useAuthStore.setState({ error: otpRes.data?.message || 'Invalid OTP' });
        setStatus('error');
      }
    } catch (err) {
      useAuthStore.setState({ error: err.response?.data?.message || 'Server error. Please check your connection.' });
      setStatus('error');
    }
  };

  const executeRegister = async () => {
    setStatus('loading');
    try {
      const payload = { email, password, role };

      const response = await requestWithWakeup(() => api.post(API.REGISTER, payload));

      if (response.data) {
        const success = await login(email, password);
        if (success) navigate(role === 'seller' ? '/seller/dashboard' : '/shop');
        else setStatus('error');
      } else {
        const errData = response.data;
        useAuthStore.setState({ error: errData?.message || 'Registration failed. Please try again.' });
        setStatus('error');
        setShowPricingModal(false);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        useAuthStore.setState({ error: 'Server took too long. Please wait a moment and try again.' });
      } else {
        useAuthStore.setState({ error: err.response?.data?.message || 'Server error. Please check your connection.' });
      }
      setStatus('error');
      setIsWakingUp(false);
      setShowPricingModal(false);
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
    <section id="register-section" ref={containerRef} className="w-full px-4 md:px-16 py-12 md:py-28" style={{ background: '#2e2a25' }}>
      <div className="cta-content max-w-5xl mx-auto rounded-3xl md:rounded-[2.5rem] p-6 py-12 md:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3d3830 0%, #2e2a25 100%)', border: '1px solid rgba(142,134,123,0.25)', boxShadow: '0 0 120px rgba(142,134,123,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(142,134,123,0.10), transparent 60%)' }} />
        <h2 className="text-3xl md:text-6xl font-heading font-bold mb-3 md:mb-5 tracking-tight relative z-10" style={{ color: '#F3F0E2' }}>
          Join the Platform
        </h2>
        <p className="text-sm md:text-lg font-body max-w-2xl mb-8 md:mb-10 relative z-10" style={{ color: '#aba49c' }}>
          Whether you're exploring local gems or listing your store, Akupy is your ultimate connection.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-6 animate-fade-in relative z-10">
            <div className="px-6 py-3 rounded-full font-medium" style={{ background: 'rgba(142,134,123,0.1)', border: '1px solid rgba(142,134,123,0.25)', color: '#8E867B' }}>
              Logged in as <span className="font-bold">{user.email}</span>
            </div>
            <button
              onClick={() => navigate(user.role === 'seller' ? '/seller/dashboard' : '/shop')}
              className="rounded-full px-12 py-4 text-lg font-semibold transition-all hover:scale-105 active:scale-95 duration-200"
              style={{ background: '#3d3830', color: '#F3F0E2', boxShadow: '0 0 30px rgba(61,56,48,0.35)' }}
            >
              Go to Shop
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl relative z-10">
            {/* Auth Mode Toggle */}
            <div className="flex justify-center mb-6 gap-6">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`text-base md:text-lg font-heading font-bold transition-colors pb-1 border-b-2`}
                style={authMode === 'register' ? { color: '#8E867B', borderBottomColor: '#8E867B' } : { borderColor: 'transparent', color: '#aba49c' }}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); clearError(); setStatus('idle'); setShowOtpField(false); }}
                className={`text-base md:text-lg font-heading font-bold transition-colors pb-1 border-b-2`}
                style={authMode === 'login' ? { color: '#8E867B', borderBottomColor: '#8E867B' } : { borderColor: 'transparent', color: '#aba49c' }}
              >
                Log In
              </button>
            </div>

            {/* Role Toggle (Only show if registering) */}
            {authMode === 'register' && (
              <div className="flex justify-center mb-6 p-1 rounded-full w-[90%] max-w-max mx-auto overflow-hidden" style={{ background: 'rgba(142,134,123,0.12)', border: '1px solid rgba(142,134,123,0.2)' }}>
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex-1 px-4 md:px-6 py-2 rounded-full text-[11px] xs:text-xs md:text-sm font-semibold transition-colors truncate`}
                  style={role === 'user' ? { background: '#3d3830', color: '#F3F0E2' } : { color: '#aba49c' }}
                >
                  I'm a Shopper
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex-1 px-4 md:px-6 py-2 rounded-full text-[11px] xs:text-xs md:text-sm font-semibold transition-colors truncate ${role === 'seller' ? 'text-[#08080e]' : 'text-[#8b8ba0] hover:text-white'}`}
                  style={role === 'seller' ? { background: '#8E867B', color: '#F3F0E2' } : {}}
                >
                  I'm a Business
                </button>
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col md:flex-row gap-3 w-full justify-center">
              {showOtpField ? (
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="px-5 py-3.5 rounded-xl md:rounded-full outline-none font-mono w-full flex-grow text-center tracking-[0.5em] text-lg transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                    required
                  />
                  {(authMode === 'forgot' && showOtpField) && (
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-5 py-3.5 pr-12 rounded-xl md:rounded-full outline-none font-body w-full text-sm md:text-base transition-all placeholder-[#8b8ba0]"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8ba0] hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-5 py-3.5 rounded-xl md:rounded-full outline-none font-body w-full md:w-auto flex-grow text-sm md:text-base transition-all placeholder-[#8b8ba0]"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                    required
                  />
                  {authMode !== 'forgot' && (
                    <div className="relative flex-grow w-full md:w-auto">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-5 py-3.5 pr-12 rounded-xl md:rounded-full outline-none font-body w-full text-sm md:text-base transition-all placeholder-[#8b8ba0]"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8ba0] hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-xl md:rounded-full px-8 md:px-10 py-3.5 font-semibold transition-all active:scale-95 duration-200 disabled:opacity-70 flex items-center justify-center min-w-[130px] text-sm md:text-base hover:brightness-110"
                style={{ background: '#3d3830', color: '#F3F0E2', boxShadow: '0 0 20px rgba(61,56,48,0.25)' }}
              >
                {status === 'loading'
                  ? (isWakingUp ? '🌐 Connecting...' : 'Processing...')
                  : showOtpField
                    ? 'Verify & Proceed'
                    : status === 'error'
                      ? 'Retry'
                        : authMode === 'forgot'
                          ? (showOtpField ? (resetToken ? 'Reset Password' : 'Verify OTP') : 'Send Reset OTP')
                          : (authMode === 'login' ? 'Log In' : 'Continue')}
              </button>
            </form>

            {authMode === 'login' && !showOtpField && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('forgot');
                  clearError();
                  setStatus('idle');
                }}
                className="mt-4 text-xs font-semibold text-[#8E867B] hover:text-[#aba49c] transition-colors underline underline-offset-4"
              >
                Forgot Password?
              </button>
            )}

            {authMode === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setShowOtpField(false);
                  setResetToken('');
                  clearError();
                  setStatus('idle');
                }}
                className="mt-4 text-xs font-semibold text-[#8E867B] hover:text-[#aba49c] transition-colors"
              >
                Back to Login
              </button>
            )}

            {isWakingUp && (
              <div className="mt-4 p-3 rounded-lg text-sm font-medium animate-fade-in flex items-center gap-2" style={{ background: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.28)', color: '#c4a882' }}>
                <span>⏳</span>
                <span>Server is waking up from sleep mode (Render free tier). This may take up to 30-60 seconds — please wait, do not click again!</span>
              </div>
            )}

            {showOtpField && (
              <p className="text-sm font-medium text-[#8b8ba0] mt-4 animate-fade-in">
                We've sent a code to <span className="font-bold text-white">{email}</span>. Valid for 5 minutes.
              </p>
            )}

            {(authError || status === 'error') && (
              <div className="mt-4 p-3 rounded-lg text-sm font-medium animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                {authError || 'An unexpected error occurred. Please try again.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing Modal removed: All sellers now follow the automatic 10% platform fee model */}
    </section>
  );
}
