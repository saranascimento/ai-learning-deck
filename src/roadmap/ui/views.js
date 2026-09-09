/*
 * views — construção de DOM para cada rota (vanilla, createElement).
 *
 * Rótulos de interface: Área = Area · Módulo = Module · Conceito = Concept.
 * Cor da Área = var(--area-color), setada inline a partir de area.color.
 *
 * Progresso: config.progressEnabled === false nesta versão → contadores e toggles
 * de status não são renderizados. Os totais mostrados são de estrutura (Nº de Concepts),
 * não de progresso.
 */
import { roadmapModel as model } from "../model/roadmap-model.js";
import { roadmapMeta as M } from "../data/index.js";
import { router } from "../routing/router.js";
import { initConceptTabs } from "./concept-tabs.js";

// ---- helper de DOM ----------------------------------------------------------
function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((k) => {
      const v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
      else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
  }
  []
    .concat(children == null ? [] : children)
    .forEach((c) => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
  return node;
}

const num = (i) => String(i + 1).padStart(2, "0");

function setAreaColor(node, area) {
  if (area && area.color) node.style.setProperty("--area-color", area.color);
  return node;
}

// ---- pedaços reutilizáveis -------------------------------------------------
function crumbs(items) {
  const kids = [];
  items.forEach((it, i) => {
    if (i > 0) kids.push(el("span", { class: "crumbs__sep", text: "/" }));
    kids.push(it.href ? el("a", { class: "crumbs__link", href: it.href, text: it.label }) : el("span", { class: "crumbs__here", text: it.label }));
  });
  return el("nav", { class: "crumbs", "aria-label": "trilha" }, kids);
}

// Chips de marcador — derivados das dimensões aprovadas; nenhum texto de chip é
// armazenado no dataset. Dimensões independentes:
//   Estrutura  : concept.canonical === true → CONCEITO-BASE · false → REVISITA
//   Foco       : concept.learningFocus inclui "conceptual" → CONCEITUAL · "practical" → PRÁTICO
//   Prioridade : concept.essential === true → ESSENCIAL
// Modo { compact } (lista de Concepts dentro do Module): só ESSENCIAL e
// CONCEITO-BASE/REVISITA — CONCEITUAL/PRÁTICO ficam de fora dessa listagem.
//
// Badges de colisão de nome (concept.collision) e o marcador de novidade da Fase 2
// (concept.isNew) são metadados editoriais/de curadoria e ficam fora da navegação
// normal por decisão de UX — os dados continuam intactos no dataset.
function markerChips(concept, opts) {
  const compact = !!(opts && opts.compact);
  const focus = concept.learningFocus || [];
  const chips = [];

  if (concept.essential) chips.push(el("span", { class: "chip chip--essential", title: "essencial para Senior Software Engineer", text: "ESSENCIAL" }));

  if (concept.canonical) chips.push(el("span", { class: "chip chip--c", title: "conceito-base — lar canônico do conceito", text: "CONCEITO-BASE" }));
  else chips.push(el("span", { class: "chip chip--r", title: "revisita de um conceito-base anterior", text: "REVISITA" }));

  if (!compact) {
    if (focus.indexOf("conceptual") !== -1) chips.push(el("span", { class: "chip chip--conceptual", title: "domínio conceitual — compreender, explicar, raciocinar", text: "CONCEITUAL" }));
    if (focus.indexOf("practical") !== -1) chips.push(el("span", { class: "chip chip--practical", title: "domínio prático — implementar, aplicar, diagnosticar", text: "PRÁTICO" }));
  }
  return chips;
}

function field(label, body) {
  if (body == null) return null;
  return el("div", { class: "field" }, [el("div", { class: "field__label", text: label }), el("div", { class: "field__body" }, body)]);
}

function tagList(values) {
  if (!values || !values.length) return null;
  return el(
    "ul",
    { class: "taglist" },
    values.map((v) => el("li", { class: "taglist__item", text: v }))
  );
}

// Um pill de relação. `resolved` → <a> (pill inteiro clicável) com o rótulo e uma
// seta "→"; `ambiguous` / `unresolved` → <span> apagado, sem seta, sem link.
// A string exibida é sempre a original.
function relationPill(raw, result) {
  const label = el("span", { class: "relation-pill__label", text: raw });
  if (result.status === "resolved") {
    return el("a", { class: "relation-pill", href: result.href, "data-ref-kind": result.kind }, [
      label,
      el("span", { class: "relation-pill__arrow", "aria-hidden": "true", text: "→" }),
    ]);
  }
  return el(
    "span",
    {
      class: "relation-pill relation-pill--flagged",
      "data-ref-status": result.status,
      title: result.status === "ambiguous" ? "referência ambígua — não navegável" : "referência não resolvida — não navegável",
    },
    [label]
  );
}

// Lista de relações navegáveis (Requires / Revisitado em).
function refList(values, from) {
  if (!values || !values.length) return null;
  return el(
    "ul",
    { class: "relation-list" },
    values.map((raw) => el("li", { class: "relation-list__item" }, [relationPill(raw, model.resolveRoadmapRef(raw, from))]))
  );
}

// Uma única referência (revisitOf) — mesmo pill, standalone.
function refInline(raw, from) {
  return relationPill(raw, model.resolveRoadmapRef(raw, from));
}

// ---- HOME ------------------------------------------------------------------
// A Home representa só o nível Área — Módulos/Conceitos aparecem a partir da
// página da Área em diante (hierarquia Home → Área → Módulo → Conceito).
function areaCard(area, i) {
  const navigable = area.status === "navigable";
  const kicker = el("p", { class: "area-card__kicker", text: (M.interfaceLabels.area + " " + num(i)).toUpperCase() });
  const title = navigable
    ? el("a", { class: "area-card__title area-card__title--link", href: router.area(area), text: area.title })
    : el("h2", { class: "area-card__title", text: area.title });
  const desc = el("p", { class: "area-card__desc", text: area.summary });

  const body = [kicker, title, desc];

  if (!navigable) body.push(el("p", { class: "area-card__badge", text: "Em estruturação" }));

  const count = navigable
    ? model.moduleCount(area) + " módulos · " + model.conceptCount(area) + " conceitos"
    : model.moduleCount(area) + " módulos planejados";

  body.push(
    el("p", { class: "area-card__foot" }, [
      navigable ? el("a", { class: "area-card__more", href: router.area(area), text: "Abrir área →" }) : null,
      el("span", { class: "area-card__count", text: count }),
    ])
  );

  return setAreaColor(el("article", { class: "area-card" + (navigable ? "" : " area-card--structuring") }, body), area);
}

function renderHome() {
  const decks = model.decks();
  return el("div", { class: "view view--home" }, [
    el("header", { class: "masthead" }, [
      el("h1", { class: "masthead__title", text: M.title }),
      el("p", { class: "masthead__subtitle", text: M.subtitle }),
    ]),
    el(
      "section",
      { class: "area-grid", "aria-label": "Áreas do roadmap" },
      model.areas().map((a, i) => areaCard(a, i))
    ),
    decks.length
      ? el("footer", { class: "home-decks" }, [
          el("span", { class: "home-decks__label", text: "Decks de aprofundamento:" }),
          el(
            "span",
            { class: "home-decks__links" },
            decks.map((d, i) =>
              el("span", {}, [i > 0 ? el("span", { class: "home-decks__sep", text: " · " }) : "", el("a", { href: d.url, text: d.title })])
            )
          ),
        ])
      : null,
  ]);
}

// ---- ÁREA (Area) ---------------------------------------------------------
function renderArea(area) {
  const i = model.areas().indexOf(area);
  const modules = model.modules(area);

  return setAreaColor(
    el("div", { class: "view view--area" }, [
      crumbs([{ label: M.title, href: router.home() }, { label: area.title }]),
      el("header", { class: "page-head" }, [
        el("p", { class: "page-head__kicker", text: (M.interfaceLabels.area + " " + num(i)).toUpperCase() }),
        el("h1", { class: "page-head__title", text: area.title }),
        el("p", { class: "page-head__desc", text: area.summary }),
        el("p", { class: "page-head__meta", text: modules.length + " módulos · " + model.conceptCount(area) + " conceitos" }),
      ]),
      el(
        "ol",
        { class: "track track--page" },
        modules.map((m, mi) =>
          el("a", { class: "track__row", href: router.module(m) }, [
            el("span", { class: "track__num", text: num(mi) }),
            el("span", { class: "track__title", text: m.title }),
            el("span", { class: "track__meta", text: model.conceptCount(m) + " conceitos" }),
            el("span", { class: "track__arrow", "aria-hidden": "true", text: "→" }),
          ])
        )
      ),
    ]),
    area
  );
}

// ---- MÓDULO (Module) ----------------------------------------------------------
function renderModule(area, module) {
  const mi = model.modules(area).indexOf(module);
  const concepts = model.concepts(module);

  const head = [
    el("p", { class: "page-head__kicker", text: (M.interfaceLabels.module + " " + num(mi)).toUpperCase() }),
    el("h1", { class: "page-head__title", text: module.title }),
    module.summary ? el("p", { class: "page-head__desc", text: module.summary }) : null,
    el("p", { class: "page-head__meta", text: concepts.length + " conceitos" }),
  ];

  // module.relocated e module.suggestions são metadados editoriais/de curadoria
  // (decisões de construção do roadmap) — preservados no dataset, mas
  // fora da navegação de estudo por decisão de UX.
  const details = [];
  if (module.requires && module.requires.length) details.push(field("Requires (módulo)", refList(module.requires, { area: area, module: null })));

  return setAreaColor(
    el("div", { class: "view view--module" }, [
      crumbs([
        { label: M.title, href: router.home() },
        { label: area.title, href: router.area(area) },
        { label: module.title },
      ]),
      el("header", { class: "page-head" }, head),
      el(
        "ol",
        { class: "track track--page" },
        concepts.map((c, ci) =>
          el("a", { class: "track__row track__row--concept", href: router.concept(c) }, [
            el("span", { class: "track__num", text: num(ci) }),
            el("span", { class: "track__title" }, [c.title, el("span", { class: "track__chips" }, markerChips(c, { compact: true }))]),
            el("span", { class: "track__arrow", "aria-hidden": "true", text: "→" }),
          ])
        )
      ),
      details.length ? el("section", { class: "detail-block" }, details) : null,
    ]),
    area
  );
}

// ---- CONCEITO (Concept) -------------------------------------------------------

// Bloco rotulado da área fixa do Conceito: <section aria-labelledby> + heading real.
// Não usa field() (que segue servindo o Módulo) — aqui os rótulos são headings para
// dar à página de Conceito um outline navegável (h1 → h2 → h3).
function conceptSection(id, label, level, body) {
  return el("section", { class: "concept-section", "aria-labelledby": id }, [
    el("h" + level, { id: id, class: "concept-section__title", text: label }),
    el("div", { class: "concept-section__body" }, body),
  ]);
}

// Um painel da "Área de estudo". R3: content/examples/exercise estão sempre vazios
// (content: null, examples: [], exercise: null) → renderiza só o empty-state. A
// estrutura (section + h3 + data-study-panel) já é a que R5+ vai preencher e que o
// enhancement de tabs (concept-tabs.js) promove ao padrão APG.
function studyPanel(key, label, emptyText) {
  return el("section", { class: "study-panel", "data-study-panel": key }, [
    el("h3", { class: "concept-section__title study-panel__title", text: label }),
    el("p", { class: "empty-state", text: emptyText }),
  ]);
}

function renderConcept(area, module, concept) {
  const ci = model.concepts(module).indexOf(concept);
  const sib = model.siblingConcepts(concept);
  const resources = (concept.resources || []).map((r) => model.resolveResource(r)).filter(Boolean);
  const from = { area: area, module: module };

  // Área fixa: Resumo → relações → Recursos. note/collision/isNew ficam de fora da UI
  // (metadata editorial) — sem tocar o dataset.
  const fixed = [
    conceptSection(
      "concept-resumo",
      "Resumo",
      2,
      concept.summary ? el("p", { text: concept.summary }) : el("p", { class: "empty-state", text: "Resumo ainda não disponível." })
    ),
    conceptSection(
      "concept-requires",
      "Pré-requisitos (Requires)",
      2,
      concept.requires && concept.requires.length ? refList(concept.requires, from) : el("span", { class: "muted", text: "nenhum" })
    ),
  ];

  if (concept.revisitOf) fixed.push(conceptSection("concept-revisitof", "Revisita de", 2, refInline(concept.revisitOf, from)));
  if (concept.subtopics && concept.subtopics.length) fixed.push(conceptSection("concept-subtopics", "Subtópicos", 2, tagList(concept.subtopics)));
  if (concept.revisit && concept.revisit.length) fixed.push(conceptSection("concept-revisit", "Revisitado em", 2, refList(concept.revisit, from)));
  if (resources.length) {
    fixed.push(
      conceptSection(
        "concept-resources",
        "Recursos",
        2,
        el(
          "ul",
          { class: "taglist" },
          resources.map((r) => el("li", { class: "taglist__item" }, [el("a", { href: r.url, text: r.label })]))
        )
      )
    );
  }

  // Área de estudo — 3 <section> sequenciais, sempre visíveis e legíveis sem JS.
  const studyArea = el("section", { class: "study-area", "aria-labelledby": "concept-study-heading" }, [
    el("h2", { id: "concept-study-heading", class: "concept-section__title", text: "Área de estudo" }),
    el("div", { class: "study-area__panels", "data-study-tabs": "" }, [
      studyPanel("conteudo", "Conteúdo", "Conteúdo ainda não disponível."),
      studyPanel("exemplos", "Exemplos", "Exemplos ainda não disponíveis."),
      studyPanel("exercicio", "Exercício", "Exercício ainda não disponível."),
    ]),
  ]);

  // Navegação anterior/próximo — links reais; rel=prev/next; nome acessível nomeia o
  // conceito de destino. Sem aria-current (não representam a página atual).
  const navLinks = [];
  if (sib.prev) {
    navLinks.push(
      el("a", {
        class: "concept-nav__link concept-nav__link--prev",
        href: router.concept(sib.prev),
        rel: "prev",
        "aria-label": "Conceito anterior: " + sib.prev.title,
        text: "← " + sib.prev.title,
      })
    );
  }
  if (sib.next) {
    navLinks.push(
      el("a", {
        class: "concept-nav__link concept-nav__link--next",
        href: router.concept(sib.next),
        rel: "next",
        "aria-label": "Próximo conceito: " + sib.next.title,
        text: sib.next.title + " →",
      })
    );
  }

  const viewNode = setAreaColor(
    el("div", { class: "view view--concept concept-study" }, [
      crumbs([
        { label: M.title, href: router.home() },
        { label: area.title, href: router.area(area) },
        { label: module.title, href: router.module(module) },
        { label: concept.title },
      ]),
      el("header", { class: "page-head" }, [
        el("p", { class: "page-head__kicker", text: (M.interfaceLabels.concept + " " + num(ci)).toUpperCase() }),
        el("h1", { class: "page-head__title", text: concept.title }),
        // Grupo nomeado — dá contexto aos chips (que continuam <span>). A
        // reestruturação semântica dos chips em si fica para a R3.5.
        el("div", { class: "markers", role: "group", "aria-label": "Classificações" }, markerChips(concept)),
      ]),
      el("div", { class: "detail-block" }, fixed),
      studyArea,
      navLinks.length ? el("nav", { class: "concept-nav", "aria-label": "Navegação entre conceitos" }, navLinks) : null,
    ]),
    area
  );

  // Progressive enhancement: promove a Área de estudo a APG Tabs quando há JS.
  initConceptTabs(viewNode);
  return viewNode;
}

function renderNotFound() {
  return el("div", { class: "view view--notfound" }, [
    el("h1", { class: "page-head__title", text: "Rota não encontrada" }),
    el("p", { class: "muted", text: "Essa área ainda não existe ou o endereço está incorreto." }),
    el("p", {}, [el("a", { class: "crumbs__link", href: router.home(), text: "← Voltar para o roadmap" })]),
  ]);
}

export const views = {
  el: el,
  home: renderHome,
  area: renderArea,
  module: renderModule,
  concept: renderConcept,
  notFound: renderNotFound,
};
