/**
 * EL PRECIO DEL TIEMPO — Interacciones
 * Preguntas de reflexión seleccionables (opcionales).
 */
(function () {
  "use strict";

  function initReflectBlocks() {
    const blocks = document.querySelectorAll(".reflect-block");

    blocks.forEach(function (block) {
      const options = block.querySelectorAll(".reflect-option");
      const feedback = block.querySelector(".reflect-feedback");
      if (!options.length || !feedback) return;

      options.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const response = btn.getAttribute("data-response");
          if (!response) return;

          options.forEach(function (o) {
            o.classList.remove("is-selected");
            o.setAttribute("aria-pressed", "false");
          });

          btn.classList.add("is-selected");
          btn.setAttribute("aria-pressed", "true");

          feedback.hidden = false;

          const paragraphs = feedback.querySelectorAll("p[data-for]");
          paragraphs.forEach(function (p) {
            const match = p.getAttribute("data-for") === response;
            p.classList.toggle("is-shown", match);
          });
        });
      });
    });
  }

  /* Tarjetas de tipos de tiempo: resaltado al interactuar */
  function initTimeTypes() {
    const cards = document.querySelectorAll(".time-type");
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.setAttribute("tabindex", "0");

      function activate() {
        cards.forEach(function (c) {
          c.classList.remove("is-focused");
        });
        card.classList.add("is-focused");
      }

      card.addEventListener("mouseenter", activate);
      card.addEventListener("focus", activate);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReflectBlocks();
    initTimeTypes();
  });
})();
