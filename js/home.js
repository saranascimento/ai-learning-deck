/*
 * Renderiza o catálogo de apresentações (App.presentations) como cards
 * clicáveis na Home. Puramente data-driven: nenhuma mudança aqui é
 * necessária para adicionar/remover apresentações do catálogo.
 */
(function () {
  const App = (window.App = window.App || {});

  function renderCatalog(containerEl, presentations) {
    presentations.forEach((presentation) => {
      const card = document.createElement("a");
      card.className = "catalog-card";
      card.href = presentation.url;

      const title = document.createElement("h2");
      title.className = "catalog-card__title";
      title.textContent = presentation.title;

      const description = document.createElement("p");
      description.className = "catalog-card__description";
      description.textContent = presentation.description;

      const cta = document.createElement("span");
      cta.className = "catalog-card__cta";
      cta.textContent = presentation.cta;

      card.append(title, description, cta);
      containerEl.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCatalog(document.getElementById("catalog"), App.presentations);
  });
})();
