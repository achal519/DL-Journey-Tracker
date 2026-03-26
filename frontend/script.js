/* ============================================
   DL JOURNEY TRACKER — Core JavaScript
   Node.js + MySQL integrated version
   ============================================ */

const API_BASE = '';   // Same origin — server.js serves frontend too

/* ─── localStorage Keys ─────────────────────── */
const KEYS = {
  NAME:         'dl_name',
  AGE:          'dl_age',
  CITY:         'dl_city',
  VEHICLE:      'dl_vehicleType',   // "2W" | "4W" | "Both" | "Commercial"
  LL_NUMBER:    'dl_llNumber',
  LL_DATE:      'dl_llDate',        // "YYYY-MM-DD"
  STAGE:        'dl_currentStage',  // 1–5
  DL_OBTAINED:  'dl_dlObtained',    // "true" | "false"
  DL_NUMBER:    'dl_dlNumber',
  DL_DATE:      'dl_dlDate',
};

/* ─── Save / Load helpers ───────────────────── */
function saveUser(data) {
  Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
}

function getUser() {
  return {
    name:        localStorage.getItem(KEYS.NAME)        || '',
    age:         parseInt(localStorage.getItem(KEYS.AGE)) || 0,
    city:        localStorage.getItem(KEYS.CITY)        || '',
    vehicleType: localStorage.getItem(KEYS.VEHICLE)     || '',
    llNumber:    localStorage.getItem(KEYS.LL_NUMBER)   || '',
    llDate:      localStorage.getItem(KEYS.LL_DATE)     || '',
    currentStage:parseInt(localStorage.getItem(KEYS.STAGE)) || 1,
    dlObtained:  localStorage.getItem(KEYS.DL_OBTAINED) === 'true',
    dlNumber:    localStorage.getItem(KEYS.DL_NUMBER)   || '',
    dlDate:      localStorage.getItem(KEYS.DL_DATE)     || '',
  };
}

function isRegistered() {
  return !!(localStorage.getItem(KEYS.LL_DATE) && localStorage.getItem(KEYS.NAME));
}

/* ─── Core Date / Stage Calculations ───────────
   These mirror the C++ logic exactly:
   DeadlineCalculator + StageTracker + AlertSystem
   ─────────────────────────────────────────────── */

function calculateDaysPassed(llDateStr) {
  if (!llDateStr) return 0;
  const llDate = new Date(llDateStr);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  llDate.setHours(0, 0, 0, 0);
  return Math.floor((today - llDate) / (1000 * 60 * 60 * 24));
}

function getDaysRemaining(daysPassed) {
  return Math.max(0, 180 - daysPassed);
}

function getWaitRemaining(daysPassed) {
  return Math.max(0, 30 - daysPassed);
}

function isInWaitPeriod(daysPassed)  { return daysPassed >= 0 && daysPassed < 30; }
function isExpired(daysPassed)       { return daysPassed >= 180; }
function canApply(daysPassed)        { return daysPassed >= 30 && daysPassed < 180; }

/* StageTracker logic
   Stage 1 — LL Obtained      (always true on registration)
   Stage 2 — Waiting Period   (day 0–29)
   Stage 3 — Apply Window     (day 30–179)
   Stage 4 — Test Cleared     (user marks manually)
   Stage 5 — DL Issued        (user marks manually)
*/
function getCurrentStage(daysPassed, dlObtained) {
  if (dlObtained)              return 5;
  const saved = parseInt(localStorage.getItem(KEYS.STAGE)) || 1;
  if (saved === 4)             return 4;
  if (isExpired(daysPassed))   return 3;
  if (canApply(daysPassed))    return 3;
  if (isInWaitPeriod(daysPassed)) return 2;
  return 1;
}

/* AlertSystem logic */
function getAlertLevel(daysPassed) {
  if (isExpired(daysPassed))              return 'EXPIRED';
  const rem = getDaysRemaining(daysPassed);
  if (rem <= 10)                          return 'RED';
  if (rem <= 30)                          return 'YELLOW';
  return 'GREEN';
}

