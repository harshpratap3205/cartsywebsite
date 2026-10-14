import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Clock, CheckCircle, Truck, XCircle,
  Eye, X, CreditCard, MapPin, Download, Printer, ArrowLeft
} from 'lucide-react'
import {
  getMyOrders,
  selectMyOrders,
  selectOrdersLoading
} from '../features/order/orderSlice'
import { downloadInvoiceFile, printInvoice } from '../utils/receiptGenerator'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

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

  const getPaymentBadge = (status) =>
    status === 'Paid'
      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
      : 'text-amber-700 bg-amber-50 border border-amber-200'

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="text-emerald-500" size={14} />
      case 'Shipped': return <Truck className="text-blue-500" size={14} />
      case 'Processing': return <Clock className="text-amber-500" size={14} />
      case 'Cancelled': return <XCircle className="text-rose-500" size={14} />
      default: return <Package className="text-slate-500" size={14} />
    }
  }

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'Shipped': return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'Processing': return 'bg-amber-50 text-amber-700 border border-amber-200'
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border border-rose-200'
      default: return 'bg-slate-100 text-slate-700 border border-slate-200'
    }
  }

  const handleDownloadInvoice = (order) => {
    downloadInvoiceFile(order)
    toast.success('Invoice downloaded successfully!')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Package size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h1>
        <p className="text-slate-500 mb-6">Looks like you haven't placed any orders yet. Discover our latest items!</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Review your recent order history and download invoices</p>
        </div>
        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {/* Orders Table - Crisp Border, No Shadows */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const paymentStatus = getPaymentStatus(order)

                return (
                  <tr key={order._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-medium text-slate-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-slate-600">
                      {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${getPaymentBadge(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold ${getOrderStatusBadge(order.status)}`}>
                        {getOrderStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          title="Download Invoice"
                          className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
                        >
                          <Eye size={13} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Centered Modal - Crisp Border, Clean Backdrop */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-200 px-6 py-4 bg-slate-50/70">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ID: {selectedOrder._id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => printInvoice(selectedOrder)}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    <Printer size={13} /> Print
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                  >
                    <Download size={13} /> Invoice
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-5 text-sm">
                {/* Meta summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Order Status</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedOrder.status}</p>
                  </div>

                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Payment</p>
                    <p className="font-semibold text-emerald-700 mt-0.5">{getPaymentStatus(selectedOrder)}</p>
                  </div>

                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Order Date</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Grand Total</p>
                    <p className="font-extrabold text-blue-600 mt-0.5">
                      ₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-semibold text-xs text-slate-700 uppercase tracking-wider">
                    Purchased Items
                  </div>
                  <div className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3.5">
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                    <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-500" /> Shipping Address
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                      {selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                    <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CreditCard size={14} className="text-slate-500" /> Payment Info
                    </h4>
                    <div className="text-slate-600 text-xs space-y-1">
                      <p><span className="text-slate-400">Method:</span> {selectedOrder.paymentMethod || 'Razorpay'}</p>
                      <p className="font-mono text-[11px] break-all">
                        <span className="text-slate-400 font-sans">Txn ID:</span> {selectedOrder.paymentResult?.id || 'Verified'}
                      </p>
                      <p><span className="text-slate-400">Paid At:</span> {selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString('en-IN') : 'Completed'}</p>
                    </div>
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