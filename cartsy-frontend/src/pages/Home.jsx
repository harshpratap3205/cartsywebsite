import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProducts, selectProducts, selectProductsLoading, selectFilters, selectTotalPages, setSearchFilter } from '../features/product/productSlice'
import { useDebounce } from '../hooks/useDebounce'
import Sidebar from '../components/common/Sidebar'
import ProductCard from '../components/common/ProductCard'
import HeroSlider from '../components/common/HeroSlider'
import InfiniteContentSlider from '../components/common/InfiniteContentSlider'
import SkeletonCard from '../components/common/SkeletonCard'
import CookieConsent from '../components/common/CookieConsent'
import LoginPopup from '../components/common/LoginPopup'
import { Shield, Truck, RefreshCw, Headphones } from 'lucide-react'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const filters = useSelector(selectFilters)
  const totalPages = useSelector(selectTotalPages)
  const { ref, inView } = useInView()
  const debouncedSearch = useDebounce(filters.search, 500)
  const productSectionRef = useRef(null)

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, search: debouncedSearch }))
  }, [dispatch, filters.category, filters.sort, debouncedSearch])

  useEffect(() => {
    if (inView && filters.currentPage < totalPages) {
      dispatch(fetchProducts({ ...filters, page: filters.currentPage + 1 }))
    }
  }, [inView, filters.currentPage, totalPages, dispatch, filters])

  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value))
  }

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const trustBadges = [
    { icon: Truck, text: 'Free Shipping', desc: 'On orders over ₹999' },
    { icon: Shield, text: 'Secure Payment', desc: '100% safe checkout' },
    { icon: RefreshCw, text: 'Easy Returns', desc: '30 days return policy' },
    { icon: Headphones, text: '24/7 Support', desc: 'Dedicated help center' },
  ]

  return (
    <div>
      {/* Split Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left Side - Enhanced Hero Slider */}
          <div className="lg:w-3/5">
            <HeroSlider />
          </div>

          {/* Right Side - Content Section */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Welcome to ShopHub</span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Explore Premium Products Curated for You
              </h1>
              <p className="text-gray-600 mb-6">
                Discover thousands of products at unbeatable prices. Fast delivery, secure payments, and exceptional quality – all in one place.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={scrollToProducts}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md cursor-pointer transform hover:scale-105 duration-200"
                >
                  Shop Now
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition cursor-pointer transform hover:scale-105 duration-200"
                >
                  Learn More
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                {trustBadges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <badge.icon className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-800">{badge.text}</p>
                      <p className="text-xs text-gray-500">{badge.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Promo Bar */}
      <InfiniteContentSlider />

      {/* Main Content Area (Sidebar + Product Grid) */}
      <div ref={productSectionRef} className="container mx-auto px-4 py-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar />
          <div className="flex-1">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No products available</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            {loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}
            <div ref={ref} className="h-10" />
          </div>
        </div>
      </div>

      <CookieConsent />
      <LoginPopup />
    </div>
  )
}

export default Home