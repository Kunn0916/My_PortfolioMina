/* ═══════════════════════════════════════════════════════════════
   KENT CLARENCE MINA — Portfolio Script  v3
   Flowise integration + rich fallback + debug helpers
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   ★  FLOWISE CONFIG
   1. In Flowise Cloud open your chatflow
   2. Click the </> share button → "Configuration" tab
   3. Copy the chatflowId shown there — paste it below
   4. Make sure "Allow Public Access" is ON (no API key needed)
───────────────────────────────────────────────────────────────*/
const FLOWISE_CHATFLOW_ID = "8de78eb0-6750-4460-b0c6-109aeeb49dd3"; // ← update if different
const FLOWISE_API_KEY     = "";   // leave blank if Allow Public Access is ON
const FLOWISE_BASE_URL    = "https://cloud.flowiseai.com";
const DEBUG_CHAT          = true; // set false in production to hide error details in chat

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
    const lc = isDark ? "#8899aa" : "#64748b";
    const gc = isDark ? "rgba(99,179,237,0.15)" : "rgba(59,130,246,0.15)";
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
  setTimeout(() => { btn.innerHTML = "✈️ Send Message"; btn.style.background = ""; }, 3000);
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   SKILL BARS
───────────────────────────────────────────── */
function initSkillBars() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.width = e.target.dataset.width + "%"; obs.unobserve(e.target); }
    }),
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
      labels: ["Excel","SQL","Python","Power BI","Tableau","Pandas","Flowise"],
      datasets: [{ label: "Proficiency", data: [90,82,85,78,75,80,70],
        borderColor:"#63b3ed", backgroundColor:"rgba(99,179,237,0.15)",
        pointBackgroundColor:"#63b3ed", pointBorderColor:"#fff", pointRadius:4, borderWidth:2 }],
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ display:false } },
      scales: { r: { min:0, max:100, ticks:{ display:false }, grid:{ color:"rgba(99,179,237,0.15)" },
        pointLabels:{ color:"#8899aa", font:{ size:11, family:"'DM Sans', sans-serif" } },
        angleLines:{ color:"rgba(99,179,237,0.15)" } } },
    },
  });
}

/* ─────────────────────────────────────────────
   PROJECT CHARTS
───────────────────────────────────────────── */
function initProjectCharts() {
  if (typeof Chart === "undefined") return;
  const noAxes = { scales:{ x:{ display:false }, y:{ display:false } } };

  const p1 = document.getElementById("proj1Chart");
  if (p1) new Chart(p1, { type:"line",
    data:{ labels:["J","F","M","A","M","J","J","A","S","O","N","D"],
      datasets:[{ data:[42,55,38,70,65,80,90,75,85,95,110,130],
        borderColor:"#63b3ed", backgroundColor:"rgba(99,179,237,0.12)",
        borderWidth:2.5, fill:true, tension:0.4, pointRadius:0 }] },
    options:{ animation:false, plugins:{ legend:{ display:false } }, ...noAxes } });

  const p2 = document.getElementById("proj2Chart");
  if (p2) new Chart(p2, { type:"bar",
    data:{ labels:["HR","Sales","Tech","Ops","Fin"],
      datasets:[{ data:[72,85,90,68,78],
        backgroundColor:["rgba(99,179,237,0.7)","rgba(79,209,197,0.7)","rgba(246,173,85,0.7)","rgba(99,179,237,0.5)","rgba(79,209,197,0.5)"],
        borderRadius:6 }] },
    options:{ animation:false, plugins:{ legend:{ display:false } }, ...noAxes } });

  const p3 = document.getElementById("proj3Chart");
  if (p3) new Chart(p3, { type:"doughnut",
    data:{ labels:["NCR","Cebu","Davao","Others"],
      datasets:[{ data:[40,22,18,20],
        backgroundColor:["rgba(99,179,237,0.8)","rgba(79,209,197,0.8)","rgba(246,173,85,0.8)","rgba(141,162,251,0.8)"],
        borderColor:"transparent" }] },
    options:{ animation:false, plugins:{ legend:{ display:false } }, cutout:"65%" } });

  const p4 = document.getElementById("proj4Chart");
  if (p4) new Chart(p4, { type:"bar",
    data:{ labels:["Att.","Study","Grades","Act.","Sleep"],
      datasets:[
        { data:[88,76,91,83,70], backgroundColor:"rgba(79,209,197,0.7)", borderRadius:5 },
        { data:[55,40,52,48,60], backgroundColor:"rgba(252,92,101,0.5)", borderRadius:5 }] },
    options:{ animation:false, plugins:{ legend:{ display:false } }, ...noAxes } });
}

/* ═══════════════════════════════════════════════════════════════
   CHATBOT — FLOWISE + RICH FALLBACK
═══════════════════════════════════════════════════════════════ */

const SESSION_ID = "kent-" + Math.random().toString(36).slice(2, 10);
const chatState  = { opened:false, greeted:false, loading:false };

/* ── Toggle ── */
function toggleChat() {
  const win     = document.getElementById("chat-window");
  const trigger = document.getElementById("chat-trigger");
  const badge   = document.getElementById("chat-badge");
  if (!win || !trigger) return;

  chatState.opened = !chatState.opened;
  win.classList.toggle("open", chatState.opened);
  trigger.classList.toggle("open", chatState.opened);

  if (chatState.opened) {
    if (badge) badge.style.display = "none";
    if (!chatState.greeted) {
      appendBot("Hi! 👋 I'm Kent's AI assistant. Ask me about his skills, projects, tools, or whether he's available to hire!");
      chatState.greeted = true;
    }
    document.getElementById("chat-input")?.focus();
  }
}

/* ── Suggestion chips ── */
function sendSuggestion(btn) {
  const text = btn?.textContent?.trim();
  if (!text) return;
  const inp = document.getElementById("chat-input");
  if (inp) inp.value = text;
  sendMessage();
}

/* ── Send ── */
async function sendMessage() {
  if (chatState.loading) return;
  const inp  = document.getElementById("chat-input");
  const text = inp?.value?.trim();
  if (!text) return;

  inp.value = "";
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
    if (DEBUG_CHAT) {
      console.error("[Chatbot] Flowise failed:", err.message);
      appendBot("⚠️ Flowise offline — using fallback mode. (Check console for error details.)");
    }
    // Always show a fallback reply
    setTimeout(() => appendBot(fallbackReply(text)), 300);
  } finally {
    chatState.loading = false;
    if (sendBtn) sendBtn.disabled = false;
    inp?.focus();
  }
}

/* ── Try Flowise, throw on failure so catch can handle ── */
async function getReply(question) {
  if (!FLOWISE_CHATFLOW_ID) {
    throw new Error("No chatflow ID configured — using fallback.");
  }

  const url = `${FLOWISE_BASE_URL}/api/v1/prediction/${FLOWISE_CHATFLOW_ID}`;
  const headers = { "Content-Type": "application/json" };
  if (FLOWISE_API_KEY) headers["Authorization"] = `Bearer ${FLOWISE_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, sessionId: SESSION_ID }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} — ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const reply = data.text || data.answer || data.message || "";
  if (!reply) throw new Error("Flowise returned an empty response.");
  return reply;
}

/* ── Rich keyword fallback ── */
function fallbackReply(msg) {
  const m = msg.toLowerCase();

  if (/who is kent|about kent|introduce|yourself|tell me about/.test(m))
    return "Kent Clarence Mina is an IT student specializing in data analytics, data visualization, and AI-powered solutions. He turns raw data into actionable insights using Python, SQL, Power BI, and Flowise AI.";

  if (/tool|skill|tech|stack|language|framework|software/.test(m))
    return "Kent's core stack:\n• 📊 Excel & Google Sheets\n• 🗄️ SQL (MySQL, PostgreSQL)\n• 🐍 Python — Pandas, Matplotlib, Scikit-learn\n• 📈 Power BI & DAX\n• 🗺️ Tableau\n• 🤖 Flowise AI & LangChain\n• Git, Jupyter Notebooks";

  if (/project|work|portfolio|built|created|made/.test(m))
    return "Kent's featured projects:\n1️⃣ Retail Sales EDA — Python, Pandas, 50k+ transactions\n2️⃣ HR Analytics Dashboard — Power BI + SQL + DAX\n3️⃣ COVID-19 PH Analysis — SQL + Tableau heatmap\n4️⃣ Student Performance Predictor — Scikit-learn, 89% accuracy\nSee them all at github.com/Kunn0916";

  if (/hire|availab|intern|opportunit|open|job|work with|freelance/.test(m))
    return "Yes! Kent is actively open to internship and entry-level data analyst roles. Contact him at:\n✉️ rheakentmina@gmail.com\n💼 linkedin.com/in/kent-mina\nHe's excited to contribute to a data-driven team!";

  if (/contact|email|reach|linkedin|github|social/.test(m))
    return "Reach Kent through:\n✉️ rheakentmina@gmail.com\n💼 linkedin.com/in/kent-mina\n🐙 github.com/Kunn0916\nOr use the contact form on this page!";

  if (/python|pandas|matplotlib|scikit|seaborn/.test(m))
    return "Python is Kent's primary data language. He uses Pandas for wrangling, Matplotlib & Seaborn for visualization, and Scikit-learn for ML models like classification and regression.";

  if (/sql|database|query|mysql|postgres/.test(m))
    return "Kent is proficient in SQL — writing complex JOINs, aggregations, window functions, and subqueries for data extraction and Power BI pipelines.";

  if (/power bi|powerbi|dax|dashboard/.test(m))
    return "Kent's HR Analytics Power BI dashboard tracks attrition, satisfaction scores, and department KPIs using SQL for extraction and DAX for calculated measures.";

  if (/flowise|ai|llm|chatbot|langchain|rag|vector|gemini/.test(m))
    return "Kent builds RAG-powered AI pipelines with Flowise AI. This chatbot is powered by Google Gemini + a vector store that indexes his entire portfolio — exactly the kind of AI tooling he loves building!";

  if (/stud|school|university|college|degree|education/.test(m))
    return "Kent is an IT student focused on data analytics and computer science fundamentals, looking to apply his skills in real-world internships and data projects.";

  if (/thank|thanks|appreciate|great|awesome|cool/.test(m))
    return "You're welcome! 😊 Feel free to ask anything else about Kent's projects, skills, or how to get in touch.";

  if (/^(hi|hello|hey|sup|yo|howdy)/.test(m))
    return "Hey! 👋 I'm Kent's assistant. Ask me about his skills, projects, tech stack, or availability — happy to help!";

  return "I can tell you about Kent's:\n• 🛠️ Skills & tech stack\n• 📊 Projects & portfolio\n• 🎓 Education & background\n• 📬 Availability & contact info\nWhat would you like to know?";
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
    </div>`;
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
    </div>`;
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
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) { document.getElementById(id)?.remove(); }

function now() {
  return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

function sanitize(str) {
  return str
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;")
    .replace(/\n/g,"<br>");
}

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initSkillBars();
  initRadarChart();
  initProjectCharts();

  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 20 ? "0 4px 24px rgba(0,0,0,0.35)" : "none";
    }, { passive:true });
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  window.addEventListener("scroll", () => {
    let cur = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute("href") === "#" + cur ? "var(--accent)" : "";
    });
  }, { passive:true });

  if (DEBUG_CHAT) {
    console.log(`%c[Chatbot] Session: ${SESSION_ID}`, "color:#63b3ed;font-weight:bold");
    console.log(`%c[Chatbot] Flowise URL: ${FLOWISE_BASE_URL}/api/v1/prediction/${FLOWISE_CHATFLOW_ID}`, "color:#63b3ed");
    console.log("%c[Chatbot] CORS fix: Flowise → your chatflow → Share icon → enable 'Allow Public Access'", "color:#f6ad55");
  }
});
