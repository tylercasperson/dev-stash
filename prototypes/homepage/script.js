/* =========================================
   NAVBAR — opacity on scroll
   ========================================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* =========================================
   MOBILE MENU
   ========================================= */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

/* =========================================
   SCROLL FADE IN — Intersection Observer
   ========================================= */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
fadeEls.forEach((el) => fadeObserver.observe(el));

/* =========================================
   CHAOS CANVAS ANIMATION
   ========================================= */
(function initChaos() {
  const canvas = document.getElementById('chaos-canvas');
  const box = document.getElementById('chaos-box');
  const ctx = canvas.getContext('2d');

  const ICON_DEFS = [
    {
      title: 'GitHub', bg: '#24292f',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`
    },
    {
      title: 'Notion', bg: '#ffffff',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>`
    },
    {
      title: 'Slack', bg: '#4a154b',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#e01e5a" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/><path fill="#36c5f0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/><path fill="#2eb67d" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/><path fill="#ecb22e" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>`
    },
    {
      title: 'VS Code', bg: '#007acc',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white"><path d="M74.9 7.3L50 35.8 25.6 14.1 7.5 22.6v54.8l18.1 8.5L50 64.2l24.9 28.5L93 84.2V15.8L74.9 7.3zM25.6 67.6L15.3 62V38l10.3-5.6v35.2zm49.3.2V32.2L50.1 50l24.8 17.8z"/></svg>`
    },
    {
      title: 'Browser', bg: '#1e293b',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" fill="#334155"/><rect x="1" y="4" width="22" height="5" rx="2" fill="#475569"/><rect x="2" y="5" width="6" height="3" rx="1" fill="#60a5fa"/><rect x="9" y="5" width="5" height="3" rx="1" fill="#64748b"/><circle cx="4" cy="6.5" r="0.8" fill="#f87171"/><circle cx="6.5" cy="6.5" r="0.8" fill="#fbbf24"/><rect x="4" y="12" width="16" height="2" rx="1" fill="#64748b"/><rect x="4" y="16" width="10" height="1.5" rx="0.75" fill="#475569"/></svg>`
    },
    {
      title: 'Terminal', bg: '#0d1117',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill="#0d1117"/><polyline points="4,9 9,12 4,15" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="20" y2="15" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/></svg>`
    },
    {
      title: 'Text File', bg: '#1e293b',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/><polyline points="14,2 14,8 20,8" fill="none" stroke="#94a3b8" stroke-width="1.5"/><line x1="8" y1="13" x2="16" y2="13" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="16" x2="16" y2="16" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="10" x2="11" y2="10" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/></svg>`
    },
    {
      title: 'Bookmark', bg: '#7c3aed',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="white"/></svg>`
    },
  ];

  function svgToImg(svgStr) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    });
  }

  let W, H, mouse = { x: -999, y: -999 };
  let particles = [];
  let rafId;

  function resize() {
    const rect = box.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W;
    canvas.height = H;
  }

  function initParticles(icons) {
    particles = icons.map((icon) => ({
      icon,
      x: 60 + Math.random() * (W - 120),
      y: 50 + Math.random() * (H - 80),
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.02,
      scale: 1,
      scaleDir: Math.random() > 0.5 ? 1 : -1,
      scaleT: Math.random() * Math.PI * 2,
    }));
  }

  const RADIUS = 62;
  const REPEL_DIST = 100;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      // Mouse repel
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_DIST && dist > 0) {
        const force = (REPEL_DIST - dist) / REPEL_DIST;
        p.vx += (dx / dist) * force * 0.6;
        p.vy += (dy / dist) * force * 0.6;
      }

      // Dampen
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Clamp velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2.5) {
        p.vx = (p.vx / speed) * 2.5;
        p.vy = (p.vy / speed) * 2.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls (leave room for icon size)
      if (p.x < RADIUS) { p.x = RADIUS; p.vx = Math.abs(p.vx); }
      if (p.x > W - RADIUS) { p.x = W - RADIUS; p.vx = -Math.abs(p.vx); }
      if (p.y < RADIUS + 36) { p.y = RADIUS + 36; p.vy = Math.abs(p.vy); }
      if (p.y > H - RADIUS) { p.y = H - RADIUS; p.vy = -Math.abs(p.vy); }

      // Subtle scale pulse
      p.scaleT += 0.025;
      p.scale = 1 + Math.sin(p.scaleT) * 0.06;

      // Rotation drift
      p.rot += p.rotV;

      drawIcon(p);
    });

    rafId = requestAnimationFrame(draw);
  }

  function drawIcon(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(p.scale, p.scale);

    const size = 52;
    const half = size / 2;
    const pad = 8;
    const iconSize = size - pad * 2;

    // Background pill
    ctx.beginPath();
    ctx.roundRect(-half, -half, size, size, 8);
    ctx.fillStyle = p.icon.bg;
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // SVG icon image
    if (p.icon.img.complete) {
      ctx.drawImage(p.icon.img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
    }

    ctx.restore();
  }

  // Track mouse relative to canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  // Preload SVG images then start animation
  Promise.all(ICON_DEFS.map(def =>
    svgToImg(def.svg).then(img => ({ ...def, img }))
  )).then(icons => {
    resize();
    initParticles(icons);
    draw();
    window.addEventListener('resize', () => {
      resize();
      initParticles(icons);
    });
  });
})();

/* =========================================
   PRICING TOGGLE
   ========================================= */
const billingToggle = document.getElementById('billing-toggle');
const proPrice = document.getElementById('pro-price');
const proPeriod = document.getElementById('pro-period');
const proDesc = document.getElementById('pro-desc');
const monthlyLabel = document.getElementById('toggle-monthly-label');
const yearlyLabel = document.getElementById('toggle-yearly-label');

billingToggle.addEventListener('change', () => {
  if (billingToggle.checked) {
    // Yearly
    proPrice.childNodes[0].textContent = '$6';
    proPeriod.textContent = '/mo';
    proDesc.textContent = 'Billed $72/year — save $24';
    monthlyLabel.style.color = 'var(--muted)';
    yearlyLabel.style.color = 'var(--text)';
  } else {
    // Monthly
    proPrice.childNodes[0].textContent = '$8';
    proPeriod.textContent = '/mo';
    proDesc.textContent = 'Billed monthly';
    monthlyLabel.style.color = 'var(--text)';
    yearlyLabel.style.color = 'var(--muted)';
  }
});

/* =========================================
   FOOTER — dynamic year
   ========================================= */
document.getElementById('footer-year').textContent = new Date().getFullYear();
