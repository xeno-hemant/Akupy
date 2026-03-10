import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import { X, RefreshCcw, Camera } from 'lucide-react';

function DummyMannequin({ outfitParams }) {
  const { topColor, bottomColor } = outfitParams;

  return (
    <group position={[0, -1.5, 0]}>
      {/* Head */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fcd5ce" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Torso (Top) */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.4, 0.38, 1.4, 32]} />
        <meshStandardMaterial color={topColor} roughness={0.8} />
      </mesh>

      {/* Arms (Top) */}
      <mesh position={[-0.55, 1.6, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.12, 1, 16, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.55, 1.6, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.12, 1, 16, 16]} />
        <meshStandardMaterial color={topColor} roughness={0.8} />
      </mesh>

      {/* Legs (Bottoms) */}
      <mesh position={[-0.2, 0.4, 0]}>
        <capsuleGeometry args={[0.16, 1.2, 16, 16]} />
        <meshStandardMaterial color={bottomColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.2, 0.4, 0]}>
        <capsuleGeometry args={[0.16, 1.2, 16, 16]} />
        <meshStandardMaterial color={bottomColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

const MOCK_PRODUCTS = [
  { id: 1, name: "Stone Taupe Tee", type: "top", color: "#8E867B" },
  { id: 2, name: "Dark Warm Jacket", type: "top", color: "#3d3830" },
  { id: 3, name: "Silver Linen Shirt", type: "top", color: "#D9D5D2" },
  { id: 4, name: "Ivory Crop Top", type: "top", color: "#F3F0E2" },
  { id: 5, name: "Dark Denim Jeans", type: "bottom", color: "#3d3830" },
  { id: 6, name: "Warm Cargo Pants", type: "bottom", color: "#c4b9ab" },
];

export default function TryOnViewer({ isOpen, onClose }) {
  const [selectedTop, setSelectedTop] = useState(MOCK_PRODUCTS[0]);
  const [selectedBottom, setSelectedBottom] = useState(MOCK_PRODUCTS[4]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row" style={{ background: '#F0EADD', border: '1px solid #D9D5D2' }}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 rounded-full transition-colors z-10 shadow-sm"
          style={{ background: '#E8E0D6', color: '#8E867B', border: '1px solid #D9D5D2' }}>
          <X className="w-5 h-5" />
        </button>

        {/* 3D Canvas Area */}
        <div className="flex-grow h-[50vh] md:h-full relative cursor-move" style={{ background: 'linear-gradient(to bottom, #E8E0D6, #F0EADD)' }}>
          <div className="absolute top-6 left-6 z-10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-wider" style={{ background: 'rgba(240,234,221,0.85)', color: '#8E867B', border: '1px solid #D9D5D2' }}>
            VIRTUAL TRY-ON ACTIVE
          </div>

          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Suspense fallback={null}>
              <Center>
                <DummyMannequin outfitParams={{ topColor: selectedTop.color, bottomColor: selectedBottom.color }} />
              </Center>
              <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={5} blur={2} far={4} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3}
              maxDistance={8}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4">
            <button className="p-3 rounded-full transition-colors shadow-sm group" style={{ background: 'rgba(240,234,221,0.9)', color: '#8E867B', border: '1px solid #D9D5D2' }}>
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <button className="px-6 py-3 font-semibold rounded-full transition-transform active:scale-95 shadow-sm flex items-center gap-2" style={{ background: '#3d3830', color: '#F3F0E2' }}>
              <Camera className="w-4 h-4" /> Snapshot
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full md:w-80 p-8 overflow-y-auto flex flex-col" style={{ background: '#F0EADD', borderLeft: '1px solid #D9D5D2' }}>
          <h2 className="text-2xl font-heading font-black mb-2" style={{ color: '#3d3830' }}>Virtual Closet</h2>
          <p className="text-sm mb-6" style={{ color: '#8E867B' }}>
            Mix and match items. Drag the model to rotate, scroll to zoom in/out.
          </p>

          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#aba49c' }}>Tops</h3>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_PRODUCTS.filter(p => p.type === 'top').map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedTop(product)}
                    className="text-left p-3 rounded-xl border-2 transition-all"
                    style={{ borderColor: selectedTop.id === product.id ? '#8E867B' : '#E8E0D6', background: selectedTop.id === product.id ? '#E8E0D6' : 'transparent' }}
                  >
                    <div className="w-full h-8 rounded-md mb-2 shadow-inner" style={{ backgroundColor: product.color }} />
                    <div className="text-xs font-semibold truncate" style={{ color: '#3d3830' }}>{product.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#aba49c' }}>Bottoms</h3>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_PRODUCTS.filter(p => p.type === 'bottom').map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedBottom(product)}
                    className="text-left p-3 rounded-xl border-2 transition-all"
                    style={{ borderColor: selectedBottom.id === product.id ? '#8E867B' : '#E8E0D6', background: selectedBottom.id === product.id ? '#E8E0D6' : 'transparent' }}
                  >
                    <div className="w-full h-8 rounded-md mb-2 shadow-inner" style={{ backgroundColor: product.color }} />
                    <div className="text-xs font-semibold truncate" style={{ color: '#3d3830' }}>{product.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6" style={{ borderTop: '1px solid #D9D5D2' }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#aba49c' }}>Size Recommendation</h3>
              <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: '#eef2ee', border: '1px solid #7a9e7e' }}>
                <div className="font-bold text-2xl" style={{ color: '#7a9e7e' }}>M</div>
                <p className="text-xs leading-relaxed" style={{ color: '#7a9e7e' }}>
                  Based on your 3D clone measurements, we recommend size <strong>Medium</strong> for an optimal fit.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid #D9D5D2' }}>
            <button className="w-full py-4 rounded-xl font-semibold transition-transform active:scale-95 flex justify-center items-center gap-2" style={{ background: '#3d3830', color: '#F3F0E2' }}>
              Add Both to Cart <span style={{ opacity: 0.5 }}>•</span> ₹1,699
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
