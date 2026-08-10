/*
 * Utilitário de revelação progressiva de elementos [data-fragment]
 * dentro de um slide (usado tanto por diagramas quanto por listas/texto).
 */
(function () {
  const App = (window.App = window.App || {});

  function getFragments(slideEl) {
    return Array.from(slideEl.querySelectorAll("[data-fragment]"));
  }

  function applyFragments(fragments, revealedCount) {
    fragments.forEach((el, i) => {
      el.classList.toggle("is-visible", i < revealedCount);
    });
  }

  App.fragments = { getFragments, applyFragments };
})();
