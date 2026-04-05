import { useState } from 'react';
import { Bug, X, Send, CheckCircle2 } from 'lucide-react';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

export default function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please describe the bug.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post(API.SUPPORT_BUG, {
        message: message.trim(),
        pageUrl: window.location.href,
      });
      if (res.data?.success) {
        setSubmitted(true);
        setMessage('');
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setMessage('');
    setError('');
    setSubmitted(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        id="bug-report-btn"
        onClick={() => setIsOpen(true)}
        title="Report a Bug"
        className="fixed z-[9990] flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          bottom: '80px',    // above bottom nav
          right: '16px',
          background: 'rgba(61,56,48,0.92)',
          color: '#F5F0E8',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '999px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: '700',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(61,56,48,0.25)',
          letterSpacing: '0.02em',
        }}
      >
        <Bug className="w-4 h-4" />
        <span className="hidden sm:inline">Report Bug</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99998] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(61,56,48,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) close(); }}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(61,56,48,0.25)',
              border: '1px solid #EDE6D8',
              transform: 'translateY(0)',
              animation: 'slideUp 0.25s ease',
            }}
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between" style={{ background: '#3d3830' }}>
              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5" style={{ color: '#F5F0E8' }} />
                <span className="font-heading font-black text-base" style={{ color: '#F5F0E8' }}>Report a Bug</span>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#D9D5D2' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#F0FDF4' }}>
                    <CheckCircle2 className="w-7 h-7" style={{ color: '#7a9e7e' }} />
                  </div>
                  <p className="font-heading font-black text-lg mb-1" style={{ color: '#3d3830' }}>Thanks!</p>
                  <p className="text-sm font-body" style={{ color: '#8E867B' }}>
                    Bug reported. We'll look into it ASAP.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8E867B' }}>
                      Current page
                    </p>
                    <p className="text-xs font-mono p-2 rounded-lg truncate" style={{ background: '#F5F0E8', color: '#8E867B' }}>
                      {window.location.pathname}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8E867B' }}>
                      Describe the bug *
                    </label>
                    <textarea
                      id="bug-description"
                      rows={5}
                      placeholder="What happened? What did you expect to happen? Steps to reproduce..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      className="w-full rounded-xl p-4 text-sm font-body outline-none resize-none transition-colors"
                      style={{
                        border: '2px solid #D9D5D2',
                        background: '#FAFAFA',
                        color: '#3d3830',
                      }}
                      onFocus={e => e.target.style.borderColor = '#3d3830'}
                      onBlur={e => e.target.style.borderColor = '#D9D5D2'}
                    />
                    <p className="text-xs mt-1" style={{ color: '#aba49c' }}>{message.length}/1000</p>
                  </div>

                  {error && (
                    <p className="text-xs font-medium p-3 rounded-xl" style={{ background: '#FEF2F2', color: '#991B1B' }}>{error}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={close}
                      className="flex-1 py-3 rounded-xl font-bold text-sm"
                      style={{ background: '#F5F0E8', color: '#8E867B' }}
                    >
                      Cancel
                    </button>
                    <button
                      id="bug-submit"
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: loading ? '#D9D5D2' : '#3d3830',
                        color: loading ? '#8E867B' : '#F5F0E8',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? 'Submitting...' : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