function getAlertMessage(alertLevel, daysRemaining, daysPassed) {
  switch (alertLevel) {
    case 'GREEN':
      return `You are in the safe zone. You have ${daysRemaining} days remaining to apply for your Permanent DL. Visit your nearest RTO before the window closes.`;
    case 'YELLOW':
      return `Warning! Only ${daysRemaining} days left. Start gathering your documents and schedule your RTO visit soon.`;
    case 'RED':
      return `Critical! Only ${daysRemaining} days remaining. Apply for your DL test immediately to avoid LL expiry.`;
    case 'EXPIRED':
      return `Your Learner License has expired (issued ${daysPassed} days ago). You must re-apply for a fresh LL from your nearest RTO.`;
    default:
      return '';
  }
}

/* ─── DocumentChecklist Engine ─────────────────
   Mirrors the C++ DocumentChecklist class
   ─────────────────────────────────────────────── */
const CHECKLISTS = {
  '2W': [
    { id: 'c1',  text: 'Original Learner License (LL)' },
    { id: 'c2',  text: 'Photocopy of Learner License (2 copies)' },
    { id: 'c3',  text: 'Age Proof — Aadhaar Card / Birth Certificate / 10th Marksheet' },
    { id: 'c4',  text: 'Address Proof — Aadhaar / Voter ID / Passport / Utility Bill' },
    { id: 'c5',  text: 'Form 9 — Application for Driving License (filled)' },
    { id: 'c6',  text: '2 Recent Passport-size Photographs (white background)' },
    { id: 'c7',  text: 'RTO Test Fee — ₹300 (approx, varies by state)' },
  ],
  '4W': [
    { id: 'c1',  text: 'Original Learner License (LL)' },
    { id: 'c2',  text: 'Photocopy of Learner License (2 copies)' },
    { id: 'c3',  text: 'Age Proof — Aadhaar Card / Birth Certificate / 10th Marksheet' },
    { id: 'c4',  text: 'Address Proof — Aadhaar / Voter ID / Passport / Utility Bill' },
    { id: 'c5',  text: 'Form 9 — Application for Driving License (filled)' },
    { id: 'c6',  text: '2 Recent Passport-size Photographs (white background)' },
    { id: 'c7',  text: 'RTO Test Fee — ₹300 (approx, varies by state)' },
    { id: 'c8',  text: 'Medical Certificate (Form 1A) — required if age is above 40' },
  ],
  'Both': [
    { id: 'c1',  text: 'Original Learner License (LL) — both vehicle categories' },
    { id: 'c2',  text: 'Photocopy of Learner License (2 copies each category)' },
    { id: 'c3',  text: 'Age Proof — Aadhaar Card / Birth Certificate / 10th Marksheet' },
    { id: 'c4',  text: 'Address Proof — Aadhaar / Voter ID / Passport / Utility Bill' },
    { id: 'c5',  text: 'Form 9 — Application for Driving License (filled for both)' },
    { id: 'c6',  text: '4 Recent Passport-size Photographs (white background)' },
    { id: 'c7',  text: 'RTO Test Fee — ₹600 (approx, for both categories)' },
    { id: 'c8',  text: 'Medical Certificate (Form 1A) — required if age is above 40' },
  ],
  'Commercial': [
    { id: 'c1',  text: 'Original Learner License (LL) — commercial category' },
    { id: 'c2',  text: 'Photocopy of Learner License (2 copies)' },
    { id: 'c3',  text: 'Age Proof — must be 18+ (Aadhaar / Birth Certificate)' },
    { id: 'c4',  text: 'Address Proof — Aadhaar / Voter ID / Passport' },
    { id: 'c5',  text: 'Form 9 — Application for Driving License (filled)' },
    { id: 'c6',  text: '2 Recent Passport-size Photographs (white background)' },
    { id: 'c7',  text: 'Medical Fitness Certificate (Form 1 & 1A) — mandatory' },
    { id: 'c8',  text: 'RTO Test Fee — ₹500 (approx, varies by state)' },
    { id: 'c9',  text: 'Badge Fee (if applicable) — ₹200 (approx)' },
    { id: 'c10', text: 'PSV Badge (for passenger vehicles) — if applicable' },
  ],
};

