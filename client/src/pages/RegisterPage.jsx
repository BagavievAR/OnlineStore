import { useState } from 'react'
import { apiFetch } from '../api/api'

export default function RegisterPage() {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await apiFetch('/Auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setMessage('Регистрация прошла успешно. Теперь можно войти.')
      setError('')
      setForm({
        userName: '',
        email: '',
        password: '',
      })
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Регистрация</h1>
        <p className="page-subtitle">
          Создай аккаунт пользователя для оформления заказов и работы с корзиной.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Имя пользователя"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />

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
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}