import axios from 'axios';
import { API_CONFIG } from './api.config';

const restClient = axios.create({
  baseURL: `${API_CONFIG.GATEWAY_URL}${API_CONFIG.SERVICES.PARCEL.baseURL}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Response Interceptor
restClient.interceptors.response.use(
  (response) => {
    console.log(`[REST] Response from ${response.config.url}:`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return restClient(originalRequest);
    }

    if (!error.response) {
      console.error('[REST] Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    const errorMessage = error.response?.data?.message || error.message;
    console.error('[REST] API Error:', errorMessage);
    throw new Error(errorMessage);
  }
);

// Parcel Service Methods
export const parcelService = {
  getAllParcels: async () => {
    const response = await restClient.get('/parcels');
    return response.data;
  },

  getParcelById: async (id : number) => {
    const response = await restClient.get(`/parcels/${id}`);
    return response.data;
  },

  getParcelsByLocation: async (location : String) => {
    const response = await restClient.get(`/parcels/location/${location}`);
    return response.data;
  },

  createParcel: async (parcelData : String) => {
    const response = await restClient.post('/parcels', parcelData);
    return response.data;
  },

  updateParcel: async (id : number, parcelData : String) => {
    const response = await restClient.put(`/parcels/${id}`, parcelData);
    return response.data;
  },

  deleteParcel: async (id : number) => {
    const response = await restClient.delete(`/parcels/${id}`);
    return response.data;
  }
};

// Crop Service Methods
export const cropService = {
  getAllCrops: async () => {
    const response = await restClient.get('/crops');
    return response.data;
  },

  getCropById: async (id : number) => {
    const response = await restClient.get(`/crops/${id}`);
    return response.data;
  },

  getCropsByParcelId: async (parcelId : number) => {
    const response = await restClient.get(`/crops/parcel/${parcelId}`);
    return response.data;
  },

  createCrop: async (cropData : string) => {
    const response = await restClient.post('/crops', cropData);
    return response.data;
  },

  updateCrop: async (id : number, cropData : string) => {
    const response = await restClient.put(`/crops/${id}`, cropData);
    return response.data;
  },

  deleteCrop: async (id : number) => {
    const response = await restClient.delete(`/crops/${id}`);
    return response.data;
  }
};

// Harvest Service Methods
export const harvestService = {
  getHarvestById: async (id : number) => {
    const response = await restClient.get(`/harvests/${id}`);
    return response.data;
  },

  getHarvestsByCropId: async (cropId : number) => {
    const response = await restClient.get(`/harvests/crop/${cropId}`);
    return response.data;
  },

  getHarvestsByParcelId: async (parcelId : number) => {
    const response = await restClient.get(`/harvests/parcel/${parcelId}`);
    return response.data;
  },

  createHarvest: async (harvestData : number) => {
    const response = await restClient.post('/harvests', harvestData);
    return response.data;
  },

  deleteHarvest: async (id : number) => {
    const response = await restClient.delete(`/harvests/${id}`);
    return response.data;
  }
};

export default restClient;