import { generateSalesInsights } from "./salesInsightEngine";

export function generateExecutiveAI(data) {

    const report = [];

    // Sales AI
    const salesInsights = generateSalesInsights({

        revenue: data.revenue || 0,
        profit: data.profit || 0,

        revenueProgress: data.revenueProgress || 0,

        todayGrowth: data.todayGrowth || 0,

        monthGrowth: data.monthGrowth || 0,

        yearGrowth: data.yearGrowth || 0,

        topProduct:
            data.topProducts?.length
                ? data.topProducts[0]
                : null,

        topCustomer:
            data.topCustomers?.length
                ? data.topCustomers[0]
                : null

    });

    report.push(...salesInsights);

    // Profit

    if (data.profit < 0) {

        report.push({

            type: "danger",

            title: "Executive Warning",

            message:
                "The business is operating at a loss."

        });

    }

    // Inventory

    if (data.lowStockProducts > 0) {

        report.push({

            type: "warning",

            title: "Inventory",

            message:
                `${data.lowStockProducts} products require restocking.`

        });

    }

    // Customers

    if (data.totalCustomers < 10) {

        report.push({

            type: "info",

            title: "Customer Growth",

            message:
                "Customer base is still small. Consider marketing campaigns."

        });

    }

    // Employees

    if (data.activeEmployees === 0) {

        report.push({

            type: "warning",

            title: "HR",

            message:
                "No active employees found."

        });

    }

    return report;

}