import { supabase } from "./supabase";

export async function getDashboardStats() {

  const [
    salesResult,
    productsResult,
    customersResult,
  ] = await Promise.all([

    supabase
      .from("sales")
      .select("*"),

    supabase
      .from("products")
      .select("*"),

    supabase
      .from("customers")
      .select("*"),

  ]);

  if (salesResult.error) {
    throw salesResult.error;
  }

  if (productsResult.error) {
    throw productsResult.error;
  }

  if (customersResult.error) {
    throw customersResult.error;
  }

  const sales =
    salesResult.data || [];

  const products =
    productsResult.data || [];

  const customers =
    customersResult.data || [];


  /* TOTAL REVENUE */

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total_amount ||
          sale.total ||
          0
        ),
      0
    );


  /* LOW STOCK */

  const lowStockProducts =
    products.filter(
      (product) => {

        const stock =
          Number(
            product.stock_quantity ||
            product.stock ||
            0
          );

        const minimumStock =
          Number(
            product.minimum_stock ||
            5
          );

        return (
          stock <=
          minimumStock
        );

      }
    ).length;


  /* MONTHLY SALES */

  const monthNames = [
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
  ];


  const monthlySales =
    monthNames.map(
      (month) => ({
        month,
        sales: 0,
      })
    );


  sales.forEach(
    (sale) => {

      if (!sale.created_at) {
        return;
      }

      const date =
        new Date(
          sale.created_at
        );

      const monthIndex =
        date.getMonth();

      const amount =
        Number(
          sale.total_amount ||
          sale.total ||
          0
        );

      monthlySales[
        monthIndex
      ].sales += amount;

    }
  );


  return {

    totalRevenue,

    totalSales:
      sales.length,

    totalProducts:
      products.length,

    totalCustomers:
      customers.length,

    lowStockProducts,

    monthlySales,

  };

}