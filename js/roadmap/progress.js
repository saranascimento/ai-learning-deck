/*
 * App.progress — progresso de estudo por Task (TODO | STUDYING | DONE).
 *
 * ARQUITETURA PREPARADA, DESLIGADA NESTA 1ª VERSÃO: App.config.progressEnabled === false.
 * A API existe e funciona sempre; a UI (toggles, contadores de progresso, "Continuar
 * estudando") só é renderizada quando a flag estiver ligada — ver js/roadmap/views.js.
 *
 * Persistência: localStorage, chave "App:roadmap:progress:v1" = { "<taskId>": "STUDYING" | "DONE" }.
 * Só entradas não-default são gravadas (Task sem entrada = TODO). Se localStorage lançar
 * (modo privado, file:// em alguns browsers), a API vira no-op silencioso.
 */
(function () {
  const App = (window.App = window.App || {});
  App.config = Object.assign({ progressEnabled: false }, App.config);

  const KEY = "App:roadmap:progress:v1";
  const STATUSES = ["TODO", "STUDYING", "DONE"];
  const LABELS = { TODO: "A estudar", STUDYING: "Estudando", DONE: "Estudado" };

  function safeRead() {
    try {
      return JSON.parse(window.localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function safeWrite(map) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(map));
    } catch (e) {
      /* no-op */
    }
  }

  const progress = {
    STATUSES: STATUSES,
    LABELS: LABELS,

    getStatus: function (taskId) {
      return safeRead()[taskId] || "TODO";
    },

    setStatus: function (taskId, status) {
      if (STATUSES.indexOf(status) === -1) return;
      const map = safeRead();
      if (status === "TODO") delete map[taskId];
      else map[taskId] = status;
      safeWrite(map);
      window.dispatchEvent(new CustomEvent("roadmap:progress", { detail: { taskId: taskId, status: status } }));
    },

    cycleStatus: function (taskId) {
      const next = STATUSES[(STATUSES.indexOf(progress.getStatus(taskId)) + 1) % STATUSES.length];
      progress.setStatus(taskId, next);
      return next;
    },

    // { done, total } de Tasks descendentes DONE de um Epic ou Story.
    rollup: function (node) {
      const model = App.roadmapModel;
      const tasks =
        node.jiraType === "story"
          ? model.tasks(node)
          : (node.stories || []).reduce((acc, s) => acc.concat(model.tasks(s)), []);
      const map = safeRead();
      const done = tasks.filter((t) => map[t.id] === "DONE").length;
      return { done: done, total: tasks.length };
    },

    // Primeira Task não-DONE na ordem pedagógica global.
    nextRecommendedTask: function () {
      const map = safeRead();
      return App.roadmapModel.flattenTasks().find((t) => map[t.id] !== "DONE") || null;
    },

    reset: function () {
      try {
        window.localStorage.removeItem(KEY);
      } catch (e) {
        /* no-op */
      }
      window.dispatchEvent(new CustomEvent("roadmap:progress", { detail: { reset: true } }));
    },
  };

  App.progress = progress;
})();
