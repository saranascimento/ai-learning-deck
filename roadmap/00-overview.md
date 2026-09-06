# Roadmap Senior — Visão macro

> Estrutura macro (Epics → Stories) **aprovada em 2026-09-03**. Fonte da verdade da
> hierarquia. O detalhamento Task-a-Task acontece na Fase 2, um Epic por vez.
>
> **Fase 2 em andamento** — Epics 01 · Programming Foundations e 02 · Testing & Quality
> Engineering concluídos (2026-09-03), 03 · Software Craft e 04 · Software Design
> concluídos (2026-09-05), 05 · Platform Engineering concluído / **FROZEN**
> (2026-09-05), ver `01-programming-foundations.md`, `02-testing-quality-engineering.md`,
> `03-software-craft.md`, `04-software-design.md` e `05-platform-engineering.md`.
> Progresso completo no fim deste arquivo.
> **Próximo**: Fase 3 — 1ª versão visual (7 Epics na Home + navegação completa só para
> os Epics 01–05).
>
> Registro completo da decisão (contexto, análise, arquitetura técnica): `../PLAN.md`.

Modelo mental: **Área → Módulo → Conceito** na interface; **Epic → Story → Task**
internamente (compatível com Jira). Numeração = ordem recomendada de estudo.

---

## Epics (ordem de estudo global)

```
ROADMAP SENIOR
├── 01 · Programming Foundations        (novo — extraído de "Design & Fundamentals")
├── 02 · Testing & Quality Engineering  (novo — promovido da Story "Testing")
├── 03 · Software Craft
├── 04 · Software Design                (novo — extraído de "Design & Fundamentals")
├── 05 · Platform Engineering
├── 06 · Architecture & System Design
└── 07 · AI Engineering
```

**Por que essa ordem**

1. **Programming Foundations** — abstração, encapsulamento, coupling/cohesion, memória
   e runtime, tipos, funções puras, estruturas de dados, complexidade, async,
   concorrência. Pré-requisito de tudo. *(Fase 2 aprovada: 8 Stories, 79 Tasks.)*
2. **Testing & Quality Engineering** — saber testar antes de refatorar (Craft) e antes
   de confiar em qualquer design. A 1ª Story só exige "sei escrever uma função".
   *(Fase 2 aprovada: 5 Stories, 31 Tasks. Inclui a Story `Debugging`, movida de
   Software Craft.)*
3. **Software Craft** — disciplina diária de escrever e mudar código com segurança.
   Depende de Foundations; Refactoring `Requires` Testing. *(Fase 2 aprovada: 9
   Stories, 61 Tasks.)*
4. **Software Design** — estrutura no nível de classe/módulo/domínio (OOD, SOLID,
   patterns, DDD). Depende de Foundations. *(Fase 2 aprovada: 9 Stories, 56 Tasks.)*
5. **Platform Engineering** — o substrato de execução: web, APIs, dados, segurança,
   ops, cloud. Pouca dependência conceitual, muito volume. *(Fase 2 aprovada / FROZEN:
   21 Stories, 187 Tasks.)*
6. **Architecture & System Design** — sistemas que escalam, distribuem e evoluem.
   `Requires` Platform + Software Design.
7. **AI Engineering** — a especialização. `Requires` Platform; "Production AI"
   `Requires` Architecture/Resilience. Pode ser antecipado por quem já atua na área
   (só depende de Platform).

---

## Stories por Epic

### 01 · Programming Foundations

> **Fase 2 aprovada em 2026-09-03.** Detalhamento Task-a-Task: `01-programming-foundations.md`.
> 8 Stories · 79 Tasks (77 originais preservadas — 76 aqui + `Composition over
> Inheritance` realocada ao Epic 04; +7 novas: 6 em `Memory & Runtime`, `Closure`).

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | Programming Fundamentals | 11 | **canônico**: Abstraction, Encapsulation, Information Hiding, Interface, Contract, Inheritance, Polymorphism, Composition, Coupling, Cohesion, Separation of Concerns |
| 02 | Memory & Runtime | 6 | *(nova)* **canônico**: Memory, Value vs Reference, Stack vs Heap, Call Stack, Garbage Collection, Memory Leak · Requires: Programming Fundamentals |
| 03 | Type Systems | 10 | **canônico**: Static/Dynamic, Strong/Weak, Type Inference, Type Safety, Nominal/Structural Typing, Generics, Union/Intersection Types, Type Narrowing · Requires: Programming Fundamentals |
| 04 | Functional Programming | 12 | **canônico**: Declarative/Imperative, First-Class Functions, Closure, Side Effects, Pure Functions, Referential Transparency, Immutability, HOF, Function Composition, Map/Filter/Reduce · Requires: Programming Fundamentals |
| 05 | Data Structures | 10 | **canônico**: Array, Linked List, Stack, Queue, Hash Table, Set, Tree, BST, Heap, Graph · Requires: Programming Fundamentals; Type Systems/Generics |
| 06 | Algorithms & Complexity | 9 | **canônico**: Time/Space Complexity, Big O, Common Time Complexities *(O(1)…O(n²) consolidadas, cada uma subtópico)*, Linear/Binary Search, Sorting Fundamentals, Recursion, Memoization · Requires: Data Structures; Memory & Runtime/Call Stack |
| 07 | Asynchronous Programming | 9 | **canônico**: Sync/Async *(agnóstico)*, Blocking/Non-Blocking *(agnóstico)*, Callback, Task Queue, Event Loop, Microtask Queue, Promise, Async/Await · `Call Stack` = revisita de Memory & Runtime · Requires: Programming Fundamentals; FP/First-Class Functions + Closure; Memory & Runtime/Call Stack |
| 08 | Concurrency | 12 | **canônico**: Concurrency/Parallelism, Process, Thread, Shared State, Race Condition, Critical Section, Atomic Operation, Mutex, Semaphore, Deadlock, Starvation, Thread Safety · Requires: Asynchronous Programming; Memory & Runtime |

Racional: vocabulário de paradigma (01) → como o programa existe em memória e executa
(02) → tipos formalizam contratos (03) → pureza/imutabilidade usadas em todo o resto
(04) → estruturas de dados (05) → analisar algoritmos sobre elas (06) → modelo
assíncrono de execução (07) → concorrência, o superconjunto difícil (08).
`Memory & Runtime` é Story 02 porque `Call Stack` é pré-requisito de `Recursion`
(06) e `Event Loop` (07).

**Duplicatas resolvidas nesta Epic** (canônico aqui; vira revisita/removido nas Fases
2 dos Epics 03 e 06):
- `Coupling` / `Cohesion` / `Separation of Concerns` — eram Tasks em Software Craft e Architecture.
- `Pure Functions` / `Side Effects` / `Immutability` — eram Tasks em Software Craft / "Clean Code".
- `Composition over Inheritance` — mecanismo `Composition` fica aqui; heurística consolida no Epic 04.

**Colisões de nome a desambiguar**: `Composition` (01) ≠ `Function Composition` (04) ·
`Stack` ADT (05) ≠ `Call Stack` (02) · `Queue` ADT (05) ≠ `Task Queue` (07) ·
`Atomic Operation` (08) ≠ ACID `Atomicity` (Platform) · `Concurrency` (08) ≠ `Asynchronous` (07).

*SUGESTÕES de Task* (não incluídas): FP → `Currying`, `Functor/Monad (intuição)`,
`Lazy Evaluation`; Algorithms → `Divide and Conquer`, `Dynamic Programming`,
`Graph Traversal (BFS/DFS)`; Concurrency → `Context Switch`, `Thread Pool`,
`Actor Model`; Type Systems → `Variance`, `Algebraic Data Types`; Memory & Runtime →
`Stack Overflow`, `Boxing/Unboxing`. Lista completa no arquivo do Epic.

### 02 · Testing & Quality Engineering

> **Fase 2 aprovada em 2026-09-03.** Detalhamento Task-a-Task: `02-testing-quality-engineering.md`.
> 5 Stories · 31 Tasks (24 originais preservadas + 7 novas: `Assertion`, `Test Fixture`,
> `Test Runner`, `Dummy`, `Red-Green-Refactor`, `Code Coverage`, `Property-Based Testing`).

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | Testing Fundamentals | 8 | **canônico**: Unit/Integration/E2E Testing, Assertion, Arrange-Act-Assert, Given-When-Then, Test Fixture, Test Runner · Requires: Epic 01 / Programming Fundamentals |
| 02 | Test Doubles | 6 | **canônico**: Test Doubles, Dummy, Stub, Fake, Spy, Mock · Dummy/Stub/Fake/Spy/Mock dependem **só** de `Test Doubles` · Requires: Testing Fundamentals; Epic 01 / Interface |
| 03 | Test-Driven Development | 2 | **canônico**: Test-Driven Development, Red-Green-Refactor · Requires: Testing Fundamentals · *sem `Requires` para Epic 03 / Refactoring (evita ciclo)* |
| 04 | Testing Strategy | 8 | **canônico**: Test Pyramid, Code Coverage, Testability, Test Isolation, Flaky Tests, Regression Testing, Property-Based Testing, Contract Testing · Requires: Testing Fundamentals, Test Doubles |
| 05 | Debugging | 7 | **canônico**: Reproduction, Hypothesis-Driven Debugging, Stack Trace, Breakpoints, Binary Search Debugging, Git Bisect, Root Cause Analysis · Requires: Testing Fundamentals; Epic 01 / Call Stack; Epic 01 / Binary Search |

Racional (ordem de estudo, **não** cadeia de `Requires`): fundamentos (escrever *um*
teste) → dublês (isolar a unidade) → TDD (disciplina que dirige o design) → estratégia
(onde investir esforço) → debugging (diagnóstico quando um teste falha; fecha o Epic e
liga a Platform / Reliability Engineering).

**Duplicata resolvida**: `Git Bisect` é **canônico aqui** (Story 05); na Fase 2 do
Epic 03 a Task `Bisect` da Story `Git` vira revisita/referência a esta Task.
**Forward-reference aceita**: `Git Bisect` `Requires` `Epic 03 / Git` (Git não depende
de nada do Epic 02 — acíclico).

**Colisões a desambiguar**: `Assertion` (teste) ≠ `assert`/invariante em runtime ·
`Fake` ≠ `Fake Model` (AI) · `Mock` preciso ≠ "mock" coloquial · `Code Coverage` ≠
"test coverage" coloquial · `Integration Testing` ≠ `Continuous Integration` ·
`Regression Testing` ≠ `Regression Evaluation` (AI) · `Contract Testing` ≠ `API
Contract` ≠ `Contract` (Epic 01) · `Stack Trace` ≠ `Call Stack` ≠ `Stack` ADT.

*SUGESTÃO de Story:* `Non-Functional Testing` (load, stress, performance, security).
*SUGESTÕES de Task* (não incluídas): `BDD`, `Snapshot Testing`, `Mutation Testing`,
`Test Case`/`Test Suite`, `Seam`, `Mocking Framework`, `Testing Trophy`,
`Debugger (ferramenta)`, `Logging for Debugging`, `Rubber Duck`, `git blame`,
`Observability-Driven Debugging`. Lista completa no arquivo do Epic.

### 03 · Software Craft

> **Fase 2 aprovada em 2026-09-05.** Detalhamento Task-a-Task: `03-software-craft.md`.
> 9 Stories · 61 Tasks. Removidas de `Clean Code`: `Pure Functions`, `Side Effects`,
> `Immutability` (canônico no Epic 01 / Functional Programming). `Bisect` (Story `Git`)
> deixa de ser canônico — vira revisita de `Testing & Quality Engineering / Debugging /
> Git Bisect`. Tasks guarda-chuva novas: `Refactoring`, `Code Review`, `Errors vs
> Exceptions`. Consolidação: 5 Tasks "Review for X" → 1 Task `Review Dimensions` com
> `subtopics`.

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | Clean Code | 6 | **canônico**: Naming, Functions, Function Arguments, Guard Clauses, Comments, Magic Numbers |
| 02 | Design Heuristics | 4 | **canônico**: DRY, KISS, YAGNI, Principle of Least Astonishment · paralela a Clean Code |
| 03 | Code Smells | 6 | **canônico**: Duplicate Code, Long Method, Long Parameter List, Large Class, Feature Envy, Primitive Obsession · Requires: Clean Code, Design Heuristics |
| 04 | Refactoring | 11 | **canônico**: Refactoring (guarda-chuva), Extract Function, Extract Variable, Rename, Inline Function, Extract Class, Move Function, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Parameter Object, Refactoring with Tests · Requires: Code Smells; Testing & Quality Engineering |
| 05 | Error Handling | 7 | **canônico**: Errors vs Exceptions (guarda-chuva), Exceptions, Error Propagation, Custom Errors, Fail Fast, Result Pattern, Error Boundaries |
| 06 | Code Review | 4 | **canônico**: Code Review (guarda-chuva), Review Dimensions *(subtopics: Correctness, Readability, Maintainability, Testability, Security)*, Review Scope, Giving & Receiving Feedback · Requires: Clean Code |
| 07 | Dependency & Version Management | 7 | **canônico**: Technical Debt, Legacy Code, Semantic Versioning, Backward Compatibility, Deprecation, Dependency Management, Incremental Migration — renomeado de "Codebase Maintainability" |
| 08 | Git | 11 | **canônico**: Commit, Merge, Rebase, Interactive Rebase, Merge Conflicts, Cherry-pick, Revert, Reset, Reflog, Branching Strategies · `Git Bisect` **[R]** revisita de Testing & Quality Engineering / Debugging (não-canônico) |
| 09 | Engineering Documentation | 5 | **canônico**: README, Changelog, ADR, RFC, Runbook |

Racional: legibilidade → heurísticas → reconhecer código ruim → corrigir com segurança
(exige testes) → lidar com falha → colaboração → manter codebase vivo → dominar o
histórico → comunicar decisões.

**Duplicatas resolvidas nesta Epic** (canônico em outra Epic já aprovada; vira
revisita/removido aqui):
- `Pure Functions` / `Side Effects` / `Immutability` — canônico em Programming
  Foundations / Functional Programming; removidas de `Clean Code`.
- `Git Bisect` — canônico em Testing & Quality Engineering / Debugging; a Task
  `Git Bisect` em `Git` é `canonical: false` + `revisitOf`, mesmo padrão de `Call
  Stack` em Asynchronous Programming (Epic 01).

**Colisões de nome a desambiguar**: `Guard Clauses` (Clean Code) ≠ `Type Narrowing`
(Epic 01) · `Duplicate Code` (smell) ≠ `DRY` (heurística) · trio intencional
`Long Parameter List` / `Function Arguments` / `Introduce Parameter Object` ·
`Speculative Generality` (não incluída) ≈ `YAGNI` · `Replace Magic Number with
Constant` (não incluída) ≠ `Magic Numbers` · `Squash` (não incluído) ≠ `Interactive
Rebase` · `Review Dimensions` ≠ `Testability` (Epic 02) · `API Documentation` (não
incluída) ≠ `Comments` · `Git Bisect` (canônico no Epic 02) ≠ `Git Bisect` (aqui,
revisita). Lista completa com distinções: `03-software-craft.md`.

*SUGESTÕES de Task* (não incluídas): `Dead Code`, `Shotgun Surgery` / `Divergent
Change`, `Data Clumps`, `Speculative Generality` (Code Smells); `API Documentation`
(Platform, futuro). *SUGESTÃO de Story:* `Build & Tooling` (build systems,
linters/formatters, pre-commit, monorepo × polyrepo). Lista completa no arquivo do
Epic.

### 04 · Software Design

> **Fase 2 aprovada em 2026-09-05.** Detalhamento Task-a-Task: `04-software-design.md`.
> 9 Stories · 56 Tasks (versão enxuta — Structural 7→5, Behavioral 11→5; patterns
> retirados viram SUGESTÃO). `Composition over Inheritance` consolidada aqui como Task
> única (heurística realocada do Epic 01). `Law of Demeter` + `Principle of Least
> Knowledge` = 1 Task. `Entity`/`Value Object` **canônicos em Object-Oriented Design**;
> `Domain Modeling` os revisita com framing DDD (`canonical: false` + `revisitOf`).

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | Object-Oriented Design | 9 | **canônico**: Object vs Class, Identity, Entity, Value Object, Mutable vs Immutable Objects, Tell Don't Ask, Law of Demeter (Least Knowledge), Anemic/Rich Domain Model · Requires: Programming Foundations / Programming Fundamentals |
| 02 | SOLID | 5 | **canônico**: SRP, OCP, LSP, ISP, DIP · LSP/ISP/DIP revisitam Inheritance/Polymorphism/Interface (Epic 01) · Requires: Object-Oriented Design |
| 03 | Design Principles | 4 | **canônico**: CQS, Encapsulate What Varies, Program to an Interface, Composition over Inheritance *(heurística realocada do Epic 01)* · Requires: SOLID |
| 04 | Dependency Injection & IoC | 5 | **canônico**: IoC, Dependency Injection, Constructor Injection, DI Container, Service Locator · `Dependency Injection` revisita Testability (Epic 02) · Requires: SOLID / DIP |
| 05 | Creational Patterns | 5 | **canônico**: Factory Method, Abstract Factory, Builder, Prototype, Singleton · Requires: Design Principles |
| 06 | Structural Patterns | 5 | **canônico**: Adapter, Decorator, Facade, Proxy, Composite · Requires: Design Principles *(não Creational Patterns)* · SUGESTÃO: Bridge, Flyweight |
| 07 | Behavioral Patterns | 5 | **canônico**: Strategy, Observer, Command, State, Template Method · Requires: Design Principles *(não Structural Patterns)* · SUGESTÃO: Chain of Responsibility *(Advanced/Optional — retomar no Epic 05)*, Iterator, Mediator, Memento, Visitor, Interpreter |
| 08 | Enterprise & Application Patterns | 7 | **canônico**: Repository, Data Mapper, Active Record, Unit of Work, Service Layer, Specification, DTO · Requires: Dependency Injection & IoC *(+ pendência futura: Platform / Database Fundamentals, sem Requires formal)* |
| 09 | Domain Modeling | 11 | **canônico**: Domain, Domain Model, Ubiquitous Language, Aggregate, Aggregate Root, Domain Service, Domain Event, Bounded Context, Context Mapping · `Entity`/`Value Object` = revisita de OOD (`canonical: false`) · Requires: Object-Oriented Design |

Racional: vocabulário OOD → SOLID (precisa de OOD) → princípios de design → DI/IoC
(precisa de DIP) → catálogos GoF (Creational · Structural · Behavioral — apresentados
na ordem clássica, mas **sem cadeia de `Requires` entre as famílias**: as três só
`Requires` Design Principles) → padrões de aplicação/persistência → Domain Modeling
como capstone e ponte para Architecture.

**Duplicatas resolvidas nesta Epic**:
- `Composition over Inheritance` — mecanismo `Composition` canônico no Epic 01; a
  heurística é Task única aqui (`Design Principles`).
- `Entity` / `Value Object` — canônico em `Object-Oriented Design`; `Domain Modeling`
  revisita (`canonical: false` + `revisitOf`), mesmo padrão de `Git Bisect` (Epic 03).
- `Law of Demeter` = `Principle of Least Knowledge` — 1 Task só, em OOD.
- Excluídas como Task própria: `Principle of Least Astonishment` (canônico no Epic 03),
  `High Cohesion / Low Coupling` (canônico Epic 01), `Dependency`, `Dependency
  Inversion` (= DIP), `Dependency Graph`.

**Colisões a desambiguar**: `Command` (pattern) ≠ `Command-Query Separation` ·
`Domain Service` ≠ `Service Layer` · `Composition` (Epic 01) ≠ `Composition over
Inheritance` · `Entity`/`Value Object` canônico (OOD) ≠ revisita (Domain Modeling).

*SUGESTÕES de Task* (não incluídas): `Bridge`, `Flyweight`, `Chain of Responsibility`
*(Advanced/Optional — retomar na Fase 2 do Epic 05 · Platform, relação com middleware)*,
`Iterator`, `Mediator`, `Memento`, `Visitor`, `Interpreter`, `Modularity` /
`Encapsulation Boundaries`. Lista completa no arquivo do Epic.

> `Enterprise & Application Patterns` (08) `Requires: Platform / Database Fundamentals`
> — **dependência formalizada na Fase 2 do Epic 05 (2026-09-05)**; grafo acíclico.
> `Domain Modeling` (09) é `Requires` de Architecture / Architectural Styles.

### 05 · Platform Engineering

> **Fase 2 aprovada / FROZEN em 2026-09-05.** Detalhamento Task-a-Task:
> `05-platform-engineering.md`. **21 Stories · 187 Tasks** (183 canônicas · 4
> `canonical: false` + `revisitOf`). 46 consolidações auditadas + 9 rebaixamentos
> §C/§D + 2 renomeações vendor-agnostic (`Redis` → `In-Memory Data Store`;
> `DataLoader` → `Batching & Per-Request Caching`). ~30 `Requires` de ordem de
> estudo removidos (4 invertidos corrigidos). `TLS` Task própria; `HTTPS` subtopic.
> `Middleware / Request Pipeline` **nova** (ancora o `Chain of Responsibility` que
> segue SUGESTÃO no Epic 04).

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | Web Fundamentals | 16 | **canônico**: HTTP (+ methods/status/headers/evolution), TLS, DNS, TCP/UDP, URL Anatomy, SOP, CORS, Cookies, Sessions, WebSocket, SSE |
| 02 | API Fundamentals | 15 | **canônico**: API Contract, REST, Request Validation *(contrato/boundary)*, Pagination, **Idempotency Key**, **Rate Limiting**, API Versioning/Deprecation, OpenAPI, **Middleware / Request Pipeline** *(nova)* · Requires: Web Fundamentals |
| 03 | GraphQL | 7 | **canônico**: GraphQL Schema & Type System, Resolver, Batching & Per-Request Caching, Query Complexity · `N+1 in Resolvers` = revisita de Database Performance · Requires: API Fundamentals |
| 04 | Database Fundamentals | 10 | **canônico**: SQL, Table, Keys, Constraint, JOIN, Aggregate & GROUP BY, Subqueries & CTEs, Schema |
| 05 | Database Design | 7 | **canônico**: Data Modeling, Relationship Cardinality, Normalization, Normal Forms, Denormalization, Natural vs Surrogate Key, Migration · Requires: Database Fundamentals |
| 06 | Database Transactions | 7 | **canônico**: ACID *(A/C/D consolidados)*, Isolation Levels, Read Phenomena, Optimistic/Pessimistic Locking · Requires: Database Fundamentals |
| 07 | Database Performance | 7 | **canônico**: Index (+ Selectivity sub), Composite Index, Query Plan, Query Optimization, **N+1 Query Problem**, Connection Pool, Slow Query Analysis · Requires: Database Design |
| 08 | NoSQL | 4 | **canônico**: SQL vs NoSQL, NoSQL Data Models, Schema-on-Read, Choosing SQL vs NoSQL · Requires: Database Design |
| 09 | Caching | 9 | **canônico**: Cache (+ hit/miss sub), TTL, Invalidation, Eviction, Cache-Aside, Read/Write-Through/Write-Behind, **In-Memory Data Store** *(sub: Redis/Valkey/Memcached)*, Browser & HTTP Cache, CDN · Requires: Web Fundamentals, Database Fundamentals |
| 10 | Authentication | 10 | **canônico**: Session vs Token, Password Hashing, JWT, Access & Refresh Token, OAuth 2.0, OIDC, SSO, MFA · Requires: Web Fundamentals |
| 11 | Authorization | 5 | **canônico**: RBAC, ABAC, Permission-Based, **Principle of Least Privilege**, Resource Ownership · Requires: Authentication |
| 12 | Application Security | 14 | **canônico**: Threat Modeling, OWASP Top 10, SQLi/XSS/CSRF/SSRF/BAC, **Input Validation** *(segurança)*, Output Encoding, CSP, Security Headers, Secrets Management, Encryption at Rest & in Transit, Dependency Vulnerabilities · Requires: Authentication, Authorization, Web Fundamentals |
| 13 | Observability | 9 | **canônico**: Observability vs Monitoring, Logging, Structured Logging, Correlation ID, Metrics (+ Dashboard sub), Distributed Tracing, OpenTelemetry, Alerting |
| 14 | Performance Engineering | 10 | **canônico**: **Latency**, **Throughput**, **CPU-Bound vs I/O-Bound**, **Profiling**, Benchmarking, Bottleneck Analysis, Lazy vs Eager Loading, Debounce/Throttle, Compression · Requires: Observability |
| 15 | Reliability Engineering | 8 | **canônico**: SLI, SLO, SLA, Error Budget, Incident, MTTD/MTTR, Incident Response, Postmortem (Blameless) · Requires: Observability |
| 16 | Containers | 7 | **canônico**: Container, Container vs VM, Docker, Docker Image (+ Dockerfile sub), Registry, Docker Volumes & Networks (+ Compose sub), Multi-Stage Build |
| 17 | CI/CD | 11 | **canônico**: CI, CD (delivery/deployment), Pipeline, Build, Artifact, Deployment, Environments & Configuration, Feature Flags, Rollback, Deployment Strategies · Requires: Containers |
| 18 | Cloud Fundamentals | 9 | **canônico**: Cloud Computing, Service Models, Region/AZ, Compute & VM, Cloud Storage Types, Managed Database, **Serverless** *(primitivo)* · `Load Balancer`/`Auto Scaling` = revisita de Architecture / Scalability · Requires: Containers |
| 19 | Cloud Networking | 6 | **canônico**: VPC, Subnet, CIDR & IP Address, Firewall & Security Group, NAT & Internet Gateway, DNS in Cloud · Requires: Web Fundamentals |
| 20 | Cloud Security | 7 | **canônico**: IAM, User vs Role, Policy, Service Account, Secret Manager, Shared Responsibility Model · `Least Privilege in Cloud` = revisita de Authorization · Requires: Authorization, Cloud Fundamentals |
| 21 | Kubernetes Fundamentals | 9 | **canônico**: Kubernetes, Cluster & Node, Pod, Deployment & ReplicaSet, Service, Ingress, ConfigMap & Secret, HPA, Liveness & Readiness Probes · Requires: Containers, Cloud Networking |

