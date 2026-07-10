// ══════════ PHOENIX IT VENTURES ACADEMY — MAIN.JS ══════════

// ── Navbar scroll effect ──
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  const backTop = document.getElementById('back-top');
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
});

// ── Hamburger menu ──
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  }
  // Close if clicking outside
  if (!e.target.closest('.navbar') && menu) {
    menu.classList.remove('open');
    const hb = document.querySelector('.hamburger');
    if (hb) hb.classList.remove('open');
  }
});

// ── Fade-in IntersectionObserver ──
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseFloat(entry.target.dataset.delay || 0) * 100;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Counter animation ──
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


// ── Icon movement removed: icons stay clean and still. ──
function initScrollIconMotion() { return; }
window.initScrollIconMotion = initScrollIconMotion;

// ── Toast ──
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}


// ── Global phone number rule: only digits, exactly 10 digits ──
function sanitizePhoneValue(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}
function isValidIndianMobile(phone) {
  return /^\d{10}$/.test(String(phone || '').trim());
}
function bindPhoneInputRules(root = document) {
  const inputs = root.querySelectorAll('input[type="tel"], input[id*="phone"], input[name*="phone"], input[placeholder*="Phone"], input[placeholder*="9XXXXXXXXX"]');
  inputs.forEach(input => {
    if (!input || input.dataset.phoneRuleBound === 'true') return;
    input.dataset.phoneRuleBound = 'true';
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('maxlength', '10');
    input.setAttribute('pattern', '[0-9]{10}');
    input.setAttribute('autocomplete', input.getAttribute('autocomplete') || 'tel');
    input.addEventListener('input', () => {
      const cleaned = sanitizePhoneValue(input.value);
      if (input.value !== cleaned) input.value = cleaned;
    });
    input.addEventListener('paste', () => setTimeout(() => { input.value = sanitizePhoneValue(input.value); }, 0));
  });
}
window.sanitizePhoneValue = sanitizePhoneValue;
window.isValidIndianMobile = isValidIndianMobile;
window.bindPhoneInputRules = bindPhoneInputRules;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bindPhoneInputRules());
} else {
  bindPhoneInputRules();
}
try {
  const phoneObserver = new MutationObserver(() => bindPhoneInputRules());
  phoneObserver.observe(document.documentElement, { childList: true, subtree: true });
} catch (err) {}


// ── Lead delivery config: change these values if your WhatsApp/email changes ──
const PHOENIX_ADMIN_WHATSAPP = '919986762311';
const PHOENIX_ADMIN_EMAIL = 'info@phoenixacademys.com';

function buildLeadMessage(type, payload = {}) {
  const lines = [
    `Phoenix Website ${type}`,
    `Name: ${payload.name || '-'}`,
    `Phone: ${payload.phone || '-'}`,
    `Email: ${payload.email || '-'}`,
    `Course: ${payload.course || '-'}`,
    `Duration: ${payload.duration || '-'}`
  ];
  if (payload.date) lines.push(`Preferred Date: ${payload.date}`);
  if (payload.time) lines.push(`Preferred Time: ${payload.time}`);
  if (payload.message) lines.push(`Message: ${payload.message}`);
  lines.push(`Submitted: ${new Date().toLocaleString('en-IN')}`);
  return lines.join('\n');
}

function getWhatsAppLeadUrl(type, payload) {
  return `https://wa.me/${PHOENIX_ADMIN_WHATSAPP}?text=${encodeURIComponent(buildLeadMessage(type, payload))}`;
}

function openLeadWhatsApp(type, payload) {
  const url = getWhatsAppLeadUrl(type, payload);
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = url;
  return url;
}

function courseIconHTML(course, size = 'normal') {
  const title = String(course.title || '').toLowerCase();
  const category = String(course.category || '').toLowerCase();
  const iconMap = [
    [/python/, '/assets/course_icons/python-development.png'],
    [/java/, '/assets/course_icons/java-full-stack-development.png'],
    [/mern/, '/assets/course_icons/mern-full-stack-development.png'],
    [/full stack|web development|development/, '/assets/course_icons/full-stack-development.png'],
    [/data analytics|analytics/, '/assets/course_icons/data-analytics.png'],
    [/data science|visualisation|visualization/, '/assets/course_icons/data-science.png'],
    [/data engineering|database/, '/assets/course_icons/data-engineering.png'],
    [/cyber|security/, '/assets/course_icons/cyber-security.png'],
    [/network/, '/assets/course_icons/network-engineering.png'],
    [/devops/, '/assets/course_icons/devops-engineering.png'],
    [/machine learning|ml/, '/assets/course_icons/machine-learning.png'],
    [/artificial intelligence|\bai\b/, '/assets/course_icons/artificial-intelligence.png'],
    [/cloud/, '/assets/course_icons/cloud-computing.png'],
    [/ui\/ux|design/, '/assets/course_icons/ui-ux-design.png'],
    [/marketing|seo|ads/, '/assets/course_icons/digital-marketing.png'],
    [/testing|qa/, '/assets/course_icons/software-testing-qa.png']
  ];
  const match = iconMap.find(([regex]) => regex.test(title) || regex.test(category));
  const img = course.iconImage || (match ? match[1] : '/assets/course_icons/full-stack-development.png');
  const alt = `${course.title || 'Course'} icon`;
  return `<div class="course-icon-shell ${size === 'small' ? 'course-icon-small' : ''}"><img class="course-icon-img" src="${img}" alt="${alt}" loading="lazy"></div>`;
}



// ── Course card image renderer: uses uploaded course poster images with real clickable hotspots ──
const PHOENIX_COURSE_CARD_IMAGES = {
  'java full stack': '/assets/course_cards/java-full-stack-card.jpg',
  'python developer': '/assets/course_cards/python-developer-card.jpg',
  'digital marketing': '/assets/course_cards/digital-marketing-card.png',
  'ui/ux web developer': '/assets/course_cards/ui-ux-web-developer-card.jpg',
  'mern full stack': '/assets/course_cards/mern-full-stack-card.jpg',
};

function escapeHTMLAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeInlineJSString(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function courseCardSlug(title) {
  return 'course-' + String(title || 'course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getCourseCardImage(course) {
  const title = String(course?.title || '').toLowerCase().trim();
  return PHOENIX_COURSE_CARD_IMAGES[title] || course?.cardImage || course?.iconImage || '/assets/course_cards/full-stack-card.jpg';
}

function courseImageCardHTML(course, variant = '') {
  const title = String(course?.title || 'Course');
  const slug = courseCardSlug(title);
  const image = getCourseCardImage(course);
  const searchable = [
    title,
    course?.description || '',
    course?.duration || '',
    course?.level || '',
    ...(course?.technologies || []),
    ...(course?.highlights || [])
  ].join(' ');
  const safeTitle = escapeInlineJSString(title);
  return `
    <article class="course-art-card ${slug} ${variant ? `course-art-${variant}` : ''} fade-in" data-course-title="${escapeHTMLAttr(title)}" data-course-search="${escapeHTMLAttr(searchable)}" data-category="${escapeHTMLAttr(course?.category || '')}">
      <img class="course-art-img" src="${image}" alt="${escapeHTMLAttr(title)} course details" loading="lazy">
      <span class="sr-only">${escapeHTMLAttr(searchable)}</span>
      <button type="button" class="course-hotspot enroll-hotspot" aria-label="Enroll now for ${escapeHTMLAttr(title)}" onclick="openEnrollModal('${safeTitle}')">Enroll Now</button>
      <button type="button" class="course-hotspot buy-hotspot" aria-label="Buy course payment for ${escapeHTMLAttr(title)}" onclick="openPaymentModal('${safeTitle}')">Buy Course</button>
    </article>`;
}
window.courseImageCardHTML = courseImageCardHTML;


// ── Course booking + payment/EMI flow ──
const PHOENIX_PAYMENT_CONFIG = {
  adminWhatsApp: PHOENIX_ADMIN_WHATSAPP,
  upiId: '9986762311@upi',
  payeeName: 'Phoenix Academy',
  fee3Months: 14999,
  fee6Months: 29999,
  advancePercent: 50,
  balanceDueDays: 20
};

function formatINR(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

function getCourseFee(duration) {
  return duration === '6 Months' ? PHOENIX_PAYMENT_CONFIG.fee6Months : PHOENIX_PAYMENT_CONFIG.fee3Months;
}

function getBalanceDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + PHOENIX_PAYMENT_CONFIG.balanceDueDays);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildBookingMessage(course, slot) {
  return [
    'Phoenix Academy Course Booking',
    `Course: ${course || 'General Course'}`,
    `Session: ${slot || 'Demo Appointment Request'}`,
    'I want to book a demo appointment for this course. Please confirm the available batch details, course fee and institute guidance.',
    `Submitted: ${new Date().toLocaleString('en-IN')}`
  ].join('\n');
}

function bookCourseSession(course, slot) {
  const text = encodeURIComponent(buildBookingMessage(course, slot));
  const url = `https://wa.me/${PHOENIX_PAYMENT_CONFIG.adminWhatsApp}?text=${text}`;
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = url;
}

function ensurePaymentModal() {
  if (document.getElementById('payment-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'payment-modal';
  modal.className = 'modal-overlay payment-modal-overlay';
  modal.innerHTML = `
    <div class="modal-box payment-modal-box">
      <button type="button" onclick="closePaymentModal()" class="modal-close-clean" aria-label="Close payment request popup">✕</button>
      <div class="modal-eyebrow"><img src="/assets/icons/lightning.png" alt="" class="inline-icon">BUY COURSE</div>
      <h3 class="payment-title">Request Payment Link</h3>
      <p class="payment-note">Share your details and we will send the payment link on WhatsApp after review.</p>
      <div class="payment-course-name" id="payment-course-name"></div>

      <div class="form-group"><label class="form-label">FULL NAME *</label><input type="text" id="pay-name" class="form-input" placeholder="Your full name"></div>
      <div class="input-row">
        <div class="form-group"><label class="form-label">MOBILE NUMBER *</label><input type="tel" id="pay-phone" class="form-input" placeholder="9XXXXXXXXX"></div>
        <div class="form-group"><label class="form-label">EMAIL *</label><input type="email" id="pay-email" class="form-input" placeholder="your@email.com"></div>
      </div>

      <div class="input-row">
        <div class="form-group">
          <label class="form-label">COURSE *</label>
          <select id="pay-course" class="form-input">
            <option value="Java Full Stack">Java Full Stack</option>
            <option value="Python Developer">Python Developer</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="UI/UX Web Developer">UI/UX Web Developer</option>
            <option value="MERN Full Stack">MERN Full Stack</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">DURATION *</label>
          <select id="pay-duration" class="form-input">
            <option value="3 Months">3 Months · ₹14,999</option>
            <option value="6 Months">6 Months · ₹29,999</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">PAYMENT OPTION *</label>
        <select id="pay-type" class="form-input">
          <option value="Full Course Payment">Full Course Payment</option>
          <option value="50% Advance EMI">50% Advance EMI</option>
          <option value="Need Fee Details">Need Fee Details</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">MESSAGE / NOTES</label>
        <textarea id="pay-message" class="form-input" rows="3" placeholder="Optional notes"></textarea>
      </div>
      <input type="text" name="website" id="pay-website" style="display:none" tabindex="-1" autocomplete="off">

      <button type="button" class="btn-primary payment-wide-btn payment-icon-btn" onclick="submitPaymentRequest()"><img src="/assets/icons/whatsapp.png" alt="" class="inline-icon payment-action-icon">REQUEST PAYMENT LINK ON WHATSAPP →</button>
      <p class="payment-small-note">No direct UPI payment is initiated from the website. We will send the payment link in WhatsApp after your request is received.</p>
    </div>`;
  document.body.appendChild(modal);
  if (window.bindPhoneInputRules) window.bindPhoneInputRules(modal);
}

let selectedPaymentCourse = 'General Course';
function openPaymentModal(courseName) {
  selectedPaymentCourse = courseName || 'General Course';
  ensurePaymentModal();
  const modal = document.getElementById('payment-modal');
  const label = document.getElementById('payment-course-name');
  if (label) label.textContent = `Course: ${selectedPaymentCourse}`;
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  updatePaymentSummary();
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function getPaymentPayload() {
  const duration = document.getElementById('pay-duration')?.value || '3 Months';
  const payType = document.getElementById('pay-type')?.value || '50% Advance EMI';
  const course = document.getElementById('pay-course')?.value || selectedPaymentCourse || 'General Course';
  const total = getCourseFee(duration);
  const advance = Math.round(total * PHOENIX_PAYMENT_CONFIG.advancePercent / 100);
  const amountNow = payType === 'Full Course Payment' ? total : advance;
  const balance = payType === 'Full Course Payment' ? 0 : total - advance;
  const dueDate = payType === 'Full Course Payment' ? 'No balance due' : getBalanceDueDate();
  return {
    name: document.getElementById('pay-name')?.value?.trim() || '-',
    phone: document.getElementById('pay-phone')?.value?.trim() || '-',
    email: document.getElementById('pay-email')?.value?.trim() || '-',
    course,
    duration,
    payType,
    total,
    amountNow,
    balance,
    dueDate,
    message: document.getElementById('pay-message')?.value?.trim() || ''
  };
}

function buildPaymentMessage(status = 'Payment Link Request') {
  const p = getPaymentPayload();
  return [
    `Hi Phoenix Academy,`,
    `I want the course payment link.`,
    '',
    `Name: ${p.name}`,
    `Phone: ${p.phone}`,
    `Email: ${p.email}`,
    `Course: ${p.course}`,
    `Duration: ${p.duration}`,
    `Payment Option: ${p.payType}`,
    `Amount/Plan: ${formatINR(p.amountNow)}${p.balance > 0 ? ` · Balance: ${formatINR(p.balance)}` : ''}`,
    `Message: ${p.message || '—'}`,
    'Please send me the payment link.',
    `Submitted: ${new Date().toLocaleString('en-IN')}`
  ].join('\n');
}

function paymentWhatsAppUrl(status = 'Payment Link Request') {
  return `https://wa.me/${PHOENIX_PAYMENT_CONFIG.adminWhatsApp}?text=${encodeURIComponent(buildPaymentMessage(status))}`;
}

function validatePaymentBasics() {
  const phone = document.getElementById('pay-phone')?.value?.trim();
  const name = document.getElementById('pay-name')?.value?.trim();
  const email = document.getElementById('pay-email')?.value?.trim();
  const website = document.getElementById('pay-website')?.value?.trim();
  if (website) {
    showToast('Spam detected.', 'error');
    return false;
  }
  if (!name || !phone || !email) {
    showToast('Please enter name, mobile number, and email.', 'error');
    return false;
  }
  if (!isValidIndianMobile(phone)) {
    showToast('Phone number must be exactly 10 digits.', 'error');
    return false;
  }
  return true;
}

async function submitPaymentRequest() {
  if (!validatePaymentBasics()) return;
  const p = getPaymentPayload();
  const btn = document.querySelector('#payment-modal .btn-primary');
  if (btn) { btn.disabled = true; btn.innerHTML = 'SENDING...'; }
  try {
    const res = await fetch('/api/main-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment', name: p.name, phone: p.phone, email: p.email, course: p.course, duration: p.duration, paymentType: p.payType, amount: `${formatINR(p.amountNow)}${p.balance > 0 ? ` / Balance ${formatINR(p.balance)}` : ''}`, message: p.message, sourcePage: window.location.pathname || '/', website: document.getElementById('pay-website')?.value || '' })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Unable to save request');
    const url = paymentWhatsAppUrl('Payment Link Request');
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
    closePaymentModal();
    showToast('Payment request saved and WhatsApp opened. ✅', 'success');
  } catch (err) {
    const url = paymentWhatsAppUrl('Payment Link Request');
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
    showToast('Payment request opened in WhatsApp. ✅', 'success');
  }
  if (btn) { btn.disabled = false; btn.innerHTML = '<img src="/assets/icons/whatsapp.png" alt="" class="inline-icon payment-action-icon">REQUEST PAYMENT LINK ON WHATSAPP →'; }
}

window.bookCourseSession = bookCourseSession;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.submitPaymentRequest = submitPaymentRequest;

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'payment-modal') closePaymentModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('payment-modal')?.classList.contains('open')) closePaymentModal();
});

// ── Enroll Modal ──
let enrollCourse = '';

