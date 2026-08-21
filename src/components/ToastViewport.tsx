import { useEffect } from 'react'
import { useToastStore } from '../stores/useToastStore'

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)
  useEffect(() => { const timers = toasts.map((toast) => window.setTimeout(() => removeToast(toast.id), 4000)); return () => timers.forEach(window.clearTimeout) }, [toasts, removeToast])
  return <div className="toast-viewport" aria-live="polite">{toasts.map((toast) => <div className="toast" key={toast.id}>{toast.message}<button type="button" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">x</button></div>)}</div>
}
