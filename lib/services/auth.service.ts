// lib/services/auth.service.ts
import { apiFetch } from '../api/client'

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role?: string
  }
}

export interface MeResponse {
  id: string
  email: string
  name: string
  role?: string
}

export const authService = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // 🔥 ahora limpio
  me: () => apiFetch<MeResponse>('/auth/me'),
}