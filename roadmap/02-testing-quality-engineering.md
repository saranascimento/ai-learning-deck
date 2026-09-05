# Epic 02 · Testing & Quality Engineering — detalhamento de Tasks (Fase 2)

> **Estado: revisão final aguardando aprovação.** Não avançar para o Epic 03.
> Incorpora as decisões aprovadas em 2026-09-03 (ver fim do arquivo) e uma revisão
> completa dos `Requires` — **ordem de estudo ≠ dependência conceitual**.
>
> Base: Stories `Testing` (17 Tasks) e `Debugging` (7 Tasks) do arquivo original
> `software-craft.md`, promovidas a Epic próprio na Fase 1.

### Contabilidade de Tasks

- **24 Tasks originais preservadas** (17 `Testing` + 7 `Debugging`). 0 removidas, 0 renomeadas.
- **+7 Tasks novas aprovadas**: `Assertion`, `Test Fixture`, `Test Runner`
  (vocabulário fundamental) · `Dummy` (completa a taxonomia de dublês) ·
  `Red-Green-Refactor` · `Code Coverage` · `Property-Based Testing`.
- **Consolidação cross-Epic confirmada**: `Git Bisect` é **canônico aqui**; no
  Epic 03 / Story `Git` vira revisita/referência (não altera a contagem do Epic 02).
- Total Epic 02: **5 Stories, 31 Tasks**.

Legenda:
`Requires:` **dependência conceitual real** — "não dá para entender B sem antes
entender A" (sem prefixo = mesma Epic; com prefixo = outra Epic/Story) ·
**[C]** conceito canônico · **[R]** revisitado depois (onde) ·
**[≠]** colisão de nome a desambiguar · `SUGESTÃO` Task nova, não incluir sem aprovação.

> **Ordem de estudo ≠ `Requires`.** A numeração das Tasks é a sequência recomendada de
> estudo (progressão de complexidade, agrupamento temático). Ela só vira `Requires`
> quando há dependência conceitual genuína. Ex.: `Dummy`, `Stub`, `Fake`, `Spy` e
> `Mock` são estudados nessa ordem, mas **todos dependem apenas de `Test Doubles`** —
> nenhum depende do anterior.

---

## Stories da Epic (ordem de estudo)

```
01 · Testing Fundamentals     8 Tasks
02 · Test Doubles             6 Tasks
03 · Test-Driven Development  2 Tasks
04 · Testing Strategy         8 Tasks
05 · Debugging                7 Tasks
```

A ordem 01→05 é **recomendação de estudo**, não cadeia de `Requires`:
fundamentos (escrever *um* teste) → dublês (isolar a unidade) → TDD (disciplina que
usa os dois e dirige o design) → estratégia (onde investir esforço) → debugging (o que
se faz quando um teste falha ou um bug escapa).

**Dependências reais entre Stories**: `Test Doubles` `Requires` `Testing Fundamentals`;
`TDD` `Requires` `Testing Fundamentals`; `Testing Strategy` `Requires` `Testing
Fundamentals` + `Test Doubles`; `Debugging` `Requires` `Testing Fundamentals`.
`TDD` **não** é `Requires` de `Testing Strategy` nem de `Debugging`.

> **Sem dependência circular.** `Refactoring` (Epic 03) `Requires` este Epic (Fase 1).
> A única referência para a frente é `Git Bisect` → `Epic 03 / Git` (aceita — Git não
> depende de nada do Epic 02). `TDD` **não** tem `Requires` para `Epic 03 / Refactoring`.

---

## Story 01 · Testing Fundamentals

`Requires` (Story): Programming Foundations / Programming Fundamentals.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Unit Testing | PF / Programming Fundamentals | **[C]** a menor unidade verificável. **[R]** PF / Functional Programming / Pure Functions — função pura = alvo trivial; AI Engineering / AI Evaluation (offline eval ≈ teste) |
| 02 | Assertion | — | **[C]** *(nova)* a verificação atômica: valor real × esperado; base de pass/fail. **[≠]** ≠ `assert`/invariante em runtime (relacionado a PF / Contract) — a asserção de teste roda *no teste* |
| 03 | Arrange-Act-Assert | Unit Testing, Assertion | **[C]** a estrutura de 3 fases de um teste |
| 04 | Given-When-Then | Unit Testing, Assertion | **[C]** a **mesma** estrutura de 3 fases, na fraseologia BDD — ensinar como irmã de AAA (não depende de AAA) |
| 05 | Test Fixture | Unit Testing | **[C]** *(nova)* o estado/dado base fixo sobre o qual um teste roda |
| 06 | Test Runner | Unit Testing, Assertion | **[C]** *(nova)* a ferramenta que descobre, executa e reporta testes (pass/fail) |
| 07 | Integration Testing | Unit Testing | **[C]** testar unidades em conjunto — "integração" pressupõe "unidades". **[≠]** ≠ `Continuous Integration` (Platform / CI-CD) |
| 08 | E2E Testing | Integration Testing | **[C]** o caso máximo de integração — sistema inteiro, ótica do usuário |

**Racional (ordem de estudo)**: o conceito e o porquê (Unit) → o primitivo em que se
apoia (Assertion) → como um teste é estruturado (AAA e sua irmã GWT) → a maquinaria de
apoio (Fixture, Runner) → escopo crescente (Integration → E2E).

`SUGESTÃO`: `Test Case`, `Test Suite`, `Setup / Teardown` (mecânica do Fixture),
`Parameterized Tests`, `Snapshot Testing` *(permanece SUGESTÃO)*,
`Code Coverage` já foi promovida — está na Story 04.

---

## Story 02 · Test Doubles

`Requires` (Story): Testing Fundamentals; Programming Foundations / Programming
Fundamentals / Interface (o dublê substitui numa fronteira/seam).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Test Doubles | Testing Fundamentals / Unit Testing, PF / Programming Fundamentals / Interface | **[C]** termo guarda-chuva (taxonomia de Meszaros). **[≠]** nome da Story = nome desta Task — esta é a Task do conceito-guarda-chuva |
| 02 | Dummy | Test Doubles | **[C]** *(nova)* objeto passado mas nunca usado — só preenche uma assinatura |
| 03 | Stub | Test Doubles | **[C]** respostas prontas, sem verificação |
| 04 | Fake | Test Doubles | **[C]** implementação real porém simplificada (ex.: repositório em memória). **[≠]** ≠ `Fake Model` (AI Engineering / deck `harness`) — mesmo padrão, outro domínio |
| 05 | Spy | Test Doubles | **[C]** registra chamadas para asserção posterior |
| 06 | Mock | Test Doubles | **[C]** pré-programado com expectativas; **verifica interação**. Conceitualmente próximo de Spy (registra + verifica) — *relação*, não `Requires`. **[≠]** "mock" coloquial = qualquer dublê; aqui é o sentido preciso |

**Racional (ordem de estudo)**: guarda-chuva → do mais inerte ao mais acoplado ao
teste: dummy (não faz nada) → stub (responde) → fake (implementa) → spy (observa) →
mock (exige). **Todos dependem só de `Test Doubles`** — a progressão é de complexidade,
não de pré-requisito.

`SUGESTÃO`: `Seam`, `Mocking Framework`, `Over-Mocking / Mock Hell`,
`Classicist vs Mockist (Chicago vs London)`.

---

## Story 03 · Test-Driven Development

`Requires` (Story): Testing Fundamentals.
*(Test Doubles é usado na prática de TDD com colaboradores, mas não é pré-requisito do
conceito — TDD clássico começa sem dublês.)*

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Test-Driven Development | Testing Fundamentals / Arrange-Act-Assert | **[C]** disciplina test-first; por que TDD dirige o design; benefícios e custos |
| 02 | Red-Green-Refactor | Test-Driven Development | **[C]** *(nova)* o loop concreto: teste mínimo que falha → código mínimo que passa → melhorar com a barra verde. **Passo "Refactor"**: aprofundamento posterior em `Epic 03 / Software Craft / Refactoring` — *pointer, não `Requires`* |

**Racional (ordem de estudo)**: a filosofia/disciplina (o "quê" e o "porquê") → o loop
operacional (o "como").

`SUGESTÃO`: `Behavior-Driven Development (BDD)` *(permanece SUGESTÃO por ora)*,
`Test-First vs Test-After`, `Baby Steps`, `Triangulation`,
`Fake It Till You Make It`, `Outside-In vs Inside-Out TDD`,
`Test-Induced Design Damage`.

---

## Story 04 · Testing Strategy

`Requires` (Story): Testing Fundamentals, Test Doubles.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Test Pyramid | Testing Fundamentals / Integration Testing, Testing Fundamentals / E2E Testing | **[C]** como distribuir tipos de teste (unit ≫ integration ≫ e2e) — as camadas *são* esses tipos |
| 02 | Code Coverage | Testing Fundamentals / Unit Testing, Testing Fundamentals / Test Runner | **[C]** *(nova)* % de código exercitado pelos testes; subtópicos: line / statement / branch / path coverage. Cuidado com "coverage as a target" (Goodhart) |
| 03 | Testability | Test Doubles, PF / Programming Fundamentals / Coupling | **[C]** propriedades do código que permitem testá-lo (seams, injeção de dependência, poucos colaboradores). **[R]** PF / Functional Programming / Pure Functions (o caso ideal); Software Design / Dependency Injection & IoC — DI é *aplicação* da testabilidade |
| 04 | Test Isolation | Testing Fundamentals / Test Fixture, PF / Concurrency / Shared State | **[C]** testes não dependem uns dos outros nem de estado compartilhado; ordem-agnósticos |
| 05 | Flaky Tests | Test Isolation, PF / Concurrency / Race Condition | **[C]** testes não determinísticos: corrida, tempo, ordem, rede |
| 06 | Regression Testing | Testing Fundamentals / Unit Testing, Testing Fundamentals / Test Runner | **[C]** re-executar testes para impedir que bugs corrigidos voltem. **[R]** AI Engineering / Regression Evaluation — análogo para modelos, escopo diferente |
| 07 | Property-Based Testing | Testing Fundamentals / Unit Testing, PF / Programming Fundamentals / Contract | **[C]** *(nova)* gerar muitas entradas a partir de propriedades/invariantes, em vez de exemplos. **[R]** PF / Functional Programming / Pure Functions (onde funciona melhor) |
| 08 | Contract Testing | PF / Programming Fundamentals / Contract, Testing Fundamentals / Integration Testing | **[C]** provedor e consumidor concordam numa interface. **[R]** Platform / API ("API Contract"); Architecture / Service Communication (consumer-driven contracts) |

**Racional (ordem de estudo)**: o enquadramento estratégico (pyramid) → a métrica de
quanto se testa (coverage) → o que torna o código testável (testability) → isolar
testes (isolation) → o que acontece quando o isolamento falha (flaky) → impedir
regressões (regression) → ir além de exemplos (property-based) → contratos entre
serviços (contract testing — o mais avançado, ponte para Platform/Architecture).
Nenhuma dessas Tasks é `Requires` da anterior, exceto `Flaky Tests` ← `Test Isolation`.

`SUGESTÃO`: `Testing Trophy` (contraponto à Pyramid), `Test Smells`,
`Mutation Testing` *(permanece SUGESTÃO)*, `Test Data Builders`,
`CI Test Gates` (ponte para Platform / CI-CD), `Non-Functional Testing`
*(já é SUGESTÃO de Story na Fase 1)*.

---

## Story 05 · Debugging

`Requires` (Story): Testing Fundamentals; Programming Foundations / Memory & Runtime /
Call Stack; Programming Foundations / Algorithms & Complexity / Binary Search.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Reproduction | Testing Fundamentals / Unit Testing | **[C]** tornar o bug confiável antes de investigar — um teste que falha é a repro ideal |
| 02 | Hypothesis-Driven Debugging | Reproduction | **[C]** método científico: hipótese → previsão → teste (precisa de algo reprodutível para testar hipóteses) |
| 03 | Stack Trace | PF / Memory & Runtime / Call Stack | **[C]** ler a pilha de chamadas no ponto da falha — é uma renderização do call stack. **[≠]** ≠ `Call Stack` (conceito, Epic 01) e ≠ `Stack` ADT (Epic 01) |
| 04 | Breakpoints | PF / Memory & Runtime / Call Stack | **[C]** pausar a execução para inspecionar estado/frames. Complementa `Stack Trace` (ferramenta deliberada × artefato gratuito do runtime) |
| 05 | Binary Search Debugging | PF / Algorithms & Complexity / Binary Search, Hypothesis-Driven Debugging | **[C]** bisseccionar o espaço de código/entrada para localizar — cada passo é um teste de hipótese |
| 06 | Git Bisect | Binary Search Debugging, Software Craft / Git *(forward-reference aceita)* | **[C]** busca binária **automatizada** sobre o histórico de commits. **Canônico aqui** — `Bisect` no Epic 03 / Git é revisita/referência |
| 07 | Root Cause Analysis | Hypothesis-Driven Debugging | **[C]** ir além do sintoma; 5 Whys — teste de hipótese iterativo. **[R]** Platform / Reliability Engineering — Postmortem, Blameless Postmortem, MTTD/MTTR |

**Racional (ordem de estudo)**: reproduzir de forma confiável → método (hipótese) →
ler o artefato gratuito do runtime (stack trace) → parar a execução deliberadamente
(breakpoints) → técnicas de localização (binary search → git bisect) → não parar no
sintoma (RCA, ponte para Reliability Engineering). `Stack Trace` e `Breakpoints` não
dependem de `Reproduction` — a ordem é temática.

`SUGESTÃO`: `Logging for Debugging` / `printf Debugging`, `Rubber Duck Debugging`,
`Debugger (a ferramenta)`, `Conditional Breakpoints`, `Watch Expressions`,
`git blame`, `Heisenbug`, `Core Dump`, `Delta Debugging`,
`Time-Travel Debugging`, `Observability-Driven Debugging` *(ponte para Platform)*.

---

## Conceitos canônicos que a Epic 02 passa a "possuir"

Ocorrência posterior em outra Epic é `[R]` e leva `Requires: Testing & Quality
Engineering / <Story> / <Task>`.

| Conceito | Story dona | Revisitado em |
|---|---|---|
| Unit / Integration / E2E Testing | 01 Testing Fundamentals | AI Engineering / AI Evaluation (offline eval); Platform (contract/API tests) |
| Assertion, Test Fixture, Test Runner | 01 Testing Fundamentals | Platform / CI-CD (test runner em pipeline) |
| Arrange-Act-Assert, Given-When-Then | 01 Testing Fundamentals | — |
| Test Doubles · Dummy / Stub / Fake / Spy / Mock | 02 Test Doubles | AI Engineering / AI Evaluation (mocking de LLM); deck `harness` ("Fake Model") |
| Test-Driven Development, Red-Green-Refactor | 03 TDD | Software Craft / Refactoring (passo "refactor" — pointer, não `Requires`) |
| Test Pyramid | 04 Testing Strategy | — |
| Code Coverage | 04 Testing Strategy | Platform / CI-CD (coverage gates); Software Craft / Code Review |
| Testability | 04 Testing Strategy | Software Design / Dependency Injection & IoC; Software Design / SOLID (DIP) |
| Test Isolation, Flaky Tests | 04 Testing Strategy | Platform / CI-CD; Architecture (testes de sistemas distribuídos) |
| Regression Testing | 04 Testing Strategy | AI Engineering / Regression Evaluation; Platform / CI-CD |
| Property-Based Testing | 04 Testing Strategy | — |
| Contract Testing | 04 Testing Strategy | Platform / API ("API Contract"); Architecture / Service Communication |
| Reproduction, Hypothesis-Driven Debugging | 05 Debugging | Platform / Reliability Engineering (Incident Response) |
| Stack Trace, Breakpoints | 05 Debugging | — |
| Binary Search Debugging, Git Bisect | 05 Debugging | Software Craft / Git (`Bisect` → referência a esta Task) |
| Root Cause Analysis | 05 Debugging | Platform / Reliability Engineering (Postmortem, Blameless Postmortem) |

### Revisitas que entram na Epic 02 (do Epic 01, já aprovado)

