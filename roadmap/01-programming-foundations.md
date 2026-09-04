# Epic 01 · Programming Foundations — detalhamento de Tasks (Fase 2)

> **Estado: revisão final aguardando aprovação.** Não avançar para o Epic 02.
> Incorpora as 5 decisões aprovadas em 2026-09-03 (ver fim do arquivo).
>
> Base: Stories `Programming Fundamentals`, `Functional Programming`, `Data
> Structures`, `Algorithms & Complexity`, `Asynchronous Programming`, `Concurrency`,
> `Type Systems` do arquivo original `design-e-fundamentals.md`.

### Contabilidade de Tasks

- **77 Tasks originais preservadas.** 76 permanecem na Epic 01; 1 (`Composition over
  Inheritance`) é *realocada* para o Epic 04 (decisão Fase 1). 0 removidas, 0 renomeadas.
- **+7 Tasks novas aprovadas**: 6 na nova Story `Memory & Runtime`; `Closure` promovida
  de SUGESTÃO a Task oficial em `Functional Programming`.
- `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)` **consolidadas em 1 Task**
  (`Common Time Complexities`), cada uma mantida como **subtópico** — nenhuma perdida.
- Total Epic 01: **8 Stories, 79 Tasks**.

Legenda:
`Requires:` pré-requisito (sem prefixo = mesma Epic; com prefixo = outra Epic/Story).
**[C]** conceito canônico — 1º ensino, autoritativo ·
**[R]** revisitado depois (onde) ·
**[≠]** colisão de nome a desambiguar ·
`SUGESTÃO` Task nova, não incluir sem aprovação.

---

## Stories da Epic (ordem de estudo)

```
01 · Programming Fundamentals     11 Tasks
02 · Memory & Runtime              6 Tasks   (NOVA — aprovada)
03 · Type Systems                 10 Tasks
04 · Functional Programming       12 Tasks   (+Closure)
05 · Data Structures              10 Tasks
06 · Algorithms & Complexity       9 Tasks   (classes O(...) consolidadas)
07 · Asynchronous Programming      9 Tasks
08 · Concurrency                  12 Tasks
```

**Racional da ordem das Stories**: vocabulário de paradigma (01) → como o programa
existe em memória e executa (02) → como os tipos formalizam contratos (03) → pureza e
imutabilidade, usadas em todo o resto (04) → estruturas de dados (05) → analisar
algoritmos sobre elas (06) → o modelo assíncrono de execução (07) → concorrência, o
superconjunto difícil (08).

`Memory & Runtime` entra como Story 02 porque `Call Stack` (que ela passa a possuir) é
pré-requisito de `Recursion` (Story 06) e `Event Loop` (Story 07) — elimina a
dependência para a frente que existia no rascunho anterior.

---

## Story 01 · Programming Fundamentals

`Requires` (Story): —

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Abstraction | — | **[C]** raiz de tudo. **[R]** Software Design/OOD; Architecture Fundamentals |
| 02 | Encapsulation | Abstraction | **[C]** **[R]** Software Design/OOD |
| 03 | Information Hiding | Encapsulation | **[C]** ensinar aqui a distinção Encapsulation (técnica) × Information Hiding (princípio) — conflados na prática |
| 04 | Interface | Abstraction | **[C]** a fronteira. **[R]** Software Design/"Program to an Interface"; Platform/"API Contract"; Testing/"Contract Testing" |
| 05 | Contract | Interface | **[C]** pré/pós-condições, invariantes (Design by Contract). **[R]** Platform/API; Testing |
| 06 | Inheritance | Encapsulation | **[C]** **[R]** Software Design/OOD; SOLID/LSP |
| 07 | Polymorphism | Interface, Inheritance | **[C]** foco em subtype polymorphism. **[R]** Software Design/OOD; SOLID |
| 08 | Composition | Encapsulation | **[C]** composição de objetos (has-a). **[≠]** ≠ `Function Composition` (Story 04) |
| 09 | Coupling | Interface, Composition, Inheritance | **[C]** **[R]** Software Craft; Software Design; Architecture Fundamentals. Era Task duplicada em 3 Epics — aqui vira o lar único |
| 10 | Cohesion | Coupling | **[C]** ensinar em par com Coupling. **[R]** Software Design; Architecture |
| 11 | Separation of Concerns | Coupling, Cohesion | **[C]** o princípio que "baixo acoplamento / alta coesão" serve. **[R]** Software Design; Architecture |
| — | Composition over Inheritance | Composition, Inheritance, Polymorphism | **REALOCADA → Epic 04 / Story `Design Principles`** (mecanismo `Composition` fica aqui; a heurística consolida com a Task homônima de "Additional Design Principles"). Preservada, não apagada. |

