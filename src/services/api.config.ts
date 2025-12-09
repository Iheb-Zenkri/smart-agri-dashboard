export const API_CONFIG = {
  GATEWAY_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  
  SERVICES: {
    PARCEL: {
      baseURL: '/parcel-service/api',
      protocol: 'REST',
    },
    WEATHER: {
      baseURL: '/weather-service',
      protocol: 'SOAP',
    },
    RECOMMENDATION: {
      baseURL: '/recommendation-service',
      protocol: 'GraphQL',
      graphqlPath: '/graphql'
    },
    ALERT: {
      baseURL: '/alert-service',
      protocol: 'REST',
    }
  },

  // Request Configuration
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};