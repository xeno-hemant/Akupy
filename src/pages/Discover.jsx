import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const isProd = window.location.hostname.includes('akupy.in');
      const rootUrl = isProd ? 'https://akupybackend.onrender.com' : `http://${window.location.hostname}:5000`;
      const apiUrl = import.meta.env.VITE_API_URL || rootUrl;
      
      try {
        const url = query 
          ? `${apiUrl}/api/businesses/search?query=${query}`
          : `${apiUrl}/api/businesses`; // fetch all if no query
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Failed to search", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Derived filtered & sorted results
  const categories = ['All', ...new Set(results.map(r => r.category).filter(Boolean))];
  
  let displayedResults = [...results];
  if (selectedCategory !== 'All') {
    displayedResults = displayedResults.filter(r => r.category === selectedCategory);
  }
  
  displayedResults.sort((a, b) => {
    if (sortBy === 'Name (A-Z)') return a.name.localeCompare(b.name);
    if (sortBy === 'Name (Z-A)') return b.name.localeCompare(a.name);
    // Default Newest
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-[#080808] mb-8">
          {query ? `Search results for "${query}"` : 'Discover Businesses'}
        </h1>

        <form 
          className="mb-12 flex flex-col md:flex-row gap-4 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target.search.value;
            setSearchParams(val ? { q: val } : {});
          }}
        >
          <input 
            name="search"
            defaultValue={query}
            placeholder="Search by name or category..." 
            className="flex-grow min-w-0 px-6 py-4 rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors"
          />
          <button type="submit" className="bg-[#080808] text-white rounded-full px-8 py-4 font-semibold hover:bg-[#080808]/90 transition-colors w-full md:w-auto">
            Search
          </button>
        </form>

        {/* Filters and Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm sticky top-28">
              <div className="mb-6">
                <h3 className="font-semibold text-[#080808] mb-3">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm font-medium"
                >
                  <option>Newest</option>
                  <option>Name (A-Z)</option>
                  <option>Name (Z-A)</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-[#080808] mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="text-gray-500 py-12 text-center">Searching the globe...</div>
            ) : displayedResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {displayedResults.map(biz => (
                  <Link to={`/business/${biz._id}`} key={biz._id} className="block group">
                    <div className="bg-white rounded-3xl p-8 border border-black/5 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md h-full flex flex-col">
                      <div className="inline-block px-3 py-1 bg-green-50 text-primary rounded-full text-xs font-semibold mb-4 w-max">
                        {biz.category || 'Local Business'}
                      </div>
                      <h3 className="text-xl font-bold text-[#080808] mb-2 group-hover:text-primary transition-colors">{biz.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-3">
                        {biz.description || 'No description provided yet.'}
                      </p>
                      <div className="text-sm font-medium text-[#080808] mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span>Explore Profile</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-black/5">
                <h3 className="text-xl font-semibold mb-2">No businesses match your filters</h3>
                <p className="text-gray-500">Try adjusting your category or search terms.</p>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="mt-4 px-6 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
