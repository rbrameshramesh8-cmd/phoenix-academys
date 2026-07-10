<<<<<<< HEAD
# 🔥 Phoenix Academy — Website

Bangalore's premier IT training institute website.

---

## 🚀 Deploy to Netlify (Recommended)

### Step 1 — Upload to GitHub
Push this entire folder to a GitHub repository.

### Step 2 — Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Choose your GitHub repo
4. Netlify auto-detects settings from `netlify.toml`:
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. Click **Deploy site**

### Step 3 — Set Environment Variables (for email)
In Netlify dashboard → Site settings → Environment variables → Add:

| Key | Value |
|-----|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your-gmail@gmail.com` |
| `SMTP_PASS` | `your-gmail-app-password` |

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App passwords → Generate one for "Mail"

---

## 💻 Run Locally (Express server)

```bash
npm install
node server.js
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
phoenix-modified/
├── netlify.toml              ← Netlify config (publish dir + redirects)
├── netlify/
│   └── functions/            ← Serverless API functions
│       ├── courses.js        → GET /api/courses
│       ├── contact.js        → POST /api/contact
│       ├── demo.js           → POST /api/demo
│       ├── enroll.js         → POST /api/enroll
│       └── stats.js          → GET /api/stats
├── public/                   ← Static website files
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css    ← Responsive (mobile/tablet/desktop)
│   ├── js/
│   │   ├── components.js     ← Navbar & Footer
│   │   └── main.js
│   ├── images/
│   ├── index.html
│   ├── about.html
│   ├── courses.html
│   ├── contact.html
│   ├── demo.html
│   ├── placements.html
│   └── testimonials.html
├── server.js                 ← Local Express server (not used on Netlify)
└── package.json
```

---

## 📧 How Forms Work on Netlify

When a user submits Contact / Demo / Enroll forms:
1. The form POSTs to `/api/contact` (or `/api/demo`, `/api/enroll`)
2. `netlify.toml` redirects this to the matching Netlify Function
3. The Function sends an email to `info@phoenixacademys.com`
4. No database needed — everything goes to email

---

## 🌐 Pages

| URL | File |
|-----|------|
| `/` | `index.html` |
| `/about` | `about.html` |
| `/courses` | `courses.html` |
| `/contact` | `contact.html` |
| `/demo` | `demo.html` |
| `/placements` | `placements.html` |
| `/testimonials` | `testimonials.html` |


## Lead Delivery Setup

All website lead buttons are connected:
- Enroll Now: saves/sends through `/api/enroll` and opens WhatsApp with a pre-filled enrollment message.
- Book Free Demo: sends through `/api/demo` and opens WhatsApp with a pre-filled demo message.
- Contact form: sends through `/api/contact` and opens WhatsApp with a pre-filled contact message.

Default receiver details are already set:
- WhatsApp: `+91 99867 62311`
- Email: `info@phoenixacademys.com`

For real email delivery on Netlify, add these Environment Variables in Netlify:
`ADMIN_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
For Gmail SMTP, use a Gmail App Password, not your normal Gmail password.

To change WhatsApp number on the frontend, edit `public/js/main.js` → `PHOENIX_ADMIN_WHATSAPP`.
To change receiver email in backend/functions, set Netlify `ADMIN_EMAIL`.

Note: WhatsApp cannot silently send a message from a website. The visitor's WhatsApp opens with the full message ready; they must tap Send.

## Current Courses and Fees

Only these six courses are shown across the website:
- Java Full Stack
- Python Developer
- Digital Marketing
- UI/UX Web Developer
- MERN Full Stack
- Full Stack

Fees are set everywhere as:
- 3 Months: ₹14,999
- 6 Months: ₹29,999

Payment/EMI buttons open WhatsApp with pre-filled confirmation messages.


Latest footer/home course fix:
- Home course cards now match the all-courses card style and size.
- Footer brand changed to PHOENIX orange + Academy black beside the logo.
- Footer bird logo background changed to dark navy.
- Footer contact details aligned into clear icon/text rows.
=======
# phoenix-academys
>>>>>>> 5e578b6ab5b6b97c6908e77ea3c14ab59aa20e32
