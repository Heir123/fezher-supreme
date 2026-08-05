import { supabase } from "@/services/supabase";

export async function getSalesKPIs(period = "all") {
  const { data: sales, error } = await supabase
    .from("sales")
    .select(`
      total_amount,
      profit,
      created_at
    `);

  if (error) throw error;

  const now = new Date();

  let filtered = sales || [];
  let previous = [];

  switch (period) {
    case "today": {
      const today = now.toISOString().slice(0, 10);

      filtered = filtered.filter(
        (s) => s.created_at.slice(0, 10) === today
      );

      break;
    }

    case "week": {
      const start = new Date();
      start.setDate(now.getDate() - 7);

      filtered = filtered.filter(
        (s) => new Date(s.created_at) >= start
      );

      previous = sales.filter((s) => {
        const d = new Date(s.created_at);
        return (
          d >= new Date(start.getTime() - 7 * 86400000) &&
          d < start
        );
      });

      break;
    }

    case "month": {
      const month = now.getMonth();
      const year = now.getFullYear();

      filtered = filtered.filter((s) => {
        const d = new Date(s.created_at);

        return (
          d.getMonth() === month &&
          d.getFullYear() === year
        );
      });

      previous = sales.filter((s) => {
        const d = new Date(s.created_at);

        return (
          d.getMonth() === month - 1 &&
          d.getFullYear() === year
        );
      });

      break;
    }

    default:
      previous = [];
  }

  const revenue = filtered.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const profit = filtered.reduce(
    (sum, sale) => sum + Number(sale.profit || 0),
    0
  );

  const totalSales = filtered.length;

  const averageOrder =
    totalSales === 0 ? 0 : revenue / totalSales;

  const margin =
    revenue === 0 ? 0 : (profit / revenue) * 100;

  const previousRevenue = previous.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );

  const growth =
    previousRevenue === 0
      ? 0
      : ((revenue - previousRevenue) / previousRevenue) * 100;

  return {
    revenue,
    profit,
    margin,
    totalSales,
    averageOrder,
    growth,
  };
}