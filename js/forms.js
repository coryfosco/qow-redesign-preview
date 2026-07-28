// Preview-only form handling. The design preview has no backend, so a
// plain submit would reload or jump to the top and read as broken.
// Instead: validate natively, then show a focused, announced
// confirmation that says clearly this is the preview.
(function () {
  var MESSAGES = {
    checklist:
      "This is the design preview, so nothing was sent. On the finished site, the checklist would now be on its way to your inbox.",
    b2b:
      "This is the design preview, so nothing was sent. On the finished site, Cory would receive your request and reply personally.",
    contact:
      "This is the design preview, so nothing was sent. On the finished site, your message would go straight to Cory.",
  };

  function kind(form) {
    if (form.querySelector("#checklist-email")) return "checklist";
    if (form.querySelector("#b2b-request-type")) return "b2b";
    return "contact";
  }

  Array.prototype.slice.call(document.querySelectorAll("form")).forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var note = document.createElement("div");
      note.className = "card form-confirm";
      note.setAttribute("role", "status");
      note.setAttribute("tabindex", "-1");
      var p = document.createElement("p");
      p.textContent = MESSAGES[kind(form)];
      note.appendChild(p);
      form.parentNode.insertBefore(note, form);
      form.hidden = true;
      note.focus();
    });
  });
})();
