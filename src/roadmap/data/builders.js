// Açúcar de construção — não é API pública.
export const area = (o) => Object.assign({ kind: "area", status: "navigable", modules: [], plannedModules: [] }, o);
export const module = (o) => Object.assign({ kind: "module", requires: [], relocated: [], suggestions: [], concepts: [] }, o);
export const concept = (o) =>
  Object.assign(
    {
      kind: "concept",
      requires: [],
      canonical: true,
      revisit: [],
      revisitOf: null,
      collision: null,
      note: "",
      isNew: false,
      subtopics: [],
      resources: [],
      content: null,
      // R1 — dimensões aditivas: classificação semântica (learningFocus/essential)
      // e conteúdo de estudo (summary/examples/exercise). Só defaults estruturais
      // nesta rodada; o preenchimento é trabalho editorial (R5+).
      learningFocus: [],
      essential: false,
      summary: "",
      examples: [],
      exercise: null,
    },
    o
  );
