import { format } from 'date-fns';

const SHOP = {
  name: 'NatvarNand',
  tagline: 'Cement & Building Materials',
  owner: 'Pradeep Kumar Sharma',
  phone: '9460004889'
};

/**
 * Generate a plain-text bill message for WhatsApp
 */
export function generateBillText(customer) {
  const dateStr = format(new Date(customer.date), 'dd MMM yyyy');
  const amount = new Intl.NumberFormat('en-IN').format(customer.amount);

  return `Namaste ${customer.name},

Thank you for your purchase from *${SHOP.name}*.

🧾 *Bill Details*
━━━━━━━━━━━━━━━
Product: ${customer.product}
Amount: ₹${amount}
Date: ${dateStr}
━━━━━━━━━━━━━━━

For any queries contact: ${SHOP.phone}

— *${SHOP.owner}*
  ${SHOP.name}`;
}

/**
 * Open WhatsApp with a pre-filled bill message
 */
export function sendWhatsApp(customer) {
  if (!customer.phone) {
    return { success: false, error: 'Customer phone number required for WhatsApp' };
  }

  let phone = customer.phone.replace(/[\s\-\+\(\)]/g, '');
  if (phone.length === 10) {
    phone = '91' + phone;
  }

  const message = generateBillText(customer);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
  return { success: true };
}

/**
 * Generate and download a PDF bill using a print-friendly HTML popup
 * Includes the NatvarNand logo
 */
export function downloadPdfBill(customer) {
  const dateStr = format(new Date(customer.date), 'dd MMM yyyy');
  const timeStr = format(new Date(customer.date), 'hh:mm a');
  const amount = new Intl.NumberFormat('en-IN').format(customer.amount);

  // Use logo from public folder — construct absolute URL
  const logoUrl = window.location.origin + '/logo.png';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${customer.name} - ${SHOP.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      padding: 40px;
      color: #1f2937;
      background: #fff;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding-bottom: 24px;
      border-bottom: 3px solid #ea580c;
      margin-bottom: 28px;
    }
    .logo {
      width: 72px;
      height: 72px;
      border-radius: 14px;
      object-fit: cover;
      margin-bottom: 10px;
    }
    .shop-name {
      font-size: 28px;
      font-weight: 800;
      color: #1f2937;
      letter-spacing: -0.5px;
    }
    .shop-name span {
      color: #ea580c;
    }
    .shop-tagline {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 2.5px;
    }
    .shop-contact {
      font-size: 13px;
      color: #4b5563;
      margin-top: 8px;
    }
    .bill-title {
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #9ca3af;
      margin-bottom: 24px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .details-table tr {
      border-bottom: 1px solid #f3f4f6;
    }
    .details-table td {
      padding: 14px 0;
      font-size: 14px;
    }
    .details-table .label {
      color: #6b7280;
      font-weight: 600;
      width: 140px;
    }
    .details-table .value {
      color: #111827;
      font-weight: 500;
    }
    .amount-row {
      border-bottom: 2px solid #ea580c !important;
    }
    .amount-row .value {
      font-size: 24px;
      font-weight: 800;
      color: #ea580c;
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 2px dashed #e5e7eb;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }
    .footer .owner {
      font-size: 15px;
      font-weight: 600;
      color: #374151;
      margin-top: 12px;
    }
    .thank-you {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      font-style: italic;
      margin-bottom: 20px;
      padding: 12px;
      background: #fef3c7;
      border-radius: 10px;
    }
    @media print {
      body { padding: 20px; }
      @page { margin: 15mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" class="logo" alt="NatvarNand" onerror="this.style.display='none'" />
    <div class="shop-name">Natvar<span>Nand</span></div>
    <div class="shop-tagline">${SHOP.tagline}</div>
    <div class="shop-contact">📞 ${SHOP.phone}</div>
  </div>

  <div class="bill-title">— Invoice —</div>

  <table class="details-table">
    <tr>
      <td class="label">Customer</td>
      <td class="value">${customer.name}</td>
    </tr>
    ${customer.phone ? `<tr>
      <td class="label">Phone</td>
      <td class="value">${customer.phone}</td>
    </tr>` : ''}
    <tr>
      <td class="label">Product</td>
      <td class="value">${customer.product}</td>
    </tr>
    <tr>
      <td class="label">Date</td>
      <td class="value">${dateStr} at ${timeStr}</td>
    </tr>
    <tr class="amount-row">
      <td class="label">Amount</td>
      <td class="value">₹${amount}</td>
    </tr>
  </table>

  <div class="thank-you">🙏 Thank you for your purchase!</div>

  <div class="footer">
    <div class="owner">${SHOP.owner}</div>
    <p>Proprietor, ${SHOP.name}</p>
    <p>Contact: ${SHOP.phone}</p>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=650,height=850');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

/**
 * Share sale details using Web Share API (WhatsApp, Telegram, etc.)
 * Falls back to clipboard copy if not supported.
 */
export async function shareViaNativeShare(customer) {
  const text = generateBillText(customer);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Invoice - ${customer.name} | ${SHOP.name}`,
        text: text
      });
      return { success: true };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Share cancelled' };
      }
      return { success: false, error: 'Failed to share' };
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, fallback: true };
    } catch {
      return { success: false, error: 'Sharing not supported on this browser' };
    }
  }
}
