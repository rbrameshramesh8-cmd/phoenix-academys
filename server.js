const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@phoenixacademys.com';

// ── Email transporter (SMTP - configure via env vars) ──
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || ADMIN_EMAIL,
    pass: process.env.SMTP_PASS || ''
  }
});

async function sendAdminEmail(subject, html) {
  try {
    await transporter.sendMail({
      from: `"Phoenix Academy Website" <${process.env.SMTP_USER || ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject,
      html
    });
    console.log(`📧 Email sent: ${subject}`);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

const dataPath = (file) => path.join(__dirname, 'data', file);
const readData = (file) => {
  try {
    if (!fs.existsSync(dataPath(file))) return [];
    const raw = fs.readFileSync(dataPath(file), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
};
const writeData = (file, data) => {
  fs.mkdirSync(path.dirname(dataPath(file)), { recursive: true });
  fs.writeFileSync(dataPath(file), JSON.stringify(data, null, 2));
};
const validPhone = (phone) => /^\d{10}$/.test(String(phone || '').trim());
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
function storeMainLead(payload = {}) {
  const lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: payload.type || 'contact',
    name: payload.name || '',
    phone: payload.phone || '',
    email: payload.email || '',
    course: payload.course || '',
    duration: payload.duration || '',
    paymentType: payload.paymentType || '',
    amount: payload.amount || '',
    message: payload.message || '',
    sourcePage: payload.sourcePage || '',
    status: 'new',
    createdAt: new Date().toISOString()
  };
  const leads = readData('main-leads.json');
  leads.push(lead);
  writeData('main-leads.json', leads);
  return lead;
}

// ── Courses Data ──
const courses = [
  {
    "id": 1,
    "title": "Java Full Stack",
    "category": "development",
    "icon": "☕",
    "iconImage": "/assets/course_icons/java-full-stack-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 148,
    "technologies": [
      "Core Java",
      "Spring Boot",
      "MySQL",
      "HTML",
      "CSS",
      "JavaScript",
      "REST API"
    ],
    "description": "Build enterprise-style full stack applications using Java, Spring Boot, frontend development, database design and deployment-ready project workflows.",
    "highlights": [
      "Spring Boot Apps",
      "Database Projects",
      "REST APIs",
      "Placement Training"
    ]
  },
  {
    "id": 2,
    "title": "Python Developer",
    "category": "development",
    "icon": "🐍",
    "iconImage": "/assets/course_icons/python-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 165,
    "technologies": [
      "Python",
      "OOP",
      "Django",
      "Flask",
      "REST API",
      "SQL",
      "Git"
    ],
    "description": "Learn Python from basics to backend development with real projects, database integration, APIs and clean coding practice for developer roles.",
    "highlights": [
      "Python Basics",
      "Django Projects",
      "API Development",
      "Interview Prep"
    ]
  },
  {
    "id": 3,
    "title": "Digital Marketing",
    "category": "marketing",
    "icon": "📣",
    "iconImage": "/assets/course_icons/digital-marketing.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.8,
    "students": 154,
    "technologies": [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Analytics",
      "Content",
      "Lead Generation"
    ],
    "description": "Master SEO, social media, paid ads, analytics and lead generation through campaign-based practical training for business growth roles.",
    "highlights": [
      "Live Campaigns",
      "SEO Audit",
      "Ad Strategy",
      "Analytics Reports"
    ]
  },
  {
    "id": 4,
    "title": "UI/UX Web Developer",
    "category": "design",
    "icon": "🎨",
    "iconImage": "/assets/course_icons/ui-ux-design.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.8,
    "students": 132,
    "technologies": [
      "Figma",
      "Wireframes",
      "Prototypes",
      "HTML",
      "CSS",
      "JavaScript",
      "Portfolio"
    ],
    "description": "Learn UI/UX design and web interface development with Figma, wireframes, prototypes, responsive layouts and portfolio-ready screens.",
    "highlights": [
      "Figma Projects",
      "Website UI",
      "Responsive Design",
      "Portfolio Review"
    ]
  },
  {
    "id": 5,
    "title": "MERN Full Stack",
    "category": "development",
    "icon": "⚛️",
    "iconImage": "/assets/course_icons/mern-full-stack-development.png",
    "duration": "3 Months / 6 Months",
    "level": "Beginner → Advanced",
    "rating": 4.9,
    "students": 176,
    "technologies": [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "Tailwind",
      "GitHub"
    ],
    "description": "Master MongoDB, Express, React and Node by building complete production-style web apps with authentication, dashboards and APIs.",
    "highlights": [
      "MERN Projects",
      "Auth System",
      "Admin Dashboard",
      "GitHub Portfolio"
    ]
  }
];

// ════════════════════════════════════
//  PAGE ROUTES
// ════════════════════════════════════
app.get('/',           (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/courses',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'courses.html')));
app.get('/about',      (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/placements', (req, res) => res.sendFile(path.join(__dirname, 'public', 'placements.html')));
app.get('/contact',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/testimonials', (req, res) => res.sendFile(path.join(__dirname, 'public', 'testimonials.html')));
app.get('/demo',       (req, res) => res.sendFile(path.join(__dirname, 'public', 'demo.html')));
app.get('/apply',      (req, res) => res.sendFile(path.join(__dirname, 'public', 'enroll.html')));
app.get('/enroll',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'enroll.html')));
app.get('/privacy',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'privacy.html')));
app.get('/terms',      (req, res) => res.sendFile(path.join(__dirname, 'public', 'terms.html')));
app.get('/refund',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'refund.html')));
app.get('/thank-you',  (req, res) => res.sendFile(path.join(__dirname, 'public', 'thank-you.html')));

// ════════════════════════════════════
//  API ROUTES
// ════════════════════════════════════
app.get('/api/courses', (req, res) => {
  const { category } = req.query;
  const filtered = category && category !== 'all' ? courses.filter(c => c.category === category) : courses;
  res.json({ success: true, courses: filtered, total: courses.length });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, course });
});

app.post('/api/main-lead', async (req, res) => {
  const body = req.body || {};
  const { website, type, name, email, phone, course, duration, paymentType, amount, message, sourcePage } = body;
  if (website) return res.status(400).json({ success: false, message: 'Spam detected.' });
  if (!type) return res.status(400).json({ success: false, message: 'Lead type is required.' });
  if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone are required.' });
  if (!validPhone(phone)) return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits.' });
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
  if ((type === 'enroll' || type === 'apply' || type === 'payment') && !course) return res.status(400).json({ success: false, message: 'Course is required.' });
  if ((type === 'enroll' || type === 'apply' || type === 'payment') && !duration) return res.status(400).json({ success: false, message: 'Duration is required.' });
  if (type === 'payment' && !paymentType) return res.status(400).json({ success: false, message: 'Payment type is required.' });

  const lead = storeMainLead({ type, name, email, phone, course, duration, paymentType, amount, message, sourcePage });
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCourse = escapeHtml(course || '—');
  const safeDuration = escapeHtml(duration || '—');
  const safePaymentType = escapeHtml(paymentType || '—');
  const safeAmount = escapeHtml(amount || '—');
  const safeMessage = escapeHtml(message || '—');

  await sendAdminEmail(
    `📩 New ${type.toUpperCase()} Lead — ${name}`,
    `<h2>New ${type.toUpperCase()} Lead</h2>
     <table style="border-collapse:collapse;font-family:Arial;font-size:14px">
       <tr><td style="padding:8px;font-weight:bold">Type</td><td style="padding:8px">${escapeHtml(type)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${safeName}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${safeEmail}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${safePhone}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course</td><td style="padding:8px">${safeCourse}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Duration</td><td style="padding:8px">${safeDuration}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Payment Type</td><td style="padding:8px">${safePaymentType}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Amount</td><td style="padding:8px">${safeAmount}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${safeMessage}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Source</td><td style="padding:8px">${escapeHtml(sourcePage || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Time</td><td style="padding:8px">${new Date().toLocaleString('en-IN')}</td></tr>
     </table>`
  );

  res.json({ success: true, message: 'Lead stored successfully.', lead });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, course, duration, message, website, sourcePage } = req.body || {};
  if (website) return res.status(400).json({ success: false, message: 'Spam detected.' });
  if (!name || !email || !phone || !message) return res.status(400).json({ success: false, message: 'Name, email, phone and message are required.' });
  if (!validPhone(phone)) return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits.' });
  const contacts = readData('contacts.json');
  contacts.push({ id: Date.now(), name, email, phone, course, duration, message, timestamp: new Date().toISOString() });
  writeData('contacts.json', contacts);
  storeMainLead({ type: 'contact', name, email, phone, course, duration, message, sourcePage });
  console.log(`✉️  Contact from ${name} <${email}>`);
  await sendAdminEmail(
    `📩 New Contact Form — ${name}`,
    `<h2>New Contact Enquiry</h2>
     <table style="border-collapse:collapse;font-family:Arial;font-size:14px">
       <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${escapeHtml(phone || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course</td><td style="padding:8px">${escapeHtml(course || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course Duration</td><td style="padding:8px">${escapeHtml(duration || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${escapeHtml(message)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Time</td><td style="padding:8px">${new Date().toLocaleString('en-IN')}</td></tr>
     </table>`
  );
  res.json({ success: true, message: "Thank you! We'll reach out within 24 hours." });
});

app.post('/api/demo', async (req, res) => {
  const { name, email, phone, course, duration, date, time, website, sourcePage } = req.body || {};
  if (website) return res.status(400).json({ success: false, message: 'Spam detected.' });
  if (!name || !email || !phone || !course) return res.status(400).json({ success: false, message: 'Name, email, phone and course are required.' });
  if (!validPhone(phone)) return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits.' });
  const demos = readData('demos.json');
  demos.push({ id: Date.now(), name, email, phone, course, duration, date, time, timestamp: new Date().toISOString() });
  writeData('demos.json', demos);
  storeMainLead({ type: 'demo', name, email, phone, course, duration, message: `Date: ${date || '—'} · Time: ${time || '—'}`, sourcePage });
  console.log(`🎯 Demo booked by ${name} for ${course || 'General'}`);
  await sendAdminEmail(
    `🎯 Free Demo Booking — ${name}`,
    `<h2>New Free Demo Booking</h2>
     <table style="border-collapse:collapse;font-family:Arial;font-size:14px">
       <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${escapeHtml(phone)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course Interest</td><td style="padding:8px">${escapeHtml(course || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course Duration</td><td style="padding:8px">${escapeHtml(duration || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Preferred Date</td><td style="padding:8px">${escapeHtml(date || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Preferred Time</td><td style="padding:8px">${escapeHtml(time || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Submitted</td><td style="padding:8px">${new Date().toLocaleString('en-IN')}</td></tr>
     </table>`
  );
  res.json({ success: true, message: `Demo booked! Confirmation sent to ${email}` });
});

app.post('/api/enroll', async (req, res) => {
  const { name, email, phone, course, duration, website, sourcePage } = req.body || {};
  if (website) return res.status(400).json({ success: false, message: 'Spam detected.' });
  if (!name || !email || !phone || !course || !duration) return res.status(400).json({ success: false, message: 'All fields are required.' });
  if (!validPhone(phone)) return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits.' });
  const enrollments = readData('enrollments.json');
  enrollments.push({ id: Date.now(), name, email, phone, course, duration, status: 'pending', timestamp: new Date().toISOString() });
  writeData('enrollments.json', enrollments);
  storeMainLead({ type: 'enroll', name, email, phone, course, duration, sourcePage });
  console.log(`📋 Enrollment: ${name} → ${course} (${duration || 'duration not set'})`);
  await sendAdminEmail(
    `📋 New Enrollment — ${name} → ${course}`,
    `<h2>New Enrollment Request</h2>
     <table style="border-collapse:collapse;font-family:Arial;font-size:14px">
       <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${escapeHtml(phone)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course</td><td style="padding:8px">${escapeHtml(course)}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Course Duration</td><td style="padding:8px">${escapeHtml(duration || '—')}</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Status</td><td style="padding:8px">Pending — Call within 2 hours</td></tr>
       <tr><td style="padding:8px;font-weight:bold">Submitted</td><td style="padding:8px">${new Date().toLocaleString('en-IN')}</td></tr>
     </table>`
  );
  res.json({ success: true, message: `Enrollment for "${course}" received! Our counsellor will call you within 2 hours.` });
});

app.get('/api/stats', (req, res) => {
  res.json({ students: 5000, courses: 6, placementRate: 95, companies: 90, highestPackage: '6 LPA', avgPackage: '4.5 LPA', placed: 1200 });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log('\n🔥 Phoenix Academy');
  console.log(`🚀 Server running → http://localhost:${PORT}\n`);
  console.log('Pages:');
  console.log(`  Home       → http://localhost:${PORT}/`);
  console.log(`  Courses    → http://localhost:${PORT}/courses`);
  console.log(`  About      → http://localhost:${PORT}/about`);
  console.log(`  Placements → http://localhost:${PORT}/placements`);
  console.log(`  Contact    → http://localhost:${PORT}/contact`);
  console.log(`  Demo       → http://localhost:${PORT}/demo`);
  console.log(`  Enroll     → http://localhost:${PORT}/enroll\n`);
  console.log(`📧 Admin email: ${ADMIN_EMAIL}\n`);
  console.log('⚙️  Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars for email delivery\n');
});
