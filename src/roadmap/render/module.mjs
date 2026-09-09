/*
 * module — renderer puro da página de Module do DevAtlas (nível Concept).
 *
 * Dados → string HTML. Sem DOM, sem I/O. Recebe um view-model já pronto (o build
 * monta a partir de model + paths); não conhece model, paths, domínio nem deploy.
 * O shell (doctype/html/head/header/footer) vem de html.mjs.
 *
 * Preserva a tela de Module atual (views.js › renderModule) com as melhorias
 * semânticas já aprovadas (plano Fase 4):
 *   - breadcrumb <nav aria-label="Breadcrumb"><ol class="crumbs"><li> (3 níveis)
 *     + aria-current="page" no Module atual;
 *   - lista de Concepts <ol><li><a> (antes: <a> filho direto de <ol>).
 * O wrapper <div class="view view--module" style="--area-color"> é o da SPA.
 * Zero CSS novo.
 *
 * Chips da lista de Concepts = modo COMPACT (só ESSENCIAL + CONCEITO-BASE/
 * REVISITA); CONCEITUAL/PRÁTICO só aparecem na página de Concept (R3.5.6),
 * igual a views.js. `note`/`collision`/`isNew` NUNCA aparecem.
 * Requires do Module: mesmo markup da SPA (field + relation-list + relation-pill),
 * hrefs resolvidos por R2 (resolved → link; ambiguous/unresolved → span apagado).
 */
import { renderDocument } from "./html.mjs";
import { escapeHtml, escapeAttr, num, renderChipList } from "./partials.mjs";

/**
 * renderModule({ product, area, module, concepts, requires, homeHref, stylesheets })
 *
 *   product    : { name, tagline, footerText }
 *   area       : { title, href }            (href relativo desta página → página da Area)
 *   module     : { index, title, slug, summary, conceptCount, color }
 *   concepts[] : { index, title, slug, href, essential, canonical, learningFocus }
 *   requires[] : { raw, kind, href } (resolved) | { raw, status } (flagged)
 *   homeHref   : href relativo da Home a partir desta página
 *   stylesheets: hrefs de CSS já resolvidos para a profundidade desta página
 */
export function renderModule({ product, area, module, concepts, requires = [], homeHref, stylesheets }) {
  const kicker = ("Módulo " + num(module.index)).toUpperCase();

  const rows = concepts.map((c) => {
    const chips = renderChipList(c, { compact: true });
    return [
      "          <li>",
      `            <a class="track__row track__row--concept" href="${escapeAttr(c.href)}">`,
      `              <span class="track__num">${escapeHtml(num(c.index))}</span>`,
      `              <span class="track__title">${escapeHtml(c.title)}<span class="track__chips">${chips}</span></span>`,
      '              <span class="track__arrow" aria-hidden="true">→</span>',
      "            </a>",
      "          </li>",
    ].join("\n");
  });

  const requiresSection = requires.length
    ? [
        '        <section class="detail-block">',
        '          <div class="field">',
        '            <div class="field__label">Requires (módulo)</div>',
        '            <div class="field__body">',
        '              <ul class="relation-list">',
        ...requires.map(renderRequirePill),
        "              </ul>",
        "            </div>",
        "          </div>",
        "        </section>",
      ]
    : [];

  const main = [
    `      <div class="view view--module" style="--area-color: ${escapeAttr(module.color)}">`,
    '        <nav aria-label="Breadcrumb">',
    '          <ol class="crumbs">',
    `            <li class="crumbs__item"><a class="crumbs__link" href="${escapeAttr(homeHref)}">${escapeHtml(product.name)}</a></li>`,
    `            <li class="crumbs__item"><span class="crumbs__sep" aria-hidden="true">/</span> <a class="crumbs__link" href="${escapeAttr(area.href)}">${escapeHtml(area.title)}</a></li>`,
    `            <li class="crumbs__item"><span class="crumbs__sep" aria-hidden="true">/</span> <span class="crumbs__here" aria-current="page">${escapeHtml(module.title)}</span></li>`,
    "          </ol>",
    "        </nav>",
    '        <header class="page-head">',
    `          <p class="page-head__kicker">${escapeHtml(kicker)}</p>`,
    `          <h1 class="page-head__title">${escapeHtml(module.title)}</h1>`,
    ...(module.summary ? [`          <p class="page-head__desc">${escapeHtml(module.summary)}</p>`] : []),
    `          <p class="page-head__meta">${module.conceptCount} conceitos</p>`,
    "        </header>",
    '        <ol class="track track--page">',
    ...rows,
    "        </ol>",
    ...requiresSection,
    "      </div>",
  ].join("\n");

  return renderDocument({
    title: module.title + " · " + product.name,
    homeHref,
    homeLabel: product.name,
    navLabel: product.name,
    footerText: product.footerText,
    stylesheets,
    main,
  });
}

// Pill de relação (Requires). resolved → <a> clicável com seta;
// ambiguous/unresolved → <span> apagado, sem link (contrato R2).
function renderRequirePill(r) {
  if (r.href) {
    return (
      `                <li class="relation-list__item"><a class="relation-pill" href="${escapeAttr(r.href)}" data-ref-kind="${escapeAttr(r.kind)}">` +
      `<span class="relation-pill__label">${escapeHtml(r.raw)}</span>` +
      `<span class="relation-pill__arrow" aria-hidden="true">→</span></a></li>`
    );
  }
  return (
    `                <li class="relation-list__item"><span class="relation-pill relation-pill--flagged" data-ref-status="${escapeAttr(r.status)}">` +
    `<span class="relation-pill__label">${escapeHtml(r.raw)}</span></span></li>`
  );
}