**Racional**: 4 pilares primeiro (Abstraction → Encapsulation → Inheritance →
Polymorphism), intercalados com Interface/Contract (a fronteira que Polymorphism usa)
e Information Hiding (logo após Encapsulation, para separar os dois). Composition
fecha os mecanismos. Só então Coupling/Cohesion/SoC — os critérios para *avaliar*
designs feitos com esses mecanismos.

`SUGESTÃO`: `Modularity` (hoje só em Architecture), `Encapsulation Boundaries
(module / package / service)`.

---

## Story 02 · Memory & Runtime  *(nova — aprovada)*

`Requires` (Story): Programming Fundamentals (Abstraction, Encapsulation).
Como o programa existe em memória e como executa. Detalhes variam por linguagem/runtime
— ensinar os conceitos, sinalizar o que é específico (ex.: GC vs gestão manual).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Memory | PF/Abstraction | **[C]** armazenamento endereçável: bytes, endereços, alocação |
| 02 | Value vs Reference | Memory | **[C]** cópia de valor × endereço compartilhado; semântica varia por linguagem. **[R]** Concurrency/Shared State; Software Design/"Mutable vs Immutable Objects"; FP/Immutability |
| 03 | Stack vs Heap | Value vs Reference | **[C]** stack (frames, LIFO, automática) × heap (dinâmica, coletada). **[≠]** ≠ `Stack` ADT (Story 05) |
| 04 | Call Stack | Stack vs Heap | **[C]** frames de execução, chamada/retorno, stack overflow. **[R]** Algorithms/Recursion; Async/Call Stack + Event Loop. **[≠]** ≠ `Stack` ADT (Story 05) |
| 05 | Garbage Collection | Stack vs Heap | **[C]** recuperação automática do heap; reachability. Específico de runtimes com GC — contrastar com gestão manual. **[R]** Concurrency (pausas de GC); Platform/Performance |
| 06 | Memory Leak | Garbage Collection, Value vs Reference | **[C]** referências retidas que impedem a coleta; modo de falha. **[R]** Frontend (SUGESTÃO Epic); Platform/Performance Engineering |

**Racional**: o que é memória → como valores vivem nela (value/reference) → as duas
regiões (stack/heap) → a stack em ação na execução (call stack) → limpeza do heap
(GC) → quando a limpeza falha (memory leak).

`SUGESTÃO`: `Pointer / Reference (mecânica)`, `Boxing / Unboxing`, `Memory Layout
(contiguidade, cache locality)`, `Stack Overflow` como Task própria.

---

## Story 03 · Type Systems

`Requires` (Story): Programming Fundamentals (Interface, Contract, Abstraction).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Static vs Dynamic Typing | PF/Contract | **[C]** *quando* os tipos são checados |
| 02 | Strong vs Weak Typing | Static vs Dynamic Typing | **[C]** *quão* estritamente são impostos — eixo independente, ensinar depois |
| 03 | Type Inference | Static vs Dynamic Typing | **[C]** |
| 04 | Type Safety | Strong vs Weak Typing | **[C]** a propriedade resultante. **[R]** todo o roadmap assume; Software Design/DIP |
| 05 | Nominal Typing | Type Safety | **[C]** |
| 06 | Structural Typing | Nominal Typing | **[C]** ensinar como contraste. **[R]** Software Design ("duck typing", "Program to an Interface") |
| 07 | Generics | Type Safety, PF/Abstraction | **[C]** **[R]** Story 05 (coleções genéricas) |
| 08 | Union Types | Type Safety | **[C]** |
| 09 | Intersection Types | Union Types | **[C]** |
| 10 | Type Narrowing | Union Types | **[C]** **[R]** Software Craft/"Guard Clauses" (narrowing por guarda) |

