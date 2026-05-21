import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'

export default function AdminBrandsPage() {
  const emptyForm = {
    name: '',
    slug: '',
    isVisible: true,
  }

  const [brands, setBrands] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadBrands = async () => {
    try {
      const data = await apiFetch('/Brands')
      setBrands(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (brand) => {
    setEditingId(brand.id)
    setForm({
      name: brand.name,
      slug: brand.slug,
      isVisible: brand.isVisible,
    })
    setMessage('')
    setError('')
  }

  const submitBrand = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await apiFetch(`/Brands/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
        setMessage('Бренд обновлен')
      } else {
        await apiFetch('/Brands', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setMessage('Бренд добавлен')
      }

      setError('')
      resetForm()
      await loadBrands()
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  const deleteBrand = async (id) => {
    try {
      await apiFetch(`/Brands/${id}`, { method: 'DELETE' })
      setMessage('Бренд удален')
      setError('')
      await loadBrands()
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Администрирование брендов</h1>
        <p className="page-subtitle">
          Управление брендами, которые используются в карточках товаров.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <form className="form-grid" onSubmit={submitBrand}>
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
            <span>Показывать бренд</span>
          </label>

          <div className="actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Сохранить изменения' : 'Добавить бренд'}
            </button>

            {editingId && (
              <button className="btn" type="button" onClick={resetForm}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {brands.length === 0 ? (
        <div className="empty-state">Бренды пока отсутствуют.</div>
      ) : (
        <div className="grid admin">
          {brands.map((brand) => (
            <article className="card" key={brand.id}>
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
                  <h2 className="card-title">{brand.name}</h2>
                  <span className={brand.isVisible ? 'badge' : 'badge hidden'}>
                    {brand.isVisible ? 'Видим' : 'Скрыт'}
                  </span>
                </div>

                <p className="card-text">
                  <b>Slug:</b> {brand.slug}
                </p>

                <div className="actions">
                  <button className="btn" onClick={() => startEdit(brand)}>
                    Редактировать
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteBrand(brand.id)}
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