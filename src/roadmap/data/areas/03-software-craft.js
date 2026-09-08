import { area, module, concept } from "../builders.js";

export default area({
  slug: "software-craft",
  order: 30,
  title: "Software Craft",
  color: "#E0A458",
  summary:
    "Disciplina diária de escrever e mudar código com segurança: clean code, heurísticas, code smells, " +
    "refactoring, error handling, code review, dependências, git, documentação.",
  phase: "Fase 2 concluída (2026-09-05)",
  modules: [
    module({
      slug: "clean-code",
      order: 10,
      title: "Clean Code",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Vocabulário e legibilidade (Naming) → tamanho e responsabilidade da função → argumentos e early " +
        "return → quando comentar → números mágicos. Pure Functions/Side Effects/Immutability removidas " +
        "(canônico em Programming Foundations / Functional Programming).",
      concepts: [
        concept({ order: 10, title: "Naming", note: "vocabulário/legibilidade — ponto de entrada da Story" }),
        concept({ order: 20, title: "Functions", note: "tamanho, responsabilidade única no nível de função" }),
        concept({ order: 30, title: "Function Arguments", requires: ["Functions"], note: "aridade, ordem, flags booleanas" }),
        concept({
          order: 40,
          title: "Guard Clauses",
          requires: ["Functions"],
          note: "early return — revisita Programming Foundations / Type Systems / Type Narrowing (mecanismo de tipos lá, estilo de código aqui)",
          collision: "≠ Type Narrowing (Programming Foundations / Type Systems) — mecanismo de type system × estilo de código",
        }),
        concept({ order: 50, title: "Comments", note: "quando comentar (e quando não)" }),
        concept({
          order: 60,
          title: "Magic Numbers",
          note: "extrair para constantes nomeadas. Inclui a técnica \"substituir por constante\" — não vira Task própria (ver Refactoring)",
        }),
      ],
    }),
    module({
      slug: "design-heuristics",
      order: 20,
      title: "Design Heuristics",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary: "Paralela a Clean Code — heurísticas de design que não dependem dela. DRY → KISS → YAGNI → Principle of Least Astonishment.",
      concepts: [
        concept({ order: 10, title: "DRY", note: "Don't Repeat Yourself" }),
        concept({ order: 20, title: "KISS", note: "Keep It Simple" }),
        concept({
          order: 30,
          title: "YAGNI",
          note: "You Aren't Gonna Need It — ver colisão conceitual com Speculative Generality (Code Smells, não incluída como Task)",
        }),
        concept({ order: 40, title: "Principle of Least Astonishment", note: "o código não deve surpreender quem lê" }),
      ],
    }),
    module({
      slug: "code-smells",
      order: 30,
      title: "Code Smells",
      requires: ["Clean Code", "Design Heuristics"],
      summary: "Reconhecer violações concretas dos princípios já ensinados: duplicação, tamanho, acoplamento, coesão, uso de primitivos.",
      suggestions: ["Dead Code", "Shotgun Surgery", "Divergent Change", "Data Clumps", "Speculative Generality (≈ YAGNI)"],
      concepts: [
        concept({
          order: 10,
          title: "Duplicate Code",
          requires: ["Design Heuristics / DRY"],
          note: "o smell = a violação visível do princípio",
          collision: "≠ DRY (Design Heuristics) — manifestação concreta × princípio abstrato",
        }),
        concept({ order: 20, title: "Long Method", note: "função grande demais para entender de uma vez" }),
        concept({
          order: 30,
          title: "Long Parameter List",
          note: "relaciona-se com Function Arguments (Clean Code) e Introduce Parameter Object (Refactoring) — trio intencional: escrever bem → reconhecer violação → corrigir",
        }),
        concept({
          order: 40,
          title: "Large Class",
          requires: ["Programming Foundations / Programming Fundamentals / Cohesion"],
          note: "sintoma concreto de baixa coesão",
        }),
        concept({
          order: 50,
          title: "Feature Envy",
          requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
          note: "sintoma concreto de acoplamento excessivo",
        }),
        concept({ order: 60, title: "Primitive Obsession", note: "usar primitivos onde um tipo/objeto próprio comunicaria melhor a intenção" }),
      ],
    }),
    module({
      slug: "refactoring",
      order: 40,
      title: "Refactoring",
      requires: ["Code Smells", "Testing & Quality Engineering"],
      summary:
        "Guarda-chuva (o que é refatorar, quando/quando não) → técnicas mecânicas específicas, muitas delas " +
        "corrigindo os smells já diagnosticados. Só se refatora com segurança havendo rede de testes.",
      concepts: [
        concept({
          order: 10,
          title: "Refactoring",
          isNew: true,
          note: "guarda-chuva: transformação que preserva comportamento; \"duas camadas\" (adicionar feature × refatorar), por que fazer, quando não fazer",
        }),
        concept({ order: 20, title: "Extract Function", requires: ["Refactoring"] }),
        concept({ order: 30, title: "Extract Variable", requires: ["Refactoring"] }),
        concept({ order: 40, title: "Rename", requires: ["Refactoring"] }),
        concept({
          order: 50,
          title: "Inline Function",
          requires: ["Refactoring"],
          note: "operação inversa de Extract Function — ensinada em par por ordem de estudo, não por Requires",
        }),
        concept({
          order: 60,
          title: "Extract Class",
          requires: ["Code Smells / Large Class"],
          note: "corrige a baixa coesão diagnosticada por Large Class",
        }),
        concept({ order: 70, title: "Move Function", requires: ["Refactoring"] }),
        concept({
          order: 80,
          title: "Replace Nested Conditional with Guard Clauses",
          requires: ["Clean Code / Guard Clauses"],
          note: "a técnica mecânica que produz o estilo já ensinado em Clean Code",
        }),
        concept({
          order: 90,
          title: "Replace Conditional with Polymorphism",
          requires: ["Programming Foundations / Programming Fundamentals / Polymorphism"],
          note: "aplica o mecanismo já ensinado em Programming Foundations",
        }),
        concept({
          order: 100,
          title: "Introduce Parameter Object",
          requires: ["Code Smells / Long Parameter List"],
          note: "corrige o smell diagnosticado antes",
        }),
        concept({
          order: 110,
          title: "Refactoring with Tests",
          requires: ["Testing & Quality Engineering / Testing Fundamentals"],
          note: "fecha a Story: só se refatora com segurança havendo rede de testes",
        }),
      ],
    }),
    module({
      slug: "error-handling",
      order: 50,
      title: "Error Handling",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Framing agnóstico (erro × exceção) → mecanismo → propagação → tipos com significado → postura " +
        "defensiva → erro como valor → contenção da falha.",
      concepts: [
        concept({
          order: 10,
          title: "Errors vs Exceptions",
          isNew: true,
          note: "framing agnóstico de linguagem: erro (conceito) × exceção (mecanismo específico)",
        }),
        concept({ order: 20, title: "Exceptions", requires: ["Errors vs Exceptions"], note: "throw/catch, hierarquia de exceções" }),
        concept({
          order: 30,
          title: "Error Propagation",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "o erro sobe pela pilha de chamadas",
        }),
        concept({ order: 40, title: "Custom Errors", requires: ["Exceptions"], note: "tipos de erro com significado de domínio" }),
        concept({
          order: 50,
          title: "Fail Fast",
          requires: ["Programming Foundations / Programming Fundamentals / Contract"],
          note: "pré-condição violada → falhar imediatamente",
        }),
        concept({
          order: 60,
          title: "Result Pattern",
          note: "erro como valor de retorno explícito, não efeito colateral — revisita Programming Foundations / Functional Programming (Side Effects/Pure Functions)",
        }),
        concept({
          order: 70,
          title: "Error Boundaries",
          note: "conter a falha para não propagar em cascata — definição agnóstica de framework. Ponte futura para Architecture / Resilience Patterns (sem Requires — Epic 06 ainda não aprovado)",
        }),
      ],
    }),
    module({
      slug: "code-review",
      order: 60,
      title: "Code Review",
      requires: ["Clean Code"],
      summary: "Guarda-chuva (o que é, por que é gate de qualidade) → as lentes de avaliação → escopo do PR → a camada humana de comunicação.",
      concepts: [
        concept({ order: 10, title: "Code Review", requires: ["Clean Code"], isNew: true, note: "guarda-chuva: o que é, por que é gate de qualidade" }),
        concept({
          order: 20,
          title: "Review Dimensions",
          requires: ["Code Review"],
          note: "consolida 5 Tasks do rascunho original (\"Review for Correctness/Readability/Maintainability/Testability/Security\") — revisita Testing & Quality Engineering / Testing Strategy / Testability (uma das lentes)",
          subtopics: ["Correctness", "Readability", "Maintainability", "Testability", "Security"],
          collision: "≠ Testability (Testing & Quality Engineering / Testing Strategy) — uma lente de revisão × a propriedade em si",
        }),
        concept({ order: 30, title: "Review Scope", requires: ["Code Review"], note: "tamanho/foco de um PR — mudanças de propósito único" }),
        concept({ order: 40, title: "Giving & Receiving Feedback", requires: ["Code Review"], note: "camada de comunicação/soft-skill" }),
      ],
    }),
    module({
      slug: "dependency-version-management",
      order: 70,
      title: "Dependency & Version Management",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Custo de atalhos (Technical Debt) e código de risco (Legacy Code) → comunicar mudança com segurança " +
        "(SemVer, Backward Compatibility, Deprecation) → gerenciar dependências de terceiros → migrar com segurança.",
      concepts: [
        concept({ order: 10, title: "Technical Debt", note: "custo de atalhos — framing da Story" }),
        concept({
          order: 20,
          title: "Legacy Code",
          note: "código difícil/arriscado de mudar com segurança, geralmente sem dono claro ou contexto original preservado. A associação de Feathers (\"código legado = código sem testes\") é citada como lente, não como definição universal",
        }),
        concept({ order: 30, title: "Semantic Versioning", note: "MAJOR.MINOR.PATCH e o que cada um comunica" }),
        concept({ order: 40, title: "Backward Compatibility", requires: ["Semantic Versioning"], note: "a propriedade que SemVer protege/comunica" }),
        concept({ order: 50, title: "Deprecation", requires: ["Backward Compatibility"], note: "processo de retirar algo preservando compatibilidade" }),
        concept({
          order: 60,
          title: "Dependency Management",
          isNew: true,
          requires: ["Semantic Versioning"],
          note: "gerenciar versões/dependências de terceiros: lockfiles, ranges de versão, grafo de dependências",
        }),
        concept({
          order: 70,
          title: "Incremental Migration",
          requires: ["Legacy Code", "Backward Compatibility"],
          note: "capstone: técnica para evoluir código legado/dependências com segurança",
        }),
      ],
    }),
    module({
      slug: "git",
      order: 80,
      title: "Git",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Commit como unidade atômica → operações que combinam histórico (Merge/Rebase) → variações e " +
        "recuperação → localizar regressões (revisita) → workflow de equipe.",
      concepts: [
        concept({ order: 10, title: "Commit", note: "unidade atômica de histórico, boas mensagens" }),
        concept({ order: 20, title: "Merge", requires: ["Commit"] }),
        concept({ order: 30, title: "Rebase", requires: ["Commit"], note: "contraste direto com Merge" }),
        concept({
          order: 40,
          title: "Interactive Rebase",
          requires: ["Rebase"],
          note: "inclui Squash como caso de uso — não vira Task própria",
        }),
        concept({
          order: 50,
          title: "Merge Conflicts",
          requires: ["Commit"],
          note: "colisão entre mudanças registradas em commits; pré-requisito conceitual mínimo é Commit (mesmo padrão de Merge/Rebase/Cherry-pick/Revert/Reset) — Merge e Rebase são onde o conflito aparece na prática (ordem de estudo, não Requires)",
        }),
        concept({ order: 60, title: "Cherry-pick", requires: ["Commit"] }),
        concept({ order: 70, title: "Revert", requires: ["Commit"], note: "desfazer seguro/público — ensinar em par com Reset" }),
        concept({ order: 80, title: "Reset", requires: ["Commit"], note: "desfazer local/mutável — ensinar em par com Revert" }),
        concept({ order: 90, title: "Reflog", requires: ["Reset"], note: "rede de segurança para recuperar de Reset/Rebase mal feitos" }),
        concept({
          order: 100,
          title: "Git Bisect",
          requires: ["Testing & Quality Engineering / Debugging / Git Bisect"],
          canonical: false,
          revisitOf: "Testing & Quality Engineering / Debugging / Git Bisect",
          note: "não é uma 2ª Task canônica — só ponteiro/referência, mesmo padrão de Call Stack em Asynchronous Programming",
        }),
        concept({
          order: 110,
          title: "Branching Strategies",
          requires: ["Merge", "Rebase"],
          note: "capstone — trunk-based × git-flow, no nível de workflow de equipe",
        }),
      ],
    }),
    module({
      slug: "engineering-documentation",
      order: 90,
      title: "Engineering Documentation",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary: "Do ponto de entrada de um repositório até a documentação operacional: README → Changelog → ADR → RFC → Runbook.",
      suggestions: ["API Documentation (Platform / API Fundamentals, futuro)"],
      concepts: [
        concept({ order: 10, title: "README", note: "ponto de entrada de um repositório/projeto" }),
        concept({ order: 20, title: "Changelog", note: "registro por mudança" }),
        concept({ order: 30, title: "ADR", note: "Architecture Decision Record — registro por decisão" }),
        concept({ order: 40, title: "RFC", note: "proposta pré-decisão para mudanças maiores" }),
        concept({
          order: 50,
          title: "Runbook",
          note: "documentação operacional. Ponte futura para Platform / Reliability Engineering (Postmortem) — sem Requires (Epic 05 ainda não aprovado)",
        }),
      ],
    }),
  ],
});
