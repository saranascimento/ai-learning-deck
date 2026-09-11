/*
 * concept — renderer puro da Concept Study Page do DevAtlas (folha da hierarquia).
 *
 * Base: porte 1:1 de views.js › renderConcept (R3). R3.5.11 redesenha só esta
 * página (Home/Area/Module inalteradas) com cards com ícone, code blocks com
 * cabeçalho (arquivo + Copiar) e syntax highlighting, e tabs com ícone — sem
 * mudar o contrato estrutural: breadcrumb 4 níveis, .detail-block, .study-area
 * com 3 <section data-study-panel>, nav prev/next.
 *
 * Estrutura:
 *   breadcrumb 4 níveis · header (kicker + h1 + [subtítulo] + .markers) ·
 *   .detail-block { Resumo (card) · grid { Pré-requisitos · [Relacionado a] }
 *     · [Revisita de] · [Subtópicos] · [Recursos] (cards) } ·
 *   .study-area { h2 "Área de estudo" + 3 <section.study-panel> com ícone
 *     data-study-panel = conteudo/exemplos/exercicio } ·
 *   [nav.concept-nav prev/next]
 *
 * O HTML base é SÓ pré-enhancement: as 3 seções de estudo ficam SEQUENCIAIS e
 * VISÍVEIS sem JavaScript. O renderer NÃO adiciona `hidden`, `role="tab*"`,
 * `role="tablist"` nem tabindex nos painéis. Botão "Copiar" é HTML estático
 * inerte sem JS (funcional só com `assets/concept-tabs.js`); "Ver solução" é
 * `<details>/<summary>` nativo, sempre funcional (zero JS necessário).
 *
 * R3.5.7: quando `vm.enhancementScript` vem preenchido, o documento carrega
 * `<script type="module" src="…/assets/concept-tabs.js">` ao fim do <body> —
 * progressive enhancement que promove `[data-study-tabs]` / `[data-study-panel]`
 * ao padrão APG Tabs, e wire o botão Copiar (Clipboard API). Sem o script,
 * nada muda no HTML base.
 *
 * note: R3.5.11 passa a exibir como subtítulo sob o H1 (tradução curta do
 * termo em inglês) quando presente — deixou de ser 100% invisível. collision/
 * isNew/relocated/suggestions continuam NÃO aparecendo (metadata editorial).
 * summary/content/examples/exercise: vazios → empty state; quando o dataset
 * traz dados estruturados (piloto: Abstraction), o renderer produz o HTML
 * real — nenhum branching por slug, só por presença de dado.
 */
import { renderDocument } from "./html.mjs";
import { escapeHtml, escapeAttr, num, renderChipList, renderRelationList, renderRelationPill } from "./partials.mjs";
import { icon } from "./icons.mjs";
import { highlight } from "./highlight.mjs";

const EMPTY = {
  resumo: "Resumo ainda não disponível.",
  conteudo: "Conteúdo ainda não disponível.",
  exemplos: "Exemplos ainda não disponíveis.",
  exercicio: "Exercício ainda não disponível.",
};

const PANEL_ICON = { conteudo: "book", exemplos: "code", exercicio: "pencil" };

// Bloco de código — cabeçalho (ícone arquivo + filename/language + botão
// Copiar, inerte sem JS) + <pre><code> com highlight() (sempre escapado
// antes de virar <span> — o dataset nunca é HTML confiável).
function renderCode({ language, code, filename }) {
  const lang = language || "text";
  const label = filename || lang;
  return [
    '              <div class="code-block">',
    '                <div class="code-block__header">',
    `                  ${icon("file", "code-block__file-icon")}`,
    `                  <span class="code-block__filename">${escapeHtml(label)}</span>`,
    '                  <button type="button" class="code-block__copy" data-copy-code>',
    `                    ${icon("clipboard", "code-block__copy-icon")}`,
    '                    <span data-copy-label>Copiar</span>',
    "                  </button>",
    "                </div>",
    `                <pre class="code-block__pre"><code class="code-block__code language-${escapeAttr(lang)}">${highlight(code, lang)}</code></pre>`,
    "              </div>",
  ].join("\n");
}

