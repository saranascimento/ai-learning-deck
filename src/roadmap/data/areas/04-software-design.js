import { area, module, concept } from "../builders.js";

export default area({
  slug: "software-design",
  order: 40,
  title: "Software Design",
  color: "#9E7BE0",
  summary:
    "Estrutura no nível de classe / módulo / domínio: OOD, SOLID, princípios de design, injeção de " +
    "dependência, catálogos GoF (versão enxuta) e domain modeling. Extraído de Design & Fundamentals.",
  phase: "Fase 2 concluída (2026-09-05)",
  modules: [
    module({
      slug: "object-oriented-design",
      order: 10,
      title: "Object-Oriented Design",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Instância × classe → identidade (pré-requisito de Entity/Value Object) → os dois tipos de objeto " +
        "de domínio → estilo de interação (Tell Don't Ask, Law of Demeter) → anêmico × rico.",
      suggestions: ["Modularity / Encapsulation Boundaries (module / package / service) — já é SUGESTÃO no Epic 01"],
      concepts: [
        concept({ order: 10, title: "Object vs Class", note: "instância × definição — ponto de entrada da Story" }),
        concept({
          order: 20,
          title: "Identity",
          requires: ["Object vs Class"],
          note: "o que faz dois objetos serem \"o mesmo\" — reordenada para antes de Entity/Value Object (Requires real)",
        }),
        concept({ order: 30, title: "Entity", requires: ["Identity"], note: "objeto definido pela identidade que persiste no tempo, ainda que os atributos mudem" }),
        concept({ order: 40, title: "Value Object", requires: ["Identity"], note: "definido por contraste — igualdade por valor, sem identidade própria" }),
        concept({
          order: 50,
          title: "Mutable vs Immutable Objects",
          requires: ["Programming Foundations / Functional Programming / Immutability"],
          note: "aplica o conceito de Immutability (Epic 01) a objetos com estado",
        }),
        concept({
          order: 60,
          title: "Tell, Don't Ask",
          note: "estilo de interação entre objetos — revisita informalmente Encapsulation (Epic 01), sem Requires estrito",
        }),
        concept({
          order: 70,
          title: "Law of Demeter (Principle of Least Knowledge)",
          requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
          note: "consolida os dois nomes (sinônimos na literatura) — regra concreta para minimizar acoplamento entre objetos",
          collision: "Law of Demeter = Principle of Least Knowledge — mesma coisa, dois nomes",
        }),
        concept({ order: 80, title: "Anemic Domain Model", requires: ["Software Design / Object-Oriented Design / Entity"], note: "modelo onde o objeto só guarda dados, sem comportamento" }),
        concept({ order: 90, title: "Rich Domain Model", requires: ["Anemic Domain Model"], note: "contraste direto — objeto com dados + comportamento" }),
      ],
    }),
    module({
      slug: "solid",
      order: 20,
      title: "SOLID",
      requires: ["Object-Oriented Design"],
      summary:
        "SRP e OCP (heurísticas independentes) → LSP, ISP, DIP, cada um revisitando um mecanismo canônico do " +
        "Epic 01. DIP fecha a Story e abre Dependency Injection & IoC.",
      concepts: [
        concept({
          order: 10,
          title: "Single Responsibility Principle (SRP)",
          note: "uma razão para mudar. Aplica informalmente Cohesion (Epic 01) — sem Requires estrito, é heurística própria",
        }),
        concept({ order: 20, title: "Open/Closed Principle (OCP)", note: "aberto para extensão, fechado para modificação" }),
        concept({
          order: 30,
          title: "Liskov Substitution Principle (LSP)",
          requires: [
            "Programming Foundations / Programming Fundamentals / Inheritance",
            "Programming Foundations / Programming Fundamentals / Polymorphism",
          ],
          note: "substitutabilidade de subtipos — definida sobre esses dois mecanismos, não dá para entender sem eles",
        }),
        concept({
          order: 40,
          title: "Interface Segregation Principle (ISP)",
          requires: ["Programming Foundations / Programming Fundamentals / Interface"],
          note: "interfaces enxutas e coesas",
        }),
        concept({
          order: 50,
          title: "Dependency Inversion Principle (DIP)",
          requires: ["Programming Foundations / Programming Fundamentals / Interface"],
          note: "depender de abstrações, não de implementações concretas — fecha a Story e abre Dependency Injection & IoC",
        }),
      ],
    }),
    module({
      slug: "design-principles",
      order: 30,
      title: "Design Principles",
      requires: ["SOLID"],
      summary:
        "CQS → os dois princípios de \"depender do que varia / do contrato\" → Composition over Inheritance " +
        "(heurística realocada do Epic 01), que conecta com os catálogos GoF.",
      concepts: [
        concept({ order: 10, title: "Command-Query Separation (CQS)", note: "um método pergunta OU muda estado, não os dois" }),
        concept({
          order: 20,
          title: "Encapsulate What Varies",
          requires: ["Programming Foundations / Programming Fundamentals / Encapsulation"],
          note: "isolar o ponto de variação — aplica Encapsulation",
        }),
        concept({
          order: 30,
          title: "Program to an Interface",
          requires: ["Programming Foundations / Programming Fundamentals / Interface"],
          note: "depender do contrato, não da implementação — revisita também Type Systems / Structural Typing (Epic 01)",
        }),
        concept({
          order: 40,
          title: "Composition over Inheritance",
          requires: [
            "Programming Foundations / Programming Fundamentals / Composition",
            "Programming Foundations / Programming Fundamentals / Inheritance",
          ],
          note: "heurística realocada do Epic 01 — escolhe entre os dois mecanismos já ensinados",
        }),
      ],
    }),
    module({
      slug: "dependency-injection-and-ioc",
      order: 40,
      title: "Dependency Injection & IoC",
      requires: ["SOLID / Dependency Inversion Principle (DIP)"],
      summary:
        "O guarda-chuva (IoC) → a técnica (DI) → a forma concreta (Constructor Injection) → a automação " +
        "(Container) → o contraponto (Service Locator).",
      concepts: [
        concept({ order: 10, title: "Inversion of Control (IoC)", note: "guarda-chuva: quem controla o fluxo e a criação de dependências" }),
        concept({
          order: 20,
          title: "Dependency Injection",
          requires: ["Inversion of Control (IoC)"],
          note:
            "a técnica concreta — forma mais comum de aplicar IoC. DI é aplicação da testabilidade (via inversa já registrada no Epic 02), não o contrário",
          revisit: ["Testing & Quality Engineering / Testing Strategy / Testability"],
        }),
        concept({ order: 30, title: "Constructor Injection", requires: ["Dependency Injection"], note: "a forma mais comum de DI" }),
        concept({ order: 40, title: "Dependency Injection Container", requires: ["Dependency Injection"], note: "automatiza a montagem do grafo de dependências" }),
        concept({
          order: 50,
          title: "Service Locator",
          requires: ["Dependency Injection"],
          note: "alternativa/anti-padrão comum a DI — ensinado em contraste",
        }),
      ],
    }),
    module({
      slug: "creational-patterns",
      order: 50,
      title: "Creational Patterns",
      requires: ["Design Principles"],
      summary:
        "Factory Method → Abstract Factory (único Requires interno) → Builder, Prototype, Singleton como " +
        "padrões independentes. Catálogo GoF sem cadeia entre famílias.",
      concepts: [
        concept({ order: 10, title: "Factory Method" }),
        concept({ order: 20, title: "Abstract Factory", requires: ["Factory Method"], note: "uma fábrica de factory methods relacionados — não dá para entender sem o anterior" }),
        concept({ order: 30, title: "Builder" }),
        concept({ order: 40, title: "Prototype" }),
        concept({ order: 50, title: "Singleton" }),
      ],
    }),
    module({
      slug: "structural-patterns",
      order: 60,
      title: "Structural Patterns",
      requires: ["Design Principles"],
      summary:
        "Versão enxuta (7→5): Adapter, Decorator, Facade, Proxy, Composite. Requires só Design Principles — " +
        "a ordem GoF é sequência de estudo, não dependência.",
      suggestions: [
        "Bridge — clássico GoF, mas raro no dia a dia sênior (relacionado a Adapter)",
        "Flyweight — nicho: otimização de memória por compartilhamento de estado",
      ],
      concepts: [
        concept({ order: 10, title: "Adapter" }),
        concept({ order: 20, title: "Decorator" }),
        concept({ order: 30, title: "Facade" }),
        concept({ order: 40, title: "Proxy" }),
        concept({ order: 50, title: "Composite", note: "relaciona-se com Data Structures / Tree (Epic 01) — aplicação, não Requires" }),
      ],
    }),
    module({
      slug: "behavioral-patterns",
      order: 70,
      title: "Behavioral Patterns",
      requires: ["Design Principles"],
      summary:
        "Versão enxuta (11→5): Strategy, Observer, Command, State, Template Method. Requires só Design " +
        "Principles. Chain of Responsibility fica como Advanced/Optional para reconsiderar no Epic 05 · Platform.",
      suggestions: [
        "Chain of Responsibility (Advanced/Optional — reconsiderar na Fase 2 do Epic 05 · Platform, pela relação com middleware)",
        "Iterator — hoje resolvido por built-ins de linguagem",
        "Mediator — reduz acoplamento centralizando comunicação, mas nicho",
        "Memento — uso raro fora de undo/redo",
        "Visitor — poderoso mas complexo; nível avançado",
        "Interpreter — muito nichado (parsers / DSLs)",
      ],
      concepts: [
        concept({ order: 10, title: "Strategy" }),
        concept({ order: 20, title: "Observer" }),
        concept({ order: 30, title: "Command", collision: "≠ Command-Query Separation (Design Principles) — padrão de objeto que encapsula uma ação × princípio de separar leitura de escrita" }),
        concept({
          order: 40,
          title: "State",
          requires: ["Strategy"],
          note: "estruturalmente idêntico a Strategy (troca de comportamento em runtime) — ensinado em par por contraste de intenção",
        }),
        concept({ order: 50, title: "Template Method" }),
      ],
    }),
    module({
      slug: "enterprise-and-application-patterns",
      order: 80,
      title: "Enterprise & Application Patterns",
      requires: ["Dependency Injection & IoC", "Platform / Database Fundamentals"],
      summary:
        "Repository como base → Data Mapper × Active Record → Unit of Work → Service Layer → Specification e " +
        "DTO. Requires: Platform / Database Fundamentals — dependência formalizada na Fase 2 do Epic 05 (2026-09-05).",
      concepts: [
        concept({ order: 10, title: "Repository Pattern", note: "abstrai o acesso a dados atrás de uma interface de coleção" }),
        concept({ order: 20, title: "Data Mapper", requires: ["Repository Pattern"], note: "separa o objeto de domínio da forma como é persistido" }),
        concept({ order: 30, title: "Active Record", requires: ["Repository Pattern"], note: "contraste direto com Data Mapper — o objeto que se persiste" }),
        concept({ order: 40, title: "Unit of Work", requires: ["Repository Pattern"], note: "agrupa mudanças numa única transação lógica" }),
        concept({
          order: 50,
          title: "Service Layer",
          requires: ["Dependency Injection & IoC / Dependency Injection"],
          note: "orquestra casos de uso; depende de injeção de colaboradores",
          collision: "≠ Domain Service (Domain Modeling) — camada de orquestração × comportamento de domínio puro",
        }),
        concept({ order: 60, title: "Specification Pattern", note: "encapsula regra de negócio/consulta reutilizável e combinável" }),
        concept({ order: 70, title: "DTO", note: "objeto de transporte de dados entre camadas/fronteiras" }),
      ],
    }),
    module({
      slug: "domain-modeling",
      order: 90,
      title: "Domain Modeling",
      requires: ["Object-Oriented Design"],
      summary:
        "Framing (Domain → Domain Model → Ubiquitous Language) → blocos de construção (Entity/Value Object " +
        "revisitados → Aggregate → Aggregate Root → Domain Service → Domain Event) → fronteiras (Bounded " +
        "Context → Context Mapping). Capstone e ponte para Architecture.",
      concepts: [
        concept({ order: 10, title: "Domain", note: "framing da Story — o problema/negócio que o software modela" }),
        concept({ order: 20, title: "Domain Model", requires: ["Domain"] }),
        concept({ order: 30, title: "Ubiquitous Language", requires: ["Domain Model"], note: "vocabulário compartilhado entre dev e negócio" }),
        concept({
          order: 40,
          title: "Entity",
          requires: ["Software Design / Object-Oriented Design / Entity"],
          canonical: false,
          revisitOf: "Software Design / Object-Oriented Design / Entity",
          note: "não é uma 2ª Task canônica — aqui ganha framing DDD: identidade dentro de um Bounded Context",
        }),
        concept({
          order: 50,
          title: "Value Object",
          requires: ["Software Design / Object-Oriented Design / Value Object"],
          canonical: false,
          revisitOf: "Software Design / Object-Oriented Design / Value Object",
          note: "não é uma 2ª Task canônica — framing DDD",
        }),
        concept({
          order: 60,
          title: "Aggregate",
          requires: [
            "Software Design / Object-Oriented Design / Entity",
            "Software Design / Object-Oriented Design / Value Object",
          ],
          note: "cluster de objetos tratado como uma unidade de consistência",
        }),
        concept({ order: 70, title: "Aggregate Root", requires: ["Aggregate"], note: "a única porta de entrada do Aggregate" }),
        concept({ order: 80, title: "Domain Service", requires: ["Domain Model"], note: "comportamento de domínio que não pertence a nenhuma Entity/Value Object" }),
        concept({ order: 90, title: "Domain Event", requires: ["Domain Model"], note: "algo relevante que aconteceu no domínio" }),
        concept({
          order: 100,
          title: "Bounded Context",
          requires: ["Ubiquitous Language"],
          note: "capstone — a fronteira dentro da qual o modelo (e a linguagem) é consistente",
        }),
        concept({
          order: 110,
          title: "Context Mapping",
          requires: ["Bounded Context"],
          note: "capstone final — relação entre Bounded Contexts; ponte para Architecture / Architectural Styles",
        }),
      ],
    }),
  ],
});
