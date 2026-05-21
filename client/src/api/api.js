const API_BASE = '/api'

function readJsonFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

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
  return readJsonFromStorage('user', null)
}

export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getCart() {
  return readJsonFromStorage('cart', [])
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

    try {
      const json = JSON.parse(text)
      throw new Error(json.message || json.title || 'Request failed')
    } catch {
      throw new Error(text || 'Request failed')
    }
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }

  return await response.text()
}