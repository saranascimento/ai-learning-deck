# PLAN — Roadmap Senior

Registro de decisões da transformação do projeto `ai-learning-deck` ("Papo de IA")
no **Roadmap Senior**: aplicação/deck navegável (Área → Módulo → Conceito) que
representa o roadmap de estudo para nível Senior Software Engineer.

## Histórico

| Data | Fase | Evento |
|---|---|---|
| 2026-09-03 | Fase 1 | Arquitetura macro (Epics → Stories, ordem pedagógica, sobreposições, dependências de alto nível) **aprovada**. Estrutura de referência: `roadmap/00-overview.md`. |
| 2026-09-03 | Fase 2 · Epic 01 | `Programming Foundations` **aprovado**: 8 Stories, 79 Tasks, `Requires` por Task, canônico × revisita, duplicatas resolvidas. Detalhe: `roadmap/01-programming-foundations.md`. Inclui Story nova `Memory & Runtime` (02), `Closure` promovida, `O(1)…O(n²)` consolidadas em `Common Time Complexities`. |
| 2026-09-03 | Fase 2 · Epic 02 | `Testing & Quality Engineering` **aprovado**: 5 Stories, 31 Tasks. Detalhe: `roadmap/02-testing-quality-engineering.md`. 24 Tasks originais + 7 novas (`Assertion`, `Test Fixture`, `Test Runner`, `Dummy`, `Red-Green-Refactor`, `Code Coverage`, `Property-Based Testing`). `Git Bisect` canônico aqui (Epic 03/Git → revisita). `Requires` revisados: ordem de estudo ≠ dependência conceitual; sem ciclo (TDD não `Requires` Refactoring). |
| 2026-09-05 | Fase 2 · Epic 03 | `Software Craft` **aprovado**: 9 Stories, 61 Tasks. Detalhe: `roadmap/03-software-craft.md`. Removidas `Pure Functions`/`Side Effects`/`Immutability` (canônico Epic 01); `Git Bisect` não-canônico (`revisitOf` Epic 02/Debugging); 3 correções de `Requires` aplicadas (`Inline Function`, `Legacy Code`, `Merge Conflicts`); Tasks guarda-chuva novas: `Refactoring`, `Code Review`, `Errors vs Exceptions`; consolidação `Review Dimensions` (5 Tasks → 1, `subtopics`). |
| 2026-09-05 | Fase 2 · Epic 04 | `Software Design` **aprovado**: 9 Stories, 56 Tasks. Detalhe: `roadmap/04-software-design.md`. Versão enxuta dos catálogos GoF (`Structural` 7→5, `Behavioral` 11→5; patterns retirados → SUGESTÃO). `Chain of Responsibility` fica como Advanced/Optional p/ reconsiderar no Epic 05 (middleware). `Law of Demeter` + `Principle of Least Knowledge` = 1 Task. `Composition over Inheritance` recebido do Epic 01. `Entity`/`Value Object` canônicos em OOD, revisita (`canonical: false` + `revisitOf`) em Domain Modeling. Sem cadeia `Requires` Creational→Structural→Behavioral. Excluídas: `Principle of Least Astonishment`, `High Cohesion/Low Coupling`, `Dependency`, `Dependency Inversion`, `Dependency Graph`. |
| 2026-09-05 | Fase 2 · Epic 05 | `Platform Engineering` **aprovado / FROZEN**: 21 Stories, 187 Tasks (183 canônicas, 4 `canonical: false` + `revisitOf`). Detalhe: `roadmap/05-platform-engineering.md`. 46 consolidações auditadas + 9 rebaixamentos §C/§D. `Rate Limiting` + `Idempotency Key` canônicos em Platform / API Fundamentals (**mudança não silenciosa vs Fase 1** — `Rate Limiting` era Architecture/Resilience). `Middleware / Request Pipeline` nova Task (ancora `Chain of Responsibility`, que segue SUGESTÃO no Epic 04). `Profiling` ganha lar canônico. `TLS` Task própria, `HTTPS` subtopic. `Redis` → `In-Memory Data Store`; `DataLoader` → `Batching & Per-Request Caching`. ~30 `Requires` de ordem de estudo removidos (4 invertidos). Dependência `Epic 04 / Enterprise & Application Patterns` → `Requires: Platform / Database Fundamentals` **formalizada**. |
| 2026-09-08 | Fase 2 · Epic 06 | `Architecture & System Design` **aprovado / FROZEN**: 14 Stories, 93 Tasks (91 canônicas, 2 `canonical: false` + `revisitOf`). Detalhe: `roadmap/06-architecture-system-design.md`. 7 consolidações auditadas (5 umbrella 3→1 + 2 par 2→1) + 11 rebaixamentos a subtopic. Auditoria dedicada de `Requires` de Task (ORDER ≠ REQUIRES) sobre 108 arestas propostas: **63 KEEP / 42 relações removidas de `Requires` (preservadas como pointer/contexto quando aplicável) / 3 REPOINT** — zero ciclos, zero forward dependencies. Ownership canônico do Epic 05 preservado integralmente (`Rate Limiting`/`Idempotency Key` em Platform; `Load Balancing`/`Auto Scaling`/`Idempotency` genérico canônicos aqui; `Serverless` primitivo em Platform). `Event` (Messaging) e `Domain Event` (Software Design) ficam ambos canônicos, colisão anotada, sem `revisitOf`. `CQRS` não tem `Requires` formal para `CQS` (Software Design), só pointer. Múltiplas Tasks-root aceitas nas Stories `Availability & Reliability` e `Resilience Patterns`. |
| — | Fase 2 · Epic 07 | Não iniciado. Próxima rodada, com sua própria aprovação. |
| — | Fase 3 · 1ª versão | ✅ Implementada (`index.html` + `js/roadmap/*`). Home com os 7 Epics + navegação completa (Área → Módulo → Conceito) para os Epics com Fase 2 concluída — agora **01–06**. Epic 07 aparece na Home sem drill-down. |

