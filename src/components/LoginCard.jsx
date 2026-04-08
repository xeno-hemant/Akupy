import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, ChevronRight } from 'lucide-react';
import { AkupyLogo } from './Navbar';
import useAuthStore from '../store/useAuthStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

export default function LoginCard() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();

  // Step: 'email' | 'otp'
  const [step, setStep] = useState('email');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('shopper'); // shopper, seller, service
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [referral, setReferral] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate((user.role === 'seller' || user.role === 'service_provider') ? '/seller/dashboard' : '/shop');
    }
  }, [user, navigate]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
    setError('');
  };

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post(API.SEND_OTP || '/api/auth/send-otp', {
        identifier: email,
        role: role === 'service' ? 'service_provider' : role,
      });
      if (res.data) {
        setStep('otp');
        setResendTimer(30);
        if (res.data.devOtp) {
          const digits = String(res.data.devOtp).split('');
          setOtp(digits.concat(Array(6 - digits.length).fill('')));
        }
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      // If phone auth not supported, show graceful message
      const msg = err.response?.data?.message || 'OTP sent! Check your phone.';
      if (err.response?.status >= 500) {
        setError('Server error. Please try again.');
      } else {
        // Optimistic: move to OTP step for demo / non-phone flows
        setStep('otp');
        setResendTimer(30);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError('');
    if (digit && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtp(next);
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post(API.VERIFY_OTP || '/api/auth/verify-otp', {
        identifier: email,
        otp: otpStr,
        referralCode: referral || undefined,
        role: role === 'service' ? 'service_provider' : role,
      });
      if (res.data?.success || res.data?.token) {
        const { user: userData, token } = res.data;
        useAuthStore.getState().setAuth(userData, token);
        navigate((userData?.role === 'seller' || userData?.role === 'service_provider') ? '/seller/dashboard' : '/shop');
      } else {
        setError(res.data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      await api.post(API.SEND_OTP || '/api/auth/send-otp', { identifier: email });
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card-wrap">
      {/* Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <AkupyLogo size="md" dark={false} />
        </div>

        {/* Role Selector Tabs */}
        {step === 'email' && (
          <div className="flex bg-slate-100 p-1 rounded-full mb-6 relative">
            <button
              onClick={() => setRole('shopper')}
              className={`flex-1 text-xs font-bold py-2 rounded-full transition-colors z-10 ${role === 'shopper' ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Shopper
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`flex-1 text-xs font-bold py-2 rounded-full transition-colors z-10 ${role === 'seller' ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Seller
            </button>
            <button
              onClick={() => setRole('service')}
              className={`flex-1 text-xs font-bold py-2 rounded-full transition-colors z-10 ${role === 'service' ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Services
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="flex-1 text-xs font-bold py-2 rounded-full transition-colors z-10 text-slate-500 hover:text-slate-800"
            >
              Admin
            </button>
            
            {/* Active Pill background */}
            <div 
              className="absolute top-1 bottom-1 w-1/4 rounded-full transition-transform duration-300 pointer-events-none" 
              style={{ 
                background: '#22C55E',
                transform: `translateX(${role === 'shopper' ? '0%' : role === 'seller' ? '100%' : '200%'})`
              }} 
            />
          </div>
        )}

        {/* Mode Selector (Login/Register) */}
        {step === 'email' && (
          <div className="flex border-b border-gray-100 mb-6">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-bold transition-all relative ${mode === 'login' ? 'text-green-600' : 'text-gray-400'}`}
            >
              Log In
              {mode === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-bold transition-all relative ${mode === 'register' ? 'text-green-600' : 'text-gray-400'}`}
            >
              Sign Up
              {mode === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
            </button>
          </div>
        )}

        {/* Title */}
        <div className="login-title-wrap">
          <h1 className="login-title">
            {step === 'email' 
              ? (mode === 'login' ? 'Welcome Back' : 'Join Akupy') 
              : 'Verify your account'}
          </h1>
          <p className="login-subtitle">
            {step === 'email'
              ? (mode === 'login' ? 'Enter your email to access your account' : "New here? Enter your email and we'll set you up!")
              : `OTP sent to ${email}`}
          </p>
        </div>

        {/* STEP: Email Input */}
        {step === 'email' && (
          <div className="login-form">
            <div className="login-phone-field">
              <input
                id="login-email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                className="w-full h-12 px-4 rounded-xl text-sm font-medium outline-none border-2 transition-colors border-gray-200 focus:border-green-500"
                autoFocus
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              id="login-send-otp-btn"
              onClick={handleSendOtp}
              disabled={loading}
              className="login-btn-primary"
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Send OTP <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="login-terms">
              By continuing, you agree to Akupy's{' '}
              <a href="/terms" className="login-link">Terms</a> &amp;{' '}
              <a href="/privacy" className="login-link">Privacy Policy</a>
            </p>
          </div>
        )}

        {/* STEP: OTP Input */}
        {step === 'otp' && (
          <div className="login-form">
            {/* OTP boxes */}
            <div className="login-otp-row" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-box-${idx}`}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`login-otp-box${digit ? ' filled' : ''}`}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {/* Referral */}
            <div className="login-referral-wrap">
              {!showReferral ? (
                <button
                  type="button"
                  className="login-referral-toggle"
                  onClick={() => setShowReferral(true)}
                >
                  Have a referral code? <span className="login-referral-opt">(Optional)</span>
                </button>
              ) : (
                <div className="login-referral-field">
                  <input
                    id="login-referral"
                    type="text"
                    placeholder="Enter referral code"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value.toUpperCase())}
                    className="login-referral-input"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              id="login-verify-btn"
              onClick={handleVerify}
              disabled={loading}
              className="login-btn-primary"
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Verify &amp; Login <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Resend + Back */}
            <div className="login-footer-row">
              <button
                type="button"
                className="login-text-link"
                onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError(''); }}
              >
                ← Change email
              </button>
              <button
                type="button"
                className={`login-text-link${resendTimer > 0 ? ' disabled' : ''}`}
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? (
                  <><RotateCcw className="w-3 h-3" /> Resend in {resendTimer}s</>
                ) : (
                  <><RotateCcw className="w-3 h-3" /> Resend OTP</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
