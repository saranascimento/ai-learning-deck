/*
 * concept — renderer puro da página do Concept do DevAtlas (folha da hierarquia).
 *
 * Layout de documentação (aprovado no protótipo v4, 2026-09-19; implementado de
 * verdade na etapa 1 do layout novo, 2026-09-22):
 *
 *   breadcrumb 4 níveis (largura total) ·
 *   .doc-concept (grade: coluna principal + coluna direita) {
 *     header.page-head { h1 + [data-actions-slot] · chips + [tempo de leitura]
 *                        · [texto de abertura = summary, ou note quando não há summary] }
 *     section.study-area#estudo { h2 "Área de estudo" (só leitor de tela) +
 *       3 <section data-study-panel> conteudo/exemplos/exercicio }
 *     [nav.concept-nav — Anterior/Próximo em cards]
 *     aside.doc-rail { [Neste conteúdo] · Pré-requisitos · [Relacionados]
 *                      · [Subtópicos] · [Recursos] · [atalhos Exemplos/Exercícios] }
 *   }
 *
 * No celular a coluna direita desce para depois das abas (CSS).
 *
 * O HTML base é SÓ pré-enhancement: as 3 seções de estudo ficam SEQUENCIAIS e
 * VISÍVEIS sem JavaScript. O renderer NÃO adiciona `hidden`, `role="tab*"`,
 * `role="tablist"` nem tabindex nos painéis. Sem JS, "Neste conteúdo" e os
 * atalhos são âncoras comuns (#sec-N, #estudo), o botão "Copiar" fica inerte e
 * não há ações no cabeçalho; "Ver solução" é `<details>/<summary>` nativo.
 *
 * `vm.enhancementScript` preenchido → `<script type="module" src="…/assets/concept-tabs.js">`
 * ao fim do <body>: abas APG, Copiar, atalhos que trocam de aba, destaque da
 * seção visível em "Neste conteúdo" e o botão Compartilhar.
 *
 * Blocos de `concept.content` (schema): heading · paragraph · code · takeaway · list · callout · flow.
 *   - texto de paragraph/list/callout/takeaway aceita `código inline` entre crases (renderInline);
 *   - code aceita `label` opcional (mostra selo da linguagem + rótulo, em vez de ícone de arquivo + filename);
 *   - flow = diagrama de caixas com setas (só quando o conceito tem um fluxo real — bloco OPCIONAL);
 *   - tipo de bloco desconhecido ou bloco malformado LANÇA erro (nunca renderiza "undefined" em silêncio).
 *
 * collision/isNew/relocated/suggestions NÃO aparecem (metadata editorial).
 * content/examples/exercise vazios → empty state; nenhum branching por slug,
 * só por presença de dado.
 */
import { renderDocument } from "./html.mjs";
import { renderSidebar } from "./sidebar.mjs";
import { escapeHtml, escapeAttr, num, renderChipList, renderInline, renderRelationList } from "./partials.mjs";
import { icon } from "./icons.mjs";
import { highlight } from "./highlight.mjs";

const EMPTY = {
  conteudo: "Conteúdo ainda não disponível.",
  exemplos: "Exemplos ainda não disponíveis.",
  exercicio: "Exercícios ainda não disponíveis.",
};

// Tempo de leitura: todo o texto da Área de estudo (inclusive código), a ~200 palavras por minuto.
const WORDS_PER_MINUTE = 200;

const PANEL_ICON = { conteudo: "book", exemplos: "code", exercicio: "pencil" };

// Bloco de código — cabeçalho (ícone arquivo + filename/language + botão
// Copiar, inerte sem JS) + <pre><code> com highlight() (sempre escapado
// antes de virar <span> — o dataset nunca é HTML confiável).
// `label` (opcional): troca o ícone de arquivo por um selo da linguagem e o filename pelo rótulo.
const LANG_BADGE = { typescript: "TS", ts: "TS", tsx: "TSX", javascript: "JS", js: "JS", jsx: "JSX" };

function renderCode({ language, code, filename, label }) {
  const lang = language || "text";
  const name = label || filename || lang;
  const lead = label
    ? `<span class="code-block__badge" aria-hidden="true">${escapeHtml(LANG_BADGE[lang] || lang.slice(0, 3).toUpperCase())}</span>`
    : icon("file", "code-block__file-icon");
  return [
    '              <div class="code-block">',
    '                <div class="code-block__header">',
    `                  ${lead}`,
    `                  <span class="code-block__filename">${escapeHtml(name)}</span>`,
    '                  <button type="button" class="code-block__copy" data-copy-code>',
    `                    ${icon("clipboard", "code-block__copy-icon")}`,
    '                    <span data-copy-label>Copiar</span>',
    "                  </button>",
    "                </div>",
    `                <pre class="code-block__pre"><code class="code-block__code language-${escapeAttr(lang)}">${highlight(code, lang)}</code></pre>`,
    "              </div>",
  ].join("\n");
}

// flow — diagrama de caixas com setas. Cada passo é `{ lines: [...] }` (caixa simples) ou
// `{ title, tags: [{ text, tone }] }` (caixa principal, com estados). tone: ok | err | neutral.
const FLOW_TONES = new Set(["ok", "err", "neutral"]);

function renderFlow(block) {
  const { label, steps } = block;
  if (!label || typeof label !== "string") throw new Error("concept.content: bloco flow exige `label` (texto alternativo do diagrama)");
  if (!Array.isArray(steps) || steps.length < 2 || steps.length > 5) throw new Error("concept.content: bloco flow exige de 2 a 5 `steps`");
  const boxes = steps.map((step) => {
    if (step.title) {
      const tags = step.tags || [];
      for (const t of tags) {
        if (!t.text || !FLOW_TONES.has(t.tone)) throw new Error("concept.content: tag de flow exige `text` e `tone` em ok|err|neutral");
      }
      const tagHtml = tags
        .map((t, i) => (i ? '<span class="flow__or">ou</span>' : "") + `<code class="tag tag--${t.tone}">${escapeHtml(t.text)}</code>`)
        .join("");
      return `<div class="flow__box flow__box--main"><strong class="flow__title">${escapeHtml(step.title)}</strong>${tagHtml ? `<div class="flow__states">${tagHtml}</div>` : ""}</div>`;
    }
    if (!Array.isArray(step.lines) || !step.lines.length) throw new Error("concept.content: passo de flow exige `title` ou `lines`");
    return `<div class="flow__box">${step.lines.map((l) => `<span>${escapeHtml(l)}</span>`).join("")}</div>`;
  });
  return `              <div class="flow" role="group" aria-label="${escapeAttr(label)}">${boxes.join('<span class="flow__arrow" aria-hidden="true">→</span>')}</div>`;
}

// concept.content: { type: "heading" | "paragraph" | "code" | "takeaway" | "list" | "callout" | "flow", ... }[] | null
// Títulos ganham id sequencial (`sec-1`, `sec-2`…) — âncora para "Neste conteúdo" e links diretos.
function renderContentBlocks(blocks) {
  let headings = 0;
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `              <h4 class="content-block__heading" id="sec-${++headings}">${escapeHtml(block.text)}</h4>`;
        case "paragraph":
          return `              <p>${renderInline(block.text)}</p>`;
        case "code":
          return renderCode(block);
        case "takeaway":
          return [
            '              <div class="takeaway">',
            `                <p class="takeaway__label">${icon("check-circle", "takeaway__icon")}<span>Em resumo</span></p>`,
            `                <p class="takeaway__body">${renderInline(block.text)}</p>`,
            "              </div>",
          ].join("\n");
        case "list": {
          if (!Array.isArray(block.items) || !block.items.length) throw new Error("concept.content: bloco list exige `items` não vazio");
          return `              <ul class="content-list">${block.items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`;
        }
        case "callout":
          if (!block.title || !block.text) throw new Error("concept.content: bloco callout exige `title` e `text`");
          return [
            '              <div class="callout">',
            `                <span class="callout__icon">${icon("lightbulb", "callout__svg")}</span>`,
            '                <div class="callout__body">',
            `                  <p class="callout__title">${escapeHtml(block.title)}</p>`,
            `                  <p class="callout__text">${renderInline(block.text)}</p>`,
            "                </div>",
            "              </div>",
          ].join("\n");
        case "flow":
          return renderFlow(block);
        default:
          throw new Error(`concept.content: tipo de bloco desconhecido "${block.type}"`);
      }
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
          `                  <p class="example__context">${renderInline(ex.context)}</p>\n` +
          (ex.code ? renderCode(ex.code) + "\n" : "") +
          `                  <p class="example__explanation">${renderInline(ex.explanation)}</p>\n` +
          "                </li>"
      )
      .join("\n") +
    "\n              </ol>"
  );
}

