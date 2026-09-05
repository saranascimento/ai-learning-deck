/*
 * App.router — roteamento client-side por hash. Funciona em file:// e em qualquer
 * host estático; back/forward e deep-link nativos do browser.
 *
 * Rotas:
 *   #/                                  → home
 *   #/e/:epic                           → epic  (Área)
 *   #/e/:epic/s/:story                  → story (Módulo)
 *   #/e/:epic/s/:story/t/:task          → task  (Conceito)
 *   (qualquer outra)                    → notfound
 */
(function () {
  const App = (window.App = window.App || {});
  const listeners = [];

  function parse(hash) {
    const raw = String(hash || "").replace(/^#/, "");
    const path = raw.replace(/^\/+|\/+$/g, "");
    if (path === "" || path === "/") return { view: "home" };

    const parts = path.split("/");
    if (parts[0] === "e" && parts[1]) {
      const route = { view: "epic", epic: decodeURIComponent(parts[1]) };
      if (parts[2] === "s" && parts[3]) {
        route.view = "story";
        route.story = decodeURIComponent(parts[3]);
        if (parts[4] === "t" && parts[5]) {
          route.view = "task";
          route.task = decodeURIComponent(parts[5]);
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
    epic: function (epic) {
      return "#/e/" + encodeURIComponent(epic.slug);
    },
    story: function (story) {
      return "#/e/" + encodeURIComponent(story.epic.slug) + "/s/" + encodeURIComponent(story.slug);
    },
    task: function (task) {
      return (
        "#/e/" +
        encodeURIComponent(task.epic.slug) +
        "/s/" +
        encodeURIComponent(task.story.slug) +
        "/t/" +
        encodeURIComponent(task.slug)
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

  App.router = router;
})();
