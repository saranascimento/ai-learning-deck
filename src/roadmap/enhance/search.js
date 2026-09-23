/*
 * search — busca client-side do DevAtlas (layout de documentação, etapa 3).
 *
 * Progressive enhancement: o HTML traz só um `[data-search-slot]` vazio (no topo do
 * menu lateral e na Home). Este módulo cria ali o campo e a lista de resultados; sem
 * JavaScript nada aparece e a navegação pelo menu continua completa.
 *
 * Índice: `search-index.json`, ao lado deste arquivo (gerado pelo build), carregado só
 * quando a pessoa foca o campo. Cada entrada: { k: area|module|concept, t: título,
 * a: Área, m: Módulo, s: resumo, x: nota + subtópicos, u: caminho a partir da raiz,
 * r: 1 se é revisita }.
 *
 * Busca: ignora acentos e maiúsculas; todas as palavras digitadas precisam aparecer
 * (no título, no contexto, na nota/subtópicos ou no resumo). Palavras com 4+ letras
 * toleram erro de digitação nas palavras do título (1 erro; 2 a partir de 8 letras) —
 * trocar, faltar, sobrar ou inverter uma letra; com 5+ letras vale também contra o começo
 * da palavra (para quem ainda está digitando).
 *
 * Teclado: "/" foca a busca; ↓/↑ percorrem os resultados; Enter abre o primeiro;
 * Esc limpa. Nas Concept Pages é importado por concept-tabs.js (um script só por página).
 */

const INDEX_URL = new URL("search-index.json", import.meta.url);
const SITE_ROOT = new URL("../", import.meta.url);
const KIND = { area: "Área", module: "Módulo", concept: "Conceito" };
const MAX_RESULTS = 12;

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
const words = (s) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

// Entrada do índice → campos já normalizados para a busca.
export function prepare(list) {
  return list.map((e) => {
    const t = norm(e.t);
    return { ...e, _t: t, _tw: words(t), _c: norm(e.a + " " + e.m), _x: norm(e.x), _s: norm(e.s) };
  });
}

let indexPromise = null;
function loadIndex() {
  if (!indexPromise) indexPromise = fetch(INDEX_URL).then((r) => r.json()).then(prepare);
  return indexPromise;
}

// Distância de edição com transposição (Damerau restrita), abandonando cedo acima do limite.
function editDistance(a, b, limit) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let prev2 = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur.push(v);
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > limit) return limit + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

// Erro de digitação numa palavra do título — contra a palavra inteira ou contra o começo dela
// (quem ainda está digitando "polymorfi" já deve achar "polymorphism"). Devolve a pontuação:
// menos erros valem mais, e a palavra inteira vale mais que só o começo dela; 0 = sem correspondência.
function fuzzyTitleScore(token, titleWords) {
  if (token.length < 4) return 0;
  const limit = token.length >= 8 ? 2 : 1;
  let best = 0;
  for (const w of titleWords) {
    const whole = editDistance(token, w, limit);
    if (whole <= limit) best = Math.max(best, 2.5 - 0.5 * whole);
    // começo da palavra só a partir de 5 letras: com 4, "join" acharia "poin(t)"
    if (token.length >= 5 && w.length > token.length) {
      const start = editDistance(token, w.slice(0, token.length), limit);
      if (start <= limit) best = Math.max(best, 2.25 - 0.5 * start);
    }
  }
  return best;
}

function scoreToken(e, tk) {
  if (e._tw.includes(tk)) return 6;
  if (e._tw.some((w) => w.startsWith(tk))) return 5;
  if (e._t.includes(tk)) return 3;
  const fuzzy = fuzzyTitleScore(tk, e._tw);
  if (fuzzy) return fuzzy;
  if (e._c.includes(tk)) return 1.5;
  if (e._x.includes(tk)) return 1.2;
  if (e._s.includes(tk)) return 1;
  return 0;
}

export function search(index, query) {
  const q = norm(query).trim();
  const tokens = words(q);
  if (!tokens.length) return [];
  const out = [];
  for (const e of index) {
    let score = 0;
    let all = true;
    for (const tk of tokens) {
      const s = scoreToken(e, tk);
      if (!s) {
        all = false;
        break;
      }
      score += s;
    }
    if (!all) continue;
    if (e._t === q) score += 10;
    if (e.k === "concept" && e.r) score -= 1; // a revisita aparece depois do Concept original
    out.push({ e, score });
  }
  out.sort((a, b) => b.score - a.score || a.e.t.localeCompare(b.e.t));
  return out.slice(0, MAX_RESULTS).map((x) => x.e);
}

let uid = 0;
function mount(slot) {
  const id = "dx-search-" + ++uid;
  const wrap = document.createElement("div");
  wrap.className = "search";
  wrap.setAttribute("role", "search");

  const label = document.createElement("label");
  label.className = "visually-hidden";
  label.htmlFor = id;
  label.textContent = "Buscar conceito, módulo ou área";

  const input = document.createElement("input");
  input.id = id;
  input.className = "search__input";
  input.type = "search";
  input.placeholder = "Buscar…";
  input.autocomplete = "off";
  input.spellcheck = false;

  const hint = document.createElement("span");
  hint.className = "search__key";
  hint.setAttribute("aria-hidden", "true");
  hint.textContent = "/";

  const status = document.createElement("p");
  status.className = "visually-hidden";
  status.setAttribute("role", "status");

  const list = document.createElement("ul");
  list.className = "search__results";
  list.hidden = true;

  const field = document.createElement("div");
  field.className = "search__field";
  field.append(input, hint);
  wrap.append(label, field, status, list);
  slot.append(wrap);

  async function run() {
    const q = input.value.trim();
    list.replaceChildren();
    if (!q) {
      list.hidden = true;
      status.textContent = "";
      return;
    }
    const results = search(await loadIndex(), q);
    if (input.value.trim() !== q) return; // a pessoa continuou digitando
    for (const e of results) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = new URL(e.u, SITE_ROOT).href;
      const title = document.createElement("span");
      title.className = "search__title";
      title.textContent = e.t;
      const ctx = document.createElement("span");
      ctx.className = "search__ctx";
      ctx.textContent =
        e.k === "area" ? KIND.area : `${KIND[e.k]}${e.r ? " (revisita)" : ""} · ${e.a}${e.k === "concept" ? " › " + e.m : ""}`;
      a.append(title, ctx);
      li.append(a);
      list.append(li);
    }
    if (!results.length) {
      const li = document.createElement("li");
      li.className = "search__none";
      li.textContent = `Nenhum resultado para “${q}”.`;
      list.append(li);
    }
    list.hidden = false;
    status.textContent = results.length ? `${results.length} resultado${results.length > 1 ? "s" : ""}` : "Nenhum resultado";
  }

  input.addEventListener("focus", loadIndex, { once: true });
  input.addEventListener("input", run);
  input.addEventListener("keydown", (ev) => {
    const first = list.querySelector("a");
    if (ev.key === "ArrowDown" && first) {
      ev.preventDefault();
      first.focus();
    } else if (ev.key === "Enter" && first) {
      ev.preventDefault();
      first.click();
    } else if (ev.key === "Escape") {
      input.value = "";
      run();
    }
  });
  list.addEventListener("keydown", (ev) => {
    const links = [...list.querySelectorAll("a")];
    const i = links.indexOf(document.activeElement);
    if (ev.key === "ArrowDown" && i < links.length - 1) {
      ev.preventDefault();
      links[i + 1].focus();
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      (i > 0 ? links[i - 1] : input).focus();
    } else if (ev.key === "Escape") {
      input.value = "";
      run();
      input.focus();
    }
  });
  return input;
}

// No navegador, monta a busca em cada espaço reservado. (O build importa este módulo só para testar
// `search` com o índice real — lá não há `document`.)
if (typeof document !== "undefined") {
  const inputs = [...document.querySelectorAll("[data-search-slot]")].map(mount);

  // "/" foca a busca (fora de campos de texto).
  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "/" || ev.metaKey || ev.ctrlKey || ev.altKey || !inputs.length) return;
    const el = document.activeElement;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
    ev.preventDefault();
    inputs[0].focus();
  });
}
