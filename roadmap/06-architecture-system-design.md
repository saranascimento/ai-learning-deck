# Epic 06 · Architecture & System Design — detalhamento de Tasks (Fase 2)

> **Estado: APROVADO / FINAL / FROZEN (Fase 2 · Epic 06 — 2026-09-08).** Produzido
> por proposta Task-a-Task → auditoria rigorosa de `Requires` (ORDER ≠ REQUIRES,
> 108 arestas auditadas) → 6 ajustes de classificação + 5 decisões de PENDENTE
> (autoridade final da usuária). Preserva todas as decisões já aprovadas nos
> Epics 01–05 (FROZEN), em especial as de ownership canônico do Epic 05:
> `Rate Limiting`/`Idempotency Key` → Platform/API Fundamentals; `Load
> Balancing`/`Auto Scaling`/`Idempotency` (genérico) → canônicos aqui;
> `Serverless` (primitivo) → Platform/Cloud Fundamentals; `Latency`/
> `Throughput`/`Profiling` → Platform/Performance Engineering.
>
> Base: as 14 Stories da macro aprovada (`00-overview.md`, Fase 1) e do rascunho
> original `architecture-e-system-design.md`.

### Contabilidade de Tasks

- **14 Stories, 93 Tasks** — 91 canônicas + **2** `canonical: false` +
  `revisitOf`.
- **7 consolidações auditadas** (5 do tipo umbrella 3→1, 2 do tipo par 2→1),
  aprovadas em bloco — cada uma vira 1 Task com `subtopics`.
- **11 rebaixamentos a subtopic/pointer** (itens que eram Task própria no
  rascunho original e viraram detalhe de outra Task).
- **Auditoria de `Requires` de Task**: 108 arestas propostas inicialmente →
  **63 KEEP / 42 REMOVE / 3 REPOINT** após aplicar rigorosamente "ORDER ≠
  REQUIRES" (`Requires` só quando é impossível/inadequado entender B sem A).
  As 42 relações foram removidas de `Requires`, preservadas como
  pointer/contexto (campo `revisit`, usado como mecanismo geral de pointer em
  todo o roadmap) quando aplicável — a relação continua documentada, só não é
  mais uma dependência formal de estudo. `revisit`/`revisitOf` como conceito
  de **revisita formal** continua reservado às 2 revisitas do Epic 06
  (`canonical: false` — seção "canonical / revisitOf" abaixo).

Legenda (mesma dos Epics 03–05):
`Requires:` **dependência conceitual real** — "não dá para entender B sem antes
entender A" (sem prefixo = mesma Story; com prefixo = outra Story/Epic) ·
**[C]** conceito canônico · **[R]** revisita/aplica conceito de outra
Story/Epic (continua canônico aqui) · **[Rev→ X]** `canonical: false` +
`revisitOf: X` · **[≠]** colisão de nome a desambiguar · *sub:* subtopics ·
`SUGESTÃO` Task/Story nova, não incluída.

> **Ordem de estudo ≠ `Requires`.** A numeração é a sequência recomendada de
> estudo; só vira `Requires` quando há dependência conceitual genuína — regra
> aplicada com rigor extra nesta Epic, via auditoria dedicada (seção final
> deste documento).

`Requires` (baseline implícito de **todas** as Stories, não repetido em cada
linha): a Epic inteira `Requires: Platform Engineering (Epic inteiro) +
Software Design (Epic inteiro)` (nível macro, Fase 1).

---

## Stories da Epic (ordem de estudo)

```
01 · Architecture Fundamentals        6 Tasks
02 · Architectural Styles             9 Tasks
03 · System Design Fundamentals       5 Tasks
04 · Scalability                      7 Tasks
05 · Caching at Scale                 3 Tasks
06 · Availability & Reliability       7 Tasks
07 · Distributed Systems Fundamentals 9 Tasks
08 · Data Distribution                7 Tasks
09 · Service Communication            7 Tasks
10 · Messaging                        8 Tasks
11 · Resilience Patterns              9 Tasks
12 · Distributed Transactions         6 Tasks
13 · Data & Architecture Patterns     5 Tasks
14 · Architecture Evolution           5 Tasks
                                     ─── 93 Tasks
```

Racional macro (já aprovado na Fase 1): fundamentos → estilos → como atacar um
problema de system design → escalar um sistema único → cache em escala →
disponibilidade → distribuição (CAP, consenso) → distribuir dados →
comunicação entre serviços → mensageria → resiliência → transações
distribuídas → padrões de dados avançados → evoluir arquitetura (capstone).

**Cadeia de `Requires` de Story** (preservada literalmente da macro):

```
Architecture Fundamentals ──▶ Architectural Styles ──▶ Service Communication ──▶ Messaging
Architecture Fundamentals ──▶ System Design Fundamentals ──▶ Scalability
Scalability ──▶ Caching at Scale (+ Platform / Caching)
Scalability ──▶ Availability & Reliability
Distributed Systems Fundamentals ──▶ Data Distribution
Distributed Systems Fundamentals + Messaging ──▶ Resilience Patterns
Messaging + Resilience Patterns ──▶ Distributed Transactions
Messaging + Data Distribution ──▶ Data & Architecture Patterns
Software Craft (Dependency & Version Management, Engineering Documentation) ──▶ Architecture Evolution
Software Design / Domain Modeling ──▶ Architectural Styles
```

