import api from '../utils/axios';
import { AxiosRequestConfig } from 'axios';

export const apiService = {
  // Example methods
  get: async (url: string, config?: AxiosRequestConfig) => {
    const response = await api.get(url, config);
    return response;
  },
  
  post: async <T>(url: string, data: T, config?: AxiosRequestConfig) => {
    // If data is FormData, ensure the Content-Type is properly set
    // Note: Axios automatically sets the proper content-type for FormData objects
    // but we're being explicit here for clarity
    const requestConfig = config || {};
    
    if (data instanceof FormData) {
      requestConfig.headers = {
        ...requestConfig.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
    
    const response = await api.post(url, data, requestConfig);
    return response;
  },

  patch: async <T>(url: string, data: T, config?: AxiosRequestConfig) => {
    // Same FormData handling for PATCH requests
    const requestConfig = config || {};

    if (data instanceof FormData) {
      requestConfig.headers = {
        ...requestConfig.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
    const response = await api.patch(url, data, requestConfig);
    return response;
  },
  
  put: async <T>(url: string, data: T, config?: AxiosRequestConfig) => {
    // Same FormData handling for PUT requests
    const requestConfig = config || {};
    
    if (data instanceof FormData) {
      requestConfig.headers = {
        ...requestConfig.headers,
        'Content-Type': 'multipart/form-data',
      };
    }
    
    const response = await api.put(url, data, requestConfig);
    return response;
  },
  
  delete: async (url: string, config?: AxiosRequestConfig) => {
    const response = await api.delete(url, config);
    return response;
  }
};
