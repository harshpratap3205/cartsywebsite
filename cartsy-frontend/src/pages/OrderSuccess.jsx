import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Calendar, MapPin, CreditCard, Download, Printer } from 'lucide-react'
import { selectCurrentOrder } from '../features/order/orderSlice'
import api from '../services/api'
import toast from 'react-hot-toast'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const storedOrder = useSelector(selectCurrentOrder)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (storedOrder && storedOrder._id === orderId) {
      setOrder(storedOrder)
      setLoading(false)
    } else {
      // Fetch order from API
      const fetchOrder = async () => {
        try {
          const { data } = await api.get(`/orders/${orderId}`)
          setOrder(data)
        } catch (err) {
          console.error('Failed to fetch order', err)
          toast.error('Order not found')
        } finally {
          setLoading(false)
        }
      }
      fetchOrder()
    }
  }, [storedOrder, orderId])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast.info('Download feature coming soon')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <Link to="/" className="text-blue-600">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-semibold">{order._id}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1 px-3 py-1.5 border rounded-lg hover:bg-gray-100">
              <Printer size={16} /> Print
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download size={16} /> Download Invoice
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium text-green-600">
                  {order.paidAt ? 'Paid' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">Qty</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">₹{item.price}</td>
                      <td className="p-3 font-medium">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="text-right p-3 font-bold">Total</td>
                    <td className="p-3 font-bold text-blue-600">₹{order.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin size={18} /> Shipping Address
            </h3>
            <p>
              {order.shippingAddress.street},<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          {order.paymentResult?.id && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <p className="text-sm">
                <span className="text-gray-500">Transaction ID:</span>{' '}
                <span className="font-mono text-xs">{order.paymentResult.id}</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="text-center mt-8">
        <Link to="/">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess