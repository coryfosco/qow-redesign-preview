// Accessibility controls: text size and high contrast, persisted per
// visitor. Every change is announced through a polite live region so
// screen reader users get confirmation instead of silence.
(function () {
  var root = document.documentElement;

  // Live region for state announcements
  var live = document.createElement("div");
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.className = "sr-only";
  document.body.appendChild(live);

  function announce(msg) {
    live.textContent = "";
    requestAnimationFrame(function () {
      live.textContent = msg;
    });
  }

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      /* private browsing: still apply for this page view */
    }
  }

  function read(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  var state = {
    textsize: read("a11y-textsize") || "",
    contrast: read("a11y-contrast") === "true",
  };

  function apply() {
    if (state.textsize) root.setAttribute("data-textsize", state.textsize);
    else root.removeAttribute("data-textsize");
    if (state.contrast) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    document.querySelectorAll(".a11y-btn[data-textsize]").forEach(function (b) {
      b.setAttribute(
        "aria-pressed",
        String((b.getAttribute("data-textsize") || "") === state.textsize)
      );
    });
    var c = document.getElementById("a11y-contrast");
    if (c) c.setAttribute("aria-pressed", String(state.contrast));
  }

  var SIZE_NAMES = { "": "default", lg: "larger", xl: "largest" };

  document.querySelectorAll(".a11y-btn[data-textsize]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.textsize = b.getAttribute("data-textsize") || "";
      store("a11y-textsize", state.textsize);
      apply();
      announce("Text size set to " + SIZE_NAMES[state.textsize]);
    });
  });

  var c = document.getElementById("a11y-contrast");
  if (c)
    c.addEventListener("click", function () {
      state.contrast = !state.contrast;
      store("a11y-contrast", String(state.contrast));
      apply();
      announce(state.contrast ? "High contrast on" : "High contrast off");
    });

  apply();
})();
