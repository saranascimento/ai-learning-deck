/*
 * build-roadmap — R3.5.1: BUILD SCAFFOLD + AUDITORIA (ainda NÃO gera HTML).
 *
 * Prova que o Node consegue consumir dataset/model, valida as invariantes do
 * roadmap, valida a representação canônica de paths (routing/paths.js) e roda
 * testes objetivos de path/relativização.
 *
 * Requisitos: Node >= 22.7 (detecção de sintaxe ESM sem package.json). Zero
 * dependências. NÃO escreve arquivo, NÃO cria diretório, NÃO cria build/.
 *
 * Uso:  node scripts/build-roadmap.mjs
 * Exit: 0 se todas as invariantes obrigatórias passarem; != 0 caso contrário.
 */
import { roadmap } from "../src/roadmap/data/index.js";
import { roadmapModel as model } from "../src/roadmap/model/roadmap-model.js";
import { HOME_PATH, pathFor, filePathFor, depthOf, relativize } from "../src/roadmap/routing/paths.js";

// ---- harness mínimo (sem framework, sem deps) -----------------------------
const results = [];
function record(group, name, ok, detail) {
  results.push({ group, name, ok: !!ok, detail: detail || "" });
}
function expect(group, name, actual, expected) {
  const ok = Object.is(actual, expected);
  record(group, name, ok, ok ? String(actual) : `esperado ${JSON.stringify(expected)}, obtido ${JSON.stringify(actual)}`);
}
function throws(fn) {
  try {
    fn();
    return false;
  } catch {
    return true;
  }
}

// ---- travessia: Areas → Modules → Concepts --------------------------------
const areas = model.areas();
const nodes = [];
for (const area of areas) {
  nodes.push(area);
  for (const module of area.modules || []) {
    nodes.push(module);
    for (const concept of module.concepts || []) nodes.push(concept);
  }
}

const areaCount = areas.length;
const moduleCount = areas.reduce((n, a) => n + (a.modules || []).length, 0);
const conceptCount = areas.reduce(
  (n, a) => n + (a.modules || []).reduce((m, mo) => m + (mo.concepts || []).length, 0),
  0
);
const nodeCount = nodes.length;

// ---- 1. invariantes estruturais -----------------------------------------
expect("Invariantes", "roadmap (dataset) length", roadmap.length, 7);
expect("Invariantes", "Areas", areaCount, 7);
expect("Invariantes", "Modules", moduleCount, 89);
expect("Invariantes", "Concepts", conceptCount, 668);
expect("Invariantes", "Total de nós (7 + 89 + 668)", nodeCount, 764);
expect("Invariantes", "Nós percorridos == soma", nodeCount, areaCount + moduleCount + conceptCount);

// toda area navegável tem >=1 module; todo module tem >=1 concept
const emptyAreas = areas.filter((a) => a.status === "navigable" && (a.modules || []).length === 0).map((a) => a.slug);
const emptyModules = [];
for (const a of areas)
  for (const m of a.modules || []) if ((m.concepts || []).length === 0) emptyModules.push(a.slug + "/" + m.slug);
record("Invariantes", "Nenhuma Area navegável sem Module", emptyAreas.length === 0, emptyAreas.join(", ") || "ok");
record("Invariantes", "Nenhum Module sem Concept", emptyModules.length === 0, emptyModules.join(", ") || "ok");

// slug bem-formado
const badSlugs = nodes.filter((n) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(n.slug))).map((n) => n.id || n.slug);
record("Invariantes", "Todos os slugs no formato [a-z0-9-]", badSlugs.length === 0, badSlugs.slice(0, 10).join(", ") || "ok");

// ---- 2. unicidade de slug ENTRE IRMÃOS (respeita a hierarquia da URL) ----
const slugDups = [];
{
  const areaSlugs = new Set();
  for (const area of areas) {
    if (areaSlugs.has(area.slug)) slugDups.push("area:" + area.slug);
    areaSlugs.add(area.slug);
    const modSlugs = new Set();
    for (const module of area.modules || []) {
      if (modSlugs.has(module.slug)) slugDups.push(area.slug + "/" + module.slug);
      modSlugs.add(module.slug);
      const conSlugs = new Set();
      for (const concept of module.concepts || []) {
        if (conSlugs.has(concept.slug)) slugDups.push(area.slug + "/" + module.slug + "/" + concept.slug);
        conSlugs.add(concept.slug);
      }
    }
  }
}
record(
  "Slugs",
  "0 slugs duplicados entre irmãos (area / module / concept)",
  slugDups.length === 0,
  slugDups.length ? slugDups.join(", ") : "0 duplicados"
);

