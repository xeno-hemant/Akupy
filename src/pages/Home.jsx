import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ShopDiscovery from '../components/ShopDiscovery';
import SocialProof from '../components/SocialProof';
import FinalCta from '../components/FinalCta';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <ShopDiscovery />
      <SocialProof />
      <FinalCta />
      <Footer />
    </>
  );
}
