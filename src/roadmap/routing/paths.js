/*
 * paths — representação canônica dos caminhos REAIS do roadmap estático.
 *
 * Módulo FOLHA e PURO: zero imports. Não conhece `model`, `router`, `data`,
 * hash routing, domínio, base path (`/ai-learning-deck/`) nem ambiente de deploy.
 * Opera apenas sobre PATHS LÓGICOS CANÔNICOS e sobre a forma de nó já indexada.
 *
 * Contrato de nó (garantido por roadmap-model.js → index() antes de qualquer uso):
 *   - node.kind   : "area" | "module" | "concept"
 *   - node.slug   : string não-vazia
 *   - node.area   : nó da Area  (em module e concept)
 *   - node.module : nó do Module (em concept)
 * É o MESMO contrato que routing/router.js já consome — acoplamento por convenção,
 * não por import. `paths.js` continua não importando nada.
 *
 * Paths lógicos canônicos (sempre com "/" inicial; páginas terminam com "/"):
 *   Home     /
 *   Area     /areas/<area>/
 *   Module   /areas/<area>/modules/<module>/
 *   Concept  /areas/<area>/modules/<module>/concepts/<concept>/
 *
 * Determinístico: só manipulação de string. Sem I/O, sem estado.
 */

export const HOME_PATH = "/";

const KINDS = new Set(["area", "module", "concept"]);

function fail(message) {
  throw new Error("paths: " + message);
}

function requireSlug(value, label) {
  if (typeof value !== "string" || value.length === 0) fail(label + " sem slug");
  return value;
}

function assertLogicalPath(p) {
  if (typeof p !== "string" || p.length === 0) fail("logical path ausente");
  if (p[0] !== "/") fail('logical path deve começar com "/": ' + JSON.stringify(p));
  if (p[p.length - 1] !== "/") fail('logical path deve terminar com "/": ' + JSON.stringify(p));
  if (p.indexOf("//") !== -1) fail('logical path com "//": ' + JSON.stringify(p));
}

function segments(logicalPath) {
  return logicalPath.split("/").filter(Boolean);
}

/**
 * pathFor(node) → path lógico canônico da página do nó.
 * Falha explicitamente para node ausente, kind desconhecido, slug ausente,
 * Module sem area.slug, Concept sem area.slug e Concept sem module.slug.
 */
export function pathFor(node) {
  if (node == null || typeof node !== "object") fail("node ausente");
  const kind = node.kind;
  if (!KINDS.has(kind)) fail("kind desconhecido: " + JSON.stringify(kind));

  if (kind === "area") {
    const area = requireSlug(node.slug, "Area");
    return "/areas/" + area + "/";
  }

  if (kind === "module") {
    if (node.area == null || typeof node.area !== "object") fail("Module sem area");
    const area = requireSlug(node.area.slug, "Module.area");
    const mod = requireSlug(node.slug, "Module");
    return "/areas/" + area + "/modules/" + mod + "/";
  }

  // concept
  if (node.area == null || typeof node.area !== "object") fail("Concept sem area");
  const area = requireSlug(node.area.slug, "Concept.area");
  if (node.module == null || typeof node.module !== "object") fail("Concept sem module");
  const mod = requireSlug(node.module.slug, "Concept.module");
  const concept = requireSlug(node.slug, "Concept");
  return "/areas/" + area + "/modules/" + mod + "/concepts/" + concept + "/";
}

/**
 * filePathFor(nodeOrHomePath) → caminho físico FUTURO do HTML, relativo à raiz
 * de saída. Aceita um nó indexado ou HOME_PATH ("/"). Não escreve nada.
 *   Home     → "index.html"
 *   Area     → "areas/<area>/index.html"
 *   Module   → "areas/<area>/modules/<module>/index.html"
 *   Concept  → "areas/<area>/modules/<module>/concepts/<concept>/index.html"
 */
export function filePathFor(nodeOrHomePath) {
  const logical = typeof nodeOrHomePath === "string" ? nodeOrHomePath : pathFor(nodeOrHomePath);
  assertLogicalPath(logical);
  const dir = segments(logical).join("/");
  return dir === "" ? "index.html" : dir + "/index.html";
}

/**
 * depthOf(logicalPath) → nº de segmentos de diretório.
 *   Home 0 · Area 2 · Module 4 · Concept 6
 */
export function depthOf(logicalPath) {
  assertLogicalPath(logicalPath);
  return segments(logicalPath).length;
}

/**
 * relativize(fromLogicalPath, toLogicalPath) → href relativo, resolvido a partir
 * do diretório da página em `fromLogicalPath` (ambos terminam com "/").
 *   relativize("/", "/areas/a/")                 → "areas/a/"
 *   relativize("/areas/a/", "/")                 → "../../"
 *   relativize(".../concepts/c/", ".../concepts/d/") → "../d/"
 * Mesmo path de origem e destino → "./".
 */
export function relativize(fromLogicalPath, toLogicalPath) {
  assertLogicalPath(fromLogicalPath);
  assertLogicalPath(toLogicalPath);

  const from = segments(fromLogicalPath);
  const to = segments(toLogicalPath);

  let common = 0;
  while (common < from.length && common < to.length && from[common] === to[common]) common++;

  const ups = from.length - common;
  const down = to.slice(common);

  let out = "";
  for (let i = 0; i < ups; i++) out += "../";
  if (down.length) out += down.join("/") + "/";
  return out === "" ? "./" : out;
}
