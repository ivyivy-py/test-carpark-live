import React from 'react';
import { Carpark } from '../types';
import { Info, Clock, DollarSign, ShieldCheck, Car, Bike, Truck, Database } from 'lucide-react';

interface RatesInfoViewProps {
  carparks: Carpark[];
  dataSource: 'lta_datamall' | 'fallback_demo';
  isKeyConfigured: boolean;
  onOpenSettings: () => void;
}

export const RatesInfoView: React.FC<RatesInfoViewProps> = ({
  carparks,
  dataSource,
  isKeyConfigured,
  onOpenSettings,
}) => {
  // Aggregate stats
  const totalAvailable = carparks.reduce((acc, c) => acc + c.AvailableLots, 0);
  const hdbLots = carparks.filter((c) => c.Agency === 'HDB').reduce((acc, c) => acc + c.AvailableLots, 0);
  const ltaLots = carparks.filter((c) => c.Agency === 'LTA').reduce((acc, c) => acc + c.AvailableLots, 0);
  const uraLots = carparks.filter((c) => c.Agency === 'URA').reduce((acc, c) => acc + c.AvailableLots, 0);

  const carCount = carparks.filter((c) => c.LotType === 'C').length;
  const motoCount = carparks.filter((c) => c.LotType === 'Y').length;
  const heavyCount = carparks.filter((c) => c.LotType === 'H').length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 pb-24 space-y-4">
      {/* Real-time statistics summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Real-Time Data Overview</h2>
              <p className="text-xs text-slate-500">Live Singapore transport telemetry</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              dataSource === 'lta_datamall'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {dataSource === 'lta_datamall' ? 'Live DataMall Feed' : 'Verified SG Offline Feed'}
          </span>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-xs font-medium text-slate-500">Total Lots Free</div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {totalAvailable.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{carparks.length} carparks</div>
          </div>

          <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
            <div className="text-xs font-medium text-blue-700">HDB Lots Free</div>
            <div className="text-xl font-black text-blue-800 mt-1">
              {hdbLots.toLocaleString()}
            </div>
            <div className="text-[10px] text-blue-500 mt-0.5">Housing estates</div>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
            <div className="text-xs font-medium text-emerald-700">LTA / Mall Lots</div>
            <div className="text-xl font-black text-emerald-800 mt-1">
              {ltaLots.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-500 mt-0.5">Shopping & Transit</div>
          </div>

          <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-100">
            <div className="text-xs font-medium text-purple-700">URA Lots Free</div>
            <div className="text-xl font-black text-purple-800 mt-1">
              {uraLots.toLocaleString()}
            </div>
            <div className="text-[10px] text-purple-500 mt-0.5">Downtown & street</div>
          </div>
        </div>

        {/* Vehicle breakdown chips */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Monitored Facilities:</span>
          <span className="flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-blue-600" /> {carCount} Car Parks
          </span>
          <span className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-amber-600" /> {motoCount} Motorcycle
          </span>
          {heavyCount > 0 && (
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-slate-600" /> {heavyCount} Heavy
            </span>
          )}
        </div>
      </div>

      {/* Singapore Parking Rates & Regulations Guide */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Standard Singapore Parking Rates</h3>
            <p className="text-xs text-slate-500">Official HDB & URA standard tariff reference</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          {/* Outside Central Area */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Outside Central Area</span>
              <span className="text-xs font-extrabold text-blue-600">$0.60 / 30 mins</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Standard rate across suburban HDB housing estates (Toa Payoh, Tampines, Jurong, Bedok, Woodlands, Ang Mo Kio). EPS per-minute charging.
            </p>
          </div>

          {/* Central Area */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Central Area (CBD/Orchard)</span>
              <span className="text-xs font-extrabold text-blue-600">$1.20 / 30 mins</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Applies Mondays to Saturdays from 7:00 AM to 5:00 PM for car parks located within the Central Area zone. Outside peak, reverts to $0.60/30m.
            </p>
          </div>

          {/* Night Parking */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Night Parking Scheme</span>
              <span className="text-xs font-extrabold text-emerald-600">Capped at $5.00</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              From 10:30 PM to 7:00 AM the following day, maximum night parking fee is capped at $5.00 per session in all participating HDB car parks.
            </p>
          </div>

          {/* Sunday & Public Holidays */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">Sunday Free Parking (FPS)</span>
              <span className="text-xs font-extrabold text-emerald-600">Free 7:30am - 10:30pm</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Available on Sundays and Singapore Public Holidays at designated HDB carparks marked with orange Free Parking Scheme signs.
            </p>
          </div>
        </div>
      </div>

      {/* LTA DataMall Connection card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                LTA DataMall v2
              </span>
              <span className="text-xs text-slate-300 font-medium">CarParkAvailabilityv2</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Official Land Transport Authority API Feed
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-lg">
              Lot counts update continuously from Land Transport Authority sensors across Singapore, aggregating HDB residential estates, URA street parking, and major shopping mall developments.
            </p>
          </div>
          <button
            onClick={onOpenSettings}
            className="shrink-0 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/10"
          >
            API Setup
          </button>
        </div>
      </div>
    </div>
  );
};
