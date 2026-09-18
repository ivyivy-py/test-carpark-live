import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CarparkMapView } from './components/CarparkMapView';
import { NearbyListView } from './components/NearbyListView';
import { FavoritesView } from './components/FavoritesView';
import { RatesInfoView } from './components/RatesInfoView';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { LtaSettingsModal } from './components/LtaSettingsModal';
import { Carpark, SearchLocation, FilterOptions, CarparkApiResponse } from './types';
import { calculateDistanceMeters } from './utils/distance';
import { POPULAR_SG_LOCATIONS } from './data/mockCarparks';

const INITIAL_LOCATION: SearchLocation = POPULAR_SG_LOCATIONS[0]; // Orchard Road

const INITIAL_FILTERS: FilterOptions = {
  lotType: 'ALL',
  agency: 'ALL',
  minLots: 0,
  maxDistanceKm: 0,
  sortBy: 'distance',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('map');
  const [currentLocation, setCurrentLocation] = useState<SearchLocation>(INITIAL_LOCATION);
  const [allCarparks, setAllCarparks] = useState<Carpark[]>([]);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_carpark_favorites');
      return saved ? JSON.parse(saved) : ['1', '9', 'HDB-TP1'];
    } catch {
      return ['1', '9', 'HDB-TP1'];
    }
  });

  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [dataSource, setDataSource] = useState<'lta_datamall' | 'fallback_demo'>('fallback_demo');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userAccountKey, setUserAccountKey] = useState<string>(() => {
    try {
      return localStorage.getItem('sg_custom_lta_key') || '';
    } catch {
      return '';
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sg_carpark_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to persist favorites:', e);
    }
  }, [favorites]);

  // Fetch carparks from API
  const fetchCarparks = useCallback(async (customKey?: string) => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const keyToUse = customKey !== undefined ? customKey : userAccountKey;
      if (keyToUse) {
        headers['x-account-key'] = keyToUse;
      }

      const res = await fetch(`/api/carparks?lat=${currentLocation.latitude}&lng=${currentLocation.longitude}`, {
        headers,
      });

      if (res.ok) {
        const data = (await res.json()) as CarparkApiResponse;
        setAllCarparks(data.value || []);
        setDataSource(data.source);
        setIsKeyConfigured(data.keyConfigured);
        setLastUpdated(new Date(data.timestamp || Date.now()));
      }
    } catch (err) {
      console.error('Failed to fetch carpark availability:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation.latitude, currentLocation.longitude, userAccountKey]);

  // Initial load and periodic refresh (every 60s)
  useEffect(() => {
    fetchCarparks();
    const interval = setInterval(() => {
      fetchCarparks();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchCarparks]);

  // Compute distance from active location and apply filters & sorting
  const processedCarparks = useMemo(() => {
    const list = allCarparks.map((cp) => {
      const dist = calculateDistanceMeters(
        currentLocation.latitude,
        currentLocation.longitude,
        cp.latitude,
        cp.longitude
      );
      return { ...cp, distance: dist };
    });

    // Filter by vehicle/lot type
    let filtered = list;
    if (filters.lotType !== 'ALL') {
      filtered = filtered.filter((cp) => cp.LotType === filters.lotType);
    }

    // Filter by government agency
    if (filters.agency !== 'ALL') {
      filtered = filtered.filter((cp) => cp.Agency.toUpperCase() === filters.agency.toUpperCase());
    }

    // Filter by minimum lots
    if (filters.minLots > 0) {
      filtered = filtered.filter((cp) => cp.AvailableLots >= filters.minLots);
    }

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'distance') {
        return (a.distance ?? 0) - (b.distance ?? 0);
      }
      if (filters.sortBy === 'availability') {
        return b.AvailableLots - a.AvailableLots;
      }
      if (filters.sortBy === 'name') {
        return a.Development.localeCompare(b.Development);
      }
      return 0;
    });

    return filtered;
  }, [allCarparks, currentLocation, filters]);

  // Handle GPS location
  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let locationName = 'My Location (Singapore)';

        // Reverse geocode via OneMap or Nominatim if in Singapore
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          if (res.ok) {
            const data = await res.json() as { display_name?: string; address?: { road?: string; suburb?: string } };
            if (data.address?.road) {
              locationName = `${data.address.road}${data.address.suburb ? `, ${data.address.suburb}` : ''}`;
            } else if (data.display_name) {
              locationName = data.display_name.split(',')[0];
            }
          }
        } catch {
          // Fallback to coordinates
        }

        const newLoc: SearchLocation = {
          name: locationName,
          latitude,
          longitude,
        };

        setCurrentLocation(newLoc);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        // If user denied or outside SG, fallback to Orchard Road
        alert('Could not retrieve GPS location. Using default Singapore location.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleViewOnMap = (carpark: Carpark) => {
    setSelectedCarpark(carpark);
    setActiveTab('map');
  };

  const handleTestOrSaveKey = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/carparks', {
        headers: { 'x-account-key': key },
      });
      if (res.ok) {
        const data = await res.json() as CarparkApiResponse;
        if (data.keyConfigured) {
          setUserAccountKey(key);
          localStorage.setItem('sg_custom_lta_key', key);
          setIsKeyConfigured(true);
          setDataSource('lta_datamall');
          setAllCarparks(data.value || []);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Application Header */}
      <Header
        isKeyConfigured={isKeyConfigured}
        dataSource={dataSource}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        onRefresh={() => fetchCarparks()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalLotsCount={allCarparks.reduce((acc, c) => acc + c.AvailableLots, 0)}
      />

      {/* Persistent Location Search Bar & Filter Controls */}
      <SearchBar
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          setSelectedCarpark(null);
        }}
        filters={filters}
        onUpdateFilters={setFilters}
        onUseCurrentGps={handleUseCurrentGps}
        isLocating={isLocating}
      />

      {/* Main View Area based on Bottom Navigation Selection */}
      <main className="flex-1 relative flex flex-col">
        {activeTab === 'map' && (
          <CarparkMapView
            carparks={processedCarparks}
            currentLocation={currentLocation}
            selectedCarpark={selectedCarpark}
            onSelectCarpark={setSelectedCarpark}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'list' && (
          <NearbyListView
            carparks={processedCarparks}
            currentLocation={currentLocation}
            selectedCarpark={selectedCarpark}
            onSelectCarpark={setSelectedCarpark}
            onViewOnMap={handleViewOnMap}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            filters={filters}
            onUpdateFilters={setFilters}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            carparks={processedCarparks}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewOnMap={handleViewOnMap}
          />
        )}

        {activeTab === 'info' && (
          <RatesInfoView
            carparks={allCarparks}
            dataSource={dataSource}
            isKeyConfigured={isKeyConfigured}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        favoritesCount={favorites.length}
        totalNearbyCount={processedCarparks.length}
      />

      {/* LTA DataMall Connection Modal */}
      <LtaSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isKeyConfigured={isKeyConfigured}
        dataSource={dataSource}
        onTestOrSaveKey={handleTestOrSaveKey}
        onRefreshData={() => fetchCarparks()}
      />
    </div>
  );
}
