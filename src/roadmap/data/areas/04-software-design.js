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
            "Object vs Class é a diferença entre a definição de um tipo de coisa, a classe, e uma coisa concreta " +
            "criada a partir dela, o objeto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A classe diz que campos esse tipo guarda e que operações oferece; o objeto é uma instância, com o seu " +
                "próprio estado. Se a classe é a planta de uma casa, os objetos são as casas construídas: todas seguem a " +
                "mesma planta, mas cada uma tem seus próprios moradores, sua cor de parede, seu estado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Escreva o comportamento uma vez na classe e confie que cada objeto cuida só do seu próprio estado.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Membro da classe (`static`) é compartilhado por todos os objetos: um contador ou cache ali vira estado " +
                "global disfarçado.",
                "Confundir a classe com o objeto leva a esperar que alterar um objeto mude os outros; cada instância guarda " +
                "o seu próprio estado.",
              ],
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
          summary: "Identity é o que faz dois objetos serem considerados a mesma coisa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Há pelo menos três respostas possíveis. Identidade de referência: é literalmente o mesmo objeto na " +
                "memória (=== em JavaScript). Identidade de domínio: representam a mesma coisa do mundo real, reconhecida " +
                "por um identificador (o usuário de id 42). Igualdade por valor: são intercambiáveis porque têm os mesmos " +
                "dados (duas notas de R$ 10).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Para cada tipo de objeto, decida qual das três noções de \"mesmo\" vale e deixe isso explícito no código.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "`===` compara referência: duas cópias com os mesmos dados são objetos diferentes, mesmo representando o " +
                "mesmo cliente.",
                "Comparar todos os campos como se fosse identidade quebra quando um atributo muda; um id estável não quebra.",
                "Nem todo tipo precisa de identidade: para valores puros, comparar pelos dados é o correto.",
              ],
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
            "Uma Entity é um objeto do domínio definido pela sua identidade, que continua o mesmo mesmo quando os " +
            "seus dados mudam.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ela tem ciclo de vida. O que a define não é o que ela contém em um dado momento, mas o fato de ser " +
                "aquela coisa específica: o cliente 42, o pedido ORD-1001, a conta 7. Seus atributos mudam (endereço, " +
                "status, saldo), mas ela continua sendo a mesma. Duas entidades são iguais se, e só se, têm o mesmo " +
                "identificador.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Duas entidades com todos os dados iguais ainda são coisas diferentes se os seus ids forem diferentes.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o objeto precisa ser reconhecido como o mesmo ao longo do tempo: cliente, pedido, conta.",
                "Quando ele tem ciclo de vida, com estados e regras sobre como passa de um para outro.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não use um atributo mutável, como e-mail ou nome, como identidade: quando ele muda, a entidade deixa de ser " +
                "reconhecida.",
                "Se só importa o valor, e não \"quem\" é, um Value Object é mais simples e mais seguro.",
              ],
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
          summary: "Um Value Object é um objeto do domínio definido apenas pelos seus valores, sem identidade própria.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ele representa um valor: uma quantia em dinheiro, um e-mail, um intervalo de datas, um endereço. Duas " +
                "notas de R$ 10 são intercambiáveis; ninguém pergunta \"qual\" delas. Por isso a igualdade é por valor, e o " +
                "objeto costuma ser imutável: trocar o valor significa criar um novo objeto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se ninguém pergunta \"qual\", e só \"quanto\" ou \"o quê\", o conceito é um Value Object.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para conceitos definidos só pelo valor, como e-mail, dinheiro, período ou CPF, no lugar de um primitivo solto.",
                "Quando o valor tem regras de validação que devem valer sempre, checadas uma única vez na criação.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não serve para algo que precisa ser reconhecido ao longo do tempo: isso é uma Entity.",
                "O mesmo conceito pode ser Entity num contexto e Value Object em outro; a escolha depende do domínio.",
              ],
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
            "Mutable vs Immutable Objects é a diferença entre um objeto cujo estado pode mudar depois de criado e um " +
            "que nunca muda.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Num objeto mutável, os campos podem ser alterados depois da criação (account.balance += 10). Num " +
                "imutável, qualquer \"alteração\" produz um objeto novo e deixa o original intacto. É a aplicação da ideia " +
                "de Immutability (módulo Functional Programming) a objetos com estado, em vez de a simples valores.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Prefira imutabilidade para valores e mutabilidade controlada para entidades, sempre sem expor o estado " +
                "interno.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Devolver uma referência ao estado interno, como um array, deixa qualquer um alterá-lo por aliasing e quebra " +
                "as regras da classe.",
                "`Object.freeze` é raso: os objetos aninhados continuam mutáveis.",
                "Imutabilidade tem custo: cada alteração cria um novo objeto, o que pode pesar em estruturas grandes ou em " +
                "laços quentes.",
              ],
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
            "Tell, Don't Ask é o estilo de projeto em que quem chama diz ao objeto o que fazer, em vez de consultar o " +
            "estado dele para decidir por fora.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A chamada vira uma instrução (order.ship()), e não uma sequência de consultar o estado, decidir e " +
                "alterar o objeto por fora (if (order.status === \"paid\") order.status = \"shipped\"). A lógica sobre o " +
                "estado de um objeto deve estar dentro do objeto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Quando a regra vive fora do objeto, cada chamador precisa repeti-la, e um dia alguém esquece.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Nem toda leitura é violação: perguntar um dado para exibi-lo, sem decidir nada por cima dele, é legítimo.",
                "Levado ao extremo, empilha no objeto responsabilidades que não são dele, como formatação e persistência.",
              ],
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
            "A Law of Demeter diz que um método só deve conversar com os seus vizinhos imediatos, e não com os " +
            "objetos que estão dentro deles.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Vizinhos imediatos são o próprio objeto, seus parâmetros, objetos que ele mesmo cria e seus componentes " +
                "diretos. O método não deve navegar pela estrutura interna de objetos que recebeu: " +
                "order.getCustomer().getAddress().getCity() é o exemplo típico de violação — quem chama fica sabendo que " +
                "o pedido tem um cliente, que o cliente tem um endereço e que o endereço tem uma cidade.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Cada ponto numa cadeia de chamadas é mais um detalhe interno de que o seu código passa a depender.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Nem toda cadeia de chamadas é violação: encadear métodos que devolvem o próprio objeto, como num builder, " +
                "não expõe estrutura interna.",
                "Aplicada mecanicamente, gera uma pilha de métodos de repasse que só escondem a navegação; delegue " +
                "comportamento, não apenas acesso.",
              ],
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
            "Anemic Domain Model é um modelo em que os objetos do domínio só guardam dados e toda a lógica fica em " +
            "serviços separados.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "As classes se parecem com objetos de negócio (Order, Customer, Account), mas são só contêineres: campos, " +
                "getters e setters, sem regras. Validar, calcular e mudar de estado fica com classes de serviço " +
                "(OrderService, AccountService) que manipulam esses dados por fora. Martin Fowler o descreveu como um " +
                "anti-padrão: tem a estrutura de orientação a objetos e o estilo procedural.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Se qualquer serviço pode mudar o estado de um objeto, nenhum deles é responsável por mantê-lo válido.",
            },
            { type: "heading", text: "Por que é um problema" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um modelo simples de dados é apropriado quando quase não há regra de negócio, como em CRUD ou em objetos de " +
                "transferência (DTO).",
                "Migrar para um modelo rico sem regras reais a proteger só acrescenta cerimônia.",
                "Setters públicos deixam qualquer serviço colocar o objeto em estado inválido, e a mesma regra acaba " +
                "duplicada em vários lugares.",
              ],
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
            "Rich Domain Model é um modelo em que os objetos do domínio combinam dados e comportamento e protegem as " +
            "suas próprias regras.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em vez de setters, eles oferecem operações com nomes do domínio (course.enroll(student), " +
                "account.withdraw(amount), order.ship()), que validam antes de mudar o estado. O estado interno só é " +
                "alterado por esses métodos, e por isso o objeto nunca fica em um estado que o negócio considera " +
                "inválido. É o contraponto direto do modelo anêmico.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando só as operações do negócio mudam o estado, um objeto inválido deixa de ser possível de construir.",
            },
            { type: "heading", text: "Por que importa" },
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
            { type: "heading", text: "Na prática" },
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
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o domínio tem regras e invariantes que precisam valer sempre, como saldo, estados de pedido e limites.",
                "Quando várias partes do sistema alteram o mesmo objeto e a regra não pode ficar espalhada.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em CRUD sem regras de negócio, o custo de modelar comportamento não compensa.",
                "Não coloque no objeto o que é orquestração, como enviar e-mail ou salvar no banco: isso continua sendo " +
                "papel de serviços.",
              ],
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
          summary:
            "O Single Responsibility Principle diz que uma classe, um módulo ou uma função deve ter uma única razão " +
            "para mudar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Não significa \"faz uma coisa só\" no sentido de ter poucas linhas: significa que tudo o que está ali muda " +
                "pelo mesmo motivo — geralmente porque atende ao mesmo assunto de negócio ou ao mesmo grupo de pessoas " +
                "que pedem mudanças.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Pergunte quem pediria a mudança: se são pessoas diferentes, são responsabilidades diferentes.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando uma classe reúne responsabilidades diferentes (regras de negócio, formatação, gravação no " +
                "banco), cada uma dessas coisas pode mudar por um motivo próprio — e toda mudança arrisca quebrar as " +
                "outras que compartilham o mesmo arquivo e o mesmo estado. Também dificulta testar: para verificar uma " +
                "regra de cálculo, é preciso montar um banco de dados. É a mesma ideia de coesão (módulo Programming " +
                "Fundamentals), aplicada como critério de projeto: o que muda junto fica junto, o que muda por " +
                "razões diferentes fica separado.",
            },
            {
              type: "paragraph",
              text:
                "Como reconhecer: para descrever a classe você precisa de um \"e\" (\"calcula o total E imprime a " +
                "fatura E grava no banco\"); ela importa dependências sem relação entre si; e pessoas de áreas " +
                "diferentes (finanças, design, infraestrutura) pedem mudanças no mesmo arquivo. O cuidado oposto " +
                "também vale: dividir demais gera dezenas de classes minúsculas e difíceis de seguir. A pergunta útil " +
                "é \"quem poderia pedir uma mudança aqui?\" — se são grupos diferentes, são responsabilidades diferentes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma classe com três razões para mudar, e a divisão em três:" },
            {
              type: "code",
              language: "javascript",
              filename: "srp.js",
              code: [
                "// Antes: muda se a regra de cálculo, o formato de impressão OU o banco mudarem",
                "class Invoice {",
                "  constructor(items) { this.items = items; }",
                "  total() { return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0); }",
                "  print() { console.log(`Fatura — total: R$ ${this.total().toFixed(2)}`); }",
                "  save() { db.insert(\"invoices\", { items: this.items, total: this.total() }); }",
                "}",
                "",
                "// Depois: cada classe muda por um único motivo",
                "class Invoice {",
                "  constructor(items) { this.items = items; }",
                "  total() { return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0); }",
                "}",
                "class InvoicePrinter {",
                "  print(invoice) { console.log(`Fatura — total: R$ ${invoice.total().toFixed(2)}`); }",
                "}",
                "class InvoiceRepository {",
                "  save(invoice) { db.insert(\"invoices\", { items: invoice.items, total: invoice.total() }); }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Agora o layout da impressão pode mudar sem tocar no cálculo, e trocar o banco não afeta nenhuma regra " +
                "de negócio. Invoice pode ser testada sem imprimir nada e sem banco de dados.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Dividir demais espalha um assunto único por muitas classes minúsculas e obriga a pular entre arquivos para " +
                "entender uma regra.",
                "\"Uma responsabilidade\" não é \"fazer uma coisa só\": o critério é quem pede a mudança, não o número de " +
                "métodos.",
              ],
            },
          ],
          examples: [
            {
              title: "Responsabilidades misturadas em um serviço",
              context: "Um serviço que valida, grava e notifica muda por três motivos diferentes.",
              code: {
                language: "javascript",
                filename: "mixed-service.js",
                code: [
                  "// Antes",
                  "class UserService {",
                  "  register(data) {",
                  "    if (!data.email.includes(\"@\")) throw new Error(\"e-mail inválido\");   // regra de validação",
                  "    const user = db.users.insert(data);                                   // persistência",
                  "    mailer.send(user.email, \"Bem-vindo!\");                                // comunicação",
                  "    return user;",
                  "  }",
                  "}",
                  "",
                  "// Depois: cada peça tem um motivo para mudar; o serviço apenas coordena",
                  "class UserService {",
                  "  constructor(validator, users, welcomeMailer) {",
                  "    this.validator = validator; this.users = users; this.welcomeMailer = welcomeMailer;",
                  "  }",
                  "  register(data) {",
                  "    this.validator.validate(data);",
                  "    const user = this.users.save(data);",
                  "    this.welcomeMailer.send(user);",
                  "    return user;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Mudar o texto do e-mail, a regra de validação ou o banco passa a ser uma edição em uma classe só, " +
                "sem risco de afetar as outras duas.",
            },
            {
              title: "Razões para mudar = quem pede a mudança",
              context: "Uma pista prática: se pessoas de áreas diferentes pedem mudanças na mesma classe, ela tem mais de uma responsabilidade.",
              code: {
                language: "javascript",
                filename: "two-actors.js",
                code: [
                  "class Employee {",
                  "  // Usado pelo RH (contabilidade de horas para folha de pagamento)",
                  "  calculatePay() { return this.regularHours() * this.rate; }",
                  "  // Usado pela área de Operações (relatório de produtividade)",
                  "  reportHours() { return this.regularHours(); }",
                  "  // Ambos dependem deste método compartilhado:",
                  "  regularHours() { /* ...regra de horas... */ }",
                  "}",
                  "// O RH pede uma mudança na regra de horas para a folha → reportHours de Operações muda junto,",
                  "// sem que ninguém tenha pedido. Duas razões para mudar, uma só classe.",
                ].join("\n"),
              },
              explanation:
                "O acoplamento oculto entre duas áreas gera bugs que ninguém previu. Separar em duas classes (cada " +
                "uma com sua regra de horas, ou uma regra compartilhada explícita) torna as dependências visíveis.",
            },
            {
              title: "Dividir demais também é um problema",
              context: "SRP não pede uma classe por método; o critério é a razão para mudar, não o tamanho.",
              code: {
                language: "javascript",
                filename: "over-splitting.js",
                code: [
                  "// Exagero: cinco classes para uma única razão para mudar (o formato de um endereço)",
                  "class StreetFormatter {}  class CityFormatter {}  class ZipFormatter {}",
                  "class AddressJoiner {}    class AddressFormatterFacade {}",
                  "",
                  "// Suficiente: uma classe coesa, com uma razão para mudar (como o endereço é exibido)",
                  "class AddressFormatter {",
                  "  format(address) { return `${address.street}, ${address.city} - ${address.zip}`; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Todas as peças do exagero mudam juntas, pelo mesmo motivo, logo pertencem juntas. Dividir só aumentaria " +
                "o número de arquivos a abrir para entender uma regra simples.",
            },
          ],
          exercise: {
            problem:
              "A classe abaixo gera um relatório de vendas, mas mistura o cálculo dos dados, a formatação em CSV e o " +
              "envio por e-mail.",
            problemCode: {
              language: "javascript",
              filename: "sales-report.js",
              code: [
                "class SalesReport {",
                "  constructor(sales) { this.sales = sales; }",
                "",
                "  totalByRegion() {",
                "    const totals = {};",
                "    for (const sale of this.sales) totals[sale.region] = (totals[sale.region] ?? 0) + sale.amount;",
                "    return totals;",
                "  }",
                "",
                "  toCsv() {",
                "    return Object.entries(this.totalByRegion()).map(([region, total]) => `${region},${total}`).join(\"\\n\");",
                "  }",
                "",
                "  sendByEmail(to) {",
                "    mailer.send(to, \"Relatório de vendas\", this.toCsv());",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique SRP: separe a classe de acordo com as razões para mudar, e diga que mudanças futuras cada " +
              "parte isola.",
            hint: "Três razões distintas: a regra de negócio (como calcular), o formato de saída e o canal de entrega.",
            solution: {
              code: {
                language: "javascript",
                filename: "sales-report.fixed.js",
                code: [
                  "class SalesReport {                                   // muda quando a regra de cálculo muda",
                  "  constructor(sales) { this.sales = sales; }",
                  "  totalByRegion() {",
                  "    const totals = {};",
                  "    for (const sale of this.sales) totals[sale.region] = (totals[sale.region] ?? 0) + sale.amount;",
                  "    return totals;",
                  "  }",
                  "}",
                  "",
                  "class CsvFormatter {                                  // muda quando o formato de saída muda",
                  "  format(report) {",
                  "    return Object.entries(report.totalByRegion()).map(([region, total]) => `${region},${total}`).join(\"\\n\");",
                  "  }",
                  "}",
                  "",
                  "class ReportMailer {                                  // muda quando o canal de entrega muda",
                  "  send(to, content) { mailer.send(to, \"Relatório de vendas\", content); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agora trocar CSV por PDF só toca em um formatador; enviar por chat em vez de e-mail só toca no " +
                "entregador; e mudar como os totais são calculados só toca no relatório. Cada peça é testável sem " +
                "as outras.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Open/Closed Principle (OCP)",
          note: "aberto para extensão, fechado para modificação",
          summary: "O Open/Closed Principle diz que o código deve ser aberto para extensão e fechado para modificação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Quando surge um novo requisito do mesmo tipo (mais uma forma de pagamento, mais uma regra de desconto), " +
                "você o atende adicionando código novo, e não abrindo e alterando o que já funciona. O mecanismo habitual " +
                "é o polimorfismo: o código estável depende de um contrato, e cada novo comportamento é uma nova " +
                "implementação desse contrato.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Se cada nova forma de pagamento exige abrir o mesmo arquivo, o código ainda não está fechado para " +
                "modificação.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Todo código alterado é código que pode quebrar. Um switch (ou uma cadeia de ifs) que decide o " +
                "comportamento por tipo obriga a editar a função central a cada tipo novo — e, se o mesmo switch " +
                "está em vários lugares, a editar todos. Cada edição reabre código já testado e arrisca regressões. " +
                "Com extensão por código novo, o que já funciona permanece intocado, e o risco fica restrito ao que é " +
                "novo.",
            },
            {
              type: "paragraph",
              text:
                "O cuidado essencial: não se deve antecipar variações que ainda não existem. Aplicar OCP em todo lugar " +
                "\"por precaução\" gera abstrações desnecessárias (contra YAGNI e KISS). A abordagem prática: escreva o " +
                "código simples na primeira vez; quando aparecer a segunda variação do mesmo tipo, reorganize para que a " +
                "terceira seja uma extensão. O ponto de variação — onde as novidades tendem a aparecer — é o único que " +
                "vale a pena \"abrir\".",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um switch que exige edição a cada novo tipo, e a versão extensível:" },
            {
              type: "code",
              language: "javascript",
              filename: "ocp.js",
              code: [
                "// Antes: cada novo desconto exige EDITAR esta função",
                "function applyDiscount(order) {",
                "  switch (order.customerType) {",
                "    case \"regular\": return order.total;",
                "    case \"vip\":     return order.total * 0.9;",
                "    case \"student\": return order.total * 0.8;",
                "  }",
                "}",
                "",
                "// Depois: cada regra é uma extensão; applyDiscount não muda mais",
                "const discountRules = {",
                "  regular: (total) => total,",
                "  vip:     (total) => total * 0.9,",
                "  student: (total) => total * 0.8,",
                "};",
                "",
                "function applyDiscount(order) {",
                "  return discountRules[order.customerType](order.total);",
                "}",
                "",
                "// Novo tipo: só ADICIONA código, sem tocar em applyDiscount",
                "discountRules.senior = (total) => total * 0.85;",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Acrescentar o desconto \"senior\" é uma linha nova; a função já testada não foi reaberta. O ponto de " +
                "variação (as regras de desconto) ficou explícito e isolado.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Abstrair antes de a variação existir acrescenta indireção para algo que talvez nunca varie.",
                "Nem todo `switch` é problema: se os casos são estáveis e poucos, ele é mais claro que uma hierarquia.",
                "Não dá para fechar o código contra todas as mudanças; escolha os pontos de variação que já se mostraram reais.",
              ],
            },
          ],
          examples: [
            {
              title: "Polimorfismo em vez de switch",
              context: "Cada tipo carrega o seu comportamento; o código que os usa não precisa conhecer os tipos.",
              code: {
                language: "javascript",
                filename: "polymorphism-ocp.js",
                code: [
                  "class CardPayment   { pay(amount) { return `cartão: ${amount}`; } }",
                  "class PixPayment    { pay(amount) { return `pix: ${amount}`; } }",
                  "class BoletoPayment { pay(amount) { return `boleto: ${amount}`; } }   // novo: só uma classe nova",
                  "",
                  "function checkout(paymentMethod, amount) {",
                  "  return paymentMethod.pay(amount);   // nunca muda, não importa quantos métodos existam",
                  "}",
                ].join("\n"),
              },
              explanation:
                "checkout está fechado para modificação e aberto para extensão: um novo meio de pagamento é uma classe " +
                "nova com o método pay(). Essa é a aplicação direta do polimorfismo (Área 1).",
            },
            {
              title: "Um ponto de extensão explícito (plugins)",
              context: "Quando as variações chegam de fora, uma lista registrável evita editar o núcleo.",
              code: {
                language: "javascript",
                filename: "plugin-list.js",
                code: [
                  "const validators = [];",
                  "const registerValidator = (fn) => validators.push(fn);",
                  "",
                  "function validate(user) {",
                  "  return validators.map((check) => check(user)).filter(Boolean);   // núcleo estável",
                  "}",
                  "",
                  "registerValidator((u) => (!u.email ? \"e-mail obrigatório\" : null));",
                  "registerValidator((u) => (u.age < 18 ? \"menor de idade\" : null));   // extensão, sem editar validate",
                ].join("\n"),
              },
              explanation:
                "Cada novo requisito de validação é registrado, sem alterar validate(). É o modelo de muitos sistemas " +
                "de plugins e middlewares.",
            },
            {
              title: "OCP prematuro: abstrair o que nunca varia",
              context: "Abrir pontos de extensão que ninguém usa é complexidade sem retorno.",
              code: {
                language: "javascript",
                filename: "premature-ocp.js",
                code: [
                  "// Exagero: há apenas UM formato de exportação, e nunca houve pedido de outro",
                  "class ExporterFactory { create(type) { return new ExporterRegistry().resolve(type); } }",
                  "class ExporterRegistry { resolve(type) { /* ... */ } }",
                  "",
                  "// Suficiente por enquanto:",
                  "function exportCsv(rows) { return rows.map((r) => r.join(\",\")).join(\"\\n\"); }",
                  "// Quando surgir o segundo formato, refatore — o custo será baixo e o desenho, informado.",
                ].join("\n"),
              },
              explanation:
                "OCP responde a uma necessidade real de variação. Antecipá-la constrói infraestrutura que provavelmente " +
                "não terá a forma certa quando o requisito chegar.",
            },
          ],
          exercise: {
            problem:
              "Esta função de notificações tem um if para cada canal. A cada canal novo, é preciso alterá-la — e " +
              "já causou uma regressão no canal de e-mail.",
            problemCode: {
              language: "javascript",
              filename: "notify.js",
              code: [
                "function notify(user, message, channel) {",
                "  if (channel === \"email\") {",
                "    mailer.send(user.email, message);",
                "  } else if (channel === \"sms\") {",
                "    sms.send(user.phone, message);",
                "  } else if (channel === \"push\") {",
                "    push.send(user.deviceId, message);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Refatore para respeitar o OCP: adicionar um canal novo (por exemplo, WhatsApp) deve ser só código " +
              "novo, sem editar notify.",
            hint: "Cada canal vira um objeto ou função com a mesma assinatura, e notify apenas escolhe pelo nome (ou recebe o canal pronto).",
            solution: {
              code: {
                language: "javascript",
                filename: "notify.fixed.js",
                code: [
                  "const channels = {",
                  "  email: (user, message) => mailer.send(user.email, message),",
                  "  sms:   (user, message) => sms.send(user.phone, message),",
                  "  push:  (user, message) => push.send(user.deviceId, message),",
                  "};",
                  "",
                  "function notify(user, message, channel) {",
                  "  const send = channels[channel];",
                  "  if (!send) throw new Error(`canal desconhecido: ${channel}`);",
                  "  send(user, message);",
                  "}",
                  "",
                  "// Novo canal: só adiciona, sem tocar em notify",
                  "channels.whatsapp = (user, message) => whatsapp.send(user.phone, message);",
                ].join("\n"),
              },
              explanation:
                "notify ficou estável, e cada canal vive isolado: um erro no WhatsApp não pode quebrar o e-mail, pois o " +
                "código do e-mail nunca é reaberto. Esse é o benefício concreto do princípio.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Liskov Substitution Principle (LSP)",
          requires: [
            "Programming Foundations / Programming Fundamentals / Inheritance",
            "Programming Foundations / Programming Fundamentals / Polymorphism",
          ],
          note: "substitutabilidade de subtipos — definida sobre esses dois mecanismos, não dá para entender sem eles",
          summary:
            "O Liskov Substitution Principle diz que um subtipo deve poder ocupar o lugar do tipo base sem que o " +
            "programa passe a se comportar de forma incorreta.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma subclasse não pode apenas ter os mesmos métodos — precisa manter as mesmas promessas. O princípio dá " +
                "um critério para usar Inheritance e Polymorphism (módulo Programming Fundamentals) sem armadilhas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se o código que usa o tipo base precisa checar qual subtipo recebeu, a substituição já falhou.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O polimorfismo só é útil se quem usa o tipo base puder ignorar qual subtipo tem em mãos. Se uma " +
                "subclasse se comporta de modo inesperado (lança um erro onde a base não lançava, ignora uma operação, " +
                "exige mais do que a base exigia), o código cliente passa a precisar de verificações do tipo " +
                "\"if (x instanceof ...)\" — e o polimorfismo perde o sentido. O LSP diz que o problema está na " +
                "herança mal modelada, não no cliente.",
            },
            {
              type: "paragraph",
              text:
                "Regras de contrato: um subtipo não pode exigir pré-condições mais fortes (aceitar menos entradas que a " +
                "base), nem oferecer pós-condições mais fracas (prometer menos), e deve preservar as invariantes da " +
                "base. Sinais de violação: métodos sobrescritos que lançam \"não suportado\" ou ficam vazios; " +
                "instanceof espalhado; uma subclasse que só faz sentido \"desligando\" parte da base. A saída " +
                "costuma ser rever a hierarquia — usar composição, ou separar em tipos diferentes — em vez de forçar a " +
                "herança.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o exemplo clássico: um quadrado que \"é um\" retângulo, mas quebra o contrato:" },
            {
              type: "code",
              language: "javascript",
              filename: "lsp.js",
              code: [
                "class Rectangle {",
                "  constructor(width, height) { this.width = width; this.height = height; }",
                "  setWidth(w)  { this.width = w; }",
                "  setHeight(h) { this.height = h; }",
                "  area() { return this.width * this.height; }",
                "}",
                "",
                "class Square extends Rectangle {   // matematicamente, todo quadrado é um retângulo...",
                "  setWidth(w)  { this.width = w; this.height = w; }    // ...mas o contrato foi quebrado",
                "  setHeight(h) { this.width = h; this.height = h; }",
                "}",
                "",
                "// Código que funciona para qualquer Rectangle:",
                "function stretch(rect) {",
                "  rect.setWidth(5);",
                "  rect.setHeight(2);",
                "  return rect.area();   // esperado: 10",
                "}",
                "",
                "stretch(new Rectangle(1, 1));   // 10 ✔",
                "stretch(new Square(1));         // 4  ✘ — o quadrado quebrou a expectativa",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A relação \"é um\" do mundo real não basta: no código, o contrato de Rectangle promete que largura e " +
                "altura mudam de forma independente, e Square não consegue cumprir isso. Substituí-lo produz um " +
                "resultado errado.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Que a relação \"faz sentido\" no mundo real não basta: o que vale é o contrato, e uma subclasse que lança " +
                "\"não suportado\" o quebra.",
                "Exigir pré-condições mais fortes ou prometer pós-condições mais fracas que o tipo base viola a substituição.",
                "Quando a substituição falha, a saída costuma ser separar a hierarquia ou trocar herança por composição.",
              ],
            },
          ],
          examples: [
            {
              title: "A subclasse que lança \"não suportado\"",
              context: "Herdar um método e recusá-lo é um sinal claro de que a hierarquia não modela o contrato certo.",
              code: {
                language: "javascript",
                filename: "unsupported-operation.js",
                code: [
                  "class Bird {",
                  "  fly() { return \"voando\"; }",
                  "}",
                  "class Penguin extends Bird {",
                  "  fly() { throw new Error(\"pinguins não voam\"); }   // quebra o contrato de Bird",
                  "}",
                  "",
                  "function makeAllFly(birds) {",
                  "  return birds.map((bird) => bird.fly());   // explode se houver um Penguin",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Quem recebe uma lista de Bird não deveria precisar saber que alguns não voam. O erro está em " +
                "colocar fly() na base: nem toda ave voa, então o contrato estava errado desde o início.",
            },
            {
              title: "Pré-condição mais forte no subtipo",
              context: "Uma subclasse que aceita menos entradas que a base surpreende quem usava a base.",
              code: {
                language: "javascript",
                filename: "stronger-precondition.js",
                code: [
                  "class Account {",
                  "  withdraw(amount) {                       // aceita qualquer valor positivo",
                  "    if (amount <= 0) throw new Error(\"valor inválido\");",
                  "    this.balance -= amount;",
                  "  }",
                  "}",
                  "class LimitedAccount extends Account {",
                  "  withdraw(amount) {",
                  "    if (amount > 500) throw new Error(\"limite de 500\");   // exige MAIS do que a base",
                  "    super.withdraw(amount);",
                  "  }",
                  "}",
                  "// Código que sacava 800 de uma Account passa a falhar ao receber uma LimitedAccount.",
                ].join("\n"),
              },
              explanation:
                "O subtipo restringiu o que a base aceitava. Um limite é uma regra legítima, mas então ela deve fazer parte do " +
                "contrato de todos (ex.: um método canWithdraw) ou ser modelada de outra forma, não escondida em uma subclasse.",
            },
            {
              title: "Corrigir com hierarquias mais precisas",
              context: "A solução geralmente é separar os contratos, para que cada tipo prometa só o que cumpre.",
              code: {
                language: "javascript",
                filename: "fixed-hierarchy.js",
                code: [
                  "class Bird {",
                  "  eat() { return \"comendo\"; }",
                  "}",
                  "class FlyingBird extends Bird {",
                  "  fly() { return \"voando\"; }",
                  "}",
                  "class Penguin extends Bird {",
                  "  swim() { return \"nadando\"; }",
                  "}",
                  "",
                  "const makeAllFly = (birds) => birds.map((bird) => bird.fly());   // só recebe FlyingBird",
                ].join("\n"),
              },
              explanation:
                "Agora quem espera aves que voam pede FlyingBird, e o Penguin não é forçado a fingir. Cada tipo faz apenas " +
                "as promessas que consegue cumprir — e a substituição é segura.",
            },
          ],
          exercise: {
            problem:
              "Um sistema de arquivos tem uma classe base para documentos editáveis, e alguém criou um subtipo para " +
              "documentos somente leitura.",
            problemCode: {
              language: "javascript",
              filename: "documents.js",
              code: [
                "class Document {",
                "  constructor(text) { this.text = text; }",
                "  read() { return this.text; }",
                "  write(newText) { this.text = newText; }",
                "}",
                "",
                "class ReadOnlyDocument extends Document {",
                "  write(newText) { throw new Error(\"documento somente leitura\"); }",
                "}",
                "",
                "function fixTypo(doc) {",
                "  doc.write(doc.read().replace(\"teh\", \"the\"));   // quebra se doc for ReadOnlyDocument",
                "}",
              ].join("\n"),
            },
            task:
              "Explique por que isso viola o LSP e redesenhe os tipos para que a substituição seja segura.",
            hint: "Há duas capacidades — ler e escrever. Quem só lê não deveria herdar a promessa de escrever.",
            solution: {
              code: {
                language: "javascript",
                filename: "documents.fixed.js",
                code: [
                  "// Contrato mínimo: todo documento pode ser lido",
                  "class ReadableDocument {",
                  "  constructor(text) { this.text = text; }",
                  "  read() { return this.text; }",
                  "}",
                  "",
                  "// Só quem é editável promete escrever",
                  "class EditableDocument extends ReadableDocument {",
                  "  write(newText) { this.text = newText; }",
                  "}",
                  "",
                  "function fixTypo(doc) {   // exige EditableDocument: o contrato diz claramente o que precisa",
                  "  doc.write(doc.read().replace(\"teh\", \"the\"));",
                  "}",
                  "",
                  "function printDocument(doc) { console.log(doc.read()); }   // aceita qualquer ReadableDocument",
                ].join("\n"),
              },
              explanation:
                "ReadOnlyDocument violava o LSP porque lançava onde a base prometia escrever. Separando as capacidades, " +
                "cada função declara o que precisa, e nenhum subtipo é forçado a quebrar uma promessa herdada.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Interface Segregation Principle (ISP)",
          requires: ["Programming Foundations / Programming Fundamentals / Interface"],
          note: "interfaces enxutas e coesas",
          summary:
            "O Interface Segregation Principle diz que nenhum cliente deve ser forçado a depender de operações que " +
            "não usa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma interface (Interface, módulo Programming Fundamentals) grande, que reúne responsabilidades variadas, " +
                "obriga cada implementação e cada cliente a lidar com o conjunto inteiro. A alternativa são interfaces " +
                "pequenas, cada uma descrevendo um papel coeso.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma implementação que lança \"não suportado\" num método da interface está avisando que a interface é " +
                "grande demais.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Uma interface inchada causa dois problemas. Implementações são forçadas a fornecer métodos que não fazem " +
                "sentido para elas (o clássico \"lança não suportado\", que também viola o LSP). E os clientes ficam " +
                "acoplados a mais do que precisam: se um método que eles nem usam mudar, eles são afetados, recompilados, " +
                "ou testados de novo. Interfaces enxutas reduzem o acoplamento e deixam claro o que cada peça de " +
                "código realmente exige do outro lado.",
            },
            {
              type: "paragraph",
              text:
                "Em JavaScript, onde não existem interfaces declaradas, o princípio se aplica ao contrato implícito: " +
                "uma função deve receber e usar apenas o que precisa (uma função que só grava recebe algo com write(), " +
                "não um repositório completo). O cuidado inverso: segregar demais (uma interface por método) fragmenta o " +
                "design sem benefício. O critério é o papel: métodos usados juntos pelos mesmos clientes ficam " +
                "juntos.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma interface \"gorda\" que força uma implementação a fingir, e a versão segregada:" },
            {
              type: "code",
              language: "javascript",
              filename: "isp.js",
              code: [
                "// Antes: um contrato só para \"multifuncional\"",
                "// MultiFunctionDevice: print(), scan(), fax()",
                "class OldPrinter {",
                "  print(doc) { /* ... */ }",
                "  scan(doc)  { throw new Error(\"não suportado\"); }   // forçada a implementar o que não faz",
                "  fax(doc)   { throw new Error(\"não suportado\"); }",
                "}",
                "",
                "// Depois: papéis pequenos; cada dispositivo implementa só o que faz",
                "// Printer: print()   Scanner: scan()   FaxMachine: fax()",
                "class SimplePrinter { print(doc) { /* ... */ } }",
                "class AllInOne {",
                "  print(doc) { /* ... */ }",
                "  scan(doc)  { /* ... */ }",
                "  fax(doc)   { /* ... */ }",
                "}",
                "",
                "function printReport(printer) { printer.print(\"relatório\"); }   // só exige print()",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "OldPrinter tinha de mentir sobre o que faz. Com papéis separados, SimplePrinter é só uma impressora, " +
                "e printReport aceita qualquer coisa que imprima, sem se importar se também digitaliza.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Segregar demais gera dezenas de interfaces de um método só, difíceis de descobrir e de manter.",
                "Divida pelos papéis de quem usa, não por cada método da implementação.",
              ],
            },
          ],
          examples: [
            {
              title: "O cliente que só precisa de uma parte",
              context: "Passar um objeto \"completo\" a quem usa uma operação só acopla o cliente a tudo o mais.",
              code: {
                language: "javascript",
                filename: "narrow-dependency.js",
                code: [
                  "// Antes: recebe o repositório inteiro, mas só lê",
                  "function exportUsers(userRepository) {",
                  "  return userRepository.findAll().map((u) => u.name);",
                  "}",
                  "// userRepository tem: findAll, findById, save, delete, count, ...",
                  "",
                  "// Depois: depende só do papel de leitura",
                  "function exportUsers(reader) {   // reader: { findAll() }",
                  "  return reader.findAll().map((u) => u.name);",
                  "}",
                  "",
                  "exportUsers({ findAll: () => [{ name: \"Ana\" }] });   // teste trivial, sem montar um repositório",
                ].join("\n"),
              },
              explanation:
                "A função declara exatamente o que precisa (findAll). Isso reduz o acoplamento e torna o teste trivial: " +
                "basta um objeto com um único método.",
            },
            {
              title: "Segregar por papéis de quem usa",
              context: "A divisão certa acompanha quem consome, não quem implementa.",
              code: {
                language: "javascript",
                filename: "role-interfaces.js",
                code: [
                  "// Papéis distintos de uso de um mesmo repositório:",
                  "//   UserReader : { findById, findAll }          → telas e relatórios",
                  "//   UserWriter : { save, delete }               → cadastro e administração",
                  "",
                  "class PostgresUserRepository {",
                  "  findById(id) { /* ... */ }",
                  "  findAll()    { /* ... */ }",
                  "  save(user)   { /* ... */ }",
                  "  delete(id)   { /* ... */ }",
                  "}",
                  "",
                  "// Uma mesma classe pode cumprir os dois papéis; cada cliente enxerga só o seu.",
                  "const registerUser = (writer, data) => writer.save(data);",
                  "const showProfile  = (reader, id)   => reader.findById(id);",
                ].join("\n"),
              },
              explanation:
                "A implementação pode ser uma só, mas os clientes dependem de papéis. Assim, um cliente de leitura não " +
                "acidentalmente apaga dados, e restringir permissões passa a ser natural.",
            },
            {
              title: "Segregar demais também atrapalha",
              context: "Uma interface por método fragmenta o design e multiplica os tipos sem trazer clareza.",
              code: {
                language: "javascript",
                filename: "too-granular.js",
                code: [
                  "// Exagero: cada método vira um contrato separado",
                  "// FindByIdable, FindAllable, Saveable, Deletable, Countable, ...",
                  "",
                  "// Suficiente: papéis que refletem como os clientes realmente usam",
                  "// UserReader { findById, findAll }   UserWriter { save, delete }",
                ].join("\n"),
              },
              explanation:
                "Métodos usados juntos, pelos mesmos clientes, pertencem ao mesmo contrato. A meta é coesão, não o " +
                "menor número possível de métodos por interface.",
            },
          ],
          exercise: {
            problem:
              "O contrato de \"Worker\" abaixo é usado por trabalhadores humanos e por robôs, e os robôs são forçados a " +
              "implementar operações que não fazem sentido para eles.",
            problemCode: {
              language: "javascript",
              filename: "worker.js",
              code: [
                "// Contrato: work(), eat(), sleep()",
                "class HumanWorker {",
                "  work()  { return \"trabalhando\"; }",
                "  eat()   { return \"almoçando\"; }",
                "  sleep() { return \"dormindo\"; }",
                "}",
                "",
                "class RobotWorker {",
                "  work()  { return \"trabalhando\"; }",
                "  eat()   { throw new Error(\"robôs não comem\"); }",
                "  sleep() { throw new Error(\"robôs não dormem\"); }",
                "}",
                "",
                "function runShift(workers) { workers.forEach((w) => w.work()); }",
                "function lunchBreak(workers) { workers.forEach((w) => w.eat()); }   // quebra com robôs",
              ].join("\n"),
            },
            task:
              "Aplique ISP: separe o contrato em papéis coesos e ajuste as funções para dependerem só do que usam.",
            hint: "Há três capacidades independentes. Cada função só precisa de uma delas — e cada classe implementa só as que tem.",
            solution: {
              code: {
                language: "javascript",
                filename: "worker.fixed.js",
                code: [
                  "// Papéis: Workable { work() }   Feedable { eat() }   Restable { sleep() }",
                  "",
                  "class HumanWorker {",
                  "  work()  { return \"trabalhando\"; }",
                  "  eat()   { return \"almoçando\"; }",
                  "  sleep() { return \"dormindo\"; }",
                  "}",
                  "",
                  "class RobotWorker {",
                  "  work() { return \"trabalhando\"; }   // só o que faz sentido para um robô",
                  "}",
                  "",
                  "function runShift(workables) { workables.forEach((w) => w.work()); }     // qualquer um que trabalhe",
                  "function lunchBreak(feedables) { feedables.forEach((f) => f.eat()); }    // só quem come",
                  "",
                  "runShift([new HumanWorker(), new RobotWorker()]);",
                  "lunchBreak([new HumanWorker()]);      // robôs nem entram nesta lista",
                ].join("\n"),
              },
              explanation:
                "RobotWorker deixou de implementar métodos falsos, e lunchBreak nunca recebe algo que não come. Cada função " +
                "depende só do papel de que precisa, o que elimina os erros de \"não suportado\" em tempo de execução.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Dependency Inversion Principle (DIP)",
          requires: ["Programming Foundations / Programming Fundamentals / Interface"],
          note: "depender de abstrações, não de implementações concretas — fecha a Story e abre Dependency Injection & IoC",
          summary:
            "O Dependency Inversion Principle diz que as regras de negócio e a infraestrutura devem depender de " +
            "abstrações, e não uma da outra.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O princípio tem duas partes: módulos de alto nível não devem depender de módulos de baixo nível — ambos " +
                "devem depender de abstrações; e abstrações não devem depender de detalhes, os detalhes é que dependem " +
                "das abstrações. Em termos práticos: sua regra de negócio não deve importar diretamente o cliente do " +
                "Stripe ou o driver do MySQL; ela declara o que precisa (\"algo que cobra um valor\") e a infraestrutura se " +
                "adapta a esse contrato.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A inversão está em quem desenha o contrato: é a regra de negócio que diz o que precisa, e não o banco " +
                "que diz o que oferece.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "No desenho tradicional, a regra de negócio chama o banco, que chama o driver: a dependência de código " +
                "aponta para baixo, e as regras mais valiosas ficam presas aos detalhes que mais mudam. Trocar de " +
                "provedor de pagamento obriga a mexer no núcleo do sistema, e testar a regra exige o serviço real. Ao " +
                "\"inverter\" a dependência — a regra define uma interface e a infraestrutura a implementa — o núcleo " +
                "fica estável, testável com um substituto simples e independente de fornecedores.",
            },
            {
              type: "paragraph",
              text:
                "Duas confusões comuns. DIP é um princípio de projeto (para onde as dependências apontam); Dependency " +
                "Injection é uma técnica para fornecer a implementação a quem precisa dela, assunto do próximo " +
                "módulo — uma forma de aplicar o DIP, mas não a única. E o dono do contrato é o módulo de alto " +
                "nível: a interface é escrita em termos do que o negócio precisa, não copiando a API da biblioteca " +
                "de baixo nível.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a regra dependendo diretamente de um fornecedor, e depois de um contrato:" },
            {
              type: "code",
              language: "javascript",
              filename: "dip.js",
              code: [
                "// Antes: o serviço de negócio depende do detalhe (a biblioteca concreta)",
                "class OrderService {",
                "  checkout(order) {",
                "    const stripe = new StripeClient(process.env.STRIPE_KEY);   // amarrado ao Stripe",
                "    return stripe.createCharge({ amount: order.total, currency: \"brl\" });",
                "  }",
                "}",
                "",
                "// Depois: o serviço depende de um contrato que ELE define (charge(amount))",
                "class OrderService {",
                "  constructor(paymentGateway) { this.paymentGateway = paymentGateway; }",
                "  checkout(order) {",
                "    return this.paymentGateway.charge(order.total);",
                "  }",
                "}",
                "",
                "// O detalhe se adapta ao contrato:",
                "class StripeGateway {",
                "  charge(amount) { return new StripeClient(process.env.STRIPE_KEY).createCharge({ amount, currency: \"brl\" }); }",
                "}",
                "const service = new OrderService(new StripeGateway());",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "OrderService agora não sabe que o Stripe existe: conhece apenas \"algo que cobra\". Trocar de provedor é " +
                "escrever outro gateway com o mesmo método, sem tocar na regra de negócio.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "DIP não é Dependency Injection: injetar dependências é uma técnica, e inverter é decidir quem define o " +
                "contrato.",
                "Se a abstração é desenhada pelo baixo nível, espelhando a API do banco ou da biblioteca, a dependência " +
                "continua apontando para o lado errado.",
                "Para dependências estáveis e sem chance real de troca, uma abstração a mais é só cerimônia.",
              ],
            },
          ],
          examples: [
            {
              title: "Testar sem o serviço real",
              context: "Com o contrato no meio, dá para substituir a infraestrutura por um objeto simples nos testes.",
              code: {
                language: "javascript",
                filename: "test-with-fake.js",
                code: [
                  "class FakeGateway {",
                  "  charged = [];",
                  "  charge(amount) { this.charged.push(amount); return { ok: true }; }",
                  "}",
                  "",
                  "const gateway = new FakeGateway();",
                  "const service = new OrderService(gateway);",
                  "",
                  "service.checkout({ total: 150 });",
                  "console.log(gateway.charged);   // [150] — sem rede, sem chave, sem cobrar de verdade",
                ].join("\n"),
              },
              explanation:
                "O teste verifica a regra de negócio (cobrou o total do pedido) sem depender do Stripe. É uma das " +
                "recompensas práticas mais imediatas do DIP.",
            },
            {
              title: "Quem é dono do contrato",
              context: "A abstração pertence ao módulo de alto nível, e o de baixo nível é quem se conforma a ela.",
              code: {
                language: "text",
                filename: "dependency-direction.txt",
                code: [
                  "Sem DIP (a dependência aponta para baixo):",
                  "  Regras de negócio  ──depende de──▶  Cliente do Stripe / Driver do MySQL",
                  "",
                  "Com DIP (a dependência foi invertida):",
                  "  Regras de negócio  ──define──▶  PaymentGateway (contrato)  ◀──implementa──  StripeGateway",
                  "",
                  "O código-fonte de StripeGateway depende do contrato; o núcleo não depende de mais ninguém.",
                ].join("\n"),
              },
              explanation:
                "Foi a seta que se inverteu: antes, o núcleo apontava para o detalhe; agora o detalhe aponta para o núcleo. " +
                "Por isso o contrato é escrito em termos do que o negócio precisa, e não do que a biblioteca oferece.",
            },
            {
              title: "DIP não é Dependency Injection",
              context: "Uma confusão frequente: o princípio diz para onde apontam as dependências; a injeção é uma técnica de fornecê-las.",
              code: {
                language: "javascript",
                filename: "dip-vs-di.js",
                code: [
                  "// Segue o DIP, sem nenhum \"container\" ou framework de injeção:",
                  "const service = new OrderService(new StripeGateway());",
                  "",
                  "// Também é possível respeitar o DIP com uma função de fábrica em vez de injetar via construtor:",
                  "function createOrderService(gateway = new StripeGateway()) {",
                  "  return new OrderService(gateway);",
                  "}",
                  "// O importante é OrderService depender do contrato, não da classe concreta.",
                ].join("\n"),
              },
              explanation:
                "O DIP é satisfeito quando o núcleo depende de uma abstração. Como essa implementação chega até ele " +
                "(construtor, fábrica, um container) é o tema de Dependency Injection & IoC.",
            },
          ],
          exercise: {
            problem:
              "A classe de relatórios abaixo cria diretamente uma conexão com o MySQL, o que a torna impossível de " +
              "testar sem um banco e amarrada a esse fornecedor.",
            problemCode: {
              language: "javascript",
              filename: "report-service.js",
              code: [
                "class ReportService {",
                "  monthlyRevenue(month) {",
                "    const db = new MySqlConnection(\"prod-db.internal\", 3306);",
                "    const rows = db.query(\"SELECT total FROM orders WHERE month = ?\", [month]);",
                "    return rows.reduce((sum, row) => sum + row.total, 0);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique o DIP: defina um contrato em termos do negócio (o que o relatório precisa), faça ReportService " +
              "depender dele e mostre a implementação com MySQL e um substituto para teste.",
            hint: "O relatório não precisa de \"uma conexão SQL\", precisa dos totais dos pedidos de um mês. Esse é o contrato.",
            solution: {
              code: {
                language: "javascript",
                filename: "report-service.fixed.js",
                code: [
                  "// Contrato definido pelo alto nível, em termos do negócio: orderTotalsForMonth(month) → number[]",
                  "class ReportService {",
                  "  constructor(orderStore) { this.orderStore = orderStore; }",
                  "  monthlyRevenue(month) {",
                  "    return this.orderStore.orderTotalsForMonth(month).reduce((sum, total) => sum + total, 0);",
                  "  }",
                  "}",
                  "",
                  "// Detalhe: a implementação com MySQL se adapta ao contrato",
                  "class MySqlOrderStore {",
                  "  orderTotalsForMonth(month) {",
                  "    const db = new MySqlConnection(\"prod-db.internal\", 3306);",
                  "    return db.query(\"SELECT total FROM orders WHERE month = ?\", [month]).map((row) => row.total);",
                  "  }",
                  "}",
                  "",
                  "// Teste: um substituto simples, sem banco",
                  "const fakeStore = { orderTotalsForMonth: () => [100, 250, 50] };",
                  "new ReportService(fakeStore).monthlyRevenue(\"2026-03\");   // 400",
                ].join("\n"),
              },
              explanation:
                "ReportService só conhece \"os totais dos pedidos do mês\" e não sabe de MySQL. Trocar de banco é escrever outra " +
                "implementação do contrato, e o teste da regra de soma é trivial, com um objeto de uma linha.",
            },
          },
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
        concept({
          order: 10,
          title: "Command-Query Separation (CQS)",
          note: "um método pergunta OU muda estado, não os dois",
          summary:
            "Cada método ou faz uma pergunta (query), devolvendo um valor sem alterar nada, ou dá uma ordem " +
            "(command), alterando o estado sem devolver dados — nunca as duas coisas ao mesmo tempo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Command-Query Separation, formulado por Bertrand Meyer, divide os métodos de um objeto em dois tipos. " +
                "Uma query devolve um valor e não altera o estado observável do objeto: perguntar não muda a resposta. " +
                "Um command altera o estado e não devolve dados sobre ele: dá uma ordem, e o que muda está no objeto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um método pergunta OU muda estado, não os dois: quem consulta pode chamar quantas vezes quiser sem " +
                "efeito, e quem altera deixa claro que existe um efeito.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Uma query sem efeito colateral é segura de repetir, de chamar em logs e em depuração, de guardar em " +
                "cache e de reordenar — tem a mesma previsibilidade de uma Pure Function (Functional Programming). " +
                "Quando um método pergunta e muda ao mesmo tempo, quem chama perde a opção de \"só olhar\": para ler o " +
                "valor, precisa aceitar o efeito. E quem lê o código não vê, na chamada, que algo foi alterado.",
            },
            {
              type: "paragraph",
              text:
                "Separar os dois papéis também deixa os testes mais simples: uma query se testa comparando o " +
                "resultado; um command se testa consultando o estado depois dele.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um método que pergunta e muda ao mesmo tempo, e a versão separada:" },
            {
              type: "code",
              language: "javascript",
              filename: "cqs.js",
              code: [
                "// Antes: a mesma pergunta dá respostas diferentes",
                "class Sequence {",
                "  #current = 0;",
                "  next() { return ++this.#current; }   // altera E devolve",
                "}",
                "const seq = new Sequence();",
                "seq.next();   // 1",
                "seq.next();   // 2 — perguntar de novo mudou a resposta",
                "",
                "// Depois: uma query e um command",
                "class SafeSequence {",
                "  #current = 0;",
                "  current() { return this.#current; }        // query: só lê",
                "  advance() { this.#current += 1; }          // command: só altera",
                "}",
                "const safe = new SafeSequence();",
                "safe.advance();",
                "safe.current();   // 1",
                "safe.current();   // 1 — consultar não muda nada",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Com `current()` dá para ler o valor quantas vezes for preciso, inclusive em um log, sem alterar o " +
                "programa. `advance()` deixa explícito, no nome e na ausência de retorno, que há um efeito.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Algumas operações precisam ler e alterar juntas: em concorrência, separá-las abre uma race condition, e a operação atômica é a saída.",
                "O que conta é o estado observável: um cache interno ou um log dentro de uma query não a transformam em command.",
                "Sinalizar falha, com exceção ou com `Result`, não faz de um command uma query; o que se evita é devolver dados do estado alterado.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma pergunta com efeito escondido",
              context: "Um método com nome de consulta que altera o estado é a violação mais comum e a mais surpreendente.",
              code: {
                language: "javascript",
                filename: "hidden-effect.js",
                code: [
                  "// Antes: hasStock reserva o item sem avisar",
                  "class Inventory {",
                  "  constructor(items) { this.items = new Map(items); }",
                  "  hasStock(sku) {",
                  "    const qty = this.items.get(sku) ?? 0;",
                  "    if (qty > 0) this.items.set(sku, qty - 1);   // efeito escondido numa \"pergunta\"",
                  "    return qty > 0;",
                  "  }",
                  "}",
                  "const inv = new Inventory([[\"A1\", 1]]);",
                  "inv.hasStock(\"A1\");   // true",
                  "inv.hasStock(\"A1\");   // false — a mesma pergunta mudou de resposta",
                  "",
                  "// Depois: consultar e reservar são operações separadas",
                  "class SafeInventory {",
                  "  constructor(items) { this.items = new Map(items); }",
                  "  hasStock(sku) { return (this.items.get(sku) ?? 0) > 0; }   // query",
                  "  reserve(sku) {                                              // command",
                  "    if (!this.hasStock(sku)) throw new Error(`sem estoque: ${sku}`);",
                  "    this.items.set(sku, this.items.get(sku) - 1);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Depois da separação, `hasStock` pode ser chamado em uma tela, em um log ou em um teste sem consumir " +
                "estoque, e `reserve` diz, pelo nome, que altera algo.",
            },
            {
              title: "Quando ler e alterar precisam ser um passo só",
              context: "Em concorrência, perguntar e depois ordenar deixa uma janela entre as duas chamadas.",
              code: {
                language: "javascript",
                filename: "atomic-exception.js",
                code: [
                  "// Separado: outra execução pode incrementar entre as duas linhas",
                  "if (counter.value() < LIMIT) {",
                  "  counter.increment();",
                  "}",
                  "",
                  "// Junto: lê e altera de forma indivisível, e devolve se conseguiu",
                  "const accepted = counter.incrementIfBelow(LIMIT);",
                ].join("\n"),
              },
              explanation:
                "Aqui a violação é deliberada: sem atomicidade, dois chamadores poderiam passar do limite juntos (Race " +
                "Condition). CQS é uma regra de projeto, e a exceção vale quando o custo de separar é um bug real.",
            },
            {
              title: "CQS em uma API HTTP",
              context: "A separação aparece na própria semântica dos métodos HTTP.",
              code: {
                language: "javascript",
                filename: "http-cqs.js",
                code: [
                  "// Query: GET é seguro — pode ser repetido, guardado em cache, pré-carregado",
                  "const order = await fetch(\"/orders/42\").then((r) => r.json());",
                  "",
                  "// Command: POST altera o estado no servidor",
                  "await fetch(\"/orders/42/cancel\", { method: \"POST\" });",
                ].join("\n"),
              },
              explanation:
                "Um navegador pode repetir ou pré-carregar um GET sem medo, porque ele não altera nada. Um endpoint GET " +
                "que apaga dados quebraria exatamente essa garantia.",
            },
          ],
          exercise: {
            problem:
              "O método `total()` do carrinho abaixo consome o cupom ao ser chamado: perguntar o total muda o próprio total.",
            problemCode: {
              language: "javascript",
              filename: "cart.js",
              code: [
                "class Cart {",
                "  constructor() { this.items = []; this.couponUsed = false; }",
                "  add(item) { this.items.push(item); return this.items.length; }",
                "  total() {",
                "    let sum = this.items.reduce((s, i) => s + i.price, 0);",
                "    if (!this.couponUsed) { sum *= 0.9; this.couponUsed = true; }   // consome o cupom ao perguntar",
                "    return sum;",
                "  }",
                "}",
                "",
                "const cart = new Cart();",
                "cart.add({ price: 100 });",
                "cart.total();   // 90",
                "cart.total();   // 100 — o mesmo carrinho, outro total",
              ].join("\n"),
            },
            task:
              "Aplique CQS: separe a consulta do total da ordem de aplicar o cupom, e faça `add` deixar de devolver dados.",
            hint: "Falta um command explícito para aplicar o desconto; `total()` deve só calcular a partir do estado.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart.fixed.js",
                code: [
                  "class Cart {",
                  "  constructor() { this.items = []; this.discount = 0; }",
                  "  add(item) { this.items.push(item); }                  // command",
                  "  applyCoupon() { this.discount = 0.1; }                // command",
                  "  total() {                                             // query: sem efeito",
                  "    const sum = this.items.reduce((s, i) => s + i.price, 0);",
                  "    return sum * (1 - this.discount);",
                  "  }",
                  "}",
                  "",
                  "const cart = new Cart();",
                  "cart.add({ price: 100 });",
                  "cart.applyCoupon();",
                  "cart.total();   // 90",
                  "cart.total();   // 90 — perguntar de novo não muda",
                ].join("\n"),
              },
              explanation:
                "`applyCoupon` é o único ponto que altera o desconto, e `total` passou a ser repetível. O cupom deixou " +
                "de ser consumido por acidente, e `add` não devolve mais o tamanho: quem quiser saber o tamanho pergunta.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Encapsulate What Varies",
          requires: ["Programming Foundations / Programming Fundamentals / Encapsulation"],
          note: "isolar o ponto de variação — aplica Encapsulation",
          summary:
            "Identifique a parte do código que muda com frequência e isole-a atrás de uma fronteira estável, para " +
            "que o restante do sistema não precise mudar junto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Encapsulate What Varies pede duas coisas: descobrir o que muda (regras de imposto, formatos de saída, " +
                "provedores, canais de envio) e separar isso do que permanece. A parte que varia fica atrás de uma " +
                "fronteira estável, uma função ou um contrato, e o resto do código conversa só com essa fronteira. É a " +
                "aplicação de Encapsulation e de Information Hiding (módulo Programming Fundamentals) a um ponto " +
                "específico: o que tem chance de mudar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Descubra o que muda e coloque uma fronteira em volta: o que é estável não precisa ser reescrito " +
                "toda vez que o que varia mudar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando uma regra que varia está espalhada por condicionais (`if (canal === \"sms\")` em cinco " +
                "arquivos), cada novo caso obriga a editar todos eles, e é fácil esquecer um. Isolada, a mudança fica " +
                "em um lugar só, e o código que usa a fronteira nem percebe. Esse é o ponto de partida do Open-Closed " +
                "Principle e de vários padrões de projeto que aparecem mais adiante, como o Strategy.",
            },
            {
              type: "paragraph",
              text:
                "Para saber o que varia, olhe o histórico: o que mudou nos últimos commits e o que o negócio já avisou " +
                "que vai mudar. Adivinhar variações que ninguém pediu costuma gerar abstrações que não servem.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma regra de frete espalhada em condicionais, e ela isolada em um único lugar:" },
            {
              type: "code",
              language: "javascript",
              filename: "encapsulate-varies.js",
              code: [
                "// Antes: a regra que varia (o transportador) está em cada função",
                "function checkoutTotal(order) {",
                "  let shipping;",
                "  if (order.carrier === \"express\") shipping = 30;",
                "  else if (order.carrier === \"standard\") shipping = order.weight * 2;",
                "  else shipping = 0;",
                "  return order.subtotal + shipping;",
                "}",
                "function shippingLabel(order) {",
                "  if (order.carrier === \"express\") return \"Entrega em 1 dia\";",
                "  if (order.carrier === \"standard\") return \"Entrega em 5 dias\";",
                "  return \"Retirada na loja\";",
                "}",
                "",
                "// Depois: o que varia vive em um lugar; o resto só consulta",
                "const carriers = {",
                "  express:  { cost: () => 30,            label: \"Entrega em 1 dia\" },",
                "  standard: { cost: (o) => o.weight * 2, label: \"Entrega em 5 dias\" },",
                "  pickup:   { cost: () => 0,             label: \"Retirada na loja\" },",
                "};",
                "const checkoutTotalV2 = (order) => order.subtotal + carriers[order.carrier].cost(order);",
                "const shippingLabelV2 = (order) => carriers[order.carrier].label;",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Um novo transportador é uma entrada em `carriers`. `checkoutTotalV2` e `shippingLabelV2`, que são a " +
                "parte estável, não mudam.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Sem evidência de variação, isolar é especulação: comece pelo que já mudou ou pelo que o negócio disse que vai mudar.",
                "Se o contrato da fronteira espelha só o primeiro caso, o segundo não cabe; revise-o quando a variação real aparecer.",
                "Isolar não é envolver tudo em camadas: uma fronteira pequena e clara vale mais que várias indiretas.",
              ],
            },
          ],
          examples: [
            {
              title: "Isolar o formato de saída",
              context: "O formato em que um relatório é exportado é um ponto de variação clássico.",
              code: {
                language: "javascript",
                filename: "formatters.js",
                code: [
                  "const formatters = {",
                  "  csv:  (rows) => rows.map((r) => r.join(\",\")).join(\"\\n\"),",
                  "  json: (rows) => JSON.stringify(rows),",
                  "};",
                  "",
                  "function exportReport(rows, format) {",
                  "  return formatters[format](rows);   // quem exporta não sabe como cada formato funciona",
                  "}",
                  "",
                  "exportReport([[1, 2], [3, 4]], \"csv\");   // \"1,2\\n3,4\"",
                ].join("\n"),
              },
              explanation:
                "Adicionar um formato (XML, por exemplo) é uma nova entrada em `formatters`; `exportReport` e seus " +
                "chamadores permanecem intactos.",
            },
            {
              title: "A fronteira pode ser só uma função recebida",
              context: "Nem toda fronteira precisa ser uma classe: uma função passada como argumento já isola a variação.",
              code: {
                language: "javascript",
                filename: "tax-rule.js",
                code: [
                  "// O cálculo da fatura é estável; a regra de imposto varia por país",
                  "function invoiceTotal(items, taxRule) {",
                  "  const subtotal = items.reduce((sum, i) => sum + i.price, 0);",
                  "  return subtotal + taxRule(subtotal);",
                  "}",
                  "",
                  "const brazilTax = (amount) => amount * 0.17;",
                  "const portugalTax = (amount) => amount * 0.23;",
                  "",
                  "invoiceTotal([{ price: 100 }], brazilTax);     // 117",
                  "invoiceTotal([{ price: 100 }], portugalTax);   // 123",
                ].join("\n"),
              },
              explanation:
                "`invoiceTotal` não conhece nenhum país. Uma nova regra de imposto é uma nova função, sem alterar o " +
                "cálculo da fatura.",
            },
            {
              title: "Nem tudo que parece variar precisa de isolamento",
              context: "Isolar algo que nunca mudou só acrescenta indireção.",
              code: {
                language: "javascript",
                filename: "premature.js",
                code: [
                  "// Exagero: uma fábrica para uma constante que nunca mudou em anos",
                  "class MaxRetriesProviderFactory {",
                  "  create() { return { get: () => 3 }; }",
                  "}",
                  "",
                  "// Suficiente: uma constante, até que haja um motivo real para variar",
                  "const MAX_RETRIES = 3;",
                ].join("\n"),
              },
              explanation:
                "Se o valor nunca mudou e ninguém pediu para mudar, uma constante basta. Quando surgir uma variação " +
                "real, refatorar para isolá-la é barato.",
            },
          ],
          exercise: {
            problem:
              "A escolha do canal de notificação está repetida em duas funções. Adicionar o canal \"whatsapp\" exige " +
              "editar as duas, e esquecer uma delas gera um bug silencioso.",
            problemCode: {
              language: "javascript",
              filename: "notify.js",
              code: [
                "function notify(user, message) {",
                "  if (user.channel === \"email\") return `email para ${user.email}: ${message}`;",
                "  if (user.channel === \"sms\") return `sms para ${user.phone}: ${message}`;",
                "  return `push para ${user.deviceId}: ${message}`;",
                "}",
                "",
                "function notificationCost(user) {",
                "  if (user.channel === \"email\") return 0;",
                "  if (user.channel === \"sms\") return 0.1;",
                "  return 0.01;",
                "}",
              ].join("\n"),
            },
            task:
              "Isole o que varia (o canal) para que adicionar \"whatsapp\" altere um único lugar, e faça `notify` e " +
              "`notificationCost` só consultarem essa fronteira.",
            hint: "O que muda é o canal. Que comportamento e que dado andam juntos para cada canal?",
            solution: {
              code: {
                language: "javascript",
                filename: "notify.fixed.js",
                code: [
                  "const channels = {",
                  "  email: { send: (u, m) => `email para ${u.email}: ${m}`,   cost: 0 },",
                  "  sms:   { send: (u, m) => `sms para ${u.phone}: ${m}`,     cost: 0.1 },",
                  "  push:  { send: (u, m) => `push para ${u.deviceId}: ${m}`, cost: 0.01 },",
                  "};",
                  "",
                  "const notify = (user, message) => channels[user.channel].send(user, message);",
                  "const notificationCost = (user) => channels[user.channel].cost;",
                  "",
                  "// Novo canal: uma entrada em `channels`, nenhuma outra função muda",
                ].join("\n"),
              },
              explanation:
                "A variação (canal) ficou em `channels`, e as duas funções só consultam essa tabela. Um efeito a " +
                "notar: um canal desconhecido agora falha de forma explícita, em vez de cair silenciosamente em push.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Program to an Interface",
          requires: ["Programming Foundations / Programming Fundamentals / Interface"],
          note: "depender do contrato, não da implementação — revisita também Type Systems / Structural Typing (Epic 01)",
          summary:
            "Escreva o código para depender do contrato (o que algo faz), não de uma implementação concreta (como " +
            "ela faz) — assim a implementação pode ser trocada sem mexer em quem a usa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Program to an Interface diz que o código deve depender do que algo promete fazer, e não de qual " +
                "classe concreta o faz. \"Interface\" aqui é o contrato (Interface e Contract, módulo Programming " +
                "Fundamentals), não a palavra-chave de uma linguagem. Em JavaScript, ele aparece como o formato que a " +
                "função espera: qualquer objeto com o método `write()`, e não uma classe específica. É a mesma ideia " +
                "de Structural Typing (módulo Type Systems), em que basta ter a forma certa.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Dependa do que algo faz, e não do que ele é: a implementação passa a poder mudar sem que quem a usa " +
                "perceba.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quem depende de uma classe concreta fica preso a ela: trocar o banco, o provedor de pagamento ou o " +
                "serviço de e-mail obriga a mexer em todos os que o usam. Testar também fica difícil, porque não há " +
                "como substituir a peça real por uma simples e rápida (Test Doubles). Dependendo do contrato, o " +
                "acoplamento (Coupling) diminui, e a implementação vira um detalhe intercambiável.",
            },
            {
              type: "paragraph",
              text:
                "Este princípio trata de não depender do concreto. Quem define o contrato, o alto nível ou o baixo " +
                "nível, é a questão do Dependency Inversion Principle, visto no módulo anterior.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um serviço preso a uma implementação concreta, e o mesmo serviço dependendo de um contrato:" },
            {
              type: "code",
              language: "javascript",
              filename: "program-to-interface.js",
              code: [
                "// Antes: o serviço cria e conhece a implementação concreta",
                "class ReportService {",
                "  constructor() { this.storage = new S3Storage(); }   // preso ao S3",
                "  save(report) { this.storage.upload(report.name, report.body); }",
                "}",
                "",
                "// Depois: depende do contrato { write(name, body) }",
                "class ReportServiceV2 {",
                "  constructor(storage) { this.storage = storage; }    // qualquer coisa com write()",
                "  save(report) { this.storage.write(report.name, report.body); }",
                "}",
                "",
                "class S3Storage {",
                "  write(name, body) { /* envia ao S3 */ }",
                "}",
                "class MemoryStorage {",
                "  constructor() { this.files = new Map(); }",
                "  write(name, body) { this.files.set(name, body); }",
                "}",
                "",
                "new ReportServiceV2(new MemoryStorage()).save({ name: \"r1\", body: \"...\" });   // teste sem S3",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`ReportServiceV2` não sabe se o destino é o S3 ou a memória. Trocar de armazenamento é passar outro " +
                "objeto, sem editar o serviço.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma interface com uma única implementação e nenhuma perspectiva de outra pode ser só indireção sem benefício.",
                "Um contrato que espelha a implementação, com detalhes do S3, por exemplo, não desacopla nada; desenhe-o pelo que quem usa precisa.",
                "A assinatura sozinha não basta: o comportamento esperado e os erros também fazem parte do contrato, e sem eles as implementações divergem.",
              ],
            },
          ],
          examples: [
            {
              title: "Trocar a implementação sem tocar em quem usa",
              context: "Quem registra mensagens não deveria saber para onde elas vão.",
              code: {
                language: "javascript",
                filename: "logger.js",
                code: [
                  "const consoleLogger = { log: (msg) => console.log(msg) };",
                  "const fileLogger = { log: (msg) => appendToFile(\"app.log\", msg) };",
                  "",
                  "function processOrder(order, logger) {",
                  "  logger.log(`processando ${order.id}`);   // só exige log(msg)",
                  "  // ...",
                  "}",
                  "",
                  "processOrder({ id: 1 }, consoleLogger);",
                  "processOrder({ id: 2 }, fileLogger);",
                ].join("\n"),
              },
              explanation:
                "`processOrder` funciona com qualquer coisa que tenha `log`. Trocar o destino dos logs, ou usar um " +
                "logger silencioso em testes, não exige nenhuma alteração nela.",
            },
            {
              title: "Depender de \"algo iterável\", e não de Array",
              context: "A linguagem já oferece contratos: o de iteração aceita mais do que arrays.",
              code: {
                language: "javascript",
                filename: "iterable.js",
                code: [
                  "// Antes: exige um Array e usa métodos que só ele tem",
                  "function sumArray(numbers) { return numbers.reduce((t, n) => t + n, 0); }",
                  "",
                  "// Depois: depende só do contrato de iteração",
                  "function sum(numbers) {",
                  "  let total = 0;",
                  "  for (const n of numbers) total += n;",
                  "  return total;",
                  "}",
                  "",
                  "sum([1, 2, 3]);              // 6",
                  "sum(new Set([1, 2, 3]));     // 6",
                  "sum((function* () { yield 1; yield 2; })());   // 3",
                ].join("\n"),
              },
              explanation:
                "`sum` pede apenas \"algo sobre o que se possa iterar\". Arrays, Sets e geradores cumprem o contrato, e " +
                "`sumArray` só aceitaria o primeiro.",
            },
            {
              title: "Um contrato que espelha a implementação vaza detalhes",
              context: "A abstração precisa ser pensada a partir de quem usa, e não do que o fornecedor oferece.",
              code: {
                language: "javascript",
                filename: "leaky-contract.js",
                code: [
                  "// Vaza: o contrato repete a API do S3 (bucket, ACL)",
                  "// storage.putObjectWithAcl(bucket, key, body, \"private\")",
                  "",
                  "// Melhor: o que quem usa realmente precisa",
                  "// storage.write(name, body)",
                  "",
                  "class ReportService {",
                  "  constructor(storage) { this.storage = storage; }",
                  "  save(report) { this.storage.write(report.name, report.body); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se o contrato exige `bucket` e `ACL`, todo cliente e toda implementação continuam presos ao S3. O " +
                "contrato certo descreve a necessidade (gravar), e os detalhes ficam na implementação.",
            },
          ],
          exercise: {
            problem:
              "`CheckoutService` cria o gateway de pagamento dentro de si. Não há como testar `pay` sem chamar a API " +
              "real, nem como trocar de provedor sem editar a classe.",
            problemCode: {
              language: "javascript",
              filename: "checkout.js",
              code: [
                "class StripeGateway {",
                "  charge(amount) { /* chama a API real do Stripe */ return { ok: true }; }",
                "}",
                "",
                "class CheckoutService {",
                "  constructor() { this.gateway = new StripeGateway(); }",
                "  pay(total) {",
                "    const result = this.gateway.charge(total);",
                "    return result.ok ? \"pago\" : \"recusado\";",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Faça `CheckoutService` depender do contrato `{ charge(amount) }`, recebendo o gateway de fora, e mostre " +
              "um teste do caso \"recusado\" sem usar o Stripe.",
            hint: "A classe deve receber, de fora, algo que tenha `charge()`, sem saber qual implementação é.",
            solution: {
              code: {
                language: "javascript",
                filename: "checkout.fixed.js",
                code: [
                  "class CheckoutService {",
                  "  constructor(gateway) { this.gateway = gateway; }   // qualquer objeto com charge()",
                  "  pay(total) {",
                  "    const result = this.gateway.charge(total);",
                  "    return result.ok ? \"pago\" : \"recusado\";",
                  "  }",
                  "}",
                  "",
                  "// Produção: new CheckoutService(new StripeGateway())",
                  "",
                  "// Teste: um gateway falso que recusa",
                  "const decliningGateway = { charge: () => ({ ok: false }) };",
                  "new CheckoutService(decliningGateway).pay(100);   // \"recusado\"",
                ].join("\n"),
              },
              explanation:
                "`CheckoutService` conhece só o contrato `charge`. O teste usa um objeto de uma linha, e trocar de " +
                "provedor é passar outra implementação.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Composition over Inheritance",
          requires: [
            "Programming Foundations / Programming Fundamentals / Composition",
            "Programming Foundations / Programming Fundamentals / Inheritance",
          ],
          note: "heurística realocada do Epic 01 — escolhe entre os dois mecanismos já ensinados",
          summary:
            "Prefira montar comportamento combinando objetos menores (tem-um) a herdá-lo de uma classe base " +
            "(é-um): a herança prende as classes umas às outras, e a composição permite trocar e combinar as peças.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Composition over Inheritance é uma heurística para escolher entre dois mecanismos já vistos no módulo " +
                "Programming Fundamentals: Inheritance, em que uma subclasse herda da base (é-um), e Composition, em " +
                "que um objeto usa outros e delega a eles (tem-um). A heurística diz para começar pela composição e " +
                "reservar a herança para quando a relação é de fato \"é um\" e a subclasse cumpre todo o contrato da base.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Comece por composição: use herança só quando a relação é realmente \"é um\" e a subclasse cumpre todo o " +
                "contrato da classe base.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A herança cria o acoplamento mais forte entre duas classes: a subclasse depende de detalhes da base " +
                "e herda tudo, inclusive o que não quer. Uma mudança na base pode quebrar as subclasses, e uma " +
                "subclasse que não cumpre o contrato viola o Liskov Substitution Principle. Além disso, a hierarquia é " +
                "fixada no momento em que se escreve o código: combinar variações independentes (formato e criptografia, " +
                "voar e nadar) faz o número de classes explodir.",
            },
            {
              type: "paragraph",
              text:
                "Com composição, cada comportamento é uma peça separada que pode ser trocada, testada e combinada de " +
                "forma independente, até em tempo de execução. É a base de vários dos padrões de projeto dos módulos " +
                "seguintes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma hierarquia que não consegue combinar comportamentos, e as mesmas peças compostas:" },
            {
              type: "code",
              language: "javascript",
              filename: "composition.js",
              code: [
                "// Antes: cada comportamento é uma subclasse",
                "class Animal {}",
                "class FlyingAnimal extends Animal { move() { return \"voa\"; } }",
                "class SwimmingAnimal extends Animal { move() { return \"nada\"; } }",
                "// E um pato, que voa e nada? Nenhuma das duas classes serve.",
                "",
                "// Depois: comportamentos como peças que se combinam",
                "const canFly = () => ({ fly: () => \"voa\" });",
                "const canSwim = () => ({ swim: () => \"nada\" });",
                "",
                "const createDuck = (name) => ({ name, ...canFly(), ...canSwim() });",
                "const createFish = (name) => ({ name, ...canSwim() });",
                "",
                "const duck = createDuck(\"Pato\");",
                "duck.fly();    // \"voa\"",
                "duck.swim();   // \"nada\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada capacidade existe uma vez e é combinada onde faz falta. Um novo animal é uma nova combinação, e " +
                "não uma nova classe na hierarquia.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "É uma regra de bolso, não uma proibição: a herança continua adequada para uma relação \"é um\" estável e que respeita o contrato.",
                "A composição exige mais código de ligação, com delegação explícita, e pode espalhar o comportamento em muitas peças pequenas.",
                "Peças combinadas com spread ou mixins podem colidir em nomes; mantenha cada peça com uma responsabilidade clara e nomes distintos.",
              ],
            },
          ],
          examples: [
            {
              title: "A subclasse que herda o que não quer",
              context: "Estender uma classe pronta para reaproveitar um método traz junto toda a sua interface.",
              code: {
                language: "javascript",
                filename: "stack.js",
                code: [
                  "// Herança: Stack é um Array, e herda métodos que quebram a regra LIFO",
                  "class BadStack extends Array {}",
                  "const bad = new BadStack();",
                  "bad.push(1);",
                  "bad.push(2);",
                  "bad.unshift(0);   // insere no fundo — a pilha deixou de ser uma pilha",
                  "",
                  "// Composição: Stack tem um array e expõe só o que faz sentido",
                  "class Stack {",
                  "  #items = [];",
                  "  push(item) { this.#items.push(item); }",
                  "  pop() { return this.#items.pop(); }",
                  "  get size() { return this.#items.length; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Na versão composta, o array é um detalhe privado. A interface pública é só a de uma pilha, e trocar o " +
                "array por outra estrutura não afeta quem usa.",
            },
            {
              title: "Trocar o comportamento em tempo de execução",
              context: "Uma peça recebida pode ser substituída depois; uma superclasse, não.",
              code: {
                language: "javascript",
                filename: "swap-behavior.js",
                code: [
                  "const sword = { attack: () => \"golpe de espada (10)\" };",
                  "const bow = { attack: () => \"flecha (7)\" };",
                  "",
                  "class Hero {",
                  "  constructor(weapon) { this.weapon = weapon; }",
                  "  attack() { return this.weapon.attack(); }   // delega à peça",
                  "}",
                  "",
                  "const hero = new Hero(sword);",
                  "hero.attack();       // \"golpe de espada (10)\"",
                  "hero.weapon = bow;   // muda de comportamento sem criar outra classe",
                  "hero.attack();       // \"flecha (7)\"",
                ].join("\n"),
              },
              explanation:
                "Com herança, `SwordHero` e `BowHero` seriam classes fixas, e mudar de arma exigiria criar outro " +
                "objeto. Com composição, basta trocar a peça.",
            },
            {
              title: "Quando a herança ainda é a escolha certa",
              context: "A heurística diz \"prefira\", e não \"nunca\".",
              code: {
                language: "javascript",
                filename: "valid-inheritance.js",
                code: [
                  "// Um ValidationError realmente é um Error, e cumpre o contrato dele",
                  "class ValidationError extends Error {",
                  "  constructor(field, message) {",
                  "    super(message);",
                  "    this.name = \"ValidationError\";",
                  "    this.field = field;",
                  "  }",
                  "}",
                  "",
                  "try {",
                  "  throw new ValidationError(\"email\", \"formato inválido\");",
                  "} catch (err) {",
                  "  console.log(err instanceof Error);   // true — pode ser usado onde um Error é esperado",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A relação é de fato \"é um\", estável, e a subclasse pode substituir a base em qualquer lugar. Aqui a " +
                "herança expressa a intenção melhor que a composição.",
            },
          ],
          exercise: {
            problem:
              "Cada combinação de formato e criptografia virou uma classe. Adicionar compressão dobraria o número de " +
              "classes de novo.",
            problemCode: {
              language: "javascript",
              filename: "reports.js",
              code: [
                "class Report { constructor(data) { this.data = data; } }",
                "",
                "class PdfReport extends Report { render() { return `PDF(${this.data})`; } }",
                "class CsvReport extends Report { render() { return `CSV(${this.data})`; } }",
                "",
                "class EncryptedPdfReport extends PdfReport { render() { return `ENC(${super.render()})`; } }",
                "class EncryptedCsvReport extends CsvReport { render() { return `ENC(${super.render()})`; } }",
              ].join("\n"),
            },
            task:
              "Refatore para composição: trate o formato e a criptografia como peças independentes que um único " +
              "`Report` recebe e combina.",
            hint: "O formato é uma função que transforma os dados; a criptografia pode ser uma função que envolve outra.",
            solution: {
              code: {
                language: "javascript",
                filename: "reports.fixed.js",
                code: [
                  "const pdf = (data) => `PDF(${data})`;",
                  "const csv = (data) => `CSV(${data})`;",
                  "const encrypted = (format) => (data) => `ENC(${format(data)})`;",
                  "",
                  "class Report {",
                  "  constructor(data, formatter) { this.data = data; this.formatter = formatter; }",
                  "  render() { return this.formatter(this.data); }",
                  "}",
                  "",
                  "new Report(\"vendas\", pdf).render();              // \"PDF(vendas)\"",
                  "new Report(\"vendas\", encrypted(csv)).render();   // \"ENC(CSV(vendas))\"",
                ].join("\n"),
              },
              explanation:
                "Uma única classe `Report` e peças que se combinam substituem quatro classes. Adicionar compressão é uma " +
                "nova função, e não uma nova camada da hierarquia.",
            },
          },
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
        concept({
          order: 10,
          title: "Inversion of Control (IoC)",
          note: "guarda-chuva: quem controla o fluxo e a criação de dependências",
          summary:
            "Em vez de o seu código controlar quando as coisas acontecem e criar tudo o que usa, ele entrega o " +
            "controle a alguém de fora — um framework, um contêiner, um chamador — que decide quando e com o que chamá-lo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Inversion of Control é um princípio guarda-chuva: o controle do fluxo, ou da criação das " +
                "dependências, sai do seu código e vai para outro lugar. No fluxo normal, você chama a biblioteca " +
                "quando quer. Com IoC, você entrega uma função ou um objeto e quem controla chama você quando for a " +
                "hora — o \"princípio de Hollywood\": não nos chame, nós chamamos você. Callbacks, manipuladores de " +
                "eventos, frameworks e Dependency Injection são formas de IoC.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Não é o seu código que chama e monta tudo: ele declara o que oferece e do que precisa, e quem " +
                "controla decide quando e com o que ligá-lo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando seu código controla tudo, ele também precisa saber tudo: em que ordem chamar, quais " +
                "implementações criar, quando parar. Com IoC, essas decisões ficam concentradas em um só lugar (o " +
                "framework, o ponto de montagem), e as peças ficam menores, mais fáceis de trocar e de testar. É a " +
                "base do Dependency Inversion Principle e o que torna possível a maior parte da estrutura de " +
                "frameworks web e de testes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um fluxo controlado pelo seu código, e o mesmo fluxo com o controle invertido:" },
            {
              type: "code",
              language: "javascript",
              filename: "ioc.js",
              code: [
                "// Sem IoC: o seu código controla o fluxo do começo ao fim",
                "function main() {",
                "  const request = readRequest();",
                "  const response = handleUsers(request);",
                "  send(response);",
                "}",
                "",
                "// Com IoC: você registra o que fazer; o framework decide quando chamar",
                "const routes = new Map();",
                "const app = {",
                "  get: (path, handler) => routes.set(path, handler),",
                "  dispatch: (path, request) => routes.get(path)(request),   // o framework controla o fluxo",
                "};",
                "",
                "app.get(\"/users\", (request) => ({ status: 200, body: [\"Ana\", \"Bruno\"] }));",
                "app.dispatch(\"/users\", {});   // o handler roda quando o framework chama",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O handler não sabe quem o chama, nem quando. Ele só cumpre o contrato (recebe uma requisição, " +
                "devolve uma resposta), e o app decide o resto.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O fluxo deixa de ser linear: para entender o que acontece, é preciso saber como o framework chama seu código, e os stack traces ficam mais difíceis de seguir.",
                "IoC não é o mesmo que Dependency Injection: DI é uma das formas de inverter o controle, a que trata da criação de dependências.",
                "Frameworks que fazem demais escondem o comportamento; quando algo dá errado, a \"mágica\" atrapalha a depuração.",
              ],
            },
          ],
          examples: [
            {
              title: "Callbacks e eventos: quem chama é o outro",
              context: "Todo manipulador de evento é IoC: você registra a função e o ambiente decide quando executá-la.",
              code: {
                language: "javascript",
                filename: "callbacks.js",
                code: [
                  "// Você não chama onClick: a plataforma chama quando o clique acontece",
                  "button.addEventListener(\"click\", () => console.log(\"clicou\"));",
                  "",
                  "// O mesmo vale para timers",
                  "setTimeout(() => console.log(\"passou 1s\"), 1000);",
                ].join("\n"),
              },
              explanation:
                "Em nenhum dos dois casos o seu código decide o momento da chamada. Você entrega a função e o " +
                "ambiente (o navegador, o Event Loop) controla o fluxo.",
            },
            {
              title: "Quem controla o laço",
              context: "Em métodos como `map`, o laço é da biblioteca, e você só fornece o que fazer com cada item.",
              code: {
                language: "javascript",
                filename: "loop-control.js",
                code: [
                  "const prices = [10, 20, 30];",
                  "",
                  "// Você controla o laço",
                  "const withTax = [];",
                  "for (const price of prices) withTax.push(price * 1.1);",
                  "",
                  "// O controle é invertido: map controla o laço, você só entrega a regra",
                  "const withTax2 = prices.map((price) => price * 1.1);",
                ].join("\n"),
              },
              explanation:
                "O `map` decide a ordem, a repetição e o resultado, e chama a sua função em cada passo. É a mesma " +
                "inversão, aplicada a algo pequeno.",
            },
            {
              title: "IoC na criação de dependências",
              context: "Em vez de a classe criar o que usa, ela recebe o que usa — a forma de IoC que dá nome ao módulo.",
              code: {
                language: "javascript",
                filename: "creation-control.js",
                code: [
                  "// Sem inversão: a classe controla a criação da dependência",
                  "class Notifier {",
                  "  constructor() { this.mailer = new SmtpMailer(); }",
                  "}",
                  "",
                  "// Com inversão: quem monta decide qual mailer entregar",
                  "class InvertedNotifier {",
                  "  constructor(mailer) { this.mailer = mailer; }",
                  "}",
                  "",
                  "new InvertedNotifier(new SmtpMailer());",
                  "new InvertedNotifier({ send() {} });   // um mailer falso, em um teste",
                ].join("\n"),
              },
              explanation:
                "A decisão de qual `mailer` usar saiu da classe e foi para quem a monta. Esse é o assunto do próximo " +
                "Concept, Dependency Injection.",
            },
          ],
          exercise: {
            problem:
              "O fluxo de checkout abaixo controla a ordem e a lista de passos. Para incluir um passo novo, como " +
              "\"aplicar cupom\", é preciso editar `checkoutFlow`.",
            problemCode: {
              language: "javascript",
              filename: "checkout-flow.js",
              code: [
                "function checkoutFlow(cart) {",
                "  validate(cart);",
                "  const total = calculateTotal(cart);",
                "  chargeCard(cart.user, total);",
                "  sendReceipt(cart.user);",
                "}",
              ].join("\n"),
            },
            task:
              "Inverta o controle: crie um executor que percorre uma lista de passos recebida de fora, de modo que " +
              "adicionar um passo não exija editar o executor.",
            hint: "O executor deve saber apenas que cada passo é uma função que recebe o contexto; quem monta a lista decide quais e em que ordem.",
            solution: {
              code: {
                language: "javascript",
                filename: "checkout-flow.fixed.js",
                code: [
                  "// O executor controla o fluxo; os passos são entregues de fora",
                  "function runSteps(context, steps) {",
                  "  for (const step of steps) step(context);",
                  "}",
                  "",
                  "const steps = [",
                  "  (ctx) => validate(ctx.cart),",
                  "  (ctx) => { ctx.total = calculateTotal(ctx.cart); },",
                  "  (ctx) => chargeCard(ctx.cart.user, ctx.total),",
                  "  (ctx) => sendReceipt(ctx.cart.user),",
                  "];",
                  "",
                  "runSteps({ cart }, steps);",
                  "",
                  "// Novo passo: uma entrada na lista, sem editar runSteps",
                  "steps.splice(2, 0, (ctx) => { ctx.total = applyCoupon(ctx.total); });",
                ].join("\n"),
              },
              explanation:
                "`runSteps` não conhece nenhum passo: ele só percorre a lista. Quem monta os passos decide o conteúdo e " +
                "a ordem, e o fluxo passa a ser controlado de fora do código dos passos.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Dependency Injection",
          requires: ["Inversion of Control (IoC)"],
          note:
            "a técnica concreta — forma mais comum de aplicar IoC. DI é aplicação da testabilidade (via inversa já registrada no Epic 02), não o contrário",
          revisit: ["Testing & Quality Engineering / Testing Strategy / Testability"],
          summary:
            "Um objeto recebe de fora as dependências de que precisa, em vez de criá-las por dentro — a forma mais " +
            "comum de aplicar Inversion of Control.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Dependency Injection é a técnica em que um objeto recebe as suas dependências (o banco, o serviço de " +
                "e-mail, o relógio) de quem o cria, em vez de instanciá-las com `new` dentro de si. Quem monta o objeto " +
                "decide qual implementação entregar. É a forma mais comum de aplicar Inversion of Control e o que torna " +
                "prático seguir o Dependency Inversion Principle e a testabilidade (Testability, módulo Testing Strategy).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Não crie as suas dependências: receba-as. Assim a classe declara do que precisa, e quem a monta " +
                "escolhe o quê — uma implementação real em produção e uma falsa em um teste.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A dependência entra por um de três caminhos: pelo construtor (Constructor Injection, o mais comum), " +
                "por um método `set…` ou por um parâmetro da própria operação. O código que as escolhe e liga fica " +
                "concentrado em um só ponto, perto do início do programa, o \"ponto de composição\".",
            },
            {
              type: "code",
              language: "javascript",
              filename: "di.js",
              code: [
                "// Sem DI: a classe cria a dependência e fica presa a ela",
                "class WelcomeService {",
                "  constructor() { this.mailer = new SmtpMailer(); }",
                "  greet(user) { this.mailer.send(user.email, \"Bem-vindo!\"); }",
                "}",
                "",
                "// Com DI: a dependência chega de fora",
                "class WelcomeServiceDI {",
                "  constructor(mailer) { this.mailer = mailer; }",
                "  greet(user) { this.mailer.send(user.email, \"Bem-vindo!\"); }",
                "}",
                "",
                "// Ponto de composição: quem monta decide",
                "const service = new WelcomeServiceDI(new SmtpMailer());",
                "",
                "// Em um teste: uma implementação falsa, sem enviar e-mail de verdade",
                "const sent = [];",
                "new WelcomeServiceDI({ send: (to, text) => sent.push({ to, text }) }).greet({ email: \"ana@x.com\" });",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`WelcomeServiceDI` não sabe se o mailer é o real ou um falso. Isso é o que permite o teste: ele " +
                "entrega um objeto de uma linha e verifica o que foi \"enviado\".",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para dependências que envolvem I/O ou efeitos externos, como banco, rede, e-mail, relógio e arquivos.",
                "Quando há, ou pode haver, mais de uma implementação, ou é preciso substituí-la em testes.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não injete o que é estável e sem efeito, como `Math` ou funções puras utilitárias: só acrescenta parâmetros.",
                "Uma classe com muitas dependências injetadas costuma indicar responsabilidades demais; o problema é o design, e não a injeção.",
                "DI só move a decisão de lugar: alguém ainda precisa montar o grafo, e em sistemas grandes isso pede um ponto de composição organizado.",
              ],
            },
          ],
          examples: [
            {
              title: "Injetar o relógio",
              context: "A hora atual é uma dependência escondida que torna testes imprevisíveis.",
              code: {
                language: "javascript",
                filename: "clock.js",
                code: [
                  "// Antes: depende da hora real, e o teste muda a cada execução",
                  "function isExpired(token) {",
                  "  return Date.now() > token.expiresAt;",
                  "}",
                  "",
                  "// Depois: o relógio entra como parâmetro, com um valor padrão",
                  "function isExpiredAt(token, now = Date.now) {",
                  "  return now() > token.expiresAt;",
                  "}",
                  "",
                  "const token = { expiresAt: 1000 };",
                  "isExpiredAt(token, () => 999);    // false",
                  "isExpiredAt(token, () => 1001);   // true",
                ].join("\n"),
              },
              explanation:
                "Recebendo `now`, a função fica determinística nos testes e continua funcionando em produção com o " +
                "padrão. É DI aplicada por parâmetro, sem nenhuma classe.",
            },
            {
              title: "Trocar a implementação no ponto de composição",
              context: "A decisão de qual implementação usar fica em um só lugar, e as classes não mudam.",
              code: {
                language: "javascript",
                filename: "composition-root.js",
                code: [
                  "class ConsoleMailer { send(to, text) { console.log(`para ${to}: ${text}`); } }",
                  "class SmtpMailer { send(to, text) { /* envia por SMTP */ } }",
                  "",
                  "class WelcomeService {",
                  "  constructor(mailer) { this.mailer = mailer; }",
                  "  greet(user) { this.mailer.send(user.email, \"Bem-vindo!\"); }",
                  "}",
                  "",
                  "// Único lugar que sabe qual implementação usar",
                  "const mailer = process.env.NODE_ENV === \"production\" ? new SmtpMailer() : new ConsoleMailer();",
                  "const welcome = new WelcomeService(mailer);",
                ].join("\n"),
              },
              explanation:
                "Em desenvolvimento a mensagem vai para o console, e em produção, por SMTP. `WelcomeService` não " +
                "muda: quem escolhe é o ponto de composição.",
            },
            {
              title: "DI manual, sem container nem framework",
              context: "A técnica não exige biblioteca: ligar as peças à mão, em um `main`, já é DI.",
              code: {
                language: "javascript",
                filename: "manual-wiring.js",
                code: [
                  "class Database { query(sql) { /* ... */ } }",
                  "class UserRepository { constructor(db) { this.db = db; } }",
                  "class UserService { constructor(repository) { this.repository = repository; } }",
                  "",
                  "function main() {",
                  "  const db = new Database();",
                  "  const repository = new UserRepository(db);",
                  "  const service = new UserService(repository);",
                  "  return service;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O grafo inteiro é montado em um lugar legível, sem mágica. Para muitos projetos, esse é o ponto de " +
                "composição suficiente; um container só compensa quando o grafo cresce.",
            },
          ],
          exercise: {
            problem:
              "`ReminderService` cria o cliente de SMS e lê a hora sozinho. Não há como testá-lo sem enviar mensagens " +
              "de verdade nem depender da hora do dia.",
            problemCode: {
              language: "javascript",
              filename: "reminder.js",
              code: [
                "class ReminderService {",
                "  constructor() { this.sms = new TwilioClient(); }",
                "  remind(user) {",
                "    const hour = new Date().getHours();",
                "    if (hour < 8 || hour >= 20) return \"fora do horário\";",
                "    this.sms.send(user.phone, \"Não esqueça da consulta\");",
                "    return \"enviado\";",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique DI: receba o cliente de SMS e o relógio de fora e escreva um teste do caso \"fora do horário\", " +
              "sem enviar SMS.",
            hint: "As duas dependências ocultas são o `new TwilioClient()` e o `new Date()`. Ambas devem chegar pelo construtor.",
            solution: {
              code: {
                language: "javascript",
                filename: "reminder.fixed.js",
                code: [
                  "class ReminderService {",
                  "  constructor(sms, now = () => new Date()) {",
                  "    this.sms = sms;",
                  "    this.now = now;",
                  "  }",
                  "  remind(user) {",
                  "    const hour = this.now().getHours();",
                  "    if (hour < 8 || hour >= 20) return \"fora do horário\";",
                  "    this.sms.send(user.phone, \"Não esqueça da consulta\");",
                  "    return \"enviado\";",
                  "  }",
                  "}",
                  "",
                  "// Teste: SMS falso e uma hora fixa às 22h",
                  "const sent = [];",
                  "const service = new ReminderService(",
                  "  { send: (phone, text) => sent.push({ phone, text }) },",
                  "  () => new Date(2026, 0, 1, 22, 0),",
                  ");",
                  "service.remind({ phone: \"1199999-0000\" });   // \"fora do horário\"; sent continua vazio",
                ].join("\n"),
              },
              explanation:
                "O cliente e o relógio agora entram de fora. O teste controla a hora e usa um SMS falso, e verifica que " +
                "nada foi enviado, sem tocar na rede.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Constructor Injection",
          requires: ["Dependency Injection"],
          note: "a forma mais comum de DI",
          summary:
            "Declarar as dependências como parâmetros do construtor: o objeto só existe com tudo de que precisa, e " +
            "fica completo e pronto para uso desde a criação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Constructor Injection é a forma de Dependency Injection em que as dependências obrigatórias são " +
                "recebidas no construtor e guardadas no objeto. A assinatura do construtor passa a ser a lista honesta " +
                "do que a classe precisa, e um objeto só pode ser criado se todas forem fornecidas. Depois de construído, " +
                "ele já está pronto para uso, sem nenhuma etapa de configuração pendente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Tudo o que o objeto precisa entra pelo construtor: ele nasce completo, com dependências explícitas e " +
                "sem estados \"quase prontos\".",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O construtor recebe as dependências, opcionalmente confere se vieram, e as guarda em campos privados " +
                "que não mudam depois. Quem lê a classe vê de relance do que ela depende.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "constructor-injection.js",
              code: [
                "class OrderService {",
                "  #repository;",
                "  #notifier;",
                "",
                "  constructor(repository, notifier) {",
                "    if (!repository || !notifier) throw new Error(\"OrderService precisa de repository e notifier\");",
                "    this.#repository = repository;",
                "    this.#notifier = notifier;",
                "  }",
                "",
                "  place(order) {",
                "    this.#repository.save(order);",
                "    this.#notifier.send(`pedido ${order.id} recebido`);",
                "  }",
                "}",
                "",
                "// A assinatura conta do que a classe depende; esquecer uma falha logo na criação",
                "new OrderService(repository, notifier);",
                "new OrderService(repository);   // Error: OrderService precisa de repository e notifier",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A falha por dependência ausente acontece na criação, na linha que montou o objeto, e não muito depois, " +
                "quando um método usaria um campo `undefined`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para dependências obrigatórias, sem as quais o objeto não funciona.",
                "Quando você quer objetos completos e imutáveis desde a criação, sem estados intermediários.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para dependências opcionais, um valor padrão ou um parâmetro na operação costuma ser mais simples que um construtor com muitos casos.",
                "Uma dependência usada só em um método pode entrar como parâmetro desse método, e não pelo construtor.",
                "Muitos parâmetros (mais de quatro, como referência) indicam responsabilidades demais; divida a classe.",
                "Não resolve dependências circulares: se A precisa de B e B de A, o problema está no design.",
              ],
            },
          ],
          examples: [
            {
              title: "Dependência opcional com valor padrão",
              context: "O que é opcional pode ter um padrão sensato, sem abrir mão de poder ser trocado.",
              code: {
                language: "javascript",
                filename: "default-dependency.js",
                code: [
                  "class ReportService {",
                  "  constructor(storage, logger = { log() {} }) {   // logger é opcional",
                  "    this.storage = storage;",
                  "    this.logger = logger;",
                  "  }",
                  "  save(report) {",
                  "    this.storage.write(report.name, report.body);",
                  "    this.logger.log(`salvo: ${report.name}`);",
                  "  }",
                  "}",
                  "",
                  "new ReportService(storage);                // sem log",
                  "new ReportService(storage, console);       // com log",
                ].join("\n"),
              },
              explanation:
                "O `storage` é obrigatório e o `logger` é opcional, com um padrão que não faz nada. Nenhum dos dois " +
                "é criado dentro da classe.",
            },
            {
              title: "Falhar cedo quando falta uma dependência",
              context: "Validar no construtor transforma um erro tardio e confuso em um erro imediato e claro.",
              code: {
                language: "javascript",
                filename: "fail-fast.js",
                code: [
                  "class InvoiceService {",
                  "  constructor(repository) {",
                  "    this.repository = repository;",
                  "  }",
                  "  total(id) { return this.repository.find(id).total; }",
                  "}",
                  "",
                  "const service = new InvoiceService();   // esqueceu o repository",
                  "// ... muito depois, em outro ponto do programa:",
                  "service.total(1);   // TypeError: Cannot read properties of undefined",
                  "",
                  "// Com verificação no construtor, o erro aparece onde está a causa:",
                  "// constructor(repository) {",
                  "//   if (!repository) throw new Error(\"InvoiceService precisa de repository\");",
                  "// }",
                ].join("\n"),
              },
              explanation:
                "Sem a checagem, o erro só aparece quando alguém usa o objeto, longe de onde ele foi montado " +
                "errado. Com ela, a causa e o sintoma ficam juntos.",
            },
            {
              title: "Muitos parâmetros são um sinal de design",
              context: "Um construtor longo mostra, de forma honesta, que a classe faz coisas demais.",
              code: {
                language: "javascript",
                filename: "too-many-params.js",
                code: [
                  "// Sinal de alerta: sete dependências, e a classe provavelmente faz demais",
                  "class CheckoutService {",
                  "  constructor(cart, stock, payment, shipping, tax, coupons, mailer) { /* ... */ }",
                  "}",
                  "",
                  "// Melhor: dividir por responsabilidade, e compor as partes",
                  "class PricingService { constructor(tax, coupons) { /* ... */ } }",
                  "class FulfillmentService { constructor(stock, shipping, mailer) { /* ... */ } }",
                  "class Checkout { constructor(pricing, fulfillment, payment) { /* ... */ } }",
                ].join("\n"),
              },
              explanation:
                "Constructor Injection não cria o problema: ele o expõe. A saída é dividir a classe (Single " +
                "Responsibility Principle), e não esconder as dependências.",
            },
          ],
          exercise: {
            problem:
              "`OrderService` recebe as dependências por métodos `set…`. Esquecer de chamar um deles deixa o objeto " +
              "pela metade e o erro só aparece em `place`.",
            problemCode: {
              language: "javascript",
              filename: "order-service.js",
              code: [
                "class OrderService {",
                "  setRepository(repository) { this.repository = repository; }",
                "  setNotifier(notifier) { this.notifier = notifier; }",
                "  place(order) {",
                "    this.repository.save(order);",
                "    this.notifier.send(`pedido ${order.id}`);",
                "  }",
                "}",
                "",
                "const service = new OrderService();",
                "service.setRepository(repository);   // esqueceu setNotifier",
                "service.place({ id: 1 });            // TypeError, depois de já ter salvo o pedido",
              ].join("\n"),
            },
            task:
              "Converta para Constructor Injection: as duas dependências entram pelo construtor, ficam privadas, e a " +
              "falta de qualquer uma falha na criação.",
            hint: "Troque os dois `set…` por parâmetros do construtor, valide-os ali e guarde-os em campos privados.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-service.fixed.js",
                code: [
                  "class OrderService {",
                  "  #repository;",
                  "  #notifier;",
                  "",
                  "  constructor(repository, notifier) {",
                  "    if (!repository || !notifier) throw new Error(\"OrderService precisa de repository e notifier\");",
                  "    this.#repository = repository;",
                  "    this.#notifier = notifier;",
                  "  }",
                  "",
                  "  place(order) {",
                  "    this.#repository.save(order);",
                  "    this.#notifier.send(`pedido ${order.id}`);",
                  "  }",
                  "}",
                  "",
                  "new OrderService(repository, notifier).place({ id: 1 });",
                  "new OrderService(repository);   // falha aqui, na criação, antes de salvar qualquer coisa",
                ].join("\n"),
              },
              explanation:
                "O objeto só existe completo: o erro passou a acontecer na criação, antes de qualquer efeito, e as " +
                "dependências deixaram de poder ser trocadas por acidente depois.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Dependency Injection Container",
          requires: ["Dependency Injection"],
          note: "automatiza a montagem do grafo de dependências",
          summary:
            "Um componente que sabe como construir cada dependência e monta, sozinho, o grafo de objetos inteiro — " +
            "com controle do ciclo de vida de cada um.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Dependency Injection Container (ou IoC container) registra como criar cada dependência e, ao ser " +
                "pedido um objeto, resolve recursivamente tudo de que ele precisa. Em vez de escrever à mão a cadeia " +
                "de `new` do ponto de composição, você a descreve uma vez, e o container a executa. Ele também " +
                "controla o ciclo de vida: um único objeto compartilhado (singleton) ou um novo a cada pedido.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O container automatiza a montagem do grafo de dependências que você faria à mão — e só vale a " +
                "pena quando esse grafo é grande o bastante para justificar a automação.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada componente é registrado com uma função de fábrica que pode pedir ao container as suas próprias " +
                "dependências. Ao resolver um nome, o container executa a fábrica, guarda o resultado se for singleton " +
                "e o devolve. Bibliotecas reais fazem isso, com mais recursos, mas a ideia central cabe em poucas linhas:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "container.js",
              code: [
                "class Container {",
                "  #entries = new Map();",
                "  #singletons = new Map();",
                "",
                "  register(name, factory, { singleton = true } = {}) {",
                "    this.#entries.set(name, { factory, singleton });",
                "  }",
                "",
                "  resolve(name) {",
                "    const entry = this.#entries.get(name);",
                "    if (!entry) throw new Error(`não registrado: ${name}`);",
                "    if (!entry.singleton) return entry.factory(this);",
                "    if (!this.#singletons.has(name)) this.#singletons.set(name, entry.factory(this));",
                "    return this.#singletons.get(name);",
                "  }",
                "}",
                "",
                "class Database {}",
                "class UserRepository { constructor(db) { this.db = db; } }",
                "class UserService { constructor(repository) { this.repository = repository; } }",
                "",
                "const container = new Container();",
                "container.register(\"db\", () => new Database());",
                "container.register(\"userRepository\", (c) => new UserRepository(c.resolve(\"db\")));",
                "container.register(\"userService\", (c) => new UserService(c.resolve(\"userRepository\")));",
                "",
                "const service = container.resolve(\"userService\");   // monta db → repository → service",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Quem pede `userService` não precisa saber que ele depende de um repositório, nem que este depende de " +
                "um banco: o container percorre o grafo. Note que apenas o ponto de composição fala com o container; as " +
                "classes continuam recebendo suas dependências no construtor.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o grafo de dependências é grande e a montagem manual vira uma cadeia longa e repetida em vários pontos de entrada.",
                "Quando o ciclo de vida importa, como um singleton para o banco e um objeto novo por requisição.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em aplicações pequenas, montar à mão no ponto de composição é mais simples e mais legível que adotar um container.",
                "Containers com resolução automática escondem o grafo, e um erro de registro só aparece ao executar, e não ao compilar.",
                "Passar o container para dentro das classes e chamar `resolve` ali transforma o container em um Service Locator, e perde a vantagem da DI.",
              ],
            },
          ],
          examples: [
            {
              title: "Singleton ou novo a cada pedido",
              context: "O ciclo de vida define se todos compartilham o mesmo objeto ou cada um recebe o seu.",
              code: {
                language: "javascript",
                filename: "lifetimes.js",
                code: [
                  "const container = new Container();",
                  "container.register(\"db\", () => new Database());                            // singleton (padrão)",
                  "container.register(\"requestContext\", () => ({ id: Math.random() }), { singleton: false });",
                  "",
                  "container.resolve(\"db\") === container.resolve(\"db\");                       // true — o mesmo",
                  "container.resolve(\"requestContext\") === container.resolve(\"requestContext\"); // false — um novo por pedido",
                ].join("\n"),
              },
              explanation:
                "O banco deve ser compartilhado, porque abrir uma conexão a cada uso seria caro. O contexto de uma " +
                "requisição não pode ser compartilhado, senão os dados de uma vazariam para outra.",
            },
            {
              title: "Substituir um registro em um teste",
              context: "Como o grafo é descrito em um lugar só, trocar uma peça é registrar outra no seu lugar.",
              code: {
                language: "javascript",
                filename: "override.js",
                code: [
                  "const container = buildContainer();   // registra as implementações reais",
                  "",
                  "// Em um teste: um repositório em memória no lugar do real",
                  "container.register(\"userRepository\", () => new InMemoryUserRepository());",
                  "",
                  "const service = container.resolve(\"userService\");   // usa o repositório falso",
                ].join("\n"),
              },
              explanation:
                "O `userService` continua sendo construído do mesmo jeito, mas agora recebe o repositório falso. Nenhuma " +
                "classe precisou mudar, e só o registro foi trocado.",
            },
            {
              title: "Dependência não registrada e ciclos",
              context: "Erros de montagem aparecem na resolução, e ciclos precisam ser detectados.",
              code: {
                language: "javascript",
                filename: "errors.js",
                code: [
                  "const container = new Container();",
                  "container.register(\"a\", (c) => ({ b: c.resolve(\"b\") }));",
                  "container.register(\"b\", (c) => ({ a: c.resolve(\"a\") }));",
                  "",
                  "container.resolve(\"c\");   // Error: não registrado: c",
                  "container.resolve(\"a\");   // RangeError: Maximum call stack size exceeded (a ↔ b)",
                ].join("\n"),
              },
              explanation:
                "Um container simples só descobre esses problemas ao resolver, e um ciclo causa estouro de pilha. " +
                "Bibliotecas maduras detectam e explicam o ciclo, mas a causa continua sendo o design: A e B se conhecem demais.",
            },
          ],
          exercise: {
            problem:
              "O container abaixo cria um objeto novo a cada `resolve`. Assim, `resolve(\"db\")` devolve conexões " +
              "diferentes, quando o banco deveria ser compartilhado.",
            problemCode: {
              language: "javascript",
              filename: "simple-container.js",
              code: [
                "class Container {",
                "  #factories = new Map();",
                "  register(name, factory) { this.#factories.set(name, factory); }",
                "  resolve(name) {",
                "    const factory = this.#factories.get(name);",
                "    if (!factory) throw new Error(`não registrado: ${name}`);",
                "    return factory(this);",
                "  }",
                "}",
                "",
                "const container = new Container();",
                "container.register(\"db\", () => ({ connection: Math.random() }));",
                "container.resolve(\"db\") === container.resolve(\"db\");   // false — devia ser true",
              ].join("\n"),
            },
            task:
              "Adicione o ciclo de vida de singleton: o container guarda a primeira instância e a devolve nas " +
              "próximas chamadas.",
            hint: "Guarde o resultado de cada fábrica em um `Map` e consulte-o antes de chamar a fábrica de novo.",
            solution: {
              code: {
                language: "javascript",
                filename: "simple-container.fixed.js",
                code: [
                  "class Container {",
                  "  #factories = new Map();",
                  "  #instances = new Map();",
                  "",
                  "  register(name, factory) { this.#factories.set(name, factory); }",
                  "",
                  "  resolve(name) {",
                  "    if (this.#instances.has(name)) return this.#instances.get(name);",
                  "    const factory = this.#factories.get(name);",
                  "    if (!factory) throw new Error(`não registrado: ${name}`);",
                  "    const instance = factory(this);",
                  "    this.#instances.set(name, instance);",
                  "    return instance;",
                  "  }",
                  "}",
                  "",
                  "const container = new Container();",
                  "container.register(\"db\", () => ({ connection: Math.random() }));",
                  "container.resolve(\"db\") === container.resolve(\"db\");   // true",
                ].join("\n"),
              },
              explanation:
                "A fábrica só roda na primeira resolução, e as demais devolvem a mesma instância. É o comportamento " +
                "de singleton que containers reais oferecem como opção de ciclo de vida.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Service Locator",
          requires: ["Dependency Injection"],
          note: "alternativa/anti-padrão comum a DI — ensinado em contraste",
          summary:
            "Um registro central de onde as classes buscam por conta própria o que precisam — o oposto de Dependency " +
            "Injection, em que as dependências são entregues de fora.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Service Locator é um registro global ao qual uma classe pede as dependências de que precisa: " +
                "`locator.get(\"mailer\")`. Ele também inverte a criação (a classe não usa `new`), mas de outra forma: " +
                "com Dependency Injection, as dependências são empurradas para dentro pelo construtor; com o Locator, " +
                "a classe vai buscá-las. É ensinado aqui em contraste, porque é a alternativa mais comum, e muitas vezes " +
                "considerada um anti-padrão.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "DI mostra do que a classe precisa; o Service Locator esconde: quem lê o construtor não vê as " +
                "dependências, e só descobre quando o código executa e falha.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O locator guarda instâncias ou fábricas por nome. Cada classe consulta o locator, geralmente global, " +
                "no momento em que precisa de uma dependência.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "service-locator.js",
              code: [
                "const Locator = {",
                "  services: new Map(),",
                "  register(name, service) { this.services.set(name, service); },",
                "  get(name) {",
                "    if (!this.services.has(name)) throw new Error(`não registrado: ${name}`);",
                "    return this.services.get(name);",
                "  },",
                "};",
                "",
                "// A classe busca o que precisa; o construtor não diz nada sobre dependências",
                "class InvoiceService {",
                "  send(invoice) {",
                "    Locator.get(\"mailer\").send(invoice.email, \"Sua fatura\");",
                "  }",
                "}",
                "",
                "Locator.register(\"mailer\", new SmtpMailer());",
                "new InvoiceService().send({ email: \"ana@x.com\" });",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`new InvoiceService()` parece não depender de nada, mas falha se o mailer não estiver registrado. A " +
                "dependência existe, só que está escondida dentro do método.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Como passo intermediário ao migrar código legado, em que passar dependências por todo o caminho ainda não é viável.",
                "Quando o serviço é escolhido dinamicamente, em tempo de execução, por nome, como em sistemas de plugins.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "As dependências ficam escondidas: a assinatura da classe não diz do que ela precisa, e a falta só aparece ao executar.",
                "O locator é um estado global: testes precisam registrar e limpar serviços, e um teste pode vazar configuração para o seguinte.",
                "Todas as classes passam a depender do locator, o que as acopla a ele e dificulta reutilizá-las fora do projeto.",
              ],
            },
          ],
          examples: [
            {
              title: "A dependência escondida",
              context: "Comparar as assinaturas mostra a diferença: uma conta o que precisa, a outra não.",
              code: {
                language: "javascript",
                filename: "hidden-dependency.js",
                code: [
                  "// Service Locator: o construtor não revela nada",
                  "class ReportService {",
                  "  generate() { return Locator.get(\"database\").query(\"SELECT ...\"); }",
                  "}",
                  "new ReportService().generate();   // Error: não registrado: database",
                  "",
                  "// Dependency Injection: a necessidade está na assinatura",
                  "class ReportServiceDI {",
                  "  constructor(database) { this.database = database; }",
                  "  generate() { return this.database.query(\"SELECT ...\"); }",
                  "}",
                  "// new ReportServiceDI() já deixa claro que falta o database",
                ].join("\n"),
              },
              explanation:
                "Com o Locator, é preciso ler o corpo dos métodos para descobrir as dependências. Com DI, a " +
                "assinatura já as informa, e a falta é notada ao criar o objeto.",
            },
            {
              title: "Estado global vazando entre testes",
              context: "O locator é compartilhado por todos os testes, e isso os acopla.",
              code: {
                language: "javascript",
                filename: "test-leak.js",
                code: [
                  "// Teste 1: registra um mailer falso e não limpa",
                  "Locator.register(\"mailer\", { send() { /* falso */ } });",
                  "new InvoiceService().send({ email: \"a@x.com\" });   // passa",
                  "",
                  "// Teste 2, em outro arquivo, esperava o erro de \"mailer não registrado\"",
                  "// mas o registro do teste 1 continua lá — o resultado depende da ordem dos testes",
                  "",
                  "// Com DI, cada teste monta o seu objeto e nada é compartilhado",
                  "new InvoiceServiceDI({ send() {} }).send({ email: \"a@x.com\" });",
                ].join("\n"),
              },
              explanation:
                "O estado do locator sobrevive entre testes e cria dependência de ordem (Test Isolation). Com " +
                "injeção, o objeto de cada teste é montado do zero.",
            },
            {
              title: "O container usado como Service Locator",
              context: "O mesmo container pode ser DI ou Locator, dependendo de quem o chama.",
              code: {
                language: "javascript",
                filename: "container-as-locator.js",
                code: [
                  "// Anti-padrão: a classe recebe o container e busca o que precisa",
                  "class CheckoutService {",
                  "  constructor(container) { this.container = container; }",
                  "  pay(order) { this.container.resolve(\"payment\").charge(order.total); }",
                  "}",
                  "",
                  "// Correto: só o ponto de composição usa o container; a classe recebe o que usa",
                  "class CheckoutServiceDI {",
                  "  constructor(payment) { this.payment = payment; }",
                  "  pay(order) { this.payment.charge(order.total); }",
                  "}",
                  "const checkout = new CheckoutServiceDI(container.resolve(\"payment\"));",
                ].join("\n"),
              },
              explanation:
                "Quando a classe recebe o container, ela pode pedir qualquer coisa e volta a esconder as dependências. " +
                "O container deve ficar na borda do programa, ligando as peças, e não dentro delas.",
            },
          ],
          exercise: {
            problem:
              "`InvoiceService` busca o mailer e o repositório em um Service Locator global. O construtor não mostra " +
              "as dependências, e o teste precisa mexer no estado global.",
            problemCode: {
              language: "javascript",
              filename: "invoice-service.js",
              code: [
                "class InvoiceService {",
                "  send(invoiceId) {",
                "    const invoice = Locator.get(\"invoiceRepository\").find(invoiceId);",
                "    Locator.get(\"mailer\").send(invoice.email, `Fatura ${invoice.id}`);",
                "  }",
                "}",
                "",
                "Locator.register(\"invoiceRepository\", new InvoiceRepository());",
                "Locator.register(\"mailer\", new SmtpMailer());",
                "new InvoiceService().send(7);",
              ].join("\n"),
            },
            task:
              "Converta para Dependency Injection (Constructor Injection): a classe recebe as duas dependências, e o " +
              "único ponto que usa o locator é a montagem.",
            hint: "Passe `invoiceRepository` e `mailer` ao construtor e troque as chamadas a `Locator.get` por essas referências.",
            solution: {
              code: {
                language: "javascript",
                filename: "invoice-service.fixed.js",
                code: [
                  "class InvoiceService {",
                  "  constructor(invoiceRepository, mailer) {",
                  "    this.invoiceRepository = invoiceRepository;",
                  "    this.mailer = mailer;",
                  "  }",
                  "  send(invoiceId) {",
                  "    const invoice = this.invoiceRepository.find(invoiceId);",
                  "    this.mailer.send(invoice.email, `Fatura ${invoice.id}`);",
                  "  }",
                  "}",
                  "",
                  "// Ponto de composição: o único lugar que sabe montar as peças",
                  "const service = new InvoiceService(new InvoiceRepository(), new SmtpMailer());",
                  "service.send(7);",
                  "",
                  "// Teste: nenhum estado global",
                  "const sent = [];",
                  "new InvoiceService(",
                  "  { find: () => ({ id: 7, email: \"a@x.com\" }) },",
                  "  { send: (to, text) => sent.push({ to, text }) },",
                  ").send(7);",
                ].join("\n"),
              },
              explanation:
                "A assinatura do construtor agora mostra as duas dependências, e o teste as entrega diretamente, " +
                "sem registrar nem limpar nada em um locator global.",
            },
          },
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
        concept({
          order: 10,
          title: "Factory Method",
          note: "delega a decisão de qual classe instanciar",
          summary:
            "Define um método responsável por criar um objeto e deixa que subclasses (ou a configuração) decidam qual " +
            "classe concreta instanciar, de modo que o código que o usa dependa só do contrato do produto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Factory Method é um padrão de criação em que uma classe declara um método para criar objetos, o " +
                "\"método fábrica\", mas deixa que as subclasses decidam qual classe concreta ele instancia. O código " +
                "que precisa do objeto chama o método e trabalha com o resultado através do contrato (Program to an " +
                "Interface), sem usar `new` com uma classe específica. É uma aplicação direta de Encapsulate What " +
                "Varies: o que varia, qual tipo criar, fica isolado em um único ponto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quem usa o objeto não decide qual classe criar: chama um método fábrica, e é ele que escolhe — e " +
                "pode ser trocado sem alterar quem usa.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A classe base tem uma operação que precisa de um produto e chama o método fábrica para obtê-lo. Cada " +
                "subclasse sobrescreve esse método e devolve o produto adequado; a operação, que é a parte estável, " +
                "não muda.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "factory-method.js",
              code: [
                "// Produtos: todos cumprem o contrato send(message)",
                "class EmailNotification { send(message) { return `email: ${message}`; } }",
                "class SmsNotification { send(message) { return `sms: ${message}`; } }",
                "",
                "// Criador: a operação é estável; o método fábrica é o ponto de variação",
                "class NotificationService {",
                "  createNotification() { throw new Error(\"a subclasse define o produto\"); }   // factory method",
                "  notify(message) {",
                "    const notification = this.createNotification();",
                "    return notification.send(message);",
                "  }",
                "}",
                "",
                "class EmailService extends NotificationService {",
                "  createNotification() { return new EmailNotification(); }",
                "}",
                "class SmsService extends NotificationService {",
                "  createNotification() { return new SmsNotification(); }",
                "}",
                "",
                "new EmailService().notify(\"pedido enviado\");   // \"email: pedido enviado\"",
                "new SmsService().notify(\"pedido enviado\");     // \"sms: pedido enviado\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`notify` não sabe qual notificação está usando. Adicionar um canal novo é criar uma subclasse e um " +
                "produto, sem editar `NotificationService`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando uma classe não pode saber de antemão qual objeto vai criar, e essa escolha pertence a uma subclasse ou à configuração.",
                "Quando o código que usa o produto deve depender só do contrato, para que novos tipos entrem sem alterá-lo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com um único tipo de produto e sem previsão de outro, o método fábrica é indireção sem benefício.",
                "Uma hierarquia de criadores só para variar o produto é um acoplamento forte; em JavaScript, uma função fábrica simples costuma bastar (Composition over Inheritance).",
                "Cada produto novo pede uma subclasse nova do criador, e o número de classes cresce.",
              ],
            },
          ],
          examples: [
            {
              title: "A versão idiomática: uma função fábrica",
              context: "Em JavaScript, muitas vezes não é preciso uma hierarquia de criadores: uma função que escolhe o tipo já cumpre o papel.",
              code: {
                language: "javascript",
                filename: "simple-factory.js",
                code: [
                  "const parsers = {",
                  "  json: (text) => JSON.parse(text),",
                  "  csv: (text) => text.split(\"\\n\").map((line) => line.split(\",\")),",
                  "};",
                  "",
                  "function createParser(format) {",
                  "  const parser = parsers[format];",
                  "  if (!parser) throw new Error(`formato desconhecido: ${format}`);",
                  "  return parser;",
                  "}",
                  "",
                  "createParser(\"csv\")(\"a,b\\nc,d\");   // [[\"a\", \"b\"], [\"c\", \"d\"]]",
                ].join("\n"),
              },
              explanation:
                "Quem chama `createParser` recebe algo que sabe processar um texto, sem saber qual. É a mesma ideia " +
                "do Factory Method com menos cerimônia: o ponto de variação está isolado em uma função.",
            },
            {
              title: "Trocar o produto em um teste",
              context: "Como a criação está em um método, uma subclasse de teste devolve um produto falso sem alterar a lógica.",
              code: {
                language: "javascript",
                filename: "test-subclass.js",
                code: [
                  "class FakeNotification {",
                  "  constructor() { this.sent = []; }",
                  "  send(message) { this.sent.push(message); return \"ok\"; }",
                  "}",
                  "",
                  "class TestService extends NotificationService {",
                  "  fake = new FakeNotification();",
                  "  createNotification() { return this.fake; }",
                  "}",
                  "",
                  "const service = new TestService();",
                  "service.notify(\"olá\");",
                  "service.fake.sent;   // [\"olá\"]",
                ].join("\n"),
              },
              explanation:
                "O teste executa `notify` de verdade, e só o produto foi substituído. Sem o método fábrica, seria " +
                "preciso um `new` dentro de `notify`, sem ponto de troca.",
            },
            {
              title: "O método fábrica pode ter parâmetros",
              context: "Quando a escolha depende de dados, o método recebe o que precisa e devolve o produto certo.",
              code: {
                language: "javascript",
                filename: "parametrized.js",
                code: [
                  "class ShapeFactory {",
                  "  create(spec) {",
                  "    switch (spec.type) {",
                  "      case \"circle\": return new Circle(spec.radius);",
                  "      case \"square\": return new Square(spec.side);",
                  "      default: throw new Error(`forma desconhecida: ${spec.type}`);",
                  "    }",
                  "  }",
                  "}",
                  "",
                  "const shapes = specs.map((spec) => new ShapeFactory().create(spec));",
                  "shapes.map((shape) => shape.area());   // quem usa só conhece area()",
                ].join("\n"),
              },
              explanation:
                "O `switch` fica dentro da fábrica, em um só lugar. Quem consome as formas conhece só o contrato " +
                "(`area`), e uma forma nova altera apenas a fábrica.",
            },
          ],
          exercise: {
            problem:
              "`Checkout` escolhe e cria o gateway de pagamento dentro de `pay`, com um `if` por método de pagamento. " +
              "Não há como testar `pay` sem o gateway real, e cada novo método exige editar a operação.",
            problemCode: {
              language: "javascript",
              filename: "checkout.js",
              code: [
                "class Checkout {",
                "  pay(order) {",
                "    let gateway;",
                "    if (order.method === \"card\") gateway = new CardGateway();",
                "    else if (order.method === \"pix\") gateway = new PixGateway();",
                "    else throw new Error(`método desconhecido: ${order.method}`);",
                "    return gateway.charge(order.total);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Extraia um método fábrica `createGateway(order)` para a escolha do gateway, e mostre uma subclasse de " +
              "teste que devolve um gateway falso.",
            hint: "A operação `pay` deve só chamar o método fábrica e usar o resultado por meio de `charge`.",
            solution: {
              code: {
                language: "javascript",
                filename: "checkout.fixed.js",
                code: [
                  "class Checkout {",
                  "  createGateway(order) {                                  // factory method",
                  "    if (order.method === \"card\") return new CardGateway();",
                  "    if (order.method === \"pix\") return new PixGateway();",
                  "    throw new Error(`método desconhecido: ${order.method}`);",
                  "  }",
                  "",
                  "  pay(order) {                                            // operação estável",
                  "    return this.createGateway(order).charge(order.total);",
                  "  }",
                  "}",
                  "",
                  "// Teste: só a criação é substituída",
                  "class TestCheckout extends Checkout {",
                  "  createGateway() { return { charge: (total) => `cobrado ${total}` }; }",
                  "}",
                  "new TestCheckout().pay({ method: \"card\", total: 50 });   // \"cobrado 50\"",
                ].join("\n"),
              },
              explanation:
                "A escolha do gateway ficou em `createGateway`, e `pay` deixou de conhecer as classes concretas. A " +
                "subclasse de teste troca só a criação e executa a operação real.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Abstract Factory",
          requires: ["Factory Method"],
          note: "uma fábrica de factory methods relacionados — não dá para entender sem o anterior",
          summary:
            "Uma interface para criar famílias inteiras de objetos relacionados, sem especificar as classes " +
            "concretas — e que garante que os produtos de uma mesma família sejam usados juntos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Abstract Factory estende o Factory Method: em vez de um método que cria um produto, é uma fábrica com " +
                "vários métodos que criam produtos de uma mesma família (o botão e o campo de texto de um tema, o " +
                "banco e a fila de um mesmo provedor). Cada família tem a sua fábrica concreta, e o código cliente " +
                "recebe uma fábrica qualquer e usa só os contratos. Assim os produtos combinam entre si: não há como " +
                "misturar um botão de um tema com um campo de outro.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma fábrica por família: quem usa recebe uma fábrica e obtém produtos que foram feitos para " +
                "funcionar juntos, sem saber a qual família pertencem.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A fábrica abstrata define um método de criação por tipo de produto. Cada fábrica concreta implementa " +
                "todos eles para a sua família. O cliente escolhe a fábrica uma única vez, no ponto de composição, e " +
                "a passa adiante.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "abstract-factory.js",
              code: [
                "// Família clara",
                "class LightButton { render() { return \"[ botão claro ]\"; } }",
                "class LightInput { render() { return \"( campo claro )\"; } }",
                "class LightFactory {",
                "  createButton() { return new LightButton(); }",
                "  createInput() { return new LightInput(); }",
                "}",
                "",
                "// Família escura",
                "class DarkButton { render() { return \"[ botão escuro ]\"; } }",
                "class DarkInput { render() { return \"( campo escuro )\"; } }",
                "class DarkFactory {",
                "  createButton() { return new DarkButton(); }",
                "  createInput() { return new DarkInput(); }",
                "}",
                "",
                "// O cliente só conhece os contratos, e nunca as classes concretas",
                "function renderForm(factory) {",
                "  return `${factory.createInput().render()} ${factory.createButton().render()}`;",
                "}",
                "",
                "renderForm(new LightFactory());   // \"( campo claro ) [ botão claro ]\"",
                "renderForm(new DarkFactory());    // \"( campo escuro ) [ botão escuro ]\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Trocar de tema é passar outra fábrica. `renderForm` não muda, e os dois produtos sempre pertencem " +
                "à mesma família.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o sistema precisa funcionar com várias famílias de produtos, como temas, plataformas ou provedores, e os produtos de uma família devem ser usados juntos.",
                "Quando você quer garantir essa consistência e trocar a família inteira em um único ponto.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com uma só família, ou com produtos sem relação entre si, um Factory Method ou uma função fábrica basta.",
                "Acrescentar um novo tipo de produto exige alterar a fábrica abstrata e todas as concretas.",
                "O número de classes cresce rápido (produtos × famílias), o que só compensa quando a consistência da família é um requisito real.",
              ],
            },
          ],
          examples: [
            {
              title: "Famílias por ambiente: produção e memória",
              context: "Um mesmo conjunto de peças, banco e fila, tem uma versão real e uma versão local que precisam combinar.",
              code: {
                language: "javascript",
                filename: "environments.js",
                code: [
                  "const cloudFactory = {",
                  "  createStorage: () => new S3Storage(),",
                  "  createQueue: () => new SqsQueue(),",
                  "};",
                  "",
                  "const localFactory = {",
                  "  createStorage: () => new MemoryStorage(),",
                  "  createQueue: () => new InMemoryQueue(),",
                  "};",
                  "",
                  "function createApp(factory) {",
                  "  return new App(factory.createStorage(), factory.createQueue());",
                  "}",
                  "",
                  "const app = createApp(process.env.CI ? localFactory : cloudFactory);",
                ].join("\n"),
              },
              explanation:
                "A aplicação nunca recebe o S3 com uma fila em memória, por exemplo. A escolha da família acontece " +
                "uma vez, e o resto do código a recebe pronta.",
            },
            {
              title: "A inconsistência que a fábrica evita",
              context: "Sem uma fábrica por família, é fácil misturar produtos que não foram feitos para o mesmo conjunto.",
              code: {
                language: "javascript",
                filename: "mixing.js",
                code: [
                  "// Sem fábrica: cada ponto escolhe o seu produto",
                  "const button = new LightButton();",
                  "const input = new DarkInput();   // um botão claro com um campo escuro",
                  "",
                  "// Com fábrica: os dois vêm do mesmo lugar",
                  "const factory = new DarkFactory();",
                  "const button2 = factory.createButton();",
                  "const input2 = factory.createInput();   // sempre da mesma família",
                ].join("\n"),
              },
              explanation:
                "A garantia não vem de uma regra que alguém precisa lembrar, e sim da estrutura: os dois produtos " +
                "saem da mesma fábrica.",
            },
            {
              title: "Quando o Abstract Factory é exagero",
              context: "Uma única família não justifica uma fábrica por família.",
              code: {
                language: "javascript",
                filename: "overkill.js",
                code: [
                  "// Exagero: só existe um tema, e ninguém pediu outro",
                  "class OnlyThemeFactory {",
                  "  createButton() { return new Button(); }",
                  "  createInput() { return new Input(); }",
                  "}",
                  "",
                  "// Suficiente: criar direto até que uma segunda família apareça",
                  "const button = new Button();",
                  "const input = new Input();",
                ].join("\n"),
              },
              explanation:
                "Se não há segunda família, a fábrica só acrescenta classes. Quando ela surgir, extrair a fábrica é " +
                "uma refatoração pequena.",
            },
          ],
          exercise: {
            problem:
              "O formulário escolhe o tema widget por widget, com um `if` para cada um. Nada impede que um botão " +
              "claro apareça ao lado de um campo escuro.",
            problemCode: {
              language: "javascript",
              filename: "form.js",
              code: [
                "function buildForm(theme) {",
                "  const button = theme === \"dark\" ? new DarkButton() : new LightButton();",
                "  const input = theme === \"dark\" ? new DarkInput() : new LightInput();",
                "  return `${input.render()} ${button.render()}`;",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Abstract Factory: crie uma fábrica por tema e faça `buildForm` receber a fábrica, sem conhecer " +
              "nenhuma classe concreta.",
            hint: "Cada fábrica tem `createButton()` e `createInput()`. A decisão de tema passa a ser a escolha da fábrica.",
            solution: {
              code: {
                language: "javascript",
                filename: "form.fixed.js",
                code: [
                  "const lightFactory = {",
                  "  createButton: () => new LightButton(),",
                  "  createInput: () => new LightInput(),",
                  "};",
                  "const darkFactory = {",
                  "  createButton: () => new DarkButton(),",
                  "  createInput: () => new DarkInput(),",
                  "};",
                  "",
                  "function buildForm(factory) {",
                  "  return `${factory.createInput().render()} ${factory.createButton().render()}`;",
                  "}",
                  "",
                  "buildForm(darkFactory);",
                ].join("\n"),
              },
              explanation:
                "`buildForm` não tem mais nenhum `if` de tema, e os dois widgets vêm sempre da mesma fábrica. Um novo " +
                "tema é uma nova fábrica, sem editar o formulário.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Builder",
          note: "construção passo a passo de objetos com muitas opções",
          summary:
            "Separa a construção de um objeto complexo da sua representação final, montando-o passo a passo e " +
            "validando o resultado antes de entregá-lo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Builder é um padrão de criação para objetos com muitas partes ou opções. Em vez de um construtor " +
                "com uma lista longa de parâmetros (a maioria opcionais), um objeto auxiliar, o builder, recebe as " +
                "escolhas em passos com nomes claros e, ao final, produz o objeto pronto com `build()`. O código de " +
                "quem constrói fica legível, e o objeto final pode ser imutável e validado uma única vez.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Monte o objeto complexo em passos com nomes claros e só entregue o resultado no fim, já validado, " +
                "em vez de um construtor com uma lista longa de parâmetros.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada método do builder registra uma escolha e devolve o próprio builder (interface fluente). O " +
                "método `build()` confere as regras e cria o objeto final, sem que o builder precise expor o estado " +
                "parcial.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "builder.js",
              code: [
                "class RequestBuilder {",
                "  #url;",
                "  #method = \"GET\";",
                "  #headers = {};",
                "  #body = null;",
                "",
                "  constructor(url) { this.#url = url; }",
                "  method(value) { this.#method = value; return this; }",
                "  header(name, value) { this.#headers[name] = value; return this; }",
                "  body(value) { this.#body = value; return this; }",
                "",
                "  build() {",
                "    if (this.#method === \"GET\" && this.#body) throw new Error(\"GET não tem corpo\");",
                "    return Object.freeze({",
                "      url: this.#url,",
                "      method: this.#method,",
                "      headers: { ...this.#headers },",
                "      body: this.#body,",
                "    });",
                "  }",
                "}",
                "",
                "const request = new RequestBuilder(\"/orders\")",
                "  .method(\"POST\")",
                "  .header(\"content-type\", \"application/json\")",
                "  .body(JSON.stringify({ item: 1 }))",
                "  .build();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A chamada se lê como uma frase e só informa o que difere do padrão. A regra \"GET não tem corpo\" é " +
                "verificada em um só lugar, no `build()`, e o objeto entregue é imutável.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o objeto tem muitos parâmetros, sobretudo opcionais, e um construtor comprido ficaria ilegível (\"construtor telescópico\").",
                "Quando o objeto final deve ser imutável e ter as regras validadas antes de existir.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para objetos simples, com poucos campos, um construtor comum já é suficiente.",
                "Em JavaScript, um objeto de opções com valores padrão, `create({ method: \"POST\" })`, costuma dar o mesmo resultado com menos código.",
                "É uma classe a mais para manter; e se o builder for reutilizado depois do `build()`, o estado anterior pode vazar para o próximo objeto.",
              ],
            },
          ],
          examples: [
            {
              title: "O construtor telescópico",
              context: "Parâmetros posicionais demais deixam a chamada ilegível e propensa a erros de ordem.",
              code: {
                language: "javascript",
                filename: "telescoping.js",
                code: [
                  "// Antes: o que significam esses valores?",
                  "const user = new User(\"Ana\", \"ana@x.com\", null, null, true, false, \"pt-BR\");",
                  "",
                  "// Depois: cada escolha tem nome",
                  "const user2 = new UserBuilder(\"Ana\", \"ana@x.com\")",
                  "  .newsletter(true)",
                  "  .locale(\"pt-BR\")",
                  "  .build();",
                ].join("\n"),
              },
              explanation:
                "Na primeira chamada, é preciso abrir a classe para saber o que cada `null` e `true` quer dizer. Na " +
                "segunda, a chamada é autoexplicativa, e o que não foi informado assume o padrão.",
            },
            {
              title: "A alternativa idiomática: objeto de opções",
              context: "Em JavaScript, muitas vezes o padrão se resolve sem uma classe builder.",
              code: {
                language: "javascript",
                filename: "options-object.js",
                code: [
                  "function createRequest(url, { method = \"GET\", headers = {}, body = null } = {}) {",
                  "  if (method === \"GET\" && body) throw new Error(\"GET não tem corpo\");",
                  "  return Object.freeze({ url, method, headers: { ...headers }, body });",
                  "}",
                  "",
                  "createRequest(\"/orders\");",
                  "createRequest(\"/orders\", { method: \"POST\", body: \"{}\" });",
                ].join("\n"),
              },
              explanation:
                "Com parâmetros nomeados por desestruturação e valores padrão, o problema do construtor telescópico " +
                "some. O builder passa a valer quando a construção tem passos condicionais ou dependentes.",
            },
            {
              title: "Construir em passos condicionais",
              context: "Quando as partes dependem de decisões ao longo do caminho, o builder acompanha o fluxo.",
              code: {
                language: "javascript",
                filename: "conditional.js",
                code: [
                  "function buildQuery(filters) {",
                  "  const query = new QueryBuilder(\"users\");",
                  "  if (filters.name) query.where(\"name\", filters.name);",
                  "  if (filters.active !== undefined) query.where(\"active\", filters.active);",
                  "  if (filters.sortBy) query.orderBy(filters.sortBy);",
                  "  return query.build();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada filtro só é aplicado se existir. Montar o objeto em passos é mais natural aqui do que compor um " +
                "único construtor com todas as combinações possíveis.",
            },
          ],
          exercise: {
            problem:
              "Criar uma pizza exige um construtor com sete parâmetros, quase todos opcionais. A chamada é ilegível, e " +
              "uma pizza com borda recheada e sem molho passa despercebida.",
            problemCode: {
              language: "javascript",
              filename: "pizza.js",
              code: [
                "class Pizza {",
                "  constructor(size, cheese, pepperoni, mushrooms, onions, stuffedCrust, sauce) {",
                "    Object.assign(this, { size, cheese, pepperoni, mushrooms, onions, stuffedCrust, sauce });",
                "  }",
                "}",
                "",
                "new Pizza(\"grande\", true, false, true, false, true, null);   // que pizza é essa?",
              ].join("\n"),
            },
            task:
              "Crie um `PizzaBuilder` com métodos fluentes e um `build()` que recuse pizza sem molho e devolva um " +
              "objeto imutável.",
            hint: "O tamanho é obrigatório (construtor do builder); os demais são métodos que devolvem `this`. A regra do molho vai no `build()`.",
            solution: {
              code: {
                language: "javascript",
                filename: "pizza.fixed.js",
                code: [
                  "class PizzaBuilder {",
                  "  #pizza = { toppings: [], stuffedCrust: false, sauce: null };",
                  "",
                  "  constructor(size) { this.#pizza.size = size; }",
                  "  sauce(value) { this.#pizza.sauce = value; return this; }",
                  "  topping(name) { this.#pizza.toppings.push(name); return this; }",
                  "  stuffedCrust() { this.#pizza.stuffedCrust = true; return this; }",
                  "",
                  "  build() {",
                  "    if (!this.#pizza.sauce) throw new Error(\"toda pizza precisa de molho\");",
                  "    return Object.freeze({ ...this.#pizza, toppings: [...this.#pizza.toppings] });",
                  "  }",
                  "}",
                  "",
                  "const pizza = new PizzaBuilder(\"grande\")",
                  "  .sauce(\"tomate\")",
                  "  .topping(\"queijo\")",
                  "  .topping(\"cogumelos\")",
                  "  .stuffedCrust()",
                  "  .build();",
                ].join("\n"),
              },
              explanation:
                "Cada escolha tem nome, e o que não foi pedido assume o padrão. A regra do molho vive em `build()`, e " +
                "não há como obter uma pizza inválida.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Prototype",
          note: "criar novos objetos copiando um objeto existente",
          summary:
            "Cria novos objetos copiando um objeto existente (o protótipo), em vez de instanciá-los do zero — útil " +
            "quando a criação é cara ou o objeto já vem configurado.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Prototype é um padrão de criação em que um novo objeto nasce da cópia de outro, o protótipo, que já " +
                "está configurado. Quem precisa de um objeto novo pede uma cópia ao modelo e ajusta o que for " +
                "diferente, sem repetir a configuração e sem conhecer a classe concreta. Não é o mesmo que a cadeia de " +
                "protótipos do JavaScript, embora a linguagem tenha esse nome por um motivo parecido: objetos criados a " +
                "partir de outros objetos.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Para criar um objeto parecido com outro, copie-o e ajuste o que muda — desde que a cópia não " +
                "compartilhe, por engano, o estado interno do original.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O objeto expõe uma operação `clone()`. Ela devolve uma cópia independente: os valores simples são " +
                "copiados, e as referências (arrays, objetos) precisam ser copiadas também, ou original e cópia " +
                "passam a compartilhar o mesmo dado (Value vs Reference).",
            },
            {
              type: "code",
              language: "javascript",
              filename: "prototype.js",
              code: [
                "class Enemy {",
                "  constructor(type, hp, loot) {",
                "    this.type = type;",
                "    this.hp = hp;",
                "    this.loot = loot;",
                "  }",
                "  clone() { return new Enemy(this.type, this.hp, [...this.loot]); }   // copia o array também",
                "}",
                "",
                "// Modelo já configurado",
                "const orcTemplate = new Enemy(\"orc\", 100, [\"espada\"]);",
                "",
                "// Cópias independentes, ajustadas onde diferem",
                "const orc1 = orcTemplate.clone();",
                "const orc2 = orcTemplate.clone();",
                "orc2.loot.push(\"escudo\");",
                "",
                "orcTemplate.loot;   // [\"espada\"] — o modelo não foi afetado",
                "orc2.loot;          // [\"espada\", \"escudo\"]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O `loot` foi copiado com o spread. Se `clone()` reutilizasse o mesmo array, `orc2.loot.push` " +
                "alteraria também o modelo e todos os outros orcs.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando criar um objeto do zero é caro ou trabalhoso, e já existe um parecido, um modelo pré-configurado.",
                "Quando o código precisa duplicar um objeto sem conhecer a sua classe concreta, apenas chamando `clone()`.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Cópia rasa compartilha o estado aninhado com o original; copiar em profundidade é mais trabalhoso e, em estruturas grandes, custa caro.",
                "Objetos com recursos externos, como conexões e arquivos abertos, ou com referências circulares, são difíceis de clonar de forma correta.",
                "`structuredClone` não copia funções nem métodos e devolve objetos simples, sem a classe original.",
                "Para objetos simples, o spread `{ ...original }` já resolve.",
              ],
            },
          ],
          examples: [
            {
              title: "Cópia rasa e cópia profunda",
              context: "A diferença entre as duas é a causa mais comum de bugs ao clonar.",
              code: {
                language: "javascript",
                filename: "shallow-deep.js",
                code: [
                  "const base = { retries: 3, headers: { accept: \"json\" } };",
                  "",
                  "// Rasa: o objeto interno continua compartilhado",
                  "const shallow = { ...base };",
                  "shallow.headers.accept = \"xml\";",
                  "base.headers.accept;   // \"xml\" — o original mudou também",
                  "",
                  "// Profunda: nada é compartilhado",
                  "const deep = structuredClone({ retries: 3, headers: { accept: \"json\" } });",
                  "deep.headers.accept = \"xml\";",
                ].join("\n"),
              },
              explanation:
                "O spread copia só o primeiro nível, e `headers` continua sendo o mesmo objeto nas duas variáveis. " +
                "`structuredClone` copia toda a estrutura aninhada.",
            },
            {
              title: "O que o structuredClone não copia",
              context: "Ele serve para dados, e não para objetos com comportamento.",
              code: {
                language: "javascript",
                filename: "clone-limits.js",
                code: [
                  "class Counter {",
                  "  constructor() { this.count = 0; }",
                  "  increment() { this.count += 1; }",
                  "}",
                  "",
                  "const copy = structuredClone(new Counter());",
                  "copy.count;        // 0",
                  "copy.increment;    // undefined — virou um objeto simples, sem os métodos",
                  "",
                  "try { structuredClone({ handler() {} }); }",
                  "catch (error) { error.name; }   // \"DataCloneError\" — funções não são clonáveis",
                ].join("\n"),
              },
              explanation:
                "Para objetos com métodos, escreva um `clone()` próprio (como em `Enemy`). `structuredClone` é a " +
                "ferramenta certa para copiar dados puros, como configurações.",
            },
            {
              title: "Um catálogo de modelos",
              context: "Manter alguns protótipos prontos e copiar o que se precisa evita repetir a configuração.",
              code: {
                language: "javascript",
                filename: "catalog.js",
                code: [
                  "const templates = {",
                  "  orc: new Enemy(\"orc\", 100, [\"espada\"]),",
                  "  goblin: new Enemy(\"goblin\", 40, [\"adaga\"]),",
                  "};",
                  "",
                  "function spawn(type) {",
                  "  const template = templates[type];",
                  "  if (!template) throw new Error(`tipo desconhecido: ${type}`);",
                  "  return template.clone();",
                  "}",
                  "",
                  "const wave = [\"orc\", \"goblin\", \"orc\"].map(spawn);",
                ].join("\n"),
              },
              explanation:
                "`spawn` não conhece a construção de cada tipo, apenas chama `clone()` no modelo certo. Um novo tipo é " +
                "um novo modelo no catálogo.",
            },
          ],
          exercise: {
            problem:
              "O `clone()` do documento abaixo faz uma cópia rasa: clonar e depois marcar uma tag no clone altera " +
              "também o documento original.",
            problemCode: {
              language: "javascript",
              filename: "document.js",
              code: [
                "class Document {",
                "  constructor(title, tags, meta) {",
                "    this.title = title;",
                "    this.tags = tags;",
                "    this.meta = meta;",
                "  }",
                "  clone() { return Object.assign(new Document(), this); }   // cópia rasa",
                "}",
                "",
                "const original = new Document(\"Contrato\", [\"jurídico\"], { author: \"Ana\" });",
                "const copy = original.clone();",
                "copy.tags.push(\"rascunho\");",
                "original.tags;   // [\"jurídico\", \"rascunho\"] — o original foi alterado",
              ].join("\n"),
            },
            task: "Corrija `clone()` para que a cópia seja independente do original, sem compartilhar `tags` nem `meta`.",
            hint: "Crie o novo `Document` passando cópias do array e do objeto, e não as mesmas referências.",
            solution: {
              code: {
                language: "javascript",
                filename: "document.fixed.js",
                code: [
                  "class Document {",
                  "  constructor(title, tags, meta) {",
                  "    this.title = title;",
                  "    this.tags = tags;",
                  "    this.meta = meta;",
                  "  }",
                  "  clone() { return new Document(this.title, [...this.tags], { ...this.meta }); }",
                  "}",
                  "",
                  "const original = new Document(\"Contrato\", [\"jurídico\"], { author: \"Ana\" });",
                  "const copy = original.clone();",
                  "copy.tags.push(\"rascunho\");",
                  "original.tags;   // [\"jurídico\"] — intacto",
                ].join("\n"),
              },
              explanation:
                "A cópia agora tem o seu próprio array e o seu próprio objeto. Como `meta` só tem valores simples, a " +
                "cópia em um nível basta; se ele tivesse objetos aninhados, seria preciso copiar mais fundo.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Singleton",
          note: "uma única instância — e por que ele costuma ser evitado",
          summary:
            "Garante que uma classe tenha uma única instância e oferece um ponto de acesso global a ela — um padrão " +
            "simples, mas que costuma esconder dependências e dificultar testes.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Singleton restringe a criação de uma classe a uma única instância e fornece um acesso global a ela. " +
                "Serve para recursos que fazem sentido uma vez só por programa, como a configuração carregada, um " +
                "logger ou um pool de conexões. É o mais conhecido dos padrões de criação e também o mais criticado, " +
                "porque o acesso global é, na prática, estado global compartilhado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Precisar de uma só instância é uma coisa; forçar um acesso global a ela é outra. Muitas vezes o " +
                "que se quer é uma instância única, criada no ponto de composição e injetada, e não um Singleton.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A classe guarda a sua única instância e a cria só no primeiro acesso. Em JavaScript, um módulo já " +
                "se comporta como um singleton, porque é executado uma única vez e o seu resultado é compartilhado, o " +
                "que costuma dispensar a classe especial.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "singleton.js",
              code: [
                "// Forma clássica: a classe controla a única instância",
                "class Config {",
                "  static #instance;",
                "  #values = new Map();",
                "",
                "  static get instance() {",
                "    Config.#instance ??= new Config();",
                "    return Config.#instance;",
                "  }",
                "",
                "  set(key, value) { this.#values.set(key, value); }",
                "  get(key) { return this.#values.get(key); }",
                "}",
                "",
                "Config.instance.set(\"env\", \"production\");",
                "Config.instance.get(\"env\");                    // \"production\"",
                "Config.instance === Config.instance;            // true",
                "",
                "// Forma idiomática: o módulo é o singleton",
                "// config.js",
                "// export const config = new Map();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Qualquer parte do programa alcança a mesma instância, sem que ela seja passada por parâmetro. É " +
                "exatamente essa comodidade que esconde as dependências.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para um recurso que realmente só pode existir uma vez por processo e que é acessado de muitos lugares, como um pool de conexões.",
                "Quando o acesso global é aceitável e o estado guardado é somente leitura ou muito estável, como uma configuração carregada na inicialização.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "É estado global: quem o usa fica acoplado a ele e as dependências ficam escondidas, como em um Service Locator.",
                "Dificulta os testes: o estado vaza de um teste para o outro (Test Isolation) e é difícil substituí-lo por um dublê.",
                "\"Uma instância por programa\" nem sempre vale: com vários processos, workers ou testes em paralelo, cada um tem a sua.",
                "Quase sempre é melhor criar uma única instância no ponto de composição e injetá-la (Dependency Injection), com o mesmo efeito e sem o acesso global.",
              ],
            },
          ],
          examples: [
            {
              title: "O módulo como singleton",
              context: "Em JavaScript, o próprio sistema de módulos entrega a instância única, sem código especial.",
              code: {
                language: "javascript",
                filename: "module-singleton.js",
                code: [
                  "// logger.js",
                  "const entries = [];",
                  "export const logger = {",
                  "  log(message) { entries.push({ message, at: Date.now() }); },",
                  "  all() { return [...entries]; },",
                  "};",
                  "",
                  "// a.js e b.js: importam o mesmo objeto, porque o módulo executa uma vez",
                  "// import { logger } from \"./logger.js\";",
                  "// logger.log(\"olá\");",
                ].join("\n"),
              },
              explanation:
                "Todos os que importam `logger.js` recebem o mesmo objeto. Não é preciso `static`, `getInstance` nem " +
                "construtor privado, e é a forma mais simples de ter uma instância única.",
            },
            {
              title: "O estado que vaza entre os testes",
              context: "Uma instância global sobrevive de um teste para o seguinte.",
              code: {
                language: "javascript",
                filename: "test-leak.js",
                code: [
                  "// Teste 1",
                  "Config.instance.set(\"env\", \"test\");",
                  "",
                  "// Teste 2, em outro arquivo, presume a configuração inicial",
                  "Config.instance.get(\"env\");   // \"test\" — herdou o valor do teste 1",
                  "",
                  "// Com injeção, cada teste cria a sua própria instância",
                  "const config = new Config();",
                  "config.get(\"env\");            // undefined — começa limpo",
                ].join("\n"),
              },
              explanation:
                "O resultado do segundo teste depende da ordem em que os testes rodam. Com a instância injetada, " +
                "cada teste começa do zero.",
            },
            {
              title: "Uma instância só, sem acesso global",
              context: "Quando basta ter uma instância, ela pode ser criada na montagem e passada para quem precisa.",
              code: {
                language: "javascript",
                filename: "single-instance.js",
                code: [
                  "class Logger {",
                  "  log(message) { console.log(message); }",
                  "}",
                  "",
                  "class OrderService {",
                  "  constructor(logger) { this.logger = logger; }",
                  "  place(order) { this.logger.log(`pedido ${order.id}`); }",
                  "}",
                  "",
                  "// Ponto de composição: uma única instância, entregue a todos que a usam",
                  "const logger = new Logger();",
                  "const orders = new OrderService(logger);",
                  "const invoices = new InvoiceService(logger);   // a mesma instância",
                ].join("\n"),
              },
              explanation:
                "Existe uma só instância de `Logger`, mas nada é global: `OrderService` mostra, no construtor, que " +
                "depende de um logger, e nos testes basta passar outro.",
            },
          ],
          exercise: {
            problem:
              "`OrderService` chama `Logger.getInstance()` por dentro. Não dá para saber, pela assinatura, que ele " +
              "depende de um logger, e os testes não conseguem trocá-lo por um falso.",
            problemCode: {
              language: "javascript",
              filename: "order-service.js",
              code: [
                "class Logger {",
                "  static #instance;",
                "  static getInstance() { return (Logger.#instance ??= new Logger()); }",
                "  log(message) { console.log(message); }",
                "}",
                "",
                "class OrderService {",
                "  place(order) {",
                "    Logger.getInstance().log(`pedido ${order.id}`);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Mantenha uma única instância de `Logger` no programa, mas sem acesso global: `OrderService` deve " +
              "receber o logger, e o teste deve usar um logger falso.",
            hint: "Remova o `getInstance`, crie o logger uma vez no ponto de composição e passe-o para o construtor.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-service.fixed.js",
                code: [
                  "class Logger {",
                  "  log(message) { console.log(message); }",
                  "}",
                  "",
                  "class OrderService {",
                  "  constructor(logger) { this.logger = logger; }",
                  "  place(order) { this.logger.log(`pedido ${order.id}`); }",
                  "}",
                  "",
                  "// Ponto de composição: uma única instância, criada aqui",
                  "const logger = new Logger();",
                  "const orders = new OrderService(logger);",
                  "",
                  "// Teste: um logger falso, sem estado global",
                  "const lines = [];",
                  "new OrderService({ log: (message) => lines.push(message) }).place({ id: 1 });",
                  "lines;   // [\"pedido 1\"]",
                ].join("\n"),
              },
              explanation:
                "Continua existindo um único logger em produção, mas ele deixou de ser global. O construtor revela a " +
                "dependência e o teste entrega um logger de uma linha.",
            },
          },
        }),
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
        concept({
          order: 10,
          title: "Adapter",
          note: "traduz uma interface para a que o cliente espera",
          summary:
            "Converte a interface de uma classe ou serviço na interface que o código cliente espera, para que peças " +
            "com contratos diferentes possam trabalhar juntas sem serem alteradas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Adapter é um padrão estrutural que faz a ponte entre duas interfaces incompatíveis. Seu código espera " +
                "um contrato (`charge(amount)`), mas a biblioteca de terceiros, ou o código legado, oferece outro " +
                "(`sendPayment(cents, currency)`). Em vez de alterar um dos lados, ou espalhar a conversão pelo " +
                "sistema, um objeto intermediário, o adapter, traduz as chamadas de um contrato para o outro. É a " +
                "ferramenta natural para Program to an Interface quando a implementação não é sua.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Não mude o que já existe nem deixe a diferença de contratos vazar: um adapter em volta traduz o " +
                "que o cliente pede para o que o outro lado entende.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O adapter implementa o contrato que o cliente espera e guarda uma referência ao objeto adaptado. " +
                "Cada chamada recebida é convertida, nos nomes, na ordem e nos formatos dos argumentos, e repassada.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "adapter.js",
              code: [
                "// Código de terceiros, com outro contrato: valores em centavos e moeda explícita",
                "class LegacyPaymentSdk {",
                "  sendPayment(cents, currency) { return { status: \"OK\", id: `tx-${cents}-${currency}` }; }",
                "}",
                "",
                "// O contrato que o seu código espera: charge(amount) → { ok, id }",
                "class PaymentAdapter {",
                "  constructor(sdk, currency = \"BRL\") {",
                "    this.sdk = sdk;",
                "    this.currency = currency;",
                "  }",
                "  charge(amount) {",
                "    const result = this.sdk.sendPayment(Math.round(amount * 100), this.currency);",
                "    return { ok: result.status === \"OK\", id: result.id };",
                "  }",
                "}",
                "",
                "// O cliente só conhece charge(); nada nele sabe do SDK",
                "function checkout(gateway, total) { return gateway.charge(total); }",
                "",
                "checkout(new PaymentAdapter(new LegacyPaymentSdk()), 49.9);   // { ok: true, id: \"tx-4990-BRL\" }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A conversão de reais para centavos e a leitura do `status` ficam em um só lugar. Trocar de SDK é " +
                "escrever outro adapter, sem tocar em `checkout`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para integrar uma biblioteca, um serviço externo ou um código legado cujo contrato difere do que o seu código espera.",
                "Para isolar uma dependência de terceiros atrás de um contrato seu, de modo que ela possa ser trocada.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se você pode alterar a interface original, ajustá-la direto costuma ser mais simples que manter uma camada de tradução.",
                "O adapter só traduz a forma: se os contratos diferem no comportamento, como síncrono contra assíncrono, ou em garantias de erro, a tradução não basta.",
                "Cada adapter é código a mais para manter, e uma cadeia de adapters é sinal de que os contratos deveriam ser revistos.",
              ],
            },
          ],
          examples: [
            {
              title: "Traduzir a resposta de uma API para o seu modelo",
              context: "O adapter também aparece na fronteira de dados: o formato externo não deve invadir o seu domínio.",
              code: {
                language: "javascript",
                filename: "api-adapter.js",
                code: [
                  "// Formato da API externa",
                  "const apiUser = { user_id: 7, full_name: \"Ana Souza\", e_mail: \"ana@x.com\" };",
                  "",
                  "// O adapter converte para o modelo usado no resto do sistema",
                  "function toUser(apiUser) {",
                  "  return { id: apiUser.user_id, name: apiUser.full_name, email: apiUser.e_mail };",
                  "}",
                  "",
                  "const user = toUser(apiUser);   // { id: 7, name: \"Ana Souza\", email: \"ana@x.com\" }",
                ].join("\n"),
              },
              explanation:
                "Se a API mudar o nome de um campo, só `toUser` é alterado. O restante do sistema continua usando " +
                "`id`, `name` e `email`.",
            },
            {
              title: "Duas implementações atrás do mesmo contrato",
              context: "Com um adapter por fornecedor, o cliente não precisa saber qual está em uso.",
              code: {
                language: "javascript",
                filename: "two-adapters.js",
                code: [
                  "class StripeAdapter {",
                  "  constructor(stripe) { this.stripe = stripe; }",
                  "  charge(amount) { return this.stripe.paymentIntents.create({ amount: amount * 100 }); }",
                  "}",
                  "class PixAdapter {",
                  "  constructor(pix) { this.pix = pix; }",
                  "  charge(amount) { return this.pix.cobrar({ valor: amount.toFixed(2) }); }",
                  "}",
                  "",
                  "// Mesmo contrato, fornecedores diferentes",
                  "const gateways = { card: new StripeAdapter(stripe), pix: new PixAdapter(pix) };",
                  "gateways[order.method].charge(order.total);",
                ].join("\n"),
              },
              explanation:
                "Cada adapter esconde as particularidades do seu fornecedor. O código de cobrança usa apenas " +
                "`charge`, e um novo fornecedor é um novo adapter.",
            },
            {
              title: "Quando o adapter não resolve",
              context: "A tradução da forma não corrige uma diferença de comportamento.",
              code: {
                language: "javascript",
                filename: "semantic-mismatch.js",
                code: [
                  "// O cliente espera algo síncrono:",
                  "// const balance = account.getBalance();",
                  "",
                  "// O serviço só oferece uma chamada assíncrona:",
                  "class RemoteAccount { async fetchBalance() { return 100; } }",
                  "",
                  "// Um adapter que só troca o nome devolve uma Promise, e não um número",
                  "class AccountAdapter {",
                  "  constructor(remote) { this.remote = remote; }",
                  "  getBalance() { return this.remote.fetchBalance(); }   // Promise, e não number",
                  "}",
                  "// O contrato do cliente precisa mudar para ser assíncrono também.",
                ].join("\n"),
              },
              explanation:
                "Sem mudar o contrato do cliente para aceitar uma Promise, o adapter entrega algo diferente do que " +
                "foi prometido. A incompatibilidade de comportamento pede uma decisão de design, e não só tradução.",
            },
          ],
          exercise: {
            problem:
              "Sua aplicação usa um logger com `info(message)` e `error(message)`, mas a biblioteca legada só oferece " +
              "`writeLine(level, text)`. Hoje cada chamada monta a conversão à mão.",
            problemCode: {
              language: "javascript",
              filename: "logging.js",
              code: [
                "class LegacyLogger {",
                "  writeLine(level, text) { console.log(`[${level}] ${text}`); }",
                "}",
                "",
                "const legacy = new LegacyLogger();",
                "",
                "// Espalhado pelo código, com o nível escrito à mão em cada chamada",
                "legacy.writeLine(\"INFO\", \"servidor iniciado\");",
                "legacy.writeLine(\"ERROR\", \"falha ao conectar\");",
                "",
                "function startServer(logger) { logger.info(\"servidor iniciado\"); }   // o que o código quer",
              ].join("\n"),
            },
            task:
              "Crie um adapter com `info(message)` e `error(message)` sobre o `LegacyLogger`, e use-o em " +
              "`startServer`.",
            hint: "O adapter guarda o logger legado e traduz cada método para `writeLine` com o nível correto.",
            solution: {
              code: {
                language: "javascript",
                filename: "logging.fixed.js",
                code: [
                  "class LoggerAdapter {",
                  "  constructor(legacy) { this.legacy = legacy; }",
                  "  info(message) { this.legacy.writeLine(\"INFO\", message); }",
                  "  error(message) { this.legacy.writeLine(\"ERROR\", message); }",
                  "}",
                  "",
                  "const logger = new LoggerAdapter(new LegacyLogger());",
                  "",
                  "function startServer(logger) { logger.info(\"servidor iniciado\"); }",
                  "startServer(logger);   // \"[INFO] servidor iniciado\"",
                ].join("\n"),
              },
              explanation:
                "O código da aplicação usa só `info` e `error`, e o conhecimento do formato legado, `writeLine` e os " +
                "níveis, fica no adapter. Trocar a biblioteca é trocar o adapter.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Decorator",
          note: "acrescenta comportamento envolvendo o objeto, sem herança",
          summary:
            "Acrescenta comportamento a um objeto envolvendo-o em outro com a mesma interface — uma alternativa " +
            "flexível à herança para combinar funcionalidades.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Decorator é um padrão estrutural em que um objeto envolve outro que tem o mesmo contrato e acrescenta " +
                "comportamento antes ou depois de repassar a chamada. Como o decorador tem a mesma interface do objeto " +
                "envolvido, o cliente não percebe a diferença, e vários decoradores podem ser empilhados. É a aplicação " +
                "mais clara de Composition over Inheritance: em vez de uma subclasse para cada combinação de " +
                "funcionalidades (com log, com cache, com os dois), cada funcionalidade é uma peça combinável.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Envolva o objeto em outro com a mesma interface para acrescentar comportamento: as funcionalidades " +
                "viram peças que se empilham, e não subclasses.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O decorador implementa o mesmo contrato do objeto e guarda uma referência a ele. Em cada método, " +
                "faz o seu trabalho extra e delega ao objeto envolvido. O resultado pode ser envolvido de novo.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "decorator.js",
              code: [
                "class Api {",
                "  get(path) { return `dados de ${path}`; }",
                "}",
                "",
                "class LoggingApi {",
                "  constructor(inner) { this.inner = inner; }",
                "  get(path) {",
                "    console.log(`GET ${path}`);",
                "    return this.inner.get(path);",
                "  }",
                "}",
                "",
                "class CachedApi {",
                "  constructor(inner) { this.inner = inner; this.cache = new Map(); }",
                "  get(path) {",
                "    if (!this.cache.has(path)) this.cache.set(path, this.inner.get(path));",
                "    return this.cache.get(path);",
                "  }",
                "}",
                "",
                "// Empilhar: o cache envolve o log, que envolve a API",
                "const api = new CachedApi(new LoggingApi(new Api()));",
                "api.get(\"/users\");   // registra a chamada e busca",
                "api.get(\"/users\");   // vem do cache, sem chegar ao log",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada funcionalidade existe uma vez. Para ter só log, só cache ou os dois, basta escolher quais " +
                "decoradores empilhar, sem criar classes novas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para acrescentar responsabilidades transversais, como log, cache, retry, medição de tempo ou autorização, sem alterar a classe original.",
                "Quando as funcionalidades precisam ser combinadas de formas variadas, e uma subclasse por combinação seria inviável.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "A ordem dos decoradores muda o resultado, como cache antes ou depois do log, e errar a ordem gera bugs sutis.",
                "Muitas camadas dificultam a depuração: o stack trace passa por todas e fica difícil saber qual fez o quê.",
                "Com uma interface grande, cada método precisa ser repassado à mão, o que dá trabalho e é fácil de esquecer.",
                "O decorador é outro objeto: comparações de identidade e `instanceof` com o original deixam de valer.",
              ],
            },
          ],
          examples: [
            {
              title: "Decorador como função",
              context: "Em JavaScript, uma função de ordem superior costuma bastar para decorar outra função.",
              code: {
                language: "javascript",
                filename: "function-decorator.js",
                code: [
                  "function withRetry(fn, attempts = 3) {",
                  "  return async (...args) => {",
                  "    let lastError;",
                  "    for (let i = 0; i < attempts; i++) {",
                  "      try { return await fn(...args); }",
                  "      catch (error) { lastError = error; }",
                  "    }",
                  "    throw lastError;",
                  "  };",
                  "}",
                  "",
                  "const fetchUser = async (id) => { /* pode falhar */ };",
                  "const fetchUserWithRetry = withRetry(fetchUser);   // mesma assinatura, comportamento extra",
                ].join("\n"),
              },
              explanation:
                "`withRetry` recebe uma função e devolve outra com o mesmo contrato, que tenta de novo em caso de " +
                "falha. É Higher-Order Function aplicada ao padrão.",
            },
            {
              title: "A ordem importa",
              context: "Empilhar os mesmos decoradores em ordens diferentes dá comportamentos diferentes.",
              code: {
                language: "javascript",
                filename: "order.js",
                code: [
                  "// Cache por fora: uma segunda chamada não chega ao log",
                  "const a = new CachedApi(new LoggingApi(new Api()));",
                  "a.get(\"/x\"); a.get(\"/x\");   // registra 1 vez",
                  "",
                  "// Log por fora: toda chamada é registrada, mesmo as servidas pelo cache",
                  "const b = new LoggingApi(new CachedApi(new Api()));",
                  "b.get(\"/x\"); b.get(\"/x\");   // registra 2 vezes",
                ].join("\n"),
              },
              explanation:
                "Nos dois casos os decoradores são os mesmos. O que muda é qual camada vê cada chamada, e escolher a " +
                "ordem faz parte do design.",
            },
            {
              title: "A explosão de subclasses que o Decorator evita",
              context: "Com herança, cada combinação de funcionalidades vira uma classe.",
              code: {
                language: "javascript",
                filename: "explosion.js",
                code: [
                  "// Com herança: 3 funcionalidades geram 7 combinações possíveis",
                  "// LoggedApi, CachedApi, RetryApi,",
                  "// LoggedCachedApi, LoggedRetryApi, CachedRetryApi, LoggedCachedRetryApi",
                  "",
                  "// Com decoradores: 3 peças, combinadas onde forem necessárias",
                  "const api = new RetryApi(new CachedApi(new LoggingApi(new Api())));",
                ].join("\n"),
              },
              explanation:
                "O número de subclasses cresce exponencialmente com as funcionalidades, e o de decoradores cresce " +
                "linearmente. É o argumento central de Composition over Inheritance.",
            },
          ],
          exercise: {
            problem:
              "Cada combinação de log e cache virou uma subclasse de `Api`. Adicionar medição de tempo dobraria o " +
              "número de classes.",
            problemCode: {
              language: "javascript",
              filename: "api-subclasses.js",
              code: [
                "class Api { get(path) { return `dados de ${path}`; } }",
                "",
                "class LoggedApi extends Api {",
                "  get(path) { console.log(`GET ${path}`); return super.get(path); }",
                "}",
                "class CachedApi extends Api {",
                "  cache = new Map();",
                "  get(path) {",
                "    if (!this.cache.has(path)) this.cache.set(path, super.get(path));",
                "    return this.cache.get(path);",
                "  }",
                "}",
                "class LoggedCachedApi extends CachedApi {",
                "  get(path) { console.log(`GET ${path}`); return super.get(path); }   // log repetido",
                "}",
              ].join("\n"),
            },
            task:
              "Refatore para decoradores: `LoggingApi` e `CachedApi` envolvem qualquer objeto com `get`, e o " +
              "`LoggedCachedApi` deixa de existir.",
            hint: "Cada decorador recebe o objeto envolvido no construtor e delega a ele em `get`. As combinações são feitas ao empilhar.",
            solution: {
              code: {
                language: "javascript",
                filename: "api-decorators.js",
                code: [
                  "class Api { get(path) { return `dados de ${path}`; } }",
                  "",
                  "class LoggingApi {",
                  "  constructor(inner) { this.inner = inner; }",
                  "  get(path) { console.log(`GET ${path}`); return this.inner.get(path); }",
                  "}",
                  "",
                  "class CachedApi {",
                  "  constructor(inner) { this.inner = inner; this.cache = new Map(); }",
                  "  get(path) {",
                  "    if (!this.cache.has(path)) this.cache.set(path, this.inner.get(path));",
                  "    return this.cache.get(path);",
                  "  }",
                  "}",
                  "",
                  "const onlyLog = new LoggingApi(new Api());",
                  "const both = new CachedApi(new LoggingApi(new Api()));   // no lugar de LoggedCachedApi",
                ].join("\n"),
              },
              explanation:
                "O log e o cache passaram a existir uma vez cada, e qualquer combinação é uma escolha de quais " +
                "empilhar. Medir tempo agora é um decorador novo, e não uma subclasse para cada combinação.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Facade",
          note: "uma interface simples na frente de um subsistema complexo",
          summary:
            "Oferece uma interface simples e única na frente de um subsistema com muitas peças, para que quem o usa " +
            "não precise conhecer nem coordenar cada uma delas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Facade é um padrão estrutural que põe uma interface simples na frente de um conjunto de classes " +
                "complexo. Em vez de o cliente conhecer o estoque, o pagamento, o frete e o e-mail, e chamá-los na " +
                "ordem certa, ele chama uma operação da fachada, `placeOrder(order)`, e ela coordena o resto. Não " +
                "adiciona funcionalidade nem traduz contratos, como o Adapter: só reduz o que quem usa precisa saber.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma porta de entrada simples para um subsistema complicado: quem usa faz uma chamada, e a fachada " +
                "coordena as peças.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A fachada guarda as peças do subsistema e expõe poucas operações de alto nível. Cada operação " +
                "coordena as chamadas necessárias. O subsistema continua existindo e pode ser usado diretamente por " +
                "quem precisar de mais controle.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "facade.js",
              code: [
                "// Subsistema: cada peça tem sua própria interface",
                "class Inventory { reserve(items) { /* ... */ return true; } }",
                "class Payment { charge(user, total) { /* ... */ return { ok: true }; } }",
                "class Shipping { schedule(address, items) { /* ... */ return \"ENV-1\"; } }",
                "class Mailer { send(to, text) { /* ... */ } }",
                "",
                "// Fachada: uma operação que coordena tudo, na ordem certa",
                "class OrderFacade {",
                "  constructor(inventory, payment, shipping, mailer) {",
                "    Object.assign(this, { inventory, payment, shipping, mailer });",
                "  }",
                "  placeOrder(order) {",
                "    if (!this.inventory.reserve(order.items)) return { ok: false, reason: \"sem estoque\" };",
                "    const charge = this.payment.charge(order.user, order.total);",
                "    if (!charge.ok) return { ok: false, reason: \"pagamento recusado\" };",
                "    const tracking = this.shipping.schedule(order.address, order.items);",
                "    this.mailer.send(order.user.email, `Pedido enviado: ${tracking}`);",
                "    return { ok: true, tracking };",
                "  }",
                "}",
                "",
                "// O cliente faz uma chamada só",
                "const shop = new OrderFacade(new Inventory(), new Payment(), new Shipping(), new Mailer());",
                "shop.placeOrder({ items: [1], user: { email: \"a@x.com\" }, total: 50, address: \"Rua A\" });",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Quem chama `placeOrder` não conhece as quatro classes nem a ordem entre elas. Se o subsistema mudar, " +
                "o ajuste fica na fachada.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para simplificar o uso de um subsistema com muitas peças, ou de uma biblioteca complexa, oferecendo uma interface de alto nível para os casos comuns.",
                "Como porta de entrada de um módulo, para que o resto do sistema dependa só dela e não dos detalhes internos (Coupling).",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se a fachada acumular regras de negócio, e não apenas coordenar chamadas, ela vira um \"objeto deus\"; a lógica pertence às peças do subsistema.",
                "Esconder demais atrapalha quem precisa de controle fino: mantenha o subsistema acessível para os casos que a fachada não cobre.",
                "Uma fachada que só repassa uma chamada, sem coordenar nada, não simplifica e é indireção inútil.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma fachada sobre `fetch`",
              context: "Uma chamada HTTP comum exige vários passos repetidos; a fachada os reúne.",
              code: {
                language: "javascript",
                filename: "http-facade.js",
                code: [
                  "// Sem fachada, cada chamada repete os mesmos passos",
                  "const response = await fetch(\"/users/7\", { headers: { accept: \"application/json\" } });",
                  "if (!response.ok) throw new Error(`HTTP ${response.status}`);",
                  "const user = await response.json();",
                  "",
                  "// Fachada: um ponto que faz tudo isso",
                  "const http = {",
                  "  async getJson(url) {",
                  "    const response = await fetch(url, { headers: { accept: \"application/json\" } });",
                  "    if (!response.ok) throw new Error(`HTTP ${response.status}`);",
                  "    return response.json();",
                  "  },",
                  "};",
                  "",
                  "const user2 = await http.getJson(\"/users/7\");",
                ].join("\n"),
              },
              explanation:
                "`getJson` esconde o cabeçalho, a checagem de status e a leitura do corpo. O código que a usa só diz " +
                "o que quer, e as regras de como falar HTTP ficam em um lugar.",
            },
            {
              title: "A fachada convive com o acesso direto",
              context: "A fachada cobre o caso comum; quem precisa de mais usa o subsistema diretamente.",
              code: {
                language: "javascript",
                filename: "coexist.js",
                code: [
                  "// Caso comum: pela fachada",
                  "shop.placeOrder(order);",
                  "",
                  "// Caso especial: um estorno manual, que a fachada não oferece, usa a peça direto",
                  "payment.refund(order.paymentId);",
                ].join("\n"),
              },
              explanation:
                "A fachada não fecha o subsistema. Ela oferece o caminho fácil, e as peças continuam acessíveis para " +
                "os casos fora do comum.",
            },
            {
              title: "Quando a fachada vira um objeto deus",
              context: "O erro mais comum é deixar a fachada acumular a lógica em vez de só coordenar.",
              code: {
                language: "javascript",
                filename: "god-object.js",
                code: [
                  "// Errado: a fachada calcula desconto, valida cupom e aplica regras de frete",
                  "class OrderFacade {",
                  "  placeOrder(order) {",
                  "    let total = order.total;",
                  "    if (order.coupon === \"BLACK\") total *= 0.5;          // regra de preço na fachada",
                  "    if (order.address.state === \"AM\") total += 80;       // regra de frete na fachada",
                  "    // ...",
                  "  }",
                  "}",
                  "",
                  "// Certo: as regras vivem nas peças, e a fachada só as chama",
                  "// const total = this.pricing.total(order);",
                  "// const shippingCost = this.shipping.quote(order.address);",
                ].join("\n"),
              },
              explanation:
                "Regras de preço e de frete pertencem a `Pricing` e `Shipping`. Quando a fachada as absorve, ela " +
                "deixa de simplificar e passa a ser o ponto onde tudo se acumula.",
            },
          ],
          exercise: {
            problem:
              "Gerar um relatório exige quatro chamadas em ordem, repetidas em três telas. Uma delas esqueceu o " +
              "filtro e mostra dados de todos os usuários.",
            problemCode: {
              language: "javascript",
              filename: "report-usage.js",
              code: [
                "// Tela 1",
                "const rows = loadData(range);",
                "const filtered = applyFilters(rows, user);",
                "const totals = computeTotals(filtered);",
                "const html = render(filtered, totals);",
                "",
                "// Tela 2: esqueceu applyFilters",
                "const rows2 = loadData(range);",
                "const totals2 = computeTotals(rows2);",
                "const html2 = render(rows2, totals2);",
              ].join("\n"),
            },
            task:
              "Crie uma fachada `generateReport(range, user)` que faça as quatro etapas na ordem certa, e mostre as " +
              "telas usando-a.",
            hint: "A fachada só coordena as chamadas existentes; ela não deve reimplementar nenhuma etapa.",
            solution: {
              code: {
                language: "javascript",
                filename: "report-facade.js",
                code: [
                  "function generateReport(range, user) {",
                  "  const rows = loadData(range);",
                  "  const filtered = applyFilters(rows, user);   // nunca mais esquecido",
                  "  const totals = computeTotals(filtered);",
                  "  return render(filtered, totals);",
                  "}",
                  "",
                  "// Telas",
                  "const html1 = generateReport(range, user);",
                  "const html2 = generateReport(range2, user);",
                ].join("\n"),
              },
              explanation:
                "A ordem e o filtro obrigatório ficaram em um só lugar, e as telas não podem mais esquecê-los. As " +
                "etapas continuam sendo funções separadas, e a fachada apenas as coordena.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Proxy",
          note: "um substituto que controla o acesso ao objeto real",
          summary:
            "Um substituto com a mesma interface do objeto real, que controla o acesso a ele — para adiar a criação, " +
            "checar permissões, guardar em cache ou registrar chamadas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Proxy é um padrão estrutural em que um objeto substituto, com a mesma interface do objeto real, fica " +
                "na frente dele e decide se, quando e como a chamada chega. O cliente usa o proxy como se fosse o " +
                "objeto real. Tem a mesma estrutura do Decorator, mas outra intenção: o decorador acrescenta " +
                "comportamento, e o proxy controla o acesso, muitas vezes cuidando de criar ou de alcançar o objeto real.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um substituto com a mesma interface controla o acesso ao objeto real: ele decide se, quando e como a " +
                "chamada chega até lá.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O proxy implementa o contrato do objeto real e guarda (ou cria sob demanda) uma referência a ele. " +
                "A cada chamada, aplica a regra de acesso, como criar só agora, verificar a permissão ou contar, e " +
                "então delega.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "proxy.js",
              code: [
                "// Objeto real: caro de criar",
                "class HeavyReport {",
                "  constructor() { console.log(\"carregando dados…\"); this.rows = [1, 2, 3]; }",
                "  read() { return this.rows; }",
                "}",
                "",
                "// Proxy virtual: só cria o objeto real quando alguém realmente o usa",
                "class LazyReport {",
                "  #real = null;",
                "  read() {",
                "    this.#real ??= new HeavyReport();",
                "    return this.#real.read();",
                "  }",
                "}",
                "",
                "const report = new LazyReport();   // nada foi carregado ainda",
                "report.read();                     // \"carregando dados…\" — só agora",
                "report.read();                     // reaproveita o objeto criado",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Criar `LazyReport` é barato. O custo do `HeavyReport` só é pago na primeira leitura, e o cliente usa " +
                "`read()` sem saber que há um proxy.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para adiar a criação de um objeto caro até o primeiro uso (proxy virtual).",
                "Para controlar o acesso, como permissões, limites de uso, cache ou registro de chamadas, sem alterar o objeto real (proxy de proteção).",
                "Para representar um objeto que está em outro lugar, como um serviço remoto, com a mesma interface de um objeto local.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Esconde custos e falhas: o cliente acha que chama um objeto local, mas pode haver latência, atraso na criação ou erros de rede.",
                "Cada camada extra dificulta a depuração e acrescenta uma chamada a mais.",
                "O `Proxy` nativo do JavaScript tem custo de desempenho e não funciona bem com campos privados (`#campo`): o método roda com `this` sendo o proxy, e não o alvo.",
                "Se o objetivo é só acrescentar comportamento, sem controlar o acesso, o Decorator descreve melhor a intenção.",
              ],
            },
          ],
          examples: [
            {
              title: "Proxy de proteção",
              context: "A regra de quem pode fazer o quê fica no proxy, e o objeto real não a conhece.",
              code: {
                language: "javascript",
                filename: "protection-proxy.js",
                code: [
                  "class Document {",
                  "  constructor(text) { this.text = text; }",
                  "  read() { return this.text; }",
                  "  delete() { return \"apagado\"; }",
                  "}",
                  "",
                  "class ProtectedDocument {",
                  "  constructor(document, user) { this.document = document; this.user = user; }",
                  "  read() { return this.document.read(); }",
                  "  delete() {",
                  "    if (this.user.role !== \"admin\") throw new Error(\"sem permissão\");",
                  "    return this.document.delete();",
                  "  }",
                  "}",
                  "",
                  "const doc = new ProtectedDocument(new Document(\"contrato\"), { role: \"viewer\" });",
                  "doc.read();     // \"contrato\"",
                  "doc.delete();   // Error: sem permissão",
                ].join("\n"),
              },
              explanation:
                "`Document` continua simples, sem saber de permissões. O proxy aplica a regra, e o cliente usa a " +
                "mesma interface de antes.",
            },
            {
              title: "O `Proxy` nativo do JavaScript",
              context: "A linguagem oferece um objeto `Proxy` que intercepta leituras e escritas de propriedades.",
              code: {
                language: "javascript",
                filename: "native-proxy.js",
                code: [
                  "const user = { name: \"Ana\", age: 30 };",
                  "",
                  "const validated = new Proxy(user, {",
                  "  set(target, property, value) {",
                  "    if (property === \"age\" && (!Number.isInteger(value) || value < 0)) {",
                  "      throw new TypeError(\"age deve ser um inteiro não negativo\");",
                  "    }",
                  "    target[property] = value;",
                  "    return true;",
                  "  },",
                  "});",
                  "",
                  "validated.age = 31;        // ok",
                  "validated.age = -5;        // TypeError",
                ].join("\n"),
              },
              explanation:
                "A armadilha `set` intercepta cada escrita e valida antes de gravar. É um proxy de proteção sem " +
                "precisar escrever uma classe por objeto.",
            },
            {
              title: "Proxy nativo e campos privados",
              context: "Uma limitação prática: métodos que usam `#campo` falham quando chamados através do proxy.",
              code: {
                language: "javascript",
                filename: "private-fields.js",
                code: [
                  "class Counter {",
                  "  #count = 0;",
                  "  increment() { return ++this.#count; }",
                  "}",
                  "",
                  "const broken = new Proxy(new Counter(), {});",
                  "try { broken.increment(); }",
                  "catch (error) { error.name; }   // \"TypeError\" — `this` é o proxy, e não tem o campo privado",
                  "",
                  "// Solução: vincular os métodos ao alvo",
                  "const working = new Proxy(new Counter(), {",
                  "  get(target, property) {",
                  "    const value = Reflect.get(target, property, target);",
                  "    return typeof value === \"function\" ? value.bind(target) : value;",
                  "  },",
                  "});",
                  "working.increment();   // 1",
                ].join("\n"),
              },
              explanation:
                "Campos privados pertencem ao objeto real, e não ao proxy. Vincular os métodos ao alvo resolve, mas " +
                "é um exemplo de como a transparência do proxy nem sempre é total.",
            },
          ],
          exercise: {
            problem:
              "A verificação de permissão está repetida em cada ponto que apaga um documento, e uma das telas se " +
              "esqueceu dela. A classe `Document` não deveria conhecer permissões.",
            problemCode: {
              language: "javascript",
              filename: "documents.js",
              code: [
                "class Document {",
                "  constructor(id) { this.id = id; }",
                "  delete() { return `documento ${this.id} apagado`; }",
                "}",
                "",
                "// Tela A",
                "if (user.role === \"admin\") doc.delete();",
                "",
                "// Tela B: esqueceu a checagem",
                "doc.delete();",
              ].join("\n"),
            },
            task:
              "Crie um proxy de proteção que aplique a regra de admin em um só lugar, e use-o no lugar do documento " +
              "nas duas telas.",
            hint: "O proxy tem os mesmos métodos do documento, guarda o usuário e só delega `delete()` se ele for admin.",
            solution: {
              code: {
                language: "javascript",
                filename: "documents.fixed.js",
                code: [
                  "class ProtectedDocument {",
                  "  constructor(document, user) { this.document = document; this.user = user; }",
                  "  delete() {",
                  "    if (this.user.role !== \"admin\") throw new Error(\"sem permissão\");",
                  "    return this.document.delete();",
                  "  }",
                  "}",
                  "",
                  "const doc = new ProtectedDocument(new Document(7), user);",
                  "",
                  "// Telas A e B: a regra vale em qualquer uma",
                  "doc.delete();",
                ].join("\n"),
              },
              explanation:
                "A regra de permissão vive em um só lugar, no proxy, e nenhuma tela consegue esquecê-la. `Document` " +
                "permaneceu sem saber nada sobre permissões.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Composite",
          note: "relaciona-se com Data Structures / Tree (Epic 01) — aplicação, não Requires",
          summary:
            "Permite tratar objetos individuais e grupos de objetos do mesmo jeito, organizando-os em uma estrutura " +
            "de árvore em que cada nó, folha ou grupo, responde à mesma interface.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Composite é um padrão estrutural para estruturas parte-todo: um grupo contém outros elementos, que " +
                "podem ser folhas ou outros grupos, e tanto a folha quanto o grupo cumprem o mesmo contrato. O cliente " +
                "chama uma operação, como `size()`, sem precisar saber se está diante de um item ou de um conjunto: " +
                "o grupo aplica a operação a cada filho e combina os resultados. É a aplicação de uma Tree (módulo " +
                "Data Structures) com um contrato uniforme entre os nós.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Folha e grupo têm a mesma interface: quem usa a estrutura trata os dois do mesmo jeito, e o grupo " +
                "propaga a operação aos seus filhos.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A folha implementa a operação diretamente. O grupo guarda uma lista de filhos e implementa a mesma " +
                "operação percorrendo-os, com recursão (Recursion). Como todos cumprem o mesmo contrato, a árvore " +
                "pode ter qualquer profundidade.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "composite.js",
              code: [
                "// Folha",
                "class File {",
                "  constructor(name, bytes) { this.name = name; this.bytes = bytes; }",
                "  size() { return this.bytes; }",
                "}",
                "",
                "// Grupo: também tem size(), calculado a partir dos filhos",
                "class Folder {",
                "  constructor(name, children = []) { this.name = name; this.children = children; }",
                "  add(child) { this.children.push(child); return this; }",
                "  size() { return this.children.reduce((total, child) => total + child.size(), 0); }",
                "}",
                "",
                "const root = new Folder(\"projeto\", [",
                "  new File(\"readme.md\", 200),",
                "  new Folder(\"src\", [new File(\"a.js\", 500), new File(\"b.js\", 300)]),",
                "]);",
                "",
                "root.size();   // 1000 — a mesma chamada, seja em um arquivo, uma pasta ou a raiz",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`size()` funciona em qualquer nó. O cliente não distingue arquivo de pasta, e adicionar um novo nível " +
                "de pastas não exige mudar nenhum código que consulta o tamanho.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para estruturas em árvore de parte e todo, como arquivos e pastas, menus com submenus, componentes de interface e expressões.",
                "Quando o cliente deve tratar elementos individuais e grupos de forma uniforme, sem `if` para distinguir.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se as folhas e os grupos são muito diferentes, a interface comum fica genérica demais, com métodos que não fazem sentido em um dos lados, como `add` em uma folha.",
                "Para uma estrutura plana, uma lista basta: a recursão do composite só se justifica quando há aninhamento.",
                "Árvores muito profundas percorridas por recursão podem estourar a pilha, e operações que dependem do tipo do nó voltam a exigir checagens.",
              ],
            },
          ],
          examples: [
            {
              title: "Menus com submenus",
              context: "Um item de menu e um submenu respondem à mesma operação de renderização.",
              code: {
                language: "javascript",
                filename: "menu.js",
                code: [
                  "class MenuItem {",
                  "  constructor(label) { this.label = label; }",
                  "  render(depth = 0) { return `${\"  \".repeat(depth)}- ${this.label}`; }",
                  "}",
                  "",
                  "class Submenu {",
                  "  constructor(label, items = []) { this.label = label; this.items = items; }",
                  "  render(depth = 0) {",
                  "    const children = this.items.map((item) => item.render(depth + 1));",
                  "    return [`${\"  \".repeat(depth)}+ ${this.label}`, ...children].join(\"\\n\");",
                  "  }",
                  "}",
                  "",
                  "const menu = new Submenu(\"Arquivo\", [",
                  "  new MenuItem(\"Novo\"),",
                  "  new Submenu(\"Abrir recente\", [new MenuItem(\"a.txt\"), new MenuItem(\"b.txt\")]),",
                  "]);",
                  "menu.render();",
                ].join("\n"),
              },
              explanation:
                "O submenu chama `render` em cada filho, sem saber se é um item ou outro submenu. Adicionar mais um " +
                "nível não altera nenhuma das duas classes.",
            },
            {
              title: "Outra operação sobre a mesma árvore",
              context: "Uma vez montada a estrutura, novas operações seguem o mesmo esquema de propagar aos filhos.",
              code: {
                language: "javascript",
                filename: "count.js",
                code: [
                  "class File {",
                  "  constructor(name, bytes) { this.name = name; this.bytes = bytes; }",
                  "  size() { return this.bytes; }",
                  "  count() { return 1; }",
                  "}",
                  "",
                  "class Folder {",
                  "  constructor(name, children = []) { this.name = name; this.children = children; }",
                  "  size() { return this.children.reduce((sum, c) => sum + c.size(), 0); }",
                  "  count() { return this.children.reduce((sum, c) => sum + c.count(), 0); }   // só arquivos",
                  "}",
                  "",
                  "const root = new Folder(\"p\", [new File(\"a\", 1), new Folder(\"s\", [new File(\"b\", 2)])]);",
                  "root.count();   // 2",
                ].join("\n"),
              },
              explanation:
                "O padrão se repete: a folha responde diretamente, e o grupo combina as respostas dos filhos. Cada " +
                "nova operação exige acrescentá-la nos dois tipos.",
            },
            {
              title: "O problema da interface comum",
              context: "Operações que só fazem sentido para um dos lados forçam uma escolha de design.",
              code: {
                language: "javascript",
                filename: "interface-tradeoff.js",
                code: [
                  "// Opção 1: `add` só existe no grupo (mais seguro; o cliente precisa saber o tipo para adicionar)",
                  "class Folder { add(child) { /* ... */ } }",
                  "class File { /* sem add */ }",
                  "",
                  "// Opção 2: `add` em todos os nós (mais uniforme; a folha precisa recusar)",
                  "class Leaf {",
                  "  add() { throw new Error(\"uma folha não tem filhos\"); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Não há resposta única: a opção 1 protege o cliente de erros, e a opção 2 mantém a uniformidade. " +
                "É o principal custo do padrão, e a escolha depende de o quanto o cliente precisa ignorar a diferença.",
            },
          ],
          exercise: {
            problem:
              "Para calcular o preço de um carrinho com produtos e combos (que contêm produtos e outros combos), o " +
              "código distingue os tipos com `Array.isArray` em cada lugar.",
            problemCode: {
              language: "javascript",
              filename: "cart-price.js",
              code: [
                "const cart = [",
                "  { name: \"caneta\", price: 5 },",
                "  [{ name: \"caderno\", price: 20 }, { name: \"lápis\", price: 3 }],   // um combo",
                "];",
                "",
                "function totalPrice(items) {",
                "  let total = 0;",
                "  for (const item of items) {",
                "    if (Array.isArray(item)) total += totalPrice(item);   // grupo",
                "    else total += item.price;                              // produto",
                "  }",
                "  return total;",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Composite: `Product` e `Bundle` com a mesma operação `price()`, e um combo que aplica 10% de " +
              "desconto sobre a soma dos seus itens.",
            hint: "O `Product` devolve o próprio preço. O `Bundle` soma o `price()` dos filhos, sem `Array.isArray`, e aplica o desconto.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart-price.fixed.js",
                code: [
                  "class Product {",
                  "  constructor(name, value) { this.name = name; this.value = value; }",
                  "  price() { return this.value; }",
                  "}",
                  "",
                  "class Bundle {",
                  "  constructor(items, discount = 0.1) { this.items = items; this.discount = discount; }",
                  "  price() {",
                  "    const sum = this.items.reduce((total, item) => total + item.price(), 0);",
                  "    return sum * (1 - this.discount);",
                  "  }",
                  "}",
                  "",
                  "const cart = new Bundle([",
                  "  new Product(\"caneta\", 5),",
                  "  new Bundle([new Product(\"caderno\", 20), new Product(\"lápis\", 3)]),",
                  "], 0);",
                  "",
                  "cart.price();   // 5 + (20 + 3) × 0,9 = 25,7",
                ].join("\n"),
              },
              explanation:
                "O cliente chama `price()` em qualquer nó, sem checar o tipo. O combo aninhado aplica o seu desconto, " +
                "e o total do carrinho, que também é um `Bundle` sem desconto, apenas soma.",
            },
          },
        }),
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
        concept({
          order: 10,
          title: "Strategy",
          note: "algoritmos intercambiáveis atrás de um mesmo contrato",
          summary:
            "Define uma família de algoritmos intercambiáveis atrás de um mesmo contrato, para que quem os usa " +
            "escolha, ou troque, qual aplicar sem alterar o seu próprio código.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Strategy é um padrão comportamental em que cada variação de um algoritmo, um cálculo de desconto, uma " +
                "regra de ordenação, uma forma de validar, vive em um objeto ou função própria, todos com o mesmo " +
                "contrato. O código que precisa do algoritmo recebe uma estratégia e a executa, sem saber qual é. É a " +
                "aplicação direta de Encapsulate What Varies e de Program to an Interface: o que varia é a estratégia, " +
                "e o restante depende só do contrato.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Coloque cada variação do algoritmo em uma peça com o mesmo contrato e entregue a peça a quem a usa: " +
                "trocar o comportamento é trocar a estratégia, sem `if` nem herança.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O contexto guarda uma estratégia, recebida no construtor ou por parâmetro, e delega a ela a parte " +
                "que varia. Cada estratégia implementa o contrato. Em JavaScript, uma estratégia pode ser apenas uma " +
                "função, e não é preciso criar uma classe para cada uma.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "strategy.js",
              code: [
                "// Estratégias: todas cumprem o contrato apply(subtotal) → total",
                "const noDiscount = { apply: (subtotal) => subtotal };",
                "const memberDiscount = { apply: (subtotal) => subtotal * 0.9 };",
                "const seasonalDiscount = { apply: (subtotal) => Math.max(subtotal - 20, 0) };",
                "",
                "// Contexto: usa a estratégia sem saber qual é",
                "class Checkout {",
                "  constructor(discount) { this.discount = discount; }",
                "  total(subtotal) { return this.discount.apply(subtotal); }",
                "}",
                "",
                "new Checkout(noDiscount).total(100);         // 100",
                "new Checkout(memberDiscount).total(100);     // 90",
                "new Checkout(seasonalDiscount).total(100);   // 80",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`Checkout` não tem nenhum `if` sobre o tipo de desconto. Uma nova regra é uma nova estratégia, e o " +
                "contexto não muda.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando há várias formas de fazer a mesma coisa, e a escolha depende do contexto, da configuração ou do usuário.",
                "Quando o mesmo `if` ou `switch` sobre o tipo de algoritmo se repete em vários pontos, ou cresce a cada regra nova.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com só dois ou três casos estáveis, um condicional simples é mais claro que várias estratégias.",
                "O cliente precisa conhecer as estratégias para escolher uma, o que traz parte da complexidade para fora.",
                "Estratégias com contratos diferentes não são intercambiáveis: se cada uma precisa de dados distintos, o contrato comum fica forçado.",
              ],
            },
          ],
          examples: [
            {
              title: "A estratégia como função: o comparador do `sort`",
              context: "Em JavaScript, o padrão já aparece na própria linguagem: passar uma função que define o algoritmo.",
              code: {
                language: "javascript",
                filename: "sort-strategy.js",
                code: [
                  "const byPrice = (a, b) => a.price - b.price;",
                  "const byName = (a, b) => a.name.localeCompare(b.name);",
                  "",
                  "const products = [{ name: \"Lápis\", price: 3 }, { name: \"Caderno\", price: 20 }, { name: \"Borracha\", price: 2 }];",
                  "",
                  "[...products].sort(byPrice);   // Borracha, Lápis, Caderno",
                  "[...products].sort(byName);    // Borracha, Caderno, Lápis",
                ].join("\n"),
              },
              explanation:
                "O `sort` é o contexto: ele controla a ordenação, e a estratégia, o comparador, define a regra de " +
                "comparação. Trocar de critério é passar outra função.",
            },
            {
              title: "Trocar a estratégia em tempo de execução",
              context: "Como a estratégia é uma peça recebida, ela pode mudar enquanto o programa roda.",
              code: {
                language: "javascript",
                filename: "runtime-switch.js",
                code: [
                  "class Checkout {",
                  "  constructor(discount) { this.discount = discount; }",
                  "  setDiscount(discount) { this.discount = discount; }",
                  "  total(subtotal) { return this.discount.apply(subtotal); }",
                  "}",
                  "",
                  "const checkout = new Checkout(noDiscount);",
                  "checkout.total(100);                  // 100",
                  "",
                  "// O cliente entra como membro: só se troca a estratégia",
                  "checkout.setDiscount(memberDiscount);",
                  "checkout.total(100);                  // 90",
                ].join("\n"),
              },
              explanation:
                "Não foi preciso criar outro objeto nem editar `Checkout`. Mudar de regra é trocar a peça que ele " +
                "recebeu.",
            },
            {
              title: "Quando um `if` basta",
              context: "Nem toda variação justifica um padrão.",
              code: {
                language: "javascript",
                filename: "when-if-is-enough.js",
                code: [
                  "// Exagero: uma estratégia para escolher entre duas mensagens que nunca vão mudar",
                  "const greetings = { formal: { text: () => \"Prezado\" }, casual: { text: () => \"Oi\" } };",
                  "const greet = (style) => greetings[style].text();",
                  "",
                  "// Suficiente: um condicional simples",
                  "const greeting = isFormal ? \"Prezado\" : \"Oi\";",
                ].join("\n"),
              },
              explanation:
                "Duas alternativas estáveis, em um único lugar, não justificam uma estrutura. O padrão passa a valer " +
                "quando as variações se multiplicam ou aparecem em vários pontos.",
            },
          ],
          exercise: {
            problem:
              "A estimativa de tempo de viagem usa um `if` por meio de transporte. Cada meio novo exige editar a " +
              "função, e a mesma escolha se repete em outros pontos do sistema.",
            problemCode: {
              language: "javascript",
              filename: "trip.js",
              code: [
                "function estimateMinutes(distanceKm, mode) {",
                "  if (mode === \"walk\") return distanceKm * 12;",
                "  if (mode === \"bike\") return distanceKm * 4;",
                "  if (mode === \"car\") return distanceKm * 1.5 + 5;   // 5 min para estacionar",
                "  throw new Error(`meio desconhecido: ${mode}`);",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Strategy: uma estratégia por meio de transporte com o mesmo contrato, e uma classe `Trip` que " +
              "recebe a estratégia e calcula o tempo.",
            hint: "Cada estratégia tem `minutes(distanceKm)`. `Trip` guarda a distância e a estratégia, e delega o cálculo.",
            solution: {
              code: {
                language: "javascript",
                filename: "trip.fixed.js",
                code: [
                  "const walk = { minutes: (km) => km * 12 };",
                  "const bike = { minutes: (km) => km * 4 };",
                  "const car = { minutes: (km) => km * 1.5 + 5 };",
                  "",
                  "class Trip {",
                  "  constructor(distanceKm, transport) {",
                  "    this.distanceKm = distanceKm;",
                  "    this.transport = transport;",
                  "  }",
                  "  estimateMinutes() { return this.transport.minutes(this.distanceKm); }",
                  "}",
                  "",
                  "new Trip(10, bike).estimateMinutes();   // 40",
                  "new Trip(10, car).estimateMinutes();    // 20",
                ].join("\n"),
              },
              explanation:
                "`Trip` não tem nenhum `if` de transporte, e um meio novo é uma nova estratégia. A escolha de qual " +
                "usar passou para quem monta a viagem.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Observer",
          note: "notifica quem se interessou, sem conhecê-lo",
          summary:
            "Permite que um objeto notifique automaticamente outros quando algo muda ou acontece, sem conhecê-los " +
            "nem depender deles — quem tem interesse se inscreve.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Observer é um padrão comportamental em que um objeto, o sujeito, mantém uma lista de interessados, os " +
                "observadores, e os avisa quando algo acontece. O sujeito só conhece o contrato de quem se inscreve (uma " +
                "função ou um método de notificação), e não quem são nem quantos são. É uma forma de Inversion of " +
                "Control: em vez de o sujeito chamar cada parte interessada, elas se registram e são chamadas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quem gera o evento não conhece quem reage a ele: os interessados se inscrevem, e são avisados quando " +
                "algo acontece.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O sujeito expõe `subscribe`, que registra um observador e devolve uma forma de cancelar a inscrição, " +
                "e `emit`, que chama todos os inscritos com os dados do evento.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "observer.js",
              code: [
                "class EventEmitter {",
                "  #listeners = new Set();",
                "",
                "  subscribe(listener) {",
                "    this.#listeners.add(listener);",
                "    return () => this.#listeners.delete(listener);   // cancela a inscrição",
                "  }",
                "",
                "  emit(event) {",
                "    for (const listener of this.#listeners) listener(event);",
                "  }",
                "}",
                "",
                "const orders = new EventEmitter();",
                "",
                "// Interessados independentes se inscrevem",
                "orders.subscribe((order) => console.log(`enviar e-mail do pedido ${order.id}`));",
                "orders.subscribe((order) => console.log(`baixar estoque do pedido ${order.id}`));",
                "",
                "orders.emit({ id: 1 });   // os dois reagem; quem emite não sabe quem são",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Quem emite o pedido não menciona e-mail nem estoque. Adicionar uma nova reação é adicionar uma " +
                "inscrição, sem editar o código que gera o evento.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando várias partes independentes precisam reagir ao mesmo acontecimento, como e-mail, estoque e análise a cada pedido, sem que quem o gera as conheça.",
                "Em interfaces e em eventos de domínio, em que o conjunto de interessados muda com o tempo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações", },
            {
              type: "list",
              items: [
                "O fluxo fica implícito: quem lê `emit` não vê o que acontece em seguida, o que dificulta seguir o programa e depurá-lo.",
                "Assinaturas não canceladas mantêm objetos vivos, e isso é uma fonte clássica de vazamento de memória (Memory Leak).",
                "A ordem de notificação e o tratamento de erros precisam ser definidos: uma falha em um observador não deve impedir que os outros sejam avisados.",
                "Com um único interessado conhecido, uma chamada direta é mais simples e mais fácil de seguir.",
              ],
            },
          ],
          examples: [
            {
              title: "Cancelar a inscrição",
              context: "Quem se inscreve precisa poder sair, ou o objeto continua sendo notificado e mantido na memória.",
              code: {
                language: "javascript",
                filename: "unsubscribe.js",
                code: [
                  "const prices = new EventEmitter();",
                  "",
                  "const stop = prices.subscribe((price) => console.log(`novo preço: ${price}`));",
                  "prices.emit(10);   // \"novo preço: 10\"",
                  "",
                  "stop();            // cancela a inscrição",
                  "prices.emit(12);   // ninguém é avisado",
                ].join("\n"),
              },
              explanation:
                "Devolver a função de cancelamento em `subscribe` facilita limpar a inscrição, por exemplo quando um " +
                "componente de interface é removido. Esquecer disso é a causa mais comum de vazamento com Observer.",
            },
            {
              title: "Um observador que falha não pode derrubar os outros",
              context: "Sem cuidado, uma exceção em um observador interrompe a notificação dos demais.",
              code: {
                language: "javascript",
                filename: "isolated-errors.js",
                code: [
                  "class SafeEmitter {",
                  "  #listeners = new Set();",
                  "  subscribe(listener) { this.#listeners.add(listener); return () => this.#listeners.delete(listener); }",
                  "  emit(event) {",
                  "    for (const listener of this.#listeners) {",
                  "      try { listener(event); }",
                  "      catch (error) { console.error(\"observador falhou:\", error.message); }",
                  "    }",
                  "  }",
                  "}",
                  "",
                  "const bus = new SafeEmitter();",
                  "bus.subscribe(() => { throw new Error(\"quebrou\"); });",
                  "bus.subscribe(() => console.log(\"este ainda roda\"));",
                  "bus.emit({});",
                ].join("\n"),
              },
              explanation:
                "Com o `try/catch` por observador, a falha é registrada e a notificação continua. Sem ele, o segundo " +
                "observador nunca seria chamado.",
            },
            {
              title: "Observer já pronto na plataforma",
              context: "Navegadores e Node.js trazem o padrão embutido, e raramente é preciso escrevê-lo.",
              code: {
                language: "javascript",
                filename: "built-in.js",
                code: [
                  "// Navegador: eventos do DOM",
                  "button.addEventListener(\"click\", (event) => console.log(\"clicou\"));",
                  "",
                  "// Node.js: EventEmitter",
                  "import { EventEmitter } from \"node:events\";",
                  "const emitter = new EventEmitter();",
                  "emitter.on(\"pedido\", (order) => console.log(`pedido ${order.id}`));",
                  "emitter.emit(\"pedido\", { id: 1 });",
                ].join("\n"),
              },
              explanation:
                "Em ambos os casos, quem gera o evento não conhece quem escuta. Na prática, você usa esses " +
                "mecanismos, e escrever o seu só se justifica em um caso simples e controlado.",
            },
          ],
          exercise: {
            problem:
              "Cada vez que o carrinho muda, `addItem` chama à mão a atualização do contador, a gravação no " +
              "armazenamento e o registro de análise. Uma nova reação exige editar `addItem`.",
            problemCode: {
              language: "javascript",
              filename: "cart.js",
              code: [
                "class Cart {",
                "  items = [];",
                "  addItem(item) {",
                "    this.items.push(item);",
                "    updateBadge(this.items.length);          // interface",
                "    saveToStorage(this.items);               // persistência",
                "    trackAnalytics(\"item_added\", item);      // análise",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Observer: `Cart` emite um evento a cada mudança, e a interface, a persistência e a análise " +
              "se inscrevem, sem que o carrinho as conheça.",
            hint: "Use um emissor com `subscribe` e `emit`. O carrinho só chama `emit`, e as três reações viram inscrições.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart.fixed.js",
                code: [
                  "class Cart {",
                  "  items = [];",
                  "  changes = new EventEmitter();   // o emissor definido antes",
                  "",
                  "  addItem(item) {",
                  "    this.items.push(item);",
                  "    this.changes.emit({ type: \"item_added\", item, items: this.items });",
                  "  }",
                  "}",
                  "",
                  "const cart = new Cart();",
                  "",
                  "// Cada interessado se inscreve por conta própria",
                  "cart.changes.subscribe((event) => updateBadge(event.items.length));",
                  "cart.changes.subscribe((event) => saveToStorage(event.items));",
                  "cart.changes.subscribe((event) => trackAnalytics(event.type, event.item));",
                ].join("\n"),
              },
              explanation:
                "O carrinho só anuncia o que aconteceu. Uma nova reação, como um aviso ao usuário, é mais uma " +
                "inscrição, e `addItem` não muda.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Command",
          note: "uma ação transformada em objeto: pode ser guardada, enfileirada e desfeita",
          collision: "≠ Command-Query Separation (Design Principles) — padrão de objeto que encapsula uma ação × princípio de separar leitura de escrita",
          summary:
            "Transforma uma ação em um objeto, com tudo o que é preciso para executá-la — o que permite guardá-la, " +
            "enfileirá-la, registrá-la e até desfazê-la.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Command é um padrão comportamental que encapsula uma requisição, uma ação com os seus dados, em um " +
                "objeto com uma operação `execute()`. Quem pede a ação não a executa diretamente: cria ou recebe o " +
                "comando, e outro componente decide quando executá-lo. Como a ação virou um valor, ela pode ser " +
                "guardada, colocada em uma fila, registrada e desfeita. Não é o mesmo que Command-Query Separation: " +
                "aquele é um princípio sobre separar leitura de escrita nos métodos, e este é um padrão para " +
                "representar ações como objetos.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Trate a ação como um objeto: quem a pede fica separado de quem a executa, e ela pode ser guardada, " +
                "enfileirada, registrada ou desfeita.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada comando guarda os dados da ação e implementa `execute()`, e, quando a ação pode ser revertida, " +
                "`undo()`. Um histórico executa os comandos e mantém pilhas para desfazer e refazer.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "command.js",
              code: [
                "class InsertText {",
                "  constructor(document, text) { this.document = document; this.text = text; }",
                "  execute() { this.document.text += this.text; }",
                "  undo() { this.document.text = this.document.text.slice(0, -this.text.length); }",
                "}",
                "",
                "class History {",
                "  #done = [];",
                "  #undone = [];",
                "",
                "  run(command) {",
                "    command.execute();",
                "    this.#done.push(command);",
                "    this.#undone.length = 0;   // uma ação nova invalida o \"refazer\"",
                "  }",
                "  undo() {",
                "    const command = this.#done.pop();",
                "    if (command) { command.undo(); this.#undone.push(command); }",
                "  }",
                "  redo() {",
                "    const command = this.#undone.pop();",
                "    if (command) { command.execute(); this.#done.push(command); }",
                "  }",
                "}",
                "",
                "const doc = { text: \"\" };",
                "const history = new History();",
                "history.run(new InsertText(doc, \"Olá\"));",
                "history.run(new InsertText(doc, \", mundo\"));",
                "doc.text;         // \"Olá, mundo\"",
                "history.undo();",
                "doc.text;         // \"Olá\"",
                "history.redo();",
                "doc.text;         // \"Olá, mundo\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`History` não sabe o que cada comando faz: só o executa e o desfaz. Uma nova ação, como apagar " +
                "texto, é um novo comando, e o histórico não muda.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para desfazer e refazer, ou para manter um histórico de ações.",
                "Para enfileirar, agendar ou repetir ações, executando-as depois ou em outro lugar, como em filas de tarefas.",
                "Para desacoplar quem pede a ação de quem a executa, ou para registrar ações em um log de auditoria.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para uma ação simples chamada diretamente, o comando é indireção: uma função já resolve.",
                "Desfazer exige guardar o estado anterior ou como revertê-lo, o que consome memória e complica cada comando.",
                "Nem toda ação é reversível: um e-mail enviado ou um pagamento cobrado não podem ser desfeitos por um `undo()` local.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma fila de comandos executados depois",
              context: "Como a ação é um objeto, ela pode ser guardada agora e executada em outro momento.",
              code: {
                language: "javascript",
                filename: "queue.js",
                code: [
                  "class SendEmail {",
                  "  constructor(mailer, to, text) { Object.assign(this, { mailer, to, text }); }",
                  "  execute() { this.mailer.send(this.to, this.text); }",
                  "}",
                  "",
                  "const queue = [];",
                  "queue.push(new SendEmail(mailer, \"a@x.com\", \"Bem-vinda\"));",
                  "queue.push(new SendEmail(mailer, \"b@x.com\", \"Bem-vindo\"));",
                  "",
                  "// Mais tarde, em um worker ou em um horário de menos carga",
                  "for (const command of queue) command.execute();",
                ].join("\n"),
              },
              explanation:
                "Quem enfileirou não executou nada. Os comandos carregam tudo de que precisam, e a execução " +
                "acontece quando outro componente decidir.",
            },
            {
              title: "O comando como função",
              context: "Em JavaScript, um comando simples pode ser só um objeto com duas funções.",
              code: {
                language: "javascript",
                filename: "function-command.js",
                code: [
                  "function makeSetColor(element, color) {",
                  "  const previous = element.color;",
                  "  return {",
                  "    execute: () => { element.color = color; },",
                  "    undo: () => { element.color = previous; },   // a closure guardou o estado anterior",
                  "  };",
                  "}",
                  "",
                  "const box = { color: \"red\" };",
                  "const command = makeSetColor(box, \"blue\");",
                  "command.execute();   // box.color === \"blue\"",
                  "command.undo();      // box.color === \"red\"",
                ].join("\n"),
              },
              explanation:
                "A closure guarda o estado anterior e evita uma classe por comando. O contrato, `execute` e `undo`, é o " +
                "mesmo, e o histórico funciona igual com ambas as formas.",
            },
            {
              title: "Quando desfazer não é possível",
              context: "O contrato de `undo` precisa ser honesto sobre o que a ação permite.",
              code: {
                language: "javascript",
                filename: "irreversible.js",
                code: [
                  "class ChargeCard {",
                  "  constructor(gateway, amount) { this.gateway = gateway; this.amount = amount; }",
                  "  execute() { this.receipt = this.gateway.charge(this.amount); }",
                  "  undo() {",
                  "    // Estornar é uma nova operação, com regras, prazo e custo; não é reverter o estado local",
                  "    throw new Error(\"cobrança não pode ser desfeita; use um estorno\");",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Fingir que a ação pode ser desfeita causaria inconsistência. Ações com efeito externo pedem uma " +
                "operação compensatória própria, e não um `undo()` que só restaura variáveis locais.",
            },
          ],
          exercise: {
            problem:
              "O carrinho adiciona e remove itens diretamente, sem nenhum histórico. Não há como desfazer o último " +
              "passo do usuário.",
            problemCode: {
              language: "javascript",
              filename: "cart-actions.js",
              code: [
                "const cart = { items: [] };",
                "",
                "function addItem(item) { cart.items.push(item); }",
                "function removeItem(item) { cart.items = cart.items.filter((i) => i !== item); }",
                "",
                "addItem(\"caneta\");",
                "addItem(\"caderno\");",
                "// e agora, como desfazer o último?",
              ].join("\n"),
            },
            task:
              "Aplique Command: `AddItem` com `execute` e `undo`, e um `History` que execute e desfaça o último " +
              "comando.",
            hint: "`AddItem.undo` remove o item que ele adicionou. `History` guarda os comandos executados em uma pilha.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart-actions.fixed.js",
                code: [
                  "class AddItem {",
                  "  constructor(cart, item) { this.cart = cart; this.item = item; }",
                  "  execute() { this.cart.items.push(this.item); }",
                  "  undo() { this.cart.items.pop(); }",
                  "}",
                  "",
                  "class History {",
                  "  #done = [];",
                  "  run(command) { command.execute(); this.#done.push(command); }",
                  "  undo() { this.#done.pop()?.undo(); }",
                  "}",
                  "",
                  "const cart = { items: [] };",
                  "const history = new History();",
                  "",
                  "history.run(new AddItem(cart, \"caneta\"));",
                  "history.run(new AddItem(cart, \"caderno\"));",
                  "history.undo();",
                  "cart.items;   // [\"caneta\"]",
                ].join("\n"),
              },
              explanation:
                "Cada ação virou um objeto que sabe se executar e se desfazer, e `History` só empilha e desempilha. " +
                "Remover itens seria um `RemoveItem`, sem alterar o histórico.",
            },
          },
        }),
        concept({
          order: 40,
          title: "State",
          requires: ["Strategy"],
          note: "estruturalmente idêntico a Strategy (troca de comportamento em runtime) — ensinado em par por contraste de intenção",
          summary:
            "Permite que um objeto mude o seu comportamento quando o seu estado interno muda, delegando cada estado " +
            "a um objeto próprio que também decide as transições.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "State é um padrão comportamental para objetos cujo comportamento depende do estado em que estão: um " +
                "pedido pendente, pago ou enviado responde de modo diferente ao mesmo `cancel()`. Em vez de espalhar " +
                "`if (status === ...)` por todos os métodos, cada estado vira um objeto que implementa o comportamento " +
                "daquele estado. O objeto principal delega a chamada ao estado atual, e cada estado decide para qual " +
                "vai a seguir.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada estado é um objeto com o seu próprio comportamento, e a transição acontece por dentro: o " +
                "objeto muda de estado, e com isso muda de comportamento.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A estrutura é a mesma do Strategy: um contexto delega a um objeto trocável. A diferença está na " +
                "intenção. No Strategy, o cliente escolhe a estratégia, e ela em geral não muda sozinha. No State, o " +
                "próprio estado troca o do contexto, seguindo as regras de transição.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "state.js",
              code: [
                "class Draft {",
                "  constructor(doc) { this.doc = doc; }",
                "  edit(text) { this.doc.text = text; }",
                "  submit() { this.doc.setState(new InReview(this.doc)); }",
                "  publish() { throw new Error(\"envie para revisão antes de publicar\"); }",
                "}",
                "",
                "class InReview {",
                "  constructor(doc) { this.doc = doc; }",
                "  edit() { throw new Error(\"em revisão: não é possível editar\"); }",
                "  submit() { throw new Error(\"já está em revisão\"); }",
                "  publish() { this.doc.setState(new Published(this.doc)); }",
                "}",
                "",
                "class Published {",
                "  constructor(doc) { this.doc = doc; }",
                "  edit() { throw new Error(\"publicado: não é possível editar\"); }",
                "  submit() { throw new Error(\"já foi publicado\"); }",
                "  publish() { throw new Error(\"já foi publicado\"); }",
                "}",
                "",
                "class Doc {",
                "  text = \"\";",
                "  state = new Draft(this);",
                "  setState(state) { this.state = state; }",
                "  edit(text) { this.state.edit(text); }",
                "  submit() { this.state.submit(); }",
                "  publish() { this.state.publish(); }",
                "}",
                "",
                "const doc = new Doc();",
                "doc.edit(\"rascunho\");   // ok, no estado Draft",
                "doc.submit();            // vai para InReview",
                "doc.edit(\"x\");           // Error: em revisão: não é possível editar",
                "doc.publish();           // vai para Published",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`Doc` não tem nenhum `if` sobre o estado. As regras de cada estado, o que é permitido e para onde " +
                "se vai, ficam juntas no objeto do estado.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o comportamento de um objeto depende do estado e há vários `if` ou `switch` sobre o status repetidos em muitos métodos.",
                "Quando os estados têm regras de transição próprias, e as operações inválidas em cada estado precisam ser recusadas de forma clara.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com poucos estados e transições simples, um campo `status` com uma tabela de transições permitidas é mais direto.",
                "O número de classes cresce com os estados, e os estados que compartilham muito comportamento acabam repetindo código.",
                "As transições ficam distribuídas entre os estados, e ver o diagrama completo exige percorrer várias classes.",
              ],
            },
          ],
          examples: [
            {
              title: "A alternativa simples: tabela de transições",
              context: "Para poucos estados, os dados podem substituir as classes.",
              code: {
                language: "javascript",
                filename: "transition-table.js",
                code: [
                  "const transitions = {",
                  "  pending: [\"paid\", \"cancelled\"],",
                  "  paid: [\"shipped\", \"refunded\"],",
                  "  shipped: [\"delivered\"],",
                  "  delivered: [],",
                  "  cancelled: [],",
                  "  refunded: [],",
                  "};",
                  "",
                  "function moveTo(order, next) {",
                  "  if (!transitions[order.status].includes(next)) {",
                  "    throw new Error(`transição inválida: ${order.status} → ${next}`);",
                  "  }",
                  "  order.status = next;",
                  "}",
                  "",
                  "const order = { status: \"pending\" };",
                  "moveTo(order, \"paid\");        // ok",
                  "moveTo(order, \"delivered\");   // Error: transição inválida: paid → delivered",
                ].join("\n"),
              },
              explanation:
                "Se os estados só diferem em quais transições permitem, e não no comportamento, uma tabela é mais " +
                "simples que uma classe por estado. O padrão State compensa quando cada estado tem comportamento próprio.",
            },
            {
              title: "State e Strategy: mesma estrutura, intenções diferentes",
              context: "O que muda entre os dois é quem troca o objeto e por quê.",
              code: {
                language: "javascript",
                filename: "state-vs-strategy.js",
                code: [
                  "// Strategy: o cliente escolhe e, em geral, a estratégia não muda por conta própria",
                  "const checkout = new Checkout(memberDiscount);",
                  "",
                  "// State: o próprio objeto muda de estado como resultado de uma ação",
                  "const doc = new Doc();     // começa em Draft",
                  "doc.submit();              // agora está em InReview, e a mudança veio de dentro",
                ].join("\n"),
              },
              explanation:
                "Nos dois casos há um contexto delegando a um objeto trocável. Se a troca é uma decisão de quem usa, " +
                "é Strategy; se é uma consequência do ciclo de vida do objeto, é State.",
            },
            {
              title: "Recusar operações inválidas no estado atual",
              context: "Um benefício do padrão é que cada estado diz claramente o que não permite.",
              code: {
                language: "javascript",
                filename: "invalid-operations.js",
                code: [
                  "const doc = new Doc();",
                  "doc.publish();",
                  "// Error: envie para revisão antes de publicar — a regra vive no estado Draft",
                  "",
                  "// Sem o padrão, a mesma regra seria um `if` dentro de publish():",
                  "// if (this.status === \"draft\") throw new Error(\"envie para revisão antes de publicar\");",
                  "// e o mesmo tipo de `if` se repetiria em edit(), submit() e em todos os outros métodos",
                ].join("\n"),
              },
              explanation:
                "Cada regra aparece uma vez, no estado a que pertence, e não como um `if` repetido em todos os " +
                "métodos do objeto principal.",
            },
          ],
          exercise: {
            problem:
              "`Order` decide o que fazer com `if (this.status === …)` em cada método. Cada novo status obriga a " +
              "revisar todos os métodos.",
            problemCode: {
              language: "javascript",
              filename: "order.js",
              code: [
                "class Order {",
                "  status = \"pending\";",
                "",
                "  pay() {",
                "    if (this.status !== \"pending\") throw new Error(\"só pedidos pendentes podem ser pagos\");",
                "    this.status = \"paid\";",
                "  }",
                "  ship() {",
                "    if (this.status !== \"paid\") throw new Error(\"só pedidos pagos podem ser enviados\");",
                "    this.status = \"shipped\";",
                "  }",
                "  cancel() {",
                "    if (this.status === \"shipped\") throw new Error(\"pedido já enviado\");",
                "    this.status = \"cancelled\";",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique State: uma classe para cada estado (`Pending`, `Paid`, `Shipped`) com as operações `pay`, `ship` e " +
              "`cancel`, e faça `Order` delegar ao estado atual.",
            hint: "Cada estado implementa as três operações: as válidas fazem a transição, e as outras lançam erro.",
            solution: {
              code: {
                language: "javascript",
                filename: "order.fixed.js",
                code: [
                  "class Pending {",
                  "  constructor(order) { this.order = order; }",
                  "  pay() { this.order.setState(new Paid(this.order)); }",
                  "  ship() { throw new Error(\"só pedidos pagos podem ser enviados\"); }",
                  "  cancel() { this.order.setState(new Cancelled(this.order)); }",
                  "}",
                  "",
                  "class Paid {",
                  "  constructor(order) { this.order = order; }",
                  "  pay() { throw new Error(\"pedido já pago\"); }",
                  "  ship() { this.order.setState(new Shipped(this.order)); }",
                  "  cancel() { this.order.setState(new Cancelled(this.order)); }",
                  "}",
                  "",
                  "class Shipped {",
                  "  constructor(order) { this.order = order; }",
                  "  pay() { throw new Error(\"pedido já pago\"); }",
                  "  ship() { throw new Error(\"pedido já enviado\"); }",
                  "  cancel() { throw new Error(\"pedido já enviado\"); }",
                  "}",
                  "",
                  "class Cancelled {",
                  "  constructor(order) { this.order = order; }",
                  "  pay() { throw new Error(\"pedido cancelado\"); }",
                  "  ship() { throw new Error(\"pedido cancelado\"); }",
                  "  cancel() { throw new Error(\"pedido já cancelado\"); }",
                  "}",
                  "",
                  "class Order {",
                  "  state = new Pending(this);",
                  "  setState(state) { this.state = state; }",
                  "  pay() { this.state.pay(); }",
                  "  ship() { this.state.ship(); }",
                  "  cancel() { this.state.cancel(); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "`Order` não tem `if` de status: delega ao estado atual. As regras de cada estado ficam juntas, e um " +
                "novo estado é uma nova classe com as suas transições. A classe `Cancelled` também foi necessária, " +
                "porque o original tratava o cancelamento como um estado a mais.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Template Method",
          note: "o esqueleto do algoritmo na base, os passos nas subclasses",
          summary:
            "Define o esqueleto de um algoritmo em uma classe base e deixa que as subclasses preencham passos " +
            "específicos, sem alterar a ordem geral das etapas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Template Method é um padrão comportamental em que uma classe base define, em um método, a sequência " +
                "de um algoritmo, e delega alguns passos a métodos que as subclasses implementam ou sobrescrevem. A " +
                "ordem e a estrutura ficam na base, e cada subclasse só fornece o que varia. É o \"princípio de " +
                "Hollywood\" (Inversion of Control) em forma de herança: a classe base chama as subclasses, e não o contrário.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A classe base controla o fluxo e chama os passos; as subclasses só dizem como cada passo é feito, " +
                "sem poder mudar a ordem.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O método-modelo chama, em ordem, passos obrigatórios, que as subclasses precisam implementar, e " +
                "ganchos (hooks), que têm um comportamento padrão e podem ser sobrescritos se necessário.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "template-method.js",
              code: [
                "class DataImporter {",
                "  // Método-modelo: a sequência é fixa e vive na base",
                "  import(source) {",
                "    const raw = this.read(source);",
                "    const rows = this.parse(raw);        // passo obrigatório, definido pelas subclasses",
                "    this.validate(rows);",
                "    this.beforeSave(rows);               // gancho opcional",
                "    return this.save(rows);",
                "  }",
                "",
                "  read(source) { return source; }",
                "  parse() { throw new Error(\"a subclasse implementa parse\"); }",
                "  validate(rows) { if (rows.length === 0) throw new Error(\"nada para importar\"); }",
                "  beforeSave() {}                        // gancho: não faz nada por padrão",
                "  save(rows) { return `${rows.length} registros salvos`; }",
                "}",
                "",
                "class CsvImporter extends DataImporter {",
                "  parse(raw) { return raw.split(\"\\n\").map((line) => line.split(\",\")); }",
                "}",
                "",
                "class JsonImporter extends DataImporter {",
                "  parse(raw) { return JSON.parse(raw); }",
                "  beforeSave(rows) { console.log(`importando ${rows.length} do JSON`); }   // usa o gancho",
                "}",
                "",
                "new CsvImporter().import(\"a,b\\nc,d\");        // \"2 registros salvos\"",
                "new JsonImporter().import('[{\"id\":1}]');     // \"1 registros salvos\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As duas subclasses seguem a mesma sequência de `import`, e cada uma só define o que é diferente. A " +
                "validação e o salvamento não foram repetidos.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando várias classes seguem a mesma sequência de passos, e só alguns passos diferem, evitando duplicar o fluxo em cada uma.",
                "Quando você quer controlar o esqueleto do algoritmo e permitir pontos de extensão bem definidos, como acontece em frameworks.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Usa herança, com o acoplamento forte entre base e subclasses (Composition over Inheritance): mudar a base pode quebrar todas as subclasses.",
                "Se os passos precisam variar de forma independente, ou em tempo de execução, o Strategy, com peças recebidas, é mais flexível.",
                "Muitos passos obrigatórios tornam as subclasses trabalhosas de escrever, e uma subclasse que ignora a sequência esperada quebra o contrato da base.",
              ],
            },
          ],
          examples: [
            {
              title: "Ganchos opcionais",
              context: "Um gancho é um passo com comportamento padrão vazio, que a subclasse sobrescreve só se precisar.",
              code: {
                language: "javascript",
                filename: "hook.js",
                code: [
                  "class Job {",
                  "  run() {",
                  "    this.onStart();       // gancho",
                  "    const result = this.execute();",
                  "    this.onFinish(result); // gancho",
                  "    return result;",
                  "  }",
                  "  execute() { throw new Error(\"obrigatório\"); }",
                  "  onStart() {}",
                  "  onFinish() {}",
                  "}",
                  "",
                  "class SilentJob extends Job { execute() { return 42; } }   // só o obrigatório",
                  "class LoggedJob extends Job {",
                  "  execute() { return 42; }",
                  "  onFinish(result) { console.log(`terminou com ${result}`); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "`SilentJob` implementa só o passo obrigatório, e `LoggedJob` acrescenta um gancho. A base não precisa " +
                "saber quais subclasses usam quais ganchos.",
            },
            {
              title: "A alternativa por composição",
              context: "Os mesmos passos podem ser recebidos como funções, sem herança.",
              code: {
                language: "javascript",
                filename: "composition-alternative.js",
                code: [
                  "function runImport(source, { parse, validate = defaultValidate, save = defaultSave }) {",
                  "  const rows = parse(source);",
                  "  validate(rows);",
                  "  return save(rows);",
                  "}",
                  "",
                  "const defaultValidate = (rows) => { if (rows.length === 0) throw new Error(\"nada para importar\"); };",
                  "const defaultSave = (rows) => `${rows.length} registros salvos`;",
                  "",
                  "runImport(\"a,b\\nc,d\", { parse: (raw) => raw.split(\"\\n\").map((line) => line.split(\",\")) });",
                ].join("\n"),
              },
              explanation:
                "O esqueleto continua fixo em `runImport`, e os passos entram como funções. É Strategy aplicado a " +
                "cada etapa: mais flexível que herança, e em geral a forma preferida em JavaScript.",
            },
            {
              title: "A subclasse que quebra o esqueleto",
              context: "O padrão só protege o fluxo por convenção; nada impede uma subclasse de sobrescrever o método-modelo.",
              code: {
                language: "javascript",
                filename: "broken-skeleton.js",
                code: [
                  "class BadImporter extends DataImporter {",
                  "  // Sobrescreve o método-modelo e pula a validação",
                  "  import(source) {",
                  "    const rows = this.parse(this.read(source));",
                  "    return this.save(rows);",
                  "  }",
                  "  parse(raw) { return JSON.parse(raw); }",
                  "}",
                  "",
                  "new BadImporter().import(\"[]\");   // \"0 registros salvos\" — a validação foi ignorada",
                ].join("\n"),
              },
              explanation:
                "JavaScript não tem como declarar o método-modelo como final. A proteção depende de disciplina e de " +
                "revisão, e é outro motivo pelo qual a composição costuma ser mais segura.",
            },
          ],
          exercise: {
            problem:
              "Os dois relatórios repetem o mesmo fluxo de carregar, filtrar, formatar e imprimir, diferindo só no " +
              "carregamento e no formato. Uma correção no filtro precisa ser feita nos dois.",
            problemCode: {
              language: "javascript",
              filename: "reports.js",
              code: [
                "class SalesReport {",
                "  generate() {",
                "    const rows = [{ total: 100 }, { total: 0 }, { total: 50 }];   // carrega vendas",
                "    const filtered = rows.filter((row) => row.total > 0);",
                "    const text = filtered.map((row) => `venda: ${row.total}`).join(\"\\n\");",
                "    console.log(text);",
                "  }",
                "}",
                "",
                "class StockReport {",
                "  generate() {",
                "    const rows = [{ total: 7 }, { total: 0 }];                     // carrega estoque",
                "    const filtered = rows.filter((row) => row.total > 0);",
                "    const text = filtered.map((row) => `em estoque: ${row.total}`).join(\"\\n\");",
                "    console.log(text);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Template Method: uma classe base `Report` com o fluxo em `generate()`, e as subclasses " +
              "implementando só `load()` e `format(row)`.",
            hint: "O filtro e a impressão ficam na base. `load` e `format` são os passos que cada subclasse define.",
            solution: {
              code: {
                language: "javascript",
                filename: "reports.fixed.js",
                code: [
                  "class Report {",
                  "  generate() {                                       // método-modelo",
                  "    const rows = this.load();",
                  "    const filtered = rows.filter((row) => row.total > 0);",
                  "    const text = filtered.map((row) => this.format(row)).join(\"\\n\");",
                  "    console.log(text);",
                  "  }",
                  "  load() { throw new Error(\"a subclasse implementa load\"); }",
                  "  format() { throw new Error(\"a subclasse implementa format\"); }",
                  "}",
                  "",
                  "class SalesReport extends Report {",
                  "  load() { return [{ total: 100 }, { total: 0 }, { total: 50 }]; }",
                  "  format(row) { return `venda: ${row.total}`; }",
                  "}",
                  "",
                  "class StockReport extends Report {",
                  "  load() { return [{ total: 7 }, { total: 0 }]; }",
                  "  format(row) { return `em estoque: ${row.total}`; }",
                  "}",
                  "",
                  "new SalesReport().generate();",
                ].join("\n"),
              },
              explanation:
                "O filtro e a impressão existem uma vez, na base, e uma correção vale para os dois relatórios. Cada " +
                "subclasse só define o que é diferente, o carregamento e o formato.",
            },
          },
        }),
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
        concept({
          order: 10,
          title: "Repository Pattern",
          note: "abstrai o acesso a dados atrás de uma interface de coleção",
          summary:
            "Faz o acesso aos dados parecer uma coleção de objetos do domínio — `add`, `findById`, `remove` —, " +
            "escondendo por trás dela como e onde eles são guardados.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Repository é um padrão que oferece ao domínio uma interface de coleção para obter e guardar objetos: " +
                "\"me dê o usuário com este id\", \"adicione este pedido\". O código de negócio fala com o repositório " +
                "nos termos do domínio, e o repositório cuida de traduzir isso para SQL, HTTP, arquivos ou memória. " +
                "É a aplicação de Program to an Interface ao acesso a dados, e a forma comum de seguir o Dependency " +
                "Inversion Principle na fronteira com o banco (Database Fundamentals).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O domínio enxerga uma coleção de objetos, e não um banco: como e onde eles são guardados é um " +
                "detalhe atrás do repositório.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Define-se o contrato do repositório com operações no vocabulário do domínio. Cada implementação, " +
                "SQL, memória, API, cumpre o contrato. Quem usa recebe o repositório por injeção " +
                "(Dependency Injection) e nunca importa o banco.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "repository.js",
              code: [
                "// Contrato: UserRepository { add(user), findById(id), findByEmail(email), remove(id) }",
                "",
                "// Implementação em memória",
                "class InMemoryUserRepository {",
                "  #users = new Map();",
                "  add(user) { this.#users.set(user.id, user); }",
                "  findById(id) { return this.#users.get(id) ?? null; }",
                "  findByEmail(email) { return [...this.#users.values()].find((u) => u.email === email) ?? null; }",
                "  remove(id) { this.#users.delete(id); }",
                "}",
                "",
                "// Implementação em SQL: o mesmo contrato, outro detalhe",
                "class SqlUserRepository {",
                "  constructor(db) { this.db = db; }",
                "  async findById(id) {",
                "    const row = await this.db.queryOne(\"SELECT * FROM users WHERE id = ?\", [id]);",
                "    return row ? { id: row.id, email: row.email } : null;",
                "  }",
                "  // add, findByEmail e remove seguem o mesmo esquema",
                "}",
                "",
                "// O caso de uso só conhece o contrato",
                "class RegisterUser {",
                "  constructor(users) { this.users = users; }",
                "  execute({ id, email }) {",
                "    if (this.users.findByEmail(email)) throw new Error(\"e-mail já cadastrado\");",
                "    this.users.add({ id, email });",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`RegisterUser` funciona com o repositório em memória ou com o de SQL, sem mudar. As regras do " +
                "negócio não citam tabelas, colunas nem consultas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o código de domínio não deve conhecer o banco, e você quer testá-lo com um repositório em memória, sem infraestrutura.",
                "Quando há chance real de trocar a forma de armazenamento, ou de ter mais de uma, como banco e cache.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se o ORM já oferece uma interface de coleção adequada e você não pretende trocá-lo, o repositório pode ser uma camada duplicada sem ganho.",
                "Um repositório que expõe consultas genéricas, como `query(sql)`, vaza a persistência para o domínio e perde o sentido.",
                "Um método para cada consulta possível faz o contrato crescer sem parar; considere um Specification para as consultas combináveis.",
                "Consultas de relatório, com junções pesadas, costumam ficar melhor fora do repositório do domínio.",
              ],
            },
          ],
          examples: [
            {
              title: "O repositório em memória nos testes",
              context: "Com o contrato, o teste do caso de uso não precisa de banco.",
              code: {
                language: "javascript",
                filename: "test-with-memory.js",
                code: [
                  "const users = new InMemoryUserRepository();",
                  "const register = new RegisterUser(users);",
                  "",
                  "register.execute({ id: 1, email: \"ana@x.com\" });",
                  "users.findById(1);   // { id: 1, email: \"ana@x.com\" }",
                  "",
                  "register.execute({ id: 2, email: \"ana@x.com\" });   // Error: e-mail já cadastrado",
                ].join("\n"),
              },
              explanation:
                "O teste roda em milissegundos e sem preparar um banco. É o mesmo benefício de um Fake (Test Doubles) " +
                "aplicado à persistência.",
            },
            {
              title: "Vocabulário do domínio, e não da persistência",
              context: "As operações do repositório devem dizer o que o negócio precisa, e não como o banco consulta.",
              code: {
                language: "javascript",
                filename: "domain-vocabulary.js",
                code: [
                  "// Vaza a persistência: quem usa monta consultas e conhece tabelas",
                  "// users.query(\"SELECT * FROM users WHERE active = 1 AND created_at < ?\", [date]);",
                  "",
                  "// Vocabulário do domínio: a intenção está no nome",
                  "// users.findInactiveSince(date);",
                  "",
                  "class InMemoryUserRepository {",
                  "  #users = [];",
                  "  add(user) { this.#users.push(user); }",
                  "  findInactiveSince(date) { return this.#users.filter((u) => u.lastLogin < date); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Quem chama `findInactiveSince` não sabe se há SQL por trás. Se o repositório aceitasse SQL, o domínio " +
                "voltaria a depender do banco.",
            },
            {
              title: "Um repositório por conceito do domínio",
              context: "A divisão acompanha o negócio, e não as tabelas do banco.",
              code: {
                language: "javascript",
                filename: "per-concept.js",
                code: [
                  "// Um pedido e os seus itens são um só conceito de domínio, mesmo estando em duas tabelas",
                  "class OrderRepository {",
                  "  add(order) { /* grava em `orders` e em `order_items` */ }",
                  "  findById(id) { /* reconstrói o pedido com os seus itens */ }",
                  "}",
                  "",
                  "// Não: um repositório para cada tabela, e o código de negócio precisa juntá-los",
                  "// class OrderRowRepository {}",
                  "// class OrderItemRowRepository {}",
                ].join("\n"),
              },
              explanation:
                "O repositório entrega e recebe o pedido completo. Como isso é guardado, em uma ou em várias tabelas, " +
                "é problema dele, e não de quem usa.",
            },
          ],
          exercise: {
            problem:
              "`CancelOrder` escreve SQL diretamente. Não dá para testá-lo sem um banco, e qualquer mudança no " +
              "esquema exige editar o caso de uso.",
            problemCode: {
              language: "javascript",
              filename: "cancel-order.js",
              code: [
                "class CancelOrder {",
                "  constructor(db) { this.db = db; }",
                "  async execute(orderId) {",
                "    const row = await this.db.queryOne(\"SELECT * FROM orders WHERE id = ?\", [orderId]);",
                "    if (!row) throw new Error(\"pedido não encontrado\");",
                "    if (row.status === \"shipped\") throw new Error(\"pedido já enviado\");",
                "    await this.db.run(\"UPDATE orders SET status = 'cancelled' WHERE id = ?\", [orderId]);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Introduza um `OrderRepository` com `findById` e `save`, faça `CancelOrder` depender só dele e mostre " +
              "uma versão em memória para testar.",
            hint: "As consultas SQL vão para a implementação do repositório; o caso de uso trabalha com o pedido e as suas regras.",
            solution: {
              code: {
                language: "javascript",
                filename: "cancel-order.fixed.js",
                code: [
                  "class CancelOrder {",
                  "  constructor(orders) { this.orders = orders; }",
                  "  async execute(orderId) {",
                  "    const order = await this.orders.findById(orderId);",
                  "    if (!order) throw new Error(\"pedido não encontrado\");",
                  "    if (order.status === \"shipped\") throw new Error(\"pedido já enviado\");",
                  "    order.status = \"cancelled\";",
                  "    await this.orders.save(order);",
                  "  }",
                  "}",
                  "",
                  "// Teste: repositório em memória, sem banco",
                  "class InMemoryOrderRepository {",
                  "  #orders = new Map();",
                  "  constructor(initial = []) { initial.forEach((o) => this.#orders.set(o.id, o)); }",
                  "  async findById(id) { return this.#orders.get(id) ?? null; }",
                  "  async save(order) { this.#orders.set(order.id, order); }",
                  "}",
                  "",
                  "const orders = new InMemoryOrderRepository([{ id: 1, status: \"pending\" }]);",
                  "await new CancelOrder(orders).execute(1);",
                  "(await orders.findById(1)).status;   // \"cancelled\"",
                ].join("\n"),
              },
              explanation:
                "`CancelOrder` deixou de conhecer SQL, e a regra \"pedido enviado não cancela\" pode ser testada sem " +
                "banco. A versão de produção do repositório traz as consultas.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Data Mapper",
          requires: ["Repository Pattern"],
          note: "separa o objeto de domínio da forma como é persistido",
          summary:
            "Uma camada de mapeamento que move dados entre os objetos de domínio e o banco, para que o objeto de " +
            "domínio não saiba nada sobre como é persistido.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Data Mapper é um padrão em que um componente separado, o mapper, converte entre o objeto de domínio " +
                "e a representação persistida, linhas, documentos, colunas. O objeto de domínio fica livre de " +
                "persistência: não tem `save()`, não conhece nomes de coluna, nem o banco. É o que permite um Rich " +
                "Domain Model sem que ele dependa da infraestrutura, e costuma ser usado dentro do Repository.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O objeto de domínio não sabe como é guardado: um mapper traduz nos dois sentidos, entre o modelo do " +
                "negócio e o formato do banco.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O mapper tem uma função para reconstruir o objeto de domínio a partir do dado persistido e outra " +
                "para o caminho inverso. O repositório usa o mapper: lê a linha, chama `toDomain`; ao salvar, chama " +
                "`toRow`.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "data-mapper.js",
              code: [
                "// Domínio: comportamento e regras, sem persistência",
                "class Customer {",
                "  constructor(id, firstName, lastName, joinedAt) {",
                "    Object.assign(this, { id, firstName, lastName, joinedAt });",
                "  }",
                "  get fullName() { return `${this.firstName} ${this.lastName}`; }",
                "  isVeteran(now = new Date()) { return now.getFullYear() - this.joinedAt.getFullYear() >= 5; }",
                "}",
                "",
                "// Mapper: conhece as colunas e faz a conversão nos dois sentidos",
                "const CustomerMapper = {",
                "  toDomain(row) {",
                "    return new Customer(row.id, row.first_name, row.last_name, new Date(row.joined_at));",
                "  },",
                "  toRow(customer) {",
                "    return {",
                "      id: customer.id,",
                "      first_name: customer.firstName,",
                "      last_name: customer.lastName,",
                "      joined_at: customer.joinedAt.toISOString(),",
                "    };",
                "  },",
                "};",
                "",
                "const row = { id: 1, first_name: \"Ana\", last_name: \"Souza\", joined_at: \"2019-03-01T00:00:00.000Z\" };",
                "const customer = CustomerMapper.toDomain(row);",
                "customer.fullName;                            // \"Ana Souza\"",
                "CustomerMapper.toRow(customer).first_name;   // \"Ana\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`Customer` usa `firstName` e `joinedAt` (um `Date`); o banco usa `first_name` e uma string. A " +
                "diferença fica inteira no mapper, e o domínio não sabe que ela existe.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o modelo de domínio é rico e o esquema do banco difere dele, em nomes, em tipos ou em estrutura, como um objeto guardado em várias tabelas.",
                "Quando você quer testar o domínio sem banco e manter as regras livres de detalhes de persistência.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "É código extra para escrever e manter, e cada mudança de campo passa pelo objeto, pelo mapper e pelo esquema.",
                "Quando as tabelas e os objetos são praticamente iguais e o domínio é simples, o Active Record é mais direto.",
                "ORMs como TypeORM e Hibernate já implementam Data Mapper: escrever os seus próprios mappers por cima é, em geral, duplicação.",
              ],
            },
          ],
          examples: [
            {
              title: "Value Object montado a partir de várias colunas",
              context: "O mapper também agrupa colunas soltas em conceitos do domínio.",
              code: {
                language: "javascript",
                filename: "value-object-mapping.js",
                code: [
                  "class Money {",
                  "  constructor(cents, currency) { this.cents = cents; this.currency = currency; }",
                  "  format() { return `${(this.cents / 100).toFixed(2)} ${this.currency}`; }",
                  "}",
                  "",
                  "const ProductMapper = {",
                  "  toDomain: (row) => ({",
                  "    id: row.id,",
                  "    name: row.name,",
                  "    price: new Money(row.price_cents, row.price_currency),   // duas colunas → um Value Object",
                  "  }),",
                  "  toRow: (product) => ({",
                  "    id: product.id,",
                  "    name: product.name,",
                  "    price_cents: product.price.cents,",
                  "    price_currency: product.price.currency,",
                  "  }),",
                  "};",
                  "",
                  "ProductMapper.toDomain({ id: 1, name: \"Caneta\", price_cents: 550, price_currency: \"BRL\" }).price.format();",
                  "// \"5.50 BRL\"",
                ].join("\n"),
              },
              explanation:
                "O banco guarda duas colunas, e o domínio trabalha com um `Money`. Quem usa `Product` nunca vê " +
                "`price_cents`.",
            },
            {
              title: "Testar o domínio sem banco",
              context: "Como o domínio não conhece a persistência, ele se testa com objetos comuns.",
              code: {
                language: "javascript",
                filename: "domain-test.js",
                code: [
                  "const veteran = new Customer(1, \"Ana\", \"Souza\", new Date(\"2015-01-01\"));",
                  "const newcomer = new Customer(2, \"Bia\", \"Lima\", new Date(\"2025-06-01\"));",
                  "",
                  "veteran.isVeteran(new Date(\"2026-01-01\"));    // true",
                  "newcomer.isVeteran(new Date(\"2026-01-01\"));   // false",
                ].join("\n"),
              },
              explanation:
                "Nenhuma conexão, nenhuma linha, nenhum mock de banco. A separação feita pelo mapper é o que torna " +
                "essa simplicidade possível.",
            },
            {
              title: "Restaurar um objeto sem repetir a criação",
              context: "Reconstruir a partir do banco não é o mesmo que criar um objeto novo.",
              code: {
                language: "javascript",
                filename: "restore.js",
                code: [
                  "class Account {",
                  "  constructor(id, balance) { this.id = id; this.balance = balance; }",
                  "",
                  "  // Criação de uma conta nova: aplica as regras de abertura",
                  "  static open(id) { return new Account(id, 0); }",
                  "",
                  "  // Reconstrução a partir do banco: o estado já foi validado antes de ser gravado",
                  "  static restore(id, balance) { return new Account(id, balance); }",
                  "}",
                  "",
                  "const AccountMapper = {",
                  "  toDomain: (row) => Account.restore(row.id, row.balance),",
                  "};",
                ].join("\n"),
              },
              explanation:
                "Uma conta com saldo de 500 é válida ao ser lida do banco, mas `open` sempre a criaria zerada. Ter uma " +
                "via própria para restaurar evita que as regras de criação sejam aplicadas à toa.",
            },
          ],
          exercise: {
            problem:
              "O banco guarda `name`, `email_address` e `created_at` (texto), mas o domínio usa `displayName`, " +
              "`email` e `createdAt` (um `Date`). Hoje cada consulta faz essa conversão à mão.",
            problemCode: {
              language: "javascript",
              filename: "member.js",
              code: [
                "class Member {",
                "  constructor(id, displayName, email, createdAt) {",
                "    Object.assign(this, { id, displayName, email, createdAt });",
                "  }",
                "}",
                "",
                "// Repetido em cada consulta",
                "const row = { id: 3, name: \"Caio\", email_address: \"caio@x.com\", created_at: \"2024-05-10T12:00:00.000Z\" };",
                "const member = new Member(row.id, row.name, row.email_address, new Date(row.created_at));",
              ].join("\n"),
            },
            task:
              "Escreva um `MemberMapper` com `toDomain(row)` e `toRow(member)`, que convertam nos dois sentidos, e " +
              "mostre que ida e volta preservam os dados.",
            hint: "`toRow` faz o inverso: `displayName → name`, `email → email_address` e o `Date` volta a ser uma string ISO.",
            solution: {
              code: {
                language: "javascript",
                filename: "member.fixed.js",
                code: [
                  "const MemberMapper = {",
                  "  toDomain: (row) => new Member(row.id, row.name, row.email_address, new Date(row.created_at)),",
                  "  toRow: (member) => ({",
                  "    id: member.id,",
                  "    name: member.displayName,",
                  "    email_address: member.email,",
                  "    created_at: member.createdAt.toISOString(),",
                  "  }),",
                  "};",
                  "",
                  "const row = { id: 3, name: \"Caio\", email_address: \"caio@x.com\", created_at: \"2024-05-10T12:00:00.000Z\" };",
                  "const roundTrip = MemberMapper.toRow(MemberMapper.toDomain(row));",
                  "JSON.stringify(roundTrip) === JSON.stringify(row);   // true",
                ].join("\n"),
              },
              explanation:
                "A conversão passou a viver em um só lugar, nos dois sentidos, e o teste de ida e volta mostra que nada " +
                "se perde. O restante do código usa apenas `Member`.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Active Record",
          requires: ["Repository Pattern"],
          note: "contraste direto com Data Mapper — o objeto que se persiste",
          summary:
            "O próprio objeto de domínio sabe como se carregar e se salvar no banco — cada instância corresponde a " +
            "uma linha, e tem métodos como `save()` e `find()`.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Active Record é um padrão em que uma classe representa uma linha de uma tabela e junta os dados, a " +
                "lógica de negócio e a persistência: `user.save()`, `User.find(id)`. Não há um mapper separado, porque " +
                "o objeto conhece o seu próprio esquema. É o oposto do Data Mapper e a escolha de frameworks como " +
                "Rails e de muitas bibliotecas de ORM em JavaScript.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O objeto que representa a linha também sabe se gravar e se buscar: menos peças e menos código, ao " +
                "custo de misturar domínio e persistência.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A classe tem métodos estáticos para consultar (`find`) e métodos de instância para gravar (`save`, " +
                "`delete`), e os seus campos correspondem às colunas. O acesso ao banco costuma ser feito por uma " +
                "conexão compartilhada.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "active-record.js",
              code: [
                "// Um \"banco\" mínimo em memória para o exemplo",
                "const table = new Map();",
                "let nextId = 1;",
                "",
                "class User {",
                "  constructor({ id = null, name, email }) {",
                "    this.id = id;",
                "    this.name = name;",
                "    this.email = email;",
                "  }",
                "",
                "  static find(id) {",
                "    const row = table.get(id);",
                "    return row ? new User(row) : null;",
                "  }",
                "",
                "  save() {                               // o próprio objeto se persiste",
                "    if (this.id === null) this.id = nextId++;",
                "    table.set(this.id, { id: this.id, name: this.name, email: this.email });",
                "    return this;",
                "  }",
                "",
                "  delete() { table.delete(this.id); }",
                "",
                "  // lógica de negócio na mesma classe",
                "  hasCorporateEmail() { return this.email.endsWith(\"@empresa.com\"); }",
                "}",
                "",
                "const user = new User({ name: \"Ana\", email: \"ana@empresa.com\" }).save();",
                "User.find(user.id).hasCorporateEmail();   // true",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Não há repositório nem mapper: a classe `User` faz tudo. É rápido de escrever e fácil de entender " +
                "para um cadastro simples.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em aplicações de cadastro (CRUD) com pouca regra de negócio, em que a estrutura dos objetos acompanha a das tabelas.",
                "Quando a velocidade de desenvolvimento importa mais que a separação de camadas, e o framework já o oferece.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Mistura duas responsabilidades, regras de negócio e persistência, e à medida que as regras crescem a classe fica difícil de manter (Single Responsibility Principle).",
                "Acoplar o objeto ao esquema dificulta testar o domínio sem banco, e o acesso costuma ser global e estático.",
                "O modelo de objetos fica preso ao formato das tabelas; um domínio rico com estruturas diferentes das tabelas é melhor servido por Data Mapper.",
              ],
            },
          ],
          examples: [
            {
              title: "O dia a dia com Active Record",
              context: "O ciclo completo cabe em poucas linhas, e esse é o seu maior atrativo.",
              code: {
                language: "javascript",
                filename: "usage.js",
                code: [
                  "const ana = new User({ name: \"Ana\", email: \"ana@empresa.com\" });",
                  "ana.save();                     // insere e atribui o id",
                  "",
                  "const found = User.find(ana.id);",
                  "found.name = \"Ana Souza\";",
                  "found.save();                   // atualiza",
                  "",
                  "found.delete();",
                  "User.find(ana.id);              // null",
                ].join("\n"),
              },
              explanation:
                "Criar, ler, atualizar e apagar não exigem nenhuma outra classe. Para cadastros simples, essa " +
                "economia é real.",
            },
            {
              title: "O acesso estático e o teste",
              context: "Como o banco é acessado dentro da classe, trocar ou isolar o armazenamento é difícil.",
              code: {
                language: "javascript",
                filename: "test-difficulty.js",
                code: [
                  "// A regra de negócio mora na mesma classe que grava no banco",
                  "class Order {",
                  "  constructor(items) { this.items = items; }",
                  "  total() { return this.items.reduce((sum, i) => sum + i.price, 0); }",
                  "  save() { db.insert(\"orders\", this); }   // depende de um `db` global",
                  "}",
                  "",
                  "// total() pode ser testado sozinho, mas qualquer teste que chame save() precisa de um banco",
                  "new Order([{ price: 10 }, { price: 5 }]).total();   // 15",
                ].join("\n"),
              },
              explanation:
                "Os métodos puros ainda são fáceis de testar. O problema é tudo que passa por `save()`: sem injeção, " +
                "o teste depende do banco global.",
            },
            {
              title: "Quando a classe começa a inchar",
              context: "O sinal para migrar é a lógica de negócio crescendo dentro do objeto que também persiste.",
              code: {
                language: "javascript",
                filename: "growing.js",
                code: [
                  "// Sinais de que o Active Record ficou pequeno para o domínio:",
                  "class Invoice {",
                  "  save() { /* persistência */ }",
                  "  calculateTaxes() { /* regras fiscais complexas */ }",
                  "  applyDiscounts() { /* regras comerciais */ }",
                  "  toPdf() { /* apresentação */ }",
                  "  sendByEmail() { /* infraestrutura */ }",
                  "}",
                  "",
                  "// Caminho de saída: separar regras (domínio) de persistência (repositório + mapper)",
                ].join("\n"),
              },
              explanation:
                "Quando a mesma classe muda por causa de regras fiscais, de formato do PDF e do banco, ela tem várias " +
                "razões para mudar. É a hora de separar as responsabilidades.",
            },
          ],
          exercise: {
            problem:
              "A classe `Note` mistura o dado, uma regra de negócio e a gravação no banco. Os testes da regra " +
              "dependem de um banco global.",
            problemCode: {
              language: "javascript",
              filename: "note.js",
              code: [
                "class Note {",
                "  constructor(id, text) { this.id = id; this.text = text; }",
                "  isTooLong() { return this.text.length > 280; }",
                "  save() { db.set(this.id, { id: this.id, text: this.text }); }",
                "  static find(id) { const row = db.get(id); return row ? new Note(row.id, row.text) : null; }",
                "}",
              ].join("\n"),
            },
            task:
              "Separe a persistência: `Note` fica só com dados e regras, e um `NoteRepository` recebe o banco e faz " +
              "`save` e `find`.",
            hint: "Mova `save` e `find` para o repositório, e injete o banco em seu construtor, no lugar do `db` global.",
            solution: {
              code: {
                language: "javascript",
                filename: "note.fixed.js",
                code: [
                  "class Note {",
                  "  constructor(id, text) { this.id = id; this.text = text; }",
                  "  isTooLong() { return this.text.length > 280; }",
                  "}",
                  "",
                  "class NoteRepository {",
                  "  constructor(db) { this.db = db; }",
                  "  save(note) { this.db.set(note.id, { id: note.id, text: note.text }); }",
                  "  find(id) {",
                  "    const row = this.db.get(id);",
                  "    return row ? new Note(row.id, row.text) : null;",
                  "  }",
                  "}",
                  "",
                  "// A regra se testa sem banco",
                  "new Note(1, \"x\".repeat(300)).isTooLong();   // true",
                  "",
                  "// E a persistência se testa com um banco em memória",
                  "const repository = new NoteRepository(new Map());",
                  "repository.save(new Note(1, \"olá\"));",
                  "repository.find(1).text;   // \"olá\"",
                ].join("\n"),
              },
              explanation:
                "`Note` não sabe mais que existe um banco, e o repositório recebe o banco de fora. É o caminho do " +
                "Active Record para o Repository com Data Mapper, quando o domínio pede.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Unit of Work",
          requires: ["Repository Pattern"],
          note: "agrupa mudanças numa única transação lógica",
          summary:
            "Acompanha todas as mudanças feitas em objetos durante uma operação de negócio e as grava juntas, em " +
            "uma única transação — ou tudo é salvo, ou nada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Unit of Work registra o que foi criado, alterado e removido durante uma operação de negócio e, no " +
                "final, grava tudo de uma vez em uma transação. Em vez de cada mudança ir imediatamente ao banco, elas " +
                "se acumulam e são confirmadas com um `commit()`. Se algo falha no meio, nada é gravado. É a base do " +
                "que ORMs oferecem como sessão, contexto ou gerenciador de entidades (Database Fundamentals, transações).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Acumule as mudanças de uma operação e grave todas juntas, em uma transação: ou tudo é salvo, ou " +
                "nada é.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O objeto guarda listas de novos, alterados e removidos. Ao chamar `commit()`, abre uma transação, " +
                "aplica cada mudança e a confirma, ou a desfaz se qualquer passo falhar.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "unit-of-work.js",
              code: [
                "// Um banco mínimo, com transação que desfaz tudo em caso de erro",
                "class FakeDb {",
                "  data = new Map();",
                "  async transaction(work) {",
                "    const snapshot = new Map(this.data);",
                "    try { await work(this); }",
                "    catch (error) { this.data = snapshot; throw error; }   // rollback",
                "  }",
                "}",
                "",
                "class UnitOfWork {",
                "  #created = [];",
                "  #changed = new Set();",
                "  #removed = [];",
                "",
                "  constructor(db) { this.db = db; }",
                "",
                "  registerNew(entity) { this.#created.push(entity); }",
                "  registerDirty(entity) { this.#changed.add(entity); }",
                "  registerRemoved(entity) { this.#removed.push(entity); }",
                "",
                "  async commit() {",
                "    await this.db.transaction(async (db) => {",
                "      for (const e of this.#created) db.data.set(e.id, { ...e });",
                "      for (const e of this.#changed) db.data.set(e.id, { ...e });",
                "      for (const e of this.#removed) db.data.delete(e.id);",
                "    });",
                "    this.#created = []; this.#changed.clear(); this.#removed = [];",
                "  }",
                "}",
                "",
                "const db = new FakeDb();",
                "const uow = new UnitOfWork(db);",
                "uow.registerNew({ id: 1, name: \"Ana\" });",
                "uow.registerNew({ id: 2, name: \"Bia\" });",
                "// nada foi gravado ainda",
                "await uow.commit();   // as duas são gravadas juntas",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Até o `commit`, o banco não vê nada. No `commit`, todas as mudanças são aplicadas em uma única " +
                "transação, e uma falha as desfaz por inteiro.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando uma operação altera vários objetos que precisam ser gravados juntos, como uma transferência que debita uma conta e credita outra.",
                "Quando você quer reduzir as idas ao banco, agrupando as gravações em um único momento.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para uma única gravação simples, uma transação direta é suficiente e mais clara.",
                "Rastrear as mudanças tem custo, e uma unidade de trabalho de vida longa acumula objetos na memória e pode operar sobre dados desatualizados.",
                "Se o ORM já fornece esse mecanismo (a sessão do SQLAlchemy, o `DbContext` do .NET), não reimplemente: use o dele.",
              ],
            },
          ],
          examples: [
            {
              title: "Tudo ou nada",
              context: "O valor do padrão aparece quando algo falha no meio da operação.",
              code: {
                language: "javascript",
                filename: "rollback.js",
                code: [
                  "const db = new FakeDb();",
                  "const uow = new UnitOfWork(db);",
                  "",
                  "uow.registerNew({ id: 1, name: \"Ana\" });",
                  "uow.registerNew({ id: 2, name: \"Bia\" });",
                  "",
                  "// Simula uma falha na gravação do segundo registro",
                  "const originalTransaction = db.transaction.bind(db);",
                  "db.transaction = (work) => originalTransaction(async (d) => {",
                  "  await work(d);",
                  "  throw new Error(\"falha ao confirmar\");",
                  "});",
                  "",
                  "try { await uow.commit(); } catch {}",
                  "db.data.size;   // 0 — a transação foi desfeita, nada ficou gravado",
                ].join("\n"),
              },
              explanation:
                "Mesmo com os dois registros já aplicados dentro da transação, a falha desfaz tudo. Sem o padrão, o " +
                "primeiro poderia ter sido gravado e o segundo não.",
            },
            {
              title: "Gravar de uma vez, e não a cada mudança",
              context: "Acumular as mudanças evita várias idas ao banco.",
              code: {
                language: "javascript",
                filename: "batching.js",
                code: [
                  "// Sem Unit of Work: uma gravação para cada alteração",
                  "// for (const item of items) await db.insert(item);   // N idas ao banco",
                  "",
                  "// Com Unit of Work: registra e confirma uma vez",
                  "const uow = new UnitOfWork(db);",
                  "for (const item of items) uow.registerNew(item);",
                  "await uow.commit();   // uma transação",
                ].join("\n"),
              },
              explanation:
                "Além da consistência, agrupar reduz o custo de comunicação. Em bancos reais, os ORMs ainda ordenam " +
                "as operações para respeitar as dependências entre elas.",
            },
            {
              title: "O mesmo padrão nos ORMs",
              context: "Você raramente escreve o seu: as ferramentas de persistência já trazem um.",
              code: {
                language: "javascript",
                filename: "orm-equivalents.js",
                code: [
                  "// Prisma: uma transação agrupa as operações",
                  "await prisma.$transaction([",
                  "  prisma.account.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } }),",
                  "  prisma.account.update({ where: { id: 2 }, data: { balance: { increment: 100 } } }),",
                  "]);",
                  "",
                  "// Outros ORMs: Session (SQLAlchemy, Hibernate), DbContext (.NET), EntityManager (TypeORM)",
                ].join("\n"),
              },
              explanation:
                "Entender o padrão ajuda a usar bem essas ferramentas, sabendo o que elas rastreiam e quando " +
                "confirmam, sem precisar reescrevê-las.",
            },
          ],
          exercise: {
            problem:
              "A transferência grava a conta de origem e a de destino em passos separados. Se o segundo falhar, o " +
              "dinheiro sai de uma conta e não entra na outra.",
            problemCode: {
              language: "javascript",
              filename: "transfer.js",
              code: [
                "async function transfer(accounts, fromId, toId, amount) {",
                "  const from = await accounts.findById(fromId);",
                "  const to = await accounts.findById(toId);",
                "",
                "  from.balance -= amount;",
                "  await accounts.save(from);   // gravado imediatamente",
                "",
                "  to.balance += amount;",
                "  await accounts.save(to);     // se falhar aqui, o dinheiro sumiu",
                "}",
              ].join("\n"),
            },
            task:
              "Use uma Unit of Work: registre as duas contas como alteradas e grave-as juntas no `commit`, de modo " +
              "que uma falha desfaça as duas.",
            hint: "Altere os saldos em memória, chame `registerDirty` para cada conta e só no final `commit()`.",
            solution: {
              code: {
                language: "javascript",
                filename: "transfer.fixed.js",
                code: [
                  "async function transfer(accounts, uow, fromId, toId, amount) {",
                  "  const from = await accounts.findById(fromId);",
                  "  const to = await accounts.findById(toId);",
                  "",
                  "  if (from.balance < amount) throw new Error(\"saldo insuficiente\");",
                  "",
                  "  from.balance -= amount;",
                  "  to.balance += amount;",
                  "",
                  "  uow.registerDirty(from);",
                  "  uow.registerDirty(to);",
                  "  await uow.commit();   // as duas contas, em uma transação",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Nada é gravado até o `commit`, e ele é atômico: ou as duas contas são atualizadas, ou nenhuma. A " +
                "verificação de saldo acontece antes de qualquer mudança.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Service Layer",
          requires: ["Dependency Injection & IoC / Dependency Injection"],
          note: "orquestra casos de uso; depende de injeção de colaboradores",
          collision: "≠ Domain Service (Domain Modeling) — camada de orquestração × comportamento de domínio puro",
          summary:
            "Uma camada de serviços de aplicação que orquestra os casos de uso — coordena repositórios, objetos de " +
            "domínio, transações e notificações — sem conter as regras de negócio em si.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Service Layer é a camada que define as operações que a aplicação oferece, os casos de uso " +
                "(`placeOrder`, `cancelSubscription`), e as coordena: busca os objetos nos repositórios, chama o " +
                "domínio, controla a transação e dispara efeitos como o envio de e-mail. Ela fica entre quem pede, o " +
                "controlador HTTP, um comando de terminal, uma fila, e o domínio. Recebe os colaboradores por injeção " +
                "(Dependency Injection). Não é o mesmo que um Domain Service (módulo Domain Modeling): aquele contém " +
                "regra de negócio, e este apenas orquestra.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A camada de serviço diz o que a aplicação faz e em que ordem, mas as regras de negócio ficam no " +
                "domínio: ela coordena, e não decide.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada caso de uso é um método (ou uma classe) que recebe dados simples, obtém o que precisa por meio " +
                "dos repositórios, pede ao domínio que aplique as regras, persiste o resultado e aciona os efeitos.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "service-layer.js",
              code: [
                "class PlaceOrderService {",
                "  constructor(customers, orders, payments, mailer) {",
                "    Object.assign(this, { customers, orders, payments, mailer });",
                "  }",
                "",
                "  async execute({ customerId, items }) {",
                "    const customer = await this.customers.findById(customerId);   // 1. busca",
                "    const order = customer.placeOrder(items);                     // 2. o domínio aplica as regras",
                "    await this.payments.charge(customer, order.total);            // 3. efeito externo",
                "    await this.orders.save(order);                                // 4. persiste",
                "    await this.mailer.send(customer.email, `Pedido ${order.id} recebido`);   // 5. notifica",
                "    return { orderId: order.id, total: order.total };",
                "  }",
                "}",
                "",
                "// O controlador só traduz HTTP para o caso de uso",
                "async function postOrder(request, response, service) {",
                "  const result = await service.execute({ customerId: request.userId, items: request.body.items });",
                "  response.status(201).json(result);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`execute` só sequencia os passos. A regra \"cliente bloqueado não pode fazer pedido\" ou o cálculo do " +
                "total ficam em `customer.placeOrder`, no domínio, e não aqui.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o mesmo caso de uso é chamado por várias entradas, como HTTP, terminal e filas, e a orquestração não deve ser duplicada em cada uma.",
                "Para manter os controladores finos e o domínio livre de preocupações de infraestrutura, como transações, e-mail e pagamentos.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se as regras de negócio migram para os serviços e os objetos ficam só com dados, o resultado é o Anemic Domain Model.",
                "Serviços que acumulam muitos casos de uso viram classes enormes; prefira um serviço por caso de uso ou por conceito.",
                "Em um CRUD trivial, uma camada que só repassa a chamada ao repositório é cerimônia sem valor.",
              ],
            },
          ],
          examples: [
            {
              title: "O mesmo caso de uso em duas entradas",
              context: "A camada de serviço evita duplicar a orquestração em cada porta de entrada.",
              code: {
                language: "javascript",
                filename: "two-entries.js",
                code: [
                  "// Entrada 1: HTTP",
                  "app.post(\"/orders\", async (request, response) => {",
                  "  response.json(await placeOrder.execute({ customerId: request.userId, items: request.body.items }));",
                  "});",
                  "",
                  "// Entrada 2: linha de comando, para importar pedidos em lote",
                  "for (const line of readCsv(\"pedidos.csv\")) {",
                  "  await placeOrder.execute({ customerId: line.customer, items: line.items });",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Os dois caminhos passam pelo mesmo `placeOrder`. A regra de que um pedido cobra, salva e notifica " +
                "existe uma vez, e não em cada entrada.",
            },
            {
              title: "Fina: as regras ficam no domínio",
              context: "A linha entre orquestrar e decidir é o critério do padrão.",
              code: {
                language: "javascript",
                filename: "thin-service.js",
                code: [
                  "// Errado: o serviço decide o preço e as regras de negócio",
                  "async execute({ customerId, items }) {",
                  "  const customer = await this.customers.findById(customerId);",
                  "  let total = items.reduce((sum, i) => sum + i.price * i.qty, 0);",
                  "  if (customer.level === \"gold\") total *= 0.9;   // regra de negócio no serviço",
                  "  // ...",
                  "}",
                  "",
                  "// Certo: o serviço pede ao domínio, que sabe as regras",
                  "async execute({ customerId, items }) {",
                  "  const customer = await this.customers.findById(customerId);",
                  "  const order = customer.placeOrder(items);   // o desconto do cliente gold vive em Customer",
                  "  // ...",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se o desconto está no serviço, cada nova entrada precisa lembrar de aplicá-lo, ou o duplica. No " +
                "domínio, ele vale sempre.",
            },
            {
              title: "A armadilha do modelo anêmico",
              context: "Uma camada de serviço gorda com objetos vazios é o sintoma clássico.",
              code: {
                language: "javascript",
                filename: "anemic-trap.js",
                code: [
                  "// Objetos só com dados",
                  "class Order { constructor() { this.items = []; this.status = \"pending\"; } }",
                  "",
                  "// E todas as regras no serviço",
                  "class OrderService {",
                  "  addItem(order, item) { if (order.status !== \"pending\") throw new Error(\"...\"); order.items.push(item); }",
                  "  cancel(order) { if (order.status === \"shipped\") throw new Error(\"...\"); order.status = \"cancelled\"; }",
                  "  total(order) { return order.items.reduce((s, i) => s + i.price, 0); }",
                  "}",
                  "// As regras de `Order` estão em `OrderService`: é o Anemic Domain Model.",
                ].join("\n"),
              },
              explanation:
                "Aqui o serviço virou o dono das regras, e qualquer outro código pode alterar `order.status` sem " +
                "passar por elas. Mover a lógica para `Order` devolve ao domínio a proteção das suas regras.",
            },
          ],
          exercise: {
            problem:
              "O controlador HTTP contém o caso de uso inteiro: busca, cobrança, gravação e e-mail. Uma importação " +
              "em lote precisaria copiar tudo.",
            problemCode: {
              language: "javascript",
              filename: "controller.js",
              code: [
                "app.post(\"/subscriptions\", async (request, response) => {",
                "  const user = await users.findById(request.userId);",
                "  const subscription = user.subscribe(request.body.plan);",
                "  await payments.charge(user, subscription.price);",
                "  await subscriptions.save(subscription);",
                "  await mailer.send(user.email, \"Assinatura ativa\");",
                "  response.status(201).json({ id: subscription.id });",
                "});",
              ].join("\n"),
            },
            task:
              "Extraia um `SubscribeService` com os colaboradores injetados no construtor, e deixe o controlador só " +
              "traduzir a requisição.",
            hint: "O serviço recebe `{ userId, plan }` e devolve dados simples. O controlador chama `execute` e monta a resposta.",
            solution: {
              code: {
                language: "javascript",
                filename: "controller.fixed.js",
                code: [
                  "class SubscribeService {",
                  "  constructor(users, subscriptions, payments, mailer) {",
                  "    Object.assign(this, { users, subscriptions, payments, mailer });",
                  "  }",
                  "  async execute({ userId, plan }) {",
                  "    const user = await this.users.findById(userId);",
                  "    const subscription = user.subscribe(plan);",
                  "    await this.payments.charge(user, subscription.price);",
                  "    await this.subscriptions.save(subscription);",
                  "    await this.mailer.send(user.email, \"Assinatura ativa\");",
                  "    return { id: subscription.id };",
                  "  }",
                  "}",
                  "",
                  "app.post(\"/subscriptions\", async (request, response) => {",
                  "  const result = await subscribe.execute({ userId: request.userId, plan: request.body.plan });",
                  "  response.status(201).json(result);",
                  "});",
                ].join("\n"),
              },
              explanation:
                "O caso de uso agora existe fora do HTTP e pode ser chamado por uma importação em lote ou testado " +
                "com colaboradores falsos. O controlador só traduz a entrada e a saída.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Specification Pattern",
          note: "encapsula regra de negócio/consulta reutilizável e combinável",
          summary:
            "Representa uma regra de negócio como um objeto que responde se um candidato a satisfaz, e que pode ser " +
            "combinado com outros por E, OU e NÃO.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Specification transforma uma regra, \"o cliente é elegível\", \"o produto está em promoção\", em um " +
                "objeto com um único método, `isSatisfiedBy(candidato)`. Como cada especificação é uma peça " +
                "independente, elas são combinadas (`e`, `ou`, `não`) para formar regras maiores, e a mesma regra " +
                "serve para validar um objeto ou para filtrar uma coleção. Dá um nome ao que antes era uma condição " +
                "solta e repetida.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Dê nome a cada regra de negócio e faça-a combinável: regras maiores nascem de regras pequenas, e a " +
                "mesma regra vale para validar e para filtrar.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada especificação guarda um predicado e oferece `and`, `or` e `not`, que devolvem outra " +
                "especificação. Em JavaScript, funções bastam como base; a classe ou o objeto acrescenta os " +
                "combinadores.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "specification.js",
              code: [
                "const spec = (predicate) => ({",
                "  isSatisfiedBy: predicate,",
                "  and: (other) => spec((c) => predicate(c) && other.isSatisfiedBy(c)),",
                "  or: (other) => spec((c) => predicate(c) || other.isSatisfiedBy(c)),",
                "  not: () => spec((c) => !predicate(c)),",
                "});",
                "",
                "// Regras pequenas, com nomes do negócio",
                "const isActive = spec((customer) => customer.status === \"active\");",
                "const isVerified = spec((customer) => customer.emailVerified);",
                "const isBlocked = spec((customer) => customer.blocked);",
                "",
                "// Regra composta a partir das pequenas",
                "const canBuyOnCredit = isActive.and(isVerified).and(isBlocked.not());",
                "",
                "canBuyOnCredit.isSatisfiedBy({ status: \"active\", emailVerified: true, blocked: false });   // true",
                "canBuyOnCredit.isSatisfiedBy({ status: \"active\", emailVerified: false, blocked: false });  // false",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`canBuyOnCredit` se lê como a regra de negócio. Cada condição tem um nome e pode ser reaproveitada " +
                "em outra regra, sem copiar a expressão.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando uma regra de negócio é usada em vários lugares, como validação, filtros e relatórios, e não deve ser duplicada.",
                "Quando as regras são combinadas de formas variadas, como elegibilidade, promoções e filtros de busca.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para uma regra usada em um só lugar, uma função simples com um bom nome basta.",
                "Especificações em memória obrigam a carregar todos os dados para filtrar; em bases grandes, a regra precisa ser traduzida para a consulta do banco.",
                "Traduzir especificações para SQL ou para outra linguagem de consulta é trabalhoso, e sem isso o padrão fica limitado a objetos já carregados.",
              ],
            },
          ],
          examples: [
            {
              title: "Validar e filtrar com a mesma regra",
              context: "O mesmo objeto de especificação serve para checar um candidato e para selecionar de uma lista.",
              code: {
                language: "javascript",
                filename: "validate-and-filter.js",
                code: [
                  "const customers = [",
                  "  { name: \"Ana\", status: \"active\", emailVerified: true, blocked: false },",
                  "  { name: \"Bia\", status: \"active\", emailVerified: false, blocked: false },",
                  "  { name: \"Caio\", status: \"inactive\", emailVerified: true, blocked: false },",
                  "];",
                  "",
                  "// Validar um candidato",
                  "canBuyOnCredit.isSatisfiedBy(customers[0]);   // true",
                  "",
                  "// Filtrar uma coleção",
                  "customers.filter((c) => canBuyOnCredit.isSatisfiedBy(c)).map((c) => c.name);   // [\"Ana\"]",
                ].join("\n"),
              },
              explanation:
                "A regra de elegibilidade existe uma vez. Se ela mudar, a validação e a lista mudam juntas.",
            },
            {
              title: "Especificações com parâmetros",
              context: "Uma função que cria a especificação permite regras configuráveis.",
              code: {
                language: "javascript",
                filename: "parameterized.js",
                code: [
                  "const olderThan = (years) => spec((customer) => customer.ageInYears > years);",
                  "const spentMoreThan = (amount) => spec((customer) => customer.totalSpent > amount);",
                  "",
                  "const vip = olderThan(2).and(spentMoreThan(5000));",
                  "const seasonalOffer = olderThan(0).and(spentMoreThan(100));",
                  "",
                  "vip.isSatisfiedBy({ ageInYears: 3, totalSpent: 8000 });   // true",
                ].join("\n"),
              },
              explanation:
                "As mesmas peças geram regras diferentes conforme os parâmetros. Cada nova regra é uma combinação, " +
                "e não código novo.",
            },
            {
              title: "O limite: filtrar em memória",
              context: "Aplicar a especificação depois de carregar tudo não escala.",
              code: {
                language: "javascript",
                filename: "memory-limit.js",
                code: [
                  "// Carrega toda a tabela e filtra em memória: bom para poucos dados, caro para muitos",
                  "const all = await customers.findAll();",
                  "const eligible = all.filter((c) => canBuyOnCredit.isSatisfiedBy(c));",
                  "",
                  "// Para volumes grandes, a regra precisa virar uma consulta:",
                  "// SELECT * FROM customers WHERE status = 'active' AND email_verified = 1 AND blocked = 0",
                  "// — e isso exige uma segunda forma de expressar a mesma especificação",
                ].join("\n"),
              },
              explanation:
                "O padrão brilha na regra de negócio sobre objetos já carregados. Para consultar o banco, é preciso " +
                "uma forma de traduzir a especificação, ou aceitar a duplicação da regra em SQL.",
            },
          ],
          exercise: {
            problem:
              "A condição de \"pedido elegível para frete grátis\" está copiada em três lugares, com pequenas " +
              "diferenças. Um deles esqueceu a checagem de cancelado.",
            problemCode: {
              language: "javascript",
              filename: "free-shipping.js",
              code: [
                "// Carrinho",
                "if (order.total >= 200 && order.status !== \"cancelled\" && order.address.country === \"BR\") { /* ... */ }",
                "",
                "// Checkout",
                "if (order.total >= 200 && order.address.country === \"BR\") { /* ... esqueceu o status */ }",
                "",
                "// Relatório",
                "const eligible = orders.filter((o) => o.total >= 200 && o.status !== \"cancelled\" && o.address.country === \"BR\");",
              ].join("\n"),
            },
            task:
              "Crie as especificações `minimumTotal(200)`, `notCancelled` e `shipsToBrazil`, combine-as em " +
              "`freeShipping` e use-a nos três pontos.",
            hint: "`freeShipping = minimumTotal(200).and(notCancelled).and(shipsToBrazil)`. Cada uso chama `isSatisfiedBy`.",
            solution: {
              code: {
                language: "javascript",
                filename: "free-shipping.fixed.js",
                code: [
                  "const spec = (predicate) => ({",
                  "  isSatisfiedBy: predicate,",
                  "  and: (other) => spec((c) => predicate(c) && other.isSatisfiedBy(c)),",
                  "  or: (other) => spec((c) => predicate(c) || other.isSatisfiedBy(c)),",
                  "  not: () => spec((c) => !predicate(c)),",
                  "});",
                  "",
                  "const minimumTotal = (amount) => spec((order) => order.total >= amount);",
                  "const notCancelled = spec((order) => order.status !== \"cancelled\");",
                  "const shipsToBrazil = spec((order) => order.address.country === \"BR\");",
                  "",
                  "const freeShipping = minimumTotal(200).and(notCancelled).and(shipsToBrazil);",
                  "",
                  "// Carrinho e Checkout",
                  "if (freeShipping.isSatisfiedBy(order)) { /* ... */ }",
                  "",
                  "// Relatório",
                  "const eligible = orders.filter((o) => freeShipping.isSatisfiedBy(o));",
                ].join("\n"),
              },
              explanation:
                "A regra tem um só lugar e um nome. O esquecimento do `status` no Checkout deixa de ser possível, " +
                "porque todos os pontos usam a mesma especificação.",
            },
          },
        }),
        concept({
          order: 70,
          title: "DTO",
          note: "objeto de transporte de dados entre camadas/fronteiras",
          summary:
            "Um objeto simples, só com dados e sem regras, usado para transportar informação entre camadas ou " +
            "sistemas — separando o que atravessa a fronteira do modelo interno.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "DTO (Data Transfer Object) é um objeto sem comportamento cuja função é carregar dados através de " +
                "uma fronteira: da API para o cliente, do cliente para o caso de uso, entre serviços. Ele tem o " +
                "formato que a fronteira precisa, e não o do domínio. Assim, o modelo interno pode mudar sem " +
                "quebrar quem consome a API, e campos internos, como senhas e flags de controle, não vazam para fora.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O que atravessa a fronteira tem um formato próprio, só de dados: o modelo interno fica livre para " +
                "mudar, e nenhum detalhe interno vaza por acidente.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Funções de conversão (ou mappers) transformam o objeto de domínio em DTO na saída, e o DTO recebido " +
                "em dados válidos para o caso de uso na entrada. A validação da entrada acontece nessa fronteira.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "dto.js",
              code: [
                "// Domínio: tem campos internos que não devem sair",
                "class User {",
                "  constructor(id, name, email, passwordHash, role) {",
                "    Object.assign(this, { id, name, email, passwordHash, role });",
                "  }",
                "}",
                "",
                "// DTO de saída: só o que o cliente da API precisa",
                "function toUserDto(user) {",
                "  return { id: user.id, name: user.name, email: user.email };",
                "}",
                "",
                "// DTO de entrada: valida e normaliza o que chega de fora",
                "function parseCreateUserDto(body) {",
                "  if (typeof body.name !== \"string\" || body.name.trim() === \"\") throw new Error(\"name é obrigatório\");",
                "  if (typeof body.email !== \"string\" || !body.email.includes(\"@\")) throw new Error(\"email inválido\");",
                "  return { name: body.name.trim(), email: body.email.toLowerCase() };",
                "}",
                "",
                "const user = new User(1, \"Ana\", \"ana@x.com\", \"$2b$10$abc...\", \"admin\");",
                "toUserDto(user);   // { id: 1, name: \"Ana\", email: \"ana@x.com\" } — sem passwordHash nem role",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O cliente da API nunca recebe `passwordHash`, e o usuário não consegue definir `role` pelo corpo da " +
                "requisição, porque o DTO de entrada só aceita `name` e `email`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Nas fronteiras do sistema: respostas e requisições de API, mensagens entre serviços, e a comunicação com a interface.",
                "Quando o formato externo deve ser estável e versionado, mesmo que o modelo interno evolua.",
                "Para não expor campos internos ou sensíveis do domínio.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Entre chamadas dentro da mesma camada, um DTO só acrescenta uma conversão inútil.",
                "Copiar todos os objetos de domínio em DTOs idênticos, sem nenhum ganho de isolamento, é só burocracia e código para manter.",
                "Um DTO com lógica de negócio deixa de ser um DTO e vira mais um objeto de domínio, duplicado.",
                "Só dados atravessam bem a serialização: `Date` vira texto, `Map` e `Set` viram `{}` e `[]`, e funções desaparecem.",
              ],
            },
          ],
          examples: [
            {
              title: "Não vazar o que é interno",
              context: "Devolver o objeto de domínio direto expõe tudo o que ele tem, inclusive o que ninguém pensou em expor.",
              code: {
                language: "javascript",
                filename: "leak.js",
                code: [
                  "// Vaza: serializa o objeto inteiro",
                  "app.get(\"/users/:id\", async (request, response) => {",
                  "  const user = await users.findById(request.params.id);",
                  "  response.json(user);   // inclui passwordHash e role",
                  "});",
                  "",
                  "// Seguro: converte para o DTO",
                  "app.get(\"/users/:id\", async (request, response) => {",
                  "  const user = await users.findById(request.params.id);",
                  "  response.json(toUserDto(user));",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Com o DTO, a lista de campos públicos é uma decisão explícita. Um campo novo no domínio não passa a " +
                "aparecer na API sem que alguém o adicione ao DTO.",
            },
            {
              title: "Validar na fronteira de entrada",
              context: "O DTO de entrada é o lugar para rejeitar dados inválidos antes que cheguem ao domínio.",
              code: {
                language: "javascript",
                filename: "input-validation.js",
                code: [
                  "app.post(\"/users\", async (request, response) => {",
                  "  let input;",
                  "  try { input = parseCreateUserDto(request.body); }",
                  "  catch (error) { return response.status(400).json({ error: error.message }); }",
                  "",
                  "  const created = await createUser.execute(input);   // só recebe dados já válidos",
                  "  response.status(201).json(toUserDto(created));",
                  "});",
                  "",
                  "// Corpo com campos extras é limpo: { name, email, role: \"admin\" } → { name, email }",
                ].join("\n"),
              },
              explanation:
                "O caso de uso recebe apenas `name` e `email`, já validados. Campos extras, como `role`, são " +
                "descartados na fronteira, e não chegam ao domínio.",
            },
            {
              title: "O que a serialização faz com os dados",
              context: "Só tipos simples sobrevivem a `JSON.stringify`; o DTO deve usar apenas eles.",
              code: {
                language: "javascript",
                filename: "serialization.js",
                code: [
                  "const domain = {",
                  "  createdAt: new Date(\"2026-01-01\"),",
                  "  tags: new Set([\"a\", \"b\"]),",
                  "  greet() { return \"oi\"; },",
                  "};",
                  "",
                  "JSON.stringify(domain);",
                  "// {\"createdAt\":\"2026-01-01T00:00:00.000Z\",\"tags\":{}}",
                  "// Date virou texto, Set virou {} e a função sumiu",
                  "",
                  "// DTO explícito, só com tipos que atravessam a rede",
                  "const dto = { createdAt: domain.createdAt.toISOString(), tags: [...domain.tags] };",
                ].join("\n"),
              },
              explanation:
                "Ao montar o DTO à mão, você decide como cada valor é representado, e evita surpresas como o `Set` " +
                "virando um objeto vazio.",
            },
          ],
          exercise: {
            problem:
              "O endpoint devolve o pedido inteiro, inclusive `internalNotes` e `costPrice`, que o cliente não deve " +
              "ver. Além disso, o `Date` e o `Set` chegam deformados.",
            problemCode: {
              language: "javascript",
              filename: "order-endpoint.js",
              code: [
                "const order = {",
                "  id: 10,",
                "  placedAt: new Date(\"2026-03-01T10:00:00Z\"),",
                "  items: new Set([\"caneta\", \"caderno\"]),",
                "  total: 25,",
                "  costPrice: 9,                          // interno",
                "  internalNotes: \"cliente reclamou\",     // interno",
                "};",
                "",
                "app.get(\"/orders/10\", (request, response) => response.json(order));",
              ].join("\n"),
            },
            task:
              "Escreva `toOrderDto(order)`, que devolve só `id`, `placedAt` (texto ISO), `items` (array) e `total`, e " +
              "use-o no endpoint.",
            hint: "Converta explicitamente `placedAt` com `toISOString()` e `items` com o spread de `Set`, e liste só os campos públicos.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-endpoint.fixed.js",
                code: [
                  "function toOrderDto(order) {",
                  "  return {",
                  "    id: order.id,",
                  "    placedAt: order.placedAt.toISOString(),",
                  "    items: [...order.items],",
                  "    total: order.total,",
                  "  };",
                  "}",
                  "",
                  "app.get(\"/orders/10\", (request, response) => response.json(toOrderDto(order)));",
                  "",
                  "toOrderDto(order);",
                  "// { id: 10, placedAt: \"2026-03-01T10:00:00.000Z\", items: [\"caneta\", \"caderno\"], total: 25 }",
                ].join("\n"),
              },
              explanation:
                "Só os campos públicos saem, e os tipos foram convertidos para formas que a serialização preserva. " +
                "`costPrice` e `internalNotes` deixam de vazar, e um campo novo no pedido só aparece se alguém o " +
                "acrescentar ao DTO.",
            },
          },
        }),
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
        concept({
          order: 10,
          title: "Domain",
          note: "framing da Story — o problema/negócio que o software modela",
          summary:
            "A área de negócio, ou o problema do mundo real, que o software resolve — com as suas regras, o seu " +
            "vocabulário e as pessoas que a conhecem a fundo. É o assunto, e não a tecnologia.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O domínio é o campo de atividade sobre o qual o software trabalha: logística, saúde, seguros, uma " +
                "biblioteca, um e-commerce. Ele existe antes do código e independe dele, com as suas regras (\"um " +
                "pedido enviado não pode ser cancelado\"), os seus conceitos e os seus especialistas. O domínio é o " +
                "espaço do problema; o software é uma das soluções possíveis. Um domínio grande costuma se dividir em " +
                "subdomínios: o principal (core), que diferencia o negócio, os de apoio e os genéricos, que servem a " +
                "qualquer empresa.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Antes de modelar o software, entenda o negócio: o domínio é o problema a resolver, e o código é " +
                "apenas a forma de resolvê-lo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A maior parte dos projetos falha por não entender o problema, e não por falta de técnica. Conhecer o " +
                "domínio permite decidir onde investir: o subdomínio principal merece o melhor design e os melhores " +
                "desenvolvedores, enquanto os genéricos, como autenticação e pagamentos, costumam ser comprados ou " +
                "reaproveitados. Também dá ao código um vocabulário correto, o que ajuda a manter a conversa entre a " +
                "equipe técnica e os especialistas.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma regra do negócio dita por um especialista, e a mesma regra expressa em código:" },
            {
              type: "code",
              language: "javascript",
              filename: "domain.js",
              code: [
                "// Especialista de logística: \"Um pedido só pode ser cancelado enquanto não foi despachado,",
                "// e pedidos com entrega expressa não podem ser cancelados depois de pagos.\"",
                "function canCancel(order) {",
                "  if (order.status === \"dispatched\") return false;",
                "  if (order.shipping === \"express\" && order.status === \"paid\") return false;",
                "  return true;",
                "}",
                "",
                "// Subdomínios de uma loja online: onde investir e onde reaproveitar",
                "const subdomains = {",
                "  core: [\"precificação dinâmica\", \"recomendação de produtos\"],   // diferencia o negócio: construir",
                "  supporting: [\"gestão de estoque\", \"atendimento\"],             // necessário, mas não diferencia",
                "  generic: [\"autenticação\", \"pagamentos\", \"envio de e-mail\"],   // servem a qualquer empresa: comprar",
                "};",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A regra de `canCancel` veio da conversa com quem conhece a logística, e não de uma decisão técnica. A " +
                "classificação em subdomínios orienta onde vale o esforço de um design cuidadoso.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Confundir domínio com tecnologia: \"banco de dados de usuários\" é solução; o domínio é o que o negócio faz com os usuários.",
                "Modelar sem falar com quem conhece o negócio faz o código expressar suposições da equipe, e não as regras reais.",
                "Tratar todos os subdomínios com o mesmo esforço desperdiça tempo nos genéricos e subinveste no que diferencia o negócio.",
              ],
            },
          ],
          examples: [
            {
              title: "Da fala do especialista para o código",
              context: "As regras do domínio nascem da conversa com quem faz o trabalho, e devem ficar reconhecíveis no código.",
              code: {
                language: "javascript",
                filename: "expert-rule.js",
                code: [
                  "// \"Um sócio pode retirar até três livros por vez, e só se não tiver multas em aberto.\"",
                  "class Member {",
                  "  constructor(name) { this.name = name; this.loans = []; this.openFines = 0; }",
                  "",
                  "  canBorrow() { return this.loans.length < 3 && this.openFines === 0; }",
                  "",
                  "  borrow(book) {",
                  "    if (!this.canBorrow()) throw new Error(\"o sócio não pode retirar mais livros\");",
                  "    this.loans.push(book);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A frase do bibliotecário e o método `canBorrow` dizem a mesma coisa, e se a regra mudar, a mudança " +
                "aponta para um lugar claro do código.",
            },
            {
              title: "Subdomínios e a decisão de construir ou comprar",
              context: "Nem tudo merece ser construído: a classificação orienta o investimento.",
              code: {
                language: "javascript",
                filename: "build-or-buy.js",
                code: [
                  "const decisions = [",
                  "  { subdomain: \"precificação dinâmica\", type: \"core\", decision: \"construir, com a melhor equipe\" },",
                  "  { subdomain: \"gestão de estoque\", type: \"supporting\", decision: \"construir simples, ou adaptar\" },",
                  "  { subdomain: \"pagamentos\", type: \"generic\", decision: \"comprar, e integrar um provedor\" },",
                  "];",
                  "",
                  "decisions.filter((d) => d.type === \"core\").map((d) => d.subdomain);   // [\"precificação dinâmica\"]",
                ].join("\n"),
              },
              explanation:
                "O subdomínio principal é aquele em que o negócio compete, e por isso recebe o esforço de modelagem. " +
                "Os genéricos são problemas já resolvidos, e reinventá-los raramente traz vantagem.",
            },
            {
              title: "Quando o nome vem da tecnologia, e não do negócio",
              context: "Nomes técnicos escondem o que o negócio de fato faz.",
              code: {
                language: "javascript",
                filename: "technical-names.js",
                code: [
                  "// Vocabulário da tecnologia: o que isso significa para o negócio?",
                  "userTable.update(row.id, { flag: 2 });",
                  "",
                  "// Vocabulário do domínio: a intenção é clara",
                  "customer.markAsVip();",
                ].join("\n"),
              },
              explanation:
                "A primeira linha só faz sentido para quem conhece o esquema do banco. A segunda pode ser lida por " +
                "qualquer pessoa do negócio, e é o vocabulário que o domínio pede.",
            },
          ],
          exercise: {
            problem:
              "Sua equipe vai construir uma plataforma de entrega de comida e listou as capacidades abaixo. Não há " +
              "critério do que construir e do que comprar, e todas estão no mesmo backlog.",
            problemCode: {
              language: "javascript",
              filename: "capabilities.js",
              code: [
                "const capabilities = [",
                "  \"algoritmo de despacho que escolhe o melhor entregador\",   // é o que nos diferencia dos concorrentes",
                "  \"login e recuperação de senha\",",
                "  \"cobrança no cartão\",",
                "  \"cadastro de restaurantes e cardápios\",",
                "  \"envio de notificações por SMS\",",
                "];",
              ].join("\n"),
            },
            task:
              "Classifique cada capacidade como `core`, `supporting` ou `generic` e diga, para cada tipo, se a " +
              "equipe deve construir ou comprar.",
            hint: "O que diferencia o negócio dos concorrentes é o `core`. O que qualquer empresa precisa igual é `generic`.",
            solution: {
              code: {
                language: "javascript",
                filename: "capabilities.fixed.js",
                code: [
                  "const classification = {",
                  "  core: {",
                  "    items: [\"algoritmo de despacho que escolhe o melhor entregador\"],",
                  "    decision: \"construir, com modelagem cuidadosa\",",
                  "  },",
                  "  supporting: {",
                  "    items: [\"cadastro de restaurantes e cardápios\"],",
                  "    decision: \"construir de forma simples\",",
                  "  },",
                  "  generic: {",
                  "    items: [\"login e recuperação de senha\", \"cobrança no cartão\", \"envio de notificações por SMS\"],",
                  "    decision: \"comprar ou reaproveitar um serviço pronto\",",
                  "  },",
                  "};",
                ].join("\n"),
              },
              explanation:
                "O despacho é o que diferencia a plataforma e recebe o melhor design. O cadastro é necessário, mas " +
                "qualquer concorrente tem algo parecido. Login, cobrança e SMS são problemas resolvidos, e a decisão " +
                "econômica é reaproveitá-los.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Domain Model",
          requires: ["Domain"],
          note: "o modelo de objetos que captura os conceitos e as regras do negócio",
          summary:
            "Uma representação, feita de objetos com dados e comportamento, dos conceitos e das regras do domínio — " +
            "não o esquema do banco nem uma tela, mas o próprio entendimento do negócio expresso em código.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O modelo de domínio é a versão simplificada do domínio que o software carrega: os conceitos que " +
                "importam (empréstimo, sócio, exemplar), as relações entre eles e as regras que valem. Ele é " +
                "selecionado, e não completo: inclui só o que ajuda a resolver o problema. Em DDD, o modelo vive no " +
                "código, com objetos que juntam dados e regras (Rich Domain Model), e não em um diagrama separado, " +
                "nem no esquema do banco.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O modelo é o entendimento do negócio expresso em código: objetos com dados e regras que falam a " +
                "língua do domínio, e não uma cópia das tabelas.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um modelo fiel ao domínio faz o código dizer o que o negócio faz, o que o torna legível pelos " +
                "especialistas e fácil de mudar quando as regras mudam. Sem ele, o conhecimento fica espalhado em " +
                "condicionais, serviços e consultas, e as mesmas regras são reescritas em vários lugares. O modelo " +
                "também não nasce pronto: ele é refinado à medida que a equipe entende melhor o negócio.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um modelo de biblioteca em que as regras vivem nos objetos:" },
            {
              type: "code",
              language: "javascript",
              filename: "domain-model.js",
              code: [
                "class Loan {",
                "  constructor(copy, member, borrowedOn) {",
                "    this.copy = copy;",
                "    this.member = member;",
                "    this.borrowedOn = borrowedOn;",
                "    this.returnedOn = null;",
                "  }",
                "",
                "  get dueOn() {",
                "    const due = new Date(this.borrowedOn);",
                "    due.setDate(due.getDate() + 14);          // regra: prazo de 14 dias",
                "    return due;",
                "  }",
                "",
                "  isOverdue(today) { return !this.returnedOn && today > this.dueOn; }",
                "",
                "  giveBack(today) {",
                "    if (this.returnedOn) throw new Error(\"o exemplar já foi devolvido\");",
                "    this.returnedOn = today;",
                "  }",
                "}",
                "",
                "const loan = new Loan({ id: 7 }, { name: \"Ana\" }, new Date(\"2026-03-01\"));",
                "loan.isOverdue(new Date(\"2026-03-20\"));   // true",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O prazo, o atraso e a devolução são conceitos do negócio, e ficam em `Loan`. Nenhuma tabela ou tela " +
                "aparece no modelo.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Confundir modelo de domínio com o esquema do banco: as tabelas servem à persistência, e o modelo, às regras do negócio; os dois podem ser bem diferentes.",
                "Um modelo só de dados, com todas as regras em serviços, é o Anemic Domain Model, e perde a maior parte do benefício.",
                "Tentar modelar tudo: um modelo que inclui o que o problema não pede fica grande, confuso e caro de manter.",
              ],
            },
          ],
          examples: [
            {
              title: "O modelo usa a língua do negócio",
              context: "Os nomes de classes e métodos devem ser os que o especialista usaria.",
              code: {
                language: "javascript",
                filename: "business-names.js",
                code: [
                  "// Nomes de infraestrutura",
                  "// record.setState(3); record.save();",
                  "",
                  "// Nomes do domínio",
                  "loan.giveBack(new Date());",
                  "member.payFine(fine);",
                ].join("\n"),
              },
              explanation:
                "Um bibliotecário reconhece \"devolver\" e \"pagar multa\". `setState(3)` não diz nada sobre o negócio.",
            },
            {
              title: "O modelo não é o banco de dados",
              context: "A forma como algo é guardado pode diferir da forma como é modelado.",
              code: {
                language: "javascript",
                filename: "model-vs-schema.js",
                code: [
                  "// No banco, tudo em uma linha, com flags",
                  "const row = { id: 1, member_id: 5, copy_id: 7, borrowed_on: \"2026-03-01\", returned_on: null };",
                  "",
                  "// No modelo, um objeto com comportamento, reconstruído por um mapper",
                  "const loan = new Loan({ id: row.copy_id }, { id: row.member_id }, new Date(row.borrowed_on));",
                  "loan.isOverdue(new Date());",
                ].join("\n"),
              },
              explanation:
                "O banco guarda o dado, e o modelo carrega as regras. O Data Mapper faz a ponte, e nenhum dos dois " +
                "precisa ter o formato do outro.",
            },
            {
              title: "O modelo é refinado com o entendimento",
              context: "A primeira versão raramente é a certa; o diálogo com o especialista revela distinções novas.",
              code: {
                language: "javascript",
                filename: "refinement.js",
                code: [
                  "// Versão 1: um livro está disponível ou não",
                  "class Book { constructor(title) { this.title = title; this.available = true; } }",
                  "",
                  "// O bibliotecário explica: há várias cópias físicas do mesmo título",
                  "// Versão 2: o título e o exemplar físico são conceitos distintos",
                  "class Title { constructor(name) { this.name = name; } }",
                  "class Copy {",
                  "  constructor(title, id) { this.title = title; this.id = id; this.onLoan = false; }",
                  "  isAvailable() { return !this.onLoan; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A distinção entre título e exemplar só apareceu ao conversar com o negócio. O modelo melhorou porque " +
                "o entendimento melhorou, e não por uma decisão técnica.",
            },
          ],
          exercise: {
            problem:
              "A reserva de salas de reunião guarda os dados em objetos simples, e as regras estão espalhadas em " +
              "funções. Já houve reserva dupla porque uma tela esqueceu de checar o conflito.",
            problemCode: {
              language: "javascript",
              filename: "rooms.js",
              code: [
                "const room = { name: \"Sala 1\", bookings: [] };",
                "",
                "function overlaps(a, b) { return a.start < b.end && b.start < a.end; }",
                "",
                "// Tela A: checa o conflito",
                "if (!room.bookings.some((b) => overlaps(b, slot))) room.bookings.push(slot);",
                "",
                "// Tela B: esqueceu",
                "room.bookings.push(slot);",
              ].join("\n"),
            },
            task:
              "Crie um `Room` que guarde as reservas e tenha um método `book(slot)`, que recuse horários em conflito, " +
              "de forma que nenhuma tela consiga esquecer a regra.",
            hint: "A lista de reservas deve ser privada, e `book` deve ser o único caminho para adicionar uma reserva.",
            solution: {
              code: {
                language: "javascript",
                filename: "rooms.fixed.js",
                code: [
                  "class Room {",
                  "  #bookings = [];",
                  "  constructor(name) { this.name = name; }",
                  "",
                  "  book(slot) {",
                  "    if (this.#bookings.some((b) => slot.start < b.end && b.start < slot.end)) {",
                  "      throw new Error(\"horário em conflito\");",
                  "    }",
                  "    this.#bookings.push(slot);",
                  "  }",
                  "",
                  "  get bookings() { return [...this.#bookings]; }   // cópia: não permite alterar por fora",
                  "}",
                  "",
                  "const room = new Room(\"Sala 1\");",
                  "room.book({ start: 9, end: 10 });",
                  "room.book({ start: 9, end: 11 });   // Error: horário em conflito",
                ].join("\n"),
              },
              explanation:
                "A regra de conflito passou a viver em `Room`, e não há como adicionar uma reserva sem passar por ela. " +
                "O modelo agora protege a própria regra.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Ubiquitous Language",
          requires: ["Domain Model"],
          note: "vocabulário compartilhado entre dev e negócio",
          summary:
            "Um vocabulário único, construído em conjunto por desenvolvedores e especialistas do negócio, usado nas " +
            "conversas, na documentação e nos nomes do código, sem tradução entre eles.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ubiquitous Language (linguagem onipresente) é o conjunto de termos que a equipe inteira, técnica e de " +
                "negócio, usa para falar do domínio, e que aparece exatamente igual nas reuniões, nos requisitos, nos " +
                "testes e nos nomes de classes e métodos. Quando o especialista diz \"aprovar o empréstimo\", o código " +
                "tem `approveLoan()`, e não `updateStatus(3)`. A linguagem é construída em conjunto, refinada com o " +
                "tempo, e é a base do Domain Model.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma só língua para conversar e para programar: os mesmos termos do negócio aparecem no código, e " +
                "nenhuma tradução fica entre as duas coisas.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Ouça como os especialistas falam e use as mesmas palavras. Quando um termo for ambíguo ou o código e " +
                "o negócio divergirem, resolva a ambiguidade em conjunto e renomeie no código. Mantenha um glossário " +
                "curto e revise-o quando o entendimento mudar.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "ubiquitous-language.js",
              code: [
                "// Antes: vocabulário técnico, que só a equipe de desenvolvimento entende",
                "function process(record, action) {",
                "  if (action === 1) record.status = 3;",
                "  if (action === 2) record.status = 4;",
                "}",
                "",
                "// Depois: os termos que o negócio usa",
                "class LoanRequest {",
                "  status = \"pending\";",
                "  approve() { this.status = \"approved\"; }",
                "  reject(reason) { this.status = \"rejected\"; this.reason = reason; }",
                "}",
                "",
                "const request = new LoanRequest();",
                "request.approve();   // o analista de crédito reconhece esta frase",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Quem lê `request.approve()` entende a operação sem consultar uma tabela de códigos. A conversa com o " +
                "negócio e o código passam a usar as mesmas palavras.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em qualquer projeto com um domínio de regras não triviais e especialistas com quem conversar.",
                "Sempre que houver ruído na comunicação, quando o negócio e a equipe falam de coisas iguais com palavras diferentes, ou de coisas diferentes com a mesma palavra.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em domínios triviais e sem especialistas, o esforço de construir um vocabulário compartilhado pode não compensar.",
                "Não existe uma linguagem única para a empresa toda: cada Bounded Context tem a sua, e o mesmo termo pode significar coisas diferentes em contextos distintos.",
                "Se o negócio fala em português e o código está em inglês, é preciso decidir a convenção e manter um glossário que faça a ponte, ou a tradução volta pela porta dos fundos.",
              ],
            },
          ],
          examples: [
            {
              title: "Renomear até o código falar como o negócio",
              context: "A linguagem é aplicada com renomeações, e não apenas com reuniões.",
              code: {
                language: "javascript",
                filename: "rename.js",
                code: [
                  "// Antes",
                  "order.setFlag(\"X\");",
                  "user.doAction(order, 2);",
                  "",
                  "// Depois: verbos e substantivos do negócio",
                  "order.placeOnHold();",
                  "customer.cancel(order);",
                ].join("\n"),
              },
              explanation:
                "Depois das renomeações, uma frase como \"o cliente cancelou o pedido\" corresponde quase palavra por " +
                "palavra ao código.",
            },
            {
              title: "A mesma palavra, significados diferentes",
              context: "Um termo pode ter outro sentido em outra parte do negócio, o que revela uma fronteira.",
              code: {
                language: "javascript",
                filename: "same-word.js",
                code: [
                  "// Vendas: \"Cliente\" é quem pode comprar, com limite de crédito e tabela de preços",
                  "class SalesCustomer { constructor(creditLimit, priceList) { /* ... */ } }",
                  "",
                  "// Suporte: \"Cliente\" é quem abriu um chamado, com histórico de atendimentos",
                  "class SupportCustomer { constructor(tickets, plan) { /* ... */ } }",
                ].join("\n"),
              },
              explanation:
                "\"Cliente\" não significa o mesmo nas duas áreas. Forçar uma única classe tornaria uma das linguagens " +
                "falsa. Esse é o ponto em que entra o Bounded Context.",
            },
            {
              title: "A linguagem nos nomes dos testes",
              context: "Os testes são uma documentação viva: escritos na língua do negócio, eles a validam.",
              code: {
                language: "javascript",
                filename: "tests-in-domain-language.js",
                code: [
                  "test(\"um sócio com multa em aberto não pode retirar um livro\", () => {",
                  "  const member = new Member(\"Ana\");",
                  "  member.openFines = 1;",
                  "  expect(member.canBorrow()).toBe(false);",
                  "});",
                  "",
                  "test(\"um exemplar devolvido fica disponível para novo empréstimo\", () => {",
                  "  // ...",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Um especialista consegue ler os nomes dos testes e confirmar se a regra está correta, sem ler o " +
                "código de teste.",
            },
          ],
          exercise: {
            problem:
              "O código do aluguel de carros usa nomes genéricos que ninguém do negócio reconhece. O gerente da " +
              "locadora diz \"reservar\", \"retirar\", \"devolver\" e \"cobrar diária extra\".",
            problemCode: {
              language: "javascript",
              filename: "rental.js",
              code: [
                "class Item {",
                "  state = 0;",
                "  doA() { this.state = 1; }",
                "  doB() { this.state = 2; }",
                "  doC() { this.state = 3; }",
                "  calc(days) { return days > this.limit ? (days - this.limit) * this.rate : 0; }",
                "}",
              ].join("\n"),
            },
            task:
              "Renomeie a classe, os estados e os métodos com a linguagem do gerente, de modo que o código possa ser " +
              "lido em voz alta como uma frase do negócio.",
            hint: "`doA`, `doB` e `doC` correspondem a reservar, retirar e devolver, e `calc` é a cobrança de diária extra.",
            solution: {
              code: {
                language: "javascript",
                filename: "rental.fixed.js",
                code: [
                  "class Rental {",
                  "  status = \"available\";",
                  "",
                  "  reserve() { this.status = \"reserved\"; }",
                  "  pickUp() { this.status = \"in-use\"; }",
                  "  giveBack() { this.status = \"returned\"; }",
                  "",
                  "  extraDailyFee(days) {",
                  "    return days > this.includedDays ? (days - this.includedDays) * this.dailyRate : 0;",
                  "  }",
                  "}",
                  "",
                  "const rental = new Rental();",
                  "rental.reserve();",
                  "rental.pickUp();",
                  "rental.giveBack();",
                ].join("\n"),
              },
              explanation:
                "O código agora tem a mesma sequência que o gerente descreve: reservar, retirar, devolver. Nenhuma " +
                "tabela de códigos é preciso para entender o que `state = 2` significava.",
            },
          },
        }),
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
          summary:
            "Um grupo de entidades e objetos de valor tratado como uma unidade: as regras que envolvem o conjunto " +
            "valem sempre dentro dessa fronteira, e ele é gravado inteiro, em uma única transação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Aggregate é um agrupamento de objetos, entidades e objetos de valor, que precisa ser consistente " +
                "como um todo: um pedido e as suas linhas, por exemplo. As regras que atravessam vários desses objetos " +
                "(\"o total do pedido não pode passar do limite\") são garantidas dentro da fronteira do agregado. " +
                "Cada agregado é carregado e gravado por inteiro em uma única transação, e o que está fora dele é " +
                "alcançado apenas por referência (o `customerId`), e não pelo objeto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um agregado é a fronteira de consistência: o que precisa estar coerente ao mesmo tempo fica dentro " +
                "dele, e o resto do sistema fala com ele como uma unidade.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Escolha o que precisa ser verdade a cada instante (as invariantes) e agrupe apenas os objetos " +
                "necessários para garanti-las. As mudanças passam por operações do agregado, que validam a invariante " +
                "antes de aceitá-las.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "aggregate.js",
              code: [
                "class Order {",
                "  #lines = [];",
                "",
                "  constructor(id, customerId, creditLimit) {",
                "    this.id = id;",
                "    this.customerId = customerId;   // referência a outro agregado, pelo id",
                "    this.creditLimit = creditLimit;",
                "  }",
                "",
                "  get total() { return this.#lines.reduce((sum, l) => sum + l.price * l.quantity, 0); }",
                "",
                "  addLine(product, quantity) {",
                "    const newTotal = this.total + product.price * quantity;",
                "    if (newTotal > this.creditLimit) throw new Error(\"o pedido excede o limite de crédito\");   // invariante",
                "    this.#lines.push({ productId: product.id, price: product.price, quantity });",
                "  }",
                "}",
                "",
                "const order = new Order(1, 42, 500);",
                "order.addLine({ id: 1, price: 200 }, 2);   // total 400",
                "order.addLine({ id: 2, price: 200 }, 1);   // Error: excede o limite de crédito",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A regra do limite envolve todas as linhas, por isso elas pertencem ao mesmo agregado. O cliente, " +
                "porém, é outro agregado: `Order` só guarda o seu `customerId`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando existe uma regra que envolve vários objetos e precisa valer a cada mudança, como um limite, um total ou uma quantidade máxima.",
                "Para definir a fronteira de transação: cada operação de negócio altera um agregado e o grava inteiro.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Agregados grandes demais, que tentam garantir tudo, ficam lentos de carregar e geram conflito entre usuários que alteram partes diferentes; prefira agregados pequenos.",
                "Regras que envolvem mais de um agregado não têm consistência imediata: use eventos de domínio e aceite consistência eventual.",
                "Nem toda relação é uma contenção: modelar cada associação como parte do agregado o infla e mistura conceitos que mudam por razões diferentes.",
              ],
            },
          ],
          examples: [
            {
              title: "Referenciar outro agregado pelo identificador",
              context: "Guardar o objeto inteiro de outro agregado o traz para dentro da fronteira sem querer.",
              code: {
                language: "javascript",
                filename: "reference-by-id.js",
                code: [
                  "// Contém o cliente inteiro: alterar o pedido pode acabar alterando o cliente",
                  "class OrderWithCustomerObject {",
                  "  constructor(customer) { this.customer = customer; }",
                  "}",
                  "",
                  "// Referencia pelo id: o cliente é outro agregado, com o seu próprio ciclo de vida",
                  "class Order {",
                  "  constructor(customerId) { this.customerId = customerId; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com o `customerId`, o pedido e o cliente são carregados, gravados e alterados de forma " +
                "independente, cada um respeitando a sua fronteira.",
            },
            {
              title: "Uma invariante que atravessa vários objetos",
              context: "A invariante é o que justifica agrupar os objetos.",
              code: {
                language: "javascript",
                filename: "invariant.js",
                code: [
                  "class Playlist {",
                  "  #tracks = [];",
                  "  constructor(maxMinutes) { this.maxMinutes = maxMinutes; }",
                  "",
                  "  get minutes() { return this.#tracks.reduce((sum, t) => sum + t.minutes, 0); }",
                  "",
                  "  add(track) {",
                  "    if (this.minutes + track.minutes > this.maxMinutes) throw new Error(\"a playlist excederia a duração máxima\");",
                  "    this.#tracks.push(track);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A duração total depende de todas as faixas, por isso a playlist e as suas faixas formam um agregado. " +
                "Se as faixas fossem alteradas por fora, a regra poderia ser violada.",
            },
            {
              title: "O agregado grande demais",
              context: "Incluir tudo que se relaciona torna o agregado lento e cheio de conflitos.",
              code: {
                language: "javascript",
                filename: "too-big.js",
                code: [
                  "// Grande demais: cada alteração carrega e trava tudo isso",
                  "class Store {",
                  "  constructor() { this.products = []; this.orders = []; this.customers = []; this.employees = []; }",
                  "}",
                  "",
                  "// Melhor: agregados pequenos, ligados por identificador",
                  "class Product { constructor(id, name, price) { /* ... */ } }",
                  "class Order { constructor(id, customerId) { /* ... */ } }",
                ].join("\n"),
              },
              explanation:
                "Dois clientes fazendo pedidos ao mesmo tempo não deveriam disputar o mesmo objeto. Agregados " +
                "pequenos permitem que operações independentes ocorram sem conflito.",
            },
          ],
          exercise: {
            problem:
              "O carrinho expõe a lista de itens, e qualquer parte do código pode adicionar produtos diretamente. A " +
              "regra \"no máximo 10 itens\" já foi violada.",
            problemCode: {
              language: "javascript",
              filename: "cart.js",
              code: [
                "class Cart {",
                "  constructor() { this.items = []; }",
                "}",
                "",
                "const cart = new Cart();",
                "for (let i = 0; i < 15; i++) cart.items.push({ productId: i });   // ninguém impede",
                "cart.items.length;   // 15",
              ].join("\n"),
            },
            task:
              "Faça de `Cart` um agregado que proteja a regra: a lista de itens fica privada, e `add` recusa o " +
              "décimo primeiro item.",
            hint: "Torne a lista privada, exponha uma cópia para leitura e concentre a regra no método `add`.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart.fixed.js",
                code: [
                  "class Cart {",
                  "  static MAX_ITEMS = 10;",
                  "  #items = [];",
                  "",
                  "  add(productId) {",
                  "    if (this.#items.length >= Cart.MAX_ITEMS) throw new Error(\"o carrinho aceita no máximo 10 itens\");",
                  "    this.#items.push({ productId });",
                  "  }",
                  "",
                  "  get items() { return [...this.#items]; }",
                  "}",
                  "",
                  "const cart = new Cart();",
                  "for (let i = 0; i < 10; i++) cart.add(i);",
                  "cart.add(10);   // Error: o carrinho aceita no máximo 10 itens",
                ].join("\n"),
              },
              explanation:
                "A regra só pode ser burlada pelo método `add`, que a aplica. O carrinho e os seus itens formam uma " +
                "unidade de consistência, e o resto do sistema só a altera pela sua interface.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Aggregate Root",
          requires: ["Aggregate"],
          note: "a única porta de entrada do Aggregate",
          summary:
            "A entidade principal de um agregado, e a única que o resto do sistema pode referenciar: todo acesso " +
            "aos objetos internos passa por ela, que garante as regras do conjunto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em cada agregado, uma entidade é a raiz (Aggregate Root). O código externo só guarda referências à " +
                "raiz e só pede coisas a ela; os objetos internos, como as linhas de um pedido, não são acessados " +
                "diretamente. A raiz aplica as regras a cada mudança e devolve, quando necessário, cópias ou visões " +
                "somente leitura do que está dentro. É também a unidade que o repositório carrega e grava (Repository " +
                "Pattern): um repositório por raiz.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O agregado tem uma única porta de entrada: a raiz. Quem quiser alterar algo dentro dele fala com a " +
                "raiz, que protege as regras.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A raiz tem os objetos internos como campos privados e oferece operações do negócio, sem expor as " +
                "coleções nem os objetos filhos para alteração. O repositório trabalha com a raiz, e nunca com uma " +
                "linha ou item isolado.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "aggregate-root.js",
              code: [
                "class OrderLine {                       // objeto interno: ninguém de fora o referencia",
                "  constructor(productId, price, quantity) { Object.assign(this, { productId, price, quantity }); }",
                "}",
                "",
                "class Order {                           // a raiz do agregado",
                "  #lines = [];",
                "  #status = \"open\";",
                "",
                "  constructor(id) { this.id = id; }",
                "",
                "  addLine(productId, price, quantity) {",
                "    if (this.#status !== \"open\") throw new Error(\"o pedido não aceita mais alterações\");",
                "    this.#lines.push(new OrderLine(productId, price, quantity));",
                "  }",
                "",
                "  removeLine(productId) {",
                "    if (this.#status !== \"open\") throw new Error(\"o pedido não aceita mais alterações\");",
                "    this.#lines = this.#lines.filter((l) => l.productId !== productId);",
                "  }",
                "",
                "  confirm() {",
                "    if (this.#lines.length === 0) throw new Error(\"um pedido vazio não pode ser confirmado\");",
                "    this.#status = \"confirmed\";",
                "  }",
                "",
                "  get lines() { return this.#lines.map((l) => ({ ...l })); }   // cópias, para leitura",
                "}",
                "",
                "const order = new Order(1);",
                "order.addLine(10, 25, 2);",
                "order.confirm();",
                "order.addLine(11, 5, 1);   // Error: o pedido não aceita mais alterações",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As regras de estado do pedido (\"não altera depois de confirmado\", \"não confirma vazio\") ficam na " +
                "raiz, e as linhas não podem ser alteradas por fora.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em todo agregado: definir a raiz é o que faz a fronteira de consistência ser respeitada.",
                "Para dar ao repositório uma unidade clara de carregar e gravar, e ao restante do sistema um único ponto de contato.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Devolver as coleções internas, mutáveis, anula a proteção: qualquer código pode alterá-las sem passar pela raiz.",
                "A raiz pode virar uma classe enorme, se acumular comportamento que pertence a objetos internos; delegue a eles o que for deles.",
                "Se há um único objeto e nenhuma invariante entre partes, não há um agregado de verdade, e a distinção é só cerimônia.",
              ],
            },
          ],
          examples: [
            {
              title: "A coleção interna exposta",
              context: "Devolver o array real permite alterar o agregado por fora.",
              code: {
                language: "javascript",
                filename: "leaked-collection.js",
                code: [
                  "// Vaza: quem recebe o array o altera sem passar pela raiz",
                  "class LeakyOrder {",
                  "  #lines = [];",
                  "  get lines() { return this.#lines; }",
                  "}",
                  "const leaky = new LeakyOrder();",
                  "leaky.lines.push({ productId: 1, price: -100, quantity: 1 });   // burla qualquer regra",
                  "",
                  "// Protegido: devolve uma cópia",
                  "class Order {",
                  "  #lines = [];",
                  "  get lines() { return [...this.#lines]; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com o array real exposto, a raiz deixa de ser a única porta de entrada. A cópia mantém quem lê " +
                "informado, mas sem poder alterar.",
            },
            {
              title: "Um repositório por raiz",
              context: "O repositório carrega e grava o agregado inteiro, e não as suas partes.",
              code: {
                language: "javascript",
                filename: "repository-per-root.js",
                code: [
                  "class OrderRepository {",
                  "  findById(id) { /* carrega o pedido e as suas linhas, e devolve a raiz */ }",
                  "  save(order) { /* grava o pedido e as linhas na mesma transação */ }",
                  "}",
                  "",
                  "// Não existe um OrderLineRepository: as linhas só existem através do pedido",
                ].join("\n"),
              },
              explanation:
                "As linhas não têm sentido sozinhas, e por isso não têm um repositório próprio. A raiz é a unidade " +
                "que entra e sai do armazenamento.",
            },
            {
              title: "A raiz aplicando uma regra do conjunto",
              context: "Uma regra que depende do estado geral do agregado pertence à raiz.",
              code: {
                language: "javascript",
                filename: "root-rule.js",
                code: [
                  "class Invoice {",
                  "  #items = [];",
                  "  #paid = false;",
                  "",
                  "  addItem(description, amount) {",
                  "    if (this.#paid) throw new Error(\"fatura já paga não pode ser alterada\");",
                  "    if (amount <= 0) throw new Error(\"o valor deve ser positivo\");",
                  "    this.#items.push({ description, amount });",
                  "  }",
                  "",
                  "  pay() {",
                  "    if (this.#items.length === 0) throw new Error(\"fatura vazia\");",
                  "    this.#paid = true;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada operação verifica o estado do conjunto antes de agir. Como só a raiz altera os itens, essas " +
                "verificações não podem ser contornadas.",
            },
          ],
          exercise: {
            problem:
              "`Invoice` devolve diretamente os itens internos. Um trecho do código altera o preço de um item depois " +
              "que a fatura foi paga.",
            problemCode: {
              language: "javascript",
              filename: "invoice.js",
              code: [
                "class Invoice {",
                "  #items = [{ id: 1, price: 100 }];",
                "  #paid = false;",
                "  get items() { return this.#items; }",
                "  pay() { this.#paid = true; }",
                "}",
                "",
                "const invoice = new Invoice();",
                "invoice.pay();",
                "invoice.items[0].price = 1;   // adulterou uma fatura paga",
              ].join("\n"),
            },
            task:
              "Faça `Invoice` a raiz de fato: devolva cópias dos itens e ofereça `changePrice(id, price)`, que recuse a " +
              "alteração depois de paga.",
            hint: "Devolva cópias em `items` e concentre a alteração em um método que verifica o estado da fatura.",
            solution: {
              code: {
                language: "javascript",
                filename: "invoice.fixed.js",
                code: [
                  "class Invoice {",
                  "  #items = [{ id: 1, price: 100 }];",
                  "  #paid = false;",
                  "",
                  "  get items() { return this.#items.map((item) => ({ ...item })); }",
                  "",
                  "  changePrice(id, price) {",
                  "    if (this.#paid) throw new Error(\"fatura paga não pode ser alterada\");",
                  "    const item = this.#items.find((i) => i.id === id);",
                  "    if (!item) throw new Error(\"item não encontrado\");",
                  "    item.price = price;",
                  "  }",
                  "",
                  "  pay() { this.#paid = true; }",
                  "}",
                  "",
                  "const invoice = new Invoice();",
                  "invoice.pay();",
                  "invoice.items[0].price = 1;    // altera só a cópia; a fatura não muda",
                  "invoice.changePrice(1, 1);     // Error: fatura paga não pode ser alterada",
                ].join("\n"),
              },
              explanation:
                "Agora a única forma de mudar um preço é por `changePrice`, que verifica se a fatura já foi paga. As " +
                "cópias devolvidas por `items` permitem ler, mas não alterar o agregado.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Domain Service",
          requires: ["Domain Model"],
          note: "comportamento de domínio que não pertence a nenhuma Entity/Value Object",
          summary:
            "Uma operação do domínio que não pertence naturalmente a nenhuma entidade ou objeto de valor, " +
            "geralmente porque envolve vários deles — sem estado próprio e nomeada na linguagem do negócio.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Nem todo comportamento de domínio cabe em uma entidade. Transferir dinheiro entre duas contas, ou " +
                "calcular um preço com regras de várias origens, não é responsabilidade de uma conta nem de um produto " +
                "isolado. Para esses casos, DDD propõe o Domain Service: um objeto sem estado, com um nome do domínio " +
                "(`FundsTransfer`, `PricingPolicy`), que contém a regra de negócio da operação. Não é o mesmo que o " +
                "Service Layer: aquele orquestra o caso de uso (repositórios, transações, e-mail), e este contém " +
                "regra de negócio.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando uma regra do negócio não pertence a um único objeto, ela vira um serviço de domínio: sem " +
                "estado, com nome do negócio e só regra, sem infraestrutura.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O serviço recebe os objetos de domínio envolvidos, aplica a regra e os altera por meio das suas " +
                "próprias operações. Não acessa repositórios nem controla transações: quem o chama, em geral um " +
                "serviço de aplicação, cuida disso.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "domain-service.js",
              code: [
                "class Account {",
                "  constructor(id, balance, currency) { Object.assign(this, { id, balance, currency }); }",
                "  withdraw(amount) {",
                "    if (amount > this.balance) throw new Error(\"saldo insuficiente\");",
                "    this.balance -= amount;",
                "  }",
                "  deposit(amount) { this.balance += amount; }",
                "}",
                "",
                "// A regra de transferência envolve duas contas: não é de nenhuma delas",
                "class FundsTransfer {",
                "  transfer(from, to, amount) {",
                "    if (from.currency !== to.currency) throw new Error(\"as contas devem ter a mesma moeda\");",
                "    if (from.id === to.id) throw new Error(\"origem e destino devem ser diferentes\");",
                "    from.withdraw(amount);",
                "    to.deposit(amount);",
                "  }",
                "}",
                "",
                "const a = new Account(1, 100, \"BRL\");",
                "const b = new Account(2, 0, \"BRL\");",
                "new FundsTransfer().transfer(a, b, 40);   // a: 60, b: 40",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`FundsTransfer` não guarda estado e não sabe de banco: só aplica a regra da transferência sobre dois " +
                "objetos de domínio. Cada conta continua protegendo o próprio saldo.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando uma regra de negócio envolve vários agregados ou entidades e não faz sentido em nenhum deles.",
                "Para conceitos do domínio que são operações e não coisas, como uma política de preços ou uma verificação de elegibilidade, sem estado próprio.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se a regra cabe em uma entidade ou em um objeto de valor, ponha-a lá: serviços demais esvaziam os objetos e levam ao Anemic Domain Model.",
                "Não confunda com o Service Layer: se o serviço usa repositórios, transações ou envia e-mails, ele é de aplicação, e não de domínio.",
                "Um serviço com nome genérico, como `OrderManager` ou `Utils`, é sinal de que a regra ainda não foi entendida; nomeie pelo que o negócio faz.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma política de preços",
              context: "Uma regra que consulta várias informações, sem pertencer a nenhuma delas.",
              code: {
                language: "javascript",
                filename: "pricing-policy.js",
                code: [
                  "class PricingPolicy {",
                  "  priceFor(product, customer, quantity) {",
                  "    let price = product.basePrice * quantity;",
                  "    if (customer.isVip) price *= 0.9;              // desconto do cliente",
                  "    if (quantity >= 10) price *= 0.95;             // desconto por volume",
                  "    return Math.round(price * 100) / 100;",
                  "  }",
                  "}",
                  "",
                  "new PricingPolicy().priceFor({ basePrice: 20 }, { isVip: true }, 10);   // 171",
                ].join("\n"),
              },
              explanation:
                "O preço depende do produto, do cliente e da quantidade, e nenhum deles é o dono da regra. Um serviço " +
                "de domínio, sem estado, é o lugar natural.",
            },
            {
              title: "Um serviço que deveria ser um método",
              context: "O sinal de alerta é um serviço que só manipula os dados de um único objeto.",
              code: {
                language: "javascript",
                filename: "should-be-method.js",
                code: [
                  "// Sinal de alerta: a regra é toda sobre um Order, e o serviço só mexe nele",
                  "class OrderService {",
                  "  addItem(order, item) { if (order.confirmed) throw new Error(\"...\"); order.items.push(item); }",
                  "}",
                  "",
                  "// Melhor: a regra pertence a Order",
                  "class Order {",
                  "  #items = []; confirmed = false;",
                  "  addItem(item) { if (this.confirmed) throw new Error(\"pedido já confirmado\"); this.#items.push(item); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se toda a regra gira em torno de um objeto, ela é dele. Reservar o serviço de domínio para o que não " +
                "cabe em nenhum objeto mantém o modelo rico.",
            },
            {
              title: "Serviço de domínio e serviço de aplicação, lado a lado",
              context: "Cada um tem o seu papel, e o de aplicação chama o de domínio.",
              code: {
                language: "javascript",
                filename: "domain-vs-application.js",
                code: [
                  "// Serviço de aplicação: orquestra o caso de uso",
                  "class TransferFundsUseCase {",
                  "  constructor(accounts, transfer) { this.accounts = accounts; this.transfer = transfer; }",
                  "",
                  "  async execute({ fromId, toId, amount }) {",
                  "    const from = await this.accounts.findById(fromId);   // infraestrutura",
                  "    const to = await this.accounts.findById(toId);",
                  "    this.transfer.transfer(from, to, amount);            // a regra, no serviço de domínio",
                  "    await this.accounts.save(from);",
                  "    await this.accounts.save(to);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O caso de uso busca e salva; a regra da transferência fica em `FundsTransfer`. Assim a regra é " +
                "testada sem repositórios, e o caso de uso, sem repetir a regra.",
            },
          ],
          exercise: {
            problem:
              "A regra de \"cobrar taxa de saque entre bancos diferentes\" está copiada no controlador e em um script. " +
              "Ela envolve duas contas e não é de nenhuma delas.",
            problemCode: {
              language: "javascript",
              filename: "fee.js",
              code: [
                "// No controlador",
                "const fee = from.bank !== to.bank ? amount * 0.01 : 0;",
                "from.withdraw(amount + fee);",
                "to.deposit(amount);",
                "",
                "// No script de importação: cópia, com um bug (esqueceu a taxa)",
                "from.withdraw(amount);",
                "to.deposit(amount);",
              ].join("\n"),
            },
            task:
              "Extraia um serviço de domínio `TransferPolicy` com `transfer(from, to, amount)` que aplique a taxa entre " +
              "bancos diferentes, e use-o nos dois lugares.",
            hint: "O serviço não guarda estado: recebe as duas contas, calcula a taxa e chama `withdraw` e `deposit`.",
            solution: {
              code: {
                language: "javascript",
                filename: "fee.fixed.js",
                code: [
                  "class TransferPolicy {",
                  "  feeFor(from, to, amount) { return from.bank !== to.bank ? amount * 0.01 : 0; }",
                  "",
                  "  transfer(from, to, amount) {",
                  "    const fee = this.feeFor(from, to, amount);",
                  "    from.withdraw(amount + fee);",
                  "    to.deposit(amount);",
                  "    return { fee };",
                  "  }",
                  "}",
                  "",
                  "// Controlador e script usam a mesma regra",
                  "new TransferPolicy().transfer(from, to, amount);",
                ].join("\n"),
              },
              explanation:
                "A taxa existe em um só lugar, e o script de importação deixa de esquecê-la. O serviço não tem estado " +
                "nem infraestrutura: só a regra que envolve as duas contas.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Domain Event",
          requires: ["Domain Model"],
          note: "algo relevante que aconteceu no domínio",
          summary:
            "O registro imutável de algo relevante que aconteceu no domínio, nomeado no passado — como `PedidoConfirmado` " +
            "— que permite a outras partes do sistema reagirem sem acoplamento com quem o gerou.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Domain Event descreve um fato do negócio que já ocorreu: `OrderPlaced`, `PaymentReceived`, " +
                "`MemberSuspended`. Como é um fato, é imutável e nomeado no passado, com os dados necessários para " +
                "entender o que aconteceu. O agregado o registra quando o fato ocorre, e outras partes do sistema, " +
                "de outros agregados ou contextos, reagem a ele. É o Observer em escala de domínio, e o caminho para " +
                "manter a consistência entre agregados sem acoplá-los.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando algo relevante acontece, registre um fato, no passado, com a linguagem do negócio: quem se " +
                "interessa reage a ele, sem que quem o gerou precise conhecê-lo.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O agregado acumula os eventos que ocorreram durante a operação. Depois de salvar, quem coordena os " +
                "publica, e os manipuladores interessados reagem, cada um no seu tempo.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "domain-event.js",
              code: [
                "// O evento é um fato imutável, nomeado no passado",
                "const orderPlaced = (orderId, customerId, total) =>",
                "  Object.freeze({ type: \"OrderPlaced\", orderId, customerId, total, occurredAt: new Date() });",
                "",
                "class Order {",
                "  #events = [];",
                "  status = \"draft\";",
                "  constructor(id, customerId, total) { Object.assign(this, { id, customerId, total }); }",
                "",
                "  place() {",
                "    if (this.status !== \"draft\") throw new Error(\"o pedido já foi feito\");",
                "    this.status = \"placed\";",
                "    this.#events.push(orderPlaced(this.id, this.customerId, this.total));   // registra o fato",
                "  }",
                "",
                "  pullEvents() { const events = this.#events; this.#events = []; return events; }",
                "}",
                "",
                "// Quem coordena publica os eventos depois de salvar; os interessados reagem",
                "const handlers = {",
                "  OrderPlaced: [",
                "    (e) => console.log(`enviar confirmação do pedido ${e.orderId}`),",
                "    (e) => console.log(`reservar estoque do pedido ${e.orderId}`),",
                "  ],",
                "};",
                "",
                "const order = new Order(1, 42, 300);",
                "order.place();",
                "for (const event of order.pullEvents()) handlers[event.type]?.forEach((handle) => handle(event));",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`Order` não menciona e-mail nem estoque: só registra `OrderPlaced`. Adicionar uma reação nova é " +
                "registrar mais um manipulador, sem alterar o pedido.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando outras partes do sistema precisam reagir a algo que aconteceu no domínio, e o agregado não deve conhecê-las.",
                "Para manter a consistência entre agregados, ou entre contextos, de forma eventual, em vez de uma transação que atravesse todos.",
                "Para manter um histórico ou uma auditoria do que aconteceu.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Regras dentro do mesmo agregado devem ser resolvidas ali, e não por eventos: o evento complica o que uma chamada resolveria.",
                "O fluxo fica implícito e difícil de seguir: é preciso descobrir quem reage a cada evento.",
                "Com entrega assíncrona, os manipuladores podem receber o evento mais de uma vez ou fora de ordem, e precisam ser idempotentes.",
                "Eventos de granularidade fina demais, um para cada atribuição de campo, poluem o sistema sem expressar nada do negócio.",
              ],
            },
          ],
          examples: [
            {
              title: "Nomes no passado, com dados do fato",
              context: "O evento conta o que aconteceu, e não o que se quer que aconteça.",
              code: {
                language: "javascript",
                filename: "naming.js",
                code: [
                  "// Comando (imperativo, algo que se pede): PlaceOrder, ChargeCustomer",
                  "// Evento (passado, algo que aconteceu):    OrderPlaced, CustomerCharged",
                  "",
                  "const customerCharged = Object.freeze({",
                  "  type: \"CustomerCharged\",",
                  "  customerId: 42,",
                  "  amount: 300,",
                  "  occurredAt: new Date(),",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Um comando pode ser recusado, e um evento já aconteceu e não pode ser desfeito. Ser imutável é " +
                "consequência de ser um fato.",
            },
            {
              title: "Manipuladores idempotentes",
              context: "Sem garantias fortes de entrega, o mesmo evento pode chegar duas vezes.",
              code: {
                language: "javascript",
                filename: "idempotent.js",
                code: [
                  "const processed = new Set();",
                  "",
                  "function sendConfirmation(event) {",
                  "  if (processed.has(event.orderId)) return;   // já tratado: ignora a duplicata",
                  "  processed.add(event.orderId);",
                  "  console.log(`e-mail do pedido ${event.orderId}`);",
                  "}",
                  "",
                  "const event = { type: \"OrderPlaced\", orderId: 1 };",
                  "sendConfirmation(event);",
                  "sendConfirmation(event);   // o cliente não recebe dois e-mails",
                ].join("\n"),
              },
              explanation:
                "Guardar o que já foi tratado torna o manipulador seguro contra duplicatas, uma preocupação real " +
                "assim que os eventos deixam de ser chamadas diretas.",
            },
            {
              title: "Consistência entre agregados por evento",
              context: "Uma regra que atravessa dois agregados é dividida em duas operações, ligadas por um evento.",
              code: {
                language: "javascript",
                filename: "cross-aggregate.js",
                code: [
                  "// 1. O pedido é confirmado e registra o fato",
                  "order.confirm();   // registra OrderConfirmed",
                  "",
                  "// 2. Em outra transação, o estoque reage ao evento",
                  "function onOrderConfirmed(event, inventory) {",
                  "  for (const line of event.lines) inventory.reserve(line.productId, line.quantity);",
                  "}",
                  "",
                  "// Entre 1 e 2 há um intervalo em que os dois estão momentaneamente diferentes:",
                  "// é a consistência eventual",
                ].join("\n"),
              },
              explanation:
                "Cada agregado continua consistente dentro da sua fronteira. Entre agregados, o sistema converge com " +
                "um pequeno atraso, o preço de não os travar em uma única transação.",
            },
          ],
          exercise: {
            problem:
              "`Order.place()` chama diretamente o e-mail e o estoque. O pedido conhece tudo o que acontece depois " +
              "que ele é feito, e testá-lo exige dublês para os dois.",
            problemCode: {
              language: "javascript",
              filename: "order.js",
              code: [
                "class Order {",
                "  constructor(id, mailer, inventory) { Object.assign(this, { id, mailer, inventory }); }",
                "  place() {",
                "    this.status = \"placed\";",
                "    this.mailer.send(`Pedido ${this.id} feito`);",
                "    this.inventory.reserve(this.id);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Faça `place()` só registrar um evento `OrderPlaced`, e mostre os manipuladores de e-mail e de estoque " +
              "reagindo a ele.",
            hint: "`Order` deixa de receber `mailer` e `inventory`. Ele guarda os eventos, e quem coordena os publica.",
            solution: {
              code: {
                language: "javascript",
                filename: "order.fixed.js",
                code: [
                  "class Order {",
                  "  #events = [];",
                  "  constructor(id) { this.id = id; }",
                  "",
                  "  place() {",
                  "    this.status = \"placed\";",
                  "    this.#events.push(Object.freeze({ type: \"OrderPlaced\", orderId: this.id }));",
                  "  }",
                  "",
                  "  pullEvents() { const events = this.#events; this.#events = []; return events; }",
                  "}",
                  "",
                  "const handlers = {",
                  "  OrderPlaced: [",
                  "    (e) => mailer.send(`Pedido ${e.orderId} feito`),",
                  "    (e) => inventory.reserve(e.orderId),",
                  "  ],",
                  "};",
                  "",
                  "const order = new Order(1);",
                  "order.place();",
                  "for (const event of order.pullEvents()) handlers[event.type].forEach((handle) => handle(event));",
                ].join("\n"),
              },
              explanation:
                "O pedido só declara o que aconteceu, e não conhece e-mail nem estoque. Uma nova reação é mais um " +
                "manipulador, e o teste do pedido verifica apenas o evento registrado.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Bounded Context",
          requires: ["Ubiquitous Language"],
          note: "capstone — a fronteira dentro da qual o modelo (e a linguagem) é consistente",
          summary:
            "A fronteira explícita dentro da qual um modelo de domínio, e a sua linguagem, é consistente e tem um " +
            "só significado — fora dela, os mesmos termos podem significar outra coisa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em um negócio grande, um único modelo para tudo não funciona: \"cliente\" significa coisas diferentes " +
                "para vendas, para suporte e para o financeiro. Um Bounded Context é a fronteira dentro da qual um " +
                "modelo é único e coerente: cada termo tem um só significado, e a Ubiquitous Language é consistente. " +
                "Cada contexto tem o seu próprio modelo, e muitas vezes o seu próprio time, código e banco. As " +
                "fronteiras seguem o negócio e a linguagem, e não as camadas técnicas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Não busque um modelo único para a empresa toda: divida o domínio em contextos, cada um com um modelo " +
                "e uma linguagem coerentes dentro da sua fronteira.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um modelo compartilhado por todas as áreas acaba com uma classe gigante, com campos que só interessam " +
                "a uma delas e regras que se contradizem. Dividir em contextos permite que cada equipe evolua o seu " +
                "modelo de forma independente e com termos precisos. Também é a base para dividir um sistema em " +
                "módulos ou serviços com fronteiras que fazem sentido para o negócio, o tema dos estilos arquiteturais.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o conceito de produto em dois contextos, cada um com o modelo de que precisa:" },
            {
              type: "code",
              language: "javascript",
              filename: "bounded-context.js",
              code: [
                "// Contexto: Catálogo — o que o cliente vê e compra",
                "class CatalogProduct {",
                "  constructor(sku, name, description, price, images) {",
                "    Object.assign(this, { sku, name, description, price, images });",
                "  }",
                "  isOnSale() { return this.price.promotional !== null; }",
                "}",
                "",
                "// Contexto: Expedição — o que é preciso para enviar",
                "class ShippingItem {",
                "  constructor(sku, weightKg, dimensions, fragile) {",
                "    Object.assign(this, { sku, weightKg, dimensions, fragile });",
                "  }",
                "  requiresSpecialPackaging() { return this.fragile || this.weightKg > 30; }",
                "}",
                "",
                "// O sku é o vínculo entre os contextos; cada um modela só o que lhe interessa",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O catálogo não precisa saber de peso, e a expedição não precisa de descrição nem de imagens. Cada " +
                "modelo é pequeno e coerente, e o `sku` os liga sem que um conheça o outro por dentro.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um modelo único para todas as áreas cresce sem parar, mistura conceitos que mudam por motivos diferentes e faz todas as equipes dependerem umas das outras.",
                "Traçar as fronteiras por camadas técnicas, como \"o contexto da API\" ou \"o do banco\", ignora o negócio; as fronteiras devem seguir a linguagem.",
                "Contextos que se conhecem por dentro, compartilhando classes ou tabelas, deixam de ser contextos de verdade; a integração deve passar por um contrato explícito.",
              ],
            },
          ],
          examples: [
            {
              title: "A mesma palavra em dois contextos",
              context: "O termo é o mesmo, mas o modelo por trás é diferente em cada fronteira.",
              code: {
                language: "javascript",
                filename: "two-customers.js",
                code: [
                  "// Vendas: importa o crédito e as condições comerciais",
                  "const salesCustomer = { id: 42, creditLimit: 5000, priceList: \"atacado\" };",
                  "",
                  "// Suporte: importa o histórico de atendimento",
                  "const supportCustomer = { id: 42, openTickets: 2, plan: \"premium\" };",
                  "",
                  "// Mesmo id, dois modelos: cada contexto guarda só o que faz sentido para ele",
                ].join("\n"),
              },
              explanation:
                "Tentar unir os dois em um único `Customer` traria campos irrelevantes para cada lado e regras que se " +
                "atropelam. Separados, cada modelo permanece simples.",
            },
            {
              title: "Contextos como módulos separados",
              context: "A fronteira aparece na organização do código, com uma interface pública pequena.",
              code: {
                language: "javascript",
                filename: "structure.js",
                code: [
                  "// src/",
                  "//   catalog/      → modelo e regras do catálogo",
                  "//     index.js      (a única interface pública do contexto)",
                  "//   shipping/     → modelo e regras da expedição",
                  "//     index.js",
                  "",
                  "// shipping/ importa só o que catalog/index.js exporta, e nunca os arquivos internos",
                  "import { getProductSummary } from \"../catalog/index.js\";",
                ].join("\n"),
              },
              explanation:
                "Cada contexto expõe uma porta pública e esconde o resto. Assim, o modelo interno pode mudar sem " +
                "afetar os outros contextos.",
            },
            {
              title: "O modelo único que engorda",
              context: "O sintoma clássico da ausência de fronteiras.",
              code: {
                language: "javascript",
                filename: "god-model.js",
                code: [
                  "// Um único Product, usado por catálogo, expedição, financeiro e estoque",
                  "class Product {",
                  "  // catálogo",
                  "  name; description; images; promotionalPrice;",
                  "  // expedição",
                  "  weightKg; dimensions; fragile;",
                  "  // financeiro",
                  "  taxCode; costPrice; margin;",
                  "  // estoque",
                  "  warehouseLocation; reorderLevel;",
                  "}",
                  "// Toda mudança em qualquer área mexe na mesma classe, e todas as equipes dependem dela.",
                ].join("\n"),
              },
              explanation:
                "Quanto mais áreas usam a mesma classe, mais ela cresce e mais difícil é mudá-la sem afetar alguém. A " +
                "separação em contextos devolve a autonomia a cada equipe.",
            },
          ],
          exercise: {
            problem:
              "A classe `Product` é usada pelo catálogo e pela expedição, e cada mudança em uma das áreas exige a " +
              "revisão da outra. Ela já tem campos que só uma das equipes entende.",
            problemCode: {
              language: "javascript",
              filename: "product.js",
              code: [
                "class Product {",
                "  constructor(sku, name, description, price, weightKg, dimensions, fragile) {",
                "    Object.assign(this, { sku, name, description, price, weightKg, dimensions, fragile });",
                "  }",
                "  isOnSale() { return this.price.promotional !== null; }",
                "  requiresSpecialPackaging() { return this.fragile || this.weightKg > 30; }",
                "}",
              ].join("\n"),
            },
            task:
              "Divida em dois modelos, um do contexto de Catálogo e outro do de Expedição, cada um só com os campos e " +
              "regras que lhe pertencem, ligados pelo `sku`.",
            hint: "O catálogo fica com nome, descrição, preço e `isOnSale`. A expedição, com peso, dimensões, fragilidade e a regra de embalagem.",
            solution: {
              code: {
                language: "javascript",
                filename: "product.fixed.js",
                code: [
                  "// Contexto Catálogo",
                  "class CatalogProduct {",
                  "  constructor(sku, name, description, price) {",
                  "    Object.assign(this, { sku, name, description, price });",
                  "  }",
                  "  isOnSale() { return this.price.promotional !== null; }",
                  "}",
                  "",
                  "// Contexto Expedição",
                  "class ShippingItem {",
                  "  constructor(sku, weightKg, dimensions, fragile) {",
                  "    Object.assign(this, { sku, weightKg, dimensions, fragile });",
                  "  }",
                  "  requiresSpecialPackaging() { return this.fragile || this.weightKg > 30; }",
                  "}",
                  "",
                  "// O sku liga os dois; nenhuma equipe depende dos campos da outra",
                ].join("\n"),
              },
              explanation:
                "Cada contexto tem um modelo pequeno e coerente. Mudar o peso de um produto afeta só a expedição, e " +
                "mudar a descrição afeta só o catálogo.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Context Mapping",
          requires: ["Bounded Context"],
          note: "capstone final — relação entre Bounded Contexts; ponte para Architecture / Architectural Styles",
          summary:
            "O mapa das relações entre os Bounded Contexts — quem depende de quem, e de que forma —, com padrões " +
            "como Anti-Corruption Layer, Customer/Supplier e Shared Kernel para organizar cada integração.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Os contextos delimitados não vivem isolados: um consome dados do outro, e as equipes precisam se " +
                "coordenar. O Context Mapping descreve essas relações de forma explícita e escolhe um padrão para cada " +
                "uma. Entre os mais usados: Customer/Supplier (o contexto a montante atende às necessidades do a " +
                "jusante), Conformist (o a jusante adota o modelo do outro como está), Anti-Corruption Layer (uma " +
                "camada tradutora protege o modelo próprio), Shared Kernel (um pedaço pequeno do modelo é " +
                "compartilhado) e Separate Ways (não há integração).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada integração entre contextos é uma decisão de design: torne a relação explícita e escolha o " +
                "quanto o seu modelo aceita ser influenciado pelo do outro.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Liste os contextos e, para cada par que se integra, registre quem está a montante (fornece), quem " +
                "está a jusante (consome) e qual é o padrão de relação. Quando o modelo do outro lado é ruim ou " +
                "instável, uma Anti-Corruption Layer traduz o que chega para o seu próprio modelo, no espírito do Adapter.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "context-mapping.js",
              code: [
                "// O mapa como dados: explícito, e fácil de revisar em equipe",
                "const contextMap = [",
                "  { upstream: \"Billing\",  downstream: \"Sales\",    pattern: \"anticorruption-layer\" },",
                "  { upstream: \"Catalog\",  downstream: \"Shipping\", pattern: \"customer-supplier\" },",
                "  { upstream: \"Identity\", downstream: \"Sales\",    pattern: \"conformist\" },",
                "];",
                "",
                "// Anti-Corruption Layer: traduz o modelo legado do Billing para o modelo de Vendas",
                "// Legado: { cust_nm: \"Ana\", cust_st: \"A\", cr_lim: \"5000.00\" }",
                "class BillingCustomerTranslator {",
                "  toSalesCustomer(legacy) {",
                "    return {",
                "      name: legacy.cust_nm,",
                "      active: legacy.cust_st === \"A\",",
                "      creditLimit: Number(legacy.cr_lim),",
                "    };",
                "  }",
                "}",
                "",
                "new BillingCustomerTranslator().toSalesCustomer({ cust_nm: \"Ana\", cust_st: \"A\", cr_lim: \"5000.00\" });",
                "// { name: \"Ana\", active: true, creditLimit: 5000 }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O modelo de Vendas nunca vê `cust_st` nem `cr_lim`: a camada tradutora absorve as esquisitices do " +
                "sistema legado, e se ele mudar, só o tradutor precisa ser ajustado.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando há mais de um contexto ou equipe integrados, para tornar explícitas as dependências e as expectativas de cada lado.",
                "Antes de desenhar integrações e limites de serviços, para decidir o quanto cada contexto precisa se proteger dos outros.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em um único contexto, ou em um sistema pequeno com uma só equipe, o mapa é formalidade sem efeito.",
                "Um mapa que não é atualizado envelhece e passa a enganar; ele precisa acompanhar a realidade das equipes e dos sistemas.",
                "Uma Anti-Corruption Layer tem custo, com código de tradução para manter; se o modelo do outro lado é bom e estável, ser conformista pode ser mais barato.",
                "Compartilhar um Shared Kernel amarra as equipes: qualquer mudança nele exige a concordância de todas.",
              ],
            },
          ],
          examples: [
            {
              title: "Customer/Supplier com um contrato publicado",
              context: "O contexto a montante se compromete com um formato estável para quem depende dele.",
              code: {
                language: "javascript",
                filename: "customer-supplier.js",
                code: [
                  "// Catálogo (a montante) publica um contrato estável, com versão",
                  "const productPublishedV1 = {",
                  "  type: \"ProductPublished\",",
                  "  version: 1,",
                  "  sku: \"ABC-1\",",
                  "  name: \"Caneta\",",
                  "  weightKg: 0.02,",
                  "};",
                  "",
                  "// Expedição (a jusante) consome o contrato e o transforma no seu modelo",
                  "function onProductPublished(event) {",
                  "  if (event.version !== 1) throw new Error(`versão não suportada: ${event.version}`);",
                  "  return new ShippingItem(event.sku, event.weightKg, null, false);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Quem consome sabe o que esperar, e quem fornece sabe que não pode quebrar o contrato sem versionar. " +
                "Essa combinação é o que o padrão Customer/Supplier organiza.",
            },
            {
              title: "Conformista: adotar o modelo do outro como está",
              context: "Às vezes o custo de traduzir é maior que o de simplesmente aceitar o modelo de quem fornece.",
              code: {
                language: "javascript",
                filename: "conformist.js",
                code: [
                  "// O serviço de identidade é externo e estável; Vendas adota o seu modelo diretamente",
                  "function greet(identityUser) {",
                  "  return `Olá, ${identityUser.displayName}`;   // usa o campo do modelo do outro contexto",
                  "}",
                  "",
                  "// Sem camada de tradução: menos código, mas Vendas acompanha as mudanças do outro modelo",
                ].join("\n"),
              },
              explanation:
                "Ser conformista é uma escolha consciente, adequada quando o modelo do outro é bom e estável. O " +
                "risco é acompanhar toda mudança dele, sem poder de negociação.",
            },
            {
              title: "Separate Ways: a integração que não vale o custo",
              context: "Nem todo par de contextos precisa conversar.",
              code: {
                language: "javascript",
                filename: "separate-ways.js",
                code: [
                  "// O contexto de Recursos Humanos e o de Catálogo não têm o que trocar.",
                  "// Decisão registrada no mapa, e sem integração para manter:",
                  "const decision = { between: [\"HR\", \"Catalog\"], pattern: \"separate-ways\" };",
                ].join("\n"),
              },
              explanation:
                "Registrar que dois contextos seguem caminhos separados evita integrações desnecessárias e deixa a " +
                "decisão explícita para quem chegar depois.",
            },
          ],
          exercise: {
            problem:
              "O contexto de Vendas lê diretamente as colunas do sistema legado de estoque, e o modelo esquisito " +
              "do legado já vazou por todo o código de Vendas.",
            problemCode: {
              language: "javascript",
              filename: "legacy-leak.js",
              code: [
                "// Legado: { itm_cd: \"A1\", qty_av: \"12\", loc_flg: \"W\" }",
                "function canSell(legacyRow, quantity) {",
                "  return Number(legacyRow.qty_av) >= quantity && legacyRow.loc_flg === \"W\";   // usa o vocabulário do legado",
                "}",
              ].join("\n"),
            },
            task:
              "Crie uma Anti-Corruption Layer, um `StockTranslator` que converta a linha legada para um modelo de " +
              "Vendas (`sku`, `available`, `inWarehouse`), e reescreva `canSell` sobre esse modelo.",
            hint: "O tradutor converte `qty_av` (texto) em número e `loc_flg === \"W\"` em um booleano. `canSell` só conhece o novo modelo.",
            solution: {
              code: {
                language: "javascript",
                filename: "legacy-leak.fixed.js",
                code: [
                  "class StockTranslator {",
                  "  toSalesStock(legacyRow) {",
                  "    return {",
                  "      sku: legacyRow.itm_cd,",
                  "      available: Number(legacyRow.qty_av),",
                  "      inWarehouse: legacyRow.loc_flg === \"W\",",
                  "    };",
                  "  }",
                  "}",
                  "",
                  "// Vendas só conhece o próprio modelo",
                  "function canSell(stock, quantity) {",
                  "  return stock.available >= quantity && stock.inWarehouse;",
                  "}",
                  "",
                  "const stock = new StockTranslator().toSalesStock({ itm_cd: \"A1\", qty_av: \"12\", loc_flg: \"W\" });",
                  "canSell(stock, 10);   // true",
                ].join("\n"),
              },
              explanation:
                "O vocabulário do legado ficou preso ao tradutor. Se o sistema de estoque mudar, ou for substituído, " +
                "só o `StockTranslator` é alterado, e o código de Vendas permanece igual.",
            },
          },
        }),
      ],
    }),
  ],
});
