# Roadmap Senior — Visão macro

> Estrutura macro (Epics → Stories) **aprovada em 2026-09-03**. Fonte da verdade da
> hierarquia. O detalhamento Task-a-Task acontece na Fase 2, um Epic por vez.
>
> **Fase 2 COMPLETA** — Epics 01 · Programming Foundations e 02 · Testing & Quality
> Engineering concluídos (2026-09-03), 03 · Software Craft e 04 · Software Design
> concluídos (2026-09-05), 05 · Platform Engineering concluído / **FROZEN**
> (2026-09-05), 06 · Architecture & System Design concluído / **FROZEN**
> (2026-09-08), 07 · AI Engineering concluído / **FROZEN** (2026-09-08), ver
> `01-programming-foundations.md`, `02-testing-quality-engineering.md`,
> `03-software-craft.md`, `04-software-design.md`, `05-platform-engineering.md`,
> `06-architecture-system-design.md` e `07-ai-engineering.md`.
> Progresso completo no fim deste arquivo.
> **Próximo**: revisão da navegação visual (Fase 3), já ampliada para os 7 Epics
> — Fase 2 não tem mais Epics pendentes.
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
   `Requires` Platform + Software Design. *(Fase 2 aprovada / FROZEN: 14 Stories,
   93 Tasks.)*
7. **AI Engineering** — a especialização. `Requires` Platform; "Production AI"
   `Requires` Architecture/Resilience. Pode ser antecipado por quem já atua na área
   (só depende de Platform). *(Fase 2 aprovada / FROZEN: 23 Stories, 161 Tasks.)*

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

> **Fase 2 aprovada / FROZEN em 2026-09-08.** Detalhamento Task-a-Task:
> `06-architecture-system-design.md`. **14 Stories · 93 Tasks** (91 canônicas · 2
> `canonical: false` + `revisitOf`). 7 consolidações auditadas (5 umbrella 3→1 + 2
> par 2→1) + 11 rebaixamentos a subtopic/pointer. Auditoria dedicada de `Requires`
> de Task (ORDER ≠ REQUIRES) sobre as 108 arestas propostas: **63 KEEP / 42
> relações removidas de `Requires` (preservadas como pointer/contexto quando
> aplicável) / 3 REPOINT**. Ownership canônico do Epic 05 preservado
> integralmente (`Rate Limiting`/`Idempotency Key` em Platform; `Load
> Balancing`/`Auto Scaling`/`Idempotency` genérico canônicos aqui; `Serverless`
> primitivo em Platform).

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | Architecture Fundamentals | 6 | **canônico**: Architecture vs Design, Characteristics, Constraints, Trade-offs, Modularity, Dependency Direction · Coupling/Cohesion/SoC não viram Task própria (aplicadas via `revisit`) |
| 02 | Architectural Styles | 9 | **canônico**: Layered, Dependency-Rule (Clean/Hexagonal/Onion, 3→1), Monolith, Modular Monolith, Microservices, SOA, Event-Driven, Microkernel · `Serverless Architecture` = `revisitOf` Platform/Cloud Fundamentals · Requires: Architecture Fundamentals, Software Design / Domain Modeling |
| 03 | System Design Fundamentals | 5 | **canônico**: Functional/NFR, Capacity Estimation, Bottlenecks, SPOF · Latency/Throughput não recriadas (canônicas em Platform) |
| 04 | Scalability | 7 | **canônico**: Vertical/Horizontal Scaling, Statelessness, **Load Balancing**, **Auto Scaling**, Backpressure |
| 05 | Caching at Scale | 3 | **canônico**: Distributed Cache, Cache Stampede, Cache Coherence · Requires: Platform / Caching, Scalability |
| 06 | Availability & Reliability | 7 | **canônico**: Availability, Reliability, Fault Tolerance, Redundancy, Failover, Graceful Degradation, Disaster Recovery (RTO/RPO) · Requires: Scalability · múltiplas Tasks-root (decisão final da auditoria) |
| 07 | Distributed Systems Fundamentals | 9 | **canônico**: Distributed System, Partial Failure, Network Partition, Clock & Time, Consistency Models, CAP, PACELC, Consensus, Leader Election |
| 08 | Data Distribution | 7 | **canônico**: Replication (+ Topologies), Partitioning, Sharding, Consistent Hashing, Hotspot (realocado de Scalability), Rebalancing · Requires: Distributed Systems Fundamentals |
| 09 | Service Communication | 7 | **canônico**: Sync vs Async Communication, RPC, gRPC, Service Discovery, API Gateway, Reverse Proxy, Service Mesh · Requires: Architectural Styles |
| 10 | Messaging | 8 | **canônico**: Message Queue, Message Broker, Pub/Sub, Event, Consumer Groups, Message Ordering, Delivery Semantics, Dead Letter Queue · Requires: Service Communication |
| 11 | Resilience Patterns | 9 | **canônico**: Timeout, Retry, **Idempotency**, Backoff, Jitter, Retry Storm, Circuit Breaker, Bulkhead · `Rate Limiting` = `revisitOf` Platform/API Fundamentals · Requires: Distributed Systems Fundamentals, Messaging · múltiplas Tasks-root |
| 12 | Distributed Transactions | 6 | **canônico**: Distributed Transaction, 2PC, Saga (+ Compensating Transaction), Choreography, Orchestration, Transactional Outbox · Requires: Messaging, Resilience Patterns |
| 13 | Data & Architecture Patterns | 5 | **canônico**: CQRS, Event Sourcing, Materialized View, Database per Service, CDC · Requires: Messaging, Data Distribution |
| 14 | Architecture Evolution | 5 | **canônico**: Evolutionary Architecture, Fitness Functions, Strangler Fig, Migration Strategy, Build vs Buy · Requires: Software Craft (Dependency & Version Management, Engineering Documentation) · ADR/Tech Debt/Backward Compatibility não recriadas |

