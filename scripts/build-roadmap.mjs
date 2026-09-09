/*
 * build-roadmap — R3.5.5: AUDITORIA + PREVIEW (Home + 7 Areas + 89 Modules + 404).
 *
 * Preserva todas as validações da R3.5.1–R3.5.4 e, se tudo passar, gera a Home
 * DevAtlas, as 7 Areas, as 89 Modules (areas/<a>/modules/<m>/index.html) e o
 * 404. Concept → R3.5.6+. Sem JavaScript.
 *
 * Requisitos: Node >= 22.7 (detecção de sintaxe ESM sem package.json). Zero
 * dependências. Só escreve dentro de build/ (gitignored). Não toca na SPA.
 *
 * Uso:  node scripts/build-roadmap.mjs
 * Exit: 0 se todas as invariantes obrigatórias passarem; != 0 caso contrário
 *       (nesse caso o preview NÃO é escrito).
 */
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { roadmap, roadmapMeta } from "../src/roadmap/data/index.js";
import { roadmapModel as model } from "../src/roadmap/model/roadmap-model.js";
import { HOME_PATH, pathFor, filePathFor, depthOf, relativize } from "../src/roadmap/routing/paths.js";
import { renderDocument, escapeAttr } from "../src/roadmap/render/html.mjs";
import { renderHome } from "../src/roadmap/render/home.mjs";
import { renderArea } from "../src/roadmap/render/area.mjs";
import { renderModule } from "../src/roadmap/render/module.mjs";
import { num, escapeHtml, renderChipList } from "../src/roadmap/render/partials.mjs";

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

// ---- 8. preview: Home real (R3.5.3) + 404 (R3.5.2) --------------------
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PREVIEW_DIR = join(ROOT, "build", "preview");
// CSS existente é COPIADO para dentro de build/preview/css/ para o preview ser
// autossuficiente (servível com `cd build/preview && python3 -m http.server`).
// Não move nem altera os originais em css/. hrefs relativos, sem base absoluta.
const CSS_FILES = ["reset.css", "variables.css", "base.css", "roadmap.css", "roadmap/_shell.css"];
const STYLESHEETS = CSS_FILES.map((p) => "css/" + p);

// hrefs de CSS na profundidade da página: Home/404 (logical "/") → "css/…";
// Area (logical "/areas/<slug>/") → "../../css/…". Sem base absoluta.
function stylesheetsFor(logicalPath) {
  const rel = relativize(logicalPath, HOME_PATH); // "./" na raiz, "../../" na Area
  const prefix = rel === "./" ? "" : rel;
  return CSS_FILES.map((f) => prefix + "css/" + f);
}

const homeHref = relativize(HOME_PATH, HOME_PATH); // "./"

// Identidade do produto — DevAtlas. Separada do roadmapMeta (que descreve só o
// conjunto de conteúdo: as 7 Áreas). Futuramente pode virar src/site/product.mjs
// ou um campo product: em meta.js sem rework — os renderers já recebem por
// parâmetro. Serve a todos os níveis (do básico ao avançado): sem copy de sênior.
const PRODUCT = {
  name: "DevAtlas",
  tagline: "Mapa de conhecimento para desenvolvimento de software.",
  footerText: "DevAtlas — mapa de conhecimento para desenvolvimento de software.",
};

// view-model da Home montado a partir de model + paths; home.mjs é puro sobre ele.
const areaVM = model.areas().map((a, i) => ({
  index: i,
  title: a.title,
  slug: a.slug,
  navigable: a.status === "navigable",
  summary: a.summary,
  color: a.color,
  moduleCount: model.moduleCount(a),
  conceptCount: model.conceptCount(a),
  href: relativize(HOME_PATH, pathFor(a)), // "areas/<slug>/"
}));
const deckVM = model.decks().map((d) => ({ title: d.title, url: d.url }));

const indexHtml = renderHome({
  product: PRODUCT,
  areas: areaVM,
  decks: deckVM,
  homeHref,
  stylesheets: STYLESHEETS,
});

const notFoundHtml = renderDocument({
  title: "Página não encontrada · " + PRODUCT.name,
  homeHref,
  homeLabel: PRODUCT.name,
  navLabel: PRODUCT.name,
  footerText: PRODUCT.footerText,
  stylesheets: STYLESHEETS,
  main: [
    "      <h1>Página não encontrada</h1>",
    "      <p>O endereço solicitado não existe neste site.</p>",
    '      <p><a href="' + escapeAttr(homeHref) + '">Voltar para a Home</a></p>',
  ].join("\n"),
});

