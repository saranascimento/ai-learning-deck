/*
 * initConceptTabs — progressive enhancement da "Área de estudo" da página de Conceito.
 *
 * SEM JavaScript, os 3 painéis (Conteúdo / Exemplos / Exercício) são <section>
 * sequenciais com <h3> real, todas visíveis e legíveis.
 *
 * COM JavaScript, este módulo os promove ao padrão WAI-ARIA APG Tabs (horizontal):
 * tablist + tabs + tabpanels, roving tabindex, ←/→/Home/End com ativação automática,
 * um único ponto de tabulação no tablist e Tab entra no painel ativo.
 *
 * O estado da aba ativa é apenas em memória — NÃO usa location.hash (o hash router
 * atual é dono do hash nesta fase). Deep-link de aba fica para a R3.5.
 *
 * Sem dependências. Migra quase verbatim para src/app/enhance.mjs na R3.5.
 */

const TAB_LABELS = { conteudo: "Conteúdo", exemplos: "Exemplos", exercicio: "Exercício" };

export function initConceptTabs(root) {
  const container = root.querySelector("[data-study-tabs]");
  if (!container) return;

  const panels = Array.prototype.slice.call(container.querySelectorAll("[data-study-panel]"));
  if (panels.length < 2) return;

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
    const tabId = "study-tab-" + key;
    const panelId = "study-panel-" + key;

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
