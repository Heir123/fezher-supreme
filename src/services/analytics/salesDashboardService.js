import { supabase } from "@/services/supabase";

export async function getSalesDashboard() {
  const [
    salesResult,
    saleItemsResult,
    productsResult,
    customersResult,
  ] = await Promise.all([
    supabase.from("sales").select("*"),
    supabase.from("sale_items").select(`
      quantity,
      total_price,
      products(name)
    `),
    supabase.from("products").select("id"),
    supabase.from("customers").select("id"),
  ]);

  if (salesResult.error) throw salesResult.error;
  if (saleItemsResult.error) throw saleItemsResult.error;
  if (productsResult.error) throw productsResult.error;
  if (customersResult.error) throw customersResult.error;

  const sales = salesResult.data || [];
  const saleItems = saleItemsResult.data || [];

  const revenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const averageSale =
    sales.length > 0 ? revenue / sales.length : 0;

  const monthlySales = Array(12).fill(0);

  sales.forEach((sale) => {
    if (!sale.created_at) return;

    const month = new Date(sale.created_at).getMonth();

    monthlySales[month] += Number(
      sale.total_amount || 0
    );
  });

  const salesData = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month, index) => ({
    month,
    sales: monthlySales[index],
  }));

  const financeData = [
    {
      name: "Revenue",
      value: revenue,
    },
  ];

  return {
    revenue,
    averageSale,
    totalSales: sales.length,
    totalProducts: productsResult.data.length,
    totalCustomers: customersResult.data.length,
    salesData,
    financeData,
    saleItems,
  };
}