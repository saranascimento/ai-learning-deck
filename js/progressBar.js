/*
 * Constrói um segmento por slide dentro da barra de progresso. Cada segmento
 * herda a cor de tema (data-accent) do próprio slide e só é preenchido quando
 * o deck já passou por ele — a cor de um tema anterior permanece "gravada"
 * na barra em vez de ser sobrescrita quando um novo tema começa.
 */
(function () {
  const App = (window.App = window.App || {});

  function initProgressBar(deck, containerEl) {
    const segments = deck.slides.map((slide) => {
      const segmentEl = document.createElement("div");
      segmentEl.className = "progress-bar__segment";
      segmentEl.style.setProperty("--segment-accent", slide.dataset.accent || "var(--color-accent)");
      containerEl.appendChild(segmentEl);
      return segmentEl;
    });

    const update = (state) => {
      segments.forEach((segmentEl, i) => {
        segmentEl.classList.toggle("is-filled", i <= state.currentIndex);
      });
    };

    deck.onChange(update);
    update(deck.getState());
  }

  App.initProgressBar = initProgressBar;
})();
