import { area, module, concept } from "../builders.js";

export default area({
  slug: "ai-engineering",
  order: 70,
  title: "AI Engineering",
  color: "#D96BA9",
  phase: "Fase 2 concluída (2026-09-08) — FINAL/FROZEN",
  summary:
    "A especialização: LLMs, prompting, context engineering, embeddings, retrieval, RAG, tool calling, " +
    "MCP, agentes, memória, multi-agente, roteamento, avaliação, safety, observabilidade e produção. " +
    "Decks harness e ai-fundamentals entram como resources. Requires Platform; Production AI Requires " +
    "Architecture / Resilience Patterns.",
  modules: [
    module({
      slug: "ai-fundamentals",
      order: 10,
      title: "AI Fundamentals",
      summary:
        "IA (raiz) → AI System (o que construímos) → ML (como aprendemos) → AI Model (o artefato) → " +
        "Training → Inference (contraste) → Parameters. Deep Learning e Model Architecture viram subtopic.",
      concepts: [
        concept({ order: 10, title: "Artificial Intelligence (AI)", note: "raiz — sistemas que exibem comportamento tipicamente associado à inteligência", resources: [{ type: "deck", deckId: "ai-fundamentals" }] }),
        concept({ order: 20, title: "AI System", requires: ["Artificial Intelligence (AI)"], collision: "≠ AI Model — o sistema de engenharia completo (APIs, dados, guardrails) que usa 1+ modelos, não o modelo em si" }),
        concept({ order: 30, title: "Machine Learning (ML)", requires: ["Artificial Intelligence (AI)"], subtopics: ["Deep Learning (ML baseado em redes neurais)"], note: "subcampo — aprender padrões a partir de dados" }),
        concept({ order: 40, title: "AI Model", requires: ["Machine Learning (ML)"], subtopics: ["Model Architecture"], collision: "≠ AI System — o artefato (arquitetura + parâmetros) produzido pelo treino" }),
        concept({ order: 50, title: "Training", requires: ["AI Model"], note: "processo que produz os parâmetros do modelo", resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 60, title: "Inference", note: "usar um modelo já treinado — contraste direto com Training; contraste/sequência, não prerequisite", revisit: ["AI Fundamentals / Training"], resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 70, title: "Parameters", requires: ["AI Model"], note: "os valores aprendidos durante o treino" }),
      ],
    }),
    module({
      slug: "language-models",
      order: 20,
      title: "Language Models",
      requires: ["AI Fundamentals"],
      summary:
        "LM → LLM (escala) → Token → Tokenization → Attention → Transformer → Context Window → " +
        "Next-Token Prediction → Autoregressive Generation. Token e Attention são roots (autocontidos).",
      concepts: [
        concept({ order: 10, title: "Language Model (LM)", requires: ["AI Fundamentals / AI Model"], collision: "≠ AI Model genérico — modelo especializado em prever distribuição de probabilidade sobre sequências de texto" }),
        concept({ order: 20, title: "Large Language Model (LLM)", requires: ["Language Model (LM)"], note: "LM em escala — 'large' é qualificador de escala sobre LM" }),
        concept({ order: 30, title: "Token", note: "a unidade que um LM processa — autocontido, não exige LM pré-ensinado", revisit: ["Language Models / Language Model (LM)"], resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 40, title: "Tokenization", requires: ["Token"], subtopics: ["Vocabulary (conjunto fixo de tokens possíveis)"], note: "processo que produz tokens" }),
        concept({ order: 50, title: "Attention", subtopics: ["Self-Attention (forma usada no Transformer)"], note: "mecanismo de ponderar relevância entre tokens — mecanismo geral de deep learning, não exclusivo de LM", revisit: ["Language Models / Language Model (LM)"] }),
        concept({ order: 60, title: "Transformer", requires: ["Attention"], note: "arquitetura construída sobre self-attention" }),
        concept({ order: 70, title: "Context Window", requires: ["Token"], note: "nº máximo de tokens que cabem numa chamada", revisit: ["Context Engineering / Context Budget"], resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 80, title: "Next-Token Prediction", requires: ["Language Model (LM)"], note: "o objetivo de treino central de um LM" }),
        concept({ order: 90, title: "Autoregressive Generation", requires: ["Next-Token Prediction"], note: "aplicar next-token prediction repetidamente, realimentando a saída" }),
      ],
    }),
    module({
      slug: "model-inference",
      order: 30,
      title: "Model Inference",
      requires: ["Language Models"],
      summary:
        "Determinismo × estocasticidade (framing) → temperature → top-p/top-k → condições de parada → " +
        "streaming → seed. Stopping Conditions e Streaming são roots.",
      concepts: [
        concept({ order: 10, title: "Deterministic vs Stochastic Output", requires: ["Language Models / Next-Token Prediction"], note: "framing — sampling introduz aleatoriedade na escolha do próximo token" }),
        concept({ order: 20, title: "Temperature", requires: ["Deterministic vs Stochastic Output"], note: "controla o quanto a distribuição é 'achatada'" }),
        concept({ order: 30, title: "Top-P / Top-K Sampling", requires: ["Deterministic vs Stochastic Output"], subtopics: ["Top-P (nucleus)", "Top-K"], note: "consolidação 2→1 — 2 estratégias de truncar o pool de candidatos" }),
        concept({ order: 40, title: "Stopping Conditions (Max Output Tokens / Stop Sequence)", subtopics: ["Max Output Tokens", "Stop Sequence"], note: "consolidação 2→1 — quando parar de gerar" }),
        concept({ order: 50, title: "Streaming", note: "como a saída chega", revisit: ["Platform / Web Fundamentals / Server-Sent Events (SSE)"], resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 60, title: "Seed", requires: ["Deterministic vs Stochastic Output"], note: "reprodutibilidade da amostragem" }),
      ],
    }),
    module({
      slug: "prompt-engineering",
      order: 40,
      title: "Prompt Engineering",
      requires: ["Model Inference"],
      summary:
        "Prompt → papéis (system/user) → hierarquia → zero/few-shot → in-context learning (o porquê) → " +
        "template → structured prompting → chaining → versionamento. In-Context Learning é root.",
      concepts: [
        concept({ order: 10, title: "Prompt", note: "raiz" }),
        concept({ order: 20, title: "System Prompt vs User Prompt", requires: ["Prompt"], note: "consolidação 2→1 — contraste direto" }),
        concept({ order: 30, title: "Instruction Hierarchy", requires: ["System Prompt vs User Prompt"], note: "qual dos dois prevalece em conflito" }),
        concept({ order: 40, title: "Zero-Shot vs Few-Shot Prompting", requires: ["Prompt"], note: "consolidação 2→1" }),
        concept({ order: 50, title: "In-Context Learning", note: "capacidade de adaptar comportamento a partir de exemplos/instruções no prompt, sem atualizar pesos — Zero/Few-Shot são aplicações de ICL, não prerequisite", revisit: ["Prompt Engineering / Zero-Shot vs Few-Shot Prompting"] }),
        concept({ order: 60, title: "Prompt Template", requires: ["Prompt"], note: "estrutura reutilizável e parametrizada" }),
        concept({ order: 70, title: "Structured Prompting", isNew: true, requires: ["Prompt"], note: "técnica de construção/organização do prompt — pedir formato via instrução (soft)", collision: "≠ Schema-Constrained Generation (Structured Generation) — soft (instrução) × hard (decodificação restrita)" }),
        concept({ order: 80, title: "Prompt Chaining", requires: ["Prompt"], collision: "≠ Sequential Workflow (Agent Orchestration) — encadear chamadas de LLM sem necessariamente ser agentic" }),
        concept({ order: 90, title: "Prompt Versioning", requires: ["Prompt"], note: "canônico aqui — Production AI (Story 23) cita por pointer, não duplica", revisit: ["Production AI / Model Versioning"] }),
      ],
    }),
    module({
      slug: "context-engineering",
      order: 50,
      title: "Context Engineering",
      requires: ["Prompt Engineering"],
      summary:
        "Context → a disciplina → montar → ordenar/comprimir → orçamento → overflow → rot. Assembly/Ordering/" +
        "Compression/Rot dependem só de Context; Budget depende do limite físico da janela (Language Models).",
      concepts: [
        concept({ order: 10, title: "Context", note: "raiz", resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 20, title: "Context Engineering", requires: ["Context"], note: "guarda-chuva — a disciplina de gerenciar o context" }),
        concept({ order: 30, title: "Context Assembly", requires: ["Context"], subtopics: ["Context Selection (o que entra)"], note: "montar não exige a moldura da 'disciplina', só o objeto" }),
        concept({ order: 40, title: "Context Ordering", requires: ["Context"], note: "como organizar o que foi montado" }),
        concept({ order: 50, title: "Context Compression", requires: ["Context"], note: "reduzir volume mantendo sinal" }),
        concept({ order: 60, title: "Context Budget", requires: ["Language Models / Context Window"], note: "budget definido em termos do limite físico da janela" }),
        concept({ order: 70, title: "Context Overflow", requires: ["Context Budget"], note: "o que acontece ao exceder o budget" }),
        concept({ order: 80, title: "Context Rot", requires: ["Context"], subtopics: ["Long Context (o cenário)"], note: "degradação de qualidade com contexto longo, mesmo sem estourar o limite", revisit: ["Language Models / Context Window"] }),
      ],
    }),
    module({
      slug: "structured-generation",
      order: 60,
      title: "Structured Generation",
      requires: ["Prompt Engineering"],
      summary:
        "Saída estruturada (o objetivo) → schema-constrained (garantia forte) → parsing → validação → " +
        "retry quando inválido. Structured Prompting NÃO é subtopic aqui (virou Task própria na Story 04).",
      concepts: [
        concept({ order: 10, title: "Structured Output", subtopics: ["JSON Output (formato-exemplo)"], note: "raiz" }),
        concept({ order: 20, title: "Schema-Constrained Generation", requires: ["Structured Output"], collision: "≠ Structured Prompting (Prompt Engineering) — mecanismo 'hard' (decodificação restrita por gramática/schema) × 'soft' (instrução)" }),
        concept({ order: 30, title: "Output Parsing", requires: ["Structured Output"], note: "extrair dado estruturado do texto gerado" }),
        concept({ order: 40, title: "Output Validation", requires: ["Structured Output"], note: "checar se o resultado obedece ao contrato — validar não exige parsing formal como prerequisite" }),
        concept({ order: 50, title: "Retry on Invalid Output", requires: ["Output Validation"], note: "reprompt com o erro, não reenvio de request de rede", revisit: ["Architecture / Resilience Patterns / Retry"], resources: [{ type: "deck", deckId: "harness" }] }),
      ],
    }),
    module({
      slug: "embeddings",
      order: 70,
      title: "Embeddings",
      summary:
        "Vetor (matemática geral) → embedding (vetor semântico) → embedding model → embedding space → " +
        "similaridade semântica → as métricas que a calculam.",
      concepts: [
        concept({ order: 10, title: "Vector", subtopics: ["Vector Dimension"], collision: "≠ 'vector'/array em algumas linguagens (Programming Foundations) — conceito matemático × estrutura de dados", note: "raiz — conceito matemático geral" }),
        concept({ order: 20, title: "Embedding", requires: ["Vector"], note: "um vetor que representa semântica de um dado (texto, imagem, etc.)" }),
        concept({ order: 30, title: "Embedding Model", requires: ["Embedding"], note: "o modelo que produz embeddings" }),
        concept({ order: 40, title: "Embedding Space", requires: ["Embedding"], note: "o espaço multidimensional onde embeddings vivem" }),
        concept({ order: 50, title: "Semantic Similarity", requires: ["Embedding Space"], note: "proximidade no espaço ≈ similaridade semântica", revisit: ["AI Evaluation / Evaluation Methods (Human / LLM-as-a-Judge / Pairwise / Exact Match / Semantic Similarity)"] }),
        concept({ order: 60, title: "Similarity & Distance Metrics (Cosine / Dot Product / Euclidean)", requires: ["Semantic Similarity"], subtopics: ["Cosine Similarity", "Dot Product", "Euclidean Distance"], note: "consolidação 3→1 — as 3 métricas que operacionalizam Semantic Similarity" }),
      ],
    }),
    module({
      slug: "vector-search",
      order: 80,
      title: "Vector Search",
      requires: ["Embeddings"],
      summary:
        "Vector search (o problema) → k-NN (solução exata) → ANN (aproximada, escalável) → índice → " +
        "HNSW (algoritmo concreto) → vector database (o produto).",
      concepts: [
        concept({ order: 10, title: "Vector Search", requires: ["Embeddings / Embedding Space"], subtopics: ["Similarity Threshold", "Top-K Retrieval"], note: "raiz" }),
        concept({ order: 20, title: "Nearest Neighbor Search (k-NN)", requires: ["Vector Search"], note: "consolidação 2→1 — k-NN é NN search parametrizada por k" }),
        concept({ order: 30, title: "Approximate Nearest Neighbor (ANN)", requires: ["Nearest Neighbor Search (k-NN)"], note: "alternativa aproximada/escalável ao k-NN exato — contraste direto" }),
        concept({ order: 40, title: "Vector Index", requires: ["Approximate Nearest Neighbor (ANN)"], note: "a estrutura de dados que viabiliza ANN em escala" }),
        concept({ order: 50, title: "HNSW", requires: ["Vector Index"], note: "algoritmo de índice específico — instância do conceito geral", revisit: ["Programming Foundations / Data Structures / Graph"] }),
        concept({ order: 60, title: "Vector Database", requires: ["Vector Index"], note: "o produto/categoria que empacota índice + storage + query. Pinecone/Weaviate/pgvector = exemplos, não Tasks" }),
      ],
    }),
    module({
      slug: "chunking",
      order: 90,
      title: "Chunking",
      summary:
        "Story deliberadamente enxuta — Chunking é técnica de escopo estreito. Chunking (raiz) → catálogo " +
        "de estratégias. Semantic Chunking = estratégia, não Task própria.",
      concepts: [
        concept({ order: 10, title: "Chunking", subtopics: ["Chunk Size", "Chunk Overlap"], note: "raiz — dividir documentos em pedaços indexáveis" }),
        concept({ order: 20, title: "Chunking Strategies (Fixed-Size / Recursive / Semantic / Document Structure)", requires: ["Chunking"], subtopics: ["Fixed-Size", "Recursive", "Semantic", "Document Structure"], note: "consolidação 4→1 — o catálogo de estratégias" }),
      ],
    }),
    module({
      slug: "retrieval",
      order: 100,
      title: "Retrieval",
      requires: ["Vector Search", "Chunking"],
      summary:
        "Retrieval (o problema geral) → semantic search / keyword search (contraste) → BM25 → hybrid → " +
        "metadata filtering → reranking. Retrieval, Semantic Search, Keyword Search e Metadata Filtering são roots.",
      concepts: [
        concept({ order: 10, title: "Retrieval", collision: "≠ RAG (Story 11, arquitetura que usa Retrieval) ≠ Grounding (Story 11, a propriedade que RAG busca)", note: "raiz — a operação geral de IR (buscar itens relevantes dado um query)" }),
        concept({ order: 20, title: "Semantic Search", subtopics: ["Dense Retrieval (alt-nome acadêmico de IR)"], note: "buscar por proximidade de significado — Vector Search é uma implementação possível, não prerequisite da definição", revisit: ["Vector Search / Vector Search"] }),
        concept({ order: 30, title: "Keyword Search", subtopics: ["Sparse Retrieval (alt-nome acadêmico de IR)"], collision: "contraste com Semantic Search", note: "busca lexical — autocontida (tipo grep)" }),
        concept({ order: 40, title: "BM25", requires: ["Keyword Search"], note: "algoritmo de ranking lexical específico" }),
        concept({ order: 50, title: "Hybrid Search", requires: ["Semantic Search", "Keyword Search"], note: "combina os dois — síntese genuína" }),
        concept({ order: 60, title: "Metadata Filtering", note: "filtrar por metadado estruturado — autocontido (tipo WHERE clause)", revisit: ["Retrieval / Retrieval"] }),
        concept({ order: 70, title: "Reranking", requires: ["Retrieval"], subtopics: ["Cross-Encoder Reranking", "nota: 'candidate set' (Candidate Retrieval, absorvido)"], note: "2º estágio de refino — aplica-se a qualquer 1º estágio, não só híbrido" }),
      ],
    }),
    module({
      slug: "rag",
      order: 110,
      title: "RAG",
      requires: ["Retrieval", "Context Engineering"],
      summary:
        "RAG (a arquitetura) → pipeline (as 3 fases) → query transformation → grounding (o objetivo) → " +
        "source attribution → retrieval failure → avaliação (framing). Grounding é root.",
      concepts: [
        concept({ order: 10, title: "Retrieval-Augmented Generation (RAG)", requires: ["Retrieval / Retrieval"], collision: "≠ Retrieval (mecanismo geral) — RAG é a arquitetura que USA retrieval para aumentar geração" }),
        concept({ order: 20, title: "RAG Pipeline (Indexing / Retrieval / Generation)", requires: ["Retrieval-Augmented Generation (RAG)"], subtopics: ["Indexing", "Retrieval", "Generation"], note: "consolidação 4→1" }),
        concept({ order: 30, title: "Query Transformation", requires: ["Retrieval / Retrieval"], subtopics: ["Query Expansion", "Multi-Query Retrieval"], note: "consolidação 3→1 — técnica de IR geral, não exclusiva de RAG" }),
        concept({ order: 40, title: "Grounding", collision: "≠ Retrieval ≠ RAG — a propriedade que RAG busca (saída verificavelmente ligada às fontes); conceito mais geral, aplica a tool outputs e doc fixo. Sem revisitOf/sinonímia com Faithfulness (Story 19)", note: "RAG é só UMA via de alcançar grounding", revisit: ["RAG / Retrieval-Augmented Generation (RAG)"] }),
        concept({ order: 50, title: "Source Attribution", requires: ["Grounding"], note: "citar fontes — mecanismo concreto de demonstrar grounding" }),
        concept({ order: 60, title: "Retrieval Failure", requires: ["Retrieval-Augmented Generation (RAG)"], note: "falha semântica (retrieval irrelevante), distinta de falha de transporte (Architecture/Resilience)" }),
        concept({ order: 70, title: "RAG Evaluation", requires: ["Retrieval-Augmented Generation (RAG)"], note: "framing — métricas concretas vivem em AI Evaluation (Story 19)", revisit: ["AI Evaluation / Faithfulness & Answer Relevance", "AI Evaluation / Retrieval Precision & Recall"] }),
      ],
    }),
    module({
      slug: "tool-calling",
      order: 120,
      title: "Tool Calling",
      requires: ["Structured Generation"],
      summary:
        "Tool (a capacidade) → tool calling → schema → seleção → resultado → tratamento de erro → " +
        "permissões → loop mecânico completo. A Requires de Story para Structured Generation é preservada.",
      concepts: [
        concept({ order: 10, title: "Tool", note: "raiz — capacidade que um sistema de IA pode invocar; não agent-specific" }),
        concept({ order: 20, title: "Tool Calling", requires: ["Tool"], subtopics: ["Function Calling (termo da OpenAI para o mesmo conceito)"], note: "a Requires de Story Tool Calling → Structured Generation é preservada; sem Task-edge artificial", revisit: ["Structured Generation / Structured Output"] }),
        concept({ order: 30, title: "Tool Schema", requires: ["Tool"], subtopics: ["Tool Arguments"], note: "schema é insumo de Tool Calling, não o contrário" }),
        concept({ order: 40, title: "Tool Selection", requires: ["Tool Schema"], note: "escolher entre tools dado seus schemas" }),
        concept({ order: 50, title: "Tool Result", requires: ["Tool Calling"], note: "o retorno de executar a tool, realimentado ao modelo" }),
        concept({ order: 60, title: "Tool Error Handling", requires: ["Tool Result"], subtopics: ["Tool Retry"], revisit: ["Architecture / Resilience Patterns"], note: "mecanismo distinto, não reenvio de rede genérico" }),
        concept({ order: 70, title: "Tool Permissions", requires: ["Tool"], note: "escopo de autorização por tool", revisit: ["Platform / Authorization", "AI Safety & Guardrails / Least Privilege for Tools"] }),
        concept({ order: 80, title: "Tool Execution Loop", requires: ["Tool Result", "Tool Error Handling"], collision: "≠ Agent Loop (Story 14) — este é o loop mecânico de UMA chamada de tool" }),
      ],
    }),
    module({
      slug: "mcp",
      order: 130,
      title: "MCP",
      requires: ["Tool Calling"],
      summary:
        "MCP (o protocolo) → arquitetura (papéis) → primitivas → transporte → MCP × API. MCP é root no " +
        "Task DAG; Tool Schema fica pointer/contexto. A Requires de Story para Tool Calling é preservada.",
      concepts: [
        concept({ order: 10, title: "Model Context Protocol (MCP)", collision: "'Context' no nome ≠ Context Engineering (Story 05) — MCP usa 'context' num sentido mais amplo (tools/resources/prompts expostos)", note: "protocolo padrão (não produto/vendor); root no Task DAG; a Requires de Story MCP → Tool Calling é preservada", revisit: ["Tool Calling / Tool Schema"] }),
        concept({ order: 20, title: "MCP Architecture (Host / Client / Server)", requires: ["Model Context Protocol (MCP)"], subtopics: ["Host", "Client", "Server"], note: "consolidação 3→1 — os 3 papéis arquiteturais" }),
        concept({ order: 30, title: "MCP Primitives (Tools / Resources / Prompts)", requires: ["Model Context Protocol (MCP)"], subtopics: ["Tools", "Resources", "Prompts"], note: "consolidação 3→1 — primitivas não exigem os 3 papéis, só o protocolo" }),
        concept({ order: 40, title: "MCP Transport", requires: ["MCP Architecture (Host / Client / Server)"], subtopics: ["stdio", "HTTP/SSE"], note: "como Host/Client/Server se comunicam" }),
        concept({ order: 50, title: "MCP vs API", requires: ["Model Context Protocol (MCP)", "Platform / API Fundamentals / API"], note: "comparação — desambigua confusão comum" }),
      ],
    }),
    module({
      slug: "agent-fundamentals",
      order: 140,
      title: "Agent Fundamentals",
      requires: ["Tool Calling", "Context Engineering"],
      summary:
        "Determinístico × agentic (fronteira) → agente → agente × LLM → agentic system → agentic workflow → " +
        "agent loop → ReAct → HITL. Deterministic vs Agentic Workflow, AI Agent e HITL são roots.",
      concepts: [
        concept({ order: 10, title: "Deterministic vs Agentic Workflow", note: "framing — a fronteira central desta Story; sem prerequisite conceitual real (root)", revisit: ["Tool Calling / Tool Execution Loop"] }),
        concept({ order: 20, title: "AI Agent", note: "raiz do conceito — Agent é definível diretamente, a moldura determinístico×agentic é pedagógica", revisit: ["Agent Fundamentals / Deterministic vs Agentic Workflow"] }),
        concept({ order: 30, title: "Agent vs LLM", requires: ["AI Agent"], note: "agente = LLM + tools + loop + autonomia, não o modelo cru", revisit: ["AI Fundamentals / AI System"] }),
        concept({ order: 40, title: "Agentic System", isNew: true, requires: ["AI Fundamentals / AI System", "AI Agent"], collision: "AI System ≠ Agentic System ≠ Agentic Workflow — especialização de AI System composta de agentes" }),
        concept({ order: 50, title: "Agentic Workflow", requires: ["Agentic System"], note: "fluxo executado por/dentro do sistema agentic", resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 60, title: "Agent Loop", requires: ["Agentic Workflow"], subtopics: ["Planning", "Acting", "Observation", "Reflection"], collision: "≠ Tool Execution Loop (Story 12) — ciclo plan-act-observe-reflect mais amplo", note: "consolidação 5→1", revisit: ["Tool Calling / Tool Execution Loop"] }),
        concept({ order: 70, title: "ReAct", requires: ["Agent Loop"], note: "padrão nomeado específico — instância do Agent Loop" }),
        concept({ order: 80, title: "Human-in-the-Loop (HITL)", note: "mecanismo de controle inserido no loop; sem prerequisite conceitual real (root)", revisit: ["Agent Fundamentals / Agent Loop", "AI Safety & Guardrails / Human Approval"] }),
      ],
    }),
    module({
      slug: "agent-orchestration",
      order: 150,
      title: "Agent Orchestration",
      requires: ["Agent Fundamentals"],
      summary:
        "Orquestração (raiz) → router → padrões de composição → estado → terminação. Orchestration e Agent " +
        "State são roots. Handoff foi removida daqui (lar canônico único = Multi-Agent Systems).",
      concepts: [
        concept({ order: 10, title: "Orchestration (Workflow)", note: "raiz — 'Orchestration' e 'Workflow' do rascunho fundidos; explicável com vocabulário genérico de 'passos'", revisit: ["Agent Fundamentals / Agent Loop"] }),
        concept({ order: 20, title: "Router", requires: ["Orchestration (Workflow)"], note: "direciona execução para caminhos/agentes diferentes" }),
        concept({ order: 30, title: "Workflow Composition (Sequential / Parallel / Conditional)", requires: ["Orchestration (Workflow)"], subtopics: ["Sequential", "Parallel", "Conditional"], note: "consolidação 3→1 — os 3 padrões de composição" }),
        concept({ order: 40, title: "Agent State", note: "rastrear estado ao longo do workflow — autocontido (root)", revisit: ["Agent Orchestration / Orchestration (Workflow)"] }),
        concept({ order: 50, title: "Agent Termination", requires: ["Agent State"], note: "quando parar — depende de avaliar o estado" }),
      ],
    }),
    module({
      slug: "ai-memory",
      order: 160,
      title: "AI Memory",
      requires: ["Agent Fundamentals", "Context Engineering"],
      summary:
        "Memória (raiz) → memory × context (a distinção central) → curto×longo prazo → tipos → retrieval de " +
        "memória → consolidação.",
      concepts: [
        concept({ order: 10, title: "Agent Memory", requires: ["Agent Fundamentals / AI Agent"], note: "raiz" }),
        concept({ order: 20, title: "Memory vs Context", requires: ["Agent Memory", "Context Engineering / Context"], collision: "memory é persistida entre sessões/turnos; context é o que está na janela atual" }),
        concept({ order: 30, title: "Short-Term vs Long-Term Memory", requires: ["Agent Memory"], note: "consolidação 2→1 — distinção autocontida" }),
        concept({ order: 40, title: "Memory Types (Conversation / Semantic / Episodic)", requires: ["Short-Term vs Long-Term Memory"], subtopics: ["Conversation", "Semantic", "Episodic"], note: "consolidação 3→1 — tipos de memória de longo prazo por conteúdo" }),
        concept({ order: 50, title: "Memory Retrieval", requires: ["Agent Memory"], note: "recuperar não exige a taxonomia completa de tipos", revisit: ["Vector Search / Vector Search", "Retrieval / Retrieval"] }),
        concept({ order: 60, title: "Memory Consolidation", requires: ["Agent Memory"], note: "resumir/compactar memória ao longo do tempo — operação irmã de retrieval, não dependente" }),
      ],
    }),
    module({
      slug: "multi-agent-systems",
      order: 170,
      title: "Multi-Agent Systems",
      requires: ["Agent Orchestration"],
      summary:
        "Multi-agente (raiz) → coordenação → papéis → comunicação → delegação → handoff → supervisor pattern " +
        "→ trade-offs (capstone).",
      concepts: [
        concept({ order: 10, title: "Multi-Agent System", requires: ["Agent Orchestration / Orchestration (Workflow)"], note: "raiz" }),
        concept({ order: 20, title: "Agent Coordination", requires: ["Multi-Agent System"], note: "o problema geral — framing antes dos mecanismos" }),
        concept({ order: 30, title: "Agent Role", requires: ["Multi-Agent System"], note: "o que cada agente se especializa em" }),
        concept({ order: 40, title: "Agent Communication", requires: ["Multi-Agent System"], note: "como agentes trocam informação" }),
        concept({ order: 50, title: "Agent Delegation", requires: ["Agent Communication"], note: "delegar trabalho exige canal de comunicação" }),
        concept({ order: 60, title: "Agent Handoff", requires: ["Agent Delegation"], note: "lar canônico único (absorve a 'Handoff' removida da Story 15) — delegação com transferência completa de controle" }),
        concept({ order: 70, title: "Supervisor Pattern", requires: ["Agent Delegation"], note: "padrão nomeado — um agente supervisiona/delega para outros" }),
        concept({ order: 80, title: "Multi-Agent Trade-offs", requires: ["Agent Coordination"], note: "capstone — quando multi-agente vale a complexidade; pesa o problema geral, não um padrão específico" }),
      ],
    }),
    module({
      slug: "model-routing",
      order: 180,
      title: "Model Routing",
      requires: ["Model Inference"],
      summary:
        "Router (raiz) → estático×dinâmico → critérios → fallback → arquitetura multi-provedor. " +
        "Multi-Provider Architecture é root (pré-condição do fallback entre provedores, não consequência).",
      concepts: [
        concept({ order: 10, title: "Model Router", requires: ["Model Inference"], note: "raiz" }),
        concept({ order: 20, title: "Static vs Dynamic Routing", requires: ["Model Router"], subtopics: ["Static Routing", "Dynamic Routing"], note: "consolidação 2→1" }),
        concept({ order: 30, title: "Routing Criteria (Capability / Cost / Latency)", requires: ["Model Router"], subtopics: ["Capability", "Cost", "Latency"], note: "consolidação 3→1 — critério (o quê) independe do modo (como decide)", revisit: ["Platform / Performance Engineering / Latency"] }),
        concept({ order: 40, title: "Model Fallback", requires: ["Model Router"], note: "canônico aqui — Production AI (Story 23) revisita (revisitOf intra-Epic)", revisit: ["Production AI / Model Fallback", "Architecture / Resilience Patterns"] }),
        concept({ order: 50, title: "Multi-Provider Architecture", note: "suportar múltiplos provedores é pré-condição do fallback entre eles (root). OpenAI/Anthropic/Gemini/Bedrock/Vertex AI = exemplos, não Tasks", revisit: ["Model Routing / Model Fallback", "Model Routing / Model Router"] }),
      ],
    }),
    module({
      slug: "ai-evaluation",
      order: 190,
      title: "AI Evaluation",
      requires: ["RAG", "Agent Fundamentals"],
      summary:
        "Avaliação (raiz) → dataset → offline×online → métodos → métricas de retrieval → métricas de " +
        "qualidade de RAG → regressão (fecha o ciclo com Testing & Quality).",
      concepts: [
        concept({ order: 10, title: "Evaluation (Evals)", note: "raiz — disciplina paralela a Testing, versão específica de IA", revisit: ["Testing & Quality Engineering / Testing Fundamentals"] }),
        concept({ order: 20, title: "Evaluation Dataset", requires: ["Evaluation (Evals)"], subtopics: ["Golden Dataset (versão curada/rotulada)"], note: "dataset PARA avaliação" }),
        concept({ order: 30, title: "Offline vs Online Evaluation", requires: ["Evaluation (Evals)"], note: "consolidação 2→1 — online eval frequentemente nem usa dataset fixo", revisit: ["Testing & Quality Engineering / Testing Strategy"] }),
        concept({ order: 40, title: "Evaluation Methods (Human / LLM-as-a-Judge / Pairwise / Exact Match / Semantic Similarity)", requires: ["Evaluation (Evals)"], subtopics: ["Human", "LLM-as-a-Judge", "Pairwise", "Exact Match", "Semantic Similarity"], collision: "'Semantic Similarity' aqui = aplicação de Embeddings / Semantic Similarity (Story 07) como método de avaliação", note: "consolidação 5→1 — métodos independem do momento (offline/online)" }),
        concept({ order: 50, title: "Retrieval Precision & Recall", requires: ["Evaluation Dataset"], note: "consolidação 2→1 — métricas clássicas de IR, autocontidas dado um dataset", revisit: ["RAG / RAG Evaluation"] }),
        concept({ order: 60, title: "Faithfulness & Answer Relevance", requires: ["Evaluation (Evals)"], note: "consolidação 2→1 — mede qualidade de GERAÇÃO; sem revisitOf/sinonímia com Grounding (PENDENTE-2)", revisit: ["RAG / Grounding"] }),
        concept({ order: 70, title: "Regression Evaluation", requires: ["Evaluation Methods (Human / LLM-as-a-Judge / Pairwise / Exact Match / Semantic Similarity)"], note: "regressão exige um método de score para comparar", revisit: ["Testing & Quality Engineering / Testing Strategy / Regression Testing"] }),
      ],
    }),
    module({
      slug: "ai-safety-guardrails",
      order: 200,
      title: "AI Safety & Guardrails",
      requires: ["Tool Calling", "RAG", "Agent Fundamentals"],
      summary:
        "Guardrails (raiz) → input×output → hallucination → prompt injection → variante indireta → jailbreak → " +
        "vazamento de dado → PII → abuso de tool → least privilege (revisita) → aprovação humana (capstone).",
      concepts: [
        concept({ order: 10, title: "Guardrails", note: "raiz", resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 20, title: "Input vs Output Guardrails", requires: ["Guardrails"], subtopics: ["Input Guardrails", "Output Guardrails"], note: "consolidação 2→1", resources: [{ type: "deck", deckId: "harness" }] }),
        concept({ order: 30, title: "Hallucination", note: "a falha de grounding — autoexplicável sem o conceito de Grounding (root)", revisit: ["RAG / Grounding"] }),
        concept({ order: 40, title: "Prompt Injection", requires: ["Guardrails"], note: "entrada não confiável tratada como instrução em contexto privilegiado", revisit: ["Platform / Application Security"] }),
        concept({ order: 50, title: "Indirect Prompt Injection", requires: ["Prompt Injection"], note: "injeção via conteúdo recuperado/de tool, não input direto", revisit: ["RAG"] }),
        concept({ order: 60, title: "Jailbreak", requires: ["Guardrails"], collision: "≠ Prompt Injection — contornar o alinhamento do próprio modelo, não injetar instrução via conteúdo externo" }),
        concept({ order: 70, title: "Data Leakage", requires: ["Guardrails"], note: "vazamento de dado de treino/contexto sensível na saída" }),
        concept({ order: 80, title: "PII Handling", note: "tipo específico de vazamento — pode ser tratado sem Data Leakage pré-ensinado (root)", revisit: ["AI Safety & Guardrails / Data Leakage", "Platform / Application Security"] }),
        concept({ order: 90, title: "Tool Abuse", requires: ["Tool Calling / Tool Permissions"], note: "agente manipulado a usar mal suas tools — pode ocorrer sem jailbreak", revisit: ["AI Safety & Guardrails / Jailbreak"] }),
        concept({ order: 100, title: "Least Privilege for Tools", requires: ["Tool Calling / Tool Permissions"], canonical: false, revisitOf: "Platform / Authorization / Principle of Least Privilege", note: "mesmo padrão de Cloud Security / Least Privilege in Cloud (Epic 05); a revisitOf já é a estrutura correta" }),
        concept({ order: 110, title: "Human Approval", requires: ["Agent Fundamentals / Human-in-the-Loop (HITL)"], note: "revisita HITL com framing de segurança — pausa e exige aprovação explícita antes de ação de risco; defesas complementares/independentes de Least Privilege", resources: [{ type: "deck", deckId: "harness" }] }),
      ],
    }),
    module({
      slug: "model-adaptation",
      order: 210,
      title: "Model Adaptation",
      requires: ["AI Fundamentals", "RAG"],
      summary:
        "Fine-tuning (raiz) → SFT/instruction tuning → PEFT/LoRA → distillation → quantization → " +
        "RAG × fine-tuning (capstone). Distillation e Quantization são roots.",
      concepts: [
        concept({ order: 10, title: "Fine-Tuning", requires: ["AI Fundamentals / Training"], note: "raiz — forma/continuação de Training" }),
        concept({ order: 20, title: "Supervised Fine-Tuning (SFT) / Instruction Tuning", requires: ["Fine-Tuning"], note: "consolidação 2→1 — Instruction Tuning é SFT sobre dados de seguir-instrução" }),
        concept({ order: 30, title: "PEFT (LoRA)", requires: ["Fine-Tuning"], subtopics: ["LoRA"], note: "consolidação 2→1 — eficiência é técnica geral sobre fine-tuning, não exclusiva de SFT" }),
        concept({ order: 40, title: "Distillation", note: "treinar modelo menor para imitar um maior — categoria de técnica diferente, não subtipo de fine-tuning (root)", revisit: ["Model Adaptation / Fine-Tuning"] }),
        concept({ order: 50, title: "Quantization", collision: "técnica de compressão/eficiência, ortogonal a fine-tuning (não altera comportamento, reduz precisão numérica)", note: "root" }),
        concept({ order: 60, title: "RAG vs Fine-Tuning", requires: ["RAG / Retrieval-Augmented Generation (RAG)", "Fine-Tuning"], note: "capstone comparativo" }),
      ],
    }),
    module({
      slug: "ai-observability",
      order: 220,
      title: "AI Observability",
      requires: ["Platform / Observability"],
      summary:
        "LLM tracing (raiz, aplica Platform/Observability) → prompt logging → token usage → cost tracking → " +
        "latency tracking → tool/retrieval tracing → failure analysis. Token Usage e Failure Analysis são roots.",
      concepts: [
        concept({ order: 10, title: "LLM Tracing", requires: ["Platform / Observability / Distributed Tracing (Span / trace context)"], note: "distributed tracing aplicado a cadeias de chamada de LLM" }),
        concept({ order: 20, title: "Prompt Logging", requires: ["Platform / Observability / Structured Logging"], note: "structured logging aplicado a prompts — técnica paralela ao tracing, não dependente" }),
        concept({ order: 30, title: "Token Usage", note: "métrica sem equivalente em Platform — contar tokens não exige o mecanismo de tracing (root)", revisit: ["Language Models / Token"] }),
        concept({ order: 40, title: "Cost Tracking", requires: ["Token Usage"], note: "custo = tokens × preço" }),
        concept({ order: 50, title: "Latency Tracking", requires: ["Platform / Performance Engineering / Latency"], note: "canônico lá; aqui é o ponto de medição específico de IA" }),
        concept({ order: 60, title: "Tool & Retrieval Tracing", requires: ["LLM Tracing"], note: "consolidação 2→1 — 2 especializações do tracing para operações de IA" }),
        concept({ order: 70, title: "Failure Analysis", note: "capstone — sinais concretos para diagnosticar; sem prerequisite conceitual (root)", revisit: ["AI Observability / Tool & Retrieval Tracing", "AI Observability / Prompt Logging", "Testing & Quality Engineering / Debugging / Root Cause Analysis", "Platform / Reliability Engineering / Postmortem (Blameless)"] }),
      ],
    }),
    module({
      slug: "production-ai",
      order: 230,
      title: "Production AI",
      requires: ["AI Evaluation", "AI Observability", "Architecture / Resilience Patterns"],
      summary:
        "Capstone de revisita: confiabilidade (framing) → latência/TTFT/throughput → custo → token budget → " +
        "cache semântico → rate limiting → model fallback → retry strategy → model versioning → eval em CI/CD → monitoramento.",
      concepts: [
        concept({ order: 10, title: "AI System Reliability", requires: ["AI Fundamentals / AI System"], note: "raiz/framing — propriedade DO sistema" }),
        concept({ order: 20, title: "Model Latency", requires: ["Platform / Performance Engineering / Latency"], note: "profundidade nova (batching, tamanho de modelo) — explicável sem a moldura de 'reliability'" }),
        concept({ order: 30, title: "Time to First Token (TTFT)", requires: ["Model Latency"], note: "métrica específica de streaming, sem equivalente em Platform", revisit: ["Model Inference / Streaming"] }),
        concept({ order: 40, title: "Token Throughput", requires: ["Platform / Performance Engineering / Throughput"], note: "família de métrica diferente (taxa, não atraso); AI Observability / Token Usage fica pointer/contexto", revisit: ["AI Observability / Token Usage"] }),
        concept({ order: 50, title: "Model Cost", requires: ["AI Observability / Cost Tracking"], note: "gestão de custo em produção, constrói sobre o tracking já estabelecido" }),
        concept({ order: 60, title: "Token Budget", requires: ["Model Cost"], collision: "≠ Context Budget (Story 05) — limite ECONÔMICO (quanto se está disposto a gastar) × limite de CAPACIDADE (o que cabe na janela)" }),
        concept({ order: 70, title: "Caching LLM Responses (Semantic Cache)", requires: ["Platform / Caching / Cache"], canonical: false, revisitOf: "Platform / Caching / Cache", note: "cache por similaridade semântica da query, não match exato; consolida com o alvo estrutural do revisitOf" }),
        concept({ order: 80, title: "Rate Limiting", canonical: false, revisitOf: "Platform / API Fundamentals / Rate Limiting", note: "aplicação: controle de custo/quota de chamadas de LLM (root)" }),
        concept({ order: 90, title: "Model Fallback", canonical: false, revisitOf: "Model Routing / Model Fallback", note: "revisita intra-Epic (mesmo padrão de GraphQL / N+1 in Resolvers no Epic 05) (root)" }),
        concept({ order: 100, title: "Retry Strategy", canonical: false, revisitOf: "Architecture / Resilience Patterns / Retry", note: "aplicação em produção de IA (root)" }),
        concept({ order: 110, title: "Model Versioning", note: "canônico — sem lar anterior. Prompt Versioning NÃO ganha Task própria aqui — já canônico em Prompt Engineering (Story 04), citada só como pointer (root)", revisit: ["Prompt Engineering / Prompt Versioning"] }),
        concept({ order: 120, title: "Evaluation in CI/CD", requires: ["AI Evaluation / Regression Evaluation"], note: "gate de deploy por qualidade de IA", revisit: ["CI/CD Pipeline"] }),
        concept({ order: 130, title: "AI System Monitoring", requires: ["AI Observability / Failure Analysis"], note: "capstone final — pré-deploy (gate) × pós-deploy (monitoramento) são preocupações paralelas", revisit: ["Platform / Reliability Engineering"] }),
      ],
    }),
  ],
});