// landmarks/shell — comuns às duas páginas (Home tem <header class="masthead">
// e <footer class="home-decks"> DENTRO do <main>: válidos, não são banner/
// contentinfo — por isso as contagens miram o site-header / site-footer).
function landmarkChecks(label, html) {
  const g = "Shell (" + label + ")";
  record(g, "doctype minúsculo", html.startsWith("<!doctype html>"));
  record(g, 'lang="pt-BR"', html.includes('<html lang="pt-BR">'));
  record(g, "meta charset utf-8", html.includes('<meta charset="utf-8" />'));
  record(g, "meta viewport", html.includes('name="viewport"'));
  record(g, "<title> não vazio", /<title>[^<]+<\/title>/.test(html));
  record(g, "skip-link aponta para #main", html.includes('<a href="#main" class="skip-link">Pular para o conteúdo principal</a>'));
  record(g, "exatamente um <header class=\"site-header\">", (html.match(/<header class="site-header">/g) || []).length === 1);
  record(g, `nav aria-label="${PRODUCT.name}" (uma vez)`, (html.match(new RegExp(`<nav aria-label="${PRODUCT.name}">`, "g")) || []).length === 1);
  record(g, `rodapé = "${PRODUCT.footerText}"`, html.includes(`<footer class="site-footer">\n      <p>${PRODUCT.footerText}</p>`));
  record(g, "sem copy de nível/sênior (Senior Software Engineer / sênior / roadmap sênior)", !/senior software engineer|nível sênior|roadmap.{0,12}sênior/i.test(html));
  record(g, "exatamente um <main>", (html.match(/<main[\s>]/g) || []).length === 1);
  record(g, 'main#main tabindex="-1"', html.includes('<main id="main" tabindex="-1">'));
  record(g, "exatamente um <footer class=\"site-footer\">", (html.match(/<footer class="site-footer">/g) || []).length === 1);
  record(g, "exatamente um <h1>", (html.match(/<h1[\s>]/g) || []).length === 1);
  record(g, "sem aria-live", !html.includes("aria-live"));
  record(g, "sem <script>", !html.toLowerCase().includes("<script"));
  record(g, "_shell.css referenciado", html.includes("css/roadmap/_shell.css"));
  record(g, "assets/links sem base absoluta, sem hash-route", !/(?:href|src)="(?:\/|https?:|#\/)/.test(html) && !html.includes("/ai-learning-deck/"));
}
landmarkChecks("index.html", indexHtml);
landmarkChecks("404.html", notFoundHtml);

// ---- 9. validação da Home real --------------------------------------
{
  const g = "Home";
  const titleLinks = [...indexHtml.matchAll(/<h2 class="area-card__title"><a class="area-card__title--link" href="([^"]+)">([^<]+)<\/a><\/h2>/g)];
  record(g, "exatamente 7 <li class=\"area-card\">", (indexHtml.match(/<li class="area-card/g) || []).length === 7);
  record(g, "exatamente 7 títulos <h2 class=\"area-card__title\">", (indexHtml.match(/<h2 class="area-card__title">/g) || []).length === 7);
  record(g, "7 Áreas navegáveis com <a href> no título", titleLinks.length === 7);
  record(g, 'lista semântica <ul class="area-grid"> com 7 <li>', /<ul class="area-grid"[^>]*>/.test(indexHtml));
  record(g, "um único <h1> (masthead)", (indexHtml.match(/<h1[\s>]/g) || []).length === 1);
  record(g, `masthead h1 = "${PRODUCT.name}"`, indexHtml.includes(`<h1 class="masthead__title">${PRODUCT.name}</h1>`));
  record(g, `masthead subtítulo = "${PRODUCT.tagline}"`, indexHtml.includes(`<p class="masthead__subtitle">${PRODUCT.tagline}</p>`));
  record(g, "identidade do produto NÃO vem de roadmapMeta.title", !indexHtml.includes(`>${roadmapMeta.title}<`));

  let orderOk = true;
  let countOk = true;
  let kickerOk = true;
  model.areas().forEach((a, i) => {
    const link = titleLinks[i];
    if (!link || link[2] !== escapeHtml(a.title) || link[1] !== relativize(HOME_PATH, pathFor(a))) orderOk = false;
    if (!indexHtml.includes(`>${model.moduleCount(a)} módulos · ${model.conceptCount(a)} conceitos<`)) countOk = false;
    if (!indexHtml.includes(`<p class="area-card__kicker">${("Área " + num(i)).toUpperCase()}</p>`)) kickerOk = false;
  });
  record(g, "ordem + títulos + hrefs idênticos ao model", orderOk);
  record(g, "kickers ÁREA 01..07 na ordem", kickerOk);
  record(g, "contagens Modules · Concepts por Área corretas", countOk);
  record(g, "hrefs de Área = areas/<slug>/ (relativo)", titleLinks.every(([, href], i) => href === "areas/" + model.areas()[i].slug + "/"));
  record(g, "sem href de hash (#/)", !indexHtml.includes("#/"));
  record(g, "sem href absoluto (leading /) nem /ai-learning-deck/", !/href="\//.test(indexHtml) && !indexHtml.includes("/ai-learning-deck/"));
  record(g, "sem <script>", !indexHtml.toLowerCase().includes("<script"));
  record(g, "sem aria-live", !indexHtml.includes("aria-live"));

  // decks / resources
  record(g, `${deckVM.length} decks no rodapé <footer class="home-decks">`, deckVM.length > 0 && indexHtml.includes('<footer class="home-decks">'));
  record(
    g,
    "títulos + hrefs relativos dos decks corretos",
    deckVM.every((d) => indexHtml.includes(`<a href="${d.url}">${d.title}</a>`) && !d.url.startsWith("/") && !d.url.includes("#"))
  );

  // ramo não-navegável (0 áreas assim hoje) — teste sintético
  const synth = renderHome({
    product: { name: "T", tagline: "S", footerText: "T" },
    areas: [
      { index: 0, title: "Em Obras", slug: "em-obras", navigable: false, summary: "x", color: "#ffffff", moduleCount: 3, conceptCount: 0, href: "areas/em-obras/" },
    ],
    decks: [],
    homeHref: "./",
    stylesheets: [],
  });
  record("Home (não navegável)", "título sem <a href>", !synth.includes('class="area-card__title--link"'));
  record("Home (não navegável)", 'badge "Em estruturação"', synth.includes('<p class="area-card__badge">Em estruturação</p>'));
  record("Home (não navegável)", '"N módulos planejados"', synth.includes("3 módulos planejados"));
  record("Home (não navegável)", "classe area-card--structuring", synth.includes("area-card--structuring"));
}

// ---- 10. páginas de Area (R3.5.4) ----------------------------------
const areaPages = model.areas().map((area, i) => {
  const areaPath = pathFor(area); // "/areas/<slug>/"
  const mods = model.modules(area).map((mod, mi) => ({
    index: mi,
    title: mod.title,
    slug: mod.slug,
    conceptCount: model.conceptCount(mod),
    href: relativize(areaPath, pathFor(mod)), // "modules/<slug>/"
  }));
  const html = renderArea({
    product: PRODUCT,
    area: {
      index: i,
      title: area.title,
      slug: area.slug,
      summary: area.summary,
      color: area.color,
      moduleCount: model.modules(area).length,
      conceptCount: model.conceptCount(area),
    },
    modules: mods,
    homeHref: relativize(areaPath, HOME_PATH), // "../../"
    stylesheets: stylesheetsFor(areaPath),
  });
  return { area, file: filePathFor(area), html, mods };
});

// landmarks/shell nas 7 páginas de Area — agregado 7/7
{
  const g = "Shell (Areas)";
  const checks = {
    "doctype minúsculo": (h) => h.startsWith("<!doctype html>"),
    'lang="pt-BR"': (h) => h.includes('<html lang="pt-BR">'),
    "meta charset utf-8": (h) => h.includes('<meta charset="utf-8" />'),
    "<title> não vazio": (h) => /<title>[^<]+<\/title>/.test(h),
    "skip-link → #main": (h) => h.includes('<a href="#main" class="skip-link">Pular para o conteúdo principal</a>'),
    "um <header class=site-header>": (h) => (h.match(/<header class="site-header">/g) || []).length === 1,
    [`nav aria-label="${PRODUCT.name}"`]: (h) => (h.match(new RegExp(`<nav aria-label="${PRODUCT.name}">`, "g")) || []).length === 1,
    "rodapé DevAtlas": (h) => h.includes(`<footer class="site-footer">\n      <p>${PRODUCT.footerText}</p>`),
    "um <main>": (h) => (h.match(/<main[\s>]/g) || []).length === 1,
    'main#main tabindex="-1"': (h) => h.includes('<main id="main" tabindex="-1">'),
    "um <footer class=site-footer>": (h) => (h.match(/<footer class="site-footer">/g) || []).length === 1,
    "_shell.css referenciado": (h) => h.includes("css/roadmap/_shell.css"),
    "sem copy de nível/sênior": (h) => !/senior software engineer|nível sênior|roadmap.{0,12}sênior/i.test(h),
  };
  for (const [name, fn] of Object.entries(checks)) {
    const bad = areaPages.filter((p) => !fn(p.html)).map((p) => p.area.slug);
    record(g, `${name} (7/7)`, bad.length === 0, bad.length ? "falhou em: " + bad.join(", ") : "");
  }
}

// ---- 11. validação das 7 páginas de Area ---------------------------
{
  const g = "Areas (R3.5.4)";
  record(g, "7 páginas de Area geradas", areaPages.length === 7);
  record(
    g,
    "Home → Area: os 7 destinos existem em build/preview/",
    areaVM.every((a) => areaPages.some((p) => p.file === "areas/" + a.slug + "/index.html"))
  );

  const rowRe =
    /<a class="track__row" href="([^"]+)">\s*<span class="track__num">([^<]+)<\/span>\s*<span class="track__title">([^<]*)<\/span>\s*<span class="track__meta">(\d+) conceitos<\/span>/g;

  const fails = [];
  let pathOk = true;
  let titleOk = true;
  let h1Ok = true;
  let kickerOk = true;
  let summaryOk = true;
  let metaOk = true;
  let crumbHomeOk = true;
  let crumbCurrentOk = true;
  let cardCountOk = true;
  let moduleFieldsOk = true;
  let sumOk = true;
  let modHrefOk = true;
  let noHashOk = true;
  let noRoadmapRouteOk = true;
  let noAbsOk = true;
  let noScriptOk = true;
  let noAriaLiveOk = true;

  areaPages.forEach(({ area, file, html, mods }, i) => {
    const realMods = model.modules(area);
    const push = (cond, label) => {
      if (!cond) fails.push(`${area.slug}: ${label}`);
      return cond;
    };
    pathOk = push(file === `areas/${area.slug}/index.html`, "path físico") && pathOk;
    titleOk = push(html.includes(`<title>${escapeHtml(area.title)} · ${PRODUCT.name}</title>`), "title = Area · DevAtlas") && titleOk;
    h1Ok = push((html.match(/<h1[\s>]/g) || []).length === 1, "1 h1") && h1Ok;
    h1Ok = push(html.includes(`<h1 class="page-head__title">${escapeHtml(area.title)}</h1>`), "h1 = título da Area") && h1Ok;
    kickerOk = push(html.includes(`<p class="page-head__kicker">${("Área " + num(i)).toUpperCase()}</p>`), "kicker ÁREA NN") && kickerOk;
    summaryOk = push(html.includes(`<p class="page-head__desc">${escapeHtml(area.summary)}</p>`), "summary da Area") && summaryOk;
    metaOk =
      push(
        html.includes(`<p class="page-head__meta">${realMods.length} módulos · ${model.conceptCount(area)} conceitos</p>`),
        "meta N módulos · M conceitos"
      ) && metaOk;
    crumbHomeOk = push(html.includes(`<a class="crumbs__link" href="../../">${PRODUCT.name}</a>`), "breadcrumb Home → ../../") && crumbHomeOk;
    crumbCurrentOk =
      push(
        html.includes(`<span class="crumbs__here" aria-current="page">${escapeHtml(area.title)}</span>`),
        "breadcrumb: Area atual = aria-current, sem self-link"
      ) && crumbCurrentOk;

    const rows = [...html.matchAll(rowRe)];
    cardCountOk = push(rows.length === realMods.length && rows.length === mods.length, "nº de module cards == nº real de Modules") && cardCountOk;

    let sum = 0;
    realMods.forEach((mod, mi) => {
      const row = rows[mi];
      sum += model.conceptCount(mod);
      if (!row) {
        moduleFieldsOk = false;
        return;
      }
      if (row[1] !== relativize(pathFor(area), pathFor(mod))) modHrefOk = false;
      if (row[1] !== "modules/" + mod.slug + "/") modHrefOk = false;
      if (row[2] !== num(mi)) moduleFieldsOk = false;
      if (row[3] !== escapeHtml(mod.title)) moduleFieldsOk = false;
      if (Number(row[4]) !== model.conceptCount(mod)) moduleFieldsOk = false;
    });
    if (!moduleFieldsOk) fails.push(`${area.slug}: campos/ordem de Module`);
    if (!modHrefOk) fails.push(`${area.slug}: href de Module`);
    sumOk = push(sum === model.conceptCount(area), "Σ conceitos dos Modules == total da Area") && sumOk;

    // /roadmap/ e absoluto: só em href de NAVEGAÇÃO (<a>), não em <link> de CSS
    const navHrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
    noHashOk = push(!navHrefs.some((h) => h.includes("#/")), "sem hash-route em <a href>") && noHashOk;
    noRoadmapRouteOk = push(!navHrefs.some((h) => h.includes("/roadmap/")), "sem rota /roadmap/ em <a href>") && noRoadmapRouteOk;
    noAbsOk =
      push(
        !navHrefs.some((h) => h.startsWith("/") || h.startsWith("http")) && !html.includes("/ai-learning-deck/"),
        "sem href de navegação absoluto / base fixa"
      ) && noAbsOk;
    noScriptOk = push(!html.toLowerCase().includes("<script"), "sem <script>") && noScriptOk;
    noAriaLiveOk = push(!html.includes("aria-live"), "sem aria-live") && noAriaLiveOk;
  });

  record(g, "path físico areas/<slug>/index.html (7/7)", pathOk);
  record(g, "title = «Area · DevAtlas» (7/7)", titleOk);
  record(g, "exatamente um <h1> = título da Area (7/7)", h1Ok);
  record(g, "kicker ÁREA NN na ordem (7/7)", kickerOk);
  record(g, "summary da Area preservado (7/7)", summaryOk);
  record(g, "meta «N módulos · M conceitos» (7/7)", metaOk);
  record(g, "breadcrumb Home → ../../ (7/7)", crumbHomeOk);
  record(g, "breadcrumb Area atual = aria-current, sem self-link (7/7)", crumbCurrentOk);
  record(g, "nº de module cards == nº real de Modules (7/7)", cardCountOk);
  record(g, "Module: num + título + conceptCount + ordem (7/7)", moduleFieldsOk);
  record(g, "href de cada Module = modules/<slug>/ relativo (7/7)", modHrefOk);
  record(g, "Σ conceitos dos Modules == total da Area (7/7)", sumOk);
  record(g, "zero hash-route (#/) em <a href> (7/7)", noHashOk);
  record(g, "zero rota /roadmap/ em <a href> — css/roadmap/ não conta (7/7)", noRoadmapRouteOk);
  record(g, "zero href de navegação absoluto / /ai-learning-deck/ (7/7)", noAbsOk);
  record(g, "zero <script> (7/7)", noScriptOk);
  record(g, "zero aria-live (7/7)", noAriaLiveOk);
  if (fails.length) record(g, "falhas detalhadas", false, fails.slice(0, 20).join(" | "));
}

// ---- 12. páginas de Module (R3.5.5) ------------------------------
const modulePages = [];
for (const area of model.areas()) {
  model.modules(area).forEach((module, mi) => {
    const modPath = pathFor(module); // "/areas/<a>/modules/<m>/"
    const conceptsVM = model.concepts(module).map((c, ci) => ({
      index: ci,
      title: c.title,
      slug: c.slug,
      href: relativize(modPath, pathFor(c)), // "concepts/<slug>/"
      essential: c.essential,
      canonical: c.canonical,
      learningFocus: c.learningFocus || [],
    }));
    const requiresVM = (module.requires || []).map((raw) => {
      const r = model.resolveRoadmapRef(raw, { area, module: null });
      return r.status === "resolved"
        ? { raw, kind: r.kind, href: relativize(modPath, pathFor(r.node)) }
        : { raw, status: r.status };
    });
    const html = renderModule({
      product: PRODUCT,
      area: { title: area.title, href: relativize(modPath, pathFor(area)) }, // "../../"
      module: {
        index: mi,
        title: module.title,
        slug: module.slug,
        summary: module.summary || "",
        conceptCount: model.concepts(module).length,
        color: area.color,
      },
      concepts: conceptsVM,
      requires: requiresVM,
      homeHref: relativize(modPath, HOME_PATH), // "../../../../"
      stylesheets: stylesheetsFor(modPath),
    });
    modulePages.push({ area, module, file: filePathFor(module), html, requiresVM });
  });
}

// landmarks/shell nas 89 páginas de Module — agregado
{
  const g = "Shell (Modules)";
  const checks = {
    "doctype minúsculo": (h) => h.startsWith("<!doctype html>"),
    'lang="pt-BR"': (h) => h.includes('<html lang="pt-BR">'),
    "<title> não vazio": (h) => /<title>[^<]+<\/title>/.test(h),
    "skip-link → #main": (h) => h.includes('<a href="#main" class="skip-link">Pular para o conteúdo principal</a>'),
    "um <header class=site-header>": (h) => (h.match(/<header class="site-header">/g) || []).length === 1,
    [`nav aria-label="${PRODUCT.name}"`]: (h) => (h.match(new RegExp(`<nav aria-label="${PRODUCT.name}">`, "g")) || []).length === 1,
    "rodapé DevAtlas": (h) => h.includes(`<footer class="site-footer">\n      <p>${PRODUCT.footerText}</p>`),
    "um <main>": (h) => (h.match(/<main[\s>]/g) || []).length === 1,
    'main#main tabindex="-1"': (h) => h.includes('<main id="main" tabindex="-1">'),
    "um <footer class=site-footer>": (h) => (h.match(/<footer class="site-footer">/g) || []).length === 1,
    "_shell.css referenciado": (h) => h.includes("css/roadmap/_shell.css"),
    "sem copy de nível/sênior": (h) => !/senior software engineer|nível sênior|roadmap.{0,12}sênior/i.test(h),
  };
  for (const [name, fn] of Object.entries(checks)) {
    const bad = modulePages.filter((p) => !fn(p.html)).map((p) => p.module.slug);
    record(g, `${name} (89/89)`, bad.length === 0, bad.length ? "falhou em: " + bad.slice(0, 10).join(", ") : "");
  }
}

// ---- 13. validação das 89 páginas de Module --------------------
{
  const g = "Modules (R3.5.5)";
  const rowRe =
    /<a class="track__row track__row--concept" href="([^"]+)">\s*<span class="track__num">([^<]+)<\/span>\s*<span class="track__title">([\s\S]*?)<span class="track__chips">/g;
  const fails = [];
  const flags = {
    pathOk: true, titleOk: true, h1Ok: true, kickerOk: true, summaryOk: true, metaOk: true,
    crumbHomeOk: true, crumbAreaOk: true, crumbCurrentOk: true, rowCountOk: true, rowFieldsOk: true,
    conceptHrefOk: true, requiresOk: true, noHashOk: true, noRoadmapOk: true, noAbsOk: true,
    noScriptOk: true, noAriaLiveOk: true, noHandlerOk: true,
  };
  const F = (cond, label, slug) => {
    if (!cond) fails.push(`${slug}: ${label}`);
    return cond;
  };

  modulePages.forEach(({ area, module, file, html, requiresVM }) => {
    const mi = model.modules(area).indexOf(module);
    const modPath = pathFor(module);
    const realConcepts = model.concepts(module);
    const s = module.slug;

    flags.pathOk = F(file === `areas/${area.slug}/modules/${module.slug}/index.html`, "path físico", s) && flags.pathOk;
    flags.titleOk = F(html.includes(`<title>${escapeHtml(module.title)} · ${PRODUCT.name}</title>`), "title = Module · DevAtlas", s) && flags.titleOk;
    flags.h1Ok = F((html.match(/<h1[\s>]/g) || []).length === 1, "1 h1", s) && flags.h1Ok;
    flags.h1Ok = F(html.includes(`<h1 class="page-head__title">${escapeHtml(module.title)}</h1>`), "h1 = título do Module", s) && flags.h1Ok;
    flags.kickerOk = F(html.includes(`<p class="page-head__kicker">${("Módulo " + num(mi)).toUpperCase()}</p>`), "kicker MÓDULO NN", s) && flags.kickerOk;
    flags.summaryOk = F(html.includes(`<p class="page-head__desc">${escapeHtml(module.summary)}</p>`), "summary preservado", s) && flags.summaryOk;
    flags.metaOk = F(html.includes(`<p class="page-head__meta">${realConcepts.length} conceitos</p>`), "meta «N conceitos»", s) && flags.metaOk;

    flags.crumbHomeOk =
      F(html.includes(`<a class="crumbs__link" href="../../../../">${PRODUCT.name}</a>`), "breadcrumb Home → ../../../../", s) && flags.crumbHomeOk;
    flags.crumbAreaOk =
      F(
        html.includes(`<a class="crumbs__link" href="../../">${escapeHtml(area.title)}</a>`),
        "breadcrumb Area → ../../ com título correto",
        s
      ) && flags.crumbAreaOk;
    flags.crumbCurrentOk =
      F(
        html.includes(`<span class="crumbs__here" aria-current="page">${escapeHtml(module.title)}</span>`),
        "breadcrumb Module atual = aria-current, sem self-link",
        s
      ) && flags.crumbCurrentOk;

    const rows = [...html.matchAll(rowRe)];
    flags.rowCountOk = F(rows.length === realConcepts.length, `nº de Concept rows (${rows.length}) == nº real (${realConcepts.length})`, s) && flags.rowCountOk;
    realConcepts.forEach((c, ci) => {
      const row = rows[ci];
      if (!row) {
        flags.rowFieldsOk = false;
        return;
      }
      if (row[2] !== num(ci)) flags.rowFieldsOk = false;
      if (row[3] !== escapeHtml(c.title)) flags.rowFieldsOk = false;
      const wantHref = relativize(modPath, pathFor(c));
      if (row[1] !== wantHref || row[1] !== "concepts/" + c.slug + "/") flags.conceptHrefOk = false;
    });

    // Requires: nº de pills == nº de refs; cada resolved vira <a class="relation-pill">
    const pills = [...html.matchAll(/<(a|span) class="relation-pill(?:[^"]*)"[^>]*>\s*<span class="relation-pill__label">([\s\S]*?)<\/span>/g)];
    const wantPills = (module.requires || []).length;
    flags.requiresOk = F(pills.length === wantPills, `Requires: ${pills.length} pills == ${wantPills} refs`, s) && flags.requiresOk;
    requiresVM.forEach((r, idx) => {
      const pill = pills[idx];
      if (!pill) {
        flags.requiresOk = false;
        return;
      }
      if (pill[2] !== escapeHtml(r.raw)) flags.requiresOk = false;
      if (r.href && pill[1] !== "a") flags.requiresOk = false; // resolved → <a>
      if (!r.href && pill[1] !== "span") flags.requiresOk = false; // flagged → <span>
    });

    const navHrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
    flags.noHashOk = F(!navHrefs.some((h) => h.includes("#/")), "sem hash-route em <a href>", s) && flags.noHashOk;
    flags.noRoadmapOk = F(!navHrefs.some((h) => h.includes("/roadmap/")), "sem rota /roadmap/ em <a href>", s) && flags.noRoadmapOk;
    flags.noAbsOk =
      F(
        !navHrefs.some((h) => h.startsWith("/") || h.startsWith("http")) && !html.includes("/ai-learning-deck/"),
        "sem href de navegação absoluto / base fixa",
        s
      ) && flags.noAbsOk;
    flags.noScriptOk = F(!html.toLowerCase().includes("<script"), "sem <script>", s) && flags.noScriptOk;
    flags.noAriaLiveOk = F(!html.includes("aria-live"), "sem aria-live", s) && flags.noAriaLiveOk;
    flags.noHandlerOk = F(!/<[a-z][^>]*\son[a-z]+=/i.test(html), "sem handler inline (on*=)", s) && flags.noHandlerOk;
  });

  record(g, "exatamente 89 páginas de Module geradas", modulePages.length === 89);
  record(
    g,
    "Area → Module: os 89 destinos existem em build/preview/",
    modulePages.length === 89 &&
      model.areas().every((a) => model.modules(a).every((m) => modulePages.some((p) => p.file === filePathFor(m))))
  );
  record(g, "path físico areas/<a>/modules/<m>/index.html (89/89)", flags.pathOk);
  record(g, "title = «Module · DevAtlas» (89/89)", flags.titleOk);
  record(g, "exatamente um <h1> = título do Module (89/89)", flags.h1Ok);
  record(g, "kicker MÓDULO NN por Area, na ordem (89/89)", flags.kickerOk);
  record(g, "summary do Module preservado (89/89)", flags.summaryOk);
  record(g, "meta «N conceitos» (89/89)", flags.metaOk);
  record(g, "breadcrumb DevAtlas → ../../../../ (89/89)", flags.crumbHomeOk);
  record(g, "breadcrumb Area → ../../ (89/89)", flags.crumbAreaOk);
  record(g, "breadcrumb Module atual = aria-current, sem self-link (89/89)", flags.crumbCurrentOk);
  record(g, "nº de Concept rows == nº real de Concepts (89/89)", flags.rowCountOk);
  record(g, "Concept: num + título + ordem (89/89)", flags.rowFieldsOk);
  record(g, "href de cada Concept = concepts/<slug>/ relativo (89/89)", flags.conceptHrefOk);
  record(g, "Requires: nº de pills == nº de refs, raw preservado, resolved→<a> (89/89)", flags.requiresOk);
  record(g, "zero hash-route (#/) em <a href> (89/89)", flags.noHashOk);
  record(g, "zero rota /roadmap/ em <a href> — css/roadmap/ não conta (89/89)", flags.noRoadmapOk);
  record(g, "zero href de navegação absoluto / /ai-learning-deck/ (89/89)", flags.noAbsOk);
  record(g, "zero <script> (89/89)", flags.noScriptOk);
  record(g, "zero aria-live (89/89)", flags.noAriaLiveOk);
  record(g, "zero handler inline (89/89)", flags.noHandlerOk);
  if (fails.length) record(g, "falhas detalhadas", false, fails.slice(0, 25).join(" | "));
}

// ---- 14. classificações/chips: HTML gerado == dataset -------------
{
  const g = "Classificações (Module ↔ dataset)";
  let dsCanon = 0;
  let dsRev = 0;
  let dsEss = 0;
  let dsConc = 0;
  let dsPrac = 0;
  for (const a of model.areas())
    for (const m of model.modules(a))
      for (const c of model.concepts(m)) {
        if (c.canonical) dsCanon++;
        else dsRev++;
        if (c.essential) dsEss++;
        const lf = c.learningFocus || [];
        if (lf.indexOf("conceptual") !== -1) dsConc++;
        if (lf.indexOf("practical") !== -1) dsPrac++;
      }

  const allHtml = modulePages.map((p) => p.html).join("\n");
  const count = (re) => (allHtml.match(re) || []).length;
  record(g, `CONCEITO-BASE nas 89 páginas == dataset (${dsCanon})`, count(/<span class="chip chip--c"/g) === dsCanon);
  record(g, `REVISITA nas 89 páginas == dataset (${dsRev})`, count(/<span class="chip chip--r"/g) === dsRev);
  record(g, `CONCEITO-BASE + REVISITA == 668 concepts`, count(/<span class="chip chip--c"/g) + count(/<span class="chip chip--r"/g) === 668);
  record(g, `ESSENCIAL nas 89 páginas == dataset (${dsEss})`, count(/<span class="chip chip--essential"/g) === dsEss);
  record(g, "CONCEITUAL na lista de Module = 0 (modo compact — aparece só na Concept page)", count(/chip--conceptual/g) === 0);
  record(g, "PRÁTICO na lista de Module = 0 (modo compact — aparece só na Concept page)", count(/chip--practical/g) === 0);
  record(g, `dataset learningFocus: conceptual=${dsConc} · practical=${dsPrac} (não afeta Module; R3.5.6)`, true);
  record(g, "nenhum chip vem do dataset (texto derivado das dimensões R1)", true);
  record(g, "note / collision / isNew NÃO aparecem como chip", !allHtml.includes('data-note') && !/chip--new|chip--x/.test(allHtml));
}

// ---- relatório ---------------------------------------------------------
const GROUPS = [...new Set(results.map((r) => r.group))];
const failed = results.filter((r) => !r.ok).length;
console.log("build-roadmap — R3.5.5  (auditoria + preview: Home + 7 Areas + 89 Modules + 404)\n");
for (const group of GROUPS) {
  console.log(group);
  for (const r of results.filter((x) => x.group === group)) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? " — " + r.detail : ""}`);
  }
  console.log("");
}

console.log("Auditoria de relações R2 — campos: Module.requires · Concept.requires · Concept.revisit · Concept.revisitOf");
console.log("  (Module.relocated / Module.suggestions = metadados editoriais, fora da auditoria — idêntico a views.js)");
console.log(`  total ${audit.total} · resolved ${audit.resolved} · ambiguous ${audit.ambiguous} · unresolved ${audit.unresolved}`);
for (const o of audit.offenders.slice(0, 20)) console.log(`  ✗ ${o.kind}: ${JSON.stringify(o.ref)} → ${o.status}`);
console.log("");

console.log("Contagens conceituais (Concept ainda não gerado — R3.5.6+)");
console.log(`  ${nodeCount} roadmap node paths`);
console.log(`  ${contentRoutes} content routes futuras: 1 Home + ${areaCount} Areas + ${moduleCount} Modules + ${conceptCount} Concepts`);
console.log(`  ${htmlPages} HTML pages futuras: ${contentRoutes} content pages + 1 página 404`);
console.log("  Artefatos auxiliares (ex.: _routes.txt) NÃO entram nessa contagem.");
console.log("");

// ---- escrita do preview — só se TODAS as invariantes passaram ---------
console.log("Preview estático (R3.5.5 — Home + 7 Areas + 89 Modules + 404; Concept → R3.5.6+; sem JS)");
if (failed === 0) {
  mkdirSync(join(PREVIEW_DIR, "css", "roadmap"), { recursive: true });
  for (const f of CSS_FILES) copyFileSync(join(ROOT, "css", f), join(PREVIEW_DIR, "css", f));
  console.log(`  copiado: build/preview/css/ (${CSS_FILES.length} arquivos CSS)`);
  writeFileSync(join(PREVIEW_DIR, "index.html"), indexHtml);
  writeFileSync(join(PREVIEW_DIR, "404.html"), notFoundHtml);
  for (const { file, html } of [...areaPages, ...modulePages]) {
    const abs = join(PREVIEW_DIR, file);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, html);
  }
  const htmlCount = 2 + areaPages.length + modulePages.length;
  console.log(`  escrito: index.html + 404.html + ${areaPages.length} Areas + ${modulePages.length} Modules`);
  console.log(`  total: ${htmlCount} HTMLs de conteúdo (1 Home + ${areaPages.length} Areas + ${modulePages.length} Modules + 1 404)`);
  console.log("  servir:  cd build/preview && python3 -m http.server");
} else {
  console.log("  NÃO escrito — invariante falhou; corrija antes de gerar o preview.");
}
console.log("");

console.log(failed === 0 ? "OK — todas as invariantes passaram" : `FALHOU — ${failed} verificação(ões)`);
process.exit(failed === 0 ? 0 : 1);
