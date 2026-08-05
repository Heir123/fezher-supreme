import { supabase } from "@/services/supabase";

export async function getExecutiveData() {

  const [
    dashboard,
    sales,
    purchases,
    products,
    customers,
    suppliers,
    employees,
  ] = await Promise.all([

    supabase.rpc("get_dashboard_summary"),

    supabase.from("sales").select("*"),

    supabase.from("purchases").select("*"),

    supabase.from("products").select("*"),

    supabase.from("customers").select("*"),

    supabase.from("suppliers").select("*"),

    supabase.from("employees").select("*"),

  ]);

  const summary =
    dashboard.data?.[0] ||
    dashboard.data ||
    {};

  return {

    revenue:
      Number(summary.revenue || 0),

    expenses:
      Number(summary.expenses || 0),

    profit:
      Number(summary.profit || 0),

    inventoryValue:
      Number(summary.inventoryValue || 0),

    totalSales:
      sales.data?.length || 0,

    totalPurchases:
      purchases.data?.length || 0,

    totalProducts:
      products.data?.length || 0,

    totalCustomers:
      customers.data?.length || 0,

    totalSuppliers:
      suppliers.data?.length || 0,

    totalEmployees:
      employees.data?.length || 0,

    lowStock:
      Number(summary.lowStock || 0),

    dashboard:
      summary,

    sales:
      sales.data || [],

    purchases:
      purchases.data || [],

    products:
      products.data || [],

    customers:
      customers.data || [],

    suppliers:
      suppliers.data || [],

    employees:
      employees.data || [],

  };

}