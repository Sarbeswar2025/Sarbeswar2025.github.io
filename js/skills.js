import {
  addDocument,
  updateDocument,
  getCollection,
  getDocument,
  deleteDocument,
} from "./firestore.js";

import {
    uploadProjectImage,
    deleteProjectImage
} from "./upload.js";



// =====================================
// Variables
// =====================================

let editSkillId = null;

let currentIcon = "";

let currentImagePath = "";

let allSkills = [];

let filteredSkills = [];

let currentPage = 1;

const skillsPerPage = 8;

// =====================================
// Elements
// =====================================

const drawer = document.getElementById("skillDrawer");

const addBtn = document.getElementById("addSkillBtn");

const closeBtn = document.getElementById("closeSkillDrawer");

const saveBtn = document.getElementById("saveSkill");

const imageType = document.getElementById("skillImageType");

const uploadContainer = document.getElementById("uploadContainer");

const urlContainer = document.getElementById("urlContainer");

const imageInput = document.getElementById("skillImage");

const imageUrl = document.getElementById("skillImageUrl");

const previewImage = document.getElementById("skillPreviewImage");

const previewText = document.getElementById("previewText");

// =====================================
// Drawer
// =====================================

if (addBtn) {
  addBtn.addEventListener("click", () => {
    resetForm();

    drawer.classList.add("active");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    drawer.classList.remove("active");
  });
}

// =====================================
// Upload / URL Toggle
// =====================================

if (imageType) {
  imageType.addEventListener("change", () => {
    if (imageType.value === "upload") {
      uploadContainer.style.display = "block";

      urlContainer.style.display = "none";
    } else {
      uploadContainer.style.display = "none";

      urlContainer.style.display = "block";
    }
  });
}

// =====================================
// Upload Preview
// =====================================

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;

      previewImage.style.display = "block";

      previewText.style.display = "none";
    };

    reader.readAsDataURL(file);
  });
}

// =====================================
// URL Preview
// =====================================

if (imageUrl) {
  imageUrl.addEventListener("input", () => {
    if (imageUrl.value.trim() === "") {
      previewImage.style.display = "none";

      previewText.style.display = "block";

      return;
    }

    previewImage.src = imageUrl.value;

    previewImage.style.display = "block";

    previewText.style.display = "none";
  });
}

// =====================================
// Reset Form
// =====================================

function resetForm() {
  editSkillId = null;

  currentIcon = "";

  currentImagePath = "";

  document.getElementById("skillName").value = "";

  document.getElementById("skillCategory").selectedIndex = 0;

  document.getElementById("skillLevel").selectedIndex = 0;

  document.getElementById("skillOrder").value = 1;

  document.getElementById("skillImageType").value = "upload";

  document.getElementById("skillImage").value = "";

  document.getElementById("skillImageUrl").value = "";

  document.getElementById("skillFeatured").checked = false;

  previewImage.src = "";

  previewImage.style.display = "none";

  previewText.style.display = "block";

  uploadContainer.style.display = "block";

  urlContainer.style.display = "none";

  document.querySelector("#skillDrawer h2").innerText = "Add Skill";

  saveBtn.innerText = "Save Skill";
}

console.log("✅ skills.js loaded");

// =====================================
// Save Skill
// =====================================

if (saveBtn) {
  saveBtn.addEventListener("click", saveSkill);
}
// =====================================
// Save Skill
// =====================================

async function saveSkill() {
  try {
    const name = document.getElementById("skillName").value.trim();

    const category = document.getElementById("skillCategory").value;

    const level = document.getElementById("skillLevel").value;

    const order = Number(document.getElementById("skillOrder").value);

    const featured = document.getElementById("skillFeatured").checked;

    const imageType = document.getElementById("skillImageType").value;

    const file = document.getElementById("skillImage").files[0];

    const url = document.getElementById("skillImageUrl").value.trim();

    if (!name) {
      alert("Skill name is required.");

      return;
    }

    saveBtn.disabled = true;

    saveBtn.innerText = "Saving...";

    let iconUrl = currentIcon;

    let imagePath = currentImagePath;

    if (imageType === "upload") {
      if (file) {
        const upload = await uploadProjectImage(file);

        iconUrl = upload.image;

        imagePath = upload.imagePath;
      }
    } else {
      iconUrl = url;

      imagePath = "";
    }

    const skillData = {
      name,

      category,

      level,

      order,

      featured,

      iconType: imageType,

      iconUrl,

      imagePath,
    };

    if (editSkillId) {
      await updateDocument(
        "skills",

        editSkillId,

        skillData,
      );

      toast("Skill Updated");
    } else {
      await addDocument(
        "skills",

        skillData,
      );

      toast("Skill Added");
    }

    drawer.classList.remove("active");

    resetForm();

    loadSkills();
  } catch (error) {
    console.error(error);

    alert(error.message);
  } finally {
    saveBtn.disabled = false;

    saveBtn.innerText = "Save Skill";
  }
}
// =====================================
// Load Skills
// =====================================

async function loadSkills() {
  try {
    const skills = await getCollection("skills");

    allSkills = skills;

    filteredSkills = [...skills];

    renderSkills(filteredSkills);

    updateStatistics(filteredSkills);
  } catch (error) {
    console.error(error);
  }
}

// =====================================
// Render Skills
// =====================================

