// netlify/functions/enroll.js
// Handles enrollment requests — sends email notification

const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@phoenixacademys.com';
const validPhone = (phone) => /^\d{10}$/.test(String(phone || '').trim());

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

  const { name, email, phone, course, duration } = body;

  if (!name || !email || !phone || !course) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'All fields are required.' }) };
  }
  if (!validPhone(phone)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Phone number must be exactly 10 digits.' }) };
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      await transporter.sendMail({
        from: `"Phoenix Academys Website" <${process.env.SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: `📋 New Enrollment — ${name} → ${course}`,
        html: `<h2>New Enrollment Request</h2>
          <table style="border-collapse:collapse;font-family:Arial;font-size:14px">
            <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${phone}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Course</td><td style="padding:8px">${course}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Duration</td><td style="padding:8px">${duration || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Status</td><td style="padding:8px">Pending — Call within 2 hours</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Submitted</td><td style="padding:8px">${new Date().toLocaleString('en-IN')}</td></tr>
          </table>`
      });
    } catch (err) {
      console.error('Email error:', err.message);
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: `Enrollment for "${course}" received! Our counsellor will call you within 2 hours.` })
  };
};
