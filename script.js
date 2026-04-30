/* ─────────────────────────────────────────────
   FLOWISE VECTOR STORE (CLEAN VERSION)
───────────────────────────────────────────── */

async function upsertVectorStore(data) {
  try {
    const response = await fetch(
      "https://cloud.flowiseai.com/api/v1/vector/upsert/8de78eb0-6750-4460-b0c6-109aeeb49dd3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();
    console.log("Vector Store Response:", result);
    return result;

  } catch (error) {
    console.error("Flowise error:", error);
  }
}

/* ─────────────────────────────────────────────
   MANUAL UPLOAD FUNCTION (CALL WHEN NEEDED)
───────────────────────────────────────────── */

function uploadToVectorStore(textContent) {
  const payload = {
    overrideConfig: {
      topK: 3,
      limit: 10,

      // IMPORTANT FIX for your earlier error
      taskType: "RETRIEVAL_DOCUMENT"
    },

    // depends on Flowise setup
    text: textContent
  };

  upsertVectorStore(payload);
}

/* ─────────────────────────────────────────────
   THEME & NAV
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
    radarChartInstance.options.scales.r.pointLabels.color =
      isDark ? "#8899aa" : "#64748b";

    radarChartInstance.options.scales.r.grid.color =
      isDark ? "rgba(99,179,237,0.15)" : "rgba(59,130,246,0.15)";

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
   DOWNLOAD FLOW FILE
───────────────────────────────────────────── */

function downloadJSON(e) {
  e.preventDefault();

  const flow = {
    nodes: [
      { id: "llm1", type: "ChatOpenAI", label: "GPT-4 LLM", position: { x: 300, y: 200 } },
      { id: "prompt1", type: "PromptTemplate", label: "System Prompt", position: { x: 100, y: 200 } },
      { id: "chain1", type: "ConversationalRetrievalQAChain", label: "QA Chain", position: { x: 500, y: 200 } },
      { id: "vs1", type: "Pinecone", label: "Vector Store", position: { x: 300, y: 400 } }
    ],
    edges: [
      { source: "prompt1", target: "chain1" },
      { source: "llm1", target: "chain1" },
      { source: "vs1", target: "chain1" }
    ],
    metadata: {
      name: "Data Analysis Assistant",
      description: "RAG-powered chatbot",
      version: "1.0.0",
      author: "Kent Clarence Mina"
    }
  };

  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(flow, null, 2)], {
      type: "application/json"
    })
  );

  a.download = "kent-flowise-flow.json";
  a.click();
}

/* ─────────────────────────────────────────────
   HOW TO USE VECTOR UPLOAD
─────────────────────────────────────────────
Example:

uploadToVectorStore("This is my document about data analysis");
-------------------------------------------------------------- */

/* ─────────────────────────────────────────────
   CHATBOT WIDGET
───────────────────────────────────────────── */

const chatState = {
  opened: false,
  greeted: false
};

function toggleChat() {
  const chatWindow = document.getElementById("chat-window");
  const trigger = document.getElementById("chat-trigger");
  const badge = document.getElementById("chat-badge");

  if (!chatWindow || !trigger) return;

  chatState.opened = !chatState.opened;
  chatWindow.classList.toggle("open", chatState.opened);
  trigger.classList.toggle("open", chatState.opened);

  if (chatState.opened) {
    if (badge) badge.style.display = "none";
    ensureGreeting();
    const input = document.getElementById("chat-input");
    if (input) input.focus();
  }
}

function sendSuggestion(btn) {
  if (!btn) return;
  const text = btn.textContent ? btn.textContent.trim() : "";
  if (!text) return;

  const input = document.getElementById("chat-input");
  if (!input) return;

  input.value = text;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  ensureGreeting();
  appendChatMessage("user", text);
  input.value = "";

  const reply = getBotReply(text);
  window.setTimeout(() => {
    appendChatMessage("bot", reply);
  }, 350);
}

function ensureGreeting() {
  if (chatState.greeted) return;
  appendChatMessage(
    "bot",
    "Hi! I am Kent's assistant. Ask me about his skills, projects, tools, or availability."
  );
  chatState.greeted = true;
}

function appendChatMessage(role, text) {
  const messages = document.getElementById("chat-messages");
  if (!messages) return;

  const bubble = document.createElement("div");
  bubble.className = role === "user" ? "msg user" : "msg bot";
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function getBotReply(message) {
  const m = message.toLowerCase();

  if (m.includes("who is kent") || m.includes("about kent")) {
    return "Kent Clarence Mina is an IT student focused on data analytics, dashboards, and AI-powered solutions.";
  }
  if (m.includes("tool") || m.includes("skills") || m.includes("use")) {
    return "He works with Excel, SQL, Python, Power BI, Tableau, Pandas, and Flowise AI.";
  }
  if (m.includes("project")) {
    return "His projects include retail sales EDA, HR analytics dashboards, COVID-19 analysis, and a student performance predictor.";
  }
  if (m.includes("hire") || m.includes("available") || m.includes("intern")) {
    return "Yes, Kent is open to internships and entry-level opportunities. You can contact him via email or LinkedIn on this page.";
  }

  return "Great question. I can help with Kent's profile, tools, projects, and availability. Try asking one of those.";
}