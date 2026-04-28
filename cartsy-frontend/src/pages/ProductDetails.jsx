import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, selectCurrentProduct, selectProductsLoading, clearCurrentProduct } from '../features/product/productSlice'
import { addToCart } from '../features/cart/cartSlice'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Loader from '../components/common/Loader'

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector(selectCurrentProduct)
  const loading = useSelector(selectProductsLoading)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => dispatch(clearCurrentProduct())
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart({ productId: product._id, quantity }))
    toast.success(`Added ${quantity} x ${product.name} to cart`)
  }

  if (loading) return <Loader fullPage />
  if (!product) return <div className="text-center py-10">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">&larr; Back</button>
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="md:w-1/2">
          <img src={product.images?.[0]} alt={product.name} className="w-full rounded-lg shadow-md" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl text-blue-600 font-bold mb-4">₹{product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-sm mb-4">Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetails