const API_BASE = 'http://localhost:5182/api'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getUser() {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getCart() {
  const raw = localStorage.getItem('cart')
  return raw ? JSON.parse(raw) : []
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(product) {
  const cart = getCart()
  const existing = cart.find((x) => x.productId === product.id)

  if (existing) {
    existing.qty += 1
  } else {
    cart.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1,
    })
  }

  saveCart(cart)
}

export function updateCartQty(productId, qty) {
  let cart = getCart()

  cart = cart
    .map((item) =>
      item.productId === productId ? { ...item, qty } : item
    )
    .filter((item) => item.qty > 0)

  saveCart(cart)
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.productId !== productId)
  saveCart(cart)
}

export function clearCart() {
  localStorage.removeItem('cart')
}

export async function apiFetch(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Request failed')
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }

  return null
}