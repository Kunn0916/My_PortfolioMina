/* ════════════════════════════════════════════════
   Kent Clarence Mina — Portfolio Script
   Handles: theme, nav, scroll-reveal, skill bars,
            Chart.js charts, contact form, AI chatbot
════════════════════════════════════════════════ */

// ── Theme ──────────────────────────────────────
function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.querySelector('.theme-toggle').textContent = isDark ? '🌙' : '☀️';
  buildAllCharts();
}

// ── Mobile Menu ────────────────────────────────
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── Contact Form ───────────────────────────────
function submitForm() {
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const msg     = document.getElementById('msg').value.trim();

  if (!fname || !email || !msg) {
    alert('Please fill in at least your name, email, and message.');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.textContent = '✅ Message Sent!';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.innerHTML = '✈️ Send Message';
    btn.disabled = false;
    btn.style.opacity = '1';
    ['fname','lname','email','subject','msg'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }, 3000);
}

// ── Scroll Reveal ──────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Skill Bars ─────────────────────────────────
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
}

// ── CSS variable helper ────────────────────────
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ── Chart.js instances ─────────────────────────
const chartInstances = {};

function buildAllCharts() {
  buildRadarChart();
  buildProjectCharts();
}

// Radar Chart — Tools & Technologies
function buildRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;

  if (chartInstances.radar) { chartInstances.radar.destroy(); }

  const accent  = cssVar('--accent');
  const accent2 = cssVar('--accent2');
  const muted   = cssVar('--muted');
  const text    = cssVar('--text');

  chartInstances.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'Matplotlib'],
      datasets: [{
        label: 'Proficiency',
        data: [85, 88, 80, 78, 92, 83, 80],
        backgroundColor: accent + '30',
        borderColor: accent,
        pointBackgroundColor: accent2,
        pointBorderColor: '#fff',
        pointRadius: 4,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false },
          grid: { color: muted + '40' },
          angleLines: { color: muted + '40' },
          pointLabels: { color: text, font: { size: 11, family: "'JetBrains Mono', monospace" } }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// Project mini-charts
function buildProjectCharts() {
  const accent  = cssVar('--accent');
  const accent2 = cssVar('--accent2');
  const accent3 = cssVar('--accent3');
  const muted   = cssVar('--muted');
  const text    = cssVar('--text');

  // Project 1 — Retail Sales line chart
  const ctx1 = document.getElementById('proj1Chart');
  if (ctx1) {
    if (chartInstances.p1) chartInstances.p1.destroy();
    chartInstances.p1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Revenue ($K)',
          data: [42, 55, 48, 70, 65, 88, 92, 78, 95, 110, 130, 145],
          borderColor: accent,
          backgroundColor: accent + '20',
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointBackgroundColor: accent,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: muted, font: { size: 9 } }, grid: { color: muted + '25' } },
          y: { ticks: { color: muted, font: { size: 9 } }, grid: { color: muted + '25' } }
        }
      }
    });
  }

  // Project 2 — HR Attrition donut
  const ctx2 = document.getElementById('proj2Chart');
  if (ctx2) {
    if (chartInstances.p2) chartInstances.p2.destroy();
    chartInstances.p2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Retained', 'Attrited'],
        datasets: [{
          data: [84, 16],
          backgroundColor: [accent + 'cc', accent3 + 'cc'],
          borderColor: [accent, accent3],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: true, position: 'bottom', labels: { color: muted, font: { size: 10 } } }
        }
      }
    });
  }

  // Project 3 — COVID bar chart
  const ctx3 = document.getElementById('proj3Chart');
  if (ctx3) {
    if (chartInstances.p3) chartInstances.p3.destroy();
    chartInstances.p3 = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['NCR','Cebu','Davao','Laguna','Rizal','Cavite','Batangas'],
        datasets: [{
          label: 'Cases (K)',
          data: [120, 58, 45, 38, 32, 28, 22],
          backgroundColor: [
            accent + 'cc', accent2 + 'cc', accent3 + 'cc',
            accent + 'aa', accent2 + 'aa', accent3 + 'aa', accent + '88'
          ],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: muted, font: { size: 9 } }, grid: { color: 'transparent' } },
          y: { ticks: { color: muted, font: { size: 9 } }, grid: { color: muted + '25' } }
        }
      }
    });
  }

  // Project 4 — Student Performance scatter
  const ctx4 = document.getElementById('proj4Chart');
  if (ctx4) {
    if (chartInstances.p4) chartInstances.p4.destroy();

    const generatePoints = (count, cx, cy, spread) =>
      Array.from({ length: count }, () => ({
        x: +(cx + (Math.random() - 0.5) * spread).toFixed(1),
        y: +(cy + (Math.random() - 0.5) * spread).toFixed(1),
      }));

    chartInstances.p4 = new Chart(ctx4, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Pass',
            data: generatePoints(30, 75, 80, 25),
            backgroundColor: accent2 + 'cc',
            pointRadius: 4,
          },
          {
            label: 'Fail',
            data: generatePoints(15, 40, 45, 20),
            backgroundColor: accent3 + 'cc',
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { color: muted, font: { size: 10 } } }
        },
        scales: {
          x: { ticks: { color: muted, font: { size: 9 } }, grid: { color: muted + '25' }, title: { display: true, text: 'Study Hours', color: muted, font: { size: 9 } } },
          y: { ticks: { color: muted, font: { size: 9 } }, grid: { color: muted + '25' }, title: { display: true, text: 'Grade (%)', color: muted, font: { size: 9 } } }
        }
      }
    });
  }
}

// ══════════════════════════════════════════════════
//  AI CHATBOT — Powered by Flowise
// ══════════════════════════════════════════════════

const FLOWISE_URL = 'https://cloud.flowiseai.com/api/v1/prediction/8de78eb0-6750-4460-b0c6-109aeeb49dd3';

let chatHistory = [];
let isBotTyping = false;

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');

  const wrapper = document.createElement('div');
  wrapper.className = `msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';

  const col = document.createElement('div');
  col.className = 'msg-col';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = getTime();

  col.appendChild(bubble);
  col.appendChild(time);
  wrapper.appendChild(avatar);
  wrapper.appendChild(col);
  container.appendChild(wrapper);

  container.scrollTop = container.scrollHeight;
  return bubble;
}

function showTyping() {
  const container = document.getElementById('chat-messages');

  const wrapper = document.createElement('div');
  wrapper.className = 'msg bot';
  wrapper.id = 'typing-indicator';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '🤖';

  const col = document.createElement('div');
  col.className = 'msg-col';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

  col.appendChild(bubble);
  wrapper.appendChild(avatar);
  wrapper.appendChild(col);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  if (isBotTyping) return;

  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  hideSuggestions();
  hideBadge();

  appendMessage('user', text);

  isBotTyping = true;
  document.getElementById('chat-send').disabled = true;
  showTyping();

  try {
    // ✅ FIXED: Flowise only needs { question } — not Anthropic's message format
    const response = await fetch(FLOWISE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text })
    });

    const data = await response.json();
    removeTyping();

    // ✅ FIXED: Flowise returns data.text, not data.content[0].text
    const reply = data?.text ?? "Sorry, I couldn't get a response right now. Please try again!";
    appendMessage('bot', reply);

  } catch (err) {
    removeTyping();
    appendMessage('bot', "Oops — something went wrong on my end. You can reach Kent directly at rheakentmina@gmail.com 📧");
    console.error('Flowise API error:', err);
  }

  isBotTyping = false;
  document.getElementById('chat-send').disabled = false;
}

function sendSuggestion(btn) {
  document.getElementById('chat-input').value = btn.textContent;
  sendMessage();
}

function hideSuggestions() {
  const el = document.getElementById('chat-suggestions');
  if (el) el.style.display = 'none';
}

function hideBadge() {
  const badge = document.getElementById('chat-badge');
  if (badge) badge.style.display = 'none';
}

function toggleChat() {
  const trigger = document.getElementById('chat-trigger');
  const win     = document.getElementById('chat-window');
  trigger.classList.toggle('open');
  win.classList.toggle('open');
  hideBadge();

  if (win.classList.contains('open')) {
    document.getElementById('chat-input').focus();
  }
}

function initChat() {
  const container = document.getElementById('chat-messages');

  const wrapper = document.createElement('div');
  wrapper.className = 'msg bot';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = '🤖';

  const col = document.createElement('div');
  col.className = 'msg-col';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = "👋 Hi there! I'm Kent's AI assistant. Ask me anything about his skills, projects, or how to get in touch!";

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = getTime();

  col.appendChild(bubble);
  col.appendChild(time);
  wrapper.appendChild(avatar);
  wrapper.appendChild(col);
  container.appendChild(wrapper);
}

// ── Init on DOM Ready ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSkillBars();
  buildAllCharts();
  initChat();
});
