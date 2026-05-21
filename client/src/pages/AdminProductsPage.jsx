import { useEffect, useState } from 'react'
import { apiFetch } from '../api/api'

export default function AdminProductsPage() {
  const emptyForm = {
    title: '',
    slug: '',
    price: 0,
    stock: 0,
    description: '',
    isPublished: true,
    categoryId: '',
    brandId: '',
    imageUrl: '',
  }

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadAll = async () => {
    try {
      const [p, c, b] = await Promise.all([
        apiFetch('/Products'),
        apiFetch('/Categories'),
        apiFetch('/Brands'),
      ])

      setProducts(p)
      setCategories(c)
      setBrands(b)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      title: product.title,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      description: product.description,
      isPublished: product.isPublished,
      categoryId: product.categoryId,
      brandId: product.brandId,
      imageUrl: product.imageUrl || '',
    })
    setMessage('')
    setError('')
  }

  const submitProduct = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
      }

      if (editingId) {
        await apiFetch(`/Products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setMessage('Товар обновлен')
      } else {
        await apiFetch('/Products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Товар добавлен')
      }

      setError('')
      resetForm()
      await loadAll()
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  const deleteProduct = async (id) => {
    try {
      await apiFetch(`/Products/${id}`, { method: 'DELETE' })
      setMessage('Товар удален')
      setError('')
      await loadAll()
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Администрирование товаров</h1>
        <p className="page-subtitle">
          Создание, редактирование и удаление товаров каталога.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <form className="form-grid" onSubmit={submitProduct}>
          <div className="form-row">
            <input
              className="input"
              placeholder="Название"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              className="input"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>

          <div className="form-row">
            <input
              className="input"
              placeholder="Цена"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              className="input"
              placeholder="Остаток"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <textarea
            className="textarea"
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="input"
            placeholder="Прямая ссылка на изображение"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <div className="form-row">
            <select
              className="select"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Выбери категорию</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
            >
              <option value="">Выбери бренд</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            <span>Опубликован</span>
          </label>

          <div className="actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Сохранить изменения' : 'Добавить товар'}
            </button>

            {editingId && (
              <button className="btn" type="button" onClick={resetForm}>
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">Товары пока отсутствуют.</div>
      ) : (
        <div className="grid admin">
          {products.map((p) => (
            <article className="card" key={p.id}>
              {p.imageUrl ? (
                <img
                  className="card-image"
                  src={p.imageUrl}
                  alt={p.title}
                />
              ) : (
                <div
                  className="card-image"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    color: '#6b7280',
                    fontWeight: 600,
                  }}
                >
                  Нет изображения
                </div>
              )}

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
                  <h2 className="card-title">{p.title}</h2>
                  <span className={p.isPublished ? 'badge' : 'badge hidden'}>
                    {p.isPublished ? 'Опубликован' : 'Скрыт'}
                  </span>
                </div>

                <p className="card-text">
                  <b>Цена:</b> {p.price}
                </p>
                <p className="card-text">
                  <b>Остаток:</b> {p.stock}
                </p>
                <p className="card-text">
                  <b>Категория:</b> {p.categoryName}
                </p>
                <p className="card-text">
                  <b>Бренд:</b> {p.brandName}
                </p>

                <div className="actions">
                  <button className="btn" onClick={() => startEdit(p)}>
                    Редактировать
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteProduct(p.id)}>
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