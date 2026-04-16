'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth.store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth)
  const loading = useAuthStore((state) => state.loading)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  // opcional: loader mientras valida token
  if (loading) return null

  return <>{children}</>
}