/* =========================================================
   KAYES KHAN — CYBERSECURITY PORTFOLIO
   script.js
   ========================================================= */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. MATRIX RAIN BACKGROUND
  --------------------------------------------------------- */
  const canvas = document.getElementById("matrix-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const chars = "アイウエオカキクケコサシスセソ01{}<>/;#$KAYESKHAN".split("");
    let fontSize = 15;
    let columns = 0;
    let drops = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -40));
    }

    function draw() {
      ctx.fillStyle = "rgba(6, 9, 7, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.96 ? "#eafff0" : "#39ff8c";
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let rainInterval = setInterval(draw, 45);

    // Pause rain when tab hidden (perf)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(rainInterval);
      } else {
        rainInterval = setInterval(draw, 45);
      }
    });
  }

  /* ---------------------------------------------------------
     2. TYPING EFFECT (hero)
  --------------------------------------------------------- */
  const typedEl = document.getElementById("typed-text");
  if (typedEl) {
    const phrases = [
      "Cybersecurity Enthusiast",
      "Securing the digital world, one vulnerability at a time.",
      "Exploring Penetration Testing & Digital Forensics"
    ];

    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const TYPE_SPEED = 55;
      const DELETE_SPEED = 28;
      const HOLD_TIME = 1600;

      function tick() {
        const current = phrases[phraseIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            return setTimeout(tick, HOLD_TIME);
          }
          return setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            return setTimeout(tick, 350);
          }
          return setTimeout(tick, DELETE_SPEED);
        }
      }
      tick();
    }
  }

  /* ---------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal, .scan-window");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------
     4. MOBILE NAV TOGGLE
  --------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.classList.toggle("is-active", isOpen);
    });

    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     5. ACTIVE NAV LINK ON SCROLL
  --------------------------------------------------------- */
  const sections = document.querySelectorAll("main .section, .hero");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------------------------------------------------
     6. SMOOTH SCROLL FOR ANCHOR LINKS (offset for fixed header)
  --------------------------------------------------------- */
  const header = document.getElementById("site-header");
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ---------------------------------------------------------
     7. UPTIME CLOCK (playful "system uptime" ticker)
  --------------------------------------------------------- */
  const uptimeEl = document.getElementById("uptime-clock");
  if (uptimeEl) {
    let seconds = 0;
    setInterval(() => {
      seconds++;
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      uptimeEl.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }

  /* ---------------------------------------------------------
     8. FOOTER YEAR
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
