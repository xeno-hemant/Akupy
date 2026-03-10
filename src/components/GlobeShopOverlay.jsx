import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { X, Search, MapPin, Star, ArrowRight, Store, ShoppingBag, Utensils, Scissors, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const CATEGORY_COLORS = {
  Retail: '#8E867B',  // taupe
  Food: '#c4a882',  // warm amber
  Services: '#aba49c',  // light taupe
  Fashion: '#b5776e',  // terracotta
  Default: '#D9D5D2'   // silver
};

const CATEGORY_ICONS = {
  Retail: <ShoppingBag className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
  Services: <Scissors className="w-4 h-4" />,
  Fashion: <Shirt className="w-4 h-4" />,
  All: <Store className="w-4 h-4" />
};

export default function GlobeShopOverlay({ onClose }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredShop, setHoveredShop] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Three.js refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const globeRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch shops
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async (query = '', country = '', city = '') => {
    setIsLoading(true);
    try {
      const url = new URL(import.meta.env.VITE_API_URL + '/api/businesses/global');
      if (query) url.searchParams.append('search', query);
      if (country) url.searchParams.append('country', country);
      if (city) url.searchParams.append('city', city);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setShops(data);
        setFilteredShops(data);
      }
    } catch (err) {
      console.error('Error fetching global shops:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter effect
  useEffect(() => {
    let result = shops;
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.shopCity?.toLowerCase().includes(q) ||
        s.shopCountry?.toLowerCase().includes(q)
      );
    }
    setFilteredShops(result);
  }, [searchQuery, activeCategory, shops]);

  // Three.js Setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Determine canvas size for split view / mobile based on container
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const aspect = width / height;

    // Dynamic camera distance: pull back further if screen is tall/narrow (mobile)
    const cameraDist = aspect < 1 ? Math.max(6, 4.5 / aspect) : 6;

    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.z = cameraDist;
    camera.position.x = 0;
    camera.position.y = 0;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased ambient
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased directional
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'Anonymous';

    // Globe Geometry & Material
    const radius = 2;
    const segments = 64;
    const sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);

    const material = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg'),
      bumpMap: textureLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg'),
      bumpScale: 0.015,
      specularMap: textureLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/water_4k.png'),
      specular: new THREE.Color('grey'),
      shininess: 35,
      color: 0xffffff
    });

    const globe = new THREE.Mesh(sphereGeometry, material);
    scene.add(globe);
    globeRef.current = globe;

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.02, segments, segments);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x8E867B,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, sizeAttenuation: true });
    const starVertices = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      // Skip if too close to globe
      if (Math.abs(x) < 3 && Math.abs(y) < 3 && Math.abs(z) < 3) continue;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Raycaster for interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let clickTime = 0;

    const onPointerDown = () => {
      isDragging = false;
      clickTime = Date.now();
    };

    const onPointerMove = (event) => {
      isDragging = true;
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.x = (x / width) * 2 - 1;
      mouse.y = -(y / height) * 2 + 1;

      // Update tooltip position
      setTooltipPos({ x: event.clientX, y: event.clientY });
    };

    const onPointerUp = (event) => {
      const timeDiff = Date.now() - clickTime;
      // If time diff is small and we didn't drag much, count as click
      if (timeDiff < 300) {
        handleClick();
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const latLongToVector3 = (lat, lon, r) => {
      const phi = (lat) * Math.PI / 180;
      const theta = (lon - 180) * Math.PI / 180;
      const x = -(r) * Math.cos(phi) * Math.cos(theta);
      const y = (r) * Math.sin(phi);
      const z = (r) * Math.cos(phi) * Math.sin(theta);
      return new THREE.Vector3(x, y, z);
    };

    const vector3ToLatLong = (vec) => {
      const r = vec.length();
      const lat = Math.asin(vec.y / r) * (180 / Math.PI);
      const lon = (Math.atan2(vec.z, -vec.x) * (180 / Math.PI)) + 180;
      return { lat, lon: lon <= 180 ? lon : lon - 360 };
    };

    const reverseGeocode = async (lat, lon) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=3`);
        const data = await res.json();
        if (data && data.address && data.address.country) {
          const country = data.address.country;
          setSelectedCountry(country);
          setSearchQuery('');
          fetchShops('', country); // fetch filtered by country
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const first = intersects[0];
        if (first.object.userData && first.object.userData.isMarker) {
          // Clicked a shop marker
          const shop = first.object.userData.shop;
          // Could scroll panel to shop or open modal. For now, isolate it
          setSearchQuery(shop.name);
        } else if (first.object === globe) {
          // Clicked globe surface
          const pt = first.point;
          const { lat, lon } = vector3ToLatLong(pt);
          reverseGeocode(lat, lon);
        }
      }
    };

    // Animation loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Auto rotate globe
      if (globe && !isDragging) {
        globe.rotation.y += 0.0005;
      }

      // Pulse markers
      markersRef.current.forEach(marker => {
        const scale = 0.8 + Math.sin(t * 3) * 0.4; // 0.8 -> 1.2
        marker.scale.set(scale, scale, scale);
      });

      controls.update();

      // Handle hover state
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markersRef.current);
      if (intersects.length > 0) {
        if (!hoveredShop || hoveredShop._id !== intersects[0].object.userData.shop._id) {
          setHoveredShop(intersects[0].object.userData.shop);
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (hoveredShop) {
          setHoveredShop(null);
          document.body.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const newAspect = w / h;

      renderer.setSize(w, h);
      camera.aspect = newAspect;
      camera.position.z = newAspect < 1 ? Math.max(6, 4.5 / newAspect) : 6;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
      }
      cancelAnimationFrame(reqId);
      document.body.style.cursor = 'default';
      if (renderer) renderer.dispose();

      // Prevent memory leaks context lost error on rapid re-mount
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        if (object.material.isMaterial) {
          object.material.dispose();
        } else {
          for (const material of object.material) material.dispose();
        }
      });
    };
  }, []);

  // Sync shop markers
  useEffect(() => {
    if (!sceneRef.current || !globeRef.current) return;
    const scene = sceneRef.current;

    // Remove old markers
    markersRef.current.forEach(m => {
      scene.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    });
    markersRef.current = [];

    // Add new markers
    const radius = 2;
    shops.forEach(shop => {
      if (!shop.shopLat || !shop.shopLng) return;

      const phi = (shop.shopLat) * Math.PI / 180;
      const theta = (shop.shopLng - 180) * Math.PI / 180;
      const x = -(radius) * Math.cos(phi) * Math.cos(theta);
      const y = (radius) * Math.sin(phi);
      const z = (radius) * Math.cos(phi) * Math.sin(theta);

      const color = CATEGORY_COLORS[shop.category] || CATEGORY_COLORS.Default;

      const markerGeo = new THREE.SphereGeometry(0.02, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
      const marker = new THREE.Mesh(markerGeo, markerMat);

      marker.position.set(x, y, z);
      // Place slightly above surface to prevent clipping
      marker.position.multiplyScalar(1.02);

      marker.userData = { isMarker: true, shop };

      scene.add(marker);
      markersRef.current.push(marker);
    });
  }, [shops]);

  // Rotates globe to specific shop location
  const rotateToShop = (shop) => {
    if (!globeRef.current || !shop.shopLat || !shop.shopLng) return;

    // Calculate required rotation (simplified tween)
    const targetLon = (shop.shopLng - 180) * Math.PI / 180;

    gsap.to(globeRef.current.rotation, {
      y: -targetLon + Math.PI / 2,
      duration: 1.5,
      ease: "power2.out"
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col md:flex-row animate-fade-in font-body overflow-hidden" style={{ backgroundColor: '#3d3830' }}>

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[55vh] md:w-[65%] md:h-screen relative flex items-center justify-center overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full outline-none"
          style={{ touchAction: 'none' }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 left-4 md:left-6 z-10 p-2 md:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Global Stats overlays */}
        <div className="absolute bottom-6 left-6 z-10 pointer-events-none hidden md:block">
          <h2 className="text-3xl font-heading font-bold mb-1" style={{ color: '#F3F0E2' }}>Globe Shop</h2>
          <p className="text-sm" style={{ color: '#D9D5D2' }}>Interactive 3D Marketplace Discovery</p>
        </div>

        {/* Dynamic Tooltip */}
        {hoveredShop && (
          <div
            ref={tooltipRef}
            className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[120%] backdrop-blur-md rounded-xl p-3 shadow-xl w-max" style={{ background: 'rgba(240,234,221,0.93)', border: '1px solid #D9D5D2' }}
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              borderLeft: `3px solid ${CATEGORY_COLORS[hoveredShop.category] || CATEGORY_COLORS.Default}`
            }}
          >
            <p className="font-heading font-bold text-sm mb-0.5" style={{ color: '#3d3830' }}>{hoveredShop.name}</p>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8E867B' }}>
              <MapPin className="w-3 h-3" />
              <span>{hoveredShop.shopCity}, {hoveredShop.shopCountry}</span>
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-wider font-bold" style={{ color: CATEGORY_COLORS[hoveredShop.category] || CATEGORY_COLORS.Default }}>
              {hoveredShop.category}
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-full h-[45vh] md:w-[35%] md:h-screen backdrop-blur-xl border-t md:border-l flex flex-col rounded-t-3xl md:rounded-none relative z-20" style={{ background: 'rgba(240,234,221,0.97)', borderColor: '#D9D5D2' }}>

        {/* Mobile handle */}
        <div className="w-12 h-1.5 rounded-full mx-auto mt-3 mb-1 md:hidden" style={{ background: '#D9D5D2' }} />

        <div className="p-5 md:p-8 flex flex-col pb-0">
          <h3 className="text-xl md:text-2xl font-heading font-bold mb-4" style={{ color: '#3d3830' }}>
            {selectedCountry ? `Shops in ${selectedCountry}` : 'Discover Global'}
            {selectedCountry && (
              <button
                onClick={() => { setSelectedCountry(null); fetchShops(); }}
                className="ml-3 text-xs underline underline-offset-4" style={{ color: '#8E867B' }}
              >
                Clear
              </button>
            )}
          </h3>

          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8E867B' }} />
            <input
              type="text"
              placeholder="Search country, city, or shop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all" style={{ background: '#F3F0E2', border: '1px solid #D9D5D2', color: '#3d3830' }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-2 px-2 md:mx-0 md:px-0">
            {['All', 'Retail', 'Food', 'Fashion', 'Services'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 border"
                style={activeCategory === cat
                  ? { background: '#8E867B', color: '#F3F0E2', borderColor: '#8E867B' }
                  : { background: '#E8E0D6', color: '#8E867B', borderColor: '#D9D5D2' }
                }
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 pt-2 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#8E867B', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: '#8E867B' }}>Scanning global network...</p>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-48 rounded-2xl p-6" style={{ background: '#F0EADD', border: '1px solid #D9D5D2' }}>
              <span className="text-4xl mb-3">🌍</span>
              <p className="font-medium mb-1" style={{ color: '#3d3830' }}>No shops found here yet</p>
              <p className="text-xs mb-4" style={{ color: '#8E867B' }}>Be the first to establish a global presence in this region.</p>
              <Link to="/sell" className="px-5 py-2 rounded-full text-xs font-bold transition-colors" style={{ background: '#3d3830', color: '#F3F0E2' }}>
                Register Your Shop
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-20 md:pb-0">
              {filteredShops.map(shop => (
                <div
                  key={shop._id}
                  className="rounded-2xl p-4 transition-all group cursor-pointer" style={{ background: '#F0EADD', border: '1px solid #D9D5D2' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E8E0D6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F0EADD'}
                  style={{ borderLeft: `3px solid ${CATEGORY_COLORS[shop.category] || CATEGORY_COLORS.Default}` }}
                  onMouseEnter={() => rotateToShop(shop)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-heading font-bold text-base line-clamp-1" style={{ color: '#3d3830' }}>{shop.name}</h4>
                      <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: '#8E867B' }}>
                        <MapPin className="w-3 h-3" />
                        {shop.shopCity}, {shop.shopCountry}
                      </p>
                    </div>
                    {CATEGORY_ICONS[shop.category] && (
                      <div className="p-1.5 rounded-full bg-white/5 text-white/50" style={{ color: CATEGORY_COLORS[shop.category] || CATEGORY_COLORS.Default }}>
                        {CATEGORY_ICONS[shop.category]}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pb-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#3d3830' }}>
                        <Star className="w-3 h-3" style={{ color: '#c4a882', fill: '#c4a882' }} /> {shop.rating || '4.5'}
                      </div>
                      <div className="w-1 h-1 rounded-full" style={{ background: '#D9D5D2' }} />
                      <div className="text-xs uppercase font-mono" style={{ color: '#8E867B' }}>
                        {shop.shopCurrency}
                      </div>
                    </div>

                    <Link
                      to={`/business/${shop.shopId || shop._id}`}
                      className="text-xs font-bold flex items-center gap-1 transition-colors" style={{ color: '#8E867B' }}
                    >
                      Visit Shop <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>,
    document.body
  );
}
