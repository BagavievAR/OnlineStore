import { useEffect, useState } from 'react'
import { apiFetch, getUser } from '../api/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const user = getUser()
  const isAdmin = user?.roles?.includes('Admin')

  const loadOrders = async () => {
    try {
      const endpoint = isAdmin ? '/Orders' : '/Orders/my'
      const data = await apiFetch(endpoint)
      setOrders(data)
      setError('')
    } catch (err) {
      setError(err.message)
      setOrders([])
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isAdmin ? 'Все заказы' : 'Мои заказы'}</h1>
        <p className="page-subtitle">
          {isAdmin
            ? 'Просмотр всех заказов и общей информации по покупкам.'
            : 'История оформленных заказов пользователя.'}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">Заказов пока нет.</div>
      ) : (
        <div className="grid admin">
          {orders.map((order) => (
            <article className="card" key={order.id}>
              <div className="card-body">
                <h2 className="card-title">Заказ #{order.id}</h2>

                <p className="card-text">
                  <b>Статус:</b> {order.status}
                </p>
                <p className="card-text">
                  <b>Дата:</b> {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="card-text">
                  <b>Сумма:</b> {order.total}
                </p>
                <p className="card-text">
                  <b>Адрес:</b> {order.deliveryAddress}
                </p>
                <p className="card-text">
                  <b>Телефон:</b> {order.contactPhone}
                </p>

                {isAdmin && order.userId && (
                  <p className="card-text">
                    <b>UserId:</b> {order.userId}
                  </p>
                )}

                {order.items && order.items.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: 700 }}>Позиции:</p>

                    <div className="grid" style={{ gap: '10px' }}>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            padding: '12px',
                            border: '1px solid #dbe2ea',
                            borderRadius: '12px',
                            background: '#f9fafb',
                          }}
                        >
                          <p style={{ margin: '0 0 6px' }}>
                            <b>Товар:</b> {item.productTitle || `ID ${item.productId}`}
                          </p>
                          <p style={{ margin: '0 0 6px' }}>
                            <b>Количество:</b> {item.qty}
                          </p>
                          <p style={{ margin: 0 }}>
                            <b>Цена:</b> {item.unitPrice}
                          </p>
                        </div>
                      ))}
                    </div>
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