import { area, module, concept } from "../builders.js";

export default area({
  slug: "programming-foundations",
  order: 10,
  title: "Programming Foundations",
  color: "#5B8CFF",
  summary:
    "Mecânica de linguagem, agnóstica de stack: paradigma, memória e runtime, tipos, " +
    "funções puras, estruturas de dados, complexidade, async e concorrência. Pré-requisito de tudo.",
  phase: "Fase 2 concluída (2026-09-03)",
  modules: [
    module({
      slug: "programming-fundamentals",
      order: 10,
      title: "Programming Fundamentals",
      summary:
        "Vocabulário de paradigma e critérios de qualidade estrutural. Os 4 pilares, " +
        "interface/contrato, composição e, por fim, coupling/cohesion/SoC.",
      relocated: [
        {
          title: "Composition over Inheritance",
          to: "Epic 04 · Software Design / Design Principles",
          reason:
            "O mecanismo Composition fica aqui; a heurística consolida com a Task homônima de " +
            "\"Additional Design Principles\". Preservada, não apagada.",
        },
      ],
      suggestions: ["Modularity", "Encapsulation Boundaries (module / package / service)"],
      concepts: [
        concept({
          order: 10,
          title: "Abstraction",
          note: "Abstração",
          summary:
            "Abstraction é expor só o que quem usa uma parte do sistema precisa saber e esconder os detalhes de como " +
            "ela funciona.",
          revisit: ["Software Design / Object-Oriented Design", "Architecture Fundamentals"],
          // Piloto editorial (template canônico da Concept Study Page) — só este
          // Concept. content/examples/exercise já existiam como defaults no
          // builder (null/[]/null); esta é a primeira vez que são preenchidos.
          // note: R3.5.11 passa a exibir como subtítulo sob o H1 (tradução curta
          // do termo em inglês) — deixa de ser só metadata editorial invisível.
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Você interage com uma representação simplificada — um nome, uma assinatura, um conjunto de operações — " +
                "sem precisar carregar na cabeça a implementação inteira.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se para usar algo você precisa conhecer a implementação, a abstração falhou.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sistemas de software crescem rápido demais para qualquer pessoa segurar todos os detalhes na " +
                "cabeça ao mesmo tempo. Imagine precisar entender a implementação completa de leitura de disco, " +
                "drivers e protocolo de rede só para salvar um arquivo ou chamar uma API. Abstraction existe " +
                "para que cada parte do sistema possa ser usada — e trocada — sem que quem a consome precise " +
                "reaprender o que está por trás dela a cada mudança.",
            },
            {
              type: "paragraph",
              text:
                "Isso é diferente de simplesmente saber que uma função existe. Entender por que Abstraction " +
                "existe significa reconhecer que ela é uma escolha deliberada de design: alguém decidiu onde " +
                "traçar a fronteira entre o que é público (a interface) e o que é interno (a implementação), " +
                "para que times inteiros consigam trabalhar em paralelo sem pisar uns nos outros.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "O exemplo abaixo usa fetch, uma abstração já embutida na plataforma web:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "user-service.js",
              code: [
                "async function getUser(id) {",
                "  const response = await fetch(`/api/users/${id}`);",
                "  return response.json();",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A abstração aqui é a própria função fetch: ela esconde a criação do socket, o handshake " +
                "TCP/TLS, a montagem dos cabeçalhos HTTP e o parsing da resposta. Quem chama getUser só " +
                "precisa saber que existe uma Promise que resolve com uma resposta — nada sobre como os bytes " +
                "chegam até ali.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Abstrair cedo demais, antes de ver o padrão se repetir, cria interfaces que não servem a nenhum caso real.",
                "Toda abstração esconde algo: quando ela vaza e o detalhe escondido importa, fica mais difícil entender o " +
                "que aconteceu.",
                "Camadas de abstração demais deixam o código indireto e difícil de acompanhar.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma função que abstrai um cálculo",
              context: "Toda função é uma abstração: ela empacota um comportamento atrás de um nome e uma assinatura.",
              code: {
                language: "javascript",
                filename: "validators.js",
                code: ["function isValidEmail(value) {", "  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);", "}"].join("\n"),
              },
              explanation:
                "Quem chama isValidEmail(email) não precisa entender a regex nem por que ela foi escrita daquele " +
                "jeito — só precisa saber que a função devolve true ou false para um endereço de e-mail.",
            },
            {
              title: "Um componente de UI",
              context: "Interfaces de usuário também escondem complexidade atrás de uma API simples.",
              code: {
                language: "jsx",
                filename: "save-button.jsx",
                code: ["<Button variant=\"primary\" onClick={handleSave}>", "  Salvar", "</Button>"].join("\n"),
              },
              explanation:
                "Quem usa <Button> não sabe (nem precisa saber) como o componente lida com foco, estados de " +
                "hover, acessibilidade ou o CSS por trás do variant=\"primary\". Tudo isso está abstraído atrás " +
                "de duas props.",
            },
            {
              title: "Um client de banco de dados",
              context: "Bibliotecas de acesso a dados abstraem o protocolo de comunicação com o banco.",
              code: {
                language: "javascript",
                filename: "user-repository.js",
                code: "const user = await db.users.findById(id);",
              },
              explanation:
                "Por trás dessa linha existe uma conexão TCP, um protocolo binário específico do banco, " +
                "serialização de queries e parsing de resultados. db.users.findById abstrai tudo isso em uma " +
                "chamada que parece uma simples busca em uma lista.",
            },
          ],
          exercise: {
            problem:
              "O código abaixo lê a temperatura de um sensor conectado por porta serial, decodifica os bytes " +
              "recebidos e calcula uma média móvel — tudo dentro da mesma função que também desenha o valor na tela.",
            problemCode: {
              language: "javascript",
              filename: "sensor-display.js",
              code: [
                "function updateDisplay() {",
                "  const raw = serialPort.readBytes(4);",
                "  const celsius = decodeSensorBytes(raw);",
                "  readings.push(celsius);",
                "  if (readings.length > 10) readings.shift();",
                "  const avg = readings.reduce((a, b) => a + b, 0) / readings.length;",
                "  document.querySelector(\"#temp\").textContent = avg.toFixed(1) + \"°C\";",
                "}",
              ].join("\n"),
            },
            task:
              "Proponha uma abstração que separe \"ler e calcular a temperatura\" de \"atualizar a tela\". Você não " +
              "precisa escrever a implementação completa — descreva (ou esboce em código) qual seria a assinatura " +
              "dessa nova função e o que ela esconderia de quem a chama.",
            hint:
              "Pense em qual pergunta a função deveria responder para quem a chama — e qual pergunta não é da " +
              "conta de quem só quer mostrar um número na tela.",
            solution: {
              code: {
                language: "javascript",
                filename: "sensor-display.js",
                code: [
                  "function readAverageTemperature() {",
                  "  const raw = serialPort.readBytes(4);",
                  "  const celsius = decodeSensorBytes(raw);",
                  "  readings.push(celsius);",
                  "  if (readings.length > 10) readings.shift();",
                  "  return readings.reduce((a, b) => a + b, 0) / readings.length;",
                  "}",
                  "",
                  "function updateDisplay() {",
                  "  const avg = readAverageTemperature();",
                  "  document.querySelector(\"#temp\").textContent = avg.toFixed(1) + \"°C\";",
                  "}",
                ].join("\n"),
              },
              explanation:
                "readAverageTemperature abstrai a porta serial, o formato dos bytes do sensor e a lógica da " +
                "média móvel atrás de uma função que só devolve um número. updateDisplay nem precisa saber que " +
                "existe um sensor — ela só usa o resultado. Se o sensor for trocado por outro protocolo amanhã, " +
                "só readAverageTemperature muda.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Encapsulation",
          note: "Encapsulamento",
          requires: ["Abstraction"],
          revisit: ["Software Design / Object-Oriented Design"],
          summary:
            "Encapsulation é reunir dados e o comportamento que opera sobre eles numa mesma unidade, controlando o " +
            "acesso a esse estado de fora.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A unidade pode ser uma classe, um módulo ou um closure. O estado fica lá dentro, sem acesso direto, e " +
                "quem está de fora só interage através de operações expostas propositalmente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Se o estado só muda pelos métodos da própria unidade, nenhum código de fora consegue deixá-lo inválido.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Se qualquer parte do sistema pode alterar o estado interno de outra parte diretamente, fica " +
                "impossível garantir que esse estado permaneça válido — qualquer código, em qualquer lugar, " +
                "pode colocá-lo num formato inesperado. Encapsulation existe para que as regras que protegem " +
                "um dado (os invariantes) fiquem concentradas num único lugar: dentro da própria unidade que o " +
                "possui.",
            },
            {
              type: "paragraph",
              text:
                "É também o mecanismo mais comum para conseguir Abstraction na prática: você abstrai algo " +
                "escondendo seus detalhes, e Encapsulation é a ferramenta de linguagem que faz esse esconder " +
                "acontecer de verdade — não por convenção, mas por restrição real de acesso.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Um campo privado (`#`) só pode ser lido ou alterado através dos métodos da própria classe:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "bank-account.js",
              code: [
                "class BankAccount {",
                "  #balance = 0;",
                "",
                "  deposit(amount) {",
                '    if (amount <= 0) throw new Error("Valor inválido");',
                "    this.#balance += amount;",
                "  }",
                "",
                "  get balance() {",
                "    return this.#balance;",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "#balance não existe fora da classe — não tem como escrever account.#balance = -500 de fora, " +
                "nem por engano. A única porta de entrada é deposit(), que valida o valor antes de mudar o " +
                "estado. O invariante \"saldo nunca fica inconsistente\" está protegido estruturalmente, não só " +
                "por boa vontade de quem chama.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o estado tem regras, os invariantes, que precisam valer sempre e não podem depender de quem usa.",
                "Para poder mudar a representação interna sem quebrar quem usa a classe ou o módulo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Getters e setters para tudo não encapsulam nada: expõem o estado interno com outra sintaxe.",
                "Para dados simples, sem regras, esconder o campo atrás de métodos só acrescenta cerimônia.",
              ],
            },
          ],
          examples: [
            {
              title: "Estado escondido num closure",
              context: "Encapsulation não exige classe — uma função de fábrica com closure já esconde estado.",
              code: {
                language: "javascript",
                filename: "counter.js",
                code: ["function createCounter() {", "  let count = 0;", "  return {", "    increment() { return ++count; },", "    value() { return count; },", "  };", "}"].join("\n"),
              },
              explanation:
                "count só existe dentro do closure criado por createCounter — não há nenhuma forma de acessá-lo " +
                "de fora a não ser pelos métodos increment/value que a função retorna.",
            },
            {
              title: "Um módulo escondendo cache interno",
              context: "Um módulo inteiro pode encapsular estado que nenhum outro arquivo consegue tocar.",
              code: {
                language: "javascript",
                filename: "config.js",
                code: ["let cache = null;", "", "export function getConfig() {", "  if (!cache) cache = JSON.parse(readFileSync(\"config.json\"));", "  return cache;", "}"].join("\n"),
              },
              explanation:
                "Quem importa getConfig() não sabe que existe um cache, nem como o arquivo é lido — esse estado " +
                "está encapsulado no escopo do módulo, inacessível de fora.",
            },
            {
              title: "Setter protegendo um invariante físico",
              context: "Encapsulation também aparece em validações que impedem um objeto de existir num estado impossível.",
              code: {
                language: "javascript",
                filename: "temperature.js",
                code: [
                  "class Temperature {",
                  "  #celsius;",
                  "  set celsius(value) {",
                  '    if (value < -273.15) throw new Error("Abaixo do zero absoluto");',
                  "    this.#celsius = value;",
                  "  }",
                  "  get celsius() {",
                  "    return this.#celsius;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O setter garante que #celsius nunca fique abaixo do zero absoluto — um invariante do mundo " +
                "real, protegido pela mesma técnica.",
            },
          ],
          exercise: {
            problem:
              "A pilha abaixo expõe o array interno como propriedade pública — qualquer código pode mutá-lo " +
              "diretamente, ignorando push()/pop() por completo.",
            problemCode: {
              language: "javascript",
              filename: "stack.js",
              code: [
                "class Stack {",
                "  items = [];",
                "  push(value) { this.items.push(value); }",
                "  pop() { return this.items.pop(); }",
                "}",
                "",
                "const s = new Stack();",
                "s.items.push(999); // bypassa push()",
              ].join("\n"),
            },
            task:
              "Reescreva Stack para que items não possa ser lido nem alterado de fora da classe — a única forma " +
              "de interagir com a pilha deve ser por push()/pop().",
            hint: "Campos privados (#nome) do JavaScript moderno bloqueiam acesso de fora por completo, diferente de uma propriedade pública comum.",
            solution: {
              code: {
                language: "javascript",
                filename: "stack.js",
                code: [
                  "class Stack {",
                  "  #items = [];",
                  "  push(value) { this.#items.push(value); }",
                  "  pop() { return this.#items.pop(); }",
                  "  get size() { return this.#items.length; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "#items agora é verdadeiramente privado — s.items nem existe mais de fora da classe, só " +
                "push/pop/size. O invariante \"só entra e sai pela pilha\" não pode mais ser violado de fora.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Information Hiding",
          note: "Ocultação de informação",
          requires: ["Encapsulation"],
          summary:
            "Information Hiding é o princípio de design que decide quais decisões de implementação ficam escondidas " +
            "atrás da interface pública.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ao projetar um módulo, uma classe ou uma função, você escolhe deliberadamente o que esconder — " +
                "especialmente as decisões com mais chance de mudar no futuro. Não é sobre usar private; é sobre escolher " +
                "O QUE esconder.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Esconda atrás da interface as decisões com mais chance de mudar, para que mudá-las não afete quem usa.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É comum confundir Information Hiding com Encapsulation, porque os dois andam juntos na " +
                "prática — mas Encapsulation é o mecanismo de linguagem (campos privados, módulos, closures) " +
                "que você usa para aplicar uma decisão de Information Hiding. É perfeitamente possível ter " +
                "Encapsulation técnico sem esconder informação nenhuma: uma classe pode ter campos privados " +
                "cujos getters/setters simplesmente espelham a estrutura interna, sem proteger decisão " +
                "nenhuma de mudança.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "O código abaixo é encapsulado (campos privados), mas não esconde nenhuma informação de verdade:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "rectangle.js",
              code: [
                "class Rectangle {",
                "  #width;",
                "  #height;",
                "  getWidth() { return this.#width; }",
                "  getHeight() { return this.#height; }",
                "  setWidth(w) { this.#width = w; }",
                "  setHeight(h) { this.#height = h; }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "#width e #height são tecnicamente privados, mas a interface pública é só um espelho da " +
                "estrutura interna. Se amanhã você quiser guardar area e aspectRatio em vez de largura/altura, " +
                "todo código que chama getWidth()/setWidth() quebra — nenhuma decisão de implementação foi " +
                "escondida de fato.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Encapsulation não garante Information Hiding: um campo privado com getter que devolve a estrutura interna " +
                "ainda expõe a decisão.",
                "Esconder o que não tem chance de mudar não traz benefício; esconda as decisões que provavelmente vão mudar.",
                "Esconder demais dificulta depurar e estender; a interface precisa oferecer o que quem usa realmente precisa.",
              ],
            },
          ],
          examples: [
            {
              title: "Um algoritmo de ordenação escondido",
              context: "A interface de sort() esconde completamente como a ordenação é feita por dentro.",
              code: { language: "javascript", filename: "sort.js", code: "items.sort((a, b) => a.price - b.price);" },
              explanation:
                "sort(comparator) esconde COMO a ordenação acontece — só expõe o que ela precisa de você. O " +
                "motor de JavaScript já trocou de algoritmo de ordenação entre versões sem quebrar nenhum código.",
            },
            {
              title: "Um repositório escondendo a fonte dos dados",
              context: "Quem consome o repositório não sabe (nem precisa saber) de onde os dados vêm.",
              code: {
                language: "javascript",
                filename: "user-repository.js",
                code: ["class UserRepository {", "  async findById(id) {", "    return this.#source.query(id);", "  }", "}"].join("\n"),
              },
              explanation:
                "A decisão \"onde os dados moram\" está escondida atrás de findById. Trocar Postgres por Redis " +
                "não exige mudar nenhum código que consome UserRepository.",
            },
            {
              title: "Uma feature flag escondendo sua origem",
              context: "A função esconde se a flag vem de env var, de um serviço remoto ou de um arquivo.",
              code: {
                language: "javascript",
                filename: "feature-flags.js",
                code: ["function isFeatureEnabled(name) {", '  return process.env[`FEATURE_${name}`] === "true";', "}"].join("\n"),
              },
              explanation:
                "Hoje a decisão é ler de variável de ambiente; amanhã pode virar consultar um serviço de " +
                "feature flags. Quem chama isFeatureEnabled nunca precisa saber disso.",
            },
          ],
          exercise: {
            problem:
              "A função de frete abaixo expõe a fórmula de cálculo inteira para quem chama — para simular um " +
              "frete sem prioridade, é preciso conhecer os parâmetros exatos da fórmula.",
            problemCode: {
              language: "javascript",
              filename: "shipping.js",
              code: [
                "function shippingCost(weightKg, distanceKm, isPriority) {",
                "  const base = weightKg * 2.5;",
                "  const distanceFee = distanceKm * 0.1;",
                "  const priorityMultiplier = isPriority ? 1.5 : 1;",
                "  return (base + distanceFee) * priorityMultiplier;",
                "}",
              ].join("\n"),
            },
            task:
              "Proponha uma mudança na interface que esconda a fórmula de cálculo por completo, mesmo que a " +
              "lógica interna mude no futuro (ex.: passar a consultar uma tabela de preços por transportadora). " +
              "Não precisa reescrever tudo — esboce como a assinatura deveria mudar.",
            hint:
              "Pense em quais parâmetros hoje \"vazam\" a fórmula interna, e se as taxas poderiam virar decisões " +
              "internas de um objeto/classe com um único método público.",
            solution: {
              code: {
                language: "javascript",
                filename: "shipping.js",
                code: [
                  "class ShippingCalculator {",
                  "  #ratePerKg = 2.5;",
                  "  #ratePerKm = 0.1;",
                  "  #priorityMultiplier = 1.5;",
                  "",
                  "  cost({ weightKg, distanceKm, priority = false }) {",
                  "    const base = weightKg * this.#ratePerKg + distanceKm * this.#ratePerKm;",
                  "    return priority ? base * this.#priorityMultiplier : base;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As taxas agora são decisões internas escondidas — podem virar uma consulta a uma tabela de " +
                "preços sem que cost() mude de assinatura. A interface pública virou só \"o quê\" (peso, " +
                "distância, prioridade), nunca \"como\" o preço é calculado.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Interface",
          note: "a fronteira",
          requires: ["Abstraction"],
          revisit: ["Software Design / Program to an Interface", "Platform / API Contract", "Testing / Contract Testing"],
          summary: "Uma Interface é o conjunto de operações que algo expõe para quem está de fora.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "É a lista do que você pode fazer com aquilo, sem revelar como isso é feito por dentro: a fronteira entre " +
                "\"por fora\" e \"por dentro\".",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Quem depende só da interface pode trocar de implementação sem perceber a diferença.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando duas partes de um sistema só se conhecem pela interface — e não pela implementação uma " +
                "da outra —, elas podem evoluir de forma independente. Trocar a implementação de um lado não " +
                "quebra o outro lado, desde que a interface continue igual. A interface é justamente o que " +
                "sobra depois que os detalhes foram abstraídos.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Duas implementações completamente diferentes podem cumprir a mesma interface implícita:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "logging.js",
              code: [
                "function renderReport(logger) {",
                '  logger.info("Iniciando relatório");',
                "  // ...",
                '  logger.info("Relatório concluído");',
                "}",
                "",
                "renderReport(console);            // usa console.info",
                "renderReport(myCustomFileLogger); // usa outro logger, mesma interface",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "renderReport não conhece a implementação de logger — só espera que ele tenha um método " +
                "info(mensagem). Isso é a interface: o contrato mínimo que qualquer logger precisa cumprir " +
                "para funcionar ali.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando há, ou é certo que haverá, mais de uma implementação, como pagamento por cartão e por Pix.",
                "Na fronteira entre partes do sistema, para que uma possa mudar sem afetar a outra.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma interface com uma única implementação e sem previsão de outra costuma ser indireção sem benefício.",
                "A assinatura sozinha não diz tudo: comportamento esperado, erros e condições precisam estar em um Contract.",
              ],
            },
          ],
          examples: [
            {
              title: "Duas implementações da mesma interface de pagamento",
              context: "O checkout depende só do contrato charge(amountCents), não de qual provedor está por trás.",
              code: {
                language: "javascript",
                filename: "payment.js",
                code: ["class StripePayment {", "  charge(amountCents) { /* chama a API da Stripe */ }", "}", "class PixPayment {", "  charge(amountCents) { /* gera um QR code Pix */ }", "}"].join("\n"),
              },
              explanation:
                "Ambas cumprem a mesma interface implícita: um método charge(amountCents). O código de checkout " +
                "troca de StripePayment para PixPayment sem mudar uma linha.",
            },
            {
              title: "A interface de um endpoint HTTP",
              context: "O contrato de entrada/saída de uma API é uma interface, mesmo sem nenhuma classe envolvida.",
              code: { language: "text", filename: "users-api.txt", code: "GET /users/:id → { id, name, email }" },
              explanation:
                "O time de backend pode reescrever o que acontece atrás desse GET — trocar banco, adicionar " +
                "cache, mudar linguagem — sem afetar quem consome a API, desde que o contrato continue igual.",
            },
            {
              title: "A interface de um componente de UI",
              context: "As props de um componente são a interface dele — o resto é implementação escondida.",
              code: { language: "jsx", filename: "chart-usage.jsx", code: "<Chart data={points} onPointClick={handleClick} />" },
              explanation:
                "data e onPointClick são a interface do componente Chart. Como ele desenha o gráfico por dentro " +
                "(SVG, canvas, uma lib de terceiros) é implementação, invisível a quem usa <Chart>.",
            },
          ],
          exercise: {
            problem:
              "O sistema de notificação abaixo está acoplado diretamente ao envio por e-mail — toda vez que " +
              "algo precisa notificar um usuário, chama sendEmail diretamente.",
            problemCode: {
              language: "javascript",
              filename: "notify.js",
              code: ["function notifyUser(user, message) {", "  sendEmail(user.email, message);", "}"].join("\n"),
            },
            task:
              "Projete uma interface que permita trocar e-mail por SMS/push/etc sem mudar notifyUser. Esboce a " +
              "assinatura que essa interface deveria ter, e como notifyUser passaria a depender dela em vez de " +
              "sendEmail diretamente.",
            hint: "Pense no menor conjunto de métodos que qualquer canal de notificação (e-mail, SMS, push) consegue implementar em comum.",
            solution: {
              code: {
                language: "javascript",
                filename: "notify.js",
                code: [
                  "// Interface implícita: qualquer notifier precisa ter send(user, message)",
                  "class EmailNotifier {",
                  "  send(user, message) { sendEmail(user.email, message); }",
                  "}",
                  "class SmsNotifier {",
                  "  send(user, message) { sendSms(user.phone, message); }",
                  "}",
                  "",
                  "function notifyUser(notifier, user, message) {",
                  "  notifier.send(user, message);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "notifyUser agora depende só da interface send(user, message), não de uma implementação " +
                "específica. Adicionar um PushNotifier no futuro não exige tocar em notifyUser — só criar uma " +
                "nova classe que cumpra a mesma interface.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Contract",
          note: "Contrato",
          requires: ["Interface"],
          revisit: ["Platform / API", "Testing & Quality Engineering / Testing Strategy / Contract Testing"],
          summary: "Um Contract é o conjunto de regras que uma Interface promete cumprir, além da assinatura dos métodos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Essas regras são de três tipos: pré-condições (o que precisa ser verdade antes de chamar), pós-condições " +
                "(o que fica garantido depois que a chamada termina) e invariantes (o que permanece verdade sempre, antes " +
                "e depois).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um Contract explícito tira as regras de uso da cabeça de quem escreveu o código e as coloca no próprio " +
                "código.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Uma Interface sozinha diz O QUE existe — os métodos, os tipos. Um Contract diz sob quais " +
                "condições isso funciona. Sem contrato explícito, essas regras vazam pra fora de formas " +
                "informais — comentários, convenção, tentativa e erro — e ficam fáceis de violar sem ninguém " +
                "perceber até algo quebrar em produção.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Uma função com pré-condição verificada no início e pós-condição verificada no fim:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "withdraw.js",
              code: [
                "function withdraw(account, amount) {",
                "  // pré-condição",
                '  if (amount <= 0) throw new Error("amount deve ser positivo");',
                '  if (amount > account.balance) throw new Error("saldo insuficiente");',
                "",
                "  const before = account.balance;",
                "  account.balance -= amount;",
                "",
                "  // pós-condição",
                '  console.assert(account.balance === before - amount, "saldo não bateu com o esperado");',
                "  return account.balance;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As duas checagens do início são o contrato de entrada (pré-condições) — quem chama withdraw " +
                "precisa garanti-las. O assert do fim documenta o contrato de saída (pós-condição): o efeito " +
                "que a função promete produzir.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um contrato não escrito existe de qualquer forma, só que na cabeça de quem escreveu o código; torne-o " +
                "explícito.",
                "Pré-condições fortes demais empurram o trabalho para quem chama; pós-condições fracas demais dão pouca " +
                "garantia.",
                "Contratos só valem se forem verificados, com validação, `assert` ou testes; comentários desatualizados enganam.",
              ],
            },
          ],
          examples: [
            {
              title: "Pré-condição num parâmetro de API",
              context: "Validar entrada explicitamente em vez de tentar \"adivinhar\" um resultado razoável.",
              code: {
                language: "javascript",
                filename: "paginate.js",
                code: [
                  "function paginate(items, page, pageSize) {",
                  '  if (page < 1) throw new RangeError("page deve ser >= 1");',
                  '  if (pageSize < 1) throw new RangeError("pageSize deve ser >= 1");',
                  "  return items.slice((page - 1) * pageSize, page * pageSize);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "paginate não tenta adivinhar o que fazer com page=0 — o contrato deixa explícito que isso é " +
                "uma violação, e falha alto (throw) em vez de devolver um resultado estranho silenciosamente.",
            },
            {
              title: "Pós-condição verificada com assert",
              context: "Documentar e checar, no próprio código, a garantia que um método promete devolver.",
              code: {
                language: "javascript",
                filename: "sorted-insert.js",
                code: [
                  "function sortedInsert(list, value) {",
                  "  const result = [...list, value].sort((a, b) => a - b);",
                  "  console.assert(",
                  "    result.every((v, i) => i === 0 || result[i - 1] <= v),",
                  '    "resultado deveria estar ordenado"',
                  "  );",
                  "  return result;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O assert documenta e verifica a pós-condição \"o resultado está sempre ordenado\" — parte do " +
                "contrato de sortedInsert, não um detalhe de implementação.",
            },
            {
              title: "Invariante que um método pode quebrar sem querer",
              context: "Nem toda violação de contrato lança erro — às vezes ela só corrompe um estado silenciosamente.",
              code: {
                language: "javascript",
                filename: "range.js",
                code: [
                  "class Range {",
                  "  constructor(min, max) {",
                  '    if (min > max) throw new Error("min não pode ser maior que max");',
                  "    this.min = min;",
                  "    this.max = max;",
                  "  }",
                  "  expand(amount) {",
                  "    this.max += amount; // precisa manter min <= max",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O invariante min <= max precisa continuar válido depois de qualquer método — expand como está " +
                "pode violá-lo se amount for negativo o bastante, o que é um contrato quebrado mesmo sem " +
                "lançar erro nenhum.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo não documenta nem verifica nenhuma pré-condição — silenciosamente devolve " +
              "Infinity quando b é 0.",
            problemCode: {
              language: "javascript",
              filename: "divide.js",
              code: ["function divide(a, b) {", "  return a / b;", "}", "", "divide(10, 0); // Infinity, sem aviso nenhum"].join("\n"),
            },
            task:
              "Reescreva divide para tornar seu contrato explícito: pré-condição (b !== 0) e pós-condição (o " +
              "resultado, multiplicado por b, deveria bater com a — dentro de uma margem de erro de ponto " +
              "flutuante).",
            hint: "Pré-condição = validação no início que lança erro; pós-condição = um assert antes do return.",
            solution: {
              code: {
                language: "javascript",
                filename: "divide.js",
                code: [
                  "function divide(a, b) {",
                  '  if (b === 0) throw new Error("divisor não pode ser zero");',
                  "",
                  "  const result = a / b;",
                  '  console.assert(Math.abs(result * b - a) < 1e-9, "resultado inconsistente com a divisão");',
                  "  return result;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agora o contrato de divide está explícito no código: a pré-condição (b !== 0) falha alto em " +
                "vez de devolver Infinity silenciosamente, e a pós-condição documenta (e verifica em " +
                "desenvolvimento) o que \"resultado correto\" significa.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Inheritance",
          note: "Herança",
          requires: ["Encapsulation"],
          revisit: ["Software Design / Object-Oriented Design", "Software Design / SOLID / Liskov Substitution Principle (LSP)"],
          summary:
            "Inheritance é o mecanismo de linguagem pelo qual uma classe reaproveita o estado e o comportamento de " +
            "outra.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A subclasse recebe o que a superclasse tem e pode sobrescrever ou estender parte disso. É uma forma de " +
                "dizer \"isso é um tipo daquilo\" (is-a).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Só herde quando a subclasse puder ocupar o lugar da base sem quebrar o que quem usa a base espera.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Reaproveitar código comum entre tipos relacionados evita repetição — se Dog e Cat compartilham " +
                "comportamento de Animal, escrever Animal uma vez e derivar as duas economiza duplicação. Mas " +
                "Inheritance não é só economia de código: ela cria uma promessa — qualquer lugar que espera um " +
                "Animal deveria funcionar corretamente com um Dog ou um Cat no lugar (o princípio por trás " +
                "disso tem nome — Liskov Substitution — e volta com mais profundidade em SOLID).",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "Uma subclasse reaproveitando estrutura e sobrescrevendo comportamento:" },
            {
              type: "code",
              language: "javascript",
              filename: "animal.js",
              code: [
                "class Animal {",
                "  constructor(name) {",
                "    this.name = name;",
                "  }",
                "  speak() {",
                "    return `${this.name} faz um som`;",
                "  }",
                "}",
                "",
                "class Dog extends Animal {",
                "  speak() {",
                "    return `${this.name} late`;",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Dog herda name e a estrutura de Animal, mas sobrescreve speak(). Qualquer código escrito para " +
                "Animal (ex.: animal.speak()) continua funcionando com um Dog — essa é a promessa que " +
                "Inheritance está fazendo.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a relação é de fato \"é um\" e a subclasse cumpre todo o contrato da classe base.",
                "Para reaproveitar comportamento comum de um conjunto pequeno e estável de tipos.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só para reaproveitar código: a subclasse que quebra a expectativa da base invalida quem depende dela.",
                "Hierarquias em cadeia deixam o comportamento espalhado por vários níveis e prendem as classes umas às " +
                "outras; prefira Composition.",
              ],
            },
          ],
          examples: [
            {
              title: "Reaproveitando comportamento comum",
              context: "Um método escrito uma vez na base funciona para qualquer subclasse.",
              code: {
                language: "javascript",
                filename: "shape.js",
                code: [
                  "class Shape {",
                  "  area() {",
                  '    throw new Error("subclasses devem implementar area()");',
                  "  }",
                  "  describe() {",
                  "    return `Área: ${this.area()}`;",
                  "  }",
                  "}",
                  "class Circle extends Shape {",
                  "  constructor(radius) { super(); this.radius = radius; }",
                  "  area() { return Math.PI * this.radius ** 2; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "describe() é escrito uma vez em Shape e funciona pra qualquer subclasse que implemente area() " +
                "— inclusive Circle, sem reescrever nada.",
            },
            {
              title: "Herança quebrando a expectativa da base",
              context: "O clássico \"quadrado não é um retângulo\" — uma violação sutil do contrato herdado.",
              code: {
                language: "javascript",
                filename: "square.js",
                code: [
                  "class Rectangle {",
                  "  setWidth(w) { this.width = w; }",
                  "  setHeight(h) { this.height = h; }",
                  "}",
                  "class Square extends Rectangle {",
                  "  setWidth(w) { this.width = this.height = w; } // quebra a expectativa de Rectangle",
                  "  setHeight(h) { this.width = this.height = h; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Código que espera um Rectangle (e assume que setWidth não muda a altura) quebra silenciosamente " +
                "se receber um Square — isso é uma violação do contrato que Inheritance implicitamente promete.",
            },
            {
              title: "Herança em cadeia",
              context: "Cada nível adiciona comportamento sem repetir o que já existe acima.",
              code: {
                language: "javascript",
                filename: "vehicles.js",
                code: ['class Vehicle { move() { return "se movendo"; } }', 'class Car extends Vehicle { honk() { return "beep"; } }', 'class SportsCar extends Car { turbo() { return "vrooom"; } }'].join("\n"),
              },
              explanation:
                "SportsCar herda de Car, que herda de Vehicle — ganha move(), honk() e turbo() na cadeia, sem " +
                "repetir nenhum deles.",
            },
          ],
          exercise: {
            problem:
              "A classe Bird abaixo assume que toda ave voa — mas Penguin extends Bird quebra essa expectativa " +
              "silenciosamente, forçando fly() a lançar erro.",
            problemCode: {
              language: "javascript",
              filename: "bird.js",
              code: [
                "class Bird {",
                '  fly() { return "voando"; }',
                "}",
                "class Penguin extends Bird {",
                '  fly() { throw new Error("pinguins não voam"); }',
                "}",
                "",
                "function makeItFly(bird) {",
                "  return bird.fly(); // quebra se bird for um Penguin",
                "}",
              ].join("\n"),
            },
            task:
              "Redesenhe a hierarquia para que makeItFly nunca receba algo que não pode voar — descreva ou " +
              "esboce como as classes deveriam se organizar, sem fazer Penguin herdar algo que promete fly().",
            hint: "Nem todo \"é um tipo de\" precisa vir de uma única hierarquia de voo — pense em separar \"consegue voar\" de \"é uma ave\".",
            solution: {
              code: {
                language: "javascript",
                filename: "bird.js",
                code: [
                  "class Bird {",
                  "  constructor(name) { this.name = name; }",
                  "}",
                  "class FlyingBird extends Bird {",
                  '  fly() { return "voando"; }',
                  "}",
                  "class Penguin extends Bird {",
                  '  swim() { return "nadando"; }',
                  "}",
                  "",
                  "function makeItFly(bird) {",
                  "  if (!(bird instanceof FlyingBird)) throw new Error(`${bird.name} não voa`);",
                  "  return bird.fly();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Penguin não herda mais de algo que promete fly() — a hierarquia agora reflete a realidade " +
                "(nem toda ave voa) em vez de forçar um método que precisa lançar erro pra \"corrigir\" a " +
                "promessa quebrada da herança original.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Polymorphism",
          note: "Polimorfismo",
          requires: ["Interface", "Inheritance"],
          revisit: ["Software Design / Object-Oriented Design", "SOLID"],
          summary:
            "Polymorphism é a capacidade de objetos de tipos diferentes responderem, cada um do seu jeito, à mesma " +
            "operação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A operação é a mesma — o mesmo nome de método, a mesma interface — e quem chama não precisa saber, nem " +
                "checar, qual tipo concreto está recebendo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Com Polymorphism, um tipo novo entra no sistema sem acrescentar mais uma checagem de tipo em quem chama.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem Polymorphism, código que lida com várias variações de um comportamento precisaria de " +
                "condicionais explícitos checando o tipo de cada objeto — isso cresce sem parar a cada novo " +
                "tipo. Polymorphism substitui esses condicionais por uma única chamada que \"sabe\" se resolver " +
                "sozinha, geralmente via Interface (o contrato compartilhado) e Inheritance (o mecanismo que " +
                "permite sobrescrever comportamento).",
            },
            {
              type: "paragraph",
              text:
                "Este material foca em subtype polymorphism — o mesmo método se comportando diferente por " +
                "tipo/subtipo, o caso mais comum em linguagens orientadas a objeto. Existem outras formas (ex.: " +
                "polimorfismo paramétrico em genéricos), fora do escopo aqui.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "shapes.js",
              code: [
                "class Circle {",
                "  area() { return Math.PI * this.radius ** 2; }",
                "}",
                "class Square {",
                "  area() { return this.side ** 2; }",
                "}",
                "",
                "function totalArea(shapes) {",
                "  return shapes.reduce((sum, shape) => sum + shape.area(), 0);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "totalArea chama shape.area() sem saber (nem perguntar) se é um Circle ou um Square — cada " +
                "tipo responde area() do seu jeito. Adicionar um Triangle amanhã não exige tocar em totalArea.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o código escolhe o comportamento pelo tipo com `if` ou `instanceof`, e novos tipos exigem editar " +
                "esses condicionais.",
                "Para tratar uma coleção de objetos de tipos diferentes pela mesma interface, como uma lista de handlers.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para poucos casos estáveis, um condicional simples costuma ser mais claro que uma hierarquia.",
                "Exige que todos os tipos cumpram o mesmo contrato; se um deles não consegue, a abstração está errada.",
              ],
            },
          ],
          examples: [
            {
              title: "Polymorphism sem herança",
              context: "Duck typing puro: dois objetos sem relação de herança nenhuma cumprindo a mesma interface.",
              code: {
                language: "javascript",
                filename: "loggers.js",
                code: [
                  "const logger1 = { log: (msg) => console.log(msg) };",
                  'const logger2 = { log: (msg) => fs.appendFileSync("log.txt", msg + "\\n") };',
                  "",
                  "function record(logger, message) {",
                  "  logger.log(message); // polymorphism sem nenhuma classe/herança envolvida",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Nenhum dos dois loggers herda do outro — eles só cumprem a mesma interface (log(msg)). record " +
                "trata os dois de forma polimórfica mesmo assim.",
            },
            {
              title: "Substituindo uma cadeia de if/instanceof",
              context: "A versão com polymorphism não cresce a cada novo tipo de forma.",
              code: {
                language: "javascript",
                filename: "area.js",
                code: [
                  "// Antes: sem polymorphism",
                  "function areaBefore(shape) {",
                  '  if (shape.kind === "circle") return Math.PI * shape.radius ** 2;',
                  '  if (shape.kind === "square") return shape.side ** 2;',
                  "}",
                  "",
                  "// Depois: com polymorphism",
                  "function areaAfter(shape) {",
                  "  return shape.area();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A versão \"antes\" precisa crescer a cada novo tipo de forma; a versão \"depois\" delega a " +
                "decisão para cada objeto, via polymorphism.",
            },
            {
              title: "Polymorphism num array de handlers",
              context: "O mesmo laço processa handlers completamente diferentes, sem checar tipo nenhum.",
              code: {
                language: "javascript",
                filename: "handlers.js",
                code: [
                  "class ClickHandler {",
                  '  handle(event) { return `clique em ${event.target}`; }',
                  "}",
                  "class KeyHandler {",
                  '  handle(event) { return `tecla ${event.key}`; }',
                  "}",
                  "",
                  "for (const handler of [new ClickHandler(), new KeyHandler()]) {",
                  "  console.log(handler.handle(currentEvent));",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O loop chama handle(event) sem saber qual handler concreto está processando — cada um responde " +
                "ao seu jeito, mesma interface.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo usa if/else explícito checando o tipo de cada desconto — toda vez que surge um " +
              "novo tipo, alguém precisa lembrar de adicionar mais um else if aqui.",
            problemCode: {
              language: "javascript",
              filename: "discount.js",
              code: [
                "function applyDiscount(order, discountType) {",
                '  if (discountType === "percentage") return order.total * 0.9;',
                '  if (discountType === "fixed") return order.total - 10;',
                '  if (discountType === "none") return order.total;',
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva usando polymorphism — cada tipo de desconto deve saber calcular seu próprio valor, sem " +
              "nenhum if/else if checando tipo dentro de applyDiscount.",
            hint: "Crie uma classe (ou objeto) por tipo de desconto, todas com o mesmo método (ex.: apply(total)), e deixe applyDiscount só chamar esse método.",
            solution: {
              code: {
                language: "javascript",
                filename: "discount.js",
                code: [
                  "class PercentageDiscount {",
                  "  apply(total) { return total * 0.9; }",
                  "}",
                  "class FixedDiscount {",
                  "  apply(total) { return total - 10; }",
                  "}",
                  "class NoDiscount {",
                  "  apply(total) { return total; }",
                  "}",
                  "",
                  "function applyDiscount(order, discount) {",
                  "  return discount.apply(order.total);",
                  "}",
                  "",
                  "applyDiscount(order, new PercentageDiscount());",
                ].join("\n"),
              },
              explanation:
                "applyDiscount não sabe mais quantos tipos de desconto existem — cada classe implementa " +
                "apply(total) do seu jeito. Adicionar um BuyOneGetOneDiscount no futuro não toca em " +
                "applyDiscount nenhuma vez.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Composition",
          note: "Composição de objetos",
          requires: ["Encapsulation"],
          collision: "≠ Function Composition (Functional Programming) — objetos has-a × f∘g",
          summary:
            "Composition é montar um objeto a partir de outros objetos que ele contém e para os quais delega " +
            "trabalho.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em vez de herdar comportamento de uma superclasse (is-a), o objeto tem as peças de que precisa (has-a). " +
                "Um Car não é um Engine — ele tem um Engine.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando o comportamento vem de peças compostas, cada peça pode ser trocada e testada sem mexer nas " +
                "outras.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Inheritance cria um acoplamento rígido com a hierarquia inteira da superclasse, com todos os " +
                "riscos de contrato quebrado já vistos. Composition permite trocar peças individualmente — " +
                "trocar o Engine de um Car sem tocar na classe Car, ou testar Engine isoladamente sem precisar " +
                "de um Car inteiro. \"Favoreça composição sobre herança\" é um dos conselhos mais repetidos de " +
                "design orientado a objetos, justamente por essa flexibilidade.",
            },
            {
              type: "paragraph",
              text:
                "Não confundir com Function Composition (de programação funcional): lá, f∘g significa encadear " +
                "funções — a saída de g vira entrada de f. Aqui, Composition é sobre objetos contendo outros " +
                "objetos. Os nomes coincidem, os conceitos não têm relação direta.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "car.js",
              code: [
                "class Engine {",
                '  start() { return "vrum"; }',
                "}",
                "class Car {",
                "  constructor() {",
                "    this.engine = new Engine(); // has-a, não is-a",
                "  }",
                "  start() {",
                "    return this.engine.start();",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Car não estende Engine — ele tem um Engine e delega start() pra ele. Trocar o motor por um " +
                "ElectricEngine só exige mudar o que Car instancia, não a hierarquia de classes inteira.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o comportamento precisa variar ou ser combinado de formas independentes, e não numa hierarquia fixa.",
                "Quando você quer trocar e testar cada peça separadamente.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Exige mais código de ligação: as peças precisam ser montadas e delegadas explicitamente.",
                "Para uma relação genuína de \"é um\" e estável, a herança continua sendo a opção mais simples.",
              ],
            },
          ],
          examples: [
            {
              title: "Resolvendo o problema de Inheritance com Composition",
              context: "O mesmo Bird/Penguin visto em Inheritance, agora sem forçar uma hierarquia que não se aplica a todos.",
              code: {
                language: "javascript",
                filename: "bird-composition.js",
                code: [
                  "class Bird {",
                  "  constructor(flightBehavior) {",
                  "    this.flightBehavior = flightBehavior; // has-a, não is-a",
                  "  }",
                  "  fly() {",
                  "    return this.flightBehavior.fly();",
                  "  }",
                  "}",
                  'const canFly = { fly: () => "voando" };',
                  'const cannotFly = { fly: () => "não voa" };',
                  "",
                  "const eagle = new Bird(canFly);",
                  "const penguin = new Bird(cannotFly);",
                ].join("\n"),
              },
              explanation:
                "Em vez de forçar Penguin extends Bird a sobrescrever fly() com um erro, cada Bird recebe o " +
                "comportamento de voo que faz sentido pra ele.",
            },
            {
              title: "Composição de múltiplos comportamentos independentes",
              context: "Cada peça pode ser desenvolvida e testada sem depender da outra.",
              code: {
                language: "javascript",
                filename: "player.js",
                code: ["class Player {", "  constructor() {", "    this.inventory = new Inventory();", "    this.health = new HealthSystem();", "  }", "}"].join("\n"),
              },
              explanation:
                "Player combina Inventory e HealthSystem — cada um pode ser reutilizado (num NPC, por exemplo) " +
                "de forma totalmente independente do Player.",
            },
            {
              title: "Function Composition — pra fixar a diferença",
              context: "Mesmo nome, conceito diferente: aqui não existe objeto nenhum, só funções encadeadas.",
              code: {
                language: "javascript",
                filename: "compose.js",
                code: ["const double = (x) => x * 2;", "const addOne = (x) => x + 1;", "const doubleThenAddOne = (x) => addOne(double(x));", "", "doubleThenAddOne(5); // 11"].join("\n"),
              },
              explanation:
                "Isso é Function Composition — encadear funções, sem objeto nenhum envolvido. Compartilha o " +
                "nome com Composition (objetos), mas é um conceito diferente.",
            },
          ],
          exercise: {
            problem:
              "Robot precisa tanto de fly() (de FlyingMachine) quanto de swim() (de SwimmingMachine) — mas " +
              "JavaScript não tem herança múltipla, então extends das duas não é possível.",
            problemCode: {
              language: "javascript",
              filename: "robot.js",
              code: [
                "class FlyingMachine {",
                '  fly() { return "voando"; }',
                "}",
                "class SwimmingMachine {",
                '  swim() { return "nadando"; }',
                "}",
                "// class Robot extends FlyingMachine, SwimmingMachine {} // não existe em JS",
              ].join("\n"),
            },
            task:
              "Reescreva Robot usando Composition para ter tanto fly() quanto swim(), sem herdar de nenhuma das " +
              "duas classes.",
            hint: "Robot pode TER um FlyingMachine e um SwimmingMachine internamente, e delegar as chamadas pra eles.",
            solution: {
              code: {
                language: "javascript",
                filename: "robot.js",
                code: [
                  "class Robot {",
                  "  constructor() {",
                  "    this.flying = new FlyingMachine();",
                  "    this.swimming = new SwimmingMachine();",
                  "  }",
                  "  fly() { return this.flying.fly(); }",
                  "  swim() { return this.swimming.swim(); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Robot compõe as duas capacidades em vez de tentar herdar as duas — problema que Inheritance " +
                "sozinha não resolve (JS não tem herança múltipla), Composition resolve naturalmente.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Coupling",
          note: "Acoplamento",
          requires: ["Interface", "Composition", "Inheritance"],
          revisit: ["Architecture Fundamentals"],
          summary: "Coupling é o quanto uma parte do sistema depende dos detalhes internos de outra.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Na prática, isso aparece quando algo muda. Alto Coupling: mudar uma parte frequentemente exige mudar a " +
                "outra também. Baixo Coupling: as partes podem mudar de forma independente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Coupling zero não existe, então o objetivo é que mudar uma parte raramente obrigue a mudar outra.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sistemas crescem através de muitas partes interagindo entre si — Coupling é a medida de quão " +
                "presa essa rede de dependências está. Tudo que já vimos (Interface, Composition, Inheritance " +
                "bem usada) são ferramentas pra manter esse grau baixo: uma Interface bem desenhada esconde a " +
                "implementação, então quem depende dela não precisa mudar quando a implementação muda por " +
                "dentro.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "Alto coupling acessando estrutura interna, contra baixo coupling via um método:" },
            {
              type: "code",
              language: "javascript",
              filename: "invoice.js",
              code: [
                "// alto coupling: printInvoice conhece a estrutura interna de Customer",
                "function printInvoice(invoice) {",
                '  console.log(invoice.customer.address.street + ", " + invoice.customer.address.city);',
                "}",
                "",
                "// baixo coupling: Customer expõe um método, esconde a estrutura",
                "function printInvoiceLowCoupling(invoice) {",
                "  console.log(invoice.customer.formattedAddress());",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A primeira versão quebra se Customer mudar como guarda o endereço; a segunda não — " +
                "printInvoiceLowCoupling só depende de um método, não da estrutura interna de Customer.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Coupling zero é impossível: partes que não se conhecem não colaboram; o objetivo é o menor nível que o " +
                "problema permite.",
                "Há acoplamento além do código, como o temporal, quando duas chamadas só funcionam se feitas em certa ordem.",
                "Reduzir acoplamento com camadas extras que só repassam chamadas troca um problema por outro.",
              ],
            },
          ],
          examples: [
            {
              title: "Alto coupling entre módulos",
              context: "Importar um detalhe interno de outro módulo cria uma dependência frágil.",
              code: { language: "javascript", filename: "consumer.js", code: '// alto coupling: importa a implementação interna de outro módulo\nimport { internalCache } from "./user-service/cache.js";' },
              explanation:
                "Qualquer refatoração interna de user-service (trocar a estrutura do cache) quebra este import " +
                "— o módulo consumidor está acoplado a um detalhe que nunca deveria ter sido exposto.",
            },
            {
              title: "Baixo coupling via injeção de dependência",
              context: "A classe depende de uma interface, não de uma implementação concreta.",
              code: {
                language: "javascript",
                filename: "order-service.js",
                code: ["class OrderService {", "  constructor(paymentGateway) {", "    this.paymentGateway = paymentGateway; // depende da interface, não da implementação concreta", "  }", "}"].join("\n"),
              },
              explanation:
                "OrderService não sabe (nem importa) se paymentGateway é Stripe, Pix ou um mock de teste — o " +
                "coupling está limitado à interface que paymentGateway precisa cumprir.",
            },
            {
              title: "Coupling temporal",
              context: "Mesmo sem dependência direta de dados, a ORDEM das chamadas pode ser uma forma de acoplamento.",
              code: { language: "javascript", filename: "connection.js", code: ["const conn = openConnection();", "conn.authenticate(); // precisa vir ANTES de query()", 'conn.query("SELECT 1");'].join("\n") },
              explanation:
                "Mesmo sem uma referência direta entre os métodos, existe coupling temporal — chamar query() " +
                "antes de authenticate() quebra, mesmo que o código pareça independente.",
            },
          ],
          exercise: {
            problem:
              "OrderProcessor importa e instancia diretamente StripeGateway — trocar de provedor de pagamento " +
              "exige editar OrderProcessor.",
            problemCode: {
              language: "javascript",
              filename: "order-processor.js",
              code: [
                'import { StripeGateway } from "./stripe-gateway.js";',
                "",
                "class OrderProcessor {",
                "  process(order) {",
                "    const gateway = new StripeGateway();",
                "    gateway.charge(order.total);",
                "  }",
                "}",
              ].join("\n"),
            },
            task: "Reduza o coupling entre OrderProcessor e StripeGateway para que trocar de provedor não exija editar OrderProcessor.",
            hint: "Quem cria o gateway concreto não precisa ser o próprio OrderProcessor — pense em receber a dependência de fora (injeção de dependência).",
            solution: {
              code: {
                language: "javascript",
                filename: "order-processor.js",
                code: [
                  "class OrderProcessor {",
                  "  constructor(gateway) {",
                  "    this.gateway = gateway; // depende da interface charge(amount), não de StripeGateway",
                  "  }",
                  "  process(order) {",
                  "    this.gateway.charge(order.total);",
                  "  }",
                  "}",
                  "",
                  "const processor = new OrderProcessor(new StripeGateway());",
                ].join("\n"),
              },
              explanation:
                "OrderProcessor não importa mais StripeGateway diretamente — recebe qualquer gateway que cumpra " +
                "charge(amount). Trocar de provedor é só uma mudança em quem instancia OrderProcessor.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Cohesion",
          note: "Coesão",
          requires: ["Coupling"],
          revisit: ["Software Design / SOLID / Single Responsibility Principle (SRP)"],
          summary: "Cohesion é o quanto as responsabilidades dentro de uma mesma unidade pertencem umas às outras.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A unidade pode ser uma classe, um módulo ou uma função. Alta Cohesion: tudo ali dentro existe por um " +
                "motivo relacionado. Baixa Cohesion: a unidade faz um monte de coisas sem relação nenhuma entre si, só " +
                "porque ficaram juntas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se você não consegue dizer em uma frase para que uma unidade serve, a Cohesion dela está baixa.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Cohesion é o complemento natural de Coupling: o objetivo de um bom design costuma ser " +
                "resumido como \"baixo acoplamento, alta coesão\" — dependências fracas entre unidades, " +
                "responsabilidades fortemente relacionadas dentro de cada unidade. Uma unidade de baixa " +
                "Cohesion tende a ter muitos motivos para mudar, um por responsabilidade não relacionada, o " +
                "que a torna frágil e difícil de entender.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "Uma classe de baixa Cohesion, com responsabilidades sem relação real entre si:" },
            {
              type: "code",
              language: "javascript",
              filename: "user-manager.js",
              code: [
                "// baixa cohesion: três responsabilidades sem relação real entre si",
                "class UserManager {",
                "  validateEmail(email) { /* ... */ }",
                "  sendWelcomeEmail(user) { /* ... */ }",
                "  generateMonthlyReport() { /* ... */ }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "validateEmail, sendWelcomeEmail e generateMonthlyReport não têm relação funcional entre si — " +
                "estão juntas só porque alguém decidiu colocar num arquivo chamado UserManager. Mudar a lógica " +
                "de relatório não deveria arriscar quebrar validação de e-mail, mas numa classe assim, tudo " +
                "está mais próximo do que deveria.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um módulo \"utilidades\" que junta funções sem relação tem baixa coesão: o que as une é só estar no mesmo " +
                "arquivo.",
                "Coesão não é fazer pouco: dividir em partes minúsculas pode espalhar um assunto que pertence junto.",
                "Baixa coesão costuma aparecer como mudanças que pedem alterar partes sem relação da mesma unidade.",
              ],
            },
          ],
          examples: [
            {
              title: "Separando em unidades coesas",
              context: "A mesma classe de baixa cohesion, dividida em três com um motivo de mudança cada.",
              code: {
                language: "javascript",
                filename: "user-manager-split.js",
                code: ["class EmailValidator {", "  validate(email) { /* ... */ }", "}", "class WelcomeEmailSender {", "  send(user) { /* ... */ }", "}", "class MonthlyReportGenerator {", "  generate() { /* ... */ }", "}"].join("\n"),
              },
              explanation:
                "Cada classe agora tem um motivo pra mudar. EmailValidator só muda se a regra de validação " +
                "mudar — nada relacionado a e-mail de boas-vindas ou relatório pode afetá-la.",
            },
            {
              title: "Alta cohesion dentro de uma função",
              context: "Cada linha contribui diretamente pro mesmo propósito — nada emprestado de outra responsabilidade.",
              code: {
                language: "javascript",
                filename: "total.js",
                code: ["function calculateTotalWithTax(items, taxRate) {", "  const subtotal = items.reduce((sum, item) => sum + item.price, 0);", "  return subtotal * (1 + taxRate);", "}"].join("\n"),
              },
              explanation: "Toda a função existe só para calcular o total com imposto — nenhuma responsabilidade emprestada de outro lugar.",
            },
            {
              title: "Baixa cohesion num módulo grab-bag",
              context: "Um utils.js genérico tende a virar um monte de funções sem tema em comum.",
              code: {
                language: "javascript",
                filename: "utils.js",
                code: ["// utils.js — baixa cohesion: funções sem relação temática entre si", "export function formatDate(d) { /* ... */ }", "export function slugify(s) { /* ... */ }", "export function sendPushNotification(msg) { /* ... */ }"].join("\n"),
              },
              explanation:
                "Cada função pertence a um domínio diferente (datas, texto, notificações) — sugere que " +
                "deveriam ser três módulos, não um só chamado utils.js.",
            },
          ],
          exercise: {
            problem: "ReportService mistura busca de dados, formatação e envio por e-mail — três responsabilidades sem relação direta.",
            problemCode: {
              language: "javascript",
              filename: "report-service.js",
              code: [
                "class ReportService {",
                "  fetchSalesData() { /* consulta o banco */ }",
                "  formatAsHtml(data) { /* monta HTML */ }",
                "  emailReport(html, recipient) { /* envia por e-mail */ }",
                "  run(recipient) {",
                "    const data = this.fetchSalesData();",
                "    const html = this.formatAsHtml(data);",
                "    this.emailReport(html, recipient);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Separe ReportService em classes de alta Cohesion — cada uma com uma única responsabilidade " +
              "relacionada. Esboce como run() ficaria depois, orquestrando as novas classes.",
            hint: "Pense em pelo menos 3 responsabilidades diferentes aqui — busca de dados, formatação, envio.",
            solution: {
              code: {
                language: "javascript",
                filename: "report-service.js",
                code: [
                  "class SalesDataFetcher {",
                  "  fetch() { /* consulta o banco */ }",
                  "}",
                  "class HtmlReportFormatter {",
                  "  format(data) { /* monta HTML */ }",
                  "}",
                  "class ReportEmailer {",
                  "  send(html, recipient) { /* envia por e-mail */ }",
                  "}",
                  "",
                  "class ReportService {",
                  "  constructor(fetcher, formatter, emailer) {",
                  "    this.fetcher = fetcher;",
                  "    this.formatter = formatter;",
                  "    this.emailer = emailer;",
                  "  }",
                  "  run(recipient) {",
                  "    const data = this.fetcher.fetch();",
                  "    const html = this.formatter.format(data);",
                  "    this.emailer.send(html, recipient);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada nova classe tem uma responsabilidade coesa e um único motivo pra mudar. ReportService " +
                "virou um orquestrador (baixo coupling com cada peça, via composição) em vez de fazer tudo " +
                "sozinho.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Separation of Concerns",
          note: "Separação de responsabilidades",
          requires: ["Coupling", "Cohesion"],
          revisit: ["Architecture & System Design / Architectural Styles / Layered Architecture"],
          summary:
            "Separation of Concerns é o princípio de organizar um sistema para que cada parte trate de uma única " +
            "preocupação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma preocupação (concern) é uma responsabilidade ou um tipo de decisão, e cada parte cuida da sua sem se " +
                "misturar com as outras. Não é uma técnica específica; é o objetivo que Coupling baixo e Cohesion alta " +
                "existem para servir.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando um trecho de código mistura preocupações diferentes, é sinal de que ele deveria ser dividido.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando concerns diferentes — lógica de negócio, acesso a dados, apresentação — ficam " +
                "misturados no mesmo lugar, qualquer mudança num deles arrisca quebrar os outros, mesmo sem " +
                "relação nenhuma entre si. Separar concerns é o que torna possível mudar como os dados são " +
                "salvos sem tocar em como a regra de negócio funciona — exatamente o resultado prático de ter " +
                "baixo Coupling entre as partes e alta Cohesion dentro de cada uma.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "Regra de negócio e formatação misturadas, depois separadas:" },
            {
              type: "code",
              language: "javascript",
              filename: "discount-message.js",
              code: [
                "// concerns misturados: cálculo de desconto + formatação no mesmo lugar",
                "function getDiscountMessage(price, isVip) {",
                "  const discount = isVip ? price * 0.2 : price * 0.1;",
                "  return `Desconto de R$ ${discount.toFixed(2)} aplicado!`;",
                "}",
                "",
                "// concerns separados",
                "function calculateDiscount(price, isVip) {",
                "  return isVip ? price * 0.2 : price * 0.1;",
                "}",
                "function formatDiscountMessage(discount) {",
                "  return `Desconto de R$ ${discount.toFixed(2)} aplicado!`;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na versão separada, mudar a regra do desconto não exige tocar na formatação da mensagem, e " +
                "vice-versa — cada função trata de um concern só, o que naturalmente resulta em baixo Coupling " +
                "entre elas e alta Cohesion dentro de cada uma.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Separar em excesso, com uma camada para cada detalhe, aumenta o caminho que um pedido percorre sem melhorar " +
                "nada.",
                "Uma separação só existe de verdade se as partes deixam de depender dos detalhes umas das outras.",
                "As preocupações não são fixas: o que precisa ficar separado depende do que muda por razões diferentes.",
              ],
            },
          ],
          examples: [
            {
              title: "Camadas separando concerns numa rota HTTP",
              context: "A rota não sabe de regra de negócio; a regra de negócio não sabe de HTTP.",
              code: {
                language: "javascript",
                filename: "orders-route.js",
                code: [
                  "// concern: rota HTTP (não sabe de banco de dados)",
                  'app.post("/orders", (req, res) => {',
                  "  const order = orderService.create(req.body);",
                  "  res.json(order);",
                  "});",
                  "",
                  "// concern: regra de negócio (não sabe de HTTP nem de SQL)",
                  "class OrderService {",
                  "  create(data) { /* valida e cria o pedido */ }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A rota HTTP não sabe como um pedido é validado ou salvo; OrderService não sabe que existe um " +
                "HTTP request por trás — cada camada trata de um concern.",
            },
            {
              title: "Busca de dados misturada com apresentação",
              context: "Um componente de UI que também sabe buscar dados mistura dois concerns diferentes.",
              code: {
                language: "jsx",
                filename: "user-profile.jsx",
                code: [
                  "// concerns misturados: busca de dados + apresentação no mesmo componente",
                  "function UserProfile({ userId }) {",
                  "  const [user, setUser] = useState(null);",
                  "  useEffect(() => {",
                  "    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser);",
                  "  }, [userId]);",
                  '  return user ? <div>{user.name}</div> : <div>Carregando...</div>;',
                  "}",
                ].join("\n"),
              },
              explanation:
                "Este componente mistura como buscar o usuário com como desenhar a tela — separar isso (ex.: " +
                "um hook useUser(userId) cuidando só da busca) deixaria cada concern independente e mais fácil " +
                "de testar.",
            },
            {
              title: "Validação separada de persistência",
              context: "Nenhuma das duas funções sabe da existência da outra.",
              code: {
                language: "javascript",
                filename: "order-validation.js",
                code: ['function validateOrder(order) {', '  if (!order.items.length) throw new Error("pedido vazio");', "}", "function saveOrder(order) {", "  db.orders.insert(order);", "}"].join("\n"),
              },
              explanation:
                "validateOrder não sabe nada sobre banco de dados; saveOrder não sabe nada sobre regras de " +
                "validação. Trocar o banco de dados não arrisca quebrar uma regra de negócio, e vice-versa.",
            },
          ],
          exercise: {
            problem: "A função abaixo mistura validação, cálculo de preço e persistência num só lugar.",
            problemCode: {
              language: "javascript",
              filename: "checkout.js",
              code: [
                "function checkout(cart) {",
                '  if (cart.items.length === 0) throw new Error("carrinho vazio");',
                "  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);",
                "  db.orders.insert({ items: cart.items, total });",
                "  return total;",
                "}",
              ].join("\n"),
            },
            task:
              "Separe checkout em pelo menos 3 funções, cada uma tratando de um concern só (validação, cálculo, " +
              "persistência), e reescreva checkout como a orquestração das três.",
            hint: "Cada função nova deveria conseguir ser testada sem precisar de banco de dados nenhum, exceto a de persistência.",
            solution: {
              code: {
                language: "javascript",
                filename: "checkout.js",
                code: [
                  "function validateCart(cart) {",
                  '  if (cart.items.length === 0) throw new Error("carrinho vazio");',
                  "}",
                  "function calculateTotal(cart) {",
                  "  return cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);",
                  "}",
                  "function persistOrder(cart, total) {",
                  "  db.orders.insert({ items: cart.items, total });",
                  "}",
                  "",
                  "function checkout(cart) {",
                  "  validateCart(cart);",
                  "  const total = calculateTotal(cart);",
                  "  persistOrder(cart, total);",
                  "  return total;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "validateCart e calculateTotal agora podem ser testadas com um objeto cart puro, sem banco de " +
                "dados nenhum — cada concern virou uma função testável isoladamente, e checkout só orquestra a " +
                "ordem entre elas.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "memory-and-runtime",
      order: 20,
      title: "Memory & Runtime",
      isNew: true,
      requires: ["Programming Fundamentals (Abstraction, Encapsulation)"],
      summary:
        "Como o programa existe em memória e como executa. Detalhes variam por linguagem/runtime — " +
        "ensinar os conceitos, sinalizar o que é específico (ex.: GC vs gestão manual).",
      suggestions: [
        "Pointer / Reference (mecânica)",
        "Boxing / Unboxing",
        "Memory Layout (contiguidade, cache locality)",
        "Stack Overflow (Task própria)",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Memory",
          note: "Memória",
          requires: ["Programming Fundamentals / Abstraction"],
          summary: "Memory é o espaço endereçável onde um programa guarda seus dados enquanto roda.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Cada valor, cada objeto, cada variável ocupa um endereço específico nesse espaço. Um programa não \"sabe\" " +
                "onde as coisas estão por mágica: cada acesso a um dado é, por baixo, um acesso a um endereço de memória.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Pensar em endereços, e não só em valores, é o que explica a maioria dos bugs de estado compartilhado.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem memória endereçável, um programa não teria como guardar estado entre uma instrução e a " +
                "próxima — cada dado precisa de um \"lugar\" que possa ser lido e escrito de novo depois. " +
                "Entender que memória é organizada em endereços — não é um espaço mágico e infinito — explica " +
                "por que alocar memória tem custo, por que estruturas contíguas são mais rápidas de percorrer, " +
                "e por que compartilhar memória entre partes do programa pode causar bugs.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "identity.js",
              code: ["const a = { x: 1 };", "const b = { x: 1 };", "console.log(a === b); // false: mesmo conteúdo, endereços diferentes na memória"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "a e b guardam o mesmo valor, mas em endereços diferentes na memória — === em objetos compara " +
                "identidade (o endereço), não conteúdo. Isso só faz sentido porque memória é endereçável: cada " +
                "{} novo reserva um espaço próprio.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Achar que memória é de graça: cada alocação tem custo, e alocar muito dentro de laços quentes pesa.",
                "Confundir identidade com igualdade: dois objetos com os mesmos dados ficam em endereços diferentes.",
                "Em linguagens com gerenciamento automático, o endereço fica escondido, mas o efeito de compartilhar memória " +
                "continua existindo.",
              ],
            },
          ],
          examples: [
            {
              title: "Tipos determinando quanto espaço algo ocupa",
              context: "Um array tipado reserva um tamanho fixo e conhecido por posição, diferente de um array comum de JS.",
              code: {
                language: "javascript",
                filename: "typed-array.js",
                code: ["// Int32Array reserva exatamente 4 bytes por posição — não \"quantos forem necessários\"", "const nums = new Int32Array(3); // 12 bytes no total, endereçados em sequência", "nums[0] = 42;"].join("\n"),
              },
              explanation:
                "Diferente de um array comum de JS (que guarda referências), um Int32Array reserva um bloco " +
                "contíguo de memória com tamanho fixo — 4 bytes por número, endereçados lado a lado.",
            },
            {
              title: "Alocação acontecendo a cada objeto novo",
              context: "Cada literal de objeto dentro de um loop é uma alocação independente.",
              code: {
                language: "javascript",
                filename: "create-points.js",
                code: ["function createPoints(n) {", "  const points = [];", "  for (let i = 0; i < n; i++) {", "    points.push({ x: i, y: i }); // cada {} aloca um novo espaço em memória", "  }", "  return points;", "}"].join("\n"),
              },
              explanation:
                "Cada { x: i, y: i } dentro do loop é uma alocação nova — n chamadas, n endereços diferentes " +
                "reservados, mesmo que o conteúdo se repita.",
            },
            {
              title: "Endereço explícito em linguagens de baixo nível",
              context: "Em JS o endereço fica escondido; em C ele é um valor que você pode imprimir e manipular.",
              code: { language: "text", filename: "address.c", code: 'int x = 42;\nprintf("%p", &x); // imprime o endereço onde x está guardado, ex: 0x7ffee3a1' },
              explanation:
                "Em C, o endereço é explícito e manipulável — em JS ele fica escondido, mas o conceito por " +
                "baixo é o mesmo: x vive em algum lugar específico da memória.",
            },
          ],
          exercise: {
            problem: "Duas variáveis parecem \"iguais\" mas se comportam de forma diferente ao serem modificadas.",
            problemCode: {
              language: "javascript",
              filename: "points.js",
              code: ["let p1 = { x: 0, y: 0 };", "let p2 = p1;", "p2.x = 99;", "console.log(p1.x); // o que isso imprime, e por quê?"].join("\n"),
            },
            task:
              "Explique (em texto, ou com um comentário no código) por que p1.x muda mesmo que só p2 tenha sido " +
              "alterado — que conceito de Memory explica esse comportamento?",
            hint: "Pense em onde p1 e p2 estão apontando, não no que cada uma \"contém\" isoladamente.",
            solution: {
              code: {
                language: "javascript",
                filename: "points.js",
                code: ["let p1 = { x: 0, y: 0 };", "let p2 = p1; // p2 recebe o MESMO endereço que p1, não uma cópia do objeto", "p2.x = 99;", "console.log(p1.x); // 99 — p1 e p2 apontam pro mesmo espaço em memória"].join("\n"),
              },
              explanation:
                "p2 = p1 não copia o objeto — copia o endereço onde o objeto vive. p1 e p2 são dois nomes " +
                "apontando pro mesmo lugar na memória, então mudar através de um é visível através do outro " +
                "(esse comportamento tem nome — Value vs Reference — e é o próximo Concept).",
            },
          },
        }),
        concept({
          order: 20,
          title: "Value vs Reference",
          note: "Valor vs. Referência",
          requires: ["Memory"],
          revisit: ["Concurrency / Shared State", "Software Design / Mutable vs Immutable Objects", "Functional Programming / Immutability"],
          summary:
            "Value vs Reference é a diferença entre uma atribuição copiar o dado inteiro ou copiar só o endereço onde " +
            "ele vive.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Isso acontece sempre que você atribui um valor a outra variável ou o passa como argumento. Com semântica " +
                "de valor, cada nome fica com a sua cópia; com semântica de referência, os dois passam a apontar pro " +
                "mesmo dado na memória. Em JavaScript, primitivos (number, string, boolean...) têm semântica de valor; " +
                "objetos e arrays têm semântica de referência.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se mudar uma variável mudou outra, as duas estavam compartilhando a mesma referência.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Copiar um dado inteiro toda vez que ele é atribuído seria caro para estruturas grandes — " +
                "referência resolve isso passando só o endereço, barato de copiar. Mas isso tem um preço: " +
                "mudanças feitas através de uma referência são visíveis através de qualquer outra referência " +
                "ao mesmo dado — exatamente o comportamento surpreendente visto no exercício de Memory.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "value-vs-reference.js",
              code: [
                "let a = 5;",
                "let b = a; // b recebe uma CÓPIA do valor 5",
                "b = 10;",
                "console.log(a); // 5 — a não muda",
                "",
                "let obj1 = { x: 5 };",
                "let obj2 = obj1; // obj2 recebe o MESMO endereço que obj1",
                "obj2.x = 10;",
                "console.log(obj1.x); // 10 — obj1 muda junto",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "number é copiado por valor — b = a cria uma cópia independente. Objetos são copiados por " +
                "referência — obj2 = obj1 copia só o endereço; os dois nomes apontam pro mesmo espaço.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Passar um objeto ou array a uma função entrega a referência: alterá-lo lá dentro altera o original.",
                "O spread e `Object.assign` fazem cópia rasa: os objetos aninhados continuam compartilhados.",
                "Copiar tudo por segurança tem custo; copie quando a mutação pode afetar quem não deveria.",
              ],
            },
          ],
          examples: [
            {
              title: "Passar por valor vs. por referência como argumento",
              context: "O mesmo tipo de mudança dentro de uma função tem efeitos completamente diferentes dependendo do tipo.",
              code: {
                language: "javascript",
                filename: "increment.js",
                code: [
                  "function incrementValue(n) { n += 1; }",
                  "function incrementProp(obj) { obj.count += 1; }",
                  "",
                  "let x = 5;",
                  "incrementValue(x);",
                  "console.log(x); // 5 — x não muda, n era uma cópia",
                  "",
                  "let state = { count: 5 };",
                  "incrementProp(state);",
                  "console.log(state.count); // 6 — state muda, obj era a mesma referência",
                ].join("\n"),
              },
              explanation:
                "x (number) entra na função por valor — a função recebe uma cópia. state (objeto) entra por " +
                "referência — a função recebe o mesmo endereço, e mudanças em obj.count afetam state.count de volta.",
            },
            {
              title: "Mutação acidental de um array compartilhado",
              context: "Um problema comum: uma função muta um array esperando devolver algo novo.",
              code: {
                language: "javascript",
                filename: "sort-in-place.js",
                code: ["function sortInPlace(arr) {", "  arr.sort();", "  return arr;", "}", "const original = [3, 1, 2];", "const sorted = sortInPlace(original);", "console.log(original); // [1, 2, 3] — original foi mutado junto"].join("\n"),
              },
              explanation:
                "arr dentro da função é a mesma referência que original — .sort() muta o array no lugar, então " +
                "quem passou original vê a mudança também.",
            },
            {
              title: "Copiando valor de verdade com spread",
              context: "Quando referência compartilhada não é o que se quer, é preciso criar um objeto novo de propósito.",
              code: { language: "javascript", filename: "copy.js", code: ["const original = { x: 1 };", "const copy = { ...original }; // cria um NOVO objeto, endereço diferente", "copy.x = 99;", "console.log(original.x); // 1 — original intacto"].join("\n") },
              explanation:
                "{ ...original } cria um objeto novo com os mesmos valores, em outro endereço — agora copy e " +
                "original são independentes.",
            },
          ],
          exercise: {
            problem: "A função abaixo devia devolver uma prévia do carrinho sem afetar o carrinho original — mas o original está sendo alterado por engano.",
            problemCode: {
              language: "javascript",
              filename: "discount-preview.js",
              code: [
                "function applyDiscountPreview(cart, percent) {",
                "  cart.items.forEach(item => {",
                "    item.price = item.price * (1 - percent / 100);",
                "  });",
                "  return cart;",
                "}",
                "",
                "const cart = { items: [{ price: 100 }, { price: 200 }] };",
                "const preview = applyDiscountPreview(cart, 10);",
                "console.log(cart.items[0].price); // deveria continuar 100, mas não continua",
              ].join("\n"),
            },
            task: "Corrija applyDiscountPreview para que cart original não seja alterado — só o objeto devolvido deve ter os preços com desconto.",
            hint: "cart.items é um array de objetos (referências) — copiar o array por fora não é suficiente; cada item dentro também precisa virar uma cópia nova.",
            solution: {
              code: {
                language: "javascript",
                filename: "discount-preview.js",
                code: [
                  "function applyDiscountPreview(cart, percent) {",
                  "  return {",
                  "    ...cart,",
                  "    items: cart.items.map(item => ({",
                  "      ...item,",
                  "      price: item.price * (1 - percent / 100),",
                  "    })),",
                  "  };",
                  "}",
                  "",
                  "const cart = { items: [{ price: 100 }, { price: 200 }] };",
                  "const preview = applyDiscountPreview(cart, 10);",
                  "console.log(cart.items[0].price); // 100 — original intacto",
                ].join("\n"),
              },
              explanation:
                "map() com { ...item, price: ... } cria um objeto NOVO para cada item, em vez de mudar o item " +
                "original no lugar — quebra a referência compartilhada que causava o efeito colateral.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Stack vs Heap",
          note: "duas regiões de memória",
          requires: ["Value vs Reference"],
          collision: "≠ Stack ADT (Data Structures)",
          summary:
            "Stack e Heap são as duas regiões onde um programa guarda dados, separadas pelo tempo que esses dados " +
            "precisam viver.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A Stack guarda dados de vida curta e previsível — cada chamada de função empilha um \"frame\" com suas " +
                "variáveis locais, removido automaticamente (LIFO — o último que entra é o primeiro que sai) quando a " +
                "função retorna. O Heap guarda dados que precisam viver além de uma única chamada — alocados " +
                "dinamicamente, removidos só quando nada mais precisa deles.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se um dado precisa sobreviver ao fim da função que o criou, ele não pode morar na Stack.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nem todo dado tem o mesmo tempo de vida. Uma variável local que só existe durante uma função " +
                "cabe perfeitamente na disciplina simples e rápida da Stack. Mas um objeto que precisa " +
                "sobreviver depois que a função que o criou já retornou — porque foi guardado em algum lugar, " +
                "devolvido, ou referenciado de fora — precisa de um espaço com ciclo de vida mais flexível: o " +
                "Heap.",
            },
            {
              type: "paragraph",
              text:
                "Não confundir esse \"Stack\" (região de memória gerenciada automaticamente pelo runtime) com " +
                "a Stack ADT vista em Data Structures (a estrutura de dados LIFO que você mesmo implementa e " +
                "manipula com push/pop). Os nomes coincidem — e não por acaso, a região de memória também " +
                "segue disciplina LIFO — mas são conceitos em camadas diferentes.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "create-point.js",
              code: ["function createPoint(x, y) {", "  const point = { x, y }; // point (o objeto) vai pro heap", "  return point;            // sobrevive depois que createPoint retorna", "}", "", "const p = createPoint(1, 2); // p ainda é válido aqui, mesmo com o frame de createPoint já desempilhado"].join(
                "\n"
              ),
            },
            {
              type: "paragraph",
              text:
                "O frame de createPoint (o espaço reservado pra x, y, o nome point) vive na stack e some assim " +
                "que a função retorna. Mas o objeto { x, y } em si vive no heap — por isso p continua válido " +
                "mesmo depois que o frame que o criou já foi desempilhado.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A divisão exata varia entre linguagens e engines; \"primitivo na stack, objeto no heap\" é um modelo, não " +
                "uma garantia.",
                "Recursão sem caso-base ou muito profunda esgota a stack antes de esgotar o heap.",
                "Quem tem referência ao heap mantém o dado vivo; a stack só guarda o que existe enquanto a função roda.",
              ],
            },
          ],
          examples: [
            {
              title: "Variáveis locais de vida curta",
              context: "Nada aqui precisa sobreviver além da própria chamada.",
              code: { language: "javascript", filename: "sum.js", code: ["function sum(a, b) {", "  const result = a + b; // a, b, result: vida curta, limitada ao frame de sum", "  return result;", "}"].join("\n") },
              explanation: "a, b e result não sobrevivem depois que sum retorna — cabem perfeitamente na disciplina simples da stack.",
            },
            {
              title: "Um objeto sobrevivendo múltiplos frames",
              context: "Precisa do heap justamente porque será usado bem depois do frame que o criou.",
              code: {
                language: "javascript",
                filename: "build-cache.js",
                code: ["function buildCache() {", "  const cache = new Map(); // precisa sobreviver além de buildCache()", "  return cache;", "}", "const cache = buildCache(); // usado bem depois, em outros frames", 'cache.set("key", "value");'].join("\n"),
              },
              explanation: "cache é usado muito depois que o frame de buildCache já foi desempilhado — só é possível porque o Map vive no heap.",
            },
            {
              title: "Recursão profunda esgotando a stack",
              context: "O limite físico da disciplina LIFO — a stack não cresce sem limite como o heap.",
              code: { language: "javascript", filename: "count-down.js", code: ["function countDown(n) {", "  if (n <= 0) return 0;", "  return countDown(n - 1); // cada chamada empilha um novo frame", "}", "countDown(100000); // RangeError: Maximum call stack size exceeded"].join("\n") },
              explanation: "Cada chamada recursiva empilha mais um frame — como a stack tem tamanho limitado, recursão funda demais estoura esse limite.",
            },
          ],
          exercise: {
            problem: "A função abaixo tenta devolver um contador que \"lembra\" seu valor entre chamadas, mas isso não funciona como esperado.",
            problemCode: {
              language: "javascript",
              filename: "counter.js",
              code: [
                "function makeCounter() {",
                "  let count = 0; // variável local, vida limitada ao frame de makeCounter",
                "  count += 1;",
                "  return count;",
                "}",
                "console.log(makeCounter()); // 1",
                "console.log(makeCounter()); // 1 de novo — não incrementa entre chamadas",
              ].join("\n"),
            },
            task:
              "Explique por que count não \"sobrevive\" entre chamadas dessa forma, e reescreva makeCounter para " +
              "que o contador realmente persista — de um jeito que force count a viver além de um único frame.",
            hint: "Um closure (função que \"carrega\" uma variável de fora) é uma forma de garantir que um valor sobreviva no heap além do frame que o criou.",
            solution: {
              code: {
                language: "javascript",
                filename: "counter.js",
                code: [
                  "function makeCounter() {",
                  "  let count = 0;",
                  "  return function increment() { // o closure mantém count vivo no heap",
                  "    count += 1;",
                  "    return count;",
                  "  };",
                  "}",
                  "const counter = makeCounter();",
                  "console.log(counter()); // 1",
                  "console.log(counter()); // 2",
                ].join("\n"),
              },
              explanation:
                "count sozinho, numa variável local comum, morre junto com o frame de makeCounter. Mas quando " +
                "uma função interna (increment) referencia count, o runtime precisa mantê-lo vivo no heap " +
                "enquanto essa função interna existir.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Call Stack",
          note: "Pilha de chamadas",
          requires: ["Stack vs Heap"],
          collision: "≠ Stack ADT (Data Structures)",
          revisit: ["Algorithms & Complexity / Recursion", "Asynchronous Programming / Call Stack"],
          summary:
            "A Call Stack é a pilha de frames que o runtime mantém para saber onde a execução está e para onde ela " +
            "volta.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Toda vez que uma função é chamada, um novo frame é empilhado com suas variáveis locais e o ponto de " +
                "retorno; quando a função termina, o frame é removido e a execução volta pro frame anterior.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um stack trace é uma foto da Call Stack no momento do erro, então leia-o como o caminho que levou até " +
                "ali.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um programa não executa só uma linha de código isolada — funções chamam outras funções, que " +
                "chamam outras, formando uma cadeia. A Call Stack é o mecanismo que permite voltar exatamente " +
                "pro lugar certo depois que cada chamada termina, e é também o que faz recursão funcionar " +
                "(cada chamada recursiva tem seu próprio frame, suas próprias variáveis locais).",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "trace.js",
              code: ["function a() { b(); }", "function b() { c(); }", "function c() { console.trace(); } // imprime o estado atual da call stack", "", "a();"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Quando c() executa, a call stack tem três frames empilhados: a, depois b, depois c (o topo). " +
                "console.trace() imprime exatamente essa pilha — é o que aparece (invertido) num stack trace " +
                "de erro.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Recursão consome um frame por chamada: sem caso-base, ou com profundidade demais, ocorre stack overflow.",
                "Em código assíncrono, o stack trace pode não mostrar quem iniciou a operação, porque a pilha original já " +
                "foi desempilhada.",
                "Um trace mostra o caminho até o erro, não a causa: o valor errado pode ter entrado antes.",
              ],
            },
          ],
          examples: [
            {
              title: "Lendo um stack trace de erro",
              context: "O trace mostra exatamente a call stack no momento do throw.",
              code: {
                language: "text",
                filename: "trace-output.txt",
                code: [
                  "function validate(user) { checkEmail(user.email); }",
                  'function checkEmail(email) { if (!email.includes("@")) throw new Error("email inválido"); }',
                  "",
                  'validate({ email: "sem-arroba" });',
                  "// Error: email inválido",
                  "//   at checkEmail (...)",
                  "//   at validate (...)",
                  "//   at Object.<anonymous> (...)",
                ].join("\n"),
              },
              explanation: "checkEmail foi chamada por validate, que foi chamada no topo do arquivo — ler o trace é ler a call stack congelada no momento do erro.",
            },
            {
              title: "Recursão consumindo um frame por chamada",
              context: "Todos os frames ficam empilhados simultaneamente até a recursão atingir o caso base.",
              code: { language: "javascript", filename: "factorial.js", code: ["function factorial(n) {", "  if (n <= 1) return 1;", "  return n * factorial(n - 1); // um novo frame por chamada recursiva", "}", "factorial(5); // 5 frames empilhados no pico"].join("\n") },
              explanation: "Cada chamada de factorial fica esperando o resultado da próxima antes de poder retornar — todos ficam empilhados até o caso base.",
            },
            {
              title: "Stack overflow como consequência direta do tamanho da call stack",
              context: "Sem caso base, a pilha cresce até estourar o espaço reservado pra ela.",
              code: { language: "javascript", filename: "infinite.js", code: ["function loop() { loop(); } // sem caso base — recursão infinita", "loop(); // RangeError: Maximum call stack size exceeded"].join("\n") },
              explanation: "O mesmo limite físico da Stack visto no Concept anterior — sem parar, a call stack estoura.",
            },
          ],
          exercise: {
            problem: "A função abaixo entra em recursão infinita porque o parâmetro nunca se aproxima do caso base.",
            problemCode: {
              language: "javascript",
              filename: "count-down-to.js",
              code: ["function countDownTo(n, target) {", "  console.log(n);", "  return countDownTo(n + 1, target); // deveria se aproximar de target, mas se afasta", "}", "countDownTo(0, 10); // RangeError: Maximum call stack size exceeded"].join("\n"),
            },
            task: "Corrija countDownTo para que ela realmente pare quando n alcançar target, evitando o stack overflow.",
            hint: "Toda função recursiva precisa de duas partes: um caso base que PARA a recursão, e um passo que se aproxima desse caso base a cada chamada.",
            solution: {
              code: {
                language: "javascript",
                filename: "count-down-to.js",
                code: [
                  "function countDownTo(n, target) {",
                  "  if (n >= target) return n; // caso base: para a recursão",
                  "  console.log(n);",
                  "  return countDownTo(n + 1, target); // se aproxima do caso base a cada chamada",
                  "}",
                  "countDownTo(0, 10); // conta de 0 até 10 e para",
                ].join("\n"),
              },
              explanation:
                "O caso base (n >= target) garante que a call stack pare de crescer — cada chamada agora se " +
                "aproxima de uma condição que efetivamente vai ser alcançada.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Garbage Collection",
          note: "Coleta de lixo",
          requires: ["Stack vs Heap"],
          revisit: ["Concurrency (pausas de GC)", "Platform / Performance Engineering"],
          summary:
            "Garbage Collection é o processo automático que libera a memória do heap que nenhuma parte do programa " +
            "consegue mais alcançar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "\"Alcançável\" (reachability) significa: existe algum caminho de referências, a partir de algo que o " +
                "programa ainda usa, até aquele dado? Quando esse caminho não existe mais, o GC pode devolver aquela " +
                "memória para reuso.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Com Garbage Collection você não libera memória, você deixa de alcançá-la, e o runtime decide quando " +
                "recuperá-la.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem GC, quem escreve o programa precisaria liberar manualmente cada pedaço de memória alocado " +
                "no heap, no momento exato em que ele deixa de ser necessário — esquecer causa memory leak; " +
                "liberar cedo demais causa acessar memória inválida. GC automatiza essa decisão, trocando " +
                "controle manual por segurança e produtividade, ao custo de menos previsibilidade sobre quando " +
                "exatamente a memória é liberada — e, em alguns runtimes, pausas perceptíveis durante a coleta.",
            },
            {
              type: "paragraph",
              text:
                "Isso é específico de runtimes com GC (JavaScript, Java, Python, Go...) — linguagens como C e " +
                "C++ exigem gestão manual (malloc/free), e Rust usa um modelo diferente ainda (ownership, sem " +
                "GC nem gestão manual explícita).",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "create-temp.js",
              code: ["function createTemp() {", '  let temp = { big: "dado grande" }; // alocado no heap', '  return "resultado";', "} // depois daqui, nada mais referencia { big: ... } — vira elegível pra GC", "", "createTemp();"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Assim que createTemp retorna, temp deixa de existir e nada mais no programa referencia " +
                "aquele objeto — ele se torna inalcançável, e o coletor pode (em algum momento, não " +
                "imediatamente) liberar essa memória.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Não se sabe quando a coleta acontece: não dependa dela para liberar recursos como arquivos e conexões.",
                "Alcançável não é o mesmo que necessário: um objeto ainda referenciado por algum lugar não é coletado.",
                "Coletas podem pausar o programa; em código sensível à latência, alocar menos ajuda.",
              ],
            },
          ],
          examples: [
            {
              title: "Um objeto perdendo sua última referência",
              context: "Sem nenhum caminho de volta até ele, o objeto vira elegível pra coleta.",
              code: { language: "javascript", filename: "unreachable.js", code: 'let data = { big: "..." };\ndata = null; // a referência antiga vira inalcançável, elegível pra GC' },
              explanation: "Nada no programa mais aponta pro objeto original — ele está \"perdido\" no heap, e o GC eventualmente recupera essa memória.",
            },
            {
              title: "Um objeto continuando alcançável através de outro lugar",
              context: "Mesmo sem variável local direta, um objeto guardado em outra estrutura continua vivo.",
              code: {
                language: "javascript",
                filename: "remember.js",
                code: ["const cache = [];", "function remember(value) {", "  cache.push(value); // o objeto continua alcançável através de cache", "}", "remember({ id: 1 });"].join("\n"),
              },
              explanation: "Mesmo sem nenhuma variável local apontando diretamente pro objeto, ele continua alcançável através do array cache — não é elegível pra coleta.",
            },
            {
              title: "Contraste com gestão manual",
              context: "O que o GC evita: esquecer de liberar memória alocada manualmente.",
              code: { language: "text", filename: "manual.c", code: "int *data = malloc(sizeof(int) * 100); // alocação manual\n// ... usa data ...\nfree(data); // quem escreveu o código precisa lembrar de liberar" },
              explanation: "Em C, esquecer o free(data) é um memory leak permanente — não existe coletor rodando por trás pra recuperar isso.",
            },
          ],
          exercise: {
            problem: "O código abaixo mantém uma referência escondida a um objeto grande mesmo depois que ele deveria deixar de ser necessário.",
            problemCode: {
              language: "javascript",
              filename: "process-and-cache.js",
              code: [
                "let cachedResults = [];",
                "function processAndCache(bigData) {",
                "  const result = bigData.slice(0, 10); // só os primeiros 10 itens são realmente úteis",
                "  cachedResults.push(bigData); // guarda bigData inteiro, sem querer",
                "  return result;",
                "}",
              ].join("\n"),
            },
            task:
              "Corrija processAndCache para que só o resultado necessário (result) fique alcançável através de " +
              "cachedResults — bigData deveria poder ser coletado pelo GC assim que a função retornar.",
            hint: "O problema não é esquecer de liberar memória (JS não tem free manual) — é continuar referenciando, sem querer, algo que já não precisa mais existir.",
            solution: {
              code: {
                language: "javascript",
                filename: "process-and-cache.js",
                code: ["let cachedResults = [];", "function processAndCache(bigData) {", "  const result = bigData.slice(0, 10);", "  cachedResults.push(result); // guarda só o que é necessário, não bigData inteiro", "  return result;", "}"].join("\n"),
              },
              explanation:
                "cachedResults agora só referencia result — bigData deixa de ser alcançável assim que " +
                "processAndCache retorna, e vira elegível pra GC, em vez de ficar retido para sempre.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Memory Leak",
          note: "Vazamento de memória",
          requires: ["Garbage Collection", "Value vs Reference"],
          revisit: ["Platform / Performance Engineering"],
          summary:
            "Memory Leak é memória que já não é necessária, mas continua retida porque alguma referência esquecida " +
            "ainda a alcança.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Como ela continua alcançável, o Garbage Collection nunca a recupera. Não é um bug de \"esquecer de " +
                "liberar\" (como em linguagens sem GC); é um bug de \"esquecer de deixar de referenciar\".",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Em linguagens com Garbage Collection, todo leak começa com uma referência que você guardou e esqueceu de " +
                "soltar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Garbage Collection só libera o que é inalcançável — se um programa mantém, mesmo sem querer, " +
                "um caminho de referências até um dado antigo (um cache nunca limpo, um event listener nunca " +
                "removido, um array que só cresce), esse dado nunca vira elegível pra coleta, não importa quão " +
                "sofisticado o GC seja. É o modo de falha oposto de um bug comum: em vez de acessar algo que " +
                "já foi liberado, o programa impede algo de ser liberado.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "unbounded-cache.js",
              code: ["const cache = {};", "function memoize(key, value) {", "  cache[key] = value; // nunca é removido — cache só cresce", "}"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada chamada de memoize adiciona mais uma entrada em cache, e nada nunca remove entradas " +
                "antigas — cache fica alcançável (é uma variável de módulo), então cada valor guardado nele " +
                "também fica, para sempre, mesmo que nunca mais seja usado.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Garbage Collection não impede vazamento: ele só libera o que ficou inalcançável.",
                "Causas comuns são listeners nunca removidos, caches sem limite e closures que seguram dados grandes.",
                "Referência circular sozinha não é o problema, porque os coletores modernos a tratam; o vazamento é o " +
                "caminho a partir de uma raiz.",
                "O sintoma aparece devagar, com o uso de memória crescendo com o tempo; meça antes de tentar consertar.",
              ],
            },
          ],
          examples: [
            {
              title: "Event listener nunca removido",
              context: "O closure do listener retém tudo que ele referencia, enquanto o listener existir.",
              code: {
                language: "javascript",
                filename: "attach-handler.js",
                code: ["function attachHandler(button) {", "  const bigData = loadBigData();", '  button.addEventListener("click", () => {', "    console.log(bigData.length); // o listener mantém bigData vivo pra sempre", "  });", "}"].join("\n"),
              },
              explanation: "Se o botão (e o listener) nunca forem removidos, bigData nunca vira elegível pra GC, mesmo que attachHandler já tenha retornado há muito tempo.",
            },
            {
              title: "Um array/cache que só cresce",
              context: "Sem limite nem expiração, cada entrada fica retida indefinidamente.",
              code: { language: "javascript", filename: "request-log.js", code: ["const requestLog = [];", "function logRequest(req) {", "  requestLog.push(req); // cresce pra sempre, nunca é limpo", "}"].join("\n") },
              explanation: "Num servidor de longa duração, isso cresce até consumir toda a memória disponível.",
            },
            {
              title: "Referência circular não é o problema (contraste importante)",
              context: "Coletores modernos, baseados em reachability, lidam bem com ciclos.",
              code: {
                language: "javascript",
                filename: "circular.js",
                code: ["function makePair() {", "  const a = {};", "  const b = {};", "  a.other = b;", "  b.other = a; // referência circular entre a e b", "  return null; // nada mais referencia a ou b de fora", "}", "makePair();"].join("\n"),
              },
              explanation:
                "a e b se referenciam mutuamente, mas nenhum dos dois é alcançável a partir de fora depois que " +
                "makePair retorna — coletores modernos recuperam os dois normalmente. Referência circular " +
                "sozinha não causa leak.",
            },
          ],
          exercise: {
            problem: "Um componente de dashboard registra um setInterval que nunca é cancelado quando o dashboard é destruído.",
            problemCode: {
              language: "javascript",
              filename: "dashboard.js",
              code: [
                "function startDashboard(el) {",
                "  const state = { views: 0 };",
                "  setInterval(() => {",
                "    state.views += 1;",
                "    el.textContent = `Views: ${state.views}`;",
                "  }, 1000);",
                "}",
                "// startDashboard(el) é chamado toda vez que o usuário abre o dashboard —",
                "// e nunca é \"desligado\" quando o usuário sai",
              ].join("\n"),
            },
            task: "Corrija startDashboard para que seja possível parar o interval (e liberar state/el para o GC) quando o dashboard não for mais necessário.",
            hint: "setInterval devolve um id que pode ser passado pra clearInterval — exponha uma forma de quem chama startDashboard conseguir parar o que foi iniciado.",
            solution: {
              code: {
                language: "javascript",
                filename: "dashboard.js",
                code: [
                  "function startDashboard(el) {",
                  "  const state = { views: 0 };",
                  "  const intervalId = setInterval(() => {",
                  "    state.views += 1;",
                  "    el.textContent = `Views: ${state.views}`;",
                  "  }, 1000);",
                  "",
                  "  return function stopDashboard() {",
                  "    clearInterval(intervalId); // remove a última referência retendo state/el",
                  "  };",
                  "}",
                  "",
                  "const stop = startDashboard(el);",
                  "// mais tarde, quando o dashboard não for mais necessário:",
                  "stop();",
                ].join("\n"),
              },
              explanation:
                "clearInterval remove o timer, que era a única coisa mantendo o closure (e, com ele, state/el) " +
                "alcançável entre execuções. Sem stopDashboard, cada dashboard aberto vazava seu próprio interval.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "type-systems",
      order: 30,
      title: "Type Systems",
      requires: ["Programming Fundamentals (Interface, Contract, Abstraction)"],
      summary:
        "Os eixos static/dynamic e strong/weak → a propriedade que produzem (Type Safety) → " +
        "nominal × structural → ferramentas de composição de tipos.",
      suggestions: [
        "Gradual Typing",
        "Top / Bottom Types (any, never, unknown)",
        "Variance (covariance / contravariance)",
        "Algebraic Data Types",
        "Optional / Nullable Types",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Static vs Dynamic Typing",
          note: "Tipagem estática vs. dinâmica",
          requires: ["Programming Fundamentals / Contract"],
          summary: "Static vs Dynamic Typing é a diferença sobre o momento em que uma linguagem verifica os tipos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Static Typing verifica os tipos antes do programa rodar, em tempo de compilação — um erro de " +
                "tipo impede o programa de sequer começar. Dynamic Typing verifica os tipos durante a " +
                "execução — um erro de tipo só aparece quando aquela linha específica roda, nunca antes.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Com tipagem dinâmica, código que nunca rodou é código cujos tipos nunca foram verificados.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Cada abordagem tem um trade-off diferente. Static Typing detecta uma classe inteira de erros " +
                "antes de qualquer usuário ver o programa rodando, ao custo de mais verbosidade e um passo de " +
                "compilação. Dynamic Typing permite escrever e rodar código mais rápido, ao custo de erros de " +
                "tipo só aparecerem em produção, se aquele caminho específico nunca foi exercitado em teste.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "A mesma função, em TypeScript (estática) e em JavaScript puro (dinâmica):",
            },
            {
              type: "code",
              language: "typescript",
              filename: "double.ts",
              code: ["// TypeScript (estática): o erro é detectado ANTES de rodar", "function double(n: number) {", "  return n * 2;", "}", 'double("oi"); // erro de compilação: string não é number'].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "double.js",
              code: ["// JavaScript (dinâmica): o erro só aparece quando essa linha específica roda", "function double(n) {", "  return n * 2;", "}", 'double("oi"); // NaN — roda sem erro, mas produz um resultado sem sentido'].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A versão TypeScript recusa compilar; a versão JavaScript roda até o fim e devolve NaN, sem " +
                "avisar de nada — o mesmo bug, descoberto em momentos completamente diferentes.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Tipagem dinâmica só descobre o erro se aquele caminho do código de fato rodar; um bug pode ficar escondido " +
                "até produção.",
                "Tipagem estática não pega todos os erros: valores vindos de fora, como JSON e entrada do usuário, precisam " +
                "ser validados em tempo de execução.",
                "Nenhuma das duas é melhor em tudo: a estática custa configuração e anotações, a dinâmica custa segurança.",
              ],
            },
          ],
          examples: [
            {
              title: "TypeScript pegando um erro em tempo de compilação",
              context: "Uma propriedade obrigatória faltando é recusada antes de qualquer execução.",
              code: {
                language: "typescript",
                filename: "greet.ts",
                code: ["interface User { name: string; age: number; }", "function greet(user: User) {", "  return `Olá, ${user.name}`;", "}", 'greet({ name: "Ana" }); // erro: falta a propriedade \'age\''].join("\n"),
              },
              explanation: "O compilador do TypeScript recusa esse código antes de rodar — falta age, que a interface User exige.",
            },
            {
              title: "JavaScript deixando passar até a hora de rodar",
              context: "O mesmo tipo de erro só aparece quando o caminho de código específico executa.",
              code: {
                language: "javascript",
                filename: "process-order.js",
                code: ["function processOrder(order) {", "  return order.total.toFixed(2); // e se order.total for undefined?", "}", "processOrder({ items: [] }); // TypeError: Cannot read properties of undefined"].join("\n"),
              },
              explanation: "Nada impede processOrder({ items: [] }) de ser chamado — o erro só aparece quando essa linha específica executa, em runtime.",
            },
            {
              title: "Um bug silencioso em tipagem dinâmica",
              context: "Nada impede um valor errado de entrar; o problema só se manifesta bem depois.",
              code: {
                language: "javascript",
                filename: "product.js",
                code: ["class Product {", "  setPrice(value) {", "    this.price = value; // sem checagem de tipo — aceita qualquer coisa", "  }", "}", "const p = new Product();", "p.setPrice(undefined); // \"funciona\" silenciosamente"].join("\n"),
              },
              explanation: "Em dynamic typing, nada impede setPrice(undefined) — o bug só se manifesta muito depois, quando price for finalmente usado em algum cálculo.",
            },
          ],
          exercise: {
            problem: "A função abaixo assume que items é sempre um array, mas nada garante isso em tempo algum — o bug só aparece se alguém passar algo diferente.",
            problemCode: {
              language: "javascript",
              filename: "total-price.js",
              code: ["function totalPrice(items) {", "  return items.reduce((sum, item) => sum + item.price, 0);", "}", "totalPrice(null); // TypeError: Cannot read properties of null (reading 'reduce')"].join("\n"),
            },
            task:
              "Reescreva a assinatura em TypeScript de forma que passar null (ou qualquer coisa que não seja " +
              "um array de itens com price) vire um erro detectado antes de rodar.",
            hint: "Declare o tipo do parâmetro items explicitamente — um array de objetos com uma propriedade price: number.",
            solution: {
              code: {
                language: "typescript",
                filename: "total-price.ts",
                code: [
                  "interface Item { price: number; }",
                  "function totalPrice(items: Item[]) {",
                  "  return items.reduce((sum, item) => sum + item.price, 0);",
                  "}",
                  "totalPrice(null); // erro de compilação: 'null' não é atribuível a 'Item[]'",
                ].join("\n"),
              },
              explanation:
                "Com o tipo Item[] declarado, o TypeScript recusa totalPrice(null) antes mesmo de rodar — o " +
                "mesmo bug que antes só aparecia em produção agora é pego no build.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Strong vs Weak Typing",
          note: "Tipagem forte vs. fraca",
          requires: ["Static vs Dynamic Typing"],
          summary:
            "Strong vs Weak Typing é o quanto uma linguagem aceita misturar tipos diferentes numa mesma operação sem " +
            "reclamar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Tipagem fraca converte automaticamente (coerção implícita) quando os tipos não batem; tipagem forte " +
                "recusa a operação até que a conversão seja feita explicitamente. É um eixo independente de " +
                "static/dynamic.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Em JavaScript, que é dinâmico e fraco, converta os tipos explicitamente em vez de confiar na coerção.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É um eixo independente de static/dynamic — JavaScript é dinâmica e fraca (converte tipos sem " +
                "avisar, e só descobre em runtime); Python é dinâmica mas forte (erro em runtime, mas sem " +
                "conversão silenciosa). Entender os dois eixos separadamente evita confundir \"tem erro de " +
                "tipo em compilação\" com \"não faz conversão implícita\" — são coisas diferentes.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "coercion.js",
              code: ["// JavaScript: tipagem fraca — converte automaticamente", 'console.log("5" - 3); // 2 (string convertida pra number)', 'console.log("5" + 3); // "53" (number convertido pra string)'].join("\n"),
            },
            {
              type: "code",
              language: "text",
              filename: "coercion.py",
              code: ["# Python: tipagem dinâmica, mas FORTE — recusa misturar tipos sem conversão explícita", '"5" + 3  # TypeError: can only concatenate str (not "int") to str'].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "JavaScript converte silenciosamente entre string e number dependendo do operador — coerção " +
                "implícita, tipagem fraca. Python recusa a mesma operação até a conversão ser explícita — " +
                "tipagem forte, mesmo sendo dinâmica igual JavaScript.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Não confunda com estática × dinâmica: são eixos independentes, e cada linguagem combina os dois de um jeito.",
                "TypeScript checa tipos na compilação, mas o JavaScript resultante mantém a coerção fraca em tempo de execução.",
                "Coerção implícita em comparações, como `\"5\" == 5`, produz resultados surpreendentes; prefira `===`.",
              ],
            },
          ],
          examples: [
            {
              title: "Coerção implícita em comparações",
              context: "== aplica coerção antes de comparar; === não.",
              code: { language: "javascript", filename: "equality.js", code: ['console.log(0 == "0");   // true — coerção implícita', 'console.log(0 === "0");  // false — sem coerção'].join("\n") },
              explanation: "== em JS aplica coerção de tipo antes de comparar (tipagem fraca em ação); === recusa comparar tipos diferentes sem converter.",
            },
            {
              title: "TypeScript não elimina a fraqueza de runtime do JS",
              context: "Tipos estáticos e coerção fraca são eixos independentes — os dois podem coexistir.",
              code: {
                language: "typescript",
                filename: "coercion.ts",
                code: ["const total: number = 10;", 'const label: string = "R$";', "console.log(total + Number(label)); // NaN — precisa converter explicitamente pra fazer sentido"].join("\n"),
              },
              explanation: "Mesmo com tipos estáticos declarados, o operador + do JavaScript por baixo ainda aplica coerção fraca em runtime.",
            },
            {
              title: "Uma linguagem estaticamente forte recusando de vez",
              context: "Java combina estática + forte: a mistura nem compila.",
              code: { language: "text", filename: "Mix.java", code: "int total = 10;\nString label = \"R$\";\n// int result = total + label; // erro de COMPILAÇÃO: incompatible types" },
              explanation: "Java é estática e forte — a mistura de tipos incompatíveis nem compila, diferente de JS (fraca) ou Python (forte, mas dinâmica).",
            },
          ],
          exercise: {
            problem: "A função abaixo soma um valor de input de formulário (sempre string) com um número de verdade, e o resultado vira concatenação em vez de soma.",
            problemCode: {
              language: "javascript",
              filename: "add-to-cart.js",
              code: ["function addToCart(currentTotal, inputValue) {", "  return currentTotal + inputValue; // inputValue vem de um <input>, é sempre string", "}", 'addToCart(50, "25"); // "5025" — concatenação, não soma!'].join("\n"),
            },
            task: "Corrija addToCart para que a soma aconteça de verdade, convertendo explicitamente o tipo em vez de depender de coerção implícita.",
            hint: "Converta inputValue explicitamente para number antes de somar.",
            solution: {
              code: {
                language: "javascript",
                filename: "add-to-cart.js",
                code: ["function addToCart(currentTotal, inputValue) {", "  return currentTotal + Number(inputValue); // conversão explícita, não implícita", "}", 'addToCart(50, "25"); // 75 — soma de verdade'].join("\n"),
              },
              explanation: "Number(inputValue) converte explicitamente a string pra number antes da soma, em vez de deixar o operador + decidir sozinho qual coerção aplicar.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Type Inference",
          note: "Inferência de tipos",
          requires: ["Static vs Dynamic Typing"],
          summary:
            "Type Inference é a capacidade do compilador de deduzir o tipo de uma expressão sem que ele esteja " +
            "escrito.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O compilador chega ao tipo a partir do contexto da expressão. Só faz sentido em linguagens de tipagem " +
                "estática — é o compilador \"adivinhando\" o tipo certo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Inferir tipos não afrouxa a checagem: você escreve menos anotações e o compilador verifica exatamente o " +
                "mesmo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Declarar o tipo de toda variável manualmente é repetitivo — na maioria dos casos, o tipo já é " +
                "óbvio a partir do valor atribuído. Type Inference deixa o compilador preencher essa lacuna " +
                "sozinho, mantendo a segurança da tipagem estática sem a verbosidade de escrever o tipo em " +
                "todo lugar.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "inference.ts",
              code: ["let count = 5; // inferido como number, sem anotação explícita", 'count = "cinco"; // erro: string não é atribuível a number'].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Mesmo sem escrever : number, o TypeScript infere o tipo de count a partir do valor 5 — e " +
                "continua aplicando a mesma checagem estática que aplicaria se o tipo fosse explícito.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em variáveis locais e em arrays e objetos, onde o tipo é evidente pelo valor.",
                "Para manter a segurança da tipagem estática sem repetir o tipo em cada declaração.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em fronteiras públicas, como parâmetros e retornos de funções exportadas, anote os tipos explicitamente: " +
                "eles são o contrato.",
                "A inferência pode ser mais ampla do que você quer, como `string` no lugar de um literal; anote quando " +
                "precisar de mais precisão.",
              ],
            },
          ],
          examples: [
            {
              title: "Inferência no retorno de função",
              context: "O tipo de retorno é deduzido do que a função de fato retorna.",
              code: { language: "typescript", filename: "double.ts", code: ["function double(n: number) {", "  return n * 2; // tipo de retorno inferido como number, sem anotação", "}"].join("\n") },
              explanation: "Mesmo sem escrever : number depois dos parênteses, o TypeScript infere que double retorna number.",
            },
            {
              title: "Inferência em arrays e objetos",
              context: "O tipo é deduzido a partir dos valores literais.",
              code: { language: "typescript", filename: "literals.ts", code: ["const numbers = [1, 2, 3]; // inferido como number[]", 'const user = { name: "Ana", age: 30 }; // inferido como { name: string; age: number }'].join("\n") },
              explanation: "O tipo do array e do objeto são deduzidos a partir dos valores literais, sem declarar Array<number> ou uma interface explícita.",
            },
            {
              title: "Quando a anotação explícita ainda é necessária",
              context: "Parâmetros não têm um valor a partir do qual inferir — precisam de anotação.",
              code: { language: "typescript", filename: "parse-age.ts", code: ["function parseAge(input: string): number { // aqui a anotação É necessária", "  return parseInt(input, 10);", "}"].join("\n") },
              explanation: "input não tem valor atribuído (é um parâmetro) — não há nada a partir do que inferir, então o tipo precisa ser explícito.",
            },
          ],
          exercise: {
            problem: "A função abaixo tem uma anotação de tipo de retorno redundante, que Type Inference já resolveria sozinha.",
            problemCode: {
              language: "typescript",
              filename: "create-user.ts",
              code: ["function createUser(name: string, age: number): { name: string; age: number; createdAt: Date } {", "  return { name, age, createdAt: new Date() };", "}"].join("\n"),
            },
            task: "Remova a anotação de tipo de retorno redundante, deixando o TypeScript inferir sozinho — sem perder nenhuma segurança de tipo.",
            hint: "O valor retornado já contém informação suficiente para o compilador deduzir o tipo.",
            solution: {
              code: {
                language: "typescript",
                filename: "create-user.ts",
                code: ["function createUser(name: string, age: number) {", "  return { name, age, createdAt: new Date() }; // tipo de retorno inferido automaticamente", "}"].join("\n"),
              },
              explanation:
                "O TypeScript infere o tipo de retorno a partir do objeto retornado — a anotação explícita não " +
                "adicionava segurança nenhuma, só verbosidade.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Type Safety",
          note: "Segurança de tipos",
          requires: ["Strong vs Weak Typing"],
          revisit: ["Software Design / SOLID / Dependency Inversion Principle (DIP)"],
          summary:
            "Type Safety é o grau em que o sistema de tipos de uma linguagem impede, de fato, operações entre tipos " +
            "incompatíveis.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Prevenir não é o mesmo que detectar tarde demais. E não é um eixo binário: é uma propriedade que resulta " +
                "de onde uma linguagem fica nos eixos static/dynamic e strong/weak.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Quanto mais type-safe a linguagem, mais erros de tipo morrem antes de virar incidente em produção.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Os Concepts anteriores mostraram peças separadas: quando os tipos são checados, quão " +
                "estritamente são impostos, se são inferidos. Type Safety é a consequência prática de combinar " +
                "essas peças — uma linguagem estática e forte tende a ser mais type-safe; uma linguagem " +
                "dinâmica e fraca tende a ser menos. TypeScript aumenta a Type Safety do JavaScript com " +
                "checagem estática, mesmo mantendo parte da fraqueza de runtime herdada.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "safe.ts",
              code: ["// TypeScript: mais type-safe — o compilador impede o erro antes de rodar", "function getUserName(user: { name: string }) {", "  return user.name.toUpperCase();", "}", "// getUserName(null); // erro de compilação"].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "unsafe.js",
              code: ["// JavaScript puro: menos type-safe — o mesmo erro só aparece em runtime", "function getUserName(user) {", "  return user.name.toUpperCase();", "}", "getUserName(null); // TypeError: Cannot read properties of null"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As duas funções fazem a mesma coisa — a diferença é quando (e se) um uso incorreto é " +
                "impedido. Mais Type Safety significa mais categorias de erro pegas antes de virarem incidente.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "`any` desliga a checagem e contamina o que o usa; prefira `unknown`, que obriga a checar antes de usar.",
                "Casts como `as` afirmam ao compilador algo que ele não verifica; se estiverem errados, o erro aparece em " +
                "execução.",
                "Type safety em tempo de compilação não substitui validação dos dados que entram no sistema.",
              ],
            },
          ],
          examples: [
            {
              title: "any desligando a Type Safety pontualmente",
              context: "any é uma saída explícita da checagem de tipos do TypeScript.",
              code: {
                language: "typescript",
                filename: "any.ts",
                code: ["function process(data: any) { // any = \"confie em mim, sem checagem\"", "  return data.value.toUpperCase();", "}", "process({ value: 42 }); // TypeError em runtime"].join("\n"),
              },
              explanation: "any opta explicitamente por sair da Type Safety que o TypeScript oferece — o erro volta a só aparecer em runtime, como em JS puro.",
            },
            {
              title: "unknown como alternativa mais type-safe",
              context: "unknown obriga a verificar o tipo antes de usar.",
              code: {
                language: "typescript",
                filename: "unknown.ts",
                code: ["function process(data: unknown) {", '  if (typeof data === "object" && data !== null && "value" in data) {', "    console.log((data as { value: string }).value);", "  }", "}"].join("\n"),
              },
              explanation: "Diferente de any, unknown exige uma checagem antes de acessar qualquer campo — mantém a Type Safety mesmo sem saber o tipo exato de antemão.",
            },
            {
              title: "Null safety como parte prática de Type Safety",
              context: "O compilador impede acessar propriedade de algo que pode não existir.",
              code: { language: "typescript", filename: "null-safety.ts", code: ["function getLength(text?: string) {", "  return text.length; // erro: 'text' is possibly 'undefined'", "}"].join("\n") },
              explanation: "O TypeScript recusa acessar .length sem antes garantir que text não é undefined.",
            },
          ],
          exercise: {
            problem: "A função abaixo usa any, então o TypeScript não pega um erro óbvio de uso incorreto.",
            problemCode: {
              language: "typescript",
              filename: "discount.ts",
              code: ["function calculateDiscount(price: any, percent: any) {", "  return price - (price * percent / 100);", "}", 'calculateDiscount("100", 10); // NaN, sem nenhum aviso do compilador'].join("\n"),
            },
            task: "Substitua os any por tipos concretos (number) para que o TypeScript recuse calculateDiscount(\"100\", 10) em tempo de compilação.",
            hint: "any desliga completamente a checagem — trocar por number reativa exatamente a checagem que faltava.",
            solution: {
              code: {
                language: "typescript",
                filename: "discount.ts",
                code: ["function calculateDiscount(price: number, percent: number) {", "  return price - (price * percent / 100);", "}", 'calculateDiscount("100", 10); // erro de compilação'].join("\n"),
              },
              explanation: "Com number declarado, o mesmo chamado que antes passava silenciosamente agora é recusado antes de rodar.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Nominal Typing",
          note: "Tipagem nominal",
          requires: ["Type Safety"],
          summary:
            "Nominal Typing é o modelo em que dois tipos só são compatíveis se tiverem o mesmo nome, ou seja, a mesma " +
            "declaração.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A estrutura não conta. Dois tipos com exatamente os mesmos campos, mas declarados com nomes diferentes, " +
                "são tratados como tipos diferentes — incompatíveis entre si, mesmo parecendo idênticos por dentro.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Use tipagem nominal quando dois conceitos do domínio têm a mesma forma, mas não podem ser trocados um " +
                "pelo outro.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nominal Typing existe para expressar intenção: às vezes você quer que dois tipos com a mesma " +
                "forma sejam tratados como coisas diferentes, porque representam conceitos distintos do " +
                "domínio — um UserId e um ProductId podem ser os dois só um number por dentro, mas misturar " +
                "um pelo outro é um bug de domínio, não um erro estrutural.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "TypeScript não é nominal por padrão — o exemplo simula via um padrão comum, \"branded types\":",
            },
            {
              type: "code",
              language: "typescript",
              filename: "branded-id.ts",
              code: [
                'type UserId = number & { readonly __brand: "UserId" };',
                'type ProductId = number & { readonly __brand: "ProductId" };',
                "",
                "function getUser(id: UserId) { /* ... */ }",
                "",
                "declare const productId: ProductId;",
                "// getUser(productId); // erro: 'ProductId' não é atribuível a 'UserId'",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "UserId e ProductId são estruturalmente idênticos (ambos number por baixo), mas o brand força " +
                "o compilador a tratá-los como tipos nominalmente diferentes.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Exige declarar a relação de forma explícita: dois tipos de mesma estrutura, mas nomes diferentes, não se " +
                "conversam.",
                "O TypeScript é estrutural: para conseguir efeito nominal, é preciso simular, com marcas (brands) ou classes " +
                "com campos privados.",
                "Aplique onde trocar dois conceitos de mesma forma, como ids de usuário e de pedido, causa bug de domínio real.",
              ],
            },
          ],
          examples: [
            {
              title: "Nominal typing clássico, fora do TypeScript",
              context: "Java/C# nunca tratam duas classes com a mesma forma como intercambiáveis.",
              code: { language: "text", filename: "Units.java", code: "class Meters { double value; }\nclass Seconds { double value; }\n// Meters m = new Seconds(); // erro: tipos incompatíveis, mesmo com a mesma estrutura" },
              explanation: "Meters e Seconds nunca são intercambiáveis, mesmo com exatamente os mesmos campos — o nome da classe é o que importa.",
            },
            {
              title: "Enums como tipagem nominal no dia a dia",
              context: "Dois enums com valores \"iguais\" continuam sendo tipos diferentes.",
              code: {
                language: "typescript",
                filename: "enums.ts",
                code: ["enum Status { Active, Inactive }", "enum Priority { Active, Inactive } // mesmos valores, nome diferente", "function process(status: Status) { /* ... */ }", "// process(Priority.Active); // erro: Priority não é Status"].join("\n"),
              },
              explanation: "Status.Active e Priority.Active \"parecem\" o mesmo valor, mas são de enums nominalmente diferentes.",
            },
            {
              title: "Onde nominal typing evita um bug de domínio real",
              context: "Sem o brand, confundir unidades de medida seria fácil.",
              code: {
                language: "typescript",
                filename: "temperature.ts",
                code: ['type CelsiusTemp = number & { readonly __brand: "Celsius" };', 'type FahrenheitTemp = number & { readonly __brand: "Fahrenheit" };', "", "function heatWater(temp: CelsiusTemp) { /* ... */ }"].join("\n"),
              },
              explanation: "Sem o brand, seria fácil passar uma temperatura em Fahrenheit pra uma função que espera Celsius — os dois são só number.",
            },
          ],
          exercise: {
            problem: "A função abaixo aceita um number simples como ID de pedido — nada impede trocar por um ID de usuário por engano.",
            problemCode: {
              language: "typescript",
              filename: "cancel-order.ts",
              code: ["function cancelOrder(orderId: number) { /* ... */ }", "const userId: number = 42;", "cancelOrder(userId); // compila sem erro — mas é um bug de domínio"].join("\n"),
            },
            task:
              "Use um branded type para tornar OrderId nominalmente diferente de number, de forma que passar " +
              "um number cru para cancelOrder vire erro de compilação.",
            hint: "Crie OrderId como number & { readonly __brand: \"OrderId\" }, e uma função auxiliar (toOrderId) pra converter um number nele de forma explícita.",
            solution: {
              code: {
                language: "typescript",
                filename: "cancel-order.ts",
                code: [
                  'type OrderId = number & { readonly __brand: "OrderId" };',
                  "function toOrderId(id: number): OrderId {",
                  "  return id as OrderId;",
                  "}",
                  "",
                  "function cancelOrder(orderId: OrderId) { /* ... */ }",
                  "",
                  "const userId: number = 42;",
                  "// cancelOrder(userId); // erro: 'number' não é atribuível a 'OrderId'",
                  "cancelOrder(toOrderId(99)); // ok — conversão explícita e intencional",
                ].join("\n"),
              },
              explanation:
                "OrderId deixou de ser compatível com number cru — a única forma de obter um é passando " +
                "explicitamente por toOrderId, tornando impossível passar um userId por engano.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Structural Typing",
          note: "Tipagem estrutural",
          requires: ["Nominal Typing"],
          revisit: ["Software Design / Design Principles / Program to an Interface"],
          summary:
            "Structural Typing é o modelo em que dois tipos são compatíveis quando têm a mesma estrutura, qualquer " +
            "que seja o nome.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O que conta são os campos que existem e os seus tipos. Se um valor tem todos os campos que um tipo " +
                "exige, ele é compatível com esse tipo, mesmo declarado com outro nome (ou nenhum), e mesmo com campos a " +
                "mais. É o modelo que o TypeScript usa por padrão.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "No TypeScript, ter os campos certos basta para ser aceito, então um nome de tipo diferente não protege " +
                "contra trocas por engano.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Diferente de Nominal Typing, Structural Typing é o modelo padrão do TypeScript, e reflete bem " +
                "como JavaScript já funciona por baixo — duck typing em runtime. Isso permite muito mais " +
                "flexibilidade: uma função que espera { name: string } aceita qualquer objeto com esse campo, " +
                "não importa como ele foi criado.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "structural.ts",
              code: [
                "interface Named {",
                "  name: string;",
                "}",
                "function greet(entity: Named) {",
                "  return `Olá, ${entity.name}`;",
                "}",
                "",
                "class Person { constructor(public name: string) {} }",
                'const dog = { name: "Rex", breed: "Labrador" };',
                "",
                'greet(new Person("Ana")); // ok — Person tem \'name\'',
                "greet(dog);                // ok também — dog tem 'name'",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Nem Person nem dog foram declarados como Named explicitamente — os dois são aceitos porque " +
                "têm a estrutura exigida. Isso é Structural Typing: compatibilidade pela forma, não pelo nome.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Tipos diferentes que por acaso têm a mesma forma são intercambiáveis, o que pode esconder trocas de " +
                "conceitos de domínio.",
                "Campos a mais são aceitos em variáveis, mas literais de objeto passam por checagem de excesso, o que " +
                "confunde no começo.",
                "O compilador só confia na forma; nada garante que o valor cumpra o contrato do comportamento.",
              ],
            },
          ],
          examples: [
            {
              title: "Compatibilidade com campos a mais",
              context: "Structural Typing só exige os campos necessários, não uma estrutura idêntica.",
              code: {
                language: "typescript",
                filename: "point.ts",
                code: ["interface Point { x: number; y: number; }", "function distanceFromOrigin(p: Point) {", "  return Math.sqrt(p.x ** 2 + p.y ** 2);", "}", "const p3d = { x: 3, y: 4, z: 5 };", "distanceFromOrigin(p3d); // ok — tem x e y (e mais)"].join("\n"),
              },
              explanation: "p3d tem um campo z extra que Point nem pede — Structural Typing só exige que os campos necessários existam.",
            },
            {
              title: "Interfaces diferentes, mesma estrutura, intercambiáveis",
              context: "Duas interfaces com a mesma forma são compatíveis entre si.",
              code: {
                language: "typescript",
                filename: "interchangeable.ts",
                code: ["interface Employee { id: number; name: string; }", "interface Contractor { id: number; name: string; }", "", "function printId(entity: Employee) { console.log(entity.id); }", 'const c: Contractor = { id: 1, name: "Ana" };', "printId(c); // ok — mesma estrutura"].join("\n"),
              },
              explanation: "Diferente de Nominal Typing, aqui Employee e Contractor são intercambiáveis porque a estrutura bate.",
            },
            {
              title: "Duck typing em runtime, a raiz de onde Structural Typing vem",
              context: "JavaScript puro já funciona assim, sem tipos declarados.",
              code: { language: "javascript", filename: "duck-typing.js", code: ["function makeItSpeak(entity) {", "  return entity.speak(); // não importa o QUE entity é, só que tenha .speak()", "}", 'makeItSpeak({ speak: () => "au au" });'].join("\n") },
              explanation: "Em JavaScript puro, qualquer objeto com .speak() funciona — Structural Typing é esse mesmo princípio, verificado estaticamente.",
            },
          ],
          exercise: {
            problem: "A função abaixo foi escrita esperando só instâncias de uma classe ConsoleLogger específica — mais restritivo do que Structural Typing permitiria.",
            problemCode: {
              language: "typescript",
              filename: "process.ts",
              code: ["class ConsoleLogger {", "  log(message: string) { console.log(message); }", "}", "function process(logger: ConsoleLogger) {", '  logger.log("processando...");', "}"].join("\n"),
            },
            task: "Reescreva a assinatura de process para aceitar qualquer objeto com um método log(message: string), sem exigir especificamente um ConsoleLogger.",
            hint: "Declare uma interface só com a forma necessária, e use-a como o tipo do parâmetro em vez da classe concreta.",
            solution: {
              code: {
                language: "typescript",
                filename: "process.ts",
                code: [
                  "interface Logger {",
                  "  log(message: string): void;",
                  "}",
                  "function process(logger: Logger) {",
                  '  logger.log("processando...");',
                  "}",
                  "",
                  "class ConsoleLogger { log(message: string) { console.log(message); } }",
                  "class FileLogger { log(message: string) { /* grava em arquivo */ } }",
                  "",
                  "process(new ConsoleLogger()); // ok",
                  "process(new FileLogger());    // também ok — mesma estrutura",
                ].join("\n"),
              },
              explanation: "Logger descreve só a forma necessária — qualquer coisa com log(message: string) é aceita, aproveitando Structural Typing em vez de acoplar a uma classe concreta.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Generics",
          note: "Genéricos",
          requires: ["Type Safety", "Programming Fundamentals / Abstraction"],
          revisit: ["Data Structures (coleções genéricas)"],
          summary: "Generics são a forma de escrever funções e classes parametrizadas por tipo, e não só por valor.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma função ou classe genérica funciona com qualquer tipo T, mas o compilador continua sabendo exatamente " +
                "qual T está em jogo em cada uso, preservando a relação entre entrada e saída.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando você pensar em usar `any` para reaproveitar código, um genérico costuma resolver o mesmo problema " +
                "sem perder a Type Safety.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem generics, escrever uma função que funciona com qualquer tipo exigiria any — o que joga " +
                "fora toda a Type Safety. Generics resolvem isso: o tipo continua desconhecido no momento de " +
                "escrever a função, mas fica conhecido e checado no momento de usar. É Abstraction aplicada a " +
                "tipos — a função abstrai o tipo concreto, mas a relação entre entrada e saída continua garantida.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "first-element.ts",
              code: [
                "function firstElement<T>(arr: T[]): T {",
                "  return arr[0];",
                "}",
                "const num = firstElement([1, 2, 3]);       // T é inferido como number",
                'const str = firstElement(["a", "b", "c"]); // T é inferido como string',
                "// num.toUpperCase(); // erro: number não tem toUpperCase",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "firstElement funciona com qualquer array, mas o TypeScript sabe que o retorno tem o mesmo " +
                "tipo dos elementos — diferente de any, que perderia essa relação completamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o código funciona igual para vários tipos, como coleções, e a saída depende do tipo de entrada.",
                "No lugar de `any`, para manter a relação entre os tipos envolvidos e a segurança de tipos.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se só um tipo concreto é usado, o parâmetro de tipo é complexidade sem benefício.",
                "Parâmetros demais e restrições aninhadas tornam as mensagens de erro e a leitura difíceis; mantenha-os " +
                "poucos e nomeados.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma estrutura de dados genérica",
              context: "A mesma classe funciona pra qualquer tipo, sem duplicar código.",
              code: {
                language: "typescript",
                filename: "stack.ts",
                code: ["class Stack<T> {", "  #items: T[] = [];", "  push(item: T) { this.#items.push(item); }", "  pop(): T | undefined { return this.#items.pop(); }", "}", "const numbers = new Stack<number>();", "numbers.push(1);", '// numbers.push("dois"); // erro: string não é number'].join("\n"),
              },
              explanation: "Stack<number> garante que só number pode entrar — a mesma classe Stack<T> funciona igual para Stack<string>, Stack<User>, etc.",
            },
            {
              title: "Generics com múltiplos parâmetros de tipo",
              context: "Cada parâmetro de tipo pode ser completamente diferente do outro.",
              code: { language: "typescript", filename: "pair.ts", code: ["function makePair<K, V>(key: K, value: V): [K, V] {", "  return [key, value];", "}", 'const pair = makePair("age", 30); // [string, number]'].join("\n") },
              explanation: "K e V podem ser tipos completamente diferentes um do outro — generics não exige que todos os tipos parametrizados sejam iguais.",
            },
            {
              title: "Generics com restrição (constraint)",
              context: "T extends limita o generic a tipos que cumpram um contrato mínimo.",
              code: {
                language: "typescript",
                filename: "longest.ts",
                code: ["interface HasLength { length: number; }", "function longest<T extends HasLength>(a: T, b: T): T {", "  return a.length >= b.length ? a : b;", "}", 'longest("abc", "de");        // ok — string tem length', "longest([1, 2, 3], [4, 5]);  // ok — array tem length"].join("\n"),
              },
              explanation: "T extends HasLength restringe o generic a tipos que tenham .length — não precisa aceitar qualquer coisa, pode exigir um contrato mínimo via Interface.",
            },
          ],
          exercise: {
            problem: "A função abaixo usa any pra funcionar com qualquer tipo de array — mas isso perde a relação entre o tipo de entrada e o de saída.",
            problemCode: {
              language: "typescript",
              filename: "get-last-item.ts",
              code: ["function getLastItem(arr: any): any {", "  return arr[arr.length - 1];", "}", "const lastNumber = getLastItem([1, 2, 3]);", "lastNumber.toUpperCase(); // sem erro de compilação — mas quebra em runtime"].join("\n"),
            },
            task: "Reescreva getLastItem usando Generics, de forma que o tipo de retorno seja sempre o mesmo dos elementos do array de entrada.",
            hint: "Use um parâmetro de tipo T tanto no array de entrada (T[]) quanto no tipo de retorno (T).",
            solution: {
              code: {
                language: "typescript",
                filename: "get-last-item.ts",
                code: ["function getLastItem<T>(arr: T[]): T {", "  return arr[arr.length - 1];", "}", "const lastNumber = getLastItem([1, 2, 3]); // T inferido como number", "// lastNumber.toUpperCase(); // agora É erro de compilação"].join("\n"),
              },
              explanation: "Com T preservando a relação entre entrada e saída, o TypeScript sabe que lastNumber é number — o erro que antes só aparecia em runtime agora é pego antes de rodar.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Union Types",
          note: "Tipos de união",
          requires: ["Type Safety"],
          summary: "Um Union Type (A | B) é um tipo cujo valor pode ter uma entre algumas formas conhecidas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O valor é um OU outro, nunca os dois ao mesmo tempo, dependendo do caso. É a forma de expressar variação " +
                "sem abrir mão de checagem de tipo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Se um valor tem poucas formas conhecidas, declare-as num Union em vez de aceitar `any` ou montar uma " +
                "hierarquia de classes.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Muitos valores do mundo real legitimamente podem ser de mais de um tipo — um ID pode ser " +
                "string ou number, uma resposta de API pode ser sucesso ou erro. Sem Union Types, a " +
                "alternativa seria usar any (perdendo Type Safety) ou criar uma hierarquia de classes só pra " +
                "isso. Union Types resolvem isso diretamente, no próprio sistema de tipos.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "format-id.ts",
              code: ["function formatId(id: string | number) {", "  return `ID: ${id}`;", "}", "formatId(42);      // ok", 'formatId("abc-1"); // ok', "// formatId(true); // erro: boolean não faz parte da união"].join("\n"),
            },
            {
              type: "paragraph",
              text: "id pode ser string OU number — nada mais é aceito. O compilador sabe exatamente quais formas são válidas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para modelar variação explícita, como estados de carregamento, ou um valor que pode ser `null`.",
                "Com tipos literais, para restringir um valor a um conjunto conhecido.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só se acessa o que é comum a todos os membros até fazer narrowing; sem isso o compilador recusa o acesso.",
                "Uniões muito largas tornam cada uso cheio de checagens; prefira uma união discriminada, com um campo que " +
                "identifica cada caso.",
              ],
            },
          ],
          examples: [
            {
              title: "Estado de carregamento como union de estados possíveis",
              context: "A união exclui combinações inválidas por construção.",
              code: {
                language: "typescript",
                filename: "request-state.ts",
                code: ["type RequestState =", '  | { status: "loading" }', '  | { status: "success"; data: string }', '  | { status: "error"; message: string };'].join("\n"),
              },
              explanation: "RequestState só pode ser uma dessas três formas — impossível representar um estado inválido tipo \"success sem data\".",
            },
            {
              title: "Union de tipos literais restringindo valores possíveis",
              context: "Em vez de aceitar qualquer string, só os literais válidos.",
              code: {
                language: "typescript",
                filename: "direction.ts",
                code: ['type Direction = "up" | "down" | "left" | "right";', "function move(direction: Direction) { /* ... */ }", 'move("up");     // ok', '// move("diagonal"); // erro: não faz parte da união'].join("\n"),
              },
              explanation: "Direction restringe aos 4 valores válidos — o compilador recusa qualquer outro literal.",
            },
            {
              title: "Union com null tornando ausência explícita",
              context: "O compilador força lidar com o caso de ausência antes de usar o valor.",
              code: {
                language: "typescript",
                filename: "find-user.ts",
                code: ["function findUser(id: number): { name: string } | null {", '  return id === 1 ? { name: "Ana" } : null;', "}", "const user = findUser(2);", "// user.name; // erro: 'user' is possibly 'null'"].join("\n"),
              },
              explanation: "O retorno declara explicitamente que pode não haver usuário — o compilador força lidar com null antes de acessar .name.",
            },
          ],
          exercise: {
            problem: "A função abaixo usa any pra aceitar número ou string representando um preço, perdendo toda a checagem de tipo.",
            problemCode: {
              language: "typescript",
              filename: "format-price.ts",
              code: ["function formatPrice(price: any) {", "  return `R$ ${price.toFixed(2)}`; // quebra em runtime se price for string", "}", "formatPrice(9.9);    // \"R$ 9.90\"", 'formatPrice("9.9");  // TypeError: price.toFixed is not a function'].join("\n"),
            },
            task: "Reescreva formatPrice usando um Union Type (number | string) em vez de any, e trate os dois casos corretamente.",
            hint: "Use typeof price === \"number\" pra estreitar qual dos dois tipos da união você está lidando em cada ramo (isso antecipa o próximo Concept, Type Narrowing).",
            solution: {
              code: {
                language: "typescript",
                filename: "format-price.ts",
                code: ["function formatPrice(price: number | string) {", '  const value = typeof price === "number" ? price : parseFloat(price);', "  return `R$ ${value.toFixed(2)}`;", "}", "formatPrice(9.9);   // \"R$ 9.90\"", 'formatPrice("9.9"); // "R$ 9.90"'].join("\n"),
              },
              explanation: "number | string documenta exatamente as duas formas válidas — e o typeof dentro da função lida com cada uma explicitamente.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Intersection Types",
          note: "Tipos de interseção",
          requires: ["Union Types"],
          summary: "Um Intersection Type (A & B) é um tipo cujo valor precisa cumprir vários tipos ao mesmo tempo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O valor precisa ter todos os campos de A e todos os campos de B. É o contrário do Union (A | B, um ou " +
                "outro): Intersection exige os dois simultaneamente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Para juntar formas pequenas numa maior, uma Intersection resolve sem precisar de herança.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Às vezes você quer combinar formas menores e independentes numa forma maior, sem criar uma " +
                "hierarquia de herança pra isso — Composition aplicada a tipos, do mesmo jeito que Composition " +
                "(o Concept de objetos) combina comportamento sem Inheritance. Interfaces menores e focadas " +
                "podem ser combinadas sob demanda, só onde fizer sentido.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "intersection.ts",
              code: [
                "interface Named { name: string; }",
                "interface Aged { age: number; }",
                "type Person = Named & Aged; // precisa ter name E age",
                "",
                'const p: Person = { name: "Ana", age: 30 }; // ok, tem os dois',
                "// const invalid: Person = { name: \"Ana\" }; // erro: falta 'age'",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text: "Person exige todos os campos de Named E de Aged — a interseção combina as duas formas numa forma maior, sem herança nenhuma envolvida.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para compor uma forma maior a partir de formas menores, sem criar uma hierarquia de herança.",
                "Para acrescentar campos de contexto a um tipo base.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Tipos com propriedades conflitantes podem resultar em `never`, e o erro só aparece no uso.",
                "Intersecções muito grandes ou aninhadas ficam difíceis de ler; nomeie o resultado.",
              ],
            },
          ],
          examples: [
            {
              title: "Combinando uma interface base com uma extensão de contexto",
              context: "Dois conceitos que fazem sentido separadamente, combinados sob demanda.",
              code: {
                language: "typescript",
                filename: "user-response.ts",
                code: ["interface ApiResponse { status: number; }", "interface UserData { name: string; email: string; }", "type UserResponse = ApiResponse & UserData;", "", 'const res: UserResponse = { status: 200, name: "Ana", email: "ana@ex.com" };'].join("\n"),
              },
              explanation: "UserResponse precisa dos campos de ApiResponse E de UserData juntos.",
            },
            {
              title: "Intersection com Generics",
              context: "Acrescentar metadados fixos a qualquer tipo T.",
              code: {
                language: "typescript",
                filename: "with-timestamp.ts",
                code: ["type WithTimestamp<T> = T & { createdAt: Date };", "type TimestampedUser = WithTimestamp<{ name: string }>;", "", 'const u: TimestampedUser = { name: "Ana", createdAt: new Date() };'].join("\n"),
              },
              explanation: "WithTimestamp<T> acrescenta createdAt a qualquer tipo T — Intersection combinada com Generics compõe essa \"marca\" em cima de qualquer forma.",
            },
            {
              title: "Intersection revelando um conflito de tipos",
              context: "Quando os dois lados exigem tipos incompatíveis para o mesmo campo.",
              code: { language: "typescript", filename: "impossible.ts", code: ["type A = { value: string };", "type B = { value: number };", "type Impossible = A & B; // value vira \"string & number\" — nenhum valor satisfaz os dois"].join("\n") },
              explanation: "Quando os dois lados exigem tipos incompatíveis pro mesmo campo, o resultado é um tipo praticamente impossível de satisfazer.",
            },
          ],
          exercise: {
            problem: "Duas interfaces menores já existem separadamente, mas Order precisa das duas ao mesmo tempo — hoje Order está duplicando os campos manualmente.",
            problemCode: {
              language: "typescript",
              filename: "order.ts",
              code: ["interface Timestamped { createdAt: Date; }", "interface Identifiable { id: string; }", "interface Order { // duplicando os campos em vez de reaproveitar", "  id: string;", "  createdAt: Date;", "  total: number;", "}"].join("\n"),
            },
            task: "Reescreva Order usando Intersection Types pra combinar Timestamped, Identifiable e um campo próprio (total: number), sem duplicar id/createdAt.",
            hint: "Um type pode ser a interseção de duas interfaces mais um objeto de campos próprios, tudo junto com &.",
            solution: {
              code: {
                language: "typescript",
                filename: "order.ts",
                code: [
                  "interface Timestamped { createdAt: Date; }",
                  "interface Identifiable { id: string; }",
                  "type Order = Timestamped & Identifiable & { total: number };",
                  "",
                  'const order: Order = { id: "1", createdAt: new Date(), total: 99.9 };',
                ].join("\n"),
              },
              explanation: "Order agora reaproveita Timestamped e Identifiable via interseção, em vez de duplicar id/createdAt.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Type Narrowing",
          note: "Estreitamento de tipos",
          requires: ["Union Types"],
          revisit: ["Software Craft / Guard Clauses (narrowing por guarda)"],
          summary: "Type Narrowing é reduzir um Union Type a um tipo mais específico dentro de um bloco de código.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A redução acontece através de checagens que o compilador entende — typeof, instanceof, checagem de uma " +
                "propriedade. Depois de um narrowing bem-sucedido, o compilador trata o valor como o tipo restante.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Antes de usar um valor de Union, faça a checagem que o compilador entende, e ele passa a garantir o tipo " +
                "por você.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um Union Type sozinho só permite usar o que é comum a todos os tipos da união — pra usar algo " +
                "específico de só um deles, o compilador precisa ter certeza (via alguma checagem no código) " +
                "de qual tipo está em jogo naquele ponto. Type Narrowing é como você \"prova\" isso pro " +
                "compilador, ponto a ponto do código.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "typescript",
              filename: "narrowing.ts",
              code: [
                "function printLength(value: string | string[]) {",
                '  if (typeof value === "string") {',
                "    console.log(value.length);   // aqui, TypeScript sabe: value é string",
                "  } else {",
                "    console.log(value.length);   // aqui, TypeScript sabe: value é string[]",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Fora do if, value é string | string[] — mas dentro de cada ramo, o typeof estreita o tipo pra " +
                "um dos dois específicos, e o compilador acompanha essa dedução automaticamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Depois de checagens como `typeof`, `instanceof`, `in` ou um campo discriminante, para trabalhar com o tipo " +
                "específico dentro do bloco.",
                "Com uniões discriminadas, que dão ao compilador uma checagem simples e completa.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O compilador só reconhece checagens que ele entende; uma função de checagem própria precisa declarar o tipo " +
                "de retorno como predicado (type guard).",
                "O narrowing vale só dentro do bloco: depois de uma atribuição ou chamada, o compilador pode perder o " +
                "refinamento.",
              ],
            },
          ],
          examples: [
            {
              title: "Narrowing via instanceof",
              context: "Estreitar a união pro ramo específico de uma classe.",
              code: {
                language: "typescript",
                filename: "handle-error.ts",
                code: [
                  "class ApiError extends Error { statusCode: number = 500; }",
                  "",
                  "function handleError(error: Error | ApiError) {",
                  "  if (error instanceof ApiError) {",
                  "    console.log(error.statusCode); // aqui, TypeScript sabe: é ApiError",
                  "  } else {",
                  "    console.log(error.message);    // aqui, só Error garantido",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation: "instanceof ApiError estreita a união pro ramo específico — só dentro do if o compilador permite acessar statusCode.",
            },
            {
              title: "Narrowing via checagem de campo (discriminated union)",
              context: "O padrão mais comum na prática — um campo funciona como discriminador.",
              code: {
                language: "typescript",
                filename: "result.ts",
                code: [
                  "type Result =",
                  '  | { success: true; data: string }',
                  '  | { success: false; error: string };',
                  "",
                  "function handle(result: Result) {",
                  "  if (result.success) {",
                  "    console.log(result.data);  // TypeScript sabe: é o ramo success:true",
                  "  } else {",
                  "    console.log(result.error); // aqui, é o ramo success:false",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation: "success funciona como um discriminador — checar seu valor é suficiente pro TypeScript saber exatamente qual forma da união está em jogo.",
            },
            {
              title: "Narrowing via in",
              context: "Verificar a presença de uma propriedade em tempo de execução E de compilação.",
              code: {
                language: "typescript",
                filename: "area-in.ts",
                code: [
                  'type Circle = { kind: "circle"; radius: number };',
                  'type Square = { kind: "square"; side: number };',
                  "",
                  "function area(shape: Circle | Square) {",
                  '  if ("radius" in shape) {',
                  "    return Math.PI * shape.radius ** 2; // TypeScript sabe: é Circle",
                  "  }",
                  "  return shape.side ** 2; // aqui, só pode ser Square",
                  "}",
                ].join("\n"),
              },
              explanation: "\"radius\" in shape verifica a presença do campo em runtime E estreita o tipo em compilação, os dois ao mesmo tempo.",
            },
          ],
          exercise: {
            problem: "A função abaixo acessa campos de ambos os ramos de um Union Type sem estreitar o tipo primeiro — o compilador recusa.",
            problemCode: {
              language: "typescript",
              filename: "area.ts",
              code: [
                'type Circle = { kind: "circle"; radius: number };',
                'type Square = { kind: "square"; side: number };',
                "",
                "function area(shape: Circle | Square) {",
                "  return Math.PI * shape.radius ** 2; // erro: 'radius' não existe em 'Square'",
                "}",
              ].join("\n"),
            },
            task: "Corrija area usando Type Narrowing (baseado no campo kind) para acessar radius só quando shape for Circle, e side só quando for Square.",
            hint: "Cheque shape.kind === \"circle\" (o campo discriminador) antes de acessar radius.",
            solution: {
              code: {
                language: "typescript",
                filename: "area.ts",
                code: [
                  "function area(shape: Circle | Square) {",
                  '  if (shape.kind === "circle") {',
                  "    return Math.PI * shape.radius ** 2; // estreitado pra Circle",
                  "  }",
                  "  return shape.side ** 2; // só resta Square",
                  "}",
                ].join("\n"),
              },
              explanation: "Checar shape.kind === \"circle\" é o narrowing que faltava — dentro do if, o TypeScript sabe que shape é Circle e libera radius; no else, só Square resta.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "functional-programming",
      order: 40,
      title: "Functional Programming",
      requires: ["Programming Fundamentals"],
      summary:
        "Lar canônico de Pure Functions, Side Effects, Immutability, Referential Transparency, " +
        "Closure, Higher-Order Functions e Function Composition.",
      suggestions: [
        "Currying / Partial Application",
        "Recursion vs Iteration (ponte com Algorithms & Complexity)",
        "Functor / Monad (nível intuição)",
        "Lazy Evaluation",
        "Pipe / Flow",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Declarative vs Imperative",
          note: "Declarativo vs. imperativo",
          requires: ["Programming Fundamentals / Abstraction"],
          summary:
            "Declarative vs Imperative é a diferença entre descrever o resultado que se quer e descrever os passos " +
            "para chegar nele.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "No código imperativo, você escreve passos explícitos que mudam o estado do programa até chegar no " +
                "resultado — \"faça isso, depois isso, depois aquilo\". No declarativo, você diz \"eu quero isto\" e deixa " +
                "pra implementação decidir como chegar lá.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Se um loop só existe para montar um resultado, troque os passos por uma descrição do resultado que você " +
                "quer.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Todo o resto deste módulo (Map, Filter, Reduce, Pure Functions, Function Composition) é, no " +
                "fundo, uma forma de escrever código mais declarativo — entender essa distinção primeiro dá o " +
                "\"porquê\" por trás de cada um desses Concepts. Código declarativo tende a ser mais curto e " +
                "mais fácil de ler, mas depende de confiar na implementação por trás.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "double-all.js",
              code: [
                "// Imperativo: descreve o PASSO A PASSO",
                "const doubled = [];",
                "for (let i = 0; i < numbers.length; i++) {",
                "  doubled.push(numbers[i] * 2);",
                "}",
                "",
                "// Declarativo: descreve O QUE se quer",
                "const doubled2 = numbers.map(n => n * 2);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As duas versões produzem o mesmo resultado. A imperativa diz exatamente como percorrer, " +
                "acumular e inserir; a declarativa só diz \"eu quero cada número dobrado\" — o .map() decide " +
                "como iterar por baixo.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Nenhum estilo é melhor em tudo: um laço imperativo simples pode ser mais claro que uma cadeia declarativa " +
                "complicada.",
                "O declarativo esconde o \"como\", e isso pode esconder também o custo, como várias passagens sobre a mesma " +
                "coleção.",
                "Não é tudo ou nada: a maioria dos programas mistura os dois, e o objetivo é usar cada um onde deixa o " +
                "código mais claro.",
              ],
            },
          ],
          examples: [
            {
              title: "SQL como declarativo puro",
              context: "Você não diz como buscar — só o que quer.",
              code: { language: "text", filename: "query.sql", code: "SELECT name FROM users WHERE age > 18;" },
              explanation: "Você não diz como buscar (índice? scan completo?) — só o quê. O motor do banco decide a estratégia.",
            },
            {
              title: "CSS declarativo vs. manipulação de DOM imperativa",
              context: "O mesmo resultado, duas filosofias diferentes de descrevê-lo.",
              code: { language: "javascript", filename: "buttons.js", code: '.button { color: red; }\n\ndocument.querySelectorAll(".button").forEach(el => { el.style.color = "red"; });' },
              explanation: "CSS declara o resultado desejado; o JS imperativo descreve o passo a passo manual pra chegar lá.",
            },
            {
              title: "Condicional imperativa vs. busca declarativa",
              context: "find() expressa a intenção diretamente.",
              code: {
                language: "javascript",
                filename: "find-user.js",
                code: ["// imperativo", "let found = null;", "for (const user of users) {", "  if (user.id === targetId) { found = user; break; }", "}", "", "// declarativo", "const found2 = users.find(user => user.id === targetId);"].join("\n"),
              },
              explanation: ".find() expressa a intenção diretamente, sem descrever o loop, o break, a variável acumuladora.",
            },
          ],
          exercise: {
            problem: "O código abaixo filtra e transforma uma lista de pedidos de forma totalmente imperativa.",
            problemCode: {
              language: "javascript",
              filename: "summaries.js",
              code: ["const summaries = [];", "for (let i = 0; i < orders.length; i++) {", "  if (orders[i].total > 100) {", "    summaries.push(`Pedido #${orders[i].id}: R$ ${orders[i].total}`);", "  }", "}"].join("\n"),
            },
            task: "Reescreva no estilo declarativo, usando métodos de array que expressem \"filtre os pedidos com total > 100, depois transforme cada um numa string de resumo\".",
            hint: "Pense em qual método de array expressa \"manter só o que satisfaz uma condição\", e qual expressa \"transformar cada item\".",
            solution: {
              code: {
                language: "javascript",
                filename: "summaries.js",
                code: ["const summaries2 = orders", "  .filter(order => order.total > 100)", "  .map(order => `Pedido #${order.id}: R$ ${order.total}`);"].join("\n"),
              },
              explanation: ".filter() expressa \"mantenha só o que satisfaz\"; .map() expressa \"transforme cada item\" — a intenção fica evidente lendo o código.",
            },
          },
        }),
        concept({
          order: 20,
          title: "First-Class Functions",
          note: "Funções de primeira classe",
          requires: ["Declarative vs Imperative"],
          summary: "First-Class Functions são funções que a linguagem trata como qualquer outro valor.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma função pode ser guardada numa variável, passada como argumento pra outra função, devolvida como " +
                "resultado, guardada dentro de um array ou objeto. Não existe uma categoria especial de \"função\" separada " +
                "dos outros valores.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Sem First-Class Functions não existem Closures nem Higher-Order Functions, porque os dois dependem de " +
                "tratar funções como valores.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É o recurso de linguagem que habilita praticamente tudo neste módulo. Sem First-Class " +
                "Functions, não haveria como passar uma função de comparação pra .sort(), nem como " +
                "Map/Filter/Reduce receberem uma função como argumento, nem como Closures ou Higher-Order " +
                "Functions existirem. Este Concept é a base sobre a qual os outros são construídos.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "greet.js",
              code: [
                "const greet = function (name) { return `Olá, ${name}`; }; // função guardada numa variável",
                "",
                "function callTwice(fn, arg) { // função recebida como argumento",
                '  return fn(arg) + " " + fn(arg);',
                "}",
                'callTwice(greet, "Ana");',
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "greet é um valor comum — pode ser guardado, passado adiante, chamado de dentro de outra " +
                "função. Nada disso exige sintaxe especial.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Passar uma função adiante leva junto o contexto: `this` e as variáveis capturadas podem se comportar " +
                "diferente de onde ela foi escrita.",
                "Funções anônimas demais dificultam a leitura e o stack trace; dê nome às que fazem algo não trivial.",
                "Ter funções como valores é só o recurso da linguagem; usá-lo bem depende de outros conceitos, como pureza e " +
                "composição.",
              ],
            },
          ],
          examples: [
            {
              title: "Função guardada num objeto, como qualquer dado",
              context: "Funções vivem dentro de um objeto comum, igual guardaria números ou strings.",
              code: { language: "javascript", filename: "operations.js", code: ["const operations = {", "  add: (a, b) => a + b,", "  subtract: (a, b) => a - b,", "};", "operations.add(2, 3);"].join("\n") },
              explanation: "Funções são valores como quaisquer outros — vivem dentro de um objeto comum, sem sintaxe especial.",
            },
            {
              title: "Função devolvida por outra função",
              context: "Só é possível porque função é um valor de primeira classe.",
              code: { language: "javascript", filename: "multiplier.js", code: ["function multiplier(factor) {", "  return function (n) { return n * factor; }; // devolve uma função", "}", "const double = multiplier(2);", "double(5); // 10"].join("\n") },
              explanation: "multiplier devolve uma FUNÇÃO como resultado — tão devolvível quanto um number.",
            },
            {
              title: "Contraste com linguagens sem First-Class Functions plenas",
              context: "Passar comportamento como argumento nem sempre é tão direto.",
              code: {
                language: "text",
                filename: "note.txt",
                code:
                  "Em linguagens sem first-class functions plenas, passar comportamento como argumento exige\nmecanismos indiretos (ponteiros de função, interfaces com um único método, reflection) —\nnão é tão direto quanto simplesmente passar a função como valor.",
              },
              explanation: "O contraste ajuda a perceber o quanto isso facilita as coisas — em linguagens sem esse recurso pleno, comportamento não circula tão livremente quanto dado.",
            },
          ],
          exercise: {
            problem: "As duas funções abaixo duplicam lógica quase idêntica pra validar campos diferentes.",
            problemCode: {
              language: "javascript",
              filename: "validators.js",
              code: ["function validateEmail(user) {", '  return user.email.includes("@");', "}", "function validateAge(user) {", "  return user.age >= 18;", "}"].join("\n"),
            },
            task: "Usando First-Class Functions, crie uma função validate(user, rule) genérica que recebe a regra como argumento, eliminando a necessidade de funções separadas.",
            hint: "rule deveria ser uma função que recebe user e devolve true/false — a mesma validate serve pra qualquer regra.",
            solution: {
              code: {
                language: "javascript",
                filename: "validate.js",
                code: ["function validate(user, rule) {", "  return rule(user);", "}", 'validate(user, u => u.email.includes("@"));', "validate(user, u => u.age >= 18);"].join("\n"),
              },
              explanation: "validate não sabe nada sobre email ou idade — só chama a regra recebida, como valor.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Closure",
          note: "função + escopo capturado",
          isNew: true,
          requires: ["First-Class Functions"],
          revisit: ["Asynchronous Programming / Callback"],
          summary: "Um Closure é uma função junto com as variáveis do lugar onde ela foi criada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Mesmo depois que a função externa que criou esse ambiente já retornou, a função interna continua tendo " +
                "acesso a essas variáveis. Já vimos isso em Stack vs Heap: um closure é o que força uma variável local a " +
                "sobreviver no heap além do frame que a criou.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Quando você precisa de estado privado sem criar uma classe, um Closure resolve.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Closures permitem que uma função \"carregue\" contexto junto com ela — sem precisar de uma " +
                "classe, sem parâmetros extras toda vez que ela é chamada. É assim que callbacks conseguem " +
                "lembrar de dados relevantes no momento em que foram registrados, e é uma forma alternativa de " +
                "Encapsulation: estado privado, sem classe nenhuma envolvida.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "O mesmo makeCounter de Stack vs Heap, revisitado sob a lente de Closure:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "make-counter.js",
              code: ["function makeCounter() {", "  let count = 0; // parte do ambiente léxico de makeCounter", "  return function increment() {", '    count += 1; // increment "fecha sobre" count — isso é o closure', "    return count;", "  };", "}", "const counter = makeCounter();", "counter(); // 1", "counter(); // 2"].join(
                "\n"
              ),
            },
            {
              type: "paragraph",
              text:
                "increment continua tendo acesso a count muito depois que makeCounter já retornou — o closure " +
                "\"prende\" count ao lado de increment, mesmo que nada mais no programa consiga acessar count " +
                "diretamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para estado privado sem classe, como um contador ou um cache escondido dentro de uma função.",
                "Em callbacks que precisam lembrar de um contexto, como configuração ou dados de uma requisição.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "A closure mantém vivas as variáveis capturadas, e isso pode causar vazamento de memória se ela segurar " +
                "dados grandes.",
                "Com `var` num laço, todas as closures compartilham a mesma variável; use `let`, que cria uma por iteração.",
                "Muito estado escondido em closures dificulta depurar e testar; para estado complexo, uma classe pode ser " +
                "mais clara.",
              ],
            },
          ],
          examples: [
            {
              title: "Closures dando privacidade real",
              context: "Encapsulation sem classe nenhuma.",
              code: {
                language: "javascript",
                filename: "account.js",
                code: [
                  "function createAccount(initialBalance) {",
                  "  let balance = initialBalance; // privado — só acessível pelas funções devolvidas",
                  "  return {",
                  "    deposit: (amount) => { balance += amount; },",
                  "    getBalance: () => balance,",
                  "  };",
                  "}",
                  "const account = createAccount(100);",
                  "account.deposit(50);",
                  "account.getBalance(); // 150",
                ].join("\n"),
              },
              explanation: "balance nunca é exposto diretamente — só as funções devolvidas têm acesso, via closure. É Encapsulation sem class nenhuma.",
            },
            {
              title: "Um callback lembrando de contexto",
              context: "Cada registro do handler tem seu próprio closure independente.",
              code: {
                language: "javascript",
                filename: "click-counter.js",
                code: [
                  "function attachClickCounter(button, label) {",
                  "  let clicks = 0;",
                  '  button.addEventListener("click", () => {',
                  "    clicks += 1;",
                  "    console.log(`${label}: ${clicks} cliques`); // lembra de label e clicks",
                  "  });",
                  "}",
                ].join("\n"),
              },
              explanation: "O callback fecha sobre label e clicks — cada botão que chama attachClickCounter tem seu próprio closure independente.",
            },
            {
              title: "Uma armadilha clássica: var vs let em loop",
              context: "var compartilha uma única variável; let cria uma nova a cada iteração.",
              code: {
                language: "javascript",
                filename: "loop-closure.js",
                code: ["for (var i = 0; i < 3; i++) {", "  setTimeout(() => console.log(i), 0); // imprime 3, 3, 3", "}", "for (let j = 0; j < 3; j++) {", "  setTimeout(() => console.log(j), 0); // imprime 0, 1, 2", "}"].join("\n"),
              },
              explanation: "var cria uma única variável compartilhada pelo loop inteiro; let cria uma variável nova a cada iteração — cada closure fecha sobre a sua.",
            },
          ],
          exercise: {
            problem: "A função abaixo tenta criar múltiplos contadores independentes, mas todos compartilham o mesmo estado.",
            problemCode: {
              language: "javascript",
              filename: "shared-counter.js",
              code: ["let count = 0;", "function increment() {", "  count += 1;", "  return count;", "}", "const counterA = increment;", "const counterB = increment;", "counterA(); // 1", "counterB(); // 2 — deveria ser 1"].join("\n"),
            },
            task: "Reescreva usando closure de verdade (uma função de fábrica), de forma que counterA e counterB tenham cada um seu próprio count independente.",
            hint: "count precisa deixar de ser compartilhada no escopo externo e passar a viver dentro do ambiente léxico de uma função de fábrica, chamada uma vez por contador.",
            solution: {
              code: {
                language: "javascript",
                filename: "independent-counter.js",
                code: ["function makeCounter() {", "  let count = 0; // cada chamada cria um ambiente léxico próprio", "  return function increment() {", "    count += 1;", "    return count;", "  };", "}", "const counterA = makeCounter();", "const counterB = makeCounter();", "counterA(); // 1", "counterB(); // 1"].join(
                  "\n"
                ),
              },
              explanation: "Cada chamada de makeCounter() cria um novo ambiente léxico, com seu próprio count — counterA e counterB fecham sobre variáveis diferentes.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Side Effects",
          note: "Efeitos colaterais",
          requires: ["Programming Fundamentals / Encapsulation"],
          revisit: ["Concurrency / Shared State", "AI Engineering / Model Inference / Deterministic vs Stochastic Output"],
          summary: "Um Side Effect é qualquer coisa que uma função faz além de calcular e devolver um valor.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Modificar uma variável fora do seu escopo, mudar um objeto recebido por referência, escrever num " +
                "arquivo, fazer uma chamada de rede, imprimir no console, ler a hora atual: se a função \"toca\" o mundo " +
                "fora dela, ou depende de algo fora dela que pode mudar, isso é um efeito colateral.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Efeitos colaterais não são proibidos, mas precisam de um lugar escolhido no programa em vez de aparecer " +
                "em qualquer função.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nomear \"efeito colateral\" explicitamente é o primeiro passo pra decidir, de forma " +
                "deliberada, onde ele deveria acontecer no seu programa. Um programa sem nenhum efeito " +
                "colateral seria inútil (nunca mostraria nada na tela) — o objetivo não é eliminar efeitos " +
                "colaterais, é isolá-los da lógica de cálculo pura, exatamente o que Pure Functions descreve.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "add-to-total.js",
              code: ["let total = 0;", "function addToTotal(amount) {", "  total += amount; // efeito colateral: modifica uma variável FORA da função", "}", "addToTotal(10);"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "addToTotal não devolve nada de útil — o que ela faz é mudar total, uma variável que existe " +
                "fora dela. O \"trabalho de verdade\" acontece por fora do valor de retorno.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Não dá para eliminar todo efeito colateral: gravar, ler e chamar a rede são o ponto do programa; o objetivo " +
                "é isolá-los.",
                "Mutar um parâmetro recebido por referência é efeito colateral que quem chamou não espera.",
                "Depender de algo externo mutável, como uma variável global, é efeito colateral escondido na entrada da função.",
              ],
            },
          ],
          examples: [
            {
              title: "Mutação de um parâmetro recebido por referência",
              context: "Um efeito colateral sutil — afeta algo fora do escopo local.",
              code: { language: "javascript", filename: "add-item.js", code: ["function addItem(cart, item) {", "  cart.items.push(item); // efeito colateral: muta o objeto recebido", "}"].join("\n") },
              explanation: "addItem muta o cart que recebeu — um efeito colateral porque afeta algo que existe fora do escopo local.",
            },
            {
              title: "I/O como efeito colateral necessário",
              context: "Não é \"errado\" — só precisa ser reconhecido como diferente de um cálculo puro.",
              code: {
                language: "javascript",
                filename: "log-error.js",
                code: ["function logError(message) {", "  console.error(message); // efeito colateral: escreve no console", '  fs.appendFileSync("errors.log", message); // efeito colateral: escreve em disco', "}"].join("\n"),
              },
              explanation: "Os dois efeitos colaterais aqui são o ponto da função — não tem como logar um erro sem tocar o mundo fora dela.",
            },
            {
              title: "Depender de algo externo mutável",
              context: "Também é efeito colateral, na direção oposta (ler, não escrever).",
              code: { language: "javascript", filename: "discounted-price.js", code: ["function getDiscountedPrice(price) {", "  return price * (1 - currentPromotion.discountRate); // depende de algo externo e mutável", "}"].join("\n") },
              explanation: "Mesmo sem modificar nada, a função depende de currentPromotion — chamar duas vezes com o mesmo price pode dar resultados diferentes.",
            },
          ],
          exercise: {
            problem: "A função abaixo mistura cálculo com efeito colateral, sem deixar claro qual parte é qual.",
            problemCode: {
              language: "javascript",
              filename: "process-order.js",
              code: ["let orderCount = 0;", "function processOrder(order) {", "  orderCount += 1; // efeito colateral", "  return order.items.reduce((sum, item) => sum + item.price, 0); // cálculo", "}"].join("\n"),
            },
            task:
              "Identifique (em comentário) qual linha é efeito colateral e qual é cálculo puro, e reescreva a função separando as duas responsabilidades — sem remover o efeito colateral do programa, só isolando onde ele acontece.",
            hint: "Uma função pode calcular o total sem incrementar orderCount; outra função cuida do efeito colateral separadamente.",
            solution: {
              code: {
                language: "javascript",
                filename: "process-order-split.js",
                code: [
                  "function calculateOrderTotal(order) { // cálculo puro, sem efeito colateral",
                  "  return order.items.reduce((sum, item) => sum + item.price, 0);",
                  "}",
                  "",
                  "let orderCount = 0;",
                  "function trackOrder() { // só o efeito colateral, isolado",
                  "  orderCount += 1;",
                  "}",
                  "",
                  "function processOrder(order) {",
                  "  trackOrder();",
                  "  return calculateOrderTotal(order);",
                  "}",
                ].join("\n"),
              },
              explanation: "calculateOrderTotal só calcula; trackOrder isola o efeito colateral. processOrder orquestra as duas, deixando claro onde cada tipo de trabalho acontece.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Pure Functions",
          note: "Funções puras",
          requires: ["Side Effects"],
          revisit: ["Testing & Quality Engineering / Testing Strategy / Testability", "Algorithms & Complexity / Memoization"],
          summary:
            "Uma Pure Function é uma função que sempre devolve o mesmo resultado para o mesmo input e não produz " +
            "nenhum Side Effect.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Na prática, isso vira duas regras: nunca depender de nada externo que possa variar, e nunca mutar nada " +
                "fora dela, fazer I/O ou depender de estado externo mutável.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Uma Pure Function pode ser testada, cacheada e chamada quantas vezes for preciso sem surpresa.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Funções puras são as unidades mais fáceis de entender, testar e reutilizar que existem — dado " +
                "o input, o resultado é sempre previsível, sem precisar simular o resto do sistema pra testar. " +
                "É também o que torna otimizações como memoization seguras: se o resultado é sempre o mesmo " +
                "pro mesmo input, dá pra guardar em cache sem medo.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "pure-vs-impure.js",
              code: [
                "// Pura: mesmo input, sempre o mesmo output, sem efeito colateral",
                "function add(a, b) {",
                "  return a + b;",
                "}",
                "",
                "// Impura: depende de estado externo mutável (Date.now() muda a cada chamada)",
                "function addWithTimestamp(a, b) {",
                "  return { sum: a + b, at: Date.now() };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "add(2, 3) sempre devolve 5, não importa quando ou quantas vezes for chamada. " +
                "addWithTimestamp(2, 3) devolve algo diferente a cada chamada, mesmo com os mesmos argumentos.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para regras de negócio e transformações de dados, que ficam previsíveis e testáveis sem dublês.",
                "Quando o resultado pode ser reaproveitado, com cache ou memoization, sem risco de valor errado.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um programa útil precisa de efeitos, como I/O; a ideia é manter o núcleo puro e os efeitos nas bordas.",
                "Aleatoriedade, hora atual e leitura de estado externo não são puras; passe esses valores como argumento.",
              ],
            },
          ],
          examples: [
            {
              title: "Impureza por mutar um parâmetro",
              context: "Versão impura muda o que recebeu; versão pura devolve dado novo.",
              code: {
                language: "javascript",
                filename: "add-tax.js",
                code: ["// Impura: muta o array recebido", "function addTax(items) {", "  items.forEach(item => { item.price *= 1.1; });", "  return items;", "}", "// Pura: devolve um array novo", "function addTaxPure(items) {", "  return items.map(item => ({ ...item, price: item.price * 1.1 }));", "}"].join(
                  "\n"
                ),
              },
              explanation: "A versão impura muda os objetos recebidos; a versão pura devolve dados novos, sem tocar no original.",
            },
            {
              title: "Impureza por depender de estado global",
              context: "A versão pura recebe tudo que precisa como argumento.",
              code: {
                language: "javascript",
                filename: "calculate-tax.js",
                code: ["let taxRate = 0.1;", "function calculateTax(price) { // impura: depende de taxRate", "  return price * taxRate;", "}", "function calculateTaxPure(price, rate) { // pura", "  return price * rate;", "}"].join("\n"),
              },
              explanation: "A versão pura não depende de uma variável externa que pode ter um valor diferente na próxima chamada.",
            },
            {
              title: "Aleatoriedade nunca é pura",
              context: "Sem input, com output variável — quebra as duas regras de uma vez.",
              code: { language: "javascript", filename: "roll-dice.js", code: "function rollDice() {\n  return Math.floor(Math.random() * 6) + 1; // impura por natureza\n}" },
              explanation: "rollDice() não recebe input, e o output varia a cada chamada — por definição, não pode ser pura.",
            },
          ],
          exercise: {
            problem: "A função abaixo mistura leitura de uma variável global com o cálculo, tornando-a impura sem necessidade.",
            problemCode: {
              language: "javascript",
              filename: "apply-discount.js",
              code: ["let discountPercent = 10;", "function applyDiscount(price) {", "  return price - (price * discountPercent / 100);", "}"].join("\n"),
            },
            task: "Reescreva applyDiscount como uma Pure Function — tudo que ela precisa deveria vir como parâmetro.",
            hint: "Adicione discountPercent como um segundo parâmetro, em vez de lê-lo do escopo externo.",
            solution: {
              code: {
                language: "javascript",
                filename: "apply-discount-pure.js",
                code: ["function applyDiscountPure(price, discountPercent) {", "  return price - (price * discountPercent / 100);", "}", "applyDiscountPure(100, 10); // sempre 90, para os mesmos argumentos"].join("\n"),
              },
              explanation: "applyDiscountPure não depende de nada fora dela — o mesmo par de argumentos sempre produz o mesmo resultado.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Referential Transparency",
          note: "Transparência referencial",
          requires: ["Pure Functions"],
          summary:
            "Referential Transparency é a propriedade de uma expressão que pode ser trocada pelo seu valor sem mudar " +
            "o comportamento do programa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "add(2, 3) tem transparência referencial porque você pode trocar cada ocorrência dela por 5 em qualquer " +
                "lugar, e o programa continua funcionando exatamente igual.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se trocar uma chamada pelo seu resultado muda o programa, aquela função não é pura.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É uma consequência direta — quase uma definição alternativa — de trabalhar só com Pure " +
                "Functions. Se uma função é pura, então chamá-la é intercambiável com o valor que ela produz. " +
                "Isso permite raciocinar sobre código \"substituindo mentalmente\" chamadas por valores — o " +
                "tipo de raciocínio que fica impossível quando funções têm efeitos colaterais.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "double.js",
              code: ["function double(n) { return n * 2; }", "", "const a = double(5) + double(5); // pode ser reescrito como:", "const b = 10 + 10;               // sem mudar NADA no comportamento"].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "impure-double.js",
              code: [
                "function impureDouble(n) {",
                '  console.log("calculando..."); // efeito colateral — quebra a transparência',
                "  return n * 2;",
                "}",
                "// impureDouble(5) + impureDouble(5) NÃO pode virar 10 + 10 sem perder os dois console.log",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Com double (pura), substituir a chamada pelo resultado não muda nada. Com impureDouble, " +
                "substituir a chamada pelo valor eliminaria os efeitos colaterais — a substituição deixa de " +
                "ser \"transparente\".",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Basta um estado mutável ou um efeito colateral para quebrá-la, e a expressão deixa de poder ser trocada " +
                "pelo seu valor.",
                "Ela vale para expressões, não para a linguagem inteira: parte do código pode ser transparente e outra parte " +
                "não.",
                "É o que permite memoization com segurança; sem ela, o cache pode devolver um valor que já não é o certo.",
              ],
            },
          ],
          examples: [
            {
              title: "Transparência permitindo reescrever expressões livremente",
              context: "Uma reescrita só é segura porque o valor nunca muda.",
              code: { language: "javascript", filename: "square.js", code: ["function square(n) { return n * n; }", "const result = square(3) + square(3) + square(3);", "const result2 = 3 * square(3); // reescrita válida"].join("\n") },
              explanation: "Como square(3) sempre devolve o mesmo valor, multiplicar por 3 em vez de somar três vezes é uma reescrita segura.",
            },
            {
              title: "Quebra de transparência por estado mutável",
              context: "Não existe um único valor que substitua todas as chamadas.",
              code: {
                language: "javascript",
                filename: "next.js",
                code: ["let counter = 0;", "function next() { return ++counter; } // não é referencialmente transparente", "const pair = [next(), next()]; // [1, 2]"].join("\n"),
              },
              explanation: "next() devolve valores diferentes a cada chamada — não existe um valor fixo que possa substituir todas as ocorrências sem mudar o comportamento.",
            },
            {
              title: "Transparência habilitando memoization com segurança",
              context: "Só é seguro cachear porque o resultado nunca varia pro mesmo input.",
              code: {
                language: "javascript",
                filename: "memoized-square.js",
                code: ["const cache = new Map();", "function memoizedSquare(n) {", "  if (cache.has(n)) return cache.get(n);", "  const result = n * n;", "  cache.set(n, result);", "  return result;", "}"].join("\n"),
              },
              explanation: "Se o resultado pudesse variar pro mesmo n, o cache devolveria respostas erradas — a transparência é o que garante que isso não acontece.",
            },
          ],
          exercise: {
            problem: "A função abaixo não é referencialmente transparente — substituir uma chamada pelo seu retorno mudaria o comportamento do programa.",
            problemCode: {
              language: "javascript",
              filename: "fetch-with-log.js",
              code: ["let requestCount = 0;", "function fetchWithLog(url) {", "  requestCount += 1; // efeito colateral", "  console.log(`Requisição #${requestCount} para ${url}`);", "  return `dados de ${url}`;", "}"].join("\n"),
            },
            task: "Explique (em comentário) por que fetchWithLog não é referencialmente transparente, e separe em uma parte pura e uma com o efeito colateral isolado.",
            hint: "O que muda a cada chamada, mesmo com o mesmo url? Essa é a parte que precisa ficar de fora da função \"pura\".",
            solution: {
              code: {
                language: "javascript",
                filename: "fetch-with-log-split.js",
                code: [
                  "function buildDataMessage(url) { // pura, referencialmente transparente",
                  "  return `dados de ${url}`;",
                  "}",
                  "",
                  "let requestCount = 0;",
                  "function logRequest(url) { // efeito colateral isolado",
                  "  requestCount += 1;",
                  "  console.log(`Requisição #${requestCount} para ${url}`);",
                  "}",
                  "",
                  "function fetchWithLog(url) {",
                  "  logRequest(url);",
                  "  return buildDataMessage(url);",
                  "}",
                ].join("\n"),
              },
              explanation: "buildDataMessage(url) agora pode ser substituída pelo seu valor de retorno em qualquer lugar sem mudar nada — o efeito colateral ficou isolado em logRequest.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Immutability",
          note: "Imutabilidade",
          requires: ["Side Effects", "Memory & Runtime / Value vs Reference"],
          revisit: ["Concurrency / Thread Safety", "Software Design / Mutable vs Immutable Objects", "Architecture / Event Sourcing"],
          summary: "Immutability é a regra de que um dado, depois de criado, nunca é alterado.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Qualquer operação que \"pareça\" mudar esse dado, na verdade, cria e devolve uma versão nova, deixando o " +
                "original intocado. Em Value vs Reference vimos o problema que isso resolve: mudar um objeto " +
                "compartilhado através de uma referência afeta todo mundo que também a tem.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Dado que nunca muda pode ser compartilhado à vontade, pagando o preço de criar mais objetos.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Se nenhum dado nunca muda, nunca existe o risco de \"alguém mudou isso sem eu saber\" — cada " +
                "referência a um objeto imutável é garantidamente o mesmo valor pra sempre, o que simplifica " +
                "muito raciocinar sobre estado compartilhado, especialmente em código concorrente ou em UIs " +
                "que precisam saber exatamente quando algo mudou.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "add-item.js",
              code: [
                "// Mutável: muda o objeto original",
                "function addItemMutable(cart, item) {",
                "  cart.items.push(item);",
                "  return cart;",
                "}",
                "",
                "// Imutável: devolve um objeto NOVO, original intocado",
                "function addItemImmutable(cart, item) {",
                "  return { ...cart, items: [...cart.items, item] };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "addItemMutable altera o cart recebido — qualquer outro código com a mesma referência vê a " +
                "mudança também. addItemImmutable devolve um objeto completamente novo; o cart original " +
                "permanece exatamente como estava.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "`Object.freeze` é raso: objetos aninhados continuam mutáveis, e ele só protege em tempo de execução.",
                "Criar valores novos a cada mudança tem custo, que pode pesar com estruturas grandes ou em laços quentes.",
                "Métodos de array como `push` e `sort` mudam o original; conheça quais mutam e quais devolvem uma cópia.",
              ],
            },
          ],
          examples: [
            {
              title: "Métodos de array mutáveis vs. imutáveis",
              context: "Uma armadilha comum de JavaScript.",
              code: {
                language: "javascript",
                filename: "sort-copy.js",
                code: ["const original = [3, 1, 2];", "original.sort(); // MUTA o array original", "", "const original2 = [3, 1, 2];", "const sorted = [...original2].sort(); // copia antes de ordenar"].join("\n"),
              },
              explanation: ".sort() (e .push(), .splice()) mutam o array no lugar — uma cópia antes da operação preserva o original.",
            },
            {
              title: "Object.freeze forçando imutabilidade em runtime",
              context: "O próprio JavaScript garante a imutabilidade, sem depender só de disciplina.",
              code: {
                language: "javascript",
                filename: "frozen-config.js",
                code: ['const config = Object.freeze({ apiUrl: "https://api.example.com" });', 'config.apiUrl = "outra coisa"; // falha silenciosamente (ou lança erro em modo estrito)', "console.log(config.apiUrl); // ainda o valor original"].join("\n"),
              },
              explanation: "Object.freeze impede mutação em runtime — o JavaScript garante a imutabilidade, em vez de depender só de quem escreve o código.",
            },
            {
              title: "Imutabilidade tornando comparação de mudança trivial",
              context: "Comum em frameworks de UI para detectar mudanças de estado.",
              code: { language: "javascript", filename: "state-compare.js", code: ["const state1 = { count: 0 };", "const state2 = { ...state1, count: 1 }; // novo objeto a cada mudança", "console.log(state1 === state2); // false"].join("\n") },
              explanation: "Como cada mudança gera um objeto novo, basta comparar === (identidade) pra saber se algo mudou.",
            },
          ],
          exercise: {
            problem: "A função abaixo muta o array de tarefas recebido, causando um bug em outro lugar que ainda tinha uma referência à lista original.",
            problemCode: {
              language: "javascript",
              filename: "mark-all-done.js",
              code: [
                "function markAllDone(tasks) {",
                "  tasks.forEach(task => { task.done = true; });",
                "  return tasks;",
                "}",
                "const original = [{ id: 1, done: false }, { id: 2, done: false }];",
                "const updated = markAllDone(original);",
                "console.log(original[0].done); // true — o \"original\" foi mutado junto!",
              ].join("\n"),
            },
            task: "Reescreva markAllDone de forma imutável — o array e os objetos originais não devem ser alterados.",
            hint: "Use .map() (que já devolve um array novo) combinado com spread pra criar uma cópia de cada tarefa.",
            solution: {
              code: {
                language: "javascript",
                filename: "mark-all-done-immutable.js",
                code: ["function markAllDoneImmutable(tasks) {", "  return tasks.map(task => ({ ...task, done: true }));", "}", "const original2 = [{ id: 1, done: false }, { id: 2, done: false }];", "const updated2 = markAllDoneImmutable(original2);", "console.log(original2[0].done); // false — original intocado"].join(
                  "\n"
                ),
              },
              explanation: ".map() já devolve um array novo, e { ...task, done: true } cria uma cópia de cada tarefa — nada do que existia antes é tocado.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Higher-Order Functions",
          note: "Funções de alta ordem",
          requires: ["First-Class Functions", "Closure"],
          summary:
            "Uma Higher-Order Function é uma função que recebe outra função como argumento, devolve uma função, ou " +
            "faz as duas coisas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Basta uma das duas coisas para a função entrar na categoria. Só é possível porque funções são " +
                "First-Class.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Uma Higher-Order Function guarda o padrão que se repete, e quem chama entrega só a parte que muda.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "HOFs são o mecanismo que permite abstrair padrões de comportamento, não só dados. Em vez de " +
                "escrever um loop diferente pra cada operação, uma HOF como .map() abstrai \"aplicar uma " +
                "transformação a cada item\" e deixa você fornecer só a transformação específica — o padrão de " +
                "iteração fica reutilizado, só a lógica de cada caso muda.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "hof.js",
              code: [
                "function applyTwice(fn, value) { // HOF: recebe uma função como argumento",
                "  return fn(fn(value));",
                "}",
                'applyTwice(n => n * 2, 3); // 12 — aplica "dobrar" duas vezes',
                "",
                "function makeAdder(x) { // HOF: devolve uma função como resultado",
                "  return function (y) { return x + y; };",
                "}",
                "const add5 = makeAdder(5);",
                "add5(3); // 8",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "applyTwice recebe uma função como argumento; makeAdder devolve uma função — as duas são " +
                "Higher-Order Functions, cada uma satisfazendo um dos dois critérios.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para separar o que varia do que se repete, como uma função de retry que recebe a operação a tentar.",
                "Para transformar coleções de forma declarativa, com `map`, `filter` e `reduce`.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Funções que devolvem funções que devolvem funções ficam difíceis de ler; limite os níveis.",
                "Para um caso único e simples, uma função direta é mais clara que uma generalização.",
              ],
            },
          ],
          examples: [
            {
              title: ".sort() como HOF",
              context: ".sort() não sabe nada sobre o critério — só aplica o que recebe.",
              code: { language: "javascript", filename: "sort-users.js", code: ["const users = [{ age: 30 }, { age: 25 }, { age: 35 }];", "users.sort((a, b) => a.age - b.age); // .sort() é HOF: recebe uma função"].join("\n") },
              explanation: ".sort() não sabe nada sobre \"idade\" — a lógica de comparação é fornecida como função.",
            },
            {
              title: "Uma HOF genérica de retry",
              context: "Um padrão de comportamento abstraído em cima de qualquer função.",
              code: {
                language: "javascript",
                filename: "with-retry.js",
                code: ["function withRetry(fn, times) { // HOF: devolve uma nova função com comportamento extra", "  return function (...args) {", "    for (let i = 0; i < times; i++) {", "      try { return fn(...args); } catch (e) { if (i === times - 1) throw e; }", "    }", "  };", "}", "const safeFetch = withRetry(fetchData, 3);"].join(
                  "\n"
                ),
              },
              explanation: "withRetry recebe uma função e devolve uma versão dela com retry embutido — um padrão abstraído em cima de qualquer função.",
            },
            {
              title: ".map() implementado do zero",
              context: "Não é mágica de linguagem — é uma HOF comum.",
              code: { language: "javascript", filename: "my-map.js", code: ["function myMap(arr, fn) {", "  const result = [];", "  for (const item of arr) result.push(fn(item));", "  return result;", "}", "myMap([1, 2, 3], n => n * 2); // [2, 4, 6]"].join("\n") },
              explanation: "map() é uma Higher-Order Function comum, que qualquer um poderia escrever, recebendo a função de transformação como argumento.",
            },
          ],
          exercise: {
            problem: "As duas funções abaixo são quase idênticas — a única diferença é a condição de filtro, mas o código está duplicado.",
            problemCode: {
              language: "javascript",
              filename: "filters.js",
              code: ["function filterAdults(users) {", "  return users.filter(u => u.age >= 18);", "}", "function filterActiveUsers(users) {", "  return users.filter(u => u.active === true);", "}"].join("\n"),
            },
            task: "Crie uma Higher-Order Function filterBy(predicate) que devolve uma função de filtro pronta pra usar, eliminando a duplicação.",
            hint: "filterBy deveria receber a condição e devolver uma NOVA função que já sabe filtrar por ela.",
            solution: {
              code: {
                language: "javascript",
                filename: "filter-by.js",
                code: ["function filterBy(predicate) {", "  return function (users) {", "    return users.filter(predicate);", "  };", "}", "const filterAdults2 = filterBy(u => u.age >= 18);", "const filterActiveUsers2 = filterBy(u => u.active === true);"].join("\n"),
              },
              explanation: "filterBy é uma HOF que devolve uma função especializada — a lógica de filtrar fica reutilizada, só o predicado muda.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Function Composition",
          note: "Composição de funções",
          requires: ["Higher-Order Functions", "Pure Functions"],
          collision: "≠ Composition (Programming Fundamentals, objetos). f∘g",
          summary:
            "Function Composition é combinar funções numa nova função, em que a saída de uma vira a entrada da " +
            "próxima.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Na notação matemática, f∘g significa \"primeiro g, depois f com o resultado\". O resultado é uma função " +
                "nova, feita a partir de peças menores.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Funções pequenas e puras se encaixam como peças, e cada uma pode ser testada antes de entrar na " +
                "composição.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Assim como Composition (o Concept de objetos, em Programming Fundamentals) monta comportamento " +
                "combinando objetos pequenos em vez de herdar de uma superclasse grande, Function Composition " +
                "monta transformações complexas combinando funções pequenas e puras em vez de escrever uma " +
                "função grande fazendo tudo de uma vez.",
            },
            {
              type: "paragraph",
              text:
                "Não confundir com Composition (o Concept de objetos \"has-a\") — os nomes coincidem, mas um é " +
                "sobre objetos contendo outros objetos, e este é sobre encadear funções. Espírito parecido " +
                "(montar o maior a partir de peças menores), conceitos diferentes.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "compose.js",
              code: [
                "const double = x => x * 2;",
                "const addOne = x => x + 1;",
                "",
                "function compose(f, g) {",
                "  return function (x) { return f(g(x)); }; // f∘g: primeiro g, depois f",
                "}",
                "const doubleThenAddOne = compose(addOne, double);",
                "doubleThenAddOne(5); // double(5) = 10, depois addOne(10) = 11",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "compose(addOne, double) cria uma função nova que aplica double primeiro, depois addOne no " +
                "resultado — nenhuma das duas funções originais precisou saber da existência da outra.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para montar uma transformação maior a partir de passos pequenos, puros e testáveis isoladamente.",
                "Com `pipe`, quando a ordem natural de leitura, da esquerda para a direita, deixa o fluxo mais claro.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma peça impura contamina toda a composição: o resultado deixa de ser previsível.",
                "Cada função precisa receber o que a anterior devolve, o que costuma pedir funções de um só argumento.",
              ],
            },
          ],
          examples: [
            {
              title: "Pipeline de processamento de texto",
              context: "Cada função faz uma coisa só e é testável isoladamente.",
              code: {
                language: "javascript",
                filename: "slugify.js",
                code: ["const trim = s => s.trim();", "const toLowerCase = s => s.toLowerCase();", 'const removeSpaces = s => s.replace(/\\s+/g, "-");', "", "const slugify = compose(removeSpaces, compose(toLowerCase, trim));", 'slugify("  Hello World  "); // "hello-world"'].join(
                  "\n"
                ),
              },
              explanation: "slugify é só a composição de trim, toLowerCase e removeSpaces, sem lógica própria.",
            },
            {
              title: "pipe — composição lida na ordem natural",
              context: "Aplica as funções na ordem em que aparecem, esquerda pra direita.",
              code: {
                language: "javascript",
                filename: "pipe.js",
                code: ["function pipe(...fns) {", "  return x => fns.reduce((acc, fn) => fn(acc), x);", "}", "const process = pipe(trim, toLowerCase, removeSpaces); // lê na ordem de execução", 'process("  Hello World  "); // "hello-world"'].join("\n"),
              },
              explanation: "pipe aplica as funções na ordem em que aparecem — muitos preferem essa leitura à de compose (direita pra esquerda).",
            },
            {
              title: "Composição herdando impureza de uma peça",
              context: "Reforça por que Pure Functions é pré-requisito de Function Composition.",
              code: {
                language: "javascript",
                filename: "impure-compose.js",
                code: ["let log = [];", "const impureDouble = x => { log.push(x); return x * 2; }; // efeito colateral escondido", "const result = compose(addOne, impureDouble)(5);", '// funciona, mas "log" mudou como efeito colateral escondido'].join("\n"),
              },
              explanation: "Se uma das peças tem efeito colateral, a composição herda essa impureza — parte do motivo de exigir Pure Functions como pré-requisito.",
            },
          ],
          exercise: {
            problem: "A função abaixo faz três transformações numa string, tudo numa linha só, difícil de testar cada passo isoladamente.",
            problemCode: {
              language: "javascript",
              filename: "format-username.js",
              code: ["function formatUsername(input) {", "  return input.trim().toLowerCase().replace(/[^a-z0-9]/g, \"\");", "}"].join("\n"),
            },
            task: "Reescreva formatUsername como uma composição de três funções pequenas e nomeadas (trim, toLowerCase, stripSpecialChars).",
            hint: "Cada função pequena deveria fazer exatamente uma transformação — a composição só orquestra a ordem.",
            solution: {
              code: {
                language: "javascript",
                filename: "format-username-composed.js",
                code: [
                  "const trimStr = s => s.trim();",
                  "const lower = s => s.toLowerCase();",
                  'const stripSpecialChars = s => s.replace(/[^a-z0-9]/g, "");',
                  "",
                  "function pipe(...fns) {",
                  "  return x => fns.reduce((acc, fn) => fn(acc), x);",
                  "}",
                  "const formatUsername2 = pipe(trimStr, lower, stripSpecialChars);",
                  'formatUsername2("  Ana@2024!  "); // "ana2024"',
                ].join("\n"),
              },
              explanation: "Cada função pode ser testada isoladamente, e formatUsername2 é só a composição na ordem certa.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Map",
          note: "Transformar cada item",
          requires: ["Higher-Order Functions"],
          summary:
            "Map é a Higher-Order Function que aplica uma transformação a cada item de uma coleção e devolve uma " +
            "coleção nova.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                ".map() recebe a função de transformação como argumento. O original não é tocado, e a coleção nova tem o " +
                "mesmo número de elementos, cada um transformado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se a saída tem um item para cada item da entrada, o que você quer é um map.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É a forma declarativa mais direta de expressar \"eu quero cada item, mas transformado de tal " +
                "jeito\" — substitui o loop imperativo (for + push) por uma única chamada que expressa a " +
                "intenção diretamente, e é uma Higher-Order Function pura por construção quando a função de " +
                "transformação também é pura.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "with-tax.js",
              code: ["const prices = [10, 20, 30];", "const withTax = prices.map(price => price * 1.1);", "console.log(withTax); // [11, 22, 33]", "console.log(prices);  // [10, 20, 30] — original intocado"].join("\n"),
            },
            {
              type: "paragraph",
              text: ".map() devolve um array novo, do mesmo tamanho, com cada item transformado — prices original permanece intacto.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando cada item da coleção vira exatamente um novo item, como extrair um campo de uma lista de objetos.",
                "Para gerar dados derivados sem alterar a coleção original.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não use só pelo efeito colateral, como imprimir cada item: ele devolve uma coleção que ninguém usa; use " +
                "`forEach` ou um laço.",
                "Se o resultado tem tamanho diferente do original, como descartar itens, use `filter` ou `reduce`.",
              ],
            },
          ],
          examples: [
            {
              title: "Extraindo um campo de uma lista de objetos",
              context: "Um padrão extremamente comum.",
              code: { language: "javascript", filename: "names.js", code: ['const users = [{ name: "Ana" }, { name: "Bia" }];', "const names = users.map(user => user.name); // [\"Ana\", \"Bia\"]"].join("\n") },
              explanation: ".map() extrai name de cada objeto — mais direto que um loop equivalente.",
            },
            {
              title: "Map encadeado",
              context: "Uma pipeline pequena, cada etapa legível isoladamente.",
              code: { language: "javascript", filename: "formatted-totals.js", code: ["const orders = [{ total: 100 }, { total: 250 }];", 'const formatted = orders.map(o => o.total).map(t => `R$ ${t.toFixed(2)}`);'].join("\n") },
              explanation: "O primeiro .map() extrai os totais; o segundo formata cada um.",
            },
            {
              title: "Map sobre índices, gerando dados derivados de posição",
              context: "Array.from com segundo argumento funciona como um map sobre índices.",
              code: { language: "javascript", filename: "grid.js", code: "const grid = Array.from({ length: 3 }, (_, i) => i * i); // [0, 1, 4]" },
              explanation: "Gera uma coleção nova a partir de uma regra, sem precisar de um array de origem já existente.",
            },
          ],
          exercise: {
            problem: "O código abaixo usa um loop imperativo pra transformar uma lista de temperaturas de Celsius pra Fahrenheit.",
            problemCode: {
              language: "javascript",
              filename: "celsius-to-fahrenheit.js",
              code: ["const celsius = [0, 20, 37, 100];", "const fahrenheit = [];", "for (let i = 0; i < celsius.length; i++) {", "  fahrenheit.push(celsius[i] * 9/5 + 32);", "}"].join("\n"),
            },
            task: "Reescreva usando .map(), eliminando o loop e a variável acumuladora.",
            hint: "A transformação (a fórmula) é a mesma — só muda COMO ela é aplicada a cada item.",
            solution: {
              code: { language: "javascript", filename: "celsius-to-fahrenheit-map.js", code: ["const celsius2 = [0, 20, 37, 100];", "const fahrenheit2 = celsius2.map(c => c * 9/5 + 32);"].join("\n") },
              explanation: ".map() expressa diretamente \"cada temperatura, convertida\" — sem loop explícito, sem variável acumuladora.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Filter",
          note: "Manter só o que satisfaz",
          requires: ["Map"],
          summary:
            "Filter é a Higher-Order Function que devolve uma coleção nova só com os itens que satisfazem uma " +
            "condição.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                ".filter() recebe uma função que devolve true/false (um predicado) e a aplica a cada item. Diferente de " +
                ".map() (que transforma cada item, mantendo o tamanho), .filter() seleciona um subconjunto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se você quer menos itens, e não itens diferentes, o que você quer é um filter.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É a forma declarativa de expressar \"eu quero só os itens que satisfazem tal condição\" — " +
                "substitui um loop imperativo com if + push condicional por uma única chamada que nomeia " +
                "exatamente a condição de seleção.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "evens.js",
              code: ["const numbers = [1, 2, 3, 4, 5, 6];", "const evens = numbers.filter(n => n % 2 === 0);", "console.log(evens); // [2, 4, 6]"].join("\n"),
            },
            {
              type: "paragraph",
              text: ".filter() percorre numbers e mantém só os itens onde n % 2 === 0 é true — o predicado nomeia a condição diretamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para selecionar os itens que satisfazem uma condição, como objetos por uma propriedade.",
                "Para descartar valores inválidos ou vazios antes de continuar a cadeia.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só seleciona: ele não transforma os itens; para transformar, encadeie com `map`.",
                "Para achar um único item, `find` para na primeira ocorrência, enquanto `filter` percorre a coleção toda.",
              ],
            },
          ],
          examples: [
            {
              title: "Filtrando objetos por uma propriedade",
              context: "Os itens que não satisfazem a condição são descartados do resultado.",
              code: { language: "javascript", filename: "affordable.js", code: ["const products = [{ price: 50 }, { price: 150 }, { price: 30 }];", "const affordable = products.filter(p => p.price < 100);"].join("\n") },
              explanation: "affordable contém só os produtos com price < 100 — sem mutar products.",
            },
            {
              title: "Filter encadeado com map",
              context: "O par mais comum na prática — cada etapa com sua responsabilidade.",
              code: {
                language: "javascript",
                filename: "adult-names.js",
                code: ['const users = [{ age: 15, name: "A" }, { age: 25, name: "B" }, { age: 17, name: "C" }];', 'const adultNames = users.filter(u => u.age >= 18).map(u => u.name); // ["B"]'].join("\n"),
              },
              explanation: ".filter() seleciona primeiro os adultos; .map() extrai só o nome de quem sobrou.",
            },
            {
              title: "Filter removendo valores inválidos/vazios",
              context: "Um atalho comum com filter(Boolean).",
              code: { language: "javascript", filename: "valid-names.js", code: ['const inputs = ["Ana", "", null, "Bia", undefined, "Caio"];', "const validNames = inputs.filter(Boolean); // [\"Ana\", \"Bia\", \"Caio\"]"].join("\n") },
              explanation: "filter(Boolean) mantém só valores \"truthy\", descartando string vazia, null e undefined de uma vez.",
            },
          ],
          exercise: {
            problem: "O código abaixo usa um loop imperativo pra selecionar só os pedidos pendentes de uma lista.",
            problemCode: {
              language: "javascript",
              filename: "pending-orders.js",
              code: ['const orders = [{ status: "pending" }, { status: "done" }, { status: "pending" }];', "const pending = [];", "for (let i = 0; i < orders.length; i++) {", '  if (orders[i].status === "pending") {', "    pending.push(orders[i]);", "  }", "}"].join("\n"),
            },
            task: "Reescreva usando .filter(), eliminando o loop, o if e a variável acumuladora.",
            hint: "O predicado é exatamente a condição que já está dentro do if.",
            solution: {
              code: {
                language: "javascript",
                filename: "pending-orders-filter.js",
                code: ['const orders2 = [{ status: "pending" }, { status: "done" }, { status: "pending" }];', 'const pending2 = orders2.filter(order => order.status === "pending");'].join("\n"),
              },
              explanation: ".filter() expressa diretamente \"só os pedidos pendentes\" — sem a mecânica de loop e push condicional.",
            },
          },
        }),
        concept({
          order: 120,
          title: "Reduce",
          note: "O caso geral",
          requires: ["Map", "Filter"],
          summary: "Reduce é a Higher-Order Function que percorre uma coleção acumulando os itens num único resultado.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A cada item, ela chama uma função que recebe o valor acumulado até agora e o item atual, e devolve o " +
                "novo valor acumulado. No fim, sobra um único resultado — um número, um objeto, um array, qualquer coisa.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Quando o objetivo é resumir uma coleção inteira num valor só, a ferramenta é o reduce.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Reduce é o caso mais geral de processar uma coleção — tão geral que Map e Filter podem, os " +
                "dois, ser escritos usando só Reduce por baixo (por isso este Concept é ensinado por último: " +
                "entender Map/Filter primeiro ajuda a apreciar o quanto Reduce generaliza os dois). Sempre que " +
                "o objetivo é \"resumir\" uma coleção inteira num valor só, Reduce é a ferramenta.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "total.js",
              code: ["const prices = [10, 20, 30];", "const total = prices.reduce((accumulated, price) => accumulated + price, 0);", "console.log(total); // 60"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "reduce começa com accumulated = 0 (o segundo argumento); a cada item, soma ao acumulado — " +
                "0+10=10, 10+20=30, 30+30=60. O resultado final é um único número.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para resumir uma coleção em um único resultado, como uma soma, um objeto agrupado ou um contador.",
                "Quando a lógica de acumular é o próprio ponto, e nem `map` nem `filter` a expressam.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para transformar ou selecionar, `map` e `filter` dizem a intenção mais claramente que um `reduce` genérico.",
                "Sem valor inicial, o `reduce` falha numa coleção vazia; passe sempre o valor inicial.",
              ],
            },
          ],
          examples: [
            {
              title: ".map() implementado em cima de .reduce()",
              context: "Prova de que Reduce generaliza Map.",
              code: { language: "javascript", filename: "my-map-reduce.js", code: ["function myMap(arr, fn) {", "  return arr.reduce((acc, item) => [...acc, fn(item)], []);", "}", "myMap([1, 2, 3], n => n * 2); // [2, 4, 6]"].join("\n") },
              explanation: "Cada passo do reduce adiciona um item transformado ao array acumulado — exatamente o que .map() faz.",
            },
            {
              title: ".filter() implementado em cima de .reduce()",
              context: "Mesma ideia, pra filtro.",
              code: {
                language: "javascript",
                filename: "my-filter-reduce.js",
                code: ["function myFilter(arr, predicate) {", "  return arr.reduce((acc, item) => predicate(item) ? [...acc, item] : acc, []);", "}", "myFilter([1, 2, 3, 4], n => n % 2 === 0); // [2, 4]"].join("\n"),
              },
              explanation: "A cada item, ou ele entra no acumulado (se o predicado for verdadeiro) ou o acumulado passa adiante sem mudar.",
            },
            {
              title: "Reduce agrupando itens num objeto",
              context: "Algo que Map/Filter sozinhos não produzem.",
              code: {
                language: "javascript",
                filename: "group-by-dept.js",
                code: [
                  'const people = [{ name: "Ana", dept: "eng" }, { name: "Bia", dept: "vendas" }, { name: "Caio", dept: "eng" }];',
                  "const byDept = people.reduce((acc, person) => {",
                  "  (acc[person.dept] ??= []).push(person.name);",
                  "  return acc;",
                  "}, {});",
                  '// { eng: ["Ana", "Caio"], vendas: ["Bia"] }',
                ].join("\n"),
              },
              explanation: "O resultado aqui é um objeto, não um array — o acumulado pode ser qualquer coisa.",
            },
          ],
          exercise: {
            problem: "O código abaixo usa duas variáveis e um loop pra calcular, ao mesmo tempo, o total e a quantidade de itens acima de um valor mínimo.",
            problemCode: {
              language: "javascript",
              filename: "total-and-count.js",
              code: [
                "const items = [{ price: 50 }, { price: 150 }, { price: 30 }, { price: 200 }];",
                "let total = 0;",
                "let countAboveMin = 0;",
                "for (let i = 0; i < items.length; i++) {",
                "  total += items[i].price;",
                "  if (items[i].price > 100) countAboveMin++;",
                "}",
              ].join("\n"),
            },
            task: "Reescreva usando um único .reduce(), acumulando um objeto { total, countAboveMin } em vez de duas variáveis soltas.",
            hint: "O valor inicial do reduce pode ser { total: 0, countAboveMin: 0 }, e cada passo devolve um objeto novo atualizado.",
            solution: {
              code: {
                language: "javascript",
                filename: "summary-reduce.js",
                code: [
                  "const items2 = [{ price: 50 }, { price: 150 }, { price: 30 }, { price: 200 }];",
                  "const summary = items2.reduce(",
                  "  (acc, item) => ({",
                  "    total: acc.total + item.price,",
                  "    countAboveMin: acc.countAboveMin + (item.price > 100 ? 1 : 0),",
                  "  }),",
                  "  { total: 0, countAboveMin: 0 }",
                  ");",
                ].join("\n"),
              },
              explanation: "Um único .reduce() acumula os dois valores juntos, num objeto — o estado inteiro do cálculo fica contido no acumulador.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "data-structures",
      order: 50,
      title: "Data Structures",
      requires: ["Programming Fundamentals", "Type Systems / Generics (ajuda)"],
      summary: "Contíguo → encadeado → estruturas sobre eles → indexação por chave → hierárquico → o mais geral (Graph).",
      suggestions: [
        "Deque",
        "Priority Queue (hoje implícito em Heap)",
        "Trie",
        "Balanced Tree (AVL / Red-Black — intuição)",
        "B-Tree (hoje só citado em Platform)",
        "Adjacency List vs Matrix",
        "Circular Buffer",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Array",
          note: "Memória contígua",
          summary:
            "Uma coleção de elementos armazenados em posições contíguas de memória, acessíveis por índice " +
            "numérico em tempo O(1) — a estrutura de dados mais fundamental, direto sobre o que Memory já ensinou.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Array guarda elementos em posições contíguas de memória — um do lado do outro, sem " +
                "lacunas — e cada elemento é acessado por um índice numérico. Como o tamanho de cada elemento " +
                "é conhecido e fixo, o endereço de qualquer posição pode ser calculado diretamente, sem " +
                "precisar percorrer nada.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Array armazena elementos contíguos na memória, com acesso por índice em O(1) — a vantagem " +
                "que a contiguidade compra é acesso direto e rápido; o custo é que inserir/remover no meio ou " +
                "no início exige deslocar elementos.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É a estrutura mais direta possível sobre o que Memory já ensinou: memória endereçável e " +
                "contígua. Acesso por índice em O(1) — tempo constante, não importa o tamanho do array — é a " +
                "vantagem central: arr[500000] custa exatamente o mesmo que arr[0], porque é só aritmética de " +
                "endereço, nenhuma busca envolvida.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "scores.js",
              code: [
                "const scores = [85, 92, 78, 95];",
                "console.log(scores[2]); // 78 — acesso direto, O(1)",
                "scores.push(88); // adicionar no fim é O(1) amortizado",
                "scores.unshift(0); // adicionar no INÍCIO é O(n) — precisa deslocar todo mundo",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Acesso por índice é sempre O(1). Mas inserir no início exige deslocar todos os elementos " +
                "seguintes uma posição adiante — o custo de manter contiguidade.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o acesso por índice é frequente e o tamanho muda pouco ou só no fim.",
                "Para percorrer os elementos em ordem, com boa localidade de memória.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Inserir ou remover no início ou no meio é O(n), porque os elementos seguintes precisam ser deslocados.",
                "A busca por valor é linear, O(n), a menos que o array esteja ordenado.",
              ],
            },
          ],
          examples: [
            {
              title: "Array tipado reservando espaço fixo e contíguo",
              context: "Reencontrando Memory — a contiguidade fica explícita.",
              code: { language: "javascript", filename: "typed.js", code: "const nums = new Int32Array(1000); // 4000 bytes contíguos, reservados de uma vez" },
              explanation: "1000 posições de 4 bytes cada, lado a lado, sem indireção nenhuma.",
            },
            {
              title: "Busca linear — O(n), diferente do acesso por índice",
              context: "Saber o índice é O(1); procurar um valor sem saber onde está é O(n).",
              code: { language: "javascript", filename: "contains.js", code: ["function contains(arr, target) {", "  for (const item of arr) {", "    if (item === target) return true;", "  }", "  return false;", "}"].join("\n") },
              explanation: "Arrays não ordenados não têm atalho pra busca — pode precisar checar todos os elementos.",
            },
            {
              title: "O custo de inserir no início, medido na prática",
              context: "Cada elemento existente precisa se mover pra abrir espaço.",
              code: { language: "javascript", filename: "unshift-cost.js", code: "const arr = [1, 2, 3, 4, 5];\narr.unshift(0); // 5 elementos deslocados uma posição" },
              explanation: "Quanto maior o array, mais caro fica inserir no início.",
            },
          ],
          exercise: {
            problem: "A função abaixo insere repetidamente no início de um array dentro de um loop — sem perceber o custo disso.",
            problemCode: {
              language: "javascript",
              filename: "build-reversed.js",
              code: ["function buildReversed(items) {", "  const result = [];", "  for (const item of items) {", "    result.unshift(item); // O(n) a cada iteração — O(n²) no total", "  }", "  return result;", "}"].join("\n"),
            },
            task: "Reescreva buildReversed para o mesmo resultado, mas evitando unshift dentro do loop — usando uma operação O(1) por inserção.",
            hint: "Inserir no FIM é O(1) — dá pra construir na ordem normal e reverter uma única vez no final.",
            solution: {
              code: {
                language: "javascript",
                filename: "build-reversed-fast.js",
                code: ["function buildReversedFast(items) {", "  const result = [];", "  for (const item of items) {", "    result.push(item); // O(1) por inserção", "  }", "  return result.reverse(); // uma única operação O(n) no final", "}"].join("\n"),
              },
              explanation: "push é O(1); reverter uma vez no final é O(n) — total O(n), em vez do O(n²) que unshift repetido causava.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Linked List",
          note: "Nós encadeados",
          requires: ["Array"],
          summary:
            "Uma sequência de nós, cada um apontando pro próximo, sem exigir memória contígua — o contraste " +
            "direto com Array: troca acesso O(1) por índice por inserção/remoção O(1) nas pontas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma Linked List é uma sequência de nós, onde cada nó guarda um valor e um ponteiro/referência " +
                "pro próximo nó. Diferente de Array, os nós não precisam estar em posições contíguas de " +
                "memória — podem estar espalhados em qualquer lugar do heap, conectados só pelos ponteiros.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Linked List troca acesso O(1) por índice (que Array tem) por inserção/remoção O(1) nas pontas " +
                "(que Array não tem) — a estrutura certa depende de qual operação seu caso de uso faz mais.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É o contraste direto de Array, e resolve o que Array faz mal: inserir/remover no início (ou " +
                "em qualquer ponto, tendo a referência) custa O(1) numa Linked List — só reconectar ponteiros. " +
                "O preço é perder o acesso O(1) por índice: pra chegar no elemento N, é preciso percorrer os " +
                "N-1 anteriores, um por um.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "node.js",
              code: ["class Node {", "  constructor(value) {", "    this.value = value;", "    this.next = null;", "  }", "}", "const head = new Node(1);", "head.next = new Node(2);", "head.next.next = new Node(3);", "// 1 -> 2 -> 3, conectados por ponteiro"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Não existe \"índice 2\" diretamente acessível — pra chegar no valor 3, é preciso ir de head " +
                "até head.next até head.next.next. Os nós não precisam estar contíguos na memória.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando inserir e remover nas pontas é o mais comum e o acesso por índice é raro.",
                "Quando o tamanho varia muito e mover elementos de um array seria caro.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Chegar a um índice exige percorrer os nós, O(n); não há acesso direto como no array.",
                "Cada nó guarda um ponteiro extra e os nós ficam espalhados na memória, o que costuma ser mais lento na prática.",
              ],
            },
          ],
          examples: [
            {
              title: "Inserir no início — O(1), contra O(n) num Array",
              context: "Nenhum elemento existente precisa se mover.",
              code: { language: "javascript", filename: "prepend.js", code: ["function prependNode(head, value) {", "  const newNode = new Node(value);", "  newNode.next = head; // só reconecta um ponteiro", "  return newNode;", "}"].join("\n") },
              explanation: "Só o novo nó aponta pro antigo head, e vira o novo head.",
            },
            {
              title: "Percorrer até um índice — O(n)",
              context: "Diferente do acesso O(1) de Array.",
              code: {
                language: "javascript",
                filename: "get-at.js",
                code: ["function getAt(head, index) {", "  let current = head;", "  for (let i = 0; i < index; i++) {", "    current = current.next;", "  }", "  return current ? current.value : undefined;", "}"].join("\n"),
              },
              explanation: "Não tem como \"pular\" direto pro nó N — é preciso percorrer todos os anteriores, sequencialmente.",
            },
            {
              title: "Doubly Linked List",
              context: "Um ponteiro extra permite andar nos dois sentidos.",
              code: { language: "javascript", filename: "doubly-node.js", code: ["class DoublyNode {", "  constructor(value) {", "    this.value = value;", "    this.next = null;", "    this.prev = null; // ponteiro extra", "  }", "}"].join("\n") },
              explanation: "Com prev, dá pra percorrer a lista nos dois sentidos, e remover um nó sem percorrer desde o início.",
            },
          ],
          exercise: {
            problem: "A função abaixo insere no final de uma Linked List percorrendo do início toda vez — O(n) por inserção.",
            problemCode: {
              language: "javascript",
              filename: "append-node.js",
              code: ["function appendNode(head, value) {", "  const newNode = new Node(value);", "  if (!head) return newNode;", "  let current = head;", "  while (current.next) current = current.next; // percorre a lista TODA", "  current.next = newNode;", "  return head;", "}"].join("\n"),
            },
            task: "Descreva (ou esboce em código) uma mudança estrutural que tornaria a inserção no final O(1), sem mudar o comportamento visto por quem chama.",
            hint: "E se a lista guardasse, além do head, uma referência direta pro último nó (tail)?",
            solution: {
              code: {
                language: "javascript",
                filename: "linked-list-tail.js",
                code: [
                  "class LinkedList {",
                  "  constructor() {",
                  "    this.head = null;",
                  "    this.tail = null; // referência direta pro último nó",
                  "  }",
                  "  append(value) {",
                  "    const newNode = new Node(value);",
                  "    if (!this.tail) {",
                  "      this.head = this.tail = newNode;",
                  "    } else {",
                  "      this.tail.next = newNode;",
                  "      this.tail = newNode; // O(1)",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation: "Mantendo tail sempre atualizada, inserir no final vira O(1) — a mesma mudança que listas de bibliotecas padrão já fazem.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Stack",
          note: "LIFO",
          requires: ["Array", "Linked List"],
          collision: "≠ Call Stack (Memory & Runtime)",
          summary:
            "Uma estrutura de dados onde o último elemento inserido é o primeiro a ser removido (LIFO) — " +
            "implementável tanto sobre Array quanto sobre Linked List, e a inspiração de nome (mas não a mesma " +
            "coisa) da Call Stack do runtime.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Stack (ADT) é uma estrutura de dados com duas operações principais: push (adiciona no topo) " +
                "e pop (remove do topo) — sempre respeitando LIFO (Last In, First Out): o último elemento que " +
                "entrou é sempre o primeiro que sai.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Stack é LIFO — o último elemento inserido é o primeiro a sair. Pode ser implementado sobre " +
                "Array ou Linked List; não confundir com a Call Stack do runtime, que segue a mesma disciplina " +
                "mas é uma coisa diferente.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A disciplina LIFO aparece naturalmente em muitos problemas: desfazer ações na ordem inversa " +
                "de como foram feitas, navegar de volta num histórico, avaliar expressões aninhadas. " +
                "Implementar essa disciplina como uma estrutura própria torna esses casos de uso diretos.",
            },
            {
              type: "paragraph",
              text:
                "Este Stack é uma estrutura de dados que você implementa e manipula com push/pop — não " +
                "confundir com a Call Stack do runtime (Memory & Runtime), gerenciada automaticamente pela " +
                "linguagem. Os nomes coincidem — a Call Stack também segue LIFO — mas um é uma ferramenta que " +
                "você usa deliberadamente, o outro é infraestrutura da linguagem.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Implementado sobre Array, a forma mais comum em JavaScript:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "stack.js",
              code: ["class Stack {", "  #items = [];", "  push(value) { this.#items.push(value); }", "  pop() { return this.#items.pop(); }", "  peek() { return this.#items[this.#items.length - 1]; }", "}", "const s = new Stack();", "s.push(1); s.push(2); s.push(3);", "s.pop(); // 3"].join(
                "\n"
              ),
            },
            {
              type: "paragraph",
              text:
                "push/pop no fim de um Array já são O(1) — usar o próprio Array como armazenamento interno é " +
                "a implementação mais direta de Stack em JavaScript.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o último a entrar deve ser o primeiro a sair, como no histórico de desfazer.",
                "Para problemas de aninhamento, como validar parênteses balanceados.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só o topo é acessível; para ler ou remover um elemento do meio, outra estrutura é mais adequada.",
                "Não é a Call Stack do runtime: segue a mesma disciplina, mas é uma estrutura do seu programa.",
              ],
            },
          ],
          examples: [
            {
              title: "Validar parênteses balanceados",
              context: "O caso de uso clássico de Stack.",
              code: {
                language: "javascript",
                filename: "is-balanced.js",
                code: ["function isBalanced(expr) {", "  const stack = [];", "  for (const char of expr) {", '    if (char === "(") stack.push(char);', '    else if (char === ")") {', "      if (stack.length === 0) return false;", "      stack.pop();", "    }", "  }", "  return stack.length === 0;", "}"].join("\n"),
              },
              explanation: "Cada ( empilha; cada ) desempilha — se sobrar algo empilhado (ou desempilhar vazio), os parênteses não batem.",
            },
            {
              title: "Histórico de desfazer",
              context: "Desfazer sempre reverte a ação mais recente.",
              code: { language: "javascript", filename: "undo-stack.js", code: ["class UndoStack {", "  #history = [];", "  record(action) { this.#history.push(action); }", "  undo() { return this.#history.pop(); }", "}"].join("\n") },
              explanation: "Exatamente a disciplina LIFO — a última ação é a primeira a ser desfeita.",
            },
            {
              title: "Stack sobre Linked List",
              context: "Mesma interface, implementação diferente — Interface revisitado.",
              code: {
                language: "javascript",
                filename: "linked-stack.js",
                code: ["class LinkedStack {", "  #top = null;", "  push(value) {", "    this.#top = { value, next: this.#top };", "  }", "  pop() {", "    if (!this.#top) return undefined;", "    const value = this.#top.value;", "    this.#top = this.#top.next;", "    return value;", "  }", "}"].join("\n"),
              },
              explanation: "Mesma interface (push/pop, LIFO), implementação diferente — Stack é um contrato de comportamento, não uma implementação específica.",
            },
          ],
          exercise: {
            problem: "A função abaixo inverte uma string sem aproveitar explicitamente a disciplina de Stack.",
            problemCode: {
              language: "javascript",
              filename: "reverse-string.js",
              code: ['function reverseString(str) {', '  const chars = str.split("");', '  let result = "";', "  for (let i = chars.length - 1; i >= 0; i--) {", "    result += chars[i];", "  }", "  return result;", "}"].join("\n"),
            },
            task: "Reescreva reverseString usando explicitamente uma Stack (push cada caractere, depois pop todos).",
            hint: "Empilhar todos os caracteres na ordem original, depois desempilhar um por um, produz a ordem invertida naturalmente.",
            solution: {
              code: {
                language: "javascript",
                filename: "reverse-string-stack.js",
                code: ["function reverseStringWithStack(str) {", "  const stack = [];", "  for (const char of str) stack.push(char);", '  let result = "";', "  while (stack.length > 0) result += stack.pop();", "  return result;", "}"].join("\n"),
              },
              explanation: "Empilhar na ordem original e desempilhar produz a ordem invertida automaticamente — a disciplina LIFO faz o trabalho.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Queue",
          note: "FIFO",
          requires: ["Stack"],
          revisit: ["Asynchronous Programming / Task Queue", "Architecture / Message Queue"],
          summary:
            "Uma estrutura de dados onde o primeiro elemento inserido é o primeiro a ser removido (FIFO) — o " +
            "par natural de Stack, ensinado junto por serem opostos na mesma pergunta: qual elemento sai primeiro?",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Queue é uma estrutura de dados com duas operações principais: enqueue (adiciona no final) e " +
                "dequeue (remove do início) — sempre respeitando FIFO (First In, First Out): o primeiro " +
                "elemento que entrou é o primeiro que sai.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Queue é FIFO — o primeiro elemento inserido é o primeiro a sair. É o par de Stack: as duas " +
                "respondem à mesma pergunta de forma oposta, e cada uma serve a um tipo diferente de problema " +
                "de ordenação de processamento.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É o par natural de Stack — as duas estruturas respondem à mesma pergunta (\"qual elemento sai " +
                "primeiro?\") de formas opostas. Fila é o modelo natural pra processar coisas na ordem de " +
                "chegada: pedidos, tarefas, mensagens — a estrutura por trás de Task Queue e Message Queue.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "queue.js",
              code: ["class Queue {", "  #items = [];", "  enqueue(value) { this.#items.push(value); } // entra no fim", "  dequeue() { return this.#items.shift(); }    // sai do início", "}", "const q = new Queue();", "q.enqueue(1); q.enqueue(2); q.enqueue(3);", "q.dequeue(); // 1"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Diferente de Stack (que tira do mesmo lado que insere), Queue insere de um lado (fim) e " +
                "remove do outro (início) — daí FIFO em vez de LIFO.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a ordem de chegada define a ordem de processamento, como em filas de tarefas.",
                "Na busca em largura (BFS), que visita os nós na ordem em que os descobre.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Implementada com `.shift()` em um array, remover do início é O(n); use uma estrutura com remoção O(1) nas " +
                "duas pontas.",
                "Se alguns itens precisam passar na frente, o que você quer é uma Priority Queue.",
              ],
            },
          ],
          examples: [
            {
              title: "Processar tarefas na ordem de chegada",
              context: "A primeira a entrar é a primeira a ser atendida.",
              code: { language: "javascript", filename: "task-queue.js", code: ["class TaskQueue {", "  #tasks = [];", "  add(task) { this.#tasks.push(task); }", "  processNext() { return this.#tasks.shift(); }", "}"].join("\n") },
              explanation: "Tarefas são processadas na ordem em que chegaram — o comportamento esperado de uma fila real.",
            },
            {
              title: "Busca em largura (BFS) usando Queue",
              context: "FIFO garante processar por \"camadas\".",
              code: {
                language: "javascript",
                filename: "bfs.js",
                code: [
                  "function bfs(startNode) {",
                  "  const queue = [startNode];",
                  "  const visited = new Set([startNode]);",
                  "  while (queue.length > 0) {",
                  "    const node = queue.shift(); // processa o mais ANTIGO da fila",
                  "    for (const neighbor of node.neighbors) {",
                  "      if (!visited.has(neighbor)) {",
                  "        visited.add(neighbor);",
                  "        queue.push(neighbor); // entra no FIM",
                  "      }",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation: "FIFO garante que os nós mais próximos do início são processados antes dos mais distantes — é isso que faz BFS visitar camada por camada.",
            },
            {
              title: ".shift() sendo O(n)",
              context: "Revisitando o trade-off de Array visto antes.",
              code: { language: "javascript", filename: "shift-cost.js", code: "const arr = [1, 2, 3, 4, 5];\narr.shift(); // O(n) — todo mundo desloca uma posição pra trás" },
              explanation: "Implementar Queue sobre Array com .shift() reintroduz o mesmo problema de custo de Array visto antes.",
            },
          ],
          exercise: {
            problem: "A implementação de Queue abaixo usa .shift(), O(n) — em filas grandes, um gargalo perceptível.",
            problemCode: {
              language: "javascript",
              filename: "array-queue.js",
              code: ["class Queue {", "  #items = [];", "  enqueue(value) { this.#items.push(value); }", "  dequeue() { return this.#items.shift(); } // O(n)", "}"].join("\n"),
            },
            task: "Reescreva Queue usando uma Linked List por trás, de forma que tanto enqueue quanto dequeue sejam O(1).",
            hint: "Mantenha referências a head (pra dequeue) e tail (pra enqueue), igual fizemos em Linked List.",
            solution: {
              code: {
                language: "javascript",
                filename: "linked-queue.js",
                code: [
                  "class LinkedQueue {",
                  "  #head = null;",
                  "  #tail = null;",
                  "  enqueue(value) {",
                  "    const node = { value, next: null };",
                  "    if (this.#tail) this.#tail.next = node;",
                  "    else this.#head = node;",
                  "    this.#tail = node; // O(1)",
                  "  }",
                  "  dequeue() {",
                  "    if (!this.#head) return undefined;",
                  "    const value = this.#head.value;",
                  "    this.#head = this.#head.next; // O(1)",
                  "    return value;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation: "Com head e tail como referências diretas, inserir no fim e remover do início são ambos O(1).",
            },
          },
        }),
        concept({
          order: 50,
          title: "Hash Table",
          note: "Chave → valor",
          requires: ["Array"],
          revisit: ["Architecture / Consistent Hashing", "Platform / Database Performance / Index"],
          summary:
            "Uma estrutura que mapeia chaves a valores usando uma função hash pra calcular onde cada par " +
            "deveria estar num array por trás — busca, inserção e remoção em O(1) na média, ao custo de perder " +
            "qualquer noção de ordem.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma Hash Table guarda pares chave-valor e usa uma função hash pra transformar cada chave num " +
                "índice de um Array interno — o \"endereço\" onde aquele par deveria estar. Buscar um valor não " +
                "exige percorrer nada: a função hash calcula direto onde procurar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Hash Table mapeia chaves a valores usando uma função hash pra calcular a posição, dando " +
                "busca/inserção/remoção O(1) na média — o preço é perder qualquer noção de ordem entre os elementos.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Array dá acesso O(1) por índice numérico, mas e se você quer buscar por uma chave arbitrária " +
                "— um nome, um ID de string, um objeto? Hash Table resolve isso: transforma qualquer chave num " +
                "índice via hash, e reaproveita o acesso O(1) de Array por baixo. O preço é que a ordem dos " +
                "elementos deixa de ter qualquer significado.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "ages.js",
              code: ['const ages = new Map();', 'ages.set("Ana", 30);', 'ages.set("Bia", 25);', 'console.log(ages.get("Ana")); // 30 — O(1) na média'].join("\n"),
            },
            {
              type: "paragraph",
              text:
                ".get(\"Ana\") não procura \"Ana\" percorrendo os pares um por um — a função hash de Map calcula " +
                "diretamente onde esse valor está guardado.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para buscar, inserir e remover por chave em O(1) na média, como em um cache ou uma contagem de frequência.",
                "Para indexar dados por uma chave, inclusive composta.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não guarda ordem significativa entre os elementos; para dados ordenados, uma árvore é mais adequada.",
                "Colisões degradam o desempenho, e no pior caso a busca cai para O(n).",
              ],
            },
          ],
          examples: [
            {
              title: "Colisões de hash",
              context: "Duas chaves diferentes podem mapear pro mesmo índice.",
              code: {
                language: "text",
                filename: "note.txt",
                code:
                  'Conceitualmente: hash("Ana") e hash("Caio") podem colidir no mesmo índice.\nA tabela precisa de uma estratégia (lista encadeada no slot, por exemplo)\npra guardar os dois sem perder nenhum.',
              },
              explanation: "Colisões são esperadas e tratadas internamente — uma boa função hash minimiza a frequência, sem eliminar a possibilidade.",
            },
            {
              title: "Cache indexado por chave composta",
              context: "Qualquer valor hashable serve de chave, inclusive combinada.",
              code: { language: "javascript", filename: "cache.js", code: ["const cache = new Map();", "function getCached(userId, resource) {", "  const key = `${userId}:${resource}`;", "  return cache.get(key);", "}"].join("\n") },
              explanation: "Combinar múltiplos valores numa única chave string é um padrão comum de cache.",
            },
            {
              title: "Contando frequência de itens",
              context: "Um uso clássico de Hash Table.",
              code: {
                language: "javascript",
                filename: "count-occurrences.js",
                code: ["function countOccurrences(words) {", "  const counts = new Map();", "  for (const word of words) {", "    counts.set(word, (counts.get(word) || 0) + 1);", "  }", "  return counts;", "}"].join("\n"),
              },
              explanation: "O acesso O(1) pra ler/atualizar o contador de cada palavra é o que torna essa contagem eficiente mesmo com muitas palavras.",
            },
          ],
          exercise: {
            problem: "A função abaixo verifica duplicatas com busca linear repetida — O(n²) no pior caso.",
            problemCode: {
              language: "javascript",
              filename: "has-duplicates.js",
              code: ["function hasDuplicates(arr) {", "  for (let i = 0; i < arr.length; i++) {", "    for (let j = i + 1; j < arr.length; j++) {", "      if (arr[i] === arr[j]) return true;", "    }", "  }", "  return false;", "}"].join("\n"),
            },
            task: "Reescreva hasDuplicates usando uma Hash Table (Set) para reduzir a complexidade pra O(n).",
            hint: "Percorra o array uma única vez, guardando cada elemento visto numa estrutura de busca O(1).",
            solution: {
              code: {
                language: "javascript",
                filename: "has-duplicates-fast.js",
                code: ["function hasDuplicatesFast(arr) {", "  const seen = new Set();", "  for (const item of arr) {", "    if (seen.has(item)) return true; // O(1)", "    seen.add(item);", "  }", "  return false;", "}"].join("\n"),
              },
              explanation: "seen.has(item) é O(1) na média, em vez de percorrer o array inteiro pra cada elemento — o loop duplo vira um único loop.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Set",
          note: "Sem duplicatas",
          requires: ["Hash Table"],
          summary:
            "Uma coleção que garante que cada elemento aparece no máximo uma vez — normalmente implementada " +
            "por cima de uma Hash Table, aproveitando o mesmo acesso O(1) que ela oferece.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Set é uma coleção onde cada elemento pode aparecer no máximo uma vez — adicionar um valor " +
                "já presente não tem efeito nenhum. As operações principais são add, has (verificar presença) " +
                "e delete.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Set garante que cada elemento aparece no máximo uma vez, e oferece teste de pertencimento " +
                "O(1) na média — normalmente implementado por cima de uma Hash Table, herdando as mesmas " +
                "vantagens e o mesmo trade-off (sem ordem significativa).",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Duas necessidades comuns: garantir unicidade e testar pertencimento rapidamente. Um array " +
                "resolveria isso, mas checar duplicidade ou pertencimento num array exige percorrer tudo — " +
                "O(n). Set normalmente é implementado por cima de uma Hash Table, então has vira O(1) na " +
                "média, o mesmo motivo pelo qual Hash Table existe.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "tags.js",
              code: ["const tags = new Set();", 'tags.add("javascript");', 'tags.add("javascript"); // duplicado, ignorado', 'tags.add("typescript");', "console.log(tags.size); // 2, não 3", 'console.log(tags.has("javascript")); // true — O(1)'].join("\n"),
            },
            {
              type: "paragraph",
              text: "Adicionar \"javascript\" duas vezes só resulta numa entrada — o Set garante unicidade automaticamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para remover duplicatas ou testar pertencimento em O(1) na média.",
                "Para operações de conjuntos, como interseção e diferença, e para marcar nós visitados numa busca.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não tem índice nem ordem significativa; se a posição importa, use um array.",
                "Elementos objetos são comparados por referência, então dois objetos com os mesmos dados contam como diferentes.",
              ],
            },
          ],
          examples: [
            {
              title: "Removendo duplicatas de um array",
              context: "O uso mais comum de Set.",
              code: { language: "javascript", filename: "unique.js", code: "const numbers = [1, 2, 2, 3, 3, 3, 4];\nconst unique = [...new Set(numbers)]; // [1, 2, 3, 4]" },
              explanation: "Converter pra Set elimina duplicatas automaticamente; o spread converte de volta pra array.",
            },
            {
              title: "Interseção e diferença entre conjuntos",
              context: ".has() em O(1) torna essas operações eficientes.",
              code: {
                language: "javascript",
                filename: "set-ops.js",
                code: ["const a = new Set([1, 2, 3]);", "const b = new Set([2, 3, 4]);", "const intersection = [...a].filter(x => b.has(x)); // [2, 3]", "const difference = [...a].filter(x => !b.has(x));  // [1]"].join("\n"),
              },
              explanation: "Comparar dois arrays elemento a elemento seria O(n×m) — com Set, cada checagem é O(1).",
            },
            {
              title: "Rastreando visitados numa busca",
              context: "Set como estrutura de suporte, comum em algoritmos de grafo.",
              code: { language: "javascript", filename: "visited.js", code: ["const visited = new Set();", "function visit(node) {", "  if (visited.has(node)) return; // O(1) — evita reprocessar", "  visited.add(node);", "}"].join("\n") },
              explanation: "Garante que cada nó é processado uma única vez, com checagem O(1) a cada passo.",
            },
          ],
          exercise: {
            problem: "A função abaixo verifica se dois arrays têm os mesmos elementos, mas usando comparação O(n²).",
            problemCode: {
              language: "javascript",
              filename: "same-elements.js",
              code: ["function sameElements(arr1, arr2) {", "  if (arr1.length !== arr2.length) return false;", "  return arr1.every(item => arr2.includes(item)); // .includes() é O(n)", "}"].join("\n"),
            },
            task: "Reescreva sameElements usando Set para reduzir a complexidade.",
            hint: "Converter arr2 pra Set permite usar .has() (O(1)) em vez de .includes() (O(n)) a cada checagem.",
            solution: {
              code: {
                language: "javascript",
                filename: "same-elements-fast.js",
                code: ["function sameElementsFast(arr1, arr2) {", "  if (arr1.length !== arr2.length) return false;", "  const set2 = new Set(arr2);", "  return arr1.every(item => set2.has(item)); // O(1) por checagem", "}"].join("\n"),
              },
              explanation: "O total cai de O(n²) pra O(n), porque cada checagem individual agora é O(1) em vez de O(n).",
            },
          },
        }),
        concept({
          order: 70,
          title: "Tree",
          note: "Nós hierárquicos",
          requires: ["Linked List"],
          summary:
            "Uma estrutura hierárquica de nós conectados, onde cada nó pode ter múltiplos filhos — uma " +
            "generalização de Linked List (cada nó tem só um \"próximo\") pra representar relações de " +
            "hierarquia, não só sequência.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma Tree é uma coleção de nós conectados hierarquicamente: existe um nó raiz (root), e cada " +
                "nó pode ter zero ou mais nós filhos. Diferente de Linked List, um nó de Tree pode apontar pra " +
                "vários filhos — a estrutura generaliza de sequência linear pra hierarquia ramificada.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Tree generaliza Linked List de sequência linear pra hierarquia ramificada — cada nó pode ter " +
                "múltiplos filhos, em vez de um único \"próximo\". A estrutura natural pra representar qualquer " +
                "relação de hierarquia.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Muita coisa no mundo real é naturalmente hierárquica: um sistema de arquivos, a estrutura de " +
                "um HTML/DOM, decisões aninhadas. Tree modela essa forma de organização diretamente, com " +
                "operações que respeitam a hierarquia.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "tree-node.js",
              code: [
                "class TreeNode {",
                "  constructor(value) {",
                "    this.value = value;",
                "    this.children = []; // pode ter QUALQUER número de filhos",
                "  }",
                "  addChild(node) {",
                "    this.children.push(node);",
                "  }",
                "}",
                'const root = new TreeNode("raiz");',
                'const childA = new TreeNode("filho A");',
                'const childB = new TreeNode("filho B");',
                "root.addChild(childA);",
                "root.addChild(childB);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "root tem dois filhos diretos — cada TreeNode guarda um array de filhos, em vez de um único " +
                "ponteiro next como em Linked List.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para representar hierarquias, como sistemas de arquivos, menus e estruturas aninhadas.",
                "Quando é preciso percorrer os dados em profundidade ou por níveis.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só serve para relações hierárquicas: sem ciclos e com um único caminho até cada nó; para outras relações, " +
                "use um grafo.",
                "Uma árvore desbalanceada tem altura grande e faz as operações se aproximarem de O(n).",
              ],
            },
          ],
          examples: [
            {
              title: "Percorrendo uma Tree em profundidade",
              context: "Percorrer costuma ser naturalmente recursivo.",
              code: {
                language: "javascript",
                filename: "print-all.js",
                code: ["function printAll(node, depth = 0) {", '  console.log("  ".repeat(depth) + node.value);', "  for (const child of node.children) {", "    printAll(child, depth + 1);", "  }", "}"].join("\n"),
              },
              explanation: "Cada filho é, ele mesmo, a raiz de uma sub-árvore menor — a recursão espelha a estrutura.",
            },
            {
              title: "Um sistema de arquivos modelado como Tree",
              context: "Pastas e arquivos formam naturalmente uma hierarquia.",
              code: { language: "javascript", filename: "filesystem.js", code: ['const root = new TreeNode("/");', 'const docs = new TreeNode("documents");', 'const photos = new TreeNode("photos");', "root.addChild(docs);", "root.addChild(photos);", 'docs.addChild(new TreeNode("resume.pdf"));'].join("\n") },
              explanation: "Cada pasta pode conter outras pastas ou arquivos — exatamente a forma de uma Tree.",
            },
            {
              title: "Altura de uma Tree",
              context: "Uma propriedade derivada calculada recursivamente.",
              code: { language: "javascript", filename: "height.js", code: ["function height(node) {", "  if (node.children.length === 0) return 0; // folha", "  return 1 + Math.max(...node.children.map(height));", "}"].join("\n") },
              explanation: "A altura é o caminho mais longo da raiz até uma folha — calculada olhando a altura de cada sub-árvore.",
            },
          ],
          exercise: {
            problem: "A função abaixo conta nós de uma Tree usando uma pilha manual, em vez da recursão natural da estrutura.",
            problemCode: {
              language: "javascript",
              filename: "count-nodes.js",
              code: ["function countNodes(root) {", "  let count = 0;", "  const stack = [root];", "  while (stack.length > 0) {", "    const node = stack.pop();", "    count++;", "    for (const child of node.children) stack.push(child);", "  }", "  return count;", "}"].join("\n"),
            },
            task: "Reescreva countNodes de forma recursiva, aproveitando que cada filho é raiz de uma sub-árvore menor.",
            hint: "O total de nós é 1 (o próprio nó) + a soma dos totais de cada sub-árvore filha.",
            solution: {
              code: {
                language: "javascript",
                filename: "count-nodes-recursive.js",
                code: ["function countNodesRecursive(node) {", "  return 1 + node.children.reduce((sum, child) => sum + countNodesRecursive(child), 0);", "}"].join("\n"),
              },
              explanation: "A recursão espelha diretamente a definição hierárquica de Tree, sem gerenciar uma pilha manualmente.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Binary Search Tree",
          note: "Ordenada, busca O(log n)",
          requires: ["Tree"],
          revisit: ["Platform / Database Performance / Index"],
          summary:
            "Uma Tree onde cada nó tem no máximo dois filhos, e todo valor à esquerda é menor, todo valor à " +
            "direita é maior — essa invariante de ordenação permite busca, inserção e remoção em O(log n), " +
            "quando a árvore está balanceada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma Binary Search Tree (BST) é uma Tree com duas restrições: cada nó tem no máximo dois " +
                "filhos (esquerdo e direito), e existe um invariante de ordenação — pra qualquer nó, todos os " +
                "valores na sub-árvore esquerda são menores, e todos na sub-árvore direita são maiores.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Binary Search Tree é uma Tree com invariante de ordenação — isso permite busca O(log n) " +
                "quando balanceada, o mesmo princípio de busca binária aplicado a uma estrutura de nós.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O invariante de ordenação é o que torna a busca eficiente: a cada nó visitado, dá pra " +
                "descartar metade da árvore restante — o mesmo princípio de busca binária, só que sobre uma " +
                "estrutura de nós em vez de um array. Quando a árvore está balanceada, isso dá O(log n) pra " +
                "busca/inserção/remoção.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "bst.js",
              code: [
                "class BSTNode {",
                "  constructor(value) {",
                "    this.value = value;",
                "    this.left = null;",
                "    this.right = null;",
                "  }",
                "  insert(value) {",
                "    if (value < this.value) {",
                "      if (this.left) this.left.insert(value);",
                "      else this.left = new BSTNode(value);",
                "    } else {",
                "      if (this.right) this.right.insert(value);",
                "      else this.right = new BSTNode(value);",
                "    }",
                "  }",
                "}",
                "const root = new BSTNode(50);",
                "root.insert(30); // vai pra esquerda (menor)",
                "root.insert(70); // vai pra direita (maior)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "insert decide o lado com base no invariante de ordenação — cada comparação elimina metade " +
                "das possibilidades restantes.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando é preciso buscar, inserir e remover mantendo os dados ordenados.",
                "Para obter os valores em ordem, com o percurso in-order.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Desbalanceada, como ao inserir valores já ordenados, vira uma lista e as operações passam a O(n); use uma " +
                "árvore auto-balanceada.",
                "Se a ordem não importa, uma Hash Table oferece busca O(1) na média, com menos complexidade.",
              ],
            },
          ],
          examples: [
            {
              title: "Busca aproveitando o invariante",
              context: "Metade da árvore é descartada a cada passo.",
              code: {
                language: "javascript",
                filename: "search.js",
                code: ["function search(node, target) {", "  if (!node) return false;", "  if (node.value === target) return true;", "  return target < node.value ? search(node.left, target) : search(node.right, target);", "}"].join("\n"),
              },
              explanation: "Se o alvo é menor que o nó atual, a sub-árvore direita inteira é ignorada, sem precisar visitá-la.",
            },
            {
              title: "Percurso in-order devolve valores ordenados",
              context: "Uma consequência direta do invariante de ordenação.",
              code: {
                language: "javascript",
                filename: "in-order.js",
                code: ["function inOrder(node, result = []) {", "  if (!node) return result;", "  inOrder(node.left, result);", "  result.push(node.value);", "  inOrder(node.right, result);", "  return result;", "}"].join("\n"),
              },
              explanation: "Visitar esquerda, o nó, depois direita, naturalmente produz os valores em ordem crescente.",
            },
            {
              title: "O caso patológico: BST desbalanceada",
              context: "Degenera pra O(n) por operação.",
              code: { language: "javascript", filename: "degenerate.js", code: "// Inserir valores JÁ ORDENADOS numa BST simples gera uma árvore \"torta\" —\n// cada nó só tem filho de um lado, virando essencialmente uma Linked List." },
              explanation: "Sem balanceamento, a garantia de O(log n) desaparece — inserir dados já ordenados é o pior caso clássico.",
            },
          ],
          exercise: {
            problem: "A função abaixo busca o menor valor percorrendo TODOS os nós — O(n), quando a estrutura permite algo bem mais rápido.",
            problemCode: {
              language: "javascript",
              filename: "find-min.js",
              code: ["function findMin(root) {", "  let min = root.value;", "  function visit(node) {", "    if (!node) return;", "    if (node.value < min) min = node.value;", "    visit(node.left);", "    visit(node.right);", "  }", "  visit(root);", "  return min;", "}"].join("\n"),
            },
            task: "Reescreva findMin aproveitando o invariante de ordenação, pra rodar em O(altura da árvore).",
            hint: "Numa BST, onde é que o menor valor sempre está, em relação à raiz?",
            solution: {
              code: { language: "javascript", filename: "find-min-fast.js", code: ["function findMinFast(node) {", "  while (node.left) {", "    node = node.left; // o menor valor está sempre o mais à esquerda possível", "  }", "  return node.value;", "}"].join("\n") },
              explanation: "Pelo invariante, o menor valor está sempre na extremidade esquerda — basta seguir .left até não haver mais filho.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Heap",
          note: "Árvore em array",
          requires: ["Tree", "Array"],
          summary:
            "Uma Tree binária completa, guardada de forma compacta dentro de um Array (sem ponteiros), que " +
            "garante acesso O(1) ao maior (ou menor) elemento — a estrutura por trás de Priority Queue.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Heap é uma Tree binária completa (todos os níveis preenchidos, exceto talvez o último, " +
                "preenchido da esquerda pra direita) que respeita o invariante de heap: em um Max-Heap, todo " +
                "nó é maior ou igual aos seus filhos. Por ser completa, um Heap pode ser guardado de forma " +
                "compacta dentro de um Array, usando aritmética de índice pra navegar entre pai e filhos.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Heap é uma Tree completa guardada de forma compacta num Array, garantindo acesso O(1) ao " +
                "maior (ou menor) elemento e inserção/remoção O(log n) — ideal quando você só precisa do " +
                "\"topo\" de uma coleção que muda com frequência.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Algumas aplicações só precisam acessar rapidamente o maior (ou menor) elemento de um conjunto " +
                "que muda com frequência — sem manter tudo ordenado o tempo todo. Heap garante acesso O(1) ao " +
                "topo, e inserção/remoção em O(log n). É a estrutura por trás de Priority Queue.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Max-Heap representado em array — pai no índice i, filhos em 2i+1 e 2i+2:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "max-heap.js",
              code: [
                "class MaxHeap {",
                "  #items = [];",
                "  peek() { return this.#items[0]; } // O(1) — o maior está sempre no topo",
                "  insert(value) {",
                "    this.#items.push(value);",
                "    this.#bubbleUp(this.#items.length - 1);",
                "  }",
                "  #bubbleUp(i) {",
                "    const parent = Math.floor((i - 1) / 2);",
                "    if (parent >= 0 && this.#items[parent] < this.#items[i]) {",
                "      [this.#items[parent], this.#items[i]] = [this.#items[i], this.#items[parent]];",
                "      this.#bubbleUp(parent);",
                "    }",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "peek() é O(1) — o maior elemento está sempre no índice 0. insert adiciona no fim e " +
                "\"borbulha\" pra cima, sem precisar reordenar a coleção inteira.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando só interessa o maior ou o menor elemento de uma coleção que muda, como numa Priority Queue.",
                "Para o Heap Sort e para selecionar os k maiores itens.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não mantém os demais elementos ordenados: só o topo é garantido; achar um valor qualquer é O(n).",
                "Para acesso ordenado a todos os elementos, uma árvore de busca é mais adequada.",
              ],
            },
          ],
          examples: [
            {
              title: "Aritmética de índice, sem ponteiro nenhum",
              context: "A posição de pai/filhos é sempre calculável a partir do índice.",
              code: { language: "javascript", filename: "heap-indices.js", code: "function parentIndex(i) { return Math.floor((i - 1) / 2); }\nfunction leftChildIndex(i) { return 2 * i + 1; }\nfunction rightChildIndex(i) { return 2 * i + 2; }" },
              explanation: "Por a árvore ser completa, nenhum ponteiro é necessário, diferente de uma Tree comum.",
            },
            {
              title: "Priority Queue implementada sobre Heap",
              context: "O uso mais direto de Heap.",
              code: {
                language: "javascript",
                filename: "priority-queue.js",
                code: ["class PriorityQueue {", "  #heap = new MaxHeap();", "  add(task, priority) { this.#heap.insert({ task, priority }); }", "  next() { return this.#heap.extractMax(); }", "}"].join("\n"),
              },
              explanation: "Uma fila de prioridade sempre devolve o item de maior prioridade primeiro — o que Heap garante em O(1) pra consulta.",
            },
            {
              title: "Heap Sort",
              context: "Extrair o topo repetidamente produz um array ordenado.",
              code: {
                language: "javascript",
                filename: "heap-sort.js",
                code: ["function heapSort(arr) {", "  const heap = new MaxHeap();", "  for (const item of arr) heap.insert(item);", "  const sorted = [];", "  while (heap.peek() !== undefined) sorted.unshift(heap.extractMax());", "  return sorted;", "}"].join("\n"),
              },
              explanation: "Um algoritmo de ordenação inteiro construído em cima de Heap.",
            },
          ],
          exercise: {
            problem: "Um sistema de atendimento busca o maior prioridade num array comum a cada vez — O(n) por atendimento.",
            problemCode: {
              language: "javascript",
              filename: "get-next-customer.js",
              code: ["function getNextCustomer(customers) {", "  let highest = customers[0];", "  for (const c of customers) {", "    if (c.priority > highest.priority) highest = c;", "  }", "  customers.splice(customers.indexOf(highest), 1);", "  return highest;", "}"].join("\n"),
            },
            task: "Descreva (ou esboce em código) como um Heap resolveria isso em O(log n) por atendimento.",
            hint: "Cada cliente entra via insert (O(log n)); atender o próximo é peek() + remover o topo (O(log n)).",
            solution: {
              code: {
                language: "javascript",
                filename: "customer-queue.js",
                code: ["class CustomerQueue {", "  #heap = new MaxHeap(); // ordenado por customer.priority", "  addCustomer(customer) {", "    this.#heap.insert(customer); // O(log n)", "  }", "  getNextCustomer() {", "    return this.#heap.extractMax(); // O(log n)", "  }", "}"].join("\n"),
              },
              explanation: "Tanto adicionar quanto atender ficam em O(log n), independente de quantos clientes estão na fila.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Graph",
          note: "O caso mais geral",
          requires: ["Tree", "Hash Table"],
          revisit: ["AI / Vector Search (HNSW)"],
          summary:
            "A estrutura de dados mais geral de todas: nós conectados por arestas, sem as restrições de " +
            "hierarquia de Tree — qualquer nó pode se conectar a qualquer outro, inclusive formando ciclos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um Graph é uma coleção de nós (vértices) conectados por arestas — sem a restrição hierárquica " +
                "de Tree (que exige uma raiz e proíbe ciclos). Num Graph, qualquer nó pode se conectar a " +
                "qualquer outro, inclusive formando ciclos.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Graph é a estrutura mais geral de todas — nós conectados por arestas, sem restrição de " +
                "hierarquia ou proibição de ciclos. Tree e Linked List são casos particulares e mais " +
                "restritos de Graph.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É o caso mais geral de estrutura baseada em relações — tão geral que tanto Tree quanto Linked " +
                "List são, tecnicamente, casos particulares de Graph. Redes sociais, mapas de rotas, " +
                "dependências entre módulos, o próprio grafo de conhecimento deste roadmap — tudo isso é " +
                "naturalmente um Graph.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Representado como lista de adjacência — cada nó guarda seus vizinhos:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "graph.js",
              code: ["const graph = {", '  A: ["B", "C"],', '  B: ["A", "D"],', '  C: ["A"],', '  D: ["B"],', "};", "// A conecta com B e C; B conecta de volta com A — um ciclo"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A e B se conectam mutuamente — um ciclo. Numa Tree, isso seria proibido; num Graph, é " +
                "perfeitamente normal.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para modelar relações arbitrárias, como redes, rotas e grafos de dependências.",
                "Para detectar ciclos e encontrar caminhos, com DFS ou BFS.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se os dados formam uma hierarquia simples, uma árvore basta e as operações são mais fáceis.",
                "Com ciclos, é preciso marcar os nós visitados; sem isso, o percurso não termina.",
              ],
            },
          ],
          examples: [
            {
              title: "Grafo dirigido vs. não-dirigido",
              context: "A direção da conexão importa ou não, dependendo do que é modelado.",
              code: { language: "javascript", filename: "directed.js", code: ['const friendship = { Ana: ["Bia"], Bia: ["Ana"] }; // não-dirigido, mútuo', 'const follows = { Ana: ["Bia"], Bia: [] }; // dirigido, unilateral'].join("\n") },
              explanation: "Num grafo dirigido, a aresta tem um sentido; num não-dirigido, a conexão é sempre recíproca.",
            },
            {
              title: "Detectando um ciclo com DFS",
              context: "Reencontrar um nó \"em progresso\" indica um ciclo.",
              code: {
                language: "javascript",
                filename: "has-cycle.js",
                code: [
                  "function hasCycle(graph, node, visiting = new Set(), visited = new Set()) {",
                  "  if (visiting.has(node)) return true; // ciclo",
                  "  if (visited.has(node)) return false;",
                  "  visiting.add(node);",
                  "  for (const neighbor of graph[node]) {",
                  "    if (hasCycle(graph, neighbor, visiting, visited)) return true;",
                  "  }",
                  "  visiting.delete(node);",
                  "  visited.add(node);",
                  "  return false;",
                  "}",
                ].join("\n"),
              },
              explanation: "Se durante a busca você reencontra um nó que ainda não terminou de ser explorado, isso é um ciclo.",
            },
            {
              title: "Grafo de dependências",
              context: "O exemplo mais direto do domínio deste próprio roadmap.",
              code: {
                language: "javascript",
                filename: "dependencies.js",
                code: ["const dependencies = {", '  Interface: ["Abstraction"],', '  Contract: ["Interface"],', '  Polymorphism: ["Interface", "Inheritance"],', "};"].join("\n"),
              },
              explanation: "Cada Concept que \"requires\" outro é uma aresta num grafo de dependências.",
            },
          ],
          exercise: {
            problem: "A função abaixo busca um caminho usando DFS, que não garante o caminho mais curto.",
            problemCode: {
              language: "javascript",
              filename: "find-path-dfs.js",
              code: [
                "function findPathDFS(graph, start, end, path = [start], visited = new Set([start])) {",
                "  if (start === end) return path;",
                "  for (const neighbor of graph[start]) {",
                "    if (!visited.has(neighbor)) {",
                "      visited.add(neighbor);",
                "      const result = findPathDFS(graph, neighbor, end, [...path, neighbor], visited);",
                "      if (result) return result; // pode não ser o caminho MAIS CURTO",
                "    }",
                "  }",
                "  return null;",
                "}",
              ].join("\n"),
            },
            task: "Explique (em comentário) por que DFS não garante o caminho mais curto, e reescreva usando BFS, reaproveitando o Concept de Queue.",
            hint: "BFS explora \"camada por camada\" — o primeiro caminho que alcança o destino é garantidamente um dos mais curtos.",
            solution: {
              code: {
                language: "javascript",
                filename: "find-shortest-path-bfs.js",
                code: [
                  "function findShortestPathBFS(graph, start, end) {",
                  "  const queue = [[start]]; // fila de caminhos",
                  "  const visited = new Set([start]);",
                  "  while (queue.length > 0) {",
                  "    const path = queue.shift(); // FIFO — o caminho mais antigo primeiro",
                  "    const node = path[path.length - 1];",
                  "    if (node === end) return path;",
                  "    for (const neighbor of graph[node]) {",
                  "      if (!visited.has(neighbor)) {",
                  "        visited.add(neighbor);",
                  "        queue.push([...path, neighbor]);",
                  "      }",
                  "    }",
                  "  }",
                  "  return null;",
                  "}",
                ].join("\n"),
              },
              explanation: "BFS explora todos os caminhos de comprimento 1 antes de qualquer caminho de comprimento 2 — o primeiro a alcançar end é garantidamente um dos mais curtos.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "algorithms-and-complexity",
      order: 60,
      title: "Algorithms & Complexity",
      requires: ["Data Structures", "Memory & Runtime / Call Stack (para Recursion)"],
      summary: "Medir (time/space) → a notação (Big O) → o catálogo de classes → buscas → sorting → recursão → memoization.",
      suggestions: [
        "Divide and Conquer",
        "Dynamic Programming",
        "Greedy Algorithms",
        "Graph Traversal (BFS / DFS)",
        "Best / Average / Worst Case",
        "Amortized Complexity",
        "Complexity of Common Operations (cheat-sheet)",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Time Complexity",
          note: "Tempo em função do tamanho",
          requires: ["Data Structures"],
          summary:
            "Como o tempo de execução de um algoritmo cresce conforme o tamanho da entrada aumenta — não o " +
            "tempo em segundos (que depende da máquina), mas a taxa de crescimento, o que permite comparar " +
            "algoritmos de forma independente de hardware.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Time Complexity descreve como o número de operações que um algoritmo executa cresce " +
                "conforme o tamanho da entrada (n) aumenta. Não é uma medida de tempo em segundos — é uma " +
                "medida de taxa de crescimento, abstraída de qual máquina está rodando o código.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Time Complexity mede como o número de operações de um algoritmo cresce em função do tamanho " +
                "da entrada — não tempo em segundos, mas taxa de crescimento, o que torna algoritmos " +
                "comparáveis independente de hardware.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Medir tempo em segundos depende de hardware, linguagem, carga do sistema. Time Complexity " +
                "abstrai tudo isso e pergunta uma coisa só: se eu dobrar o tamanho da entrada, o que acontece " +
                "com o número de operações? Essa pergunta tem a mesma resposta em qualquer máquina, e é isso " +
                "que torna algoritmos comparáveis de forma justa.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "find-max.js",
              code: ["function findMax(arr) { // precisa olhar CADA elemento pelo menos uma vez", "  let max = arr[0];", "  for (const item of arr) {", "    if (item > max) max = item;", "  }", "  return max;", "}"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "findMax sempre percorre os n elementos do array — dobrar o tamanho do array dobra " +
                "(aproximadamente) o número de operações. Essa relação é ensinada com um nome próprio no " +
                "próximo Concept (Big O).",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Complexidade descreve o crescimento, não o tempo real: um algoritmo de classe pior pode ser mais rápido " +
                "para entradas pequenas.",
                "Uma constante grande escondida pode pesar mais que a classe de complexidade na prática; meça antes de otimizar.",
                "Otimizar um trecho que não domina o tempo total não muda o resultado; comece pelo que cresce mais.",
              ],
            },
          ],
          examples: [
            {
              title: "Trabalho independente do tamanho da entrada",
              context: "Dobrar o array não muda o número de operações.",
              code: { language: "javascript", filename: "first-item.js", code: "function firstItem(arr) {\n  return arr[0]; // sempre 1 operação, não importa o tamanho de arr\n}" },
              explanation: "firstItem faz sempre a mesma quantidade de trabalho, não importa quantos elementos arr tem.",
            },
            {
              title: "Trabalho proporcional ao tamanho da entrada",
              context: "Dobrar o array dobra o número de operações.",
              code: { language: "javascript", filename: "sum.js", code: ["function sum(arr) {", "  let total = 0;", "  for (const item of arr) total += item; // uma operação POR elemento", "  return total;", "}"].join("\n") },
              explanation: "O trabalho cresce linearmente com n.",
            },
            {
              title: "Trabalho crescendo muito mais rápido que a entrada",
              context: "Dobrar o array quadruplica (aproximadamente) o trabalho.",
              code: {
                language: "javascript",
                filename: "has-pair-sum.js",
                code: ["function hasPairSum(arr, target) {", "  for (const a of arr) {", "    for (const b of arr) { // para CADA elemento, olha todos de novo", "      if (a + b === target) return true;", "    }", "  }", "  return false;", "}"].join("\n"),
              },
              explanation: "Os dois loops aninhados fazem o trabalho crescer muito mais rápido que n.",
            },
          ],
          exercise: {
            problem: "Para cada função abaixo, descreva se o número de operações cresce proporcionalmente a n, permanece constante, ou cresce mais rápido que n.",
            problemCode: {
              language: "javascript",
              filename: "growth.js",
              code: ["function isEmpty(arr) {", "  return arr.length === 0;", "}", "function printAll(arr) {", "  for (const item of arr) console.log(item);", "}", "function printAllPairs(arr) {", "  for (const a of arr) for (const b of arr) console.log(a, b);", "}"].join("\n"),
            },
            task: "Adicione o comentário de análise em cada função.",
            hint: "Pergunte, pra cada uma: \"se eu dobrar o array, o número de operações dobra, fica igual, ou mais que dobra?\"",
            solution: {
              code: {
                language: "javascript",
                filename: "growth-annotated.js",
                code: [
                  "function isEmpty(arr) {",
                  "  return arr.length === 0; // constante — 1 operação, não importa o tamanho",
                  "}",
                  "function printAll(arr) {",
                  "  for (const item of arr) console.log(item); // proporcional a n",
                  "}",
                  "function printAllPairs(arr) {",
                  "  for (const a of arr) for (const b of arr) console.log(a, b); // cresce muito mais rápido que n",
                  "}",
                ].join("\n"),
              },
              explanation: "isEmpty sempre faz 1 operação; printAll faz n operações; printAllPairs faz n × n operações — três taxas de crescimento bem diferentes.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Space Complexity",
          note: "Memória em função do tamanho",
          requires: ["Time Complexity"],
          summary:
            "Como a quantidade de memória extra que um algoritmo usa cresce conforme o tamanho da entrada " +
            "aumenta — o par natural de Time Complexity, medindo espaço em vez de tempo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Space Complexity descreve como a quantidade de memória extra que um algoritmo precisa, além " +
                "da entrada original, cresce em função do tamanho da entrada. Assim como Time Complexity, não " +
                "é uma medida em bytes exatos — é uma taxa de crescimento.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Space Complexity mede como a memória extra usada por um algoritmo cresce em função do " +
                "tamanho da entrada — o par de Time Complexity, e às vezes um trade-off direto contra ela.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Tempo não é o único recurso que importa — memória também é finita, e alguns algoritmos " +
                "trocam mais memória por menos tempo (ou vice-versa). Nomear Space Complexity separadamente " +
                "permite raciocinar sobre esse trade-off explicitamente.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "space.js",
              code: [
                "function sumInPlace(arr) { // O(1) de espaço extra",
                "  let total = 0;",
                "  for (const item of arr) total += item;",
                "  return total;",
                "}",
                "function doubleAll(arr) { // O(n) de espaço extra",
                "  return arr.map(x => x * 2);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "sumInPlace usa uma única variável, não importa o tamanho de arr — espaço constante. " +
                "doubleAll cria um array novo do mesmo tamanho do original — espaço proporcional a n.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Recursão conta: cada chamada usa um frame da call stack, então uma recursão de profundidade `n` gasta O(n) " +
                "de espaço.",
                "Trocar espaço por tempo, com cache, por exemplo, tem um limite: a memória também é finita.",
                "Meça só a memória extra do algoritmo, sem contar a entrada.",
              ],
            },
          ],
          examples: [
            {
              title: "Trocando espaço por tempo",
              context: "Um Set extra custa memória, mas evita um loop aninhado.",
              code: {
                language: "javascript",
                filename: "has-duplicates.js",
                code: ["function hasDuplicates(arr) { // O(n) de espaço extra, mas O(n) de tempo em vez de O(n²)", "  const seen = new Set();", "  for (const item of arr) {", "    if (seen.has(item)) return true;", "    seen.add(item);", "  }", "  return false;", "}"].join("\n"),
              },
              explanation: "O trade-off clássico entre Time e Space Complexity.",
            },
            {
              title: "Recursão consumindo espaço na call stack",
              context: "Cada chamada recursiva empilha um frame.",
              code: { language: "javascript", filename: "sum-recursive.js", code: ["function sumRecursive(arr, i = 0) { // O(n) de espaço", "  if (i >= arr.length) return 0;", "  return arr[i] + sumRecursive(arr, i + 1);", "}"].join("\n") },
              explanation: "n chamadas empilhadas significam espaço O(n), mesmo sem nenhuma estrutura de dados explícita sendo criada.",
            },
            {
              title: "Versão iterativa com espaço constante",
              context: "Mesmo resultado, sem o custo de espaço da recursão.",
              code: { language: "javascript", filename: "sum-iterative.js", code: ["function sumIterative(arr) { // O(1) de espaço", "  let total = 0;", "  for (const item of arr) total += item;", "  return total;", "}"].join("\n") },
              explanation: "Sem empilhar frames proporcionalmente a n.",
            },
          ],
          exercise: {
            problem: "A função abaixo inverte um array criando uma cópia nova — O(n) de espaço extra, quando poderia usar espaço constante.",
            problemCode: {
              language: "javascript",
              filename: "reverse-array.js",
              code: ["function reverseArray(arr) {", "  const result = [];", "  for (let i = arr.length - 1; i >= 0; i--) {", "    result.push(arr[i]);", "  }", "  return result;", "}"].join("\n"),
            },
            task: "Reescreva para inverter o array NO LUGAR, usando O(1) de espaço extra.",
            hint: "Troque os elementos das extremidades entre si, avançando de fora pra dentro, até os dois ponteiros se encontrarem.",
            solution: {
              code: {
                language: "javascript",
                filename: "reverse-in-place.js",
                code: ["function reverseInPlace(arr) {", "  let left = 0;", "  let right = arr.length - 1;", "  while (left < right) {", "    [arr[left], arr[right]] = [arr[right], arr[left]];", "    left++;", "    right--;", "  }", "  return arr;", "}"].join("\n"),
              },
              explanation: "Só duas variáveis extras, não importa o tamanho do array — espaço O(1), contra o O(n) da versão anterior.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Big O",
          note: "A notação",
          requires: ["Time Complexity", "Space Complexity"],
          summary:
            "A notação matemática que expressa a taxa de crescimento de um algoritmo, focando no pior caso e " +
            "ignorando constantes e termos menores — a forma padrão de comunicar Time/Space Complexity.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Big O é a notação formal usada pra expressar Time/Space Complexity — O(n), O(n²), O(log n), " +
                "etc. Ela descreve o comportamento assintótico do pior caso, ignorando constantes " +
                "multiplicativas e termos de menor ordem — O(2n + 100) simplifica pra O(n).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Big O é a notação que expressa a taxa de crescimento assintótica de um algoritmo, focando no " +
                "pior caso e ignorando constantes e termos menores — a linguagem padrão pra comparar Time/Space " +
                "Complexity entre algoritmos diferentes.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem uma notação padrão, comparar algoritmos vira uma conversa vaga. Big O dá uma linguagem " +
                "precisa e universal: dizer que um algoritmo é O(n) e outro é O(n²) comunica imediatamente que " +
                "o segundo vai crescer muito mais rápido, sem ambiguidade.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "process.js",
              code: ["function process(arr) {", "  console.log(arr[0]);        // O(1)", "  for (const item of arr) {   // O(n)", "    console.log(item);", "  }", "}", "// Complexidade total: O(1) + O(n) = O(n) — o termo dominante \"vence\""].join("\n"),
            },
            {
              type: "paragraph",
              text: "Somar O(1) com O(n) dá O(n) — Big O descarta o termo menor, porque conforme n cresce, ele se torna irrelevante.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Ignora constantes e termos menores: O(n) e O(2n) são a mesma classe, mas o segundo pode ser o dobro do tempo.",
                "Foca no pior caso; o caso típico, ou o melhor, pode ser bem diferente, e o melhor caso não muda o Big O.",
                "Blocos em sequência somam, e blocos aninhados multiplicam; confundir isso leva à classe errada.",
              ],
            },
          ],
          examples: [
            {
              title: "Ignorando constantes multiplicativas",
              context: "2n e n crescem na mesma proporção.",
              code: { language: "javascript", filename: "print-twice.js", code: "function printTwice(arr) {\n  for (const item of arr) console.log(item); // n\n  for (const item of arr) console.log(item); // mais n\n}\n// 2n operações, mas isso é O(n), não O(2n)" },
              explanation: "Big O foca na forma de crescimento, não no multiplicador exato.",
            },
            {
              title: "Pior caso vs. melhor caso",
              context: "Big O convencionalmente descreve o pior caso.",
              code: {
                language: "javascript",
                filename: "find-in-array.js",
                code: ["function findInArray(arr, target) {", "  for (const item of arr) {", "    if (item === target) return true; // melhor caso: O(1)", "  }", "  return false; // pior caso: O(n)", "}"].join("\n"),
              },
              explanation: "Mesmo que às vezes a busca termine rápido, Big O descreve o cenário mais desfavorável.",
            },
            {
              title: "Somando complexidades de blocos",
              context: "O termo de maior ordem sempre domina.",
              code: { language: "javascript", filename: "example.js", code: "function example(arr) {\n  for (const a of arr) console.log(a);              // O(n)\n  for (const a of arr) for (const b of arr) {}       // O(n²)\n}\n// O(n) + O(n²) = O(n²)" },
              explanation: "Blocos sequenciais somam complexidades; o termo de maior ordem sempre vence.",
            },
          ],
          exercise: {
            problem: "A função abaixo tem uma complexidade que pode ser simplificada — o código não deixa claro qual é o Big O real.",
            problemCode: {
              language: "javascript",
              filename: "process-full.js",
              code: ['function process(arr) {', '  console.log("iniciando"); // O(1)', "  for (const item of arr) { // O(n)", "    console.log(item);", "  }", "  for (const item of arr) { // outro O(n)", "    console.log(item * 2);", "  }", '  console.log("fim"); // O(1)', "}"].join("\n"),
            },
            task: "Determine, em comentário, o Big O total simplificado.",
            hint: "Some as complexidades de cada bloco sequencial, depois simplifique descartando constantes.",
            solution: {
              code: {
                language: "javascript",
                filename: "process-annotated.js",
                code: ['function process(arr) {', '  // O(1) + O(n) + O(n) + O(1) = O(2n + 2) = O(n) — simplificado', '  console.log("iniciando");', "  for (const item of arr) console.log(item);", "  for (const item of arr) console.log(item * 2);", '  console.log("fim");', "}"].join("\n"),
              },
              explanation: "A expressão bruta seria O(2n + 2), mas Big O descarta as constantes, simplificando pra O(n).",
            },
          },
        }),
        concept({
          order: 40,
          title: "Common Time Complexities",
          note: "As classes de crescimento",
          isNew: true,
          requires: ["Big O"],
          subtopics: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
          summary:
            "Um catálogo das taxas de crescimento mais comuns — O(1), O(log n), O(n), O(n log n), O(n²) — " +
            "cada uma com um exemplo canônico, pra reconhecer de cara qual classe um algoritmo pertence.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Common Time Complexities é o catálogo das classes de crescimento mais frequentes na " +
                "prática, da mais rápida pra mais lenta: O(1) constante, O(log n) logarítmica, O(n) linear, " +
                "O(n log n) linearítmica, O(n²) quadrática.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "As classes de crescimento mais comuns, da mais rápida pra mais lenta, são O(1), O(log n), " +
                "O(n), O(n log n), O(n²) — cada uma com um padrão de código reconhecível, que vale a pena " +
                "memorizar pra acelerar análise de complexidade no dia a dia.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Saber a definição de Big O não basta pra reconhecer complexidade rapidamente — construir um " +
                "repertório de exemplos canônicos acelera muito a análise de código novo, porque a maioria " +
                "dos algoritmos do dia a dia se encaixa numa dessas classes já vistas antes.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "As 5 classes, uma linha cada, do mais rápido ao mais lento:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "classes.js",
              code: [
                "arr[0];                              // O(1) — acesso direto",
                "binarySearch(sortedArr, target);     // O(log n) — descarta metade a cada passo",
                "arr.forEach(x => console.log(x));    // O(n) — um passo por elemento",
                "arr.slice().sort();                  // O(n log n) — a maioria dos sorts eficientes",
                "for (const a of arr) for (const b of arr) {} // O(n²) — par a par",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Memorizar esses padrões torna reconhecer complexidade em código novo muito mais rápido.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um laço não significa sempre O(n): o que conta é quanto do problema cada passo elimina ou repete.",
                "O(n²) escondida, como uma busca linear dentro de um laço, é a origem comum de lentidão que só aparece com " +
                "dados grandes.",
                "O catálogo é um atalho para reconhecer padrões, e não substitui contar as operações.",
              ],
            },
          ],
          examples: [
            {
              title: "Comparando o crescimento das 5 classes",
              context: "A diferença explode conforme n cresce.",
              code: {
                language: "text",
                filename: "growth-table.txt",
                code: "n=10:    O(1)=1   O(log n)≈3   O(n)=10    O(n log n)≈33      O(n²)=100\nn=1000:  O(1)=1   O(log n)≈10  O(n)=1000  O(n log n)≈10000   O(n²)=1000000",
              },
              explanation: "Pra n pequeno, todas as classes são gerenciáveis — a classe de complexidade importa mais em escala.",
            },
            {
              title: "O(log n) — cada passo elimina metade",
              context: "O padrão canônico de busca binária.",
              code: {
                language: "javascript",
                filename: "binary-search.js",
                code: [
                  "function binarySearch(arr, target, low = 0, high = arr.length - 1) {",
                  "  if (low > high) return -1;",
                  "  const mid = Math.floor((low + high) / 2);",
                  "  if (arr[mid] === target) return mid;",
                  "  return arr[mid] < target",
                  "    ? binarySearch(arr, target, mid + 1, high)",
                  "    : binarySearch(arr, target, low, mid - 1);",
                  "}",
                ].join("\n"),
              },
              explanation: "Pra dobrar o array, só é preciso mais um passo, não o dobro de passos.",
            },
            {
              title: "O(n log n) — o padrão dos sorts eficientes",
              context: "Dividir o problema repetidamente, trabalho linear em cada nível.",
              code: { language: "text", filename: "merge-sort-idea.txt", code: "Merge sort: divide o array em log n níveis, e cada nível processa n elementos\n→ n (trabalho por nível) × log n (número de níveis) = O(n log n)" },
              explanation: "O(n log n) aparece tipicamente quando um algoritmo divide o problema repetidamente e faz trabalho linear em cada nível.",
            },
          ],
          exercise: {
            problem: "Para cada trecho abaixo, identifique qual das 5 classes de Common Time Complexities ele pertence.",
            problemCode: {
              language: "javascript",
              filename: "classify.js",
              code: [
                "function a(arr) { return arr.length; }",
                "function b(arr, target) { return arr.includes(target); }",
                "function c(sortedArr, target) { /* implementação de busca binária */ }",
                "function d(arr) { return [...arr].sort((x, y) => x - y); }",
                "function e(arr) { const pairs = []; for (const x of arr) for (const y of arr) pairs.push([x, y]); return pairs; }",
              ].join("\n"),
            },
            task: "Adicione o comentário de classificação em cada função.",
            hint: "Relacione cada uma com o exemplo canônico visto no Conteúdo.",
            solution: {
              code: {
                language: "javascript",
                filename: "classify-annotated.js",
                code: [
                  "function a(arr) { return arr.length; } // O(1)",
                  "function b(arr, target) { return arr.includes(target); } // O(n)",
                  "function c(sortedArr, target) { /* busca binária */ } // O(log n)",
                  "function d(arr) { return [...arr].sort((x, y) => x - y); } // O(n log n)",
                  "function e(arr) { const pairs = []; for (const x of arr) for (const y of arr) pairs.push([x, y]); return pairs; } // O(n²)",
                ].join("\n"),
              },
              explanation: "Cada função corresponde diretamente a um dos padrões canônicos — reconhecer isso rapidamente é a habilidade que este Concept constrói.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Linear Search",
          note: "O(n) — percorrer tudo",
          requires: ["Common Time Complexities", "Array"],
          summary:
            "Buscar um valor percorrendo os elementos um por um, do início ao fim, até encontrar (ou " +
            "terminar a coleção) — a estratégia mais simples possível, O(n) no pior caso, e a única opção " +
            "quando os dados não estão ordenados.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Linear Search percorre uma coleção elemento por elemento, comparando cada um com o valor " +
                "procurado, até encontrar uma correspondência ou chegar ao fim. É a estratégia de busca mais " +
                "direta possível — sem nenhuma suposição sobre a organização dos dados.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Linear Search percorre elemento por elemento até encontrar (ou esgotar a coleção) — O(n) no " +
                "pior caso, simples e sem exigir ordenação prévia, mas o padrão de busca mais lento entre as " +
                "opções deste módulo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É o algoritmo de busca padrão quando não há garantia nenhuma sobre a ordem dos dados — sem " +
                "ordenação, não tem como \"pular\" partes com segurança. No pior caso, Linear Search precisa " +
                "examinar todos os n elementos — O(n).",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "linear-search.js",
              code: ["function linearSearch(arr, target) {", "  for (let i = 0; i < arr.length; i++) {", "    if (arr[i] === target) return i; // encontrado", "  }", "  return -1; // não encontrado, depois de checar TUDO", "}"].join("\n"),
            },
            {
              type: "paragraph",
              text: "No pior caso, o loop examina todos os n elementos antes de concluir que o valor não está presente — O(n).",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando os dados não estão ordenados ou a coleção é pequena.",
                "Quando a condição é arbitrária, como um predicado, e não uma simples igualdade.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em coleções grandes e buscadas com frequência, O(n) a cada busca pesa; ordene e use busca binária, ou use " +
                "um Set ou Hash Table.",
                "O melhor caso, achar na primeira posição, não muda o Big O, que é do pior caso.",
              ],
            },
          ],
          examples: [
            {
              title: "Encontrando o índice, não só se existe",
              context: "A variação mais comum de Linear Search.",
              code: { language: "javascript", filename: "index-of.js", code: ["function indexOf(arr, target) {", "  for (let i = 0; i < arr.length; i++) {", "    if (arr[i] === target) return i;", "  }", "  return -1;", "}"].join("\n") },
              explanation: "Devolve ONDE o valor está, não só se ele existe.",
            },
            {
              title: "Linear Search com predicado arbitrário",
              context: "O mesmo padrão de .find(), de Functional Programming.",
              code: { language: "javascript", filename: "find-first.js", code: ["function findFirst(arr, predicate) {", "  for (const item of arr) {", "    if (predicate(item)) return item;", "  }", "  return undefined;", "}", "findFirst(users, u => u.age >= 18);"].join("\n") },
              explanation: ".find() é uma Linear Search com um predicado arbitrário em vez de uma comparação de igualdade fixa.",
            },
            {
              title: "Melhor caso não muda o Big O",
              context: "A garantia é sobre o pior caso, não a sorte de cada execução.",
              code: { language: "javascript", filename: "best-case.js", code: "const arr = [42, 1, 2, 3, 4, 5];\nlinearSearch(arr, 42); // encontra na primeira posição, mas ainda é O(n) no PIOR caso" },
              explanation: "Reforça o Concept de Big O: a classificação descreve a garantia de pior caso.",
            },
          ],
          exercise: {
            problem: "A função abaixo continua percorrendo o array inteiro mesmo depois de já ter encontrado o valor — trabalho desperdiçado.",
            problemCode: {
              language: "javascript",
              filename: "count-matches.js",
              code: ["function countMatches(arr, target) {", "  let found = false;", "  for (const item of arr) {", "    if (item === target) found = true;", "  }", "  return found;", "}"].join("\n"),
            },
            task: "Reescreva para parar de percorrer assim que encontrar a primeira correspondência.",
            hint: "Um return dentro do loop, no momento certo, interrompe a busca imediatamente.",
            solution: {
              code: { language: "javascript", filename: "has-match.js", code: ["function hasMatch(arr, target) {", "  for (const item of arr) {", "    if (item === target) return true; // para IMEDIATAMENTE", "  }", "  return false;", "}"].join("\n") },
              explanation: "return dentro do loop interrompe a busca assim que encontra — mais rápido na prática, mesmo que o pior caso continue O(n).",
            },
          },
        }),
        concept({
          order: 60,
          title: "Binary Search",
          note: "O(log n) — descartar metade",
          requires: ["Common Time Complexities", "Binary Search Tree"],
          revisit: ["Testing & Quality Engineering / Debugging / Binary Search Debugging", "Testing & Quality Engineering / Debugging / Git Bisect"],
          summary:
            "Buscar um valor descartando metade do espaço de busca a cada passo — exige dados ordenados, mas " +
            "em troca entrega O(log n), muito mais rápido que percorrer tudo linearmente.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Binary Search busca um valor numa coleção ordenada comparando o alvo com o elemento do " +
                "meio: se for igual, achou; se for menor, o alvo só pode estar na metade esquerda; se for " +
                "maior, só pode estar na direita. O mesmo princípio já visto na busca dentro de uma Binary " +
                "Search Tree.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Binary Search descarta metade do espaço de busca a cada comparação, dando O(log n) — muito " +
                "mais rápido que Linear Search, mas exige que os dados estejam ordenados como pré-requisito.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Linear Search é O(n) porque não pode assumir nada sobre a organização dos dados. Mas se os " +
                "dados estão ordenados, cada comparação elimina metade do que resta — O(log n). O preço é o " +
                "pré-requisito: os dados precisam estar ordenados antes de começar.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "binary-search.js",
              code: [
                "function binarySearch(arr, target) {",
                "  let low = 0, high = arr.length - 1;",
                "  while (low <= high) {",
                "    const mid = Math.floor((low + high) / 2);",
                "    if (arr[mid] === target) return mid;",
                "    if (arr[mid] < target) low = mid + 1;  // descarta a metade esquerda",
                "    else high = mid - 1;                    // descarta a metade direita",
                "  }",
                "  return -1;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Pra um array de 1 milhão de elementos, no máximo ~20 comparações são necessárias " +
                "(log₂ 1.000.000 ≈ 20).",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em coleções ordenadas e grandes, onde descartar metade a cada passo faz uma grande diferença.",
                "Quando você fará muitas buscas sobre os mesmos dados, para compensar o custo de ordenar uma vez.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Exige dados ordenados; em dados não ordenados o resultado é errado, sem nenhum aviso.",
                "Para uma única busca em dados desordenados, ordenar antes custa mais que uma busca linear.",
              ],
            },
          ],
          examples: [
            {
              title: "Contraste direto: Linear vs. Binary Search",
              context: "A diferença fica dramática em escala.",
              code: { language: "javascript", filename: "contrast.js", code: "const sorted = Array.from({ length: 1000000 }, (_, i) => i);\nlinearSearch(sorted, 999999);  // até 1.000.000 comparações\nbinarySearch(sorted, 999999);  // até ~20 comparações" },
              explanation: "Binary Search resolve numa fração minúscula das comparações que Linear Search precisaria.",
            },
            {
              title: "Binary Search recursiva",
              context: "A profundidade da recursão é O(log n).",
              code: {
                language: "javascript",
                filename: "binary-search-recursive.js",
                code: [
                  "function binarySearchRecursive(arr, target, low = 0, high = arr.length - 1) {",
                  "  if (low > high) return -1;",
                  "  const mid = Math.floor((low + high) / 2);",
                  "  if (arr[mid] === target) return mid;",
                  "  return arr[mid] < target",
                  "    ? binarySearchRecursive(arr, target, mid + 1, high)",
                  "    : binarySearchRecursive(arr, target, low, mid - 1);",
                  "}",
                ].join("\n"),
              },
              explanation: "Cada chamada recursiva é uma \"metade\" — consistente com o Concept de Recursion mais à frente.",
            },
            {
              title: "Binary Search Debugging",
              context: "O mesmo princípio aplicado a um histórico de commits (git bisect).",
              code: {
                language: "text",
                filename: "git-bisect.txt",
                code:
                  "Achar QUAL commit introduziu um bug, entre 1000 commits, sem testar todos:\ntesta o commit do MEIO → se o bug já existe, está na metade anterior;\nse não existe, está na metade posterior. Repete — a ideia por trás de `git bisect`.",
              },
              explanation: "O mesmo princípio (descartar metade a cada passo) se aplica além de arrays.",
            },
          ],
          exercise: {
            problem: "A implementação abaixo tem um bug sutil — em certos casos, entra em loop infinito ou devolve um resultado errado.",
            problemCode: {
              language: "javascript",
              filename: "buggy-binary-search.js",
              code: [
                "function buggyBinarySearch(arr, target) {",
                "  let low = 0, high = arr.length - 1;",
                "  while (low <= high) {",
                "    const mid = Math.floor((low + high) / 2);",
                "    if (arr[mid] === target) return mid;",
                "    if (arr[mid] < target) low = mid; // bug: deveria ser mid + 1",
                "    else high = mid - 1;",
                "  }",
                "  return -1;",
                "}",
              ].join("\n"),
            },
            task: "Identifique o bug (em comentário) e corrija.",
            hint: "Se low nunca avança além de mid, e mid pode voltar a ser igual a low na próxima iteração, o que acontece com o loop?",
            solution: {
              code: {
                language: "javascript",
                filename: "fixed-binary-search.js",
                code: [
                  "function fixedBinarySearch(arr, target) {",
                  "  let low = 0, high = arr.length - 1;",
                  "  while (low <= high) {",
                  "    const mid = Math.floor((low + high) / 2);",
                  "    if (arr[mid] === target) return mid;",
                  "    if (arr[mid] < target) low = mid + 1; // corrigido",
                  "    else high = mid - 1;",
                  "  }",
                  "  return -1;",
                  "}",
                ].join("\n"),
              },
              explanation: "Sem o +1, quando high = low + 1, mid calcula pra low de novo — o loop pode nunca convergir. O +1 garante que o espaço de busca sempre encolhe.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Sorting Fundamentals",
          note: "Ingênuo vs. eficiente",
          requires: ["Common Time Complexities"],
          summary:
            "Ordenar uma coleção — o problema clássico que ilustra melhor do que qualquer outro a diferença " +
            "prática entre uma abordagem O(n²) ingênua e uma O(n log n) eficiente.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Sorting é o problema de reorganizar os elementos de uma coleção numa ordem específica. " +
                "Existem muitos algoritmos de sort, mas eles se dividem em duas categorias de complexidade " +
                "bem distintas: os \"ingênuos\" (O(n²), como Bubble Sort, Selection Sort) e os \"eficientes\" " +
                "(O(n log n), como Merge Sort, Quick Sort — os mesmos usados internamente por .sort() na " +
                "maioria das linguagens modernas).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Sorting divide algoritmos em ingênuos O(n²) (comparações par a par repetidas) e eficientes " +
                "O(n log n) (que dividem o problema em vez de comparar tudo com tudo) — como a estratégia de " +
                "um algoritmo determina sua classe de complexidade, não só o problema em si.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sorting é o exemplo canônico de O(n log n), o padrão que apareceu em Common Time " +
                "Complexities. Entender por que os algoritmos ingênuos são O(n²) (comparam pares repetidamente) " +
                "e os eficientes conseguem O(n log n) (usam divisão do problema) é uma lente que se aplica a " +
                "muitos outros problemas de algoritmos.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "Bubble Sort, o ingênuo mais didático:",
            },
            {
              type: "code",
              language: "javascript",
              filename: "bubble-sort.js",
              code: [
                "function bubbleSort(arr) {",
                "  for (let i = 0; i < arr.length; i++) {",
                "    for (let j = 0; j < arr.length - i - 1; j++) { // loop DENTRO de loop — O(n²)",
                "      if (arr[j] > arr[j + 1]) {",
                "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
                "      }",
                "    }",
                "  }",
                "  return arr;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text: "Dois loops aninhados, comparando pares vizinhos repetidamente — o padrão clássico de O(n²).",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Antes de uma busca binária, ou quando o resultado precisa ser apresentado em ordem.",
                "Com o `.sort()` nativo em quase todos os casos: ele já usa um algoritmo eficiente.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Algoritmos ingênuos, como Selection Sort, são O(n²) e só servem para aprender ou para coleções minúsculas.",
                "O `.sort()` do JavaScript ordena como texto por padrão e altera o array original; passe uma função de " +
                "comparação para números.",
              ],
            },
          ],
          examples: [
            {
              title: "Selection Sort — outro ingênuo O(n²)",
              context: "Estratégia diferente, mesma classe de complexidade.",
              code: {
                language: "javascript",
                filename: "selection-sort.js",
                code: ["function selectionSort(arr) {", "  for (let i = 0; i < arr.length; i++) {", "    let minIndex = i;", "    for (let j = i + 1; j < arr.length; j++) {", "      if (arr[j] < arr[minIndex]) minIndex = j;", "    }", "    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];", "  }", "  return arr;", "}"].join(
                  "\n"
                ),
              },
              explanation: "Acha o mínimo do restante a cada passo, em vez de trocar vizinhos — mas mesma classe O(n²).",
            },
            {
              title: ".sort() nativo, eficiente por baixo",
              context: "Os motores JS modernos usam algoritmos O(n log n).",
              code: { language: "javascript", filename: "native-sort.js", code: "const arr = [5, 3, 8, 1, 9, 2];\narr.sort((a, b) => a - b); // O(n log n)" },
              explanation: "Implementação eficiente por baixo (varia por motor JS, mas nunca O(n²)).",
            },
            {
              title: "A intuição de Merge Sort",
              context: "Dividir, ordenar as metades, juntar.",
              code: {
                language: "text",
                filename: "merge-sort.txt",
                code: "1. Divide o array ao meio (recursivamente, até sobrar 1 elemento)\n2. Junta (merge) as duas metades JÁ ORDENADAS numa única lista ordenada\nO \"dividir\" custa log n níveis; o \"juntar\" em cada nível custa n — total O(n log n)",
              },
              explanation: "Dividir o problema, em vez de comparar tudo com tudo, é o que muda a classe de complexidade.",
            },
          ],
          exercise: {
            problem: "A função abaixo ordena produtos por preço usando uma abordagem O(n²), sem perceber que existe uma alternativa mais simples e eficiente.",
            problemCode: {
              language: "javascript",
              filename: "sort-by-price-naive.js",
              code: [
                "function sortByPriceNaive(products) {",
                "  const result = [...products];",
                "  for (let i = 0; i < result.length; i++) {",
                "    for (let j = 0; j < result.length - i - 1; j++) {",
                "      if (result[j].price > result[j + 1].price) {",
                "        [result[j], result[j + 1]] = [result[j + 1], result[j]];",
                "      }",
                "    }",
                "  }",
                "  return result;",
                "}",
              ].join("\n"),
            },
            task: "Reescreva usando .sort() nativo (O(n log n)), com um comparador apropriado pro campo price.",
            hint: ".sort((a, b) => ...) — o comparador devolve um número negativo, zero, ou positivo.",
            solution: {
              code: { language: "javascript", filename: "sort-by-price-fast.js", code: "function sortByPriceFast(products) {\n  return [...products].sort((a, b) => a.price - b.price);\n}" },
              explanation: ".sort() nativo já usa um algoritmo O(n log n) por baixo — não há motivo pra reimplementar um sort O(n²) manualmente.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Recursion",
          note: "Chamar a si mesma",
          requires: ["Memory & Runtime / Call Stack", "Common Time Complexities"],
          revisit: ["Data Structures (traversals)"],
          summary:
            "Uma função que se chama a si mesma pra resolver um problema, quebrando-o em versões menores do " +
            "mesmo problema — cada chamada empilha um frame na Call Stack, até alcançar um caso base que " +
            "interrompe a recursão.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Recursion é quando uma função se chama a si mesma pra resolver um problema, dividindo-o em " +
                "versões progressivamente menores do mesmo problema, até chegar num caso base simples o " +
                "bastante pra resolver diretamente. Já vimos a mecânica por trás disso em Call Stack: cada " +
                "chamada recursiva empilha um novo frame.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Recursion resolve um problema chamando a própria função com uma versão menor do mesmo " +
                "problema, até um caso base — cada chamada usa um frame da Call Stack, e toda recursão " +
                "precisa de um caso base efetivamente alcançável, ou o resultado é um stack overflow.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Alguns problemas são naturalmente definidos em termos de si mesmos — percorrer uma Tree " +
                "(cada filho é raiz de uma sub-árvore menor), calcular um fatorial, Binary Search (cada " +
                "chamada é uma busca menor). Recursion expressa a solução de forma direta, espelhando a " +
                "própria definição do problema.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "factorial.js",
              code: ["function factorial(n) {", "  if (n <= 1) return 1;       // caso base — interrompe a recursão", "  return n * factorial(n - 1); // caso recursivo — problema menor", "}", "factorial(5); // 5 * 4 * 3 * 2 * 1 = 120"].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "factorial(5) chama factorial(4), que chama factorial(3), até factorial(1) (o caso base) " +
                "parar a cadeia — cada chamada empilha um frame na Call Stack.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o problema se divide em versões menores dele mesmo, como percorrer uma árvore.",
                "Quando a versão recursiva é bem mais clara que uma iterativa com pilha manual.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Sem um caso base alcançável, ou com profundidade demais, a recursão termina em stack overflow.",
                "Chamadas múltiplas podem repetir o mesmo cálculo, como no Fibonacci ingênuo; use memoization ou uma versão " +
                "iterativa.",
                "Nem toda linguagem otimiza a recursão de cauda; não conte com isso para profundidades grandes.",
              ],
            },
          ],
          examples: [
            {
              title: "Recursão percorrendo uma Tree",
              context: "A definição de \"soma de uma árvore\" já é recursiva.",
              code: { language: "javascript", filename: "sum-tree.js", code: "function sumTree(node) {\n  if (!node) return 0;\n  return node.value + node.children.reduce((sum, child) => sum + sumTree(child), 0);\n}" },
              explanation: "O código espelha diretamente a definição hierárquica de Tree.",
            },
            {
              title: "Recursão com múltiplas chamadas",
              context: "Cada chamada gera duas chamadas menores.",
              code: { language: "javascript", filename: "fibonacci.js", code: "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2); // DUAS chamadas por nível\n}" },
              explanation: "A \"árvore\" de chamadas cresce exponencialmente — Memoization, o próximo Concept, resolve esse problema.",
            },
            {
              title: "Recursão de cauda",
              context: "A chamada recursiva é a última operação.",
              code: { language: "javascript", filename: "sum-tail.js", code: "function sumTail(arr, i = 0, acc = 0) {\n  if (i >= arr.length) return acc;\n  return sumTail(arr, i + 1, acc + arr[i]); // última coisa que acontece\n}" },
              explanation: "Alguns runtimes conseguem otimizar isso (JavaScript, na prática, não garante essa otimização na maioria dos motores).",
            },
          ],
          exercise: {
            problem: "A função abaixo tenta somar os números de 1 até n recursivamente, mas nunca alcança o caso base.",
            problemCode: {
              language: "javascript",
              filename: "sum-up-to.js",
              code: ["function sumUpTo(n) {", "  return n + sumUpTo(n - 1); // nunca para!", "}", "sumUpTo(5); // RangeError: Maximum call stack size exceeded"].join("\n"),
            },
            task: "Corrija sumUpTo adicionando o caso base que falta.",
            hint: "Em que valor de n a soma deveria simplesmente devolver um resultado direto, sem mais chamadas?",
            solution: {
              code: { language: "javascript", filename: "sum-up-to-fixed.js", code: "function sumUpToFixed(n) {\n  if (n <= 0) return 0; // caso base\n  return n + sumUpToFixed(n - 1);\n}\nsumUpToFixed(5); // 15" },
              explanation: "Sem o caso base, a recursão nunca encontrava uma condição de parada.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Memoization",
          note: "Cache de resultados",
          requires: ["Recursion", "Data Structures / Hash Table", "Functional Programming / Pure Functions"],
          revisit: ["Platform / Caching"],
          summary:
            "Guardar em cache os resultados de chamadas anteriores de uma função, pra evitar recalcular o " +
            "mesmo resultado de novo — só funciona com segurança sobre Pure Functions, e resolve diretamente " +
            "o problema de recursão exponencial visto em Fibonacci.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Memoization guarda, num cache (tipicamente uma Hash Table), os resultados já calculados de " +
                "uma função, indexados pelos argumentos de entrada — na próxima vez que a função for chamada " +
                "com os mesmos argumentos, o resultado é devolvido direto do cache, sem recalcular.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Memoization guarda resultados de chamadas anteriores num cache, evitando recalcular o mesmo " +
                "resultado — só funciona com segurança sobre Pure Functions, e resolve diretamente a recursão " +
                "exponencial redundante que algoritmos como Fibonacci recursivo ingênuo produzem.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Já vimos que fibonacci recursivo recalcula os mesmos subproblemas repetidamente. Memoization " +
                "elimina esse desperdício: calcula cada subproblema uma única vez, guarda o resultado, e " +
                "reaproveita nas próximas vezes. Só é seguro fazer isso com Pure Functions — se o resultado " +
                "pudesse variar pro mesmo input, o cache devolveria respostas erradas.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "memoize.js",
              code: [
                "function memoize(fn) {",
                "  const cache = new Map();",
                "  return function (n) {",
                "    if (cache.has(n)) return cache.get(n); // já calculado",
                "    const result = fn(n);",
                "    cache.set(n, result);",
                "    return result;",
                "  };",
                "}",
                "const fibMemo = memoize(function fib(n) {",
                "  if (n <= 1) return n;",
                "  return fibMemo(n - 1) + fibMemo(n - 2); // reaproveita resultados já calculados",
                "});",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "memoize é uma Higher-Order Function que envolve qualquer função pura com um cache — cada n " +
                "só é calculado uma vez.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a mesma chamada, com os mesmos argumentos, se repete, como na recursão exponencial de Fibonacci.",
                "Em funções puras e caras de calcular, chamadas muitas vezes.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só é seguro sobre funções puras: com uma função impura, o cache devolve um valor que já não é o certo.",
                "O cache consome memória e cresce sem limite se não houver uma política de descarte.",
              ],
            },
          ],
          examples: [
            {
              title: "O ganho de performance visível",
              context: "Fibonacci sem e com memoization.",
              code: { language: "javascript", filename: "fib-slow.js", code: "function fibSlow(n) { // O(2^n)\n  if (n <= 1) return n;\n  return fibSlow(n - 1) + fibSlow(n - 2);\n}\n// fibSlow(40) demora perceptivelmente; fibMemo(40) é instantâneo" },
              explanation: "fibSlow(40) faz mais de um bilhão de chamadas redundantes; a versão memoizada faz só 40 cálculos únicos.",
            },
            {
              title: "Memoization com múltiplos argumentos",
              context: "Chave composta no cache.",
              code: {
                language: "javascript",
                filename: "memoize-multi.js",
                code: ["function memoizeMulti(fn) {", "  const cache = new Map();", "  return function (...args) {", "    const key = JSON.stringify(args);", "    if (cache.has(key)) return cache.get(key);", "    const result = fn(...args);", "    cache.set(key, result);", "    return result;", "  };", "}"].join(
                  "\n"
                ),
              },
              explanation: "O mesmo padrão de \"chave composta\" já visto em Hash Table.",
            },
            {
              title: "Por que memoization não funciona sobre função impura",
              context: "O efeito colateral fica escondido nas chamadas seguintes.",
              code: {
                language: "javascript",
                filename: "impure-memo.js",
                code: ["let requestCount = 0;", "function impureFetch(id) {", "  requestCount++;", "  return fetchData(id);", "}", "const memoizedFetch = memoize(impureFetch);", "memoizedFetch(1); // chama de verdade, requestCount = 1", "memoizedFetch(1); // do cache — requestCount NÃO incrementa"].join("\n"),
              },
              explanation: "Um bug sutil que só acontece porque a função não era pura.",
            },
          ],
          exercise: {
            problem: "A função abaixo calcula Fibonacci de forma recursiva ingênua, ficando extremamente lenta pra valores de n moderados.",
            problemCode: {
              language: "javascript",
              filename: "fib.js",
              code: ["function fib(n) {", "  if (n <= 1) return n;", "  return fib(n - 1) + fib(n - 2);", "}", "fib(35); // demora vários segundos"].join("\n"),
            },
            task: "Aplique memoization em fib, usando a função memoize genérica já vista no Conteúdo.",
            hint: "Como fib é recursiva, a versão memoizada precisa chamar A SI MESMA, não a função original — senão o cache não é reaproveitado dentro da própria recursão.",
            solution: {
              code: {
                language: "javascript",
                filename: "fib-memo.js",
                code: [
                  "function memoize(fn) {",
                  "  const cache = new Map();",
                  "  return function (n) {",
                  "    if (cache.has(n)) return cache.get(n);",
                  "    const result = fn(n);",
                  "    cache.set(n, result);",
                  "    return result;",
                  "  };",
                  "}",
                  "",
                  "const fibMemo = memoize(function (n) {",
                  "  if (n <= 1) return n;",
                  "  return fibMemo(n - 1) + fibMemo(n - 2); // chama a versão MEMOIZADA",
                  "});",
                  "fibMemo(35); // instantâneo",
                ].join("\n"),
              },
              explanation: "A recursão interna precisa chamar fibMemo, não uma função separada sem memoization — só assim cada subproblema é calculado uma única vez.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "asynchronous-programming",
      order: 70,
      title: "Asynchronous Programming",
      requires: [
        "Programming Fundamentals",
        "Functional Programming (First-Class Functions, Closure)",
        "Memory & Runtime / Call Stack",
      ],
      summary:
        "Fundamentos (Sync/Async, Blocking/Non-Blocking) agnósticos de linguagem; runtime e abstrações " +
        "no modelo event-loop (JS), sinalizando o que é específico.",
      suggestions: [
        "Promise Combinators (all / race / allSettled)",
        "Cancellation / AbortController",
        "Generators / Async Iterators",
        "Callback Hell (histórico)",
        "Backpressure (hoje só em Architecture)",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Synchronous vs Asynchronous",
          note: "framing — agnóstico de linguagem",
          summary:
            "Se o programa espera uma operação terminar antes de seguir pra próxima linha (síncrono), ou " +
            "se pode disparar a operação e continuar fazendo outra coisa enquanto ela roda em segundo plano " +
            "(assíncrono) — um eixo que existe em qualquer linguagem, não só em JavaScript.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Código síncrono executa uma instrução de cada vez, na ordem em que aparece — cada linha " +
                "espera a anterior terminar. Código assíncrono permite disparar uma operação e seguir " +
                "executando outras linhas antes dela terminar; o resultado chega depois, quando estiver pronto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Síncrono espera cada operação terminar antes de seguir; assíncrono dispara a operação e " +
                "continua, recebendo o resultado depois — a distinção existe em qualquer linguagem que lida " +
                "com operações lentas (I/O, timers, rede), não é específica de JavaScript.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Algumas operações (ler um arquivo, esperar uma resposta de rede, esperar um timer) demoram e " +
                "não usam CPU enquanto esperam — o processador fica ocioso, só aguardando. Se o programa " +
                "rodasse tudo de forma síncrona, ficaria travado esperando à toa. Async existe pra aproveitar " +
                "esse tempo ocioso: dispara a operação lenta e segue fazendo outro trabalho enquanto ela roda.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "sync-vs-async.js",
              code: [
                'console.log("1");',
                "setTimeout(function () {",
                '  console.log("2 — chega depois, mesmo com delay 0");',
                "}, 0);",
                'console.log("3");',
                "// ordem impressa: 1, 3, 2",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "setTimeout dispara a função passada e devolve o controle IMEDIATAMENTE — o programa não " +
                "espera o timer, segue pra linha seguinte. Por isso \"3\" imprime antes de \"2\", mesmo o " +
                "setTimeout aparecendo antes do console.log(\"3\") no código.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Operações assíncronas disparadas em sequência não terminam necessariamente na mesma ordem; a ordem de " +
                "chegada não segue a de disparo.",
                "Código depois de uma chamada assíncrona roda antes do resultado dela; usar o resultado ali, sem esperar, dá " +
                "`undefined`.",
                "Assíncrono não é paralelo: dispara e continua, mas não significa que duas coisas rodam ao mesmo tempo.",
              ],
            },
          ],
          examples: [
            {
              title: "Tudo síncrono — ordem previsível",
              context: "Cada linha espera a anterior terminar antes de rodar.",
              code: { language: "javascript", filename: "all-sync.js", code: ['console.log("a");', 'console.log("b");', 'console.log("c");', "// ordem: a, b, c — sempre, sem surpresas"].join("\n") },
              explanation: "Sem nenhuma operação assíncrona, a ordem de execução é idêntica à ordem de leitura do código.",
            },
            {
              title: "Uma operação assíncrona no meio",
              context: "A ordem de EXECUÇÃO deixa de ser a ordem de LEITURA.",
              code: {
                language: "javascript",
                filename: "one-async.js",
                code: ['console.log("a");', 'setTimeout(() => console.log("b — assíncrono"), 0);', 'console.log("c");', "// ordem: a, c, b"].join("\n"),
              },
              explanation: "\"b\" só imprime depois de \"c\", porque setTimeout não bloqueia — o programa segue antes do timer disparar.",
            },
            {
              title: "Duas operações assíncronas — a ordem de chegada não é garantida pela ordem de disparo",
              context: "Delays diferentes decidem quem chega primeiro.",
              code: {
                language: "javascript",
                filename: "two-async.js",
                code: ['setTimeout(() => console.log("demorado"), 100);', 'setTimeout(() => console.log("rápido"), 10);', "// ordem: rápido, demorado — quem tem menor delay chega primeiro"].join("\n"),
              },
              explanation: "Disparar uma operação assíncrona primeiro não garante que ela termine primeiro — quem controla a ordem de chegada é quando cada uma efetivamente fica pronta.",
            },
          ],
          exercise: {
            problem: "Preveja a ordem exata em que as mensagens abaixo são impressas no console.",
            problemCode: {
              language: "javascript",
              filename: "predict-order.js",
              code: ['console.log("início");', 'setTimeout(() => console.log("timeout 1"), 0);', 'console.log("meio");', 'setTimeout(() => console.log("timeout 2"), 0);', 'console.log("fim");'].join("\n"),
            },
            task: "Escreva, em um comentário, a ordem exata das 5 mensagens.",
            hint: "console.log síncrono roda imediatamente, na ordem do código. setTimeout, mesmo com delay 0, sempre roda DEPOIS de todo o código síncrono terminar.",
            solution: {
              code: {
                language: "javascript",
                filename: "predict-order-solved.js",
                code: [
                  "// Ordem: início, meio, fim, timeout 1, timeout 2",
                  "// As 3 chamadas síncronas rodam primeiro, na ordem do código.",
                  "// Os 2 setTimeout só rodam depois, na ordem em que foram AGENDADOS (não importa o delay 0).",
                ].join("\n"),
              },
              explanation: "Todo código síncrono termina antes de qualquer callback assíncrono rodar — mesmo com delay 0, setTimeout nunca interrompe o código síncrono em andamento.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Blocking vs Non-Blocking",
          requires: ["Synchronous vs Asynchronous"],
          note: "eixo distinto de sync/async — agnóstico",
          summary:
            "Se uma chamada trava a execução até a operação terminar (blocking) ou devolve o controle " +
            "imediatamente, deixando a operação continuar em segundo plano (non-blocking) — um eixo sobre " +
            "COMO o runtime lida com espera, distinto (mas relacionado) de sync/async.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Blocking é quando uma chamada trava a thread até a operação terminar — nada mais roda " +
                "enquanto ela espera. Non-blocking é quando a chamada devolve o controle imediatamente, e a " +
                "operação continua em segundo plano, notificando quando terminar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Blocking trava a thread até a operação terminar; non-blocking devolve o controle na hora e " +
                "notifica depois — um eixo sobre COMO a espera é tratada, distinto de sync/async (que é sobre " +
                "ORDEM de execução), mas os dois costumam aparecer juntos na prática.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sync/Async descreve a ORDEM de execução do código; Blocking/Non-Blocking descreve se a " +
                "THREAD fica presa esperando. Os dois eixos costumam andar juntos (código assíncrono " +
                "normalmente é non-blocking), mas são conceitos diferentes: dá pra ter uma chamada síncrona " +
                "que não bloqueia (raro) ou uma API assíncrona construída sobre uma implementação bloqueante " +
                "por baixo — a distinção existe pra nomear ONDE está o custo de esperar.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "blocking-vs-non-blocking.txt",
              code: [
                "Blocking:     leitura de arquivo trava a thread até o disco responder — nada mais roda nesse meio tempo.",
                "Non-blocking: leitura de arquivo devolve o controle na hora; o resultado chega via notificação",
                "              (callback/evento), enquanto a thread segue livre pra fazer outra coisa.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O runtime de JavaScript no browser e no Node é non-blocking por padrão pras operações de I/O " +
                "mais comuns (rede, timers, leitura de arquivo no Node) — é isso que permite uma página " +
                "continuar responsiva enquanto espera uma resposta de rede.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Não confunda com síncrono × assíncrono: um fala de como a espera é tratada, o outro da ordem de execução.",
                "Uma operação bloqueante numa thread única, como um laço longo ou uma chamada síncrona de arquivo, congela " +
                "todo o resto.",
                "Non-blocking não faz a operação ser mais rápida: só deixa a thread livre enquanto ela espera.",
              ],
            },
          ],
          examples: [
            {
              title: "Blocking — a thread trava",
              context: "Um loop pesado ocupa a thread inteira; nada mais roda até ele terminar.",
              code: {
                language: "javascript",
                filename: "blocking-loop.js",
                code: ["function blockFor(ms) {", "  const end = Date.now() + ms;", "  while (Date.now() < end) {} // ocupa a thread ativamente", "}", 'console.log("antes");', "blockFor(2000); // trava tudo por 2s — até o click de um botão espera", 'console.log("depois");'].join("\n"),
              },
              explanation: "Enquanto blockFor roda, a thread não processa mais nada — nem eventos de UI, nem outros timers.",
            },
            {
              title: "Non-blocking — a thread fica livre",
              context: "setTimeout devolve o controle na hora; o timer roda \"por fora\".",
              code: { language: "javascript", filename: "non-blocking-timer.js", code: ['console.log("antes");', 'setTimeout(() => console.log("depois do timer"), 2000);', 'console.log("logo em seguida");', "// a thread não trava — o programa segue livre enquanto o timer conta"].join("\n") },
              explanation: "Diferente do blockFor, setTimeout não ocupa a thread pelos 2 segundos — ela fica livre pra outro trabalho.",
            },
            {
              title: "A mesma operação, duas versões",
              context: "readFileSync (blocking) vs. a contraparte non-blocking, em pseudocódigo de I/O de arquivo.",
              code: {
                language: "text",
                filename: "file-read-modes.txt",
                code: [
                  "readFileSync(path)        // BLOCKING — a thread trava até o disco responder",
                  "readFile(path, callback)  // NON-BLOCKING — devolve o controle na hora, chama callback quando pronto",
                ].join("\n"),
              },
              explanation: "Muitas APIs de I/O oferecem as duas versões — a escolha entre elas é exatamente a escolha entre blocking e non-blocking.",
            },
          ],
          exercise: {
            problem: "Classifique cada chamada abaixo como blocking ou non-blocking, e justifique.",
            problemCode: {
              language: "text",
              filename: "classify-calls.txt",
              code: [
                "1. while (condicao) { /* loop apertado sem await */ }",
                "2. setTimeout(() => {...}, 1000)",
                "3. fetch(url) // (independente do que faz com o resultado depois)",
                "4. Array.from({length: 1e9}).map(x => x * 2) // array gigante, síncrono",
              ].join("\n"),
            },
            task: "Para cada item, escreva blocking ou non-blocking, com uma frase de justificativa.",
            hint: "Pergunte: enquanto essa linha roda, a thread consegue fazer mais alguma coisa, ou fica presa até terminar?",
            solution: {
              code: {
                language: "text",
                filename: "classify-calls-solved.txt",
                code: [
                  "1. Blocking — o loop ocupa a thread ativamente até a condição mudar; nada mais roda.",
                  "2. Non-blocking — devolve o controle na hora; o callback roda depois, via notificação.",
                  "3. Non-blocking — fetch dispara a requisição e devolve o controle imediatamente.",
                  "4. Blocking — o .map roda inteiro, de forma síncrona, ocupando a thread até terminar.",
                ].join("\n"),
              },
              explanation: "O teste decisivo é sempre o mesmo: a thread fica livre pra outra coisa enquanto a operação está em andamento, ou fica presa até ela terminar?",
            },
          },
        }),
        concept({
          order: 30,
          title: "Call Stack",
          canonical: false,
          revisitOf: "Programming Foundations / Memory & Runtime / Call Stack",
          requires: ["Memory & Runtime / Call Stack"],
          note: "revisita do conceito canônico, agora no contexto de execução assíncrona",
        }),
        concept({
          order: 40,
          title: "Callback",
          requires: ["Functional Programming / First-Class Functions", "Functional Programming / Closure", "Synchronous vs Asynchronous"],
          note: "o mecanismo básico — antecessor de Promise",
          summary:
            "Uma função passada como argumento pra outra função, com o combinado de ser chamada mais tarde — " +
            "quando um evento acontece ou uma operação assíncrona termina. O mecanismo mais básico pra " +
            "\"avisar\" o código de quem chamou quando algo está pronto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Callback é uma função passada como argumento pra outra função, pra ser executada mais tarde — " +
                "geralmente quando uma operação assíncrona termina, ou quando um evento acontece. Só é " +
                "possível porque funções são First-Class: podem ser passadas como qualquer outro valor.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Callback é uma função entregue como argumento pra ser chamada mais tarde — o mecanismo básico " +
                "pra lidar com \"o resultado ainda não existe agora\", possível porque funções são First-Class " +
                "e frequentemente combinado com Closure pra acessar contexto do chamador original.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando uma operação é assíncrona, o código que a disparou já seguiu em frente — não dá pra " +
                "simplesmente \"esperar o retorno\" como numa chamada síncrona. Callback resolve isso invertendo " +
                "o controle: em vez de o chamador esperar o resultado, ele entrega uma função que SERÁ chamada " +
                "quando o resultado existir. Frequentemente essa função fecha sobre variáveis do escopo onde " +
                "foi criada (Closure), o que permite acessar contexto do chamador mesmo rodando mais tarde.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "callback.js",
              code: [
                "function fetchUser(id, onDone) { // onDone é o callback",
                "  setTimeout(() => {",
                '    onDone({ id, name: "Ana" }); // chamado quando o \"resultado\" está pronto',
                "  }, 100);",
                "}",
                "fetchUser(1, function (user) {",
                "  console.log(user.name); // \"Ana\" — só roda quando o setTimeout dispara",
                "});",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "fetchUser não retorna o usuário diretamente — não tem como, ele ainda não existe quando a " +
                "função retorna. Em vez disso, guarda onDone e chama ela quando o dado está pronto.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em eventos e em APIs simples, em que a função é chamada quando algo acontece ou termina.",
                "Quando há um único passo assíncrono e o resultado é tratado ali mesmo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Callbacks aninhados em vários passos formam a \"pirâmide da desgraça\", difícil de ler e de tratar erros; " +
                "use Promises.",
                "O padrão erro-primeiro, como no Node.js, exige checar o erro em cada callback; esquecer disso deixa a falha " +
                "passar em silêncio.",
              ],
            },
          ],
          examples: [
            {
              title: "Callback em evento",
              context: "O mesmo padrão, fora de I/O — reagindo a uma ação do usuário.",
              code: { language: "javascript", filename: "event-callback.js", code: ['button.addEventListener("click", function () {', '  console.log("clicado!"); // roda só quando o evento acontece, tempo indeterminado', "});"].join("\n") },
              explanation: "addEventListener recebe um callback que só executa quando (e se) o clique acontecer — pode ser nunca.",
            },
            {
              title: "Closure dentro do callback",
              context: "O callback \"lembra\" de uma variável do escopo onde foi criado.",
              code: {
                language: "javascript",
                filename: "closure-in-callback.js",
                code: ["function greetLater(name) {", "  setTimeout(function () {", "    console.log(`Olá, ${name}!`); // fecha sobre \"name\", mesmo rodando depois", "  }, 100);", "}", 'greetLater("Ana"); // imprime "Olá, Ana!" depois de 100ms'].join("\n"),
              },
              explanation: "O callback continua tendo acesso a \"name\" mesmo executando bem depois de greetLater ter retornado — Closure em ação.",
            },
            {
              title: "Callback de erro-primeiro (padrão Node.js)",
              context: "Convenção comum: o primeiro argumento do callback é o erro (ou null).",
              code: {
                language: "javascript",
                filename: "error-first.js",
                code: ["function readConfig(path, callback) {", "  setTimeout(() => {", "    const failed = false;", '    if (failed) return callback(new Error("arquivo não encontrado"));', '    callback(null, { debug: true });', "  }, 50);", "}", "readConfig(\"config.json\", (err, config) => {", "  if (err) return console.error(err.message);", "  console.log(config);", "});"].join("\n"),
              },
              explanation: "Sem um valor de retorno pra usar em try/catch, callbacks assíncronos convencionam passar o erro como primeiro parâmetro.",
            },
          ],
          exercise: {
            problem: "A função abaixo simula uma busca lenta, mas espera receber o resultado como retorno — o que não funciona pra uma operação assíncrona.",
            problemCode: {
              language: "javascript",
              filename: "search-broken.js",
              code: ["function search(query) {", "  setTimeout(() => {", '    return [`resultado para "${query}"`]; // este return não vai a lugar nenhum útil', "  }, 100);", "}", "const results = search(\"gatos\");", "console.log(results); // undefined — o setTimeout ainda nem rodou"].join("\n"),
            },
            task: "Reescreva search pra receber um callback e chamá-lo com os resultados quando estiverem prontos.",
            hint: "Adicione um segundo parâmetro (o callback) e chame ele dentro do setTimeout, no lugar do return.",
            solution: {
              code: {
                language: "javascript",
                filename: "search-fixed.js",
                code: ["function search(query, onDone) {", "  setTimeout(() => {", '    onDone([`resultado para "${query}"`]);', "  }, 100);", "}", 'search("gatos", (results) => {', "  console.log(results); // [\"resultado para \\\"gatos\\\"\"] — agora chega no momento certo", "});"].join("\n"),
              },
              explanation: "O return dentro do setTimeout se perde porque a função-alvo do setTimeout já foi encerrada quando ele roda; o callback é o mecanismo que entrega o resultado no momento certo.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Task Queue",
          requires: ["Data Structures / Queue", "Callback"],
          collision: "≠ Architecture / Message Queue (infra, outra Epic)",
          note: "a fila FIFO de callbacks prontos",
          summary:
            "A fila (FIFO) onde callbacks de operações assíncronas terminadas (timers, I/O, eventos) esperam " +
            "sua vez de rodar — eles só executam quando a Call Stack esvazia, na ordem em que entraram.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Task Queue (também chamada de macrotask queue ou callback queue) é a fila onde callbacks " +
                "prontos pra rodar — de setTimeout, eventos de I/O, cliques — esperam sua vez. É uma Queue " +
                "clássica: primeiro a entrar, primeiro a sair (FIFO).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Task Queue é a fila FIFO onde callbacks prontos esperam a vez de rodar — eles só saem da " +
                "fila e entram na Call Stack quando ela está completamente vazia, o que explica por que " +
                "código assíncrono nunca interrompe código síncrono em andamento.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "JavaScript roda numa única thread — só executa uma coisa por vez. Quando um timer dispara ou " +
                "uma resposta de rede chega, o callback correspondente não pode simplesmente interromper o " +
                "que já está rodando; ele entra numa fila e espera a Call Stack ficar vazia. Sem essa fila, " +
                "callbacks concorreriam de forma imprevisível pela única thread disponível.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "task-queue.js",
              code: [
                'console.log("1");',
                'setTimeout(() => console.log("2"), 0); // callback vai pra Task Queue, não roda na hora',
                'console.log("3");',
                "// ordem: 1, 3, 2 — mesmo com delay 0, o callback espera a stack esvaziar",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "setTimeout(fn, 0) não executa fn imediatamente — ele agenda fn pra entrar na Task Queue assim " +
                "que o timer (0ms) expirar, e de lá ela só sai quando a Call Stack estiver vazia.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Nenhum callback roda enquanto a Call Stack não esvazia: um trecho síncrono longo atrasa todos os timers e " +
                "eventos.",
                "Um `setTimeout` de 0 ms não roda imediatamente: só entra em ação depois que o código síncrono termina.",
                "Timers garantem um atraso mínimo, não exato.",
              ],
            },
          ],
          examples: [
            {
              title: "Vários timers — ordem de entrada na fila é a ordem de saída",
              context: "Mesmo delay, FIFO decide a ordem.",
              code: { language: "javascript", filename: "fifo-order.js", code: ['setTimeout(() => console.log("primeiro"), 0);', 'setTimeout(() => console.log("segundo"), 0);', 'setTimeout(() => console.log("terceiro"), 0);', "// ordem: primeiro, segundo, terceiro — a ordem em que entraram na fila"].join("\n") },
              explanation: "Com o mesmo delay, quem entra primeiro na Task Queue sai primeiro — comportamento clássico de Queue.",
            },
            {
              title: "A Call Stack precisa esvaziar antes de QUALQUER callback rodar",
              context: "Um loop síncrono longo atrasa até um timer de delay 0.",
              code: {
                language: "javascript",
                filename: "stack-must-empty.js",
                code: ['setTimeout(() => console.log("da fila"), 0);', "for (let i = 0; i < 1e9; i++) {} // ocupa a Call Stack por um tempo", 'console.log("código síncrono termina");', "// \"da fila\" só imprime DEPOIS do loop inteiro, mesmo tendo delay 0"].join("\n"),
              },
              explanation: "O callback fica esperando na Task Queue o tempo todo — ele não tem prioridade sobre código síncrono em andamento.",
            },
            {
              title: "Callback de evento também entra na Task Queue",
              context: "Não é só timer — qualquer callback assíncrono segue a mesma fila.",
              code: { language: "javascript", filename: "event-in-queue.js", code: ['button.addEventListener("click", () => console.log("clique processado"));', "// quando clicado, o callback entra na Task Queue e espera a Call Stack esvaziar, igual um setTimeout"].join("\n") },
              explanation: "O mecanismo é o mesmo pra qualquer origem assíncrona — timers e eventos de UI compartilham a mesma fila.",
            },
          ],
          exercise: {
            problem: "Preveja a ordem de impressão, considerando como a Task Queue processa callbacks.",
            problemCode: {
              language: "javascript",
              filename: "queue-order.js",
              code: ['console.log("A");', 'setTimeout(() => console.log("B"), 0);', 'console.log("C");', 'setTimeout(() => console.log("D"), 0);', 'console.log("E");'].join("\n"),
            },
            task: "Escreva a ordem exata das 5 letras impressas.",
            hint: "Todo código síncrono roda primeiro, do início ao fim. Só depois a Task Queue começa a ser processada, na ordem FIFO.",
            solution: {
              code: { language: "text", filename: "queue-order-solved.txt", code: "Ordem: A, C, E, B, D\n\nSíncrono primeiro (A, C, E), depois a Task Queue processa B e D na ordem em que entraram." },
              explanation: "Os dois setTimeout entram na Task Queue na ordem em que aparecem no código; ambos só rodam depois que todo o código síncrono terminar.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Event Loop",
          requires: ["Asynchronous Programming / Call Stack", "Task Queue"],
          note: "modelo do JS / runtimes event-loop",
          summary:
            "O mecanismo que fica checando, em loop constante, se a Call Stack está vazia — e se estiver, " +
            "move o próximo callback da Task Queue pra dentro dela. É o que conecta código síncrono e " +
            "assíncrono numa única thread.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Event Loop é o mecanismo do runtime (browser, Node) que continuamente verifica: \"a Call " +
                "Stack está vazia?\". Se estiver, ele pega o próximo callback da Task Queue e empilha na Call " +
                "Stack pra executar. Esse ciclo se repete indefinidamente, enquanto o programa roda.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Event Loop é o ciclo que fica checando se a Call Stack está vazia e, se estiver, move o " +
                "próximo callback da Task Queue pra dentro dela — o mecanismo que faz JavaScript parecer " +
                "concorrente rodando numa única thread.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "JavaScript tem uma única Call Stack — só executa uma coisa por vez. Sem um mecanismo " +
                "coordenando quando callbacks pendentes entram na stack, não haveria como combinar execução " +
                "síncrona com resultados assíncronos chegando a qualquer momento. Event Loop é essa ponte: ele " +
                "garante que callbacks só entrem na stack quando ela está livre, nunca interrompendo código " +
                "síncrono no meio.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "event-loop-cycle.txt",
              code: [
                "loop infinito do Event Loop:",
                "  1. Call Stack está vazia?",
                "     não → espera (a stack está processando código síncrono)",
                "     sim → pega o próximo item da Task Queue (se houver) e empilha",
                "  2. repete",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Esse ciclo simples é o motivo pelo qual setTimeout(fn, 0) nunca roda \"imediatamente\": fn só " +
                "entra na Call Stack quando o Event Loop percebe que ela está vazia, o que só acontece depois " +
                "de todo o código síncrono atual terminar.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um laço síncrono longo trava o Event Loop: nada é atendido até ele terminar, inclusive a interface.",
                "Ele dá a impressão de concorrência numa thread única, mas o seu código JavaScript nunca roda em paralelo.",
                "Trabalho pesado de CPU não é ajudado pelo Event Loop; ele ajuda a esperar por I/O.",
              ],
            },
          ],
          examples: [
            {
              title: "Visualizando o ciclo com console.log",
              context: "Cada peça do quebra-cabeça no lugar certo.",
              code: { language: "javascript", filename: "visualize-loop.js", code: ['console.log("1: síncrono");', 'setTimeout(() => console.log("3: da Task Queue, via Event Loop"), 0);', 'console.log("2: síncrono");', "// o Event Loop só move o setTimeout pra Call Stack depois que 1 e 2 já rodaram"].join("\n") },
              explanation: "O Event Loop nunca antecipa um callback — ele espera a Call Stack esvaziar antes de agir.",
            },
            {
              title: "Um loop síncrono \"trava\" o Event Loop",
              context: "O Event Loop não tem como agir enquanto a Call Stack está ocupada.",
              code: { language: "javascript", filename: "blocked-loop.js", code: ['setTimeout(() => console.log("preso na fila"), 0);', "while (true) {} // Call Stack nunca esvazia — o Event Loop nunca consegue mover o callback"].join("\n") },
              explanation: "Isso é o que se chama de \"bloquear o Event Loop\" — um erro comum que trava toda a responsividade do programa.",
            },
            {
              title: "Múltiplas fontes assíncronas, um único Event Loop",
              context: "Timer e evento de clique competem pela mesma Call Stack.",
              code: { language: "javascript", filename: "multiple-sources.js", code: ['setTimeout(() => console.log("timer"), 0);', 'button.addEventListener("click", () => console.log("clique"));', "// quem chegar primeiro na Task Queue (dependendo de quando o usuário clica) roda primeiro"].join("\n") },
              explanation: "O Event Loop não distingue origem — timers, cliques, respostas de rede todos disputam a mesma fila e a mesma Call Stack vazia.",
            },
          ],
          exercise: {
            problem: "Explique, em suas próprias palavras, por que o código abaixo trava a aba do navegador (nenhum clique é processado enquanto ele roda).",
            problemCode: {
              language: "javascript",
              filename: "frozen-tab.js",
              code: ["function heavyComputation() {", "  let result = 0;", "  for (let i = 0; i < 10_000_000_000; i++) {", "    result += i;", "  }", "  return result;", "}", "heavyComputation();"].join("\n"),
            },
            task: "Escreva 2-3 frases explicando o travamento em termos de Call Stack e Event Loop.",
            hint: "Pense: o que precisa estar vazio pra um clique (que gera um callback) conseguir rodar?",
            solution: {
              code: {
                language: "text",
                filename: "frozen-tab-explained.txt",
                code: [
                  "heavyComputation ocupa a Call Stack inteira até o loop de 10 bilhões de iterações terminar.",
                  "O Event Loop só move callbacks da Task Queue pra Call Stack quando ela está vazia — e ela",
                  "não fica vazia até heavyComputation retornar. Por isso nenhum callback de clique roda antes",
                  "disso: a aba parece travada porque, tecnicamente, está — a única thread está ocupada.",
                ].join("\n"),
              },
              explanation: "Isso demonstra concretamente por que operações pesadas e síncronas bloqueiam a responsividade — não é o Event Loop que está lento, é a Call Stack que nunca fica livre pra ele agir.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Microtask Queue",
          requires: ["Event Loop", "Task Queue"],
          note: "específico de runtime (JS)",
          summary:
            "Uma segunda fila de callbacks (usada por Promises) com prioridade sobre a Task Queue: o Event " +
            "Loop esvazia a Microtask Queue INTEIRA antes de pegar o próximo item da Task Queue.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Microtask Queue é uma fila separada da Task Queue, usada principalmente por callbacks de " +
                "Promise (.then/.catch/.finally). A diferença crucial: sempre que a Call Stack esvazia, o " +
                "Event Loop processa TODAS as microtasks pendentes antes de pegar sequer uma task da Task " +
                "Queue normal.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Microtask Queue é a fila de prioridade mais alta do Event Loop, usada por Promises — ela é " +
                "esvaziada COMPLETAMENTE toda vez que a Call Stack fica livre, antes de qualquer item da Task " +
                "Queue (timers, eventos) ter a chance de rodar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Promises precisam de garantias mais fortes de ordem do que timers ou eventos de UI — encadear " +
                "vários .then() só faz sentido de forma previsível se cada elo rodar o mais cedo possível, sem " +
                "disputar espaço com timers ou cliques que já estejam na fila. Dar à Microtask Queue prioridade " +
                "sobre a Task Queue garante que uma cadeia de Promises termine antes que qualquer nova task " +
                "(um novo setTimeout, por exemplo) comece a rodar.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "microtask-priority.js",
              code: [
                "function logOrder() {",
                '  console.log("1: síncrono");',
                '  setTimeout(() => console.log("4: Task Queue"), 0);',
                '  Promise.resolve().then(() => console.log("3: Microtask Queue"));',
                '  console.log("2: síncrono");',
                "}",
                "logOrder();",
                "// ordem: 1, 2, 3, 4 — a microtask sempre fura a fila na frente da task",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Mesmo o setTimeout tendo sido agendado ANTES do .then(), a Promise resolve antes — porque " +
                "toda a Microtask Queue é drenada antes do Event Loop sequer olhar pra Task Queue.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Como é esvaziada por inteiro antes da Task Queue, uma microtask que gera outra microtask sem parar impede " +
                "timers e eventos de rodarem.",
                "Callbacks de `.then()` rodam antes de um `setTimeout(…, 0)`, mesmo que este tenha sido agendado primeiro.",
                "Ao raciocinar sobre a ordem, considere as duas filas: microtasks primeiro, depois a próxima tarefa.",
              ],
            },
          ],
          examples: [
            {
              title: "Cadeia de .then() — cada elo é uma microtask",
              context: "Encadeamento de Promise, cada .then() gera nova microtask.",
              code: {
                language: "javascript",
                filename: "then-chain.js",
                code: ['setTimeout(() => console.log("task"), 0);', "Promise.resolve()", '  .then(() => console.log("microtask 1"))', '  .then(() => console.log("microtask 2"))', '  .then(() => console.log("microtask 3"));', "// ordem: microtask 1, 2, 3 — todas antes de \"task\""].join("\n"),
              },
              explanation: "A cadeia inteira de microtasks roda antes do setTimeout, mesmo tendo 3 elos — a Microtask Queue só é considerada vazia quando não sobra mais nenhuma microtask, incluindo as geradas por outras microtasks.",
            },
            {
              title: "Microtask gerando nova microtask",
              context: "Uma microtask pode enfileirar outra — o loop de drenagem continua até esgotar.",
              code: { language: "javascript", filename: "nested-microtask.js", code: ['Promise.resolve().then(() => {', '  console.log("microtask externa");', '  Promise.resolve().then(() => console.log("microtask interna, ainda antes de qualquer task"));', "});", 'setTimeout(() => console.log("task"), 0);'].join("\n") },
              explanation: "Mesmo a microtask interna sendo criada DEPOIS do setTimeout, ela ainda roda antes — a drenagem da Microtask Queue não para até realmente esvaziar.",
            },
            {
              title: "Comparando as duas filas lado a lado",
              context: "Task e Microtask intercaladas, prioridade sempre da microtask.",
              code: {
                language: "javascript",
                filename: "compare-queues.js",
                code: ['setTimeout(() => console.log("task 1"), 0);', 'Promise.resolve().then(() => console.log("microtask 1"));', 'setTimeout(() => console.log("task 2"), 0);', 'Promise.resolve().then(() => console.log("microtask 2"));', "// ordem: microtask 1, microtask 2, task 1, task 2"].join("\n"),
              },
              explanation: "Ambas as microtasks rodam antes de QUALQUER task, independente da ordem de agendamento entre elas.",
            },
          ],
          exercise: {
            problem: "Preveja a ordem de impressão, considerando a prioridade da Microtask Queue sobre a Task Queue.",
            problemCode: {
              language: "javascript",
              filename: "predict-microtask.js",
              code: ['console.log("A");', 'setTimeout(() => console.log("B"), 0);', 'Promise.resolve().then(() => console.log("C"));', 'Promise.resolve().then(() => console.log("D"));', 'console.log("E");'].join("\n"),
            },
            task: "Escreva a ordem exata das 5 letras.",
            hint: "Síncrono primeiro; depois TODAS as microtasks pendentes; só então a primeira task da Task Queue.",
            solution: {
              code: { language: "text", filename: "predict-microtask-solved.txt", code: "Ordem: A, E, C, D, B\n\nSíncrono (A, E) → toda a Microtask Queue (C, D) → só então a Task Queue (B)." },
              explanation: "As duas Promises geram microtasks que são drenadas completamente antes do setTimeout ter qualquer chance de rodar, mesmo tendo sido agendado primeiro.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Promise",
          requires: ["Callback", "Microtask Queue"],
          revisit: ["AI / Streaming", "Platform / Web Fundamentals / Server-Sent Events (SSE)"],
          note: "estados: pending / fulfilled / rejected",
          summary:
            "Um objeto que representa o resultado eventual de uma operação assíncrona — pendente, resolvida " +
            "ou rejeitada — permitindo encadear reações com .then()/.catch() em vez de aninhar callbacks " +
            "dentro de callbacks.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Promise é um objeto que representa o resultado (ainda não disponível) de uma operação " +
                "assíncrona. Ela sempre está em um de três estados: pending (aguardando), fulfilled (resolvida " +
                "com sucesso) ou rejected (falhou). Uma vez resolvida ou rejeitada, o estado nunca muda de " +
                "novo — e qualquer .then()/.catch() registrado, mesmo depois, recebe o resultado já decidido.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Promise é um objeto que representa o resultado futuro de uma operação assíncrona — pending, " +
                "fulfilled ou rejected, transição única e final — permitindo encadear .then()/.catch() de " +
                "forma achatada em vez de aninhar callbacks, com tratamento de erro centralizado.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Callbacks aninhados pra várias operações assíncronas em sequência formam o que ficou " +
                "conhecido como \"callback hell\": cada passo aninhado dentro do callback anterior, cada vez " +
                "mais indentado, e tratamento de erro duplicado em cada nível. Promise resolve isso dando um " +
                "objeto de primeira classe pra representar \"um valor que ainda vai existir\", permitindo " +
                "encadear passos com .then() (achatado, não aninhado) e centralizar erros num único .catch().",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "promise-basic.js",
              code: [
                "function fetchUser(id) {",
                "  return new Promise((resolve, reject) => {",
                "    setTimeout(() => {",
                "      if (id > 0) resolve({ id, name: \"Ana\" });",
                '      else reject(new Error("id inválido"));',
                "    }, 100);",
                "  });",
                "}",
                "fetchUser(1)",
                "  .then((user) => console.log(user.name)) // \"Ana\"",
                "  .catch((err) => console.error(err.message));",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "fetchUser retorna a Promise IMEDIATAMENTE, ainda pending. O resultado (resolve ou reject) só " +
                "chega depois, via .then()/.catch() — que rodam como microtasks quando a Promise resolve.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para encadear passos assíncronos sequenciais sem aninhar callbacks.",
                "Para tratar erros em um único `.catch()` que cobre toda a cadeia.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma Promise rejeitada sem `.catch()` vira erro não tratado; sempre trate a rejeição.",
                "Uma Promise já começou a executar quando criada e não pode ser cancelada por padrão.",
                "Uma vez resolvida ou rejeitada, o estado não muda mais; para eventos repetidos, uma Promise não serve.",
              ],
            },
          ],
          examples: [
            {
              title: "Encadeando passos sequenciais",
              context: "Cada .then() recebe o valor retornado pelo anterior — sem aninhar.",
              code: {
                language: "javascript",
                filename: "chain-steps.js",
                code: ["fetchUser(1)", "  .then((user) => fetchPosts(user.id)) // retorna outra Promise", "  .then((posts) => console.log(posts.length))", "  .catch((err) => console.error(\"algo falhou na cadeia:\", err.message));"].join("\n"),
              },
              explanation: "Retornar uma Promise dentro de um .then() \"achata\" a cadeia automaticamente — o próximo .then() espera ela resolver antes de rodar.",
            },
            {
              title: "Um único .catch() cobre toda a cadeia",
              context: "Erro em qualquer ponto da cadeia pula direto pro .catch().",
              code: { language: "javascript", filename: "single-catch.js", code: ["fetchUser(-1) // vai rejeitar", "  .then((user) => fetchPosts(user.id)) // nunca roda", "  .then((posts) => console.log(posts.length)) // nunca roda", "  .catch((err) => console.error(\"pego aqui:\", err.message)); // roda direto"].join("\n") },
              explanation: "Diferente de callbacks aninhados (onde cada nível precisaria checar erro separadamente), uma rejeição em qualquer ponto pula todos os .then() seguintes e cai no próximo .catch().",
            },
            {
              title: "Promise.resolve() para valores já disponíveis",
              context: "Envolver um valor síncrono numa Promise pra uniformizar a interface.",
              code: { language: "javascript", filename: "promise-resolve.js", code: ["const cached = { id: 1, name: \"Ana\" };", "Promise.resolve(cached).then((user) => console.log(user.name)); // \"Ana\", como microtask"].join("\n") },
              explanation: "Útil quando uma função às vezes tem o dado em cache (síncrono) e às vezes precisa buscar (assíncrono) — Promise.resolve() uniformiza a interface pro chamador sempre usar .then().",
            },
          ],
          exercise: {
            problem: "O código abaixo aninha callbacks (callback hell) pra buscar um usuário e depois seus posts.",
            problemCode: {
              language: "javascript",
              filename: "callback-hell.js",
              code: [
                "getUser(1, function (err, user) {",
                "  if (err) return console.error(err);",
                "  getPosts(user.id, function (err, posts) {",
                "    if (err) return console.error(err);",
                "    console.log(posts.length);",
                "  });",
                "});",
              ].join("\n"),
            },
            task: "Reescreva usando Promises, assumindo que getUserAsync(id) e getPostsAsync(userId) já retornam Promise, encadeadas com .then() e um único .catch().",
            hint: "Retorne getPostsAsync(user.id) de dentro do primeiro .then() pra encadear, e coloque só um .catch() no final.",
            solution: {
              code: {
                language: "javascript",
                filename: "promise-version.js",
                code: ["getUserAsync(1)", "  .then((user) => getPostsAsync(user.id))", "  .then((posts) => console.log(posts.length))", "  .catch((err) => console.error(err));"].join("\n"),
              },
              explanation: "A versão com Promise é achatada (sem indentação crescente) e trata erro de qualquer um dos dois passos num único .catch(), em vez de checar err em cada callback aninhado.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Async/Await",
          requires: ["Promise"],
          note: "açúcar sintático sobre Promise",
          summary:
            "Sintaxe que permite escrever código assíncrono baseado em Promise com a aparência de código " +
            "síncrono — await pausa a função (sem bloquear a thread) até a Promise resolver, sem precisar " +
            "encadear .then().",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Async/Await é açúcar sintático sobre Promise: uma função marcada async sempre retorna uma " +
                "Promise, e dentro dela await pausa a execução daquela função (só dela, não da thread " +
                "inteira) até a Promise à direita resolver, entregando o valor resolvido diretamente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Async/Await é açúcar sintático sobre Promise — await pausa apenas a função atual (não a " +
                "thread) até a Promise resolver, permitindo escrever lógica assíncrona com a estrutura visual " +
                "de código síncrono, incluindo try/catch comum pra tratar rejeições.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Cadeias longas de .then() ainda exigem pensar \"de trás pra frente\" em certos casos (loops, " +
                "condicionais, try/catch por cima de vários passos ficam verbosos). Async/Await permite " +
                "escrever a mesma lógica assíncrona com a estrutura visual de código síncrono — um if, um " +
                "for, um try/catch comuns — sem mudar o comportamento por baixo, que continua sendo Promise.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "async-await.js",
              code: [
                "async function getUserName(id) {",
                "  const user = await fetchUser(id); // pausa AQUI até a Promise resolver",
                "  return user.name;",
                "}",
                "getUserName(1).then((name) => console.log(name)); // getUserName sempre retorna Promise",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "await fetchUser(id) é equivalente a fetchUser(id).then(user => ...) — mas escrito como se " +
                "fosse uma atribuição síncrona comum. getUserName continua sendo assíncrona: ela ainda retorna " +
                "uma Promise, que precisa de .then() ou outro await pra ser consumida.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para escrever lógica assíncrona com a estrutura de código síncrono, incluindo `try/catch` comum.",
                "Quando vários passos dependem do resultado anterior e a leitura em sequência fica mais clara.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "`await` em sequência serializa: para operações independentes, dispare-as juntas com `Promise.all`.",
                "Uma `async` function sempre devolve uma Promise; esquecer o `await` ao chamá-la devolve a Promise em vez do " +
                "valor.",
                "O `await` pausa só a função, não a thread, mas o código depois dele só roda quando a Promise resolve.",
              ],
            },
          ],
          examples: [
            {
              title: "try/catch no lugar de .catch()",
              context: "Erro de uma Promise rejeitada vira uma exceção capturável.",
              code: {
                language: "javascript",
                filename: "try-catch-async.js",
                code: ["async function getUserName(id) {", "  try {", "    const user = await fetchUser(id);", "    return user.name;", "  } catch (err) {", "    console.error(\"falhou:\", err.message);", "    return null;", "  }", "}"].join("\n"),
              },
              explanation: "Quando a Promise de fetchUser rejeita, o await lança uma exceção — capturável com try/catch comum, em vez de um .catch() separado.",
            },
            {
              title: "Vários await em sequência",
              context: "Cada linha só segue quando a anterior resolve — leitura linear.",
              code: { language: "javascript", filename: "sequential-await.js", code: ["async function getUserPosts(id) {", "  const user = await fetchUser(id);", "  const posts = await fetchPosts(user.id);", "  return posts;", "}"].join("\n") },
              explanation: "Equivalente à cadeia .then().then() anterior, mas lido de cima pra baixo como código síncrono comum.",
            },
            {
              title: "await NÃO bloqueia a thread",
              context: "Enquanto uma função async espera, outro código continua rodando.",
              code: {
                language: "javascript",
                filename: "non-blocking-await.js",
                code: ["async function slow() {", '  await fetchUser(1);', '  console.log("slow terminou");', "}", "slow();", 'console.log("isso imprime ANTES de \\"slow terminou\\""); // await não trava o resto do programa'].join("\n"),
              },
              explanation: "await pausa só o corpo de slow — o resto do programa (e a thread) continua livre enquanto a Promise não resolve, exatamente como uma cadeia .then() se comportaria.",
            },
          ],
          exercise: {
            problem: "Converta a cadeia de Promise abaixo pra usar async/await, com tratamento de erro via try/catch.",
            problemCode: {
              language: "javascript",
              filename: "chain-to-convert.js",
              code: ["function loadDashboard(userId) {", "  return fetchUser(userId)", "    .then((user) => fetchPosts(user.id))", "    .then((posts) => posts.length)", "    .catch((err) => {", '      console.error("erro no dashboard:", err.message);', "      return 0;", "    });", "}"].join("\n"),
            },
            task: "Reescreva loadDashboard como uma função async equivalente.",
            hint: "Cada .then() vira uma linha com await; o .catch() vira um bloco catch de try/catch envolvendo os awaits.",
            solution: {
              code: {
                language: "javascript",
                filename: "chain-converted.js",
                code: [
                  "async function loadDashboard(userId) {",
                  "  try {",
                  "    const user = await fetchUser(userId);",
                  "    const posts = await fetchPosts(user.id);",
                  "    return posts.length;",
                  "  } catch (err) {",
                  '    console.error("erro no dashboard:", err.message);',
                  "    return 0;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation: "loadDashboard continua retornando uma Promise (por ser async) — o comportamento externo é idêntico, só a forma de escrever a lógica interna mudou.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "concurrency",
      order: 80,
      title: "Concurrency",
      requires: ["Asynchronous Programming", "Memory & Runtime"],
      summary:
        "Framing (concurrency ≠ parallelism ≠ async) → unidades de execução → o problema (shared state → race) → " +
        "as ferramentas → as novas falhas → o objetivo (thread safety).",
      suggestions: [
        "Context Switch",
        "Thread Pool",
        "Lock Contention",
        "Livelock",
        "Compare-and-Swap (CAS)",
        "Memory Model / Happens-Before",
        "Actor Model",
        "CSP / Channels",
        "Green Threads / Coroutines",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Concurrency vs Parallelism",
          requires: ["Asynchronous Programming / Synchronous vs Asynchronous"],
          note: "framing — não é o mesmo que async",
          summary:
            "Concurrency é lidar com várias tarefas em andamento ao mesmo tempo, possivelmente intercalando " +
            "execução numa única CPU; parallelism é executar várias tarefas literalmente ao mesmo tempo, em " +
            "CPUs diferentes — distinto também de async, que é sobre ordem, não sobre quantas CPUs estão em uso.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Concurrency é a capacidade de um sistema lidar com várias tarefas em andamento ao mesmo " +
                "tempo — elas podem estar se intercalando numa única CPU (uma avança um pouco, pausa, outra " +
                "avança um pouco) sem nunca rodar literalmente simultânea. Parallelism é executar várias " +
                "tarefas literalmente ao mesmo tempo, em CPUs (ou núcleos) diferentes, de verdade em paralelo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Concurrency é gerenciar várias tarefas em andamento, possivelmente intercaladas numa única " +
                "CPU; parallelism é executá-las literalmente ao mesmo tempo, em CPUs diferentes — e nenhum " +
                "dos dois é sinônimo de async, que é sobre ordem de execução, não sobre quantos núcleos estão " +
                "em uso.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Os três termos — sync/async, concurrency, parallelism — respondem perguntas diferentes, e " +
                "confundi-los gera raciocínio errado sobre performance. Async (Asynchronous Programming) é " +
                "sobre ORDEM: uma operação pode terminar depois de outra ter começado. Concurrency é sobre " +
                "GERENCIAR várias tarefas em andamento. Parallelism é sobre EXECUÇÃO SIMULTÂNEA real, o que só " +
                "é possível com múltiplos núcleos de CPU. JavaScript no navegador é concorrente (via Event " +
                "Loop) mas roda numa única thread principal — não é paralelo, a menos que Web Workers (ou " +
                "worker_threads no Node) sejam usados para rodar código em núcleos separados de verdade.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "concurrency-vs-parallelism.txt",
              code: [
                "Concurrency (uma CPU, intercalado):",
                "  CPU: [Tarefa A] [Tarefa B] [Tarefa A] [Tarefa B] [Tarefa A] ...",
                "       — nunca as duas rodando no mesmo instante, mas as duas avançam",
                "",
                "Parallelism (duas CPUs, simultâneo):",
                "  CPU1: [Tarefa A] [Tarefa A] [Tarefa A] ...",
                "  CPU2: [Tarefa B] [Tarefa B] [Tarefa B] ...",
                "       — as duas rodando no MESMO instante, em núcleos diferentes",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Um sistema pode ser concorrente sem ser paralelo (JavaScript de thread única) — e, com " +
                "múltiplos núcleos, pode ser as duas coisas ao mesmo tempo (várias tarefas concorrentes, " +
                "algumas rodando de fato em paralelo).",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Concorrência não implica paralelismo: várias tarefas podem se intercalar numa única CPU sem que duas rodem " +
                "ao mesmo tempo.",
                "Paralelismo só acelera o que se divide em partes independentes; a parte sequencial limita o ganho.",
                "Nenhum dos dois é sinônimo de async: async trata da ordem de execução, e não de quantas CPUs estão em uso.",
              ],
            },
          ],
          examples: [
            {
              title: "Concorrente e paralelo ao mesmo tempo",
              context: "Múltiplas requisições de rede, cada uma processada por um núcleo diferente.",
              code: { language: "text", filename: "both.txt", code: "Servidor com 4 núcleos, 100 requisições chegando:\n→ Concurrency: as 100 requisições estão todas \"em andamento\" ao mesmo tempo.\n→ Parallelism: até 4 delas rodam literalmente no mesmo instante (uma por núcleo)." },
              explanation: "Na prática, sistemas reais combinam os dois: concorrência para gerenciar muitas tarefas, paralelismo para acelerar usando os núcleos disponíveis.",
            },
            {
              title: "Concorrente, mas NÃO paralelo",
              context: "JavaScript de thread única no navegador.",
              code: {
                language: "javascript",
                filename: "single-threaded-concurrency.js",
                code: ["async function carregarTudo() {", '  const a = fetch("/api/a");', '  const b = fetch("/api/b");', "  return Promise.all([a, b]);", "}", "// as duas requisições estão \"em andamento\" ao mesmo tempo (concurrency)", "// mas o JS da thread principal nunca executa duas linhas literalmente juntas (sem parallelism)"].join("\n"),
              },
              explanation: "As requisições de rede rodam em paralelo NO SISTEMA OPERACIONAL, mas o código JavaScript que as disparou continua rodando numa única thread.",
            },
            {
              title: "Paralelo, mas sem múltiplas tarefas lógicas concorrentes",
              context: "Uma única tarefa (somar um array gigante) dividida entre núcleos.",
              code: { language: "text", filename: "data-parallelism.txt", code: "Somar 1 bilhão de números, dividido em 4 pedaços, um por núcleo:\n→ Parallelism: 4 núcleos somando pedaços diferentes no mesmo instante.\n→ Não é sobre gerenciar \"tarefas\" concorrentes distintas — é UMA tarefa, paralelizada." },
              explanation: "Parallelism também aparece sem múltiplas tarefas lógicas — dividir um único problema grande entre núcleos é outra forma comum de paralelismo (data parallelism).",
            },
          ],
          exercise: {
            problem: "Classifique cada cenário abaixo como concurrency, parallelism, ou os dois.",
            problemCode: {
              language: "text",
              filename: "classify-scenarios.txt",
              code: [
                "1. Um servidor Node.js (thread única) atendendo 1000 conexões simultâneas via Event Loop.",
                "2. Um algoritmo de ordenação que divide o array em 8 partes e ordena cada uma num núcleo diferente.",
                "3. Um navegador rodando o JS da página numa thread e o parsing de uma imagem noutra thread (Web Worker), ambos avançando ao mesmo tempo em núcleos diferentes.",
              ].join("\n"),
            },
            task: "Para cada item, escreva concurrency, parallelism ou ambos, com uma frase de justificativa.",
            hint: "Pergunte: existem várias tarefas em andamento (concurrency)? E, se existem, elas rodam literalmente ao mesmo tempo em núcleos diferentes (parallelism)?",
            solution: {
              code: {
                language: "text",
                filename: "classify-scenarios-solved.txt",
                code: [
                  "1. Concurrency apenas — 1000 conexões \"em andamento\", mas tudo numa única thread, intercalado pelo Event Loop.",
                  "2. Parallelism — uma única tarefa (ordenar) dividida entre núcleos que rodam simultaneamente.",
                  "3. Ambos — duas tarefas concorrentes (JS da página + parsing) rodando literalmente em paralelo, em threads/núcleos diferentes.",
                ].join("\n"),
              },
              explanation: "O item 1 é o caso clássico que confunde: parece \"paralelo\" por atender muita gente ao mesmo tempo, mas é inteiramente concorrência de thread única.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Process",
          requires: ["Memory & Runtime / Memory"],
          revisit: ["Platform / Containers (Container vs VM)"],
          note: "unidade isolada — memória própria",
          summary:
            "Uma instância em execução de um programa, com seu próprio espaço de memória isolado — dois " +
            "processos não podem acessar diretamente a memória um do outro, o que os torna a unidade mais " +
            "básica (e mais isolada) de execução concorrente num sistema operacional.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Process é uma instância em execução de um programa, gerenciada pelo sistema operacional. " +
                "Cada processo recebe seu próprio espaço de memória isolado — variáveis, heap, stack — que " +
                "nenhum outro processo consegue acessar diretamente. Abrir dois programas (ou duas abas de " +
                "navegador, em muitos casos) cria dois processos separados.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Process é uma instância em execução com espaço de memória isolado do sistema operacional — " +
                "o isolamento protege processos uns dos outros, ao custo de mais memória e trocas de contexto " +
                "mais caras do que a alternativa mais leve (Thread).",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Isolamento de memória entre processos é o que impede um programa com bug (ou malicioso) de " +
                "corromper a memória de outro programa rodando ao lado. O sistema operacional paga o custo de " +
                "gerenciar essa separação (mais memória usada, troca de contexto mais cara) em troca de " +
                "segurança e estabilidade: travar um processo normalmente não derruba os outros.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "process-isolation.txt",
              code: [
                "Processo A (navegador, aba 1)     Processo B (navegador, aba 2)",
                "  memória: { conta: 100 }            memória: { conta: 999 }",
                "  ─── isolados: A não enxerga nem consegue alterar a memória de B ───",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Mesmo rodando o mesmo programa (o navegador), cada aba tem seu próprio espaço de memória " +
                "isolado — travar uma aba não corrompe o estado da outra.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o isolamento importa: uma falha ou vazamento de memória num processo não afeta os outros.",
                "Para usar vários núcleos com segurança, como com `child_process` no Node.js.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Criar e trocar de contexto entre processos é mais caro em memória e tempo do que com threads.",
                "Sem memória compartilhada, a comunicação exige um mecanismo explícito, como pipes ou mensagens.",
              ],
            },
          ],
          examples: [
            {
              title: "Um programa, múltiplos processos",
              context: "Navegadores modernos rodam cada aba (ou grupo de abas) em seu próprio processo.",
              code: { language: "text", filename: "browser-processes.txt", code: "chrome.exe\n├── Processo: aba \"gmail.com\" (memória isolada)\n├── Processo: aba \"youtube.com\" (memória isolada)\n└── Processo: extensão de bloqueio de anúncios (memória isolada)" },
              explanation: "Isolar cada aba em seu próprio processo é o motivo pelo qual uma aba travando raramente derruba o navegador inteiro.",
            },
            {
              title: "Comunicação entre processos precisa de mecanismo explícito",
              context: "Como a memória é isolada, dois processos não podem simplesmente compartilhar uma variável.",
              code: { language: "text", filename: "ipc.txt", code: "Processo A quer mandar um dado pro Processo B:\n→ não dá pra só \"ler a variável\" de B — a memória é isolada\n→ precisa de Inter-Process Communication (IPC): pipes, sockets, memória compartilhada explícita, etc." },
              explanation: "O isolamento que protege os processos é o mesmo motivo pelo qual compartilhar dados entre eles exige um mecanismo explícito, mais lento que simplesmente ler uma variável.",
            },
            {
              title: "Custo de criar um processo",
              context: "Duplicar o espaço de memória inteiro tem um custo real.",
              code: { language: "text", filename: "process-cost.txt", code: "Criar um novo Process: o sistema operacional aloca um espaço de memória NOVO e ISOLADO\n(mais lento e mais pesado que criar uma Thread dentro de um processo já existente)." },
              explanation: "Esse custo é exatamente o que motiva a existência de Thread como alternativa mais leve dentro de um mesmo processo.",
            },
            {
              title: "Node.js criando um Process real (child_process)",
              context: "fork() cria um novo Process, com seu próprio espaço de memória isolado.",
              code: {
                language: "javascript",
                filename: "fork-process.js",
                code: ["const { fork } = require(\"node:child_process\");", "const filho = fork(\"tarefa-pesada.js\"); // Process NOVO, memória isolada", "filho.on(\"message\", (resultado) => console.log(resultado));", "filho.send({ tipo: \"iniciar\" }); // comunicação só via mensagens — memória não é compartilhada"].join("\n"),
              },
              explanation: "fork() cria um Process de verdade, não uma Thread — é por isso que a comunicação precisa ser via mensagens (send/on), e não leitura direta de variáveis.",
            },
          ],
          exercise: {
            problem: "Explique por que travar uma aba do navegador normalmente não derruba as outras abas abertas.",
            problemCode: {
              language: "text",
              filename: "why-tabs-survive.txt",
              code: "Cenário: a aba X trava (loop infinito, uso excessivo de memória).\nPergunta: por que as abas Y e Z continuam funcionando normalmente?",
            },
            task: "Escreva 2-3 frases explicando em termos de Process.",
            hint: "Pense em onde vive a memória da aba X, e se as abas Y e Z têm algum acesso a ela.",
            solution: {
              code: {
                language: "text",
                filename: "why-tabs-survive-solved.txt",
                code: [
                  "Cada aba roda em seu próprio Process, com espaço de memória isolado do sistema operacional.",
                  "Quando a aba X trava, o problema fica contido dentro do espaço de memória do Process de X.",
                  "As abas Y e Z rodam em Processes diferentes, que nunca tiveram acesso à memória de X — então",
                  "travar X não corrompe nem afeta a execução delas.",
                ].join("\n"),
              },
              explanation: "Isso é exatamente o isolamento que Process oferece — o custo extra de memória por processo compra essa robustez.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Thread",
          requires: ["Process"],
          revisit: ["Kubernetes"],
          note: "unidade de execução dentro do Process",
          summary:
            "Uma unidade de execução dentro de um Process, que compartilha o mesmo espaço de memória com as " +
            "outras threads daquele processo — mais leve de criar que um Process novo, mas sem o isolamento " +
            "que protegia processos uns dos outros.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Thread é uma unidade de execução dentro de um Process. Um processo pode ter várias threads " +
                "rodando concorrentemente (ou em paralelo, em núcleos diferentes), e todas elas compartilham " +
                "o MESMO espaço de memória do processo — variáveis globais, heap — só a Call Stack e alguns " +
                "registradores são próprios de cada thread.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Thread é uma unidade de execução dentro de um Process, compartilhando memória com as demais " +
                "threads do mesmo processo — mais leve que criar um Process novo, mas o compartilhamento de " +
                "memória é exatamente o que introduz os problemas de concorrência estudados a seguir.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Criar um Process novo é caro (memória isolada nova, troca de contexto pesada). Quando o " +
                "objetivo é só rodar código concorrente dentro do MESMO programa, sem precisar de isolamento " +
                "total, Thread oferece uma unidade mais leve — criar e trocar entre threads custa muito menos " +
                "do que entre processos, exatamente porque elas compartilham memória em vez de duplicá-la.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "threads-share-memory.txt",
              code: [
                "Processo (memória compartilhada: { contador: 0 })",
                "├── Thread 1 (sua própria Call Stack) — pode ler/escrever \"contador\"",
                "└── Thread 2 (sua própria Call Stack) — pode ler/escrever o MESMO \"contador\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Diferente de dois Processes (memória isolada), duas Threads do mesmo Process leem e escrevem " +
                "a mesma variável \"contador\" diretamente — é exatamente esse compartilhamento que abre a " +
                "porta pro problema estudado no próximo Concept (Shared State).",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para dividir uma tarefa em partes que trabalham em paralelo sobre os mesmos dados.",
                "Quando criar um processo novo seria pesado e o compartilhamento de memória é útil.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "A memória compartilhada é a origem das race conditions e dos deadlocks; sem sincronização, o resultado é " +
                "imprevisível.",
                "Em JavaScript, seu código roda numa única thread; a paralelização real exige Workers, que se comunicam por " +
                "mensagens.",
              ],
            },
          ],
          examples: [
            {
              title: "Múltiplas threads, uma tarefa dividida",
              context: "Processar 4 partes de uma imagem em paralelo, dentro do mesmo programa.",
              code: { language: "text", filename: "image-processing.txt", code: "Processo \"editor de imagem\"\n├── Thread 1: processa quadrante superior-esquerdo\n├── Thread 2: processa quadrante superior-direito\n├── Thread 3: processa quadrante inferior-esquerdo\n└── Thread 4: processa quadrante inferior-direito\n(todas compartilham acesso à mesma imagem na memória)" },
              explanation: "Dividir o trabalho em threads do mesmo processo evita duplicar a imagem inteira na memória de processos separados.",
            },
            {
              title: "Custo de criação: Thread vs Process",
              context: "A diferença de custo é ordens de grandeza.",
              code: { language: "text", filename: "cost-comparison.txt", code: "Criar um Process novo:  aloca espaço de memória isolado inteiro — mais lento\nCriar uma Thread nova:   reaproveita a memória do Process existente — muito mais rápido" },
              explanation: "Essa diferença de custo é o motivo prático pelo qual servidores e aplicações que precisam de muita concorrência preferem threads a processos, quando possível.",
            },
            {
              title: "JavaScript e threads",
              context: "O modelo do JS evita esse problema por padrão, no código \"comum\".",
              code: {
                language: "javascript",
                filename: "worker-thread.js",
                code: ["const { Worker } = require(\"node:worker_threads\");", "const worker = new Worker(\"tarefa-pesada.js\"); // Thread nova, mesmo Process", "worker.on(\"message\", (resultado) => console.log(resultado));", "// por padrão, NÃO compartilha memória mutável — comunica por mensagens, como um Process"].join("\n"),
              },
              explanation: "É por isso que os problemas deste módulo (Race Condition, Deadlock) são mais um tema de outras linguagens/runtimes multi-thread do que do JavaScript do dia a dia — mesmo worker_threads não compartilhando memória mutável por padrão, exceto com SharedArrayBuffer + Atomics.",
            },
          ],
          exercise: {
            problem: "Explique a diferença de custo entre criar um novo Process e criar uma nova Thread, em termos de memória.",
            problemCode: {
              language: "text",
              filename: "cost-question.txt",
              code: "Um servidor precisa atender 1000 requisições concorrentes.\nOpção A: um Process novo por requisição.\nOpção B: uma Thread nova (do mesmo Process) por requisição.",
            },
            task: "Escreva 2-3 frases comparando as duas opções, focando em memória.",
            hint: "Pense no que cada Process precisa duplicar, versus o que uma Thread reaproveita do processo existente.",
            solution: {
              code: {
                language: "text",
                filename: "cost-question-solved.txt",
                code: [
                  "Opção A (1000 Processes) duplicaria o espaço de memória isolado 1000 vezes — extremamente",
                  "pesado, provavelmente inviável de memória.",
                  "Opção B (1000 Threads) reaproveita o MESMO espaço de memória do Process para todas as 1000",
                  "unidades de execução — cada Thread só adiciona sua própria Call Stack, muito mais leve.",
                  "É por isso que servidores de alta concorrência preferem threads (ou modelos ainda mais",
                  "leves, como o Event Loop) a um processo por requisição.",
                ].join("\n"),
              },
              explanation: "O compartilhamento de memória entre threads é ao mesmo tempo a fonte da economia de recursos e a fonte dos problemas estudados a seguir no módulo.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Shared State",
          requires: ["Thread", "Functional Programming / Immutability"],
          note: "contraste: dado imutável = sem o problema",
          revisit: ["Architecture & System Design / Scalability / Statelessness"],
          summary:
            "Dado em memória que mais de uma thread (ou execução concorrente) pode ler e escrever — a " +
            "pré-condição necessária para todos os problemas de concorrência estudados a seguir; dado " +
            "imutável, por definição, nunca é um problema aqui.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Shared State é qualquer dado em memória acessível por mais de uma thread (ou mais de uma " +
                "execução concorrente) ao mesmo tempo, onde pelo menos uma delas pode escrever nele. Uma " +
                "variável global, um objeto no heap referenciado por duas threads, um arquivo que dois " +
                "processos escrevem — todos são Shared State.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Shared State é dado mutável acessível por mais de uma execução concorrente — a pré-condição " +
                "necessária para Race Condition e os demais problemas do módulo; dado imutável nunca é Shared " +
                "State problemático, porque nada nele muda para haver conflito.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Threads compartilham memória por definição (é o que as diferencia de Process) — Shared State " +
                "não é opcional, é uma consequência direta disso. O nome importa porque é exatamente a " +
                "PRESENÇA de estado compartilhado e mutável que abre a porta para Race Condition, Deadlock e " +
                "todos os outros problemas deste módulo. Dado imutável (Immutability), por contraste, pode " +
                "ser lido por quantas threads quiserem ao mesmo tempo sem nenhum desses problemas — porque " +
                "ninguém escreve nele.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "shared-state.txt",
              code: [
                "let saldo = 100; // Shared State — mutável e acessível por múltiplas threads",
                "",
                "Thread A: lê saldo (100), soma 50, escreve 150",
                "Thread B: lê saldo (100), subtrai 30, escreve 70",
                "// dependendo da ORDEM em que essas leituras/escritas intercalam, o resultado final varia",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "\"saldo\" é o Shared State. O problema não é a variável em si — é que duas execuções podem " +
                "ler e escrever nela sem coordenação, produzindo resultados que dependem de timing, não da " +
                "lógica do programa.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Só é problema se for mutável: dado imutável pode ser compartilhado livremente, porque nada nele muda.",
                "Um contador global e um cache compartilhado parecem inofensivos, mas qualquer escrita concorrente precisa " +
                "de proteção.",
                "Imutabilidade elimina o problema, mas mudanças ainda precisam ser publicadas, e a troca da referência é um " +
                "ponto de atenção.",
              ],
            },
          ],
          examples: [
            {
              title: "Shared State clássico: contador global",
              context: "Uma variável mutável, lida e escrita por várias execuções.",
              code: { language: "text", filename: "shared-counter.txt", code: "let contador = 0; // Shared State\n// qualquer thread pode fazer: contador = contador + 1" },
              explanation: "Mesmo essa operação aparentemente simples esconde um problema, explorado no próximo Concept (Race Condition).",
            },
            {
              title: "Sem Shared State — dados isolados por thread",
              context: "Quando cada thread tem sua própria cópia, não há nada pra compartilhar.",
              code: { language: "text", filename: "no-shared-state.txt", code: "Thread A: contadorLocal = 0 (só de A)\nThread B: contadorLocal = 0 (só de B)\n// nenhuma das duas consegue ver ou alterar a variável da outra — zero conflito possível" },
              explanation: "Sem compartilhamento, não existe Race Condition — a ausência de Shared State é uma forma de evitar o problema pela raiz, não só de resolvê-lo com locks.",
            },
            {
              title: "Imutabilidade elimina o problema, não só o esconde",
              context: "Dado congelado pode ser lido por quantas threads quiserem, sem coordenação.",
              code: { language: "javascript", filename: "immutable-shared.js", code: "const config = Object.freeze({ modo: \"produção\" }); // Shared, mas IMUTÁVEL\n// qualquer número de threads pode LER config ao mesmo tempo, sem nenhum risco —\n// não existe \"escrita concorrente\" pra coordenar, porque ninguém escreve" },
              explanation: "Isso é o motivo pelo qual Immutability é uma das ferramentas mais eficazes contra bugs de concorrência: elimina a pré-condição do problema, em vez de gerenciá-lo com locks.",
            },
          ],
          exercise: {
            problem: "Para cada situação abaixo, diga se ela envolve Shared State problemático (mutável + compartilhado) ou não.",
            problemCode: {
              language: "text",
              filename: "classify-shared-state.txt",
              code: [
                "1. Duas threads leem (só leem) a mesma constante de configuração.",
                "2. Duas threads incrementam a mesma variável 'contador'.",
                "3. Cada thread tem sua própria cópia local de 'total', somada no final por uma única thread.",
                "4. Duas threads escrevem em posições DIFERENTES do mesmo array.",
              ].join("\n"),
            },
            task: "Classifique cada item e justifique em uma frase.",
            hint: "A pergunta chave é sempre: existe escrita, e mais de uma execução pode fazer essa escrita concorrentemente sobre o MESMO dado?",
            solution: {
              code: {
                language: "text",
                filename: "classify-shared-state-solved.txt",
                code: [
                  "1. Não problemático — só leitura, sem escrita concorrente.",
                  "2. Problemático — escrita concorrente sobre o mesmo dado mutável (Race Condition clássica).",
                  "3. Não problemático DURANTE a soma parcial (cada thread só mexe na sua própria cópia); a",
                  "   combinação final precisa de coordenação, mas o padrão evita o problema na maior parte do trabalho.",
                  "4. Depende — tecnicamente ainda é o mesmo array, mas se as posições nunca se sobrepõem,",
                  "   não há conflito real de dados (embora alguns runtimes ainda exijam cuidado de baixo nível aqui).",
                ].join("\n"),
              },
              explanation: "O item 3 ilustra uma estratégia comum: minimizar Shared State dividindo o trabalho em partes independentes e só combinando os resultados no final.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Race Condition",
          requires: ["Shared State"],
          revisit: ["Platform / Database Transactions"],
          note: "o resultado depende da ordem de execução",
          summary:
            "Um bug onde o resultado final depende da ordem (imprevisível) em que operações concorrentes " +
            "acessam o mesmo Shared State — o mesmo código pode produzir resultados diferentes em execuções " +
            "diferentes, dependendo só de timing.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Race Condition é quando o resultado final de um programa depende da ordem em que operações " +
                "concorrentes sobre o mesmo Shared State acontecem — e essa ordem não é garantida, podendo " +
                "variar entre execuções. O nome vem de threads \"competindo\" (racing) pra ler/escrever o " +
                "mesmo dado primeiro.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Race Condition é quando o resultado depende da ordem imprevisível de acesso a Shared State — " +
                "operações que parecem atômicas (como incrementar) na verdade têm vários passos, e intercalar " +
                "esses passos entre execuções concorrentes pode perder atualizações silenciosamente.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Uma operação aparentemente simples como \"incrementar um contador\" (contador = contador + 1) " +
                "na verdade acontece em passos: ler o valor atual, somar 1, escrever o novo valor. Se duas " +
                "threads fazem isso ao mesmo tempo sobre o mesmo Shared State, os passos podem intercalar de " +
                "formas que perdem uma das atualizações — sem nenhum erro visível, sem exceção, só um " +
                "resultado numericamente errado.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "race-condition.txt",
              code: [
                "contador = 0",
                "",
                "Thread A: lê contador (0)",
                "Thread B: lê contador (0)     ← as duas leram o MESMO valor antigo",
                "Thread A: escreve contador = 0 + 1 = 1",
                "Thread B: escreve contador = 0 + 1 = 1     ← sobrescreve o resultado de A",
                "",
                "Resultado final: contador = 1 (deveria ser 2 — um incremento se perdeu)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As duas threads fizeram exatamente o que o código dizia — o bug não está numa linha " +
                "específica, está na FALTA de coordenação entre os três passos (ler, somar, escrever) de cada uma.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Operações que parecem de um passo, como `count++`, têm vários passos (ler, somar, gravar), e intercalá-los " +
                "perde atualizações.",
                "Também ocorrem em JavaScript sem threads, quando um `await` entre ler e gravar deixa outra tarefa alterar o " +
                "estado.",
                "O bug é intermitente e depende de timing, por isso é difícil de reproduzir; um teste que passa não prova " +
                "que não existe.",
              ],
            },
          ],
          examples: [
            {
              title: "Race condition clássica: saldo bancário",
              context: "Duas operações de saque concorrentes sobre a mesma conta.",
              code: { language: "text", filename: "bank-race.txt", code: "saldo = 100\nThread A (saque de 80): lê saldo (100) → 100 >= 80? sim → escreve saldo = 20\nThread B (saque de 80): lê saldo (100) → 100 >= 80? sim → escreve saldo = 20\n// as duas leram o saldo ANTES de qualquer uma escrever — os dois saques \"passaram\",\n// mesmo a conta só tendo 100 pra cobrir um saque de 80" },
              explanation: "Esse é o exemplo canônico de por que sistemas financeiros precisam de mecanismos de coordenação (Mutex, ou transações no banco de dados) sobre Shared State.",
            },
            {
              title: "Race condition em JavaScript assíncrono (sem threads reais)",
              context: "Mesmo sem threads, código async pode intercalar sobre o mesmo estado.",
              code: {
                language: "javascript",
                filename: "async-race.js",
                code: [
                  "let saldo = 100;",
                  "async function sacar(valor) {",
                  "  const atual = saldo; // lê",
                  "  await verificarFraude(); // pausa aqui — outra chamada de sacar() pode intercalar",
                  "  saldo = atual - valor; // escreve, baseado no valor lido ANTES da pausa",
                  "}",
                  "sacar(80);",
                  "sacar(80); // se as duas leem \"100\" antes de qualquer uma escrever, mesmo bug do exemplo anterior",
                ].join("\n"),
              },
              explanation: "Race conditions não são exclusivas de threads reais — qualquer ponto de pausa (await) entre ler e escrever Shared State abre a mesma janela de risco.",
            },
            {
              title: "Corrigindo com uma operação atômica",
              context: "Combinar ler+escrever num único passo indivisível elimina a janela do problema.",
              code: { language: "text", filename: "atomic-fix.txt", code: "Em vez de: ler contador, somar, escrever (3 passos, intercaláveis)\nUsar uma operação ATÔMICA de incremento: incrementar(contador) — um único passo indivisível,\nsem janela onde outra thread possa intercalar" },
              explanation: "Isso antecipa o próximo Concept (Atomic Operation) — a correção fundamental para Race Condition é eliminar a janela de tempo entre ler e escrever.",
            },
          ],
          exercise: {
            problem: "O código abaixo tem uma Race Condition — duas chamadas concorrentes de reservarAssento podem, em teoria, reservar o mesmo assento duas vezes.",
            problemCode: {
              language: "text",
              filename: "seat-race.txt",
              code: [
                "assentosLivres = { \"A1\": true }",
                "",
                "função reservarAssento(id):",
                "  se assentosLivres[id] == true:",
                "    // ← JANELA: outra chamada pode passar por aqui antes da escrita abaixo",
                "    assentosLivres[id] = false",
                "    retorna \"reservado com sucesso\"",
                "  senão:",
                "    retorna \"assento já ocupado\"",
              ].join("\n"),
            },
            task: "Identifique exatamente ONDE está a janela de Race Condition, e explique o cenário de falha com duas chamadas concorrentes.",
            hint: "A janela está entre o momento em que a condição é checada e o momento em que o valor é escrito.",
            solution: {
              code: {
                language: "text",
                filename: "seat-race-solved.txt",
                code: [
                  "A janela é entre \"se assentosLivres[id] == true\" e \"assentosLivres[id] = false\".",
                  "",
                  "Cenário de falha:",
                  "Chamada A: checa assentosLivres[\"A1\"] == true → sim",
                  "Chamada B: checa assentosLivres[\"A1\"] == true → AINDA sim, porque A ainda não escreveu",
                  "Chamada A: escreve assentosLivres[\"A1\"] = false, retorna sucesso",
                  "Chamada B: escreve assentosLivres[\"A1\"] = false, retorna sucesso TAMBÉM",
                  "",
                  "As duas chamadas 'reservaram com sucesso' o mesmo assento — a checagem e a escrita",
                  "precisariam ser uma única operação atômica (ou protegidas por um Mutex) pra evitar isso.",
                ].join("\n"),
              },
              explanation: "Esse padrão (\"check-then-act\") é uma das fontes mais comuns de Race Condition em sistemas reais — de reserva de assentos a controle de estoque.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Critical Section",
          requires: ["Race Condition"],
          note: "o trecho que precisa de acesso exclusivo",
          summary:
            "O trecho de código que acessa Shared State e que, por isso, não pode ser executado por mais de " +
            "uma thread ao mesmo tempo — nomear essa seção é o primeiro passo antes de protegê-la com algum " +
            "mecanismo de exclusão mútua.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Critical Section é o trecho específico de código que lê e/ou escreve Shared State de uma " +
                "forma que precisa de acesso exclusivo — só uma thread pode estar executando aquele trecho " +
                "por vez, ou uma Race Condition pode acontecer.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Critical Section é o trecho de código que acessa Shared State de forma que exige exclusão " +
                "mútua — identificar exatamente esse trecho (e só ele) é o que permite proteger o mínimo " +
                "necessário, em vez de serializar o programa inteiro.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nem todo o código de uma thread precisa de proteção — só a parte que realmente toca Shared " +
                "State de forma insegura. Nomear essa parte especificamente (em vez de proteger o programa " +
                "inteiro) é o que permite otimizar: proteger só o mínimo necessário, deixando o resto do " +
                "código rodar livremente e concorrente. É também o vocabulário necessário antes de introduzir " +
                "as ferramentas que fazem essa proteção (Mutex, Semaphore).",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "critical-section.txt",
              code: [
                "função sacar(valor):",
                "  registrarLog(\"tentativa de saque\")   // fora da Critical Section — não toca Shared State",
                "  // ─── Critical Section começa ───",
                "  se saldo >= valor:",
                "    saldo = saldo - valor",
                "  // ─── Critical Section termina ───",
                "  registrarLog(\"saque processado\")     // fora de novo",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Só as duas linhas que leem e escrevem \"saldo\" precisam de exclusão mútua — os registrarLog " +
                "podem continuar rodando concorrentemente sem risco, porque não tocam Shared State.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma seção crítica grande demais serializa o programa e perde o ganho da concorrência; proteja só o trecho " +
                "que acessa o estado compartilhado.",
                "Uma seção pequena demais, que deixa parte das operações de fora, mantém a race condition.",
                "Identificar a seção crítica vem antes de escolher o mecanismo, seja um mutex ou uma operação atômica.",
              ],
            },
          ],
          examples: [
            {
              title: "Critical Section mínima vs. exagerada",
              context: "Proteger mais do que o necessário mata a concorrência à toa.",
              code: {
                language: "text",
                filename: "minimal-vs-excessive.txt",
                code: [
                  "Exagerada (toda a função é Critical Section):",
                  "  [buscarDadosDoDisco(); calcularAlgoLento(); saldo -= valor;]  ← tudo serializado, mesmo o que não precisa",
                  "",
                  "Mínima (só o que toca Shared State):",
                  "  buscarDadosDoDisco(); calcularAlgoLento();",
                  "  [saldo -= valor;]  ← só isso precisa de exclusão mútua",
                ].join("\n"),
              },
              explanation: "Uma Critical Section maior que o necessário é um erro comum de performance — ela serializa trabalho que poderia rodar concorrentemente sem risco algum.",
            },
            {
              title: "Múltiplas Critical Sections independentes",
              context: "Seções que tocam Shared State diferente não competem entre si.",
              code: { language: "text", filename: "independent-sections.txt", code: "// Critical Section A protege \"saldoContaX\"\n// Critical Section B protege \"saldoContaY\"\n// threads podem executar A e B AO MESMO TEMPO — são dados diferentes, sem conflito" },
              explanation: "Nomear a Critical Section com precisão (por dado, não por função inteira) permite paralelismo real entre seções que não compartilham o mesmo Shared State.",
            },
            {
              title: "Sem proteção nenhuma — a Critical Section \"nua\"",
              context: "Antes de aplicar qualquer mecanismo, a Critical Section ainda é vulnerável.",
              code: {
                language: "javascript",
                filename: "unprotected.js",
                code: ["function sacar(valor) {", "  // Critical Section identificada, mas SEM Mutex/Semaphore aplicado ainda:", "  if (saldo >= valor) saldo = saldo - valor; // ainda pode ter Race Condition", "}"].join("\n"),
              },
              explanation: "Identificar a Critical Section é o passo 1; os próximos Concepts (Atomic Operation, Mutex) são as ferramentas que efetivamente a protegem.",
            },
          ],
          exercise: {
            problem: "Na função abaixo, identifique exatamente quais linhas formam a Critical Section (e quais não precisam de proteção).",
            problemCode: {
              language: "text",
              filename: "identify-critical-section.txt",
              code: [
                "função processarPedido(pedido):",
                "  validarPedido(pedido)              // linha 1",
                "  logAuditoria(\"processando\", pedido) // linha 2",
                "  estoque[pedido.item] -= pedido.qtd  // linha 3 — toca Shared State",
                "  enviarEmailConfirmacao(pedido)      // linha 4",
              ].join("\n"),
            },
            task: "Diga qual(is) linha(s) formam a Critical Section e justifique por que as outras ficam de fora.",
            hint: "Pergunte, linha por linha: essa linha lê ou escreve algum dado que outra execução concorrente também poderia estar lendo/escrevendo?",
            solution: {
              code: {
                language: "text",
                filename: "identify-critical-section-solved.txt",
                code: [
                  "Critical Section: só a linha 3 (estoque[pedido.item] -= pedido.qtd).",
                  "",
                  "Linhas 1, 2 e 4 não tocam Shared State compartilhado entre execuções concorrentes",
                  "(validação e log usam só o 'pedido' local; email é uma ação externa, sem estado mutável",
                  "compartilhado) — podem rodar livremente em paralelo entre pedidos diferentes.",
                  "Só a linha 3 precisa de exclusão mútua, porque dois pedidos concorrentes do MESMO item",
                  "podem entrar em Race Condition sobre a mesma posição de 'estoque'.",
                ].join("\n"),
              },
              explanation: "Isolar a Critical Section a uma única linha é o cenário ideal — o resto da função continua totalmente concorrente, sem custo de sincronização.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Atomic Operation",
          requires: ["Race Condition"],
          collision: "≠ ACID Atomicity (Platform) — escopo diferente",
          note: "indivisível — sem janela para intercalar",
          summary:
            "Uma operação que executa como um único passo indivisível, sem nenhuma janela onde outra " +
            "execução concorrente possa intercalar — a forma mais direta de eliminar uma Race Condition, " +
            "quando disponível.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Atomic Operation é uma operação que, do ponto de vista de qualquer outra thread observando, " +
                "acontece de uma vez só — ou ela ainda não começou, ou ela já terminou completamente, nunca " +
                "\"pela metade\". Não existe janela de tempo onde outra execução possa ler um estado " +
                "intermediário ou intercalar sua própria escrita no meio.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Atomic Operation executa como um único passo indivisível, sem janela pra intercalar — quando " +
                "disponível (tipicamente para operações simples, suportadas pelo hardware), elimina Race " +
                "Condition sem precisar de um lock explícito como Mutex.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A Race Condition do contador acontecia porque \"incrementar\" na verdade eram 3 passos " +
                "separados (ler, somar, escrever), com uma janela entre eles. Se o hardware ou o runtime " +
                "oferece uma operação de incremento ATÔMICA — os 3 passos acontecem como se fossem 1, sem " +
                "possibilidade de intercalar — a Race Condition desaparece sem precisar de um Mutex explícito. " +
                "Nem toda operação pode ser atômica (operações complexas geralmente não), mas operações " +
                "simples (incrementar, comparar-e-trocar) frequentemente têm versões atômicas no hardware.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "atomic-operation.txt",
              code: [
                "Não-atômico (3 passos, janela entre eles):",
                "  ler contador → somar 1 → escrever contador     ← outra thread pode intercalar aqui",
                "",
                "Atômico (1 passo indivisível):",
                "  incrementarAtomicamente(contador)     ← nenhuma thread consegue ver um estado \"pela metade\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Com a versão atômica, duas threads chamando incrementarAtomicamente(contador) ao mesmo tempo " +
                "sempre resultam no valor correto — não existe intercalação possível, porque a operação " +
                "inteira é tratada como uma unidade única pelo hardware.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para operações simples sobre um único valor, como incrementar um contador, sem precisar de um lock.",
                "Com compare-and-swap, a base de muitas estruturas sem lock.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Nem tudo pode ser atômico: operações com vários passos ou variáveis precisam de um mutex.",
                "Em JavaScript, `Atomics` só funciona sobre `SharedArrayBuffer`, e não sobre objetos comuns.",
              ],
            },
          ],
          examples: [
            {
              title: "Compare-and-swap, o primitivo por trás de muitas estruturas lock-free",
              context: "Uma operação atômica mais poderosa que incremento simples.",
              code: { language: "text", filename: "compare-and-swap.txt", code: "compareAndSwap(endereco, valorEsperado, novoValor):\n  atomicamente:\n    se *endereco == valorEsperado:\n      *endereco = novoValor\n      retorna sucesso\n    senão:\n      retorna falha (outra thread mudou o valor primeiro)" },
              explanation: "Compare-and-swap é atômico e permite implementar contadores, filas e outras estruturas que funcionam corretamente sob concorrência sem precisar de um Mutex tradicional.",
            },
            {
              title: "JavaScript: Atomics sobre SharedArrayBuffer",
              context: "O mecanismo real de operações atômicas em JS multi-thread.",
              code: { language: "javascript", filename: "js-atomics.js", code: ["const buffer = new SharedArrayBuffer(4);", "const view = new Int32Array(buffer);", "Atomics.add(view, 0, 1); // incremento atômico — seguro mesmo com Web Workers concorrentes"].join("\n") },
              explanation: "Atomics.add garante que o incremento aconteça como uma única operação indivisível, mesmo que múltiplos Web Workers compartilhem o mesmo SharedArrayBuffer.",
            },
            {
              title: "Nem tudo pode ser atômico",
              context: "Operações compostas (múltiplas variáveis) geralmente exigem um lock, não um átomo.",
              code: { language: "text", filename: "cannot-be-atomic.txt", code: "transferir(contaA, contaB, valor):\n  contaA.saldo -= valor   // duas variáveis diferentes —\n  contaB.saldo += valor  // não existe uma instrução de hardware que faça as duas de uma vez\n// aqui a ferramenta certa não é Atomic Operation, é Mutex" },
              explanation: "Isso antecipa por que Mutex é necessário para além do Atomic Operation: quando a Critical Section envolve mais de uma variável, uma operação atômica única geralmente não existe.",
            },
          ],
          exercise: {
            problem: "Para cada operação abaixo, diga se ela é candidata natural a uma versão atômica simples, ou se precisa de um Mutex por envolver múltiplos passos/variáveis.",
            problemCode: {
              language: "text",
              filename: "atomic-candidates.txt",
              code: [
                "1. incrementar um contador em 1.",
                "2. mover 'valor' de contaA.saldo para contaB.saldo.",
                "3. marcar um único booleano 'processado' como true.",
                "4. ler o valor de um array numa posição e escrever numa posição DIFERENTE, com base no valor lido.",
              ].join("\n"),
            },
            task: "Classifique cada item e justifique brevemente.",
            hint: "Uma operação é boa candidata a Atomic quando toca UMA única posição de memória, de forma simples (soma, troca, comparação).",
            solution: {
              code: {
                language: "text",
                filename: "atomic-candidates-solved.txt",
                code: [
                  "1. Atômica — incremento de uma única posição é o exemplo canônico (Atomics.add).",
                  "2. Precisa de Mutex — envolve duas variáveis diferentes (contaA e contaB), sem instrução única.",
                  "3. Atômica — escrever um valor fixo numa única posição é uma operação simples e atômica.",
                  "4. Precisa de Mutex — envolve ler e escrever posições diferentes, com lógica entre os dois passos.",
                ].join("\n"),
              },
              explanation: "A regra prática é: uma posição de memória, uma operação simples → geralmente atômica; múltiplas posições ou lógica composta → geralmente precisa de Mutex.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Mutex",
          requires: ["Critical Section"],
          note: "lock de exclusão mútua — só um de cada vez",
          summary:
            "Um lock que garante que só uma thread por vez execute uma Critical Section — qualquer outra " +
            "thread que tente entrar precisa esperar até a primeira liberar o lock, o mecanismo mais " +
            "direto de exclusão mútua.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Mutex (de \"mutual exclusion\") é um mecanismo de lock: antes de entrar numa Critical " +
                "Section, uma thread precisa \"adquirir\" o mutex; se outra thread já o adquiriu, a que chegou " +
                "depois espera (bloqueada) até o mutex ser liberado. Só uma thread por vez consegue segurar o " +
                "mutex — daí o nome, exclusão mútua.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Mutex é um lock que garante exclusão mútua sobre uma Critical Section — só uma thread " +
                "executa o trecho protegido por vez, e qualquer outra espera até o mutex ser liberado, mesmo " +
                "quando a Critical Section tem múltiplos passos ou variáveis.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando uma Critical Section envolve mais de uma operação (múltiplos passos, múltiplas " +
                "variáveis), uma Atomic Operation simples não resolve — é preciso garantir que TODA a " +
                "sequência de passos aconteça sem interrupção de outra thread. Mutex resolve isso ao nível " +
                "de código: em vez de depender de uma instrução atômica de hardware, ele serializa o acesso à " +
                "Critical Section inteira, não importa quantos passos ela tenha.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "mutex.txt",
              code: [
                "mutex = novo Mutex()",
                "",
                "função transferir(contaA, contaB, valor):",
                "  mutex.adquirir()          // espera aqui se outra thread já segura o mutex",
                "  contaA.saldo -= valor",
                "  contaB.saldo += valor",
                "  mutex.liberar()           // libera — a próxima thread esperando pode entrar",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Enquanto uma thread segura o mutex dentro de transferir, qualquer outra thread chamando " +
                "transferir fica bloqueada em mutex.adquirir() até a primeira terminar e liberar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para proteger uma seção crítica com vários passos ou variáveis, que uma operação atômica não cobre.",
                "Com um mutex por recurso, e não um único lock global.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Esquecer de liberar o mutex, por exemplo numa exceção, trava as outras threads para sempre; libere sempre " +
                "num `finally`.",
                "Vários mutexes adquiridos em ordens diferentes causam deadlock.",
                "Cada espera por lock reduz o paralelismo; mantenha a seção protegida a menor possível.",
              ],
            },
          ],
          examples: [
            {
              title: "Sem Mutex — a Race Condition volta",
              context: "Contraste direto: a mesma transferência, sem proteção.",
              code: { language: "text", filename: "no-mutex.txt", code: "função transferir(contaA, contaB, valor):\n  contaA.saldo -= valor\n  contaB.saldo += valor\n// sem mutex, duas transferências concorrentes envolvendo as mesmas contas\n// podem intercalar os passos de formas que corrompem o saldo total" },
              explanation: "Esse é exatamente o cenário que Atomic Operation não resolve (múltiplas variáveis) e que motiva o Mutex.",
            },
            {
              title: "Esquecer de liberar o mutex — o perigo mais comum",
              context: "Um mutex nunca liberado trava todas as outras threads para sempre.",
              code: { language: "text", filename: "forgot-unlock.txt", code: "mutex.adquirir()\nse condicao:\n  retorna erro  // ← esqueceu de chamar mutex.liberar() antes de sair!\nmutex.liberar()\n// qualquer thread esperando esse mutex fica bloqueada PARA SEMPRE" },
              explanation: "Esse bug motiva padrões de linguagem que liberam o mutex automaticamente (blocos with/using, try/finally) — liberar manualmente é fácil de esquecer num caminho de erro.",
            },
            {
              title: "Um Mutex por recurso, não um único Mutex global",
              context: "Um mutex global demais mata concorrência que poderia ser segura.",
              code: {
                language: "javascript",
                filename: "granular-mutex.js",
                code: ["const mutexContaA = new Mutex(); // protege só contaA", "const mutexContaB = new Mutex(); // protege só contaB", "// transferências envolvendo contas DIFERENTES podem rodar em paralelo,", "// cada uma segurando só o mutex da conta que está tocando"].join("\n"),
              },
              explanation: "Granularidade do lock é um trade-off real: um mutex por recurso permite mais concorrência, mas exige mais cuidado para evitar Deadlock (próximo tema do módulo).",
            },
          ],
          exercise: {
            problem: "O código abaixo tem um bug: em um dos caminhos, o mutex nunca é liberado.",
            problemCode: {
              language: "text",
              filename: "mutex-bug.txt",
              code: [
                "função sacar(conta, valor):",
                "  mutex.adquirir()",
                "  se conta.saldo < valor:",
                "    retorna \"saldo insuficiente\"",
                "  conta.saldo -= valor",
                "  mutex.liberar()",
                "  retorna \"sucesso\"",
              ].join("\n"),
            },
            task: "Identifique o caminho onde o mutex fica preso e corrija.",
            hint: "Rastreie o caminho do 'retorna \"saldo insuficiente\"' — ele passa pelo mutex.liberar()?",
            solution: {
              code: {
                language: "text",
                filename: "mutex-bug-fixed.txt",
                code: [
                  "função sacar(conta, valor):",
                  "  mutex.adquirir()",
                  "  se conta.saldo < valor:",
                  "    mutex.liberar()          // ← faltava aqui",
                  "    retorna \"saldo insuficiente\"",
                  "  conta.saldo -= valor",
                  "  mutex.liberar()",
                  "  retorna \"sucesso\"",
                ].join("\n"),
              },
              explanation: "O caminho de 'saldo insuficiente' retornava sem liberar o mutex, deixando qualquer outra thread esperando por ele bloqueada para sempre — um bug clássico de gerenciamento manual de lock.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Semaphore",
          requires: ["Mutex"],
          note: "generaliza Mutex — permite N acessos, não só 1",
          summary:
            "Um contador que controla quantas threads podem acessar um recurso ao mesmo tempo — generaliza " +
            "Mutex (que permite exatamente 1) para permitir N acessos concorrentes, útil para limitar uso de " +
            "recursos como conexões ou slots de processamento.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Semaphore mantém um contador interno: cada thread que quer acessar o recurso protegido " +
                "decrementa o contador (e espera se ele chegar a zero); ao terminar, incrementa de volta. Um " +
                "Mutex é, na prática, um Semaphore binário — um contador que só pode ser 0 ou 1 (só uma " +
                "thread por vez). Um Semaphore com contador inicial N permite até N threads acessando " +
                "simultaneamente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Semaphore é um contador que limita quantas threads acessam um recurso concorrentemente — " +
                "generaliza Mutex (que é o caso especial de limite 1) para permitir N acessos simultâneos, " +
                "útil pra controlar uso de recursos limitados como conexões ou slots de processamento.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Mutex resolve \"só um de cada vez\", mas muitos cenários reais têm um limite maior que 1: um " +
                "pool de 10 conexões de banco de dados, 5 slots de processamento pesado disponíveis. " +
                "Semaphore generaliza a ideia de Mutex para expressar exatamente esse limite — permitir " +
                "concorrência controlada, não zero concorrência.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "semaphore.txt",
              code: [
                "semaphore = novo Semaphore(3)  // permite até 3 acessos simultâneos",
                "",
                "função processarImagem(img):",
                "  semaphore.adquirir()   // decrementa; espera se já tiver 3 threads dentro",
                "  fazerProcessamentoPesado(img)",
                "  semaphore.liberar()    // incrementa de volta; libera espaço pra próxima thread esperando",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Até 3 chamadas de processarImagem podem estar rodando ao mesmo tempo; a 4ª chamada espera " +
                "em semaphore.adquirir() até uma das 3 primeiras liberar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para limitar o uso de um recurso escasso, como conexões de banco ou chamadas de rede simultâneas.",
                "Quando até N acessos ao mesmo tempo são seguros, e não apenas um.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não garante exclusão mútua sobre dados: com N maior que 1, várias threads entram juntas; para isso, use um " +
                "mutex.",
                "Sem uma ordem de fila justa, algumas threads podem esperar indefinidamente, o que é starvation.",
              ],
            },
          ],
          examples: [
            {
              title: "Pool de conexões de banco de dados",
              context: "O caso de uso mais comum de Semaphore.",
              code: { language: "text", filename: "connection-pool.txt", code: "semaphoreConexoes = novo Semaphore(10)  // no máximo 10 conexões simultâneas\n// requisição 11 precisa esperar uma das 10 primeiras liberar sua conexão" },
              explanation: "Limitar conexões concorrentes protege o banco de dados de ficar sobrecarregado com mais requisições do que consegue processar bem.",
            },
            {
              title: "Mutex como Semaphore(1)",
              context: "A relação formal entre os dois conceitos.",
              code: { language: "text", filename: "mutex-as-semaphore.txt", code: "mutex = novo Semaphore(1)  // contador máximo 1 → comportamento idêntico a um Mutex\n// Mutex é o nome que damos ao caso especial mais comum de Semaphore" },
              explanation: "Entender Mutex como Semaphore(1) ajuda a perceber que a diferença entre os dois é só o valor do contador — a mecânica de adquirir/esperar/liberar é a mesma.",
            },
            {
              title: "Semaphore controlando concorrência de rede",
              context: "Limitar quantas requisições simultâneas um cliente dispara.",
              code: {
                language: "javascript",
                filename: "fetch-with-limit.js",
                code: ["// pseudocódigo com um Semaphore simplificado em JS", "const semaforo = new Semaphore(5); // no máximo 5 fetch() concorrentes", "async function fetchLimitado(url) {", "  await semaforo.adquirir();", "  try {", "    return await fetch(url);", "  } finally {", "    semaforo.liberar();", "  }", "}"].join("\n"),
              },
              explanation: "Isso evita disparar centenas de requisições simultâneas contra uma API, algo que poderia sobrecarregar o servidor ou estourar limites de rate limiting.",
            },
          ],
          exercise: {
            problem: "Um sistema precisa processar imagens, mas rodar mais de 4 processamentos pesados ao mesmo tempo derruba a performance do servidor.",
            problemCode: {
              language: "text",
              filename: "unlimited-processing.txt",
              code: ["função processarLote(imagens):", "  para cada img em imagens:", "    processarImagem(img)  // roda TODAS ao mesmo tempo, sem limite"].join("\n"),
            },
            task: "Descreva como usar um Semaphore para limitar a 4 processamentos concorrentes, e explique o que acontece com a 5ª imagem.",
            hint: "O Semaphore precisa ser adquirido antes de processarImagem e liberado depois, com um contador inicial de 4.",
            solution: {
              code: {
                language: "text",
                filename: "limited-processing-solved.txt",
                code: [
                  "semaphore = novo Semaphore(4)",
                  "",
                  "função processarLote(imagens):",
                  "  para cada img em imagens (em paralelo):",
                  "    semaphore.adquirir()",
                  "    processarImagem(img)",
                  "    semaphore.liberar()",
                  "",
                  "A 5ª imagem (e qualquer uma além da 4ª) fica esperando em semaphore.adquirir() até uma",
                  "das 4 primeiras terminar e liberar seu espaço — nunca mais de 4 rodam ao mesmo tempo.",
                ].join("\n"),
              },
              explanation: "O Semaphore transforma \"processar tudo de uma vez\" em \"processar até 4 de cada vez\", sem precisar reescrever a lógica de processamento em si.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Deadlock",
          requires: ["Mutex", "Semaphore"],
          revisit: ["Platform / Database Transactions"],
          note: "espera circular — ninguém consegue avançar",
          summary:
            "Uma situação onde duas (ou mais) threads ficam esperando, cada uma, por um lock que a outra " +
            "está segurando — uma espera circular onde nenhuma consegue avançar, e o programa trava " +
            "permanentemente naquele ponto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Deadlock acontece quando duas ou mais threads esperam, cada uma, por um lock (Mutex ou " +
                "Semaphore) que outra já está segurando — formando um ciclo de espera onde ninguém consegue " +
                "avançar. Diferente de um bug que produz resultado errado, Deadlock trava o programa " +
                "completamente naquele ponto, para sempre.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Deadlock é uma espera circular entre threads segurando locks que as outras precisam — o " +
                "programa trava permanentemente naquele ponto; a causa mais comum é adquirir múltiplos locks " +
                "em ordens diferentes entre threads diferentes.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É uma consequência direta de usar múltiplos locks: se uma thread precisa adquirir o Mutex A " +
                "e depois o B, enquanto outra thread precisa adquirir B e depois A, existe a possibilidade de " +
                "cada uma já ter conseguido o primeiro lock e ficar esperando pelo segundo — que a outra está " +
                "segurando. Nenhuma libera o que já tem (porque ainda não terminou), então nenhuma consegue o " +
                "que falta.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "deadlock.txt",
              code: [
                "Thread A: adquire mutexContaX",
                "Thread B: adquire mutexContaY",
                "Thread A: tenta adquirir mutexContaY  → espera (B está segurando)",
                "Thread B: tenta adquirir mutexContaX  → espera (A está segurando)",
                "",
                "// A espera B liberar Y; B espera A liberar X — nenhuma das duas vai liberar. Travado.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Esse cenário clássico acontece quando duas transferências entre as mesmas duas contas rodam " +
                "concorrentemente, cada uma adquirindo os mutexes das contas em ordem OPOSTA.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A causa mais comum é adquirir vários locks em ordens diferentes em threads diferentes; adote uma ordem " +
                "única e consistente.",
                "Envolve duas ou mais threads: um ciclo de espera com três threads também trava tudo.",
                "Quando acontece, o programa para em silêncio, sem erro; timeouts nas esperas ajudam a detectá-lo.",
              ],
            },
          ],
          examples: [
            {
              title: "As 4 condições clássicas do Deadlock",
              context: "Deadlock só acontece quando todas as 4 estão presentes simultaneamente.",
              code: {
                language: "text",
                filename: "four-conditions.txt",
                code: [
                  "1. Exclusão mútua: o recurso só pode ser usado por uma thread por vez (é o que Mutex garante).",
                  "2. Posse e espera: uma thread segura um recurso enquanto espera outro.",
                  "3. Sem preempção: um recurso não pode ser tomado à força de quem o segura.",
                  "4. Espera circular: existe um ciclo de threads esperando recursos umas das outras.",
                ].join("\n"),
              },
              explanation: "Prevenir Deadlock geralmente significa quebrar UMA dessas condições — a mais comum na prática é eliminar a espera circular (condição 4).",
            },
            {
              title: "Prevenindo com ordem consistente de aquisição",
              context: "A correção mais comum para o exemplo do saldo bancário.",
              code: {
                language: "javascript",
                filename: "consistent-order-fix.js",
                code: [
                  "// Em vez de cada thread adquirir na ordem que \"faz sentido pro seu caso\":",
                  "// SEMPRE adquira os mutexes numa ordem fixa (ex.: pelo id da conta, do menor pro maior)",
                  "function transferir(contaA, contaB, valor) {",
                  "  const [primeira, segunda] = ordenarPorId(contaA, contaB);",
                  "  primeira.mutex.adquirir();",
                  "  segunda.mutex.adquirir();",
                  "  // ... transferência ...",
                  "  segunda.mutex.liberar();",
                  "  primeira.mutex.liberar();",
                  "}",
                ].join("\n"),
              },
              explanation: "Se TODAS as threads adquirem locks na mesma ordem relativa, a espera circular (condição 4) nunca se forma — quebra a possibilidade de Deadlock nesse padrão.",
            },
            {
              title: "Deadlock com mais de duas threads",
              context: "O ciclo pode ter qualquer tamanho.",
              code: { language: "text", filename: "three-way-deadlock.txt", code: "Thread A segura X, espera Y\nThread B segura Y, espera Z\nThread C segura Z, espera X\n// ciclo A → B → C → A — nenhuma consegue avançar" },
              explanation: "O ciclo de espera não precisa envolver só duas threads — qualquer número de threads formando um ciclo fechado de espera produz o mesmo travamento.",
            },
          ],
          exercise: {
            problem: "Duas funções de transferência abaixo adquirem mutexes em ordens diferentes, criando risco de Deadlock.",
            problemCode: {
              language: "text",
              filename: "deadlock-risk.txt",
              code: [
                "função transferirXparaY(valor):",
                "  mutexX.adquirir()",
                "  mutexY.adquirir()",
                "  // ...",
                "  mutexY.liberar()",
                "  mutexX.liberar()",
                "",
                "função transferirYparaX(valor):",
                "  mutexY.adquirir()   // ← ordem OPOSTA da função acima",
                "  mutexX.adquirir()",
                "  // ...",
                "  mutexX.liberar()",
                "  mutexY.liberar()",
              ].join("\n"),
            },
            task: "Explique o cenário exato de Deadlock entre as duas funções, e corrija o código.",
            hint: "O problema está na ORDEM de aquisição ser diferente entre as duas funções — a correção é forçar a mesma ordem nas duas.",
            solution: {
              code: {
                language: "text",
                filename: "deadlock-risk-fixed.txt",
                code: [
                  "Cenário de Deadlock: transferirXparaY adquire mutexX e espera mutexY; ao mesmo tempo,",
                  "transferirYparaX adquire mutexY e espera mutexX — espera circular, travado.",
                  "",
                  "Correção: as duas funções devem adquirir os mutexes na MESMA ordem, sempre:",
                  "função transferirYparaX(valor):",
                  "  mutexX.adquirir()   // mesma ordem de transferirXparaY: X primeiro",
                  "  mutexY.adquirir()",
                  "  // ...",
                  "  mutexY.liberar()",
                  "  mutexX.liberar()",
                ].join("\n"),
              },
              explanation: "Forçar uma ordem consistente de aquisição entre TODAS as funções que usam os dois mutexes elimina a possibilidade de espera circular entre elas.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Starvation",
          requires: ["Semaphore", "Deadlock"],
          note: "ensinar em par (falhas de liveness)",
          summary:
            "Uma thread que fica perpetuamente impedida de progredir, não porque está travada num ciclo " +
            "(como Deadlock), mas porque outras threads sempre passam na frente dela — uma falha de " +
            "liveness diferente, mas do mesmo tipo geral (o sistema não avança) que Deadlock.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Starvation é quando uma thread específica nunca consegue avançar — não porque está presa " +
                "num ciclo de espera (isso é Deadlock), mas porque, toda vez que o recurso fica disponível, " +
                "outra thread \"fura a fila\" e consegue primeiro. A thread faminta continua tecnicamente livre " +
                "para tentar de novo, só nunca tem sucesso.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Starvation é quando uma thread nunca consegue avançar porque outras sempre passam na frente " +
                "dela — diferente de Deadlock (ciclo de espera sem saída lógica), mas do mesmo tipo de " +
                "problema: uma falha de liveness, onde o sistema não garante progresso pra todo mundo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Muitos mecanismos de lock não garantem ordem de atendimento (fairness) — quando o recurso " +
                "libera, qualquer thread esperando pode ser a próxima escolhida, sem respeitar quem chegou " +
                "primeiro. Se um scheduler ou algoritmo consistentemente favorece certas threads (por " +
                "prioridade, ou por azar de timing), outra thread pode acabar sempre perdendo a vez — " +
                "starvation é o nome desse padrão de má sorte sistemática.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "starvation.txt",
              code: [
                "Thread de alta prioridade: sempre pega o mutex assim que ele libera",
                "Thread de baixa prioridade: está esperando desde o início, mas NUNCA é escolhida,",
                "                             porque sempre existe uma thread de alta prioridade pedindo",
                "",
                "// a thread de baixa prioridade não está em ciclo (não é Deadlock) — ela simplesmente",
                "// nunca tem sua vez",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A diferença chave para Deadlock: aqui não há espera circular nem impossibilidade lógica de " +
                "avançar — é uma questão de política de agendamento consistentemente injusta.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Não é um ciclo de espera como no deadlock: a thread pode avançar em tese, mas outras sempre passam na " +
                "frente dela.",
                "Prioridade fixa e semáforos sem ordem de fila são causas comuns.",
                "A correção costuma ser fairness, com atendimento em ordem FIFO, ao custo de um pouco de desempenho.",
              ],
            },
          ],
          examples: [
            {
              title: "Starvation por prioridade fixa",
              context: "Um scheduler que sempre favorece threads de alta prioridade.",
              code: { language: "text", filename: "priority-starvation.txt", code: "Scheduler: sempre executa a thread de MAIOR prioridade disponível.\nSe threads de alta prioridade chegam constantemente, uma thread de baixa prioridade\npode esperar indefinidamente, mesmo sem nenhum deadlock." },
              explanation: "Esse é o motivo pelo qual muitos schedulers reais usam \"aging\" — aumentar a prioridade de threads que esperam há muito tempo, pra evitar starvation.",
            },
            {
              title: "Starvation por Semaphore sem ordem de fila",
              context: "Um Semaphore que escolhe threads arbitrariamente ao liberar.",
              code: { language: "text", filename: "semaphore-starvation.txt", code: "semaphore.liberar() → escolhe QUALQUER thread esperando, não necessariamente a mais antiga\n// uma thread pode, por azar, nunca ser a escolhida entre as várias esperando" },
              explanation: "Semaphores/Mutexes \"justos\" (fair) resolvem isso garantindo ordem FIFO entre quem está esperando — a correção comum para starvation nesse cenário.",
            },
            {
              title: "Corrigindo com fairness (ordem FIFO)",
              context: "Garantir que quem chegou primeiro seja atendido primeiro.",
              code: { language: "javascript", filename: "fair-lock.js", code: "const mutexJusto = new Mutex({ fair: true });\n// threads esperando são atendidas na ordem em que pediram o lock,\n// eliminando a possibilidade de uma thread ser sempre preterida" },
              explanation: "A troca é performance (locks justos costumam ter overhead maior) por garantia de progresso — um trade-off explícito entre throughput e fairness.",
            },
          ],
          exercise: {
            problem: "Um sistema de impressão sempre prioriza documentos curtos sobre documentos longos, pra maximizar quantos documentos são impressos por minuto.",
            problemCode: {
              language: "text",
              filename: "printer-starvation.txt",
              code: "Fila de impressão: sempre escolhe o próximo documento MAIS CURTO disponível.\nUm documento de 500 páginas foi enviado há 2 horas e ainda não imprimiu — documentos\ncurtos continuam chegando e sempre furam a fila na frente dele.",
            },
            task: "Explique por que isso é Starvation (não Deadlock), e proponha uma correção.",
            hint: "Pergunte: o documento longo está em algum ciclo de espera impossível, ou só está sendo preterido repetidamente?",
            solution: {
              code: {
                language: "text",
                filename: "printer-starvation-solved.txt",
                code: [
                  "É Starvation, não Deadlock: não existe ciclo de espera nem impossibilidade lógica de o",
                  "documento longo imprimir — ele simplesmente nunca é escolhido, porque a política sempre",
                  "favorece documentos mais curtos que continuam chegando.",
                  "",
                  "Correção: introduzir aging — aumentar a prioridade de um documento quanto mais tempo ele",
                  "espera, até eventualmente ele ficar prioritário mesmo sendo longo. Isso garante que todo",
                  "documento eventualmente progride, ao custo de não ser sempre o mais eficiente no curto prazo.",
                ].join("\n"),
              },
              explanation: "Aging é a correção clássica para starvation em qualquer sistema de agendamento por prioridade — reintroduz fairness sem eliminar a priorização por completo.",
            },
          },
        }),
        concept({
          order: 120,
          title: "Thread Safety",
          requires: ["Mutex", "Atomic Operation", "Functional Programming / Immutability"],
          note: "a síntese da Story",
          summary:
            "A propriedade de um trecho de código se comportar corretamente quando executado por múltiplas " +
            "threads concorrentemente, sem Race Condition, Deadlock ou Starvation — a síntese de todas as " +
            "ferramentas do módulo, combinadas ou usadas conforme o caso.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Thread Safety é a propriedade de um pedaço de código continuar se comportando corretamente " +
                "quando chamado por múltiplas threads ao mesmo tempo — sem produzir resultados errados por " +
                "Race Condition, sem travar por Deadlock, sem deixar nenhuma thread starving " +
                "indefinidamente. Não é uma ferramenta nova, é o OBJETIVO que Mutex, Semaphore, Atomic " +
                "Operation e Immutability existem para alcançar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Thread Safety é o objetivo de todo o módulo: código que se comporta corretamente sob " +
                "execução concorrente, sem Race Condition, Deadlock ou Starvation — alcançado combinando " +
                "Atomic Operation, Mutex/Semaphore e, quando possível, eliminando o problema pela raiz com " +
                "Immutability.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nomear essa propriedade permite fazer uma pergunta objetiva sobre qualquer trecho de código: " +
                "\"isso é thread-safe?\" — e, quando a resposta é não, escolher a ferramenta certa pra corrigir: " +
                "Atomic Operation para operações simples de uma única variável, Mutex/Semaphore para " +
                "Critical Sections mais complexas, ou — a estratégia mais robusta — eliminar Shared State " +
                "mutável usando Immutability, o que torna o código thread-safe por construção, sem precisar " +
                "de locks nenhum.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "text",
              filename: "thread-safety-strategies.txt",
              code: [
                "Estratégia 1 — Atomic Operation:  incrementarAtomicamente(contador)",
                "Estratégia 2 — Mutex:             mutex.adquirir() / seção crítica / mutex.liberar()",
                "Estratégia 3 — Immutability:      dado nunca muda → nenhuma thread precisa de lock pra lê-lo",
                "",
                "Todas as três produzem código THREAD-SAFE — a escolha depende do caso.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Não existe uma única \"ferramenta certa\" universal — thread safety é o resultado desejado, e " +
                "as ferramentas do módulo são as opções disponíveis pra chegar lá, cada uma com seu trade-off " +
                "de performance e complexidade.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Não existe \"thread-safe\" sem contexto: um componente seguro para uma operação pode não ser para uma " +
                "sequência delas.",
                "Combinar duas operações individualmente seguras não garante segurança; a sequência ainda pode ser intercalada.",
                "A forma mais simples de obter segurança é evitar o estado mutável compartilhado, com Immutability, antes de " +
                "adicionar locks.",
              ],
            },
          ],
          examples: [
            {
              title: "Não thread-safe",
              context: "O contador clássico, sem nenhuma proteção.",
              code: { language: "text", filename: "not-thread-safe.txt", code: "função incrementar():\n  contador = contador + 1\n// múltiplas threads chamando isso concorrentemente → Race Condition, resultado errado" },
              explanation: "Esse é o ponto de partida do módulo inteiro — o problema que todas as ferramentas seguintes existem para resolver.",
            },
            {
              title: "Thread-safe via Mutex",
              context: "Correção com lock explícito.",
              code: { language: "text", filename: "thread-safe-mutex.txt", code: "função incrementar():\n  mutex.adquirir()\n  contador = contador + 1\n  mutex.liberar()\n// agora thread-safe, ao custo de serializar o acesso (só uma thread por vez)" },
              explanation: "Correto, mas com custo de performance — cada chamada precisa esperar sua vez, mesmo quando não há conflito de verdade acontecendo naquele instante.",
            },
            {
              title: "Thread-safe via Immutability — sem lock nenhum",
              context: "Eliminando o Shared State mutável em vez de protegê-lo.",
              code: {
                language: "javascript",
                filename: "thread-safe-immutable.js",
                code: ["function incrementar(estadoAtual) {", "  return { ...estadoAtual, contador: estadoAtual.contador + 1 }; // novo objeto, nunca muta o antigo", "}", "// cada thread trabalha com sua própria referência de estado — nada pra sincronizar"].join("\n"),
              },
              explanation: "Como nada é mutado, não existe Shared State problemático — thread-safe sem nenhum lock, sem nenhum custo de sincronização, o motivo pelo qual Immutability é tão valorizada em código concorrente.",
            },
          ],
          exercise: {
            problem: "Avalie a função abaixo e diga se ela é thread-safe. Se não for, proponha UMA correção (Mutex OU Immutability) e justifique a escolha.",
            problemCode: {
              language: "text",
              filename: "evaluate-thread-safety.txt",
              code: [
                "cache = {}",
                "",
                "função buscarOuCalcular(chave):",
                "  se chave não está em cache:",
                "    cache[chave] = calcularAlgoLento(chave)",
                "  retorna cache[chave]",
              ].join("\n"),
            },
            task: "Diga se é thread-safe, explique o cenário de falha se não for, e escolha uma correção.",
            hint: "Duas threads podem checar 'chave não está em cache' ao mesmo tempo, antes de qualquer uma escrever — o mesmo padrão de check-then-act já visto em Race Condition.",
            solution: {
              code: {
                language: "text",
                filename: "evaluate-thread-safety-solved.txt",
                code: [
                  "NÃO é thread-safe: duas threads podem checar 'chave não está em cache' ao mesmo tempo,",
                  "ambas verem 'não está', e ambas chamarem calcularAlgoLento(chave) desnecessariamente",
                  "(trabalho duplicado, não corrupção de dado neste caso específico, mas ainda um bug de",
                  "concorrência clássico do tipo check-then-act).",
                  "",
                  "Correção com Mutex:",
                  "função buscarOuCalcular(chave):",
                  "  mutex.adquirir()",
                  "  se chave não está em cache:",
                  "    cache[chave] = calcularAlgoLento(chave)",
                  "  resultado = cache[chave]",
                  "  mutex.liberar()",
                  "  retorna resultado",
                  "",
                  "Justificativa: aqui a operação envolve checar E escrever no MESMO cache compartilhado —",
                  "Immutability não se aplica bem porque o cache PRECISA acumular novas entradas ao longo",
                  "do tempo; Mutex serializa só a checagem+escrita, mantendo a leitura de cache já resolvido",
                  "barata para chamadas futuras.",
                ].join("\n"),
              },
              explanation: "Esse padrão (cache compartilhado, check-then-act) é extremamente comum na prática — memoization concorrente exige exatamente esse cuidado.",
            },
          },
        }),
      ],
    }),
  ],
});
