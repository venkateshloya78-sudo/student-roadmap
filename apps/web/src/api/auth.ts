import apiClient from './client';
import type { AuthTokens, LoginRequest, RegisterRequest, User, StudentProfile } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const form = new URLSearchParams();
    form.append('username', data.email);
    form.append('password', data.password);
    const res = await apiClient.post<AuthTokens>('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const res = await apiClient.post<User>('/auth/register', data);
    return res.data;
  },

  me: async (): Promise<{ user: User; profile: StudentProfile | null }> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout').catch(() => null);
  },
};
