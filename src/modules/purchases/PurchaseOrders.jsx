import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PurchaseForm from "./PurchaseForm";
import { supabase } from "@/services/supabase";

export default function PurchaseOrders() {
  const [open, setOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        suppliers(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPurchases(data || []);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Purchase Orders
            </h1>

            <p className="text-slate-500">
              Manage stock receiving from suppliers.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Purchase
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Purchase List
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b">
                <th className="text-left p-3">PO Number</th>
                <th className="text-left p-3">Supplier</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-3">
                      {purchase.purchase_number}
                    </td>

                    <td className="p-3">
                      {purchase.suppliers?.name || "-"}
                    </td>

                    <td className="p-3">
                      R {Number(
                        purchase.total_amount || 0
                      ).toFixed(2)}
                    </td>

                    <td className="p-3">
                      {purchase.status}
                    </td>

                    <td className="p-3">
                      {new Date(
                        purchase.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-500"
                  >
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  New Purchase
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-red-600 font-bold"
                >
                  X
                </button>
              </div>

              <PurchaseForm />

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}