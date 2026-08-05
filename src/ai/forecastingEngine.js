export function generateForecast(dashboard) {

    const revenue = Number(dashboard.revenue || 0);

    const expenses = Number(dashboard.expenses || 0);

    const projectedRevenue = revenue * 1.15;

    const projectedExpenses = expenses * 1.05;

    const projectedProfit =
        projectedRevenue - projectedExpenses;

    return {

        projectedRevenue,

        projectedExpenses,

        projectedProfit,

        message:
            `If current performance continues, projected revenue next period is approximately R ${projectedRevenue.toFixed(2)}.`

    };

}