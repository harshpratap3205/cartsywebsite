import { useState } from 'react'
import { Trash2, Plus, Minus } from 'lucide-react'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const product = item.product

  const handleUpdate = async (newQuantity) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      await onUpdateQuantity(product._id, newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await onRemove(product._id)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/60'}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h4>
        <p className="text-blue-600 font-medium text-sm">₹{product.price}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleUpdate(item.quantity - 1)}
              disabled={isUpdating}
              className="px-1.5 py-0.5 hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => handleUpdate(item.quantity + 1)}
              disabled={isUpdating}
              className="px-1.5 py-0.5 hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
          >
            <Trash2 size={12} /> {isRemoving ? '...' : 'Remove'}
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-800">
          ₹{(product.price * item.quantity).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}

export default CartItem