function renderSkills(skills) {
  const tableBody = document.getElementById("skillTableBody");

  const empty = document.getElementById("emptySkills");

  tableBody.innerHTML = "";

  if (skills.length === 0) {
    empty.classList.add("show");

    return;
  }

  empty.classList.remove("show");

  let html = "";

  const start = (currentPage - 1) * skillsPerPage;

  const end = start + skillsPerPage;

  const pageSkills = skills.slice(start, end);

  pageSkills.forEach((skill) => {
    html += `

<tr>

<td>

<div class="skill-logo">

<img
src="${skill.iconUrl}"
alt="${skill.name}">

</div>

</td>

<td>

<span class="skill-name">

${skill.name}

</span>

</td>

<td>

<span class="skill-category">

${skill.category}

</span>

</td>

<td>

<button
class="feature-btn"
data-id="${skill.id}"
data-featured="${skill.featured}">

${skill.featured ? "⭐" : "☆"}

</button>

</td>

<td>

${skill.order}

</td>

<td>

<div class="action-buttons">

<button
class="action-btn edit-btn"
data-id="${skill.id}">

<i class="fas fa-edit"></i>

</button>

<button
class="action-btn delete-btn"
data-id="${skill.id}">

<i class="fas fa-trash"></i>

</button>

</div>

</td>

</tr>

`;
  });

  tableBody.innerHTML = html;
  updatePagination(skills.length);
}
// =====================================
// Statistics
// =====================================

function updateStatistics(skills) {
  document.getElementById("totalSkills").innerText = skills.length;

  document.getElementById("featuredSkills").innerText = skills.filter(
    (skill) => skill.featured,
  ).length;

  document.getElementById("programmingSkills").innerText = skills.filter(
    (skill) => skill.category === "Programming",
  ).length;

  document.getElementById("toolSkills").innerText = skills.filter(
    (skill) => skill.category === "Tools",
  ).length;
}
loadSkills();

// =====================================
// Edit Skill
// =====================================

async function editSkill(id) {
  const skill = await getDocument("skills", id);

  if (!skill) return;

  editSkillId = id;

  currentIcon = skill.iconUrl || "";

  currentImagePath = skill.imagePath || "";

  document.getElementById("skillName").value = skill.name || "";

  document.getElementById("skillCategory").value =
    skill.category || "Programming";

  document.getElementById("skillLevel").value = skill.level || "Beginner";

  document.getElementById("skillOrder").value = skill.order || 1;

  document.getElementById("skillFeatured").checked = skill.featured || false;

  document.getElementById("skillImageType").value = skill.iconType || "upload";

  document.getElementById("skillImageUrl").value =
    skill.iconType === "url" ? skill.iconUrl : "";

  if (skill.iconUrl) {
    previewImage.src = skill.iconUrl;

    previewImage.style.display = "block";

    previewText.style.display = "none";
  }

  uploadContainer.style.display =
    skill.iconType === "upload" ? "block" : "none";

  urlContainer.style.display = skill.iconType === "url" ? "block" : "none";

  document.querySelector("#skillDrawer h2").innerText = "Edit Skill";

  saveBtn.innerText = "Update Skill";

  drawer.classList.add("active");
}

// =====================================
// Delete Skill
// =====================================

async function removeSkill(id) {
  const ok = confirm("Delete this skill?");

  if (!ok) return;

  const skill = await getDocument("skills", id);

  if (skill && skill.imagePath) {
    await deleteProjectImage(skill.imagePath);
  }

  await deleteDocument("skills", id);

  toast("Skill Deleted");

  loadSkills();
}

// =====================================
// Actions
// =====================================

document.addEventListener("click", async (e) => {
  const edit = e.target.closest(".edit-btn");

  if (edit) {
    editSkill(edit.dataset.id);
  }

  const del = e.target.closest(".delete-btn");

  if (del) {
    removeSkill(del.dataset.id);
  }
});

// =====================================
// Search
// =====================================

const skillSearch = document.getElementById("skillSearch");

if (skillSearch) {
  skillSearch.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    filteredSkills = allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(keyword) ||
        skill.category.toLowerCase().includes(keyword) ||
        skill.level.toLowerCase().includes(keyword),
    );

    currentPage = 1;

    renderSkills(filteredSkills);

    updateStatistics(filteredSkills);
  });
}

// =====================================
// Category Filter
// =====================================

const categoryFilter = document.getElementById("skillCategoryFilter");

if (categoryFilter) {
  categoryFilter.addEventListener("change", function () {
    if (this.value === "All") {
      filteredSkills = [...allSkills];
    } else {
      filteredSkills = allSkills.filter(
        (skill) => skill.category === this.value,
      );
    }

    currentPage = 1;

    renderSkills(filteredSkills);

    updateStatistics(filteredSkills);
  });
}




//===================
// Pagination
//===================
function updatePagination(total){

const totalPages=Math.max(

1,

Math.ceil(
total/skillsPerPage
)

);

document.getElementById(
"skillPageNumber"
).innerText=

`Page ${currentPage} of ${totalPages}`;

document.getElementById(
"prevSkillPage"
).disabled=

currentPage===1;

document.getElementById(
"nextSkillPage"
).disabled=

currentPage===totalPages;

}

//previous
document
.getElementById("prevSkillPage")
.addEventListener("click",()=>{

if(currentPage>1){

currentPage--;

renderSkills(
filteredSkills
);

}

});

//Next
document
.getElementById("nextSkillPage")
.addEventListener("click",()=>{

const totalPages=Math.ceil(

filteredSkills.length/
skillsPerPage

);

if(currentPage<totalPages){

currentPage++;

renderSkills(
filteredSkills
);

}

});


//featured toogle
document.addEventListener(
"click",
async(e)=>{

const btn=
e.target.closest(".feature-btn");

if(!btn)return;

const id=
btn.dataset.id;

const featured=
btn.dataset.featured==="true";

await updateDocument(

"skills",

id,

{

featured:!featured

}

);

loadSkills();

});

// ===============================
// Toast Notification
// ===============================

function toast(message) {
  const toast = document.getElementById("toast");

  toast.innerHTML = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