> A cópia de trabalho original deste plano vive em
> `~/.claude/plans/quero-transformar-este-projeto-mellow-spring.md`.
> Este arquivo é o registro versionado no repositório.

---

## Context

O repositório `ai-learning-deck` hoje é o site "Papo de IA": uma Home data-driven
(`data/presentations.js` → `js/home.js`) que lista decks de slides, mais uma engine
de apresentação (`js/navigation.js`) usada dentro de cada deck. Existem 2 decks
(`harness` completo, `ai-fundamentals` placeholder).

A pasta `roadmap/` foi criada com **5 arquivos markdown** — cada um um Epic já
rascunhado com Stories e Tasks (Software Craft, Design & Fundamentals, Architecture
& System Design, AI Engineering, Platform Engineering). São ~84 Stories e ~600 Tasks
no total, **sem ordem pedagógica garantida** e com **sobreposições relevantes entre
Epics**.

O objetivo é transformar o projeto no **Roadmap Senior**: uma aplicação/deck
navegável (Área → Módulo → Conceito, internamente Epic → Story → Task, compatível
com Jira) que representa todo o conhecimento a estudar/revisar para o nível sênior.

**A Fase 1 entrega SOMENTE a arquitetura macro para aprovação:**
lista final de Epics, lista ordenada de Stories por Epic, racional da ordem,
sobreposições (conceito canônico × revisita) e dependências de alto nível.
Não reordena nem detalha as ~600 Tasks. Não escreve conteúdo. Não implementa código.

Decisões tomadas pelo usuário:
- **Reestruturar Epics livremente** (dividir, promover, mover Stories), sempre justificando.
- **Duplicatas**: definir um ponto canônico (onde o conceito é ensinado pela 1ª vez);
  ocorrências posteriores viram aplicação/aprofundamento com `Requires: [canônico]`;
  se duas ocorrências ensinam a mesma coisa, **consolidar**.
- **Nomes** de Epic/Story/Task em inglês (alinhado à literatura e aos arquivos atuais);
  interface, racional e navegação em pt-BR.
- **Decks `harness` e `ai-fundamentals`**: preservados intactos. Saem da Home como itens
  principais e passam a ser `resources` vinculáveis a Stories/Tasks de AI Engineering.
  Nada de conteúdo é migrado agora — só a arquitetura precisa permitir o vínculo.

---

## 1. Análise do que existe hoje

### 1.1 Epics atuais (arquivos `roadmap/*.md`)

