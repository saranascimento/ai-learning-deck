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
        concept({
          order: 10,
          title: "DRY",
          note: "Don't Repeat Yourself",
          summary:
            "Cada pedaço de conhecimento — uma regra, uma constante, uma decisão — deve ter uma única " +
            "representação no sistema, para que mudá-lo exija mexer em um lugar só.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "DRY (Don't Repeat Yourself) diz que todo conhecimento do sistema deve ter uma representação única e " +
                "autoritativa. Repare na palavra: conhecimento, não texto. O alvo não é código que \"parece igual\", " +
                "e sim a mesma regra ou decisão escrita em mais de um lugar.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "DRY é sobre não duplicar conhecimento, não sobre não repetir texto — centralize a regra que precisa " +
                "mudar junto, e deixe separado o que só parece igual.",
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
            "Preferir a solução mais simples que resolve o problema — complexidade tem custo de leitura, de teste " +
            "e de manutenção, e só se justifica quando compra algo que a versão simples não compra.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "KISS (Keep It Simple) é a heurística de escolher, entre as soluções que resolvem o problema, a mais " +
                "simples de entender e de mudar. Simples aqui não quer dizer \"curta\" nem \"fácil de escrever\": " +
                "quer dizer com poucas partes móveis e com um caminho de leitura direto.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Simples é o que se entende rápido e se muda com segurança — não o que tem menos linhas. Só aceite " +
                "complexidade que esteja comprando algo real.",
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
            "Não construir funcionalidade nem flexibilidade antes de existir uma necessidade real — o que se " +
            "prevê que vai ser preciso quase sempre custa mais do que rende.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "YAGNI (You Aren't Gonna Need It) é a regra de não implementar algo só porque \"talvez seja útil no " +
                "futuro\". Ela vale para funcionalidades, opções, parâmetros e camadas de abstração: só entram no " +
                "código quando há uma necessidade concreta e presente.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Construa para o que é preciso agora e mantenha o código fácil de mudar — o futuro imaginado quase " +
                "nunca chega do jeito previsto.",
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
            "O código deve se comportar do jeito que quem lê ou usa espera — nomes, convenções e efeitos que " +
            "surpreendem são fonte de bugs, mesmo quando \"funcionam\".",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "O Princípio da Menor Surpresa diz que uma função, uma API ou um módulo deve fazer o que o nome e o " +
                "contexto levam alguém a esperar. Se o comportamento real diverge da expectativa razoável — um " +
                "getter que altera estado, um retorno de tipo diferente conforme o caso — o código está " +
                "surpreendendo quem o usa.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Se quem lê o nome espera uma coisa e a função faz outra, o problema é do código, não de quem " +
                "chamou — faça o comportamento coincidir com a expectativa razoável.",
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
          summary:
            "O sinal visível de que o mesmo conhecimento foi escrito mais de uma vez: trechos copiados ou quase " +
            "idênticos que precisam ser alterados juntos — a violação de DRY vista no código pronto.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Duplicate Code é o code smell mais reconhecível: blocos de código iguais, ou quase iguais com " +
                "uma pequena variação, em mais de um lugar. Um smell não é um bug — o código funciona —, é um " +
                "sintoma na estrutura que indica que vale investigar. DRY é o princípio (não repita conhecimento); " +
                "Duplicate Code é como essa violação aparece quando você olha o código.",
            },
            { type: "heading", text: "Por que é um problema?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Duplicate Code é o sintoma de DRY violado: quando dois trechos precisam mudar juntos, eles " +
                "deveriam ser um só — mas só quando a semelhança é de conhecimento, não de coincidência.",
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
          summary:
            "Uma função que cresceu tanto que não dá para entender de uma vez: faz várias coisas, exige rolar a " +
            "tela e costuma ter comentários separando \"seções\" — sinal de que precisa ser dividida.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Long Method (ou Long Function) é o smell de uma função grande demais para ser compreendida de " +
                "relance. O número de linhas é só um indicador; o problema de fato é que ela reúne várias tarefas, " +
                "vários níveis de abstração e muitas variáveis locais que o leitor precisa manter na cabeça. É a " +
                "violação, vista no código, do que Functions (módulo Clean Code) recomenda.",
            },
            { type: "heading", text: "Por que é um problema?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Se você precisa de comentários para marcar seções dentro de uma função, cada seção provavelmente " +
                "quer ser uma função com esse nome.",
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
            "Uma função com parâmetros demais: chamadas difíceis de ler, fáceis de errar na ordem e sinal de que " +
            "os dados deveriam viajar juntos ou a função faz mais do que deveria.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Long Parameter List é o smell de funções que recebem mais argumentos do que se consegue manter " +
                "na cabeça — em geral, mais de três ou quatro. É a violação vista no código do que Function " +
                "Arguments (módulo Clean Code) recomenda escrever; os três Concepts formam uma sequência: escrever " +
                "bem, reconhecer a violação e corrigir (com Introduce Parameter Object, no módulo Refactoring).",
            },
            { type: "heading", text: "Por que é um problema?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Muitos parâmetros costumam esconder um conceito sem nome (dados que andam juntos) ou uma função que " +
                "faz demais — ache qual dos dois é antes de simplesmente reordenar os argumentos.",
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
          summary:
            "Uma classe que acumulou responsabilidades demais — muitos campos e métodos sem relação entre si — " +
            "o sintoma concreto de baixa coesão, e o ponto de partida para dividi-la.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Large Class é o smell de uma classe grande demais: muitos campos, muitos métodos, muitas " +
                "razões para mudar. Como Cohesion (módulo Programming Fundamentals) mede o quanto as partes de uma " +
                "classe pertencem juntas, uma classe grande normalmente é o sintoma de baixa coesão: vários " +
                "assuntos diferentes acabaram morando no mesmo lugar.",
            },
            { type: "heading", text: "Por que é um problema?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Se grupos diferentes de métodos usam grupos diferentes de campos, você tem mais de uma classe " +
                "morando no mesmo arquivo — separe-as.",
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
            "Um método que usa mais os dados de outro objeto do que os do próprio — sinal de que o comportamento " +
            "está no lugar errado e de acoplamento excessivo entre as duas classes.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Feature Envy é o smell de um método que parece \"invejar\" outra classe: gasta a maior parte do " +
                "tempo lendo e manipulando dados de outro objeto (vários getters ou campos dele), e quase " +
                "nada do objeto onde mora. É o sintoma concreto de acoplamento excessivo (Coupling, módulo " +
                "Programming Fundamentals): duas classes conhecem detalhes demais uma da outra.",
            },
            { type: "heading", text: "Por que é um problema?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Se um método usa mais os dados de outra classe do que os da sua, ele provavelmente pertence a " +
                "essa outra classe — leve o comportamento para perto dos dados.",
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
            "Usar strings e números soltos para representar conceitos do domínio (dinheiro, e-mail, CPF) em vez " +
            "de tipos próprios — o que espalha validação e permite misturar valores que não deveriam se misturar.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Primitive Obsession é o hábito de representar conceitos do domínio com tipos primitivos — string, " +
                "number, boolean — em vez de criar um tipo próprio. Um e-mail, um valor em reais, um CPF, um " +
                "intervalo de datas: todos viram simples strings ou números, e o significado e as regras ficam " +
                "só na cabeça de quem programa.",
            },
            { type: "heading", text: "Por que é um problema?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Se um valor tem regras, formato ou significado próprio, ele merece um tipo próprio — em vez de " +
                "ser uma string ou um número que todo mundo precisa lembrar de validar.",
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
