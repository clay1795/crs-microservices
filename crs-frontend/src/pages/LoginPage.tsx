import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import type { ApiErrorResponse } from '../types/apiError'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      const response = await loginApi({ username: username.trim(), password })
      login(response.data)
      navigate('/courses', { replace: true })
    } catch (requestError) {
      if (axios.isAxiosError<ApiErrorResponse>(requestError)) {
        setError(requestError.response?.data?.message
          ?? (!requestError.response ? 'Không kết nối được tới hệ thống. Vui lòng thử lại.' : 'Đăng nhập thất bại. Kiểm tra tên đăng nhập và mật khẩu.'))
      } else setError('Đăng nhập thất bại, vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="login-page">
    <p className="eyebrow">Course Registration System</p>
    <h1>Đăng nhập CRS</h1>
    <p className="subtitle">Đăng nhập để sử dụng các chức năng của tài khoản.</p>
    <form onSubmit={handleSubmit}>
      <fieldset disabled={submitting}>
        <label>Tên đăng nhập
          <input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>Mật khẩu
          <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" type="submit">{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </fieldset>
    </form>
  </main>
}
