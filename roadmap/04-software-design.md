# Epic 04 · Software Design — detalhamento de Tasks (Fase 2)

> **Estado: APROVADO (Fase 2 · Epic 04 — 2026-09-05).** As 6 decisões abaixo
> e a ressalva sobre `Chain of Responsibility` foram **aprovadas**. Incorporado
> a `00-overview.md`, `PLAN.md` e `data/roadmap.js` em 2026-09-05. O Epic 05 ·
> Platform Engineering segue **não iniciado** — abrir sua Fase 2 é um passo
> futuro separado, não uma consequência automática desta aprovação.
>
> Base: Stories `Object-Oriented Design`, `SOLID`, `Additional Design
> Principles`, `Dependency Management`, `Creational Design Patterns`,
> `Structural Design Patterns`, `Behavioral Design Patterns`, `Enterprise &
> Application Patterns` e `Domain Modeling` do rascunho original
> `design-e-fundamentals.md` (as Stories de fundamentos de linguagem daquele
> arquivo já foram consumidas pelo Epic 01). Preserva todas as decisões já
> aprovadas nos Epics 01, 02 e 03.

### Contabilidade de Tasks

- **9 Stories, 56 Tasks** no total (versão enxuta).
- **Trimming dos catálogos GoF**: `Structural Patterns` 7 → 5 (fora: `Bridge`,
  `Flyweight`); `Behavioral Patterns` 11 → 5 (fora: `Chain of Responsibility`,
  `Iterator`, `Mediator`, `Memento`, `Visitor`, `Interpreter`). `Creational
  Patterns` fica em 5, inalterada. Os patterns retirados viram `SUGESTÃO`.
- **`Composition over Inheritance`**: heurística *realocada* do Epic 01
  (`01-programming-foundations.md`) — o mecanismo `Composition` fica canônico
  lá, a heurística "favor X sobre Y" é canônica aqui, em `Design Principles`,
  como Task única (consolida a duplicata que o rascunho original tinha entre
  "Additional Design Principles" e a Story de fundamentos).
- **`Law of Demeter` + `Principle of Least Knowledge`**: mesmo conceito, dois
  nomes na literatura — **1 Task única** em `Object-Oriented Design`. O rascunho
  original os separou em duas Stories por engano de organização.
- **`Entity` / `Value Object`**: canônicos em `Object-Oriented Design`;
  `Domain Modeling` os revisita com framing DDD (`canonical: false` +
  `revisitOf`), mesma modelagem de `Git Bisect` (Epic 03) e `Call Stack`
  (Epic 01). *(O rascunho os listava como Tasks completas nas duas Stories —
  duplicata real.)*
- **Excluídas como Task própria** (decisão 5): `Principle of Least
  Astonishment` (canônico no Epic 03 / Design Heuristics), `High Cohesion / Low
  Coupling` (canônico Epic 01), `Dependency` (genérico — coberto por
  `Coupling`), `Dependency Inversion` (= `DIP` em SOLID), `Dependency Graph`
  (colisão de nome com Epic 03; sem conteúdo próprio).

Legenda (mesma do Epic 03):
`Requires:` **dependência conceitual real** — "não dá para entender B sem antes
entender A" (sem prefixo = mesma Epic; com prefixo = outra Epic/Story) ·
**[C]** conceito canônico · **[R]** revisita/aplica conceito de outra Epic ·
**[≠]** colisão de nome a desambiguar · `SUGESTÃO` Task/Story nova, não incluir
sem aprovação · **PROPOSTA** decisão que precisa de aprovação explícita.

> **Ordem de estudo ≠ `Requires`.** A numeração das Tasks/Stories é a sequência
> recomendada de estudo. Ela só vira `Requires` quando há dependência conceitual
> genuína. Ex.: os catálogos GoF são apresentados na ordem clássica
> Creational → Structural → Behavioral, mas as três Stories dependem **só** de
> `Design Principles` — entender `Decorator` não exige ter estudado `Factory
> Method` antes.

