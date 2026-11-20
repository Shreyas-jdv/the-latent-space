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

const FLIP_DURATION = 900; // Keep in sync with the pageTurn animation in style.css

const notebookPage = document.getElementById("notebookPage");
const pageNote = document.getElementById("pageNote");
const pageCategory = document.getElementById("pageCategory");
const pageNumber = document.getElementById("pageNumber");
const pageFlip = document.getElementById("pageFlip");
const pageFront = pageFlip ? pageFlip.querySelector(".page-front") : null;
const pageBack = pageFlip ? pageFlip.querySelector(".page-back") : null;

let currentNoteIndex = 0;
let isTurning = false;

function formatPageNumber(index) {
  const page = String(index + 1).padStart(2, "0");
  const total = String(notebookNotes.length).padStart(2, "0");
  return `${page} / ${total}`;
}

// Markup for one side of a leaf.
function buildPageMarkup(index) {
  const item = notebookNotes[index];
  return `
    <div class="page-topline">
      <span>FIELD NOTES</span>
      <span>${formatPageNumber(index)}</span>
    </div>
    <div class="page-content">
      <span class="handwritten-note">${item.note}</span>
      <span class="note-underline"></span>
    </div>
    <div class="page-footer">
      <span>${item.category}</span>
    </div>
  `;
}

// Writes the current note into the static page.
function updateNotebookContent() {
  if (!pageNote || !pageCategory || !pageNumber) return;

  const item = notebookNotes[currentNoteIndex];
  pageNote.textContent = item.note;
  pageCategory.textContent = item.category;
  pageNumber.textContent = formatPageNumber(currentNoteIndex);
}

function turnNotebookPage() {
  if (!notebookPage || isTurning) return;

  const fromIndex = currentNoteIndex;
  const toIndex = (currentNoteIndex + 1) % notebookNotes.length;

  // Reduced motion: change the note without animating.
  if (reducedMotion || !pageFlip || !pageFront || !pageBack) {
    currentNoteIndex = toIndex;
    updateNotebookContent();
    return;
  }

  isTurning = true;

  // Front of the leaf shows the note being turned away.
  // Back of the leaf shows the note being turned to.
  pageFront.innerHTML = buildPageMarkup(fromIndex);
  pageBack.innerHTML = buildPageMarkup(toIndex);

  // The static page underneath already shows the new note.
  currentNoteIndex = toIndex;
  updateNotebookContent();

  // Restart the turn animation.
  pageFlip.classList.remove("turning");
  void pageFlip.offsetWidth;
  pageFlip.classList.add("turning");

  // Hide the leaf once the turn finishes.
  setTimeout(() => {
    pageFlip.classList.remove("turning");
    isTurning = false;
  }, FLIP_DURATION + 20);
}

if (notebookPage) {
  // Click the paper to turn the page.
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
