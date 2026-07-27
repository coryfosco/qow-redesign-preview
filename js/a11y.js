// Accessibility controls: text size and high contrast, persisted per visitor.
(function () {
  var root = document.documentElement;

  function apply() {
    var ts = localStorage.getItem("a11y-textsize") || "";
    var hc = localStorage.getItem("a11y-contrast") === "true";
    if (ts) root.setAttribute("data-textsize", ts);
    else root.removeAttribute("data-textsize");
    if (hc) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    document.querySelectorAll(".a11y-btn[data-textsize]").forEach(function (b) {
      b.setAttribute("aria-pressed", String((b.getAttribute("data-textsize") || "") === ts));
    });
    var c = document.getElementById("a11y-contrast");
    if (c) c.setAttribute("aria-pressed", String(hc));
  }

  document.querySelectorAll(".a11y-btn[data-textsize]").forEach(function (b) {
    b.addEventListener("click", function () {
      localStorage.setItem("a11y-textsize", b.getAttribute("data-textsize") || "");
      apply();
    });
  });

  var c = document.getElementById("a11y-contrast");
  if (c)
    c.addEventListener("click", function () {
      localStorage.setItem("a11y-contrast", String(localStorage.getItem("a11y-contrast") !== "true"));
      apply();
    });

  apply();
})();
