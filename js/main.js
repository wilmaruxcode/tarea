/**
 * EL PRECIO DEL TIEMPO — Núcleo de navegación
 * Menú, progreso de lectura, capítulo activo, Lucide.
 */
(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const progressFill = document.getElementById("progressFill");
  const chapters = document.querySelectorAll(".chapter[data-chapter]");
  const navLinks = document.querySelectorAll(".site-nav__list a");

  function initIcons() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  function updateProgress() {
    if (!progressFill) return;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressFill.style.width = pct.toFixed(2) + "%";
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    document.body.style.overflow = "hidden";
  }

  function initNav() {
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.contains("is-open");
        if (open) closeNav();
        else openNav();
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function setActiveChapter() {
    let current = null;
    const offset = window.innerHeight * 0.28;

    chapters.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        current = section.getAttribute("data-chapter");
      }
    });

    navLinks.forEach(function (link) {
      const ch = link.getAttribute("data-chapter");
      link.classList.toggle("is-active", ch === current);
    });
  }

  function smoothInternalLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "start",
        });

        if (history.pushState) {
          history.pushState(null, "", id);
        }
      });
    });
  }

  function onScroll() {
    setHeaderState();
    updateProgress();
    setActiveChapter();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initIcons();
    initNav();
    smoothInternalLinks();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Reintentar iconos por si Lucide carga un instante después
    setTimeout(initIcons, 400);
  });
})();
