import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar" aria-label="Điều hướng chính">
      <NavLink className="brand" to="/courses">CRS</NavLink>
      <NavLink to="/courses">Danh sách môn học</NavLink>
      {user?.role === 'ADMIN' && <NavLink to="/admin/courses">Quản trị môn học</NavLink>}
      {user?.role === 'STUDENT' && <>
        <NavLink to="/register-course">Đăng ký học phần</NavLink>
        <NavLink to="/my-registrations">Môn học đã đăng ký</NavLink>
      </>}
      <div className="nav-account">
        {user ? <>
          <span>Xin chào, {user.username} ({user.role})</span>
          <button type="button" onClick={() => { logout(); navigate('/login', { replace: true }) }}>Đăng xuất</button>
        </> : <NavLink to="/login">Đăng nhập</NavLink>}
      </div>
    </nav>
  )
}
