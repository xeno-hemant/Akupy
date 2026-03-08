import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const url = query 
          ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses/search?query=${query}`
          : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses`; // fetch all if no query
        
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

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-medium text-[#080808] mb-8">
          {query ? `Search results for "${query}"` : 'Discover Businesses'}
        </h1>

        <form 
          className="mb-12 flex gap-4 max-w-2xl"
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
            className="flex-grow px-6 py-4 rounded-full border border-black/20 focus:border-black outline-none bg-white text-black font-medium transition-colors"
          />
          <button type="submit" className="bg-[#080808] text-white rounded-full px-8 py-4 font-semibold hover:bg-[#080808]/90 transition-colors">
            Search
          </button>
        </form>

        {loading ? (
          <div className="text-gray-500 py-12">Searching the globe...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(biz => (
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
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-gray-500">Try adjusting your search terms or clearing the filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
