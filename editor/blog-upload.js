// ======================================================
// BLOG UPLOAD
// Supabase Storage
// ======================================================

import { supabase } from "../js/supabase.js";

// ==========================
// Upload Cover Image
// ==========================

export async function uploadBlogCover(file) {
  try {
    if (!file) {
      throw new Error("No image selected.");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG and WEBP images are allowed.");
    }

    // Max Size 5MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB.");
    }

    const extension = file.name.split(".").pop();

    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${extension}`;

    const imagePath = `blogs/${filename}`;

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(imagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("portfolio").getPublicUrl(imagePath);

    return {
      image: data.publicUrl,

      imagePath,
    };
  } catch (error) {
    console.error("Upload Error:", error);

    throw error;
  }
}

// ==========================
// Delete Cover Image
// ==========================

export async function deleteBlogCover(imagePath) {
  try {
    if (!imagePath) return;

    const { error } = await supabase.storage
      .from("portfolio")
      .remove([imagePath]);

    if (error) throw error;

    console.log("✅ Cover deleted");
  } catch (error) {
    console.error("Delete Error:", error);

    throw error;
  }
}

// ==========================
// Replace Cover Image
// ==========================

export async function replaceBlogCover(oldImagePath, file) {
  if (oldImagePath) {
    await deleteBlogCover(oldImagePath);
  }

  return await uploadBlogCover(file);
}
