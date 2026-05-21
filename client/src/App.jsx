import { Link, Route, Routes } from 'react-router-dom'
import { clearToken, getCart, getUser } from './api/api'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import AdminBrandsPage from './pages/AdminBrandsPage'
import AdminProductsPage from './pages/AdminProductsPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import CartPage from './pages/CartPage'

function App() {
  const user = getUser()
  const isAdmin = user?.roles?.includes('Admin')
  const cartCount = getCart().reduce((sum, item) => sum + item.qty, 0)

  const logout = () => {
    clearToken()
    window.location.href = '/'
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>OnlineStore Client</h1>

      <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <Link to="/">Товары</Link>
        {!isAdmin && <Link to="/cart">Корзина ({cartCount})</Link>}
        {!user && <Link to="/login">Вход</Link>}
        {!user && <Link to="/register">Регистрация</Link>}
        {user && <Link to="/orders">{isAdmin ? 'Все заказы' : 'Мои заказы'}</Link>}
        {isAdmin && <Link to="/admin/categories">Категории</Link>}
        {isAdmin && <Link to="/admin/brands">Бренды</Link>}
        {isAdmin && <Link to="/admin/products">Товары</Link>}
        {user && <button onClick={logout}>Выйти</button>}
      </nav>

      {user ? (
        <p>
          Вы вошли как: <b>{user.userName}</b> ({user.roles?.join(', ')})
        </p>
      ) : (
        <p>Вы не авторизованы</p>
      )}

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/brands" element={<AdminBrandsPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App