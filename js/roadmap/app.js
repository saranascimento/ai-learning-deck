/*
 * Bootstrap do Roadmap Senior: liga App.router → App.views, troca o conteúdo de
 * #app a cada rota, atualiza document.title e move o foco/scroll para o topo.
 *
 * Estrutura navegável apenas para os Epics com Fase 2 concluída (status "navigable").
 * Rotas para Epics "structuring" caem em "não encontrado" — o card na Home não linka.
 */
(function () {
  const App = (window.App = window.App || {});
  const model = App.roadmapModel;
  const views = App.views;
  const router = App.router;
  const BASE_TITLE = (App.roadmapMeta && App.roadmapMeta.title) || "Roadmap Senior";

  const appEl = document.getElementById("app");

  function resolve(route) {
    if (route.view === "home") return { node: views.home(), title: BASE_TITLE };

    const epic = model.epic(route.epic);
    if (!epic || epic.status !== "navigable") return { node: views.notFound(), title: "Não encontrado · " + BASE_TITLE };

    if (route.view === "epic") return { node: views.epic(epic), title: epic.title + " · " + BASE_TITLE };

    const story = model.story(route.epic, route.story);
    if (!story) return { node: views.notFound(), title: "Não encontrado · " + BASE_TITLE };

    if (route.view === "story") return { node: views.story(epic, story), title: story.title + " · " + epic.title + " · " + BASE_TITLE };

    const task = model.task(route.epic, route.story, route.task);
    if (!task) return { node: views.notFound(), title: "Não encontrado · " + BASE_TITLE };

    return { node: views.task(epic, story, task), title: task.title + " · " + story.title + " · " + BASE_TITLE };
  }

  function render(route) {
    const resolved = resolve(route);
    appEl.textContent = "";
    appEl.appendChild(resolved.node);
    document.title = resolved.title;
    window.scrollTo(0, 0);
    // acessibilidade: leva o foco para o novo conteúdo em cada troca de rota
    appEl.setAttribute("tabindex", "-1");
    appEl.focus({ preventScroll: true });
  }

  // Re-render em mudança de progresso (relevante só quando progressEnabled).
  window.addEventListener("roadmap:progress", function () {
    if (App.config && App.config.progressEnabled) render(router.current());
  });

  router.subscribe(render);
  router.start();
})();
