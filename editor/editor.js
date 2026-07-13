import { addDocument, updateDocument, getDocument } from "../js/firestore.js";

import { uploadBlogCover, deleteBlogCover } from "./blog-upload.js";

// ======================================================
// BLOG EDITOR
// Part 1.1
// ======================================================

// ==========================
// Global Variables
// ==========================

let editor = null;
let editBlogId = null;

let currentCoverImage = "";
let currentCoverImagePath = "";

let isEditorReady = false;
let autoSaveTimer = null;

// ==========================
// DOM Elements
// ==========================

const blogId = document.getElementById("blogId");

const blogHeading = document.getElementById("blogHeading");
const blogSlug = document.getElementById("blogSlug");
const slugPreview = document.getElementById("slugPreview");

const blogExcerpt = document.getElementById("blogExcerpt");

const blogCategory = document.getElementById("blogCategory");
const blogTags = document.getElementById("blogTags");

const metaTitle = document.getElementById("metaTitle");
const metaDescription = document.getElementById("metaDescription");
const metaKeywords = document.getElementById("metaKeywords");

const blogStatus = document.getElementById("blogStatus");
const publishDate = document.getElementById("publishDate");
const blogFeatured = document.getElementById("blogFeatured");

const blogCover = document.getElementById("blogCover");
const blogUploadBox = document.getElementById("blogUploadBox");
const blogPreview = document.getElementById("blogPreview");

const uploadProgress = document.getElementById("uploadProgress");
const uploadBar = document.getElementById("uploadBar");

const saveDraftBtn = document.getElementById("saveDraft");
const publishBtn = document.getElementById("publishBlog");
const previewBtn = document.getElementById("previewBlog");
const backBtn = document.getElementById("backBlog");

const editorLoading = document.getElementById("editorLoading");

const wordCount = document.getElementById("wordCount");
const readingTime = document.getElementById("readingTime");

const sidebarWordCount = document.getElementById("sidebarWordCount");
const sidebarReadingTime = document.getElementById("sidebarReadingTime");

const characterCount = document.getElementById("characterCount");

const saveStatus = document.getElementById("saveStatus");
const lastSaved = document.getElementById("lastSaved");

// ==========================
// Initialize CKEditor
// ==========================

ClassicEditor.create(document.querySelector("#editor"), {
  placeholder: "Start writing your article...",

  toolbar: {
    shouldNotGroupWhenFull: true,

    items: [
      "undo",
      "redo",

      "|",

      "heading",

      "|",

      "bold",
      "italic",
      "underline",
      "strikethrough",

      "|",

      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",

      "|",

      "alignment",

      "|",

      "bulletedList",
      "numberedList",
      "todoList",

      "|",

      "outdent",
      "indent",

      "|",

      "link",

      "insertTable",

      "blockQuote",

      "|",

      "imageUpload",

      "mediaEmbed",

      "|",

      "code",

      "codeBlock",

      "horizontalLine",

      "specialCharacters",
    ],
  },

  image: {
    toolbar: [
      "imageStyle:inline",

      "imageStyle:block",

      "imageStyle:side",

      "|",

      "toggleImageCaption",

      "imageTextAlternative",
    ],
  },

  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },

  mediaEmbed: {
    previewsInData: true,
  },
})

  .then((newEditor) => {
    editor = newEditor;

    isEditorReady = true;

    console.log("✅ CKEditor Loaded");

    if (editorLoading) {
      editorLoading.style.display = "none";
    }

    if (saveStatus) {
      saveStatus.textContent = "Ready";
    }
  })

  .catch((error) => {
    console.error("CKEditor Error:", error);
  });

// ==========================
// Initial Setup
// ==========================

window.addEventListener("DOMContentLoaded", () => {
  if (blogHeading) {
    blogHeading.focus();
  }
});

// ==========================
// Back Button
// ==========================

if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (confirm("Leave editor? Unsaved changes may be lost.")) {
      window.location.href = "dashboard.html#blogs";
    }
  });
}
// ======================================================
// BLOG EDITOR
// Part 1.2
// ======================================================

// ==========================
// Open File Picker
// ==========================

if (blogUploadBox && blogCover) {
  blogUploadBox.addEventListener("click", () => {
    blogCover.click();
  });
}

