import {
  addDocument,
  getCollection,
  getDocument,
  deleteDocument,
  updateDocument,
} from "./firestore.js";

import { uploadProjectImage, deleteProjectImage } from "./upload.js";

let currentImage = "";
let currentImagePath = "";

let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
const projectsPerPage = 5;

console.log("✅ project.js loaded");

// ==========================
// Edit State
// ==========================

let editProjectId = null;

// ==========================
// Elements
// ==========================

const saveBtn = document.getElementById("saveProject");

if (!saveBtn) {
  console.error("❌ Save button not found!");
} else {
  console.log("✅ Save button found");

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // alert("Save button clicked!");

    saveProject();
  });
}

// ==========================
// Save Project
// ==========================

async function saveProject() {
  console.log("🚀 saveProject() called");

  try {
    const title = document.getElementById("projectTitle").value.trim();
    const technology = document.getElementById("technology").value.trim();
    const github = document.getElementById("github").value.trim();
    const demo = document.getElementById("demo").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const file = document.getElementById("projectImage").files[0];

    console.log({
      title,
      technology,
      github,
      demo,
      category,
      description,
      file,
    });

    if (title === "") {
      toast("Project title is required.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    let image = currentImage;
    let imagePath = currentImagePath;

    if (file) {
      console.log("📤 Uploading image...");

      const upload = await uploadProjectImage(file);

      image = upload.image;

      imagePath = upload.imagePath;

      console.log("✅ Image uploaded:", image);
    }

    console.log("💾 Saving to Firestore...");

    if (editProjectId) {
      await updateDocument("projects", editProjectId, {
        title,
        technology,
        github,
        demo,
        category,
        description,
        image,
        imagePath,
        featured: false,
      });
    } else {
      await addDocument("projects", {
        title,
        technology,
        github,
        demo,
        category,
        description,
        image,
        imagePath,
        featured: false,
      });
    }

    console.log("✅ Firestore Saved");

    toast(
      editProjectId
        ? "Project Updated Successfully!"
        : "Project Added Successfully!",
    );

    editProjectId = null;

    document.querySelector("#projectDrawer h2").innerText = "Add Project";

    saveBtn.innerText = "Save Project";
    loadProjects();

    // Clear form
    document.getElementById("projectTitle").value = "";
    document.getElementById("technology").value = "";
    document.getElementById("github").value = "";
    document.getElementById("demo").value = "";
    document.getElementById("description").value = "";
    document.getElementById("projectImage").value = "";
  } catch (error) {
    console.error("❌ Error:", error);

    alert(error.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerText = "Save Project";
  }
}

// ===============================
// Render Projects
// ===============================
function renderProjects(projects) {
  if (!projects) return;

  const tableBody = document.getElementById("projectTableBody");
  const empty = document.getElementById("emptyProjects");
  const projectCount = document.getElementById("projectCount");

  tableBody.innerHTML = "";

  if (projects.length === 0) {
    empty.classList.add("show");
    projectCount.innerHTML = "0 Projects";

    return;
  }

  empty.classList.remove("show");
  projectCount.innerHTML = `${projects.length} Project(s)`;

  const start = (currentPage - 1) * projectsPerPage;
  const end = start + projectsPerPage;

  const pageProjects = projects.slice(start, end);

  let html = "";

  pageProjects.forEach((project) => {
    html += `
<tr>

<td>
<img class="project-image"
src="${project.image || "https://placehold.co/100x70"}">
</td>

<td><strong>${project.title}</strong></td>

<td>${project.technology}</td>

<td>
<span class="category-badge">
${project.category}
</span>
</td>

<td>
<button
class="feature-btn"
data-id="${project.id}"
data-featured="${project.featured}">
${project.featured ? "⭐" : "☆"}
</button>
</td>

<td>
${
  project.createdAt
    ? new Date(project.createdAt.seconds * 1000).toLocaleDateString()
    : "--"
}
</td>

<td>

<div class="action-buttons">

<button
class="action-btn edit-btn"
data-id="${project.id}">
<i class="fas fa-edit"></i>
</button>

<button
class="action-btn delete-btn"
data-id="${project.id}">
<i class="fas fa-trash"></i>
</button>

</div>

</td>

</tr>
`;
  });

  tableBody.innerHTML = html;
  updatePagination(projects.length);
}

// ===============================
// Pagination
// ===============================

const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageNumber = document.getElementById("pageNumber");

function updatePagination(totalItems) {
  const totalPages = Math.max(1, Math.ceil(totalItems / projectsPerPage));

  pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;

  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

if (prevPage) {
  prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;

      renderProjects(filteredProjects);
    }
  });
}

if (nextPage) {
  nextPage.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    if (currentPage < totalPages) {
      currentPage++;

      renderProjects(filteredProjects);
    }
  });
}
// ===============================
// Edit Project
// ===============================

