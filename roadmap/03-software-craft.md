# Epic 03 · Software Craft — detalhamento de Tasks (Fase 2)

> **Estado: APROVADO (Fase 2 · Epic 03 — 2026-09-05).** As 8 decisões abaixo
> foram **aprovadas** e 3 correções de `Requires` (`Inline Function`, `Legacy
> Code`, `Merge Conflicts`) foram **aplicadas** nesta rodada. Incorporado a
> `00-overview.md`, `PLAN.md` e `data/roadmap.js` em 2026-09-05. O Epic 04 ·
> Software Design segue **não iniciado** — abrir sua Fase 2 é um passo futuro
> separado, não uma consequência automática desta aprovação.
>
> Base: Stories `Clean Code`, `Code Smells`, `Refactoring`, `Error Handling`,
> `Testing` *(já promovida ao Epic 02)*, `Debugging` *(já promovida ao Epic 02)*,
> `Code Review`, `Git`, `Codebase Maintainability` *(renomeada)* e
> `Engineering Documentation`, do arquivo original `software-craft.md`.
> Preserva todas as decisões já aprovadas nos Epics 01 e 02.

### Contabilidade de Tasks

- **9 Stories, 61 Tasks** no total proposto.
- `Pure Functions`, `Side Effects`, `Immutability` **removidas** de `Clean Code`
  (canônico no Epic 01 / Functional Programming — decisão já aprovada).
- `Bisect` (Story `Git`) deixa de ser canônico — vira revisita/referência de
  `Epic 02 / Debugging / Git Bisect` (decisão já aprovada).
- **Consolidações aprovadas nesta rodada** (ver seção "Decisões aprovadas"):
  5 Tasks "Review for X" → 1 Task `Review Dimensions` com subtopics; `Squash`
  dentro de `Interactive Rebase`; `Replace Magic Number with Constant` dentro
  de `Magic Numbers` (não vira Task própria).
- **Tasks novas incluídas nesta rodada** (sem precedente no rascunho,
  aprovadas): `Refactoring` (guarda-chuva), `Code Review` (guarda-chuva),
  `Errors vs Exceptions` (framing).

Legenda (mesma do Epic 02):
`Requires:` **dependência conceitual real** — "não dá para entender B sem antes
entender A" (sem prefixo = mesma Epic; com prefixo = outra Epic/Story) ·
**[C]** conceito canônico · **[R]** revisita/aplica conceito de outra Epic ·
**[≠]** colisão de nome a desambiguar · `SUGESTÃO` Task/Story nova, não incluir sem
aprovação · **PROPOSTA** decisão que precisa da sua aprovação explícita.

> **Ordem de estudo ≠ `Requires`.** Ex.: `Naming` → `Functions` → `Function
> Arguments` aparecem nessa ordem por convenção pedagógica, não porque uma dependa
> estritamente da anterior — só `Function Arguments` e `Guard Clauses` de fato
> pressupõem `Functions`.

---

## Stories da Epic (ordem de estudo)

```
01 · Clean Code                          6 Tasks
02 · Design Heuristics                   4 Tasks
03 · Code Smells                         6 Tasks
04 · Refactoring                        11 Tasks
05 · Error Handling                      7 Tasks
06 · Code Review                         4 Tasks
07 · Dependency & Version Management     7 Tasks
08 · Git                                11 Tasks
09 · Engineering Documentation           5 Tasks
```

Racional macro (já aprovado na Fase 1): legibilidade → heurísticas → reconhecer
código ruim → corrigir com segurança (exige Epic 02) → lidar com falha →
colaboração → manter codebase vivo → dominar o histórico → comunicar decisões.

`Requires` (baseline implícito de **todas** as Stories, não repetido em cada
linha): `Programming Foundations / Programming Fundamentals`.

---

