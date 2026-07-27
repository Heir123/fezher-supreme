import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

export default function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    inventoryValue: 0,
    lowStock: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data: products } = await supabase
      .from("products")
      .select("*");

    const totalProducts = products?.length || 0;

    const totalStock =
      products?.reduce(
        (sum, item) => sum + Number(item.stock_quantity || 0),
        0
      ) || 0;

    const inventoryValue =
      products?.reduce(
        (sum, item) =>
          sum +
          Number(item.stock_quantity || 0) *
            Number(item.cost_price || 0),
        0
      ) || 0;

    const lowStock =
      products?.filter(
        (item) =>
          Number(item.stock_quantity) <=
          Number(item.minimum_stock)
      ).length || 0;

    setStats({
      totalProducts,
      totalStock,
      inventoryValue,
      lowStock,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-slate-500">
          Total Products
        </h3>

        <p className="text-3xl font-bold">
          {stats.totalProducts}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-slate-500">
          Total Stock
        </h3>

        <p className="text-3xl font-bold">
          {stats.totalStock}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-slate-500">
          Inventory Value
        </h3>

        <p className="text-3xl font-bold">
          R {stats.inventoryValue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-slate-500">
          Low Stock Items
        </h3>

        <p className="text-3xl font-bold text-red-600">
          {stats.lowStock}
        </p>
      </div>

    </div>
  );
}