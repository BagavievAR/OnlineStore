import { useEffect, useState } from 'react'
import { apiFetch, getUser } from '../api/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const user = getUser()

  const loadOrders = async () => {
    try {
      const endpoint = user?.roles?.includes('Admin') ? '/Orders' : '/Orders/my'
      const data = await apiFetch(endpoint)
      setOrders(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div>
      <h2>{user?.roles?.includes('Admin') ? 'Все заказы' : 'Мои заказы'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '12px' }}>
        {orders.map((o) => (
          <div key={o.id} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <p><b>ID:</b> {o.id}</p>
            <p><b>UserId:</b> {o.userId}</p>
            <p><b>Status:</b> {o.status}</p>
            <p><b>Total:</b> {o.total}</p>
            <p><b>Address:</b> {o.deliveryAddress}</p>
            <p><b>Phone:</b> {o.contactPhone}</p>

            <ul>
              {o.items.map((item) => (
                <li key={item.id}>
                  {item.productTitle} — {item.qty} x {item.unitPrice}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}