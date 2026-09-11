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
        concept({ order: 10, title: "Memory", requires: ["Programming Fundamentals / Abstraction"], note: "armazenamento endereçável: bytes, endereços, alocação" }),
        concept({
          order: 20,
          title: "Value vs Reference",
          requires: ["Memory"],
          note: "cópia de valor × endereço compartilhado; semântica varia por linguagem",
          revisit: ["Concurrency / Shared State", "Software Design / Mutable vs Immutable Objects", "Functional Programming / Immutability"],
        }),
        concept({
          order: 30,
          title: "Stack vs Heap",
          requires: ["Value vs Reference"],
          note: "stack (frames, LIFO, automática) × heap (dinâmica, coletada)",
          collision: "≠ Stack ADT (Data Structures)",
        }),
        concept({
          order: 40,
          title: "Call Stack",
          requires: ["Stack vs Heap"],
          note: "frames de execução, chamada/retorno, stack overflow",
          collision: "≠ Stack ADT (Data Structures)",
          revisit: ["Algorithms & Complexity / Recursion", "Asynchronous Programming / Call Stack"],
        }),
        concept({
          order: 50,
          title: "Garbage Collection",
          requires: ["Stack vs Heap"],
          note: "recuperação automática do heap; reachability. Específico de runtimes com GC — contrastar com gestão manual",
          revisit: ["Concurrency (pausas de GC)", "Platform / Performance Engineering"],
        }),
        concept({
          order: 60,
          title: "Memory Leak",
          requires: ["Garbage Collection", "Value vs Reference"],
          note: "referências retidas que impedem a coleta; modo de falha",
          revisit: ["Platform / Performance Engineering"],
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
        concept({ order: 10, title: "Static vs Dynamic Typing", requires: ["Programming Fundamentals / Contract"], note: "quando os tipos são checados" }),
        concept({ order: 20, title: "Strong vs Weak Typing", requires: ["Static vs Dynamic Typing"], note: "quão estritamente são impostos — eixo independente" }),
        concept({ order: 30, title: "Type Inference", requires: ["Static vs Dynamic Typing"] }),
        concept({ order: 40, title: "Type Safety", requires: ["Strong vs Weak Typing"], note: "a propriedade resultante", revisit: ["Software Design / SOLID / Dependency Inversion Principle (DIP)"] }),
        concept({ order: 50, title: "Nominal Typing", requires: ["Type Safety"] }),
        concept({ order: 60, title: "Structural Typing", requires: ["Nominal Typing"], note: "ensinar como contraste", revisit: ["Software Design / Design Principles / Program to an Interface"] }),
        concept({ order: 70, title: "Generics", requires: ["Type Safety", "Programming Fundamentals / Abstraction"], revisit: ["Data Structures (coleções genéricas)"] }),
        concept({ order: 80, title: "Union Types", requires: ["Type Safety"] }),
        concept({ order: 90, title: "Intersection Types", requires: ["Union Types"] }),
        concept({ order: 100, title: "Type Narrowing", requires: ["Union Types"], revisit: ["Software Craft / Guard Clauses (narrowing por guarda)"] }),
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
        concept({ order: 10, title: "Declarative vs Imperative", requires: ["Programming Fundamentals / Abstraction"], note: "framing do paradigma" }),
        concept({ order: 20, title: "First-Class Functions", requires: ["Declarative vs Imperative"], note: "o recurso de linguagem que habilita o resto" }),
        concept({
          order: 30,
          title: "Closure",
          isNew: true,
          requires: ["First-Class Functions"],
          note:
            "função + ambiente léxico capturado. Importante para callbacks e comportamento de funções em JavaScript. " +
            "NÃO é pré-requisito do mecanismo do Event Loop.",
          revisit: ["Asynchronous Programming / Callback"],
        }),
        concept({ order: 40, title: "Side Effects", requires: ["Programming Fundamentals / Encapsulation"], note: "ensinar antes de Pure Functions", revisit: ["Concurrency / Shared State", "AI Engineering / Model Inference / Deterministic vs Stochastic Output"] }),
        concept({
          order: 50,
          title: "Pure Functions",
          requires: ["Side Effects"],
          revisit: ["Testing & Quality Engineering / Testing Strategy / Testability", "Algorithms & Complexity / Memoization"],
        }),
        concept({ order: 60, title: "Referential Transparency", requires: ["Pure Functions"] }),
        concept({
          order: 70,
          title: "Immutability",
          requires: ["Side Effects", "Memory & Runtime / Value vs Reference"],
          revisit: ["Concurrency / Thread Safety", "Software Design / Mutable vs Immutable Objects", "Architecture / Event Sourcing"],
        }),
        concept({ order: 80, title: "Higher-Order Functions", requires: ["First-Class Functions", "Closure"] }),
        concept({ order: 90, title: "Function Composition", requires: ["Higher-Order Functions", "Pure Functions"], collision: "≠ Composition (Programming Fundamentals, objetos). f∘g" }),
        concept({ order: 100, title: "Map", requires: ["Higher-Order Functions"] }),
        concept({ order: 110, title: "Filter", requires: ["Map"] }),
        concept({ order: 120, title: "Reduce", requires: ["Map", "Filter"], note: "o caso geral — ensinar por último" }),
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
        concept({ order: 10, title: "Array", note: "memória contígua, índice O(1)" }),
        concept({ order: 20, title: "Linked List", requires: ["Array"], note: "contraste: sem contiguidade" }),
        concept({ order: 30, title: "Stack", requires: ["Array", "Linked List"], note: "LIFO", collision: "≠ Call Stack (Memory & Runtime)" }),
        concept({ order: 40, title: "Queue", requires: ["Stack"], note: "FIFO, ensinar em par", revisit: ["Asynchronous Programming / Task Queue", "Architecture / Message Queue"] }),
        concept({ order: 50, title: "Hash Table", requires: ["Array"], revisit: ["Architecture / Consistent Hashing", "Platform / Database Performance / Index"] }),
        concept({ order: 60, title: "Set", requires: ["Hash Table"], note: "normalmente hash-backed" }),
        concept({ order: 70, title: "Tree", requires: ["Linked List"], note: "nós + ponteiros" }),
        concept({ order: 80, title: "Binary Search Tree", requires: ["Tree"], revisit: ["Platform / Database Performance / Index"] }),
        concept({ order: 90, title: "Heap", requires: ["Tree", "Array"], note: "árvore completa em array; priority queue" }),
        concept({
          order: 100,
          title: "Graph",
          requires: ["Tree", "Hash Table"],
          revisit: ["AI / Vector Search (HNSW)"],
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
