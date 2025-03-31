import api from '../utils/axios';

export const apiService = {
  // Example methods
  get: async (url: string) => {
    const response = await api.get(url);
    return response;
  },
  
  post: async <T>(url: string, data: T) => {
    const response = await api.post(url, data);
    return response;
  },
  
  put: async <T>(url: string, data: T) => {
    const response = await api.put(url, data);
    return response;
  },
  
  delete: async (url: string) => {
    const response = await api.delete(url);
    return response;
  }
};