Racional: protocolo web → REST → GraphQL (contraste) → banco relacional
(fundamentos → modelagem → transações → performance) → NoSQL → caching → auth → authz
→ segurança → observabilidade → performance/confiabilidade → containers → CI/CD →
cloud → rede → segurança de cloud → Kubernetes.

**Mudanças não silenciosas nesta Epic** (vs Fase 1):
- **`Rate Limiting`** canônico passa de `Architecture / Resilience Patterns` para
  **`Platform / API Fundamentals`** (Epic 06 e Epic 07 revisitam).
- **`Idempotency Key`** (mecânica HTTP) canônico em `Platform / API Fundamentals`;
  o conceito `Idempotency` de resiliência permanece canônico em
  `Architecture / Resilience Patterns`.
- **`Middleware / Request Pipeline`** — Task nova canônica (não estava na macro).
- **`Profiling`** ganha lar canônico em `Platform / Performance Engineering`.
- **`Epic 04 / Enterprise & Application Patterns`** `Requires: Platform / Database
  Fundamentals` — **formalizado** (era pendência sem `Requires` formal).

`N+1 Query Problem` permanece canônico em `Platform / Database Performance` (= Fase 1);
`GraphQL / N+1 in Resolvers` revisita. `Serverless` primitivo canônico em Platform;
`Load Balancing`/`Auto Scaling` permanecem canônicos em `Architecture / Scalability`
(Cloud = revisita).

*SUGESTÃO de Story:* `Infrastructure as Code` (Terraform/Pulumi, state, drift,
plan/apply, módulos) · `Non-Functional Testing` (load/stress/soak/spike, DAST, chaos).

*SUGESTÃO de Story:* `Infrastructure as Code` (Terraform, state, drift, módulos).

### 06 · Architecture & System Design

| # | Story | Notas |
|---|---|---|
| 01 | Architecture Fundamentals | Architecture vs Design, Characteristics, Constraints, Trade-offs (Coupling/Cohesion → Requires Foundations) |
| 02 | Architectural Styles | Requires: Architecture Fundamentals, Software Design / Domain Modeling |
| 03 | System Design Fundamentals | Functional/NFR, Capacity Estimation, Bottlenecks, SPOF |
| 04 | Scalability | **canônico**: Vertical/Horizontal Scaling, Load Balancing, Auto Scaling, Statelessness, Backpressure |
| 05 | Caching at Scale | Distributed Cache, Cache Stampede, cache coherence · Requires: Platform / Caching, Scalability |
| 06 | Availability & Reliability | **canônico**: Fault Tolerance, Redundancy, Failover, Graceful Degradation, RTO, RPO · Requires: Scalability |
| 07 | Distributed Systems Fundamentals | **canônico**: Partial Failure, Network Partition, Consistency (distributed), CAP, PACELC, Consensus, Leader Election |
| 08 | Data Distribution | **canônico**: Replication, Partitioning, Sharding, Consistent Hashing · Requires: Distributed Systems Fundamentals |
| 09 | Service Communication | Sync/Async, RPC, gRPC, Service Discovery, API Gateway, Reverse Proxy, Service Mesh · Requires: Architectural Styles |
| 10 | Messaging | **canônico**: Message Queue/Broker, Pub/Sub, Delivery Semantics, Ordering, Dead Letter Queue · Requires: Service Communication |
| 11 | Resilience Patterns | **canônico**: Timeout, Retry, Backoff, Jitter, Circuit Breaker, Bulkhead, Rate Limiting, Idempotency · Requires: Distributed Systems Fundamentals, Messaging |
| 12 | Distributed Transactions | 2PC, Saga, Choreography, Orchestration, Outbox · Requires: Messaging, Resilience Patterns |
| 13 | Data & Architecture Patterns | CQRS, Event Sourcing, Materialized View, CDC, Database per Service · Requires: Messaging, Data Distribution |
| 14 | Architecture Evolution | Evolutionary Architecture, Fitness Functions, Strangler Fig, Migration Strategy, Build vs Buy (ADR/Tech Debt → Requires Software Craft) |

