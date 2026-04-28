import api from '../../services/api'

export const createOrderAPI = async (orderData) => {
  const { data } = await api.post('/orders', orderData)
  return data
}

export const createRazorpayOrderAPI = async (orderId) => {
  const { data } = await api.post('/payment/create-order', { orderId })
  return data
}

export const verifyPaymentAPI = async (paymentData) => {
  const { data } = await api.post('/payment/verify', paymentData)
  return data
}
export const getMyOrdersAPI = async () => {
  const { data } = await api.get('/orders/myorders')
  return data
}