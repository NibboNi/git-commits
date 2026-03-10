import themeManager from "./themeManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const inputEL = document.querySelector("#text");
  const typeEl = document.querySelector("#type");
  const warningMessageEl = document.querySelector("#warning");
  const buttonEl = document.querySelector("#copy");
  const scopeEl = document.querySelector("#scope");
  const breakingChangeEl = document.querySelector("#breakingChange");
  const debugEl = document.querySelector("#debug");
  const debugCommitEl = document.querySelector("#debugCommit");
  const copyAsCommandEl = document.querySelector("#command");
  const warningsEl = document.querySelector("#warnings");

  const theme = themeManager();
  theme.init();

  let commitType = typeEl.value;
  let commitMessage = "";
  let commitIsBreakingChange = false;
  let showWarnings = warningsEl.checked;

  warningsEl.addEventListener("input", () => {
    showWarnings = !showWarnings;

    warningMessageEl.classList.toggle("hide", !showWarnings);
  });

  debugEl.addEventListener("input", () => {
    debugCommitEl.classList.toggle("hide", !debugEl.checked);
  });

  copyAsCommandEl.addEventListener("input", () => {
    generateCommit(
      commitType,
      scopeEl.value,
      inputEL.value,
      commitIsBreakingChange,
    );
  });

  breakingChangeEl.addEventListener("input", () => {
    document.querySelector("#colon").textContent = breakingChangeEl.checked
      ? ") !:"
      : ") :";
    commitIsBreakingChange = breakingChangeEl.checked;

    generateCommit(
      commitType,
      scopeEl.value,
      inputEL.value,
      commitIsBreakingChange,
    );
  });

  typeEl.addEventListener("change", () => {
    commitType = typeEl.value;
    generateCommit(
      commitType,
      scopeEl.value,
      inputEL.value,
      commitIsBreakingChange,
    );
  });

  scopeEl.addEventListener("input", () => {
    resizeScope(scopeEl, scopeEl.value.length);
    generateCommit(
      commitType,
      scopeEl.value,
      inputEL.value,
      commitIsBreakingChange,
    );

    if (scopeEl.value === "") {
      scopeEl.style.width = "5ch";
    }
  });

  inputEL.addEventListener("input", () =>
    generateCommit(
      commitType,
      scopeEl.value,
      inputEL.value,
      commitIsBreakingChange,
    ),
  );

  buttonEl.addEventListener("click", copyCommit);

  function generateCommit(type, scope = "", message, breakingChange = false) {
    const countEl = document.querySelector("#count");
    const regexCap = /^[A-Z]/;
    const regexPun = /\.$/;
    const maxLength = 50;
    let warningMessage = "";

    if (regexCap.exec(message)) {
      warningMessage = "El mensaje del commit no debe comenzar con mayúscula.";
    }
    if (regexPun.exec(message)) {
      warningMessage = "El mensaje del commit no debe terminar con un punto.";
    }

    commitMessage = `${type}${scope !== "" ? `(${scope})` : ""}${breakingChange ? "!:" : ":"} ${message}`;

    debugCommitEl.innerHTML = " ";

    const debugMessage = copyAsCommandEl.checked
      ? `git commit -m "${commitMessage}"`
      : commitMessage;

    for (let i = 0; i < debugMessage.length; i++) {
      const charEl = document.createElement("SPAN");

      if (debugMessage[i].trim() === "") {
        charEl.textContent = ".";
        charEl.classList.add("cammo");
      } else {
        charEl.textContent = debugMessage[i];
      }

      debugCommitEl.appendChild(charEl);
    }

    countEl.textContent = commitMessage.length;

    if (commitMessage.length > maxLength) {
      warningMessage = `El mensaje del commit debe tener como máximo ${maxLength} caracteres.`;
    }

    warningMessageEl.textContent = warningMessage;
    if (showWarnings) {
      warningMessageEl.classList.toggle("hide", warningMessage === "");
    }
  }

  async function copyCommit() {
    const type = "text/plain";
    const clipboardItemData = {
      [type]: copyAsCommandEl.checked
        ? `git commit -m "${commitMessage}"`
        : commitMessage,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);

    if (inputEL.value.trim() !== "") {
      await navigator.clipboard.write([clipboardItem]);

      destroyFeedback();
      createFeedback();

      setTimeout(() => {
        destroyFeedback();
      }, 3000);
    }
  }

  function createFeedback() {
    const feedbackEl = document.createElement("P");
    feedbackEl.textContent = "¡Copiado al portapapeles!";
    feedbackEl.id = "feedback";

    document.body.appendChild(feedbackEl);
  }

  function destroyFeedback() {
    const feedbackEl = document.querySelector("#feedback");
    if (feedbackEl) {
      feedbackEl.remove();
    }
  }

  function resizeScope(scopeEl, textLength) {
    scopeEl.style.width = `${textLength}ch`;
  }
});