| Arquivo | Epic | Stories | Observação |
|---|---|---|---|
| `software-craft.md` | Software Craft | 10 | "Clean Code" sobrecarregada; "Testing" (17 tasks) é grande demais para Story |
| `design-e-fundamentals.md` | Design & Fundamentals | 16 | Saco de gatos: mistura fundamentos de linguagem + design + patterns + DDD. *Fase 2: 7 Stories de fundamentos já consumidas pelo Epic 01; as demais alimentam o Epic 04.* |
| `architecture-e-system-design.md` | Architecture & System Design | 14 | "Caching Architecture" quase 100% duplicada de Platform |
| `ai-engineering.md` | AI Engineering | 23 | Ordem temática, não pedagógica; "Production AI" repete conceitos |
| `platform-engineering.md` | Platform Engineering | 21 | Base sólida; ordem interna quase pedagógica já |

### 1.2 Conceitos no nível hierárquico errado / duplicados

| Conceito | Onde está | Problema | Correção proposta |
|---|---|---|---|
| `Coupling`, `Cohesion`, `Separation of Concerns` | Tasks repetidas em Software Craft, Design & F. e Architecture | Fundamento tratado como item pontual em 3 lugares | ✅ **Fases 2 · Epics 01/03/04/06**: canônico em Programming Foundations / Programming Fundamentals; nas demais Epics (Craft, Design, Architecture) aplicados via `Requires`/`revisit` em Tasks reais, nunca recriados como Task própria |
| `DRY`, `KISS`, `YAGNI` | Tasks dentro de `Clean Code` | Não são "clean code", são heurísticas de design | Story própria **Design Heuristics** (Software Craft) |
| `Pure Functions`, `Side Effects`, `Immutability` | Tasks em `Clean Code` **e** em `Functional Programming` | Duplicado | ✅ **Fase 2 · Epic 01**: canônico em Programming Foundations / Functional Programming; remover de Clean Code na Fase 2 do Epic 03 |
| `Testing` | Story (17 tasks) em Software Craft | Volume e importância de Epic | Promover a **Epic: Testing & Quality Engineering** |
| `Dependency Management` | Story em Software Craft **e** Story em Design & F. | Mesmo nome, assuntos diferentes (semver/deps × DI/IoC) | Renomear: `Dependency & Version Management` (Craft) e `Dependency Injection & IoC` (Design) |
| `Composition over Inheritance` / `Favor Composition over Inheritance` | 2 Tasks no mesmo Epic | Duplicado | **Fase 2 · Epic 01**: mecanismo `Composition` canônico em Programming Fundamentals; heurística realocada ao Epic 04 (consolidar lá) |
| `Dependency Inversion` (task) × `DIP` (SOLID) | 2 Tasks no mesmo Epic | Duplicado | Canônico em **SOLID / DIP**; a outra referencia |
| `Entity`, `Value Object` | `Object-Oriented Design` **e** `Domain Modeling` | Duplicado | ✅ **Fase 2 · Epic 04**: canônico em **Object-Oriented Design** (mecânica geral de identidade); `Domain Modeling` revisita com framing DDD (`canonical: false` + `revisitOf`). *(Inverte a proposta original da Fase 1 — mudança aprovada explicitamente.)* |
| `Bisect` / `Git Bisect` | `Git` **e** `Debugging` | Duplicado | ✅ **Fase 2 · Epic 02**: canônico `Git Bisect` em Testing & Quality / Debugging, `Requires: Epic 03 / Git` (forward-ref aceita). Epic 03 / Git terá revisita/referência |
| `Caching` (patterns) | Story inteira em Platform **e** em Architecture | ~90% duplicado | Canônico em **Platform / Caching**; Architecture mantém slim **Caching at Scale** com `Requires` |
| `CDN` / `CDN Architecture` | Platform/Caching **e** Architecture/Caching | Duplicado | Canônico Platform; Architecture referencia |
| `Prompt Versioning`, `Model Fallback`, `Rate Limiting`, `Retry Strategy` | Tasks em `Production AI` | Repetem conceitos de Prompt Eng. / Model Routing / Architecture | `Production AI` vira revisita explícita (`Requires`) |
| `Load Balancing`, `Auto Scaling` | Architecture/Scalability **e** Platform/Cloud | Conceito × primitivo de cloud | ✅ **Fase 2 · Epic 05**: conceito permanece canônico em **Architecture/Scalability**; `Load Balancer`/`Auto Scaling` em Platform/Cloud são `canonical: false` + `revisitOf` (o recurso concreto de cloud **não** vira nova casa canônica) |
| `Rate Limiting` | Production AI **e** *(Fase 1: Architecture/Resilience)* **e** Platform/API | Conceito de resiliência × quota de API | ✅ **Fase 2 · Epic 05** — **mudança não silenciosa**: canônico movido para **Platform / API Fundamentals** (token/leaky bucket, `429`, `Retry-After`); Architecture/Resilience e AI/Production AI revisitam |
| `Latency`, `Throughput` | Architecture/System Design **e** Platform/Performance | Duplicado | ✅ **Fase 2 · Epic 05**: canônico em **Platform / Performance Engineering** (+ `CPU-Bound vs I/O-Bound`, `Profiling` — este ganha lar canônico aqui); Architecture revisita "em escala" |
| `Idempotency` | Architecture/Resilience **e** Platform/API | Conceito × mecânica de idempotency-key | ✅ **Fase 2 · Epic 05**: `Idempotency Key` (mecânica HTTP) canônico em **Platform / API Fundamentals**; o conceito `Idempotency` de resiliência permanece canônico em **Architecture/Resilience**. *(Mudança não silenciosa vs Fase 1, que dizia só "Platform/API referencia".)* |
| `Consistency` | Architecture (modelos distribuídos) **e** Platform/DB Transactions (ACID) | Colisão de nome, sentidos diferentes | ✅ **Fase 2 · Epic 05**: `Consistency (ACID)` fica subtopic **nomeado** de `ACID` em Platform/DB Transactions; `Distributed Consistency` é Architecture — nota explícita de colisão |
| `N+1 Problem` / `N+1 Query Problem` | GraphQL **e** Database Performance | Mesmo conceito | ✅ **Fase 2 · Epic 05**: canônico em **Platform / Database Performance**; `GraphQL / N+1 in Resolvers` é `canonical: false` + `revisitOf` (não cria 2ª canônica) |
| `Backward Compatibility`, `Technical Debt`, `ADR` | Software Craft **e** Architecture Evolution | Duplicado | ✅ **Fase 2 · Epic 06**: canônico em **Software Craft**; `Architecture Evolution` aplica via `Requires` formal (não recria como Task própria) |
| `Least Privilege` | Authorization, Cloud Security, AI Safety | Repetido em 3 contextos | ✅ **Fase 2 · Epic 05**: canônico **Platform / Authorization**; `Least Privilege in Cloud` (Cloud Security) é `canonical: false` + `revisitOf`; AI Safety `Requires` |
| `Serverless` / `Serverless Architecture` | Platform/Cloud **e** Architecture/Styles | Primitivo × estilo | ✅ **Fase 2 · Epic 05**: primitivo canônico em **Platform / Cloud Fundamentals**; o estilo arquitetural revisita em Architecture / Architectural Styles |
| `Handoff` / `Agent Handoff` | Agent Orchestration **e** Multi-Agent Systems | Duplicado | Canônico **Multi-Agent Systems** |
| `Semantic Similarity` / `Semantic Similarity Evaluation` | Embeddings **e** AI Evaluation | Relacionados, não idênticos | Manter; `Evaluation` com `Requires: Embeddings` |

