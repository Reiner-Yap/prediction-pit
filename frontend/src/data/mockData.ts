import { City, Measurement, Prediction, TimeSeriesDataPoint, AirQualityStatus } from '@/types/airQuality';

export const cities: City[] = [
  {
    id: 'metro-manila',
    name: 'Metro Manila',
    code: 'NCR',
    region: 'National Capital Region',
    latitude: 14.5995,
    longitude: 120.9842,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-NCR-001', 'DENR-EMB-NCR-002', 'DENR-EMB-NCR-003'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'cebu',
    name: 'Cebu City',
    code: 'CEB',
    region: 'Central Visayas',
    latitude: 10.3157,
    longitude: 123.8854,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-VII-001', 'DENR-EMB-VII-002'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'davao',
    name: 'Davao City',
    code: 'DVO',
    region: 'Davao Region',
    latitude: 7.1907,
    longitude: 125.4553,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-XI-001', 'DENR-EMB-XI-002'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'baguio',
    name: 'Baguio City',
    code: 'BAG',
    region: 'Cordillera Administrative Region',
    latitude: 16.4023,
    longitude: 120.5960,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-CAR-001'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'iloilo',
    name: 'Iloilo City',
    code: 'ILO',
    region: 'Western Visayas',
    latitude: 10.7202,
    longitude: 122.5621,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-VI-001'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'cagayan-de-oro',
    name: 'Cagayan de Oro',
    code: 'CDO',
    region: 'Northern Mindanao',
    latitude: 8.4542,
    longitude: 124.6319,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-X-001'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'zamboanga',
    name: 'Zamboanga City',
    code: 'ZAM',
    region: 'Zamboanga Peninsula',
    latitude: 6.9214,
    longitude: 122.0790,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-IX-001'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
  {
    id: 'general-santos',
    name: 'General Santos',
    code: 'GEN',
    region: 'SOCCSKSARGEN',
    latitude: 6.1164,
    longitude: 125.1716,
    timezone: 'Asia/Manila',
    stations: ['DENR-EMB-XII-001'],
    lastUpdate: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  },
];

// Generate realistic time series data for 72 hours
function generateTimeSeries(cityId: string, hours: number = 72): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  
  // City-specific base values and patterns
  const cityPatterns: Record<string, { basePm25: number; baseNo2: number; variance: number }> = {
    'metro-manila': { basePm25: 45, baseNo2: 28, variance: 15 },
    'cebu': { basePm25: 32, baseNo2: 22, variance: 10 },
    'davao': { basePm25: 25, baseNo2: 18, variance: 8 },
    'baguio': { basePm25: 15, baseNo2: 12, variance: 5 },
    'iloilo': { basePm25: 28, baseNo2: 20, variance: 8 },
    'cagayan-de-oro': { basePm25: 22, baseNo2: 16, variance: 6 },
    'zamboanga': { basePm25: 20, baseNo2: 14, variance: 5 },
    'general-santos': { basePm25: 18, baseNo2: 13, variance: 5 },
  };

  const pattern = cityPatterns[cityId] || cityPatterns['metro-manila'];

  for (let i = hours; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = date.getHours();
    
    // Simulate daily pattern (higher during rush hours)
    const rushHourMultiplier = 
      (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20) ? 1.3 : 
      (hour >= 10 && hour <= 16) ? 1.1 : 0.8;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    data.push({
      datetime: date.toISOString(),
      pm25: Math.max(5, pattern.basePm25 * rushHourMultiplier * randomFactor + (Math.random() - 0.5) * pattern.variance),
      no2: Math.max(3, pattern.baseNo2 * rushHourMultiplier * randomFactor + (Math.random() - 0.5) * pattern.variance * 0.7),
    });
  }
  
  return data;
}

function generateMeasurements(cityId: string): Measurement[] {
  const timeSeries = generateTimeSeries(cityId, 24);
  return timeSeries.map(ts => ({
    ...ts,
    temperature: 26 + Math.random() * 8,
    humidity: 60 + Math.random() * 30,
    windSpeed: 2 + Math.random() * 8,
    rainfall: Math.random() > 0.8 ? Math.random() * 10 : 0,
  }));
}

function determineStatus(pm25: number): AirQualityStatus {
  if (pm25 <= 25) return 'Good';
  if (pm25 <= 50) return 'Moderate';
  return 'Hazardous';
}

function generatePrediction(cityId: string): Prediction {
  const timeSeries = generateTimeSeries(cityId, 1);
  const latest = timeSeries[timeSeries.length - 1];
  const status = determineStatus(latest.pm25);
  
  // Generate probabilities based on current values
  let probs = { good: 0, moderate: 0, hazardous: 0 };
  
  if (status === 'Good') {
    probs = { good: 0.7 + Math.random() * 0.2, moderate: 0.1 + Math.random() * 0.15, hazardous: 0.02 + Math.random() * 0.05 };
  } else if (status === 'Moderate') {
    probs = { good: 0.15 + Math.random() * 0.15, moderate: 0.55 + Math.random() * 0.25, hazardous: 0.1 + Math.random() * 0.15 };
  } else {
    probs = { good: 0.02 + Math.random() * 0.05, moderate: 0.15 + Math.random() * 0.15, hazardous: 0.65 + Math.random() * 0.25 };
  }
  
  // Normalize
  const total = probs.good + probs.moderate + probs.hazardous;
  probs.good /= total;
  probs.moderate /= total;
  probs.hazardous /= total;
  
  return {
    status,
    confidence: Math.max(probs.good, probs.moderate, probs.hazardous),
    probabilities: probs,
    pm25: latest.pm25,
    no2: latest.no2,
    timestamp: new Date().toISOString(),
    modelVersion: 'v1.2.0',
  };
}

export function getCityData(cityId: string): {
  city: City;
  timeSeries: TimeSeriesDataPoint[];
  measurements: Measurement[];
} {
  const city = cities.find(c => c.id === cityId) || cities[0];
  return {
    city,
    timeSeries: generateTimeSeries(cityId, 72),
    measurements: generateMeasurements(cityId),
  };
}

export function getPrediction(cityId: string): Prediction {
  return generatePrediction(cityId);
}

export function getAllCities(): City[] {
  return cities;
}
