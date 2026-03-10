export default function themeManager() {
  const themeButtons = document.querySelectorAll("[data-theme]");
  if (!themeButtons.length) return;

  const mediaColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  let prefersDark = mediaColorScheme.matches;

  const storedTheme = localStorage.getItem("theme");

  let theme = storedTheme ? storedTheme : prefersDark ? "dark" : "ligth";

  const isDark = () => theme === "dark" || (theme === "system" && prefersDark);

  const change = (button, newTheme) => {
    themeButtons.forEach((btn) => btn.classList.remove("active"));

    theme = newTheme;
    localStorage.setItem("theme", theme);

    document.body.classList.toggle("dark", isDark());
    button.classList.add("active");
  };

  const init = () => {
    document.body.classList.toggle("dark", isDark());
    document.querySelector(`[data-theme="${theme}"]`).classList.add("active");

    mediaColorScheme.addEventListener("change", (e) => {
      prefersDark = e.matches;

      if (theme === "system") {
        change(document.querySelector('[data-theme="system"]'), theme);
      }
    });

    themeButtons.forEach((button) => {
      button.addEventListener("click", () =>
        change(button, button.dataset.theme),
      );
    });
  };

  return {
    init,
  };
}