> A resolução Task-a-Task de cada linha acima acontece na **Fase 2**, Epic por Epic.

### 1.3 Conteúdo existente no app

- `presentations/harness/index.html` (36 slides) — cobre: Harness, Workflow/State, Model
  Abstraction, Training × Inference, Parameters, Context, Token, Context Window,
  Variabilidade, Guardrail/Validation/Gate, Retry/Repair/Fallback.
  → **resource** de: AI Fundamentals, Model Inference, Context Engineering,
  Agent Fundamentals, AI Safety & Guardrails.
- `presentations/ai-fundamentals/index.html` (3 slides placeholder) — → resource de AI Fundamentals.
- Pastas vazias `presentations/{building-ai-systems,context,retrieval-rag}/` — decks
  planejados, hoje cobertos pelas Stories de AI Engineering. Sem ação.

---

## 2. Epics — proposta aprovada (ordem pedagógica global)

```
ROADMAP SENIOR
├── 01 · Programming Foundations        (novo — extraído de Design & Fundamentals)
├── 02 · Testing & Quality Engineering  (novo — promovido de Software Craft / "Testing")
├── 03 · Software Craft
├── 04 · Software Design                (novo — extraído de Design & Fundamentals)
├── 05 · Platform Engineering
├── 06 · Architecture & System Design
└── 07 · AI Engineering
```

