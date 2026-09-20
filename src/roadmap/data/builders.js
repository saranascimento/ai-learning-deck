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
      // content: null | bloco[] — corpo da aba Conteúdo. Tipos de bloco (renderer: render/concept.mjs):
      //   { type: "heading", text }                        título de seção (numerado na página; ganha id sec-N)
      //   { type: "paragraph", text }                      texto; aceita `código inline` entre crases
      //   { type: "list", items: [texto] }                 lista com bolinhas (mesma regra de crases)
      //   { type: "callout", title, text }                 destaque com lâmpada (ex.: "Por que isso é importante?")
      //   { type: "flow", label, steps: [...] }            diagrama de caixas e setas — OPCIONAL, só se houver fluxo real
      //                                                    step = { lines: [..] } | { title, tags: [{ text, tone: ok|err|neutral }] }
      //   { type: "code", language, filename | label, code } bloco de código; `label` troca ícone+filename por selo+rótulo
      //   { type: "takeaway", text }                       "Em resumo" (formato anterior; continua válido)
      // Tipo desconhecido ou bloco malformado faz o build FALHAR (não renderiza em silêncio).
      // Estrutura de seções: começar em "Conceito" e fechar com os limites (Quando não usar / Limitações ou
      // Armadilhas); o miolo depende do tipo de conceito (padrão/técnica, princípio, smell, prática, mecanismo).
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