Racional: fundamentos → estilos → como atacar um problema de system design → escalar
um sistema único → cache em escala → disponibilidade → distribuição (CAP, consenso) →
distribuir dados → comunicação entre serviços → mensageria → resiliência → transações
distribuídas → padrões de dados avançados → evoluir arquitetura (capstone).

**Auditoria de `Requires` de Task** (rodada dedicada, além da auditoria padrão de
ownership/consolidação já aplicada nos Epics 01–05): das 108 arestas de `Requires`
propostas inicialmente, só **63** passaram no teste "é impossível/inadequado
entender B sem A" — as outras **42** eram ordem pedagógica ou associação temática,
removidas de `Requires` e preservadas como pointer/contexto quando aplicável (não
apagadas); **3** foram `REPOINT` para um
pré-requisito mais correto (`Replication → Distributed System`; `Message Ordering →
Message Broker`; `Transactional Outbox → Distributed Transaction`). Resultado:
múltiplas Tasks-root são aceitáveis dentro de uma Story (Stories 06 e 11 em
particular) — `Requires` não existe para conectar visualmente a árvore.

**Duplicatas resolvidas nesta Epic** (canônico em Epic anterior FROZEN; não
recriadas aqui, aplicadas via `Requires`/`revisit`):
- `Coupling` / `Cohesion` / `Separation of Concerns` — canônico em Programming
  Foundations / Programming Fundamentals (Epic 01).
- `ADR` / `Backward Compatibility` / `Technical Debt` — canônico em Software Craft.
- `Latency` / `Throughput` / `Profiling` — canônico em Platform / Performance
  Engineering.

**Colisões de nome a desambiguar**: `Consistency Models` (distribuído) ≠
`Consistency (ACID)` (Platform) · `Event` (Messaging, canônico) ≠ `Domain Event`
(Software Design, canônico) — ambos ficam canônicos, sem `revisitOf` · `CQRS` ≠
`CQS` (Software Design) — sem `Requires` formal, só pointer histórico ·
`Service Discovery`/`Service Mesh` ≠ `Service` (K8s) ≠ `Service Layer` (Software
Design) ≠ `Service Account` (Cloud Security). Lista completa: `06-architecture-
system-design.md`.

