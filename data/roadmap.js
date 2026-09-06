/*
 * Roadmap Senior — árvore Epic → Story → Task (interface: Área → Módulo → Conceito).
 *
 * FONTE DA VERDADE: roadmap/00-overview.md (Fase 1) + roadmap/01-programming-foundations.md,
 * roadmap/02-testing-quality-engineering.md, roadmap/03-software-craft.md,
 * roadmap/04-software-design.md e roadmap/05-platform-engineering.md (Fase 2). Este
 * arquivo reflete exatamente a estrutura aprovada — não reorganizar conteúdo, não
 * alterar Requires, não criar Tasks aqui.
 * Alterações de estrutura passam pelos arquivos de roadmap primeiro.
 *
 * Epics 01–05: Fase 2 concluída → navegáveis até Conceito.
 * Epics 06–07: Fase 1 apenas → visíveis, "em estruturação", sem drill-down.
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

    // ─────────────────────────── 03 · SOFTWARE CRAFT ───────────────────────────
    epic({
      slug: "software-craft",
      order: 30,
      title: "Software Craft",
      jiraKey: null,
      color: "#E0A458",
      summary:
        "Disciplina diária de escrever e mudar código com segurança: clean code, heurísticas, code smells, " +
        "refactoring, error handling, code review, dependências, git, documentação.",
      phase: "Fase 2 concluída (2026-09-05)",
      stories: [
        story({
          slug: "clean-code",
          order: 10,
          title: "Clean Code",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Vocabulário e legibilidade (Naming) → tamanho e responsabilidade da função → argumentos e early " +
            "return → quando comentar → números mágicos. Pure Functions/Side Effects/Immutability removidas " +
            "(canônico em Programming Foundations / Functional Programming).",
          tasks: [
            task({ order: 10, title: "Naming", note: "vocabulário/legibilidade — ponto de entrada da Story" }),
            task({ order: 20, title: "Functions", note: "tamanho, responsabilidade única no nível de função" }),
            task({ order: 30, title: "Function Arguments", requires: ["Functions"], note: "aridade, ordem, flags booleanas" }),
            task({
              order: 40,
              title: "Guard Clauses",
              requires: ["Functions"],
              note: "early return — revisita Programming Foundations / Type Systems / Type Narrowing (mecanismo de tipos lá, estilo de código aqui)",
              collision: "≠ Type Narrowing (Programming Foundations / Type Systems) — mecanismo de type system × estilo de código",
            }),
            task({ order: 50, title: "Comments", note: "quando comentar (e quando não)" }),
            task({
              order: 60,
              title: "Magic Numbers",
              note: "extrair para constantes nomeadas. Inclui a técnica \"substituir por constante\" — não vira Task própria (ver Refactoring)",
            }),
          ],
        }),
        story({
          slug: "design-heuristics",
          order: 20,
          title: "Design Heuristics",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary: "Paralela a Clean Code — heurísticas de design que não dependem dela. DRY → KISS → YAGNI → Principle of Least Astonishment.",
          tasks: [
            task({ order: 10, title: "DRY", note: "Don't Repeat Yourself" }),
            task({ order: 20, title: "KISS", note: "Keep It Simple" }),
            task({
              order: 30,
              title: "YAGNI",
              note: "You Aren't Gonna Need It — ver colisão conceitual com Speculative Generality (Code Smells, não incluída como Task)",
            }),
            task({ order: 40, title: "Principle of Least Astonishment", note: "o código não deve surpreender quem lê" }),
          ],
        }),
        story({
          slug: "code-smells",
          order: 30,
          title: "Code Smells",
          requires: ["Clean Code", "Design Heuristics"],
          summary: "Reconhecer violações concretas dos princípios já ensinados: duplicação, tamanho, acoplamento, coesão, uso de primitivos.",
          suggestions: ["Dead Code", "Shotgun Surgery", "Divergent Change", "Data Clumps", "Speculative Generality (≈ YAGNI)"],
          tasks: [
            task({
              order: 10,
              title: "Duplicate Code",
              requires: ["Design Heuristics / DRY"],
              note: "o smell = a violação visível do princípio",
              collision: "≠ DRY (Design Heuristics) — manifestação concreta × princípio abstrato",
            }),
            task({ order: 20, title: "Long Method", note: "função grande demais para entender de uma vez" }),
            task({
              order: 30,
              title: "Long Parameter List",
              note: "relaciona-se com Function Arguments (Clean Code) e Introduce Parameter Object (Refactoring) — trio intencional: escrever bem → reconhecer violação → corrigir",
            }),
            task({
              order: 40,
              title: "Large Class",
              requires: ["Programming Foundations / Programming Fundamentals / Cohesion"],
              note: "sintoma concreto de baixa coesão",
            }),
            task({
              order: 50,
              title: "Feature Envy",
              requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
              note: "sintoma concreto de acoplamento excessivo",
            }),
            task({ order: 60, title: "Primitive Obsession", note: "usar primitivos onde um tipo/objeto próprio comunicaria melhor a intenção" }),
          ],
        }),
        story({
          slug: "refactoring",
          order: 40,
          title: "Refactoring",
          requires: ["Code Smells", "Testing & Quality Engineering"],
          summary:
            "Guarda-chuva (o que é refatorar, quando/quando não) → técnicas mecânicas específicas, muitas delas " +
            "corrigindo os smells já diagnosticados. Só se refatora com segurança havendo rede de testes.",
          tasks: [
            task({
              order: 10,
              title: "Refactoring",
              isNew: true,
              note: "guarda-chuva: transformação que preserva comportamento; \"duas camadas\" (adicionar feature × refatorar), por que fazer, quando não fazer",
            }),
            task({ order: 20, title: "Extract Function", requires: ["Refactoring"] }),
            task({ order: 30, title: "Extract Variable", requires: ["Refactoring"] }),
            task({ order: 40, title: "Rename", requires: ["Refactoring"] }),
            task({
              order: 50,
              title: "Inline Function",
              requires: ["Refactoring"],
              note: "operação inversa de Extract Function — ensinada em par por ordem de estudo, não por Requires",
            }),
            task({
              order: 60,
              title: "Extract Class",
              requires: ["Code Smells / Large Class"],
              note: "corrige a baixa coesão diagnosticada por Large Class",
            }),
            task({ order: 70, title: "Move Function", requires: ["Refactoring"] }),
            task({
              order: 80,
              title: "Replace Nested Conditional with Guard Clauses",
              requires: ["Clean Code / Guard Clauses"],
              note: "a técnica mecânica que produz o estilo já ensinado em Clean Code",
            }),
            task({
              order: 90,
              title: "Replace Conditional with Polymorphism",
              requires: ["Programming Foundations / Programming Fundamentals / Polymorphism"],
              note: "aplica o mecanismo já ensinado em Programming Foundations",
            }),
            task({
              order: 100,
              title: "Introduce Parameter Object",
              requires: ["Code Smells / Long Parameter List"],
              note: "corrige o smell diagnosticado antes",
            }),
            task({
              order: 110,
              title: "Refactoring with Tests",
              requires: ["Testing & Quality Engineering / Testing Fundamentals"],
              note: "fecha a Story: só se refatora com segurança havendo rede de testes",
            }),
          ],
        }),
        story({
          slug: "error-handling",
          order: 50,
          title: "Error Handling",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Framing agnóstico (erro × exceção) → mecanismo → propagação → tipos com significado → postura " +
            "defensiva → erro como valor → contenção da falha.",
          tasks: [
            task({
              order: 10,
              title: "Errors vs Exceptions",
              isNew: true,
              note: "framing agnóstico de linguagem: erro (conceito) × exceção (mecanismo específico)",
            }),
            task({ order: 20, title: "Exceptions", requires: ["Errors vs Exceptions"], note: "throw/catch, hierarquia de exceções" }),
            task({
              order: 30,
              title: "Error Propagation",
              requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
              note: "o erro sobe pela pilha de chamadas",
            }),
            task({ order: 40, title: "Custom Errors", requires: ["Exceptions"], note: "tipos de erro com significado de domínio" }),
            task({
              order: 50,
              title: "Fail Fast",
              requires: ["Programming Foundations / Programming Fundamentals / Contract"],
              note: "pré-condição violada → falhar imediatamente",
            }),
            task({
              order: 60,
              title: "Result Pattern",
              note: "erro como valor de retorno explícito, não efeito colateral — revisita Programming Foundations / Functional Programming (Side Effects/Pure Functions)",
            }),
            task({
              order: 70,
              title: "Error Boundaries",
              note: "conter a falha para não propagar em cascata — definição agnóstica de framework. Ponte futura para Architecture / Resilience Patterns (sem Requires — Epic 06 ainda não aprovado)",
            }),
          ],
        }),
        story({
          slug: "code-review",
          order: 60,
          title: "Code Review",
          requires: ["Clean Code"],
          summary: "Guarda-chuva (o que é, por que é gate de qualidade) → as lentes de avaliação → escopo do PR → a camada humana de comunicação.",
          tasks: [
            task({ order: 10, title: "Code Review", requires: ["Clean Code"], isNew: true, note: "guarda-chuva: o que é, por que é gate de qualidade" }),
            task({
              order: 20,
              title: "Review Dimensions",
              requires: ["Code Review"],
              note: "consolida 5 Tasks do rascunho original (\"Review for Correctness/Readability/Maintainability/Testability/Security\") — revisita Testing & Quality Engineering / Testing Strategy / Testability (uma das lentes)",
              subtopics: ["Correctness", "Readability", "Maintainability", "Testability", "Security"],
              collision: "≠ Testability (Testing & Quality Engineering / Testing Strategy) — uma lente de revisão × a propriedade em si",
            }),
            task({ order: 30, title: "Review Scope", requires: ["Code Review"], note: "tamanho/foco de um PR — mudanças de propósito único" }),
            task({ order: 40, title: "Giving & Receiving Feedback", requires: ["Code Review"], note: "camada de comunicação/soft-skill" }),
          ],
        }),
        story({
          slug: "dependency-version-management",
          order: 70,
          title: "Dependency & Version Management",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Custo de atalhos (Technical Debt) e código de risco (Legacy Code) → comunicar mudança com segurança " +
            "(SemVer, Backward Compatibility, Deprecation) → gerenciar dependências de terceiros → migrar com segurança.",
          tasks: [
            task({ order: 10, title: "Technical Debt", note: "custo de atalhos — framing da Story" }),
            task({
              order: 20,
              title: "Legacy Code",
              note: "código difícil/arriscado de mudar com segurança, geralmente sem dono claro ou contexto original preservado. A associação de Feathers (\"código legado = código sem testes\") é citada como lente, não como definição universal",
            }),
            task({ order: 30, title: "Semantic Versioning", note: "MAJOR.MINOR.PATCH e o que cada um comunica" }),
            task({ order: 40, title: "Backward Compatibility", requires: ["Semantic Versioning"], note: "a propriedade que SemVer protege/comunica" }),
            task({ order: 50, title: "Deprecation", requires: ["Backward Compatibility"], note: "processo de retirar algo preservando compatibilidade" }),
            task({
              order: 60,
              title: "Dependency Management",
              isNew: true,
              requires: ["Semantic Versioning"],
              note: "gerenciar versões/dependências de terceiros: lockfiles, ranges de versão, grafo de dependências",
            }),
            task({
              order: 70,
              title: "Incremental Migration",
              requires: ["Legacy Code", "Backward Compatibility"],
              note: "capstone: técnica para evoluir código legado/dependências com segurança",
            }),
          ],
        }),
        story({
          slug: "git",
          order: 80,
          title: "Git",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Commit como unidade atômica → operações que combinam histórico (Merge/Rebase) → variações e " +
            "recuperação → localizar regressões (revisita) → workflow de equipe.",
          tasks: [
            task({ order: 10, title: "Commit", note: "unidade atômica de histórico, boas mensagens" }),
            task({ order: 20, title: "Merge", requires: ["Commit"] }),
            task({ order: 30, title: "Rebase", requires: ["Commit"], note: "contraste direto com Merge" }),
            task({
              order: 40,
              title: "Interactive Rebase",
              requires: ["Rebase"],
              note: "inclui Squash como caso de uso — não vira Task própria",
            }),
            task({
              order: 50,
              title: "Merge Conflicts",
              requires: ["Commit"],
              note: "colisão entre mudanças registradas em commits; pré-requisito conceitual mínimo é Commit (mesmo padrão de Merge/Rebase/Cherry-pick/Revert/Reset) — Merge e Rebase são onde o conflito aparece na prática (ordem de estudo, não Requires)",
            }),
            task({ order: 60, title: "Cherry-pick", requires: ["Commit"] }),
            task({ order: 70, title: "Revert", requires: ["Commit"], note: "desfazer seguro/público — ensinar em par com Reset" }),
            task({ order: 80, title: "Reset", requires: ["Commit"], note: "desfazer local/mutável — ensinar em par com Revert" }),
            task({ order: 90, title: "Reflog", requires: ["Reset"], note: "rede de segurança para recuperar de Reset/Rebase mal feitos" }),
            task({
              order: 100,
              title: "Git Bisect",
              requires: ["Testing & Quality Engineering / Debugging / Git Bisect"],
              canonical: false,
              revisitOf: "Testing & Quality Engineering / Debugging / Git Bisect",
              note: "não é uma 2ª Task canônica — só ponteiro/referência, mesmo padrão de Call Stack em Asynchronous Programming",
            }),
            task({
              order: 110,
              title: "Branching Strategies",
              requires: ["Merge", "Rebase"],
              note: "capstone — trunk-based × git-flow, no nível de workflow de equipe",
            }),
          ],
        }),
        story({
          slug: "engineering-documentation",
          order: 90,
          title: "Engineering Documentation",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary: "Do ponto de entrada de um repositório até a documentação operacional: README → Changelog → ADR → RFC → Runbook.",
          suggestions: ["API Documentation (Platform / API Fundamentals, futuro)"],
          tasks: [
            task({ order: 10, title: "README", note: "ponto de entrada de um repositório/projeto" }),
            task({ order: 20, title: "Changelog", note: "registro por mudança" }),
            task({ order: 30, title: "ADR", note: "Architecture Decision Record — registro por decisão" }),
            task({ order: 40, title: "RFC", note: "proposta pré-decisão para mudanças maiores" }),
            task({
              order: 50,
              title: "Runbook",
              note: "documentação operacional. Ponte futura para Platform / Reliability Engineering (Postmortem) — sem Requires (Epic 05 ainda não aprovado)",
            }),
          ],
        }),
      ],
    }),
    // ─────────────────────────── 04 · SOFTWARE DESIGN ───────────────────────────
    epic({
      slug: "software-design",
      order: 40,
      title: "Software Design",
      jiraKey: null,
      color: "#9E7BE0",
      summary:
        "Estrutura no nível de classe / módulo / domínio: OOD, SOLID, princípios de design, injeção de " +
        "dependência, catálogos GoF (versão enxuta) e domain modeling. Extraído de Design & Fundamentals.",
      phase: "Fase 2 concluída (2026-09-05)",
      stories: [
        story({
          slug: "object-oriented-design",
          order: 10,
          title: "Object-Oriented Design",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Instância × classe → identidade (pré-requisito de Entity/Value Object) → os dois tipos de objeto " +
            "de domínio → estilo de interação (Tell Don't Ask, Law of Demeter) → anêmico × rico.",
          suggestions: ["Modularity / Encapsulation Boundaries (module / package / service) — já é SUGESTÃO no Epic 01"],
          tasks: [
            task({ order: 10, title: "Object vs Class", note: "instância × definição — ponto de entrada da Story" }),
            task({
              order: 20,
              title: "Identity",
              requires: ["Object vs Class"],
              note: "o que faz dois objetos serem \"o mesmo\" — reordenada para antes de Entity/Value Object (Requires real)",
            }),
            task({ order: 30, title: "Entity", requires: ["Identity"], note: "objeto definido pela identidade que persiste no tempo, ainda que os atributos mudem" }),
            task({ order: 40, title: "Value Object", requires: ["Identity"], note: "definido por contraste — igualdade por valor, sem identidade própria" }),
            task({
              order: 50,
              title: "Mutable vs Immutable Objects",
              requires: ["Programming Foundations / Functional Programming / Immutability"],
              note: "aplica o conceito de Immutability (Epic 01) a objetos com estado",
            }),
            task({
              order: 60,
              title: "Tell, Don't Ask",
              note: "estilo de interação entre objetos — revisita informalmente Encapsulation (Epic 01), sem Requires estrito",
            }),
            task({
              order: 70,
              title: "Law of Demeter (Principle of Least Knowledge)",
              requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
              note: "consolida os dois nomes (sinônimos na literatura) — regra concreta para minimizar acoplamento entre objetos",
              collision: "Law of Demeter = Principle of Least Knowledge — mesma coisa, dois nomes",
            }),
            task({ order: 80, title: "Anemic Domain Model", requires: ["Entity"], note: "modelo onde o objeto só guarda dados, sem comportamento" }),
            task({ order: 90, title: "Rich Domain Model", requires: ["Anemic Domain Model"], note: "contraste direto — objeto com dados + comportamento" }),
          ],
        }),
        story({
          slug: "solid",
          order: 20,
          title: "SOLID",
          requires: ["Object-Oriented Design"],
          summary:
            "SRP e OCP (heurísticas independentes) → LSP, ISP, DIP, cada um revisitando um mecanismo canônico do " +
            "Epic 01. DIP fecha a Story e abre Dependency Injection & IoC.",
          tasks: [
            task({
              order: 10,
              title: "Single Responsibility Principle (SRP)",
              note: "uma razão para mudar. Aplica informalmente Cohesion (Epic 01) — sem Requires estrito, é heurística própria",
            }),
            task({ order: 20, title: "Open/Closed Principle (OCP)", note: "aberto para extensão, fechado para modificação" }),
            task({
              order: 30,
              title: "Liskov Substitution Principle (LSP)",
              requires: [
                "Programming Foundations / Programming Fundamentals / Inheritance",
                "Programming Foundations / Programming Fundamentals / Polymorphism",
              ],
              note: "substitutabilidade de subtipos — definida sobre esses dois mecanismos, não dá para entender sem eles",
            }),
            task({
              order: 40,
              title: "Interface Segregation Principle (ISP)",
              requires: ["Programming Foundations / Programming Fundamentals / Interface"],
              note: "interfaces enxutas e coesas",
            }),
            task({
              order: 50,
              title: "Dependency Inversion Principle (DIP)",
              requires: ["Programming Foundations / Programming Fundamentals / Interface"],
              note: "depender de abstrações, não de implementações concretas — fecha a Story e abre Dependency Injection & IoC",
            }),
          ],
        }),
        story({
          slug: "design-principles",
          order: 30,
          title: "Design Principles",
          requires: ["SOLID"],
          summary:
            "CQS → os dois princípios de \"depender do que varia / do contrato\" → Composition over Inheritance " +
            "(heurística realocada do Epic 01), que conecta com os catálogos GoF.",
          tasks: [
            task({ order: 10, title: "Command-Query Separation (CQS)", note: "um método pergunta OU muda estado, não os dois" }),
            task({
              order: 20,
              title: "Encapsulate What Varies",
              requires: ["Programming Foundations / Programming Fundamentals / Encapsulation"],
              note: "isolar o ponto de variação — aplica Encapsulation",
            }),
            task({
              order: 30,
              title: "Program to an Interface",
              requires: ["Programming Foundations / Programming Fundamentals / Interface"],
              note: "depender do contrato, não da implementação — revisita também Type Systems / Structural Typing (Epic 01)",
            }),
            task({
              order: 40,
              title: "Composition over Inheritance",
              requires: [
                "Programming Foundations / Programming Fundamentals / Composition",
                "Programming Foundations / Programming Fundamentals / Inheritance",
              ],
              note: "heurística realocada do Epic 01 — escolhe entre os dois mecanismos já ensinados",
            }),
          ],
        }),
        story({
          slug: "dependency-injection-and-ioc",
          order: 40,
          title: "Dependency Injection & IoC",
          requires: ["SOLID / Dependency Inversion Principle (DIP)"],
          summary:
            "O guarda-chuva (IoC) → a técnica (DI) → a forma concreta (Constructor Injection) → a automação " +
            "(Container) → o contraponto (Service Locator).",
          tasks: [
            task({ order: 10, title: "Inversion of Control (IoC)", note: "guarda-chuva: quem controla o fluxo e a criação de dependências" }),
            task({
              order: 20,
              title: "Dependency Injection",
              requires: ["Inversion of Control (IoC)"],
              note:
                "a técnica concreta — forma mais comum de aplicar IoC. DI é aplicação da testabilidade (via inversa já registrada no Epic 02), não o contrário",
              revisit: ["Testing & Quality Engineering / Testing Strategy / Testability"],
            }),
            task({ order: 30, title: "Constructor Injection", requires: ["Dependency Injection"], note: "a forma mais comum de DI" }),
            task({ order: 40, title: "Dependency Injection Container", requires: ["Dependency Injection"], note: "automatiza a montagem do grafo de dependências" }),
            task({
              order: 50,
              title: "Service Locator",
              requires: ["Dependency Injection"],
              note: "alternativa/anti-padrão comum a DI — ensinado em contraste",
            }),
          ],
        }),
        story({
          slug: "creational-patterns",
          order: 50,
          title: "Creational Patterns",
          requires: ["Design Principles"],
          summary:
            "Factory Method → Abstract Factory (único Requires interno) → Builder, Prototype, Singleton como " +
            "padrões independentes. Catálogo GoF sem cadeia entre famílias.",
          tasks: [
            task({ order: 10, title: "Factory Method" }),
            task({ order: 20, title: "Abstract Factory", requires: ["Factory Method"], note: "uma fábrica de factory methods relacionados — não dá para entender sem o anterior" }),
            task({ order: 30, title: "Builder" }),
            task({ order: 40, title: "Prototype" }),
            task({ order: 50, title: "Singleton" }),
          ],
        }),
        story({
          slug: "structural-patterns",
          order: 60,
          title: "Structural Patterns",
          requires: ["Design Principles"],
          summary:
            "Versão enxuta (7→5): Adapter, Decorator, Facade, Proxy, Composite. Requires só Design Principles — " +
            "a ordem GoF é sequência de estudo, não dependência.",
          suggestions: [
            "Bridge — clássico GoF, mas raro no dia a dia sênior (relacionado a Adapter)",
            "Flyweight — nicho: otimização de memória por compartilhamento de estado",
          ],
          tasks: [
            task({ order: 10, title: "Adapter" }),
            task({ order: 20, title: "Decorator" }),
            task({ order: 30, title: "Facade" }),
            task({ order: 40, title: "Proxy" }),
            task({ order: 50, title: "Composite", note: "relaciona-se com Data Structures / Tree (Epic 01) — aplicação, não Requires" }),
          ],
        }),
        story({
          slug: "behavioral-patterns",
          order: 70,
          title: "Behavioral Patterns",
          requires: ["Design Principles"],
          summary:
            "Versão enxuta (11→5): Strategy, Observer, Command, State, Template Method. Requires só Design " +
            "Principles. Chain of Responsibility fica como Advanced/Optional para reconsiderar no Epic 05 · Platform.",
          suggestions: [
            "Chain of Responsibility (Advanced/Optional — reconsiderar na Fase 2 do Epic 05 · Platform, pela relação com middleware)",
            "Iterator — hoje resolvido por built-ins de linguagem",
            "Mediator — reduz acoplamento centralizando comunicação, mas nicho",
            "Memento — uso raro fora de undo/redo",
            "Visitor — poderoso mas complexo; nível avançado",
            "Interpreter — muito nichado (parsers / DSLs)",
          ],
          tasks: [
            task({ order: 10, title: "Strategy" }),
            task({ order: 20, title: "Observer" }),
            task({ order: 30, title: "Command", collision: "≠ Command-Query Separation (Design Principles) — padrão de objeto que encapsula uma ação × princípio de separar leitura de escrita" }),
            task({
              order: 40,
              title: "State",
              requires: ["Strategy"],
              note: "estruturalmente idêntico a Strategy (troca de comportamento em runtime) — ensinado em par por contraste de intenção",
            }),
            task({ order: 50, title: "Template Method" }),
          ],
        }),
        story({
          slug: "enterprise-and-application-patterns",
          order: 80,
          title: "Enterprise & Application Patterns",
          requires: ["Dependency Injection & IoC", "Platform / Database Fundamentals"],
          summary:
            "Repository como base → Data Mapper × Active Record → Unit of Work → Service Layer → Specification e " +
            "DTO. Requires: Platform / Database Fundamentals — dependência formalizada na Fase 2 do Epic 05 (2026-09-05).",
          tasks: [
            task({ order: 10, title: "Repository Pattern", note: "abstrai o acesso a dados atrás de uma interface de coleção" }),
            task({ order: 20, title: "Data Mapper", requires: ["Repository Pattern"], note: "separa o objeto de domínio da forma como é persistido" }),
            task({ order: 30, title: "Active Record", requires: ["Repository Pattern"], note: "contraste direto com Data Mapper — o objeto que se persiste" }),
            task({ order: 40, title: "Unit of Work", requires: ["Repository Pattern"], note: "agrupa mudanças numa única transação lógica" }),
            task({
              order: 50,
              title: "Service Layer",
              requires: ["Dependency Injection & IoC / Dependency Injection"],
              note: "orquestra casos de uso; depende de injeção de colaboradores",
              collision: "≠ Domain Service (Domain Modeling) — camada de orquestração × comportamento de domínio puro",
            }),
            task({ order: 60, title: "Specification Pattern", note: "encapsula regra de negócio/consulta reutilizável e combinável" }),
            task({ order: 70, title: "DTO", note: "objeto de transporte de dados entre camadas/fronteiras" }),
          ],
        }),
        story({
          slug: "domain-modeling",
          order: 90,
          title: "Domain Modeling",
          requires: ["Object-Oriented Design"],
          summary:
            "Framing (Domain → Domain Model → Ubiquitous Language) → blocos de construção (Entity/Value Object " +
            "revisitados → Aggregate → Aggregate Root → Domain Service → Domain Event) → fronteiras (Bounded " +
            "Context → Context Mapping). Capstone e ponte para Architecture.",
          tasks: [
            task({ order: 10, title: "Domain", note: "framing da Story — o problema/negócio que o software modela" }),
            task({ order: 20, title: "Domain Model", requires: ["Domain"] }),
            task({ order: 30, title: "Ubiquitous Language", requires: ["Domain Model"], note: "vocabulário compartilhado entre dev e negócio" }),
            task({
              order: 40,
              title: "Entity",
              requires: ["Software Design / Object-Oriented Design / Entity"],
              canonical: false,
              revisitOf: "Software Design / Object-Oriented Design / Entity",
              note: "não é uma 2ª Task canônica — aqui ganha framing DDD: identidade dentro de um Bounded Context",
            }),
            task({
              order: 50,
              title: "Value Object",
              requires: ["Software Design / Object-Oriented Design / Value Object"],
              canonical: false,
              revisitOf: "Software Design / Object-Oriented Design / Value Object",
              note: "não é uma 2ª Task canônica — framing DDD",
            }),
            task({ order: 60, title: "Aggregate", requires: ["Entity", "Value Object"], note: "cluster de objetos tratado como uma unidade de consistência" }),
            task({ order: 70, title: "Aggregate Root", requires: ["Aggregate"], note: "a única porta de entrada do Aggregate" }),
            task({ order: 80, title: "Domain Service", requires: ["Domain Model"], note: "comportamento de domínio que não pertence a nenhuma Entity/Value Object" }),
            task({ order: 90, title: "Domain Event", requires: ["Domain Model"], note: "algo relevante que aconteceu no domínio" }),
            task({
              order: 100,
              title: "Bounded Context",
              requires: ["Ubiquitous Language"],
              note: "capstone — a fronteira dentro da qual o modelo (e a linguagem) é consistente",
            }),
            task({
              order: 110,
              title: "Context Mapping",
              requires: ["Bounded Context"],
              note: "capstone final — relação entre Bounded Contexts; ponte para Architecture / Architectural Styles",
            }),
          ],
        }),
      ],
    }),
    // ───────────────────────── 05 · PLATFORM ENGINEERING ─────────────────────────
    epic({
      slug: "platform-engineering",
      order: 50,
      title: "Platform Engineering",
      jiraKey: null,
      color: "#3FB6C6",
      summary:
        "O substrato de execução: web, APIs, GraphQL, bancos (fundamentos → modelagem → transações → " +
        "performance), NoSQL, caching, auth/authz, segurança, observabilidade, performance/confiabilidade, " +
        "containers, CI/CD, cloud, rede, segurança de cloud, Kubernetes.",
      phase: "Fase 2 concluída (2026-09-05) — FROZEN",
      stories: [
        story({
          slug: "web-fundamentals",
          order: 10,
          title: "Web Fundamentals",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Cliente-servidor → HTTP e componentes → evolução do protocolo → TLS → DNS → transporte → URL → " +
            "estado no cliente → SOP/CORS → canais persistentes. TLS é Task própria; HTTPS é subtopic de TLS.",
          tasks: [
            task({ order: 10, title: "Client-Server Model", note: "ponto de entrada" }),
            task({ order: 20, title: "HTTP", requires: ["Client-Server Model"], subtopics: ["request/response", "protocolo stateless"], note: "absorve Request & Response do rascunho" }),
            task({ order: 30, title: "HTTP Methods", requires: ["HTTP"], note: "GET/POST/PUT/PATCH/DELETE; safe & idempotent methods" }),
            task({ order: 40, title: "HTTP Status Codes", requires: ["HTTP"], note: "classes 1xx–5xx" }),
            task({ order: 50, title: "HTTP Headers", requires: ["HTTP"] }),
            task({
              order: 60,
              title: "HTTP Evolution (1.1 / 2 / 3)",
              requires: ["HTTP"],
              subtopics: ["HTTP/1.1: keep-alive, pipelining, head-of-line blocking", "HTTP/2: multiplexing, HPACK, server push", "HTTP/3: QUIC sobre UDP, 0-RTT, migração de conexão"],
              note: "consolidada (A1)",
            }),
            task({
              order: 70,
              title: "TLS",
              subtopics: ["HTTPS = HTTP sobre TLS", "handshake", "certificados e cadeia de confiança", "SNI", "HSTS"],
              note: "Task própria (decisão 4, exceção). Application Security / Encryption at Rest & in Transit aponta para cá",
              revisit: ["Platform / Application Security / Encryption at Rest & in Transit"],
            }),
            task({
              order: 80,
              title: "DNS",
              requires: ["Client-Server Model"],
              note: "resolução, registros, TTL de DNS",
              collision: "≠ TTL de cache (Caching) ≠ TTL de pacote IP",
            }),
            task({
              order: 90,
              title: "TCP vs UDP",
              subtopics: ["TCP: 3-way handshake, ordenação, retransmissão, controle de fluxo/congestão", "UDP: sem conexão, sem garantia, baixo overhead (DNS, streaming, QUIC)"],
              note: "consolidada (A2)",
            }),
            task({ order: 100, title: "URL Anatomy", note: "scheme/host/port/path/query/fragment" }),
            task({ order: 110, title: "Cookies", requires: ["HTTP Headers"], note: "atributos Secure/HttpOnly/SameSite" }),
            task({
              order: 120,
              title: "Sessions",
              requires: ["Cookies"],
              collision: "≠ Session-Based Authentication (Authentication) — mecanismo de estado × uso para identidade",
            }),
            task({ order: 130, title: "Same-Origin Policy", requires: ["URL Anatomy"] }),
            task({ order: 140, title: "CORS", requires: ["Same-Origin Policy"], note: "preflight, headers Access-Control-*" }),
            task({
              order: 150,
              title: "WebSocket",
              requires: ["HTTP Headers"],
              note: "canal full-duplex — revisita Programming Foundations / Asynchronous Programming (event loop)",
              revisit: ["Programming Foundations / Asynchronous Programming"],
            }),
            task({
              order: 160,
              title: "Server-Sent Events (SSE)",
              requires: ["HTTP"],
              note: "streaming — revisita Programming Foundations / Asynchronous Programming / Promise. AI Engineering / Model Inference / Streaming aponta para cá",
              revisit: ["Programming Foundations / Asynchronous Programming / Promise", "AI Engineering / Model Inference / Streaming"],
            }),
          ],
        }),
        story({
          slug: "api-fundamentals",
          order: 20,
          title: "API Fundamentals",
          requires: ["Web Fundamentals"],
          summary:
            "O que é API → contrato → REST → recursos e URLs → validar o contrato de entrada → resposta e erro → " +
            "paginação/filtro/ordenação → idempotência e rate limiting → versionamento/deprecação → OpenAPI → " +
            "middleware. Idempotency Key e Rate Limiting canônicos aqui (mudança não silenciosa vs Fase 1).",
          tasks: [
            task({ order: 10, title: "API" }),
            task({
              order: 20,
              title: "API Contract",
              requires: ["Programming Foundations / Programming Fundamentals / Contract"],
              note: "aplica Contract (pré/pós-condições) a fronteira de serviço; Testing & Quality Engineering / Contract Testing verifica isto",
              revisit: ["Programming Foundations / Programming Fundamentals / Contract", "Testing & Quality Engineering / Testing Strategy / Contract Testing"],
            }),
            task({ order: 30, title: "REST", requires: ["API"], note: "restrições REST, HATEOAS (menção), maturidade de Richardson" }),
            task({ order: 40, title: "Resource Modeling & RESTful URLs", requires: ["REST"], subtopics: ["recursos como substantivos", "coleção × item", "aninhamento/hierarquia", "path × query param"], note: "consolidada (A15)" }),
            task({
              order: 50,
              title: "Request Validation",
              requires: ["REST"],
              note: "validação do contrato/boundary da API: shape, tipos, campos obrigatórios, formato. Pointer para Application Security / Input Validation (não revisitOf)",
              collision: "≠ Application Security / Input Validation — validar o contrato de API × defender contra entrada maliciosa (conceitos distintos)",
              revisit: ["Platform / Application Security / Input Validation"],
            }),
            task({ order: 60, title: "Response Design", requires: ["REST"], note: "envelope, status coerente, Location em criação" }),
            task({
              order: 70,
              title: "Error Response Design",
              requires: ["Response Design"],
              note: "revisita Software Craft / Error Handling / Result Pattern; RFC 7807 (problem+json)",
              revisit: ["Software Craft / Error Handling / Result Pattern"],
            }),
            task({ order: 80, title: "Pagination (Offset / Cursor)", requires: ["Response Design"], subtopics: ["offset/limit: simples, page drift, custo de página profunda", "cursor/keyset: estável, sem página N, requer ordenação total"], note: "consolidada (A3)" }),
            task({ order: 90, title: "Filtering & Sorting", requires: ["Response Design"], subtopics: ["operadores de filtro", "ordenação multi-campo", "whitelist de campos ordenáveis"], note: "consolidada (A16)" }),
            task({
              order: 100,
              title: "Idempotency Key",
              requires: ["Web Fundamentals / HTTP Methods"],
              note: "canônico — mecânica HTTP (header + store de dedup + replay de resposta; retry seguro de POST). Mudança não silenciosa vs Fase 1 (que dizia 'Platform/API referencia')",
              collision: "≠ Idempotency conceito de resiliência (Architecture / Resilience Patterns)",
            }),
            task({
              order: 110,
              title: "Rate Limiting",
              subtopics: ["token bucket", "leaky bucket", "janela fixa/deslizante"],
              note: "canônico — 429 + Retry-After + headers de quota. Mudança não silenciosa vs Fase 1 (que colocava em Architecture / Resilience Patterns). Architecture e AI Engineering revisitam",
              collision: "≠ Query Complexity (GraphQL) ≠ Throttle client-side (Performance Engineering)",
            }),
            task({
              order: 120,
              title: "API Versioning",
              requires: ["API Contract"],
              note: "revisita Software Craft / Semantic Versioning, Backward Compatibility (URL vs header vs media type)",
              revisit: ["Software Craft / Dependency & Version Management / Semantic Versioning", "Software Craft / Dependency & Version Management / Backward Compatibility"],
            }),
            task({
              order: 130,
              title: "API Deprecation",
              requires: ["API Versioning"],
              note: "revisita Software Craft / Deprecation (sunset headers, janelas de migração)",
              revisit: ["Software Craft / Dependency & Version Management / Deprecation"],
            }),
            task({
              order: 140,
              title: "OpenAPI",
              requires: ["API Contract"],
              note: "spec-as-doc, Swagger UI, contract-first — absorve o SUGESTÃO 'API Documentation' deixado pelo Epic 03",
            }),
            task({
              order: 150,
              title: "Middleware / Request Pipeline",
              requires: ["API"],
              isNew: true,
              note: "cadeia de handlers (auth, logging, rate limiting, validação) antes do controller. Ancora o Chain of Responsibility que o Epic 04 deixou como Advanced/Optional — o pattern continua SUGESTÃO no Epic 04, não é movido",
              revisit: ["Software Design / Behavioral Patterns / Chain of Responsibility (SUGESTÃO)"],
            }),
          ],
        }),
        story({
          slug: "graphql",
          order: 30,
          title: "GraphQL",
          requires: ["API Fundamentals"],
          summary:
            "Schema & type system → operações raiz → resolver → N+1 em resolvers (revisita de Database Performance) → " +
            "batching & per-request caching → query complexity → GraphQL vs REST. Versão enxuta (18→7).",
          suggestions: [
            "Arguments, Variables, Fragments, Interfaces, Unions, Persisted Queries, Error Handling — retirados no trimming",
          ],
          tasks: [
            task({ order: 10, title: "GraphQL Schema & Type System", subtopics: ["SDL", "scalars/object/enum/input types", "nullability", "schema como contrato"], note: "consolidada (A13) — absorve Nullability" }),
            task({ order: 20, title: "Query / Mutation / Subscription", requires: ["GraphQL Schema & Type System"], subtopics: ["query (leitura)", "mutation (escrita)", "subscription (tempo real — revisita WebSocket)"], note: "consolidada (A14)" }),
            task({ order: 30, title: "Resolver", requires: ["GraphQL Schema & Type System"], note: "função por campo; resolver chain" }),
            task({
              order: 40,
              title: "N+1 in Resolvers",
              requires: ["Resolver"],
              canonical: false,
              revisitOf: "Platform / Database Performance / N+1 Query Problem",
              note: "manifestação GraphQL (resolver dispara 1 query por item); GraphQL revisita, não cria 2ª canônica",
            }),
            task({ order: 50, title: "Batching & Per-Request Caching", requires: ["N+1 in Resolvers"], subtopics: ["DataLoader"], note: "estratégia vendor-agnostic de mitigação do N+1: batching + cache por request" }),
            task({ order: 60, title: "Query Complexity", requires: ["Resolver"], note: "custo/profundidade, limites, timeout — superfície de ataque DoS" }),
            task({ order: 70, title: "GraphQL vs REST", requires: ["API Fundamentals / REST", "GraphQL Schema & Type System"], note: "quando cada um; over/under-fetching; caching; tooling" }),
          ],
        }),
        story({
          slug: "database-fundamentals",
          order: 40,
          title: "Database Fundamentals",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Modelo relacional → SQL → tabela/keys/constraint → JOIN → agregações → subqueries & CTEs → schema. " +
            "Confirma a dependência formal de Software Design / Enterprise & Application Patterns.",
          tasks: [
            task({ order: 10, title: "Relational Database", note: "modelo relacional, tuplas/relações" }),
            task({ order: 20, title: "SQL", requires: ["Relational Database"], note: "DDL/DML/DQL" }),
            task({ order: 30, title: "Table", requires: ["Relational Database"], note: "a unidade que PK/FK/Constraint referenciam" }),
            task({ order: 40, title: "Primary Key", requires: ["Table"], collision: "≠ Natural vs Surrogate Key (Database Design) — que discute a escolha" }),
            task({ order: 50, title: "Foreign Key", requires: ["Primary Key"], note: "integridade referencial" }),
            task({ order: 60, title: "Constraint", requires: ["Table"], note: "NOT NULL, UNIQUE, CHECK, DEFAULT" }),
            task({ order: 70, title: "JOIN", requires: ["Foreign Key"], subtopics: ["INNER", "LEFT/RIGHT OUTER", "FULL OUTER", "CROSS", "self-join"], note: "consolidada (A17)" }),
            task({ order: 80, title: "Aggregate Functions & GROUP BY", requires: ["SQL"], subtopics: ["COUNT/SUM/AVG/MIN/MAX", "GROUP BY", "HAVING × WHERE"], note: "consolidada (A18)" }),
            task({ order: 90, title: "Subqueries & CTEs", requires: ["SQL"], subtopics: ["correlacionada × não-correlacionada", "WITH", "CTE recursiva (menção)"], note: "consolidada (§D) — absorve CTE do rascunho" }),
            task({
              order: 100,
              title: "Database Schema",
              requires: ["Table", "Constraint"],
              collision: "≠ Schema-on-Read (NoSQL) ≠ GraphQL Schema ≠ JSON Schema (AI Engineering)",
            }),
          ],
        }),
        story({
          slug: "database-design",
          order: 50,
          title: "Database Design",
          requires: ["Database Fundamentals"],
          summary:
            "Data modeling → cardinalidade → normalização → normal forms → denormalização → chave natural × " +
            "surrogate → migração.",
          tasks: [
            task({
              order: 10,
              title: "Data Modeling",
              requires: ["Database Fundamentals / Database Schema"],
              note: "conceitual → lógico → físico. Revisita Software Design / Domain Modeling / Entity (Entity de domínio vira tabela)",
              revisit: ["Software Design / Domain Modeling / Entity"],
            }),
            task({ order: 20, title: "Relationship Cardinality (1:1 / 1:N / N:M)", requires: ["Database Fundamentals / Foreign Key"], subtopics: ["1:1 (quando faz sentido)", "1:N (FK no lado 'muitos')", "N:M (tabela de junção, atributos na junção)"], note: "consolidada (A4)" }),
            task({ order: 30, title: "Normalization", requires: ["Relationship Cardinality (1:1 / 1:N / N:M)"], note: "anomalias de inserção/atualização/remoção" }),
            task({ order: 40, title: "Normal Forms (1NF / 2NF / 3NF)", requires: ["Normalization"], subtopics: ["1NF: valores atômicos", "2NF: sem dependência parcial da PK", "3NF: sem dependência transitiva", "BCNF (menção)"], note: "consolidada (A5)" }),
            task({ order: 50, title: "Denormalization", requires: ["Normal Forms (1NF / 2NF / 3NF)"], note: "trade-off leitura × escrita/consistência — mesma tensão de Caching", revisit: ["Platform / Caching"] }),
            task({ order: 60, title: "Natural vs Surrogate Key", requires: ["Database Fundamentals / Primary Key"], note: "UUID vs auto-incremento; implicações de índice" }),
            task({
              order: 70,
              title: "Database Migration",
              requires: ["Database Fundamentals / Database Schema"],
              note: "migrations versionadas, forward-only, expand/contract — revisita Software Craft / Incremental Migration",
              revisit: ["Software Craft / Dependency & Version Management / Incremental Migration"],
            }),
          ],
        }),
        story({
          slug: "database-transactions",
          order: 60,
          title: "Database Transactions",
          requires: ["Database Fundamentals"],
          summary:
            "Transaction → ACID (A/C/D consolidados; Isolation separada) → isolation levels → read phenomena → " +
            "optimistic × pessimistic locking.",
          tasks: [
            task({
              order: 10,
              title: "Transaction",
              requires: ["Database Fundamentals / SQL"],
              note: "BEGIN/COMMIT/ROLLBACK; unidade de trabalho. Software Design / Enterprise Patterns / Unit of Work abstrai isto (pointer)",
              revisit: ["Software Design / Enterprise & Application Patterns / Unit of Work"],
            }),
            task({
              order: 20,
              title: "ACID (A / C / D)",
              requires: ["Transaction"],
              subtopics: ["Atomicity", "Consistency (ACID) — subtopic nomeado, endereçável para a colisão", "Durability"],
              note: "consolidada (A7 + C6). Isolation fica Task própria",
              collision: "Consistency (ACID) ≠ Distributed Consistency (Architecture); Atomicity ≠ Atomic Operation (Programming Foundations / Concurrency)",
            }),
            task({ order: 30, title: "Isolation", requires: ["ACID (A / C / D)"], note: "por que o 'I' é separado — é o que se relaxa na prática" }),
            task({ order: 40, title: "Isolation Levels", requires: ["Isolation"], note: "Read Uncommitted → Serializable; trade-off com throughput" }),
            task({ order: 50, title: "Read Phenomena (Dirty / Non-Repeatable / Phantom)", requires: ["Isolation Levels"], subtopics: ["dirty read", "non-repeatable read", "phantom read", "matriz 'qual nível previne qual'"], note: "consolidada (A6)" }),
            task({
              order: 60,
              title: "Optimistic Locking",
              requires: ["Isolation"],
              note: "versão/timestamp, retry em conflito — revisita Programming Foundations / Concurrency / Race Condition",
              revisit: ["Programming Foundations / Concurrency / Race Condition"],
            }),
            task({
              order: 70,
              title: "Pessimistic Locking",
              requires: ["Isolation"],
              note: "SELECT … FOR UPDATE, ordem de lock — revisita Programming Foundations / Concurrency / Deadlock",
              revisit: ["Programming Foundations / Concurrency / Deadlock"],
            }),
          ],
        }),
        story({
          slug: "database-performance",
          order: 70,
          title: "Database Performance",
          requires: ["Database Design"],
          summary:
            "Index (+ selectivity) → composite index → query plan → query optimization → N+1 Query Problem " +
            "(canônico do roadmap) → connection pool → slow query analysis.",
          tasks: [
            task({
              order: 10,
              title: "Index",
              requires: ["Database Fundamentals / Database Schema"],
              subtopics: ["Index Selectivity — cardinalidade, quando um índice não ajuda"],
              note: "B-tree × hash index — revisita Programming Foundations / Data Structures / BST, Hash Table (absorve o B-Tree só citado antes)",
              revisit: ["Programming Foundations / Data Structures / Binary Search Tree", "Programming Foundations / Data Structures / Hash Table"],
            }),
            task({ order: 20, title: "Composite Index", requires: ["Index"], note: "regra do prefixo mais à esquerda; ordem das colunas" }),
            task({ order: 30, title: "Query Execution Plan", requires: ["Index"], note: "EXPLAIN; seq scan × index scan; estimativas do otimizador" }),
            task({ order: 40, title: "Query Optimization", requires: ["Query Execution Plan"], note: "SARGability, evitar SELECT *, projeção, covering index" }),
            task({
              order: 50,
              title: "N+1 Query Problem",
              note: "canônico do roadmap — I/O por item × lote; eager loading/IN/join. GraphQL / N+1 in Resolvers revisita daqui",
              collision: "GraphQL / N+1 in Resolvers é a manifestação; aqui é o conceito canônico",
            }),
            task({
              order: 60,
              title: "Connection Pool",
              note: "tamanho do pool, exaustão, timeout — revisita Programming Foundations / Concurrency (recurso compartilhado limitado)",
              revisit: ["Programming Foundations / Concurrency"],
            }),
            task({ order: 70, title: "Slow Query Analysis", requires: ["Query Execution Plan"], subtopics: ["slow query log", "p95/p99 por query", "EXPLAIN ANALYZE (plano estimado × real)"], note: "consolidada (A20) — absorve Database Profiling" }),
          ],
        }),
        story({
          slug: "nosql",
          order: 80,
          title: "NoSQL",
          requires: ["Database Design"],
          summary:
            "SQL vs NoSQL → data models (KV/Document/Wide-Column/Graph consolidados) → schema-on-read → " +
            "escolher SQL vs NoSQL. Story pequena deliberada — modelo mental próprio.",
          tasks: [
            task({ order: 10, title: "SQL vs NoSQL", requires: ["Database Design / Normalization"], note: "motivação: escala horizontal, esquema flexível, modelo de acesso" }),
            task({
              order: 20,
              title: "NoSQL Data Models (KV / Document / Wide-Column / Graph)",
              requires: ["SQL vs NoSQL"],
              subtopics: ["key-value (cache, sessão)", "document — revisita Software Design / Domain Modeling / Aggregate (documento ≈ aggregate)", "wide-column (série temporal, escala de escrita)", "graph (relações profundas)"],
              note: "consolidada (A8)",
              revisit: ["Software Design / Domain Modeling / Aggregate"],
            }),
            task({ order: 30, title: "Schema-on-Read", requires: ["NoSQL Data Models (KV / Document / Wide-Column / Graph)"], collision: "≠ Database Schema (Database Fundamentals) — validação movida para a aplicação" }),
            task({ order: 40, title: "Choosing SQL vs NoSQL", requires: ["NoSQL Data Models (KV / Document / Wide-Column / Graph)"], note: "polyglot persistence; NoSQL não é 'sem trade-off'" }),
          ],
        }),
        story({
          slug: "caching",
          order: 90,
          title: "Caching",
          requires: ["Web Fundamentals", "Database Fundamentals"],
          summary:
            "Cache (+ hit/miss) → TTL → invalidação → eviction → cache-aside → read/write-through/write-behind → " +
            "in-memory data store → browser & HTTP cache → CDN. Canônico de 'Caching (patterns)' para o roadmap.",
          tasks: [
            task({
              order: 10,
              title: "Cache",
              subtopics: ["hit / miss", "hit ratio", "cold/warm"],
              note: "canônico p/ todo o roadmap. Memoization = cache em processo (revisita Programming Foundations / Algorithms & Complexity). Absorve Cache Hit / Miss",
              revisit: ["Programming Foundations / Algorithms & Complexity / Memoization"],
            }),
            task({ order: 20, title: "TTL", requires: ["Cache"], collision: "TTL de cache ≠ TTL de DNS (Web Fundamentals) ≠ TTL de pacote IP" }),
            task({ order: 30, title: "Cache Invalidation", requires: ["Cache"], note: "o problema difícil; invalidação por evento × por tempo" }),
            task({ order: 40, title: "Cache Eviction (LRU / LFU / FIFO)", requires: ["Cache"], subtopics: ["LRU", "LFU", "FIFO", "random", "pressão de memória × staleness"], note: "consolidada (A12) — absorve LRU" }),
            task({ order: 50, title: "Cache-Aside", requires: ["Cache Invalidation"], note: "padrão mais comum; app orquestra" }),
            task({ order: 60, title: "Read-Through / Write-Through / Write-Behind", requires: ["Cache"], subtopics: ["read-through", "write-through", "write-behind/write-back (risco de perda)"], note: "consolidada (A19)" }),
            task({ order: 70, title: "In-Memory Data Store", requires: ["Cache"], subtopics: ["Redis", "Valkey", "Memcached"], note: "arquétipo: single-thread, estruturas de dados, persistência, uso como cache × store" }),
            task({
              order: 80,
              title: "Browser & HTTP Cache",
              requires: ["Cache"],
              subtopics: ["Cache-Control", "ETag / Last-Modified", "revalidação (304)", "private × shared"],
              note: "consolidada (B2) — revisita Web Fundamentals / HTTP Headers",
              revisit: ["Platform / Web Fundamentals / HTTP Headers"],
            }),
            task({ order: 90, title: "CDN", requires: ["Browser & HTTP Cache"], note: "edge, origin pull/push, invalidação/purge, TTL de borda. Architecture / Caching at Scale revisita" }),
          ],
        }),
        story({
          slug: "authentication",
          order: 100,
          title: "Authentication",
          requires: ["Web Fundamentals"],
          summary:
            "Auth vs authz → password hashing → session × token → JWT → access/refresh → OAuth 2.0 → OIDC → SSO → MFA.",
          tasks: [
            task({ order: 10, title: "Authentication vs Authorization", note: "framing; 'quem é você' × 'o que você pode'" }),
            task({ order: 20, title: "Password Hashing", note: "bcrypt/scrypt/argon2, salt, fator de custo; nunca reversível" }),
            task({
              order: 30,
              title: "Session-Based Authentication",
              requires: ["Web Fundamentals / Sessions"],
              collision: "usa Sessions (Web Fundamentals) como mecanismo",
            }),
            task({ order: 40, title: "Token-Based Authentication", requires: ["Web Fundamentals / Cookies"], note: "stateless; onde guardar o token (cookie vs storage)" }),
            task({ order: 50, title: "JWT", requires: ["Token-Based Authentication"], note: "header/payload/signature; claims; JWT ≠ criptografado por padrão" }),
            task({ order: 60, title: "Access & Refresh Token", requires: ["JWT"], subtopics: ["access (curto)", "refresh (longo, rotação, revogação)"], note: "consolidada (B3)" }),
            task({ order: 70, title: "OAuth 2.0", requires: ["Token-Based Authentication"], note: "papéis, Authorization Code + PKCE; autorização delegada, não login" }),
            task({ order: 80, title: "OpenID Connect (OIDC)", requires: ["OAuth 2.0"], note: "camada de identidade sobre OAuth; id_token" }),
            task({ order: 90, title: "Single Sign-On (SSO)", requires: ["Authentication vs Authorization"], note: "IdP, SAML (menção) × OIDC" }),
            task({ order: 100, title: "Multi-Factor Authentication (MFA)", requires: ["Authentication vs Authorization"], note: "fatores; TOTP, WebAuthn/passkeys (menção)" }),
          ],
        }),
        story({
          slug: "authorization",
          order: 110,
          title: "Authorization",
          requires: ["Authentication"],
          summary:
            "RBAC → ABAC → permission-based → Principle of Least Privilege (canônico do roadmap) → resource ownership. " +
            "Story pequena mas coerente (authz ≠ authn).",
          tasks: [
            task({ order: 10, title: "Role-Based Access Control (RBAC)", note: "papéis → permissões → usuários" }),
            task({ order: 20, title: "Attribute-Based Access Control (ABAC)", note: "políticas sobre atributos (usuário/recurso/ambiente); mais flexível, mais complexo" }),
            task({ order: 30, title: "Permission-Based Authorization", note: "checagem fina no ponto de uso" }),
            task({ order: 40, title: "Principle of Least Privilege", note: "canônico do roadmap — Cloud Security / Least Privilege in Cloud e AI Engineering / AI Safety revisitam com Requires para cá" }),
            task({ order: 50, title: "Resource Ownership", note: "'é seu?'; multi-tenancy; IDOR liga com Application Security / Broken Access Control" }),
          ],
        }),
        story({
          slug: "application-security",
          order: 120,
          title: "Application Security",
          requires: ["Authentication", "Authorization", "Web Fundamentals"],
          summary:
            "Threat modeling → OWASP Top 10 → ataques (SQLi/XSS/CSRF/SSRF/BAC) → input validation (canônico, segurança) → " +
            "output encoding → CSP → security headers → secrets → encryption → dependency vulnerabilities.",
          tasks: [
            task({ order: 10, title: "Threat Modeling", note: "STRIDE, superfície de ataque, trust boundaries; loose ref a fronteiras de módulo (Epic 04)" }),
            task({ order: 20, title: "OWASP Top 10", requires: ["Threat Modeling"], note: "framing do resto da Story" }),
            task({ order: 30, title: "SQL Injection", requires: ["Database Fundamentals / SQL"], note: "queries parametrizadas; ORM não é imunidade automática" }),
            task({ order: 40, title: "Cross-Site Scripting (XSS)", requires: ["Web Fundamentals / Same-Origin Policy"], note: "stored/reflected/DOM" }),
            task({ order: 50, title: "Cross-Site Request Forgery (CSRF)", requires: ["Web Fundamentals / Cookies"], note: "tokens anti-CSRF, SameSite" }),
            task({ order: 60, title: "Server-Side Request Forgery (SSRF)", note: "relevante em cloud (metadata endpoint) — liga com Cloud Security" }),
            task({
              order: 70,
              title: "Broken Access Control",
              requires: ["Authorization / Resource Ownership"],
              note: "IDOR — revisita Authorization / Resource Ownership",
              revisit: ["Platform / Authorization / Resource Ownership"],
            }),
            task({
              order: 80,
              title: "Input Validation",
              note: "canônico — allowlist na fronteira, defesa contra entrada inválida/maliciosa. API Fundamentals / Request Validation trata o mesmo tema no contexto de contrato/request (conceitos distintos, pointer)",
              collision: "≠ API Fundamentals / Request Validation — segurança × validação de contrato",
            }),
            task({ order: 90, title: "Output Encoding", requires: ["Cross-Site Scripting (XSS)"], note: "encoding contextual (HTML/attr/JS/URL)" }),
            task({ order: 100, title: "Content Security Policy (CSP)", requires: ["Cross-Site Scripting (XSS)", "Web Fundamentals / HTTP Headers"], note: "defesa em profundidade contra XSS; nonce/hash" }),
            task({ order: 110, title: "Security Headers", requires: ["Web Fundamentals / HTTP Headers"], note: "HSTS, X-Content-Type-Options, frame-ancestors, Referrer-Policy" }),
            task({
              order: 120,
              title: "Secrets Management",
              note: "rotação, nunca em VCS — revisita Software Craft (.gitignore, história do Git)",
              collision: "≠ Environments & Configuration (CI/CD) ≠ Secret Manager serviço (Cloud Security) ≠ K8s Secret",
            }),
            task({
              order: 130,
              title: "Encryption at Rest & in Transit",
              requires: ["Web Fundamentals / TLS"],
              subtopics: ["at rest (disco/DB/campo, KMS, envelope)", "in transit — revisita TLS"],
              note: "consolidada (B4)",
              revisit: ["Platform / Web Fundamentals / TLS"],
            }),
            task({ order: 140, title: "Dependency Vulnerabilities", subtopics: ["SCA", "CVE/CVSS", "dependências transitivas", "auditoria de lockfile", "supply chain (menção)"], note: "mantida aqui (D6 alterada)" }),
          ],
        }),
        story({
          slug: "observability",
          order: 130,
          title: "Observability",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Observability vs monitoring → logging → structured logging → log levels → correlation ID → metrics " +
            "(+ dashboard) → distributed tracing → OpenTelemetry → alerting.",
          tasks: [
            task({ order: 10, title: "Observability vs Monitoring", note: "consolidada (C1) — absorve Monitoring. 'unknown unknowns' × dashboards pré-definidos" }),
            task({ order: 20, title: "Logging" }),
            task({ order: 30, title: "Structured Logging", requires: ["Logging"], note: "JSON, campos consultáveis" }),
            task({ order: 40, title: "Log Levels", requires: ["Logging"], note: "ERROR/WARN/INFO/DEBUG; custo e ruído" }),
            task({ order: 50, title: "Correlation ID", requires: ["Structured Logging"], note: "propagação por request; base do tracing" }),
            task({ order: 60, title: "Metrics", subtopics: ["Dashboard"], note: "counter/gauge/histogram; RED e USE — absorve Dashboard" }),
            task({ order: 70, title: "Distributed Tracing (Span / trace context)", requires: ["Correlation ID"], subtopics: ["trace", "span (pai/filho)", "propagação de trace context (W3C)", "sampling"], note: "consolidada (A11) — Tracing + Distributed Tracing + Span" }),
            task({ order: 80, title: "OpenTelemetry", requires: ["Metrics", "Distributed Tracing (Span / trace context)"], note: "padrão CNCF vendor-neutral; SDK + collector, semantic conventions. AI Engineering / AI Observability revisita" }),
            task({ order: 90, title: "Alerting", requires: ["Metrics"], note: "alertar em sintoma, não causa; fadiga de alerta" }),
          ],
        }),
        story({
          slug: "performance-engineering",
          order: 140,
          title: "Performance Engineering",
          requires: ["Observability"],
          summary:
            "Performance × scalability → latency/throughput (canônicos do roadmap) → CPU vs I/O bound (canônico aqui) → " +
            "profiling (novo lar canônico) → benchmarking → bottleneck analysis → lazy × eager → debounce/throttle → compression.",
          suggestions: ["Performance Budget — retirado para subtopic; Task própria se reforçar o lado frontend"],
          tasks: [
            task({ order: 10, title: "Performance vs Scalability", collision: "Scalability conceito é canônico em Architecture — aqui é só o contraste 'rápido para 1 × rápido para N'" }),
            task({ order: 20, title: "Latency", note: "canônico do roadmap — Architecture / System Design Fundamentals revisita 'em escala'. p50/p95/p99" }),
            task({ order: 30, title: "Throughput", note: "canônico do roadmap. Lei de Little (menção)" }),
            task({
              order: 40,
              title: "CPU-Bound vs I/O-Bound",
              note: "canônico do roadmap — casa canônica é Platform / Performance Engineering (Fase 1). Revisita Programming Foundations / Concurrency, Asynchronous Programming (pointer, não lacuna do Epic 01)",
              revisit: ["Programming Foundations / Concurrency", "Programming Foundations / Asynchronous Programming"],
            }),
            task({
              order: 50,
              title: "Profiling",
              requires: ["CPU-Bound vs I/O-Bound"],
              note: "canônico (não tinha lar antes). Revisita Programming Foundations / Memory & Runtime / GC, Memory Leak; Testing & Quality Engineering / Debugging (postura empírica); flame graph",
              revisit: ["Programming Foundations / Memory & Runtime / Garbage Collection", "Programming Foundations / Memory & Runtime / Memory Leak", "Testing & Quality Engineering / Debugging"],
            }),
            task({ order: 60, title: "Benchmarking", note: "micro × macro; warm-up; variância" }),
            task({ order: 70, title: "Bottleneck Analysis", requires: ["Profiling"], note: "teoria das restrições; otimizar o gargalo, não o resto" }),
            task({ order: 80, title: "Lazy vs Eager Loading", subtopics: ["lazy (sob demanda, risco N+1)", "eager (upfront, risco over-fetch)"], note: "consolidada (B5) — revisita Database Performance / N+1", revisit: ["Platform / Database Performance / N+1 Query Problem"] }),
            task({ order: 90, title: "Debounce / Throttle", subtopics: ["debounce (espera silêncio)", "throttle (taxa máxima)"], note: "consolidada (B6) — par clássico, muito confundido" }),
            task({ order: 100, title: "Compression", note: "gzip/brotli; Content-Encoding; trade-off CPU × banda" }),
          ],
        }),
        story({
          slug: "reliability-engineering",
          order: 150,
          title: "Reliability Engineering",
          requires: ["Observability"],
          summary:
            "SLI → SLO → SLA → error budget → incident → MTTD/MTTR → incident response → postmortem (blameless).",
          tasks: [
            task({ order: 10, title: "SLI", requires: ["Observability / Metrics"], note: "o que medir (a métrica do usuário)" }),
            task({ order: 20, title: "SLO", requires: ["SLI"], note: "o alvo" }),
            task({ order: 30, title: "SLA", requires: ["SLO"], note: "o contrato (com consequência); SLA ⊂ SLO ⊂ SLI" }),
            task({ order: 40, title: "Error Budget", requires: ["SLO"], note: "1 − SLO; política de queima; freia release" }),
            task({ order: 50, title: "Incident", note: "severidade; declarar um incidente" }),
            task({ order: 60, title: "MTTD / MTTR", requires: ["Incident"], subtopics: ["MTTD", "MTTR", "MTTA", "MTBF (menção)"], note: "consolidada (B7)" }),
            task({
              order: 70,
              title: "Incident Response",
              requires: ["Incident"],
              note: "revisita Testing & Quality Engineering / Debugging (Reproduction, Hypothesis-Driven Debugging); Software Craft / Runbook (o artefato que guia a resposta)",
              revisit: ["Testing & Quality Engineering / Debugging / Reproduction", "Testing & Quality Engineering / Debugging / Hypothesis-Driven Debugging", "Software Craft / Engineering Documentation / Runbook"],
            }),
            task({
              order: 80,
              title: "Postmortem (Blameless)",
              requires: ["Incident Response"],
              subtopics: ["timeline", "causa raiz (revisita RCA)", "cultura blameless", "ações com dono/prazo"],
              note: "consolidada (B8) — revisita Testing & Quality Engineering / Debugging / Root Cause Analysis",
              revisit: ["Testing & Quality Engineering / Debugging / Root Cause Analysis"],
            }),
          ],
        }),
        story({
          slug: "containers",
          order: 160,
          title: "Containers",
          requires: ["Programming Foundations / Programming Fundamentals"],
          summary:
            "Container (namespaces + cgroups) → container vs VM → Docker → Docker Image (+ Dockerfile) → registry → " +
            "volumes & networks (+ Compose) → multi-stage build.",
          tasks: [
            task({
              order: 10,
              title: "Container",
              note: "namespaces + cgroups isolam processos — revisita Programming Foundations / Concurrency / Process. Absorve 'Docker Container' do rascunho",
              revisit: ["Programming Foundations / Concurrency / Process"],
            }),
            task({
              order: 20,
              title: "Container vs Virtual Machine",
              requires: ["Container"],
              note: "kernel compartilhado × hypervisor — revisita Programming Foundations / Concurrency / Process, Thread",
              revisit: ["Programming Foundations / Concurrency / Process", "Programming Foundations / Concurrency / Thread"],
            }),
            task({ order: 30, title: "Docker", requires: ["Container"], note: "engine, daemon, CLI" }),
            task({
              order: 40,
              title: "Docker Image",
              requires: ["Docker"],
              subtopics: ["Dockerfile — instruções, ordem e cache de layers", "layers, união, tags, digest"],
              note: "absorve Dockerfile do rascunho",
              collision: "≠ Artifact de build (CI/CD)",
            }),
            task({ order: 50, title: "Docker Registry", requires: ["Docker Image"], note: "push/pull; público × privado" }),
            task({
              order: 60,
              title: "Docker Volumes & Networks",
              requires: ["Docker"],
              subtopics: ["volumes (named, bind, tmpfs)", "networks (bridge, host, DNS entre containers)", "Docker Compose — multi-container local, não é orquestrador de produção"],
              note: "consolidada (B9) — absorve Docker Compose",
            }),
            task({ order: 70, title: "Multi-Stage Build", requires: ["Docker Image"], note: "imagem final enxuta; separar build de runtime" }),
          ],
        }),
        story({
          slug: "ci-cd",
          order: 170,
          title: "CI/CD",
          requires: ["Containers"],
          summary:
            "CI → CD (delivery/deployment) → pipeline → build → artifact → deployment → environments & configuration → " +
            "feature flags → rollback → deployment strategies. Pipeline revisita o Epic 02 (gates de teste).",
          tasks: [
            task({ order: 10, title: "Continuous Integration", collision: "≠ Integration Testing (Testing & Quality Engineering) — integrar código com frequência × teste multi-componente" }),
            task({ order: 20, title: "Continuous Delivery", requires: ["Continuous Integration"], note: "sempre pronto para release; passo manual de deploy" }),
            task({ order: 30, title: "Continuous Deployment", requires: ["Continuous Delivery"], note: "deploy automático após pipeline verde" }),
            task({ order: 40, title: "CI/CD Pipeline", requires: ["Continuous Integration"], note: "stages, gates, fail-fast. Revisita Epic 02: Test Runner, Assertion, Code Coverage, Test Isolation, Flaky Tests, Regression Testing (sem Task nova)", revisit: ["Testing & Quality Engineering / Testing Strategy / Code Coverage", "Testing & Quality Engineering / Testing Strategy / Test Isolation", "Testing & Quality Engineering / Testing Strategy / Regression Testing"] }),
            task({ order: 50, title: "Build", note: "reproduzível, hermético — revisita Software Craft (SUGESTÃO Build & Tooling)" }),
            task({ order: 60, title: "Artifact", requires: ["Build"], collision: "≠ Docker Image (Containers) ≠ Artifact do Jira; imutável, versionado, promovido entre ambientes" }),
            task({ order: 70, title: "Deployment", requires: ["Artifact"], note: "guarda-chuva real (precede Strategies/Rollback/Feature Flags)" }),
            task({ order: 80, title: "Environments & Configuration", subtopics: ["dev/staging/prod", "paridade dev-prod", "12-factor config", "environment variables"], note: "consolidada (§D/§G) — funde Environment + Environment Variables", collision: "≠ Secrets Management (Application Security)" }),
            task({ order: 90, title: "Feature Flags", note: "desacoplar deploy de release; kill switch; dívida de flag" }),
            task({
              order: 100,
              title: "Rollback",
              requires: ["Deployment"],
              note: "mesma ideia de Software Craft / Git / Revert, nível de deploy; migração compatível com rollback",
              revisit: ["Software Craft / Git / Revert"],
            }),
            task({ order: 110, title: "Deployment Strategies (Rolling / Blue-Green / Canary)", requires: ["Deployment"], subtopics: ["recreate (menção)", "rolling", "blue-green", "canary — revisita Testing Strategy (teste em produção)"], note: "consolidada (A9)", revisit: ["Testing & Quality Engineering / Testing Strategy"] }),
          ],
        }),
        story({
          slug: "cloud-fundamentals",
          order: 180,
          title: "Cloud Fundamentals",
          requires: ["Containers"],
          summary:
            "Cloud computing → service models → region/AZ → compute & VM → storage types → managed database → " +
            "load balancer e auto scaling (primitivos; conceito canônico em Architecture) → serverless (primitivo canônico aqui).",
          tasks: [
            task({ order: 10, title: "Cloud Computing", note: "elasticidade, pay-as-you-go, responsabilidade compartilhada (menção → Cloud Security)" }),
            task({ order: 20, title: "Cloud Service Models (IaaS / PaaS / SaaS)", requires: ["Cloud Computing"], subtopics: ["IaaS", "PaaS", "SaaS", "FaaS (ponte p/ Serverless)", "o que você gerencia em cada"], note: "consolidada (A10)" }),
            task({ order: 30, title: "Region & Availability Zone", requires: ["Cloud Computing"], subtopics: ["region", "AZ", "latência", "residência de dado", "isolamento de falha"], note: "consolidada (B10)" }),
            task({ order: 40, title: "Compute & Virtual Machine", requires: ["Cloud Computing"], subtopics: ["instância", "famílias/sizing", "machine image", "spot/reserved"], note: "consolidada (B11)" }),
            task({ order: 50, title: "Cloud Storage Types (Object / Block)", requires: ["Cloud Computing"], subtopics: ["object (blob, API HTTP, durabilidade 11-noves)", "block (volume, baixa latência)", "file (menção)"], note: "consolidada (B12)" }),
            task({ order: 60, title: "Managed Database", requires: ["Cloud Service Models (IaaS / PaaS / SaaS)"], note: "o que a nuvem assume (backup, patch, failover) — revisita as Stories de banco", revisit: ["Platform / Database Fundamentals", "Platform / Database Performance"] }),
            task({
              order: 70,
              title: "Load Balancer",
              requires: ["Compute & Virtual Machine"],
              canonical: false,
              revisitOf: "Architecture / Scalability / Load Balancing",
              note: "o primitivo de cloud (L4/L7, health checks, algoritmos); o conceito Load Balancing permanece canônico em Architecture / Scalability. Recurso concreto de cloud não vira nova casa canônica",
            }),
            task({
              order: 80,
              title: "Auto Scaling",
              requires: ["Compute & Virtual Machine"],
              canonical: false,
              revisitOf: "Architecture / Scalability / Auto Scaling",
              note: "primitivo aqui (políticas por métrica, min/max, cooldown); conceito em Architecture / Scalability. Requires: Load Balancer removido — LB não é pré-requisito conceitual de Auto Scaling",
            }),
            task({ order: 90, title: "Serverless", requires: ["Cloud Service Models (IaaS / PaaS / SaaS)"], note: "primitivo canônico — FaaS, cold start, statelessness, limites, modelo de preço. Architecture / Architectural Styles revisita o estilo 'serverless'" }),
          ],
        }),
        story({
          slug: "cloud-networking",
          order: 190,
          title: "Cloud Networking",
          requires: ["Web Fundamentals"],
          summary: "VPC → subnet (public/private) → CIDR & IP → firewall & security group → NAT & internet gateway → DNS in cloud.",
          tasks: [
            task({ order: 10, title: "VPC", note: "rede isolada logicamente" }),
            task({ order: 20, title: "Subnet (Public vs Private)", requires: ["VPC"], subtopics: ["subnet", "route table", "pública (rota p/ IGW)", "privada"], note: "consolidada (B13)" }),
            task({
              order: 30,
              title: "CIDR & IP Address",
              subtopics: ["IPv4/IPv6", "notação CIDR /n", "faixas privadas", "sizing de subnet"],
              note: "consolidada (B14) — revisita Web Fundamentals / DNS, TCP",
              revisit: ["Platform / Web Fundamentals / DNS", "Platform / Web Fundamentals / TCP vs UDP"],
            }),
            task({ order: 40, title: "Firewall & Security Group", requires: ["Subnet (Public vs Private)"], subtopics: ["security group (stateful, por instância)", "NACL (stateless, por subnet)", "ingress/egress"], note: "consolidada (B15)", collision: "≠ Application Security (controles L7)" }),
            task({ order: 50, title: "NAT & Internet Gateway", requires: ["Subnet (Public vs Private)"], subtopics: ["IGW (entrada/saída pública)", "NAT gateway (só egress de subnet privada)"], note: "consolidada (B16)" }),
            task({ order: 60, title: "DNS in Cloud", requires: ["Web Fundamentals / DNS"], note: "zonas privadas, service discovery por DNS, split-horizon", revisit: ["Platform / Web Fundamentals / DNS"] }),
          ],
        }),
        story({
          slug: "cloud-security",
          order: 200,
          title: "Cloud Security",
          requires: ["Authorization", "Cloud Fundamentals"],
          summary: "IAM → user vs role → policy → service account → least privilege in cloud (revisita) → secret manager → shared responsibility.",
          tasks: [
            task({ order: 10, title: "IAM", requires: ["Authorization / Role-Based Access Control (RBAC)"], note: "identidades, autenticação de máquina, federação — revisita Authorization", revisit: ["Platform / Authorization"] }),
            task({ order: 20, title: "User vs Role", requires: ["IAM"], note: "credencial de longa duração × assumida temporariamente" }),
            task({ order: 30, title: "Policy", requires: ["IAM"], collision: "documento de permissão de cloud (allow/deny, recurso, condição) ≠ política ABAC (Authorization)" }),
            task({ order: 40, title: "Service Account", requires: ["User vs Role"], note: "identidade de workload; evitar chaves estáticas" }),
            task({
              order: 50,
              title: "Least Privilege in Cloud",
              requires: ["Policy", "Authorization / Principle of Least Privilege"],
              canonical: false,
              revisitOf: "Platform / Authorization / Principle of Least Privilege",
              note: "aplica o canônico da Authorization; escopo mínimo, sem wildcard",
            }),
            task({ order: 60, title: "Secret Manager", requires: ["IAM"], collision: "o serviço gerenciado (rotação automática, auditoria) ≠ Secrets Management prática (Application Security) ≠ K8s Secret" }),
            task({ order: 70, title: "Shared Responsibility Model", requires: ["Cloud Fundamentals / Cloud Computing"], note: "o que é do provedor × do cliente, por modelo de serviço" }),
          ],
        }),
        story({
          slug: "kubernetes-fundamentals",
          order: 210,
          title: "Kubernetes Fundamentals",
          requires: ["Containers", "Cloud Networking"],
          summary:
            "Kubernetes → cluster & node → pod → deployment & replicaset → service → ingress → configmap & secret → " +
            "HPA → liveness & readiness probes. Versão enxuta (13→9, 100% consolidação).",
          suggestions: ["Namespace, DaemonSet, StatefulSet, Job/CronJob, PersistentVolume, Helm — caminho 'Advanced'"],
          tasks: [
            task({ order: 10, title: "Kubernetes", requires: ["Containers / Docker"], note: "orquestrador; estado desejado × reconciliação (control loop)" }),
            task({ order: 20, title: "Cluster & Node", requires: ["Kubernetes"], subtopics: ["control plane (API server, etcd, scheduler, controller manager)", "worker (kubelet, kube-proxy, runtime)"], note: "consolidada (A22)" }),
            task({ order: 30, title: "Pod", requires: ["Kubernetes"], note: "menor unidade; 1+ containers; efêmero" }),
            task({ order: 40, title: "Deployment & ReplicaSet", requires: ["Pod"], subtopics: ["ReplicaSet (réplicas desejadas)", "Deployment (rollout/rollback, histórico de revisão)"], note: "consolidada (A21)" }),
            task({ order: 50, title: "Service", requires: ["Pod"], collision: "K8s Service ≠ Service Layer/Domain Service (Software Design) ≠ Service Account (Cloud Security); ClusterIP/NodePort/LoadBalancer" }),
            task({ order: 60, title: "Ingress", requires: ["Service"], note: "roteamento HTTP L7 para dentro do cluster; ingress controller" }),
            task({ order: 70, title: "ConfigMap & Secret", requires: ["Pod"], subtopics: ["ConfigMap (não sensível)", "Secret (base64, não cifrado em repouso por padrão)", "montar como env/volume"], note: "consolidada (B17)", collision: "K8s Secret é base64 — ver Application Security / Cloud Security" }),
            task({
              order: 80,
              title: "Horizontal Pod Autoscaler",
              requires: ["Deployment & ReplicaSet", "Observability / Metrics"],
              note: "escala por métrica; análogo a Auto Scaling (Cloud Fundamentals) no nível de pod",
              revisit: ["Platform / Cloud Fundamentals / Auto Scaling"],
            }),
            task({ order: 90, title: "Liveness & Readiness Probes", requires: ["Pod"], subtopics: ["liveness (reinicia)", "readiness (tira de rotação)", "startup probe"], note: "consolidada (A23) — revisita Architecture / Availability (health check, graceful degradation)", revisit: ["Architecture / Availability & Reliability"] }),
          ],
        }),
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
