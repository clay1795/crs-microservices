import { useCallback, useState } from 'react'
import { useCourses } from './api/useCourses'
import CourseList from './components/CourseList'
import Pagination from './components/Pagination'
import SearchBox from './components/SearchBox'

function App() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(
    keyword,
    page,
  )

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword)
    setPage(0)
  }, [])

  return (
    <main>
      <header>
        <p className="eyebrow">CRS · Course Registration System</p>
        <h1>Danh sách môn học</h1>
        <p className="subtitle">Tìm kiếm và xem tình trạng chỗ học hiện tại.</p>
      </header>

      <SearchBox onSearch={handleSearch} />
      <CourseList
        courses={courses}
        state={state}
        errorMessage={errorMessage}
        onRetry={refetch}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </main>
  )
}

export default App
