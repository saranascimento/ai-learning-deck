import { area, module, concept } from "../builders.js";

export default area({
  slug: "software-craft",
  order: 30,
  title: "Software Craft",
  color: "#E0A458",
  summary:
    "Disciplina diária de escrever e mudar código com segurança: clean code, heurísticas, code smells, " +
    "refactoring, error handling, code review, dependências, git, documentação.",
  phase: "Fase 2 concluída (2026-09-05)",
  modules: [
    module({
      slug: "clean-code",
      order: 10,
      title: "Clean Code",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Vocabulário e legibilidade (Naming) → tamanho e responsabilidade da função → argumentos e early " +
        "return → quando comentar → números mágicos. Pure Functions/Side Effects/Immutability removidas " +
        "(canônico em Programming Foundations / Functional Programming).",
      concepts: [
        concept({
          order: 10,
          title: "Naming",
          note: "vocabulário/legibilidade — ponto de entrada da Story",
          summary:
            "Naming é a escolha dos nomes de variáveis, funções, classes e arquivos para que comuniquem o que cada " +
            "coisa representa ou faz.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um bom nome revela a intenção, usa o vocabulário do problema (não o da implementação) e é consistente " +
                "com os outros nomes do código.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se para entender um nome é preciso ler a implementação, o nome ainda não está pronto.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Código é lido muito mais vezes do que é escrito, e o nome é o primeiro — muitas vezes o único — " +
                "contexto que quem lê tem. Com um nome ruim (d, data, temp, x), a pessoa precisa reconstruir o " +
                "significado lendo toda a implementação e adivinhando; com um bom nome, ela entende de relance e " +
                "só desce aos detalhes se precisar.",
            },
            {
              type: "paragraph",
              text:
                "Alguns princípios práticos: prefira o nome que responde \"por que existe / o que faz\" a um que " +
                "só descreve o tipo (list, arr, obj); evite abreviações que só o autor entende; use um único " +
                "termo por conceito (não alterne fetch, get e retrieve para a mesma ideia); nomeie funções com " +
                "verbos e booleanos como perguntas (isActive, hasPermission); e deixe o nome mais descritivo " +
                "quanto maior for o escopo em que ele vive.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma função, antes e depois de nomes que revelam a intenção:" },
            {
              type: "code",
              language: "javascript",
              filename: "naming.js",
              code: [
                "// Antes: quem lê precisa decifrar o que cada letra significa",
                "function calc(l, d) {",
                "  const r = [];",
                "  for (const x of l) {",
                "    if (x.d < d) r.push(x);",
                "  }",
                "  return r;",
                "}",
                "",
                "// Depois: a intenção está nos nomes",
                "function findOverdueInvoices(invoices, today) {",
                "  const overdueInvoices = [];",
                "  for (const invoice of invoices) {",
                "    if (invoice.dueDate < today) overdueInvoices.push(invoice);",
                "  }",
                "  return overdueInvoices;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A lógica é idêntica nas duas versões — só os nomes mudaram. Na segunda, dá para entender o que a " +
                "função faz (buscar faturas vencidas) e o que cada variável guarda sem ler o corpo linha por linha.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Nomes que descrevem só o tipo (`list`, `data`, `arr`) não dizem o que o valor significa para o problema.",
                "Alternar sinônimos (`get`, `fetch`, `retrieve`) para a mesma operação faz quem lê achar que são coisas " +
                "diferentes.",
                "Abreviações que só o autor entende obrigam a reconstruir o significado lendo a implementação.",
              ],
            },
          ],
          examples: [
            {
              title: "Nome que revela intenção, não o tipo",
              context: "Nomes como list, data ou arr dizem a forma do valor, mas não o que ele significa para o problema.",
              code: {
                language: "javascript",
                filename: "intent-names.js",
                code: [
                  "// Antes: 'list' não diz de que lista se trata",
                  "const list = users.filter((u) => u.lastLogin > cutoff);",
                  "",
                  "// Depois: o nome conta o motivo da existência do valor",
                  "const recentlyActiveUsers = users.filter((user) => user.lastLogin > cutoff);",
                ].join("\n"),
              },
              explanation:
                "O nome recentlyActiveUsers já traz o critério de negócio embutido, então quem lê o resto da função " +
                "não precisa voltar até o filter para lembrar o que aquele array contém.",
            },
            {
              title: "Booleanos como perguntas, funções como verbos",
              context: "Nomes genéricos como flag ou status escondem o que o valor responde; verbos deixam claro que há uma ação.",
              code: {
                language: "javascript",
                filename: "booleans-and-verbs.js",
                code: [
                  "// Antes",
                  "if (flag) {",
                  "  email(user);",
                  "}",
                  "",
                  "// Depois",
                  "if (isEmailVerified) {",
                  "  sendWelcomeEmail(user);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "\"if (isEmailVerified)\" lê como uma pergunta em português corrido, e sendWelcomeEmail deixa claro " +
                "que é uma ação com efeito. O par flag / email exigiria ir procurar as definições para entender.",
            },
            {
              title: "Um único termo por conceito",
              context: "Alternar sinônimos (get, fetch, retrieve) para a mesma operação faz o leitor achar que são coisas diferentes.",
              code: {
                language: "javascript",
                filename: "consistent-terms.js",
                code: [
                  "// Antes: três verbos para a mesma ideia (buscar algo do servidor)",
                  "function getUser(id) { /* ... */ }",
                  "function fetchOrder(id) { /* ... */ }",
                  "function retrieveInvoice(id) { /* ... */ }",
                  "",
                  "// Depois: um termo só, previsível",
                  "function fetchUser(id) { /* ... */ }",
                  "function fetchOrder(id) { /* ... */ }",
                  "function fetchInvoice(id) { /* ... */ }",
                ].join("\n"),
              },
              explanation:
                "Com um vocabulário consistente, quem descobre fetchUser consegue prever que fetchInvoice existe e faz " +
                "o mesmo tipo de coisa — e um get diferente passa a sinalizar, de fato, uma operação diferente.",
            },
          ],
          exercise: {
            problem:
              "Esta função calcula o valor de um pedido e aplica um desconto para pedidos grandes, mas os nomes " +
              "não dizem nada sobre o que ela faz.",
            problemCode: {
              language: "javascript",
              filename: "proc.js",
              code: [
                "function proc(a, b) {",
                "  const t = a.reduce((s, i) => s + i.p * i.q, 0);",
                "  if (t > b) return t * 0.9;",
                "  return t;",
                "}",
              ].join("\n"),
            },
            task:
              "Renomeie a função, os parâmetros e as variáveis para que o código possa ser entendido sem ler o " +
              "corpo com atenção. Não mude a lógica.",
            hint: "Pergunte, para cada nome, \"o que este valor representa no problema?\" — a e i são coleções e itens de quê? b é limite de quê?",
            solution: {
              code: {
                language: "javascript",
                filename: "apply-bulk-discount.js",
                code: [
                  "function applyBulkDiscount(items, discountThreshold) {",
                  "  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);",
                  "  if (subtotal > discountThreshold) return subtotal * 0.9;",
                  "  return subtotal;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agora a função se descreve: recebe itens e um limite, soma o subtotal e aplica desconto acima do " +
                "limite. O 0.9 continua sem nome — ele é o assunto do Concept Magic Numbers, mais adiante neste módulo.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Functions",
          note: "tamanho, responsabilidade única no nível de função",
          summary: "Boas Functions são pequenas, têm um único propósito e operam num único nível de abstração.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O nome de cada uma descreve exatamente o que ela faz. É a aplicação da responsabilidade única na menor " +
                "escala em que ela faz sentido.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "O critério para dividir uma função é o propósito, e não o número de linhas.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Uma função longa mistura várias razões para mudar: uma regra de validação, um cálculo e um acesso " +
                "ao banco vivem juntos, então mexer em uma pode quebrar a outra e testar uma exige preparar todas. " +
                "Dividir em funções com um propósito só permite ler o código de cima para baixo, como uma receita, " +
                "e entrar nos detalhes apenas quando necessário.",
            },
            {
              type: "paragraph",
              text:
                "Um teste prático: se para descrever o que a função faz você precisa usar \"e\" (\"valida e salva e " +
                "envia um e-mail\"), ela provavelmente faz mais de uma coisa. O tamanho em linhas é só sintoma — o " +
                "critério de verdade é propósito único. Também vale o equilíbrio: extrair funções triviais demais " +
                "fragmenta o código e obriga a pular entre arquivos sem ganho de clareza.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função que faz três coisas, dividida em funções com um propósito cada:" },
            {
              type: "code",
              language: "javascript",
              filename: "functions.js",
              code: [
                "// Antes: valida, calcula e persiste tudo no mesmo bloco",
                "function processOrder(order) {",
                "  if (order.items.length === 0) throw new Error(\"pedido vazio\");",
                "  let total = 0;",
                "  for (const item of order.items) total += item.price * item.quantity;",
                "  db.save({ ...order, total });",
                "}",
                "",
                "// Depois: o topo lê como uma receita; cada passo tem seu lugar",
                "function processOrder(order) {",
                "  validateOrder(order);",
                "  const total = calculateTotal(order.items);",
                "  saveOrder(order, total);",
                "}",
                "",
                "function validateOrder(order) {",
                "  if (order.items.length === 0) throw new Error(\"pedido vazio\");",
                "}",
                "",
                "function calculateTotal(items) {",
                "  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);",
                "}",
                "",
                "function saveOrder(order, total) {",
                "  db.save({ ...order, total });",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Agora calculateTotal pode ser testada sozinha, sem banco, e uma mudança na regra de validação não " +
                "toca no cálculo. processOrder virou um resumo legível do fluxo, sem detalhes de implementação.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um nome que precisa de \"e\" para descrever a função indica duas responsabilidades misturadas.",
                "Misturar decisões de alto nível com detalhes de baixo nível obriga quem lê a alternar de contexto.",
                "Extrair demais gera indireção sem valor: uma função só se justifica quando o nome explica algo que a " +
                "expressão não explica.",
              ],
            },
          ],
          examples: [
            {
              title: "O teste do \"e\" no nome",
              context: "Quando o nome (ou a descrição) da função junta duas ações, é um sinal de que ela tem duas responsabilidades.",
              code: {
                language: "javascript",
                filename: "and-test.js",
                code: [
                  "// Antes: o nome já confessa duas responsabilidades",
                  "function validateAndSaveUser(user) {",
                  "  if (!user.email.includes(\"@\")) throw new Error(\"e-mail inválido\");",
                  "  db.users.insert(user);",
                  "}",
                  "",
                  "// Depois: duas funções, compostas pelo chamador",
                  "function validateUser(user) {",
                  "  if (!user.email.includes(\"@\")) throw new Error(\"e-mail inválido\");",
                  "}",
                  "",
                  "function saveUser(user) {",
                  "  db.users.insert(user);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Separadas, dá para validar sem salvar (por exemplo, num formulário que só confere os dados) e salvar " +
                "sem revalidar dados que já foram checados — combinações impossíveis com a função única.",
            },
            {
              title: "Um único nível de abstração",
              context: "Misturar decisões de alto nível com detalhes de baixo nível na mesma função obriga o leitor a alternar de contexto.",
              code: {
                language: "javascript",
                filename: "abstraction-level.js",
                code: [
                  "// Antes: regra de negócio e formatação de texto no mesmo bloco",
                  "function printReceipt(order) {",
                  "  const lines = order.items.map((i) => i.name.padEnd(20) + String(i.price).padStart(8));",
                  "  console.log(lines.join(\"\\n\"));",
                  "  if (order.total > 1000) console.log(\"cliente premium\");",
                  "}",
                  "",
                  "// Depois: o topo só orquestra; os detalhes ficam em funções próprias",
                  "function printReceipt(order) {",
                  "  console.log(formatItemLines(order.items));",
                  "  if (isPremiumOrder(order)) console.log(\"cliente premium\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Na segunda versão, printReceipt conta o que acontece (imprime os itens, marca cliente premium) sem " +
                "expor padEnd e padStart. Os detalhes de formatação e a regra do que é \"premium\" passam a viver, e " +
                "mudar, em um lugar cada.",
            },
            {
              title: "Extrair demais também atrapalha",
              context: "Uma função só ganha o direito de existir quando dá um nome útil ao que faz — senão vira indireção sem valor.",
              code: {
                language: "javascript",
                filename: "over-extraction.js",
                code: [
                  "// Antes: extração que só renomeia a mesma expressão",
                  "function isNotEmpty(list) {",
                  "  return list.length > 0;",
                  "}",
                  "if (isNotEmpty(items)) send(items);",
                  "",
                  "// Melhor: a própria expressão já é clara e curta",
                  "if (items.length > 0) send(items);",
                ].join("\n"),
              },
              explanation:
                "isNotEmpty não acrescenta significado além do que items.length > 0 já diz, e ainda obriga o leitor a ir " +
                "conferir a definição. Extrair vale quando o nome explica uma intenção que a expressão não explica.",
            },
          ],
          exercise: {
            problem:
              "Esta função de cadastro faz quatro coisas diferentes no mesmo bloco, o que torna difícil testar ou " +
              "alterar qualquer uma delas isoladamente.",
            problemCode: {
              language: "javascript",
              filename: "register-user.js",
              code: [
                "function registerUser(data) {",
                "  if (!data.email || !data.password) throw new Error(\"dados obrigatórios\");",
                "  const passwordHash = hash(data.password);",
                "  const user = db.users.insert({ email: data.email, passwordHash });",
                "  mailer.send(user.email, \"Bem-vindo!\");",
                "  return user;",
                "}",
              ].join("\n"),
            },
            task:
              "Divida registerUser em funções pequenas, cada uma com um propósito claro, de modo que registerUser " +
              "passe a apenas orquestrar os passos.",
            hint: "Identifique as quatro ações (validar, gerar hash, salvar, enviar e-mail) e dê um nome de verbo a cada uma.",
            solution: {
              code: {
                language: "javascript",
                filename: "register-user.refactored.js",
                code: [
                  "function registerUser(data) {",
                  "  validateRegistration(data);",
                  "  const user = saveUser(data.email, hash(data.password));",
                  "  sendWelcomeEmail(user);",
                  "  return user;",
                  "}",
                  "",
                  "function validateRegistration(data) {",
                  "  if (!data.email || !data.password) throw new Error(\"dados obrigatórios\");",
                  "}",
                  "",
                  "function saveUser(email, passwordHash) {",
                  "  return db.users.insert({ email, passwordHash });",
                  "}",
                  "",
                  "function sendWelcomeEmail(user) {",
                  "  mailer.send(user.email, \"Bem-vindo!\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "registerUser agora se lê como a lista de passos do cadastro, e cada passo pode ser testado (ou " +
                "trocado, como o envio de e-mail) sem tocar nos outros. Repare que o hash ficou como chamada direta: " +
                "extrair mais que isso não traria clareza adicional.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Function Arguments",
          requires: ["Functions"],
          note: "aridade, ordem, flags booleanas",
          summary:
            "Function Arguments é a forma como uma função recebe os seus dados: quantos parâmetros, em que ordem e de " +
            "que tipo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A regra geral é preferir poucos, previsíveis e autoexplicativos — 0 a 2 são o ideal, e 3 já pede " +
                "atenção.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se a chamada não se explica sozinha no ponto de uso, os argumentos precisam de nomes.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Cada parâmetro é uma coisa a mais que quem chama precisa lembrar, na ordem certa. Uma chamada como " +
                "createUser(\"Ana\", \"ana@mail.com\", true, false) é ilegível no ponto de uso — o que significam true e " +
                "false? — e trocar dois argumentos do mesmo tipo passa sem erro nenhum. Além disso, o número de " +
                "combinações a testar cresce a cada parâmetro novo.",
            },
            {
              type: "paragraph",
              text:
                "Três práticas ajudam. Agrupar em um objeto nomeado os argumentos que pertencem juntos (o chamador " +
                "escreve os nomes na chamada). Evitar flags booleanas: um booleano que muda o comportamento indica " +
                "que a função faz duas coisas, e o melhor é ter duas funções. E evitar argumentos de saída — funções " +
                "que modificam o que receberam em vez de devolver um resultado, o que esconde o efeito da chamada. " +
                "Reconhecer quando isso já virou um problema é o assunto de Long Parameter List, no módulo Code Smells.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma chamada, sem e com um objeto nomeado:" },
            {
              type: "code",
              language: "javascript",
              filename: "function-arguments.js",
              code: [
                "// Antes: quem lê a chamada não sabe o que true e false significam",
                "createUser(\"Ana\", \"ana@mail.com\", true, false);",
                "",
                "// Depois: os nomes aparecem na própria chamada",
                "function createUser({ name, email, isAdmin = false, sendWelcome = true }) {",
                "  // ...",
                "}",
                "",
                "createUser({ name: \"Ana\", email: \"ana@mail.com\", isAdmin: true, sendWelcome: false });",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A chamada agora se explica sozinha, a ordem deixou de importar e os valores padrão (isAdmin e " +
                "sendWelcome) permitem omitir o que não muda.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma flag booleana costuma esconder duas funções com propósitos diferentes dentro de uma só.",
                "Vários parâmetros do mesmo tipo tornam a ordem uma fonte de erros silenciosos.",
                "Modificar o argumento recebido esconde o efeito: quem chama não vê, na chamada, que algo mudou.",
              ],
            },
          ],
          examples: [
            {
              title: "Flag booleana: duas funções em uma",
              context: "Um booleano que altera o comportamento da função é sinal de que ela tem dois caminhos com propósitos diferentes.",
              code: {
                language: "javascript",
                filename: "boolean-flag.js",
                code: [
                  "// Antes: o que significa o 'true' na chamada?",
                  "function renderPage(page, isPreview) {",
                  "  if (isPreview) return renderWithDraftWatermark(page);",
                  "  return renderFinal(page);",
                  "}",
                  "renderPage(page, true);",
                  "",
                  "// Depois: uma função para cada intenção",
                  "function renderPreview(page) {",
                  "  return renderWithDraftWatermark(page);",
                  "}",
                  "function renderPublished(page) {",
                  "  return renderFinal(page);",
                  "}",
                  "renderPreview(page);",
                ].join("\n"),
              },
              explanation:
                "A chamada renderPreview(page) diz o que faz sem exigir a consulta à definição, e cada função passa " +
                "a ter um propósito só.",
            },
            {
              title: "Objeto de opções para muitos parâmetros",
              context: "Quando vários parâmetros são opcionais ou do mesmo tipo, a ordem vira uma fonte de erros.",
              code: {
                language: "javascript",
                filename: "options-object.js",
                code: [
                  "// Antes: seis argumentos posicionais — fácil trocar 'from' e 'to'",
                  "fetchReport(\"2026-01-01\", \"2026-03-31\", \"csv\", true, false, 500);",
                  "",
                  "// Depois: cada valor tem nome, e o que não muda usa o padrão",
                  "function fetchReport({ from, to, format = \"json\", includeArchived = false, limit = 100 }) {",
                  "  // ...",
                  "}",
                  "fetchReport({ from: \"2026-01-01\", to: \"2026-03-31\", format: \"csv\" });",
                ].join("\n"),
              },
              explanation:
                "A chamada nova só menciona o que foge do comum, e trocar from e to (dois textos parecidos) deixa de " +
                "ser um erro silencioso, porque cada valor vem com o nome do campo.",
            },
            {
              title: "Argumento de saída: devolver em vez de mutar",
              context: "Modificar o argumento recebido esconde o efeito da função — quem chama não vê, na chamada, que algo mudou.",
              code: {
                language: "javascript",
                filename: "output-argument.js",
                code: [
                  "// Antes: o efeito está escondido — 'report' muda dentro da função",
                  "function appendFooter(report) {",
                  "  report.push(\"-- fim do relatório --\");",
                  "}",
                  "appendFooter(report);",
                  "",
                  "// Depois: a função devolve o resultado, e a mudança fica visível",
                  "function withFooter(report) {",
                  "  return [...report, \"-- fim do relatório --\"];",
                  "}",
                  "const finishedReport = withFooter(report);",
                ].join("\n"),
              },
              explanation:
                "Em const finishedReport = withFooter(report), fica explícito que existe um resultado novo e que o " +
                "report original não foi alterado — quem lê não precisa abrir a função para descobrir isso.",
            },
          ],
          exercise: {
            problem:
              "Esta função recebe seis argumentos posicionais, incluindo duas flags booleanas. As chamadas espalhadas " +
              "pelo código são difíceis de ler e é fácil trocar a ordem.",
            problemCode: {
              language: "javascript",
              filename: "schedule-meeting.js",
              code: [
                "function scheduleMeeting(title, start, end, isOnline, sendInvites, reminderMinutes) {",
                "  // ...",
                "}",
                "",
                "scheduleMeeting(\"Planning\", \"09:00\", \"10:00\", true, false, 15);",
              ].join("\n"),
            },
            task:
              "Reescreva a assinatura e a chamada para que fiquem legíveis, e trate as flags booleanas de forma " +
              "que a chamada mostre a intenção sem precisar consultar a definição.",
            hint: "Agrupe os argumentos em um objeto nomeado com valores padrão para o que costuma ser igual em quase toda chamada.",
            solution: {
              code: {
                language: "javascript",
                filename: "schedule-meeting.refactored.js",
                code: [
                  "function scheduleMeeting({ title, start, end, isOnline = false, sendInvites = true, reminderMinutes = 15 }) {",
                  "  // ...",
                  "}",
                  "",
                  "scheduleMeeting({ title: \"Planning\", start: \"09:00\", end: \"10:00\", isOnline: true, sendInvites: false });",
                ].join("\n"),
              },
              explanation:
                "Cada valor agora tem nome no ponto de chamada, a ordem não importa mais e reminderMinutes pôde ser " +
                "omitido por ter um padrão razoável. Se alguma flag mudasse muito o comportamento (não só um detalhe), " +
                "o próximo passo seria dividir em duas funções.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Guard Clauses",
          requires: ["Functions"],
          note: "early return — revisita Programming Foundations / Type Systems / Type Narrowing (mecanismo de tipos lá, estilo de código aqui)",
          collision: "≠ Type Narrowing (Programming Foundations / Type Systems) — mecanismo de type system × estilo de código",
          summary: "Uma Guard Clause é um if no começo da função que trata um caso de saída e retorna imediatamente.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O caso de saída pode ser uma entrada inválida, um caso vazio, uma permissão negada — a guarda retorna " +
                "(ou lança um erro) na hora. O que sobra depois dela é o caminho principal, escrito sem estar dentro de " +
                "nenhum bloco de condição.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Com as saídas resolvidas no topo, a última linha da função mostra o que ela de fato faz.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem guardas, cada pré-condição abre um if novo dentro do anterior e o código vira uma pirâmide de " +
                "aninhamentos. Quem lê precisa manter na cabeça todas as condições abertas até chegar, três ou " +
                "quatro níveis depois, ao que a função realmente faz. Com guardas, cada condição é resolvida e " +
                "\"esquecida\" assim que passa: quando o leitor chega ao trecho principal, já sabe que todas as " +
                "pré-condições foram atendidas.",
            },
            {
              type: "paragraph",
              text:
                "A forma é parecida com a de Type Narrowing (módulo Type Systems), mas o objetivo é outro: lá o " +
                "mecanismo convence o verificador de tipos; aqui é uma escolha de estilo para deixar o fluxo legível. " +
                "Vale para condições excepcionais — quando os dois ramos são igualmente normais, um if/else claro " +
                "continua sendo a melhor opção, e ter vários returns numa função não é um problema em si.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma função com condições aninhadas e com guard clauses:" },
            {
              type: "code",
              language: "javascript",
              filename: "guard-clauses.js",
              code: [
                "// Antes: o caminho principal está enterrado três níveis abaixo",
                "function getShippingCost(order) {",
                "  if (order) {",
                "    if (order.items.length > 0) {",
                "      if (order.address) {",
                "        return calculateCost(order.items, order.address);",
                "      }",
                "    }",
                "  }",
                "  return 0;",
                "}",
                "",
                "// Depois: cada exceção sai cedo; o caminho principal fica plano",
                "function getShippingCost(order) {",
                "  if (!order) return 0;",
                "  if (order.items.length === 0) return 0;",
                "  if (!order.address) return 0;",
                "",
                "  return calculateCost(order.items, order.address);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O comportamento é o mesmo, mas na segunda versão dá para ler as três regras de saída em sequência e " +
                "a última linha mostra o que a função de fato faz, sem estar dentro de nenhum bloco.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para rejeitar entradas inválidas no topo da função, antes de qualquer lógica.",
                "Dentro de laços, com `continue`, para descartar cedo o item que não interessa.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Quando os dois caminhos são comportamento normal e esperado, `if/else` comunica melhor que um retorno " +
                "antecipado.",
              ],
            },
          ],
          examples: [
            {
              title: "Validação de entrada no topo",
              context: "Funções que dependem de argumentos válidos ganham clareza ao rejeitar os inválidos antes de qualquer lógica.",
              code: {
                language: "javascript",
                filename: "input-guard.js",
                code: [
                  "function withdraw(account, amount) {",
                  "  if (amount <= 0) throw new Error(\"valor inválido\");",
                  "  if (amount > account.balance) throw new Error(\"saldo insuficiente\");",
                  "",
                  "  account.balance -= amount;",
                  "  return account.balance;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As duas regras de rejeição aparecem juntas, no topo, e o efeito real (debitar o valor) fica isolado " +
                "nas últimas linhas, onde ninguém precisa se perguntar se a entrada já foi validada.",
            },
            {
              title: "continue como guarda dentro de um laço",
              context: "O mesmo raciocínio vale em laços: pular o item que não interessa evita um bloco grande dentro do for.",
              code: {
                language: "javascript",
                filename: "loop-guard.js",
                code: [
                  "function sendReminders(users) {",
                  "  for (const user of users) {",
                  "    if (!user.isActive) continue;",
                  "    if (!user.email) continue;",
                  "",
                  "    sendReminderEmail(user);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Em vez de aninhar o envio dentro de dois if, cada condição descarta o usuário cedo e o comportamento " +
                "principal do laço (enviar o lembrete) fica alinhado à esquerda, fácil de localizar.",
            },
            {
              title: "Quando não usar: dois caminhos igualmente normais",
              context: "Guard clauses servem a casos excepcionais; quando os dois ramos são o comportamento esperado, if/else comunica melhor.",
              code: {
                language: "javascript",
                filename: "not-a-guard.js",
                code: [
                  "// Aqui os dois ramos são o comportamento normal — if/else é mais claro",
                  "function getPrice(product, isMember) {",
                  "  if (isMember) {",
                  "    return product.price * 0.9;",
                  "  } else {",
                  "    return product.price;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Ser membro não é um caso de erro ou exceção: é uma das duas situações normais do preço. Forçar um " +
                "early return aqui não acrescentaria clareza — o if/else mostra que são caminhos equivalentes.",
            },
          ],
          exercise: {
            problem:
              "Esta função tem quatro níveis de aninhamento para tratar condições que, na prática, são todas casos " +
              "de saída antecipada.",
            problemCode: {
              language: "javascript",
              filename: "apply-coupon.js",
              code: [
                "function applyCoupon(cart, coupon) {",
                "  if (cart) {",
                "    if (coupon) {",
                "      if (!coupon.isExpired) {",
                "        if (cart.total >= coupon.minTotal) {",
                "          return cart.total - coupon.discount;",
                "        }",
                "      }",
                "    }",
                "  }",
                "  return cart ? cart.total : 0;",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva a função usando guard clauses, de modo que o caminho principal (aplicar o desconto) fique " +
              "no nível base, sem aninhamento e mantendo exatamente o mesmo comportamento.",
            hint: "Inverta cada condição e retorne cedo. Cuidado com o retorno final: quando não há carrinho o valor é 0; senão, o total sem desconto.",
            solution: {
              code: {
                language: "javascript",
                filename: "apply-coupon.refactored.js",
                code: [
                  "function applyCoupon(cart, coupon) {",
                  "  if (!cart) return 0;",
                  "  if (!coupon) return cart.total;",
                  "  if (coupon.isExpired) return cart.total;",
                  "  if (cart.total < coupon.minTotal) return cart.total;",
                  "",
                  "  return cart.total - coupon.discount;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada condição de saída virou uma linha que descreve o motivo (sem carrinho, sem cupom, cupom expirado, " +
                "total abaixo do mínimo) e o desconto aparece sozinho no fim. O comportamento é o mesmo: qualquer caso " +
                "em que o cupom não vale devolve o total sem desconto.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Comments",
          note: "quando comentar (e quando não)",
          summary: "Comments são textos escritos ao lado do código, que o computador ignora e as pessoas leem.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A boa prática é tratá-los como último recurso: primeiro tente expressar a ideia no próprio código (com " +
                "um bom nome ou uma função extraída) e comente apenas o que o código sozinho não consegue dizer.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um comentário que diz o que o código faz envelhece, e um que diz por quê continua valendo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um comentário que repete o código é ruído, e pior: ele envelhece. O código muda, o comentário " +
                "esquecido continua ali e passa a mentir — e ninguém testa comentários. Por isso o comentário mais " +
                "valioso não descreve o que o código faz (isso o código diz), e sim o porquê: uma decisão não " +
                "óbvia, uma restrição de negócio, uma armadilha, um workaround para um bug de terceiros.",
            },
            {
              type: "paragraph",
              text:
                "Os comentários que valem a pena: o porquê de uma decisão, avisos de consequência (\"não altere sem " +
                "atualizar X\"), TODOs com contexto e a documentação de contratos públicos de uma API. Os que " +
                "atrapalham: os redundantes, os que compensam nomes ruins, o código comentado (o controle de versão " +
                "já guarda o histórico) e os diários de mudanças no meio do arquivo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um comentário que compensa um nome ruim, e outro que registra uma decisão que o código não mostra:" },
            {
              type: "code",
              language: "javascript",
              filename: "comments.js",
              code: [
                "// Antes: o comentário existe porque o nome não diz nada",
                "// timeout em milissegundos",
                "const t = 30000;",
                "",
                "// Depois: o nome diz o \"quê\"; o comentário registra só o \"porquê\"",
                "// O gateway leva até 25s em horário de pico — um timeout menor causa retry e cobrança duplicada.",
                "const PAYMENT_TIMEOUT_MS = 30000;",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O primeiro comentário só existia para explicar um nome ruim: corrigindo o nome, ele some. O segundo " +
                "diz algo que nenhum nome expressaria — a razão do valor —, e é o tipo de informação que quem mexer " +
                "aqui no futuro vai precisar.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Comentário que repete o que a linha já diz vira mais uma coisa a manter em sincronia com o código.",
                "Código comentado deixa dúvida sobre se volta a valer; o histórico do Git já guarda as versões antigas.",
                "Comentar para compensar um nome ruim esconde o problema em vez de resolvê-lo.",
              ],
            },
          ],
          examples: [
            {
              title: "Comentário redundante",
              context: "Repetir em linguagem natural o que a linha já diz só acrescenta algo a manter.",
              code: {
                language: "javascript",
                filename: "redundant-comment.js",
                code: [
                  "// Antes: o comentário não diz nada que o código não diga",
                  "// incrementa o contador em 1",
                  "counter += 1;",
                  "",
                  "// Depois: sem comentário — o código já é claro",
                  "counter += 1;",
                ].join("\n"),
              },
              explanation:
                "Se algum dia o incremento mudar para 2, o comentário antigo continua dizendo \"1\". Comentário " +
                "redundante é dívida: cada linha comentada é uma linha a mais a manter em sincronia.",
            },
            {
              title: "Código comentado: apague, o Git guarda",
              context: "Blocos de código desativados poluem o arquivo e deixam dúvida sobre se voltam a ser usados.",
              code: {
                language: "javascript",
                filename: "commented-out-code.js",
                code: [
                  "// Antes",
                  "function calculateTax(price) {",
                  "  // return price * 0.2;",
                  "  // return price * 0.18 + 5;",
                  "  return price * 0.15;",
                  "}",
                  "",
                  "// Depois",
                  "function calculateTax(price) {",
                  "  return price * 0.15;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As versões antigas não se perdem: estão no histórico do Git. Sem elas, quem lê vê somente o que é " +
                "válido hoje, e não se pergunta se aquelas linhas comentadas deveriam voltar.",
            },
            {
              title: "Comentário útil: workaround com contexto",
              context: "Um comentário que explica uma decisão estranha (e como removê-la um dia) é exatamente o que o código não consegue dizer.",
              code: {
                language: "javascript",
                filename: "workaround-comment.js",
                code: [
                  "function parsePrice(raw) {",
                  "  // WORKAROUND: a API de parceiros devolve \"1.234,56\" em vez de \"1234.56\" (issue #482).",
                  "  // Remover quando o parceiro corrigir o formato.",
                  "  const normalized = raw.replace(\".\", \"\").replace(\",\", \".\");",
                  "  return Number(normalized);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Sem o comentário, o replace duplo pareceria um erro e alguém poderia \"simplificá-lo\" e quebrar a " +
                "integração. Com ele, fica claro o porquê existe, de onde vem o problema e quando pode ser removido.",
            },
          ],
          exercise: {
            problem:
              "Este trecho tem quatro comentários. Alguns ajudam, outros só atrapalham, e um deles existe apenas " +
              "porque um nome está ruim.",
            problemCode: {
              language: "javascript",
              filename: "shipping.js",
              code: [
                "// função que calcula o frete",
                "function f(w) {",
                "  // multiplica o peso por 2.5",
                "  const c = w * 2.5;",
                "  // const c = w * 3;",
                "  // frete mínimo exigido pela transportadora contratada em 2024",
                "  if (c < 15) return 15;",
                "  return c;",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva o trecho: renomeie o que estiver ruim, apague os comentários que só repetem ou compensam " +
              "o código e mantenha apenas o que realmente explica um porquê.",
            hint: "Para cada comentário, pergunte: \"o código (com um bom nome) já diz isso?\" e \"existe algum motivo aqui que o código não consegue expressar?\".",
            solution: {
              code: {
                language: "javascript",
                filename: "shipping.refactored.js",
                code: [
                  "function calculateShippingCost(weightKg) {",
                  "  const cost = weightKg * 2.5;",
                  "  // Frete mínimo exigido pela transportadora contratada em 2024.",
                  "  if (cost < 15) return 15;",
                  "  return cost;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "\"Função que calcula o frete\" virou o nome calculateShippingCost; \"multiplica o peso por 2.5\" só " +
                "repetia o código; o código comentado (w * 3) foi apagado — o Git guarda. Só sobrou o comentário do " +
                "frete mínimo, o único que registra uma razão de negócio que o código não expressa.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Magic Numbers",
          note: "extrair para constantes nomeadas. Inclui a técnica \"substituir por constante\" — não vira Task própria (ver Refactoring)",
          summary: "Um Magic Number é um valor literal no código cujo significado não fica claro pelo contexto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Exemplos: 86400000, 0.07, 3. A prática é substituí-lo por uma constante com um nome que diga o que o " +
                "valor representa (ONE_DAY_MS, LOYALTY_DISCOUNT_RATE, MAX_RETRIES).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um número repetido em cinco lugares é uma regra de negócio esperando para ficar inconsistente.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quem lê if (attempts > 3) não sabe se 3 é uma regra de negócio, um limite técnico ou um palpite. E " +
                "se o mesmo valor aparece em cinco lugares, mudá-lo exige achar todos — e esquecer um deles gera " +
                "bugs que só aparecem em produção. Uma constante nomeada responde à dúvida e concentra a mudança em " +
                "um único ponto.",
            },
            {
              type: "paragraph",
              text:
                "Dois cuidados. Primeiro: nomeie o significado, não o valor (MAX_LOGIN_ATTEMPTS, não THREE) — " +
                "senão o nome deixa de fazer sentido no dia em que o valor muda. Segundo: nem todo literal é mágico; " +
                "0, 1 e -1 em contextos óbvios (índice inicial, incremento, \"não encontrado\") são claros como " +
                "estão, e extrair tudo produz constantes que só atrapalham. A técnica mecânica de fazer essa " +
                "substituição com segurança é vista no módulo Refactoring; aqui o foco é o princípio.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "os mesmos números, soltos e nomeados:" },
            {
              type: "code",
              language: "javascript",
              filename: "magic-numbers.js",
              code: [
                "// Antes: o que são 18, 250, 0.07 e 86400000?",
                "if (user.age >= 18 && cart.total > 250) applyDiscount(cart, 0.07);",
                "setTimeout(refresh, 86400000);",
                "",
                "// Depois: cada valor diz o que significa e tem um único lugar para mudar",
                "const LEGAL_AGE = 18;",
                "const LOYALTY_MIN_TOTAL = 250;",
                "const LOYALTY_DISCOUNT_RATE = 0.07;",
                "const ONE_DAY_MS = 24 * 60 * 60 * 1000;",
                "",
                "if (user.age >= LEGAL_AGE && cart.total > LOYALTY_MIN_TOTAL) applyDiscount(cart, LOYALTY_DISCOUNT_RATE);",
                "setTimeout(refresh, ONE_DAY_MS);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A regra de negócio agora se lê em voz alta (\"maior de idade e total acima do mínimo de fidelidade\"), " +
                "e ONE_DAY_MS mostra a conta em vez de um número que ninguém consegue conferir de cabeça.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o mesmo valor aparece em mais de um lugar e uma mudança precisa acontecer em um só ponto.",
                "Quando o número ou texto carrega uma regra que não é óbvia, como limites, prazos e códigos de status.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Nem todo valor pede constante: o que já é óbvio no contexto (como `0` ou `1` num índice) só ganha ruído ao " +
                "ser nomeado.",
                "Mesmo valor com significados diferentes pede constantes diferentes; reaproveitar uma só cria acoplamento falso.",
              ],
            },
          ],
          examples: [
            {
              title: "O mesmo valor repetido em vários lugares",
              context: "Quando uma regra aparece em mais de um ponto, esquecer de atualizar um deles gera comportamento inconsistente.",
              code: {
                language: "javascript",
                filename: "repeated-value.js",
                code: [
                  "// Antes: o limite está em dois lugares, com risco de divergir",
                  "if (attempts >= 5) lockAccount(user);",
                  "showMessage(`Restam ${5 - attempts} tentativas`);",
                  "",
                  "// Depois: uma constante, uma fonte de verdade",
                  "const MAX_LOGIN_ATTEMPTS = 5;",
                  "if (attempts >= MAX_LOGIN_ATTEMPTS) lockAccount(user);",
                  "showMessage(`Restam ${MAX_LOGIN_ATTEMPTS - attempts} tentativas`);",
                ].join("\n"),
              },
              explanation:
                "Se a regra passar para 3 tentativas, basta mudar uma linha — e a mensagem exibida ao usuário " +
                "continua consistente com o bloqueio real.",
            },
            {
              title: "Mesmo valor, significados diferentes",
              context: "Dois números iguais nem sempre representam a mesma coisa; nomear cada um evita trocas que só um \"substituir tudo\" faria.",
              code: {
                language: "javascript",
                filename: "same-value-different-meaning.js",
                code: [
                  "// Antes: 60 significa coisas completamente distintas",
                  "const seconds = totalMinutes * 60;",
                  "const isRetired = age >= 60;",
                  "",
                  "// Depois: cada 60 tem seu próprio nome",
                  "const SECONDS_PER_MINUTE = 60;",
                  "const RETIREMENT_AGE = 60;",
                  "",
                  "const seconds = totalMinutes * SECONDS_PER_MINUTE;",
                  "const isRetired = age >= RETIREMENT_AGE;",
                ].join("\n"),
              },
              explanation:
                "Se a idade de aposentadoria mudar para 65, uma busca e substituição de 60 por 65 quebraria a " +
                "conversão de minutos. Com constantes distintas, cada regra muda de forma independente.",
            },
            {
              title: "Textos mágicos também contam",
              context: "Strings usadas como códigos (status, tipos, chaves) têm os mesmos problemas: um erro de digitação passa sem aviso.",
              code: {
                language: "javascript",
                filename: "magic-strings.js",
                code: [
                  "// Antes: um typo (\"pendng\") não gera erro, só um comportamento errado",
                  "if (order.status === \"pending\") notifyWarehouse(order);",
                  "",
                  "// Depois: valores centralizados e reutilizáveis",
                  "const OrderStatus = Object.freeze({ PENDING: \"pending\", SHIPPED: \"shipped\", CANCELED: \"canceled\" });",
                  "",
                  "if (order.status === OrderStatus.PENDING) notifyWarehouse(order);",
                ].join("\n"),
              },
              explanation:
                "Escrever OrderStatus.PENDNG devolve undefined (o erro aparece logo), enquanto \"pendng\" solto é " +
                "uma string válida que nunca casa com nada. Centralizar também mostra, num lugar só, todos os " +
                "status possíveis.",
            },
          ],
          exercise: {
            problem:
              "Esta função de frete tem três números soltos cujo significado só quem a escreveu conhece.",
            problemCode: {
              language: "javascript",
              filename: "shipping-cost.js",
              code: [
                "function shippingCost(subtotal, weightKg) {",
                "  if (subtotal >= 200) return 0;",
                "  const cost = 12 + weightKg * 1.5;",
                "  return cost;",
                "}",
              ].join("\n"),
            },
            task:
              "Substitua os números soltos por constantes com nomes que expliquem o significado de cada valor, sem " +
              "mudar o comportamento da função.",
            hint: "Pergunte, para cada número, \"que regra de negócio ele representa?\" e nomeie a regra, não o valor.",
            solution: {
              code: {
                language: "javascript",
                filename: "shipping-cost.refactored.js",
                code: [
                  "const FREE_SHIPPING_MIN_SUBTOTAL = 200;",
                  "const BASE_SHIPPING_FEE = 12;",
                  "const FEE_PER_KG = 1.5;",
                  "",
                  "function shippingCost(subtotal, weightKg) {",
                  "  if (subtotal >= FREE_SHIPPING_MIN_SUBTOTAL) return 0;",
                  "  return BASE_SHIPPING_FEE + weightKg * FEE_PER_KG;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agora a regra de frete se lê como texto — grátis acima de um subtotal mínimo, senão taxa base mais " +
                "valor por quilo — e mudar qualquer parâmetro comercial é editar uma constante, sem caçar números " +
                "pelo código.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "design-heuristics",
      order: 20,
      title: "Design Heuristics",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary: "Paralela a Clean Code — heurísticas de design que não dependem dela. DRY → KISS → YAGNI → Principle of Least Astonishment.",
      concepts: [
        concept({
          order: 10,
          title: "DRY",
          note: "Don't Repeat Yourself",
          summary:
            "DRY (Don't Repeat Yourself) é o princípio de que cada conhecimento do sistema deve ter uma única " +
            "representação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Repare na palavra: conhecimento, não texto. O alvo não é código que \"parece igual\", e sim a mesma regra " +
                "ou decisão escrita em mais de um lugar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Antes de unir dois trechos iguais, pergunte se eles mudariam sempre juntos, porque só nesse caso são o " +
                "mesmo conhecimento.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando a mesma regra vive em vários lugares, toda mudança vira uma caça: se você atualiza três dos " +
                "quatro pontos e esquece um, o sistema passa a se contradizer — e o bug aparece só no caminho que " +
                "ninguém lembrou de atualizar. Centralizar a regra transforma \"lembrar de mudar em todo lugar\" em " +
                "\"mudar uma vez\".",
            },
            {
              type: "paragraph",
              text:
                "O cuidado é não aplicar DRY de forma mecânica. Dois trechos que parecem iguais mas existem por " +
                "razões diferentes (duplicação acidental) vão evoluir separados; uni-los cria uma abstração que " +
                "passa a exigir parâmetros e exceções para acomodar os dois, e isso costuma ser pior que a " +
                "repetição. Uma regra prática é esperar a terceira ocorrência antes de abstrair. A manifestação " +
                "concreta da violação, vista no código, é o smell Duplicate Code (módulo Code Smells).",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma regra de negócio escrita em dois lugares, e depois centralizada:" },
            {
              type: "code",
              language: "javascript",
              filename: "dry.js",
              code: [
                "// Antes: a regra \"frete grátis acima de 200\" está em dois lugares",
                "function cartSummary(cart) {",
                "  const shipping = cart.total >= 200 ? 0 : 15;",
                "  return cart.total + shipping;",
                "}",
                "",
                "function checkoutLabel(cart) {",
                "  return cart.total >= 200 ? \"Frete grátis\" : \"Frete: R$ 15\";",
                "}",
                "",
                "// Depois: uma única fonte da regra",
                "const FREE_SHIPPING_MIN_TOTAL = 200;",
                "const SHIPPING_FEE = 15;",
                "",
                "function shippingFor(cart) {",
                "  return cart.total >= FREE_SHIPPING_MIN_TOTAL ? 0 : SHIPPING_FEE;",
                "}",
                "",
                "function cartSummary(cart) {",
                "  return cart.total + shippingFor(cart);",
                "}",
                "",
                "function checkoutLabel(cart) {",
                "  return shippingFor(cart) === 0 ? \"Frete grátis\" : `Frete: R$ ${SHIPPING_FEE}`;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Se o frete grátis passar a valer a partir de 250, a mudança é uma linha, e a tela e o cálculo " +
                "continuam concordando — porque as duas leem a mesma regra.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "DRY trata de conhecimento duplicado, não de texto parecido: dois trechos com o mesmo formato podem mudar " +
                "por motivos diferentes.",
                "Unificar duplicação acidental obriga a inventar parâmetros ou a quebrar um dos usos quando as regras se " +
                "separarem.",
                "Listas e dados derivados de outra fonte também contam: escrevê-los duas vezes recria o problema.",
              ],
            },
          ],
          examples: [
            {
              title: "Regra de validação repetida",
              context: "A mesma validação copiada em dois fluxos é um caso clássico: quando a regra mudar, um deles vai ficar para trás.",
              code: {
                language: "javascript",
                filename: "duplicated-validation.js",
                code: [
                  "// Antes: a regra de e-mail existe duas vezes",
                  "function register(email) {",
                  "  if (!email.includes(\"@\") || email.length < 5) throw new Error(\"e-mail inválido\");",
                  "}",
                  "function updateProfile(email) {",
                  "  if (!email.includes(\"@\") || email.length < 5) throw new Error(\"e-mail inválido\");",
                  "}",
                  "",
                  "// Depois: uma função, dois usos",
                  "function assertValidEmail(email) {",
                  "  if (!email.includes(\"@\") || email.length < 5) throw new Error(\"e-mail inválido\");",
                  "}",
                  "function register(email) { assertValidEmail(email); }",
                  "function updateProfile(email) { assertValidEmail(email); }",
                ].join("\n"),
              },
              explanation:
                "Se a regra ficar mais rígida (por exemplo, exigir um domínio), basta alterar assertValidEmail — o " +
                "cadastro e a edição de perfil passam a aceitar exatamente os mesmos e-mails.",
            },
            {
              title: "Duplicação acidental: parecido não é igual",
              context: "Dois trechos com o mesmo formato podem representar conhecimentos diferentes que vão mudar por motivos diferentes.",
              code: {
                language: "javascript",
                filename: "accidental-duplication.js",
                code: [
                  "// Parecem iguais, mas são regras de negócio distintas",
                  "function isEligibleForStudentDiscount(user) {",
                  "  return user.age < 26;",
                  "}",
                  "function isEligibleForYouthTicket(user) {",
                  "  return user.age < 26;",
                  "}",
                  "",
                  "// Unificar em isUnder26(user) amarraria duas regras que podem mudar",
                  "// de forma independente (e uma delas vai mudar).",
                ].join("\n"),
              },
              explanation:
                "O desconto de estudante e o ingresso jovem hoje usam o mesmo limite por coincidência. Se o ingresso " +
                "jovem passar a valer até os 29, uma função compartilhada obrigaria a inventar parâmetros ou a " +
                "quebrar o desconto de estudante sem querer.",
            },
            {
              title: "Uma única fonte de verdade para dados derivados",
              context: "DRY vale também para dados: se uma lista pode ser derivada de outra, não a escreva duas vezes.",
              code: {
                language: "javascript",
                filename: "single-source.js",
                code: [
                  "// Antes: os mesmos status listados em dois lugares",
                  "const STATUSES = [\"pending\", \"shipped\", \"canceled\"];",
                  "const STATUS_LABELS = { pending: \"Pendente\", shipped: \"Enviado\", canceled: \"Cancelado\" };",
                  "",
                  "// Depois: a lista de status sai do próprio mapa de rótulos",
                  "const STATUS_LABELS = { pending: \"Pendente\", shipped: \"Enviado\", canceled: \"Cancelado\" };",
                  "const STATUSES = Object.keys(STATUS_LABELS);",
                ].join("\n"),
              },
              explanation:
                "Ao adicionar um status novo, basta incluí-lo no mapa; a lista STATUSES se atualiza sozinha, sem o " +
                "risco de existir um rótulo sem status ou o contrário.",
            },
          ],
          exercise: {
            problem:
              "Estas duas funções calculam o preço final com desconto de cliente fiel, e a regra do desconto está " +
              "escrita nas duas. Semana que vem, o desconto passa de 10% para 12%.",
            problemCode: {
              language: "javascript",
              filename: "pricing.js",
              code: [
                "function bookPrice(book, customer) {",
                "  if (customer.years >= 3) return book.price * 0.9;",
                "  return book.price;",
                "}",
                "",
                "function subscriptionPrice(plan, customer) {",
                "  if (customer.years >= 3) return plan.price * 0.9;",
                "  return plan.price;",
                "}",
              ].join("\n"),
            },
            task:
              "Reorganize o código para que a regra do desconto de cliente fiel exista em um único lugar, de modo " +
              "que a mudança para 12% seja feita em uma linha.",
            hint: "O que é comum às duas funções é a regra \"cliente com 3 anos ou mais ganha desconto\". Extraia só essa regra, deixando o preço de cada produto onde está.",
            solution: {
              code: {
                language: "javascript",
                filename: "pricing.refactored.js",
                code: [
                  "const LOYALTY_MIN_YEARS = 3;",
                  "const LOYALTY_DISCOUNT_RATE = 0.1;",
                  "",
                  "function applyLoyaltyDiscount(price, customer) {",
                  "  if (customer.years >= LOYALTY_MIN_YEARS) return price * (1 - LOYALTY_DISCOUNT_RATE);",
                  "  return price;",
                  "}",
                  "",
                  "function bookPrice(book, customer) {",
                  "  return applyLoyaltyDiscount(book.price, customer);",
                  "}",
                  "",
                  "function subscriptionPrice(plan, customer) {",
                  "  return applyLoyaltyDiscount(plan.price, customer);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A regra do desconto agora está em applyLoyaltyDiscount, e passar de 10% para 12% é trocar " +
                "LOYALTY_DISCOUNT_RATE por 0.12. Repare que só a regra foi centralizada: bookPrice e " +
                "subscriptionPrice continuam separadas, porque cada uma pode mudar por motivos próprios.",
            },
          },
        }),
        concept({
          order: 20,
          title: "KISS",
          note: "Keep It Simple",
          summary:
            "KISS (Keep It Simple) é a heurística de escolher, entre as soluções que resolvem o problema, a mais " +
            "simples de entender e de mudar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Simples aqui não quer dizer \"curta\" nem \"fácil de escrever\": quer dizer com poucas partes móveis e com " +
                "um caminho de leitura direto.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada camada ou truque a mais precisa ser entendido por alguém antes de qualquer mudança, então só aceite " +
                "os que compram algo real.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Todo código precisa ser lido, depurado e alterado por alguém — muitas vezes por você mesmo meses " +
                "depois, sem lembrar do contexto. Cada camada, padrão ou truque a mais é algo que essa pessoa " +
                "precisa entender antes de poder mudar qualquer coisa. Complexidade também é onde os bugs se " +
                "escondem: quanto mais partes interagem, mais casos existem que ninguém pensou em testar.",
            },
            {
              type: "paragraph",
              text:
                "Os desvios mais comuns são o código \"esperto\" (uma linha compacta que exige decifração), o " +
                "excesso de engenharia (uma arquitetura flexível para um problema pequeno) e reinventar o que a " +
                "linguagem ou a biblioteca padrão já oferece. KISS não é contra a complexidade necessária: se o " +
                "problema é complexo, a solução será. A pergunta é se cada parte complexa está pagando o seu custo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma solução \"esperta\" e uma simples para o mesmo problema:" },
            {
              type: "code",
              language: "javascript",
              filename: "kiss.js",
              code: [
                "// Antes: compacto, mas exige decifrar para entender",
                "const label = (n) => (n % 15 ? (n % 5 ? (n % 3 ? n : \"Fizz\") : \"Buzz\") : \"FizzBuzz\");",
                "",
                "// Depois: mais linhas, mas cada uma se lê sozinha",
                "function label(n) {",
                "  if (n % 15 === 0) return \"FizzBuzz\";",
                "  if (n % 3 === 0) return \"Fizz\";",
                "  if (n % 5 === 0) return \"Buzz\";",
                "  return n;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A segunda versão é mais longa, mas é a mais simples de ler: cada regra é uma linha, na ordem em que " +
                "é verificada, sem condições aninhadas ou lógica invertida para decifrar.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Simples não é o que tem menos linhas: uma expressão compacta pode ser cara de ler.",
                "Estrutura demais para um problema pequeno vira o próprio problema; introduza-a quando as regras crescerem " +
                "de verdade.",
                "Reimplementar o que a biblioteca padrão já oferece cria código a mais para manter.",
              ],
            },
          ],
          examples: [
            {
              title: "Código esperto versus código claro",
              context: "Uma expressão compacta pode ser impressionante de escrever e cara de ler.",
              code: {
                language: "javascript",
                filename: "clever-vs-clear.js",
                code: [
                  "// Antes: reduce + spread para contar ocorrências",
                  "const counts = words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] || 0) + 1 }), {});",
                  "",
                  "// Depois: um laço simples faz o mesmo, sem truque",
                  "const counts = {};",
                  "for (const word of words) {",
                  "  counts[word] = (counts[word] || 0) + 1;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O laço comunica \"para cada palavra, some um\" sem exigir que se entenda o acumulador reconstruído " +
                "a cada volta. Ele também evita, sem esforço, o custo de copiar o objeto inteiro a cada palavra.",
            },
            {
              title: "Engenharia demais para um problema pequeno",
              context: "Quando a solução tem mais estrutura do que o problema pede, a estrutura vira o problema.",
              code: {
                language: "javascript",
                filename: "over-engineering.js",
                code: [
                  "// Antes: um motor de regras configurável para duas verificações",
                  "class RuleEngine {",
                  "  constructor(rules) { this.rules = rules; }",
                  "  run(input) { return this.rules.every((rule) => rule.check(input)); }",
                  "}",
                  "const engine = new RuleEngine([{ check: (u) => u.age >= 18 }, { check: (u) => u.hasConsent }]);",
                  "engine.run(user);",
                  "",
                  "// Depois: as duas regras, escritas diretamente",
                  "const canSignUp = user.age >= 18 && user.hasConsent;",
                ].join("\n"),
              },
              explanation:
                "Para duas condições fixas, a expressão direta é mais fácil de ler e de testar do que uma classe " +
                "configurável. Se as regras crescerem de verdade, dá para introduzir a estrutura então.",
            },
            {
              title: "Usar o que a linguagem já oferece",
              context: "Reimplementar algo que a biblioteca padrão já resolve cria código a mais para manter, e possíveis bugs.",
              code: {
                language: "javascript",
                filename: "use-the-standard-library.js",
                code: [
                  "// Antes: remoção de duplicados feita à mão",
                  "function unique(items) {",
                  "  const result = [];",
                  "  for (const item of items) {",
                  "    if (!result.includes(item)) result.push(item);",
                  "  }",
                  "  return result;",
                  "}",
                  "",
                  "// Depois: a própria linguagem faz isso",
                  "const uniqueItems = [...new Set(items)];",
                ].join("\n"),
              },
              explanation:
                "Uma linha com um recurso conhecido substitui uma função inteira para manter e testar — e quem lê " +
                "reconhece o idioma imediatamente.",
            },
          ],
          exercise: {
            problem:
              "Esta função devolve o nível de um usuário conforme seus pontos, mas usa ternários aninhados e uma " +
              "variável auxiliar que dificultam a leitura.",
            problemCode: {
              language: "javascript",
              filename: "level.js",
              code: [
                "function getLevel(points) {",
                "  let level;",
                "  level = points >= 1000 ? \"ouro\" : points >= 500 ? \"prata\" : points >= 100 ? \"bronze\" : \"iniciante\";",
                "  return level;",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva a função da forma mais simples de ler possível, mantendo exatamente o mesmo resultado para " +
              "qualquer valor de pontos.",
            hint: "Não precisa de variável auxiliar nem de ternário aninhado: verifique do maior limite para o menor, retornando assim que encontrar um caso.",
            solution: {
              code: {
                language: "javascript",
                filename: "level.refactored.js",
                code: [
                  "function getLevel(points) {",
                  "  if (points >= 1000) return \"ouro\";",
                  "  if (points >= 500) return \"prata\";",
                  "  if (points >= 100) return \"bronze\";",
                  "  return \"iniciante\";",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada faixa é uma linha, na ordem em que é verificada, e a variável level desapareceu porque nunca " +
                "foi necessária. Para adicionar uma faixa nova, basta inserir uma linha no lugar certo.",
            },
          },
        }),
        concept({
          order: 30,
          title: "YAGNI",
          note: "You Aren't Gonna Need It — ver colisão conceitual com Speculative Generality (Code Smells, não incluída como Task)",
          summary:
            "YAGNI (You Aren't Gonna Need It) é a regra de não implementar algo só porque talvez seja útil no futuro.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ela vale para funcionalidades, opções, parâmetros e camadas de abstração: só entram no código quando há " +
                "uma necessidade concreta e presente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quando a necessidade real chegar, ela quase nunca será igual à que você imaginou, então deixe o código " +
                "fácil de mudar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Código especulativo tem custo imediato e benefício incerto. É preciso escrevê-lo, testá-lo, " +
                "documentá-lo e mantê-lo, e ele complica todo o código ao redor — tudo por algo que pode nunca ser " +
                "usado. Pior: quando a necessidade real chega, ela quase nunca tem a forma que se imaginou, e o " +
                "código construído \"para o futuro\" acaba sendo reescrito ou contornado.",
            },
            {
              type: "paragraph",
              text:
                "YAGNI não é ausência de planejamento nem licença para código desleixado: significa manter o " +
                "código simples e fácil de mudar, para que acrescentar a funcionalidade quando ela for necessária " +
                "seja barato. A exceção são as decisões muito caras de reverter depois (o formato de dados " +
                "persistidos ou de uma API pública), onde alguma previsão compensa. Vale distinguir do smell " +
                "Speculative Generality (módulo Code Smells): YAGNI é o princípio, que se aplica antes de escrever; o " +
                "smell é o resultado visível de tê-lo ignorado, ao olhar o código pronto.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um recurso \"para o futuro\" que ninguém usa, e a versão sem ele:" },
            {
              type: "code",
              language: "javascript",
              filename: "yagni.js",
              code: [
                "// Antes: suporte a vários formatos \"caso precise\" — só CSV é usado",
                "function exportReport(report, format = \"csv\") {",
                "  if (format === \"csv\") return toCsv(report);",
                "  if (format === \"xml\") return toXml(report);",
                "  if (format === \"pdf\") return toPdf(report);",
                "  throw new Error(\"formato desconhecido\");",
                "}",
                "",
                "// Depois: só o que existe hoje",
                "function exportReport(report) {",
                "  return toCsv(report);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "toXml e toPdf precisariam ser escritos, testados e mantidos sem que ninguém peça. Se um dia XML for " +
                "realmente necessário, o requisito real (versão, schema, campos) provavelmente será diferente do " +
                "que se imaginaria hoje — e adicioná-lo a uma função simples é barato.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Parâmetros e opções criados \"por flexibilidade\" viram superfície a testar e a explicar, mesmo sem uso.",
                "Uma abstração para uma troca que talvez nunca aconteça adiciona uma camada com uma única implementação.",
                "Não vale para tudo: decisões caras de reverter, como o formato de dados já gravados, merecem previsão.",
              ],
            },
          ],
          examples: [
            {
              title: "Parâmetro que ninguém usa",
              context: "Opções adicionadas \"para dar flexibilidade\" viram superfície a testar e a explicar, mesmo sem uso.",
              code: {
                language: "javascript",
                filename: "unused-option.js",
                code: [
                  "// Antes: locale e timezone nunca são passados por nenhum chamador",
                  "function formatDate(date, locale = \"pt-BR\", timezone = \"America/Sao_Paulo\", style = \"short\") {",
                  "  return date.toLocaleDateString(locale, { timeZone: timezone, dateStyle: style });",
                  "}",
                  "",
                  "// Depois: o que de fato é usado",
                  "function formatDate(date) {",
                  "  return date.toLocaleDateString(\"pt-BR\", { dateStyle: \"short\" });",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Três parâmetros a menos para documentar e testar. Se um chamador precisar de outro idioma, o " +
                "parâmetro é acrescentado nesse dia, guiado por um uso real.",
            },
            {
              title: "Abstração para uma troca que talvez nunca aconteça",
              context: "Criar uma interface \"caso um dia mudemos o banco\" adiciona uma camada que só terá uma implementação.",
              code: {
                language: "javascript",
                filename: "premature-abstraction.js",
                code: [
                  "// Antes: uma camada extra com uma única implementação possível",
                  "class UserRepository {",
                  "  findById(id) { throw new Error(\"não implementado\"); }",
                  "}",
                  "class PostgresUserRepository extends UserRepository {",
                  "  findById(id) { return db.query(\"SELECT * FROM users WHERE id = $1\", [id]); }",
                  "}",
                  "",
                  "// Depois: a função que faz o trabalho",
                  "function findUserById(id) {",
                  "  return db.query(\"SELECT * FROM users WHERE id = $1\", [id]);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se algum dia houver um segundo banco, extrair a interface a partir de uma função concreta é uma " +
                "refatoração pequena — e o desenho sairá dos dois casos reais, não de um palpite.",
            },
            {
              title: "Exceção: o que é caro de mudar depois",
              context: "YAGNI não proíbe toda previsão — decisões difíceis de reverter, como o formato de dados já gravados, merecem um cuidado a mais.",
              code: {
                language: "javascript",
                filename: "cheap-insurance.js",
                code: [
                  "// Um campo de versão custa uma linha hoje e evita migrações dolorosas depois,",
                  "// quando já existirem milhares de arquivos salvos no formato antigo.",
                  "function saveSettings(settings) {",
                  "  const file = { version: 1, ...settings };",
                  "  fs.writeFileSync(\"settings.json\", JSON.stringify(file));",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Aqui a previsão é barata e o custo de errar é alto (dados já espalhados por aí). O critério é " +
                "sempre a assimetria: se acrescentar depois for fácil, espere; se for muito caro, um pequeno " +
                "investimento agora pode valer a pena.",
            },
          ],
          exercise: {
            problem:
              "Uma equipe pediu apenas o envio de e-mail de boas-vindas. Alguém antecipou \"necessidades futuras\" e " +
              "construiu um sistema de notificações com canais e registro de provedores que ninguém usa.",
            problemCode: {
              language: "javascript",
              filename: "notifier.js",
              code: [
                "const channels = new Map();",
                "function registerChannel(name, sender) { channels.set(name, sender); }",
                "registerChannel(\"email\", (user, msg) => mailer.send(user.email, msg));",
                "registerChannel(\"sms\", (user, msg) => sms.send(user.phone, msg));",
                "registerChannel(\"push\", (user, msg) => push.send(user.deviceId, msg));",
                "",
                "function notify(user, msg, channel = \"email\") {",
                "  return channels.get(channel)(user, msg);",
                "}",
                "",
                "notify(user, \"Bem-vindo!\");",
              ].join("\n"),
            },
            task:
              "Simplifique o código para fazer somente o que é pedido hoje — enviar o e-mail de boas-vindas — " +
              "removendo o que é especulativo.",
            hint: "Só existe uma chamada, e ela usa o canal padrão (e-mail). O que acontece com o registro de canais, o SMS e o push?",
            solution: {
              code: {
                language: "javascript",
                filename: "notifier.refactored.js",
                code: [
                  "function sendWelcomeEmail(user) {",
                  "  return mailer.send(user.email, \"Bem-vindo!\");",
                  "}",
                  "",
                  "sendWelcomeEmail(user);",
                ].join("\n"),
              },
              explanation:
                "O registro de canais, o SMS e o push não têm nenhum uso hoje — são código para manter sem " +
                "benefício. Quando surgir a necessidade de um segundo canal, o desenho poderá partir de um " +
                "requisito real (que canais? com que regras?) em vez de um palpite.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Principle of Least Astonishment",
          note: "o código não deve surpreender quem lê",
          summary:
            "O Principle of Least Astonishment diz que um código deve fazer o que o nome e o contexto levam alguém a " +
            "esperar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Quando o comportamento real diverge da expectativa razoável — um getter que altera estado, um retorno de " +
                "tipo diferente conforme o caso —, o código está surpreendendo quem o usa, mesmo que \"funcione\".",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Todo efeito que o nome de uma função não anuncia é um bug esperando alguém que confiou no nome.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quem usa uma função raramente lê a implementação: confia no nome, na assinatura e nas convenções " +
                "do resto do código. Uma surpresa quebra essa confiança de forma silenciosa. O código \"funciona\", " +
                "mas a pessoa que o chamou assumiu algo diferente, e o bug aparece longe do lugar onde a " +
                "expectativa foi violada — o tipo de defeito mais caro de investigar.",
            },
            {
              type: "paragraph",
              text:
                "Alguns focos: nomes que descrevem o comportamento inteiro (incluindo efeitos colaterais), " +
                "convenções consistentes dentro do mesmo código (se uma função devolve um novo array, as vizinhas " +
                "também), retornos de tipo previsível e padrões que não escondem comportamentos perigosos. Em " +
                "dúvida, escolha o comportamento que a maioria das pessoas assumiria.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função cujo nome promete uma coisa e o corpo faz duas:" },
            {
              type: "code",
              language: "javascript",
              filename: "least-astonishment.js",
              code: [
                "// Antes: quem chama getUser não espera que ele altere o banco",
                "function getUser(id) {",
                "  const user = db.users.find(id);",
                "  user.lastSeenAt = Date.now();",
                "  db.users.save(user);",
                "  return user;",
                "}",
                "",
                "// Depois: leitura é leitura; o efeito tem nome e é chamado de forma explícita",
                "function getUser(id) {",
                "  return db.users.find(id);",
                "}",
                "",
                "function markUserSeen(id) {",
                "  const user = db.users.find(id);",
                "  user.lastSeenAt = Date.now();",
                "  db.users.save(user);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na primeira versão, qualquer tela que apenas consulta um usuário passaria a marcá-lo como \"visto\" " +
                "e gravaria no banco — um efeito que ninguém procuraria ao ler o nome getUser. Na segunda, o que " +
                "cada função faz está na cara do nome.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Funções irmãs com convenções diferentes (uma altera o original, outra devolve cópia) levam a erros de uso.",
                "Devolver tipos diferentes para o mesmo caso obriga quem chama a checar tudo e permite tratar \"ausente\" " +
                "como valor.",
                "Um valor padrão não deve esconder uma ação destrutiva: o perigoso só acontece quando pedido de forma explícita.",
              ],
            },
          ],
          examples: [
            {
              title: "Convenção inconsistente dentro do mesmo módulo",
              context: "Funções irmãs devem seguir a mesma regra; quando uma altera o original e outra devolve uma cópia, alguém vai errar.",
              code: {
                language: "javascript",
                filename: "inconsistent-convention.js",
                code: [
                  "// Antes: addItem altera o carrinho; removeItem devolve um novo — quem chama erra",
                  "function addItem(cart, item) {",
                  "  cart.items.push(item);",
                  "}",
                  "function removeItem(cart, itemId) {",
                  "  return { ...cart, items: cart.items.filter((i) => i.id !== itemId) };",
                  "}",
                  "",
                  "// Depois: as duas seguem a mesma convenção (devolvem um novo carrinho)",
                  "function addItem(cart, item) {",
                  "  return { ...cart, items: [...cart.items, item] };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Na versão inconsistente, é fácil chamar removeItem(cart, id) e ignorar o retorno (o carrinho não " +
                "muda), ou esperar um retorno de addItem que não existe. Com uma convenção só, o que uma função " +
                "faz permite prever as demais.",
            },
            {
              title: "Retornos de tipos diferentes para o mesmo caso",
              context: "Uma função que devolve um valor, um booleano ou uma string conforme a situação obriga o chamador a checar tudo.",
              code: {
                language: "javascript",
                filename: "mixed-returns.js",
                code: [
                  "// Antes: 'não encontrado' pode ser -1, false ou texto dependendo do caminho",
                  "function findPrice(sku) {",
                  "  if (!sku) return false;",
                  "  const product = catalog.get(sku);",
                  "  if (!product) return \"não encontrado\";",
                  "  return product.price;",
                  "}",
                  "",
                  "// Depois: um único sinal de ausência",
                  "function findPrice(sku) {",
                  "  const product = catalog.get(sku);",
                  "  return product ? product.price : null;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com a primeira versão, um `if (price)` trataria o preço zero como ausência e o texto \"não " +
                "encontrado\" poderia ser somado como se fosse um número. Um único sinal de ausência (null) é " +
                "previsível e fácil de tratar.",
            },
            {
              title: "Valor padrão que surpreende",
              context: "Padrões devem ser o comportamento mais seguro e esperado, não uma ação destrutiva escondida.",
              code: {
                language: "javascript",
                filename: "surprising-default.js",
                code: [
                  "// Antes: omitir o parâmetro apaga os dados — uma surpresa perigosa",
                  "function resetDatabase(confirm = true) {",
                  "  if (confirm) db.dropAll();",
                  "}",
                  "resetDatabase(); // apagou tudo sem o chamador pedir",
                  "",
                  "// Depois: o padrão é o seguro; a ação destrutiva exige intenção explícita",
                  "function resetDatabase({ confirmed = false } = {}) {",
                  "  if (!confirmed) throw new Error(\"passe { confirmed: true } para apagar os dados\");",
                  "  db.dropAll();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um padrão deve ser o que a maioria esperaria acontecer quando nada é dito. Aqui, \"não disse nada\" " +
                "passa a significar \"não faça nada perigoso\", e a operação destrutiva só ocorre quando " +
                "pedida de forma explícita.",
            },
          ],
          exercise: {
            problem:
              "Esta função tem \"isAdmin\" no nome, mas se comporta de formas que quem a chama não esperaria em uma " +
              "verificação de permissão.",
            problemCode: {
              language: "javascript",
              filename: "is-admin.js",
              code: [
                "function isAdmin(user) {",
                "  user.lastCheckedAt = Date.now();",
                "  if (!user.roles) return \"sem papéis\";",
                "  return user.roles.includes(\"admin\");",
                "}",
              ].join("\n"),
            },
            task:
              "Identifique o que surpreende quem chama isAdmin e reescreva para que o comportamento coincida com o " +
              "que o nome promete.",
            hint: "Uma pergunta como \"é admin?\" deveria ter efeito colateral? E que tipos de resposta você esperaria receber dela?",
            solution: {
              code: {
                language: "javascript",
                filename: "is-admin.refactored.js",
                code: [
                  "function isAdmin(user) {",
                  "  return Boolean(user.roles) && user.roles.includes(\"admin\");",
                  "}",
                  "",
                  "// Se o registro do momento da checagem for necessário, tem nome próprio:",
                  "function markUserChecked(user) {",
                  "  user.lastCheckedAt = Date.now();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Duas surpresas foram removidas: a pergunta alterava o usuário (efeito colateral escondido) e " +
                "devolvia às vezes um texto em vez de verdadeiro ou falso. Agora isAdmin só responde e sempre " +
                "devolve um booleano, e o registro do horário, se ainda for necessário, é uma função à parte.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "code-smells",
      order: 30,
      title: "Code Smells",
      requires: ["Clean Code", "Design Heuristics"],
      summary: "Reconhecer violações concretas dos princípios já ensinados: duplicação, tamanho, acoplamento, coesão, uso de primitivos.",
      suggestions: ["Dead Code", "Shotgun Surgery", "Divergent Change", "Data Clumps", "Speculative Generality (≈ YAGNI)"],
      concepts: [
        concept({
          order: 10,
          title: "Duplicate Code",
          requires: ["Design Heuristics / DRY"],
          note: "o smell = a violação visível do princípio",
          collision: "≠ DRY (Design Heuristics) — manifestação concreta × princípio abstrato",
          summary: "Duplicate Code é o code smell de blocos de código iguais, ou quase iguais, em mais de um lugar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um smell não é um bug — o código funciona —, é um sintoma na estrutura que indica que vale investigar. " +
                "DRY é o princípio (não repita conhecimento); Duplicate Code é como essa violação aparece quando você " +
                "olha o código.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Cada cópia é mais um lugar onde a próxima correção pode ser esquecida.",
            },
            { type: "heading", text: "Por que é um problema" },
            {
              type: "paragraph",
              text:
                "Cada cópia é uma chance de divergir. Uma correção de bug feita em uma cópia e esquecida na outra " +
                "deixa o sistema com o mesmo defeito escondido em outro caminho; uma mudança de regra exige " +
                "achar todas as ocorrências. Também é ruído: quem lê precisa comparar os trechos linha a linha " +
                "para descobrir em que exatamente eles diferem.",
            },
            {
              type: "paragraph",
              text:
                "Como reconhecer: copiar e colar seguido de pequenos ajustes, ramos de um if com o mesmo trecho no " +
                "início ou no fim, e funções que só diferem por um valor ou por uma condição. A correção usual é " +
                "extrair o trecho comum para uma função (Extract Function, módulo Refactoring) e transformar a " +
                "diferença em parâmetro. Atenção: nem toda semelhança é duplicação de conhecimento — se os " +
                "trechos vão evoluir por razões distintas, mantê-los separados pode ser a melhor escolha.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "duas funções que só diferem por um critério, e a versão sem duplicação:" },
            {
              type: "code",
              language: "javascript",
              filename: "duplicate-code.js",
              code: [
                "// Antes: o mesmo laço duas vezes, só o critério muda",
                "function getActiveUserNames(users) {",
                "  const names = [];",
                "  for (const user of users) {",
                "    if (user.isActive) names.push(user.name);",
                "  }",
                "  return names;",
                "}",
                "",
                "function getAdminUserNames(users) {",
                "  const names = [];",
                "  for (const user of users) {",
                "    if (user.isAdmin) names.push(user.name);",
                "  }",
                "  return names;",
                "}",
                "",
                "// Depois: a diferença virou parâmetro",
                "function getUserNames(users, predicate) {",
                "  return users.filter(predicate).map((user) => user.name);",
                "}",
                "",
                "getUserNames(users, (user) => user.isActive);",
                "getUserNames(users, (user) => user.isAdmin);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A estrutura comum (percorrer, filtrar, extrair o nome) existe em um só lugar, e o que muda entre " +
                "os casos — o critério — é passado de fora. Um terceiro critério passa a custar uma linha.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Só é duplicação de verdade quando os trechos precisam mudar juntos; semelhança por coincidência não deve " +
                "ser unificada.",
                "Um bloco repetido no início ou no fim de todos os ramos de um `if` não pertence a nenhum deles.",
                "Duplicação estrutural (mesmo esqueleto, um passo diferente) se resolve passando o passo como função.",
              ],
            },
          ],
          examples: [
            {
              title: "Copiar e colar com pequenos ajustes",
              context: "O sinal mais comum: um bloco copiado, com um ou dois valores alterados.",
              code: {
                language: "javascript",
                filename: "copy-paste.js",
                code: [
                  "// Antes: cálculo de imposto repetido com alíquotas diferentes",
                  "const productTax = product.price * 0.18;",
                  "const productTotal = product.price + productTax;",
                  "",
                  "const serviceTax = service.price * 0.05;",
                  "const serviceTotal = service.price + serviceTax;",
                  "",
                  "// Depois: uma função, com a alíquota como parâmetro",
                  "function priceWithTax(price, taxRate) {",
                  "  return price + price * taxRate;",
                  "}",
                  "",
                  "const productTotal = priceWithTax(product.price, 0.18);",
                  "const serviceTotal = priceWithTax(service.price, 0.05);",
                ].join("\n"),
              },
              explanation:
                "A regra \"preço mais imposto\" existe uma vez. Se o cálculo mudar (arredondamento, por exemplo), a " +
                "correção vale para os dois usos ao mesmo tempo.",
            },
            {
              title: "Trecho repetido em todos os ramos de um if",
              context: "Quando os dois ramos começam ou terminam do mesmo jeito, esse pedaço não pertence a nenhum dos ramos.",
              code: {
                language: "javascript",
                filename: "branch-duplication.js",
                code: [
                  "// Antes: o log e o registro de auditoria se repetem nos dois ramos",
                  "if (isPremium) {",
                  "  charge(user, premiumPrice);",
                  "  logPurchase(user);",
                  "  saveAuditTrail(user);",
                  "} else {",
                  "  charge(user, regularPrice);",
                  "  logPurchase(user);",
                  "  saveAuditTrail(user);",
                  "}",
                  "",
                  "// Depois: só o que é diferente fica dentro do if",
                  "const price = isPremium ? premiumPrice : regularPrice;",
                  "charge(user, price);",
                  "logPurchase(user);",
                  "saveAuditTrail(user);",
                ].join("\n"),
              },
              explanation:
                "O que realmente varia é o preço. Isolar essa diferença deixa claro qual é a única decisão do trecho " +
                "e impede que alguém esqueça de acrescentar o novo passo em um dos ramos.",
            },
            {
              title: "Mesmo algoritmo, passo diferente",
              context: "Duplicação estrutural: o esqueleto é igual e só um passo muda — o passo diferente pode ser passado como função.",
              code: {
                language: "javascript",
                filename: "structural-duplication.js",
                code: [
                  "// Antes: a mesma tentativa com retry, duas vezes",
                  "async function fetchUsers() {",
                  "  for (let attempt = 1; attempt <= 3; attempt++) {",
                  "    try { return await api.get(\"/users\"); } catch (e) { if (attempt === 3) throw e; }",
                  "  }",
                  "}",
                  "async function fetchOrders() {",
                  "  for (let attempt = 1; attempt <= 3; attempt++) {",
                  "    try { return await api.get(\"/orders\"); } catch (e) { if (attempt === 3) throw e; }",
                  "  }",
                  "}",
                  "",
                  "// Depois: o esqueleto do retry existe uma vez",
                  "async function withRetry(action, maxAttempts = 3) {",
                  "  for (let attempt = 1; attempt <= maxAttempts; attempt++) {",
                  "    try { return await action(); } catch (e) { if (attempt === maxAttempts) throw e; }",
                  "  }",
                  "}",
                  "const fetchUsers = () => withRetry(() => api.get(\"/users\"));",
                  "const fetchOrders = () => withRetry(() => api.get(\"/orders\"));",
                ].join("\n"),
              },
              explanation:
                "A política de retry — quantas vezes, quando desistir — passa a viver em withRetry. Mudar de 3 para " +
                "5 tentativas é uma mudança só, e novos endpoints ganham a mesma política sem copiar o laço.",
            },
          ],
          exercise: {
            problem:
              "Estas duas funções montam uma linha de texto para um relatório e só diferem no rótulo e no campo " +
              "usado. A cada mudança de formato, é preciso lembrar de alterar as duas.",
            problemCode: {
              language: "javascript",
              filename: "report-lines.js",
              code: [
                "function customerLine(customer) {",
                "  const name = customer.name.trim().toUpperCase();",
                "  return \"CLIENTE: \" + name.padEnd(20) + customer.total.toFixed(2);",
                "}",
                "",
                "function supplierLine(supplier) {",
                "  const name = supplier.name.trim().toUpperCase();",
                "  return \"FORNECEDOR: \" + name.padEnd(20) + supplier.balance.toFixed(2);",
                "}",
              ].join("\n"),
            },
            task:
              "Elimine a duplicação: extraia o que é comum e faça as duas funções (ou uma só) usarem esse trecho, " +
              "deixando explícito o que varia.",
            hint: "Compare as duas linha a linha. O que muda é o rótulo (\"CLIENTE\"/\"FORNECEDOR\") e de onde vem o valor numérico.",
            solution: {
              code: {
                language: "javascript",
                filename: "report-lines.refactored.js",
                code: [
                  "function reportLine(label, name, amount) {",
                  "  const formattedName = name.trim().toUpperCase();",
                  "  return label + \": \" + formattedName.padEnd(20) + amount.toFixed(2);",
                  "}",
                  "",
                  "const customerLine = (customer) => reportLine(\"CLIENTE\", customer.name, customer.total);",
                  "const supplierLine = (supplier) => reportLine(\"FORNECEDOR\", supplier.name, supplier.balance);",
                ].join("\n"),
              },
              explanation:
                "A regra de formatação (limpar o nome, alinhar em 20 colunas, duas casas decimais) existe em reportLine, " +
                "e cada função só informa o que é específico dela. Mudar a largura da coluna vira uma alteração única.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Long Method",
          note: "função grande demais para entender de uma vez",
          summary: "Long Method é o code smell de uma função grande demais para ser compreendida de relance.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O número de linhas é só um indicador; o problema de fato é que ela reúne várias tarefas, vários níveis " +
                "de abstração e muitas variáveis locais que o leitor precisa manter na cabeça. É a violação, vista no " +
                "código, do que Functions (módulo Clean Code) recomenda.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Depois de dividida, uma função longa deve se ler como um índice das partes que ela coordena.",
            },
            { type: "heading", text: "Por que é um problema" },
            {
              type: "paragraph",
              text:
                "Funções longas escondem bugs (é fácil perder uma condição no meio de cinquenta linhas), são " +
                "difíceis de testar (é preciso montar todo o cenário para exercitar um trecho) e resistem a mudanças " +
                "(alterar uma parte arrisca quebrar outra que compartilha variáveis). Também acumulam mais " +
                "razões para mudar do que uma função deveria ter.",
            },
            {
              type: "paragraph",
              text:
                "Sinais de que uma função está longa demais: comentários que funcionam como títulos de seção (\"// " +
                "valida\", \"// calcula\", \"// grava\"), blocos que poderiam ter um nome próprio, muitas variáveis " +
                "temporárias e vários níveis de aninhamento. A correção usual é Extract Function (módulo " +
                "Refactoring): cada bloco com um propósito reconhecível vira uma função com um bom nome — e o " +
                "comentário-título, que já dava o nome, deixa de ser necessário.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função com \"seções\" marcadas por comentários, e a versão dividida:" },
            {
              type: "code",
              language: "javascript",
              filename: "long-method.js",
              code: [
                "// Antes: três seções, separadas por comentários",
                "function checkout(cart, user) {",
                "  // valida",
                "  if (cart.items.length === 0) throw new Error(\"carrinho vazio\");",
                "  if (!user.address) throw new Error(\"endereço ausente\");",
                "",
                "  // calcula",
                "  let total = 0;",
                "  for (const item of cart.items) total += item.price * item.quantity;",
                "  if (user.isPremium) total *= 0.9;",
                "",
                "  // grava",
                "  return orders.save({ userId: user.id, items: cart.items, total });",
                "}",
                "",
                "// Depois: os comentários viraram nomes de funções",
                "function checkout(cart, user) {",
                "  validateCheckout(cart, user);",
                "  const total = calculateTotal(cart, user);",
                "  return orders.save({ userId: user.id, items: cart.items, total });",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada comentário-título virou o nome de uma função (validateCheckout, calculateTotal). Agora " +
                "checkout se lê como um índice e cada parte pode ser testada e alterada sozinha.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O critério é dificuldade de compreensão, não a contagem de linhas: uma função longa, mas linear e uniforme, " +
                "pode estar bem.",
                "Dividir só por causa do tamanho espalha o que hoje se lê de uma vez.",
                "Comentários que marcam seções dentro da função são o sinal mais confiável: já são nomes de funções não " +
                "extraídas.",
              ],
            },
          ],
          examples: [
            {
              title: "Comentários como cabeçalhos de seção",
              context: "O sinal mais confiável: os comentários já são os nomes das funções que ainda não foram extraídas.",
              code: {
                language: "javascript",
                filename: "section-comments.js",
                code: [
                  "function processPayroll(employees) {",
                  "  // filtra quem está ativo",
                  "  const active = employees.filter((e) => e.status === \"active\");",
                  "  // calcula salários",
                  "  const payslips = active.map((e) => ({ id: e.id, net: e.gross - e.gross * e.taxRate }));",
                  "  // arredonda e formata",
                  "  return payslips.map((p) => ({ ...p, net: Math.round(p.net * 100) / 100 }));",
                  "}",
                  "",
                  "// Extraindo: filterActive, calculatePayslips, roundPayslips",
                  "function processPayroll(employees) {",
                  "  return roundPayslips(calculatePayslips(filterActive(employees)));",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Os três comentários eram, na prática, os nomes de três funções. Depois de extraídas, o fluxo cabe " +
                "em uma linha legível, e cada etapa pode ser testada individualmente.",
            },
            {
              title: "Corpo de laço grande",
              context: "Um laço com dezenas de linhas dentro dele é um forte candidato: o corpo normalmente é uma função com nome.",
              code: {
                language: "javascript",
                filename: "big-loop-body.js",
                code: [
                  "// Antes: o que acontece com cada pedido está enterrado no laço",
                  "for (const order of orders) {",
                  "  const lines = order.items.map((i) => i.name + \" x\" + i.quantity);",
                  "  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);",
                  "  const tax = subtotal * 0.1;",
                  "  console.log(order.id, lines.join(\", \"), subtotal + tax);",
                  "}",
                  "",
                  "// Depois: o laço diz o que faz; os detalhes têm nome",
                  "for (const order of orders) {",
                  "  printOrderSummary(order);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O laço agora descreve o quê (imprimir o resumo de cada pedido), e o como fica em printOrderSummary, " +
                "que pode ser lida, testada e reaproveitada sem o laço.",
            },
            {
              title: "Nem toda função longa é um Long Method",
              context: "O critério é dificuldade de compreensão, não a contagem de linhas: uma função longa, mas linear e uniforme, pode estar bem.",
              code: {
                language: "javascript",
                filename: "long-but-fine.js",
                code: [
                  "// Longa, porém simples: uma lista uniforme, sem ramificações complexas",
                  "function buildDefaultSettings() {",
                  "  return {",
                  "    theme: \"dark\",",
                  "    language: \"pt-BR\",",
                  "    notifications: true,",
                  "    autoSave: true,",
                  "    fontSize: 14,",
                  "    // ...mais quinze opções do mesmo tipo",
                  "  };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Não há vários níveis de abstração nem lógica para manter na cabeça: é uma tabela. Dividir só por " +
                "causa do tamanho espalharia o que hoje se lê de uma vez. O smell indica dificuldade de " +
                "entender, não simplesmente muitas linhas.",
            },
          ],
          exercise: {
            problem:
              "Esta função gera uma fatura, mas mistura validação, cálculo e formatação, separados por comentários. " +
              "Testar apenas o cálculo do total exige montar um pedido completo.",
            problemCode: {
              language: "javascript",
              filename: "generate-invoice.js",
              code: [
                "function generateInvoice(order) {",
                "  // valida",
                "  if (!order.customer) throw new Error(\"cliente ausente\");",
                "  if (order.items.length === 0) throw new Error(\"pedido vazio\");",
                "",
                "  // calcula",
                "  let total = 0;",
                "  for (const item of order.items) total += item.price * item.quantity;",
                "  const tax = total * 0.1;",
                "",
                "  // formata",
                "  return \"Fatura de \" + order.customer.name + \": R$ \" + (total + tax).toFixed(2);",
                "}",
              ].join("\n"),
            },
            task:
              "Divida generateInvoice em funções menores, usando os comentários como guia para os nomes, e deixe " +
              "generateInvoice apenas coordenando os passos.",
            hint: "Cada comentário marca uma seção. Comece extraindo a que não depende das outras (a validação) e devolva de cada função o que a seguinte precisa.",
            solution: {
              code: {
                language: "javascript",
                filename: "generate-invoice.refactored.js",
                code: [
                  "function generateInvoice(order) {",
                  "  validateOrder(order);",
                  "  const total = calculateTotalWithTax(order.items);",
                  "  return formatInvoice(order.customer, total);",
                  "}",
                  "",
                  "function validateOrder(order) {",
                  "  if (!order.customer) throw new Error(\"cliente ausente\");",
                  "  if (order.items.length === 0) throw new Error(\"pedido vazio\");",
                  "}",
                  "",
                  "function calculateTotalWithTax(items) {",
                  "  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);",
                  "  return subtotal + subtotal * 0.1;",
                  "}",
                  "",
                  "function formatInvoice(customer, total) {",
                  "  return \"Fatura de \" + customer.name + \": R$ \" + total.toFixed(2);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agora calculateTotalWithTax pode ser testada só com uma lista de itens, sem cliente nem texto. Os " +
                "comentários-título desapareceram porque os nomes das funções fazem esse papel.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Long Parameter List",
          note: "relaciona-se com Function Arguments (Clean Code) e Introduce Parameter Object (Refactoring) — trio intencional: escrever bem → reconhecer violação → corrigir",
          summary:
            "Long Parameter List é o code smell de uma função que recebe mais argumentos do que se consegue manter na " +
            "cabeça.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em geral, isso começa a partir de três ou quatro. É a violação vista no código do que Function Arguments " +
                "(módulo Clean Code) recomenda escrever; os três Concepts formam uma sequência: escrever bem, reconhecer " +
                "a violação e corrigir (com Introduce Parameter Object, no módulo Refactoring).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Parâmetros que sempre aparecem juntos são um conceito do domínio que ainda não ganhou nome.",
            },
            { type: "heading", text: "Por que é um problema" },
            {
              type: "paragraph",
              text:
                "Chamadas com muitos valores posicionais são ilegíveis (o que é o quinto argumento?) e trocar a " +
                "ordem de dois do mesmo tipo passa sem erro. A assinatura fica difícil de evoluir: acrescentar um " +
                "parâmetro exige alterar todas as chamadas. E uma lista longa muitas vezes revela um problema de " +
                "fundo — a função faz demais, ou há dados que sempre andam juntos e ainda não ganharam um nome.",
            },
            {
              type: "paragraph",
              text:
                "Como reconhecer: chamadas com vários literais (true, false, 0, null) em sequência, os mesmos três ou " +
                "quatro parâmetros aparecendo juntos em várias funções, e parâmetros extraídos de um objeto que já " +
                "estava ao alcance de quem chama. As correções usuais: agrupar os dados relacionados em um objeto " +
                "(Introduce Parameter Object), passar o objeto inteiro em vez de seus campos, ou dividir a função " +
                "em partes que precisam de menos dados.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "parâmetros que sempre viajam juntos, agrupados em um objeto:" },
            {
              type: "code",
              language: "javascript",
              filename: "long-parameter-list.js",
              code: [
                "// Antes: quatro números que descrevem uma única coisa",
                "function drawRectangle(x, y, width, height, color) { /* ... */ }",
                "function isInside(x, y, width, height, pointX, pointY) { /* ... */ }",
                "",
                "drawRectangle(10, 20, 100, 50, \"red\");",
                "",
                "// Depois: o retângulo ganhou um nome e viaja como um valor",
                "function drawRectangle(rect, color) { /* ... */ }",
                "function isInside(rect, point) { /* ... */ }",
                "",
                "const box = { x: 10, y: 20, width: 100, height: 50 };",
                "drawRectangle(box, \"red\");",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "x, y, width e height são as partes de uma coisa só. Ao agrupá-las, as assinaturas ficam mais curtas " +
                "e mais claras, e o retângulo passa a existir como conceito no código.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Reordenar os argumentos não resolve: o problema costuma ser um conceito sem nome ou uma função que faz demais.",
                "Agrupar tudo num objeto pode esconder uma função com responsabilidades demais; dividi-la reduz a lista como " +
                "consequência.",
                "Passar o objeto inteiro faz a função depender do formato dele; a troca só compensa quando ela é, de fato, " +
                "sobre esse objeto.",
              ],
            },
          ],
          examples: [
            {
              title: "Parâmetros que sempre andam juntos",
              context: "Quando o mesmo grupo de valores aparece em várias assinaturas, ele é um conceito do domínio esperando um nome.",
              code: {
                language: "javascript",
                filename: "data-clump.js",
                code: [
                  "// Antes: intervalo de datas repetido em toda função",
                  "function salesReport(startDate, endDate, region) { /* ... */ }",
                  "function refundsReport(startDate, endDate, region) { /* ... */ }",
                  "",
                  "// Depois: DateRange é um conceito com nome",
                  "function salesReport(range, region) { /* ... */ }",
                  "function refundsReport(range, region) { /* ... */ }",
                  "",
                  "const range = { start: \"2026-01-01\", end: \"2026-03-31\" };",
                  "salesReport(range, \"sul\");",
                ].join("\n"),
              },
              explanation:
                "O intervalo passa a ser um valor único. Quando surgir a regra \"o fim não pode ser anterior ao " +
                "início\", ela terá um lugar natural para viver, em vez de repetida em cada relatório.",
            },
            {
              title: "Passar o objeto inteiro",
              context: "Extrair vários campos de um objeto só para passá-los adiante cria uma lista longa sem necessidade.",
              code: {
                language: "javascript",
                filename: "preserve-whole-object.js",
                code: [
                  "// Antes: quem chama desmonta o objeto para montar os argumentos",
                  "const fee = shippingFee(order.weight, order.destination, order.isFragile, order.isExpress);",
                  "",
                  "// Depois: a função recebe o pedido e usa o que precisa",
                  "const fee = shippingFee(order);",
                  "",
                  "function shippingFee(order) {",
                  "  const base = order.weight * 1.5;",
                  "  return order.isExpress ? base * 2 : base;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se shippingFee passar a considerar outro campo do pedido, nenhuma chamada precisa mudar. O custo é " +
                "que a função passa a depender do formato do pedido — uma troca razoável quando ela é, de fato, " +
                "sobre pedidos.",
            },
            {
              title: "A lista longa como sintoma de função que faz demais",
              context: "Às vezes o problema não é o agrupamento: a função recebe tantos dados porque tem responsabilidades demais.",
              code: {
                language: "javascript",
                filename: "doing-too-much.js",
                code: [
                  "// Antes: valida, cobra e notifica — por isso precisa de tudo isso",
                  "function completePurchase(user, card, items, address, couponCode, sendEmail) { /* ... */ }",
                  "",
                  "// Depois: cada etapa recebe só os dados que usa",
                  "function chargeCard(card, amount) { /* ... */ }",
                  "function scheduleDelivery(address, items) { /* ... */ }",
                  "function sendReceipt(user) { /* ... */ }",
                ].join("\n"),
              },
              explanation:
                "Agrupar os seis argumentos em um objeto só esconderia o problema. Dividir a função reduz o que cada " +
                "parte precisa saber, e a lista longa some como consequência.",
            },
          ],
          exercise: {
            problem:
              "Esta função de desenho recebe sete argumentos posicionais, e as chamadas espalhadas pelo código " +
              "ficam praticamente ilegíveis.",
            problemCode: {
              language: "javascript",
              filename: "draw-box.js",
              code: [
                "function drawBox(x, y, width, height, fillColor, borderWidth, borderColor) {",
                "  // ...",
                "}",
                "",
                "drawBox(10, 20, 100, 50, \"white\", 2, \"black\");",
              ].join("\n"),
            },
            task:
              "Reagrupe os parâmetros de forma que a assinatura fique curta e a chamada se explique sozinha, " +
              "identificando quais dados pertencem juntos.",
            hint: "Há três grupos naturais: onde a caixa está e qual o seu tamanho, como ela é preenchida e como é a sua borda.",
            solution: {
              code: {
                language: "javascript",
                filename: "draw-box.refactored.js",
                code: [
                  "function drawBox(bounds, style) {",
                  "  // ...",
                  "}",
                  "",
                  "drawBox(",
                  "  { x: 10, y: 20, width: 100, height: 50 },",
                  "  { fillColor: \"white\", borderWidth: 2, borderColor: \"black\" }",
                  ");",
                ].join("\n"),
              },
              explanation:
                "Dois parâmetros, cada um com nome e significado: onde e com que tamanho, e com que aparência. Uma " +
                "propriedade nova de estilo (sombra, por exemplo) entra no objeto de estilo sem alterar a " +
                "assinatura nem as demais chamadas.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Large Class",
          requires: ["Programming Foundations / Programming Fundamentals / Cohesion"],
          note: "sintoma concreto de baixa coesão",
          summary: "Large Class é o code smell de uma classe com campos, métodos e razões para mudar demais.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Como Cohesion (módulo Programming Fundamentals) mede o quanto as partes de uma classe pertencem juntas, " +
                "uma classe grande normalmente é o sintoma de baixa coesão: vários assuntos diferentes acabaram morando " +
                "no mesmo lugar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Uma classe que toda mudança precisa tocar vira ponto de conflito para o time inteiro.",
            },
            { type: "heading", text: "Por que é um problema" },
            {
              type: "paragraph",
              text:
                "Uma classe assim é difícil de entender (é preciso ler tudo para saber o que ela faz), difícil de " +
                "testar (cada teste precisa montar um objeto enorme) e fonte constante de conflitos e regressões, " +
                "já que qualquer mudança em qualquer um dos assuntos toca o mesmo arquivo e o mesmo estado.",
            },
            {
              type: "paragraph",
              text:
                "Como reconhecer: nomes genéricos como Manager, Helper, Utils ou Service que tudo abrangem; grupos " +
                "de campos que só alguns métodos usam; métodos que nunca tocam a maior parte do estado; e prefixos " +
                "repetidos nos nomes (addressStreet, addressCity, addressZip) sinalizando um conceito que pede " +
                "sua própria classe. A correção é Extract Class (módulo Refactoring): separar cada assunto na sua " +
                "classe, mantendo cada uma coesa.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma classe com dois assuntos distintos, e a divisão:" },
            {
              type: "code",
              language: "javascript",
              filename: "large-class.js",
              code: [
                "// Antes: dados pessoais e endereço misturados; métodos usam só um dos grupos",
                "class User {",
                "  constructor(name, email, street, city, zip) {",
                "    this.name = name;",
                "    this.email = email;",
                "    this.street = street;",
                "    this.city = city;",
                "    this.zip = zip;",
                "  }",
                "  greeting() { return \"Olá, \" + this.name; }",
                "  fullAddress() { return this.street + \", \" + this.city + \" - \" + this.zip; }",
                "}",
                "",
                "// Depois: cada classe cuida de um assunto",
                "class Address {",
                "  constructor(street, city, zip) {",
                "    this.street = street;",
                "    this.city = city;",
                "    this.zip = zip;",
                "  }",
                "  full() { return this.street + \", \" + this.city + \" - \" + this.zip; }",
                "}",
                "",
                "class User {",
                "  constructor(name, email, address) {",
                "    this.name = name;",
                "    this.email = email;",
                "    this.address = address;",
                "  }",
                "  greeting() { return \"Olá, \" + this.name; }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "greeting só usava name; fullAddress só usava o endereço. Essa divisão nítida dos métodos entre os " +
                "campos é o sinal. Separadas, cada classe é pequena, coesa e pode mudar sem afetar a outra.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Se os grupos de métodos usam grupos diferentes de campos, são classes diferentes no mesmo arquivo.",
                "Nomes como `Manager`, `Helper` e `Utils` indicam uma classe sem assunto claro, que aceita qualquer coisa.",
                "Campos com o mesmo prefixo (`shipping...`) apontam para um conceito que ainda não virou classe.",
              ],
            },
          ],
          examples: [
            {
              title: "Métodos que usam só uma parte dos campos",
              context: "O teste mais concreto: liste quais campos cada método usa — se os grupos não se cruzam, são classes diferentes.",
              code: {
                language: "javascript",
                filename: "disjoint-fields.js",
                code: [
                  "class Invoice {",
                  "  // grupo A: itens e total",
                  "  addItem(item) { this.items.push(item); }",
                  "  total() { return this.items.reduce((s, i) => s + i.price, 0); }",
                  "",
                  "  // grupo B: envio por e-mail — nunca toca em itens",
                  "  setRecipient(email) { this.recipient = email; }",
                  "  send() { mailer.send(this.recipient, this.render()); }",
                  "}",
                  "// Grupo A e grupo B poderiam ser Invoice e InvoiceMailer",
                ].join("\n"),
              },
              explanation:
                "Os dois grupos de métodos compartilham apenas a existência da mesma classe. Separar torna possível " +
                "testar o total sem e-mail, e trocar o envio (para SMS, por exemplo) sem tocar no cálculo.",
            },
            {
              title: "Nomes genéricos como Manager e Utils",
              context: "Um nome vago geralmente indica que a classe não tem um assunto claro — e por isso aceita qualquer coisa.",
              code: {
                language: "javascript",
                filename: "vague-names.js",
                code: [
                  "// Antes: UserManager faz um pouco de tudo",
                  "class UserManager {",
                  "  register(data) { /* ... */ }",
                  "  hashPassword(password) { /* ... */ }",
                  "  sendWelcomeEmail(user) { /* ... */ }",
                  "  exportUsersToCsv(users) { /* ... */ }",
                  "}",
                  "",
                  "// Depois: nomes que dizem o assunto de cada classe",
                  "class UserRegistration { register(data) { /* ... */ } }",
                  "class PasswordHasher { hash(password) { /* ... */ } }",
                  "class WelcomeMailer { send(user) { /* ... */ } }",
                  "class UserCsvExporter { export(users) { /* ... */ } }",
                ].join("\n"),
              },
              explanation:
                "Se é difícil dar à classe um nome que não seja Manager, Helper ou Utils, geralmente é porque ela " +
                "não tem uma responsabilidade única. Um bom nome é também um teste de coesão.",
            },
            {
              title: "Prefixos repetidos: um conceito escondido",
              context: "Campos com o mesmo prefixo (address..., billing...) indicam um conceito que pede sua própria classe.",
              code: {
                language: "javascript",
                filename: "repeated-prefixes.js",
                code: [
                  "// Antes: três campos com o mesmo prefixo dentro de Order",
                  "class Order {",
                  "  constructor() {",
                  "    this.shippingStreet = \"\";",
                  "    this.shippingCity = \"\";",
                  "    this.shippingZip = \"\";",
                  "  }",
                  "}",
                  "",
                  "// Depois: o conceito ganhou uma classe",
                  "class Order {",
                  "  constructor(shippingAddress) {",
                  "    this.shippingAddress = shippingAddress;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O prefixo shipping era o nome de uma classe que ainda não existia. Ao extraí-la, Order deixa de " +
                "precisar conhecer os detalhes de um endereço, e o endereço passa a poder ser reutilizado (e " +
                "validado) em outros lugares.",
            },
          ],
          exercise: {
            problem:
              "Esta classe mistura a lógica de um pedido com os dados e as regras do cliente que o fez. Repare em " +
              "quais campos cada método usa.",
            problemCode: {
              language: "javascript",
              filename: "order.js",
              code: [
                "class Order {",
                "  constructor(items, customerName, customerEmail, customerCity) {",
                "    this.items = items;",
                "    this.customerName = customerName;",
                "    this.customerEmail = customerEmail;",
                "    this.customerCity = customerCity;",
                "  }",
                "  total() { return this.items.reduce((s, i) => s + i.price, 0); }",
                "  customerLabel() { return this.customerName + \" (\" + this.customerCity + \")\"; }",
                "  customerHasValidEmail() { return this.customerEmail.includes(\"@\"); }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Extract Class: separe o que é do cliente do que é do pedido, de modo que cada classe " +
              "seja coesa e Order passe a se relacionar com o cliente por composição.",
            hint: "Os três campos com prefixo customer... e os dois métodos que só os usam formam uma classe própria.",
            solution: {
              code: {
                language: "javascript",
                filename: "order.refactored.js",
                code: [
                  "class Customer {",
                  "  constructor(name, email, city) {",
                  "    this.name = name;",
                  "    this.email = email;",
                  "    this.city = city;",
                  "  }",
                  "  label() { return this.name + \" (\" + this.city + \")\"; }",
                  "  hasValidEmail() { return this.email.includes(\"@\"); }",
                  "}",
                  "",
                  "class Order {",
                  "  constructor(items, customer) {",
                  "    this.items = items;",
                  "    this.customer = customer;",
                  "  }",
                  "  total() { return this.items.reduce((s, i) => s + i.price, 0); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Order agora só trata de itens e total; Customer cuida de tudo que é do cliente. Cada classe pode " +
                "ser testada isoladamente e mudar sem arrastar a outra.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Feature Envy",
          requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
          note: "sintoma concreto de acoplamento excessivo",
          summary:
            "Feature Envy é o code smell de um método que usa mais os dados de outro objeto do que os do seu próprio.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ele parece \"invejar\" outra classe: gasta a maior parte do tempo lendo e manipulando campos dela, e quase " +
                "nada do objeto onde mora. É o sintoma concreto de acoplamento excessivo (Coupling, módulo Programming " +
                "Fundamentals): duas classes conhecem detalhes demais uma da outra.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Quando a regra mora perto dos dados, todo cliente usa a mesma versão dela.",
            },
            { type: "heading", text: "Por que é um problema" },
            {
              type: "paragraph",
              text:
                "O comportamento e os dados sobre os quais ele opera deveriam ficar juntos. Quando não ficam, uma " +
                "mudança na estrutura de um objeto obriga a alterar quem o usa de fora, a regra fica espalhada em " +
                "vez de concentrada, e a lógica acaba duplicada por cada cliente que precisa dela.",
            },
            {
              type: "paragraph",
              text:
                "Como reconhecer: um método que chama repetidamente order.algo, order.outraCoisa e order.maisUma, " +
                "cadeias longas como a.getB().getC().getD(), ou uma classe \"Calculator\" que só lê campos de " +
                "outra. A correção usual é Move Function (módulo Refactoring): levar o método para a classe cujos dados " +
                "ele usa. Há exceções deliberadas — separar dados de comportamento em padrões como Strategy ou " +
                "em formatadores de apresentação —, mas então é uma escolha consciente, não um acidente.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um método que só mexe nos dados de outro objeto, e a versão com o comportamento no lugar certo:" },
            {
              type: "code",
              language: "javascript",
              filename: "feature-envy.js",
              code: [
                "// Antes: InvoicePrinter só usa dados de Order",
                "class InvoicePrinter {",
                "  totalWithDiscount(order) {",
                "    const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);",
                "    return subtotal - subtotal * order.discountRate;",
                "  }",
                "}",
                "",
                "// Depois: o cálculo mora onde estão os dados",
                "class Order {",
                "  totalWithDiscount() {",
                "    const subtotal = this.items.reduce((s, i) => s + i.price * i.quantity, 0);",
                "    return subtotal - subtotal * this.discountRate;",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "totalWithDiscount só usava items e discountRate, ambos de Order. No novo lugar, a regra do total " +
                "passa a ser uma propriedade do pedido, e qualquer cliente (impressão, e-mail, API) usa a mesma regra.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um método que mais usa dados de outra classe provavelmente pertence a ela; mover o comportamento evita esse " +
                "acoplamento.",
                "Cadeias como `a.b.c.d` são a mesma inveja: quem chama conhece a estrutura interna de vários objetos.",
                "Nem todo método que lê dados de fora é smell: separar dados e comportamento pode ser decisão de projeto, " +
                "como manter a apresentação fora do domínio.",
              ],
            },
          ],
          examples: [
            {
              title: "Cálculo que só usa campos de outro objeto",
              context: "O caso clássico: uma classe \"de serviço\" faz contas inteiras com o estado de outra.",
              code: {
                language: "javascript",
                filename: "envious-calculator.js",
                code: [
                  "// Antes: ShippingCalculator só lê campos de Package",
                  "class ShippingCalculator {",
                  "  cost(pkg) {",
                  "    const volume = pkg.width * pkg.height * pkg.depth;",
                  "    return pkg.isFragile ? volume * 0.02 + 10 : volume * 0.02;",
                  "  }",
                  "}",
                  "",
                  "// Depois: Package sabe o próprio custo de envio",
                  "class Package {",
                  "  shippingCost() {",
                  "    const volume = this.width * this.height * this.depth;",
                  "    return this.isFragile ? volume * 0.02 + 10 : volume * 0.02;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se Package ganhar um campo novo que afete o frete, a mudança fica dentro dela. Antes, seria " +
                "preciso lembrar de atualizar uma classe separada que conhecia todos os detalhes internos.",
            },
            {
              title: "Cadeia de chamadas por dentro de outros objetos",
              context: "Navegar por vários objetos em sequência (a.b.c.d) é a mesma inveja em outro formato: quem chama conhece a estrutura interna de todos.",
              code: {
                language: "javascript",
                filename: "chain-of-calls.js",
                code: [
                  "// Antes: quem chama precisa conhecer Order → Customer → Address → City",
                  "const city = order.getCustomer().getAddress().getCity();",
                  "",
                  "// Depois: Order expõe o que os clientes querem saber",
                  "class Order {",
                  "  deliveryCity() {",
                  "    return this.customer.address.city;",
                  "  }",
                  "}",
                  "const city = order.deliveryCity();",
                ].join("\n"),
              },
              explanation:
                "Agora, se o endereço passar a ficar em outro lugar, só Order muda; nenhum cliente que pergunta a " +
                "cidade de entrega precisa ser tocado.",
            },
            {
              title: "Quando separar dados e comportamento é intencional",
              context: "Nem todo método que lê dados de fora é inveja: alguns padrões separam as duas coisas de propósito.",
              code: {
                language: "javascript",
                filename: "deliberate-separation.js",
                code: [
                  "// Formatar para exibição é responsabilidade da camada de apresentação —",
                  "// a Order não deve saber como uma tela ou um PDF a mostra.",
                  "function renderOrderSummary(order) {",
                  "  return \"Pedido #\" + order.id + \" — \" + order.items.length + \" itens\";",
                  "}",
                  "",
                  "// Trocar o formato (HTML, PDF, JSON) não deve exigir alterar Order.",
                ].join("\n"),
              },
              explanation:
                "Aqui a separação é uma decisão de projeto (manter a apresentação fora do domínio). O smell " +
                "aponta para um acidente — comportamento de negócio no lugar errado —, não para a existência " +
                "de qualquer função que lê dados de outro objeto.",
            },
          ],
          exercise: {
            problem:
              "Esta classe de relatório decide se um aluno foi aprovado, mas toda a lógica usa apenas dados do aluno.",
            problemCode: {
              language: "javascript",
              filename: "report-card.js",
              code: [
                "class ReportCard {",
                "  isApproved(student) {",
                "    const average = student.grades.reduce((s, g) => s + g, 0) / student.grades.length;",
                "    return average >= student.passingGrade && student.absences <= student.maxAbsences;",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Identifique a inveja de funcionalidade e mova o método para o lugar cujos dados ele usa, ajustando " +
              "a forma como é chamado.",
            hint: "Todos os campos usados (grades, passingGrade, absences, maxAbsences) pertencem a Student. Nenhum pertence a ReportCard.",
            solution: {
              code: {
                language: "javascript",
                filename: "student.js",
                code: [
                  "class Student {",
                  "  constructor(grades, passingGrade, absences, maxAbsences) {",
                  "    this.grades = grades;",
                  "    this.passingGrade = passingGrade;",
                  "    this.absences = absences;",
                  "    this.maxAbsences = maxAbsences;",
                  "  }",
                  "",
                  "  average() {",
                  "    return this.grades.reduce((s, g) => s + g, 0) / this.grades.length;",
                  "  }",
                  "",
                  "  isApproved() {",
                  "    return this.average() >= this.passingGrade && this.absences <= this.maxAbsences;",
                  "  }",
                  "}",
                  "",
                  "// Uso: student.isApproved() — sem passar por ReportCard",
                ].join("\n"),
              },
              explanation:
                "A regra de aprovação agora está com os dados que ela usa, e average() vira um método reutilizável. " +
                "Uma mudança na regra (por exemplo, incluir uma nota de recuperação) altera só Student.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Primitive Obsession",
          note: "usar primitivos onde um tipo/objeto próprio comunicaria melhor a intenção",
          summary:
            "Primitive Obsession é o hábito de representar conceitos do domínio com tipos primitivos, como string e " +
            "number, em vez de tipos próprios.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um e-mail, um valor em reais, um CPF, um intervalo de datas: todos viram simples strings ou números, e o " +
                "significado e as regras ficam só na cabeça de quem programa.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Valide uma vez, na criação do tipo, e todo código que recebe esse tipo pode confiar nele.",
            },
            { type: "heading", text: "Por que é um problema" },
            {
              type: "paragraph",
              text:
                "Um primitivo aceita qualquer valor do seu tipo, válido ou não: a string \"abc\" é um e-mail tão " +
                "\"válido\" quanto qualquer outro para o sistema de tipos. Por isso a validação se espalha — cada " +
                "função que recebe um e-mail precisa conferir de novo — e a regra acaba duplicada ou esquecida. " +
                "Além disso, valores com significados diferentes se confundem: um id de usuário e um id de pedido " +
                "são ambos números, e nada impede de passar um no lugar do outro.",
            },
            {
              type: "paragraph",
              text:
                "Como reconhecer: strings com formato esperado (e-mail, telefone, CEP), números com unidade ou " +
                "moeda implícitas, códigos de status como texto e vários parâmetros do mesmo tipo primitivo em " +
                "sequência. A correção é criar um tipo pequeno que valide ao ser criado e carregue as operações " +
                "do conceito (um value object): depois de construído, o valor é sempre válido, e o restante do " +
                "código não precisa conferir de novo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um e-mail como string solta, e como um tipo que garante a própria validade:" },
            {
              type: "code",
              language: "javascript",
              filename: "primitive-obsession.js",
              code: [
                "// Antes: qualquer string passa; cada função repete a checagem",
                "function sendNewsletter(email) {",
                "  if (!email.includes(\"@\")) throw new Error(\"e-mail inválido\");",
                "  // ...",
                "}",
                "",
                "// Depois: o tipo só existe se for válido",
                "class Email {",
                "  constructor(value) {",
                "    if (!value.includes(\"@\")) throw new Error(\"e-mail inválido\");",
                "    this.value = value;",
                "  }",
                "}",
                "",
                "function sendNewsletter(email) {",
                "  // email é um Email: já foi validado ao ser criado",
                "  mailer.send(email.value);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A validação acontece uma vez, na criação. Toda função que recebe um Email pode confiar que ele é " +
                "válido, e o próprio parâmetro documenta o que se espera — algo que a palavra string nunca dirá.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um `number` para dinheiro não sabe a moeda e sofre com arredondamento de ponto flutuante.",
                "Argumentos do mesmo tipo primitivo podem ser trocados de posição sem nenhum aviso.",
                "Números sem unidade obrigam a adivinhar se são metros, quilômetros, segundos ou milissegundos.",
              ],
            },
          ],
          examples: [
            {
              title: "Dinheiro como número solto",
              context: "Um number não sabe de que moeda é, nem evita os erros de arredondamento de ponto flutuante.",
              code: {
                language: "javascript",
                filename: "money.js",
                code: [
                  "// Antes: 0.1 + 0.2 !== 0.3, e a moeda é implícita",
                  "const total = 0.1 + 0.2; // 0.30000000000000004",
                  "",
                  "// Depois: valor em centavos (inteiro) com moeda explícita",
                  "class Money {",
                  "  constructor(cents, currency) {",
                  "    this.cents = cents;",
                  "    this.currency = currency;",
                  "  }",
                  "  plus(other) {",
                  "    if (other.currency !== this.currency) throw new Error(\"moedas diferentes\");",
                  "    return new Money(this.cents + other.cents, this.currency);",
                  "  }",
                "}",
                  "",
                  "const total = new Money(10, \"BRL\").plus(new Money(20, \"BRL\")); // 30 centavos",
                ].join("\n"),
              },
              explanation:
                "O tipo Money resolve o arredondamento (usa inteiros) e impede a soma de moedas diferentes — erros " +
                "que, com dois números soltos, passariam em silêncio.",
            },
            {
              title: "Argumentos do mesmo tipo que se confundem",
              context: "Quando duas coisas diferentes têm o mesmo tipo primitivo, trocá-las de posição não gera nenhum aviso.",
              code: {
                language: "javascript",
                filename: "swapped-ids.js",
                code: [
                  "// Antes: os dois ids são números — trocar a ordem não gera erro",
                  "function transfer(fromAccountId, toAccountId, amount) { /* ... */ }",
                  "transfer(20, 10, 500); // quem é a origem, quem é o destino?",
                  "",
                  "// Depois: chamada com nomes, cada valor é identificável",
                  "function transfer({ from, to, amount }) { /* ... */ }",
                  "transfer({ from: accountA, to: accountB, amount: new Money(50000, \"BRL\") });",
                ].join("\n"),
              },
              explanation:
                "Nomear os argumentos elimina a troca silenciosa, e o valor como Money deixa claro que 500 são " +
                "centavos, não reais. Em linguagens com tipos estáticos, ids distintos também poderiam ser tipos " +
                "diferentes, e o compilador recusaria a troca.",
            },
            {
              title: "Unidades implícitas",
              context: "Um número sem unidade obriga a lembrar (ou adivinhar) se são metros, quilômetros, segundos ou milissegundos.",
              code: {
                language: "javascript",
                filename: "units.js",
                code: [
                  "// Antes: 5 é km, milhas ou metros?",
                  "function estimateTravelTime(distance) { /* ... */ }",
                  "estimateTravelTime(5);",
                  "",
                  "// Depois: a unidade faz parte do valor",
                  "class Distance {",
                  "  constructor(meters) { this.meters = meters; }",
                  "  static fromKilometers(km) { return new Distance(km * 1000); }",
                  "}",
                  "",
                  "function estimateTravelTime(distance) { /* usa distance.meters */ }",
                  "estimateTravelTime(Distance.fromKilometers(5));",
                ].join("\n"),
              },
              explanation:
                "Distance.fromKilometers(5) diz a unidade na própria chamada, e internamente tudo usa metros. A " +
                "conversão errada deixa de ser possível por descuido.",
            },
          ],
          exercise: {
            problem:
              "O telefone do cliente é uma string solta, e cada função que o recebe repete uma checagem de " +
              "formato — com pequenas diferenças entre elas.",
            problemCode: {
              language: "javascript",
              filename: "phone.js",
              code: [
                "function sendSms(phone, text) {",
                "  if (!/^\\d{11}$/.test(phone)) throw new Error(\"telefone inválido\");",
                "  sms.send(phone, text);",
                "}",
                "",
                "function formatPhone(phone) {",
                "  if (phone.length !== 11) throw new Error(\"telefone inválido\");",
                "  return \"(\" + phone.slice(0, 2) + \") \" + phone.slice(2, 7) + \"-\" + phone.slice(7);",
                "}",
              ].join("\n"),
            },
            task:
              "Crie um tipo PhoneNumber que valide na criação e carregue a formatação, e ajuste as duas funções " +
              "para receberem o tipo em vez da string.",
            hint: "A validação deve acontecer uma vez, no construtor. Depois disso, as funções não precisam mais checar — e formatPhone vira um método do tipo.",
            solution: {
              code: {
                language: "javascript",
                filename: "phone.refactored.js",
                code: [
                  "class PhoneNumber {",
                  "  constructor(digits) {",
                  "    if (!/^\\d{11}$/.test(digits)) throw new Error(\"telefone inválido\");",
                  "    this.digits = digits;",
                  "  }",
                  "",
                  "  formatted() {",
                  "    const d = this.digits;",
                  "    return \"(\" + d.slice(0, 2) + \") \" + d.slice(2, 7) + \"-\" + d.slice(7);",
                  "  }",
                  "}",
                  "",
                  "function sendSms(phone, text) {",
                  "  sms.send(phone.digits, text);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A regra do telefone válido existe em um só lugar, e as funções que recebem um PhoneNumber podem " +
                "confiar nele. A formatação, que era uma função solta, passou a ser um comportamento do próprio tipo.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "refactoring",
      order: 40,
      title: "Refactoring",
      requires: ["Code Smells", "Testing & Quality Engineering / Testing Fundamentals"],
      summary:
        "Guarda-chuva (o que é refatorar, quando/quando não) → técnicas mecânicas específicas, muitas delas " +
        "corrigindo os smells já diagnosticados. Só se refatora com segurança havendo rede de testes.",
      concepts: [
        concept({
          order: 10,
          title: "Refactoring",
          isNew: true,
          note: "guarda-chuva: transformação que preserva comportamento; \"duas camadas\" (adicionar feature × refatorar), por que fazer, quando não fazer",
          summary: "Refactoring é mudar a estrutura interna do código sem alterar o comportamento que ele tem por fora.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "As mesmas entradas continuam produzindo as mesmas saídas e efeitos. Não é reescrever, e não é corrigir " +
                "bugs nem adicionar funcionalidade — é reorganizar, em passos pequenos, o que já funciona.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Código que só recebe acréscimos fica mais caro a cada funcionalidade, e refatorar é o que segura esse " +
                "custo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Código que só recebe acréscimos, sem reorganização, fica cada vez mais difícil de entender e de " +
                "mudar — cada nova funcionalidade custa mais que a anterior. Refatorar mantém o custo da mudança " +
                "baixo. A frase que resume o uso mais comum: \"faça a mudança fácil (isso pode ser difícil), depois " +
                "faça a mudança fácil\" — primeiro reorganize o código para que a funcionalidade nova caiba " +
                "naturalmente, depois adicione-a.",
            },
            {
              type: "paragraph",
              text:
                "A regra dos \"dois chapéus\" organiza o trabalho: ou você está adicionando funcionalidade (e os " +
                "testes novos passam a cobrir comportamento novo), ou está refatorando (e nenhum teste " +
                "existente deve mudar). Trocar de chapéu é permitido; usar os dois ao mesmo tempo, não — é assim " +
                "que se perde a noção de qual mudança quebrou o quê. Bons momentos para refatorar: antes de " +
                "adicionar uma funcionalidade, ao corrigir um bug, ao rever código e ao notar um smell pela " +
                "terceira vez. Quando não refatorar: código que será descartado, código sem qualquer forma de " +
                "verificar o comportamento, ou quando uma reescrita completa é de fato a melhor opção.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "refatorar antes de acrescentar: a estrutura muda, o comportamento não:" },
            {
              type: "code",
              language: "javascript",
              filename: "refactoring.js",
              code: [
                "// Passo 1 (refatoração): mesma saída, estrutura preparada para a mudança",
                "// Antes",
                "function price(order) {",
                "  return order.items.reduce((s, i) => s + i.price, 0) * 0.9;",
                "}",
                "",
                "// Depois: o desconto ganhou um lugar próprio",
                "const DISCOUNT_RATE = 0.9;",
                "function subtotal(order) {",
                "  return order.items.reduce((s, i) => s + i.price, 0);",
                "}",
                "function price(order) {",
                "  return subtotal(order) * DISCOUNT_RATE;",
                "}",
                "",
                "// Passo 2 (funcionalidade): agora o desconto por cliente cabe com facilidade",
                "function price(order) {",
                "  const rate = order.customer.isVip ? 0.8 : DISCOUNT_RATE;",
                "  return subtotal(order) * rate;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O passo 1 não muda nenhum resultado — qualquer teste existente continua passando igual. Só o " +
                "passo 2 muda o comportamento, e por estar separado, se algo quebrar, a origem é óbvia.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Se você precisa alterar um teste existente para que ele passe, houve mudança de comportamento: não era só " +
                "refatoração.",
                "Misturar refatoração e funcionalidade nova no mesmo passo esconde qual das mudanças causou um eventual bug.",
                "Não compensa em código descartável nem em código sem nenhuma forma de verificar o comportamento; nesse " +
                "caso, crie primeiro a rede de segurança.",
              ],
            },
          ],
          examples: [
            {
              title: "Refatorar para preparar uma funcionalidade",
              context: "Antes de acrescentar algo novo, reorganize o que já existe para que o novo caiba sem contorcer o código.",
              code: {
                language: "javascript",
                filename: "prepare-then-add.js",
                code: [
                  "// Precisamos aceitar cupons. Hoje o desconto está escrito dentro de checkout:",
                  "function checkout(cart) {",
                  "  const total = cart.total - cart.total * 0.05; // desconto fixo",
                  "  return charge(total);",
                  "}",
                  "",
                  "// Commit 1 (refatoração, sem mudar resultado): isolar o desconto",
                  "function applyDiscount(total) {",
                  "  return total - total * 0.05;",
                  "}",
                  "function checkout(cart) {",
                  "  return charge(applyDiscount(cart.total));",
                  "}",
                  "",
                  "// Commit 2 (funcionalidade): agora o cupom é uma mudança local",
                  "function applyDiscount(total, coupon) {",
                  "  const rate = coupon ? coupon.rate : 0.05;",
                  "  return total - total * rate;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Dois commits, dois chapéus. O primeiro pode ser revisado como \"nada muda por fora\"; o segundo " +
                "traz apenas a lógica nova. Mesclar os dois esconderia qual das mudanças causou um eventual bug.",
            },
            {
              title: "O comportamento observável não muda",
              context: "O teste de que foi uma refatoração: os mesmos testes, sem alteração, passam antes e depois.",
              code: {
                language: "javascript",
                filename: "same-tests.js",
                code: [
                  "function testTotal() {",
                  "  const order = { items: [{ price: 10 }, { price: 30 }] };",
                  "  if (price(order) !== 36) throw new Error(\"total incorreto\");",
                  "}",
                  "",
                  "// Esse teste passa com a versão antes da refatoração...",
                  "// ...e continua passando, sem nenhuma alteração, depois dela.",
                  "// Se foi preciso mudar o teste, provavelmente mudou o comportamento.",
                ].join("\n"),
              },
              explanation:
                "Se você precisar alterar um teste existente para que ele passe, é sinal de que houve mudança de " +
                "comportamento — logo, não era só uma refatoração. Esse é o critério mais prático para saber em " +
                "qual chapéu se está.",
            },
            {
              title: "Quando não vale refatorar",
              context: "Refatorar tem custo; nem todo código merece esse investimento.",
              code: {
                language: "javascript",
                filename: "throwaway-script.js",
                code: [
                  "// Script de migração único, roda uma vez e é apagado.",
                  "// Feio, mas funciona — melhorar sua estrutura não traz nenhum retorno.",
                  "const rows = await db.query(\"SELECT * FROM legacy_users\");",
                  "for (const row of rows) {",
                  "  await db.query(\"INSERT INTO users (id, name) VALUES ($1, $2)\", [row.id, row.name]);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Refatorar compensa em código que vai continuar sendo lido e alterado. Para algo que será " +
                "executado uma vez e descartado, o esforço não se paga — o mesmo vale para código sem qualquer " +
                "forma de verificar o comportamento, onde é preciso primeiro criar essa rede de segurança.",
            },
          ],
          exercise: {
            problem:
              "Duas alterações foram propostas em um pull request para a função de frete. Uma delas é uma " +
              "refatoração, a outra não.",
            problemCode: {
              language: "javascript",
              filename: "shipping-changes.js",
              code: [
                "// Original",
                "function shipping(weight) {",
                "  if (weight > 10) return weight * 2 + 5;",
                "  return weight * 2;",
                "}",
                "",
                "// Alteração A",
                "function shipping(weight) {",
                "  const base = weight * 2;",
                "  return weight > 10 ? base + 5 : base;",
                "}",
                "",
                "// Alteração B",
                "function shipping(weight) {",
                "  if (weight >= 10) return weight * 2 + 5;",
                "  return weight * 2;",
                "}",
              ].join("\n"),
            },
            task:
              "Diga qual das duas alterações é uma refatoração e qual muda o comportamento, justificando com um " +
              "valor de entrada que prove a diferença.",
            hint: "Teste os dois candidatos com weight = 10 (o valor exatamente na fronteira) e compare com o original.",
            solution: {
              code: {
                language: "javascript",
                filename: "shipping-analysis.js",
                code: [
                  "// weight = 10",
                  "// Original: 10 > 10 é falso → 10 * 2 = 20",
                  "// A:        10 > 10 é falso → base = 20 → 20",
                  "// B:        10 >= 10 é verdadeiro → 10 * 2 + 5 = 25  (mudou!)",
                  "",
                  "// A é refatoração: o resultado é idêntico para toda entrada.",
                  "// B muda o comportamento: passou a cobrar taxa a partir de 10, não acima de 10.",
                ].join("\n"),
              },
              explanation:
                "A só reorganiza o cálculo (introduz uma variável), sem alterar nenhum resultado. B troca > por >=, " +
                "o que muda a fronteira da regra de negócio: é uma alteração de comportamento e deveria ir num " +
                "commit à parte, com seu próprio teste.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Extract Function",
          requires: ["Refactoring"],
          note: "extrair função — dar nome e função própria a um trecho de código",
          summary: "Extract Function é mover um trecho de código para uma função nova, com um nome que diz a intenção dele.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O trecho original é substituído por uma chamada a essa função. O nome deve dizer o que o trecho faz, não " +
                "como faz. É a técnica de refatoração mais usada e a correção padrão para os smells Long Method e " +
                "Duplicate Code.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um comentário explicando o que um bloco faz é o nome da função que ainda não foi extraída.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica em passos pequenos: (1) escolha o trecho e um nome que descreva sua intenção; (2) crie a " +
                "função nova e copie o trecho para ela; (3) identifique as variáveis do escopo original que o " +
                "trecho lê — elas viram parâmetros — e as que ele altera — a função deve devolvê-las; (4) " +
                "substitua o trecho original pela chamada; (5) rode os testes. Se o trecho tem mais de um valor " +
                "de saída, geralmente é sinal de que precisa ser dividido em duas extrações.",
            },
            {
              type: "paragraph",
              text:
                "Quando extrair: o trecho tem um propósito que você consegue nomear, há um comentário explicando o " +
                "que o bloco faz (o comentário vira o nome), ou o mesmo código aparece em mais de um lugar. Não " +
                "compensa extrair se o nome não dizer nada além do que o código já diz.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um trecho com um propósito claro extraído com um nome:" },
            {
              type: "code",
              language: "javascript",
              filename: "extract-function.js",
              code: [
                "// Antes",
                "function printInvoice(invoice) {",
                "  console.log(\"Fatura #\" + invoice.id);",
                "",
                "  // calcula total",
                "  let total = 0;",
                "  for (const line of invoice.lines) total += line.price * line.quantity;",
                "",
                "  console.log(\"Total: \" + total.toFixed(2));",
                "}",
                "",
                "// Depois: o comentário virou o nome da função",
                "function printInvoice(invoice) {",
                "  console.log(\"Fatura #\" + invoice.id);",
                "  console.log(\"Total: \" + calculateTotal(invoice.lines).toFixed(2));",
                "}",
                "",
                "function calculateTotal(lines) {",
                "  let total = 0;",
                "  for (const line of lines) total += line.price * line.quantity;",
                "  return total;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O trecho lia invoice.lines (virou o parâmetro lines) e produzia total (virou o retorno). O " +
                "comportamento é exatamente o mesmo, mas calculateTotal agora pode ser testada e reutilizada sozinha.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o trecho pode receber um nome que diz a intenção, como cálculos, condições complexas e corpos de laço.",
                "Para corrigir funções longas e trechos duplicados: o mesmo trecho extraído passa a ter um único lugar.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se o nome não acrescenta nada além do que o próprio trecho já diz, a extração só cria indireção.",
                "Um trecho que altera variáveis do escopo devolve o valor em vez de mutar: a função extraída não deve " +
                "depender de estado externo.",
              ],
            },
          ],
          examples: [
            {
              title: "Trecho que produz um valor",
              context: "O caso mais direto: o fragmento calcula algo, então a função extraída devolve esse valor.",
              code: {
                language: "javascript",
                filename: "extract-value.js",
                code: [
                  "// Antes",
                  "function describeUser(user) {",
                  "  const years = Math.floor((Date.now() - user.createdAt) / (365 * 24 * 60 * 60 * 1000));",
                  "  return user.name + \" (\" + years + \" anos de conta)\";",
                  "}",
                  "",
                  "// Depois",
                  "function accountAgeInYears(user) {",
                  "  return Math.floor((Date.now() - user.createdAt) / (365 * 24 * 60 * 60 * 1000));",
                  "}",
                  "function describeUser(user) {",
                  "  return user.name + \" (\" + accountAgeInYears(user) + \" anos de conta)\";",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O cálculo do tempo de conta tem agora um nome e pode ser reaproveitado (em um relatório, por " +
                "exemplo) sem copiar a expressão.",
            },
            {
              title: "Condição complexa com nome",
              context: "Extrair a condição de um if dá nome à regra de negócio que ela representa.",
              code: {
                language: "javascript",
                filename: "extract-condition.js",
                code: [
                  "// Antes: é preciso decifrar o que a condição significa",
                  "if (user.age >= 18 && user.hasConsent && !user.isBlocked && user.country === \"BR\") {",
                  "  allowSignUp(user);",
                  "}",
                  "",
                  "// Depois: a regra tem nome",
                  "function canSignUp(user) {",
                  "  return user.age >= 18 && user.hasConsent && !user.isBlocked && user.country === \"BR\";",
                  "}",
                  "",
                  "if (canSignUp(user)) allowSignUp(user);",
                ].join("\n"),
              },
              explanation:
                "O if agora diz o que se decide (pode se cadastrar), e os detalhes de como se decide ficam em um " +
                "lugar só — onde a regra pode ser alterada ou testada.",
            },
            {
              title: "Trecho que modifica uma variável do escopo",
              context: "Quando o fragmento altera um valor, a função extraída deve devolvê-lo em vez de mutar o escopo original.",
              code: {
                language: "javascript",
                filename: "extract-with-mutation.js",
                code: [
                  "// Antes: 'total' é alterado no meio da função",
                  "function checkout(cart) {",
                  "  let total = cart.subtotal;",
                  "  if (cart.coupon) total -= cart.coupon.value;",
                  "  if (cart.isFirstPurchase) total -= 10;",
                  "  return total;",
                  "}",
                  "",
                  "// Depois: as reduções foram extraídas e devolvem o novo total",
                  "function applyDiscounts(subtotal, cart) {",
                  "  let total = subtotal;",
                  "  if (cart.coupon) total -= cart.coupon.value;",
                  "  if (cart.isFirstPurchase) total -= 10;",
                  "  return total;",
                  "}",
                  "function checkout(cart) {",
                  "  return applyDiscounts(cart.subtotal, cart);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O trecho lia subtotal e cart, e modificava total. Por isso, subtotal e cart viraram parâmetros e o " +
                "total virou o valor de retorno — sem depender de nenhuma variável externa.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo mistura validação, cálculo e formatação. Cada bloco já tem um comentário " +
              "explicando o que faz.",
            problemCode: {
              language: "javascript",
              filename: "order-summary.js",
              code: [
                "function orderSummary(order) {",
                "  // verifica se há itens",
                "  if (order.items.length === 0) return \"Pedido vazio\";",
                "",
                "  // soma quantidade de itens",
                "  let count = 0;",
                "  for (const item of order.items) count += item.quantity;",
                "",
                "  return \"Pedido com \" + count + \" itens\";",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Extract Function ao bloco que soma as quantidades, dando a ele um nome que substitua o " +
              "comentário, e deixe orderSummary usando a nova função.",
            hint: "O bloco lê order.items e produz count. Então recebe items como parâmetro e devolve count.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-summary.refactored.js",
                code: [
                  "function countItems(items) {",
                  "  let count = 0;",
                  "  for (const item of items) count += item.quantity;",
                  "  return count;",
                  "}",
                  "",
                  "function orderSummary(order) {",
                  "  if (order.items.length === 0) return \"Pedido vazio\";",
                  "  return \"Pedido com \" + countItems(order.items) + \" itens\";",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O comentário \"soma quantidade de itens\" virou o nome countItems e não é mais necessário. A " +
                "função nova recebe só o que usa (items) e devolve o que produz (count), então pode ser testada " +
                "sem montar um pedido inteiro.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Extract Variable",
          requires: ["Refactoring"],
          note: "extrair variável — dar nome a uma expressão complexa ou repetida",
          summary:
            "Extract Variable é substituir uma expressão por uma variável local cujo nome explica o que ela " +
            "significa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Também é chamada de \"variável explicativa\": ela não muda o que o código calcula, apenas torna visível a " +
                "intenção por trás do cálculo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma condição longa dividida em variáveis nomeadas passa a ser lida como uma frase, e cada parte pode ser " +
                "inspecionada.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) verifique que a expressão não tem efeitos colaterais; (2) declare uma constante com " +
                "um nome que diga o que a expressão representa e atribua a ela o resultado; (3) substitua a " +
                "expressão original pela variável; (4) rode os testes. Se a mesma expressão aparecer mais de " +
                "uma vez, substitua todas as ocorrências pela variável.",
            },
            {
              type: "paragraph",
              text:
                "Serve especialmente para condições longas, fórmulas com vários passos e valores calculados mais de " +
                "uma vez. Se o nome só faz sentido dentro de uma função, uma variável é suficiente; se a mesma ideia " +
                "for útil em vários lugares, considere Extract Function em vez disso. E se o nome apenas repetir o " +
                "que a expressão já diz de forma óbvia, a variável é ruído.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma condição opaca ganha nomes que explicam cada parte:" },
            {
              type: "code",
              language: "javascript",
              filename: "extract-variable.js",
              code: [
                "// Antes: o que essa condição decide?",
                "if (order.total > 500 && order.customer.orders.length > 5 && !order.customer.hasDebt) {",
                "  applyVipDiscount(order);",
                "}",
                "",
                "// Depois: cada parte da regra tem um nome",
                "const isLargeOrder = order.total > 500;",
                "const isLoyalCustomer = order.customer.orders.length > 5;",
                "const isInGoodStanding = !order.customer.hasDebt;",
                "",
                "if (isLargeOrder && isLoyalCustomer && isInGoodStanding) {",
                "  applyVipDiscount(order);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A regra agora se lê como uma frase (pedido grande, cliente fiel e em dia). Cada critério tem um " +
                "nome, o que também ajuda a depurar: dá para inspecionar o valor de cada variável separadamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando uma expressão exige esforço para ser entendida e o nome do resultado explica o porquê que ela esconde.",
                "Quando a mesma expressão aparece mais de uma vez e evita recalcular ou repetir o caminho.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se o nome só repete a expressão (`isEmpty` para `items.length === 0`), a variável é ruído.",
                "Uma expressão que já é autoexplicativa não ganha nada ao ser separada.",
              ],
            },
          ],
          examples: [
            {
              title: "Fórmula dividida em passos com nome",
              context: "Uma conta com vários termos fica mais fácil de entender (e de conferir) quando cada termo se chama pelo que é.",
              code: {
                language: "javascript",
                filename: "named-steps.js",
                code: [
                  "// Antes",
                  "const price = order.quantity * order.itemPrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + Math.min(order.quantity * order.itemPrice * 0.1, 100);",
                  "",
                  "// Depois",
                  "const basePrice = order.quantity * order.itemPrice;",
                  "const bulkDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;",
                  "const shipping = Math.min(basePrice * 0.1, 100);",
                  "const price = basePrice - bulkDiscount + shipping;",
                ].join("\n"),
              },
              explanation:
                "Agora dá para ler o cálculo como uma história (preço base, menos desconto por volume, mais " +
                "frete limitado a 100) e conferir cada parte separadamente com os números do negócio.",
            },
            {
              title: "Expressão repetida",
              context: "Quando o mesmo cálculo aparece mais de uma vez, uma variável evita repetir — e recalcular.",
              code: {
                language: "javascript",
                filename: "repeated-expression.js",
                code: [
                  "// Antes: a mesma expressão três vezes",
                  "if (user.profile.address.country === \"BR\") {",
                  "  currency = \"BRL\";",
                  "  tax = user.profile.address.country === \"BR\" ? 0.12 : 0.2;",
                  "  label = user.profile.address.country + \" (padrão)\";",
                  "}",
                  "",
                  "// Depois",
                  "const country = user.profile.address.country;",
                  "if (country === \"BR\") {",
                  "  currency = \"BRL\";",
                  "  tax = country === \"BR\" ? 0.12 : 0.2;",
                  "  label = country + \" (padrão)\";",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O caminho user.profile.address.country existe uma vez, com um nome curto. Se a estrutura do " +
                "usuário mudar, há um único lugar para ajustar.",
            },
            {
              title: "Quando a variável não ajuda",
              context: "Extrair só faz sentido quando o nome acrescenta informação; se apenas repete a expressão, é ruído.",
              code: {
                language: "javascript",
                filename: "useless-variable.js",
                code: [
                  "// A variável não diz nada além da própria expressão",
                  "const isEmpty = items.length === 0;",
                  "if (isEmpty) return;",
                  "",
                  "// Mais direto, e igualmente claro",
                  "if (items.length === 0) return;",
                ].join("\n"),
              },
              explanation:
                "items.length === 0 já é autoexplicativo. A variável isEmpty só acrescentaria uma linha e um nome " +
                "a mais para o leitor acompanhar, sem informação nova.",
            },
          ],
          exercise: {
            problem:
              "Esta linha calcula a taxa de entrega, mas é difícil dizer o que cada número e cada condição " +
              "representam.",
            problemCode: {
              language: "javascript",
              filename: "delivery-fee.js",
              code: [
                "function deliveryFee(order) {",
                "  return order.distanceKm > 20 ? order.distanceKm * 1.5 + (order.isExpress ? 15 : 0) : order.isExpress ? 15 : 5;",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Extract Variable para dar nome aos conceitos por trás da expressão, sem mudar o resultado " +
              "para nenhuma entrada.",
            hint: "Há três ideias: a distância é longa?, o custo adicional do expresso e o custo base de cada faixa.",
            solution: {
              code: {
                language: "javascript",
                filename: "delivery-fee.refactored.js",
                code: [
                  "function deliveryFee(order) {",
                  "  const isLongDistance = order.distanceKm > 20;",
                  "  const expressSurcharge = order.isExpress ? 15 : 0;",
                  "",
                  "  if (isLongDistance) return order.distanceKm * 1.5 + expressSurcharge;",
                  "  return order.isExpress ? 15 : 5;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "isLongDistance e expressSurcharge dão nome às duas ideias que a expressão misturava. O resultado " +
                "é idêntico para qualquer pedido, mas agora dá para ler a regra em voz alta.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Rename",
          requires: ["Refactoring"],
          note: "renomear — corrigir um nome que não reflete mais o que a coisa é ou faz",
          summary:
            "Rename é a refatoração que troca o nome de um elemento do código e atualiza todos os lugares que o usam.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Vale para variáveis, funções, classes, módulos e arquivos, sem alterar o comportamento. Se Naming " +
                "(módulo Clean Code) trata de escolher bons nomes na primeira vez, Rename trata de corrigi-los depois — " +
                "porque o entendimento sobre o problema evolui e os nomes precisam acompanhar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um nome que ficou para trás depois de uma mudança passa a mentir, e cada leitura seguinte paga por isso.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) escolha o novo nome; (2) use a função \"renomear símbolo\" do editor ou da IDE, que " +
                "atualiza todas as referências entendendo o código; (3) rode os testes e verifique se o " +
                "compilador ou o linter aponta algo esquecido. Evite busca-e-substitui de texto: ele troca " +
                "ocorrências que só têm o mesmo texto (um campo id em outra classe, uma palavra dentro de uma " +
                "string) e deixa passar usos que não têm o mesmo texto.",
            },
            {
              type: "paragraph",
              text:
                "Cuidados: em interfaces públicas (uma API usada por outros times ou por código que você não " +
                "controla), renomear quebra quem depende do nome antigo — mantenha o nome antigo como alias " +
                "marcado como obsoleto por um tempo e migre aos poucos. Nomes usados por reflexão, em strings ou em " +
                "arquivos de configuração também não são pegos pela ferramenta e precisam ser conferidos à mão.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um nome que passou a mentir depois que a função mudou, e o novo:" },
            {
              type: "code",
              language: "javascript",
              filename: "rename.js",
              code: [
                "// Antes: o nome diz \"pegar usuário\", mas a função também cria se não existir",
                "function getUser(email) {",
                "  return db.users.findByEmail(email) ?? db.users.create({ email });",
                "}",
                "const user = getUser(\"ana@mail.com\");",
                "",
                "// Depois: o nome descreve o comportamento inteiro",
                "function findOrCreateUser(email) {",
                "  return db.users.findByEmail(email) ?? db.users.create({ email });",
                "}",
                "const user = findOrCreateUser(\"ana@mail.com\");",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A lógica não mudou uma linha. Só o nome passou a comunicar o efeito real — que, se ficasse como " +
                "getUser, levaria alguém a chamá-la achando que ela apenas lê.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Assim que o nome deixa de refletir o que a coisa é ou faz; não é preciso esperar uma grande limpeza.",
                "Para variáveis locais, funções, classes e arquivos, sempre com a ferramenta de rename do editor.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em API pública, renomear de uma vez quebra quem depende do nome antigo: mantenha o antigo, com aviso, " +
                "durante a transição.",
                "Busca-e-substitui às cegas trata funções, campos e texto como iguais e costuma gerar bugs silenciosos.",
              ],
            },
          ],
          examples: [
            {
              title: "Renomear uma variável local",
              context: "O caso mais simples e mais frequente: o nome nasceu genérico e agora se sabe o que a variável representa.",
              code: {
                language: "javascript",
                filename: "rename-variable.js",
                code: [
                  "// Antes",
                  "const d = daysBetween(order.createdAt, today);",
                  "if (d > 30) markAsLate(order);",
                  "",
                  "// Depois",
                  "const daysSinceCreated = daysBetween(order.createdAt, today);",
                  "if (daysSinceCreated > 30) markAsLate(order);",
                ].join("\n"),
              },
              explanation:
                "É uma mudança local, sem riscos, e a condição passa a se ler como uma frase. Não é preciso esperar " +
                "uma \"grande limpeza\" para fazer isso — rename é para ser feito no momento em que o nome incomoda.",
            },
            {
              title: "Renomear uma API pública com transição",
              context: "Quando outros dependem do nome antigo, renomeie de forma gradual em vez de quebrá-los de uma vez.",
              code: {
                language: "javascript",
                filename: "rename-public-api.js",
                code: [
                  "// Novo nome passa a ser o principal",
                  "export function calculateShippingCost(order) {",
                  "  // ...",
                  "}",
                  "",
                  "/** @deprecated use calculateShippingCost — será removido na v3 */",
                  "export function calcShip(order) {",
                  "  return calculateShippingCost(order);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Quem usa calcShip continua funcionando, e recebe o aviso para migrar. Depois de um período (ou " +
                "quando todos os usos tiverem sido atualizados), o nome antigo pode ser removido sem surpresas.",
            },
            {
              title: "Busca-e-substitui cego versus renomear símbolo",
              context: "Trocar texto é diferente de trocar um símbolo: só a ferramenta que entende o código sabe onde está cada uso.",
              code: {
                language: "javascript",
                filename: "blind-replace.js",
                code: [
                  "// Queremos renomear a função 'id' para 'userId' — mas o texto \"id\" aparece em outros contextos",
                  "function id(user) { return user.id; }        // função e campo têm o mesmo nome",
                  "const label = \"Confira o id do pedido\";     // texto dentro de uma string",
                  "const orderId = order.id;                     // campo de outro objeto",
                  "",
                  "// Um busca-e-substitui de 'id' quebraria o campo order.id e alteraria o texto.",
                  "// A opção \"renomear símbolo\" do editor troca só a função e seus usos reais.",
                ].join("\n"),
              },
              explanation:
                "A ferramenta de rename entende o que é a função, o que é um campo e o que é apenas texto. " +
                "Um substituir-tudo trata os três como iguais, e o resultado costuma ser um bug silencioso.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo é chamada em três lugares, mas o nome não diz o que ela calcula, e a variável de " +
              "dentro também não ajuda.",
            problemCode: {
              language: "javascript",
              filename: "process.js",
              code: [
                "function process(o) {",
                "  const x = o.weight * 2.5;",
                "  return x < 15 ? 15 : x;",
                "}",
                "",
                "const a = process(orderA);",
                "const b = process(orderB);",
                "const c = process(orderC);",
              ].join("\n"),
            },
            task:
              "Aplique Rename à função, ao parâmetro e à variável, atualizando os três usos, sem alterar o " +
              "comportamento.",
            hint: "Descubra primeiro o que a função calcula (peso vezes um valor, com um mínimo) e nomeie de acordo.",
            solution: {
              code: {
                language: "javascript",
                filename: "process.refactored.js",
                code: [
                  "function calculateShippingCost(order) {",
                  "  const cost = order.weight * 2.5;",
                  "  return cost < 15 ? 15 : cost;",
                  "}",
                  "",
                  "const shippingA = calculateShippingCost(orderA);",
                  "const shippingB = calculateShippingCost(orderB);",
                  "const shippingC = calculateShippingCost(orderC);",
                ].join("\n"),
              },
              explanation:
                "A função, o parâmetro (o) e a variável interna (x) agora descrevem o que são, e os três usos " +
                "foram atualizados. Numa IDE, isso seria um único comando de renomear símbolo por elemento — o " +
                "comportamento não muda.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Inline Function",
          requires: ["Refactoring"],
          note: "operação inversa de Extract Function — ensinada em par por ordem de estudo, não por Requires",
          summary: "Inline Function é trocar as chamadas de uma função pelo corpo dela e remover a função.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "É a operação inversa de Extract Function. Serve quando a função é tão simples que o corpo é tão claro " +
                "quanto o nome, ou quando um conjunto de funções está mal dividido e vale desfazer a divisão antes de " +
                "reorganizar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Toda função obriga quem lê a pular para outro lugar, então ela precisa pagar esse salto com um nome que " +
                "ensine algo.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) confirme que a função não é sobrescrita por subclasses ou usada por quem você não " +
                "controla; (2) substitua uma chamada pelo corpo, ajustando parâmetros; (3) rode os testes; (4) " +
                "repita para cada chamada; (5) remova a função quando não houver mais usos. Fazer uma chamada " +
                "por vez torna o caminho reversível se algo der errado.",
            },
            {
              type: "paragraph",
              text:
                "Quando usar: a função só repassa a chamada para outra (indireção sem valor), o nome não diz mais do " +
                "que o corpo, ou você quer desfazer uma extração ruim para refazê-la de outro jeito. Quando não " +
                "usar: a função é usada em muitos lugares e o nome agrega significado — então ela está fazendo o " +
                "seu trabalho. As duas técnicas se completam: extraia para dar nome, incorpore para remover " +
                "nomes que não ajudam.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função que só repassa a chamada, incorporada onde é usada:" },
            {
              type: "code",
              language: "javascript",
              filename: "inline-function.js",
              code: [
                "// Antes: a função só delega e não acrescenta significado",
                "function getRating(driver) {",
                "  return moreThanFiveLateDeliveries(driver) ? 2 : 1;",
                "}",
                "function moreThanFiveLateDeliveries(driver) {",
                "  return driver.lateDeliveries > 5;",
                "}",
                "",
                "// Depois: o corpo vive onde é usado",
                "function getRating(driver) {",
                "  return driver.lateDeliveries > 5 ? 2 : 1;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O nome moreThanFiveLateDeliveries apenas repetia a condição em palavras, e obrigava o leitor a " +
                "pular para outra função. Incorporada, a regra aparece onde é usada e está tão clara quanto antes.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a função só delega e o nome não acrescenta informação além do corpo.",
                "Quando um conjunto de funções está mal dividido e vale juntar tudo para extrair de novo do jeito certo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se a função é usada em vários lugares e o nome esclarece a intenção, incorporar duplica a regra e troca um " +
                "nome por uma expressão a decifrar.",
                "Não serve para toda função curta, só para as que não acrescentam valor.",
              ],
            },
          ],
          examples: [
            {
              title: "Função trivial que só delega",
              context: "Funções de uma linha que repassam a chamada aumentam o caminho de leitura sem informar nada novo.",
              code: {
                language: "javascript",
                filename: "trivial-delegation.js",
                code: [
                  "// Antes",
                  "function fetchUsers() {",
                  "  return api.get(\"/users\");",
                  "}",
                  "function loadUsers() {",
                  "  return fetchUsers();",
                  "}",
                  "",
                  "// Depois: uma camada a menos",
                  "function loadUsers() {",
                  "  return api.get(\"/users\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "fetchUsers só existia para ser chamada por loadUsers. Removê-la elimina um passo na leitura sem " +
                "perder nenhuma informação.",
            },
            {
              title: "Incorporar para reorganizar melhor",
              context: "Quando um conjunto de funções está mal dividido, às vezes é mais fácil juntar tudo e extrair de novo do jeito certo.",
              code: {
                language: "javascript",
                filename: "inline-to-reshape.js",
                code: [
                  "// Antes: a divisão em 'partes' não segue nenhum critério claro",
                  "function reportPart1(data) { return header(data) + rows(data); }",
                  "function reportPart2(data) { return summary(data) + footer(data); }",
                  "function buildReport(data) { return reportPart1(data) + reportPart2(data); }",
                  "",
                  "// Passo 1: incorporar tudo em uma função só",
                  "function buildReport(data) {",
                  "  return header(data) + rows(data) + summary(data) + footer(data);",
                  "}",
                  "",
                  "// Passo 2: agora extrair de novo, do jeito que faz sentido (corpo e rodapé)",
                  "function buildReport(data) {",
                  "  return reportBody(data) + reportFooter(data);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "reportPart1 e reportPart2 eram nomes sem significado. Juntar tudo dá uma visão completa do que a " +
                "função faz, e a nova divisão (corpo e rodapé) pode ser feita com nomes que dizem algo.",
            },
            {
              title: "Quando não incorporar",
              context: "Se a função é usada em vários lugares e o nome esclarece a intenção, ela está cumprindo o papel.",
              code: {
                language: "javascript",
                filename: "keep-the-function.js",
                code: [
                  "// O nome explica uma regra de negócio que a expressão não diz sozinha",
                  "function isEligibleForRefund(order) {",
                  "  return order.status === \"delivered\" && daysSince(order.deliveredAt) <= 7;",
                  "}",
                  "",
                  "if (isEligibleForRefund(order)) showRefundButton();",
                  "if (isEligibleForRefund(order)) allowRefundRequest();",
                ].join("\n"),
              },
              explanation:
                "Incorporar isso duplicaria a regra em dois lugares e trocaria um nome esclarecedor por uma " +
                "expressão a decifrar. Inline Function serve para funções que não acrescentam valor, não para " +
                "toda função curta.",
            },
          ],
          exercise: {
            problem:
              "Estas duas funções só existem para adicionar um nível de indireção. Ninguém as usa fora de " +
              "calculateTotal.",
            problemCode: {
              language: "javascript",
              filename: "total.js",
              code: [
                "function itemSubtotal(item) {",
                "  return getPrice(item) * item.quantity;",
                "}",
                "",
                "function getPrice(item) {",
                "  return item.price;",
                "}",
                "",
                "function calculateTotal(items) {",
                "  return items.reduce((sum, item) => sum + itemSubtotal(item), 0);",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Inline Function em getPrice e em itemSubtotal, deixando calculateTotal direto — mas " +
              "faça um passo de cada vez e explique a ordem.",
            hint: "Comece pela função mais \"interna\" (getPrice), que é usada só dentro de itemSubtotal.",
            solution: {
              code: {
                language: "javascript",
                filename: "total.refactored.js",
                code: [
                  "// Passo 1: incorporar getPrice em itemSubtotal",
                  "function itemSubtotal(item) {",
                  "  return item.price * item.quantity;",
                  "}",
                  "",
                  "// Passo 2: incorporar itemSubtotal em calculateTotal",
                  "function calculateTotal(items) {",
                  "  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Começando pela função mais interna, cada passo mexe em um nível e pode ser conferido pelos " +
                "testes. Ao final, o resultado é idêntico e calculateTotal mostra a regra completa em uma linha.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Extract Class",
          requires: ["Code Smells / Large Class"],
          note: "corrige a baixa coesão diagnosticada por Large Class",
          summary:
            "Extract Class é criar uma classe nova e mover para ela um grupo coeso de campos e métodos de uma classe " +
            "grande demais.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A classe original passa a se relacionar com a nova por composição. É a resposta ao smell Large Class: " +
                "onde a coesão era baixa (vários assuntos em um lugar), passam a existir duas classes com um assunto " +
                "cada.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Depois da extração, cada regra nova daquele assunto já tem um lugar natural para ser escrita.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica, em passos pequenos, rodando os testes a cada um: (1) decida a responsabilidade que sai " +
                "e dê um nome à classe nova; (2) crie a classe e faça a original guardar uma instância dela; (3) " +
                "mova os campos, um por vez (Move Field); (4) mova os métodos, um por vez, começando pelos que " +
                "usam menos coisas da classe original (Move Function); (5) revise as interfaces: a classe " +
                "original pode apenas delegar ou expor a nova diretamente; (6) confira os nomes das duas.",
            },
            {
              type: "paragraph",
              text:
                "Como identificar o candidato: campos com o mesmo prefixo, grupos de métodos que usam grupos " +
                "disjuntos de campos, ou um subconjunto de dados que muda junto. O critério final é sempre o " +
                "mesmo: cada classe resultante deve ter um único assunto que se descreve em uma frase.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "os campos de telefone saem de Person e viram uma classe própria:" },
            {
              type: "code",
              language: "javascript",
              filename: "extract-class.js",
              code: [
                "// Antes: Person mistura identidade e detalhes de telefone",
                "class Person {",
                "  constructor(name, areaCode, number) {",
                "    this.name = name;",
                "    this.areaCode = areaCode;",
                "    this.number = number;",
                "  }",
                "  phone() { return \"(\" + this.areaCode + \") \" + this.number; }",
                "}",
                "",
                "// Depois: o telefone tem sua classe, e Person a compõe",
                "class PhoneNumber {",
                "  constructor(areaCode, number) {",
                "    this.areaCode = areaCode;",
                "    this.number = number;",
                "  }",
                "  toString() { return \"(\" + this.areaCode + \") \" + this.number; }",
                "}",
                "",
                "class Person {",
                "  constructor(name, phoneNumber) {",
                "    this.name = name;",
                "    this.phoneNumber = phoneNumber;",
                "  }",
                "  phone() { return this.phoneNumber.toString(); }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As regras de formato do telefone agora vivem em PhoneNumber, e Person só sabe que tem um. Se " +
                "surgir a necessidade de validar o DDD, ela tem um lugar natural para ser escrita.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando um grupo de campos e métodos forma um assunto próprio dentro de uma classe grande, como campos com o " +
                "mesmo prefixo.",
                "Como correção do smell Large Class, movendo em passos pequenos com os testes verdes a cada um.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Tamanho não é o critério, coesão é: uma classe pequena com um assunto só não deve ser dividida.",
                "Dividir por dividir cria classes anêmicas e acrescenta acoplamento entre as partes.",
              ],
            },
          ],
          examples: [
            {
              title: "Extraindo um conceito escondido nos campos",
              context: "Campos com prefixo comum indicam a classe que ainda não existe.",
              code: {
                language: "javascript",
                filename: "extract-address.js",
                code: [
                  "// Antes",
                  "class Customer {",
                  "  constructor(name, street, city, zip) {",
                  "    this.name = name;",
                  "    this.street = street;",
                  "    this.city = city;",
                  "    this.zip = zip;",
                  "  }",
                  "  addressLabel() { return this.street + \", \" + this.city + \" \" + this.zip; }",
                  "}",
                  "",
                  "// Depois",
                  "class Address {",
                  "  constructor(street, city, zip) {",
                  "    this.street = street;",
                  "    this.city = city;",
                  "    this.zip = zip;",
                  "  }",
                  "  label() { return this.street + \", \" + this.city + \" \" + this.zip; }",
                  "}",
                  "class Customer {",
                  "  constructor(name, address) {",
                  "    this.name = name;",
                  "    this.address = address;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Address agora pode ser reutilizada (entrega, cobrança, fornecedor) e validada em um lugar único, " +
                "e Customer deixa de conhecer detalhes de endereço.",
            },
            {
              title: "Migração em passos, com o antigo delegando",
              context: "Para não quebrar quem usa a classe, a original pode delegar para a nova durante a transição.",
              code: {
                language: "javascript",
                filename: "delegate-during-transition.js",
                code: [
                  "class Person {",
                  "  constructor(name, phoneNumber) {",
                  "    this.name = name;",
                  "    this.phoneNumber = phoneNumber;",
                  "  }",
                  "",
                  "  // Antes ficava aqui; agora delega para a classe extraída",
                  "  get areaCode() { return this.phoneNumber.areaCode; }",
                  "  set areaCode(value) { this.phoneNumber.areaCode = value; }",
                  "}",
                  "",
                  "// Os chamadores antigos (person.areaCode) continuam funcionando.",
                  "// Quando todos migrarem para person.phoneNumber, os delegadores saem.",
                ].join("\n"),
              },
              explanation:
                "Em vez de alterar todos os usos de uma vez, a classe original repassa a chamada, e os " +
                "chamadores migram aos poucos, com os testes verdes em cada passo.",
            },
            {
              title: "Quando não extrair",
              context: "Dividir por dividir cria classes anêmicas e espalha um assunto que era um só.",
              code: {
                language: "javascript",
                filename: "dont-over-extract.js",
                code: [
                  "// Coesa: os três campos e os dois métodos giram em torno do mesmo assunto",
                  "class Temperature {",
                  "  constructor(celsius) { this.celsius = celsius; }",
                  "  toFahrenheit() { return this.celsius * 9 / 5 + 32; }",
                  "  isFreezing() { return this.celsius <= 0; }",
                  "}",
                  "",
                  "// Quebrar em TemperatureConverter e TemperatureChecker só distribuiria",
                  "// uma responsabilidade única entre duas classes que precisam uma da outra.",
                ].join("\n"),
              },
              explanation:
                "Tamanho não é o critério: coesão é. Uma classe pequena com um assunto só está certa, e dividi-la " +
                "só acrescentaria acoplamento entre as partes.",
            },
          ],
          exercise: {
            problem:
              "A classe Product carrega dimensões e cálculos de volume misturados com dados comerciais. Os " +
              "campos e métodos de dimensão só se relacionam entre si.",
            problemCode: {
              language: "javascript",
              filename: "product.js",
              code: [
                "class Product {",
                "  constructor(name, price, width, height, depth) {",
                "    this.name = name;",
                "    this.price = price;",
                "    this.width = width;",
                "    this.height = height;",
                "    this.depth = depth;",
                "  }",
                "  volume() { return this.width * this.height * this.depth; }",
                "  isBulky() { return this.volume() > 100000; }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Extract Class: crie uma classe Dimensions com os campos e métodos que se relacionam, e " +
              "faça Product usá-la por composição.",
            hint: "width, height, depth, volume() e isBulky() só usam dados de dimensão. name e price ficam em Product.",
            solution: {
              code: {
                language: "javascript",
                filename: "product.refactored.js",
                code: [
                  "class Dimensions {",
                  "  constructor(width, height, depth) {",
                  "    this.width = width;",
                  "    this.height = height;",
                  "    this.depth = depth;",
                  "  }",
                  "  volume() { return this.width * this.height * this.depth; }",
                  "  isBulky() { return this.volume() > 100000; }",
                  "}",
                  "",
                  "class Product {",
                  "  constructor(name, price, dimensions) {",
                  "    this.name = name;",
                  "    this.price = price;",
                  "    this.dimensions = dimensions;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Dimensions cuida só de tamanho, e Product só de dados comerciais. O cálculo de volume pode ser " +
                "testado sem criar um produto e reaproveitado por embalagens, caixas ou outro tipo que tenha dimensões.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Move Function",
          requires: ["Refactoring"],
          note: "mover função — levar o comportamento para perto dos dados que ele usa",
          summary:
            "Move Function é levar uma função para o lugar onde ela faz mais sentido, perto dos dados ou do assunto " +
            "que usa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Esse lugar pode ser a classe cujos dados ela usa, o módulo do assunto a que pertence, ou o escopo em que " +
                "é realmente usada. É a correção clássica para o smell Feature Envy, e também serve para reorganizar " +
                "módulos conforme o entendimento do domínio evolui.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um módulo `utils` que só cresce é sinal de funções que ainda não encontraram o seu assunto.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) examine tudo que a função usa do contexto atual — o que ela precisa vai junto ou " +
                "vira parâmetro; (2) copie a função para o novo lugar e adapte o que for preciso; (3) transforme a " +
                "original em uma função que só delega para a nova, e rode os testes; (4) atualize os chamadores " +
                "para usarem a nova diretamente; (5) quando ninguém mais usar a original, remova-a. Manter a " +
                "delegação por um tempo permite fazer a migração em passos seguros.",
            },
            {
              type: "paragraph",
              text:
                "Como decidir para onde mover: pergunte a que dados a função é mais próxima (quantos campos de A " +
                "ela usa, comparado aos de B?) e a que assunto ela pertence. Se estiver em dúvida, mova, observe " +
                "como fica e, se não melhorar, mova de volta — a refatoração é reversível.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função de utilidade usada só por um módulo, movida para junto dele:" },
            {
              type: "code",
              language: "javascript",
              filename: "move-function.js",
              code: [
                "// Antes: em utils.js, mas só a geração de relatórios usa",
                "// utils.js",
                "export function formatCurrency(value) {",
                "  return \"R$ \" + value.toFixed(2).replace(\".\", \",\");",
                "}",
                "// report.js",
                "import { formatCurrency } from \"./utils.js\";",
                "",
                "// Depois: mora onde é usada",
                "// report.js",
                "function formatCurrency(value) {",
                "  return \"R$ \" + value.toFixed(2).replace(\".\", \",\");",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "utils.js (um módulo sem assunto definido) deixa de acumular funções soltas, e quem lê report.js " +
                "encontra tudo o que precisa sem sair do arquivo. Se outra parte do sistema passar a precisar " +
                "dela, aí sim ela pode ir para um módulo compartilhado com um nome de assunto.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a função só mexe nos dados de outro objeto, como no smell Feature Envy.",
                "Quando funções acumuladas em um módulo genérico pertencem a assuntos específicos.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com chamadores existentes, a função antiga deve virar uma ponte para a nova; trocar todos os usos de uma " +
                "vez é arriscado.",
              ],
            },
          ],
          examples: [
            {
              title: "Mover para a classe cujos dados ela usa",
              context: "O caso do smell Feature Envy: a função só mexe em dados de outro objeto.",
              code: {
                language: "javascript",
                filename: "move-to-data.js",
                code: [
                  "// Antes: a função está em Order, mas usa só dados de Account",
                  "class Order {",
                  "  overdraftFee(account) {",
                  "    return account.isPremium ? account.daysOverdrawn * 0.5 : account.daysOverdrawn * 1.75;",
                  "  }",
                  "}",
                  "",
                  "// Depois: vive em Account, junto dos dados",
                  "class Account {",
                  "  overdraftFee() {",
                  "    return this.isPremium ? this.daysOverdrawn * 0.5 : this.daysOverdrawn * 1.75;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Toda a regra depende de campos de Account. Movida, ela pode mudar (uma nova faixa de cliente) " +
                "sem tocar em Order, e é reutilizada por qualquer código que tenha uma conta.",
            },
            {
              title: "Delegação como passo intermediário",
              context: "Para migrar sem quebrar chamadores, a função antiga vira uma ponte para a nova.",
              code: {
                language: "javascript",
                filename: "delegate-step.js",
                code: [
                  "class Order {",
                  "  // Passo intermediário: o método antigo só delega para o novo lugar",
                  "  overdraftFee(account) {",
                  "    return account.overdraftFee();",
                  "  }",
                  "}",
                  "",
                  "// Os chamadores antigos continuam funcionando; conforme migram para",
                  "// account.overdraftFee(), Order.overdraftFee deixa de ter uso e é removido.",
                ].join("\n"),
              },
              explanation:
                "A mudança fica em passos que podem ser verificados pelos testes a cada um, sem uma grande " +
                "alteração simultânea em todos os chamadores.",
            },
            {
              title: "Mover entre módulos por assunto",
              context: "Funções acumuladas em um módulo genérico costumam pertencer a assuntos específicos.",
              code: {
                language: "javascript",
                filename: "move-by-subject.js",
                code: [
                  "// Antes: helpers.js mistura assuntos sem relação",
                  "// helpers.js: formatDate, validateEmail, calculateTax, slugify...",
                  "",
                  "// Depois: cada função vai para o módulo do seu assunto",
                  "// dates.js:      formatDate",
                  "// validation.js: validateEmail",
                  "// pricing.js:    calculateTax",
                  "// text.js:       slugify",
                ].join("\n"),
              },
              explanation:
                "Módulos com nome de assunto ajudam a achar o que se procura e a saber onde adicionar algo novo. " +
                "Um arquivo \"helpers\" costuma ser o sintoma de Large Class em forma de módulo.",
            },
          ],
          exercise: {
            problem:
              "A classe Report calcula os dias em atraso de um empréstimo usando apenas dados do próprio " +
              "empréstimo.",
            problemCode: {
              language: "javascript",
              filename: "loan-report.js",
              code: [
                "class Report {",
                "  daysOverdue(loan) {",
                "    const msPerDay = 24 * 60 * 60 * 1000;",
                "    return Math.max(0, Math.floor((loan.today - loan.dueDate) / msPerDay));",
                "  }",
                "  describe(loan) {",
                "    return loan.title + \": \" + this.daysOverdue(loan) + \" dias de atraso\";",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Move Function: leve daysOverdue para a classe Loan e ajuste Report para usá-la, " +
              "descrevendo os passos intermediários.",
            hint: "A função só lê today e dueDate, ambos de Loan. Depois de movida, deixa de precisar receber o empréstimo por parâmetro.",
            solution: {
              code: {
                language: "javascript",
                filename: "loan-report.refactored.js",
                code: [
                  "class Loan {",
                  "  constructor(title, dueDate, today) {",
                  "    this.title = title;",
                  "    this.dueDate = dueDate;",
                  "    this.today = today;",
                  "  }",
                  "  daysOverdue() {",
                  "    const msPerDay = 24 * 60 * 60 * 1000;",
                  "    return Math.max(0, Math.floor((this.today - this.dueDate) / msPerDay));",
                  "  }",
                  "}",
                  "",
                  "class Report {",
                  "  describe(loan) {",
                  "    return loan.title + \": \" + loan.daysOverdue() + \" dias de atraso\";",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Passos: (1) copiar para Loan usando this; (2) fazer Report.daysOverdue delegar para loan.daysOverdue(); " +
                "(3) atualizar describe; (4) remover a versão antiga. O cálculo agora está com os dados que usa e " +
                "pode ser testado sem Report.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Replace Nested Conditional with Guard Clauses",
          requires: ["Clean Code / Guard Clauses"],
          note: "a técnica mecânica que produz o estilo já ensinado em Clean Code",
          summary:
            "Replace Nested Conditional with Guard Clauses é a refatoração que transforma ifs aninhados numa " +
            "sequência de retornos antecipados.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Enquanto Guard Clauses (módulo Clean Code) descreve o estilo — tratar casos excepcionais no topo e sair " +
                "cedo —, esta refatoração é a mecânica para chegar lá a partir de um código existente. Ela transforma, um " +
                "caso de cada vez, os ramos excepcionais em retornos antecipados, deixando o caminho principal no nível " +
                "base.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Como cada guarda preserva o comportamento, dá para parar a refatoração em qualquer ponto com o código " +
                "funcionando.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) identifique a condição mais externa cujo ramo alternativo é um caso excepcional " +
                "(erro, valor padrão, \"nada a fazer\"); (2) inverta a condição e coloque um return (ou throw) " +
                "no topo com o resultado desse caso; (3) rode os testes; (4) repita com a próxima condição, " +
                "agora um nível menos aninhada. Ao terminar, se várias guardas retornam o mesmo valor, " +
                "consolide-as em uma só condição.",
            },
            {
              type: "paragraph",
              text:
                "Cada passo preserva o comportamento, então não é preciso reescrever tudo de uma vez — dá para " +
                "parar em qualquer ponto com o código ainda funcionando. O único cuidado é com a ordem: as guardas " +
                "devem ser verificadas na mesma ordem lógica que as condições aninhadas originais, para que " +
                "casos que dependiam da ordem continuem dando o mesmo resultado.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a transformação em passos: cada condição aninhada vira uma guarda:" },
            {
              type: "code",
              language: "javascript",
              filename: "nested-to-guards.js",
              code: [
                "// Original: três níveis de aninhamento",
                "function payAmount(employee) {",
                "  let result;",
                "  if (employee.isSeparated) {",
                "    result = { amount: 0 };",
                "  } else {",
                "    if (employee.isRetired) {",
                "      result = { amount: retirementPay(employee) };",
                "    } else {",
                "      result = { amount: normalPay(employee) };",
                "    }",
                "  }",
                "  return result;",
                "}",
                "",
                "// Depois: uma guarda por caso excepcional",
                "function payAmount(employee) {",
                "  if (employee.isSeparated) return { amount: 0 };",
                "  if (employee.isRetired) return { amount: retirementPay(employee) };",
                "  return { amount: normalPay(employee) };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A variável result e os else desapareceram. O comportamento é idêntico, e agora cada caso " +
                "aparece em uma linha, na ordem em que é verificado.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando há um caso excepcional e um caminho principal, e os `if` aninhados escondem o caminho principal.",
                "Quando há testes para conferir cada passo: inverter, retornar cedo, rodar os testes e repetir.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se os dois ramos são igualmente comuns, `if/else` comunica melhor que um retorno antecipado.",
                "Guardas com resultados diferentes (mensagens de erro específicas) devem continuar separadas, não consolidadas.",
              ],
            },
          ],
          examples: [
            {
              title: "O mesmo trecho, um passo de cada vez",
              context: "A técnica funciona melhor quando o resultado de cada passo pode ser verificado por testes.",
              code: {
                language: "javascript",
                filename: "step-by-step.js",
                code: [
                  "// Original",
                  "function discount(order) {",
                  "  if (order) {",
                  "    if (order.total > 100) {",
                  "      return order.total * 0.1;",
                  "    }",
                  "  }",
                  "  return 0;",
                  "}",
                  "",
                  "// Passo 1: inverter a condição externa",
                  "function discount(order) {",
                  "  if (!order) return 0;",
                  "  if (order.total > 100) {",
                  "    return order.total * 0.1;",
                  "  }",
                  "  return 0;",
                  "}",
                  "",
                  "// Passo 2: inverter a seguinte",
                  "function discount(order) {",
                  "  if (!order) return 0;",
                  "  if (order.total <= 100) return 0;",
                  "  return order.total * 0.1;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Em cada passo o comportamento é o mesmo e os testes continuam passando. Se algum passo quebrar, " +
                "basta desfazê-lo — sem precisar entender toda a função de novo.",
            },
            {
              title: "Consolidar guardas com o mesmo resultado",
              context: "Depois da transformação, várias guardas que devolvem o mesmo valor podem virar uma condição só.",
              code: {
                language: "javascript",
                filename: "consolidate-guards.js",
                code: [
                  "// Antes: três guardas retornam o mesmo valor",
                  "function canBorrow(user, book) {",
                  "  if (user.isBanned) return false;",
                  "  if (user.loans.length >= 5) return false;",
                  "  if (!book.isAvailable) return false;",
                  "  return true;",
                  "}",
                  "",
                  "// Depois: uma condição que se lê como a regra",
                  "function canBorrow(user, book) {",
                  "  const hasReachedLimit = user.loans.length >= 5;",
                  "  return !user.isBanned && !hasReachedLimit && book.isAvailable;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Quando todos os casos excepcionais têm o mesmo resultado, uma condição combinada é mais direta. " +
                "Se cada guarda tivesse um resultado diferente (uma mensagem de erro específica, por exemplo), " +
                "elas deveriam continuar separadas.",
            },
            {
              title: "Quando o else é o caso excepcional",
              context: "Nem sempre o caso excepcional está no if; às vezes está no else, e o caminho principal está dentro do if.",
              code: {
                language: "javascript",
                filename: "else-is-the-guard.js",
                code: [
                  "// Antes: o caso raro (usuário sem plano) está no else",
                  "function planLabel(user) {",
                  "  if (user.plan) {",
                  "    return \"Plano \" + user.plan.name + \" (\" + user.plan.price + \")\";",
                  "  } else {",
                  "    return \"Sem plano\";",
                  "  }",
                  "}",
                  "",
                  "// Depois: o caso raro sai primeiro",
                  "function planLabel(user) {",
                  "  if (!user.plan) return \"Sem plano\";",
                  "  return \"Plano \" + user.plan.name + \" (\" + user.plan.price + \")\";",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Inverter a condição faz o caminho principal ficar no nível base. Se os dois ramos fossem " +
                "igualmente comuns, manter o if/else seria mais claro — a técnica se aplica quando há um caso " +
                "excepcional e um caminho principal.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo tem três níveis de aninhamento para decidir o valor da comissão de uma venda.",
            problemCode: {
              language: "javascript",
              filename: "commission.js",
              code: [
                "function commission(sale) {",
                "  let result = 0;",
                "  if (sale) {",
                "    if (sale.isConfirmed) {",
                "      if (sale.amount > 1000) {",
                "        result = sale.amount * 0.05;",
                "      } else {",
                "        result = sale.amount * 0.02;",
                "      }",
                "    }",
                "  }",
                "  return result;",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique a técnica passo a passo: transforme os ifs aninhados em guard clauses, removendo a " +
              "variável result, sem mudar nenhum resultado.",
            hint: "Os dois casos que retornam 0 são os excepcionais (sem venda, venda não confirmada). O que sobra é a escolha da alíquota.",
            solution: {
              code: {
                language: "javascript",
                filename: "commission.refactored.js",
                code: [
                  "function commission(sale) {",
                  "  if (!sale) return 0;",
                  "  if (!sale.isConfirmed) return 0;",
                  "",
                  "  const rate = sale.amount > 1000 ? 0.05 : 0.02;",
                  "  return sale.amount * rate;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As duas guardas tratam os casos sem comissão, e o cálculo ficou no nível base. O resultado é o " +
                "mesmo para qualquer entrada, e a decisão entre as duas alíquotas ganhou uma variável com nome.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Replace Conditional with Polymorphism",
          requires: ["Programming Foundations / Programming Fundamentals / Polymorphism"],
          note: "aplica o mecanismo já ensinado em Programming Foundations",
          summary:
            "Replace Conditional with Polymorphism é trocar um switch que escolhe o comportamento pelo tipo por " +
            "classes que implementam o mesmo método.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Cada classe carrega a sua própria versão do comportamento, e a escolha passa a ser feita pelo objeto, " +
                "não por condições. É a aplicação prática do Polymorphism (módulo Programming Fundamentals) como " +
                "refatoração.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "O switch por tipo não some, ele passa a existir num lugar só: onde o objeto certo é criado.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando o mesmo switch sobre o tipo aparece em vários lugares, acrescentar um novo tipo exige achar " +
                "e alterar todos — e esquecer um deles gera bugs. Com polimorfismo, um tipo novo é uma classe " +
                "nova, sem mexer no código existente. A decisão sobre o tipo passa a acontecer em um único ponto: " +
                "onde o objeto é criado.",
            },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) crie uma classe para cada caso, com o mesmo método; (2) mova para cada uma o ramo " +
                "correspondente da condicional; (3) troque a condicional por uma chamada ao método; (4) " +
                "concentre a escolha da classe em um só lugar (uma função de criação); (5) rode os testes a cada " +
                "passo. Quando não usar: condicional que aparece em um só lugar, com poucos casos estáveis — nesse " +
                "caso o switch é mais simples do que uma hierarquia de classes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um switch por tipo trocado por classes que sabem o seu comportamento:" },
            {
              type: "code",
              language: "javascript",
              filename: "replace-conditional.js",
              code: [
                "// Antes: um switch sobre o tipo",
                "function area(shape) {",
                "  switch (shape.type) {",
                "    case \"circle\": return Math.PI * shape.radius ** 2;",
                "    case \"rectangle\": return shape.width * shape.height;",
                "    default: throw new Error(\"tipo desconhecido\");",
                "  }",
                "}",
                "",
                "// Depois: cada classe sabe calcular a própria área",
                "class Circle {",
                "  constructor(radius) { this.radius = radius; }",
                "  area() { return Math.PI * this.radius ** 2; }",
                "}",
                "class Rectangle {",
                "  constructor(width, height) { this.width = width; this.height = height; }",
                "  area() { return this.width * this.height; }",
                "}",
                "",
                "shape.area(); // sem switch",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Um novo formato (Triangle) é uma classe nova com o seu area(), sem alterar nenhuma função " +
                "existente — em vez de encontrar e editar cada switch que fala de formas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o mesmo `switch` por tipo se repete em várias funções e cada caso novo exige editá-las todas.",
                "Quando a condicional tende a crescer, e cada tipo pode carregar o próprio comportamento.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um `switch` simples e único não justifica uma hierarquia de classes: polimorfismo troca simplicidade local " +
                "por extensibilidade.",
                "A condicional não some: fica concentrada no ponto onde o objeto é criado.",
              ],
            },
          ],
          examples: [
            {
              title: "Um switch repetido em vários lugares",
              context: "O sinal mais forte: o mesmo switch aparece em várias funções, e todas precisam mudar quando surge um caso novo.",
              code: {
                language: "javascript",
                filename: "repeated-switch.js",
                code: [
                  "// Antes: dois switches sobre 'type' em funções diferentes",
                  "function speed(bird) {",
                  "  switch (bird.type) {",
                  "    case \"european\": return 35;",
                  "    case \"african\": return 40 - bird.load;",
                  "  }",
                  "}",
                  "function plumage(bird) {",
                  "  switch (bird.type) {",
                  "    case \"european\": return \"average\";",
                  "    case \"african\": return bird.load > 2 ? \"tired\" : \"average\";",
                  "  }",
                  "}",
                  "",
                  "// Depois: cada tipo tem os dois comportamentos",
                  "class EuropeanBird {",
                  "  speed() { return 35; }",
                  "  plumage() { return \"average\"; }",
                  "}",
                  "class AfricanBird {",
                  "  constructor(load) { this.load = load; }",
                  "  speed() { return 40 - this.load; }",
                  "  plumage() { return this.load > 2 ? \"tired\" : \"average\"; }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Adicionar um terceiro pássaro agora é uma classe nova, com os dois comportamentos juntos — não " +
                "duas edições em funções separadas com risco de esquecer uma.",
            },
            {
              title: "A escolha da classe fica em um só lugar",
              context: "A condicional não desaparece: ela se concentra no ponto onde o objeto é criado.",
              code: {
                language: "javascript",
                filename: "factory.js",
                code: [
                  "function createBird(data) {",
                  "  switch (data.type) {",
                  "    case \"european\": return new EuropeanBird();",
                  "    case \"african\": return new AfricanBird(data.load);",
                  "    default: throw new Error(\"tipo desconhecido: \" + data.type);",
                  "  }",
                  "}",
                  "",
                  "// Único switch restante. O resto do código só chama bird.speed(), bird.plumage().",
                ].join("\n"),
              },
              explanation:
                "Em vez de N switches espalhados, resta um só, na criação. Todo o restante do código deixa de se " +
                "importar com o tipo e apenas usa o comportamento.",
            },
            {
              title: "Quando não usar: switch simples e único",
              context: "Uma hierarquia de classes é mais cara que um switch; só compensa quando a condicional se repete ou cresce.",
              code: {
                language: "javascript",
                filename: "keep-the-switch.js",
                code: [
                  "// Aparece em um único lugar, com três casos que não mudam:",
                  "function weekdayName(n) {",
                  "  switch (n) {",
                  "    case 0: return \"domingo\";",
                  "    case 1: return \"segunda\";",
                  "    default: return \"outro dia\";",
                  "  }",
                  "}",
                  "// Criar uma classe por dia da semana seria complexidade sem benefício.",
                ].join("\n"),
              },
              explanation:
                "Polimorfismo troca simplicidade local por extensibilidade. Se a condicional não se repete nem " +
                "cresce, esse investimento não se paga — e KISS manda ficar com o switch.",
            },
          ],
          exercise: {
            problem:
              "A função de preço usa um switch sobre o tipo de ingresso, e o mesmo switch se repete em outra " +
              "função (descrição do ingresso).",
            problemCode: {
              language: "javascript",
              filename: "ticket.js",
              code: [
                "function ticketPrice(ticket) {",
                "  switch (ticket.type) {",
                "    case \"regular\": return 50;",
                "    case \"student\": return 25;",
                "    case \"senior\": return 20;",
                "  }",
                "}",
                "",
                "function ticketLabel(ticket) {",
                "  switch (ticket.type) {",
                "    case \"regular\": return \"Inteira\";",
                "    case \"student\": return \"Meia (estudante)\";",
                "    case \"senior\": return \"Meia (idoso)\";",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Replace Conditional with Polymorphism: crie uma classe por tipo de ingresso com os dois " +
              "métodos e deixe uma única função decidir qual classe criar.",
            hint: "Cada classe implementa price() e label(). O único switch que sobra fica na função que cria o objeto.",
            solution: {
              code: {
                language: "javascript",
                filename: "ticket.refactored.js",
                code: [
                  "class RegularTicket {",
                  "  price() { return 50; }",
                  "  label() { return \"Inteira\"; }",
                  "}",
                  "class StudentTicket {",
                  "  price() { return 25; }",
                  "  label() { return \"Meia (estudante)\"; }",
                  "}",
                  "class SeniorTicket {",
                  "  price() { return 20; }",
                  "  label() { return \"Meia (idoso)\"; }",
                  "}",
                  "",
                  "function createTicket(type) {",
                  "  switch (type) {",
                  "    case \"regular\": return new RegularTicket();",
                  "    case \"student\": return new StudentTicket();",
                  "    case \"senior\": return new SeniorTicket();",
                  "    default: throw new Error(\"tipo desconhecido: \" + type);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Preço e descrição de cada tipo estão juntos na sua classe. Um novo tipo (ex.: infantil) é uma " +
                "classe nova e uma linha em createTicket, sem alterar ticketPrice nem ticketLabel — que agora " +
                "nem precisam mais existir.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Introduce Parameter Object",
          requires: ["Code Smells / Long Parameter List"],
          note: "corrige o smell diagnosticado antes",
          summary:
            "Introduce Parameter Object é substituir um grupo de parâmetros que andam juntos por um objeto que os " +
            "representa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "É a correção padrão para Long Parameter List: fecha o ciclo iniciado em Function Arguments (escrever " +
                "bem) e no smell (reconhecer a violação). O ganho é maior do que encurtar a assinatura: o grupo ganha um " +
                "nome de conceito, e esse conceito pode receber comportamento.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se o novo objeto nunca ganhar comportamento, você só encurtou a assinatura, sem ganho de projeto.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "paragraph",
              text:
                "Mecânica: (1) identifique o grupo de parâmetros que sempre andam juntos (em uma ou várias " +
                "funções); (2) crie a estrutura (classe ou objeto) com um nome que descreva o conceito; (3) " +
                "adicione o novo parâmetro à função e, gradualmente, passe o objeto nas chamadas; (4) mova " +
                "cada parâmetro antigo para dentro do objeto, um por vez, rodando os testes; (5) quando o " +
                "objeto substituir todos, remova os parâmetros antigos; (6) procure lógica que use esses dados e " +
                "poderia ir para dentro do objeto.",
            },
            {
              type: "paragraph",
              text:
                "O passo (6) é o que separa uma reorganização cosmética de um ganho de projeto: validações e " +
                "cálculos que eram repetidos em cada função tendem a se mudar para dentro do novo objeto, onde " +
                "ficam em um lugar só.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "dois parâmetros que sempre andam juntos viram um objeto, que ganha comportamento:" },
            {
              type: "code",
              language: "javascript",
              filename: "parameter-object.js",
              code: [
                "// Antes: início e fim aparecem juntos em todas as funções",
                "function sales(start, end) { /* ... */ }",
                "function refunds(start, end) { /* ... */ }",
                "",
                "// Depois: DateRange é o conceito, com sua própria regra",
                "class DateRange {",
                "  constructor(start, end) {",
                "    if (end < start) throw new Error(\"fim antes do início\");",
                "    this.start = start;",
                "    this.end = end;",
                "  }",
                "  contains(date) { return date >= this.start && date <= this.end; }",
                "}",
                "",
                "function sales(range) { /* ... range.contains(sale.date) ... */ }",
                "function refunds(range) { /* ... */ }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A validação \"fim não pode ser antes do início\" antes teria de estar em cada função; agora está no " +
                "construtor, uma vez. E contains é um comportamento que só faz sentido junto desses dados.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando os mesmos parâmetros viajam juntos por várias assinaturas e formam um conceito do domínio.",
                "Quando validações e cálculos repetidos nos chamadores podem passar a viver no objeto.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Agrupar parâmetros sem relação entre si só esconde uma função que faz demais; nesse caso, divida a função.",
              ],
            },
          ],
          examples: [
            {
              title: "Um objeto com validação embutida",
              context: "O objeto criado garante a própria validade — quem o recebe não precisa conferir de novo.",
              code: {
                language: "javascript",
                filename: "range-with-validation.js",
                code: [
                  "// Antes: cada função valida os limites por conta própria",
                  "function alertIfOutOfRange(reading, min, max) {",
                  "  if (min > max) throw new Error(\"limites inválidos\");",
                  "  if (reading < min || reading > max) alert(reading);",
                  "}",
                  "",
                  "// Depois",
                  "class NumberRange {",
                  "  constructor(min, max) {",
                  "    if (min > max) throw new Error(\"limites inválidos\");",
                  "    this.min = min;",
                  "    this.max = max;",
                  "  }",
                  "  contains(value) { return value >= this.min && value <= this.max; }",
                  "}",
                  "",
                  "function alertIfOutOfRange(reading, range) {",
                  "  if (!range.contains(reading)) alert(reading);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O construtor valida uma vez, e a função ficou com uma responsabilidade só: alertar se a leitura " +
                "estiver fora. Qualquer outra função que receba um NumberRange já recebe limites válidos.",
            },
            {
              title: "Migração gradual sem quebrar chamadores",
              context: "Trocar todas as chamadas de uma vez é arriscado; dá para aceitar os dois formatos durante a transição.",
              code: {
                language: "javascript",
                filename: "gradual-migration.js",
                code: [
                  "// Passo intermediário: aceita o objeto novo, mas ainda os parâmetros antigos",
                  "function sales(rangeOrStart, maybeEnd) {",
                  "  const range = rangeOrStart instanceof DateRange",
                  "    ? rangeOrStart",
                  "    : new DateRange(rangeOrStart, maybeEnd);",
                  "  // ... usa range ...",
                  "}",
                  "",
                  "// Os chamadores migram um a um; depois, o ramo antigo é removido",
                  "// e a assinatura fica: function sales(range) { ... }",
                ].join("\n"),
              },
              explanation:
                "A transição em passos permite rodar os testes e integrar em pedaços pequenos. O código " +
                "provisório é descartado assim que o último chamador for atualizado.",
            },
            {
              title: "O objeto atrai o comportamento",
              context: "Depois de criado, ele costuma absorver lógica que estava espalhada pelas funções que o usavam.",
              code: {
                language: "javascript",
                filename: "attracting-behavior.js",
                code: [
                  "// A lógica de \"quantos dias tem o intervalo\" estava em três funções diferentes:",
                  "const days = (range.end - range.start) / (24 * 60 * 60 * 1000);",
                  "",
                  "// Agora é um método do próprio objeto, escrito uma vez:",
                  "class DateRange {",
                  "  // ...",
                  "  days() {",
                  "    return (this.end - this.start) / (24 * 60 * 60 * 1000);",
                  "  }",
                  "}",
                  "const days = range.days();",
                ].join("\n"),
              },
              explanation:
                "É aqui que a refatoração se paga: o que era cálculo duplicado nos chamadores passa a ser " +
                "comportamento do conceito, reduzindo duplicação e deixando as funções que o usam mais curtas.",
            },
          ],
          exercise: {
            problem:
              "Estas funções recebem os mesmos três parâmetros do endereço de entrega, e cada uma repete a " +
              "mesma checagem de CEP.",
            problemCode: {
              language: "javascript",
              filename: "shipping-address.js",
              code: [
                "function calculateShipping(street, city, zip) {",
                "  if (!/^\\d{8}$/.test(zip)) throw new Error(\"CEP inválido\");",
                "  // ...",
                "}",
                "",
                "function printLabel(street, city, zip) {",
                "  if (!/^\\d{8}$/.test(zip)) throw new Error(\"CEP inválido\");",
                "  return street + \", \" + city + \" - \" + zip;",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Introduce Parameter Object: crie um objeto Address, mova a validação do CEP para dentro " +
              "dele e ajuste as duas funções.",
            hint: "O construtor de Address é o lugar natural da validação. printLabel também pode virar um método do próprio endereço.",
            solution: {
              code: {
                language: "javascript",
                filename: "shipping-address.refactored.js",
                code: [
                  "class Address {",
                  "  constructor(street, city, zip) {",
                  "    if (!/^\\d{8}$/.test(zip)) throw new Error(\"CEP inválido\");",
                  "    this.street = street;",
                  "    this.city = city;",
                  "    this.zip = zip;",
                  "  }",
                  "  label() { return this.street + \", \" + this.city + \" - \" + this.zip; }",
                  "}",
                  "",
                  "function calculateShipping(address) {",
                  "  // ...usa address.zip, address.city...",
                  "}",
                  "",
                  "function printLabel(address) {",
                  "  return address.label();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A validação do CEP existe uma única vez, no construtor, e as duas funções receberam um parâmetro " +
                "em vez de três. Quem tem um Address sabe que o CEP é válido, sem precisar checar de novo.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Refactoring with Tests",
          requires: ["Testing & Quality Engineering / Testing Fundamentals"],
          note: "fecha a Story: só se refatora com segurança havendo rede de testes",
          summary:
            "Refactoring with Tests é refatorar em ciclos curtos, rodando os testes antes e depois de cada passo " +
            "pequeno.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A definição de refatoração exige que o comportamento não mude — e a única forma confiável de saber disso " +
                "é com testes automatizados. Se os testes ficarem vermelhos, o último passo — e só ele — é o culpado, e " +
                "pode ser desfeito.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Passos pequenos existem para que um teste vermelho aponte um único culpado.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem testes, refatorar é uma aposta: você acredita que não quebrou nada, mas só descobre em " +
                "produção. Com testes, o custo de errar cai a segundos, e o hábito de refatorar em passos " +
                "pequenos se sustenta. A rede é o que permite melhorar o código continuamente em vez de deixá-lo " +
                "apodrecer por medo de mexer. É a mesma lógica do ciclo Red-Green-Refactor do TDD (módulo " +
                "Test-Driven Development): a etapa de refatorar só acontece com os testes verdes.",
            },
            {
              type: "paragraph",
              text:
                "Dois pontos práticos. Primeiro: se o código não tem testes, o primeiro passo não é refatorar, é " +
                "escrever testes de caracterização — testes que registram o comportamento atual, mesmo os " +
                "estranhos, antes de qualquer mudança. Segundo: bons testes verificam o comportamento pela " +
                "interface pública, não a implementação interna; testes acoplados aos detalhes quebram a cada " +
                "refatoração e viram um obstáculo em vez de uma rede.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o ciclo: teste verde, um passo pequeno, teste verde:" },
            {
              type: "code",
              language: "javascript",
              filename: "refactoring-with-tests.js",
              code: [
                "function assertEquals(actual, expected) {",
                "  if (actual !== expected) throw new Error(`esperado ${expected}, recebeu ${actual}`);",
                "}",
                "",
                "// A rede de segurança: descreve o comportamento que NÃO pode mudar",
                "function testPrice() {",
                "  assertEquals(price({ items: [{ price: 10 }, { price: 30 }] }), 36);",
                "  assertEquals(price({ items: [] }), 0);",
                "}",
                "",
                "testPrice(); // verde",
                "// --- passo pequeno: extrair subtotal() ---",
                "testPrice(); // verde  → segue",
                "// --- passo pequeno: renomear variável ---",
                "testPrice(); // vermelho → o último passo quebrou algo: desfazer e investigar",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Como cada passo é pequeno, uma falha aponta diretamente para a causa. Sem o ciclo, depois de vinte " +
                "alterações seguidas, um teste vermelho deixaria a dúvida de qual delas foi a responsável.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Antes de qualquer refatoração relevante: teste verde, passo pequeno, teste verde.",
                "Em código legado sem testes, começando por testes de caracterização que fixam o comportamento atual.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Testes acoplados à implementação quebram a cada refatoração, mesmo sem mudança de comportamento; teste o " +
                "resultado, não o como.",
                "Sem testes confiáveis, refatorar é palpite: crie a rede de segurança primeiro.",
              ],
            },
          ],
          examples: [
            {
              title: "Testes de caracterização para código sem testes",
              context: "Antes de mexer em código legado, fixe o comportamento atual — inclusive os casos estranhos — em testes.",
              code: {
                language: "javascript",
                filename: "characterization-tests.js",
                code: [
                  "// Código legado, sem testes, que queremos refatorar",
                  "function shippingLabel(weight, isExpress) {",
                  "  if (weight === 0) return \"N/A\";",
                  "  return (isExpress ? \"EXP-\" : \"STD-\") + Math.ceil(weight);",
                  "}",
                  "",
                  "// Registrar o que ele FAZ hoje, sem julgar se está certo:",
                  "assertEquals(shippingLabel(2.3, false), \"STD-3\");",
                  "assertEquals(shippingLabel(2.3, true), \"EXP-3\");",
                  "assertEquals(shippingLabel(0, true), \"N/A\"); // esquisito, mas é o comportamento atual",
                ].join("\n"),
              },
              explanation:
                "O objetivo não é decidir se \"N/A\" é o ideal — é congelar o comportamento para que qualquer " +
                "mudança acidental apareça. Se o caso esquisito for um bug, ele é corrigido depois, à parte.",
            },
            {
              title: "O ciclo em passos pequenos",
              context: "A frequência dos testes é o que torna a refatoração segura: rodar a cada passo, não só no final.",
              code: {
                language: "javascript",
                filename: "small-steps.js",
                code: [
                  "// 1. rodar os testes → verde",
                  "// 2. extrair uma função → rodar → verde",
                  "// 3. renomear um parâmetro → rodar → verde",
                  "// 4. mover a função de módulo → rodar → VERMELHO",
                  "//    O problema só pode estar no passo 4; desfazer e refazer com mais cuidado.",
                  "",
                  "// Alternativa arriscada: fazer os 4 passos juntos e só então rodar.",
                  "// Se falhar, qualquer um dos quatro pode ser a causa.",
                ].join("\n"),
              },
              explanation:
                "Passos pequenos deixam a depuração trivial: o culpado é sempre a última alteração. Em muitos " +
                "editores, dá para configurar os testes para rodarem a cada gravação, o que torna o ciclo quase " +
                "instantâneo.",
            },
            {
              title: "Teste acoplado à implementação atrapalha",
              context: "Um teste que verifica como o código faz (e não o que faz) quebra a cada refatoração, mesmo sem mudança de comportamento.",
              code: {
                language: "javascript",
                filename: "brittle-vs-robust.js",
                code: [
                  "// Frágil: verifica um detalhe interno; quebra se extrairmos ou renomearmos",
                  "function testBrittle() {",
                  "  const spy = trackCalls(calculator, \"applyDiscount\");",
                  "  price(order);",
                  "  assertEquals(spy.callCount, 1);",
                  "}",
                  "",
                  "// Robusto: verifica só o resultado observável",
                  "function testRobust() {",
                  "  assertEquals(price({ items: [{ price: 100 }], coupon: \"SAVE10\" }), 90);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O teste frágil falha se applyDiscount for renomeada ou incorporada, mesmo com o resultado igual. " +
                "O robusto só se importa com o valor final, então sobrevive a qualquer reorganização interna — que é " +
                "exatamente o que uma rede de segurança de refatoração precisa fazer.",
            },
          ],
          exercise: {
            problem:
              "Você precisa refatorar a função abaixo, que não tem nenhum teste. Antes de tocar nela, é " +
              "necessário fixar o comportamento atual.",
            problemCode: {
              language: "javascript",
              filename: "legacy-fee.js",
              code: [
                "function lateFee(daysLate, isMember) {",
                "  if (daysLate <= 0) return 0;",
                "  const fee = daysLate * 2;",
                "  if (isMember) return fee / 2;",
                "  return fee > 30 ? 30 : fee;",
                "}",
              ].join("\n"),
            },
            task:
              "Escreva testes de caracterização que cubram cada caminho da função (sem atraso, membro, " +
              "não membro abaixo e acima do teto de 30), para poder refatorá-la com segurança.",
            hint: "Um teste por caminho de execução. Repare que membros não têm o teto de 30 — registre isso como o comportamento atual.",
            solution: {
              code: {
                language: "javascript",
                filename: "legacy-fee.test.js",
                code: [
                  "function assertEquals(actual, expected) {",
                  "  if (actual !== expected) throw new Error(`esperado ${expected}, recebeu ${actual}`);",
                  "}",
                  "",
                  "function testLateFee() {",
                  "  assertEquals(lateFee(0, false), 0);    // sem atraso",
                  "  assertEquals(lateFee(-3, true), 0);    // valor negativo também não cobra",
                  "  assertEquals(lateFee(5, true), 5);     // membro: metade de 10",
                  "  assertEquals(lateFee(5, false), 10);   // não membro abaixo do teto",
                  "  assertEquals(lateFee(20, false), 30);  // não membro: limitado ao teto de 30",
                  "  assertEquals(lateFee(20, true), 20);   // membro: sem teto (metade de 40)",
                  "}",
                  "",
                  "testLateFee();",
                ].join("\n"),
              },
              explanation:
                "Cada caminho da função tem um teste, inclusive o comportamento curioso (membros sem teto). Com " +
                "esses testes verdes, dá para refatorar lateFee em passos pequenos: qualquer mudança acidental " +
                "de comportamento vai aparecer como um teste vermelho.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "error-handling",
      order: 50,
      title: "Error Handling",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Framing agnóstico (erro × exceção) → mecanismo → propagação → tipos com significado → postura " +
        "defensiva → erro como valor → contenção da falha.",
      concepts: [
        concept({
          order: 10,
          title: "Errors vs Exceptions",
          isNew: true,
          note: "framing agnóstico de linguagem: erro (conceito) × exceção (mecanismo específico)",
          summary:
            "Errors vs Exceptions é a diferença entre o conceito de falha, o erro, e um dos mecanismos para " +
            "sinalizá-lo, a exceção.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um erro é o momento em que uma operação não consegue fazer o que seu contrato promete — o arquivo não " +
                "existe, o dado é inválido, a rede caiu. Uma exceção é uma forma específica (throw/catch) que certas " +
                "linguagens oferecem para sinalizar e tratar erros, interrompendo o fluxo normal. Confundir os dois leva " +
                "a achar que \"tratar erros\" é sinônimo de \"usar try/catch\".",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Primeiro decida que tipo de falha é, esperada, bug ou só ausência, e só depois escolha como sinalizá-la.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Separar o conceito do mecanismo permite escolher a ferramenta certa. Linguagens diferentes " +
                "sinalizam erros de formas diferentes: exceções (Java, Python, JavaScript), códigos de retorno " +
                "ou valores de erro explícitos (C, Go), tipos de resultado (Rust, e o Result Pattern deste módulo). " +
                "As decisões de projeto — quem deve ser avisado, o que é recuperável, o que fazer depois — " +
                "são as mesmas, independentemente do mecanismo.",
            },
            {
              type: "paragraph",
              text:
                "Uma distinção útil dentro do conceito: erros esperados (operacionais) e erros de programação. Os " +
                "esperados fazem parte da vida do programa — entrada inválida, arquivo ausente, timeout — e " +
                "devem ser tratados. Os de programação são bugs (acessar uma propriedade de undefined, violar " +
                "uma pré-condição) e o certo é corrigi-los, não \"tratá-los\" e seguir em frente. E nem toda " +
                "ausência de resultado é um erro: uma busca que não encontra nada é um resultado normal.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o mesmo erro (\"idade inválida\") sinalizado por três mecanismos diferentes:" },
            {
              type: "code",
              language: "javascript",
              filename: "errors-vs-exceptions.js",
              code: [
                "// 1. Exceção: interrompe o fluxo, sobe até alguém tratar",
                "function parseAgeOrThrow(text) {",
                "  const age = Number(text);",
                "  if (Number.isNaN(age)) throw new Error(\"idade inválida\");",
                "  return age;",
                "}",
                "",
                "// 2. Valor especial de retorno: quem chama precisa lembrar de checar",
                "function parseAgeOrNull(text) {",
                "  const age = Number(text);",
                "  return Number.isNaN(age) ? null : age;",
                "}",
                "",
                "// 3. Resultado explícito: o tipo de retorno carrega o sucesso ou a falha",
                "function parseAgeResult(text) {",
                "  const age = Number(text);",
                "  if (Number.isNaN(age)) return { ok: false, error: \"idade inválida\" };",
                "  return { ok: true, value: age };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O erro é o mesmo nos três casos — o que muda é como ele chega a quem chamou. Cada mecanismo tem " +
                "vantagens e custos, e o restante do módulo explora quando usar cada um.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Tratar a ausência de resultado (uma busca sem itens) como falha polui o código com exceções.",
                "Esconder um bug de programação com um valor padrão apenas adia a descoberta do erro.",
                "Nenhum mecanismo é a resposta universal: exceção, retorno nulo e resultado explícito mudam o custo de " +
                "esquecer de tratar.",
              ],
            },
          ],
          examples: [
            {
              title: "Um mesmo erro, três mecanismos",
              context: "A escolha do mecanismo muda o custo de esquecer de tratar o erro.",
              code: {
                language: "javascript",
                filename: "same-error-three-ways.js",
                code: [
                  "// Exceção: esquecer de tratar derruba a execução (barulhento, difícil de ignorar)",
                  "const user = loadUserOrThrow(id);",
                  "",
                  "// Retorno nulo: esquecer de checar vira um erro mais adiante, longe da causa",
                  "const user = loadUserOrNull(id);",
                  "console.log(user.name); // TypeError se user for null",
                  "",
                  "// Resultado: o código não avança sem olhar os dois casos",
                  "const result = loadUserResult(id);",
                  "if (!result.ok) return showError(result.error);",
                  "console.log(result.value.name);",
                ].join("\n"),
              },
              explanation:
                "A exceção falha alto e no lugar certo; o retorno nulo falha baixo e longe; o resultado explícito " +
                "obriga a decidir. Nenhuma é a resposta universal — depende de quão comum e recuperável é a falha.",
            },
            {
              title: "Erro esperado versus bug",
              context: "Os dois exigem respostas diferentes: um se trata, o outro se corrige.",
              code: {
                language: "javascript",
                filename: "expected-vs-bug.js",
                code: [
                  "// Erro esperado: acontece no uso normal — trate e siga",
                  "function readConfig(path) {",
                  "  if (!fs.existsSync(path)) return defaultConfig; // arquivo pode não existir",
                  "  return JSON.parse(fs.readFileSync(path, \"utf8\"));",
                  "}",
                  "",
                  "// Bug: violação de contrato — não \"trate\", corrija o chamador",
                  "function average(numbers) {",
                  "  if (!Array.isArray(numbers)) throw new TypeError(\"numbers deve ser um array\");",
                  "  return numbers.reduce((a, b) => a + b, 0) / numbers.length;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um arquivo de configuração ausente é uma situação normal e tem um comportamento definido. Passar " +
                "algo que não é array para average é um erro de programação: esconder isso com um valor padrão " +
                "apenas adiaria a descoberta do bug.",
            },
            {
              title: "Ausência de resultado não é erro",
              context: "Uma busca sem resultados é uma resposta legítima; tratá-la como falha polui o código com exceções.",
              code: {
                language: "javascript",
                filename: "not-an-error.js",
                code: [
                  "// Não é erro: a resposta é \"não há usuário com esse e-mail\"",
                  "function findUserByEmail(email) {",
                  "  return users.find((user) => user.email === email) ?? null;",
                  "}",
                  "",
                  "// É erro: a operação prometia sempre ter sucesso",
                  "function getUserByIdOrThrow(id) {",
                  "  const user = users.find((u) => u.id === id);",
                  "  if (!user) throw new Error(`usuário ${id} não existe`);",
                  "  return user;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O nome e o contrato definem o que é erro: find... admite que talvez não haja resultado; " +
                "get...OrThrow promete que o registro existe, e se ele não existir, algo está errado.",
            },
          ],
          exercise: {
            problem:
              "Quatro situações aparecem em um sistema de biblioteca. Para cada uma é preciso decidir se é um " +
              "erro esperado (tratar), um erro de programação (corrigir) ou uma situação que nem é um erro.",
            problemCode: {
              language: "javascript",
              filename: "situations.js",
              code: [
                "// A) O usuário digita \"abc\" no campo de número de páginas.",
                "// B) Uma busca por título não retorna nenhum livro.",
                "// C) Uma função recebe undefined onde deveria haver um livro, por um erro do chamador.",
                "// D) A conexão com o banco cai no meio de uma consulta.",
              ].join("\n"),
            },
            task:
              "Classifique cada situação (erro esperado, erro de programação ou não é erro) e diga, em uma " +
              "frase, como a resposta deve ser diferente em cada caso.",
            hint: "Pergunte: isso pode acontecer com um programa correto? Se sim, é esperado (ou nem é erro). Se só acontece com um bug, é de programação.",
            solution: {
              code: {
                language: "javascript",
                filename: "situations.answer.js",
                code: [
                  "// A) Erro esperado: entrada inválida é normal → validar e mostrar mensagem ao usuário.",
                  "// B) Não é erro: resultado vazio é uma resposta legítima → exibir \"nenhum livro encontrado\".",
                  "// C) Erro de programação: contrato violado pelo chamador → falhar de forma clara e corrigir o código.",
                  "// D) Erro esperado (operacional): falhas de infraestrutura acontecem → tratar, tentar de novo ou avisar.",
                ].join("\n"),
              },
              explanation:
                "A classificação define a resposta: A e D pedem tratamento (com mensagens e políticas diferentes), " +
                "B é só um resultado normal, e C pede correção do código — tratar C \"silenciosamente\" esconderia o bug.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Exceptions",
          requires: ["Errors vs Exceptions"],
          note: "throw/catch, hierarquia de exceções",
          summary:
            "Uma Exception é um objeto que representa uma falha e interrompe o fluxo normal até ser capturado por um " +
            "catch.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Quem detecta o problema faz throw, o fluxo salta para fora das funções em curso e só para quando " +
                "encontra um catch que o trate — ou derruba o programa, se ninguém tratar. O bloco finally executa " +
                "sempre, com ou sem erro, e serve para liberar recursos. Na maioria das linguagens, as exceções formam " +
                "uma hierarquia de tipos (Error → TypeError, RangeError…).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A exceção existe para o caminho feliz ficar legível, então mantenha o try pequeno e o catch específico.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem exceções, cada função precisaria devolver um código de erro, e cada chamador teria de checá-lo " +
                "após cada chamada — o caminho feliz se perderia no meio das verificações. A exceção separa o " +
                "fluxo normal do fluxo de falha e garante que um erro não passe despercebido: se ninguém o tratar, " +
                "o programa falha de forma visível, em vez de continuar com dados corrompidos.",
            },
            {
              type: "paragraph",
              text:
                "Boas práticas: capture apenas os erros que você sabe tratar (e deixe os demais subirem); nunca deixe " +
                "um catch vazio, que engole a falha sem deixar rastro; mantenha o bloco try pequeno, cobrindo só " +
                "a operação que pode falhar; use finally para limpeza; e reserve exceções para situações " +
                "excepcionais, não para controle de fluxo comum.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "throw, catch de um tipo específico e finally para liberar o recurso:" },
            {
              type: "code",
              language: "javascript",
              filename: "exceptions.js",
              code: [
                "function readJsonFile(path) {",
                "  const file = openFile(path);",
                "  try {",
                "    return JSON.parse(file.read());",
                "  } catch (error) {",
                "    if (error instanceof SyntaxError) {",
                "      throw new Error(`arquivo ${path} não é um JSON válido`);",
                "    }",
                "    throw error; // outro tipo de erro: não sabemos tratar, deixa subir",
                "  } finally {",
                "    file.close(); // sempre executa, com ou sem erro",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O catch trata só o que entende (JSON malformado, com uma mensagem mais útil) e repassa o resto. O " +
                "finally garante que o arquivo é fechado em qualquer caminho, inclusive quando algo falha.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para falhas que precisam subir até o ponto do código que sabe tratá-las.",
                "Com `finally`, para liberar recursos (arquivos, conexões, locks) em qualquer saída da função.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um `catch` genérico trata como iguais erros que pedem respostas diferentes, inclusive bugs; capture só o " +
                "que sabe tratar.",
                "O `catch` vazio engole a falha sem deixar rastro: registre e repasse.",
                "Falhas esperadas no fluxo normal costumam ficar mais claras como valores de resultado.",
              ],
            },
          ],
          examples: [
            {
              title: "finally para liberar recursos",
              context: "Recursos abertos (arquivos, conexões, locks) precisam ser liberados mesmo quando algo falha.",
              code: {
                language: "javascript",
                filename: "finally-cleanup.js",
                code: [
                  "async function runQuery(sql) {",
                  "  const connection = await pool.acquire();",
                  "  try {",
                  "    return await connection.query(sql);",
                  "  } finally {",
                  "    pool.release(connection); // sem isso, cada falha vaza uma conexão",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Sem o finally, uma consulta que falha deixaria a conexão presa para sempre, e depois de poucas " +
                "falhas o pool estaria esgotado. O finally executa em qualquer saída da função.",
            },
            {
              title: "Capturar de forma específica",
              context: "Um catch genérico trata como iguais erros que exigem respostas diferentes — inclusive bugs.",
              code: {
                language: "javascript",
                filename: "specific-catch.js",
                code: [
                  "// Antes: qualquer erro vira \"usuário não encontrado\", até um bug no código",
                  "try {",
                  "  return await loadUser(id);",
                  "} catch (error) {",
                  "  return null;",
                  "}",
                  "",
                  "// Depois: trata só o caso conhecido; o resto sobe",
                  "try {",
                  "  return await loadUser(id);",
                  "} catch (error) {",
                  "  if (error.code === \"USER_NOT_FOUND\") return null;",
                  "  throw error;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Na primeira versão, um TypeError causado por um bug aparece para o usuário como \"não encontrado\" " +
                "e ninguém investiga. Na segunda, só o caso previsto é tratado, e as demais falhas continuam visíveis.",
            },
            {
              title: "O catch vazio: engolir o erro",
              context: "O pior padrão: a falha acontece e não deixa nenhum rastro para quem tentar entender depois.",
              code: {
                language: "javascript",
                filename: "empty-catch.js",
                code: [
                  "// Antes: se salvar falhar, ninguém saberá",
                  "try {",
                  "  saveOrder(order);",
                  "} catch (error) {}",
                  "",
                  "// Depois: ou trata de verdade, ou deixa subir",
                  "try {",
                  "  saveOrder(order);",
                  "} catch (error) {",
                  "  logger.error(\"falha ao salvar pedido\", { orderId: order.id, error });",
                  "  throw error;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O primeiro código segue como se o pedido tivesse sido salvo, o que produz inconsistências que só " +
                "aparecem depois. Registrar e repassar preserva a informação e mantém a falha visível.",
            },
          ],
          exercise: {
            problem:
              "Esta função lê um arquivo de configuração, mas o try cobre tudo e o catch engole qualquer erro, " +
              "devolvendo um valor padrão.",
            problemCode: {
              language: "javascript",
              filename: "load-config.js",
              code: [
                "function loadConfig(path) {",
                "  try {",
                "    const file = openFile(path);",
                "    const config = JSON.parse(file.read());",
                "    config.retries = config.retries ?? 3;",
                "    file.close();",
                "    return config;",
                "  } catch (error) {",
                "    return { retries: 3 };",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Corrija: mantenha o try pequeno, trate só o erro conhecido (JSON inválido), libere o arquivo " +
              "sempre e não engula os demais erros.",
            hint: "Três correções: apenas o JSON.parse dentro do try, um finally para fechar o arquivo, e relançar o que não for SyntaxError.",
            solution: {
              code: {
                language: "javascript",
                filename: "load-config.refactored.js",
                code: [
                  "function loadConfig(path) {",
                  "  const file = openFile(path);",
                  "  try {",
                  "    const config = JSON.parse(file.read());",
                  "    return { retries: 3, ...config };",
                  "  } catch (error) {",
                  "    if (error instanceof SyntaxError) {",
                  "      throw new Error(`configuração em ${path} não é um JSON válido`);",
                  "    }",
                  "    throw error;",
                  "  } finally {",
                  "    file.close();",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O arquivo é sempre fechado, JSON inválido gera uma mensagem clara em vez de um valor padrão " +
                "silencioso, e falhas inesperadas (permissão, disco) continuam subindo. O padrão retries: 3 é " +
                "aplicado no caminho feliz, sem depender do catch.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Error Propagation",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "o erro sobe pela pilha de chamadas",
          summary:
            "Error Propagation é o caminho que uma falha percorre entre o ponto onde acontece e o ponto onde é " +
            "tratada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Com exceções, o erro sobe pela pilha de chamadas (Call Stack, módulo Memory & Runtime): cada função que " +
                "não o captura é abandonada, até que uma camada acima o trate. Com resultados explícitos, o erro é " +
                "devolvido de função em função. Em ambos os casos, o ponto essencial é decidir em qual camada agir.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "A camada que descobre a falha e a camada que sabe o que fazer com ela raramente são a mesma.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quem detecta o erro geralmente não sabe o que fazer com ele. Uma função de acesso ao banco descobre que " +
                "a conexão caiu, mas quem sabe se deve tentar de novo, mostrar uma mensagem ou abortar a operação " +
                "é uma camada acima, que conhece o contexto de negócio. Por isso a regra é tratar o erro no nível que " +
                "tem informação suficiente para agir — e deixá-lo subir até lá.",
            },
            {
              type: "paragraph",
              text:
                "Cada camada por onde o erro passa tem três opções: tratar (se sabe o que fazer), enriquecer " +
                "(capturar, acrescentar contexto e relançar, preservando a causa original) ou ignorar (deixar " +
                "subir intacto). Dois cuidados: não registrar e relançar a cada camada (o mesmo erro aparece " +
                "várias vezes no log) e não perder a causa original ao envolver o erro em outro.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um erro atravessando três camadas até chegar a quem sabe tratá-lo:" },
            {
              type: "code",
              language: "javascript",
              filename: "error-propagation.js",
              code: [
                "// Camada baixa: detecta a falha, não sabe o que fazer com ela",
                "function readUserRow(id) {",
                "  throw new Error(\"conexão com o banco perdida\");",
                "}",
                "",
                "// Camada de serviço: não captura — o erro passa direto",
                "function getUserProfile(id) {",
                "  const row = readUserRow(id);",
                "  return { name: row.name };",
                "}",
                "",
                "// Camada de entrada: sabe como responder ao usuário",
                "function handleRequest(id) {",
                "  try {",
                "    return { status: 200, body: getUserProfile(id) };",
                "  } catch (error) {",
                "    return { status: 503, body: \"serviço indisponível, tente novamente\" };",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "getUserProfile não tem nada de útil a fazer com a falha, então não a captura. Só handleRequest " +
                "sabe traduzir o problema para uma resposta ao usuário, e é onde o erro é tratado.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Registrar e relançar em toda camada repete o mesmo erro várias vezes no log; trate uma vez só.",
                "Acrescentar contexto sem preservar o erro original (`cause`) perde a pilha da falha real.",
                "Uma camada só deve tratar o erro se tiver contexto para agir; caso contrário, deixe subir.",
              ],
            },
          ],
          examples: [
            {
              title: "Acrescentar contexto sem perder a causa",
              context: "Uma camada intermediária pode enriquecer o erro com informação de negócio, preservando o erro original.",
              code: {
                language: "javascript",
                filename: "error-with-cause.js",
                code: [
                  "async function chargeOrder(order) {",
                  "  try {",
                  "    return await paymentGateway.charge(order.total, order.cardToken);",
                  "  } catch (error) {",
                  "    throw new Error(`falha ao cobrar o pedido ${order.id}`, { cause: error });",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Quem receber o erro sabe qual pedido falhou (contexto que o gateway não tinha), e a propriedade " +
                "cause mantém o erro original com sua pilha, para investigação.",
            },
            {
              title: "Registrar e relançar em toda camada",
              context: "Um anti-padrão comum: cada camada loga o erro e o relança, e o mesmo problema aparece várias vezes no log.",
              code: {
                language: "javascript",
                filename: "log-and-rethrow.js",
                code: [
                  "// Antes: três entradas de log para uma única falha",
                  "function repository() { try { db.query(); } catch (e) { log(e); throw e; } }",
                  "function service()    { try { repository(); } catch (e) { log(e); throw e; } }",
                  "function controller() { try { service(); } catch (e) { log(e); respond(500); } }",
                  "",
                  "// Depois: só quem trata registra",
                  "function repository() { db.query(); }",
                  "function service()    { repository(); }",
                  "function controller() { try { service(); } catch (e) { log(e); respond(500); } }",
                ].join("\n"),
              },
              explanation:
                "Um único registro, no ponto em que o erro é tratado, mostra a falha com a pilha completa. As " +
                "entradas repetidas só dificultam a leitura do log e a contagem real de ocorrências.",
            },
            {
              title: "Propagação em código assíncrono",
              context: "Com async/await, um erro numa função assíncrona também sobe: o await o relança para quem chamou.",
              code: {
                language: "javascript",
                filename: "async-propagation.js",
                code: [
                  "async function loadDashboard(userId) {",
                  "  const profile = await fetchProfile(userId);  // se falhar, sobe daqui",
                  "  const orders = await fetchOrders(userId);",
                  "  return { profile, orders };",
                  "}",
                  "",
                  "async function showDashboard(userId) {",
                  "  try {",
                  "    render(await loadDashboard(userId));",
                  "  } catch (error) {",
                  "    renderError(\"não foi possível carregar o painel\");",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "loadDashboard não precisa de try/catch: qualquer rejeição interna se propaga para showDashboard, " +
                "que é quem decide como mostrar o problema ao usuário.",
            },
          ],
          exercise: {
            problem:
              "Esta cadeia de funções registra o erro em todas as camadas e, na camada de repositório, perde a " +
              "informação sobre qual usuário falhou.",
            problemCode: {
              language: "javascript",
              filename: "layers.js",
              code: [
                "function findUser(id) {",
                "  try {",
                "    return db.query(\"SELECT * FROM users WHERE id = $1\", [id]);",
                "  } catch (error) {",
                "    console.log(error);",
                "    throw new Error(\"erro no banco\");",
                "  }",
                "}",
                "",
                "function handleRequest(id) {",
                "  try {",
                "    return { status: 200, body: findUser(id) };",
                "  } catch (error) {",
                "    console.log(error);",
                "    return { status: 500, body: \"erro\" };",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Ajuste a propagação: preserve a causa original com contexto na camada de repositório e registre o " +
              "erro apenas uma vez, na camada que o trata.",
            hint: "findUser pode acrescentar contexto (o id) com cause, mas não precisa logar. O log fica só em handleRequest.",
            solution: {
              code: {
                language: "javascript",
                filename: "layers.refactored.js",
                code: [
                  "function findUser(id) {",
                  "  try {",
                  "    return db.query(\"SELECT * FROM users WHERE id = $1\", [id]);",
                  "  } catch (error) {",
                  "    throw new Error(`falha ao buscar o usuário ${id}`, { cause: error });",
                  "  }",
                  "}",
                  "",
                  "function handleRequest(id) {",
                  "  try {",
                  "    return { status: 200, body: findUser(id) };",
                  "  } catch (error) {",
                  "    console.error(\"falha na requisição\", error); // único ponto de log",
                  "    return { status: 500, body: \"não foi possível processar a solicitação\" };",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O erro do banco não se perde (cause) e ganha o contexto do usuário afetado. O log é feito uma vez, " +
                "com a cadeia completa de causas, e a resposta ao usuário não expõe detalhes internos.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Custom Errors",
          requires: ["Exceptions"],
          note: "tipos de erro com significado de domínio",
          summary:
            "Um Custom Error é um tipo de erro próprio da aplicação, que representa uma falha com significado no " +
            "domínio.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ele estende o tipo base de erro da linguagem — InsufficientFundsError, OrderNotFoundError. Além da " +
                "mensagem, pode carregar dados úteis (o saldo atual, o id procurado) e um código estável para uso em " +
                "respostas de API ou em logs.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se o código decide o que fazer lendo o texto da mensagem de erro, está faltando um tipo de erro.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um Error genérico só tem uma mensagem em texto, e quem quer reagir de forma diferente a cada tipo de " +
                "falha acaba examinando a mensagem (error.message.includes(\"saldo\")) — frágil, porque qualquer " +
                "alteração na frase quebra a lógica. Com tipos próprios, o código decide pelo tipo " +
                "(instanceof) ou por um código estável, e a mensagem volta a ser só texto para humanos.",
            },
            {
              type: "paragraph",
              text:
                "Cuidados: mantenha o conjunto pequeno — crie um tipo quando o código de fato precisar reagir " +
                "de forma diferente, não para cada mensagem; defina o name da classe para que apareça " +
                "corretamente nos logs; carregue dados estruturados em campos (não só no texto); e preserve " +
                "a causa original quando o erro envolver outro (cause).",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um erro de domínio com dados úteis e o código que reage ao tipo:" },
            {
              type: "code",
              language: "javascript",
              filename: "custom-errors.js",
              code: [
                "class InsufficientFundsError extends Error {",
                "  constructor(balance, requested) {",
                "    super(`saldo ${balance} insuficiente para sacar ${requested}`);",
                "    this.name = \"InsufficientFundsError\";",
                "    this.balance = balance;",
                "    this.requested = requested;",
                "  }",
                "}",
                "",
                "function withdraw(account, amount) {",
                "  if (amount > account.balance) throw new InsufficientFundsError(account.balance, amount);",
                "  account.balance -= amount;",
                "}",
                "",
                "try {",
                "  withdraw(account, 500);",
                "} catch (error) {",
                "  if (error instanceof InsufficientFundsError) showMessage(`Faltam ${error.requested - error.balance}`);",
                "  else throw error;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O código que trata o erro não depende do texto da mensagem: decide pelo tipo e usa os campos " +
                "balance e requested para uma resposta útil ao usuário. A mensagem pode ser reescrita sem quebrar nada.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o código precisa reagir de forma diferente a cada falha do domínio, decidindo pelo tipo.",
                "Com uma base comum e um `code` estável, para mapear falhas para respostas HTTP, mensagens ou métricas.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um tipo novo só se justifica quando alguém vai tratá-lo de um jeito diferente dos demais.",
                "Muitos tipos sem decisões novas só aumentam a superfície a manter.",
              ],
            },
          ],
          examples: [
            {
              title: "Trocar a análise de mensagem por tipo",
              context: "Examinar o texto do erro é frágil: qualquer mudança de redação quebra o tratamento.",
              code: {
                language: "javascript",
                filename: "message-parsing.js",
                code: [
                  "// Antes: depende do texto exato",
                  "try {",
                  "  await createUser(data);",
                  "} catch (error) {",
                  "  if (error.message.includes(\"já existe\")) return respond(409);",
                  "  throw error;",
                  "}",
                  "",
                  "// Depois: depende do tipo",
                  "class EmailAlreadyRegisteredError extends Error {",
                  "  constructor(email) {",
                  "    super(`o e-mail ${email} já está cadastrado`);",
                  "    this.name = \"EmailAlreadyRegisteredError\";",
                  "  }",
                  "}",
                  "",
                  "try {",
                  "  await createUser(data);",
                  "} catch (error) {",
                  "  if (error instanceof EmailAlreadyRegisteredError) return respond(409);",
                  "  throw error;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se alguém mudar a mensagem de \"já existe\" para \"já está cadastrado\", a primeira versão deixa " +
                "de funcionar sem nenhum aviso. Na segunda, o tratamento continua correto.",
            },
            {
              title: "Uma base comum com código estável",
              context: "Para não criar uma classe por variação, uma base com um campo code cobre o que precisa ser mapeado (respostas, métricas).",
              code: {
                language: "javascript",
                filename: "base-app-error.js",
                code: [
                  "class AppError extends Error {",
                  "  constructor(code, message, options) {",
                  "    super(message, options);",
                  "    this.name = \"AppError\";",
                  "    this.code = code; // estável: pode ser usado por APIs e métricas",
                  "  }",
                  "}",
                  "",
                  "throw new AppError(\"ORDER_NOT_FOUND\", `pedido ${id} não encontrado`);",
                  "",
                  "// Quem trata mapeia pelo código:",
                  "const STATUS_BY_CODE = { ORDER_NOT_FOUND: 404, PAYMENT_DECLINED: 402 };",
                ].join("\n"),
              },
              explanation:
                "Um código estável evita uma explosão de classes e permite mapear falhas para respostas HTTP, " +
                "mensagens localizadas ou métricas sem depender do texto.",
            },
            {
              title: "Quando não criar um tipo",
              context: "Um tipo novo só se justifica quando alguém vai tratá-lo de um jeito diferente dos demais.",
              code: {
                language: "javascript",
                filename: "dont-overdo-it.js",
                code: [
                  "// Excesso: um tipo para cada frase, ninguém trata de forma diferente",
                  "class NameTooShortError extends Error {}",
                  "class NameTooLongError extends Error {}",
                  "class NameHasDigitsError extends Error {}",
                  "",
                  "// Suficiente: um tipo de validação, com o detalhe em um campo",
                  "class ValidationError extends Error {",
                  "  constructor(field, reason) {",
                  "    super(`${field}: ${reason}`);",
                  "    this.name = \"ValidationError\";",
                  "    this.field = field;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se toda validação é tratada da mesma forma (mostrar a mensagem no campo), um tipo com os " +
                "detalhes em campos basta. Muitos tipos aumentam a superfície a manter sem trazer decisões novas.",
            },
          ],
          exercise: {
            problem:
              "Este código distingue duas falhas do pagamento pelo texto da mensagem — e a equipe de produto " +
              "acabou de mudar a redação das mensagens.",
            problemCode: {
              language: "javascript",
              filename: "payment.js",
              code: [
                "function pay(order) {",
                "  if (order.total > order.limit) throw new Error(\"limite excedido\");",
                "  if (!order.card) throw new Error(\"cartão ausente\");",
                "  // ...",
                "}",
                "",
                "try {",
                "  pay(order);",
                "} catch (error) {",
                "  if (error.message === \"limite excedido\") askForHigherLimit();",
                "  else if (error.message === \"cartão ausente\") askForCard();",
                "  else throw error;",
                "}",
              ].join("\n"),
            },
            task:
              "Crie erros personalizados para as duas falhas e faça o tratamento depender do tipo, não do texto.",
            hint: "Duas classes que estendem Error, cada uma definindo this.name; o catch usa instanceof.",
            solution: {
              code: {
                language: "javascript",
                filename: "payment.refactored.js",
                code: [
                  "class LimitExceededError extends Error {",
                  "  constructor(total, limit) {",
                  "    super(`total ${total} excede o limite ${limit}`);",
                  "    this.name = \"LimitExceededError\";",
                  "  }",
                  "}",
                  "",
                  "class MissingCardError extends Error {",
                  "  constructor() {",
                  "    super(\"nenhum cartão associado ao pedido\");",
                  "    this.name = \"MissingCardError\";",
                  "  }",
                  "}",
                  "",
                  "function pay(order) {",
                  "  if (order.total > order.limit) throw new LimitExceededError(order.total, order.limit);",
                  "  if (!order.card) throw new MissingCardError();",
                  "  // ...",
                  "}",
                  "",
                  "try {",
                  "  pay(order);",
                  "} catch (error) {",
                  "  if (error instanceof LimitExceededError) askForHigherLimit();",
                  "  else if (error instanceof MissingCardError) askForCard();",
                  "  else throw error;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O tratamento agora não depende de nenhuma frase, então as mensagens podem ser reescritas à vontade. " +
                "Como bônus, LimitExceededError carrega dados que a mensagem só descrevia em texto.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Fail Fast",
          requires: ["Programming Foundations / Programming Fundamentals / Contract"],
          note: "pré-condição violada → falhar imediatamente",
          summary:
            "Fail Fast é detectar e sinalizar um problema no ponto onde ele surge, em vez de deixar o dado inválido " +
            "seguir adiante.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Na prática, isso é verificar as condições necessárias logo no início — argumentos válidos, configuração " +
                "completa, estado esperado — e falhar imediatamente, com uma mensagem clara, quando alguma delas for " +
                "violada. É a ideia de Contract (módulo Programming Fundamentals): se uma pré-condição do contrato foi " +
                "quebrada, o chamador é avisado na hora.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Valide tudo antes do primeiro efeito colateral, para que uma falha nunca deixe o trabalho pela metade.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um dado inválido que passa despercebido não desaparece: ele viaja pelo sistema, contamina " +
                "resultados e explode mais tarde, longe da causa — quando descobrir a origem custa muito mais. " +
                "Falhar cedo aproxima o erro do lugar em que foi cometido, o que torna o diagnóstico rápido, e " +
                "impede efeitos parciais (gravar metade dos dados antes de descobrir que faltava algo).",
            },
            {
              type: "paragraph",
              text:
                "Aplicações típicas: validar argumentos no início da função, antes de qualquer efeito colateral; " +
                "validar a configuração ao iniciar a aplicação (falhar no boot, não na primeira requisição); e " +
                "não \"consertar\" silenciosamente dados errados com valores padrão que escondem o problema. " +
                "Fail Fast se aplica a violações de contrato e bugs — para erros esperados em uso normal (a " +
                "digitação do usuário), a resposta é tratar e informar, não abortar.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a validação no topo, antes de qualquer efeito, com uma mensagem que aponta a causa:" },
            {
              type: "code",
              language: "javascript",
              filename: "fail-fast.js",
              code: [
                "// Antes: entrada inválida segue adiante e o erro aparece longe da causa",
                "function transfer(from, to, amount) {",
                "  from.balance -= amount;",
                "  to.balance += amount; // e se 'to' for undefined? o débito já aconteceu",
                "}",
                "",
                "// Depois: valida tudo antes de mexer em qualquer coisa",
                "function transfer(from, to, amount) {",
                "  if (!from || !to) throw new Error(\"transfer: contas de origem e destino são obrigatórias\");",
                "  if (!(amount > 0)) throw new Error(`transfer: valor inválido (${amount})`);",
                "  if (from.balance < amount) throw new Error(\"transfer: saldo insuficiente\");",
                "",
                "  from.balance -= amount;",
                "  to.balance += amount;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na primeira versão, uma conta de destino ausente faz o dinheiro sair da origem e sumir. Na segunda, " +
                "nada é alterado se qualquer condição falhar, e a mensagem diz exatamente qual foi violada.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Corrigir automaticamente uma entrada inválida evita o erro agora, mas mantém o bug vivo e cobra depois.",
                "Não se aplica a erros esperados de uso normal: um formulário com erro de digitação deve ser tratado e " +
                "informado, não abortado.",
                "Validar só na primeira requisição faz a falha aparecer em produção, para um usuário; valide na inicialização.",
              ],
            },
          ],
          examples: [
            {
              title: "Validar a configuração na inicialização",
              context: "Uma configuração ausente descoberta só na primeira requisição falha em produção, para um usuário.",
              code: {
                language: "javascript",
                filename: "startup-check.js",
                code: [
                  "function loadSettings(env) {",
                  "  const required = [\"DATABASE_URL\", \"API_KEY\"];",
                  "  const missing = required.filter((name) => !env[name]);",
                  "  if (missing.length > 0) {",
                  "    throw new Error(`variáveis de ambiente ausentes: ${missing.join(\", \")}`);",
                  "  }",
                  "  return { databaseUrl: env.DATABASE_URL, apiKey: env.API_KEY };",
                  "}",
                  "",
                  "const settings = loadSettings(process.env); // falha ao iniciar, com a lista completa",
                ].join("\n"),
              },
              explanation:
                "A aplicação nem sobe com configuração incompleta, e a mensagem lista tudo o que falta de uma " +
                "vez, em vez de revelar um problema por vez a cada tentativa.",
            },
            {
              title: "Valor padrão silencioso que esconde um bug",
              context: "Corrigir automaticamente uma entrada inválida evita o erro imediato, mas mantém o bug vivo.",
              code: {
                language: "javascript",
                filename: "silent-default.js",
                code: [
                  "// Antes: se 'items' faltar por um bug do chamador, o total sai 0 e ninguém percebe",
                  "function orderTotal(items) {",
                  "  return (items || []).reduce((sum, item) => sum + item.price, 0);",
                  "}",
                  "",
                  "// Depois: a violação do contrato aparece na hora",
                  "function orderTotal(items) {",
                  "  if (!Array.isArray(items)) throw new TypeError(\"orderTotal: items deve ser um array\");",
                  "  return items.reduce((sum, item) => sum + item.price, 0);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O valor padrão faria a fatura sair com R$ 0 e só alguém notaria depois. Falhar cedo revela o bug " +
                "do chamador no primeiro teste, quando ainda é barato corrigir.",
            },
            {
              title: "Onde fail fast não se aplica",
              context: "Para erros esperados de uso normal, abortar é a resposta errada — o certo é tratar e informar.",
              code: {
                language: "javascript",
                filename: "expected-input.js",
                code: [
                  "// Entrada do usuário: erros são esperados → devolver a mensagem, não lançar",
                  "function validateSignUpForm(form) {",
                  "  const errors = [];",
                  "  if (!form.email.includes(\"@\")) errors.push(\"e-mail inválido\");",
                  "  if (form.password.length < 8) errors.push(\"senha muito curta\");",
                  "  return errors; // a interface mostra todas as mensagens de uma vez",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um formulário com erro de digitação é uma situação normal, não um bug. Interromper com uma " +
                "exceção no primeiro erro seria pior para o usuário do que listar todos os problemas juntos.",
            },
          ],
          exercise: {
            problem:
              "Esta função de envio de e-mail continua mesmo com dados inválidos, e falhas estranhas aparecem " +
              "depois que parte do trabalho já foi feita.",
            problemCode: {
              language: "javascript",
              filename: "send-newsletter.js",
              code: [
                "function sendNewsletter(subscribers, subject) {",
                "  markCampaignAsStarted();",
                "  for (const subscriber of subscribers) {",
                "    mailer.send(subscriber.email, subject || \"(sem assunto)\");",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Aplique Fail Fast: valide as condições no início, antes de qualquer efeito, e remova o valor padrão " +
              "que esconde o problema do assunto ausente.",
            hint: "A campanha é marcada como iniciada antes de qualquer verificação — se a lista for inválida, ela ficará marcada mesmo sem envio.",
            solution: {
              code: {
                language: "javascript",
                filename: "send-newsletter.refactored.js",
                code: [
                  "function sendNewsletter(subscribers, subject) {",
                  "  if (!Array.isArray(subscribers) || subscribers.length === 0) {",
                  "    throw new Error(\"sendNewsletter: informe ao menos um destinatário\");",
                  "  }",
                  "  if (!subject) throw new Error(\"sendNewsletter: o assunto é obrigatório\");",
                  "",
                  "  markCampaignAsStarted();",
                  "  for (const subscriber of subscribers) {",
                  "    mailer.send(subscriber.email, subject);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As verificações vêm antes de markCampaignAsStarted, então nada é alterado se os dados forem inválidos. " +
                "O assunto ausente deixou de ser mascarado por um texto padrão e vira um erro claro para quem chamou.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Result Pattern",
          note: "erro como valor de retorno explícito, não efeito colateral — revisita Programming Foundations / Functional Programming (Side Effects/Pure Functions)",
          summary:
            "O Result Pattern é devolver um objeto que representa sucesso (Ok) ou falha (Err), em vez de lançar uma " +
            "exceção.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ele evita o uso de exceções para o fluxo de controle, tornando o código mais explícito, previsível e " +
                "fácil de testar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Com um Result, a possibilidade de falha aparece na assinatura, e quem chama não consegue fingir que ela " +
                "não existe.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Em vez de lançar uma exceção, a função retorna um objeto `Result` com dois possíveis estados: `Ok` (sucesso) ou `Err` " +
                "(falha). O chamador precisa tratar explicitamente os dois casos.",
            },
            {
              type: "flow",
              label: "Operação que pode falhar, depois Result com Ok(value) ou Err(error), depois tratamento explícito do resultado",
              steps: [
                { lines: ["Operação", "pode falhar"] },
                {
                  title: "Result<T, E>",
                  tags: [
                    { text: "Ok(value)", tone: "ok" },
                    { text: "Err(error)", tone: "err" },
                  ],
                },
                { lines: ["Tratamento", "explícito do resultado"] },
              ],
            },
            { type: "heading", text: "Estrutura" },
            { type: "paragraph", text: "Uma implementação simples em TypeScript:" },
            {
              type: "code",
              language: "typescript",
              label: "TypeScript",
              code: [
                "type Result<T, E> =",
                "  | { ok: true; value: T }",
                "  | { ok: false; error: E };",
                "",
                "function ok<T>(value: T): Result<T, never> {",
                "  return { ok: true, value };",
                "}",
                "",
                "function err<E>(error: E): Result<never, E> {",
                "  return { ok: false, error };",
                "}",
              ].join("\n"),
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando você quer tornar o tratamento de erro explícito.",
                "Em domínios onde falhas são esperadas (ex.: validações, APIs externas, parsing).",
                "Quando o código precisa ser mais previsível e testável.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em situações realmente excepcionais (ex.: falha de infraestrutura, bugs inesperados).",
                "Pode aumentar a verbosidade do código.",
                "Em projetos pequenos, pode ser mais simples usar exceções.",
              ],
            },
          ],
          examples: [
            {
              title: "Encadear passos que podem falhar",
              context: "Com resultados, é possível compor uma sequência: o primeiro erro interrompe o restante sem lançar nada.",
              code: {
                language: "javascript",
                filename: "chaining-results.js",
                code: [
                  "function andThen(result, next) {",
                  "  return result.ok ? next(result.value) : result;",
                  "}",
                  "",
                  "const registration = andThen(",
                  "  validateEmail(form.email),",
                  "  (email) => andThen(validatePassword(form.password), (password) => ok({ email, password }))",
                  ");",
                  "",
                  "if (!registration.ok) showError(registration.error);",
                ].join("\n"),
              },
              explanation:
                "Se validateEmail falhar, o resultado de erro passa adiante sem executar validatePassword. O fluxo " +
                "de falha é tratado como dado, em um só lugar, no final.",
            },
            {
              title: "Result para o esperado, exceção para o inesperado",
              context: "Os dois mecanismos convivem: cada um para o tipo de falha que serve melhor.",
              code: {
                language: "javascript",
                filename: "result-and-exceptions.js",
                code: [
                  "// Esperado e frequente → Result: o chamador precisa decidir",
                  "function findCoupon(code) {",
                  "  const coupon = coupons.get(code);",
                  "  return coupon ? ok(coupon) : fail(\"cupom inválido\");",
                  "}",
                  "",
                  "// Inesperado (bug ou infraestrutura) → exceção: sobe até o tratador geral",
                  "function applyCoupon(order, coupon) {",
                  "  if (!order) throw new TypeError(\"order é obrigatório\");",
                  "  return { ...order, total: order.total - coupon.value };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um cupom digitado errado é rotina, e a interface deve reagir. Um order ausente é um bug do " +
                "chamador: a exceção chama atenção e não pede um tratamento local.",
            },
            {
              title: "O custo: verbosidade",
              context: "Tornar cada falha explícita exige checar cada chamada; em falhas raras ou irrecuperáveis, o custo não compensa.",
              code: {
                language: "javascript",
                filename: "verbosity-cost.js",
                code: [
                  "// Verboso demais para uma falha que ninguém trata localmente:",
                  "const cfg = readConfig();",
                  "if (!cfg.ok) return fail(cfg.error);",
                  "const db = connect(cfg.value.databaseUrl);",
                  "if (!db.ok) return fail(db.error);",
                  "",
                  "// Se a única resposta possível é abortar, uma exceção comunica o mesmo com menos ruído.",
                ].join("\n"),
              },
              explanation:
                "Result compensa quando o chamador tem algo diferente a fazer em cada desfecho. Se a única " +
                "resposta a qualquer falha é propagar, exceções fazem isso automaticamente e deixam o código do " +
                "caminho feliz mais limpo.",
            },
          ],
          exercise: {
            problem:
              "Esta função lança uma exceção para uma falha completamente esperada (um percentual digitado " +
              "errado pelo usuário), e quem a chama esquece de tratar em algumas telas.",
            problemCode: {
              language: "javascript",
              filename: "parse-percentage.js",
              code: [
                "function parsePercentage(text) {",
                "  const value = Number(text);",
                "  if (Number.isNaN(value)) throw new Error(\"não é um número\");",
                "  if (value < 0 || value > 100) throw new Error(\"fora do intervalo 0–100\");",
                "  return value;",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva parsePercentage usando o Result Pattern e mostre como o chamador é obrigado a lidar " +
              "com os dois desfechos.",
            hint: "Devolva { ok: true, value } no sucesso e { ok: false, error } nas falhas, e mostre um uso com if (!result.ok).",
            solution: {
              code: {
                language: "javascript",
                filename: "parse-percentage.refactored.js",
                code: [
                  "function parsePercentage(text) {",
                  "  const value = Number(text);",
                  "  if (Number.isNaN(value)) return { ok: false, error: \"não é um número\" };",
                  "  if (value < 0 || value > 100) return { ok: false, error: \"fora do intervalo 0–100\" };",
                  "  return { ok: true, value };",
                  "}",
                  "",
                  "const result = parsePercentage(input.value);",
                  "if (!result.ok) {",
                  "  showFieldError(result.error);",
                  "} else {",
                  "  applyDiscount(result.value);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A falha agora faz parte do retorno, então quem lê o código vê os dois caminhos. Como o valor está " +
                "dentro de result.value, não dá para usá-lo sem antes passar (ou ao menos ver) a verificação de ok.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Error Boundaries",
          note: "conter a falha para não propagar em cascata — definição agnóstica de framework. Ponte futura para Architecture / Resilience Patterns (sem Requires — Epic 06 ainda não aprovado)",
          summary:
            "Um Error Boundary é um ponto do código que envolve uma unidade de trabalho e impede que uma falha dentro " +
            "dela se espalhe.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A unidade pode ser uma requisição, um item de um lote, um componente independente. Em vez de cada função " +
                "tratar tudo, define-se onde a falha para. O termo é usado aqui em sentido geral, sem depender de nenhum " +
                "framework.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Escolha de antemão onde cada falha para, em vez de deixar que ela suba até derrubar tudo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem fronteiras, um erro em uma parte sobe até o topo e derruba tudo: um único registro " +
                "malformado interrompe o processamento de milhares, uma falha em um widget secundário deixa a " +
                "página em branco, uma requisição com bug derruba o servidor para todos. Com fronteiras nos " +
                "limites das unidades de trabalho, a falha é contida, registrada, e o resto continua funcionando.",
            },
            {
              type: "paragraph",
              text:
                "Uma fronteira bem projetada faz três coisas: captura o erro, registra com contexto suficiente para " +
                "diagnosticar, e devolve algo seguro (uma resposta de erro, um valor alternativo ou nada, marcado " +
                "como falha). O que ela não deve fazer é engolir em silêncio — conter não é esconder. É também " +
                "a base de ideias mais amplas como Resilience Patterns (bulkheads, fallbacks), que aparecem na Área " +
                "de Arquitetura.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "cada item de um lote em sua própria fronteira: um item ruim não derruba os demais:" },
            {
              type: "code",
              language: "javascript",
              filename: "error-boundary.js",
              code: [
                "// Antes: o primeiro erro interrompe o processamento de todos os itens restantes",
                "for (const order of orders) {",
                "  processOrder(order);",
                "}",
                "",
                "// Depois: cada item tem sua fronteira; as falhas são registradas e o lote continua",
                "const failures = [];",
                "for (const order of orders) {",
                "  try {",
                "    processOrder(order);",
                "  } catch (error) {",
                "    logger.error(\"falha ao processar pedido\", { orderId: order.id, error });",
                "    failures.push({ orderId: order.id, reason: error.message });",
                "  }",
                "}",
                "report(failures);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A fronteira é o try/catch por item: a falha de um pedido fica contida nele. Ela não é silenciosa — " +
                "o erro é registrado e coletado em failures, para que ninguém pense que tudo deu certo.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em fronteiras de unidade de trabalho, como uma requisição, para que uma falha não derrube o servidor.",
                "Para degradar partes secundárias (como recomendações) enquanto o essencial continua funcionando.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Conter não é engolir: uma fronteira que esconde a falha impede qualquer diagnóstico, então registre.",
                "Só coloque a fronteira onde é seguro degradar; o essencial deve continuar falhando alto.",
              ],
            },
          ],
          examples: [
            {
              title: "Fronteira por requisição",
              context: "Um servidor não pode cair porque uma única requisição falhou.",
              code: {
                language: "javascript",
                filename: "request-boundary.js",
                code: [
                  "async function handle(request) {",
                  "  try {",
                  "    return await router.dispatch(request);",
                  "  } catch (error) {",
                  "    logger.error(\"erro não tratado\", { path: request.path, error });",
                  "    return { status: 500, body: \"erro interno\" };",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Qualquer falha dentro de uma requisição vira uma resposta 500 para aquele usuário, com o erro " +
                "registrado — e o servidor continua atendendo todas as outras.",
            },
            {
              title: "Degradar uma parte secundária",
              context: "Quando uma funcionalidade não essencial falha, o restante da página deve continuar funcionando.",
              code: {
                language: "javascript",
                filename: "degraded-boundary.js",
                code: [
                  "async function loadProductPage(id) {",
                  "  const product = await fetchProduct(id); // essencial: se falhar, a página falha",
                  "",
                  "  let recommendations = [];",
                  "  try {",
                  "    recommendations = await fetchRecommendations(id);",
                  "  } catch (error) {",
                  "    logger.warn(\"recomendações indisponíveis\", { id, error }); // secundário: degrada",
                  "  }",
                  "",
                  "  return { product, recommendations };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A página do produto continua funcionando sem as recomendações. A fronteira fica só onde é seguro " +
                "degradar: o essencial (o produto) continua falhando alto se der problema.",
            },
            {
              title: "O que a fronteira não deve fazer",
              context: "Conter não é engolir: uma fronteira que esconde a falha impede qualquer diagnóstico.",
              code: {
                language: "javascript",
                filename: "bad-boundary.js",
                code: [
                  "// Ruim: a falha é contida, mas fica invisível",
                  "async function syncAll(items) {",
                  "  for (const item of items) {",
                  "    try { await sync(item); } catch (error) { /* ignora */ }",
                  "  }",
                  "  return \"sincronização concluída\"; // mesmo que tudo tenha falhado",
                  "}",
                  "",
                  "// Melhor: contém, registra e informa quantos falharam",
                  "async function syncAll(items) {",
                  "  let failed = 0;",
                  "  for (const item of items) {",
                  "    try { await sync(item); } catch (error) { failed++; logger.error(\"falha ao sincronizar\", { item, error }); }",
                  "  }",
                  "  return `${items.length - failed} de ${items.length} itens sincronizados`;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A primeira versão anuncia sucesso mesmo quando tudo falha. A segunda mantém a contenção (um item " +
                "ruim não interrompe os demais) sem perder a verdade sobre o que aconteceu.",
            },
          ],
          exercise: {
            problem:
              "Este código importa uma lista de contatos. Um único registro inválido interrompe a importação " +
              "inteira, e os registros seguintes nunca são processados.",
            problemCode: {
              language: "javascript",
              filename: "import-contacts.js",
              code: [
                "function importContacts(rows) {",
                "  for (const row of rows) {",
                "    const contact = parseContact(row); // pode lançar",
                "    saveContact(contact);",
                "  }",
                "  return \"importação concluída\";",
                "}",
              ].join("\n"),
            },
            task:
              "Coloque uma fronteira de erro por registro: contenha a falha, registre-a, e devolva um resumo com " +
              "o número de importados e a lista de falhas.",
            hint: "O try/catch fica dentro do laço. Guarde o índice da linha e a mensagem do erro para poder relatar o que falhou.",
            solution: {
              code: {
                language: "javascript",
                filename: "import-contacts.refactored.js",
                code: [
                  "function importContacts(rows) {",
                  "  const failures = [];",
                  "  let imported = 0;",
                  "",
                  "  rows.forEach((row, index) => {",
                  "    try {",
                  "      saveContact(parseContact(row));",
                  "      imported++;",
                  "    } catch (error) {",
                  "      logger.error(\"falha ao importar contato\", { line: index + 1, error });",
                  "      failures.push({ line: index + 1, reason: error.message });",
                  "    }",
                  "  });",
                  "",
                  "  return { imported, failures };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um registro inválido agora afeta apenas a si mesmo: os demais continuam sendo importados. A falha " +
                "não é escondida — fica no log e no resumo devolvido, com a linha exata de cada problema.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "code-review",
      order: 60,
      title: "Code Review",
      requires: ["Clean Code"],
      summary: "Guarda-chuva (o que é, por que é gate de qualidade) → as lentes de avaliação → escopo do PR → a camada humana de comunicação.",
      concepts: [
        concept({
          order: 10,
          title: "Code Review",
          requires: ["Clean Code"],
          isNew: true,
          note: "guarda-chuva: o que é, por que é gate de qualidade",
          summary:
            "Code Review é a prática de outra pessoa examinar uma mudança de código antes de ela ser integrada à base " +
            "principal.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Quem revisa (o revisor) lê a mudança de quem a escreveu (o autor). Costuma acontecer em um pull request " +
                "(ou merge request): o autor propõe a mudança, o revisor lê, comenta, pede ajustes ou aprova, e só então " +
                "o código entra.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Deixe para a máquina tudo o que ela consegue checar, e gaste o olhar humano no que só uma pessoa " +
                "enxerga.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É um dos filtros mais baratos de qualidade: um bug encontrado na revisão custa minutos, e o mesmo " +
                "bug em produção custa horas (e clientes). Quem escreve o código está próximo demais dele para ver " +
                "certas falhas — outra pessoa enxerga suposições não ditas, casos esquecidos e trechos confusos. " +
                "Além de achar defeitos, a revisão espalha conhecimento (mais gente entende cada parte do " +
                "sistema), mantém convenções consistentes e é uma forma natural de mentoria em ambos os sentidos.",
            },
            {
              type: "paragraph",
              text:
                "O que a revisão não é: uma caça a culpados nem um substituto para testes automatizados e " +
                "ferramentas. O que uma máquina pode verificar (formatação, lint, testes) deve ser automatizado, para " +
                "que o tempo humano vá para o que só pessoas conseguem avaliar: se a solução resolve o problema " +
                "certo, se o desenho faz sentido, se há casos que ninguém pensou. Há responsabilidades dos dois " +
                "lados: o autor entrega uma mudança pequena, revisada por ele mesmo primeiro e bem descrita; o " +
                "revisor responde em tempo razoável e comenta com foco no código, não na pessoa.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um trecho em revisão e o comentário que evita um bug antes do merge:" },
            {
              type: "code",
              language: "javascript",
              filename: "pr-under-review.js",
              code: [
                "// PR: \"mostra os 10 pedidos mais recentes do cliente\"",
                "function latestOrders(orders) {",
                "  const sorted = orders.sort((a, b) => b.createdAt - a.createdAt);",
                "  return sorted.slice(0, 10);",
                "}",
              ].join("\n"),
            },
            {
              type: "code",
              language: "text",
              filename: "review-comment.txt",
              code: [
                "[revisor] Linha 3: `sort` ordena o array original no lugar. Como `orders` vem do estado",
                "compartilhado da tela, isso muda a ordem de outras telas que usam a mesma lista.",
                "Sugestão: `[...orders].sort(...)` para ordenar uma cópia.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O código funcionava nos testes do autor e passaria em uma leitura rápida. Uma segunda pessoa, " +
                "conhecendo o contexto (de onde vem a lista), encontrou o efeito colateral antes de chegar à " +
                "produção — o tipo de bug que a revisão existe para pegar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Antes de a mudança entrar na base principal, para achar problemas cedo e compartilhar conhecimento.",
                "Quando o autor prepara a revisão com uma boa descrição e uma leitura prévia do próprio diff.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O olhar humano não deve gastar tempo com o mecânico (espaços, ponto e vírgula): formatação e lint pertencem " +
                "ao CI.",
                "Sem descrição nem contexto, o revisor precisa deduzir a intenção lendo cada linha do diff.",
              ],
            },
          ],
          examples: [
            {
              title: "Um bug que só uma segunda leitura enxerga",
              context: "O autor testa o caminho que imaginou; o revisor questiona o que ficou fora dele.",
              code: {
                language: "javascript",
                filename: "edge-case.js",
                code: [
                  "function averageRating(reviews) {",
                  "  const total = reviews.reduce((sum, review) => sum + review.stars, 0);",
                  "  return total / reviews.length;",
                  "}",
                  "// Comentário do revisor: e se o produto ainda não tiver avaliações?",
                  "// reviews.length é 0 → o resultado é NaN, e a tela mostraria \"NaN estrelas\".",
                ].join("\n"),
              },
              explanation:
                "O autor provavelmente testou com produtos que tinham avaliações. Uma pergunta simples — \"e se " +
                "estiver vazio?\" — revela o caso esquecido antes que um usuário o encontre.",
            },
            {
              title: "Automatizar o mecânico para revisar o essencial",
              context: "Se a revisão gasta tempo com espaços e ponto e vírgula, sobra pouco para o que importa.",
              code: {
                language: "javascript",
                filename: "lint-config.js",
                code: [
                  "// Regras verificadas por ferramenta no CI — não precisam de comentário humano",
                  "const lintConfig = {",
                  "  rules: {",
                  "    \"no-unused-vars\": \"error\",",
                  "    \"eqeqeq\": \"error\",",
                  "    \"prefer-const\": \"warn\",",
                  "  },",
                  "};",
                  "// Formatação: um formatador automático (ex.: Prettier) decide, ninguém discute.",
                ].join("\n"),
              },
              explanation:
                "Com formatação e lint no CI, a revisão humana pode se concentrar em desenho, lógica e casos " +
                "de borda. Comentários como \"faltou um espaço aqui\" são um sinal de que algo deveria estar automatizado.",
            },
            {
              title: "O autor prepara a revisão",
              context: "Uma boa descrição e uma leitura prévia do próprio diff poupam o tempo de todos.",
              code: {
                language: "text",
                filename: "pr-description.md",
                code: [
                  "## O que muda",
                  "Limita a lista de pedidos a 10 itens na tela inicial.",
                  "",
                  "## Por que",
                  "A tela demora 4s com clientes de mais de 500 pedidos (issue #231).",
                  "",
                  "## Como testar",
                  "Abrir a tela com o cliente de teste \"big-customer\" e conferir que carrega em menos de 1s.",
                  "",
                  "## Atenção",
                  "A ordenação agora é feita no banco; a função antiga `sortOrders` foi removida.",
                ].join("\n"),
              },
              explanation:
                "O revisor sabe o que esperar, por que a mudança existe e como verificá-la, e onde olhar com mais " +
                "cuidado. Sem isso, ele precisa deduzir a intenção lendo cada linha do diff.",
            },
          ],
          exercise: {
            problem:
              "Você foi convidado a revisar o trecho abaixo, que faz parte de um PR intitulado \"adiciona filtro " +
              "de produtos por categoria\". Há um problema real, uma melhoria de legibilidade e um detalhe de " +
              "estilo.",
            problemCode: {
              language: "javascript",
              filename: "filter-products.js",
              code: [
                "function filterProducts(products, cat) {",
                "  const result = products;",
                "  result.forEach((p, i) => {",
                "    if (p.category != cat) result.splice(i, 1);",
                "  })",
                "  return result",
                "}",
              ].join("\n"),
            },
            task:
              "Escreva os comentários de revisão que você deixaria, indicando qual é bloqueante (precisa ser " +
              "corrigido antes do merge), qual é uma sugestão e qual é só um detalhe de estilo.",
            hint: "Repare no que acontece com o array original e com os índices ao remover elementos durante o laço.",
            solution: {
              code: {
                language: "text",
                filename: "review-comments.txt",
                code: [
                  "[bloqueante] Linhas 2–4: `result` aponta para o mesmo array de `products`, e `splice` dentro do",
                  "`forEach` altera o array enquanto ele é percorrido — elementos são pulados e a lista original",
                  "do chamador é modificada. Sugestão: `return products.filter((p) => p.category === category)`.",
                  "",
                  "[sugestão] `cat` e `p` são difíceis de ler; `category` e `product` deixariam a função clara.",
                  "",
                  "[nit] Faltam ponto e vírgula nas linhas 5 e 6 (o lint do projeto poderia checar isso).",
                ].join("\n"),
              },
              explanation:
                "O primeiro comentário é bloqueante porque a função produz resultados errados e altera dados do " +
                "chamador. Os outros dois melhoram a qualidade sem impedir o merge. Marcar a severidade deixa " +
                "claro para o autor onde concentrar o esforço.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Review Dimensions",
          requires: ["Code Review"],
          note: "consolida 5 Tasks do rascunho original (\"Review for Correctness/Readability/Maintainability/Testability/Security\") — revisita Testing & Quality Engineering / Testing Strategy / Testability (uma das lentes)",
          subtopics: ["Correctness", "Readability", "Maintainability", "Testability", "Security"],
          collision: "≠ Testability (Testing & Quality Engineering / Testing Strategy) — uma lente de revisão × a propriedade em si",
          summary:
            "Review Dimensions são as lentes usadas para avaliar uma mudança: correção, legibilidade, " +
            "manutenibilidade, testabilidade e segurança.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ao revisar, é fácil se prender ao que salta aos olhos (um nome estranho, uma linha longa) e perder " +
                "problemas mais importantes. As lentes ajudam a percorrer a mudança de forma sistemática: Correctness " +
                "(faz o que deveria?), Readability (dá para entender?), Maintainability (é fácil de mudar depois?), " +
                "Testability (dá para verificar?) e Security (abre alguma brecha?).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "O problema mais grave de uma mudança raramente é o que chama atenção primeiro.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Cada lente faz uma pergunta diferente, e cada uma encontra problemas que as outras deixam passar. Uma " +
                "função pode estar perfeitamente legível e ainda calcular o valor errado; pode estar correta e " +
                "impossível de testar; pode ser testável e ter uma injeção de SQL. Passar pelas dimensões, mesmo que " +
                "de forma rápida, reduz a chance de aprovar algo por ter \"cara de bom\".",
            },
            {
              type: "paragraph",
              text:
                "Perguntas-guia: Correctness — trata os casos de borda, a lógica cobre o requisito? Readability — " +
                "nomes e estrutura comunicam a intenção? Maintainability — mudar isso no futuro exigirá alterar " +
                "muitos lugares, há duplicação, acoplamento? Testability — existem testes que cobrem o " +
                "comportamento novo, o código permite ser testado sem grandes montagens? Security — a entrada é " +
                "validada, há dados sensíveis expostos, as permissões são checadas? Atenção: aqui Testability é " +
                "uma lente de avaliação da mudança; a propriedade Testability em si é assunto do módulo Testing " +
                "Strategy.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função pequena e um problema encontrado em cada lente:" },
            {
              type: "code",
              language: "javascript",
              filename: "review-dimensions.js",
              code: [
                "function getUserOrders(req) {",
                "  const rows = db.query(\"SELECT * FROM orders WHERE user_id = \" + req.query.id);",
                "  let t = 0;",
                "  for (const r of rows) t += r.total;",
                "  return { t, rows };",
                "}",
                "",
                "// Security:        SQL montado por concatenação → injeção de SQL; e nada checa se",
                "//                  o usuário logado pode ver os pedidos de req.query.id.",
                "// Correctness:     `db.query` provavelmente é assíncrono — falta um await.",
                "// Readability:     `t`, `r`: o que são? `total` e `order` dariam o significado.",
                "// Maintainability: SELECT * acopla o código ao formato da tabela; a soma poderia ser",
                "//                  uma função própria.",
                "// Testability:     a função depende diretamente do `db` global, então não dá para",
                "//                  testá-la sem um banco real.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cinco lentes, cinco tipos de achado em seis linhas. Uma leitura sem método provavelmente pararia nos " +
                "nomes ruins e deixaria passar a injeção de SQL — o problema mais grave do trecho.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Aprovar porque uma dimensão parecia boa: um código legível e correto ainda pode expor dados de outros usuários.",
                "Na lente de correção, diferenças como `>` e `>=` só aparecem ao comparar com o requisito e pensar nos " +
                "limites e nos vazios.",
                "Testabilidade tem duas perguntas: há testes para esta mudança, e o código permite testá-lo? Ambas são " +
                "comentários legítimos.",
              ],
            },
          ],
          examples: [
            {
              title: "Lente de correção: os casos de borda",
              context: "A pergunta é se o código faz o certo em todos os casos — inclusive os limites e os vazios.",
              code: {
                language: "javascript",
                filename: "correctness-lens.js",
                code: [
                  "// Regra: \"frete grátis para pedidos a partir de R$ 200\"",
                  "function hasFreeShipping(order) {",
                  "  return order.total > 200;",
                  "}",
                  "// Revisor: o requisito diz \"a partir de\" — um pedido de exatamente R$ 200 deveria ter",
                  "// frete grátis. Falta o >=. Vale um teste na fronteira (199,99 / 200 / 200,01).",
                ].join("\n"),
              },
              explanation:
                "O código parece correto à primeira vista, e a diferença entre > e >= só aparece quando se " +
                "compara com o requisito e se pensa no valor exato do limite.",
            },
            {
              title: "Lente de segurança: entrada e permissão",
              context: "Toda entrada externa é suspeita, e toda operação sobre dados de alguém precisa checar quem pediu.",
              code: {
                language: "javascript",
                filename: "security-lens.js",
                code: [
                  "app.get(\"/invoices/:id\", async (req, res) => {",
                  "  const invoice = await db.invoices.find(req.params.id);",
                  "  res.json(invoice);",
                  "});",
                  "// Revisor: qualquer usuário autenticado pode ler qualquer fatura só trocando o id na URL.",
                  "// Falta checar se `invoice.userId === req.user.id` (ou se o usuário é administrador).",
                ].join("\n"),
              },
              explanation:
                "O código funciona e é legível, mas expõe dados de outros usuários. Esse é o tipo de falha que " +
                "só aparece quando a revisão pergunta explicitamente \"quem pode chamar isso e sobre quais dados?\".",
            },
            {
              title: "Lente de testabilidade da mudança",
              context: "Aqui a pergunta é se esta mudança vem acompanhada de testes adequados e se pode ser verificada com facilidade.",
              code: {
                language: "javascript",
                filename: "testability-lens.js",
                code: [
                  "function isOfferValid(offer) {",
                  "  return offer.expiresAt > new Date();   // depende do relógio real",
                  "}",
                  "// Revisor: o resultado muda conforme a hora em que o teste roda. Sugiro receber a data",
                  "// atual como parâmetro (`isOfferValid(offer, now)`) para testar com datas fixas —",
                  "// e o PR não traz nenhum teste para o novo comportamento.",
                ].join("\n"),
              },
              explanation:
                "A lente de revisão avalia duas coisas: se há testes para a mudança e se o código é escrito de um " +
                "modo que permita testá-lo. Cada uma é um comentário legítimo, mesmo que o código esteja correto hoje.",
            },
          ],
          exercise: {
            problem:
              "Revise a função abaixo, que aplica um cupom de desconto, buscando pelo menos um problema em cada uma " +
              "das cinco lentes.",
            problemCode: {
              language: "javascript",
              filename: "apply-coupon.js",
              code: [
                "async function applyCoupon(userId, code) {",
                "  const coupon = await db.query(`SELECT * FROM coupons WHERE code = '${code}'`);",
                "  if (coupon.used = true) return 0;",
                "  const d = coupon.value * 0.1;",
                "  return d;",
                "}",
              ].join("\n"),
            },
            task:
              "Liste um achado para cada dimensão (correção, legibilidade, manutenibilidade, testabilidade e " +
              "segurança), com uma frase explicando o problema.",
            hint: "Procure a atribuição no lugar de comparação, o SQL montado com texto do usuário, o número solto 0.1 e a dependência direta do banco.",
            solution: {
              code: {
                language: "text",
                filename: "review-findings.txt",
                code: [
                  "Correctness:     `coupon.used = true` é uma atribuição, não uma comparação — o cupom sempre",
                  "                 será marcado como usado e a função retorna 0 para todos. Além disso, não",
                  "                 há tratamento para cupom inexistente (`coupon` undefined).",
                  "Readability:     `d` não diz nada; e o 0.1 parece ser um percentual — quem lê não sabe.",
                  "Maintainability: o percentual 0.1 está fixo no código; deveria ser uma constante nomeada ou",
                  "                 vir do próprio cupom.",
                  "Testability:     a função depende de `db` diretamente; injetar o acesso a dados permitiria",
                  "                 testar sem banco.",
                  "Security:        o SQL é montado com `code` do usuário → injeção de SQL. Usar consulta",
                  "                 parametrizada. Também não se verifica se o cupom pertence ao usuário.",
                ].join("\n"),
              },
              explanation:
                "Cada lente encontrou algo diferente, e os achados de correção e segurança são os bloqueantes. Passar " +
                "por todas as dimensões evita parar no primeiro problema visível (os nomes) e deixar os mais " +
                "graves para trás.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Review Scope",
          requires: ["Code Review"],
          note: "tamanho/foco de um PR — mudanças de propósito único",
          summary: "Review Scope é o tamanho e o foco de uma mudança enviada para revisão.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A regra prática: cada pull request deve ter um único propósito (uma funcionalidade, uma correção, uma " +
                "refatoração) e ser pequeno o bastante para ser lido com atenção em uma sessão — em geral, algumas " +
                "centenas de linhas no máximo, e menos é melhor.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Com uma feature flag, dá para integrar uma funcionalidade grande em PRs pequenos sem ativar nada antes " +
                "da hora.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A qualidade da revisão cai bruscamente com o tamanho. Uma mudança de vinte linhas recebe comentários " +
                "detalhados; uma de dois mil recebe um \"parece ok\", porque ninguém consegue manter tudo na " +
                "cabeça. Mudanças grandes também demoram a ser revisadas, ficam abertas e acumulam conflitos com o " +
                "restante do código, e são mais arriscadas de integrar (e mais difíceis de desfazer se algo der " +
                "errado).",
            },
            {
              type: "paragraph",
              text:
                "Misturar propósitos piora tudo: quando uma funcionalidade nova, uma refatoração e um monte de " +
                "mudanças de formatação vêm no mesmo PR, o revisor não distingue o que muda comportamento do que " +
                "só reorganiza (a ideia dos \"dois chapéus\" do módulo Refactoring). Como dividir: separe " +
                "refatorações preparatórias da funcionalidade, entregue por camadas (dados, lógica, interface), use " +
                "feature flags para integrar código ainda incompleto sem ativá-lo e deixe mudanças automáticas " +
                "de formatação para seu próprio PR.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma funcionalidade grande dividida em PRs pequenos, com o código novo protegido por uma flag:" },
            {
              type: "code",
              language: "javascript",
              filename: "review-scope.js",
              code: [
                "// PR 1: só o modelo de dados (fácil de revisar, sem mudar comportamento)",
                "// PR 2: a lógica nova, escondida atrás de uma feature flag",
                "function checkout(cart, flags) {",
                "  if (flags.newPricingEngine) {",
                "    return calculateWithNewEngine(cart);   // novo, desligado por padrão",
                "  }",
                "  return calculateLegacy(cart);            // comportamento atual, intacto",
                "}",
                "// PR 3: a interface que usa o novo cálculo",
                "// PR 4: liga a flag e remove o código legado",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada PR é pequeno, tem um propósito e pode ser integrado sem quebrar nada, porque o " +
                "comportamento novo só é ativado no final. Em vez de um PR de dois mil linhas, o revisor recebe " +
                "quatro que consegue avaliar de verdade.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Misturar propósitos num mesmo PR impede o revisor de separar o que muda comportamento do que só reorganiza " +
                "ou reformata.",
                "Aproveitar \"de passagem\" para renomear ou arrumar o que não é relacionado esconde a mudança real.",
                "Mudanças grandes recebem revisões mais lentas e superficiais; fatie em passos que funcionem por si só.",
              ],
            },
          ],
          examples: [
            {
              title: "Um PR que mistura três propósitos",
              context: "O revisor não consegue separar o que muda comportamento do que só reorganiza ou reformata.",
              code: {
                language: "text",
                filename: "mixed-pr.txt",
                code: [
                  "PR \"melhorias no checkout\" (1.400 linhas alteradas)",
                  "  - adiciona pagamento por Pix                       ← funcionalidade",
                  "  - reorganiza o módulo de pagamentos em 6 arquivos  ← refatoração",
                  "  - reformata 30 arquivos com o novo Prettier        ← formatação",
                  "",
                  "Dividido:",
                  "  PR 1: formatação automática (revisão rápida: só confirmar que é mecânica)",
                  "  PR 2: reorganização do módulo (sem mudar comportamento; testes iguais)",
                  "  PR 3: pagamento por Pix (agora o diff só mostra a funcionalidade)",
                ].join("\n"),
              },
              explanation:
                "Separados, cada PR pode ser revisado com o foco certo: o primeiro só exige confirmar que é " +
                "mecânico, o segundo que nada mudou de comportamento, e o terceiro que a funcionalidade está correta.",
            },
            {
              title: "Fatiar uma mudança grande em passos revisáveis",
              context: "Uma funcionalidade grande pode entrar aos poucos, cada passo pequeno e seguro por si só.",
              code: {
                language: "javascript",
                filename: "vertical-slices.js",
                code: [
                  "// Objetivo: notificações por e-mail e push",
                  "// PR 1: interface Notifier + implementação de e-mail (com testes)",
                  "class EmailNotifier {",
                  "  send(user, message) { /* ... */ }",
                  "}",
                  "// PR 2: implementação de push, mesma interface",
                  "// PR 3: escolha do canal por preferência do usuário",
                  "// Cada passo compila, passa nos testes e pode ir para produção sozinho.",
                ].join("\n"),
              },
              explanation:
                "Cada entrega é pequena, funciona por si só e permite feedback cedo. Se a abordagem estiver errada, " +
                "descobre-se no PR 1, não depois de semanas de trabalho.",
            },
            {
              title: "Mudanças \"de passagem\" poluem o diff",
              context: "Aproveitar para renomear ou arrumar coisas não relacionadas esconde a mudança real.",
              code: {
                language: "text",
                filename: "drive-by-changes.txt",
                code: [
                  "PR \"corrige cálculo de frete\" (diff de 12 arquivos)",
                  "  shipping.js       ← a correção (3 linhas)",
                  "  11 outros arquivos ← renomeações e limpezas \"que encontrei pelo caminho\"",
                  "",
                  "O revisor gasta o tempo verificando renomeações e pode deixar passar",
                  "justamente as 3 linhas que importam.",
                  "",
                  "Melhor: a correção em um PR pequeno; as limpezas, em outro.",
                ].join("\n"),
              },
              explanation:
                "O tamanho do diff não é a medida de esforço da revisão — o ruído é. Manter cada PR focado " +
                "faz com que o revisor gaste a atenção onde ela é necessária.",
            },
          ],
          exercise: {
            problem:
              "Uma pessoa da equipe abriu um único PR com a lista de alterações abaixo, e o revisor pediu que " +
              "ele fosse dividido.",
            problemCode: {
              language: "text",
              filename: "big-pr.txt",
              code: [
                "PR \"módulo de relatórios\" — 2.100 linhas",
                "  1. Renomeia 40 funções para o novo padrão de nomes",
                "  2. Corrige um bug no cálculo de totais mensais (5 linhas)",
                "  3. Adiciona exportação de relatórios em CSV (novo)",
                "  4. Atualiza a biblioteca de gráficos para a versão 5",
                "  5. Reformata todos os arquivos do módulo",
              ].join("\n"),
            },
            task:
              "Proponha uma divisão em PRs menores, cada um com um único propósito, e indique a ordem em que " +
              "deveriam ser integrados e por quê.",
            hint: "Comece pelo que é mecânico e de baixo risco, coloque a correção de bug em um PR isolado (para poder ser aplicada rápido) e deixe a funcionalidade nova por último.",
            solution: {
              code: {
                language: "text",
                filename: "split-plan.txt",
                code: [
                  "PR 1 — Reformatação dos arquivos do módulo (mecânica; revisão rápida)",
                  "PR 2 — Correção do bug de totais mensais (5 linhas; pode ir para produção logo)",
                  "PR 3 — Renomeação das 40 funções (sem mudar comportamento; testes existentes iguais)",
                  "PR 4 — Atualização da biblioteca de gráficos (isolada, para facilitar reverter)",
                  "PR 5 — Exportação em CSV (a funcionalidade, sobre uma base já limpa)",
                ].join("\n"),
              },
              explanation:
                "A correção do bug ficou isolada para ser entregue sem esperar o resto. As mudanças mecânicas vêm " +
                "primeiro para não poluírem os diffs seguintes, a atualização da biblioteca fica sozinha (se " +
                "quebrar algo, reverte-se só ela) e a funcionalidade nova vem por último, com um diff limpo.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Giving & Receiving Feedback",
          requires: ["Code Review"],
          note: "camada de comunicação/soft-skill",
          summary: "Giving & Receiving Feedback é a forma de comentar e de responder numa revisão de código.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma revisão é uma conversa entre pessoas, e a forma como o feedback é dado e recebido decide se ela " +
                "melhora o código e o time — ou gera atrito. É a camada de comunicação da revisão: o que dizer, como " +
                "dizer, e como reagir ao que se ouve.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um bom comentário diz o que incomoda, por que incomoda e qual caminho você sugere.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O mesmo achado técnico pode ser comunicado de um jeito que ensina (\"esse laço altera a lista " +
                "original; que tal filter?\") ou de um jeito que humilha (\"você não sabe o que é imutabilidade?\"). " +
                "O segundo pode até estar certo, mas faz a pessoa se defender em vez de aprender, e com o tempo " +
                "as pessoas passam a evitar revisões ou a esconder dúvidas. Um time em que feedback é seguro " +
                "encontra mais problemas, porque as pessoas se expõem sem medo.",
            },
            {
              type: "paragraph",
              text:
                "Para quem revisa: comente o código, não a pessoa (\"este trecho\", não \"você\"); seja específico e " +
                "acionável; explique o porquê; prefira perguntas e sugestões a ordens quando houver mais de " +
                "um caminho; marque a severidade (bloqueante, sugestão, nit) e reconheça o que ficou bom. Para " +
                "quem recebe: assuma boa-fé, responda a cada comentário (corrigiu, discorda com razões, ou pediu " +
                "esclarecimento), não trate crítica ao código como crítica pessoal e agradeça. Em impasses, " +
                "uma conversa rápida resolve o que dez comentários não resolvem.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o mesmo achado, comunicado de forma dura e de forma construtiva:" },
            {
              type: "code",
              language: "javascript",
              filename: "code-under-review.js",
              code: [
                "const d = items.filter((i) => i.a).map((i) => i.p);",
              ].join("\n"),
            },
            {
              type: "code",
              language: "text",
              filename: "feedback.txt",
              code: [
                "Duro:",
                "  \"Que nomes horríveis. Ninguém entende isso. Refaça.\"",
                "",
                "Construtivo:",
                "  \"[sugestão] `d`, `i`, `a` e `p` me obrigam a decifrar o que cada um guarda. Nomes como",
                "   `activePrices`, `item.isActive` e `item.price` deixariam a intenção óbvia — assim quem ler",
                "   depois (inclusive nós, em três meses) entende de relance. Faz sentido?\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Os dois apontam o mesmo problema, mas o segundo diz o que exatamente incomoda, sugere um " +
                "caminho, explica o motivo, marca que é uma sugestão e convida a uma conversa. É o que faz o autor " +
                "querer corrigir, em vez de se defender.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Comentários sem severidade deixam o autor sem saber o que bloqueia o merge e o que é só opinião.",
                "Uma ordem fecha a conversa; quando há mais de um caminho razoável, uma pergunta abre espaço para uma razão " +
                "que o revisor não viu.",
                "Como autor, responder com defesa em vez de dados e abertura transforma a revisão em confronto.",
              ],
            },
          ],
          examples: [
            {
              title: "Marcar a severidade dos comentários",
              context: "Sem marcação, o autor não sabe o que precisa mudar antes do merge e o que é só uma opinião.",
              code: {
                language: "text",
                filename: "severity-labels.txt",
                code: [
                  "[bloqueante] Esta consulta não filtra por usuário: qualquer pessoa consegue ver dados alheios.",
                  "[sugestão]   Extrair esse bloco para uma função (`calculateDiscount`) deixaria o fluxo mais legível.",
                  "[nit]        Falta uma linha em branco antes do `return` (não precisa corrigir agora).",
                  "[pergunta]   Por que usamos 30 dias aqui? Existe uma regra de negócio por trás desse número?",
                  "[elogio]     Gostei da separação entre validação e gravação — ficou bem fácil de acompanhar.",
                ].join("\n"),
              },
              explanation:
                "Com os rótulos, o autor prioriza sem adivinhar: começa pelos bloqueantes, decide sobre as " +
                "sugestões, e sabe que os nits podem esperar. O elogio importa: reforça o que fazer de novo.",
            },
            {
              title: "Do comando para a pergunta",
              context: "Quando há mais de um caminho razoável, uma pergunta abre a conversa; uma ordem a fecha.",
              code: {
                language: "text",
                filename: "question-vs-order.txt",
                code: [
                  "Ordem:    \"Troque esse for por map.\"",
                  "",
                  "Pergunta: \"Esse laço só transforma cada item — `map` seria mais direto? Se você preferiu o",
                  "           `for` por algum motivo (desempenho, legibilidade), me conta que eu aprendo.\"",
                ].join("\n"),
              },
              explanation:
                "Às vezes o autor tem uma razão que o revisor não viu. A pergunta permite descobrir isso sem " +
                "confronto — e, se a sugestão for boa, o autor a adota por convicção, não por obrigação.",
            },
            {
              title: "Responder como autor",
              context: "Receber feedback também é uma habilidade: a resposta mostra o que foi feito e o que não.",
              code: {
                language: "text",
                filename: "author-replies.txt",
                code: [
                  "Aceito:        \"Boa pegada, corrigi em a1b2c3d e adicionei um teste para esse caso.\"",
                  "Discordância:  \"Entendo o ponto, mas prefiro manter assim porque essa função é chamada em",
                  "               loop crítico e o `for` evita uma alocação (medi: 40% mais rápido). Coloquei",
                  "               um comentário explicando o motivo. Te parece razoável?\"",
                  "Dúvida:        \"Não entendi bem a sugestão — você quer mover a validação para o controller",
                  "               ou para o serviço? Um exemplo ajudaria.\"",
                ].join("\n"),
              },
              explanation:
                "Cada resposta fecha um ciclo: mostra que o comentário foi lido, o que foi decidido e por quê. A " +
                "discordância vem com dados e uma abertura para o revisor, não com defesa.",
            },
          ],
          exercise: {
            problem:
              "Estes três comentários de revisão são tecnicamente corretos, mas foram escritos de um jeito que " +
              "tende a gerar atrito.",
            problemCode: {
              language: "text",
              filename: "harsh-comments.txt",
              code: [
                "1. \"Você esqueceu de tratar o caso de lista vazia. Isso é básico.\"",
                "2. \"Esse código está uma bagunça.\"",
                "3. \"Por que você fez isso desse jeito? Está errado.\"",
              ].join("\n"),
            },
            task:
              "Reescreva os três comentários de forma construtiva: focados no código, específicos, com o porquê e " +
              "com a severidade indicada.",
            hint: "Troque \"você\" por \"este trecho\", diga exatamente o que acontece (e onde), sugira um caminho e marque se bloqueia ou não.",
            solution: {
              code: {
                language: "text",
                filename: "constructive-comments.txt",
                code: [
                  "1. \"[bloqueante] Se `items` vier vazio, `items[0].price` lança um erro na linha 12. Que tal",
                  "    retornar cedo com `if (items.length === 0) return 0;`? Vale um teste para esse caso.\"",
                  "",
                  "2. \"[sugestão] A função `process` faz validação, cálculo e gravação, o que dificulta testar cada",
                  "    parte. Separar em três funções pequenas ajudaria. Posso ajudar com isso, se quiser.\"",
                  "",
                  "3. \"[pergunta] Não entendi por que o cálculo foi feito no cliente em vez de no servidor.",
                  "    Se for por desempenho, um comentário explicando ajuda quem ler depois. Se não, pode ser",
                  "    mais seguro fazê-lo no servidor, porque o cliente pode alterar o valor.\"",
                ].join("\n"),
              },
              explanation:
                "Os três comentários agora apontam onde está o problema, dizem por que importa e oferecem um caminho, " +
                "sem julgar a pessoa. O terceiro virou uma pergunta, porque o revisor não sabe se havia uma razão " +
                "válida — e assim deixa espaço para descobri-la.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "dependency-version-management",
      order: 70,
      title: "Dependency & Version Management",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Custo de atalhos (Technical Debt) e código de risco (Legacy Code) → comunicar mudança com segurança " +
        "(SemVer, Backward Compatibility, Deprecation) → gerenciar dependências de terceiros → migrar com segurança.",
      concepts: [
        concept({
          order: 10,
          title: "Technical Debt",
          note: "custo de atalhos — framing da Story",
          summary: "Technical Debt é o custo futuro dos atalhos e das decisões de projeto que aceleram a entrega hoje.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "É uma metáfora financeira: escolher uma solução rápida e imperfeita agora é como tomar um empréstimo — " +
                "você ganha velocidade hoje e passa a pagar juros depois, na forma de mudanças mais lentas, mais bugs e " +
                "mais medo de mexer no código. O principal é o custo de corrigir o atalho; os juros são o custo extra " +
                "pago a cada vez que se trabalha perto dele enquanto ele existe.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Tomar dívida pode ser uma boa decisão, desde que seja consciente, registrada e com um plano para pagar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Toda equipe faz concessões: prazos, requisitos que mudam, informação incompleta. Nomear isso como " +
                "dívida ajuda a conversar sobre custos que, sem o nome, ficam invisíveis para quem não escreve " +
                "código. A metáfora também ensina que dívida não é sempre ruim: um atalho consciente para " +
                "validar uma ideia, com plano de pagamento, pode ser uma decisão boa — assim como um empréstimo " +
                "planejado. O problema é a dívida que ninguém enxerga nem acompanha.",
            },
            {
              type: "paragraph",
              text:
                "Uma distinção útil é entre dívida deliberada (\"sabemos que é um atalho e vamos pagar depois\") e " +
                "inadvertida (\"só descobrimos com o tempo que o desenho era ruim\"), e entre prudente e imprudente. " +
                "Dívida imprudente — atalhos por descuido ou por não querer aprender — é apenas código ruim. Como " +
                "gerenciar: registrar a dívida onde o time vê (com contexto, não só um TODO vago), pagar aos " +
                "poucos junto com o trabalho normal (refatorar o que se toca) e decidir de forma consciente " +
                "quando aceitar mais.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um atalho deliberado, registrado com o contexto necessário para ser pago:" },
            {
              type: "code",
              language: "javascript",
              filename: "technical-debt.js",
              code: [
                "// DÍVIDA TÉCNICA (deliberada) — issue #482",
                "// Contexto: para lançar antes da feira, as taxas de frete estão fixas no código.",
                "// Juros: cada mudança de tabela exige um deploy.",
                "// Plano: mover para o banco/config após o lançamento (estimativa: 2 dias).",
                "const SHIPPING_RATES = { sul: 25, sudeste: 18, norte: 42 };",
                "",
                "function shippingFor(region) {",
                "  if (!(region in SHIPPING_RATES)) throw new Error(`região desconhecida: ${region}`);",
                "  return SHIPPING_RATES[region];",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O atalho existe por um motivo conhecido, o custo está descrito e há um plano para pagar. Isso é " +
                "muito diferente de um valor fixo esquecido no código, do qual ninguém se lembra e que vai " +
                "aparecer como surpresa quando as taxas mudarem.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Dívida invisível, sem registro nem plano, é a que cobra os juros mais altos.",
                "Nem toda dívida é falha de alguém: a prudente e deliberada é uma ferramenta, a inadvertida é o preço de " +
                "aprender.",
                "Esperar uma pausa para \"pagar a dívida\" raramente funciona; pequenos pagamentos no trabalho de rotina " +
                "impedem que ela cresça.",
              ],
            },
          ],
          examples: [
            {
              title: "Os juros: o custo aparece a cada mudança",
              context: "A dívida cobra um pouco cada vez que se mexe perto dela — e é isso que a torna cara ao longo do tempo.",
              code: {
                language: "javascript",
                filename: "interest.js",
                code: [
                  "// Atalho: a regra de imposto foi copiada em três lugares",
                  "const invoiceTax = (amount) => amount * 0.12;",
                  "const quoteTax   = (amount) => amount * 0.12;",
                  "const reportTax  = (amount) => amount * 0.12;",
                  "",
                  "// A alíquota muda para 15%: é preciso achar e alterar os três.",
                  "// Esquecer um deles gera inconsistência entre fatura, cotação e relatório.",
                  "// A cada mudança futura na regra, o mesmo custo extra é pago de novo.",
                ].join("\n"),
              },
              explanation:
                "Pagar o principal (centralizar a regra em uma função) custa meia hora hoje. Não pagar significa " +
                "gastar esse tempo, com risco de erro, em cada mudança daqui para frente.",
            },
            {
              title: "Deliberada versus inadvertida",
              context: "Saber como a dívida nasceu ajuda a decidir o que fazer com ela.",
              code: {
                language: "text",
                filename: "debt-quadrants.txt",
                code: [
                  "Deliberada + prudente:   \"Vamos lançar sem cache agora e otimizar depois de medir.\"",
                  "                          → OK, se registrada e com plano.",
                  "Deliberada + imprudente: \"Não temos tempo para testes.\"",
                  "                          → dívida cara; decisão que precisa ser revista.",
                  "Inadvertida + prudente:  \"Agora que entendemos o domínio, o desenho ideal era outro.\"",
                  "                          → inevitável; reorganizar conforme se aprende.",
                  "Inadvertida + imprudente: \"O que é um design pattern?\"",
                  "                          → falta de conhecimento; resolve-se com revisão e mentoria.",
                ].join("\n"),
              },
              explanation:
                "Nem toda dívida é falha de alguém. A prudente e deliberada é uma ferramenta; a inadvertida é o " +
                "preço de aprender; a imprudente é a que merece atenção prioritária.",
            },
            {
              title: "Pagar aos poucos, no trabalho do dia a dia",
              context: "Uma equipe raramente consegue parar tudo para \"pagar a dívida\"; o que funciona é pagar continuamente.",
              code: {
                language: "javascript",
                filename: "boy-scout-rule.js",
                code: [
                  "// Tarefa: adicionar um campo ao formulário de cadastro.",
                  "// Ao abrir a função, o time nota que ela mistura validação e gravação.",
                  "",
                  "// Regra do escoteiro: deixe o código um pouco melhor do que encontrou.",
                  "function registerUser(data) {",
                  "  validateUser(data);      // extraído nesta tarefa",
                  "  saveUser(data);          // extraído nesta tarefa",
                  "}",
                  "// A dívida diminuiu um pouco, sem um \"projeto de refatoração\" separado.",
                ].join("\n"),
              },
              explanation:
                "Pequenos pagamentos embutidos no trabalho de rotina impedem que a dívida cresça sem depender de " +
                "uma pausa rara e difícil de negociar. Cada função melhorada torna a próxima mudança mais barata.",
            },
          ],
          exercise: {
            problem:
              "Para cumprir um prazo, alguém escreveu o trecho abaixo. Ele funciona, mas é um atalho: a lista " +
              "de administradores está fixa no código.",
            problemCode: {
              language: "javascript",
              filename: "admins.js",
              code: [
                "function isAdmin(user) {",
                "  return [\"ana@empresa.com\", \"bruno@empresa.com\"].includes(user.email);",
                "}",
              ].join("\n"),
            },
            task:
              "Registre esse atalho como dívida técnica de forma útil: escreva o comentário com contexto, " +
              "o custo (os juros) e um plano de pagamento.",
            hint: "Um bom registro responde: por que foi feito assim? o que custa manter? quando e como será corrigido?",
            solution: {
              code: {
                language: "javascript",
                filename: "admins.debt.js",
                code: [
                  "// DÍVIDA TÉCNICA (deliberada) — issue #517",
                  "// Contexto: lista de administradores fixa no código para entregar o painel antes do prazo.",
                  "// Juros: cada mudança de admin exige alterar o código, revisar e fazer deploy;",
                  "//         e a lista fica exposta no repositório.",
                  "// Plano: ler os papéis do serviço de usuários (campo `role`) — estimativa de 1 dia,",
                  "//         previsto para a sprint seguinte ao lançamento.",
                  "function isAdmin(user) {",
                  "  return [\"ana@empresa.com\", \"bruno@empresa.com\"].includes(user.email);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O comentário deixa de ser um TODO vago e passa a conter o motivo, o custo recorrente e o " +
                "plano. Quem encontrar isso daqui a meses sabe se pode ignorar, quanto custa manter e o que fazer " +
                "para resolver, e o time consegue priorizar o pagamento com informação.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Legacy Code",
          note: "código difícil/arriscado de mudar com segurança, geralmente sem dono claro ou contexto original preservado. A associação de Feathers (\"código legado = código sem testes\") é citada como lente, não como definição universal",
          summary:
            "Legacy Code é código que temos medo de mudar, porque não dá para saber se uma mudança preserva o que ele " +
            "faz.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Não significa simplesmente \"código antigo\". Suas marcas são comportamento pouco claro, poucos ou nenhum " +
                "teste, ausência de quem entenda o porquê de cada decisão e alto risco de quebrar algo ao tocar nele. Uma " +
                "lente conhecida, de Michael Feathers, é \"código legado é código sem testes\" — útil porque sem testes não " +
                "há como saber se uma mudança preservou o comportamento, embora não seja uma definição universal.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Antes de mexer em código legado, registre com testes o que ele faz hoje, mesmo o que parece errado.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Todo código bem-sucedido acaba virando legado: as pessoas que o escreveram saem, os requisitos " +
                "mudam, o contexto se perde, e ele continua sendo usado. Esse código é valioso — ele carrega anos de " +
                "regras de negócio e correções de casos reais que ninguém documentou. Por isso a resposta " +
                "habitual, \"vamos reescrever tudo do zero\", quase sempre é um erro: joga fora esse conhecimento " +
                "embutido e deixa o sistema sem evoluir durante a reescrita.",
            },
            {
              type: "paragraph",
              text:
                "A abordagem realista é evoluir o legado com segurança: primeiro criar uma rede de proteção " +
                "(testes de caracterização que registram o comportamento atual), depois abrir costuras (seams) — " +
                "pontos onde é possível trocar uma dependência para testar em isolamento — e então mudar em " +
                "passos pequenos, escrevendo o código novo de forma testável ao lado do antigo. A técnica de fazer " +
                "isso de forma gradual é o tema de Incremental Migration.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função legada difícil de testar, e uma costura que a torna testável sem mudar o comportamento:" },
            {
              type: "code",
              language: "javascript",
              filename: "legacy-code.js",
              code: [
                "// Antes: depende do banco e do relógio reais — impossível testar de forma isolada",
                "function isSubscriptionActive(userId) {",
                "  const sub = db.query(\"SELECT expires_at FROM subs WHERE user_id = \" + userId);",
                "  return sub.expires_at > Date.now();",
                "}",
                "",
                "// Depois: as dependências ganharam parâmetros com o mesmo padrão de antes",
                "function isSubscriptionActive(userId, { database = db, now = Date.now } = {}) {",
                "  const sub = database.query(\"SELECT expires_at FROM subs WHERE user_id = \" + userId);",
                "  return sub.expires_at > now();",
                "}",
                "",
                "// Um teste agora controla o banco e a data:",
                "const fakeDb = { query: () => ({ expires_at: 2000 }) };",
                "isSubscriptionActive(7, { database: fakeDb, now: () => 1000 }); // true",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Todos os chamadores atuais continuam funcionando (os padrões reproduzem o comportamento antigo), e " +
                "a função passou a ter uma costura para ser testada. É uma mudança mínima, segura, que abre " +
                "a porta para refatorar depois.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Reescrever do zero costuma perder conhecimento embutido e demorar mais do que o previsto.",
                "Há exceções em que reescrever é a decisão certa, como tecnologia sem suporte ou sistema pequeno.",
                "Não jogue o legado fora: ele é o que faz o sistema funcionar hoje; proteja-o com testes e evolua em passos " +
                "pequenos.",
              ],
            },
          ],
          examples: [
            {
              title: "Sprout: código novo, testável, ao lado do antigo",
              context: "Quando não dá para testar a função legada inteira, escreva a lógica nova em uma função separada e testada, e chame-a de lá.",
              code: {
                language: "javascript",
                filename: "sprout.js",
                code: [
                  "// Nova regra: aplicar desconto de fidelidade em uma função de 300 linhas, sem testes.",
                  "// Em vez de editar no meio dela, brota uma função nova e testável:",
                  "function loyaltyDiscount(customer, total) {",
                  "  return customer.years >= 3 ? total * 0.05 : 0;",
                  "}",
                  "",
                  "function processOrder(order) {",
                  "  // ... 300 linhas de código legado ...",
                  "  const discount = loyaltyDiscount(order.customer, order.total); // única linha nova",
                  "  // ...",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A regra nova nasce coberta por testes, e a mudança no código legado se resume a uma linha. O " +
                "risco de quebrar o restante é mínimo, e o novo código não herda a dificuldade do antigo.",
            },
            {
              title: "Reescrever do zero versus evoluir",
              context: "A reescrita completa parece limpa, mas costuma perder conhecimento embutido e demorar mais do que o previsto.",
              code: {
                language: "text",
                filename: "rewrite-vs-evolve.txt",
                code: [
                  "Reescrita total:",
                  "  + código \"limpo\" e moderno",
                  "  - meses (ou anos) sem entregar valor ao usuário",
                  "  - perde correções de casos reais que estavam no código antigo",
                  "  - o sistema antigo continua evoluindo e o novo nunca o alcança",
                  "",
                  "Evolução incremental:",
                  "  + entrega valor o tempo todo",
                  "  + cada passo é pequeno e reversível",
                  "  + o conhecimento do código antigo é preservado enquanto é substituído",
                ].join("\n"),
              },
              explanation:
                "Existem casos em que reescrever é a decisão certa (tecnologia sem suporte, sistema pequeno), " +
                "mas o padrão é o oposto: a evolução gradual é o caminho mais seguro e mais previsível.",
            },
            {
              title: "Documentar o que se descobre",
              context: "Cada vez que se entende um trecho legado, esse entendimento deve ficar registrado — em testes e em comentários.",
              code: {
                language: "javascript",
                filename: "document-discoveries.js",
                code: [
                  "// DESCOBERTA: pedidos com total negativo (estornos) devem ser ignorados aqui —",
                  "// sem esse filtro, o relatório de receita mensal fica com valores incorretos.",
                  "function monthlyRevenue(orders) {",
                  "  return orders",
                  "    .filter((order) => order.total > 0)",
                  "    .reduce((sum, order) => sum + order.total, 0);",
                  "}",
                  "",
                  "// E um teste que fixa essa regra, para não se perder de novo:",
                  "// monthlyRevenue([{ total: 100 }, { total: -30 }]) === 100",
                ].join("\n"),
              },
              explanation:
                "O conhecimento que estava só na cabeça de alguém (e foi perdido) agora está no código e num teste. " +
                "Aos poucos, o legado deixa de ser um mistério.",
            },
          ],
          exercise: {
            problem:
              "Você precisa alterar a função abaixo, que não tem testes e depende do relógio real e de uma " +
              "função global de envio de e-mail.",
            problemCode: {
              language: "javascript",
              filename: "send-reminder.js",
              code: [
                "function sendReminderIfDue(invoice) {",
                "  const today = new Date();",
                "  if (invoice.dueDate < today && !invoice.paid) {",
                "    sendEmail(invoice.customerEmail, \"Fatura vencida\");",
                "    return true;",
                "  }",
                "  return false;",
                "}",
              ].join("\n"),
            },
            task:
              "Abra uma costura: modifique a função para receber a data e o envio de e-mail como dependências " +
              "opcionais, mantendo o comportamento atual para quem já a chama, e mostre um teste com valores " +
              "controlados.",
            hint: "Use um objeto de opções com padrões que reproduzem o comportamento atual (data de hoje e o sendEmail real).",
            solution: {
              code: {
                language: "javascript",
                filename: "send-reminder.seam.js",
                code: [
                  "function sendReminderIfDue(invoice, { now = () => new Date(), send = sendEmail } = {}) {",
                  "  if (invoice.dueDate < now() && !invoice.paid) {",
                  "    send(invoice.customerEmail, \"Fatura vencida\");",
                  "    return true;",
                  "  }",
                  "  return false;",
                  "}",
                  "",
                  "// Teste com data e envio controlados:",
                  "const sent = [];",
                  "const result = sendReminderIfDue(",
                  "  { dueDate: new Date(\"2026-01-01\"), paid: false, customerEmail: \"a@b.com\" },",
                  "  { now: () => new Date(\"2026-02-01\"), send: (to, msg) => sent.push(to) }",
                  ");",
                  "// result === true e sent = [\"a@b.com\"]",
                ].join("\n"),
              },
              explanation:
                "Os chamadores existentes continuam iguais (os padrões são a data real e o sendEmail real), mas " +
                "agora dá para testar a regra com datas fixas e sem enviar e-mails de verdade. Com essa rede, " +
                "a função pode ser refatorada com segurança.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Semantic Versioning",
          note: "MAJOR.MINOR.PATCH e o que cada um comunica",
          summary:
            "Semantic Versioning é a convenção de numerar versões como MAJOR.MINOR.PATCH, em que cada número indica o " +
            "tipo de mudança.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um exemplo é 2.4.1. PATCH sobe em correções de bugs compatíveis; MINOR sobe quando se adiciona " +
                "funcionalidade compatível com a versão anterior; MAJOR sobe quando há mudanças incompatíveis — que podem " +
                "quebrar quem usa. O número é uma promessa do que o software garante em cada atualização.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A parte difícil do SemVer não é somar um ao número, é reconhecer com honestidade o que é uma quebra.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quem depende de uma biblioteca precisa decidir se pode atualizar sem medo. Sem uma convenção, a " +
                "versão 3.7 poderia ser uma correção ou uma reescrita completa — só lendo o código para saber. Com " +
                "SemVer, o número já responde: do 2.4.1 para o 2.4.2 dá para atualizar sem preocupação; para o 2.5.0 " +
                "há novidades, mas nada deve quebrar; para o 3.0.0 é preciso ler as notas e provavelmente adaptar " +
                "o código. É a base sobre a qual funcionam os intervalos de versão do gerenciamento de dependências.",
            },
            {
              type: "paragraph",
              text:
                "Detalhes importantes: SemVer só faz sentido em relação a uma API pública definida — o que conta como " +
                "quebra é a mudança no que os usuários podem usar. Versões 0.y.z são consideradas instáveis (qualquer " +
                "coisa pode mudar). Um sufixo como 1.0.0-beta.1 marca uma pré-versão, anterior à final. E " +
                "sempre que MAJOR sobe, MINOR e PATCH voltam a zero.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função que calcula a próxima versão conforme o tipo de mudança:" },
            {
              type: "code",
              language: "javascript",
              filename: "semantic-versioning.js",
              code: [
                "function nextVersion(version, change) {",
                "  const [major, minor, patch] = version.split(\".\").map(Number);",
                "  if (change === \"breaking\") return `${major + 1}.0.0`;",
                "  if (change === \"feature\") return `${major}.${minor + 1}.0`;",
                "  if (change === \"fix\") return `${major}.${minor}.${patch + 1}`;",
                "  throw new Error(`tipo de mudança desconhecido: ${change}`);",
                "}",
                "",
                "nextVersion(\"2.4.1\", \"fix\");      // \"2.4.2\"",
                "nextVersion(\"2.4.1\", \"feature\");  // \"2.5.0\"  (PATCH volta a zero)",
                "nextVersion(\"2.4.1\", \"breaking\"); // \"3.0.0\"  (MINOR e PATCH voltam a zero)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A regra é simples de aplicar, mas a parte difícil é classificar a mudança corretamente: " +
                "reconhecer o que é uma quebra de compatibilidade (assunto do próximo Concept) é o que dá " +
                "valor ao número.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para comunicar a quem usa a biblioteca o risco de atualizar: MAJOR quebra, MINOR adiciona, PATCH corrige.",
                "O critério é sempre o efeito sobre a API pública: remover ou renomear quebra, acrescentar não quebra.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O número é uma promessa que só vale se a mudança for classificada com honestidade.",
                "Versões `0.y.z` e pré-versões não prometem estabilidade: a API ainda pode mudar a qualquer momento.",
                "Comparar versões como texto falha (\"1.10.0\" fica antes de \"1.9.0\"); compare cada parte como número.",
              ],
            },
          ],
          examples: [
            {
              title: "Classificando mudanças em uma biblioteca",
              context: "A mesma biblioteca, quatro alterações, quatro decisões diferentes de versão a partir de 2.3.1.",
              code: {
                language: "text",
                filename: "classify-changes.txt",
                code: [
                  "Versão atual: 2.3.1",
                  "",
                  "Corrigido um bug de arredondamento em formatPrice()      → PATCH → 2.3.2",
                  "Adicionada a função formatDate() (nova, opcional)        → MINOR → 2.4.0",
                  "Renomeado formatPrice() para formatCurrency()            → MAJOR → 3.0.0",
                  "  (quem chamava formatPrice() deixa de funcionar)",
                  "Melhorado o desempenho interno, mesmo resultado          → PATCH → 2.3.2",
                ].join("\n"),
              },
              explanation:
                "O critério é sempre o efeito sobre quem usa a API pública: remover ou renomear o que já existe " +
                "quebra (MAJOR); acrescentar algo novo não quebra (MINOR); consertar sem mudar o contrato não quebra " +
                "(PATCH).",
            },
            {
              title: "Versões 0.x e pré-versões",
              context: "Nem toda versão promete estabilidade: 0.y.z e sufixos indicam que a API ainda pode mudar.",
              code: {
                language: "text",
                filename: "prerelease.txt",
                code: [
                  "0.9.3          API ainda instável: qualquer versão pode quebrar quem usa",
                  "1.0.0-beta.1   pré-versão da 1.0.0, para testes (menor que 1.0.0)",
                  "1.0.0-rc.1     release candidate: quase final",
                  "1.0.0          a partir daqui, a API pública é uma promessa de compatibilidade",
                ].join("\n"),
              },
              explanation:
                "Chegar à 1.0.0 é uma declaração de que a API está estável. Depender de uma biblioteca 0.x significa " +
                "aceitar que atualizações podem exigir adaptações a qualquer momento.",
            },
            {
              title: "Comparar versões não é comparar texto",
              context: "Um erro comum: tratar versões como strings — \"1.10.0\" parece menor que \"1.9.0\" em ordem alfabética.",
              code: {
                language: "javascript",
                filename: "compare-versions.js",
                code: [
                  "\"1.10.0\" < \"1.9.0\";  // true  ← errado: comparação de texto",
                  "",
                  "function compareVersions(a, b) {",
                  "  const pa = a.split(\".\").map(Number);",
                  "  const pb = b.split(\".\").map(Number);",
                  "  for (let i = 0; i < 3; i++) {",
                  "    if (pa[i] !== pb[i]) return pa[i] - pb[i];",
                  "  }",
                  "  return 0;",
                  "}",
                  "",
                  "compareVersions(\"1.10.0\", \"1.9.0\"); // 1 → 1.10.0 é maior",
                ].join("\n"),
              },
              explanation:
                "Cada parte é um número, comparado separadamente da esquerda para a direita. Por isso a 1.10.0 vem " +
                "depois da 1.9.0 — e por isso bibliotecas de versionamento existem, para tratar os detalhes " +
                "(pré-versões, por exemplo).",
            },
          ],
          exercise: {
            problem:
              "Uma biblioteca de datas está na versão 2.3.1 e recebeu estas alterações em sequência antes do " +
              "próximo lançamento.",
            problemCode: {
              language: "text",
              filename: "changes.txt",
              code: [
                "a) Corrige um bug em que parseDate(\"2026-02-30\") retornava uma data inválida sem avisar.",
                "b) Adiciona a função addBusinessDays() (nova).",
                "c) Remove a função antiga formatLegacy(), que ninguém deveria usar mais.",
                "d) Adiciona um parâmetro opcional `locale` a format() (o comportamento padrão é o mesmo).",
              ].join("\n"),
            },
            task:
              "Diga qual é a próxima versão se todas as alterações forem lançadas juntas, explicando qual delas " +
              "define o número.",
            hint: "Quando há mais de um tipo de mudança, vale a de maior impacto — e a remoção de algo público é sempre uma quebra.",
            solution: {
              code: {
                language: "text",
                filename: "changes.answer.txt",
                code: [
                  "a) PATCH (correção compatível)",
                  "b) MINOR  (funcionalidade nova, compatível)",
                  "c) MAJOR  (remoção de função pública: quebra quem usava)",
                  "d) MINOR  (parâmetro opcional, compatível)",
                  "",
                  "Como há uma mudança MAJOR (c), a próxima versão é 3.0.0.",
                  "As correções e novidades entram nela; MINOR e PATCH voltam a zero.",
                ].join("\n"),
              },
              explanation:
                "A alteração de maior impacto define o número. A remoção de formatLegacy() quebra quem ainda a usa, " +
                "então exige um MAJOR — e é aí que a prática de Deprecation (avisar antes de remover) evita surpresas.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Backward Compatibility",
          requires: ["Semantic Versioning"],
          note: "a propriedade que SemVer protege/comunica",
          summary:
            "Backward Compatibility é a propriedade de uma versão nova continuar funcionando com quem foi feito para " +
            "a anterior, sem exigir alterações.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Vale para software, APIs e formatos de dados. É a propriedade que o SemVer comunica: subir apenas MINOR " +
                "ou PATCH promete compatibilidade; subir MAJOR avisa que ela pode ter sido quebrada.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Acrescentar costuma ser seguro e mudar ou remover costuma quebrar, então evolua uma API pela soma.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quem consome uma API ou biblioteca não controla quando você a atualiza, e muitas vezes você nem sabe " +
                "quem a usa. Uma quebra de compatibilidade obriga todos os consumidores a agir ao mesmo tempo — " +
                "aplicações que funcionavam deixam de funcionar sem terem mudado uma linha. Manter a compatibilidade " +
                "permite evoluir o sistema sem essa coordenação, e é a base da confiança em uma dependência.",
            },
            {
              type: "paragraph",
              text:
                "O que costuma ser compatível: adicionar funções, campos ou parâmetros opcionais com valor padrão. O que " +
                "costuma quebrar: remover ou renomear algo, tornar obrigatório um parâmetro que era opcional, mudar " +
                "o tipo de um valor, ou alterar o significado (o comportamento) de algo existente. Para manter " +
                "compatibilidade: prefira mudanças aditivas, use padrões, ofereça um adaptador para o formato " +
                "antigo e, quando precisar mesmo quebrar, use Deprecation e um novo MAJOR.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma evolução feita de forma compatível e de forma que quebra:" },
            {
              type: "code",
              language: "javascript",
              filename: "backward-compatibility.js",
              code: [
                "// Versão 1: quem usa chama formatPrice(10)",
                "function formatPrice(value) {",
                "  return \"R$ \" + value.toFixed(2);",
                "}",
                "",
                "// Compatível (MINOR): novo parâmetro OPCIONAL, com padrão igual ao comportamento antigo",
                "function formatPrice(value, currency = \"BRL\") {",
                "  return currency === \"BRL\" ? \"R$ \" + value.toFixed(2) : currency + \" \" + value.toFixed(2);",
                "}",
                "formatPrice(10); // continua funcionando, resultado idêntico",
                "",
                "// Quebra (MAJOR): parâmetro novo OBRIGATÓRIO",
                "function formatPrice(value, currency) { /* ... */ }",
                "formatPrice(10); // currency é undefined → comportamento diferente do anterior",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A diferença entre as duas versões é uma linha, mas o efeito em quem já usa a função é oposto: a " +
                "primeira mantém todos os chamadores funcionando; a segunda os quebra silenciosamente.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Adicionar campos só é seguro se os clientes ignoram campos desconhecidos; alterar o tipo de um campo " +
                "existente sempre quebra.",
                "Compatibilidade vale para tudo o que persiste entre versões (arquivos, bancos, mensagens), não só para a " +
                "API do código.",
                "Um nome melhor não justifica quebrar quem usa o antigo: mantenha os dois durante a transição.",
              ],
            },
          ],
          examples: [
            {
              title: "Renomear mantendo o nome antigo",
              context: "Um nome melhor não justifica quebrar quem usa o antigo: mantenha os dois durante a transição.",
              code: {
                language: "javascript",
                filename: "rename-with-alias.js",
                code: [
                  "// Nome novo, mais claro",
                  "function findUserByEmail(email) { /* ... */ }",
                  "",
                  "// Nome antigo continua existindo, delegando para o novo",
                  "function getUser(email) {",
                  "  return findUserByEmail(email);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O código que chama getUser continua funcionando. Quando chegar a hora de remover o nome antigo, isso " +
                "é feito com o processo de Deprecation e em um MAJOR.",
            },
            {
              title: "Campos novos são compatíveis; mudar tipo quebra",
              context: "Em uma resposta de API, adicionar campos raramente quebra clientes; alterar ou remover, quase sempre.",
              code: {
                language: "javascript",
                filename: "response-shapes.js",
                code: [
                  "// v1",
                  "const responseV1 = { id: 7, price: 19.9 };",
                  "",
                  "// Compatível: campo novo adicionado; clientes antigos ignoram o que não conhecem",
                  "const responseV1_1 = { id: 7, price: 19.9, currency: \"BRL\" };",
                  "",
                  "// Quebra: o tipo de `price` mudou de número para objeto",
                  "const responseV2 = { id: 7, price: { amount: 19.9, currency: \"BRL\" } };",
                  "// Um cliente antigo que faz `response.price.toFixed(2)` agora falha.",
                ].join("\n"),
              },
              explanation:
                "Para que a adição seja segura, os clientes devem ignorar campos desconhecidos (o princípio da " +
                "leitura tolerante). Alterar o tipo de um campo existente, porém, sempre quebra quem o usava.",
            },
            {
              title: "Compatibilidade de dados, não só de código",
              context: "Arquivos, bancos e mensagens gravados por uma versão precisam continuar legíveis pela próxima.",
              code: {
                language: "javascript",
                filename: "data-compatibility.js",
                code: [
                  "function loadSettings(saved) {",
                  "  // Versão antiga gravava `dark: true`; a nova grava `theme: \"dark\"`.",
                  "  // Lê os dois formatos, para não invalidar o que os usuários já salvaram.",
                  "  if (\"dark\" in saved) return { theme: saved.dark ? \"dark\" : \"light\" };",
                  "  return { theme: saved.theme ?? \"light\" };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A versão nova entende o formato antigo, então nenhum usuário perde sua configuração ao atualizar. " +
                "Compatibilidade vale para tudo o que persiste entre versões, não apenas para a API do código.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo é usada em dezenas de lugares e agora precisa aceitar um limite de itens por " +
              "página. Você quer fazer isso sem quebrar nenhum chamador existente.",
            problemCode: {
              language: "javascript",
              filename: "list-products.js",
              code: [
                "function listProducts(category) {",
                "  return db.products.filter((product) => product.category === category);",
                "}",
                "",
                "listProducts(\"livros\"); // chamada existente",
              ].join("\n"),
            },
            task:
              "Evolua a função para aceitar um limite opcional, sem alterar o resultado das chamadas existentes, " +
              "e explique por que essa mudança é compatível.",
            hint: "O novo parâmetro precisa ter um padrão que reproduza o comportamento antigo (sem limite).",
            solution: {
              code: {
                language: "javascript",
                filename: "list-products.compatible.js",
                code: [
                  "function listProducts(category, { limit = Infinity } = {}) {",
                  "  return db.products",
                  "    .filter((product) => product.category === category)",
                  "    .slice(0, limit);",
                  "}",
                  "",
                  "listProducts(\"livros\");                // igual a antes",
                  "listProducts(\"livros\", { limit: 10 }); // nova capacidade",
                ].join("\n"),
              },
              explanation:
                "O novo parâmetro é opcional e o padrão (Infinity) devolve tudo, como antes, então nenhum chamador " +
                "existente muda de resultado. É uma mudança aditiva: MINOR, não MAJOR.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Deprecation",
          requires: ["Backward Compatibility"],
          note: "processo de retirar algo preservando compatibilidade",
          summary:
            "Deprecation é marcar algo como obsoleto, ainda funcionando, com o aviso de que será removido e do que " +
            "usar no lugar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "É a etapa intermediária entre \"existe\" e \"foi removido\", e o mecanismo que permite retirar " +
                "funcionalidades sem quebrar a compatibilidade de forma abrupta.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um aviso de obsolescência só ajuda se disser o que usar no lugar, por que e até quando.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nenhuma API cresce só por acréscimos: com o tempo, algumas partes ficam ruins, perigosas ou " +
                "redundantes, e mantê-las para sempre é caro. Mas removê-las de uma vez quebra quem depende " +
                "delas. A deprecation resolve esse conflito dando um prazo: quem usa recebe o aviso, tem " +
                "tempo de migrar, e a remoção só acontece quando o impacto for pequeno — normalmente em um novo MAJOR.",
            },
            {
              type: "paragraph",
              text:
                "Um bom processo tem etapas: (1) anunciar (documentação, changelog, marca @deprecated); (2) indicar " +
                "a alternativa e como migrar; (3) avisar em tempo de execução, sem quebrar (um aviso, de " +
                "preferência uma vez); (4) definir um prazo realista; (5) acompanhar quem ainda usa; (6) remover no " +
                "MAJOR seguinte, comunicando a remoção. Remover sem aviso — ou avisar sem dizer o que fazer — é " +
                "quebrar a confiança de quem depende de você.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função marcada como obsoleta, que continua funcionando e avisa uma única vez:" },
            {
              type: "code",
              language: "javascript",
              filename: "deprecation.js",
              code: [
                "let warned = false;",
                "",
                "/**",
                " * @deprecated desde a v2.4 — use findUser({ email }). Será removida na v3.0.",
                " */",
                "function getUserByEmail(email) {",
                "  if (!warned) {",
                "    console.warn(\"getUserByEmail está obsoleta; use findUser({ email }). Remoção prevista na v3.0.\");",
                "    warned = true;",
                "  }",
                "  return findUser({ email });",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A função continua funcionando (delegando para a nova), o aviso diz o que usar no lugar e quando a " +
                "remoção acontece, e o registro só aparece uma vez para não inundar o log. Editores costumam " +
                "riscar automaticamente funções marcadas com @deprecated.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para retirar funcionalidades antigas sem quebrar quem depende delas: avisar, oferecer a alternativa e dar " +
                "prazo.",
                "Depois de medir o uso, para saber quem ainda depende do que será removido.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Avisar sem dizer o que fazer não ajuda; o aviso só é útil se aponta a alternativa, o motivo e o prazo.",
                "Remover algo ainda muito usado transforma uma limpeza em um incidente; a remoção, de preferência, vai num " +
                "novo MAJOR.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma política de prazos clara",
              context: "Quem depende de você precisa saber, com antecedência, quanto tempo tem para migrar.",
              code: {
                language: "text",
                filename: "deprecation-timeline.txt",
                code: [
                  "v2.4 (março)   getUserByEmail marcada como obsoleta; alternativa: findUser({ email })",
                  "               — aviso no console, nota no changelog, guia de migração publicado",
                  "v2.5 – v2.9    continua funcionando; acompanhar o uso (métricas / busca em repositórios)",
                  "v3.0 (setembro) removida; nota de MAJOR explica a mudança e aponta o guia",
                ].join("\n"),
              },
              explanation:
                "Seis meses, um aviso constante e um guia de migração mostram respeito por quem consome. O prazo só " +
                "é razoável se a alternativa já existir desde o primeiro aviso.",
            },
            {
              title: "Medir o uso antes de remover",
              context: "Remover algo que ainda é muito usado transforma uma limpeza em um incidente.",
              code: {
                language: "javascript",
                filename: "usage-tracking.js",
                code: [
                  "function getUserByEmail(email) {",
                  "  metrics.increment(\"deprecated.getUserByEmail.calls\", { caller: callerName() });",
                  "  console.warn(\"getUserByEmail está obsoleta; use findUser({ email }).\");",
                  "  return findUser({ email });",
                  "}",
                  "",
                  "// Painel: zero chamadas há 30 dias → seguro remover.",
                  "// Ainda há chamadas do serviço de faturamento → avisar o time responsável.",
                ].join("\n"),
              },
              explanation:
                "O contador transforma \"acho que ninguém usa mais\" em um dado. Se ainda houver chamadores, dá para " +
                "identificá-los e ajudá-los a migrar antes da remoção.",
            },
            {
              title: "Avisar sem dizer o que fazer não ajuda",
              context: "Um aviso de obsolescência só é útil se leva o usuário à ação seguinte.",
              code: {
                language: "javascript",
                filename: "useful-warning.js",
                code: [
                  "// Inútil: gera preocupação, não orienta",
                  "console.warn(\"esta função está obsoleta\");",
                  "",
                  "// Útil: o quê, por quê, o que fazer, e até quando",
                  "console.warn(",
                  "  \"formatLegacy está obsoleta desde a v2.4 (não trata fusos horários). \" +",
                  "  \"Use formatDate(date, { timeZone }). Será removida na v3.0. Guia: docs/migrating-to-v3.md\"",
                  ");",
                ].join("\n"),
              },
              explanation:
                "A segunda mensagem permite que a pessoa aja imediatamente: sabe qual função usar, entende o motivo " +
                "e tem um prazo e um guia. O objetivo da deprecation é levar os usuários à migração, não apenas informá-los.",
            },
          ],
          exercise: {
            problem:
              "Sua biblioteca tem a função abaixo, que será substituída por uma versão que aceita opções. Ela " +
              "precisa ser retirada de forma segura ao longo de algumas versões.",
            problemCode: {
              language: "javascript",
              filename: "old-api.js",
              code: [
                "// Antiga",
                "function sendMail(to, text) { /* ... */ }",
                "",
                "// Nova (já existe)",
                "function sendMessage({ to, body, attachments = [] }) { /* ... */ }",
              ].join("\n"),
            },
            task:
              "Deprecie sendMail: mantenha-a funcionando delegando para sendMessage, marque-a como obsoleta com um " +
              "aviso útil (uma vez só) e defina em qual versão seria removida.",
            hint: "A função antiga vira uma \"casca\" que traduz os argumentos antigos para o formato novo.",
            solution: {
              code: {
                language: "javascript",
                filename: "old-api.deprecated.js",
                code: [
                  "let warned = false;",
                  "",
                  "/** @deprecated desde a v2.6 — use sendMessage({ to, body }). Remoção prevista na v3.0. */",
                  "function sendMail(to, text) {",
                  "  if (!warned) {",
                  "    console.warn(\"sendMail está obsoleta; use sendMessage({ to, body }). Remoção na v3.0.\");",
                  "    warned = true;",
                  "  }",
                  "  return sendMessage({ to, body: text });",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Os chamadores antigos continuam funcionando sem mudanças, recebem um aviso claro com a alternativa e " +
                "o prazo, e a lógica real vive só em sendMessage. A função antiga pode ser removida na v3.0, " +
                "quando o uso tiver caído.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Dependency Management",
          isNew: true,
          requires: ["Semantic Versioning"],
          note: "gerenciar versões/dependências de terceiros: lockfiles, ranges de versão, grafo de dependências",
          summary:
            "Dependency Management é o conjunto de práticas para declarar, travar e atualizar as bibliotecas de " +
            "terceiros de um projeto.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Quase todo projeto usa bibliotecas de terceiros, e cada uma delas depende de outras. As práticas são " +
                "declarar do que o projeto depende (o manifesto, como package.json), travar as versões exatas que foram " +
                "resolvidas (o lockfile), entender o grafo de dependências (as diretas e as transitivas) e atualizar de " +
                "forma planejada.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Versione o lockfile, ou cada máquina pode acabar instalando uma versão diferente do mesmo pacote.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Dependências economizam trabalho, mas terceirizam o controle. Uma versão nova pode quebrar seu código; " +
                "uma vulnerabilidade em uma dependência (ou na dependência de uma dependência) vira uma " +
                "vulnerabilidade sua; uma biblioteca abandonada deixa de receber correções. Sem gestão, dois " +
                "desenvolvedores instalam versões diferentes e o mesmo código se comporta de forma diferente em " +
                "cada máquina.",
            },
            {
              type: "paragraph",
              text:
                "Como funciona: o manifesto declara intervalos de versão (^1.4.2 aceita 1.x.x a partir da 1.4.2, ~1.4.2 " +
                "aceita 1.4.x) apoiados no Semantic Versioning; o lockfile registra a versão exata de cada pacote " +
                "resolvida, o que garante builds reprodutíveis e deve ser versionado junto com o código. Boas " +
                "práticas: atualizar com frequência e em pequenos passos (ferramentas como Dependabot ou Renovate " +
                "abrem PRs automáticos), auditar vulnerabilidades, separar dependências de desenvolvimento e " +
                "de produção, avaliar uma biblioteca antes de adotá-la e preferir poucas e bem mantidas.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o que um intervalo de versão aceita — a regra que o manifesto usa por trás:" },
            {
              type: "code",
              language: "javascript",
              filename: "dependency-ranges.js",
              code: [
                "// package.json declara:  \"date-utils\": \"^1.4.2\"",
                "// Significado: qualquer 1.x.y a partir de 1.4.2, mas NUNCA 2.0.0 (poderia quebrar).",
                "",
                "function satisfiesCaret(version, base) {",
                "  const [major, minor, patch] = version.split(\".\").map(Number);",
                "  const [bMajor, bMinor, bPatch] = base.split(\".\").map(Number);",
                "  if (major !== bMajor) return false;",
                "  if (minor !== bMinor) return minor > bMinor;",
                "  return patch >= bPatch;",
                "}",
                "",
                "satisfiesCaret(\"1.9.0\", \"1.4.2\"); // true  (minor maior, compatível)",
                "satisfiesCaret(\"1.4.1\", \"1.4.2\"); // false (anterior ao mínimo)",
                "satisfiesCaret(\"2.0.0\", \"1.4.2\"); // false (MAJOR diferente: pode quebrar)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O intervalo usa o SemVer como contrato: aceita atualizações que prometem compatibilidade e recusa " +
                "as que podem quebrar. O lockfile, por sua vez, fixa qual versão exata dentro do intervalo foi " +
                "instalada, para que todos usem a mesma.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Sempre: versionar o manifesto e o lockfile para que todos, o CI e a produção instalem as mesmas versões.",
                "Para problemas difíceis, como criptografia e parsing de formatos complexos, usar uma biblioteca madura.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para lógica trivial, uma dependência custa mais do que economiza: é código de terceiros que você passa a " +
                "manter.",
                "A superfície de risco é o grafo inteiro, com as dependências transitivas, e não só a lista do manifesto.",
              ],
            },
          ],
          examples: [
            {
              title: "Manifesto e lockfile: papéis diferentes",
              context: "O manifesto é a intenção; o lockfile é o registro exato do que foi resolvido.",
              code: {
                language: "json",
                filename: "package.json + package-lock.json",
                code: [
                  "// package.json — intenção: qualquer 4.x compatível",
                  "{ \"dependencies\": { \"express\": \"^4.18.0\" } }",
                  "",
                  "// package-lock.json — fato: a versão exata instalada (e as transitivas)",
                  "{ \"packages\": { \"node_modules/express\": { \"version\": \"4.19.2\" },",
                  "                 \"node_modules/body-parser\": { \"version\": \"1.20.2\" } } }",
                ].join("\n"),
              },
              explanation:
                "Sem o lockfile, um novo `npm install` poderia trazer a 4.21.0 e comportar-se diferente da máquina " +
                "de outra pessoa. Com ele, todos (e o CI, e a produção) instalam exatamente as mesmas versões.",
            },
            {
              title: "O grafo: dependências transitivas",
              context: "Você declara uma biblioteca, mas instala muitas: as dependências das dependências também são suas.",
              code: {
                language: "text",
                filename: "dependency-tree.txt",
                code: [
                  "meu-app",
                  "└── express@4.19.2                (declarada por você)",
                  "    ├── body-parser@1.20.2        (transitiva)",
                  "    │   └── qs@6.11.0             (transitiva)",
                  "    └── cookie@0.6.0              (transitiva)",
                  "",
                  "Uma vulnerabilidade em qs@6.11.0 afeta o meu-app, mesmo que eu nunca a tenha escolhido.",
                ].join("\n"),
              },
              explanation:
                "A superfície de risco é o grafo inteiro, não só a lista do manifesto. Por isso auditorias " +
                "automáticas (npm audit e similares) e atualizações regulares fazem parte da gestão.",
            },
            {
              title: "Pensar antes de adicionar uma dependência",
              context: "Cada dependência nova é código de terceiros que você passa a manter, atualizar e confiar.",
              code: {
                language: "javascript",
                filename: "think-before-adding.js",
                code: [
                  "// Antes de instalar um pacote só para isto:",
                  "//   npm install is-odd",
                  "",
                  "// ...considere que são três linhas:",
                  "const isOdd = (n) => Math.abs(n) % 2 === 1;",
                  "",
                  "// Perguntas antes de adicionar: o que ela resolve que eu não escrevo em pouco tempo?",
                  "// Está bem mantida (releases recentes)? Qual a licença? Quantas dependências traz? Qual o tamanho?",
                ].join("\n"),
              },
              explanation:
                "Para lógica trivial, uma dependência custa mais do que economiza. Para problemas difíceis (criptografia, " +
                "parsing de formatos complexos), usar uma biblioteca madura é o correto — o ponto é decidir de forma consciente.",
            },
          ],
          exercise: {
            problem:
              "O manifesto do projeto declara os intervalos abaixo, e três versões novas foram publicadas.",
            problemCode: {
              language: "text",
              filename: "ranges.txt",
              code: [
                "\"lib-a\": \"^1.4.2\"",
                "\"lib-b\": \"~1.4.2\"",
                "\"lib-c\": \"1.4.2\"",
                "",
                "Novas versões publicadas: 1.4.9, 1.5.0, 2.0.0",
              ].join("\n"),
            },
            task:
              "Para cada dependência, diga quais das três versões novas seriam aceitas pelo intervalo, e explique " +
              "por que o lockfile ainda é necessário.",
            hint: "^ aceita mudanças de MINOR e PATCH dentro do mesmo MAJOR; ~ aceita só PATCH; um número sem prefixo fixa exatamente aquela versão.",
            solution: {
              code: {
                language: "text",
                filename: "ranges.answer.txt",
                code: [
                  "lib-a  ^1.4.2 → aceita 1.4.9 e 1.5.0    (não aceita 2.0.0: MAJOR diferente)",
                  "lib-b  ~1.4.2 → aceita 1.4.9            (não aceita 1.5.0 nem 2.0.0: só PATCH varia)",
                  "lib-c  1.4.2  → não aceita nenhuma       (versão fixada exatamente)",
                  "",
                  "O lockfile ainda é necessário: lib-a aceita duas versões diferentes (1.4.9 e 1.5.0), e sem o",
                  "lockfile cada instalação poderia escolher uma — e o projeto se comportaria diferente.",
                ].join("\n"),
              },
              explanation:
                "O intervalo define o que é permitido; quem decide o que de fato é instalado é o lockfile. Fixar tudo " +
                "no manifesto evitaria surpresas, mas também bloquearia correções de segurança — por isso o " +
                "equilíbrio comum é intervalos + lockfile + atualizações regulares.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Incremental Migration",
          requires: ["Legacy Code", "Backward Compatibility"],
          note: "capstone: técnica para evoluir código legado/dependências com segurança",
          summary:
            "Incremental Migration é trocar uma parte do sistema por etapas, com o antigo e o novo convivendo durante " +
            "a transição.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O uso migra aos poucos, e o antigo só é removido quando ninguém mais depende dele. Vale para código " +
                "legado, dependências e tecnologias. Em cada passo o sistema continua funcionando e cada mudança pode ser " +
                "desfeita.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Remova o antigo quando ninguém mais o usar, e não quando o novo ficar pronto.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A alternativa, a troca de uma vez (big bang), concentra todo o risco em um único momento: se algo " +
                "der errado, tudo quebra ao mesmo tempo e voltar atrás é caro. Ela também obriga a congelar o " +
                "desenvolvimento e adia todo o feedback. A migração incremental distribui o risco em passos pequenos, " +
                "permite aprender com cada um e mantém o sistema entregando valor — e depende das duas ideias que " +
                "este módulo acabou de ver: proteger o legado (Legacy Code) e manter a compatibilidade " +
                "(Backward Compatibility) enquanto os dois lados convivem.",
            },
            {
              type: "paragraph",
              text:
                "Padrões comuns: Parallel Change (expandir → migrar → contrair): primeiro adicione o novo ao lado do " +
                "antigo, depois migre os chamadores, por fim remova o antigo. Strangler Fig: um ponto de entrada " +
                "(roteador, fachada) encaminha cada vez mais casos para o novo sistema, até o antigo ser " +
                "\"estrangulado\". Feature flags: liga o novo caminho para poucos usuários, mede, e amplia. " +
                "Em todos, o critério é o mesmo: cada passo é pequeno, seguro e reversível.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "as três fases de Parallel Change ao trocar o formato de um retorno:" },
            {
              type: "code",
              language: "javascript",
              filename: "incremental-migration.js",
              code: [
                "// Situação: getUser devolve { fullName }, e queremos { firstName, lastName }.",
                "",
                "// 1. EXPANDIR: entrega os dois formatos (nada quebra)",
                "function getUser(id) {",
                "  const [firstName, ...rest] = loadUserName(id).split(\" \");",
                "  const fullName = [firstName, ...rest].join(\" \");",
                "  return { fullName, firstName, lastName: rest.join(\" \") };",
                "}",
                "",
                "// 2. MIGRAR: cada chamador passa de user.fullName para firstName/lastName, um por vez",
                "//    (o sistema funciona a cada chamador migrado)",
                "",
                "// 3. CONTRAIR: quando ninguém mais usa fullName, remove-se",
                "function getUser(id) {",
                "  const [firstName, ...rest] = loadUserName(id).split(\" \");",
                "  return { firstName, lastName: rest.join(\" \") };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em nenhum momento o sistema ficou quebrado: na etapa 1, os antigos chamadores continuam " +
                "funcionando; na 2, cada migração é um pequeno commit; e a 3 só acontece quando é segura.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para trocar uma parte do sistema, ou o sistema inteiro (Strangler Fig), em passos pequenos e reversíveis.",
                "Com feature flag, ligando o novo caminho para uma fração dos usuários e ampliando aos poucos.",
                "Em mudanças de dados, como renomear uma coluna, em fases compatíveis com o código antigo e o novo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Cada etapa precisa funcionar com as versões de código que convivem durante o deploy; uma renomeação direta " +
                "quebraria as instâncias antigas.",
                "O antigo só deve ser removido quando ninguém mais o usar: a convivência é transitória.",
              ],
            },
          ],
          examples: [
            {
              title: "Strangler Fig: um roteador que migra rota a rota",
              context: "Para substituir um sistema inteiro, um ponto de entrada envia cada vez mais casos para o novo.",
              code: {
                language: "javascript",
                filename: "strangler.js",
                code: [
                  "// Rotas já reescritas no sistema novo; o resto continua no legado",
                  "const MIGRATED_ROUTES = new Set([\"/invoices\", \"/customers\"]);",
                  "",
                  "function route(request) {",
                  "  if (MIGRATED_ROUTES.has(request.path)) return newSystem.handle(request);",
                  "  return legacySystem.handle(request);",
                  "}",
                  "",
                  "// A cada sprint, mais rotas entram em MIGRATED_ROUTES.",
                  "// Quando a lista cobre tudo, o sistema legado é desligado.",
                ].join("\n"),
              },
              explanation:
                "Cada rota migrada é uma pequena vitória, testada em produção, e uma rota problemática pode voltar " +
                "para o legado removendo-a da lista. O sistema antigo é substituído sem nunca ser desligado de " +
                "uma vez.",
            },
            {
              title: "Migração gradual com feature flag",
              context: "O novo caminho é ligado para uma pequena fração dos usuários, medido e ampliado aos poucos.",
              code: {
                language: "javascript",
                filename: "gradual-rollout.js",
                code: [
                  "function calculatePrice(cart, user) {",
                  "  const useNewEngine = rollout.isEnabled(\"new-pricing-engine\", user.id); // 5% → 25% → 100%",
                  "  const price = useNewEngine ? newEngine.calculate(cart) : legacyEngine.calculate(cart);",
                  "",
                  "  if (useNewEngine) compareWithLegacy(price, legacyEngine.calculate(cart)); // valida em paralelo",
                  "  return price;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se o novo motor calcular algo diferente, isso aparece para 5% dos usuários e pode ser desligado " +
                "imediatamente, não para todos. A comparação em paralelo com o legado transforma cada uso em um teste.",
            },
            {
              title: "Renomear uma coluna do banco em fases",
              context: "Mudanças em dados exigem o mesmo cuidado, porque várias versões do código convivem durante o deploy.",
              code: {
                language: "text",
                filename: "column-rename.txt",
                code: [
                  "Objetivo: renomear users.name → users.full_name",
                  "",
                  "1. Adicionar a coluna full_name (a antiga continua existindo)",
                  "2. O código passa a gravar nas duas colunas",
                  "3. Copiar os valores antigos para full_name (backfill)",
                  "4. O código passa a LER de full_name",
                  "5. Parar de gravar em name",
                  "6. Remover a coluna name (só depois de confirmar que ninguém mais a usa)",
                ].join("\n"),
              },
              explanation:
                "Cada etapa é compatível com a versão de código anterior e com a seguinte, então dá para fazer " +
                "o deploy sem indisponibilidade e reverter em qualquer ponto. Uma renomeação direta quebraria " +
                "todas as instâncias que ainda rodam o código antigo.",
            },
          ],
          exercise: {
            problem:
              "A função abaixo devolve uma data como texto, e todos os chamadores dependem disso. Vocês querem " +
              "passar a devolver um objeto Date, sem quebrar ninguém durante a transição.",
            problemCode: {
              language: "javascript",
              filename: "get-due-date.js",
              code: [
                "function getDueDate(invoice) {",
                "  return invoice.dueDate.toISOString().slice(0, 10); // \"2026-03-15\"",
                "}",
                "",
                "// Usada em dezenas de lugares:",
                "showLabel(getDueDate(invoice));",
              ].join("\n"),
            },
            task:
              "Descreva e escreva os três passos de uma migração incremental (expandir, migrar, contrair), " +
              "de modo que o sistema funcione em todas as etapas.",
            hint: "Em vez de mudar o retorno de getDueDate, adicione uma função nova ao lado, migre os chamadores para ela e só então remova a antiga.",
            solution: {
              code: {
                language: "javascript",
                filename: "get-due-date.migration.js",
                code: [
                  "// 1. EXPANDIR: função nova ao lado da antiga (nada quebra)",
                  "function getDueDateAsDate(invoice) {",
                  "  return invoice.dueDate;",
                  "}",
                  "function getDueDate(invoice) {",
                  "  return getDueDateAsDate(invoice).toISOString().slice(0, 10); // igual ao anterior",
                  "}",
                  "",
                  "// 2. MIGRAR: cada chamador troca, aos poucos:",
                  "//    showLabel(getDueDate(invoice))  →  showLabel(format(getDueDateAsDate(invoice)))",
                  "//    (em cada commit o sistema funciona; getDueDate pode até ser marcada como obsoleta)",
                  "",
                  "// 3. CONTRAIR: sem chamadores de getDueDate, ela é removida",
                  "//    (e getDueDateAsDate pode ganhar o nome final, se desejado)",
                ].join("\n"),
              },
              explanation:
                "Em nenhuma etapa o sistema ficou quebrado: a função antiga foi mantida com o comportamento " +
                "original até o último chamador migrar. Cada commit é pequeno e reversível, e a remoção final é " +
                "segura porque o uso caiu a zero.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "git",
      order: 80,
      title: "Git",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Commit como unidade atômica → operações que combinam histórico (Merge/Rebase) → variações e " +
        "recuperação → localizar regressões (revisita) → workflow de equipe.",
      concepts: [
        concept({
          order: 10,
          title: "Commit",
          note: "unidade atômica de histórico, boas mensagens",
          summary:
            "Um Commit é um ponto no histórico do projeto: o estado dos arquivos naquele momento, com autor, data e " +
            "mensagem.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ele guarda também uma referência ao commit anterior e tem um identificador único (o hash); encadeados, " +
                "os commits formam o histórico. Antes de commitar, as mudanças escolhidas vão para a área de preparação " +
                "(staging area, com git add) — é isso que permite decidir o que entra em cada commit.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Se a mensagem do commit precisa de \"e\" para ser escrita, provavelmente são dois commits.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O histórico só ajuda se cada commit for fácil de entender e de manipular. Um commit atômico — uma " +
                "mudança lógica, que deixa o projeto funcionando — permite revisar com facilidade, desfazer sem " +
                "efeitos colaterais (Revert), levar para outra branch (Cherry-pick) e achar o culpado de uma " +
                "regressão (Git Bisect). Um commit que mistura várias coisas estraga tudo isso: para desfazer uma, " +
                "perde-se as outras.",
            },
            {
              type: "paragraph",
              text:
                "A mensagem é o registro do porquê. O diff já mostra o que mudou; a mensagem deve explicar a " +
                "razão. Convenção comum: uma linha de assunto curta (até cerca de 50 caracteres) no imperativo " +
                "(\"Corrige o cálculo de frete\"), uma linha em branco e, se necessário, um corpo explicando o " +
                "motivo e o contexto. Mensagens como \"ajustes\", \"fix\" ou \"wip\" não ajudam ninguém que " +
                "leia o histórico depois.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "os comandos básicos e uma função que verifica a forma de uma boa mensagem:" },
            {
              type: "code",
              language: "text",
              filename: "commit.sh",
              code: [
                "git add src/shipping.js src/shipping.test.js   # escolhe o que entra no commit",
                "git commit -m \"Corrige o arredondamento do frete acima de 10 kg\"",
                "git log --oneline -3                            # a2f9c1e Corrige o arredondamento do frete...",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "commit-message.js",
              code: [
                "function checkCommitSubject(subject) {",
                "  const problems = [];",
                "  if (subject.length > 50) problems.push(\"assunto com mais de 50 caracteres\");",
                "  if (subject.endsWith(\".\")) problems.push(\"sem ponto final no assunto\");",
                "  if (/^(fix|wip|ajustes?|update)$/i.test(subject.trim())) problems.push(\"assunto vago\");",
                "  return problems;",
                "}",
                "",
                "checkCommitSubject(\"wip\");                                        // [\"assunto vago\"]",
                "checkCommitSubject(\"Corrige o arredondamento do frete\");          // []",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As regras são convenções, não leis, mas ilustram o objetivo: um assunto que diz o que muda, curto " +
                "o bastante para caber nas listas do histórico (git log --oneline) e específico o bastante para ser " +
                "útil meses depois.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Uma mudança lógica por commit, mesmo quando várias foram feitas na mesma sessão de trabalho.",
                "Com staging parcial, quando um arquivo tem duas mudanças de propósitos diferentes.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um commit que mistura mudanças não pode ser desfeito nem movido sem levar outras coisas junto.",
                "Uma mensagem que só repete o diff não ajuda depois; o diff mostra o que mudou, só a mensagem registra o porquê.",
              ],
            },
          ],
          examples: [
            {
              title: "Commit atômico versus commit misturado",
              context: "Uma sessão de trabalho pode produzir várias mudanças; cada uma merece seu próprio commit.",
              code: {
                language: "text",
                filename: "atomic-commits.txt",
                code: [
                  "Misturado (um commit só):",
                  "  \"várias mudanças\"  →  corrige bug de frete + renomeia variáveis + atualiza README",
                  "  Se o bug reaparecer, reverter o commit desfaz também o README e a renomeação.",
                  "",
                  "Atômico (três commits):",
                  "  1. Corrige o arredondamento do frete acima de 10 kg",
                  "  2. Renomeia variáveis do cálculo de frete para nomes descritivos",
                  "  3. Documenta a política de frete no README",
                  "  Cada um pode ser revisado, revertido ou levado para outra branch sozinho.",
                ].join("\n"),
              },
              explanation:
                "O custo de separar é de alguns segundos ao commitar; o benefício aparece meses depois, quando alguém precisa " +
                "desfazer ou entender uma mudança específica.",
            },
            {
              title: "Mensagens que explicam o porquê",
              context: "O diff mostra o que mudou; só a mensagem pode registrar a razão.",
              code: {
                language: "text",
                filename: "commit-messages.txt",
                code: [
                  "Ruim:",
                  "  \"fix\"",
                  "  \"ajustes no frete\"",
                  "",
                  "Bom:",
                  "  Corrige o arredondamento do frete acima de 10 kg",
                  "",
                  "  O cálculo usava Math.floor, o que cobrava a menos em pesos fracionados",
                  "  (ex.: 10,9 kg cobrava como 10 kg). Passa a usar Math.ceil, conforme o",
                  "  contrato com a transportadora. Fixes #482.",
                ].join("\n"),
              },
              explanation:
                "Daqui a um ano, quem estranhar o Math.ceil consegue descobrir a razão em segundos, sem precisar " +
                "perguntar a alguém que talvez nem esteja mais na equipe.",
            },
            {
              title: "Escolher o que entra: staging parcial",
              context: "Quando um arquivo tem duas mudanças de propósitos diferentes, é possível commitá-las separadamente.",
              code: {
                language: "text",
                filename: "partial-staging.sh",
                code: [
                  "git add -p src/shipping.js     # mostra cada trecho e pergunta: adicionar? (y/n/s)",
                  "  y  → trecho do bug de arredondamento",
                  "  n  → trecho da renomeação (fica para o próximo commit)",
                  "git commit -m \"Corrige o arredondamento do frete acima de 10 kg\"",
                  "git add src/shipping.js",
                  "git commit -m \"Renomeia variáveis do cálculo de frete\"",
                ].join("\n"),
              },
              explanation:
                "A área de preparação existe justamente para isso: dar controle sobre o que entra em cada commit, mesmo " +
                "quando as mudanças foram feitas juntas no mesmo arquivo.",
            },
          ],
          exercise: {
            problem:
              "Depois de uma tarde de trabalho, o seu diretório tem três tipos de mudança misturados: uma correção " +
              "de bug no cálculo de desconto, uma nova função de exportação para CSV, e a atualização do README.",
            problemCode: {
              language: "text",
              filename: "working-tree.txt",
              code: [
                "M  src/discount.js         (correção do bug: o desconto não considerava o cupom)",
                "M  src/discount.test.js    (teste do bug corrigido)",
                "A  src/export-csv.js       (nova funcionalidade)",
                "A  src/export-csv.test.js  (testes da funcionalidade)",
                "M  README.md               (documenta a exportação para CSV)",
              ].join("\n"),
            },
            task:
              "Proponha como dividir isso em commits atômicos, com uma mensagem de assunto para cada um, e diga " +
              "por que a divisão que você escolheu ajuda no futuro.",
            hint: "Agrupe pelo motivo da mudança: o que um commit desfaria se fosse revertido? O README pertence ao mesmo assunto de algum outro grupo?",
            solution: {
              code: {
                language: "text",
                filename: "commits.answer.sh",
                code: [
                  "git add src/discount.js src/discount.test.js",
                  "git commit -m \"Corrige o desconto ignorando o cupom\"",
                  "",
                  "git add src/export-csv.js src/export-csv.test.js README.md",
                  "git commit -m \"Adiciona exportação de relatórios para CSV\"",
                ].join("\n"),
              },
              explanation:
                "Dois commits, um por motivo de mudança. A correção do bug fica isolada, podendo ir para uma release de " +
                "emergência (Cherry-pick) ou ser revertida sem afetar a exportação. O README foi para o commit da " +
                "funcionalidade porque documenta exatamente aquilo — os dois fazem sentido juntos ou nenhum.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Merge",
          requires: ["Commit"],
          note: "mesclar — combinar o trabalho de duas linhas de histórico",
          summary: "Merge é a operação que integra as mudanças de uma branch em outra, sem alterar os commits existentes.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O Git encontra o ancestral comum das duas, compara o que cada lado mudou desde então e junta tudo. Há " +
                "dois resultados possíveis: um fast-forward, quando a branch de destino não avançou desde a criação da " +
                "outra (o Git apenas move o ponteiro para frente, sem novo commit), ou um merge commit, um commit " +
                "especial com dois pais que registra a junção de duas linhas de trabalho que divergiram.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O histórico ramificado do merge é mais difícil de ler, mas conta a verdade sobre o trabalho feito em " +
                "paralelo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Equipes trabalham em paralelo, cada uma em sua branch, e em algum momento esse trabalho precisa ser " +
                "reunido. O merge faz isso sem alterar os commits existentes: todo o histórico original é preservado, " +
                "inclusive o fato de que o trabalho aconteceu em paralelo e quando foi integrado. É uma operação " +
                "não destrutiva — e por isso segura para branches compartilhadas.",
            },
            {
              type: "paragraph",
              text:
                "O custo é um histórico com bifurcações e commits de mesclagem, que pode ficar difícil de ler em " +
                "projetos muito ativos (é aí que entra o Rebase, como contraste). Duas opções úteis: --no-ff " +
                "força a criação de um merge commit mesmo quando um fast-forward seria possível, mantendo visível que " +
                "existiu uma branch de funcionalidade; e --abort desfaz um merge em andamento se ele tomar um " +
                "rumo indesejado (por exemplo, com conflitos).",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o comando, e um modelo do histórico como lista que mostra quando o merge é um simples avanço:" },
            {
              type: "code",
              language: "text",
              filename: "merge.sh",
              code: [
                "git switch main",
                "git merge feature/login        # traz o trabalho de feature/login para main",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "fast-forward.js",
              code: [
                "// O histórico de uma branch é a lista de commits, do mais antigo para o mais novo",
                "const main    = [\"A\", \"B\"];",
                "const feature = [\"A\", \"B\", \"C\", \"D\"];   // saiu de B e avançou",
                "",
                "// Fast-forward: a main é o começo exato da feature — ninguém mexeu na main desde B",
                "const canFastForward = main.every((commit, i) => feature[i] === commit);",
                "console.log(canFastForward);                // true → main passa a ser [A, B, C, D]",
                "",
                "// Se a main tivesse ganhado um commit E, as histórias divergiriam:",
                "const divergedMain = [\"A\", \"B\", \"E\"];",
                "divergedMain.every((commit, i) => feature[i] === commit); // false → precisa de um merge commit",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Enquanto a história de main é um prefixo da história da feature, basta avançar o ponteiro. Quando " +
                "as duas têm commits que a outra não tem, o Git cria um merge commit com dois pais para reunir " +
                "as linhas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para juntar branches sem reescrever o histórico, com fast-forward quando a destino não avançou.",
                "Com `--no-ff`, quando a política da equipe é registrar cada funcionalidade como uma unidade.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O fast-forward só é possível quando a branch de destino não recebeu commits novos.",
                "Merge commits geram um grafo mais ramificado, ainda que ele reflita a verdade do trabalho em paralelo.",
              ],
            },
          ],
          examples: [
            {
              title: "Fast-forward: nada divergiu",
              context: "A main não recebeu commits desde que a feature saiu dela — o merge é só um avanço.",
              code: {
                language: "text",
                filename: "fast-forward.txt",
                code: [
                  "Antes:   main:    A---B",
                  "         feature:     \\--C---D",
                  "",
                  "git switch main && git merge feature",
                  "",
                  "Depois:  main:    A---B---C---D      (main andou para o commit D; nenhum commit novo)",
                ].join("\n"),
              },
              explanation:
                "O histórico continua linear, sem commit de mesclagem. É o resultado mais limpo, mas só é possível " +
                "quando a branch de destino não avançou.",
            },
            {
              title: "Merge commit: as linhas divergiram",
              context: "Quando os dois lados têm commits novos, o Git registra a junção em um commit com dois pais.",
              code: {
                language: "text",
                filename: "merge-commit.txt",
                code: [
                  "Antes:   main:    A---B---E",
                  "         feature:     \\--C---D",
                  "",
                  "git switch main && git merge feature",
                  "",
                  "Depois:  main:    A---B---E-------M     M é o merge commit (pais: E e D)",
                  "                       \\--C---D--/",
                ].join("\n"),
              },
              explanation:
                "O histórico mostra a verdade: o trabalho aconteceu em paralelo e foi reunido em M. É útil para " +
                "auditoria, mas gera um grafo mais ramificado.",
            },
            {
              title: "Manter a branch visível com --no-ff e abandonar com --abort",
              context: "Duas opções que dão controle sobre como a mesclagem aparece — e sobre a saída de emergência.",
              code: {
                language: "text",
                filename: "merge-options.sh",
                code: [
                  "git merge --no-ff feature/login     # força um merge commit mesmo se fosse fast-forward",
                  "                                    # → o histórico mostra que existiu a feature/login",
                  "",
                  "git merge feature/outra             # ...apareceu um conflito grande e inesperado",
                  "git merge --abort                   # volta ao estado anterior ao merge, sem prejuízo",
                ].join("\n"),
              },
              explanation:
                "--no-ff é uma escolha de política de equipe (registrar cada funcionalidade como uma unidade); " +
                "--abort é a garantia de que iniciar um merge nunca é irreversível.",
            },
          ],
          exercise: {
            problem:
              "Observe os históricos das duas branches e decida, em cada situação, se o merge será um fast-forward " +
              "ou exigirá um merge commit.",
            problemCode: {
              language: "text",
              filename: "situations.txt",
              code: [
                "Situação 1:  main = A---B         feature = A---B---C---D",
                "Situação 2:  main = A---B---E     feature = A---B---C---D",
                "Situação 3:  main = A---B---C     feature = A---B---C",
              ].join("\n"),
            },
            task:
              "Para cada situação, diga o tipo de resultado ao rodar git merge feature estando na main, e explique como " +
              "você chegou a essa conclusão.",
            hint: "Pergunte: o histórico da main é exatamente o começo do histórico da feature? Ou cada lado tem commits que o outro não tem?",
            solution: {
              code: {
                language: "javascript",
                filename: "situations.answer.js",
                code: [
                  "// Situação 1: main = [A, B] é prefixo de feature = [A, B, C, D]",
                  "//   → fast-forward: main avança para D, sem commit novo.",
                  "",
                  "// Situação 2: main tem E, que a feature não tem; a feature tem C e D, que a main não tem",
                  "//   → as linhas divergiram → merge commit (com pais E e D).",
                  "",
                  "// Situação 3: main e feature apontam para o mesmo commit C",
                  "//   → nada a fazer: \"Already up to date\".",
                ].join("\n"),
              },
              explanation:
                "A regra é a inspeção dos dois históricos: se um é prefixo do outro, basta avançar (ou não há nada a " +
                "fazer); se cada um tem commits exclusivos, é preciso um commit de mesclagem para unir as duas linhas.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Rebase",
          requires: ["Commit"],
          note: "contraste direto com Merge",
          summary: "Rebase é reaplicar os commits de uma branch, um a um, em cima de outra base.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A nova base costuma ser a ponta atualizada da main. O resultado é como se você tivesse começado o " +
                "trabalho a partir do ponto mais recente. É a alternativa ao merge para integrar mudanças: em vez de " +
                "criar um commit de junção, reescreve-se a sua branch para que ela pareça ter sido feita depois.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Rebase troca a verdade do histórico por legibilidade, uma troca que só vale enquanto a branch é só sua.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O rebase produz um histórico linear, sem bifurcações e sem commits de mesclagem, mais fácil de ler " +
                "e de percorrer (git log, bisect). É comum usá-lo para atualizar uma branch de trabalho com as " +
                "novidades da main antes de abri-la para revisão. O contraste com Merge é a essência da escolha: " +
                "merge preserva o histórico como aconteceu (com sua ramificação), rebase o reescreve para " +
                "ficar limpo.",
            },
            {
              type: "paragraph",
              text:
                "O preço é que reaplicar commits cria commits novos: mesmo conteúdo, mas hashes diferentes. Por isso " +
                "existe a regra de ouro: nunca faça rebase de commits que já foram publicados e que outras pessoas " +
                "usam. Se alguém já baseou trabalho nos commits antigos, o histórico dela divergirá do seu e o " +
                "resultado é confusão e duplicação. O rebase é seguro em branches locais ou de uso individual, " +
                "antes de compartilhar.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o comando, e um modelo mostrando que os commits são refeitos sobre a nova base:" },
            {
              type: "code",
              language: "text",
              filename: "rebase.sh",
              code: [
                "git switch feature/login",
                "git rebase main               # reaplica os commits da feature sobre a ponta da main",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "rebase-model.js",
              code: [
                "const main    = [\"A\", \"B\", \"E\"];                  // a main andou (E é novo)",
                "const feature = [\"A\", \"B\", \"C\", \"D\"];              // a feature saiu de B",
                "const forkPoint = 2;                              // a feature tem 2 commits próprios (C, D)",
                "",
                "// Rebase: os commits próprios da feature são refeitos sobre a ponta da main",
                "const ownCommits = feature.slice(forkPoint);      // [\"C\", \"D\"]",
                "const rebased = [...main, ...ownCommits.map((id) => id + \"'\")];",
                "",
                "console.log(rebased);   // [\"A\", \"B\", \"E\", \"C'\", \"D'\"]  ← histórico linear",
                "// C' e D' têm o mesmo conteúdo de C e D, mas são commits NOVOS (hashes diferentes).",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A linha ficou reta: A, B, E e depois o trabalho da feature. Mas C' e D' não são C e D — quem tivesse " +
                "C e D locais agora tem commits \"órfãos\" em relação à nova história.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para trazer as novidades da main para a sua branch antes de abrir o PR, deixando o histórico reto.",
                "Com `git pull --rebase`, para não criar merge commits só para atualizar com o remoto.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Rebase cria commits novos (com novos hashes): nunca reescreva o que já é compartilhado; use merge.",
                "Em branches já publicadas, exige atenção redobrada.",
              ],
            },
          ],
          examples: [
            {
              title: "Atualizar uma branch com a main",
              context: "O uso mais comum: trazer as novidades da main para a sua branch antes de abrir o PR.",
              code: {
                language: "text",
                filename: "rebase-update.txt",
                code: [
                  "Antes:   main:    A---B---E",
                  "         feature:     \\--C---D",
                  "",
                  "git switch feature && git rebase main",
                  "",
                  "Depois:  main:    A---B---E",
                  "         feature:         \\--C'---D'      (linear: a feature parece ter saído do E)",
                ].join("\n"),
              },
              explanation:
                "Depois disso, integrar na main é um fast-forward, e o histórico fica reto. Em contrapartida, C' e D' " +
                "são commits novos, o que exige atenção se a branch já foi publicada.",
            },
            {
              title: "A regra de ouro: não reescreva o que é compartilhado",
              context: "Rebase de commits públicos obriga todo mundo a lidar com um histórico que mudou sob os seus pés.",
              code: {
                language: "text",
                filename: "golden-rule.txt",
                code: [
                  "1. Ana publica a branch feature (commits C, D). Bruno baixa e continua a partir de D.",
                  "2. Ana faz rebase da feature e força o push: os commits viram C' e D'.",
                  "3. Bruno tenta atualizar: o Git vê C, D (dele) e C', D' (da Ana) como trabalhos diferentes.",
                  "   → conflitos, commits duplicados e horas de correção.",
                  "",
                  "Regra: rebase apenas o que ainda é só seu (não publicado, ou branch de uso individual).",
                ].join("\n"),
              },
              explanation:
                "O problema não é técnico do rebase em si, e sim de coordenação: reescrever história alheia. Em " +
                "branches pessoais é seguro; em branches compartilhadas, use merge.",
            },
            {
              title: "git pull --rebase: evitar merge commits desnecessários",
              context: "Ao atualizar sua branch local com a versão remota, o rebase evita commits de junção que só poluem o histórico.",
              code: {
                language: "text",
                filename: "pull-rebase.sh",
                code: [
                  "git pull               # faz fetch + MERGE: se houver commits novos dos dois lados,",
                  "                       # cria um \"Merge branch 'main' of ...\" sem informação útil",
                  "",
                  "git pull --rebase      # faz fetch + REBASE: seus commits locais ficam por cima dos remotos",
                  "git config --global pull.rebase true   # torna isso o padrão",
                ].join("\n"),
              },
              explanation:
                "Os seus commits locais ainda não foram publicados, então reescrevê-los é seguro, e o histórico " +
                "evita uma série de commits de mesclagem que só dizem \"atualizei com o remoto\".",
            },
          ],
          exercise: {
            problem:
              "Três situações da rotina de uma equipe. Em cada uma, é preciso escolher entre merge e rebase.",
            problemCode: {
              language: "text",
              filename: "scenarios.txt",
              code: [
                "A) Você trabalha sozinha em feature/report (não publicada) e a main andou. Quer atualizar antes do PR.",
                "B) A branch release/2.1 é usada por cinco pessoas e precisa receber o trabalho de uma feature pronta.",
                "C) Você já publicou feature/report e um colega baixou a branch para ajudar.",
              ].join("\n"),
            },
            task:
              "Para cada cenário, escolha merge ou rebase e justifique com a regra de ouro.",
            hint: "Pergunte, em cada caso: os commits que seriam reescritos já pertencem a outras pessoas?",
            solution: {
              code: {
                language: "text",
                filename: "scenarios.answer.txt",
                code: [
                  "A) Rebase. Os commits ainda são só seus; reescrevê-los é seguro e deixa o histórico linear.",
                  "B) Merge. A branch é compartilhada; um merge não reescreve nada e preserva o trabalho de todos.",
                  "C) Não faça rebase (ou combine antes com o colega). A branch já foi publicada e alguém a usa;",
                  "   reescrever os commits criaria um histórico divergente. Atualize com merge.",
                ].join("\n"),
              },
              explanation:
                "A decisão depende de quem já tem os commits. Rebase é para o que ainda é privado; merge é o caminho " +
                "seguro para o que é compartilhado.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Interactive Rebase",
          requires: ["Rebase"],
          note: "inclui Squash como caso de uso — não vira Task própria",
          summary: "Interactive Rebase é um rebase em que você edita a lista de commits antes de o Git reaplicá-los.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O Git abre um editor com os commits, cada um precedido por um comando, e você troca comandos, reordena " +
                "ou apaga linhas. Comandos principais: pick (manter), reword (mudar só a mensagem), edit (parar para " +
                "alterar o commit), squash (juntar ao anterior, combinando as mensagens), fixup (juntar ao anterior " +
                "descartando a mensagem) e drop (remover).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Faça commits de rascunho à vontade enquanto trabalha, e conte a história limpa só na hora de " +
                "compartilhar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Ao trabalhar, é natural fazer commits imperfeitos: \"wip\", \"corrige typo\", \"agora funciona\". Eles " +
                "ajudam durante o desenvolvimento, mas não devem ir para o histórico compartilhado. O rebase " +
                "interativo permite transformar esse rascunho em uma história limpa, com commits atômicos e mensagens " +
                "boas, antes de abrir um PR. O caso de uso mais comum é o squash: juntar vários commits pequenos em um.",
            },
            {
              type: "paragraph",
              text:
                "Como todo rebase, reescreve o histórico, então vale a mesma regra de ouro: use em commits locais ou " +
                "ainda não compartilhados. Se algo der errado no meio, git rebase --abort volta ao estado " +
                "inicial, e o reflog (Concept mais adiante) permite recuperar mesmo depois de concluir.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a lista de tarefas do rebase interativo, e uma função que ilustra o que squash faz com dois commits:" },
            {
              type: "code",
              language: "text",
              filename: "interactive-rebase.txt",
              code: [
                "git rebase -i HEAD~4          # edita os últimos 4 commits",
                "",
                "pick   a1b2c3 Adiciona o formulário de cadastro",
                "squash d4e5f6 wip",
                "squash 7a8b9c corrige typo",
                "pick   0d1e2f Adiciona a validação de e-mail",
                "",
                "# resultado: 2 commits limpos em vez de 4",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "squash.js",
              code: [
                "// Squash: junta as mudanças de vários commits em um, mantendo a mensagem principal",
                "function squash(commits) {",
                "  return {",
                "    message: commits[0].message,",
                "    changes: commits.flatMap((commit) => commit.changes),",
                "  };",
                "}",
                "",
                "const result = squash([",
                "  { message: \"Adiciona o formulário de cadastro\", changes: [\"form.js\"] },",
                "  { message: \"wip\", changes: [\"form.css\"] },",
                "  { message: \"corrige typo\", changes: [\"form.js\"] },",
                "]);",
                "// result.message === \"Adiciona o formulário de cadastro\"; changes com os três conjuntos",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O trabalho é o mesmo, mas o histórico conta uma história limpa: um commit por mudança lógica, sem " +
                "os passos intermediários do rascunho.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para transformar o rascunho em história limpa antes de compartilhar: squash, reword, reordenar e descartar.",
                "Com `fixup` e `--autosquash`, para corrigir onde achou o problema e limpar tudo de uma vez no fim.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só em commits que ainda são seus, pelos mesmos motivos do rebase comum.",
                "Reordenar commits que dependem uns dos outros gera conflitos que precisam ser resolvidos.",
              ],
            },
          ],
          examples: [
            {
              title: "Squash: juntar commits de rascunho",
              context: "O caso de uso mais comum: vários commits pequenos viram um que conta a mudança inteira.",
              code: {
                language: "text",
                filename: "squash-todo.txt",
                code: [
                  "Antes (5 commits):                    Depois (1 commit):",
                  "  Adiciona login                        Adiciona login com e-mail e senha",
                  "  wip",
                  "  fix",
                  "  corrige teste",
                  "  agora funciona",
                  "",
                  "Lista de tarefas:",
                  "  pick   1111111 Adiciona login",
                  "  squash 2222222 wip",
                  "  squash 3333333 fix",
                  "  squash 4444444 corrige teste",
                  "  squash 5555555 agora funciona",
                ].join("\n"),
              },
              explanation:
                "O Git abre depois um editor para escrever a mensagem final do commit combinado — é o momento de " +
                "substituir a lista de mensagens de rascunho por uma boa mensagem.",
            },
            {
              title: "Reword e reordenar",
              context: "Corrigir uma mensagem ruim e colocar os commits em uma ordem que faz sentido.",
              code: {
                language: "text",
                filename: "reword-reorder.txt",
                code: [
                  "Antes:",
                  "  pick 1111111 Adiciona endpoint de pedidos",
                  "  pick 2222222 ajustes",
                  "  pick 3333333 Adiciona testes do endpoint",
                  "",
                  "Depois de editar a lista:",
                  "  pick   1111111 Adiciona endpoint de pedidos",
                  "  pick   3333333 Adiciona testes do endpoint     ← movido para logo depois do endpoint",
                  "  reword 2222222 ajustes                         ← o Git pede uma mensagem melhor",
                ].join("\n"),
              },
              explanation:
                "Reordenar linhas reordena os commits, e reword abre o editor só para a mensagem. Se a ordem criar " +
                "conflitos (um commit depende de outro), o Git avisa e é preciso resolver.",
            },
            {
              title: "fixup e autosquash: correções que já sabem onde ir",
              context: "Quando você percebe que uma correção pertence a um commit anterior, dá para marcá-la e deixar o Git juntar automaticamente.",
              code: {
                language: "text",
                filename: "fixup-autosquash.sh",
                code: [
                  "git commit --fixup a1b2c3          # cria \"fixup! Adiciona login\" ligado ao commit a1b2c3",
                  "",
                  "git rebase -i --autosquash main    # o Git já posiciona o fixup logo depois do commit alvo",
                  "                                   # e marca como fixup: basta salvar e fechar o editor",
                ].join("\n"),
              },
              explanation:
                "É a forma mais rápida de manter commits atômicos: corrija onde achar o problema, e a limpeza acontece de " +
                "uma vez no fim, sem ter de montar a lista à mão.",
            },
          ],
          exercise: {
            problem:
              "Sua branch local tem este histórico antes de abrir o PR, e você quer deixá-lo com dois commits limpos.",
            problemCode: {
              language: "text",
              filename: "history.txt",
              code: [
                "1111111 Adiciona busca de produtos",
                "2222222 wip",
                "3333333 Adiciona filtro por categoria",
                "4444444 corrige typo na busca",
                "5555555 fix filtro",
              ].join("\n"),
            },
            task:
              "Escreva a lista de tarefas do rebase interativo (comandos e ordem) que resulte em dois commits — " +
              "um para a busca e outro para o filtro — descartando o \"wip\" e juntando as correções.",
            hint: "Reordene para que cada correção fique logo depois do commit que ela corrige; use fixup para as correções e drop para o wip.",
            solution: {
              code: {
                language: "text",
                filename: "todo.answer.txt",
                code: [
                  "pick  1111111 Adiciona busca de produtos",
                  "fixup 4444444 corrige typo na busca",
                  "drop  2222222 wip",
                  "pick  3333333 Adiciona filtro por categoria",
                  "fixup 5555555 fix filtro",
                ].join("\n"),
              },
              explanation:
                "O typo da busca (4444444) foi movido para logo depois do commit da busca e virou fixup; o wip foi " +
                "descartado; o fix do filtro foi juntado ao commit do filtro. Resultado: dois commits atômicos, cada " +
                "um com sua correção incorporada.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Merge Conflicts",
          requires: ["Commit"],
          note: "colisão entre mudanças registradas em commits; pré-requisito conceitual mínimo é Commit (mesmo padrão de Merge/Rebase/Cherry-pick/Revert/Reset) — Merge e Rebase são onde o conflito aparece na prática (ordem de estudo, não Requires)",
          summary:
            "Um Merge Conflict acontece quando duas mudanças alteram o mesmo trecho de um arquivo e o Git não " +
            "consegue escolher sozinho.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Isso inclui o caso em que uma branch altera o que a outra apagou. O Git para no meio da operação, marca " +
                "os trechos em conflito no arquivo e espera que uma pessoa decida. Conflitos aparecem em merge, rebase, " +
                "cherry-pick e em qualquer operação que combine mudanças.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Resolver um conflito raramente é escolher um lado, e quase sempre é combinar o que cada mudança queria.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O Git resolve sozinho tudo o que consegue: mudanças em arquivos ou trechos diferentes se combinam sem " +
                "intervenção. O conflito é o limite: só uma pessoa sabe se, ao mesmo tempo, o preço passou a " +
                "ser 10 e 12, qual deles está certo — ou se o correto é uma combinação. Ele é o Git pedindo ajuda para " +
                "uma decisão que depende de intenção, não de algoritmo.",
            },
            {
              type: "paragraph",
              text:
                "No arquivo, o Git insere marcadores: <<<<<<< (início, a sua versão), ======= (separador) e >>>>>>> " +
                "(fim, a versão do outro lado). Resolver é editar o arquivo até ficar como deveria (removendo os " +
                "marcadores), rodar os testes, marcar como resolvido (git add) e continuar (git commit, ou git " +
                "rebase --continue). Um erro comum é resolver \"na pressa\" — manter as duas versões, ou apagar " +
                "uma sem entender — e gerar um código que compila mas está errado. Se a resolução ficar complicada, " +
                "git merge --abort (ou rebase --abort) volta ao começo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o arquivo com os marcadores e a versão resolvida combinando as duas intenções:" },
            {
              type: "code",
              language: "text",
              filename: "conflicted-file.txt",
              code: [
                "function shippingFee(weight) {",
                "<<<<<<< HEAD",
                "  return weight * 2 + 5;        // sua branch: acrescentou a taxa fixa de 5",
                "=======",
                "  return Math.ceil(weight) * 2; // outra branch: arredonda o peso para cima",
                ">>>>>>> feature/round-weight",
                "}",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "resolved.js",
              code: [
                "// Resolvido: as duas intenções são legítimas, então as duas ficam",
                "function shippingFee(weight) {",
                "  return Math.ceil(weight) * 2 + 5;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A resolução correta não foi escolher um lado nem manter os dois, e sim combinar o que cada mudança " +
                "queria: arredondar o peso e cobrar a taxa fixa. Essa decisão exige entender as duas mudanças — e " +
                "um teste depois, para confirmar.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Ficar sem marcadores não prova que o código está certo: rode os testes depois de resolver.",
                "Manter as duas versões \"para garantir\" produz código que compila, mas se comporta de forma errada.",
                "`--ours` e `--theirs` descartam o trabalho do outro lado; no rebase, os papéis de cada lado se invertem.",
              ],
            },
          ],
          examples: [
            {
              title: "Resolver combinando, e depois testar",
              context: "O conflito some quando o arquivo deixa de ter marcadores, mas isso não prova que o código está certo.",
              code: {
                language: "text",
                filename: "resolve-steps.sh",
                code: [
                  "git merge feature/round-weight     # CONFLICT (content): Merge conflict in src/shipping.js",
                  "git status                         # lista os arquivos em conflito (\"both modified\")",
                  "# 1. abrir src/shipping.js, decidir o resultado final, remover <<<<<<<, ======= e >>>>>>>",
                  "# 2. rodar os testes",
                  "git add src/shipping.js            # marca o conflito como resolvido",
                  "git commit                         # conclui o merge (a mensagem já vem preenchida)",
                ].join("\n"),
              },
              explanation:
                "Os passos são sempre os mesmos. O mais importante é o 2: um conflito \"resolvido\" que quebra os testes " +
                "é pior do que o conflito, porque parece concluído.",
            },
            {
              title: "A resolução apressada que quebra o código",
              context: "Manter as duas versões \"para garantir\" produz código que compila, mas se comporta de forma errada.",
              code: {
                language: "javascript",
                filename: "bad-resolution.js",
                code: [
                  "// Resolução ruim: as duas linhas foram mantidas, sem pensar",
                  "function shippingFee(weight) {",
                  "  return weight * 2 + 5;",
                  "  return Math.ceil(weight) * 2;   // nunca é executada: o primeiro return sai antes",
                  "}",
                  "",
                  "// O arquivo não tem mais marcadores, o Git aceita — mas o arredondamento se perdeu.",
                ].join("\n"),
              },
              explanation:
                "Nenhuma ferramenta avisa que o resultado está errado. Por isso, depois de resolver, é preciso ler o " +
                "resultado como um todo e rodar os testes.",
            },
            {
              title: "Escolher um lado por inteiro: --ours e --theirs",
              context: "Quando uma das versões deve simplesmente prevalecer (um arquivo gerado, por exemplo), dá para escolher sem editar.",
              code: {
                language: "text",
                filename: "ours-theirs.sh",
                code: [
                  "git checkout --ours   package-lock.json     # fica com a versão da branch em que estou",
                  "git checkout --theirs package-lock.json     # fica com a versão da branch que estou trazendo",
                  "git add package-lock.json",
                  "",
                  "# Atenção: em um REBASE, os papéis se invertem — \"ours\" é a base (main) e",
                  "# \"theirs\" é o seu commit sendo reaplicado.",
                ].join("\n"),
              },
              explanation:
                "É útil para arquivos que podem ser regenerados, mas para código de verdade, escolher um lado descarta " +
                "o trabalho do outro. A inversão de papéis no rebase é uma fonte clássica de confusão.",
            },
          ],
          exercise: {
            problem:
              "Ao fazer merge, o Git parou com um conflito neste trecho. As duas branches alteraram o limite de " +
              "tentativas de login por razões diferentes.",
            problemCode: {
              language: "text",
              filename: "conflict.txt",
              code: [
                "<<<<<<< HEAD",
                "const MAX_LOGIN_ATTEMPTS = 3;          // nossa branch: reduz para 3 por segurança (issue #77)",
                "=======",
                "const MAX_LOGIN_ATTEMPTS = 10;         // outra branch: aumenta para 10 (reclamações de suporte)",
                ">>>>>>> feature/support-friendly-login",
              ].join("\n"),
            },
            task:
              "Explique como você decidiria a resolução (o que precisa descobrir antes de editar) e escreva o " +
              "código resolvido, dizendo quais passos faria depois.",
            hint: "Não há resposta técnica certa: as duas mudanças conflitam em intenção. Quem decide qual é o valor correto para o produto?",
            solution: {
              code: {
                language: "javascript",
                filename: "conflict.resolved.js",
                code: [
                  "// Depois de conversar com as duas pessoas (segurança e suporte), a decisão foi:",
                  "// 5 tentativas, com bloqueio temporário em vez de definitivo.",
                  "const MAX_LOGIN_ATTEMPTS = 5;",
                  "",
                  "// Passos: remover os marcadores, rodar os testes de login, git add, git commit,",
                  "// e registrar a decisão na mensagem do merge.",
                ].join("\n"),
              },
              explanation:
                "É um conflito de intenção, não de código: escolher 3 ou 10 sozinha descartaria uma necessidade legítima. " +
                "A resolução exigiu uma conversa, e a decisão ficou registrada na mensagem do commit para quem " +
                "estranhar depois.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Cherry-pick",
          requires: ["Commit"],
          note: "copiar um commit específico de uma branch para outra",
          summary: "Cherry-pick é copiar para a branch atual a mudança de um commit específico, como um commit novo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O comando é git cherry-pick <commit>, e o commit criado tem outro hash. Ao contrário de merge e rebase, " +
                "que integram linhas inteiras de histórico, o cherry-pick copia apenas o que você escolhe.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Cherry-pick é o jeito de levar um hotfix para a release sem levar junto o resto da main.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O caso mais típico é o hotfix: uma correção foi feita na main, mas a versão em produção está em uma " +
                "branch de release que não pode receber o resto das mudanças da main. Com cherry-pick, leva-se só o " +
                "commit da correção. Também é útil para aproveitar um commit de uma branch abandonada ou para " +
                "recuperar uma mudança específica sem trazer toda a branch. Isso só é prático se o commit for " +
                "atômico — mais um motivo para commits pequenos e focados.",
            },
            {
              type: "paragraph",
              text:
                "Os cuidados: como o commit copiado é novo, o mesmo conteúdo passa a existir duas vezes no histórico, com " +
                "hashes diferentes, e o Git não sabe que são \"o mesmo\" — o que pode gerar conflitos ou duplicação " +
                "quando as branches forem mescladas depois. A opção -x acrescenta à mensagem a referência ao commit " +
                "original, deixando o rastro. Se você quer trazer muitas mudanças, use merge ou rebase, não " +
                "uma sequência de cherry-picks.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "levar uma correção da main para a branch de release, e um modelo do que acontece com o commit:" },
            {
              type: "code",
              language: "text",
              filename: "cherry-pick.sh",
              code: [
                "git log --oneline main -3           # e5f6a7b Corrige o cálculo do imposto   ← queremos só este",
                "git switch release/2.1",
                "git cherry-pick -x e5f6a7b          # copia a correção para a release, registrando a origem",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "cherry-pick-model.js",
              code: [
                "// Cherry-pick copia um commit para outra branch, com um identificador novo",
                "function cherryPick(targetBranch, commit) {",
                "  return [...targetBranch, { ...commit, id: commit.id + \"'\", origin: commit.id }];",
                "}",
                "",
                "const release = [{ id: \"R1\" }, { id: \"R2\" }];",
                "const fix = { id: \"e5f6a7b\", message: \"Corrige o cálculo do imposto\" };",
                "",
                "const updated = cherryPick(release, fix);",
                "// updated termina com { id: \"e5f6a7b'\", origin: \"e5f6a7b\", ... }  ← mesma mudança, commit novo",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A release ganhou a correção sem receber nenhuma das outras mudanças da main. O commit novo é uma " +
                "cópia: o conteúdo é o mesmo, mas a identidade (o hash) é diferente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para levar uma correção pontual, como um hotfix numa branch de release, sem o resto do trabalho.",
                "Com `-x`, para registrar na mensagem de onde o commit foi copiado.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Copiar commits cria duplicatas que o Git não relaciona entre si e torna o histórico menos previsível.",
                "Se precisa copiar muitos commits, merge ou rebase costumam ser mais adequados.",
              ],
            },
          ],
          examples: [
            {
              title: "Hotfix para uma branch de release",
              context: "A correção existe na main, e a versão em produção precisa dela sem as funcionalidades novas.",
              code: {
                language: "text",
                filename: "hotfix.sh",
                code: [
                  "git switch main",
                  "git log --oneline -1                       # 9c8d7e6 Corrige vazamento de sessão",
                  "",
                  "git switch release/2.1",
                  "git cherry-pick -x 9c8d7e6                 # a correção vai para a release",
                  "git push origin release/2.1                # e pode ser publicada como 2.1.1",
                ].join("\n"),
              },
              explanation:
                "A release recebe apenas a correção. O -x deixa na mensagem \"(cherry picked from commit 9c8d7e6)\", que " +
                "ajuda a rastrear depois que aquele commit é uma cópia de outro.",
            },
            {
              title: "Vários commits e conflitos",
              context: "É possível copiar uma sequência; cada commit pode gerar conflitos que exigem resolução, como num merge.",
              code: {
                language: "text",
                filename: "cherry-pick-range.sh",
                code: [
                  "git cherry-pick A..C                # copia os commits depois de A até C (A não incluso)",
                  "",
                  "# Se algum der conflito:",
                  "#   resolver o arquivo → git add → git cherry-pick --continue",
                  "#   ou desistir      → git cherry-pick --abort",
                ].join("\n"),
              },
              explanation:
                "Cherry-pick usa a mesma mecânica de conflito das outras operações. Se você precisa copiar muitos " +
                "commits, é sinal de que talvez um merge ou rebase seja mais adequado.",
            },
            {
              title: "Quando não usar",
              context: "Copiar commits cria duplicatas que o Git não relaciona entre si.",
              code: {
                language: "text",
                filename: "cherry-pick-pitfall.txt",
                code: [
                  "main:     A---B---C---D",
                  "release:  A---B---C'          (C' é uma cópia do C)",
                  "",
                  "Mais tarde: git merge main dentro da release",
                  "  → o Git vê C (da main) e C' (da release) como mudanças diferentes",
                  "  → pode gerar conflito ou aplicar a mesma alteração duas vezes",
                  "",
                  "Regra: cherry-pick é para casos pontuais; para integrar de forma contínua, use merge/rebase.",
                ].join("\n"),
              },
              explanation:
                "O custo do cherry-pick é o de tornar o histórico menos previsível. Vale como exceção (hotfix), não como " +
                "forma normal de mover trabalho entre branches.",
            },
          ],
          exercise: {
            problem:
              "A branch de produção release/3.0 tem um bug de segurança. A correção já foi feita na main no " +
              "commit 4d2e1f0, mas a main também tem mais dez commits de funcionalidades novas ainda não " +
              "testadas.",
            problemCode: {
              language: "text",
              filename: "situation.txt",
              code: [
                "main:         ... 4d2e1f0 Corrige XSS no campo de busca   ← a correção",
                "              ... (mais 10 commits de funcionalidades novas)",
                "release/3.0:  ... (versão em produção)",
              ].join("\n"),
            },
            task:
              "Escreva os comandos para levar somente a correção para a release, e explique por que merge não " +
              "serve neste caso.",
            hint: "Você precisa de um commit só. Um merge traria também os dez outros.",
            solution: {
              code: {
                language: "text",
                filename: "situation.answer.sh",
                code: [
                  "git switch release/3.0",
                  "git cherry-pick -x 4d2e1f0     # só a correção; -x registra de onde veio",
                  "# rodar os testes da release, depois publicar como 3.0.1",
                ].join("\n"),
              },
              explanation:
                "Um merge da main traria as dez funcionalidades não testadas para produção. O cherry-pick copia só " +
                "o commit da correção — possível porque ele é atômico e não depende dos outros.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Revert",
          requires: ["Commit"],
          note: "desfazer seguro/público — ensinar em par com Reset",
          summary: "Revert é desfazer um commit criando um commit novo com a mudança inversa.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O comando git revert <commit> não apaga nada: se o commit adicionou uma linha, o revert a remove; se " +
                "removeu um arquivo, o revert o traz de volta. O histórico fica com os dois commits — o original e o que " +
                "o desfaz — e conta a história completa do que aconteceu.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um revert é uma mudança como qualquer outra, e por isso passa por revisão, testes e deploy como qualquer " +
                "outra.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando um commit ruim já está em uma branch compartilhada (por exemplo, na main e talvez em " +
                "produção), reescrever o histórico para apagá-lo prejudicaria todos que já baixaram esse commit. O " +
                "revert desfaz o efeito sem mexer no passado: é apenas mais um commit à frente, que qualquer pessoa " +
                "recebe com um pull normal. É a forma segura de desfazer no que é público — o par de Reset, que " +
                "serve para o que é local.",
            },
            {
              type: "paragraph",
              text:
                "Para reverter um merge commit é preciso dizer qual dos dois pais é a linha principal " +
                "(git revert -m 1 <merge>). Também é possível reverter vários commits de uma vez e até reverter " +
                "um revert — o que traz a mudança de volta, útil quando um problema foi corrigido e o " +
                "recurso original pode voltar.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o comando e um modelo em que o revert é a mudança inversa:" },
            {
              type: "code",
              language: "text",
              filename: "revert.sh",
              code: [
                "git log --oneline -3     # 7a1b2c3 Ativa o novo cálculo de preços   ← causou o problema",
                "git revert 7a1b2c3       # cria: \"Revert 'Ativa o novo cálculo de preços'\"",
                "git push                 # publicar é seguro: só adicionou um commit",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "revert-model.js",
              code: [
                "// Um commit registra o que foi adicionado e o que foi removido",
                "const commit = { added: [\"if (useNewPricing) ...\"], removed: [\"return legacyPrice(cart);\"] };",
                "",
                "// Revert: troca os dois lados — o que foi adicionado é removido, e vice-versa",
                "function revert(change) {",
                "  return { added: change.removed, removed: change.added };",
                "}",
                "",
                "const undo = revert(commit);",
                "// undo.added === [\"return legacyPrice(cart);\"]  → o código antigo volta",
                "// O histórico agora tem os DOIS commits; nada foi apagado.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O revert é uma mudança normal, que pode ser revisada, testada e publicada como qualquer outra — e " +
                "que registra, no histórico, que aquele commit foi desfeito.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para desfazer um commit que já está numa branch compartilhada, sem reescrever o passado.",
                "Para trazer de volta uma mudança revertida, revertendo o próprio revert.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Reverter um merge commit exige dizer ao Git qual linha é a principal, e reintegrar a branch depois pede " +
                "cuidado.",
                "O histórico continua com o commit original e o inverso: ele desfaz o efeito, não apaga a mudança.",
              ],
            },
          ],
          examples: [
            {
              title: "Desfazer um commit que já está na main",
              context: "O commit ruim já foi publicado e outras pessoas o receberam.",
              code: {
                language: "text",
                filename: "revert-public.txt",
                code: [
                  "Antes:   main: A---B---C(bug)---D",
                  "",
                  "git revert C",
                  "",
                  "Depois:  main: A---B---C(bug)---D---C'(Revert \"C\")",
                  "",
                  "O bug sumiu do código, e o histórico continua igual para quem já tinha A, B, C, D.",
                ].join("\n"),
              },
              explanation:
                "Quem já baixou a main recebe C' como um commit novo comum. Nada precisa ser refeito ou coordenado, ao " +
                "contrário do que aconteceria ao apagar o C do histórico.",
            },
            {
              title: "Reverter um merge commit",
              context: "Um merge tem dois pais, então o Git precisa saber qual linha deve ser considerada a \"principal\".",
              code: {
                language: "text",
                filename: "revert-merge.sh",
                code: [
                  "git revert -m 1 <hash-do-merge>    # -m 1: mantém a linha do primeiro pai (a main)",
                  "                                   # e desfaz tudo o que a branch trouxe",
                  "",
                  "# Atenção: para reintegrar essa branch depois, é preciso reverter o revert antes,",
                  "# senão o Git acha que aquelas mudanças já foram incorporadas.",
                ].join("\n"),
              },
              explanation:
                "Reverter o merge desfaz o efeito da branch inteira. O cuidado ao reintegrá-la depois é uma das " +
                "armadilhas mais conhecidas do Git.",
            },
            {
              title: "Reverter o revert: trazer a mudança de volta",
              context: "Quando o problema original foi corrigido, o commit revertido pode voltar.",
              code: {
                language: "text",
                filename: "revert-the-revert.sh",
                code: [
                  "git revert 7a1b2c3          # desfaz a funcionalidade (commit R1)",
                  "# ... a causa do bug é corrigida em outra branch ...",
                  "git revert R1               # reverte o revert: a funcionalidade volta",
                ].join("\n"),
              },
              explanation:
                "Como o revert é um commit como outro qualquer, também pode ser revertido. Isso é mais limpo do " +
                "que refazer o trabalho à mão.",
            },
          ],
          exercise: {
            problem:
              "Um commit que quebra o login foi mesclado na main e publicado há uma hora. Três pessoas já baixaram " +
              "a main. Você precisa desfazê-lo com urgência.",
            problemCode: {
              language: "text",
              filename: "situation.txt",
              code: [
                "main (publicada): ... 5e4d3c2 Refatora o módulo de autenticação   ← quebra o login",
                "                  ... 8f7a6b5 Atualiza o texto da página inicial",
              ].join("\n"),
            },
            task:
              "Escreva o comando adequado, e explique por que apagar o commit com reset e forçar o push seria pior " +
              "nesta situação.",
            hint: "Pense nas três pessoas que já têm o commit ruim, e no que aconteceria ao histórico delas se ele desaparecesse.",
            solution: {
              code: {
                language: "text",
                filename: "situation.answer.sh",
                code: [
                  "git revert 5e4d3c2       # cria um commit que desfaz a refatoração; o commit 8f7a6b5 fica intacto",
                  "git push                 # push normal, sem --force",
                ].join("\n"),
              },
              explanation:
                "O revert desfaz o efeito sem reescrever nada: as três pessoas apenas recebem um commit novo no próximo " +
                "pull. Um reset seguido de push forçado reescreveria a história compartilhada: o histórico local delas " +
                "divergiria, e o commit 8f7a6b5 (que não tinha nada a ver) poderia ser perdido.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Reset",
          requires: ["Commit"],
          note: "desfazer local/mutável — ensinar em par com Revert",
          summary:
            "Reset é mover a branch atual para outro commit e, conforme o modo, também a área de preparação e os " +
            "arquivos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Os commits posteriores são \"esquecidos\". O modo decide o resto: --soft mantém tudo (as mudanças ficam " +
                "preparadas, prontas para um novo commit); --mixed (o padrão) desfaz a preparação, mas mantém os arquivos " +
                "como estão; --hard descarta tudo, voltando os arquivos ao estado do commit.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Antes de um reset, saiba quantos lugares ele vai mexer: só o ponteiro, a preparação ou também os seus " +
                "arquivos.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "É a ferramenta para desfazer trabalho local: refazer um commit com uma mensagem melhor, despreparar " +
                "arquivos que foram adicionados por engano, ou abandonar por completo o que não deu certo. Como " +
                "reescreve o histórico (os commits \"esquecidos\" deixam de fazer parte da branch), é o par do " +
                "Revert, que serve para o que já é compartilhado: reset para o que é só seu, revert para o que é " +
                "de todos.",
            },
            {
              type: "paragraph",
              text:
                "Os riscos: --hard descarta mudanças não commitadas, e elas não podem ser recuperadas (não estavam " +
                "no histórico); e usar reset em commits já publicados leva a um histórico que diverge do dos " +
                "outros. Se você desfizer algo por engano, o reflog (próximo Concept) costuma permitir recuperar os " +
                "commits \"perdidos\" — mas nunca as mudanças que nunca foram commitadas.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "os três modos e um modelo das três \"áreas\" que o reset pode mover:" },
            {
              type: "code",
              language: "text",
              filename: "reset.sh",
              code: [
                "git reset --soft  HEAD~1   # desfaz o commit; as mudanças ficam PREPARADAS",
                "git reset --mixed HEAD~1   # desfaz o commit; as mudanças ficam nos arquivos, NÃO preparadas",
                "git reset --hard  HEAD~1   # desfaz o commit E descarta as mudanças (perigoso!)",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "reset-model.js",
              code: [
                "// O Git mantém três \"lugares\": o commit atual (HEAD), a área de preparação (index) e os arquivos",
                "function reset(state, mode, target) {",
                "  const next = { ...state, head: target };",
                "  if (mode === \"mixed\" || mode === \"hard\") next.index = target;   // mixed e hard mexem na preparação",
                "  if (mode === \"hard\") next.workdir = target;                      // só hard mexe nos arquivos",
                "  return next;",
                "}",
                "",
                "const state = { head: \"C3\", index: \"C3\", workdir: \"C3\" };",
                "reset(state, \"soft\",  \"C2\"); // { head: C2, index: C3, workdir: C3 }  ← só o ponteiro mudou",
                "reset(state, \"mixed\", \"C2\"); // { head: C2, index: C2, workdir: C3 }  ← arquivos preservados",
                "reset(state, \"hard\",  \"C2\"); // { head: C2, index: C2, workdir: C2 }  ← tudo voltou a C2",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada modo vai um passo mais fundo: soft mexe só no ponteiro, mixed também na preparação, hard nos três. " +
                "Saber quantos lugares o comando vai mexer é a chave para usá-lo sem susto.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para desfazer o que é só seu: `--soft` refaz o commit, `--mixed` tira arquivos da preparação.",
                "Escolha o modo pelo que quer preservar, e desconfie de `--hard`.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "`--hard` descarta as mudanças não commitadas sem volta, e nem o reflog as recupera.",
                "Reset reescreve o histórico da branch: não use em commits que já são compartilhados; nesse caso, `revert`.",
              ],
            },
          ],
          examples: [
            {
              title: "--soft: refazer o último commit",
              context: "Quando o commit está certo, mas a mensagem ou o conteúdo precisa de ajuste, sem perder as mudanças.",
              code: {
                language: "text",
                filename: "reset-soft.sh",
                code: [
                  "git commit -m \"ajustes\"                   # mensagem ruim, e esqueceu um arquivo",
                  "git reset --soft HEAD~1                   # o commit some, mas tudo continua preparado",
                  "git add src/esquecido.js                  # acrescenta o que faltou",
                  "git commit -m \"Corrige o cálculo do desconto\"   # commit refeito, com boa mensagem",
                ].join("\n"),
              },
              explanation:
                "Nada se perdeu: as mudanças continuaram preparadas o tempo todo. (Para mudar só a mensagem do último " +
                "commit, git commit --amend faz o mesmo em um passo.)",
            },
            {
              title: "--mixed: despreparar o que entrou por engano",
              context: "O padrão do reset: tira os arquivos da preparação sem tocar no conteúdo deles.",
              code: {
                language: "text",
                filename: "reset-mixed.sh",
                code: [
                  "git add .                       # adicionou tudo, inclusive o arquivo .env com segredos!",
                  "git reset .env                  # retira só o .env da preparação (o arquivo continua no disco)",
                  "echo \".env\" >> .gitignore       # e evita que aconteça de novo",
                ].join("\n"),
              },
              explanation:
                "O reset sem commit alvo age só sobre a área de preparação. Os arquivos ficam intactos, o que torna a " +
                "operação segura para \"despreparar\".",
            },
            {
              title: "--hard: descartar tudo (com cuidado)",
              context: "Abandonar de vez um experimento — e por que essa é a operação mais perigosa.",
              code: {
                language: "text",
                filename: "reset-hard.sh",
                code: [
                  "git reset --hard origin/main   # a branch local passa a ser idêntica à remota",
                  "                               # commits locais E mudanças não commitadas DESAPARECEM",
                  "",
                  "# Antes de usar, confirme o que será perdido:",
                  "git status                     # há mudanças não commitadas?",
                  "git log origin/main..HEAD      # há commits locais não publicados?",
                ].join("\n"),
              },
              explanation:
                "As mudanças não commitadas não existem no histórico, então nem o reflog as recupera. Os commits " +
                "locais, ao contrário, geralmente ainda podem ser resgatados pelo reflog.",
            },
          ],
          exercise: {
            problem:
              "Três situações da rotina, cada uma pedindo um modo diferente de reset.",
            problemCode: {
              language: "text",
              filename: "scenarios.txt",
              code: [
                "A) Você fez um commit local, mas percebeu que ele mistura duas coisas. Quer desfazê-lo e commitar",
                "   as duas separadamente, sem perder nenhuma alteração.",
                "B) Você deu git add em um arquivo de log por engano e quer apenas tirá-lo da preparação.",
                "C) Um experimento local não deu certo e você quer voltar a branch exatamente ao commit anterior,",
                "   descartando tudo o que fez desde então (nenhuma parte dele vale a pena).",
              ].join("\n"),
            },
            task:
              "Para cada cenário, escreva o comando (com o modo) e diga o que ele preserva ou descarta.",
            hint: "soft mantém as mudanças preparadas, mixed mantém-nas nos arquivos, hard descarta. O cenário B envolve só a área de preparação.",
            solution: {
              code: {
                language: "text",
                filename: "scenarios.answer.sh",
                code: [
                  "A) git reset --mixed HEAD~1   # desfaz o commit; mudanças ficam nos arquivos, prontas para",
                  "                              # serem preparadas em dois commits (--soft também serviria)",
                  "B) git reset app.log          # tira só o arquivo da preparação; o arquivo continua intacto",
                  "C) git reset --hard HEAD~1    # volta ao commit anterior e descarta as mudanças (irreversível",
                  "                              # para o que não estava commitado — confira com git status antes)",
                ].join("\n"),
              },
              explanation:
                "Em A, mixed permite reorganizar o que vai em cada commit; em B, o reset sem alvo só mexe na preparação; " +
                "em C, hard é a escolha porque o objetivo é justamente descartar — com a checagem prévia de que não há " +
                "nada valioso não commitado.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Reflog",
          requires: ["Reset"],
          note: "rede de segurança para recuperar de Reset/Rebase mal feitos",
          summary: "O Reflog é o registro local de todos os lugares para onde o HEAD e as branches apontaram.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Cada vez que o HEAD (ou uma branch) muda de lugar — commit, checkout, reset, rebase, merge — o Git " +
                "anota. git reflog mostra essa lista, com entradas como HEAD@{0} (agora), HEAD@{1} (a posição anterior) e " +
                "assim por diante, cada uma com o hash e o que aconteceu.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Sumir do `git log` não é o mesmo que ser apagado, e o reflog ainda sabe onde o commit estava.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Operações como reset --hard, rebase ou apagar uma branch fazem os commits deixarem de aparecer no " +
                "git log — mas eles não são apagados na hora. O reflog ainda guarda onde estavam, então quase " +
                "todo \"desastre\" com commits pode ser desfeito: basta achar o hash da posição anterior e voltar para " +
                "ele. É o que torna seguras as operações mais arriscadas do Git.",
            },
            {
              type: "paragraph",
              text:
                "Limites importantes: o reflog é local (existe só na sua máquina, não é enviado ao remoto), e as entradas " +
                "expiram depois de algum tempo (em geral cerca de 90 dias) — passado isso, os commits órfãos são " +
                "apagados. E ele só registra o que foi commitado: mudanças que nunca chegaram a um commit " +
                "(descartadas com reset --hard) não podem ser recuperadas por aqui.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "recuperar depois de um reset --hard, e um modelo do reflog como uma lista de posições:" },
            {
              type: "code",
              language: "text",
              filename: "reflog.sh",
              code: [
                "git reset --hard HEAD~2      # oops: dois commits \"sumiram\" do git log",
                "git reflog                   # HEAD@{0}: reset...   HEAD@{1}: commit: Adiciona o filtro (9f8e7d6)",
                "git reset --hard HEAD@{1}    # volta para onde estávamos antes do reset",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "reflog-model.js",
              code: [
                "// O reflog é uma lista das posições do HEAD, da mais recente para a mais antiga",
                "const reflog = [];",
                "function moveHead(commit) {",
                "  reflog.unshift(commit);",
                "}",
                "const at = (n) => reflog[n];              // HEAD@{n}",
                "",
                "moveHead(\"C1\"); moveHead(\"C2\"); moveHead(\"C3\");  // três commits",
                "moveHead(\"C1\");                                  // reset --hard para C1 (C2 e C3 saem do log)",
                "",
                "at(0); // \"C1\"  → onde estou agora",
                "at(1); // \"C3\"  → onde eu estava antes do reset: dá para voltar para ele!",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Mesmo depois do reset, C3 ainda está registrado como a posição anterior. Enquanto a entrada existir, o " +
                "commit pode ser resgatado.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para recuperar uma branch apagada, já que só o nome some e os commits continuam no repositório.",
                "Para desfazer um rebase ou reset que deu errado, voltando ao ponto anterior.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só o que foi commitado aparece: o trabalho que nunca virou commit não tem registro.",
                "É uma rede de segurança local e temporária, não um backup; comite (mesmo um commit temporário) antes de " +
                "operações destrutivas.",
              ],
            },
          ],
          examples: [
            {
              title: "Recuperar uma branch apagada",
              context: "Apagar uma branch remove só o nome; os commits continuam no repositório e no reflog.",
              code: {
                language: "text",
                filename: "recover-branch.sh",
                code: [
                  "git branch -D feature/relatorio      # apagou por engano",
                  "git reflog                           # ...checkout: moving from feature/relatorio to main",
                  "                                     # o hash da ponta da branch aparece na entrada anterior",
                  "git branch feature/relatorio 3c2b1a0 # recria a branch apontando para o hash encontrado",
                ].join("\n"),
              },
              explanation:
                "A branch é apenas um ponteiro para um commit. Recriar o ponteiro (com o hash certo) traz de volta " +
                "todo o trabalho.",
            },
            {
              title: "Desfazer um rebase que deu errado",
              context: "Depois de um rebase confuso, o reflog mostra onde a branch estava antes dele.",
              code: {
                language: "text",
                filename: "undo-rebase.sh",
                code: [
                  "git rebase main                      # conflitos demais, o resultado ficou estranho",
                  "git reflog                           # ...rebase (start): checkout main",
                  "                                     # HEAD@{5}: commit: Última coisa que fiz antes do rebase",
                  "git reset --hard HEAD@{5}            # a branch volta exatamente ao estado de antes",
                  "",
                  "# Atalho: ORIG_HEAD guarda o ponto anterior à última operação \"perigosa\":",
                  "git reset --hard ORIG_HEAD",
                ].join("\n"),
              },
              explanation:
                "É esse tipo de reversão que torna seguro experimentar com rebase e reset: o estado anterior fica " +
                "guardado por semanas, mesmo que o git log não o mostre.",
            },
            {
              title: "O que o reflog não salva",
              context: "Só existe no reflog o que foi commitado; o trabalho que nunca virou commit não tem registro.",
              code: {
                language: "text",
                filename: "reflog-limits.txt",
                code: [
                  "Recuperável pelo reflog:",
                  "  - commits \"perdidos\" por reset, rebase, amend, checkout",
                  "  - ponta de branches apagadas",
                  "",
                  "NÃO recuperável:",
                  "  - mudanças nunca commitadas descartadas com reset --hard ou checkout -- arquivo",
                  "  - qualquer coisa depois que a entrada expira (~90 dias) e o Git limpa o repositório",
                  "  - o que aconteceu em OUTRA máquina (o reflog é local)",
                  "",
                  "Regra prática: na dúvida, faça um commit antes de uma operação arriscada.",
                ].join("\n"),
              },
              explanation:
                "O reflog é uma rede de segurança, não um backup. O hábito de commitar (mesmo um commit temporário) antes " +
                "de operações destrutivas é o que mantém tudo recuperável.",
            },
          ],
          exercise: {
            problem:
              "Você estava em uma branch com três commits novos e rodou, por engano, o comando abaixo. Agora o " +
              "git log mostra a branch sem esses commits.",
            problemCode: {
              language: "text",
              filename: "disaster.txt",
              code: [
                "git log --oneline",
                "  c3c3c3c Adiciona a exportação em PDF",
                "  b2b2b2b Adiciona a tela de relatórios",
                "  a1a1a1a Adiciona o modelo de relatórios",
                "  0f0f0f0 (base) Versão anterior",
                "",
                "git reset --hard 0f0f0f0     # ← engano: era para ser 'git reset --soft'",
              ].join("\n"),
            },
            task:
              "Explique como recuperar os três commits usando o reflog e escreva os comandos.",
            hint: "O commit c3c3c3c (a ponta anterior) ainda está registrado no reflog como a posição do HEAD antes do reset.",
            solution: {
              code: {
                language: "text",
                filename: "disaster.answer.sh",
                code: [
                  "git reflog                    # HEAD@{0}: reset: moving to 0f0f0f0",
                  "                              # HEAD@{1}: commit: Adiciona a exportação em PDF (c3c3c3c)",
                  "git reset --hard c3c3c3c      # (ou HEAD@{1}) a branch volta com os três commits",
                  "git log --oneline             # confere: c3c3c3c, b2b2b2b, a1a1a1a, 0f0f0f0",
                ].join("\n"),
              },
              explanation:
                "O reset moveu só o ponteiro da branch; os três commits continuaram no repositório e no reflog. Como " +
                "estavam commitados, nada se perdeu — o que não teria salvação são mudanças que nunca virassem commit.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Git Bisect",
          requires: ["Testing & Quality Engineering / Debugging / Git Bisect"],
          canonical: false,
          revisitOf: "Testing & Quality Engineering / Debugging / Git Bisect",
          note: "não é uma 2ª Task canônica — só ponteiro/referência, mesmo padrão de Call Stack em Asynchronous Programming",
        }),
        concept({
          order: 110,
          title: "Branching Strategies",
          requires: ["Merge", "Rebase"],
          note: "capstone — trunk-based × git-flow, no nível de workflow de equipe",
          summary:
            "Uma Branching Strategy é o acordo da equipe sobre quais branches existem, quanto tempo vivem e como o " +
            "trabalho chega à principal.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O Git permite criar branches à vontade, mas não diz como usá-las. O acordo também define quem cria cada " +
                "branch e como as versões chegam à produção. É a camada de fluxo de trabalho sobre as operações que você " +
                "já viu (Merge, Rebase).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Separe a decisão de integrar da decisão de liberar, e o código entra na main antes de estar pronto para " +
                "o usuário.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem um acordo, cada pessoa usa branches de um jeito, e o custo aparece em conflitos, integrações " +
                "atrasadas e incerteza sobre o que está pronto para ir ao ar. O ponto central de qualquer " +
                "estratégia é o quanto tempo o trabalho fica isolado: quanto mais tempo uma branch vive sem se " +
                "integrar, mais ela diverge da principal e mais dolorosa é a junção (o clássico \"merge hell\").",
            },
            {
              type: "paragraph",
              text:
                "Três modelos comuns. Trunk-based development: todos integram na principal (o trunk) ao menos uma " +
                "vez por dia, com branches muito curtas ou direto nela; o código incompleto fica escondido por " +
                "feature flags; exige boa integração contínua e testes. GitHub Flow: a main está sempre pronta " +
                "para produção e cada mudança vem de uma branch curta, revisada em um pull request. Git Flow: " +
                "branches de longa duração (main e develop) mais branches de funcionalidade, de release e de " +
                "hotfix, pensado para releases planejadas e várias versões mantidas em paralelo.",
            },
            {
              type: "paragraph",
              text:
                "Não existe estratégia melhor em abstrato: depende da cadência de releases, do tamanho da equipe, da " +
                "maturidade de testes e integração contínua, e de haver ou não várias versões em produção ao mesmo " +
                "tempo. Equipes que entregam com frequência e têm boa automação tendem ao trunk-based; produtos " +
                "com versões instaladas pelos clientes e releases datadas às vezes precisam do Git Flow.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o fluxo de um dia no trunk-based, com a funcionalidade incompleta escondida por uma flag:" },
            {
              type: "code",
              language: "text",
              filename: "trunk-based.sh",
              code: [
                "git switch -c novo-checkout-passo-1      # branch curta: vive horas, não semanas",
                "# ... escreve o código do novo checkout, escondido atrás de uma flag ...",
                "git commit -m \"Adiciona o esqueleto do novo checkout (desligado por flag)\"",
                "git pull --rebase origin main            # traz o que os outros integraram",
                "git push                                # abre um PR pequeno, revisado no mesmo dia e mesclado na main",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "feature-flag.js",
              code: [
                "// O código novo já está na main (integrado), mas desligado: ninguém o vê ainda",
                "const flags = { newCheckout: false };",
                "",
                "function checkout(cart) {",
                "  if (flags.newCheckout) return newCheckoutFlow(cart);   // incompleto, mas integrado",
                "  return legacyCheckoutFlow(cart);                       // comportamento atual, intacto",
                "}",
                "// Quando o novo fluxo estiver pronto e testado, a flag é ligada — sem um merge gigante.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O trabalho é integrado em pedaços pequenos e frequentes, e a decisão de liberar é separada da de " +
                "integrar. Não há uma branch de longa duração para divergir — o que remove a fonte principal de conflitos.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Branches de longa duração encarecem a integração: o custo de mesclar cresce mais rápido que o tempo.",
                "Git Flow com deploys diários acrescenta cerimônia sem benefício; ele faz sentido para releases planejadas.",
                "Trunk-based sem testes automatizados coloca a main em risco.",
              ],
            },
          ],
          examples: [
            {
              title: "Git Flow: branches em camadas",
              context: "Um modelo com papéis distintos para cada branch, pensado para releases planejadas.",
              code: {
                language: "text",
                filename: "git-flow.txt",
                code: [
                  "main         ← só código já liberado (cada commit = uma versão em produção, com tag)",
                  "develop      ← linha de integração das funcionalidades da próxima release",
                  "feature/*    ← uma por funcionalidade; sai de develop e volta para develop",
                  "release/*    ← estabilização de uma versão (só correções); vai para main e develop",
                  "hotfix/*     ← correção urgente em produção; sai de main e volta para main e develop",
                  "",
                  "Vantagem: controle claro sobre o que entra em cada release; suporte a várias versões.",
                  "Custo: várias branches de longa duração, mais merges e mais chance de divergência.",
                ].join("\n"),
              },
              explanation:
                "O Git Flow faz sentido quando releases são eventos planejados (aplicativos móveis, software instalado). " +
                "Para quem entrega continuamente, é uma cerimônia a mais que atrasa a integração.",
            },
            {
              title: "O custo das branches de longa duração",
              context: "Quanto mais uma branch vive isolada, mais cara fica a integração.",
              code: {
                language: "text",
                filename: "long-lived-branch.txt",
                code: [
                  "Branch de 1 dia:    12 arquivos alterados na main enquanto isso  → 1 conflito, resolve em minutos",
                  "Branch de 3 semanas: 340 arquivos alterados na main enquanto isso → 27 conflitos, um dia de trabalho",
                  "                     + a funcionalidade foi testada sobre uma base que já não existe mais",
                  "",
                  "Mesmo esforço de desenvolvimento; custo de integração 50 vezes maior.",
                ].join("\n"),
              },
              explanation:
                "Os números são ilustrativos, mas a tendência é real: o custo de mesclar cresce muito mais rápido que o " +
                "tempo. É por isso que a maioria das estratégias modernas incentiva branches curtas.",
            },
            {
              title: "Escolher pelo contexto",
              context: "Cada modelo é a resposta a um conjunto de restrições diferente.",
              code: {
                language: "text",
                filename: "choosing.txt",
                code: [
                  "Trunk-based   → deploy várias vezes ao dia, boa cobertura de testes e CI, equipe experiente",
                  "GitHub Flow   → aplicação web com deploy contínuo, revisão por pull request, uma versão em produção",
                  "Git Flow      → releases datadas, várias versões mantidas em paralelo, QA de release separado",
                  "",
                  "Sinal de alerta em qualquer modelo: branches com semanas de vida e PRs gigantes.",
                ].join("\n"),
              },
              explanation:
                "A escolha errada não é a que \"não é a moda\", mas a que não combina com a realidade: usar Git Flow com deploys " +
                "diários adiciona cerimônia sem benefício, e usar trunk-based sem testes automatizados coloca a main em risco.",
            },
          ],
          exercise: {
            problem:
              "Três equipes pediram ajuda para escolher uma estratégia de branching.",
            problemCode: {
              language: "text",
              filename: "teams.txt",
              code: [
                "Equipe A: aplicativo web, deploy diário, boa cobertura de testes automatizados, 8 pessoas.",
                "Equipe B: aplicativo móvel com releases mensais aprovadas pelas lojas; três versões antigas ainda",
                "          precisam de correções de segurança.",
                "Equipe C: 3 pessoas, um serviço interno, deploy manual quando alguém lembra, sem testes automatizados.",
              ].join("\n"),
            },
            task:
              "Recomende uma estratégia para cada equipe, justificando pelo contexto, e aponte qual prática " +
              "(além da estratégia em si) a equipe C deveria adotar antes de qualquer outra coisa.",
            hint: "Considere a frequência de releases, o suporte a várias versões e a maturidade de testes e integração contínua.",
            solution: {
              code: {
                language: "text",
                filename: "teams.answer.txt",
                code: [
                  "Equipe A → Trunk-based (ou GitHub Flow com branches curtas): deploy diário e bons testes",
                  "           permitem integrar várias vezes ao dia; feature flags para o que estiver incompleto.",
                  "Equipe B → Git Flow (ou um modelo com branches de release/manutenção): releases datadas e",
                  "           várias versões antigas exigem branches de longa duração para receber correções.",
                  "Equipe C → GitHub Flow simples (main + branches curtas + pull request revisado). Antes de tudo,",
                  "           adotar testes automatizados e integração contínua: sem eles, nenhuma estratégia",
                  "           protege a main de código quebrado.",
                ].join("\n"),
              },
              explanation:
                "As duas primeiras respostas vêm da cadência de release e do suporte a versões. Na equipe C o gargalo não é o " +
                "modelo de branches: sem testes e CI, qualquer estratégia depende da atenção de cada pessoa — e é " +
                "isso que precisa mudar primeiro.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "engineering-documentation",
      order: 90,
      title: "Engineering Documentation",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary: "Do ponto de entrada de um repositório até a documentação operacional: README → Changelog → ADR → RFC → Runbook.",
      suggestions: ["API Documentation (Platform / API Fundamentals, futuro)"],
      concepts: [
        concept({
          order: 10,
          title: "README",
          note: "ponto de entrada de um repositório/projeto",
          summary:
            "O primeiro documento que quem chega a um projeto lê: diz o que ele é, como instalá-lo e rodá-lo, como " +
            "usá-lo e como contribuir — o suficiente para começar em poucos minutos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O README é o arquivo na raiz de um repositório (geralmente README.md) que funciona como a porta de " +
                "entrada do projeto. É a primeira coisa que aparece em plataformas como o GitHub e, para muita gente, " +
                "a única documentação que será lida. Seu objetivo é responder rapidamente: o que é isto, para que " +
                "serve, como eu começo?",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O README responde \"o que é, como rodo, como uso\" em minutos — e só vale se os passos escritos " +
                "funcionarem de fato.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem um README, quem chega ao projeto — uma pessoa nova na equipe, alguém que quer usar a biblioteca, você " +
                "mesma seis meses depois — precisa adivinhar como ele funciona ou interromper alguém para perguntar. " +
                "Um README bom transforma \"perdi uma tarde tentando rodar\" em \"funcionou em cinco minutos\", e " +
                "reduz perguntas repetidas para a equipe. Ele também funciona como teste do próprio projeto: se é " +
                "difícil explicar como instalar, provavelmente é difícil de instalar.",
            },
            {
              type: "paragraph",
              text:
                "O que costuma conter, nesta ordem: o nome e uma frase que diz o que o projeto faz; um guia rápido " +
                "(quickstart) com os passos mínimos para rodar; exemplos de uso; como rodar os testes e configurar o " +
                "ambiente de desenvolvimento; como contribuir; e a licença. O README não deve tentar ser toda a " +
                "documentação — quando o assunto crescer, ele aponta para documentos mais detalhados. O maior " +
                "risco é ficar desatualizado: um README com comandos que não funcionam é pior que nenhum.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a estrutura essencial e uma função que verifica se as seções básicas existem:" },
            {
              type: "code",
              language: "text",
              filename: "README.md",
              code: [
                "# slug-it",
                "Converte textos em URLs amigáveis (\"Olá, mundo!\" → \"ola-mundo\").",
                "",
                "## Instalação",
                "    npm install slug-it",
                "",
                "## Uso",
                "    import { slugify } from \"slug-it\";",
                "    slugify(\"Olá, mundo!\"); // \"ola-mundo\"",
                "",
                "## Desenvolvimento",
                "    npm install && npm test",
                "",
                "## Licença",
                "MIT",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "check-readme.js",
              code: [
                "const REQUIRED_SECTIONS = [\"Instalação\", \"Uso\", \"Licença\"];",
                "",
                "function missingSections(readmeText) {",
                "  return REQUIRED_SECTIONS.filter((section) => !readmeText.includes(\"## \" + section));",
                "}",
                "",
                "missingSections(\"# app\\n## Uso\");   // [\"Instalação\", \"Licença\"]",
                "// Rodar isto no CI impede que o README volte a ficar sem o essencial.",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em poucas linhas, quem chega sabe o que é o projeto, como instalá-lo e usá-lo. Verificações simples " +
                "no CI ajudam a manter o mínimo, mas o que garante a utilidade é alguém seguir os passos de verdade.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em todo projeto, como primeiro documento: o que é, como rodar e como usar, do zero ao funcionando em minutos.",
                "Com quickstart testado por alguém que nunca viu o projeto.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só vale se os passos escritos funcionarem de fato.",
                "Exemplos de código que ninguém executa envelhecem em silêncio; um teste que os roda avisa quando a " +
                "documentação se separa do código.",
              ],
            },
          ],
          examples: [
            {
              title: "Um README que só tem o título",
              context: "Um repositório sem orientação deixa a pessoa recém-chegada adivinhando tudo.",
              code: {
                language: "text",
                filename: "bad-readme.md",
                code: [
                  "# projeto-x",
                  "",
                  "(nada mais)",
                  "",
                  "Perguntas que a pessoa precisa fazer a alguém:",
                  "  O que isto faz? Que versão do Node? Como configuro o banco? Como rodo os testes?",
                  "  Onde estão as variáveis de ambiente? Quem mantém isto?",
                ].join("\n"),
              },
              explanation:
                "Cada pergunta sem resposta escrita vira uma interrupção para alguém da equipe, repetida para cada " +
                "pessoa nova. Uma hora escrevendo o README economiza dezenas de horas de perguntas.",
            },
            {
              title: "Um quickstart que realmente funciona",
              context: "Os passos do README devem levar do zero ao projeto rodando, sem conhecimento oculto.",
              code: {
                language: "text",
                filename: "quickstart.md",
                code: [
                  "## Começando",
                  "Requisitos: Node 20+ e Docker.",
                  "",
                  "    git clone https://github.com/empresa/projeto-x && cd projeto-x",
                  "    cp .env.example .env          # ajuste DATABASE_URL se necessário",
                  "    docker compose up -d db       # sobe o banco local",
                  "    npm install",
                  "    npm run dev                   # http://localhost:3000",
                  "",
                  "Para rodar os testes: `npm test`",
                ].join("\n"),
              },
              explanation:
                "Os requisitos, os comandos na ordem certa e o resultado esperado (onde abrir) estão explícitos. O " +
                "teste do README é simples: alguém que nunca viu o projeto consegue seguir e chegar lá?",
            },
            {
              title: "Testar o README como se testa o código",
              context: "O jeito mais confiável de evitar um README desatualizado é executá-lo automaticamente.",
              code: {
                language: "javascript",
                filename: "test-readme-example.js",
                code: [
                  "import { slugify } from \"slug-it\";",
                  "import assert from \"node:assert\";",
                  "",
                  "// O exemplo do README, transformado em teste: se a API mudar, o CI quebra",
                  "assert.strictEqual(slugify(\"Olá, mundo!\"), \"ola-mundo\");",
                ].join("\n"),
              },
              explanation:
                "Exemplos de código no README que não são executados envelhecem em silêncio. Um teste que os roda avisa " +
                "quando a documentação e o código se separam.",
            },
          ],
          exercise: {
            problem:
              "Você criou uma pequena biblioteca chamada \"date-range\", que dado um início e um fim devolve a lista " +
              "de dias entre eles. Ela precisa de um README.",
            problemCode: {
              language: "javascript",
              filename: "date-range.js",
              code: [
                "export function daysBetween(start, end) {",
                "  const days = [];",
                "  for (let day = new Date(start); day <= new Date(end); day.setDate(day.getDate() + 1)) {",
                "    days.push(day.toISOString().slice(0, 10));",
                "  }",
                "  return days;",
                "}",
              ].join("\n"),
            },
            task:
              "Escreva um README com o essencial: o que é, instalação, exemplo de uso com o resultado, como rodar " +
              "os testes e licença.",
            hint: "Comece pela frase que diz o que a biblioteca faz e mostre um exemplo concreto com entrada e saída.",
            solution: {
              code: {
                language: "text",
                filename: "README.md",
                code: [
                  "# date-range",
                  "Lista os dias entre duas datas, incluindo as duas pontas.",
                  "",
                  "## Instalação",
                  "    npm install date-range",
                  "",
                  "## Uso",
                  "    import { daysBetween } from \"date-range\";",
                  "",
                  "    daysBetween(\"2026-03-01\", \"2026-03-03\");",
                  "    // [\"2026-03-01\", \"2026-03-02\", \"2026-03-03\"]",
                  "",
                  "## Desenvolvimento",
                  "    npm install",
                  "    npm test",
                  "",
                  "## Licença",
                  "MIT",
                ].join("\n"),
              },
              explanation:
                "Em vinte linhas, uma pessoa entende para que serve, instala, vê a entrada e a saída de um exemplo real e sabe " +
                "como rodar os testes. O exemplo com resultado é a parte mais valiosa: mostra o que a função devolve.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Changelog",
          note: "registro por mudança",
          summary:
            "O registro, organizado por versão, das mudanças relevantes de um projeto — escrito para quem o usa, " +
            "para que saiba o que mudou, o que corrigiu e o que pode quebrar antes de atualizar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O changelog (CHANGELOG.md) é a lista de mudanças notáveis de cada versão de um projeto, da mais recente " +
                "para a mais antiga. Ele responde à pergunta de quem usa o software: \"o que mudou desde a versão que eu " +
                "tenho?\". Uma convenção muito usada, o Keep a Changelog, agrupa as entradas em categorias: Added " +
                "(novidades), Changed (mudanças), Deprecated (marcado como obsoleto), Removed (removido), Fixed " +
                "(correções) e Security (segurança).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O changelog é escrito para quem usa, não para quem desenvolve: diga o que mudou para eles, agrupado " +
                "por versão, e destaque tudo o que pode quebrar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O número da versão diz o quanto mudou (Semantic Versioning), mas não o quê. Sem um changelog, " +
                "quem quer atualizar precisa ler o histórico de commits ou testar às cegas. O changelog é escrito " +
                "para pessoas que usam o projeto, não para quem o desenvolve, então descreve o efeito de cada " +
                "mudança (\"o filtro agora aceita datas relativas\"), e não a implementação (\"refatorado o " +
                "módulo de filtros\").",
            },
            {
              type: "paragraph",
              text:
                "Boas práticas: manter uma seção \"Unreleased\" no topo, atualizada a cada mudança relevante, que vira " +
                "uma versão numerada na hora do lançamento; usar datas no formato AAAA-MM-DD; destacar as mudanças que " +
                "quebram compatibilidade, com a indicação de como migrar; e não confundir com o log do Git — despejar " +
                "os commits em um arquivo não é um changelog, porque a maior parte dos commits não interessa a quem usa.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um changelog no formato comum e uma função que agrupa mudanças por categoria:" },
            {
              type: "code",
              language: "text",
              filename: "CHANGELOG.md",
              code: [
                "# Changelog",
                "",
                "## [Unreleased]",
                "### Added",
                "- Suporte a datas relativas no filtro (`\"últimos 7 dias\"`).",
                "",
                "## [2.1.0] - 2026-03-15",
                "### Added",
                "- Exportação de relatórios em CSV.",
                "### Fixed",
                "- O total mensal ignorava pedidos estornados.",
                "",
                "## [2.0.0] - 2026-01-20",
                "### Removed",
                "- **Breaking:** a função `formatLegacy()` foi removida; use `formatDate()`.",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "build-changelog.js",
              code: [
                "function groupByCategory(entries) {",
                "  const groups = {};",
                "  for (const entry of entries) {",
                "    (groups[entry.category] ??= []).push(entry.text);",
                "  }",
                "  return groups;",
                "}",
                "",
                "groupByCategory([",
                "  { category: \"Added\", text: \"Exportação em CSV\" },",
                "  { category: \"Fixed\", text: \"Total mensal com estornos\" },",
                "  { category: \"Added\", text: \"Filtro por data relativa\" },",
                "]);",
                "// { Added: [\"Exportação em CSV\", \"Filtro por data relativa\"], Fixed: [\"Total mensal com estornos\"] }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada versão traz as mudanças agrupadas por tipo, na linguagem de quem usa o projeto. A mudança que " +
                "quebra compatibilidade está marcada e indica o que usar no lugar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para quem usa o projeto saber, por versão, o que mudou, o que foi corrigido e o que pode quebrar.",
                "Com uma seção `Unreleased`, escrita no momento da mudança, quando a informação está fresca.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não é o log do Git despejado: commits como `wip` e `typo` não afetam quem usa.",
                "Mudanças que quebram compatibilidade precisam trazer o que mudou e como migrar.",
              ],
            },
          ],
          examples: [
            {
              title: "Log do Git despejado versus changelog",
              context: "Os commits registram o trabalho de quem desenvolve; o changelog registra o efeito para quem usa.",
              code: {
                language: "text",
                filename: "git-log-vs-changelog.txt",
                code: [
                  "Despejo do git log (ruim para quem usa):",
                  "  a1b2c3 refatora o módulo de filtros",
                  "  d4e5f6 wip",
                  "  7a8b9c corrige typo",
                  "  0d1e2f atualiza dependências",
                  "",
                  "Changelog (útil para quem usa):",
                  "  ### Added",
                  "  - O filtro agora aceita datas relativas, como \"últimos 7 dias\".",
                  "  ### Fixed",
                  "  - Filtros por data não respeitavam o fuso horário do usuário.",
                ].join("\n"),
              },
              explanation:
                "A refatoração, o wip e o typo não afetam quem usa; o que importa é o efeito visível. Escrever o " +
                "changelog é uma tradução do que foi feito para o que muda para as pessoas.",
            },
            {
              title: "Destacar mudanças que quebram",
              context: "Quem atualiza precisa descobrir de imediato o que exigirá ação da sua parte.",
              code: {
                language: "text",
                filename: "breaking-changes.md",
                code: [
                  "## [3.0.0] - 2026-06-01",
                  "### Changed",
                  "- **Breaking:** `listOrders()` agora devolve `{ items, nextCursor }` em vez de um array.",
                  "  Migração: troque `orders.map(...)` por `orders.items.map(...)`.",
                  "### Removed",
                  "- **Breaking:** suporte ao Node 16. A versão mínima é o Node 18.",
                ].join("\n"),
              },
              explanation:
                "Cada mudança que quebra compatibilidade traz o que mudou e como migrar. Isso complementa o número " +
                "MAJOR da versão (SemVer) com o que a pessoa realmente precisa fazer.",
            },
            {
              title: "O fluxo da seção Unreleased",
              context: "Escrever o changelog no momento da mudança é bem mais fácil do que reconstruí-lo no dia do lançamento.",
              code: {
                language: "text",
                filename: "unreleased-flow.txt",
                code: [
                  "1. Cada PR relevante acrescenta uma linha em \"## [Unreleased]\" (parte da revisão).",
                  "2. No lançamento, \"Unreleased\" é renomeada para a versão e a data:",
                  "     ## [2.2.0] - 2026-04-10",
                  "3. Uma nova seção \"## [Unreleased]\" vazia é criada no topo.",
                  "4. Os links de comparação no rodapé são atualizados:",
                  "     [2.2.0]: https://github.com/empresa/projeto/compare/v2.1.0...v2.2.0",
                ].join("\n"),
              },
              explanation:
                "Quem faz a mudança é quem melhor sabe descrevê-la, e a informação é escrita enquanto está fresca. No " +
                "lançamento, o changelog já está pronto.",
            },
          ],
          exercise: {
            problem:
              "Você está preparando a versão 2.0.0 de uma biblioteca de pagamentos. Estes são os commits desde a " +
              "última versão.",
            problemCode: {
              language: "text",
              filename: "commits.txt",
              code: [
                "refatora PaymentGateway para usar fetch",
                "corrige o cálculo de juros em parcelamentos de 12x",
                "adiciona suporte a pagamento por Pix",
                "remove a função chargeLegacy()",
                "atualiza dependências de desenvolvimento",
                "wip",
              ].join("\n"),
            },
            task:
              "Escreva a entrada do changelog para a versão 2.0.0 (com data), agrupada por categoria, deixando " +
              "de fora o que não interessa a quem usa e destacando a mudança que quebra compatibilidade.",
            hint: "A refatoração, a atualização de dependências de desenvolvimento e o wip não afetam quem usa. A remoção de chargeLegacy() é uma quebra.",
            solution: {
              code: {
                language: "text",
                filename: "CHANGELOG.md",
                code: [
                  "## [2.0.0] - 2026-05-12",
                  "### Added",
                  "- Suporte a pagamento por Pix.",
                  "### Fixed",
                  "- O cálculo de juros em parcelamentos de 12x estava incorreto.",
                  "### Removed",
                  "- **Breaking:** a função `chargeLegacy()` foi removida; use `charge()`.",
                ].join("\n"),
              },
              explanation:
                "Três categorias, na linguagem de quem usa a biblioteca. A refatoração interna, as dependências de " +
                "desenvolvimento e o wip ficaram de fora porque não mudam nada para o usuário, e a remoção " +
                "aparece como quebra (o que também justifica o MAJOR 2.0.0).",
            },
          },
        }),
        concept({
          order: 30,
          title: "ADR",
          note: "Architecture Decision Record — registro por decisão",
          summary:
            "Um documento curto que registra uma decisão de arquitetura — o contexto, o que foi decidido e suas " +
            "consequências — para que o porquê não se perca quando as pessoas e a memória mudarem.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um ADR (Architecture Decision Record) é um registro curto de uma única decisão importante: qual " +
                "problema havia (contexto), o que se decidiu, por quê, e o que isso implica (consequências). Costuma ser um " +
                "arquivo de texto no próprio repositório, numerado em sequência (docs/adr/0007-usar-postgresql.md), " +
                "com um status: proposto, aceito, rejeitado ou substituído.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O ADR guarda o porquê de uma decisão importante junto ao código — curto, sobre uma decisão só e " +
                "nunca reescrito: quando a decisão muda, um novo ADR substitui o antigo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O código mostra o que foi feito, mas raramente por quê. Seis meses depois, alguém encontra uma " +
                "escolha estranha — um banco de dados incomum, um serviço separado — e não sabe se foi deliberada ou " +
                "um acidente; ou a desfaz sem saber do problema que ela resolvia, ou a mantém por medo. O ADR guarda o " +
                "raciocínio original, inclusive as alternativas descartadas, para que a decisão possa ser " +
                "revisada com informação, não com adivinhação.",
            },
            {
              type: "paragraph",
              text:
                "Características: curto (uma página), sobre uma decisão só, escrito no momento em que ela é tomada e " +
                "guardado junto ao código. Um ADR aceito não é editado quando o mundo muda; ele é substituído por um " +
                "novo, que aponta para o anterior — o histórico das decisões (e do seu porquê) permanece. Escreva um ADR para " +
                "decisões difíceis de reverter, com impacto amplo ou que gerariam a pergunta \"por que fizeram assim?\".",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a estrutura de um ADR e uma função que gera o esqueleto com o nome de arquivo padronizado:" },
            {
              type: "code",
              language: "text",
              filename: "docs/adr/0007-usar-postgresql.md",
              code: [
                "# 7. Usar PostgreSQL como banco principal",
                "",
                "Status: Aceito (2026-03-10)",
                "",
                "## Contexto",
                "Precisamos de transações e consultas relacionais entre pedidos e clientes. A equipe já conhece SQL.",
                "",
                "## Decisão",
                "Usaremos PostgreSQL. Descartamos MongoDB (sem transações entre coleções na época) e MySQL (a equipe",
                "prefere os tipos JSON e as extensões do PostgreSQL).",
                "",
                "## Consequências",
                "+ Consistência transacional e consultas com JOIN.",
                "- Precisaremos operar o banco (backups, upgrades) — ou usar um serviço gerenciado.",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "new-adr.js",
              code: [
                "function newAdr(number, title) {",
                "  const id = String(number).padStart(4, \"0\");",
                "  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, \"-\").replace(/^-|-$/g, \"\");",
                "  return {",
                "    file: `docs/adr/${id}-${slug}.md`,",
                "    body: `# ${number}. ${title}\\n\\nStatus: Proposto\\n\\n## Contexto\\n\\n## Decisão\\n\\n## Consequências\\n`,",
                "  };",
                "}",
                "",
                "newAdr(7, \"Usar PostgreSQL\").file;   // \"docs/adr/0007-usar-postgresql.md\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em uma página, o ADR registra o problema, a escolha, as alternativas descartadas e o preço que se " +
                "aceitou pagar. Quem chegar depois entende não só o que a equipe decidiu, mas por quê.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para decisões de arquitetura caras de reverter, cujo \"por que fizeram assim?\" será perguntado no futuro.",
                "Registrando as alternativas descartadas e o motivo, para não repetir a discussão.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Decisões baratas de desfazer não pedem ADR; o commit já basta.",
                "Um ADR não é reescrito: quando a decisão muda, um novo ADR substitui o antigo.",
              ],
            },
          ],
          examples: [
            {
              title: "Substituir em vez de editar",
              context: "O histórico das decisões — inclusive as que foram mudadas — é parte do valor do registro.",
              code: {
                language: "text",
                filename: "superseding-adr.txt",
                code: [
                  "docs/adr/0007-usar-postgresql.md",
                  "  Status: Substituído por 0019",
                  "",
                  "docs/adr/0019-migrar-para-banco-gerenciado.md",
                  "  Status: Aceito (2026-09-02)",
                  "  Contexto: operar o PostgreSQL por conta própria consome tempo da equipe (ver ADR 0007).",
                  "  Decisão: usar o serviço gerenciado do provedor; o PostgreSQL continua sendo o motor.",
                ].join("\n"),
              },
              explanation:
                "O ADR 0007 permanece como registro do que se pensava naquela época; o 0019 explica a mudança. Quem ler os " +
                "dois entende como e por que a decisão evoluiu.",
            },
            {
              title: "Quando vale escrever um ADR",
              context: "Nem toda decisão merece um documento — a regra é o custo de reverter e o alcance.",
              code: {
                language: "text",
                filename: "when-to-write-adr.txt",
                code: [
                  "Escreva um ADR:",
                  "  - escolha de banco de dados, linguagem, framework ou provedor de nuvem",
                  "  - dividir um serviço em dois, ou adotar mensageria",
                  "  - convenção que afeta todo o código (formato de erros, estratégia de autenticação)",
                  "",
                  "Não precisa de ADR:",
                  "  - renomear uma função, escolher o nome de uma variável",
                  "  - decisões fáceis de reverter em uma tarde",
                ].join("\n"),
              },
              explanation:
                "Se a pergunta \"por que fizeram assim?\" provavelmente será feita no futuro e a resposta importa, é um " +
                "candidato a ADR. Se a decisão é barata de desfazer, o commit já basta.",
            },
            {
              title: "Registrar as alternativas descartadas",
              context: "A parte mais valiosa de um ADR costuma ser o que não foi escolhido, e por quê.",
              code: {
                language: "text",
                filename: "alternatives.md",
                code: [
                  "## Alternativas consideradas",
                  "- **Manter o monólito:** simples hoje, mas os deploys de um time bloqueiam os outros dois.",
                  "- **Microsserviços completos:** resolveria o bloqueio, mas exigiria uma plataforma de observabilidade",
                  "  que ainda não temos.",
                  "- **Módulos com fronteiras claras dentro do monólito (escolhida):** reduz o acoplamento agora e",
                  "  deixa a extração para serviços como opção futura.",
                ].join("\n"),
              },
              explanation:
                "Sem essa seção, alguém sugeriria de novo, daqui a um ano, uma das opções descartadas, e a equipe repetiria " +
                "a discussão. Com ela, o argumento já está registrado.",
            },
          ],
          exercise: {
            problem:
              "A equipe decidiu adotar TypeScript no projeto, que hoje é todo em JavaScript. A decisão foi tomada " +
              "em uma reunião, e ninguém registrou o motivo.",
            problemCode: {
              language: "text",
              filename: "meeting-notes.txt",
              code: [
                "Motivos citados: muitos bugs por tipos errados em produção; a equipe cresceu de 3 para 10 pessoas e",
                "há pouca documentação sobre o formato dos dados; o editor ajuda mais com tipos.",
                "Alternativa discutida: manter JavaScript e usar JSDoc + checagem de tipos.",
                "Custo: converter o código existente aos poucos; tempo de aprendizado.",
              ].join("\n"),
            },
            task:
              "Escreva o ADR (número, título, status, contexto, decisão, alternativas e consequências) com base nas " +
              "anotações da reunião.",
            hint: "O contexto é o problema; a decisão é uma frase; as consequências têm lados bons e ruins.",
            solution: {
              code: {
                language: "text",
                filename: "docs/adr/0012-adotar-typescript.md",
                code: [
                  "# 12. Adotar TypeScript",
                  "",
                  "Status: Aceito (2026-04-22)",
                  "",
                  "## Contexto",
                  "Temos tido bugs em produção causados por tipos incorretos. A equipe passou de 3 para 10 pessoas e o",
                  "formato dos dados quase não está documentado, o que atrasa quem chega ao código.",
                  "",
                  "## Decisão",
                  "Adotar TypeScript, convertendo o código existente de forma gradual (módulo a módulo).",
                  "",
                  "## Alternativas consideradas",
                  "- Manter JavaScript com JSDoc e checagem de tipos: menos mudança, mas as anotações são mais",
                  "  verbosas e a cobertura tende a ser irregular.",
                  "",
                  "## Consequências",
                  "+ Erros de tipo detectados antes da execução; o código passa a documentar os dados.",
                  "- Curva de aprendizado e um passo de compilação a mais.",
                  "- Período de transição com código misto em JavaScript e TypeScript.",
                ].join("\n"),
              },
              explanation:
                "O ADR registra o problema que motivou a decisão, o que se escolheu, a alternativa descartada e o " +
                "preço aceito. Se, dois anos depois, alguém questionar o TypeScript, o raciocínio original está no " +
                "repositório.",
            },
          },
        }),
        concept({
          order: 40,
          title: "RFC",
          note: "proposta pré-decisão para mudanças maiores",
          summary:
            "Um documento de proposta, escrito antes de tomar uma decisão de peso, que expõe o problema e a solução " +
            "sugerida para receber críticas e construir consenso — e que, aceito, gera o registro de decisão.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um RFC (Request for Comments, \"pedido de comentários\") é uma proposta escrita para uma mudança " +
                "significativa, compartilhada antes de a implementação começar. Ele descreve o problema, a solução " +
                "proposta, as alternativas e os riscos, e convida as pessoas afetadas a comentar. É uma ferramenta " +
                "de decisão coletiva: o objetivo é discutir a ideia enquanto ela ainda é barata de mudar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O RFC é a conversa antes da decisão: escreva-o para mudanças grandes e difíceis de reverter, deixe " +
                "as pessoas afetadas comentarem e, aceito, registre a decisão em um ADR.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Mudanças grandes que afetam várias pessoas ou equipes são caras de errar. Descobrir, depois de três " +
                "semanas de implementação, que outra equipe dependia do comportamento que você mudou, ou que existia uma " +
                "solução mais simples, é desperdício. O RFC traz essas objeções para antes do código: quem escreve " +
                "organiza o pensamento (muitas ideias falham só de serem escritas), e quem lê contribui com o " +
                "contexto que o autor não tinha.",
            },
            {
              type: "paragraph",
              text:
                "A diferença para o ADR: o RFC é a discussão antes da decisão (uma proposta, aberta a mudança); o ADR é o " +
                "registro depois dela (curto, fixo). Um RFC aceito costuma originar um ADR. Estrutura comum: resumo, " +
                "motivação, desenho da solução, alternativas, desvantagens, questões em aberto e plano de adoção. " +
                "Ciclo: rascunho → período de revisão (com prazo) → decisão (aceito, rejeitado, adiado) → " +
                "implementação. Não é para tudo: para mudanças pequenas e reversíveis, um RFC é burocracia.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o esqueleto de um RFC e um critério simples para decidir se a mudança precisa de um:" },
            {
              type: "code",
              language: "text",
              filename: "rfc-0023-fila-de-eventos.md",
              code: [
                "# RFC 0023: Introduzir uma fila de eventos entre Pedidos e Faturamento",
                "Autor: Ana  |  Status: Em revisão  |  Prazo para comentários: 2026-05-20",
                "",
                "## Resumo",
                "Trocar a chamada síncrona de Pedidos para Faturamento por eventos em uma fila.",
                "## Motivação",
                "Quando o Faturamento está lento, o checkout inteiro fica lento (3 incidentes no trimestre).",
                "## Proposta",
                "Pedidos publica `OrderPlaced`; Faturamento consome de forma assíncrona, com retentativas.",
                "## Alternativas",
                "Aumentar o timeout (não resolve a causa); cache das respostas (não se aplica a escritas).",
                "## Desvantagens / riscos",
                "Consistência eventual; mais uma peça de infraestrutura para operar.",
                "## Questões em aberto",
                "Qual fila usar? Como reprocessar eventos com falha?",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "needs-rfc.js",
              code: [
                "function needsRfc(change) {",
                "  const signals = [",
                "    change.affectsOtherTeams,",
                "    change.hardToReverse,",
                "    change.estimatedWeeks > 2,",
                "    change.changesPublicInterface,",
                "  ];",
                "  return signals.filter(Boolean).length >= 2;",
                "}",
                "",
                "needsRfc({ affectsOtherTeams: true, hardToReverse: true, estimatedWeeks: 4 }); // true",
                "needsRfc({ affectsOtherTeams: false, hardToReverse: false, estimatedWeeks: 1 }); // false",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O critério é apenas ilustrativo, mas mostra a lógica: quanto mais gente é afetada e quanto mais difícil é " +
                "desfazer, mais o custo de discutir antes se justifica.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Antes de decisões grandes e difíceis de reverter, para expor a proposta e receber críticas de quem seria " +
                "afetado.",
                "Depois de aceito, registrando a decisão em um ADR.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Para decisões pequenas é exagero: exigir RFC para tudo leva a evitar o processo ou a documentos vazios.",
                "Sem prazo e revisores definidos, o RFC é ignorado ou se arrasta.",
              ],
            },
          ],
          examples: [
            {
              title: "Do RFC ao ADR",
              context: "Os dois documentos se complementam: um discute, o outro registra.",
              code: {
                language: "text",
                filename: "rfc-to-adr.txt",
                code: [
                  "RFC 0023 (proposta, 2 semanas de comentários)",
                  "   ↓ discussão: 14 comentários, 2 alternativas novas, 1 risco identificado por outra equipe",
                  "   ↓ decisão: aceito, com uma alteração no plano de adoção",
                  "ADR 0031 \"Usar fila de eventos entre Pedidos e Faturamento\" (registro curto do que foi decidido)",
                  "",
                  "O RFC guarda a conversa e as alternativas; o ADR guarda a decisão final para consulta rápida.",
                ].join("\n"),
              },
              explanation:
                "O RFC é o \"como chegamos aqui\", longo e aberto a mudança; o ADR é o \"o que decidimos\", curto e estável. " +
                "Um projeto pode manter os dois, ou ligar um ao outro.",
            },
            {
              title: "Um bom período de revisão",
              context: "Um RFC precisa de um prazo e de revisores certos, senão vira um documento que ninguém lê.",
              code: {
                language: "text",
                filename: "review-process.txt",
                code: [
                  "1. Autor publica o RFC e avisa os canais das equipes afetadas.",
                  "2. Revisores obrigatórios são nomeados (quem opera o sistema, quem o consome, segurança).",
                  "3. Prazo fixo para comentários: 5 dias úteis. Silêncio depois do prazo = sem objeções.",
                  "4. O autor responde a cada comentário e atualiza o texto.",
                  "5. Decisão registrada no topo do RFC: aceito / rejeitado / adiado, e por quê.",
                ].join("\n"),
              },
              explanation:
                "O prazo evita discussões eternas, e os revisores nomeados garantem que quem seria mais afetado se " +
                "manifeste. Um RFC sem processo tende a ser ignorado ou a se arrastar.",
            },
            {
              title: "Quando um RFC é exagero",
              context: "Documentar demais uma decisão pequena atrasa a equipe sem trazer proteção.",
              code: {
                language: "text",
                filename: "rfc-overkill.txt",
                code: [
                  "Não precisa de RFC:",
                  "  - trocar uma biblioteca de datas dentro de um módulo, com uma tarde de trabalho",
                  "  - adicionar um campo opcional a uma resposta de API interna",
                  "  - reorganizar pastas de um serviço só",
                  "",
                  "Um PR bem descrito e revisado resolve. O RFC é para o que, se der errado, é caro de corrigir.",
                ].join("\n"),
              },
              explanation:
                "O custo do processo deve ser proporcional ao risco. Exigir um RFC para tudo faz as pessoas evitarem o " +
                "processo ou escreverem documentos vazios apenas para cumprir tabela.",
            },
          ],
          exercise: {
            problem:
              "Quatro propostas de mudança apareceram nesta semana em uma equipe com cinco serviços. Nem todas " +
              "justificam um RFC.",
            problemCode: {
              language: "text",
              filename: "proposals.txt",
              code: [
                "A) Renomear uma função interna de um único serviço.",
                "B) Trocar o formato de autenticação entre todos os serviços de tokens simples para JWT.",
                "C) Adicionar um novo campo opcional na resposta de uma API usada só pelo front-end.",
                "D) Migrar o banco de dados de pedidos de MySQL para PostgreSQL.",
              ].join("\n"),
            },
            task:
              "Decida quais precisam de RFC, justificando pelo alcance e pela dificuldade de reverter, e esboce as " +
              "seções principais do RFC de uma delas.",
            hint: "Pergunte: afeta outras equipes? É difícil de desfazer? Levaria semanas? Duas respostas \"sim\" já pedem um RFC.",
            solution: {
              code: {
                language: "text",
                filename: "proposals.answer.txt",
                code: [
                  "A) Sem RFC — mudança local e trivial; um PR resolve.",
                  "B) RFC — afeta todos os serviços e é difícil de reverter (todos precisam migrar juntos).",
                  "C) Sem RFC — opcional, compatível e restrito a um consumidor; um PR com boa descrição basta.",
                  "D) RFC — migração de dados em produção, cara de reverter e com impacto em várias equipes.",
                  "",
                  "Esboço do RFC B (autenticação com JWT):",
                  "  Resumo: substituir os tokens simples por JWT assinados.",
                  "  Motivação: hoje cada serviço consulta o serviço de autenticação a cada requisição (latência e ponto único de falha).",
                  "  Proposta: emissão centralizada de JWT; validação local por chave pública; expiração curta.",
                  "  Alternativas: manter os tokens e adicionar cache; sessões compartilhadas.",
                  "  Riscos: revogação mais difícil; rotação de chaves.",
                  "  Plano de adoção: período de aceitar os dois formatos, migração serviço a serviço.",
                ].join("\n"),
              },
              explanation:
                "B e D afetam várias equipes e são caras de desfazer, então justificam a discussão prévia. A e C são " +
                "pequenas e reversíveis: um RFC seria só burocracia. O esboço mostra a estrutura: problema, proposta, " +
                "alternativas, riscos e plano.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Runbook",
          note: "documentação operacional. Ponte futura para Platform / Reliability Engineering (Postmortem) — sem Requires (Epic 05 ainda não aprovado)",
          summary:
            "Um guia passo a passo para operar um sistema e responder a problemas conhecidos — escrito para ser " +
            "seguido sob pressão, por quem talvez nunca tenha visto aquele componente.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um runbook é a documentação operacional de um sistema: instruções concretas para tarefas repetíveis " +
                "(fazer um deploy, rotacionar uma chave, reiniciar um serviço) e para responder a alertas e " +
                "incidentes conhecidos. Enquanto o README ensina a usar e desenvolver, o runbook ensina a operar " +
                "e a consertar quando algo dá errado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Escreva o runbook para a pessoa cansada, às três da manhã, que nunca viu o sistema: comandos " +
                "exatos, passos em ordem e um ponto claro de escalonamento.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando o alerta toca às três da manhã, a pessoa de plantão pode nunca ter mexido naquele serviço, está " +
                "cansada e sob pressão. Depender da memória de quem construiu o sistema — que talvez esteja de férias — " +
                "é uma aposta. Um runbook transforma conhecimento individual em um procedimento que qualquer pessoa " +
                "consegue seguir, reduzindo o tempo de resposta e os erros.",
            },
            {
              type: "paragraph",
              text:
                "O que um bom runbook tem: o nome do alerta ou da situação e o impacto esperado; como diagnosticar (o " +
                "que verificar, com os comandos exatos, prontos para copiar); as ações de mitigação em ordem; como " +
                "confirmar que o problema foi resolvido; e quando e a quem escalar. Características: ser direto e acionável " +
                "(comandos, não prosa), ser testado (alguém o segue de verdade), estar ligado ao alerta e ser atualizado " +
                "após cada incidente — o que se aprendeu em uma análise pós-incidente (postmortem) deve voltar " +
                "para o runbook.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um runbook para um alerta específico, com um trecho de diagnóstico executável:" },
            {
              type: "code",
              language: "text",
              filename: "runbook-fila-parada.md",
              code: [
                "# Alerta: FilaDePedidosParada",
                "Impacto: pedidos novos não são processados. Severidade: alta.",
                "",
                "## Diagnóstico",
                "1. Confira o tamanho da fila:   node scripts/queue-depth.js",
                "2. Os workers estão vivos?       kubectl get pods -l app=order-worker",
                "3. Há erros recentes?            kubectl logs -l app=order-worker --since=15m | grep ERROR",
                "",
                "## Mitigação",
                "- Workers travados: kubectl rollout restart deployment/order-worker",
                "- Erro de conexão com o banco: ver runbook \"Banco indisponível\".",
                "",
                "## Verificação",
                "A fila deve começar a diminuir em até 5 minutos (node scripts/queue-depth.js).",
                "",
                "## Escalonamento",
                "Se a fila não diminuir em 15 minutos: acionar a equipe de Pedidos (#pedidos-oncall).",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "scripts/queue-depth.js",
              code: [
                "// Diagnóstico referenciado no runbook: mostra o tamanho da fila e um veredito",
                "async function checkQueueDepth() {",
                "  const depth = await queue.size(\"orders\");",
                "  const status = depth > 1000 ? \"CRÍTICO\" : depth > 200 ? \"ATENÇÃO\" : \"OK\";",
                "  console.log(`fila orders: ${depth} mensagens — ${status}`);",
                "  return depth;",
                "}",
                "",
                "checkQueueDepth();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A pessoa de plantão não precisa entender o sistema: segue os passos, com comandos prontos, verifica " +
                "o resultado e sabe quando pedir ajuda. O script de diagnóstico foi escrito uma vez, por quem " +
                "entende, e usado por qualquer pessoa.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para problemas conhecidos, com comandos exatos, passos em ordem e um ponto claro de escalonamento.",
                "Atualizado a cada incidente, para que o aprendizado volte ao documento.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Passos vagos, que pressupõem contexto, são só uma lembrança, e não um runbook.",
                "Um passo executado sempre da mesma forma pode virar script ou automação, deixando o runbook para o que " +
                "exige decisão humana.",
              ],
            },
          ],
          examples: [
            {
              title: "Runbook vago versus acionável",
              context: "O detalhe que separa um runbook útil de um inútil é a especificidade dos passos.",
              code: {
                language: "text",
                filename: "vague-vs-actionable.md",
                code: [
                  "Vago (não ajuda):",
                  "  \"Se a API estiver lenta, verifique os logs e corrija o problema.\"",
                  "",
                  "Acionável:",
                  "  1. Veja a latência:     curl -w '%{time_total}' https://api.empresa.com/health",
                  "  2. Se > 2s, verifique o banco:  psql -c \"SELECT count(*) FROM pg_stat_activity\"",
                  "  3. Se > 90 conexões: reinicie o pool:  kubectl rollout restart deployment/api",
                  "  4. Confirme que a latência voltou a < 500 ms. Se não, escalone para #plataforma.",
                ].join("\n"),
              },
              explanation:
                "O primeiro texto pressupõe que a pessoa já sabe o que procurar; o segundo é um procedimento que " +
                "alguém sem contexto consegue executar. A diferença é a que existe entre ter um runbook e ter uma lembrança.",
            },
            {
              title: "Runbooks se atualizam com os incidentes",
              context: "Cada incidente revela um passo que faltava ou um comando que mudou — e isso deve voltar para o documento.",
              code: {
                language: "text",
                filename: "runbook-update.txt",
                code: [
                  "Incidente 2026-04-02: a fila parou; o runbook mandava reiniciar os workers, mas o problema era",
                  "uma mensagem inválida que travava o consumo (\"poison message\").",
                  "",
                  "Ação pós-incidente: acrescentar ao runbook o passo 2b:",
                  "  \"Se os workers reiniciam e travam de novo, inspecione a primeira mensagem da fila e mova-a",
                  "   para a fila de mensagens mortas: node scripts/move-to-dlq.js <id>\"",
                ].join("\n"),
              },
              explanation:
                "Aqui o aprendizado da análise pós-incidente (postmortem, tema da área de Confiabilidade) se transforma em " +
                "conhecimento reutilizável. Sem isso, o mesmo incidente será resolvido do zero a cada vez.",
            },
            {
              title: "Transformar passos repetidos em automação",
              context: "Um passo de runbook executado sempre da mesma forma pode virar um script — ou ser automatizado por completo.",
              code: {
                language: "javascript",
                filename: "automate-runbook-step.js",
                code: [
                  "// Passos manuais 1–3 do runbook, agora em um único comando: node scripts/diagnose-queue.js",
                  "async function diagnoseQueue() {",
                  "  const depth = await queue.size(\"orders\");",
                  "  const workers = await cluster.podsReady(\"order-worker\");",
                  "  const recentErrors = await logs.count(\"order-worker\", \"ERROR\", { minutes: 15 });",
                  "  console.log({ depth, workers, recentErrors });",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O runbook passa a dizer \"execute o script e leia o resultado\". Se o problema for sempre o mesmo e a " +
                "correção puder ser feita com segurança, o passo seguinte é automatizar a própria correção e deixar " +
                "o runbook para os casos que exigem decisão humana.",
            },
          ],
          exercise: {
            problem:
              "Um serviço de arquivos costuma alertar \"disco quase cheio\" (mais de 85% de uso) no servidor de " +
              "uploads. Hoje só uma pessoa da equipe sabe o que fazer.",
            problemCode: {
              language: "text",
              filename: "context.txt",
              code: [
                "Alerta: DiscoQuaseCheio (servidor uploads-01, /var/data acima de 85%)",
                "Causas conhecidas: arquivos temporários de upload não removidos; logs sem rotação.",
                "Comandos úteis: df -h /var/data ; du -sh /var/data/* ; find /var/data/tmp -mtime +1",
                "Os arquivos em /var/data/tmp com mais de 1 dia podem ser apagados com segurança.",
                "Se o uso passar de 95%, o serviço para de aceitar uploads.",
              ].join("\n"),
            },
            task:
              "Escreva o runbook para esse alerta: impacto, diagnóstico, mitigação, verificação e escalonamento, " +
              "com comandos exatos.",
            hint: "Escreva para alguém que nunca viu esse servidor: ordene os passos, coloque os comandos prontos e diga qual é o resultado esperado de cada um.",
            solution: {
              code: {
                language: "text",
                filename: "runbook-disco-quase-cheio.md",
                code: [
                  "# Alerta: DiscoQuaseCheio (uploads-01)",
                  "Impacto: acima de 95% o serviço para de aceitar uploads. Severidade: média (alta se > 95%).",
                  "",
                  "## Diagnóstico",
                  "1. Uso atual:                df -h /var/data",
                  "2. O que ocupa mais espaço:  du -sh /var/data/* | sort -h",
                  "",
                  "## Mitigação",
                  "- Se /var/data/tmp é grande: apague arquivos com mais de 1 dia",
                  "      find /var/data/tmp -mtime +1 -delete",
                  "- Se são os logs: force a rotação  logrotate -f /etc/logrotate.d/uploads",
                  "",
                  "## Verificação",
                  "df -h /var/data deve mostrar abaixo de 80%.",
                  "",
                  "## Escalonamento",
                  "Se o uso não baixar ou passar de 95%: acionar a equipe de Plataforma (#plataforma-oncall) para",
                  "ampliar o disco. Depois, abrir uma tarefa para automatizar a limpeza dos temporários.",
                ].join("\n"),
              },
              explanation:
                "Qualquer pessoa consegue seguir: comandos prontos, ordem clara, o resultado esperado e o momento de " +
                "pedir ajuda. O último passo (automatizar a limpeza) mostra o destino natural de um runbook repetido: " +
                "virar automação.",
            },
          },
        }),
      ],
    }),
  ],
});
