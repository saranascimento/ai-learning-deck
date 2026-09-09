/*
 * area — renderer puro da página de Area do DevAtlas (nível Module).
 *
 * Dados → string HTML. Sem DOM, sem I/O. Recebe um view-model já pronto (o build
 * monta a partir de model + paths); não conhece model, paths, domínio nem deploy.
 * O shell (doctype/html/head/header/footer) vem de html.mjs — NÃO duplica aqui.
 *
 * Preserva a tela de Area atual (views.js › renderArea) com as melhorias
 * semânticas já aprovadas no plano da R3.5 (Fase 3):
 *   - breadcrumb como <nav aria-label="Breadcrumb"><ol class="crumbs"><li>…>
 *     (antes: <nav class="crumbs"> com <span>/<a> soltos) + aria-current="page";
 *   - lista de Modules como <ol><li><a> (antes: <a> filho direto de <ol>).
 * O wrapper <div class="view view--area" style="--area-color"> é o mesmo da SPA
 * (mantém o espaçamento vertical e a cor da Area). Zero CSS novo.
 *
 * Na tela de Area atual NÃO existem: chips na lista de Modules, Requires,
 * decks/resources. Nada disso é inventado aqui.
 */
import { renderDocument } from "./html.mjs";
import { escapeHtml, escapeAttr, num } from "./partials.mjs";

/**
 * renderArea({ product, area, modules, homeHref, stylesheets }) → documento HTML.
 *
 *   product     : { name, tagline, footerText }
 *   area        : { index, title, slug, summary, color, moduleCount, conceptCount }
 *   modules[]   : { index, title, slug, conceptCount, href }   (href relativo à Area)
 *   homeHref    : href relativo da Home a partir desta página ("../../")
 *   stylesheets : hrefs de CSS já resolvidos para a profundidade desta página
 */
export function renderArea({ product, area, modules, homeHref, stylesheets }) {
  const kicker = ("Área " + num(area.index)).toUpperCase();

  const main = [
    `      <div class="view view--area" style="--area-color: ${escapeAttr(area.color)}">`,
    '        <nav aria-label="Breadcrumb">',
    '          <ol class="crumbs">',
    `            <li class="crumbs__item"><a class="crumbs__link" href="${escapeAttr(homeHref)}">${escapeHtml(product.name)}</a></li>`,
    `            <li class="crumbs__item"><span class="crumbs__sep" aria-hidden="true">/</span> <span class="crumbs__here" aria-current="page">${escapeHtml(area.title)}</span></li>`,
    "          </ol>",
    "        </nav>",
    '        <header class="page-head">',
    `          <p class="page-head__kicker">${escapeHtml(kicker)}</p>`,
    `          <h1 class="page-head__title">${escapeHtml(area.title)}</h1>`,
    `          <p class="page-head__desc">${escapeHtml(area.summary)}</p>`,
    `          <p class="page-head__meta">${area.moduleCount} módulos · ${area.conceptCount} conceitos</p>`,
    "        </header>",
    '        <ol class="track track--page">',
    ...modules.map(renderModuleRow),
    "        </ol>",
    "      </div>",
  ].join("\n");

  return renderDocument({
    title: area.title + " · " + product.name,
    homeHref,
    homeLabel: product.name,
    navLabel: product.name,
    footerText: product.footerText,
    stylesheets,
    main,
  });
}

// Linha da lista de Modules — <li><a class="track__row">. O <li> corrige o <a>
// filho direto de <ol>; .track é flex-column, então o <li> não precisa de CSS.
function renderModuleRow(m) {
  return [
    "          <li>",
    `            <a class="track__row" href="${escapeAttr(m.href)}">`,
    `              <span class="track__num">${escapeHtml(num(m.index))}</span>`,
    `              <span class="track__title">${escapeHtml(m.title)}</span>`,
    `              <span class="track__meta">${m.conceptCount} conceitos</span>`,
    '              <span class="track__arrow" aria-hidden="true">→</span>',
    "            </a>",
    "          </li>",
  ].join("\n");
}
