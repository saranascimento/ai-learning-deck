/*
 * Preenchimento único que cresce conforme a proporção de slides já vistos.
 */
(function () {
  const App = (window.App = window.App || {});

  function initProgressBar(deck, containerEl) {
    const fillEl = document.createElement("div");
    fillEl.className = "progress-bar__fill";
    containerEl.appendChild(fillEl);

    const update = (state) => {
      fillEl.style.width = `${state.progressRatio * 100}%`;
    };

    deck.onChange(update);
    update(deck.getState());
  }

  App.initProgressBar = initProgressBar;
})();
