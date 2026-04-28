import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCartAPI, addToCartAPI, updateCartItemAPI, removeCartItemAPI, clearCartAPI } from './cartAPI'

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
  const { auth } = getState()
  if (!auth.user) return { items: [] }
  const response = await fetchCartAPI()
  return response
})

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { getState }) => {
  const { auth } = getState()
  if (!auth.user) {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}')
    const existingItem = guestCart.items.find(item => item.product === productId)
    if (existingItem) existingItem.quantity += quantity
    else guestCart.items.push({ product: productId, quantity })
    localStorage.setItem('guestCart', JSON.stringify(guestCart))
    return guestCart
  }
  const response = await addToCartAPI(productId, quantity)
  return response
})

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { getState }) => {
  const { auth } = getState()
  if (!auth.user) {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}')
    const index = guestCart.items.findIndex(item => item.product === productId)
    if (index !== -1) guestCart.items[index].quantity = quantity
    localStorage.setItem('guestCart', JSON.stringify(guestCart))
    return guestCart
  }
  const response = await updateCartItemAPI(productId, quantity)
  return response
})

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productId, { getState }) => {
  const { auth } = getState()
  if (!auth.user) {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}')
    guestCart.items = guestCart.items.filter(item => item.product !== productId)
    localStorage.setItem('guestCart', JSON.stringify(guestCart))
    return guestCart
  }
  const response = await removeCartItemAPI(productId)
  return response
})

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
  const { auth } = getState()
  if (!auth.user) {
    localStorage.removeItem('guestCart')
    return { items: [] }
  }
  await clearCartAPI()
  return { items: [] }
})

const loadGuestCart = () => {
  const guest = localStorage.getItem('guestCart')
  return guest ? JSON.parse(guest) : { items: [] }
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    syncGuestCart: (state) => {
      const guest = loadGuestCart()
      state.items = guest.items
    },
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchCart.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload.items })
      .addCase(fetchCart.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
      .addCase(addToCart.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(addToCart.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload.items })
      .addCase(addToCart.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
      .addCase(updateCartItem.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(updateCartItem.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload.items })
      .addCase(updateCartItem.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
      .addCase(removeCartItem.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(removeCartItem.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload.items })
      .addCase(removeCartItem.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
      .addCase(clearCart.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(clearCart.fulfilled, (state) => { state.isLoading = false; state.items = [] })
      .addCase(clearCart.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
  },
})

export const { syncGuestCart, clearCartError } = cartSlice.actions
export default cartSlice.reducer

// ✅ SELECTORS (make sure these are exported)
export const selectCartItems = (state) => state.cart.items
export const selectCartLoading = (state) => state.cart.isLoading
export const selectCartError = (state) => state.cart.error
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
}
export const selectCartItemCount = (state) => {
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
}