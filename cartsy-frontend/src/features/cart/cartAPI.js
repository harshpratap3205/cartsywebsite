import api from '../../services/api'

export const fetchCartAPI = async () => {
  const { data } = await api.get('/cart')
  return data
}

export const addToCartAPI = async (productId, quantity) => {
  const { data } = await api.post('/cart', { productId, quantity })
  return data
}

export const updateCartItemAPI = async (productId, quantity) => {
  const { data } = await api.put(`/cart/${productId}`, { quantity })
  return data
}

export const removeCartItemAPI = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`)
  return data
}

export const clearCartAPI = async () => {
  // optional: backend might have a clear endpoint, but we'll just remove items one by one
  const { data } = await api.get('/cart')
  for (const item of data.items) {
    await removeCartItemAPI(item.product._id)
  }
}