**Por que essa ordem de Epics**

1. **Programming Foundations** primeiro: abstração, encapsulamento, coupling/cohesion,
   tipos, funções puras, estruturas de dados, complexidade, async e concorrência são
   pré-requisito de tudo.
2. **Testing & Quality Engineering** cedo: você precisa saber testar antes de refatorar
   (Software Craft) e antes de confiar em qualquer design. A 1ª Story só exige "sei
   escrever uma função".
3. **Software Craft**: a disciplina diária de escrever e mudar código com segurança —
   depende de Foundations e usa Testing (Refactoring `Requires` Testing).
4. **Software Design**: estruturar código no nível de módulo/classe/domínio (OOD, SOLID,
   patterns, DDD). Depende de Foundations; alguns patterns de aplicação tocam Platform.
5. **Platform Engineering**: o substrato de execução — web, APIs, dados, segurança, ops,
   cloud. Pouca dependência conceitual, muito volume.
6. **Architecture & System Design**: desenhar sistemas que escalam, distribuem e evoluem.
   `Requires` Platform e Software Design.
7. **AI Engineering**: a especialização. `Requires` Platform (APIs, observabilidade,
   caching); "Production AI" `Requires` Architecture/Resilience. **Pode ser antecipado**
   por quem já atua na área.

O detalhamento completo de Stories por Epic (com racional e `Requires`) está em
**`roadmap/00-overview.md`** — evita-se duplicar aqui para manter uma única fonte da
verdade da estrutura.

**Detalhamento Task-a-Task (Fase 2), por Epic:**
- Epic 01 · Programming Foundations → **`roadmap/01-programming-foundations.md`**
  (aprovado 2026-09-03: 8 Stories, 79 Tasks). A ordem final das Stories passou a ser
  Programming Fundamentals · **Memory & Runtime** · Type Systems · Functional
  Programming · Data Structures · Algorithms & Complexity · Asynchronous Programming ·
  Concurrency.
- Epic 03 · Software Craft → **`roadmap/03-software-craft.md`** (aprovado
  2026-09-05: 9 Stories, 61 Tasks). Ordem final das Stories: Clean Code · Design
  Heuristics · Code Smells · Refactoring · Error Handling · Code Review ·
  Dependency & Version Management · Git · Engineering Documentation.
- Epic 04 · Software Design → **`roadmap/04-software-design.md`** (aprovado
  2026-09-05: 9 Stories, 56 Tasks). Ordem das Stories: Object-Oriented Design ·
  SOLID · Design Principles · Dependency Injection & IoC · Creational Patterns ·
  Structural Patterns · Behavioral Patterns · Enterprise & Application Patterns ·
  Domain Modeling.
- Epic 05 · Platform Engineering → **`roadmap/05-platform-engineering.md`** (aprovado /
  FROZEN 2026-09-05: 21 Stories, 187 Tasks). Ordem das Stories: Web Fundamentals ·
  API Fundamentals · GraphQL · Database Fundamentals · Database Design · Database
  Transactions · Database Performance · NoSQL · Caching · Authentication · Authorization ·
  Application Security · Observability · Performance Engineering · Reliability Engineering ·
  Containers · CI/CD · Cloud Fundamentals · Cloud Networking · Cloud Security ·
  Kubernetes Fundamentals.

---

## 3. Dependências de alto nível

