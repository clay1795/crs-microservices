import axios from 'axios'
import type { ApiErrorResponse } from '../types/apiError'

export function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.message) return error.response.data.message
    if (!error.response) return 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.'
    if (error.response.status === 403) return 'Bạn không có quyền thực hiện thao tác này.'
  }
  return fallback
}
