import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const orbitalRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
      // Smooth lerp for the orbital ring
      orbitalPos.current.x += (mousePos.current.x - orbitalPos.current.x) * 0.15;
      orbitalPos.current.y += (mousePos.current.y - orbitalPos.current.y) * 0.15;
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
      {/* Main dot — white, turns mint+bigger on hover */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 -ml-1.5 -mt-1.5 rounded-full pointer-events-none z-[9999999] will-change-transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isHovering
          ? 'w-4 h-4 -ml-2 -mt-2'
          : 'w-3 h-3'
          }`}
        style={{
          background: isHovering ? '#8E867B' : '#3d3830',
          boxShadow: isHovering
            ? '0 0 16px rgba(142,134,123,0.8), 0 0 32px rgba(142,134,123,0.4)'
            : '0 0 8px rgba(61,56,48,0.5)',
        }}
      />

      {/* Orbital ring — white border, mint satellite dot */}
      <div
        ref={orbitalRef}
        className={`fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full pointer-events-none z-[9999998] will-change-transform flex items-center justify-center transition-all duration-500 ease-out ${isHovering ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        style={{ border: '1.5px solid rgba(61,56,48,0.35)' }}
      >
        {/* Top satellite — mint glowing */}
        <div
          className="absolute -top-1 w-2 h-2 rounded-full"
          style={{
            background: '#8E867B',
            boxShadow: '0 0 8px rgba(142,134,123,0.9), 0 0 16px rgba(142,134,123,0.4)'
          }}
        />
        {/* Bottom satellite — white */}
        <div
          className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.7)' }}
        />
        {/* Side satellite — white muted */}
        <div
          className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.35)' }}
        />
      </div>
    </>
  );
}