function getChecklist(vehicleType, age) {
  let items = [...(CHECKLISTS[vehicleType] || CHECKLISTS['2W'])];
  if (vehicleType === '4W' && age <= 40) {
    items = items.filter(i => i.id !== 'c8');
  }
  return items;
}

/* ─── TestGuide Engine ──────────────────────────
   Mirrors the C++ TestGuide class
   ─────────────────────────────────────────────── */
const TEST_TIPS = {
  '2W': [
    { icon: '🏍️', text: 'Practice figure-8 and straight-line riding at slow speed — RTO testers look for balance and control.' },
    { icon: '🪖', text: 'Always wear a helmet during the test — no helmet = instant disqualification.' },
    { icon: '🔑', text: 'Carry original LL and all documents — the officer will verify before the test.' },
    { icon: '⚖️', text: 'Keep both feet on footrests while riding — putting feet down unnecessarily is a negative mark.' },
    { icon: '🚦', text: 'Stop completely at the stop line — rolling stops are marked as failures.' },
    { icon: '👀', text: 'Check mirrors before every turn and signal early — inspectors check mirror usage.' },
  ],
  '4W': [
    { icon: '🚗', text: 'Practice hill start (H-point) — most 4W tests include a slope start without rolling back.' },
    { icon: '🪞', text: 'Adjust mirrors and seatbelt before starting the engine — inspectors watch this.' },
    { icon: '🅿️', text: 'Practice parallel parking and reverse parking — these are standard test components.' },
    { icon: '🚦', text: 'Come to a complete stop at all stop lines and traffic signals.' },
    { icon: '🔄', text: 'Signal before every lane change, turn, or manoeuvre during the test.' },
    { icon: '💺', text: 'Keep a safe following distance — tailgating is a disqualification reason.' },
  ],
  'Both': [
    { icon: '🏍️', text: 'You will be tested separately for 2W and 4W — know both well.' },
    { icon: '⏰', text: 'Both tests may be scheduled on the same day — reach RTO early.' },
    { icon: '🔑', text: 'Carry LL copies for both vehicle categories.' },
    { icon: '🚦', text: 'Traffic rules are the same — focus on signals, mirrors, and stopping correctly.' },
  ],
  'Commercial': [
    { icon: '🚛', text: 'Commercial license test includes vehicle safety checks — know basic vehicle inspection.' },
    { icon: '📋', text: 'Medical fitness certificate is mandatory — ensure it is valid and recently issued.' },
    { icon: '🔄', text: 'Reversing a large vehicle will be tested — practice in a large open area.' },
    { icon: '⚖️', text: 'Know load limits and road transport regulations — verbal questions may be asked.' },
    { icon: '🚦', text: 'Commercial vehicles follow stricter traffic rules — inspector expects thorough knowledge.' },
  ],
};

const FAIL_REASONS = {
  '2W': [
    'Losing balance during slow-speed manoeuvres',
    'Not wearing helmet during the test',
    'Putting feet down unnecessarily while riding',
    'Not stopping at stop lines completely',
    'Forgetting to signal before turning',
  ],
  '4W': [
    'Rolling back on slope/hill start',
    'Not adjusting mirrors before starting',
    'Incorrect parking during parallel or reverse test',
    'Tailgating or insufficient following distance',
    'Crossing the stop line at traffic signals',
  ],
  'Both': [
    'Not being prepared for both vehicle categories',
    'Forgetting documents for one of the categories',
    'Balance issues on 2W after 4W test fatigue',
  ],
  'Commercial': [
    'Invalid or missing medical fitness certificate',
    'Poor reversing skills with large vehicle',
    'Inability to answer vehicle regulation questions',
    'Missing badge fee or PSV documents',
  ],
};

