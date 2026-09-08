/*
 * progress — progresso de estudo por Concept (TODO | STUDYING | DONE).
 *
 * ARQUITETURA PREPARADA, DESLIGADA NESTA 1ª VERSÃO: config.progressEnabled === false.
 * A API existe e funciona sempre; a UI (toggles, contadores de progresso, "Continuar
 * estudando") só é renderizada quando a flag estiver ligada — ver src/roadmap/ui/views.js.
 *
 * Persistência: localStorage, chave "App:roadmap:progress:v1" = { "<conceptId>": "STUDYING" | "DONE" }.
 * Só entradas não-default são gravadas (Concept sem entrada = TODO). Se localStorage lançar
 * (modo privado), a API vira no-op silencioso.
 */
import { roadmapModel } from "../model/roadmap-model.js";

export const config = { progressEnabled: false };

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

  getStatus: function (conceptId) {
    return safeRead()[conceptId] || "TODO";
  },

  setStatus: function (conceptId, status) {
    if (STATUSES.indexOf(status) === -1) return;
    const map = safeRead();
    if (status === "TODO") delete map[conceptId];
    else map[conceptId] = status;
    safeWrite(map);
    window.dispatchEvent(new CustomEvent("roadmap:progress", { detail: { conceptId: conceptId, status: status } }));
  },

  cycleStatus: function (conceptId) {
    const next = STATUSES[(STATUSES.indexOf(progress.getStatus(conceptId)) + 1) % STATUSES.length];
    progress.setStatus(conceptId, next);
    return next;
  },

  // { done, total } de Concepts descendentes DONE de uma Area ou Module.
  rollup: function (node) {
    const model = roadmapModel;
    const concepts =
      node.kind === "module"
        ? model.concepts(node)
        : (node.modules || []).reduce((acc, m) => acc.concat(model.concepts(m)), []);
    const map = safeRead();
    const done = concepts.filter((c) => map[c.id] === "DONE").length;
    return { done: done, total: concepts.length };
  },

  // Primeiro Concept não-DONE na ordem pedagógica global.
  nextRecommendedConcept: function () {
    const map = safeRead();
    return roadmapModel.flattenConcepts().find((c) => map[c.id] !== "DONE") || null;
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

export { progress };
