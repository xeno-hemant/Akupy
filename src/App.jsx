import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import BusinessProfile from './pages/BusinessProfile';
import Navbar from './components/Navbar';

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
    <Router>
      <main className="w-full bg-background min-h-screen relative pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/business/:id" element={<BusinessProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
