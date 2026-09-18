import React from 'react';
import { Carpark } from '../types';
import { getAvailabilityStatus, formatDistance, getLotTypeLabel, openExternalNavigation } from '../utils/distance';
import { Bookmark, MapPin, ExternalLink, Trash2, Shield, AlertCircle } from 'lucide-react';

interface FavoritesViewProps {
  carparks: Carpark[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewOnMap: (carpark: Carpark) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  carparks,
  favorites,
  onToggleFavorite,
  onViewOnMap,
}) => {
  const favoriteCarparks = carparks.filter((cp) => favorites.includes(cp.CarParkID));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 pb-24">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bookmark className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Saved Carparks</h2>
              <p className="text-xs text-slate-500">
                Track real-time lot availability for your regular Singapore parking spots
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {favoriteCarparks.length} Saved
          </span>
        </div>
      </div>

      {favoriteCarparks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No saved carparks yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Tap the bookmark icon on any parking lot in the Map View or Nearby List to save it here for fast monitoring.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteCarparks.map((cp) => {
            const status = getAvailabilityStatus(cp.AvailableLots);
            return (
              <div
                key={cp.CarParkID}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                          cp.Agency === 'HDB'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : cp.Agency === 'URA'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {cp.Agency}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                        {getLotTypeLabel(cp.LotType)}
                      </span>
                      {cp.distance !== undefined && (
                        <span className="text-xs text-slate-500 font-semibold">
                          {formatDistance(cp.distance)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cp.Development}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {cp.Area ? `${cp.Area}` : 'Singapore'} • ID: {cp.CarParkID}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`px-3 py-1.5 rounded-xl border text-center ${status.bgClass}`}>
                      <div className="text-xl font-black leading-none">{cp.AvailableLots}</div>
                      <div className="text-[10px] font-bold uppercase mt-0.5">{status.label}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewOnMap(cp)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                    <button
                      onClick={() => openExternalNavigation(cp.latitude, cp.longitude, cp.Development)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors border border-slate-200/80"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Directions</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(cp.CarParkID)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
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
