import { supabase } from "@/services/supabase";

export async function getFinanceSummary() {
  const { data: sales } = await supabase
    .from("sales")
    .select("total_amount");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("total_amount");

  const revenue =
    sales?.reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    ) || 0;

  const expenses =
    purchases?.reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    ) || 0;

  return {
    revenue,
    expenses,
    profit: revenue - expenses,
  };
}