## Story 01 · Clean Code

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Naming | — | **[C]** vocabulário/legibilidade — ponto de entrada da Story |
| 02 | Functions | — | **[C]** tamanho, responsabilidade única no nível de função |
| 03 | Function Arguments | Functions | **[C]** aridade, ordem, flags booleanas |
| 04 | Guard Clauses | Functions | **[C]** early return. **[R]** Epic 01 / Type Systems / Type Narrowing (`Type Narrowing.revisit` já aponta para cá) — o mecanismo de tipos é lá, o estilo de código é aqui |
| 05 | Comments | — | **[C]** quando comentar (e quando não) |
| 06 | Magic Numbers | — | **[C]** extrair para constantes nomeadas. *Inclui a técnica "substituir por constante" — ver decisão de não duplicar com Refactoring* |

**Removidas desta Story** (canônico no Epic 01 / Functional Programming —
decisão já aprovada): `Pure Functions`, `Side Effects`, `Immutability`. Se
relevantes aqui, tratar como aplicação/revisita contextual em prosa, não como Task.

`SUGESTÃO`: nenhuma nova.

---

## Story 02 · Design Heuristics

`Requires` (Story): baseline apenas — paralela a `Clean Code`, não depende dela
conceitualmente (ordem é só convenção de apresentação).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | DRY | — | **[C]** Don't Repeat Yourself |
| 02 | KISS | — | **[C]** Keep It Simple |
| 03 | YAGNI | — | **[C]** You Aren't Gonna Need It. **[R]** ver colisão com `Speculative Generality` (Code Smells) abaixo |
| 04 | Principle of Least Astonishment | — | **[C]** o código não deve surpreender quem lê |

`SUGESTÃO`: nenhuma nova.

---

## Story 03 · Code Smells

`Requires` (Story): `Clean Code`, `Design Heuristics`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Duplicate Code | Design Heuristics / DRY | **[C]** o smell = a violação visível do princípio |
| 02 | Long Method | — | **[C]** função grande demais para entender de uma vez |
| 03 | Long Parameter List | — | **[C]** relaciona-se com `Function Arguments` (Clean Code) e `Introduce Parameter Object` (Refactoring) — trio intencional: escrever bem → reconhecer violação → corrigir |
| 04 | Large Class | Epic 01 / Programming Fundamentals / Cohesion | **[C]** **[R]** sintoma concreto de baixa coesão |
| 05 | Feature Envy | Epic 01 / Programming Fundamentals / Coupling | **[C]** **[R]** sintoma concreto de acoplamento excessivo — `Coupling.revisit` já lista `"Software Craft"` genericamente |
| 06 | Primitive Obsession | — | **[C]** usar primitivos onde um tipo/objeto próprio comunicaria melhor a intenção |

