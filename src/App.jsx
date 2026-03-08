import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import PhilosophyStack from './components/PhilosophyStack';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Custom Cursor Logic
  useEffect(() => {

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    
    dot.className = 'fixed w-2 h-2 bg-primary rounded-full pointer-events-none z-[99999] opacity-0 mix-blend-exclusion transition-opacity duration-300';
    ring.className = 'fixed w-8 h-8 rounded-full border border-primary/30 pointer-events-none z-[99998] opacity-0 mix-blend-exclusion transition-all duration-200';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isHoveringText = false;
    let isHoveringButton = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = 1;
      ring.style.opacity = 1;
      
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      
      // Look under cursor
      const target = e.target;
      isHoveringText = ['P', 'H1', 'H2', 'H3', 'SPAN', 'LI'].includes(target.tagName);
      isHoveringButton = ['BUTTON', 'A'].includes(target.tagName) || target.closest('button') || target.closest('a');
    };

    let rafId;

    const render = () => {
      ringX = gsap.utils.interpolate(ringX, mouseX, 0.15);
      ringY = gsap.utils.interpolate(ringY, mouseY, 0.15);
      
      if (isHoveringButton) {
        ring.style.transform = `translate(${ringX - 24}px, ${ringY - 24}px) scale(1.5)`;
        ring.style.background = 'rgba(74, 222, 128, 0.1)';
      } else if (isHoveringText) {
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px) scale(0.5)`;
        ring.style.background = 'transparent';
      } else {
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px) scale(1)`;
        ring.style.background = 'transparent';
      }

      rafId = requestAnimationFrame(render);
    };

    const onMouseDown = () => dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(0.5)`;
    const onMouseUp = () => dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    // Start RAF
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      dot.remove();
      ring.remove();
    };
  }, []);

  // Lenis Smooth Scroll Logic
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0); // Optional: prevents GSAP from correcting lag to sync with Lenis

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <main className="w-full bg-background overflow-hidden relative">
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <PhilosophyStack />
      <FinalCta />
      <Footer />
    </main>
  );
}

export default App;
