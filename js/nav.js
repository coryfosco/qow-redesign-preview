// Accessible disclosure dropdowns for the site header.
// Click toggles; Escape closes and returns focus; outside click closes.
(function () {
  var toggles = Array.prototype.slice.call(
    document.querySelectorAll(".nav-toggle[aria-controls]")
  );

  function menuFor(toggle) {
    return document.getElementById(toggle.getAttribute("aria-controls"));
  }

  function close(toggle) {
    toggle.setAttribute("aria-expanded", "false");
    menuFor(toggle).hidden = true;
  }

  function closeAll(except) {
    toggles.forEach(function (t) {
      if (t !== except) close(t);
    });
  }

  toggles.forEach(function (toggle) {
    var menu = menuFor(toggle);
    if (!menu) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      closeAll(toggle);
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });

    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        close(toggle);
        toggle.focus();
      }
    });

    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close(toggle);
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) closeAll();
  });
})();
