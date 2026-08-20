import { supabase } from "@/services/supabase";

// Get all follow-ups with opportunity and customer information
export async function getFollowUps() {
  const { data: followUps, error: followUpError } = await supabase
    .from("follow_ups")
    .select("*")
    .order("follow_up_date", { ascending: true });

  if (followUpError) {
    console.error("GET FOLLOW-UPS ERROR:", followUpError);
    throw followUpError;
  }

  if (!followUps || followUps.length === 0) {
    return [];
  }

  const { data: opportunities, error: opportunityError } = await supabase
    .from("opportunities")
    .select("id, title, value, stage, lead_id");

  if (opportunityError) {
    console.error("GET OPPORTUNITIES ERROR:", opportunityError);
    throw opportunityError;
  }

  const { data: leads, error: leadError } = await supabase
    .from("leads")
    .select("id, customer_name, email, phone");

  if (leadError) {
    console.error("GET LEADS ERROR:", leadError);
    throw leadError;
  }

  console.log("FOLLOW-UPS:", followUps);
  console.log("OPPORTUNITIES:", opportunities);
  console.log("LEADS:", leads);

  const enrichedFollowUps = followUps.map((followUp) => {
    const opportunity = opportunities?.find(
      (item) => item.id === followUp.opportunity_id
    );

    const lead = opportunity?.lead_id
      ? leads?.find(
          (item) => item.id === opportunity.lead_id
        )
      : null;

    return {
      ...followUp,

      opportunity_title:
        opportunity?.title || null,

      opportunity_value:
        opportunity?.value || 0,

      opportunity_stage:
        opportunity?.stage || null,

      customer_name:
        lead?.customer_name || null,

      customer_email:
        lead?.email || null,

      customer_phone:
        lead?.phone || null,
    };
  });

  console.log(
    "ENRICHED FOLLOW-UPS:",
    enrichedFollowUps
  );

  return enrichedFollowUps;
}


// Add a follow-up
export async function addFollowUp(followUp) {
  const { data, error } = await supabase
    .from("follow_ups")
    .insert([followUp])
    .select();

  if (error) {
    console.error("ADD FOLLOW-UP ERROR:", error);
    throw error;
  }

  return data;
}