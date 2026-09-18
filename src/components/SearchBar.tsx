import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Navigation, Filter, Check, Loader2, Sparkles } from 'lucide-react';
import { FilterOptions, SearchLocation } from '../types';
import { POPULAR_SG_LOCATIONS } from '../data/mockCarparks';

interface SearchBarProps {
  currentLocation: SearchLocation;
  onSelectLocation: (loc: SearchLocation) => void;
  filters: FilterOptions;
  onUpdateFilters: (filters: FilterOptions) => void;
  onUseCurrentGps: () => void;
  isLocating: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentLocation,
  onSelectLocation,
  filters,
  onUpdateFilters,
  onUseCurrentGps,
  isLocating,
}) => {
  const [query, setQuery] = useState(currentLocation.name);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize when currentLocation changes externally
  useEffect(() => {
    setQuery(currentLocation.name);
  }, [currentLocation]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced geocoding search for Singapore places & postal codes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions(POPULAR_SG_LOCATIONS.slice(0, 6));
      return;
    }

    // Local filter on popular places first
    const localMatches = POPULAR_SG_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        (loc.address && loc.address.toLowerCase().includes(trimmed.toLowerCase()))
    );

    const timer = setTimeout(async () => {
      try {
        setIsSearchingGeocode(true);
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json() as { results: SearchLocation[] };
          if (data.results && data.results.length > 0) {
            // Combine unique items
            const combined = [...localMatches];
            for (const item of data.results) {
              if (!combined.some((c) => Math.abs(c.latitude - item.latitude) < 0.001 && Math.abs(c.longitude - item.longitude) < 0.001)) {
                combined.push(item);
              }
            }
            setSuggestions(combined.slice(0, 8));
          } else {
            setSuggestions(localMatches);
          }
        }
      } catch {
        setSuggestions(localMatches);
      } finally {
        setIsSearchingGeocode(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: SearchLocation) => {
    setQuery(loc.name);
    setIsOpen(false);
    onSelectLocation(loc);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions(POPULAR_SG_LOCATIONS.slice(0, 6));
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 relative z-20" ref={searchContainerRef}>
      {/* Search Input Box */}
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        <div className="pl-3.5 pr-2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          id="location-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Singapore location, mall, street, or postal code..."
          className="w-full py-3 pr-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          autoComplete="off"
        />

        {isSearchingGeocode && (
          <div className="pr-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}

        {query && (
          <button
            id="clear-search-btn"
            onClick={handleClear}
            className="p-1.5 mr-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Clear search"
            aria-label="Clear location input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* GPS Near Me Button */}
        <button
          id="use-current-gps-btn"
          onClick={onUseCurrentGps}
          disabled={isLocating}
          className="flex items-center gap-1.5 mr-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-xs transition-colors shrink-0 disabled:opacity-50"
          title="Use current GPS location in Singapore"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 fill-blue-600" />
          )}
          <span className="hidden sm:inline">Near Me</span>
        </button>

        {/* Filter Toggle */}
        <button
          id="toggle-filter-dropdown-btn"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className={`p-2 mr-2 rounded-xl transition-colors border ${
            showFilterDropdown || filters.agency !== 'ALL' || filters.lotType !== 'ALL' || filters.minLots > 0
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-transparent'
          }`}
          title="Filter carparks by agency, vehicle type, lots"
          aria-label="Filter Options"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          id="search-suggestions-dropdown"
          className="absolute left-4 right-4 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{query.trim() ? 'Matching Locations in Singapore' : 'Popular Singapore Locations'}</span>
            <span className="text-[11px] text-slate-400">OneMap & LTA</span>
          </div>

          <div className="p-1">
            {suggestions.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No Singapore locations found for "{query}". Try "Orchard", "Marina Bay", or a 6-digit postal code.
              </div>
            ) : (
              suggestions.map((loc, idx) => (
                <button
                  key={`${loc.name}-${idx}`}
                  id={`suggestion-item-${idx}`}
                  onClick={() => handleSelect(loc)}
                  className="w-full px-3 py-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-slate-100 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 mt-0.5 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600">
                      {loc.name}
                    </div>
                    {loc.address && (
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {loc.address}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Dropdown Popover */}
      {showFilterDropdown && (
        <div
          id="filter-options-popover"
          className="absolute right-4 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-40 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filter Lots
            </h3>
            <button
              onClick={() =>
                onUpdateFilters({
                  lotType: 'ALL',
                  agency: 'ALL',
                  minLots: 0,
                  maxDistanceKm: 0,
                  sortBy: 'distance',
                })
              }
              className="text-xs text-blue-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Vehicle / Lot Type */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Vehicle Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'C', label: 'Cars' },
                { id: 'Y', label: 'Motor' },
                { id: 'H', label: 'Heavy' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateFilters({ ...filters, lotType: opt.id as FilterOptions['lotType'] })}
                  className={`py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    filters.lotType === opt.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Agency */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Government Agency
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'HDB', label: 'HDB' },
                { id: 'LTA', label: 'LTA' },
                { id: 'URA', label: 'URA' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateFilters({ ...filters, agency: opt.id as FilterOptions['agency'] })}
                  className={`py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    filters.agency === opt.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability threshold */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">Minimum Available Lots</span>
              <span className="font-semibold text-blue-600">{filters.minLots > 0 ? `${filters.minLots}+ lots` : 'Any'}</span>
            </div>
            <div className="flex gap-2">
              {[0, 10, 30, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdateFilters({ ...filters, minLots: num })}
                  className={`flex-1 py-1 text-xs rounded-lg border font-medium transition-colors ${
                    filters.minLots === num
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {num === 0 ? 'All' : `>${num}`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'distance', label: 'Distance' },
                { id: 'availability', label: 'Lots Count' },
                { id: 'name', label: 'Name' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateFilters({ ...filters, sortBy: opt.id as FilterOptions['sortBy'] })}
                  className={`py-1.5 text-xs rounded-lg font-medium border text-center transition-colors ${
                    filters.sortBy === opt.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Destination Chips */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <span className="text-slate-400 shrink-0 flex items-center gap-1 text-[11px] font-medium pr-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Hotspots:
        </span>
        {POPULAR_SG_LOCATIONS.slice(0, 8).map((loc) => {
          const isSelected = currentLocation.name === loc.name;
          return (
            <button
              key={loc.name}
              onClick={() => handleSelect(loc)}
              className={`shrink-0 px-2.5 py-1 rounded-lg transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {loc.name.replace(/\s*\(.*\)/, '')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
