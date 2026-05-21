import { useEffect, useState } from 'react'
import { addToCart, apiFetch, getUser } from '../api/api'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const user = getUser()

  const loadProducts = async () => {
    try {
      const data = await apiFetch('/Products')
      setProducts(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product)
    setMessage(`Товар "${product.title}" добавлен в корзину`)
    setError('')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Каталог товаров</h1>
        <p className="page-subtitle">
          Электроника, бренды и категории в одном удобном каталоге.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">Товары пока не найдены.</div>
      ) : (
        <div className="grid products">
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
                  <b>Бренд:</b> {p.brandName}
                </p>
                <p className="card-text">
                  <b>Категория:</b> {p.categoryName}
                </p>
                <p className="card-text">
                  <b>Цена:</b> {p.price}
                </p>
                <p className="card-text">
                  <b>Остаток:</b> {p.stock}
                </p>
                <p className="card-text">{p.description}</p>

                {user && !user.roles?.includes('Admin') && (
                  <div className="actions">
                    <button className="btn btn-primary" onClick={() => handleAddToCart(p)}>
                      В корзину
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}