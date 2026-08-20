import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getTransactions } from "@/services/transactionService";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Financial Transactions
          </h1>

          <p className="text-gray-500">
            All financial movements in the system.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="min-w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Reference</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Income</th>
                <th className="p-3 text-right">Expense</th>
                <th className="p-3 text-right">Balance</th>
                <th className="p-3 text-center">Date</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No transactions yet.
                  </td>
                </tr>

              ) : (

                transactions.map((trx) => (

                  <tr
                    key={trx.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {trx.reference}
                    </td>

                    <td className="p-3">
                      {trx.transaction_type}
                    </td>

                    <td className="p-3">
                      {trx.description}
                    </td>

                    <td className="p-3 text-right text-green-600 font-semibold">
                      {trx.income > 0
                        ? `R ${Number(trx.income).toFixed(2)}`
                        : "-"}
                    </td>

                    <td className="p-3 text-right text-red-600 font-semibold">
                      {trx.expense > 0
                        ? `R ${Number(trx.expense).toFixed(2)}`
                        : "-"}
                    </td>

                    <td className="p-3 text-right font-bold">
                      R {Number(trx.balance || 0).toFixed(2)}
                    </td>

                    <td className="p-3 text-center">
                      {new Date(trx.created_at).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </DashboardLayout>
  );
}