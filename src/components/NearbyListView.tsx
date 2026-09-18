import React from 'react';
import { Carpark, SearchLocation, FilterOptions } from '../types';
import { getAvailabilityStatus, formatDistance, getLotTypeLabel, openExternalNavigation } from '../utils/distance';
import { MapPin, Navigation, Bookmark, ExternalLink, ArrowUpDown, Shield, AlertCircle } from 'lucide-react';

interface NearbyListViewProps {
  carparks: Carpark[];
  currentLocation: SearchLocation;
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  onViewOnMap: (carpark: Carpark) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  filters: FilterOptions;
  onUpdateFilters: (filters: FilterOptions) => void;
}

export const NearbyListView: React.FC<NearbyListViewProps> = ({
  carparks,
  currentLocation,
  selectedCarpark,
  onSelectCarpark,
  onViewOnMap,
  favorites,
  onToggleFavorite,
  filters,
  onUpdateFilters,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 pb-24">
      {/* Header Info & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>Nearby Parking Lots</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-semibold">
              {carparks.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Near <span className="font-semibold text-slate-700">{currentLocation.name}</span>
          </p>
        </div>

        {/* Quick Sort Options */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <button
            onClick={() => onUpdateFilters({ ...filters, sortBy: 'distance' })}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filters.sortBy === 'distance'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Nearest
          </button>
          <button
            onClick={() => onUpdateFilters({ ...filters, sortBy: 'availability' })}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filters.sortBy === 'availability'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Most Lots
          </button>
          <button
            onClick={() => onUpdateFilters({ ...filters, sortBy: 'name' })}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filters.sortBy === 'name'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            A-Z
          </button>
        </div>
      </div>

      {/* List items */}
      {carparks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No carparks found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your vehicle type or government agency filters, or search another location in Singapore.
          </p>
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
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {carparks.map((cp) => {
            const status = getAvailabilityStatus(cp.AvailableLots);
            const isFav = favorites.includes(cp.CarParkID);
            const isSelected = selectedCarpark?.CarParkID === cp.CarParkID;

            return (
              <div
                key={cp.CarParkID}
                id={`carpark-card-${cp.CarParkID}`}
                onClick={() => onSelectCarpark(cp)}
                className={`bg-white rounded-2xl border transition-all p-3.5 sm:p-4 hover:shadow-md cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {/* Agency badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                          cp.Agency === 'HDB'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : cp.Agency === 'URA'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {cp.Agency}
                      </span>

                      {/* Lot Type */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                        {getLotTypeLabel(cp.LotType)}
                      </span>

                      {/* Distance */}
                      {cp.distance !== undefined && (
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-0.5">
                          <Navigation className="w-3 h-3 text-blue-600 fill-blue-600" />
                          {formatDistance(cp.distance)}
                        </span>
                      )}
                    </div>

                    {/* Development / Carpark Name */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600">
                      {cp.Development}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {cp.Area ? `${cp.Area}` : 'Singapore'} • Lot ID: {cp.CarParkID}
                    </p>
                  </div>

                  {/* Right: Available Lots Hero Badge */}
                  <div className="text-right shrink-0">
                    <div
                      className={`inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border min-w-[72px] ${status.bgClass}`}
                    >
                      <span className="text-lg sm:text-xl font-black leading-none">
                        {cp.AvailableLots}
                      </span>
                      <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewOnMap(cp);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors border border-slate-200/80"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>View on Map</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openExternalNavigation(cp.latitude, cp.longitude, cp.Development);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors border border-slate-200/80"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Directions</span>
                    </button>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(cp.CarParkID);
                    }}
                    className={`p-1.5 rounded-lg transition-colors border ${
                      isFav
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-transparent'
                    }`}
                    title={isFav ? 'Remove from saved' : 'Save carpark'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
