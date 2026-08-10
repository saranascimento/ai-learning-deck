/*
 * Ponto de entrada: instancia o Deck a partir dos slides presentes no DOM
 * e liga navegação e barra de progresso.
 */
(function () {
  const App = (window.App = window.App || {});

  document.addEventListener("DOMContentLoaded", () => {
    const slideElements = Array.from(document.querySelectorAll("[data-slide]"));
    const deck = new App.Deck(slideElements);
    deck.init();

    App.initNavigation(deck);
    App.initProgressBar(deck, document.getElementById("progressBar"));
  });
})();