Racional: fundamentos → estilos → como atacar um problema de system design → escalar
um sistema único → cache em escala → disponibilidade → distribuição (CAP, consenso) →
distribuir dados → comunicação entre serviços → mensageria → resiliência → transações
distribuídas → padrões de dados avançados → evoluir arquitetura (capstone).

### 07 · AI Engineering

| # | Story | Notas |
|---|---|---|
| 01 | AI Fundamentals | **canônico**: AI, ML, Deep Learning, Training, Inference, Parameters · *resources:* harness, ai-fundamentals |
| 02 | Language Models | **canônico**: LLM, Transformer, Token, Tokenization, Context Window, Attention, Autoregressive Generation · Requires: AI Fundamentals |
| 03 | Model Inference | Temperature, Top-P/Top-K, Max Tokens, Stop Sequence, Streaming, Seed · Requires: Language Models · *resources:* harness |
| 04 | Prompt Engineering | **canônico**: Prompt, System/User Prompt, Instruction Hierarchy, Zero/Few-Shot, In-Context Learning, Template · Requires: Model Inference |
| 05 | Structured Generation | Structured Output, JSON, Schema-Constrained, Output Validation/Parsing, Retry on Invalid · Requires: Prompt Engineering |
| 06 | Context Engineering | **canônico**: Context, Assembly/Ordering/Compression, Budget/Overflow, Context Rot · Requires: Prompt Engineering · *resources:* harness |
| 07 | Embeddings | **canônico**: Embedding, Vector, Embedding Space, Cosine Similarity, Dot Product, Euclidean Distance |
| 08 | Vector Search | **canônico**: k-NN, ANN, Vector Index, HNSW, Vector Database · Requires: Embeddings |
| 09 | Chunking | Chunk Size/Overlap, Fixed/Recursive/Semantic Chunking |
| 10 | Retrieval | **canônico**: Semantic/Keyword Search, BM25, Dense/Sparse, Hybrid Search, Reranking · Requires: Vector Search, Chunking |
| 11 | RAG | RAG Pipeline, Query Transformation, Grounding, Source Attribution, RAG Eval · Requires: Retrieval, Context Engineering |
| 12 | Tool Calling | **canônico**: Tool, Function Calling, Tool Schema/Selection/Arguments/Result, Error Handling, Execution Loop · Requires: Structured Generation |
| 13 | MCP | Requires: Tool Calling |
| 14 | Agent Fundamentals | **canônico**: AI Agent, Agentic System/Workflow, Agent Loop, Planning/Acting/Observation/Reflection, ReAct, HITL · Requires: Tool Calling, Context Engineering · *resources:* harness |
| 15 | Agent Orchestration | Workflow, Router, Sequential/Parallel/Conditional, Agent State, Termination · Requires: Agent Fundamentals |
| 16 | AI Memory | Short/Long-Term, Conversation/Semantic/Episodic Memory, Memory vs Context · Requires: Agent Fundamentals, Context Engineering |
| 17 | Multi-Agent Systems | **canônico**: Agent Role/Delegation/Communication, Supervisor Pattern, Agent Handoff, Coordination · Requires: Agent Orchestration |
| 18 | Model Routing | **canônico**: Model Router, Static/Dynamic Routing, Capability/Cost/Latency-Based, Model Fallback · Requires: Model Inference |
| 19 | AI Evaluation | Evals, Golden Dataset, Offline/Online, LLM-as-a-Judge, Faithfulness, Answer Relevance, Retrieval Precision/Recall · Requires: RAG, Agent Fundamentals |
| 20 | AI Safety & Guardrails | **canônico**: Guardrails (I/O), Hallucination, Prompt Injection, Jailbreak, Data Leakage, PII, Least Privilege for Tools, Human Approval · Requires: Tool Calling, RAG, Agent Fundamentals · *resources:* harness |
| 21 | AI Observability | LLM Tracing, Prompt Logging, Token/Cost/Latency Tracking, Tool/Retrieval Tracing · Requires: Platform / Observability |
| 22 | Model Adaptation | Fine-Tuning, SFT, Instruction Tuning, LoRA, PEFT, Distillation, Quantization, RAG vs Fine-Tuning · Requires: AI Fundamentals, RAG |
| 23 | Production AI | *revisita*: Model Latency, TTFT, Token Budget, Semantic Cache, Rate Limiting, Model Fallback, Retry Strategy, Prompt/Model Versioning, Evaluation in CI/CD · Requires: AI Evaluation, AI Observability, Architecture / Resilience Patterns |

Racional: o que é IA/ML/inferência → como um LLM funciona → controles de inferência →
prompting → saída estruturada → context engineering → embeddings → busca vetorial →
chunking → retrieval → RAG → tool calling → MCP → agentes → orquestração → memória →
multi-agente → roteamento → avaliação → segurança/guardrails → observabilidade de IA →
adaptação de modelo → Production AI (capstone de revisita).

*SUGESTÃO de Story:* `Responsible AI & Governance` (bias, fairness, transparência,
governança de dados); `LLM Cost Engineering` (prompt caching, batching, model sizing).

---

## Dependências de alto nível

```
Programming Foundations ──▶ (todos os demais Epics)
Testing & Quality ──▶ Software Craft / Refactoring
Testing & Quality / Debugging / Git Bisect ⟵ Requires ── Software Craft / Git  (forward-ref aceita, acíclico)
Testing & Quality / Testability ──▶ Software Design / Dependency Injection & IoC
Testing & Quality / Contract Testing ──▶ Platform / API ; Architecture / Service Communication
Testing & Quality / Regression Testing ──▶ AI Engineering / Regression Evaluation
Software Craft ──▶ Architecture / Architecture Evolution (ADR, Tech Debt)
Software Craft / Error Boundaries ──▶ Architecture / Resilience Patterns   (futuro, sem Requires ainda)
Software Craft / Runbook ──▶ Platform / Reliability Engineering            (futuro, sem Requires ainda)
Software Design / Domain Modeling ──▶ Architecture / Architectural Styles
Software Design / Enterprise Patterns ⟵ Requires ── Platform / Database Fundamentals  (formalizado 2026-09-05, acíclico)
Software Design / Chain of Responsibility (SUGESTÃO) ──▶ Platform / API Fundamentals / Middleware / Request Pipeline
Platform Engineering ──▶ Architecture & System Design (Epic inteiro)
                    └──▶ AI Engineering (APIs, Observability, Caching)
Platform / API Fundamentals / Rate Limiting, Idempotency Key ──▶ Architecture / Resilience Patterns  (revisita)
Platform / Cloud Fundamentals / Load Balancer, Auto Scaling ⟵ revisitOf ── Architecture / Scalability  (forward-ref, acíclico)
Platform / Database Performance / N+1 Query Problem ──▶ Platform / GraphQL / N+1 in Resolvers  (revisita intra-Epic)
Architecture / Resilience Patterns ──▶ AI Engineering / Production AI
Platform / Observability ──▶ AI Engineering / AI Observability
Platform / Performance Engineering ──▶ AI Engineering / Production AI
```

### Conceitos transversais — lar canônico × revisita

| Conceito | Canônico | Revisitado em (com `Requires`) |
|---|---|---|
| Coupling / Cohesion / SoC | Programming Foundations / Programming Fundamentals | Software Craft; Software Design; Architecture Fundamentals |
| Abstraction / Encapsulation / Interface / Contract / Polymorphism | Programming Foundations / Programming Fundamentals | Software Design / OOD, SOLID |
| Entity / Value Object / Identity | Software Design / Object-Oriented Design | Software Design / Domain Modeling (framing DDD, `canonical: false`); Architecture (futuro) |
| Pure Functions / Immutability / Side Effects / Referential Transparency | Programming Foundations / Functional Programming | AI (determinismo) — removido de Software Craft / Clean Code |
| Closure / Higher-Order Functions / Function Composition | Programming Foundations / Functional Programming | Async / Callback; Frontend (SUGESTÃO) |
| Memory / Value vs Reference / Stack vs Heap / Call Stack / GC / Memory Leak | Programming Foundations / Memory & Runtime | Async / Event Loop; Concurrency; Platform / Performance; Frontend (SUGESTÃO) |
| Type Safety / Structural Typing / Generics | Programming Foundations / Type Systems | Software Design (Program to an Interface, DIP) |
| Hash Table / Tree / BST / Graph / Queue | Programming Foundations / Data Structures | Architecture (Consistent Hashing, Message Queue); Platform (índices); AI (HNSW) |
| Big O / Common Time Complexities / Recursion / Memoization / Binary Search | Programming Foundations / Algorithms & Complexity | todo o roadmap; Testing & Quality (Binary Search Debugging, Git Bisect); Platform / Caching |
| Process / Thread / Race Condition / Deadlock / Atomic Operation / Shared State | Programming Foundations / Concurrency | Platform (Containers, DB locking/isolation); Architecture (Stateless Systems, consensus) |
| Unit / Integration / E2E Testing · Assertion / Test Fixture / Test Runner · AAA / GWT | Testing & Quality / Testing Fundamentals | AI / AI Evaluation (offline eval); Platform / CI-CD |
| Test Doubles · Dummy / Stub / Fake / Spy / Mock | Testing & Quality / Test Doubles | AI / AI Evaluation (mocking de LLM); deck `harness` ("Fake Model") |
| TDD / Red-Green-Refactor | Testing & Quality / Test-Driven Development | Software Craft / Refactoring (passo "refactor" — pointer, não Requires) |
| Test Pyramid / Code Coverage / Testability / Test Isolation / Flaky Tests / Regression Testing / Property-Based Testing / Contract Testing | Testing & Quality / Testing Strategy | Software Design (DI); Platform / CI-CD; Platform / API; Architecture / Service Communication; AI / Regression Evaluation |
| Reproduction / Hypothesis-Driven Debugging / Stack Trace / Breakpoints / Binary Search Debugging / Git Bisect / Root Cause Analysis | Testing & Quality / Debugging | Platform / Reliability Engineering (Postmortem); Software Craft / Git (`Bisect` → referência) |
| Retry / Timeout / Backoff / Circuit Breaker / Idempotency *(conceito de resiliência)* | Architecture / Resilience Patterns | AI / Tool Calling; AI / Production AI |
| Idempotency Key *(mecânica HTTP)* | Platform / API Fundamentals | Architecture / Resilience Patterns (`Idempotency` conceito) |
| Rate Limiting | **Platform / API Fundamentals** *(era Architecture / Resilience Patterns — mudança não silenciosa vs Fase 1)* | Architecture / Resilience Patterns; AI / Production AI (custo de LLM) |
| Middleware / Request Pipeline | Platform / API Fundamentals *(Task nova)* | Software Design / Chain of Responsibility segue SUGESTÃO |
| Caching (patterns) | Platform / Caching | Architecture / Caching at Scale; AI / Production AI (Semantic Cache) |
| Latency / Throughput / CPU vs I/O bound / Profiling | Platform / Performance Engineering | Architecture / System Design Fundamentals; AI / Production AI (TTFT, Model Latency) |
| Consistency (ACID) | Platform / Database Transactions | colide de nome com Distributed Consistency — sentido diferente |
| Consistency (distributed) / Eventual Consistency | Architecture / Distributed Systems Fundamentals | Architecture / Messaging; Architecture / Data Patterns |
| Least Privilege | Platform / Authorization | Platform / Cloud Security (Least Privilege in Cloud, `canonical: false`); AI / Safety & Guardrails |
| Observability (logs/metrics/traces) / OpenTelemetry | Platform / Observability | AI / AI Observability; Architecture / Reliability |
| ADR / Technical Debt / Backward Compatibility | Software Craft | Architecture / Architecture Evolution |
| N+1 Query Problem | Platform / Database Performance | Platform / GraphQL (N+1 in Resolvers, `canonical: false`); Architecture (chatty I/O) |
| TLS *(+ HTTPS subtopic)* | Platform / Web Fundamentals | Platform / Application Security (Encryption in Transit) |
| Input Validation *(segurança)* | Platform / Application Security | Platform / API Fundamentals (Request Validation = contrato/boundary, conceito distinto) |
| Load Balancing / Auto Scaling | Architecture / Scalability | Platform / Cloud Fundamentals (primitivos, `canonical: false`); Platform / Kubernetes (HPA) |
| Serverless | Platform / Cloud Fundamentals *(primitivo)* | Architecture / Architectural Styles (estilo serverless) |
| Guardrail / Validation / Gate · Retry / Repair / Fallback | AI / Safety & Guardrails + AI / Agent Fundamentals | deck `harness` como resource |

