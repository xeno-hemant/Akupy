import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3D Geometric Globe representing 'Global Discovery'
function GeoGlobe(props) {
  const meshRef = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; // Roughly typical mobile width in Three.js units

  // Adjust scale and position based on mobile
  const scale = isMobile ? 0.7 : 1;
  const position = isMobile ? [0, -2, -2] : [1.5, 0, 0];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Subtle mouse interaction
      const mouseX = (state.mouse.x * Math.PI) / 8; // Max 8 degrees tilt
      const mouseY = (state.mouse.y * Math.PI) / 8;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX + state.clock.elapsedTime * 0.1, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} {...props}>
      <icosahedronGeometry args={[2, 4]} />
      <meshStandardMaterial 
        color="#ffffff" 
        wireframe={true} 
        transparent={true} 
        opacity={0.15} 
        roughness={0.2}
      />
    </mesh>
  );
}

export default function GlobeCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-0" id="globe-canvas">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#4ADE80" />
        <directionalLight position={[-10, -10, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <GeoGlobe />
        </Suspense>
      </Canvas>
    </div>
  );
}
