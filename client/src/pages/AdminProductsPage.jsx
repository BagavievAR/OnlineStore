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
      <h2>Админ: Товары</h2>

      <form
        onSubmit={submitProduct}
        style={{ display: 'grid', gap: '10px', maxWidth: '520px', marginBottom: '20px' }}
      >
        <input
          placeholder="Название"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        <input
          placeholder="Цена"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Остаток"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Прямая ссылка на изображение"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <select
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

        <label>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />{' '}
          Опубликован
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">
            {editingId ? 'Сохранить изменения' : 'Добавить товар'}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '12px' }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              borderRadius: '8px',
              background: '#fff',
            }}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.title}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              />
            )}

            <h3>{p.title}</h3>
            <p>Цена: {p.price}</p>
            <p>Остаток: {p.stock}</p>
            <p>Категория: {p.categoryName}</p>
            <p>Бренд: {p.brandName}</p>
            <p>Статус: {p.isPublished ? 'Опубликован' : 'Скрыт'}</p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => startEdit(p)}>Редактировать</button>
              <button onClick={() => deleteProduct(p.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}