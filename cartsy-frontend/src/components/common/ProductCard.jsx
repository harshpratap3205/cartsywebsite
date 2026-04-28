import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-react'
import { addToCart } from '../../features/cart/cartSlice'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const dispatch = useDispatch()

  const handleAddToCart = async () => {
    if (product.stock === 0) return
    setIsAdding(true)
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap()
      toast.success(`Added ${quantity} x ${product.name} to cart`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1)
    else toast.error('Out of stock')
  }

  const decrementQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1)
  }

  // Placeholder rating (3.8 stars) – you can replace with product.rating if available
  const rating = product.rating || 4.2
  const ratingStars = Math.floor(rating)
  const hasDiscount = product.discount && product.discount > 0
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition"
      >
        <Heart
          size={18}
          className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
        />
      </button>

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {product.discount}% OFF
        </div>
      )}

      {/* Image Section */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>

      {/* Content Section */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < ratingStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({rating})</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>

        {/* Price Section */}
        <div className="mt-3 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-blue-600">₹{discountedPrice.toFixed(0)}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-orange-500 mt-1">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}

        {/* Quantity & Add to Cart */}
        {product.stock > 0 ? (
          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex items-center border rounded-md">
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={incrementQty}
                disabled={quantity >= product.stock}
                className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
              <span>{isAdding ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full mt-4 bg-gray-300 text-gray-600 py-2 rounded-lg text-sm cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard