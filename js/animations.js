/**
 * EL PRECIO DEL TIEMPO — Animaciones
 * Partículas del hero, revelado al scroll, contadores y etapa final.
 */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Partículas / arena en el hero ---------- */
  function initParticles() {
    const canvas = document.getElementById("heroParticles");
    if (!canvas || prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;
    let running = true;

    const COUNT = 55;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        vy: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.45 + 0.15,
      };
    }

    function init() {
      particles = Array.from({ length: COUNT }, createParticle);
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;

        if (p.y > height + 4) {
          p.y = -4;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = "rgba(184, 154, 98," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    const hero = document.getElementById("inicio");
    const observer = new IntersectionObserver(
      (entries) => {
        running = entries[0].isIntersecting;
        if (running && !rafId) {
          rafId = requestAnimationFrame(draw);
        }
        if (!running && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.05 }
    );

    if (hero) observer.observe(hero);

    resize();
    init();
    rafId = requestAnimationFrame(draw);

    window.addEventListener(
      "resize",
      debounce(function () {
        resize();
        init();
      }, 150)
    );
  }

  /* ---------- Reveal al entrar en viewport ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReduced) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Contadores de estadísticas ---------- */
  function initCounters() {
    const nums = document.querySelectorAll(".stat-num");
    if (!nums.length) return;

    function animateValue(el) {
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      if (prefersReduced) {
        el.textContent = String(target);
        return;
      }

      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(eased * target));
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateValue(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    nums.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Barras de gráfica ---------- */
  function initBars() {
    const fills = document.querySelectorAll(".bar-row__fill");
    if (!fills.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-animated");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    fills.forEach(function (el) {
      if (prefersReduced) {
        el.classList.add("is-animated");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ---------- Frase final ---------- */
  function initFinale() {
    const stage = document.getElementById("finaleStage");
    if (!stage) return;

    if (prefersReduced) {
      stage.classList.add("is-active");
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stage.classList.add("is-active");
            observer.unobserve(stage);
          }
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(stage);
  }

  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      const args = arguments;
      const ctx = this;
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    initParticles();
    initReveal();
    initCounters();
    initBars();
    initFinale();
  });
})();
