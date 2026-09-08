# Epic 07 · AI Engineering — detalhamento de Tasks (Fase 2)

> **Estado: APROVADO / FINAL / FROZEN (Fase 2 · Epic 07 — 2026-09-08).** Produzido
> por proposta Task-a-Task → auditoria independente de `Requires` (ORDER ≠
> REQUIRES, teste literal *"é impossível ou inadequado compreender B sem já
> compreender A?"*) → rodada de reconciliação de contagem + correções → 12
> decisões de PENDENTE (autoridade final da usuária) + 3 ajustes finais.
> Preserva todas as decisões já aprovadas nos Epics 01–06 (FROZEN), em especial
> o ownership canônico do Epic 05 (`Rate Limiting` → Platform / API Fundamentals;
> `Cache` → Platform / Caching; `Latency`/`Throughput` → Platform / Performance
> Engineering; `Principle of Least Privilege` → Platform / Authorization;
> `Distributed Tracing`/`Structured Logging` → Platform / Observability) e do
> Epic 06 (`Retry` → Architecture / Resilience Patterns).
>
> Base: as 23 Stories da macro aprovada (`00-overview.md`, Fase 1) e do rascunho
> original `ai-engineering.md`.

### Contabilidade de Tasks

- **23 Stories, 161 Tasks** — 156 canônicas + **5** `canonical: false` +
  `revisitOf`.
- **2 Tasks novas** vs a proposta base de 159: `Agentic System` (Story 14,
  PENDENTE-1) e `Structured Prompting` (Story 04, PENDENTE-4/12) — nenhuma outra
  Task removida para compensar.
- **~30 consolidações auditadas** (umbrella 3→1/4→1/5→1 e pares 2→1) — cada uma
  vira 1 Task com `subtopics`.
- **rebaixamentos a subtopic/alt-nome/pointer** — itens que eram Task própria no
  rascunho original e viraram detalhe de outra Task.
- **Auditoria de `Requires` de Task**: a árvore rodada-2 tinha **160 arestas**
  de `Requires` de Task → após o teste ORDER ≠ REQUIRES + reconciliação + 3
  ajustes finais: **30 REMOVE / 32 REPOINT (trocam o alvo, não a contagem) / 98
  KEEP** → **130 arestas finais**. As relações removidas de `Requires` foram
  preservadas como pointer/contexto (campo `revisit`) quando aplicável.
- **`revisitOf`** (revisita formal, `canonical: false`): **5 Tasks**.

Legenda (mesma dos Epics 03–06):
`Requires:` **dependência conceitual real** (sem prefixo = mesma Story; com
prefixo = outra Story/Epic) · **[C]** conceito canônico · **[R]** revisita/aplica
conceito de outra Story/Epic (continua canônico aqui) · **[Rev→ X]**
`canonical: false` + `revisitOf: X` · **[≠]** colisão de nome a desambiguar ·
*sub:* subtopics · **root** = 0 `Requires` de Task · `SUGESTÃO` Task/Story nova,
não incluída.

> **Ordem de estudo ≠ `Requires`.** A numeração é a sequência recomendada de
> estudo; só vira `Requires` quando há dependência conceitual genuína. Múltiplas
> Tasks-root por Story são aceitáveis (decisão final, PENDENTE-9/10/11).

`Requires` (baseline implícito de **todas** as Stories, não repetido em cada
linha): a Epic inteira `Requires: Platform Engineering` (APIs, Observability,
Caching); `Production AI` adicionalmente `Requires: Architecture / Resilience
Patterns`. Pode ser antecipado por quem já atua na área (só depende de Platform).

---

## Stories da Epic (ordem de estudo)

```
01 · AI Fundamentals            7 Tasks
02 · Language Models            9 Tasks     Requires: AI Fundamentals
03 · Model Inference            6 Tasks     Requires: Language Models
04 · Prompt Engineering         9 Tasks     Requires: Model Inference
05 · Context Engineering        8 Tasks     Requires: Prompt Engineering
06 · Structured Generation      5 Tasks     Requires: Prompt Engineering
07 · Embeddings                 6 Tasks
08 · Vector Search              6 Tasks     Requires: Embeddings
09 · Chunking                   2 Tasks
10 · Retrieval                  7 Tasks     Requires: Vector Search, Chunking
11 · RAG                        7 Tasks     Requires: Retrieval, Context Engineering
12 · Tool Calling               8 Tasks     Requires: Structured Generation
13 · MCP                        5 Tasks     Requires: Tool Calling
14 · Agent Fundamentals         8 Tasks     Requires: Tool Calling, Context Engineering
15 · Agent Orchestration        5 Tasks     Requires: Agent Fundamentals
16 · AI Memory                  6 Tasks     Requires: Agent Fundamentals, Context Engineering
17 · Multi-Agent Systems        8 Tasks     Requires: Agent Orchestration
18 · Model Routing              5 Tasks     Requires: Model Inference
19 · AI Evaluation              7 Tasks     Requires: RAG, Agent Fundamentals
20 · AI Safety & Guardrails    11 Tasks     Requires: Tool Calling, RAG, Agent Fundamentals
21 · Model Adaptation           6 Tasks     Requires: AI Fundamentals, RAG
22 · AI Observability           7 Tasks     Requires: Platform / Observability
23 · Production AI             13 Tasks     Requires: AI Evaluation, AI Observability, Architecture / Resilience Patterns
                              ─── 161 Tasks
```

Racional macro (já aprovado na Fase 1): o que é IA/ML/inferência → como um LLM
funciona → controles de inferência → prompting → saída estruturada → context
engineering → embeddings → busca vetorial → chunking → retrieval → RAG → tool
calling → MCP → agentes → orquestração → memória → multi-agente → roteamento →
avaliação → segurança/guardrails → observabilidade de IA → adaptação de modelo →
Production AI (capstone de revisita).

**Nenhuma Story foi renomeada, dividida, fundida, removida ou reordenada.** Todas
as `Requires` de Story do macro foram preservadas literalmente — incluindo `Tool
Calling → Structured Generation` e `MCP → Tool Calling` (PENDENTE-7: preservadas
no nível de Story, **sem** criar `Requires` de Task artificiais para espelhá-las).

---

## Resources (decks existentes — não derivam estrutura, só se associam)

| Deck | Estado | Tasks associadas (`resources`) |
|---|---|---|
| `harness` | 36 slides, conteúdo real | AI Fundamentals / Training, / Inference · Language Models / Token, / Context Window · Model Inference / Streaming · Context Engineering / Context · Structured Generation / Retry on Invalid Output · Agent Fundamentals / Agentic Workflow · AI Safety & Guardrails / Guardrails, / Input vs Output Guardrails, / Human Approval |
| `ai-fundamentals` | placeholder, 3 slides | AI Fundamentals / Artificial Intelligence (AI) |

Nenhum conteúdo de deck migrado; nenhuma Task derivada dos decks.

---

## Story 01 · AI Fundamentals — 7 Tasks · 5 arestas

`Requires` (Story): baseline.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Artificial Intelligence (AI) | — (root) | **[C]** raiz. resources: ai-fundamentals |
| 02 | AI System | AI | **[C]** **[≠]** ≠ AI Model — o sistema de engenharia completo (APIs, dados, guardrails) que usa 1+ modelos |
| 03 | Machine Learning (ML) | AI | **[C]** subcampo — aprender padrões a partir de dados. *sub:* Deep Learning |
| 04 | AI Model | Machine Learning (ML) | **[C]** **[≠]** ≠ AI System — o artefato (arquitetura + parâmetros). *sub:* Model Architecture. KEEP: definição de AI Model não se enuncia sem ML nomeado como o processo que o produz |
| 05 | Training | AI Model | **[C]** processo que produz os parâmetros. resources: harness |
| 06 | Inference | — (root) · **[R]** Training | **[C]** usar um modelo já treinado — contraste direto com Training (contraste/sequência, não prerequisite). resources: harness |
| 07 | Parameters | AI Model | **[C]** os valores aprendidos durante o treino |

---

## Story 02 · Language Models — 9 Tasks · 7 arestas

`Requires` (Story): `AI Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Language Model (LM) | AI Fundamentals / AI Model | **[C]** **[≠]** ≠ AI Model genérico — modelo especializado em distribuição de probabilidade sobre sequências de texto |
| 02 | Large Language Model (LLM) | Language Model (LM) | **[C]** "large" é qualificador de escala sobre LM |
| 03 | Token | — (root) · **[R]** Language Model (LM) | **[C]** a unidade que um LM processa — autocontido. resources: harness |
| 04 | Tokenization | Token | **[C]** processo que produz tokens. *sub:* Vocabulary |
| 05 | Attention | — (root) · **[R]** Language Model (LM) | **[C]** mecanismo geral de deep learning, não exclusivo de LM. *sub:* Self-Attention |
| 06 | Transformer | Attention | **[C]** arquitetura construída sobre self-attention |
| 07 | Context Window | Token | **[C]** nº máximo de tokens numa chamada. resources: harness. **[R]** Context Engineering / Context Budget |
| 08 | Next-Token Prediction | Language Model (LM) | **[C]** o objetivo de treino central de um LM |
| 09 | Autoregressive Generation | Next-Token Prediction | **[C]** aplicar next-token prediction repetidamente |

---

## Story 03 · Model Inference — 6 Tasks · 4 arestas

`Requires` (Story): `Language Models`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Deterministic vs Stochastic Output | Language Models / Next-Token Prediction | **[C]** framing — sampling introduz aleatoriedade |
| 02 | Temperature | Deterministic vs Stochastic Output | **[C]** achata/afia a distribuição |
| 03 | Top-P / Top-K Sampling | Deterministic vs Stochastic Output | **[C]** **consolidação 2→1**. *sub:* Top-P (nucleus), Top-K |
| 04 | Stopping Conditions (Max Output Tokens / Stop Sequence) | — (root) | **[C]** **consolidação 2→1** — quando parar de gerar |
| 05 | Streaming | — (root) | **[C]** **[R]** Platform / Web Fundamentals / Server-Sent Events (SSE) — pointer já FROZEN do lado de Platform. resources: harness |
| 06 | Seed | Deterministic vs Stochastic Output | **[C]** reprodutibilidade da amostragem |

---

## Story 04 · Prompt Engineering — 9 Tasks · 7 arestas

`Requires` (Story): `Model Inference`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Prompt | — (root) | **[C]** raiz |
| 02 | System Prompt vs User Prompt | Prompt | **[C]** **consolidação 2→1** |
| 03 | Instruction Hierarchy | System Prompt vs User Prompt | **[C]** qual dos dois prevalece em conflito |
| 04 | Zero-Shot vs Few-Shot Prompting | Prompt | **[C]** **consolidação 2→1** |
| 05 | In-Context Learning | — (root) · **[R]** Zero-Shot vs Few-Shot Prompting | **[C]** "adaptar comportamento a partir de exemplos/instruções no prompt sem atualizar pesos" — Zero/Few-Shot são aplicações de ICL, não prerequisite |
| 06 | Prompt Template | Prompt | **[C]** estrutura reutilizável e parametrizada |
| 07 | Structured Prompting | Prompt | **[C]** **NOVA Task** (PENDENTE-4/12) — técnica de construção/organização do prompt (soft). **[≠]** ≠ Schema-Constrained Generation (hard) |
| 08 | Prompt Chaining | Prompt | **[C]** **[≠]** ≠ Sequential Workflow (Story 15) — encadear chamadas de LLM sem ser agentic |
| 09 | Prompt Versioning | Prompt | **[C]** canônico aqui — Production AI (Story 23) cita por pointer, não duplica |

`Structured Prompting` deixa de ser subtopic de `Structured Output` (Story 06).

---

## Story 05 · Context Engineering — 8 Tasks · 7 arestas

`Requires` (Story): `Prompt Engineering`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Context | — (root) | **[C]** raiz. resources: harness |
| 02 | Context Engineering | Context | **[C]** guarda-chuva — a disciplina |
| 03 | Context Assembly | Context | **[C]** montar não exige a moldura da "disciplina". *sub:* Context Selection |
| 04 | Context Ordering | Context | **[C]** como organizar o que foi montado |
| 05 | Context Compression | Context | **[C]** reduzir volume mantendo sinal |
| 06 | Context Budget | Language Models / Context Window | **[C]** budget definido pelo limite físico da janela |
| 07 | Context Overflow | Context Budget | **[C]** o que acontece ao exceder o budget |
| 08 | Context Rot | Context · **[R]** Language Models / Context Window | **[C]** degradação com contexto longo, mesmo sem estourar. *sub:* Long Context |

---

## Story 06 · Structured Generation — 5 Tasks · 4 arestas

`Requires` (Story): `Prompt Engineering`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Structured Output | — (root) | **[C]** raiz. *sub:* JSON Output. `Structured Prompting` **não** é mais subtopic aqui |
| 02 | Schema-Constrained Generation | Structured Output | **[C]** mecanismo "hard" — decodificação restrita. **[≠]** ≠ Structured Prompting (soft) |
| 03 | Output Parsing | Structured Output | **[C]** extrair dado estruturado do texto gerado |
| 04 | Output Validation | Structured Output | **[C]** validar não exige parsing formal como prerequisite |
| 05 | Retry on Invalid Output | Output Validation | **[C]** **[R]** Architecture / Resilience Patterns / Retry — reprompt com o erro, não reenvio de rede. resources: harness |

---

## Story 07 · Embeddings — 6 Tasks · 5 arestas

`Requires` (Story): baseline.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Vector | — (root) | **[C]** conceito matemático geral. *sub:* Vector Dimension. **[≠]** ≠ "vector"/array (Programming Foundations) |
| 02 | Embedding | Vector | **[C]** um vetor que representa semântica de um dado |
| 03 | Embedding Model | Embedding | **[C]** quem produz embeddings |
| 04 | Embedding Space | Embedding | **[C]** o espaço multidimensional onde vivem |
| 05 | Semantic Similarity | Embedding Space | **[C]** proximidade no espaço ≈ similaridade semântica. **[R]** AI Evaluation / Evaluation Methods (colisão de nome, não `revisitOf`) |
| 06 | Similarity & Distance Metrics (Cosine / Dot Product / Euclidean) | Semantic Similarity | **[C]** **consolidação 3→1** |

---

## Story 08 · Vector Search — 6 Tasks · 6 arestas

`Requires` (Story): `Embeddings`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Vector Search | Embeddings / Embedding Space | **[C]** raiz. *sub:* Similarity Threshold, Top-K Retrieval |
| 02 | Nearest Neighbor Search (k-NN) | Vector Search | **[C]** **consolidação 2→1** (k-NN fundido) |
| 03 | Approximate Nearest Neighbor (ANN) | Nearest Neighbor Search (k-NN) | **[C]** contraste direto com o k-NN exato |
| 04 | Vector Index | Approximate Nearest Neighbor (ANN) | **[C]** a estrutura que viabiliza ANN em escala |
| 05 | HNSW | Vector Index | **[C]** algoritmo concreto. **[R]** Programming Foundations / Data Structures / Graph |
| 06 | Vector Database | Vector Index | **[C]** o produto. Pinecone/Weaviate/pgvector = exemplos |

---

## Story 09 · Chunking — 2 Tasks · 1 aresta

`Requires` (Story): baseline.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Chunking | — (root) | **[C]** raiz. *sub:* Chunk Size, Chunk Overlap |
| 02 | Chunking Strategies (Fixed-Size / Recursive / Semantic / Document Structure) | Chunking | **[C]** **consolidação 4→1**. Semantic Chunking = estratégia aqui (PENDENTE-3) |

---

## Story 10 · Retrieval — 7 Tasks · 4 arestas

`Requires` (Story): `Vector Search`, `Chunking`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Retrieval | — (root) | **[C]** operação geral de IR. **[≠]** ≠ RAG ≠ Grounding (Story 11) |
| 02 | Semantic Search | — (root) · **[R]** Vector Search / Vector Search | **[C]** "buscar por proximidade de significado" — Vector Search é uma implementação. *sub/alt-nome:* Dense Retrieval |
| 03 | Keyword Search | — (root) | **[C]** busca lexical autocontida (tipo grep). **[≠]** contraste com Semantic Search. *sub/alt-nome:* Sparse Retrieval |
| 04 | BM25 | Keyword Search | **[C]** algoritmo de ranking lexical específico |
| 05 | Hybrid Search | Semantic Search, Keyword Search | **[C]** combina os dois — síntese genuína |
| 06 | Metadata Filtering | — (root) · **[R]** Retrieval | **[C]** filtrar por metadado estruturado (tipo WHERE clause) |
| 07 | Reranking | Retrieval | **[C]** 2º estágio de refino — aplica-se a qualquer 1º estágio. *sub:* Cross-Encoder Reranking |

`Dense`/`Sparse Retrieval` = alt-nomes acadêmicos de `Semantic`/`Keyword Search`.
`Candidate Retrieval` absorvido como nota de `Reranking`.

---

## Story 11 · RAG — 7 Tasks · 6 arestas

`Requires` (Story): `Retrieval`, `Context Engineering`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Retrieval-Augmented Generation (RAG) | Retrieval / Retrieval | **[C]** **[≠]** ≠ Retrieval — a arquitetura que USA retrieval para aumentar geração |
| 02 | RAG Pipeline (Indexing / Retrieval / Generation) | Retrieval-Augmented Generation (RAG) | **[C]** **consolidação 4→1** |
| 03 | Query Transformation | Retrieval / Retrieval | **[C]** técnica de IR geral. *sub:* Query Expansion, Multi-Query Retrieval — **consolidação 3→1** |
| 04 | Grounding | — (root) · **[R]** Retrieval-Augmented Generation (RAG) | **[C]** **[≠]** conceito mais geral (aplica a tool outputs, doc fixo); RAG é só UMA via. Sem `revisitOf`/sinonímia com Faithfulness (PENDENTE-2) |
| 05 | Source Attribution | Grounding | **[C]** citar fontes — mecanismo concreto de demonstrar grounding |
| 06 | Retrieval Failure | Retrieval-Augmented Generation (RAG) | **[C]** falha semântica, distinta de falha de transporte |
| 07 | RAG Evaluation | Retrieval-Augmented Generation (RAG) | **[C]** framing — métricas concretas vivem em AI Evaluation (Story 19) |

---

## Story 12 · Tool Calling — 8 Tasks · 8 arestas

`Requires` (Story): `Structured Generation` **(preservada no nível de Story — PENDENTE-7)**.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Tool | — (root) | **[C]** capacidade que um sistema de IA pode invocar. Não agent-specific |
| 02 | Tool Calling | Tool · **[R]** Structured Generation / Structured Output | **[C]** a `Requires` de Story cobre Structured Generation; sem Task-edge artificial. *sub/alt-nome:* Function Calling |
| 03 | Tool Schema | Tool | **[C]** schema é insumo de Tool Calling, não o contrário (PENDENTE-8, sem reordenar). *sub:* Tool Arguments |
| 04 | Tool Selection | Tool Schema | **[C]** escolher entre tools dado seus schemas |
| 05 | Tool Result | Tool Calling | **[C]** o retorno da execução, realimentado ao modelo |
| 06 | Tool Error Handling | Tool Result | **[C]** *sub:* Tool Retry. **[R]** Architecture / Resilience Patterns |
| 07 | Tool Permissions | Tool | **[C]** **[R]** Platform / Authorization. Revisitada por AI Safety / Least Privilege for Tools (Story 20) |
| 08 | Tool Execution Loop | Tool Result, Tool Error Handling | **[C]** **[≠]** ≠ Agent Loop (Story 14) — loop mecânico de UMA chamada de tool |

---

## Story 13 · MCP — 5 Tasks · 5 arestas

`Requires` (Story): `Tool Calling` **(preservada no nível de Story — PENDENTE-7)**.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Model Context Protocol (MCP) | — (root) · **[R]** Tool Calling / Tool Schema | **[C]** protocolo padrão (não vendor). PENDENTE-11: root no Task DAG, `Tool Schema` = pointer/contexto, sem `Requires` p/ Agent Fundamentals ou Tool Calling. **[≠]** "Context" no nome ≠ Context Engineering |
| 02 | MCP Architecture (Host / Client / Server) | Model Context Protocol (MCP) | **[C]** **consolidação 3→1** — os 3 papéis |
| 03 | MCP Primitives (Tools / Resources / Prompts) | Model Context Protocol (MCP) | **[C]** **consolidação 3→1** — primitivas não exigem os 3 papéis |
| 04 | MCP Transport | MCP Architecture (Host / Client / Server) | **[C]** como Host/Client/Server comunicam (stdio, HTTP/SSE) |
| 05 | MCP vs API | Model Context Protocol (MCP), Platform / API Fundamentals / API | **[C]** comparação — desambigua confusão comum |

---

## Story 14 · Agent Fundamentals — 8 Tasks · 6 arestas

`Requires` (Story): `Tool Calling`, `Context Engineering`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Deterministic vs Agentic Workflow | — (root) · **[R]** Tool Calling / Tool Execution Loop | **[C]** framing — a fronteira central. PENDENTE-10: aceito como root |
| 02 | AI Agent | — (root) · **[R]** Deterministic vs Agentic Workflow | **[C]** Agent é definível diretamente; a moldura é pedagógica |
| 03 | Agent vs LLM | AI Agent | **[C]** agente = LLM + tools + loop + autonomia. **[R]** AI Fundamentals / AI System |
| 04 | Agentic System | AI Fundamentals / AI System, AI Agent | **[C]** **NOVA Task** (PENDENTE-1). Distingue `AI System` ≠ `Agentic System` ≠ `Agentic Workflow` |
| 05 | Agentic Workflow | Agentic System | **[C]** fluxo executado por/dentro do sistema agentic. resources: harness |
| 06 | Agent Loop | Agentic Workflow · **[R]** Tool Calling / Tool Execution Loop | **[C]** **consolidação 5→1** (Planning/Acting/Observation/Reflection). **[≠]** ≠ Tool Execution Loop |
| 07 | ReAct | Agent Loop | **[C]** padrão nomeado — instância do Agent Loop |
| 08 | Human-in-the-Loop (HITL) | — (root) · **[R]** Agent Loop | **[C]** mecanismo de controle no loop. PENDENTE-10: aceito como root. Revisitado por AI Safety / Human Approval (Story 20) |

---

## Story 15 · Agent Orchestration — 5 Tasks · 3 arestas

`Requires` (Story): `Agent Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Orchestration (Workflow) | — (root) · **[R]** Agent Fundamentals / Agent Loop | **[C]** "Orchestration" e "Workflow" fundidos. Explicável com vocabulário genérico de "passos" |
| 02 | Router | Orchestration (Workflow) | **[C]** direciona execução para caminhos/agentes diferentes |
| 03 | Workflow Composition (Sequential / Parallel / Conditional) | Orchestration (Workflow) | **[C]** **consolidação 3→1** |
| 04 | Agent State | — (root) · **[R]** Orchestration (Workflow) | **[C]** rastrear estado ao longo do workflow — autocontido |
| 05 | Agent Termination | Agent State | **[C]** quando parar — depende de avaliar o estado |

`Handoff` **removida desta Story** — lar canônico único = `Agent Handoff`
(Multi-Agent Systems, Story 17).

---

## Story 16 · AI Memory — 6 Tasks · 7 arestas

`Requires` (Story): `Agent Fundamentals`, `Context Engineering`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Agent Memory | Agent Fundamentals / AI Agent | **[C]** raiz |
| 02 | Memory vs Context | Agent Memory, Context Engineering / Context | **[C]** **[≠]** memory persistida entre sessões × context da janela atual |
| 03 | Short-Term vs Long-Term Memory | Agent Memory | **[C]** **consolidação 2→1** — distinção autocontida |
| 04 | Memory Types (Conversation / Semantic / Episodic) | Short-Term vs Long-Term Memory | **[C]** **consolidação 3→1** |
| 05 | Memory Retrieval | Agent Memory · **[R]** Vector Search / Retrieval | **[C]** recuperar não exige a taxonomia completa de tipos |
| 06 | Memory Consolidation | Agent Memory | **[C]** resumir/compactar memória — operação irmã, não dependente de retrieval |

---

## Story 17 · Multi-Agent Systems — 8 Tasks · 8 arestas

`Requires` (Story): `Agent Orchestration`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Multi-Agent System | Agent Orchestration / Orchestration (Workflow) | **[C]** raiz |
| 02 | Agent Coordination | Multi-Agent System | **[C]** o problema geral — framing antes dos mecanismos |
| 03 | Agent Role | Multi-Agent System | **[C]** o que cada agente se especializa em |
| 04 | Agent Communication | Multi-Agent System | **[C]** como agentes trocam informação |
| 05 | Agent Delegation | Agent Communication | **[C]** delegar trabalho exige canal de comunicação |
| 06 | Agent Handoff | Agent Delegation | **[C]** **lar canônico único** (absorve a `Handoff` removida da Story 15) |
| 07 | Supervisor Pattern | Agent Delegation | **[C]** padrão nomeado — um agente supervisiona/delega |
| 08 | Multi-Agent Trade-offs | Agent Coordination | **[C]** capstone — pesa o problema geral, não um padrão específico |

---

## Story 18 · Model Routing — 5 Tasks · 4 arestas

`Requires` (Story): `Model Inference`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Model Router | Model Inference | **[C]** raiz |
| 02 | Static vs Dynamic Routing | Model Router | **[C]** **consolidação 2→1** |
| 03 | Routing Criteria (Capability / Cost / Latency) | Model Router | **[C]** **consolidação 3→1** — critério independe do modo. **[R]** Platform / Performance Engineering / Latency |
| 04 | Model Fallback | Model Router | **[C]** canônico aqui — Production AI (Story 23) revisita (`revisitOf` intra-Epic). **[R]** Architecture / Resilience Patterns |
| 05 | Multi-Provider Architecture | — (root) · **[R]** Model Fallback / Model Router | **[C]** suportar múltiplos provedores é pré-condição do fallback entre eles. Nomes de provedores = exemplos |

---

## Story 19 · AI Evaluation — 7 Tasks · 6 arestas

`Requires` (Story): `RAG`, `Agent Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Evaluation (Evals) | — (root) | **[C]** **[R]** Testing & Quality Engineering / Testing Fundamentals |
| 02 | Evaluation Dataset | Evaluation (Evals) | **[C]** *sub:* Golden Dataset |
| 03 | Offline vs Online Evaluation | Evaluation (Evals) | **[C]** **consolidação 2→1** — online eval frequentemente nem usa dataset fixo. **[R]** Testing / Testing Strategy |
| 04 | Evaluation Methods (Human / LLM-as-a-Judge / Pairwise / Exact Match / Semantic Similarity) | Evaluation (Evals) | **[C]** **consolidação 5→1**. **[≠]** Semantic Similarity aqui = aplicação de Embeddings / Semantic Similarity (Story 07) |
| 05 | Retrieval Precision & Recall | Evaluation Dataset | **[C]** **consolidação 2→1** — métricas clássicas de IR. **[R]** RAG / RAG Evaluation |
| 06 | Faithfulness & Answer Relevance | Evaluation (Evals) | **[C]** **consolidação 2→1** — mede qualidade de geração. **[R]** RAG / Grounding. Sem `revisitOf`/sinonímia com Grounding (PENDENTE-2) |
| 07 | Regression Evaluation | Evaluation Methods (…) | **[C]** **[R]** Testing & Quality Engineering / Testing Strategy / Regression Testing — pointer já FROZEN no Epic 02 |

---

## Story 20 · AI Safety & Guardrails — 11 Tasks · 8 arestas

`Requires` (Story): `Tool Calling`, `RAG`, `Agent Fundamentals`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Guardrails | — (root) | **[C]** raiz. resources: harness |
| 02 | Input vs Output Guardrails | Guardrails | **[C]** **consolidação 2→1**. resources: harness |
| 03 | Hallucination | — (root) · **[R]** RAG / Grounding | **[C]** autoexplicável sem o conceito de Grounding |
| 04 | Prompt Injection | Guardrails | **[C]** **[R]** Platform / Application Security — entrada não confiável tratada como instrução |
| 05 | Indirect Prompt Injection | Prompt Injection | **[C]** variante via conteúdo recuperado/de tool. **[R]** RAG |
| 06 | Jailbreak | Guardrails | **[C]** **[≠]** ≠ Prompt Injection — contornar o alinhamento do próprio modelo |
| 07 | Data Leakage | Guardrails | **[C]** vazamento de dado de treino/contexto sensível na saída |
| 08 | PII Handling | — (root) · **[R]** Data Leakage · Platform / Application Security | **[C]** tipo específico de vazamento |
| 09 | Tool Abuse | Tool Calling / Tool Permissions · **[R]** Jailbreak | **[C]** agente manipulado a usar mal suas tools — pode ocorrer sem jailbreak |
| 10 | Least Privilege for Tools | Tool Calling / Tool Permissions | **[Rev→ Platform / Authorization / Principle of Least Privilege]** — mesmo padrão de Cloud Security / Least Privilege in Cloud (Epic 05); a `revisitOf` já é a estrutura |
| 11 | Human Approval | Agent Fundamentals / Human-in-the-Loop (HITL) | **[C]** revisita HITL com framing de segurança — defesas complementares/independentes de Least Privilege. resources: harness |

---

## Story 21 · Model Adaptation — 6 Tasks · 5 arestas

`Requires` (Story): `AI Fundamentals`, `RAG`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | Fine-Tuning | AI Fundamentals / Training | **[C]** raiz — forma/continuação de Training |
| 02 | Supervised Fine-Tuning (SFT) / Instruction Tuning | Fine-Tuning | **[C]** **consolidação 2→1** |
| 03 | PEFT (LoRA) | Fine-Tuning | **[C]** **consolidação 2→1** — eficiência é técnica geral sobre fine-tuning |
| 04 | Distillation | — (root) · **[R]** Fine-Tuning | **[C]** treinar modelo menor para imitar um maior — categoria diferente, não subtipo |
| 05 | Quantization | — (root) | **[C]** **[≠]** compressão/eficiência, ortogonal a fine-tuning |
| 06 | RAG vs Fine-Tuning | RAG / Retrieval-Augmented Generation (RAG), Fine-Tuning | **[C]** capstone comparativo |

---

## Story 22 · AI Observability — 7 Tasks · 5 arestas

`Requires` (Story): `Platform / Observability`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | LLM Tracing | Platform / Observability / Distributed Tracing (Span / trace context) | **[C]** distributed tracing aplicado a cadeias de chamada de LLM (PENDENTE-6: `Requires` genuíno, não `revisitOf`) |
| 02 | Prompt Logging | Platform / Observability / Structured Logging | **[C]** structured logging aplicado a prompts — técnica paralela ao tracing |
| 03 | Token Usage | — (root) · **[R]** Language Models / Token | **[C]** métrica simples — não exige o mecanismo de tracing |
| 04 | Cost Tracking | Token Usage | **[C]** custo = tokens × preço |
| 05 | Latency Tracking | Platform / Performance Engineering / Latency | **[C]** canônico lá; aqui é o ponto de medição específico de IA |
| 06 | Tool & Retrieval Tracing | LLM Tracing | **[C]** **consolidação 2→1** — 2 especializações do tracing |
| 07 | Failure Analysis | — (root) · **[R]** Tool & Retrieval Tracing, Prompt Logging, Testing / Debugging / Root Cause Analysis, Platform / Reliability Engineering / Postmortem (Blameless) | **[C]** capstone — sem prerequisite conceitual (ajustes finais 1 e 2) |

---

## Story 23 · Production AI — 13 Tasks · 9 arestas

`Requires` (Story): `AI Evaluation`, `AI Observability`, `Architecture / Resilience Patterns`.

| # | Task | Requires | Notas |
|---|---|---|---|
| 01 | AI System Reliability | AI Fundamentals / AI System | **[C]** raiz/framing |
| 02 | Model Latency | Platform / Performance Engineering / Latency | **[C]** profundidade nova (batching, tamanho de modelo) — explicável sem a moldura de "reliability" |
| 03 | Time to First Token (TTFT) | Model Latency | **[C]** métrica de streaming, sem equivalente em Platform. **[R]** Model Inference / Streaming |
| 04 | Token Throughput | Platform / Performance Engineering / Throughput · **[R]** AI Observability / Token Usage | **[C]** ajuste final 3 — família de métrica diferente (taxa, não atraso); Token Usage vira pointer/contexto |
| 05 | Model Cost | AI Observability / Cost Tracking | **[C]** gestão de custo em produção, sobre o tracking já estabelecido |
| 06 | Token Budget | Model Cost | **[C]** **[≠]** ≠ Context Budget (Story 05) — limite ECONÔMICO × limite de CAPACIDADE |
| 07 | Caching LLM Responses (Semantic Cache) | Platform / Caching / Cache | **[Rev→ Platform / Caching / Cache]** — cache por similaridade semântica; consolida com o alvo estrutural do `revisitOf` |
| 08 | Rate Limiting | — (root) | **[Rev→ Platform / API Fundamentals / Rate Limiting]** — controle de custo/quota de chamadas de LLM |
| 09 | Model Fallback | — (root) | **[Rev→ Model Routing / Model Fallback]** — revisita intra-Epic (mesmo padrão de `GraphQL / N+1 in Resolvers`) |
| 10 | Retry Strategy | — (root) | **[Rev→ Architecture / Resilience Patterns / Retry]** — aplicação em produção de IA |
| 11 | Model Versioning | — (root) | **[C]** canônico — sem lar anterior. `Prompt Versioning` **não** ganha Task própria aqui (canônico em Story 04, citado por pointer) |
| 12 | Evaluation in CI/CD | AI Evaluation / Regression Evaluation | **[C]** **[R]** Platform / CI-CD / CI/CD Pipeline — gate de deploy por qualidade de IA |
| 13 | AI System Monitoring | AI Observability / Failure Analysis | **[C]** capstone final — pré-deploy (gate) × pós-deploy (monitoramento) são preocupações paralelas. **[R]** Platform / Reliability Engineering |

---

## Conceitos canônicos que a Epic 07 passa a "possuir"

| Conceito | Story dona |
|---|---|
| AI, AI System, Machine Learning, AI Model, Training, Inference, Parameters | 01 AI Fundamentals |
| Language Model, LLM, Token, Tokenization, Attention, Transformer, Context Window, Next-Token Prediction, Autoregressive Generation | 02 Language Models |
| Deterministic vs Stochastic Output, Temperature, Top-P/Top-K, Stopping Conditions, Streaming, Seed | 03 Model Inference |
| Prompt, System/User Prompt, Instruction Hierarchy, Zero/Few-Shot, In-Context Learning, Prompt Template, **Structured Prompting**, Prompt Chaining, Prompt Versioning | 04 Prompt Engineering |
| Context, Context Engineering, Assembly, Ordering, Compression, Budget, Overflow, Rot | 05 Context Engineering |
| Structured Output, Schema-Constrained Generation, Output Parsing, Output Validation, Retry on Invalid Output | 06 Structured Generation |
| Vector, Embedding, Embedding Model/Space, Semantic Similarity, Similarity & Distance Metrics | 07 Embeddings |
| Vector Search, k-NN, ANN, Vector Index, HNSW, Vector Database | 08 Vector Search |
| Chunking, Chunking Strategies | 09 Chunking |
| Retrieval, Semantic Search, Keyword Search, BM25, Hybrid Search, Metadata Filtering, Reranking | 10 Retrieval |
| RAG, RAG Pipeline, Query Transformation, **Grounding**, Source Attribution, Retrieval Failure, RAG Evaluation | 11 RAG |
| Tool, Tool Calling, Tool Schema, Tool Selection, Tool Result, Tool Error Handling, Tool Permissions, Tool Execution Loop | 12 Tool Calling |
| MCP, MCP Architecture, MCP Primitives, MCP Transport, MCP vs API | 13 MCP |
| Deterministic vs Agentic Workflow, AI Agent, Agent vs LLM, **Agentic System**, Agentic Workflow, Agent Loop, ReAct, HITL | 14 Agent Fundamentals |
| Orchestration, Router, Workflow Composition, Agent State, Agent Termination | 15 Agent Orchestration |
| Agent Memory, Memory vs Context, Short/Long-Term Memory, Memory Types, Memory Retrieval, Memory Consolidation | 16 AI Memory |
| Multi-Agent System, Agent Coordination/Role/Communication/Delegation, **Agent Handoff**, Supervisor Pattern, Multi-Agent Trade-offs | 17 Multi-Agent Systems |
| Model Router, Static vs Dynamic Routing, Routing Criteria, **Model Fallback**, Multi-Provider Architecture | 18 Model Routing |
| Evaluation, Evaluation Dataset, Offline vs Online, Evaluation Methods, Retrieval Precision & Recall, Faithfulness & Answer Relevance, Regression Evaluation | 19 AI Evaluation |
| Guardrails, Input/Output Guardrails, Hallucination, Prompt Injection (+ Indirect), Jailbreak, Data Leakage, PII Handling, Tool Abuse, Human Approval | 20 AI Safety & Guardrails |
| Fine-Tuning, SFT/Instruction Tuning, PEFT (LoRA), Distillation, Quantization, RAG vs Fine-Tuning | 21 Model Adaptation |
| LLM Tracing, Prompt Logging, Token Usage, Cost Tracking, Latency Tracking, Tool & Retrieval Tracing, Failure Analysis | 22 AI Observability |
| AI System Reliability, Model Latency, TTFT, Token Throughput, Model Cost, Token Budget, Model Versioning, Evaluation in CI/CD, AI System Monitoring | 23 Production AI |

**`canonical: false` + `revisitOf` (5 Tasks):**

| Task | `revisitOf` |
|---|---|
| 20 AI Safety & Guardrails / Least Privilege for Tools | Platform / Authorization / Principle of Least Privilege |
| 23 Production AI / Caching LLM Responses (Semantic Cache) | Platform / Caching / Cache |
| 23 Production AI / Rate Limiting | Platform / API Fundamentals / Rate Limiting |
| 23 Production AI / Retry Strategy | Architecture / Resilience Patterns / Retry |
| 23 Production AI / Model Fallback | Model Routing / Model Fallback *(intra-Epic)* |

Distribuição: **3 Platform + 1 Architecture + 1 intra-Epic 07 backward** = 5.

### Revisitas que entram na Epic 07 (dos Epics 01–06, já aprovados)

| Conceito canônico | Onde é revisitado aqui | Tipo |
|---|---|---|
| Platform / Web Fundamentals / Server-Sent Events (SSE) | Model Inference / Streaming | `[R]` (pointer já FROZEN do lado de Platform) |
| Platform / Performance Engineering / Latency | AI Observability / Latency Tracking; Production AI / Model Latency | `Requires` |
| Platform / Performance Engineering / Latency | Model Routing / Routing Criteria | `[R]` |
| Platform / Performance Engineering / Throughput | Production AI / Token Throughput | `Requires` |
| Platform / Observability / Distributed Tracing (Span / trace context) | AI Observability / LLM Tracing | `Requires` |
| Platform / Observability / Structured Logging | AI Observability / Prompt Logging | `Requires` |
| Platform / Caching / Cache | Production AI / Caching LLM Responses | `Requires` + `revisitOf` |
| Platform / API Fundamentals / Rate Limiting | Production AI / Rate Limiting | `revisitOf` |
| Platform / API Fundamentals / API | MCP / MCP vs API | `Requires` |
| Platform / Authorization / Principle of Least Privilege | AI Safety / Least Privilege for Tools | `revisitOf` |
| Platform / Authorization | Tool Calling / Tool Permissions; Agent Fundamentals / Agent vs LLM | `[R]` |
| Platform / Application Security | AI Safety / Prompt Injection, PII Handling | `[R]` |
| Platform / CI-CD / CI/CD Pipeline | Production AI / Evaluation in CI/CD | `[R]` |
| Platform / Reliability Engineering | Production AI / AI System Monitoring; AI Observability / Failure Analysis | `[R]` |
| Testing & Quality Engineering / Testing Fundamentals, Testing Strategy | AI Evaluation / Evaluation, Offline vs Online Evaluation | `[R]` |
| Testing & Quality Engineering / Testing Strategy / Regression Testing | AI Evaluation / Regression Evaluation | `[R]` (pointer já FROZEN do lado do Epic 02) |
| Testing & Quality Engineering / Debugging / Root Cause Analysis | AI Observability / Failure Analysis | `[R]` |
| Architecture / Resilience Patterns / Retry | Production AI / Retry Strategy | `revisitOf` |
| Architecture / Resilience Patterns | Tool Calling / Tool Error Handling; Structured Generation / Retry on Invalid Output | `[R]` |
| Programming Foundations / Data Structures / Graph | Vector Search / HNSW | `[R]` |

Intra-Epic 07: `Language Models / Context Window` → `Context Engineering /
Context Budget` (`Requires`) e `/ Context Rot` (`[R]`) · `Language Models /
Token` → `AI Observability / Token Usage` (`[R]`) · `Model Inference / Streaming`
→ `Production AI / TTFT` (`[R]`) · `Model Routing / Model Fallback` → `Production
AI / Model Fallback` (`revisitOf`) · `Agent Fundamentals / HITL` → `AI Safety /
Human Approval` (`Requires`) · `Tool Calling / Tool Permissions` → `AI Safety /
Tool Abuse`, `Least Privilege for Tools` (`Requires`) · `Embeddings / Semantic
Similarity` → `AI Evaluation / Evaluation Methods` (`[R]`, colisão de nome) ·
`Prompt Engineering / Prompt Versioning` → `Production AI / Model Versioning`
(`[R]`, citado sem 2ª Task).

---

## Colisões de nome a desambiguar

| A | B | Distinção |
|---|---|---|
| `AI System` (Story 01) | `AI Model` (Story 01) | sistema de engenharia completo × artefato (arquitetura + parâmetros) |
| `AI` (disciplina/campo) | `AI System` (Story 01) | disciplina × instância concreta construída |
| `Language Model` (Story 02) | `AI Model` (Story 01) | especialização em texto × conceito geral |
| `Retrieval` (Story 10) | `RAG` (Story 11) | mecanismo de IR genérico × arquitetura que o usa para aumentar geração |
| `Retrieval` (Story 10) | `Grounding` (Story 11) | operação × propriedade/objetivo |
| `Grounding` (Story 11) | `Faithfulness & Answer Relevance` (Story 19) | propriedade × métrica mensurável — **conceitos distintos, sem `revisitOf`/sinonímia** (PENDENTE-2) |
| `Semantic Search` (Story 10) | `Semantic Similarity` (Story 07) | aplicação de busca × conceito matemático de base |
| `Evaluation Methods / Semantic Similarity` (Story 19) | `Semantic Similarity` (Story 07) | aplicação como método de avaliação × conceito canônico |
| `Dense/Sparse Retrieval` | `Semantic/Keyword Search` | mesmo conceito, vocabulário acadêmico × aplicado — consolidados |
| `Tool Execution Loop` (Story 12) | `Agent Loop` (Story 14) | loop mecânico de 1 tool call × ciclo plan-act-observe-reflect mais amplo |
| `Tool Calling` (Story 12) | `Function Calling` | mesmo conceito, nomenclatura por vendor — consolidados |
| `MCP` "context" | `Context Engineering` (Story 05) | recursos/tools expostos × janela de prompt |
| `Context Budget` (Story 05) | `Token Budget` (Story 23) | limite de capacidade (o que cabe) × limite econômico (quanto gastar) |
| `Prompt Injection` (Story 20) | `Jailbreak` (Story 20) | conteúdo externo tratado como instrução × contornar alinhamento do próprio modelo |
| `Structured Prompting` (Story 04) | `Schema-Constrained Generation` (Story 06) | soft (pedir formato via instrução) × hard (decodificação restrita por gramática/schema) |
| `Prompt Chaining` (Story 04) | `Workflow Composition / Sequential` (Story 15) | encadear chamadas de LLM sem ser agentic × padrão de orquestração de agentes |
| `Quantization` (Story 21) | `Fine-Tuning`/PEFT (Story 21) | compressão/eficiência × adaptação de comportamento — ortogonais |
| `Model Fallback` (Story 18, canônico) | `Model Fallback` (Story 23, `revisitOf`) | revisita intra-Epic — mesmo padrão de `N+1 in Resolvers` no Epic 05 |
| `AI System` (Story 01) | `Agentic System` (Story 14) | sistema de engenharia genérico × especialização composta de agentes |
| `Agentic System` (Story 14) | `Agentic Workflow` (Story 14) | o sistema × o fluxo que roda dentro dele |
| `Vector` (Story 07) | "vector"/array (Programming Foundations) | conceito matemático × estrutura de dados com nome similar |
| `Consistency`/`Consensus` etc. dos Epics 01–06 | — | nenhum conceito FROZEN foi recriado aqui |

---

## Consolidações registradas (todas)

**Umbrella 3→1 ou mais:** Cosine/Dot Product/Euclidean → Similarity & Distance
Metrics · Fixed-Size/Recursive/Semantic/Document Structure Chunking → Chunking
Strategies (4→1) · RAG Pipeline + Indexing + Retrieval + Generation → RAG
Pipeline (4→1) · Query Expansion + Multi-Query Retrieval → subs de Query
Transformation · MCP Host/Client/Server → MCP Architecture · MCP
Tools/Resources/Prompts → MCP Primitives · Sequential/Parallel/Conditional →
Workflow Composition · Conversation/Semantic/Episodic → Memory Types ·
Human/LLM-as-a-Judge/Pairwise/Exact Match/Semantic Similarity → Evaluation
Methods (5→1) · Agent Loop + Planning + Acting + Observation + Reflection → Agent
Loop (5→1) · Routing por Capability/Cost/Latency → Routing Criteria (3→1).

**Par 2→1:** Top-P + Top-K → Top-P/Top-K Sampling · Max Output Tokens + Stop
Sequence → Stopping Conditions · System Prompt + User Prompt → System Prompt vs
User Prompt · Zero-Shot + Few-Shot → Zero-Shot vs Few-Shot Prompting · k-NN
fundido em Nearest Neighbor Search · Retrieval Precision + Recall → Retrieval
Precision & Recall · Faithfulness + Answer Relevance → Faithfulness & Answer
Relevance · Offline + Online Evaluation → Offline vs Online Evaluation · Static +
Dynamic Routing → Static vs Dynamic Routing · SFT + Instruction Tuning → 1 Task ·
Short-Term + Long-Term Memory → Short-Term vs Long-Term Memory · Input + Output
Guardrails → Input vs Output Guardrails · Tool Call Tracing + Retrieval Tracing →
Tool & Retrieval Tracing · Caching LLM Responses + Semantic Cache → 1 Task ·
Orchestration + Workflow → 1 Task.

**Absorção como subtopic/alt-nome:** Deep Learning (→ ML) · Model Architecture (→
AI Model) · Vocabulary (→ Tokenization) · Self-Attention (→ Attention) · Vector
Dimension (→ Vector) · Similarity Threshold + Top-K Retrieval (→ Vector Search) ·
Dense Retrieval (→ alt-nome de Semantic Search) · Sparse Retrieval (→ alt-nome de
Keyword Search) · Candidate Retrieval (→ nota em Reranking) · Cross-Encoder
Reranking (→ sub de Reranking) · Function Calling (→ alt-nome de Tool Calling) ·
Tool Arguments (→ sub de Tool Schema) · Tool Retry (→ sub de Tool Error
Handling) · LoRA (→ sub de PEFT) · Context Selection (→ sub de Context Assembly) ·
Long Context (→ sub de Context Rot) · JSON Output (→ sub de Structured Output) ·
Golden Dataset (→ sub de Evaluation Dataset) · Chunk Size + Chunk Overlap (→ subs
de Chunking).

**Removidas/relocadas (decisão de ownership):** `Handoff` (Agent Orchestration)
removida — lar canônico único = `Agent Handoff` (Multi-Agent Systems) ·
`Structured Prompting` **relocada** de subtopic de `Structured Output` (Story 06)
para **Task própria** em `Prompt Engineering` (Story 04) · `Prompt Versioning`
**não** ganha 2ª Task em Production AI.

---

## Auditoria de `Requires` de Task — resultado consolidado

Teste literal aplicado a cada aresta: *"é impossível ou inadequado compreender B
sem já compreender A?"* Removida de `Requires` toda relação que representava só
sequência pedagógica, associação comum, motivação, implementação frequente,
comparação/contraste ou conhecimento útil-mas-não-necessário — preservada como
pointer `[R]` quando fizesse sentido.

| | |
|---|---|
| Arestas de `Requires` de Task na árvore rodada-2 | **160** |
| **REMOVE** | **30** |
| **REPOINT** (trocam o alvo, não a contagem) | **32** |
| **KEEP** | **98** |
| **Arestas de `Requires` de Task FINAIS** | **130** |

Cálculo direto (não `160 − REMOVE` cego): 30 REMOVE removem 30 arestas; os 32
REPOINT preservam a aresta trocando o alvo para uma Task de posição igual ou
anterior, uma root de Story, ou um Epic externo FROZEN. `160 − 30 = 130`,
confirmado pela soma das arestas por Story (tabela abaixo).

| Story | Arestas | Story | Arestas | Story | Arestas |
|---|---|---|---|---|---|
| 01 | 5 | 09 | 1 | 17 | 8 |
| 02 | 7 | 10 | 4 | 18 | 4 |
| 03 | 4 | 11 | 6 | 19 | 6 |
| 04 | 7 | 12 | 8 | 20 | 8 |
| 05 | 7 | 13 | 5 | 21 | 5 |
| 06 | 4 | 14 | 6 | 22 | 5 |
| 07 | 5 | 15 | 3 | 23 | 9 |
| 08 | 6 | 16 | 7 | **TOTAL** | **130** |

**Dependências invertidas encontradas (2), ambas resolvidas sem reordenar
numeração (PENDENTE-8):**
- `Tool Schema ← Tool Calling` → REPOINT `Tool Schema ← Tool`.
- `Multi-Provider Architecture ← Model Fallback` → REMOVE (vira root com pointer).

**Roots do Task DAG (39):** S01 AI, Inference · S02 Token, Attention · S03
Stopping Conditions, Streaming · S04 Prompt, In-Context Learning · S05 Context ·
S06 Structured Output · S07 Vector · S09 Chunking · S10 Retrieval, Semantic
Search, Keyword Search, Metadata Filtering · S11 Grounding · S12 Tool · S13 MCP ·
S14 Deterministic vs Agentic Workflow, AI Agent, HITL · S15 Orchestration, Agent
State · S18 Multi-Provider Architecture · S19 Evaluation (Evals) · S20
Guardrails, Hallucination, PII Handling · S21 Distillation, Quantization · S22
Token Usage, Failure Analysis · S23 Rate Limiting, Model Fallback, Retry
Strategy, Model Versioning. Stories sem root próprio: S08, S16, S17 (a raiz da
Story tem `Requires` cross-Story). Múltiplas roots por Story são aceitas
(PENDENTE-9/10/11).

---

## Auditoria de ciclos e forward dependencies (validada em `data/roadmap.js`)

- **Grafo de `Requires` de Story:** DAG, idêntico à macro aprovada — toda `Requires`
  de Story aponta para Story de número menor no próprio Epic, ou para Epic externo
  FROZEN (01, 02, 05, 06). **Zero ciclos, zero forward references, zero
  dependências para Epic posterior** (o Epic 07 é o último).
- **Grafo de `Requires` de Task:** 130 arestas. Verificado por script (ordem
  topológica): **zero ciclos, zero forward references.** Todos os 32 REPOINT
  movem o alvo para Task de posição igual/anterior, root de Story, ou Epic
  externo FROZEN.
- **`revisitOf` (5):** 3 para Platform (Epic 05 FROZEN), 1 para Architecture (Epic
  06 FROZEN), 1 intra-Epic 07 backward (Story 23 → Story 18). Nenhuma para a
  frente.
- **Ownership dos Epics 01–06:** intacto — nenhum conceito FROZEN movido,
  renomeado ou recriado; todas as revisitas entram como `[R]` ou `revisitOf`.

---

## Sugestões que ficaram fora (`SUGESTÃO`, não incorporadas)

| Sugestão | Motivo de ficar fora |
|---|---|
| Story `Responsible AI & Governance` (bias, fairness, governança de dados) | já era `SUGESTÃO` na Fase 1 — macro preservada |
| Story `LLM Cost Engineering` (prompt caching, batching, model sizing) | já era `SUGESTÃO` na Fase 1 — conteúdo já parcialmente coberto por Production AI |
| Tasks próprias para produtos/vendors (OpenAI, Anthropic, Gemini, Vertex AI, Bedrock, LangChain, LlamaIndex) | ficam como exemplos/menções em notas, nunca Tasks |
| `AI Gateway` como Task própria | mencionável como exemplo em `Multi-Provider Architecture` (Story 18) |
| `Skills` (conceito de "skill" reutilizável, distinto de Tool) | não estava no rascunho original nem na macro aprovada |
| Separar `Cost-Based Routing` como Task própria | consolidado em `Routing Criteria` |

*SUGESTÃO de Story:* nenhuma nova — as 23 Stories da macro já cobrem o escopo
clássico de AI Engineering ponta-a-ponta.

---

## Decisões aprovadas (Fase 2 · Epic 07)

| PENDENTE | Resolução |
|---|---|
| 1 | `Agentic System` = **Task própria** em Story 14 (distingue `AI System` ≠ `Agentic System` ≠ `Agentic Workflow`). +1 Task. |
| 2 | `Grounding` (Story 11) e `Faithfulness & Answer Relevance` (Story 19) permanecem conceitos distintos, sem sinonímia nem `revisitOf` entre si. |
| 3 | `Chunking` mantém 2 Tasks; `Semantic Chunking` = estratégia. |
| 4 / 12 | `Structured Prompting` = **Task própria** em Prompt Engineering (Story 04), não subtopic de `Structured Output`. Total 161 Tasks. |
| 5 | `MCP` não `Requires: Agent Fundamentals`, não pressupõe arquitetura agentic. |
| 6 | `AI Observability` (Story 22) 100% `canonical: true`; Platform/Observability = `Requires`/pointer, nunca `revisitOf` formal. |
| 7 | `Requires` de Story `Tool Calling → Structured Generation` e `MCP → Tool Calling` preservados; sem `Requires` de Task artificiais para espelhá-los. |
| 8 | `Tool Schema → Requires: Tool` preservado; inversões resolvidas sem reordenar numeração. |
| 9 | Composição de AI Evaluation / AI Safety não reaberta pela contagem KEEP/REMOVE; múltiplas Tasks root válidas; sem dependências cosméticas. |
| 10 | `Deterministic vs Agentic Workflow` e `HITL` aceitos como roots. |
| 11 | `MCP` permanece root no Task DAG; `Tool Schema` = pointer/contexto. |
| Ajuste final 1 | `Failure Analysis ← Tool & Retrieval Tracing` → REMOVE. |
| Ajuste final 2 | `Failure Analysis ← Prompt Logging` → REMOVE. |
| Ajuste final 3 | `Token Throughput ← Token Usage` substituída por `Token Throughput → Requires: Platform / Performance Engineering / Throughput`; Token Usage = pointer/contexto. |

Nenhuma pendência remanescente.

---

## Mudanças não silenciosas

### vs macro da Fase 1 (`00-overview.md`)

**Nenhuma.** As 23 Stories, seus nomes, sua ordem e suas `Requires` de Story
foram preservados literalmente. Os pointers já FROZEN nos Epics 02 e 05 que
apontavam para este Epic (`Testing & Quality / Regression Testing → Regression
Evaluation`; `Platform / Web Fundamentals / SSE → Model Inference / Streaming`)
foram confirmados e usados exatamente com os nomes de Story/Task esperados.

### vs o rascunho não aprovado (`ai-engineering.md`)

Estrutural — registrado por transparência: 66 Tasks a menos (227 candidatas →
161) via consolidações extensas; `Handoff` consolidada num único lar canônico
(Story 17); `Structured Prompting` como Task própria em Prompt Engineering (não
Structured Generation); `Agentic System` promovida a Task própria; refinamento do
grafo de `Requires` (160 → 130 arestas via ORDER ≠ REQUIRES).

---

## Próximo passo

**Aprovação final (FROZEN) registrada em 2026-09-08.** Consolidação nesta rodada:
- `roadmap/07-ai-engineering.md` criado (este arquivo);
- `roadmap/00-overview.md` atualizado (seção `07 · AI Engineering`, tabela de
  progresso da Fase 2, dependências de alto nível, conceitos transversais,
  navegabilidade da Fase 3 até o Epic 07);
- `PLAN.md` atualizado (Histórico, tabela de Fases, total global);
- `data/roadmap.js` atualizado — Epic 07 passa de `status: "structuring"` /
  `plannedStories` para navegável, com as 23 Stories e 161 Tasks.

A Fase 2 do roadmap está **completa** (Epics 01–07). Nenhum Epic pendente.
