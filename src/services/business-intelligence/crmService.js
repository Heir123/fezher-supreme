import { supabase } from "@/services/supabase";

export async function getCRMBI() {

  const { data } = await supabase
    .from("customers")
    .select("*");

  const customers = data || [];

  return {

    totalCustomers: customers.length,

    activeCustomers: customers.filter(
      c => c.status === "Active"
    ).length,

    inactiveCustomers: customers.filter(
      c => c.status === "Inactive"
    ).length,

    customers,

  };

}