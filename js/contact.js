// ==============================
// Contact Form
// ==============================

const $ = (selector) => document.querySelector(selector);

const form = $("#contactForm");
const sendBtn = $("#sendBtn");
const formStatus = $("#formStatus");

const toast = $("#toast");
const toastText = $("#toastText");
const toastClose = $("#toastClose");

const copyBtn = $("#copyEmailBtn");
const emailText = $("#contactEmailText");

let isSubmitting = false;

// ------------------------------
// Toast
// ------------------------------

function showToast(message) {
  toastText.textContent = message;

  toast.hidden = false;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    hideToast();
  }, 3000);
}

function hideToast() {
  toast.classList.remove("show");

  setTimeout(() => {
    toast.hidden = true;
  }, 250);
}

toastClose?.addEventListener("click", hideToast);

// ------------------------------
// Validation
// ------------------------------

const touched = new Set();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(input, error, message) {
  input.classList.toggle("is-invalid", !!message);
  error.textContent = message;
}

function validate(showErrors = false) {

  const name = $("#name");
  const email = $("#email");
  const message = $("#message");

  const nameError = $("#nameError");
  const emailError = $("#emailError");
  const messageError = $("#messageError");

  const nameValue = name.value.trim();
  const emailValue = email.value.trim();
  const messageValue = message.value.trim();

  let valid = true;

  // Name

  let nameMsg = "";

  if (nameValue.length < 2) {
    valid = false;
    nameMsg = "Please enter your name.";
  }

  // Email

  let emailMsg = "";

  if (!isValidEmail(emailValue)) {
    valid = false;
    emailMsg = "Please enter a valid email.";
  }

  // Message

  let messageMsg = "";

  if (messageValue.length < 10) {
    valid = false;
    messageMsg = "Message should be at least 10 characters.";
  }

  if (showErrors) {

    setError(
      name,
      nameError,
      touched.has("name") ? nameMsg : ""
    );

    setError(
      email,
      emailError,
      touched.has("email") ? emailMsg : ""
    );

    setError(
      message,
      messageError,
      touched.has("message") ? messageMsg : ""
    );

  }

  sendBtn.disabled = !valid || isSubmitting;

  return {
    valid,
    nameValue,
    emailValue,
    messageValue
  };

}

// ------------------------------
// Input Events
// ------------------------------

form.addEventListener("input", () => {

  formStatus.textContent = "";

  validate(false);

});

form.addEventListener(
  "blur",
  (e) => {

    if (
      e.target.id === "name" ||
      e.target.id === "email" ||
      e.target.id === "message"
    ) {

      touched.add(e.target.id);

      validate(true);

    }

  },
  true
);

// ------------------------------
// Submit
// ------------------------------

form.addEventListener("submit", (e) => {

  e.preventDefault();

  touched.add("name");
  touched.add("email");
  touched.add("message");

  const result = validate(true);

  if (!result.valid) {

    formStatus.textContent =
      "Please fix the highlighted fields.";

    formStatus.className =
      "form-status is-visible is-error";

    return;

  }

  isSubmitting = true;

  sendBtn.disabled = true;

  sendBtn.classList.add("is-loading");

  const subject =
    `Portfolio Contact from ${result.nameValue}`;

  const body =
`Name: ${result.nameValue}

Email: ${result.emailValue}

Message:

${result.messageValue}`;

  const mailto =
`mailto:sarbeswar@sarbeswarpanda.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  setTimeout(() => {

    sendBtn.classList.remove("is-loading");
    sendBtn.classList.add("is-success");

    formStatus.className =
      "form-status is-visible is-success";

    formStatus.textContent =
      "Opening your email app...";

    showToast("Opening email application...");

    window.open(mailto);

    setTimeout(() => {

      form.reset();

      touched.clear();

      sendBtn.classList.remove("is-success");

      sendBtn.disabled = true;

      formStatus.textContent = "";

      formStatus.className = "form-status";

      isSubmitting = false;

    }, 1200);

  }, 600);

});

// ------------------------------
// Copy Email
// ------------------------------

copyBtn.addEventListener("click", async () => {

  const email = emailText.textContent.trim();

  try {

    await navigator.clipboard.writeText(email);

    showToast("Email copied!");

  } catch {

    const textarea = document.createElement("textarea");

    textarea.value = email;

    document.body.appendChild(textarea);

    textarea.select();

    document.execCommand("copy");

    textarea.remove();

    showToast("Email copied!");

  }

});