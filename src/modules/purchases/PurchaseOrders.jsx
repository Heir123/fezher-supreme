import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PurchaseForm from "./PurchaseForm";
import { supabase } from "@/services/supabase";

export default function PurchaseOrders() {
  const [open, setOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
const [selectedPurchase, setSelectedPurchase] = useState(null);
const [viewOpen, setViewOpen] = useState(false);
const [editingPurchase, setEditingPurchase] = useState(null);

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

  function handleEdit(purchase) {
  console.log("Editing purchase:", purchase);

  // Next step we'll open the PurchaseForm
  // with all purchase data already filled in.
}

function handleView(purchase) {
  setSelectedPurchase(purchase);
  setViewOpen(true);
}
async function handleDelete(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this purchase?"
  );

  if (!confirmDelete) return;

  try {
    const { error } = await supabase
      .from("purchases")
      .delete()
      .eq("id", id);

    if (error) throw error;

    alert("Purchase deleted successfully.");

    loadPurchases();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleCancel(purchase) {
  const confirmCancel = window.confirm(
    `Cancel Purchase ${purchase.purchase_number}?`
  );

  if (!confirmCancel) return;

  try {

    // 1. Load purchase items
    const { data: items, error: itemsError } =
      await supabase
        .from("purchase_items")
        .select("*")
        .eq("purchase_id", purchase.id);

    if (itemsError) throw itemsError;

    for (const item of items) {

      const { error: cancelError } =
  await supabase
    .from("purchases")
    .update({
      status: "Cancelled",
    })
    .eq("id", purchase.id);

if (cancelError) throw cancelError;

alert("Purchase cancelled successfully.");

loadPurchases();

  // Get current product
  const { data: product, error: productError } =
    await supabase
      .from("products")
      .select("*")
      .eq("id", item.product_id)
      .single();

  if (productError) throw productError;

  const newStock =
    Number(product.stock_quantity || 0) -
    Number(item.quantity);

  // Update stock
  const { error: stockError } =
    await supabase
      .from("products")
      .update({
        stock_quantity: newStock,
      })
      .eq("id", item.product_id);

  if (stockError) throw stockError;

  const { error: movementError } =
  await supabase
    .from("stock_movements")
    .insert({
      company_id: purchase.company_id,
      product_id: item.product_id,
      movement_type: "Purchase Cancelled",
      quantity: -Number(item.quantity),
      reference_type: "Purchase Cancel",
      reference_id: purchase.id,
      notes: "Purchase cancelled",
      unit_cost: Number(item.unit_cost),
      total_value:
        -(Number(item.quantity) * Number(item.unit_cost)),
    });

if (movementError) throw movementError;

  console.log(
    "Stock reversed:",
    product.name,
    "New stock:",
    newStock
  );

}

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function handleView(purchase) {
  setSelectedPurchase(purchase);
  setViewOpen(true);
}

function handleEdit(purchase) {
  console.log("Editing purchase:", purchase);

  setEditingPurchase(purchase);
  setOpen(true);
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
                <th className="text-left p-3">Actions</th>
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
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      purchase.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : purchase.status === "Received"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {purchase.status}
  </span>
</td>

                    <td className="p-3">
                      {new Date(
                        purchase.created_at
                      ).toLocaleDateString()}
                    </td>

                   <td className="p-3">
  <div className="flex gap-2">

  <button
  onClick={() => handleView(purchase)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
>
  👁 View
</button>

  <button
  onClick={() => handleEdit(purchase)}
  disabled={purchase.status === "Cancelled"}
  className={`px-3 py-1 rounded-lg text-sm text-white ${
    purchase.status === "Cancelled"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  ✏ Edit
</button>

    <button
  onClick={() => handleCancel(purchase)}
  disabled={purchase.status === "Cancelled"}
  className={`px-3 py-1 rounded-lg text-sm text-white ${
    purchase.status === "Cancelled"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-orange-600 hover:bg-orange-700"
  }`}
>
  ❌ Cancel
</button>

  </div>
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">

             <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-10">
  <h2 className="text-2xl font-bold text-slate-800">
    New Purchase
  </h2>

  <button
    onClick={() => setOpen(false)}
    className="text-red-600 text-xl font-bold hover:text-red-700"
  >
    ✕
  </button>
</div>

             <div className="flex-1 overflow-y-auto p-6">
  <PurchaseForm
  purchase={editingPurchase}
  onSaved={() => {
    loadPurchases();
    setEditingPurchase(null);
  }}
  onClose={() => {
    setOpen(false);
    setEditingPurchase(null);
  }}
/>
</div>

            </div>
          </div>
        )}

{viewOpen && selectedPurchase && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Purchase Details
        </h2>

        <button
          onClick={() => setViewOpen(false)}
          className="text-red-600 font-bold text-xl"
        >
          ✕
        </button>

      </div>

      <div className="space-y-3">

        <p><strong>PO Number:</strong> {selectedPurchase.purchase_number}</p>

        <p><strong>Supplier:</strong> {selectedPurchase.suppliers?.name}</p>

        <p><strong>Status:</strong> {selectedPurchase.status}</p>

        <p><strong>Total:</strong> R {Number(selectedPurchase.total_amount).toFixed(2)}</p>

        <p><strong>Date:</strong> {new Date(selectedPurchase.created_at).toLocaleDateString()}</p>

      </div>

    </div>

  </div>
)}
      </div>
    </DashboardLayout>
  );
}