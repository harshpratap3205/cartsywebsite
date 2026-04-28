import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { logout, selectIsAuthenticated, selectUser } from '../../features/auth/authSlice'
import { selectCartItemCount } from '../../features/cart/cartSlice'
import CartDrawer from '../cart/CartDrawer'
import { Menu, X, ShoppingBag, Package, LogOut } from 'lucide-react'

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const cartCount = useSelector(selectCartItemCount)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsMobileMenuOpen(false)
    setIsUserDropdownOpen(false)
  }

  // Public links for all users
  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShopHub
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  My Orders
                </Link>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingBag size={22} className="text-gray-700" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User Area */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-gray-700">{user?.name?.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="py-1">
                          <Link
                            to="/orders"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Package size={16} className="mr-2" /> My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} className="mr-2" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <span className="text-xl font-bold text-blue-600">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg mb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Signup
                  </Link>
                )}
                {/* Public links */}
                {publicLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-3 text-gray-700 border-b border-gray-100 hover:text-blue-600 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Authenticated-only links */}
                {isAuthenticated && (
                  <>
                    <Link
                      to="/orders"
                      className="block py-3 text-gray-700 border-b border-gray-100 hover:text-blue-600 transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-3 text-red-600 hover:text-red-800 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}

export default Navbar