---

## Stories da Epic (ordem de estudo)

```
01 · Object-Oriented Design            9 Tasks
02 · SOLID                             5 Tasks
03 · Design Principles                 4 Tasks
04 · Dependency Injection & IoC        5 Tasks
05 · Creational Patterns               5 Tasks
06 · Structural Patterns               5 Tasks   (enxuta — 7→5)
07 · Behavioral Patterns               5 Tasks   (enxuta — 11→5)
08 · Enterprise & Application Patterns  7 Tasks
09 · Domain Modeling                  11 Tasks
```

Racional macro (já aprovado na Fase 1): vocabulário OOD → SOLID (precisa de OOD)
→ princípios adicionais de design → DI/IoC (precisa de DIP) → catálogos GoF
(Creational · Structural · Behavioral, em paralelo, só `Requires` Design
Principles) → padrões de aplicação/persistência → Domain Modeling como capstone
e ponte para Architecture.

`Requires` (baseline implícito de **todas** as Stories, não repetido em cada
linha): `Programming Foundations / Programming Fundamentals`.

---

## Story 01 · Object-Oriented Design

`Requires` (Story): baseline apenas.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Object vs Class | — | **[C]** instância × definição — ponto de entrada da Story |
| 02 | Identity | Object vs Class | **[C]** *(reordenada para antes de Entity/Value Object — `Requires` real, não conveniência de ordem)* o que faz dois objetos serem "o mesmo" |
| 03 | Entity | Identity | **[C]** objeto definido pela identidade que persiste no tempo, ainda que os atributos mudem |
| 04 | Value Object | Identity | **[C]** definido por contraste — igualdade por valor, sem identidade própria |
| 05 | Mutable vs Immutable Objects | Programming Foundations / Functional Programming / Immutability | **[C]** **[R]** aplica o conceito de `Immutability` (Epic 01) a objetos com estado |
| 06 | Tell, Don't Ask | — | **[C]** estilo de interação entre objetos — revisita informalmente `Encapsulation` (Epic 01), sem `Requires` estrito |
| 07 | Law of Demeter (Principle of Least Knowledge) | Programming Foundations / Programming Fundamentals / Coupling | **[C]** **[R]** *(consolida os dois nomes — decisão 2)* regra concreta para minimizar acoplamento entre objetos |
| 08 | Anemic Domain Model | Entity | **[C]** modelo onde o objeto só guarda dados, sem comportamento |
| 09 | Rich Domain Model | Anemic Domain Model | **[C]** contraste direto — objeto com dados + comportamento |

