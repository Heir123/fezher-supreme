import { supabase } from "@/services/supabase";

/*
|--------------------------------------------------------------------------
| LEADS
|--------------------------------------------------------------------------
*/

export async function addLead(lead) {
  const { data, error } = await supabase
    .from("leads")
    .insert([lead])
    .select();

  if (error) {
    console.error("ADD LEAD ERROR:", error);
    throw error;
  }

  return data;
}

export async function getLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET LEADS ERROR:", error);
    throw error;
  }

  return data || [];
}

/*
|--------------------------------------------------------------------------
| CRM DASHBOARD STATISTICS
|--------------------------------------------------------------------------
*/

export async function getCRMStats() {
  const [
    leadsResult,
    opportunitiesResult,
    followUpsResult,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*"),

    supabase
      .from("opportunities")
      .select("*"),

    supabase
      .from("follow_ups")
      .select("*"),
  ]);

  if (leadsResult.error) {
    console.error(
      "CRM LEADS ERROR:",
      leadsResult.error
    );
  }

  if (opportunitiesResult.error) {
    console.error(
      "CRM OPPORTUNITIES ERROR:",
      opportunitiesResult.error
    );
  }

  if (followUpsResult.error) {
    console.error(
      "CRM FOLLOW UPS ERROR:",
      followUpsResult.error
    );
  }

  const leads = leadsResult.data || [];
  const opportunities =
    opportunitiesResult.data || [];
  const followUps =
    followUpsResult.data || [];

  /*
  |--------------------------------------------------------------------------
  | WON DEALS
  |--------------------------------------------------------------------------
  |
  | Opportunities in Fezher Supreme use "stage".
  |
  */

  const wonDeals = opportunities.filter(
    (opportunity) => {
      const stage = String(
        opportunity.stage || ""
      )
        .trim()
        .toLowerCase();

      return (
        stage === "won" ||
        stage === "closed won" ||
        stage === "closed_won" ||
        stage === "completed"
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | RETURN CRM STATISTICS
  |--------------------------------------------------------------------------
  */

  return {
    totalLeads: leads.length,

    totalOpportunities:
      opportunities.length,

    totalFollowUps:
      followUps.length,

    wonDeals:
      wonDeals.length,

    leads,

    opportunities,

    followUps,

    wonDeals,
  };
}