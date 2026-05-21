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
      <h2>Товары</h2>
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
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              />
            )}

            <h3>{p.title}</h3>
            <p>Бренд: {p.brandName}</p>
            <p>Категория: {p.categoryName}</p>
            <p>Цена: {p.price}</p>
            <p>Остаток: {p.stock}</p>
            <p>{p.description}</p>

            {user && !user.roles?.includes('Admin') && (
              <button onClick={() => handleAddToCart(p)}>В корзину</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}