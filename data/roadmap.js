/*
 * Roadmap Senior — árvore Epic → Story → Task (interface: Área → Módulo → Conceito).
 *
 * FONTE DA VERDADE: roadmap/00-overview.md (Fase 1) + roadmap/01-programming-foundations.md
 * e roadmap/02-testing-quality-engineering.md (Fase 2). Este arquivo reflete exatamente
 * a estrutura aprovada — não reorganizar conteúdo, não alterar Requires, não criar Tasks
 * aqui. Alterações de estrutura passam pelos arquivos de roadmap primeiro.
 *
 * Epics 01 e 02: Fase 2 concluída → navegáveis até Conceito.
 * Epics 03–07: Fase 1 apenas → visíveis, "em estruturação", sem drill-down.
 *
 * Compatível com Jira: cada nó tem jiraType ("epic" | "story" | "task") e jiraKey
 * (null até haver sync). `order` é esparso (10, 20, 30…). id/slug são derivados no
 * modelo (js/roadmap/data.js) a partir de epic.slug / story.slug / slugify(task.title).
 */
(function () {
  const App = (window.App = window.App || {});

  // Açúcar de construção — não é API pública.
  const epic = (o) => Object.assign({ jiraType: "epic", status: "navigable", stories: [], plannedStories: [] }, o);
  const story = (o) => Object.assign({ jiraType: "story", requires: [], relocated: [], suggestions: [], tasks: [] }, o);
  const task = (o) =>
    Object.assign(
      {
        jiraType: "task",
        requires: [],
        canonical: true,
        revisit: [],
        revisitOf: null,
        collision: null,
        note: "",
        isNew: false,
        subtopics: [],
        resources: [],
        jiraKey: null,
        content: null,
      },
      o
    );

  App.roadmapMeta = {
    title: "Roadmap Senior",
    subtitle: "Roteiro de estudo e revisão para Senior Software Engineer.",
    interfaceLabels: { epic: "Área", story: "Módulo", task: "Conceito" },
    // Decks preservados como recursos de aprofundamento — não protagonistas da Home.
    decks: ["harness", "ai-fundamentals"],
  };

  App.roadmap = [
    // ───────────────────────── 01 · PROGRAMMING FOUNDATIONS ─────────────────────────
    epic({
      slug: "programming-foundations",
      order: 10,
      title: "Programming Foundations",
      jiraKey: null,
      color: "#5B8CFF",
      summary:
        "Mecânica de linguagem, agnóstica de stack: paradigma, memória e runtime, tipos, " +
        "funções puras, estruturas de dados, complexidade, async e concorrência. Pré-requisito de tudo.",
      phase: "Fase 2 concluída (2026-09-03)",
      stories: [
        story({
          slug: "programming-fundamentals",
          order: 10,
          title: "Programming Fundamentals",
          summary:
            "Vocabulário de paradigma e critérios de qualidade estrutural. Os 4 pilares, " +
            "interface/contrato, composição e, por fim, coupling/cohesion/SoC.",
          relocated: [
            {
              title: "Composition over Inheritance",
              to: "Epic 04 · Software Design / Design Principles",
              reason:
                "O mecanismo Composition fica aqui; a heurística consolida com a Task homônima de " +
                "\"Additional Design Principles\". Preservada, não apagada.",
            },
          ],
          suggestions: ["Modularity", "Encapsulation Boundaries (module / package / service)"],
          tasks: [
            task({ order: 10, title: "Abstraction", note: "raiz de tudo", revisit: ["Software Design / OOD", "Architecture Fundamentals"] }),
            task({ order: 20, title: "Encapsulation", requires: ["Abstraction"], revisit: ["Software Design / OOD"] }),
            task({
              order: 30,
              title: "Information Hiding",
              requires: ["Encapsulation"],
              note: "distinção Encapsulation (técnica) × Information Hiding (princípio) — conflados na prática",
            }),
            task({
              order: 40,
              title: "Interface",
              requires: ["Abstraction"],
              note: "a fronteira",
              revisit: ["Software Design / Program to an Interface", "Platform / API Contract", "Testing / Contract Testing"],
            }),
            task({
              order: 50,
              title: "Contract",
              requires: ["Interface"],
              note: "pré/pós-condições, invariantes (Design by Contract)",
              revisit: ["Platform / API", "Testing"],
            }),
            task({ order: 60, title: "Inheritance", requires: ["Encapsulation"], revisit: ["Software Design / OOD", "SOLID / LSP"] }),
            task({
              order: 70,
              title: "Polymorphism",
              requires: ["Interface", "Inheritance"],
              note: "foco em subtype polymorphism",
              revisit: ["Software Design / OOD", "SOLID"],
            }),
            task({
              order: 80,
              title: "Composition",
              requires: ["Encapsulation"],
              note: "composição de objetos (has-a)",
              collision: "≠ Function Composition (Functional Programming) — objetos has-a × f∘g",
            }),
            task({
              order: 90,
              title: "Coupling",
              requires: ["Interface", "Composition", "Inheritance"],
              note: "era Task duplicada em 3 Epics — aqui vira o lar único",
              revisit: ["Software Craft", "Software Design", "Architecture Fundamentals"],
            }),
            task({
              order: 100,
              title: "Cohesion",
              requires: ["Coupling"],
              note: "ensinar em par com Coupling",
              revisit: ["Software Design", "Architecture"],
            }),
            task({
              order: 110,
              title: "Separation of Concerns",
              requires: ["Coupling", "Cohesion"],
              note: "o princípio que \"baixo acoplamento / alta coesão\" serve",
              revisit: ["Software Design", "Architecture"],
            }),
          ],
        }),
        story({
          slug: "memory-and-runtime",
          order: 20,
          title: "Memory & Runtime",
          isNew: true,
          requires: ["Programming Fundamentals (Abstraction, Encapsulation)"],
          summary:
            "Como o programa existe em memória e como executa. Detalhes variam por linguagem/runtime — " +
            "ensinar os conceitos, sinalizar o que é específico (ex.: GC vs gestão manual).",
          suggestions: [
            "Pointer / Reference (mecânica)",
            "Boxing / Unboxing",
            "Memory Layout (contiguidade, cache locality)",
            "Stack Overflow (Task própria)",
          ],
          tasks: [
            task({ order: 10, title: "Memory", requires: ["Programming Fundamentals / Abstraction"], note: "armazenamento endereçável: bytes, endereços, alocação" }),
            task({
              order: 20,
              title: "Value vs Reference",
              requires: ["Memory"],
              note: "cópia de valor × endereço compartilhado; semântica varia por linguagem",
              revisit: ["Concurrency / Shared State", "Software Design / Mutable vs Immutable Objects", "Functional Programming / Immutability"],
            }),
            task({
              order: 30,
              title: "Stack vs Heap",
              requires: ["Value vs Reference"],
              note: "stack (frames, LIFO, automática) × heap (dinâmica, coletada)",
              collision: "≠ Stack ADT (Data Structures)",
            }),
            task({
              order: 40,
              title: "Call Stack",
              requires: ["Stack vs Heap"],
              note: "frames de execução, chamada/retorno, stack overflow",
              collision: "≠ Stack ADT (Data Structures)",
              revisit: ["Algorithms & Complexity / Recursion", "Asynchronous Programming / Call Stack + Event Loop"],
            }),
            task({
              order: 50,
              title: "Garbage Collection",
              requires: ["Stack vs Heap"],
              note: "recuperação automática do heap; reachability. Específico de runtimes com GC — contrastar com gestão manual",
              revisit: ["Concurrency (pausas de GC)", "Platform / Performance"],
            }),
            task({
              order: 60,
              title: "Memory Leak",
              requires: ["Garbage Collection", "Value vs Reference"],
              note: "referências retidas que impedem a coleta; modo de falha",
              revisit: ["Frontend (SUGESTÃO Epic)", "Platform / Performance Engineering"],
            }),
          ],
        }),
        story({
          slug: "type-systems",
          order: 30,
          title: "Type Systems",
          requires: ["Programming Fundamentals (Interface, Contract, Abstraction)"],
          summary:
            "Os eixos static/dynamic e strong/weak → a propriedade que produzem (Type Safety) → " +
            "nominal × structural → ferramentas de composição de tipos.",
          suggestions: [
            "Gradual Typing",
            "Top / Bottom Types (any, never, unknown)",
            "Variance (covariance / contravariance)",
            "Algebraic Data Types",
            "Optional / Nullable Types",
          ],
          tasks: [
            task({ order: 10, title: "Static vs Dynamic Typing", requires: ["Programming Fundamentals / Contract"], note: "quando os tipos são checados" }),
            task({ order: 20, title: "Strong vs Weak Typing", requires: ["Static vs Dynamic Typing"], note: "quão estritamente são impostos — eixo independente" }),
            task({ order: 30, title: "Type Inference", requires: ["Static vs Dynamic Typing"] }),
            task({ order: 40, title: "Type Safety", requires: ["Strong vs Weak Typing"], note: "a propriedade resultante", revisit: ["todo o roadmap assume", "Software Design / DIP"] }),
            task({ order: 50, title: "Nominal Typing", requires: ["Type Safety"] }),
            task({ order: 60, title: "Structural Typing", requires: ["Nominal Typing"], note: "ensinar como contraste", revisit: ["Software Design (duck typing, Program to an Interface)"] }),
            task({ order: 70, title: "Generics", requires: ["Type Safety", "Programming Fundamentals / Abstraction"], revisit: ["Data Structures (coleções genéricas)"] }),
            task({ order: 80, title: "Union Types", requires: ["Type Safety"] }),
            task({ order: 90, title: "Intersection Types", requires: ["Union Types"] }),
            task({ order: 100, title: "Type Narrowing", requires: ["Union Types"], revisit: ["Software Craft / Guard Clauses (narrowing por guarda)"] }),
          ],
        }),
        story({
          slug: "functional-programming",
          order: 40,
          title: "Functional Programming",
          requires: ["Programming Fundamentals"],
          summary:
            "Lar canônico de Pure Functions, Side Effects, Immutability, Referential Transparency, " +
            "Closure, Higher-Order Functions e Function Composition.",
          suggestions: [
            "Currying / Partial Application",
            "Recursion vs Iteration (ponte com Algorithms & Complexity)",
            "Functor / Monad (nível intuição)",
            "Lazy Evaluation",
            "Pipe / Flow",
          ],
          tasks: [
            task({ order: 10, title: "Declarative vs Imperative", requires: ["Programming Fundamentals / Abstraction"], note: "framing do paradigma" }),
            task({ order: 20, title: "First-Class Functions", requires: ["Declarative vs Imperative"], note: "o recurso de linguagem que habilita o resto" }),
            task({
              order: 30,
              title: "Closure",
              isNew: true,
              requires: ["First-Class Functions"],
              note:
                "função + ambiente léxico capturado. Importante para callbacks e comportamento de funções em JavaScript. " +
                "NÃO é pré-requisito do mecanismo do Event Loop.",
              revisit: ["Asynchronous Programming / Callback", "Frontend (SUGESTÃO Epic)"],
            }),
            task({ order: 40, title: "Side Effects", requires: ["Programming Fundamentals / Encapsulation"], note: "ensinar antes de Pure Functions", revisit: ["Concurrency / Shared State", "AI / determinismo"] }),
            task({
              order: 50,
              title: "Pure Functions",
              requires: ["Side Effects"],
              revisit: ["Testing & Quality (função pura = trivialmente testável)", "Algorithms & Complexity / Memoization", "AI"],
            }),
            task({ order: 60, title: "Referential Transparency", requires: ["Pure Functions"] }),
            task({
              order: 70,
              title: "Immutability",
              requires: ["Side Effects", "Memory & Runtime / Value vs Reference"],
              revisit: ["Concurrency / Thread Safety", "Software Design / Mutable vs Immutable Objects", "Architecture / Event Sourcing"],
            }),
            task({ order: 80, title: "Higher-Order Functions", requires: ["First-Class Functions", "Closure"] }),
            task({ order: 90, title: "Function Composition", requires: ["Higher-Order Functions", "Pure Functions"], collision: "≠ Composition (Programming Fundamentals, objetos). f∘g" }),
            task({ order: 100, title: "Map", requires: ["Higher-Order Functions"] }),
            task({ order: 110, title: "Filter", requires: ["Map"] }),
            task({ order: 120, title: "Reduce", requires: ["Map", "Filter"], note: "o caso geral — ensinar por último" }),
          ],
        }),
        story({
          slug: "data-structures",
          order: 50,
          title: "Data Structures",
          requires: ["Programming Fundamentals", "Type Systems / Generics (ajuda)"],
          summary: "Contíguo → encadeado → estruturas sobre eles → indexação por chave → hierárquico → o mais geral (Graph).",
          suggestions: [
            "Deque",
            "Priority Queue (hoje implícito em Heap)",
            "Trie",
            "Balanced Tree (AVL / Red-Black — intuição)",
            "B-Tree (hoje só citado em Platform)",
            "Adjacency List vs Matrix",
            "Circular Buffer",
          ],
          tasks: [
            task({ order: 10, title: "Array", note: "memória contígua, índice O(1)" }),
            task({ order: 20, title: "Linked List", requires: ["Array"], note: "contraste: sem contiguidade" }),
            task({ order: 30, title: "Stack", requires: ["Array", "Linked List"], note: "LIFO", collision: "≠ Call Stack (Memory & Runtime)" }),
            task({ order: 40, title: "Queue", requires: ["Stack"], note: "FIFO, ensinar em par", revisit: ["Asynchronous Programming / Task Queue", "Architecture / Message Queue"] }),
            task({ order: 50, title: "Hash Table", requires: ["Array"], revisit: ["Architecture / Consistent Hashing", "Platform / índices"] }),
            task({ order: 60, title: "Set", requires: ["Hash Table"], note: "normalmente hash-backed" }),
            task({ order: 70, title: "Tree", requires: ["Linked List"], note: "nós + ponteiros" }),
            task({ order: 80, title: "Binary Search Tree", requires: ["Tree"], revisit: ["Platform / índices B-tree"] }),
            task({ order: 90, title: "Heap", requires: ["Tree", "Array"], note: "árvore completa em array; priority queue" }),
            task({
              order: 100,
              title: "Graph",
              requires: ["Tree", "Hash Table"],
              revisit: ["AI / Vector Search (HNSW)", "Architecture (service graph)", "Software Design (dependency graph)"],
            }),
          ],
        }),
        story({
          slug: "algorithms-and-complexity",
          order: 60,
          title: "Algorithms & Complexity",
          requires: ["Data Structures", "Memory & Runtime / Call Stack (para Recursion)"],
          summary: "Medir (time/space) → a notação (Big O) → o catálogo de classes → buscas → sorting → recursão → memoization.",
          suggestions: [
            "Divide and Conquer",
            "Dynamic Programming",
            "Greedy Algorithms",
            "Graph Traversal (BFS / DFS)",
            "Best / Average / Worst Case",
            "Amortized Complexity",
            "Complexity of Common Operations (cheat-sheet)",
          ],
          tasks: [
            task({ order: 10, title: "Time Complexity", requires: ["Data Structures"] }),
            task({ order: 20, title: "Space Complexity", requires: ["Time Complexity"] }),
            task({ order: 30, title: "Big O", requires: ["Time Complexity", "Space Complexity"], note: "a notação (pior caso assintótico)" }),
            task({
              order: 40,
              title: "Common Time Complexities",
              isNew: true,
              requires: ["Big O"],
              note: "consolida O(1), O(log n), O(n), O(n log n), O(n²) — cada classe é subtópico, com exemplo canônico e comparação de crescimento",
              subtopics: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
            }),
            task({ order: 50, title: "Linear Search", requires: ["Common Time Complexities", "Array"] }),
            task({
              order: 60,
              title: "Binary Search",
              requires: ["Common Time Complexities", "Binary Search Tree"],
              revisit: ["Testing & Quality / Binary Search Debugging", "Testing & Quality / Git Bisect"],
            }),
            task({ order: 70, title: "Sorting Fundamentals", requires: ["Common Time Complexities"], note: "comparar sort ingênuo × eficiente" }),
            task({
              order: 80,
              title: "Recursion",
              requires: ["Memory & Runtime / Call Stack", "Common Time Complexities"],
              note: "a dependência para a frente foi eliminada — Call Stack é canônico na Story Memory & Runtime",
              revisit: ["Data Structures (traversals)", "Software Craft"],
            }),
            task({
              order: 90,
              title: "Memoization",
              requires: ["Recursion", "Data Structures / Hash Table", "Functional Programming / Pure Functions"],
              note: "só funciona sobre função pura",
              revisit: ["Platform / Caching", "Frontend (SUGESTÃO Epic)"],
            }),
          ],
        }),
        story({
          slug: "asynchronous-programming",
          order: 70,
          title: "Asynchronous Programming",
          requires: [
            "Programming Fundamentals",
            "Functional Programming (First-Class Functions, Closure)",
            "Memory & Runtime / Call Stack",
          ],
          summary:
            "Fundamentos (Sync/Async, Blocking/Non-Blocking) agnósticos de linguagem; runtime e abstrações " +
            "no modelo event-loop (JS), sinalizando o que é específico.",
          suggestions: [
            "Promise Combinators (all / race / allSettled)",
            "Cancellation / AbortController",
            "Generators / Async Iterators",
            "Callback Hell (histórico)",
            "Backpressure (hoje só em Architecture)",
          ],
          tasks: [
            task({ order: 10, title: "Synchronous vs Asynchronous", note: "framing — agnóstico de linguagem" }),
            task({ order: 20, title: "Blocking vs Non-Blocking", requires: ["Synchronous vs Asynchronous"], note: "eixo distinto de sync/async — agnóstico" }),
            task({
              order: 30,
              title: "Call Stack",
              canonical: false,
              revisitOf: "Programming Foundations / Memory & Runtime / Call Stack",
              requires: ["Memory & Runtime / Call Stack"],
              note: "revisita do conceito canônico, agora no contexto de execução assíncrona",
            }),
            task({
              order: 40,
              title: "Callback",
              requires: ["Functional Programming / First-Class Functions", "Functional Programming / Closure", "Synchronous vs Asynchronous"],
            }),
            task({ order: 50, title: "Task Queue", requires: ["Data Structures / Queue", "Callback"], collision: "≠ Architecture / Message Queue (infra, outra Epic)" }),
            task({ order: 60, title: "Event Loop", requires: ["Call Stack", "Task Queue"], note: "modelo do JS / runtimes event-loop", revisit: ["Frontend (SUGESTÃO Epic)", "Node.js"] }),
            task({ order: 70, title: "Microtask Queue", requires: ["Event Loop", "Task Queue"], note: "específico de runtime (JS)" }),
            task({ order: 80, title: "Promise", requires: ["Callback", "Microtask Queue"], revisit: ["AI / Streaming", "Platform / SSE"] }),
            task({ order: 90, title: "Async/Await", requires: ["Promise"], note: "açúcar sintático sobre Promise" }),
          ],
        }),
        story({
          slug: "concurrency",
          order: 80,
          title: "Concurrency",
          requires: ["Asynchronous Programming", "Memory & Runtime"],
          summary:
            "Framing (concurrency ≠ parallelism ≠ async) → unidades de execução → o problema (shared state → race) → " +
            "as ferramentas → as novas falhas → o objetivo (thread safety).",
          suggestions: [
            "Context Switch",
            "Thread Pool",
            "Lock Contention",
            "Livelock",
            "Compare-and-Swap (CAS)",
            "Memory Model / Happens-Before",
            "Actor Model",
            "CSP / Channels",
            "Green Threads / Coroutines",
          ],
          tasks: [
            task({ order: 10, title: "Concurrency vs Parallelism", requires: ["Asynchronous Programming / Synchronous vs Asynchronous"], note: "framing — não é o mesmo que async" }),
            task({ order: 20, title: "Process", requires: ["Memory & Runtime / Memory"], revisit: ["Platform / Containers (Container vs VM)"] }),
            task({ order: 30, title: "Thread", requires: ["Process"], revisit: ["Platform", "Kubernetes"] }),
            task({
              order: 40,
              title: "Shared State",
              requires: ["Thread", "Functional Programming / Immutability"],
              note: "contraste: dado imutável = sem o problema",
              revisit: ["Architecture / Stateless Systems"],
            }),
            task({ order: 50, title: "Race Condition", requires: ["Shared State"], revisit: ["Platform / DB (Optimistic/Pessimistic Locking, Isolation Levels)"] }),
            task({ order: 60, title: "Critical Section", requires: ["Race Condition"] }),
            task({ order: 70, title: "Atomic Operation", requires: ["Race Condition"], collision: "≠ ACID Atomicity (Platform) — escopo diferente" }),
            task({ order: 80, title: "Mutex", requires: ["Critical Section"] }),
            task({ order: 90, title: "Semaphore", requires: ["Mutex"] }),
            task({ order: 100, title: "Deadlock", requires: ["Mutex", "Semaphore"], revisit: ["Platform / DB", "Architecture (deadlock distribuído)"] }),
            task({ order: 110, title: "Starvation", requires: ["Semaphore", "Deadlock"], note: "ensinar em par (falhas de liveness)" }),
            task({ order: 120, title: "Thread Safety", requires: ["Mutex", "Atomic Operation", "Functional Programming / Immutability"], note: "a síntese da Story" }),
          ],
        }),
      ],
    }),

    // ─────────────────────── 02 · TESTING & QUALITY ENGINEERING ───────────────────────
    epic({
      slug: "testing-quality-engineering",
      order: 20,
      title: "Testing & Quality Engineering",
      jiraKey: null,
      color: "#57C98A",
      summary:
        "Como testar, projetar para testabilidade e diagnosticar: fundamentos, dublês, TDD, " +
        "estratégia e debugging. A Story Debugging foi movida de Software Craft.",
      phase: "Fase 2 concluída (2026-09-03)",
      stories: [
        story({
          slug: "testing-fundamentals",
          order: 10,
          title: "Testing Fundamentals",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary: "O conceito e o porquê → o primitivo (Assertion) → como um teste é estruturado → a maquinaria de apoio → escopo crescente.",
          suggestions: ["Test Case", "Test Suite", "Setup / Teardown (mecânica do Fixture)", "Parameterized Tests", "Snapshot Testing"],
          tasks: [
            task({
              order: 10,
              title: "Unit Testing",
              requires: ["Programming Foundations / Programming Fundamentals"],
              revisit: ["Functional Programming / Pure Functions (alvo trivial)", "AI Engineering / AI Evaluation (offline eval ≈ teste)"],
            }),
            task({
              order: 20,
              title: "Assertion",
              isNew: true,
              note: "a verificação atômica: valor real × esperado; base de pass/fail",
              collision: "≠ assert / invariante em runtime (relacionado a Programming Foundations / Contract) — a asserção de teste roda no teste",
            }),
            task({ order: 30, title: "Arrange-Act-Assert", requires: ["Unit Testing", "Assertion"], note: "a estrutura de 3 fases de um teste" }),
            task({ order: 40, title: "Given-When-Then", requires: ["Unit Testing", "Assertion"], note: "a mesma estrutura de 3 fases, na fraseologia BDD — não depende de AAA" }),
            task({ order: 50, title: "Test Fixture", isNew: true, requires: ["Unit Testing"], note: "o estado/dado base fixo sobre o qual um teste roda" }),
            task({ order: 60, title: "Test Runner", isNew: true, requires: ["Unit Testing", "Assertion"], note: "a ferramenta que descobre, executa e reporta testes" }),
            task({
              order: 70,
              title: "Integration Testing",
              requires: ["Unit Testing"],
              note: "\"integração\" pressupõe \"unidades\"",
              collision: "≠ Continuous Integration (Platform / CI-CD)",
            }),
            task({ order: 80, title: "E2E Testing", requires: ["Integration Testing"], note: "o caso máximo de integração — sistema inteiro, ótica do usuário" }),
          ],
        }),
        story({
          slug: "test-doubles",
          order: 20,
          title: "Test Doubles",
          requires: ["Testing Fundamentals", "Programming Foundations / Programming Fundamentals / Interface"],
          summary:
            "Guarda-chuva → do mais inerte ao mais acoplado ao teste: dummy → stub → fake → spy → mock. " +
            "Todos dependem só de Test Doubles — a progressão é de complexidade, não de pré-requisito.",
          suggestions: ["Seam", "Mocking Framework", "Over-Mocking / Mock Hell", "Classicist vs Mockist (Chicago vs London)"],
          tasks: [
            task({
              order: 10,
              title: "Test Doubles",
              requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Interface"],
              note: "termo guarda-chuva (taxonomia de Meszaros)",
              collision: "nome da Story = nome desta Task — esta é a Task do conceito-guarda-chuva",
            }),
            task({ order: 20, title: "Dummy", isNew: true, requires: ["Test Doubles"], note: "objeto passado mas nunca usado — só preenche uma assinatura" }),
            task({ order: 30, title: "Stub", requires: ["Test Doubles"], note: "respostas prontas, sem verificação" }),
            task({
              order: 40,
              title: "Fake",
              requires: ["Test Doubles"],
              note: "implementação real porém simplificada (ex.: repositório em memória)",
              collision: "≠ Fake Model (AI Engineering / deck harness) — mesmo padrão, outro domínio",
            }),
            task({ order: 50, title: "Spy", requires: ["Test Doubles"], note: "registra chamadas para asserção posterior" }),
            task({
              order: 60,
              title: "Mock",
              requires: ["Test Doubles"],
              note: "pré-programado com expectativas; verifica interação. Conceitualmente próximo de Spy (registra + verifica) — relação, não Requires.",
              collision: "\"mock\" coloquial = qualquer dublê; aqui é o sentido preciso",
            }),
          ],
        }),
        story({
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
          tasks: [
            task({ order: 10, title: "Test-Driven Development", requires: ["Testing Fundamentals / Arrange-Act-Assert"], note: "disciplina test-first; por que TDD dirige o design; benefícios e custos" }),
            task({
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
        story({
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
          tasks: [
            task({
              order: 10,
              title: "Test Pyramid",
              requires: ["Testing Fundamentals / Integration Testing", "Testing Fundamentals / E2E Testing"],
              note: "como distribuir tipos de teste (unit ≫ integration ≫ e2e) — as camadas são esses tipos",
            }),
            task({
              order: 20,
              title: "Code Coverage",
              isNew: true,
              requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
              note: "% de código exercitado pelos testes. Cuidado com \"coverage as a target\" (Goodhart)",
              subtopics: ["line", "statement", "branch", "path coverage"],
              revisit: ["Platform / CI-CD (coverage gates)", "Software Craft / Code Review"],
            }),
            task({
              order: 30,
              title: "Testability",
              requires: ["Test Doubles", "Programming Foundations / Programming Fundamentals / Coupling"],
              note: "propriedades do código que permitem testá-lo (seams, injeção de dependência, poucos colaboradores)",
              revisit: ["Functional Programming / Pure Functions (o caso ideal)", "Software Design / Dependency Injection & IoC (DI é aplicação da testabilidade)"],
            }),
            task({
              order: 40,
              title: "Test Isolation",
              requires: ["Testing Fundamentals / Test Fixture", "Programming Foundations / Concurrency / Shared State"],
              note: "testes não dependem uns dos outros nem de estado compartilhado; ordem-agnósticos",
            }),
            task({
              order: 50,
              title: "Flaky Tests",
              requires: ["Test Isolation", "Programming Foundations / Concurrency / Race Condition"],
              note: "testes não determinísticos: corrida, tempo, ordem, rede",
            }),
            task({
              order: 60,
              title: "Regression Testing",
              requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
              note: "re-executar testes para impedir que bugs corrigidos voltem",
              revisit: ["AI Engineering / Regression Evaluation — análogo para modelos, escopo diferente"],
            }),
            task({
              order: 70,
              title: "Property-Based Testing",
              isNew: true,
              requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Contract"],
              note: "gerar muitas entradas a partir de propriedades/invariantes, em vez de exemplos",
              revisit: ["Functional Programming / Pure Functions (onde funciona melhor)"],
            }),
            task({
              order: 80,
              title: "Contract Testing",
              requires: ["Programming Foundations / Programming Fundamentals / Contract", "Testing Fundamentals / Integration Testing"],
              note: "provedor e consumidor concordam numa interface",
              collision: "≠ Contract (Epic 01 / PF) · ≠ API Contract (Platform / API)",
              revisit: ["Platform / API (API Contract)", "Architecture / Service Communication (consumer-driven contracts)"],
            }),
          ],
        }),
        story({
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
          tasks: [
            task({ order: 10, title: "Reproduction", requires: ["Testing Fundamentals / Unit Testing"], note: "tornar o bug confiável antes de investigar — um teste que falha é a repro ideal" }),
            task({ order: 20, title: "Hypothesis-Driven Debugging", requires: ["Reproduction"], note: "método científico: hipótese → previsão → teste" }),
            task({
              order: 30,
              title: "Stack Trace",
              requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
              note: "ler a pilha de chamadas no ponto da falha — é uma renderização do call stack",
              collision: "≠ Call Stack (Epic 01 / Memory & Runtime) · ≠ Stack ADT (Epic 01 / Data Structures)",
            }),
            task({
              order: 40,
              title: "Breakpoints",
              requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
              note: "pausar a execução para inspecionar estado/frames. Complementa Stack Trace",
            }),
            task({
              order: 50,
              title: "Binary Search Debugging",
              requires: ["Programming Foundations / Algorithms & Complexity / Binary Search", "Hypothesis-Driven Debugging"],
              note: "bisseccionar o espaço de código/entrada para localizar",
            }),
            task({
              order: 60,
              title: "Git Bisect",
              requires: ["Binary Search Debugging", "Epic 03 / Software Craft / Git (forward-reference aceita)"],
              note: "busca binária automatizada sobre o histórico de commits. Canônico aqui — Bisect no Epic 03 / Git é revisita/referência",
            }),
            task({
              order: 70,
              title: "Root Cause Analysis",
              requires: ["Hypothesis-Driven Debugging"],
              note: "ir além do sintoma; 5 Whys — teste de hipótese iterativo",
              revisit: ["Platform / Reliability Engineering — Postmortem, Blameless Postmortem, MTTD/MTTR"],
            }),
          ],
        }),
      ],
    }),

    // ─────────────────── 03–07 · EM ESTRUTURAÇÃO (Fase 1 apenas) ───────────────────
    epic({
      slug: "software-craft",
      order: 30,
      title: "Software Craft",
      status: "structuring",
      color: "#E0A458",
      phase: "Fase 1 aprovada — Fase 2 pendente",
      summary:
        "Disciplina diária de escrever e mudar código com segurança: clean code, heurísticas, code smells, " +
        "refactoring, error handling, code review, git, documentação.",
      plannedStories: [
        "Clean Code",
        "Design Heuristics",
        "Code Smells",
        "Refactoring",
        "Error Handling",
        "Code Review",
        "Dependency & Version Management",
        "Git",
        "Engineering Documentation",
      ],
    }),
    epic({
      slug: "software-design",
      order: 40,
      title: "Software Design",
      status: "structuring",
      color: "#9E7BE0",
      phase: "Fase 1 aprovada — Fase 2 pendente",
      summary:
        "Estrutura no nível de classe / módulo / domínio: OOD, SOLID, princípios, injeção de dependência, " +
        "design patterns, DDD.",
      plannedStories: [
        "Object-Oriented Design",
        "SOLID",
        "Design Principles",
        "Dependency Injection & IoC",
        "Creational Patterns",
        "Structural Patterns",
        "Behavioral Patterns",
        "Enterprise & Application Patterns",
        "Domain Modeling",
      ],
    }),
    epic({
      slug: "platform-engineering",
      order: 50,
      title: "Platform Engineering",
      status: "structuring",
      color: "#3FB6C6",
      phase: "Fase 1 aprovada — Fase 2 pendente",
      summary:
        "O substrato de execução: web, APIs, dados, caching, segurança, observabilidade, containers, CI/CD, " +
        "cloud, Kubernetes.",
      plannedStories: [
        "Web Fundamentals",
        "API Fundamentals",
        "GraphQL",
        "Database Fundamentals",
        "Database Design",
        "Database Transactions",
        "Database Performance",
        "NoSQL",
        "Caching",
        "Authentication",
        "Authorization",
        "Application Security",
        "Observability",
        "Performance Engineering",
        "Reliability Engineering",
        "Containers",
        "CI/CD",
        "Cloud Fundamentals",
        "Cloud Networking",
        "Cloud Security",
        "Kubernetes Fundamentals",
      ],
    }),
    epic({
      slug: "architecture-system-design",
      order: 60,
      title: "Architecture & System Design",
      status: "structuring",
      color: "#E36A74",
      phase: "Fase 1 aprovada — Fase 2 pendente",
      summary:
        "Sistemas que escalam, distribuem e evoluem: estilos, system design, escalabilidade, sistemas " +
        "distribuídos, mensageria, resiliência, padrões de dados.",
      plannedStories: [
        "Architecture Fundamentals",
        "Architectural Styles",
        "System Design Fundamentals",
        "Scalability",
        "Caching at Scale",
        "Availability & Reliability",
        "Distributed Systems Fundamentals",
        "Data Distribution",
        "Service Communication",
        "Messaging",
        "Resilience Patterns",
        "Distributed Transactions",
        "Data & Architecture Patterns",
        "Architecture Evolution",
      ],
    }),
    epic({
      slug: "ai-engineering",
      order: 70,
      title: "AI Engineering",
      status: "structuring",
      color: "#D96BA9",
      phase: "Fase 1 aprovada — Fase 2 pendente",
      summary:
        "A especialização: LLMs, prompting, context engineering, embeddings, retrieval, RAG, tool calling, " +
        "agentes, avaliação, safety, produção. Decks harness e ai-fundamentals serão resources aqui.",
      plannedStories: [
        "AI Fundamentals",
        "Language Models",
        "Model Inference",
        "Prompt Engineering",
        "Structured Generation",
        "Context Engineering",
        "Embeddings",
        "Vector Search",
        "Chunking",
        "Retrieval",
        "RAG",
        "Tool Calling",
        "MCP",
        "Agent Fundamentals",
        "Agent Orchestration",
        "AI Memory",
        "Multi-Agent Systems",
        "Model Routing",
        "AI Evaluation",
        "AI Safety & Guardrails",
        "AI Observability",
        "Model Adaptation",
        "Production AI",
      ],
    }),
  ];
})();