Sem cadeia: `Distributed Systems Fundamentals` é raiz própria (não depende de
`Availability & Reliability` nem de `Architectural Styles`, apesar de vir
depois na numeração — ordem de estudo, não `Requires`).

---

## Story 01 · Architecture Fundamentals — 6 Tasks

`Requires` (Story): baseline.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Architecture vs Design | — | **[C]** ponto de entrada — granularidade e horizonte de decisão |
| 02 | Architectural Characteristics | — | **[C]** "-ilities": o que a arquitetura otimiza além de função |
| 03 | Architectural Constraints | — | **[C]** o que não pode mudar (regulatório, org, legado) |
| 04 | Trade-offs | Architectural Characteristics, Architectural Constraints | **[C]** síntese — a tensão entre characteristics e constraints. **[R]** Programming Foundations / Programming Fundamentals / Coupling, Cohesion (exemplo de trade-off, não pré-requisito do conceito geral) |
| 05 | Modularity | — | **[C]** ganha lar canônico aqui — era `SUGESTÃO` não adotada no Epic 01. **[R]** Programming Foundations / Programming Fundamentals / Separation of Concerns |
| 06 | Dependency Direction | — | **[C]** generaliza DIP para camadas/serviços. **[R]** Software Design / SOLID / DIP |

**Racional**: o que é arquitetura → propriedades que ela otimiza
(characteristics) → o que a restringe (constraints) → sintetizar em trade-offs
conscientes → modularidade como princípio estruturante → direção de
dependência como lente estrutural.

`Coupling`/`Cohesion`/`Separation of Concerns` **não** viram Task própria
aqui — canônicos em Programming Foundations / Programming Fundamentals
(Epic 01, FROZEN); aplicados via `revisit` (pointer), mesmo padrão já usado
nos Epics 03 e 04.

---

## Story 02 · Architectural Styles — 9 Tasks

`Requires` (Story): `Architecture Fundamentals`, `Software Design / Domain
Modeling`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Layered Architecture | — | **[C]** ponto de entrada do catálogo de estilos |
| 02 | Dependency-Rule Architectures (Clean / Hexagonal / Onion) | Layered Architecture, Architecture Fundamentals / Dependency Direction | **[C]** **consolidação 3→1** — mesma regra da dependência, vocabulário diferente. *sub:* Hexagonal (ports & adapters), Onion (camadas concêntricas), Clean (anéis de Uncle Bob) |
| 03 | Monolith | — | **[C]** ponto de contraste com o resto do catálogo |
| 04 | Modular Monolith | Monolith, Architecture Fundamentals / Modularity | **[C]** aplica `Modularity` no nível de deployment unit |
| 05 | Microservices | — | **[C]** **[R]** Modular Monolith (sequência pedagógica, não pré-requisito); Software Design / Domain Modeling / Bounded Context (relevante para a fronteira de serviço, mas não pré-requisito conceitual estrito para entender o que é um microserviço) |
| 06 | Service-Oriented Architecture (SOA) | — | **[C]** **[≠]** frequentemente confundida com Microservices — ESB/governança pesada × independência de deploy |
| 07 | Event-Driven Architecture | — | **[C]** framing conceitual; mecânica detalhada em `Messaging` (Story 10) |
| 08 | Serverless Architecture | Platform / Cloud Fundamentals / Serverless | **[Rev→ Platform / Cloud Fundamentals / Serverless]** — o primitivo é canônico em Platform; aqui é o **estilo** (decisão de sistema inteiro: event-glue, cold start como restrição de SLA, vendor lock-in) |
| 09 | Microkernel Architecture | — | **[C]** plugin/plug-in architecture — nicho (IDEs, browsers); mantida como Task própria (decisão final, PENDENTE-1) |

**Racional**: layered → regra da dependência generalizada
(Clean/Hexagonal/Onion) → monolito → monolito modular → microserviços → SOA
(contraste) → event-driven (framing) → serverless (revisita o primitivo) →
microkernel (nicho, fecha o catálogo).

---

## Story 03 · System Design Fundamentals — 5 Tasks

`Requires` (Story): `Architecture Fundamentals`; `Platform / Performance
Engineering`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Functional Requirements | — | **[C]** ponto de entrada |
| 02 | Non-Functional Requirements | Functional Requirements | **[C]** definido por contraste direto com FR |
| 03 | Capacity Estimation | Non-Functional Requirements, Platform / Performance Engineering / Throughput | **[C]** back-of-the-envelope. *sub:* Bandwidth, estimativa de QPS/armazenamento. **[R]** Platform / Performance Engineering / Latency — relevante em cálculos específicos, mas não `Requires` universal |
| 04 | Bottlenecks | — | **[C]** **[R]** Capacity Estimation, Architecture Fundamentals / Trade-offs |
| 05 | Single Point of Failure | — | **[C]** ponte para Availability & Reliability. **[R]** Bottlenecks |

**Racional**: requisitos funcionais → não-funcionais → estimar capacidade
(usando Throughput já canônico em Platform) → identificar gargalos → o caso
extremo (SPOF).

`Latency`/`Throughput` **não** recriadas — canônicas em `Platform /
Performance Engineering` (FROZEN, Epic 05).

---

## Story 04 · Scalability — 7 Tasks

`Requires` (Story): `Architecture Fundamentals`, `System Design Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Scalability | — | **[C]** ponto de entrada. **[≠]** ≠ Performance (Platform / Performance Engineering) |
| 02 | Vertical Scaling | Scalability | **[C]** |
| 03 | Horizontal Scaling | Scalability | **[C]** **[≠]** contraste direto com Vertical |
| 04 | Statelessness | Horizontal Scaling | **[C]** **consolidação 2→1** (Stateless + Stateful Systems) — o que torna Horizontal Scaling tratável |
| 05 | Load Balancing | Horizontal Scaling | **[C]** **canônico do roadmap** — Platform / Cloud Fundamentals / `Load Balancer` é `revisitOf` daqui. *sub:* algoritmos (round robin, least connections, consistent hashing) |
| 06 | Auto Scaling | Horizontal Scaling | **[C]** **canônico do roadmap** — Platform / Cloud Fundamentals / `Auto Scaling` é `revisitOf` daqui. **[R]** Statelessness (pré-condição na prática, não pré-requisito conceitual) |
| 07 | Backpressure | — | **[C]** **canônico do roadmap**. **[R]** Programming Foundations / Concurrency |

**Racional**: escalar (vertical → horizontal) → o que a escala horizontal
exige (statelessness) → distribuir carga (load balancing) → ajustar a
quantidade de réplicas (auto scaling) → o que fazer quando a demanda excede a
capacidade (backpressure).

---

## Story 05 · Caching at Scale — 3 Tasks

`Requires` (Story): `Platform / Caching`, `Scalability`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Distributed Cache | Platform / Caching / Cache, Scalability / Horizontal Scaling | **[C]** cache compartilhado entre réplicas |
| 02 | Cache Stampede | Distributed Cache, Platform / Caching / Cache Invalidation | **[C]** muitas requisições batem no DB simultaneamente após expiração |
| 03 | Cache Coherence | Distributed Cache | **[C]** consistência entre múltiplas instâncias de cache |

Story deliberadamente slim — decisão já tomada na Fase 1 (`PLAN.md`: "~90% era
duplicata de Platform/Caching"). Cache-Aside, Read/Write-Through,
Write-Behind, Eviction, TTL, Invalidation, In-Memory Data Store, CDN — todos
já canônicos em `Platform / Caching`; não recriados aqui.

---

## Story 06 · Availability & Reliability — 7 Tasks

`Requires` (Story): `Scalability`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Availability | — | **[C]** ponto de entrada — uptime. *sub:* "nines", High Availability |
| 02 | Reliability | — | **[C]** **[≠]** uptime (Availability) × corretude de comportamento ao longo do tempo — conceitos paralelos, nenhum depende do outro |
| 03 | Fault Tolerance | — | **[C]** **canônico do roadmap** |
| 04 | Redundancy | — | **[C]** **canônico do roadmap** |
| 05 | Failover | Redundancy | **[C]** **canônico do roadmap** — pressupõe que existe um backup redundante |
| 06 | Graceful Degradation | Fault Tolerance | **[C]** **canônico do roadmap** — estratégia específica dentro do guarda-chuva Fault Tolerance |
| 07 | Disaster Recovery (RTO / RPO) | — | **[C]** **canônico do roadmap** — **consolidação 3→1** (Disaster Recovery + RTO + RPO). **[R]** Failover |

**Múltiplas Tasks-root nesta Story** (`Availability`, `Reliability`, `Fault
Tolerance`, `Redundancy`, `Disaster Recovery`) — decisão final da auditoria:
`Requires` reflete dependência conceitual real, não estrutura visual
conectada. `Reliability`, `Fault Tolerance` e `Redundancy` não têm `Requires`
entre si porque nenhum é *impossível* de entender sem o outro (são
mecanismo/resultado relacionados, não pré-requisito estrito).

---

## Story 07 · Distributed Systems Fundamentals — 9 Tasks

`Requires` (Story): baseline.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Distributed System | — | **[C]** ponto de entrada. **[≠]** ≠ Client-Server Model (Platform / Web Fundamentals) — teoria geral × topologia particular |
| 02 | Partial Failure | Distributed System | **[C]** **canônico do roadmap** |
| 03 | Network Partition | Partial Failure | **[C]** **canônico do roadmap** — tipo específico de falha parcial |
| 04 | Clock & Time in Distributed Systems | Distributed System | **[C]** clocks lógicos, NTP drift, ordenação sem clock global |
| 05 | Consistency Models (Strong / Eventual) | — | **[C]** **canônico do roadmap** — **consolidação 3→1**. **[≠]** ≠ Consistency (ACID) (Platform / Database Transactions). **[R]** Network Partition |
| 06 | CAP Theorem | Consistency Models (Strong / Eventual), Network Partition | **[C]** **canônico do roadmap** |
| 07 | PACELC | CAP Theorem | **[C]** **canônico do roadmap** — extensão direta do CAP |
| 08 | Consensus | Network Partition | **[C]** **canônico do roadmap**. **[R]** Consistency Models (Strong / Eventual) |
| 09 | Leader Election | Consensus | **[C]** aplicação concreta do problema geral de consenso |

**Racional**: o que define um sistema distribuído → falha parcial → network
partition → tempo sem relógio compartilhado → modelos de consistência → CAP →
PACELC → consenso → eleição de líder.

---

## Story 08 · Data Distribution — 7 Tasks

`Requires` (Story): `Distributed Systems Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Replication | Distributed Systems Fundamentals / Distributed System | **[C]** **canônico do roadmap**. *(REPOINT — era `Requires: Consistency Models`; replicação é definível sobre "sistema distribuído" sem exigir vocabulário de consistência)* |
| 02 | Replication Topologies (Leader-Follower / Multi-Leader / Leaderless) | Replication | **[C]** **consolidação 3→1**. **[R]** Distributed Systems Fundamentals / Consistency Models (Strong / Eventual) — consequências de sync/async replication, resolução de conflito em multi-leader |
| 03 | Partitioning | — | **[C]** **[≠]** replicar copia, particionar divide — conceitos contrastantes, não um dependente do outro |
| 04 | Sharding | Partitioning | **[C]** **canônico do roadmap** — Partitioning aplicado a banco de dados. *sub:* estratégias (range/hash/directory) |
| 05 | Consistent Hashing | Sharding | **[C]** **canônico do roadmap** |
| 06 | Hotspot | Sharding | **[C]** realocado de `Scalability` — carga desigual entre partições/nós. **[R]** Consistent Hashing (mitigação, não pré-requisito) |
| 07 | Rebalancing | Sharding | **[C]** o que acontece ao adicionar/remover shards |

**Racional**: replicar → topologias → particionar (contraste) → sharding →
consistent hashing → hotspot (o problema que consistent hashing mitiga) →
rebalancing.

---

## Story 09 · Service Communication — 7 Tasks

`Requires` (Story): `Architectural Styles`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Synchronous vs Asynchronous Communication | — | **[C]** **consolidação 2→1**. *sub:* Request-Response. **[≠]** ≠ Sync/Async de Programming Foundations (nível de linguagem/control-flow) — este é nível de comunicação entre serviços |
| 02 | RPC | — | **[C]** **[R]** Synchronous vs Asynchronous Communication (sequência pedagógica) |
| 03 | gRPC | RPC | **[C]** *sub/exemplo:* Protocol Buffers |
| 04 | Service Discovery | — | **[C]** |
| 05 | API Gateway | — | **[C]** **[≠]** ≠ Platform / API Fundamentals / Middleware / Request Pipeline (borda entre serviços × dentro de 1 serviço). **[R]** Service Discovery (uso comum, não pré-requisito) |
| 06 | Reverse Proxy | — | **[C]** |
| 07 | Service Mesh | API Gateway, Reverse Proxy, Service Discovery | **[C]** capstone — combina os anteriores em infraestrutura dedicada e descentralizada |

**Racional**: sync × async (nível de serviço) → RPC → gRPC → service
discovery → gateway → reverse proxy → service mesh (capstone).

---

## Story 10 · Messaging — 8 Tasks

`Requires` (Story): `Service Communication`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Message Queue | — | **[C]** **canônico do roadmap**. *sub:* Producer & Consumer |
| 02 | Message Broker | Message Queue | **[C]** **canônico do roadmap** — infraestrutura que implementa a fila |
| 03 | Pub/Sub | — | **[C]** **canônico do roadmap**. *sub:* Topic. **[R]** Message Queue (contraste pedagógico) |
| 04 | Event | — | **[C]** *sub:* Command vs Event. **[≠]** ≠ Domain Event (Software Design / Domain Modeling) — evento de transporte/infraestrutura × evento de modelagem DDD, **ambos canônicos, sem `revisitOf`** (decisão final, PENDENTE-2). **[R]** Pub/Sub |
| 05 | Consumer Groups | Message Broker | **[C]** consumo paralelo/escala |
| 06 | Message Ordering | Message Broker | **[C]** **canônico do roadmap**. *(REPOINT — era `Requires: Consumer Groups`; ordenação é propriedade do broker/fila em geral)*. **[R]** Distributed Systems Fundamentals / Consistency Models (Strong / Eventual) |
| 07 | Delivery Semantics (At-Most-Once / At-Least-Once / Exactly-Once) | Message Broker | **[C]** **canônico do roadmap** — **consolidação 3→1**, absorve `Eventual Consistency with Events` |
| 08 | Dead Letter Queue | Delivery Semantics (At-Most-Once / At-Least-Once / Exactly-Once) | **[C]** **canônico do roadmap** — a válvula de escape do retry do at-least-once |

**Racional**: fila → broker → pub/sub (contraste) → evento → consumer groups
→ ordenação → semânticas de entrega → dead letter queue.

---

## Story 11 · Resilience Patterns — 9 Tasks

`Requires` (Story): `Distributed Systems Fundamentals`, `Messaging`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Timeout | — | **[C]** **canônico do roadmap** |
| 02 | Retry | — | **[C]** **canônico do roadmap**. **[R]** Timeout (sequência) |
| 03 | Idempotency | — | **[C]** **canônico do roadmap** — conceito de resiliência. **[≠]** ≠ Idempotency Key (Platform / API Fundamentals — mecânica HTTP). **[R]** Retry |
| 04 | Backoff | Retry | **[C]** **canônico do roadmap** |
| 05 | Jitter | Backoff | **[C]** **canônico do roadmap** |
| 06 | Retry Storm | Retry, Backoff, Jitter | **[C]** a patologia do próprio cluster Retry/Backoff/Jitter |
| 07 | Circuit Breaker | — | **[C]** **canônico do roadmap**. **[R]** Timeout, Retry |
| 08 | Bulkhead | — | **[C]** **canônico do roadmap** — padrão irmão de Circuit Breaker (isolamento de recurso × parar de chamar), não dependente dele. **[R]** Circuit Breaker |
| 09 | Rate Limiting | Platform / API Fundamentals / Rate Limiting | **[Rev→ Platform / API Fundamentals / Rate Limiting]** — canônico em Platform; aqui é aplicação/revisita como padrão de resiliência de sistema. *sub:* Throttling |

**Múltiplas Tasks-root** (`Timeout`, `Retry`, `Idempotency`, `Circuit
Breaker`, `Bulkhead`) — mesma decisão final da Story 06: `Requires` só onde há
dependência conceitual genuína (ex.: Backoff/Jitter/Retry Storm formam uma
cadeia real, pois cada um é literalmente um refinamento do anterior).

---

## Story 12 · Distributed Transactions — 6 Tasks

`Requires` (Story): `Messaging`, `Resilience Patterns`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Distributed Transaction | — | **[C]** ponto de entrada — unidade de trabalho através de múltiplos serviços/bancos |
| 02 | Two-Phase Commit (2PC) | Distributed Transaction | **[C]** solução clássica bloqueante |
| 03 | Saga Pattern | Distributed Transaction, Distributed Systems Fundamentals / Consistency Models (Strong / Eventual) | **[C]** solução não-bloqueante, consistência eventual. *sub:* Compensating Transaction. **[≠]** contraste direto com 2PC |
| 04 | Choreography | Saga Pattern | **[C]** uma das 2 formas de implementar Saga |
| 05 | Orchestration | Saga Pattern | **[C]** a outra forma |
| 06 | Transactional Outbox | Distributed Transaction, Messaging / Message Broker | **[C]** *(REPOINT — era `Requires: Saga Pattern`; outbox é usado com Saga, Event Sourcing ou CDC, não exclusivo de Saga)*. **[R]** Saga Pattern |

**Racional**: o problema → 2PC → Saga (alternativa não-bloqueante) →
Choreography × Orchestration (as 2 formas de implementar Saga) → outbox
(detalhe que torna publicação de evento + transação confiáveis juntos).

---

## Story 13 · Data & Architecture Patterns — 5 Tasks

`Requires` (Story): `Messaging`, `Data Distribution`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | CQRS | — | **[C]** generaliza CQS (Software Design / Design Principles) do nível de método para o nível de arquitetura — **sem `Requires` formal** (decisão final, PENDENTE-3), só pointer histórico-conceitual. **[R]** Software Design / Design Principles / CQS |
| 02 | Event Sourcing | Messaging / Event | **[C]** armazena um log de eventos — precisa saber o que é um Event. **[R]** CQRS (comumente combinados, mas independentes) |
| 03 | Materialized View | — | **[C]** conceito de banco de dados genérico, usável fora de qualquer contexto CQRS. **[R]** CQRS |
| 04 | Database per Service | Architectural Styles / Microservices | **[C]** só faz sentido no contexto do que é um "serviço" (microserviços). *sub:* Shared Database (anti-padrão, contraste) |
| 05 | Change Data Capture (CDC) | — | **[C]** técnica geral, não exclusiva de "database per service". **[R]** Database per Service, Messaging / Message Broker (integração comum) |

**Racional**: CQRS → Event Sourcing → Materialized View → Database per
Service → CDC. `Read Replica` do rascunho original removida — aplicação
direta de `Replication` (Story 08), não conceito novo.

---

## Story 14 · Architecture Evolution — 5 Tasks

`Requires` (Story): `Software Craft / Dependency & Version Management`,
`Software Craft / Engineering Documentation`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Evolutionary Architecture | — | **[C]** ponto de entrada — arquitetura como algo que muda de forma guiada. **[R]** Architecture Fundamentals / Trade-offs, Software Craft / Engineering Documentation / ADR |
| 02 | Fitness Functions | Evolutionary Architecture | **[C]** o mecanismo central da própria teoria de Evolutionary Architecture. **[R]** Testing & Quality Engineering / Testing Strategy |
| 03 | Strangler Fig Pattern | Evolutionary Architecture | **[C]** a técnica concreta de como evoluir incrementalmente. **[R]** Architectural Styles / Monolith (exemplo canônico, não pré-requisito estrito) |
| 04 | Migration Strategy | Strangler Fig Pattern, Software Craft / Dependency & Version Management / Technical Debt, Software Craft / Dependency & Version Management / Backward Compatibility | **[C]** capstone. **[R]** Platform / Database Design / Database Migration |
| 05 | Build vs Buy | Architecture Fundamentals / Trade-offs | **[C]** decisão de trade-off aplicada |