async function editProject(id) {
  const project = await getDocument("projects", id);

  console.log(project);

  if (!project) return;

  editProjectId = id;
  currentImage = project.image || "";
  currentImagePath = project.imagePath || "";
  document.getElementById("projectTitle").value = project.title || "";

  document.getElementById("technology").value = project.technology || "";

  document.getElementById("github").value = project.github || "";

  document.getElementById("demo").value = project.demo || "";

  document.getElementById("category").value = project.category || "";

  document.getElementById("description").value = project.description || "";

  document.querySelector("#projectDrawer h2").innerText = "Edit Project";

  saveBtn.innerText = "Update Project";

  projectDrawer.classList.add("active");
}

// ===============================
// Load Projects
// ===============================

async function loadProjects() {
  try {
    const projects = await getCollection("projects");

    allProjects = projects;
    filteredProjects = [...projects];

    console.log("Projects from Firestore:", projects);
    renderProjects(filteredProjects);
    updateStatistics(projects);
  } catch (error) {
    console.error(error);
  }
}
document.addEventListener("click", (e) => {
  const edit = e.target.closest(".edit-btn");

  if (edit) {
    editProject(edit.dataset.id);
  }

  const del = e.target.closest(".delete-btn");

  if (del) {
    removeProject(del.dataset.id);
  }
});

// ===============================
// Delete Project
// ===============================

async function removeProject(id) {
  const ok = confirm("Delete this project?");

  if (!ok) return;

  const project = await getDocument("projects", id);

  if (project && project.imagePath) {
    await deleteProjectImage(project.imagePath);
  }

  await deleteDocument("projects", id);

  toast("Project Deleted");

  loadProjects();
}

// ===============================
// Statistics
// ===============================

function updateStatistics(projects) {
  document.getElementById("totalProjects").innerText = projects.length;

  document.getElementById("featuredProjects").innerText = projects.filter(
    (p) => p.featured,
  ).length;

  document.getElementById("webProjects").innerText = projects.filter(
    (p) => p.category === "Web",
  ).length;

  document.getElementById("aiProjects").innerText = projects.filter(
    (p) => p.category === "AI/ML",
  ).length;
}

// ===============================
// Search
// ===============================

const projectSearch = document.getElementById("projectSearch");

if (projectSearch) {
  projectSearch.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    filteredProjects = allProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(keyword) ||
        project.technology.toLowerCase().includes(keyword) ||
        project.category.toLowerCase().includes(keyword),
    );

    currentPage = 1;

    renderProjects(filteredProjects);

    updateStatistics(filteredProjects);
  });
}

// ===============================
// Category Filter
// ===============================

const categoryFilter = document.getElementById("categoryFilter");

if (categoryFilter) {
  categoryFilter.addEventListener("change", function () {
    if (this.value === "All") {
      filteredProjects = [...allProjects];
    } else {
      filteredProjects = allProjects.filter(
        (project) => project.category === this.value,
      );
    }

    currentPage = 1;

    renderProjects(filteredProjects);

    updateStatistics(filteredProjects);
  });
}
// =============================
// Toggle Featured
// =============================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".feature-btn");

  if (!btn) return;

  try {
    await updateDocument(
      "projects",

      btn.dataset.id,

      {
        featured: btn.dataset.featured === "true" ? false : true,
      },
    );

    loadProjects();

    toast("Featured Updated");
  } catch (error) {
    console.error(error);
  }
});

// =============================
// Toast
// =============================
function toast(message) {
  const toast = document.getElementById("toast");

  toast.innerHTML = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

loadProjects();
