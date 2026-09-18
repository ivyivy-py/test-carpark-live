import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

interface LtaRawItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // "lat lng"
  AvailableLots: number;
  LotType: string;
  Agency: string;
}

interface ParsedCarpark {
  CarParkID: string;
  Area: string;
  Development: string;
  latitude: number;
  longitude: number;
  AvailableLots: number;
  LotType: string;
  Agency: string;
}

// In-memory cache for LTA DataMall
let cachedCarparks: ParsedCarpark[] = [];
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

// Haversine distance calculator in meters
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of the earth in m
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Fetch all carparks from LTA DataMall with pagination
async function fetchFromLtaDataMall(accountKey: string): Promise<ParsedCarpark[]> {
  const allResults: ParsedCarpark[] = [];
  let skip = 0;
  const pageSize = 500;
  let hasMore = true;
  let pageCount = 0;
  const maxPages = 6; // Safety limit (typically ~2,000 lots in Singapore)

  while (hasMore && pageCount < maxPages) {
    const url = `https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2?$skip=${skip}`;
    const response = await fetch(url, {
      headers: {
        'AccountKey': accountKey.trim(),
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LTA DataMall API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json() as { value: LtaRawItem[] };
    const items = data.value || [];

    for (const item of items) {
      if (!item.Location) continue;
      const parts = item.Location.trim().split(/\s+/);
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon) && lat >= 1.15 && lat <= 1.50 && lon >= 103.55 && lon <= 104.1) {
          allResults.push({
            CarParkID: item.CarParkID || `CP-${allResults.length + 1}`,
            Area: item.Area || 'Singapore',
            Development: item.Development || 'Carpark',
            latitude: lat,
            longitude: lon,
            AvailableLots: Number(item.AvailableLots) >= 0 ? Number(item.AvailableLots) : 0,
            LotType: item.LotType || 'C',
            Agency: item.Agency || 'LTA',
          });
        }
      }
    }

    if (items.length < pageSize) {
      hasMore = false;
    } else {
      skip += pageSize;
      pageCount++;
    }
  }

  return allResults;
}

