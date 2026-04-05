import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'akupy_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Slight delay so page loads first
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    setHiding(true);
    setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      setVisible(false);
    }, 350);
  };

  const decline = () => {
    setHiding(true);
    setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, 'declined');
      setVisible(false);
    }, 350);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[99999] flex justify-center px-4 pb-4 pointer-events-none"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div
        className="pointer-events-auto w-full max-w-2xl rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
        style={{
          background: 'rgba(61, 56, 48, 0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          transform: hiding ? 'translateY(120%)' : 'translateY(0)',
          opacity: hiding ? 0 : 1,
          transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 350ms ease',
        }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <Cookie className="w-5 h-5" style={{ color: '#D9D5D2' }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-heading font-black text-sm mb-1" style={{ color: '#F5F0E8' }}>
            We use cookies
          </p>
          <p className="font-body text-xs leading-relaxed" style={{ color: '#aba49c' }}>
            We use cookies to improve your experience, analyze traffic, and personalize content.
            Read our{' '}
            <Link to="/privacy-policy" className="underline hover:text-white transition-colors" style={{ color: '#D9D5D2' }}>
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            style={{ color: '#aba49c', background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F5F0E8'}
            onMouseLeave={e => e.currentTarget.style.color = '#aba49c'}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: '#F5F0E8',
              color: '#3d3830',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.background = '#F5F0E8'}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
