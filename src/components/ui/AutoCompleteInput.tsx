import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

type Station = {
  id: string;
  name: string;
}

type AutoCompleteInputProps = {
  onSelect: (station: Station) => void;
  placeholder?: string;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({ onSelect, placeholder = "Search..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          const response = await fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations');
          const stations = await response.json();
          const filtered = stations.filter(station => 
            station.name.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching stations:', error);
          setSuggestions([]);
        }
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (station: Station) => {
    setSelectedStation(station);
    setQuery(station.name);
    setShowSuggestions(false);
    onSelect(station);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedStation) {
      setSelectedStation(null);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div data-testid="loading-spinner" className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((station) => (
            <div
              key={station.id}
              onClick={() => handleSelect(station)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{station.name}</div>
                  <div className="text-sm text-gray-500">ID: {station.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default AutoCompleteInput;