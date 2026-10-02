import apiClient from './client';
import type { CareerRole, PaginatedResponse } from '../types';

export const careersApi = {
  list: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PaginatedResponse<CareerRole>> => {
    const res = await apiClient.get('/careers', { params });
    return res.data;
  },

  get: async (slug: string): Promise<CareerRole> => {
    const res = await apiClient.get(`/careers/${slug}`);
    return res.data;
  },
};
