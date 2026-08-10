/*
 * Liga teclado (setas) e botões prev/next ao Deck; atualiza estado disabled dos botões.
 */
(function () {
  const App = (window.App = window.App || {});

  function initNavigation(deck) {
    const prevBtn = document.querySelector('[data-nav="prev"]');
    const nextBtn = document.querySelector('[data-nav="next"]');

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        deck.next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        deck.prev();
      }
    });

    nextBtn.addEventListener("click", () => deck.next());
    prevBtn.addEventListener("click", () => deck.prev());

    deck.onChange((state) => {
      prevBtn.disabled = !state.canGoPrev;
      nextBtn.disabled = !state.canGoNext;
    });
  }

  App.initNavigation = initNavigation;
})();
