
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationService } from '../services/graphqlClient';

// Query Keys
export const RECOMMENDATION_KEYS = {
  all: ['recommendations'],
  irrigation: {
    all: () => [...RECOMMENDATION_KEYS.all, 'irrigation'],
    detail: (id: any) => [...RECOMMENDATION_KEYS.irrigation.all(), id],
    byParcel: (parcelId: any) => [...RECOMMENDATION_KEYS.irrigation.all(), 'parcel', parcelId],
    latest: (parcelId: any) => [...RECOMMENDATION_KEYS.irrigation.all(), 'latest', parcelId]
  },
  fertilization: {
    all: () => [...RECOMMENDATION_KEYS.all, 'fertilization'],
    byCrop: (cropId: any) => [...RECOMMENDATION_KEYS.fertilization.all(), 'crop', cropId]
  },
  cropPlans: {
    all: () => [...RECOMMENDATION_KEYS.all, 'cropPlans'],
    byParcel: (parcelId: any) => [...RECOMMENDATION_KEYS.cropPlans.all(), 'parcel', parcelId],
    best: (parcelId: any) => [...RECOMMENDATION_KEYS.cropPlans.all(), 'best', parcelId]
  }
};

// ============================================================================
// IRRIGATION HOOKS
// ============================================================================

export const useIrrigationRecommendation = (id: any) => {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.irrigation.detail(id),
    queryFn: () => recommendationService.getIrrigationRecommendation(id),
    enabled: !!id
  });
};

export const useIrrigationRecommendationsByParcel = (parcelId: any) => {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.irrigation.byParcel(parcelId),
    queryFn: () => recommendationService.getIrrigationRecommendationsByParcel(parcelId),
    enabled: !!parcelId,
    staleTime: 10 * 60 * 1000
  });
};

export const useLatestIrrigationRecommendation = (parcelId: any) => {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.irrigation.latest(parcelId),
    queryFn: () => recommendationService.getLatestIrrigationRecommendation(parcelId),
    enabled: !!parcelId,
    staleTime: 5 * 60 * 1000
  });
};

export const useGenerateIrrigationRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (parcelId) => recommendationService.generateIrrigationRecommendation(parcelId),
    onSuccess: (_data, parcelId) => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_KEYS.irrigation.byParcel(parcelId)
      });
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_KEYS.irrigation.latest(parcelId)
      });
    }
  });
};

// ============================================================================
// FERTILIZATION HOOKS
// ============================================================================

export const useFertilizationRecommendationsByCrop = (cropId: any) => {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.fertilization.byCrop(cropId),
    queryFn: () => recommendationService.getFertilizationRecommendationsByCrop(cropId),
    enabled: !!cropId,
    staleTime: 10 * 60 * 1000
  });
};

export const useGenerateFertilizationRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cropId }: { parcelId: any; cropId: any }) =>
      recommendationService.generateFertilizationRecommendation(cropId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_KEYS.fertilization.byCrop(variables.cropId)
      });
    }
  });
};

// ============================================================================
// CROP PLAN HOOKS
// ============================================================================

export const useCropPlansByParcel = (parcelId: any) => {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.cropPlans.byParcel(parcelId),
    queryFn: () => recommendationService.getCropPlansByParcel(parcelId),
    enabled: !!parcelId,
    staleTime: 15 * 60 * 1000
  });
};

export const useBestCropPlan = (parcelId: any) => {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.cropPlans.best(parcelId),
    queryFn: () => recommendationService.getBestCropPlan(parcelId),
    enabled: !!parcelId,
    staleTime: 15 * 60 * 1000
  });
};

export const useGenerateCropPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (parcelId) => recommendationService.generateCropPlan(parcelId),
    onSuccess: (_data, parcelId) => {
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_KEYS.cropPlans.byParcel(parcelId)
      });
      queryClient.invalidateQueries({
        queryKey: RECOMMENDATION_KEYS.cropPlans.best(parcelId)
      });
    }
  });
};
