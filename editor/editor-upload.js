// ======================================================
// EDITOR IMAGE UPLOAD
// ======================================================

import { supabase } from "../js/supabase.js";

// ==========================
// Upload Editor Image
// ==========================

export async function uploadEditorImage(file) {

    try {

        if (!file) {

            throw new Error("No image selected.");

        }

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp",

            "image/jpg",

            "image/gif"

        ];

        if (!allowedTypes.includes(file.type)) {

            throw new Error(

                "Unsupported image format."

            );

        }

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {

            throw new Error(

                "Image must be smaller than 10MB."

            );

        }

        const extension =

            file.name.split(".").pop();

        const filename =

            `${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const imagePath =

            `blog-editor/${filename}`;

        const { error } = await supabase

            .storage

            .from("portfolio")

            .upload(imagePath, file, {

                cacheControl: "3600",

                upsert: false

            });

        if (error) throw error;

        const { data } = supabase

            .storage

            .from("portfolio")

            .getPublicUrl(imagePath);

        return {

            url: data.publicUrl,

            path: imagePath

        };

    }

    catch (error) {

        console.error(

            "Editor Upload Error:",

            error

        );

        throw error;

    }

}

// ==========================
// Delete Editor Image
// ==========================

export async function deleteEditorImage(path) {

    if (!path) return;

    const { error } = await supabase

        .storage

        .from("portfolio")

        .remove([path]);

    if (error) throw error;

}