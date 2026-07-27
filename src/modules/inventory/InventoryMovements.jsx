import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { supabase } from "@/services/supabase";

export default function InventoryMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  async function loadMovements() {
    try {
      const { data, error } = await supabase
        .from("stock_movements")
        .select(`
          *,
          products(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMovements(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Inventory Movements
          </h1>

          <p className="text-gray-500">
            Track all stock increases and decreases.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (
            <div className="p-6">
              Loading movements...
            </div>
          ) : (
            <table className="min-w-full">

              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Movement</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-center">Reference</th>
                </tr>
              </thead>

              <tbody>

                {movements.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center p-6"
                    >
                      No movements found.
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-t"
                    >
                      <td className="p-3">
                        {new Date(
                          movement.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        {movement.products?.name || "-"}
                      </td>

                      <td className="p-3 text-center">
                        {movement.movement_type}
                      </td>

                      <td
                        className={`p-3 text-center font-bold ${
                          movement.movement_type === "Sale"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {movement.movement_type === "Sale"
                          ? "-"
                          : "+"}
                        {movement.quantity}
                      </td>

                      <td className="p-3 text-center">
                        {movement.reference_type}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}