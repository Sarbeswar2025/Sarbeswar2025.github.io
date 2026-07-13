// ======================================================
// Editor Toolbar
// ======================================================

// ==========================
// Preview
// ==========================

export function initializePreview(editor, titleInput) {

    const previewBtn =
        document.getElementById("previewBlog");

    const previewSidebar =
        document.getElementById("previewSidebar");

    function openPreview() {

        if (!editor) return;

        const title =
            titleInput.value || "Untitled Blog";

        const content =
            editor.getData();

        const preview =
            window.open("", "_blank");

        preview.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>${title}</title>

<style>

body{

max-width:900px;

margin:40px auto;

padding:20px;

font-family:Arial,sans-serif;

line-height:1.8;

color:#111827;

}

img{

max-width:100%;

border-radius:12px;

margin:20px 0;

}

pre{

background:#111827;

color:#fff;

padding:20px;

overflow:auto;

border-radius:10px;

}

table{

width:100%;

border-collapse:collapse;

margin:20px 0;

}

td,th{

border:1px solid #ddd;

padding:10px;

}

blockquote{

border-left:5px solid #2563eb;

padding-left:20px;

font-style:italic;

color:#555;

}

a{

color:#2563eb;

}

</style>

</head>

<body>

<h1>${title}</h1>

${content}

</body>

</html>

`);

        preview.document.close();

    }

    if (previewBtn)
        previewBtn.onclick = openPreview;

    if (previewSidebar)
        previewSidebar.onclick = openPreview;

}

// ==========================
// Fullscreen
// ==========================

export function toggleFullscreen() {

    if (!document.fullscreenElement) {

        document.documentElement
            .requestFullscreen();

    }

    else {

        document.exitFullscreen();

    }

}

// ==========================
// Copy Slug
// ==========================

export async function copySlug(slugInput) {

    if (!slugInput.value) return;

    try {

        await navigator.clipboard.writeText(

            slugInput.value

        );

        console.log("Slug Copied");

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================
// Update Page Title
// ==========================

export function initializePageTitle(titleInput) {

    titleInput.addEventListener("input", () => {

        const title =
            titleInput.value.trim();

        document.title =

            title

            ? `${title} | Blog Editor`

            : "Blog Editor";

    });

}

// ==========================
// Character Counter
// ==========================

export function updateCharacterCounter(

    input,

    counter

){

    input.addEventListener("input", () => {

        counter.textContent =

            input.value.length;

    });

}

// ==========================
// Toolbar Status
// ==========================

export function setToolbarStatus(text){

    const saveStatus =

    document.getElementById("saveStatus");

    if(saveStatus){

        saveStatus.textContent = text;

    }

}

// ==========================
// Loading
// ==========================

export function disableToolbar(){

    document

    .querySelectorAll(

        ".editor-header button"

    )

    .forEach(button=>{

        button.disabled=true;

    });

}

export function enableToolbar(){

    document

    .querySelectorAll(

        ".editor-header button"

    )

    .forEach(button=>{

        button.disabled=false;

    });

}