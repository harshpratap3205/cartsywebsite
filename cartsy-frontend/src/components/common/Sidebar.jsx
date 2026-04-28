import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, ChevronUp, Filter, X, 
  Star, DollarSign, Tag, SlidersHorizontal 
} from 'lucide-react'
import { setCategoryFilter, setSortFilter, selectFilters, resetFilters } from '../../features/product/productSlice'

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports']
const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Dell']
const ratings = [5, 4, 3, 2, 1]

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedRating, setSelectedRating] = useState(null)
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: false,
    ratings: false,
    sort: true,
  })

  const dispatch = useDispatch()
  const { category, sort } = useSelector(selectFilters)

  const toggleSection = useCallback((section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
    // TODO: dispatch brand filter action if needed
  }

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating === selectedRating ? null : rating)
  }

  const handleResetAll = () => {
    dispatch(resetFilters())
    setPriceRange([0, 50000])
    setSelectedBrands([])
    setSelectedRating(null)
    setOpenSections({
      categories: true,
      price: true,
      brands: false,
      ratings: false,
      sort: true,
    })
  }

  const FilterSection = ({ title, sectionKey, children, icon: Icon }) => (
    <div className="border-b border-gray-100 pb-3 last:border-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center w-full text-left font-semibold text-gray-800 py-2 hover:text-blue-600 transition"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          <span>{title}</span>
        </div>
        <motion.span
          animate={{ rotate: openSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {openSections[sectionKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
      {/* Reset Button */}
      <button
        onClick={handleResetAll}
        className="w-full text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
      >
        <SlidersHorizontal size={14} /> Reset All Filters
      </button>

      {/* Categories */}
      <FilterSection title="Categories" sectionKey="categories" icon={Tag}>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="radio"
            name="category"
            checked={category === ''}
            onChange={() => dispatch(setCategoryFilter(''))}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">All</span>
        </label>
        {categories.map(cat => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="category"
              checked={category === cat}
              onChange={() => dispatch(setCategoryFilter(cat))}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700">{cat}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price" icon={DollarSign}>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="50000"
            step="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>₹0</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" sectionKey="brands" icon={Tag}>
        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Customer Ratings" sectionKey="ratings" icon={Star}>
        <div className="space-y-1">
          {ratings.map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === rating}
                onChange={() => handleRatingSelect(rating)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
                <span className="ml-1 text-gray-600 text-sm">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sort By */}
      <FilterSection title="Sort By" sectionKey="sort" icon={SlidersHorizontal}>
        <select
          value={sort}
          onChange={(e) => dispatch(setSortFilter(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 bg-white rounded-xl shadow-lg h-fit sticky top-24 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Filter size={20} />
            Filters
          </h2>
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full bg-white border rounded-lg py-2 flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition"
        >
          <Filter size={18} />
          Filter & Sort
        </button>
      </div>

      {/* Mobile Drawer with Animation */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl overflow-y-auto md:hidden"
            >
              <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Filter size={20} /> Filters
                </h2>
                <button onClick={() => setIsMobileOpen(false)} className="text-white p-1 hover:bg-white/20 rounded transition">
                  <X size={20} />
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