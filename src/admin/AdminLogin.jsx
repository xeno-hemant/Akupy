import { useState } from 'react';
import { Shield, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/apiHelper';
import API from '../config/apiRoutes';

export default function AdminLogin() {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post(API.ADMIN_LOGIN, { email });
      if (res.data.success) {
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post(API.ADMIN_VERIFY, { email, otp });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/bugs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0F172A' }}>
      <div className="w-full max-w-md p-8 rounded-3xl relative overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        {/* Glow effect */}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#22C55E' }} />
        
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/10" style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)', boxShadow: '0 10px 25px rgba(22,163,74,0.3)' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white text-center">Akupy Admin</h1>
          <p className="text-sm font-medium mt-1" style={{ color: '#94A3B8' }}>Secure Operations Portal</p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-xl text-xs font-bold text-center border border-red-500/20" style={{ background: '#450a0a', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@akupy.in"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium outline-none transition-all placeholder-slate-600 text-white"
                  style={{ background: '#0F172A', border: '2px solid #334155' }}
                  onFocus={e => e.target.style.borderColor = '#22C55E'}
                  onBlur={e => e.target.style.borderColor = '#334155'}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full h-12 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              style={{ background: '#22C55E' }}
            >
              {loading ? 'Sending OTP...' : (
                <>Request Access <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>One-Time Passcode</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl text-center text-lg tracking-widest font-black outline-none transition-all placeholder-slate-600 text-white"
                  style={{ background: '#0F172A', border: '2px solid #334155' }}
                  onFocus={e => e.target.style.borderColor = '#22C55E'}
                  onBlur={e => e.target.style.borderColor = '#334155'}
                />
              </div>
              <p className="text-center text-xs mt-3" style={{ color: '#64748B' }}>
                Sent to <span className="font-bold text-white">{email}</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full h-12 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              style={{ background: '#22C55E' }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); }}
              className="w-full text-xs font-bold pt-2 transition-colors hover:text-white"
              style={{ color: '#94A3B8' }}
            >
              ← Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
