// ======================================================
// BLOGS.JS
// Part 1.1 : Imports, DOM & Global State
// ======================================================

import {

    getCollection

} from "./../../js/firestore.js";

// ======================================================
// DOM Elements
// ======================================================

const blogGrid =
document.getElementById("blogGrid");

const featuredBlog =
document.getElementById("featuredBlog");

const blogSkeleton =
document.getElementById("blogSkeleton");

const emptyBlogs =
document.getElementById("emptyBlogs");

const blogSearch =
document.getElementById("blogSearch");

const categoryFilter =
document.getElementById("categoryFilter");

const categoryChips =
document.querySelectorAll(".category-chip");

const paginationNumbers =
document.getElementById("paginationNumbers");

const prevPage =
document.getElementById("prevPage");

const nextPage =
document.getElementById("nextPage");

const showingBlogs =
document.getElementById("showingBlogs");

const totalBlogs =
document.getElementById("totalBlogs");

const totalViews =
document.getElementById("totalViews");

const totalCategories =
document.getElementById("totalCategories");

const scrollTopBtn =
document.getElementById("scrollTopBtn");

const newsletterForm =
document.getElementById("newsletterForm");

// ======================================================
// Global Variables
// ======================================================

let blogs = [];

let filteredBlogs = [];

let featured = null;

let currentPage = 1;

const blogsPerPage = 6;

let currentSearch = "";

let currentCategory = "All";

let loading = false;

// ======================================================
// Helpers
// ======================================================

function showLoader(){

    if(blogSkeleton){

        blogSkeleton.classList.add("show");

    }

    if(blogGrid){

        blogGrid.style.display="none";

    }

    if(emptyBlogs){

        emptyBlogs.classList.remove("show");

    }

}

function hideLoader(){

    if(blogSkeleton){

        blogSkeleton.classList.remove("show");

    }

    if(blogGrid){

        blogGrid.style.display="grid";

    }

}

function showEmpty(){

    if(emptyBlogs){

        emptyBlogs.classList.add("show");

    }

    if(blogGrid){

        blogGrid.innerHTML="";

    }

}

function hideEmpty(){

    if(emptyBlogs){

        emptyBlogs.classList.remove("show");

    }

}

// ======================================================
// Date Formatter
// ======================================================

function formatDate(date){

    if(!date) return "";

    const d =

        date.toDate

        ? date.toDate()

        : new Date(date);

    return d.toLocaleDateString(

        "en-IN",

        {

            day:"numeric",

            month:"short",

            year:"numeric"

        }

    );

}

// ======================================================
// Number Formatter
// ======================================================

function formatNumber(number){

    return new Intl.NumberFormat(

        "en-IN"

    ).format(number);

}

// ======================================================
// Reading Time
// ======================================================

function readingTime(blog){

    return blog.readingTime || 1;

}

// ======================================================
// Blog URL
// ======================================================

function blogURL(blog){

    return

    `blog.html?id=${blog.id}`;

}

// ======================================================
// Error
// ======================================================

function showError(message){

    console.error(message);

    if(blogGrid){

        blogGrid.innerHTML=

        `

        <div class="empty-state show">

            <i class="fas fa-circle-exclamation"></i>

            <h3>

                Something went wrong

            </h3>

            <p>

                ${message}

            </p>

        </div>

        `;

    }

}
// ======================================================
// BLOGS.JS
// Part 1.2.1 : Load Blogs from Firestore
// ======================================================

// ==========================
// Load Published Blogs
// ==========================

async function loadBlogs() {

    try {

        loading = true;

        showLoader();

        const data = await getCollection("blogs");

        blogs = data

            .filter(blog =>

                blog.status === "published"

            )

            .sort((a, b) => {

                const dateA =

                    a.publishDate?.toDate

                        ? a.publishDate.toDate()

                        : new Date(a.publishDate || a.createdAt);

                const dateB =

                    b.publishDate?.toDate

                        ? b.publishDate.toDate()

                        : new Date(b.publishDate || b.createdAt);

                return dateB - dateA;

            });

        filteredBlogs = [...blogs];

        selectFeaturedBlog();

        loading = false;

    }

    catch (error) {

        loading = false;

        hideLoader();

        showError(

            "Unable to load blogs."

        );

        console.error(error);

    }

}

// ======================================================
// Select Featured Blog
// ======================================================

function selectFeaturedBlog() {

    featured =

        blogs.find(

            blog => blog.featured === true

        ) ||

        blogs[0] ||

        null;

}

// ======================================================
// Refresh Blog List
// ======================================================

async function refreshBlogs() {

    await loadBlogs();

}

// ======================================================
// Reload Blogs
// ======================================================

async function reloadBlogs() {

    currentPage = 1;

    await loadBlogs();

}

// ======================================================
// Get Blog By ID
// ======================================================

function getBlogById(id) {

    return blogs.find(

        blog => blog.id === id

    );

}

// ======================================================
// Get Blog By Slug
// ======================================================

function getBlogBySlug(slug) {

    return blogs.find(

        blog => blog.slug === slug

    );

}

// ======================================================
// Latest Blogs
// ======================================================

function latestBlogs(limit = 5) {

    return blogs.slice(0, limit);

}

// ======================================================
// Featured Exists
// ======================================================