---

## Mudanças estruturais vs. arquivos `roadmap/*.md` originais

| # | Mudança | Justificativa |
|---|---|---|
| 1 | `Design & Fundamentals` → **`Programming Foundations`** + **`Software Design`** | misturava mecânica de linguagem com design — pré-requisitos e cadência diferentes |
| 2 | Story `Testing` → **Epic `Testing & Quality Engineering`** | 17 tasks; pré-requisito de Refactoring e de confiança em design |
| 3 | `Debugging` movido Software Craft → Testing & Quality | diagnóstico de qualidade, não escrita de código |
| 4 | `Clean Code` → `Clean Code` + `Design Heuristics` | DRY/KISS/YAGNI são heurísticas de design, não legibilidade |
| 5 | `Codebase Maintainability` → `Dependency & Version Management` | nome preciso; evita colisão com o "Dependency Management" de Software Design |
| 6 | `Architecture / Caching Architecture` → slim `Caching at Scale` | ~90% era duplicata de Platform / Caching |
| 7 | AI Engineering reordenado (temático → pedagógico); `Production AI` = revisita | ordem original agrupava por tema, não por dependência |
| 8 | `Domain Modeling` = capstone de Software Design e ponte para Architecture | Bounded Context / Context Mapping são pré-requisito de microservices |

---

## SUGESTÕES — lacunas (não adicionar sem aprovação)

**Epics ausentes:**
- **Frontend Engineering** — rendering do browser, DOM, componentes, state management,
  performance de rendering, acessibilidade, bundling.
- **Engineering Leadership & Communication** — mentoria, conduzir RFCs, estimativa,
  fatiamento de escopo, comunicação com stakeholders, incident command.
- **Data Engineering** — batch × stream, ETL/ELT, data warehouse/lake, Airflow/Spark.

**Stories ausentes:** ver seção de cada Epic acima
(`Non-Functional Testing`, `Build & Tooling`, `Infrastructure as Code`,
`Responsible AI & Governance`, `LLM Cost Engineering`).
`Memory & Runtime` — **aprovada** na Fase 2 do Epic 01 (Story 02).

---

## Estado / próximas fases

| Fase | Escopo | Estado |
|---|---|---|
| **Fase 1** | Epics → Stories, ordem, racional, sobreposições, dependências de alto nível | ✅ Aprovada 2026-09-03 |
| **Fase 2** | Detalhamento Epic por Epic: ordenar Tasks, `Requires` por Task, canônico × revisita, consolidar duplicatas, SUGESTÕES de Task | 🔄 Em andamento — uma rodada por Epic, com aprovação |
| **Fase 3** | Implementação visual: `data/roadmap.js`, navegação Área → Módulo → Conceito, identidade visual da referência | 🔜 Próximo passo — 1ª versão: 7 Epics na Home + navegação completa para os Epics com Fase 2 concluída (01–05) |

### Fase 2 — progresso por Epic

| Epic | Estado | Arquivo |
|---|---|---|
| 01 · Programming Foundations | ✅ **Concluído 2026-09-03** — 8 Stories, 79 Tasks | `01-programming-foundations.md` |
| 02 · Testing & Quality Engineering | ✅ **Concluído 2026-09-03** — 5 Stories, 31 Tasks | `02-testing-quality-engineering.md` |
| 03 · Software Craft | ✅ **Concluído 2026-09-05** — 9 Stories, 61 Tasks | `03-software-craft.md` |
| 04 · Software Design | ✅ **Concluído 2026-09-05** — 9 Stories, 56 Tasks | `04-software-design.md` |
| 05 · Platform Engineering | ✅ **Concluído / FROZEN 2026-09-05** — 21 Stories, 187 Tasks | `05-platform-engineering.md` |
| 06 · Architecture & System Design | ⏳ Não iniciado | — |
| 07 · AI Engineering | ⏳ Não iniciado | — |

### Próximo passo — Fase 3, 1ª versão visual

Implementar a primeira versão navegável do roadmap:
- **Home**: os 7 Epics como cards coloridos (Fase 1).
- **Navegação completa** (Área → Módulo → Conceito) **para os Epics 01–05**
  — os únicos com detalhamento Task-a-Task aprovado.
- Epics 06–07: card na Home, mas sem drill-down de Stories/Tasks até a Fase 2
  correspondente.

Arquitetura técnica de referência: `../PLAN.md` (Anexo).

### Arquivos originais

`architecture-e-system-design.md` e `ai-engineering.md` mantêm a estrutura **antiga**
e serão reorganizados nas próximas rodadas da Fase 2. `design-e-fundamentals.md` já foi
**totalmente consumido** (fundamentos de linguagem → Epic 01, detalhados em
`01-programming-foundations.md`; design/patterns/DDD → Epic 04, detalhados em
`04-software-design.md`). `software-craft.md` já foi totalmente consumido pelo Epic 03
(Stories `Testing` e `Debugging` extraídas antes para o Epic 02; as demais Stories
detalhadas em `03-software-craft.md`). `platform-engineering.md` já foi **totalmente
consumido** pelo Epic 05 (21 Stories detalhadas em `05-platform-engineering.md`).
