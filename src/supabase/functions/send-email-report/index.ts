import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function getNumber(value: any): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: any): string {
  return getNumber(value).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Method not allowed",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();

    console.log("========== EDGE FUNCTION - FULL REQUEST BODY ==========");
    console.log(JSON.stringify(body, null, 2));
    console.log("========================================================");

    const { to, subject, message, format, dashboard } = body;

    console.log("========== EXTRACTED VALUES ==========");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Format:", format);
    console.log("Dashboard type:", typeof dashboard);
    console.log("Dashboard keys:", Object.keys(dashboard || {}));
    console.log("=======================================");

    // Extract values with fallbacks
    const revenue = getNumber(dashboard?.revenue ?? 0);
    const expenses = getNumber(dashboard?.expenses ?? 0);
    const profit = getNumber(dashboard?.profit ?? 0);
    const sales = getNumber(dashboard?.totalSales ?? 0);
    const products = getNumber(dashboard?.totalProducts ?? 0);
    const customers = getNumber(dashboard?.totalCustomers ?? 0);
    const employees = getNumber(dashboard?.totalEmployees ?? 0);
    const healthScore = getNumber(dashboard?.health?.overall ?? 0);

    console.log("========== CALCULATED VALUES ==========");
    console.log("Revenue:", revenue);
    console.log("Expenses:", expenses);
    console.log("Profit:", profit);
    console.log("Sales:", sales);
    console.log("Products:", products);
    console.log("Customers:", customers);
    console.log("Employees:", employees);
    console.log("Health Score:", healthScore);
    console.log("========================================");

    if (!to) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Recipient email is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Build the HTML email
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fezher Supreme Executive Report</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif; }
    .container { max-width:700px; margin:30px auto; background:white; padding:35px; border-radius:12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #1a237e; margin-bottom: 5px; font-size: 24px; }
    .subtitle { color: #666; margin-top: 0; font-size: 14px; }
    hr { margin: 25px 0; border: none; border-top: 2px solid #e0e0e0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td { padding: 12px 16px; border: 1px solid #e0e0e0; }
    .label { font-weight: bold; background: #f8f9fa; width: 40%; }
    .value { font-weight: 600; }
    .positive { color: #2e7d32; }
    .negative { color: #c62828; }
    .footer { margin-top: 30px; color: #999; font-size: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
    .metric-card { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .metric-value { font-size: 20px; font-weight: bold; }
    .metric-label { color: #666; font-size: 14px; }
    .health-score { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
    .health-good { background: #e8f5e9; color: #2e7d32; }
    .health-medium { background: #fff3e0; color: #e65100; }
    .health-poor { background: #ffebee; color: #c62828; }
  </style>
</head>

<body>
  <div class="container">
    <h1>📊 Fezher Supreme Executive Report</h1>
    <p class="subtitle">${new Date().toLocaleString('en-ZA', { 
      dateStyle: 'full', 
      timeStyle: 'medium' 
    })}</p>

    <p style="font-size: 16px; line-height: 1.6;">
      ${message || "Executive business performance report."}
    </p>

    <hr>

    <h2>📈 Financial Summary</h2>

    <div class="metric-card">
      <div class="metric-label">Total Revenue</div>
      <div class="metric-value" style="color: #2e7d32;">R ${formatMoney(revenue)}</div>
    </div>

    <div class="metric-card">
      <div class="metric-label">Total Expenses</div>
      <div class="metric-value" style="color: #c62828;">R ${formatMoney(expenses)}</div>
    </div>

    <div class="metric-card">
      <div class="metric-label">Net Profit</div>
      <div class="metric-value ${profit >= 0 ? 'positive' : 'negative'}">
        R ${formatMoney(profit)}
      </div>
    </div>

    <h2>📊 Business Metrics</h2>

    <table>
      <tr>
        <td class="label">Total Sales</td>
        <td class="value">${sales}</td>
      </tr>
      <tr>
        <td class="label">Total Products</td>
        <td class="value">${products}</td>
      </tr>
      <tr>
        <td class="label">Total Customers</td>
        <td class="value">${customers}</td>
      </tr>
      <tr>
        <td class="label">Total Employees</td>
        <td class="value">${employees}</td>
      </tr>
      <tr>
        <td class="label">Business Health Score</td>
        <td class="value">
          <span class="health-score ${healthScore >= 70 ? 'health-good' : healthScore >= 40 ? 'health-medium' : 'health-poor'}">
            ${healthScore}%
          </span>
        </td>
      </tr>
    </table>

    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
      <strong>📎 Report Format:</strong> ${String(format || "PDF").toUpperCase()}
      <br>
      <strong>📅 Generated:</strong> ${new Date().toISOString().split('T')[0]}
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Fezher Supreme - Confidential</p>
      <p>This report is generated automatically. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Fezher Supreme <onboarding@resend.dev>",
          to: [to],
          subject: subject || `Executive Report - Fezher Supreme - ${new Date().toISOString().split('T')[0]}`,
          html,
        }),
      }
    );

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendData);
      return new Response(
        JSON.stringify({
          success: false,
          error: resendData,
        }),
        {
          status: resendResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Email sent successfully:", resendData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Executive report sent successfully",
        data: resendData,
        values: {
          revenue,
          expenses,
          profit,
          sales,
          products,
          customers,
          employees,
          healthScore,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});