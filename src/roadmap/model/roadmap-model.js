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
import { router } from "../routing/router.js";

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

// ---- resolução de referências (R2) ---------------------------------------
// As strings livres de `requires` / `revisit` / `revisitOf` viram navegação —
// mas só quando a resolução é SEGURA. Determinístico e conservador: sem fuzzy,
// sem substring, sem "melhor candidato". Ambíguo / não resolvido nunca vira link.

// Apelidos de Area — explícitos e curados (só as abreviações que aparecem nas
// strings do dataset). Não inferidos dinamicamente.
const REF_AREA_ALIASES = {
  platform: "platform-engineering",
  architecture: "architecture-system-design",
  testing: "testing-quality-engineering",
  ai: "ai-engineering",
};

function normRef(value) {
  return String(value == null ? "" : value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Remove só um parentético no fim ("Git (forward-reference aceita)" → "Git").
function stripTrailingParen(value) {
  return String(value).replace(/\s*\([^()]*\)\s*$/, "").trim();
}

// Índices para resolver referências. Construídos uma vez sobre a árvore já indexada.
const refIndex = (function buildRefIndex() {
  const byTitle = new Map(); // normTitle -> [node] (kinds misturados; node.kind desambigua)
  const moduleByPath = new Map(); // "areaSlug/moduleSlug" -> module
  const conceptByPath = new Map(); // "areaSlug/moduleSlug/conceptSlug" -> concept

  function add(key, node) {
    const list = byTitle.get(key);
    if (list) list.push(node);
    else byTitle.set(key, [node]);
  }

  areas.forEach((area) => {
    add(normRef(area.title), area);
    (area.modules || []).forEach((module) => {
      add(normRef(module.title), module);
      moduleByPath.set(area.slug + "/" + module.slug, module);
      (module.concepts || []).forEach((concept) => {
        add(normRef(concept.title), concept);
        conceptByPath.set(area.slug + "/" + module.slug + "/" + concept.slug, concept);
      });
    });
  });

  return { byTitle: byTitle, moduleByPath: moduleByPath, conceptByPath: conceptByPath };
})();

function hrefFor(kind, node) {
  if (kind === "area") return router.area(node);
  if (kind === "module") return router.module(node);
  return router.concept(node);
}

// Um segmento de contexto (nome de Area ou Module) identifica um ancestral do nó?
function contextSegMatches(seg, node) {
  const s = normRef(seg);
  const alt = normRef(stripTrailingParen(seg));
  const area = node.area || (node.kind === "area" ? node : null);
  const mod = node.module || (node.kind === "module" ? node : null);

  const areaKeys = area ? [normRef(area.title), area.slug] : [];
  const moduleKeys = mod ? [normRef(mod.title), mod.slug] : [];
  const aliasArea = REF_AREA_ALIASES[s] || REF_AREA_ALIASES[alt] || null;

  if (areaKeys.indexOf(s) !== -1 || areaKeys.indexOf(alt) !== -1) return true;
  if (moduleKeys.indexOf(s) !== -1 || moduleKeys.indexOf(alt) !== -1) return true;
  if (aliasArea && area && aliasArea === area.slug) return true;
  return false;
}

function contextMatches(contextSegs, node) {
  for (let i = 0; i < contextSegs.length; i++) {
    if (!contextSegMatches(contextSegs[i], node)) return false;
  }
  return true;
}

// Dentre nós de MESMO título, escolhe por tipo (concept → module → area) e valida
// o contexto. Retorna um resultado resolved/ambiguous, ou null se nada compatível.
function pickByKind(nodes, contextSegs) {
  const kinds = ["concept", "module", "area"];
  for (let k = 0; k < kinds.length; k++) {
    const kind = kinds[k];
    const sameKind = nodes.filter((n) => n.kind === kind);
    if (!sameKind.length) continue;

    const filtered = contextSegs.length ? sameKind.filter((n) => contextMatches(contextSegs, n)) : sameKind;

    if (filtered.length === 1) {
      const node = filtered[0];
      return { status: "resolved", kind: kind, node: node, id: node.id, href: hrefFor(kind, node) };
    }
    if (filtered.length > 1) {
      return { status: "ambiguous", candidates: filtered.map((n) => ({ kind: n.kind, id: n.id, title: n.title })) };
    }
  }
  return null;
}

// resolveRoadmapRef(rawRef, from)
//   → { status: "resolved",   kind: "area"|"module"|"concept", node, id, href }
//   | { status: "ambiguous",  ref, candidates: [{kind,id,title}] }
//   | { status: "unresolved", ref }
// `from` (Area/Module de origem) NÃO desambigua — só o contexto da própria string
// pode resolver. Mantido na assinatura para as ferramentas de auditoria.
function resolveRoadmapRef(rawRef, from) {
  void from;
  const ref = String(rawRef == null ? "" : rawRef).trim();
  if (!ref) return { status: "unresolved", ref: ref };

  const done = (hit) =>
    hit.status === "ambiguous" ? { status: "ambiguous", ref: ref, candidates: hit.candidates } : hit;

  // Fase 0 — caminho exato por slug ("Area / Module / Concept" ou "Area / Module").
  // Sinal mais forte possível: igualdade exata de slugs, zero ambiguidade.
  const slugPath = ref
    .split("/")
    .map((s) => slugify(s.trim()))
    .filter(Boolean)
    .join("/");
  if (slugPath) {
    const c = refIndex.conceptByPath.get(slugPath);
    if (c) return { status: "resolved", kind: "concept", node: c, id: c.id, href: hrefFor("concept", c) };
    const m = refIndex.moduleByPath.get(slugPath);
    if (m) return { status: "resolved", kind: "module", node: m, id: m.id, href: hrefFor("module", m) };
  }

  // Fase 1 — a string inteira já é um título? Cobre títulos consolidados com "/"
  // interno (ex.: "CPU-Bound vs I/O-Bound", "ACID (A / C / D)").
  const whole = [normRef(ref), normRef(stripTrailingParen(ref))];
  for (let i = 0; i < whole.length; i++) {
    if (i > 0 && whole[i] === whole[0]) continue;
    const nodes = refIndex.byTitle.get(whole[i]);
    if (nodes && nodes.length) {
      const hit = pickByKind(nodes, []);
      if (hit) return done(hit);
    }
  }

  // Fase 2 — "Contexto / … / Título". Remove o parentético final (pode conter "/")
  // antes de fatiar; reconstrói o último segmento com e sem o parentético.
  const parenMatch = ref.match(/\s*(\([^()]*\))\s*$/);
  const parenSuffix = parenMatch ? parenMatch[1] : "";
  const base = parenSuffix ? ref.slice(0, parenMatch.index).trim() : ref;

  const segments = base.split("/").map((s) => s.trim()).filter(Boolean);
  if (segments.length < 2) return { status: "unresolved", ref: ref };

  const lastRaw = segments[segments.length - 1];
  const contextSegs = segments.slice(0, -1);

  const targetNames = [];
  const withParen = normRef(parenSuffix ? lastRaw + " " + parenSuffix : lastRaw);
  const noParen = normRef(lastRaw);
  targetNames.push(withParen);
  if (noParen !== withParen) targetNames.push(noParen);

  for (let i = 0; i < targetNames.length; i++) {
    const nodes = refIndex.byTitle.get(targetNames[i]);
    if (!nodes || !nodes.length) continue;
    const hit = pickByKind(nodes, contextSegs);
    if (hit) return done(hit);
  }
  return { status: "unresolved", ref: ref };
}

// Índice inverso de `revisitOf`: targetConceptId -> [concepts que o revisitam].
// Necessário para auditoria/modelo (R2/R4). Sem seção visual nesta rodada.
let _revisitInverse = null;
function revisitInverseIndex() {
  if (_revisitInverse) return _revisitInverse;
  const map = new Map();
  areas.forEach((area) => {
    (area.modules || []).forEach((mod) => {
      (mod.concepts || []).forEach((concept) => {
        if (!concept.revisitOf) return;
        const r = resolveRoadmapRef(concept.revisitOf, { area: area, module: mod });
        if (r.status === "resolved" && r.kind === "concept") {
          const list = map.get(r.id);
          if (list) list.push(concept);
          else map.set(r.id, [concept]);
        }
      });
    });
  });
  _revisitInverse = map;
  return map;
}

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

  // Resolve uma string de relação (requires / revisit / revisitOf) para um nó
  // navegável. Ver resolveRoadmapRef acima para o contrato completo.
  resolveRoadmapRef: resolveRoadmapRef,

  // Map<conceptId, [concepts que o revisitam]> — derivado de `revisitOf`.
  revisitInverseIndex: revisitInverseIndex,
};

export const roadmapModel = model;
