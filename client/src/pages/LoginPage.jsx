import { useState } from 'react'
import { apiFetch, setToken, setUser } from '../api/api'

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await apiFetch('/Auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setToken(data.token)
      setUser({
        userName: data.userName,
        email: data.email,
        roles: data.roles,
      })

      window.location.href = '/'
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Вход</h1>
        <p className="page-subtitle">
          Войди в аккаунт, чтобы оформлять заказы и просматривать историю покупок.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="input"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="actions">
            <button className="btn btn-primary" type="submit">
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}