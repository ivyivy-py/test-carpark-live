/**
 * Calculates the Haversine distance between two latitude/longitude coordinates in meters
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Format distance in user-friendly Singapore metric units (meters or kilometers)
 */
export function formatDistance(meters?: number): string {
  if (meters === undefined || meters === null || isNaN(meters)) return '';
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Returns color scheme based on available lots
 */
export function getAvailabilityStatus(lots: number): {
  status: 'high' | 'medium' | 'low' | 'full';
  label: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
  dotColor: string;
} {
  if (lots <= 0) {
    return {
      status: 'full',
      label: 'Full',
      bgClass: 'bg-rose-50 border-rose-200 text-rose-800',
      textClass: 'text-rose-700',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      dotColor: '#e11d48',
    };
  }
  if (lots < 20) {
    return {
      status: 'low',
      label: 'Limited',
      bgClass: 'bg-amber-50 border-amber-200 text-amber-800',
      textClass: 'text-amber-700',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      dotColor: '#d97706',
    };
  }
  if (lots < 60) {
    return {
      status: 'medium',
      label: 'Moderate',
      bgClass: 'bg-sky-50 border-sky-200 text-sky-800',
      textClass: 'text-sky-700',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      dotColor: '#0284c7',
    };
  }
  return {
    status: 'high',
    label: 'Available',
    bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    textClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotColor: '#059669',
  };
}

/**
 * Format lot type label
 */
export function getLotTypeLabel(type: string): string {
  switch (type) {
    case 'C':
      return 'Cars';
    case 'Y':
      return 'Motorcycles';
    case 'H':
      return 'Heavy Vehicles';
    default:
      return type || 'All Lots';
  }
}

/**
 * Open external navigation to coordinates
 */
export function openExternalNavigation(lat: number, lng: number, name: string) {
  const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const encodedName = encodeURIComponent(name);
  if (isApple) {
    window.open(`https://maps.apple.com/?q=${encodedName}&ll=${lat},${lng}`, '_blank');
  } else {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedName}`, '_blank');
  }
}
