export function generateRecommendations(dashboard) {

    const recommendations = [];

    // Profit

    if ((dashboard.profit || 0) < 0) {

        recommendations.push(
            "Reduce operational expenses to improve profitability."
        );

    }

    // Inventory

    if ((dashboard.lowStock || 0) > 0) {

        recommendations.push(
            "Restock inventory before product shortages affect sales."
        );

    }

    // Employees

    if ((dashboard.activeEmployees || 0) === 0) {

        recommendations.push(
            "Employee information is missing. Review HR records."
        );

    }

    // Customers

    if ((dashboard.customers || 0) === 0) {

        recommendations.push(
            "Customer records are empty. Grow and maintain your customer database."
        );

    }

    // Sales

    if ((dashboard.totalSales || 0) === 0) {

        recommendations.push(
            "No sales have been recorded. Review sales operations."
        );

    }

    // Healthy business

    if (recommendations.length === 0) {

        recommendations.push(
            "Business performance appears stable. Continue monitoring KPIs."
        );

    }

    return recommendations;

}