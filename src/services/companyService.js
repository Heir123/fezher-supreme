import { supabase } from "./supabase";

export async function getCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

export async function addCompany(company) {
  const { data, error } = await supabase
    .from("companies")
    .insert([company])
    .select();

  if (error) throw error;

  return data;
}

export async function updateCompany(id, company) {
  const { data, error } = await supabase
    .from("companies")
    .update(company)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteCompany(id) {
  console.log("Deleting company:", id);

  const { data, error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)
    .select();

  console.log("Deleted data:", data);
  console.log("Delete error:", error);

  if (error) throw error;

  return data;
}