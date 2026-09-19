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
            "Escolher nomes que revelam a intenção — o que a coisa é ou faz, no vocabulário do problema — para que " +
            "o código possa ser lido sem precisar de uma explicação à parte.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Naming é a prática de escolher os nomes de variáveis, funções, classes e arquivos de modo que " +
                "comuniquem o que aquilo representa ou faz. Um bom nome revela a intenção, usa o vocabulário do " +
                "problema (não o da implementação) e é consistente com os outros nomes do código.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um bom nome responde \"o que é isto e por que existe\" sem obrigar ninguém a ler a implementação — " +
                "é a documentação que sempre está junto do código.",
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
          summary:
            "Escrever funções pequenas que fazem uma coisa só, num único nível de abstração — para que cada uma " +
            "possa ser entendida, testada e reaproveitada sem precisar ler o resto.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Escrever boas funções é uma prática de projeto: cada função deve ser pequena, ter um único " +
                "propósito, operar em um único nível de abstração e ter um nome que descreva exatamente o que faz. " +
                "É a aplicação da responsabilidade única na menor escala em que ela faz sentido.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Uma boa função tem um propósito só, um nível de abstração e um nome que o descreve — se a descrição " +
                "precisa de \"e\", provavelmente são duas funções.",
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
            "Manter poucos parâmetros, em ordem previsível e sem flags booleanas — cada argumento a mais é algo " +
            "que quem chama precisa lembrar e acertar.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Function Arguments trata de como uma função recebe seus dados: quantos parâmetros tem (aridade), em " +
                "que ordem, e de que tipo. A regra geral é preferir poucos, previsíveis e autoexplicativos — 0 a 2 " +
                "são o ideal, e 3 já pede atenção.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Poucos argumentos, nomeados quando forem vários e sem flags booleanas — cada parâmetro extra é " +
                "custo de leitura e chance de erro em todo ponto de chamada.",
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
          summary:
            "Tratar os casos inválidos ou excepcionais logo no início da função, com retorno antecipado, para que " +
            "o caminho normal fique plano, sem aninhamento.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma guard clause é um if no começo da função que verifica uma condição de saída — entrada inválida, " +
                "caso vazio, permissão negada — e retorna (ou lança um erro) imediatamente. O que sobra depois dela " +
                "é o caminho principal, escrito sem estar dentro de nenhum bloco de condição.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Resolva os casos excepcionais primeiro e saia cedo — assim o caminho principal fica no nível base " +
                "da função, sem pirâmide de aninhamento.",
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
          summary:
            "Usar comentários para explicar o porquê — decisões, restrições e armadilhas que o código não consegue " +
            "dizer — e não para repetir o que o código já diz nem para compensar nomes ruins.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Comentários são texto escrito ao lado do código que o computador ignora e as pessoas leem. A boa " +
                "prática é tratá-los como último recurso: primeiro tente expressar a ideia no próprio código (com um " +
                "bom nome ou uma função extraída) e comente apenas o que o código sozinho não consegue dizer.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Se o código pode dizer, deixe o código dizer; use comentários para o porquê — a informação que só " +
                "existe na cabeça de quem escreveu.",
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
          summary:
            "Substituir números (e textos) soltos no código por constantes nomeadas que dizem o que o valor " +
            "significa e permitem mudá-lo em um único lugar.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um magic number é um valor literal, escrito direto no código, cujo significado não é óbvio pelo " +
                "contexto — 86400000, 0.07, 3. A prática é substituí-lo por uma constante com um nome que diga o " +
                "que o valor representa (ONE_DAY_MS, LOYALTY_DISCOUNT_RATE, MAX_RETRIES).",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um número solto esconde o significado e se espalha; uma constante nomeada explica o valor e o " +
                "concentra em um único lugar — mas só vale nomear o que realmente não é óbvio.",
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
        concept({ order: 10, title: "DRY", note: "Don't Repeat Yourself" }),
        concept({ order: 20, title: "KISS", note: "Keep It Simple" }),
        concept({
          order: 30,
          title: "YAGNI",
          note: "You Aren't Gonna Need It — ver colisão conceitual com Speculative Generality (Code Smells, não incluída como Task)",
        }),
        concept({ order: 40, title: "Principle of Least Astonishment", note: "o código não deve surpreender quem lê" }),
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
        }),
        concept({ order: 20, title: "Long Method", note: "função grande demais para entender de uma vez" }),
        concept({
          order: 30,
          title: "Long Parameter List",
          note: "relaciona-se com Function Arguments (Clean Code) e Introduce Parameter Object (Refactoring) — trio intencional: escrever bem → reconhecer violação → corrigir",
        }),
        concept({
          order: 40,
          title: "Large Class",
          requires: ["Programming Foundations / Programming Fundamentals / Cohesion"],
          note: "sintoma concreto de baixa coesão",
        }),
        concept({
          order: 50,
          title: "Feature Envy",
          requires: ["Programming Foundations / Programming Fundamentals / Coupling"],
          note: "sintoma concreto de acoplamento excessivo",
        }),
        concept({ order: 60, title: "Primitive Obsession", note: "usar primitivos onde um tipo/objeto próprio comunicaria melhor a intenção" }),
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
        }),
        concept({ order: 20, title: "Extract Function", requires: ["Refactoring"] }),
        concept({ order: 30, title: "Extract Variable", requires: ["Refactoring"] }),
        concept({ order: 40, title: "Rename", requires: ["Refactoring"] }),
        concept({
          order: 50,
          title: "Inline Function",
          requires: ["Refactoring"],
          note: "operação inversa de Extract Function — ensinada em par por ordem de estudo, não por Requires",
        }),
        concept({
          order: 60,
          title: "Extract Class",
          requires: ["Code Smells / Large Class"],
          note: "corrige a baixa coesão diagnosticada por Large Class",
        }),
        concept({ order: 70, title: "Move Function", requires: ["Refactoring"] }),
        concept({
          order: 80,
          title: "Replace Nested Conditional with Guard Clauses",
          requires: ["Clean Code / Guard Clauses"],
          note: "a técnica mecânica que produz o estilo já ensinado em Clean Code",
        }),
        concept({
          order: 90,
          title: "Replace Conditional with Polymorphism",
          requires: ["Programming Foundations / Programming Fundamentals / Polymorphism"],
          note: "aplica o mecanismo já ensinado em Programming Foundations",
        }),
        concept({
          order: 100,
          title: "Introduce Parameter Object",
          requires: ["Code Smells / Long Parameter List"],
          note: "corrige o smell diagnosticado antes",
        }),
        concept({
          order: 110,
          title: "Refactoring with Tests",
          requires: ["Testing & Quality Engineering / Testing Fundamentals"],
          note: "fecha a Story: só se refatora com segurança havendo rede de testes",
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
        }),
        concept({ order: 20, title: "Exceptions", requires: ["Errors vs Exceptions"], note: "throw/catch, hierarquia de exceções" }),
        concept({
          order: 30,
          title: "Error Propagation",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "o erro sobe pela pilha de chamadas",
        }),
        concept({ order: 40, title: "Custom Errors", requires: ["Exceptions"], note: "tipos de erro com significado de domínio" }),
        concept({
          order: 50,
          title: "Fail Fast",
          requires: ["Programming Foundations / Programming Fundamentals / Contract"],
          note: "pré-condição violada → falhar imediatamente",
        }),
        concept({
          order: 60,
          title: "Result Pattern",
          note: "erro como valor de retorno explícito, não efeito colateral — revisita Programming Foundations / Functional Programming (Side Effects/Pure Functions)",
        }),
        concept({
          order: 70,
          title: "Error Boundaries",
          note: "conter a falha para não propagar em cascata — definição agnóstica de framework. Ponte futura para Architecture / Resilience Patterns (sem Requires — Epic 06 ainda não aprovado)",
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
        concept({ order: 10, title: "Code Review", requires: ["Clean Code"], isNew: true, note: "guarda-chuva: o que é, por que é gate de qualidade" }),
        concept({
          order: 20,
          title: "Review Dimensions",
          requires: ["Code Review"],
          note: "consolida 5 Tasks do rascunho original (\"Review for Correctness/Readability/Maintainability/Testability/Security\") — revisita Testing & Quality Engineering / Testing Strategy / Testability (uma das lentes)",
          subtopics: ["Correctness", "Readability", "Maintainability", "Testability", "Security"],
          collision: "≠ Testability (Testing & Quality Engineering / Testing Strategy) — uma lente de revisão × a propriedade em si",
        }),
        concept({ order: 30, title: "Review Scope", requires: ["Code Review"], note: "tamanho/foco de um PR — mudanças de propósito único" }),
        concept({ order: 40, title: "Giving & Receiving Feedback", requires: ["Code Review"], note: "camada de comunicação/soft-skill" }),
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
        concept({ order: 10, title: "Technical Debt", note: "custo de atalhos — framing da Story" }),
        concept({
          order: 20,
          title: "Legacy Code",
          note: "código difícil/arriscado de mudar com segurança, geralmente sem dono claro ou contexto original preservado. A associação de Feathers (\"código legado = código sem testes\") é citada como lente, não como definição universal",
        }),
        concept({ order: 30, title: "Semantic Versioning", note: "MAJOR.MINOR.PATCH e o que cada um comunica" }),
        concept({ order: 40, title: "Backward Compatibility", requires: ["Semantic Versioning"], note: "a propriedade que SemVer protege/comunica" }),
        concept({ order: 50, title: "Deprecation", requires: ["Backward Compatibility"], note: "processo de retirar algo preservando compatibilidade" }),
        concept({
          order: 60,
          title: "Dependency Management",
          isNew: true,
          requires: ["Semantic Versioning"],
          note: "gerenciar versões/dependências de terceiros: lockfiles, ranges de versão, grafo de dependências",
        }),
        concept({
          order: 70,
          title: "Incremental Migration",
          requires: ["Legacy Code", "Backward Compatibility"],
          note: "capstone: técnica para evoluir código legado/dependências com segurança",
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
        concept({ order: 10, title: "Commit", note: "unidade atômica de histórico, boas mensagens" }),
        concept({ order: 20, title: "Merge", requires: ["Commit"] }),
        concept({ order: 30, title: "Rebase", requires: ["Commit"], note: "contraste direto com Merge" }),
        concept({
          order: 40,
          title: "Interactive Rebase",
          requires: ["Rebase"],
          note: "inclui Squash como caso de uso — não vira Task própria",
        }),
        concept({
          order: 50,
          title: "Merge Conflicts",
          requires: ["Commit"],
          note: "colisão entre mudanças registradas em commits; pré-requisito conceitual mínimo é Commit (mesmo padrão de Merge/Rebase/Cherry-pick/Revert/Reset) — Merge e Rebase são onde o conflito aparece na prática (ordem de estudo, não Requires)",
        }),
        concept({ order: 60, title: "Cherry-pick", requires: ["Commit"] }),
        concept({ order: 70, title: "Revert", requires: ["Commit"], note: "desfazer seguro/público — ensinar em par com Reset" }),
        concept({ order: 80, title: "Reset", requires: ["Commit"], note: "desfazer local/mutável — ensinar em par com Revert" }),
        concept({ order: 90, title: "Reflog", requires: ["Reset"], note: "rede de segurança para recuperar de Reset/Rebase mal feitos" }),
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
        concept({ order: 10, title: "README", note: "ponto de entrada de um repositório/projeto" }),
        concept({ order: 20, title: "Changelog", note: "registro por mudança" }),
        concept({ order: 30, title: "ADR", note: "Architecture Decision Record — registro por decisão" }),
        concept({ order: 40, title: "RFC", note: "proposta pré-decisão para mudanças maiores" }),
        concept({
          order: 50,
          title: "Runbook",
          note: "documentação operacional. Ponte futura para Platform / Reliability Engineering (Postmortem) — sem Requires (Epic 05 ainda não aprovado)",
        }),
      ],
    }),
  ],
});
