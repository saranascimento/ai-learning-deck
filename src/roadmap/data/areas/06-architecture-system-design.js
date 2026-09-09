import { area, module, concept } from "../builders.js";

export default area({
  slug: "architecture-system-design",
  order: 60,
  title: "Architecture & System Design",
  color: "#E36A74",
  phase: "Fase 2 concluída (2026-09-08) — FROZEN",
  summary:
    "Sistemas que escalam, distribuem e evoluem: fundamentos e estilos de arquitetura, system design, " +
    "escalabilidade, disponibilidade, sistemas distribuídos, distribuição de dados, comunicação entre " +
    "serviços, mensageria, resiliência, transações distribuídas, padrões de dados, evolução de arquitetura.",
  modules: [
    module({
      slug: "architecture-fundamentals",
      order: 10,
      title: "Architecture Fundamentals",
      summary:
        "O que é arquitetura → characteristics ('-ilities') → constraints → trade-offs (síntese, usa " +
        "Coupling/Cohesion do Epic 01) → modularity (usa Separation of Concerns) → dependency direction " +
        "(generaliza DIP). Coupling/Cohesion/SoC não viram Task própria — mesmo padrão dos Epics 03/04.",
      concepts: [
        concept({ order: 10, title: "Architecture vs Design", note: "ponto de entrada — granularidade e horizonte de decisão" }),
        concept({ order: 20, title: "Architectural Characteristics", note: "'-ilities': o que a arquitetura otimiza além de função" }),
        concept({ order: 30, title: "Architectural Constraints", note: "o que não pode mudar (regulatório, org, legado)" }),
        concept({
          order: 40,
          title: "Trade-offs",
          requires: ["Architectural Characteristics", "Architectural Constraints"],
          note: "síntese — 'não existe arquitetura perfeita, só trade-offs conscientes'. Aplica Coupling/Cohesion no nível de sistema",
          revisit: ["Programming Foundations / Programming Fundamentals / Coupling", "Programming Foundations / Programming Fundamentals / Cohesion"],
        }),
        concept({
          order: 50,
          title: "Modularity",
          note: "ganha lar canônico aqui — era SUGESTÃO não adotada no Epic 01. Aplica Separation of Concerns no nível de fronteira de módulo/serviço",
          revisit: ["Programming Foundations / Programming Fundamentals / Separation of Concerns"],
        }),
        concept({
          order: 60,
          title: "Dependency Direction",
          note: "generaliza DIP para camadas/serviços — 'quem depende de quem', regra da dependência estável",
          revisit: ["Software Design / SOLID / Dependency Inversion Principle (DIP)"],
        }),
      ],
    }),
    module({
      slug: "architectural-styles",
      order: 20,
      title: "Architectural Styles",
      requires: ["Architecture Fundamentals", "Software Design / Domain Modeling"],
      summary:
        "Layered → regra da dependência generalizada (Clean/Hexagonal/Onion, 3→1) → monolito → monolito " +
        "modular → microserviços (usa Bounded Context) → SOA (contraste) → event-driven (framing) → " +
        "serverless (revisita o primitivo) → microkernel (nicho, fecha o catálogo).",
      concepts: [
        concept({ order: 10, title: "Layered Architecture", note: "ponto de entrada do catálogo de estilos" }),
        concept({
          order: 20,
          title: "Dependency-Rule Architectures (Clean / Hexagonal / Onion)",
          requires: ["Layered Architecture", "Architecture Fundamentals / Dependency Direction"],
          subtopics: ["Hexagonal (ports & adapters)", "Onion (camadas concêntricas)", "Clean (anéis de Uncle Bob)"],
          note: "consolidação 3→1 — mesma regra da dependência (aponta para o domínio), vocabulário diferente",
        }),
        concept({ order: 30, title: "Monolith", note: "ponto de contraste com o resto do catálogo" }),
        concept({ order: 40, title: "Modular Monolith", requires: ["Monolith", "Architecture Fundamentals / Modularity"], note: "aplica Modularity no nível de deployment unit" }),
        concept({
          order: 50,
          title: "Microservices",
          note: "fronteira de serviço apoiada em Bounded Context (Software Design) — relevante para a definição, não pré-requisito conceitual estrito",
          revisit: ["Architectural Styles / Modular Monolith", "Software Design / Domain Modeling / Bounded Context"],
        }),
        concept({ order: 60, title: "Service-Oriented Architecture (SOA)", collision: "frequentemente confundida com Microservices — ESB/governança pesada × independência de deploy" }),
        concept({ order: 70, title: "Event-Driven Architecture", note: "framing conceitual; mecânica detalhada em Messaging (Story 10)" }),
        concept({
          order: 80,
          title: "Serverless Architecture",
          requires: ["Platform / Cloud Fundamentals / Serverless"],
          canonical: false,
          revisitOf: "Platform / Cloud Fundamentals / Serverless",
          note: "o primitivo é canônico em Platform; aqui é o estilo — decisão de sistema inteiro (event-glue, cold start como restrição de SLA, vendor lock-in)",
        }),
        concept({ order: 90, title: "Microkernel Architecture", note: "plugin/plug-in architecture — nicho (IDEs, browsers); mantida como Task própria" }),
      ],
    }),
    module({
      slug: "system-design-fundamentals",
      order: 30,
      title: "System Design Fundamentals",
      requires: ["Architecture Fundamentals", "Platform / Performance Engineering"],
      summary:
        "Requisitos funcionais → não-funcionais → capacity estimation (usa Latency/Throughput de Platform) → " +
        "bottlenecks → SPOF (ponte para Scalability).",
      concepts: [
        concept({ order: 10, title: "Functional Requirements", note: "ponto de entrada" }),
        concept({ order: 20, title: "Non-Functional Requirements", requires: ["Functional Requirements"] }),
        concept({
          order: 30,
          title: "Capacity Estimation",
          requires: ["Non-Functional Requirements", "Platform / Performance Engineering / Throughput"],
          subtopics: ["Bandwidth", "estimativa de QPS", "estimativa de armazenamento"],
          note: "back-of-the-envelope. Latency não é Requires universal — relevante em cálculos específicos",
          revisit: ["Platform / Performance Engineering / Latency"],
        }),
        concept({ order: 40, title: "Bottlenecks", note: "onde o sistema quebra sob carga", revisit: ["System Design Fundamentals / Capacity Estimation", "Architecture Fundamentals / Trade-offs"] }),
        concept({ order: 50, title: "Single Point of Failure", note: "ponte para Availability & Reliability", revisit: ["System Design Fundamentals / Bottlenecks"] }),
      ],
    }),
    module({
      slug: "scalability",
      order: 40,
      title: "Scalability",
      requires: ["Architecture Fundamentals", "System Design Fundamentals"],
      summary:
        "Vertical/horizontal scaling → statelessness (o que a escala horizontal exige) → load balancing → " +
        "auto scaling → backpressure. Load Balancing e Auto Scaling são canônicos do roadmap.",
      concepts: [
        concept({ order: 10, title: "Scalability", collision: "≠ Performance (Platform / Performance Engineering) — 'rápido para 1' × 'rápido para N'" }),
        concept({ order: 20, title: "Vertical Scaling", requires: ["Scalability"] }),
        concept({ order: 30, title: "Horizontal Scaling", requires: ["Scalability"], collision: "contraste direto com Vertical Scaling" }),
        concept({ order: 40, title: "Statelessness", requires: ["Horizontal Scaling"], note: "consolidação 2→1 (Stateless + Stateful Systems, contraste ensinado em par) — o que torna Horizontal Scaling tratável" }),
        concept({
          order: 50,
          title: "Load Balancing",
          requires: ["Horizontal Scaling"],
          subtopics: ["algoritmos: round robin, least connections, consistent hashing (preview de Data Distribution)"],
          note: "canônico do roadmap — Platform / Cloud Fundamentals / Load Balancer é revisitOf daqui",
        }),
        concept({
          order: 60,
          title: "Auto Scaling",
          requires: ["Horizontal Scaling"],
          note: "canônico do roadmap — Platform / Cloud Fundamentals / Auto Scaling é revisitOf daqui",
          revisit: ["Scalability / Statelessness"],
        }),
        concept({ order: 70, title: "Backpressure", note: "canônico do roadmap — controle de fluxo produtor/consumidor", revisit: ["Programming Foundations / Concurrency"] }),
      ],
    }),
    module({
      slug: "caching-at-scale",
      order: 50,
      title: "Caching at Scale",
      requires: ["Platform / Caching", "Scalability"],
      summary:
        "Story deliberadamente slim — ~90% do rascunho original era duplicata de Platform / Caching. " +
        "Distributed Cache → Cache Stampede → Cache Coherence.",
      concepts: [
        concept({ order: 10, title: "Distributed Cache", requires: ["Platform / Caching / Cache", "Scalability / Horizontal Scaling"], note: "cache compartilhado entre réplicas — o que muda vs cache local" }),
        concept({ order: 20, title: "Cache Stampede", requires: ["Distributed Cache", "Platform / Caching / Cache Invalidation"], note: "muitas requisições batem no DB simultaneamente após expiração" }),
        concept({ order: 30, title: "Cache Coherence", requires: ["Distributed Cache"], note: "consistência entre múltiplas instâncias de cache" }),
      ],
    }),
    module({
      slug: "availability-reliability",
      order: 60,
      title: "Availability & Reliability",
      requires: ["Scalability"],
      summary:
        "Availability × Reliability (contraste) → Fault Tolerance → Redundancy → Failover → Graceful " +
        "Degradation → Disaster Recovery (RTO/RPO, 3→1). Múltiplas Tasks-root — Requires reflete dependência " +
        "conceitual real, não estrutura visual conectada.",
      concepts: [
        concept({ order: 10, title: "Availability", subtopics: ["'nines' (99.9%…)", "High Availability (o alvo/prática)"] }),
        concept({ order: 20, title: "Reliability", collision: "uptime (Availability) × corretude de comportamento ao longo do tempo" }),
        concept({ order: 30, title: "Fault Tolerance" }),
        concept({ order: 40, title: "Redundancy" }),
        concept({ order: 50, title: "Failover", requires: ["Redundancy"], note: "pressupõe que existe um backup redundante para o qual chavear" }),
        concept({ order: 60, title: "Graceful Degradation", requires: ["Fault Tolerance"], note: "estratégia específica dentro do guarda-chuva Fault Tolerance" }),
        concept({
          order: 70,
          title: "Disaster Recovery (RTO / RPO)",
          subtopics: ["RTO — Recovery Time Objective", "RPO — Recovery Point Objective"],
          note: "consolidação 3→1 (Disaster Recovery + RTO + RPO)",
          revisit: ["Availability & Reliability / Failover"],
        }),
      ],
    }),
    module({
      slug: "distributed-systems-fundamentals",
      order: 70,
      title: "Distributed Systems Fundamentals",
      summary:
        "O que define um sistema distribuído → falha parcial → network partition → clock & time → " +
        "consistency models (3→1) → CAP → PACELC → consensus → leader election.",
      concepts: [
        concept({ order: 10, title: "Distributed System", collision: "≠ Client-Server Model (Platform / Web Fundamentals) — teoria geral × topologia particular" }),
        concept({ order: 20, title: "Partial Failure", requires: ["Distributed System"] }),
        concept({ order: 30, title: "Network Partition", requires: ["Partial Failure"], note: "tipo específico de falha parcial" }),
        concept({ order: 40, title: "Clock & Time in Distributed Systems", requires: ["Distributed System"], note: "clocks lógicos, NTP drift, ordenação sem clock global" }),
        concept({
          order: 50,
          title: "Consistency Models (Strong / Eventual)",
          note: "consolidação 3→1 (Consistency + Strong Consistency + Eventual Consistency)",
          collision: "≠ Consistency (ACID) (Platform / Database Transactions) — acordo entre réplicas × garantia intra-transação",
          revisit: ["Distributed Systems Fundamentals / Network Partition"],
        }),
        concept({ order: 60, title: "CAP Theorem", requires: ["Consistency Models (Strong / Eventual)", "Network Partition"] }),
        concept({ order: 70, title: "PACELC", requires: ["CAP Theorem"], note: "extensão/refinamento do CAP" }),
        concept({ order: 80, title: "Consensus", requires: ["Network Partition"], revisit: ["Distributed Systems Fundamentals / Consistency Models (Strong / Eventual)"] }),
        concept({ order: 90, title: "Leader Election", requires: ["Consensus"], note: "aplicação concreta do problema geral de consenso" }),
      ],
    }),
    module({
      slug: "data-distribution",
      order: 80,
      title: "Data Distribution",
      requires: ["Distributed Systems Fundamentals"],
      summary:
        "Replication → topologies (3→1) → partitioning (contraste) → sharding → consistent hashing → " +
        "hotspot (realocado de Scalability) → rebalancing.",
      concepts: [
        concept({ order: 10, title: "Replication", requires: ["Distributed Systems Fundamentals / Distributed System"], note: "REPOINT — antes Requires: Consistency Models; mecânica de replicação é definível sobre 'sistema distribuído', sem exigir o vocabulário de consistência" }),
        concept({
          order: 20,
          title: "Replication Topologies (Leader-Follower / Multi-Leader / Leaderless)",
          requires: ["Replication"],
          subtopics: ["Leader-Follower", "Multi-Leader", "Leaderless"],
          note: "consolidação 3→1",
          revisit: ["Distributed Systems Fundamentals / Consistency Models (Strong / Eventual)"],
        }),
        concept({ order: 30, title: "Partitioning", collision: "replicar copia, particionar divide — conceitos contrastantes", revisit: ["Data Distribution / Replication"] }),
        concept({ order: 40, title: "Sharding", requires: ["Partitioning"], subtopics: ["estratégias: range, hash, directory"] }),
        concept({ order: 50, title: "Consistent Hashing", requires: ["Sharding"] }),
        concept({ order: 60, title: "Hotspot", requires: ["Sharding"], note: "realocado de Scalability — carga desigual entre partições/nós", revisit: ["Data Distribution / Consistent Hashing"] }),
        concept({ order: 70, title: "Rebalancing", requires: ["Sharding"], note: "o que acontece ao adicionar/remover shards" }),
      ],
    }),
    module({
      slug: "service-communication",
      order: 90,
      title: "Service Communication",
      requires: ["Architectural Styles"],
      summary:
        "Sync × async (nível de serviço) → RPC → gRPC → service discovery → API gateway → reverse proxy → " +
        "service mesh (capstone).",
      concepts: [
        concept({
          order: 10,
          title: "Synchronous vs Asynchronous Communication",
          subtopics: ["Request-Response"],
          note: "consolidação 2→1 (Synchronous + Asynchronous Communication)",
          collision: "≠ Sync/Async de Programming Foundations (nível de linguagem/control-flow) — este é nível de comunicação entre serviços",
        }),
        concept({ order: 20, title: "RPC", revisit: ["Service Communication / Synchronous vs Asynchronous Communication"] }),
        concept({ order: 30, title: "gRPC", requires: ["RPC"], note: "sub/exemplo: Protocol Buffers" }),
        concept({ order: 40, title: "Service Discovery" }),
        concept({
          order: 50,
          title: "API Gateway",
          revisit: ["Service Communication / Service Discovery"],
          collision: "≠ Platform / API Fundamentals / Middleware / Request Pipeline — granularidade diferente (borda entre serviços × dentro de 1 serviço)",
        }),
        concept({ order: 60, title: "Reverse Proxy" }),
        concept({ order: 70, title: "Service Mesh", requires: ["API Gateway", "Reverse Proxy", "Service Discovery"], note: "capstone — combina os anteriores em infraestrutura dedicada" }),
      ],
    }),
    module({
      slug: "messaging",
      order: 100,
      title: "Messaging",
      requires: ["Service Communication"],
      summary:
        "Message Queue → Message Broker → Pub/Sub → Event → Consumer Groups → Message Ordering → " +
        "Delivery Semantics (3→1) → Dead Letter Queue.",
      concepts: [
        concept({ order: 10, title: "Message Queue", subtopics: ["Producer & Consumer (papéis)"] }),
        concept({ order: 20, title: "Message Broker", requires: ["Message Queue"], note: "infraestrutura que implementa a fila" }),
        concept({ order: 30, title: "Pub/Sub", subtopics: ["Topic (unidade de endereçamento)"], revisit: ["Messaging / Message Queue"] }),
        concept({
          order: 40,
          title: "Event",
          subtopics: ["Command vs Event (distinção)"],
          collision: "≠ Domain Event (Software Design / Domain Modeling) — evento de transporte/infraestrutura × evento de modelagem DDD, granularidades diferentes",
          revisit: ["Pub/Sub"],
        }),
        concept({ order: 50, title: "Consumer Groups", requires: ["Message Broker"], note: "consumo paralelo/escala" }),
        concept({
          order: 60,
          title: "Message Ordering",
          requires: ["Message Broker"],
          note: "REPOINT — antes Requires: Consumer Groups; ordenação é propriedade do broker/fila em geral",
          revisit: ["Distributed Systems Fundamentals / Consistency Models (Strong / Eventual)"],
        }),
        concept({
          order: 70,
          title: "Delivery Semantics (At-Most-Once / At-Least-Once / Exactly-Once)",
          requires: ["Message Broker"],
          subtopics: ["At-Most-Once", "At-Least-Once", "Exactly-Once"],
          note: "consolidação 3→1 — absorve Eventual Consistency with Events",
        }),
        concept({ order: 80, title: "Dead Letter Queue", requires: ["Delivery Semantics (At-Most-Once / At-Least-Once / Exactly-Once)"], note: "a válvula de escape do retry do at-least-once" }),
      ],
    }),
    module({
      slug: "resilience-patterns",
      order: 110,
      title: "Resilience Patterns",
      requires: ["Distributed Systems Fundamentals", "Messaging"],
      summary:
        "Timeout → Retry → Idempotency → Backoff → Jitter → Retry Storm → Circuit Breaker → Bulkhead → " +
        "Rate Limiting (revisita Platform). Múltiplas Tasks-root são aceitáveis — Requires ≠ ordem pedagógica.",
      concepts: [
        concept({ order: 10, title: "Timeout" }),
        concept({ order: 20, title: "Retry", revisit: ["Resilience Patterns / Timeout"] }),
        concept({
          order: 30,
          title: "Idempotency",
          note: "canônico do roadmap — conceito de resiliência",
          collision: "≠ Idempotency Key (Platform / API Fundamentals) — propriedade de operação × mecanismo HTTP concreto",
          revisit: ["Resilience Patterns / Retry"],
        }),
        concept({ order: 40, title: "Backoff", requires: ["Retry"] }),
        concept({ order: 50, title: "Jitter", requires: ["Backoff"] }),
        concept({ order: 60, title: "Retry Storm", requires: ["Retry", "Backoff", "Jitter"], note: "a patologia do próprio cluster Retry/Backoff/Jitter" }),
        concept({ order: 70, title: "Circuit Breaker", revisit: ["Resilience Patterns / Timeout", "Resilience Patterns / Retry"] }),
        concept({ order: 80, title: "Bulkhead", revisit: ["Resilience Patterns / Circuit Breaker"] }),
        concept({
          order: 90,
          title: "Rate Limiting",
          requires: ["Platform / API Fundamentals / Rate Limiting"],
          canonical: false,
          revisitOf: "Platform / API Fundamentals / Rate Limiting",
          subtopics: ["Throttling"],
          note: "canônico em Platform; aqui é aplicação/revisita como padrão de resiliência de sistema",
        }),
      ],
    }),
    module({
      slug: "distributed-transactions",
      order: 120,
      title: "Distributed Transactions",
      requires: ["Messaging", "Resilience Patterns"],
      summary:
        "O problema (Distributed Transaction) → 2PC → Saga (alternativa não-bloqueante) → Choreography × " +
        "Orchestration → Transactional Outbox.",
      concepts: [
        concept({ order: 10, title: "Distributed Transaction", note: "unidade de trabalho através de múltiplos serviços/bancos" }),
        concept({ order: 20, title: "Two-Phase Commit (2PC)", requires: ["Distributed Transaction"], note: "solução clássica bloqueante" }),
        concept({
          order: 30,
          title: "Saga Pattern",
          requires: ["Distributed Transaction", "Distributed Systems Fundamentals / Consistency Models (Strong / Eventual)"],
          subtopics: ["Compensating Transaction"],
          collision: "contraste direto com 2PC — bloqueante × não-bloqueante/eventual",
        }),
        concept({ order: 40, title: "Choreography", requires: ["Saga Pattern"] }),
        concept({ order: 50, title: "Orchestration", requires: ["Saga Pattern"] }),
        concept({
          order: 60,
          title: "Transactional Outbox",
          requires: ["Distributed Transaction", "Messaging / Message Broker"],
          note: "REPOINT — antes Requires: Saga Pattern; outbox é usado com Saga, Event Sourcing ou CDC, não exclusivo de Saga",
          revisit: ["Distributed Transactions / Saga Pattern"],
        }),
      ],
    }),
    module({
      slug: "data-architecture-patterns",
      order: 130,
      title: "Data & Architecture Patterns",
      requires: ["Messaging", "Data Distribution"],
      summary:
        "CQRS (generaliza CQS) → Event Sourcing → Materialized View → Database per Service → Change Data " +
        "Capture. Read Replica removida (duplicata de Data Distribution).",
      concepts: [
        concept({
          order: 10,
          title: "CQRS",
          note: "generaliza CQS (Software Design) do nível de método para o nível de arquitetura — sem Requires formal, só pointer histórico-conceitual",
          revisit: ["Software Design / Design Principles / Command-Query Separation (CQS)"],
        }),
        concept({ order: 20, title: "Event Sourcing", requires: ["Messaging / Event"], revisit: ["Data & Architecture Patterns / CQRS"] }),
        concept({ order: 30, title: "Materialized View", revisit: ["Data & Architecture Patterns / CQRS"] }),
        concept({ order: 40, title: "Database per Service", requires: ["Architectural Styles / Microservices"], subtopics: ["Shared Database (anti-padrão, contraste)"] }),
        concept({
          order: 50,
          title: "Change Data Capture (CDC)",
          revisit: ["Data & Architecture Patterns / Database per Service", "Messaging / Message Broker"],
        }),
      ],
    }),
    module({
      slug: "architecture-evolution",
      order: 140,
      title: "Architecture Evolution",
      requires: ["Software Craft / Dependency & Version Management", "Software Craft / Engineering Documentation"],
      summary:
        "Evolutionary Architecture → Fitness Functions → Strangler Fig → Migration Strategy (capstone) → " +
        "Build vs Buy. ADR, Backward Compatibility e Technical Debt não viram Task própria — já canônicos " +
        "em Software Craft.",
      concepts: [
        concept({
          order: 10,
          title: "Evolutionary Architecture",
          note: "arquitetura como algo que muda de forma guiada",
          revisit: ["Architecture Fundamentals / Trade-offs", "Software Craft / Engineering Documentation / ADR"],
        }),
        concept({ order: 20, title: "Fitness Functions", requires: ["Evolutionary Architecture"], revisit: ["Testing & Quality Engineering / Testing Strategy"] }),
        concept({ order: 30, title: "Strangler Fig Pattern", requires: ["Evolutionary Architecture"], revisit: ["Architectural Styles / Monolith"] }),
        concept({
          order: 40,
          title: "Migration Strategy",
          requires: [
            "Strangler Fig Pattern",
            "Software Craft / Dependency & Version Management / Technical Debt",
            "Software Craft / Dependency & Version Management / Backward Compatibility",
          ],
          note: "capstone — aplica Tech Debt/Backward Compatibility no nível de arquitetura",
          revisit: ["Platform / Database Design / Database Migration"],
        }),
        concept({ order: 50, title: "Build vs Buy", requires: ["Architecture Fundamentals / Trade-offs"], note: "decisão de trade-off aplicada" }),
      ],
    }),
  ],
});
