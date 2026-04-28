import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react'
import { selectCartItems, selectCartTotal, updateCartItem, removeCartItem } from '../../features/cart/cartSlice'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import CartItem from './CartItem'

const CartDrawer = ({ isOpen, onClose }) => {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const dispatch = useDispatch()

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return
    try {
      await dispatch(updateCartItem({ productId, quantity })).unwrap()
      toast.success('Quantity updated')
    } catch (err) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeCartItem(productId)).unwrap()
      toast.success('Item removed from cart')
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Link to="/cart" onClick={onClose}>
                  <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    View Cart <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer