/* ═══════════════════════════════════════════════════════════════
   KENT CLARENCE MINA — Portfolio Script
   Fixed & Cleaned — Flowise AI Chatbot Integration
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   CONFIG — Update CHATFLOW_ID if it changes
───────────────────────────────────────────── */
const FLOWISE_BASE_URL = "https://cloud.flowiseai.com";
const CHATFLOW_ID      = "8de78eb0-6750-4460-b0c6-109aeeb49dd3";

/* ─────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────── */
let isDark = true;
let radarChartInstance = null;

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.querySelector(".theme-toggle").textContent = isDark ? "☀️" : "🌙";

  if (radarChartInstance) {
    const labelColor = isDark ? "#8899aa" : "#64748b";
    const gridColor  = isDark ? "rgba(99,179,237,0.15)" : "rgba(59,130,246,0.15)";
    radarChartInstance.options.scales.r.pointLabels.color = labelColor;
    radarChartInstance.options.scales.r.grid.color = gridColor;
    radarChartInstance.update();
  }
}

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

/* ─────────────────────────────────────────────
   CONTACT FORM (UI only)
───────────────────────────────────────────── */
function submitForm() {
  const btn = document.querySelector(".form-submit");
  btn.textContent = "✅ Message Sent!";
  btn.style.background = "var(--accent2)";
  setTimeout(() => {
    btn.innerHTML = "✈️ Send Message";
    btn.style.background = "";
  }, 3000);
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────
   SKILL BARS — animate when visible
───────────────────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.dataset.width + "%";
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );
  fills.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────
   RADAR CHART
