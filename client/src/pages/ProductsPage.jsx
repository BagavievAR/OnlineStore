import { useEffect, useState } from 'react'
import { addToCart, apiFetch, getUser } from '../api/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const user = getUser()
  const isAdmin = user?.roles?.includes('Admin')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      setError('')

      const data = await apiFetch('/products')

      const normalizedProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : []

      setProducts(normalizedProducts)

      if (
        !Array.isArray(data) &&
        !Array.isArray(data?.items) &&
        !Array.isArray(data?.data)
      ) {
        console.error('Unexpected /products response:', data)
      }
    } catch (err) {
      setError(err.message || 'Не удалось загрузить товары')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart(product) {
    addToCart(product)
    alert(`Товар "${product.title}" добавлен в корзину`)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Каталог товаров</h1>
        <p className="page-subtitle">
          Просмотр товаров интернет-магазина электроники
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="panel">Загрузка товаров...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          Товары не найдены или API вернул неожиданный формат данных
        </div>
      ) : (
        <div className="grid products">
          {products.map((product) => (
            <div className="card" key={product.id}>
              <img
                className="card-image"
                src={product.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                alt={product.title}
              />

              <div className="card-body">
                <div className="badge">
                  {product.brandName || 'Бренд не указан'}
                </div>

                <h2 className="card-title">{product.title}</h2>

                <p className="card-text">
                  {product.description || 'Описание отсутствует'}
                </p>

                <p className="card-text">
                  Категория: {product.categoryName || 'Не указана'}
                </p>

                <p className="card-text">
                  Цена: <b>{product.price} ₽</b>
                </p>

                <p className="card-text">
                  Остаток: {product.stock}
                </p>

                <div className="actions">
                  {!isAdmin && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      В корзину
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage