import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const orbitalRef = useRef(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position references to avoid state batching delays
  const mousePos = useRef({ x: -100, y: -100 });
  const orbitalPos = useRef({ x: -100, y: -100 });
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice.current) return;

    let rafId;
    let rotation = 0;

    const onMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(isClickable);
    };

    const render = () => {
      // Smooth lerp interpolation for the orbital ring
      orbitalPos.current.x += (mousePos.current.x - orbitalPos.current.x) * 0.15;
      orbitalPos.current.y += (mousePos.current.y - orbitalPos.current.y) * 0.15;
      
      // Continuous rotation
      rotation += 1.5;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }
      
      if (orbitalRef.current) {
        orbitalRef.current.style.transform = `translate3d(${orbitalPos.current.x}px, ${orbitalPos.current.y}px, 0) rotate(${rotation}deg)`;
      }

      rafId = requestAnimationFrame(render);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', () => setIsVisible(false));
    document.addEventListener('mouseenter', () => setIsVisible(true));

    rafId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (isTouchDevice.current || !isVisible) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#080808] pointer-events-none z-[999999] will-change-transform shadow-lg ${isHovering ? 'scale-[4] bg-primary' : 'scale-100'} transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
      />
      
      <div 
        ref={orbitalRef}
        className={`fixed top-0 left-0 w-12 h-12 -ml-6 -mt-6 rounded-full border border-black/30 pointer-events-none z-[999998] will-change-transform flex items-center justify-center ${isHovering ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-500 ease-out`}
      >
        {/* Satellites */}
        <div className="absolute -top-[2px] w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
        <div className="absolute -bottom-[1px] w-1.5 h-1.5 bg-[#080808] rounded-full" />
        <div className="absolute -left-[1px] top-1/2 w-1 h-1 bg-gray-400 rounded-full" />
      </div>
    </>
  );
}
