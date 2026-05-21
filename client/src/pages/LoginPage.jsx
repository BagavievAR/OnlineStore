import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, setToken, setUser } from '../api/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await apiFetch('/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      setToken(data.token)
      setUser({
        email: data.email,
        userName: data.userName,
        roles: data.roles,
      })

      navigate('/')
      window.location.reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}