**Racional**: os dois eixos ortogonais (static/dynamic, strong/weak) → a propriedade
que produzem (Type Safety) → como o compilador identifica tipos (nominal × structural)
→ ferramentas de composição de tipos (generics, union, intersection, narrowing).

`SUGESTÃO`: `Gradual Typing`, `Top / Bottom Types (any, never, unknown)`,
`Variance (covariance / contravariance)`, `Algebraic Data Types`,
`Optional / Nullable Types`. `Variance` é lacuna real (aparece em Generics + LSP).

---

## Story 04 · Functional Programming

`Requires` (Story): Programming Fundamentals.
Lar canônico de: Pure Functions, Side Effects, Immutability, Referential Transparency,
Closure, Higher-Order Functions, Function Composition.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Declarative vs Imperative | PF/Abstraction | **[C]** framing do paradigma |
| 02 | First-Class Functions | Declarative vs Imperative | **[C]** o recurso de linguagem que habilita o resto |
| 03 | Closure | First-Class Functions | **[C]** *(promovida de SUGESTÃO)*. Função + ambiente léxico capturado. Importante para callbacks e comportamento de funções em JavaScript. **[R]** Async/Callback; Frontend (SUGESTÃO Epic). **Nota**: *não* é pré-requisito do mecanismo do Event Loop |
| 04 | Side Effects | PF/Encapsulation | **[C]** ensinar *antes* de Pure Functions. **[R]** Concurrency/Shared State; AI/determinismo |
| 05 | Pure Functions | Side Effects | **[C]** **[R]** Testing (função pura = trivialmente testável); Story 06/Memoization; AI |
| 06 | Referential Transparency | Pure Functions | **[C]** |
| 07 | Immutability | Side Effects, Memory & Runtime/Value vs Reference | **[C]** **[R]** Concurrency/Thread Safety; Software Design/"Mutable vs Immutable Objects"; Architecture/Event Sourcing |
| 08 | Higher-Order Functions | First-Class Functions, Closure | **[C]** |
| 09 | Function Composition | Higher-Order Functions, Pure Functions | **[C]** **[≠]** ≠ `Composition` (Story 01, objetos). f∘g |
| 10 | Map | Higher-Order Functions | **[C]** |
| 11 | Filter | Map | **[C]** |
| 12 | Reduce | Map, Filter | **[C]** o caso geral — ensinar por último |

**Racional**: paradigma → recurso de linguagem (first-class) → **closure** (logo após
first-class, pois é como funções capturam estado) → efeito colateral → pureza e suas
consequências (referential transparency, imutabilidade) → HOF → composição → o trio
map/filter/reduce (reduce por último, é a generalização).

`SUGESTÃO`: `Currying / Partial Application`, `Recursion vs Iteration` (ponte com
Story 06), `Functor / Monad (nível intuição)`, `Lazy Evaluation`, `Pipe / Flow`.

---

## Story 05 · Data Structures

`Requires` (Story): Programming Fundamentals; Type Systems/Generics (ajuda).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Array | — | **[C]** memória contígua, índice O(1) |
| 02 | Linked List | Array | **[C]** contraste: sem contiguidade |
| 03 | Stack | Array, Linked List | **[C]** LIFO. **[≠]** ≠ `Call Stack` (Story 02) |
| 04 | Queue | Stack | **[C]** FIFO, ensinar em par. **[R]** Story 07/Task Queue; Architecture/Message Queue |
| 05 | Hash Table | Array | **[C]** **[R]** Architecture/Consistent Hashing; Platform/índices |
| 06 | Set | Hash Table | **[C]** normalmente hash-backed |
| 07 | Tree | Linked List | **[C]** nós + ponteiros |
| 08 | Binary Search Tree | Tree | **[C]** **[R]** Platform/índices B-tree |
| 09 | Heap | Tree, Array | **[C]** árvore completa em array; priority queue |
| 10 | Graph | Tree, Hash Table | **[C]** **[R]** AI/Vector Search (HNSW); Architecture (service graph); Software Design (dependency graph) |

**Racional**: contíguo (Array) → encadeado (Linked List) → estruturas construídas
sobre eles (Stack, Queue) → indexação por chave (Hash Table → Set) → hierárquico
(Tree → BST → Heap) → o mais geral (Graph).

`SUGESTÃO`: `Deque`, `Priority Queue` (hoje implícito em Heap), `Trie`,
`Balanced Tree (AVL / Red-Black — intuição)`, `B-Tree` (hoje só citado em Platform),
`Adjacency List vs Matrix`, `Circular Buffer`.

---

## Story 06 · Algorithms & Complexity

`Requires` (Story): Data Structures; Memory & Runtime (Call Stack — para Recursion).

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Time Complexity | Data Structures | **[C]** |
| 02 | Space Complexity | Time Complexity | **[C]** |
| 03 | Big O | Time Complexity, Space Complexity | **[C]** a notação (pior caso assintótico) |
| 04 | Common Time Complexities | Big O | **[C]** *(consolida O(1), O(log n), O(n), O(n log n), O(n²))* — cada classe é **subtópico**, com exemplo canônico e comparação de crescimento |
| 05 | Linear Search | Common Time Complexities, Array | **[C]** |
| 06 | Binary Search | Common Time Complexities, Binary Search Tree | **[C]** **[R]** Testing & Quality/"Binary Search Debugging" e "Git Bisect" (`Requires` esta Task) |
| 07 | Sorting Fundamentals | Common Time Complexities | **[C]** comparar sort ingênuo × eficiente |
| 08 | Recursion | Memory & Runtime/Call Stack, Common Time Complexities | **[C]** **[R]** Data Structures (traversals); Software Craft. *A dependência para a frente foi eliminada — Call Stack é canônico na Story 02* |
| 09 | Memoization | Recursion, Data Structures/Hash Table, Functional Programming/Pure Functions | **[C]** só funciona sobre função pura. **[R]** Platform/Caching; Frontend (SUGESTÃO Epic) |

**Racional**: primeiro medir (time/space) → a notação (Big O) → o catálogo de classes
(Common Time Complexities) → aplicar às buscas (linear → binary) → sorting → recursão
→ memoization (fecha, junta recursão + hash table + pureza).

`SUGESTÃO`: `Divide and Conquer`, `Dynamic Programming`, `Greedy Algorithms`,
`Graph Traversal (BFS / DFS)`, `Best / Average / Worst Case`, `Amortized Complexity`,
`Complexity of Common Operations (cheat-sheet)`.

---

## Story 07 · Asynchronous Programming

`Requires` (Story): Programming Fundamentals; Functional Programming (First-Class
Functions, Closure); Memory & Runtime (Call Stack).

Fundamentos (01–02) ensinados de forma **agnóstica de linguagem**; runtime e
abstrações (03–09) no modelo event-loop (JS), sinalizando o que é específico.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Synchronous vs Asynchronous | — | **[C]** framing — agnóstico de linguagem |
| 02 | Blocking vs Non-Blocking | Synchronous vs Asynchronous | **[C]** eixo distinto de sync/async — agnóstico; ensinar a diferença explicitamente |
| 03 | Call Stack | Memory & Runtime/Call Stack | **[R]** revisita do conceito canônico da Story 02, agora no contexto de execução assíncrona |
| 04 | Callback | Functional Programming/First-Class Functions, Functional Programming/Closure, Synchronous vs Asynchronous | **[C]** |
| 05 | Task Queue | Data Structures/Queue, Callback | **[C]** **[≠]** ≠ Architecture/"Message Queue" (infra, outra Epic) |
| 06 | Event Loop | Call Stack, Task Queue | **[C]** modelo do JS / runtimes event-loop — sinalizar. **[R]** Frontend (SUGESTÃO Epic); Node.js |
| 07 | Microtask Queue | Event Loop, Task Queue | **[C]** específico de runtime (JS) — sinalizar |
| 08 | Promise | Callback, Microtask Queue | **[C]** **[R]** AI/Streaming; Platform/SSE |
| 09 | Async/Await | Promise | **[C]** açúcar sintático sobre Promise |

**Racional**: as duas dicotomias agnósticas (sync/async, blocking/non-blocking) → o
modelo de execução (call stack revisitada + task queue + event loop + microtask queue)
→ as abstrações que o escondem (callback → promise → async/await).