// Curated Singapore fallback data if AccountKey is not set
const FALLBACK_DATA: ParsedCarpark[] = [
  { CarParkID: '1', Area: 'Marina', Development: 'Suntec City Mall', latitude: 1.29375, longitude: 103.85718, AvailableLots: 428, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '1-M', Area: 'Marina', Development: 'Suntec City (Motorcycle)', latitude: 1.29375, longitude: 103.85718, AvailableLots: 56, LotType: 'Y', Agency: 'LTA' },
  { CarParkID: '2', Area: 'Marina', Development: 'Marina Bay Sands', latitude: 1.2838, longitude: 103.8591, AvailableLots: 312, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '3', Area: 'Marina', Development: 'Millenia Singapore', latitude: 1.2929, longitude: 103.8598, AvailableLots: 195, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '4', Area: 'Marina', Development: 'Marina Square Shopping Centre', latitude: 1.2912, longitude: 103.8564, AvailableLots: 182, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '5', Area: 'Marina', Development: 'Esplanade - Theatres on the Bay', latitude: 1.2898, longitude: 103.8558, AvailableLots: 88, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '6', Area: 'Marina', Development: 'Raffles City Shopping Centre', latitude: 1.2939, longitude: 103.8533, AvailableLots: 240, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'URA-01', Area: 'Downtown', Development: 'CapitaSpring (Market Street)', latitude: 1.2842, longitude: 103.8504, AvailableLots: 42, LotType: 'C', Agency: 'URA' },
  { CarParkID: 'URA-02', Area: 'Downtown', Development: 'Telok Ayer Street (Kerbside Lots)', latitude: 1.2809, longitude: 103.8475, AvailableLots: 14, LotType: 'C', Agency: 'URA' },
  { CarParkID: 'URA-03', Area: 'Downtown', Development: 'Amoy Street Surface Carpark', latitude: 1.2802, longitude: 103.8468, AvailableLots: 8, LotType: 'C', Agency: 'URA' },
  { CarParkID: '7', Area: 'CBD', Development: 'One Raffles Quay Multi-Storey', latitude: 1.2818, longitude: 103.8523, AvailableLots: 110, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '8', Area: 'CBD', Development: 'Marina Bay Financial Centre Tower 1', latitude: 1.2796, longitude: 103.8539, AvailableLots: 165, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '9', Area: 'Orchard', Development: 'ION Orchard Shopping Centre', latitude: 1.3040, longitude: 103.8319, AvailableLots: 135, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '10', Area: 'Orchard', Development: 'Ngee Ann City (Takashimaya)', latitude: 1.3025, longitude: 103.8346, AvailableLots: 220, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '11', Area: 'Orchard', Development: 'Paragon Shopping Centre', latitude: 1.3039, longitude: 103.8358, AvailableLots: 94, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '12', Area: 'Orchard', Development: '313@somerset', latitude: 1.3009, longitude: 103.8384, AvailableLots: 76, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '13', Area: 'Orchard', Development: 'Orchard Gateway', latitude: 1.3006, longitude: 103.8392, AvailableLots: 52, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '14', Area: 'Orchard', Development: 'Plaza Singapura', latitude: 1.3007, longitude: 103.8450, AvailableLots: 304, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '15', Area: 'Orchard', Development: 'Wheelock Place', latitude: 1.3049, longitude: 103.8306, AvailableLots: 62, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '16', Area: 'Orchard', Development: 'Tang Plaza', latitude: 1.3051, longitude: 103.8331, AvailableLots: 45, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '17', Area: 'Bugis', Development: 'Bugis Junction Multi-Storey', latitude: 1.2998, longitude: 103.8554, AvailableLots: 142, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '18', Area: 'Bugis', Development: 'Bugis+', latitude: 1.3007, longitude: 103.8546, AvailableLots: 89, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '19', Area: 'Bugis', Development: 'DUO Galleria & Tower', latitude: 1.3002, longitude: 103.8578, AvailableLots: 178, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-B1', Area: 'Bugis', Development: 'HDB Albert Centre MSCP (Blk 270 Queen St)', latitude: 1.3011, longitude: 103.8538, AvailableLots: 33, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '20', Area: 'Chinatown', Development: 'Chinatown Point Carpark', latitude: 1.2843, longitude: 103.8437, AvailableLots: 115, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-CN1', Area: 'Chinatown', Development: 'HDB Chinatown Complex (Blk 335 Smith St)', latitude: 1.2825, longitude: 103.8435, AvailableLots: 48, LotType: 'C', Agency: 'HDB' },
  { CarParkID: 'HDB-CN2', Area: 'Chinatown', Development: 'HDB The Pinnacle@Duxton (1G Cantonment Rd)', latitude: 1.2789, longitude: 103.8415, AvailableLots: 124, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '21', Area: 'Chinatown', Development: 'People’s Park Centre', latitude: 1.2862, longitude: 103.8435, AvailableLots: 68, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '22', Area: 'HarbourFront', Development: 'VivoCity Multi-Storey & Basement', latitude: 1.2644, longitude: 103.8222, AvailableLots: 560, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '23', Area: 'HarbourFront', Development: 'HarbourFront Centre', latitude: 1.2640, longitude: 103.8202, AvailableLots: 210, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '24', Area: 'Sentosa', Development: 'Resorts World Sentosa B1 Car Park', latitude: 1.2562, longitude: 103.8205, AvailableLots: 780, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-TP1', Area: 'Toa Payoh', Development: 'HDB Hub Multi-Storey (Lorong 6 Toa Payoh)', latitude: 1.3323, longitude: 103.8480, AvailableLots: 310, LotType: 'C', Agency: 'HDB' },
  { CarParkID: 'HDB-TP2', Area: 'Toa Payoh', Development: 'HDB Blk 177 Toa Payoh Central Basement', latitude: 1.3338, longitude: 103.8495, AvailableLots: 74, LotType: 'C', Agency: 'HDB' },
  { CarParkID: 'HDB-TP3', Area: 'Toa Payoh', Development: 'HDB Blk 84 Lorong 2 Toa Payoh MSCP', latitude: 1.3355, longitude: 103.8462, AvailableLots: 145, LotType: 'C', Agency: 'HDB' },
  { CarParkID: 'HDB-AMK1', Area: 'Ang Mo Kio', Development: 'AMK Hub Multi-Storey', latitude: 1.3691, longitude: 103.8485, AvailableLots: 195, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-AMK2', Area: 'Ang Mo Kio', Development: 'HDB Blk 712 Ang Mo Kio Ave 6 MSCP', latitude: 1.3712, longitude: 103.8472, AvailableLots: 88, LotType: 'C', Agency: 'HDB' },
  { CarParkID: 'HDB-AMK3', Area: 'Ang Mo Kio', Development: 'HDB Blk 410 Ang Mo Kio Ave 10 MSCP', latitude: 1.3625, longitude: 103.8550, AvailableLots: 132, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '25', Area: 'Jurong East', Development: 'JEM Shopping Mall Carpark', latitude: 1.3335, longitude: 103.7431, AvailableLots: 245, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '26', Area: 'Jurong East', Development: 'Westgate Shopping Mall Carpark', latitude: 1.3342, longitude: 103.7423, AvailableLots: 198, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '27', Area: 'Jurong East', Development: 'IMM Building Carpark', latitude: 1.3353, longitude: 103.7471, AvailableLots: 380, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '27-H', Area: 'Jurong East', Development: 'IMM Heavy Vehicle Bay', latitude: 1.3353, longitude: 103.7471, AvailableLots: 25, LotType: 'H', Agency: 'LTA' },
  { CarParkID: 'HDB-JE1', Area: 'Jurong East', Development: 'HDB Blk 135 Jurong Gateway MSCP', latitude: 1.3350, longitude: 103.7408, AvailableLots: 82, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '28', Area: 'Tampines', Development: 'Tampines 1 Shopping Mall', latitude: 1.3541, longitude: 103.9452, AvailableLots: 110, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '29', Area: 'Tampines', Development: 'Tampines Mall Basement Carpark', latitude: 1.3526, longitude: 103.9449, AvailableLots: 145, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-TM1', Area: 'Tampines', Development: 'Our Tampines Hub (OTH) Integrated Carpark', latitude: 1.3532, longitude: 103.9405, AvailableLots: 380, LotType: 'C', Agency: 'HDB' },
  { CarParkID: 'HDB-TM2', Area: 'Tampines', Development: 'HDB Blk 842 Tampines St 82 MSCP', latitude: 1.3512, longitude: 103.9360, AvailableLots: 165, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '30', Area: 'Bedok', Development: 'Bedok Mall Basement Carpark', latitude: 1.3240, longitude: 103.9300, AvailableLots: 190, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-BD1', Area: 'Bedok', Development: 'HDB Blk 207 Bedok North St 1 MSCP', latitude: 1.3255, longitude: 103.9315, AvailableLots: 92, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '31', Area: 'Woodlands', Development: 'Causeway Point Shopping Centre', latitude: 1.4361, longitude: 103.7858, AvailableLots: 220, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-WL1', Area: 'Woodlands', Development: 'HDB Blk 306A Woodlands St 31 MSCP', latitude: 1.4312, longitude: 103.7745, AvailableLots: 140, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '32', Area: 'Changi', Development: 'Jewel Changi Airport (Carpark 2B/2M)', latitude: 1.3602, longitude: 103.9897, AvailableLots: 495, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '33', Area: 'Changi', Development: 'Changi Airport Terminal 3 Carpark 3B', latitude: 1.3553, longitude: 103.9868, AvailableLots: 360, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '34', Area: 'Paya Lebar', Development: 'Paya Lebar Quarter (PLQ Mall)', latitude: 1.3175, longitude: 103.8927, AvailableLots: 320, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '35', Area: 'Paya Lebar', Development: 'SingPost Centre Carpark', latitude: 1.3188, longitude: 103.8950, AvailableLots: 140, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '36', Area: 'Clementi', Development: 'The Clementi Mall Carpark', latitude: 1.3151, longitude: 103.7651, AvailableLots: 130, LotType: 'C', Agency: 'LTA' },
  { CarParkID: 'HDB-CL1', Area: 'Clementi', Development: 'HDB Blk 440 Clementi Ave 3 MSCP', latitude: 1.3135, longitude: 103.7640, AvailableLots: 86, LotType: 'C', Agency: 'HDB' },
  { CarParkID: '37', Area: 'Novena', Development: 'Velocity@Novena Square', latitude: 1.3204, longitude: 103.8438, AvailableLots: 165, LotType: 'C', Agency: 'LTA' },
  { CarParkID: '38', Area: 'Novena', Development: 'Square 2 Novena Carpark', latitude: 1.3211, longitude: 103.8446, AvailableLots: 98, LotType: 'C', Agency: 'LTA' }
];

// 1. API: Get Carparks
app.get('/api/carparks', async (req, res) => {
  const accountKey = (req.headers['x-account-key'] as string) || process.env.LTA_ACCOUNT_KEY || '';
  const isKeyPresent = Boolean(accountKey && accountKey.trim().length > 5);

  let carparks: ParsedCarpark[] = [];
  let source: 'lta_datamall' | 'fallback_demo' = 'fallback_demo';
  let message: string | undefined;

  const now = Date.now();

  if (isKeyPresent) {
    if (cachedCarparks.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
      carparks = cachedCarparks;
      source = 'lta_datamall';
    } else {
      try {
        const liveItems = await fetchFromLtaDataMall(accountKey);
        if (liveItems.length > 0) {
          cachedCarparks = liveItems;
          lastFetchTime = now;
          carparks = liveItems;
          source = 'lta_datamall';
        } else {
          carparks = FALLBACK_DATA;
          message = 'LTA DataMall returned empty records; using verified SG fallback data.';
        }
      } catch (err: unknown) {
        console.error('Error fetching LTA DataMall:', err);
        carparks = cachedCarparks.length > 0 ? cachedCarparks : FALLBACK_DATA;
        source = cachedCarparks.length > 0 ? 'lta_datamall' : 'fallback_demo';
        message = `LTA API error: ${err instanceof Error ? err.message : 'Unknown error'}. Using offline cache/fallback.`;
      }
    }
  } else {
    // Generate slight real-time fluctuations to simulate live changes
    const minuteFactor = (new Date().getMinutes() % 7) - 3;
    carparks = FALLBACK_DATA.map((cp, idx) => {
      const delta = ((idx * 3 + minuteFactor) % 9) - 4;
      const lots = Math.max(0, cp.AvailableLots + delta);
      return { ...cp, AvailableLots: lots };
    });
    source = 'fallback_demo';
    message = 'Demo mode active. Provide LTA_ACCOUNT_KEY in .env or settings for live government feed.';
  }

  // Handle optional spatial filtering/sorting
  const latStr = req.query.lat as string;
  const lngStr = req.query.lng as string;
  const userLat = latStr ? parseFloat(latStr) : NaN;
  const userLng = lngStr ? parseFloat(lngStr) : NaN;

  let resultWithDistance = carparks.map((cp) => {
    let distance: number | undefined;
    if (!isNaN(userLat) && !isNaN(userLng)) {
      distance = getDistanceFromLatLonInMeters(userLat, userLng, cp.latitude, cp.longitude);
    }
    return { ...cp, distance };
  });

  // Filter by lotType if provided
  const lotType = req.query.lotType as string;
  if (lotType && lotType !== 'ALL') {
    resultWithDistance = resultWithDistance.filter((c) => c.LotType === lotType);
  }

  // Filter by agency if provided
  const agency = req.query.agency as string;
  if (agency && agency !== 'ALL') {
    resultWithDistance = resultWithDistance.filter((c) => c.Agency.toUpperCase() === agency.toUpperCase());
  }

  // Filter by search text if provided
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (query) {
    resultWithDistance = resultWithDistance.filter((c) =>
      c.Development.toLowerCase().includes(query) ||
      c.Area.toLowerCase().includes(query) ||
      c.CarParkID.toLowerCase().includes(query)
    );
  }

  // Sort by distance if coordinates provided
  if (!isNaN(userLat) && !isNaN(userLng)) {
    resultWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  res.json({
    success: true,
    source,
    total: resultWithDistance.length,
    timestamp: new Date().toISOString(),
    keyConfigured: isKeyPresent,
    message,
    value: resultWithDistance,
  });
});

// 2. API: Geocode Singapore places via OneMap SG or OpenStreetMap Nominatim
app.get('/api/geocode', async (req, res) => {
  const q = (req.query.q as string || '').trim();
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    // Try OneMap Singapore public search first
    const onemapUrl = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(q)}&returnGeom=Y&getAddrDetails=Y`;
    const response = await fetch(onemapUrl, {
      headers: {
        'User-Agent': 'SGCarParkApp/1.0',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json() as {
        found?: number;
        results?: Array<{
          SEARCHVAL: string;
          LATITUDE: string;
          LONGITUDE: string;
          ADDRESS?: string;
          POSTAL?: string;
        }>;
      };

      if (data.results && data.results.length > 0) {
        const mapped = data.results.slice(0, 6).map((item) => ({
          name: item.SEARCHVAL,
          latitude: parseFloat(item.LATITUDE),
          longitude: parseFloat(item.LONGITUDE),
          address: item.ADDRESS || item.SEARCHVAL,
          postalCode: item.POSTAL,
        }));
        return res.json({ results: mapped });
      }
    }
  } catch (err) {
    console.warn('OneMap search error, falling back to Nominatim:', err);
  }

  // Fallback to OpenStreetMap Nominatim with Singapore bounding box
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=sg&q=${encodeURIComponent(q)}&limit=5`;
    const nomRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'SGCarParkApp/1.0',
        'Accept': 'application/json',
      },
    });

    if (nomRes.ok) {
      const nomData = await nomRes.json() as Array<{
        display_name: string;
        lat: string;
        lon: string;
      }>;
      const mapped = nomData.map((item) => ({
        name: item.display_name.split(',')[0],
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        address: item.display_name,
      }));
      return res.json({ results: mapped });
    }
  } catch (err) {
    console.warn('Nominatim geocode failed:', err);
  }

  // Default empty list
  res.json({ results: [] });
});

// 3. API: Status & Key configuration check
app.get('/api/status', (req, res) => {
  const accountKey = process.env.LTA_ACCOUNT_KEY || '';
  res.json({
    status: 'ok',
    hasKey: Boolean(accountKey && accountKey.trim().length > 5),
    cachedCount: cachedCarparks.length,
    lastUpdated: lastFetchTime > 0 ? new Date(lastFetchTime).toISOString() : null,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SG CarPark server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
