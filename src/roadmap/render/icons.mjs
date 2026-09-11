/*
 * icons — set pequeno de ícones SVG inline (24×24, stroke, currentColor),
 * desenhados à mão para o redesign visual da Concept Study Page. Sem
 * biblioteca/CDN, sem dependência externa — só marcação estática.
 *
 * Decorativos: sempre aria-hidden + focusable="false"; o texto ao lado é
 * quem carrega o significado para leitor de tela.
 */

const SHELL_OPEN =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
const SHELL_CLOSE = "</svg>";

const BODIES = {
  info: '<circle cx="12" cy="12" r="9"></circle><line x1="12" y1="11" x2="12" y2="16"></line><circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none"></circle>',
  link: '<rect x="3" y="9" width="8" height="6" rx="3"></rect><rect x="13" y="9" width="8" height="6" rx="3"></rect><line x1="9" y1="12" x2="15" y2="12"></line>',
  share: '<circle cx="6" cy="6" r="2.3"></circle><circle cx="6" cy="18" r="2.3"></circle><circle cx="18" cy="12" r="2.3"></circle><line x1="8.1" y1="7.2" x2="15.9" y2="10.8"></line><line x1="8.1" y1="16.8" x2="15.9" y2="13.2"></line>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5z"></path>',
  code: '<polyline points="8 6 3 12 8 18"></polyline><polyline points="16 6 21 12 16 18"></polyline>',
  pencil: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>',
  "check-circle": '<circle cx="12" cy="12" r="9"></circle><polyline points="8 12.5 11 15.5 16 9"></polyline>',
  target: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"></circle>',
  checklist:
    '<polyline points="3.5 6 5 7.5 8 4.5"></polyline><line x1="11" y1="6" x2="21" y2="6"></line>' +
    '<polyline points="3.5 13 5 14.5 8 11.5"></polyline><line x1="11" y1="13" x2="21" y2="13"></line>' +
    '<polyline points="3.5 20 5 21.5 8 18.5"></polyline><line x1="11" y1="20" x2="21" y2="20"></line>',
  lightbulb: '<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z"></path>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
  file: '<path d="M7 3h7l5 5v13H7z"></path><polyline points="14 3 14 8 19 8"></polyline>',
  clipboard: '<rect x="6" y="4" width="12" height="16" rx="2"></rect><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"></path>',
};

/**
 * icon(name, extraClass?) → <svg> string, ou "" se o nome não existir
 * (fail-soft: nunca quebra o build por um typo de nome de ícone).
 */
export function icon(name, extraClass) {
  const body = BODIES[name];
  if (!body) return "";
  if (!extraClass) return SHELL_OPEN + body + SHELL_CLOSE;
  return SHELL_OPEN.replace('class="icon"', `class="icon ${extraClass}"`) + body + SHELL_CLOSE;
}
