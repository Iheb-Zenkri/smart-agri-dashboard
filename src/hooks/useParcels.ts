import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parcelService, cropService, harvestService } from '../services/restClient';

// Query Keys
export const PARCEL_KEYS = {
  all: ['parcels'],
  lists: () => [...PARCEL_KEYS.all, 'list'],
  list: (filters: any) => [...PARCEL_KEYS.lists(), filters],
  details: () => [...PARCEL_KEYS.all, 'detail'],
  detail: (id: any) => [...PARCEL_KEYS.details(), id],
  byLocation: (location: any) => [...PARCEL_KEYS.all, 'location', location]
};

export const CROP_KEYS = {
  all: ['crops'],
  lists: () => [...CROP_KEYS.all, 'list'],
  detail: (id: any) => [...CROP_KEYS.all, 'detail', id],
  byParcel: (parcelId: any) => [...CROP_KEYS.all, 'parcel', parcelId]
};

export const HARVEST_KEYS = {
  all: ['harvests'],
  detail: (id: any) => [...HARVEST_KEYS.all, 'detail', id],
  byCrop: (cropId: any) => [...HARVEST_KEYS.all, 'crop', cropId],
  byParcel: (parcelId: any) => [...HARVEST_KEYS.all, 'parcel', parcelId]
};

// ============================================================================
// PARCEL HOOKS
// ============================================================================

export const useAllParcels = () => {
  return useQuery({
    queryKey: PARCEL_KEYS.lists(),
    queryFn: parcelService.getAllParcels,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};

export const useParcelById = (id: number) => {
  return useQuery({
    queryKey: PARCEL_KEYS.detail(id),
    queryFn: () => parcelService.getParcelById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
};

export const useParcelsByLocation = (location: String) => {
  return useQuery({
    queryKey: PARCEL_KEYS.byLocation(location),
    queryFn: () => parcelService.getParcelsByLocation(location),
    enabled: !!location,
    staleTime: 5 * 60 * 1000
  });
};

export const useCreateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: parcelService.createParcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARCEL_KEYS.lists() });
    }
  });
};

export const useUpdateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => parcelService.updateParcel(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PARCEL_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: PARCEL_KEYS.lists() });
    }
  });
};

export const useDeleteParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: parcelService.deleteParcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARCEL_KEYS.all });
    }
  });
};

// ============================================================================
// CROP HOOKS
// ============================================================================

export const useAllCrops = () => {
  return useQuery({
    queryKey: CROP_KEYS.lists(),
    queryFn: cropService.getAllCrops,
    staleTime: 5 * 60 * 1000
  });
};

export const useCropById = (id: number) => {
  return useQuery({
    queryKey: CROP_KEYS.detail(id),
    queryFn: () => cropService.getCropById(id),
    enabled: !!id
  });
};

export const useCropsByParcelId = (parcelId: number) => {
  return useQuery({
    queryKey: CROP_KEYS.byParcel(parcelId),
    queryFn: () => cropService.getCropsByParcelId(parcelId),
    enabled: !!parcelId,
    staleTime: 3 * 60 * 1000
  });
};

export const useCreateCrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cropService.createCrop,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CROP_KEYS.byParcel(data.parcelId) });
      queryClient.invalidateQueries({ queryKey: CROP_KEYS.lists() });
    }
  });
};

export const useUpdateCrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => cropService.updateCrop(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: CROP_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: CROP_KEYS.byParcel(data.parcelId) });
    }
  });
};

export const useDeleteCrop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cropService.deleteCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CROP_KEYS.all });
    }
  });
};

// ============================================================================
// HARVEST HOOKS
// ============================================================================

export const useHarvestById = (id: number) => {
  return useQuery({
    queryKey: HARVEST_KEYS.detail(id),
    queryFn: () => harvestService.getHarvestById(id),
    enabled: !!id
  });
};

export const useHarvestsByCropId = (cropId: number) => {
  return useQuery({
    queryKey: HARVEST_KEYS.byCrop(cropId),
    queryFn: () => harvestService.getHarvestsByCropId(cropId),
    enabled: !!cropId
  });
};

export const useHarvestsByParcelId = (parcelId: number) => {
  return useQuery({
    queryKey: HARVEST_KEYS.byParcel(parcelId),
    queryFn: () => harvestService.getHarvestsByParcelId(parcelId),
    enabled: !!parcelId
  });
};

export const useCreateHarvest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: harvestService.createHarvest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: HARVEST_KEYS.byCrop(data.cropId) });
      queryClient.invalidateQueries({ queryKey: HARVEST_KEYS.all });
    }
  });
};

export const useDeleteHarvest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: harvestService.deleteHarvest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HARVEST_KEYS.all });
    }
  });
};