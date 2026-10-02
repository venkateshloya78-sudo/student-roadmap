import apiClient from './client';
import type { Roadmap } from '../types';

export const roadmapsApi = {
  getActive: async (): Promise<Roadmap | null> => {
    try {
      const res = await apiClient.get('/roadmaps/active');
      return res.data;
    } catch {
      return null;
    }
  },

  generate: async (careerRoleId: string, weeklyHours: number): Promise<Roadmap> => {
    const res = await apiClient.post('/roadmaps/generate', {
      career_role_id: careerRoleId,
      weekly_hours_committed: weeklyHours,
    });
    return res.data;
  },

  updateItemStatus: async (
    roadmapId: string,
    itemId: string,
    status: string
  ) => {
    const res = await apiClient.patch(
      `/roadmaps/${roadmapId}/items/${itemId}/status`,
      { status }
    );
    return res.data;
  },
};
