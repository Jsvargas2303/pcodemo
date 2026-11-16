(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var filtersToggle = document.querySelector(".filters-toggle");
  var filters = document.querySelector(".filters");
  if (filtersToggle && filters) {
    filtersToggle.addEventListener("click", function () {
      var open = filters.classList.toggle("is-open");
      filtersToggle.setAttribute("aria-expanded", open ? "true" : "false");
      filtersToggle.textContent = open ? "Ocultar filtros" : "Mostrar filtros";
    });
  }

  document.querySelectorAll(".lang").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      group.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
    });
  });

  document.querySelectorAll("form[data-static]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  });
})();
