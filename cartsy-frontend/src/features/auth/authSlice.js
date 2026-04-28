import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, logoutUser } from './authAPI'

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await loginUser(email, password)
  localStorage.setItem('accessToken', response.accessToken)
  localStorage.setItem('refreshToken', response.refreshToken)
  localStorage.setItem('user', JSON.stringify(response))
  return response
})

export const register = createAsyncThunk('auth/register', async ({ name, email, password }) => {
  const response = await registerUser(name, email, password)
  localStorage.setItem('accessToken', response.accessToken)
  localStorage.setItem('refreshToken', response.refreshToken)
  localStorage.setItem('user', JSON.stringify(response))
  return response
})

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (refreshToken) await logoutUser(refreshToken)
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
})

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { clearError: (state) => { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload })
      .addCase(register.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message })
      .addCase(logout.fulfilled, (state) => { state.user = null })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => !!state.auth.user
export const selectAuthLoading = (state) => state.auth.isLoading