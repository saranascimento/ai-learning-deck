import { area, module, concept } from "../builders.js";

export default area({
  slug: "testing-quality-engineering",
  order: 20,
  title: "Testing & Quality Engineering",
  color: "#57C98A",
  summary:
    "Como testar, projetar para testabilidade e diagnosticar: fundamentos, dublês, TDD, " +
    "estratégia e debugging. A Story Debugging foi movida de Software Craft.",
  phase: "Fase 2 concluída (2026-09-03)",
  modules: [
    module({
      slug: "testing-fundamentals",
      order: 10,
      title: "Testing Fundamentals",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary: "O conceito e o porquê → o primitivo (Assertion) → como um teste é estruturado → a maquinaria de apoio → escopo crescente.",
      suggestions: ["Test Case", "Test Suite", "Setup / Teardown (mecânica do Fixture)", "Parameterized Tests", "Snapshot Testing"],
      concepts: [
        concept({
          order: 10,
          title: "Unit Testing",
          requires: ["Programming Foundations / Programming Fundamentals"],
          revisit: ["Functional Programming / Pure Functions (alvo trivial)", "AI Engineering / AI Evaluation (offline eval ≈ teste)"],
        }),
        concept({
          order: 20,
          title: "Assertion",
          isNew: true,
          note: "a verificação atômica: valor real × esperado; base de pass/fail",
          collision: "≠ assert / invariante em runtime (relacionado a Programming Foundations / Contract) — a asserção de teste roda no teste",
        }),
        concept({ order: 30, title: "Arrange-Act-Assert", requires: ["Unit Testing", "Assertion"], note: "a estrutura de 3 fases de um teste" }),
        concept({ order: 40, title: "Given-When-Then", requires: ["Unit Testing", "Assertion"], note: "a mesma estrutura de 3 fases, na fraseologia BDD — não depende de AAA" }),
        concept({ order: 50, title: "Test Fixture", isNew: true, requires: ["Unit Testing"], note: "o estado/dado base fixo sobre o qual um teste roda" }),
        concept({ order: 60, title: "Test Runner", isNew: true, requires: ["Unit Testing", "Assertion"], note: "a ferramenta que descobre, executa e reporta testes" }),
        concept({
          order: 70,
          title: "Integration Testing",
          requires: ["Unit Testing"],
          note: "\"integração\" pressupõe \"unidades\"",
          collision: "≠ Continuous Integration (Platform / CI-CD)",
        }),
        concept({ order: 80, title: "E2E Testing", requires: ["Integration Testing"], note: "o caso máximo de integração — sistema inteiro, ótica do usuário" }),
      ],
    }),
    module({
      slug: "test-doubles",
      order: 20,
      title: "Test Doubles",
      requires: ["Testing Fundamentals", "Programming Foundations / Programming Fundamentals / Interface"],
      summary:
        "Guarda-chuva → do mais inerte ao mais acoplado ao teste: dummy → stub → fake → spy → mock. " +
        "Todos dependem só de Test Doubles — a progressão é de complexidade, não de pré-requisito.",
      suggestions: ["Seam", "Mocking Framework", "Over-Mocking / Mock Hell", "Classicist vs Mockist (Chicago vs London)"],
      concepts: [
        concept({
          order: 10,
          title: "Test Doubles",
          requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Interface"],
          note: "termo guarda-chuva (taxonomia de Meszaros)",
          collision: "nome da Story = nome desta Task — esta é a Task do conceito-guarda-chuva",
        }),
        concept({ order: 20, title: "Dummy", isNew: true, requires: ["Test Doubles"], note: "objeto passado mas nunca usado — só preenche uma assinatura" }),
        concept({ order: 30, title: "Stub", requires: ["Test Doubles"], note: "respostas prontas, sem verificação" }),
        concept({
          order: 40,
          title: "Fake",
          requires: ["Test Doubles"],
          note: "implementação real porém simplificada (ex.: repositório em memória)",
          collision: "≠ Fake Model (AI Engineering / deck harness) — mesmo padrão, outro domínio",
        }),
        concept({ order: 50, title: "Spy", requires: ["Test Doubles"], note: "registra chamadas para asserção posterior" }),
        concept({
          order: 60,
          title: "Mock",
          requires: ["Test Doubles"],
          note: "pré-programado com expectativas; verifica interação. Conceitualmente próximo de Spy (registra + verifica) — relação, não Requires.",
          collision: "\"mock\" coloquial = qualquer dublê; aqui é o sentido preciso",
        }),
      ],
    }),
    module({
      slug: "test-driven-development",
      order: 30,
      title: "Test-Driven Development",
      requires: ["Testing Fundamentals"],
      summary:
        "A filosofia/disciplina (o \"quê\" e o \"porquê\") → o loop operacional (o \"como\"). " +
        "Test Doubles é usado na prática com colaboradores, mas não é pré-requisito do conceito.",
      suggestions: [
        "Behavior-Driven Development (BDD)",
        "Test-First vs Test-After",
        "Baby Steps",
        "Triangulation",
        "Fake It Till You Make It",
        "Outside-In vs Inside-Out TDD",
        "Test-Induced Design Damage",
      ],
      concepts: [
        concept({ order: 10, title: "Test-Driven Development", requires: ["Testing Fundamentals / Arrange-Act-Assert"], note: "disciplina test-first; por que TDD dirige o design; benefícios e custos" }),
        concept({
          order: 20,
          title: "Red-Green-Refactor",
          isNew: true,
          requires: ["Test-Driven Development"],
          note:
            "o loop concreto: teste mínimo que falha → código mínimo que passa → melhorar com a barra verde. " +
            "Passo \"Refactor\": aprofundamento posterior em Epic 03 / Software Craft / Refactoring — pointer, não Requires.",
        }),
      ],
    }),
    module({
      slug: "testing-strategy",
      order: 40,
      title: "Testing Strategy",
      requires: ["Testing Fundamentals", "Test Doubles"],
      summary:
        "Enquadramento (pyramid) → métrica (coverage) → o que torna testável (testability) → isolar → flaky → " +
        "regressão → property-based → contratos entre serviços. Só Flaky Tests ← Test Isolation entre elas.",
      suggestions: [
        "Testing Trophy (contraponto à Pyramid)",
        "Test Smells",
        "Mutation Testing",
        "Test Data Builders",
        "CI Test Gates (ponte para Platform / CI-CD)",
        "Non-Functional Testing (já é SUGESTÃO de Story na Fase 1)",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Test Pyramid",
          requires: ["Testing Fundamentals / Integration Testing", "Testing Fundamentals / E2E Testing"],
          note: "como distribuir tipos de teste (unit ≫ integration ≫ e2e) — as camadas são esses tipos",
        }),
        concept({
          order: 20,
          title: "Code Coverage",
          isNew: true,
          requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
          note: "% de código exercitado pelos testes. Cuidado com \"coverage as a target\" (Goodhart)",
          subtopics: ["line", "statement", "branch", "path coverage"],
          revisit: ["Platform / CI-CD (coverage gates)", "Software Craft / Code Review"],
        }),
        concept({
          order: 30,
          title: "Testability",
          requires: ["Test Doubles", "Programming Foundations / Programming Fundamentals / Coupling"],
          note: "propriedades do código que permitem testá-lo (seams, injeção de dependência, poucos colaboradores)",
          revisit: ["Functional Programming / Pure Functions (o caso ideal)", "Software Design / Dependency Injection & IoC (DI é aplicação da testabilidade)"],
        }),
        concept({
          order: 40,
          title: "Test Isolation",
          requires: ["Testing Fundamentals / Test Fixture", "Programming Foundations / Concurrency / Shared State"],
          note: "testes não dependem uns dos outros nem de estado compartilhado; ordem-agnósticos",
        }),
        concept({
          order: 50,
          title: "Flaky Tests",
          requires: ["Test Isolation", "Programming Foundations / Concurrency / Race Condition"],
          note: "testes não determinísticos: corrida, tempo, ordem, rede",
        }),
        concept({
          order: 60,
          title: "Regression Testing",
          requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
          note: "re-executar testes para impedir que bugs corrigidos voltem",
          revisit: ["AI Engineering / Regression Evaluation — análogo para modelos, escopo diferente"],
        }),
        concept({
          order: 70,
          title: "Property-Based Testing",
          isNew: true,
          requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Contract"],
          note: "gerar muitas entradas a partir de propriedades/invariantes, em vez de exemplos",
          revisit: ["Functional Programming / Pure Functions (onde funciona melhor)"],
        }),
        concept({
          order: 80,
          title: "Contract Testing",
          requires: ["Programming Foundations / Programming Fundamentals / Contract", "Testing Fundamentals / Integration Testing"],
          note: "provedor e consumidor concordam numa interface",
          collision: "≠ Contract (Epic 01 / PF) · ≠ API Contract (Platform / API)",
          revisit: ["Platform / API (API Contract)", "Architecture / Service Communication (consumer-driven contracts)"],
        }),
      ],
    }),
    module({
      slug: "debugging",
      order: 50,
      title: "Debugging",
      requires: [
        "Testing Fundamentals",
        "Programming Foundations / Memory & Runtime / Call Stack",
        "Programming Foundations / Algorithms & Complexity / Binary Search",
      ],
      summary:
        "Reproduzir → método (hipótese) → ler o artefato gratuito do runtime (stack trace) → parar a execução " +
        "(breakpoints) → localizar (binary search → git bisect) → não parar no sintoma (RCA).",
      suggestions: [
        "Logging for Debugging / printf Debugging",
        "Rubber Duck Debugging",
        "Debugger (a ferramenta)",
        "Conditional Breakpoints",
        "Watch Expressions",
        "git blame",
        "Heisenbug",
        "Core Dump",
        "Delta Debugging",
        "Time-Travel Debugging",
        "Observability-Driven Debugging (ponte para Platform)",
      ],
      concepts: [
        concept({ order: 10, title: "Reproduction", requires: ["Testing Fundamentals / Unit Testing"], note: "tornar o bug confiável antes de investigar — um teste que falha é a repro ideal" }),
        concept({ order: 20, title: "Hypothesis-Driven Debugging", requires: ["Reproduction"], note: "método científico: hipótese → previsão → teste" }),
        concept({
          order: 30,
          title: "Stack Trace",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "ler a pilha de chamadas no ponto da falha — é uma renderização do call stack",
          collision: "≠ Call Stack (Epic 01 / Memory & Runtime) · ≠ Stack ADT (Epic 01 / Data Structures)",
        }),
        concept({
          order: 40,
          title: "Breakpoints",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "pausar a execução para inspecionar estado/frames. Complementa Stack Trace",
        }),
        concept({
          order: 50,
          title: "Binary Search Debugging",
          requires: ["Programming Foundations / Algorithms & Complexity / Binary Search", "Hypothesis-Driven Debugging"],
          note: "bisseccionar o espaço de código/entrada para localizar",
        }),
        concept({
          order: 60,
          title: "Git Bisect",
          requires: ["Binary Search Debugging", "Epic 03 / Software Craft / Git (forward-reference aceita)"],
          note: "busca binária automatizada sobre o histórico de commits. Canônico aqui — Bisect no Epic 03 / Git é revisita/referência",
        }),
        concept({
          order: 70,
          title: "Root Cause Analysis",
          requires: ["Hypothesis-Driven Debugging"],
          note: "ir além do sintoma; 5 Whys — teste de hipótese iterativo",
          revisit: ["Platform / Reliability Engineering — Postmortem, Blameless Postmortem, MTTD/MTTR"],
        }),
      ],
    }),
  ],
});
