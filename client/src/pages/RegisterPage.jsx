import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

function mapRegisterError(message) {
  if (!message) return ['Неизвестная ошибка']

  try {
    const parsed = JSON.parse(message)

    if (Array.isArray(parsed)) {
      return parsed.map((e) => {
        switch (e.code) {
          case 'PasswordTooShort':
            return 'Пароль должен быть не короче 6 символов.'
          case 'PasswordRequiresNonAlphanumeric':
            return 'Пароль должен содержать хотя бы один спецсимвол.'
          case 'PasswordRequiresDigit':
            return 'Пароль должен содержать хотя бы одну цифру.'
          case 'PasswordRequiresUpper':
            return 'Пароль должен содержать хотя бы одну заглавную букву.'
          case 'DuplicateUserName':
            return 'Пользователь с таким именем уже существует.'
          case 'DuplicateEmail':
            return 'Пользователь с таким email уже существует.'
          default:
            return e.description || 'Ошибка регистрации.'
        }
      })
    }

    if (parsed.message) {
      return [parsed.message]
    }
  } catch {
    return [message]
  }

  return [message]
}

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErrors([])
    setMessage('')

    try {
      const data = await apiFetch('/Auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, userName, password }),
      })

      setMessage(data.message)
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      setErrors(mapRegisterError(err.message))
    }
  }

  return (
    <div>
      <h2>Регистрация</h2>

      <form onSubmit={submit} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Имя пользователя"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button type="submit">Зарегистрироваться</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {errors.length > 0 && (
        <ul style={{ color: 'red', marginTop: '10px' }}>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  )
}