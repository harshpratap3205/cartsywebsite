import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { selectIsAuthenticated } from '../../features/auth/authSlice'

const LoginPopup = () => {
  const [show, setShow] = useState(false)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => setShow(true), 10000) // 10 seconds
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])

  if (isAuthenticated) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-2">Login to continue</h3>
            <p className="text-gray-600 mb-4">Sign in to add items to cart and place orders.</p>
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full mb-2">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="text-blue-600">Create an account</button>
            <button onClick={() => setShow(false)} className="block mt-3 text-gray-500 text-sm w-full">Maybe later</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginPopup