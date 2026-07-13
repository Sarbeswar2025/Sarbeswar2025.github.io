/* ==========================================================
   BLOG.JS
   Part 1.1.1
   Imports • DOM • Global Variables
========================================================== */

import { getBlog, updateBlog } from "./blog-service.js";

import { getCollection } from "./firestore.js";

/* ==========================================================
   URL
========================================================== */

const params = new URLSearchParams(window.location.search);

const blogId = params.get("id");

/* ==========================================================
   DOM
========================================================== */

// Loading

const loadingOverlay = document.getElementById("loadingOverlay");

// Hero

const pageTitle = document.getElementById("pageTitle");

const breadcrumbTitle = document.getElementById("breadcrumbTitle");

const blogCategory = document.getElementById("blogCategory");

const blogTitle = document.getElementById("blogTitle");

const blogExcerpt = document.getElementById("blogExcerpt");

const blogCover = document.getElementById("blogCover");

const blogContent = document.getElementById("blogContent");

// Meta

const authorName = document.getElementById("authorName");

const publishDate = document.getElementById("publishDate");

const readingTime = document.getElementById("readingTime");

const blogViews = document.getElementById("blogViews");

// Sidebar

const tableOfContents = document.getElementById("tableOfContents");

const tagList = document.getElementById("blogTags");

// Author

const authorFullName = document.getElementById("authorFullName");

const authorBio = document.getElementById("authorBio");

const authorImage = document.getElementById("authorImage");

// Previous / Next

const previousBlog = document.getElementById("previousBlog");

const previousBlogTitle = document.getElementById("previousBlogTitle");

const nextBlog = document.getElementById("nextBlog");

const nextBlogTitle = document.getElementById("nextBlogTitle");

// Related

const relatedBlogs = document.getElementById("relatedBlogs");

// Newsletter

const newsletterForm = document.getElementById("newsletterForm");

const subscriberEmail = document.getElementById("subscriberEmail");

// Share

const shareFacebook = document.getElementById("shareFacebook");

const shareTwitter = document.getElementById("shareTwitter");

const shareLinkedIn = document.getElementById("shareLinkedIn");

const shareWhatsApp = document.getElementById("shareWhatsApp");

const copyLink = document.getElementById("copyLink");

// Scroll

const scrollTopBtn = document.getElementById("scrollTopBtn");

/* ==========================================================
   SEO
========================================================== */

const metaDescription = document.getElementById("metaDescription");

const metaKeywords = document.getElementById("metaKeywords");

const ogTitle = document.getElementById("ogTitle");

const ogDescription = document.getElementById("ogDescription");

const ogImage = document.getElementById("ogImage");

const ogURL = document.getElementById("ogURL");

const twitterTitle = document.getElementById("twitterTitle");

const twitterDescription = document.getElementById("twitterDescription");

const twitterImage = document.getElementById("twitterImage");

const canonicalURL = document.getElementById("canonicalURL");

/* ==========================================================
   Globals
========================================================== */

let blog = null;

let blogs = [];

let related = [];

let previous = null;

let next = null;

let toc = [];

/* ==========================================================
   Constants
========================================================== */

const WEBSITE_NAME = "Sarbeswar Panda";

const AUTHOR = "Sarbeswar Panda";

const DEFAULT_IMAGE = "../assets/images/blog-placeholder.jpg";

const DEFAULT_DESCRIPTION =
  "AI, Machine Learning, Web Development and Programming articles.";

/* ==========================================================
   Reading Progress
========================================================== */

const readingProgress = document.createElement("div");

readingProgress.className = "reading-progress";

document.body.appendChild(readingProgress);

/* ==========================================================
   BLOG.JS
   Part 1.1.2.1
   Initialization • Loading • Utility Functions
========================================================== */

/* ==========================================================
   Initialize
========================================================== */

document.addEventListener("DOMContentLoaded", initializeBlog);
// ==========================================================
// Initialize Blog
// ==========================================================

async function initializeBlog() {
  try {
    showLoading();

    // Check Blog ID
    if (!blogId) {
      show404();

      return;
    }

    console.log("Loading Blog:", blogId);

    // Load all blogs
    blogs = await getCollection("blogs");

    if (!Array.isArray(blogs)) {
      blogs = [];
    }

    // Load current blog
    await loadBlog();

    // Load related blogs
    await loadRelatedBlogs();

    // Previous / Next
    buildPreviousNext();

    // Generate TOC
    generateTableOfContents();

    // Register Events
    registerEvents();

    // Reading Progress
    updateReadingProgress();

    // Hide Loader
    hideLoading();
  } catch (error) {
    console.error("Initialization Error:", error);

    hideLoading();

    show404();
  }
}

/* ==========================================================
   Loading
========================================================== */

function showLoading() {
  if (!loadingOverlay) return;

  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  if (!loadingOverlay) return;

  loadingOverlay.classList.add("hidden");
}

/* ==========================================================
   Format Date
========================================================== */

function formatDate(date) {
  if (!date) return "";

  try {
    const value = date.toDate ? date.toDate() : new Date(date);

    return value.toLocaleDateString(
      "en-IN",

      {
        day: "numeric",

        month: "long",

        year: "numeric",
      },
    );
  } catch {
    return "";
  }
}

/* ==========================================================
   Word Count
========================================================== */

function wordCount(html) {
  if (!html) return 0;

  return html

    .replace(/<[^>]*>/g, " ")

    .trim()

    .split(/\s+/)

    .filter(Boolean).length;
}

/* ==========================================================
   Reading Time
========================================================== */

function calculateReadingTime(html) {
  const words = wordCount(html);

  return Math.max(
    1,

    Math.ceil(words / 200),
  );
}

/* ==========================================================
   Escape HTML
========================================================== */

