import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import UserOrders from '../pages/UserOrders'
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected routes for users */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="orders" element={<UserOrders />} /> 
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes