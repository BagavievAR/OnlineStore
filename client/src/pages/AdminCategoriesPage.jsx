import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')

  const loadItems = async () => {
    try {
      const data = await apiFetch('/Categories')
      setItems(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const createItem = async (e) => {
    e.preventDefault()
    try {
      await apiFetch('/Categories', {
        method: 'POST',
        body: JSON.stringify({ name, slug, isVisible: true }),
      })
      setName('')
      setSlug('')
      setError('')
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      await apiFetch(`/Categories/${id}`, { method: 'DELETE' })
      setError('')
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <div>
      <h2>Админ: Категории</h2>
      <form onSubmit={createItem} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
        <button type="submit">Добавить</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: '10px' }}>
          {item.name} ({item.slug}) <button onClick={() => deleteItem(item.id)}>Удалить</button>
        </div>
      ))}
    </div>
  )
}