import { supabase } from "@/services/supabase";

export async function getInventoryBI() {

  const { data } = await supabase
    .from("products")
    .select("*");

  const products =
    data || [];

  const inventoryValue =
    products.reduce(

      (sum, item) =>

        sum +

        Number(item.stock || 0) *

        Number(item.price || 0),

      0

    );

  return {

    totalProducts:
      products.length,

    inventoryValue,

    products,

  };

}