// concept.exercise: { problem, problemCode:{language,code,filename}|null, task, hint,
//                      solution: { code:{language,code,filename}|null, explanation } }
function renderExercise(ex) {
  const problemBody = [`<p>${renderInline(ex.problem)}</p>`, ex.problemCode ? renderCode(ex.problemCode) : ""].filter(Boolean).join("\n");
  return [
    card("exercise-problem", "target", "Problema", problemBody, 4, "info-card--exercise"),
    card("exercise-task", "checklist", "Sua tarefa", `<p>${renderInline(ex.task)}</p>`, 4, "info-card--exercise"),
    card("exercise-hint", "lightbulb", "Dica", `<p>${renderInline(ex.hint)}</p>`, 4, "info-card--exercise"),
    '              <details class="solution-toggle">',
    `                <summary class="solution-toggle__summary">${icon("eye")}<span>Ver solução</span><span class="solution-toggle__arrow" aria-hidden="true">→</span></summary>`,
    '                <div class="solution-toggle__body">',
    ex.solution.code ? renderCode(ex.solution.code) : "",
    `                  <p>${renderInline(ex.solution.explanation)}</p>`,
    "                </div>",
    "              </details>",
  ].join("\n");
}

// Card com ícone do painel Exercícios (Problema/Sua tarefa/Dica). `level` = nível
// do heading real (4, sob o h3 do painel). id/aria-labelledby = contrato de âncora.
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

// Card da coluna direita (Pré-requisitos, Relacionados, Subtópicos, Recursos).
function railCard(id, iconName, label, bodyHtml) {
  return [
    `          <section class="doc-card" aria-labelledby="${id}">`,
    `            <h2 id="${id}" class="doc-card__title">${icon(iconName, "doc-card__icon")}<span>${escapeHtml(label)}</span></h2>`,
    `            <div class="doc-card__body">${bodyHtml}</div>`,
    "          </section>",
  ].join("\n");
}

// Atalho da coluna direita para uma aba. Sem JS é só uma âncora para a Área de estudo.
function railShortcut(tab, iconName, label, text) {
  return (
    `          <a class="doc-cta" href="#estudo" data-goto-tab="${tab}">` +
    `<span class="doc-cta__icon">${icon(iconName, "doc-cta__svg")}</span>` +
    `<span class="doc-cta__text"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(text)}</small></span>` +
    '<span class="doc-cta__arrow" aria-hidden="true">→</span></a>'
  );
}

function navCard(dir, target) {
  const isPrev = dir === "prev";
  const arrow = `<span class="concept-nav__arrow" aria-hidden="true">${isPrev ? "←" : "→"}</span>`;
  const text = `<span class="concept-nav__text"><small>${isPrev ? "Anterior" : "Próximo"}</small><strong>${escapeHtml(target.title)}</strong></span>`;
  const aria = `${isPrev ? "Conceito anterior" : "Próximo conceito"}: ${target.title}`;
  return (
    `          <a class="concept-nav__link concept-nav__link--${dir}" href="${escapeAttr(target.href)}" rel="${dir}" aria-label="${escapeAttr(aria)}">` +
    (isPrev ? arrow + text : text + arrow) +
    "</a>"
  );
}

const plainWords = (html) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

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
 *   vm.sidebar    : dados do menu lateral (render/sidebar.mjs) ou ausente
 *   vm.enhancementScript : href relativo do <script type="module"> de enhancement, ou
 *                          "" / ausente para não emitir <script>
 */
