
import { useQuery} from '@tanstack/react-query';
import { weatherService } from '../services/soapClient';
import { format } from 'date-fns';

// Query Keys
export const WEATHER_KEYS = {
  all: ['weather'],
  current: (location: any, date: any) => [...WEATHER_KEYS.all, 'current', location, date],
  historical: (location: any, startDate: any, endDate: any) => [
    ...WEATHER_KEYS.all,
    'historical',
    location,
    startDate,
    endDate
  ],
  comparison: (location1: any, location2: any, date: any) => [
    ...WEATHER_KEYS.all,
    'comparison',
    location1,
    location2,
    date
  ],
  climateIndex: (location: any, date: any) => [...WEATHER_KEYS.all, 'climate', location, date]
};

// ============================================================================
// WEATHER HOOKS
// ============================================================================

export const useCurrentWeather = (location: string, date: string | number | Date) => {
  const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: WEATHER_KEYS.current(location, formattedDate),
    queryFn: () => weatherService.getWeather(location, formattedDate),
    enabled: !!location,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2
  });
};

export const useHistoricalWeather = (location: any, startDate: string | number | Date, endDate: string | number | Date) => {
  const formattedStart = startDate ? format(new Date(startDate), 'yyyy-MM-dd') : null;
  const formattedEnd = endDate ? format(new Date(endDate), 'yyyy-MM-dd') : null;

  return useQuery({
    queryKey: WEATHER_KEYS.historical(location, formattedStart, formattedEnd),
    queryFn: () => weatherService.getHistoricalWeather(location, formattedStart, formattedEnd),
    enabled: !!location && !!formattedStart && !!formattedEnd,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2
  });
};

export const useWeatherComparison = (location1: any, location2: any, date: string | number | Date) => {
  const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: WEATHER_KEYS.comparison(location1, location2, formattedDate),
    queryFn: () => weatherService.compareWeather(location1, location2, formattedDate),
    enabled: !!location1 && !!location2,
    staleTime: 15 * 60 * 1000,
    retry: 2
  });
};

export const useClimateIndex = (location: any, date: string | number | Date) => {
  const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: WEATHER_KEYS.climateIndex(location, formattedDate),
    queryFn: () => weatherService.getClimateIndex(location, formattedDate),
    enabled: !!location,
    staleTime: 30 * 60 * 1000,
    retry: 2
  });
};