*SUGESTÕES de Task* (não incluídas): Chaos Engineering, Vector Clocks/Lamport
Timestamps, Quorum, API Composition, Sidecar Pattern, Anti-Corruption Layer,
Backends for Frontends, Active-Active vs Active-Passive. Lista completa no arquivo
do Epic.

### 07 · AI Engineering

> **Fase 2 aprovada / FROZEN em 2026-09-08.** Detalhamento Task-a-Task:
> `07-ai-engineering.md`. **23 Stories · 161 Tasks** (156 canônicas · 5
> `canonical: false` + `revisitOf`). 2 Tasks novas vs a proposta base de 159:
> `Agentic System` (Story 14) e `Structured Prompting` (Story 04, relocada de
> subtopic de `Structured Output`). ~30 consolidações auditadas. Auditoria
> dedicada de `Requires` de Task (ORDER ≠ REQUIRES): a árvore rodada-2 tinha
> **160 arestas** → **30 REMOVE / 32 REPOINT / 98 KEEP** → **130 arestas
> finais** — zero ciclos, zero forward dependencies. Ownership canônico dos
> Epics 05/06 preservado integralmente (`Rate Limiting` → Platform/API; `Cache`
> → Platform/Caching; `Latency`/`Throughput` → Platform/Performance; `Principle
> of Least Privilege` → Platform/Authorization; `Retry` → Architecture/Resilience).

