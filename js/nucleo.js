/**
 * EL NÚCLEO DE LA VERDAD — Mini-experiencia final
 * Diálogo tipográfico breve y opciones demostrativas (sin servidor).
 */
(function () {
  "use strict";

  const DIALOGUE =
    "A veces, las mejores ideas no deberían quedarse solamente en palabras. ¿No crees?";

  const PASSWORD = "nucleo de la verdad";

  const THANKS = {
    conocer:
      "Gracias por su interés. Estaré encantado de compartirle más detalles sobre El Núcleo de la Verdad.",
    conversar:
      "Gracias por abrir la puerta a esa conversación. Será un gusto hablar sobre la propuesta con usted.",
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNucleo() {
    const root = document.getElementById("nucleo");
    if (!root) return;

    const steps = root.querySelectorAll(".nucleo-step");
    const dialogText = document.getElementById("nucleoDialogText");
    const dialogNext = document.getElementById("nucleoDialogNext");
    const thanksBox = document.getElementById("nucleoThanks");
    const thanksText = document.getElementById("nucleoThanksText");
    const choices = root.querySelectorAll(".nucleo-choice");
    const gateForm = document.getElementById("nucleoGateForm");
    const passwordInput = document.getElementById("nucleoPassword");
    const gateError = document.getElementById("nucleoGateError");

    let typingTimer = null;
    let dialogStarted = false;
    let unlocked = false;

    function normalizePassword(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function showStep(name) {
      if ((name === "dialog" || name === "proposal" || name === "finale") && !unlocked) {
        name = "gate";
      }

      steps.forEach(function (step) {
        const match = step.getAttribute("data-nucleo-step") === name;
        step.hidden = !match;
        step.classList.toggle("is-active", match);
      });

      if (name === "gate" && passwordInput) {
        if (gateError) gateError.hidden = true;
        setTimeout(function () {
          passwordInput.focus();
        }, 120);
      }

      if (name === "dialog" && !dialogStarted) {
        dialogStarted = true;
        startTypewriter();
      }

      root.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    }

    function startTypewriter() {
      if (!dialogText || !dialogNext) return;

      const panel = dialogText.closest(".nucleo-dialog__panel");
      if (panel) panel.classList.remove("is-complete");

      dialogNext.hidden = true;
      dialogText.textContent = "";

      if (prefersReduced) {
        dialogText.textContent = DIALOGUE;
        dialogNext.hidden = false;
        if (panel) panel.classList.add("is-complete");
        return;
      }

      let i = 0;
      clearInterval(typingTimer);
      typingTimer = setInterval(function () {
        dialogText.textContent = DIALOGUE.slice(0, i + 1);
        i += 1;
        if (i >= DIALOGUE.length) {
          clearInterval(typingTimer);
          dialogNext.hidden = false;
          if (panel) panel.classList.add("is-complete");
        }
      }, 28);
    }

    root.querySelectorAll("[data-nucleo-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const next = btn.getAttribute("data-nucleo-next");
        if (next) showStep(next);
      });
    });

    choices.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const key = btn.getAttribute("data-nucleo-choice");
        if (!key || !thanksBox || !thanksText) return;

        choices.forEach(function (c) {
          c.classList.remove("is-selected");
          c.disabled = true;
        });
        btn.classList.add("is-selected");

        thanksText.textContent = THANKS[key] || THANKS.conocer;
        thanksBox.hidden = false;
      });
    });

    if (gateForm && passwordInput) {
      gateForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const attempt = normalizePassword(passwordInput.value);
        const expected = normalizePassword(PASSWORD);

        if (attempt === expected) {
          unlocked = true;
          if (gateError) gateError.hidden = true;
          passwordInput.value = "";
          showStep("dialog");
          return;
        }

        unlocked = false;
        if (gateError) gateError.hidden = false;
        passwordInput.value = "";
        passwordInput.focus();
        passwordInput.classList.add("is-invalid");
        setTimeout(function () {
          passwordInput.classList.remove("is-invalid");
        }, 450);
      });
    }

    // Si el usuario llega por ancla directa a #nucleo, asegura el paso intro
    if (window.location.hash === "#nucleo") {
      showStep("intro");
    }
  }

  document.addEventListener("DOMContentLoaded", initNucleo);
})();
