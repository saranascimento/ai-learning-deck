/*
 * router — roteamento client-side por hash. Funciona em qualquer host estático;
 * back/forward e deep-link nativos do browser.
 *
 * Rotas:
 *   #/                                                    → home
 *   #/areas/:area                                         → area   (Área)
 *   #/areas/:area/modules/:module                         → module (Módulo)
 *   #/areas/:area/modules/:module/concepts/:concept       → concept (Conceito)
 *   (qualquer outra)                                      → notfound
 */
const listeners = [];

function parse(hash) {
  const raw = String(hash || "").replace(/^#/, "");
  const path = raw.replace(/^\/+|\/+$/g, "");
  if (path === "" || path === "/") return { view: "home" };

  const parts = path.split("/");
  if (parts[0] === "areas" && parts[1]) {
    const route = { view: "area", area: decodeURIComponent(parts[1]) };
    if (parts[2] === "modules" && parts[3]) {
      route.view = "module";
      route.module = decodeURIComponent(parts[3]);
      if (parts[4] === "concepts" && parts[5]) {
        route.view = "concept";
        route.concept = decodeURIComponent(parts[5]);
      }
    }
    return route;
  }
  return { view: "notfound", path: path };
}

const router = {
  parse: parse,

  current: function () {
    return parse(window.location.hash);
  },

  // Constrói hrefs de rota — usar em <a href>.
  home: function () {
    return "#/";
  },
  area: function (area) {
    return "#/areas/" + encodeURIComponent(area.slug);
  },
  module: function (module) {
    return "#/areas/" + encodeURIComponent(module.area.slug) + "/modules/" + encodeURIComponent(module.slug);
  },
  concept: function (concept) {
    return (
      "#/areas/" +
      encodeURIComponent(concept.area.slug) +
      "/modules/" +
      encodeURIComponent(concept.module.slug) +
      "/concepts/" +
      encodeURIComponent(concept.slug)
    );
  },

  go: function (href) {
    if (window.location.hash === href) router.emit();
    else window.location.hash = href;
  },

  subscribe: function (fn) {
    listeners.push(fn);
  },

  emit: function () {
    const route = router.current();
    listeners.forEach((fn) => fn(route));
  },

  start: function () {
    window.addEventListener("hashchange", router.emit);
    router.emit();
  },
};

export { router };
