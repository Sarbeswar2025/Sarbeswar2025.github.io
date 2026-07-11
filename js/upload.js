import { supabase } from "./supabase.js";

export async function uploadProjectImage(file) {
  const filePath = `projects/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("portfolio")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);

  return {
    image: data.publicUrl,
    imagePath: filePath,
  };
}

export async function deleteProjectImage(path) {
  const { error } = await supabase.storage

    .from("portfolio")

    .remove([path]);

  if (error) {
    throw error;
  }
}
