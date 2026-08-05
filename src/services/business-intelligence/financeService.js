import { supabase } from "@/services/supabase";

export async function getFinanceBI() {

  const summary = await supabase.rpc(
    "get_dashboard_summary"
  );

  const data =
    summary.data?.[0] ||
    summary.data ||
    {};

  return {

    revenue:
      Number(data.revenue || 0),

    expenses:
      Number(data.expenses || 0),

    profit:
      Number(data.profit || 0),

    inventoryValue:
      Number(data.inventoryValue || 0),

  };

}