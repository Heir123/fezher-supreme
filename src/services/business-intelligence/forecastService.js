export async function getForecastBI(currentData) {

  const revenue = Number(currentData?.revenue || 0);
  const expenses = Number(currentData?.expenses || 0);

  const projectedRevenue = revenue * 1.15;
  const projectedExpenses = expenses * 1.05;
  const projectedProfit =
    projectedRevenue - projectedExpenses;

  return {

    projectedRevenue,

    projectedExpenses,

    projectedProfit,

    growthRate: 15,

    expenseGrowth: 5,

  };

}