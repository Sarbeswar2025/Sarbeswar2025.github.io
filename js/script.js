/*
  Portfolio Website — Vanilla JS
  Features:
  - Page intro loader
  - Dark mode toggle (persisted)
  - Mobile nav toggle + close on navigation
  - Smooth scrolling + active section highlight
  - Navbar hide/show on scroll
  - IntersectionObserver reveal animations
  - Typing effect in hero
  - Project filtering
  - Button ripple effect
  - Back-to-top button
  - Contact form validation + status messages
*/

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -------- Loader --------
  const loader = $("#loader");
  window.addEventListener("load", () => {
    // Give the UI a moment to feel intentional, but keep it fast.
    window.setTimeout(() => loader?.classList.add("is-hidden"), 450);
  });

  // -------- Footer year --------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -------- Theme (dark mode) --------
  const THEME_KEY = "portfolio-theme";
  const themeToggle = $("#themeToggle");

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const setTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem(THEME_KEY, theme);
  };

  setTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });

  // -------- Mobile nav --------
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const setMenuOpen = (open) => {
    if (!navLinks || !navToggle) return;
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle?.addEventListener("click", () => {
    const open = navLinks?.classList.contains("is-open");
    setMenuOpen(!open);
  });

  // Close menu when clicking a nav link (mobile)
  $$(".nav__link").forEach((a) => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  // Close menu on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  // -------- Smooth scroll with header offset (for non-CSS smooth environments too) --------
  const headerOffset = () => {
    const header = $(".site-header");
    const rect = header?.getBoundingClientRect();
    return rect ? rect.height + 10 : 86;
  };

  const smoothScrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  $$("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const id = href.replace("#", "");
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      history.pushState(null, "", `#${id}`);
      smoothScrollToId(id);
    });
  });

  // -------- Active section highlight --------
  const sections = $$('main section[id]');
  const navAnchors = $$(".nav__link");
  const setActiveNav = (id) => {
    navAnchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const active = href === `#${id}`;
      a.classList.toggle("is-active", active);
    });
  };

  if (sections.length) {
    const sectionObs = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActiveNav(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sections.forEach((s) => sectionObs.observe(s));
  }

  // -------- Navbar hide/show on scroll --------
  const header = $(".site-header");
  let lastY = window.scrollY;
  let lastTick = 0;

  const onScroll = () => {
    const now = performance.now();
    if (now - lastTick < 40) return;
    lastTick = now;

    const y = window.scrollY;
    const goingDown = y > lastY;
    lastY = y;

    if (!header) return;

    if (y < 40) {
      header.classList.remove("is-hidden");
      return;
    }

    header.classList.toggle("is-hidden", goingDown && y > 160);
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  // -------- Reveal animations (IntersectionObserver) --------
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.getAttribute("data-delay") || 0);
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.16 }
    );

    revealEls.forEach((el) => revealObs.observe(el));
  }

  // -------- Education timeline (progress + active milestones) --------
  const eduTimeline = $("#eduTimeline");
  if (eduTimeline) {
    const eduItems = $$(".eduItem", eduTimeline);

    const setEduProgress = () => {
      const rect = eduTimeline.getBoundingClientRect();
      if (rect.height <= 0) return;

      // Use a viewport anchor point (70% down the screen) so the line
      // fills naturally as the user scrolls through the timeline.
      const anchor = window.innerHeight * 0.7;
      const raw = (anchor - rect.top) / rect.height;
      const p = Math.max(0, Math.min(1, raw));
      eduTimeline.style.setProperty("--progress", String(p));
    };

    let eduRaf = 0;
    const onEduScroll = () => {
      if (eduRaf) return;
      eduRaf = window.requestAnimationFrame(() => {
        eduRaf = 0;
        setEduProgress();
      });
    };

    window.addEventListener("scroll", onEduScroll, { passive: true });
    window.addEventListener("resize", onEduScroll);
    setEduProgress();

    if (eduItems.length) {
      const eduObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            if (!entry.isIntersecting) return;
            el.classList.add("is-active");
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -35% 0px" }
      );

      eduItems.forEach((el) => eduObs.observe(el));
    }
  }

  // -------- Experience timeline (progress + active milestones) --------
  const expTimeline = $("#expTimeline");
  if (expTimeline) {
    const expItems = $$(".timeline__item", expTimeline);

    const setExpProgress = () => {
      const rect = expTimeline.getBoundingClientRect();
      if (rect.height <= 0) return;

      const anchor = window.innerHeight * 0.7;
      const raw = (anchor - rect.top) / rect.height;
      const p = Math.max(0, Math.min(1, raw));
      expTimeline.style.setProperty("--progress", String(p));
    };

    let expRaf = 0;
    const onExpScroll = () => {
      if (expRaf) return;
      expRaf = window.requestAnimationFrame(() => {
        expRaf = 0;
        setExpProgress();
      });
    };

    window.addEventListener("scroll", onExpScroll, { passive: true });
    window.addEventListener("resize", onExpScroll);
    setExpProgress();

    if (expItems.length) {
      const expObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-active");
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -35% 0px" }
      );

      expItems.forEach((el) => expObs.observe(el));
    }
  }

  // -------- Typing effect --------
  const typingEl = $("#typingText");
  const roles = [
    "Caffeine‑Powered Developer",
    "AI & CS Student",
    "Full‑Stack Builder",
    "Problem Solver",
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const typeLoop = async () => {
    if (!typingEl) return;

    let idx = 0;
    while (true) {
      const word = roles[idx % roles.length];

      // Type
      typingEl.textContent = "";
      for (let i = 1; i <= word.length; i++) {
        typingEl.textContent = word.slice(0, i);
        await sleep(34 + Math.random() * 22);
      }

      await sleep(850);

      // Delete
      for (let i = word.length; i >= 0; i--) {
        typingEl.textContent = word.slice(0, i);
        await sleep(22 + Math.random() * 18);
      }

      await sleep(220);
      idx++;
    }
  };

  typeLoop();

  // -------- Button ripple --------
  const addRipple = (btn, x, y) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${x - rect.left}px`;
    ripple.style.top = `${y - rect.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  $$(".btn, .icon-btn, .filter").forEach((el) => {
    el.addEventListener("pointerdown", (e) => {
      if (!(el instanceof HTMLElement)) return;
      addRipple(el, e.clientX, e.clientY);
    });
  });

  // -------- Project filtering --------
  const filterBtns = $$(".filter");
  const projects = $$(".project");
  const showMoreBtn = $("#showMoreProjects");
  const MAX_INITIAL_PROJECTS = 4;
  let allProjectsVisible = false;

  // Initially hide projects after the 4th one
  const initializeProjects = () => {
    projects.forEach((p, index) => {
      if (index >= MAX_INITIAL_PROJECTS) {
        p.classList.add("is-hidden");
      }
    });
    
    // Hide button if 4 or fewer projects
    if (projects.length <= MAX_INITIAL_PROJECTS && showMoreBtn) {
      showMoreBtn.style.display = "none";
    }
  };

  const setFilterActive = (btn) => {
    filterBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });
  };

  const applyProjectFilter = (category) => {
    let visibleCount = 0;
    
    projects.forEach((p) => {
      const pCat = p.getAttribute("data-category") || "";
      const matchesFilter = category === "all" || pCat === category;
      
      // Show if it matches filter AND (all projects visible OR within first 4)
      const shouldShow = matchesFilter && (allProjectsVisible || visibleCount < MAX_INITIAL_PROJECTS);
      
      if (matchesFilter) visibleCount++;
      
      p.classList.toggle("is-hidden", !shouldShow);
      p.style.display = shouldShow ? "" : "none";
    });

    // Update show more button visibility
    if (showMoreBtn) {
      const hasMoreToShow = visibleCount > MAX_INITIAL_PROJECTS && !allProjectsVisible;
      showMoreBtn.style.display = hasMoreToShow ? "" : "none";
      showMoreBtn.textContent = allProjectsVisible ? "Show Less" : "Show More Projects";
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-filter") || "all";
      allProjectsVisible = false; // Reset when changing filters
      setFilterActive(btn);
      applyProjectFilter(category);
    });
  });

  // Show more projects button
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      allProjectsVisible = !allProjectsVisible;
      const activeFilter = $(".filter.is-active");
      const category = activeFilter?.getAttribute("data-filter") || "all";
      applyProjectFilter(category);
    });
  }

  // Initialize projects on page load
  initializeProjects();

  // -------- Back-to-top --------
  const backTop = $("#backTop");
  const toggleBackTop = () => {
    if (!backTop) return;
    backTop.classList.toggle("is-visible", window.scrollY > 520);
  };

  window.addEventListener("scroll", toggleBackTop, { passive: true });
  toggleBackTop();

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // -------- Contact form validation --------
  const form = $("#contactForm");
  const formStatus = $("#formStatus");
  const sendBtn = $("#sendBtn");

  const toast = $("#toast");
  const toastText = $("#toastText");
  const toastClose = $("#toastClose");
  const copyEmailBtn = $("#copyEmailBtn");
  const contactEmailText = $("#contactEmailText");

  let toastTimer = null;
  let isSubmitting = false;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const showToast = (message) => {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => hideToast(), 2800);
  };

  const hideToast = () => {
    if (!toast) return;
    toast.classList.remove("is-visible");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = null;
    window.setTimeout(() => {
      toast.hidden = true;
    }, prefersReducedMotion ? 0 : 220);
  };

  const setStatus = (type, message) => {
    if (!formStatus) return;
    formStatus.classList.remove("is-success", "is-error");
    formStatus.classList.add("is-visible");
    formStatus.classList.add(type === "success" ? "is-success" : "is-error");
    formStatus.textContent = message;
  };

  const clearStatus = () => {
    if (!formStatus) return;
    formStatus.classList.remove("is-visible", "is-success", "is-error");
    formStatus.textContent = "";
  };

  const isValidEmail = (email) => {
    // Simple and robust enough for client-side.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setFieldError = (input, errorEl, message) => {
    if (!input || !errorEl) return;
    input.classList.toggle("is-invalid", Boolean(message));
    errorEl.textContent = message || "";
  };

  const setSendEnabled = (enabled) => {
    if (!sendBtn) return;
    const canClick = Boolean(enabled) && !isSubmitting;
    sendBtn.disabled = !canClick;
    sendBtn.setAttribute("aria-disabled", String(!canClick));
  };

  const setSendState = (state) => {
    if (!sendBtn) return;
    sendBtn.classList.toggle("is-loading", state === "loading");
    sendBtn.classList.toggle("is-success", state === "success");
  };

  const touched = new Set();
  let submitAttempted = false;

  const getFields = () => {
    const name = $("#name");
    const email = $("#email");
    const message = $("#message");
    return { name, email, message };
  };

  const getErrors = () => {
    const nameErr = $("#nameError");
    const emailErr = $("#emailError");
    const msgErr = $("#messageError");
    return { nameErr, emailErr, msgErr };
  };

  const validateForm = ({ showErrors = false } = {}) => {
    if (!form) return { ok: false };

    const { name, email, message } = getFields();
    const { nameErr, emailErr, msgErr } = getErrors();

    const nameVal = (name?.value || "").trim();
    const emailVal = (email?.value || "").trim();
    const msgVal = (message?.value || "").trim();

    const nameMsg = nameVal.length < 2 ? "Please enter your name." : "";
    const emailMsg = !isValidEmail(emailVal) ? "Please enter a valid email address." : "";
    const msgMsg = msgVal.length < 10 ? "Please add a message (10+ characters)." : "";

    const ok = !nameMsg && !emailMsg && !msgMsg;

    // Only show red/error text after blur (touched) or after submit attempt.
    const allowNameErr = showErrors && (submitAttempted || touched.has("name"));
    const allowEmailErr = showErrors && (submitAttempted || touched.has("email"));
    const allowMsgErr = showErrors && (submitAttempted || touched.has("message"));

    setFieldError(name, nameErr, allowNameErr ? nameMsg : "");
    setFieldError(email, emailErr, allowEmailErr ? emailMsg : "");
    setFieldError(message, msgErr, allowMsgErr ? msgMsg : "");

    // If we're not showing errors, also ensure inputs don't get the red border.
    if (!showErrors) {
      name?.classList.remove("is-invalid");
      email?.classList.remove("is-invalid");
      message?.classList.remove("is-invalid");
    }

    return { ok, nameVal, emailVal, msgVal };
  };

  const onFormInput = () => {
    clearStatus();
    // Silent validation for enabling button.
    const res = validateForm({ showErrors: false });
    setSendEnabled(res.ok);
    if (sendBtn?.classList.contains("is-success")) {
      sendBtn.classList.remove("is-success");
    }
  };

  const onFieldBlur = (e) => {
    const id = e?.target?.id;
    if (id === "name" || id === "email" || id === "message") {
      touched.add(id);
      // Show errors for touched fields only.
      validateForm({ showErrors: true });
    }
  };

  form?.addEventListener("input", onFormInput);
  form?.addEventListener("blur", onFieldBlur, true);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    clearStatus();

    submitAttempted = true;

    const res = validateForm({ showErrors: true });
    if (!res.ok) {
      setStatus("error", "Please fix the highlighted fields and try again.");
      setSendEnabled(false);
      return;
    }

    // Open the user's email client with prefilled details (mailto).
    isSubmitting = true;
    setSendEnabled(false);
    setSendState("loading");

    const to = "sarbeswarpanda143@gmail.com";
    const subject = `Portfolio contact from ${res.nameVal}`;
    const body =
      `Name: ${res.nameVal}\n` +
      `Email: ${res.emailVal}\n\n` +
      `Message:\n${res.msgVal}\n`;

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Tiny delay so the loading state is visible.
    window.setTimeout(() => {
      setSendState("success");
      setStatus("success", "Opening your email app with your message…");
      showToast("Opening email app…");

      // Use location to trigger the user's configured email client.
      window.location.href = mailto;

      // Reset UI shortly after triggering.
      window.setTimeout(() => {
        form.reset();
        touched.clear();
        submitAttempted = false;
        isSubmitting = false;
        setSendState("idle");
        clearStatus();
        onFormInput();
      }, prefersReducedMotion ? 0 : 700);
    }, prefersReducedMotion ? 0 : 250);
  });

  toastClose?.addEventListener("click", hideToast);
  toast?.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target === toast) hideToast();
  });

  copyEmailBtn?.addEventListener("click", async () => {
    const email = (contactEmailText?.textContent || "").trim();
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied to clipboard.");
    } catch {
      // Fallback if Clipboard API is blocked.
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Email copied to clipboard.");
      } catch {
        showToast("Copy failed. Please select and copy manually.");
      }
      document.body.removeChild(ta);
    }
  });

  // Initialize send button state on load.
  onFormInput();

  // If loaded with a hash, apply offset scroll once.
  if (location.hash) {
    const id = location.hash.replace("#", "");
    window.setTimeout(() => smoothScrollToId(id), 0);
  }
})();
