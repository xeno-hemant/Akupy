import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Send, CheckCircle2, Headphones } from 'lucide-react';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';
import useSEO from '../hooks/useSEO';

const SUPPORT_EMAIL = 'support@akupy.in';

export default function SupportPage() {
  useSEO({
    title: 'Contact & Support',
    description: 'Get help with your Akupy orders, payments, or account. Reach our support team.',
    ogUrl: 'https://akupy.in/support',
  });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post(API.SUPPORT_CONTACT, form);
      if (res.data?.success) {
        setSuccess(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(res.data?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #D9D5D2',
    background: '#FFFFFF',
    color: '#3d3830',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div className="w-full pt-20 pb-12 px-5" style={{ background: '#EDE6D8', borderBottom: '1px solid #D9D5D2' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#3d3830' }}>
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#8E867B' }}>Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-3" style={{ color: '#3d3830' }}>
            Contact & Support
          </h1>
          <p className="font-body text-base max-w-lg" style={{ color: '#8E867B' }}>
            We're here to help. Send us a message and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Support Email Card */}
            <div className="p-6 rounded-2xl" style={{ background: '#3d3830' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Mail className="w-5 h-5 text-white" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#aba49c' }}>Support Email</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-heading font-black text-lg hover:underline"
                style={{ color: '#F5F0E8' }}
              >
                {SUPPORT_EMAIL}
              </a>
              <p className="text-xs mt-2" style={{ color: '#aba49c' }}>Response within 24 hours</p>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl" style={{ background: '#EDE6D8', border: '1px solid #D9D5D2' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#7a9e7e] animate-pulse" style={{ boxShadow: '0 0 8px rgba(122,158,126,0.6)' }} />
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#7a9e7e' }}>Support Active</span>
              </div>
              <p className="text-sm font-body" style={{ color: '#6b6560' }}>
                Mon – Sat, 9:00 AM – 7:00 PM IST
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: '#aba49c' }}>Quick Links</p>
              {[
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'My Orders', to: '/orders' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between p-3 rounded-xl font-body text-sm font-medium transition-colors"
                  style={{ background: '#EDE6D8', color: '#8E867B', border: '1px solid #D9D5D2' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#3d3830'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8E867B'}
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-8">
            <div className="p-8 rounded-3xl" style={{ background: '#FFFFFF', boxShadow: '0 2px 24px rgba(61,56,48,0.06)', border: '1px solid #EDE6D8' }}>
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-5 h-5" style={{ color: '#8E867B' }} />
                <h2 className="text-xl font-heading font-black" style={{ color: '#3d3830' }}>Send us a message</h2>
              </div>

              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FDF4' }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: '#7a9e7e' }} />
                  </div>
                  <h3 className="text-xl font-heading font-black mb-2" style={{ color: '#3d3830' }}>Message Sent!</h3>
                  <p className="font-body text-sm mb-6" style={{ color: '#8E867B' }}>
                    We'll get back to you at your email within 24 hours. A confirmation email has been sent.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 rounded-xl font-bold text-sm"
                    style={{ background: '#F5F0E8', color: '#3d3830' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8E867B' }}>
                        Your Name *
                      </label>
                      <input
                        id="support-name"
                        name="name"
                        type="text"
                        placeholder="Hemant Gurjar"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={inputBase}
                        onFocus={e => e.target.style.borderColor = '#3d3830'}
                        onBlur={e => e.target.style.borderColor = '#D9D5D2'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8E867B' }}>
                        Email Address *
                      </label>
                      <input
                        id="support-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={inputBase}
                        onFocus={e => e.target.style.borderColor = '#3d3830'}
                        onBlur={e => e.target.style.borderColor = '#D9D5D2'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8E867B' }}>
                      Message *
                    </label>
                    <textarea
                      id="support-message"
                      name="message"
                      rows={6}
                      placeholder="Describe your issue or question in detail..."
                      value={form.message}
                      onChange={handleChange}
                      required
                      style={{ ...inputBase, resize: 'vertical', minHeight: '140px' }}
                      onFocus={e => e.target.style.borderColor = '#3d3830'}
                      onBlur={e => e.target.style.borderColor = '#D9D5D2'}
                    />
                    <p className="text-xs mt-1" style={{ color: '#aba49c' }}>{form.message.length}/2000 characters</p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl text-sm font-medium" style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' }}>
                      {error}
                    </div>
                  )}

                  <button
                    id="support-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: loading ? '#D9D5D2' : '#3d3830',
                      color: loading ? '#8E867B' : '#F5F0E8',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2a261f'; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#3d3830'; }}
                  >
                    {loading ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
