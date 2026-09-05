/*
 * App.roadmapModel — acessores puros sobre App.roadmap.
 *
 * Deriva id/slug de cada nó (Epic → Story → Task) e oferece navegação por slug,
 * contagem de Tasks, ordenação pedagógica global (flattenTasks) e resolução de
 * resources contra App.presentations (catálogo de decks).
 *
 * Não muda o conteúdo — só indexa e consulta.
 */
(function () {
  const App = (window.App = window.App || {});

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/\+/g, " plus ")
      .replace(/&/g, " and ")
      .replace(/[()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function byOrder(a, b) {
    return (a.order || 0) - (b.order || 0);
  }

  // Anexa id, slug (quando ausente) e ponteiros de parentesco. Idempotente.
  function index(roadmap) {
    const epics = roadmap.slice().sort(byOrder);
    epics.forEach((epic) => {
      epic.slug = epic.slug || slugify(epic.title);
      epic.id = epic.slug;
      (epic.stories || []).sort(byOrder).forEach((story) => {
        story.slug = story.slug || slugify(story.title);
        story.id = epic.slug + "/" + story.slug;
        story.epic = epic;
        (story.tasks || []).sort(byOrder).forEach((task) => {
          task.slug = task.slug || slugify(task.title);
          task.id = story.id + "/" + task.slug;
          task.story = story;
          task.epic = epic;
        });
      });
    });
    return epics;
  }

  const epics = index(App.roadmap || []);

  const model = {
    slugify: slugify,

    epics: function () {
      return epics;
    },

    navigableEpics: function () {
      return epics.filter((e) => e.status === "navigable");
    },

    epic: function (epicSlug) {
      return epics.find((e) => e.slug === epicSlug) || null;
    },

    story: function (epicSlug, storySlug) {
      const epic = model.epic(epicSlug);
      if (!epic) return null;
      return (epic.stories || []).find((s) => s.slug === storySlug) || null;
    },

    task: function (epicSlug, storySlug, taskSlug) {
      const story = model.story(epicSlug, storySlug);
      if (!story) return null;
      return (story.tasks || []).find((t) => t.slug === taskSlug) || null;
    },

    stories: function (epic) {
      return (epic && epic.stories) || [];
    },

    tasks: function (story) {
      return (story && story.tasks) || [];
    },

    // Nº de Tasks descendentes de um Epic ou Story.
    taskCount: function (node) {
      if (!node) return 0;
      if (node.jiraType === "story") return (node.tasks || []).length;
      if (node.jiraType === "epic") {
        return (node.stories || []).reduce((sum, s) => sum + (s.tasks || []).length, 0);
      }
      return 0;
    },

    storyCount: function (epic) {
      if (!epic) return 0;
      if (epic.status === "structuring") return (epic.plannedStories || []).length;
      return (epic.stories || []).length;
    },

    // Ordem pedagógica global: epic.order → story.order → task.order.
    flattenTasks: function () {
      const out = [];
      epics.forEach((epic) => {
        (epic.stories || []).forEach((story) => {
          (story.tasks || []).forEach((task) => out.push(task));
        });
      });
      return out;
    },

    // Task anterior / próxima DENTRO da mesma Story (para navegação sequencial).
    siblingTasks: function (task) {
      const list = model.tasks(task.story);
      const i = list.indexOf(task);
      return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
    },

    // Resolve { type: "deck", deckId } contra App.presentations.
    resolveResource: function (resource) {
      if (!resource) return null;
      if (resource.type === "deck") {
        const deck = (App.presentations || []).find((p) => p.id === resource.deckId);
        if (!deck) return null;
        return { kind: "deck", label: resource.label || deck.title, url: deck.url, description: deck.description };
      }
      return { kind: resource.type, label: resource.label, url: resource.url };
    },

    // Decks avulsos preservados (App.roadmapMeta.decks) resolvidos contra App.presentations.
    decks: function () {
      const ids = (App.roadmapMeta && App.roadmapMeta.decks) || [];
      return ids
        .map((id) => (App.presentations || []).find((p) => p.id === id))
        .filter(Boolean);
    },
  };

  App.roadmapModel = model;
})();
