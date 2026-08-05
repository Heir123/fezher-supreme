export async function getAIInsights(data) {

  const insights = [];

  if ((data?.profit || 0) > 0) {

    insights.push({
      type: "success",
      title: "Healthy Profit",
      message:
        "The business is currently profitable.",
    });

  } else {

    insights.push({
      type: "warning",
      title: "Negative Profit",
      message:
        "Expenses are exceeding revenue.",
    });

  }

  if ((data?.lowStock || 0) > 0) {

    insights.push({
      type: "inventory",
      title: "Low Stock",
      message:
        `${data.lowStock} products require replenishment.`,
    });

  }

  if ((data?.totalCustomers || 0) > 50) {

    insights.push({
      type: "growth",
      title: "Customer Growth",
      message:
        "Customer base is expanding steadily.",
    });

  }

  return insights;

}