**Não incluídas como Task própria** (ver `SUGESTÕES` abaixo e "Decisões que
precisam de aprovação"): `Dead Code`, `Shotgun Surgery`, `Divergent Change`,
`Data Clumps`, `Speculative Generality`.

`SUGESTÃO` (Tasks, não incluídas):
- `Dead Code` — smell simples e universal, mas raso — cabe em 1 parágrafo, não
  parece justificar Task própria.
- `Shotgun Surgery` / `Divergent Change` — par clássico (mudança espalhada ×
  mudança concentrada errada), mais avançado/nuançado que os 6 já incluídos.
- `Data Clumps` — relacionado a `Primitive Obsession` / `Introduce Parameter
  Object`; redundante o suficiente para não justificar Task própria agora.
- `Speculative Generality` — **[≠]** quase idêntico a `YAGNI` (Design
  Heuristics); o smell é a violação visível do princípio. Só incluir se você
  quiser reforçar a lição de YAGNI com um exemplo concreto de código.

---

## Story 04 · Refactoring

`Requires` (Story): `Code Smells`; `Epic 02 · Testing & Quality Engineering`
(genérico — **não** `Epic 02 / Test-Driven Development / Red-Green-Refactor`,
para não recriar a dependência circular já resolvida na Fase 2 do Epic 02).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Refactoring | — | **[C]** *(nova, aprovada)* guarda-chuva: transformação que preserva comportamento; "duas camadas" (adicionar feature × refatorar), por que fazer, quando não fazer |
| 02 | Extract Function | Refactoring | **[C]** |
| 03 | Extract Variable | Refactoring | **[C]** |
| 04 | Rename | Refactoring | **[C]** |
| 05 | Inline Function | Refactoring | **[C]** operação inversa de `Extract Function`, ensinar em par (ordem de estudo, não `Requires` — pré-requisito conceitual mínimo é só o guarda-chuva `Refactoring`) |
| 06 | Extract Class | Code Smells / Large Class | **[C]** **[R]** corrige a baixa coesão diagnosticada por `Large Class` |
| 07 | Move Function | Refactoring | **[C]** |
| 08 | Replace Nested Conditional with Guard Clauses | Clean Code / Guard Clauses | **[C]** **[R]** a técnica mecânica que produz o estilo já ensinado em Clean Code |
| 09 | Replace Conditional with Polymorphism | Epic 01 / Programming Fundamentals / Polymorphism | **[C]** **[R]** aplica o mecanismo já ensinado no Epic 01 |
| 10 | Introduce Parameter Object | Code Smells / Long Parameter List | **[C]** **[R]** corrige o smell diagnosticado antes |
| 11 | Refactoring with Tests | Epic 02 / Testing Fundamentals | **[C]** **[R]** fecha a Story: só se refatora com segurança havendo rede de testes |

**Não incluída como Task própria**: `Replace Magic Number with Constant` — ver
"Decisões que precisam de aprovação" (proposta: mencionar dentro de `Magic
Numbers`, não duplicar aqui).

**Sem ciclo**: `Epic 02 / Test-Driven Development / Red-Green-Refactor` aponta
para `Refactoring` como aprofundamento posterior (*pointer*, decisão já aprovada
na Fase 2 do Epic 02) — `Refactoring` **não** tem `Requires` de volta para
`Red-Green-Refactor`.

`SUGESTÃO`: nenhuma nova.

---

## Story 05 · Error Handling

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Errors vs Exceptions | — | **[C]** *(nova, aprovada)* framing agnóstico de linguagem: erro (conceito) × exceção (mecanismo específico) |
| 02 | Exceptions | Errors vs Exceptions | **[C]** throw/catch, hierarquia de exceções |
| 03 | Error Propagation | Epic 01 / Memory & Runtime / Call Stack | **[C]** **[R]** o erro sobe pela pilha de chamadas |
| 04 | Custom Errors | Exceptions | **[C]** tipos de erro com significado de domínio |
| 05 | Fail Fast | Epic 01 / Programming Fundamentals / Contract | **[C]** **[R]** pré-condição violada → falhar imediatamente |
| 06 | Result Pattern | — | **[C]** erro como valor de retorno explícito, não efeito colateral. **[R]** Epic 01 / Functional Programming (Side Effects/Pure Functions) |
| 07 | Error Boundaries | — | **[C]** conter a falha para não propagar em cascata — definição agnóstica de framework (não só React). Ponte futura para Architecture / Resilience Patterns (sem `Requires` — Epic 06 ainda não aprovado) |

`SUGESTÃO`: nenhuma nova.

---

## Story 06 · Code Review

`Requires` (Story): `Clean Code` (precisa existir algo escrito para revisar).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Code Review | Clean Code | **[C]** *(nova, aprovada)* guarda-chuva: o que é, por que é gate de qualidade |
| 02 | Review Dimensions | Code Review | **[C]** *(aprovada — consolida 5 Tasks do rascunho)* subtopics: Correctness, Readability, Maintainability, Testability, Security. **[R]** Epic 02 / Testing Strategy / Testability (uma das lentes) |
| 03 | Review Scope | Code Review | **[C]** tamanho/foco de um PR — mudanças de propósito único |
| 04 | Giving & Receiving Feedback | Code Review | **[C]** camada de comunicação/soft-skill |

**Consolidação proposta**: o rascunho original tinha 5 Tasks separadas ("Review
for Correctness/Readability/Maintainability/Testability/Security"). Proponho
consolidar em `Review Dimensions` com `subtopics`, mesmo padrão já aprovado em
`Common Time Complexities` (Epic 01) e `Code Coverage` (Epic 02) — ver "Decisões
que precisam de aprovação".

`SUGESTÃO`: nenhuma nova.

---

## Story 07 · Dependency & Version Management

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Technical Debt | — | **[C]** custo de atalhos — framing da Story |
| 02 | Legacy Code | — | **[C]** código difícil/arriscado de mudar com segurança, geralmente sem dono claro ou contexto original preservado. **[R]** a associação de Feathers ("código legado = código sem testes") é citada como uma lente relevante, não a definição universal do conceito |
| 03 | Semantic Versioning | — | **[C]** MAJOR.MINOR.PATCH e o que cada um comunica |
| 04 | Backward Compatibility | Semantic Versioning | **[C]** a propriedade que SemVer protege/comunica |
| 05 | Deprecation | Backward Compatibility | **[C]** processo de retirar algo preservando compatibilidade |
| 06 | Dependency Management | Semantic Versioning | **[C]** *(aprovada — decisão 6, seção "Decisões aprovadas")* gerenciar versões/depêndencias de terceiros: lockfiles, ranges de versão, grafo de dependências |
| 07 | Incremental Migration | Legacy Code, Backward Compatibility | **[C]** capstone: técnica para evoluir código legado/dependências com segurança |

`SUGESTÃO`: nenhuma nova.

---

## Story 08 · Git

`Requires` (Story): baseline apenas (a Task `Git Bisect` tem `Requires` própria,
ver abaixo).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Commit | — | **[C]** unidade atômica de histórico, boas mensagens |
| 02 | Merge | Commit | **[C]** |
| 03 | Rebase | Commit | **[C]** contraste direto com Merge |
| 04 | Interactive Rebase | Rebase | **[C]** inclui `Squash` como caso de uso — ver decisão abaixo |
| 05 | Merge Conflicts | Commit | **[C]** colisão entre mudanças registradas em commits; pré-requisito conceitual mínimo é `Commit` (mesmo padrão de `Merge`/`Rebase`/`Cherry-pick`/`Revert`/`Reset`). `Merge` e `Rebase` são onde o conflito aparece na prática e ordem de estudo (Task já vem depois das duas), não `Requires` estrito |
| 06 | Cherry-pick | Commit | **[C]** |
| 07 | Revert | Commit | **[C]** desfazer seguro/público — ensinar em par com Reset |
| 08 | Reset | Commit | **[C]** desfazer local/mutável — ensinar em par com Revert |
| 09 | Reflog | Reset | **[C]** rede de segurança para recuperar de Reset/Rebase mal feitos |
| 10 | Git Bisect | Epic 02 / Debugging / Git Bisect | **canonical: false** · `revisitOf`. **[≠]** não é uma 2ª Task canônica — só ponteiro/referência (decisão já aprovada) |
| 11 | Branching Strategies | Merge, Rebase | **[C]** capstone — trunk-based × git-flow, no nível de workflow de equipe |

**Não incluída como Task própria**: `Squash` — proposto como caso de uso dentro
de `Interactive Rebase`, não Task separada (ver decisões).

`SUGESTÃO`: nenhuma nova.

---

## Story 09 · Engineering Documentation

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | README | — | **[C]** ponto de entrada de um repositório/projeto |
| 02 | Changelog | — | **[C]** registro por mudança |
| 03 | ADR | — | **[C]** Architecture Decision Record — registro por decisão |
| 04 | RFC | — | **[C]** proposta pré-decisão para mudanças maiores |
| 05 | Runbook | — | **[C]** documentação operacional. Ponte futura para Platform / Reliability Engineering (Postmortem) — sem `Requires` (Epic 05 ainda não aprovado) |

**Não incluídas** (existiam no rascunho original, fora da lista canônica atual):
`API Documentation` (encaixa melhor em Platform / API Fundamentals, Epic 05
futuro), `Code Documentation` (colide com `Comments`, Story 01 deste Epic).

`SUGESTÃO`: nenhuma nova.

---

## Conceitos canônicos que a Epic 03 passa a "possuir"

| Conceito | Story dona | Revisitado em |
|---|---|---|
| Naming, Functions, Function Arguments, Guard Clauses, Comments, Magic Numbers | 01 Clean Code | — |
| DRY, KISS, YAGNI, Principle of Least Astonishment | 02 Design Heuristics | — |
| Duplicate Code, Long Method, Long Parameter List, Large Class, Feature Envy, Primitive Obsession | 03 Code Smells | — |
| Refactoring e técnicas (Extract/Inline/Rename/Move/Replace...) | 04 Refactoring | — |
| Errors vs Exceptions, Exceptions, Error Propagation, Custom Errors, Fail Fast, Result Pattern, Error Boundaries | 05 Error Handling | Architecture / Resilience Patterns (Error Boundaries, futuro) |
| Code Review, Review Dimensions, Review Scope, Giving & Receiving Feedback | 06 Code Review | — |
| Technical Debt, Legacy Code, Semantic Versioning, Backward Compatibility, Deprecation, Dependency Management, Incremental Migration | 07 Dependency & Version Management | Architecture / Architecture Evolution (Tech Debt, ADR — no nível de arquitetura) |
| Commit, Merge, Rebase, Interactive Rebase, Merge Conflicts, Cherry-pick, Revert, Reset, Reflog, Branching Strategies | 08 Git | — |
| README, Changelog, ADR, RFC, Runbook | 09 Engineering Documentation | Platform / Reliability Engineering (Runbook, futuro) |

### Revisitas que entram na Epic 03 (dos Epics 01/02, já aprovados)

| Conceito canônico | Onde é revisitado aqui |
|---|---|
| Epic 01 / Type Systems / Type Narrowing | Clean Code / Guard Clauses |
| Epic 01 / Programming Fundamentals / Coupling | Code Smells / Feature Envy |
| Epic 01 / Programming Fundamentals / Cohesion | Code Smells / Large Class |
| Epic 01 / Programming Fundamentals / Polymorphism | Refactoring / Replace Conditional with Polymorphism |
| Epic 01 / Memory & Runtime / Call Stack | Error Handling / Error Propagation |
| Epic 01 / Programming Fundamentals / Contract | Error Handling / Fail Fast |
| Epic 01 / Functional Programming (Side Effects/Pure Functions) | Error Handling / Result Pattern |
| Epic 02 / Testing Fundamentals | Refactoring / Refactoring with Tests |
| Epic 02 / Testing Strategy / Testability | Code Review / Review Dimensions |
| Epic 02 / Debugging / Git Bisect | Git / Git Bisect (revisita, não canônico) |

---

## Dependências de alto nível

```
Epic 01 · Programming Foundations ──▶ Epic 03 (todas as Stories, baseline)
   Type Narrowing ──▶ Guard Clauses            (revisita)
   Coupling ──▶ Feature Envy
   Cohesion ──▶ Large Class
   Polymorphism ──▶ Replace Conditional with Polymorphism
   Call Stack ──▶ Error Propagation
   Contract ──▶ Fail Fast
   Functional Programming ──▶ Result Pattern    (revisita)

Epic 02 · Testing & Quality Engineering ──▶ Refactoring (Story inteira)
Epic 02 / Testing Fundamentals ──▶ Refactoring with Tests
Epic 02 / Testing Strategy / Testability ──▶ Review Dimensions
Epic 02 / Debugging / Git Bisect ⟵ Requires ── Software Craft / Git   (forward-ref já aceita)

Software Craft / Technical Debt, Backward Compatibility, ADR ──▶ Architecture / Architecture Evolution
Software Craft / Error Boundaries ──▶ Architecture / Resilience Patterns   (futuro, sem Requires ainda)
Software Craft / Runbook ──▶ Platform / Reliability Engineering            (futuro, sem Requires ainda)

SEM ciclo: Refactoring não tem Requires para Epic 02 / Red-Green-Refactor.
```

---

## Colisões de nome a desambiguar

| A | B | Distinção |
|---|---|---|
| `Guard Clauses` (Clean Code) | `Type Narrowing` (Epic 01) | técnica de estilo de código × mecanismo de type system |
| `Duplicate Code` (smell) | `DRY` (heurística) | manifestação concreta × princípio abstrato — não são duplicatas, são pares |
| `Long Parameter List` (smell) / `Function Arguments` (Clean Code) / `Introduce Parameter Object` (Refactoring) | — | trio intencional: escrever bem → reconhecer violação → corrigir |
| `Speculative Generality` (candidata a smell) | `YAGNI` (heurística) | quase idênticos — ver decisão de não duplicar |
| `Replace Magic Number with Constant` (refactor candidata) | `Magic Numbers` (Clean Code) | técnica mecânica × Task de estilo — ver decisão de não duplicar |
| `Squash` (Git candidata) | `Interactive Rebase` | caso de uso × técnica geral — ver decisão de não duplicar |
| `Review Dimensions` (Code Review) | `Testability` (Epic 02) | uma lente de revisão × a propriedade em si |
| `API Documentation` (fora do escopo aqui) | `Comments` (Clean Code) / Platform / API Fundamentals (futuro) | documentação de API externa × comentário de código × Task deste Epic |
| `Git Bisect` (Epic 02, canônico) | `Git Bisect` (aqui, Task 08.10) | mesma coisa — canônico no Epic 02, aqui é só revisita/referência |

---

## Duplicatas — resolução

| Item | Ocorrências | Resolução proposta |
|---|---|---|
| `Bisect` / `Git Bisect` | Epic 02 / Debugging **+** Epic 03 / Git | **Já aprovado**: canônico no Epic 02; aqui vira Task `Git Bisect` com `canonical: false` + `revisitOf`, mesma modelagem de `Asynchronous Programming / Call Stack` (Epic 01) |
| `Speculative Generality` × `YAGNI` | Code Smells (candidata) × Design Heuristics | **Aprovado**: não criar Task em Code Smells; registrar só como `SUGESTÃO` com nota de equivalência |
| `Replace Magic Number with Constant` × `Magic Numbers` | Refactoring (candidata) × Clean Code | **Aprovado**: não criar Task em Refactoring; mencionar a técnica dentro da nota de `Magic Numbers` |
| `Squash` × `Interactive Rebase` | Git | **Aprovado**: não criar Task própria; `Squash` vira caso de uso citado dentro de `Interactive Rebase` |
| 5× "Review for X" × `Review Dimensions` | Code Review | **Aprovado**: consolidado em 1 Task com `subtopics`, mesmo padrão de `Common Time Complexities`/`Code Coverage` |

---

## Decisões aprovadas (Fase 2 · Epic 03)

1. **Aprovado**: consolidadas as 5 Tasks "Review for Correctness/Readability/
   Maintainability/Testability/Security" em **1 Task `Review Dimensions`** com
   `subtopics`.
2. **Aprovado**: `Replace Magic Number with Constant` **não** vira Task
   separada — mencionada dentro de `Magic Numbers`.
3. **Aprovado**: `Squash` **não** vira Task separada — mencionado dentro de
   `Interactive Rebase`.
4. **Aprovado**: `Speculative Generality` **não** vira Task — fica só como
   `SUGESTÃO` com nota de equivalência a `YAGNI`.
5. **Aprovado**: incluídas as Tasks guarda-chuva `Refactoring` (Story 04),
   `Code Review` (Story 06) e `Errors vs Exceptions` (framing, Story 05).
6. **Aprovado**: `Dependency Management` incluída como Task distinta de
   `Semantic Versioning` (Story 07).
7. **Aprovado**: `API Documentation` e `Code Documentation` mantidas fora da
   estrutura oficial do Epic 03 (a primeira como sugestão futura para
   Platform / API Fundamentals; a segunda colide com `Comments` e não é
   reincluída).
8. **Aprovado**: `Git Bisect` permanece Task não-canônica em `Git`
   (`canonical: false`, `revisitOf` para `Epic 02 / Debugging / Git Bisect`),
   mesmo padrão de modelagem já usado em `Asynchronous Programming / Call
   Stack` (Epic 01).

### Correções de Requires aplicadas nesta rodada

Regra aplicada estritamente: `Requires` só existe se "não consigo compreender
B adequadamente sem A" — não basta relação temática ou de contexto de uso.

- **`Inline Function`** (Story 04): `Requires` `Extract Function` → **removido**;
  passa a ser só `Refactoring`. O pareamento com `Extract Function` é ordem de
  estudo (operação inversa), não pré-requisito conceitual.
- **`Legacy Code`** (Story 07): `Requires` `Technical Debt` e `Epic 02 /
  Testing Fundamentals` → **ambos removidos**; passa a ser `—` (baseline).
  Reavaliação: entender o que é código legado (código arriscado de mudar,
  sem dono/contexto claro) não pressupõe entender fundamentos de teste — a
  associação de Feathers a "código sem testes" é uma lente, não a definição
  universal do conceito. `Requires` (Story) também ajustado de "Epic 02 ·
  Testing & Quality Engineering (para a definição de Legacy Code)" para
  "baseline apenas", já que nenhuma Task da Story aponta mais para o Epic 02.
- **`Merge Conflicts`** (Story 08): `Requires` `Merge, Rebase` → **removidos**;
  passa a ser `Commit`. Um conflito é uma colisão entre mudanças registradas
  em commits — o pré-requisito conceitual mínimo é `Commit` (mesmo padrão já
  usado em `Merge`/`Rebase`/`Cherry-pick`/`Revert`/`Reset`). `Merge` e `Rebase`
  continuam sendo onde o conflito aparece na prática e ordem de estudo
  (a Task já vem depois das duas na tabela), não `Requires` estrito.

A ordem de estudo (posição nas tabelas) foi preservada nos 3 casos, mesmo com
a remoção dos `Requires`.

---

## Sugestões novas (fora da estrutura oficial — não incorporadas)

| Sugestão | Story onde entraria | Por que mereceria Task própria | Já existe algo parecido em outro Epic? |
|---|---|---|---|
| `Dead Code` | Code Smells | Smell simples e universal, mas raso | Não |
| `Shotgun Surgery` / `Divergent Change` | Code Smells | Par clássico, mais avançado que os 6 já incluídos | Não |
| `Data Clumps` | Code Smells | Relacionado a `Primitive Obsession`/`Introduce Parameter Object` | Relacionado, não duplicado |
| `Speculative Generality` | Code Smells | Só se quiser reforçar YAGNI com exemplo de código | Sim, ≈ YAGNI |
| `API Documentation` | Platform / API Fundamentals (Epic 05, futuro) | OpenAPI/Swagger etc. — mais natural lá | Não, mas pertence a outro Epic |
| `Build & Tooling` (Story inteira) | Novo Story do Epic 03 | Já sugerida na Fase 1 (`00-overview.md`): build systems, linters/formatters, pre-commit, monorepo × polyrepo | Não |

---

## Próximo passo

**Aprovação final registrada em 2026-09-05.** Nesta rodada de consolidação:
- `00-overview.md` foi atualizado (seção `03 · Software Craft`, tabela de
  progresso da Fase 2, dependências de alto nível, arquivos originais);
- `PLAN.md` foi atualizado (Histórico, tabela de Fases);
- `data/roadmap.js` foi atualizado — Epic 03 passa de `status: "structuring"`
  para navegável, com as 9 Stories e 61 Tasks descritas acima.

A Fase 2 do **Epic 04 · Software Design** continua **não iniciada** — é um
passo futuro separado, com sua própria rodada de aprovação. Nenhum commit foi
feito ainda; esta consolidação aguarda revisão visual antes de commitar.