| Conceito canônico (Epic 01) | Onde é revisitado aqui |
|---|---|
| Programming Fundamentals / Interface, Contract | Test Doubles; Contract Testing; Property-Based Testing (Contract) |
| Programming Fundamentals / Coupling | Testability |
| Functional Programming / Pure Functions | Unit Testing; Testability; Property-Based Testing |
| Memory & Runtime / Call Stack | Stack Trace; Breakpoints |
| Algorithms & Complexity / Binary Search | Binary Search Debugging; Git Bisect |
| Concurrency / Shared State | Test Isolation |
| Concurrency / Race Condition | Flaky Tests |

---

## Dependências de alto nível

```
Epic 01 · Programming Foundations ──▶ Epic 02 (inteiro)
   Interface / Contract ──▶ Test Doubles, Contract Testing
   Coupling ──▶ Testability
   Pure Functions ──▶ Unit Testing, Property-Based Testing   (revisita)
   Call Stack ──▶ Stack Trace, Breakpoints
   Binary Search ──▶ Binary Search Debugging, Git Bisect
   Shared State / Race Condition ──▶ Test Isolation, Flaky Tests

Epic 02 ──▶ Epic 03 / Software Craft / Refactoring          (Refactoring Requires Testing — Fase 1)
Epic 02 / Debugging / Git Bisect ──▶ Requires ── Epic 03 / Software Craft / Git   (forward-ref aceita)

Epic 02 / Testing Strategy / Testability ──▶ Epic 04 / Software Design / Dependency Injection & IoC
Epic 02 / Testing Strategy / Contract Testing ──▶ Platform / API ; Architecture / Service Communication
Epic 02 / Testing Strategy / Regression Testing ──▶ AI Engineering / Regression Evaluation
Epic 02 / Testing Strategy / Code Coverage ──▶ Platform / CI-CD (coverage gates)
Epic 02 / Test Doubles ──▶ AI Engineering / AI Evaluation (mocking)
Epic 02 / Debugging / Root Cause Analysis ──▶ Platform / Reliability Engineering

SEM ciclo: TDD não tem Requires para Epic 03 / Refactoring.
```

---

## Colisões de nome a desambiguar na UI/conteúdo

| A | B | Distinção |
|---|---|---|
| `Test Doubles` (Story 02) | `Test Doubles` (Task 02.01) | a Story agrupa; a Task 01 ensina o conceito-guarda-chuva |
| `Assertion` (Testing, 01) | `assert` / invariante em runtime (PF / Contract) | verificação *dentro de um teste* × checagem de invariante em produção |
| `Fake` (02) | `Fake Model` (AI Engineering / deck `harness`) | mesmo padrão de dublê, domínio diferente |
| `Mock` (02, preciso) | "mock" coloquial (qualquer dublê) | verificação de expectativas × uso genérico |
| `Code Coverage` (04) | "test coverage" coloquial (quais cenários) | % de código executado × abrangência de cenários |
| `Stack Trace` (05) | `Call Stack` (Epic 01 / Memory & Runtime) · `Stack` ADT (Epic 01 / Data Structures) | dump textual no instante da falha × conceito de execução × estrutura de dados |
| `Integration Testing` (01) | `Continuous Integration` (Platform / CI-CD) | teste multi-componente × prática de integrar código com frequência |
| `Regression Testing` (04) | `Regression Evaluation` (AI Engineering) | suíte de testes de código × suíte de evals de modelo |
| `Contract Testing` (04) | `Contract` (Epic 01 / PF) · `API Contract` (Platform / API) | verificação automatizada × conceito de pré/pós-condição × especificação de API |
| `Git Bisect` (05) | `Bisect` (Epic 03 / Git) | **mesma coisa — canônico no Epic 02** |

---

## Duplicatas — resolução

