import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3500)
    return () => window.clearTimeout(timer)
  }, [message, type, onClose])

  return <div className={`toast toast-${type}`} role={type === 'error' ? 'alert' : 'status'}>
    <span>{message}</span>
    <button type="button" aria-label="Đóng thông báo" onClick={onClose}>×</button>
  </div>
}
