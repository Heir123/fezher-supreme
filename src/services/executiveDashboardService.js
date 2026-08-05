import { supabase } from "./supabase";
import { getDateRange } from "./dateFilter";

export async function getExecutiveDashboard(filter = "all") {
  try {
    const startDate = getDateRange(filter);

    let salesQuery = supabase
      .from("sales")
      .select("*");

    let purchasesQuery = supabase
      .from("purchases")
      .select("*");

    if (startDate) {
      salesQuery = salesQuery.gte(
        "created_at",
        startDate.toISOString()
      );

      purchasesQuery = purchasesQuery.gte(
        "created_at",
        startDate.toISOString()
      );
    }

    const [
      salesResult,
      purchasesResult,
      productsResult,
      customersResult,
      employeesResult,
    ] = await Promise.all([
      salesQuery,
      purchasesQuery,
      supabase.from("products").select("*"),
      supabase.from("customers").select("*"),
      supabase.from("employees").select("*"),
    ]);

    if (salesResult.error) throw salesResult.error;
    if (purchasesResult.error) throw purchasesResult.error;
    if (productsResult.error) throw productsResult.error;
    if (customersResult.error) throw customersResult.error;
    if (employeesResult.error) throw employeesResult.error;

    const sales = salesResult.data || [];
    const purchases = purchasesResult.data || [];
    const products = productsResult.data || [];
    const customers = customersResult.data || [];
    const employees = employeesResult.data || [];

    const revenue = sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total_amount ??
          sale.total ??
          0
        ),
      0
    );

    const expenses = purchases.reduce(
      (sum, purchase) =>
        sum +
        Number(
          purchase.total_amount ??
          purchase.total ??
          0
        ),
      0
    );

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const todaySales = sales
      .filter(
        sale =>
          sale.created_at &&
          sale.created_at.startsWith(today)
      )
      .reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.total_amount ??
            sale.total ??
            0
          ),
        0
      );

    const lowStock = products.filter(product => {
      const stock = Number(
        product.stock_quantity ??
        product.stock ??
        0
      );

      const minimum = Number(
        product.minimum_stock ?? 5
      );

      return stock <= minimum;
    }).length;

    const monthlySales = Array.from(
      { length: 12 },
      (_, index) => ({
        month: new Date(
          2026,
          index,
          1
        ).toLocaleString("en-US", {
          month: "short",
        }),
        sales: 0,
      })
    );

    sales.forEach(sale => {
      if (!sale.created_at) return;

      const month = new Date(
        sale.created_at
      ).getMonth();

      monthlySales[month].sales += Number(
        sale.total_amount ??
        sale.total ??
        0
      );
    });

    console.log("Dashboard Filter:", filter);
    console.log("Sales:", sales.length);
    console.log("Purchases:", purchases.length);

    return {

  todaySales,

  revenue,

  expenses,

  profit: revenue - expenses,

  totalSales: sales.length,

  totalPurchases: purchases.length,

  customers: customers.length,

  products: products.length,

  employees: employees.length,

  activeEmployees: employees.filter(
    emp => emp.status === "Active"
  ).length,

  inventoryValue: products.reduce(
    (sum, p) =>
      sum +
      (
        Number(
          p.stock_quantity ??
          p.stock ??
          0
        ) *
        Number(
          p.selling_price ??
          p.price ??
          0
        )
      ),
    0
  ),

  lowStock,

  pendingOrders: 0,

  outstandingInvoices: 0,

  monthlySales,

  sales,

  purchases,

  productList: products,

  customerList: customers,

  employeeList: employees,


}

 } catch (error) {

    console.error(
      "Executive dashboard error:",
      error
    );

    throw error;

  }

}