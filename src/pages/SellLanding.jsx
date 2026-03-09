import Hero from '../components/Hero';
import FinalCta from '../components/FinalCta';
import SocialProof from '../components/SocialProof';
import PhilosophyStack from '../components/PhilosophyStack';
import Footer from '../components/Footer';
import { Store, ArrowRight, TrendingUp, Users, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SellLanding() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Modify Hero context for seller implicitly if needed, but the unified one works fine. */}
      <div className="bg-background text-foreground">
        <Hero />
        <SocialProof />
      </div>

      {/* Seller Specific CTA Section */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-8">
            <Store className="w-10 h-10" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mb-12">
            Join thousands of local businesses reaching customers globally through Akupy's smart discovery platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/dashboard"
              className="bg-primary text-[#080808] px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20 text-left border-t border-white/10 pt-12">
            <div>
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Zero Commission</h3>
              <p className="text-gray-400">Keep 100% of your profits. We only charge a flat subscription for premium features.</p>
            </div>
            <div>
              <Globe2 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Reach</h3>
              <p className="text-gray-400">Our Globe Shop feature puts your local inventory in front of international buyers.</p>
            </div>
            <div>
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Analytics</h3>
              <p className="text-gray-400">Track your views, sales, and trending products in real-time from your dashboard.</p>
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