function escapeHTML(text) {
  if (!text) return "";

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* ==========================================================
   Slug
========================================================== */

function slugify(text) {
  return text

    .toLowerCase()

    .trim()

    .replace(/[^\w\s-]/g, "")

    .replace(/\s+/g, "-")

    .replace(/-+/g, "-");
}

/* ==========================================================
   Scroll To Top
========================================================== */

function scrollTopPage() {
  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
}

/* ==========================================================
   Number Formatter
========================================================== */

function formatNumber(number) {
  return new Intl.NumberFormat("en-IN").format(number || 0);
}

/* ==========================================================
   404
========================================================== */

function show404() {
  hideLoading();

  document.body.innerHTML = `

        <section class="error-page">

            <div class="container">

                <h1>404</h1>

                <h2>Blog Not Found</h2>

                <p>

                    The requested article does not exist.

                </p>

                <a
                    href="blogs.html"
                    class="primary-btn"
                >

                    Back to Blogs

                </a>

            </div>

        </section>

    `;
}

/* ==========================================================
   Error
========================================================== */

function showError(message) {
  hideLoading();

  alert(message);
}

/* ==========================================================
   BLOG.JS
   Part 1.1.2.2
   Startup • Event Listeners • Reading Progress
========================================================== */

/* ==========================================================
   Start Loading Blog
========================================================== */

async function startBlog() {
  try {
    await loadBlog();

    await loadRelatedBlogs();

    buildPreviousNext();

    generateTableOfContents();

    updateReadingProgress();

    registerEvents();

    hideLoading();
  } catch (error) {
    console.error(error);

    show404();
  }
}

/* ==========================================================
   Continue Initialization
========================================================== */

initializeBlog = async function () {
  try {
    showLoading();

    if (!blogId) {
      show404();

      return;
    }

    blogs = await getCollection("blogs");

    if (!Array.isArray(blogs)) {
      blogs = [];
    }

    await startBlog();
  } catch (error) {
    console.error(error);

    showError("Unable to initialize blog.");
  }
};

/* ==========================================================
   Register Events
========================================================== */

function registerEvents() {
  /* Scroll */

  window.addEventListener(
    "scroll",

    handleScroll,
  );

  /* Resize */

  window.addEventListener(
    "resize",

    updateReadingProgress,
  );

  /* Copy */

  copyLink?.addEventListener(
    "click",

    copyCurrentLink,
  );

  /* Social */

  shareFacebook?.addEventListener(
    "click",

    shareFacebookPost,
  );

  shareTwitter?.addEventListener(
    "click",

    shareTwitterPost,
  );

  shareLinkedIn?.addEventListener(
    "click",

    shareLinkedInPost,
  );

  shareWhatsApp?.addEventListener(
    "click",

    shareWhatsAppPost,
  );

  /* Newsletter */

  newsletterForm?.addEventListener(
    "submit",

    subscribeNewsletter,
  );

  /* Scroll Top */

  scrollTopBtn?.addEventListener(
    "click",

    scrollTopPage,
  );
}

/* ==========================================================
   Scroll
========================================================== */

function handleScroll() {
  updateReadingProgress();

  if (window.scrollY > 400) {
    scrollTopBtn?.classList.add("show");
  } else {
    scrollTopBtn?.classList.remove("show");
  }
}

/* ==========================================================
   Reading Progress
========================================================== */

function updateReadingProgress() {
  if (!blogContent || !readingProgress) return;

  const articleTop = blogContent.offsetTop;

  const articleHeight = blogContent.offsetHeight;

  const scroll = window.scrollY;

  const viewport = window.innerHeight;

  const total = articleHeight - viewport;

  let percent = ((scroll - articleTop) / total) * 100;

  percent = Math.min(
    100,

    Math.max(
      0,

      percent,
    ),
  );

  readingProgress.style.width = percent + "%";
}

/* ==========================================================
   Current URL
========================================================== */

function currentURL() {
  return window.location.href;
}

/* ==========================================================
   Current Title
========================================================== */

function currentTitle() {
  return blog ? blog.title : document.title;
}

/* ==========================================================
   Fire After Page Ready
========================================================== */

window.addEventListener(
  "load",

  () => {
    setTimeout(
      hideLoading,

      300,
    );
  },
);

/* ==========================================================
   BLOG.JS
   Part 1.2.1
   Firestore Blog Loading & Basic Rendering
========================================================== */

/* ==========================================================
   Load Blog
========================================================== */

async function loadBlog() {
  try {
    // Find Blog

    blog = blogs.find((item) => item.id === blogId);

    if (!blog) {
      show404();

      return;
    }

    console.log("Blog Loaded:", blog);

    // Render

    renderBasicInformation();

    renderContent();

    renderTags();
  } catch (error) {
    console.error("Load Blog Error:", error);

    show404();
  }
}

/* ==========================================================
   Basic Information
========================================================== */

function renderBasicInformation() {
  // Title

  if (pageTitle) pageTitle.textContent = blog.title;

  if (blogTitle) blogTitle.textContent = blog.title;

  if (breadcrumbTitle) breadcrumbTitle.textContent = blog.title;

  // Category

  if (blogCategory) blogCategory.textContent = blog.category || "General";

  // Excerpt

  if (blogExcerpt) blogExcerpt.textContent = blog.excerpt || "";

  // Cover

  if (blogCover) {
    blogCover.src = blog.coverImage || DEFAULT_IMAGE;

    blogCover.alt = blog.title;
  }

  // Author

  if (authorName) authorName.textContent = blog.author || AUTHOR;

  if (authorFullName) authorFullName.textContent = blog.author || AUTHOR;

  // Publish Date

  if (publishDate)
    publishDate.textContent = formatDate(blog.publishDate || blog.createdAt);

  // Reading Time

  const reading = blog.readingTime || calculateReadingTime(blog.content);

  if (readingTime) readingTime.textContent = `${reading} min read`;

  // Views

  if (blogViews) blogViews.textContent = formatNumber(blog.views || 0);
}

/* ==========================================================
   Render Article
========================================================== */

function renderContent() {
  if (!blogContent) return;

  blogContent.innerHTML = blog.content || "<p>No content found.</p>";
}

/* ==========================================================
   Render Tags
========================================================== */

function renderTags() {
  if (!tagList) return;

  tagList.innerHTML = "";

  if (!blog.tags || blog.tags.length === 0) {
    tagList.innerHTML = "<span>No Tags</span>";

    return;
  }

  blog.tags.forEach((tag) => {
    const chip = document.createElement("span");

    chip.textContent = "#" + tag;

    tagList.appendChild(chip);
  });
}

/* ==========================================================
   Update Hero Image
========================================================== */

function updateHeroImage() {
  if (!blogCover) return;

  blogCover.onerror = () => {
    blogCover.src = DEFAULT_IMAGE;
  };
}

/* ==========================================================
   Update Author Bio
========================================================== */

function renderAuthor() {
  if (authorBio) {
    authorBio.textContent =
      blog.authorBio ||
      "AI & Machine Learning Developer passionate about Artificial Intelligence, Full Stack Development and Cloud Computing.";
  }
}

/* ==========================================================
   Refresh UI
========================================================== */

function refreshUI() {
  renderBasicInformation();

  renderContent();

  renderTags();

  renderAuthor();

  updateHeroImage();
}

/* ==========================================================
   BLOG.JS
   Part 1.2.2
   SEO • Views • Canonical • Error Handling
========================================================== */

/* ==========================================================
   Update SEO
========================================================== */

function updateSEO() {

    if (!blog) return;

    // Document Title

    document.title = `${blog.title} | ${WEBSITE_NAME}`;

    // Meta

    if (metaDescription) {

        metaDescription.setAttribute(

            "content",

            blog.metaDescription ||

            blog.excerpt ||

            DEFAULT_DESCRIPTION

        );

    }

    if (metaKeywords) {

        metaKeywords.setAttribute(

            "content",

            blog.metaKeywords?.join(", ") ||

            blog.tags?.join(", ") ||

            ""

        );

    }

    // Open Graph

    if (ogTitle) {

        ogTitle.setAttribute(

            "content",

            blog.metaTitle ||

            blog.title

        );

    }

    if (ogDescription) {

        ogDescription.setAttribute(

            "content",

            blog.metaDescription ||

            blog.excerpt ||

            DEFAULT_DESCRIPTION

        );

    }

    if (ogImage) {

        ogImage.setAttribute(

            "content",

            blog.coverImage ||

            DEFAULT_IMAGE

        );

    }

    if (ogURL) {

        ogURL.setAttribute(

            "content",

            window.location.href

        );

    }

    // Twitter

    if (twitterTitle) {

        twitterTitle.setAttribute(

            "content",

            blog.metaTitle ||

            blog.title

        );

    }

    if (twitterDescription) {

        twitterDescription.setAttribute(

            "content",

            blog.metaDescription ||

            blog.excerpt ||

            DEFAULT_DESCRIPTION

        );

    }

    if (twitterImage) {

        twitterImage.setAttribute(

            "content",

            blog.coverImage ||

            DEFAULT_IMAGE

        );

    }

    // Canonical

    if (canonicalURL) {

        canonicalURL.setAttribute(

            "href",

            window.location.href

        );

    }

}

/* ==========================================================
   Increment Views
========================================================== */

async function incrementViews() {

    if (!blog) return;

    try {

        const currentViews =

            Number(blog.views || 0);

        const newViews =

            currentViews + 1;

        await updateBlog(

            blog.id,

            {

                views: newViews

            }

        );

        blog.views = newViews;

        if (blogViews) {

            blogViews.textContent =

                formatNumber(newViews);

        }

    }

    catch (error) {

        console.error(

            "View Count Error:",

            error

        );

    }

}

/* ==========================================================
   Finalize Blog
========================================================== */

async function finalizeBlog() {

    updateSEO();

    renderAuthor();

    updateHeroImage();

    await incrementViews();

}

/* ==========================================================
   Improve Load Blog
========================================================== */

// Call this at the end of loadBlog()

// await finalizeBlog();

/* ==========================================================
   Empty Blog
========================================================== */

function showEmptyBlog() {

    if (!blogContent) return;

    blogContent.innerHTML = `

        <div class="empty-blog">

            <h2>

                No Content Available

            </h2>

            <p>

                This article has no content.

            </p>

        </div>

    `;

}

/* ==========================================================
   Network Error
========================================================== */

function showNetworkError() {

    document.body.innerHTML = `

        <section class="error-page">

            <div class="container">

                <h1>

                    Connection Error

                </h1>

                <p>

                    Unable to connect to the server.

                </p>

                <button

                    class="primary-btn"

                    onclick="location.reload()"

                >

                    Try Again

                </button>

            </div>

        </section>

    `;

}

/* ==========================================================
   Firestore Error
========================================================== */

function firestoreError(error) {

    console.error(

        "Firestore Error:",

        error

    );

    showNetworkError();

}

/* ==========================================================
   Loading Complete
========================================================== */

function finishLoading() {

    hideLoading();

    document.body.classList.add(

        "fade-in"

    );

}

/* ==========================================================
   Recommended loadBlog()
========================================================== */

/*

renderBasicInformation();

renderContent();

renderTags();

await finalizeBlog();

finishLoading();

*/

