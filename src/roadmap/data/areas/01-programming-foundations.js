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
            "Expor só o que quem usa precisa saber, escondendo os detalhes de implementação por trás de uma " +
            "interface simples — a base para lidar com sistemas complexos sem carregar tudo na cabeça.",
          revisit: ["Software Design / Object-Oriented Design", "Architecture Fundamentals"],
          // Piloto editorial (template canônico da Concept Study Page) — só este
          // Concept. content/examples/exercise já existiam como defaults no
          // builder (null/[]/null); esta é a primeira vez que são preenchidos.
          // note: R3.5.11 passa a exibir como subtítulo sob o H1 (tradução curta
          // do termo em inglês) — deixa de ser só metadata editorial invisível.
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Abstraction é a prática de expor apenas o que quem usa uma parte do sistema precisa saber, " +
                "escondendo os detalhes de como aquilo funciona por dentro. Você interage com uma representação " +
                "simplificada — um nome, uma assinatura, um conjunto de operações — sem precisar carregar na " +
                "cabeça a implementação inteira.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Abstraction esconde os detalhes de implementação atrás de uma interface simples — quem usa só " +
                "precisa entender o que a interface promete, não como ela cumpre a promessa por dentro.",
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
            "Agrupar dados e o comportamento que opera sobre eles em uma única unidade, controlando quem pode " +
            "acessar ou modificar esse estado de fora.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Encapsulation é a prática de agrupar dados (estado) e o comportamento que opera sobre esses " +
                "dados na mesma unidade — uma classe, um módulo, um closure — e restringir o acesso direto a " +
                "esse estado de fora dessa unidade. Quem está de fora só interage através de operações " +
                "expostas propositalmente.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Encapsulation une dados e as operações que os protegem numa única unidade, e bloqueia acesso " +
                "direto a esses dados — mudanças só acontecem através de métodos que mantêm o estado válido.",
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
            "O princípio de projetar interfaces que escondem decisões de implementação com chance de mudar — " +
            "Encapsulation é a técnica de linguagem que ajuda a aplicá-lo, mas os dois não são a mesma coisa.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Information Hiding é um princípio de design: ao projetar um módulo, uma classe ou uma função, " +
                "você decide deliberadamente quais decisões internas ficam escondidas da interface pública — " +
                "especialmente aquelas com mais chance de mudar no futuro. Não é sobre usar private; é sobre " +
                "escolher O QUE esconder.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Encapsulation esconde o acesso; Information Hiding esconde a decisão. Um bom design " +
                "normalmente precisa dos dois, mas eles resolvem problemas diferentes.",
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
          summary:
            "O contrato público que separa o que algo faz do como isso é implementado — a fronteira que " +
            "Abstraction e Encapsulation ajudam a proteger.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Interface é o conjunto de operações que algo expõe para o mundo exterior — a lista do que " +
                "você pode fazer, sem revelar como isso é feito por dentro. É a fronteira entre \"por fora\" e " +
                "\"por dentro\".",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Quando duas partes de um sistema só se conhecem pela interface — e não pela implementação uma " +
                "da outra —, elas podem evoluir de forma independente. Trocar a implementação de um lado não " +
                "quebra o outro lado, desde que a interface continue igual. A interface é justamente o que " +
                "sobra depois que os detalhes foram abstraídos.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Interface é o contrato — o que algo promete fazer. Duas implementações completamente " +
                "diferentes podem cumprir a mesma interface, e quem depende dela nem percebe a diferença.",
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
          summary:
            "As regras que uma Interface promete cumprir: pré-condições que quem chama precisa garantir, " +
            "pós-condições que a implementação garante de volta, e invariantes que nunca podem ser violados.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Contract formaliza o que uma Interface promete, além da assinatura dos métodos: " +
                "pré-condições (o que precisa ser verdade antes de chamar), pós-condições (o que fica " +
                "garantido depois que a chamada termina) e invariantes (o que permanece verdade sempre, antes " +
                "e depois).",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Uma Interface sozinha diz O QUE existe — os métodos, os tipos. Um Contract diz sob quais " +
                "condições isso funciona. Sem contrato explícito, essas regras vazam pra fora de formas " +
                "informais — comentários, convenção, tentativa e erro — e ficam fáceis de violar sem ninguém " +
                "perceber até algo quebrar em produção.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um Contract é o que uma Interface promete além da assinatura — pré-condições, pós-condições e " +
                "invariantes tornam explícito sob quais condições o código funciona, em vez de deixar isso " +
                "implícito na cabeça de quem escreveu.",
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
            "Um mecanismo pelo qual uma classe reaproveita e especializa o comportamento de outra — mas com " +
            "um contrato próprio que precisa ser respeitado para não quebrar quem depende da classe base.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Inheritance é um mecanismo de linguagem: uma classe (subclasse) reutiliza o estado e o " +
                "comportamento de outra classe (superclasse) e pode sobrescrever ou estender parte dele. É uma " +
                "forma de dizer \"isso é um tipo daquilo\" (is-a).",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Reaproveitar código comum entre tipos relacionados evita repetição — se Dog e Cat compartilham " +
                "comportamento de Animal, escrever Animal uma vez e derivar as duas economiza duplicação. Mas " +
                "Inheritance não é só economia de código: ela cria uma promessa — qualquer lugar que espera um " +
                "Animal deveria funcionar corretamente com um Dog ou um Cat no lugar (o princípio por trás " +
                "disso tem nome — Liskov Substitution — e volta com mais profundidade em SOLID).",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Inheritance reaproveita comportamento de uma classe base, mas junto com o reaproveitamento " +
                "vem uma promessa: a subclasse deve continuar se comportando como a base esperava. Quebrar " +
                "essa promessa é o problema mais comum de herança mal usada.",
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
            "A capacidade de tratar objetos de tipos diferentes através da mesma interface, deixando cada tipo " +
            "decidir como responder à mesma chamada — o motivo pelo qual Interface e Inheritance se tornam " +
            "úteis na prática.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Polymorphism é a capacidade de chamar a mesma operação (o mesmo nome de método, a mesma " +
                "interface) em objetos de tipos diferentes, e cada um responder do seu próprio jeito. Quem " +
                "chama não precisa saber — nem checar — qual tipo concreto está recebendo.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Polymorphism deixa cada tipo responder à mesma chamada do seu próprio jeito — é o que " +
                "transforma Interface (o contrato) e Inheritance (a hierarquia) em código que cresce sem " +
                "acumular condicionais de tipo.",
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
            "Construir comportamento complexo combinando objetos menores que colaboram entre si (has-a), em " +
            "vez de herdar de uma superclasse (is-a) — a alternativa mais flexível à Inheritance na maioria " +
            "dos casos.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Composition é montar um objeto a partir de outros objetos que ele contém e para quem delega " +
                "trabalho (has-a), em vez de herdar comportamento de uma superclasse (is-a). Um Car não é um " +
                "Engine — ele tem um Engine.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Composition monta comportamento juntando objetos que colaboram (has-a), em vez de herdar de " +
                "uma superclasse (is-a) — geralmente mais flexível, porque cada peça pode ser trocada, testada " +
                "e reutilizada de forma independente.",
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
          summary:
            "O quanto uma parte do sistema depende dos detalhes internos de outra — Interface, Composition e " +
            "Inheritance bem usados são justamente as ferramentas para manter esse grau de dependência baixo.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Coupling é o grau de dependência entre duas partes de um sistema — o quanto uma precisa saber " +
                "sobre os detalhes internos da outra pra funcionar. Alto Coupling: mudar uma parte " +
                "frequentemente exige mudar a outra também. Baixo Coupling: as partes podem mudar de forma " +
                "independente.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Sistemas crescem através de muitas partes interagindo entre si — Coupling é a medida de quão " +
                "presa essa rede de dependências está. Tudo que já vimos (Interface, Composition, Inheritance " +
                "bem usada) são ferramentas pra manter esse grau baixo: uma Interface bem desenhada esconde a " +
                "implementação, então quem depende dela não precisa mudar quando a implementação muda por " +
                "dentro.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Coupling mede o quanto uma parte do sistema depende dos detalhes de outra. O objetivo não é " +
                "coupling zero (impossível) — é manter as dependências no nível mais baixo que o problema " +
                "permite.",
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
          summary:
            "O quanto as responsabilidades dentro de uma mesma unidade (classe, módulo, função) pertencem de " +
            "verdade umas às outras — o par de Coupling: baixo Coupling entre unidades, alta Cohesion dentro " +
            "de cada uma.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Cohesion é o quanto as coisas dentro de uma mesma unidade — uma classe, um módulo, uma função " +
                "— têm relação entre si e servem a um propósito comum. Alta Cohesion: tudo ali dentro existe " +
                "por um motivo relacionado. Baixa Cohesion: a unidade faz um monte de coisas sem relação " +
                "nenhuma entre si, só porque ficaram juntas.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Cohesion é o complemento natural de Coupling: o objetivo de um bom design costuma ser " +
                "resumido como \"baixo acoplamento, alta coesão\" — dependências fracas entre unidades, " +
                "responsabilidades fortemente relacionadas dentro de cada unidade. Uma unidade de baixa " +
                "Cohesion tende a ter muitos motivos para mudar, um por responsabilidade não relacionada, o " +
                "que a torna frágil e difícil de entender.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Cohesion mede o quanto as responsabilidades dentro de uma unidade pertencem de verdade umas " +
                "às outras. Junto com Coupling baixo entre unidades, alta Cohesion dentro de cada uma é o par " +
                "que sustenta a heurística \"baixo acoplamento, alta coesão\".",
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
            "O princípio de organizar um sistema para que cada parte trate de uma preocupação distinta — a " +
            "razão de ser por trás de baixo Coupling e alta Cohesion, não uma técnica nova.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Separation of Concerns é o princípio de organizar um sistema de forma que cada parte trate de " +
                "uma \"preocupação\" (concern) distinta — uma responsabilidade, um tipo de decisão — sem se " +
                "misturar com as outras. Não é uma técnica específica; é o objetivo que Coupling baixo e " +
                "Cohesion alta existem para servir.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Quando concerns diferentes — lógica de negócio, acesso a dados, apresentação — ficam " +
                "misturados no mesmo lugar, qualquer mudança num deles arrisca quebrar os outros, mesmo sem " +
                "relação nenhuma entre si. Separar concerns é o que torna possível mudar como os dados são " +
                "salvos sem tocar em como a regra de negócio funciona — exatamente o resultado prático de ter " +
                "baixo Coupling entre as partes e alta Cohesion dentro de cada uma.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Separation of Concerns é o princípio; baixo Coupling e alta Cohesion são o resultado prático " +
                "de aplicá-lo bem. Perguntar \"essa parte está misturando preocupações diferentes?\" é uma " +
                "forma direta de aplicar o princípio no dia a dia.",
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
          summary:
            "O espaço endereçável onde um programa guarda dados durante a execução — cada informação vive em " +
            "algum endereço, e entender isso explica identidade vs. igualdade, custo de alocação e bugs de " +
            "estado compartilhado.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Memory é o espaço que um programa usa pra guardar dados enquanto roda — cada valor, cada " +
                "objeto, cada variável ocupa um endereço específico nesse espaço. Um programa não \"sabe\" " +
                "onde as coisas estão por mágica: cada acesso a um dado é, por baixo, um acesso a um endereço " +
                "de memória.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Sem memória endereçável, um programa não teria como guardar estado entre uma instrução e a " +
                "próxima — cada dado precisa de um \"lugar\" que possa ser lido e escrito de novo depois. " +
                "Entender que memória é organizada em endereços — não é um espaço mágico e infinito — explica " +
                "por que alocar memória tem custo, por que estruturas contíguas são mais rápidas de percorrer, " +
                "e por que compartilhar memória entre partes do programa pode causar bugs.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Memory é o espaço endereçável onde os dados de um programa vivem durante a execução — todo " +
                "acesso a uma variável é, por baixo, um acesso a um endereço. Isso explica identidade vs. " +
                "igualdade, custo de alocação, e por que compartilhar memória é uma fonte comum de bugs.",
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
            "Duas formas diferentes de uma variável se relacionar com um dado: copiar o valor por completo, ou " +
            "compartilhar o endereço onde ele vive — a origem do bug \"mudei uma coisa e outra mudou junto\".",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Quando você atribui um valor a outra variável (ou passa como argumento), duas coisas podem " +
                "acontecer: o valor é copiado por completo (semântica de valor), ou o endereço é copiado e " +
                "ambas passam a apontar pro mesmo dado na memória (semântica de referência). Em JavaScript, " +
                "primitivos (number, string, boolean...) têm semântica de valor; objetos e arrays têm " +
                "semântica de referência.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Copiar um dado inteiro toda vez que ele é atribuído seria caro para estruturas grandes — " +
                "referência resolve isso passando só o endereço, barato de copiar. Mas isso tem um preço: " +
                "mudanças feitas através de uma referência são visíveis através de qualquer outra referência " +
                "ao mesmo dado — exatamente o comportamento surpreendente visto no exercício de Memory.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Semântica de valor copia o dado inteiro; semântica de referência copia só o endereço, e os " +
                "dois nomes passam a compartilhar o mesmo dado. Saber qual das duas está em jogo é a diferença " +
                "entre um bug de estado compartilhado sem querer e código previsível.",
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
            "Duas regiões de memória com regras de vida muito diferentes: stack guarda dados de vida curta e " +
            "previsível (frames de função), heap guarda dados que precisam sobreviver além de uma única chamada.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Stack e Heap são duas regiões de memória com propósitos diferentes. A Stack guarda dados de " +
                "vida curta e previsível — cada chamada de função empilha um \"frame\" com suas variáveis " +
                "locais, removido automaticamente (LIFO — o último que entra é o primeiro que sai) quando a " +
                "função retorna. O Heap guarda dados que precisam viver além de uma única chamada — alocados " +
                "dinamicamente, removidos só quando nada mais precisa deles.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Stack guarda dados de vida curta e previsível, na disciplina LIFO de frames de função. Heap " +
                "guarda dados que precisam sobreviver além de uma única chamada. Um valor primitivo geralmente " +
                "cabe na stack; um objeto retornado ou compartilhado precisa do heap.",
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
            "A estrutura que rastreia em que ponto do programa a execução está — cada chamada de função " +
            "empilha um frame, cada retorno desempilha, e é exatamente essa pilha que aparece num stack trace.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "A Call Stack é a pilha de frames de execução que o runtime mantém para saber \"onde estou, e " +
                "pra onde volto quando essa função terminar\". Toda vez que uma função é chamada, um novo " +
                "frame é empilhado com suas variáveis locais e o ponto de retorno; quando a função termina, o " +
                "frame é removido e a execução volta pro frame anterior.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Um programa não executa só uma linha de código isolada — funções chamam outras funções, que " +
                "chamam outras, formando uma cadeia. A Call Stack é o mecanismo que permite voltar exatamente " +
                "pro lugar certo depois que cada chamada termina, e é também o que faz recursão funcionar " +
                "(cada chamada recursiva tem seu próprio frame, suas próprias variáveis locais).",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Call Stack é a pilha de frames que registra onde a execução está e pra onde ela volta. Cada " +
                "chamada empilha, cada retorno desempilha — e um stack trace é literalmente uma foto dessa " +
                "pilha no momento do erro.",
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
            "O mecanismo que recupera automaticamente a memória do heap que não é mais alcançável por nenhuma " +
            "parte do programa — a alternativa a gerenciar memória manualmente, ao custo de menos controle " +
            "direto sobre quando isso acontece.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Garbage Collection (GC) é o processo automático que identifica quais dados no heap não são " +
                "mais alcançáveis por nenhuma parte do programa em execução, e libera essa memória para reuso. " +
                "\"Alcançável\" (reachability) significa: existe algum caminho de referências, a partir de algo " +
                "que o programa ainda usa, até aquele dado?",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Garbage Collection libera automaticamente a memória do heap que não é mais alcançável por " +
                "nada que o programa ainda usa. Evita gestão manual, mas troca controle direto por menos " +
                "previsibilidade sobre quando exatamente a liberação acontece.",
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
            "Memória que deveria ter sido liberada, mas continua retida porque alguma referência esquecida " +
            "ainda a mantém alcançável — mesmo em runtimes com Garbage Collection, é possível vazar memória.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Memory Leak acontece quando memória que já não é mais necessária continua alcançável — por " +
                "causa de uma referência que alguém esqueceu de remover — e por isso o Garbage Collection " +
                "nunca a recupera. Não é um bug de \"esquecer de liberar\" (como em linguagens sem GC); é um " +
                "bug de \"esquecer de deixar de referenciar\".",
            },
            { type: "heading", text: "Por que existe (como categoria de bug)?" },
            {
              type: "paragraph",
              text:
                "Garbage Collection só libera o que é inalcançável — se um programa mantém, mesmo sem querer, " +
                "um caminho de referências até um dado antigo (um cache nunca limpo, um event listener nunca " +
                "removido, um array que só cresce), esse dado nunca vira elegível pra coleta, não importa quão " +
                "sofisticado o GC seja. É o modo de falha oposto de um bug comum: em vez de acessar algo que " +
                "já foi liberado, o programa impede algo de ser liberado.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Memory Leak é memória que deveria estar livre, mas continua alcançável por uma referência " +
                "esquecida — mesmo com Garbage Collection automático, um programa ainda pode vazar memória se " +
                "ele mesmo mantém, sem querer, um caminho até dados que já não precisa.",
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
          summary:
            "Quando o tipo de uma variável é verificado — em tempo de compilação (estática) ou em tempo de " +
            "execução (dinâmica) — determina se um erro de tipo é descoberto antes de rodar, ou só quando " +
            "aquele código específico executa.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Static Typing verifica os tipos antes do programa rodar, em tempo de compilação — um erro de " +
                "tipo impede o programa de sequer começar. Dynamic Typing verifica os tipos durante a " +
                "execução — um erro de tipo só aparece quando aquela linha específica roda, nunca antes.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Cada abordagem tem um trade-off diferente. Static Typing detecta uma classe inteira de erros " +
                "antes de qualquer usuário ver o programa rodando, ao custo de mais verbosidade e um passo de " +
                "compilação. Dynamic Typing permite escrever e rodar código mais rápido, ao custo de erros de " +
                "tipo só aparecerem em produção, se aquele caminho específico nunca foi exercitado em teste.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Static Typing verifica tipos antes de rodar (erro nunca chega em produção, mas exige " +
                "compilação); Dynamic Typing verifica em tempo de execução (mais rápido de iterar, mas o erro " +
                "só aparece se aquele código realmente rodar).",
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
            "Quão estritamente um tipo é imposto quando uma operação envolve tipos diferentes — se a " +
            "linguagem converte automaticamente (fraca) ou exige conversão explícita (forte). Um eixo " +
            "independente de static/dynamic.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Strong/Weak Typing mede o quanto uma linguagem permite misturar tipos diferentes numa " +
                "operação sem reclamar. Tipagem fraca converte automaticamente (coerção implícita) quando os " +
                "tipos não batem; tipagem forte recusa a operação até que a conversão seja feita explicitamente.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É um eixo independente de static/dynamic — JavaScript é dinâmica e fraca (converte tipos sem " +
                "avisar, e só descobre em runtime); Python é dinâmica mas forte (erro em runtime, mas sem " +
                "conversão silenciosa). Entender os dois eixos separadamente evita confundir \"tem erro de " +
                "tipo em compilação\" com \"não faz conversão implícita\" — são coisas diferentes.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Strong/Weak mede o quanto uma linguagem converte tipos automaticamente numa operação — é um " +
                "eixo independente de static/dynamic. JavaScript combina dinâmica + fraca, o que multiplica as " +
                "duas fontes de surpresa.",
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
            "A capacidade de um compilador deduzir o tipo de algo sem que ele seja declarado explicitamente — " +
            "combina a segurança de tipagem estática com boa parte da concisão de não escrever tipos toda hora.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Type Inference é a capacidade de um sistema de tipos deduzir automaticamente o tipo de uma " +
                "expressão a partir do contexto, sem que o tipo precise ser escrito explicitamente. Só faz " +
                "sentido em linguagens de tipagem estática — é o compilador \"adivinhando\" o tipo certo.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Declarar o tipo de toda variável manualmente é repetitivo — na maioria dos casos, o tipo já é " +
                "óbvio a partir do valor atribuído. Type Inference deixa o compilador preencher essa lacuna " +
                "sozinho, mantendo a segurança da tipagem estática sem a verbosidade de escrever o tipo em " +
                "todo lugar.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Type Inference deixa o compilador deduzir tipos a partir do contexto, em vez de exigir " +
                "anotação explícita em todo lugar — mantém a segurança da tipagem estática com a concisão de " +
                "código dinamicamente tipado.",
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
            "O grau em que um sistema de tipos impede, de verdade, que operações incompatíveis entre tipos " +
            "aconteçam — a propriedade que resulta de quando (static/dynamic) e quão estritamente (strong/weak) " +
            "os tipos são verificados.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Type Safety é o grau em que erros de tipo são efetivamente prevenidos pelo sistema de tipos " +
                "de uma linguagem, não apenas detectados tarde demais. Não é um eixo binário — é uma " +
                "propriedade resultante de onde uma linguagem fica nos eixos static/dynamic e strong/weak.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Os Concepts anteriores mostraram peças separadas: quando os tipos são checados, quão " +
                "estritamente são impostos, se são inferidos. Type Safety é a consequência prática de combinar " +
                "essas peças — uma linguagem estática e forte tende a ser mais type-safe; uma linguagem " +
                "dinâmica e fraca tende a ser menos. TypeScript aumenta a Type Safety do JavaScript com " +
                "checagem estática, mesmo mantendo parte da fraqueza de runtime herdada.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Type Safety é o resultado prático de combinar quando os tipos são checados e quão " +
                "estritamente são impostos — mais type-safe não significa \"melhor\" sempre, mas significa " +
                "mais erros pegos antes de virarem incidente em produção.",
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
            "Dois tipos são compatíveis só se tiverem o mesmo nome/declaração — mesmo que a estrutura interna " +
            "seja idêntica, tipos declarados separadamente são tratados como diferentes.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Em Nominal Typing, a compatibilidade entre tipos é decidida pelo nome (a declaração), não " +
                "pela estrutura. Dois tipos com exatamente os mesmos campos, mas declarados com nomes " +
                "diferentes, são tratados como tipos diferentes — incompatíveis entre si, mesmo parecendo " +
                "idênticos por dentro.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Nominal Typing existe para expressar intenção: às vezes você quer que dois tipos com a mesma " +
                "forma sejam tratados como coisas diferentes, porque representam conceitos distintos do " +
                "domínio — um UserId e um ProductId podem ser os dois só um number por dentro, mas misturar " +
                "um pelo outro é um bug de domínio, não um erro estrutural.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Nominal Typing decide compatibilidade pelo nome do tipo, não pela estrutura — útil pra " +
                "impedir que dois conceitos de domínio que \"por acaso\" têm a mesma forma sejam trocados um " +
                "pelo outro por engano.",
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
            "Dois tipos são compatíveis se tiverem a mesma estrutura, independente do nome ou de onde foram " +
            "declarados — o oposto de Nominal Typing, e o modelo padrão do TypeScript.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Em Structural Typing, a compatibilidade entre tipos é decidida pela estrutura — quais campos " +
                "existem e seus tipos — não pelo nome. Se um valor tem todos os campos que um tipo exige, ele " +
                "é compatível com esse tipo, mesmo declarado com outro nome (ou nenhum), e mesmo com campos a mais.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Diferente de Nominal Typing, Structural Typing é o modelo padrão do TypeScript, e reflete bem " +
                "como JavaScript já funciona por baixo — duck typing em runtime. Isso permite muito mais " +
                "flexibilidade: uma função que espera { name: string } aceita qualquer objeto com esse campo, " +
                "não importa como ele foi criado.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Structural Typing decide compatibilidade pela estrutura — se tem os campos certos, é aceito, " +
                "não importa o nome ou a origem do tipo. É o oposto de Nominal Typing, e o modelo que o " +
                "TypeScript usa por padrão.",
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
          summary:
            "Escrever código parametrizado por tipo, mantendo a relação entre entrada e saída — reutilização " +
            "sem abrir mão da segurança de tipos.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Generics permitem escrever código parametrizado por tipo, não só por valor — uma função ou " +
                "classe genérica funciona com qualquer tipo T, mas o compilador continua sabendo exatamente " +
                "qual T está em jogo em cada uso, preservando a relação entre entrada e saída.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Sem generics, escrever uma função que funciona com qualquer tipo exigiria any — o que joga " +
                "fora toda a Type Safety. Generics resolvem isso: o tipo continua desconhecido no momento de " +
                "escrever a função, mas fica conhecido e checado no momento de usar. É Abstraction aplicada a " +
                "tipos — a função abstrai o tipo concreto, mas a relação entre entrada e saída continua garantida.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Generics abstraem o tipo concreto, mas preservam a relação entre os tipos envolvidos — " +
                "resolvem o mesmo problema que any resolveria, sem abrir mão da Type Safety.",
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
          summary:
            "Um valor que pode ser de um tipo ou de outro — modela variação de forma explícita, em vez de " +
            "aceitar qualquer coisa (any) ou duplicar código pra cada caso separadamente.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Union Types representam um valor que pode ser de um tipo OU de outro (A | B) — não os dois ao " +
                "mesmo tempo, um dos dois, dependendo do caso. É a forma de expressar \"esse valor tem algumas " +
                "formas possíveis conhecidas\" sem abrir mão de checagem de tipo.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Muitos valores do mundo real legitimamente podem ser de mais de um tipo — um ID pode ser " +
                "string ou number, uma resposta de API pode ser sucesso ou erro. Sem Union Types, a " +
                "alternativa seria usar any (perdendo Type Safety) ou criar uma hierarquia de classes só pra " +
                "isso. Union Types resolvem isso diretamente, no próprio sistema de tipos.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Union Types modelam \"esse valor pode ser de um destes tipos\" de forma explícita e checada — " +
                "mais preciso que any e mais simples que criar uma hierarquia de classes só pra representar variação.",
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
          summary:
            "Um valor que precisa cumprir múltiplos tipos ao mesmo tempo (A & B) — o oposto de Union Types, " +
            "útil para combinar formas menores em uma maior sem herança.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Intersection Types (A & B) representam um valor que precisa ter todos os campos de A e todos " +
                "os campos de B ao mesmo tempo — diferente de Union (A | B, um ou outro), Intersection exige " +
                "os dois simultaneamente.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Às vezes você quer combinar formas menores e independentes numa forma maior, sem criar uma " +
                "hierarquia de herança pra isso — Composition aplicada a tipos, do mesmo jeito que Composition " +
                "(o Concept de objetos) combina comportamento sem Inheritance. Interfaces menores e focadas " +
                "podem ser combinadas sob demanda, só onde fizer sentido.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Intersection Types combinam múltiplas formas menores numa forma maior que precisa cumprir " +
                "todas ao mesmo tempo — o oposto de Union e uma alternativa a herança pra compor tipos.",
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
          summary:
            "Reduzir progressivamente as possibilidades de um Union Type dentro de um bloco de código, até o " +
            "compilador saber exatamente qual tipo específico está em jogo naquele ponto.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Type Narrowing é o processo de reduzir um Union Type (A | B) para um tipo mais específico " +
                "dentro de um bloco de código, através de checagens que o compilador entende — typeof, " +
                "instanceof, checagem de uma propriedade. Depois de um narrowing bem-sucedido, o compilador " +
                "trata o valor como o tipo restante.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Um Union Type sozinho só permite usar o que é comum a todos os tipos da união — pra usar algo " +
                "específico de só um deles, o compilador precisa ter certeza (via alguma checagem no código) " +
                "de qual tipo está em jogo naquele ponto. Type Narrowing é como você \"prova\" isso pro " +
                "compilador, ponto a ponto do código.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Type Narrowing é como um Union Type vira um tipo específico dentro de um bloco de código, " +
                "através de checagens que o compilador entende e usa pra refinar o que sabe sobre aquele valor.",
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
            "Duas formas de descrever o que um programa faz: dizer passo a passo como chegar no resultado " +
            "(imperativo), ou dizer o que se quer e deixar a implementação decidir o como (declarativo).",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Código Imperativo descreve uma sequência de passos explícitos que mudam o estado do programa " +
                "até chegar no resultado — \"faça isso, depois isso, depois aquilo\". Código Declarativo " +
                "descreve o resultado desejado, sem especificar os passos — \"eu quero isto\", deixando pra " +
                "implementação decidir como chegar lá.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Todo o resto deste módulo (Map, Filter, Reduce, Pure Functions, Function Composition) é, no " +
                "fundo, uma forma de escrever código mais declarativo — entender essa distinção primeiro dá o " +
                "\"porquê\" por trás de cada um desses Concepts. Código declarativo tende a ser mais curto e " +
                "mais fácil de ler, mas depende de confiar na implementação por trás.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Imperativo descreve os passos; Declarativo descreve o resultado desejado. Boa parte de " +
                "Functional Programming é sobre escrever mais no estilo declarativo — os próximos Concepts " +
                "são ferramentas concretas pra isso.",
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
          summary:
            "Funções tratadas como qualquer outro valor — podem ser guardadas em variáveis, passadas como " +
            "argumento, devolvidas por outra função. O recurso de linguagem que torna todo o resto de " +
            "Functional Programming possível.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Numa linguagem com First-Class Functions, uma função pode ser tratada exatamente como " +
                "qualquer outro valor: guardada numa variável, passada como argumento pra outra função, " +
                "devolvida como resultado, guardada dentro de um array ou objeto. Não existe uma categoria " +
                "especial de \"função\" separada dos outros valores.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É o recurso de linguagem que habilita praticamente tudo neste módulo. Sem First-Class " +
                "Functions, não haveria como passar uma função de comparação pra .sort(), nem como " +
                "Map/Filter/Reduce receberem uma função como argumento, nem como Closures ou Higher-Order " +
                "Functions existirem. Este Concept é a base sobre a qual os outros são construídos.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "First-Class Functions trata função como qualquer outro valor — guardável, passável, " +
                "retornável. É o alicerce que torna Closures, Higher-Order Functions e todo o resto de " +
                "Functional Programming possível.",
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
          summary:
            "Uma função que \"lembra\" o ambiente léxico onde foi criada, mesmo depois que esse ambiente já " +
            "deveria ter deixado de existir — a técnica por trás de estado privado, callbacks com contexto, e " +
            "Encapsulation fora de classes.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Closure é uma função combinada com o ambiente léxico — as variáveis — de onde ela foi " +
                "criada. Mesmo depois que a função externa que criou esse ambiente já retornou, a função " +
                "interna continua tendo acesso a essas variáveis. Já vimos isso em Stack vs Heap: um closure é " +
                "o que força uma variável local a sobreviver no heap além do frame que a criou.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Closures permitem que uma função \"carregue\" contexto junto com ela — sem precisar de uma " +
                "classe, sem parâmetros extras toda vez que ela é chamada. É assim que callbacks conseguem " +
                "lembrar de dados relevantes no momento em que foram registrados, e é uma forma alternativa de " +
                "Encapsulation: estado privado, sem classe nenhuma envolvida.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Closure é uma função que carrega consigo o ambiente léxico onde foi criada — permite estado " +
                "privado e contexto persistente sem precisar de uma classe, e é a base de como callbacks " +
                "lembram de dados relevantes.",
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
          summary:
            "Qualquer interação de uma função com o mundo fora dela — mudar uma variável externa, escrever num " +
            "arquivo, fazer uma requisição de rede. Entender o que é um efeito colateral é o pré-requisito pra " +
            "entender o que uma Pure Function evita.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Side Effect é qualquer coisa que uma função faz além de calcular e devolver um valor — " +
                "modificar uma variável fora do seu escopo, mudar um objeto recebido por referência, escrever " +
                "num arquivo, fazer uma chamada de rede, imprimir no console, ler a hora atual. Se a função " +
                "\"toca\" o mundo fora dela, ou depende de algo fora dela que pode mudar, isso é um efeito colateral.",
            },
            { type: "heading", text: "Por que existe (como conceito a nomear)?" },
            {
              type: "paragraph",
              text:
                "Nomear \"efeito colateral\" explicitamente é o primeiro passo pra decidir, de forma " +
                "deliberada, onde ele deveria acontecer no seu programa. Um programa sem nenhum efeito " +
                "colateral seria inútil (nunca mostraria nada na tela) — o objetivo não é eliminar efeitos " +
                "colaterais, é isolá-los da lógica de cálculo pura, exatamente o que Pure Functions descreve.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Side Effect é qualquer interação de uma função com algo fora dela — variável externa, objeto " +
                "mutado, I/O. Nomear isso explicitamente é o primeiro passo pra decidir onde, no seu programa, " +
                "isso deveria (ou não) acontecer.",
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
            "Uma função que, pro mesmo input, sempre devolve o mesmo output, e não produz nenhum efeito " +
            "colateral — previsível, testável isoladamente, e segura de chamar quantas vezes for preciso.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Pure Function satisfaz duas regras: pro mesmo input, sempre devolve o mesmo output — " +
                "nunca depende de nada externo que possa variar; e não produz nenhum Side Effect — não muta " +
                "nada fora dela, não faz I/O, não depende de estado externo mutável.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Funções puras são as unidades mais fáceis de entender, testar e reutilizar que existem — dado " +
                "o input, o resultado é sempre previsível, sem precisar simular o resto do sistema pra testar. " +
                "É também o que torna otimizações como memoization seguras: se o resultado é sempre o mesmo " +
                "pro mesmo input, dá pra guardar em cache sem medo.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Pure Function devolve sempre o mesmo output pro mesmo input, e não produz efeito colateral " +
                "nenhum. Isso as torna previsíveis, fáceis de testar isoladamente, e seguras de otimizar " +
                "(cache, memoization) sem medo de resultado errado.",
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
            "A propriedade de uma expressão poder ser substituída pelo seu valor resultante sem mudar o " +
            "comportamento do programa — uma consequência direta de trabalhar só com Pure Functions.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma expressão tem Referential Transparency se ela pode ser substituída pelo valor que produz, " +
                "em qualquer lugar do programa, sem mudar o comportamento de nada. add(2, 3) tem transparência " +
                "referencial porque você pode trocar cada ocorrência dela por 5 em qualquer lugar, e o " +
                "programa continua funcionando exatamente igual.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É uma consequência direta — quase uma definição alternativa — de trabalhar só com Pure " +
                "Functions. Se uma função é pura, então chamá-la é intercambiável com o valor que ela produz. " +
                "Isso permite raciocinar sobre código \"substituindo mentalmente\" chamadas por valores — o " +
                "tipo de raciocínio que fica impossível quando funções têm efeitos colaterais.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Referential Transparency significa que uma chamada de função pode ser trocada pelo valor que " +
                "ela produz, sem mudar o comportamento do programa. É o que Pure Functions garantem.",
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
          summary:
            "Dados que, uma vez criados, nunca mudam — em vez de alterar um valor existente, qualquer " +
            "\"mudança\" cria um valor novo. Elimina uma categoria inteira de bug de estado compartilhado inesperado.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Immutability significa que um dado, depois de criado, nunca é alterado — qualquer operação " +
                "que \"pareça\" mudar esse dado, na verdade, cria e devolve uma versão nova, deixando o " +
                "original intocado. Em Value vs Reference vimos o problema que isso resolve: mudar um objeto " +
                "compartilhado através de uma referência afeta todo mundo que também a tem.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Se nenhum dado nunca muda, nunca existe o risco de \"alguém mudou isso sem eu saber\" — cada " +
                "referência a um objeto imutável é garantidamente o mesmo valor pra sempre, o que simplifica " +
                "muito raciocinar sobre estado compartilhado, especialmente em código concorrente ou em UIs " +
                "que precisam saber exatamente quando algo mudou.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Immutability significa nunca alterar um dado existente — qualquer \"mudança\" cria um valor " +
                "novo. Elimina o bug de estado compartilhado inesperado pela raiz, ao custo de criar mais objetos.",
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
            "Uma função que recebe outra função como argumento, devolve uma função como resultado, ou as duas " +
            "coisas — a categoria que engloba Map, Filter, Reduce e Function Composition.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Higher-Order Function (HOF) é uma função que faz pelo menos uma destas duas coisas: " +
                "recebe outra função como argumento, ou devolve uma função como resultado. Só é possível " +
                "porque funções são First-Class.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "HOFs são o mecanismo que permite abstrair padrões de comportamento, não só dados. Em vez de " +
                "escrever um loop diferente pra cada operação, uma HOF como .map() abstrai \"aplicar uma " +
                "transformação a cada item\" e deixa você fornecer só a transformação específica — o padrão de " +
                "iteração fica reutilizado, só a lógica de cada caso muda.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Higher-Order Function é qualquer função que recebe função como argumento, devolve função como " +
                "resultado, ou as duas — a categoria que engloba Map/Filter/Reduce e Function Composition.",
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
            "Combinar funções menores em uma maior, encadeando a saída de uma como entrada da próxima (f∘g) — " +
            "o mesmo espírito de Composition (objetos), aplicado a comportamento em vez de estado.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Function Composition é combinar duas ou mais funções em uma nova função, onde a saída de uma " +
                "vira a entrada da próxima — matematicamente notado f∘g, que significa \"primeiro g, depois f " +
                "com o resultado\". O resultado é uma função nova, feita a partir de peças menores.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Function Composition combina funções pequenas e puras numa transformação maior, encadeando " +
                "saída→entrada. Mesmo espírito de Composition: montar o complexo a partir de peças simples e " +
                "testáveis isoladamente.",
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
            "Uma Higher-Order Function que aplica uma transformação a cada item de uma coleção, devolvendo " +
            "uma coleção nova do mesmo tamanho — o padrão declarativo mais comum pra \"fazer algo com cada elemento\".",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                ".map() recebe uma função de transformação e a aplica a cada item de uma coleção, devolvendo " +
                "uma coleção nova — imutável, o original não é tocado — com o mesmo número de elementos, cada " +
                "um transformado.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É a forma declarativa mais direta de expressar \"eu quero cada item, mas transformado de tal " +
                "jeito\" — substitui o loop imperativo (for + push) por uma única chamada que expressa a " +
                "intenção diretamente, e é uma Higher-Order Function pura por construção quando a função de " +
                "transformação também é pura.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                ".map() transforma cada item de uma coleção numa coleção nova do mesmo tamanho — a expressão " +
                "declarativa mais direta de \"aplique isso a cada elemento\", sem mutar o original.",
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
            "Uma Higher-Order Function que mantém só os itens de uma coleção que satisfazem uma condição, " +
            "devolvendo uma coleção nova (possivelmente menor) — o complemento natural de Map para selecionar, " +
            "em vez de transformar.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                ".filter() recebe uma função que devolve true/false (um predicado) e a aplica a cada item de " +
                "uma coleção, devolvendo uma coleção nova contendo só os itens pros quais o predicado devolveu " +
                "true. Diferente de .map() (que transforma cada item, mantendo o tamanho), .filter() seleciona " +
                "um subconjunto.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É a forma declarativa de expressar \"eu quero só os itens que satisfazem tal condição\" — " +
                "substitui um loop imperativo com if + push condicional por uma única chamada que nomeia " +
                "exatamente a condição de seleção.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                ".filter() seleciona um subconjunto de uma coleção com base numa condição, devolvendo uma " +
                "coleção nova (possivelmente menor). É o complemento de .map(): filter seleciona, map transforma.",
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
          summary:
            "A Higher-Order Function mais geral de todas: acumula os itens de uma coleção num único resultado " +
            "— Map e Filter podem, inclusive, ser implementados em cima de Reduce.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                ".reduce() percorre uma coleção acumulando um resultado — a cada item, chama uma função que " +
                "recebe o valor acumulado até agora e o item atual, e devolve o novo valor acumulado. No fim, " +
                "sobra um único resultado — um número, um objeto, um array, qualquer coisa.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Reduce é o caso mais geral de processar uma coleção — tão geral que Map e Filter podem, os " +
                "dois, ser escritos usando só Reduce por baixo (por isso este Concept é ensinado por último: " +
                "entender Map/Filter primeiro ajuda a apreciar o quanto Reduce generaliza os dois). Sempre que " +
                "o objetivo é \"resumir\" uma coleção inteira num valor só, Reduce é a ferramenta.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Reduce acumula os itens de uma coleção num único resultado — é o caso mais geral de todos, e " +
                "a ferramenta certa sempre que o objetivo é \"resumir\" uma coleção inteira.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Array guarda elementos em posições contíguas de memória — um do lado do outro, sem " +
                "lacunas — e cada elemento é acessado por um índice numérico. Como o tamanho de cada elemento " +
                "é conhecido e fixo, o endereço de qualquer posição pode ser calculado diretamente, sem " +
                "precisar percorrer nada.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É a estrutura mais direta possível sobre o que Memory já ensinou: memória endereçável e " +
                "contígua. Acesso por índice em O(1) — tempo constante, não importa o tamanho do array — é a " +
                "vantagem central: arr[500000] custa exatamente o mesmo que arr[0], porque é só aritmética de " +
                "endereço, nenhuma busca envolvida.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Array armazena elementos contíguos na memória, com acesso por índice em O(1) — a vantagem " +
                "que a contiguidade compra é acesso direto e rápido; o custo é que inserir/remover no meio ou " +
                "no início exige deslocar elementos.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Linked List é uma sequência de nós, onde cada nó guarda um valor e um ponteiro/referência " +
                "pro próximo nó. Diferente de Array, os nós não precisam estar em posições contíguas de " +
                "memória — podem estar espalhados em qualquer lugar do heap, conectados só pelos ponteiros.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É o contraste direto de Array, e resolve o que Array faz mal: inserir/remover no início (ou " +
                "em qualquer ponto, tendo a referência) custa O(1) numa Linked List — só reconectar ponteiros. " +
                "O preço é perder o acesso O(1) por índice: pra chegar no elemento N, é preciso percorrer os " +
                "N-1 anteriores, um por um.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Linked List troca acesso O(1) por índice (que Array tem) por inserção/remoção O(1) nas pontas " +
                "(que Array não tem) — a estrutura certa depende de qual operação seu caso de uso faz mais.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Stack (ADT) é uma estrutura de dados com duas operações principais: push (adiciona no topo) " +
                "e pop (remove do topo) — sempre respeitando LIFO (Last In, First Out): o último elemento que " +
                "entrou é sempre o primeiro que sai.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Stack é LIFO — o último elemento inserido é o primeiro a sair. Pode ser implementado sobre " +
                "Array ou Linked List; não confundir com a Call Stack do runtime, que segue a mesma disciplina " +
                "mas é uma coisa diferente.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Queue é uma estrutura de dados com duas operações principais: enqueue (adiciona no final) e " +
                "dequeue (remove do início) — sempre respeitando FIFO (First In, First Out): o primeiro " +
                "elemento que entrou é o primeiro que sai.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É o par natural de Stack — as duas estruturas respondem à mesma pergunta (\"qual elemento sai " +
                "primeiro?\") de formas opostas. Fila é o modelo natural pra processar coisas na ordem de " +
                "chegada: pedidos, tarefas, mensagens — a estrutura por trás de Task Queue e Message Queue.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Queue é FIFO — o primeiro elemento inserido é o primeiro a sair. É o par de Stack: as duas " +
                "respondem à mesma pergunta de forma oposta, e cada uma serve a um tipo diferente de problema " +
                "de ordenação de processamento.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Hash Table guarda pares chave-valor e usa uma função hash pra transformar cada chave num " +
                "índice de um Array interno — o \"endereço\" onde aquele par deveria estar. Buscar um valor não " +
                "exige percorrer nada: a função hash calcula direto onde procurar.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Array dá acesso O(1) por índice numérico, mas e se você quer buscar por uma chave arbitrária " +
                "— um nome, um ID de string, um objeto? Hash Table resolve isso: transforma qualquer chave num " +
                "índice via hash, e reaproveita o acesso O(1) de Array por baixo. O preço é que a ordem dos " +
                "elementos deixa de ter qualquer significado.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Hash Table mapeia chaves a valores usando uma função hash pra calcular a posição, dando " +
                "busca/inserção/remoção O(1) na média — o preço é perder qualquer noção de ordem entre os elementos.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Set é uma coleção onde cada elemento pode aparecer no máximo uma vez — adicionar um valor " +
                "já presente não tem efeito nenhum. As operações principais são add, has (verificar presença) " +
                "e delete.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Duas necessidades comuns: garantir unicidade e testar pertencimento rapidamente. Um array " +
                "resolveria isso, mas checar duplicidade ou pertencimento num array exige percorrer tudo — " +
                "O(n). Set normalmente é implementado por cima de uma Hash Table, então has vira O(1) na " +
                "média, o mesmo motivo pelo qual Hash Table existe.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Set garante que cada elemento aparece no máximo uma vez, e oferece teste de pertencimento " +
                "O(1) na média — normalmente implementado por cima de uma Hash Table, herdando as mesmas " +
                "vantagens e o mesmo trade-off (sem ordem significativa).",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Tree é uma coleção de nós conectados hierarquicamente: existe um nó raiz (root), e cada " +
                "nó pode ter zero ou mais nós filhos. Diferente de Linked List, um nó de Tree pode apontar pra " +
                "vários filhos — a estrutura generaliza de sequência linear pra hierarquia ramificada.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Muita coisa no mundo real é naturalmente hierárquica: um sistema de arquivos, a estrutura de " +
                "um HTML/DOM, decisões aninhadas. Tree modela essa forma de organização diretamente, com " +
                "operações que respeitam a hierarquia.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Tree generaliza Linked List de sequência linear pra hierarquia ramificada — cada nó pode ter " +
                "múltiplos filhos, em vez de um único \"próximo\". A estrutura natural pra representar qualquer " +
                "relação de hierarquia.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma Binary Search Tree (BST) é uma Tree com duas restrições: cada nó tem no máximo dois " +
                "filhos (esquerdo e direito), e existe um invariante de ordenação — pra qualquer nó, todos os " +
                "valores na sub-árvore esquerda são menores, e todos na sub-árvore direita são maiores.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "O invariante de ordenação é o que torna a busca eficiente: a cada nó visitado, dá pra " +
                "descartar metade da árvore restante — o mesmo princípio de busca binária, só que sobre uma " +
                "estrutura de nós em vez de um array. Quando a árvore está balanceada, isso dá O(log n) pra " +
                "busca/inserção/remoção.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Binary Search Tree é uma Tree com invariante de ordenação — isso permite busca O(log n) " +
                "quando balanceada, o mesmo princípio de busca binária aplicado a uma estrutura de nós.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Heap é uma Tree binária completa (todos os níveis preenchidos, exceto talvez o último, " +
                "preenchido da esquerda pra direita) que respeita o invariante de heap: em um Max-Heap, todo " +
                "nó é maior ou igual aos seus filhos. Por ser completa, um Heap pode ser guardado de forma " +
                "compacta dentro de um Array, usando aritmética de índice pra navegar entre pai e filhos.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "Algumas aplicações só precisam acessar rapidamente o maior (ou menor) elemento de um conjunto " +
                "que muda com frequência — sem manter tudo ordenado o tempo todo. Heap garante acesso O(1) ao " +
                "topo, e inserção/remoção em O(log n). É a estrutura por trás de Priority Queue.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Heap é uma Tree completa guardada de forma compacta num Array, garantindo acesso O(1) ao " +
                "maior (ou menor) elemento e inserção/remoção O(log n) — ideal quando você só precisa do " +
                "\"topo\" de uma coleção que muda com frequência.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um Graph é uma coleção de nós (vértices) conectados por arestas — sem a restrição hierárquica " +
                "de Tree (que exige uma raiz e proíbe ciclos). Num Graph, qualquer nó pode se conectar a " +
                "qualquer outro, inclusive formando ciclos.",
            },
            { type: "heading", text: "Por que existe?" },
            {
              type: "paragraph",
              text:
                "É o caso mais geral de estrutura baseada em relações — tão geral que tanto Tree quanto Linked " +
                "List são, tecnicamente, casos particulares de Graph. Redes sociais, mapas de rotas, " +
                "dependências entre módulos, o próprio grafo de conhecimento deste roadmap — tudo isso é " +
                "naturalmente um Graph.",
            },
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Graph é a estrutura mais geral de todas — nós conectados por arestas, sem restrição de " +
                "hierarquia ou proibição de ciclos. Tree e Linked List são casos particulares e mais " +
                "restritos de Graph.",
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
        concept({ order: 10, title: "Time Complexity", requires: ["Data Structures"] }),
        concept({ order: 20, title: "Space Complexity", requires: ["Time Complexity"] }),
        concept({ order: 30, title: "Big O", requires: ["Time Complexity", "Space Complexity"], note: "a notação (pior caso assintótico)" }),
        concept({
          order: 40,
          title: "Common Time Complexities",
          isNew: true,
          requires: ["Big O"],
          note: "consolida O(1), O(log n), O(n), O(n log n), O(n²) — cada classe é subtópico, com exemplo canônico e comparação de crescimento",
          subtopics: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
        }),
        concept({ order: 50, title: "Linear Search", requires: ["Common Time Complexities", "Array"] }),
        concept({
          order: 60,
          title: "Binary Search",
          requires: ["Common Time Complexities", "Binary Search Tree"],
          revisit: [
            "Testing & Quality Engineering / Debugging / Binary Search Debugging",
            "Testing & Quality Engineering / Debugging / Git Bisect",
          ],
        }),
        concept({ order: 70, title: "Sorting Fundamentals", requires: ["Common Time Complexities"], note: "comparar sort ingênuo × eficiente" }),
        concept({
          order: 80,
          title: "Recursion",
          requires: ["Memory & Runtime / Call Stack", "Common Time Complexities"],
          note: "a dependência para a frente foi eliminada — Call Stack é canônico na Story Memory & Runtime",
          revisit: ["Data Structures (traversals)"],
        }),
        concept({
          order: 90,
          title: "Memoization",
          requires: ["Recursion", "Data Structures / Hash Table", "Functional Programming / Pure Functions"],
          note: "só funciona sobre função pura",
          revisit: ["Platform / Caching"],
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
        concept({ order: 10, title: "Synchronous vs Asynchronous", note: "framing — agnóstico de linguagem" }),
        concept({ order: 20, title: "Blocking vs Non-Blocking", requires: ["Synchronous vs Asynchronous"], note: "eixo distinto de sync/async — agnóstico" }),
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
        }),
        concept({ order: 50, title: "Task Queue", requires: ["Data Structures / Queue", "Callback"], collision: "≠ Architecture / Message Queue (infra, outra Epic)" }),
        concept({ order: 60, title: "Event Loop", requires: ["Asynchronous Programming / Call Stack", "Task Queue"], note: "modelo do JS / runtimes event-loop" }),
        concept({ order: 70, title: "Microtask Queue", requires: ["Event Loop", "Task Queue"], note: "específico de runtime (JS)" }),
        concept({ order: 80, title: "Promise", requires: ["Callback", "Microtask Queue"], revisit: ["AI / Streaming", "Platform / Web Fundamentals / Server-Sent Events (SSE)"] }),
        concept({ order: 90, title: "Async/Await", requires: ["Promise"], note: "açúcar sintático sobre Promise" }),
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
        concept({ order: 10, title: "Concurrency vs Parallelism", requires: ["Asynchronous Programming / Synchronous vs Asynchronous"], note: "framing — não é o mesmo que async" }),
        concept({ order: 20, title: "Process", requires: ["Memory & Runtime / Memory"], revisit: ["Platform / Containers (Container vs VM)"] }),
        concept({ order: 30, title: "Thread", requires: ["Process"], revisit: ["Kubernetes"] }),
        concept({
          order: 40,
          title: "Shared State",
          requires: ["Thread", "Functional Programming / Immutability"],
          note: "contraste: dado imutável = sem o problema",
          revisit: ["Architecture & System Design / Scalability / Statelessness"],
        }),
        concept({ order: 50, title: "Race Condition", requires: ["Shared State"], revisit: ["Platform / Database Transactions"] }),
        concept({ order: 60, title: "Critical Section", requires: ["Race Condition"] }),
        concept({ order: 70, title: "Atomic Operation", requires: ["Race Condition"], collision: "≠ ACID Atomicity (Platform) — escopo diferente" }),
        concept({ order: 80, title: "Mutex", requires: ["Critical Section"] }),
        concept({ order: 90, title: "Semaphore", requires: ["Mutex"] }),
        concept({ order: 100, title: "Deadlock", requires: ["Mutex", "Semaphore"], revisit: ["Platform / Database Transactions"] }),
        concept({ order: 110, title: "Starvation", requires: ["Semaphore", "Deadlock"], note: "ensinar em par (falhas de liveness)" }),
        concept({ order: 120, title: "Thread Safety", requires: ["Mutex", "Atomic Operation", "Functional Programming / Immutability"], note: "a síntese da Story" }),
      ],
    }),
  ],
});