`SUGESTÃO`: `Promise Combinators (all / race / allSettled)`,
`Cancellation / AbortController`, `Generators / Async Iterators`,
`Callback Hell` (histórico), `Backpressure` (hoje só em Architecture).

---

## Story 08 · Concurrency

`Requires` (Story): Asynchronous Programming; Memory & Runtime.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Concurrency vs Parallelism | Async/Synchronous vs Asynchronous | **[C]** framing — não é o mesmo que async |
| 02 | Process | Memory & Runtime/Memory | **[C]** **[R]** Platform/Containers ("Container vs VM") |
| 03 | Thread | Process | **[C]** **[R]** Platform; Kubernetes |
| 04 | Shared State | Thread, Functional Programming/Immutability | **[C]** contraste: dado imutável = sem o problema. **[R]** Architecture/"Stateless Systems" (`Requires` esta) |
| 05 | Race Condition | Shared State | **[C]** **[R]** Platform/DB "Optimistic/Pessimistic Locking", "Isolation Levels" |
| 06 | Critical Section | Race Condition | **[C]** |
| 07 | Atomic Operation | Race Condition | **[C]** **[≠]** relacionado, mas ≠ ACID "Atomicity" (Platform) — escopo diferente; anotar |
| 08 | Mutex | Critical Section | **[C]** |
| 09 | Semaphore | Mutex | **[C]** |
| 10 | Deadlock | Mutex, Semaphore | **[C]** **[R]** Platform/DB; Architecture (deadlock distribuído) |
| 11 | Starvation | Semaphore, Deadlock | **[C]** ensinar em par (falhas de liveness) |
| 12 | Thread Safety | Mutex, Atomic Operation, Functional Programming/Immutability | **[C]** a síntese da Story |

**Racional**: framing (concurrency ≠ parallelism ≠ async) → unidades de execução
(process → thread) → o problema (shared state → race condition) → onde ele ocorre
(critical section) → as ferramentas (atomic, mutex, semaphore) → as novas falhas que
elas introduzem (deadlock, starvation) → o objetivo (thread safety).

`SUGESTÃO`: `Context Switch`, `Thread Pool`, `Lock Contention`, `Livelock`,
`Compare-and-Swap (CAS)`, `Memory Model / Happens-Before`, `Actor Model`,
`CSP / Channels`, `Green Threads / Coroutines`.

---

## Conceitos canônicos que a Epic 01 passa a "possuir"

Qualquer ocorrência posterior em outra Epic é `[R]` e leva
`Requires: Programming Foundations / <Story> / <Task>`.

| Conceito | Story dona | Revisitado em |
|---|---|---|
| Abstraction, Encapsulation, Information Hiding | 01 Programming Fundamentals | Software Design/OOD; Architecture Fundamentals |
| Interface, Contract | 01 Programming Fundamentals | Software Design; Platform/API; Testing/Contract Testing |
| Inheritance, Polymorphism, Composition | 01 Programming Fundamentals | Software Design/OOD, SOLID |
| Coupling, Cohesion, Separation of Concerns | 01 Programming Fundamentals | Software Craft; Software Design; Architecture Fundamentals |
| Memory, Value vs Reference, Stack vs Heap | 02 Memory & Runtime | Concurrency; Software Design; Frontend (SUGESTÃO) |
| Call Stack | 02 Memory & Runtime | Algorithms/Recursion; Async/Call Stack + Event Loop |
| Garbage Collection, Memory Leak | 02 Memory & Runtime | Platform/Performance; Frontend (SUGESTÃO) |
| Type Safety, Structural Typing, Generics | 03 Type Systems | Software Design (Program to an Interface, DIP) |
| Pure Functions, Side Effects, Referential Transparency | 04 Functional Programming | Testing; AI/determinismo |
| Immutability | 04 Functional Programming | Concurrency/Thread Safety; Software Design; Architecture/Event Sourcing |
| Closure, Higher-Order Functions, Function Composition | 04 Functional Programming | Async/Callback; Frontend (SUGESTÃO) |
| Hash Table | 05 Data Structures | Architecture/Consistent Hashing; Platform/índices |
| Tree, Binary Search Tree, Graph | 05 Data Structures | Platform/índices; AI/HNSW; Architecture |
| Queue | 05 Data Structures | Async/Task Queue; Architecture/Message Queue |
| Big O e Common Time Complexities | 06 Algorithms & Complexity | todo o roadmap |
| Binary Search | 06 Algorithms & Complexity | Testing & Quality/Binary Search Debugging, Git Bisect |
| Recursion, Memoization | 06 Algorithms & Complexity | Platform/Caching; Data Structures |
| Event Loop, Promise, async model | 07 Asynchronous Programming | Frontend (SUGESTÃO); AI/Streaming; Platform/SSE |
| Process, Thread | 08 Concurrency | Platform/Containers; Kubernetes |
| Race Condition, Deadlock, Atomic Operation | 08 Concurrency | Platform/DB Transactions (locking, isolation); Architecture |
| Shared State | 08 Concurrency | Architecture/Stateless Systems |