function hasFeaturedBlog() {

    return featured !== null;

}
// ======================================================
// BLOGS.JS
// Part 1.2.2 : Statistics & Initialization
// ======================================================

// ==========================
// Calculate Statistics
// ==========================

function calculateStatistics() {

    const total = blogs.length;

    const views = blogs.reduce(

        (sum, blog) =>

            sum + (blog.views || 0),

        0

    );

    const categories = new Set(

        blogs

            .map(blog => blog.category)

            .filter(category => category)

    );

    if (totalBlogs) {

        totalBlogs.textContent =

            formatNumber(total);

    }

    if (totalViews) {

        totalViews.textContent =

            formatNumber(views);

    }

    if (totalCategories) {

        totalCategories.textContent =

            formatNumber(categories.size);

    }

}

// ==========================
// Update Blog Count
// ==========================

function updateBlogCount() {

    if (!showingBlogs) return;

    showingBlogs.textContent =

        `Showing ${filteredBlogs.length} Blog${filteredBlogs.length !== 1 ? "s" : ""}`;

}

// ==========================
// Reset Filters
// ==========================

function resetFilters() {

    currentSearch = "";

    currentCategory = "All";

    currentPage = 1;

    if (blogSearch) {

        blogSearch.value = "";

    }

    if (categoryFilter) {

        categoryFilter.value = "All";

    }

    categoryChips.forEach(chip => {

        chip.classList.remove("active");

        if (chip.dataset.category === "All") {

            chip.classList.add("active");

        }

    });

}

// ==========================
// Initialize Blog Data
// ==========================

async function initializeBlogs() {

    try {

        await loadBlogs();

        calculateStatistics();

        updateBlogCount();

        hideLoader();

        // These functions will be added
        // in the next parts

        renderFeaturedBlog();

        renderBlogs();

        renderPagination();

    }

    catch (error) {

        console.error(error);

        showError(

            "Unable to initialize blogs."

        );

    }

}

// ==========================
// Refresh Entire Page
// ==========================

async function refreshPage() {

    resetFilters();

    await initializeBlogs();

}

// ==========================
// Start Application
// ==========================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeBlogs();

    }

);

// ======================================================
// BLOGS.JS
// Part 2.1 : Render Featured Blog
// ======================================================

// ==========================
// Render Featured Blog
// ==========================

function renderFeaturedBlog() {

    if (!featuredBlog) return;

    if (!featured) {

        featuredBlog.innerHTML = `

            <div class="featured-empty">

                <i class="fas fa-newspaper"></i>

                <h3>No Featured Blog Available</h3>

                <p>

                    Publish a featured article from the admin panel.

                </p>

            </div>

        `;

        return;

    }

    featuredBlog.innerHTML = `

        <div class="featured-image">

            <img
                src="${featured.coverImage || '../assets/images/blog-placeholder.jpg'}"
                alt="${featured.title}"
                loading="lazy"
            >

        </div>

        <div class="featured-content">

            <span class="featured-category">

                ${featured.category}

            </span>

            <h2>

                ${featured.title}

            </h2>

            <p>

                ${featured.excerpt}

            </p>

            <div class="featured-meta">

                <span>

                    <i class="fas fa-user"></i>

                    ${featured.author || "Sarbeswar Panda"}

                </span>

                <span>

                    <i class="fas fa-calendar"></i>

                    ${formatDate(featured.publishDate)}

                </span>

                <span>

                    <i class="fas fa-clock"></i>

                    ${featured.readingTime || 1} min read

                </span>

                <span>

                    <i class="fas fa-eye"></i>

                    ${formatNumber(featured.views || 0)}

                </span>

            </div>

            <a

                href="${blogURL(featured)}"

                class="read-blog-btn"

                data-id="${featured.id}"

            >

                Read Article

                <i class="fas fa-arrow-right"></i>

            </a>

        </div>

    `;

}

// ======================================================
// Update Featured Blog
// ======================================================

function updateFeaturedBlog(blogId){

    const blog =

        blogs.find(

            item => item.id === blogId

        );

    if(!blog) return;

    featured = blog;

    renderFeaturedBlog();

}

// ======================================================
// Random Featured
// ======================================================

function randomFeaturedBlog(){

    if(blogs.length === 0) return;

    const index =

        Math.floor(

            Math.random() * blogs.length

        );

    featured = blogs[index];

    renderFeaturedBlog();

}

// ======================================================
// Next Featured
// ======================================================

function nextFeaturedBlog(){

    if(blogs.length <= 1) return;

    const index =

        blogs.findIndex(

            blog => blog.id === featured.id

        );

    featured =

        blogs[

            (index + 1) % blogs.length

        ];

    renderFeaturedBlog();

}

// ======================================================
// Previous Featured
// ======================================================

function previousFeaturedBlog(){

    if(blogs.length <= 1) return;

    let index =

        blogs.findIndex(

            blog => blog.id === featured.id

        );

    index--;

    if(index < 0){

        index = blogs.length - 1;

    }

    featured = blogs[index];

    renderFeaturedBlog();

}

// ======================================================
// Refresh Featured
// ======================================================

function refreshFeatured(){

    selectFeaturedBlog();

    renderFeaturedBlog();

}

