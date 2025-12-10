export type AirQualityStatus = 'Good' | 'Moderate' | 'Hazardous';

export interface City {
  id: string;
  name: string;
  code: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  stations: string[];
  lastUpdate: string;
  modelVersion: string;
}

export interface Measurement {
  datetime: string;
  pm25: number;
  no2: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  rainfall?: number;
}

export interface Prediction {
  status: AirQualityStatus;
  confidence: number;
  probabilities: {
    good: number;
    moderate: number;
    hazardous: number;
  };
  pm25: number;
  no2: number;
  timestamp: string;
  modelVersion: string;
}

export interface TimeSeriesDataPoint {
  datetime: string;
  pm25: number;
  no2: number;
}

export interface CityData {
  city: City;
  measurements: Measurement[];
  timeSeries: TimeSeriesDataPoint[];
  latestPrediction: Prediction | null;
}
