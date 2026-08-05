import { supabase } from "./supabase";

export async function getRecentActivities(period = "all") {

  const [
    salesResult,
    purchasesResult,
  ] = await Promise.all([

    supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false }),

  ]);

  if (salesResult.error)
    throw salesResult.error;

  if (purchasesResult.error)
    throw purchasesResult.error;

  const today = new Date();

  function matchPeriod(date) {

    if (period === "all")
      return true;

    const d = new Date(date);

    switch (period) {

      case "today":

        return (
          d.toDateString() ===
          today.toDateString()
        );

      case "week": {

        const start = new Date(today);
        start.setDate(today.getDate() - 7);

        return d >= start;

      }

      case "month":

        return (
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );

      case "year":

        return (
          d.getFullYear() ===
          today.getFullYear()
        );

      default:
        return true;

    }

  }

  const sales =
    (salesResult.data || [])
      .filter(s =>
        matchPeriod(s.created_at)
      );

  const purchases =
    (purchasesResult.data || [])
      .filter(p =>
        matchPeriod(p.created_at)
      );

  const saleActivities =
    sales.map(sale => ({

      id: `sale-${sale.id}`,

      type: "sale",

      title: "New Sale",

      description:
        sale.invoice_number ||
        sale.invoice_no ||
        "Sales invoice",

      amount:
        Number(
          sale.total_amount ||
          sale.total ||
          0
        ),

      created_at:
        sale.created_at,

    }));

  const purchaseActivities =
    purchases.map(purchase => ({

      id: `purchase-${purchase.id}`,

      type: "purchase",

      title: "New Purchase",

      description:
        purchase.purchase_number ||
        purchase.purchase_no ||
        "Purchase Order",

      amount:
        Number(
          purchase.total_amount ||
          purchase.total ||
          0
        ),

      created_at:
        purchase.created_at,

    }));

  return [

    ...saleActivities,

    ...purchaseActivities,

  ]

    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    )

    .slice(0, 10);

}