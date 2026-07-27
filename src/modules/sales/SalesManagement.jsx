import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getSales } from "@/services/salesService";
import SaleDialog from "./SaleDialog";

export default function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      setLoading(true);

      const data = await getSales();

      setSales(data || []);
    } catch (error) {
      console.error("Failed to load sales:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSales = useMemo(() => {
    return sales.filter((sale) =>
      (sale.invoice_number || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [sales, search]);

  function printInvoice(sale) {
  const printWindow = window.open("", "_blank");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Invoice ${sale.invoice_number}</title>

    <style>
     body {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 900px;
  margin: auto;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 10px;
}

.company-name {
  font-size: 32px;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 5px;
}

.company-details {
  line-height: 1.4;
  color: #555;
  font-size: 14px;
}

hr {
  margin: 15px 0;
}

.invoice-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 15px;
}

.invoice-info p {
  margin: 4px 0;
}

    table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

      th {
        background: #f3f4f6;
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }

      td {
        border: 1px solid #ddd;
        padding: 12px;
      }

      .total {
  margin-top: 15px;
  text-align: right;
  font-size: 22px;
  font-weight: bold;
}

      .thank-you {
        margin-top: 50px;
        text-align: center;
        color: #666;
        font-size: 16px;
      }

      .footer {
        margin-top: 40px;
        text-align: center;
        color: #888;
        font-size: 13px;
      }
    </style>
  </head>

  <body>

    <div class="header">

      <div class="company-name">
        Fezher Supreme
      </div>

      <div class="company-details">
        Johannesburg, South Africa<br>
        +27 78 482 2311<br>
        info@fezhersupreme.com<br>
        www.fezhersupreme.com
      </div>

    </div>

    <hr>

    <div class="invoice-title">
      SALES INVOICE
    </div>

    <div class="invoice-info">

      <p>
        <strong>Invoice Number:</strong>
        ${sale.invoice_number}
      </p>

      <p>
        <strong>Customer:</strong>
        ${sale.customers?.name || "Walk-in Customer"}
      </p>

      <p>
        <strong>Date:</strong>
        ${new Date(sale.created_at).toLocaleDateString()}
      </p>

      <p>
        <strong>Status:</strong>
        ${sale.status || "Paid"}
      </p>

      <p>
        <strong>Payment Method:</strong>
        Cash
      </p>

    </div>

    <table>

      <thead>
        <tr>
          <th>Description</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Sale</td>
          <td>
            R ${Number(sale.total_amount || 0).toFixed(2)}
          </td>
        </tr>
      </tbody>

    </table>

    <div class="total">
      Total: R ${Number(sale.total_amount || 0).toFixed(2)}
    </div>

    <div class="thank-you">
      Thank you for your business.<br>
      We appreciate your support.
    </div>

    <div class="footer">
      Powered by Fezher Supreme ERP
    </div>

  </body>
  </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
}

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Sales Management
            </h1>

            <p className="text-gray-500">
              Manage sales and invoices.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + New Sale
          </button>

        </div>

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Search invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="text-center py-10">
            Loading sales...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="min-w-full">

              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">
                    Invoice
                  </th>

                  <th className="p-3 text-left">
                    Customer
                  </th>

                  <th className="p-3 text-right">
                    Amount
                  </th>

                  <th className="p-3 text-center">
                    Status
                  </th>

                  <th className="p-3 text-center">
                    Date
                  </th>

                  <th className="p-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No sales found.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-t"
                    >
                      <td className="p-3">
                        {sale.invoice_number}
                      </td>

                      <td className="p-3">
                        {sale.customers?.name || "-"}
                      </td>

                      <td className="p-3 text-right">
                        R {Number(
                          sale.total_amount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="p-3 text-center">
                        {sale.status}
                      </td>

                      <td className="p-3 text-center">
                        {new Date(
                          sale.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => printInvoice(sale)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        )}

        <SaleDialog
          open={open}
          onClose={() => {
            setOpen(false);
            loadSales();
          }}
        />

      </div>
    </DashboardLayout>
  );
}