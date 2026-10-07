import { useCallback, useState } from 'react'
import { useCourses } from '../api/useCourses'
import SearchBox from '../components/SearchBox'
import CourseList from '../components/CourseList'
import Pagination from '../components/Pagination'

export default function CoursesPage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page)
  const handleSearch = useCallback((value: string) => { setKeyword(value); setPage(0) }, [])

  return <main>
    <p className="eyebrow">Course Registration System</p>
    <h1>Danh sách môn học</h1>
    <p className="subtitle">Tìm kiếm và xem tình trạng chỗ học hiện tại.</p>
    <SearchBox onSearch={handleSearch} />
    <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} />
    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  </main>
}