function getEnrollModalHTML() {
  return `
  <div class="modal-box enroll-modal-box" role="document">
    <button onclick="closeModal()" class="modal-close-clean" type="button" aria-label="Close enrollment popup">×</button>
    <div class="modal-eyebrow enroll-eyebrow"><img src="/assets/icons/lightning.png" alt="" class="inline-icon enroll-action-icon">ENROLL NOW</div>
    <h3 class="enroll-modal-title">Reserve Your Seat</h3>
    <div id="modal-course-name" class="enroll-course-name">Course: Java Full Stack</div>

    <div class="form-group enroll-fullname-group">
      <label class="form-label">FULL NAME *</label>
      <input type="text" id="enroll-name" class="form-input" placeholder="Your full name" autocomplete="name">
    </div>
    <input type="text" name="website" id="enroll-website" style="display:none" tabindex="-1" autocomplete="off">

    <div class="input-row enroll-input-row">
      <div class="form-group">
        <label class="form-label">EMAIL *</label>
        <input type="email" id="enroll-email" class="form-input" placeholder="your@email.com" autocomplete="email">
      </div>
      <div class="form-group">
        <label class="form-label">PHONE *</label>
        <input type="tel" id="enroll-phone" class="form-input" placeholder="9XXXXXXXXX" autocomplete="tel" inputmode="tel">
      </div>
    </div>

    <div class="form-group enroll-duration-group">
      <label class="form-label">COURSE DURATION *</label>
      <div class="enroll-duration-grid">
        <label id="dur-3m-label" class="duration-choice-card" role="button" tabindex="0">
          <img src="/assets/icons/timer.png" alt="" class="duration-icon enroll-action-icon"> <span>3 MONTHS · ₹14,999</span>
        </label>
        <label id="dur-6m-label" class="duration-choice-card" role="button" tabindex="0">
          <img src="/assets/icons/calendar-check.png" alt="" class="duration-icon enroll-action-icon"> <span>6 MONTHS · ₹29,999</span>
        </label>
      </div>
      <input type="hidden" id="enroll-duration" value="">
    </div>

    <button onclick="submitEnroll()" class="btn-primary enroll-submit-btn" id="enroll-btn" type="button"><img src="/assets/icons/send.png" alt="" class="inline-icon enroll-action-icon">CONFIRM ENROLLMENT →</button>
    <div class="enroll-helper-text">Our counsellor will call within 2 hours to confirm your seat.</div>

    <div class="enroll-quick-actions" aria-label="Quick contact actions">
      <a href="https://wa.me/919986762311?text=Hi%20Phoenix%20Academy%2C%20I%20want%20to%20apply%20for%20a%20course." target="_blank" rel="noopener" class="enroll-quick-action whatsapp"><img src="/assets/icons/whatsapp.png" alt="">WhatsApp</a>
      <a href="tel:+919986762311" class="enroll-quick-action call"><img src="/assets/icons/phone-call.png" alt="">Call</a>
      <button type="button" class="enroll-quick-action payment" onclick="closeModal();openPaymentModal(enrollCourse || 'Java Full Stack')"><img src="/assets/icons/wallet.png" alt="">Payment</button>
    </div>
  </div>`;
}

function ensureEnrollModal() {
  let modal = document.getElementById('enroll-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'enroll-modal';
    document.body.appendChild(modal);
  }
  modal.className = 'modal-overlay enroll-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Phoenix Academy enrollment form');
  if (modal.dataset.enrollUiVersion !== 'seat-popup-v2') {
    modal.innerHTML = getEnrollModalHTML();
    modal.dataset.enrollUiVersion = 'seat-popup-v2';
    if (window.bindPhoneInputRules) window.bindPhoneInputRules(modal);
  }
  const l3 = modal.querySelector('#dur-3m-label');
  const l6 = modal.querySelector('#dur-6m-label');
  if (l3 && !l3.dataset.bound) {
    l3.dataset.bound = 'true';
    l3.addEventListener('click', () => applyEnrollDurationChoice('3 Months'));
    l3.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyEnrollDurationChoice('3 Months'); } });
  }
  if (l6 && !l6.dataset.bound) {
    l6.dataset.bound = 'true';
    l6.addEventListener('click', () => applyEnrollDurationChoice('6 Months'));
    l6.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyEnrollDurationChoice('6 Months'); } });
  }
  return modal;
}

function openEnrollModal(courseName = 'Java Full Stack') {
  enrollCourse = courseName || 'Java Full Stack';
  const modal = ensureEnrollModal();
  const label = document.getElementById('modal-course-name');
  if (label) label.textContent = enrollCourse ? `Course: ${enrollCourse}` : 'Course: Java Full Stack';
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('enroll-name')?.focus(), 120);
}
function closeModal() {
  const modal = document.getElementById('enroll-modal');
  if (modal) modal.classList.remove('open');
  const wrap = document.querySelector('.phoenix-apply-tab-wrap');
  if (wrap) { wrap.classList.remove('apply-tab-center'); wrap.dataset.animating = 'false'; }
  document.body.style.overflow = '';
}
// Close modal on overlay click
if (!window.__phoenixEnrollOverlayClickBound) {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'enroll-modal') closeModal();
  });
  window.__phoenixEnrollOverlayClickBound = true;
}
// Close modal on Escape
if (!window.__phoenixEnrollEscapeBound) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  window.__phoenixEnrollEscapeBound = true;
}

