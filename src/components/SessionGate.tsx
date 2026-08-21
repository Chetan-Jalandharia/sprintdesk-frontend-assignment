import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '../stores/useAuthStore'

type SessionGateProps = { children: ReactNode }

export function SessionGate({ children }: SessionGateProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  useEffect(() => { void initialize() }, [initialize])
  if (isInitializing) return <div className="full-screen-state">Validating your session...</div>
  return children
}
