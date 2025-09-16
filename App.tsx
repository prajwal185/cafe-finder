import React, { useState, useCallback } from 'react';
import { CafeCard } from './components/CafeCard';
import { Spinner } from './components/Spinner';
import { CoffeeIcon } from './components/icons/CoffeeIcon';
import { SearchIcon } from './components/icons/SearchIcon';
import { findCafes } from './services/geminiService';
import type { Cafe } from './types';
import Map from './components/Map';

export default function App() {
  const [location, setLocation] = useState<string>('San Francisco');
  const [searchedLocation, setSearchedLocation] = useState<string>('');
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCafes([]);
    setSearchedLocation(location);

    try {
      const results = await findCafes(location);
      if (results && results.length > 0) {
        setCafes(results);
      }
    } catch (err) {
      console.error('Error finding cafes:', err);
      setError('Sorry, we couldn\'t find any cafes. Please try a different location.');
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <CoffeeIcon className="w-12 h-12 text-stone-600" />
            <h1 className="text-5xl font-bold text-stone-800" style={{ fontFamily: '"Playfair Display", serif' }}>
              Café Finder
            </h1>
          </div>
          <p className="text-lg text-stone-600">Discover your next favorite coffee spot, powered by AI.</p>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="relative flex items-center shadow-md rounded-full bg-white overflow-hidden border-2 border-transparent focus-within:border-amber-500 transition-colors">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter a city, e.g., 'Paris'"
                className="w-full py-4 pl-6 pr-32 text-lg bg-transparent focus:outline-none text-stone-700 placeholder-stone-400"
                aria-label="Location search"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                aria-label="Find cafes"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="w-5 h-5" />
                    Find Cafes
                  </>
                )}
              </button>
            </div>
          </form>

          {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">{error}</p>}
          
          {isLoading && (
             <div className="flex justify-center items-center mt-8">
                <Spinner className="w-12 h-12 text-stone-600"/>
             </div>
          )}

          {!isLoading && !error && hasSearched && (
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-stone-700 mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
                   Cafes in <span className="text-amber-600">{searchedLocation}</span>
                </h2>
                {cafes.length > 0 ? (
                  <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 -mr-4">
                    {cafes.map((cafe, index) => (
                      <CafeCard key={`${cafe.name}-${index}`} cafe={cafe} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-stone-600 bg-amber-100 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">No Cafes Found</h2>
                    <p>We couldn't find any cafes for "{searchedLocation}". Try a different location.</p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-3 h-[70vh] min-h-[500px]">
                  <Map cafes={cafes} />
              </div>
            </div>
          )}

          {!isLoading && !hasSearched && (
             <div className="text-center py-16 text-stone-500">
                <p>Enter a location above to find cafes and see them on the map.</p>
             </div>
          )}

        </main>

        <footer className="text-center mt-16 text-stone-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Café Finder. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}