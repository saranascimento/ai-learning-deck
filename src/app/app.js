/*
 * Bootstrap do Roadmap Senior: liga router → views, troca o conteúdo de
 * #app a cada rota, atualiza document.title e move o foco/scroll para o topo.
 *
 * Único entrypoint do browser — index.html carrega só este módulo.
 * Estrutura navegável apenas para as Areas com status "navigable".
 */
import { roadmapModel as model } from "../roadmap/model/roadmap-model.js";
import { roadmapMeta } from "../roadmap/data/index.js";
import { views } from "../roadmap/ui/views.js";
import { router } from "../roadmap/routing/router.js";
import { config } from "../roadmap/progress/progress.js";

const BASE_TITLE = (roadmapMeta && roadmapMeta.title) || "Roadmap Senior";

const appEl = document.getElementById("app");

function resolve(route) {
  if (route.view === "home") return { node: views.home(), title: BASE_TITLE };

  const area = model.area(route.area);
  if (!area || area.status !== "navigable") return { node: views.notFound(), title: "Não encontrado · " + BASE_TITLE };

  if (route.view === "area") return { node: views.area(area), title: area.title + " · " + BASE_TITLE };

  const module = model.module(route.area, route.module);
  if (!module) return { node: views.notFound(), title: "Não encontrado · " + BASE_TITLE };

  if (route.view === "module") return { node: views.module(area, module), title: module.title + " · " + area.title + " · " + BASE_TITLE };

  const concept = model.concept(route.area, route.module, route.concept);
  if (!concept) return { node: views.notFound(), title: "Não encontrado · " + BASE_TITLE };

  return { node: views.concept(area, module, concept), title: concept.title + " · " + module.title + " · " + BASE_TITLE };
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
  if (config && config.progressEnabled) render(router.current());
});

router.subscribe(render);
router.start();
