import { supabase } from "./supabase";

const BUCKET = "product-images";

/*
Upload Product Image
*/
export async function uploadProductImage(file, companyId) {
  if (!file) return null;

  const extension = file.name.split(".").pop();

  const filename =
    `${companyId}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  return data.publicUrl;
}

/*
Delete Image
*/
export async function deleteProductImage(imageUrl) {
  if (!imageUrl) return;

  try {
    // Extract everything after "/object/public/product-images/"
    const path = imageUrl.split("/object/public/product-images/")[1];

    if (!path) {
      console.error("Invalid image URL:", imageUrl);
      return;
    }

    console.log("Deleting storage file:", path);

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      console.error("Storage delete error:", error);
      throw error;
    }

    console.log("Storage image deleted.");
  } catch (err) {
    console.error("Delete image failed:", err);
    throw err;
  }
}

/*
Replace Existing Image
*/
export async function replaceProductImage(
  oldImage,
  newFile,
  companyId
) {
  if (oldImage) {
    await deleteProductImage(oldImage);
  }

  return await uploadProductImage(newFile, companyId);
}