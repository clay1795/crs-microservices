import { useCallback, useState } from 'react'
import { useCourses } from '../api/useCourses'
import { registerCourse } from '../api/registrationApi'
import { errorMessage as getErrorMessage } from '../api/errorMessage'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import SearchBox from '../components/SearchBox'
import CourseList from '../components/CourseList'
import Pagination from '../components/Pagination'
import Toast from '../components/Toast'
import type { Course } from '../types/course'

export default function RegisterCoursePage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [registeringId, setRegisteringId] = useState<number | null>(null)
  const { user } = useAuth()
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page)
  const { toast, showToast, clearToast } = useToast()
  const handleSearch = useCallback((value: string) => { setKeyword(value); setPage(0) }, [])

  const handleRegister = async (course: Course) => {
    if (!user || registeringId !== null || course.soChoConLai <= 0) return
    setRegisteringId(course.id)
    try {
      await registerCourse({ studentId: user.id, courseId: course.id })
      showToast(`Đăng ký thành công môn "${course.tenMonHoc}".`, 'success')
      refetch()
    } catch (error) {
      showToast(getErrorMessage(error, 'Đăng ký không thành công, vui lòng thử lại.'), 'error')
    } finally {
      setRegisteringId(null)
    }
  }

  return <main>
    <p className="eyebrow">Sinh viên</p>
    <h1>Đăng ký học phần</h1>
    <p className="subtitle">Chọn môn học còn chỗ để đăng ký.</p>
    <SearchBox onSearch={handleSearch} />
    <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch}
      onRegister={handleRegister} registeringId={registeringId} />
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={clearToast} />}
  </main>
}
