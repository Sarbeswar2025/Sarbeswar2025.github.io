import { protectPage, logout } from "./auth.js";
import { getDocument } from "./firestore.js";

// ======================================
// Protect Dashboard
// ======================================

protectPage("login.html");

// ======================================
// Elements
// ======================================

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");
const pageTitle = document.querySelector(".page-title");

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

// Project Drawer
const addProjectBtn = document.getElementById("addProjectBtn");
const projectDrawer = document.getElementById("projectDrawer");
const closeDrawer = document.getElementById("closeDrawer");

// ======================================
// Navigation
// ======================================

function openPage(page) {

    // Remove active page
    pages.forEach(section => {

        section.classList.remove("active");

    });

    // Remove active nav
    navLinks.forEach(link => {

        link.classList.remove("active");

    });

    // Open page
    const currentPage = document.getElementById(page);

    if (currentPage) {

        currentPage.classList.add("active");

    } else {

        console.warn(`Page '${page}' not found.`);
        return;

    }

    // Active sidebar link
    const currentLink = document.querySelector(
        `.nav-link[data-page="${page}"]`
    );

    if (currentLink) {

        currentLink.classList.add("active");

        const span = currentLink.querySelector("span");

        if (span && pageTitle) {

            pageTitle.textContent = span.textContent;

        }

    }

    localStorage.setItem("activePage", page);

    // Close mobile sidebar
    if (sidebar) sidebar.classList.remove("active");

    if (overlay) overlay.classList.remove("active");

}

// ======================================
// Sidebar Click
// ======================================

navLinks.forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        const page = link.dataset.page;

        openPage(page);

    });

});

// ======================================
// Restore Last Page
// ======================================

const savedPage = localStorage.getItem("activePage") || "dashboard";

openPage(savedPage);

// ======================================
// Mobile Sidebar
// ======================================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.add("active");

        overlay.classList.add("active");

    });

}

if (overlay) {

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("active");

        overlay.classList.remove("active");

        if (projectDrawer) {

            projectDrawer.classList.remove("active");

        }

    });

}

// ======================================
// Project Drawer
// ======================================

if (addProjectBtn && projectDrawer) {

    addProjectBtn.addEventListener("click", () => {

        projectDrawer.classList.add("active");

    });

}

if (closeDrawer && projectDrawer) {

    closeDrawer.addEventListener("click", () => {

        projectDrawer.classList.remove("active");

    });

}


//======================================
// Visitor count
//======================================
async function loadAnalytics(){

    const stats =
    await getDocument(
        "analytics",
        "stats"
    );

    if(!stats) return;

    document.getElementById(
        "visitorCount"
    ).innerText =
    stats.totalVisitors ?? 0;

}
loadAnalytics();
// ======================================
// Logout
// ======================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        const confirmLogout = confirm("Do you really want to logout?");

        if (!confirmLogout) return;

        try {

            await logout();

            window.location.href = "login.html";

        }

        catch (error) {

            console.error(error);

            toast("Logout failed.");

        }

    });

}