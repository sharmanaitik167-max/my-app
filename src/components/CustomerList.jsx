import { format } from 'date-fns';
import { Edit2, Trash2, Phone, Package, FileDown, Share2 } from 'lucide-react';
import { sendWhatsApp, downloadPdfBill, shareViaNativeShare } from '../utils/billUtils';

// WhatsApp green SVG icon
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function CustomerList({ customers, onEdit, onDelete, onNotify }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const handleWhatsApp = (customer) => {
    const result = sendWhatsApp(customer);
    if (!result.success) {
      onNotify(result.error, 'error');
    } else {
      onNotify(`Bill sent to ${customer.name} via WhatsApp`, 'success');
    }
  };

  const handlePdf = (customer) => {
    downloadPdfBill(customer);
    onNotify(`PDF bill generated for ${customer.name}`, 'success');
  };

  const handleShare = async (customer) => {
    const result = await shareViaNativeShare(customer);
    if (result.success) {
      onNotify(result.fallback ? 'Bill copied to clipboard!' : 'Shared successfully!', 'success');
    } else {
      onNotify(result.error, 'error');
    }
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-base font-medium">No entries found</p>
        <p className="text-gray-400 text-sm mt-1">Add your first customer entry above</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 uppercase text-xs tracking-wider">
              <th className="px-5 py-3.5 font-semibold border-b border-gray-100">Date</th>
              <th className="px-5 py-3.5 font-semibold border-b border-gray-100">Customer</th>
              <th className="px-5 py-3.5 font-semibold border-b border-gray-100">Product</th>
              <th className="px-5 py-3.5 font-semibold border-b border-gray-100 text-right">Amount</th>
              <th className="px-5 py-3.5 font-semibold border-b border-gray-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-orange-50/40 transition-colors border-b border-gray-50 last:border-b-0"
              >
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-700">
                    {format(new Date(customer.date), 'dd MMM yyyy')}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(customer.date), 'hh:mm a')}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-800">{customer.name}</div>
                  {customer.phone && (
                    <div className="flex items-center text-xs text-gray-400 mt-1 gap-1">
                      <Phone size={11} />
                      {customer.phone}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {customer.product}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-bold text-gray-800 text-base">
                    {formatCurrency(customer.amount)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    {/* WhatsApp Button */}
                    <button
                      onClick={() => handleWhatsApp(customer)}
                      className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Send bill via WhatsApp"
                    >
                      <WhatsAppIcon size={16} />
                    </button>
                    {/* PDF Button */}
                    <button
                      onClick={() => handlePdf(customer)}
                      className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download PDF Bill"
                    >
                      <FileDown size={16} />
                    </button>
                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(customer)}
                      className="text-gray-400 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Share via WhatsApp, Telegram, etc."
                    >
                      <Share2 size={16} />
                    </button>
                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(customer)}
                      className="text-gray-400 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete entry for "${customer.name}"?`)) {
                          onDelete(customer.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                {customer.phone && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Phone size={11} /> {customer.phone}
                  </p>
                )}
              </div>
              <span className="text-lg font-bold text-orange-600">
                {formatCurrency(customer.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                  {customer.product}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(customer.date), 'dd MMM')}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {/* WhatsApp */}
                <button
                  onClick={() => handleWhatsApp(customer)}
                  className="text-green-600 hover:text-green-700 p-2 hover:bg-white rounded-lg transition-colors"
                  title="WhatsApp"
                >
                  <WhatsAppIcon size={16} />
                </button>
                {/* PDF */}
                <button
                  onClick={() => handlePdf(customer)}
                  className="text-gray-400 hover:text-blue-600 p-2 hover:bg-white rounded-lg transition-colors"
                  title="PDF"
                >
                  <FileDown size={15} />
                </button>
                {/* Share */}
                <button
                  onClick={() => handleShare(customer)}
                  className="text-gray-400 hover:text-orange-600 p-2 hover:bg-white rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 size={15} />
                </button>
                {/* Edit */}
                <button
                  onClick={() => onEdit(customer)}
                  className="text-gray-400 hover:text-orange-600 p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                {/* Delete */}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete entry for "${customer.name}"?`)) {
                      onDelete(customer.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-600 p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
