import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCartItems, selectCartTotal, clearCart } from '../features/cart/cartSlice'
import { createOrder, createRazorpayOrder, verifyPayment, resetOrderState } from '../features/order/orderSlice'
import { loadRazorpayScript } from '../utils/razorpay'
import toast from 'react-hot-toast'

const Checkout = () => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  })
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !phone || !address.street || !address.city || !address.state || !address.postalCode) {
      toast.error('Please fill all fields (name, phone, and address)')
      return
    }
    setIsProcessing(true)
    try {
      // 1. Create order – ONLY shipping address fields, no name/phone
      const orderData = {
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      }
      const orderResult = await dispatch(createOrder(orderData)).unwrap()
      const orderId = orderResult._id

      // 2. Create Razorpay order
      const razorpayResult = await dispatch(createRazorpayOrder(orderId)).unwrap()
      const { razorpayOrderId, amount } = razorpayResult

      // 3. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Payment gateway failed to load')
        setIsProcessing(false)
        return
      }

      // 4. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'ShopHub',
        order_id: razorpayOrderId,
        prefill: { name, contact: phone },
        handler: async (response) => {
          // 5. Verify payment
          const verifyResult = await dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId,
          })).unwrap()
          if (verifyResult.success) {
            toast.success('Payment successful! Order placed.')
            dispatch(clearCart())
            navigate(`/order-success/${orderId}`)
          } else {
            toast.error('Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            toast.error('Payment cancelled')
          },
        },
      }
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      toast.error(err.message || 'Failed to process order')
    } finally {
      setIsProcessing(false)
      dispatch(resetOrderState())
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </form>

        <div className="lg:w-80 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Your Order</h2>
          {items.map(item => (
            <div key={item.product._id} className="flex justify-between text-sm mb-2">
              <span>{item.product.name} x{item.quantity}</span>
              <span>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout