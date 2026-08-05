import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import InventoryStats from "./InventoryStats";
import StockMovementTable from "./StockMovementTable";

import {
  getInventorySummary,
  getRecentMovements,
} from "@/services/inventoryService";

export default function InventoryDashboard() {

  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {

    const summaryData =
      await getInventorySummary();

    const movementData =
      await getRecentMovements();

    setSummary(summaryData);
    setMovements(movementData);

  }

  if (!summary)
    return (
      <DashboardLayout>
        <div className="p-8">
          Loading inventory...
        </div>
      </DashboardLayout>
    );

  return (

    <DashboardLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold">
            Inventory Dashboard
          </h1>

          <p className="text-gray-500">
            Monitor inventory levels and stock movements.
          </p>

        </div>

        <InventoryStats summary={summary} />

        <StockMovementTable
          movements={movements}
        />

      </div>

    </DashboardLayout>

  );

}