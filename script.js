/* ═══════════════════════════════════════════════════════════════
   KENT CLARENCE MINA — Portfolio Script (FIXED)
   Flowise Chatbot Integration
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   FLOWISE CONFIG
─────────────────────────────────────────────────────────────── */

/*
  IMPORTANT:
  Replace YOUR_CHATFLOW_ID with your REAL prediction chatflow ID.

  Example:
  https://cloud.flowiseai.com/api/v1/prediction/xxxxxxxx

  ONLY copy the xxxxxxxx part.
*/

const FLOWISE_CHATFLOW_ID = "8de78eb0-6750-4460-b0c6-109aeeb49dd3";
const FLOWISE_BASE_URL = "https://cloud.flowiseai.com";

const DEBUG_CHAT = true;

/* ─────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────── */

let isDark = true;
let radarChartInstance = null;

function toggleTheme() {
  isDark = !isDark;

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );

  document.querySelector(".theme-toggle").textContent =
    isDark ? "☀️" : "🌙";

  if (radarChartInstance) {
    const lc = isDark ? "#8899aa" : "#64748b";
    const gc = isDark
      ? "rgba(99,179,237,0.15)"
      : "rgba(59,130,246,0.15)";

    radarChartInstance.options.scales.r.pointLabels.color = lc;
    radarChartInstance.options.scales.r.grid.color = gc;

    radarChartInstance.update();
  }
}

function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

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
  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   SKILL BARS
───────────────────────────────────────────── */

function initSkillBars() {
  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + "%";
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".skill-fill").forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   RADAR CHART
───────────────────────────────────────────── */

