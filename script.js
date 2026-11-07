
const topics = [
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "AI Agents / Agentic AI",
  "Large Language Models",
  "RAG / Retrieval-Augmented Generation",
  "Natural Language Processing",
  "Computer Vision",
  "Prompt Engineering",
  "Context Engineering"
];

// Keep this empty until you are ready to publish your first article.
const articles = [];

const defaultTopicOrder = [...topics];
const topicFilters = document.getElementById("topicFilters");
const sidebarTopics = document.getElementById("sidebarTopics");
const articleGrid = document.getElementById("articleGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const ownerToggle = document.getElementById("ownerToggle");
const ownerPanel = document.getElementById("ownerPanel");
const ownerHint = document.getElementById("ownerHint");
const toast = document.getElementById("toast");

let selectedTopic = "All";
let searchTerm = "";
let ownerMode = false;
let toastTimeout;

function loadTopicOrder() {
  try {
    const saved = JSON.parse(localStorage.getItem("latent-space-topic-order"));
    if (
      Array.isArray(saved) &&
      saved.length === defaultTopicOrder.length &&
      defaultTopicOrder.every(topic => saved.includes(topic))
    ) {
      return saved;
    }
  } catch (error) {
    console.warn("Could not load saved topic order.", error);
  }

  return [...defaultTopicOrder];
}

let topicOrder = loadTopicOrder();

function saveTopicOrder() {
  try {
    localStorage.setItem(
      "latent-space-topic-order",
      JSON.stringify(topicOrder)
    );
    showToast("Topic order saved in this browser.");
  } catch (error) {
    showToast("Could not save changes in this browser.");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

function formatCount(number) {
  return String(number).padStart(2, "0");
}

function getFilteredArticles() {
  return articles.filter(article => {
    const matchesTopic =
      selectedTopic === "All" || article.topic === selectedTopic;

    const searchableText = [
      article.title,
      article.description,
      article.topic,
      ...(article.tags || [])
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    return matchesTopic && matchesSearch;
  });
}

function renderTopicFilters() {
  topicFilters.innerHTML = "";

  const filterItems = ["All", ...topicOrder];

  filterItems.forEach(topic => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "filter-chip" + (selectedTopic === topic ? " active" : "");
    button.textContent = topic === "All" ? "All topics" : topic;
    button.setAttribute(
      "aria-pressed",
      String(selectedTopic === topic)
    );

    button.addEventListener("click", () => selectTopic(topic));
    topicFilters.appendChild(button);
  });
}

function renderSidebar() {
  sidebarTopics.innerHTML = "";

  topicOrder.forEach((topic, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "sidebar-topic" + (selectedTopic === topic ? " active" : "");
    button.dataset.filter = topic;

    const bullet = document.createElement("span");
    bullet.className = "topic-bullet";
    bullet.textContent = "↳";

    const name = document.createElement("span");
    name.className = "sidebar-topic-name";
    name.textContent = topic;

    const count = document.createElement("span");
    count.className = "topic-empty-count";
    count.textContent = formatCount(
      articles.filter(article => article.topic === topic).length
    );

    button.append(bullet, name, count);

    if (ownerMode) {
      const controls = document.createElement("span");
      controls.className = "owner-sort";

      const upButton = document.createElement("button");
      upButton.type = "button";
      upButton.textContent = "↑";
      upButton.title = "Move topic up";
      upButton.setAttribute("aria-label", `Move ${topic} up`);
      upButton.disabled = index === 0;
      upButton.addEventListener("click", event => {
        event.stopPropagation();
        moveTopic(index, -1);
      });

      const downButton = document.createElement("button");
      downButton.type = "button";
      downButton.textContent = "↓";
      downButton.title = "Move topic down";
      downButton.setAttribute("aria-label", `Move ${topic} down`);
      downButton.disabled = index === topicOrder.length - 1;
      downButton.addEventListener("click", event => {
        event.stopPropagation();
        moveTopic(index, 1);
      });

      controls.append(upButton, downButton);
      button.appendChild(controls);
    }

    button.addEventListener("click", () => selectTopic(topic));
    sidebarTopics.appendChild(button);
  });

  document.getElementById("topicCount").textContent = topicOrder.length;

  const allTopicsButton = document.querySelector(".sidebar-domain");
  allTopicsButton.classList.toggle("active", selectedTopic === "All");
}

function moveTopic(index, direction) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= topicOrder.length) return;

  [topicOrder[index], topicOrder[nextIndex]] = [
    topicOrder[nextIndex],
    topicOrder[index]
  ];

  saveTopicOrder();
  renderAll();
}

function selectTopic(topic) {
  selectedTopic = topic;

  renderAll();

  // Keep the results area visible on smaller screens.
  if (window.innerWidth <= 650) {
    document.getElementById("explore").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  }
}

function createArticleCard(article, index) {
  const card = document.createElement("article");
  card.className = "article-card";
  card.style.animationDelay = `${Math.min(index * 60, 300)}ms`;

  const top = document.createElement("div");
  top.className = "article-card-top";

  const tag = document.createElement("span");
  tag.className = "article-tag";
  tag.textContent = article.topic;

  const date = document.createElement("span");
  date.className = "article-date";
  date.textContent = article.date || "NEW NOTE";

  top.append(tag, date);

  const heading = document.createElement("h4");
  heading.textContent = article.title;

  const description = document.createElement("p");
  description.textContent = article.description;

  const bottom = document.createElement("div");
  bottom.className = "article-card-bottom";

  const readTime = document.createElement("span");
  readTime.textContent = article.readTime || "READ";

  const link = document.createElement("a");
  link.className = "article-open";
  link.href = article.url || "#";
  link.setAttribute("aria-label", `Read ${article.title}`);
  link.textContent = "↗";

  bottom.append(readTime, link);
  card.append(top, heading, description, bottom);

  return card;
}

function renderArticles() {
  const filteredArticles = getFilteredArticles();

  articleGrid.innerHTML = "";
  filteredArticles.forEach((article, index) => {
    articleGrid.appendChild(createArticleCard(article, index));
  });

  document.getElementById("articleCount").textContent =
    formatCount(articles.length);

  document.getElementById("resultsCount").textContent =
    `${filteredArticles.length} ${filteredArticles.length === 1 ? "ENTRY" : "ENTRIES"}`;

  document.getElementById("currentTopic").textContent =
    selectedTopic === "All" ? "ALL TOPICS" : selectedTopic.toUpperCase();

  document.getElementById("resultsHeading").textContent =
    selectedTopic === "All" ? "All topics" : selectedTopic;

  emptyState.hidden = filteredArticles.length > 0;

  if (filteredArticles.length === 0) {
    const hasSearch = searchTerm.length > 0;
    const hasArticlesInTopic =
      selectedTopic !== "All" &&
      articles.some(article => article.topic === selectedTopic);

    document.getElementById("emptyTitle").textContent = hasSearch
      ? "No matching ideas. Yet."
      : hasArticlesInTopic
        ? "No notes match this search."
        : "The next idea starts here.";

    document.getElementById("emptyMessage").textContent = hasSearch
      ? "Try another keyword or browse a different topic."
      : selectedTopic === "All"
        ? "This journal is just getting started. New notes and explorations will find their home here soon."
        : `The ${selectedTopic} shelf is waiting for its first article.`;

    document.getElementById("resetFilter").textContent =
      hasSearch || selectedTopic !== "All"
        ? "Explore all topics ↗"
        : "Browse the library ↓";
  }
}

function renderAll() {
  renderTopicFilters();
  renderSidebar();
  renderArticles();
}

ownerToggle.addEventListener("click", () => {
  ownerMode = !ownerMode;

  ownerToggle.classList.toggle("enabled", ownerMode);
  ownerToggle.setAttribute("aria-pressed", String(ownerMode));
  ownerPanel.hidden = !ownerMode;
  ownerHint.hidden = !ownerMode;

  renderAll();

  showToast(
    ownerMode
      ? "Owner preview enabled. This is not secure authentication."
      : "Owner preview disabled."
  );
});

document.querySelector(".sidebar-domain").addEventListener("click", () => {
  selectTopic("All");
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderArticles();
});

document.getElementById("resetFilter").addEventListener("click", () => {
  selectedTopic = "All";
  searchTerm = "";
  searchInput.value = "";
  renderAll();
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", event => {
  const target = event.target;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchTerm = "";
    searchInput.blur();
    renderArticles();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderAll();


/* Scroll reveal and staggered entrance animations */

const motionReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!motionReduced && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  function observeRevealElements() {
    document.querySelectorAll(
      ".about-grid, .section-heading, .journal-toolbar, " +
      ".topic-sidebar, .article-area, .closing-inner"
    ).forEach(element => {
      if (!element.dataset.revealBound) {
        element.dataset.revealBound = "true";
        element.classList.add("scroll-reveal");
        revealObserver.observe(element);
      }
    });
  }

  observeRevealElements();

  // Re-observe dynamically rendered topic cards after filtering or reordering.
  const topicObserver = new MutationObserver(() => {
    document.querySelectorAll(".sidebar-topic:not([data-motion-bound])")
      .forEach((card, index) => {
        card.dataset.motionBound = "true";
        card.style.animationDelay = `${Math.min(index * 45, 300)}ms`;
        card.classList.add("topic-enter");
      });
  });

  topicObserver.observe(sidebarTopics, {
    childList: true
  });
}

