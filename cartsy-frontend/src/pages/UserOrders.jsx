import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Clock, CheckCircle, Truck, XCircle,
  Eye, X, CreditCard, MapPin
} from 'lucide-react'
import {
  getMyOrders,
  selectMyOrders,
  selectOrdersLoading
} from '../features/order/orderSlice'

const UserOrders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectMyOrders)
  const loading = useSelector(selectOrdersLoading)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  const getPaymentStatus = (order) => {
    if (order.paidAt) return 'Paid'
    if (order.paymentResult?.status === 'paid') return 'Paid'
    return 'Pending'
  }

  const getPaymentColor = (status) =>
    status === 'Paid'
      ? 'text-green-600 bg-green-100'
      : 'text-yellow-600 bg-yellow-100'

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="text-green-500" size={16} />
      case 'Shipped': return <Truck className="text-blue-500" size={16} />
      case 'Processing': return <Clock className="text-yellow-500" size={16} />
      case 'Cancelled': return <XCircle className="text-red-500" size={16} />
      default: return <Package className="text-gray-500" size={16} />
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Shipped': return 'bg-blue-100 text-blue-800'
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
          <div className="h-10 bg-gray-200"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t"></div>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Orders Yet</h1>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const paymentStatus = getPaymentStatus(order)

                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 font-semibold">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentColor(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ CENTERED MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-[95%] max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <p className="text-sm text-gray-500">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)}>
                  <X />
                </button>
              </div>

              {/* Content */}
           <div className="p-6 overflow-y-auto space-y-6">

  {/* 🔥 ORDER SUMMARY */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-gray-50 p-4 rounded">
      <p className="text-sm text-gray-500">Order ID</p>
      <p className="font-mono text-xs break-all">{selectedOrder._id}</p>
    </div>

    <div className="bg-gray-50 p-4 rounded">
      <p className="text-sm text-gray-500">User ID</p>
      <p className="font-mono text-xs">{selectedOrder.user?.slice(-8)}</p>
    </div>

    <div className="bg-gray-50 p-4 rounded">
      <p className="text-sm text-gray-500">Created At</p>
      <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
    </div>

    <div className="bg-gray-50 p-4 rounded">
      <p className="text-sm text-gray-500">Order Status</p>
      <span className={`px-2 py-1 text-xs rounded ${getOrderStatusColor(selectedOrder.status)}`}>
        {selectedOrder.status}
      </span>
    </div>
  </div>

  {/* 💳 PAYMENT INFO */}
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b font-semibold">
      Payment Information
    </div>

    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Payment Method</p>
        <p>{selectedOrder.paymentMethod}</p>
      </div>

      <div>
        <p className="text-gray-500">Payment Status</p>
        <p>{getPaymentStatus(selectedOrder)}</p>
      </div>

      <div>
        <p className="text-gray-500">Payment ID</p>
        <p className="font-mono text-xs break-all">
          {selectedOrder.paymentResult?.id || "N/A"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Email</p>
        <p>{selectedOrder.paymentResult?.email_address || "N/A"}</p>
      </div>

      <div>
        <p className="text-gray-500">Paid At</p>
        <p>
          {selectedOrder.paidAt
            ? new Date(selectedOrder.paidAt).toLocaleString()
            : "Not Paid"}
        </p>
      </div>
    </div>
  </div>

  {/* 🛍️ ORDER ITEMS */}
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b font-semibold">
      Order Items
    </div>

    <div className="divide-y">
      {selectedOrder.items.map((item, i) => (
        <div key={i} className="flex justify-between items-center p-4">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">
              Qty: {item.quantity} × ₹{item.price}
            </p>
          </div>

          <div className="font-semibold text-blue-600">
            ₹{item.price * item.quantity}
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-between p-4 bg-gray-50 font-bold">
      <span>Total</span>
      <span className="text-blue-600">
        ₹{selectedOrder.totalAmount}
      </span>
    </div>
  </div>

  {/* 📍 SHIPPING ADDRESS */}
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b font-semibold">
      Shipping Address
    </div>

    <div className="p-4 text-sm leading-relaxed">
      <p>{selectedOrder.shippingAddress.street}</p>
      <p>
        {selectedOrder.shippingAddress.city},{" "}
        {selectedOrder.shippingAddress.state}
      </p>
      <p>
        {selectedOrder.shippingAddress.postalCode},{" "}
        {selectedOrder.shippingAddress.country}
      </p>
    </div>
  </div>

</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserOrders