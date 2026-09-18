import { Carpark, SearchLocation } from '../types';

export const POPULAR_SG_LOCATIONS: SearchLocation[] = [
  { name: 'Orchard Road', latitude: 1.3048, longitude: 103.8318, address: 'Orchard Rd, Singapore' },
  { name: 'Marina Bay Sands', latitude: 1.2838, longitude: 103.8591, address: '10 Bayfront Ave, Singapore 018956' },
  { name: 'Suntec City / Marina', latitude: 1.2935, longitude: 103.8572, address: '3 Temasek Blvd, Singapore 038983' },
  { name: 'Bugis Junction', latitude: 1.2998, longitude: 103.8554, address: '200 Victoria St, Singapore 188021' },
  { name: 'Raffles Place (CBD)', latitude: 1.2830, longitude: 103.8519, address: 'Raffles Place, Singapore 048618' },
  { name: 'Chinatown Point', latitude: 1.2843, longitude: 103.8437, address: '133 New Bridge Rd, Singapore 059413' },
  { name: 'VivoCity', latitude: 1.2644, longitude: 103.8222, address: '1 HarbourFront Walk, Singapore 098585' },
  { name: 'Jewel Changi Airport', latitude: 1.3602, longitude: 103.9897, address: '78 Airport Blvd., Singapore 819666' },
  { name: 'Jurong East (JEM/Westgate)', latitude: 1.3331, longitude: 103.7436, address: 'Jurong Gateway Rd, Singapore' },
  { name: 'Our Tampines Hub', latitude: 1.3532, longitude: 103.9452, address: '1 Tampines Walk, Singapore 528523' },
  { name: 'Toa Payoh HDB Hub', latitude: 1.3323, longitude: 103.8480, address: '480 Lor 6 Toa Payoh, Singapore 310480' },
  { name: 'Ang Mo Kio Hub', latitude: 1.3691, longitude: 103.8485, address: '53 Ang Mo Kio Ave 3, Singapore 569933' },
  { name: 'Woodlands Square', latitude: 1.4361, longitude: 103.7865, address: 'Woodlands Square, Singapore' },
  { name: 'Bedok Mall', latitude: 1.3240, longitude: 103.9300, address: '311 New Upper Changi Rd, Singapore 467360' },
  { name: 'Paya Lebar Quarter', latitude: 1.3175, longitude: 103.8927, address: '10 Paya Lebar Rd, Singapore 409057' },
  { name: 'Clarke Quay Central', latitude: 1.2887, longitude: 103.8467, address: '6 Eu Tong Sen St, Singapore 059817' },
  { name: 'Novena Square', latitude: 1.3204, longitude: 103.8438, address: '238 Thomson Rd, Singapore 307683' },
];