// ── Submit Enrollment ──
async function submitEnroll() {
  const name = document.getElementById('enroll-name')?.value?.trim();
  const email = document.getElementById('enroll-email')?.value?.trim();
  const phone = document.getElementById('enroll-phone')?.value?.trim();
  const duration = document.getElementById('enroll-duration')?.value || '';
  const course = enrollCourse || document.getElementById('modal-course-name')?.textContent?.replace('Course:', '').trim() || 'Java Full Stack';
  const website = document.getElementById('enroll-website')?.value?.trim() || '';

  if (website) { showToast('Spam detected.', 'error'); return; }
  if (!name || !email || !phone) { showToast('Please fill all required fields.', 'error'); return; }
  if (!isValidIndianMobile(phone)) { showToast('Phone number must be exactly 10 digits.', 'error'); return; }
  if (!duration) { showToast('Please select course duration: 3 Months or 6 Months.', 'error'); return; }

  const payload = { type: 'enroll', name, email, phone, course, duration, sourcePage: window.location.pathname || '/', website };
  const btn = document.getElementById('enroll-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = 'SENDING...'; }

  try {
    const res = await fetch('/api/main-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      openLeadWhatsApp('Enrollment Request', payload);
      closeModal();
      showToast('Enrollment sent to email + WhatsApp. ✅', 'success');
      ['enroll-name','enroll-email','enroll-phone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const durEl = document.getElementById('enroll-duration');
      if (durEl) durEl.value = '';
      const l3 = document.getElementById('dur-3m-label');
      const l6 = document.getElementById('dur-6m-label');
      if (l3) l3.classList.remove('selected');
      if (l6) l6.classList.remove('selected');
    } else {
      showToast(data.message || 'Error. Please try again.', 'error');
    }
  } catch (e) {
    openLeadWhatsApp('Enrollment Request', payload);
    closeModal();
    showToast('Network issue, but WhatsApp message opened. ✅', 'success');
  }

  if (btn) { btn.disabled = false; btn.innerHTML = '<img src="/assets/icons/send.png" alt="" class="inline-icon enroll-action-icon">CONFIRM ENROLLMENT →'; }
}

// ── Back to top ──
const backTopBtn = document.getElementById('back-top');
if (backTopBtn) {
  backTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Course duration selector used by every enroll modal ──
function applyEnrollDurationChoice(val) {
  const dur = document.getElementById('enroll-duration');
  if (dur) dur.value = val;
  const l3 = document.getElementById('dur-3m-label');
  const l6 = document.getElementById('dur-6m-label');
  if (!l3 || !l6) return;
  l3.classList.toggle('selected', val === '3 Months');
  l6.classList.toggle('selected', val === '6 Months');
  l3.style.border = val === '3 Months' ? '2px solid #ff6500' : '2px solid #d9dee7';
  l3.style.background = val === '3 Months' ? '#fff4ec' : '#fff';
  l3.style.color = '#111827';
  l6.style.border = val === '6 Months' ? '2px solid #ff6500' : '2px solid #d9dee7';
  l6.style.background = val === '6 Months' ? '#fff4ec' : '#fff';
  l6.style.color = '#111827';
}
function selectDuration(val) {
  applyEnrollDurationChoice(val);
}
window.applyEnrollDurationChoice = applyEnrollDurationChoice;
window.selectDuration = selectDuration;
window.openEnrollModal = openEnrollModal;
window.closeModal = closeModal;
window.submitEnroll = submitEnroll;


// ── Global Apply Now side tab (no automatic popup ads) ──
function ensureApplyNowUX() {
  document.getElementById('enroll-ad-popup')?.remove();
  if (!document.getElementById('phoenix-apply-tab')) {
    const tab = document.createElement('div');
    tab.className = 'phoenix-apply-tab-wrap';
    tab.innerHTML = `<button id="phoenix-apply-tab" class="phoenix-apply-tab" type="button" aria-label="Apply now"><span>Apply Now</span></button>`;
    document.body.appendChild(tab);
  }
  const tabButton = document.getElementById('phoenix-apply-tab');
  if (tabButton && !tabButton.dataset.mobileBound) {
    tabButton.dataset.mobileBound = 'true';
    tabButton.addEventListener('click', triggerApplyNowPopup);
  }
  schedulePhoenixAutoEnrollPopup();
}

function shouldShowPhoenixAutoEnrollPopup() {
  const path = (window.location.pathname || '').toLowerCase();
  if (path.includes('/enroll') || path.includes('/thank-you') || path.includes('/privacy') || path.includes('/terms')) return false;
  if (document.getElementById('phoenix-mobile-modal')?.classList.contains('open')) return false;
  return true;
}

function schedulePhoenixAutoEnrollPopup() {
  if (window.__phoenixAutoEnrollPopupScheduled) return;
  window.__phoenixAutoEnrollPopupScheduled = true;
  window.setTimeout(() => {
    try {
      if (!shouldShowPhoenixAutoEnrollPopup()) return;
      openPhoenixMobileModal('booking', 'Java Full Stack');
    } catch (err) {
      console.warn('Phoenix auto enroll popup skipped', err);
    }
  }, 6000);
}

function triggerApplyNowPopup() {
  if (typeof openPhoenixMobileModal === 'function') return openPhoenixMobileModal('booking', 'Java Full Stack');
  if (typeof openEnrollForm === 'function') return openEnrollForm('General Course');
  window.location.href = '/enroll';
  return false;
}
window.triggerApplyNowPopup = triggerApplyNowPopup;

function showEnrollAdPopup() {
  document.getElementById('enroll-ad-popup')?.remove();
  return false;
}

function hideEnrollAdPopup() {
  document.getElementById('enroll-ad-popup')?.remove();
  if (typeof closePhoenixMobileModal === 'function') closePhoenixMobileModal();
}

window.ensureEnrollModal = window.ensureEnrollModal || function(){ return null; };
window.showEnrollAdPopup = showEnrollAdPopup;
window.hideEnrollAdPopup = hideEnrollAdPopup;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureApplyNowUX);
} else {
  ensureApplyNowUX();
}

// ── Phoenix Parrot Website Guide Agent ──
function initPhoenixAgent() {
  const widget = document.getElementById('phoenix-agent');
  const toggle = document.getElementById('phoenix-agent-toggle');
  const closeBtn = document.getElementById('phoenix-agent-close');
  const form = document.getElementById('phoenix-agent-form');
  const input = document.getElementById('phoenix-agent-input');
  const messages = document.getElementById('phoenix-agent-messages');
  if (!widget || !toggle || !messages) return;

  const courses = [
    { title: 'Java Full Stack', icon: '/assets/course_icons/java-full-stack-development.png', group: 'coding', note: 'Java + Spring Boot path' },
    { title: 'Python Developer', icon: '/assets/course_icons/python-development.png', group: 'coding', note: 'Python backend path' },
    { title: 'Digital Marketing', icon: '/assets/course_icons/digital-marketing.png', group: 'marketing', note: 'SEO, ads and leads' },
    { title: 'UI/UX Web Developer', icon: '/assets/course_icons/ui-ux-design.png', group: 'design', note: 'Figma + web UI' },
    { title: 'MERN Full Stack', icon: '/assets/course_icons/mern-full-stack-development.png', group: 'coding', note: 'React + Node career path' }
  ];

  const escapeHTML = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function scrollDown() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(role, html) {
    const msg = document.createElement('div');
    msg.className = `agent-msg ${role}`;
    msg.innerHTML = html;
    messages.appendChild(msg);
    if (window.initScrollIconMotion) window.initScrollIconMotion(msg);
    scrollDown();
  }

  function actionLinks(courseName = '') {
    const enrollTarget = courseName || 'General Course';
    const enrollAttr = ` data-enroll-course="${escapeHTML(enrollTarget)}"`;
    return `
      <div class="agent-actions">
        <a class="agent-action-link" href="/courses">View Courses</a>
        <a class="agent-action-link secondary" href="/demo">Book Free Demo</a>
        <button type="button" class="agent-action-link secondary"${enrollAttr}>Enroll Now</button>
        <a class="agent-action-link secondary" href="https://wa.me/919986762311?text=Hi%20Phoenix%20Academy%2C%20I%20need%20course%20support" target="_blank" rel="noopener">WhatsApp</a>
      </div>`;
  }

  function courseGrid(list) {
    return `
      <div class="agent-course-grid">
        ${list.map(c => `
          <button type="button" class="agent-course-btn" data-agent-course="${escapeHTML(c.title)}">
            <img src="${c.icon}" alt="${escapeHTML(c.title)} icon">
            <span>${escapeHTML(c.title)}<br><small style="font-weight:600;color:#64748b">${escapeHTML(c.note)}</small></span>
          </button>`).join('')}
      </div>`;
  }

  function answer(action) {
    switch (action) {
      case 'use':
        addMessage('bot', `Use the menu to visit pages. Courses shows all programs. Enroll opens the official form. Demo opens booking. WhatsApp is available for fast support.${actionLinks()}`);
        break;
      case 'courses':
        addMessage('bot', `Phoenix Academy courses: Java Full Stack, Python Developer, Digital Marketing, UI/UX Web Developer, and MERN Full Stack. Tap a course to continue.${courseGrid(courses.slice(0, 10))}${actionLinks()}`);
        break;
      case 'choose':
        addMessage('bot', `Tell me your interest. Choose one: Coding, Design, or Marketing.`);
        addMessage('bot', `<div class="agent-quick">
          <button class="agent-chip" type="button" data-agent-action="coding">Coding</button>
          <button class="agent-chip" type="button" data-agent-action="design">Design</button>
          <button class="agent-chip" type="button" data-agent-action="marketing">Marketing</button>
        </div>`);
        break;
      case 'benefits':
        addMessage('bot', `Benefits: practical training, real projects, mentor support, portfolio help, interview prep, placement assistance, and WhatsApp counselling.${actionLinks()}`);
        break;
      case 'enroll':
        addMessage('bot', `Enrollment: choose a course, open Enroll Form, submit details, and the admissions team will contact you.${actionLinks('Java Full Stack')}`);
        break;
      case 'support':
        addMessage('bot', `Support: call +91 99867 62311, WhatsApp the counsellor, use Contact, or book a Free Demo.${actionLinks()}`);
        break;
      case 'fees':
        addMessage('bot', `Course duration options are 3 Months and 6 Months. Fees are shown inside the Enroll / Buy Course payment box. For updated discounts, batch timings, and EMI/payment support, send a message through Contact or WhatsApp the admissions team.${actionLinks()}`);
        break;
      default: {
        const groupList = courses.filter(c => c.group === action);
        if (groupList.length) {
          const groupNames = {
            coding: 'Coding / Development', design: 'UI/UX Web Developer', marketing: 'Digital Marketing'
          };
          addMessage('bot', `For ${groupNames[action] || 'this path'}, these courses are a strong fit. Tap any course to start enrollment.${courseGrid(groupList)}${actionLinks(groupList[0].title)}`);
        } else {
          addMessage('bot', `I can help with courses, enrollment, demo booking, and support. Ask about a course or click an option below.${actionLinks()}`);
        }
      }
    }
  }


  let parrotWelcomeAudio = null;
  let parrotSoundLocked = false;

  function playParrotWelcomeSound() {
    try {
      if (parrotSoundLocked) return;
      parrotSoundLocked = true;

      if (!parrotWelcomeAudio) {
        parrotWelcomeAudio = new Audio('/assets/audio/parrot-nice-to-meet-you.wav?v=phoenix-nice-only-2');
        parrotWelcomeAudio.volume = 0.92;
        parrotWelcomeAudio.preload = 'auto';
      }

      const unlockAfterFinish = () => {
        window.setTimeout(() => {
          parrotSoundLocked = false;
        }, 900);
      };

      parrotWelcomeAudio.onended = unlockAfterFinish;
      parrotWelcomeAudio.onerror = unlockAfterFinish;
      parrotWelcomeAudio.currentTime = 0;

      const playPromise = parrotWelcomeAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          parrotSoundLocked = false;
        });
      }
    } catch (err) {
      parrotSoundLocked = false;
    }
  }

  function routeQuestion(text) {
    const q = text.toLowerCase();
    if (q.includes('enroll') || q.includes('admission') || q.includes('join')) return 'enroll';
    if (q.includes('demo') || q.includes('trial')) return 'use';
    if (q.includes('support') || q.includes('contact') || q.includes('message') || q.includes('whatsapp') || q.includes('call')) return 'support';
    if (q.includes('benefit') || q.includes('placement') || q.includes('job') || q.includes('certificate')) return 'benefits';
    if (q.includes('fee') || q.includes('price') || q.includes('cost') || q.includes('duration') || q.includes('month')) return 'fees';
    if (q.includes('course') || q.includes('program') || q.includes('class')) return 'courses';
    if (q.includes('data') || q.includes('analytics') || q.includes('science') || q.includes('ai') || q.includes('artificial') || q.includes('machine') || q.includes('ml')) return 'courses';
    if (q.includes('design') || q.includes('ui') || q.includes('ux')) return 'design';
    if (q.includes('test') || q.includes('qa') || q.includes('cloud') || q.includes('devops') || q.includes('aws') || q.includes('security') || q.includes('cyber') || q.includes('network')) return 'courses';
    if (q.includes('marketing') || q.includes('seo') || q.includes('ads')) return 'marketing';
    if (q.includes('code') || q.includes('full stack') || q.includes('mern') || q.includes('python') || q.includes('java') || q.includes('web')) return 'coding';
    if (q.includes('use') || q.includes('website') || q.includes('help')) return 'use';
    return 'fallback';
  }

  toggle.addEventListener('click', () => {
    const willOpen = !widget.classList.contains('open');
    widget.classList.toggle('open');
    if (willOpen) playParrotWelcomeSound();
    widget.classList.add('sound-clicked');
    setTimeout(() => widget.classList.remove('sound-clicked'), 450);
    if (widget.classList.contains('open') && input) setTimeout(() => input.focus(), 150);
  });
  if (closeBtn) closeBtn.addEventListener('click', () => widget.classList.remove('open'));

  messages.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-agent-action]');
    if (chip) {
      const action = chip.getAttribute('data-agent-action');
      addMessage('user', escapeHTML(chip.textContent.trim()));
      answer(action);
      return;
    }
    const courseBtn = e.target.closest('[data-agent-course]');
    if (courseBtn) {
      const course = courseBtn.getAttribute('data-agent-course');
      addMessage('user', escapeHTML(course));
      addMessage('bot', `Great choice. ${escapeHTML(course)} has 3-month and 6-month paths. Click Enroll, Buy Course, or Demo.${actionLinks(course)}`);
      return;
    }
    const enrollBtn = e.target.closest('[data-enroll-course]');
    if (enrollBtn) {
      const course = enrollBtn.getAttribute('data-enroll-course') || 'General Course';
      widget.classList.remove('open');
      openEnrollModal(course);
    }
  });

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      addMessage('user', escapeHTML(value));
      input.value = '';
      answer(routeQuestion(value));
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPhoenixAgent);
} else {
  initPhoenixAgent();
}

