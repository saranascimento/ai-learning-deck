/*
 * highlight — syntax highlighting mínimo, escrito à mão (sem biblioteca),
 * pro code chrome da Concept Study Page. Scanner de uma passada (não regex
 * monolítica): rastreia o último token significativo pra resolver a
 * ambiguidade clássica `/` = regex-literal vs. divisão.
 *
 * Suporta javascript/jsx/typescript/tsx com a MESMA gramática (comentários,
 * strings, regex, palavras-chave, números) — JSX não ganha tokenização de
 * tag própria (simplificação assumida: tags/atributos ficam como texto
 * plano, ainda legível). Linguagem não reconhecida → texto só escapado.
 *
 * Sempre escapa antes de envolver em <span> — o dataset nunca é HTML
 * confiável, mesmo dentro de um token reconhecido.
 */
import { escapeHtml } from "./html.mjs";

const SUPPORTED = new Set(["javascript", "js", "jsx", "typescript", "ts", "tsx"]);

const KEYWORDS = new Set([
  "function", "const", "let", "var", "return", "async", "await", "if", "else", "for", "while",
  "new", "class", "extends", "import", "export", "from", "default", "typeof", "instanceof",
  "this", "true", "false", "null", "undefined", "in", "of", "do", "switch", "case", "break",
  "continue", "try", "catch", "finally", "throw", "yield", "void", "delete", "static", "get",
  "set", "super", "implements", "interface", "type", "enum", "public", "private", "protected", "readonly",
]);

const VALUE_KEYWORDS = new Set(["this", "true", "false", "null", "undefined", "super"]);

// Depois de um destes tokens, "/" começa um regex-literal; depois de um
// identificador/número/string/regex/`)`/`]`/`}`, "/" é divisão.
function isRegexContext(last) {
  if (!last) return true;
  if (last.type === "punct") return !")]}".includes(last.text);
  if (last.type === "keyword") return !VALUE_KEYWORDS.has(last.text);
  return false; // ident | number | string | regex
}

export function highlight(code, language) {
  if (!SUPPORTED.has(language)) return escapeHtml(code);

  let out = "";
  let i = 0;
  let last = null;
  const n = code.length;

  while (i < n) {
    const ch = code[i];

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      out += ch;
      i++;
      continue;
    }

    if (ch === "/" && code[i + 1] === "/") {
      const nl = code.indexOf("\n", i);
      const text = nl === -1 ? code.slice(i) : code.slice(i, nl);
      out += `<span class="tok-comment">${escapeHtml(text)}</span>`;
      i += text.length;
      continue;
    }

    if (ch === "/" && code[i + 1] === "*") {
      let end = code.indexOf("*/", i + 2);
      end = end === -1 ? n : end + 2;
      out += `<span class="tok-comment">${escapeHtml(code.slice(i, end))}</span>`;
      i = end;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < n && code[j] !== quote) {
        j += code[j] === "\\" ? 2 : 1;
      }
      j = Math.min(j + 1, n);
      const text = code.slice(i, j);
      out += `<span class="tok-string">${escapeHtml(text)}</span>`;
      last = { type: "string", text };
      i = j;
      continue;
    }

    if (ch === "/" && isRegexContext(last)) {
      let j = i + 1;
      let inClass = false;
      let closed = false;
      while (j < n) {
        const c = code[j];
        if (c === "\\") { j += 2; continue; }
        if (c === "\n") break;
        if (c === "[") inClass = true;
        else if (c === "]") inClass = false;
        else if (c === "/" && !inClass) { j++; closed = true; break; }
        j++;
      }
      if (closed) {
        while (j < n && /[a-z]/i.test(code[j])) j++;
        const text = code.slice(i, j);
        out += `<span class="tok-regex">${escapeHtml(text)}</span>`;
        last = { type: "regex", text };
        i = j;
        continue;
      }
      // não fechou como regex válido — trata "/" como pontuação abaixo.
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const text = code.slice(i, j);
      if (KEYWORDS.has(text)) {
        out += `<span class="tok-keyword">${escapeHtml(text)}</span>`;
        last = { type: "keyword", text };
      } else {
        out += escapeHtml(text);
        last = { type: "ident", text };
      }
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[0-9.]/.test(code[j])) j++;
      const text = code.slice(i, j);
      out += `<span class="tok-number">${escapeHtml(text)}</span>`;
      last = { type: "number", text };
      i = j;
      continue;
    }

    out += escapeHtml(ch);
    last = { type: "punct", text: ch };
    i++;
  }

  return out;
}
