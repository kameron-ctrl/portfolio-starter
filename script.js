// ============================================================
// PROJECTS DATA
// TODO: Replace these with your real projects!
// Each project needs: title, description, tags, and optional links.
// Ask Copilot: "Add a project card for a [project type] called [name]"
// ============================================================
const projects = [
  {
    title: "Project One",
    description: "A short description of what this project does and why you built it.",
    tags: ["Python", "Flask"],
    github: "https://github.com/yourusername/project-one",
    demo: null,
  },
  {
    title: "Project Two",
    description: "Another project you're proud of. What problem did it solve?",
    tags: ["JavaScript", "React"],
    github: "https://github.com/yourusername/project-two",
    demo: "https://yourproject.netlify.app",
  },
  {
    title: "Project Three",
    description: "Keep it brief — one or two sentences is plenty.",
    tags: ["Java", "Algorithms"],
    github: "https://github.com/yourusername/project-three",
    demo: null,
  },
];

// ============================================================
// SKILLS DATA
// TODO: Replace with your actual skills.
// Ask Copilot to help format this list based on your resume.
// ============================================================
const skills = [
  "Python", "JavaScript", "Java", "C",
  "HTML & CSS", "Git & GitHub",
  "React", "Node.js",
  "SQL", "Linux",
];

// ============================================================
// RENDER PROJECTS
// ============================================================
function renderProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.innerHTML = projects
    .map(
      (project) => `
      <div class="project-card">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank">GitHub →</a>` : ""}
          ${project.demo ? `<a href="${project.demo}" target="_blank">Live Demo →</a>` : ""}
        </div>
      </div>
    `
    )
    .join("");
}

// ============================================================
// RENDER SKILLS
// ============================================================
function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = skills
    .map((skill) => `<span class="skill-badge">${skill}</span>`)
    .join("");
}

// ============================================================
// DARK MODE TOGGLE
// TODO: Implement this! Here's a stub to get you started.
// Ask Copilot (inline chat on this function): "Implement dark mode
// toggle that saves preference to localStorage"
// ============================================================


// Initialize theme from localStorage
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

// ============================================================
// UPDATE FOOTER YEAR
// ============================================================
function updateYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderSkills();
  updateYear();

  // TODO: Wire up your dark mode toggle button here once you add it
  function toggleDarkMode() {
  const html = document.documentElement;
  const isDarkMode = html.getAttribute("data-theme") === "dark";
  const newTheme = isDarkMode ? "light" : "dark";
  
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

});
