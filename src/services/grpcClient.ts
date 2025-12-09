import axios from 'axios';
import { API_CONFIG } from './api.config';

export const ALERT_TYPES = {
  WEATHER: 0,
  PEST: 1,
  DISEASE: 2,
  THRESHOLD: 3,
  IRRIGATION: 4,
  FERTILIZATION: 5,
  HARVEST: 6,
  SYSTEM: 7
};

export const ALERT_SEVERITIES = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3
};


const grpcClient = axios.create({
  baseURL: `${API_CONFIG.GATEWAY_URL}${API_CONFIG.SERVICES.ALERT.baseURL}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

grpcClient.interceptors.response.use(
  (response) => {
    console.log(`[gRPC] Response from ${response.config.url}:`, response.data);
    return response;
  },
  async (error) => {
   const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return grpcClient(originalRequest);
    }

    if (!error.response) {
    console.error('[gRPC] Network Error:', error);
      throw new Error('Network error. Please check your connection.');
    }

    const errorMessage = error.response?.data?.message || error.message;
    console.error('[gRPC] API Error:', error);
    throw new Error(errorMessage);
  }
);


export const alertService = {
  streamAlerts: (_parcelId: number, onAlert: (arg0: any) => void, _handleError: unknown, onError: (arg0: Event) => void) => {
    const url = `${API_CONFIG.GATEWAY_URL}${API_CONFIG.SERVICES.ALERT.baseURL}/stream`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data);
        console.log('[gRPC Stream] Received alert:', alert);
        onAlert(alert);
      } catch (error) {
        console.error('[gRPC Stream] Parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[gRPC Stream] Connection error:', error);
      if (onError) onError(error);
      eventSource.close();
    };

    return {
      cancel: () => eventSource.close()
    };
  },

  createAlert: async (alertData: any) => {
    console.log('[gRPC] Creating alert:', alertData);
    const response = await grpcClient.post('/alerts', alertData);
    return response.data;
  },

  getAlert: async (alertId: any) => {
    console.log('[gRPC] Getting alert:', alertId);
    const response = await grpcClient.get(`/${alertId}`);
    return response.data;
  },

  getActiveAlerts: async (parcelId: number, alertType : string, severity : string, limit : number) => {

    let params: string = `parcelId=${parcelId}`;

    if (alertType) params += `&alertType=${alertType}`;
    if (severity) params += `&severity=${severity}`;
    if (limit) params += `&limit=${limit}`;

    console.log('[gRPC] Getting active alerts for parcel:', params);

    const response = await grpcClient.get('/active?' + params);
    return response.data.alerts? response.data.alerts : [];
  },

  acknowledgeAlert: async (alertId: any, acknowledgedBy: any) => {
    console.log('[gRPC] Acknowledging alert:', alertId);
    const response = await grpcClient.post(`/${alertId}/acknowledge`, { acknowledgedBy });
    return response.data;
  },

  dismissAlert: async (alertId: number,dismissedBy: string) => {
    console.log('[gRPC] Dismissing alert:', alertId);
    const response = await grpcClient.post('/dismiss', { alertId, dismissedBy });
    return response.data;
  },

  subscribeToAlerts: async (subscriptionData: any) => {
    console.log('[gRPC] Subscribing to alerts:', subscriptionData);
    const response = await grpcClient.post('/alerts/subscribe', subscriptionData);
    return response.data;
  }
};

export default alertService;