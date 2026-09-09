/*
 * partials — helpers puros de string HTML, compartilhados pelos renderers de
 * página (home.mjs agora; area/module/concept nas próximas etapas).
 *
 * Regra: só o que já é necessário e claramente reutilizável. Sem mini-framework,
 * sem generalização antecipada, sem recriar o helper DOM `el()`.
 *
 * escapeHtml / escapeAttr moram em html.mjs (R3.5.2); re-exportados aqui para os
 * renderers terem um único ponto de import.
 */
export { escapeHtml, escapeAttr } from "./html.mjs";

/**
 * num(index) → "01".."99" — numeração pedagógica dos kickers (Área/Módulo/
 * Conceito). Mesmo formato de views.js (`String(i + 1).padStart(2, "0")`).
 */
export function num(index) {
  return String(index + 1).padStart(2, "0");
}