// concept.content: { type: "heading" | "paragraph" | "code" | "takeaway", ... }[] | null
function renderContentBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === "heading") return `              <h4 class="content-block__heading">${escapeHtml(block.text)}</h4>`;
      if (block.type === "code") return renderCode(block);
      if (block.type === "takeaway") {
        return [
          '              <div class="takeaway">',
          `                <p class="takeaway__label">${icon("check-circle", "takeaway__icon")}<span>Em resumo</span></p>`,
          `                <p class="takeaway__body">${escapeHtml(block.text)}</p>`,
          "              </div>",
        ].join("\n");
      }
      return `              <p>${escapeHtml(block.text)}</p>`;
    })
    .join("\n");
}

// concept.examples: { title, context, code: {language,code,filename}|null, explanation }[]
function renderExamples(examples) {
  return (
    '              <ol class="example-list">\n' +
    examples
      .map(
        (ex, i) =>
          '                <li class="example">\n' +
          `                  <p class="example__number">${num(i)}</p>\n` +
          `                  <h4 class="example__title">${escapeHtml(ex.title)}</h4>\n` +
          `                  <p class="example__context">${escapeHtml(ex.context)}</p>\n` +
          (ex.code ? renderCode(ex.code) + "\n" : "") +
          `                  <p class="example__explanation">${escapeHtml(ex.explanation)}</p>\n` +
          "                </li>"
      )
      .join("\n") +
    "\n              </ol>"
  );
}

// concept.exercise: { problem, problemCode:{language,code,filename}|null, task, hint,
//                      solution: { code:{language,code,filename}|null, explanation } }
function renderExercise(ex) {
  const problemBody = [`<p>${escapeHtml(ex.problem)}</p>`, ex.problemCode ? renderCode(ex.problemCode) : ""].filter(Boolean).join("\n");
  return [
    card("exercise-problem", "target", "Problema", problemBody, 4, "info-card--exercise"),
    card("exercise-task", "checklist", "Sua tarefa", `<p>${escapeHtml(ex.task)}</p>`, 4, "info-card--exercise"),
    card("exercise-hint", "lightbulb", "Dica", `<p>${escapeHtml(ex.hint)}</p>`, 4, "info-card--exercise"),
    '              <details class="solution-toggle">',
    `                <summary class="solution-toggle__summary">${icon("eye")}<span>Ver solução</span><span class="solution-toggle__arrow" aria-hidden="true">→</span></summary>`,
    '                <div class="solution-toggle__body">',
    ex.solution.code ? renderCode(ex.solution.code) : "",
    `                  <p>${escapeHtml(ex.solution.explanation)}</p>`,
    "                </div>",
    "              </details>",
  ].join("\n");
}

// Card com ícone (Resumo/Pré-requisitos/Relacionado a/Revisita de/Subtópicos/
// Recursos/Problema/Sua tarefa/Dica). `level` = nível do heading real
// (2 no detail-block, 4 dentro do painel Exercício — mantém hierarquia sob
// o h3 do painel). id/aria-labelledby preservam o contrato de âncora.
function card(id, iconName, label, bodyHtml, level, extraClass) {
  const tag = `h${level}`;
  return [
    `          <section class="info-card${extraClass ? " " + extraClass : ""}" aria-labelledby="${id}">`,
    `            <${tag} id="${id}" class="info-card__title">${icon(iconName, "info-card__icon")}<span>${escapeHtml(label)}</span></${tag}>`,
    `            <div class="info-card__body">${bodyHtml}</div>`,
    "          </section>",
  ].join("\n");
}

