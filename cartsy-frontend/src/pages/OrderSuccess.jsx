import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Calendar, MapPin, CreditCard, Download, Printer, ArrowRight, ShieldCheck } from 'lucide-react'
import { selectCurrentOrder } from '../features/order/orderSlice'
import api from '../services/api'
import toast from 'react-hot-toast'
import { downloadInvoiceFile, printInvoice } from '../utils/receiptGenerator'

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
    if (!order) return
    printInvoice(order)
  }

  const handleDownload = () => {
    if (!order) return
    downloadInvoiceFile(order)
    toast.success('Invoice downloaded successfully!')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Package size={32} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-6">We couldn't retrieve the details for this order reference.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4 text-emerald-600">
          <CheckCircle size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm">
          Thank you for your purchase. We have received your order and our team is preparing it for shipment.
        </p>
      </motion.div>

      {/* Main Order Card - Flat & Crisp (No Shadow) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Reference</span>
            <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">{order._id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition"
            >
              <Printer size={15} /> Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
            >
              <Download size={15} /> Download Invoice
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Calendar size={14} className="text-blue-600" /> Date
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <CreditCard size={14} className="text-blue-600" /> Payment Status
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">Paid Verified</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Package size={14} className="text-blue-600" /> Order Status
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {order.status || 'Processing'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Purchased Items</h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-slate-600">₹{Number(item.price).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/80 border-t border-slate-200 text-sm">
                  <tr>
                    <td colSpan="3" className="py-3 px-4 text-right font-bold text-slate-800">Grand Total</td>
                    <td className="py-3 px-4 text-right font-extrabold text-blue-600 text-base">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Shipping & Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin size={15} className="text-slate-500" /> Delivery Address
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold">{order.shippingAddress?.street}</span><br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-slate-500" /> Payment Record
              </h4>
              <div className="text-sm space-y-1 text-slate-700">
                <p><span className="text-slate-500">Gateway:</span> Razorpay Secure</p>
                <p className="font-mono text-xs break-all">
                  <span className="text-slate-500 font-sans">Payment ID:</span> {order.paymentResult?.id || 'Verified'}
                </p>
                <p className="text-xs text-emerald-600 font-medium">✓ Transaction settled & confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition"
        >
          View All My Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess