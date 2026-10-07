import { useCallback, useEffect, useState } from 'react'
import { cancelRegistration, getMyRegistrations } from '../api/registrationApi'
import { getCourseById } from '../api/courseApi'
import { errorMessage } from '../api/errorMessage'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import type { Registration } from '../types/registration'

type RegistrationRow = Registration & { courseName: string }

export default function MyRegistrationsPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const { toast, showToast, clearToast } = useToast()

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const { data } = await getMyRegistrations()
      const enriched = await Promise.all(data.filter((row) => row.trangThai === 'DA_DANG_KY').map(async (row) => {
        try {
          const { data: course } = await getCourseById(row.courseId)
          return { ...row, courseName: course.tenMonHoc }
        } catch {
          return { ...row, courseName: `Môn học #${row.courseId} (không tìm thấy thông tin)` }
        }
      }))
      setRows(enriched)
    } catch (error) {
      setLoadError(errorMessage(error, 'Không tải được danh sách đăng ký.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadData() }, [loadData])

  const handleCancel = async (row: RegistrationRow) => {
    if (cancellingId !== null || !window.confirm(`Hủy đăng ký môn "${row.courseName}"?`)) return
    setCancellingId(row.id)
    try {
      await cancelRegistration(row.id)
      showToast(`Đã hủy đăng ký môn "${row.courseName}".`, 'success')
      await loadData()
    } catch (error) {
      showToast(errorMessage(error, 'Hủy đăng ký không thành công.'), 'error')
    } finally {
      setCancellingId(null)
    }
  }

  return <main>
    <p className="eyebrow">Sinh viên</p>
    <h1>Môn học đã đăng ký</h1>
    <p className="subtitle">Xem các môn đang đăng ký và quản lý học phần của bạn.</p>
    {loading ? <p className="status">Đang tải danh sách đăng ký...</p>
      : loadError ? <div className="status error" role="alert"><p>{loadError}</p><button type="button" onClick={() => void loadData()}>Thử lại</button></div>
        : rows.length === 0 ? <p className="status">Bạn chưa đăng ký môn học nào.</p>
          : <div className="table-wrapper"><table>
            <thead><tr><th>Tên môn học</th><th>Ngày đăng ký</th><th>Thao tác</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.id}>
              <td>{row.courseName}</td><td>{new Date(row.ngayDangKy).toLocaleString('vi-VN')}</td>
              <td><button type="button" className="danger" disabled={cancellingId !== null} onClick={() => void handleCancel(row)}>
                {cancellingId === row.id ? 'Đang hủy...' : 'Hủy đăng ký'}
              </button></td>
            </tr>)}</tbody>
          </table></div>}
    {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={clearToast} />}
  </main>
}
