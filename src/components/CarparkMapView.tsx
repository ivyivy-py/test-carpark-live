import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Carpark, SearchLocation } from '../types';
import { getAvailabilityStatus, formatDistance, getLotTypeLabel, openExternalNavigation } from '../utils/distance';
import { Navigation, Bookmark, X, ExternalLink, Compass, Layers } from 'lucide-react';

interface CarparkMapViewProps {
  carparks: Carpark[];
  currentLocation: SearchLocation;
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark | null) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const CarparkMapView: React.FC<CarparkMapViewProps> = ({
  carparks,
  currentLocation,
  selectedCarpark,
  onSelectCarpark,
  favorites,
  onToggleFavorite,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [currentLocation.latitude, currentLocation.longitude],
      zoom: 15,
      zoomControl: false,
    });

    // Add clean CartoDB Voyager or OpenStreetMap tiles for Singapore
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when currentLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;

    // Pan to search location
    map.flyTo([currentLocation.latitude, currentLocation.longitude], 15, {
      animate: true,
      duration: 1,
    });

    // Update or create target location marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([currentLocation.latitude, currentLocation.longitude]);
    } else {
      const userIcon = L.divIcon({
        className: 'user-pulse-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      userMarkerRef.current = L.marker(
        [currentLocation.latitude, currentLocation.longitude],
        { icon: userIcon, zIndexOffset: 1000 }
      ).addTo(map);
    }
  }, [currentLocation, mapReady]);

  // Update carpark markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current || !mapReady) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    carparks.forEach((cp) => {
      const statusInfo = getAvailabilityStatus(cp.AvailableLots);
      const isSelected = selectedCarpark?.CarParkID === cp.CarParkID;

      // Color based on lots
      let pinColor = '#10b981'; // green
      if (cp.AvailableLots <= 0) pinColor = '#64748b'; // slate/gray
      else if (cp.AvailableLots < 20) pinColor = '#f59e0b'; // amber
      else if (cp.AvailableLots < 60) pinColor = '#0284c7'; // blue

      const markerHtml = `
        <div class="cursor-pointer transition-transform transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
          <div style="background-color: ${pinColor}; color: white; padding: 2px 7px; border-radius: 9999px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 3px; border: 2px solid white;">
            <span>${cp.AvailableLots > 999 ? '999+' : cp.AvailableLots}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${pinColor}; margin: -1px auto 0;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-carpark-pin',
        html: markerHtml,
        iconSize: [46, 32],
        iconAnchor: [23, 30],
      });

      const marker = L.marker([cp.latitude, cp.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on('click', () => {
        onSelectCarpark(cp);
        mapInstanceRef.current?.panTo([cp.latitude, cp.longitude], { animate: true });
      });

      layer.addLayer(marker);
    });
  }, [carparks, selectedCarpark, mapReady]);

  // Recenter map on current search location
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([currentLocation.latitude, currentLocation.longitude], 15, { animate: true });
  };

  // Zoom to fit all visible markers or Singapore overview
  const handleResetSingapore = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([1.3521, 103.8198], 11, { animate: true });
  };

  const selectedStatus = selectedCarpark ? getAvailabilityStatus(selectedCarpark.AvailableLots) : null;
  const isSelectedFav = selectedCarpark ? favorites.includes(selectedCarpark.CarParkID) : false;

  return (
    <div className="relative w-full h-[calc(100vh-210px)] min-h-[420px] bg-slate-100 overflow-hidden">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" id="leaflet-map-canvas" />

      {/* Map Overlay Quick Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          id="map-recenter-btn"
          onClick={handleRecenter}
          className="bg-white/95 hover:bg-white text-slate-700 p-2.5 rounded-xl shadow-md border border-slate-200/80 transition-transform active:scale-95 flex items-center gap-2 text-xs font-semibold"
          title="Recenter on searched area"
        >
          <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
          <span className="hidden sm:inline">Center Search</span>
        </button>

        <button
          id="map-singapore-overview-btn"
          onClick={handleResetSingapore}
          className="bg-white/95 hover:bg-white text-slate-700 p-2.5 rounded-xl shadow-md border border-slate-200/80 transition-transform active:scale-95 flex items-center gap-2 text-xs font-semibold"
          title="Full Singapore Map View"
        >
          <Compass className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">All Singapore</span>
        </button>
      </div>

      {/* Map Legend Floating Pill */}
      <div className="absolute top-4 right-14 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-[11px] flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>&gt;50</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>1-49</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span>Full (0)</span>
        </div>
      </div>

      {/* Floating Selected Carpark Detail Sheet */}
      {selectedCarpark && selectedStatus && (
        <div
          id="map-selected-carpark-card"
          className="absolute bottom-4 left-4 right-4 max-w-lg mx-auto z-30 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                    selectedCarpark.Agency === 'HDB'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : selectedCarpark.Agency === 'URA'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {selectedCarpark.Agency}
                </span>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {getLotTypeLabel(selectedCarpark.LotType)}
                </span>

                {selectedCarpark.distance !== undefined && (
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-blue-500" />
                    {formatDistance(selectedCarpark.distance)} away
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug truncate">
                {selectedCarpark.Development}
              </h2>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {selectedCarpark.Area ? `${selectedCarpark.Area}, Singapore` : 'Singapore'} • ID: {selectedCarpark.CarParkID}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onSelectCarpark(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lots Availability Indicator */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`text-2xl font-black tracking-tight ${selectedStatus.textClass}`}
              >
                {selectedCarpark.AvailableLots}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Lots Available
                </div>
                <div className={`text-[11px] font-medium ${selectedStatus.textClass}`}>
                  {selectedStatus.label}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Bookmark Toggle */}
              <button
                onClick={() => onToggleFavorite(selectedCarpark.CarParkID)}
                className={`p-2 rounded-xl border transition-colors ${
                  isSelectedFav
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
                title={isSelectedFav ? 'Remove from Saved' : 'Save Carpark'}
              >
                <Bookmark className={`w-4 h-4 ${isSelectedFav ? 'fill-amber-500' : ''}`} />
              </button>

              {/* Navigation button */}
              <button
                onClick={() =>
                  openExternalNavigation(
                    selectedCarpark.latitude,
                    selectedCarpark.longitude,
                    selectedCarpark.Development
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-transform active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
