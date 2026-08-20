// src/services/emailReportService.js

import { supabase } from "./supabase";

export const sendEmailReport = async ({
  to,
  subject,
  message,
  format,
  dashboard,
}) => {
  try {
    console.log("========== EMAIL SERVICE ==========");
    console.log("Recipient:", to);
    console.log("Subject:", subject);
    console.log("Format:", format);
    console.log("Dashboard received:", !!dashboard);

    const dashboardData = dashboard || {};

    console.log("========== VALUES BEING SENT ==========");

    console.log("Revenue:", dashboardData.revenue);
    console.log("Expenses:", dashboardData.expenses);
    console.log("Profit:", dashboardData.profit);
    console.log("Total Sales:", dashboardData.totalSales);
    console.log("Total Products:", dashboardData.totalProducts);
    console.log("Total Customers:", dashboardData.totalCustomers);
    console.log("Total Employees:", dashboardData.totalEmployees);
    console.log("Health:", dashboardData.health);

    console.log("=======================================");

    const requestBody = {
      to,
      subject: subject || "Executive Report - Fezher Supreme",
      message: message || "",
      format: format || "pdf",
      dashboard: dashboardData,
    };

    console.log("========== FULL REQUEST BODY ==========");

    console.log(
      JSON.stringify(requestBody, null, 2)
    );

    console.log("=======================================");

    const { data, error } =
      await supabase.functions.invoke(
        "send-email-report",
        {
          body: requestBody,
        }
      );

    if (error) {
      console.error(
        "Edge Function error:",
        error
      );

      return {
        success: false,
        error,
      };
    }

    console.log(
      "========== EDGE FUNCTION RESPONSE =========="
    );

    console.log(data);

    console.log(
      "============================================"
    );

    return {
      success: true,
      data,
    };

  } catch (error) {

    console.error(
      "Email service error:",
      error
    );

    return {
      success: false,
      error,
    };
  }
};

export default sendEmailReport;