function initRadarChart() {
  const canvas = document.getElementById("radarChart");

  if (!canvas || typeof Chart === "undefined") return;

  radarChartInstance = new Chart(canvas, {
    type: "radar",

    data: {
      labels: [
        "Excel",
        "SQL",
        "Python",
        "Power BI",
        "Tableau",
        "Pandas",
        "Flowise"
      ],

      datasets: [
        {
          label: "Proficiency",
          data: [90, 82, 85, 78, 75, 80, 70],

          borderColor: "#63b3ed",
          backgroundColor: "rgba(99,179,237,0.15)",

          pointBackgroundColor: "#63b3ed",
          pointBorderColor: "#fff",
          pointRadius: 4,
          borderWidth: 2
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        r: {
          min: 0,
          max: 100,

          ticks: {
            display: false
          },

          grid: {
            color: "rgba(99,179,237,0.15)"
          },

          pointLabels: {
            color: "#8899aa",

            font: {
              size: 11,
              family: "'DM Sans', sans-serif"
            }
          },

          angleLines: {
            color: "rgba(99,179,237,0.15)"
          }
        }
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   CHATBOT
═══════════════════════════════════════════════════════════════ */

const SESSION_ID =
  "kent-" + Math.random().toString(36).slice(2, 10);

const chatState = {
  opened: false,
  greeted: false,
  loading: false
};

/* ─────────────────────────────────────────────
   TOGGLE CHAT
───────────────────────────────────────────── */

function toggleChat() {
  const win = document.getElementById("chat-window");
  const trigger = document.getElementById("chat-trigger");
  const badge = document.getElementById("chat-badge");

  if (!win || !trigger) return;

  chatState.opened = !chatState.opened;

  win.classList.toggle("open", chatState.opened);
  trigger.classList.toggle("open", chatState.opened);

  if (chatState.opened) {
    if (badge) badge.style.display = "none";

    if (!chatState.greeted) {
      appendBot(
        "Hi! 👋 I'm Kent's AI assistant. Ask me about his projects, skills, tools, or availability."
      );

      chatState.greeted = true;
    }

    document.getElementById("chat-input")?.focus();
  }
}

/* ─────────────────────────────────────────────
   SUGGESTION BUTTONS
───────────────────────────────────────────── */

function sendSuggestion(btn) {
  const text = btn?.textContent?.trim();

  if (!text) return;

  const input = document.getElementById("chat-input");

  if (input) input.value = text;

  sendMessage();
}

/* ─────────────────────────────────────────────
   SEND MESSAGE
───────────────────────────────────────────── */

async function sendMessage() {
  if (chatState.loading) return;

  const input = document.getElementById("chat-input");
  const text = input?.value?.trim();

  if (!text) return;

  input.value = "";

  appendUser(text);

  const sendBtn = document.getElementById("chat-send");

  if (sendBtn) sendBtn.disabled = true;

  chatState.loading = true;

  const typingId = showTyping();

  try {
    const reply = await getReply(text);

    removeTyping(typingId);

    appendBot(reply);

  } catch (err) {

    removeTyping(typingId);

    console.error("[Chatbot Error]", err);

    appendBot(
      "⚠️ The AI assistant is temporarily unavailable. Please try again later."
    );

  } finally {

    chatState.loading = false;

    if (sendBtn) sendBtn.disabled = false;

    input?.focus();
  }
}

/* ─────────────────────────────────────────────
   FLOWISE REQUEST
───────────────────────────────────────────── */

async function getReply(question) {

  const url =
    `${FLOWISE_BASE_URL}/api/v1/prediction/${FLOWISE_CHATFLOW_ID}`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      question,
      sessionId: SESSION_ID
    })
  });

  if (!response.ok) {
    const txt = await response.text();

    throw new Error(
      `HTTP ${response.status}: ${txt}`
    );
  }

  const data = await response.json();

  return (
    data.text ||
    data.answer ||
    data.message ||
    "No response returned."
  );
}

/* ─────────────────────────────────────────────
   DOM HELPERS
───────────────────────────────────────────── */

function appendUser(text) {

  const msgs = document.getElementById("chat-messages");

  if (!msgs) return;

  const el = document.createElement("div");

  el.className = "msg user";

  el.innerHTML = `
    <div class="msg-avatar">👤</div>

    <div class="msg-col">
      <div class="msg-bubble">${sanitize(text)}</div>
      <div class="msg-time">${now()}</div>
    </div>
  `;

  msgs.appendChild(el);

  msgs.scrollTop = msgs.scrollHeight;
}

function appendBot(text) {

  const msgs = document.getElementById("chat-messages");

  if (!msgs) return;

  const el = document.createElement("div");

  el.className = "msg bot";

  el.innerHTML = `
    <div class="msg-avatar">🤖</div>

    <div class="msg-col">
      <div class="msg-bubble">${sanitize(text)}</div>
      <div class="msg-time">${now()}</div>
    </div>
  `;

  msgs.appendChild(el);

  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {

  const msgs = document.getElementById("chat-messages");

  if (!msgs) return null;

  const id = "typing-" + Date.now();

  const el = document.createElement("div");

  el.className = "msg bot";
  el.id = id;

  el.innerHTML = `
    <div class="msg-avatar">🤖</div>

    <div class="msg-col">
      <div class="msg-bubble" style="padding:0.55rem 0.9rem;">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;

  msgs.appendChild(el);

  msgs.scrollTop = msgs.scrollHeight;

  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function sanitize(str) {

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  initReveal();
  initSkillBars();
  initRadarChart();

  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener(
      "scroll",
      () => {
        navbar.style.boxShadow =
          window.scrollY > 20
            ? "0 4px 24px rgba(0,0,0,0.35)"
            : "none";
      },
      { passive: true }
    );
  }

  if (DEBUG_CHAT) {

    console.log(
      `%c[Chatbot] Session: ${SESSION_ID}`,
      "color:#63b3ed;font-weight:bold"
    );

    console.log(
      `%c[Chatbot] Prediction Endpoint: ${FLOWISE_BASE_URL}/api/v1/prediction/${FLOWISE_CHATFLOW_ID}`,
      "color:#63b3ed"
    );
  }
});
