import { supabase } from "@/services/supabase";

export async function getSalesBI() {

  const { data } = await supabase
    .from("sales")
    .select("*");

  const sales = data || [];

  const revenue = sales.reduce(

    (sum, sale) =>
      sum + Number(sale.total || 0),

    0

  );

  return {

    revenue,

    totalSales:
      sales.length,

    averageSale:
      sales.length
        ? revenue / sales.length
        : 0,

    sales,

  };

}