import type { LoadState } from '../api/useCourses'
import type { Course } from '../types/course'

interface CourseListProps {
  courses: Course[]
  state: LoadState
  errorMessage: string
  onRetry: () => void
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
}: CourseListProps) {
  if (state === 'loading') {
    return <p className="status">Đang tải danh sách môn học...</p>
  }

  if (state === 'error') {
    return (
      <div className="status error" role="alert">
        <p>{errorMessage}</p>
        <button type="button" onClick={onRetry}>
          Thử lại
        </button>
      </div>
    )
  }

  if (state === 'empty') {
    return <p className="status">Không tìm thấy môn học nào phù hợp.</p>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Số chỗ còn lại</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.tenMonHoc}</td>
              <td>{course.soTinChi}</td>
              <td className={course.soChoConLai === 0 ? 'full' : undefined}>
                {course.soChoConLai} / {course.soChoToiDa}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