| # | Story | Tasks | Notas |
|---|---|---|---|
| 01 | AI Fundamentals | 7 | **canônico**: AI, AI System, ML, AI Model, Training, Inference, Parameters · Deep Learning/Model Architecture = subtopic · *resources:* ai-fundamentals, harness |
| 02 | Language Models | 9 | **canônico**: LM, LLM, Token, Tokenization, Attention, Transformer, Context Window, Next-Token Prediction, Autoregressive Generation · Token e Attention são roots · Requires: AI Fundamentals |
| 03 | Model Inference | 6 | **canônico**: Deterministic vs Stochastic Output, Temperature, Top-P/Top-K, Stopping Conditions, Streaming, Seed · Requires: Language Models · *resources:* harness |
| 04 | Prompt Engineering | 9 | **canônico**: Prompt, System/User Prompt, Instruction Hierarchy, Zero/Few-Shot, In-Context Learning, Prompt Template, **Structured Prompting** *(Task nova)*, Prompt Chaining, Prompt Versioning · Requires: Model Inference |
| 05 | Context Engineering | 8 | **canônico**: Context, Context Engineering, Assembly, Ordering, Compression, Budget, Overflow, Rot · Requires: Prompt Engineering · *resources:* harness |
| 06 | Structured Generation | 5 | **canônico**: Structured Output, Schema-Constrained Generation, Output Parsing, Output Validation, Retry on Invalid Output · Requires: Prompt Engineering |
| 07 | Embeddings | 6 | **canônico**: Vector, Embedding, Embedding Model, Embedding Space, Semantic Similarity, Similarity & Distance Metrics (Cosine/Dot/Euclidean) |
| 08 | Vector Search | 6 | **canônico**: Vector Search, k-NN, ANN, Vector Index, HNSW, Vector Database · Requires: Embeddings |
| 09 | Chunking | 2 | **canônico**: Chunking, Chunking Strategies (Fixed/Recursive/Semantic/Document Structure) · Chunk Size/Overlap = subtopic |
| 10 | Retrieval | 7 | **canônico**: Retrieval, Semantic Search, Keyword Search, BM25, Hybrid Search, Metadata Filtering, Reranking · Dense/Sparse = alt-nomes · Requires: Vector Search, Chunking |
| 11 | RAG | 7 | **canônico**: RAG, RAG Pipeline, Query Transformation, **Grounding**, Source Attribution, Retrieval Failure, RAG Evaluation · Requires: Retrieval, Context Engineering |
| 12 | Tool Calling | 8 | **canônico**: Tool, Tool Calling, Tool Schema, Tool Selection, Tool Result, Tool Error Handling, Tool Permissions, Tool Execution Loop · Requires: Structured Generation *(nível de Story)* |
| 13 | MCP | 5 | **canônico**: MCP, MCP Architecture, MCP Primitives, MCP Transport, MCP vs API · MCP é root no Task DAG · Requires: Tool Calling *(nível de Story)* |
| 14 | Agent Fundamentals | 8 | **canônico**: Deterministic vs Agentic Workflow, AI Agent, Agent vs LLM, **Agentic System** *(Task nova)*, Agentic Workflow, Agent Loop, ReAct, HITL · Requires: Tool Calling, Context Engineering · *resources:* harness |
| 15 | Agent Orchestration | 5 | **canônico**: Orchestration (Workflow), Router, Workflow Composition (Seq/Par/Cond), Agent State, Agent Termination · Handoff removida daqui · Requires: Agent Fundamentals |
| 16 | AI Memory | 6 | **canônico**: Agent Memory, Memory vs Context, Short/Long-Term Memory, Memory Types (Conv/Sem/Epis), Memory Retrieval, Memory Consolidation · Requires: Agent Fundamentals, Context Engineering |
| 17 | Multi-Agent Systems | 8 | **canônico**: Multi-Agent System, Coordination, Role, Communication, Delegation, **Agent Handoff**, Supervisor Pattern, Trade-offs · Requires: Agent Orchestration |
| 18 | Model Routing | 5 | **canônico**: Model Router, Static vs Dynamic Routing, Routing Criteria (Cap/Cost/Lat), **Model Fallback**, Multi-Provider Architecture · Requires: Model Inference |
| 19 | AI Evaluation | 7 | **canônico**: Evaluation (Evals), Evaluation Dataset, Offline vs Online, Evaluation Methods, Retrieval Precision & Recall, Faithfulness & Answer Relevance, Regression Evaluation · Requires: RAG, Agent Fundamentals |
| 20 | AI Safety & Guardrails | 11 | **canônico**: Guardrails, Input/Output Guardrails, Hallucination, Prompt Injection (+ Indirect), Jailbreak, Data Leakage, PII Handling, Tool Abuse, Human Approval · `Least Privilege for Tools` = `revisitOf` Platform/Authorization · Requires: Tool Calling, RAG, Agent Fundamentals · *resources:* harness |
| 21 | Model Adaptation | 6 | **canônico**: Fine-Tuning, SFT/Instruction Tuning, PEFT (LoRA), Distillation, Quantization, RAG vs Fine-Tuning · Requires: AI Fundamentals, RAG |
| 22 | AI Observability | 7 | **canônico**: LLM Tracing, Prompt Logging, Token Usage, Cost Tracking, Latency Tracking, Tool & Retrieval Tracing, Failure Analysis · 100% `canonical: true` (Platform/Observability = `Requires`/pointer) · Requires: Platform / Observability |
| 23 | Production AI | 13 | **canônico**: AI System Reliability, Model Latency, TTFT, Token Throughput, Model Cost, Token Budget, Model Versioning, Evaluation in CI/CD, AI System Monitoring · `revisitOf`: Caching LLM Responses (Semantic Cache), Rate Limiting, Model Fallback, Retry Strategy · Requires: AI Evaluation, AI Observability, Architecture / Resilience Patterns |

Racional: o que é IA/ML/inferência → como um LLM funciona → controles de inferência →
prompting → saída estruturada → context engineering → embeddings → busca vetorial →
chunking → retrieval → RAG → tool calling → MCP → agentes → orquestração → memória →
multi-agente → roteamento → avaliação → segurança/guardrails → observabilidade de IA →
adaptação de modelo → Production AI (capstone de revisita).

**`canonical: false` + `revisitOf` (5 Tasks):** `AI Safety / Least Privilege for
Tools` → Platform/Authorization/Principle of Least Privilege · `Production AI /
Caching LLM Responses (Semantic Cache)` → Platform/Caching/Cache · `Production AI
/ Rate Limiting` → Platform/API Fundamentals/Rate Limiting · `Production AI /
Retry Strategy` → Architecture/Resilience Patterns/Retry · `Production AI / Model
Fallback` → Model Routing/Model Fallback *(intra-Epic)*.

**Duplicatas resolvidas nesta Epic** (canônico em Epic anterior FROZEN; aplicadas
via `Requires`/`revisit`, não recriadas): `Rate Limiting` (Platform/API) ·
`Cache`/Semantic Cache (Platform/Caching) · `Latency`/`Throughput`
(Platform/Performance Engineering) · `Distributed Tracing`/`Structured Logging`
(Platform/Observability) · `Principle of Least Privilege` (Platform/Authorization) ·
`Retry` (Architecture/Resilience Patterns) · `Regression Testing` (Testing &
Quality Engineering — pointer já FROZEN do lado do Epic 02) · `SSE` (Platform/Web
Fundamentals — pointer já FROZEN do lado de Platform) · `Handoff` consolidada num
único lar canônico (`Agent Handoff`, Story 17).

**Colisões a desambiguar**: `Grounding` (RAG) ≠ `Faithfulness & Answer Relevance`
(AI Evaluation) — conceitos distintos, sem `revisitOf` · `Structured Prompting`
(soft) ≠ `Schema-Constrained Generation` (hard) · `Tool Execution Loop` ≠ `Agent
Loop` · `Context Budget` (capacidade) ≠ `Token Budget` (econômico) · `AI System`
≠ `Agentic System` ≠ `Agentic Workflow` · `Prompt Injection` ≠ `Jailbreak` ·
`Model Fallback` canônico (Story 18) ≠ `revisitOf` (Story 23). Lista completa:
`07-ai-engineering.md`.

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

--- formalizado na Fase 2 do Epic 06 (2026-09-08) ---
Software Design / SOLID / DIP ──▶ Architecture / Architecture Fundamentals / Dependency Direction  (revisita, pointer)
Software Design / Domain Modeling / Bounded Context ──▶ Architecture / Architectural Styles / Microservices  (revisita, pointer — não Requires formal)
Software Design / Design Principles / CQS ──▶ Architecture / Data & Architecture Patterns / CQRS  (revisita, pointer — sem Requires formal)
Software Craft / Engineering Documentation / ADR, Dependency & Version Management / Technical Debt + Backward Compatibility ──▶ Architecture / Architecture Evolution  (Requires formal)
Platform / Database Design / Database Migration ──▶ Architecture / Architecture Evolution / Migration Strategy  (revisita, pointer)
Platform / Performance Engineering / Throughput ──▶ Architecture / System Design Fundamentals / Capacity Estimation  (Requires formal; Latency fica só pointer)
Architecture / Distributed Systems Fundamentals ──▶ Architecture / Data Distribution, Messaging, Resilience Patterns, Distributed Transactions, Data & Architecture Patterns  (intra-Epic, acíclico)

--- formalizado na Fase 2 do Epic 07 (2026-09-08) ---
Platform / Observability / Distributed Tracing (Span / trace context) ──▶ AI Engineering / AI Observability / LLM Tracing  (Requires formal)
Platform / Observability / Structured Logging ──▶ AI Engineering / AI Observability / Prompt Logging  (Requires formal)
Platform / Performance Engineering / Latency ──▶ AI Engineering / AI Observability / Latency Tracking + Production AI / Model Latency  (Requires formal)
Platform / Performance Engineering / Throughput ──▶ AI Engineering / Production AI / Token Throughput  (Requires formal)
Platform / Caching / Cache ⟵ revisitOf ── AI Engineering / Production AI / Caching LLM Responses (Semantic Cache)
Platform / API Fundamentals / Rate Limiting ⟵ revisitOf ── AI Engineering / Production AI / Rate Limiting
Platform / API Fundamentals / API ──▶ AI Engineering / MCP / MCP vs API  (Requires formal)
Platform / Authorization / Principle of Least Privilege ⟵ revisitOf ── AI Engineering / AI Safety & Guardrails / Least Privilege for Tools
Architecture / Resilience Patterns / Retry ⟵ revisitOf ── AI Engineering / Production AI / Retry Strategy
Testing & Quality Engineering / Testing Strategy / Regression Testing ──▶ AI Engineering / AI Evaluation / Regression Evaluation  (pointer — já FROZEN do lado do Epic 02)
Platform / Web Fundamentals / SSE ──▶ AI Engineering / Model Inference / Streaming  (pointer — já FROZEN do lado de Platform)
AI Engineering / Model Routing / Model Fallback ⟵ revisitOf ── AI Engineering / Production AI / Model Fallback  (intra-Epic, backward, acíclico)
```

### Conceitos transversais — lar canônico × revisita

| Conceito | Canônico | Revisitado em (com `Requires`) |
|---|---|---|
| Coupling / Cohesion / SoC | Programming Foundations / Programming Fundamentals | Software Craft; Software Design; Architecture Fundamentals |
| Abstraction / Encapsulation / Interface / Contract / Polymorphism | Programming Foundations / Programming Fundamentals | Software Design / OOD, SOLID |
| Entity / Value Object / Identity | Software Design / Object-Oriented Design | Software Design / Domain Modeling (framing DDD, `canonical: false`) |
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
| Retry / Timeout / Backoff / Circuit Breaker / Idempotency *(conceito de resiliência)* | Architecture / Resilience Patterns | AI / Tool Calling / Tool Error Handling (`[R]`); AI / Structured Generation / Retry on Invalid Output (`[R]`); AI / Production AI / Retry Strategy (`revisitOf`) |
| Idempotency Key *(mecânica HTTP)* | Platform / API Fundamentals | Architecture / Resilience Patterns (`Idempotency` conceito) |
| Rate Limiting | **Platform / API Fundamentals** *(era Architecture / Resilience Patterns — mudança não silenciosa vs Fase 1)* | Architecture / Resilience Patterns (`revisitOf`); AI / Production AI / Rate Limiting (`revisitOf` — custo/quota de LLM) |
| Middleware / Request Pipeline | Platform / API Fundamentals *(Task nova)* | Software Design / Chain of Responsibility segue SUGESTÃO |
| Caching (patterns) / Cache | Platform / Caching | Architecture / Caching at Scale; AI / Production AI / Caching LLM Responses (Semantic Cache, `revisitOf`) |
| Latency / Throughput / CPU vs I/O bound / Profiling | Platform / Performance Engineering | Architecture / System Design Fundamentals; AI / AI Observability / Latency Tracking (`Requires`); AI / Production AI / Model Latency + Token Throughput (`Requires`) |
| Consistency (ACID) | Platform / Database Transactions | colide de nome com Distributed Consistency — sentido diferente |
| Consistency (distributed) / Eventual Consistency *(Task: Consistency Models (Strong / Eventual))* | Architecture / Distributed Systems Fundamentals | Architecture / Data Distribution (Replication Topologies), Messaging (Message Ordering), Distributed Transactions (Saga Pattern) — todos pointer `[R]`, sem `Requires` universal |
| Least Privilege | Platform / Authorization | Platform / Cloud Security (Least Privilege in Cloud, `canonical: false`); AI / Safety & Guardrails / Least Privilege for Tools (`revisitOf`) |
| Observability (logs/metrics/traces) / OpenTelemetry / Distributed Tracing / Structured Logging | Platform / Observability | AI / AI Observability / LLM Tracing + Prompt Logging (`Requires`); Architecture / Reliability |
| API | Platform / API Fundamentals | AI / MCP / MCP vs API (`Requires`) |
| Regression Testing | Testing & Quality Engineering / Testing Strategy | AI / AI Evaluation / Regression Evaluation (`[R]` — pointer já FROZEN do lado do Epic 02) |
| Server-Sent Events (SSE) | Platform / Web Fundamentals | AI / Model Inference / Streaming (`[R]` — pointer já FROZEN do lado de Platform); Programming Foundations / Async / Promise |
| Grounding *(propriedade)* | AI / RAG | **[≠]** ≠ `Faithfulness & Answer Relevance` (AI / AI Evaluation, métrica) — conceitos distintos, sem `revisitOf` (decisão Fase 2 · Epic 07) |
| Model Fallback | AI / Model Routing | AI / Production AI / Model Fallback (`revisitOf`, intra-Epic) — mesmo padrão de `N+1 in Resolvers` no Epic 05 |
| Prompt Versioning | AI / Prompt Engineering | AI / Production AI / Model Versioning (citado por pointer, sem 2ª Task) |
| ADR / Technical Debt / Backward Compatibility | Software Craft | Architecture / Architecture Evolution (`Requires` formal — Fase 2 · Epic 06) |
| CQS (Command-Query Separation) | Software Design / Design Principles | Architecture / Data & Architecture Patterns (`CQRS` — generaliza para arquitetura, pointer `[R]`, sem `Requires` formal) |
| Event (transporte/infraestrutura) | Architecture / Messaging | **[≠]** ≠ `Domain Event` (Software Design / Domain Modeling) — ambos canônicos, colisão anotada, sem `revisitOf` (decisão Fase 2 · Epic 06) |
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
| **Fase 2** | Detalhamento Epic por Epic: ordenar Tasks, `Requires` por Task, canônico × revisita, consolidar duplicatas, SUGESTÕES de Task | ✅ **Completa 2026-09-08** — 7 Epics detalhados (89 Stories, 668 Tasks) |
| **Fase 3** | Implementação visual: `data/roadmap.js`, navegação Área → Módulo → Conceito, identidade visual da referência | ✅ 1ª versão implementada — navegação completa para os **7 Epics** (01–07) |

### Fase 2 — progresso por Epic

| Epic | Estado | Arquivo |
|---|---|---|
| 01 · Programming Foundations | ✅ **Concluído 2026-09-03** — 8 Stories, 79 Tasks | `01-programming-foundations.md` |
| 02 · Testing & Quality Engineering | ✅ **Concluído 2026-09-03** — 5 Stories, 31 Tasks | `02-testing-quality-engineering.md` |
| 03 · Software Craft | ✅ **Concluído 2026-09-05** — 9 Stories, 61 Tasks | `03-software-craft.md` |
| 04 · Software Design | ✅ **Concluído 2026-09-05** — 9 Stories, 56 Tasks | `04-software-design.md` |
| 05 · Platform Engineering | ✅ **Concluído / FROZEN 2026-09-05** — 21 Stories, 187 Tasks | `05-platform-engineering.md` |
| 06 · Architecture & System Design | ✅ **Concluído / FROZEN 2026-09-08** — 14 Stories, 93 Tasks | `06-architecture-system-design.md` |
| 07 · AI Engineering | ✅ **Concluído / FROZEN 2026-09-08** — 23 Stories, 161 Tasks | `07-ai-engineering.md` |

**Total no roadmap (Epics 01–07): 89 Stories · 668 Tasks** (Epics 01–06 = 507;
Epic 07 = 161). **Fase 2 completa — nenhum Epic pendente.**

### Navegação visual — estado atual

A 1ª versão navegável (`index.html` + `js/roadmap/*`) já está implementada no
repositório. Com todos os 7 Epics FROZEN:
- **Home**: os 7 Epics como cards coloridos.
- **Navegação completa** (Área → Módulo → Conceito) para os **Epics 01–07** —
  todos com detalhamento Task-a-Task aprovado.

Arquitetura técnica de referência: `../PLAN.md` (Anexo).

### Arquivos originais

`ai-engineering.md` já foi **totalmente consumido** pelo Epic 07 (23 Stories
detalhadas em `07-ai-engineering.md`). `architecture-e-system-design.md` já foi
**totalmente consumido** pelo Epic 06 (14 Stories detalhadas em
`06-architecture-system-design.md`). `design-e-fundamentals.md` já foi
**totalmente consumido** (fundamentos de linguagem → Epic 01, detalhados em
`01-programming-foundations.md`; design/patterns/DDD → Epic 04, detalhados em
`04-software-design.md`). `software-craft.md` já foi totalmente consumido pelo Epic 03
(Stories `Testing` e `Debugging` extraídas antes para o Epic 02; as demais Stories
detalhadas em `03-software-craft.md`). `platform-engineering.md` já foi **totalmente
consumido** pelo Epic 05 (21 Stories detalhadas em `05-platform-engineering.md`).
