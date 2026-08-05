export function generateExecutiveNarrative(dashboard) {

    const insights = [];

    // Revenue

    if ((dashboard.revenue || 0) > 0) {

        insights.push(
            `Revenue currently stands at R ${dashboard.revenue}, generated from ${dashboard.totalSales || 0} completed sales.`
        );

    } else {

        insights.push(
            "No sales revenue has been recorded during the selected reporting period."
        );

    }

    // Profit

    if ((dashboard.profit || 0) > 0) {

        insights.push(
            `The business is profitable with a net profit of R ${dashboard.profit}.`
        );

    } else {

        insights.push(
            `The business is currently operating at a loss of R ${Math.abs(dashboard.profit || 0)} because expenses exceed revenue.`
        );

    }

    // Inventory

    if ((dashboard.lowStock || 0) === 0) {

        insights.push(
            "Inventory levels remain healthy with no products currently below minimum stock."
        );

    } else {

        insights.push(
            `${dashboard.lowStock} products require immediate restocking.`
        );

    }

    // Customers

    insights.push(
        `The company currently serves ${dashboard.customers || 0} registered customers.`
    );

    // Employees

    insights.push(
        `${dashboard.activeEmployees || 0} employees are currently active.`
    );

    return insights;

}