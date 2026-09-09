/*
 * html — renderer de SHELL HTML por string (R3.5.2).
 *
 * Puro: sem I/O, sem estado, sem DOM. Não fabrica conteúdo do roadmap — só o
 * documento semântico ao redor de um `<main>` recebido pronto como string.
 * Os href/src são passados já resolvidos pelo chamador (o build usa
 * paths.relativize); este módulo não conhece paths, domínio nem deploy.
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
 * renderDocument({ title, main, homeHref, homeLabel, stylesheets })
 *   - title       : conteúdo de <title> (texto)
 *   - main        : HTML interno de <main>, já como string (não escapado)
 *   - homeHref    : href relativo já resolvido para a Home
 *   - homeLabel   : rótulo do link para a Home
 *   - stylesheets : lista de href de CSS já resolvidos (ordem preservada)
 *
 * Sem aria-live global. Sem <script>.
 */
export function renderDocument({ title, main, homeHref, homeLabel, stylesheets = [] }) {
  const links = stylesheets
    .map((href) => `    <link rel="stylesheet" href="${escapeAttr(href)}" />`)
    .join("\n");

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
      <nav aria-label="Roadmap">
        <a href="${escapeAttr(homeHref)}" class="site-header__home">${escapeHtml(homeLabel)}</a>
      </nav>
    </header>
    <main id="main" tabindex="-1">
${main}
    </main>
    <footer class="site-footer">
      <p>Roadmap Senior — roteiro de estudo e revisão para Senior Software Engineer.</p>
    </footer>
  </body>
</html>
`;
}