```
Programming Foundations ──▶ (todos os demais Epics)
Testing & Quality ──▶ Software Craft / Refactoring
Software Craft ──▶ Architecture / Architecture Evolution   (ADR, Tech Debt)
             └──▶ Testing & Quality / Debugging            (Bisect ⟵ Git)
Software Design / Domain Modeling ──▶ Architecture / Architectural Styles
Software Design / Enterprise Patterns ⟵ Requires ── Platform / Database Fundamentals   (formalizado 2026-09-05 na Fase 2 do Epic 05 — grafo acíclico)
Software Design / Chain of Responsibility (SUGESTÃO) ──▶ Platform / API Fundamentals / Middleware / Request Pipeline
Platform Engineering ──▶ Architecture & System Design      (Epic inteiro)
                    └──▶ AI Engineering                     (APIs, Observability, Caching)
Platform / API Fundamentals / Rate Limiting, Idempotency Key ──▶ Architecture / Resilience Patterns   (revisita — Rate Limiting mudou de casa canônica vs Fase 1)
Platform / Cloud Fundamentals / Load Balancer, Auto Scaling ⟵ revisitOf ── Architecture / Scalability   (forward-ref, acíclico)
Architecture / Resilience Patterns ──▶ AI Engineering / Production AI
Platform / Observability ──▶ AI Engineering / AI Observability

--- formalizado na Fase 2 do Epic 06 (2026-09-08) ---
Software Design / SOLID / DIP ──▶ Architecture / Architecture Fundamentals / Dependency Direction   (revisita, pointer)
Software Design / Design Principles / CQS ──▶ Architecture / Data & Architecture Patterns / CQRS   (revisita, pointer — sem Requires formal)
Platform / Performance Engineering / Throughput ──▶ Architecture / System Design Fundamentals / Capacity Estimation   (Requires formal)
```

Tabela de conceitos transversais (canônico × revisita): `roadmap/00-overview.md`.

---

## 4. Mudanças estruturais vs. arquivos atuais

| # | Mudança | Justificativa |
|---|---|---|
| 1 | `Design & Fundamentals` → **`Programming Foundations`** + **`Software Design`** | 16 Stories misturavam mecânica de linguagem com design de software |
| 2 | Story `Testing` → **Epic `Testing & Quality Engineering`** | 17 tasks; pré-requisito de Refactoring e de confiança em design |
| 3 | `Debugging` movido: Software Craft → Testing & Quality | disciplina de diagnóstico de qualidade |
| 4 | `Clean Code` dividida em `Clean Code` + `Design Heuristics` | DRY/KISS/YAGNI são heurísticas de design |
| 5 | `Codebase Maintainability` → `Dependency & Version Management` | evita colisão de nome com Software Design |
| 6 | `Architecture / Caching Architecture` → slim `Caching at Scale` | ~90% era duplicata de Platform / Caching |
| 7 | AI Engineering reordenado (temático → pedagógico); `Production AI` = revisita | ordem original agrupava por tema |
| 8 | `Domain Modeling` = capstone de Software Design e ponte para Architecture | Bounded Context é pré-requisito de microservices |

---

## 5. SUGESTÕES (lacunas — não adicionar sem aprovação)

**Epics ausentes para um sênior full-stack:**
- **Frontend Engineering** — rendering do browser, DOM, componentes, state management,
  performance de rendering, acessibilidade, bundling.
- **Engineering Leadership & Communication** — mentoria técnica, conduzir RFCs,
  estimativa, fatiamento de escopo, comunicação com stakeholders, incident command.
- **Data Engineering** — batch × stream, ETL/ELT, data warehouse/lake, Airflow/Spark.

**Stories ausentes (dentro dos Epics propostos):**
- Programming Foundations → ~~`Memory & Runtime`~~ ✅ **aprovada** na Fase 2 · Epic 01 (Story 02)
- Testing & Quality → `Non-Functional Testing`
- Software Craft → `Build & Tooling`
- Platform Engineering → `Infrastructure as Code`
- AI Engineering → `Responsible AI & Governance`, `LLM Cost Engineering`

---

## 6. Fases

**Fase 2 — Detalhamento Epic por Epic** (uma rodada por Epic, com aprovação):
ordenar as Tasks, definir `Requires` por Task, marcar conceito canônico × revisita
contextual, consolidar duplicatas Task-a-Task, registrar SUGESTÕES de Task.
**Não avançar automaticamente entre Epics.**

