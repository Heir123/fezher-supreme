import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Get Transactions
|--------------------------------------------------------------------------
*/

export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Create Transaction
|--------------------------------------------------------------------------
*/

export async function createTransaction(transaction) {
  console.log("Saving transaction:", transaction);

  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select()
    .single();

  console.log("Transaction data:", data);
  console.log("Transaction error:", error);

  if (error) throw error;

  return data;
}