// ---- 3. unicidade de PATH lógico e de file path -------------------------
const logicalPaths = nodes.map((n) => pathFor(n));
const uniqueLogical = new Set(logicalPaths);
const pathCollisions = logicalPaths.filter((p, i) => logicalPaths.indexOf(p) !== i);
expect("Paths", "Paths lógicos gerados", logicalPaths.length, 764);
expect("Paths", "Paths lógicos únicos", uniqueLogical.size, 764);
record("Paths", "0 colisões de path lógico", pathCollisions.length === 0, [...new Set(pathCollisions)].join(", ") || "ok");

const filePaths = nodes.map((n) => filePathFor(n));
const uniqueFiles = new Set(filePaths);
expect("Paths", "File paths únicos", uniqueFiles.size, 764);
record("Paths", 'Nenhum file path colide com "index.html" (Home)', !filePaths.includes("index.html"), "ok");
record("Paths", 'Nenhum file path colide com "404.html"', !filePaths.includes("404.html"), "ok");

// ---- 4. auditoria de relações R2 (semântica resolveRoadmapRef) ----------
// Campos oficialmente auditados: Module.requires · Concept.requires ·
// Concept.revisit · Concept.revisitOf. Module.relocated / Module.suggestions
// são metadados editoriais de curadoria e NÃO entram (idêntico a views.js).
const audit = { total: 0, resolved: 0, ambiguous: 0, unresolved: 0, offenders: [] };
function tally(kind, ref, from) {
  audit.total++;
  const r = model.resolveRoadmapRef(ref, from);
  if (r.status === "resolved") audit.resolved++;
  else if (r.status === "ambiguous") {
    audit.ambiguous++;
    audit.offenders.push({ kind, ref, status: r.status });
  } else {
    audit.unresolved++;
    audit.offenders.push({ kind, ref, status: r.status });
  }
}
for (const area of areas) {
  for (const module of area.modules || []) {
    for (const ref of module.requires || []) tally("Module.requires", ref, { area, module: null });
    for (const concept of module.concepts || []) {
      const from = { area, module };
      for (const ref of concept.requires || []) tally("Concept.requires", ref, from);
      for (const ref of concept.revisit || []) tally("Concept.revisit", ref, from);
      if (concept.revisitOf) tally("Concept.revisitOf", concept.revisitOf, from);
    }
  }
}
expect("Relações R2", "total", audit.total, 916);
expect("Relações R2", "resolved", audit.resolved, 916);
expect("Relações R2", "ambiguous", audit.ambiguous, 0);
expect("Relações R2", "unresolved", audit.unresolved, 0);

// ---- 5. testes objetivos de path (valores esperados EXPLÍCITOS) ---------
// Nós sintéticos com slugs conhecidos — sem reimplementar a lógica de paths.js.
const A = { kind: "area", slug: "area-a" };
const AX = { kind: "area", slug: "area-x" };
const MB = { kind: "module", slug: "mod-b", area: A };
const ME = { kind: "module", slug: "mod-e", area: A };
const MY = { kind: "module", slug: "mod-y", area: AX };
const CC = { kind: "concept", slug: "con-c", area: A, module: MB };
const CD = { kind: "concept", slug: "con-d", area: A, module: MB };
const CF = { kind: "concept", slug: "con-f", area: A, module: ME };
const CZ = { kind: "concept", slug: "con-z", area: AX, module: MY };

expect("pathFor", "Home", HOME_PATH, "/");
expect("pathFor", "Area", pathFor(A), "/areas/area-a/");
expect("pathFor", "Module", pathFor(MB), "/areas/area-a/modules/mod-b/");
expect("pathFor", "Concept", pathFor(CC), "/areas/area-a/modules/mod-b/concepts/con-c/");

expect("filePathFor", "Home", filePathFor(HOME_PATH), "index.html");
expect("filePathFor", "Area", filePathFor(A), "areas/area-a/index.html");
expect("filePathFor", "Module", filePathFor(MB), "areas/area-a/modules/mod-b/index.html");
expect("filePathFor", "Concept", filePathFor(CC), "areas/area-a/modules/mod-b/concepts/con-c/index.html");

expect("depthOf", "Home", depthOf("/"), 0);
expect("depthOf", "Area", depthOf("/areas/area-a/"), 2);
expect("depthOf", "Module", depthOf("/areas/area-a/modules/mod-b/"), 4);
expect("depthOf", "Concept", depthOf("/areas/area-a/modules/mod-b/concepts/con-c/"), 6);

