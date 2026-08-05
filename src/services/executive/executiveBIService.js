import { supabase } from "@/services/supabase";

export async function getExecutiveBI() {

  const [
    summaryResult,
    salesResult,
    purchasesResult,
    customersResult,
    employeesResult,
    productsResult,
  ] = await Promise.all([

    supabase.rpc("get_dashboard_summary"),

    supabase.from("sales").select("*"),

    supabase.from("purchases").select("*"),

    supabase.from("customers").select("*"),

    supabase.from("employees").select("*"),

    supabase.from("products").select("*"),

  ]);

  const summary = summaryResult.data?.[0] || summaryResult.data || {};

  const sales = salesResult.data || [];
  const purchases = purchasesResult.data || [];
  const customers = customersResult.data || [];
  const employees = employeesResult.data || [];
  const products = productsResult.data || [];

  const revenue = Number(summary.revenue || 0);
  const expenses = Number(summary.expenses || 0);
  const profit = Number(summary.profit || 0);

  const inventoryValue = Number(summary.inventoryValue || 0);

  const businessHealth =
    revenue <= 0
      ? 0
      : Math.min(
          100,
          Math.round(
            ((profit + inventoryValue) / revenue) * 100
          )
        );

  return {

    businessHealth,

    revenue,

    expenses,

    profit,

    inventoryValue,

    totalSales: sales.length,

    totalPurchases: purchases.length,

    totalCustomers: customers.length,

    totalEmployees: employees.length,

    totalProducts: products.length,

    lowStock: Number(summary.lowStock || 0),

    summary,

    sales,

    purchases,

    customers,

    employees,

    products,

  };

}