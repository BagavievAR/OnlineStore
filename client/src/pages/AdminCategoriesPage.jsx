import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'

export default function AdminCategoriesPage() {
  const emptyForm = {
    name: '',
    slug: '',
    isVisible: true,
  }

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadCategories = async () => {
    try {
      const data = await apiFetch('/Categories')
      setCategories(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      slug: category.slug,
      isVisible: category.isVisible,
    })
    setError('')
    setMessage('')
  }

  const submitCategory = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await apiFetch(`/Categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
        setMessage('Категория обновлена')
      } else {
        await apiFetch('/Categories', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setMessage('Категория добавлена')
      }

      setError('')
      resetForm()
      await loadCategories()
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  const deleteCategory = async (id) => {
    try {
      await apiFetch(`/Categories/${id}`, { method: 'DELETE' })
      setMessage('Категория удалена')
      setError('')
      await loadCategories()
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Администрирование категорий</h1>
        <p className="page-subtitle">
          Создание, редактирование и удаление категорий каталога.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <form className="form-grid" onSubmit={submitCategory}>
          <input
            className="input"
            placeholder="Название"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
            />
            <span>Показывать категорию</span>
          </label>

          <div className="actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Сохранить изменения' : 'Добавить категорию'}
            </button>

            {editingId && (
              <button className="btn" type="button" onClick={resetForm}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">Категории пока отсутствуют.</div>
      ) : (
        <div className="grid admin">
          {categories.map((category) => (
            <article className="card" key={category.id}>
              <div className="card-body">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <h2 className="card-title">{category.name}</h2>
                  <span className={category.isVisible ? 'badge' : 'badge hidden'}>
                    {category.isVisible ? 'Видима' : 'Скрыта'}
                  </span>
                </div>

                <p className="card-text">
                  <b>Slug:</b> {category.slug}
                </p>

                <div className="actions">
                  <button className="btn" onClick={() => startEdit(category)}>
                    Редактировать
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}