/*
 * concept-tabs — progressive enhancement da "Área de estudo" da Concept Page no
 * site estático (DevAtlas). Carregado SÓ pelas 668 Concept Pages, como
 * <script type="module"> (deferido: roda com o DOM já parseado).
 *
 * SEM este script, os 3 painéis (Conteúdo / Exemplos / Exercício) são <section>
 * sequenciais com <h3> real, TODAS visíveis e legíveis — o HTML base NÃO tem
 * `hidden`, nem `role="tab*"`, nem `tabindex`. Falha de rede/parse aqui não tira
 * conteúdo nenhum da página.
 *
 * COM este script, cada `[data-study-tabs]` do documento é promovido ao padrão
 * WAI-ARIA APG Tabs (horizontal): tablist + tabs + tabpanels, roving tabindex,
 * ←/→/Home/End com ativação automática, click. Um único ponto de tabulação no
 * tablist; Tab entra no painel ativo. Painel ativo = Conteúdo; inativos = hidden.
 *
 * Porte 1:1 de src/roadmap/ui/concept-tabs.js (o enhancement da SPA), com duas
 * diferenças mínimas: (1) auto-executa e trata TODOS os `[data-study-tabs]` do
 * documento (não recebe `root`); (2) os ids são prefixados por instância
 * (`study-<n>-…`) para não colidir se houver mais de uma Área de estudo na
 * página. Sem dependências, sem bundler, sem framework. Sem persistência nesta
 * fase (localStorage / hash / query / memória da última aba = fora da v0).
 */

const TAB_LABELS = { conteudo: "Conteúdo", exemplos: "Exemplos", exercicio: "Exercício" };

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
    tab.textContent = TAB_LABELS[key] || key;
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