// ═════════════════════════════════════════════════════════════
// FINAL PROFESSIONAL PATCH — uploaded reference course cards + Google Form enroll
// ═════════════════════════════════════════════════════════════
var PHOENIX_ENROLL_FORM_URL = 'https://forms.gle/CQDJFCVW4WedRH5b9';
var PHOENIX_DISPLAY_PHONE = '+91 99867 62311';
var PHOENIX_DISPLAY_EMAIL = 'info@phoenixacademys.com';

function sortPhoenixCourses(list) {
  const order = ['java full stack','mern full stack','ui/ux web developer','python developer','full stack','digital marketing'];
  return [...(list || [])].sort((a, b) => {
    const ai = order.indexOf(String(a?.title || '').toLowerCase());
    const bi = order.indexOf(String(b?.title || '').toLowerCase());
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
window.sortPhoenixCourses = sortPhoenixCourses;

function courseHeaderImage(title) {
  const key = String(title || '').toLowerCase().trim();
  const map = {
    'java full stack': '/assets/course_headers/java-full-stack-header.jpg',
    'mern full stack': '/assets/course_headers/mern-full-stack-header.jpg',
    'ui/ux web developer': '/assets/course_headers/ui-ux-web-developer-header.jpg',
    'python developer': '/assets/course_headers/python-developer-header.jpg',
    'full stack': '/assets/course_headers/full-stack-header.jpg',
    'digital marketing': '/assets/course_headers/digital-marketing-header.jpg'
  };
  return map[key] || '/assets/course_headers/full-stack-header.jpg';
}

function courseTechIcon(label) {
  const t = String(label || '').toLowerCase();
  const map = [
    [/python|django|flask/, '/assets/icons/code-python.png'],
    [/java|spring|javascript|react|node|express|html|css|tailwind|mern|rest|api|jwt|github|oop/, '/assets/icons/code.png'],
    [/mongodb|mysql|sql|database/, '/assets/icons/database.png'],
    [/figma|wireframe|prototype|portfolio|ui|ux/, '/assets/icons/gallery.png'],
    [/seo|google|meta|ads|analytics|content|lead|marketing/, '/assets/icons/trending-up.png'],
    [/git/, '/assets/icons/share.png']
  ];
  for (const [regex, icon] of map) if (regex.test(t)) return icon;
  return '/assets/icons/tag.png';
}

function courseMetaIcon(type) {
  return type === 'level' ? '/assets/icons/user.png' : '/assets/icons/clock.png';
}

function openEnrollForm(courseName) {
  const course = String(courseName || '').trim();
  if (window.showToast) showToast('Opening Phoenix Academy enroll form...', 'success');
  const win = window.open(PHOENIX_ENROLL_FORM_URL, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = PHOENIX_ENROLL_FORM_URL;
  return false;
}
window.openEnrollForm = openEnrollForm;

function courseImageCardHTML(course, variant = '') {
  const title = String(course?.title || 'Course');
  const slug = courseCardSlug(title);
  const safeTitle = escapeInlineJSString(title);
  const technologies = (course?.technologies || []).slice(0, 7);
  const highlights = (course?.highlights || []).slice(0, 4);
  const searchable = [title, course?.description || '', course?.duration || '', course?.level || '', ...technologies, ...highlights].join(' ');
  return `
    <article class="course-art-card course-sim-card ${slug} ${variant ? `course-sim-${variant}` : ''} fade-in" data-course-title="${escapeHTMLAttr(title)}" data-course-search="${escapeHTMLAttr(searchable)}" data-category="${escapeHTMLAttr(course?.category || '')}">
      <div class="course-sim-header"><img src="${courseHeaderImage(title)}" alt="${escapeHTMLAttr(title)} course header" loading="lazy"></div>
      <div class="course-sim-body">
        <h3 class="course-sim-title">${escapeHTMLAttr(title)}</h3>
        <p class="course-sim-desc">${escapeHTMLAttr(course?.description || '')}</p>
        <div class="course-sim-meta" aria-label="Course duration and level">
          <span><img class="course-sim-icon" src="${courseMetaIcon('duration')}" alt="">${escapeHTMLAttr(course?.duration || '3 Months / 6 Months')}</span>
          <i class="course-sim-dotline" aria-hidden="true"></i>
          <span><img class="course-sim-icon" src="${courseMetaIcon('level')}" alt="">${escapeHTMLAttr(course?.level || 'Beginner → Advanced')}</span>
        </div>
        <div class="course-sim-tech" aria-label="Course technologies">
          ${technologies.map(t => `<span class="course-sim-pill"><img src="${courseTechIcon(t)}" alt="">${escapeHTMLAttr(t)}</span>`).join('')}
        </div>
        <div class="course-sim-highlights">
          <h4>Course Highlights</h4>
          <div class="course-sim-highlight-grid">
            ${highlights.map(h => `<span class="course-sim-highlight"><b class="course-sim-check">✓</b>${escapeHTMLAttr(h)}</span>`).join('')}
          </div>
        </div>
        <div class="course-sim-actions">
          <button type="button" class="course-sim-btn course-sim-btn-outline" aria-label="Open enroll form for ${escapeHTMLAttr(title)}" onclick="openEnrollForm('${safeTitle}')">ENROLL NOW <img src="/assets/icons/arrow-right.png" alt=""></button>
          <button type="button" class="course-sim-btn course-sim-btn-primary" aria-label="Buy ${escapeHTMLAttr(title)} course" onclick="openPaymentModal('${safeTitle}')">BUY COURSE <img src="/assets/icons/arrow-right.png" alt=""></button>
        </div>
      </div>
    </article>`;
}
window.courseImageCardHTML = courseImageCardHTML;

function getEnrollModalHTML() {
  return `
  <div class="modal-box enroll-link-modal-box" role="document">
    <button onclick="closeModal()" class="modal-close-clean" type="button" aria-label="Close enrollment popup">×</button>
    <div class="enroll-link-hero">
      <div class="modal-eyebrow enroll-eyebrow"><img src="/assets/icons/lightning.png" alt="" class="inline-icon enroll-action-icon">ADMISSIONS OPEN</div>
      <h3 class="enroll-link-title">Apply to Phoenix Academy</h3>
      <p class="enroll-link-sub">Open the official enrollment form, fill your details, and our counsellor will contact you for course guidance.</p>
    </div>
    <div class="enroll-link-body">
      <div id="modal-course-name" class="enroll-link-course">Course: Java Full Stack</div>
      <div class="enroll-link-contact">
        <a href="tel:+919986762311"><img src="/assets/icons/phone-call.png" alt="">+91 99867 62311</a>
        <a href="mailto:info@phoenixacademys.com"><img src="/assets/icons/mail.png" alt="">info@phoenixacademys.com</a>
      </div>
      <button type="button" class="enroll-google-btn" onclick="openEnrollForm(enrollCourse || 'General Course')"><img src="/assets/icons/external-link.png" alt="" class="inline-icon">OPEN ENROLL FORM</button>
      <p class="enroll-link-note">Works clearly on mobile and desktop. The form opens in a new tab so students can fill it without losing this website page.</p>
    </div>
  </div>`;
}

function ensureEnrollModal() {
  let modal = document.getElementById('enroll-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'enroll-modal';
    document.body.appendChild(modal);
  }
  modal.className = 'modal-overlay enroll-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Phoenix Academy enrollment form link');
  if (modal.dataset.enrollUiVersion !== 'google-form-v3') {
    modal.innerHTML = getEnrollModalHTML();
    modal.dataset.enrollUiVersion = 'google-form-v3';
  }
  return modal;
}
window.ensureEnrollModal = ensureEnrollModal;

function openEnrollModal(courseName = 'Java Full Stack') {
  enrollCourse = courseName || 'Java Full Stack';
  return openEnrollForm(enrollCourse);
}
window.openEnrollModal = openEnrollModal;

function showEnrollAdPopup(courseName = 'Java Full Stack') {
  enrollCourse = courseName || 'Java Full Stack';
  const modal = ensureEnrollModal();
  const label = document.getElementById('modal-course-name');
  if (label) label.textContent = enrollCourse ? `Course: ${enrollCourse}` : 'Course: Java Full Stack';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.showEnrollAdPopup = showEnrollAdPopup;

function triggerApplyNowPopup() {
  return openEnrollForm('Java Full Stack');
}
window.triggerApplyNowPopup = triggerApplyNowPopup;

function submitEnroll() {
  return openEnrollForm(enrollCourse || 'General Course');
}
window.submitEnroll = submitEnroll;


// ══════════ FINAL USER PATCH — full-image cards, booking popup, apply page redirect ══════════
function courseImageCardHTML(course, variant = '') {
  const title = String(course?.title || 'Course');
  if (title.toLowerCase().trim() === 'full stack') return '';
  const slug = courseCardSlug(title);
  const image = getCourseCardImage(course);
  const safeTitle = escapeInlineJSString(title);
  const searchable = [title, course?.description || '', course?.duration || '', course?.level || '', ...(course?.technologies || []), ...(course?.highlights || [])].join(' ');
  return `
    <article class="course-art-card ${slug} ${variant ? `course-art-${variant}` : ''} fade-in" data-course-title="${escapeHTMLAttr(title)}" data-course-search="${escapeHTMLAttr(searchable)}" data-category="${escapeHTMLAttr(course?.category || '')}">
      <img class="course-art-img" src="${image}" alt="${escapeHTMLAttr(title)} course full details" loading="lazy">
      <span class="sr-only">${escapeHTMLAttr(searchable)}</span>
      <button type="button" class="course-hotspot enroll-hotspot" aria-label="Enroll now for ${escapeHTMLAttr(title)}" onclick="openEnrollForm('${safeTitle}')">Enroll Now</button>
      <button type="button" class="course-hotspot buy-hotspot" aria-label="Buy course payment for ${escapeHTMLAttr(title)}" onclick="openPaymentModal('${safeTitle}')">Buy Course</button>
    </article>`;
}
window.courseImageCardHTML = courseImageCardHTML;

function getEnrollModalHTML() {
  return `
  <div class="modal-box enroll-link-modal-box" role="document">
    <button onclick="closeModal()" class="modal-close-clean" type="button" aria-label="Close booking popup">×</button>
    <div class="enroll-link-hero enroll-mobile-hero">
      <img class="enroll-popup-phone" src="/assets/icons/popup-mobile-phone.jpg" alt="Mobile booking notification">
      <div class="modal-eyebrow enroll-eyebrow"><img src="/assets/icons/notification.png" alt="" class="inline-icon enroll-action-icon">BOOKING OPEN</div>
      <h3 class="enroll-link-title">Book Your Course Demo</h3>
      <p class="enroll-link-sub">Choose enrolment or free demo booking. The enrolment button opens the official form; demo booking opens the WhatsApp booking page.</p>
    </div>
    <div class="enroll-link-body">
      <div id="modal-course-name" class="enroll-link-course">Course: Java Full Stack</div>
      <div class="enroll-link-contact">
        <a href="tel:+919986762311"><img src="/assets/icons/phone-call.png" alt="">+91 99867 62311</a>
        <a href="mailto:info@phoenixacademys.com"><img src="/assets/icons/mail.png" alt="">info@phoenixacademys.com</a>
      </div>
      <button type="button" class="enroll-google-btn" onclick="openEnrollForm(enrollCourse || 'General Course')"><img src="/assets/icons/external-link.png" alt="" class="inline-icon">ENROLL FORM</button>
      <button type="button" class="enroll-booking-btn" onclick="window.location.href='/demo'"><img src="/assets/icons/calendar-check.png" alt="" class="inline-icon">BOOK FREE DEMO</button>
      <p class="enroll-link-note">Clear mobile-size notification popup. Enrolment opens the official form; Buy Course keeps the old payment request form.</p>
    </div>
  </div>`;
}

function openEnrollModal(courseName = 'Java Full Stack') {
  enrollCourse = courseName || 'Java Full Stack';
  return openEnrollForm(enrollCourse);
}
window.openEnrollModal = openEnrollModal;

function triggerApplyNowPopup() {
  window.location.href = '/apply';
  return false;
}
window.triggerApplyNowPopup = triggerApplyNowPopup;

function showEnrollAdPopup(courseName = 'Java Full Stack') {
  enrollCourse = courseName || 'Java Full Stack';
  const modal = ensureEnrollModal();
  const label = document.getElementById('modal-course-name');
  if (label) label.textContent = enrollCourse ? `Course: ${enrollCourse}` : 'Course: Java Full Stack';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.showEnrollAdPopup = showEnrollAdPopup;

function submitEnroll() {
  return openEnrollForm(enrollCourse || 'General Course');
}
window.submitEnroll = submitEnroll;

// ═════════════════════════════════════════════════════════════
// FINAL CLIENT PATCH — no auto popup ads + mobile action/buy screen
// ═════════════════════════════════════════════════════════════
const PHOENIX_BUY_COURSE_DETAILS = {
  'Java Full Stack': {
    title: 'Java Full Stack', category: 'Development', duration: '3 Months / 6 Months', level: 'Beginner → Advanced',
    description: 'Core Java, Spring Boot, MySQL, REST API, frontend basics and project-based full stack training.',
    technologies: ['Core Java','Spring Boot','MySQL','HTML','CSS','JavaScript','REST API'],
    highlights: ['Spring Boot Apps','Database Projects','REST APIs','Placement Training']
  },
  'Python Developer': {
    title: 'Python Developer', category: 'Development', duration: '3 Months / 6 Months', level: 'Beginner → Advanced',
    description: 'Python basics to backend development with Django, Flask, SQL, APIs, Git and interview practice.',
    technologies: ['Python','OOP','Django','Flask','REST API','SQL','Git'],
    highlights: ['Python Basics','Django Projects','API Development','Interview Prep']
  },
  'Digital Marketing': {
    title: 'Digital Marketing', category: 'Marketing', duration: '3 Months / 6 Months', level: 'Beginner → Advanced',
    description: 'SEO, Google Ads, Meta Ads, analytics, content strategy and lead generation with live campaigns.',
    technologies: ['SEO','Google Ads','Meta Ads','Analytics','Content','Lead Generation'],
    highlights: ['Live Campaigns','SEO Audit','Ad Strategy','Analytics Reports']
  },
  'UI/UX Web Developer': {
    title: 'UI/UX Web Developer', category: 'Design', duration: '3 Months / 6 Months', level: 'Beginner → Advanced',
    description: 'Figma, wireframes, prototypes, responsive web UI and portfolio-ready interface development.',
    technologies: ['Figma','Wireframes','Prototypes','HTML','CSS','JavaScript','Portfolio'],
    highlights: ['Figma Projects','Website UI','Responsive Design','Portfolio Review']
  },
  'MERN Full Stack': {
    title: 'MERN Full Stack', category: 'Development', duration: '3 Months / 6 Months', level: 'Beginner → Advanced',
    description: 'MongoDB, Express, React and Node training through full web apps with auth, dashboard and APIs.',
    technologies: ['MongoDB','Express.js','React.js','Node.js','JWT','Tailwind','GitHub'],
    highlights: ['MERN Projects','Auth System','Admin Dashboard','GitHub Portfolio']
  },
  'General Course': {
    title: 'General Course', category: 'Phoenix Academy', duration: '3 Months / 6 Months', level: 'Beginner → Advanced',
    description: 'Choose your course, book a free demo, open the official enrollment form, or request a WhatsApp payment link.',
    technologies: ['Career Guidance','Live Projects','Mentor Support','Placement Training'],
    highlights: ['Course Guidance','Demo Booking','Fee Support','WhatsApp Support']
  }
};

function phoenixCourseInfo(courseName) {
  const title = String(courseName || 'General Course').trim() || 'General Course';
  return PHOENIX_BUY_COURSE_DETAILS[title] || PHOENIX_BUY_COURSE_DETAILS['General Course'];
}

function phoenixFeeText(duration) {
  return duration === '6 Months' ? '₹29,999' : '₹14,999';
}

function phoenixPhoneOptions(courseName) {
  const course = phoenixCourseInfo(courseName);
  return `
    <div class="phoenix-phone-options">
      <button type="button" class="phoenix-option-card active" data-mobile-duration="3 Months" onclick="selectPhoenixMobileDuration('3 Months')">
        <span>3 Months</span><b>₹14,999</b><small>Fast career track</small>
      </button>
      <button type="button" class="phoenix-option-card" data-mobile-duration="6 Months" onclick="selectPhoenixMobileDuration('6 Months')">
        <span>6 Months</span><b>₹29,999</b><small>Complete mentor track</small>
      </button>
    </div>
    <div class="phoenix-phone-form-row">
      <label>Payment Option</label>
      <select id="pm-pay-type">
        <option value="Full Course Payment">Full Course Payment</option>
        <option value="50% Advance EMI">50% Advance EMI</option>
        <option value="Need Fee Details">Need Fee Details</option>
      </select>
    </div>
    <input type="hidden" id="pm-course" value="${escapeHTMLAttr(course.title)}">
    <input type="hidden" id="pm-duration" value="3 Months">
    <input type="text" name="website" id="pm-website" autocomplete="off" tabindex="-1" aria-hidden="true" style="display:none">
  `;
}

function phoenixMobileHighlights(course) {
  return (course.highlights || []).slice(0, 4).map(item => `<span><b>✓</b>${escapeHTMLAttr(item)}</span>`).join('');
}

function phoenixTechPills(course) {
  return (course.technologies || []).slice(0, 6).map(item => `<em>${escapeHTMLAttr(item)}</em>`).join('');
}

function ensurePhoenixMobileModal() {
  let modal = document.getElementById('phoenix-mobile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'phoenix-mobile-modal';
    document.body.appendChild(modal);
  }
  modal.className = 'modal-overlay phoenix-mobile-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  return modal;
}

function phoenixMobileModalHTML(mode = 'booking', courseName = 'General Course') {
  const isBuy = mode === 'buy';
  const course = phoenixCourseInfo(courseName);
  const title = escapeHTMLAttr(course.title);
  const desc = escapeHTMLAttr(course.description);
  const waText = encodeURIComponent(`Hi Phoenix Academy, I want details for ${course.title}. Please share course fee, batch timing and demo details.`);

  if (!isBuy) {
    return `
      <div class="phoenix-mobile-shell booking-mode" role="document">
        <button type="button" class="phoenix-mobile-close" onclick="closePhoenixMobileModal()" aria-label="Close popup">×</button>
        <div class="phoenix-popup-card phoenix-enroll-popup-card">
          <div class="phoenix-enroll-card-header phoenix-reference-header">
            <h3>Enroll Form</h3>
          </div>

          <div class="phoenix-enroll-form-body">
            <div class="phoenix-reference-intro">
              <div class="phoenix-popup-eyebrow"><img src="/assets/icons/lightning.png" alt="">ENROLL NOW</div>
              <h4>Reserve Your Seat</h4>
              <p class="phoenix-popup-course">Course: <strong>${title}</strong></p>
            </div>
            <div class="phoenix-field phoenix-field-full">
              <label for="pe-name">Full Name *</label>
              <input id="pe-name" type="text" placeholder="Your full name" autocomplete="name">
            </div>

            <div class="phoenix-popup-grid">
              <div class="phoenix-field">
                <label for="pe-email">Email *</label>
                <input id="pe-email" type="email" placeholder="your@email.com" autocomplete="email">
              </div>
              <div class="phoenix-field">
                <label for="pe-phone">Mobile Number *</label>
                <input id="pe-phone" type="tel" placeholder="9XXXXXXXXX" inputmode="numeric" autocomplete="tel">
              </div>
            </div>

            <div class="phoenix-field phoenix-field-full">
              <label>Course Duration *</label>
              <div class="phoenix-enroll-duration-grid">
                <button type="button" class="phoenix-enroll-duration selected" data-enroll-duration="3 Months" onclick="selectPhoenixEnrollDuration('3 Months')">
                  <img src="/assets/icons/timer.png" alt=""><span>3 MONTHS · ₹14,999</span>
                </button>
                <button type="button" class="phoenix-enroll-duration" data-enroll-duration="6 Months" onclick="selectPhoenixEnrollDuration('6 Months')">
                  <img src="/assets/icons/calendar-check.png" alt=""><span>6 MONTHS · ₹29,999</span>
                </button>
              </div>
            </div>

            <input type="hidden" id="pe-course" value="${title}">
            <input type="hidden" id="pe-duration" value="3 Months">
            <input type="text" name="website" id="pe-website" autocomplete="off" tabindex="-1" aria-hidden="true" style="display:none">

            <button type="button" class="phoenix-enroll-confirm" id="pe-submit" onclick="submitPhoenixEnrollment()">
              <img src="/assets/icons/send.png" alt="">CONFIRM ENROLLMENT →
            </button>
            <p class="phoenix-enroll-helper">Our counsellor will call within 2 hours to confirm your seat.</p>

            <div class="phoenix-enroll-quick-actions" aria-label="Quick contact actions">
              <a class="whatsapp" href="https://wa.me/919986762311?text=${waText}" target="_blank" rel="noopener"><img src="/assets/icons/whatsapp.png" alt="">WhatsApp</a>
              <a class="call" href="tel:+919986762311"><img src="/assets/icons/phone-call.png" alt="">Call</a>
              <button class="payment" type="button" onclick="closePhoenixMobileModal();openPaymentModal(enrollCourse || '${escapeInlineJSString(course.title)}')"><img src="/assets/icons/wallet.png" alt="">Payment</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  return `
    <div class="phoenix-mobile-shell buy-mode" role="document">
      <button type="button" class="phoenix-mobile-close" onclick="closePhoenixMobileModal()" aria-label="Close popup">×</button>
      <div class="phoenix-popup-card phoenix-buy-popup-card">
        <div class="phoenix-buy-header phoenix-reference-header">
          <h3>Buy Course</h3>
        </div>

        <div class="phoenix-buy-body">
          <div class="phoenix-reference-intro phoenix-buy-intro">
            <div class="phoenix-popup-eyebrow"><img src="/assets/icons/wallet.png" alt="">BUY COURSE</div>
            <h4>${title}</h4>
            <p>${desc}</p>
            <div class="phoenix-buy-tags">${phoenixTechPills(course)}</div>
          </div>

          <div class="phoenix-course-summary">
            <strong>${title}</strong>
            <small>${escapeHTMLAttr(course.duration)} · ${escapeHTMLAttr(course.level)}</small>
            <div class="phoenix-course-points">${phoenixMobileHighlights(course)}</div>
          </div>

          ${phoenixPhoneOptions(course.title)}

          <div class="phoenix-phone-form-grid">
            <input id="pm-name" type="text" placeholder="Full name *" autocomplete="name">
            <input id="pm-phone" type="tel" placeholder="10 digit mobile *" inputmode="numeric" autocomplete="tel">
            <input id="pm-email" type="email" placeholder="Email address *" autocomplete="email">
            <textarea id="pm-message" rows="2" placeholder="Message / batch timing / notes"></textarea>
          </div>

          <button type="button" class="phoenix-main-action whatsapp-buy" onclick="submitPhoenixMobileBuy()"><img src="/assets/icons/whatsapp.png" alt="">BUY WITH WHATSAPP</button>

          <div class="phoenix-phone-contact phoenix-buy-contact">
            <a href="tel:+919986762311"><img src="/assets/icons/phone-call.png" alt="">+91 99867 62311</a>
            <a href="mailto:info@phoenixacademys.com"><img src="/assets/icons/mail.png" alt="">info@phoenixacademys.com</a>
          </div>

          <div class="phoenix-two-actions">
            <button type="button" onclick="openEnrollForm('${escapeInlineJSString(course.title)}')"><img src="/assets/icons/external-link.png" alt="">Enroll Form</button>
            <button type="button" onclick="openPhoenixDemoPage('${escapeInlineJSString(course.title)}')"><img src="/assets/icons/calendar-check.png" alt="">Book Demo</button>
          </div>
        </div>
      </div>
    </div>`;
}

function selectPhoenixEnrollDuration(duration) {
  const modal = document.getElementById('phoenix-mobile-modal');
  if (!modal) return;
  const hidden = modal.querySelector('#pe-duration');
  if (hidden) hidden.value = duration;
  modal.querySelectorAll('[data-enroll-duration]').forEach(btn => {
    btn.classList.toggle('selected', btn.getAttribute('data-enroll-duration') === duration);
  });
}

async function submitPhoenixEnrollment() {
  const modal = document.getElementById('phoenix-mobile-modal');
  if (!modal) return;
  const name = modal.querySelector('#pe-name')?.value.trim() || '';
  const email = modal.querySelector('#pe-email')?.value.trim() || '';
  const phone = modal.querySelector('#pe-phone')?.value.trim() || '';
  const course = modal.querySelector('#pe-course')?.value || enrollCourse || 'Java Full Stack';
  const duration = modal.querySelector('#pe-duration')?.value || '3 Months';
  const website = modal.querySelector('#pe-website')?.value.trim() || '';

  if (website) { showToast('Spam detected.', 'error'); return; }
  if (!name || !email || !phone) { showToast('Please fill all required fields.', 'error'); return; }
  if (!isValidIndianMobile(phone)) { showToast('Phone number must be exactly 10 digits.', 'error'); return; }

  const payload = { type: 'enroll', name, email, phone, course, duration, sourcePage: window.location.pathname || '/', website };
  const btn = modal.querySelector('#pe-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'SENDING...'; }

  try {
    const res = await fetch('/api/main-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Unable to save enrollment');
    showToast('Enrollment saved. Opening WhatsApp. ✅', 'success');
  } catch (err) {
    showToast('Opening WhatsApp. Your request can be saved after deployment. ✅', 'success');
  }

  openLeadWhatsApp('Enrollment Request', payload);
  closePhoenixMobileModal();
  if (btn) btn.innerHTML = '<img src="/assets/icons/send.png" alt="">CONFIRM ENROLLMENT →';
}

function openPhoenixMobileModal(mode = 'booking', courseName = 'General Course') {
  enrollCourse = courseName || 'General Course';
  const modal = ensurePhoenixMobileModal();
  modal.innerHTML = phoenixMobileModalHTML(mode, enrollCourse);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.bindPhoneInputRules) window.bindPhoneInputRules(modal);
  return false;
}

function closePhoenixMobileModal() {
  const modal = document.getElementById('phoenix-mobile-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function selectPhoenixMobileDuration(duration) {
  const modal = document.getElementById('phoenix-mobile-modal');
  if (!modal) return;
  const hidden = modal.querySelector('#pm-duration');
  if (hidden) hidden.value = duration;
  modal.querySelectorAll('[data-mobile-duration]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mobile-duration') === duration);
  });
}

function openPhoenixDemoPage(courseName = 'General Course') {
  const course = encodeURIComponent(courseName || 'General Course');
  window.location.href = `/demo?course=${course}`;
}

function phoenixMobilePaymentMessage(p) {
  return [
    'Hi Phoenix Academy,',
    'I want to buy / get payment link for this course.',
    '',
    `Name: ${p.name}`,
    `Phone: ${p.phone}`,
    `Email: ${p.email}`,
    `Course: ${p.course}`,
    `Duration: ${p.duration}`,
    `Payment Option: ${p.paymentType}`,
    `Fee/Plan: ${p.amount}`,
    `Message: ${p.message || '—'}`,
    `Submitted: ${new Date().toLocaleString('en-IN')}`
  ].join('\n');
}

async function submitPhoenixMobileBuy() {
  const modal = document.getElementById('phoenix-mobile-modal');
  if (!modal) return;
  const name = modal.querySelector('#pm-name')?.value.trim() || '';
  const phone = modal.querySelector('#pm-phone')?.value.trim() || '';
  const email = modal.querySelector('#pm-email')?.value.trim() || '';
  const course = modal.querySelector('#pm-course')?.value || enrollCourse || 'General Course';
  const duration = modal.querySelector('#pm-duration')?.value || '3 Months';
  const paymentType = modal.querySelector('#pm-pay-type')?.value || 'Need Fee Details';
  const message = modal.querySelector('#pm-message')?.value.trim() || '';
  const website = modal.querySelector('#pm-website')?.value.trim() || '';
  const amount = `${duration} ${phoenixFeeText(duration)} · ${paymentType}`;
  if (website) { showToast('Spam detected.', 'error'); return; }
  if (!name || !phone || !email) { showToast('Please enter name, mobile number, and email.', 'error'); return; }
  if (!isValidIndianMobile(phone)) { showToast('Phone number must be exactly 10 digits.', 'error'); return; }
  const payload = { type: 'payment', name, phone, email, course, duration, paymentType, amount, message, sourcePage: window.location.pathname || '/', website };
  const btn = modal.querySelector('.whatsapp-buy');
  if (btn) { btn.disabled = true; btn.innerHTML = 'SAVING...'; }
  try {
    const res = await fetch('/api/main-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Unable to save lead');
    showToast('Buy request saved in main leads. Opening WhatsApp. ✅', 'success');
  } catch (err) {
    showToast('Opening WhatsApp. Lead can be saved after deployment API is active. ✅', 'success');
  }
  const wa = `https://wa.me/919986762311?text=${encodeURIComponent(phoenixMobilePaymentMessage(payload))}`;
  const win = window.open(wa, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = wa;
  if (btn) { btn.disabled = false; btn.innerHTML = '<img src="/assets/icons/whatsapp.png" alt="">BUY WITH WHATSAPP'; }
}

// Course cards: enroll opens the official form; buy opens the new mobile-style course/buy screen.
function courseImageCardHTML(course, variant = '') {
  const title = String(course?.title || 'Course');
  if (title.toLowerCase().trim() === 'full stack') return '';
  const slug = courseCardSlug(title);
  const image = getCourseCardImage(course);
  const safeTitle = escapeInlineJSString(title);
  const searchable = [title, course?.description || '', course?.duration || '', course?.level || '', ...(course?.technologies || []), ...(course?.highlights || [])].join(' ');
  return `
    <article class="course-art-card ${slug} ${variant ? `course-art-${variant}` : ''} fade-in" data-course-title="${escapeHTMLAttr(title)}" data-course-search="${escapeHTMLAttr(searchable)}" data-category="${escapeHTMLAttr(course?.category || '')}">
      <img class="course-art-img" src="${image}" alt="${escapeHTMLAttr(title)} course full details" loading="lazy">
      <span class="sr-only">${escapeHTMLAttr(searchable)}</span>
      <button type="button" class="course-hotspot enroll-hotspot" aria-label="Enroll now for ${escapeHTMLAttr(title)}" onclick="openEnrollForm('${safeTitle}')">Enroll Now</button>
      <button type="button" class="course-hotspot buy-hotspot" aria-label="Buy ${escapeHTMLAttr(title)} course" onclick="openPaymentModal('${safeTitle}')">Buy Course</button>
    </article>`;
}
window.courseImageCardHTML = courseImageCardHTML;

// Replace old payment popup with the new mobile phone buy screen.
function openPaymentModal(courseName = 'General Course') {
  document.getElementById('payment-modal')?.remove();
  return openPhoenixMobileModal('buy', courseName || 'General Course');
}
function closePaymentModal() { closePhoenixMobileModal(); }
function submitPaymentRequest() { return submitPhoenixMobileBuy(); }
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.submitPaymentRequest = submitPaymentRequest;
window.openPhoenixMobileModal = openPhoenixMobileModal;
window.closePhoenixMobileModal = closePhoenixMobileModal;
window.submitPhoenixMobileBuy = submitPhoenixMobileBuy;
window.selectPhoenixMobileDuration = selectPhoenixMobileDuration;
window.selectPhoenixEnrollDuration = selectPhoenixEnrollDuration;
window.submitPhoenixEnrollment = submitPhoenixEnrollment;
window.openPhoenixDemoPage = openPhoenixDemoPage;

// Mobile-style enroll notification: auto popup plus apply tab; no old ad card.
function ensureApplyNowUX() {
  document.getElementById('enroll-ad-popup')?.remove();
  if (!document.getElementById('phoenix-apply-tab')) {
    const tab = document.createElement('div');
    tab.className = 'phoenix-apply-tab-wrap';
    tab.innerHTML = `<button id="phoenix-apply-tab" class="phoenix-apply-tab" type="button" aria-label="Apply now"><span>Apply Now</span></button>`;
    document.body.appendChild(tab);
  }
  const tabButton = document.getElementById('phoenix-apply-tab');
  if (tabButton && !tabButton.dataset.mobileBound) {
    tabButton.dataset.mobileBound = 'true';
    tabButton.addEventListener('click', triggerApplyNowPopup);
  }
  schedulePhoenixAutoEnrollPopup();
}

function shouldShowPhoenixAutoEnrollPopup() {
  const path = (window.location.pathname || '').toLowerCase();
  if (path.includes('/enroll') || path.includes('/thank-you') || path.includes('/privacy') || path.includes('/terms')) return false;
  if (document.getElementById('phoenix-mobile-modal')?.classList.contains('open')) return false;
  return true;
}

function schedulePhoenixAutoEnrollPopup() {
  if (window.__phoenixAutoEnrollPopupScheduled) return;
  window.__phoenixAutoEnrollPopupScheduled = true;
  window.setTimeout(() => {
    try {
      if (!shouldShowPhoenixAutoEnrollPopup()) return;
      openPhoenixMobileModal('booking', 'Java Full Stack');
    } catch (err) {
      console.warn('Phoenix auto enroll popup skipped', err);
    }
  }, 6000);
}

function triggerApplyNowPopup() {
  return openPhoenixMobileModal('booking', 'Java Full Stack');
}
function showEnrollAdPopup() {
  document.getElementById('enroll-ad-popup')?.remove();
  return false;
}
function hideEnrollAdPopup() { closePhoenixMobileModal(); }
function getEnrollModalHTML() { return phoenixMobileModalHTML('booking', enrollCourse || 'General Course'); }
function openEnrollModal(courseName = 'General Course') { return openPhoenixMobileModal('booking', courseName); }
window.ensureApplyNowUX = ensureApplyNowUX;
window.schedulePhoenixAutoEnrollPopup = schedulePhoenixAutoEnrollPopup;
window.triggerApplyNowPopup = triggerApplyNowPopup;
window.showEnrollAdPopup = showEnrollAdPopup;
window.hideEnrollAdPopup = hideEnrollAdPopup;
window.openEnrollModal = openEnrollModal;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureApplyNowUX, { once: true });
} else {
  ensureApplyNowUX();
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'phoenix-mobile-modal') closePhoenixMobileModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('phoenix-mobile-modal')?.classList.contains('open')) closePhoenixMobileModal();
});
