import { useCallback, useRef, useState } from 'react'

export function useToast() {
  const sequence = useRef(0)
  const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null)
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ id: ++sequence.current, message, type })
  }, [])
  const clearToast = useCallback(() => setToast(null), [])
  return { toast, showToast, clearToast }
}
