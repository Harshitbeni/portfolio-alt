(function () {
  try {
    var theme = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark =
      theme === "dark" ||
      ((theme === "system" || theme == null) && prefersDark);
    if (dark && theme !== "light") {
      document.documentElement.classList.add("dark");
    }
  } catch {
    // Ignore storage access errors (private mode, etc).
  }
})();
