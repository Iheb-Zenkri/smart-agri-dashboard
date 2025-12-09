
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { alertService, ALERT_TYPES, ALERT_SEVERITIES } from '../services/grpcClient';

// Query Keys
export const ALERT_KEYS = {
  all: ['alerts'],
  detail: (id: any) => [...ALERT_KEYS.all, 'detail', id],
  active: (parcelId: any) => [...ALERT_KEYS.all, 'active', parcelId],
  stream: (parcelId: any) => [...ALERT_KEYS.all, 'stream', parcelId]
};

// ============================================================================
// ALERT HOOKS
// ============================================================================

export const useAlert = (alertId: any) => {
  return useQuery({
    queryKey: ALERT_KEYS.detail(alertId),
    queryFn: () => alertService.getAlert(alertId),
    enabled: !!alertId
  });
};

export const useActiveAlerts = (parcelId: any) => {
  return useQuery({
    queryKey: ALERT_KEYS.active(parcelId),
    queryFn: () => alertService.getActiveAlerts(parcelId, '', '', 0),
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alertService.createAlert,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.active(data.parcelId) });
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
    }
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, acknowledgedBy }: { alertId: any; acknowledgedBy: any }) =>
      alertService.acknowledgeAlert(alertId, acknowledgedBy),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.active(data.parcelId) });
    }
  });
};

export const useDismissAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, dismissedBy }: { alertId: any; dismissedBy: any }) =>
      alertService.dismissAlert(alertId, dismissedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
    }
  });
};

export const useSubscribeToAlerts = () => {
  return useMutation({
    mutationFn: alertService.subscribeToAlerts
  });
};

// ============================================================================
// ALERT STREAMING HOOK
// ============================================================================

export const useAlertStream = (parcelId : any) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let stream = null;

    const handleAlert = (alert: any) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 50)); // Keep last 50 alerts
    };

    const handleError = (err: unknown) => {
      setError(err);
      setIsConnected(false);
    };

    const handleEnd = () => {
      setIsConnected(false);
    };

    try {
      stream = alertService.streamAlerts(parcelId, handleAlert, handleError, handleEnd);
      setIsConnected(true);
    } catch (err) {
      setError(err);
      setIsConnected(false);
    }

    return () => {
      if (stream) {
        stream.cancel();
      }
    };
  }, [parcelId]);

  return { alerts, isConnected, error };
};

// Export constants
export { ALERT_TYPES, ALERT_SEVERITIES };