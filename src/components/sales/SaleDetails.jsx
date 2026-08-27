import React from 'react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import Button from '../common/Button'

const SaleDetails = ({ sale, isOpen, onClose }) => {
  if (!isOpen || !sale) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Sale Details - {sale.invoice_number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Sale Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {sale.customer_name || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {sale.customer_email || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {sale.customer_phone || 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Sale Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Invoice:</span> {sale.invoice_number}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {formatDate(sale.sale_date || sale.created_at)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                    sale.status?.toLowerCase() === 'paid' || sale.status?.toLowerCase() === 'completed'
                      ? 'text-green-800 bg-green-100'
                      : sale.status?.toLowerCase() === 'pending'
                      ? 'text-yellow-800 bg-yellow-100'
                      : 'text-gray-800 bg-gray-100'
                  }`}>
                    {sale.status || 'pending'}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Payment Method:</span> {sale.payment_method || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sale.sale_items && sale.sale_items.length > 0 ? (
                    sale.sale_items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
  {item.product_name || `Product ID: ${item.product_id}`}
</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(item.total_price || item.quantity * item.unit_price)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                        No items in this sale
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatCurrency(sale.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {sale.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{sale.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary">
              Edit Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleDetails