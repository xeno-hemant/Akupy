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
  { id: 1, name: "Classic Onyx Tee", type: "top", color: "#080808" },
  { id: 2, name: "Emerald Street Jacket", type: "top", color: "#22C55E" },
  { id: 3, name: "Sapphire Hoodie", type: "top", color: "#3B82F6" },
  { id: 4, name: "Crimson Crop", type: "top", color: "#EF4444" },
  { id: 5, name: "Dark Denim Jeans", type: "bottom", color: "#1e293b" },
  { id: 6, name: "Khaki Cargo Pants", type: "bottom", color: "#d4d4d8" },
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
      
      <div className="relative w-full max-w-5xl h-[80vh] bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-white hover:bg-gray-100 text-black rounded-full transition-colors z-10 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Canvas Area */}
        <div className="flex-grow h-[50vh] md:h-full relative cursor-move bg-gradient-to-b from-gray-200 to-gray-100">
          <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-primary tracking-wider border border-white">
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
             <button className="bg-white/90 backdrop-blur-md p-3 rounded-full hover:bg-white transition-colors shadow-lg group">
                <RefreshCcw className="w-5 h-5 text-gray-700 group-hover:rotate-180 transition-transform duration-500" />
             </button>
             <button className="bg-[#080808] text-white px-6 font-semibold rounded-full hover:bg-black/80 transition-transform active:scale-95 shadow-lg flex items-center gap-2">
                <Camera className="w-4 h-4" /> Snapshot
             </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full md:w-80 bg-white p-8 overflow-y-auto flex flex-col">
          <h2 className="text-2xl font-heading font-black text-[#080808] mb-2">Virtual Closet</h2>
          <p className="text-sm text-gray-500 mb-6">
            Mix and match items. Drag the model to rotate, scroll to zoom in/out.
          </p>

          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tops</h3>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_PRODUCTS.filter(p => p.type === 'top').map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedTop(product)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${selectedTop.id === product.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="w-full h-8 rounded-md mb-2 shadow-inner" style={{ backgroundColor: product.color }} />
                    <div className="text-xs font-semibold text-[#080808] truncate">{product.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bottoms</h3>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_PRODUCTS.filter(p => p.type === 'bottom').map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedBottom(product)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${selectedBottom.id === product.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="w-full h-8 rounded-md mb-2 shadow-inner" style={{ backgroundColor: product.color }} />
                    <div className="text-xs font-semibold text-[#080808] truncate">{product.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Size Recommendation</h3>
               <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-start gap-3">
                  <div className="font-bold text-green-700 text-2xl">M</div>
                  <p className="text-xs text-green-600 leading-relaxed">
                     Based on your 3D clone measurements, we recommend size <strong>Medium</strong> for an optimal fit.
                  </p>
               </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button className="w-full bg-[#080808] text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-transform active:scale-95 flex justify-center items-center gap-2">
              Add Both to Cart <span className="text-white/50">•</span> $145.00
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
