/*
 * App.views — construção de DOM para cada rota (vanilla, createElement).
 *
 * Rótulos de interface: Área = Epic · Módulo = Story · Conceito = Task.
 * Cor da Área = var(--epic-color), setada inline a partir de epic.color.
 *
 * Progresso: App.config.progressEnabled === false nesta versão → contadores e toggles
 * de status não são renderizados. Os totais mostrados são de estrutura (Nº de Tasks),
 * não de progresso.
 */
(function () {
  const App = (window.App = window.App || {});
  const model = App.roadmapModel;
  const router = App.router;
  const M = App.roadmapMeta;

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

  function setEpicColor(node, epic) {
    if (epic && epic.color) node.style.setProperty("--epic-color", epic.color);
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

  // Badges de colisão de nome (task.collision) e o marcador de novidade da Fase 2
  // (task.isNew) são metadados editoriais/de curadoria e ficam fora da navegação
  // normal por decisão de UX — os dados continuam intactos em data/roadmap.js.
  function markerChips(task) {
    const chips = [];
    if (task.canonical) chips.push(el("span", { class: "chip chip--c", title: "conceito-base", text: "conceito-base" }));
    if (!task.canonical || task.revisitOf) chips.push(el("span", { class: "chip chip--r", title: "revisita de um conceito-base anterior", text: "revisita" }));
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

  // ---- HOME ------------------------------------------------------------------
  // A Home representa só o nível Área — Módulos/Tasks aparecem a partir da
  // página da Área em diante (hierarquia Home → Área → Módulo → Conceito).
  function epicCard(epic, i) {
    const navigable = epic.status === "navigable";
    const kicker = el("p", { class: "area-card__kicker", text: (M.interfaceLabels.epic + " " + num(i)).toUpperCase() });
    const title = navigable
      ? el("a", { class: "area-card__title area-card__title--link", href: router.epic(epic), text: epic.title })
      : el("h2", { class: "area-card__title", text: epic.title });
    const desc = el("p", { class: "area-card__desc", text: epic.summary });

    const body = [kicker, title, desc];

    if (!navigable) body.push(el("p", { class: "area-card__badge", text: "Em estruturação" }));

    const count = navigable
      ? model.storyCount(epic) + " módulos · " + model.taskCount(epic) + " conceitos"
      : model.storyCount(epic) + " módulos planejados";

    body.push(
      el("p", { class: "area-card__foot" }, [
        navigable ? el("a", { class: "area-card__more", href: router.epic(epic), text: "Abrir área →" }) : null,
        el("span", { class: "area-card__count", text: count }),
      ])
    );

    return setEpicColor(el("article", { class: "area-card" + (navigable ? "" : " area-card--structuring") }, body), epic);
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
        model.epics().map((e, i) => epicCard(e, i))
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

  // ---- ÁREA (Epic) ---------------------------------------------------------
  function renderEpic(epic) {
    const i = model.epics().indexOf(epic);
    const stories = model.stories(epic);

    return setEpicColor(
      el("div", { class: "view view--epic" }, [
        crumbs([{ label: M.title, href: router.home() }, { label: epic.title }]),
        el("header", { class: "page-head" }, [
          el("p", { class: "page-head__kicker", text: (M.interfaceLabels.epic + " " + num(i)).toUpperCase() }),
          el("h1", { class: "page-head__title", text: epic.title }),
          el("p", { class: "page-head__desc", text: epic.summary }),
          el("p", { class: "page-head__meta", text: stories.length + " módulos · " + model.taskCount(epic) + " conceitos" }),
        ]),
        el(
          "ol",
          { class: "track track--page" },
          stories.map((s, si) =>
            el("a", { class: "track__row", href: router.story(s) }, [
              el("span", { class: "track__num", text: num(si) }),
              el("span", { class: "track__title", text: s.title }),
              el("span", { class: "track__meta", text: model.taskCount(s) + " conceitos" }),
              el("span", { class: "track__arrow", "aria-hidden": "true", text: "→" }),
            ])
          )
        ),
      ]),
      epic
    );
  }

  // ---- MÓDULO (Story) ----------------------------------------------------------
  function renderStory(epic, story) {
    const si = model.stories(epic).indexOf(story);
    const tasks = model.tasks(story);

    const head = [
      el("p", { class: "page-head__kicker", text: (M.interfaceLabels.story + " " + num(si)).toUpperCase() }),
      el("h1", { class: "page-head__title", text: story.title }),
      story.summary ? el("p", { class: "page-head__desc", text: story.summary }) : null,
      el("p", { class: "page-head__meta", text: tasks.length + " conceitos" }),
    ];

    // story.relocated e story.suggestions são metadados editoriais/de curadoria
    // (decisões de construção do roadmap) — preservados em data/roadmap.js, mas
    // fora da navegação de estudo por decisão de UX.
    const details = [];
    if (story.requires && story.requires.length) details.push(field("Requires (módulo)", tagList(story.requires)));

    return setEpicColor(
      el("div", { class: "view view--story" }, [
        crumbs([
          { label: M.title, href: router.home() },
          { label: epic.title, href: router.epic(epic) },
          { label: story.title },
        ]),
        el("header", { class: "page-head" }, head),
        el(
          "ol",
          { class: "track track--page" },
          tasks.map((t, ti) =>
            el("a", { class: "track__row track__row--task", href: router.task(t) }, [
              el("span", { class: "track__num", text: num(ti) }),
              el("span", { class: "track__title" }, [t.title, el("span", { class: "track__chips" }, markerChips(t))]),
              el("span", { class: "track__arrow", "aria-hidden": "true", text: "→" }),
            ])
          )
        ),
        details.length ? el("section", { class: "detail-block" }, details) : null,
      ]),
      epic
    );
  }

  // ---- CONCEITO (Task) -------------------------------------------------------
  function renderTask(epic, story, task) {
    const ti = model.tasks(story).indexOf(task);
    const sib = model.siblingTasks(task);

    const resources = (task.resources || []).map((r) => model.resolveResource(r)).filter(Boolean);

    const fields = [
      field("Pré-requisitos (Requires)", task.requires && task.requires.length ? tagList(task.requires) : el("span", { class: "muted", text: "nenhum" })),
      task.revisitOf ? field("Revisita de", el("span", { text: task.revisitOf })) : null,
      task.note ? field("Nota", el("p", { text: task.note })) : null,
      task.subtopics && task.subtopics.length ? field("Subtópicos", tagList(task.subtopics)) : null,
      task.revisit && task.revisit.length ? field("Revisitado em", tagList(task.revisit)) : null,
      resources.length
        ? field(
            "Recursos",
            el(
              "ul",
              { class: "taglist" },
              resources.map((r) => el("li", { class: "taglist__item" }, [el("a", { href: r.url, text: r.label })]))
            )
          )
        : null,
    ];

    return setEpicColor(
      el("div", { class: "view view--task" }, [
        crumbs([
          { label: M.title, href: router.home() },
          { label: epic.title, href: router.epic(epic) },
          { label: story.title, href: router.story(story) },
          { label: task.title },
        ]),
        el("header", { class: "page-head" }, [
          el("p", { class: "page-head__kicker", text: (M.interfaceLabels.task + " " + num(ti)).toUpperCase() }),
          el("h1", { class: "page-head__title", text: task.title }),
          el("div", { class: "markers" }, markerChips(task)),
        ]),
        el("section", { class: "detail-block" }, fields),
        el("section", { class: "placeholder-card" }, [
          el("p", { text: "Conteúdo de estudo — definição, por que existe, problema que resolve, exemplos, código, exercício e revisão — será adicionado numa fase futura." }),
        ]),
        el("nav", { class: "task-nav", "aria-label": "conceitos do módulo" }, [
          sib.prev ? el("a", { class: "task-nav__link task-nav__link--prev", href: router.task(sib.prev), text: "← " + sib.prev.title }) : el("span", {}),
          sib.next ? el("a", { class: "task-nav__link task-nav__link--next", href: router.task(sib.next), text: sib.next.title + " →" }) : el("span", {}),
        ]),
      ]),
      epic
    );
  }

  function renderNotFound() {
    return el("div", { class: "view view--notfound" }, [
      el("h1", { class: "page-head__title", text: "Rota não encontrada" }),
      el("p", { class: "muted", text: "Essa área ainda não existe ou o endereço está incorreto." }),
      el("p", {}, [el("a", { class: "crumbs__link", href: router.home(), text: "← Voltar para o roadmap" })]),
    ]);
  }

  App.views = {
    el: el,
    home: renderHome,
    epic: renderEpic,
    story: renderStory,
    task: renderTask,
    notFound: renderNotFound,
  };
})();
