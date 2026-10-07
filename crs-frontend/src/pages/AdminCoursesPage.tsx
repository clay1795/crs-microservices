import { useCallback, useState } from 'react'
import axios from 'axios'
import { createCourse, updateCourse, deleteCourse } from '../api/courseApi'
import type { Course, CourseFormValues } from '../types/course'
import type { ApiErrorResponse } from '../types/apiError'
import CourseForm from '../components/CourseForm'
import { useCourses } from '../api/useCourses'
import CourseList from '../components/CourseList'
import Pagination from '../components/Pagination'
import SearchBox from '../components/SearchBox'

function AdminCoursesPage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formVersion, setFormVersion] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page,
  )

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword)
    setPage(0)
  }, [])

  const resetForm = () => {
    setEditingCourse(null)
    setFormVersion((version) => version + 1)
    setFormError(null)
  }

  const handleFormSubmit = async (values: CourseFormValues) => {
    setSubmitting(true)
    setFormError(null)
    setNotice('')
    try {
      if (editingCourse) await updateCourse(editingCourse.id, values)
      else await createCourse(values)
      setNotice(editingCourse ? 'Đã cập nhật môn học.' : 'Đã thêm môn học.')
      resetForm()
      refetch()
    } catch (error) {
      setFormError(extractErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormVersion((version) => version + 1)
    setFormError(null)
    setNotice('')
  }

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xóa môn học "${course.tenMonHoc}"?`)) return
    setDeleting(true)
    setListError(null)
    setNotice('')
    try {
      await deleteCourse(course.id)
      if (editingCourse?.id === course.id) resetForm()
      setNotice('Đã xóa môn học.')
      if (courses.length === 1 && page > 0) setPage(page - 1)
      else refetch()
    } catch (error) {
      setListError(extractErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main>
      <header>
        <p className="eyebrow">CRS · Course Registration System</p>
        <h1>Quản lý môn học (Admin)</h1>
        <p className="subtitle">Thêm, sửa và quản lý tình trạng chỗ học.</p>
      </header>

      <CourseForm key={formVersion} editingCourse={editingCourse} onSubmit={handleFormSubmit}
        onCancel={resetForm} submitting={submitting} serverError={formError} />
      {notice && <p className="success" role="status">{notice}</p>}
      {listError && <p className="error" role="alert">{listError}</p>}

      <SearchBox onSearch={handleSearch} />
      <CourseList
        courses={courses}
        state={state}
        errorMessage={errorMessage}
        onRetry={refetch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        busy={submitting || deleting}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </main>
  )
}

export default AdminCoursesPage

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data
    if (data?.message) return data.message
    if (error.response?.status === 401) return 'Bạn cần token đăng nhập hợp lệ. Token có thể đã hết hạn.'
    if (error.response?.status === 403) return 'Bạn cần quyền ADMIN để thực hiện thao tác này.'
    if (data) {
      const fieldError = Object.values(data).find((value) => typeof value === 'string' && value.trim())
      if (fieldError) return fieldError
    }
    if (!error.response) return 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.'
  }
  return 'Đã xảy ra lỗi, vui lòng thử lại.'
}
