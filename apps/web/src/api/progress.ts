import apiClient from './client';
import type { StudentProgress } from '../types';

export const progressApi = {
  update: async (roadmapItemId: string, completionPct: number): Promise<StudentProgress> => {
    const res = await apiClient.put(`/progress/${roadmapItemId}`, {
      completion_percentage: completionPct,
    });
    return res.data;
  },
};