`ADR`, `Backward Compatibility`, `Technical Debt at Architecture Level` do
rascunho original **não viram Task própria** — já canônicos em `Software
Craft` (Epic 03, FROZEN); aplicados via `Requires`/`revisit` nas Tasks reais
acima.

---

## Conceitos canônicos que a Epic 06 passa a "possuir"

| Conceito | Story dona |
|---|---|
| Architecture vs Design, Architectural Characteristics/Constraints, Trade-offs, Modularity, Dependency Direction | 01 Architecture Fundamentals |
| Layered, Dependency-Rule (Clean/Hexagonal/Onion), Monolith, Modular Monolith, Microservices, SOA, Event-Driven Architecture, Microkernel | 02 Architectural Styles |
| Functional/Non-Functional Requirements, Capacity Estimation, Bottlenecks, SPOF | 03 System Design Fundamentals |
| Scalability, Vertical/Horizontal Scaling, Statelessness, **Load Balancing**, **Auto Scaling**, Backpressure | 04 Scalability |
| Distributed Cache, Cache Stampede, Cache Coherence | 05 Caching at Scale |
| Availability, Reliability, Fault Tolerance, Redundancy, Failover, Graceful Degradation, Disaster Recovery (RTO/RPO) | 06 Availability & Reliability |
| Distributed System, Partial Failure, Network Partition, Clock & Time, Consistency Models, CAP, PACELC, Consensus, Leader Election | 07 Distributed Systems Fundamentals |
| Replication (+ Topologies), Partitioning, Sharding, Consistent Hashing, Hotspot, Rebalancing | 08 Data Distribution |
| Sync vs Async Communication, RPC, gRPC, Service Discovery, API Gateway, Reverse Proxy, Service Mesh | 09 Service Communication |
| Message Queue, Message Broker, Pub/Sub, Event, Consumer Groups, Message Ordering, Delivery Semantics, Dead Letter Queue | 10 Messaging |
| Timeout, Retry, **Idempotency**, Backoff, Jitter, Retry Storm, Circuit Breaker, Bulkhead | 11 Resilience Patterns |
| Distributed Transaction, 2PC, Saga (+ Compensating Transaction), Choreography, Orchestration, Transactional Outbox | 12 Distributed Transactions |
| CQRS, Event Sourcing, Materialized View, Database per Service, CDC | 13 Data & Architecture Patterns |
| Evolutionary Architecture, Fitness Functions, Strangler Fig, Migration Strategy, Build vs Buy | 14 Architecture Evolution |

**`canonical: false` + `revisitOf` (2 Tasks):**

| Task | revisitOf |
|---|---|
| 02 Architectural Styles / Serverless Architecture | Platform / Cloud Fundamentals / Serverless |
| 11 Resilience Patterns / Rate Limiting | Platform / API Fundamentals / Rate Limiting |

**Confirmação das decisões FROZEN do Epic 05** (não alteradas, só aplicadas):
`Load Balancing`/`Auto Scaling` canônicos aqui (Platform/Cloud Fundamentals
contém os `revisitOf` correspondentes, já existentes no arquivo FROZEN do
Epic 05); `Idempotency` (genérico) canônico aqui; `Latency`/`Throughput`/
`Profiling`/`Principle of Least Privilege`/`Middleware / Request
Pipeline`/`Request Validation`/`Input Validation`/`N+1 Query Problem`
permanecem canônicos em Platform — nenhuma Task deste Epic os recria.

### Revisitas que entram na Epic 06 (dos Epics 01–05, já aprovados)

| Conceito canônico | Onde é revisitado aqui |
|---|---|
| Programming Foundations / Programming Fundamentals / Coupling, Cohesion | Architecture Fundamentals / Trade-offs |
| Programming Foundations / Programming Fundamentals / Separation of Concerns | Architecture Fundamentals / Modularity |
| Software Design / SOLID / DIP | Architecture Fundamentals / Dependency Direction |
| Software Design / Domain Modeling / Bounded Context | Architectural Styles / Microservices |
| Platform / Performance Engineering / Latency, Throughput | System Design Fundamentals / Capacity Estimation |
| Programming Foundations / Data Structures / Hash Table | Data Distribution / Consistent Hashing |
| Programming Foundations / Concurrency | Scalability / Backpressure; Resilience Patterns |
| Software Design / Design Principles / CQS | Data & Architecture Patterns / CQRS |
| Software Craft / Engineering Documentation / ADR | Architecture Evolution / Evolutionary Architecture |
| Software Craft / Dependency & Version Management / Technical Debt, Backward Compatibility | Architecture Evolution / Migration Strategy |
| Platform / Database Design / Database Migration | Architecture Evolution / Migration Strategy |
| Testing & Quality Engineering / Testing Strategy | Architecture Evolution / Fitness Functions |
| Platform / API Fundamentals / Rate Limiting | Resilience Patterns / Rate Limiting (`revisitOf`) |
| Platform / Cloud Fundamentals / Serverless | Architectural Styles / Serverless Architecture (`revisitOf`) |

---

## Colisões de nome a desambiguar

| A | B | Distinção |
|---|---|---|
| `Consistency Models` (distribuído, Story 07) | `Consistency (ACID)` (Platform / Database Transactions) | acordo entre réplicas × garantia intra-transação |
| `Serverless Architecture` (estilo, Story 02) | `Serverless` (primitivo, Platform / Cloud Fundamentals) | `revisitOf` — decisão × primitivo técnico |
| `Rate Limiting` (Story 11, revisita) | `Rate Limiting` (Platform / API Fundamentals, canônico) | `revisitOf` — quota de API × padrão de resiliência de sistema |
| `Load Balancing`/`Auto Scaling` (Story 04, canônico aqui) | `Load Balancer`/`Auto Scaling` (Platform / Cloud Fundamentals, `revisitOf`) | conceito × recurso concreto de cloud |
| `Idempotency` (Story 11, conceito de resiliência) | `Idempotency Key` (Platform / API Fundamentals, mecânica HTTP) | propriedade de operação × mecanismo concreto |
| `Event` (Messaging, Story 10) | `Domain Event` (Software Design / Domain Modeling) | evento de transporte/infraestrutura × evento de modelagem DDD — **ambos canônicos, sem `revisitOf`** (PENDENTE-2, decisão final) |
| `Distributed System` (Story 07) | `Client-Server Model` (Platform / Web Fundamentals) | teoria geral × topologia particular |
| `Service Discovery`/`Service Mesh` (Story 09) | `Service` (Platform / Kubernetes) · `Service Layer`/`Domain Service` (Software Design) · `Service Account` (Platform / Cloud Security) | mesma palavra, 4 sentidos |
| `CQRS` (Story 13) | `CQS` (Software Design / Design Principles) | arquitetura de sistema × convenção de método — sem `Requires` formal (PENDENTE-3, decisão final) |
| `Sync vs Async Communication` (Story 09) | `Sync/Async` (Programming Foundations / Asynchronous Programming) | comunicação entre serviços × control-flow de linguagem |
| `2PC` (Distributed Transactions) | `ACID`/`Transaction` (Platform / Database Transactions) | transação distribuída multi-nó × transação local single-DB |

---

## Consolidações e subtopics

### As 7 consolidações auditadas

**Umbrella 3→1 (5):** Clean Architecture + Hexagonal Architecture + Onion
Architecture → `Dependency-Rule Architectures` · Disaster Recovery + RTO +
RPO → `Disaster Recovery (RTO / RPO)` · Consistency + Strong Consistency +
Eventual Consistency → `Consistency Models (Strong / Eventual)` ·
Leader-Follower + Multi-Leader + Leaderless Replication → `Replication
Topologies` · At-Most-Once + At-Least-Once + Exactly-Once Delivery →
`Delivery Semantics`.

**Par fundido 2→1 (2):** Stateless Systems + Stateful Systems →
`Statelessness` · Synchronous Communication + Asynchronous Communication →
`Synchronous vs Asynchronous Communication`.

### Rebaixamentos a subtopic/pointer (11)

Load Balancing Algorithms → sub de `Load Balancing` · Bandwidth → sub de
`Capacity Estimation` · High Availability → sub de `Availability` · Sharding
Strategies → sub de `Sharding` · Request-Response → sub de `Synchronous vs
Asynchronous Communication` · Producer & Consumer → sub de `Message Queue` ·
Topic → sub de `Pub/Sub` · Command vs Event → sub de `Event` · Throttling →
sub de `Rate Limiting` (revisita) · Compensating Transaction → sub de `Saga
Pattern` · Shared Database → sub/contraste de `Database per Service`.

### Removidas / realocadas

- `Read Replica` — removida, duplicata direta de `Replication` (Story 08).
- `Resilience` (genérico) — removida, sobrepunha o próprio título da Story 11.
- `Hotspot` — realocada de `Scalability` (Story 04) para `Data Distribution`
  (Story 08).
- `Trade-off Analysis` — absorvida como pointer de `Bottlenecks`, evita
  duplicar `Trade-offs` (Story 01).
- `Eventual Consistency with Events` — absorvida em `Delivery Semantics`.
- `ADR`, `Backward Compatibility`, `Technical Debt at Architecture Level`,
  `Coupling`, `Cohesion`, `Separation of Concerns`, `Latency`, `Throughput` —
  não recriadas, já canônicas em outras Epics FROZEN.

---

## Sugestões que ficaram fora (`SUGESTÃO`, não incorporadas)

| Sugestão | Onde entraria | Motivo de ficar fora |
|---|---|---|
| Chaos Engineering | Resilience Patterns ou nova Story | já era `SUGESTÃO` de "Non-Functional Testing" nos Epics 02/05 |
| Vector Clocks / Lamport Timestamps | Distributed Systems Fundamentals / Clock & Time | hoje só subtopic implícito |
| Quorum (W+R>N) | Data Distribution / Replication Topologies | hoje subtopic implícito de Leaderless Replication |
| API Composition | Data & Architecture Patterns | cobertura parcial em CQRS |
| Sidecar Pattern | Service Communication / Service Mesh | detalhe de implementação de Service Mesh |
| Anti-Corruption Layer | Architectural Styles / Domain Modeling (Epic 04, FROZEN) | Epic 04 já fechado — só cabe como nota |
| Backends for Frontends (BFF) | Service Communication / API Gateway | variação de API Gateway |
| Active-Active vs Active-Passive (multi-região) | Availability & Reliability | extensão de Failover/DR, não incluída para não inflar a Story |

