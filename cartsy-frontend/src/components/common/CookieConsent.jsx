import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CookieConsent = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50"
        >
          <p className="text-sm">We use cookies to improve your experience. By continuing, you agree to our use of cookies.</p>
          <button onClick={accept} className="mt-3 bg-blue-600 px-4 py-1 rounded text-sm hover:bg-blue-700">
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent