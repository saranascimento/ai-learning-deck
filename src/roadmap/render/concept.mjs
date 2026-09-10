/*
 * concept — renderer puro da Concept Study Page do DevAtlas (folha da hierarquia).
 *
 * Porte 1:1 de views.js › renderConcept (a Concept Study Page da R3), para
 * string. Sem DOM, sem I/O. Recebe view-model pronto do build; não conhece
 * model/paths/domínio/deploy. Shell (doctype/html/head/header/footer) = html.mjs.
 *
 * Estrutura (R3, aprovada):
 *   breadcrumb 4 níveis · header (kicker + h1 + .markers) ·
 *   .detail-block { Resumo · Pré-requisitos (Requires) · [Revisita de] ·
 *     [Subtópicos] · [Revisitado em] · [Recursos] } ·
 *   .study-area { h2 "Área de estudo" + 3 <section.study-panel>
 *     data-study-panel = conteudo/exemplos/exercicio } ·
 *   [nav.concept-nav prev/next]
 *
 * R3.5.6 = SÓ o HTML base (pré-enhancement). As 3 seções de estudo ficam
 * SEQUENCIAIS e VISÍVEIS sem JavaScript. NÃO adiciona `hidden`, `role="tab*"`,
 * `role="tablist"` nem tabindex — isso é o enhancement de tabs (R3.5.8), que
 * usa os hooks `data-study-tabs` / `data-study-panel` já presentes aqui.
 *
 * note/collision/isNew/relocated/suggestions: NÃO aparecem (metadata editorial).
 * summary/content/examples/exercise: hoje sempre vazios → empty states (a SPA
 * também só renderiza empty state nas 3 seções; preenchimento = R5+).
 */
import { renderDocument } from "./html.mjs";
import { escapeHtml, escapeAttr, num, renderChipList, renderRelationList, renderRelationPill } from "./partials.mjs";

const EMPTY = {
  resumo: "Resumo ainda não disponível.",
  conteudo: "Conteúdo ainda não disponível.",
  exemplos: "Exemplos ainda não disponíveis.",
  exercicio: "Exercício ainda não disponível.",
};

// <section class="concept-section" aria-labelledby><hN>…</hN><div body></div>
function conceptSection(id, label, level, bodyHtml) {
  return [
    `          <section class="concept-section" aria-labelledby="${id}">`,
    `            <h${level} id="${id}" class="concept-section__title">${escapeHtml(label)}</h${level}>`,
    `            <div class="concept-section__body">${bodyHtml}</div>`,
    "          </section>",
  ].join("\n");
}

// Painel da Área de estudo — sempre empty state na R3.5.6 (igual à SPA).
function studyPanel(key, label, emptyText) {
  return [
    `            <section class="study-panel" data-study-panel="${key}">`,
    `              <h3 class="concept-section__title study-panel__title">${escapeHtml(label)}</h3>`,
    `              <p class="empty-state">${escapeHtml(emptyText)}</p>`,
    "            </section>",
  ].join("\n");
}

function taglist(items, asLink) {
  return (
    '<ul class="taglist">' +
    items
      .map((it) =>
        asLink
          ? `<li class="taglist__item"><a href="${escapeAttr(it.href)}">${escapeHtml(it.label)}</a></li>`
          : `<li class="taglist__item">${escapeHtml(it)}</li>`
      )
      .join("") +
    "</ul>"
  );
}

/**
 * renderConcept(vm) → documento HTML.
 *   vm.product    : { name, tagline, footerText }
 *   vm.area       : { title, href }
 *   vm.module     : { title, href }
 *   vm.concept    : { index, title, slug, color, essential, canonical,
 *                     learningFocus, summary, subtopics[] }
 *   vm.requires   : ref[]        vm.revisit : ref[]     (ref = {raw,href,kind}|{raw,status})
 *   vm.revisitOf  : ref | null
 *   vm.resources  : { label, href }[]
 *   vm.prev/next  : { title, href } | null
 *   vm.homeHref, vm.stylesheets
 */
export function renderConcept(vm) {
  const { product, area, module, concept, requires, revisitOf, revisit, resources, prev, next, homeHref, stylesheets } = vm;
  const kicker = ("Conceito " + num(concept.index)).toUpperCase();

  const fixed = [
    conceptSection(
      "concept-resumo",
      "Resumo",
      2,
      concept.summary ? `<p>${escapeHtml(concept.summary)}</p>` : `<p class="empty-state">${EMPTY.resumo}</p>`
    ),
    conceptSection(
      "concept-requires",
      "Pré-requisitos (Requires)",
      2,
      requires.length ? renderRelationList(requires) : '<span class="muted">nenhum</span>'
    ),
  ];
  if (revisitOf) fixed.push(conceptSection("concept-revisitof", "Revisita de", 2, renderRelationPill(revisitOf)));
  if (concept.subtopics.length) fixed.push(conceptSection("concept-subtopics", "Subtópicos", 2, taglist(concept.subtopics, false)));
  if (revisit.length) fixed.push(conceptSection("concept-revisit", "Revisitado em", 2, renderRelationList(revisit)));
  if (resources.length) fixed.push(conceptSection("concept-resources", "Recursos", 2, taglist(resources, true)));

  const navLinks = [];
  if (prev) {
    navLinks.push(
      `          <a class="concept-nav__link concept-nav__link--prev" href="${escapeAttr(prev.href)}" rel="prev" aria-label="Conceito anterior: ${escapeAttr(
        prev.title
      )}">← ${escapeHtml(prev.title)}</a>`
    );
  }
  if (next) {
    navLinks.push(
      `          <a class="concept-nav__link concept-nav__link--next" href="${escapeAttr(next.href)}" rel="next" aria-label="Próximo conceito: ${escapeAttr(
        next.title
      )}">${escapeHtml(next.title)} →</a>`
    );
  }

  const main = [
    `      <div class="view view--concept concept-study" style="--area-color: ${escapeAttr(concept.color)}">`,
    '        <nav aria-label="Breadcrumb">',
    '          <ol class="crumbs">',
    `            <li class="crumbs__item"><a class="crumbs__link" href="${escapeAttr(homeHref)}">${escapeHtml(product.name)}</a></li>`,
    `            <li class="crumbs__item"><span class="crumbs__sep" aria-hidden="true">/</span> <a class="crumbs__link" href="${escapeAttr(
      area.href
    )}">${escapeHtml(area.title)}</a></li>`,
    `            <li class="crumbs__item"><span class="crumbs__sep" aria-hidden="true">/</span> <a class="crumbs__link" href="${escapeAttr(
      module.href
    )}">${escapeHtml(module.title)}</a></li>`,
    `            <li class="crumbs__item"><span class="crumbs__sep" aria-hidden="true">/</span> <span class="crumbs__here" aria-current="page">${escapeHtml(
      concept.title
    )}</span></li>`,
    "          </ol>",
    "        </nav>",
    '        <header class="page-head">',
    `          <p class="page-head__kicker">${escapeHtml(kicker)}</p>`,
    `          <h1 class="page-head__title">${escapeHtml(concept.title)}</h1>`,
    `          <div class="markers" role="group" aria-label="Classificações">${renderChipList(concept, {})}</div>`,
    "        </header>",
    '        <div class="detail-block">',
    ...fixed,
    "        </div>",
    '        <section class="study-area" aria-labelledby="concept-study-heading">',
    '          <h2 id="concept-study-heading" class="concept-section__title">Área de estudo</h2>',
    '          <div class="study-area__panels" data-study-tabs="">',
    studyPanel("conteudo", "Conteúdo", EMPTY.conteudo),
    studyPanel("exemplos", "Exemplos", EMPTY.exemplos),
    studyPanel("exercicio", "Exercício", EMPTY.exercicio),
    "          </div>",
    "        </section>",
    ...(navLinks.length
      ? ['        <nav class="concept-nav" aria-label="Navegação entre conceitos">', ...navLinks, "        </nav>"]
      : []),
    "      </div>",
  ].join("\n");

  return renderDocument({
    title: concept.title + " · " + product.name,
    homeHref,
    homeLabel: product.name,
    navLabel: product.name,
    footerText: product.footerText,
    stylesheets,
    main,
  });
}
