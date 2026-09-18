import React from 'react';
import { Map, List, Bookmark, Info } from 'lucide-react';

export type NavTab = 'map' | 'list' | 'favorites' | 'info';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoritesCount: number;
  totalNearbyCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  totalNearbyCount,
}) => {
  const tabs = [
    {
      id: 'map' as NavTab,
      label: 'Map View',
      icon: Map,
      badge: null,
    },
    {
      id: 'list' as NavTab,
      label: 'Nearby Lots',
      icon: List,
      badge: totalNearbyCount > 0 ? (totalNearbyCount > 99 ? '99+' : totalNearbyCount) : null,
    },
    {
      id: 'favorites' as NavTab,
      label: 'Saved',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      id: 'info' as NavTab,
      label: 'Rates & Guide',
      icon: Info,
      badge: null,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg"
    >
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                </div>
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-blue-600 text-white min-w-[16px] text-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-semibold text-blue-600' : 'font-normal text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
