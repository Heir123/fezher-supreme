import { supabase } from "../supabase";

export async function getReportsDashboard() {
  const [
    sales,
    salesTrend,
    inventory,
    finance,
    customers,
    employees,
  ] = await Promise.all([
    supabase
      .from("vw_sales_summary")
      .select("*")
      .single(),

    supabase
      .from("vw_sales_trend")
      .select("*")
      .order("month", { ascending: true }),

    supabase
      .from("vw_inventory_summary")
      .select("*")
      .single(),

    supabase
      .from("vw_finance_summary")
      .select("*")
      .single(),

    supabase
      .from("vw_customer_summary")
      .select("*")
      .single(),

    supabase
      .from("vw_employee_summary")
      .select("*")
      .single(),
  ]);

  if (sales.error) {
    console.error("Sales report error:", sales.error);
  }

  if (salesTrend.error) {
    console.error("Sales trend error:", salesTrend.error);
  }

  if (inventory.error) {
    console.error("Inventory report error:", inventory.error);
  }

  if (finance.error) {
    console.error("Finance report error:", finance.error);
  }

  if (customers.error) {
    console.error("Customer report error:", customers.error);
  }

  if (employees.error) {
    console.error("Employee report error:", employees.error);
  }

  return {
    sales: sales.data,
    salesTrend: salesTrend.data || [],
    inventory: inventory.data,
    finance: finance.data,
    customers: customers.data,
    employees: employees.data,
  };
}