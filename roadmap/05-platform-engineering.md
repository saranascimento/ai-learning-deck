# Epic 05 · Platform Engineering — detalhamento de Tasks (Fase 2)

> **Estado: APROVADO / FINAL / FROZEN (Fase 2 · Epic 05 — 2026-09-05).** As 10
> decisões da usuária e as 4 correções pós-aprovação estrutural foram aprovadas.
> Incorporado a `00-overview.md`, `PLAN.md` e `data/roadmap.js` em 2026-09-05.
> O Epic 06 · Architecture & System Design segue **não iniciado** — abrir sua
> Fase 2 é um passo futuro separado, não uma consequência desta aprovação.
>
> Base: as 21 Stories do rascunho original `platform-engineering.md` ("base
> sólida; ordem interna quase pedagógica já"). Produzido por merge estrito
> proposta → auditoria → 10 decisões (autoridade final). Preserva todas as
> decisões já aprovadas nos Epics 01, 02, 03 e 04.

### Contabilidade de Tasks

- **21 Stories, 187 Tasks** — 183 canônicas + **4** `canonical: false` + `revisitOf`.
- **46 consolidações auditadas** (Tipo A umbrella 23 · Tipo B par 17 · Tipo C
  absorção 6), aprovadas em bloco — cada uma vira 1 Task com `subtopics`, sem
  perda de conceito independente.
- **+9 rebaixamentos §C/§D** além das 46 (`Request & Response`→sub de HTTP;
  `HTTPS`→sub de TLS; `CTE`→`Subqueries & CTEs`; `Index Selectivity`→sub de
  Index; `Cache Hit / Miss`→sub de Cache; `Dashboard`→sub de Metrics;
  `Environment`+`Environment Variables`→`Environments & Configuration`;
  `Dockerfile`→sub de Docker Image; `Docker Compose`→sub de Docker Volumes &
  Networks).
- **+2 renomeações vendor-agnostic**: `Redis`→`In-Memory Data Store` (sub: Redis,
  Valkey, Memcached); `DataLoader`→`Batching & Per-Request Caching` (sub: DataLoader).
- **~30 `Requires` de ordem de estudo removidos/reapontados** (regra §F), incluindo
  **4 invertidos** corrigidos: `TLS`, `Build`, `Environments & Configuration`,
  `CIDR & IP Address`. A posição na tabela (ordem de estudo) foi preservada em
  todos os casos.
- **Tasks novas**: `Middleware / Request Pipeline` (Story 02) — ancora o `Chain of
  Responsibility` que o Epic 04 deixou como Advanced/Optional; o pattern
  **continua SUGESTÃO no Epic 04**, não é movido.
- **Dependência formalizada nesta rodada**: `Epic 04 / Enterprise & Application
  Patterns` → `Requires: Platform / Database Fundamentals` (era pendência sem
  `Requires` formal desde a Fase 2 do Epic 04).

Legenda (mesma dos Epics 03 e 04):
`Requires:` **dependência conceitual real** — "não dá para entender B sem antes
entender A" (sem prefixo = mesma Story; com prefixo = outra Story/Epic) ·
**[C]** conceito canônico · **[R]** revisita/aplica conceito de outra Story/Epic
(continua canônico aqui) · **[Rev→ X]** `canonical: false` + `revisitOf: X` ·
**[≠]** colisão de nome a desambiguar · *sub:* subtopics · `SUGESTÃO` Task/Story
nova, não incluída.

> **Ordem de estudo ≠ `Requires`.** A numeração é a sequência recomendada de
> estudo; só vira `Requires` quando há dependência conceitual genuína.

`Requires` (baseline implícito de **todas** as Stories, não repetido em cada
linha): a Epic inteira `Requires: Programming Foundations` (nível macro, Fase 1 —
"pouca dependência conceitual, muito volume").

---

## Stories da Epic (ordem de estudo)

```
01 · Web Fundamentals              16 Tasks
02 · API Fundamentals             15 Tasks
03 · GraphQL                       7 Tasks
04 · Database Fundamentals        10 Tasks
05 · Database Design               7 Tasks
06 · Database Transactions         7 Tasks
07 · Database Performance          7 Tasks
08 · NoSQL                         4 Tasks
09 · Caching                       9 Tasks
10 · Authentication               10 Tasks
11 · Authorization                 5 Tasks
12 · Application Security         14 Tasks
13 · Observability                 9 Tasks
14 · Performance Engineering      10 Tasks
15 · Reliability Engineering       8 Tasks
16 · Containers                    7 Tasks
17 · CI/CD                        11 Tasks
18 · Cloud Fundamentals            9 Tasks
19 · Cloud Networking              6 Tasks
20 · Cloud Security                7 Tasks
21 · Kubernetes Fundamentals       9 Tasks
                                 ─── 187 Tasks
```

Racional macro (já aprovado na Fase 1): protocolo web → REST → GraphQL
(contraste) → banco relacional (fundamentos → modelagem → transações →
performance) → NoSQL → caching → auth → authz → segurança → observabilidade →
performance/confiabilidade → containers → CI/CD → cloud → rede → segurança de
cloud → Kubernetes.

**Cadeia de `Requires` real entre Stories** (só dependência conceitual genuína):

```
Web Fundamentals ──▶ API Fundamentals ──▶ GraphQL
Web Fundamentals ──▶ Authentication ──▶ Authorization ──▶ Application Security
Web Fundamentals ──▶ Cloud Networking
Web Fundamentals + Database Fundamentals ──▶ Caching
Database Fundamentals ──▶ Database Design ──▶ Database Performance
Database Fundamentals ──▶ Database Transactions
Database Design ──▶ NoSQL
Observability ──▶ Performance Engineering
Observability ──▶ Reliability Engineering
Containers ──▶ CI/CD
Containers ──▶ Cloud Fundamentals
Authorization + Cloud Fundamentals ──▶ Cloud Security
Containers + Cloud Networking ──▶ Kubernetes Fundamentals
```

Sem cadeia: os 3 blocos de banco entre si (Transactions ↛ Performance ↛ NoSQL —
só compartilham `Database Fundamentals`/`Design`); `Observability ↛ Containers`
(era ordem de estudo apenas).

---

## Story 01 · Web Fundamentals — 16 Tasks

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Client-Server Model | — | **[C]** ponto de entrada |
| 02 | HTTP | Client-Server Model | **[C]** *sub: request/response, versão stateless* — absorve `Request & Response` do rascunho |
| 03 | HTTP Methods | HTTP | **[C]** GET/POST/PUT/PATCH/DELETE; safe & idempotent methods |
| 04 | HTTP Status Codes | HTTP | **[C]** classes 1xx–5xx |
| 05 | HTTP Headers | HTTP | **[C]** |
| 06 | HTTP Evolution (1.1 / 2 / 3) | HTTP | **[C]** *consol. A1 — sub:* keep-alive/pipelining · multiplexing/HPACK · QUIC/UDP, 0-RTT |
| 07 | TLS | — | **[C]** handshake, certificados, cadeia de confiança, SNI, HSTS. *sub: HTTPS = HTTP sobre TLS.* **[R]** Application Security / Encryption at Rest & in Transit aponta para cá |
| 08 | DNS | Client-Server Model | **[C]** resolução, registros, TTL de DNS. **[≠]** TTL de DNS ≠ TTL de cache (Story 09) |
| 09 | TCP vs UDP | — | **[C]** *consol. A2 — sub:* handshake/ordenação/retransmissão × fire-and-forget/baixo overhead |
| 10 | URL Anatomy | — | **[C]** scheme/host/port/path/query/fragment |
| 11 | Cookies | HTTP Headers | **[C]** atributos `Secure`/`HttpOnly`/`SameSite` |
| 12 | Sessions | Cookies | **[C]** **[≠]** ≠ `Session-Based Authentication` (Story 10) — mecanismo de estado × uso para identidade |
| 13 | Same-Origin Policy | URL Anatomy | **[C]** |
| 14 | CORS | Same-Origin Policy | **[C]** preflight, headers `Access-Control-*` |
| 15 | WebSocket | HTTP Headers | **[C]** **[R]** Epic 01 / Asynchronous Programming (canal full-duplex sobre event loop) |
| 16 | Server-Sent Events (SSE) | HTTP | **[C]** **[R]** Epic 01 / Asynchronous Programming / Promise, streaming; **[R]** Epic 07 / Model Inference / Streaming aponta para cá |

**Racional**: modelo cliente-servidor → HTTP e seus componentes → evolução do
protocolo → camada segura (TLS) → resolução de nomes → transporte → anatomia de
URL → estado no cliente (cookies/sessions) → política de origem (SOP/CORS) →
canais persistentes (WebSocket/SSE).

---

## Story 02 · API Fundamentals — 15 Tasks

`Requires` (Story): `Web Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | API | — | **[C]** |
| 02 | API Contract | Programming Foundations / Programming Fundamentals / Contract | **[C]** **[R]** aplica `Contract` (pré/pós-condições) a fronteira de serviço. **[R]** Epic 02 / Testing Strategy / Contract Testing verifica isto |
| 03 | REST | API | **[C]** restrições REST, HATEOAS (menção), níveis de maturidade de Richardson |
| 04 | Resource Modeling & RESTful URLs | REST | **[C]** *consol. A15* — substantivos, hierarquia, coleção × item, path × query param |
| 05 | Request Validation | REST | **[C]** validação do **contrato/boundary da API**: shape, tipos, campos obrigatórios, formato. **[≠]** ≠ `Application Security / Input Validation` (defesa contra entrada maliciosa) — conceitos distintos. **[R]** pointer para `Application Security / Input Validation` (não `revisitOf`) |
| 06 | Response Design | REST | **[C]** envelope, status coerente, `Location` em criação |
| 07 | Error Response Design | Response Design | **[C]** **[R]** Epic 03 / Error Handling / Result Pattern; RFC 7807 (problem+json) |
| 08 | Pagination (Offset / Cursor) | Response Design | **[C]** *consol. A3 — sub:* offset/limit (simples, page drift) × cursor/keyset (estável, requer ordenação total) |
| 09 | Filtering & Sorting | Response Design | **[C]** *consol. A16* — operadores de filtro, ordenação multi-campo, whitelist de campos |
| 10 | Idempotency Key | Web Fundamentals / HTTP Methods | **[C]** **canônico** — mecânica HTTP (header + store de dedup + replay de resposta; retry seguro de POST). **[≠]** ≠ `Idempotency` conceito de resiliência (Epic 06 / Resilience Patterns). **Mudança não silenciosa** vs Fase 1 (que dizia "Platform/API referencia") |
| 11 | Rate Limiting | — | **[C]** **canônico** — token/leaky bucket (sub), `429`, `Retry-After`, headers de quota. Epic 06 / Resilience Patterns e Epic 07 revisitam. **Mudança não silenciosa** vs Fase 1 (que colocava em Architecture / Resilience Patterns) |
| 12 | API Versioning | API Contract | **[C]** **[R]** Epic 03 / Semantic Versioning, Backward Compatibility (URL vs header vs media type) |
| 13 | API Deprecation | API Versioning | **[C]** **[R]** Epic 03 / Deprecation (sunset headers, janelas de migração) |
| 14 | OpenAPI | API Contract | **[C]** **[R]** absorve o `SUGESTÃO: API Documentation` deixado pelo Epic 03 (spec-as-doc, Swagger UI, contract-first) |
| 15 | Middleware / Request Pipeline | API | **[C]** **NOVA** — cadeia de handlers (auth, logging, rate limiting, validação) antes do controller. **[R]** Epic 04 / Behavioral Patterns / `Chain of Responsibility` (que **continua SUGESTÃO** no Epic 04 — não é movido) |

**Racional**: o que é API → contrato → REST → modelar recursos e URLs → validar
o contrato de entrada → desenhar resposta e erro → paginação/filtro/ordenação →
idempotência e rate limiting (robustez de tráfego) → versionamento/deprecação →
OpenAPI (especificação) → middleware (a estrutura transversal que amarra tudo).

---

## Story 03 · GraphQL — 7 Tasks

`Requires` (Story): `API Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | GraphQL Schema & Type System | — | **[C]** *consol. A13* — SDL, scalars/object/enum/input, `Nullability` (sub), schema como contrato |
| 02 | Query / Mutation / Subscription | GraphQL Schema & Type System | **[C]** *consol. A14* — as 3 operações raiz; Subscription **[R]** Web Fundamentals / WebSocket |
| 03 | Resolver | GraphQL Schema & Type System | **[C]** função por campo; resolver chain |
| 04 | N+1 in Resolvers | Resolver | **[Rev→ Platform / Database Performance / N+1 Query Problem]** — manifestação GraphQL (resolver dispara 1 query por item); GraphQL revisita, não cria 2ª canônica |
| 05 | Batching & Per-Request Caching | N+1 in Resolvers | **[C]** estratégia vendor-agnostic de mitigação do N+1: batching + cache por request. *sub/exemplo: DataLoader* |
| 06 | Query Complexity | Resolver | **[C]** custo/profundidade, limites, timeout — superfície de ataque DoS |
| 07 | GraphQL vs REST | REST, GraphQL Schema & Type System | **[C]** quando cada um; over/under-fetching; caching; tooling |

`SUGESTÃO` (não incluídas — trimming): `Arguments`, `Variables`, `Fragments`,
`Interfaces`, `Unions`, `Persisted Queries`, `Error Handling` (parcial em
`Query Complexity`). `Nullability` virou subtopic de 01.

---

## Story 04 · Database Fundamentals — 10 Tasks

`Requires` (Story): baseline apenas. → **confirma a dependência formal do
Epic 04 / Enterprise & Application Patterns.**

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Relational Database | — | **[C]** modelo relacional, tuplas/relações |
| 02 | SQL | Relational Database | **[C]** DDL/DML/DQL |
| 03 | Table | Relational Database | **[C]** a unidade que PK/FK/Constraint referenciam |
| 04 | Primary Key | Table | **[C]** **[≠]** `Natural vs Surrogate Key` (Story 05) discute a escolha |
| 05 | Foreign Key | Primary Key | **[C]** integridade referencial |
| 06 | Constraint | Table | **[C]** NOT NULL, UNIQUE, CHECK, DEFAULT |
| 07 | JOIN | Foreign Key | **[C]** *consol. A17 — sub:* INNER, LEFT/RIGHT OUTER, FULL OUTER, CROSS, self-join |
| 08 | Aggregate Functions & GROUP BY | SQL | **[C]** *consol. A18* — COUNT/SUM/AVG…, `GROUP BY`, `HAVING` × `WHERE` |
| 09 | Subqueries & CTEs | SQL | **[C]** *consol. §D* — correlacionada × não-correlacionada; `WITH`, CTE recursiva (menção) — absorve `CTE` do rascunho |
| 10 | Database Schema | Table, Constraint | **[C]** **[≠]** ≠ `Schema-on-Read` (Story 08) ≠ `GraphQL Schema` (Story 03) ≠ `JSON Schema` (Epic 07) |

---

## Story 05 · Database Design — 7 Tasks

`Requires` (Story): `Database Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Data Modeling | Database Schema | **[C]** conceitual → lógico → físico. **[R]** Epic 04 / Domain Modeling / Entity (a Entity de domínio vira tabela) |
| 02 | Relationship Cardinality (1:1 / 1:N / N:M) | Foreign Key | **[C]** *consol. A4 — sub:* 1:1 · 1:N (FK no lado "muitos") · N:M (tabela de junção, atributos na junção) |
| 03 | Normalization | Relationship Cardinality (1:1 / 1:N / N:M) | **[C]** anomalias de inserção/atualização/remoção |
| 04 | Normal Forms (1NF / 2NF / 3NF) | Normalization | **[C]** *consol. A5* — BCNF como menção |
| 05 | Denormalization | Normal Forms (1NF / 2NF / 3NF) | **[C]** trade-off leitura × escrita/consistência. **[R]** Caching (Story 09) — mesma tensão |
| 06 | Natural vs Surrogate Key | Primary Key | **[C]** UUID vs auto-incremento; implicações de índice |
| 07 | Database Migration | Database Schema | **[C]** **[R]** Epic 03 / Incremental Migration; migrations versionadas, forward-only, expand/contract |

---

## Story 06 · Database Transactions — 7 Tasks

`Requires` (Story): `Database Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Transaction | SQL | **[C]** BEGIN/COMMIT/ROLLBACK; unidade de trabalho. **[R]** Epic 04 / Enterprise Patterns / Unit of Work abstrai isto (pointer) |
| 02 | ACID (A / C / D) | Transaction | **[C]** *consol. A7 + C6 — sub:* Atomicity · **Consistency (ACID)** (subtopic **nomeado** — endereçável para a colisão) · Durability. **[≠]** `Consistency (ACID)` ≠ `Distributed Consistency` (Epic 06) — sentidos diferentes |
| 03 | Isolation | ACID (A / C / D) | **[C]** por que o "I" é separado — é o que se relaxa na prática |
| 04 | Isolation Levels | Isolation | **[C]** Read Uncommitted → Serializable; trade-off com throughput |
| 05 | Read Phenomena (Dirty / Non-Repeatable / Phantom) | Isolation Levels | **[C]** *consol. A6* — matriz "qual nível previne qual" |
| 06 | Optimistic Locking | Isolation | **[C]** **[R]** Epic 01 / Concurrency / Race Condition; versão/timestamp, retry em conflito |
| 07 | Pessimistic Locking | Isolation | **[C]** **[R]** Epic 01 / Concurrency / Deadlock (`SELECT … FOR UPDATE`, ordem de lock) |

---

## Story 07 · Database Performance — 7 Tasks

`Requires` (Story): `Database Design`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Index | Database Schema | **[C]** **[R]** Epic 01 / Data Structures / BST, Hash Table (B-tree × hash index; absorve o `B-Tree` só citado antes). *sub: Index Selectivity* — cardinalidade, quando um índice não ajuda |
| 02 | Composite Index | Index | **[C]** regra do prefixo mais à esquerda; ordem das colunas |
| 03 | Query Execution Plan | Index | **[C]** `EXPLAIN`; seq scan × index scan; estimativas do otimizador |
| 04 | Query Optimization | Query Execution Plan | **[C]** SARGability, evitar `SELECT *`, projeção, covering index |
| 05 | N+1 Query Problem | — | **[C]** **canônico do roadmap** — I/O por item × lote; eager loading/`IN`/join. **[≠]** `Story 03 / N+1 in Resolvers` revisita daqui |
| 06 | Connection Pool | — | **[C]** **[R]** Epic 01 / Concurrency (recurso compartilhado limitado); tamanho do pool, exaustão, timeout |
| 07 | Slow Query Analysis | Query Execution Plan | **[C]** *consol. A20* — slow query log, p95/p99 de query, `EXPLAIN ANALYZE` (absorve `Database Profiling`) |

---

## Story 08 · NoSQL — 4 Tasks

`Requires` (Story): `Database Design`. Story pequena **deliberada** — modelo
mental próprio, não fundida em Database Design.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | SQL vs NoSQL | Normalization | **[C]** motivação: escala horizontal, esquema flexível, modelo de acesso |
| 02 | NoSQL Data Models (KV / Document / Wide-Column / Graph) | SQL vs NoSQL | **[C]** *consol. A8 — sub:* key-value · document (**[R]** Epic 04 / Aggregate — documento ≈ aggregate) · wide-column · graph |
| 03 | Schema-on-Read | NoSQL Data Models (KV / Document / Wide-Column / Graph) | **[C]** **[≠]** ≠ `Database Schema` (Story 04); validação movida para a aplicação |
| 04 | Choosing SQL vs NoSQL | NoSQL Data Models (KV / Document / Wide-Column / Graph) | **[C]** polyglot persistence; NoSQL não é "sem trade-off" |

---

## Story 09 · Caching — 9 Tasks

`Requires` (Story): `Web Fundamentals`, `Database Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Cache | — | **[C]** **[R]** Epic 01 / Algorithms & Complexity / Memoization (memoization = cache em processo). Canônico de "Caching (patterns)" para todo o roadmap. *sub: hit / miss, hit ratio, cold/warm* — absorve `Cache Hit / Miss` |
| 02 | TTL | Cache | **[C]** **[≠]** TTL de cache ≠ TTL de DNS (Story 01) ≠ TTL de pacote IP |
| 03 | Cache Invalidation | Cache | **[C]** o problema difícil; invalidação por evento × por tempo |
| 04 | Cache Eviction (LRU / LFU / FIFO) | Cache | **[C]** *consol. A12 — sub:* LRU · LFU · FIFO · random · pressão de memória × staleness |
| 05 | Cache-Aside | Cache Invalidation | **[C]** padrão mais comum; app orquestra |
| 06 | Read-Through / Write-Through / Write-Behind | Cache | **[C]** *consol. A19* — cache como intermediário; risco de perda no write-behind |
| 07 | In-Memory Data Store | Cache | **[C]** arquétipo: single-thread, estruturas de dados, persistência, uso como cache × store. *sub/exemplos: Redis, Valkey, Memcached* |
| 08 | Browser & HTTP Cache | Cache | **[C]** *consol. B2* — `Cache-Control`, `ETag`, `Last-Modified`, revalidação (304). **[R]** Web Fundamentals / HTTP Headers |
| 09 | CDN | Browser & HTTP Cache | **[C]** edge, origin pull/push, invalidação/purge, TTL de borda |

> Epic 06 / `Caching at Scale` (Distributed Cache, Cache Stampede) revisita esta
> Story com `Requires: Platform / Caching`.

---

## Story 10 · Authentication — 10 Tasks

`Requires` (Story): `Web Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Authentication vs Authorization | — | **[C]** framing; "quem é você" × "o que você pode" |
| 02 | Password Hashing | — | **[C]** bcrypt/scrypt/argon2, salt, fator de custo; nunca reversível |
| 03 | Session-Based Authentication | Web Fundamentals / Sessions | **[C]** **[≠]** usa `Sessions` (Story 01) como mecanismo |
| 04 | Token-Based Authentication | Web Fundamentals / Cookies | **[C]** stateless; onde guardar o token (cookie vs storage) |
| 05 | JWT | Token-Based Authentication | **[C]** header/payload/signature; claims; JWT ≠ criptografado por padrão |
| 06 | Access & Refresh Token | JWT | **[C]** *consol. B3* — vida curta × longa; rotação; revogação |
| 07 | OAuth 2.0 | Token-Based Authentication | **[C]** papéis, Authorization Code + PKCE; é **autorização delegada**, não login |
| 08 | OpenID Connect (OIDC) | OAuth 2.0 | **[C]** camada de identidade sobre OAuth; `id_token` |
| 09 | Single Sign-On (SSO) | Authentication vs Authorization | **[C]** IdP, SAML (menção) × OIDC |
| 10 | Multi-Factor Authentication (MFA) | Authentication vs Authorization | **[C]** fatores; TOTP, WebAuthn/passkeys (menção) |

---

## Story 11 · Authorization — 5 Tasks

`Requires` (Story): `Authentication`. Story pequena mas coerente (authz ≠ authn).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Role-Based Access Control (RBAC) | — | **[C]** papéis → permissões → usuários |
| 02 | Attribute-Based Access Control (ABAC) | — | **[C]** políticas sobre atributos (usuário/recurso/ambiente); mais flexível, mais complexo |
| 03 | Permission-Based Authorization | — | **[C]** checagem fina no ponto de uso |
| 04 | Principle of Least Privilege | — | **[C]** **canônico do roadmap** — `Cloud Security / Least Privilege in Cloud` (Story 20) e Epic 07 / AI Safety revisitam com `Requires` para cá |
| 05 | Resource Ownership | — | **[C]** "é seu?"; multi-tenancy; IDOR liga com `Application Security / Broken Access Control` |

---

## Story 12 · Application Security — 14 Tasks

`Requires` (Story): `Authentication`, `Authorization`, `Web Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Threat Modeling | — | **[C]** STRIDE, superfície de ataque, trust boundaries. **[R]** Epic 04 (fronteiras de módulo) |
| 02 | OWASP Top 10 | Threat Modeling | **[C]** framing do resto da Story |
| 03 | SQL Injection | Database Fundamentals / SQL | **[C]** queries parametrizadas; ORM não é imunidade automática |
| 04 | Cross-Site Scripting (XSS) | Web Fundamentals / Same-Origin Policy | **[C]** stored/reflected/DOM |
| 05 | Cross-Site Request Forgery (CSRF) | Web Fundamentals / Cookies | **[C]** tokens anti-CSRF, `SameSite` |
| 06 | Server-Side Request Forgery (SSRF) | — | **[C]** relevante em cloud (metadata endpoint) — liga com Story 20 |
| 07 | Broken Access Control | Authorization | **[C]** **[R]** Authorization / Resource Ownership; IDOR |
| 08 | Input Validation | — | **[C]** **canônico** — allowlist na fronteira, defesa contra entrada inválida/maliciosa. `API Fundamentals / Request Validation` (Story 02) trata o mesmo tema no contexto de contrato/request — conceitos distintos, ligados por pointer |
| 09 | Output Encoding | Cross-Site Scripting (XSS) | **[C]** encoding contextual (HTML/attr/JS/URL) |
| 10 | Content Security Policy (CSP) | Cross-Site Scripting (XSS), Web Fundamentals / HTTP Headers | **[C]** defesa em profundidade contra XSS; `nonce`/`hash` |
| 11 | Security Headers | Web Fundamentals / HTTP Headers | **[C]** HSTS, `X-Content-Type-Options`, `X-Frame-Options`/frame-ancestors, Referrer-Policy |
| 12 | Secrets Management | — | **[C]** **[≠]** ≠ `Environments & Configuration` (Story 17) ≠ `Secret Manager` (Story 20) ≠ K8s `Secret` (Story 21); rotação, nunca em VCS. **[R]** Epic 03 (`.gitignore`, história do Git) |
| 13 | Encryption at Rest & in Transit | Web Fundamentals / TLS | **[C]** *consol. B4* — **[R]** `TLS` (Story 01) para o "in transit"; KMS/envelope encryption para o "at rest" |
| 14 | Dependency Vulnerabilities | — | **[C]** *sub:* SCA, CVE/CVSS, dependências transitivas, auditoria de lockfile, supply chain (menção). Mantida aqui (D6 alterada) |

---

## Story 13 · Observability — 9 Tasks

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Observability vs Monitoring | — | **[C]** *consol. C1* (absorve `Monitoring`) — "unknown unknowns" × dashboards pré-definidos |
| 02 | Logging | — | **[C]** |
| 03 | Structured Logging | Logging | **[C]** JSON, campos consultáveis |
| 04 | Log Levels | Logging | **[C]** ERROR/WARN/INFO/DEBUG; custo e ruído |
| 05 | Correlation ID | Structured Logging | **[C]** **[≠]** propagação por request; base do tracing |
| 06 | Metrics | — | **[C]** counter/gauge/histogram; RED e USE. *sub: Dashboard* — absorve `Dashboard` |
| 07 | Distributed Tracing (Span / trace context) | Correlation ID | **[C]** *consol. A11* (Tracing + Distributed Tracing + Span) — parent/child, W3C trace context, sampling |
| 08 | OpenTelemetry | Metrics, Distributed Tracing (Span / trace context) | **[C]** padrão CNCF vendor-neutral; SDK + collector, semantic conventions. Epic 07 / AI Observability revisita |
| 09 | Alerting | Metrics | **[C]** alertar em sintoma, não causa; fadiga de alerta |

---

## Story 14 · Performance Engineering — 10 Tasks

`Requires` (Story): `Observability`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Performance vs Scalability | — | **[C]** rápido para 1 × rápido para N. **[≠]** `Scalability` conceito é canônico em Epic 06 |
| 02 | Latency | — | **[C]** **canônico do roadmap** — Epic 06 / System Design Fundamentals revisita "em escala". p50/p95/p99 |
| 03 | Throughput | — | **[C]** **canônico do roadmap**. Lei de Little (menção) |
| 04 | CPU-Bound vs I/O-Bound | — | **[C]** **canônico do roadmap** — casa canônica é Platform / Performance Engineering (Fase 1). **[R]** Epic 01 / Concurrency, Asynchronous Programming (qual modelo ajuda qual) — pointer, não lacuna do Epic 01 |
| 05 | Profiling | CPU-Bound vs I/O-Bound | **[C]** **canônico** (não tinha lar antes). **[R]** Epic 01 / Memory & Runtime / GC, Memory Leak (heap profiling); **[R]** Epic 02 / Debugging (mesma postura empírica); flame graph |
| 06 | Benchmarking | — | **[C]** micro × macro; warm-up; variância |
| 07 | Bottleneck Analysis | Profiling | **[C]** teoria das restrições; otimizar o gargalo, não o resto |
| 08 | Lazy vs Eager Loading | — | **[C]** *consol. B5* — **[R]** Story 07 / N+1 Query Problem (eager para evitar) |
| 09 | Debounce / Throttle | — | **[C]** *consol. B6 — sub:* debounce (espera silêncio) × throttle (taxa máxima) |
| 10 | Compression | — | **[C]** gzip/brotli; `Content-Encoding`; trade-off CPU × banda |

`SUGESTÃO`: `Performance Budget` — retirado para subtopic; Task própria se
reforçar o lado frontend.

---

## Story 15 · Reliability Engineering — 8 Tasks

`Requires` (Story): `Observability`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | SLI | Observability / Metrics | **[C]** o que medir (a métrica do usuário) |
| 02 | SLO | SLI | **[C]** o alvo |
| 03 | SLA | SLO | **[C]** o contrato (com consequência); SLA ⊂ SLO ⊂ SLI |
| 04 | Error Budget | SLO | **[C]** 1 − SLO; política de queima; freia release |
| 05 | Incident | — | **[C]** severidade; declarar um incidente |
| 06 | MTTD / MTTR | Incident | **[C]** *consol. B7* — MTTA, MTBF como menção |
| 07 | Incident Response | Incident | **[C]** **[R]** Epic 02 / Debugging / Reproduction, Hypothesis-Driven Debugging; **[R]** Epic 03 / Runbook (o artefato que guia a resposta) |
| 08 | Postmortem (Blameless) | Incident Response | **[C]** *consol. B8* — **[R]** Epic 02 / Debugging / Root Cause Analysis (5 Whys); ação corretiva com dono e prazo |

---

## Story 16 · Containers — 7 Tasks

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Container | — | **[C]** **[R]** Epic 01 / Concurrency / Process (namespaces + cgroups isolam processos) |
| 02 | Container vs Virtual Machine | Container | **[C]** **[R]** Epic 01 / Concurrency / Process, Thread; kernel compartilhado × hypervisor |
| 03 | Docker | Container | **[C]** engine, daemon, CLI |
| 04 | Docker Image | Docker | **[C]** **[≠]** ≠ `Artifact` de build (Story 17). *sub: Dockerfile* — instruções, ordem e cache de layers (absorve `Dockerfile`) |
| 05 | Docker Registry | Docker Image | **[C]** push/pull; público × privado |
| 06 | Docker Volumes & Networks | Docker | **[C]** *consol. B9* — persistência fora do container; bridge/host; DNS entre containers. *sub: Docker Compose* — multi-container local, não é orquestrador de produção (absorve `Docker Compose`) |
| 07 | Multi-Stage Build | Docker Image | **[C]** imagem final enxuta; separar build de runtime |

---

## Story 17 · CI/CD — 11 Tasks

`Requires` (Story): `Containers`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Continuous Integration | — | **[C]** **[≠]** ≠ `Integration Testing` (Epic 02); integrar cedo e com frequência, trunk-based |
| 02 | Continuous Delivery | Continuous Integration | **[C]** sempre pronto para release; passo manual de deploy |
| 03 | Continuous Deployment | Continuous Delivery | **[C]** deploy automático após pipeline verde |
| 04 | CI/CD Pipeline | Continuous Integration | **[C]** stages, gates, fail-fast |
| 05 | Build | — | **[C]** **[R]** Epic 03 (`SUGESTÃO: Build & Tooling`) — reproduzível, hermético |
| 06 | Artifact | Build | **[C]** **[≠]** ≠ `Docker Image` (Story 16) ≠ `Artifact` do Jira; imutável, versionado, promovido entre ambientes |
| 07 | Deployment | Artifact | **[C]** guarda-chuva real (precede Strategies/Rollback/Feature Flags) |
| 08 | Environments & Configuration | — | **[C]** *consol. §D/§G* — dev/staging/prod, paridade dev-prod, 12-factor config, env vars — funde `Environment` + `Environment Variables`. **[≠]** ≠ `Secrets Management` (Story 12) |
| 09 | Feature Flags | — | **[C]** desacoplar deploy de release; kill switch; dívida de flag |
| 10 | Rollback | Deployment | **[C]** **[R]** Epic 03 / Git / Revert (mesma ideia, nível de deploy); migração compatível com rollback |
| 11 | Deployment Strategies (Rolling / Blue-Green / Canary) | Deployment | **[C]** *consol. A9 — sub:* recreate (menção) · rolling · blue-green · canary (**[R]** Epic 02 / Testing Strategy — canary ≈ teste em produção) |

> **Pipeline como revisita do Epic 02** (sem Task nova; no racional da Story):
> `Test Runner`, `Assertion`, `Code Coverage` (coverage gates), `Test Isolation`,
> `Flaky Tests`, `Regression Testing` — aplicados como stages/gates do pipeline.

---

## Story 18 · Cloud Fundamentals — 9 Tasks

`Requires` (Story): `Containers`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Cloud Computing | — | **[C]** elasticidade, pay-as-you-go, responsabilidade compartilhada (menção → Story 20) |
| 02 | Cloud Service Models (IaaS / PaaS / SaaS) | Cloud Computing | **[C]** *consol. A10 — sub:* IaaS · PaaS · SaaS · FaaS (ponte p/ Serverless) · o que você gerencia em cada |
| 03 | Region & Availability Zone | Cloud Computing | **[C]** *consol. B10* — latência, soberania de dado, isolamento de falha |
| 04 | Compute & Virtual Machine | Cloud Computing | **[C]** *consol. B11* — instância, tipos/famílias, machine image, spot/reserved |
| 05 | Cloud Storage Types (Object / Block) | Cloud Computing | **[C]** *consol. B12 — sub:* object (blob, API HTTP) · block (volume, baixa latência) · file (menção); durabilidade × latência |
| 06 | Managed Database | Cloud Service Models (IaaS / PaaS / SaaS) | **[C]** **[R]** Stories 04–07; o que a nuvem assume (backup, patch, failover) |
| 07 | Load Balancer | Compute & Virtual Machine | **[Rev→ Architecture / Scalability / Load Balancing]** — o *primitivo* de cloud (L4/L7, health checks, algoritmos); o **conceito** `Load Balancing` permanece canônico em Epic 06 / Scalability. Recurso concreto de cloud **não** vira nova casa canônica |
| 08 | Auto Scaling | Compute & Virtual Machine | **[Rev→ Architecture / Scalability / Auto Scaling]** — primitivo aqui (políticas por métrica, min/max, cooldown); conceito em Epic 06 / Scalability. `Requires: Load Balancer` **não** existe — LB não é pré-requisito conceitual de Auto Scaling |
| 09 | Serverless | Cloud Service Models (IaaS / PaaS / SaaS) | **[C]** **canônico** — *primitivo* (FaaS, cold start, statelessness, limites, modelo de preço); Epic 06 / Architectural Styles revisita o *estilo* "serverless" |

---

## Story 19 · Cloud Networking — 6 Tasks

`Requires` (Story): `Web Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | VPC | — | **[C]** rede isolada logicamente |
| 02 | Subnet (Public vs Private) | VPC | **[C]** *consol. B13* — rota para internet gateway = pública |
| 03 | CIDR & IP Address | — | **[C]** *consol. B14* — **[R]** Web Fundamentals / DNS, TCP; IPv4/IPv6, notação `/n`, faixas privadas, sizing de subnet |
| 04 | Firewall & Security Group | Subnet (Public vs Private) | **[C]** *consol. B15* — **[≠]** stateful (SG, por instância) × stateless (NACL, por subnet); regras de entrada/saída |
| 05 | NAT & Internet Gateway | Subnet (Public vs Private) | **[C]** *consol. B16* — IGW (entrada/saída pública) × NAT (só egress de subnet privada) |
| 06 | DNS in Cloud | Web Fundamentals / DNS | **[C]** **[R]** zonas privadas, service discovery por DNS, split-horizon |

---

## Story 20 · Cloud Security — 7 Tasks

`Requires` (Story): `Authorization`, `Cloud Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | IAM | Authorization | **[C]** **[R]** identidades, autenticação de máquina, federação |
| 02 | User vs Role | IAM | **[C]** credencial de longa duração × assumida temporariamente |
| 03 | Policy | IAM | **[C]** **[≠]** documento de permissão (allow/deny, recurso, condição) ≠ política ABAC (Story 11) — relacionados |
| 04 | Service Account | User vs Role | **[C]** identidade de workload; evitar chaves estáticas |
| 05 | Least Privilege in Cloud | Policy, Authorization / Principle of Least Privilege | **[Rev→ Platform / Authorization / Principle of Least Privilege]** — aplica o canônico da Story 11; escopo mínimo, sem wildcard |
| 06 | Secret Manager | IAM | **[C]** **[≠]** o *serviço gerenciado* (rotação automática, auditoria) ≠ `Secrets Management` prática (Story 12) ≠ K8s `Secret` |
| 07 | Shared Responsibility Model | Cloud Computing | **[C]** o que é do provedor × do cliente, por modelo de serviço |

---

## Story 21 · Kubernetes Fundamentals — 9 Tasks

`Requires` (Story): `Containers`, `Cloud Networking`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Kubernetes | Containers / Docker | **[C]** orquestrador; estado desejado × reconciliação (control loop) |
| 02 | Cluster & Node | Kubernetes | **[C]** *consol. A22* — control plane (API server, etcd, scheduler) × worker (kubelet, kube-proxy, runtime) |
| 03 | Pod | Kubernetes | **[C]** menor unidade; 1+ containers; efêmero |
| 04 | Deployment & ReplicaSet | Pod | **[C]** *consol. A21* — estado desejado de réplicas; rollout/rollback, histórico de revisão |
| 05 | Service | Pod | **[C]** **[≠]** ≠ `Service Layer`/`Domain Service` (Epic 04) ≠ `Service Account` (Story 20); ClusterIP/NodePort/LoadBalancer; descoberta estável |
| 06 | Ingress | Service | **[C]** roteamento HTTP L7 para dentro do cluster; ingress controller |
| 07 | ConfigMap & Secret | Pod | **[C]** *consol. B17* — **[≠]** K8s `Secret` é base64, não cifrado por padrão — ver Story 12/20 |
| 08 | Horizontal Pod Autoscaler | Deployment & ReplicaSet, Observability / Metrics | **[C]** **[R]** escala por métrica; análogo a `Auto Scaling` (Story 18) no nível de pod |
| 09 | Liveness & Readiness Probes | Pod | **[C]** *consol. A23* — **[R]** Epic 06 / Availability (health check, graceful degradation); reiniciar × tirar de rotação; startup probe (sub) |

---

## Conceitos canônicos que a Epic 05 passa a "possuir"

Qualquer ocorrência posterior em outra Epic é `[R]` e leva
`Requires: Platform / <Story> / <Task>`.

| Conceito | Story dona | Revisitado em |
|---|---|---|
| Client-Server, HTTP (+ methods/status/headers/evolution), **TLS** (+ HTTPS sub), DNS, TCP/UDP, URL Anatomy, SOP, CORS, Cookies, Sessions, WebSocket, SSE | 01 Web Fundamentals | Epic 06 (Service Communication, Reverse Proxy); Epic 07 (Streaming → SSE); Epic 12/App Security (Encryption in Transit → TLS) |
| API, API Contract, REST, Resource Modeling & RESTful URLs, **Request Validation** (contrato/boundary), Response/Error Design, Pagination, Filtering & Sorting, **Idempotency Key**, **Rate Limiting**, API Versioning/Deprecation, OpenAPI, **Middleware / Request Pipeline** | 02 API Fundamentals | Epic 06 / Service Communication, Resilience Patterns; Epic 07 (rate limiting, tool APIs) |
| GraphQL Schema & Type System, Query/Mutation/Subscription, Resolver, **Batching & Per-Request Caching**, Query Complexity, GraphQL vs REST | 03 GraphQL | — |
| Relational Database, SQL, Table, Keys, Constraint, JOIN, Aggregate & GROUP BY, Subqueries & CTEs, Database Schema, Data Modeling, Relationship Cardinality, Normalization, Normal Forms, Denormalization, Natural vs Surrogate Key, Database Migration | 04–05 Database Fundamentals / Design | **Epic 04 / Enterprise & Application Patterns (`Requires` — formalizado)**; Epic 06 / Data Distribution |
| Transaction, **ACID**, **Consistency (ACID)**, Isolation, Isolation Levels, Read Phenomena, Optimistic/Pessimistic Locking | 06 Database Transactions | Epic 06 / Distributed Transactions, Distributed Consistency (colisão de nome — nota) |
| Index (+ Selectivity sub), Composite Index, Query Execution Plan, Query Optimization, **N+1 Query Problem**, Connection Pool, Slow Query Analysis | 07 Database Performance | 03 GraphQL (N+1 in Resolvers → revisita); Epic 06 (chatty I/O entre serviços) |
| SQL vs NoSQL, NoSQL Data Models, Schema-on-Read, Choosing SQL vs NoSQL | 08 NoSQL | Epic 06 / Data & Architecture Patterns |
| **Cache** e todos os padrões (Cache-Aside, Read/Write-Through, Write-Behind, Eviction, LRU, TTL, Invalidation, **In-Memory Data Store**, Browser & HTTP Cache, CDN) | 09 Caching | Epic 06 / Caching at Scale; Epic 07 / Production AI (Semantic Cache) |
| Auth vs Authz, Password Hashing, Session/Token auth, JWT, Access & Refresh Token, OAuth 2.0, OIDC, SSO, MFA | 10 Authentication | Epic 07 (auth de ferramentas/MCP) |
| RBAC, ABAC, Permission-Based Authorization, **Principle of Least Privilege**, Resource Ownership | 11 Authorization | 20 Cloud Security; Epic 07 / AI Safety (Least Privilege for Tools) |
| Threat Modeling, OWASP Top 10, SQLi, XSS, CSRF, SSRF, Broken Access Control, **Input Validation**, Output Encoding, CSP, Security Headers, Secrets Management, Encryption at Rest & in Transit, Dependency Vulnerabilities | 12 Application Security | Epic 07 / AI Safety (Prompt Injection ≈ injeção); Epic 06 |
| Observability vs Monitoring, Logging, Structured Logging, Correlation ID, Metrics (+ Dashboard sub), Distributed Tracing, Span, **OpenTelemetry**, Alerting | 13 Observability | Epic 07 / AI Observability; Epic 06 / Reliability |
| Performance vs Scalability, **Latency**, **Throughput**, **CPU-Bound vs I/O-Bound**, **Profiling**, Benchmarking, Bottleneck Analysis, Lazy vs Eager Loading, Debounce/Throttle, Compression | 14 Performance Engineering | Epic 06 / System Design Fundamentals ("em escala"); Epic 07 / Production AI (TTFT, Model Latency) |
| SLI, SLO, SLA, Error Budget, Incident, MTTD/MTTR, Incident Response, Postmortem (Blameless) | 15 Reliability Engineering | Epic 06 / Availability & Reliability |
| Container, Container vs VM, Docker, Docker Image (+ Dockerfile sub), Registry, Docker Volumes & Networks (+ Compose sub), Multi-Stage Build | 16 Containers | Epic 06; Epic 21 (K8s) |
| CI, CD (delivery/deployment), Pipeline, Build, Artifact, Deployment, Environments & Configuration, Feature Flags, Rollback, Deployment Strategies | 17 CI/CD | Epic 07 / Production AI (Evaluation in CI/CD) |
| Cloud Computing, Service Models, Region/AZ, Compute & VM, Cloud Storage Types, Managed Database, **Serverless (primitivo)** | 18 Cloud Fundamentals | Epic 06 / Architectural Styles (estilo serverless) |
| VPC, Subnet, CIDR & IP Address, Firewall & Security Group, NAT & Internet Gateway, DNS in Cloud | 19 Cloud Networking | Epic 06 / Service Communication |
| IAM, User vs Role, Policy, Service Account, Secret Manager, Shared Responsibility Model | 20 Cloud Security | Epic 07 / AI Safety |
| Kubernetes, Cluster & Node, Pod, Deployment & ReplicaSet, Service, Ingress, ConfigMap & Secret, HPA, Liveness & Readiness Probes | 21 Kubernetes Fundamentals | Epic 06 |

**`canonical: false` + `revisitOf` (4 Tasks):**

| Task | revisitOf |
|---|---|
| 03 GraphQL / N+1 in Resolvers | Platform / Database Performance / N+1 Query Problem |
| 18 Cloud Fundamentals / Load Balancer | Architecture / Scalability / Load Balancing |
| 18 Cloud Fundamentals / Auto Scaling | Architecture / Scalability / Auto Scaling |
| 20 Cloud Security / Least Privilege in Cloud | Platform / Authorization / Principle of Least Privilege |

**Não canônico aqui (primitivo / forward-ref):** `Load Balancing` / `Auto Scaling`
(conceito canônico → Epic 06 / Scalability), `Idempotency` (conceito de
resiliência → Epic 06 / Resilience Patterns), estilo `Serverless` (→ Epic 06 /
Architectural Styles).

### Revisitas que entram na Epic 05 (dos Epics 01–04, já aprovados)

| Conceito canônico | Onde é revisitado aqui |
|---|---|
| Epic 01 / Programming Fundamentals / Interface, Contract | 02 API Fundamentals / API Contract |
| Epic 01 / Memory & Runtime / GC, Memory Leak | 14 Performance Engineering / Profiling |
| Epic 01 / Data Structures / Hash Table, BST | 07 Database Performance / Index |
| Epic 01 / Algorithms & Complexity / Memoization | 09 Caching / Cache |
| Epic 01 / Asynchronous Programming / Promise, Event Loop, Callback | 01 Web Fundamentals / WebSocket, SSE |
| Epic 01 / Concurrency / Process, Thread | 16 Containers / Container, Container vs VM; 21 Kubernetes |
| Epic 01 / Concurrency / Race Condition, Deadlock | 06 Database Transactions / Optimistic & Pessimistic Locking |
| Epic 01 / Concurrency / Atomic Operation | 06 / ACID — **[≠]** colisão de nome com "Atomicity" (já anotada no Epic 01) |
| Epic 01 / Concurrency (recurso compartilhado limitado) | 07 Database Performance / Connection Pool |
| Epic 01 / Concurrency, Asynchronous Programming | 14 Performance Engineering / CPU-Bound vs I/O-Bound (pointer) |
| Epic 02 / Testing Fundamentals / Test Runner, Assertion | 17 CI/CD / Pipeline (stages de teste) |
| Epic 02 / Testing Strategy / Code Coverage, Test Isolation, Flaky Tests, Regression Testing | 17 CI/CD / Pipeline (gates) |
| Epic 02 / Testing Strategy / Contract Testing | 02 API Fundamentals / API Contract |
| Epic 02 / Debugging / Root Cause Analysis, Reproduction, Hypothesis-Driven Debugging | 15 Reliability Engineering / Incident Response, Postmortem; 14 / Profiling |
| Epic 03 / Dependency & Version Management / Semantic Versioning, Backward Compatibility, Deprecation | 02 API Fundamentals / API Versioning, API Deprecation |
| Epic 03 / Engineering Documentation / Runbook | 15 Reliability Engineering / Incident Response |
| Epic 03 / Error Handling / Result Pattern, Fail Fast | 02 API Fundamentals / Error Response Design |
| Epic 03 / Dependency & Version Management / Incremental Migration | 05 Database Design / Database Migration |
| Epic 03 / Git / Revert | 17 CI/CD / Rollback |
| Epic 04 / Enterprise Patterns / Unit of Work, Repository | 06 Database Transactions / Transaction (pointer) |
| Epic 04 / Domain Modeling / Aggregate | 08 NoSQL / NoSQL Data Models (documento ≈ aggregate) |
| Epic 04 / Domain Modeling / Entity | 05 Database Design / Data Modeling |
| Epic 04 / Behavioral Patterns / Chain of Responsibility *(SUGESTÃO)* | 02 API Fundamentals / Middleware / Request Pipeline |
| Epic 04 / Structural Patterns / Proxy | 09 Caching / CDN, HTTP Cache (pointer) |

---

## Dependências de alto nível

```
Epic 01 · Programming Foundations ──▶ Epic 05 (todas as Stories, baseline)
   Interface, Contract ──▶ API Fundamentals / API Contract
   Memoization ──▶ Caching / Cache
   Hash Table, BST ──▶ Database Performance / Index
   Process, Thread ──▶ Containers, Kubernetes
   Race Condition, Deadlock ──▶ Database Transactions / Locking
   Concurrency, Async ──▶ Performance Engineering / CPU-Bound vs I/O-Bound

Epic 02 · Testing & Quality Engineering / Contract Testing ──▶ API Fundamentals / API Contract
Epic 02 / Testing (Runner, Coverage, Isolation, Flaky, Regression) ──▶ CI/CD / Pipeline
Epic 02 / Debugging (RCA, Reproduction) ──▶ Reliability Engineering / Incident Response

Epic 03 · Software Craft / SemVer, Backward Compatibility, Deprecation ──▶ API Fundamentals / Versioning, Deprecation
Epic 03 / Runbook ──▶ Reliability Engineering / Incident Response
Epic 03 / Incremental Migration ──▶ Database Design / Database Migration
Epic 03 / Git / Revert ──▶ CI/CD / Rollback

Epic 04 · Software Design / Enterprise & Application Patterns ⟵ Requires ── Platform / Database Fundamentals   (formalizado 2026-09-05)
Epic 04 / Chain of Responsibility (SUGESTÃO) ──▶ API Fundamentals / Middleware / Request Pipeline

Platform Engineering ──▶ Epic 06 · Architecture & System Design (Epic inteiro)
Platform / Caching ──▶ Epic 06 / Caching at Scale
Platform / API Fundamentals / Rate Limiting, Idempotency Key ──▶ Epic 06 / Resilience Patterns   (revisita)
Platform / Database Performance / N+1 Query Problem ──▶ Platform / GraphQL / N+1 in Resolvers   (revisita intra-Epic)
Platform / Cloud Fundamentals / Load Balancer, Auto Scaling ──▶ Epic 06 / Scalability   (revisitOf — forward-ref, acíclico)
Platform / Observability ──▶ Epic 07 · AI Engineering / AI Observability
Platform / Performance Engineering ──▶ Epic 07 / Production AI

SEM ciclo: nenhuma Task do Epic 05 tem Requires para o Epic 04 (as ocorrências
de Epic 04 aqui são pointers, não Requires) — formalizar Epic 04 / Enterprise
Patterns ── Requires ──▶ Platform / Database Fundamentals não cria ciclo.
```

---

## Colisões de nome a desambiguar

| A | B | Distinção |
|---|---|---|
| `Consistency` (ACID — Story 06) | `Distributed Consistency` / `Eventual Consistency` (Epic 06) | garantia dentro de 1 transação × acordo entre réplicas — sentidos diferentes |
| `Atomic Operation` (Epic 01 / Concurrency) | `Atomicity` (Story 06 / ACID) | operação indivisível de CPU/memória × propriedade "tudo ou nada" da transação |
| `Idempotency Key` (Story 02, mecânica HTTP) | `Idempotency` (Epic 06 / Resilience Patterns, conceito) | chave para retry seguro de request × propriedade de operação em sistema distribuído |
| `N+1 in Resolvers` (Story 03) | `N+1 Query Problem` (Story 07, canônico) | manifestação GraphQL × conceito canônico (I/O por item × lote) |
| `Request Validation` (Story 02, contrato/boundary) | `Input Validation` (Story 12, segurança) | validar o shape do contrato de API × defender contra entrada maliciosa — conceitos distintos, ligados por pointer |
| `Rate Limiting` (Story 02, canônico) | Epic 06 / Resilience Patterns; Epic 07 | proteção de tráfego de API × padrão de resiliência × controle de custo de LLM |
| `Session` (Story 01, estado HTTP) | `Session-Based Authentication` (Story 10) | mecanismo de estado no servidor × uso desse mecanismo para identidade |
| `Integration Testing` (Epic 02) | `Continuous Integration` (Story 17) | teste multi-componente × prática de integrar código com frequência |
| `Schema` | `Database Schema` (04) · `Schema-on-Read` (08) · `GraphQL Schema` (03) · `JSON Schema` (Epic 07) | quatro coisas diferentes — cada Task deixa claro o escopo |
| `Secret` / `Secrets` | `Secrets Management` prática (12) · `Secret Manager` serviço (20) · K8s `Secret` recurso (21) · `Environments & Configuration` (17) | prática × serviço gerenciado × objeto do K8s (base64) × mecanismo de config |
| `Policy` | IAM `Policy` (20) · política `ABAC` (11) | documento de permissão de cloud × regra de autorização de aplicação |
| `Service` | K8s `Service` (21) · `Service Layer`/`Domain Service` (Epic 04) · `Service Account` (20) | objeto de rede do K8s × camada de aplicação × identidade de workload |
| `Load Balancer` (Story 18, primitivo) | `Load Balancing` (Epic 06 / Scalability, conceito) | recurso de cloud × conceito de distribuição de carga |
| `Artifact` (Story 17, build) | `Docker Image` (16) · `Artifact` do Jira (interno) | pacote de deploy versionado × imagem de container × item de rastreamento |
| `Firewall` / `Security Group` (Story 19) | `Application Security` (Story 12) | controle de rede (L3/L4) × controles na camada de aplicação (L7) |
| `TTL` (cache — Story 09) | `TTL` de DNS (Story 01) · TTL de pacote IP | expiração de item de cache × expiração de registro DNS × hop limit |
| `Probe` (liveness/readiness — Story 21) | health check (Epic 06 / Availability) | mecanismo do K8s × conceito arquitetural |

---

## Consolidações e subtopics

### As 46 consolidações auditadas (aprovadas em bloco)

**Tipo A — umbrella "X / Y / Z" (23):** HTTP Evolution (1.1/2/3) · TCP vs UDP ·
Pagination (Offset/Cursor) · Relationship Cardinality (1:1/1:N/N:M) · Normal
Forms (1NF/2NF/3NF) · Read Phenomena (Dirty/Non-Repeatable/Phantom) · ACID
(A/C/D) · NoSQL Data Models (KV/Doc/Wide-Column/Graph) · Deployment Strategies
(Rolling/Blue-Green/Canary) · Cloud Service Models (IaaS/PaaS/SaaS) · Distributed
Tracing (Span/trace context) · Cache Eviction (LRU/LFU/FIFO) · GraphQL Schema &
Type System · Query/Mutation/Subscription · Resource Modeling & RESTful URLs ·
Filtering & Sorting · JOIN · Aggregate Functions & GROUP BY · Read-Through/
Write-Through/Write-Behind · Slow Query Analysis · Deployment & ReplicaSet ·
Cluster & Node · Liveness & Readiness Probes.

**Tipo B — par fundido 2→1 (17):** Cache Hit/Miss *(→ rebaixada a subtopic de
Cache, §D)* · Browser & HTTP Cache · Access & Refresh Token · Encryption at Rest
& in Transit · Lazy vs Eager Loading · Debounce/Throttle · MTTD/MTTR · Postmortem
(Blameless) · Docker Volumes & Networks · Region & AZ · Compute & VM · Cloud
Storage Types · Subnet (Public vs Private) · CIDR & IP Address · Firewall &
Security Group · NAT & Internet Gateway · ConfigMap & Secret.

**Tipo C — absorção (6):** `Monitoring` → Observability vs Monitoring · `Docker
Container` → Container · `LRU` → Cache Eviction · `Nullability` → GraphQL Schema
& Type System · `Performance Budget` → removida (SUGESTÃO) · `Atomicity`/
`Consistency`/`Durability` → ACID (`Consistency (ACID)` = subtopic nomeado).

### Rebaixamentos §C/§D além das 46 (9)

`Request & Response` → sub de `HTTP` · `HTTPS` → sub de `TLS` *(TLS permanece
Task — decisão 4, exceção)* · `CTE` → `Subqueries & CTEs` · `Index Selectivity` →
sub de `Index` · `Cache Hit / Miss` → sub de `Cache` · `Dashboard` → sub de
`Metrics` · `Environment` + `Environment Variables` → `Environments &
Configuration` · `Dockerfile` → sub de `Docker Image` · `Docker Compose` → sub de
`Docker Volumes & Networks`.

### Renomeações vendor-agnostic (2)

`Redis` → **`In-Memory Data Store`** (sub/exemplos: Redis, Valkey, Memcached) ·
`DataLoader` → **`Batching & Per-Request Caching`** (sub/exemplo: DataLoader).
A ferramenta fica só como exemplo/subtopic, fora do nome oficial da Task.

### Exceção explícita

- **`TLS` permanece Task própria** em Web Fundamentals.
- **`HTTPS` = aplicação/composição de HTTP + TLS** → subtopic de `TLS`.

---

## Decisões aprovadas (Fase 2 · Epic 05)

1. **Tamanho** — direção final ~180–182 Tasks; **sem meta artificial de redução**;
   manter uma Task sempre que for unidade conceitual própria de uma Senior SWE.
   Resultado do merge: **187 Tasks** (as decisões 1, 2 e 5 impedem os cortes que
   levariam a ~182).
2. **Consolidações** — aprovadas as **46** consolidações auditadas, sem perda de
   conceito independente, nenhuma feita só para diminuir contagem.
3. **Tool-specific** — `Redis` e `DataLoader` reenquadrados como conceito/
   estratégia vendor-agnostic (ferramenta = exemplo/subtopic); `Docker Compose` →
   subtopic; `Dockerfile` → absorvido em `Docker Image`. `OpenTelemetry`, `JWT`,
   `OAuth 2.0`, `OIDC` permanecem Tasks (são standards, não ferramentas).
4. **Subtopics** — rebaixados os itens que são só detalhe/exemplo (§D). **EXCEÇÃO:**
   `TLS` permanece Task própria; `HTTPS` = composição de HTTP + TLS.
5. **Duplicidades** — `N+1 Query Problem` canônico em `Platform / Database
   Performance`; GraphQL revisita (não cria 2ª canônica). `Request Validation` ×
   `Input Validation` **não** são consolidados — conceitos distintos: `Input
   Validation` canônico em Application Security (segurança); `Request Validation`
   canônico em API Fundamentals (contrato/boundary), com pointer [R].
6. **Requires** — removidos ~30 `Requires` de mera sequência didática; **ORDER ≠
   REQUIRES**; corrigidos os 4 invertidos (`TLS`, `Build`, `Environments &
   Configuration`, `CIDR & IP Address`).
7. **Stories** — mantidas as 21 Stories da macro; NoSQL não funde em Database
   Design; GraphQL não funde em API Fundamentals; Story pequena é aceitável.
8. **Canonical ownership** — `Idempotency Key` → Platform / API Fundamentals;
   `Idempotency` genérico → permanece Epic 06 / Resilience Patterns. `Rate
   Limiting` → Platform / API Fundamentals; Epic 06 revisita (**mudança não
   silenciosa da Fase 1**). `N+1 Query Problem` → Platform / Database Performance.
   `Load Balancing` / `Auto Scaling` → permanecem canônicos Epic 06 / Scalability;
   ocorrência em Cloud é revisita/aplicação (recurso de cloud **não** vira nova
   casa canônica). `Serverless` → primitivo canônico Platform / Cloud Fundamentals.
9. **CPU-Bound vs I/O-Bound** — **não** é lacuna do Epic 01; casa canônica =
   Platform / Performance Engineering (macro da Fase 1).
10. **Pendências herdadas** — `Middleware / Request Pipeline` canônico em Platform;
    `Chain of Responsibility` segue SUGESTÃO Advanced/Optional em Software Design;
    `Dependency Vulnerabilities` permanece em Platform / Application Security;
    `Cloud Networking` e `Cloud Security` seguem Stories separadas; formalizada a
    dependência `Epic 04 / Enterprise & Application Patterns` → `Requires: Platform
    / Database Fundamentals` (grafo acíclico).

### Correções pós-aprovação estrutural (2026-09-05 — não alteram contagem)

1. `API Fundamentals / Request Validation` → `canonical: true` (contrato/boundary),
   pointer [R] para `Application Security / Input Validation`, **não** `revisitOf`.
   Tabela `canonical: false` + `revisitOf` passa de 5 → **4**.
2. `Reliability Engineering`: `Incident` movida para #05 (antes de `MTTD / MTTR`,
   que tem `Requires: Incident`).
3. `Auto Scaling`: `Requires: Load Balancer` removido → `Requires: Compute &
   Virtual Machine` (igual a `Load Balancer`). Ambas seguem `revisitOf` de
   `Architecture / Scalability`.
4. Nome oficial das Tasks sem ferramenta: `In-Memory Data Store (Redis)` →
   `In-Memory Data Store`; `Batching & Per-Request Caching (DataLoader)` →
   `Batching & Per-Request Caching`.

---

## Mudanças não silenciosas

### vs Fase 1 (macro aprovada)

| # | Mudança | Fase 1 dizia | Agora |
|---|---|---|---|
| NS-1 | **`Rate Limiting`** canônico | Architecture / Resilience Patterns | **Platform / API Fundamentals** (Epic 06 e Epic 07 revisitam) |
| NS-2 | **`Idempotency Key`** (mecânica HTTP) canônico | "Canônico Architecture/Resilience; Platform/API referencia" | **Platform / API Fundamentals** possui a mecânica; `Idempotency` (resiliência) permanece canônico Epic 06 / Resilience Patterns |
| NS-3 | **`Middleware / Request Pipeline`** | não existia na macro | **Task nova canônica** em API Fundamentals (ancora o `Chain of Responsibility` parkado pelo Epic 04) |
| NS-4 | **`Profiling`** ganha lar canônico | sem lar canônico definido | **canônico Platform / Performance Engineering** |
| NS-5 | **Epic 04 / Enterprise & Application Patterns** | "`Requires: Platform / Database Fundamentals` — pendente, sem `Requires` formal" | **formalizado** (`Database Fundamentals` confirmada como Story 04; grafo acíclico) |

> `Serverless` (primitivo canônico Platform) e `Load Balancing`/`Auto Scaling`
> (canônico Epic 06, Cloud = revisita) **alinham com a Fase 1** — não são mudança.

### vs a proposta recuperada (as 8 Decisões dela)

| # | Item | Proposta recuperada | Agora | Motivo |
|---|---|---|---|---|
| DA-1 | Nº de consolidações | "12" | **46** (Tipo A 23 + B 17 + C 6) | Auditoria §B + Decisão 2 |
| DA-2 | `N+1` — casa canônica | Decisão 4c: canônico em `Platform / GraphQL` | **`Platform / Database Performance`** (= Fase 1); GraphQL revisita | Decisão 8 |
| DA-3 | `Load Balancer` / `Auto Scaling` | Decisão 4d/4e + auditoria §H recomendava opção A (canônico Platform) | opção **B**: `revisitOf` Epic 06, **não** vira casa canônica em Cloud | Decisão 8 |
| DA-4 | `Dependency Vulnerabilities` | Decisão 6: realocar para Epic 03 | **permanece em Platform / Application Security** (Story 12 = 14 Tasks) | D6 alterada / Decisão 10 |
| DA-5 | `Request Validation` | auditoria §E: rebaixar a subtopic de `Input Validation` | **Task `canonical: true`** — conceito distinto (contrato/boundary), pointer [R] (não `revisitOf`) | Decisão 5 + Correção 1 |
| DA-6 | Recorte / tamanho | opção de split Core/Advanced ou trimming agressivo | 21 Stories, 187 Tasks, sem split, sem redução artificial | Decisão 1 |
| DA-7 | Alvo de contagem | auditoria §I estimava ~182 | **187** | Decisões 1 + 2 + 5 |

---

## Sugestões novas (fora da estrutura oficial — não incorporadas)

| Sugestão | Onde entraria | Novo ou revisita? |
|---|---|---|
| Story `Infrastructure as Code` (Terraform/Pulumi, state, drift, plan/apply, módulos) | nova Story após CI/CD | Novo (já sugerida na Fase 1) |
| Story `Non-Functional Testing` (load/stress/soak/spike, DAST, chaos) | Epic 02 **ou** aqui | Novo (já era SUGESTÃO no Epic 02) |
| GraphQL: `Arguments`, `Variables`, `Fragments`, `Interfaces`, `Unions`, `Persisted Queries`, `Error Handling` | Story 03 | Novo (retirado no trimming) |
| Kubernetes: `Namespace`, `DaemonSet`, `StatefulSet`, `Job/CronJob`, `PersistentVolume`, `Helm` | Story 21 | Novo (caminho "Advanced") |
| `Performance Budget` | Story 14 | Novo (rebaixado a subtopic) |
| `B-Tree` como Task própria | Story 07 | Novo (absorvido como nota em `Index`) |
| `WebAuthn` / `Passkeys` | Story 10 | Novo (hoje só menção em MFA) |
| `gRPC` / `Protocol Buffers` | Story 02 ou 03 | Novo — **colide com Epic 06** (Service Communication) |
| `Message Queue` / `Pub/Sub` (fundamentos) | nova Story ou API | Novo — **colide com Epic 06** (Messaging) |
| `Reverse Proxy` / `API Gateway` (fundamentos) | Web Fundamentals ou API | Novo — **colide com Epic 06** (Service Communication) |
| `Load Shedding` / `Backpressure` | Story 02 ou Epic 06 | "3ª via" de Rate Limiting — não adotada; Rate Limiting é a canônica, Load Shedding fica Epic 06 |
| Promover `Chain of Responsibility` a Task no Epic 04 | Epic 04 / Behavioral Patterns | Revisita da ressalva — **fica SUGESTÃO Advanced/Optional** no Epic 04 |

### Trims opcionais para ~184 (NÃO aplicados)

| Trim | Δ | Custo |
|---|---|---|
| `HTTP Methods` + `HTTP Status Codes` + `HTTP Headers` → `HTTP Semantics` | −2 | funde 3 unidades que um sênior estuda separadamente |
| `Build` + `Artifact` → `Build & Artifact` | −1 | funde produção × pacote imutável promovido |

`Request Validation` e `N+1 in Resolvers` não podem ser cortadas sem contradizer a Decisão 5.

---

## Auditoria de ciclos

- **Grafo de `Requires` de Story:** DAG. Raízes `Web Fundamentals`, `Database
  Fundamentals`, `Observability`, `Containers`. Ordem topológica = numeração
  01→21. **Sem ciclo.**
- **Grafo de `Requires` de Task:** após §F + Correções 2 e 3, toda aresta aponta
  para Task anterior na ordem da própria Story (ou de uma Story-pré-requisito).
  Correção 2 elimina o último forward-`Requires` (`MTTD / MTTR → Incident`).
  Correção 3 remove a aresta `Auto Scaling → Load Balancer`. **Sem ciclo.**
- **Cross-epic:** Epic 05 `Requires` só Epic 01 (baseline). **Nenhuma Task do
  Epic 05 tem `Requires: Epic 04 / …`** (as ocorrências são pointers) → formalizar
  `Epic 04 / Enterprise & Application Patterns Requires: Platform / Database
  Fundamentals` **não cria ciclo**. Pointers [R] e `revisitOf` não são arestas de
  `Requires`. Forward-refs para Epic 06 são acíclicos (Epic 06 depende do 05,
  nunca o contrário). **Grafo final acíclico.**

---

## Próximo passo

**Aprovação final (FROZEN) registrada em 2026-09-05.** Nesta rodada de
consolidação:
- `roadmap/05-platform-engineering.md` criado (este arquivo);
- `roadmap/00-overview.md` atualizado (seção `05 · Platform Engineering`, tabela
  de progresso da Fase 2, dependências de alto nível, conceitos transversais,
  "Próximo passo — Fase 3" para os Epics 01–05, arquivos originais);
- `PLAN.md` atualizado (Histórico, §1.2, §3, tabela de Fases §6);
- `data/roadmap.js` atualizado — Epic 05 passa de `status: "structuring"` para
  navegável, com as 21 Stories e 187 Tasks; Epic 04 / `Enterprise & Application
  Patterns` recebe `Requires: Platform / Database Fundamentals` formal;
- `roadmap/04-software-design.md` atualizado (nota da Story 08 e diagrama de
  dependências — a pendência da Decisão 6 do Epic 04 é resolvida).

A Fase 2 do **Epic 06 · Architecture & System Design** continua **não iniciada**
— passo futuro separado, com sua própria rodada de aprovação. Nenhum commit foi
feito ainda; esta consolidação aguarda revisão visual/estrutural antes de commitar.