export const FALLBACK_SG_CARPARKS: Carpark[] = [
  // Marina / Downtown / Suntec
  {
    CarParkID: '1',
    Area: 'Marina',
    Development: 'Suntec City Mall (Basement 1 & 2)',
    latitude: 1.29375,
    longitude: 103.85718,
    AvailableLots: 428,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '1-M',
    Area: 'Marina',
    Development: 'Suntec City Mall (Motorcycle Bay)',
    latitude: 1.29375,
    longitude: 103.85718,
    AvailableLots: 64,
    LotType: 'Y',
    Agency: 'LTA'
  },
  {
    CarParkID: '2',
    Area: 'Marina',
    Development: 'Marina Bay Sands Integrated Resort',
    latitude: 1.2838,
    longitude: 103.8591,
    AvailableLots: 312,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '3',
    Area: 'Marina',
    Development: 'Millenia Singapore / Conrad Centennial',
    latitude: 1.2929,
    longitude: 103.8598,
    AvailableLots: 195,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '4',
    Area: 'Marina',
    Development: 'Marina Square Shopping Centre',
    latitude: 1.2912,
    longitude: 103.8564,
    AvailableLots: 182,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '5',
    Area: 'Marina',
    Development: 'Esplanade - Theatres on the Bay',
    latitude: 1.2898,
    longitude: 103.8558,
    AvailableLots: 88,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '6',
    Area: 'Marina',
    Development: 'Raffles City Shopping Centre',
    latitude: 1.2939,
    longitude: 103.8533,
    AvailableLots: 240,
    LotType: 'C',
    Agency: 'LTA'
  },
  // CBD / Raffles Place / URA
  {
    CarParkID: 'URA-01',
    Area: 'Downtown Core',
    Development: 'URA Market Street Carpark / CapitaSpring',
    latitude: 1.2842,
    longitude: 103.8504,
    AvailableLots: 42,
    LotType: 'C',
    Agency: 'URA'
  },
  {
    CarParkID: 'URA-02',
    Area: 'Downtown Core',
    Development: 'URA Telok Ayer Street (Kerbside Lots)',
    latitude: 1.2809,
    longitude: 103.8475,
    AvailableLots: 14,
    LotType: 'C',
    Agency: 'URA'
  },
  {
    CarParkID: 'URA-03',
    Area: 'Downtown Core',
    Development: 'Amoy Street / URA Open-Air Surface Lots',
    latitude: 1.2802,
    longitude: 103.8468,
    AvailableLots: 8,
    LotType: 'C',
    Agency: 'URA'
  },
  {
    CarParkID: '7',
    Area: 'CBD',
    Development: 'One Raffles Quay Multi-Storey',
    latitude: 1.2818,
    longitude: 103.8523,
    AvailableLots: 110,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '8',
    Area: 'CBD',
    Development: 'Marina Bay Financial Centre Tower 1 & 2',
    latitude: 1.2796,
    longitude: 103.8539,
    AvailableLots: 165,
    LotType: 'C',
    Agency: 'LTA'
  },
  // Orchard Road Area
  {
    CarParkID: '9',
    Area: 'Orchard',
    Development: 'ION Orchard Shopping Centre',
    latitude: 1.3040,
    longitude: 103.8319,
    AvailableLots: 135,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '10',
    Area: 'Orchard',
    Development: 'Ngee Ann City (Takashimaya)',
    latitude: 1.3025,
    longitude: 103.8346,
    AvailableLots: 220,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '11',
    Area: 'Orchard',
    Development: 'Paragon Shopping Centre',
    latitude: 1.3039,
    longitude: 103.8358,
    AvailableLots: 94,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '12',
    Area: 'Orchard',
    Development: '313@somerset',
    latitude: 1.3009,
    longitude: 103.8384,
    AvailableLots: 76,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '13',
    Area: 'Orchard',
    Development: 'Orchard Gateway',
    latitude: 1.3006,
    longitude: 103.8392,
    AvailableLots: 52,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '14',
    Area: 'Orchard',
    Development: 'Plaza Singapura / The Atrium@Orchard',
    latitude: 1.3007,
    longitude: 103.8450,
    AvailableLots: 304,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '15',
    Area: 'Orchard',
    Development: 'Wheelock Place',
    latitude: 1.3049,
    longitude: 103.8306,
    AvailableLots: 62,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '16',
    Area: 'Orchard',
    Development: 'Tang Plaza',
    latitude: 1.3051,
    longitude: 103.8331,
    AvailableLots: 45,
    LotType: 'C',
    Agency: 'LTA'
  },
  // Bugis / Bras Basah
  {
    CarParkID: '17',
    Area: 'Bugis',
    Development: 'Bugis Junction Multi-Storey',
    latitude: 1.2998,
    longitude: 103.8554,
    AvailableLots: 142,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '18',
    Area: 'Bugis',
    Development: 'Bugis+ (formerly Iluma)',
    latitude: 1.3007,
    longitude: 103.8546,
    AvailableLots: 89,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '19',
    Area: 'Bugis',
    Development: 'DUO Galleria & Tower',
    latitude: 1.3002,
    longitude: 103.8578,
    AvailableLots: 178,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-B1',
    Area: 'Bugis/Rochor',
    Development: 'HDB Albert Centre Multi-Storey Car Park (Blk 270 Queen St)',
    latitude: 1.3011,
    longitude: 103.8538,
    AvailableLots: 33,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: 'HDB-B1-M',
    Area: 'Bugis/Rochor',
    Development: 'HDB Albert Centre Motorcycle Lots (Blk 270 Queen St)',
    latitude: 1.3011,
    longitude: 103.8538,
    AvailableLots: 22,
    LotType: 'Y',
    Agency: 'HDB'
  },
  // Chinatown
  {
    CarParkID: '20',
    Area: 'Chinatown',
    Development: 'Chinatown Point Carpark',
    latitude: 1.2843,
    longitude: 103.8437,
    AvailableLots: 115,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-CN1',
    Area: 'Chinatown',
    Development: 'HDB Chinatown Complex Multi-Storey (Blk 335 Smith St)',
    latitude: 1.2825,
    longitude: 103.8435,
    AvailableLots: 48,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: 'HDB-CN2',
    Area: 'Chinatown/Tanjong Pagar',
    Development: 'HDB The Pinnacle@Duxton (1G Cantonment Rd)',
    latitude: 1.2789,
    longitude: 103.8415,
    AvailableLots: 124,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: '21',
    Area: 'Chinatown',
    Development: 'People’s Park Centre',
    latitude: 1.2862,
    longitude: 103.8435,
    AvailableLots: 68,
    LotType: 'C',
    Agency: 'LTA'
  },
  // HarbourFront / VivoCity / Sentosa
  {
    CarParkID: '22',
    Area: 'HarbourFront',
    Development: 'VivoCity Multi-Storey & Basement',
    latitude: 1.2644,
    longitude: 103.8222,
    AvailableLots: 560,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '23',
    Area: 'HarbourFront',
    Development: 'HarbourFront Centre',
    latitude: 1.2640,
    longitude: 103.8202,
    AvailableLots: 210,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '24',
    Area: 'Sentosa',
    Development: 'Resorts World Sentosa B1 Car Park',
    latitude: 1.2562,
    longitude: 103.8205,
    AvailableLots: 780,
    LotType: 'C',
    Agency: 'LTA'
  },
  // Toa Payoh (HDB central)
  {
    CarParkID: 'HDB-TP1',
    Area: 'Toa Payoh',
    Development: 'HDB Hub Multi-Storey Carpark (Lorong 6 Toa Payoh)',
    latitude: 1.3323,
    longitude: 103.8480,
    AvailableLots: 310,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: 'HDB-TP2',
    Area: 'Toa Payoh',
    Development: 'HDB Blk 177 Toa Payoh Central Basement',
    latitude: 1.3338,
    longitude: 103.8495,
    AvailableLots: 74,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: 'HDB-TP3',
    Area: 'Toa Payoh',
    Development: 'HDB Blk 84 Lorong 2 Toa Payoh Multi-Storey',
    latitude: 1.3355,
    longitude: 103.8462,
    AvailableLots: 145,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Ang Mo Kio
  {
    CarParkID: 'HDB-AMK1',
    Area: 'Ang Mo Kio',
    Development: 'AMK Hub Multi-Storey (53 Ang Mo Kio Ave 3)',
    latitude: 1.3691,
    longitude: 103.8485,
    AvailableLots: 195,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-AMK2',
    Area: 'Ang Mo Kio',
    Development: 'HDB Blk 712 Ang Mo Kio Ave 6 MSCP',
    latitude: 1.3712,
    longitude: 103.8472,
    AvailableLots: 88,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: 'HDB-AMK3',
    Area: 'Ang Mo Kio',
    Development: 'HDB Blk 410 Ang Mo Kio Ave 10 MSCP',
    latitude: 1.3625,
    longitude: 103.8550,
    AvailableLots: 132,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Jurong East / West
  {
    CarParkID: '25',
    Area: 'Jurong East',
    Development: 'JEM Shopping Mall Carpark',
    latitude: 1.3335,
    longitude: 103.7431,
    AvailableLots: 245,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '26',
    Area: 'Jurong East',
    Development: 'Westgate Shopping Mall Carpark',
    latitude: 1.3342,
    longitude: 103.7423,
    AvailableLots: 198,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '27',
    Area: 'Jurong East',
    Development: 'IMM Building (Car & Heavy Vehicle)',
    latitude: 1.3353,
    longitude: 103.7471,
    AvailableLots: 380,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '27-H',
    Area: 'Jurong East',
    Development: 'IMM Building Heavy Vehicle Loading Bay',
    latitude: 1.3353,
    longitude: 103.7471,
    AvailableLots: 25,
    LotType: 'H',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-JE1',
    Area: 'Jurong East',
    Development: 'HDB Blk 135 Jurong Gateway Multi-Storey',
    latitude: 1.3350,
    longitude: 103.7408,
    AvailableLots: 82,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Tampines
  {
    CarParkID: '28',
    Area: 'Tampines',
    Development: 'Tampines 1 Shopping Mall',
    latitude: 1.3541,
    longitude: 103.9452,
    AvailableLots: 110,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '29',
    Area: 'Tampines',
    Development: 'Tampines Mall Basement Carpark',
    latitude: 1.3526,
    longitude: 103.9449,
    AvailableLots: 145,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-TM1',
    Area: 'Tampines',
    Development: 'Our Tampines Hub (OTH) Integrated Carpark',
    latitude: 1.3532,
    longitude: 103.9405,
    AvailableLots: 380,
    LotType: 'C',
    Agency: 'HDB'
  },
  {
    CarParkID: 'HDB-TM2',
    Area: 'Tampines',
    Development: 'HDB Blk 842 Tampines St 82 MSCP',
    latitude: 1.3512,
    longitude: 103.9360,
    AvailableLots: 165,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Bedok
  {
    CarParkID: '30',
    Area: 'Bedok',
    Development: 'Bedok Mall Basement Carpark',
    latitude: 1.3240,
    longitude: 103.9300,
    AvailableLots: 190,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-BD1',
    Area: 'Bedok',
    Development: 'HDB Blk 207 Bedok North St 1 MSCP',
    latitude: 1.3255,
    longitude: 103.9315,
    AvailableLots: 92,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Woodlands
  {
    CarParkID: '31',
    Area: 'Woodlands',
    Development: 'Causeway Point Shopping Centre',
    latitude: 1.4361,
    longitude: 103.7858,
    AvailableLots: 220,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-WL1',
    Area: 'Woodlands',
    Development: 'HDB Blk 306A Woodlands St 31 MSCP',
    latitude: 1.4312,
    longitude: 103.7745,
    AvailableLots: 140,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Changi Airport / Jewel
  {
    CarParkID: '32',
    Area: 'Changi',
    Development: 'Jewel Changi Airport (General Carpark 2B/2M)',
    latitude: 1.3602,
    longitude: 103.9897,
    AvailableLots: 495,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '33',
    Area: 'Changi',
    Development: 'Changi Airport Terminal 3 Carpark 3B',
    latitude: 1.3553,
    longitude: 103.9868,
    AvailableLots: 360,
    LotType: 'C',
    Agency: 'LTA'
  },
  // Paya Lebar
  {
    CarParkID: '34',
    Area: 'Paya Lebar',
    Development: 'Paya Lebar Quarter (PLQ Mall & Towers)',
    latitude: 1.3175,
    longitude: 103.8927,
    AvailableLots: 320,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '35',
    Area: 'Paya Lebar',
    Development: 'SingPost Centre Carpark',
    latitude: 1.3188,
    longitude: 103.8950,
    AvailableLots: 140,
    LotType: 'C',
    Agency: 'LTA'
  },
  // Clementi
  {
    CarParkID: '36',
    Area: 'Clementi',
    Development: 'The Clementi Mall Carpark',
    latitude: 1.3151,
    longitude: 103.7651,
    AvailableLots: 130,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: 'HDB-CL1',
    Area: 'Clementi',
    Development: 'HDB Blk 440 Clementi Ave 3 MSCP',
    latitude: 1.3135,
    longitude: 103.7640,
    AvailableLots: 86,
    LotType: 'C',
    Agency: 'HDB'
  },
  // Novena
  {
    CarParkID: '37',
    Area: 'Novena',
    Development: 'Velocity@Novena Square',
    latitude: 1.3204,
    longitude: 103.8438,
    AvailableLots: 165,
    LotType: 'C',
    Agency: 'LTA'
  },
  {
    CarParkID: '38',
    Area: 'Novena',
    Development: 'Square 2 Novena Carpark',
    latitude: 1.3211,
    longitude: 103.8446,
    AvailableLots: 98,
    LotType: 'C',
    Agency: 'LTA'
  }
];
