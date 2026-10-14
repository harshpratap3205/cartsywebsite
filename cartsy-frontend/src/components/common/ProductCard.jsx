import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { Heart, ShoppingBag, Minus, Plus, Star, Check } from 'lucide-react'
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
      toast.success(`Added ${product.name} to cart`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1)
    else toast.error('Maximum available stock reached')
  }

  const decrementQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1)
  }

  const rating = product.rating || 4.5
  const ratingStars = Math.floor(rating)
  const hasDiscount = product.discount && product.discount > 0
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500/70 transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Top Media Container */}
      <div className="relative bg-slate-50 overflow-hidden">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 flex items-center justify-center hover:bg-white transition"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-500 hover:text-rose-500'}
          />
        </button>

        {/* Category & Discount Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.category && (
            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md">
              {product.category}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="block overflow-hidden aspect-[4/3]">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">{rating}</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition text-sm leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          {/* Price & Stock */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{Number(hasDiscount ? discountedPrice : product.price).toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {product.stock <= 5 && product.stock > 0 ? (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Only {product.stock} left
              </span>
            ) : product.stock === 0 ? (
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Out of Stock
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                In Stock
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart Controls */}
          {product.stock > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50">
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-l-xl disabled:opacity-30 transition"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-xs font-semibold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= product.stock}
                  className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-r-xl disabled:opacity-30 transition"
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 h-8 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition"
              >
                {isAdding ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={13} />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full h-8 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium cursor-not-allowed border border-slate-200"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard