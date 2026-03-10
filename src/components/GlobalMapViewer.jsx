import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { X, Search as SearchIcon, MapPin, Store, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFeatureStore from '../store/useFeatureStore';

const mockPlaces = [
  { id: 1, name: "New York, USA", lat: 40.7, lng: -74.0, shops: 12 },
  { id: 2, name: "London, UK", lat: 51.5, lng: -0.1, shops: 8 },
  { id: 3, name: "Tokyo, Japan", lat: 35.6, lng: 139.6, shops: 24 },
  { id: 4, name: "Mumbai, India", lat: 19.0, lng: 72.8, shops: 15 },
  { id: 5, name: "Paris, France", lat: 48.8, lng: 2.3, shops: 6 },
  { id: 6, name: "Sydney, Australia", lat: -33.8, lng: 151.2, shops: 9 },
  { id: 7, name: "São Paulo, Brazil", lat: -23.5, lng: -46.6, shops: 11 },
];

function EarthMap({ onPinClick }) {
  const radius = 2.5;

  const getCoordinates = (lat, lng) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return [x, y, z];
  };

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#080808" roughness={0.7} metalness={0.2} />
      </mesh>

      <mesh scale={1.02}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
      </mesh>

      {mockPlaces.map((place) => {
        const [x, y, z] = getCoordinates(place.lat, place.lng);
        return (
          <group key={place.id} position={[x, y, z]}>
            <Html center zIndexRange={[100, 0]}>
              <div
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-125 hover:-translate-y-2"
                onClick={() => onPinClick(place)}
              >
                <div className="relative">
                  <MapPin className="w-8 h-8 filter drop-shadow-[0_0_12px_rgba(142,134,123,0.8)] fill-black/50" style={{ color: '#8E867B' }} />
                  <div className="absolute inset-0 flex items-center justify-center -mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="absolute top-full mt-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity border border-white/20 shadow-xl flex items-center gap-2">
                  {place.name} <span className="px-1.5 rounded text-[10px]" style={{ background: 'rgba(142,134,123,0.2)', color: '#8E867B' }}>{place.shops} stores</span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function GlobalMapViewer({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { setGlobeShop } = useFeatureStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock finding a place
      const found = mockPlaces.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (found) {
        setSelectedPlace(found);
      } else {
        // Create mock location if not in array
        setSelectedPlace({ name: searchQuery, shops: Math.floor(Math.random() * 20) + 1 });
      }
    }
  };

  const handleExploreShop = () => {
    setGlobeShop(true);
    onClose();
    navigate(`/discover?location=${encodeURIComponent(selectedPlace.name)}`);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-[85vh] bg-[#050505] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Map Area */}
        <div className="w-full lg:flex-grow h-[50vh] lg:h-full relative cursor-move bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
          {/* Internal Search Bar overlaying the map on mobile, or floating on desktop */}
          <div className="absolute top-6 left-6 right-20 lg:right-6 z-10 lg:w-80">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl">
              <SearchIcon className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search global destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 text-sm rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-lg"
                style={{ '--focus-border': 'rgba(142,134,123,0.5)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(142,134,123,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
            </form>
          </div>

          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <Suspense fallback={null}>
              <EarthMap onPinClick={setSelectedPlace} />
            </Suspense>

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3.5}
              maxDistance={12}
              autoRotate={!selectedPlace}
              autoRotateSpeed={0.5}
            />
          </Canvas>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs font-mono tracking-widest pointer-events-none">
            DRAG TO ROTATE • SCROLL TO ZOOM
          </div>
        </div>

        {/* Info Panel */}
        <div className={`w-full lg:w-96 bg-white flex flex-col transition-all duration-500 transform ${selectedPlace ? 'translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full absolute lg:relative h-auto left-0 bottom-0 lg:left-auto lg:bottom-auto z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] lg:shadow-none max-h-[50vh] lg:max-h-full overflow-y-auto'}`}>
          {selectedPlace && (
            <div className="p-8 flex flex-col h-full animate-fade-in">
              <div className="flex items-center gap-3 mb-4" style={{ color: '#8E867B' }}>
                <Navigation className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wider uppercase">Destination Locked</span>
              </div>

              <h2 className="text-4xl font-heading font-black text-[#080808] mb-2 leading-tight">
                {selectedPlace.name}
              </h2>

              <div className="flex items-center gap-2 mb-8">
                <Store className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 font-medium">{selectedPlace.shops} verified global stores found</span>
              </div>

              <div className="space-y-4 flex-grow">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Top Categories Here</h3>
                {['Fashion & Apparel', 'Local Electronics', 'Artisan Crafts', 'Premium Coffee'].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                    <span className="font-semibold text-[#080808]">{cat}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded shadow-inner">{Math.floor(Math.random() * 10) + 1}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleExploreShop}
                  className="w-full py-4 rounded-xl font-bold transition-colors active:scale-95 flex justify-center items-center gap-2 shadow-xl"
                  style={{ background: '#3d3830', color: '#F3F0E2' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#8E867B'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#3d3830'; }}
                >
                  <SearchIcon className="w-5 h-5" /> Explore {selectedPlace.name.split(',')[0]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
