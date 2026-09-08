/*
 * roadmapModel — acessores puros sobre o dataset do Roadmap Senior.
 *
 * Deriva id/slug de cada nó (Area → Module → Concept) e oferece navegação por slug,
 * contagem de Concepts, ordenação pedagógica global (flattenConcepts) e resolução de
 * resources contra o catálogo de apresentações (decks).
 *
 * Não muda o conteúdo — só indexa e consulta.
 */
import { roadmap, roadmapMeta } from "../data/index.js";
import { presentations } from "../../presentations/catalog.js";

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
  const areas = roadmap.slice().sort(byOrder);
  areas.forEach((area) => {
    area.slug = area.slug || slugify(area.title);
    area.id = area.slug;
    (area.modules || []).sort(byOrder).forEach((module) => {
      module.slug = module.slug || slugify(module.title);
      module.id = area.slug + "/" + module.slug;
      module.area = area;
      (module.concepts || []).sort(byOrder).forEach((concept) => {
        concept.slug = concept.slug || slugify(concept.title);
        concept.id = module.id + "/" + concept.slug;
        concept.module = module;
        concept.area = area;
      });
    });
  });
  return areas;
}

const areas = index(roadmap || []);

const model = {
  slugify: slugify,

  areas: function () {
    return areas;
  },

  navigableAreas: function () {
    return areas.filter((a) => a.status === "navigable");
  },

  area: function (areaSlug) {
    return areas.find((a) => a.slug === areaSlug) || null;
  },

  module: function (areaSlug, moduleSlug) {
    const area = model.area(areaSlug);
    if (!area) return null;
    return (area.modules || []).find((m) => m.slug === moduleSlug) || null;
  },

  concept: function (areaSlug, moduleSlug, conceptSlug) {
    const module = model.module(areaSlug, moduleSlug);
    if (!module) return null;
    return (module.concepts || []).find((c) => c.slug === conceptSlug) || null;
  },

  modules: function (area) {
    return (area && area.modules) || [];
  },

  concepts: function (module) {
    return (module && module.concepts) || [];
  },

  // Nº de Concepts descendentes de uma Area ou Module.
  conceptCount: function (node) {
    if (!node) return 0;
    if (node.kind === "module") return (node.concepts || []).length;
    if (node.kind === "area") {
      return (node.modules || []).reduce((sum, m) => sum + (m.concepts || []).length, 0);
    }
    return 0;
  },

  moduleCount: function (area) {
    if (!area) return 0;
    if (area.status === "structuring") return (area.plannedModules || []).length;
    return (area.modules || []).length;
  },

  // Ordem pedagógica global: area.order → module.order → concept.order.
  flattenConcepts: function () {
    const out = [];
    areas.forEach((area) => {
      (area.modules || []).forEach((module) => {
        (module.concepts || []).forEach((concept) => out.push(concept));
      });
    });
    return out;
  },

  // Concept anterior / próximo DENTRO do mesmo Module (para navegação sequencial).
  siblingConcepts: function (concept) {
    const list = model.concepts(concept.module);
    const i = list.indexOf(concept);
    return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
  },

  // Resolve { type: "deck", deckId } contra o catálogo de apresentações.
  resolveResource: function (resource) {
    if (!resource) return null;
    if (resource.type === "deck") {
      const deck = (presentations || []).find((p) => p.id === resource.deckId);
      if (!deck) return null;
      return { kind: "deck", label: resource.label || deck.title, url: deck.url, description: deck.description };
    }
    return { kind: resource.type, label: resource.label, url: resource.url };
  },

  // Decks avulsos preservados (roadmapMeta.decks) resolvidos contra o catálogo.
  decks: function () {
    const ids = (roadmapMeta && roadmapMeta.decks) || [];
    return ids
      .map((id) => (presentations || []).find((p) => p.id === id))
      .filter(Boolean);
  },
};

export const roadmapModel = model;