// ==========================
// Cover Image Preview
// ==========================

if (blogCover) {
  blogCover.addEventListener("change", previewCoverImage);
}

function previewCoverImage(e) {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image.");

    blogCover.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    blogPreview.innerHTML = `

            <img
                src="${reader.result}"
                alt="Cover Preview">

        `;
  };

  reader.readAsDataURL(file);
}

// ==========================
// Drag & Drop Upload
// ==========================

if (blogUploadBox) {
  blogUploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();

    blogUploadBox.classList.add("dragging");
  });

  blogUploadBox.addEventListener("dragleave", () => {
    blogUploadBox.classList.remove("dragging");
  });

  blogUploadBox.addEventListener("drop", (e) => {
    e.preventDefault();

    blogUploadBox.classList.remove("dragging");

    const file = e.dataTransfer.files[0];

    if (!file) return;

    blogCover.files = e.dataTransfer.files;

    previewCoverImage({
      target: {
        files: [file],
      },
    });
  });
}

// ==========================
// Auto Slug Generator
// ==========================

if (blogHeading) {
  blogHeading.addEventListener("input", () => {
    const slug = generateSlug(blogHeading.value);

    blogSlug.value = slug;

    if (slugPreview) {
      slugPreview.textContent = slug;
    }
  });
}

function generateSlug(text) {
  return text

    .toLowerCase()

    .trim()

    .replace(/[^a-z0-9\s-]/g, "")

    .replace(/\s+/g, "-")

    .replace(/-+/g, "-");
}

// ==========================
// Word Count
// ==========================

function calculateWordCount(text) {
  if (!text.trim()) return 0;

  return text

    .trim()

    .split(/\s+/).length;
}

// ==========================
// Character Count
// ==========================

function calculateCharacterCount(text) {
  return text.length;
}

// ==========================
// Reading Time
// ==========================

function calculateReadingTime(words) {
  return Math.max(
    1,

    Math.ceil(words / 200),
  );
}

// ==========================
// Update Statistics
// ==========================

function updateEditorStatistics() {
  if (!editor || !isEditorReady) return;

  const html = editor.getData();

  const plainText = html.replace(/<[^>]*>/g, " ");

  const words = calculateWordCount(plainText);

  const characters = calculateCharacterCount(plainText);

  const reading = calculateReadingTime(words);

  if (wordCount) wordCount.textContent = `${words} Words`;

  if (sidebarWordCount) sidebarWordCount.textContent = words;

  if (characterCount) characterCount.textContent = characters;

  if (readingTime) readingTime.textContent = `${reading} min read`;

  if (sidebarReadingTime) sidebarReadingTime.textContent = `${reading} min`;
}

// ==========================
// Live Statistics
// ==========================

const waitForEditor = setInterval(() => {
  if (!editor || !isEditorReady) return;

  clearInterval(waitForEditor);

  editor.model.document.on("change:data", () => {
    updateEditorStatistics();

    if (saveStatus) {
      saveStatus.textContent = "Unsaved Changes";
    }
  });
}, 200);

// ==========================
// Status Helpers
// ==========================

function setSavingStatus(text) {
  if (saveStatus) {
    saveStatus.textContent = text;
  }
}

function updateLastSaved() {
  if (!lastSaved) return;

  const now = new Date();

  lastSaved.textContent =
    "Saved " +
    now.toLocaleTimeString([], {
      hour: "2-digit",

      minute: "2-digit",
    });
}
// ======================================================
// BLOG EDITOR
// Part 1.3 - Editor Utilities
// ======================================================

// ==========================
// Auto Save Timer
// ==========================

function startAutoSave() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }

  autoSaveTimer = setInterval(() => {
    if (!editor || !isEditorReady) return;

    console.log("Auto Save...");

    // saveDraft();
  }, 30000);
}

startAutoSave();

// ==========================
// Keyboard Shortcuts
// ==========================

document.addEventListener("keydown", (e) => {
  // Ctrl + S
  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();

    saveDraftBtn.click();
  }

  // Ctrl + P
  if (e.ctrlKey && e.key.toLowerCase() === "p") {
    e.preventDefault();

    publishBtn.click();
  }
});

