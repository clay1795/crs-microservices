import type { LoadState } from '../api/useCourses'
import type { Course } from '../types/course'

interface CourseListProps {
  courses: Course[]
  state: LoadState
  errorMessage: string
  onRetry: () => void
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
  busy?: boolean
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
  onEdit,
  onDelete,
  busy = false,
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

  const showActions = !!onEdit || !!onDelete

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Số chỗ còn lại</th>
            {showActions && <th>Thao tác</th>}
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
              {showActions && <td className="row-actions">
                {onEdit && <button type="button" disabled={busy} onClick={() => onEdit(course)}>Sửa</button>}
                {onDelete && <button className="danger" type="button" disabled={busy} onClick={() => onDelete(course)}>Xóa</button>}
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
