import api from '../../services/api'

export const fetchProductsAPI = async ({ page = 1, limit = 12, search = '', category = '', sort = '-createdAt' }) => {
  const params = { page, limit, search, category, sort }
  const { data } = await api.get('/products', { params })
  return data
}

export const fetchProductByIdAPI = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}