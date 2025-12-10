import axios from 'axios';

// API base URL - change this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on your backend response
export interface City {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  stations: string[];
}

export interface Measurement {
  datetime: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface AirQualityPrediction {
  cityId: string;
  cityName: string;
  aqi_value: number;
  aqi_class: number;
  status: string;
  timestamp: string;
}

export interface CityDataResponse {
  cityId: string;
  timeSeries: TimeSeriesDataPoint[];
  measurements: Measurement[];
}

// API Functions
export const apiService = {
  // Health check
  checkHealth: () => api.get('/api/health').then(res => res.data),

  // Get all cities
  getCities: () => 
    api.get('/api/cities').then(res => ({
      data: res.data.data as City[],
      count: res.data.count,
    })),

  // Get city data
  getCityData: (cityId: string): Promise<CityDataResponse> =>
    api.get(`/api/city_data?cityId=${cityId}`).then(res => {
      const data = res.data;
      
      // Transform backend response to match your frontend types
      const measurements: Measurement[] = data.measurements.map((m: any) => ({
        datetime: new Date().toISOString(),
        pm25: m.label.includes('PM2.5') ? m.value : 0,
        pm10: m.label.includes('PM10') ? m.value : 0,
        no2: m.label.includes('NO₂') ? m.value : 0,
        o3: m.label.includes('O₃') ? m.value : 0,
        temperature: 28 + Math.random() * 4, // Mock temp
        humidity: 60 + Math.random() * 20, // Mock humidity
        windSpeed: 2 + Math.random() * 5, // Mock wind speed
      }));

      const timeSeries: TimeSeriesDataPoint[] = data.timeSeries.map((ts: any) => ({
        timestamp: ts.timestamp,
        pm25: ts.pm25,
        pm10: ts.pm10,
        no2: ts.no2,
        o3: ts.o3,
      }));

      return {
        cityId: data.cityId,
        timeSeries,
        measurements,
      };
    }),

  // Get prediction
  getPrediction: (cityId: string, cityName: string): Promise<AirQualityPrediction> =>
    api.get(`/api/predict?cityId=${cityId}&cityName=${cityName}`).then(res => res.data),

  // Get model info
  getModelInfo: () => api.get('/api/model/info').then(res => res.data),

  // Custom prediction with sensor data
  predictCustom: (features: number[]) =>
    api.post('/api/predict/custom', { features }).then(res => res.data),
};

export default apiService;