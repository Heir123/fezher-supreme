 export default function FinanceAnalyticsTable({ dashboard }) {
  const transactions = dashboard?.financialTransactions || [];

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">
          Financial Transactions
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Recent revenue and received purchase transactions
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="p-6 text-gray-500">
          No financial transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-left p-4">
                  Type
                </th>

                <th className="text-left p-4">
                  Reference
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-right p-4">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id || index}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    {transaction.date
                      ? new Date(
                          transaction.date
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">
                    {transaction.type || "-"}
                  </td>

                  <td className="p-4">
                    {transaction.reference || "-"}
                  </td>

                  <td className="p-4">
                    {transaction.status || "-"}
                  </td>

                  <td className="text-right p-4 font-medium">
                    R{" "}
                    {Number(
                      transaction.amount || 0
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}