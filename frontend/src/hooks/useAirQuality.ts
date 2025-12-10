import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, City, CityDataResponse, AirQualityPrediction } from '@/services/api';

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: apiService.getCities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCityData = (cityId: string) => {
  return useQuery({
    queryKey: ['cityData', cityId],
    queryFn: () => apiService.getCityData(cityId),
    enabled: !!cityId,
  });
};

export const usePrediction = (cityId: string, cityName: string) => {
  return useQuery({
    queryKey: ['prediction', cityId],
    queryFn: () => apiService.getPrediction(cityId, cityName),
    enabled: !!cityId && !!cityName,
  });
};

export const useGeneratePrediction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cityId, cityName }: { cityId: string; cityName: string }) =>
      apiService.getPrediction(cityId, cityName),
    onSuccess: (data, variables) => {
      // Update cache with new prediction
      queryClient.setQueryData(['prediction', variables.cityId], data);
    },
  });
};

export const useRefreshCities = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.getCities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: apiService.checkHealth,
    refetchInterval: 30000, // Check every 30 seconds
  });
};