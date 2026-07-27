import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";

export default function RecentActivity() {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: purchaseData } = await supabase
      .from("purchases")
      .select("*")
      .limit(5);

    const { data: salesData } = await supabase
      .from("sales")
      .select("*")
      .limit(5);

   const { data: movementData, error: movementError } =
  await supabase
    .from("stock_movements")
    .select("*")
    .order("id", { ascending: false })
    .limit(5);

console.log("MOVEMENTS:", movementData);
console.log("MOVEMENT ERROR:", movementError);
setMovements(movementData || []);

    setPurchases(purchaseData || []);
    setSales(salesData || []);
    setMovements(movementData || []);
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-6">

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">Recent Purchases</h2>
        {purchases.map((p) => (
          <div key={p.id}>{p.purchase_number}</div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">Recent Sales</h2>
        {sales.map((s) => (
          <div key={s.id}>{s.invoice_number}</div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-3">Inventory Movements</h2>
        {movements.map((m) => (
          <div key={m.id}>
            {m.movement_type} ({m.quantity})
          </div>
        ))}
      </div>

    </div>
  );
}