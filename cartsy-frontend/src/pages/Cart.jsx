import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react'
import { 
  selectCartItems, 
  selectCartTotal, 
  updateCartItem, 
  removeCartItem,
  selectCartLoading 
} from '../features/cart/cartSlice'
import toast from 'react-hot-toast'

const Cart = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const isLoading = useSelector(selectCartLoading)
  const pageRef = useRef(null)

  // Scroll to top on page load
  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await dispatch(updateCartItem({ productId, quantity: newQuantity })).unwrap()
      toast.success('Quantity updated')
    } catch (err) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeCartItem(productId)).unwrap()
      toast.success('Item removed from cart')
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  if (isLoading && items.length === 0) {
    return (
      <div ref={pageRef} className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-100 rounded-xl">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div ref={pageRef} className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items yet.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="flex-1 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link to={`/product/${item.product._id}`}>
                    <h3 className="font-semibold text-lg hover:text-blue-600 transition">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 border-b pb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({items.length} items)</span>
              <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">Free</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <Link to="/checkout">
            <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart