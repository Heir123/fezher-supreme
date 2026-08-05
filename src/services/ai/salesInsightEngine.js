export function generateSalesInsights({
    revenue = 0,
    profit = 0,
    revenueProgress = 0,
    todayGrowth = 0,
    monthGrowth = 0,
    yearGrowth = 0,
    topProduct = null,
    topCustomer = null
}) {

    const insights = [];

    // Revenue Progress
    if (revenueProgress >= 100) {
        insights.push({
            type: "success",
            title: "Sales Target Achieved",
            message:
                "Congratulations! Monthly sales target has been reached."
        });
    }
    else if (revenueProgress >= 75) {
        insights.push({
            type: "info",
            title: "Target Progress",
            message:
                `Sales target is ${revenueProgress.toFixed(1)}% complete.`
        });
    }
    else {
        insights.push({
            type: "warning",
            title: "Target Behind Schedule",
            message:
                `Only ${revenueProgress.toFixed(1)}% of the monthly target has been reached.`
        });
    }

    // Daily Growth
    if (todayGrowth > 0) {
        insights.push({
            type: "success",
            title: "Today's Performance",
            message:
                `Today's sales increased by ${todayGrowth.toFixed(1)}%.`
        });
    }

    if (todayGrowth < 0) {
        insights.push({
            type: "warning",
            title: "Today's Performance",
            message:
                `Today's sales dropped by ${Math.abs(todayGrowth).toFixed(1)}%.`
        });
    }

    // Monthly Growth
    if (monthGrowth > 0) {
        insights.push({
            type: "success",
            title: "Monthly Trend",
            message:
                `Revenue is ${monthGrowth.toFixed(1)}% above last month.`
        });
    }

    if (monthGrowth < 0) {
        insights.push({
            type: "danger",
            title: "Monthly Trend",
            message:
                `Revenue decreased by ${Math.abs(monthGrowth).toFixed(1)}% compared to last month.`
        });
    }

    // Profit
    if (profit < 0) {
        insights.push({
            type: "danger",
            title: "Profit Alert",
            message:
                "Expenses are currently higher than revenue."
        });
    }

    if (profit > 0) {
        insights.push({
            type: "success",
            title: "Healthy Profit",
            message:
                "The business is operating profitably."
        });
    }

    // Top Product
    if (topProduct) {
        insights.push({
            type: "info",
            title: "Best Product",
            message:
                `${topProduct.name} generated the highest sales.`
        });
    }

    // Top Customer
    if (topCustomer) {
        insights.push({
            type: "info",
            title: "Top Customer",
            message:
                `${topCustomer.name} is currently your highest-value customer.`
        });
    }

    return insights;
}