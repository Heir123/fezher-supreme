import { supabase } from "@/services/supabase";

export async function getPurchaseDashboard(period = "all") {

  const { data, error } = await supabase
    .from("purchases")
    .select("*");

  if (error) throw error;

  const purchases = data || [];

  const totalPurchases = purchases.length;

  const totalSpent = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.total_amount || 0),
    0
  );

  const averagePurchase =
    totalPurchases === 0
      ? 0
      : totalSpent / totalPurchases;

  return {

    purchases,

    totalPurchases,

    totalSpent,

    averagePurchase,

  };
}