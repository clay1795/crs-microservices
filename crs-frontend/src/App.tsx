import { useEffect, useState } from 'react'
import { getCourses } from './api/courseApi'
import type { Course } from './types/course'

function App() {
  const [courses, setCourses] = useState<Course[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCourses()
      .then((response) => setCourses(response.data.content))
      .catch((requestError: unknown) => {
        console.error(requestError)
        setError(
          'Không kết nối được tới hệ thống. Kiểm tra lại API Gateway đã chạy chưa.',
        )
      })
  }, [])

  return (
    <main>
      <h1>Kiểm tra kết nối CRS qua Gateway</h1>
      <p className="endpoint">GET /api/courses</p>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <p className="success">Kết nối thành công - {courses.length} môn học</p>
          <pre>{JSON.stringify(courses, null, 2)}</pre>
        </>
      )}
    </main>
  )
}

export default App
