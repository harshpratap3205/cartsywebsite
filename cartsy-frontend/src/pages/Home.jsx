import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectFilters,
  selectTotalPages,
  setSearchFilter,
  resetFilters,
} from '../features/product/productSlice'
import { useDebounce } from '../hooks/useDebounce'
import Sidebar from '../components/common/Sidebar'
import ProductCard from '../components/common/ProductCard'
import HeroSlider from '../components/common/HeroSlider'
import InfiniteContentSlider from '../components/common/InfiniteContentSlider'
import SkeletonCard from '../components/common/SkeletonCard'
import CookieConsent from '../components/common/CookieConsent'
import LoginPopup from '../components/common/LoginPopup'
import { Shield, Truck, RefreshCw, Headphones, Search, X, Sparkles } from 'lucide-react'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductsLoading)
  const filters = useSelector(selectFilters)
  const totalPages = useSelector(selectTotalPages)
  const { ref, inView } = useInView()
  const debouncedSearch = useDebounce(filters.search, 400)
  const productSectionRef = useRef(null)

  useEffect(() => {
    dispatch(
      fetchProducts({
        ...filters,
        search: debouncedSearch,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      })
    )
  }, [
    dispatch,
    filters.category,
    filters.sort,
    filters.minPrice,
    filters.maxPrice,
    debouncedSearch,
  ])

  useEffect(() => {
    if (inView && filters.currentPage < totalPages) {
      dispatch(fetchProducts({ ...filters, page: filters.currentPage + 1 }))
    }
  }, [inView, filters.currentPage, totalPages, dispatch, filters])

  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value))
  }

  const clearSearch = () => {
    dispatch(setSearchFilter(''))
  }

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const trustBadges = [
    { icon: Truck, text: 'Free Express Shipping', desc: 'On orders over ₹999' },
    { icon: Shield, text: 'Secure Payments', desc: 'Protected by Razorpay' },
    { icon: RefreshCw, text: 'Instant Returns', desc: '30-day hassle-free policy' },
    { icon: Headphones, text: '24/7 Support', desc: 'Dedicated customer care' },
  ]

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Split Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left Side - Hero Slider */}
          <div className="lg:w-3/5">
            <HeroSlider />
          </div>

          {/* Right Side - Crisp Clean Promotional Box (No Heavy Shadows) */}
          <div className="lg:w-2/5 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold tracking-wide uppercase mb-3">
                <Sparkles size={13} /> Official ShopHub Store
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Next-Gen Tech & Premium Lifestyle Gear
              </h1>

              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Browse our curated selection of 60+ verified electronics, designer wear, essential books, and home accessories.
              </p>

              <div className="flex flex-wrap gap-3 my-6">
                <button
                  onClick={scrollToProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer"
                >
                  Explore Catalog
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer"
                >
                  Our Story
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-100">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-600 shrink-0">
                      <badge.icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-800">{badge.text}</p>
                      <p className="text-[11px] text-slate-500">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Promo Bar */}
      <InfiniteContentSlider />

      {/* Main Content Area (Sidebar on Left + Products Grid on Right) */}
      <div ref={productSectionRef} className="container mx-auto px-4 py-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar Filter Panel */}
          <Sidebar />

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Top Search & Filter Status Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by title or keyword..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-9 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {filters.search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <span>
                  Showing <strong className="text-slate-900">{products.length}</strong> items
                </span>
                {filters.category && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                    {filters.category}
                  </span>
                )}
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
                <p className="text-slate-700 font-semibold mb-1">No products match your criteria</p>
                <p className="text-xs text-slate-500 mb-4">Try clearing filters or search term.</p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
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