| Task | Ocorrências | Resolução |
|---|---|---|
| `Git Bisect` / `Bisect` | Epic 02 / Debugging **+** Epic 03 / Story `Git` | **Confirmado (2026-09-03)**: canônico `Git Bisect` **no Epic 02 / Debugging**, `Requires: Epic 03 / Git`. Na Fase 2 do Epic 03, `Bisect` da Story `Git` vira **revisita/referência** (`[R] ver Testing & Quality Engineering / Debugging / Git Bisect`), não Task canônica. |
| `Test Doubles` (Story) / `Test Doubles` (Task) | mesma Epic | **Não é duplicata.** A Task 02.01 é o conceito-guarda-chuva; a Story leva o mesmo nome. Manter — desambiguar só na UI. |

**Revisitas preservadas** (mudança real de contexto/profundidade — *não* consolidar):

| Par | Por que preservar |
|---|---|
| `Regression Testing` (02) ↔ `Regression Evaluation` (AI) | teste de código determinístico × avaliação estatística de modelo |
| `Contract Testing` (02) ↔ `API Contract` (Platform) ↔ `Contract` (Epic 01) | três níveis: verificação automatizada, especificação, conceito |
| `Testability` (02, canônico) ↔ `Dependency Injection` (Epic 04) | propriedade desejada × mecanismo que a produz (DI é aplicação/revisita) |
| `Stack Trace` (02) ↔ `Call Stack` (Epic 01) | artefato de diagnóstico × conceito de execução |
| `Assertion` (02) ↔ `Contract` (Epic 01) | asserção de teste × asserção de invariante (Design by Contract) |
| `Test Doubles` (02) ↔ `Fake Model` / mocking de LLM (AI) | domínio e riscos diferentes (não-determinismo, custo) |
| `Root Cause Analysis` (02) ↔ `Postmortem` (Platform / Reliability) | técnica individual × processo organizacional pós-incidente |

---

## Decisões aprovadas em 2026-09-03 (aplicadas neste documento)

1. **Forward-reference `Git Bisect` → `Epic 03 / Git`**: **aceita**.
2. **`Git Bisect` canônico no Epic 02 / Debugging**; no Epic 03 / Git será
   revisita/referência (a registrar na Fase 2 do Epic 03).
3. **`Red-Green-Refactor` promovida** a Task oficial (Story 03, posição 02).
   `BDD` permanece `SUGESTÃO`.
4. **`Dummy` promovida** a Task oficial de `Test Doubles` (posição 02).
5. **`Code Coverage` promovida** a Task oficial de `Testing Strategy` (posição 02).
6. **`Assertion`, `Test Fixture`, `Test Runner` promovidas** a Tasks oficiais de
   `Testing Fundamentals` (posições 02, 05, 06).
7. **`Testability` canônico no Epic 02**; `Dependency Injection` (Epic 04) é
   aplicação/revisita.
8. **`TDD` não tem `Requires` para `Epic 03 / Refactoring`** — removido para evitar
   dependência circular. O passo "Refactor" do loop aponta para
   `Epic 03 / Refactoring` como *aprofundamento posterior*, não como `Requires`.
9. **`Property-Based Testing` promovida** a Task oficial de `Testing Strategy`
   (posição 07). `Snapshot Testing` e `Mutation Testing` permanecem `SUGESTÃO`.

**Revisão de `Requires` (diretriz aprovada)**: ordem pedagógica não implica dependência.
`Dummy/Stub/Fake/Spy/Mock` dependem **apenas** de `Test Doubles`.
`Given-When-Then` depende de `Unit Testing` + `Assertion`, **não** de `Arrange-Act-Assert`.
`Test Isolation`, `Regression Testing`, `Code Coverage`, `Property-Based Testing` e
`Contract Testing` **não** dependem umas das outras (só de `Testing Fundamentals` +
conceitos do Epic 01). `Stack Trace` e `Breakpoints` **não** dependem de `Reproduction`.

---

## Próximo passo

Após sua **aprovação final** do Epic 02:
- atualizo `00-overview.md` (Story 02 → 5 Stories, 31 Tasks, ordem, canônicos) e
  `PLAN.md` (histórico: "Fase 2 · Epic 02 aprovado");
- registro a mudança pendente do `Bisect` para a Fase 2 do Epic 03;
- só então abro a Fase 2 do **Epic 03 · Software Craft**.

**Não** atualizo `00-overview.md` / `PLAN.md` nem inicio o Epic 03 antes disso.