// ==========================
// Unsaved Changes Warning
// ==========================

window.addEventListener("beforeunload", (e) => {
  if (saveStatus && saveStatus.textContent === "Unsaved Changes") {
    e.preventDefault();

    e.returnValue = "";
  }
});

// ==========================
// Preview Blog
// ==========================

if (previewBtn) {
  previewBtn.addEventListener("click", () => {
    if (!editor) return;

    const preview = window.open("", "_blank");

    if (!preview) {
      alert("Please allow popups for preview.");

      return;
    }

    preview.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>Preview</title>

                <style>

                    body{

                        max-width:900px;

                        margin:40px auto;

                        font-family:Arial,sans-serif;

                        line-height:1.8;

                        padding:30px;

                    }

                    img{

                        max-width:100%;

                        border-radius:12px;

                    }

                    pre{

                        background:#111827;

                        color:#fff;

                        padding:20px;

                        overflow:auto;

                        border-radius:10px;

                    }

                </style>

            </head>

            <body>

                <h1>

                    ${blogHeading.value}

                </h1>

                ${editor.getData()}

            </body>

            </html>

        `);

    preview.document.close();
  });
}

// ==========================
// Copy Slug
// ==========================

if (blogSlug) {
  blogSlug.addEventListener("dblclick", async () => {
    if (!blogSlug.value) return;

    try {
      await navigator.clipboard.writeText(blogSlug.value);

      console.log("Slug Copied");
    } catch (error) {
      console.error(error);
    }
  });
}

// ==========================
// Reset Form
// ==========================

function resetEditor() {
  blogHeading.value = "";

  blogSlug.value = "";

  blogExcerpt.value = "";

  blogCategory.value = "";

  blogTags.value = "";

  metaTitle.value = "";

  metaDescription.value = "";

  metaKeywords.value = "";

  blogStatus.value = "Draft";

  blogFeatured.checked = false;

  publishDate.value = "";

  currentCoverImage = "";

  currentCoverImagePath = "";

  blogPreview.innerHTML = "<span>No Image Selected</span>";

  if (editor) {
    editor.setData("");
  }

  updateEditorStatistics();
}

// ==========================
// Full Screen Toggle
// ==========================

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
// ======================================================
// BLOG EDITOR
// Part 2.1 - Validation & Collect Data
// ======================================================

// ==========================
// Validate Form
// ==========================

function validateBlog(status = "Draft") {
  if (!blogHeading.value.trim()) {
    alert("Blog title is required.");

    blogHeading.focus();

    return false;
  }

  if (!blogCategory.value) {
    alert("Please select a category.");

    blogCategory.focus();

    return false;
  }

  if (!editor || !editor.getData().trim()) {
    alert("Blog content cannot be empty.");

    return false;
  }

  if (status === "Published") {
    if (!blogCover.files.length && !currentCoverImage) {
      alert("Please upload a cover image.");

      return false;
    }

    if (!blogExcerpt.value.trim()) {
      alert("Please write a short description.");

      blogExcerpt.focus();

      return false;
    }
  }

  return true;
}

// ==========================
// Upload Cover Image
// ==========================

async function processCoverImage() {
  let image = currentCoverImage;

  let imagePath = currentCoverImagePath;

  const file = blogCover.files[0];

  // No new image selected
  if (!file) {
    return {
      image,

      imagePath,
    };
  }

  try {
    uploadProgress.style.display = "block";

    uploadBar.style.width = "25%";

    const upload = await uploadBlogCover(file);

    uploadBar.style.width = "100%";

    image = upload.image;

    imagePath = upload.imagePath;

    return {
      image,

      imagePath,
    };
  } catch (error) {
    console.error("Cover Upload Error:", error);

    throw error;
  } finally {
    uploadBar.style.width = "0%";

    uploadProgress.style.display = "none";
  }
}
// ==========================
// Collect Blog Data
// ==========================

async function collectBlogData(status) {
  const cover = await processCoverImage();

  const html = editor.getData();

  const plainText = html.replace(/<[^>]*>/g, " ").trim();

  const words = calculateWordCount(plainText);

  const reading = calculateReadingTime(words);

  return {
    // Basic Information
    title: blogHeading.value.trim(),

    slug: blogSlug.value.trim(),

    excerpt: blogExcerpt.value.trim(),

    content: html,

    // Category & Tags
    category: blogCategory.value,

    tags: blogTags.value
      ? blogTags.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [],

    // Cover Image
    coverImage: cover.image || "",

    coverImagePath: cover.imagePath || "",

    // Publish Settings
    featured: blogFeatured.checked,

    status,

    publishDate: publishDate.value ? new Date(publishDate.value) : null,

    // Statistics
    readingTime: reading,

    wordCount: words,

    views: editBlogId ? currentViews || 0 : 0,

    // SEO
    metaTitle: metaTitle.value.trim(),

    metaDescription: metaDescription.value.trim(),

    metaKeywords: metaKeywords.value
      ? metaKeywords.value
          .split(",")
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword.length > 0)
      : [],

    // Author
    author: "Sarbeswar Panda",

    // Timestamps
    updatedAt: new Date(),
  };
}
// ==========================
// Loading Buttons
// ==========================

function setLoading(button, text) {
  button.disabled = true;

  button.dataset.original = button.innerHTML;

  button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
}

function stopLoading(button) {
  button.disabled = false;

  button.innerHTML = button.dataset.original;
}

// ==========================
// Toast Helper
// ==========================

function showMessage(message) {
  if (typeof toast === "function") {
    toast(message);
  } else {
    alert(message);
  }
}
// ======================================================
// BLOG EDITOR
// Part 2.2 - Save / Publish / Update
// ======================================================

// ==========================
// Save Draft
// ==========================

async function saveDraft() {
  try {
    if (!validateBlog("Draft")) return;

    setLoading(saveDraftBtn, "Saving...");

    setSavingStatus("Saving...");

    const blog = await collectBlogData("Draft");

    if (editBlogId) {
      await updateDocument(
        "blogs",

        editBlogId,

        blog,
      );
    } else {
      const id = await addDocument(
        "blogs",

        {
          ...blog,

          createdAt: new Date(),
        },
      );

      editBlogId = id;

      blogId.value = id;
    }

    updateLastSaved();

    setSavingStatus("Draft Saved");

    showMessage("Draft Saved Successfully.");
  } catch (error) {
    console.error(error);

    showMessage(error.message);
  } finally {
    stopLoading(saveDraftBtn);
  }
}

// ==========================
// Publish Blog
// ==========================

async function publishBlog() {
  try {
    if (!validateBlog("Published")) return;

    setLoading(publishBtn, "Publishing...");

    setSavingStatus("Publishing...");

    const blog = await collectBlogData("Published");

    blog.publishedAt = new Date();

    if (editBlogId) {
      await updateDocument(
        "blogs",

        editBlogId,

        blog,
      );
    } else {
      const id = await addDocument(
        "blogs",

        {
          ...blog,

          createdAt: new Date(),
        },
      );

      editBlogId = id;

      blogId.value = id;
    }

    updateLastSaved();

    setSavingStatus("Published");

    showMessage("Blog Published Successfully.");

    setTimeout(() => {
      window.location.href = "dashboard.html#blogs";
    }, 1200);
  } catch (error) {
    console.error(error);

    showMessage(error.message);
  } finally {
    stopLoading(publishBtn);
  }
}

// ==========================
// Event Listeners
// ==========================

if (saveDraftBtn) {
  saveDraftBtn.addEventListener(
    "click",

    saveDraft,
  );
}

if (publishBtn) {
  publishBtn.addEventListener(
    "click",

    publishBlog,
  );
}

// ==========================
// Sidebar Buttons
// ==========================

const saveDraftSidebar = document.getElementById("saveDraftSidebar");

const publishSidebar = document.getElementById("publishSidebar");

if (saveDraftSidebar) {
  saveDraftSidebar.onclick = saveDraft;
}

if (publishSidebar) {
  publishSidebar.onclick = publishBlog;
}

// ==========================
// Load Blog For Editing
// ==========================

async function loadBlog(id) {
  try {
    const blog = await getDocument(
      "blogs",

      id,
    );

    if (!blog) return;

    editBlogId = id;

    blogId.value = id;

    blogHeading.value = blog.title || "";

    blogSlug.value = blog.slug || "";

    blogExcerpt.value = blog.excerpt || "";

    blogCategory.value = blog.category || "";

    blogTags.value = blog.tags ? blog.tags.join(", ") : "";

    metaTitle.value = blog.metaTitle || "";

    metaDescription.value = blog.metaDescription || "";

    metaKeywords.value = blog.metaKeywords ? blog.metaKeywords.join(", ") : "";

    blogStatus.value = blog.status || "Draft";

    blogFeatured.checked = blog.featured || false;

    currentCoverImage = blog.coverImage || "";

    currentCoverImagePath = blog.coverImagePath || "";

    if (currentCoverImage) {
      blogPreview.innerHTML = `

            <img

            src="${currentCoverImage}"

            alt="Cover">

            `;
    }

    if (editor) {
      editor.setData(blog.content || "");
    }

    updateEditorStatistics();
  } catch (error) {
    console.error(error);
  }
}

// ==========================
// Edit Mode
// ==========================

const params = new URLSearchParams(window.location.search);

const blogToEdit = params.get("id");

if (blogToEdit) {
  const wait = setInterval(() => {
    if (!editor) return;

    clearInterval(wait);

    loadBlog(blogToEdit);
  }, 100);
}
// ======================================================
// BLOG EDITOR
// Part 2.3 - Production Features
// ======================================================

// ==========================
// Auto Save
// ==========================

// function startAutoSave() {

//     if (autoSaveTimer) {

//         clearInterval(autoSaveTimer);

//     }

//     autoSaveTimer = setInterval(async () => {

//         if (!isEditorReady) return;

//         if (saveStatus.textContent !== "Unsaved Changes") return;

//         try {

//             await saveDraft();

//             console.log("✅ Auto Draft Saved");

//         }

//         catch (error) {

//             console.error(error);

//         }

//     }, 30000);

// }

// startAutoSave();

// ==========================
// Keyboard Shortcuts
// ==========================

document.addEventListener("keydown", async (e) => {
  // Ctrl + S

  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();

    await saveDraft();
  }

  // Ctrl + Shift + P

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") {
    e.preventDefault();

    await publishBlog();
  }
});

// ==========================
// Delete Old Cover
// ==========================

async function replaceCoverImage() {
  if (currentCoverImagePath && blogCover.files.length) {
    try {
      await deleteBlogCover(currentCoverImagePath);
    } catch (error) {
      console.error(error);
    }
  }
}

// ==========================
// Unsaved Changes
// ==========================

window.addEventListener(
  "beforeunload",

  function (e) {
    if (saveStatus.textContent === "Unsaved Changes") {
      e.preventDefault();

      e.returnValue = "";
    }
  },
);

// ==========================
// Preview Blog
// ==========================

function previewBlogWindow() {
  if (!editor) return;

  const html = editor.getData();

  const win = window.open(
    "",

    "_blank",
  );

  win.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>

Preview

</title>

<style>

body{

max-width:900px;

margin:40px auto;

font-family:Arial,sans-serif;

line-height:1.8;

padding:20px;

}

img{

max-width:100%;

border-radius:12px;

}

pre{

background:#111827;

color:#fff;

padding:20px;

border-radius:10px;

overflow:auto;

}

table{

width:100%;

border-collapse:collapse;

margin:20px 0;

}

table td,

table th{

border:1px solid #ddd;

padding:10px;

}

blockquote{

border-left:5px solid #2563eb;

padding-left:20px;

font-style:italic;

}

</style>

</head>

<body>

<h1>

${blogHeading.value}

</h1>

${html}

</body>

</html>

`);

  win.document.close();
}

if (previewBtn) {
  previewBtn.onclick = previewBlogWindow;
}

const previewSidebar = document.getElementById("previewSidebar");

if (previewSidebar) {
  previewSidebar.onclick = previewBlogWindow;
}

// ==========================
// Fullscreen
// ==========================

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ==========================
// Reset Editor
// ==========================

function clearEditor() {
  editBlogId = null;

  currentCoverImage = "";

  currentCoverImagePath = "";

  blogId.value = "";

  blogHeading.value = "";

  blogSlug.value = "";

  blogExcerpt.value = "";

  blogCategory.value = "";

  blogTags.value = "";

  metaTitle.value = "";

  metaDescription.value = "";

  metaKeywords.value = "";

  blogFeatured.checked = false;

  blogStatus.value = "Draft";

  publishDate.value = "";

  blogCover.value = "";

  blogPreview.innerHTML = "<span>No Image Selected</span>";

  if (editor) {
    editor.setData("");
  }

  updateEditorStatistics();
}

// ==========================
// Generate Slug Again
// ==========================

if (blogHeading) {
  blogHeading.addEventListener(
    "blur",

    () => {
      blogSlug.value = generateSlug(blogHeading.value);
    },
  );
}

// ==========================
// Copy Slug
// ==========================

if (blogSlug) {
  blogSlug.addEventListener(
    "dblclick",

    async () => {
      if (!blogSlug.value) return;

      try {
        await navigator.clipboard.writeText(blogSlug.value);

        showMessage("Slug copied.");
      } catch (error) {
        console.error(error);
      }
    },
  );
}

// ==========================
// Hide Upload Progress
// ==========================

if (uploadProgress) {
  uploadProgress.style.display = "none";
}

// ==========================
// Ready
// ==========================

console.log("✅ Blog Editor Ready");

// ======================================================
// BLOG EDITOR
// Part 2.4 - Production Optimization
// ======================================================

// ==========================
// Prevent Double Click
// ==========================

let isPublishing = false;

// ==========================
// Update Page Title
// ==========================

if (blogHeading) {
  blogHeading.addEventListener("input", () => {
    const title = blogHeading.value.trim();

    document.title = title ? `${title} | Blog Editor` : "Blog Editor";
  });
}

// ==========================
// Online / Offline
// ==========================

window.addEventListener("online", () => {
  showMessage("Internet Connected");
});

window.addEventListener("offline", () => {
  showMessage("No Internet Connection");
});

// ==========================
// Confirm Publish
// ==========================

async function confirmPublish() {
  if (isPublishing) return false;

  return confirm("Publish this blog?");
}

// ==========================
// Safe Publish Wrapper
// ==========================

async function publishBlogSafe() {
  const ok = await confirmPublish();

  if (!ok) return;

  isPublishing = true;

  try {
    await publishBlog();
  } finally {
    isPublishing = false;
  }
}

// ==========================
// Replace Publish Button
// ==========================

if (publishBtn) {
  publishBtn.onclick = publishBlogSafe;
}

const publishSidebarBtn = document.getElementById("publishSidebar");

if (publishSidebarBtn) {
  publishSidebarBtn.onclick = publishBlogSafe;
}

// ==========================
// Duplicate Slug Check
// ==========================

async function checkSlugExists(slug) {
  // TODO
  // Query Firestore
  // where slug == slug

  return false;
}

// ==========================
// Auto Generate Unique Slug
// ==========================

async function ensureUniqueSlug() {
  let slug = generateSlug(blogHeading.value);

  let count = 1;

  while (await checkSlugExists(slug)) {
    slug = generateSlug(blogHeading.value) + "-" + count;

    count++;
  }

  blogSlug.value = slug;
}

// ==========================
// Clean Upload Progress
// ==========================

function resetUploadProgress() {
  uploadProgress.style.display = "none";

  uploadBar.style.width = "0%";
}

// ==========================
// Reset Publish State
// ==========================

function resetPublishingState() {
  isPublishing = false;

  resetUploadProgress();
}

// ==========================
// Clear Console Logs
// ==========================

function logSuccess(message) {
  console.log(
    "✅",

    message,
  );
}

function logError(error) {
  console.error(
    "❌",

    error,
  );
}

// ==========================
// Image Cleanup
// ==========================

window.addEventListener(
  "beforeunload",

  () => {
    resetUploadProgress();
  },
);

// ==========================
// Initialize
// ==========================

logSuccess("Editor Production Ready");

import { uploadEditorImage } from "./editor-upload.js";

function UploadAdapter(loader) {
  return {
    upload: async () => {
      const file = await loader.file;

      const upload = await uploadEditorImage(file);

      return {
        default: upload.url,
      };
    },
  };
}

function UploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    UploadAdapter(loader);
}
