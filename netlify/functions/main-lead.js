const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@phoenixacademys.com';
const validPhone = (phone) => /^\d{10}$/.test(String(phone || '').trim());
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
const dataPath = (file) => path.join(__dirname, '..', '..', 'data', file);
const readData = (file) => {
  try {
    if (!fs.existsSync(dataPath(file))) return [];
    const parsed = JSON.parse(fs.readFileSync(dataPath(file), 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const writeData = (file, data) => {
  fs.mkdirSync(path.dirname(dataPath(file)), { recursive: true });
  fs.writeFileSync(dataPath(file), JSON.stringify(data, null, 2));
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
  }

  const { website, type, name, email, phone, course, duration, paymentType, amount, message, sourcePage } = body || {};
  if (website) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Spam detected.' }) };
  if (!type) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Lead type is required.' }) };
  if (!name || !phone) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Name and phone are required.' }) };
  if (!validPhone(phone)) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Phone number must be exactly 10 digits.' }) };
  if (!email) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email is required.' }) };
  if ((type === 'enroll' || type === 'apply' || type === 'payment') && !course) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Course is required.' }) };
  if ((type === 'enroll' || type === 'apply' || type === 'payment') && !duration) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Duration is required.' }) };
  if (type === 'payment' && !paymentType) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Payment type is required.' }) };

  const lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    name,
    phone,
    email,
    course: course || '',
    duration: duration || '',
    paymentType: paymentType || '',
    amount: amount || '',
    message: message || '',
    sourcePage: sourcePage || '',
    status: 'new',
    createdAt: new Date().toISOString()
  };

  const leads = readData('main-leads.json');
  leads.push(lead);
  writeData('main-leads.json', leads);

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: `"Phoenix Academy Website" <${process.env.SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `📩 New ${String(type).toUpperCase()} Lead — ${name}`,
        html: `<h2>New ${String(type).toUpperCase()} Lead</h2><table style="border-collapse:collapse;font-family:Arial;font-size:14px"><tr><td style="padding:8px;font-weight:bold">Type</td><td style="padding:8px">${escapeHtml(type)}</td></tr><tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${escapeHtml(name)}</td></tr><tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${escapeHtml(email)}</td></tr><tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${escapeHtml(phone)}</td></tr><tr><td style="padding:8px;font-weight:bold">Course</td><td style="padding:8px">${escapeHtml(course || '—')}</td></tr><tr><td style="padding:8px;font-weight:bold">Duration</td><td style="padding:8px">${escapeHtml(duration || '—')}</td></tr><tr><td style="padding:8px;font-weight:bold">Payment Type</td><td style="padding:8px">${escapeHtml(paymentType || '—')}</td></tr><tr><td style="padding:8px;font-weight:bold">Amount</td><td style="padding:8px">${escapeHtml(amount || '—')}</td></tr><tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${escapeHtml(message || '—')}</td></tr><tr><td style="padding:8px;font-weight:bold">Time</td><td style="padding:8px">${new Date().toLocaleString('en-IN')}</td></tr></table>`
      });
    } catch (err) {
      console.error('Email error:', err.message);
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Lead stored successfully.', lead }) };
};
