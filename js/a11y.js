// Accessibility panel: faithful port of the live site's
// AccessibilityToolbar. Text size steps -2..+4 (12.5% each), high
// contrast, readable font, reset. Same a11y-prefs storage format as
// production. Additions over the live component: focus moves into the
// panel on open and back to the launcher on close, and every change is
// announced through a polite live region.
(function () {
  var root = document.documentElement;
  var launcher = document.getElementById("a11y-launcher");
  var panel = document.getElementById("a11y-panel");
  if (!launcher || !panel) return;

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

  var prefs = { textSize: 0, highContrast: false, dyslexia: false };
  try {
    var saved = JSON.parse(localStorage.getItem("a11y-prefs") || "{}");
    if (typeof saved.textSize === "number") prefs.textSize = saved.textSize;
    prefs.highContrast = !!saved.highContrast;
    prefs.dyslexia = !!saved.dyslexia;
  } catch (err) {}

  function save() {
    try {
      localStorage.setItem("a11y-prefs", JSON.stringify(prefs));
    } catch (err) {}
  }

  var contrastSwitch = document.getElementById("a11y-contrast");
  var fontSwitch = document.getElementById("a11y-font");

  function apply() {
    root.style.fontSize = 100 + prefs.textSize * 12.5 + "%";
    if (prefs.highContrast) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    document.body.classList.toggle("a11y-dyslexia", prefs.dyslexia);
    contrastSwitch.setAttribute("aria-checked", String(prefs.highContrast));
    fontSwitch.setAttribute("aria-checked", String(prefs.dyslexia));
  }

  function openPanel() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    var first = panel.querySelector("button");
    if (first) first.focus();
  }

  function closePanel(refocus) {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    if (refocus) launcher.focus();
  }

  launcher.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else closePanel(true);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closePanel(true);
  });

  document.addEventListener("click", function (e) {
    if (!panel.hidden && !e.target.closest("#a11y-panel") && !e.target.closest("#a11y-launcher")) {
      closePanel(false);
    }
  });

  function sizeLabel() {
    if (prefs.textSize === 0) return "default";
    return 100 + prefs.textSize * 12.5 + " percent";
  }

  document.getElementById("a11y-text-dec").addEventListener("click", function () {
    prefs.textSize = Math.max(-2, prefs.textSize - 1);
    save();
    apply();
    announce("Text size " + sizeLabel());
  });

  document.getElementById("a11y-text-inc").addEventListener("click", function () {
    prefs.textSize = Math.min(4, prefs.textSize + 1);
    save();
    apply();
    announce("Text size " + sizeLabel());
  });

  contrastSwitch.addEventListener("click", function () {
    prefs.highContrast = !prefs.highContrast;
    save();
    apply();
    announce(prefs.highContrast ? "High contrast on" : "High contrast off");
  });

  fontSwitch.addEventListener("click", function () {
    prefs.dyslexia = !prefs.dyslexia;
    save();
    apply();
    announce(prefs.dyslexia ? "Readable font on" : "Readable font off");
  });

  document.getElementById("a11y-reset").addEventListener("click", function () {
    prefs = { textSize: 0, highContrast: false, dyslexia: false };
    save();
    apply();
    announce("All accessibility settings reset");
  });

  apply();
})();
