export type LotType = 'C' | 'Y' | 'H'; // C: Cars, Y: Motorcycles, H: Heavy Vehicles
export type Agency = 'HDB' | 'LTA' | 'URA' | string;

export interface RawLtaCarpark {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // "1.29375 103.85718"
  AvailableLots: number;
  LotType: LotType | string;
  Agency: Agency;
}

export interface Carpark {
  CarParkID: string;
  Area: string;
  Development: string;
  latitude: number;
  longitude: number;
  AvailableLots: number;
  LotType: LotType | string;
  Agency: Agency;
  distance?: number; // meters from user/searched location
}

export interface SearchLocation {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  postalCode?: string;
}

export interface CarparkApiResponse {
  success: boolean;
  source: 'lta_datamall' | 'fallback_demo';
  total: number;
  timestamp: string;
  keyConfigured: boolean;
  value: Carpark[];
  message?: string;
}

export interface FilterOptions {
  lotType: 'ALL' | 'C' | 'Y' | 'H';
  agency: 'ALL' | 'HDB' | 'LTA' | 'URA';
  minLots: number;
  maxDistanceKm: number; // 0 means all
  sortBy: 'distance' | 'availability' | 'name';
}
