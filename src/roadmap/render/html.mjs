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
 * renderDocument({ title, main, homeHref, homeLabel, stylesheets, navLabel, footerText })
 *   - title       : conteúdo de <title> (texto)
 *   - main        : HTML interno de <main>, já como string (não escapado)
 *   - homeHref    : href relativo já resolvido para a Home
 *   - homeLabel   : rótulo do link para a Home (nome do produto)
 *   - stylesheets : lista de href de CSS já resolvidos (ordem preservada)
 *   - navLabel    : aria-label da <nav> do site (default: homeLabel)
 *   - footerText  : texto do rodapé do site (default: homeLabel)
 *
 * Sem aria-live global. Sem <script>.
 */
export function renderDocument({ title, main, homeHref, homeLabel, stylesheets = [], navLabel, footerText }) {
  const links = stylesheets
    .map((href) => `    <link rel="stylesheet" href="${escapeAttr(href)}" />`)
    .join("\n");
  const navAria = navLabel || homeLabel;
  const footer = footerText || homeLabel;

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
    <header class="site-header">
      <nav aria-label="${escapeAttr(navAria)}">
        <a href="${escapeAttr(homeHref)}" class="site-header__home">${escapeHtml(homeLabel)}</a>
      </nav>
    </header>
    <main id="main" tabindex="-1">
${main}
    </main>
    <footer class="site-footer">
      <p>${escapeHtml(footer)}</p>
    </footer>
  </body>
</html>
`;
}
