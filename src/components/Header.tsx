import React from 'react';
import { RefreshCw, Key, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  isKeyConfigured: boolean;
  dataSource: 'lta_datamall' | 'fallback_demo';
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  onOpenSettings: () => void;
  totalLotsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isKeyConfigured,
  dataSource,
  isLoading,
  lastUpdated,
  onRefresh,
  onOpenSettings,
  totalLotsCount,
}) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Updating...';
    return date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isLive = dataSource === 'lta_datamall';

  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Singapore Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs font-bold text-lg tracking-tight">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                SG CarPark
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                SG
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>HDB • LTA • URA</span>
              <span>•</span>
              <span className="text-slate-600 font-medium">
                {totalLotsCount.toLocaleString()} lots tracked
              </span>
            </p>
          </div>
        </div>

        {/* Live Status & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Connection Status Badge */}
          <button
            id="status-feed-badge"
            onClick={onOpenSettings}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              isLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={isLive ? 'Connected directly to LTA DataMall v2' : 'Click to configure LTA DataMall AccountKey'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isLive ? 'LTA DataMall Live' : 'Demo Mode'}</span>
            {!isLive && <Key className="w-3 h-3 text-amber-600 ml-0.5" />}
          </button>

          {/* Refresh Button */}
          <button
            id="refresh-carparks-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50 border border-slate-200/80"
            title={`Last refreshed at ${formatTime(lastUpdated)}`}
            aria-label="Refresh Carpark Availability"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Account Key / Settings Button */}
          <button
            id="open-settings-modal-btn"
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            title="LTA API Connection & Options"
            aria-label="API Settings"
          >
            {isKeyConfigured ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <Key className="w-4 h-4 text-slate-500" />
            )}
            <span className="hidden md:inline">LTA Key</span>
          </button>
        </div>
      </div>
    </header>
  );
};