| Epic | Estado | Arquivo |
|---|---|---|
| 01 · Programming Foundations | ✅ Concluído 2026-09-03 — 8 Stories, 79 Tasks | `roadmap/01-programming-foundations.md` |
| 02 · Testing & Quality Engineering | ✅ Concluído 2026-09-03 — 5 Stories, 31 Tasks | `roadmap/02-testing-quality-engineering.md` |
| 03 · Software Craft | ✅ Concluído 2026-09-05 — 9 Stories, 61 Tasks | `roadmap/03-software-craft.md` |
| 04 · Software Design | ✅ Concluído 2026-09-05 — 9 Stories, 56 Tasks | `roadmap/04-software-design.md` |
| 05 · Platform Engineering | ✅ Concluído / FROZEN 2026-09-05 — 21 Stories, 187 Tasks | `roadmap/05-platform-engineering.md` |
| 06 · Architecture & System Design | ✅ Concluído / FROZEN 2026-09-08 — 14 Stories, 93 Tasks | `roadmap/06-architecture-system-design.md` |
| 07 · AI Engineering | ⏳ Não iniciado — herda: `AI Evaluation` revisita `Test Doubles`/`Regression Testing` (Epic 02) | — |

**Total de Tasks no roadmap (Epics 01–06): 507.**

**Fase 3 — Implementação visual · 1ª versão** (✅ implementada):
- Home com os **7 Epics** como cards coloridos.
- Navegação completa **Área → Módulo → Conceito para os Epics com Fase 2
  concluída — agora 01–06**.
- Epic 07: card na Home, sem drill-down até sua própria Fase 2.
- Converter `roadmap/0N-*.md` em `data/roadmap.js`; construir router por hash +
  views; preparar (sem ativar) o modelo de progresso.
- Arquitetura de referência: Anexo abaixo.

---

## Anexo — Arquitetura técnica (referência para a Fase 3)

Mantém o estilo atual: sem build, sem framework, IIFE + `window.App`.

- **Dado**: `data/roadmap.js` único (`window.App.roadmap = [...]`), árvore aninhada
  Epic → Story → Task. Só metadados/títulos/ordem/resources; conteúdo futuro da Task
  fica fora (slot `content: null`). ~200 objetos ≈ um `<script>` síncrono resolve.
- **Schema (resumo)**: cada nó tem `id` estável e imutável (chave de rota e de
  progresso), `jiraType` (`"epic"|"story"|"task"`), `title`, `slug`, `order` esparso
  (10, 20, 30…); Epic tem `color`; Task tem `resources[]`
  (`{type:"deck", deckId}` resolve via `App.presentations`) e `jiraKey` (null agora,
  para sync futuro com Jira).
- **Navegação**: `index.html` único + roteamento por hash
  (`#/`, `#/e/:epic`, `#/e/:epic/s/:story`, `#/e/:epic/s/:story/t/:task` reservada).
  Hash funciona em `file://` e host estático; deep-link e botão voltar nativos.
- **Módulos novos** (IIFE): `js/roadmap/data.js` (`App.roadmapModel` — acessores +
  `flattenTasks()` para ordem pedagógica global), `router.js`, `views.js`
  (`renderHome/renderEpic/renderStory` via `createElement`), `app.js` (bootstrap).
  `js/home.js` é substituído; `js/navigation.js` fica intocado (exclusivo dos decks).
- **Progresso** (preparado, atrás de `App.config.progressEnabled = false`):
  `js/roadmap/progress.js` com `App.progress` (`getStatus/setStatus/cycleStatus`,
  `rollup(node) → {done,total}`, `nextRecommendedTask()`); persistência em
  `localStorage` chave `App:roadmap:progress:v1` = `{ "<taskId>": "STUDYING"|"DONE" }`.
  API sempre existe; só a UI de status/contadores/"CONTINUAR ESTUDANDO" é condicionada.
- **Estilo**: novo `css/roadmap.css` (só na Home). Cor por Epic = `el.style.setProperty
  ("--epic-color", epic.color)` + `var(--epic-color)` no CSS; zero CSS por-Epic.
  `css/{layout,components,diagram}.css` continuam exclusivos dos decks.
- **Compat**: `data/presentations.js` mantido como registro de decks (catálogo de
  `resources`). `home__intro` "Papo de IA" vira o masthead da Home do Roadmap.
  Decks e `js/navigation.js` intocados.
