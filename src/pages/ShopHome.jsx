import { useEffect, useState } from 'react';
import FinalCta from '../components/FinalCta';
import HomeFeed from '../components/HomeFeed';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import PhilosophyStack from '../components/PhilosophyStack';
import Footer from '../components/Footer';
import gsap from 'gsap';
import FeatureActionModal from '../components/FeatureActionModal';
import TryOnViewer from '../components/TryOnViewer';

export default function ShopHome() {
  const [activeFeatureModal, setActiveFeatureModal] = useState(null);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo('.shop-header-element',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#3d3830' }}>
      {/* Hero Section */}
      <Hero />
      <SocialProof />

      {/* Main Product Feed */}
      <HomeFeed />

      {/* Purpose-Built Tools */}
      <Features
        onGlobeShopClick={() => setActiveFeatureModal('globe')}
        onIncognitoClick={() => setActiveFeatureModal('incognito')}
        onTryOnClick={() => setActiveFeatureModal('tryon')}
      />

      {/* How It Works */}
      <HowItWorks />

      <FeatureActionModal
        isOpen={!!activeFeatureModal}
        onClose={() => setActiveFeatureModal(null)}
        feature={activeFeatureModal}
        onTryOnSuccess={() => {
          setActiveFeatureModal(null);
          setIsTryOnOpen(true);
        }}
      />

      <TryOnViewer
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
      />

      {/* Protocols & Auth & Footer */}
      <PhilosophyStack />
      <FinalCta />
      <Footer />
    </div>
  );
}