const TRAFFIC_SIGNS = [
  { q: 'What does a red octagon sign mean?',              a: 'STOP — come to a complete stop' },
  { q: 'What does a single yellow line on road mean?',    a: 'No parking during specified hours' },
  { q: 'What does a white arrow in blue circle mean?',    a: 'Mandatory direction to proceed' },
  { q: 'What does a red circle with a number mean?',      a: 'Speed limit — do not exceed that speed' },
  { q: 'What does a triangular sign indicate?',           a: 'Warning / Caution ahead' },
];

/* ─── Date Formatting ───────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/* ─── API wrapper (Node.js version) ─────────────
   All calculations still done in JS (mirrors C++)
   DB is used for persistence only
   ─────────────────────────────────────────────── */

async function apiCalculate(llDate, vehicleType) {
  const daysPassed    = calculateDaysPassed(llDate);
  const daysRemaining = getDaysRemaining(daysPassed);
  const user          = getUser();
  const alertLevel    = getAlertLevel(daysPassed);
  const stage         = getCurrentStage(daysPassed, user.dlObtained);
  return {
    daysPassed,
    daysRemaining,
    waitRemaining: getWaitRemaining(daysPassed),
    alertLevel,
    alertMessage: getAlertMessage(alertLevel, daysRemaining, daysPassed),
    currentStage: stage,
    isExpired:    isExpired(daysPassed),
    canApply:     canApply(daysPassed),
    isInWait:     isInWaitPeriod(daysPassed),
  };
}

async function apiChecklist(vehicleType, age) {
  return { items: getChecklist(vehicleType, age) };
}

async function apiTestGuide(vehicleType) {
  return {
    tips:        TEST_TIPS[vehicleType]     || TEST_TIPS['2W'],
    failReasons: FAIL_REASONS[vehicleType] || FAIL_REASONS['2W'],
    signs:       TRAFFIC_SIGNS,
  };
}

/* ─── Stage label helpers ───────────────────── */
const STAGE_LABELS = [
  'LL Obtained',
  'Waiting Period',
  'Apply for DL',
  'Test Cleared',
  'DL Issued',
];

const STAGE_ICONS = ['📄', '⏳', '🏛️', '✅', '🎉'];

/* ─── Render Stage Tracker ──────────────────── */
function renderStageTracker(containerId, currentStage) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const progressPct = Math.min(((currentStage - 1) / 4) * 100, 100);

  let html = `<div class="stage-tracker">
    <div class="stage-progress-line" style="width: calc(${progressPct}% - 80px + ${progressPct === 0 ? 0 : 22}px)"></div>`;

  for (let i = 1; i <= 5; i++) {
    let cls = 'pending';
    if (i < currentStage)  cls = 'done';
    if (i === currentStage) cls = 'active';
    html += `
    <div class="stage-item ${cls}">
      <div class="stage-circle">${i < currentStage ? '✓' : STAGE_ICONS[i-1]}</div>
      <div class="stage-label">Stage ${i}<br>${STAGE_LABELS[i-1]}</div>
    </div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

/* ─── Render Alert Badge ────────────────────── */
function renderAlertBadge(containerId, alertLevel) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const labels = { GREEN: '🟢 Safe Zone', YELLOW: '🟡 Apply Soon', RED: '🔴 Apply Now!', EXPIRED: '⚫ LL Expired' };
  const cls    = alertLevel.toLowerCase();
  el.innerHTML = `<span class="alert-badge ${cls}">${labels[alertLevel] || alertLevel}</span>`;
}

/* ─── Guard — redirect if not registered ────── */
function requireRegistration() {
  if (!isRegistered()) {
    window.location.href = 'index.html';
  }
}
// 🔥 STEP 3: Fetch stage from backend (C++)
async function fetchStageFromBackend() {
  try {
    const res = await fetch('/api/cpp/stage/1'); // test with id=1
    const data = await res.json();

    console.log("Backend Data:", data);

    // Update UI
    const stageElement = document.getElementById('stage');
    if (stageElement) {
      stageElement.innerText = data.stage;
    }

    const daysElement = document.getElementById('days');
    if (daysElement) {
      daysElement.innerText = "Days Passed: " + data.days_passed;
    }

  } catch (err) {
    console.error("Error fetching stage:", err);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  fetchStageFromBackend();
});