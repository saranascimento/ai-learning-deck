/*
 * home — renderer puro da Home do DevAtlas (nível Área).
 *
 * Função de dados → string HTML. Sem DOM, sem I/O. Recebe um view-model já
 * pronto (o build monta a partir de model + paths); não conhece model, paths,
 * domínio nem deploy. O shell vem de html.mjs — este módulo NÃO duplica shell.
 *
 * Preserva o conteúdo/estrutura da Home atual (views.js › renderHome/areaCard).
 * Semântica/UX aprovadas para a v0:
 *   - <ul>/<li> para a lista de Áreas (antes: <section> com <article> soltos);
 *   - card navegável = o CARD INTEIRO é <a class="area-card"> (uma superfície de
 *     navegação por card; sai o CTA "Abrir área →", sem link sobreposto, sem JS);
 *   - título = <h2 class="area-card__title"> texto (sem link);
 *   - Home é a raiz da navegação → NENHUM breadcrumb.
 *
 * A identidade do produto (DevAtlas + tagline) vem em `product` — separada do
 * roadmapMeta, que descreve só o conjunto de conteúdo (as 7 Áreas).
 */
import { renderDocument } from "./html.mjs";
import { escapeHtml, escapeAttr, num } from "./partials.mjs";

/**
 * renderHome({ product, areas, decks, homeHref, stylesheets }) → documento HTML.
 *
 *   product     : { name, tagline, footerText }
 *   areas[]     : { index, title, slug, navigable, summary, color,
 *                   moduleCount, conceptCount, href }
 *   decks[]     : { title, url }   (rodapé de aprofundamento; [] = sem rodapé)
 *   homeHref    : href relativo da Home (para o link do shell)
 *   stylesheets : hrefs de CSS já resolvidos
 */
export function renderHome({ product, areas, decks = [], homeHref, stylesheets = [] }) {
  const main = [
    '      <header class="masthead">',
    `        <h1 class="masthead__title">${escapeHtml(product.name)}</h1>`,
    `        <p class="masthead__subtitle">${escapeHtml(product.tagline)}</p>`,
    "      </header>",
    '      <ul class="area-grid" aria-label="Áreas do DevAtlas">',
    ...areas.map(renderAreaCard),
    "      </ul>",
    ...(decks.length ? [renderDecks(decks)] : []),
  ].join("\n");

  return renderDocument({
    title: product.name,
    homeHref,
    homeLabel: product.name,
    navLabel: product.name,
    footerText: product.footerText,
    stylesheets,
    main,
  });
}

// Card de Área. Navegável: o CARD INTEIRO é o <a class="area-card"> (uma única
// superfície de navegação por card; sem CTA "Abrir área →", sem link sobreposto,
// sem JS). Não-navegável: <li class="area-card ..."> sem link. Em ambos os casos
// o <li> é bare — .area-grid > li vira flex (css/roadmap.css) para o <a>.area-card
// esticar até a altura da linha do grid, mantendo cards de mesma altura.
function renderAreaCard(a) {
  const kicker = ("Área " + num(a.index)).toUpperCase();
  const countText = a.navigable
    ? `${a.moduleCount} módulos · ${a.conceptCount} conceitos`
    : `${a.moduleCount} módulos planejados`;

  const inner = [
    `            <p class="area-card__kicker">${escapeHtml(kicker)}</p>`,
    `            <h2 class="area-card__title">${escapeHtml(a.title)}</h2>`,
    `            <p class="area-card__desc">${escapeHtml(a.summary)}</p>`,
    ...(a.navigable ? [] : ['            <p class="area-card__badge">Em estruturação</p>']),
    `            <p class="area-card__foot"><span class="area-card__count">${escapeHtml(countText)}</span></p>`,
  ].join("\n");

  if (a.navigable) {
    return [
      "        <li>",
      `          <a class="area-card" href="${escapeAttr(a.href)}" style="--area-color: ${escapeAttr(a.color)}">`,
      inner,
      "          </a>",
      "        </li>",
    ].join("\n");
  }
  return [
    `        <li class="area-card area-card--structuring" style="--area-color: ${escapeAttr(a.color)}">`,
    inner,
    "        </li>",
  ].join("\n");
}

// Rodapé de decks — <footer> dentro de <main> (não é o contentinfo do site).
function renderDecks(decks) {
  const links = decks
    .map((d) => `<a href="${escapeAttr(d.url)}">${escapeHtml(d.title)}</a>`)
    .join('<span class="home-decks__sep"> · </span>');
  return [
    '      <footer class="home-decks">',
    '        <span class="home-decks__label">Decks de aprofundamento:</span>',
    `        <span class="home-decks__links">${links}</span>`,
    "      </footer>",
  ].join("\n");
}
