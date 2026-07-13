// ======================================================
// Editor Auto Save
// ======================================================

let autoSaveTimer = null;
let hasUnsavedChanges = false;

// ==========================
// Initialize Auto Save
// ==========================

export function initializeAutoSave(editor, saveDraft) {

    if (!editor) return;

    editor.model.document.on("change:data", () => {

        hasUnsavedChanges = true;

        updateSaveStatus("Unsaved Changes");

    });

    startAutoSave(saveDraft);

}

// ==========================
// Start Auto Save
// ==========================

export function startAutoSave(saveDraft) {

    stopAutoSave();

    autoSaveTimer = setInterval(async () => {

        if (!hasUnsavedChanges) return;

        try {

            updateSaveStatus("Saving...");

            await saveDraft(true);

            hasUnsavedChanges = false;

            updateSaveStatus("Draft Saved");

            updateLastSaved();

        }

        catch (error) {

            console.error("Auto Save Error:", error);

            updateSaveStatus("Auto Save Failed");

        }

    }, 30000);

}

// ==========================
// Stop Auto Save
// ==========================

export function stopAutoSave() {

    if (autoSaveTimer) {

        clearInterval(autoSaveTimer);

        autoSaveTimer = null;

    }

}

// ==========================
// Mark Saved
// ==========================

export function markAsSaved() {

    hasUnsavedChanges = false;

    updateSaveStatus("Draft Saved");

    updateLastSaved();

}

// ==========================
// Force Unsaved
// ==========================

export function markAsChanged() {

    hasUnsavedChanges = true;

    updateSaveStatus("Unsaved Changes");

}

// ==========================
// Save Status
// ==========================

export function updateSaveStatus(text) {

    const saveStatus = document.getElementById("saveStatus");

    if (saveStatus) {

        saveStatus.textContent = text;

    }

}

// ==========================
// Last Saved
// ==========================

export function updateLastSaved() {

    const lastSaved = document.getElementById("lastSaved");

    if (!lastSaved) return;

    const now = new Date();

    lastSaved.textContent =
        "Saved at " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

}

// ==========================
// Unsaved Changes Warning
// ==========================

window.addEventListener("beforeunload", (e) => {

    if (!hasUnsavedChanges) return;

    e.preventDefault();

    e.returnValue = "";

});

// ==========================
// Keyboard Shortcut
// ==========================

export function enableKeyboardShortcut(saveDraft) {

    document.addEventListener("keydown", async (e) => {

        if (e.ctrlKey && e.key.toLowerCase() === "s") {

            e.preventDefault();

            await saveDraft();

        }

    });

}

// ==========================
// Cleanup
// ==========================

export function destroyAutoSave() {

    stopAutoSave();

    hasUnsavedChanges = false;

}