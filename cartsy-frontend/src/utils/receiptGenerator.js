// cartsy-frontend/src/utils/receiptGenerator.js

/**
 * Formats currency in INR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

/**
 * Generates an official HTML invoice / receipt
 */
export const generateInvoiceHtml = (order) => {
  const orderId = order._id || 'N/A'
  const shortId = orderId.slice(-8).toUpperCase()
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN')

  const items = order.items || []
  const subtotal = order.totalAmount || 0
  const paymentId = order.paymentResult?.id || 'PAID_ONLINE'
  const paymentMethod = order.paymentMethod || 'Razorpay / Online'
  const shipping = order.shippingAddress || {}

  const itemsHtml = items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px; font-weight: 500; color: #1e293b;">
          ${idx + 1}. ${item.name}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #475569;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; color: #475569;">
          ₹${Number(item.price).toLocaleString('en-IN')}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #0f172a;">
          ₹${(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt_Order_${shortId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f8fafc; color: #0f172a; padding: 32px 16px; }
    .receipt-container {
      max-width: 720px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 36px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      color: #2563eb;
      letter-spacing: -0.5px;
    }
    .receipt-badge {
      display: inline-block;
      background: #dcfce7;
      color: #15803d;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 6px;
    }
    .meta-box {
      text-align: right;
    }
    .meta-title { font-size: 20px; font-weight: 700; color: #0f172a; }
    .meta-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .grid h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .grid p { font-size: 14px; color: #1e293b; line-height: 1.5; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #f1f5f9;
      padding: 10px 8px;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .totals {
      margin-left: auto;
      max-width: 280px;
      margin-bottom: 32px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      color: #475569;
    }
    .totals-row.grand {
      border-top: 2px solid #e2e8f0;
      margin-top: 8px;
      padding-top: 10px;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }
    .footer {
      border-top: 1px dashed #cbd5e1;
      padding-top: 20px;
      text-align: center;
      color: #64748b;
      font-size: 12px;
      line-height: 1.6;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .receipt-container { border: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div>
        <div class="logo">Cartsy ShopHub</div>
        <span class="receipt-badge">Payment Completed</span>
      </div>
      <div class="meta-box">
        <div class="meta-title">TAX INVOICE</div>
        <div class="meta-sub">Invoice #: INV-${shortId}</div>
        <div class="meta-sub">Date: ${orderDate}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <h4>Billed / Shipped To</h4>
        <p><strong>${shipping.street || 'Customer Address'}</strong></p>
        <p>${shipping.city || ''} ${shipping.state ? ', ' + shipping.state : ''}</p>
        <p>${shipping.postalCode || ''} ${shipping.country ? ', ' + shipping.country : ''}</p>
      </div>
      <div>
        <h4>Payment Summary</h4>
        <p><strong>Method:</strong> ${paymentMethod}</p>
        <p><strong>Status:</strong> Paid</p>
        <p><strong>Txn ID:</strong> <span style="font-family: monospace; font-size: 11px;">${paymentId}</span></p>
        <p><strong>Order Ref:</strong> <span style="font-family: monospace; font-size: 11px;">${orderId}</span></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Item Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>₹${Number(subtotal).toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row">
        <span>Shipping & Handling</span>
        <span style="color: #16a34a; font-weight: 600;">FREE</span>
      </div>
      <div class="totals-row">
        <span>Taxes (Included)</span>
        <span>₹0</span>
      </div>
      <div class="totals-row grand">
        <span>Total Paid</span>
        <span>₹${Number(subtotal).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for shopping with <strong>Cartsy</strong>! We hope you love your order.</p>
      <p>For questions or support, contact support@cartsywebsite.com or visit our help center.</p>
      <p style="margin-top: 8px; font-size: 10px; color: #94a3b8;">This is a computer-generated tax invoice. No signature required.</p>
    </div>
  </div>
</body>
</html>
`
}

/**
 * Downloads invoice as an HTML / Print-ready receipt file
 */
export const downloadInvoiceFile = (order) => {
  const shortId = (order._id || 'receipt').slice(-8).toUpperCase()
  const htmlContent = generateInvoiceHtml(order)
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Invoice_Cartsy_${shortId}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Opens print preview window for the invoice
 */
export const printInvoice = (order) => {
  const htmlContent = generateInvoiceHtml(order)
  const printWindow = window.open('', '_blank', 'width=800,height=900')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 400)
  }
}