───────────────────────────────────────────── */
function initRadarChart() {
  const canvas = document.getElementById("radarChart");
  if (!canvas) return;

  const labelColor = isDark ? "#8899aa" : "#64748b";
  const gridColor  = isDark ? "rgba(99,179,237,0.15)" : "rgba(59,130,246,0.15)";

  radarChartInstance = new Chart(canvas, {
    type: "radar",
    data: {
      labels: ["Excel", "SQL", "Python", "Power BI", "Tableau", "Pandas", "Flowise"],
      datasets: [
        {
          label: "Proficiency",
          data: [90, 82, 85, 78, 75, 80, 70],
          borderColor: "#63b3ed",
          backgroundColor: "rgba(99,179,237,0.15)",
          pointBackgroundColor: "#63b3ed",
          pointBorderColor: "#fff",
          pointRadius: 4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 20 },
          grid: { color: gridColor },
          pointLabels: {
            color: labelColor,
            font: { size: 11, family: "'DM Sans', sans-serif" },
          },
          angleLines: { color: gridColor },
        },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   PROJECT CHARTS
───────────────────────────────────────────── */
function initProjectCharts() {
  const defaults = {
    animation: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {},
  };

  /* Project 1 — Retail Sales Line */
  const c1 = document.getElementById("proj1Chart");
  if (c1) {
    new Chart(c1, {
      type: "line",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{
          data: [42,55,38,70,65,80,90,75,85,95,110,130],
          borderColor: "#63b3ed",
          backgroundColor: "rgba(99,179,237,0.12)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        }],
      },
      options: { ...defaults, scales: { x: { display: false }, y: { display: false } } },
    });
  }

  /* Project 2 — HR Analytics Bar */
  const c2 = document.getElementById("proj2Chart");
  if (c2) {
    new Chart(c2, {
      type: "bar",
      data: {
        labels: ["HR","Sales","Tech","Ops","Finance"],
        datasets: [{
          data: [72, 85, 90, 68, 78],
          backgroundColor: ["rgba(99,179,237,0.7)","rgba(79,209,197,0.7)","rgba(246,173,85,0.7)","rgba(99,179,237,0.5)","rgba(79,209,197,0.5)"],
          borderRadius: 6,
        }],
      },
      options: { ...defaults, scales: { x: { display: false }, y: { display: false } } },
    });
  }

  /* Project 3 — COVID Doughnut */
  const c3 = document.getElementById("proj3Chart");
  if (c3) {
    new Chart(c3, {
      type: "doughnut",
      data: {
        labels: ["NCR","Cebu","Davao","Others"],
        datasets: [{
          data: [40, 22, 18, 20],
          backgroundColor: ["rgba(99,179,237,0.8)","rgba(79,209,197,0.8)","rgba(246,173,85,0.8)","rgba(141,162,251,0.8)"],
          borderColor: "transparent",
          borderWidth: 0,
        }],
      },
      options: { ...defaults, cutout: "65%" },
    });
  }

  /* Project 4 — Student Performance Bar */
  const c4 = document.getElementById("proj4Chart");
  if (c4) {
    new Chart(c4, {
      type: "bar",
      data: {
        labels: ["Attendance","Study hrs","Grades","Activity","Sleep"],
        datasets: [{
          label: "Pass",
          data: [88, 76, 91, 83, 70],
          backgroundColor: "rgba(79,209,197,0.7)",
          borderRadius: 5,
        },{
          label: "Fail",
          data: [55, 40, 52, 48, 60],
          backgroundColor: "rgba(252,92,101,0.5)",
          borderRadius: 5,
        }],
      },
      options: {
        ...defaults,
        plugins: { ...defaults.plugins, legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   CHATBOT WIDGET — Flowise AI Integration
═══════════════════════════════════════════════════════════════ */

/* Generate a stable session ID per page visit */
const SESSION_ID = "kent-portfolio-" + Math.random().toString(36).slice(2, 10);

const chatState = {
  opened: false,
  greeted: false,
  loading: false,
};

/* ── Toggle chat window ── */
function toggleChat() {
  const chatWindow = document.getElementById("chat-window");
  const trigger    = document.getElementById("chat-trigger");
  const badge      = document.getElementById("chat-badge");
  if (!chatWindow || !trigger) return;

  chatState.opened = !chatState.opened;
  chatWindow.classList.toggle("open", chatState.opened);
  trigger.classList.toggle("open", chatState.opened);

  if (chatState.opened) {
    if (badge) badge.style.display = "none";
    if (!chatState.greeted) {
      appendBotMessage("Hi! I'm Kent's AI assistant powered by Flowise. Ask me anything about his skills, projects, or availability! 🚀");
      chatState.greeted = true;
    }
    document.getElementById("chat-input")?.focus();
  }
}

/* ── Send suggestion chip ── */
function sendSuggestion(btn) {
  const text = btn?.textContent?.trim();
  if (!text) return;
  const input = document.getElementById("chat-input");
  if (input) input.value = text;
  sendMessage();
}

/* ── Main send function ── */
async function sendMessage() {
  if (chatState.loading) return;

  const input = document.getElementById("chat-input");
  const text  = input?.value?.trim();
  if (!text) return;

  input.value = "";
  appendUserMessage(text);

  /* Disable send button while loading */
  const sendBtn = document.getElementById("chat-send");
  if (sendBtn) sendBtn.disabled = true;
  chatState.loading = true;

  /* Show typing indicator */
  const typingId = showTypingIndicator();

  try {
    const reply = await callFlowise(text);
    removeTypingIndicator(typingId);
    appendBotMessage(reply);
  } catch (err) {
    removeTypingIndicator(typingId);
    appendBotMessage("⚠️ I'm having trouble connecting right now. Please try again in a moment, or reach Kent directly at rheakentmina@gmail.com.");
    console.error("Flowise error:", err);
  } finally {
    chatState.loading = false;
    if (sendBtn) sendBtn.disabled = false;
    input?.focus();
  }
}

/* ── Call Flowise Prediction API ── */
async function callFlowise(question) {
  const endpoint = `${FLOWISE_BASE_URL}/api/v1/prediction/${CHATFLOW_ID}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      sessionId: SESSION_ID,
      overrideConfig: { temperature: 0.4 },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  /* Flowise returns { text: "..." } or { answer: "..." } */
  return data.text || data.answer || data.message || "I'm not sure how to answer that. Try asking about Kent's projects, skills, or availability!";
}

/* ── Append user message bubble ── */
function appendUserMessage(text) {
  const messages = document.getElementById("chat-messages");
  if (!messages) return;

  const time = getTimeString();

  const wrapper = document.createElement("div");
  wrapper.className = "msg user";
  wrapper.innerHTML = `
    <div class="msg-avatar">👤</div>
    <div class="msg-col">
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  messages.appendChild(wrapper);
  scrollToBottom(messages);
}

/* ── Append bot message bubble ── */
function appendBotMessage(text) {
  const messages = document.getElementById("chat-messages");
  if (!messages) return;

  const time = getTimeString();

  const wrapper = document.createElement("div");
  wrapper.className = "msg bot";
  wrapper.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-col">
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <div class="msg-time">${time}</div>
    </div>
  `;

  messages.appendChild(wrapper);
  scrollToBottom(messages);
}

/* ── Show animated typing dots, return element ID ── */
function showTypingIndicator() {
  const messages = document.getElementById("chat-messages");
  if (!messages) return null;

  const id = "typing-" + Date.now();
  const wrapper = document.createElement("div");
  wrapper.className = "msg bot";
  wrapper.id = id;
  wrapper.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-col">
      <div class="msg-bubble" style="padding:0.55rem 0.9rem;">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `;

  messages.appendChild(wrapper);
  scrollToBottom(messages);
  return id;
}

/* ── Remove typing indicator by ID ── */
function removeTypingIndicator(id) {
  if (!id) return;
  document.getElementById(id)?.remove();
}

/* ─── Helpers ─── */
function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
}

function getTimeString() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

/* ═══════════════════════════════════════════════════════════════
   INIT — Run everything on DOMContentLoaded
═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initSkillBars();
  initRadarChart();
  initProjectCharts();

  /* Navbar shadow on scroll */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 20 ? "0 4px 24px rgba(0,0,0,0.3)" : "none";
    });
  }

  /* Active nav link highlight */
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-links a");
  const highlight = () => {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((a) => {
      a.style.color = a.getAttribute("href") === "#" + current ? "var(--accent)" : "";
    });
  };
  window.addEventListener("scroll", highlight, { passive: true });
});
