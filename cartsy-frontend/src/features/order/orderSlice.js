import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrderAPI, createRazorpayOrderAPI, verifyPaymentAPI, getMyOrdersAPI } from './orderAPI'

export const createOrder = createAsyncThunk('order/createOrder', async (orderData) => {
  const response = await createOrderAPI(orderData)
  return response
})

export const createRazorpayOrder = createAsyncThunk('order/createRazorpayOrder', async (orderId) => {
  const response = await createRazorpayOrderAPI(orderId)
  return response
})

export const verifyPayment = createAsyncThunk('order/verifyPayment', async (paymentData) => {
  const response = await verifyPaymentAPI(paymentData)
  return response
})

// ✅ NEW: Fetch logged-in user's orders
export const getMyOrders = createAsyncThunk('order/getMyOrders', async () => {
  const response = await getMyOrdersAPI()
  return response
})

const initialState = {
  currentOrder: null,
  razorpayOrder: null,
  paymentStatus: 'idle', // idle, processing, success, failed
  myOrders: [],           // ✅ store user's order history
  isLoading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null
      state.razorpayOrder = null
      state.paymentStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => { state.isLoading = true })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Razorpay order
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.razorpayOrder = action.payload
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => { state.paymentStatus = 'processing' })
      .addCase(verifyPayment.fulfilled, (state) => { state.paymentStatus = 'success' })
      .addCase(verifyPayment.rejected, (state) => { state.paymentStatus = 'failed' })
      // ✅ Get my orders
      .addCase(getMyOrders.pending, (state) => { state.isLoading = true })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.myOrders = action.payload
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const { resetOrderState } = orderSlice.actions
export default orderSlice.reducer

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder
export const selectPaymentStatus = (state) => state.order.paymentStatus
export const selectMyOrders = (state) => state.order.myOrders
export const selectOrdersLoading = (state) => state.order.isLoading