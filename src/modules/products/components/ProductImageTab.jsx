import React from "react";
import { uploadProductImage } from "@/services/storageService";
export default function ProductImageTab({
  form,
  setForm,
  imagePreview,
  setImagePreview,
}) {

 async function handleImageChange(e) {
  const file = e.target.files[0];

  if (!file) return;

  if (!form.company_id) {
    alert("Please select a company first.");
    return;
  }

  const preview = URL.createObjectURL(file);

  setImagePreview(preview);

  try {
    const imageUrl = await uploadProductImage(
      file,
      form.company_id
    );

    setForm((prev) => ({
      ...prev,
      image_url: imageUrl,
    }));

  } catch (err) {
    console.error(err);
    alert("Image upload failed.");
  }
}

  return (
    <div className="space-y-6">

      <div>

        <label className="block mb-2 font-medium">
          Product Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded-lg px-4 py-2"
        />

      </div>

      <div className="bg-gray-50 rounded-xl p-6">

        {imagePreview ? (

          <img
            src={imagePreview}
            alt="Preview"
            className="w-72 h-72 object-cover rounded-xl border shadow"
          />

        ) : (

          <div className="w-72 h-72 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400">

            No image selected

          </div>

        )}

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Image URL
        </label>

        <input
          type="text"
          value={form.image_url || ""}
          readOnly
          className="w-full border rounded-lg px-4 py-2 bg-gray-100"
        />

      </div>

    </div>
  );
}