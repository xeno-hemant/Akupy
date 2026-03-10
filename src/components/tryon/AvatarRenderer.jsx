import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useTryOnStore from '../../store/useTryOnStore';

/* 
  Procedural Geometric Humanoid Avatar
  Because we do not have a rigged .glb with blendshapes, we construct a stick-figure-like 
  volumetric mesh that scales its parts dynamically based on the measurements.
*/
export default function AvatarRenderer() {
    const { bodyProfile, activeTryOnProduct } = useTryOnStore();
    const groupRef = useRef();

    // Default values if no profile
    const height = bodyProfile?.height || 170; // cm
    const waist = bodyProfile?.waist || 75; // cm
    const chest = bodyProfile?.chest || 90; // cm
    const shoulders = bodyProfile?.shoulders || 42; // cm
    const skinTone = bodyProfile?.skinTone || '#eccba5';

    // Compute Scales (Normalized around a 170cm base model)
    const heightScale = height / 170;
    const torsoWidth = chest / 90;
    const waistWidth = waist / 75;
    const shoulderWidth = shoulders / 42;

    // Idle Breathing Animation
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.getElapsedTime();
            // Subtle chest expansion and vertical bob
            const breathing = Math.sin(time * 2) * 0.01;
            groupRef.current.position.y = breathing;
        }
    });

    return (
        <group ref={groupRef} scale={[1, heightScale, 1]} position={[0, -0.9, 0]}>

            {/* 
        THE BODY 
      */}

            {/* Head */}
            <mesh position={[0, 1.65, 0]} castShadow>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color={skinTone} roughness={0.4} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 1.52, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.05, 0.1, 16]} />
                <meshStandardMaterial color={skinTone} roughness={0.4} />
            </mesh>

            {/* Torso (Chest to Waist) */}
            <mesh position={[0, 1.25, 0]} scale={[torsoWidth, 1, torsoWidth * 0.8]} castShadow>
                <cylinderGeometry args={[0.18 * shoulderWidth, 0.15 * waistWidth, 0.5, 32]} />
                <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* Arm Left */}
            <mesh position={[-0.25 * shoulderWidth, 1.25, 0]} rotation={[0, 0, 0.2]} castShadow>
                <capsuleGeometry args={[0.04, 0.4, 16, 16]} />
                <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* Arm Right */}
            <mesh position={[0.25 * shoulderWidth, 1.25, 0]} rotation={[0, 0, -0.2]} castShadow>
                <capsuleGeometry args={[0.04, 0.4, 16, 16]} />
                <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* Pelvis/Hips */}
            <mesh position={[0, 0.95, 0]} scale={[waistWidth, 1, waistWidth * 0.9]} castShadow>
                <sphereGeometry args={[0.16, 32, 32]} />
                <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* Leg Left */}
            <mesh position={[-0.09 * waistWidth, 0.45, 0]} castShadow>
                <capsuleGeometry args={[0.05, 0.8, 16, 16]} />
                <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* Leg Right */}
            <mesh position={[0.09 * waistWidth, 0.45, 0]} castShadow>
                <capsuleGeometry args={[0.05, 0.8, 16, 16]} />
                <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>


            {/* 
        THE GARMENT LAYER
        If an item is actively being tried on, render a superimposed mesh representing it.
      */}
            {activeTryOnProduct && activeTryOnProduct.garmentType !== 'none' && (
                <group>
                    {/* Example: A generic "Shirt" overlay that matches torso but slightly larger and textured */}
                    {['top', 'shirt', 'outerwear', 'kurta'].includes(activeTryOnProduct.garmentType.toLowerCase()) && (
                        <mesh position={[0, 1.25, 0]} scale={[torsoWidth * 1.05, 1.02, torsoWidth * 0.85]} castShadow>
                            <cylinderGeometry args={[0.18 * shoulderWidth, 0.16 * waistWidth, 0.52, 32]} />
                            <meshStandardMaterial
                                color={activeTryOnProduct.dominantColor || '#ffffff'}
                                roughness={0.8} // fabric
                                transparent
                                opacity={0.95}
                            />
                        </mesh>
                    )}

                    {/* Example: 'bottom' or 'pants' overlay */}
                    {['bottom', 'pants'].includes(activeTryOnProduct.garmentType.toLowerCase()) && (
                        <group>
                            <mesh position={[-0.09 * waistWidth, 0.45, 0]} scale={[1.1, 1.05, 1.1]} castShadow>
                                <capsuleGeometry args={[0.05, 0.8, 16, 16]} />
                                <meshStandardMaterial color={activeTryOnProduct.dominantColor || '#ffffff'} roughness={0.9} />
                            </mesh>
                            <mesh position={[0.09 * waistWidth, 0.45, 0]} scale={[1.1, 1.05, 1.1]} castShadow>
                                <capsuleGeometry args={[0.05, 0.8, 16, 16]} />
                                <meshStandardMaterial color={activeTryOnProduct.dominantColor || '#ffffff'} roughness={0.9} />
                            </mesh>
                            <mesh position={[0, 0.95, 0]} scale={[waistWidth * 1.05, 1.05, waistWidth * 0.95]} castShadow>
                                <sphereGeometry args={[0.16, 32, 32]} />
                                <meshStandardMaterial color={activeTryOnProduct.dominantColor || '#ffffff'} roughness={0.9} />
                            </mesh>
                        </group>
                    )}
                </group>
            )}

        </group>
    );
}