**Racional**: instância × classe → identidade (pré-requisito de Entity/Value
Object) → os dois tipos de objeto de domínio → mutabilidade → estilo de
interação (Tell Don't Ask, Law of Demeter) → o eixo anêmico × rico como síntese.

`SUGESTÃO`: `Modularity` / `Encapsulation Boundaries (module / package /
service)` — já sinalizada como SUGESTÃO no Epic 01; potencial revisita, não
Task nova.

---

## Story 02 · SOLID

`Requires` (Story): `Object-Oriented Design`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Single Responsibility Principle (SRP) | — | **[C]** uma razão para mudar. Aplica informalmente `Cohesion` (Epic 01) — sem `Requires` estrito, é heurística própria |
| 02 | Open/Closed Principle (OCP) | — | **[C]** aberto para extensão, fechado para modificação |
| 03 | Liskov Substitution Principle (LSP) | Programming Foundations / Programming Fundamentals / Inheritance, Programming Foundations / Programming Fundamentals / Polymorphism | **[C]** **[R]** substitutabilidade de subtipos — definida sobre esses dois mecanismos, não dá para entender sem eles |
| 04 | Interface Segregation Principle (ISP) | Programming Foundations / Programming Fundamentals / Interface | **[C]** **[R]** interfaces enxutas e coesas |
| 05 | Dependency Inversion Principle (DIP) | Programming Foundations / Programming Fundamentals / Interface | **[C]** **[R]** depender de abstrações, não de implementações concretas — fecha a Story e abre `Dependency Injection & IoC` |

**Racional**: SRP e OCP primeiro (heurísticas independentes) → LSP, ISP, DIP
(cada um revisita um mecanismo canônico do Epic 01). `High Cohesion / Low
Coupling` **não** vira Task — `Coupling`/`Cohesion` são canônicos no Epic 01;
a aplicação a SOLID fica na nota do SRP.

`SUGESTÃO`: nenhuma nova.

---

## Story 03 · Design Principles

`Requires` (Story): `SOLID`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Command-Query Separation (CQS) | — | **[C]** um método pergunta OU muda estado, não os dois |
| 02 | Encapsulate What Varies | Programming Foundations / Programming Fundamentals / Encapsulation | **[C]** **[R]** isolar o ponto de variação — aplica `Encapsulation` |
| 03 | Program to an Interface | Programming Foundations / Programming Fundamentals / Interface | **[C]** **[R]** depender do contrato, não da implementação. **[R]** Epic 01 / Type Systems (Structural Typing, "duck typing") |
| 04 | Composition over Inheritance | Programming Foundations / Programming Fundamentals / Composition, Programming Foundations / Programming Fundamentals / Inheritance | **[C]** *(heurística realocada do Epic 01 — decisão herdada)* escolhe entre os dois mecanismos já ensinados |

**Racional**: CQS (independente) → os dois princípios de "depender do que varia
/ do contrato" → `Composition over Inheritance` como a heurística que fecha a
Story e conecta com os catálogos GoF (que a usam intensivamente).

`SUGESTÃO`: `Principle of Least Astonishment` **não** entra — é Task canônica
aprovada no Epic 03 / Design Heuristics (duplicata exata de nome e conceito).

---

## Story 04 · Dependency Injection & IoC

`Requires` (Story): `SOLID / Dependency Inversion Principle (DIP)`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Inversion of Control (IoC) | — | **[C]** guarda-chuva: quem controla o fluxo e a criação de dependências |
| 02 | Dependency Injection | Inversion of Control (IoC) | **[C]** a técnica concreta — forma mais comum de aplicar IoC. **[R]** Testing & Quality Engineering / Testing Strategy / Testability — DI é *aplicação* da testabilidade (a via inversa já está registrada no Epic 02), não o contrário |
| 03 | Constructor Injection | Dependency Injection | **[C]** a forma mais comum de DI |
| 04 | Dependency Injection Container | Dependency Injection | **[C]** automatiza a montagem do grafo de dependências |
| 05 | Service Locator | Dependency Injection | **[C]** alternativa/anti-padrão comum a DI — ensinado em contraste |

**Racional**: o guarda-chuva (IoC) → a técnica (DI) → a forma concreta
(Constructor Injection) → a automação (Container) → o contraponto (Service
Locator). `Dependency`, `Dependency Inversion` e `Dependency Graph` do rascunho
original **não** viram Task (ver "Duplicatas").

`SUGESTÃO`: nenhuma nova.

---

## Story 05 · Creational Patterns

`Requires` (Story): `Design Principles`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Factory Method | — | **[C]** |
| 02 | Abstract Factory | Factory Method | **[C]** uma fábrica de factory methods relacionados — não dá para entender sem o anterior |
| 03 | Builder | — | **[C]** |
| 04 | Prototype | — | **[C]** |
| 05 | Singleton | — | **[C]** |

**Racional**: `Factory Method` → `Abstract Factory` (único `Requires` interno da
Story) → `Builder`, `Prototype`, `Singleton` como padrões independentes.

`SUGESTÃO`: nenhuma nova.

---

## Story 06 · Structural Patterns

`Requires` (Story): `Design Principles` — **não** `Creational Patterns`
(decisão 3: a ordem GoF é sequência de estudo, não dependência).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Adapter | — | **[C]** |
| 02 | Decorator | — | **[C]** |
| 03 | Facade | — | **[C]** |
| 04 | Proxy | — | **[C]** |
| 05 | Composite | — | **[C]** relaciona-se com Epic 01 / Data Structures / Tree — aplicação, não `Requires` |

**Racional**: os quatro mais centrais no dia a dia sênior (Adapter, Decorator,
Facade, Proxy) → `Composite` (recursivo, liga com árvores).

`SUGESTÃO` (Tasks, não incluídas — trimming aprovado):
- `Bridge` — clássico GoF, mas raramente citado em entrevistas/dia a dia sênior
  comparado a Adapter/Decorator. Relacionado a `Adapter` (ambos "encaixam"
  interfaces).
- `Flyweight` — nicho: otimização de memória por compartilhamento de estado.
  Relacionado a `Singleton` (instância compartilhada).

---

## Story 07 · Behavioral Patterns

`Requires` (Story): `Design Principles` — **não** `Structural Patterns`
(decisão 3).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Strategy | — | **[C]** |
| 02 | Observer | — | **[C]** |
| 03 | Command | — | **[C]** |
| 04 | State | Strategy | **[C]** estruturalmente idêntico a `Strategy` (troca de comportamento em runtime) — ensinado em par por contraste de intenção |
| 05 | Template Method | — | **[C]** |

**Racional**: os padrões comportamentais mais centrais (Strategy, Observer,
Command) → `State` (par com Strategy) → `Template Method`.

`SUGESTÃO` (Tasks, não incluídas — trimming aprovado):
- **`Chain of Responsibility`** — **Advanced / Optional.** Não entra nas 56
  Tasks agora, mas fica **explicitamente registrado** para reconsideração na
  Fase 2 do Epic 05 · Platform, pela relação direta com *middleware* / pipeline
  de handlers (onde o padrão é a base de várias abstrações reais). Decisão do
  usuário nesta rodada: não perder este item de vista.
- `Iterator` — hoje majoritariamente resolvido por built-ins de linguagem
  (for-each, generators). Relacionado a Epic 01 / Data Structures.
- `Mediator` — reduz acoplamento centralizando comunicação, mas nicho e difícil
  de justificar isoladamente. Relacionado a `Coupling` (Epic 01).
- `Memento` — captura/restaura estado interno; uso raro fora de undo/redo.
  Relacionado a `Encapsulation` (Epic 01).
- `Visitor` — poderoso mas complexo; raramente ensinado antes de nível
  avançado. Relacionado a `Polymorphism` (Epic 01).
- `Interpreter` — muito nichado (parsers / DSLs).

---

## Story 08 · Enterprise & Application Patterns

`Requires` (Story): `Dependency Injection & IoC`. Depende conceitualmente também
de `Platform / Database Fundamentals` (Epic 05, ainda não aprovado) — **sem
`Requires` formal por ora**, mesmo padrão de "forward-ref sem `Requires` ainda"
usado no Epic 03 (`Error Boundaries`, `Runbook`). A pendência será resolvida na
Fase 2 do Epic 05.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Repository Pattern | — | **[C]** abstrai o acesso a dados atrás de uma interface de coleção |
| 02 | Data Mapper | Repository Pattern | **[C]** separa o objeto de domínio da forma como é persistido |
| 03 | Active Record | Repository Pattern | **[C]** contraste direto com Data Mapper — o objeto que se persiste |
| 04 | Unit of Work | Repository Pattern | **[C]** agrupa mudanças numa única transação lógica |
| 05 | Service Layer | Dependency Injection & IoC / Dependency Injection | **[C]** **[R]** orquestra casos de uso; depende de injeção de colaboradores |
| 06 | Specification Pattern | — | **[C]** encapsula regra de negócio/consulta reutilizável e combinável |
| 07 | DTO | — | **[C]** objeto de transporte de dados entre camadas/fronteiras |

**Racional**: `Repository` como base → as duas estratégias de persistência
(Data Mapper × Active Record) → `Unit of Work` (transação) → `Service Layer`
(orquestração) → `Specification` e `DTO` (padrões de apoio).

`SUGESTÃO`: nenhuma nova.

---

## Story 09 · Domain Modeling

`Requires` (Story): `Object-Oriented Design`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Domain | — | **[C]** framing da Story — o problema/negócio que o software modela |
| 02 | Domain Model | Domain | **[C]** |
| 03 | Ubiquitous Language | Domain Model | **[C]** vocabulário compartilhado entre dev e negócio |
| 04 | Entity | Object-Oriented Design / Entity | **canonical: false** · `revisitOf`. **[≠]** não é uma 2ª Task canônica — aqui ganha framing DDD: identidade dentro de um `Bounded Context` |
| 05 | Value Object | Object-Oriented Design / Value Object | **canonical: false** · `revisitOf`. **[≠]** idem — framing DDD |
| 06 | Aggregate | Entity, Value Object | **[C]** cluster de objetos tratado como uma unidade de consistência |
| 07 | Aggregate Root | Aggregate | **[C]** a única porta de entrada do Aggregate |
| 08 | Domain Service | Domain Model | **[C]** comportamento de domínio que não pertence a nenhuma Entity/Value Object |
| 09 | Domain Event | Domain Model | **[C]** algo relevante que aconteceu no domínio |
| 10 | Bounded Context | Ubiquitous Language | **[C]** capstone — a fronteira dentro da qual o modelo (e a linguagem) é consistente |
| 11 | Context Mapping | Bounded Context | **[C]** capstone final — relação entre Bounded Contexts; ponte para Architecture / Architectural Styles |

**Racional**: framing (Domain → Domain Model → Ubiquitous Language) → os blocos
de construção (Entity/Value Object revisitados → Aggregate → Aggregate Root →
Domain Service → Domain Event) → as fronteiras (Bounded Context → Context
Mapping), que são pré-requisito de microservices no Epic 06.

`SUGESTÃO`: nenhuma nova.

---

## Conceitos canônicos que a Epic 04 passa a "possuir"

Qualquer ocorrência posterior em outra Epic é `[R]` e leva
`Requires: Software Design / <Story> / <Task>`.

| Conceito | Story dona | Revisitado em |
|---|---|---|
| Object vs Class, Identity, Entity, Value Object, Mutable vs Immutable Objects, Tell Don't Ask, Law of Demeter, Anemic/Rich Domain Model | 01 Object-Oriented Design | Domain Modeling (Entity/Value Object, framing DDD); Architecture (futuro) |
| SRP, OCP, LSP, ISP, DIP | 02 SOLID | Architecture Fundamentals (futuro) |
| CQS, Encapsulate What Varies, Program to an Interface, Composition over Inheritance | 03 Design Principles | — |
| Inversion of Control, Dependency Injection, Constructor Injection, DI Container, Service Locator | 04 Dependency Injection & IoC | Enterprise & Application Patterns / Service Layer |
| Factory Method, Abstract Factory, Builder, Prototype, Singleton | 05 Creational Patterns | — |
| Adapter, Decorator, Facade, Proxy, Composite | 06 Structural Patterns | — |
| Strategy, Observer, Command, State, Template Method | 07 Behavioral Patterns | — |
| Repository, Data Mapper, Active Record, Unit of Work, Service Layer, Specification, DTO | 08 Enterprise & Application Patterns | Architecture / Data & Architecture Patterns (futuro) |
| Domain, Domain Model, Ubiquitous Language, Aggregate, Aggregate Root, Domain Service, Domain Event, Bounded Context, Context Mapping | 09 Domain Modeling | Architecture / Architectural Styles (Bounded Context → microservices) |

### Revisitas que entram na Epic 04 (dos Epics 01–03, já aprovados)

| Conceito canônico | Onde é revisitado aqui |
|---|---|
| Programming Foundations / Programming Fundamentals / Inheritance, Polymorphism | SOLID / LSP |
| Programming Foundations / Programming Fundamentals / Interface | SOLID / ISP, DIP · Design Principles / Program to an Interface |
| Programming Foundations / Programming Fundamentals / Encapsulation | Design Principles / Encapsulate What Varies · OOD / Tell, Don't Ask |
| Programming Foundations / Programming Fundamentals / Composition, Inheritance | Design Principles / Composition over Inheritance |
| Programming Foundations / Programming Fundamentals / Coupling | OOD / Law of Demeter |
| Programming Foundations / Programming Fundamentals / Cohesion | SOLID / SRP (informal, sem `Requires`) |
| Programming Foundations / Functional Programming / Immutability | OOD / Mutable vs Immutable Objects |
| Programming Foundations / Type Systems / Structural Typing | Design Principles / Program to an Interface |
| Testing & Quality Engineering / Testing Strategy / Testability | Dependency Injection & IoC / Dependency Injection |
| Software Design / Object-Oriented Design / Entity, Value Object | Domain Modeling / Entity, Value Object (`canonical: false`) |

Nenhum conceito de Coupling / Cohesion / Abstraction / Encapsulation / Interface
/ Contract / Inheritance / Polymorphism foi recriado como Task canônica aqui —
todos permanecem com casa única no Epic 01.

---

## Dependências de alto nível

```
Epic 01 · Programming Foundations ──▶ Epic 04 (todas as Stories, baseline)
   Inheritance + Polymorphism ──▶ SOLID / LSP
   Interface ──▶ SOLID / ISP, DIP ; Design Principles / Program to an Interface
   Encapsulation ──▶ Design Principles / Encapsulate What Varies
   Composition + Inheritance ──▶ Design Principles / Composition over Inheritance
   Coupling ──▶ OOD / Law of Demeter
   Functional Programming / Immutability ──▶ OOD / Mutable vs Immutable Objects

Epic 02 · Testing & Quality / Testing Strategy / Testability ──▶ DI & IoC / Dependency Injection
   (via inversa "DI é aplicação da testabilidade" já registrada no Epic 02)

Software Design / Object-Oriented Design ──▶ SOLID ──▶ Design Principles ──▶ (Creational | Structural | Behavioral)
Software Design / SOLID / DIP ──▶ Dependency Injection & IoC ──▶ Enterprise & Application Patterns
Software Design / Object-Oriented Design ──▶ Domain Modeling

Software Design / Domain Modeling / Bounded Context, Context Mapping ──▶ Architecture / Architectural Styles   (Epic 06, futuro)
Software Design / Enterprise & Application Patterns ⟵ Requires ── Platform / Database Fundamentals   (Epic 05, futuro — sem Requires formal ainda)

SEM cadeia: Creational Patterns ↛ Structural Patterns ↛ Behavioral Patterns
(ordem de estudo, não dependência — as três só Requires Design Principles).
```

---

## Colisões de nome a desambiguar

| A | B | Distinção |
|---|---|---|
| `Entity` / `Value Object` (OOD, canônico) | `Entity` / `Value Object` (Domain Modeling) | mesma coisa — canônico em OOD (mecânica geral de identidade); em Domain Modeling é revisita com framing DDD |
| `Law of Demeter` (aqui, OOD) | `Principle of Least Knowledge` (rascunho, "Additional Design Principles") | dois nomes do mesmo conceito — consolidados em 1 Task |
| `Principle of Least Astonishment` (rascunho, aqui) | `Principle of Least Astonishment` (Epic 03 / Design Heuristics, canônico) | duplicata exata — excluída daqui |
| `High Cohesion / Low Coupling` (rascunho, aqui) | `Coupling` / `Cohesion` (Epic 01, canônicos) | princípio derivado × conceitos-base — não vira Task, aplicação fica em prosa |
| `Dependency Inversion` (rascunho, "Dependency Management") | `Dependency Inversion Principle` (SOLID, canônico) | mesmo conceito — não recriado |
| `Dependency` genérico (rascunho) | `Coupling` (Epic 01) | conceito genérico demais — já coberto por Coupling |
| `Dependency Graph` (rascunho, grafo de objetos/colaboradores) | `Dependency Management` (Epic 03, grafo de pacotes) | significados diferentes — nenhuma vira Task "Dependency Graph" isolada |
| `State` (Behavioral Patterns) | `Strategy` (Behavioral Patterns) | estruturalmente idêntico — Task própria com `Requires: Strategy` e nota de contraste de intenção |
| `Composition` (Epic 01, mecanismo) | `Composition over Inheritance` (aqui, heurística) | mecanismo has-a × heurística de escolha entre mecanismos |
| `Command` (Behavioral Pattern) | `Command-Query Separation` (Design Principles) | padrão de objeto que encapsula uma ação × princípio de separar leitura de escrita |
| `Domain Service` (Domain Modeling) | `Service Layer` (Enterprise Patterns) | comportamento de domínio puro × camada de orquestração de casos de uso |

---

## Duplicatas — resolução

| Item | Ocorrências | Resolução |
|---|---|---|
| `Entity` / `Value Object` | OOD **+** Domain Modeling (rascunho) | **Duplicidade real.** Canônico em OOD; Domain Modeling revisita com `canonical: false` + `revisitOf`, mesma modelagem de `Git Bisect` (Epic 03) |
| `Law of Demeter` × `Principle of Least Knowledge` | OOD **+** "Additional Design Principles" (rascunho) | **Aprovado**: 1 Task única em OOD |
| `Composition over Inheritance` | Epic 01 (rascunho) **+** "Additional Design Principles" (rascunho) | **Já decidido na Fase 2 do Epic 01**: mecanismo `Composition` canônico lá; heurística consolidada aqui como 1 Task, em `Design Principles` |
| `Principle of Least Astonishment` | Epic 03 / Design Heuristics **+** "Additional Design Principles" (rascunho) | **Aprovado**: canônico no Epic 03; não recriado aqui |
| `High Cohesion / Low Coupling` | Epic 01 **+** "Additional Design Principles" (rascunho) | **Aprovado**: `Coupling`/`Cohesion` canônicos no Epic 01; não vira Task aqui |
| `Dependency Inversion` | SOLID / DIP **+** "Dependency Management" (rascunho) | **Aprovado**: canônico em SOLID / DIP; não recriado em DI & IoC |
| `Dependency`, `Dependency Graph` | "Dependency Management" (rascunho) | **Aprovado**: não viram Task própria (ver Colisões) |

---

## Decisões aprovadas (Fase 2 · Epic 04 — 2026-09-05)

1. **Aprovado**: trimming dos catálogos de patterns e a versão enxuta de **56
   Tasks** (Structural 7→5, Behavioral 11→5; Creational inalterada). Os patterns
   retirados ficam como `SUGESTÃO`.
2. **Aprovado**: `Law of Demeter` + `Principle of Least Knowledge` consolidados
   numa **Task única**, em `Object-Oriented Design`.
3. **Aprovado**: remoção da cadeia de `Requires` Creational → Structural →
   Behavioral. Manter a ordem de estudo não implica dependência conceitual — as
   três Stories dependem só de `Design Principles`.
4. **Aprovado**: `Entity` e `Value Object` **canônicos em `Object-Oriented
   Design`**; revisitas (`canonical: false` + `revisitOf`) em `Domain
   Modeling`. *(Inverte o registro da Fase 1 em `PLAN.md` §1.2 e
   `00-overview.md` §04 — mudança não silenciosa, explicitamente aprovada.)*
5. **Aprovado**: exclusão de `Principle of Least Astonishment`, `High Cohesion /
   Low Coupling`, `Dependency`, `Dependency Inversion` e `Dependency Graph`
   como Tasks próprias, pelos motivos das seções "Colisões" e "Duplicatas".
6. **Aprovado**: `Enterprise & Application Patterns` permanece nesta Epic,
   detalhada agora. O `Requires` a `Platform / Database Fundamentals` fica como
   pendência futura (sem `Requires` formal), a ser resolvida quando a Fase 2 do
   Epic 05 · Platform for estruturada.

**Ressalva aprovada — `Chain of Responsibility`:** não entra nas 56 Tasks, mas
fica **explicitamente preservado** como sugestão destacada (Advanced / Optional)
na Story `Behavioral Patterns`, para reconsideração na Fase 2 do Epic 05 ·
Platform — principalmente pela relação com *middleware*.

---

## Sugestões novas (fora da estrutura oficial — não incorporadas)

| Sugestão | Story onde entraria | Problema que cobre | Por que mereceria Task própria | Novo ou revisita? |
|---|---|---|---|---|
| `Chain of Responsibility` | Behavioral Patterns | Passar uma requisição por uma cadeia de handlers | **Ressalva do usuário — Advanced/Optional.** Base de *middleware* / pipelines; reconsiderar na Fase 2 do Epic 05 · Platform | Novo (não incluído, mas marcado para retomar) |
| `Bridge` | Structural Patterns | Separar abstração de implementação variável | Clássico GoF, mas raro no dia a dia sênior comparado a Adapter/Decorator | Novo (não incluído) |
| `Flyweight` | Structural Patterns | Compartilhar estado para economizar memória | Nicho — caso de uso estreito | Novo (não incluído) |
| `Iterator` | Behavioral Patterns | Percorrer coleção sem expor a estrutura interna | Hoje resolvido por built-ins de linguagem | Novo (não incluído) |
| `Mediator` | Behavioral Patterns | Centralizar comunicação entre objetos | Reduz acoplamento, mas nicho | Novo (não incluído) |
| `Memento` | Behavioral Patterns | Capturar/restaurar estado sem violar encapsulamento | Uso raro fora de undo/redo | Novo (não incluído) |
| `Visitor` | Behavioral Patterns | Adicionar operações sem mudar as classes visitadas | Poderoso mas complexo; nível avançado | Novo (não incluído) |
| `Interpreter` | Behavioral Patterns | Interpretar uma gramática/linguagem pequena | Muito nichado (parsers / DSLs) | Novo (não incluído) |
| `Modularity` / `Encapsulation Boundaries` | Object-Oriented Design ou Story própria | Fronteiras de módulo/pacote/serviço | Já sinalizada como SUGESTÃO no Epic 01 — ainda não resolvida | Potencial revisita |

---

## Próximo passo

**Aprovação registrada em 2026-09-05.** Nesta rodada de consolidação:
- `roadmap/04-software-design.md` criado (este arquivo);
- `roadmap/00-overview.md` atualizado (seção `04 · Software Design`, tabela de
  progresso da Fase 2, racional "Por que essa ordem", conceitos transversais,
  dependências de alto nível, "Próximo passo — Fase 3", arquivos originais);
- `PLAN.md` atualizado (Histórico, §1.2, "Detalhamento Task-a-Task", tabela de
  Fases §6);
- `data/roadmap.js` atualizado — Epic 04 passa de `status: "structuring"` para
  navegável, com as 9 Stories e 56 Tasks descritas acima.

A Fase 2 do **Epic 05 · Platform Engineering** continua **não iniciada** — é um
passo futuro separado, com sua própria rodada de aprovação. Nenhum commit foi
feito ainda; esta consolidação aguarda revisão visual antes de commitar.
