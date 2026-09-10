/*
 * partials — helpers puros de string HTML, compartilhados pelos renderers de
 * página (home/area/module agora; concept na R3.5.6).
 *
 * Regra: só o que já é necessário e claramente reutilizável. Sem mini-framework,
 * sem generalização antecipada, sem recriar o helper DOM `el()`.
 *
 * escapeHtml / escapeAttr moram em html.mjs (R3.5.2); re-exportados aqui para os
 * renderers terem um único ponto de import.
 */
import { escapeHtml, escapeAttr } from "./html.mjs";
export { escapeHtml, escapeAttr };

/**
 * num(index) → "01".."99" — numeração pedagógica dos kickers (Área/Módulo/
 * Conceito). Mesmo formato de views.js (`String(i + 1).padStart(2, "0")`).
 */
export function num(index) {
  return String(index + 1).padStart(2, "0");
}

// Textos dos chips — NENHUM vem do dataset (regra R1). Derivados das dimensões:
//   essential      → ESSENCIAL          (só quando concept.essential === true)
//   canonical      → CONCEITO-BASE / REVISITA
//   learningFocus  → CONCEITUAL / PRÁTICO   (omitidos com { compact: true })
// note/collision/isNew/relocated/suggestions NUNCA viram chip.
// Mesmas regras de views.js › markerChips; o title "essencial" foi reescrito
// nível-neutro (DevAtlas serve todos os níveis — sem "Senior Software Engineer").
const CHIP_TITLE = {
  "chip--essential": "conceito essencial",
  "chip--c": "conceito-base — lar canônico do conceito",
  "chip--r": "revisita de um conceito-base anterior",
  "chip--conceptual": "domínio conceitual — compreender, explicar, raciocinar",
  "chip--practical": "domínio prático — implementar, aplicar, diagnosticar",
};

function chip(cls, text) {
  return `<span class="chip ${cls}" title="${escapeAttr(CHIP_TITLE[cls])}">${escapeHtml(text)}</span>`;
}

/**
 * renderChipList(concept, { compact }) → string de <span class="chip …"> em
 * sequência (sem wrapper — o chamador envolve). `compact` (lista de Concepts do
 * Module) omite CONCEITUAL/PRÁTICO, igual a views.js.
 */
export function renderChipList(concept, { compact = false } = {}) {
  const focus = concept.learningFocus || [];
  const chips = [];
  if (concept.essential) chips.push(chip("chip--essential", "ESSENCIAL"));
  chips.push(concept.canonical ? chip("chip--c", "CONCEITO-BASE") : chip("chip--r", "REVISITA"));
  if (!compact) {
    if (focus.indexOf("conceptual") !== -1) chips.push(chip("chip--conceptual", "CONCEITUAL"));
    if (focus.indexOf("practical") !== -1) chips.push(chip("chip--practical", "PRÁTICO"));
  }
  return chips.join("");
}

// ---- relações navegáveis (R2) — Requires / Revisita de / Revisitado em -----
// Mesmo markup de views.js › relationPill / refList. `raw` sempre verbatim.
// Contrato R2: resolved → <a> clicável; ambiguous/unresolved → <span> apagado,
// NUNCA link. `ref` = { raw, href, kind } (resolved) | { raw, status } (flagged).

/** renderRelationPill(ref) → um pill (usado standalone p/ "Revisita de"). */
export function renderRelationPill(ref) {
  if (ref && ref.href) {
    return (
      `<a class="relation-pill" href="${escapeAttr(ref.href)}" data-ref-kind="${escapeAttr(ref.kind)}">` +
      `<span class="relation-pill__label">${escapeHtml(ref.raw)}</span>` +
      `<span class="relation-pill__arrow" aria-hidden="true">→</span></a>`
    );
  }
  return (
    `<span class="relation-pill relation-pill--flagged" data-ref-status="${escapeAttr(ref && ref.status)}">` +
    `<span class="relation-pill__label">${escapeHtml(ref && ref.raw)}</span></span>`
  );
}

/** renderRelationList(refs) → <ul class="relation-list"> de <li> com pills. */
export function renderRelationList(refs) {
  return (
    '<ul class="relation-list">' +
    refs.map((r) => `<li class="relation-list__item">${renderRelationPill(r)}</li>`).join("") +
    "</ul>"
  );
}
