import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { login } from '../features/auth/authSlice'
import { useAuthRedirect } from '../hooks/useAuthRedirect'
import toast from 'react-hot-toast'
import { ShoppingBag, Truck, Shield, Headphones, Mail, Lock } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const dispatch = useDispatch()
  useAuthRedirect('/')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(login({ email, password })).unwrap()
      toast.success('Logged in successfully')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    }
  }

  const fillDemo = () => {
    setEmail('demo@shophub.com')
    setPassword('demo123')
    setShowDemo(true)
  }

  const benefits = [
    { icon: ShoppingBag, text: 'Shop thousands of products' },
    { icon: Truck, text: 'Free shipping on orders ₹999+' },
    { icon: Shield, text: 'Secure payment gateway' },
    { icon: Headphones, text: '24/7 customer support' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Brand Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 p-8 md:p-10 text-white flex flex-col justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-blue-100 text-sm md:text-base mb-8 leading-relaxed">
              Log in to access your account, track orders, and enjoy a seamless shopping experience.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <benefit.icon size={20} className="text-blue-200 flex-shrink-0" />
                  <span className="text-sm md:text-base">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-blue-500">
            <p className="text-sm text-blue-200">
              New to ShopHub?{' '}
              <Link to="/signup" className="font-semibold text-white underline hover:no-underline transition">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:w-1/2 p-6 md:p-10"
        >
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
            <p className="text-gray-500 mt-1 mb-6">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-[0.98] font-medium"
              >
                Sign in
              </button>
            </form>


            <div className="mt-8 text-center md:hidden">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login