*SUGESTÃO de Story:* nenhuma nova — as 14 Stories da macro já cobrem o escopo
clássico de Architecture & System Design.

---

## Decisões aprovadas (Fase 2 · Epic 06)

1. **Tamanho** — 93 Tasks, sem meta artificial de contagem; resultado do
   merge granularidade + auditoria de ownership + auditoria de `Requires`.
2. **Consolidações** — 7 aprovadas (5 umbrella 3→1 + 2 par 2→1), sem perda de
   conceito independente.
3. **Ownership canônico do Epic 05 preservado integralmente** — `Rate
   Limiting`/`Idempotency Key` em Platform; `Load Balancing`/`Auto
   Scaling`/`Idempotency` (genérico) canônicos aqui; `Serverless` (primitivo)
   em Platform; `Latency`/`Throughput`/`Profiling` em Platform.
4. **Auditoria de `Requires`** — 108 arestas auditadas com o teste "impossível/
   inadequado entender B sem A": **63 KEEP, 42 relações removidas de
   `Requires` (preservadas como pointer/contexto quando aplicável), 3
   REPOINT**. Resultado: `Requires` reflete só dependência conceitual real;
   múltiplas Tasks-root por Story são aceitáveis (Stories 06 e 11 em
   particular).
5. **PENDENTE-1 — Microkernel Architecture**: mantida como Task própria.
6. **PENDENTE-2 — `Event` × `Domain Event`**: ambos `canonical: true`, colisão
   `[≠]` documentada, **sem** `revisitOf`.
7. **PENDENTE-3 — `CQRS ← CQS`**: `Requires` removido; `CQS` preservado como
   `revisit`/pointer histórico-conceitual.
8. **PENDENTE-4 — inversões em Availability & Reliability**: não recriadas em
   nenhuma direção (nem a original nem a invertida) — ambas falhavam o teste
   de dependência real.
9. **PENDENTE-5 — fragmentação (múltiplas Tasks-root)**: aceita como correta
   nas Stories 06 e 11 — `Requires` não existe para "conectar visualmente" a
   árvore.

Nenhuma pendência remanescente.

---

## Mudanças não silenciosas

### vs macro da Fase 1 (`00-overview.md`)

**Nenhuma.** As 14 Stories, seus nomes, sua ordem e suas `Requires` de Story
foram preservados literalmente. `Rate Limiting`, `Serverless`, `Load
Balancing`/`Auto Scaling` seguem exatamente as regras já FROZEN no Epic 05.

### vs o rascunho não aprovado (`architecture-e-system-design.md`)

Estrutural — registrado por transparência:
- `Hotspot` realocado de `Scalability` (04) para `Data Distribution` (08).
- `ADR`, `Backward Compatibility`, `Technical Debt at Architecture Level`,
  `Coupling`, `Cohesion`, `Separation of Concerns` removidas como Tasks
  próprias — absorvidas via `Requires`/`revisit`.
- 7 consolidações + 11 rebaixamentos a subtopic reduziram o catálogo original
  de ~98 candidatos a Task para as 93 finais.
- Refinamento do grafo de `Requires`: da proposta inicial de 108 arestas, só
  63 (+ 3 repointed) sobreviveram ao teste ORDER ≠ REQUIRES; as demais 42
  foram removidas de `Requires` e preservadas como pointer/contexto quando
  aplicável, sem inflar o grafo de dependência formal.

---

## Auditoria de ciclos e forward dependencies (validada em `data/roadmap.js`)

- **Grafo de `Requires` de Story:** DAG. Toda `Requires` de Story aponta para
  Story de número menor dentro do próprio Epic, ou para Epic externo já
  FROZEN (01, 03, 04, 05). **Zero ciclos, zero forward references.**
- **Grafo de `Requires` de Task:** 66 arestas finais (63 KEEP + 3 REPOINT), 59
  internas ao Epic 06 e 7 cross-epic (todas para Epics 01/03/04/05, backward).
  Verificado por script (ordem topológica = `story.order * 1000 +
  task.order`): **zero ciclos, zero forward references.**
- **Cross-epic:** nenhuma `Requires` aponta para o Epic 07 (ainda não
  iniciado). As únicas arestas na direção oposta (Platform → Architecture)
  já existiam, FROZEN, desde o Epic 05 (`Load Balancer`/`Auto Scaling` como
  `revisitOf`, forward-reference aceita e documentada desde então).

---

## Próximo passo

**Aprovação final (FROZEN) registrada em 2026-09-08.** Consolidação nesta
rodada:
- `roadmap/06-architecture-system-design.md` criado (este arquivo);
- `roadmap/00-overview.md` atualizado (seção `06 · Architecture & System
  Design`, tabela de progresso da Fase 2, dependências de alto nível,
  conceitos transversais, navegabilidade da Fase 3 até o Epic 06);
- `PLAN.md` atualizado (Histórico, tabela de Fases);
- `data/roadmap.js` atualizado — Epic 06 passa de `status: "structuring"` /
  `plannedStories` para navegável, com as 14 Stories e 93 Tasks.

A Fase 2 do **Epic 07 · AI Engineering** continua **não iniciada** — passo
futuro separado, com sua própria rodada de aprovação.
