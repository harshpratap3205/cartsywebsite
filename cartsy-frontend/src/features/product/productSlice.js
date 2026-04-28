import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProductsAPI, fetchProductByIdAPI } from './productAPI'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters) => {
    const response = await fetchProductsAPI(filters)
    return response
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await fetchProductByIdAPI(id)
    return response
  }
)

const initialState = {
  products: [],
  currentProduct: null,
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    sort: '-createdAt',
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => { state.filters.search = action.payload },
    setCategoryFilter: (state, action) => { state.filters.category = action.payload; state.currentPage = 1 },
    setSortFilter: (state, action) => { state.filters.sort = action.payload; state.currentPage = 1 },
    resetFilters: (state) => {
      state.filters = { search: '', category: '', sort: '-createdAt' }
      state.currentPage = 1
    },
    clearCurrentProduct: (state) => { state.currentProduct = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(fetchProductById.pending, (state) => { state.isLoading = true })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const { setSearchFilter, setCategoryFilter, setSortFilter, resetFilters, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer

// Selectors
export const selectProducts = (state) => state.products.products
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectProductsLoading = (state) => state.products.isLoading
export const selectProductsError = (state) => state.products.error
export const selectFilters = (state) => state.products.filters
export const selectTotalPages = (state) => state.products.totalPages