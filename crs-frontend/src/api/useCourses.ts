import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import type { ApiErrorResponse } from '../types/apiError'
import type { Course } from '../types/course'
import { getCourses } from './courseApi'

export type LoadState = 'loading' | 'success' | 'empty' | 'error'

export function useCourses(keyword: string, page: number, size = 10) {
  const [courses, setCourses] = useState<Course[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [state, setState] = useState<LoadState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchCourses = useCallback(() => {
    setState('loading')
    setErrorMessage('')

    getCourses(keyword, page, size)
      .then(({ data }) => {
        setCourses(data.content)
        setTotalPages(data.totalPages)
        setState(data.content.length === 0 ? 'empty' : 'success')
      })
      .catch((error: unknown) => {
        let message = 'Đã xảy ra lỗi không xác định, vui lòng thử lại.'

        if (axios.isAxiosError<ApiErrorResponse>(error)) {
          if (error.response?.data?.message) {
            message = error.response.data.message
          } else if (!error.response) {
            message = 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.'
          }
        }

        setErrorMessage(message)
        setState('error')
      })
  }, [keyword, page, size])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return { courses, totalPages, state, errorMessage, refetch: fetchCourses }
}
