import Hero from '../components/Hero';
import HomeFeed from '../components/HomeFeed';
import SocialProof from '../components/SocialProof';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import PhilosophyStack from '../components/PhilosophyStack';
import FinalCta from '../components/FinalCta';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <HomeFeed />
      <SocialProof />
      <Features />
      <HowItWorks />
      <PhilosophyStack />
      <FinalCta />
      <Footer />
    </>
  );
}
