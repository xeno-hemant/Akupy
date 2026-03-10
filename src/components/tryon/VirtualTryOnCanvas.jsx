import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import AvatarRenderer from './AvatarRenderer';

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center font-heading font-black whitespace-nowrap" style={{ color: '#8E867B' }}>
                <div className="w-12 h-12 border-4 rounded-full animate-spin mb-3" style={{ borderColor: 'rgba(142,134,123,0.3)', borderTopColor: '#8E867B' }}></div>
                {progress.toFixed(0)}% LOADED
            </div>
        </Html>
    );
}

export default function VirtualTryOnCanvas() {
    return (
        <div className="w-full h-full min-h-[500px] relative bg-gradient-to-t from-[#08080e] to-[#13131f] rounded-2xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border border-white/5">
            <Canvas
                camera={{ position: [0, 1.2, 3], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, antialias: true }}
                shadows
            >
                <Suspense fallback={<Loader />}>
                    {/* Studio Lighting */}
                    <ambientLight intensity={0.5} />
                    <spotLight
                        position={[5, 5, 5]}
                        angle={0.15}
                        penumbra={1}
                        intensity={1.5}
                        castShadow
                        color="#ffeccf"
                    />
                    <spotLight
                        position={[-5, 5, -5]}
                        angle={0.5}
                        penumbra={1}
                        intensity={1}
                        color="#cff0ff"
                    />
                    <pointLight position={[0, -1, 2]} intensity={0.5} color="#8E867B" />

                    {/* Environment Reflection */}
                    <Environment preset="city" opacity={0.2} blur={0.8} />

                    {/* The Body Mesh */}
                    <AvatarRenderer />

                    {/* Floor & Shadows */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                        <planeGeometry args={[100, 100]} />
                        <shadowMaterial transparent opacity={0.4} />
                    </mesh>
                    <ContactShadows position={[0, -0.99, 0]} opacity={0.8} scale={10} blur={2.5} far={10} />

                    {/* Controls */}
                    <OrbitControls
                        enablePan={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2 + 0.1}
                        minDistance={2}
                        maxDistance={5}
                        target={[0, 0.8, 0]}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>

            {/* 3D Overlay Help Text */}
            <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
                <p className="text-white/40 text-xs font-bold tracking-widest uppercase">
                    Drag to Rotate • Scroll to Zoom
                </p>
            </div>
        </div>
    );
}
