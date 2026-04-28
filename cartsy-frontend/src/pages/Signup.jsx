import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { register } from '../features/auth/authSlice'
import { useAuthRedirect } from '../hooks/useAuthRedirect'
import toast from 'react-hot-toast'
import { ShoppingBag, Truck, Shield, Headphones, User, Mail, Lock } from 'lucide-react'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const dispatch = useDispatch()
  useAuthRedirect('/')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      await dispatch(register({ name, email, password })).unwrap()
      toast.success('Account created successfully')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    }
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join ShopHub!</h1>
            <p className="text-blue-100 text-sm md:text-base mb-8 leading-relaxed">
              Create an account to enjoy faster checkout, order tracking, and exclusive offers.
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
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white underline hover:no-underline transition">
                Sign in
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
            <h2 className="text-2xl font-bold text-gray-800">Create account</h2>
            <p className="text-gray-500 mt-1 mb-6">Fill in your details to get started</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-[0.98] font-medium"
              >
                Sign up
              </button>
            </form>

            <div className="mt-8 text-center md:hidden">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup