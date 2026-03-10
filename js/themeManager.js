export default function themeManager() {
  const themeButtons = document.querySelectorAll("[data-theme]");

  if (themeButtons.length === 0) return;

  let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  let theme = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : prefersDark
      ? "dark"
      : "ligth";

  const init = () => {
    document.body.classList.toggle("dark", theme === "dark" || prefersDark);
    document.querySelector(`[data-theme="${theme}"]`).classList.add("active");

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (theme === "system") {
          change(document.querySelector('[data-theme="system"'), theme);
        }
      });

    themeButtons.forEach((button) => {
      button.addEventListener("click", () =>
        change(button, button.dataset.theme),
      );
    });
  };

  const change = (button, newTheme) => {
    themeButtons.forEach((button) => button.classList.remove("active"));
    theme = newTheme;

    prefersDark =
      theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    localStorage.setItem("theme", theme);

    document.body.classList.toggle("dark", theme === "dark" || prefersDark);
    button.classList.add("active");
  };

  return {
    init,
  };
}
