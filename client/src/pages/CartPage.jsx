import { useMemo, useState } from 'react'
import { apiFetch, clearCart, getCart, removeFromCart, updateCartQty } from '../api/api'

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
      <h2>Корзина</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            {cart.map((item) => (
              <div
                key={item.productId}
                style={{
                  border: '1px solid #ccc',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#fff',
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '140px',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '10px',
                    }}
                  />
                )}

                <h3>{item.title}</h3>
                <p>Цена: {item.price}</p>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button onClick={() => changeQty(item.productId, item.qty - 1)}>-</button>
                  <span>Количество: {item.qty}</span>
                  <button onClick={() => changeQty(item.productId, item.qty + 1)}>+</button>
                </div>

                <p>Сумма: {item.price * item.qty}</p>

                <button onClick={() => removeItem(item.productId)}>Удалить</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '10px', maxWidth: '420px' }}>
            <input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Адрес доставки"
            />
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Телефон"
            />
            <p><b>Итого:</b> {total}</p>
            <button onClick={submitOrder}>Оформить заказ</button>
          </div>
        </>
      )}
    </div>
  )
}