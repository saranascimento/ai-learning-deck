/*
 * Composition root do dataset do Roadmap Senior — único ponto público da camada de dados.
 * Consumidores importam daqui, nunca de areas/* diretamente.
 * FONTE DA VERDADE: roadmap/00-overview.md + roadmap/01..07-*.md.
 * Estrutura FINAL/FROZEN — não reorganizar, não alterar Requires, não criar Concepts aqui.
 */
import { roadmapMeta } from "./meta.js";
import a01 from "./areas/01-programming-foundations.js";
import a02 from "./areas/02-testing-quality-engineering.js";
import a03 from "./areas/03-software-craft.js";
import a04 from "./areas/04-software-design.js";
import a05 from "./areas/05-platform-engineering.js";
import a06 from "./areas/06-architecture-system-design.js";
import a07 from "./areas/07-ai-engineering.js";

export const roadmap = [a01, a02, a03, a04, a05, a06, a07];
export { roadmapMeta };
