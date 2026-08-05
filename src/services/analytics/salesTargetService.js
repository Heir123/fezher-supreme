import { supabase } from "@/services/supabase";

export async function getSalesTarget(period = "month") {

  /*
      Later this will come from
      company_settings
      or sales_targets table.
  */

  const targetRevenue = 50000;

  const { data, error } = await supabase
    .from("sales")
    .select("total_amount");

  if (error) throw error;

  const actualRevenue = (data || []).reduce(
    (sum, sale) =>
      sum + Number(sale.total_amount || 0),
    0
  );

  const achievement =
    targetRevenue === 0
      ? 0
      : (actualRevenue / targetRevenue) * 100;

  return {

    targetRevenue,

    actualRevenue,

    achievement,

    remaining:
      targetRevenue - actualRevenue,

  };
}