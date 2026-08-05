import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getPurchaseOrders } from "@/services/purchaseService";
import PurchaseStats from "./PurchaseStats";
import PurchaseTable from "./PurchaseTable";
import PurchaseDialog from "./PurchaseDialog";
export default function PurchaseDashboard() {
  const [orders, setOrders] = useState([]);
const [open, setOpen] = useState(false);
  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const data = await getPurchaseOrders();
    setOrders(data);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

  <div>
    <h1 className="text-3xl font-bold">
      Purchase Orders
    </h1>

    <p className="text-gray-500">
      Manage supplier purchase orders.
    </p>
  </div>

  <div className="flex justify-end">

  <button
    onClick={() => setOpen(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
  >
    + New Purchase Order
  </button>

</div>

  <PurchaseStats orders={orders} />

  <PurchaseTable
    orders={orders}
    onEdit={(order) => console.log(order)}
    onDelete={(order) => console.log(order)}
  />

<PurchaseDialog
  open={open}
  onClose={() => setOpen(false)}
/>
</div>
    </DashboardLayout>
  );
}