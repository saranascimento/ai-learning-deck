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
        concept({
          order: 10,
          title: "Object vs Class",
          note: "instância × definição — ponto de entrada da Story",
          summary:
            "A classe é a definição — quais dados e quais comportamentos algo tem —, e o objeto é uma instância " +
            "concreta dessa definição, com seu próprio estado. Uma classe, muitos objetos.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma classe descreve um tipo de coisa: que campos ela guarda e que operações oferece. Um objeto é uma " +
                "coisa concreta criada a partir dessa descrição — uma instância. Se a classe é a planta de uma casa, " +
                "os objetos são as casas construídas: todas seguem a mesma planta, mas cada uma tem seus próprios " +
                "moradores, sua cor de parede, seu estado.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Separar a definição das instâncias permite descrever o comportamento uma só vez e criar quantos " +
                "objetos forem necessários. Cada objeto guarda o próprio estado, independente dos outros: mudar o " +
                "saldo de uma conta não afeta as demais. Essa distinção é a base para tudo o que vem depois — identidade, " +
                "entidades, objetos de valor — porque a pergunta \"esses dois objetos são o mesmo?\" só faz " +
                "sentido quando se entende que dois objetos podem vir da mesma classe e ainda assim serem coisas " +
                "diferentes.",
            },
            {
              type: "paragraph",
              text:
                "Um detalhe comum de confusão: membros de instância (campos e métodos que pertencem a cada objeto) " +
                "versus membros estáticos (que pertencem à classe e são compartilhados). Um campo guardado na classe " +
                "existe uma vez só, visível para todas as instâncias — o que causa bugs quando se esperava um estado " +
                "por objeto.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "uma classe e dois objetos com estados independentes:" },
            {
              type: "code",
              language: "javascript",
              filename: "object-vs-class.js",
              code: [
                "// A classe: a definição (dados + comportamento)",
                "class Account {",
                "  constructor(owner, balance) {",
                "    this.owner = owner;",
                "    this.balance = balance;",
                "  }",
                "  deposit(amount) {",
                "    this.balance += amount;",
                "  }",
                "}",
                "",
                "// Os objetos: instâncias concretas, cada uma com seu estado",
                "const anaAccount = new Account(\"Ana\", 100);",
                "const brunoAccount = new Account(\"Bruno\", 500);",
                "",
                "anaAccount.deposit(50);",
                "console.log(anaAccount.balance);   // 150",
                "console.log(brunoAccount.balance); // 500  ← não foi afetada",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Account é escrita uma vez e define o que toda conta tem e faz. anaAccount e brunoAccount são objetos " +
                "distintos com estados independentes — depositar em uma não altera a outra.",
            },
            {
              type: "takeaway",
              text:
                "A classe define, o objeto existe: uma definição pode gerar muitos objetos, cada um com seu próprio " +
                "estado — e saber o que é de cada objeto e o que é da classe evita bugs de estado compartilhado.",
            },
          ],
          examples: [
            {
              title: "Estado por objeto",
              context: "Cada instância carrega seus próprios valores, mesmo vindo da mesma classe.",
              code: {
                language: "javascript",
                filename: "independent-state.js",
                code: [
                  "class Counter {",
                  "  count = 0;",
                  "  increment() { this.count += 1; }",
                  "}",
                  "",
                  "const a = new Counter();",
                  "const b = new Counter();",
                  "a.increment();",
                  "a.increment();",
                  "b.increment();",
                  "",
                  "console.log(a.count, b.count); // 2 1  — cada objeto contou por conta própria",
                ].join("\n"),
              },
              explanation:
                "O campo count está declarado uma vez na classe, mas cada objeto tem a sua cópia. Não há relação " +
                "entre a e b além do fato de terem a mesma definição.",
            },
            {
              title: "Membro da classe versus membro da instância",
              context: "O que é estático pertence à classe e existe uma vez só; o resto pertence a cada objeto.",
              code: {
                language: "javascript",
                filename: "static-vs-instance.js",
                code: [
                  "class User {",
                  "  static totalCreated = 0;          // da CLASSE: um valor só, compartilhado",
                  "",
                  "  constructor(name) {",
                  "    this.name = name;               // da INSTÂNCIA: um por objeto",
                  "    User.totalCreated += 1;",
                  "  }",
                  "}",
                  "",
                  "new User(\"Ana\");",
                  "new User(\"Bruno\");",
                  "console.log(User.totalCreated);     // 2  (acessado pela classe, não por um objeto)",
                ].join("\n"),
              },
              explanation:
                "totalCreated faz sentido como propriedade da classe (é uma contagem geral), enquanto name faz sentido " +
                "por objeto. Confundir os dois é um erro clássico.",
            },
            {
              title: "Mesma classe, objetos diferentes",
              context: "Ter os mesmos valores não torna dois objetos o mesmo objeto — o ponto de partida do próximo Concept.",
              code: {
                language: "javascript",
                filename: "same-class-different-objects.js",
                code: [
                  "class Point {",
                  "  constructor(x, y) { this.x = x; this.y = y; }",
                  "}",
                  "",
                  "const p1 = new Point(1, 2);",
                  "const p2 = new Point(1, 2);",
                  "",
                  "console.log(p1 === p2);   // false — são dois objetos, mesmo com os mesmos valores",
                  "const p3 = p1;",
                  "console.log(p1 === p3);   // true  — p3 é outro nome para o MESMO objeto",
                ].join("\n"),
              },
              explanation:
                "O operador === compara se é o mesmo objeto (a mesma referência), não se têm os mesmos valores. Essa " +
                "diferença entre \"mesmo objeto\" e \"objetos iguais\" é o assunto de Identity.",
            },
          ],
          exercise: {
            problem:
              "Um carrinho de compras foi implementado com uma classe, mas dois clientes diferentes estão vendo os " +
              "itens um do outro.",
            problemCode: {
              language: "javascript",
              filename: "cart.js",
              code: [
                "class Cart {",
                "  static items = [];          // ← declarado na classe",
                "",
                "  add(item) {",
                "    Cart.items.push(item);",
                "  }",
                "}",
                "",
                "const anaCart = new Cart();",
                "const brunoCart = new Cart();",
                "anaCart.add(\"livro\");",
                "console.log(Cart.items);      // [\"livro\"] — mas era só o carrinho da Ana!",
              ].join("\n"),
            },
            task:
              "Explique por que os carrinhos compartilham os itens e corrija o código para que cada carrinho tenha " +
              "os seus.",
            hint: "Um campo static pertence à classe, que existe uma vez só. O que precisa existir uma vez para cada objeto?",
            solution: {
              code: {
                language: "javascript",
                filename: "cart.fixed.js",
                code: [
                  "class Cart {",
                  "  items = [];                 // ← campo de instância: um array novo por objeto",
                  "",
                  "  add(item) {",
                  "    this.items.push(item);",
                  "  }",
                  "}",
                  "",
                  "const anaCart = new Cart();",
                  "const brunoCart = new Cart();",
                  "anaCart.add(\"livro\");",
                  "console.log(anaCart.items);   // [\"livro\"]",
                  "console.log(brunoCart.items); // []  — o carrinho do Bruno está vazio",
                ].join("\n"),
              },
              explanation:
                "Com static, existia um único array, pertencente à classe Cart, usado por todas as instâncias. Como campo " +
                "de instância, cada new Cart() cria o seu próprio array, e o estado deixa de ser compartilhado.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Identity",
          requires: ["Object vs Class"],
          note: "o que faz dois objetos serem \"o mesmo\" — reordenada para antes de Entity/Value Object (Requires real)",
          summary:
            "O que torna dois objetos \"o mesmo\": a mesma referência na memória, o mesmo identificador de domínio, " +
            "ou apenas os mesmos valores — três noções diferentes que precisam ser distinguidas.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Identidade responde à pergunta \"estes dois objetos são a mesma coisa?\". Há pelo menos três respostas " +
                "possíveis. Identidade de referência: é literalmente o mesmo objeto na memória (=== em JavaScript). " +
                "Identidade de domínio: representam a mesma coisa do mundo real, reconhecida por um identificador " +
                "(o usuário de id 42). Igualdade por valor: são intercambiáveis porque têm os mesmos dados (duas " +
                "notas de R$ 10).",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Sem essa distinção, comparações produzem resultados surpreendentes. Dois objetos que representam o mesmo " +
                "usuário, carregados de duas consultas ao banco, são objetos diferentes na memória — então uma " +
                "comparação por referência diz \"diferentes\", embora sejam a mesma pessoa. Por outro lado, dois " +
                "endereços com os mesmos campos são \"o mesmo endereço\" para quase todo fim prático, embora sejam " +
                "objetos diferentes. Escolher qual noção vale para cada tipo de objeto é uma decisão de projeto — e é " +
                "exatamente a diferença entre uma Entity e um Value Object.",
            },
            {
              type: "paragraph",
              text:
                "Na prática, isso vira uma pergunta a fazer para cada classe: o que faz duas instâncias serem " +
                "consideradas iguais? Se a resposta é \"o id\", a identidade é de domínio e os demais atributos podem " +
                "mudar; se é \"todos os valores\", a igualdade é por valor. E a resposta deve estar refletida em um " +
                "método explícito (equals), não deixada ao acaso do operador padrão.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "as três noções de \"ser o mesmo\" lado a lado:" },
            {
              type: "code",
              language: "javascript",
              filename: "identity.js",
              code: [
                "class User {",
                "  constructor(id, name) { this.id = id; this.name = name; }",
                "}",
                "",
                "const a = new User(42, \"Ana\");",
                "const b = new User(42, \"Ana Souza\");   // a mesma pessoa, carregada de outra consulta",
                "const c = a;",
                "",
                "// 1. Identidade de referência: o mesmo objeto na memória?",
                "console.log(a === c);         // true",
                "console.log(a === b);         // false  ← objetos diferentes",
                "",
                "// 2. Identidade de domínio: a mesma pessoa (pelo id)?",
                "console.log(a.id === b.id);   // true   ← é o usuário 42, mesmo com o nome diferente",
                "",
                "// 3. Igualdade por valor: todos os dados iguais?",
                "console.log(a.name === b.name);   // false",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada comparação responde a uma pergunta diferente, e nenhuma é \"a correta\" em abstrato. O " +
                "importante é saber qual delas faz sentido para o tipo em questão — para um usuário, o id; para uma " +
                "coordenada, os valores.",
            },
            {
              type: "takeaway",
              text:
                "\"Ser o mesmo\" pode significar mesma referência, mesmo id ou mesmos valores — decida qual vale para " +
                "cada tipo de objeto e expresse isso em código.",
            },
          ],
          examples: [
            {
              title: "Referência: mesmo objeto ou só parecido?",
              context: "O operador === em objetos compara referências, o que raramente é o que se quer comparar em dados.",
              code: {
                language: "javascript",
                filename: "reference-identity.js",
                code: [
                  "const price1 = { amount: 10, currency: \"BRL\" };",
                  "const price2 = { amount: 10, currency: \"BRL\" };",
                  "",
                  "console.log(price1 === price2);   // false — dois objetos, mesmo com valores iguais",
                  "",
                  "// Igualdade por valor precisa ser escrita de forma explícita:",
                  "const sameValue = (p, q) => p.amount === q.amount && p.currency === q.currency;",
                  "console.log(sameValue(price1, price2));  // true",
                ].join("\n"),
              },
              explanation:
                "Quem espera que duas quantias iguais sejam iguais tem uma surpresa. Por isso um tipo cuja igualdade é " +
                "por valor deve oferecer um método que compare os campos.",
            },
            {
              title: "Identidade de domínio: o mesmo cliente em duas cópias",
              context: "Objetos carregados em momentos ou lugares diferentes podem representar a mesma coisa do mundo real.",
              code: {
                language: "javascript",
                filename: "domain-identity.js",
                code: [
                  "class Customer {",
                  "  constructor(id, email) { this.id = id; this.email = email; }",
                  "  equals(other) { return other instanceof Customer && this.id === other.id; }",
                  "}",
                  "",
                  "const fromList   = new Customer(7, \"ana@antigo.com\");",
                  "const fromDetail = new Customer(7, \"ana@novo.com\");   // e-mail atualizado",
                  "",
                  "console.log(fromList === fromDetail);       // false  (objetos distintos)",
                  "console.log(fromList.equals(fromDetail));   // true   (é o cliente 7)",
                ].join("\n"),
              },
              explanation:
                "O e-mail mudou, mas a identidade continua sendo a mesma. Definir equals pelo id é o que permite, por " +
                "exemplo, encontrar um cliente em uma coleção mesmo com dados ligeiramente diferentes.",
            },
            {
              title: "Identidade ao longo do tempo",
              context: "Uma coisa continua sendo a mesma mesmo depois de mudar — o que importa é o que a identifica.",
              code: {
                language: "javascript",
                filename: "identity-over-time.js",
                code: [
                  "class Order {",
                  "  constructor(id) { this.id = id; this.status = \"created\"; }",
                  "  pay() { this.status = \"paid\"; }",
                  "  ship() { this.status = \"shipped\"; }",
                  "}",
                  "",
                  "const order = new Order(\"ORD-1001\");",
                  "order.pay();",
                  "order.ship();",
                  "// Seu estado mudou duas vezes, mas continua sendo o pedido ORD-1001.",
                ].join("\n"),
              },
              explanation:
                "O pedido passou por vários estados e não deixou de ser o mesmo. Essa é a característica de uma Entity: a " +
                "identidade persiste enquanto os atributos mudam.",
            },
          ],
          exercise: {
            problem:
              "A classe abaixo compara usuários com ===, e por isso uma busca em uma lista nunca encontra o " +
              "usuário quando ele vem de uma consulta diferente.",
            problemCode: {
              language: "javascript",
              filename: "find-user.js",
              code: [
                "class User {",
                "  constructor(id, name) { this.id = id; this.name = name; }",
                "}",
                "",
                "const users = [new User(1, \"Ana\"), new User(2, \"Bruno\")];",
                "const fresh = new User(2, \"Bruno\");   // o mesmo Bruno, vindo de outra consulta",
                "",
                "console.log(users.includes(fresh));    // false — deveria ser true",
              ].join("\n"),
            },
            task:
              "Adicione a User um método equals baseado na identidade de domínio, e mostre como encontrar o usuário " +
              "na lista usando-o.",
            hint: "Qual campo identifica de forma única um usuário? Compare só ele, e use some() ou find() no lugar de includes().",
            solution: {
              code: {
                language: "javascript",
                filename: "find-user.fixed.js",
                code: [
                  "class User {",
                  "  constructor(id, name) { this.id = id; this.name = name; }",
                  "  equals(other) { return other instanceof User && this.id === other.id; }",
                  "}",
                  "",
                  "const users = [new User(1, \"Ana\"), new User(2, \"Bruno\")];",
                  "const fresh = new User(2, \"Bruno\");",
                  "",
                  "console.log(users.some((user) => user.equals(fresh)));   // true",
                ].join("\n"),
              },
              explanation:
                "includes() compara referências, e fresh é outro objeto. Com equals baseado no id, a lista reconhece que se " +
                "trata do mesmo usuário. O nome poderia até estar diferente: a identidade é o id.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Entity",
          requires: ["Identity"],
          note: "objeto definido pela identidade que persiste no tempo, ainda que os atributos mudem",
          summary:
            "Um objeto do domínio definido pela sua identidade, não pelos seus atributos: ele continua sendo o mesmo " +
            "ao longo do tempo mesmo quando seus dados mudam.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Entity é um objeto que tem identidade própria e ciclo de vida. O que a define não é o que ela " +
                "contém em um dado momento, mas o fato de ser aquela coisa específica: o cliente 42, o pedido " +
                "ORD-1001, a conta 7. Seus atributos mudam (endereço, status, saldo), mas ela continua sendo a mesma. " +
                "Duas entidades são iguais se, e só se, têm o mesmo identificador.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Muitos conceitos do negócio precisam ser acompanhados ao longo do tempo: um pedido é criado, pago, " +
                "enviado, entregue — é sempre o mesmo pedido. Modelá-lo como um simples conjunto de valores não " +
                "capturaria isso: dois pedidos com os mesmos itens não são o mesmo pedido. A identidade é o que permite " +
                "referir-se a \"aquele pedido\" e rastrear o que aconteceu com ele.",
            },
            {
              type: "paragraph",
              text:
                "Cuidados de projeto: o identificador deve ser estável e único (gerado na criação, como um UUID, e não " +
                "derivado de atributos que podem mudar, como o e-mail); a igualdade deve comparar só o identificador; e " +
                "a entidade normalmente é mutável, mas suas mudanças devem passar por métodos que preservem as " +
                "regras do negócio, não por atribuições diretas de campos.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "uma entidade com identificador, estado que muda e igualdade pelo id:" },
            {
              type: "code",
              language: "javascript",
              filename: "entity.js",
              code: [
                "class Order {",
                "  #status = \"created\";",
                "",
                "  constructor(id, items) {",
                "    this.id = id;                       // identidade: estável e única",
                "    this.items = items;",
                "  }",
                "",
                "  get status() { return this.#status; }",
                "",
                "  pay() {",
                "    if (this.#status !== \"created\") throw new Error(\"pedido não pode ser pago\");",
                "    this.#status = \"paid\";",
                "  }",
                "",
                "  equals(other) {",
                "    return other instanceof Order && this.id === other.id;   // só o id conta",
                "  }",
                "}",
                "",
                "const order = new Order(\"ORD-1001\", [\"livro\"]);",
                "order.pay();   // o estado mudou, o pedido é o mesmo",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O pedido muda de status ao longo da vida, mas continua sendo ORD-1001. A regra de que só se paga um " +
                "pedido recém-criado fica dentro da própria entidade, em vez de espalhada por quem a usa.",
            },
            {
              type: "takeaway",
              text:
                "Uma entidade é \"aquela coisa\" — identificada por um id estável e igual a outra só se o id for o " +
                "mesmo, não importa o quanto seus atributos tenham mudado.",
            },
          ],
          examples: [
            {
              title: "Os atributos mudam, a identidade permanece",
              context: "A característica que define uma entidade: mudar sem deixar de ser ela mesma.",
              code: {
                language: "javascript",
                filename: "attributes-change.js",
                code: [
                  "class Customer {",
                  "  constructor(id, name, email) {",
                  "    this.id = id;",
                  "    this.name = name;",
                  "    this.email = email;",
                  "  }",
                  "  changeEmail(newEmail) { this.email = newEmail; }",
                  "  equals(other) { return other instanceof Customer && this.id === other.id; }",
                  "}",
                  "",
                  "const before = new Customer(7, \"Ana\", \"ana@antigo.com\");",
                  "const after  = new Customer(7, \"Ana\", \"ana@novo.com\");",
                  "",
                  "console.log(before.equals(after));   // true — é a cliente 7, com um e-mail diferente",
                ].join("\n"),
              },
              explanation:
                "O e-mail é um atributo que muda; o id não. Por isso a igualdade compara apenas o id, e a cliente é " +
                "reconhecida em qualquer momento da sua vida.",
            },
            {
              title: "Não use um atributo mutável como identidade",
              context: "Escolher um campo que pode mudar como identificador quebra a ligação entre a entidade e o seu histórico.",
              code: {
                language: "javascript",
                filename: "bad-identity.js",
                code: [
                  "// Ruim: o e-mail é a identidade — e ele pode mudar",
                  "const orders = new Map();",
                  "orders.set(\"ana@antigo.com\", [\"ORD-1\", \"ORD-2\"]);",
                  "// Ana troca de e-mail: os pedidos ficam \"órfãos\" na chave antiga",
                  "",
                  "// Melhor: um id gerado na criação, que nunca muda",
                  "const customer = { id: crypto.randomUUID(), email: \"ana@antigo.com\" };",
                  "orders.set(customer.id, [\"ORD-1\", \"ORD-2\"]);",
                ].join("\n"),
              },
              explanation:
                "O identificador é o vínculo entre a entidade e tudo o que se relaciona a ela. Se ele muda, esse " +
                "vínculo se perde. Um id gerado e imutável resolve.",
            },
            {
              title: "O ciclo de vida protege as regras",
              context: "A entidade não é só um saco de dados: ela controla as transições válidas do seu estado.",
              code: {
                language: "javascript",
                filename: "lifecycle.js",
                code: [
                  "class Subscription {",
                  "  #status = \"active\";",
                  "  get status() { return this.#status; }",
                  "",
                  "  cancel() {",
                  "    if (this.#status === \"canceled\") throw new Error(\"já cancelada\");",
                  "    this.#status = \"canceled\";",
                  "  }",
                  "  reactivate() {",
                  "    if (this.#status !== \"canceled\") throw new Error(\"só é possível reativar uma assinatura cancelada\");",
                  "    this.#status = \"active\";",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As transições válidas (ativa → cancelada → ativa) vivem na entidade, e é impossível colocá-la em um " +
                "estado inválido por engano, porque o campo não é alterado diretamente de fora.",
            },
          ],
          exercise: {
            problem:
              "Uma loja precisa modelar uma \"Conta de cliente\": ela tem um nome, um e-mail, um endereço e um " +
              "saldo de pontos, e todos esses dados podem mudar. Duas contas com os mesmos dados não são a mesma conta.",
            problemCode: {
              language: "javascript",
              filename: "account.js",
              code: [
                "// Comece a partir deste esqueleto:",
                "class CustomerAccount {",
                "  constructor(name, email, address) {",
                "    this.name = name;",
                "    this.email = email;",
                "    this.address = address;",
                "    this.points = 0;",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Transforme CustomerAccount em uma entidade: acrescente uma identidade estável (não derivada de " +
              "atributos mutáveis), a igualdade pelo id e um método que altere os pontos protegendo a regra de que " +
              "o saldo não fica negativo.",
            hint: "O id deve ser gerado uma vez, na criação, e nunca mudar. O método de pontos deve validar antes de alterar o saldo.",
            solution: {
              code: {
                language: "javascript",
                filename: "account.entity.js",
                code: [
                  "class CustomerAccount {",
                  "  #points = 0;",
                  "",
                  "  constructor(name, email, address, id = crypto.randomUUID()) {",
                  "    this.id = id;                 // identidade: gerada uma vez, nunca muda",
                  "    this.name = name;",
                  "    this.email = email;",
                  "    this.address = address;",
                  "  }",
                  "",
                  "  get points() { return this.#points; }",
                  "",
                  "  addPoints(amount) { this.#points += amount; }",
                  "",
                  "  redeemPoints(amount) {",
                  "    if (amount > this.#points) throw new Error(\"saldo de pontos insuficiente\");",
                  "    this.#points -= amount;",
                  "  }",
                  "",
                  "  equals(other) { return other instanceof CustomerAccount && this.id === other.id; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O id identifica a conta em qualquer momento, e a igualdade o usa. O saldo de pontos só muda por " +
                "métodos, então a regra \"nunca negativo\" está protegida pela própria entidade.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Value Object",
          requires: ["Identity"],
          note: "definido por contraste — igualdade por valor, sem identidade própria",
          summary:
            "Um objeto definido apenas pelos seus valores, sem identidade própria: dois com os mesmos dados são " +
            "intercambiáveis, e ele é imutável — para mudar, cria-se outro.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Value Object representa um valor do domínio: uma quantia em dinheiro, um e-mail, um intervalo de " +
                "datas, um endereço. Ao contrário da Entity, ele não tem identidade — o que importa são os " +
                "valores. Duas notas de R$ 10 são intercambiáveis; ninguém pergunta \"qual\" delas. Por isso a " +
                "igualdade é por valor, e o objeto costuma ser imutável: trocar o valor significa criar um novo objeto.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Value Objects tiram os conceitos do domínio de dentro de strings e números soltos, e resolvem o smell " +
                "Primitive Obsession (módulo Code Smells). Um e-mail como Email valida a si mesmo na criação e nunca " +
                "está inválido; dinheiro como Money carrega a moeda e impede somar reais com dólares; um intervalo de " +
                "datas garante que o fim não vem antes do início. A regra fica em um só lugar, e o objeto só existe " +
                "se for válido.",
            },
            {
              type: "paragraph",
              text:
                "Características: igualdade por valor (um método equals que compara os campos); imutabilidade (sem " +
                "setters; operações devolvem novos objetos); autovalidação no construtor; e comportamento próprio, " +
                "como Money.add(). A imutabilidade é essencial: como o objeto pode ser compartilhado sem risco, " +
                "ninguém o altera por baixo de quem o usa (veja Mutable vs Immutable Objects).",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "um objeto de valor para dinheiro: validado, imutável e com igualdade por valor:" },
            {
              type: "code",
              language: "javascript",
              filename: "value-object.js",
              code: [
                "class Money {",
                "  constructor(cents, currency) {",
                "    if (!Number.isInteger(cents)) throw new Error(\"centavos devem ser inteiros\");",
                "    this.cents = cents;",
                "    this.currency = currency;",
                "    Object.freeze(this);                       // imutável",
                "  }",
                "",
                "  add(other) {",
                "    if (other.currency !== this.currency) throw new Error(\"moedas diferentes\");",
                "    return new Money(this.cents + other.cents, this.currency);   // devolve um NOVO objeto",
                "  }",
                "",
                "  equals(other) {",
                "    return other instanceof Money && this.cents === other.cents && this.currency === other.currency;",
                "  }",
                "}",
                "",
                "const a = new Money(1000, \"BRL\");",
                "const b = new Money(1000, \"BRL\");",
                "console.log(a === b);        // false — objetos distintos",
                "console.log(a.equals(b));    // true  — mesmo valor: são o mesmo dinheiro",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Dois objetos Money com os mesmos valores são iguais para todos os efeitos. Somar devolve um novo " +
                "objeto, sem alterar os originais — por isso pode ser compartilhado sem cuidado.",
            },
            {
              type: "takeaway",
              text:
                "Se importa o valor e não a identidade, faça um Value Object: imutável, validado ao ser criado e igual " +
                "por valor — em vez de um primitivo solto que qualquer um pode usar errado.",
            },
          ],
          examples: [
            {
              title: "Email: valida uma vez, vale sempre",
              context: "Um objeto de valor só existe se for válido — quem o recebe não precisa conferir de novo.",
              code: {
                language: "javascript",
                filename: "email-vo.js",
                code: [
                  "class Email {",
                  "  constructor(value) {",
                  "    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value)) throw new Error(`e-mail inválido: ${value}`);",
                  "    this.value = value.toLowerCase();",
                  "    Object.freeze(this);",
                  "  }",
                  "  equals(other) { return other instanceof Email && this.value === other.value; }",
                  "}",
                  "",
                  "new Email(\"Ana@Mail.com\").equals(new Email(\"ana@mail.com\"));   // true (normalizado)",
                ].join("\n"),
              },
              explanation:
                "A validação e a normalização acontecem uma vez, no construtor. Qualquer função que receba um Email " +
                "sabe que ele é válido, sem repetir a checagem — o oposto de uma string solta.",
            },
            {
              title: "Modificar é criar outro",
              context: "Como o objeto é imutável, mudar um valor significa produzir um objeto novo.",
              code: {
                language: "javascript",
                filename: "with-methods.js",
                code: [
                  "class DateRange {",
                  "  constructor(start, end) {",
                  "    if (end < start) throw new Error(\"o fim não pode ser anterior ao início\");",
                  "    this.start = start;",
                  "    this.end = end;",
                  "    Object.freeze(this);",
                  "  }",
                  "  extendTo(newEnd) { return new DateRange(this.start, newEnd); }   // novo objeto",
                  "}",
                  "",
                  "const week = new DateRange(new Date(\"2026-03-01\"), new Date(\"2026-03-07\"));",
                  "const longer = week.extendTo(new Date(\"2026-03-14\"));",
                  "// week continua com o fim em 7/3; longer é outro intervalo",
                ].join("\n"),
              },
              explanation:
                "Quem guardou week não é afetado por quem estendeu o intervalo. Nenhum trecho do sistema pode alterar " +
                "um valor que outro trecho está usando.",
            },
            {
              title: "Entity ou Value Object? Depende do contexto",
              context: "O mesmo conceito pode ser um valor em um sistema e uma entidade em outro — a pergunta é se a identidade importa.",
              code: {
                language: "javascript",
                filename: "context-matters.js",
                code: [
                  "// Numa loja online: o endereço é só um valor — se muda, é outro endereço.",
                  "const shippingAddress = Object.freeze({ street: \"Rua A, 10\", city: \"Recife\", zip: \"50000-000\" });",
                  "",
                  "// Numa concessionária de energia: cada imóvel (com seu endereço) tem histórico de consumo,",
                  "// e o endereço identifica um ponto da rede — aí ele é uma ENTIDADE.",
                  "class ServicePoint {",
                  "  constructor(id, address) { this.id = id; this.address = address; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A pergunta certa é: preciso acompanhar essa coisa ao longo do tempo, distinguindo-a de outras iguais? Se sim, " +
                "é uma entidade; se só importa o que ela vale, é um valor.",
            },
          ],
          exercise: {
            problem:
              "Um sistema de reservas usa dois números soltos, \"amount\" e \"currency\", em todo lugar. Já " +
              "aconteceu de alguém somar 10 reais com 10 dólares e obter \"20\".",
            problemCode: {
              language: "javascript",
              filename: "booking.js",
              code: [
                "const roomPrice = 250;          // reais? dólares?",
                "const breakfast = 30;",
                "const total = roomPrice + breakfast;   // e se um deles for em outra moeda?",
                "",
                "function applyDiscount(price, rate) { return price - price * rate; }",
              ].join("\n"),
            },
            task:
              "Crie um Value Object Money (valor em centavos e moeda) que seja imutável, compare por valor, valide " +
              "seus dados e impeça somar moedas diferentes.",
            hint: "Congele a instância, faça add() devolver um novo Money e lance um erro se as moedas forem diferentes.",
            solution: {
              code: {
                language: "javascript",
                filename: "money.js",
                code: [
                  "class Money {",
                  "  constructor(cents, currency) {",
                  "    if (!Number.isInteger(cents) || cents < 0) throw new Error(\"valor inválido\");",
                  "    if (!currency) throw new Error(\"moeda obrigatória\");",
                  "    this.cents = cents;",
                  "    this.currency = currency;",
                  "    Object.freeze(this);",
                  "  }",
                  "  add(other) {",
                  "    if (other.currency !== this.currency) throw new Error(\"moedas diferentes\");",
                  "    return new Money(this.cents + other.cents, this.currency);",
                  "  }",
                  "  equals(other) { return other instanceof Money && this.cents === other.cents && this.currency === other.currency; }",
                  "}",
                  "",
                  "const total = new Money(25000, \"BRL\").add(new Money(3000, \"BRL\"));   // ok: 28000 BRL",
                  "new Money(25000, \"BRL\").add(new Money(3000, \"USD\"));               // lança: moedas diferentes",
                ].join("\n"),
              },
              explanation:
                "A soma de moedas diferentes deixou de ser possível por descuido: o erro aparece na hora. Como Money é " +
                "imutável e validado, pode ser passado livremente pelo sistema, sem risco de alteração.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Mutable vs Immutable Objects",
          requires: ["Programming Foundations / Functional Programming / Immutability"],
          note: "aplica o conceito de Immutability (Epic 01) a objetos com estado",
          summary:
            "Um objeto mutável pode ter seu estado alterado depois de criado; um imutável nunca muda — e cada " +
            "modelo tem seus custos e benefícios, com o compartilhamento de estado sendo o ponto crítico.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um objeto mutável permite que seus campos sejam alterados depois da criação (account.balance += 10). " +
                "Um objeto imutável, uma vez criado, nunca muda: qualquer \"alteração\" produz um objeto novo e deixa o " +
                "original intacto. É a aplicação da ideia de Immutability (módulo Functional Programming) a objetos " +
                "com estado, em vez de a simples valores.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "O problema central da mutabilidade é o aliasing: quando dois lugares do código referenciam o mesmo objeto, " +
                "uma mudança feita por um é sentida pelo outro, sem que ele saiba. Isso gera bugs difíceis de " +
                "rastrear, em que o valor mudou \"do nada\" — e piora com concorrência, em que duas linhas de " +
                "execução alteram o mesmo estado. Objetos imutáveis eliminam a classe inteira de problemas: podem " +
                "ser compartilhados e guardados livremente, porque ninguém pode alterá-los.",
            },
            {
              type: "paragraph",
              text:
                "Não há vencedor absoluto. A imutabilidade custa criar objetos novos a cada mudança e um estilo mais " +
                "verboso; a mutabilidade é natural para algo que evolui, como uma Entity. A regra prática: Value " +
                "Objects devem ser imutáveis; entidades podem ser mutáveis, mas de forma controlada (por métodos que " +
                "protegem as regras); e nunca exponha diretamente uma coleção interna mutável. Em JavaScript, " +
                "Object.freeze torna um objeto imutável, mas de forma rasa (só o primeiro nível).",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "o bug do aliasing com um objeto mutável, e a versão imutável que o evita:" },
            {
              type: "code",
              language: "javascript",
              filename: "mutable-vs-immutable.js",
              code: [
                "// Mutável: dois nomes para o mesmo objeto",
                "const original = { name: \"Ana\", city: \"Recife\" };",
                "const copy = original;             // não é uma cópia: é outra referência",
                "copy.city = \"São Paulo\";",
                "console.log(original.city);        // \"São Paulo\" ← alterou o original sem querer",
                "",
                "// Imutável: \"mudar\" é criar um novo objeto",
                "const frozen = Object.freeze({ name: \"Ana\", city: \"Recife\" });",
                "const moved = { ...frozen, city: \"São Paulo\" };",
                "console.log(frozen.city);          // \"Recife\" — o original está intacto",
                "console.log(moved.city);           // \"São Paulo\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na versão mutável, quem alterou copy afetou o original sem perceber. Na imutável, não há como isso " +
                "acontecer: cada versão do valor é independente das outras.",
            },
            {
              type: "takeaway",
              text:
                "Estado compartilhado e mutável é a raiz de muitos bugs — prefira imutabilidade para valores e " +
                "mutabilidade controlada para entidades, e nunca exponha o estado interno.",
            },
          ],
          examples: [
            {
              title: "O aliasing que quebra uma classe",
              context: "Devolver uma coleção interna permite que qualquer um altere o estado do objeto por fora.",
              code: {
                language: "javascript",
                filename: "aliasing-bug.js",
                code: [
                  "class Team {",
                  "  #members = [\"Ana\", \"Bruno\"];",
                  "  getMembers() { return this.#members; }   // devolve o array INTERNO",
                  "}",
                  "",
                  "const team = new Team();",
                  "team.getMembers().push(\"Intruso\");         // altera o estado interno por fora",
                  "console.log(team.getMembers());            // [\"Ana\", \"Bruno\", \"Intruso\"]",
                  "",
                  "// Corrigido: devolve uma cópia (ou uma versão somente leitura)",
                  "class SafeTeam {",
                  "  #members = [\"Ana\", \"Bruno\"];",
                  "  getMembers() { return [...this.#members]; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O campo privado não protege nada se o método entrega a referência para dentro. Devolver uma cópia mantém " +
                "o controle do estado na classe — é a encapsulação de verdade.",
            },
            {
              title: "Métodos que devolvem um novo objeto",
              context: "Uma classe imutável oferece operações que produzem versões alteradas, no lugar de alterar.",
              code: {
                language: "javascript",
                filename: "wither-methods.js",
                code: [
                  "class Point {",
                  "  constructor(x, y) { this.x = x; this.y = y; Object.freeze(this); }",
                  "  withX(newX) { return new Point(newX, this.y); }",
                  "  translate(dx, dy) { return new Point(this.x + dx, this.y + dy); }",
                  "}",
                  "",
                  "const origin = new Point(0, 0);",
                  "const moved = origin.translate(5, 3);",
                  "console.log(origin.x, moved.x);   // 0 5 — a origem nunca foi alterada",
                ].join("\n"),
              },
              explanation:
                "Quem tem uma referência para origin pode confiar que ela continuará sendo (0, 0). Isso simplifica o raciocínio: " +
                "o valor de um objeto é o que foi na criação, sempre.",
            },
            {
              title: "A armadilha do freeze raso",
              context: "Object.freeze protege apenas o primeiro nível; objetos aninhados continuam mutáveis.",
              code: {
                language: "javascript",
                filename: "shallow-freeze.js",
                code: [
                  "const config = Object.freeze({ name: \"app\", tags: [\"a\", \"b\"] });",
                  "",
                  "config.name = \"outro\";      // ignorado (ou erro em modo estrito)",
                  "config.tags.push(\"c\");      // FUNCIONA: o array interno não foi congelado",
                  "console.log(config.tags);    // [\"a\", \"b\", \"c\"]",
                  "",
                  "// Solução: congelar também os níveis internos (ou copiar ao guardar)",
                  "const safe = Object.freeze({ name: \"app\", tags: Object.freeze([\"a\", \"b\"]) });",
                ].join("\n"),
              },
              explanation:
                "A imutabilidade só vale se atingir todos os níveis. Por isso, ao criar um objeto imutável com " +
                "coleções, é preciso congelá-las ou guardá-las como cópias.",
            },
          ],
          exercise: {
            problem:
              "Esta classe de lista de compras é mutável de forma perigosa: quem a usa consegue alterar a lista " +
              "interna sem passar pelas regras da classe.",
            problemCode: {
              language: "javascript",
              filename: "shopping-list.js",
              code: [
                "class ShoppingList {",
                "  constructor() { this.items = []; }",
                "  add(item) {",
                "    if (!item) throw new Error(\"item vazio\");",
                "    this.items.push(item);",
                "  }",
                "}",
                "",
                "const list = new ShoppingList();",
                "list.add(\"pão\");",
                "list.items.push(\"\");        // burla a regra de item vazio",
                "list.items = null;            // e ainda quebra o objeto",
              ].join("\n"),
            },
            task:
              "Corrija a classe para proteger o estado: torne a lista privada, exponha uma visão somente leitura " +
              "(uma cópia) e mantenha a regra de validação como a única porta de entrada.",
            hint: "Um campo privado (#items) impede a atribuição direta; o acessor deve devolver uma cópia, não o array interno.",
            solution: {
              code: {
                language: "javascript",
                filename: "shopping-list.fixed.js",
                code: [
                  "class ShoppingList {",
                  "  #items = [];",
                  "",
                  "  add(item) {",
                  "    if (!item) throw new Error(\"item vazio\");",
                  "    this.#items.push(item);",
                  "  }",
                  "",
                  "  get items() { return [...this.#items]; }   // cópia: alterá-la não afeta o estado interno",
                  "}",
                  "",
                  "const list = new ShoppingList();",
                  "list.add(\"pão\");",
                  "list.items.push(\"\");        // altera só a cópia — a lista real continua [\"pão\"]",
                ].join("\n"),
              },
              explanation:
                "O estado só muda por add(), que valida. Devolver uma cópia impede o aliasing, e o campo privado impede a " +
                "substituição direta do array. A classe continua mutável, mas de forma controlada.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Tell, Don't Ask",
          note: "estilo de interação entre objetos — revisita informalmente Encapsulation (Epic 01), sem Requires estrito",
          summary:
            "Diga ao objeto o que fazer, em vez de perguntar pelos seus dados para decidir por ele — mantendo a " +
            "lógica junto do estado a que ela pertence.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Tell, Don't Ask (\"diga, não pergunte\") é um estilo de projeto em que quem chama envia uma instrução " +
                "para o objeto (order.ship()) em vez de consultar seu estado, tomar a decisão por fora e depois " +
                "alterar o objeto (if (order.status === \"paid\") order.status = \"shipped\"). A lógica sobre o " +
                "estado de um objeto deve estar dentro do objeto.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É o Encapsulation (módulo Programming Fundamentals) aplicado à interação entre objetos. Quando o " +
                "chamador pergunta pelos dados para decidir, o objeto vira um saco de campos e a regra de negócio " +
                "vaza para fora, sendo repetida por cada chamador. Se a regra mudar, é preciso achar todos os " +
                "lugares que a copiaram. É também o oposto do smell Feature Envy (módulo Code Smells): o " +
                "comportamento que pertence ao objeto acaba sendo escrito por quem só o usa.",
            },
            {
              type: "paragraph",
              text:
                "Com \"diga, não pergunte\", o objeto garante suas próprias regras: order.ship() sabe que só um pedido " +
                "pago pode ser enviado e recusa o resto. Não é um dogma: consultas para exibição, relatórios e " +
                "estruturas de dados puras (objetos de transferência) legitimamente expõem dados. A regra vale para " +
                "decisões e mudanças de estado: se você está lendo um valor de um objeto para decidir como alterá-lo, " +
                "provavelmente a decisão deveria estar no objeto.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "a mesma operação com a lógica fora e dentro do objeto:" },
            {
              type: "code",
              language: "javascript",
              filename: "tell-dont-ask.js",
              code: [
                "// Perguntando: quem chama decide com base nos dados do objeto",
                "if (account.balance >= amount) {",
                "  account.balance = account.balance - amount;",
                "} else {",
                "  throw new Error(\"saldo insuficiente\");",
                "}",
                "",
                "// Dizendo: o objeto cuida da própria regra",
                "class Account {",
                "  #balance = 0;",
                "  withdraw(amount) {",
                "    if (amount > this.#balance) throw new Error(\"saldo insuficiente\");",
                "    this.#balance -= amount;",
                "  }",
                "}",
                "",
                "account.withdraw(amount);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na primeira versão, toda pessoa que precisar sacar terá de repetir a verificação — e um dia alguém " +
                "esquecerá. Na segunda, a regra existe em um só lugar e é impossível de contornar.",
            },
            {
              type: "takeaway",
              text:
                "Se você lê o estado de um objeto para decidir como mudá-lo, mova essa decisão para dentro dele — " +
                "diga o que fazer e deixe o objeto cuidar das regras.",
            },
          ],
          examples: [
            {
              title: "A regra vazando para fora",
              context: "Quando a decisão está no chamador, cada novo chamador precisa reimplementá-la.",
              code: {
                language: "javascript",
                filename: "leaking-rule.js",
                code: [
                  "// Em três lugares diferentes do sistema:",
                  "if (order.status === \"paid\" && order.items.length > 0) { order.status = \"shipped\"; }",
                  "if (order.status === \"paid\" && order.items.length > 0) { order.status = \"shipped\"; notify(order); }",
                  "if (order.status === \"paid\") { order.status = \"shipped\"; }   // ← esqueceu de checar os itens",
                  "",
                  "// Dizendo:",
                  "order.ship();   // a regra (pago + com itens) existe uma vez, dentro de Order",
                ].join("\n"),
              },
              explanation:
                "A terceira cópia já divergiu das outras — o bug foi criado pela duplicação. Concentrar a regra no " +
                "objeto elimina essa possibilidade.",
            },
            {
              title: "Perguntar para exibir é legítimo",
              context: "A regra é sobre decisões e mudanças de estado; ler dados para mostrá-los não é o problema.",
              code: {
                language: "javascript",
                filename: "asking-is-fine.js",
                code: [
                  "// Exibir dados de um objeto: perguntar é natural",
                  "function renderOrderSummary(order) {",
                  "  return `Pedido ${order.id}: ${order.items.length} itens, total ${order.total}`;",
                  "}",
                  "",
                  "// Decidir e alterar o estado: aí vale \"dizer\"",
                  "order.cancel();",
                ].join("\n"),
              },
              explanation:
                "Objetos precisam expor consultas para serem mostrados ou serializados. O que se evita é o fluxo " +
                "\"leia o estado, decida fora, altere por fora\", que é o que espalha a regra de negócio.",
            },
            {
              title: "Comportamento junto do dado",
              context: "Um cálculo baseado só nos campos de um objeto pertence a ele.",
              code: {
                language: "javascript",
                filename: "behavior-with-data.js",
                code: [
                  "// Perguntando: quem chama monta o cálculo com os campos de Invoice",
                  "const total = invoice.items.reduce((sum, i) => sum + i.price * i.quantity, 0) - invoice.discount;",
                  "",
                  "// Dizendo:",
                  "class Invoice {",
                  "  total() {",
                  "    const subtotal = this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);",
                  "    return subtotal - this.discount;",
                  "  }",
                  "}",
                  "const total = invoice.total();",
                ].join("\n"),
              },
              explanation:
                "O cálculo do total usa só dados da fatura, então pertence à fatura. Cada lugar que precisa do total " +
                "pergunta pelo resultado (total()), não pelos ingredientes.",
            },
          ],
          exercise: {
            problem:
              "O código abaixo, espalhado pelo sistema, decide fora do objeto quando uma lâmpada inteligente pode " +
              "ser ligada, e altera seus campos diretamente.",
            problemCode: {
              language: "javascript",
              filename: "smart-lamp.js",
              code: [
                "class Lamp {",
                "  constructor() { this.isOn = false; this.burnedOut = false; this.hoursUsed = 0; }",
                "}",
                "",
                "// Em vários pontos do código:",
                "if (!lamp.burnedOut && !lamp.isOn) {",
                "  lamp.isOn = true;",
                "}",
                "if (lamp.hoursUsed > 1000) {",
                "  lamp.burnedOut = true;",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Tell, Don't Ask: mova as regras para dentro de Lamp, expondo métodos como turnOn() e " +
              "registerUsage(hours), e proteja os campos.",
            hint: "As regras \"não liga se queimada\" e \"queima acima de 1000 horas\" pertencem à lâmpada. Quem usa só deveria dizer o que quer.",
            solution: {
              code: {
                language: "javascript",
                filename: "smart-lamp.fixed.js",
                code: [
                  "class Lamp {",
                  "  #isOn = false;",
                  "  #burnedOut = false;",
                  "  #hoursUsed = 0;",
                  "",
                  "  get isOn() { return this.#isOn; }",
                  "",
                  "  turnOn() {",
                  "    if (this.#burnedOut) throw new Error(\"lâmpada queimada\");",
                  "    this.#isOn = true;",
                  "  }",
                  "",
                  "  registerUsage(hours) {",
                  "    this.#hoursUsed += hours;",
                  "    if (this.#hoursUsed > 1000) this.#burnedOut = true;",
                  "  }",
                  "}",
                  "",
                  "lamp.turnOn();            // quem usa só diz o que quer",
                  "lamp.registerUsage(2);",
                ].join("\n"),
              },
              explanation:
                "As duas regras estão em um só lugar e não podem ser burladas: os campos são privados e só mudam por " +
                "métodos. Os chamadores não repetem mais as verificações.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Law of Demeter (Principle of Least Knowledge)",
          requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
          note: "consolida os dois nomes (sinônimos na literatura) — regra concreta para minimizar acoplamento entre objetos",
          collision: "Law of Demeter = Principle of Least Knowledge — mesma coisa, dois nomes",
          summary:
            "Um objeto deve conversar apenas com seus vizinhos imediatos — e não com os objetos que estão dentro deles. " +
            "É uma regra concreta para reduzir acoplamento: \"não fale com estranhos\".",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "A Lei de Deméter (ou Princípio do Menor Conhecimento) diz que um método só deve chamar métodos de: " +
                "o próprio objeto, seus parâmetros, objetos que ele mesmo cria e seus componentes diretos. Ele " +
                "não deve navegar pela estrutura interna de objetos que recebeu: order.getCustomer().getAddress()." +
                "getCity() é o exemplo típico de violação — quem chama fica sabendo que o pedido tem um cliente, que o " +
                "cliente tem um endereço e que o endereço tem uma cidade.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Cada objeto que o seu código conhece é uma dependência. Uma cadeia de chamadas acopla quem chama a toda " +
                "a estrutura intermediária: se o endereço deixar de ser um objeto do cliente (passar a ser do " +
                "pedido, ou uma coleção), todo código que navegava pela cadeia quebra. É a regra concreta " +
                "para aplicar a ideia de baixo acoplamento (Coupling, módulo Programming Fundamentals) entre objetos.",
            },
            {
              type: "paragraph",
              text:
                "A correção é pedir ao vizinho imediato o que se quer saber, deixando-o delegar: order.deliveryCity() " +
                "esconde o caminho. Cuidado com o exagero: a \"regra do único ponto\" não é literal. Encadear métodos " +
                "de uma API fluente (lista.filter().map()) ou navegar por estruturas de dados puras não " +
                "viola a lei de forma relevante, pois o que importa é o acoplamento a estruturas internas de " +
                "objetos de domínio, não a contagem de pontos.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "uma cadeia que expõe a estrutura e a versão que delega:" },
            {
              type: "code",
              language: "javascript",
              filename: "law-of-demeter.js",
              code: [
                "// Viola: quem chama conhece Order → Customer → Address → city",
                "const city = order.customer.address.city;",
                "",
                "// Respeita: Order expõe o que os outros querem saber",
                "class Order {",
                "  constructor(customer) { this.customer = customer; }",
                "  deliveryCity() { return this.customer.deliveryCity(); }",
                "}",
                "class Customer {",
                "  constructor(address) { this.address = address; }",
                "  deliveryCity() { return this.address.city; }",
                "}",
                "",
                "const city = order.deliveryCity();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Se o endereço passar a ficar em outro lugar, só Customer precisa mudar. Quem consulta a cidade de " +
                "entrega continua chamando order.deliveryCity() e nem percebe.",
            },
            {
              type: "takeaway",
              text:
                "Converse só com seus vizinhos imediatos: peça o que precisa a quem você conhece, em vez de navegar por " +
                "dentro dos objetos dele.",
            },
          ],
          examples: [
            {
              title: "O que é permitido chamar",
              context: "A lei lista quem são os \"vizinhos\" de um método: o resto é estranho.",
              code: {
                language: "javascript",
                filename: "allowed-calls.js",
                code: [
                  "class Checkout {",
                  "  process(cart, payment) {",
                  "    this.validate(cart);                 // ✔ o próprio objeto",
                  "    const total = cart.total();          // ✔ um parâmetro recebido",
                  "    const receipt = new Receipt(total);  // ✔ um objeto que eu mesmo crio",
                  "    this.gateway.charge(total);          // ✔ um componente direto meu",
                  "    payment.card.bank.authorize(total);  // ✘ navegando por dentro do parâmetro",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As quatro primeiras chamadas envolvem objetos que o método legitimamente conhece. A última depende de " +
                "que payment tenha um card que tenha um bank — uma estrutura que não é assunto de Checkout.",
            },
            {
              title: "Delegar em vez de expor",
              context: "Em vez de deixar o chamador navegar, ofereça a operação no nível em que ele já está.",
              code: {
                language: "javascript",
                filename: "delegate.js",
                code: [
                  "// Antes: o relatório precisa conhecer a estrutura interna de Invoice",
                  "const zip = invoice.getOrder().getCustomer().getBillingAddress().getZip();",
                  "",
                  "// Depois: Invoice oferece o que o relatório precisa",
                  "class Invoice {",
                  "  billingZip() { return this.order.customer.billingAddress.zip; }",
                  "}",
                  "const zip = invoice.billingZip();",
                ].join("\n"),
              },
              explanation:
                "A navegação ainda existe, mas dentro de Invoice, que a conhece — e é o único lugar a alterar se a " +
                "estrutura mudar.",
            },
            {
              title: "Nem toda cadeia é violação",
              context: "APIs fluentes e estruturas de dados não expõem detalhes internos de objetos de domínio.",
              code: {
                language: "javascript",
                filename: "not-a-violation.js",
                code: [
                  "// Encadear operações sobre o MESMO tipo (uma API fluente) não é problema:",
                  "const names = users.filter((u) => u.isActive).map((u) => u.name).sort();",
                  "",
                  "// Ler dados de um objeto de transferência (só dados) também é aceitável:",
                  "const city = response.data.address.city;",
                ].join("\n"),
              },
              explanation:
                "O objetivo é evitar acoplamento a estruturas internas de objetos com comportamento. Encadeamento sobre o " +
                "mesmo tipo ou leitura de dados puros não cria essa dependência.",
            },
          ],
          exercise: {
            problem:
              "Este código de um sistema de biblioteca navega por três objetos para descobrir se o leitor de um " +
              "empréstimo tem multas pendentes.",
            problemCode: {
              language: "javascript",
              filename: "library.js",
              code: [
                "function canRenew(loan) {",
                "  if (loan.getReader().getAccount().getFines().length > 0) return false;",
                "  return loan.getBook().getStatus() !== \"reserved\";",
                "}",
              ].join("\n"),
            },
            task:
              "Refatore para respeitar a Lei de Deméter: introduza métodos de delegação nos objetos apropriados e " +
              "deixe canRenew falando só com o empréstimo.",
            hint: "Quem deveria responder \"o leitor tem multas?\" e \"o livro está reservado?\" — e por qual objeto vizinho canRenew pode perguntar?",
            solution: {
              code: {
                language: "javascript",
                filename: "library.fixed.js",
                code: [
                  "class Loan {",
                  "  readerHasFines() { return this.reader.hasFines(); }",
                  "  bookIsReserved() { return this.book.isReserved(); }",
                  "}",
                  "class Reader {",
                  "  hasFines() { return this.account.fines.length > 0; }",
                  "}",
                  "class Book {",
                  "  isReserved() { return this.status === \"reserved\"; }",
                  "}",
                  "",
                  "function canRenew(loan) {",
                  "  return !loan.readerHasFines() && !loan.bookIsReserved();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "canRenew só conhece Loan. Cada objeto responde sobre o que é seu, e a estrutura interna (Reader tem " +
                "Account, Account tem multas) pode mudar sem quebrar quem decide a renovação.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Anemic Domain Model",
          requires: ["Software Design / Object-Oriented Design / Entity"],
          note: "modelo onde o objeto só guarda dados, sem comportamento",
          summary:
            "Um modelo em que os objetos do domínio só guardam dados (getters e setters) e toda a lógica fica em " +
            "serviços separados — a forma de orientação a objetos sem os benefícios dela.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um modelo de domínio anêmico tem classes que se parecem com objetos de negócio (Order, Customer, " +
                "Account), mas que são só contêineres de dados: campos, getters e setters, sem regras. Toda a lógica " +
                "— validar, calcular, mudar de estado — vive em classes de serviço (OrderService, AccountService) que " +
                "manipulam esses dados por fora. Martin Fowler o descreveu como um anti-padrão: tem a estrutura de " +
                "orientação a objetos e o estilo procedural.",
            },
            { type: "heading", text: "Por que é um problema?" },
            {
              type: "paragraph",
              text:
                "Como qualquer código pode alterar qualquer campo, os objetos não conseguem proteger suas regras: um pedido " +
                "pode ser \"enviado\" sem estar pago, uma conta pode ficar com saldo negativo, porque nada impede o " +
                "setter. As regras ficam espalhadas e duplicadas nos serviços, e ninguém sabe onde estão todas. É " +
                "exatamente o contrário de Tell, Don't Ask: o objeto é passivo, e os serviços perguntam e decidem por ele.",
            },
            {
              type: "paragraph",
              text:
                "Sinais: classes só com getters e setters; serviços com muitos métodos que recebem uma entidade e mexem em " +
                "seus campos; validações repetidas em vários serviços; objetos que estão em estado inválido com " +
                "facilidade. Vale a ressalva: nem todo objeto de dados é um problema. Objetos de transferência " +
                "(DTOs) e aplicações simples de cadastro (CRUD), sem regras de negócio relevantes, podem viver bem " +
                "assim. O anti-padrão é quando há regras de negócio e elas estão fora dos objetos.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "um pedido anêmico e um serviço que carrega todas as regras:" },
            {
              type: "code",
              language: "javascript",
              filename: "anemic-domain-model.js",
              code: [
                "// O \"objeto de domínio\": só dados, aceita qualquer coisa",
                "class Order {",
                "  constructor() { this.items = []; this.status = \"created\"; }",
                "  getStatus() { return this.status; }",
                "  setStatus(status) { this.status = status; }",
                "  getItems() { return this.items; }",
                "}",
                "",
                "// A lógica está em outro lugar",
                "class OrderService {",
                "  ship(order) {",
                "    if (order.getStatus() !== \"paid\") throw new Error(\"pedido não pago\");",
                "    order.setStatus(\"shipped\");",
                "  }",
                "}",
                "",
                "// Nada impede de burlar o serviço:",
                "const order = new Order();",
                "order.setStatus(\"shipped\");   // enviado sem pagamento e sem itens",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A regra \"só envia se pago\" existe, mas só se todos os chamadores usarem o serviço. Como o objeto " +
                "aceita qualquer status, qualquer código pode contorná-la — e é questão de tempo até alguém fazer isso.",
            },
            {
              type: "takeaway",
              text:
                "Se seus objetos de negócio são só getters e setters e a lógica está em serviços, as regras estão " +
                "desprotegidas — o objeto deveria ser o guardião do próprio estado.",
            },
          ],
          examples: [
            {
              title: "Invariantes que ninguém protege",
              context: "Sem comportamento no objeto, é fácil colocá-lo em um estado que o negócio consideraria impossível.",
              code: {
                language: "javascript",
                filename: "broken-invariants.js",
                code: [
                  "class BankAccount {",
                  "  constructor() { this.balance = 0; }",
                  "  setBalance(value) { this.balance = value; }",
                  "}",
                  "",
                  "const account = new BankAccount();",
                  "account.setBalance(-5000);   // saldo negativo sem nenhum limite: aceito sem reclamar",
                  "// A regra \"não pode ficar negativo\" só existe se todo mundo se lembrar de aplicá-la.",
                ].join("\n"),
              },
              explanation:
                "O objeto representa uma conta, mas não sabe nada sobre contas. Qualquer parte do código pode " +
                "violar o negócio, e o compilador (e os testes de quem escreveu a violação) não avisam.",
            },
            {
              title: "Lógica duplicada entre serviços",
              context: "Sem um lugar natural para a regra, cada serviço escreve a sua versão.",
              code: {
                language: "javascript",
                filename: "duplicated-rules.js",
                code: [
                  "class OrderService {",
                  "  cancel(order) {",
                  "    if (order.status === \"shipped\") throw new Error(\"já enviado\");",
                  "    order.status = \"canceled\";",
                  "  }",
                  "}",
                  "class RefundService {",
                  "  refund(order) {",
                  "    if (order.status === \"shipped\" || order.status === \"canceled\") throw new Error(\"não reembolsável\");",
                  "    // ...outra versão da mesma regra de estado, já um pouco diferente",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A regra sobre os estados do pedido está em dois serviços, com pequenas diferenças. Cada nova " +
                "funcionalidade traz mais uma cópia — e mais uma chance de divergir.",
            },
            {
              title: "Quando um modelo simples de dados é apropriado",
              context: "O problema é regra de negócio fora do objeto, não a existência de objetos de dados.",
              code: {
                language: "javascript",
                filename: "dto-is-fine.js",
                code: [
                  "// Objeto de transferência: só carrega dados entre camadas — não é um problema",
                  "const userDto = { id: 7, name: \"Ana\", email: \"ana@mail.com\" };",
                  "",
                  "// Cadastro simples sem regras (CRUD): um modelo de dados direto pode bastar",
                  "app.post(\"/tags\", (req, res) => db.tags.insert({ name: req.body.name }));",
                ].join("\n"),
              },
              explanation:
                "Não crie comportamento onde não há regras: seria complexidade sem benefício (KISS). O modelo rico compensa " +
                "quando o domínio tem regras que precisam ser protegidas.",
            },
          ],
          exercise: {
            problem:
              "Analise o código abaixo, de um sistema de matrículas, e identifique por que ele é um modelo anêmico e quais " +
              "problemas isso causa.",
            problemCode: {
              language: "javascript",
              filename: "enrollment.js",
              code: [
                "class Course {",
                "  constructor(capacity) { this.capacity = capacity; this.students = []; }",
                "}",
                "",
                "class EnrollmentService {",
                "  enroll(course, student) {",
                "    if (course.students.length >= course.capacity) throw new Error(\"turma cheia\");",
                "    course.students.push(student);",
                "  }",
                "}",
                "",
                "// Em outro ponto do sistema:",
                "course.students.push(newStudent);   // não passou pelo serviço",
              ].join("\n"),
            },
            task:
              "Liste os sinais de modelo anêmico no código e o problema concreto que aparece na última linha.",
            hint: "Olhe onde está a regra da capacidade, e o que impede alguém de ignorá-la.",
            solution: {
              code: {
                language: "text",
                filename: "analysis.txt",
                code: [
                  "Sinais de modelo anêmico:",
                  "1. Course só tem dados (capacity, students), nenhuma regra: é um saco de campos.",
                  "2. A regra de negócio (\"turma cheia\") está em EnrollmentService, fora do objeto a que pertence.",
                  "3. Course expõe o array students, que qualquer código pode alterar diretamente.",
                  "",
                  "Problema concreto: a última linha contorna a regra e coloca alunos além da capacidade,",
                  "porque nada no objeto impede isso. A regra só vale para quem lembrar de usar o serviço.",
                ].join("\n"),
              },
              explanation:
                "O objeto que deveria garantir \"nunca mais alunos que a capacidade\" não tem como fazê-lo, já que expõe " +
                "os dados e não tem comportamento. É a pergunta que leva ao próximo Concept: como dar ao " +
                "objeto a responsabilidade pelas suas regras?",
            },
          },
        }),
        concept({
          order: 90,
          title: "Rich Domain Model",
          requires: ["Anemic Domain Model"],
          note: "contraste direto — objeto com dados + comportamento",
          summary:
            "Um modelo em que os objetos do domínio combinam dados e comportamento, expõem operações na linguagem do " +
            "negócio e protegem as suas próprias regras — de modo que não seja possível colocá-los em estado inválido.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Em um modelo de domínio rico, os objetos são donos das regras do negócio. Em vez de setters, oferecem " +
                "operações com nomes do domínio (course.enroll(student), account.withdraw(amount), order.ship()), que " +
                "validam antes de mudar o estado. O estado interno é protegido: só é alterado por esses métodos, e por " +
                "isso o objeto nunca fica em um estado que o negócio considera inválido. É o contraponto direto do " +
                "modelo anêmico.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Colocar as regras dentro dos objetos as concentra em um lugar só, e faz com que sejam impossíveis " +
                "de contornar. Os testes ficam simples (basta criar o objeto e chamar o método). O código lê como " +
                "o negócio fala: course.enroll(student) diz muito mais do que um serviço manipulando campos. E o " +
                "objeto passa a ser uma unidade coesa: dados e o comportamento que os usa vivem juntos, o oposto do " +
                "acoplamento entre serviço e estrutura de dados.",
            },
            {
              type: "paragraph",
              text:
                "O modelo rico exige mais cuidado de projeto: é preciso descobrir onde cada regra mora, e nem tudo " +
                "cabe em um único objeto — operações que envolvem vários objetos ou serviços externos (enviar um " +
                "e-mail, cobrar no cartão) continuam em serviços de aplicação que orquestram, sem conter regras " +
                "de negócio. Para aplicações simples de cadastro, sem regras relevantes, o esforço não compensa: a " +
                "escolha entre rico e anêmico deve refletir a complexidade real do domínio.",
            },
            { type: "heading", text: "Exemplo mínimo" },
            { type: "paragraph", text: "o mesmo domínio do Concept anterior, agora com as regras dentro do objeto:" },
            {
              type: "code",
              language: "javascript",
              filename: "rich-domain-model.js",
              code: [
                "class Course {",
                "  #students = [];",
                "",
                "  constructor(capacity) {",
                "    if (capacity <= 0) throw new Error(\"capacidade inválida\");",
                "    this.capacity = capacity;",
                "  }",
                "",
                "  enroll(student) {",
                "    if (this.#students.length >= this.capacity) throw new Error(\"turma cheia\");",
                "    if (this.#students.includes(student)) throw new Error(\"aluno já matriculado\");",
                "    this.#students.push(student);",
                "  }",
                "",
                "  get students() { return [...this.#students]; }",
                "}",
                "",
                "const course = new Course(2);",
                "course.enroll(\"Ana\");",
                "course.enroll(\"Bruno\");",
                "course.enroll(\"Carla\");   // lança: turma cheia — sem como contornar",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As regras (capacidade e matrícula única) estão dentro de Course, e o array é privado, então não " +
                "existe caminho para ultrapassá-las. Quem usa apenas diz course.enroll(student).",
            },
            {
              type: "takeaway",
              text:
                "Dê ao objeto os dados e as regras que os governam, exponha operações do negócio em vez de setters — " +
                "e o estado inválido deixa de ser representável.",
            },
          ],
          examples: [
            {
              title: "Linguagem do domínio em vez de setters",
              context: "Os métodos dizem o que acontece no negócio, não que um campo foi alterado.",
              code: {
                language: "javascript",
                filename: "domain-language.js",
                code: [
                  "// Anêmico: o que significa \"setStatus(\"frozen\")\"? Quem garante que é permitido?",
                  "account.setStatus(\"frozen\");",
                  "",
                  "// Rico: a intenção e as regras estão no método",
                  "class Account {",
                  "  #status = \"active\";",
                  "  freeze() {",
                  "    if (this.#status === \"closed\") throw new Error(\"conta encerrada não pode ser congelada\");",
                  "    this.#status = \"frozen\";",
                  "  }",
                  "}",
                  "account.freeze();",
                ].join("\n"),
              },
              explanation:
                "account.freeze() lê como o negócio e leva junto as regras. O código deixa de ser um conjunto de " +
                "atribuições e passa a ser uma descrição do que a conta pode fazer.",
            },
            {
              title: "Estado inválido não pode ser representado",
              context: "A força do modelo rico: os invariantes são garantidos desde a criação e em cada mudança.",
              code: {
                language: "javascript",
                filename: "valid-by-construction.js",
                code: [
                  "class Order {",
                  "  #items;",
                  "  constructor(items) {",
                  "    if (items.length === 0) throw new Error(\"um pedido precisa de ao menos um item\");",
                  "    this.#items = [...items];",
                  "  }",
                  "  removeItem(index) {",
                  "    if (this.#items.length === 1) throw new Error(\"não é possível remover o último item\");",
                  "    this.#items.splice(index, 1);",
                  "  }",
                  "}",
                  "// Não existe pedido sem itens: nem ao criar, nem depois de remover.",
                ].join("\n"),
              },
              explanation:
                "Não há como obter um Order vazio, então nenhum código que receba um Order precisa verificar isso — o " +
                "tipo garante. Todo o sistema fica mais simples por causa disso.",
            },
            {
              title: "Serviços orquestram, objetos decidem",
              context: "Operações que envolvem várias partes continuam em serviços — mas sem carregar regras de negócio.",
              code: {
                language: "javascript",
                filename: "orchestration.js",
                code: [
                  "class ShipOrderService {",
                  "  constructor(orders, mailer) { this.orders = orders; this.mailer = mailer; }",
                  "",
                  "  async execute(orderId) {",
                  "    const order = await this.orders.find(orderId);   // buscar",
                  "    order.ship();                                    // a REGRA está no objeto",
                  "    await this.orders.save(order);                   // persistir",
                  "    await this.mailer.send(order.customerEmail, \"Seu pedido foi enviado\");   // notificar",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O serviço coordena a sequência (buscar, executar, salvar, notificar) e não decide nada sobre o negócio: " +
                "\"pode enviar?\" é resposta de order.ship(). Essa divisão é a que mantém o modelo rico sem inchar os objetos.",
            },
          ],
          exercise: {
            problem:
              "Uma conta bancária foi modelada de forma anêmica, com um serviço que faz as regras de saque. Já " +
              "aconteceram saques contornando o serviço.",
            problemCode: {
              language: "javascript",
              filename: "bank-account.js",
              code: [
                "class BankAccount {",
                "  constructor() { this.balance = 0; }",
                "  getBalance() { return this.balance; }",
                "  setBalance(value) { this.balance = value; }",
                "}",
                "",
                "class AccountService {",
                "  withdraw(account, amount) {",
                "    if (amount <= 0) throw new Error(\"valor inválido\");",
                "    if (amount > account.getBalance()) throw new Error(\"saldo insuficiente\");",
                "    account.setBalance(account.getBalance() - amount);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Transforme em um modelo rico: mova as regras para a conta, esconda o saldo, ofereça deposit e " +
              "withdraw com validação e torne impossível colocar a conta em um estado inválido.",
            hint: "Um campo privado para o saldo, sem setter, e métodos com os nomes do domínio que validam antes de alterar.",
            solution: {
              code: {
                language: "javascript",
                filename: "bank-account.rich.js",
                code: [
                  "class BankAccount {",
                  "  #balance = 0;",
                  "",
                  "  get balance() { return this.#balance; }",
                  "",
                  "  deposit(amount) {",
                  "    if (amount <= 0) throw new Error(\"valor inválido\");",
                  "    this.#balance += amount;",
                  "  }",
                  "",
                  "  withdraw(amount) {",
                  "    if (amount <= 0) throw new Error(\"valor inválido\");",
                  "    if (amount > this.#balance) throw new Error(\"saldo insuficiente\");",
                  "    this.#balance -= amount;",
                  "  }",
                  "}",
                  "",
                  "const account = new BankAccount();",
                  "account.deposit(100);",
                  "account.withdraw(30);          // saldo: 70",
                  "account.withdraw(500);         // lança: saldo insuficiente — e não há como burlar",
                ].join("\n"),
              },
              explanation:
                "O saldo só muda por deposit e withdraw, que validam. Não existe mais um setter para contornar a regra, e o " +
                "AccountService deixou de ser necessário para esse fim. A conta agora é a guardiã do próprio estado.",
            },
          },
        }),
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
