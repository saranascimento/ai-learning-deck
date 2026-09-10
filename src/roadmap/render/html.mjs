/*
 * html — renderer de SHELL HTML por string (R3.5.2).
 *
 * Puro: sem I/O, sem estado, sem DOM. Não fabrica o conteúdo das páginas — só o
 * documento semântico ao redor de um `<main>` recebido pronto como string.
 * Os href/src e a identidade do produto (nome, rodapé) são passados já
 * resolvidos pelo chamador; este módulo não conhece paths, domínio, deploy nem
 * o nome do produto.
 */

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * renderDocument({ title, main, homeHref, homeLabel, stylesheets, navLabel, footerText, siteHeader })
 *   - title       : conteúdo de <title> (texto)
 *   - main        : HTML interno de <main>, já como string (não escapado)
 *   - homeHref    : href relativo já resolvido para a Home
 *   - homeLabel   : rótulo do link para a Home (nome do produto)
 *   - stylesheets : lista de href de CSS já resolvidos (ordem preservada)
 *   - navLabel    : aria-label da <nav> do site (default: homeLabel)
 *   - footerText  : texto do rodapé do site (default: homeLabel)
 *   - siteHeader  : renderiza o <header class="site-header"> com o link para a
 *                   Home (default: true). A Home é a raiz — passa `false`: o
 *                   header global (e o link `site-header__home`) some, a página
 *                   começa direto no <main>. Não afeta o skip-link nem o rodapé.
 *   - scripts     : hrefs (já resolvidos, relativos) de <script type="module">
 *                   ao fim do <body> (default: []). Enhancement opt-in por
 *                   página — a Home/Area/Module/404 não passam nada.
 *
 * Sem aria-live global. Sem <script> a menos que `scripts` seja passado.
 */
export function renderDocument({ title, main, homeHref, homeLabel, stylesheets = [], navLabel, footerText, siteHeader = true, scripts = [] }) {
  const links = stylesheets
    .map((href) => `    <link rel="stylesheet" href="${escapeAttr(href)}" />`)
    .join("\n");
  const navAria = navLabel || homeLabel;
  const footer = footerText || homeLabel;
  const scriptTags = scripts.length
    ? "\n" + scripts.map((src) => `    <script type="module" src="${escapeAttr(src)}"></script>`).join("\n")
    : "";

  const header = siteHeader
    ? `    <header class="site-header">
      <nav aria-label="${escapeAttr(navAria)}">
        <a href="${escapeAttr(homeHref)}" class="site-header__home">${escapeHtml(homeLabel)}</a>
      </nav>
    </header>
`
    : "";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
${links}
  </head>
  <body>
    <a href="#main" class="skip-link">Pular para o conteúdo principal</a>
${header}    <main id="main" tabindex="-1">
${main}
    </main>
    <footer class="site-footer">
      <p>${escapeHtml(footer)}</p>
    </footer>${scriptTags}
  </body>
</html>
`;
}