export function renderConcept(vm) {
  const { product, area, module, concept, requires, revisitOf, revisit, resources, prev, next, homeHref, stylesheets, enhancementScript, sidebar } = vm;

  const content = concept.content && concept.content.length ? concept.content : null;
  const contentHtml = content ? renderContentBlocks(content) : null;
  const examplesHtml = concept.examples && concept.examples.length ? renderExamples(concept.examples) : null;
  const exerciseHtml = concept.exercise ? renderExercise(concept.exercise) : null;

  // ---- cabeçalho ----------------------------------------------------------------------------------
  const minutes = contentHtml ? Math.max(1, Math.round(plainWords([contentHtml, examplesHtml, exerciseHtml].join(" ")) / WORDS_PER_MINUTE)) : 0;
  const readingTime = minutes
    ? `<span class="doc-meta">${icon("clock", "doc-meta__icon")}<span>${minutes} min de leitura</span></span>`
    : "";
  // Texto de abertura: o resumo; sem resumo, a nota curta do termo (quando houver).
  const lede = concept.summary ? renderInline(concept.summary) : concept.note ? escapeHtml(concept.note) : "";

  const header = [
    '          <header class="page-head">',
    '            <div class="doc-titlebar">',
    `              <h1 class="page-head__title">${escapeHtml(concept.title)}</h1>`,
    '              <div class="doc-actions" data-actions-slot=""></div>',
    "            </div>",
    `            <div class="doc-chips"><div class="markers" role="group" aria-label="Classificações">${renderChipList(concept, {})}</div>${readingTime}</div>`,
    ...(lede ? [`            <p class="page-head__lede">${lede}</p>`] : []),
    "          </header>",
  ].join("\n");

  // ---- Área de estudo (3 abas com JS; 3 seções em sequência sem JS) -------------------------------------
  const study = [
    '          <section class="study-area" id="estudo" aria-labelledby="concept-study-heading">',
    '            <h2 id="concept-study-heading" class="visually-hidden">Área de estudo</h2>',
    '            <div class="study-area__panels" data-study-tabs="">',
    studyPanel("conteudo", "Conteúdo", EMPTY.conteudo, contentHtml),
    studyPanel("exemplos", "Exemplos", EMPTY.exemplos, examplesHtml),
    studyPanel("exercicio", "Exercícios", EMPTY.exercicio, exerciseHtml),
    "            </div>",
    "          </section>",
  ].join("\n");

  // ---- Anterior / Próximo em cards ---------------------------------------------------------------------
  const navLinks = [...(prev ? [navCard("prev", prev)] : []), ...(next ? [navCard("next", next)] : [])];
  const nav = navLinks.length ? ['        <nav class="concept-nav" aria-label="Navegação entre conceitos">', ...navLinks, "        </nav>"].join("\n") : "";

  // ---- coluna direita ----------------------------------------------------------------------------------
  const toc = content ? content.filter((b) => b.type === "heading") : [];
  const tocHtml = toc.length
    ? [
        '          <nav class="doc-card doc-toc" aria-labelledby="concept-toc">',
        '            <h2 id="concept-toc" class="doc-card__title"><span>Neste conteúdo</span></h2>',
        `            <ol>${toc.map((h, i) => `<li><a href="#sec-${i + 1}" data-goto-tab="conteudo">${escapeHtml(h.text)}</a></li>`).join("")}</ol>`,
        "          </nav>",
      ].join("\n")
    : "";
  const related = [...(revisitOf ? [revisitOf] : []), ...revisit];

  const rail = [
    '        <aside class="doc-rail" aria-label="Neste conceito">',
    tocHtml,
    railCard("concept-requires", "link", "Pré-requisitos", requires.length ? renderRelationList(requires) : '<span class="muted">nenhum</span>'),
    related.length ? railCard("concept-related", "share", "Relacionados", renderRelationList(related)) : "",
    concept.subtopics.length ? railCard("concept-subtopics", "checklist", "Subtópicos", taglist(concept.subtopics, false)) : "",
    resources.length ? railCard("concept-resources", "file", "Recursos", taglist(resources, true)) : "",
    examplesHtml ? railShortcut("exemplos", "code", "Ver exemplos práticos", "Veja exemplos de uso deste conceito.") : "",
    exerciseHtml ? railShortcut("exercicio", "pencil", "Praticar agora", "Resolva um exercício e teste o que aprendeu.") : "",
    "        </aside>",
  ]
    .filter(Boolean)
    .join("\n");

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
    '        <div class="doc-concept">',
    header,
    study,
    ...(nav ? [nav] : []),
    rail,
    "        </div>",
    "      </div>",
  ].join("\n");

  return renderDocument({
    title: concept.title + " · " + product.name,
    homeHref,
    homeLabel: product.name,
    navLabel: product.name,
    footerText: product.footerText,
    stylesheets,
    sidebar: sidebar ? renderSidebar(sidebar) : "",
    main,
    scripts: enhancementScript ? [enhancementScript] : [],
  });
}
