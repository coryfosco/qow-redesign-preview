// Disclosure navigation per the WAI-ARIA Authoring Practices pattern.
// Open moves focus into the menu so screen reader users land on the first
// choice; arrow keys move within a menu; Escape closes and restores focus;
// outside interaction closes.
(function () {
  var toggles = Array.prototype.slice.call(
    document.querySelectorAll(".nav-toggle[aria-controls]")
  );

  function menuFor(toggle) {
    return document.getElementById(toggle.getAttribute("aria-controls"));
  }

  function itemsIn(menu) {
    return Array.prototype.slice.call(menu.querySelectorAll("a"));
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

  function open(toggle) {
    closeAll(toggle);
    var menu = menuFor(toggle);
    toggle.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    var first = itemsIn(menu)[0];
    if (first) first.focus();
  }

  toggles.forEach(function (toggle) {
    var menu = menuFor(toggle);
    if (!menu) return;

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) close(toggle);
      else open(toggle);
    });

    toggle.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        open(toggle);
      } else if (e.key === "Escape") {
        close(toggle);
      }
    });

    menu.addEventListener("keydown", function (e) {
      var items = itemsIn(menu);
      var i = items.indexOf(document.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        close(toggle);
        toggle.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (i < items.length - 1) items[i + 1].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (i > 0) items[i - 1].focus();
        else toggle.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    });

    // Close when focus leaves the whole nav item (keyboard Tab past the end)
    menu.addEventListener("focusout", function () {
      requestAnimationFrame(function () {
        if (!toggle.closest(".nav-item").contains(document.activeElement)) {
          close(toggle);
        }
      });
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) closeAll();
  });
})();
