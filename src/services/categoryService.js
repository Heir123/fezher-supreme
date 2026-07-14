import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
*/

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  console.log("Categories data:", data);
  console.log("Categories error:", error);

  if (error) throw error;

  return data;
}

/*
|--------------------------------------------------------------------------
| Add Category
|--------------------------------------------------------------------------
*/

export async function addCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error("addCategory:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export async function updateCategory(id, category) {
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateCategory:", error);
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
*/

export async function deleteCategory(id) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteCategory:", error);
    throw error;
  }

  return true;
}