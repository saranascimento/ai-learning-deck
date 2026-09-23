/*
 * sidebar — menu lateral das páginas de Área, Módulo e Concept (layout de documentação, etapa 2).
 *
 * Mapa da Área atual: o link da Área, os seus Módulos e — só no Módulo atual — os Concepts,
 * com o item da página marcado por aria-current="page". Os outros Módulos aparecem como
 * links (sem a lista de Concepts), o que mantém o peso da página pequeno; as outras Áreas
 * ficam num <details> no fim.
 *
 * No topo, fora do menu (visível mesmo com o menu fechado no celular), o espaço da busca:
 * `[data-search-slot]` vazio, preenchido por enhance/search.js — restrito à Área atual
 * (data-search-area); a Home busca em todas.
 *
 * Tudo é HTML: o menu é um <details class="doc-menu"> fechado. No desktop o CSS mostra o
 * conteúdo e esconde o botão (::details-content, com @supports); no celular ele é um
 * botão "Menu" que abre e fecha — sem JavaScript em nenhum dos casos.
 *
 * Puro: recebe hrefs já relativos à página; não conhece paths nem o modelo.
 */
import { escapeHtml, escapeAttr } from "./partials.mjs";

const current = (on) => (on ? ' aria-current="page"' : "");

function count(n) {
  return `<span class="doc-nav__count"><span class="visually-hidden">, </span>${n}<span class="visually-hidden"> conceitos</span></span>`;
}

/**
 * renderSidebar(nav) → <aside> (string).
 *   nav.area       : { title, slug, href, color, current }  current = esta página é a da Área
 *   nav.modules[]  : { title, href, conceptCount, current, open, concepts[]? }
 *                    current = esta página é a do Módulo · open = Módulo desta página (Módulo ou Concept)
 *                    concepts[] (só no Módulo aberto): { title, href, current }
 *   nav.otherAreas : { title, href }[]
 */
export function renderSidebar({ area, modules, otherAreas }) {
  const moduleItems = modules.map((m) => {
    const link = `<a class="doc-nav__module" href="${escapeAttr(m.href)}"${current(m.current)}><span>${escapeHtml(m.title)}</span>${count(m.conceptCount)}</a>`;
    if (!m.open) return `          <li>${link}</li>`;
    const concepts = (m.concepts || [])
      .map((c) => `<li><a href="${escapeAttr(c.href)}"${current(c.current)}>${escapeHtml(c.title)}</a></li>`)
      .join("");
    return `          <li class="doc-nav__open">${link}<ol class="doc-nav__concepts">${concepts}</ol></li>`;
  });

  return [
    `    <aside class="doc-sidebar" aria-label="Menu da Área" style="--area-color: ${escapeAttr(area.color)}">`,
    `      <div class="doc-search" data-search-slot="" data-search-area="${escapeAttr(area.slug)}" data-search-area-title="${escapeAttr(area.title)}"></div>`,
    '      <details class="doc-menu">',
    `        <summary class="doc-menu__toggle"><span>Menu</span><span class="doc-menu__area">${escapeHtml(area.title)}</span></summary>`,
    `        <nav aria-label="Módulos de ${escapeAttr(area.title)}">`,
    `          <p class="doc-sidebar__area"><a href="${escapeAttr(area.href)}"${current(area.current)}>${escapeHtml(area.title)}</a></p>`,
    '          <ol class="doc-nav">',
    ...moduleItems,
    "          </ol>",
    "        </nav>",
    '        <details class="doc-sidebar__others">',
    "          <summary>Outras Áreas</summary>",
    `          <ul>${otherAreas.map((a) => `<li><a href="${escapeAttr(a.href)}">${escapeHtml(a.title)}</a></li>`).join("")}</ul>`,
    "        </details>",
    "      </details>",
    "    </aside>",
  ].join("\n");
}
