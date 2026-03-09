import React, { useState, useEffect } from 'react';
import useCartStore from '../store/useCartStore';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:5000') {
    return import.meta.env.VITE_API_URL;
  }
  return `http://${window.location.hostname}:5000`;
};

export default function ShopSubdomain({ shopId }) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/businesses/shop/${shopId}`);
        if (res.ok) {
          const data = await res.json();
          setBusiness(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [shopId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading {shopId}...</div>;
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Shop Not Found</h1>
        <p className="text-gray-500">The shop <strong>{shopId}</strong> does not exist.</p>
        <a href="https://akupy.in" className="mt-6 text-primary hover:underline">Return to Akupy</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header specific to this shop */}
      <header className="w-full bg-[#080808] text-white py-10 md:py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">{business.name}</h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">{business.description || 'Welcome to our official Akupy store.'}</p>
        {business.category && <span className="inline-block mt-4 px-3 py-1 bg-white/10 rounded-full text-xs font-medium uppercase tracking-wider">{business.category}</span>}
      </header>

      {/* Catalog Render */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8 border-b pb-4">Our Products</h2>
        {business.products && business.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {business.products.map((product, index) => (
              <div key={index} className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-300 relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                  ) : 'No Image'}
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-white/90 text-red-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Out of Stock</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-1 border-b pb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product, business)}
                      disabled={!product.inStock}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium hover:bg-primary hover:text-black transition-colors disabled:opacity-50"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-100 rounded-3xl">
            This shop hasn't listed any products yet.
          </div>
        )}
      </main>
      
      <footer className="w-full text-center py-6 text-sm text-gray-400 border-t">
        Powered by Akupy Infrastructure
      </footer>
    </div>
  );
}