const REL = [
  ["Home → Area", relativize("/", pathFor(A)), "areas/area-a/"],
  ["Area → Home", relativize(pathFor(A), "/"), "../../"],
  ["Area → Module", relativize(pathFor(A), pathFor(MB)), "modules/mod-b/"],
  ["Module → Area", relativize(pathFor(MB), pathFor(A)), "../../"],
  ["Module → Concept", relativize(pathFor(MB), pathFor(CC)), "concepts/con-c/"],
  ["Concept → Module", relativize(pathFor(CC), pathFor(MB)), "../../"],
  ["Concept → Concept irmão", relativize(pathFor(CC), pathFor(CD)), "../con-d/"],
  ["Concept → Concept outro Module", relativize(pathFor(CC), pathFor(CF)), "../../../mod-e/concepts/con-f/"],
  ["Concept → Concept outra Area", relativize(pathFor(CC), pathFor(CZ)), "../../../../../area-x/modules/mod-y/concepts/con-z/"],
  ["Concept → Home", relativize(pathFor(CC), "/"), "../../../../../../"],
];
for (const [name, actual, exp] of REL) expect("relativize", name, actual, exp);

// ---- 6. pathFor — falhas explícitas ------------------------------------
record("pathFor validação", "node ausente lança", throws(() => pathFor(null)));
record("pathFor validação", "kind desconhecido lança", throws(() => pathFor({ kind: "planet", slug: "x" })));
record("pathFor validação", "slug ausente lança (Area)", throws(() => pathFor({ kind: "area" })));
record("pathFor validação", "Module sem area.slug lança", throws(() => pathFor({ kind: "module", slug: "m", area: {} })));
record(
  "pathFor validação",
  "Concept sem area.slug lança",
  throws(() => pathFor({ kind: "concept", slug: "c", area: {}, module: { slug: "m" } }))
);
record(
  "pathFor validação",
  "Concept sem module.slug lança",
  throws(() => pathFor({ kind: "concept", slug: "c", area: { slug: "a" }, module: {} }))
);

// ---- 7. contagens conceituais (registro, sem gerar nada) ---------------
const contentRoutes = 1 + areaCount + moduleCount + conceptCount; // 765
const htmlPages = contentRoutes + 1; // 766 (+ 404)
expect("Contagens futuras", "roadmap node paths", nodeCount, 764);
expect("Contagens futuras", "content routes (1 Home + 7 + 89 + 668)", contentRoutes, 765);
expect("Contagens futuras", "HTML pages (765 content + 1 página 404)", htmlPages, 766);

// ---- relatório ---------------------------------------------------------
const GROUPS = [...new Set(results.map((r) => r.group))];
let failed = 0;
console.log("build-roadmap — R3.5.1  (scaffold + auditoria; nenhum arquivo escrito)\n");
for (const group of GROUPS) {
  console.log(group);
  for (const r of results.filter((x) => x.group === group)) {
    if (!r.ok) failed++;
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? " — " + r.detail : ""}`);
  }
  console.log("");
}

console.log("Auditoria de relações R2 — campos: Module.requires · Concept.requires · Concept.revisit · Concept.revisitOf");
console.log("  (Module.relocated / Module.suggestions = metadados editoriais, fora da auditoria — idêntico a views.js)");
console.log(`  total ${audit.total} · resolved ${audit.resolved} · ambiguous ${audit.ambiguous} · unresolved ${audit.unresolved}`);
for (const o of audit.offenders.slice(0, 20)) console.log(`  ✗ ${o.kind}: ${JSON.stringify(o.ref)} → ${o.status}`);
console.log("");

console.log("Contagens conceituais (futuras — nada gerado nesta etapa)");
console.log(`  ${nodeCount} roadmap node paths`);
console.log(`  ${contentRoutes} content routes futuras: 1 Home + ${areaCount} Areas + ${moduleCount} Modules + ${conceptCount} Concepts`);
console.log(`  ${htmlPages} HTML pages futuras: ${contentRoutes} content pages + 1 página 404`);
console.log("  Artefatos auxiliares (ex.: _routes.txt) NÃO entram nessa contagem.");
console.log("");

console.log(failed === 0 ? "OK — todas as invariantes passaram" : `FALHOU — ${failed} verificação(ões)`);
process.exit(failed === 0 ? 0 : 1);