// Painel da Área de estudo — bodyHtml real quando o Concept tem dado
// estruturado (dataset); senão empty state (igual à SPA/R3.5.6). h3 ganha
// ícone (book/code/pencil) — decorativo, o texto ao lado carrega o rótulo.
function studyPanel(key, label, emptyText, bodyHtml) {
  return [
    `            <section class="study-panel" data-study-panel="${key}">`,
    `              <h3 class="concept-section__title study-panel__title">${icon(PANEL_ICON[key], "study-panel__icon")}<span>${escapeHtml(label)}</span></h3>`,
    bodyHtml || `              <p class="empty-state">${escapeHtml(emptyText)}</p>`,
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
 *                     learningFocus, summary, note, subtopics[],
 *                     content[]|null, examples[], exercise|null }
 *   vm.requires   : ref[]        vm.revisit : ref[]     (ref = {raw,href,kind}|{raw,status})
 *   vm.revisitOf  : ref | null
 *   vm.resources  : { label, href }[]
 *   vm.prev/next  : { title, href } | null
 *   vm.homeHref, vm.stylesheets
 *   vm.enhancementScript : href relativo do <script type="module"> de tabs, ou
 *                          "" / ausente para não emitir <script> (R3.5.7)
 */
export function renderConcept(vm) {
  const { product, area, module, concept, requires, revisitOf, revisit, resources, prev, next, homeHref, stylesheets, enhancementScript } = vm;
  const kicker = ("Conceito " + num(concept.index)).toUpperCase();

  const contentHtml = concept.content && concept.content.length ? renderContentBlocks(concept.content) : null;
  const examplesHtml = concept.examples && concept.examples.length ? renderExamples(concept.examples) : null;
  const exerciseHtml = concept.exercise ? renderExercise(concept.exercise) : null;

  const resumoCard = card(
    "concept-resumo",
    "info",
    "Resumo",
    concept.summary ? `<p>${escapeHtml(concept.summary)}</p>` : `<p class="empty-state">${EMPTY.resumo}</p>`,
    2
  );
  const requiresCard = card(
    "concept-requires",
    "link",
    "Pré-requisitos",
    requires.length ? renderRelationList(requires) : '<span class="muted">nenhum</span>',
    2
  );
  const relatedCard = revisit.length ? card("concept-revisit", "share", "Relacionado a", renderRelationList(revisit), 2) : null;
  const gridHtml = ['          <div class="detail-block__grid">', requiresCard, ...(relatedCard ? [relatedCard] : []), "          </div>"].join("\n");

  const extraCards = [];
  if (revisitOf) extraCards.push(card("concept-revisitof", "link", "Revisita de", renderRelationPill(revisitOf), 2));
  if (concept.subtopics.length) extraCards.push(card("concept-subtopics", "checklist", "Subtópicos", taglist(concept.subtopics, false), 2));
  if (resources.length) extraCards.push(card("concept-resources", "file", "Recursos", taglist(resources, true), 2));

  const detailBlock = ['        <div class="detail-block">', resumoCard, gridHtml, ...extraCards, "        </div>"].join("\n");

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
    ...(concept.note ? [`          <p class="page-head__subtitle">${escapeHtml(concept.note)}</p>`] : []),
    `          <div class="markers" role="group" aria-label="Classificações">${renderChipList(concept, {})}</div>`,
    "        </header>",
    detailBlock,
    '        <section class="study-area" aria-labelledby="concept-study-heading">',
    '          <h2 id="concept-study-heading" class="concept-section__title">Área de estudo</h2>',
    '          <div class="study-area__panels" data-study-tabs="">',
    studyPanel("conteudo", "Conteúdo", EMPTY.conteudo, contentHtml),
    studyPanel("exemplos", "Exemplos", EMPTY.exemplos, examplesHtml),
    studyPanel("exercicio", "Exercício", EMPTY.exercicio, exerciseHtml),
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
    scripts: enhancementScript ? [enhancementScript] : [],
  });
}