---

## Colisões de nome a desambiguar na UI/conteúdo

| A | B | Distinção |
|---|---|---|
| `Composition` (01) | `Function Composition` (04) | objetos has-a × f∘g |
| `Stack` (05, ADT) | `Call Stack` (02, Memory & Runtime) / `Stack vs Heap` (02) | estrutura de dados × frame de execução / região de memória |
| `Queue` (05, ADT) | `Task Queue` / `Microtask Queue` (07) | ADT × fila do event loop (é-um queue: `Requires: Queue`) |
| `Atomic Operation` (08) | `Atomicity` (Platform/ACID) | operação indivisível de CPU/memória × propriedade de transação |
| `Concurrency` (08) | `Asynchronous` (07) | execução sobreposta/paralela × modelo de agendamento não-bloqueante |

---

## Duplicatas — resolução nesta Epic

| Task duplicada | Ocorrências | Resolução |
|---|---|---|
| Composition over Inheritance | 01 **+** Epic 04 ("Additional Design Principles" → "Favor Composition over Inheritance") | **Consolidar**: mecanismo `Composition` canônico aqui; heurística vai para o Epic 04 como 1 Task única. A Task desta Story é *realocada*, não duplicada. |
| Coupling / Cohesion / Separation of Concerns | 01 (aqui) **+** Software Craft **+** Architecture | **Canônico aqui.** Fase 2 dos Epics 03 e 06 converte em `[R]` ou remove. |
| Pure Functions / Side Effects / Immutability | 04 (aqui) **+** Software Craft/"Clean Code" | **Canônico aqui.** Remover da Story "Clean Code" na Fase 2 do Epic 03. |

Nenhuma outra duplicata *interna* à Epic 01.

---

## Decisões aprovadas em 2026-09-03 (aplicadas neste documento)

1. **`Memory & Runtime` criada como Story 02**; Stories seguintes renumeradas (03–08).
   Elimina a dependência para a frente `Recursion → Call Stack`.
2. Conteúdo de `Memory & Runtime`, ordenado pedagogicamente: `Memory` → `Value vs
   Reference` → `Stack vs Heap` → `Call Stack` → `Garbage Collection` → `Memory Leak`.
   *(A ordem lista `Memory` antes de `Value vs Reference` — uma referência só faz
   sentido depois da noção de endereço/memória.)*
3. **`Closure` promovida** a Task oficial em `Functional Programming`, posição 03
   (após `First-Class Functions`, antes de `Higher-Order Functions`). **Não** modelada
   como requisito do `Event Loop`; relevante para callbacks e comportamento de funções
   em JS.
4. **`Common Time Complexities`**: `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`
   consolidadas em 1 Task, cada uma mantida como subtópico.
5. **`Asynchronous Programming`**: `Synchronous vs Asynchronous` e `Blocking vs
   Non-Blocking` ensinados de forma agnóstica; runtime/abstrações permanecem
   JS-cêntricos; `Call Stack` da Story 07 é **revisita** do canônico da Story 02.

---

## Próximo passo

Após sua **aprovação final** do Epic 01:
- atualizo `00-overview.md` (Story 01 → 8 Stories, contagem de Tasks, ordem);
- registro em `PLAN.md` ("Fase 2 · Epic 01 aprovado em <data>");
- só então abro a Fase 2 do **Epic 02 · Testing & Quality Engineering** (com sua ordem).
