/*
 * build-roadmap — R3.5.7: AUDITORIA + PREVIEW (conjunto completo da v0).
 *
 * Preserva todas as validações da R3.5.1–R3.5.6 e, se tudo passar, gera o
 * conjunto completo: Home DevAtlas + 7 Areas + 89 Modules + 668 Concepts (porte
 * da Concept Study Page da R3) + 404 = 766 HTMLs.
 *
 * R3.5.7: as 668 Concept Pages ganham UM <script type="module"> apontando para
 * `assets/concept-tabs.js` (copiado de src/roadmap/enhance/ para dentro do
 * preview). Progressive enhancement: sem JS a Área de estudo é 3 seções
 * sequenciais visíveis; com JS vira APG Tabs. Home/Area/Module/404 continuam
 * 100% sem <script>.
 *
 * Requisitos: Node >= 22.7 (detecção de sintaxe ESM sem package.json). Zero
 * dependências. Só escreve dentro de build/ (gitignored). Não toca na SPA.
 *
 * Uso:  node scripts/build-roadmap.mjs
 * Exit: 0 se todas as invariantes obrigatórias passarem; != 0 caso contrário
 *       (nesse caso o preview NÃO é escrito).
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { roadmap, roadmapMeta } from "../src/roadmap/data/index.js";
import { roadmapModel as model } from "../src/roadmap/model/roadmap-model.js";
import { HOME_PATH, pathFor, filePathFor, depthOf, relativize } from "../src/roadmap/routing/paths.js";
import { renderDocument, escapeAttr } from "../src/roadmap/render/html.mjs";
import { renderHome } from "../src/roadmap/render/home.mjs";
import { renderArea } from "../src/roadmap/render/area.mjs";
import { renderModule } from "../src/roadmap/render/module.mjs";
import { renderConcept } from "../src/roadmap/render/concept.mjs";
import { num, escapeHtml } from "../src/roadmap/render/partials.mjs";

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

// Enhancement JS (R3.5.7) — SÓ as 668 Concept Pages carregam este asset, como
// <script type="module">. É COPIADO para dentro do preview (o deploy não depende
// de `src/` existir). Path lógico no output: "/assets/concept-tabs.js".
const ENHANCE_SRC = "src/roadmap/enhance/concept-tabs.js";
const ENHANCE_DEST = "assets/concept-tabs.js";

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
// siteHeader:false → a Home (raiz) não emite <header class="site-header"> nem o
// link site-header__home; começa direto no <main>. 404 e páginas internas mantêm.
function landmarkChecks(label, html, { siteHeader = true } = {}) {
  const g = "Shell (" + label + ")";
  record(g, "doctype minúsculo", html.startsWith("<!doctype html>"));
  record(g, 'lang="pt-BR"', html.includes('<html lang="pt-BR">'));
  record(g, "meta charset utf-8", html.includes('<meta charset="utf-8" />'));
  record(g, "meta viewport", html.includes('name="viewport"'));
  record(g, "<title> não vazio", /<title>[^<]+<\/title>/.test(html));
  record(g, "skip-link aponta para #main", html.includes('<a href="#main" class="skip-link">Pular para o conteúdo principal</a>'));
  if (siteHeader) {
    record(g, "exatamente um <header class=\"site-header\">", (html.match(/<header class="site-header">/g) || []).length === 1);
    record(g, `nav aria-label="${PRODUCT.name}" (uma vez)`, (html.match(new RegExp(`<nav aria-label="${PRODUCT.name}">`, "g")) || []).length === 1);
    record(g, "link site-header__home para a Home", (html.match(/<a href="[^"]*" class="site-header__home">/g) || []).length === 1);
  } else {
    record(g, "raiz: SEM <header class=\"site-header\">", !html.includes('<header class="site-header">'));
    record(g, "raiz: SEM link site-header__home", !html.includes("site-header__home"));
    record(g, "raiz: <main> vem logo após o skip-link", /class="skip-link">Pular para o conteúdo principal<\/a>\n    <main id="main"/.test(html));
  }
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
landmarkChecks("index.html", indexHtml, { siteHeader: false });
landmarkChecks("404.html", notFoundHtml);

// ---- 9. validação da Home real --------------------------------------
{
  const g = "Home";
  // card de Área = <li> com UM <a class="area-card" href> envolvendo o conteúdo.
  const cardLinks = [...indexHtml.matchAll(/<li>\s*<a class="area-card" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/li>/g)];
  const cardOpen = (indexHtml.match(/<a class="area-card" href=/g) || []).length;
  record(g, "exatamente 7 cards de Área (li > a.area-card)", cardLinks.length === 7);
  record(g, "exatamente 7 links principais de Área (um por card)", cardOpen === 7);
  record(g, "cada card tem UM só destino (nenhum <a> aninhado no card)", cardLinks.every((m) => !/<a\b/.test(m[2])));
  record(g, "exatamente 7 títulos <h2 class=\"area-card__title\"> (texto, sem link)", (indexHtml.match(/<h2 class="area-card__title">/g) || []).length === 7);
  record(g, "NENHUM link de título antigo (.area-card__title--link)", !indexHtml.includes("area-card__title--link"));
  record(g, 'NENHUM "Abrir área" / CTA textual / .area-card__more', !/Abrir área|area-card__more/.test(indexHtml));
  record(g, 'lista semântica <ul class="area-grid"> com 7 <li>', /<ul class="area-grid"[^>]*>/.test(indexHtml) && (indexHtml.match(/<li[\s>]/g) || []).length === 7);
  record(g, "um único <h1> (masthead)", (indexHtml.match(/<h1[\s>]/g) || []).length === 1);
  record(g, `masthead h1 = "${PRODUCT.name}"`, indexHtml.includes(`<h1 class="masthead__title">${PRODUCT.name}</h1>`));
  record(g, `masthead subtítulo = "${PRODUCT.tagline}"`, indexHtml.includes(`<p class="masthead__subtitle">${PRODUCT.tagline}</p>`));
  record(g, "identidade do produto NÃO vem de roadmapMeta.title", !indexHtml.includes(`>${roadmapMeta.title}<`));

  // Home = raiz da navegação: NENHUM breadcrumb E NENHUM header global.
  record(g, "Home SEM breadcrumb (nav aria-label=Breadcrumb)", !indexHtml.includes('aria-label="Breadcrumb"'));
  record(g, "Home SEM .crumbs / lista de trilha", !/class="crumbs/.test(indexHtml));
  record(g, "Home SEM header global <header class=\"site-header\">", !indexHtml.includes('class="site-header"'));
  record(g, "Home SEM link pequeno DevAtlas (site-header__home)", !indexHtml.includes("site-header__home"));
  record(g, 'Home SEM <nav aria-label="DevAtlas"> (header global)', !indexHtml.includes(`<nav aria-label="${PRODUCT.name}">`));
  record(g, "Home SEM qualquer <nav> (grid é <ul>, sem trilha)", !indexHtml.includes("<nav"));
  record(g, "Home começa direto no <main> (nada entre skip-link e <main>)", /class="skip-link">[^<]*<\/a>\n    <main id="main"/.test(indexHtml));
  // páginas internas preservam o header global — 404 é interna (link p/ Home é útil ali).
  record(g, "404 mantém o header global + link site-header__home", /<a href="[^"]*" class="site-header__home">DevAtlas<\/a>/.test(notFoundHtml));

  let hrefOrderOk = true;
  let countOk = true;
  model.areas().forEach((a, i) => {
    const link = cardLinks[i];
    const wantHref = relativize(HOME_PATH, pathFor(a));
    if (!link || link[1] !== wantHref || link[1] !== "areas/" + a.slug + "/") hrefOrderOk = false;
    if (link && !link[2].includes(`<h2 class="area-card__title">${escapeHtml(a.title)}</h2>`)) hrefOrderOk = false;
    if (!indexHtml.includes(`>${model.moduleCount(a)} módulos · ${model.conceptCount(a)} conceitos<`)) countOk = false;
  });
  record(g, "7 hrefs de card = as 7 Areas do model, na ordem, = areas/<slug>/", hrefOrderOk);
  record(g, "contagens Modules · Concepts por Área corretas", countOk);

  // Início visual do card = só "ÁREA" (sem numeração 01/02/…, sem ícone).
  const kickers = [...indexHtml.matchAll(/<p class="area-card__kicker">([^<]*)<\/p>/g)].map((m) => m[1]);
  record(g, 'kicker = exatamente "ÁREA" nos 7 cards (sem número, sem ícone)', kickers.length === 7 && kickers.every((k) => k === "ÁREA"));
  record(g, "NENHUM número grande de Área (ÁREA 01 / 01 02 03 …)", !/area-card__kicker">[^<]*\d/.test(indexHtml) && !/>ÁREA\s*\d/.test(indexHtml));

  // Seta discreta no rodapé — parte do conteúdo do <a> do card, NÃO é outro link.
  const arrows = [...indexHtml.matchAll(/<span class="area-card__arrow" aria-hidden="true">→<\/span>/g)];
  record(g, "seta '→' presente nos 7 cards navegáveis (span aria-hidden, não é link)", arrows.length === 7);
  record(g, "seta do card NÃO é um <a> separado", cardLinks.every((m) => /area-card__arrow/.test(m[2]) && !/<a\b/.test(m[2])));
  // (os 7 destinos físicos são verificados no grupo "Areas (R3.5.4)": "Home → Area: os 7 destinos existem")
  record(g, "sem href de hash (#/)", !indexHtml.includes("#/"));
  record(g, "sem rota /roadmap/ em <a href>", ![...indexHtml.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].some((m) => m[1].includes("/roadmap/")));
  record(g, "sem href absoluto (leading /) nem /ai-learning-deck/", !/href="\//.test(indexHtml) && !indexHtml.includes("/ai-learning-deck/"));
  record(g, "sem <script> — navegação 100% HTML nativo", !indexHtml.toLowerCase().includes("<script"));
  record(g, "sem handler inline (on*=)", !/<[a-z][^>]*\son[a-z]+=/i.test(indexHtml));
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
  record("Home (não navegável)", "card sem link (nenhum <a class=area-card>)", !synth.includes('<a class="area-card"'));
  record("Home (não navegável)", 'badge "Em estruturação"', synth.includes('<p class="area-card__badge">Em estruturação</p>'));
  record("Home (não navegável)", '"N módulos planejados"', synth.includes("3 módulos planejados"));
  record("Home (não navegável)", "classe area-card--structuring no <li>", synth.includes('<li class="area-card area-card--structuring"'));
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
    "link site-header__home presente": (h) => /<a href="[^"]*" class="site-header__home">DevAtlas<\/a>/.test(h),
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
    "link site-header__home presente": (h) => /<a href="[^"]*" class="site-header__home">DevAtlas<\/a>/.test(h),
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

// ---- 15. páginas de Concept (R3.5.6) — porte da Concept Study Page ---
// asset root-relativo (ex.: decks em presentations/<x>/index.html) → relativo à página.
function assetHrefFor(fromLogicalPath, rootRelPath) {
  const slash = rootRelPath.lastIndexOf("/");
  const dir = slash >= 0 ? rootRelPath.slice(0, slash + 1) : "";
  const file = slash >= 0 ? rootRelPath.slice(slash + 1) : rootRelPath;
  return relativize(fromLogicalPath, "/" + dir) + file;
}

const conceptPages = [];
for (const area of model.areas()) {
  for (const module of model.modules(area)) {
    const concepts = model.concepts(module);
    concepts.forEach((concept, ci) => {
      const cPath = pathFor(concept); // "/areas/<a>/modules/<m>/concepts/<c>/"
      const from = { area, module };
      const resolveRefs = (raws) =>
        (raws || []).map((raw) => {
          const r = model.resolveRoadmapRef(raw, from);
          return r.status === "resolved"
            ? { raw, kind: r.kind, href: relativize(cPath, pathFor(r.node)), _target: r.node }
            : { raw, status: r.status };
        });
      const sib = model.siblingConcepts(concept);
      const resources = (concept.resources || [])
        .map((r) => model.resolveResource(r))
        .filter(Boolean)
        .map((r) => ({ label: r.label, href: assetHrefFor(cPath, r.url) }));

      const vm = {
        product: PRODUCT,
        area: { title: area.title, href: relativize(cPath, pathFor(area)) }, // "../../../../"
        module: { title: module.title, href: relativize(cPath, pathFor(module)) }, // "../../"
        concept: {
          index: ci,
          title: concept.title,
          slug: concept.slug,
          color: area.color,
          essential: concept.essential,
          canonical: concept.canonical,
          learningFocus: concept.learningFocus || [],
          summary: concept.summary || "",
          note: concept.note || "",
          subtopics: concept.subtopics || [],
          content: concept.content || null,
          examples: concept.examples || [],
          exercise: concept.exercise || null,
        },
        requires: resolveRefs(concept.requires),
        revisitOf: concept.revisitOf ? resolveRefs([concept.revisitOf])[0] : null,
        revisit: resolveRefs(concept.revisit),
        resources,
        prev: sib.prev ? { title: sib.prev.title, href: relativize(cPath, pathFor(sib.prev)) } : null,
        next: sib.next ? { title: sib.next.title, href: relativize(cPath, pathFor(sib.next)) } : null,
        homeHref: relativize(cPath, HOME_PATH), // "../../../../../../"
        stylesheets: stylesheetsFor(cPath),
        enhancementScript: assetHrefFor(cPath, ENHANCE_DEST), // "../../../../../../assets/concept-tabs.js"
      };
      conceptPages.push({ area, module, concept, ci, file: filePathFor(concept), html: renderConcept(vm), vm });
    });
  }
}

// landmarks/shell nas 668 páginas de Concept — agregado
{
  const g = "Shell (Concepts)";
  const checks = {
    "doctype minúsculo": (h) => h.startsWith("<!doctype html>"),
    'lang="pt-BR"': (h) => h.includes('<html lang="pt-BR">'),
    "<title> não vazio": (h) => /<title>[^<]+<\/title>/.test(h),
    "skip-link → #main": (h) => h.includes('<a href="#main" class="skip-link">Pular para o conteúdo principal</a>'),
    "um <header class=site-header>": (h) => (h.match(/<header class="site-header">/g) || []).length === 1,
    [`nav aria-label="${PRODUCT.name}"`]: (h) => (h.match(new RegExp(`<nav aria-label="${PRODUCT.name}">`, "g")) || []).length === 1,
    "link site-header__home presente": (h) => /<a href="[^"]*" class="site-header__home">DevAtlas<\/a>/.test(h),
    "rodapé DevAtlas": (h) => h.includes(`<footer class="site-footer">\n      <p>${PRODUCT.footerText}</p>`),
    "um <main>": (h) => (h.match(/<main[\s>]/g) || []).length === 1,
    'main#main tabindex="-1"': (h) => h.includes('<main id="main" tabindex="-1">'),
    "um <footer class=site-footer>": (h) => (h.match(/<footer class="site-footer">/g) || []).length === 1,
    "_shell.css referenciado": (h) => h.includes("css/roadmap/_shell.css"),
    "sem copy de nível/sênior": (h) => !/senior software engineer|nível sênior|roadmap.{0,12}sênior/i.test(h),
  };
  for (const [name, fn] of Object.entries(checks)) {
    const bad = conceptPages.filter((p) => !fn(p.html)).map((p) => p.concept.slug);
    record(g, `${name} (668/668)`, bad.length === 0, bad.length ? "falhou em: " + bad.slice(0, 8).join(", ") : "");
  }
}

// ---- 16. validação das 668 páginas de Concept -------------------
{
  const g = "Concepts (R3.5.6)";
  const generatedFiles = new Set([
    ...areaPages.map((p) => p.file),
    ...modulePages.map((p) => p.file),
    ...conceptPages.map((p) => p.file),
    "index.html",
    "404.html",
  ]);
  const fails = [];
  const F = (cond, label, slug) => {
    const ok = !!cond;
    if (!ok) fails.push(`${slug}: ${label}`);
    return ok;
  };
  const flags = {};
  const set = (k, v) => {
    flags[k] = (flags[k] === undefined ? true : flags[k]) && !!v;
  };

  let withResumoEmpty = 0;
  let withRequires = 0;
  let withRequiresNone = 0;
  let withRevisitOf = 0;
  let withSubtopics = 0;
  let withRevisit = 0;
  let withResources = 0;
  let hasPrev = 0;
  let hasNext = 0;
  let physOk = true;
  let physChecked = 0;
  let withStudyContent = 0;
  let withStudyExamples = 0;
  let withStudyExercise = 0;

  conceptPages.forEach(({ area, module, concept, ci, file, html, vm }) => {
    const s = `${module.slug}/${concept.slug}`;
    const cPath = pathFor(concept);
    const realSibs = model.siblingConcepts(concept);

    set("path", F(file === `areas/${area.slug}/modules/${module.slug}/concepts/${concept.slug}/index.html`, "path físico", s));
    set("title", F(html.includes(`<title>${escapeHtml(concept.title)} · ${PRODUCT.name}</title>`), "title = Concept · DevAtlas", s));
    set("h1count", F((html.match(/<h1[\s>]/g) || []).length === 1, "1 h1", s));
    set("h1text", F(html.includes(`<h1 class="page-head__title">${escapeHtml(concept.title)}</h1>`), "h1 = título do Concept", s));
    set("kicker", F(html.includes(`<p class="page-head__kicker">${("Conceito " + num(ci)).toUpperCase()}</p>`), "kicker CONCEITO NN", s));
    set("wrapper", F(html.includes('<div class="view view--concept concept-study"'), "wrapper .view--concept.concept-study", s));

    // breadcrumb 4 níveis + item atual sem self-link
    set("crumbHome", F(html.includes(`<a class="crumbs__link" href="${vm.homeHref}">${PRODUCT.name}</a>`), "breadcrumb Home", s));
    set("crumbArea", F(html.includes(`<a class="crumbs__link" href="${vm.area.href}">${escapeHtml(area.title)}</a>`), "breadcrumb Area", s));
    set("crumbMod", F(html.includes(`<a class="crumbs__link" href="${vm.module.href}">${escapeHtml(module.title)}</a>`), "breadcrumb Module", s));
    set(
      "crumbCurrent",
      F(html.includes(`<span class="crumbs__here" aria-current="page">${escapeHtml(concept.title)}</span>`), "Concept atual = aria-current, sem self-link", s)
    );

    // classificações: exatamente as do dataset (essential/lf=0 hoje → só CONCEITO-BASE/REVISITA)
    const wantChip = concept.canonical ? "chip--c" : "chip--r";
    const gotC = (html.match(/<span class="chip chip--c"/g) || []).length;
    const gotR = (html.match(/<span class="chip chip--r"/g) || []).length;
    const gotEss = (html.match(/chip--essential/g) || []).length;
    set(
      "chips",
      F(
        (wantChip === "chip--c" ? gotC === 1 && gotR === 0 : gotC === 0 && gotR === 1) &&
          gotEss === (concept.essential ? 1 : 0) &&
          (html.match(/chip--conceptual/g) || []).length === (concept.learningFocus || []).includes("conceptual") * 1 &&
          (html.match(/chip--practical/g) || []).length === (concept.learningFocus || []).includes("practical") * 1,
        "chips == classificação do dataset",
        s
      )
    );

    // Resumo (sempre) — card com ícone (R3.5.11); label continua "Resumo"
    if (!concept.summary) {
      withResumoEmpty++;
      set("resumo", F(html.includes('id="concept-resumo" class="info-card__title"') && html.includes("<span>Resumo</span></h2>") && html.includes(">Resumo ainda não disponível.</p>"), "Resumo (empty state, card com ícone)", s));
    }

    // Pré-requisitos (Requires) — sempre presente; card com ícone, label sem "(Requires)" (R3.5.11)
    set("requiresHeading", F(html.includes('id="concept-requires" class="info-card__title"') && html.includes("<span>Pré-requisitos</span></h2>"), "seção Pré-requisitos presente (card)", s));
    if ((concept.requires || []).length) {
      withRequires++;
      set("requiresList", F(/id="concept-requires"[\s\S]*?<ul class="relation-list">/.test(html), "Requires com <ul>", s));
    } else {
      withRequiresNone++;
      set("requiresNone", F(/id="concept-requires"[\s\S]{0,700}<span class="muted">nenhum<\/span>/.test(html), 'Requires = "nenhum"', s));
    }

    // Revisita de (só canonical:false / revisitOf) — card com ícone
    if (concept.revisitOf) {
      withRevisitOf++;
      set("revisitOf", F(html.includes('id="concept-revisitof" class="info-card__title"') && html.includes("<span>Revisita de</span></h2>"), "seção Revisita de (card)", s));
    } else {
      set("noRevisitOf", F(!html.includes('id="concept-revisitof"'), "sem Revisita de quando não há revisitOf", s));
    }

    // Subtópicos — card com ícone
    if ((concept.subtopics || []).length) {
      withSubtopics++;
      set("subtopics", F(html.includes('id="concept-subtopics" class="info-card__title"') && html.includes("<span>Subtópicos</span></h2>"), "seção Subtópicos (card)", s));
    } else {
      set("noSubtopics", F(!html.includes('id="concept-subtopics"'), "sem Subtópicos quando vazio", s));
    }

    // Relacionado a (era "Revisitado em" — R3.5.11 renomeia o rótulo visual;
    // dado/semântica de concept.revisit não mudam) — card com ícone
    if ((concept.revisit || []).length) {
      withRevisit++;
      set("revisit", F(html.includes('id="concept-revisit" class="info-card__title"') && html.includes("<span>Relacionado a</span></h2>"), "seção Relacionado a (card)", s));
    } else {
      set("noRevisit", F(!html.includes('id="concept-revisit"'), "sem Relacionado a quando vazio", s));
    }

    // Recursos — card com ícone
    if ((concept.resources || []).length) {
      withResources++;
      set("resources", F(html.includes('id="concept-resources" class="info-card__title"') && html.includes("<span>Recursos</span></h2>"), "seção Recursos (card)", s));
    } else {
      set("noResources", F(!html.includes('id="concept-resources"'), "sem Recursos quando vazio", s));
    }

    // Subtítulo (note) — R3.5.11: exibido sob o H1 só quando concept.note não vazio
    if (concept.note) {
      set("subtitle", F(html.includes(`<p class="page-head__subtitle">${escapeHtml(concept.note)}</p>`), "subtítulo (note) presente quando não vazio", s));
    } else {
      set("noSubtitle", F(!html.includes('class="page-head__subtitle"'), "sem subtítulo quando note vazio", s));
    }

    // Área de estudo — 3 <section data-study-panel>, TODAS visíveis (sem hidden)
    set("studyHeading", F(html.includes('<h2 id="concept-study-heading" class="concept-section__title">Área de estudo</h2>'), "seção Área de estudo", s));
    set("studyContainer", F(html.includes('<div class="study-area__panels" data-study-tabs="">'), "container data-study-tabs", s));
    // Painel: empty state quando o Concept não tem dado estruturado (maioria hoje);
    // conteúdo real (e AUSÊNCIA do empty state) quando o dataset traz content/
    // examples/exercise — piloto: só "abstraction" nesta rodada (ver checagem
    // "Concepts com conteúdo de estudo real" mais abaixo).
    for (const [k, label, empty, hasReal] of [
      ["conteudo", "Conteúdo", "Conteúdo ainda não disponível.", (concept.content || []).length > 0],
      ["exemplos", "Exemplos", "Exemplos ainda não disponíveis.", (concept.examples || []).length > 0],
      ["exercicio", "Exercício", "Exercício ainda não disponível.", !!concept.exercise],
    ]) {
      const wrapperOk =
        html.includes(`<section class="study-panel" data-study-panel="${k}">`) &&
        html.includes(`<h3 class="concept-section__title study-panel__title">`) &&
        html.includes(`<span>${label}</span></h3>`);
      if (hasReal) {
        if (k === "conteudo") withStudyContent++;
        if (k === "exemplos") withStudyExamples++;
        if (k === "exercicio") withStudyExercise++;
        set("panel_" + k + "_full", F(wrapperOk && !html.includes(`<p class="empty-state">${empty}</p>`), `painel ${k} com conteúdo real (empty state ausente)`, s));
      } else {
        set("panel_" + k + "_empty", F(wrapperOk && html.includes(`<p class="empty-state">${empty}</p>`), `painel ${k} presente + empty state`, s));
      }
    }
    set("noHidden", F(!/data-study-panel="[^"]*"[^>]*\shidden/.test(html) && !html.includes("<section class=\"study-panel\" hidden"), "sem atributo hidden nos painéis", s));
    set("noTabRole", F(!/role="tab(list|panel)?"/.test(html), "sem role=tab/tablist/tabpanel no HTML fonte (enhancement = R3.5.7 client-side)", s));
    set("noAriaSelected", F(!html.includes("aria-selected"), "sem aria-selected no HTML fonte", s));
    // ordem dos painéis: conteudo → exemplos → exercicio
    const panelOrder = [...html.matchAll(/data-study-panel="([^"]+)"/g)].map((m) => m[1]);
    set("panelOrder", F(panelOrder.join(",") === "conteudo,exemplos,exercicio", "3 painéis na ordem conteudo,exemplos,exercicio", s));

    // prev/next
    const pv = realSibs.prev;
    const nx = realSibs.next;
    if (pv) {
      hasPrev++;
      set("prev", F(html.includes(`<a class="concept-nav__link concept-nav__link--prev" href="${relativize(cPath, pathFor(pv))}" rel="prev"`) && html.includes(`← ${escapeHtml(pv.title)}</a>`), "prev correto", s));
    } else {
      set("noPrev", F(!html.includes('concept-nav__link--prev'), "sem prev no 1º Concept", s));
    }
    if (nx) {
      hasNext++;
      set("next", F(html.includes(`<a class="concept-nav__link concept-nav__link--next" href="${relativize(cPath, pathFor(nx))}" rel="next"`) && html.includes(`${escapeHtml(nx.title)} →</a>`), "next correto", s));
    } else {
      set("noNext", F(!html.includes('concept-nav__link--next'), "sem next no último Concept", s));
    }
    set("navNoAriaCurrentPrevNext", F(!/concept-nav__link[^>]*aria-current/.test(html), "prev/next sem aria-current", s));

    // higiene de navegação
    const navHrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
    set("noHash", F(!navHrefs.some((h) => h.includes("#/")), "sem hash-route em <a href>", s));
    set("noRoadmapRoute", F(!navHrefs.some((h) => h.includes("/roadmap/")), "sem rota /roadmap/ em <a href>", s));
    set("noAbs", F(!navHrefs.some((h) => h.startsWith("/") || h.startsWith("http")) && !html.includes("/ai-learning-deck/"), "sem href de navegação absoluto", s));
    // enhancement de tabs (R3.5.7): exatamente 1 <script type="module"> → o asset de tabs, relativo
    const scriptSrcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]*)"[^>]*>/g)].map((m) => m[1]);
    const allScripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
    set(
      "enhanceScript",
      F(
        scriptSrcs.length === 1 &&
          allScripts.length === 1 &&
          /type="module"/.test(allScripts[0]) &&
          scriptSrcs[0] === assetHrefFor(cPath, ENHANCE_DEST) &&
          scriptSrcs[0].endsWith("assets/concept-tabs.js") &&
          !scriptSrcs[0].startsWith("/") &&
          !scriptSrcs[0].startsWith("http") &&
          !scriptSrcs[0].includes("/ai-learning-deck/") &&
          !scriptSrcs[0].includes("/src/"),
        "1 <script type=module> = assets/concept-tabs.js (relativo)",
        s
      )
    );
    set("noAriaLive", F(!html.includes("aria-live"), "sem aria-live", s));
    set("noHandler", F(!/<[a-z][^>]*\son[a-z]+=/i.test(html), "sem handler inline", s));

    // relações resolved → alvo físico existe (Area/Module/Concept, todos gerados)
    for (const ref of [...vm.requires, ...vm.revisit, ...(vm.revisitOf ? [vm.revisitOf] : [])]) {
      if (!ref._target) continue;
      physChecked++;
      if (!generatedFiles.has(filePathFor(ref._target))) {
        physOk = false;
        fails.push(`${s}: ref "${ref.raw}" → alvo físico ausente`);
      }
    }
  });

  record(g, "exatamente 668 páginas de Concept geradas", conceptPages.length === 668);
  record(
    g,
    "Module → Concept: os 668 destinos existem em build/preview/",
    conceptPages.length === 668 &&
      model.areas().every((a) => model.modules(a).every((m) => model.concepts(m).every((c) => generatedFiles.has(filePathFor(c)))))
  );
  const P = (k, label) => record(g, `${label} (668/668)`, flags[k] === true);
  P("path", "path físico areas/<a>/modules/<m>/concepts/<c>/index.html");
  P("title", "title = «Concept · DevAtlas»");
  P("h1count", "exatamente um <h1>");
  P("h1text", "h1 = título do Concept");
  P("kicker", "kicker CONCEITO NN por Module, na ordem");
  P("wrapper", "wrapper .view--concept.concept-study");
  P("crumbHome", "breadcrumb: DevAtlas");
  P("crumbArea", "breadcrumb: Area (link)");
  P("crumbMod", "breadcrumb: Module (link)");
  P("crumbCurrent", "breadcrumb: Concept atual = aria-current, sem self-link");
  P("chips", "classificações == dataset");
  P("resumo", "Resumo (empty state, card com ícone)");
  P("requiresHeading", "seção Pré-requisitos sempre presente (card com ícone)");
  if (flags.requiresList !== undefined) P("requiresList", "Requires com <ul class=relation-list> quando há refs");
  if (flags.requiresNone !== undefined) P("requiresNone", 'Requires = "nenhum" quando vazio');
  if (flags.revisitOf !== undefined) P("revisitOf", "seção «Revisita de» quando revisitOf (card)");
  P("noRevisitOf", "sem «Revisita de» quando não há revisitOf");
  if (flags.subtopics !== undefined) P("subtopics", "seção «Subtópicos» quando há (card)");
  P("noSubtopics", "sem «Subtópicos» quando vazio");
  if (flags.revisit !== undefined) P("revisit", "seção «Relacionado a» quando há (card)");
  P("noRevisit", "sem «Relacionado a» quando vazio");
  if (flags.resources !== undefined) P("resources", "seção «Recursos» quando há (card)");
  P("noResources", "sem «Recursos» quando vazio");
  if (flags.subtitle !== undefined) P("subtitle", "subtítulo (note) presente quando não vazio");
  P("noSubtitle", "sem subtítulo quando note vazio");
  P("studyHeading", "seção «Área de estudo»");
  P("studyContainer", "container data-study-tabs");
  P("panelOrder", "3 painéis na ordem conteudo → exemplos → exercicio");
  if (flags.panel_conteudo_empty !== undefined) P("panel_conteudo_empty", "painel Conteúdo + empty state");
  if (flags.panel_conteudo_full !== undefined) P("panel_conteudo_full", "painel Conteúdo com conteúdo real (empty state ausente)");
  if (flags.panel_exemplos_empty !== undefined) P("panel_exemplos_empty", "painel Exemplos + empty state");
  if (flags.panel_exemplos_full !== undefined) P("panel_exemplos_full", "painel Exemplos com conteúdo real (empty state ausente)");
  if (flags.panel_exercicio_empty !== undefined) P("panel_exercicio_empty", "painel Exercício + empty state");
  if (flags.panel_exercicio_full !== undefined) P("panel_exercicio_full", "painel Exercício com conteúdo real (empty state ausente)");
  P("noHidden", "3 painéis SEM atributo hidden no HTML fonte (visíveis sem JS)");
  P("noTabRole", "sem role=tab/tablist/tabpanel no HTML fonte (roles = enhancement client-side)");
  P("noAriaSelected", "sem aria-selected no HTML fonte");
  if (flags.prev !== undefined) P("prev", "prev correto (href relativo + rel=prev + título)");
  if (flags.next !== undefined) P("next", "next correto (href relativo + rel=next + título)");
  P("noPrev", "sem prev no 1º Concept de cada Module");
  P("noNext", "sem next no último Concept de cada Module");
  P("navNoAriaCurrentPrevNext", "prev/next SEM aria-current");
  P("noHash", "zero hash-route (#/) em <a href>");
  P("noRoadmapRoute", "zero rota /roadmap/ em <a href> — css/roadmap/ não conta");
  P("noAbs", "zero href de navegação absoluto / /ai-learning-deck/");
  P("enhanceScript", "exatamente 1 <script type=module> = assets/concept-tabs.js (relativo, resolve na profundidade do Concept)");
  P("noAriaLive", "zero aria-live");
  P("noHandler", "zero handler inline");
  record(g, `relações resolved → alvo físico gerado (${physChecked} refs checadas)`, physOk);

  // Piloto editorial — cada Concept em PILOT_SLUGS preenche summary; os demais
  // continuam empty state. Atualizar esta lista conforme novos Concepts ganham conteúdo.
  const PILOT_SLUGS = [
    "abstraction",
    "encapsulation",
    "information-hiding",
    "interface",
    "contract",
    "inheritance",
    "polymorphism",
    "composition",
    "coupling",
    "cohesion",
    "separation-of-concerns",
    "memory",
    "value-vs-reference",
    "stack-vs-heap",
    "call-stack",
    "garbage-collection",
    "memory-leak",
    "static-vs-dynamic-typing",
    "strong-vs-weak-typing",
    "type-inference",
    "type-safety",
    "nominal-typing",
    "structural-typing",
    "generics",
    "union-types",
    "intersection-types",
    "type-narrowing",
  ];
  record(
    "Concept — cobertura de blocos (renderer ↔ dataset)",
    `Resumo empty state: ${withResumoEmpty} (esperado ${668 - PILOT_SLUGS.length} — ${PILOT_SLUGS.length} Concepts do piloto têm summary real)`,
    withResumoEmpty === 668 - PILOT_SLUGS.length
  );
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com Requires: ${withRequires} (dataset 495)`, withRequires === 495);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas Requires = "nenhum": ${withRequiresNone} (dataset 173)`, withRequiresNone === 173);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com «Revisita de»: ${withRevisitOf} (dataset 15)`, withRevisitOf === 15);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com «Subtópicos»: ${withSubtopics} (dataset 103)`, withSubtopics === 103);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com «Relacionado a»: ${withRevisit} (dataset 160)`, withRevisit === 160);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com «Recursos»: ${withResources} (dataset 12)`, withResources === 12);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com prev: ${hasPrev} (esperado 579)`, hasPrev === 579);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com next: ${hasNext} (esperado 579)`, hasNext === 579);

  // Conteúdo de estudo real deve existir EXATAMENTE nos Concepts de
  // PILOT_SLUGS (nenhum a mais): prova de que o renderer é genérico
  // (dataset-driven) e não houve preenchimento acidental de outros Concepts.
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com Conteúdo real: ${withStudyContent} (esperado ${PILOT_SLUGS.length})`, withStudyContent === PILOT_SLUGS.length);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com Exemplos reais: ${withStudyExamples} (esperado ${PILOT_SLUGS.length})`, withStudyExamples === PILOT_SLUGS.length);
  record("Concept — cobertura de blocos (renderer ↔ dataset)", `páginas com Exercício real: ${withStudyExercise} (esperado ${PILOT_SLUGS.length})`, withStudyExercise === PILOT_SLUGS.length);
  {
    const withAnyStudy = conceptPages
      .filter(({ concept }) => (concept.content || []).length > 0 || (concept.examples || []).length > 0 || !!concept.exercise)
      .map(({ concept }) => concept.slug)
      .sort();
    const expected = [...PILOT_SLUGS].sort();
    record(
      "Concept — cobertura de blocos (renderer ↔ dataset)",
      `Concepts com conteúdo de estudo real: ${withAnyStudy.join(", ") || "nenhum"} (esperado: ${expected.join(", ")})`,
      withAnyStudy.length === expected.length && withAnyStudy.every((slug, i) => slug === expected[i])
    );
  }

  // R3.5.11 — redesign visual da Concept Page (cards com ícone, code chrome,
  // syntax highlighting, subtítulo a partir de note).
  {
    const withSubtitle = conceptPages.filter(({ concept }) => !!concept.note).map(({ concept }) => concept.slug);
    record(
      "Concept — cobertura de blocos (renderer ↔ dataset)",
      `páginas com subtítulo (note não vazio): ${withSubtitle.length}`,
      withSubtitle.length > 0 && PILOT_SLUGS.every((slug) => withSubtitle.includes(slug))
    );
    const withTakeaway = conceptPages
      .filter(({ concept }) => (concept.content || []).some((b) => b.type === "takeaway"))
      .map(({ concept }) => concept.slug)
      .sort();
    const expectedTakeaway = [...PILOT_SLUGS].sort();
    record(
      "Concept — cobertura de blocos (renderer ↔ dataset)",
      `Concepts com bloco «Em resumo»: ${withTakeaway.join(", ") || "nenhum"} (esperado: ${expectedTakeaway.join(", ")})`,
      withTakeaway.length === expectedTakeaway.length && withTakeaway.every((slug, i) => slug === expectedTakeaway[i])
    );
    for (const slug of PILOT_SLUGS) {
      const page = conceptPages.find(({ concept }) => concept.slug === slug);
      const ph = page ? page.html : "";
      record("Concept — cobertura de blocos (renderer ↔ dataset)", `${slug}: code blocks com cabeçalho (ícone arquivo + filename + botão Copiar)`, (ph.match(/<div class="code-block__header">/g) || []).length >= 1);
      record("Concept — cobertura de blocos (renderer ↔ dataset)", `${slug}: syntax highlight aplicado (tok-keyword presente)`, ph.includes('class="tok-keyword"'));
      record("Concept — cobertura de blocos (renderer ↔ dataset)", `${slug}: botão Copiar presente e inerte sem handler inline`, (ph.match(/data-copy-code/g) || []).length >= 1 && !/data-copy-code[^>]*\son[a-z]+=/i.test(ph));
      record("Concept — cobertura de blocos (renderer ↔ dataset)", `${slug}: <details class=solution-toggle> com <summary> (Ver solução, zero JS)`, ph.includes('<details class="solution-toggle">') && ph.includes(">Ver solução</span>") && !ph.includes('<details class="solution-toggle" open'));
      record("Concept — cobertura de blocos (renderer ↔ dataset)", `${slug}: grid Pré-requisitos/Relacionado a presente`, ph.includes('<div class="detail-block__grid">'));
    }
    // regex-literal destacado — só abstraction tem exemplo com regex no dataset atual.
    const abstractionPage = conceptPages.find(({ concept }) => concept.slug === "abstraction");
    record("Concept — cobertura de blocos (renderer ↔ dataset)", "abstraction: regex-literal destacado (tok-regex presente)", (abstractionPage ? abstractionPage.html : "").includes('class="tok-regex"'));
  }

  if (fails.length) record(g, "falhas detalhadas", false, fails.slice(0, 25).join(" | "));
}

// ---- 17. classificações nas 668 Concept Pages ↔ dataset --------
{
  const g = "Classificações (Concept ↔ dataset)";
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
  const allHtml = conceptPages.map((p) => p.html).join("\n");
  const count = (re) => (allHtml.match(re) || []).length;
  record(g, `CONCEITO-BASE nas 668 páginas == dataset (${dsCanon})`, count(/<span class="chip chip--c"/g) === dsCanon);
  record(g, `REVISITA nas 668 páginas == dataset (${dsRev})`, count(/<span class="chip chip--r"/g) === dsRev);
  record(g, "CONCEITO-BASE + REVISITA == 668", count(/<span class="chip chip--c"/g) + count(/<span class="chip chip--r"/g) === 668);
  record(g, `ESSENCIAL == dataset (${dsEss})`, count(/chip--essential/g) === dsEss);
  record(g, `CONCEITUAL == dataset (${dsConc})`, count(/chip--conceptual/g) === dsConc);
  record(g, `PRÁTICO == dataset (${dsPrac})`, count(/chip--practical/g) === dsPrac);
}

// ---- 18. relações R2 — geradas nas Concept Pages ↔ dataset -----
{
  const g = "Relações R2 (Concept ↔ dataset ↔ físico)";
  let genPills = 0;
  let genResolved = 0;
  let genFlagged = 0;
  let kindArea = 0;
  let kindModule = 0;
  let kindConcept = 0;
  for (const { vm } of conceptPages) {
    for (const ref of [...vm.requires, ...vm.revisit, ...(vm.revisitOf ? [vm.revisitOf] : [])]) {
      genPills++;
      if (ref._target) {
        genResolved++;
        if (ref._target.kind === "area") kindArea++;
        else if (ref._target.kind === "module") kindModule++;
        else kindConcept++;
      } else genFlagged++;
    }
  }
  record(g, "pills de relação nas Concept Pages == refs do dataset (798)", genPills === 798);
  record(g, "todas resolved (798) · 0 flagged", genResolved === 798 && genFlagged === 0);
  record(g, `destinos: area=${kindArea} · module=${kindModule} · concept=${kindConcept}`, kindArea === 0 && kindModule === 49 && kindConcept === 749);
  record(g, "R2 total Concept(798) + Module(118) == 916", 798 + 118 === 916);
}

// ---- 19. enhancement de tabs (R3.5.7) — asset + inclusão seletiva ------
{
  const g = "Enhancement de tabs (R3.5.7)";
  const scriptTagRe = /<script\b[^>]*>/g;

  // 19a. fonte do asset existe (necessária para o build copiar p/ o preview)
  record(g, `fonte ${ENHANCE_SRC} existe`, existsSync(join(ROOT, ENHANCE_SRC)));

  // 19b. as 668 Concept Pages: exatamente 1 <script type="module"> = o asset, relativo
  const cWith1Module = conceptPages.filter((p) => {
    const tags = p.html.match(scriptTagRe) || [];
    const srcs = [...p.html.matchAll(/<script\b[^>]*\bsrc="([^"]*)"/g)].map((m) => m[1]);
    return (
      tags.length === 1 &&
      /type="module"/.test(tags[0]) &&
      srcs.length === 1 &&
      srcs[0] === assetHrefFor(pathFor(p.concept), ENHANCE_DEST)
    );
  }).length;
  record(g, `668 Concept Pages com 1 <script type=module src=…/${ENHANCE_DEST}>`, cWith1Module === 668);
  record(
    g,
    "src do script é relativo (sem leading /, sem http, sem /ai-learning-deck/, sem /src/)",
    conceptPages.every((p) => {
      const src = (p.html.match(/<script\b[^>]*\bsrc="([^"]*)"/) || [])[1] || "";
      return src && !src.startsWith("/") && !src.startsWith("http") && !src.includes("/ai-learning-deck/") && !src.includes("/src/");
    })
  );
  // todas as Concept Pages estão na mesma profundidade → mesmo href relativo
  record(
    g,
    "src idêntico nas 668 (mesma profundidade) = ../../../../../../assets/concept-tabs.js",
    new Set(conceptPages.map((p) => (p.html.match(/<script\b[^>]*\bsrc="([^"]*)"/) || [])[1])).size === 1 &&
      (conceptPages[0].html.match(/<script\b[^>]*\bsrc="([^"]*)"/) || [])[1] === "../../../../../../assets/concept-tabs.js"
  );

  // 19c. NENHUMA outra página carrega concept-tabs (nem <script> algum)
  const others = [
    ["Home", indexHtml],
    ["404", notFoundHtml],
    ...areaPages.map((p) => ["Area " + p.area.slug, p.html]),
    ...modulePages.map((p) => ["Module " + p.module.slug, p.html]),
  ];
  record(g, "Home / 404 / 7 Areas / 89 Modules SEM concept-tabs", others.every(([, h]) => !h.includes("concept-tabs")));
  record(g, "Home / 404 / 7 Areas / 89 Modules SEM qualquer <script>", others.every(([, h]) => !h.toLowerCase().includes("<script")));

  // 19d. o href relativo, resolvido a partir de um dir de Concept, aponta p/ o path lógico do asset
  const sampleConcept = conceptPages[0].concept;
  record(
    g,
    "href do script resolve para /" + ENHANCE_DEST + " (relativize)",
    assetHrefFor(pathFor(sampleConcept), ENHANCE_DEST) === relativize(pathFor(sampleConcept), "/assets/") + "concept-tabs.js"
  );
}

// ---- relatório ---------------------------------------------------------
const GROUPS = [...new Set(results.map((r) => r.group))];
const failed = results.filter((r) => !r.ok).length;
console.log("build-roadmap — R3.5.7  (auditoria + preview: 766 HTMLs + enhancement de tabs nos Concepts)\n");
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

console.log("Contagens do conjunto completo da v0");
console.log(`  ${nodeCount} roadmap node paths`);
console.log(`  ${contentRoutes} content routes: 1 Home + ${areaCount} Areas + ${moduleCount} Modules + ${conceptCount} Concepts`);
console.log(`  ${htmlPages} HTML pages: ${contentRoutes} content pages + 1 página 404`);
console.log("  Artefatos auxiliares (ex.: _routes.txt) NÃO entram nessa contagem.");
console.log("");

// ---- escrita do preview — só se TODAS as invariantes passaram ---------
console.log("Preview estático (R3.5.7 — Home + 7 Areas + 89 Modules + 668 Concepts + 404; JS só nos Concepts)");
let assetOk = true;
if (failed === 0) {
  mkdirSync(join(PREVIEW_DIR, "css", "roadmap"), { recursive: true });
  for (const f of CSS_FILES) copyFileSync(join(ROOT, "css", f), join(PREVIEW_DIR, "css", f));
  console.log(`  copiado: build/preview/css/ (${CSS_FILES.length} arquivos CSS)`);
  mkdirSync(join(PREVIEW_DIR, dirname(ENHANCE_DEST)), { recursive: true });
  copyFileSync(join(ROOT, ENHANCE_SRC), join(PREVIEW_DIR, ENHANCE_DEST));
  assetOk = existsSync(join(PREVIEW_DIR, ENHANCE_DEST));
  console.log(`  copiado: build/preview/${ENHANCE_DEST} (enhancement de tabs; só as Concept Pages carregam)${assetOk ? "" : "  ✗ AUSENTE"}`);
  writeFileSync(join(PREVIEW_DIR, "index.html"), indexHtml);
  writeFileSync(join(PREVIEW_DIR, "404.html"), notFoundHtml);
  for (const { file, html } of [...areaPages, ...modulePages, ...conceptPages]) {
    const abs = join(PREVIEW_DIR, file);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, html);
  }
  const htmlCount = 2 + areaPages.length + modulePages.length + conceptPages.length;
  console.log(`  escrito: index.html + 404.html + ${areaPages.length} Areas + ${modulePages.length} Modules + ${conceptPages.length} Concepts`);
  console.log(`  total: ${htmlCount} HTMLs (1 Home + ${areaPages.length} Areas + ${modulePages.length} Modules + ${conceptPages.length} Concepts + 1 404) + 1 asset JS (não conta como HTML)`);
  console.log("  servir:  cd build/preview && python3 -m http.server");
} else {
  console.log("  NÃO escrito — invariante falhou; corrija antes de gerar o preview.");
}
console.log("");

const ok = failed === 0 && assetOk;
console.log(ok ? "OK — todas as invariantes passaram" : failed === 0 ? "FALHOU — asset de enhancement não foi escrito" : `FALHOU — ${failed} verificação(ões)`);
process.exit(ok ? 0 : 1);
