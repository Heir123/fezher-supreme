import { supabase } from "@/services/supabase";

export async function getCRMDashboard() {
  const [
    leadsResult,
    customersResult,
    opportunitiesResult,
  ] = await Promise.all([
    supabase.from("leads").select("*"),
    supabase.from("customers").select("*"),
    supabase.from("opportunities").select("*"),
  ]);

  const leads = leadsResult.data || [];
  const customers = customersResult.data || [];
  const opportunities = opportunitiesResult.data || [];

  const totalLeadValue = opportunities.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  const wonDeals = opportunities.filter(
    o => o.status === "Won"
  );

  const lostDeals = opportunities.filter(
    o => o.status === "Lost"
  );

  return {
    totalLeads: leads.length,
    totalCustomers: customers.length,
    totalOpportunities: opportunities.length,
    totalLeadValue,
    wonDeals: wonDeals.length,
    lostDeals: lostDeals.length,
    conversionRate:
      leads.length === 0
        ? 0
        : (customers.length / leads.length) * 100,
    leads,
    customers,
    opportunities,
  };
}