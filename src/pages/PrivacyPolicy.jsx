import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-heading font-black mb-4" style={{ color: '#3d3830' }}>{title}</h2>
    <div className="space-y-3 font-body text-sm leading-relaxed" style={{ color: '#6b6560' }}>
      {children}
    </div>
  </div>
);

const P = ({ children }) => <p>{children}</p>;

const Ul = ({ items }) => (
  <ul className="space-y-1.5 ml-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#8E867B' }} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Akupy';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'Read how Akupy collects, uses, and protects your personal information.');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Hero */}
      <div className="w-full pt-20 pb-12 px-5" style={{ background: '#EDE6D8', borderBottom: '1px solid #D9D5D2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#3d3830' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#8E867B' }}>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-3" style={{ color: '#3d3830' }}>
            Privacy Policy
          </h1>
          <p className="font-body text-sm" style={{ color: '#8E867B' }}>
            Last updated: April 2025 &nbsp;·&nbsp; Effective immediately
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="p-6 rounded-2xl mb-10 text-sm font-body" style={{ background: '#EDE6D8', border: '1px solid #D9D5D2', color: '#6b6560' }}>
          Welcome to Akupy (<strong style={{ color: '#3d3830' }}>akupy.in</strong>). We care deeply about your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using Akupy, you agree to these practices.
        </div>

        <Section title="1. Information We Collect">
          <P>We collect only what's necessary to provide you a great marketplace experience:</P>
          <Ul items={[
            'Name, email address, and phone number (provided during registration)',
            'Delivery addresses you save or enter during checkout',
            'Order history and transaction records',
            'Profile photo (if uploaded)',
            'Device information, browser type, and IP address (automatically)',
            'Usage data: pages visited, clicks, search queries within Akupy',
          ]} />
        </Section>

        <Section title="2. How We Use Your Information">
          <P>Your information is used strictly to:</P>
          <Ul items={[
            'Create and manage your Akupy account',
            'Process orders and facilitate payments',
            'Send OTPs and transactional emails (order confirmations, receipts)',
            'Notify you about your orders and account activity',
            'Improve platform features using aggregated, anonymized data',
            'Prevent fraud, abuse, and unauthorized access',
            'Comply with applicable laws and legal obligations',
          ]} />
          <P>We do <strong style={{ color: '#3d3830' }}>not</strong> sell your personal data to third parties for advertising purposes.</P>
        </Section>

        <Section title="3. Third-Party Services">
          <P>Akupy integrates the following trusted third-party services. Each has its own privacy policy:</P>
          <div className="space-y-4 mt-2">
            {[
              {
                name: 'Razorpay (Payments)',
                desc: 'Processes all card, UPI, and net banking transactions. Akupy does not store your full card or banking details. All payment data is handled by Razorpay in a PCI-DSS compliant environment.',
                link: 'https://razorpay.com/privacy/',
              },
              {
                name: 'Cloudinary (Image Storage)',
                desc: 'Stores and serves product images and profile photos. Images uploaded by sellers and users are managed by Cloudinary\'s secure cloud infrastructure.',
                link: 'https://cloudinary.com/privacy',
              },
              {
                name: 'Resend (Email Delivery)',
                desc: 'Delivers OTP emails, order confirmations, and transactional messages on our behalf. Your email is shared with Resend solely for message delivery.',
                link: 'https://resend.com/legal/privacy-policy',
              },
              {
                name: 'MongoDB Atlas (Database)',
                desc: 'Stores your account information and order history securely in encrypted cloud databases.',
                link: 'https://www.mongodb.com/legal/privacy-policy',
              },
              {
                name: 'Google Analytics (Analytics)',
                desc: 'Helps us understand how users interact with the platform. Anonymized usage data may be collected. You can opt out using browser extensions.',
                link: 'https://policies.google.com/privacy',
              },
            ].map((s) => (
              <div key={s.name} className="p-4 rounded-xl" style={{ background: '#F5F0E8', border: '1px solid #D9D5D2' }}>
                <p className="font-bold text-sm mb-1" style={{ color: '#3d3830' }}>{s.name}</p>
                <p className="text-sm mb-2" style={{ color: '#6b6560' }}>{s.desc}</p>
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono underline" style={{ color: '#8E867B' }}>
                  View their Privacy Policy ↗
                </a>
              </div>
            ))}
          </div>
        </Section>

        <Section title="4. Cookies & Local Storage">
          <P>Akupy uses cookies and browser local storage for:</P>
          <Ul items={[
            'Keeping you logged in (authentication token stored in localStorage)',
            'Remembering your cart and preferences',
            'Collecting anonymized analytics via Google Analytics',
            'Remembering your cookie consent choice',
          ]} />
          <P>You may clear cookies and localStorage through your browser settings at any time. Note that clearing authentication storage will log you out.</P>
        </Section>

        <Section title="5. Data Retention">
          <P>We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion at any time (see Your Rights below). Order records may be retained for up to 7 years for legal and financial compliance.</P>
        </Section>

        <Section title="6. Data Security">
          <P>We take security seriously. Measures we use include:</P>
          <Ul items={[
            'HTTPS/TLS encryption for all data in transit',
            'Hashed OTPs and passwords (bcrypt) — never stored in plain text',
            'JWT-based authentication with expiry',
            'Rate limiting and brute-force protection on all auth endpoints',
            'Access controls ensuring only authorized staff access production systems',
          ]} />
          <P>However, no method of transmission over the internet is 100% secure. We encourage you to use strong, unique passwords and to log out on shared devices.</P>
        </Section>

        <Section title="7. Your Rights">
          <P>As a user, you have the right to:</P>
          <Ul items={[
            'Access the personal data we hold about you',
            'Correct inaccurate or incomplete data (via Edit Profile)',
            'Request deletion of your account and associated data',
            'Withdraw consent to non-essential data processing',
            'Lodge a complaint with your local data protection authority',
          ]} />
          <P>To exercise any of these rights, contact us at <strong style={{ color: '#3d3830' }}>support@akupy.in</strong>.</P>
        </Section>

        <Section title="8. Children's Privacy">
          <P>Akupy is not directed at children under 13. We do not knowingly collect personal information from minors. If you believe a child has provided us personal information, please contact us immediately.</P>
        </Section>

        <Section title="9. Changes to This Policy">
          <P>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date. Continued use of Akupy after changes constitutes acceptance of the revised policy.</P>
        </Section>

        <Section title="10. Contact Us">
          <P>For privacy-related concerns or requests:</P>
          <div className="mt-3 p-4 rounded-xl inline-block" style={{ background: '#EDE6D8', border: '1px solid #D9D5D2' }}>
            <p className="font-bold text-sm" style={{ color: '#3d3830' }}>Akupy Privacy Team</p>
            <p className="text-sm mt-1" style={{ color: '#6b6560' }}>Email: <a href="mailto:support@akupy.in" className="underline">support@akupy.in</a></p>
            <p className="text-sm" style={{ color: '#6b6560' }}>Website: <a href="https://akupy.in" className="underline">akupy.in</a></p>
          </div>
        </Section>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #D9D5D2' }}>
          <Link to="/" className="text-sm font-bold flex items-center gap-1" style={{ color: '#8E867B' }}>
            ← Back to Akupy
          </Link>
          <div className="flex gap-6 text-sm font-body" style={{ color: '#8E867B' }}>
            <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
            <Link to="/support" className="hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
