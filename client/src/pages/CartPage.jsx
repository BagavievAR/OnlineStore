import { useMemo, useState } from 'react'
import {
  apiFetch,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQty,
} from '../api/api'

export default function CartPage() {
  const [cart, setCart] = useState(getCart())
  const [deliveryAddress, setDeliveryAddress] = useState('Riga, Brivibas 1')
  const [contactPhone, setContactPhone] = useState('+37120000000')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  }, [cart])

  const changeQty = (productId, qty) => {
    updateCartQty(productId, qty)
    setCart(getCart())
  }

  const removeItem = (productId) => {
    removeFromCart(productId)
    setCart(getCart())
  }

  const submitOrder = async () => {
    try {
      if (cart.length === 0) {
        setError('Корзина пуста')
        setMessage('')
        return
      }

      await apiFetch('/Orders', {
        method: 'POST',
        body: JSON.stringify({
          deliveryAddress,
          contactPhone,
          items: cart.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
        }),
      })

      clearCart()
      setCart([])
      setMessage('Заказ успешно оформлен')
      setError('')
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Корзина</h1>
        <p className="page-subtitle">
          Проверь состав заказа, количество товаров и оформи покупку.
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {cart.length === 0 ? (
        <div className="empty-state">Корзина пуста.</div>
      ) : (
        <>
          <div className="grid" style={{ marginBottom: '22px' }}>
            {cart.map((item) => (
              <div className="card" key={item.productId}>
                <div className="card-body">
                  <div className="cart-row">
                    <div>
                      {item.imageUrl ? (
                        <img
                          className="cart-image"
                          src={item.imageUrl}
                          alt={item.title}
                        />
                      ) : (
                        <div
                          className="cart-image"
                          style={{
                            display: 'grid',
                            placeItems: 'center',
                            color: '#6b7280',
                            fontWeight: 600,
                          }}
                        >
                          Нет фото
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="card-title">{item.title}</h2>
                      <p className="card-text">Цена за единицу: {item.price}</p>
                      <p className="card-text">Сумма: {item.price * item.qty}</p>

                      <div className="actions">
                        <div className="qty-box">
                          <button className="btn" onClick={() => changeQty(item.productId, item.qty - 1)}>
                            -
                          </button>
                          <span className="qty-value">{item.qty}</span>
                          <button className="btn" onClick={() => changeQty(item.productId, item.qty + 1)}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeItem(item.productId)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="page-header" style={{ marginBottom: '16px' }}>
              <h2 className="page-title" style={{ fontSize: '24px' }}>Оформление заказа</h2>
              <p className="page-subtitle">Заполни адрес и телефон для доставки.</p>
            </div>

            <div className="form-grid">
              <input
                className="input"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Адрес доставки"
              />

              <input
                className="input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Телефон"
              />

              <p style={{ margin: 0, fontWeight: 700 }}>
                Итого: {total}
              </p>

              <div className="actions">
                <button className="btn btn-primary" onClick={submitOrder}>
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}