/*
 * home — renderer puro da Home do DevAtlas (nível Área).
 *
 * Função de dados → string HTML. Sem DOM, sem I/O. Recebe um view-model já
 * pronto (o build monta a partir de model + paths); não conhece model, paths,
 * domínio nem deploy. O shell vem de html.mjs — este módulo NÃO duplica shell.
 *
 * Preserva o conteúdo/estrutura da Home atual (views.js › renderHome/areaCard).
 * Melhorias semânticas já aprovadas no plano da R3.5:
 *   - <ul>/<li> para a lista de Áreas (antes: <section> com <article> soltos);
 *   - título da Área sempre <h2> (antes: <a> nu p/ navegável, <h2> p/ não nav.);
 *   - UM link por card — o <h2><a>; o "Abrir área →" redundante sai.
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

// Card de Área — <li class="area-card">. Não usa <article> aninhado: isso
// quebraria o esticar-para-altura-da-linha do grid (o <li> é o item do grid) e
// exigiria CSS novo, fora do escopo desta etapa.
function renderAreaCard(a) {
  const kicker = ("Área " + num(a.index)).toUpperCase();
  const titleInner = a.navigable
    ? `<a class="area-card__title--link" href="${escapeAttr(a.href)}">${escapeHtml(a.title)}</a>`
    : escapeHtml(a.title);
  const countText = a.navigable
    ? `${a.moduleCount} módulos · ${a.conceptCount} conceitos`
    : `${a.moduleCount} módulos planejados`;

  const lines = [
    `        <li class="area-card${a.navigable ? "" : " area-card--structuring"}" style="--area-color: ${escapeAttr(a.color)}">`,
    `          <p class="area-card__kicker">${escapeHtml(kicker)}</p>`,
    `          <h2 class="area-card__title">${titleInner}</h2>`,
    `          <p class="area-card__desc">${escapeHtml(a.summary)}</p>`,
  ];
  if (!a.navigable) lines.push('          <p class="area-card__badge">Em estruturação</p>');
  lines.push(`          <p class="area-card__foot"><span class="area-card__count">${escapeHtml(countText)}</span></p>`);
  lines.push("        </li>");
  return lines.join("\n");
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
