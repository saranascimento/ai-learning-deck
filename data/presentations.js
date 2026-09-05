/*
 * Catálogo de apresentações disponíveis na Home. Para adicionar uma nova
 * apresentação: criar presentations/<slug>/index.html reaproveitando a
 * engine e o css compartilhados, e acrescentar um item aqui — nenhuma
 * outra mudança é necessária.
 */
(function () {
  const App = (window.App = window.App || {});

  App.presentations = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals",
      description: 'Da "IA" que usamos no dia a dia até entender o que acontece por trás de uma resposta.',
      cta: "Iniciar apresentação",
      url: "presentations/ai-fundamentals/index.html",
    },
    {
      id: "harness",
      title: "Por baixo do Harness",
      description: "Os conceitos de IA por trás das abstrações que usamos no dia a dia.",
      cta: "Iniciar apresentação",
      url: "presentations/harness/index.html",
    },
  ];
})();
