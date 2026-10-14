import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronUp, Filter, X,
  Star, DollarSign, Tag, SlidersHorizontal, CheckCircle2, RotateCcw
} from 'lucide-react'
import {
  setCategoryFilter,
  setSortFilter,
  setPriceFilter,
  selectFilters,
  resetFilters
} from '../../features/product/productSlice'

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports']
const ratings = [5, 4, 3, 2, 1]

const Sidebar = () => {
  const dispatch = useDispatch()
  const { category, sort, minPrice, maxPrice } = useSelector(selectFilters)

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [localPrice, setLocalPrice] = useState(maxPrice || 200000)
  const [selectedRating, setSelectedRating] = useState(null)
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    ratings: false,
    sort: true,
  })

  useEffect(() => {
    if (maxPrice) setLocalPrice(maxPrice)
  }, [maxPrice])

  const toggleSection = useCallback((section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  // Real-time dispatch when price changes (debounced or on apply)
  const handlePriceChange = (val) => {
    const num = Number(val)
    setLocalPrice(num)
    dispatch(setPriceFilter({ minPrice: 0, maxPrice: num }))
  }

  const handleApplyFilters = () => {
    dispatch(setPriceFilter({ minPrice: 0, maxPrice: localPrice }))
  }

  const handleResetAll = () => {
    dispatch(resetFilters())
    setLocalPrice(200000)
    setSelectedRating(null)
  }

  const FilterSection = ({ title, sectionKey, children, icon: Icon }) => (
    <div className="border-b border-slate-100 pb-3 last:border-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center w-full text-left font-semibold text-slate-800 py-2 hover:text-blue-600 transition cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm">
          {Icon && <Icon size={15} className="text-slate-500" />}
          <span>{title}</span>
        </div>
        <motion.span
          animate={{ rotate: openSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {openSections[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {openSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const FilterContent = () => (
    <div className="p-4 space-y-4">
      {/* Action Buttons: Apply & Reset */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleApplyFilters}
          className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5 py-2 rounded-xl transition cursor-pointer"
        >
          <CheckCircle2 size={13} /> Apply Filters
        </button>
        <button
          onClick={handleResetAll}
          className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 transition cursor-pointer"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Categories */}
      <FilterSection title="Categories" sectionKey="categories" icon={Tag}>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition">
          <input
            type="radio"
            name="category"
            checked={category === ''}
            onChange={() => dispatch(setCategoryFilter(''))}
            className="w-4 h-4 text-blue-600 cursor-pointer accent-blue-600"
          />
          <span className="text-slate-700 text-xs font-medium">All Categories</span>
        </label>
        {categories.map(cat => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition">
            <input
              type="radio"
              name="category"
              checked={category === cat}
              onChange={() => dispatch(setCategoryFilter(cat))}
              className="w-4 h-4 text-blue-600 cursor-pointer accent-blue-600"
            />
            <span className="text-slate-700 text-xs font-medium">{cat}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Max Price Limit" sectionKey="price" icon={DollarSign}>
        <div className="px-1">
          <input
            type="range"
            min="500"
            max="200000"
            step="1000"
            value={localPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-slate-600">
            <span>₹0</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Up to ₹{Number(localPrice).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Customer Ratings" sectionKey="ratings" icon={Star}>
        <div className="space-y-1">
          {ratings.map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating === selectedRating ? null : rating)}
                className="w-4 h-4 text-blue-600 cursor-pointer accent-blue-600"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < rating ? 'text-amber-400' : 'text-slate-300'}`}>★</span>
                ))}
                <span className="ml-1.5 text-slate-600 text-xs">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sort By */}
      <FilterSection title="Sort Ordering" sectionKey="sort" icon={SlidersHorizontal}>
        <select
          value={sort}
          onChange={(e) => dispatch(setSortFilter(e.target.value))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="-createdAt">Newest Arrivals</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop Left Sidebar Panel - Crisp Border, Clean Modern Design */}
      <aside className="hidden md:block w-72 shrink-0 bg-white rounded-2xl border border-slate-200 h-fit sticky top-24 overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <h2 className="font-bold text-xs tracking-wider uppercase flex items-center gap-2">
            <Filter size={15} className="text-blue-400" />
            Filter Products
          </h2>
          {(category || sort !== '-createdAt' || localPrice < 200000) && (
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          )}
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Filter Trigger Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <Filter size={16} />
          Filter & Sort Products
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 border-r border-slate-200 overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-900 text-white">
                <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Filter size={15} className="text-blue-400" /> Filter Products
                </h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar