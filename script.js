/* =========================================
   THE LATENT SPACE: SITE SCRIPT
   Every lookup is guarded, so a missing
   element can never stop the rest of the file.
========================================= */

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* Footer year */

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* Mobile menu */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after a link is tapped.
  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Scroll reveal */

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Clear the stagger delay so hover transitions stay instant.
          entry.target.style.transitionDelay = "0ms";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  document
    .querySelectorAll(".about-grid, .explore-header, .blog-card, .closing-inner")
    .forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.transitionDelay = `${Math.min(index * 80, 240)}ms`;
      revealObserver.observe(element);
    });
}

/* =========================================
   INTERACTIVE SPIRAL NOTEBOOK
========================================= */

const notebookNotes = [
  {
    note: "Blogging is a conversation, not a code.",
    category: "A THOUGHT TO KEEP"
  },
  {
    note: "Curiosity is the beginning of every great discovery.",
    category: "ON CURIOSITY"
  },
  {
    note: "Build things that make people think differently.",
    category: "ON BUILDING"
  },
  {
    note: "The best ideas often begin with better questions.",
    category: "ON LEARNING"
  }
];

const notebookPage = document.getElementById("notebookPage");
const notebookPageContent = document.getElementById("notebookPageContent");
const pageNote = document.getElementById("pageNote");
const pageCategory = document.getElementById("pageCategory");
const pageNumber = document.getElementById("pageNumber");

let currentNoteIndex = 0;
let isTurning = false;

function updateNotebookContent() {
  if (!pageNote || !pageCategory || !pageNumber) return;

  const note = notebookNotes[currentNoteIndex];
  const page = String(currentNoteIndex + 1).padStart(2, "0");
  const total = String(notebookNotes.length).padStart(2, "0");

  pageNote.textContent = note.note;
  pageCategory.textContent = note.category;
  pageNumber.textContent = `${page} / ${total}`;
}

function turnNotebookPage() {
  if (!notebookPage || !notebookPageContent || isTurning) return;

  isTurning = true;
  currentNoteIndex = (currentNoteIndex + 1) % notebookNotes.length;

  if (reducedMotion) {
    updateNotebookContent();
    isTurning = false;
    return;
  }

  // Restart the page-turn animation.
  notebookPageContent.classList.remove("turning");
  void notebookPageContent.offsetWidth;
  notebookPageContent.classList.add("turning");

  // Swap the text while the page is turned away (halfway through the 0.55s animation).
  setTimeout(updateNotebookContent, 275);

  // Unlock after the animation finishes. A timer is used instead of
  // animationend so the page can't get stuck if the animation never fires.
  setTimeout(() => {
    notebookPageContent.classList.remove("turning");
    isTurning = false;
  }, 560);
}

if (notebookPage) {
  // Clicking the paper turns the page.
  notebookPage.addEventListener("click", turnNotebookPage);

  // Keyboard support: Enter or Space.
  notebookPage.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      turnNotebookPage();
    }
  });
}

// Show the first note on load.
updateNotebookContent();
