/*
 * concept-tabs — progressive enhancement da Concept Page no site estático
 * (DevAtlas): tabs da "Área de estudo" + botão "Copiar" dos code blocks.
 * Carregado SÓ pelas 668 Concept Pages, como <script type="module">
 * (deferido: roda com o DOM já parseado). Um único script por página — as
 * duas responsabilidades moram aqui para não precisar de uma segunda tag
 * <script> (ver invariante "exatamente 1 <script type=module>" no build).
 *
 * Tabs — SEM este script, os 3 painéis (Conteúdo / Exemplos / Exercício) são
 * <section> sequenciais com <h3> real, TODAS visíveis e legíveis — o HTML
 * base NÃO tem `hidden`, nem `role="tab*"`, nem `tabindex`. Falha de
 * rede/parse aqui não tira conteúdo nenhum da página.
 *
 * COM este script, cada `[data-study-tabs]` do documento é promovido ao padrão
 * WAI-ARIA APG Tabs (horizontal): tablist + tabs + tabpanels, roving tabindex,
 * ←/→/Home/End com ativação automática, click. Um único ponto de tabulação no
 * tablist; Tab entra no painel ativo. Painel ativo = Conteúdo; inativos = hidden.
 * Cada botão de tab ganha um ícone decorativo (SVG inline — mesmos desenhos de
 * src/roadmap/render/icons.mjs; duplicado aqui de propósito: o server renderer
 * e este script não compartilham import, cada um é uma folha independente).
 *
 * Copiar — SEM este script, o botão "Copiar" de cada code block existe no HTML
 * (estático, sempre visível) mas fica inerte — clique não faz nada, nenhum
 * conteúdo é perdido. COM o script, clique copia o texto puro do <code> via
 * Clipboard API nativa (sem lib) e mostra "Copiado!" por ~1.5s.
 *
 * Porte 1:1 de src/roadmap/ui/concept-tabs.js (o enhancement da SPA) na parte
 * de tabs, com duas diferenças mínimas: (1) auto-executa e trata TODOS os
 * `[data-study-tabs]` do documento (não recebe `root`); (2) os ids são
 * prefixados por instância (`study-<n>-…`) para não colidir se houver mais de
 * uma Área de estudo na página. Sem dependências, sem bundler, sem framework.
 * Sem persistência nesta fase (localStorage / hash / query / memória da
 * última aba = fora da v0).
 */

const TAB_LABELS = { conteudo: "Conteúdo", exemplos: "Exemplos", exercicio: "Exercício" };

// Mesmos desenhos de src/roadmap/render/icons.mjs (book/code/pencil) — só o
// <path>/<polyline> interno, sem o <svg> wrapper (montado abaixo).
const TAB_ICON_BODY = {
  conteudo: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5z"></path>',
  exemplos: '<polyline points="8 6 3 12 8 18"></polyline><polyline points="16 6 21 12 16 18"></polyline>',
  exercicio: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>',
};

function tabIconSvg(key) {
  const body = TAB_ICON_BODY[key];
  if (!body) return "";
  return (
    '<svg class="icon study-tabs__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    body +
    "</svg>"
  );
}

function enhance(container, uid) {
  const panels = Array.prototype.slice.call(container.querySelectorAll("[data-study-panel]"));
  if (panels.length < 2) return; // estrutura mínima ausente → deixa o HTML base intacto

  const tablist = document.createElement("div");
  tablist.className = "study-tabs";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", "Área de estudo");

  function select(idx) {
    tabs.forEach(function (tab, i) {
      const active = i === idx;
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
  }

  const tabs = panels.map(function (panel, i) {
    const key = panel.getAttribute("data-study-panel");
    const tabId = uid + "-tab-" + key;
    const panelId = uid + "-panel-" + key;

    panel.id = panelId;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tabId);
    panel.setAttribute("tabindex", "0");
    panel.hidden = i !== 0;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "study-tabs__tab";
    tab.id = tabId;
    tab.innerHTML = tabIconSvg(key) + "<span>" + (TAB_LABELS[key] || key) + "</span>";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panelId);
    tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
    tab.tabIndex = i === 0 ? 0 : -1;

    tab.addEventListener("click", function () {
      select(i);
    });

    tab.addEventListener("keydown", function (event) {
      let next = null;
      if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });

    return tab;
  });

  tabs.forEach(function (tab) {
    tablist.appendChild(tab);
  });

  container.insertBefore(tablist, container.firstChild);
  container.classList.add("study-area__panels--enhanced");
}

const containers = document.querySelectorAll("[data-study-tabs]");
for (let i = 0; i < containers.length; i++) {
  enhance(containers[i], "study-" + i);
}

// Botão "Copiar" dos code blocks — Clipboard API nativa, sem lib. Sem este
// script (ou em navegador sem `navigator.clipboard`), o botão fica inerte;
// nenhum conteúdo depende dele.
function wireCopyButtons() {
  if (!navigator.clipboard || !navigator.clipboard.writeText) return;
  const buttons = document.querySelectorAll("[data-copy-code]");
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const block = button.closest(".code-block");
    const codeEl = block && block.querySelector(".code-block__code");
    const labelEl = button.querySelector("[data-copy-label]");
    if (!codeEl || !labelEl) continue;

    const defaultLabel = labelEl.textContent;
    let resetTimer = null;

    button.addEventListener("click", function () {
      navigator.clipboard.writeText(codeEl.textContent).then(
        function () {
          if (resetTimer) clearTimeout(resetTimer);
          labelEl.textContent = "Copiado!";
          button.classList.add("code-block__copy--done");
          resetTimer = setTimeout(function () {
            labelEl.textContent = defaultLabel;
            button.classList.remove("code-block__copy--done");
          }, 1500);
        },
        function () {
          // clipboard indisponível/negada — botão continua utilizável, sem feedback.
        }
      );
    });
  }
}

wireCopyButtons();
