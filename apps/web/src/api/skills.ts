import apiClient from './client';
import type { Skill, StudentSkill, PaginatedResponse } from '../types';

export const skillsApi = {
  list: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Skill>> => {
    const res = await apiClient.get('/skills', { params });
    return res.data;
  },

  mySkills: async (): Promise<StudentSkill[]> => {
    const res = await apiClient.get('/skills/mine');
    return res.data;
  },

  upsert: async (skillId: string, selfRating: number): Promise<StudentSkill> => {
    const res = await apiClient.put(`/skills/mine/${skillId}`, { self_rating: selfRating });
    return res.data;
  },
};
