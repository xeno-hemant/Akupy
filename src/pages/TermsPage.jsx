import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

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

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Terms & Conditions — Akupy';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'Read the Terms and Conditions governing your use of the Akupy marketplace.');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      {/* Hero */}
      <div className="w-full pt-20 pb-12 px-5" style={{ background: '#EDE6D8', borderBottom: '1px solid #D9D5D2' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#3d3830' }}>
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#8E867B' }}>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-3" style={{ color: '#3d3830' }}>
            Terms & Conditions
          </h1>
          <p className="font-body text-sm" style={{ color: '#8E867B' }}>
            Last updated: April 2025 &nbsp;·&nbsp; Please read carefully before using Akupy
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-14">
        <div className="p-6 rounded-2xl mb-10 text-sm font-body" style={{ background: '#EDE6D8', border: '1px solid #D9D5D2', color: '#6b6560' }}>
          These Terms & Conditions ("Terms") govern your use of the Akupy platform (<strong style={{ color: '#3d3830' }}>akupy.in</strong>) and all related services. By accessing or using Akupy, you agree to be bound by these Terms. If you do not agree, do not use the platform.
        </div>

        <Section title="1. Acceptance of Terms">
          <P>By creating an account or making a purchase on Akupy, you confirm that you:</P>
          <Ul items={[
            'Are at least 18 years old, or have parental/guardian consent',
            'Have read, understood, and agree to these Terms',
            'Agree to our Privacy Policy',
            'Have the legal capacity to enter into a binding agreement',
          ]} />
        </Section>

        <Section title="2. Account Responsibilities">
          <P>As a user of Akupy, you agree to:</P>
          <Ul items={[
            'Provide accurate, current, and complete information during registration',
            'Keep your account credentials confidential and not share them',
            'Notify us immediately of any unauthorized access to your account',
            'Be solely responsible for all activity under your account',
            'Not use the platform for any illegal or unauthorized purpose',
            'Not attempt to hack, disrupt, or reverse-engineer the Akupy platform',
          ]} />
        </Section>

        <Section title="3. Seller Rules & Responsibilities">
          <P>If you register as a seller on Akupy, you agree to:</P>
          <Ul items={[
            'List only genuine products that you have the legal right to sell',
            'Accurately describe products — including condition, price, and available stock',
            'Not list counterfeit, prohibited, or illegal items',
            'Fulfill orders promptly and communicate shipping timelines honestly',
            'Handle customer complaints and returns in good faith',
            'Not manipulate reviews or ratings',
            'Comply with all applicable local and national laws (GST, consumer protection, etc.)',
            'Keep your shop information (contact, address) up to date',
          ]} />
          <P>Akupy reserves the right to suspend or permanently ban seller accounts that violate these rules without prior notice.</P>
        </Section>

        <Section title="4. Prohibited Activities">
          <P>The following are strictly prohibited on Akupy:</P>
          <Ul items={[
            'Selling illegal, counterfeit, stolen, or hazardous goods',
            'Fraud, misrepresentation, or deceptive practices',
            'Harassment, threats, or abusive communication with other users',
            'Creating fake accounts or impersonating others',
            'Spamming or sending unsolicited commercial communications',
            'Circumventing Akupy\'s payment system for off-platform transactions',
            'Scraping, crawling, or data-mining Akupy without written permission',
          ]} />
        </Section>

        <Section title="5. Payments & Transactions">
          <P>Akupy uses Razorpay as its payment processor. All transactions are subject to Razorpay's terms. Akupy does not store card or banking details.</P>
          <Ul items={[
            'Prices are displayed in Indian Rupees (INR) including applicable taxes',
            'Payment must be made in full at the time of order placement',
            'Akupy charges a small platform fee (currently ₹5) per order',
            'Delivery charges may apply based on order value and location',
          ]} />
        </Section>

        <Section title="6. Refund & Cancellation Policy">
          <P><strong style={{ color: '#3d3830' }}>Order Cancellation:</strong></P>
          <Ul items={[
            'Orders can be cancelled while in "Pending" or "Accepted" status',
            'Once dispatched, orders cannot be cancelled',
            'Cancellation requests can be made from your Orders page in the Dashboard',
          ]} />
          <P><strong style={{ color: '#3d3830' }}>Refunds:</strong></P>
          <Ul items={[
            'If you paid via Razorpay and cancel an eligible order, a refund will be initiated within 5-7 business days',
            'Refunds go back to the original payment method',
            'Platform fees (₹5) are non-refundable',
            'Cash on Delivery orders that are returned will be refunded via bank transfer (contact support)',
          ]} />
          <P><strong style={{ color: '#3d3830' }}>Returns:</strong> Return eligibility depends on the individual seller's policy. Contact the seller or Akupy support within 48 hours of delivery for return requests.</P>
        </Section>

        <Section title="7. Platform Liability">
          <P>Akupy acts as a marketplace connecting buyers and sellers. We are not the seller of record for any product listed by independent sellers.</P>
          <Ul items={[
            'Akupy does not guarantee the quality, safety, or legality of seller listings',
            'We are not liable for disputes between buyers and sellers',
            'We are not responsible for delays or failures caused by third-party services (Razorpay, Cloudinary, Resend, etc.)',
            'Akupy\'s total liability to you for any claim is limited to the amount paid for the specific order in dispute',
          ]} />
          <P>THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</P>
        </Section>

        <Section title="8. Intellectual Property">
          <P>All content on Akupy — including the logo, design, code, and brand — is owned by Akupy and protected by intellectual property laws.</P>
          <Ul items={[
            'You may not copy, reproduce, or distribute Akupy\'s branding or content without permission',
            'Sellers retain ownership of their product images and descriptions',
            'By uploading content, sellers grant Akupy a non-exclusive license to display it on the platform',
          ]} />
        </Section>

        <Section title="9. Termination">
          <P>Akupy reserves the right to suspend or terminate your account at any time for violation of these Terms. You may also delete your account at any time by contacting support. Upon termination, your right to use the platform ceases immediately.</P>
        </Section>

        <Section title="10. Governing Law">
          <P>These Terms are governed by the laws of India. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of courts in India.</P>
        </Section>

        <Section title="11. Changes to Terms">
          <P>We may update these Terms from time to time. Material changes will be communicated via email or a notice on the platform. Continued use after changes constitutes acceptance of the new Terms.</P>
        </Section>

        <Section title="12. Contact">
          <P>For questions about these Terms:</P>
          <div className="mt-3 p-4 rounded-xl inline-block" style={{ background: '#EDE6D8', border: '1px solid #D9D5D2' }}>
            <p className="font-bold text-sm" style={{ color: '#3d3830' }}>Akupy Legal</p>
            <p className="text-sm mt-1" style={{ color: '#6b6560' }}>Email: <a href="mailto:support@akupy.in" className="underline">support@akupy.in</a></p>
            <p className="text-sm" style={{ color: '#6b6560' }}>Website: <a href="https://akupy.in" className="underline">akupy.in</a></p>
          </div>
        </Section>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #D9D5D2' }}>
          <Link to="/" className="text-sm font-bold flex items-center gap-1" style={{ color: '#8E867B' }}>
            ← Back to Akupy
          </Link>
          <div className="flex gap-6 text-sm font-body" style={{ color: '#8E867B' }}>
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/support" className="hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
