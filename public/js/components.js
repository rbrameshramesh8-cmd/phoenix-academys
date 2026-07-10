(function() {
  const cur = window.location.pathname.replace(/\/$/, '') || '/';
  const a = (href) => (href === '/' ? cur === '/' : cur === href || cur.startsWith(href + '/')) ? 'active' : '';

  /* ── LOGO HTML snippet (reused in nav & footer) ──
     Navbar bg is white/light → mix-blend-mode:multiply removes white/grey box
     Footer bg is dark        → circular white frame isolates logo cleanly     */

  const navLogoImg = `
    <img src="/images/logo.png" alt="Phoenix Academys"
         style="width:46px;height:46px;object-fit:contain;
                mix-blend-mode:multiply;
                background:transparent;
                filter:drop-shadow(0 2px 6px rgba(10,102,194,0.28));">`;

  const footerLogoImg = `
    <span class="footer-logo-box" aria-hidden="true">
      <img src="/images/logo-footer-navy.png" alt="Phoenix Academys" class="footer-logo-img">
    </span>`;

/* ── NAVBAR ── */
  const navHTML = `
  <nav class="navbar academy-navbar">
    <div class="nav-inner academy-nav-inner">
      <a href="/" class="academy-brand" aria-label="Phoenix Academys home">
        ${navLogoImg}
        <div class="academy-brand-copy">
          <span class="academy-brand-title"><span>PHOENIX</span> Academys</span>
          <small>#1 IT Training Institute</small>
        </div>
      </a>
      <ul class="nav-links academy-nav-links">
        <li><a href="/"             class="${a('/')}">Home</a></li>
        <li><a href="/about"        class="${a('/about')}">About</a></li>
        <li><a href="/courses"      class="${a('/courses')}">Courses</a></li>
        <li><a href="/placements"   class="${a('/placements')}">Placements</a></li>
        <li><a href="/testimonials" class="${a('/testimonials')}">Testimonials</a></li>
        <li><a href="/contact"      class="${a('/contact')}">Contact</a></li>
        <li><a href="/apply" class="${a('/apply')}">Apply</a></li>
      </ul>
      <a href="/demo" class="academy-demo-cta nav-cta" aria-label="Book a free demo class">
        <img src="/assets/icons/calendar-clock.png" alt="" aria-hidden="true"> Book Free Demo
      </a>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
    <div class="mobile-menu academy-mobile-menu">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/courses">Courses</a>
      <a href="/placements">Placements</a>
      <a href="/testimonials">Testimonials</a>
      <a href="/contact">Contact</a>
      <a href="/apply">Apply Now</a>
      <a href="/demo" class="mobile-demo-link">Book Free Demo</a>
    </div>
  </nav>`;

  /* ── FOOTER ── */
  const footerHTML = `
  <footer>
    <div class="footer-inner">
      <div class="footer-grid">

        <div>
          <a href="/" class="footer-brand-link" aria-label="Phoenix Academys home">
            ${footerLogoImg}
            <span class="academy-footer-brand">
              <span class="footer-brand-phoenix">PHOENIX</span>
              <span class="footer-brand-academy">Academys</span>
            </span>
          </a>
          <p class="footer-about-text">
            Bangalore's premier IT training institute. Turning students into industry-ready professionals since 2024.
          </p>
        </div>

        <div>
          <h4 style="font-size:0.68rem;font-weight:800;letter-spacing:0.12em;color:var(--primary);margin-bottom:16px">QUICK LINKS</h4>
          <a href="/"            class="footer-link">Home</a>
          <a href="/about"       class="footer-link">About Us</a>
          <a href="/courses"     class="footer-link">All Courses</a>
          <a href="/testimonials" class="footer-link">Testimonials</a>
          <a href="/placements"  class="footer-link">Placements</a>
          <a href="/contact"     class="footer-link">Contact</a>
          <a href="/demo"        class="footer-link">Free Demo</a>
          <a href="/apply" class="footer-link">Apply Now</a>
        </div>

        <div>
          <h4 style="font-size:0.68rem;font-weight:800;letter-spacing:0.12em;color:var(--primary);margin-bottom:16px">COURSES</h4>
          <a href="/courses" class="footer-link">Java Full Stack</a>
          <a href="/courses" class="footer-link">Python Developer</a>
          <a href="/courses" class="footer-link">Digital Marketing</a>
          <a href="/courses" class="footer-link">UI/UX Web Developer</a>
          <a href="/courses" class="footer-link">MERN Full Stack</a>
        </div>

        <div>
          <h4 style="font-size:0.68rem;font-weight:800;letter-spacing:0.12em;color:var(--primary);margin-bottom:16px">CONTACT</h4>
          <div class="footer-contact-list">
            <a class="footer-contact-row" href="https://www.google.com/maps/search/?api=1&query=12.8917471,77.6388388" target="_blank" rel="noopener">
              <span class="footer-contact-icon"><img src="/assets/icons/map-pin.png" alt=""></span>
              <span>Bangalore Kudlu Gate, 1st Floor — 560068</span>
            </a>
            <a class="footer-contact-row" href="tel:+919986762311">
              <span class="footer-contact-icon"><img src="/assets/icons/phone.png" alt=""></span>
              <span>+91 99867 62311</span>
            </a>
            <a class="footer-contact-row" href="mailto:info@phoenixacademys.com">
              <span class="footer-contact-icon"><img src="/assets/icons/mail.png" alt=""></span>
              <span>info@phoenixacademys.com</span>
            </a>
            <div class="footer-contact-row footer-contact-static">
              <span class="footer-contact-icon"><img src="/assets/icons/clock.png" alt=""></span>
              <span>Mon–Sat: 9AM – 8PM · Sun: 10AM – 6PM</span>
            </div>
          </div>
        </div>
      </div>

      <div class="h-sep"></div>
      <div style="padding-top:22px;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:12px">
        <p style="color:#6b7280;font-size:0.6rem;letter-spacing:0.06em">POWERED BY PHOENIX ACADEMY · BANGALORE</p>
      </div>
    </div>
  </footer>
`;

  const nb = document.getElementById('navbar-placeholder');
  if (nb) nb.innerHTML = navHTML;
  const fp = document.getElementById('footer-placeholder');
  if (fp) fp.innerHTML = footerHTML;

  /* ── PARROT WEBSITE GUIDE AGENT ── */
  const agentHTML = `
    <div class="phoenix-agent" id="phoenix-agent" aria-live="polite">
      <button class="phoenix-agent-toggle" id="phoenix-agent-toggle" type="button" aria-label="Open Phoenix website guide">
        <img src="/assets/assistant/phoenix-parrot-agent.png" alt="Phoenix website guide parrot">
        <span class="agent-pulse" aria-hidden="true"></span>
        <span class="agent-label">Need help?</span>
      </button>
      <div class="phoenix-agent-panel" id="phoenix-agent-panel" role="dialog" aria-label="Phoenix website guide">
        <div class="agent-head">
          <img src="/assets/assistant/phoenix-parrot-agent.png" alt="Phoenix guide">
          <div>
            <div class="agent-title">PHOENIX GUIDE</div>
            <div class="agent-subtitle">Website help • Course guide • Support</div>
          </div>
          <button class="agent-close" id="phoenix-agent-close" type="button" aria-label="Close website guide">×</button>
        </div>
        <div class="agent-body" id="phoenix-agent-messages">
          <div class="agent-msg bot">
            Nice to meet you! I can help with courses, enroll, demo booking, WhatsApp support, and contact details.
          </div>
          <div class="agent-quick" aria-label="Quick website guide options">
            <button class="agent-chip" type="button" data-agent-action="use">How to use?</button>
            <button class="agent-chip" type="button" data-agent-action="courses">Courses</button>
            <button class="agent-chip" type="button" data-agent-action="choose">Choose course</button>
            <button class="agent-chip" type="button" data-agent-action="benefits">Benefits</button>
            <button class="agent-chip" type="button" data-agent-action="enroll">Enroll</button>
            <button class="agent-chip" type="button" data-agent-action="support">Support</button>
          </div>
        </div>
        <form class="agent-input-row" id="phoenix-agent-form" autocomplete="off">
          <input id="phoenix-agent-input" type="text" placeholder="Ask about courses, enroll, demo..." aria-label="Ask Phoenix website guide">
          <button class="agent-send" type="submit" aria-label="Send question"><img src="/assets/icons/send.png" alt=""></button>
        </form>
      </div>
    </div>`;
  if (!document.getElementById('phoenix-agent')) {
    document.body.insertAdjacentHTML('beforeend', agentHTML);
  }

})();
