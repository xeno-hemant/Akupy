import Hero from '../components/Hero';
import FinalCta from '../components/FinalCta';
import SocialProof from '../components/SocialProof';
import PhilosophyStack from '../components/PhilosophyStack';
import Footer from '../components/Footer';
import { Store, ArrowRight, TrendingUp, Users, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function SellLanding() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen" style={{ background: '#2e2a25', color: '#F3F0E2' }}>
      <div className="" style={{ background: '#F3F0E2', color: '#3d3830' }}>
        <Hero />
        <SocialProof />
      </div>

      {/* Seller Specific CTA Section */}
      <section className="py-12 md:py-24 px-4 md:px-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="bg-white/5 border border-white/10 rounded-3xl md:rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(142,134,123,0.2)' }} />

          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6 md:mb-8" style={{ background: 'rgba(142,134,123,0.2)', color: '#8E867B' }}>
            <Store className="w-8 h-8 md:w-10 md:h-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 md:mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mb-8 md:mb-12">
            Join thousands of local businesses reaching customers globally through Akupy's smart discovery platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to={user?.role === 'seller' ? "/seller/dashboard" : "/dashboard"}
              className="px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-transform active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
              style={{ background: '#8E867B', color: '#F3F0E2' }}
            >
              {user?.role === 'seller' ? 'Enter Dashboard' : 'View My Profile'} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12 md:mt-20 text-left border-t border-white/10 pt-8 md:pt-12">
            <div>
              <TrendingUp className="w-8 h-8 mb-4" style={{ color: '#8E867B' }} />
              <h3 className="text-xl font-bold mb-2 text-white">Zero Commission</h3>
              <p className="text-[#aba49c]">Keep 100% of your profits. We only charge a flat subscription for premium features.</p>
            </div>
            <div>
              <Globe2 className="w-8 h-8 mb-4" style={{ color: '#c4a882' }} />
              <h3 className="text-xl font-bold mb-2 text-white">Global Reach</h3>
              <p className="text-[#aba49c]">Our Globe Shop feature puts your local inventory in front of international buyers.</p>
            </div>
            <div>
              <Users className="w-8 h-8 mb-4" style={{ color: '#8E867B' }} />
              <h3 className="text-xl font-bold mb-2 text-white">Instant Analytics</h3>
              <p className="text-[#aba49c]">Track your views, sales, and trending products in real-time from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <PhilosophyStack />
      <FinalCta />
      <Footer />
    </div>
  );
}
