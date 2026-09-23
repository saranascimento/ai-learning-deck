import { area, module, concept } from "../builders.js";

export default area({
  slug: "platform-engineering",
  order: 50,
  title: "Platform Engineering",
  color: "#3FB6C6",
  summary:
    "O substrato de execução: web, APIs, GraphQL, bancos (fundamentos → modelagem → transações → " +
    "performance), NoSQL, caching, auth/authz, segurança, observabilidade, performance/confiabilidade, " +
    "containers, CI/CD, cloud, rede, segurança de cloud, Kubernetes.",
  phase: "Fase 2 concluída (2026-09-05) — FROZEN",
  modules: [
    module({
      slug: "web-fundamentals",
      order: 10,
      title: "Web Fundamentals",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Cliente-servidor → HTTP e componentes → evolução do protocolo → TLS → DNS → transporte → URL → " +
        "estado no cliente → SOP/CORS → canais persistentes. TLS é Task própria; HTTPS é subtopic de TLS.",
      concepts: [
        concept({
          order: 10,
          title: "Client-Server Model",
          note: "ponto de entrada",
          summary:
            "A divisão de papéis em que um cliente inicia pedidos e um servidor os atende — a base de quase tudo na " +
            "web, de um navegador acessando um site a um serviço chamando outro.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "No modelo cliente-servidor, dois papéis conversam pela rede: o cliente faz pedidos, e o servidor " +
                "espera por eles e responde. São papéis, e não tipos de máquina: um navegador, um aplicativo de " +
                "celular ou outro serviço podem ser clientes, e o mesmo programa pode ser servidor para uns e cliente " +
                "de outros. Quem inicia a conversa é sempre o cliente, e o servidor só responde ao que lhe é pedido.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O cliente pergunta, o servidor responde: quem pede está do lado de fora, e por isso o servidor " +
                "nunca deve confiar no que o cliente envia.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "A separação permite centralizar os dados e as regras de negócio em um só lugar e atender vários " +
                "clientes diferentes, um site, um aplicativo, um parceiro, com o mesmo servidor. Cada lado evolui e " +
                "escala de forma independente. Em troca, toda interação atravessa a rede, com latência e falhas " +
                "possíveis, e o servidor precisa tratar o cliente como uma fonte não confiável.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor HTTP mínimo em Node.js e um cliente que faz um pedido a ele:" },
            {
              type: "code",
              language: "javascript",
              filename: "client-server.js",
              code: [
                "import http from \"node:http\";",
                "",
                "// Servidor: espera pedidos e responde",
                "const server = http.createServer((request, response) => {",
                "  response.setHeader(\"content-type\", \"application/json\");",
                "  response.end(JSON.stringify({ message: \"olá\", path: request.url }));",
                "});",
                "server.listen(3000);",
                "",
                "// Cliente: inicia a conversa",
                "const response = await fetch(\"http://localhost:3000/saudacao\");",
                "await response.json();   // { message: \"olá\", path: \"/saudacao\" }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Os dois estão no mesmo programa só para o exemplo. Em um sistema real, o servidor roda em outra " +
                "máquina, e o cliente o encontra por um endereço, como veremos em DNS e URL.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O cliente não é confiável: qualquer valor que ele envia, incluindo preços, ids e permissões, pode ter sido alterado; valide e recalcule no servidor.",
                "O servidor não fala primeiro: para avisar o cliente de algo, é preciso um mecanismo extra, como WebSocket ou Server-Sent Events.",
                "A rede falha e demora: uma chamada ao servidor não é como uma chamada de função local, e o código precisa lidar com tempo limite e erro.",
              ],
            },
          ],
          examples: [
            {
              title: "Vários clientes, o mesmo servidor",
              context: "O servidor não sabe, nem precisa saber, que tipo de programa está do outro lado.",
              code: {
                language: "javascript",
                filename: "many-clients.js",
                code: [
                  "// Um navegador pediria HTML; um aplicativo e um parceiro, JSON. É o mesmo servidor.",
                  "await fetch(\"http://localhost:3000/produtos\", { headers: { accept: \"application/json\" } });",
                  "",
                  "// Outro serviço, chamando como cliente, com a sua identificação",
                  "await fetch(\"http://localhost:3000/produtos\", {",
                  "  headers: { accept: \"application/json\", authorization: \"Bearer token-do-servico\" },",
                  "});",
                ].join("\n"),
              },
              explanation:
                "O servidor decide o que responder pelo que chega no pedido, e não pelo tipo do cliente. Esse é o " +
                "motivo pelo qual uma mesma API atende site, aplicativo e integrações.",
            },
            {
              title: "Um servidor que também é cliente",
              context: "Em arquiteturas com vários serviços, o papel depende de quem está pedindo a quem.",
              code: {
                language: "javascript",
                filename: "server-as-client.js",
                code: [
                  "import http from \"node:http\";",
                  "",
                  "// Servidor para o navegador e cliente do serviço de preços",
                  "http.createServer(async (request, response) => {",
                  "  const prices = await fetch(\"http://prices.internal/lista\").then((r) => r.json());",
                  "  response.setHeader(\"content-type\", \"application/json\");",
                  "  response.end(JSON.stringify({ products: [\"caneta\"], prices }));",
                  "}).listen(3000);",
                ].join("\n"),
              },
              explanation:
                "Para o navegador, este programa é um servidor. Para o serviço de preços, é um cliente. Os papéis " +
                "são relativos a cada conversa.",
            },
            {
              title: "Nunca confiar no que o cliente envia",
              context: "Um valor enviado pelo cliente pode ter sido adulterado, mesmo que a interface só permita o correto.",
              code: {
                language: "javascript",
                filename: "untrusted-client.js",
                code: [
                  "const catalog = { caneta: 5, caderno: 20 };",
                  "",
                  "// Errado: confia no total que o cliente mandou",
                  "function checkoutTrusting(body) {",
                  "  return { charged: body.total };   // um cliente malicioso envia total: 0.01",
                  "}",
                  "",
                  "// Certo: recalcula com os preços do servidor",
                  "function checkout(body) {",
                  "  const total = body.items.reduce((sum, item) => sum + catalog[item.id] * item.quantity, 0);",
                  "  return { charged: total };",
                  "}",
                  "",
                  "checkout({ items: [{ id: \"caderno\", quantity: 2 }], total: 0.01 });   // { charged: 40 }",
                ].join("\n"),
              },
              explanation:
                "A validação no cliente melhora a experiência, mas não protege nada. As regras que importam precisam " +
                "ser aplicadas do lado do servidor.",
            },
          ],
          exercise: {
            problem:
              "O endpoint de pedido aceita o preço unitário que vem na requisição. Alguém com o navegador aberto " +
              "consegue comprar um item por qualquer valor.",
            problemCode: {
              language: "javascript",
              filename: "order-endpoint.js",
              code: [
                "const products = { \"caneta\": { price: 5 }, \"caderno\": { price: 20 } };",
                "",
                "function createOrder(body) {",
                "  // body: { items: [{ id, quantity, unitPrice }] }",
                "  const total = body.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);",
                "  return { status: 201, total };",
                "}",
                "",
                "createOrder({ items: [{ id: \"caderno\", quantity: 1, unitPrice: 0.01 }] });   // { status: 201, total: 0.01 }",
              ].join("\n"),
            },
            task:
              "Corrija `createOrder` para usar o preço do catálogo do servidor, recusando com status 400 produtos " +
              "desconhecidos ou quantidades inválidas.",
            hint: "Ignore `unitPrice`. Busque o produto em `products` pelo id e valide que `quantity` é um inteiro positivo.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-endpoint.fixed.js",
                code: [
                  "const products = { \"caneta\": { price: 5 }, \"caderno\": { price: 20 } };",
                  "",
                  "function createOrder(body) {",
                  "  let total = 0;",
                  "  for (const item of body.items ?? []) {",
                  "    const product = products[item.id];",
                  "    if (!product) return { status: 400, error: `produto desconhecido: ${item.id}` };",
                  "    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {",
                  "      return { status: 400, error: \"quantidade inválida\" };",
                  "    }",
                  "    total += product.price * item.quantity;",
                  "  }",
                  "  return { status: 201, total };",
                  "}",
                  "",
                  "createOrder({ items: [{ id: \"caderno\", quantity: 1, unitPrice: 0.01 }] });   // { status: 201, total: 20 }",
                ].join("\n"),
              },
              explanation:
                "O preço passou a vir do servidor, e o `unitPrice` enviado é ignorado. Entradas inválidas são recusadas " +
                "com 400, porque o cliente pode enviar qualquer coisa.",
            },
          },
        }),
        concept({
          order: 20,
          title: "HTTP",
          requires: ["Client-Server Model"],
          subtopics: ["request/response", "protocolo stateless"],
          note: "absorve Request & Response do rascunho",
          summary:
            "O protocolo de aplicação da web: o cliente envia uma requisição com método, endereço, cabeçalhos e " +
            "corpo opcional, e o servidor devolve uma resposta com status, cabeçalhos e corpo — sem guardar memória entre uma e outra.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "HTTP (HyperText Transfer Protocol) define o formato das mensagens trocadas entre cliente e servidor. " +
                "Uma requisição tem uma linha inicial (método, alvo e versão), cabeçalhos, uma linha em branco e um " +
                "corpo opcional. A resposta tem uma linha de status, cabeçalhos e um corpo. O protocolo é sem estado " +
                "(stateless): cada requisição é independente, e o servidor não se lembra das anteriores, a menos que o " +
                "cliente envie algo que as ligue, como um cookie.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada requisição HTTP é uma conversa completa em si: leva tudo de que o servidor precisa, e o " +
                "servidor responde sem depender do que veio antes.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "No HTTP/1.1, as mensagens são texto. O cliente abre uma conexão (TCP, e TLS no caso de HTTPS), envia a " +
                "requisição e lê a resposta. Nas versões 2 e 3 o formato passa a ser binário, mas a semântica, os " +
                "métodos, os status e os cabeçalhos, continua a mesma.",
            },
            {
              type: "code",
              language: "text",
              filename: "http-messages.txt",
              code: [
                "# Requisição",
                "GET /produtos?categoria=papelaria HTTP/1.1",
                "Host: loja.exemplo.com",
                "Accept: application/json",
                "",
                "# Resposta",
                "HTTP/1.1 200 OK",
                "Content-Type: application/json",
                "Content-Length: 26",
                "",
                "[{\"id\":1,\"nome\":\"caneta\"}]",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "http-anatomy.js",
              code: [
                "import http from \"node:http\";",
                "",
                "http.createServer((request, response) => {",
                "  console.log(request.method);          // \"GET\"",
                "  console.log(request.url);             // \"/produtos?categoria=papelaria\"",
                "  console.log(request.headers.accept);  // \"application/json\"",
                "",
                "  response.statusCode = 200;",
                "  response.setHeader(\"content-type\", \"application/json\");",
                "  response.end(JSON.stringify([{ id: 1, nome: \"caneta\" }]));",
                "}).listen(3000);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O código do servidor lê as mesmas partes que aparecem na mensagem em texto: método, alvo e " +
                "cabeçalhos na entrada, e status, cabeçalhos e corpo na saída.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "\"Sem estado\" não quer dizer que o servidor não guarda nada: quer dizer que cada requisição precisa trazer o que identifica o cliente, como um token ou um cookie.",
                "No HTTP/1.1, o cabeçalho `Host` é obrigatório: é ele que permite vários sites no mesmo endereço IP.",
                "HTTP não é HTTPS: sem TLS, tudo trafega em texto legível por quem está no caminho.",
                "O que muda entre as versões é o transporte, e não a semântica: um código escrito para 1.1 funciona em 2 e 3, e o mesmo `fetch` os negocia sozinho.",
              ],
            },
          ],
          examples: [
            {
              title: "Falando HTTP à mão, por uma conexão TCP",
              context: "Como o protocolo é texto, dá para conversar com um servidor sem nenhuma biblioteca de HTTP.",
              code: {
                language: "javascript",
                filename: "raw-http.js",
                code: [
                  "import net from \"node:net\";",
                  "",
                  "const socket = net.connect(3000, \"localhost\", () => {",
                  "  socket.write(\"GET /ola HTTP/1.1\\r\\nHost: localhost\\r\\nConnection: close\\r\\n\\r\\n\");",
                  "});",
                  "",
                  "socket.on(\"data\", (chunk) => console.log(chunk.toString()));",
                  "// HTTP/1.1 200 OK",
                  "// content-type: text/plain",
                  "// ...",
                  "//",
                  "// olá /ola",
                ].join("\n"),
              },
              explanation:
                "O `\\r\\n\\r\\n` é a linha em branco que termina os cabeçalhos. Bibliotecas como o `fetch` só " +
                "automatizam este formato.",
            },
            {
              title: "Sem estado: cada requisição se identifica sozinha",
              context: "O servidor não liga as duas chamadas; quem as liga é o que o cliente envia nelas.",
              code: {
                language: "javascript",
                filename: "stateless.js",
                code: [
                  "const headers = { authorization: \"Bearer token-da-ana\" };",
                  "",
                  "// Duas requisições independentes: cada uma carrega a sua identificação",
                  "await fetch(\"http://localhost:3000/perfil\", { headers });",
                  "await fetch(\"http://localhost:3000/pedidos\", { headers });",
                  "",
                  "// Sem o cabeçalho, o servidor não sabe quem está pedindo — mesmo logo após a chamada anterior",
                  "await fetch(\"http://localhost:3000/pedidos\");   // 401 Unauthorized",
                ].join("\n"),
              },
              explanation:
                "A terceira chamada falha, embora a segunda tenha acabado de funcionar. O servidor tratou cada uma " +
                "isoladamente, e é assim que HTTP escala sem lembrar de ninguém.",
            },
            {
              title: "Método, alvo e versão na linha inicial",
              context: "Ler a primeira linha da mensagem responde à maioria das dúvidas sobre o que foi pedido.",
              code: {
                language: "javascript",
                filename: "request-line.js",
                code: [
                  "const raw = \"POST /pedidos HTTP/1.1\\r\\nHost: loja.exemplo.com\\r\\nContent-Type: application/json\\r\\n\\r\\n{}\";",
                  "",
                  "const [head] = raw.split(\"\\r\\n\\r\\n\");",
                  "const [requestLine, ...headerLines] = head.split(\"\\r\\n\");",
                  "const [method, target, version] = requestLine.split(\" \");",
                  "",
                  "[method, target, version];   // [\"POST\", \"/pedidos\", \"HTTP/1.1\"]",
                ].join("\n"),
              },
              explanation:
                "É exatamente esta leitura que o Node faz para preencher `request.method` e `request.url`. O " +
                "exercício a seguir generaliza esse processo.",
            },
          ],
          exercise: {
            problem:
              "Você recebeu o texto bruto de uma requisição HTTP/1.1 e precisa extrair as suas partes para " +
              "registrá-las, sem usar o módulo `http`.",
            problemCode: {
              language: "javascript",
              filename: "parse-request.js",
              code: [
                "const raw = [",
                "  \"POST /pedidos?dry_run=1 HTTP/1.1\",",
                "  \"Host: loja.exemplo.com\",",
                "  \"Content-Type: application/json\",",
                "  \"\",",
                "  \"{\\\"item\\\":\\\"caneta\\\"}\",",
                "].join(\"\\r\\n\");",
                "",
                "function parseRequest(text) {",
                "  // devolver { method, path, version, headers, body }",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `parseRequest` para devolver o método, o caminho, a versão, os cabeçalhos (com nomes em " +
              "minúsculas) e o corpo.",
            hint: "Separe a mensagem no primeiro `\\r\\n\\r\\n`. A primeira linha do cabeçalho tem método, alvo e versão; as demais são `nome: valor`.",
            solution: {
              code: {
                language: "javascript",
                filename: "parse-request.fixed.js",
                code: [
                  "function parseRequest(text) {",
                  "  const separator = text.indexOf(\"\\r\\n\\r\\n\");",
                  "  const head = text.slice(0, separator);",
                  "  const body = text.slice(separator + 4);",
                  "",
                  "  const [requestLine, ...headerLines] = head.split(\"\\r\\n\");",
                  "  const [method, path, version] = requestLine.split(\" \");",
                  "",
                  "  const headers = {};",
                  "  for (const line of headerLines) {",
                  "    const colon = line.indexOf(\":\");",
                  "    headers[line.slice(0, colon).toLowerCase()] = line.slice(colon + 1).trim();",
                  "  }",
                  "",
                  "  return { method, path, version, headers, body };",
                  "}",
                  "",
                  "parseRequest(raw);",
                  "// { method: \"POST\", path: \"/pedidos?dry_run=1\", version: \"HTTP/1.1\",",
                  "//   headers: { host: \"loja.exemplo.com\", \"content-type\": \"application/json\" }, body: '{\"item\":\"caneta\"}' }",
                ].join("\n"),
              },
              explanation:
                "A mensagem tem três partes: a linha inicial, os cabeçalhos e o corpo, separados por linhas em branco. " +
                "Os nomes de cabeçalho são insensíveis a maiúsculas, por isso foram normalizados.",
            },
          },
        }),
        concept({
          order: 30,
          title: "HTTP Methods",
          requires: ["HTTP"],
          note: "GET/POST/PUT/PATCH/DELETE; safe & idempotent methods",
          summary:
            "Os verbos que dizem o que se quer fazer com um recurso — ler, criar, substituir, alterar, apagar — e " +
            "as garantias de cada um: se é seguro (não altera nada) e se é idempotente (repetir dá o mesmo efeito).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O método de uma requisição HTTP expressa a intenção sobre o recurso indicado no endereço. Além do " +
                "significado, cada método carrega garantias que clientes, proxies e navegadores usam: um método " +
                "seguro (safe) não deve alterar o estado do servidor, e um método idempotente pode ser repetido " +
                "sem que o efeito mude além da primeira vez. Isso decide, por exemplo, o que pode ser repetido " +
                "automaticamente depois de uma falha de rede.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O método diz a intenção e as garantias: GET só lê, e PUT e DELETE podem ser repetidos sem risco; " +
                "POST, não, e por isso repetir um POST pode duplicar o efeito.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "`GET` lê um recurso: seguro e idempotente. `HEAD` é um GET só com os cabeçalhos, e `OPTIONS` pergunta o que o recurso aceita.",
                "`POST` cria um recurso ou dispara uma ação: não é seguro nem idempotente.",
                "`PUT` substitui o recurso inteiro por aquele enviado: idempotente.",
                "`PATCH` altera parte do recurso: não é garantidamente idempotente.",
                "`DELETE` remove o recurso: idempotente, porque apagar duas vezes deixa o mesmo estado final.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor que trata cada método de um recurso `/pedidos`, com as respostas típicas:" },
            {
              type: "code",
              language: "javascript",
              filename: "methods.js",
              code: [
                "import http from \"node:http\";",
                "",
                "const orders = new Map();",
                "let nextId = 1;",
                "",
                "async function readJson(request) {",
                "  let text = \"\";",
                "  for await (const chunk of request) text += chunk;",
                "  return text ? JSON.parse(text) : {};",
                "}",
                "",
                "http.createServer(async (request, response) => {",
                "  const [, , id] = request.url.split(\"/\");   // /pedidos/1 → id = \"1\"",
                "  const send = (status, body, headers = {}) => {",
                "    response.writeHead(status, { \"content-type\": \"application/json\", ...headers });",
                "    response.end(body === undefined ? undefined : JSON.stringify(body));",
                "  };",
                "",
                "  switch (request.method) {",
                "    case \"GET\":                             // lê: seguro e idempotente",
                "      return id ? send(orders.has(id) ? 200 : 404, orders.get(id)) : send(200, [...orders.values()]);",
                "    case \"POST\": {                          // cria: nem seguro, nem idempotente",
                "      const order = { id: String(nextId++), ...(await readJson(request)) };",
                "      orders.set(order.id, order);",
                "      return send(201, order, { location: `/pedidos/${order.id}` });",
                "    }",
                "    case \"PUT\":                             // substitui inteiro: idempotente",
                "      orders.set(id, { id, ...(await readJson(request)) });",
                "      return send(200, orders.get(id));",
                "    case \"DELETE\":                          // apaga: idempotente",
                "      orders.delete(id);",
                "      return send(204);",
                "    default:",
                "      return send(405, { error: \"método não permitido\" }, { allow: \"GET, POST, PUT, DELETE\" });",
                "  }",
                "}).listen(3000);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Repare que o POST responde 201 com o cabeçalho `Location`, apontando para o recurso criado, e o " +
                "DELETE responde 204, sem corpo, mesmo se o pedido já não existir mais.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um GET que altera o estado, como `GET /pedidos/1/cancelar`, é disparado por rastreadores, por pré-carregamento do navegador e por cache, sem que ninguém peça.",
                "Repetir um POST depois de uma falha de rede pode criar o pedido duas vezes; para torná-lo seguro, use uma chave de idempotência.",
                "PUT e PATCH não são intercambiáveis: PUT substitui o recurso todo, e campos ausentes somem; PATCH altera só o que foi enviado.",
                "Idempotente não significa \"mesma resposta\": um segundo DELETE pode responder 404, e o estado final continua o mesmo.",
              ],
            },
          ],
          examples: [
            {
              title: "Só repetir automaticamente o que é idempotente",
              context: "Depois de uma falha de rede, repetir um pedido só é seguro se o método permitir.",
              code: {
                language: "javascript",
                filename: "safe-retry.js",
                code: [
                  "const IDEMPOTENT = new Set([\"GET\", \"HEAD\", \"OPTIONS\", \"PUT\", \"DELETE\"]);",
                  "",
                  "async function fetchWithRetry(url, options = {}, attempts = 3) {",
                  "  const method = (options.method ?? \"GET\").toUpperCase();",
                  "  const canRetry = IDEMPOTENT.has(method);",
                  "",
                  "  for (let attempt = 1; ; attempt++) {",
                  "    try { return await fetch(url, options); }",
                  "    catch (error) {",
                  "      if (!canRetry || attempt >= attempts) throw error;   // POST: nunca repete às cegas",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Repetir um `PUT` deixa o recurso no mesmo estado, e repetir um `POST` poderia cobrar duas vezes. " +
                "A regra de retry decorre das garantias do método.",
            },
            {
              title: "PUT substitui, PATCH altera",
              context: "A diferença aparece quando o corpo enviado tem só alguns campos.",
              code: {
                language: "javascript",
                filename: "put-vs-patch.js",
                code: [
                  "// Recurso atual: { id: 1, nome: \"Ana\", email: \"ana@x.com\", plano: \"premium\" }",
                  "",
                  "// PUT com corpo { nome: \"Ana Souza\" }: o recurso passa a ser SÓ isso",
                  "await fetch(\"/usuarios/1\", { method: \"PUT\", body: JSON.stringify({ nome: \"Ana Souza\" }) });",
                  "// → { id: 1, nome: \"Ana Souza\" }   (email e plano sumiram)",
                  "",
                  "// PATCH com o mesmo corpo: altera só o nome",
                  "await fetch(\"/usuarios/1\", { method: \"PATCH\", body: JSON.stringify({ nome: \"Ana Souza\" }) });",
                  "// → { id: 1, nome: \"Ana Souza\", email: \"ana@x.com\", plano: \"premium\" }",
                ].join("\n"),
              },
              explanation:
                "Enviar um corpo parcial com PUT apaga o que faltou. Para alterar um campo só, o método adequado é o " +
                "PATCH, ou um PUT com o recurso completo.",
            },
            {
              title: "Chave de idempotência em um POST",
              context: "Uma chave enviada pelo cliente permite que o servidor reconheça uma repetição e não a processe de novo.",
              code: {
                language: "javascript",
                filename: "idempotency-key.js",
                code: [
                  "// Cliente: gera a chave uma vez por operação e a reenvia se precisar repetir",
                  "const key = crypto.randomUUID();",
                  "await fetch(\"/pagamentos\", {",
                  "  method: \"POST\",",
                  "  headers: { \"idempotency-key\": key, \"content-type\": \"application/json\" },",
                  "  body: JSON.stringify({ valor: 100 }),",
                  "});",
                  "",
                  "// Servidor: guarda o resultado por chave e o devolve nas repetições",
                  "const results = new Map();",
                  "function createPayment(key, data) {",
                  "  if (results.has(key)) return results.get(key);   // repetição: mesmo resultado, sem cobrar de novo",
                  "  const payment = { id: crypto.randomUUID(), ...data };",
                  "  results.set(key, payment);",
                  "  return payment;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com a chave, um POST que falhou na rede pode ser repetido sem o risco de duplicar a cobrança. É a " +
                "forma de dar a um método não idempotente o comportamento de um idempotente.",
            },
          ],
          exercise: {
            problem:
              "O endpoint de pagamentos cria um novo pagamento a cada POST. Quando o cliente repete a chamada por " +
              "causa de um tempo limite, o cliente é cobrado duas vezes.",
            problemCode: {
              language: "javascript",
              filename: "payments.js",
              code: [
                "const payments = [];",
                "",
                "function createPayment(data) {",
                "  const payment = { id: payments.length + 1, ...data };",
                "  payments.push(payment);",
                "  return { status: 201, payment };",
                "}",
                "",
                "createPayment({ amount: 100 });",
                "createPayment({ amount: 100 });   // repetição: cobra de novo",
                "payments.length;                  // 2",
              ].join("\n"),
            },
            task:
              "Aceite uma chave de idempotência: a mesma chave devolve o mesmo pagamento, sem criar outro, e uma " +
              "chave nova cria um pagamento novo.",
            hint: "Guarde em um `Map` o resultado de cada chave. Se a chave já existe, devolva o resultado guardado.",
            solution: {
              code: {
                language: "javascript",
                filename: "payments.fixed.js",
                code: [
                  "const payments = [];",
                  "const byKey = new Map();",
                  "",
                  "function createPayment(key, data) {",
                  "  if (byKey.has(key)) return { status: 200, payment: byKey.get(key) };   // repetição",
                  "",
                  "  const payment = { id: payments.length + 1, ...data };",
                  "  payments.push(payment);",
                  "  byKey.set(key, payment);",
                  "  return { status: 201, payment };",
                  "}",
                  "",
                  "createPayment(\"chave-1\", { amount: 100 });   // { status: 201, ... }",
                  "createPayment(\"chave-1\", { amount: 100 });   // { status: 200, ... } o mesmo pagamento",
                  "payments.length;                              // 1",
                ].join("\n"),
              },
              explanation:
                "A segunda chamada com a mesma chave devolve o pagamento já criado, e o cliente não é cobrado de " +
                "novo. A resposta 200, em vez de 201, sinaliza que nada foi criado agora.",
            },
          },
        }),
        concept({
          order: 40,
          title: "HTTP Status Codes",
          requires: ["HTTP"],
          note: "classes 1xx–5xx",
          summary:
            "Os números de três dígitos com que o servidor resume o resultado de uma requisição — sucesso, " +
            "redirecionamento, erro do cliente ou erro do servidor —, organizados em cinco classes.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Toda resposta HTTP começa com um código de status, e o primeiro dígito indica a classe: 1xx " +
                "(informativos), 2xx (sucesso), 3xx (redirecionamento), 4xx (erro do cliente: o pedido está errado) " +
                "e 5xx (erro do servidor: o pedido era válido, e algo falhou). Clientes, proxies e ferramentas de " +
                "monitoramento decidem o que fazer com a resposta com base no código, sem precisar ler o corpo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O código de status é o resumo que as máquinas leem: escolha o mais específico e honesto, pois " +
                "cliente, cache e monitoramento se baseiam nele.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "2xx: `200 OK`, `201 Created` (criado, com `Location`), `202 Accepted` (aceito para processar depois), `204 No Content` (sucesso sem corpo).",
                "3xx: `301` e `308` (mudança permanente), `302` e `307` (temporária), `304 Not Modified` (use o cache).",
                "4xx: `400` (requisição inválida), `401` (não autenticado), `403` (proibido), `404` (não encontrado), `409` (conflito), `422` (dados inválidos), `429` (limite de requisições excedido).",
                "5xx: `500` (erro interno), `502` (resposta inválida de um serviço a montante), `503` (indisponível), `504` (tempo limite do serviço a montante).",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor que traduz o resultado da regra de negócio no status correto:" },
            {
              type: "code",
              language: "javascript",
              filename: "status-codes.js",
              code: [
                "class NotFoundError extends Error {}",
                "class ConflictError extends Error {}",
                "class ValidationError extends Error {}",
                "",
                "function statusFor(error) {",
                "  if (error instanceof ValidationError) return 422;",
                "  if (error instanceof NotFoundError) return 404;",
                "  if (error instanceof ConflictError) return 409;",
                "  return 500;   // qualquer coisa inesperada é culpa do servidor",
                "}",
                "",
                "function handle(response, action) {",
                "  try {",
                "    const result = action();",
                "    response.writeHead(200, { \"content-type\": \"application/json\" });",
                "    response.end(JSON.stringify(result));",
                "  } catch (error) {",
                "    response.writeHead(statusFor(error), { \"content-type\": \"application/json\" });",
                "    response.end(JSON.stringify({ error: error.message }));",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A classe do erro decide o status. Um erro que o cliente pode corrigir vira 4xx, e um imprevisto do " +
                "servidor, 500.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Responder `200` com `{ \"error\": ... }` no corpo esconde a falha: caches, monitoramento e clientes a tratam como sucesso.",
                "`401` significa \"não sei quem você é\" (autenticação), e `403`, \"sei quem é, mas não pode\" (autorização); confundi-los dificulta o tratamento no cliente.",
                "Devolver `500` para erros de entrada faz o monitoramento acusar falhas do servidor que são do cliente, e gera alarmes falsos.",
                "No `fetch`, um 404 ou 500 não lança exceção: a promessa só é rejeitada em falha de rede, e é preciso checar `response.ok`.",
              ],
            },
          ],
          examples: [
            {
              title: "O `fetch` não falha em 4xx e 5xx",
              context: "Um erro de status é uma resposta válida do ponto de vista da rede.",
              code: {
                language: "javascript",
                filename: "fetch-status.js",
                code: [
                  "const response = await fetch(\"http://localhost:3000/pedidos/999\");",
                  "",
                  "response.ok;       // false",
                  "response.status;   // 404",
                  "",
                  "// É preciso verificar explicitamente",
                  "if (!response.ok) throw new Error(`falha HTTP ${response.status}`);",
                ].join("\n"),
              },
              explanation:
                "Sem a verificação, o código seguiria tentando ler um pedido que não existe. Muitos clientes HTTP " +
                "encapsulam essa checagem, mas o `fetch` não.",
            },
            {
              title: "429 com `Retry-After`",
              context: "Um status de limite de uso é mais útil quando diz quando tentar de novo.",
              code: {
                language: "javascript",
                filename: "rate-limit.js",
                code: [
                  "// Servidor",
                  "response.writeHead(429, { \"retry-after\": \"30\", \"content-type\": \"application/json\" });",
                  "response.end(JSON.stringify({ error: \"muitas requisições\" }));",
                  "",
                  "// Cliente: respeita o tempo indicado",
                  "if (response.status === 429) {",
                  "  const seconds = Number(response.headers.get(\"retry-after\") ?? 1);",
                  "  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O código diz o que aconteceu, e o cabeçalho diz o que fazer. Juntos, permitem que o cliente se " +
                "comporte bem sem intervenção humana.",
            },
            {
              title: "301, 302, 307 e 308: o método é preservado?",
              context: "Todos redirecionam, mas nem todos mantêm o método da requisição original.",
              code: {
                language: "text",
                filename: "redirects.txt",
                code: [
                  "301 Moved Permanently   permanente; navegadores podem trocar POST por GET",
                  "302 Found               temporário; navegadores podem trocar POST por GET",
                  "307 Temporary Redirect  temporário; PRESERVA o método e o corpo",
                  "308 Permanent Redirect  permanente; PRESERVA o método e o corpo",
                  "",
                  "Para redirecionar um POST sem mudar o método, use 307 (ou 308).",
                ].join("\n"),
              },
              explanation:
                "Com `301` e `302`, um POST redirecionado costuma virar GET, e o corpo se perde. Quando o método " +
                "importa, `307` e `308` são os códigos corretos.",
            },
          ],
          exercise: {
            problem:
              "O tratador responde sempre `200`, e coloca o erro no corpo. O monitoramento nunca vê falhas, e o " +
              "cliente precisa ler o corpo para saber se deu certo.",
            problemCode: {
              language: "javascript",
              filename: "handler.js",
              code: [
                "class NotFoundError extends Error {}",
                "class ValidationError extends Error {}",
                "",
                "function handleRequest(action) {",
                "  try {",
                "    return { status: 200, body: action() };",
                "  } catch (error) {",
                "    return { status: 200, body: { error: error.message } };   // sempre 200",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Faça `handleRequest` devolver 404 para `NotFoundError`, 422 para `ValidationError` e 500 para o resto, " +
              "sem expor a mensagem interna em erros inesperados.",
            hint: "Use `instanceof` para escolher o status. Para o 500, devolva uma mensagem genérica.",
            solution: {
              code: {
                language: "javascript",
                filename: "handler.fixed.js",
                code: [
                  "class NotFoundError extends Error {}",
                  "class ValidationError extends Error {}",
                  "",
                  "function handleRequest(action) {",
                  "  try {",
                  "    return { status: 200, body: action() };",
                  "  } catch (error) {",
                  "    if (error instanceof NotFoundError) return { status: 404, body: { error: error.message } };",
                  "    if (error instanceof ValidationError) return { status: 422, body: { error: error.message } };",
                  "    return { status: 500, body: { error: \"erro interno\" } };   // sem vazar detalhes",
                  "  }",
                  "}",
                  "",
                  "handleRequest(() => { throw new NotFoundError(\"pedido não encontrado\"); });",
                  "// { status: 404, body: { error: \"pedido não encontrado\" } }",
                ].join("\n"),
              },
              explanation:
                "O status agora descreve o resultado, e o monitoramento passa a enxergar os 5xx. No 500, o corpo é " +
                "genérico, porque a mensagem de um erro inesperado pode revelar detalhes internos.",
            },
          },
        }),
        concept({
          order: 50,
          title: "HTTP Headers",
          requires: ["HTTP"],
          note: "metadados da requisição e da resposta",
          summary:
            "Os pares nome-valor que acompanham toda requisição e resposta HTTP e descrevem o conteúdo, o cliente, " +
            "o cache, a autenticação e a forma como a mensagem deve ser tratada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Cabeçalhos são metadados: dizem como interpretar e tratar a mensagem, sem fazer parte do conteúdo. " +
                "Os nomes não diferenciam maiúsculas de minúsculas. Alguns descrevem o corpo (`Content-Type`, " +
                "`Content-Length`), outros negociam o formato (`Accept`), identificam quem pede (`Authorization`, " +
                "`User-Agent`, `Origin`), controlam o cache (`Cache-Control`, `ETag`) ou guardam o estado do cliente " +
                "(`Cookie`, `Set-Cookie`).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O corpo diz o quê, os cabeçalhos dizem como: formato, idioma, cache, identidade e segurança " +
                "viajam nos cabeçalhos, e boa parte do comportamento da web depende deles.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Descrevem o corpo: `Content-Type: application/json`, `Content-Length`, `Content-Encoding: gzip`.",
                "Negociam a resposta: `Accept` (formato), `Accept-Language`, `Accept-Encoding`.",
                "Identificam: `Authorization`, `Cookie`, `User-Agent`, `Host`, `Origin`.",
                "Controlam o cache: `Cache-Control`, `ETag` e `If-None-Match`, `Last-Modified`, `Vary`.",
                "Orientam o navegador: `Location` (redirecionamento), `Set-Cookie`, `Strict-Transport-Security`, `Content-Security-Policy`.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor que usa `ETag` e `If-None-Match` para evitar reenviar um conteúdo que o cliente já tem:" },
            {
              type: "code",
              language: "javascript",
              filename: "headers.js",
              code: [
                "import http from \"node:http\";",
                "import { createHash } from \"node:crypto\";",
                "",
                "const body = JSON.stringify({ produtos: [\"caneta\", \"caderno\"] });",
                "const etag = `\"${createHash(\"sha1\").update(body).digest(\"hex\")}\"`;",
                "",
                "http.createServer((request, response) => {",
                "  // O Node entrega os nomes dos cabeçalhos em minúsculas",
                "  if (request.headers[\"if-none-match\"] === etag) {",
                "    response.writeHead(304, { etag });   // o cliente já tem a versão atual: sem corpo",
                "    return response.end();",
                "  }",
                "  response.writeHead(200, { \"content-type\": \"application/json\", etag, \"cache-control\": \"no-cache\" });",
                "  response.end(body);",
                "}).listen(3000);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na primeira visita o cliente recebe o corpo e o `ETag`. Nas seguintes, ele envia o `ETag` em " +
                "`If-None-Match`, e o servidor responde 304, sem repetir o corpo.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Nomes de cabeçalho não diferenciam maiúsculas: o Node os entrega em minúsculas, e comparar com `\"Content-Type\"` falha.",
                "Alguns cabeçalhos podem se repetir, como `Set-Cookie`; juntar tudo em uma string perde valores, e o `fetch` oferece `headers.getSetCookie()` para lê-los.",
                "Cabeçalhos enviados pelo cliente, como `User-Agent` e `X-Forwarded-For`, podem ser falsificados; não os use como prova de identidade.",
                "Cabeçalhos com dados sensíveis, como `Authorization`, não devem aparecer em logs, e há limites de tamanho (na ordem de 8 KB) que quebram requisições com cookies enormes.",
              ],
            },
          ],
          examples: [
            {
              title: "Negociação de conteúdo com `Accept`",
              context: "O cliente diz o que aceita, e o servidor escolhe a representação.",
              code: {
                language: "javascript",
                filename: "content-negotiation.js",
                code: [
                  "function respond(request, response, data) {",
                  "  const accept = request.headers.accept ?? \"\";",
                  "",
                  "  if (accept.includes(\"text/csv\")) {",
                  "    response.writeHead(200, { \"content-type\": \"text/csv\" });",
                  "    return response.end(data.map((row) => Object.values(row).join(\",\")).join(\"\\n\"));",
                  "  }",
                  "",
                  "  response.writeHead(200, { \"content-type\": \"application/json\" });",
                  "  response.end(JSON.stringify(data));",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O mesmo recurso pode ser servido em formatos diferentes, conforme o `Accept`. Quando a resposta " +
                "varia por um cabeçalho de requisição, o servidor deve incluí-lo em `Vary`, para que caches saibam.",
            },
            {
              title: "Lendo cabeçalhos com `Headers`",
              context: "A API do `fetch` normaliza os nomes e trata os valores repetidos.",
              code: {
                language: "javascript",
                filename: "headers-api.js",
                code: [
                  "const headers = new Headers({ \"Content-Type\": \"application/json\" });",
                  "",
                  "headers.get(\"content-type\");   // \"application/json\" — o nome não diferencia maiúsculas",
                  "headers.has(\"CONTENT-TYPE\");   // true",
                  "",
                  "headers.append(\"set-cookie\", \"a=1\");",
                  "headers.append(\"set-cookie\", \"b=2\");",
                  "headers.getSetCookie();         // [\"a=1\", \"b=2\"] — dois valores, sem juntar em um só",
                ].join("\n"),
              },
              explanation:
                "`get` e `has` ignoram a caixa do nome. `getSetCookie` existe porque `Set-Cookie` é o caso em que " +
                "juntar os valores com vírgula corromperia os dados.",
            },
            {
              title: "O `X-` já não é necessário",
              context: "O prefixo `X-` para cabeçalhos personalizados foi desaconselhado, e nomes claros bastam.",
              code: {
                language: "javascript",
                filename: "custom-headers.js",
                code: [
                  "// Antigo: prefixo X- para \"não padronizado\"",
                  "// X-Request-Id: 8d2f...",
                  "",
                  "// Hoje: um nome descritivo, sem o prefixo",
                  "await fetch(\"http://localhost:3000/pedidos\", {",
                  "  headers: { \"request-id\": crypto.randomUUID() },",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Muitos cabeçalhos `X-` viraram padrão de fato, e o prefixo só atrapalhava a migração. Em novos " +
                "cabeçalhos, escolha um nome descritivo.",
            },
          ],
          exercise: {
            problem:
              "O servidor sempre devolve o corpo completo da lista de produtos, mesmo quando o cliente já tem a " +
              "versão mais recente.",
            problemCode: {
              language: "javascript",
              filename: "conditional-get.js",
              code: [
                "import { createHash } from \"node:crypto\";",
                "",
                "const products = [\"caneta\", \"caderno\"];",
                "",
                "function handle(request) {",
                "  // request: { headers: { ... } } com os nomes em minúsculas",
                "  return { status: 200, headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(products) };",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente a requisição condicional: calcule um `ETag` do corpo, devolva-o, e responda 304, sem corpo, " +
              "quando `if-none-match` for igual a ele.",
            hint: "Calcule o hash do corpo uma vez. Compare `request.headers[\"if-none-match\"]` com o `ETag` antes de devolver o corpo.",
            solution: {
              code: {
                language: "javascript",
                filename: "conditional-get.fixed.js",
                code: [
                  "import { createHash } from \"node:crypto\";",
                  "",
                  "const products = [\"caneta\", \"caderno\"];",
                  "",
                  "function handle(request) {",
                  "  const body = JSON.stringify(products);",
                  "  const etag = `\"${createHash(\"sha1\").update(body).digest(\"hex\")}\"`;",
                  "",
                  "  if (request.headers[\"if-none-match\"] === etag) {",
                  "    return { status: 304, headers: { etag }, body: \"\" };",
                  "  }",
                  "  return { status: 200, headers: { \"content-type\": \"application/json\", etag }, body };",
                  "}",
                  "",
                  "const first = handle({ headers: {} });                                          // 200, com etag",
                  "const second = handle({ headers: { \"if-none-match\": first.headers.etag } });    // 304, sem corpo",
                ].join("\n"),
              },
              explanation:
                "Na primeira chamada, o cliente recebe o `ETag`. Na segunda, ao reenviá-lo, recebe 304 e reaproveita " +
                "o que já tem, economizando banda.",
            },
          },
        }),
        concept({
          order: 60,
          title: "HTTP Evolution (1.1 / 2 / 3)",
          requires: ["HTTP"],
          subtopics: ["HTTP/1.1: keep-alive, pipelining, head-of-line blocking", "HTTP/2: multiplexing, HPACK, server push", "HTTP/3: QUIC sobre UDP, 0-RTT, migração de conexão"],
          note: "consolidada (A1)",
          summary:
            "Como o HTTP foi reduzindo a latência sem mudar a sua semântica: do texto sobre uma conexão por pedido " +
            "no 1.1, ao multiplexamento binário do HTTP/2, e ao HTTP/3 sobre QUIC e UDP.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A semântica do HTTP, métodos, status e cabeçalhos, é a mesma nas três versões. O que muda é como as " +
                "mensagens são transportadas. O HTTP/1.1 usa texto e reaproveita conexões TCP (keep-alive), mas " +
                "responde a um pedido por vez em cada conexão. O HTTP/2 é binário e multiplexa vários pedidos " +
                "simultâneos em uma única conexão, com compressão de cabeçalhos (HPACK). O HTTP/3 troca o TCP pelo " +
                "QUIC, sobre UDP, para eliminar o bloqueio que perdas de pacotes causam no TCP.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada versão ataca um gargalo do transporte: reaproveitar conexões (1.1), enviar várias requisições " +
                "em uma conexão (2) e não deixar uma perda de pacote bloquear todas (3) — sem mudar o que os " +
                "métodos e os status significam.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "HTTP/1.1: conexões persistentes por padrão; sem multiplexação real, então um pedido lento bloqueia os seguintes (head-of-line blocking) e os navegadores abrem cerca de seis conexões por origem para contornar.",
                "HTTP/2: um único TCP com vários fluxos (streams) simultâneos, cabeçalhos comprimidos com HPACK; o server push existiu, mas caiu em desuso e foi removido dos navegadores.",
                "HTTP/3: sobre QUIC (UDP), com fluxos independentes, TLS 1.3 embutido, conexão que sobrevive à mudança de rede e estabelecimento mais rápido, inclusive com 0-RTT em retomadas.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "duas requisições simultâneas em uma única conexão HTTP/2, com o módulo `node:http2`:" },
            {
              type: "code",
              language: "javascript",
              filename: "http2.js",
              code: [
                "import http2 from \"node:http2\";",
                "",
                "// Servidor HTTP/2 em texto puro (h2c), só para o exemplo local",
                "const server = http2.createServer();",
                "server.on(\"stream\", (stream, headers) => {",
                "  stream.respond({ \":status\": 200, \"content-type\": \"text/plain\" });",
                "  stream.end(`resposta para ${headers[\":path\"]}`);",
                "});",
                "server.listen(8080);",
                "",
                "// Cliente: uma conexão, vários fluxos ao mesmo tempo",
                "const session = http2.connect(\"http://localhost:8080\");",
                "",
                "const get = (path) => new Promise((resolve) => {",
                "  const request = session.request({ \":path\": path });",
                "  let data = \"\";",
                "  request.on(\"data\", (chunk) => (data += chunk));",
                "  request.on(\"end\", () => resolve(data));",
                "  request.end();",
                "});",
                "",
                "await Promise.all([get(\"/a\"), get(\"/b\")]);   // [\"resposta para /a\", \"resposta para /b\"]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Os dois pedidos viajaram pela mesma conexão, sem esperar um pelo outro. Na web, os navegadores " +
                "usam HTTP/2 e HTTP/3 apenas sobre TLS.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O HTTP/2 resolve o bloqueio no nível do HTTP, mas continua sobre um único TCP: uma perda de pacote ainda atrasa todos os fluxos, e isso é o que o HTTP/3 corrige.",
                "Otimizações do HTTP/1.1, como juntar arquivos em um só e espalhar recursos em vários domínios (domain sharding), perdem o sentido no HTTP/2 e podem até prejudicar.",
                "O HTTP/3 usa UDP, e algumas redes o bloqueiam; por isso o navegador tenta HTTP/3 e recua para HTTP/2 se falhar.",
                "O 0-RTT pode ser reproduzido por um atacante (replay); só deve valer para requisições idempotentes.",
              ],
            },
          ],
          examples: [
            {
              title: "Reaproveitar conexões no HTTP/1.1",
              context: "Sem keep-alive, cada pedido paga o custo de abrir uma nova conexão TCP.",
              code: {
                language: "javascript",
                filename: "keep-alive.js",
                code: [
                  "import http from \"node:http\";",
                  "",
                  "// Uma conexão nova por pedido",
                  "const agentWithoutReuse = new http.Agent({ keepAlive: false });",
                  "",
                  "// A mesma conexão é reaproveitada entre os pedidos",
                  "const agentWithReuse = new http.Agent({ keepAlive: true });",
                  "",
                  "http.get({ port: 3000, agent: agentWithReuse }, (response) => response.resume());",
                ].join("\n"),
              },
              explanation:
                "Em seis pedidos sequenciais, o agente sem reaproveitamento abre seis conexões, e o com " +
                "reaproveitamento abre apenas uma. Cada conexão evitada economiza o handshake do TCP, e do TLS.",
            },
            {
              title: "Como o cliente descobre o HTTP/3",
              context: "O primeiro contato costuma ser por HTTP/1.1 ou 2, e o servidor anuncia que há uma opção melhor.",
              code: {
                language: "text",
                filename: "alt-svc.txt",
                code: [
                  "HTTP/2 200",
                  "content-type: text/html",
                  "alt-svc: h3=\":443\"; ma=86400",
                  "",
                  "# \"Também estou disponível em HTTP/3, na porta 443 (UDP), pelas próximas 24 horas.\"",
                  "# O navegador tenta HTTP/3 nas próximas visitas e, se falhar, volta ao HTTP/2.",
                ].join("\n"),
              },
              explanation:
                "O cabeçalho `Alt-Svc` é o convite. A escolha do protocolo é invisível para o código da aplicação, " +
                "que continua usando `fetch` da mesma forma.",
            },
            {
              title: "A semântica não muda entre as versões",
              context: "Aplicações não precisam de código diferente para cada versão do protocolo.",
              code: {
                language: "javascript",
                filename: "same-semantics.js",
                code: [
                  "// Este código não sabe, e não precisa saber, qual versão do HTTP foi usada",
                  "const response = await fetch(\"https://loja.exemplo.com/produtos\", {",
                  "  method: \"GET\",",
                  "  headers: { accept: \"application/json\" },",
                  "});",
                  "",
                  "response.status;                         // 200",
                  "response.headers.get(\"content-type\");   // \"application/json\"",
                ].join("\n"),
              },
              explanation:
                "Método, status e cabeçalhos são os mesmos em 1.1, 2 e 3. Quem escolhe a versão é a negociação entre " +
                "o navegador (ou cliente) e o servidor.",
            },
          ],
          exercise: {
            problem:
              "Um cliente faz seis chamadas sequenciais ao mesmo servidor e configurou o agente sem reaproveitar " +
              "conexões. O servidor recebe seis conexões TCP para o que poderia ser uma.",
            problemCode: {
              language: "javascript",
              filename: "connections.js",
              code: [
                "import http from \"node:http\";",
                "",
                "const server = http.createServer((request, response) => response.end(\"ok\"));",
                "let connections = 0;",
                "server.on(\"connection\", () => connections++);",
                "await new Promise((resolve) => server.listen(3000, resolve));",
                "",
                "const agent = new http.Agent({ keepAlive: false });",
                "",
                "for (let i = 0; i < 6; i++) {",
                "  await new Promise((resolve) => http.get({ port: 3000, agent }, (r) => { r.resume(); r.on(\"end\", resolve); }));",
                "}",
                "",
                "connections;   // 6",
              ].join("\n"),
            },
            task:
              "Faça o cliente reaproveitar a conexão nas seis chamadas e confirme que o servidor vê apenas uma.",
            hint: "Mude a configuração do `Agent`, e lembre-se de destruí-lo no final para que o processo possa terminar.",
            solution: {
              code: {
                language: "javascript",
                filename: "connections.fixed.js",
                code: [
                  "const agent = new http.Agent({ keepAlive: true });",
                  "",
                  "for (let i = 0; i < 6; i++) {",
                  "  await new Promise((resolve) => http.get({ port: 3000, agent }, (r) => { r.resume(); r.on(\"end\", resolve); }));",
                  "}",
                  "",
                  "connections;   // 1",
                  "",
                  "agent.destroy();   // fecha as conexões ociosas ao terminar",
                  "server.close();",
                ].join("\n"),
              },
              explanation:
                "Com `keepAlive: true`, as seis chamadas usam a mesma conexão TCP. É o ganho do HTTP/1.1 persistente, " +
                "e a base da qual o HTTP/2 parte para multiplexar.",
            },
          },
        }),
        concept({
          order: 70,
          title: "TLS",
          subtopics: ["HTTPS = HTTP sobre TLS", "handshake", "certificados e cadeia de confiança", "SNI", "HSTS"],
          note: "Task própria (decisão 4, exceção). Application Security / Encryption at Rest & in Transit aponta para cá",
          revisit: ["Platform / Application Security / Encryption at Rest & in Transit"],
          summary:
            "O protocolo que protege a comunicação na rede: criptografa o tráfego, garante que ele não foi alterado " +
            "e comprova, por certificado, que o servidor é quem diz ser — o T do HTTPS.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "TLS (Transport Layer Security) é a camada de segurança sobre a conexão. Ele dá três garantias: " +
                "confidencialidade (ninguém no caminho lê o conteúdo), integridade (ninguém o altera sem ser notado) " +
                "e autenticação do servidor, por meio de um certificado. HTTPS é simplesmente HTTP sobre TLS. Sem " +
                "TLS, senhas e cookies trafegam em texto, legíveis por qualquer rede intermediária.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "TLS criptografa o tráfego e prova a identidade do servidor: o cliente combina uma chave com quem " +
                "de fato é o dono do domínio, e nenhuma rede no meio consegue ler ou alterar a conversa.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Handshake: cliente e servidor combinam a versão e os algoritmos, o servidor apresenta o certificado, e os dois derivam uma chave de sessão (no TLS 1.3, com uma única ida e volta). Depois, o tráfego é criptografado com essa chave.",
                "Certificado: documento assinado por uma autoridade certificadora (CA) que liga o domínio a uma chave pública. O cliente valida a cadeia, do certificado do servidor até uma CA raiz que já confia, além da validade e do nome.",
                "SNI (Server Name Indication): o cliente informa o nome do site no início do handshake, para que um servidor com muitos domínios no mesmo IP apresente o certificado certo.",
                "HSTS: o cabeçalho `Strict-Transport-Security` manda o navegador usar sempre HTTPS para aquele domínio, e recusar conexões sem TLS.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor HTTPS com HSTS, e um cliente que inspeciona o certificado recebido:" },
            {
              type: "code",
              language: "javascript",
              filename: "tls.js",
              code: [
                "import https from \"node:https\";",
                "import tls from \"node:tls\";",
                "import { readFileSync } from \"node:fs\";",
                "",
                "// Servidor: chave privada e certificado; o HSTS manda usar sempre HTTPS",
                "https.createServer(",
                "  { key: readFileSync(\"chave.pem\"), cert: readFileSync(\"certificado.pem\") },",
                "  (request, response) => {",
                "    response.setHeader(\"strict-transport-security\", \"max-age=31536000; includeSubDomains\");",
                "    response.end(\"conexão protegida\");",
                "  },",
                ").listen(8443);",
                "",
                "// Cliente: abre a conexão TLS e lê o que o servidor apresentou",
                "const socket = tls.connect(443, \"loja.exemplo.com\", { servername: \"loja.exemplo.com\" }, () => {",
                "  socket.getProtocol();                    // \"TLSv1.3\"",
                "  const certificate = socket.getPeerCertificate();",
                "  certificate.subject.CN;                  // \"loja.exemplo.com\"",
                "  certificate.valid_to;                    // \"Jan  1 23:59:59 2027 GMT\"",
                "  socket.authorized;                       // true: a cadeia foi validada",
                "  socket.end();",
                "});",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A opção `servername` é o SNI. Se o certificado não bater com o nome, estiver vencido ou vier de uma " +
                "autoridade desconhecida, `authorized` é `false`, e uma requisição HTTPS normal seria recusada.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "`rejectUnauthorized: false` desliga a validação do certificado: a conexão continua criptografada, mas com qualquer um, inclusive um atacante; nunca use em produção.",
                "TLS não autentica o usuário, só o servidor (e o cliente, se houver mTLS): login e permissões são outra camada.",
                "O tráfego é protegido, mas nem tudo fica oculto: o endereço IP, o tamanho e o momento das mensagens continuam visíveis, e o nome do site no SNI é enviado em claro, a menos que se use Encrypted Client Hello.",
                "Um certificado vencido derruba o serviço: automatize a renovação e monitore a validade.",
                "Quando o TLS termina no balanceador, o trecho interno pode ficar sem criptografia; isso deve ser uma decisão consciente.",
              ],
            },
          ],
          examples: [
            {
              title: "Ler a validade de um certificado",
              context: "A causa mais comum de queda em HTTPS é um certificado que venceu sem ninguém notar.",
              code: {
                language: "javascript",
                filename: "certificate-expiry.js",
                code: [
                  "import tls from \"node:tls\";",
                  "",
                  "function checkCertificate(host) {",
                  "  return new Promise((resolve, reject) => {",
                  "    const socket = tls.connect(443, host, { servername: host }, () => {",
                  "      const { valid_to } = socket.getPeerCertificate();",
                  "      const daysLeft = Math.floor((new Date(valid_to) - Date.now()) / 86_400_000);",
                  "      socket.end();",
                  "      resolve({ host, daysLeft, authorized: socket.authorized });",
                  "    });",
                  "    socket.on(\"error\", reject);",
                  "  });",
                  "}",
                  "",
                  "await checkCertificate(\"loja.exemplo.com\");   // { host: \"loja.exemplo.com\", daysLeft: 62, authorized: true }",
                ].join("\n"),
              },
              explanation:
                "Uma verificação assim, rodando todos os dias, avisa semanas antes do vencimento. É o tipo de alarme " +
                "que evita uma interrupção completamente evitável.",
            },
            {
              title: "HSTS: nunca mais aceitar HTTP",
              context: "Uma vez visto o cabeçalho, o navegador converte por conta própria os acessos para HTTPS.",
              code: {
                language: "text",
                filename: "hsts.txt",
                code: [
                  "HTTP/1.1 200 OK",
                  "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
                  "",
                  "# max-age: por quanto tempo (em segundos) lembrar da regra — aqui, um ano",
                  "# includeSubDomains: vale também para os subdomínios",
                  "# preload: permite entrar na lista embutida nos navegadores, que protege até a primeira visita",
                ].join("\n"),
              },
              explanation:
                "Sem HSTS, o primeiro acesso a `http://` pode ser interceptado e mantido em texto. Com o cabeçalho, o " +
                "navegador passa a recusar essa possibilidade.",
            },
            {
              title: "O atalho perigoso: desligar a validação",
              context: "Muitas vezes feito \"só para funcionar\" em desenvolvimento, e esquecido no código de produção.",
              code: {
                language: "javascript",
                filename: "reject-unauthorized.js",
                code: [
                  "import https from \"node:https\";",
                  "",
                  "// Perigoso: aceita qualquer certificado, inclusive o de um atacante no meio do caminho",
                  "const insecure = new https.Agent({ rejectUnauthorized: false });",
                  "",
                  "// Correto para certificados de desenvolvimento: confiar em uma CA específica",
                  "import { readFileSync } from \"node:fs\";",
                  "const trusted = new https.Agent({ ca: readFileSync(\"minha-ca-de-desenvolvimento.pem\") });",
                ].join("\n"),
              },
              explanation:
                "Com a validação desligada, o HTTPS só protege contra quem apenas escuta, e não contra quem se " +
                "passa pelo servidor. Confiar em uma CA específica resolve o desenvolvimento sem abrir mão da checagem.",
            },
          ],
          exercise: {
            problem:
              "O time só descobre que um certificado venceu quando os clientes reclamam. Você recebeu o campo " +
              "`valid_to` do certificado e precisa transformá-lo em um alerta.",
            problemCode: {
              language: "javascript",
              filename: "expiry-alert.js",
              code: [
                "// valid_to, como o Node entrega: \"Jan  1 23:59:59 2027 GMT\"",
                "function certificateStatus(validTo, now = new Date()) {",
                "  // devolver { daysLeft, status } com status \"ok\", \"renovar\" (menos de 30 dias) ou \"vencido\"",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `certificateStatus`: calcule os dias restantes e classifique como `ok`, `renovar` (menos de " +
              "30 dias) ou `vencido`.",
            hint: "`new Date(validTo)` entende esse formato. Divida a diferença em milissegundos por 86.400.000 e arredonde para baixo.",
            solution: {
              code: {
                language: "javascript",
                filename: "expiry-alert.fixed.js",
                code: [
                  "function certificateStatus(validTo, now = new Date()) {",
                  "  const daysLeft = Math.floor((new Date(validTo) - now) / 86_400_000);",
                  "",
                  "  let status = \"ok\";",
                  "  if (daysLeft < 0) status = \"vencido\";",
                  "  else if (daysLeft < 30) status = \"renovar\";",
                  "",
                  "  return { daysLeft, status };",
                  "}",
                  "",
                  "const today = new Date(\"2026-12-20T00:00:00Z\");",
                  "certificateStatus(\"Jan  1 23:59:59 2027 GMT\", today);   // { daysLeft: 12, status: \"renovar\" }",
                  "certificateStatus(\"Dec 10 23:59:59 2026 GMT\", today);   // { daysLeft: -10, status: \"vencido\" }",
                ].join("\n"),
              },
              explanation:
                "A classificação transforma uma data em uma decisão. Ligada a um alerta que roda todos os dias, avisa " +
                "com folga antes de o certificado vencer.",
            },
          },
        }),
        concept({
          order: 80,
          title: "DNS",
          requires: ["Client-Server Model"],
          note: "resolução, registros, TTL de DNS",
          collision: "≠ TTL de cache (Caching) ≠ TTL de pacote IP",
          summary:
            "O sistema que traduz nomes legíveis, como `loja.exemplo.com`, em endereços IP — uma base de dados " +
            "distribuída e hierárquica, com respostas guardadas em cache por um tempo definido (TTL).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Para conectar a um servidor, é preciso o endereço IP dele, e as pessoas usam nomes. O DNS (Domain " +
                "Name System) faz a tradução. É uma base distribuída e hierárquica: a raiz aponta para os servidores " +
                "de cada domínio de topo (`.com`, `.br`), que apontam para os servidores autoritativos do domínio, que " +
                "sabem a resposta. O cliente não percorre essa cadeia: pergunta a um resolvedor recursivo, que faz o " +
                "trabalho e guarda o resultado em cache pelo TTL indicado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O DNS transforma nome em endereço e guarda as respostas em cache: o TTL de cada registro é o quanto " +
                "uma resposta pode ficar desatualizada antes de ser consultada de novo.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "A / AAAA: nome para endereço IPv4 / IPv6.",
                "CNAME: um nome que aponta para outro nome (um apelido); não pode existir no domínio raiz junto de outros registros.",
                "MX: servidores de e-mail do domínio.",
                "TXT: texto livre, usado para verificação de domínio e para SPF, DKIM e DMARC.",
                "NS: servidores autoritativos do domínio.",
                "TTL: por quantos segundos a resposta pode ser reaproveitada por resolvedores e clientes, antes de precisar perguntar de novo.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "consultas DNS com o Node.js, e um cache que respeita o TTL:" },
            {
              type: "code",
              language: "javascript",
              filename: "dns.js",
              code: [
                "import dns from \"node:dns/promises\";",
                "",
                "// Consulta registros diretamente ao DNS",
                "await dns.resolve4(\"loja.exemplo.com\");        // [\"192.0.2.10\"]",
                "await dns.resolveMx(\"exemplo.com\");            // [{ priority: 10, exchange: \"mail.exemplo.com\" }]",
                "await dns.resolveTxt(\"exemplo.com\");           // [[\"v=spf1 include:_spf.exemplo.com ~all\"]]",
                "",
                "// Cache que respeita o TTL de cada resposta",
                "class DnsCache {",
                "  #entries = new Map();",
                "",
                "  async resolve(name, query, now = Date.now()) {",
                "    const cached = this.#entries.get(name);",
                "    if (cached && cached.expiresAt > now) return cached.address;   // ainda válido",
                "",
                "    const { address, ttl } = await query(name);                     // consulta de verdade",
                "    this.#entries.set(name, { address, expiresAt: now + ttl * 1000 });",
                "    return address;",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Os resolvedores e o sistema operacional fazem esse mesmo tipo de cache. O TTL escolhido por quem " +
                "administra o domínio determina por quanto tempo uma mudança demora a chegar a todos.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A propagação depende do TTL: se um registro tinha TTL de um dia, alterá-lo não vale para quem o guardou; antes de uma migração, reduza o TTL com antecedência.",
                "No Node, `dns.lookup` usa o resolvedor do sistema operacional (incluindo o arquivo `hosts`), e `dns.resolve*` consulta o servidor DNS diretamente; os dois podem dar respostas diferentes.",
                "Respostas negativas, como \"esse nome não existe\", também ficam em cache; um registro criado logo após uma consulta que falhou pode demorar a aparecer.",
                "O DNS tradicional não é criptografado nem autenticado: quem está na rede vê as consultas, e é preciso DNS sobre HTTPS ou TLS para escondê-las.",
              ],
            },
          ],
          examples: [
            {
              title: "Os registros de um domínio",
              context: "Um domínio costuma ter vários tipos de registro, cada um com uma função.",
              code: {
                language: "text",
                filename: "zone.txt",
                code: [
                  "exemplo.com.        300   IN  A      192.0.2.10",
                  "exemplo.com.        300   IN  AAAA   2001:db8::10",
                  "www.exemplo.com.    300   IN  CNAME  exemplo.com.",
                  "exemplo.com.        3600  IN  MX     10 mail.exemplo.com.",
                  "exemplo.com.        3600  IN  TXT    \"v=spf1 include:_spf.exemplo.com ~all\"",
                  "",
                  "# A coluna do meio é o TTL, em segundos: 300 = 5 minutos, 3600 = 1 hora",
                ].join("\n"),
              },
              explanation:
                "O endereço tem TTL curto, porque pode mudar em uma migração. O e-mail e a verificação de domínio " +
                "raramente mudam, e ficam com TTL maior.",
            },
            {
              title: "`lookup` e `resolve` não são a mesma coisa",
              context: "Os dois traduzem um nome, mas por caminhos diferentes.",
              code: {
                language: "javascript",
                filename: "lookup-vs-resolve.js",
                code: [
                  "import dns from \"node:dns/promises\";",
                  "",
                  "// Suponha que o arquivo /etc/hosts tenha a linha: 127.0.0.1  api.local",
                  "",
                  "// Usa o resolvedor do sistema: respeita o arquivo hosts e a configuração local",
                  "await dns.lookup(\"api.local\");             // { address: \"127.0.0.1\", family: 4 }",
                  "",
                  "// Consulta o servidor DNS: ignora o arquivo hosts",
                  "await dns.resolve4(\"api.local\").catch((error) => error.code);   // \"ENOTFOUND\"",
                  "",
                  "// É o `lookup` que o `fetch` e o `http.get` usam por baixo",
                ].join("\n"),
              },
              explanation:
                "Um nome definido só no arquivo `hosts` funciona com `lookup` e falha com `resolve`. Saber qual das " +
                "duas o seu código usa evita confusões ao depurar um problema de rede.",
            },
            {
              title: "Reduzir o TTL antes de uma migração",
              context: "O tempo de propagação de uma mudança é, no máximo, o TTL antigo.",
              code: {
                language: "text",
                filename: "migration-plan.txt",
                code: [
                  "Dia -2   TTL de 86400 (1 dia) → 300 (5 min). As respostas antigas ainda expiram em até 1 dia.",
                  "Dia  0   (o TTL de 5 min já vale para todos) troca o registro A para o novo IP.",
                  "         Em até 5 minutos, todos os clientes já usam o endereço novo.",
                  "Dia +1   TTL volta a 86400, para reduzir a carga de consultas.",
                ].join("\n"),
              },
              explanation:
                "Baixar o TTL só ajuda depois que o TTL antigo expira, por isso o passo é feito com antecedência. É a " +
                "maneira de trocar de servidor sem uma janela longa de inconsistência.",
            },
          ],
          exercise: {
            problem:
              "Cada requisição consulta o DNS de novo, mesmo para o mesmo nome, e a lentidão do resolvedor aparece " +
              "em todas as chamadas.",
            problemCode: {
              language: "javascript",
              filename: "dns-cache.js",
              code: [
                "// query(name) → Promise<{ address, ttl }>",
                "let queries = 0;",
                "const query = async (name) => { queries++; return { address: \"192.0.2.10\", ttl: 60 }; };",
                "",
                "async function resolve(name) {",
                "  const { address } = await query(name);   // consulta a cada chamada",
                "  return address;",
                "}",
              ].join("\n"),
            },
            task:
              "Guarde as respostas em cache respeitando o TTL: uma segunda consulta dentro do TTL não deve chamar " +
              "`query`, e depois de expirado, deve chamar de novo.",
            hint: "Guarde, para cada nome, o endereço e o instante de expiração (`agora + ttl × 1000`). Receba `now` como parâmetro para poder testar.",
            solution: {
              code: {
                language: "javascript",
                filename: "dns-cache.fixed.js",
                code: [
                  "let queries = 0;",
                  "const query = async (name) => { queries++; return { address: \"192.0.2.10\", ttl: 60 }; };",
                  "",
                  "const cache = new Map();",
                  "",
                  "async function resolve(name, now = Date.now()) {",
                  "  const cached = cache.get(name);",
                  "  if (cached && cached.expiresAt > now) return cached.address;",
                  "",
                  "  const { address, ttl } = await query(name);",
                  "  cache.set(name, { address, expiresAt: now + ttl * 1000 });",
                  "  return address;",
                  "}",
                  "",
                  "await resolve(\"loja.exemplo.com\", 0);        // consulta (queries = 1)",
                  "await resolve(\"loja.exemplo.com\", 30_000);   // dentro do TTL: do cache (queries = 1)",
                  "await resolve(\"loja.exemplo.com\", 61_000);   // expirou: consulta de novo (queries = 2)",
                ].join("\n"),
              },
              explanation:
                "A resposta é reaproveitada enquanto o TTL não expira, e só depois disso o resolvedor é consultado de " +
                "novo. É a mesma lógica dos caches de DNS do sistema operacional e dos provedores.",
            },
          },
        }),
        concept({
          order: 90,
          title: "TCP vs UDP",
          subtopics: ["TCP: 3-way handshake, ordenação, retransmissão, controle de fluxo/congestão", "UDP: sem conexão, sem garantia, baixo overhead (DNS, streaming, QUIC)"],
          note: "consolidada (A2)",
          summary:
            "Os dois protocolos de transporte da internet: o TCP entrega tudo, na ordem e sem perdas, ao custo de " +
            "espera; o UDP envia pacotes soltos, rápido e sem garantias — cada um serve a um tipo de problema.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Abaixo do HTTP, dois protocolos levam os dados entre os programas. O TCP é orientado a conexão: " +
                "cliente e servidor fazem um handshake de três passos (SYN, SYN-ACK, ACK), e a partir daí o TCP " +
                "garante que os bytes cheguem completos e na ordem, retransmitindo o que se perde, com controle de " +
                "fluxo e de congestionamento. O UDP não tem conexão: cada datagrama é enviado por conta própria, sem " +
                "confirmação, e pode se perder, duplicar ou chegar fora de ordem.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "TCP entrega tudo, na ordem, mas espera quando algo se perde; UDP entrega rápido, sem garantia: " +
                "a escolha depende do que o seu caso tolera perder.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "No Node.js, o módulo `net` fala TCP, e o `dgram`, UDP. A diferença aparece no modelo: o TCP é um " +
                "fluxo contínuo de bytes, e o UDP preserva os limites de cada mensagem.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "tcp-udp.js",
              code: [
                "import net from \"node:net\";",
                "import dgram from \"node:dgram\";",
                "",
                "// TCP: conexão, fluxo de bytes, entrega garantida e ordenada",
                "const tcpServer = net.createServer((socket) => {",
                "  socket.on(\"data\", (chunk) => socket.write(`eco: ${chunk}`));",
                "});",
                "tcpServer.listen(4000);",
                "",
                "const client = net.connect(4000, \"localhost\", () => client.write(\"olá\"));",
                "client.on(\"data\", (chunk) => console.log(chunk.toString()));   // \"eco: olá\"",
                "",
                "// UDP: sem conexão, cada send é um datagrama independente",
                "const udpServer = dgram.createSocket(\"udp4\");",
                "udpServer.on(\"message\", (message, remote) => {",
                "  console.log(`recebido: ${message}`);                            // um evento por datagrama",
                "});",
                "udpServer.bind(4001);",
                "",
                "dgram.createSocket(\"udp4\").send(\"posição: 10,20\", 4001, \"localhost\");",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O cliente TCP precisou abrir a conexão antes de escrever. O UDP simplesmente enviou, sem saber se " +
                "alguém receberia.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "TCP, quando os dados não podem se perder nem chegar embaralhados: páginas web, APIs, bancos de dados, arquivos e e-mail.",
                "UDP, quando a latência importa mais que a completude, como voz e vídeo ao vivo, jogos e telemetria, ou em consultas curtas, como o DNS.",
                "UDP também é a base de protocolos que implementam a sua própria confiabilidade por cima, como o QUIC, usado pelo HTTP/3.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O TCP sofre de head-of-line blocking: um pacote perdido atrasa todos os seguintes, mesmo os que já chegaram; e o handshake acrescenta latência antes do primeiro byte útil.",
                "O TCP não preserva as fronteiras das mensagens: duas escritas podem chegar juntas, e uma escrita grande, em pedaços; o protocolo por cima precisa delimitá-las.",
                "O UDP não garante entrega, ordem nem ausência de duplicatas: quem o usa precisa lidar com isso, ou aceitar a perda.",
                "O UDP não tem controle de congestionamento, e datagramas maiores que o limite da rede (na casa de 1.400 bytes, na prática) são fragmentados, o que os torna mais frágeis.",
              ],
            },
          ],
          examples: [
            {
              title: "O TCP é um fluxo: é preciso delimitar as mensagens",
              context: "Duas mensagens enviadas separadas podem chegar em um único pedaço, ou uma só em dois pedaços.",
              code: {
                language: "javascript",
                filename: "framing.js",
                code: [
                  "// Um protocolo simples: uma mensagem por linha (JSON delimitado por \\n)",
                  "function createLineParser(onMessage) {",
                  "  let buffer = \"\";",
                  "  return (chunk) => {",
                  "    buffer += chunk;",
                  "    let index;",
                  "    while ((index = buffer.indexOf(\"\\n\")) !== -1) {",
                  "      onMessage(buffer.slice(0, index));   // uma mensagem completa",
                  "      buffer = buffer.slice(index + 1);    // o resto espera o próximo pedaço",
                  "    }",
                  "  };",
                  "}",
                  "",
                  "const received = [];",
                  "const feed = createLineParser((line) => received.push(line));",
                  "",
                  "feed(\"{\\\"a\\\":1}\\n{\\\"b\\\"\");   // uma mensagem completa e o começo de outra",
                  "feed(\":2}\\n\");                 // o restante da segunda",
                  "received;                       // [\"{\\\"a\\\":1}\", \"{\\\"b\\\":2}\"]",
                ].join("\n"),
              },
              explanation:
                "O parser junta os pedaços e só entrega mensagens completas. Sem isso, um `JSON.parse` no meio de um " +
                "pedaço falharia de forma intermitente, e só sob carga.",
            },
            {
              title: "UDP em um jogo: só o dado mais novo importa",
              context: "Quando o dado antigo perde o valor, reenviar o que se perdeu seria um desperdício.",
              code: {
                language: "javascript",
                filename: "udp-game.js",
                code: [
                  "let lastSequence = -1;",
                  "let position = null;",
                  "",
                  "// Pacotes UDP podem chegar fora de ordem: descarta o que já é velho",
                  "function onPositionPacket({ sequence, x, y }) {",
                  "  if (sequence <= lastSequence) return;   // chegou atrasado: ignora",
                  "  lastSequence = sequence;",
                  "  position = { x, y };",
                  "}",
                  "",
                  "onPositionPacket({ sequence: 1, x: 10, y: 5 });",
                  "onPositionPacket({ sequence: 3, x: 12, y: 5 });",
                  "onPositionPacket({ sequence: 2, x: 11, y: 5 });   // atrasado, é descartado",
                  "position;   // { x: 12, y: 5 }",
                ].join("\n"),
              },
              explanation:
                "Aqui a ordem e a perda não são um problema: o pacote mais novo já traz a informação que importa. É " +
                "o cenário em que o UDP compensa, e o TCP atrasaria tudo esperando o pacote perdido.",
            },
            {
              title: "Por que o HTTP/3 usa UDP",
              context: "Não é para abrir mão da confiabilidade, e sim para reimplementá-la de um jeito melhor.",
              code: {
                language: "text",
                filename: "http3-quic.txt",
                code: [
                  "HTTP/2  →  TCP   →  um pacote perdido bloqueia TODOS os fluxos da conexão",
                  "HTTP/3  →  QUIC  →  (sobre UDP) cada fluxo tem a sua própria recuperação de perdas;",
                  "                    um pacote perdido atrasa só o fluxo a que pertence",
                  "",
                  "O QUIC implementa por conta própria confiabilidade, controle de congestionamento e TLS 1.3,",
                  "em espaço de usuário, o que permite evoluir sem esperar pelo sistema operacional.",
                ].join("\n"),
              },
              explanation:
                "O UDP é o alicerce neutro sobre o qual o QUIC constrói o que o TCP não consegue oferecer, como fluxos " +
                "independentes. É a prova de que \"UDP\" não significa \"sem confiabilidade\" quando há uma camada por cima.",
            },
          ],
          exercise: {
            problem:
              "Um serviço recebe mensagens JSON, uma por linha, por uma conexão TCP, e faz `JSON.parse` em cada " +
              "`data` recebido. Em produção, o parse falha de vez em quando com \"Unexpected end of JSON input\".",
            problemCode: {
              language: "javascript",
              filename: "broken-parse.js",
              code: [
                "import net from \"node:net\";",
                "",
                "net.createServer((socket) => {",
                "  socket.on(\"data\", (chunk) => {",
                "    const message = JSON.parse(chunk.toString());   // falha se a mensagem vier partida",
                "    handle(message);",
                "  });",
                "}).listen(4000);",
              ].join("\n"),
            },
            task:
              "Corrija usando um parser por linha, que acumule os pedaços e só chame `handle` com mensagens " +
              "completas, mesmo que cheguem juntas ou partidas.",
            hint: "Guarde o que sobrou de cada `data` em um buffer e procure por `\\n`. Só o texto antes do `\\n` é uma mensagem completa.",
            solution: {
              code: {
                language: "javascript",
                filename: "broken-parse.fixed.js",
                code: [
                  "import net from \"node:net\";",
                  "",
                  "net.createServer((socket) => {",
                  "  let buffer = \"\";",
                  "",
                  "  socket.on(\"data\", (chunk) => {",
                  "    buffer += chunk.toString();",
                  "    let index;",
                  "    while ((index = buffer.indexOf(\"\\n\")) !== -1) {",
                  "      const line = buffer.slice(0, index);",
                  "      buffer = buffer.slice(index + 1);",
                  "      if (line) handle(JSON.parse(line));",
                  "    }",
                  "  });",
                  "}).listen(4000);",
                ].join("\n"),
              },
              explanation:
                "Cada conexão tem o seu buffer, e as mensagens só são processadas depois que a linha inteira chega. O " +
                "erro intermitente deixa de existir, porque o parse nunca vê um pedaço incompleto.",
            },
          },
        }),
        concept({
          order: 100,
          title: "URL Anatomy",
          note: "scheme/host/port/path/query/fragment",
          summary:
            "As partes de um endereço web — esquema, host, porta, caminho, consulta e fragmento — e o que cada uma " +
            "significa para o navegador, para o servidor e para a segurança.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma URL identifica um recurso e diz como alcançá-lo. Ela é composta por partes, cada uma com um " +
                "papel: o esquema (`https`) diz o protocolo, o host (`loja.exemplo.com`) diz quem atende, a porta " +
                "(`443`) diz onde, o caminho (`/produtos/1`) diz qual recurso, a consulta (`?cor=azul`) traz " +
                "parâmetros, e o fragmento (`#detalhes`) aponta para um trecho dentro da página. A combinação de " +
                "esquema, host e porta é a origem, base das regras de segurança do navegador.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma URL é um endereço estruturado: cada parte responde a uma pergunta diferente, e tratá-la como " +
                "texto solto é a origem de bugs de codificação e de segurança.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "text",
              filename: "url-anatomy.txt",
              code: [
                "https://ana:senha@loja.exemplo.com:8443/produtos/caneta?cor=azul&tam=m#avaliacoes",
                "\\___/   \\_______/ \\______________/ \\__/ \\_______________/ \\____________/ \\_________/",
                "esquema  userinfo   host            porta caminho            consulta       fragmento",
                "",
                "origem = esquema + host + porta  →  https://loja.exemplo.com:8443",
              ].join("\n"),
            },
            {
              type: "list",
              items: [
                "A porta é opcional quando é a padrão do esquema: 80 para `http` e 443 para `https`.",
                "O fragmento existe só no navegador: ele não é enviado ao servidor na requisição.",
                "Caracteres especiais são codificados com porcentagem (`%20` para o espaço, `%26` para `&`).",
                "O userinfo (`usuario:senha@`) ainda existe na sintaxe, mas é desaconselhado.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a API `URL` do JavaScript separa as partes, e `URLSearchParams` lida com a consulta:" },
            {
              type: "code",
              language: "javascript",
              filename: "url.js",
              code: [
                "const url = new URL(\"https://loja.exemplo.com:8443/produtos/caneta?cor=azul&tam=m#avaliacoes\");",
                "",
                "url.protocol;   // \"https:\"",
                "url.hostname;   // \"loja.exemplo.com\"",
                "url.port;       // \"8443\"",
                "url.pathname;   // \"/produtos/caneta\"",
                "url.search;     // \"?cor=azul&tam=m\"",
                "url.hash;       // \"#avaliacoes\"",
                "url.origin;     // \"https://loja.exemplo.com:8443\"",
                "",
                "url.searchParams.get(\"cor\");         // \"azul\"",
                "url.searchParams.set(\"cor\", \"verde\");",
                "url.toString();   // \"https://loja.exemplo.com:8443/produtos/caneta?cor=verde&tam=m#avaliacoes\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Com `URL`, cada parte é lida e alterada por nome, e a codificação é feita sozinha, sem manipular texto à mão.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Montar URLs concatenando texto quebra com caracteres especiais: um valor com `&` ou `#` altera a estrutura da consulta; use `URL` e `URLSearchParams`.",
                "`encodeURIComponent` codifica um pedaço (um valor de parâmetro), e `encodeURI` codifica uma URL inteira preservando `/`, `?` e `&`; usar o errado gera endereços quebrados.",
                "O fragmento não vai ao servidor: ele não aparece em logs do servidor e não serve para passar dados a ele.",
                "Credenciais na URL (`usuario:senha@`) vazam em históricos, logs e cabeçalhos `Referer`; envie-as por cabeçalho.",
                "Um parâmetro pode se repetir (`?tag=a&tag=b`): `get` devolve só o primeiro, e `getAll` devolve todos.",
              ],
            },
          ],
          examples: [
            {
              title: "Construir a consulta sem concatenar",
              context: "`URLSearchParams` codifica cada valor, mesmo os que têm caracteres especiais.",
              code: {
                language: "javascript",
                filename: "search-params.js",
                code: [
                  "const params = new URLSearchParams({ q: \"café & chá\", pagina: \"2\" });",
                  "params.append(\"tag\", \"promo\");",
                  "params.append(\"tag\", \"novo\");",
                  "",
                  "params.toString();          // \"q=caf%C3%A9+%26+ch%C3%A1&pagina=2&tag=promo&tag=novo\"",
                  "params.getAll(\"tag\");       // [\"promo\", \"novo\"]",
                  "",
                  "// Concatenando à mão, o & do valor viraria um novo parâmetro:",
                  "// \"?q=\" + \"café & chá\"   →   \"?q=café & chá\"   (o que vem depois do & é outro parâmetro)",
                ].join("\n"),
              },
              explanation:
                "O `&` dentro do valor virou `%26`, e o espaço virou `+`. A consulta continua com a estrutura correta, e o " +
                "servidor recebe o valor original.",
            },
            {
              title: "Resolver um endereço relativo",
              context: "Links relativos são resolvidos em relação a uma URL base, e o construtor `URL` faz isso.",
              code: {
                language: "javascript",
                filename: "relative-urls.js",
                code: [
                  "const base = \"https://loja.exemplo.com/produtos/caneta/detalhes\";",
                  "",
                  "new URL(\"../lapis\", base).href;         // \"https://loja.exemplo.com/produtos/lapis\"",
                  "new URL(\"/carrinho\", base).href;        // \"https://loja.exemplo.com/carrinho\"",
                  "new URL(\"?cor=azul\", base).href;        // \"https://loja.exemplo.com/produtos/caneta/detalhes?cor=azul\"",
                  "new URL(\"//cdn.exemplo.com/a.js\", base).href;   // \"https://cdn.exemplo.com/a.js\"",
                ].join("\n"),
              },
              explanation:
                "Cada forma de escrever o endereço muda o que é herdado da base. Confiar nessa resolução é mais seguro " +
                "que montar caminhos com texto.",
            },
            {
              title: "A origem e a porta padrão",
              context: "A origem ignora a porta quando ela é a padrão do esquema.",
              code: {
                language: "javascript",
                filename: "origin.js",
                code: [
                  "new URL(\"https://exemplo.com/a\").origin;         // \"https://exemplo.com\"",
                  "new URL(\"https://exemplo.com:443/a\").origin;     // \"https://exemplo.com\"  (443 é o padrão)",
                  "new URL(\"https://exemplo.com:8443/a\").origin;    // \"https://exemplo.com:8443\"",
                  "",
                  "new URL(\"http://exemplo.com\").port;   // \"\"  (vazia quando é a porta padrão)",
                ].join("\n"),
              },
              explanation:
                "A origem identifica \"o mesmo site\" para o navegador. Compará-la, e não o texto da URL, evita erros " +
                "como achar diferentes dois endereços equivalentes.",
            },
          ],
          exercise: {
            problem:
              "A busca monta o endereço concatenando texto. Uma pesquisa por \"pão & queijo\" gera uma consulta " +
              "quebrada, e um usuário mal-intencionado pode injetar parâmetros extras.",
            problemCode: {
              language: "javascript",
              filename: "build-url.js",
              code: [
                "function searchUrl(base, term, page) {",
                "  return base + \"/busca?q=\" + term + \"&pagina=\" + page;",
                "}",
                "",
                "searchUrl(\"https://loja.exemplo.com\", \"pão & queijo\", 1);",
                "// \"https://loja.exemplo.com/busca?q=pão & queijo&pagina=1\"   — quebrado",
                "",
                "searchUrl(\"https://loja.exemplo.com\", \"x&admin=true\", 1);   // injeta um parâmetro `admin`",
              ].join("\n"),
            },
            task:
              "Reescreva `searchUrl` com `URL` e `URLSearchParams`, de modo que qualquer termo seja codificado " +
              "corretamente e nunca crie parâmetros extras.",
            hint: "Crie `new URL(\"/busca\", base)` e use `url.searchParams.set` para cada parâmetro.",
            solution: {
              code: {
                language: "javascript",
                filename: "build-url.fixed.js",
                code: [
                  "function searchUrl(base, term, page) {",
                  "  const url = new URL(\"/busca\", base);",
                  "  url.searchParams.set(\"q\", term);",
                  "  url.searchParams.set(\"pagina\", String(page));",
                  "  return url.toString();",
                  "}",
                  "",
                  "searchUrl(\"https://loja.exemplo.com\", \"pão & queijo\", 1);",
                  "// \"https://loja.exemplo.com/busca?q=p%C3%A3o+%26+queijo&pagina=1\"",
                  "",
                  "searchUrl(\"https://loja.exemplo.com\", \"x&admin=true\", 1);",
                  "// \"https://loja.exemplo.com/busca?q=x%26admin%3Dtrue&pagina=1\"   — o & vira parte do valor",
                ].join("\n"),
              },
              explanation:
                "Todo caractere especial do termo é codificado, e o `&admin=true` malicioso vira só texto dentro de `q`. " +
                "A estrutura da URL deixa de depender do que o usuário digita.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Cookies",
          requires: ["HTTP Headers"],
          note: "atributos Secure/HttpOnly/SameSite",
          summary:
            "Pequenos dados que o servidor pede ao navegador para guardar e que o navegador devolve automaticamente " +
            "em cada requisição ao mesmo site — a forma de dar memória a um protocolo sem estado.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um cookie é um par nome-valor que o servidor envia no cabeçalho `Set-Cookie` e que o navegador " +
                "guarda e devolve no cabeçalho `Cookie` em todas as requisições seguintes ao site correspondente. É a " +
                "principal forma de ligar requisições separadas ao mesmo visitante, como em um login ou em um " +
                "carrinho. Atributos controlam o comportamento: por quanto tempo vale, para quais caminhos e domínios, " +
                "e como o navegador deve protegê-lo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O cookie é enviado automaticamente pelo navegador: por isso os seus atributos de segurança " +
                "(`Secure`, `HttpOnly`, `SameSite`) decidem quem consegue lê-lo e em que situações ele viaja.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "`Max-Age` e `Expires` definem a validade; sem eles, o cookie some ao fechar o navegador (cookie de sessão do navegador).",
                "`Path` e `Domain` definem para quais endereços o cookie é enviado; sem `Domain`, ele vale só para o host que o criou.",
                "`Secure` só envia o cookie por HTTPS.",
                "`HttpOnly` impede que o JavaScript da página o leia (`document.cookie`), o que limita o estrago de um XSS.",
                "`SameSite` controla o envio em requisições vindas de outros sites: `Strict` (nunca), `Lax` (só em navegação por link) e `None` (sempre, e exige `Secure`).",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor que define um cookie com atributos seguros e lê o que o navegador devolve:" },
            {
              type: "code",
              language: "javascript",
              filename: "cookies.js",
              code: [
                "import http from \"node:http\";",
                "",
                "function parseCookies(header = \"\") {",
                "  return Object.fromEntries(",
                "    header.split(\";\").filter(Boolean).map((pair) => {",
                "      const [name, ...value] = pair.trim().split(\"=\");",
                "      return [name, decodeURIComponent(value.join(\"=\"))];",
                "    }),",
                "  );",
                "}",
                "",
                "http.createServer((request, response) => {",
                "  const cookies = parseCookies(request.headers.cookie);",
                "",
                "  if (!cookies.tema) {",
                "    response.setHeader(\"set-cookie\", \"tema=escuro; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=Lax\");",
                "  }",
                "  response.end(`tema atual: ${cookies.tema ?? \"padrão\"}`);",
                "}).listen(3000);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na primeira visita, o servidor define o cookie. Nas seguintes, o navegador o devolve em `Cookie`, e " +
                "o servidor o lê, sem que o código da página precise fazer nada.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O cookie viaja em toda requisição ao site, inclusive de imagens e scripts: cookies grandes aumentam o tráfego, e o limite é de cerca de 4 KB por cookie.",
                "Sem `Secure`, o cookie pode ser enviado por HTTP, e alguém na rede o lê; sem `HttpOnly`, um XSS o rouba; sem `SameSite`, ele pode acompanhar requisições forjadas por outros sites (CSRF).",
                "`SameSite=None` exige `Secure`, e navegadores modernos tratam a ausência do atributo como `Lax`, com diferenças entre eles; declare sempre.",
                "O atributo `Domain` alarga o cookie a todos os subdomínios: um subdomínio menos protegido passa a poder lê-lo ou substituí-lo.",
                "Não guarde dados sensíveis no próprio cookie: o usuário controla o navegador, e o valor pode ser lido e alterado; guarde um identificador e mantenha os dados no servidor.",
              ],
            },
          ],
          examples: [
            {
              title: "Serializar um cookie com padrões seguros",
              context: "Em vez de escrever a string à mão, uma função aplica os atributos de segurança por padrão.",
              code: {
                language: "javascript",
                filename: "serialize-cookie.js",
                code: [
                  "function serializeCookie(name, value, options = {}) {",
                  "  const { maxAge, path = \"/\", sameSite = \"Lax\", httpOnly = true, secure = true } = options;",
                  "",
                  "  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, `SameSite=${sameSite}`];",
                  "  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);",
                  "  if (httpOnly) parts.push(\"HttpOnly\");",
                  "  if (secure) parts.push(\"Secure\");",
                  "  return parts.join(\"; \");",
                  "}",
                  "",
                  "serializeCookie(\"sid\", \"abc123\", { maxAge: 3600 });",
                  "// \"sid=abc123; Path=/; SameSite=Lax; Max-Age=3600; HttpOnly; Secure\"",
                ].join("\n"),
              },
              explanation:
                "Quem esquecer de configurar recebe os atributos seguros por padrão. Desligar uma proteção passa a ser " +
                "uma decisão explícita, e não um esquecimento.",
            },
            {
              title: "O que o SameSite decide",
              context: "O mesmo cookie é enviado, ou não, dependendo de onde a requisição se originou.",
              code: {
                language: "text",
                filename: "samesite.txt",
                code: [
                  "Situação                                       Strict   Lax   None",
                  "----------------------------------------------------------------------",
                  "Requisição do próprio site                     envia    envia envia",
                  "Clique em um link vindo de outro site (GET)    NÃO      envia envia",
                  "Formulário POST vindo de outro site            NÃO      NÃO   envia",
                  "Imagem/iframe/fetch de outro site              NÃO      NÃO   envia",
                  "",
                  "None só é aceito junto de Secure.",
                ].join("\n"),
              },
              explanation:
                "`Lax` é um bom padrão: mantém o login ao seguir um link de fora, mas bloqueia o cookie em requisições " +
                "forjadas por outros sites, o vetor do CSRF.",
            },
            {
              title: "HttpOnly: o JavaScript da página não vê o cookie",
              context: "Um XSS consegue executar código na página, mas não consegue ler o cookie protegido.",
              code: {
                language: "javascript",
                filename: "httponly.js",
                code: [
                  "// O servidor definiu:  sid=abc123; HttpOnly   e   tema=escuro",
                  "",
                  "// No navegador, um script (inclusive um injetado por XSS) só enxerga o que não é HttpOnly:",
                  "document.cookie;   // \"tema=escuro\"",
                  "",
                  "// O sid continua sendo enviado ao servidor nas requisições, mas fica inacessível ao script.",
                ].join("\n"),
              },
              explanation:
                "`HttpOnly` não impede o XSS, mas impede o roubo do identificador de sessão por script. O atacante ainda " +
                "pode fazer requisições em nome do usuário enquanto a página estiver aberta.",
            },
          ],
          exercise: {
            problem:
              "O login grava o identificador da sessão em um cookie sem nenhum atributo. Ele é enviado por HTTP, " +
              "pode ser lido por scripts e acompanha requisições vindas de outros sites.",
            problemCode: {
              language: "javascript",
              filename: "login-cookie.js",
              code: [
                "function setSessionCookie(response, sessionId) {",
                "  response.setHeader(\"set-cookie\", `sid=${sessionId}`);",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva para definir o cookie com validade de 1 hora, `HttpOnly`, `Secure` e `SameSite=Lax`, e " +
              "escreva a função para removê-lo no logout.",
            hint: "Para remover um cookie, envie o mesmo nome e o mesmo `Path` com `Max-Age=0`.",
            solution: {
              code: {
                language: "javascript",
                filename: "login-cookie.fixed.js",
                code: [
                  "function setSessionCookie(response, sessionId) {",
                  "  response.setHeader(",
                  "    \"set-cookie\",",
                  "    `sid=${sessionId}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax`,",
                  "  );",
                  "}",
                  "",
                  "function clearSessionCookie(response) {",
                  "  // Mesmo nome e mesmo Path, com validade zero: o navegador apaga o cookie",
                  "  response.setHeader(\"set-cookie\", \"sid=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O cookie agora só viaja por HTTPS, não é legível por scripts e não acompanha requisições de outros " +
                "sites. Para apagá-lo, é preciso repetir o nome e o `Path` originais.",
            },
          },
        }),
        concept({
          order: 120,
          title: "Sessions",
          requires: ["Cookies"],
          note: "estado do usuário guardado no servidor, ligado por um identificador",
          collision: "≠ Session-Based Authentication (Authentication) — mecanismo de estado × uso para identidade",
          summary:
            "O estado de um visitante mantido no servidor e ligado ao navegador por um identificador aleatório, " +
            "guardado em um cookie — o que dá memória a um protocolo sem estado.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Como o HTTP não guarda memória entre requisições, o servidor cria uma sessão: um registro com o " +
                "estado do visitante (o carrinho, as preferências, quem está logado), identificado por um ID longo e " +
                "aleatório. O ID vai para o navegador em um cookie, e a cada requisição o servidor o usa para " +
                "encontrar o registro. Os dados ficam no servidor, e o navegador só carrega a chave. É um mecanismo " +
                "de estado; usá-lo para identificar usuários é o tema de Session-Based Authentication.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O navegador guarda só um identificador aleatório, e o estado real fica no servidor: perder ou " +
                "invalidar a sessão é apagar um registro.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Na primeira requisição, o servidor gera o ID, cria o registro e envia o cookie. Nas seguintes, lê o " +
                "cookie, busca a sessão e verifica se ainda é válida. Uma sessão tem prazo: expira por inatividade e " +
                "também por tempo máximo.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "sessions.js",
              code: [
                "import { randomBytes } from \"node:crypto\";",
                "",
                "class SessionStore {",
                "  #sessions = new Map();",
                "  constructor(idleSeconds = 1800) { this.idleMs = idleSeconds * 1000; }",
                "",
                "  create(data = {}, now = Date.now()) {",
                "    const id = randomBytes(32).toString(\"hex\");   // 256 bits: impossível de adivinhar",
                "    this.#sessions.set(id, { data, expiresAt: now + this.idleMs });",
                "    return id;",
                "  }",
                "",
                "  get(id, now = Date.now()) {",
                "    const session = this.#sessions.get(id);",
                "    if (!session) return null;",
                "    if (session.expiresAt <= now) { this.#sessions.delete(id); return null; }   // expirou",
                "    session.expiresAt = now + this.idleMs;   // renova a inatividade a cada uso",
                "    return session.data;",
                "  }",
                "",
                "  destroy(id) { this.#sessions.delete(id); }   // logout: apaga o registro",
                "}",
                "",
                "const store = new SessionStore();",
                "const id = store.create({ carrinho: [\"caneta\"] });",
                "store.get(id);        // { carrinho: [\"caneta\"] }",
                "store.destroy(id);",
                "store.get(id);        // null",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O ID vai em um cookie `HttpOnly`, `Secure` e `SameSite`. Como o estado está no servidor, é possível " +
                "encerrar uma sessão a qualquer momento, apagando o registro.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em aplicações web tradicionais, com páginas renderizadas pelo servidor, em que o navegador guarda o cookie e o servidor mantém o estado.",
                "Quando é preciso revogar o acesso na hora, no logout, na troca de senha ou ao bloquear um usuário, o que é trivial ao apagar o registro.",
                "Quando o estado é sensível ou grande demais para ficar no cliente.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com várias instâncias do servidor, a sessão precisa estar em um armazenamento compartilhado, como o Redis, ou o balanceador precisa fixar o usuário em uma instância (sticky sessions).",
                "Guardar sessões em memória as perde a cada reinício e cresce sem limite se não houver expiração e limpeza.",
                "Sem regenerar o ID no login, fica aberta a fixação de sessão (session fixation): o atacante define o ID antes e o aproveita depois.",
                "Como o cookie é enviado automaticamente, a sessão é alvo de CSRF: combine com `SameSite` e, quando preciso, com token anti-CSRF.",
                "Cada requisição consulta o armazenamento, o que tem custo; APIs para clientes móveis e serviços costumam preferir tokens.",
              ],
            },
          ],
          examples: [
            {
              title: "Expiração por inatividade",
              context: "Uma sessão parada não deve valer para sempre.",
              code: {
                language: "javascript",
                filename: "idle-expiry.js",
                code: [
                  "const store = new SessionStore(60);   // 60 segundos de inatividade",
                  "const id = store.create({ usuario: \"ana\" }, 0);",
                  "",
                  "store.get(id, 30_000);    // { usuario: \"ana\" } — válida, e a contagem recomeça",
                  "store.get(id, 80_000);    // { usuario: \"ana\" } — 50 s desde o último uso: ainda válida",
                  "store.get(id, 200_000);   // null — passaram 120 s sem uso: expirada",
                ].join("\n"),
              },
              explanation:
                "Cada uso renova o prazo, e a ausência de uso o deixa vencer. É o comportamento esperado de um sistema " +
                "de banco ou de e-mail que desconecta quem se afastou.",
            },
            {
              title: "Regenerar o ID ao fazer login",
              context: "Trocar o identificador no momento em que o usuário se autentica impede a fixação de sessão.",
              code: {
                language: "javascript",
                filename: "regenerate-id.js",
                code: [
                  "function login(store, oldId, user) {",
                  "  const previous = oldId ? store.get(oldId) : {};",
                  "  if (oldId) store.destroy(oldId);                              // invalida o ID antigo",
                  "  return store.create({ ...previous, usuarioId: user.id });     // novo ID, criado depois do login",
                  "}",
                  "",
                  "// Ataque: o atacante faz a vítima usar o ID \"conhecido\"; sem regenerar, ele passaria a valer",
                  "// para a vítima autenticada. Com a troca, o ID que o atacante conhece deixa de existir.",
                ].join("\n"),
              },
              explanation:
                "A sessão anônima e a autenticada nunca compartilham o mesmo identificador. Mesmo que um ID tenha sido " +
                "plantado antes do login, ele não dá acesso depois.",
            },
            {
              title: "Armazenamento compartilhado entre instâncias",
              context: "Com mais de um servidor, a sessão não pode viver na memória de um só.",
              code: {
                language: "javascript",
                filename: "shared-store.js",
                code: [
                  "// O contrato é o mesmo; a implementação passa a ser um armazenamento externo (por exemplo, o Redis)",
                  "class RedisSessionStore {",
                  "  constructor(redis, idleSeconds = 1800) { this.redis = redis; this.idleSeconds = idleSeconds; }",
                  "",
                  "  async create(data) {",
                  "    const id = randomBytes(32).toString(\"hex\");",
                  "    await this.redis.set(`sessao:${id}`, JSON.stringify(data), { EX: this.idleSeconds });",
                  "    return id;",
                  "  }",
                  "",
                  "  async get(id) {",
                  "    const value = await this.redis.get(`sessao:${id}`);",
                  "    if (!value) return null;",
                  "    await this.redis.expire(`sessao:${id}`, this.idleSeconds);   // renova a inatividade",
                  "    return JSON.parse(value);",
                  "  }",
                  "",
                  "  destroy(id) { return this.redis.del(`sessao:${id}`); }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Qualquer instância enxerga as mesmas sessões, e a expiração fica a cargo do armazenamento. Como o " +
                "contrato não mudou, a aplicação troca de implementação sem alterar o resto.",
            },
          ],
          exercise: {
            problem:
              "As sessões ficam em um objeto global que nunca é limpo. Depois de semanas, o servidor consome cada " +
              "vez mais memória, e uma sessão abandonada continua válida.",
            problemCode: {
              language: "javascript",
              filename: "leaky-sessions.js",
              code: [
                "import { randomBytes } from \"node:crypto\";",
                "",
                "const sessions = {};",
                "",
                "function createSession(data) {",
                "  const id = randomBytes(16).toString(\"hex\");",
                "  sessions[id] = data;   // sem prazo, e nunca é removida",
                "  return id;",
                "}",
                "",
                "function getSession(id) { return sessions[id]; }",
              ].join("\n"),
            },
            task:
              "Implemente `SessionStore` com `create`, `get` e `destroy`, com expiração de 30 minutos de inatividade " +
              "(recebendo o instante como parâmetro para poder testar) e remoção da sessão expirada ao consultá-la.",
            hint: "Guarde o `expiresAt` de cada sessão. Em `get`, compare com `now`, apague se venceu e renove se ainda vale.",
            solution: {
              code: {
                language: "javascript",
                filename: "leaky-sessions.fixed.js",
                code: [
                  "import { randomBytes } from \"node:crypto\";",
                  "",
                  "class SessionStore {",
                  "  #sessions = new Map();",
                  "  static IDLE_MS = 30 * 60 * 1000;",
                  "",
                  "  create(data, now = Date.now()) {",
                  "    const id = randomBytes(32).toString(\"hex\");",
                  "    this.#sessions.set(id, { data, expiresAt: now + SessionStore.IDLE_MS });",
                  "    return id;",
                  "  }",
                  "",
                  "  get(id, now = Date.now()) {",
                  "    const session = this.#sessions.get(id);",
                  "    if (!session) return null;",
                  "    if (session.expiresAt <= now) { this.#sessions.delete(id); return null; }",
                  "    session.expiresAt = now + SessionStore.IDLE_MS;",
                  "    return session.data;",
                  "  }",
                  "",
                  "  destroy(id) { this.#sessions.delete(id); }",
                  "}",
                  "",
                  "const store = new SessionStore();",
                  "const id = store.create({ usuario: \"ana\" }, 0);",
                  "store.get(id, 10 * 60 * 1000);    // { usuario: \"ana\" }",
                  "store.get(id, 60 * 60 * 1000);    // null — expirou, e o registro foi removido",
                ].join("\n"),
              },
              explanation:
                "Sessões inativas deixam de valer e são removidas ao serem consultadas, e o ID de 256 bits não pode ser " +
                "adivinhado. Em produção, uma limpeza periódica também removeria as que ninguém mais consulta.",
            },
          },
        }),
        concept({
          order: 130,
          title: "Same-Origin Policy",
          requires: ["URL Anatomy"],
          note: "a regra do navegador que isola origens diferentes",
          summary:
            "A regra de segurança do navegador que impede uma página de ler dados de outra origem — a base que " +
            "isola um site de outro e que o CORS existe para relaxar de forma controlada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A origem de uma página é a combinação de esquema, host e porta. A Same-Origin Policy (SOP) faz o " +
                "navegador isolar as origens: o código de uma página só pode ler as respostas, o DOM e o " +
                "armazenamento de outras páginas da mesma origem. Sem ela, qualquer site que você abre poderia ler, " +
                "com o seu login ativo, o seu e-mail ou o seu banco em outra aba.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Duas páginas são da mesma origem só se esquema, host e porta forem iguais: fora disso, uma não " +
                "pode ler o que a outra carregou, a menos que o servidor permita (CORS).",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "A regra restringe a leitura entre origens, e não o envio: uma página pode enviar formulários e carregar imagens, scripts e estilos de outras origens, mas o seu código não pode ler a resposta de um `fetch` cross-origin.",
                "Vale para o DOM (iframes de outra origem), para `localStorage`, `sessionStorage` e IndexedDB, que são separados por origem, e para as respostas de `fetch` e `XMLHttpRequest`.",
                "Quem decide é o navegador: `curl`, servidores e aplicativos móveis não aplicam a SOP.",
                "Para permitir a leitura entre origens de forma controlada, o servidor de destino usa o CORS.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "comparando origens com `URL`, do mesmo jeito que o navegador decide:" },
            {
              type: "code",
              language: "javascript",
              filename: "same-origin.js",
              code: [
                "function isSameOrigin(a, b) {",
                "  return new URL(a).origin === new URL(b).origin;",
                "}",
                "",
                "const page = \"https://loja.exemplo.com/produtos\";",
                "",
                "isSameOrigin(page, \"https://loja.exemplo.com/carrinho\");   // true  — só o caminho difere",
                "isSameOrigin(page, \"http://loja.exemplo.com/produtos\");    // false — esquema diferente",
                "isSameOrigin(page, \"https://api.exemplo.com/produtos\");    // false — host diferente",
                "isSameOrigin(page, \"https://loja.exemplo.com:8443/x\");     // false — porta diferente",
                "isSameOrigin(page, \"https://loja.exemplo.com:443/x\");      // true  — 443 é a porta padrão do https",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Um subdomínio, como `api.`, conta como outra origem. Por isso um front-end em `loja.exemplo.com` " +
                "chamando uma API em `api.exemplo.com` depende do CORS.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A SOP impede ler, e não enviar: uma requisição de outro site chega ao servidor, com os cookies do usuário; proteger contra isso é papel de `SameSite` e de tokens anti-CSRF.",
                "Ela protege o usuário, e não o servidor: quem chama a API por fora do navegador ignora completamente a política.",
                "`localhost:3000` e `localhost:4000` são origens diferentes, e por isso um front-end e uma API de desenvolvimento em portas distintas esbarram no CORS.",
                "Duas origens \"do mesmo site\", como `exemplo.com` e `www.exemplo.com`, continuam sendo origens diferentes para a SOP.",
              ],
            },
          ],
          examples: [
            {
              title: "O que a SOP permite e o que bloqueia",
              context: "Incorporar é permitido, e ler o conteúdo, não.",
              code: {
                language: "text",
                filename: "sop-table.txt",
                code: [
                  "Ação (página em https://a.com → recurso em https://b.com)      Permitido?",
                  "---------------------------------------------------------------------------",
                  "<img src>, <script src>, <link rel=stylesheet>                  sim (só carrega)",
                  "<form action> enviando dados                                    sim (envia)",
                  "fetch(...) e ler a resposta                                     NÃO (sem CORS)",
                  "ler o DOM de um <iframe> de b.com                               NÃO",
                  "ler o localStorage de b.com                                     NÃO",
                ].join("\n"),
              },
              explanation:
                "O navegador deixa a página usar recursos de outras origens, mas não deixa o seu código inspecioná-los. " +
                "Uma imagem de outro site aparece, mas o script não lê os seus pixels.",
            },
            {
              title: "O erro visto no navegador",
              context: "Uma chamada entre origens sem permissão falha, mesmo que o servidor tenha respondido normalmente.",
              code: {
                language: "javascript",
                filename: "blocked-read.js",
                code: [
                  "// Página em https://loja.exemplo.com",
                  "try {",
                  "  const response = await fetch(\"https://api.exemplo.com/produtos\");",
                  "  await response.json();",
                  "} catch (error) {",
                  "  error.name;   // \"TypeError\" — a leitura foi bloqueada",
                  "  // No console do navegador: \"blocked by CORS policy: No 'Access-Control-Allow-Origin' header...\"",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O servidor pode ter recebido e processado o pedido. Quem bloqueou foi o navegador, ao ver que a resposta " +
                "não traz a permissão para a origem da página.",
            },
            {
              title: "Armazenamento separado por origem",
              context: "O mesmo nome de chave, em origens diferentes, guarda valores independentes.",
              code: {
                language: "javascript",
                filename: "storage-per-origin.js",
                code: [
                  "// Em https://loja.exemplo.com",
                  "localStorage.setItem(\"tema\", \"escuro\");",
                  "",
                  "// Em https://api.exemplo.com, outra origem, o mesmo código enxerga o seu próprio armazenamento",
                  "localStorage.getItem(\"tema\");   // null — não vê o valor gravado pela outra origem",
                ].join("\n"),
              },
              explanation:
                "É a SOP protegendo os dados de cada site: um site não consegue ler o que outro guardou no navegador, " +
                "mesmo que compartilhem o domínio principal.",
            },
          ],
          exercise: {
            problem:
              "A verificação de \"mesma origem\" do projeto compara o início das strings das URLs. Ela considera " +
              "iguais duas origens diferentes, e diferentes duas equivalentes.",
            problemCode: {
              language: "javascript",
              filename: "origin-check.js",
              code: [
                "function isSameOrigin(a, b) {",
                "  return a.startsWith(b.split(\"/\").slice(0, 3).join(\"/\"));",
                "}",
                "",
                "isSameOrigin(\"https://loja.com.evil.io/x\", \"https://loja.com/y\");   // true — deveria ser false",
                "isSameOrigin(\"https://loja.com:443/x\", \"https://loja.com/y\");       // false — deveria ser true",
              ].join("\n"),
            },
            task:
              "Reescreva `isSameOrigin` com `URL`, e devolva `false` (sem lançar erro) quando alguma das entradas não " +
              "for uma URL válida.",
            hint: "Compare `new URL(x).origin`. Envolva a criação em `try/catch`: `new URL` lança `TypeError` para entradas inválidas.",
            solution: {
              code: {
                language: "javascript",
                filename: "origin-check.fixed.js",
                code: [
                  "function isSameOrigin(a, b) {",
                  "  try {",
                  "    return new URL(a).origin === new URL(b).origin;",
                  "  } catch {",
                  "    return false;   // entrada inválida nunca é \"mesma origem\"",
                  "  }",
                  "}",
                  "",
                  "isSameOrigin(\"https://loja.com.evil.io/x\", \"https://loja.com/y\");   // false",
                  "isSameOrigin(\"https://loja.com:443/x\", \"https://loja.com/y\");       // true",
                  "isSameOrigin(\"não é uma url\", \"https://loja.com/y\");                // false",
                ].join("\n"),
              },
              explanation:
                "A origem é calculada pelo mesmo parser que o navegador usa, e não por pedaços de texto. Isso elimina " +
                "o truque do domínio com prefixo parecido e trata a porta padrão corretamente.",
            },
          },
        }),
        concept({
          order: 140,
          title: "CORS",
          requires: ["Same-Origin Policy"],
          note: "preflight, headers Access-Control-*",
          summary:
            "O mecanismo pelo qual um servidor diz ao navegador quais outras origens podem ler as suas respostas, " +
            "relaxando de forma controlada a Same-Origin Policy, por meio de cabeçalhos `Access-Control-*`.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "CORS (Cross-Origin Resource Sharing) é a forma de o servidor autorizar leituras entre origens. O " +
                "navegador envia o cabeçalho `Origin` com a requisição, e o servidor responde se essa origem é " +
                "permitida, no `Access-Control-Allow-Origin`. Se a resposta não trouxer a permissão, o navegador " +
                "descarta o resultado. Para requisições que poderiam causar efeitos, ele faz antes uma consulta de " +
                "reconhecimento (preflight) com o método `OPTIONS`.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O CORS é o servidor autorizando o navegador a entregar a resposta a uma outra origem: quem aplica a " +
                "regra é o navegador, e não o servidor.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Requisição simples (GET, HEAD ou POST com tipos de conteúdo básicos e sem cabeçalhos personalizados): é enviada direto, e o navegador confere `Access-Control-Allow-Origin` na resposta.",
                "Preflight: quando há um método como PUT ou DELETE, um cabeçalho como `Authorization` ou o `Content-Type: application/json`, o navegador envia antes um `OPTIONS` com `Access-Control-Request-Method` e `Access-Control-Request-Headers`.",
                "O servidor responde ao preflight com `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` e, opcionalmente, `Access-Control-Max-Age` (quanto tempo o navegador pode guardar a resposta).",
                "Com cookies, o cliente pede `credentials: \"include\"`, e o servidor precisa responder com uma origem específica (nunca `*`) e `Access-Control-Allow-Credentials: true`.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor que permite um conjunto de origens e responde ao preflight:" },
            {
              type: "code",
              language: "javascript",
              filename: "cors.js",
              code: [
                "import http from \"node:http\";",
                "",
                "const allowedOrigins = new Set([\"https://loja.exemplo.com\"]);",
                "",
                "http.createServer((request, response) => {",
                "  const origin = request.headers.origin;",
                "",
                "  if (origin && allowedOrigins.has(origin)) {",
                "    response.setHeader(\"access-control-allow-origin\", origin);   // uma origem específica, e não *",
                "    response.setHeader(\"access-control-allow-credentials\", \"true\");",
                "    response.setHeader(\"vary\", \"Origin\");                       // a resposta varia conforme a origem",
                "  }",
                "",
                "  if (request.method === \"OPTIONS\") {                            // preflight",
                "    response.setHeader(\"access-control-allow-methods\", \"GET, POST, PUT, DELETE\");",
                "    response.setHeader(\"access-control-allow-headers\", \"content-type, authorization\");",
                "    response.setHeader(\"access-control-max-age\", \"600\");",
                "    response.writeHead(204);",
                "    return response.end();",
                "  }",
                "",
                "  response.setHeader(\"content-type\", \"application/json\");",
                "  response.end(JSON.stringify({ produtos: [\"caneta\"] }));",
                "}).listen(3000);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Só origens da lista recebem a permissão. O `Vary: Origin` avisa aos caches que a resposta muda conforme " +
                "quem pergunta, e o preflight recebe um 204 com as permissões.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O CORS não protege o servidor: quem usa `curl` ou outro servidor ignora tudo isso; a autorização de verdade precisa ser feita no back-end.",
                "`Access-Control-Allow-Origin: *` não é aceito com credenciais, e refletir qualquer `Origin` recebido com `Allow-Credentials: true` deixa qualquer site ler dados do usuário logado.",
                "Esquecer o `Vary: Origin` faz um cache entregar a resposta de uma origem a outra, com o cabeçalho errado.",
                "Um `Content-Type: application/json` ou um cabeçalho `Authorization` já provocam preflight, e o servidor precisa responder ao `OPTIONS` com sucesso e com os cabeçalhos certos.",
                "O erro aparece no navegador como uma falha de rede genérica: o servidor pode ter processado o pedido normalmente; a causa está nos cabeçalhos da resposta.",
              ],
            },
          ],
          examples: [
            {
              title: "Quando um pedido dispara o preflight",
              context: "Nem toda requisição entre origens exige a consulta prévia; depende do método e dos cabeçalhos.",
              code: {
                language: "javascript",
                filename: "needs-preflight.js",
                code: [
                  "const SIMPLE_METHODS = new Set([\"GET\", \"HEAD\", \"POST\"]);",
                  "const SIMPLE_CONTENT_TYPES = new Set([",
                  "  \"application/x-www-form-urlencoded\", \"multipart/form-data\", \"text/plain\",",
                  "]);",
                  "",
                  "function needsPreflight(method, headers = {}) {",
                  "  if (!SIMPLE_METHODS.has(method)) return true;",
                  "  const contentType = headers[\"content-type\"]?.split(\";\")[0];",
                  "  if (contentType && !SIMPLE_CONTENT_TYPES.has(contentType)) return true;",
                  "  return \"authorization\" in headers;   // simplificação: cabeçalhos personalizados também disparam",
                  "}",
                  "",
                  "needsPreflight(\"GET\");                                                   // false",
                  "needsPreflight(\"POST\", { \"content-type\": \"application/json\" });        // true",
                  "needsPreflight(\"DELETE\");                                                // true",
                ].join("\n"),
              },
              explanation:
                "Um `POST` com JSON já dispara o preflight, e é por isso que muitas APIs \"quebram\" no CORS só depois " +
                "que o front-end passa a enviar JSON. A função resume a regra, sem cobrir todos os detalhes da especificação.",
            },
            {
              title: "O cliente pedindo credenciais",
              context: "Enviar cookies em uma requisição entre origens exige cooperação dos dois lados.",
              code: {
                language: "javascript",
                filename: "credentials.js",
                code: [
                  "// Cliente (https://loja.exemplo.com): pede para enviar e aceitar cookies",
                  "const response = await fetch(\"https://api.exemplo.com/perfil\", {",
                  "  credentials: \"include\",",
                  "});",
                  "",
                  "// Servidor (https://api.exemplo.com) precisa responder com:",
                  "//   Access-Control-Allow-Origin: https://loja.exemplo.com    (não pode ser *)",
                  "//   Access-Control-Allow-Credentials: true",
                  "//   Vary: Origin",
                ].join("\n"),
              },
              explanation:
                "Se o servidor responder `*` ou omitir `Allow-Credentials`, o navegador descarta a resposta, mesmo que o " +
                "login tenha funcionado. O cookie ainda precisa ter `SameSite=None; Secure` para viajar entre sites.",
            },
            {
              title: "Refletir a origem sem conferir: o erro clássico",
              context: "Uma configuração \"que funciona em todos os casos\" é uma vulnerabilidade quando há credenciais.",
              code: {
                language: "javascript",
                filename: "reflect-origin.js",
                code: [
                  "// Perigoso: aceita QUALQUER origem, e ainda com credenciais",
                  "response.setHeader(\"access-control-allow-origin\", request.headers.origin);",
                  "response.setHeader(\"access-control-allow-credentials\", \"true\");",
                  "// Um site malicioso passa a poder ler /perfil com o login do usuário.",
                  "",
                  "// Correto: só as origens de uma lista conhecida",
                  "if (allowedOrigins.has(request.headers.origin)) {",
                  "  response.setHeader(\"access-control-allow-origin\", request.headers.origin);",
                  "  response.setHeader(\"access-control-allow-credentials\", \"true\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Refletir a origem sem conferir anula a Same-Origin Policy para todos os sites. A lista de origens " +
                "permitidas é o que mantém o CORS como uma exceção controlada.",
            },
          ],
          exercise: {
            problem:
              "A API responde `Access-Control-Allow-Origin: *` junto de `Allow-Credentials: true`, o que o navegador " +
              "recusa, e não trata o preflight: o front-end recebe um erro genérico ao enviar JSON com `Authorization`.",
            problemCode: {
              language: "javascript",
              filename: "cors-broken.js",
              code: [
                "function corsHeaders(request) {",
                "  return {",
                "    \"access-control-allow-origin\": \"*\",",
                "    \"access-control-allow-credentials\": \"true\",",
                "  };",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva `corsHeaders(origin, method, allowedOrigins)` para devolver `{}` quando a origem não é " +
              "permitida, a origem específica com `Vary` quando é, e, se o método for `OPTIONS`, também as permissões de " +
              "métodos e de cabeçalhos do preflight.",
            hint: "Devolva `{}` quando `allowedOrigins` não contém a origem. Acrescente `access-control-allow-methods` e `-headers` só no `OPTIONS`.",
            solution: {
              code: {
                language: "javascript",
                filename: "cors-broken.fixed.js",
                code: [
                  "function corsHeaders(origin, method, allowedOrigins) {",
                  "  if (!origin || !allowedOrigins.has(origin)) return {};   // sem permissão: nenhum cabeçalho CORS",
                  "",
                  "  const headers = {",
                  "    \"access-control-allow-origin\": origin,",
                  "    \"access-control-allow-credentials\": \"true\",",
                  "    vary: \"Origin\",",
                  "  };",
                  "",
                  "  if (method === \"OPTIONS\") {   // preflight",
                  "    headers[\"access-control-allow-methods\"] = \"GET, POST, PUT, DELETE\";",
                  "    headers[\"access-control-allow-headers\"] = \"content-type, authorization\";",
                  "    headers[\"access-control-max-age\"] = \"600\";",
                  "  }",
                  "  return headers;",
                  "}",
                  "",
                  "const allowed = new Set([\"https://loja.exemplo.com\"]);",
                  "corsHeaders(\"https://loja.exemplo.com\", \"GET\", allowed);       // origem, credenciais e Vary",
                  "corsHeaders(\"https://outro-site.com\", \"GET\", allowed);         // {}",
                  "corsHeaders(\"https://loja.exemplo.com\", \"OPTIONS\", allowed);   // também métodos e cabeçalhos",
                ].join("\n"),
              },
              explanation:
                "Agora só as origens da lista recebem permissão, com uma origem específica, compatível com credenciais, " +
                "e o preflight tem uma resposta completa. A função é pura, e por isso fácil de testar.",
            },
          },
        }),
        concept({
          order: 150,
          title: "WebSocket",
          requires: ["HTTP Headers"],
          note: "canal full-duplex — revisita Programming Foundations / Asynchronous Programming (event loop)",
          revisit: ["Programming Foundations / Asynchronous Programming"],
          summary:
            "Um canal de comunicação persistente e bidirecional sobre uma única conexão, iniciado por um pedido HTTP " +
            "e mantido aberto — o servidor e o cliente podem enviar mensagens a qualquer momento.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "No HTTP tradicional, é sempre o cliente que pergunta. O WebSocket muda isso: depois de um " +
                "handshake, a conexão TCP permanece aberta e os dois lados podem enviar mensagens quando quiserem " +
                "(full-duplex), sem novo pedido a cada vez. O handshake é um pedido HTTP com o cabeçalho " +
                "`Upgrade: websocket`, respondido com o status `101 Switching Protocols`. A partir daí, os dados " +
                "trafegam em quadros, e não mais em requisições e respostas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma conexão que fica aberta e em que os dois lados falam quando quiserem: é o que torna possível " +
                "um servidor enviar dados ao cliente sem que ele tenha perguntado.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O cliente pede a atualização do protocolo com uma chave aleatória (`Sec-WebSocket-Key`), e o " +
                "servidor prova que entendeu o protocolo devolvendo o `Sec-WebSocket-Accept`, derivado dessa chave. " +
                "Depois disso, cada mensagem é um evento, tratado pelo Event Loop como qualquer outro (Asynchronous " +
                "Programming). As URLs usam `ws://` e, sobre TLS, `wss://`.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "websocket.js",
              code: [
                "// Navegador (e Node.js 22+): a API é a mesma",
                "const socket = new WebSocket(\"wss://loja.exemplo.com/chat\");",
                "",
                "socket.addEventListener(\"open\", () => socket.send(JSON.stringify({ tipo: \"entrar\", sala: \"geral\" })));",
                "socket.addEventListener(\"message\", (event) => console.log(JSON.parse(event.data)));",
                "socket.addEventListener(\"close\", () => console.log(\"conexão encerrada\"));",
                "",
                "// Servidor (Node.js), com a biblioteca `ws`",
                "import { WebSocketServer } from \"ws\";",
                "",
                "const server = new WebSocketServer({ port: 8080 });",
                "server.on(\"connection\", (client) => {",
                "  client.on(\"message\", (data) => {",
                "    // reenvia a mensagem para todos os clientes conectados",
                "    for (const other of server.clients) other.send(data.toString());",
                "  });",
                "});",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Sem nenhum pedido novo, o servidor entrega a mensagem a todos os conectados no instante em que ela " +
                "chega. Com HTTP puro, cada cliente teria de perguntar repetidamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando há comunicação frequente nos dois sentidos com baixa latência, como chat, edição colaborativa, jogos e cotações ao vivo.",
                "Quando o servidor precisa enviar dados ao cliente no momento em que surgem, e o cliente também envia com frequência.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Se só o servidor envia dados, o Server-Sent Events é mais simples e roda sobre HTTP comum.",
                "Para atualizações raras, o polling ou uma requisição normal bastam, sem manter uma conexão aberta.",
                "Cada conexão aberta consome memória e um descritor no servidor: escalar para muitos clientes exige planejamento, como distribuir as mensagens entre instâncias por um sistema de publicação e assinatura.",
                "É preciso tratar o que o HTTP resolvia sozinho: reconexão, detecção de conexão morta (heartbeat), autenticação e proxies que derrubam conexões ociosas.",
                "O navegador envia os cookies no handshake para qualquer origem: sem checar o `Origin`, um site malicioso abre o WebSocket com o login do usuário (CSWSH).",
              ],
            },
          ],
          examples: [
            {
              title: "A prova do handshake",
              context: "O servidor calcula o `Sec-WebSocket-Accept` a partir da chave enviada pelo cliente.",
              code: {
                language: "javascript",
                filename: "handshake-accept.js",
                code: [
                  "import { createHash } from \"node:crypto\";",
                  "",
                  "const GUID = \"258EAFA5-E914-47DA-95CA-C5AB0DC85B11\";   // constante definida no protocolo",
                  "",
                  "function acceptKey(secWebSocketKey) {",
                  "  return createHash(\"sha1\").update(secWebSocketKey + GUID).digest(\"base64\");",
                  "}",
                  "",
                  "acceptKey(\"dGhlIHNhbXBsZSBub25jZQ==\");   // \"s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\"  (exemplo da RFC 6455)",
                ].join("\n"),
              },
              explanation:
                "Só um servidor que entende o protocolo sabe fazer esse cálculo. Isso evita que um servidor HTTP comum " +
                "seja confundido com um servidor de WebSocket, e o inverso.",
            },
            {
              title: "Reconexão com espera crescente",
              context: "A conexão vai cair em algum momento; o cliente precisa tentar de novo sem sobrecarregar o servidor.",
              code: {
                language: "javascript",
                filename: "reconnect.js",
                code: [
                  "function connect(url, onMessage, attempt = 0) {",
                  "  const socket = new WebSocket(url);",
                  "",
                  "  socket.addEventListener(\"open\", () => { attempt = 0; });   // reinicia a contagem ao conectar",
                  "  socket.addEventListener(\"message\", (event) => onMessage(event.data));",
                  "  socket.addEventListener(\"close\", () => {",
                  "    const delay = Math.min(1000 * 2 ** attempt, 30_000);       // 1s, 2s, 4s, ... até 30s",
                  "    const jitter = Math.random() * 500;                        // evita que todos reconectem juntos",
                  "    setTimeout(() => connect(url, onMessage, attempt + 1), delay + jitter);",
                  "  });",
                  "  return socket;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A espera dobra a cada falha, e o acaso (jitter) espalha as reconexões. Sem isso, uma queda do servidor " +
                "faria todos os clientes voltarem no mesmo instante, derrubando-o de novo.",
            },
            {
              title: "Recusar uma origem inesperada no handshake",
              context: "O handshake é um pedido HTTP comum, e o cabeçalho `Origin` permite recusar sites não autorizados.",
              code: {
                language: "javascript",
                filename: "origin-check-ws.js",
                code: [
                  "import http from \"node:http\";",
                  "",
                  "const allowedOrigins = new Set([\"https://loja.exemplo.com\"]);",
                  "const server = http.createServer();",
                  "",
                  "server.on(\"upgrade\", (request, socket) => {",
                  "  if (!allowedOrigins.has(request.headers.origin)) {",
                  "    socket.write(\"HTTP/1.1 403 Forbidden\\r\\nConnection: close\\r\\n\\r\\n\");",
                  "    return socket.destroy();   // origem não autorizada: não completa o handshake",
                  "  }",
                  "  // ... segue com o handshake (101 Switching Protocols) para as origens permitidas",
                  "});",
                  "",
                  "server.listen(8080);",
                ].join("\n"),
              },
              explanation:
                "O WebSocket não segue a Same-Origin Policy: o navegador conecta a qualquer origem e envia os cookies. " +
                "Conferir o `Origin` é o que impede que outro site use a sessão do usuário.",
            },
          ],
          exercise: {
            problem:
              "Um servidor de WebSocket escrito à mão precisa completar o handshake: para uma requisição com a " +
              "chave do cliente, devolver a resposta `101` com o `Sec-WebSocket-Accept` correto.",
            problemCode: {
              language: "javascript",
              filename: "handshake.js",
              code: [
                "// Requisição do cliente:",
                "//   GET /chat HTTP/1.1",
                "//   Upgrade: websocket",
                "//   Connection: Upgrade",
                "//   Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==",
                "",
                "function handshakeResponse(secWebSocketKey) {",
                "  // devolver o texto da resposta 101, com o cabeçalho Sec-WebSocket-Accept calculado",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `handshakeResponse`: calcule o `Sec-WebSocket-Accept` (SHA-1 da chave + o GUID do protocolo, em " +
              "base64) e monte a resposta `101 Switching Protocols`.",
            hint: "O GUID é `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`. Os cabeçalhos são `Upgrade`, `Connection` e `Sec-WebSocket-Accept`, e a resposta termina com uma linha em branco.",
            solution: {
              code: {
                language: "javascript",
                filename: "handshake.fixed.js",
                code: [
                  "import { createHash } from \"node:crypto\";",
                  "",
                  "const GUID = \"258EAFA5-E914-47DA-95CA-C5AB0DC85B11\";",
                  "",
                  "function handshakeResponse(secWebSocketKey) {",
                  "  const accept = createHash(\"sha1\").update(secWebSocketKey + GUID).digest(\"base64\");",
                  "",
                  "  return [",
                  "    \"HTTP/1.1 101 Switching Protocols\",",
                  "    \"Upgrade: websocket\",",
                  "    \"Connection: Upgrade\",",
                  "    `Sec-WebSocket-Accept: ${accept}`,",
                  "    \"\",",
                  "    \"\",",
                  "  ].join(\"\\r\\n\");",
                  "}",
                  "",
                  "handshakeResponse(\"dGhlIHNhbXBsZSBub25jZQ==\");",
                  "// \"HTTP/1.1 101 Switching Protocols\\r\\nUpgrade: websocket\\r\\nConnection: Upgrade\\r\\n",
                  "//  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\\r\\n\\r\\n\"",
                ].join("\n"),
              },
              explanation:
                "Com a resposta 101 e o `Accept` correto, o cliente entende que o servidor aceitou o protocolo, e a " +
                "conexão passa a trafegar quadros de WebSocket. Bibliotecas como `ws` fazem isso por você.",
            },
          },
        }),
        concept({
          order: 160,
          title: "Server-Sent Events (SSE)",
          requires: ["HTTP"],
          note: "streaming — revisita Programming Foundations / Asynchronous Programming / Promise. AI Engineering / Model Inference / Streaming aponta para cá",
          revisit: ["Programming Foundations / Asynchronous Programming / Promise", "AI Engineering / Model Inference / Streaming"],
          summary:
            "Um fluxo de eventos do servidor para o cliente sobre uma resposta HTTP que fica aberta — simples, com " +
            "reconexão automática, e a base do streaming de respostas de modelos de linguagem.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Server-Sent Events é uma forma de o servidor enviar dados ao cliente continuamente, por uma única " +
                "resposta HTTP que não termina. A resposta tem o tipo `text/event-stream`, e cada evento é um bloco " +
                "de texto terminado por uma linha em branco. No navegador, a classe `EventSource` abre a conexão, " +
                "entrega os eventos e reconecta sozinha se ela cair, informando o último id recebido para o servidor " +
                "retomar de onde parou.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma resposta HTTP que nunca termina: o servidor escreve eventos conforme eles acontecem, e o " +
                "cliente os lê à medida que chegam — só em uma direção, e sem protocolo novo.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada evento é feito de linhas `campo: valor`: `data` é o conteúdo, `event` dá um nome ao tipo, `id` " +
                "identifica o evento para a retomada, e `retry` sugere o tempo de reconexão. Uma linha em branco fecha o " +
                "evento, e linhas que começam com `:` são comentários, usadas para manter a conexão viva.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "sse.js",
              code: [
                "// Servidor (Node.js)",
                "import http from \"node:http\";",
                "",
                "http.createServer((request, response) => {",
                "  response.writeHead(200, {",
                "    \"content-type\": \"text/event-stream\",",
                "    \"cache-control\": \"no-cache\",",
                "    connection: \"keep-alive\",",
                "  });",
                "",
                "  let id = 0;",
                "  const timer = setInterval(() => {",
                "    response.write(`id: ${++id}\\nevent: progresso\\ndata: ${JSON.stringify({ porcento: id * 10 })}\\n\\n`);",
                "    if (id === 10) { clearInterval(timer); response.end(); }",
                "  }, 1000);",
                "",
                "  request.on(\"close\", () => clearInterval(timer));   // o cliente foi embora",
                "}).listen(3000);",
                "",
                "// Navegador",
                "const events = new EventSource(\"/progresso\");",
                "events.addEventListener(\"progresso\", (event) => console.log(JSON.parse(event.data)));   // { porcento: 10 }, ...",
                "events.onerror = () => console.log(\"reconectando...\");   // o navegador tenta de novo sozinho",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O servidor mantém a resposta aberta e escreve um bloco a cada segundo. Não há biblioteca especial: " +
                "é HTTP comum, com um tipo de conteúdo e um formato de texto.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando só o servidor envia dados ao cliente: notificações, painéis ao vivo, progresso de tarefas e feeds.",
                "Para transmitir respostas de modelos de linguagem token a token (streaming), o formato usado pela maioria das APIs de IA.",
                "Quando se quer algo mais simples que o WebSocket, com reconexão automática e que funciona sobre HTTP comum, inclusive com proxies e HTTP/2.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "É unidirecional: para o cliente enviar dados, é preciso uma requisição comum à parte; para conversa nos dois sentidos, use WebSocket.",
                "Só transporta texto (UTF-8); dados binários precisam de codificação, como base64.",
                "`EventSource` só faz GET e não permite cabeçalhos personalizados, então o `Authorization` não vai; use cookies, ou leia o fluxo com `fetch`.",
                "No HTTP/1.1, os navegadores limitam a cerca de seis conexões por domínio, compartilhadas entre as abas: muitos fluxos abertos podem esgotar o limite.",
                "Proxies e balanceadores podem armazenar a resposta em buffer e atrasar os eventos, ou derrubar conexões ociosas; envie comentários de batimento (`: ping`) e desligue o buffer.",
              ],
            },
          ],
          examples: [
            {
              title: "Ler o fluxo com `fetch`",
              context: "Quando é preciso enviar um POST ou um cabeçalho `Authorization`, o `EventSource` não serve, e o `fetch` lê o mesmo fluxo.",
              code: {
                language: "javascript",
                filename: "fetch-stream.js",
                code: [
                  "const response = await fetch(\"http://localhost:3000/progresso\", {",
                  "  headers: { authorization: \"Bearer token\" },",
                  "});",
                  "",
                  "const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();",
                  "let buffer = \"\";",
                  "",
                  "while (true) {",
                  "  const { done, value } = await reader.read();",
                  "  if (done) break;",
                  "",
                  "  buffer += value;",
                  "  const events = buffer.split(\"\\n\\n\");   // um evento termina em uma linha em branco",
                  "  buffer = events.pop();                  // o último pedaço pode estar incompleto",
                  "",
                  "  for (const event of events) console.log(event);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "É assim que muitos clientes de APIs de IA leem as respostas em streaming. O buffer garante que um " +
                "evento partido entre dois pedaços seja processado só quando chegar inteiro.",
            },
            {
              title: "Retomar de onde parou com `Last-Event-ID`",
              context: "Ao reconectar, o navegador informa o último id recebido, e o servidor reenvia o que faltou.",
              code: {
                language: "javascript",
                filename: "last-event-id.js",
                code: [
                  "const history = [];   // { id, data } de todos os eventos já emitidos",
                  "",
                  "function handleStream(request, response) {",
                  "  response.writeHead(200, { \"content-type\": \"text/event-stream\" });",
                  "",
                  "  // O navegador envia o último id que viu ao reconectar",
                  "  const lastId = Number(request.headers[\"last-event-id\"] ?? 0);",
                  "",
                  "  for (const event of history.filter((e) => e.id > lastId)) {",
                  "    response.write(`id: ${event.id}\\ndata: ${event.data}\\n\\n`);   // reenvia só o que faltou",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Sem isso, uma queda de conexão perderia os eventos emitidos durante a reconexão. Com o `id`, o " +
                "servidor consegue reenviá-los.",
            },
            {
              title: "Batimento para manter a conexão viva",
              context: "Conexões ociosas são derrubadas por proxies e balanceadores; um comentário periódico as mantém abertas.",
              code: {
                language: "javascript",
                filename: "heartbeat.js",
                code: [
                  "function keepAlive(response, everyMs = 15_000) {",
                  "  const timer = setInterval(() => response.write(\": ping\\n\\n\"), everyMs);",
                  "  response.on(\"close\", () => clearInterval(timer));",
                  "}",
                  "",
                  "// Uma linha que começa com \":\" é um comentário: o cliente a ignora, mas o proxy vê tráfego.",
                ].join("\n"),
              },
              explanation:
                "O comentário não gera evento no cliente, mas evita que a conexão seja considerada ociosa. É o " +
                "equivalente, em SSE, do heartbeat de um WebSocket.",
            },
          ],
          exercise: {
            problem:
              "O servidor monta o texto dos eventos SSE concatenando strings. Uma mensagem com quebra de linha " +
              "corrompe o fluxo, e o evento chega truncado ao cliente.",
            problemCode: {
              language: "javascript",
              filename: "format-event.js",
              code: [
                "function formatEvent({ id, event, data }) {",
                "  return `id: ${id}\\nevent: ${event}\\ndata: ${data}\\n\\n`;",
                "}",
                "",
                "formatEvent({ id: 1, event: \"mensagem\", data: \"linha 1\\nlinha 2\" });",
                "// \"id: 1\\nevent: mensagem\\ndata: linha 1\\nlinha 2\\n\\n\"   — \"linha 2\" vira um campo inválido",
              ].join("\n"),
            },
            task:
              "Corrija `formatEvent` para que cada linha de `data` receba o seu próprio prefixo `data:`, e para que " +
              "`id` e `event` sejam opcionais.",
            hint: "Divida `data` em `\\n` e transforme cada linha em `data: linha`. Só inclua `id` e `event` quando existirem.",
            solution: {
              code: {
                language: "javascript",
                filename: "format-event.fixed.js",
                code: [
                  "function formatEvent({ id, event, data }) {",
                  "  const lines = [];",
                  "  if (id !== undefined) lines.push(`id: ${id}`);",
                  "  if (event) lines.push(`event: ${event}`);",
                  "  for (const line of String(data).split(\"\\n\")) lines.push(`data: ${line}`);",
                  "  return lines.join(\"\\n\") + \"\\n\\n\";   // a linha em branco fecha o evento",
                  "}",
                  "",
                  "formatEvent({ id: 1, event: \"mensagem\", data: \"linha 1\\nlinha 2\" });",
                  "// \"id: 1\\nevent: mensagem\\ndata: linha 1\\ndata: linha 2\\n\\n\"",
                  "// O cliente junta as linhas de `data` com \\n e recebe \"linha 1\\nlinha 2\"",
                ].join("\n"),
              },
              explanation:
                "Cada linha de dados tem o seu prefixo, e o cliente as reúne de volta em uma só mensagem. Uma quebra de " +
                "linha deixou de quebrar o formato.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "api-fundamentals",
      order: 20,
      title: "API Fundamentals",
      requires: ["Web Fundamentals"],
      summary:
        "O que é API → contrato → REST → recursos e URLs → validar o contrato de entrada → resposta e erro → " +
        "paginação/filtro/ordenação → idempotência e rate limiting → versionamento/deprecação → OpenAPI → " +
        "middleware. Idempotency Key e Rate Limiting canônicos aqui (mudança não silenciosa vs Fase 1).",
      concepts: [
        concept({
          order: 10,
          title: "API",
          note: "a interface pela qual um programa usa outro",
          summary:
            "Uma interface que um sistema oferece para que outros programas o usem, sem conhecer o seu " +
            "interior — na web, geralmente um conjunto de endereços HTTP que recebem e devolvem dados.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "API (Application Programming Interface) é a fronteira que um software expõe para ser usado por " +
                "outro software. Quem usa, o consumidor, sabe o que pode pedir e o que receberá, mas não como o " +
                "resultado é produzido. É a aplicação de Interface e Abstraction (Programming Fundamentals) no nível " +
                "de sistemas: em vez de chamar uma função na mesma memória, um programa envia uma requisição pela " +
                "rede a outro. Uma API web costuma trafegar JSON sobre HTTP, mas há outros estilos, como GraphQL, gRPC " +
                "e webhooks.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A API é a porta de entrada de um sistema: quem consome depende só do que ela promete, e o " +
                "sistema pode mudar por dentro sem que o consumidor perceba.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Uma API permite que equipes diferentes, ou empresas diferentes, integrem os seus sistemas sem " +
                "combinar detalhes internos. Também é o ponto em que o sistema passa a ter clientes que você não " +
                "controla: o que se publica precisa continuar funcionando, e cada decisão de design, de nomes, de " +
                "formatos e de erros, vira algo que outros programas passam a depender.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma API mínima que expõe produtos, e um consumidor que a usa sem conhecer a implementação:" },
            {
              type: "code",
              language: "javascript",
              filename: "api.js",
              code: [
                "import http from \"node:http\";",
                "",
                "// Provedor: o que está dentro (um array, um banco, outro serviço) é invisível para quem consome",
                "const products = [{ id: 1, name: \"caneta\", price: 5 }];",
                "",
                "http.createServer((request, response) => {",
                "  if (request.method === \"GET\" && request.url === \"/products\") {",
                "    response.writeHead(200, { \"content-type\": \"application/json\" });",
                "    return response.end(JSON.stringify(products));",
                "  }",
                "  response.writeHead(404).end();",
                "}).listen(3000);",
                "",
                "// Consumidor: só conhece o endereço e o formato da resposta",
                "const list = await fetch(\"http://localhost:3000/products\").then((r) => r.json());",
                "list[0].name;   // \"caneta\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Se amanhã os produtos passarem a vir de um banco de dados, o consumidor continua igual, desde que o " +
                "endereço e o formato da resposta sejam os mesmos.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Expor o modelo interno como está, com tabelas e campos do banco, prende a API à implementação; qualquer refatoração vira uma quebra para os consumidores.",
                "Uma API publicada é difícil de retirar: consumidores que você não conhece passam a depender até dos comportamentos que você não pretendia prometer.",
                "Uma API não é só os endereços: erros, limites, autenticação, ordem dos campos e tempos de resposta também fazem parte do que os consumidores sentem.",
                "Ser \"uma API\" não garante ser boa: sem consistência de nomes, de formatos e de erros, cada endpoint precisa ser aprendido do zero.",
              ],
            },
          ],
          examples: [
            {
              title: "A mesma capacidade, estilos diferentes",
              context: "\"API\" é o conceito, e REST, GraphQL e gRPC são formas de organizá-la.",
              code: {
                language: "javascript",
                filename: "styles.js",
                code: [
                  "// REST: recursos e métodos HTTP",
                  "await fetch(\"/orders/42\");",
                  "",
                  "// GraphQL: uma consulta que pede exatamente os campos desejados",
                  "await fetch(\"/graphql\", {",
                  "  method: \"POST\",",
                  "  body: JSON.stringify({ query: \"{ order(id: 42) { id total } }\" }),",
                  "});",
                  "",
                  "// Webhook: o provedor chama você quando algo acontece (o fluxo é invertido)",
                  "// POST https://seu-sistema.com/webhooks/pagamento   ← enviado pelo provedor",
                ].join("\n"),
              },
              explanation:
                "Em todos os casos há um contrato entre quem oferece e quem consome. Muda a forma de expressá-lo e quem " +
                "inicia a conversa.",
            },
            {
              title: "Esconder a implementação atrás da API",
              context: "O consumidor não deve perceber uma troca no que fica por trás.",
              code: {
                language: "javascript",
                filename: "hide-implementation.js",
                code: [
                  "// Versão 1: os dados vêm da memória",
                  "const findProduct = (id) => products.find((p) => p.id === id);",
                  "",
                  "// Versão 2: vêm de um banco, e a API continua igual",
                  "const findProduct2 = async (id) => db.query(\"SELECT id, name, price FROM products WHERE id = $1\", [id]);",
                  "",
                  "// Nos dois casos, a resposta pública é a mesma:",
                  "// GET /products/1  →  { \"id\": 1, \"name\": \"caneta\", \"price\": 5 }",
                ].join("\n"),
              },
              explanation:
                "A troca de memória para banco de dados não aparece para quem consome. É o benefício de depender de um " +
                "contrato, e não de uma implementação.",
            },
            {
              title: "O que vaza quando o modelo interno vira a API",
              context: "Expor as tabelas como estão cria dependências que você não queria assumir.",
              code: {
                language: "javascript",
                filename: "leaky-api.js",
                code: [
                  "// Resposta que vaza o esquema do banco",
                  "// { \"prod_id\": 1, \"prod_nm\": \"caneta\", \"flg_ativo\": 1, \"dt_cad\": \"2026-01-05 10:00:00\" }",
                  "",
                  "// Resposta desenhada para o consumidor",
                  "// { \"id\": 1, \"name\": \"caneta\", \"active\": true, \"createdAt\": \"2026-01-05T10:00:00Z\" }",
                  "",
                  "const toProductResponse = (row) => ({",
                  "  id: row.prod_id,",
                  "  name: row.prod_nm,",
                  "  active: row.flg_ativo === 1,",
                  "  createdAt: new Date(row.dt_cad.replace(\" \", \"T\") + \"Z\").toISOString(),",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Com uma camada de tradução, o esquema pode mudar sem quebrar os consumidores. É o mesmo raciocínio do " +
                "DTO, aplicado à fronteira do sistema.",
            },
          ],
          exercise: {
            problem:
              "O endpoint devolve a linha do banco como está, com nomes de colunas e códigos internos. O time quer " +
              "renomear as colunas, mas o aplicativo móvel depende delas.",
            problemCode: {
              language: "javascript",
              filename: "customer-endpoint.js",
              code: [
                "// Linha do banco: { cli_id: 7, cli_nm: \"Ana\", cli_st: \"A\", cli_lim: \"1500.00\" }",
                "function getCustomer(row) {",
                "  return row;   // devolve tudo como está",
                "}",
              ].join("\n"),
            },
            task:
              "Crie uma resposta de API estável: `id`, `name`, `active` (booleano) e `creditLimit` (número), " +
              "independente dos nomes das colunas.",
            hint: "Mapeie cada coluna para o campo público. `cli_st === \"A\"` significa ativo, e o limite chega como texto.",
            solution: {
              code: {
                language: "javascript",
                filename: "customer-endpoint.fixed.js",
                code: [
                  "function toCustomerResponse(row) {",
                  "  return {",
                  "    id: row.cli_id,",
                  "    name: row.cli_nm,",
                  "    active: row.cli_st === \"A\",",
                  "    creditLimit: Number(row.cli_lim),",
                  "  };",
                  "}",
                  "",
                  "toCustomerResponse({ cli_id: 7, cli_nm: \"Ana\", cli_st: \"A\", cli_lim: \"1500.00\" });",
                  "// { id: 7, name: \"Ana\", active: true, creditLimit: 1500 }",
                ].join("\n"),
              },
              explanation:
                "Os nomes das colunas ficaram restritos à função de tradução. O banco pode ser renomeado, e o " +
                "contrato público continua o mesmo.",
            },
          },
        }),
        concept({
          order: 20,
          title: "API Contract",
          requires: ["Programming Foundations / Programming Fundamentals / Contract"],
          note: "aplica Contract (pré/pós-condições) a fronteira de serviço; Testing & Quality Engineering / Contract Testing verifica isto",
          revisit: ["Programming Foundations / Programming Fundamentals / Contract", "Testing & Quality Engineering / Testing Strategy / Contract Testing"],
          summary:
            "Tudo o que a API promete aos seus consumidores — endereços, formatos de entrada e de saída, erros, " +
            "limites e comportamentos —, e as regras sobre o que pode mudar sem quebrar quem depende dela.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O contrato de uma API é a promessa entre provedor e consumidor: quais operações existem, o que " +
                "cada uma exige (pré-condições, como campos obrigatórios e permissões), o que devolve " +
                "(pós-condições, como o formato e os status) e o que sempre vale (invariantes, como \"o total nunca " +
                "é negativo\"). É a aplicação de Contract (Programming Fundamentals) a uma fronteira entre serviços, e " +
                "é o que os testes de contrato (Contract Testing) verificam.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O contrato é o que você não pode mudar sem avisar: consumidores dependem dele, e tudo o que a " +
                "API expõe passa a fazer parte dele, querendo ou não.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Com o contrato explícito, provedor e consumidor evoluem em paralelo: o provedor sabe o que pode " +
                "alterar sem risco, e o consumidor sabe no que confiar. As mudanças se dividem em compatíveis, que " +
                "não exigem nenhuma ação dos consumidores (adicionar um campo opcional, um novo endpoint), e " +
                "incompatíveis, ou breaking changes, que quebram quem já usa (remover ou renomear um campo, mudar um " +
                "tipo, tornar obrigatório o que era opcional).",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um contrato escrito como dados, e uma verificação de que uma resposta o cumpre:" },
            {
              type: "code",
              language: "javascript",
              filename: "api-contract.js",
              code: [
                "// Contrato de GET /orders/:id (resumido)",
                "const orderContract = {",
                "  required: { id: \"string\", status: \"string\", total: \"number\" },",
                "  optional: { note: \"string\" },",
                "  statuses: [\"pending\", \"paid\", \"shipped\"],",
                "};",
                "",
                "function checkResponse(contract, body) {",
                "  const problems = [];",
                "  for (const [field, type] of Object.entries(contract.required)) {",
                "    if (typeof body[field] !== type) problems.push(`campo ${field}: esperado ${type}`);",
                "  }",
                "  if (!contract.statuses.includes(body.status)) problems.push(`status inválido: ${body.status}`);",
                "  return problems;",
                "}",
                "",
                "checkResponse(orderContract, { id: \"42\", status: \"paid\", total: 100 });   // []",
                "checkResponse(orderContract, { id: 42, status: \"lost\", total: 100 });",
                "// [\"campo id: esperado string\", \"status inválido: lost\"]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Uma verificação assim, executada nos testes, avisa quando uma mudança no provedor quebra o que foi " +
                "prometido, antes que o consumidor descubra em produção.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "O contrato inclui o que não foi escrito: se o campo sempre veio ordenado ou nunca veio nulo, alguém já depende disso; qualquer comportamento observável pode virar uma dependência.",
                "Trocar o tipo de um campo (de número para texto), mudar o significado de um valor ou o formato de uma data é breaking change, mesmo que o nome do campo seja o mesmo.",
                "Adicionar um valor a um enum pode quebrar consumidores que só conhecem os anteriores; avise-os para tratarem valores desconhecidos.",
                "O consumidor deve ser tolerante: ignorar campos que não conhece, para que o provedor possa acrescentá-los sem quebrar ninguém (tolerant reader).",
              ],
            },
          ],
          examples: [
            {
              title: "Mudanças compatíveis e incompatíveis",
              context: "Saber classificar uma mudança evita quebrar consumidores sem perceber.",
              code: {
                language: "text",
                filename: "changes.txt",
                code: [
                  "Compatíveis (seguras)                    Incompatíveis (breaking)",
                  "----------------------------------------------------------------------------",
                  "Adicionar um campo opcional na resposta   Remover ou renomear um campo",
                  "Adicionar um endpoint novo                Mudar o tipo de um campo (número → texto)",
                  "Aceitar um parâmetro opcional novo        Tornar obrigatório um parâmetro opcional",
                  "Tornar opcional um campo obrigatório      Restringir os valores aceitos",
                  "                                          Mudar o significado de um status ou de um código",
                ].join("\n"),
              },
              explanation:
                "A regra geral: o provedor pode dar mais do que prometeu, e nunca menos; e pode aceitar mais do que " +
                "exigia, nunca menos.",
            },
            {
              title: "Tolerant reader: ignorar o que não se conhece",
              context: "Um consumidor que quebra diante de um campo novo torna qualquer evolução da API um risco.",
              code: {
                language: "javascript",
                filename: "tolerant-reader.js",
                code: [
                  "// Frágil: falha se a API acrescentar qualquer campo",
                  "function parseStrict(body) {",
                  "  const allowed = [\"id\", \"status\", \"total\"];",
                  "  for (const key of Object.keys(body)) {",
                  "    if (!allowed.includes(key)) throw new Error(`campo inesperado: ${key}`);",
                  "  }",
                  "  return body;",
                  "}",
                  "",
                  "// Tolerante: pega só o que usa, e ignora o resto",
                  "function parseTolerant({ id, status, total }) {",
                  "  return { id, status, total };",
                  "}",
                  "",
                  "parseTolerant({ id: \"42\", status: \"paid\", total: 100, novoCampo: true });   // { id: \"42\", ... }",
                ].join("\n"),
              },
              explanation:
                "O leitor tolerante permite que o provedor acrescente campos sem coordenar com todos os consumidores. " +
                "É a metade do consumidor no acordo de compatibilidade.",
            },
            {
              title: "Pré e pós-condições em uma operação",
              context: "O contrato de uma operação diz o que ela exige e o que garante.",
              code: {
                language: "text",
                filename: "operation-contract.txt",
                code: [
                  "POST /orders",
                  "",
                  "Pré-condições (o que o consumidor precisa garantir):",
                  "  - autenticado, com permissão orders:create",
                  "  - corpo com items (1 a 50 itens), cada um com productId e quantity inteira > 0",
                  "",
                  "Pós-condições (o que o provedor garante em caso de sucesso):",
                  "  - 201 Created, com Location apontando para /orders/{id}",
                  "  - corpo com id, status = \"pending\" e total calculado pelo servidor",
                  "",
                  "Invariantes:",
                  "  - total = soma de (preço atual do produto × quantity)",
                  "  - um pedido nunca tem 0 itens",
                ].join("\n"),
              },
              explanation:
                "É Contract (Programming Fundamentals) em nível de serviço. Escrito assim, serve de base tanto para a " +
                "documentação quanto para os testes de contrato.",
            },
          ],
          exercise: {
            problem:
              "A equipe quer renomear o campo `preco` para `price` e passar o valor de reais (número) para centavos " +
              "(inteiro). Dois consumidores usam a API hoje.",
            problemCode: {
              language: "javascript",
              filename: "rename-field.js",
              code: [
                "// Resposta atual",
                "const current = { id: 1, nome: \"caneta\", preco: 5.5 };",
                "",
                "// Mudança planejada, aplicada de uma vez",
                "const planned = { id: 1, nome: \"caneta\", price: 550 };",
              ].join("\n"),
            },
            task:
              "Classifique a mudança e proponha uma transição compatível: o que a resposta deve conter durante o período " +
              "de migração para que ninguém quebre?",
            hint: "Renomear e mudar a unidade são breaking changes. Acrescente o campo novo sem remover o antigo, e só retire o antigo depois.",
            solution: {
              code: {
                language: "javascript",
                filename: "rename-field.fixed.js",
                code: [
                  "// Fase 1: os dois campos convivem (mudança compatível: só acrescenta)",
                  "function toProductResponse(product) {",
                  "  return {",
                  "    id: product.id,",
                  "    nome: product.name,",
                  "    preco: product.priceInCents / 100,   // antigo: mantido, ainda em reais (deprecado)",
                  "    price: product.priceInCents,         // novo: em centavos",
                  "  };",
                  "}",
                  "",
                  "toProductResponse({ id: 1, name: \"caneta\", priceInCents: 550 });",
                  "// { id: 1, nome: \"caneta\", preco: 5.5, price: 550 }",
                  "",
                  "// Fase 2: avisar os consumidores (documentação e cabeçalhos de depreciação) e medir quem ainda usa `preco`",
                  "// Fase 3: só depois que ninguém mais usar, remover `preco`",
                ].join("\n"),
              },
              explanation:
                "Acrescentar é compatível, e remover não é. Com os dois campos convivendo, cada consumidor migra no seu " +
                "ritmo, e a remoção só acontece quando é segura.",
            },
          },
        }),
        concept({
          order: 30,
          title: "REST",
          requires: ["API"],
          note: "restrições REST, HATEOAS (menção), maturidade de Richardson",
          summary:
            "Um estilo de arquitetura para APIs baseado em recursos identificados por URLs, manipulados por " +
            "meio de representações e de uma interface uniforme sobre HTTP, sem estado entre requisições.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "REST (Representational State Transfer) foi descrito por Roy Fielding como um conjunto de restrições " +
                "que, juntas, fazem sistemas na web escalarem e evoluírem. O eixo é o recurso: uma coisa do domínio, " +
                "como um pedido, com um endereço próprio, que os clientes manipulam trocando representações dela " +
                "(em geral JSON) com os métodos HTTP. Muitas APIs chamadas de \"REST\" seguem só parte das " +
                "restrições, e o termo é usado de forma mais frouxa no dia a dia.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Pense em recursos com endereços e nas ações padrão do HTTP sobre eles: o significado vem dos " +
                "métodos e dos status, e não de nomes de operações inventados a cada endpoint.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Cliente-servidor: as responsabilidades ficam separadas.",
                "Sem estado (stateless): cada requisição leva tudo de que o servidor precisa; a sessão não vive no servidor.",
                "Cacheável: as respostas dizem se podem ser guardadas em cache, o que reduz a carga.",
                "Interface uniforme: recursos identificados por URLs, manipulados por representações, com mensagens autodescritivas (métodos, status e `Content-Type`) e, no ideal, hipermídia (HATEOAS: a resposta traz os links das próximas ações possíveis).",
                "Sistema em camadas: proxies, caches e gateways ficam entre cliente e servidor sem que ele perceba.",
              ],
            },
            {
              type: "paragraph",
              text:
                "O modelo de maturidade de Richardson descreve o quanto uma API se aproxima disso: nível 0, um único " +
                "endpoint para tudo; nível 1, recursos com URLs próprias; nível 2, uso correto dos métodos HTTP e dos " +
                "status; nível 3, hipermídia. A maior parte das APIs de mercado está no nível 2.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma funcionalidade em um estilo de chamada de procedimento e em um estilo REST:" },
            {
              type: "code",
              language: "javascript",
              filename: "rest.js",
              code: [
                "// Estilo RPC (nível 0): um endpoint, e a ação vai no nome ou no corpo",
                "await fetch(\"/api\", { method: \"POST\", body: JSON.stringify({ action: \"getOrder\", id: 42 }) });",
                "await fetch(\"/api\", { method: \"POST\", body: JSON.stringify({ action: \"cancelOrder\", id: 42 }) });",
                "",
                "// REST (nível 2): recursos e métodos",
                "await fetch(\"/orders/42\");                                        // ler",
                "await fetch(\"/orders\", { method: \"POST\", body: \"{...}\" });      // criar → 201 + Location",
                "await fetch(\"/orders/42\", { method: \"DELETE\" });                // apagar → 204",
                "",
                "// Nível 3 (HATEOAS): a resposta indica o que se pode fazer a seguir",
                "// { \"id\": 42, \"status\": \"pending\",",
                "//   \"links\": { \"self\": \"/orders/42\", \"cancel\": \"/orders/42/cancellation\", \"pay\": \"/orders/42/payment\" } }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "No estilo REST, ferramentas genéricas, como caches, proxies e clientes HTTP, entendem o que cada " +
                "chamada faz, porque o significado está no método e no status.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Chamar de REST qualquer API que usa JSON sobre HTTP: sem recursos, métodos com significado e sem estado, é só uma API HTTP.",
                "Tratar REST como uma regra rígida: nem toda operação é um CRUD, e há ações (cancelar, aprovar) que exigem modelagem cuidadosa.",
                "Guardar a sessão no servidor viola a ausência de estado e dificulta escalar horizontalmente; a identificação deve viajar na requisição.",
                "Perseguir o nível 3 sem consumidores que aproveitem os links: HATEOAS custa esforço, e a maioria das APIs se contenta com o nível 2.",
              ],
            },
          ],
          examples: [
            {
              title: "Sem estado: a identificação viaja em cada requisição",
              context: "O servidor não lembra do cliente entre chamadas; por isso qualquer instância pode atender qualquer pedido.",
              code: {
                language: "javascript",
                filename: "stateless-rest.js",
                code: [
                  "// Cada requisição é autossuficiente",
                  "await fetch(\"/orders\", { headers: { authorization: \"Bearer token-da-ana\" } });",
                  "await fetch(\"/orders/42\", { headers: { authorization: \"Bearer token-da-ana\" } });",
                  "",
                  "// Duas instâncias do servidor, atrás de um balanceador, respondem igualmente bem:",
                  "// nada da chamada anterior precisa estar na memória de quem atende.",
                ].join("\n"),
              },
              explanation:
                "Sem estado no servidor, escalar é acrescentar máquinas. É uma das restrições que mais pesam na escala " +
                "das APIs na web.",
            },
            {
              title: "Métodos e status com significado",
              context: "O contrato é lido no que o HTTP já define, e não em documentação inventada por endpoint.",
              code: {
                language: "javascript",
                filename: "methods-and-status.js",
                code: [
                  "// Criar: POST na coleção → 201 Created + Location",
                  "// Ler: GET no item → 200 (ou 404)",
                  "// Substituir: PUT no item → 200 ou 204",
                  "// Alterar parte: PATCH no item → 200",
                  "// Apagar: DELETE no item → 204",
                  "",
                  "const routes = [",
                  "  { method: \"GET\",    path: \"/orders\",     success: 200 },",
                  "  { method: \"POST\",   path: \"/orders\",     success: 201 },",
                  "  { method: \"GET\",    path: \"/orders/:id\", success: 200 },",
                  "  { method: \"PATCH\",  path: \"/orders/:id\", success: 200 },",
                  "  { method: \"DELETE\", path: \"/orders/:id\", success: 204 },",
                  "];",
                ].join("\n"),
              },
              explanation:
                "Quem conhece HTTP adivinha a maior parte da API sem ler nada. É a vantagem da interface uniforme.",
            },
            {
              title: "Ações que não são CRUD",
              context: "Nem tudo se resume a criar, ler, atualizar e apagar; a ação pode virar um recurso.",
              code: {
                language: "javascript",
                filename: "non-crud.js",
                code: [
                  "// Em vez de um verbo no endereço:",
                  "//   POST /orders/42/cancel",
                  "",
                  "// Modelar o resultado da ação como um recurso:",
                  "await fetch(\"/orders/42/cancellation\", { method: \"POST\" });   // cria o cancelamento → 201",
                  "await fetch(\"/orders/42/cancellation\");                        // consulta o motivo e a data",
                  "",
                  "// Ou tratar o estado como parte do recurso:",
                  "await fetch(\"/orders/42\", { method: \"PATCH\", body: JSON.stringify({ status: \"cancelled\" }) });",
                ].join("\n"),
              },
              explanation:
                "As duas formas são aceitas na prática. O importante é que a escolha seja consistente e que as regras " +
                "de negócio, como \"pedido enviado não cancela\", sejam aplicadas do lado do servidor.",
            },
          ],
          exercise: {
            problem:
              "A API atual usa um único endpoint `POST /api` e recebe a operação no corpo. Os caches e as " +
              "ferramentas de monitoramento não entendem nada das chamadas, e todas aparecem como \"POST /api\".",
            problemCode: {
              language: "javascript",
              filename: "rpc-api.js",
              code: [
                "// Todas as chamadas são POST /api, distinguidas só pelo corpo",
                "{ action: \"listBooks\" }",
                "{ action: \"getBook\", id: 7 }",
                "{ action: \"createBook\", title: \"Dom Casmurro\" }",
                "{ action: \"deleteBook\", id: 7 }",
              ].join("\n"),
            },
            task:
              "Redesenhe como uma API REST de nível 2: liste os métodos, os endereços e os status de sucesso para " +
              "cada uma das quatro operações.",
            hint: "O recurso é `books`. Listar e criar atuam na coleção, e ler e apagar atuam em um item.",
            solution: {
              code: {
                language: "javascript",
                filename: "rest-api.fixed.js",
                code: [
                  "const routes = [",
                  "  { operation: \"listBooks\",  method: \"GET\",    path: \"/books\",     success: 200 },",
                  "  { operation: \"getBook\",    method: \"GET\",    path: \"/books/7\",   success: 200 },",
                  "  { operation: \"createBook\", method: \"POST\",   path: \"/books\",     success: 201 },   // + Location: /books/8",
                  "  { operation: \"deleteBook\", method: \"DELETE\", path: \"/books/7\",   success: 204 },",
                  "];",
                  "",
                  "// Agora GET /books e GET /books/7 são cacheáveis, e o monitoramento vê cada operação separadamente.",
                ].join("\n"),
              },
              explanation:
                "O método e o endereço passaram a dizer a operação, e os caches, proxies e ferramentas de monitoramento " +
                "entendem cada chamada. O `POST` de criação responde 201 com o `Location` do novo livro.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Resource Modeling & RESTful URLs",
          requires: ["REST"],
          subtopics: ["recursos como substantivos", "coleção × item", "aninhamento/hierarquia", "path × query param"],
          note: "consolidada (A15)",
          summary:
            "Como transformar os conceitos do domínio em recursos com endereços claros: substantivos no plural, " +
            "coleção e item, hierarquia com moderação, e a diferença entre o que identifica (caminho) e o que " +
            "refina (consulta).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Modelar recursos é decidir quais são as \"coisas\" que a API expõe e como cada uma é endereçada. " +
                "O endereço é um substantivo, e o verbo é o método HTTP: `GET /orders/42`, e não `GET /getOrder?id=42`. " +
                "Uma coleção (`/orders`) agrupa os itens, e um item (`/orders/42`) é identificado pelo seu id. " +
                "Relações fortes viram hierarquia (`/orders/42/items`), e filtros, ordenação e paginação vão na consulta " +
                "(`?status=paid`).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O caminho identifica um recurso, a consulta o refina: substantivos no plural, coleções e itens, e " +
                "os verbos ficam por conta do método HTTP.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Endereços previsíveis fazem a API ser aprendida por analogia: quem viu `/orders` e `/orders/42` " +
                "adivinha `/customers` e `/customers/7`. Nomes ruins, com verbos, inconsistências de plural e " +
                "hierarquias fundas, obrigam a consultar a documentação a cada chamada e são difíceis de corrigir depois " +
                "de publicados, porque os consumidores dependem deles.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "os endereços de uma loja, com as regras de modelagem aplicadas:" },
            {
              type: "code",
              language: "text",
              filename: "urls.txt",
              code: [
                "GET    /customers                      lista de clientes (coleção)",
                "POST   /customers                      cria um cliente",
                "GET    /customers/7                    um cliente (item)",
                "PATCH  /customers/7                    altera parte do cliente",
                "GET    /customers/7/orders             pedidos DO cliente 7 (relação forte, 1 nível)",
                "GET    /orders?customerId=7&status=paid   os mesmos pedidos, filtrados na consulta",
                "GET    /orders/42                      um pedido (acessível direto, sem depender do cliente)",
                "POST   /orders/42/cancellation         uma ação, modelada como recurso",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "routing.js",
              code: [
                "// Casando um endereço com o padrão de rota, extraindo os parâmetros de caminho",
                "function match(pattern, path) {",
                "  const names = [];",
                "  const regex = new RegExp(\"^\" + pattern.replace(/:(\\w+)/g, (_, name) => { names.push(name); return \"([^/]+)\"; }) + \"$\");",
                "  const result = regex.exec(path);",
                "  return result ? Object.fromEntries(names.map((name, i) => [name, result[i + 1]])) : null;",
                "}",
                "",
                "match(\"/customers/:customerId/orders/:orderId\", \"/customers/7/orders/42\");",
                "// { customerId: \"7\", orderId: \"42\" }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Os parâmetros de caminho identificam quem, e os de consulta dizem como listar. O `/orders/42` " +
                "continua acessível diretamente, sem obrigar a conhecer o cliente.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Verbos no endereço, como `/getOrders` ou `/createUser`, duplicam o que o método HTTP já diz e criam inconsistências.",
                "Misturar singular e plural (`/order` e `/customers`) obriga a lembrar de cada caso; escolha um padrão, em geral o plural.",
                "Aninhar muito, como `/customers/7/orders/42/items/3/product`, cria endereços frágeis; um ou dois níveis bastam, e recursos independentes podem ter endereço próprio.",
                "Colocar filtros no caminho (`/orders/paid/2026`) em vez de na consulta faz a combinação de filtros virar uma explosão de rotas.",
                "Expor ids sequenciais previsíveis pode facilitar a enumeração; a autorização por recurso é indispensável, e ids opacos ajudam.",
              ],
            },
          ],
          examples: [
            {
              title: "Do verbo para o substantivo",
              context: "Trocar nomes de operação por recursos e métodos deixa a API previsível.",
              code: {
                language: "text",
                filename: "verbs-to-nouns.txt",
                code: [
                  "Evitar                        Preferir",
                  "----------------------------------------------------------",
                  "GET  /getAllUsers             GET    /users",
                  "POST /createUser              POST   /users",
                  "POST /deleteUser?id=7         DELETE /users/7",
                  "GET  /findUserByEmail?e=a@x   GET    /users?email=a@x.com",
                  "POST /activateUser/7          POST   /users/7/activation",
                ].join("\n"),
              },
              explanation:
                "O método HTTP substitui o verbo, e os filtros vão na consulta. Só as ações sem equivalente natural, " +
                "como a ativação, viram um recurso próprio.",
            },
            {
              title: "Caminho identifica, consulta refina",
              context: "Decidir onde cada informação vai evita rotas demais e mantém a API coerente.",
              code: {
                language: "javascript",
                filename: "path-vs-query.js",
                code: [
                  "// Identifica QUAL recurso: caminho",
                  "await fetch(\"/orders/42\");",
                  "",
                  "// Refina COMO listar: consulta",
                  "await fetch(\"/orders?status=paid&sort=-createdAt&limit=20\");",
                  "",
                  "// Errado: filtro no caminho gera uma rota para cada combinação",
                  "// /orders/paid   /orders/paid/latest   /orders/paid/customer/7 ...",
                ].join("\n"),
              },
              explanation:
                "Com filtros na consulta, uma única rota de coleção atende todas as combinações. O caminho fica " +
                "reservado para identificar recursos.",
            },
            {
              title: "Quando aninhar e quando não",
              context: "A hierarquia expressa pertencimento, mas não deve ser levada longe demais.",
              code: {
                language: "text",
                filename: "nesting.txt",
                code: [
                  "Bom (pertencimento claro, um nível):",
                  "  GET /orders/42/items            itens que só existem dentro do pedido",
                  "",
                  "Frágil (profundo demais):",
                  "  GET /customers/7/orders/42/items/3/product/reviews",
                  "",
                  "Melhor: recursos que têm identidade própria ganham o seu endereço",
                  "  GET /products/9/reviews         em vez de descer pela cadeia de pedidos",
                ].join("\n"),
              },
              explanation:
                "Quando um recurso tem vida independente, ele merece uma rota de primeiro nível. A hierarquia serve " +
                "para o que só existe dentro de outro.",
            },
          ],
          exercise: {
            problem:
              "A API de uma biblioteca tem endereços inconsistentes: verbos, singular e plural misturados e filtros " +
              "no caminho.",
            problemCode: {
              language: "text",
              filename: "library-api.txt",
              code: [
                "GET  /getBooks",
                "GET  /book/7",
                "POST /addBook",
                "GET  /books/available",
                "POST /borrowBook?bookId=7&memberId=3",
                "GET  /getLoansForMember/3",
              ].join("\n"),
            },
            task:
              "Reescreva cada linha com substantivos no plural, o método HTTP correto e os filtros na consulta. " +
              "Modele o empréstimo como um recurso.",
            hint: "`books`, `members` e `loans` são recursos. \"Disponíveis\" é um filtro, e emprestar cria um `loan`.",
            solution: {
              code: {
                language: "text",
                filename: "library-api.fixed.txt",
                code: [
                  "GET  /books                      (era GET /getBooks)",
                  "GET  /books/7                    (era GET /book/7)",
                  "POST /books                      (era POST /addBook)",
                  "GET  /books?available=true       (era GET /books/available)",
                  "POST /loans                      (era POST /borrowBook?...)   corpo: { bookId: 7, memberId: 3 }",
                  "GET  /members/3/loans            (era GET /getLoansForMember/3)   ou GET /loans?memberId=3",
                ].join("\n"),
              },
              explanation:
                "Todos os recursos são substantivos no plural, os verbos saíram, e o filtro de disponibilidade foi para a " +
                "consulta. O empréstimo virou um recurso `loans`, criado com POST.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Request Validation",
          requires: ["REST"],
          note: "validação do contrato/boundary da API: shape, tipos, campos obrigatórios, formato. Pointer para Application Security / Input Validation (não revisitOf)",
          collision: "≠ Application Security / Input Validation — validar o contrato de API × defender contra entrada maliciosa (conceitos distintos)",
          revisit: ["Platform / Application Security / Input Validation"],
          summary:
            "Conferir, na entrada da API, se a requisição cumpre o contrato — campos obrigatórios, tipos, " +
            "formatos e limites — e recusá-la com uma mensagem clara antes que chegue à lógica de negócio.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A validação de requisição é a guarda da fronteira: antes de executar qualquer regra, a API checa se o " +
                "que chegou tem a forma prometida no contrato: os campos obrigatórios estão presentes, os tipos e " +
                "formatos estão certos, os valores estão dentro dos limites. Se não estiverem, responde 400 (ou 422) " +
                "com a lista do que está errado. Não é o mesmo que a defesa contra entrada maliciosa (Input Validation, " +
                "em Application Security): aquela trata de segurança, e esta, de contrato.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Valide na borda, antes da lógica de negócio, e diga com precisão o que está errado: o restante do " +
                "código pode assumir que os dados já têm a forma certa.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Um esquema descreve a forma esperada. A validação percorre o corpo, acumula todos os problemas, e não " +
                "só o primeiro, e devolve a lista. Só quando não há problemas o dado segue para a lógica de negócio, " +
                "já em uma forma limpa, com os campos desconhecidos descartados.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "validation.js",
              code: [
                "const createUserSchema = {",
                "  name: { type: \"string\", required: true, min: 2, max: 80 },",
                "  email: { type: \"string\", required: true, pattern: /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/ },",
                "  age: { type: \"number\", integer: true, min: 0, max: 130 },",
                "};",
                "",
                "function validate(schema, body) {",
                "  const errors = [];",
                "  const clean = {};",
                "",
                "  for (const [field, rule] of Object.entries(schema)) {",
                "    const value = body?.[field];",
                "    if (value === undefined) {",
                "      if (rule.required) errors.push({ field, message: \"obrigatório\" });",
                "      continue;",
                "    }",
                "    if (typeof value !== rule.type) { errors.push({ field, message: `deve ser ${rule.type}` }); continue; }",
                "    if (rule.integer && !Number.isInteger(value)) errors.push({ field, message: \"deve ser inteiro\" });",
                "    if (rule.min !== undefined && (rule.type === \"string\" ? value.length : value) < rule.min) errors.push({ field, message: `mínimo ${rule.min}` });",
                "    if (rule.max !== undefined && (rule.type === \"string\" ? value.length : value) > rule.max) errors.push({ field, message: `máximo ${rule.max}` });",
                "    if (rule.pattern && !rule.pattern.test(value)) errors.push({ field, message: \"formato inválido\" });",
                "    clean[field] = value;   // só os campos conhecidos entram; os outros são descartados",
                "  }",
                "  return { errors, value: clean };",
                "}",
                "",
                "validate(createUserSchema, { name: \"A\", email: \"nao-e-email\", role: \"admin\" });",
                "// errors: [{ field: \"name\", message: \"mínimo 2\" }, { field: \"email\", message: \"formato inválido\" }]",
                "// e o campo `role`, desconhecido, nem chega em `value`",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na prática, muitos projetos usam bibliotecas como Zod, Joi ou Ajv, que fazem o mesmo com mais recursos. " +
                "O princípio é o mesmo: descrever o contrato uma vez e aplicá-lo na entrada.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em todo endpoint que recebe dados de fora: corpo, parâmetros de caminho, consulta e cabeçalhos.",
                "Para dar ao consumidor mensagens acionáveis, apontando o campo e o problema, em vez de um erro genérico ou de um 500 mais adiante.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Validar o formato não valida a regra de negócio: \"o e-mail é bem formado\" é uma coisa, e \"o e-mail já está cadastrado\" é outra, que depende de estado e fica na camada de negócio.",
                "Não substitui a segurança: escapar e parametrizar consultas, e limitar tamanhos, continuam necessários (Input Validation).",
                "Esquemas duplicados, um por camada, divergem com o tempo; mantenha o esquema como fonte única, e gere a documentação a partir dele quando possível.",
                "Validar demais na borda, com regras de negócio complexas, mistura responsabilidades e dificulta reaproveitar a regra fora da API.",
              ],
            },
          ],
          examples: [
            {
              title: "Devolver todos os erros de uma vez",
              context: "Apontar só o primeiro problema obriga o consumidor a corrigir e tentar de novo, várias vezes.",
              code: {
                language: "javascript",
                filename: "all-errors.js",
                code: [
                  "function respond(schema, body) {",
                  "  const { errors, value } = validate(schema, body);",
                  "  if (errors.length > 0) {",
                  "    return { status: 422, body: { title: \"Dados inválidos\", errors } };",
                  "  }",
                  "  return { status: 201, body: value };",
                  "}",
                  "",
                  "respond(createUserSchema, { name: \"\", email: \"x\" });",
                  "// 422, com um erro para `name` E um para `email`, de uma só vez",
                ].join("\n"),
              },
              explanation:
                "Quem consome corrige tudo em uma rodada. A resposta lista campo e problema, em um formato que uma " +
                "interface consegue mostrar ao lado de cada campo.",
            },
            {
              title: "Validação como middleware",
              context: "Aplicar o esquema em um só lugar mantém os controladores livres de checagens.",
              code: {
                language: "javascript",
                filename: "validation-middleware.js",
                code: [
                  "function validateBody(schema) {",
                  "  return (request, response, next) => {",
                  "    const { errors, value } = validate(schema, request.body);",
                  "    if (errors.length > 0) return response.status(422).json({ errors });",
                  "    request.body = value;   // a partir daqui, só dados válidos e limpos",
                  "    next();",
                  "  };",
                  "}",
                  "",
                  "app.post(\"/users\", validateBody(createUserSchema), (request, response) => {",
                  "  // aqui o controlador não precisa checar nada do formato",
                  "  response.status(201).json(createUser(request.body));",
                  "});",
                ].join("\n"),
              },
              explanation:
                "O controlador assume dados válidos, e o esquema fica declarado ao lado da rota. Ligar-se a um esquema " +
                "também abre caminho para gerar a documentação.",
            },
            {
              title: "Formato não é regra de negócio",
              context: "A validação de contrato e a de negócio acontecem em momentos e camadas diferentes.",
              code: {
                language: "javascript",
                filename: "format-vs-business.js",
                code: [
                  "// Borda da API (contrato): o e-mail parece um e-mail? → 422 se não",
                  "const { errors, value } = validate(createUserSchema, request.body);",
                  "",
                  "// Camada de negócio (regra): o e-mail já está cadastrado? → 409 se sim",
                  "if (await users.existsByEmail(value.email)) {",
                  "  throw new ConflictError(\"e-mail já cadastrado\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A primeira checagem só olha a forma do dado. A segunda consulta o estado do sistema, e por isso " +
                "pertence ao domínio, com um status diferente (409).",
            },
          ],
          exercise: {
            problem:
              "O endpoint de criação de produto usa `body.price` diretamente. Se o cliente enviar `\"abc\"`, `-5` ou nada, " +
              "o erro aparece só no banco, como um 500 sem explicação.",
            problemCode: {
              language: "javascript",
              filename: "create-product.js",
              code: [
                "function createProduct(body) {",
                "  return db.insert(\"products\", { name: body.name, price: body.price });",
                "}",
              ].join("\n"),
            },
            task:
              "Valide o corpo: `name` obrigatório (texto, 1 a 100 caracteres) e `price` obrigatório (número maior ou " +
              "igual a zero). Devolva 422 com a lista de erros, ou 201 com os dados limpos.",
            hint: "Acumule os erros em um array e só chame o banco se estiver vazio. Ignore campos que não estão no esquema.",
            solution: {
              code: {
                language: "javascript",
                filename: "create-product.fixed.js",
                code: [
                  "function validateProduct(body = {}) {",
                  "  const errors = [];",
                  "",
                  "  if (typeof body.name !== \"string\" || body.name.length < 1 || body.name.length > 100) {",
                  "    errors.push({ field: \"name\", message: \"obrigatório, texto de 1 a 100 caracteres\" });",
                  "  }",
                  "  if (typeof body.price !== \"number\" || Number.isNaN(body.price) || body.price < 0) {",
                  "    errors.push({ field: \"price\", message: \"obrigatório, número maior ou igual a zero\" });",
                  "  }",
                  "",
                  "  return errors.length > 0",
                  "    ? { status: 422, body: { errors } }",
                  "    : { status: 201, body: { name: body.name, price: body.price } };   // só os campos conhecidos",
                  "}",
                  "",
                  "validateProduct({ name: \"\", price: \"abc\", admin: true });   // 422, com erros para name e price",
                  "validateProduct({ name: \"caneta\", price: 5, admin: true });   // 201, e `admin` foi descartado",
                ].join("\n"),
              },
              explanation:
                "O cliente recebe uma resposta clara em vez de um 500. O banco só vê dados no formato esperado, e campos " +
                "extras, como `admin`, não passam da borda.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Response Design",
          requires: ["REST"],
          note: "envelope, status coerente, Location em criação",
          summary:
            "Como estruturar as respostas de uma API de forma consistente: formato do corpo, envelope, status " +
            "coerente com o resultado, datas e identificadores padronizados, e o que se devolve em cada operação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A resposta é a metade da API que o consumidor mais lê. Projetá-la bem significa ser previsível: o " +
                "mesmo tipo de operação devolve sempre a mesma forma, os status dizem o que aconteceu, e os campos " +
                "seguem convenções únicas. Decisões típicas: devolver o objeto diretamente ou dentro de um " +
                "envelope (`{ data, meta }`), o que responder após criar (201, o recurso e `Location`), e como " +
                "representar datas, valores monetários e ausências.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Consistência é o que faz uma API ser aprendida uma vez: mesma forma, mesmas convenções e status " +
                "coerentes em todos os endpoints.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Criação: `201 Created`, com o recurso criado no corpo e o cabeçalho `Location` com o seu endereço.",
                "Consulta: `200 OK` com o recurso; coleções devolvem uma lista (dentro de um envelope quando há metadados, como paginação).",
                "Alteração e exclusão: `200` com o recurso atualizado, ou `204 No Content` sem corpo.",
                "Datas em ISO 8601 e em UTC (`2026-03-01T10:00:00Z`); valores monetários em unidades inteiras (centavos) ou como texto, e não em ponto flutuante.",
                "Uma convenção única de nomes de campos (`camelCase` ou `snake_case`) e de tratamento de campos ausentes (omitir ou `null`).",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um servidor que aplica as convenções de resposta para uma criação e para uma listagem:" },
            {
              type: "code",
              language: "javascript",
              filename: "response-design.js",
              code: [
                "function created(response, resource, path) {",
                "  response.writeHead(201, { \"content-type\": \"application/json\", location: path });",
                "  response.end(JSON.stringify(resource));",
                "}",
                "",
                "function list(response, items, { total, limit, offset }) {",
                "  response.writeHead(200, { \"content-type\": \"application/json\" });",
                "  response.end(JSON.stringify({",
                "    data: items,                       // a lista, sempre em `data`",
                "    meta: { total, limit, offset },    // metadados, separados dos dados",
                "  }));",
                "}",
                "",
                "// POST /orders  →  201 Created",
                "//   Location: /orders/42",
                "//   { \"id\": \"42\", \"status\": \"pending\", \"total\": 1990, \"createdAt\": \"2026-03-01T10:00:00Z\" }",
                "//",
                "// GET /orders  →  200 OK",
                "//   { \"data\": [ { \"id\": \"42\", ... } ], \"meta\": { \"total\": 1, \"limit\": 20, \"offset\": 0 } }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As listagens têm um envelope, porque precisam de metadados. Os itens individuais vêm sem envelope, " +
                "e todos os endereços e datas seguem o mesmo padrão.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Devolver um array puro em uma listagem impede acrescentar depois metadados, como paginação, sem quebrar o contrato; um envelope desde o início evita essa migração.",
                "Formatos de data ambíguos, como `03/04/2026`, ou sem fuso, levam a erros silenciosos; use ISO 8601 em UTC.",
                "Valores monetários em ponto flutuante (`19.9`) acumulam erros de arredondamento; use centavos como inteiro, ou texto decimal.",
                "Ids numéricos grandes podem perder precisão em JavaScript (acima de 2^53); envie ids como texto quando houver risco.",
                "Alternar entre omitir um campo e enviá-lo como `null` sem regra obriga os consumidores a tratarem os dois casos.",
              ],
            },
          ],
          examples: [
            {
              title: "Coerência entre status e corpo",
              context: "O status e o corpo devem contar a mesma história.",
              code: {
                language: "text",
                filename: "coherence.txt",
                code: [
                  "Coerente:",
                  "  POST /orders  → 201, corpo com o pedido, Location: /orders/42",
                  "  DELETE /orders/42 → 204, sem corpo",
                  "  GET /orders/999 → 404, corpo com o erro",
                  "",
                  "Incoerente:",
                  "  POST /orders  → 200, corpo { \"success\": true }      (sem o recurso nem o Location)",
                  "  DELETE /orders/42 → 200, corpo { \"deleted\": true }  (204 diz o mesmo, sem corpo)",
                  "  GET /orders/999 → 200, corpo { \"order\": null }      (o status mente)",
                ].join("\n"),
              },
              explanation:
                "Quando o status é honesto, clientes e ferramentas decidem sem ler o corpo. A criação devolve o recurso " +
                "para que o cliente não precise pedi-lo de novo.",
            },
            {
              title: "Dinheiro e datas",
              context: "Tipos que parecem simples são fonte de bugs de arredondamento e de fuso horário.",
              code: {
                language: "javascript",
                filename: "money-and-dates.js",
                code: [
                  "// Ponto flutuante acumula erros",
                  "0.1 + 0.2;   // 0.30000000000000004",
                  "",
                  "// Centavos como inteiros: exato",
                  "const price = 1990;                      // R$ 19,90",
                  "const total = price * 3;                 // 5970, exato",
                  "",
                  "// Datas: ISO 8601 em UTC, sempre",
                  "new Date(\"2026-03-01T10:00:00Z\").toISOString();   // \"2026-03-01T10:00:00.000Z\"",
                  "",
                  "// Resposta: { \"total\": 5970, \"currency\": \"BRL\", \"createdAt\": \"2026-03-01T10:00:00Z\" }",
                ].join("\n"),
              },
              explanation:
                "O inteiro em centavos não tem erro de arredondamento, e a data em UTC não depende do fuso de quem lê. " +
                "A moeda vai em um campo à parte.",
            },
            {
              title: "O envelope que permite evoluir",
              context: "Um array puro não tem onde guardar metadados; um envelope, sim.",
              code: {
                language: "javascript",
                filename: "envelope.js",
                code: [
                  "// v1: array puro. Para acrescentar paginação, o formato mudaria (breaking change)",
                  "// [ { \"id\": 1 }, { \"id\": 2 } ]",
                  "",
                  "// Com envelope, dá para acrescentar depois sem quebrar quem lê `data`",
                  "// { \"data\": [ { \"id\": 1 }, { \"id\": 2 } ] }",
                  "// { \"data\": [ ... ], \"meta\": { \"nextCursor\": \"abc\" } }   ← evolução compatível",
                  "",
                  "const items = response.data;   // continua funcionando nas duas versões",
                ].join("\n"),
              },
              explanation:
                "O envelope custa um nível de aninhamento e compra a possibilidade de evoluir a listagem sem versionar " +
                "a API.",
            },
          ],
          exercise: {
            problem:
              "O endpoint de criar pedido responde `200 { \"success\": true }`. O cliente precisa fazer um segundo GET " +
              "para descobrir o id, e a listagem devolve um array puro.",
            problemCode: {
              language: "javascript",
              filename: "orders-responses.js",
              code: [
                "function createOrder(data) {",
                "  const order = save(data);",
                "  return { status: 200, body: { success: true } };",
                "}",
                "",
                "function listOrders() {",
                "  return { status: 200, body: allOrders() };   // array puro",
                "}",
              ].join("\n"),
            },
            task:
              "Corrija a criação (201, o pedido no corpo, `Location`) e a listagem (envelope com `data` e `meta.total`).",
            hint: "A criação precisa de um cabeçalho `location` com `/orders/{id}`. A listagem devolve `{ data, meta }`.",
            solution: {
              code: {
                language: "javascript",
                filename: "orders-responses.fixed.js",
                code: [
                  "function createOrder(data) {",
                  "  const order = save(data);",
                  "  return {",
                  "    status: 201,",
                  "    headers: { location: `/orders/${order.id}` },",
                  "    body: order,",
                  "  };",
                  "}",
                  "",
                  "function listOrders() {",
                  "  const orders = allOrders();",
                  "  return { status: 200, body: { data: orders, meta: { total: orders.length } } };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O cliente recebe o pedido e o seu endereço na própria criação, sem uma segunda chamada. A listagem já " +
                "tem um lugar para os metadados, o que permite evoluir sem quebrar o contrato.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Error Response Design",
          requires: ["Response Design"],
          note: "revisita Software Craft / Error Handling / Result Pattern; RFC 7807 (problem+json)",
          revisit: ["Software Craft / Error Handling / Result Pattern"],
          summary:
            "Como uma API comunica falhas: um formato único e legível por máquina, com o status correto, um " +
            "código estável, uma mensagem útil e os detalhes por campo — sem vazar o que é interno.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Toda API falha, e o consumidor precisa entender a falha para reagir: corrigir o pedido, tentar de " +
                "novo, ou mostrar algo ao usuário. Um bom design de erro usa o status HTTP certo, um corpo com formato " +
                "único em todos os endpoints e um identificador estável do tipo de erro. A RFC 7807 (atualizada pela " +
                "RFC 9457) padroniza isso como `application/problem+json`, com os campos `type`, `title`, `status`, " +
                "`detail` e `instance`, além de extensões. É a versão de rede do Result Pattern (Error Handling): " +
                "erros como valores previstos, e não como surpresas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um erro é parte do contrato: o mesmo formato em toda a API, um código estável para as máquinas e uma " +
                "mensagem clara para as pessoas, sem detalhes internos.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "`type`: um identificador estável (geralmente uma URL) do tipo de problema, em que os clientes se baseiam no código.",
                "`title`: um resumo curto e fixo do tipo; `detail`: a explicação desta ocorrência.",
                "`status`: o mesmo código HTTP da resposta.",
                "Extensões: por exemplo, `errors` (a lista de problemas por campo) ou `requestId` (para localizar o caso nos logs).",
                "Erros de cliente (4xx) explicam o que corrigir; erros de servidor (5xx) devolvem uma mensagem genérica e registram o detalhe nos logs.",
              ],
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função que transforma erros de domínio em respostas `problem+json` consistentes:" },
            {
              type: "code",
              language: "javascript",
              filename: "problem-json.js",
              code: [
                "import { randomUUID } from \"node:crypto\";",
                "",
                "class ApiError extends Error {",
                "  constructor(status, type, title, detail, extra = {}) {",
                "    super(detail);",
                "    Object.assign(this, { status, type, title, detail, extra });",
                "  }",
                "}",
                "",
                "function toProblem(error, requestId = randomUUID()) {",
                "  if (error instanceof ApiError) {",
                "    return {",
                "      status: error.status,",
                "      headers: { \"content-type\": \"application/problem+json\" },",
                "      body: {",
                "        type: `https://api.exemplo.com/problemas/${error.type}`,",
                "        title: error.title,",
                "        status: error.status,",
                "        detail: error.detail,",
                "        requestId,",
                "        ...error.extra,",
                "      },",
                "    };",
                "  }",
                "  // Inesperado: mensagem genérica na resposta, e o detalhe vai para o log",
                "  console.error(requestId, error);",
                "  return {",
                "    status: 500,",
                "    headers: { \"content-type\": \"application/problem+json\" },",
                "    body: { type: \"about:blank\", title: \"Erro interno\", status: 500, requestId },",
                "  };",
                "}",
                "",
                "toProblem(new ApiError(422, \"validacao\", \"Dados inválidos\", \"O corpo tem 1 erro\", {",
                "  errors: [{ field: \"email\", message: \"formato inválido\" }],",
                "})).body;",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O consumidor decide pelo `type` e pelo `status`, e mostra o `detail`. Nas falhas inesperadas, o " +
                "`requestId` é a ponte entre a resposta e o log com o detalhe real.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Devolver o stack trace, o SQL ou o nome de uma tabela vaza a implementação e ajuda um atacante; erros 5xx devem ter uma mensagem genérica.",
                "Erros que só têm uma mensagem em texto obrigam o cliente a comparar strings; um código estável (`type`) é o que se pode usar em `if`.",
                "Formatos de erro diferentes em endpoints diferentes obrigam a um tratamento por endpoint; centralize a conversão em um só ponto.",
                "Mensagens traduzidas ou reescritas não devem ser o contrato: o código é estável, e o texto pode mudar.",
                "Sem um identificador de requisição, é difícil ligar a queixa de um usuário ao erro nos logs.",
              ],
            },
          ],
          examples: [
            {
              title: "Erros de validação por campo",
              context: "Uma lista estruturada permite que a interface mostre cada mensagem junto do campo certo.",
              code: {
                language: "text",
                filename: "validation-problem.txt",
                code: [
                  "HTTP/1.1 422 Unprocessable Content",
                  "Content-Type: application/problem+json",
                  "",
                  "{",
                  "  \"type\": \"https://api.exemplo.com/problemas/validacao\",",
                  "  \"title\": \"Dados inválidos\",",
                  "  \"status\": 422,",
                  "  \"detail\": \"2 campos inválidos\",",
                  "  \"requestId\": \"9f1c...\",",
                  "  \"errors\": [",
                  "    { \"field\": \"email\", \"message\": \"formato inválido\" },",
                  "    { \"field\": \"age\",   \"message\": \"deve ser maior ou igual a 0\" }",
                  "  ]",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A resposta tem tudo o que um cliente precisa: o tipo para decidir, os erros por campo para exibir e o " +
                "`requestId` para suporte.",
            },
            {
              title: "O cliente decide pelo tipo, e não pelo texto",
              context: "Reagir ao `type` e ao `status` mantém o cliente funcionando quando as mensagens mudam.",
              code: {
                language: "javascript",
                filename: "client-handling.js",
                code: [
                  "const response = await fetch(\"/orders\", { method: \"POST\", body: JSON.stringify(order) });",
                  "",
                  "if (!response.ok) {",
                  "  const problem = await response.json();",
                  "",
                  "  if (problem.type.endsWith(\"/estoque-insuficiente\")) return showStockWarning(problem.detail);",
                  "  if (response.status === 422) return showFieldErrors(problem.errors);",
                  "  if (response.status >= 500) return showRetryMessage(problem.requestId);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Comparar `problem.detail` com um texto quebraria na primeira reescrita da mensagem. O `type` é o " +
                "contrato, e o `detail` é para leitura humana.",
            },
            {
              title: "Não vazar detalhes internos",
              context: "A mensagem de um erro inesperado pode revelar a estrutura do sistema.",
              code: {
                language: "javascript",
                filename: "no-leak.js",
                code: [
                  "// Vaza: mensagem do banco e stack trace na resposta",
                  "response.status(500).json({ error: error.message, stack: error.stack });",
                  "// { \"error\": \"duplicate key value violates unique constraint \\\"users_email_key\\\"\", ... }",
                  "",
                  "// Seguro: o detalhe vai para o log, e a resposta é genérica com um id para rastrear",
                  "logger.error({ requestId, error });",
                  "response.status(500).json({ type: \"about:blank\", title: \"Erro interno\", status: 500, requestId });",
                ].join("\n"),
              },
              explanation:
                "O nome da constraint e da tabela é informação valiosa para quem sonda o sistema. O `requestId` permite " +
                "que a equipe encontre o detalhe nos logs sem expô-lo a ninguém.",
            },
          ],
          exercise: {
            problem:
              "Cada endpoint devolve erros em um formato próprio, e alguns respondem 200 com `{ \"ok\": false }`. O " +
              "aplicativo precisa de um `if` diferente para cada rota.",
            problemCode: {
              language: "javascript",
              filename: "inconsistent-errors.js",
              code: [
                "// Endpoint A",
                "return { status: 200, body: { ok: false, msg: \"produto não encontrado\" } };",
                "// Endpoint B",
                "return { status: 400, body: { erro: \"quantidade inválida\" } };",
                "// Endpoint C",
                "return { status: 500, body: { error: error.stack } };",
              ].join("\n"),
            },
            task:
              "Crie `toProblem(error)`, que converta `NotFoundError` em 404, `ValidationError` em 422 e qualquer outro em " +
              "500 genérico, todos no formato `{ type, title, status, detail }`.",
            hint: "Use `instanceof` para escolher o status e o tipo. No 500, use uma mensagem fixa em vez de `error.message`.",
            solution: {
              code: {
                language: "javascript",
                filename: "inconsistent-errors.fixed.js",
                code: [
                  "class NotFoundError extends Error {}",
                  "class ValidationError extends Error {}",
                  "",
                  "function toProblem(error) {",
                  "  if (error instanceof NotFoundError) {",
                  "    return { status: 404, body: { type: \"nao-encontrado\", title: \"Não encontrado\", status: 404, detail: error.message } };",
                  "  }",
                  "  if (error instanceof ValidationError) {",
                  "    return { status: 422, body: { type: \"validacao\", title: \"Dados inválidos\", status: 422, detail: error.message } };",
                  "  }",
                  "  return { status: 500, body: { type: \"erro-interno\", title: \"Erro interno\", status: 500, detail: \"Ocorreu um erro inesperado.\" } };",
                  "}",
                  "",
                  "toProblem(new NotFoundError(\"produto 7 não encontrado\")).status;   // 404",
                  "toProblem(new Error(\"connection refused: db:5432\")).body.detail;   // \"Ocorreu um erro inesperado.\"",
                ].join("\n"),
              },
              explanation:
                "Todos os erros têm o mesmo formato e o status certo, e o erro inesperado não vaza a mensagem do banco. " +
                "Um único tratamento no cliente passa a servir a todos os endpoints.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Pagination (Offset / Cursor)",
          requires: ["Response Design"],
          subtopics: ["offset/limit: simples, page drift, custo de página profunda", "cursor/keyset: estável, sem página N, requer ordenação total"],
          note: "consolidada (A3)",
          summary:
            "Como devolver uma coleção grande em pedaços: por deslocamento (`offset` e `limit`), simples mas instável " +
            "e caro em páginas profundas, ou por cursor, estável e eficiente, mas sem saltar para uma página qualquer.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Devolver milhares de itens em uma resposta é lento e caro, então as coleções são divididas em páginas. " +
                "Há duas estratégias. A paginação por offset pede \"os `limit` itens a partir da posição `offset`\", e " +
                "é fácil de implementar e permite ir a qualquer página. A paginação por cursor pede \"os `limit` itens " +
                "depois deste marcador\", em que o cursor guarda o valor do último item visto; é estável e eficiente, mas " +
                "só avança e retrocede, sem saltar a uma página N.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Offset conta posições e cursor guarda um ponto de referência: contar posições quebra quando os dados " +
                "mudam e fica lento nas páginas fundas, e o cursor resiste aos dois problemas.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "pagination.js",
              code: [
                "// Offset/limit: simples",
                "function pageByOffset(items, { offset = 0, limit = 20 }) {",
                "  return { data: items.slice(offset, offset + limit), meta: { total: items.length, offset, limit } };",
                "}",
                "",
                "// Cursor (keyset): a ordenação precisa ser total, então o id desempata",
                "const encode = (value) => Buffer.from(JSON.stringify(value)).toString(\"base64url\");",
                "const decode = (cursor) => JSON.parse(Buffer.from(cursor, \"base64url\").toString());",
                "",
                "function pageByCursor(items, { cursor, limit = 20 }) {",
                "  const sorted = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id);",
                "",
                "  const start = cursor",
                "    ? sorted.findIndex((item) => {",
                "        const after = decode(cursor);",
                "        return item.createdAt > after.createdAt || (item.createdAt === after.createdAt && item.id > after.id);",
                "      })",
                "    : 0;",
                "",
                "  const data = start === -1 ? [] : sorted.slice(start, start + limit);",
                "  const last = data.at(-1);",
                "  const hasMore = start !== -1 && start + limit < sorted.length;",
                "  return { data, meta: { nextCursor: hasMore ? encode({ createdAt: last.createdAt, id: last.id }) : null } };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em SQL, o offset vira `LIMIT 20 OFFSET 40`, que faz o banco ler e descartar as 40 linhas anteriores. O " +
                "cursor vira `WHERE (created_at, id) > (:ultimoCreatedAt, :ultimoId) ORDER BY created_at, id LIMIT 20`, que " +
                "usa um índice e vai direto ao ponto.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Offset: coleções pequenas ou médias, telas com números de página e a possibilidade de saltar para uma página qualquer, e dados que mudam pouco.",
                "Cursor: coleções grandes ou que crescem depressa, feeds e rolagem infinita, exportações e qualquer caso em que a estabilidade e o desempenho em profundidade importem.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Offset: com inserções ou remoções entre uma página e outra, itens aparecem duas vezes ou são pulados (page drift); e páginas profundas ficam lentas, porque o banco lê todos os itens anteriores.",
                "Offset: o total de itens (`COUNT(*)`) pode ser caro em tabelas grandes, e muitas APIs dispensam esse valor.",
                "Cursor: não permite ir à página 50, e não dá o total; o cliente só navega em sequência.",
                "Cursor: exige uma ordenação total e estável, com um desempate único (como o id); sem isso, itens se repetem ou somem entre páginas. O cursor deve ser opaco, para poder mudar sem quebrar clientes.",
              ],
            },
          ],
          examples: [
            {
              title: "Page drift: o problema do offset",
              context: "Uma inserção entre duas requisições faz um item aparecer de novo, ou faz outro desaparecer.",
              code: {
                language: "javascript",
                filename: "page-drift.js",
                code: [
                  "let items = [\"E\", \"D\", \"C\", \"B\", \"A\"];   // mais novo primeiro",
                  "",
                  "const page1 = items.slice(0, 2);   // [\"E\", \"D\"]",
                  "",
                  "// Enquanto o cliente lê a página 1, chega um item novo no topo",
                  "items = [\"F\", ...items];          // [\"F\", \"E\", \"D\", \"C\", \"B\", \"A\"]",
                  "",
                  "const page2 = items.slice(2, 4);   // [\"D\", \"C\"]  ← \"D\" apareceu de novo",
                  "",
                  "// Com cursor (\"depois de D\"), a página 2 seria [\"C\", \"B\"]: sem repetição e sem perda",
                ].join("\n"),
              },
              explanation:
                "O offset conta posições, e as posições mudaram. O cursor se ancora no último item visto, e por isso " +
                "resiste à inserção.",
            },
            {
              title: "O custo das páginas profundas",
              context: "No banco, `OFFSET` grande obriga a ler e descartar tudo o que vem antes.",
              code: {
                language: "text",
                filename: "deep-pages.txt",
                code: [
                  "-- Offset: para entregar a página 5.000, o banco lê 100.000 linhas e descarta as primeiras",
                  "SELECT * FROM orders ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 99980;",
                  "",
                  "-- Cursor (keyset): usa o índice e começa direto no ponto certo",
                  "SELECT * FROM orders",
                  "WHERE (created_at, id) < ('2026-03-01T10:00:00Z', 8412)",
                  "ORDER BY created_at DESC, id DESC",
                  "LIMIT 20;",
                  "",
                  "-- O tempo do offset cresce com a profundidade; o do cursor é praticamente constante.",
                ].join("\n"),
              },
              explanation:
                "Para uma lista que o usuário lê nas primeiras páginas, o offset serve. Em uma exportação, ou em um feed " +
                "infinito, o cursor é a escolha que continua rápida.",
            },
            {
              title: "A resposta paginada por cursor",
              context: "O cliente só precisa devolver o cursor que recebeu, sem entender o seu conteúdo.",
              code: {
                language: "javascript",
                filename: "cursor-client.js",
                code: [
                  "async function fetchAll(url) {",
                  "  const all = [];",
                  "  let cursor = null;",
                  "",
                  "  do {",
                  "    const query = new URLSearchParams({ limit: \"50\", ...(cursor && { cursor }) });",
                  "    const page = await fetch(`${url}?${query}`).then((r) => r.json());",
                  "",
                  "    all.push(...page.data);",
                  "    cursor = page.meta.nextCursor;   // null quando acabou",
                  "  } while (cursor);",
                  "",
                  "  return all;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O cursor é opaco: o servidor pode mudar o seu conteúdo interno sem quebrar clientes. O laço termina " +
                "quando a resposta não traz um próximo cursor.",
            },
          ],
          exercise: {
            problem:
              "O feed de notificações usa offset. Os usuários reclamam de itens repetidos ao rolar, e a página " +
              "profunda demora vários segundos.",
            problemCode: {
              language: "javascript",
              filename: "feed.js",
              code: [
                "function feed(notifications, { offset = 0, limit = 20 }) {",
                "  const sorted = [...notifications].sort((a, b) => b.id - a.id);   // mais novo primeiro",
                "  return sorted.slice(offset, offset + limit);",
                "}",
              ].join("\n"),
            },
            task:
              "Converta para cursor: `feed(notifications, { after, limit })`, em que `after` é o id do último item visto, " +
              "devolvendo `{ data, nextCursor }` (com `nextCursor` nulo no fim).",
            hint: "Com ordem decrescente por id, a próxima página é a dos itens com `id < after`. `nextCursor` é o id do último item, se ainda houver mais.",
            solution: {
              code: {
                language: "javascript",
                filename: "feed.fixed.js",
                code: [
                  "function feed(notifications, { after = Infinity, limit = 20 }) {",
                  "  const sorted = [...notifications].sort((a, b) => b.id - a.id);",
                  "  const rest = sorted.filter((n) => n.id < after);   // tudo o que vem depois do cursor",
                  "",
                  "  const data = rest.slice(0, limit);",
                  "  const nextCursor = rest.length > limit ? data.at(-1).id : null;",
                  "  return { data, nextCursor };",
                  "}",
                  "",
                  "const all = [1, 2, 3, 4, 5].map((id) => ({ id }));",
                  "feed(all, { limit: 2 });                       // { data: [{id:5},{id:4}], nextCursor: 4 }",
                  "feed(all, { after: 4, limit: 2 });             // { data: [{id:3},{id:2}], nextCursor: 2 }",
                  "feed(all, { after: 2, limit: 2 });             // { data: [{id:1}], nextCursor: null }",
                ].join("\n"),
              },
              explanation:
                "Cada página parte do último item visto, e não de uma posição, então novos itens no topo não deslocam " +
                "a leitura. Em um banco, `id < after` usa o índice, e o custo não cresce com a profundidade.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Filtering & Sorting",
          requires: ["Response Design"],
          subtopics: ["operadores de filtro", "ordenação multi-campo", "whitelist de campos ordenáveis"],
          note: "consolidada (A16)",
          summary:
            "Parâmetros de consulta que deixam o consumidor restringir e ordenar uma coleção — com operadores de " +
            "filtro, ordenação por vários campos e uma lista fechada de campos permitidos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma coleção grande só é útil se o consumidor puder pedir apenas o que interessa e na ordem que " +
                "quer. Os filtros e a ordenação vão na consulta: `?status=paid&price[gte]=10&sort=-createdAt,name`. " +
                "Convenções comuns: um parâmetro por campo para igualdade, um operador para comparações " +
                "(`price[gte]`, `price_gte`), e `sort` com campos separados por vírgula, em que o prefixo `-` inverte a " +
                "ordem. O ponto crucial é a lista fechada (whitelist): só se filtra e ordena pelo que a API " +
                "declarou.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Filtre e ordene só pelos campos que a API autorizou: cada um é um compromisso de desempenho e de " +
                "segurança, e nomes vindos do cliente nunca vão direto para a consulta.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O servidor lê os parâmetros, confere cada campo e operador em uma tabela de permitidos, e só então os " +
                "traduz para a consulta. A ordenação sempre termina com um desempate estável (o id), para que a " +
                "paginação seja previsível.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "filter-sort.js",
              code: [
                "// Campos que a API aceita, e como cada um é traduzido para a coluna real",
                "const SORTABLE = { createdAt: \"created_at\", total: \"total\", status: \"status\" };",
                "",
                "class BadRequest extends Error {}",
                "",
                "function orderBy(sort = \"-createdAt\") {",
                "  const parts = sort.split(\",\").map((field) => {",
                "    const descending = field.startsWith(\"-\");",
                "    const name = descending ? field.slice(1) : field;",
                "    if (!(name in SORTABLE)) throw new BadRequest(`ordenação não permitida: ${name}`);",
                "    return `${SORTABLE[name]} ${descending ? \"DESC\" : \"ASC\"}`;",
                "  });",
                "  return [...parts, \"id ASC\"].join(\", \");   // desempate estável",
                "}",
                "",
                "orderBy(\"-createdAt,total\");   // \"created_at DESC, total ASC, id ASC\"",
                "orderBy(\"senha\");              // BadRequest: ordenação não permitida: senha",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Os nomes que chegam do cliente nunca são concatenados na consulta: são traduzidos pela tabela. Um " +
                "campo fora dela é recusado com 400.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em qualquer coleção com mais do que alguns itens, para que o consumidor não precise baixar tudo e filtrar no cliente.",
                "Combinados com paginação: os filtros reduzem o conjunto, a ordenação o organiza, e a paginação o divide.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Cada filtro e cada ordenação permitidos precisam de um índice à altura; liberar campos sem índice deixa a API à mercê de consultas lentas.",
                "Aceitar nomes de campos do cliente e concatená-los na consulta abre a porta para injeção de SQL e para vazar campos internos; use sempre uma lista fechada.",
                "Não vale inventar uma linguagem de consulta completa, com `AND`, `OR` e parênteses, em parâmetros de URL; para consultas ricas, considere um endpoint de busca ou GraphQL.",
                "Ordenar sem desempate único torna a paginação instável, com itens repetidos ou perdidos entre páginas.",
              ],
            },
          ],
          examples: [
            {
              title: "Filtros com operadores",
              context: "Igualdade e comparações precisam de uma convenção que o consumidor consiga adivinhar.",
              code: {
                language: "javascript",
                filename: "operators.js",
                code: [
                  "// GET /orders?status=paid&total[gte]=100&total[lte]=500",
                  "const query = new URLSearchParams(\"status=paid&total[gte]=100&total[lte]=500\");",
                  "",
                  "const OPERATORS = { gte: (a, b) => a >= b, lte: (a, b) => a <= b, eq: (a, b) => a === b };",
                  "",
                  "function matches(order, query) {",
                  "  for (const [key, raw] of query) {",
                  "    const [, field, operator = \"eq\"] = key.match(/^(\\w+)(?:\\[(\\w+)\\])?$/);",
                  "    const value = Number.isNaN(Number(raw)) ? raw : Number(raw);",
                  "    if (!OPERATORS[operator]?.(order[field], value)) return false;",
                  "  }",
                  "  return true;",
                  "}",
                  "",
                  "matches({ status: \"paid\", total: 250 }, query);   // true",
                  "matches({ status: \"paid\", total: 900 }, query);   // false (total > 500)",
                ].join("\n"),
              },
              explanation:
                "Cada parâmetro vira um campo e um operador. Em um servidor real, a mesma tradução geraria a cláusula " +
                "`WHERE`, com os operadores também em uma lista fechada.",
            },
            {
              title: "A lista fechada de campos",
              context: "Ordenar por um campo que não deveria ser exposto é um vazamento de informação.",
              code: {
                language: "javascript",
                filename: "whitelist.js",
                code: [
                  "// Ordenar por um campo permite deduzir o seu conteúdo, mesmo que ele não apareça na resposta",
                  "// GET /users?sort=passwordHash   ← revela a ordem dos hashes",
                  "// GET /users?sort=id;DROP TABLE users   ← tentativa de injeção",
                  "",
                  "// Com a lista fechada, ambos são recusados",
                  "try { orderBy(\"passwordHash\"); }",
                  "catch (error) { error.message; }   // \"ordenação não permitida: passwordHash\"",
                ].join("\n"),
              },
              explanation:
                "A lista fechada resolve dois problemas: segurança, ao impedir o acesso indireto a campos internos, e " +
                "desempenho, ao limitar as ordenações às que têm índice.",
            },
            {
              title: "Ordenação estável para paginar",
              context: "Sem um desempate, itens com o mesmo valor podem trocar de lugar entre uma página e outra.",
              code: {
                language: "javascript",
                filename: "stable-sort.js",
                code: [
                  "// Vários pedidos com o mesmo status: a ordem entre eles não é definida pelo banco",
                  "// ORDER BY status              ← instável: a página 2 pode repetir itens da página 1",
                  "// ORDER BY status, id          ← estável: o id desempata sempre da mesma forma",
                  "",
                  "const sortWithTiebreaker = (items) =>",
                  "  [...items].sort((a, b) => a.status.localeCompare(b.status) || a.id - b.id);",
                ].join("\n"),
              },
              explanation:
                "O desempate único torna a ordem total. É o requisito básico para que paginação, seja por offset ou por " +
                "cursor, funcione sem repetições.",
            },
          ],
          exercise: {
            problem:
              "A listagem monta o `ORDER BY` concatenando o parâmetro `sort` recebido. Um consumidor consegue " +
              "ordenar por qualquer coluna, inclusive as internas, e enviar texto que altera a consulta.",
            problemCode: {
              language: "javascript",
              filename: "unsafe-order.js",
              code: [
                "function buildQuery(sort) {",
                "  return `SELECT * FROM orders ORDER BY ${sort}`;   // sort vem da consulta da URL",
                "}",
                "",
                "buildQuery(\"total; DROP TABLE orders\");",
              ].join("\n"),
            },
            task:
              "Implemente `orderBy(sort)`, que aceite só `createdAt`, `total` e `status` (com `-` para decrescente, separados " +
              "por vírgula), traduza-os para as colunas `created_at`, `total` e `status`, acrescente `id` como desempate e " +
              "lance um erro para qualquer outro campo.",
            hint: "Use um objeto que mapeia o nome público para a coluna. Se o nome não estiver nele, lance um erro; nunca use o texto recebido na consulta.",
            solution: {
              code: {
                language: "javascript",
                filename: "unsafe-order.fixed.js",
                code: [
                  "const SORTABLE = { createdAt: \"created_at\", total: \"total\", status: \"status\" };",
                  "",
                  "function orderBy(sort = \"-createdAt\") {",
                  "  const parts = sort.split(\",\").map((field) => {",
                  "    const descending = field.startsWith(\"-\");",
                  "    const name = descending ? field.slice(1) : field;",
                  "    if (!Object.hasOwn(SORTABLE, name)) throw new Error(`ordenação não permitida: ${name}`);",
                  "    return `${SORTABLE[name]} ${descending ? \"DESC\" : \"ASC\"}`;",
                  "  });",
                  "  return [...parts, \"id ASC\"].join(\", \");",
                  "}",
                  "",
                  "orderBy(\"-createdAt,total\");            // \"created_at DESC, total ASC, id ASC\"",
                  "orderBy(\"total; DROP TABLE orders\");    // Error: ordenação não permitida: total; DROP TABLE orders",
                ].join("\n"),
              },
              explanation:
                "O texto do cliente só escolhe entre opções conhecidas, e o que vai para a consulta vem da tabela, e não do " +
                "parâmetro. `Object.hasOwn` evita aceitar nomes como `constructor`, herdados do protótipo.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Idempotency Key",
          requires: ["Web Fundamentals / HTTP Methods"],
          note: "canônico — mecânica HTTP (header + store de dedup + replay de resposta; retry seguro de POST). Mudança não silenciosa vs Fase 1 (que dizia 'Platform/API referencia')",
          collision: "≠ Idempotency conceito de resiliência (Architecture / Resilience Patterns)",
          summary:
            "Uma chave enviada pelo cliente em uma operação não idempotente, como um POST, que permite ao servidor " +
            "reconhecer uma repetição e devolver o resultado da primeira execução, em vez de fazê-la de novo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Quando uma requisição falha por tempo limite, o cliente não sabe se o servidor chegou a processá-la: " +
                "repetir pode duplicar uma cobrança ou um pedido. A chave de idempotência resolve isso: o cliente gera " +
                "um identificador único por operação, e o envia em um cabeçalho (`Idempotency-Key`). O servidor guarda o " +
                "resultado associado à chave, e, se a mesma chave chegar de novo, devolve o resultado guardado sem " +
                "executar a operação outra vez. É o que torna seguro repetir um POST (HTTP Methods).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A mesma chave significa a mesma operação: a primeira vez executa, e as seguintes só repetem a " +
                "resposta guardada — o cliente pode tentar de novo sem medo de duplicar.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "O cliente gera a chave (um UUID) uma vez por operação e a reenvia, idêntica, em cada tentativa.",
                "O servidor consulta a chave: se é nova, registra que está em andamento, executa e guarda a resposta.",
                "Se a chave já tem uma resposta guardada, o servidor a devolve (replay), sem executar nada.",
                "Se a mesma chave chega com um corpo diferente, é um erro de uso do cliente: responde com erro (409 ou 422).",
                "Se a chave está em andamento, uma segunda requisição simultânea é recusada (409) ou espera, para não executar em duplicata.",
                "As chaves expiram depois de um prazo (por exemplo, 24 horas), e são separadas por cliente.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "idempotency.js",
              code: [
                "import { createHash } from \"node:crypto\";",
                "",
                "class IdempotencyStore {",
                "  #records = new Map();",
                "  constructor(ttlMs = 24 * 3600 * 1000) { this.ttlMs = ttlMs; }",
                "",
                "  async run(key, body, handler, now = Date.now()) {",
                "    const fingerprint = createHash(\"sha256\").update(JSON.stringify(body)).digest(\"hex\");",
                "    const record = this.#records.get(key);",
                "",
                "    if (record && record.expiresAt > now) {",
                "      if (record.fingerprint !== fingerprint) {",
                "        return { status: 422, body: { error: \"a chave já foi usada com outro corpo\" } };",
                "      }",
                "      if (record.state === \"in-progress\") {",
                "        return { status: 409, body: { error: \"requisição idêntica em andamento\" } };",
                "      }",
                "      return { ...record.response, replayed: true };   // devolve a resposta guardada",
                "    }",
                "",
                "    this.#records.set(key, { state: \"in-progress\", fingerprint, expiresAt: now + this.ttlMs });",
                "    try {",
                "      const response = await handler();",
                "      this.#records.set(key, { state: \"done\", fingerprint, response, expiresAt: now + this.ttlMs });",
                "      return response;",
                "    } catch (error) {",
                "      this.#records.delete(key);   // falha inesperada: permite uma nova tentativa",
                "      throw error;",
                "    }",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O registro \"em andamento\" é criado antes de executar, e é ele que barra a duplicata simultânea. Em " +
                "produção, essa reserva precisa ser atômica e compartilhada entre instâncias, como um " +
                "`INSERT ... ON CONFLICT` ou um `SET NX` no Redis.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em operações que não são naturalmente idempotentes e em que a duplicação custa caro: pagamentos, criação de pedidos, envio de e-mails e transferências.",
                "Sempre que os clientes têm razão para repetir, como redes móveis instáveis, tempos limite e filas que reentregam mensagens.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Métodos que já são idempotentes (GET, PUT, DELETE) não precisam dela: repetir o pedido já é seguro.",
                "Exige armazenamento durável e atômico, e uma política de expiração; um armazenamento local em memória só protege uma instância.",
                "O cliente precisa gerar a chave uma vez por operação e reutilizá-la nas repetições; uma chave nova a cada tentativa anula a proteção.",
                "Não resolve duplicatas entre operações diferentes, como o usuário clicando duas vezes em \"comprar\" e gerando duas chaves; isso pede outra proteção, no cliente ou no domínio.",
              ],
            },
          ],
          examples: [
            {
              title: "A repetição devolve a mesma resposta",
              context: "O efeito colateral acontece uma vez, mesmo com duas chamadas.",
              code: {
                language: "javascript",
                filename: "replay.js",
                code: [
                  "const store = new IdempotencyStore();",
                  "let charges = 0;",
                  "",
                  "const charge = () => ({ status: 201, body: { id: ++charges, amount: 100 } });",
                  "",
                  "const first = await store.run(\"chave-1\", { amount: 100 }, charge);",
                  "const second = await store.run(\"chave-1\", { amount: 100 }, charge);",
                  "",
                  "charges;            // 1 — a cobrança aconteceu uma vez",
                  "second.body.id;     // 1 — a mesma resposta da primeira",
                  "second.replayed;    // true",
                ].join("\n"),
              },
              explanation:
                "A segunda chamada não executou a cobrança. Devolveu o que a primeira produziu, e o cliente não distingue " +
                "uma da outra.",
            },
            {
              title: "Duas requisições ao mesmo tempo",
              context: "A repetição pode chegar enquanto a primeira ainda está sendo processada.",
              code: {
                language: "javascript",
                filename: "concurrent.js",
                code: [
                  "const slowCharge = async () => {",
                  "  await new Promise((resolve) => setTimeout(resolve, 100));",
                  "  return { status: 201, body: { id: 1 } };",
                  "};",
                  "",
                  "const [a, b] = await Promise.all([",
                  "  store.run(\"chave-2\", { amount: 50 }, slowCharge),",
                  "  store.run(\"chave-2\", { amount: 50 }, slowCharge),",
                  "]);",
                  "",
                  "[a.status, b.status];   // [201, 409] — a segunda foi barrada, e a cobrança rodou uma vez",
                ].join("\n"),
              },
              explanation:
                "Sem o estado \"em andamento\", as duas passariam pela checagem ao mesmo tempo e duplicariam a cobrança. " +
                "Reservar a chave antes de executar fecha essa janela.",
            },
            {
              title: "O cliente reutiliza a chave nas tentativas",
              context: "A chave é gerada uma vez, e a repetição a reenvia.",
              code: {
                language: "javascript",
                filename: "client-retry.js",
                code: [
                  "async function postWithRetry(url, body, attempts = 3) {",
                  "  const key = crypto.randomUUID();   // gerada UMA vez, fora do laço",
                  "",
                  "  for (let attempt = 1; ; attempt++) {",
                  "    try {",
                  "      return await fetch(url, {",
                  "        method: \"POST\",",
                  "        headers: { \"content-type\": \"application/json\", \"idempotency-key\": key },",
                  "        body: JSON.stringify(body),",
                  "      });",
                  "    } catch (error) {",
                  "      if (attempt >= attempts) throw error;",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se a chave fosse gerada dentro do laço, cada tentativa seria uma operação nova, e o retry duplicaria a " +
                "cobrança. Fora do laço, todas as tentativas são a mesma operação.",
            },
          ],
          exercise: {
            problem:
              "O endpoint de pagamento cria uma cobrança a cada POST. Um cliente móvel repetiu a chamada depois de um " +
              "tempo limite e o usuário foi cobrado duas vezes.",
            problemCode: {
              language: "javascript",
              filename: "payment.js",
              code: [
                "const payments = [];",
                "",
                "function createPayment(body) {",
                "  const payment = { id: payments.length + 1, ...body };",
                "  payments.push(payment);",
                "  return { status: 201, body: payment };",
                "}",
              ].join("\n"),
            },
            task:
              "Aceite uma chave de idempotência: a mesma chave e o mesmo corpo devolvem o mesmo pagamento, sem criar outro; " +
              "a mesma chave com outro corpo responde 422.",
            hint: "Guarde, por chave, o corpo e a resposta. Compare o corpo com JSON.stringify e devolva a resposta guardada se forem iguais.",
            solution: {
              code: {
                language: "javascript",
                filename: "payment.fixed.js",
                code: [
                  "const payments = [];",
                  "const seen = new Map();   // chave → { body, response }",
                  "",
                  "function createPayment(key, body) {",
                  "  const previous = seen.get(key);",
                  "  if (previous) {",
                  "    if (JSON.stringify(previous.body) !== JSON.stringify(body)) {",
                  "      return { status: 422, body: { error: \"a chave já foi usada com outro corpo\" } };",
                  "    }",
                  "    return previous.response;   // repetição: mesma resposta, sem cobrar de novo",
                  "  }",
                  "",
                  "  const payment = { id: payments.length + 1, ...body };",
                  "  payments.push(payment);",
                  "  const response = { status: 201, body: payment };",
                  "  seen.set(key, { body, response });",
                  "  return response;",
                  "}",
                  "",
                  "createPayment(\"k1\", { amount: 100 });   // 201, id 1",
                  "createPayment(\"k1\", { amount: 100 });   // a mesma resposta; payments.length continua 1",
                  "createPayment(\"k1\", { amount: 999 });   // 422",
                ].join("\n"),
              },
              explanation:
                "A repetição legítima recebe a resposta original, e o uso incorreto da chave é sinalizado. Em produção, o " +
                "`Map` seria um armazenamento compartilhado com expiração.",
            },
          },
        }),
        concept({
          order: 110,
          title: "Rate Limiting",
          subtopics: ["token bucket", "leaky bucket", "janela fixa/deslizante"],
          note: "canônico — 429 + Retry-After + headers de quota. Mudança não silenciosa vs Fase 1 (que colocava em Architecture / Resilience Patterns). Architecture e AI Engineering revisitam",
          collision: "≠ Query Complexity (GraphQL) ≠ Throttle client-side (Performance Engineering)",
          summary:
            "Limitar quantas requisições um cliente pode fazer em um período, para proteger a API contra abuso e " +
            "sobrecarga e dividir a capacidade de forma justa — respondendo 429 quando o limite estoura.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma API tem capacidade finita, e um único cliente com um laço descontrolado, ou um abuso " +
                "deliberado, pode esgotá-la para todos. O rate limiting define uma cota, por exemplo 100 " +
                "requisições por minuto por chave de API, e recusa o excedente com o status `429 Too Many Requests`, " +
                "acompanhado de `Retry-After`. Os algoritmos mais comuns são a janela fixa, a janela deslizante, o token " +
                "bucket (baldes de fichas, que permitem rajadas curtas) e o leaky bucket (escoamento em ritmo constante).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Defina uma cota por cliente e avise claramente quando ela acabar: quem excede recebe 429 e o tempo de " +
                "espera, e o restante dos clientes continua sendo atendido.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Janela fixa: um contador por intervalo (por minuto); simples, mas permite o dobro do limite na virada da janela.",
                "Janela deslizante: considera os últimos N segundos a partir de agora, sem a virada brusca, ao custo de guardar mais dados ou de aproximar.",
                "Token bucket: um balde que enche a uma taxa constante até uma capacidade; cada requisição gasta uma ficha, e o balde cheio permite uma rajada.",
                "Leaky bucket: as requisições entram em uma fila que escoa a uma taxa constante, suavizando o tráfego.",
                "A resposta 429 informa o `Retry-After` (segundos ou data) e, opcionalmente, cabeçalhos de cota (`RateLimit-*`, ou o `X-RateLimit-*` adotado de fato).",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "rate-limit.js",
              code: [
                "class TokenBucket {",
                "  constructor({ capacity, refillPerSecond }) {",
                "    this.capacity = capacity;",
                "    this.refillPerSecond = refillPerSecond;",
                "    this.tokens = capacity;",
                "    this.updatedAt = 0;",
                "  }",
                "",
                "  allow(now, cost = 1) {   // `now` em ms, recebido para poder testar",
                "    const elapsed = (now - this.updatedAt) / 1000;",
                "    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSecond);",
                "    this.updatedAt = now;",
                "",
                "    if (this.tokens >= cost) {",
                "      this.tokens -= cost;",
                "      return { allowed: true, remaining: Math.floor(this.tokens) };",
                "    }",
                "    const retryAfter = Math.ceil((cost - this.tokens) / this.refillPerSecond);",
                "    return { allowed: false, remaining: 0, retryAfter };",
                "  }",
                "}",
                "",
                "// 5 requisições de rajada, depois 1 por segundo",
                "const bucket = new TokenBucket({ capacity: 5, refillPerSecond: 1 });",
                "",
                "for (let i = 0; i < 5; i++) bucket.allow(0);   // gasta a rajada inteira",
                "bucket.allow(0);        // { allowed: false, remaining: 0, retryAfter: 1 }",
                "bucket.allow(1000);     // { allowed: true, remaining: 0 } — uma ficha voltou",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O balde permite uma rajada de cinco e depois sustenta um ritmo de uma por segundo. O `retryAfter` diz ao " +
                "cliente exatamente quanto esperar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em qualquer API pública, ou com clientes que você não controla, para proteger a disponibilidade e garantir justiça entre eles.",
                "Para controlar custo, como em APIs que consomem recursos caros (modelos de IA, geração de relatórios) e para diferenciar planos (cotas maiores para clientes pagantes).",
                "Em endpoints sensíveis, como o login, com limites mais baixos, para dificultar tentativas em massa.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Contadores em memória valem por instância: com várias instâncias, o limite real é multiplicado, e é preciso um armazenamento compartilhado (como o Redis) com operações atômicas.",
                "Limitar por endereço IP penaliza quem compartilha um IP (redes corporativas, NAT), e é fácil de contornar; prefira uma chave de API ou o usuário autenticado.",
                "Não é uma defesa completa contra ataques de negação de serviço: tráfego em massa precisa ser contido antes, na borda (CDN, firewall).",
                "Limites apertados demais quebram clientes legítimos em picos normais; escolha valores a partir do uso real e permita rajadas.",
              ],
            },
          ],
          examples: [
            {
              title: "A virada da janela fixa",
              context: "Uma janela fixa deixa passar o dobro do limite em torno da virada do intervalo.",
              code: {
                language: "javascript",
                filename: "fixed-window.js",
                code: [
                  "class FixedWindow {",
                  "  constructor(limit, windowMs) { this.limit = limit; this.windowMs = windowMs; this.counts = new Map(); }",
                  "",
                  "  allow(now) {",
                  "    const window = Math.floor(now / this.windowMs);   // 0 até 59.999 ms, depois 1...",
                  "    const count = (this.counts.get(window) ?? 0) + 1;",
                  "    this.counts.set(window, count);",
                  "    return count <= this.limit;",
                  "  }",
                  "}",
                  "",
                  "const limiter = new FixedWindow(100, 60_000);   // 100 por minuto",
                  "",
                  "// 100 requisições no fim do primeiro minuto e 100 no começo do segundo",
                  "let allowed = 0;",
                  "for (let i = 0; i < 100; i++) if (limiter.allow(59_000)) allowed++;",
                  "for (let i = 0; i < 100; i++) if (limiter.allow(61_000)) allowed++;",
                  "allowed;   // 200 — 200 requisições em 2 segundos, com um limite de 100 por minuto",
                ].join("\n"),
              },
              explanation:
                "Cada janela respeitou o limite, mas em dois segundos passaram 200 requisições. A janela deslizante e o " +
                "token bucket eliminam essa virada brusca.",
            },
            {
              title: "A resposta 429 completa",
              context: "Dizer quando tentar de novo permite que o cliente se comporte bem sozinho.",
              code: {
                language: "javascript",
                filename: "response-429.js",
                code: [
                  "function limitResponse(result, limit) {",
                  "  const headers = {",
                  "    \"ratelimit-limit\": String(limit),",
                  "    \"ratelimit-remaining\": String(result.remaining),",
                  "  };",
                  "  if (result.allowed) return { status: 200, headers };",
                  "",
                  "  return {",
                  "    status: 429,",
                  "    headers: { ...headers, \"retry-after\": String(result.retryAfter) },",
                  "    body: { title: \"Muitas requisições\", detail: `Tente novamente em ${result.retryAfter}s.` },",
                  "  };",
                  "}",
                  "",
                  "limitResponse({ allowed: false, remaining: 0, retryAfter: 12 }, 100).headers[\"retry-after\"];   // \"12\"",
                ].join("\n"),
              },
              explanation:
                "O cliente sabe o limite, quanto resta e quando voltar. Sem o `Retry-After`, ele tentaria repetidamente e " +
                "pioraria a sobrecarga.",
            },
            {
              title: "O cliente respeita o limite",
              context: "Do lado do consumidor, o tratamento do 429 faz parte do bom uso da API.",
              code: {
                language: "javascript",
                filename: "client-429.js",
                code: [
                  "async function fetchPolitely(url, options, attempts = 5) {",
                  "  for (let attempt = 1; attempt <= attempts; attempt++) {",
                  "    const response = await fetch(url, options);",
                  "    if (response.status !== 429) return response;",
                  "",
                  "    const wait = Number(response.headers.get(\"retry-after\") ?? 2 ** attempt);   // espera indicada, ou recuo exponencial",
                  "    await new Promise((resolve) => setTimeout(resolve, wait * 1000));",
                  "  }",
                  "  throw new Error(\"limite de requisições excedido\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Respeitar o `Retry-After` evita agravar a sobrecarga e permite continuar o trabalho depois. Na falta " +
                "dele, o recuo exponencial é o comportamento padrão.",
            },
          ],
          exercise: {
            problem:
              "A API não tem nenhum limite. Um cliente com um laço errado envia milhares de requisições por segundo, " +
              "e os demais clientes começam a receber erros.",
            problemCode: {
              language: "javascript",
              filename: "no-limit.js",
              code: [
                "function handle(request) {",
                "  return { status: 200, body: processRequest(request) };   // sem nenhum controle",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `TokenBucket` com `capacity` e `refillPerSecond`, e um método `allow(now)` que devolva " +
              "`{ allowed, retryAfter }`. Depois, use um balde por chave de API na função `handle`.",
            hint: "A cada chamada, some as fichas repostas desde a última vez (limitando à capacidade). Se houver ao menos uma, gaste-a; senão, calcule quanto falta.",
            solution: {
              code: {
                language: "javascript",
                filename: "no-limit.fixed.js",
                code: [
                  "class TokenBucket {",
                  "  constructor({ capacity, refillPerSecond }) {",
                  "    Object.assign(this, { capacity, refillPerSecond, tokens: capacity, updatedAt: 0 });",
                  "  }",
                  "",
                  "  allow(now) {",
                  "    const elapsed = (now - this.updatedAt) / 1000;",
                  "    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillPerSecond);",
                  "    this.updatedAt = now;",
                  "",
                  "    if (this.tokens >= 1) { this.tokens -= 1; return { allowed: true }; }",
                  "    return { allowed: false, retryAfter: Math.ceil((1 - this.tokens) / this.refillPerSecond) };",
                  "  }",
                  "}",
                  "",
                  "const buckets = new Map();   // chave de API → balde",
                  "",
                  "function handle(request, now = Date.now()) {",
                  "  if (!buckets.has(request.apiKey)) {",
                  "    buckets.set(request.apiKey, new TokenBucket({ capacity: 10, refillPerSecond: 5 }));",
                  "  }",
                  "  const result = buckets.get(request.apiKey).allow(now);",
                  "",
                  "  if (!result.allowed) {",
                  "    return { status: 429, headers: { \"retry-after\": String(result.retryAfter) } };",
                  "  }",
                  "  return { status: 200, body: processRequest(request) };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada cliente tem o seu balde, então um abusador esgota só a própria cota, e os demais seguem sendo " +
                "atendidos. Em produção, o `Map` seria um armazenamento compartilhado entre as instâncias.",
            },
          },
        }),
        concept({
          order: 120,
          title: "API Versioning",
          requires: ["API Contract"],
          note: "revisita Software Craft / Semantic Versioning, Backward Compatibility (URL vs header vs media type)",
          revisit: ["Software Craft / Dependency & Version Management / Semantic Versioning", "Software Craft / Dependency & Version Management / Backward Compatibility"],
          summary:
            "A forma de publicar mudanças incompatíveis de uma API sem quebrar quem já a usa: manter versões " +
            "convivendo, identificadas na URL, em um cabeçalho ou no tipo de mídia.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Mudanças compatíveis, como acrescentar campos ou endpoints, não exigem uma nova versão. Quando uma " +
                "mudança é incompatível (breaking change), a saída é publicar uma nova versão da API e manter a " +
                "anterior em funcionamento por um tempo, para que cada consumidor migre no seu ritmo. É o mesmo " +
                "raciocínio de Semantic Versioning e de Backward Compatibility (Dependency & Version Management), " +
                "aplicado a um serviço em execução, em que só a versão maior importa.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Versione só quando não houver como evoluir de forma compatível, e mantenha as versões antigas " +
                "funcionando até que os consumidores migrem.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Na URL (`/v1/orders`, `/v2/orders`): a mais visível e a mais usada; fácil de testar no navegador e de rotear.",
                "Em um cabeçalho (`Api-Version: 2`): mantém o endereço estável, mas fica menos visível.",
                "No tipo de mídia (`Accept: application/vnd.loja.v2+json`): o mais fiel a REST, e o mais trabalhoso de usar.",
                "Por data (`Api-Version: 2026-03-01`), como algumas APIs públicas: cada cliente fica preso ao comportamento da data em que começou.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "versioning.js",
              code: [
                "// Um único modelo interno (a versão mais nova) e um tradutor para cada versão publicada",
                "const order = { id: \"42\", customer: { firstName: \"Ana\", lastName: \"Souza\" }, totalInCents: 1990 };",
                "",
                "const serializers = {",
                "  v2: (o) => ({ id: o.id, customer: o.customer, totalInCents: o.totalInCents }),",
                "  v1: (o) => ({                                                   // formato antigo, ainda suportado",
                "    id: o.id,",
                "    customerName: `${o.customer.firstName} ${o.customer.lastName}`,",
                "    total: o.totalInCents / 100,",
                "  }),",
                "};",
                "",
                "function versionFrom(url) {",
                "  return /^\\/(v\\d+)\\//.exec(url)?.[1];   // \"/v1/orders/42\" → \"v1\"",
                "}",
                "",
                "function getOrder(url) {",
                "  const version = versionFrom(url);",
                "  if (!serializers[version]) return { status: 400, body: { error: \"versão não suportada\" } };",
                "  return { status: 200, body: serializers[version](order) };",
                "}",
                "",
                "getOrder(\"/v1/orders/42\").body;   // { id: \"42\", customerName: \"Ana Souza\", total: 19.9 }",
                "getOrder(\"/v2/orders/42\").body;   // { id: \"42\", customer: { ... }, totalInCents: 1990 }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As duas versões compartilham a mesma regra de negócio: só a tradução da resposta muda. Manter cada " +
                "versão como uma implementação separada multiplicaria os bugs e o trabalho.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em APIs públicas, ou com muitos consumidores fora do seu controle, em que uma mudança incompatível é inevitável.",
                "Quando é preciso garantir um prazo de migração longo, e não uma troca simultânea de todos os clientes.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Cada versão mantida é custo: testes, documentação, correções de segurança e suporte multiplicados; evite criar uma versão para cada mudança.",
                "Em APIs internas, com clientes que você coordena, costuma ser mais barato evoluir de forma compatível e migrar todos juntos.",
                "Antes de versionar, tente evoluir de forma aditiva: novos campos opcionais, novos endpoints, valores antigos ainda aceitos.",
                "Versionar por recurso, e não pela API toda, fragmenta a experiência; decida a granularidade e mantenha-a.",
              ],
            },
          ],
          examples: [
            {
              title: "As formas de indicar a versão",
              context: "Cada estratégia tem um equilíbrio diferente entre visibilidade e pureza.",
              code: {
                language: "text",
                filename: "strategies.txt",
                code: [
                  "URL           GET /v2/orders/42",
                  "              + visível, fácil de rotear e de testar   − o endereço muda a cada versão",
                  "",
                  "Cabeçalho     GET /orders/42          Api-Version: 2",
                  "              + o endereço é estável                   − menos visível, mais fácil de esquecer",
                  "",
                  "Tipo de mídia GET /orders/42          Accept: application/vnd.loja.v2+json",
                  "              + o mais fiel a REST                     − o mais trabalhoso de usar e de depurar",
                ].join("\n"),
              },
              explanation:
                "Não há uma resposta única. A URL é a escolha mais comum por ser a mais simples para quem consome, e o " +
                "importante é a consistência.",
            },
            {
              title: "Uma mudança que não precisa de versão",
              context: "Acrescentar é compatível: nada muda para quem já usa a API.",
              code: {
                language: "javascript",
                filename: "additive-change.js",
                code: [
                  "// Antes",
                  "// { \"id\": \"42\", \"status\": \"paid\", \"total\": 1990 }",
                  "",
                  "// Depois: um campo novo, opcional para quem lê. Nenhuma versão nova é necessária.",
                  "// { \"id\": \"42\", \"status\": \"paid\", \"total\": 1990, \"paidAt\": \"2026-03-01T10:00:00Z\" }",
                  "",
                  "// Consumidores tolerantes ignoram `paidAt`; os que precisam dele passam a usá-lo.",
                ].join("\n"),
              },
              explanation:
                "Se todos os consumidores seguem o leitor tolerante, acrescentar campos é seguro. Reservar as versões para " +
                "as quebras reais mantém o número delas baixo.",
            },
            {
              title: "Um modelo interno, vários formatos externos",
              context: "A tradução na borda evita duplicar a lógica de negócio entre versões.",
              code: {
                language: "javascript",
                filename: "translate-at-the-edge.js",
                code: [
                  "// A regra de negócio usa só o modelo mais novo",
                  "async function placeOrder(input) { return orders.create(input); }",
                  "",
                  "// Cada versão traduz a entrada para o modelo novo e a saída para o seu formato",
                  "const handlers = {",
                  "  v1: async (body) => serializers.v1(await placeOrder(fromV1(body))),",
                  "  v2: async (body) => serializers.v2(await placeOrder(body)),",
                  "};",
                  "",
                  "const fromV1 = (body) => {",
                  "  const [firstName, ...rest] = body.customerName.split(\" \");",
                  "  return { customer: { firstName, lastName: rest.join(\" \") }, totalInCents: Math.round(body.total * 100) };",
                  "};",
                ].join("\n"),
              },
              explanation:
                "A versão antiga fica reduzida a um par de funções de tradução. Quando ela for desligada, basta apagá-las, " +
                "e a regra de negócio não muda.",
            },
          ],
          exercise: {
            problem:
              "A v1 devolve `name` com o nome completo. A v2 precisa de `firstName` e `lastName` separados, mas os " +
              "clientes atuais dependem do campo `name`.",
            problemCode: {
              language: "javascript",
              filename: "user-versions.js",
              code: [
                "const user = { id: 7, firstName: \"Ana\", lastName: \"Souza\" };",
                "",
                "function getUser(url) {",
                "  // GET /v1/users/7 → { id, name }",
                "  // GET /v2/users/7 → { id, firstName, lastName }",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `getUser(url)` para responder os dois formatos a partir do mesmo modelo, e 400 para uma " +
              "versão desconhecida.",
            hint: "Extraia a versão do início do caminho com uma expressão regular e use uma tabela de serializadores.",
            solution: {
              code: {
                language: "javascript",
                filename: "user-versions.fixed.js",
                code: [
                  "const user = { id: 7, firstName: \"Ana\", lastName: \"Souza\" };",
                  "",
                  "const serializers = {",
                  "  v1: (u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }),",
                  "  v2: (u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName }),",
                  "};",
                  "",
                  "function getUser(url) {",
                  "  const version = /^\\/(v\\d+)\\//.exec(url)?.[1];",
                  "  if (!(version in serializers)) return { status: 400, body: { error: \"versão não suportada\" } };",
                  "  return { status: 200, body: serializers[version](user) };",
                  "}",
                  "",
                  "getUser(\"/v1/users/7\").body;   // { id: 7, name: \"Ana Souza\" }",
                  "getUser(\"/v2/users/7\").body;   // { id: 7, firstName: \"Ana\", lastName: \"Souza\" }",
                  "getUser(\"/v9/users/7\").status; // 400",
                ].join("\n"),
              },
              explanation:
                "Os clientes da v1 seguem funcionando, e os novos usam a v2, ambos servidos pelo mesmo modelo. A " +
                "diferença está só na tradução da resposta.",
            },
          },
        }),
        concept({
          order: 130,
          title: "API Deprecation",
          requires: ["API Versioning"],
          note: "revisita Software Craft / Deprecation (sunset headers, janelas de migração)",
          revisit: ["Software Craft / Dependency & Version Management / Deprecation"],
          summary:
            "O processo de aposentar uma versão ou um recurso de uma API com aviso e prazo: anunciar, sinalizar nas " +
            "respostas, acompanhar quem ainda usa, e só então desligar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Versões antigas não podem existir para sempre, mas desligá-las de surpresa quebra os consumidores. A " +
                "depreciação é o caminho combinado: anuncia-se que algo será retirado, indica-se a alternativa, dá-se " +
                "uma janela de migração e, só depois de uma data definida, remove-se. É o mesmo processo de Deprecation " +
                "em bibliotecas (Dependency & Version Management), com a diferença de que os consumidores são " +
                "sistemas em produção que você nem sempre conhece.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Avise cedo, sinalize nas próprias respostas, meça quem ainda usa e desligue só na data anunciada: a " +
                "aposentadoria de uma API é um processo, e não um evento.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "list",
              items: [
                "Anuncie: changelog, documentação, e-mail para os clientes que usam o recurso, com a data de desligamento e o caminho de migração.",
                "Sinalize nas respostas: `Deprecation` (o recurso está depreciado), `Sunset` (data do desligamento, no formato HTTP-date, RFC 8594) e `Link` para o sucessor e para a documentação de migração.",
                "Meça o uso por cliente e por versão, para saber quem ainda depende e a quem procurar.",
                "Dê uma janela realista, de meses e não de dias, e considere apagões programados (brownouts): desligar por curtos períodos para fazer os retardatários notarem.",
                "Na data, responda `410 Gone`, com uma mensagem que aponte para a migração, em vez de um 404 anônimo.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "deprecation.js",
              code: [
                "const V1_SUNSET = new Date(\"2026-12-31T23:59:59Z\");",
                "const usage = new Map();   // cliente → número de chamadas à v1",
                "",
                "function deprecationPolicy({ apiKey, now = new Date() }) {",
                "  usage.set(apiKey, (usage.get(apiKey) ?? 0) + 1);   // medir quem ainda usa",
                "",
                "  const headers = {",
                "    deprecation: \"true\",",
                "    sunset: V1_SUNSET.toUTCString(),   // \"Thu, 31 Dec 2026 23:59:59 GMT\"",
                "    link: \"</v2/orders>; rel=\\\"successor-version\\\", <https://docs.exemplo.com/migracao-v2>; rel=\\\"deprecation\\\"\",",
                "  };",
                "",
                "  if (now >= V1_SUNSET) {",
                "    return { status: 410, headers, body: { title: \"Versão desligada\", detail: \"Use /v2. Guia: https://docs.exemplo.com/migracao-v2\" } };",
                "  }",
                "  return { status: 200, headers };",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Antes da data, a v1 responde normalmente, com os cabeçalhos de aviso. Depois dela, passa a devolver 410, " +
                "e o contador de uso mostra quais clientes precisam de atenção antes disso.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Sempre que uma versão, um endpoint ou um campo for aposentado, principalmente em APIs públicas ou com muitos consumidores.",
                "Junto do versionamento: cada versão nova traz a decisão de quando a antiga será retirada.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Depreciar sem oferecer uma alternativa, ou sem um guia de migração, só transfere o problema aos consumidores.",
                "Prazos curtos demais, ou sem acompanhamento do uso, terminam em quebras e em clientes irritados; os grandes clientes podem precisar de contato direto.",
                "Cabeçalhos só ajudam quem os lê: muitos clientes automatizados os ignoram, e por isso o anúncio por outros canais continua necessário.",
                "Adiar indefinidamente o desligamento acumula custo e risco de segurança; a data anunciada precisa ser levada a sério, com o cuidado de comunicar qualquer mudança nela.",
              ],
            },
          ],
          examples: [
            {
              title: "Os cabeçalhos de aviso",
              context: "A depreciação anunciada dentro da própria resposta chega a quem está usando o recurso.",
              code: {
                language: "text",
                filename: "deprecation-headers.txt",
                code: [
                  "HTTP/1.1 200 OK",
                  "Deprecation: true",
                  "Sunset: Thu, 31 Dec 2026 23:59:59 GMT",
                  "Link: </v2/orders>; rel=\"successor-version\"",
                  "Link: <https://docs.exemplo.com/migracao-v2>; rel=\"deprecation\"",
                  "",
                  "# Deprecation: o recurso está depreciado (versões recentes do padrão usam uma data no lugar de `true`)",
                  "# Sunset: quando será desligado (formato de data HTTP)",
                  "# Link: onde estão o sucessor e o guia de migração",
                ].join("\n"),
              },
              explanation:
                "Ferramentas e bibliotecas cliente podem ler esses cabeçalhos e registrar um aviso nos logs de quem " +
                "usa. É a forma de alcançar quem não lê o changelog.",
            },
            {
              title: "Saber quem ainda usa",
              context: "Sem medição, a data de desligamento é um salto no escuro.",
              code: {
                language: "javascript",
                filename: "usage-report.js",
                code: [
                  "function usageReport(usage, days) {",
                  "  return [...usage.entries()]",
                  "    .map(([apiKey, calls]) => ({ apiKey, callsPerDay: Math.round(calls / days) }))",
                  "    .sort((a, b) => b.callsPerDay - a.callsPerDay);",
                  "}",
                  "",
                  "usageReport(new Map([[\"chave-a\", 9000], [\"chave-b\", 30]]), 30);",
                  "// [{ apiKey: \"chave-a\", callsPerDay: 300 }, { apiKey: \"chave-b\", callsPerDay: 1 }]",
                  "",
                  "// A chave-a ainda depende muito da v1: vale um contato direto antes da data.",
                ].join("\n"),
              },
              explanation:
                "O relatório mostra a quem procurar. Um cliente com muito tráfego na versão antiga precisa de um contato " +
                "e de apoio, e não só de um aviso automático.",
            },
            {
              title: "Apagão programado (brownout)",
              context: "Desligar por curtos períodos antes da data final faz os retardatários notarem, sem quebrá-los de vez.",
              code: {
                language: "javascript",
                filename: "brownout.js",
                code: [
                  "// Calendário: a v1 fica indisponível por 1 hora em datas anunciadas",
                  "const BROWNOUTS = [",
                  "  { from: new Date(\"2026-10-01T14:00:00Z\"), to: new Date(\"2026-10-01T15:00:00Z\") },",
                  "  { from: new Date(\"2026-11-01T14:00:00Z\"), to: new Date(\"2026-11-01T18:00:00Z\") },",
                  "];",
                  "",
                  "const inBrownout = (now) => BROWNOUTS.some(({ from, to }) => now >= from && now < to);",
                  "",
                  "inBrownout(new Date(\"2026-10-01T14:30:00Z\"));   // true  → responder 410 nesta janela",
                  "inBrownout(new Date(\"2026-10-01T16:00:00Z\"));   // false → volta a funcionar",
                ].join("\n"),
              },
              explanation:
                "Quem ainda usa a versão antiga percebe o problema com antecedência, quando o custo de corrigir é " +
                "menor. As janelas crescem até o desligamento definitivo.",
            },
          ],
          exercise: {
            problem:
              "A v1 será desligada em 31/12/2026. Hoje ela responde normalmente e sem nenhum aviso, e ninguém sabe quantos " +
              "clientes ainda dependem dela.",
            problemCode: {
              language: "javascript",
              filename: "v1-endpoint.js",
              code: [
                "function handleV1(request) {",
                "  return { status: 200, body: listOrders(request) };",
                "}",
              ].join("\n"),
            },
            task:
              "Faça `handleV1` acrescentar os cabeçalhos `Deprecation`, `Sunset` e `Link` para a v2, contar o uso por " +
              "`apiKey`, e responder `410` depois da data.",
            hint: "`Date.prototype.toUTCString()` gera o formato de data HTTP. Compare `now` com a data de desligamento antes de decidir o status.",
            solution: {
              code: {
                language: "javascript",
                filename: "v1-endpoint.fixed.js",
                code: [
                  "const SUNSET = new Date(\"2026-12-31T23:59:59Z\");",
                  "const usage = new Map();",
                  "",
                  "function handleV1(request, now = new Date()) {",
                  "  usage.set(request.apiKey, (usage.get(request.apiKey) ?? 0) + 1);",
                  "",
                  "  const headers = {",
                  "    deprecation: \"true\",",
                  "    sunset: SUNSET.toUTCString(),",
                  "    link: \"</v2/orders>; rel=\\\"successor-version\\\"\",",
                  "  };",
                  "",
                  "  if (now >= SUNSET) {",
                  "    return { status: 410, headers, body: { title: \"Versão desligada\", detail: \"Migre para /v2/orders\" } };",
                  "  }",
                  "  return { status: 200, headers, body: listOrders(request) };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Os clientes passam a ser avisados em cada resposta, o contador mostra quem ainda depende da v1, e a data " +
                "de desligamento é aplicada com um 410 informativo.",
            },
          },
        }),
        concept({
          order: 140,
          title: "OpenAPI",
          requires: ["API Contract"],
          note: "spec-as-doc, Swagger UI, contract-first — absorve o SUGESTÃO 'API Documentation' deixado pelo Epic 03",
          summary:
            "Um formato padrão, em YAML ou JSON, para descrever uma API HTTP — endpoints, parâmetros, corpos, " +
            "respostas e autenticação — que serve ao mesmo tempo de documentação, de contrato e de base para " +
            "gerar código e testes.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "OpenAPI (antes chamado de Swagger) é uma especificação para escrever o contrato de uma API em uma " +
                "forma que humanos e máquinas leem. Um documento OpenAPI lista os caminhos, os métodos de cada um, os " +
                "parâmetros, o formato do corpo e das respostas (descritos com JSON Schema) e a segurança. Com ele, " +
                "geram-se páginas de documentação interativas (Swagger UI, Redoc), clientes e servidores em várias " +
                "linguagens, dublês para testes e validação automática de requisições e respostas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Descreva a API uma vez, em um formato padrão, e deixe as ferramentas gerarem a documentação, os " +
                "clientes e as verificações a partir dessa fonte.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Há duas formas de trabalhar. Contract-first: escreve-se a especificação antes do código, e ela guia a " +
                "implementação e os consumidores. Code-first: gera-se a especificação a partir do código (anotações, " +
                "esquemas de validação). Nos dois casos, o essencial é que a especificação e a implementação não se " +
                "afastem.",
            },
            {
              type: "code",
              language: "text",
              filename: "openapi.yaml",
              code: [
                "openapi: 3.1.0",
                "info: { title: API da Loja, version: 1.0.0 }",
                "paths:",
                "  /orders/{id}:",
                "    get:",
                "      summary: Busca um pedido",
                "      parameters:",
                "        - { name: id, in: path, required: true, schema: { type: string } }",
                "      responses:",
                "        '200':",
                "          description: O pedido",
                "          content:",
                "            application/json:",
                "              schema: { $ref: '#/components/schemas/Order' }",
                "        '404':",
                "          description: Pedido não encontrado",
                "components:",
                "  schemas:",
                "    Order:",
                "      type: object",
                "      required: [id, status, total]",
                "      properties:",
                "        id: { type: string }",
                "        status: { type: string, enum: [pending, paid, shipped] }",
                "        total: { type: integer, description: Valor em centavos }",
              ].join("\n"),
            },
            {
              type: "code",
              language: "javascript",
              filename: "openapi.js",
              code: [
                "// A especificação, lida como dados, pode dirigir o código: aqui, a checagem de uma resposta",
                "const spec = {",
                "  components: { schemas: { Order: {",
                "    type: \"object\",",
                "    required: [\"id\", \"status\", \"total\"],",
                "    properties: { id: { type: \"string\" }, status: { enum: [\"pending\", \"paid\", \"shipped\"] }, total: { type: \"integer\" } },",
                "  } } },",
                "};",
                "",
                "function conforms(schema, value) {",
                "  const problems = [];",
                "  for (const field of schema.required ?? []) if (!(field in value)) problems.push(`falta ${field}`);",
                "  for (const [field, rule] of Object.entries(schema.properties)) {",
                "    if (!(field in value)) continue;",
                "    if (rule.enum && !rule.enum.includes(value[field])) problems.push(`${field} fora do enum`);",
                "    if (rule.type === \"integer\" && !Number.isInteger(value[field])) problems.push(`${field} deve ser inteiro`);",
                "    if (rule.type === \"string\" && typeof value[field] !== \"string\") problems.push(`${field} deve ser texto`);",
                "  }",
                "  return problems;",
                "}",
                "",
                "conforms(spec.components.schemas.Order, { id: \"42\", status: \"paid\", total: 1990 });   // []",
                "conforms(spec.components.schemas.Order, { id: \"42\", status: \"lost\" });                // [\"falta total\", \"status fora do enum\"]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na prática, bibliotecas como Ajv fazem essa validação completa, seguindo o JSON Schema. A ideia é a " +
                "mesma: a especificação deixa de ser só um texto e passa a ser executável.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em qualquer API com consumidores externos ou de outras equipes, para ter uma documentação sempre em dia e um contrato explícito.",
                "Para gerar SDKs de clientes, dublês (mocks) para desenvolvimento e testes de contrato, e para validar as requisições e as respostas automaticamente.",
                "No contract-first, para que o front-end e o back-end trabalhem em paralelo a partir do mesmo acordo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma especificação escrita à mão e nunca verificada contra o código diverge da API real, e uma documentação errada é pior que nenhuma; automatize a verificação.",
                "Não expressa tudo: regras de negócio, ordem de chamadas e garantias de tempo ficam fora do esquema e precisam ser descritas em texto.",
                "Especificações grandes ficam difíceis de ler; divida em arquivos e reaproveite componentes com `$ref`.",
                "A qualidade do código gerado varia entre ferramentas e linguagens; muitas equipes usam a geração como ponto de partida, e não como código final.",
              ],
            },
          ],
          examples: [
            {
              title: "A documentação interativa",
              context: "A mesma especificação alimenta uma página em que se lê e se testa a API.",
              code: {
                language: "javascript",
                filename: "swagger-ui.js",
                code: [
                  "// Com o Swagger UI, servir a especificação vira uma página de documentação interativa",
                  "import swaggerUi from \"swagger-ui-express\";",
                  "import spec from \"./openapi.json\" with { type: \"json\" };",
                  "",
                  "app.use(\"/docs\", swaggerUi.serve, swaggerUi.setup(spec));",
                  "// GET /docs → lista os endpoints, os esquemas e permite executar chamadas de exemplo",
                ].join("\n"),
              },
              explanation:
                "Quem consome a API explora e experimenta sem instalar nada. Como a página vem da especificação, ela " +
                "acompanha as mudanças no contrato.",
            },
            {
              title: "Detectar a divergência entre a especificação e o código",
              context: "Uma verificação automática impede que a documentação envelheça sozinha.",
              code: {
                language: "javascript",
                filename: "spec-drift.js",
                code: [
                  "function drift(spec, implementedRoutes) {",
                  "  const documented = new Set(",
                  "    Object.entries(spec.paths).flatMap(([path, methods]) =>",
                  "      Object.keys(methods).map((method) => `${method.toUpperCase()} ${path}`)),",
                  "  );",
                  "  const implemented = new Set(implementedRoutes);",
                  "",
                  "  return {",
                  "    undocumented: [...implemented].filter((route) => !documented.has(route)),   // no código, fora da especificação",
                  "    unimplemented: [...documented].filter((route) => !implemented.has(route)),  // na especificação, fora do código",
                  "  };",
                  "}",
                  "",
                  "drift({ paths: { \"/orders/{id}\": { get: {} } } }, [\"GET /orders/{id}\", \"DELETE /orders/{id}\"]);",
                  "// { undocumented: [\"DELETE /orders/{id}\"], unimplemented: [] }",
                ].join("\n"),
              },
              explanation:
                "Rodar essa comparação no CI faz a integração falhar quando alguém acrescenta uma rota sem documentá-la, " +
                "ou documenta uma que não existe.",
            },
            {
              title: "Contract-first: o acordo antes do código",
              context: "Escrever a especificação primeiro permite que as equipes avancem em paralelo.",
              code: {
                language: "text",
                filename: "contract-first.txt",
                code: [
                  "1. As equipes acordam o contrato e o escrevem em openapi.yaml.",
                  "2. Front-end: gera o cliente e sobe um mock a partir do arquivo, e começa a trabalhar.",
                  "3. Back-end: implementa o servidor, validando as requisições contra o mesmo arquivo.",
                  "4. No CI: testes de contrato verificam se o servidor real cumpre o que o arquivo promete.",
                  "5. Mudanças no contrato passam por revisão, como qualquer alteração de código.",
                ].join("\n"),
              },
              explanation:
                "O contrato vira o ponto de sincronização entre as equipes. Nenhuma espera pela outra para começar, e o " +
                "teste no CI evita que as duas metades divirjam.",
            },
          ],
          exercise: {
            problem:
              "A documentação da API é um documento de texto mantido à mão. Já houve três rotas novas sem documentação e " +
              "uma rota documentada que foi removida do código.",
            problemCode: {
              language: "javascript",
              filename: "drift-check.js",
              code: [
                "const spec = { paths: { \"/orders\": { get: {}, post: {} }, \"/orders/{id}\": { get: {} } } };",
                "const implemented = [\"GET /orders\", \"POST /orders\", \"GET /orders/{id}\", \"DELETE /orders/{id}\", \"GET /health\"];",
                "",
                "function drift(spec, implemented) {",
                "  // devolver { undocumented, unimplemented }",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `drift`: liste as rotas do código que não estão na especificação, e as da especificação que " +
              "não existem no código.",
            hint: "Transforme a especificação em um conjunto de textos `MÉTODO caminho` e compare os dois conjuntos nos dois sentidos.",
            solution: {
              code: {
                language: "javascript",
                filename: "drift-check.fixed.js",
                code: [
                  "function drift(spec, implemented) {",
                  "  const documented = Object.entries(spec.paths).flatMap(([path, methods]) =>",
                  "    Object.keys(methods).map((method) => `${method.toUpperCase()} ${path}`),",
                  "  );",
                  "",
                  "  return {",
                  "    undocumented: implemented.filter((route) => !documented.includes(route)),",
                  "    unimplemented: documented.filter((route) => !implemented.includes(route)),",
                  "  };",
                  "}",
                  "",
                  "drift(spec, implemented);",
                  "// { undocumented: [\"DELETE /orders/{id}\", \"GET /health\"], unimplemented: [] }",
                ].join("\n"),
              },
              explanation:
                "A comparação nos dois sentidos revela as duas formas de divergência. Executada no CI, mantém a " +
                "especificação e o código alinhados sem depender da memória de ninguém.",
            },
          },
        }),
        concept({
          order: 150,
          title: "Middleware / Request Pipeline",
          requires: ["API"],
          isNew: true,
          note: "cadeia de handlers (auth, logging, rate limiting, validação) antes do controller. Ancora o Chain of Responsibility que o Epic 04 deixou como Advanced/Optional — o pattern continua SUGESTÃO no Epic 04, não é movido",
          summary:
            "Uma cadeia de funções por onde a requisição passa antes de chegar ao controlador — cada uma faz uma " +
            "tarefa transversal, como registrar, autenticar ou validar, e decide se passa adiante ou responde.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Middleware é uma função que fica entre o recebimento da requisição e o código que a trata. Ela recebe " +
                "a requisição, faz algo (registrar, autenticar, limitar, validar, comprimir) e chama `next()` para " +
                "passar ao próximo elo, ou responde por conta própria e encerra a cadeia. O conjunto forma um " +
                "pipeline: as preocupações que valem para muitas rotas ficam em peças reutilizáveis, e os controladores " +
                "só cuidam da regra da rota. É a aplicação do padrão Chain of Responsibility.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada middleware faz uma coisa, na ordem em que foi registrado, e decide se passa adiante: a ordem " +
                "da cadeia é parte do comportamento da API.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Cada função recebe o contexto da requisição e uma função `next`. Chamar `next()` executa o restante " +
                "da cadeia, e o código depois do `await next()` roda na volta, como em camadas de cebola (modelo do " +
                "Koa). Quem não chama `next()` interrompe a cadeia, o que permite recusar uma requisição cedo, sem " +
                "custo para as etapas seguintes.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "middleware.js",
              code: [
                "// compose: junta as funções em uma só, garantindo a ordem e o `next`",
                "function compose(middlewares) {",
                "  return (context) => {",
                "    let index = -1;",
                "    const dispatch = async (i) => {",
                "      if (i <= index) throw new Error(\"next() chamado mais de uma vez\");",
                "      index = i;",
                "      const middleware = middlewares[i];",
                "      if (!middleware) return;",
                "      await middleware(context, () => dispatch(i + 1));",
                "    };",
                "    return dispatch(0);",
                "  };",
                "}",
                "",
                "const logger = async (context, next) => {",
                "  const start = Date.now();",
                "  await next();                                            // executa o resto da cadeia",
                "  console.log(`${context.method} ${context.path} → ${context.status} (${Date.now() - start} ms)`);",
                "};",
                "",
                "const authenticate = async (context, next) => {",
                "  if (context.headers.authorization !== \"Bearer segredo\") {",
                "    context.status = 401;                                  // responde e NÃO chama next()",
                "    return;",
                "  }",
                "  context.user = { id: 1 };",
                "  await next();",
                "};",
                "",
                "const controller = async (context) => { context.status = 200; context.body = { ola: context.user.id }; };",
                "",
                "const handle = compose([logger, authenticate, controller]);",
                "",
                "await handle({ method: \"GET\", path: \"/perfil\", headers: {} });   // 401, e o `controller` nem chega a rodar",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O `logger` envolve todo o resto e mede o tempo, mesmo quando a autenticação recusa a requisição. A " +
                "ordem importa: se o `authenticate` viesse antes do `logger`, as requisições recusadas não seriam " +
                "registradas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para preocupações transversais, que valem para muitas rotas: registro, autenticação, limitação de taxa, CORS, compressão, validação, identificação da requisição.",
                "Quando se quer reaproveitar e combinar comportamentos sem repeti-los em cada controlador.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Regras de negócio dentro de middleware ficam escondidas do fluxo de cada rota, e são difíceis de encontrar e de testar; o middleware é para o que é transversal.",
                "A ordem é uma fonte de bugs: um middleware de autorização antes do de autenticação, ou um tratador de erros registrado no lugar errado, comporta-se de forma silenciosamente incorreta.",
                "Cadeias longas dificultam a depuração e acrescentam latência a toda requisição; cada elo precisa se justificar.",
                "Esquecer de chamar `next()`, ou chamá-lo duas vezes, trava ou duplica o processamento; a função `compose` deve proteger contra isso.",
              ],
            },
          ],
          examples: [
            {
              title: "A ordem muda o resultado",
              context: "A mesma lista de middlewares, em ordens diferentes, se comporta de modo diferente.",
              code: {
                language: "javascript",
                filename: "order.js",
                code: [
                  "// Limitar a taxa ANTES de autenticar: protege o sistema de autenticação, que é caro",
                  "compose([rateLimit, authenticate, controller]);",
                  "",
                  "// Autenticar ANTES de limitar: dá para limitar por usuário, mas só depois de pagar o custo do login",
                  "compose([authenticate, rateLimit, controller]);",
                  "",
                  "// Tratador de erros: precisa ENVOLVER os demais, e por isso fica primeiro na cadeia",
                  "compose([errorHandler, logger, authenticate, controller]);",
                ].join("\n"),
              },
              explanation:
                "Não há uma ordem certa universal: cada uma reflete uma decisão. O importante é que ela seja deliberada e " +
                "documentada.",
            },
            {
              title: "Um tratador de erros que envolve a cadeia",
              context: "Como o middleware pode envolver os seguintes, um `try/catch` central converte falhas em respostas.",
              code: {
                language: "javascript",
                filename: "error-handler.js",
                code: [
                  "const errorHandler = async (context, next) => {",
                  "  try {",
                  "    await next();",
                  "  } catch (error) {",
                  "    context.status = error.status ?? 500;",
                  "    context.body = { title: error.status ? error.message : \"Erro interno\" };",
                  "  }",
                  "};",
                  "",
                  "const failing = async () => { throw Object.assign(new Error(\"pedido não encontrado\"), { status: 404 }); };",
                  "",
                  "const context = { headers: {} };",
                  "await compose([errorHandler, failing])(context);",
                  "context.status;   // 404 — o erro virou uma resposta, sem código de tratamento em cada rota",
                ].join("\n"),
              },
              explanation:
                "Toda exceção lançada mais adiante na cadeia é capturada em um só lugar. Os controladores só lançam, e a " +
                "conversão em resposta é feita uma vez.",
            },
            {
              title: "Middleware com configuração",
              context: "Uma função que devolve um middleware permite reaproveitá-lo com parâmetros diferentes.",
              code: {
                language: "javascript",
                filename: "configurable.js",
                code: [
                  "function requireRole(role) {",
                  "  return async (context, next) => {",
                  "    if (!context.user?.roles.includes(role)) {",
                  "      context.status = 403;",
                  "      return;",
                  "    }",
                  "    await next();",
                  "  };",
                  "}",
                  "",
                  "const adminRoute = compose([authenticate, requireRole(\"admin\"), controller]);",
                  "const staffRoute = compose([authenticate, requireRole(\"staff\"), controller]);",
                ].join("\n"),
              },
              explanation:
                "O mesmo comportamento serve a rotas diferentes, com a configuração no ponto de uso. É a forma usual de " +
                "expressar autorização por rota.",
            },
          ],
          exercise: {
            problem:
              "Cada rota repete o mesmo código: registrar a chamada, checar o token e medir o tempo. Uma delas esqueceu a " +
              "checagem do token e ficou aberta.",
            problemCode: {
              language: "javascript",
              filename: "repeated-code.js",
              code: [
                "async function getOrders(context) {",
                "  console.log(\"GET /orders\");",
                "  if (context.headers.authorization !== \"Bearer segredo\") { context.status = 401; return; }",
                "  context.status = 200;",
                "  context.body = [];",
                "}",
                "",
                "async function getInvoices(context) {",
                "  console.log(\"GET /invoices\");",
                "  // esqueceu a checagem do token",
                "  context.status = 200;",
                "  context.body = [];",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `compose(middlewares)` e refatore: um middleware `authenticate` (401 sem o token) e os dois " +
              "controladores só com a regra da rota.",
            hint: "O `compose` chama o elo `i` com uma função `next` que executa o elo `i + 1`. O `authenticate` só chama `next()` se o token for válido.",
            solution: {
              code: {
                language: "javascript",
                filename: "repeated-code.fixed.js",
                code: [
                  "function compose(middlewares) {",
                  "  return (context) => {",
                  "    const dispatch = async (i) => {",
                  "      const middleware = middlewares[i];",
                  "      if (middleware) await middleware(context, () => dispatch(i + 1));",
                  "    };",
                  "    return dispatch(0);",
                  "  };",
                  "}",
                  "",
                  "const authenticate = async (context, next) => {",
                  "  if (context.headers.authorization !== \"Bearer segredo\") { context.status = 401; return; }",
                  "  await next();",
                  "};",
                  "",
                  "const getOrders = async (context) => { context.status = 200; context.body = []; };",
                  "const getInvoices = async (context) => { context.status = 200; context.body = []; };",
                  "",
                  "const routes = {",
                  "  \"GET /orders\": compose([authenticate, getOrders]),",
                  "  \"GET /invoices\": compose([authenticate, getInvoices]),   // agora protegida também",
                  "};",
                  "",
                  "const context = { headers: {} };",
                  "await routes[\"GET /invoices\"](context);",
                  "context.status;   // 401",
                ].join("\n"),
              },
              explanation:
                "A autenticação passou a ser um elo comum, e nenhuma rota consegue esquecê-la se estiver na cadeia. Os " +
                "controladores ficaram só com a regra de cada rota.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "graphql",
      order: 30,
      title: "GraphQL",
      requires: ["API Fundamentals"],
      summary:
        "Schema & type system → operações raiz → resolver → N+1 em resolvers (revisita de Database Performance) → " +
        "batching & per-request caching → query complexity → GraphQL vs REST. Versão enxuta (18→7).",
      suggestions: [
        "Arguments, Variables, Fragments, Interfaces, Unions, Persisted Queries, Error Handling — retirados no trimming",
      ],
      concepts: [
        concept({
          order: 10,
          title: "GraphQL Schema & Type System",
          subtopics: ["SDL", "scalars/object/enum/input types", "nullability", "schema como contrato"],
          note: "consolidada (A13) — absorve Nullability",
          summary:
            "O contrato de uma API GraphQL: um esquema tipado, escrito em SDL, que declara os tipos, os campos " +
            "e o que pode ser nulo — e que cliente e servidor usam como fonte única de verdade.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "GraphQL é uma linguagem de consulta para APIs, e tudo nela parte do esquema (schema), escrito na " +
                "SDL (Schema Definition Language). O esquema declara os tipos que existem, os campos de cada um e como " +
                "eles se relacionam. Os tipos escalares (`Int`, `Float`, `String`, `Boolean`, `ID`) são as folhas, os " +
                "tipos de objeto agrupam campos, os enums restringem valores, e os tipos de entrada (`input`) descrevem " +
                "os argumentos complexos. O servidor só executa o que o esquema permite, e o cliente só pede o que " +
                "ele declara: é a forma mais forte de API Contract.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O esquema é o contrato tipado da API: define o que pode ser pedido, o formato de cada resposta e o " +
                "que pode faltar — e ferramentas e validações nascem dele.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Tipos de objeto (`type Order { ... }`) têm campos, e cada campo tem um tipo.",
                "Nulidade explícita: por padrão todo campo pode ser `null`; o `!` (`String!`) declara que nunca é nulo. Em listas, `[Order!]!` significa uma lista que existe e cujos itens nunca são nulos.",
                "`enum` restringe a um conjunto de valores; `input` descreve os argumentos estruturados (só serve para entrada); `ID` é um identificador opaco, serializado como texto.",
                "O tipo `Query` é a raiz das leituras, e é o ponto de partida de toda consulta.",
                "O esquema é introspectável: o cliente pode perguntar ao servidor quais tipos e campos existem, o que alimenta documentação, autocompletar e geração de código.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "schema.js",
              code: [
                "import { buildSchema, graphql } from \"graphql\";",
                "",
                "const schema = buildSchema(`",
                "  enum OrderStatus { PENDING PAID SHIPPED }",
                "",
                "  type Customer {",
                "    id: ID!",
                "    name: String!",
                "    email: String        # pode ser null: nem todo cliente tem e-mail",
                "  }",
                "",
                "  type OrderItem { product: String!, quantity: Int! }",
                "",
                "  type Order {",
                "    id: ID!",
                "    status: OrderStatus!",
                "    total: Int!          # em centavos",
                "    customer: Customer!",
                "    items: [OrderItem!]!",
                "  }",
                "",
                "  type Query {",
                "    order(id: ID!): Order   # nulo se não existir",
                "  }",
                "`);",
                "",
                "const rootValue = {",
                "  order: ({ id }) => ({",
                "    id, status: \"PAID\", total: 1990,",
                "    customer: { id: \"7\", name: \"Ana\", email: null },",
                "    items: [{ product: \"caneta\", quantity: 2 }],",
                "  }),",
                "};",
                "",
                "const result = await graphql({",
                "  schema,",
                "  rootValue,",
                "  source: `{ order(id: \"42\") { status customer { name email } items { product } } }`,",
                "});",
                "",
                "result.data;",
                "// { order: { status: \"PAID\", customer: { name: \"Ana\", email: null }, items: [{ product: \"caneta\" }] } }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A consulta pediu só alguns campos, e só eles vieram. Pedir um campo que o esquema não declara falha " +
                "na validação, antes de qualquer código do servidor rodar.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Marcar tudo com `!` parece mais seguro, mas um erro em um campo não nulo faz o `null` subir até o pai nulável mais próximo: um campo secundário que falha pode anular a resposta inteira.",
                "Tornar obrigatório (`!`) um campo que era opcional na saída é uma quebra de contrato para quem escreve, e retirar o `!` de um campo de saída quebra clientes que assumiam que ele existia.",
                "Tipos de entrada e de saída são separados: não se usa um `type` como argumento, e é preciso declarar um `input` equivalente.",
                "Remover ou renomear um campo quebra os clientes que o pedem; em vez de versionar, o caminho é deprecar (`@deprecated`) e remover depois.",
                "O `ID` é sempre texto na resposta, mesmo que o valor guardado seja numérico.",
              ],
            },
          ],
          examples: [
            {
              title: "Como um erro se propaga com campos não nulos",
              context: "A nulidade decide o tamanho do estrago quando um campo falha.",
              code: {
                language: "javascript",
                filename: "null-propagation.js",
                code: [
                  "// customer: Customer!  (não nulo)  →  o erro anula o pedido inteiro",
                  "// customer: Customer   (nulável)   →  só o cliente fica null, e o resto da resposta sobrevive",
                  "",
                  "const rootValue = {",
                  "  order: () => ({",
                  "    id: \"42\",",
                  "    customer() { throw new Error(\"serviço de clientes fora do ar\"); },",
                  "  }),",
                  "};",
                  "",
                  "// Com `customer: Customer!`",
                  "// { data: { order: null }, errors: [{ message: \"serviço de clientes fora do ar\", path: [\"order\", \"customer\"] }] }",
                  "",
                  "// Com `customer: Customer`",
                  "// { data: { order: { id: \"42\", customer: null } }, errors: [ ... ] }",
                ].join("\n"),
              },
              explanation:
                "Campos que dependem de outros serviços, e podem falhar, são bons candidatos a ser nuláveis: a resposta " +
                "parcial ainda é útil. Reserve o `!` para o que o servidor consegue sempre garantir.",
            },
            {
              title: "Enums e tipos de entrada",
              context: "Restringem os valores aceitos e estruturam os argumentos das operações.",
              code: {
                language: "text",
                filename: "input-types.graphql",
                code: [
                  "enum OrderStatus { PENDING PAID SHIPPED }",
                  "",
                  "input OrderItemInput { productId: ID!, quantity: Int! }",
                  "",
                  "input NewOrderInput {",
                  "  customerId: ID!",
                  "  items: [OrderItemInput!]!",
                  "  note: String",
                  "}",
                  "",
                  "type Mutation {",
                  "  createOrder(input: NewOrderInput!): Order!",
                  "}",
                  "",
                  "# Uma consulta com um status inexistente é recusada na validação:",
                  "#   orders(status: CANCELLED)   → erro: valor não faz parte do enum OrderStatus",
                ].join("\n"),
              },
              explanation:
                "O servidor nem executa um pedido com um valor fora do enum ou com um campo obrigatório ausente. A " +
                "validação vem do esquema, sem código escrito à mão.",
            },
            {
              title: "Evoluir sem versionar: `@deprecated`",
              context: "GraphQL prefere adicionar e deprecar campos a criar versões da API.",
              code: {
                language: "javascript",
                filename: "deprecated.js",
                code: [
                  "import { buildSchema } from \"graphql\";",
                  "",
                  "const schema = buildSchema(`",
                  "  type Order {",
                  "    id: ID!",
                  "    total: Int! @deprecated(reason: \"Use totalInCents\")",
                  "    totalInCents: Int!",
                  "  }",
                  "  type Query { order(id: ID!): Order }",
                  "`);",
                  "",
                  "schema.getType(\"Order\").getFields().total.deprecationReason;   // \"Use totalInCents\"",
                  "// O campo continua funcionando; as ferramentas (GraphiQL, editores) o mostram como depreciado.",
                ].join("\n"),
              },
              explanation:
                "Os clientes antigos seguem funcionando, e os novos veem o aviso. Como o esquema mostra quem pede o quê, " +
                "é possível saber quando o campo antigo já pode ser removido.",
            },
          ],
          exercise: {
            problem:
              "Uma livraria precisa expor livros. Cada livro tem título, subtítulo (nem todos têm), ISBN, preço em " +
              "centavos, data de publicação (desconhecida para alguns), lista de tags (pode ser vazia, mas existe " +
              "sempre) e um autor (sempre presente).",
            problemCode: {
              language: "javascript",
              filename: "bookstore.js",
              code: [
                "import { buildSchema } from \"graphql\";",
                "",
                "const schema = buildSchema(`",
                "  # TODO: type Author { ... }",
                "  # TODO: type Book { ... }",
                "  # TODO: type Query { book(isbn: ID!): Book, books: [Book!]! }",
                "`);",
              ].join("\n"),
            },
            task:
              "Escreva a SDL com a nulidade correta para cada campo: o que é sempre garantido leva `!`, e o que pode " +
              "faltar fica nulável.",
            hint: "Subtítulo e data de publicação podem faltar. As tags são uma lista que sempre existe, e cujos itens nunca são nulos.",
            solution: {
              code: {
                language: "javascript",
                filename: "bookstore.fixed.js",
                code: [
                  "import { buildSchema } from \"graphql\";",
                  "",
                  "const schema = buildSchema(`",
                  "  type Author {",
                  "    id: ID!",
                  "    name: String!",
                  "  }",
                  "",
                  "  type Book {",
                  "    isbn: ID!",
                  "    title: String!",
                  "    subtitle: String            # nem todo livro tem",
                  "    priceInCents: Int!",
                  "    publishedAt: String         # desconhecida para alguns",
                  "    tags: [String!]!            # a lista sempre existe (pode ser vazia); os itens nunca são nulos",
                  "    author: Author!",
                  "  }",
                  "",
                  "  type Query {",
                  "    book(isbn: ID!): Book       # pode não existir: nulável",
                  "    books: [Book!]!",
                  "  }",
                  "`);",
                  "",
                  "String(schema.getType(\"Book\").getFields().subtitle.type);   // \"String\"",
                  "String(schema.getType(\"Book\").getFields().tags.type);       // \"[String!]!\"",
                ].join("\n"),
              },
              explanation:
                "O `!` só aparece onde o servidor consegue garantir o valor. `book` é nulável porque um ISBN pode não " +
                "existir. Em `books: [Book!]!`, nem a lista nem os itens são nulos: se a resolução de um item falhar, o " +
                "erro sobe e anula a lista inteira. Para tolerar falhas isoladas, `[Book]!` permitiria itens nulos.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Query / Mutation / Subscription",
          requires: ["GraphQL Schema & Type System"],
          subtopics: ["query (leitura)", "mutation (escrita)", "subscription (tempo real — revisita WebSocket)"],
          note: "consolidada (A14)",
          summary:
            "Os três tipos de operação do GraphQL: query para ler, mutation para escrever e subscription para " +
            "receber eventos em tempo real — cada um começando em um tipo raiz do esquema.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Toda requisição GraphQL é uma operação de um de três tipos. Query lê dados, e não deveria ter efeitos " +
                "colaterais. Mutation altera dados, e é a que muda o estado do sistema. Subscription abre um fluxo de " +
                "longa duração em que o servidor envia resultados a cada evento, em geral sobre WebSocket (Web " +
                "Fundamentals). É a mesma separação de Command-Query Separation, aplicada à API: leitura de um lado, " +
                "escrita de outro. Uma operação pode receber variáveis, valores tipados enviados junto da consulta.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Ler, escrever e assistir são operações distintas com regras de execução diferentes: consultas podem " +
                "rodar em paralelo, mutações rodam em série, e subscrições permanecem abertas.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Query: campos resolvidos possivelmente em paralelo; o cliente escolhe exatamente o que quer receber.",
                "Mutation: os campos de nível raiz são executados um de cada vez, na ordem em que aparecem, para que os efeitos sejam previsíveis; por convenção devolve o objeto alterado, para o cliente atualizar a sua visão.",
                "Subscription: o cliente assina um evento, e o servidor envia um resultado a cada ocorrência, sobre uma conexão persistente (por exemplo, o protocolo `graphql-ws`).",
                "Variáveis (`$id: ID!`) separam o valor da consulta: a consulta é fixa, e os valores vêm à parte, tipados e validados.",
                "Uma única URL (em geral `/graphql`) atende as três, com o tipo de operação no documento.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "operations.js",
              code: [
                "import { buildSchema, graphql } from \"graphql\";",
                "",
                "const schema = buildSchema(`",
                "  type Order { id: ID!, status: String! }",
                "  type Query { order(id: ID!): Order }",
                "  type Mutation { cancelOrder(id: ID!): Order! }",
                "`);",
                "",
                "const orders = new Map([[\"42\", { id: \"42\", status: \"PAID\" }]]);",
                "const rootValue = {",
                "  order: ({ id }) => orders.get(id) ?? null,",
                "  cancelOrder: ({ id }) => { orders.get(id).status = \"CANCELLED\"; return orders.get(id); },",
                "};",
                "",
                "// Query, com variável",
                "await graphql({",
                "  schema, rootValue,",
                "  source: `query ($id: ID!) { order(id: $id) { status } }`,",
                "  variableValues: { id: \"42\" },",
                "});                                          // { data: { order: { status: \"PAID\" } } }",
                "",
                "// Mutation: devolve o objeto alterado",
                "await graphql({",
                "  schema, rootValue,",
                "  source: `mutation { cancelOrder(id: \"42\") { id status } }`,",
                "});                                          // { data: { cancelOrder: { id: \"42\", status: \"CANCELLED\" } } }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A mutação devolve o pedido já alterado, então o cliente atualiza a tela sem uma segunda consulta.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma consulta com erro geralmente responde HTTP 200, e o erro vai no campo `errors` do corpo: o cliente precisa checá-lo, e os monitores baseados em status HTTP não enxergam as falhas.",
                "Montar a consulta concatenando valores em texto reabre o risco de injeção e impede o cache de consultas; use sempre variáveis.",
                "Uma query que altera estado, por conveniência, quebra as garantias (caches, repetição segura); escrita pertence a uma mutation.",
                "Vários campos de mutation em um mesmo documento rodam em série, e o segundo pode depender do primeiro; mas não formam uma transação: se o segundo falha, o primeiro já foi aplicado.",
                "Subscriptions exigem conexões persistentes: têm custo de infraestrutura, e escalá-las pede um barramento de eventos entre as instâncias.",
              ],
            },
          ],
          examples: [
            {
              title: "Variáveis em vez de concatenação",
              context: "A consulta fica fixa, e os valores chegam tipados e separados.",
              code: {
                language: "javascript",
                filename: "variables.js",
                code: [
                  "const userInput = 'x\") { id } evil: order(id: \"1';   // tentativa de alterar a consulta",
                  "",
                  "// Perigoso: o texto do usuário vira parte da consulta",
                  "const unsafe = `{ order(id: \"${userInput}\") { status } }`;",
                  "",
                  "// Seguro: o valor viaja à parte, como dado",
                  "const safe = {",
                  "  query: \"query ($id: ID!) { order(id: $id) { status } }\",",
                  "  variables: { id: userInput },   // é só um ID (inexistente), e nunca é interpretado como consulta",
                  "};",
                  "",
                  "await fetch(\"/graphql\", { method: \"POST\", headers: { \"content-type\": \"application/json\" }, body: JSON.stringify(safe) });",
                ].join("\n"),
              },
              explanation:
                "Com variáveis, o servidor valida o valor contra o tipo declarado, e ele nunca é analisado como código. " +
                "O mesmo documento também pode ser reaproveitado e guardado em cache.",
            },
            {
              title: "Mutações em série",
              context: "A ordem dos campos de mutation é a ordem de execução.",
              code: {
                language: "javascript",
                filename: "serial-mutations.js",
                code: [
                  "const log = [];",
                  "const rootValue = {",
                  "  first: async () => { await new Promise((r) => setTimeout(r, 50)); log.push(\"first\"); return 1; },",
                  "  second: () => { log.push(\"second\"); return 2; },",
                  "};",
                  "const schema = buildSchema(`type Query { x: Int }  type Mutation { first: Int, second: Int }`);",
                  "",
                  "await graphql({ schema, rootValue, source: `mutation { first second }` });",
                  "log;   // [\"first\", \"second\"] — a segunda só começou depois de a primeira terminar",
                  "",
                  "// Em uma query, os dois campos seriam iniciados juntos, e o mais rápido terminaria antes.",
                ].join("\n"),
              },
              explanation:
                "A execução em série dá previsibilidade às escritas, mesmo que a primeira seja mais lenta. Cada mutação " +
                "ainda assim é uma operação separada, sem garantia de transação entre elas.",
            },
            {
              title: "Subscription: o servidor envia os eventos",
              context: "O cliente assina uma vez e recebe um resultado a cada evento.",
              code: {
                language: "javascript",
                filename: "subscription.js",
                code: [
                  "import { GraphQLObjectType, GraphQLSchema, GraphQLString, parse, subscribe } from \"graphql\";",
                  "",
                  "const schema = new GraphQLSchema({",
                  "  query: new GraphQLObjectType({ name: \"Query\", fields: { ping: { type: GraphQLString } } }),",
                  "  subscription: new GraphQLObjectType({",
                  "    name: \"Subscription\",",
                  "    fields: {",
                  "      orderPaid: {",
                  "        type: GraphQLString,",
                  "        subscribe: async function* () { yield { orderPaid: \"pedido 1\" }; yield { orderPaid: \"pedido 2\" }; },",
                  "      },",
                  "    },",
                  "  }),",
                  "});",
                  "",
                  "const stream = await subscribe({ schema, document: parse(\"subscription { orderPaid }\") });",
                  "",
                  "for await (const result of stream) console.log(result.data.orderPaid);   // \"pedido 1\", depois \"pedido 2\"",
                ].join("\n"),
              },
              explanation:
                "Cada evento vira uma resposta completa. Em produção, o iterador é alimentado por um barramento de " +
                "eventos, e o transporte até o navegador é um WebSocket.",
            },
          ],
          exercise: {
            problem:
              "Uma tela de pedido faz três chamadas REST: o pedido, o cliente e os itens. Além disso, o botão " +
              "\"cancelar\" precisa alterar o pedido e mostrar o novo status.",
            problemCode: {
              language: "javascript",
              filename: "rest-calls.js",
              code: [
                "const order = await fetch(\"/orders/42\").then((r) => r.json());",
                "const customer = await fetch(`/customers/${order.customerId}`).then((r) => r.json());",
                "const items = await fetch(\"/orders/42/items\").then((r) => r.json());",
                "",
                "await fetch(\"/orders/42/cancellation\", { method: \"POST\" });",
                "const updated = await fetch(\"/orders/42\").then((r) => r.json());   // outra chamada para saber o status",
              ].join("\n"),
            },
            task:
              "Escreva a query única (com variável `$id`) que traz o status, o nome do cliente e os produtos dos itens, e " +
              "a mutation `cancelOrder` que devolve o pedido com o novo status.",
            hint: "A query pede os campos aninhados de uma vez. A mutation deve selecionar `id` e `status` do resultado.",
            solution: {
              code: {
                language: "javascript",
                filename: "rest-calls.fixed.js",
                code: [
                  "const orderQuery = `",
                  "  query OrderScreen($id: ID!) {",
                  "    order(id: $id) {",
                  "      status",
                  "      customer { name }",
                  "      items { product quantity }",
                  "    }",
                  "  }",
                  "`;",
                  "",
                  "const cancelMutation = `",
                  "  mutation Cancel($id: ID!) {",
                  "    cancelOrder(id: $id) { id status }",
                  "  }",
                  "`;",
                  "",
                  "const call = (query, variables) =>",
                  "  fetch(\"/graphql\", {",
                  "    method: \"POST\",",
                  "    headers: { \"content-type\": \"application/json\" },",
                  "    body: JSON.stringify({ query, variables }),",
                  "  }).then((r) => r.json());",
                  "",
                  "const { data } = await call(orderQuery, { id: \"42\" });                       // uma chamada",
                  "const { data: after } = await call(cancelMutation, { id: \"42\" });            // já traz o novo status",
                ].join("\n"),
              },
              explanation:
                "Uma ida ao servidor substitui as três chamadas, e a mutation devolve o estado novo, o que dispensa a " +
                "consulta extra. As variáveis mantêm o texto das operações fixo.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Resolver",
          requires: ["GraphQL Schema & Type System"],
          note: "função por campo; resolver chain",
          summary:
            "A função que devolve o valor de um campo do esquema: o servidor executa uma consulta chamando o " +
            "resolver de cada campo pedido, do topo para as folhas, passando o resultado de um ao próximo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O esquema diz o que existe, e os resolvers dizem de onde vem cada valor. Cada campo tem um resolver: " +
                "uma função `(parent, args, context, info)` que devolve o valor do campo. `parent` é o resultado do " +
                "resolver do campo pai, `args` são os argumentos da consulta, `context` é um objeto compartilhado " +
                "durante a requisição (usuário, conexões, loaders), e `info` descreve a consulta. Quando não há um " +
                "resolver explícito, o padrão devolve `parent[nomeDoCampo]`. A execução percorre a consulta em " +
                "cadeia: o resolver de `order` devolve o pedido, e o de `order.customer` recebe esse pedido.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada campo pedido é resolvido por uma função própria, e o resultado de um alimenta o resolver dos " +
                "campos filhos: só o que a consulta pediu é executado.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "resolvers.js",
              code: [
                "import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, graphql } from \"graphql\";",
                "",
                "const db = {",
                "  customers: { 7: { id: \"7\", name: \"Ana\" } },",
                "  orders: { 42: { id: \"42\", customerId: \"7\", subtotal: 1800, shipping: 190 } },",
                "};",
                "",
                "const Customer = new GraphQLObjectType({",
                "  name: \"Customer\",",
                "  fields: { name: { type: new GraphQLNonNull(GraphQLString) } },   // sem resolver: usa parent.name",
                "});",
                "",
                "const Order = new GraphQLObjectType({",
                "  name: \"Order\",",
                "  fields: {",
                "    id: { type: new GraphQLNonNull(GraphQLID) },",
                "    // campo calculado: não existe no dado, e o resolver o produz",
                "    total: { type: new GraphQLNonNull(GraphQLInt), resolve: (order) => order.subtotal + order.shipping },",
                "    // campo relacionado: busca o cliente usando o `parent` (o pedido) e o `context`",
                "    customer: {",
                "      type: new GraphQLNonNull(Customer),",
                "      resolve: (order, args, context) => context.db.customers[order.customerId],",
                "    },",
                "  },",
                "});",
                "",
                "const schema = new GraphQLSchema({",
                "  query: new GraphQLObjectType({",
                "    name: \"Query\",",
                "    fields: {",
                "      order: {",
                "        type: Order,",
                "        args: { id: { type: new GraphQLNonNull(GraphQLID) } },",
                "        resolve: (_parent, { id }, context) => context.db.orders[id] ?? null,",
                "      },",
                "    },",
                "  }),",
                "});",
                "",
                "await graphql({ schema, contextValue: { db }, source: `{ order(id: \"42\") { total customer { name } } }` });",
                "// { data: { order: { total: 1990, customer: { name: \"Ana\" } } } }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A cadeia foi `Query.order`, depois `Order.total` e `Order.customer`, e depois `Customer.name`. O " +
                "campo `id`, que não foi pedido, não teve o seu resolver executado.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um resolver por campo, para uma lista de itens, é chamado uma vez por item: um resolver que consulta o banco vira uma consulta por item, o problema N+1 (visto em Database Performance).",
                "Colocar regras de negócio e de autorização dentro dos resolvers as espalha pelo esquema; mantenha os resolvers finos, delegando a serviços do domínio, para que a mesma regra valha em qualquer entrada.",
                "Um erro em um resolver não derruba a consulta toda: o campo vira `null` (se nulável) e o erro entra em `errors`, e a resposta chega parcial; o cliente precisa considerar isso.",
                "O `context` deve ser criado por requisição: guardar dados de um usuário em um objeto global vaza informação entre requisições.",
                "Se `parent` não tem a propriedade e não há resolver, o campo simplesmente vem `null`, sem erro, o que esconde erros de digitação nos nomes.",
              ],
            },
          ],
          examples: [
            {
              title: "O resolver padrão",
              context: "Quando o dado já tem a propriedade certa, não é preciso escrever nada.",
              code: {
                language: "javascript",
                filename: "default-resolver.js",
                code: [
                  "// O tipo Customer não declara resolvers. O padrão devolve parent[nomeDoCampo]:",
                  "//   Customer.name  →  parent.name",
                  "",
                  "// Se o valor for uma função, o padrão a chama com (args, context, info):",
                  "const rootValue = {",
                  "  order: () => ({",
                  "    id: \"42\",",
                  "    greeting: ({ name }) => `Olá, ${name}!`,   // chamada com os argumentos do campo",
                  "  }),",
                  "};",
                  "// { order { greeting(name: \"Ana\") } }  →  { order: { greeting: \"Olá, Ana!\" } }",
                ].join("\n"),
              },
              explanation:
                "Por isso um esquema construído por SDL funciona só com objetos comuns. Escrever resolvers é necessário " +
                "quando o valor é calculado, vem de outra fonte ou precisa de argumentos.",
            },
            {
              title: "O contexto por requisição",
              context: "O `context` carrega o que pertence a uma requisição: usuário, conexões e loaders.",
              code: {
                language: "javascript",
                filename: "context.js",
                code: [
                  "// Criado uma vez por requisição HTTP, e não uma vez para o processo",
                  "async function buildContext(request) {",
                  "  const user = await authenticate(request.headers.authorization);",
                  "  return { user, db, loaders: createLoaders(db) };",
                  "}",
                  "",
                  "// Um resolver usa o contexto para decidir o que devolver",
                  "const resolveMyOrders = (_parent, _args, context) => {",
                  "  if (!context.user) throw new Error(\"não autenticado\");",
                  "  return context.db.ordersOf(context.user.id);",
                  "};",
                ].join("\n"),
              },
              explanation:
                "Cada requisição tem o seu contexto, e por isso o usuário de uma nunca aparece em outra. É também aqui " +
                "que se pendura o que precisa viver só durante a requisição, como os loaders de batching.",
            },
            {
              title: "Erros parciais",
              context: "Um campo que falha não derruba os outros que foram pedidos.",
              code: {
                language: "javascript",
                filename: "partial-errors.js",
                code: [
                  "// Query: { order(id: \"42\") { id shipmentStatus } }",
                  "// shipmentStatus (nulável) depende de um serviço externo que está fora do ar",
                  "",
                  "// Resposta:",
                  "// {",
                  "//   data: { order: { id: \"42\", shipmentStatus: null } },",
                  "//   errors: [{ message: \"serviço de entregas indisponível\", path: [\"order\", \"shipmentStatus\"] }]",
                  "// }",
                  "",
                  "const { data, errors } = await response.json();",
                  "if (errors) reportErrors(errors);            // o cliente decide o que fazer com o parcial",
                  "renderOrder(data.order);                     // o resto da tela continua funcionando",
                ].join("\n"),
              },
              explanation:
                "A resposta parcial é uma característica do GraphQL: a tela mostra o que está disponível. Por isso o " +
                "cliente precisa olhar `errors`, mesmo quando o status HTTP é 200.",
            },
          ],
          exercise: {
            problem:
              "O esquema de produtos declara `finalPrice` e `category`, mas os objetos do banco só têm `price`, " +
              "`discountPercent` e `categoryId`. Os dois campos vêm sempre `null`.",
            problemCode: {
              language: "javascript",
              filename: "product-resolvers.js",
              code: [
                "const db = {",
                "  categories: { 3: { id: \"3\", name: \"Papelaria\" } },",
                "  products: { 1: { id: \"1\", name: \"caneta\", price: 500, discountPercent: 10, categoryId: \"3\" } },",
                "};",
                "",
                "// Esquema (SDL):",
                "//   type Category { name: String! }",
                "//   type Product { id: ID!  name: String!  finalPrice: Int!  category: Category! }",
                "",
                "const resolvers = {",
                "  Product: {},   // sem resolvers: finalPrice e category vêm null",
                "};",
              ].join("\n"),
            },
            task:
              "Escreva os resolvers de `Product.finalPrice` (preço com o desconto aplicado, em centavos inteiros) e de " +
              "`Product.category` (buscada no `context.db` pelo `categoryId`).",
            hint: "`parent` é o produto do banco. `finalPrice` = `price * (100 - discountPercent) / 100`, arredondado. A categoria vem de `context.db.categories`.",
            solution: {
              code: {
                language: "javascript",
                filename: "product-resolvers.fixed.js",
                code: [
                  "const resolvers = {",
                  "  Product: {",
                  "    finalPrice: (product) => Math.round((product.price * (100 - product.discountPercent)) / 100),",
                  "    category: (product, _args, context) => context.db.categories[product.categoryId],",
                  "  },",
                  "};",
                  "",
                  "resolvers.Product.finalPrice(db.products[1]);                    // 450",
                  "resolvers.Product.category(db.products[1], {}, { db }).name;     // \"Papelaria\"",
                ].join("\n"),
              },
              explanation:
                "`finalPrice` é um campo calculado a partir do `parent`, e `category` é um campo relacionado, buscado no " +
                "`context`. Nenhum dos dois existia no dado, e é exatamente para isso que servem os resolvers.",
            },
          },
        }),
        concept({
          order: 40,
          title: "N+1 in Resolvers",
          requires: ["Resolver"],
          canonical: false,
          revisitOf: "Platform / Database Performance / N+1 Query Problem",
          note: "manifestação GraphQL (resolver dispara 1 query por item); GraphQL revisita, não cria 2ª canônica",
        }),
        concept({
          order: 50,
          title: "Batching & Per-Request Caching",
          requires: ["N+1 in Resolvers"],
          subtopics: ["DataLoader"],
          note: "estratégia vendor-agnostic de mitigação do N+1: batching + cache por request",
          summary:
            "Agrupar as buscas feitas durante uma mesma requisição em uma só (batching) e guardar os resultados só " +
            "pela duração dela (cache por requisição) — o que o DataLoader faz para resolver o N+1 em GraphQL.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em GraphQL, cada item de uma lista pode disparar o seu próprio resolver, e um resolver que busca o " +
                "autor de um post faz uma consulta por post: o N+1 (Database Performance). A solução é o batching: em " +
                "vez de buscar cada autor na hora, o resolver pede o autor a um carregador (DataLoader), que junta todos " +
                "os pedidos feitos no mesmo ciclo do Event Loop e os executa em uma única consulta (`WHERE id IN (...)`). " +
                "O mesmo carregador guarda os resultados pela duração da requisição, e uma chave pedida duas vezes é " +
                "buscada uma só vez.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Não busque um por um: colete as chaves pedidas em um mesmo instante, busque todas de uma vez e " +
                "distribua os resultados — dentro de uma única requisição.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O DataLoader recebe uma função de lote que, dadas várias chaves, devolve os valores na mesma ordem e " +
                "na mesma quantidade. Cada `load(chave)` devolve uma Promise; as chaves pedidas no mesmo turno do Event " +
                "Loop são reunidas e enviadas juntas à função de lote. Cria-se um carregador novo por requisição, no " +
                "`context`.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "dataloader.js",
              code: [
                "import DataLoader from \"dataloader\";",
                "",
                "let queries = 0;   // conta as idas ao banco, só para o exemplo",
                "const authorsTable = { 1: { id: 1, name: \"Ana\" }, 2: { id: 2, name: \"Bia\" } };",
                "",
                "// A função de lote: recebe várias chaves e devolve os valores NA MESMA ORDEM",
                "async function batchAuthors(ids) {",
                "  queries++;   // SELECT * FROM authors WHERE id IN (...ids)",
                "  return ids.map((id) => authorsTable[id] ?? new Error(`autor ${id} não encontrado`));",
                "}",
                "",
                "// Um carregador por requisição",
                "const authorLoader = new DataLoader(batchAuthors);",
                "",
                "// Dez posts, escritos por 2 autores: dez pedidos no mesmo turno",
                "const posts = Array.from({ length: 10 }, (_, i) => ({ id: i, authorId: (i % 2) + 1 }));",
                "const authors = await Promise.all(posts.map((post) => authorLoader.load(post.authorId)));",
                "",
                "queries;   // 1 — uma única consulta, com as chaves [1, 2] (as repetidas foram fundidas)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Sem o carregador, seriam dez consultas. Com ele, foi uma, e as chaves repetidas foram buscadas só " +
                "uma vez. Em um resolver, a linha equivalente é `context.loaders.author.load(post.authorId)`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando os resolvers de campos relacionados buscam uma fonte que aceita busca em lote, como um `WHERE id IN (...)` ou uma API com endpoint de vários ids.",
                "Quando as mesmas chaves são pedidas várias vezes na mesma requisição, e o cache por requisição evita repetir a busca.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "A função de lote precisa devolver exatamente um valor por chave e na mesma ordem: esquecer disso é o erro mais comum, e devolve dados trocados de um item para outro.",
                "Um carregador compartilhado entre requisições, criado uma vez no processo, mistura o cache de usuários diferentes: pode vazar dados e servir valores desatualizados; crie um por requisição.",
                "O cache vale só dentro da requisição: não substitui um cache entre requisições, e não invalida sozinho se o dado muda durante ela.",
                "Só resolve o que é batchável: se a fonte só busca um item por vez, o loader não ajuda; e há o custo de esperar o fim do turno para agrupar.",
              ],
            },
          ],
          examples: [
            {
              title: "Sem e com o carregador",
              context: "O mesmo resolver, contando as idas ao banco.",
              code: {
                language: "javascript",
                filename: "n-plus-one.js",
                code: [
                  "let queries = 0;",
                  "const findAuthor = async (id) => { queries++; return authorsTable[id]; };",
                  "",
                  "// Ingênuo: uma consulta por post",
                  "queries = 0;",
                  "await Promise.all(posts.map((post) => findAuthor(post.authorId)));",
                  "queries;   // 10",
                  "",
                  "// Com o carregador: uma consulta para todos",
                  "queries = 0;",
                  "const loader = new DataLoader(async (ids) => { queries++; return ids.map((id) => authorsTable[id]); });",
                  "await Promise.all(posts.map((post) => loader.load(post.authorId)));",
                  "queries;   // 1",
                ].join("\n"),
              },
              explanation:
                "O ganho cresce com o tamanho da lista: cem posts dariam cem consultas no modelo ingênuo, e continuam " +
                "sendo uma com o carregador.",
            },
            {
              title: "O contrato da função de lote",
              context: "Um valor por chave, na mesma ordem, é o que mantém os resultados corretos.",
              code: {
                language: "javascript",
                filename: "batch-contract.js",
                code: [
                  "// ERRADO: o banco devolve as linhas na ordem dele, e não na ordem das chaves",
                  "async function wrongBatch(ids) {",
                  "  return db.query(\"SELECT * FROM authors WHERE id IN (?)\", [ids]);   // ordem e quantidade imprevisíveis",
                  "}",
                  "",
                  "// CERTO: reorganiza pelo id, e devolve um valor (ou um erro) para cada chave",
                  "async function batchAuthors(ids) {",
                  "  const rows = await db.query(\"SELECT * FROM authors WHERE id IN (?)\", [ids]);",
                  "  const byId = new Map(rows.map((row) => [row.id, row]));",
                  "  return ids.map((id) => byId.get(id) ?? new Error(`autor ${id} não encontrado`));",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O DataLoader entrega o resultado da posição `i` à chave `i`. Se a ordem ou a quantidade divergir, o " +
                "post de um autor recebe o nome de outro, ou a biblioteca acusa o erro.",
            },
            {
              title: "Um carregador por requisição",
              context: "A vida do carregador deve ser a da requisição, e não a do processo.",
              code: {
                language: "javascript",
                filename: "per-request-loaders.js",
                code: [
                  "// ERRADO: uma instância global compartilha o cache entre usuários e no tempo",
                  "const globalAuthorLoader = new DataLoader(batchAuthors);",
                  "",
                  "// CERTO: os carregadores são criados junto do contexto de cada requisição",
                  "function createLoaders(db) {",
                  "  return {",
                  "    author: new DataLoader((ids) => batchAuthors(db, ids)),",
                  "    product: new DataLoader((ids) => batchProducts(db, ids)),",
                  "  };",
                  "}",
                  "",
                  "const contextFor = (request) => ({ user: request.user, loaders: createLoaders(db) });",
                ].join("\n"),
              },
              explanation:
                "Com um carregador por requisição, o cache nasce e morre com ela: sem vazamento entre usuários, e " +
                "sem dados envelhecidos.",
            },
          ],
          exercise: {
            problem:
              "O resolver `Post.author` busca o autor de cada post separadamente. Uma lista com 50 posts faz 50 " +
              "consultas de autor, além da consulta dos posts.",
            problemCode: {
              language: "javascript",
              filename: "post-author.js",
              code: [
                "let queries = 0;",
                "const authors = { 1: { id: 1, name: \"Ana\" }, 2: { id: 2, name: \"Bia\" } };",
                "const findAuthor = async (id) => { queries++; return authors[id]; };",
                "",
                "const resolvers = {",
                "  Post: {",
                "    author: (post) => findAuthor(post.authorId),   // uma consulta por post",
                "  },",
                "};",
              ].join("\n"),
            },
            task:
              "Use um `DataLoader` no contexto para agrupar as buscas, de modo que 50 posts façam uma só consulta de " +
              "autores, sem misturar as respostas.",
            hint: "A função de lote recebe as chaves e devolve os autores na mesma ordem. O resolver chama `context.authorLoader.load(post.authorId)`.",
            solution: {
              code: {
                language: "javascript",
                filename: "post-author.fixed.js",
                code: [
                  "import DataLoader from \"dataloader\";",
                  "",
                  "let queries = 0;",
                  "const authors = { 1: { id: 1, name: \"Ana\" }, 2: { id: 2, name: \"Bia\" } };",
                  "",
                  "const batchAuthors = async (ids) => {",
                  "  queries++;   // uma consulta para todas as chaves do lote",
                  "  return ids.map((id) => authors[id]);",
                  "};",
                  "",
                  "const createContext = () => ({ authorLoader: new DataLoader(batchAuthors) });   // um por requisição",
                  "",
                  "const resolvers = {",
                  "  Post: { author: (post, _args, context) => context.authorLoader.load(post.authorId) },",
                  "};",
                  "",
                  "const context = createContext();",
                  "const posts = Array.from({ length: 50 }, (_, i) => ({ id: i, authorId: (i % 2) + 1 }));",
                  "const result = await Promise.all(posts.map((post) => resolvers.Post.author(post, {}, context)));",
                  "",
                  "queries;                       // 1",
                  "result[0].name;                // \"Ana\"  (authorId 1)",
                  "result[1].name;                // \"Bia\"  (authorId 2) — as respostas não se misturaram",
                ].join("\n"),
              },
              explanation:
                "As 50 buscas foram fundidas em uma, com as duas chaves distintas. Como a função de lote respeita a ordem " +
                "das chaves, cada post recebe o seu próprio autor.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Query Complexity",
          requires: ["Resolver"],
          note: "custo/profundidade, limites, timeout — superfície de ataque DoS",
          summary:
            "Como conter o custo das consultas GraphQL: como o cliente decide o formato da consulta, é preciso " +
            "limitar profundidade, tamanho e custo estimado, antes que uma única requisição consuma o servidor.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em REST, o servidor decide o que cada endpoint faz. Em GraphQL, é o cliente quem monta a consulta, e " +
                "uma única requisição pode ser enormemente cara: relações circulares aninhadas (`autor { posts { autor " +
                "{ posts ... } } }`), listas grandes, ou centenas de campos repetidos com aliases. Sem controle, uma " +
                "requisição bem construída esgota o servidor, o que a torna uma superfície de negação de serviço. Os " +
                "limites de complexidade recusam, antes de executar, as consultas caras demais. Difere do Rate " +
                "Limiting, que controla quantas requisições chegam, e não o custo de cada uma.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O cliente escolhe a forma da consulta, então o servidor precisa medir o custo dela antes de executar " +
                "e recusar o que passar do limite.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Limite de profundidade: recusa consultas com aninhamento acima de N níveis.",
                "Análise de custo: cada campo tem um custo, multiplicado pelo tamanho esperado das listas (`first: 100`), e a soma precisa ficar abaixo de um teto.",
                "Limites de paginação: todo campo de lista tem um máximo (`first ≤ 100`) e um padrão razoável.",
                "Tempo limite de execução: interrompe o que passar de um prazo, como rede de segurança.",
                "Consultas persistidas (allowlist): em APIs fechadas, só se executam as consultas conhecidas, identificadas por hash.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "query-complexity.js",
              code: [
                "import { parse, visit } from \"graphql\";",
                "",
                "// Profundidade máxima de aninhamento de uma consulta",
                "function depthOf(query) {",
                "  let depth = 0;",
                "  let max = 0;",
                "  visit(parse(query), {",
                "    Field: {",
                "      enter(node) { if (node.selectionSet) { depth++; max = Math.max(max, depth); } },",
                "      leave(node) { if (node.selectionSet) depth--; },",
                "    },",
                "  });",
                "  return max;",
                "}",
                "",
                "const MAX_DEPTH = 5;",
                "",
                "function assertAllowed(query) {",
                "  if (depthOf(query) > MAX_DEPTH) throw new Error(`consulta profunda demais (máximo ${MAX_DEPTH})`);",
                "}",
                "",
                "depthOf(\"{ post { author { name } } }\");   // 2",
                "depthOf(\"{ a { b { c { d { e { f { g } } } } } } }\");   // 6  → recusada por assertAllowed",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A checagem lê apenas o texto da consulta, e por isso acontece antes de qualquer resolver rodar, quando " +
                "o custo de recusar é praticamente zero.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em toda API GraphQL exposta a clientes que você não controla totalmente, e sobretudo nas públicas.",
                "Combinada com paginação obrigatória, tempo limite e, quando possível, consultas persistidas.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "A profundidade sozinha não basta: uma consulta rasa pode ser cara, com listas grandes, ou muito larga, com centenas de campos e aliases repetidos.",
                "Estimativas de custo são heurísticas: subestimam o custo real de resolvers lentos e podem recusar consultas legítimas; ajuste com dados de produção.",
                "Lotes de operações em uma só requisição, ou consultas por aliases, podem contornar limites que olham uma operação por vez; a análise precisa somar tudo.",
                "Deixar a introspecção aberta em produção ajuda a descobrir o esquema; avalie desligá-la em APIs fechadas.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma consulta circular",
              context: "Relações que apontam umas para as outras permitem um aninhamento sem fim.",
              code: {
                language: "text",
                filename: "circular.graphql",
                code: [
                  "# Cada autor tem posts, e cada post tem um autor: a consulta pode aninhar até onde o cliente quiser",
                  "{",
                  "  author(id: 1) {",
                  "    posts { author { posts { author { posts { author { posts { title } } } } } } }",
                  "  }",
                  "}",
                  "",
                  "# Com 100 posts por autor, cada nível multiplica o trabalho: 100 × 100 × 100 × ...",
                  "# Sem limite de profundidade, uma consulta assim pode consumir o servidor.",
                ].join("\n"),
              },
              explanation:
                "O custo cresce exponencialmente com a profundidade. Um limite de profundidade barra o pior caso, e o " +
                "de paginação impede a multiplicação por listas enormes.",
            },
            {
              title: "Aliases para multiplicar o trabalho",
              context: "A mesma operação cara pode ser repetida em uma só consulta, e a profundidade continua baixa.",
              code: {
                language: "javascript",
                filename: "aliases.js",
                code: [
                  "// Profundidade 1, mas cada alias executa uma busca cara",
                  "const attack = `{",
                  "  a1: search(term: \"x\") { id }",
                  "  a2: search(term: \"x\") { id }",
                  "  a3: search(term: \"x\") { id }",
                  "  # ... centenas de aliases",
                  "}`;",
                  "",
                  "// Contar os campos selecionados no documento inteiro pega esse caso",
                  "function fieldCount(query) {",
                  "  let count = 0;",
                  "  visit(parse(query), { Field() { count++; } });",
                  "  return count;",
                  "}",
                  "",
                  "fieldCount(attack);   // 6 aqui (3 aliases × 2 campos); com centenas de aliases passaria de qualquer limite",
                ].join("\n"),
              },
              explanation:
                "Por isso a profundidade é só uma das medidas. O número de campos, ou um custo total estimado, cobre o " +
                "ataque pela largura da consulta.",
            },
            {
              title: "Paginação com teto",
              context: "Todo campo de lista precisa de um limite máximo, definido no servidor.",
              code: {
                language: "javascript",
                filename: "pagination-cap.js",
                code: [
                  "const MAX_PAGE = 100;",
                  "const DEFAULT_PAGE = 20;",
                  "",
                  "function pageSize(first) {",
                  "  if (first === undefined) return DEFAULT_PAGE;",
                  "  if (!Number.isInteger(first) || first < 1) throw new Error(\"first inválido\");",
                  "  return Math.min(first, MAX_PAGE);   // o cliente pode pedir menos, e nunca mais que o teto",
                  "}",
                  "",
                  "pageSize();        // 20",
                  "pageSize(50);      // 50",
                  "pageSize(100000);  // 100",
                ].join("\n"),
              },
              explanation:
                "Sem o teto, `posts(first: 1000000)` seria uma requisição válida. Com ele, o custo de cada lista tem um " +
                "limite conhecido, que a análise de custo também usa.",
            },
          ],
          exercise: {
            problem:
              "A API GraphQL pública executa qualquer consulta. Um cliente enviou uma consulta com 12 níveis de " +
              "aninhamento e o servidor passou minutos ocupado.",
            problemCode: {
              language: "javascript",
              filename: "no-limit.js",
              code: [
                "import { graphql } from \"graphql\";",
                "",
                "async function handle(schema, query, variables) {",
                "  return graphql({ schema, source: query, variableValues: variables });   // executa qualquer coisa",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `checkDepth(query, max)` e faça `handle` recusar, antes de executar, consultas com mais de 6 " +
              "níveis, devolvendo um erro no formato GraphQL.",
            hint: "Use `parse` e `visit` para percorrer os campos que têm sub-seleção, contando a profundidade máxima.",
            solution: {
              code: {
                language: "javascript",
                filename: "no-limit.fixed.js",
                code: [
                  "import { graphql, parse, visit } from \"graphql\";",
                  "",
                  "function checkDepth(query, max) {",
                  "  let depth = 0;",
                  "  let deepest = 0;",
                  "  visit(parse(query), {",
                  "    Field: {",
                  "      enter(node) { if (node.selectionSet) { depth++; deepest = Math.max(deepest, depth); } },",
                  "      leave(node) { if (node.selectionSet) depth--; },",
                  "    },",
                  "  });",
                  "  return { ok: deepest <= max, depth: deepest };",
                  "}",
                  "",
                  "async function handle(schema, query, variables) {",
                  "  const { ok, depth } = checkDepth(query, 6);",
                  "  if (!ok) {",
                  "    return { errors: [{ message: `Consulta com ${depth} níveis; o máximo permitido é 6.` }] };   // nada foi executado",
                  "  }",
                  "  return graphql({ schema, source: query, variableValues: variables });",
                  "}",
                  "",
                  "checkDepth(\"{ a { b { c } } }\", 6);                               // { ok: true, depth: 2 }",
                  "checkDepth(\"{ a { b { c { d { e { f { g { h } } } } } } } }\", 6);  // { ok: false, depth: 7 }",
                ].join("\n"),
              },
              explanation:
                "A consulta é analisada, sem ser executada, e recusada se passar do limite. O custo de recusar é uma " +
                "leitura do texto, e nenhum resolver chega a ser chamado.",
            },
          },
        }),
        concept({
          order: 70,
          title: "GraphQL vs REST",
          requires: ["API Fundamentals / REST", "GraphQL Schema & Type System"],
          note: "quando cada um; over/under-fetching; caching; tooling",
          summary:
            "As trocas entre os dois estilos: GraphQL deixa o cliente pedir exatamente o que precisa em uma " +
            "chamada, e REST aproveita melhor o cache e a simplicidade do HTTP — a escolha depende do caso.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "REST organiza a API em recursos, cada um com o seu endereço, e o servidor decide o formato de cada " +
                "resposta. GraphQL expõe um esquema tipado em um único endpoint, e o cliente descreve a forma da " +
                "resposta. Isso resolve dois problemas de REST: o over-fetching (o endpoint devolve mais campos do " +
                "que a tela usa) e o under-fetching (uma tela precisa de várias chamadas para juntar os dados). Em " +
                "troca, GraphQL perde parte do que o HTTP dá de graça, como o cache por URL, e traz novos cuidados, " +
                "como a complexidade das consultas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Nenhum é melhor em tudo: GraphQL compensa quando os clientes variam muito e os dados formam um grafo; " +
                "REST compensa quando os recursos são simples e o cache HTTP é valioso.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Formato da resposta: REST, definido pelo servidor por endpoint; GraphQL, definido pelo cliente por consulta.",
                "Número de chamadas: REST costuma precisar de várias para montar uma tela; GraphQL, de uma.",
                "Cache: REST usa o cache HTTP (URL, `ETag`, `Cache-Control`) de graça; GraphQL, com POST e um único endpoint, precisa de consultas persistidas ou de um cache no cliente.",
                "Erros: REST usa os status HTTP; GraphQL costuma responder 200 e trazer os erros no corpo, com dados parciais.",
                "Evolução: REST versiona (`/v2`) ou acrescenta campos; GraphQL adiciona e deprecia campos no esquema, sem versões.",
                "Ferramentas: o esquema tipado e a introspecção do GraphQL alimentam documentação, autocompletar e geração de código; em REST, isso vem de OpenAPI.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "graphql-vs-rest.js",
              code: [
                "// REST: três chamadas, e cada resposta traz campos que a tela não usa",
                "const order = await fetch(\"/orders/42\").then((r) => r.json());",
                "// { id, status, total, customerId, createdAt, updatedAt, internalNotes, shippingAddress, ... }",
                "const customer = await fetch(`/customers/${order.customerId}`).then((r) => r.json());",
                "// { id, name, email, phone, birthDate, address, preferences, ... }",
                "const items = await fetch(\"/orders/42/items\").then((r) => r.json());",
                "",
                "// GraphQL: uma chamada, com exatamente os campos usados pela tela",
                "const { data } = await fetch(\"/graphql\", {",
                "  method: \"POST\",",
                "  headers: { \"content-type\": \"application/json\" },",
                "  body: JSON.stringify({ query: `{ order(id: \"42\") { status customer { name } items { product } } }` }),",
                "}).then((r) => r.json());",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A tela mostra o status, o nome do cliente e os produtos. O GraphQL entrega só isso, em uma ida ao " +
                "servidor. O REST exige três, e transporta o resto.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "GraphQL não é uma versão melhor de REST: para uma API de recursos simples, com poucos clientes, o custo do esquema, dos resolvers e da proteção contra consultas caras pode não compensar.",
                "Trocar de REST para GraphQL não elimina o N+1: ele muda de lugar, para os resolvers, e exige batching.",
                "Perder o cache HTTP é uma perda real: `GET /produtos/1` é guardado por CDNs e navegadores, e uma consulta POST não é sem trabalho extra.",
                "Os erros com status 200 escondem falhas dos monitores e dos clientes que só olham o status; é preciso acompanhar a lista `errors`.",
                "Um único endpoint concentra tudo: autorização, limitação de taxa e observabilidade precisam olhar dentro da consulta, e não só para a URL.",
              ],
            },
          ],
          examples: [
            {
              title: "Cache: a URL como chave, ou não",
              context: "A diferença mais prática para quem opera a API.",
              code: {
                language: "text",
                filename: "caching.txt",
                code: [
                  "REST",
                  "  GET /products/1            → a URL identifica o recurso",
                  "  Cache-Control: public, max-age=300   → CDN e navegador guardam por 5 minutos, sem código extra",
                  "",
                  "GraphQL (POST /graphql com o corpo da consulta)",
                  "  → o corpo é a identidade, e o cache HTTP não o usa por padrão",
                  "",
                  "Como recuperar o cache no GraphQL:",
                  "  - consultas persistidas: o cliente envia um hash e usa GET /graphql?id=abc123 (cacheável)",
                  "  - cache normalizado no cliente (Apollo Client, Relay): guarda os objetos por tipo e id",
                  "  - cache no servidor, por resolver ou por consulta",
                ].join("\n"),
              },
              explanation:
                "Em REST, o cache é uma propriedade da URL e do HTTP. Em GraphQL, é uma decisão de arquitetura, com mais " +
                "opções e mais trabalho.",
            },
            {
              title: "Tratando os erros de cada estilo",
              context: "Onde olhar para saber se deu certo muda entre os dois.",
              code: {
                language: "javascript",
                filename: "error-handling.js",
                code: [
                  "// REST: o status diz o resultado",
                  "const response = await fetch(\"/orders/999\");",
                  "if (response.status === 404) return showNotFound();",
                  "",
                  "// GraphQL: o status é 200, e o resultado está no corpo",
                  "const { data, errors } = await fetch(\"/graphql\", options).then((r) => r.json());",
                  "if (errors) {",
                  "  const notFound = errors.some((error) => error.extensions?.code === \"NOT_FOUND\");",
                  "  if (notFound) return showNotFound();",
                  "}",
                  "renderOrder(data.order);   // pode ser parcial, mesmo quando há errors",
                ].join("\n"),
              },
              explanation:
                "Em GraphQL, o código de erro fica em `extensions`, e a resposta pode ser parcial. O cliente que só olha o " +
                "status HTTP deixa passar as falhas.",
            },
            {
              title: "Quando cada um faz mais sentido",
              context: "A decisão depende do perfil dos clientes e dos dados.",
              code: {
                language: "text",
                filename: "when-to-choose.txt",
                code: [
                  "GraphQL tende a compensar quando:",
                  "  - há muitos clientes diferentes (web, iOS, Android, parceiros) com necessidades distintas",
                  "  - as telas juntam dados de muitas entidades relacionadas (um grafo)",
                  "  - o front-end evolui rápido, e o back-end não quer criar um endpoint por tela",
                  "  - o tráfego móvel importa e reduzir chamadas e bytes faz diferença",
                  "",
                  "REST tende a compensar quando:",
                  "  - os recursos são simples e as operações são majoritariamente CRUD",
                  "  - o cache HTTP e as CDNs são importantes (conteúdo público e muito lido)",
                  "  - a API é pública e precisa ser simples de consumir com qualquer ferramenta",
                  "  - a equipe não quer assumir o custo do esquema, dos loaders e da proteção contra consultas caras",
                ].join("\n"),
              },
              explanation:
                "Nenhuma dessas condições é uma regra. Vários sistemas usam os dois: REST para o que é simples e público, " +
                "e GraphQL como camada de agregação (BFF) para os aplicativos.",
            },
          ],
          exercise: {
            problem:
              "A tela de lista de pedidos mostra só o id e o status, mas o endpoint REST devolve cada pedido " +
              "com 25 campos. A equipe de dados móveis quer saber quanto está sendo desperdiçado.",
            problemCode: {
              language: "javascript",
              filename: "overfetch.js",
              code: [
                "const restResponse = [",
                "  { id: 1, status: \"PAID\", total: 1990, customerId: 7, createdAt: \"2026-03-01\", internalNotes: \"...\", shippingAddress: \"...\" },",
                "  { id: 2, status: \"PENDING\", total: 500, customerId: 8, createdAt: \"2026-03-02\", internalNotes: \"...\", shippingAddress: \"...\" },",
                "];",
                "",
                "const usedByScreen = [\"id\", \"status\"];",
                "",
                "function overfetchRatio(items, usedFields) {",
                "  // devolver a fração de campos recebidos que a tela não usa (0 a 1)",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `overfetchRatio`: a proporção de campos recebidos que não são usados, e mostre quais consultas " +
              "GraphQL e REST devolveriam para a mesma tela.",
            hint: "Some quantos campos cada item tem e quantos deles estão em `usedFields`. A razão é (recebidos − usados) / recebidos.",
            solution: {
              code: {
                language: "javascript",
                filename: "overfetch.fixed.js",
                code: [
                  "function overfetchRatio(items, usedFields) {",
                  "  const used = new Set(usedFields);",
                  "  let received = 0;",
                  "  let wasted = 0;",
                  "",
                  "  for (const item of items) {",
                  "    for (const field of Object.keys(item)) {",
                  "      received++;",
                  "      if (!used.has(field)) wasted++;",
                  "    }",
                  "  }",
                  "  return received === 0 ? 0 : wasted / received;",
                  "}",
                  "",
                  "overfetchRatio(restResponse, usedByScreen);   // 5/7 ≈ 0.71 — 71% dos campos recebidos são descartados",
                  "",
                  "// A mesma tela em GraphQL: só os dois campos usados, e o desperdício cai a zero",
                  "const query = `{ orders { id status } }`;",
                ].join("\n"),
              },
              explanation:
                "Aqui, cerca de 71% dos campos recebidos não são usados. Em GraphQL, a tela pede só `id` e `status`. Em " +
                "REST, a mesma economia é possível com campos selecionáveis (`?fields=id,status`) ou com um endpoint " +
                "dedicado, ao custo de mais superfície de API.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "database-fundamentals",
      order: 40,
      title: "Database Fundamentals",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Modelo relacional → SQL → tabela/keys/constraint → JOIN → agregações → subqueries & CTEs → schema. " +
        "Confirma a dependência formal de Software Design / Enterprise & Application Patterns.",
      concepts: [
        concept({
          order: 10,
          title: "Relational Database",
          note: "modelo relacional, tuplas/relações",
          summary:
            "Um banco de dados que organiza a informação em tabelas de linhas e colunas tipadas, relacionadas " +
            "entre si por valores em comum (chaves) e consultadas em uma linguagem declarativa, o SQL.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O modelo relacional, proposto por Edgar Codd em 1970, guarda os dados em relações, o que na prática " +
                "chamamos de tabelas. Cada tabela é um conjunto de linhas (tuplas), e cada linha tem os mesmos " +
                "atributos (colunas), cada um com um tipo. As tabelas se ligam por valores, e não por ponteiros: um " +
                "pedido guarda o id do cliente, e não uma referência a ele. Bancos como PostgreSQL, MySQL, SQL Server, " +
                "Oracle e SQLite implementam esse modelo (RDBMS), e é com eles que se começa a maioria dos sistemas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Dados estruturados em tabelas, ligados por valores em comum e consultados pelo que se quer, e não " +
                "pelo caminho para encontrá-lo: o banco decide como executar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O modelo relacional dá um esquema explícito, regras de integridade aplicadas pelo próprio banco e " +
                "a capacidade de combinar os dados de formas que ninguém previu ao modelá-los, com uma única linguagem. " +
                "Junto de transações (ACID, tema de Database Transactions), é o que sustenta sistemas em que a " +
                "consistência importa, como pedidos, pagamentos e cadastros. Por isso é a escolha-padrão, e os outros " +
                "modelos (NoSQL) se justificam por necessidades específicas.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text:
                "Os exemplos deste módulo usam o `node:sqlite`, o SQLite embutido no Node.js (ainda experimental), " +
                "para poderem ser executados sem instalar nada. A sintaxe é SQL padrão, salvo onde indicado.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "relational.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                "  CREATE TABLE orders (",
                "    id INTEGER PRIMARY KEY,",
                "    customer_id INTEGER NOT NULL REFERENCES customers(id),   -- a relação é um VALOR: o id do cliente",
                "    total_cents INTEGER NOT NULL",
                "  );",
                "  INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bia');",
                "  INSERT INTO orders VALUES (10, 1, 1990), (11, 1, 500), (12, 2, 3000);",
                "`);",
                "",
                "// Consulta declarativa: diz O QUE se quer, e o banco decide COMO buscar",
                "db.prepare(`",
                "  SELECT c.name, o.total_cents",
                "  FROM orders o JOIN customers c ON c.id = o.customer_id",
                "  WHERE o.total_cents > 1000",
                "  ORDER BY o.total_cents",
                "`).all();",
                "// [{ name: \"Ana\", total_cents: 1990 }, { name: \"Bia\", total_cents: 3000 }]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O pedido não contém o cliente: contém o seu id, e o `JOIN` reúne as duas tabelas pelo valor em comum.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma tabela é um conjunto, sem ordem: sem `ORDER BY`, a ordem das linhas devolvidas não é garantida, mesmo que pareça estável em testes.",
                "`NULL` significa \"desconhecido\", e não \"vazio\" nem zero: qualquer comparação com `NULL` resulta em desconhecido, e por isso `NULL = NULL` não é verdadeiro; usa-se `IS NULL`.",
                "O modelo se ajusta bem a dados estruturados e relacionados, mas nem tudo se encaixa: documentos muito variáveis, grafos profundos e séries temporais enormes podem pedir outra ferramenta.",
                "Existe um descompasso entre objetos da aplicação e linhas de tabelas (impedance mismatch), e ferramentas como ORMs e o padrão Data Mapper existem para gerenciá-lo, mas não o eliminam.",
                "Mudar a estrutura de uma tabela em produção exige cuidado (migrações), especialmente em tabelas grandes.",
              ],
            },
          ],
          examples: [
            {
              title: "Relacionar por valor, e não por aninhamento",
              context: "Em vez de repetir o cliente dentro de cada pedido, cada dado tem um só lugar.",
              code: {
                language: "javascript",
                filename: "by-value.js",
                code: [
                  "// Aninhado, como em um documento: o nome do cliente se repete em cada pedido",
                  "// { pedido: 10, cliente: { id: 1, nome: \"Ana\" }, total: 1990 }",
                  "// { pedido: 11, cliente: { id: 1, nome: \"Ana\" }, total: 500 }     ← se Ana mudar de nome, são 2 lugares",
                  "",
                  "// Relacional: o nome está em um só lugar, e o pedido guarda só o id",
                  "db.exec(\"UPDATE customers SET name = 'Ana Souza' WHERE id = 1\");",
                  "",
                  "// Todos os pedidos de Ana já refletem a mudança",
                  "db.prepare(\"SELECT c.name FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.id = 11\").get();",
                  "// { name: \"Ana Souza\" }",
                ].join("\n"),
              },
              explanation:
                "Cada fato existe uma vez, e as outras tabelas o referenciam. Isso evita as inconsistências de atualizar " +
                "uma cópia e esquecer outra.",
            },
            {
              title: "O NULL não é igual a nada, nem a ele mesmo",
              context: "A lógica de três valores (verdadeiro, falso e desconhecido) surpreende quem vem de linguagens de programação.",
              code: {
                language: "javascript",
                filename: "null-logic.js",
                code: [
                  "db.prepare(\"SELECT NULL = NULL AS igual, NULL IS NULL AS eh_nulo\").get();",
                  "// { igual: null, eh_nulo: 1 }   — `NULL = NULL` é desconhecido; `IS NULL` é a forma correta",
                  "",
                  "db.exec(\"CREATE TABLE customers_email (id INTEGER PRIMARY KEY, email TEXT)\");",
                  "db.exec(\"INSERT INTO customers_email VALUES (1, 'a@x.com'), (2, NULL)\");",
                  "",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM customers_email WHERE email = NULL\").get();    // { n: 0 } — nunca casa",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM customers_email WHERE email IS NULL\").get();   // { n: 1 }",
                ].join("\n"),
              },
              explanation:
                "Um filtro `= NULL` nunca devolve linhas, e é um erro silencioso comum. `IS NULL` e `IS NOT NULL` são os " +
                "operadores certos.",
            },
            {
              title: "Sem ORDER BY, não há ordem",
              context: "A ordem que aparece nos testes não é uma garantia.",
              code: {
                language: "javascript",
                filename: "unordered.js",
                code: [
                  "// Sem ORDER BY: o banco devolve as linhas na ordem que for mais conveniente para ele.",
                  "// Ela pode mudar com um índice novo, um VACUUM, uma atualização de versão ou o volume de dados.",
                  "db.prepare(\"SELECT id FROM orders\").all();",
                  "",
                  "// Para uma ordem garantida, ela precisa ser pedida; e, se houver empate, desempatada por uma chave única",
                  "db.prepare(\"SELECT id FROM orders ORDER BY total_cents DESC, id\").all();",
                ].join("\n"),
              },
              explanation:
                "Código que depende de uma ordem \"por acaso\" funciona até o dia em que deixa de funcionar. A ordem faz " +
                "parte da consulta, e não do armazenamento.",
            },
          ],
          exercise: {
            problem:
              "Uma planilha exportada repete os dados do cliente em cada linha de pedido. Quando um cliente muda de " +
              "e-mail, é preciso atualizar várias linhas, e já há e-mails divergentes para o mesmo cliente.",
            problemCode: {
              language: "javascript",
              filename: "flat-table.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE sheet (order_id INTEGER, customer_name TEXT, customer_email TEXT, total_cents INTEGER);",
                "  INSERT INTO sheet VALUES (10, 'Ana', 'ana@x.com', 1990), (11, 'Ana', 'ana@x.com', 500), (12, 'Bia', 'bia@x.com', 3000);",
                "`);",
              ].join("\n"),
            },
            task:
              "Separe em duas tabelas relacionadas, `customers` e `orders`, sem repetir os dados do cliente, e escreva a " +
              "consulta que reconstrói a lista original.",
            hint: "`customers` guarda cada cliente uma vez (com um id), e `orders` guarda o id do cliente. O `JOIN` refaz a planilha.",
            solution: {
              code: {
                language: "javascript",
                filename: "flat-table.fixed.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);",
                  "  CREATE TABLE orders (",
                  "    id INTEGER PRIMARY KEY,",
                  "    customer_id INTEGER NOT NULL REFERENCES customers(id),",
                  "    total_cents INTEGER NOT NULL",
                  "  );",
                  "",
                  "  INSERT INTO customers (name, email) SELECT DISTINCT customer_name, customer_email FROM sheet;",
                  "  INSERT INTO orders (id, customer_id, total_cents)",
                  "    SELECT s.order_id, c.id, s.total_cents FROM sheet s JOIN customers c ON c.email = s.customer_email;",
                  "`);",
                  "",
                  "db.prepare(`",
                  "  SELECT o.id AS order_id, c.name, c.email, o.total_cents",
                  "  FROM orders o JOIN customers c ON c.id = o.customer_id",
                  "  ORDER BY o.id",
                  "`).all();",
                  "// as mesmas 3 linhas da planilha, agora com o e-mail de cada cliente guardado uma vez",
                  "",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM customers\").get();   // { n: 2 }",
                ].join("\n"),
              },
              explanation:
                "Cada cliente existe uma vez, e mudar um e-mail é uma única atualização. O `UNIQUE` no e-mail impede " +
                "duplicatas, e o `JOIN` reconstrói a visão da planilha quando ela for necessária.",
            },
          },
        }),
        concept({
          order: 20,
          title: "SQL",
          requires: ["Relational Database"],
          note: "DDL/DML/DQL",
          summary:
            "A linguagem declarativa dos bancos relacionais, com comandos para definir a estrutura (DDL), alterar " +
            "os dados (DML) e consultá-los (DQL) — em que se descreve o resultado, e o banco escolhe como obtê-lo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "SQL (Structured Query Language) é a linguagem padrão para falar com bancos relacionais. É " +
                "declarativa (Declarative vs Imperative): em vez de ensinar o banco a percorrer as linhas, você " +
                "descreve o que quer, e o otimizador escolhe o plano de execução. Os comandos se agrupam por papel: " +
                "DDL define a estrutura (`CREATE`, `ALTER`, `DROP`), DML altera os dados (`INSERT`, `UPDATE`, " +
                "`DELETE`) e DQL os consulta (`SELECT`). Há ainda comandos de controle de acesso e de transação.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Descreva o resultado que quer, e não os passos: o SQL trabalha sobre conjuntos de linhas, e o " +
                "banco decide a melhor forma de executá-lo.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "Uma consulta é escrita em uma ordem, mas avaliada em outra: primeiro o `FROM` (e os `JOIN`), depois o " +
                "`WHERE`, o `GROUP BY`, o `HAVING`, só então o `SELECT`, e por fim o `ORDER BY` e o `LIMIT`. Entender " +
                "essa ordem lógica explica por que um alias criado no `SELECT` não pode ser usado no `WHERE` no SQL " +
                "padrão. Os valores que vêm de fora entram como parâmetros, e nunca concatenados.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "sql.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "// DDL: define a estrutura",
                "db.exec(\"CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price_cents INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1)\");",
                "",
                "// DML: altera os dados (os valores entram por parâmetros `?`)",
                "const insert = db.prepare(\"INSERT INTO products (name, price_cents) VALUES (?, ?)\");",
                "insert.run(\"caneta\", 500);",
                "insert.run(\"caderno\", 2000);",
                "insert.run(\"lápis\", 300);",
                "db.prepare(\"UPDATE products SET price_cents = price_cents + 50 WHERE name = ?\").run(\"lápis\");",
                "db.prepare(\"DELETE FROM products WHERE name = ?\").run(\"caneta\");",
                "",
                "// DQL: consulta",
                "db.prepare(\"SELECT name, price_cents FROM products WHERE price_cents < ? ORDER BY price_cents\").all(5000);",
                "// [{ name: \"lápis\", price_cents: 350 }, { name: \"caderno\", price_cents: 2000 }]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada grupo de comandos tem um papel: `CREATE` cria a tabela, `INSERT`, `UPDATE` e `DELETE` mudam as " +
                "linhas, e `SELECT` só lê. Os valores nunca foram escritos dentro do texto do comando.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para qualquer trabalho de filtrar, juntar, agrupar e resumir dados em um banco relacional: quase sempre é mais eficiente pedir ao banco o resultado pronto do que trazer as linhas e processá-las na aplicação.",
                "Com parâmetros para os valores, para se proteger de injeção de SQL e permitir que o banco reaproveite o plano da consulta.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um `UPDATE` ou `DELETE` sem `WHERE` age em todas as linhas: rode primeiro o `SELECT` equivalente e, quando possível, use uma transação para poder desfazer.",
                "Concatenar valores no texto do comando abre a porta para injeção de SQL; use sempre parâmetros.",
                "`SELECT *` traz colunas que a aplicação não usa, e quebra quando a tabela muda; liste as colunas.",
                "O SQL varia entre bancos (tipos, funções, paginação, `UPSERT`): o padrão cobre o essencial, e o resto é dialeto.",
                "Pensar em linhas, com um laço na aplicação que consulta o banco a cada item, ignora a força do SQL e cria o problema N+1; prefira operações sobre conjuntos.",
              ],
            },
          ],
          examples: [
            {
              title: "Injeção de SQL, e por que os parâmetros a impedem",
              context: "O valor digitado por um usuário nunca deve virar parte do comando.",
              code: {
                language: "javascript",
                filename: "sql-injection.js",
                code: [
                  "db.exec(\"CREATE TABLE users (name TEXT, secret TEXT); INSERT INTO users VALUES ('ana', 's1'), ('bia', 's2')\");",
                  "",
                  "const input = \"x' OR '1'='1\";   // o que um atacante digita",
                  "",
                  "// Perigoso: o texto vira parte do comando, e a condição passa a ser sempre verdadeira",
                  "db.prepare(`SELECT * FROM users WHERE name = '${input}'`).all().length;   // 2 — devolveu tudo",
                  "",
                  "// Seguro: o valor viaja à parte e é tratado só como dado",
                  "db.prepare(\"SELECT * FROM users WHERE name = ?\").all(input).length;       // 0",
                ].join("\n"),
              },
              explanation:
                "Com a concatenação, o atacante reescreveu a condição. Com o parâmetro, a mesma entrada é só um nome que " +
                "não existe. É a defesa básica descrita em Application Security.",
            },
            {
              title: "A ordem em que uma consulta é avaliada",
              context: "Ler na ordem lógica explica muitos erros e comportamentos.",
              code: {
                language: "text",
                filename: "logical-order.txt",
                code: [
                  "Escrita:  SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT",
                  "",
                  "Avaliada: 1. FROM / JOIN   quais linhas existem",
                  "          2. WHERE         filtra as linhas (antes de agrupar)",
                  "          3. GROUP BY      forma os grupos",
                  "          4. HAVING        filtra os grupos",
                  "          5. SELECT        calcula as colunas e os aliases",
                  "          6. ORDER BY      ordena (aqui os aliases já existem)",
                  "          7. LIMIT         corta",
                  "",
                  "Por isso: um alias definido no SELECT pode ser usado no ORDER BY, mas (no SQL padrão e no PostgreSQL) não no WHERE.",
                ].join("\n"),
              },
              explanation:
                "Alguns bancos, como o SQLite e o MySQL, toleram o alias no `WHERE`, e o código funciona neles e falha em " +
                "outros. Conhecer a ordem lógica evita depender dessa tolerância.",
            },
            {
              title: "UPDATE sem WHERE",
              context: "O erro clássico: uma condição esquecida altera a tabela inteira.",
              code: {
                language: "javascript",
                filename: "update-without-where.js",
                code: [
                  "db.exec(\"CREATE TABLE stock (sku TEXT, qty INTEGER); INSERT INTO stock VALUES ('a', 5), ('b', 7), ('c', 9)\");",
                  "",
                  "// Esqueceu o WHERE: TODAS as linhas foram alteradas",
                  "db.prepare(\"UPDATE stock SET qty = 0\").run().changes;   // 3",
                  "",
                  "// Boa prática: conferir o alcance antes, com o mesmo filtro em um SELECT, e usar uma transação",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM stock WHERE sku = 'a'\").get();   // { n: 1 } — é o que eu esperava alterar?",
                  "db.exec(\"BEGIN\");",
                  "const { changes } = db.prepare(\"UPDATE stock SET qty = 10 WHERE sku = 'a'\").run();",
                  "if (changes !== 1) db.exec(\"ROLLBACK\"); else db.exec(\"COMMIT\");",
                ].join("\n"),
              },
              explanation:
                "O número de linhas afetadas é a evidência de que a condição fez o que se esperava. Com a transação, um " +
                "resultado inesperado pode ser desfeito antes de virar definitivo.",
            },
          ],
          exercise: {
            problem:
              "A aplicação vai gerir uma biblioteca, mas ninguém escreveu os comandos SQL: é preciso criar a tabela, " +
              "inserir livros, marcar um como emprestado e listar os disponíveis.",
            problemCode: {
              language: "javascript",
              filename: "library-sql.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "// 1. DDL: tabela books (id, title obrigatório, available com padrão 1)",
                "// 2. DML: inserir 3 livros",
                "// 3. DML: marcar o livro 'Dom Casmurro' como indisponível (available = 0)",
                "// 4. DQL: listar os títulos disponíveis, em ordem alfabética",
              ].join("\n"),
            },
            task:
              "Escreva os quatro passos, usando parâmetros para os valores que vêm de fora e conferindo quantas linhas " +
              "o `UPDATE` alterou.",
            hint: "`db.exec` para a DDL, `db.prepare(...).run(...)` para as escritas e `.all()` para a leitura. O `UPDATE` devolve `changes`.",
            solution: {
              code: {
                language: "javascript",
                filename: "library-sql.fixed.js",
                code: [
                  "db.exec(\"CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, available INTEGER NOT NULL DEFAULT 1)\");",
                  "",
                  "const insert = db.prepare(\"INSERT INTO books (title) VALUES (?)\");",
                  "for (const title of [\"Dom Casmurro\", \"Quincas Borba\", \"Memórias Póstumas\"]) insert.run(title);",
                  "",
                  "const { changes } = db.prepare(\"UPDATE books SET available = 0 WHERE title = ?\").run(\"Dom Casmurro\");",
                  "changes;   // 1 — exatamente o livro esperado",
                  "",
                  "db.prepare(\"SELECT title FROM books WHERE available = 1 ORDER BY title\").all();",
                  "// [{ title: \"Memórias Póstumas\" }, { title: \"Quincas Borba\" }]",
                ].join("\n"),
              },
              explanation:
                "Os quatro tipos de comando aparecem: DDL, DML (duas vezes) e DQL. O título entrou por parâmetro, e o " +
                "contador de linhas alteradas confirma que o `UPDATE` atingiu só o livro esperado.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Table",
          requires: ["Relational Database"],
          note: "a unidade que PK/FK/Constraint referenciam",
          summary:
            "A estrutura básica de armazenamento em um banco relacional: um conjunto de linhas que têm todas as " +
            "mesmas colunas, cada uma com um nome e um tipo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma tabela representa uma coisa do domínio (clientes, pedidos, produtos) ou uma relação entre coisas. " +
                "As colunas definem que informações cada linha tem, com o tipo de cada uma; as linhas são os registros. " +
                "Em geral, uma tabela por entidade, e uma tabela intermediária para relações de muitos para muitos. A " +
                "tabela é a unidade que chaves primárias, chaves estrangeiras e constraints referenciam.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Uma tabela, um assunto: colunas tipadas e valores atômicos, uma linha por fato, e uma chave que " +
                "identifica cada linha.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Cada coluna tem um nome e um tipo (inteiro, texto, data, decimal, booleano), que limita o que pode ser guardado.",
                "Cada célula guarda um único valor (atômico): uma lista de itens em uma coluna é sinal de que falta uma tabela.",
                "Uma relação de muitos para muitos, como pedidos e produtos, vira uma tabela intermediária com as chaves das duas pontas.",
                "Valores monetários são guardados em inteiros (centavos) ou em tipos decimais exatos, e não em ponto flutuante.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "table.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE products (",
                "    id INTEGER PRIMARY KEY,",
                "    name TEXT NOT NULL,",
                "    price_cents INTEGER NOT NULL,        -- dinheiro em centavos, sem ponto flutuante",
                "    created_at TEXT NOT NULL             -- data em ISO 8601",
                "  );",
                "",
                "  CREATE TABLE tags (id INTEGER PRIMARY KEY, label TEXT NOT NULL UNIQUE);",
                "",
                "  -- muitos para muitos: um produto tem várias tags, e uma tag está em vários produtos",
                "  CREATE TABLE product_tags (",
                "    product_id INTEGER NOT NULL REFERENCES products(id),",
                "    tag_id INTEGER NOT NULL REFERENCES tags(id),",
                "    PRIMARY KEY (product_id, tag_id)",
                "  );",
                "`);",
                "",
                "db.prepare(\"PRAGMA table_info(products)\").all().map((column) => `${column.name} ${column.type}`);",
                "// [\"id INTEGER\", \"name TEXT\", \"price_cents INTEGER\", \"created_at TEXT\"]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As tags ficaram em uma tabela própria, ligada por uma tabela intermediária, em vez de uma lista dentro " +
                "de uma coluna do produto.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Guardar várias informações em uma coluna, como uma lista separada por vírgulas, impede filtrar, indexar e proteger a integridade desse dado; use uma tabela filha.",
                "Uma tabela sem chave primária admite linhas duplicadas e não tem como identificar uma linha para atualizar.",
                "Tipos frouxos escondem erros: o SQLite, por exemplo, aceita texto em uma coluna declarada como inteiro; defina constraints e valide na entrada.",
                "Uma tabela \"para tudo\", com dezenas de colunas de assuntos diferentes, e o padrão de pares chave-valor genéricos (EAV) perdem tipos, constraints e desempenho.",
                "Ponto flutuante para dinheiro acumula erros de arredondamento (`0.1 + 0.2` não dá `0.3`).",
              ],
            },
          ],
          examples: [
            {
              title: "A lista dentro de uma coluna",
              context: "Parece prático, e deixa de funcionar assim que se precisa consultar.",
              code: {
                language: "javascript",
                filename: "list-in-column.js",
                code: [
                  "// Ruim: as tags em uma string",
                  "db.exec(\"CREATE TABLE posts_bad (id INTEGER PRIMARY KEY, tags TEXT)\");",
                  "db.exec(\"INSERT INTO posts_bad VALUES (1, 'sql,banco'), (2, 'banco-de-dados,web')\");",
                  "",
                  "// Buscar a tag \"banco\" com LIKE acerta o post 1 e também o 2, que só tem \"banco-de-dados\"",
                  "db.prepare(\"SELECT id FROM posts_bad WHERE tags LIKE '%banco%'\").all();   // [{ id: 1 }, { id: 2 }]  ← errado",
                  "",
                  "// Bom: uma linha por tag, e a busca é exata (e pode usar um índice)",
                  "db.exec(\"CREATE TABLE post_tags (post_id INTEGER, tag TEXT, PRIMARY KEY (post_id, tag))\");",
                  "db.exec(\"INSERT INTO post_tags VALUES (1, 'sql'), (1, 'banco'), (2, 'banco-de-dados'), (2, 'web')\");",
                  "db.prepare(\"SELECT post_id FROM post_tags WHERE tag = 'banco'\").all();     // [{ post_id: 1 }]",
                ].join("\n"),
              },
              explanation:
                "Com a tabela filha, a busca é exata e indexável, e cada tag pode ser validada, renomeada e contada. A " +
                "lista em texto força a aplicação a reinventar tudo isso.",
            },
            {
              title: "Muitos para muitos com uma tabela intermediária",
              context: "A tabela de junção guarda cada ligação uma vez, e a chave composta impede repetições.",
              code: {
                language: "javascript",
                filename: "junction-table.js",
                code: [
                  "db.exec(`",
                  "  INSERT INTO products VALUES (1, 'caneta', 500, '2026-01-01'), (2, 'caderno', 2000, '2026-01-02');",
                  "  INSERT INTO tags VALUES (1, 'escritório'), (2, 'escola');",
                  "  INSERT INTO product_tags VALUES (1, 1), (1, 2), (2, 2);",
                  "`);",
                  "",
                  "db.prepare(`",
                  "  SELECT p.name FROM products p",
                  "  JOIN product_tags pt ON pt.product_id = p.id",
                  "  JOIN tags t ON t.id = pt.tag_id",
                  "  WHERE t.label = 'escola' ORDER BY p.name",
                  "`).all();   // [{ name: \"caderno\" }, { name: \"caneta\" }]",
                  "",
                  "try { db.exec(\"INSERT INTO product_tags VALUES (1, 1)\"); }",
                  "catch (error) { error.message; }   // \"UNIQUE constraint failed: product_tags.product_id, product_tags.tag_id\"",
                ].join("\n"),
              },
              explanation:
                "A chave composta `(product_id, tag_id)` impede associar duas vezes o mesmo par. Consultar de um lado ou " +
                "do outro é só uma questão de qual tabela se filtra.",
            },
            {
              title: "Dinheiro: inteiro em centavos",
              context: "O ponto flutuante representa mal as frações decimais.",
              code: {
                language: "javascript",
                filename: "money.js",
                code: [
                  "db.prepare(\"SELECT 0.1 + 0.2 AS soma\").get();   // { soma: 0.30000000000000004 }",
                  "",
                  "// Em centavos inteiros, a conta é exata",
                  "db.prepare(\"SELECT 10 + 20 AS soma_em_centavos\").get();   // { soma_em_centavos: 30 }",
                  "",
                  "// Na apresentação: divide por 100 (e formata) só na hora de mostrar",
                  "const format = (cents) => (cents / 100).toLocaleString(\"pt-BR\", { style: \"currency\", currency: \"BRL\" });",
                  "format(1990);   // \"R$ 19,90\"",
                ].join("\n"),
              },
              explanation:
                "Bancos como o PostgreSQL também têm o tipo `NUMERIC`, decimal exato. O importante é nunca usar `REAL` ou " +
                "`FLOAT` para valores em dinheiro.",
            },
          ],
          exercise: {
            problem:
              "A tabela de produtos guarda as categorias em uma coluna de texto, separadas por vírgula. Ninguém " +
              "consegue listar com segurança todos os produtos de uma categoria.",
            problemCode: {
              language: "javascript",
              filename: "csv-column.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, categories TEXT);",
                "  INSERT INTO products VALUES (1, 'caneta', 'escritório,escola'), (2, 'caderno', 'escola'), (3, 'grampeador', 'escritório');",
                "`);",
              ].join("\n"),
            },
            task:
              "Crie a tabela `product_categories` (chave composta, sem repetições), migre os dados da coluna de texto " +
              "para ela e escreva a consulta exata dos produtos da categoria \"escola\".",
            hint: "Uma linha para cada par produto/categoria. Para separar o texto no exemplo, faça o laço em JavaScript com `split(\",\")`.",
            solution: {
              code: {
                language: "javascript",
                filename: "csv-column.fixed.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE product_categories (",
                  "    product_id INTEGER NOT NULL REFERENCES products(id),",
                  "    category TEXT NOT NULL,",
                  "    PRIMARY KEY (product_id, category)",
                  "  )",
                  "`);",
                  "",
                  "const insert = db.prepare(\"INSERT OR IGNORE INTO product_categories VALUES (?, ?)\");",
                  "for (const { id, categories } of db.prepare(\"SELECT id, categories FROM products\").all()) {",
                  "  for (const category of categories.split(\",\")) insert.run(id, category.trim());",
                  "}",
                  "",
                  "db.prepare(`",
                  "  SELECT p.name FROM products p",
                  "  JOIN product_categories pc ON pc.product_id = p.id",
                  "  WHERE pc.category = ? ORDER BY p.name",
                  "`).all(\"escola\");   // [{ name: \"caderno\" }, { name: \"caneta\" }]",
                  "",
                  "// Depois de conferir a migração, a coluna `categories` pode ser removida",
                ].join("\n"),
              },
              explanation:
                "Cada par produto/categoria virou uma linha, com a chave composta impedindo repetições. A busca passou a " +
                "ser exata, e cada categoria pode ser indexada, validada e contada.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Primary Key",
          requires: ["Table"],
          note: "o identificador único e obrigatório de cada linha da tabela",
          collision: "≠ Natural vs Surrogate Key (Database Design) — que discute a escolha",
          summary:
            "A coluna, ou o conjunto de colunas, que identifica cada linha de uma tabela de forma única e " +
            "obrigatória — o endereço da linha, e o alvo das chaves estrangeiras.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A chave primária (PK) garante duas coisas: nenhum valor se repete e nenhum é nulo. Isso permite " +
                "apontar para uma linha específica, atualizá-la e ser referenciada por outras tabelas (Foreign Key). " +
                "Cada tabela tem uma só chave primária, que pode ser simples (uma coluna, como `id`) ou composta (várias, " +
                "como `(order_id, product_id)`). O banco cria automaticamente um índice para ela, o que torna a busca " +
                "por chave rápida. Se a chave é um dado do negócio ou um número gerado é a escolha tratada em Database " +
                "Design (chave natural ou substituta).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Toda linha precisa de uma identidade única e estável: a chave primária é o que permite falar de " +
                "uma linha específica sem ambiguidade.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "primary-key.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "import { randomUUID } from \"node:crypto\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "// Chave simples, gerada pelo banco",
                "db.exec(\"CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL)\");",
                "const first = db.prepare(\"INSERT INTO customers (name) VALUES (?)\").run(\"Ana\");",
                "first.lastInsertRowid;   // 1 — o banco gerou a chave",
                "",
                "// A chave é única: repetir o valor é recusado",
                "try { db.exec(\"INSERT INTO customers (id, name) VALUES (1, 'Outra Ana')\"); }",
                "catch (error) { error.message; }   // \"UNIQUE constraint failed: customers.id\"",
                "",
                "// Chave composta: o par identifica a linha (uma linha por produto em cada pedido)",
                "db.exec(\"CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, quantity INTEGER NOT NULL, PRIMARY KEY (order_id, product_id))\");",
                "",
                "// Chave textual opaca (UUID), gerada pela aplicação",
                "db.exec(\"CREATE TABLE api_tokens (id TEXT PRIMARY KEY, owner TEXT NOT NULL)\");",
                "db.prepare(\"INSERT INTO api_tokens VALUES (?, ?)\").run(randomUUID(), \"ana\");",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "As três formas resolvem o mesmo problema: identificar uma linha sem ambiguidade. O que muda é quem " +
                "gera o valor e se ele significa algo para o negócio.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma chave que muda, como o e-mail ou o CPF, obriga a atualizar todas as tabelas que a referenciam; a chave deve ser estável durante toda a vida da linha.",
                "Expor ids sequenciais em endereços (`/customers/1`, `/customers/2`) permite enumerar os registros; a autorização por recurso é indispensável, e um identificador opaco, como o UUID, ajuda.",
                "UUIDs aleatórios como chave primária espalham as inserções pelo índice e podem prejudicar o desempenho em tabelas grandes; existem variantes ordenáveis por tempo.",
                "Chaves compostas longas se propagam para todas as chaves estrangeiras que as referenciam, o que as torna pesadas; uma chave substituta simples costuma ser mais prática.",
                "A chave primária identifica a linha, mas não substitui as regras de unicidade do negócio: o e-mail continua precisando de um `UNIQUE` próprio.",
              ],
            },
          ],
          examples: [
            {
              title: "A chave que muda",
              context: "Usar um dado do negócio como chave o prende a esse dado.",
              code: {
                language: "javascript",
                filename: "changing-key.js",
                code: [
                  "// E-mail como chave primária: parece natural, e vira problema quando o e-mail muda",
                  "db.exec(`",
                  "  CREATE TABLE users_bad (email TEXT PRIMARY KEY, name TEXT);",
                  "  CREATE TABLE posts_bad (id INTEGER PRIMARY KEY, author_email TEXT REFERENCES users_bad(email), title TEXT);",
                  "`);",
                  "// Trocar o e-mail exige atualizar users_bad e TODAS as linhas de posts_bad (e de qualquer outra tabela)",
                  "",
                  "// Chave estável + e-mail como coluna única: mudar o e-mail é uma atualização",
                  "db.exec(`",
                  "  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT);",
                  "  CREATE TABLE posts (id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES users(id), title TEXT);",
                  "`);",
                ].join("\n"),
              },
              explanation:
                "Com uma chave substituta estável, o e-mail deixa de ser a identidade e passa a ser um atributo, com a " +
                "unicidade garantida por um `UNIQUE`.",
            },
            {
              title: "Chave composta em uma tabela intermediária",
              context: "O par de chaves das duas pontas identifica a linha e impede repetições.",
              code: {
                language: "javascript",
                filename: "composite-key.js",
                code: [
                  "db.exec(\"INSERT INTO order_items VALUES (10, 1, 2), (10, 2, 1)\");   // o pedido 10 tem 2 produtos diferentes",
                  "",
                  "try { db.exec(\"INSERT INTO order_items VALUES (10, 1, 5)\"); }        // o mesmo produto de novo, no mesmo pedido",
                  "catch (error) { error.message; }",
                  "// \"UNIQUE constraint failed: order_items.order_id, order_items.product_id\"",
                  "",
                  "// Para mudar a quantidade, atualiza-se a linha existente (ou se soma a ela), e não se insere outra",
                  "db.prepare(\"UPDATE order_items SET quantity = quantity + 5 WHERE order_id = 10 AND product_id = 1\").run();",
                ].join("\n"),
              },
              explanation:
                "A chave composta expressa a regra \"um produto aparece uma vez por pedido\" diretamente na estrutura, " +
                "sem depender do cuidado da aplicação.",
            },
            {
              title: "Ids sequenciais versus opacos",
              context: "A previsibilidade de um contador ajuda quem quer enumerar os registros.",
              code: {
                language: "javascript",
                filename: "id-exposure.js",
                code: [
                  "// Sequencial: quem vê /invoices/1042 tenta /invoices/1041, 1040, ...",
                  "//   → sem checagem de autorização por recurso, dá para ler as faturas de outros clientes",
                  "",
                  "// Opaco: um UUID não é adivinhável",
                  "//   /invoices/3f6c5e0a-8d1b-4a53-9b64-0c2f1e7a9d21",
                  "",
                  "// Mas o UUID NÃO substitui a autorização: quem obtiver o endereço ainda pode acessar.",
                  "function getInvoice(user, id) {",
                  "  const invoice = findInvoice(id);",
                  "  if (!invoice || invoice.ownerId !== user.id) return { status: 404 };   // sempre verifica o dono",
                  "  return { status: 200, body: invoice };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O identificador opaco dificulta a enumeração, e a checagem do dono é o que protege de verdade. As duas " +
                "medidas se complementam.",
            },
          ],
          exercise: {
            problem:
              "A tabela de matrículas foi criada sem chave primária, e já tem linhas duplicadas: o mesmo aluno " +
              "matriculado duas vezes no mesmo curso.",
            problemCode: {
              language: "javascript",
              filename: "enrollments.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE enrollments (student_id INTEGER, course_id INTEGER, enrolled_on TEXT);",
                "  INSERT INTO enrollments VALUES (1, 10, '2026-01-10'), (1, 10, '2026-01-12'), (2, 10, '2026-01-11'), (1, 20, '2026-01-13');",
                "`);",
              ].join("\n"),
            },
            task:
              "Recrie a tabela com a chave primária composta `(student_id, course_id)`, mantendo, para cada par, a " +
              "matrícula mais antiga, e mostre que uma nova duplicata é recusada.",
            hint: "Crie a tabela nova com a chave, copie com `MIN(enrolled_on)` agrupando por aluno e curso, e troque os nomes.",
            solution: {
              code: {
                language: "javascript",
                filename: "enrollments.fixed.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE enrollments_new (",
                  "    student_id INTEGER NOT NULL,",
                  "    course_id INTEGER NOT NULL,",
                  "    enrolled_on TEXT NOT NULL,",
                  "    PRIMARY KEY (student_id, course_id)",
                  "  );",
                  "",
                  "  INSERT INTO enrollments_new",
                  "    SELECT student_id, course_id, MIN(enrolled_on) FROM enrollments GROUP BY student_id, course_id;",
                  "",
                  "  DROP TABLE enrollments;",
                  "  ALTER TABLE enrollments_new RENAME TO enrollments;",
                  "`);",
                  "",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM enrollments\").get();   // { n: 3 } — a duplicata do aluno 1 no curso 10 foi eliminada",
                  "",
                  "try { db.exec(\"INSERT INTO enrollments VALUES (1, 10, '2026-02-01')\"); }",
                  "catch (error) { error.message; }   // \"UNIQUE constraint failed: enrollments.student_id, enrollments.course_id\"",
                ].join("\n"),
              },
              explanation:
                "A regra \"um aluno, uma matrícula por curso\" passou a ser garantida pelo banco, e a duplicata futura é " +
                "recusada. A migração manteve a matrícula mais antiga de cada par.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Foreign Key",
          requires: ["Primary Key"],
          note: "integridade referencial",
          summary:
            "Uma coluna que referencia a chave primária de outra tabela e faz o banco impedir referências para " +
            "linhas que não existem — a integridade referencial.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A chave estrangeira (FK) declara que os valores de uma coluna precisam existir como chave de outra " +
                "tabela: `orders.customer_id` referencia `customers.id`. Com isso, o banco recusa criar um pedido de um " +
                "cliente que não existe (linha órfã) e decide o que acontece com os pedidos quando o cliente é apagado. " +
                "É a integridade referencial: as relações entre as tabelas deixam de ser uma convenção da aplicação e " +
                "passam a ser garantidas pelo banco.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A chave estrangeira transforma a relação entre tabelas em uma regra: o banco não deixa uma " +
                "referência apontar para o nada.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "`INSERT` ou `UPDATE` com um valor sem correspondente na tabela referenciada é recusado.",
                "`ON DELETE RESTRICT` (ou `NO ACTION`): não deixa apagar a linha referenciada enquanto houver referências; é o padrão seguro.",
                "`ON DELETE CASCADE`: apagar a linha referenciada apaga também as que a referenciam.",
                "`ON DELETE SET NULL`: mantém as linhas dependentes, e zera a referência (a coluna precisa aceitar `NULL`).",
                "Em alguns bancos, como o PostgreSQL, a coluna da chave estrangeira não ganha um índice automaticamente, e criá-lo costuma ser necessário.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "foreign-key.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                "  CREATE TABLE orders (",
                "    id INTEGER PRIMARY KEY,",
                "    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT",
                "  );",
                "  INSERT INTO customers VALUES (1, 'Ana');",
                "  INSERT INTO orders VALUES (10, 1);",
                "`);",
                "",
                "// Pedido de um cliente que não existe: recusado",
                "try { db.exec(\"INSERT INTO orders VALUES (11, 99)\"); }",
                "catch (error) { error.message; }   // \"FOREIGN KEY constraint failed\"",
                "",
                "// Apagar um cliente que tem pedidos: recusado (RESTRICT)",
                "try { db.exec(\"DELETE FROM customers WHERE id = 1\"); }",
                "catch (error) { error.message; }   // \"FOREIGN KEY constraint failed\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Nenhum pedido órfão pode existir, e nenhum cliente com pedidos desaparece por descuido. No SQLite, a " +
                "verificação de chaves estrangeiras precisa estar ligada (`PRAGMA foreign_keys = ON`), e o " +
                "`node:sqlite` já a liga por padrão.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "`ON DELETE CASCADE` apaga em cadeia: um `DELETE` inocente pode remover milhares de linhas de várias tabelas; use-o só onde a dependência é de fato \"parte de\", e nunca por conveniência.",
                "Sem índice na coluna da chave estrangeira, os `JOIN`s e as exclusões na tabela pai precisam varrer a tabela filha inteira.",
                "Chaves estrangeiras não atravessam bancos nem serviços: em arquiteturas com bancos separados, a integridade passa a ser responsabilidade da aplicação.",
                "Referências circulares entre duas tabelas dificultam inserir os dados e apagá-los; costumam indicar um problema de modelagem.",
                "Desligar a verificação para uma carga em massa, e esquecer de religá-la ou de validar depois, deixa órfãos silenciosamente.",
              ],
            },
          ],
          examples: [
            {
              title: "Os três comportamentos de exclusão",
              context: "O que fazer com as linhas dependentes é uma decisão de modelagem.",
              code: {
                language: "javascript",
                filename: "on-delete.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE authors (id INTEGER PRIMARY KEY);",
                  "  CREATE TABLE posts_cascade (id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE);",
                  "  CREATE TABLE posts_setnull (id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL);",
                  "  CREATE TABLE posts_restrict (id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES authors(id) ON DELETE RESTRICT);",
                  "  INSERT INTO authors VALUES (1);",
                  "  INSERT INTO posts_cascade VALUES (1, 1);",
                  "  INSERT INTO posts_setnull VALUES (1, 1);",
                  "  INSERT INTO posts_restrict VALUES (1, 1);",
                  "`);",
                  "",
                  "db.exec(\"DELETE FROM posts_restrict\");   // libera o RESTRICT para o exemplo",
                  "db.exec(\"DELETE FROM authors WHERE id = 1\");",
                  "",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM posts_cascade\").get();          // { n: 0 } — apagou junto",
                  "db.prepare(\"SELECT author_id FROM posts_setnull\").get();              // { author_id: null } — ficou sem autor",
                  "// posts_restrict teria impedido a exclusão enquanto houvesse posts",
                ].join("\n"),
              },
              explanation:
                "`CASCADE` propaga a exclusão, `SET NULL` preserva o dependente sem a referência, e `RESTRICT` protege. " +
                "A escolha reflete o que o relacionamento significa no negócio.",
            },
            {
              title: "O índice que falta na chave estrangeira",
              context: "Sem um índice, buscar pelos filhos de um pai varre a tabela toda.",
              code: {
                language: "javascript",
                filename: "fk-index.js",
                code: [
                  "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                  "",
                  "plan(\"SELECT * FROM orders WHERE customer_id = 1\");",
                  "// [\"SCAN orders\"]   — lê todos os pedidos",
                  "",
                  "db.exec(\"CREATE INDEX idx_orders_customer ON orders(customer_id)\");",
                  "",
                  "plan(\"SELECT * FROM orders WHERE customer_id = 1\");",
                  "// [\"SEARCH orders USING COVERING INDEX idx_orders_customer (customer_id=?)\"]   — vai direto aos pedidos do cliente",
                ].join("\n"),
              },
              explanation:
                "Com poucas linhas a diferença é invisível, e com milhões ela decide se a consulta leva milissegundos ou " +
                "segundos. É o assunto de Database Performance.",
            },
            {
              title: "Chaves estrangeiras e microsserviços",
              context: "A integridade referencial do banco só vale dentro do próprio banco.",
              code: {
                language: "javascript",
                filename: "cross-service.js",
                code: [
                  "// Banco de pedidos e banco de clientes são separados: não há FK entre eles.",
                  "// A aplicação precisa garantir a regra, e aceitar os casos em que ela falha.",
                  "",
                  "async function createOrder(customerId, items) {",
                  "  const customer = await customersApi.find(customerId);          // checagem na aplicação",
                  "  if (!customer) throw new Error(\"cliente inexistente\");",
                  "  return orders.insert({ customerId, items });",
                  "}",
                  "",
                  "// Mesmo assim, o cliente pode ser apagado depois: o pedido ficaria com uma referência solta,",
                  "// e o sistema precisa lidar com isso (eventos, tratamento tolerante, limpeza periódica).",
                ].join("\n"),
              },
              explanation:
                "Ao separar os bancos, ganha-se independência e perde-se a garantia automática. É um dos custos da " +
                "divisão em serviços.",
            },
          ],
          exercise: {
            problem:
              "A tabela de comentários tem `post_id`, mas sem chave estrangeira. Já existem comentários de posts que " +
              "foram apagados, e ninguém sabe quantos.",
            problemCode: {
              language: "javascript",
              filename: "orphans.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT);",
                "  CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER NOT NULL, body TEXT);",
                "  INSERT INTO posts VALUES (1, 'A'), (2, 'B');",
                "  INSERT INTO comments VALUES (1, 1, 'ok'), (2, 2, 'bom'), (3, 3, 'órfão!'), (4, 1, 'legal');",
                "`);",
              ].join("\n"),
            },
            task:
              "Ache os comentários órfãos, remova-os e recrie a tabela com uma chave estrangeira `ON DELETE CASCADE`, " +
              "para que apagar um post apague os seus comentários.",
            hint: "Um `LEFT JOIN` com `posts.id IS NULL` (ou `NOT EXISTS`) acha os órfãos. Depois recrie `comments` com `REFERENCES posts(id)`.",
            solution: {
              code: {
                language: "javascript",
                filename: "orphans.fixed.js",
                code: [
                  "// 1. Achar os órfãos",
                  "db.prepare(`",
                  "  SELECT c.id FROM comments c LEFT JOIN posts p ON p.id = c.post_id WHERE p.id IS NULL",
                  "`).all();   // [{ id: 3 }]",
                  "",
                  "// 2. Recriar a tabela com a chave estrangeira, copiando só os comentários válidos",
                  "db.exec(`",
                  "  CREATE TABLE comments_new (",
                  "    id INTEGER PRIMARY KEY,",
                  "    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,",
                  "    body TEXT",
                  "  );",
                  "  INSERT INTO comments_new SELECT c.* FROM comments c WHERE c.post_id IN (SELECT id FROM posts);",
                  "  DROP TABLE comments;",
                  "  ALTER TABLE comments_new RENAME TO comments;",
                  "  CREATE INDEX idx_comments_post ON comments(post_id);",
                  "`);",
                  "",
                  "// 3. Agora o banco garante a integridade",
                  "try { db.exec(\"INSERT INTO comments VALUES (9, 77, 'sem post')\"); }",
                  "catch (error) { error.message; }   // \"FOREIGN KEY constraint failed\"",
                  "",
                  "db.exec(\"DELETE FROM posts WHERE id = 1\");",
                  "db.prepare(\"SELECT COUNT(*) AS n FROM comments WHERE post_id = 1\").get();   // { n: 0 } — apagados junto do post",
                ].join("\n"),
              },
              explanation:
                "Os órfãos foram removidos, e a nova tabela impede que voltem. O `CASCADE` faz sentido aqui porque um " +
                "comentário só existe como parte do seu post, e o índice acelera as buscas por post.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Constraint",
          requires: ["Table"],
          note: "NOT NULL, UNIQUE, CHECK, DEFAULT",
          summary:
            "Regras declaradas na estrutura da tabela que o próprio banco aplica em toda escrita — nulidade, " +
            "unicidade, condições sobre os valores e valores padrão —, independentemente de quem escreve.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma constraint é uma regra de integridade que o banco garante. `NOT NULL` proíbe valores ausentes, " +
                "`UNIQUE` proíbe repetições, `CHECK` exige que uma condição sobre a linha seja verdadeira, e `DEFAULT` " +
                "preenche um valor quando nenhum é informado (a chave primária e a chave estrangeira também são " +
                "constraints). Elas valem para toda escrita, venha da aplicação, de um script, de outro serviço ou de " +
                "alguém com um terminal aberto, e por isso são a última linha de defesa da qualidade dos dados.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Se uma regra precisa valer sempre, declare-a no banco: a validação da aplicação pode ser " +
                "contornada, e a constraint, não.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "constraints.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE products (",
                "    id INTEGER PRIMARY KEY,",
                "    sku TEXT NOT NULL UNIQUE,                                     -- obrigatório e sem repetição",
                "    name TEXT NOT NULL,",
                "    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),        -- condição sobre o valor",
                "    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),",
                "    created_at TEXT NOT NULL DEFAULT (datetime('now'))            -- valor padrão",
                "  )",
                "`);",
                "",
                "const attempt = (sql) => { try { db.exec(sql); return \"ok\"; } catch (error) { return error.message; } };",
                "",
                "attempt(\"INSERT INTO products (sku, name, price_cents) VALUES ('A1', 'caneta', 500)\");        // \"ok\" (status = 'draft')",
                "attempt(\"INSERT INTO products (sku, name, price_cents) VALUES ('A1', 'outra', 100)\");         // \"UNIQUE constraint failed: products.sku\"",
                "attempt(\"INSERT INTO products (sku, name, price_cents) VALUES ('B2', NULL, 100)\");            // \"NOT NULL constraint failed: products.name\"",
                "attempt(\"INSERT INTO products (sku, name, price_cents) VALUES ('C3', 'lápis', -5)\");          // \"CHECK constraint failed: price_cents >= 0\"",
                "attempt(\"INSERT INTO products (sku, name, price_cents, status) VALUES ('D4', 'x', 1, 'lost')\");   // \"CHECK constraint failed: ...\"",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada tentativa inválida foi recusada pelo banco, sem uma linha de validação no código. O `DEFAULT` " +
                "preencheu o status e a data da primeira linha.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para invariantes que precisam valer sempre e por qualquer caminho: campos obrigatórios, unicidade, faixas de valores, conjuntos de valores válidos.",
                "Para garantir unicidade sem condições de corrida: um `UNIQUE` funciona mesmo com duas requisições simultâneas, e uma checagem prévia na aplicação, não.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Regras que dependem de outras tabelas, do tempo ou de cálculos complexos não cabem em um `CHECK` (na maioria dos bancos ele só enxerga a própria linha); ficam na aplicação, em gatilhos ou em outras constraints.",
                "Regras que mudam com frequência, como limites de negócio, tornam a constraint um custo de migração; prefira configuração e validação na aplicação.",
                "As mensagens de erro do banco são técnicas: a aplicação ainda precisa validar antes, para dar respostas claras, e traduzir o que escapar.",
                "Acrescentar uma constraint a uma tabela que já tem dados inválidos falha até que os dados sejam corrigidos.",
                "`DEFAULT` não valida nada: só preenche o que faltou, e um valor explicitamente informado ainda pode ser errado.",
              ],
            },
          ],
          examples: [
            {
              title: "Unicidade sem condição de corrida",
              context: "Verificar antes de inserir deixa uma janela em que duas requisições passam juntas.",
              code: {
                language: "javascript",
                filename: "race-safe.js",
                code: [
                  "// Checar e inserir: outra requisição pode inserir o mesmo SKU entre as duas linhas",
                  "const exists = db.prepare(\"SELECT 1 FROM products WHERE sku = ?\").get(\"Z9\");",
                  "if (!exists) db.prepare(\"INSERT INTO products (sku, name, price_cents) VALUES (?, ?, ?)\").run(\"Z9\", \"x\", 1);",
                  "",
                  "// Com o UNIQUE, o banco decide: uma inserção vence, e a outra falha, sempre",
                  "function createProduct(sku, name, price) {",
                  "  try {",
                  "    db.prepare(\"INSERT INTO products (sku, name, price_cents) VALUES (?, ?, ?)\").run(sku, name, price);",
                  "    return { status: 201 };",
                  "  } catch (error) {",
                  "    if (error.message.includes(\"UNIQUE constraint failed\")) return { status: 409 };   // conflito",
                  "    throw error;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A constraint é a única garantia real, porque é atômica. A aplicação deve tratar a falha e devolver um " +
                "conflito, em vez de confiar em uma verificação que pode envelhecer em milissegundos.",
            },
            {
              title: "Traduzir o erro do banco para a API",
              context: "Cada tipo de violação corresponde a um problema do cliente, e não a um erro do servidor.",
              code: {
                language: "javascript",
                filename: "translate-errors.js",
                code: [
                  "function toHttp(error) {",
                  "  const message = error.message;",
                  "  if (message.includes(\"UNIQUE constraint failed\")) return { status: 409, title: \"Já existe\" };",
                  "  if (message.includes(\"NOT NULL constraint failed\")) return { status: 422, title: \"Campo obrigatório ausente\" };",
                  "  if (message.includes(\"CHECK constraint failed\")) return { status: 422, title: \"Valor inválido\" };",
                  "  if (message.includes(\"FOREIGN KEY constraint failed\")) return { status: 422, title: \"Referência inexistente\" };",
                  "  return { status: 500, title: \"Erro interno\" };",
                  "}",
                  "",
                  "// No PostgreSQL, o código do erro (SQLSTATE) é mais confiável que o texto:",
                  "//   23505 unique_violation   23502 not_null_violation   23514 check_violation   23503 foreign_key_violation",
                ].join("\n"),
              },
              explanation:
                "A violação de uma constraint quase sempre é um problema do pedido, e por isso vira 4xx, e não 500. " +
                "Bibliotecas de acesso expõem o código do erro, e é nele, e não no texto, que se deve confiar.",
            },
            {
              title: "Dados existentes impedem a nova constraint",
              context: "Acrescentar uma regra depois exige antes corrigir o que já a viola.",
              code: {
                language: "javascript",
                filename: "add-constraint.js",
                code: [
                  "db.exec(\"CREATE TABLE members (id INTEGER PRIMARY KEY, email TEXT)\");",
                  "db.exec(\"INSERT INTO members (email) VALUES ('a@x.com'), ('a@x.com'), ('b@x.com')\");   // duplicata",
                  "",
                  "try { db.exec(\"CREATE UNIQUE INDEX uq_members_email ON members(email)\"); }",
                  "catch (error) { error.message; }   // \"UNIQUE constraint failed: members.email\" — os dados atuais violam a regra",
                  "",
                  "// 1. Corrigir os dados (aqui, manter a linha mais antiga de cada e-mail)",
                  "db.exec(\"DELETE FROM members WHERE id NOT IN (SELECT MIN(id) FROM members GROUP BY email)\");",
                  "",
                  "// 2. Só então acrescentar a constraint",
                  "db.exec(\"CREATE UNIQUE INDEX uq_members_email ON members(email)\");",
                ].join("\n"),
              },
              explanation:
                "Quanto mais cedo a regra entra no esquema, mais barato é aplicá-la. Depois, é preciso limpar os dados " +
                "antes, e decidir o que fazer com cada violação.",
            },
          ],
          exercise: {
            problem:
              "A tabela de usuários aceita qualquer coisa: e-mails repetidos ou vazios, idades negativas, papéis " +
              "inexistentes. A validação existe só em um formulário, e scripts internos a contornam.",
            problemCode: {
              language: "javascript",
              filename: "users-table.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE users (",
                "    id INTEGER PRIMARY KEY,",
                "    email TEXT,",
                "    age INTEGER,",
                "    role TEXT,",
                "    created_at TEXT",
                "  )",
                "`);",
              ].join("\n"),
            },
            task:
              "Recrie a tabela com constraints: e-mail obrigatório e único, idade entre 0 e 130 (opcional), papel " +
              "restrito a `user`, `admin` e `guest` (padrão `user`), e `created_at` com a data atual por padrão.",
            hint: "Combine `NOT NULL`, `UNIQUE`, `CHECK (age BETWEEN 0 AND 130)`, `CHECK (role IN (...))` e `DEFAULT`.",
            solution: {
              code: {
                language: "javascript",
                filename: "users-table.fixed.js",
                code: [
                  "db.exec(\"DROP TABLE users\");",
                  "db.exec(`",
                  "  CREATE TABLE users (",
                  "    id INTEGER PRIMARY KEY,",
                  "    email TEXT NOT NULL UNIQUE CHECK (length(email) > 3),",
                  "    age INTEGER CHECK (age BETWEEN 0 AND 130),                        -- opcional, mas, se existir, válida",
                  "    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'guest')),",
                  "    created_at TEXT NOT NULL DEFAULT (datetime('now'))",
                  "  )",
                  "`);",
                  "",
                  "const attempt = (sql) => { try { db.exec(sql); return \"ok\"; } catch (error) { return error.message; } };",
                  "",
                  "attempt(\"INSERT INTO users (email) VALUES ('ana@x.com')\");                     // \"ok\" (role 'user', data preenchida)",
                  "attempt(\"INSERT INTO users (email) VALUES ('ana@x.com')\");                     // UNIQUE constraint failed",
                  "attempt(\"INSERT INTO users (email, age) VALUES ('bia@x.com', -3)\");            // CHECK constraint failed",
                  "attempt(\"INSERT INTO users (email, role) VALUES ('caio@x.com', 'root')\");      // CHECK constraint failed",
                  "attempt(\"INSERT INTO users (email) VALUES (NULL)\");                           // NOT NULL constraint failed",
                ].join("\n"),
              },
              explanation:
                "Agora nenhum caminho de escrita, formulário, script ou console, consegue gravar dados inválidos. A " +
                "idade continua opcional, mas se aparecer precisa ser válida (`NULL` passa em um `CHECK`).",
            },
          },
        }),
        concept({
          order: 70,
          title: "JOIN",
          requires: ["Foreign Key"],
          subtopics: ["INNER", "LEFT/RIGHT OUTER", "FULL OUTER", "CROSS", "self-join"],
          note: "consolidada (A17)",
          summary:
            "A operação que combina linhas de duas tabelas pela relação entre elas — o INNER mantém só quem tem " +
            "par, os OUTER mantêm também quem não tem, o CROSS combina tudo com tudo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Como as tabelas se ligam por valores (Foreign Key), reunir as informações de um pedido e do seu " +
                "cliente é um `JOIN`. A condição `ON` diz quando duas linhas se correspondem. O tipo de `JOIN` diz o " +
                "que fazer com as linhas sem par: o `INNER JOIN` as descarta, o `LEFT JOIN` mantém as da tabela da " +
                "esquerda (com `NULL` no lado sem par), o `RIGHT JOIN` faz o inverso, o `FULL JOIN` mantém as duas, e " +
                "o `CROSS JOIN` combina todas as linhas com todas, sem condição. Um `JOIN` de uma tabela com ela " +
                "mesma é o self-join.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O JOIN reúne o que a modelagem separou: escolha o tipo pelo que deve acontecer com as linhas sem " +
                "correspondente.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "join.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), total_cents INTEGER);",
                "  INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bia'), (3, 'Caio');          -- Caio nunca comprou",
                "  INSERT INTO orders VALUES (10, 1, 1990), (11, 1, 500), (12, 2, 3000);",
                "`);",
                "",
                "const rows = (sql) => db.prepare(sql).all().map((row) => ({ ...row }));",
                "",
                "// INNER: só quem tem par nas duas tabelas",
                "rows(\"SELECT c.name, o.id AS order_id FROM customers c INNER JOIN orders o ON o.customer_id = c.id ORDER BY o.id\");",
                "// Ana/10, Ana/11, Bia/12   — Caio não aparece",
                "",
                "// LEFT: todos os clientes, com NULL onde não há pedido",
                "rows(\"SELECT c.name, o.id AS order_id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id ORDER BY c.id, o.id\");",
                "// Ana/10, Ana/11, Bia/12, Caio/null",
                "",
                "// CROSS: todas as combinações (3 clientes × 3 pedidos = 9 linhas)",
                "rows(\"SELECT c.name, o.id FROM customers c CROSS JOIN orders o\").length;   // 9",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A diferença entre `INNER` e `LEFT` é justamente o Caio: um mantém só quem comprou, e o outro mantém " +
                "todos os clientes. O `RIGHT JOIN` é o `LEFT` com as tabelas trocadas, e o `FULL JOIN` mantém as duas " +
                "pontas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "`INNER JOIN` quando só interessam as linhas que têm correspondência nas duas tabelas.",
                "`LEFT JOIN` quando a tabela da esquerda deve aparecer por inteiro, com ou sem correspondente: \"todos os clientes e os seus pedidos, se houver\", e para achar quem não tem par (`... WHERE o.id IS NULL`).",
                "Self-join para relações dentro da mesma tabela, como funcionários e gerentes, ou categorias e subcategorias.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um filtro no `WHERE` sobre uma coluna da tabela do lado direito de um `LEFT JOIN` descarta as linhas sem par e o transforma, na prática, em `INNER JOIN`; a condição deve ir no `ON`.",
                "Juntar uma tabela com relações de um para muitos multiplica as linhas: agregar depois de duas junções paralelas conta em dobro (fan-out).",
                "Esquecer a condição `ON` (ou usar `CROSS JOIN` sem querer) gera o produto cartesiano, com milhões de linhas em tabelas médias.",
                "Valores `NULL` nunca se correspondem em um `JOIN`: linhas com a chave nula ficam de fora do `INNER JOIN`.",
                "`JOIN` em colunas sem índice, em tabelas grandes, é lento; e muitas junções em uma só consulta são difíceis de ler e de otimizar.",
              ],
            },
          ],
          examples: [
            {
              title: "A armadilha do WHERE em um LEFT JOIN",
              context: "Onde se coloca o filtro muda o resultado.",
              code: {
                language: "javascript",
                filename: "left-join-where.js",
                code: [
                  "// Filtro no WHERE: Caio (sem pedidos) some, porque `o.total_cents` é NULL para ele e a condição falha",
                  "rows(`",
                  "  SELECT c.name, o.total_cents FROM customers c",
                  "  LEFT JOIN orders o ON o.customer_id = c.id",
                  "  WHERE o.total_cents > 1000 ORDER BY c.id",
                  "`);   // Ana/1990, Bia/3000   — virou um INNER JOIN",
                  "",
                  "// Filtro no ON: o filtro vale só para a junção, e todos os clientes continuam aparecendo",
                  "rows(`",
                  "  SELECT c.name, o.total_cents FROM customers c",
                  "  LEFT JOIN orders o ON o.customer_id = c.id AND o.total_cents > 1000 ORDER BY c.id",
                  "`);   // Ana/1990, Bia/3000, Caio/null",
                ].join("\n"),
              },
              explanation:
                "Na primeira forma, o Caio desapareceu junto com os pedidos pequenos de Ana. Na segunda, o filtro só " +
                "restringe quais pedidos entram na junção, e todos os clientes permanecem.",
            },
            {
              title: "Self-join: funcionários e gerentes",
              context: "A mesma tabela aparece duas vezes, com aliases diferentes.",
              code: {
                language: "javascript",
                filename: "self-join.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER REFERENCES employees(id));",
                  "  INSERT INTO employees VALUES (1, 'Diana', NULL), (2, 'Eva', 1), (3, 'Fábio', 1), (4, 'Gil', 2);",
                  "`);",
                  "",
                  "rows(`",
                  "  SELECT e.name AS employee, m.name AS manager",
                  "  FROM employees e LEFT JOIN employees m ON m.id = e.manager_id",
                  "  ORDER BY e.id",
                  "`);",
                  "// Diana/null (sem gerente), Eva/Diana, Fábio/Diana, Gil/Eva",
                ].join("\n"),
              },
              explanation:
                "O `LEFT JOIN` mantém Diana, que não tem gerente. Cada linha do lado esquerdo é um funcionário, e a do " +
                "direito é o seu gerente.",
            },
            {
              title: "Multiplicação de linhas em junções paralelas",
              context: "Juntar duas relações de um para muitos ao mesmo tempo produz um produto entre elas.",
              code: {
                language: "javascript",
                filename: "fan-out.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE payments (id INTEGER PRIMARY KEY, order_id INTEGER, amount_cents INTEGER);",
                  "  CREATE TABLE shipments (id INTEGER PRIMARY KEY, order_id INTEGER, carrier TEXT);",
                  "  INSERT INTO payments VALUES (1, 10, 1000), (2, 10, 990);          -- o pedido 10 foi pago em 2 parcelas",
                  "  INSERT INTO shipments VALUES (1, 10, 'A'), (2, 10, 'B');          -- e enviado em 2 remessas",
                  "`);",
                  "",
                  "// 2 pagamentos × 2 remessas = 4 linhas para o mesmo pedido, e a soma dos pagamentos dobra",
                  "rows(`",
                  "  SELECT SUM(p.amount_cents) AS pago",
                  "  FROM orders o JOIN payments p ON p.order_id = o.id JOIN shipments s ON s.order_id = o.id",
                  "  WHERE o.id = 10",
                  "`);   // { pago: 3980 }  ← errado: o correto é 1990",
                ].join("\n"),
              },
              explanation:
                "Cada parcela de pagamento foi repetida uma vez por remessa. A solução é agregar cada relação separada, " +
                "antes de juntá-las, ou consultá-las em separado.",
            },
          ],
          exercise: {
            problem:
              "O time de marketing quer contatar os clientes que nunca fizeram um pedido, e também saber quantos " +
              "pedidos cada cliente fez, incluindo os que fizeram zero.",
            problemCode: {
              language: "javascript",
              filename: "customers-without-orders.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total_cents INTEGER);",
                "  INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bia'), (3, 'Caio');",
                "  INSERT INTO orders VALUES (10, 1, 1990), (11, 1, 500), (12, 2, 3000);",
                "`);",
              ].join("\n"),
            },
            task:
              "Escreva duas consultas: os nomes dos clientes sem nenhum pedido, e a contagem de pedidos por cliente, " +
              "com zero para quem não tem.",
            hint: "`LEFT JOIN` de clientes com pedidos. Para os sem pedido, `WHERE o.id IS NULL`. Para a contagem, `COUNT(o.id)` (e não `COUNT(*)`) ignora os `NULL`.",
            solution: {
              code: {
                language: "javascript",
                filename: "customers-without-orders.fixed.js",
                code: [
                  "const rows = (sql) => db.prepare(sql).all().map((row) => ({ ...row }));",
                  "",
                  "// 1. Clientes sem pedidos",
                  "rows(`",
                  "  SELECT c.name FROM customers c",
                  "  LEFT JOIN orders o ON o.customer_id = c.id",
                  "  WHERE o.id IS NULL",
                  "`);   // [{ name: \"Caio\" }]",
                  "",
                  "// 2. Pedidos por cliente, com zero para quem não tem",
                  "rows(`",
                  "  SELECT c.name, COUNT(o.id) AS pedidos",
                  "  FROM customers c LEFT JOIN orders o ON o.customer_id = c.id",
                  "  GROUP BY c.id, c.name ORDER BY c.id",
                  "`);   // Ana/2, Bia/1, Caio/0",
                ].join("\n"),
              },
              explanation:
                "O `LEFT JOIN` mantém todos os clientes, e `IS NULL` isola os sem pedido. `COUNT(o.id)` conta só os " +
                "valores não nulos, então Caio fica com zero, enquanto `COUNT(*)` contaria a linha do Caio como 1.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Aggregate Functions & GROUP BY",
          requires: ["SQL"],
          subtopics: ["COUNT/SUM/AVG/MIN/MAX", "GROUP BY", "HAVING × WHERE"],
          note: "consolidada (A18)",
          summary:
            "Funções que resumem várias linhas em um valor — contar, somar, tirar a média, o mínimo e o " +
            "máximo — e o `GROUP BY`, que faz esse resumo por grupo, com `HAVING` para filtrar os grupos.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma função de agregação transforma um conjunto de linhas em um único valor: `COUNT`, `SUM`, `AVG`, " +
                "`MIN` e `MAX`. Sem `GROUP BY`, o resumo é da tabela toda. Com `GROUP BY`, ele é feito para cada grupo de " +
                "linhas com o mesmo valor nas colunas indicadas, como o total por cliente ou por mês. O `WHERE` filtra " +
                "as linhas antes de agrupar, e o `HAVING` filtra os grupos depois de agregados.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Agrupe as linhas, resuma cada grupo, e filtre no momento certo: WHERE antes de agrupar, HAVING " +
                "depois.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "aggregates.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, status TEXT, total_cents INTEGER);",
                "  INSERT INTO orders VALUES",
                "    (1, 'Ana', 'paid', 1990), (2, 'Ana', 'paid', 500), (3, 'Ana', 'cancelled', 8000),",
                "    (4, 'Bia', 'paid', 3000), (5, 'Caio', 'paid', 200);",
                "`);",
                "",
                "const rows = (sql) => db.prepare(sql).all().map((row) => ({ ...row }));",
                "",
                "// Sem GROUP BY: um resumo da tabela inteira",
                "rows(\"SELECT COUNT(*) AS pedidos, SUM(total_cents) AS soma, MAX(total_cents) AS maior FROM orders\");",
                "// { pedidos: 5, soma: 13690, maior: 8000 }",
                "",
                "// Com GROUP BY: um resumo por cliente, só com os pedidos pagos (WHERE), e só os que somam mais de 1000 (HAVING)",
                "rows(`",
                "  SELECT customer, COUNT(*) AS pedidos, SUM(total_cents) AS total",
                "  FROM orders",
                "  WHERE status = 'paid'            -- filtra as LINHAS, antes de agrupar",
                "  GROUP BY customer",
                "  HAVING SUM(total_cents) > 1000   -- filtra os GRUPOS, depois de agregar",
                "  ORDER BY total DESC",
                "`);   // Bia/1/3000, Ana/2/2490   (Caio, com 200, ficou de fora)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O pedido cancelado de Ana, de 8.000, foi eliminado pelo `WHERE` antes de o grupo ser formado, e o " +
                "Caio foi eliminado pelo `HAVING`, depois de a soma ser calculada.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para relatórios e indicadores: totais por cliente, por período e por categoria, contagens e médias.",
                "Sempre que a resposta é um resumo, e não as linhas: pedir ao banco a soma é muito mais eficiente que trazer as linhas e somá-las na aplicação.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "`COUNT(*)` conta linhas, e `COUNT(coluna)` conta só os valores não nulos; confundir os dois dá números diferentes.",
                "As funções ignoram `NULL`, e `SUM` de nenhuma linha devolve `NULL`, e não zero; use `COALESCE(SUM(x), 0)` quando um zero for o esperado.",
                "No SQL padrão, toda coluna do `SELECT` que não é agregada precisa estar no `GROUP BY`; alguns bancos (SQLite, MySQL em certos modos) toleram e devolvem um valor arbitrário.",
                "Agregar depois de juntar relações de um para muitos pode contar em dobro (fan-out); agregue cada lado antes de juntar.",
                "Filtrar com `HAVING` o que poderia ser filtrado com `WHERE` desperdiça trabalho, porque as linhas são agrupadas antes de serem descartadas.",
              ],
            },
          ],
          examples: [
            {
              title: "WHERE ou HAVING?",
              context: "Filtrar linhas e filtrar grupos são etapas diferentes.",
              code: {
                language: "javascript",
                filename: "where-vs-having.js",
                code: [
                  "// WHERE: uma condição sobre cada linha, antes do agrupamento",
                  "rows(\"SELECT customer, COUNT(*) AS n FROM orders WHERE status = 'paid' GROUP BY customer ORDER BY customer\");",
                  "// Ana/2, Bia/1, Caio/1",
                  "",
                  "// HAVING: uma condição sobre o resultado da agregação (não existe antes de agrupar)",
                  "rows(\"SELECT customer, COUNT(*) AS n FROM orders GROUP BY customer HAVING COUNT(*) >= 2\");",
                  "// Ana/3   — só Ana tem 2 ou mais pedidos",
                  "",
                  "// Usar WHERE com uma agregação não funciona: `WHERE COUNT(*) >= 2` é um erro,",
                  "// porque a contagem só existe depois de as linhas serem agrupadas.",
                ].join("\n"),
              },
              explanation:
                "A regra prática: se a condição é sobre uma coluna, use `WHERE`; se é sobre um resultado de agregação, " +
                "use `HAVING`.",
            },
            {
              title: "COUNT(*), COUNT(coluna) e COUNT(DISTINCT)",
              context: "O que cada forma conta muda quando há valores nulos e repetidos.",
              code: {
                language: "javascript",
                filename: "count-forms.js",
                code: [
                  "db.exec(\"CREATE TABLE visits (id INTEGER PRIMARY KEY, user_id INTEGER)\");",
                  "db.exec(\"INSERT INTO visits (user_id) VALUES (1), (1), (2), (NULL), (NULL)\");",
                  "",
                  "rows(`",
                  "  SELECT COUNT(*) AS linhas,                  -- 5: todas as linhas",
                  "         COUNT(user_id) AS com_usuario,       -- 3: ignora os NULL",
                  "         COUNT(DISTINCT user_id) AS usuarios  -- 2: valores distintos e não nulos",
                  "  FROM visits",
                  "`);   // { linhas: 5, com_usuario: 3, usuarios: 2 }",
                ].join("\n"),
              },
              explanation:
                "Visitas anônimas (`NULL`) contam em `COUNT(*)`, mas não em `COUNT(user_id)`. Para contar usuários únicos, " +
                "o `DISTINCT` é o que interessa.",
            },
            {
              title: "Contar em dobro depois de um JOIN",
              context: "Agregue cada lado antes de juntar, e o resultado deixa de se multiplicar.",
              code: {
                language: "javascript",
                filename: "fan-out-fix.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE payments (order_id INTEGER, amount_cents INTEGER);",
                  "  CREATE TABLE shipments (order_id INTEGER, carrier TEXT);",
                  "  INSERT INTO payments VALUES (10, 1000), (10, 990);",
                  "  INSERT INTO shipments VALUES (10, 'A'), (10, 'B');",
                  "`);",
                  "",
                  "// Errado: 2 × 2 linhas por pedido, e o total dobra",
                  "rows(\"SELECT SUM(p.amount_cents) AS pago FROM payments p JOIN shipments s ON s.order_id = p.order_id\");",
                  "// { pago: 3980 }",
                  "",
                  "// Certo: agrega cada lado separadamente e junta os resumos",
                  "rows(`",
                  "  SELECT p.order_id, p.pago, s.remessas",
                  "  FROM (SELECT order_id, SUM(amount_cents) AS pago FROM payments GROUP BY order_id) p",
                  "  JOIN (SELECT order_id, COUNT(*) AS remessas FROM shipments GROUP BY order_id) s ON s.order_id = p.order_id",
                  "`);   // { order_id: 10, pago: 1990, remessas: 2 }",
                ].join("\n"),
              },
              explanation:
                "Cada lado foi resumido a uma linha por pedido antes da junção, e o produto entre as duas relações deixou " +
                "de existir. Os números agora batem com a realidade.",
            },
          ],
          exercise: {
            problem:
              "O financeiro quer saber, para cada mês, quantos pedidos pagos houve e quanto foi faturado, mostrando só " +
              "os meses com faturamento acima de 2.000 centavos, do maior para o menor.",
            problemCode: {
              language: "javascript",
              filename: "monthly-revenue.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, created_at TEXT, status TEXT, total_cents INTEGER);",
                "  INSERT INTO orders VALUES",
                "    (1, '2026-01-05', 'paid', 1500), (2, '2026-01-20', 'paid', 1200), (3, '2026-01-25', 'cancelled', 9000),",
                "    (4, '2026-02-03', 'paid', 800), (5, '2026-03-10', 'paid', 4000), (6, '2026-03-11', 'paid', 700);",
                "`);",
              ].join("\n"),
            },
            task:
              "Escreva a consulta: mês (`substr(created_at, 1, 7)`), número de pedidos pagos e faturamento, só para meses " +
              "acima de 2.000, em ordem decrescente de faturamento.",
            hint: "Filtre o status com `WHERE`, agrupe por mês, e filtre o total do mês com `HAVING`.",
            solution: {
              code: {
                language: "javascript",
                filename: "monthly-revenue.fixed.js",
                code: [
                  "db.prepare(`",
                  "  SELECT substr(created_at, 1, 7) AS mes,",
                  "         COUNT(*) AS pedidos,",
                  "         SUM(total_cents) AS faturamento",
                  "  FROM orders",
                  "  WHERE status = 'paid'                      -- antes de agrupar: o cancelado não entra",
                  "  GROUP BY substr(created_at, 1, 7)",
                  "  HAVING SUM(total_cents) > 2000             -- depois de agregar: descarta os meses fracos",
                  "  ORDER BY faturamento DESC",
                  "`).all().map((row) => ({ ...row }));",
                  "// [{ mes: \"2026-03\", pedidos: 2, faturamento: 4700 }, { mes: \"2026-01\", pedidos: 2, faturamento: 2700 }]",
                  "// fevereiro (800) ficou de fora pelo HAVING, e o pedido cancelado de janeiro pelo WHERE",
                ].join("\n"),
              },
              explanation:
                "O `WHERE` tirou o pedido cancelado antes do agrupamento, e o `HAVING` descartou fevereiro depois da soma. " +
                "Cada condição foi colocada na etapa em que a informação existe.",
            },
          },
        }),
        concept({
          order: 90,
          title: "Subqueries & CTEs",
          requires: ["SQL"],
          subtopics: ["correlacionada × não-correlacionada", "WITH", "CTE recursiva (menção)"],
          note: "consolidada (§D) — absorve CTE do rascunho",
          summary:
            "Consultas dentro de consultas: a subquery aparece no meio de outra, e a CTE (`WITH`) dá nome a um " +
            "resultado intermediário para que a consulta se leia em passos, e pode até se referir a si mesma.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma subquery é um `SELECT` dentro de outro, usado como valor (`WHERE preco > (SELECT AVG(preco) ...)`), " +
                "como lista (`IN (SELECT ...)`), como teste de existência (`EXISTS`) ou como uma tabela temporária no " +
                "`FROM`. Ela é não correlacionada quando roda de forma independente da consulta externa, e correlacionada " +
                "quando depende da linha externa. Uma CTE (Common Table Expression, `WITH nome AS (...)`) dá um nome a " +
                "um resultado intermediário, o que permite escrever a consulta como uma sequência de passos legíveis. " +
                "A CTE recursiva se refere a si mesma e percorre estruturas hierárquicas.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Quebre uma pergunta complicada em partes com nomes: a subquery responde a uma pergunta dentro da " +
                "outra, e a CTE deixa a sequência de raciocínio explícita.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "subqueries-ctes.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total_cents INTEGER);",
                "  INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bia'), (3, 'Caio');",
                "  INSERT INTO orders VALUES (10, 1, 1990), (11, 1, 500), (12, 2, 3000);",
                "`);",
                "",
                "const rows = (sql) => db.prepare(sql).all().map((row) => ({ ...row }));",
                "",
                "// Subquery escalar: pedidos acima da média",
                "rows(\"SELECT id, total_cents FROM orders WHERE total_cents > (SELECT AVG(total_cents) FROM orders) ORDER BY id\");",
                "// [{ id: 12, total_cents: 3000 }]",
                "",
                "// Subquery correlacionada com EXISTS: clientes que têm ao menos um pedido",
                "rows(\"SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) ORDER BY name\");",
                "// Ana, Bia",
                "",
                "// CTE: a consulta em passos nomeados (1. total por cliente; 2. quem passa de 2.000)",
                "rows(`",
                "  WITH totals AS (",
                "    SELECT customer_id, SUM(total_cents) AS total FROM orders GROUP BY customer_id",
                "  )",
                "  SELECT c.name, t.total FROM totals t JOIN customers c ON c.id = t.customer_id",
                "  WHERE t.total > 2000 ORDER BY t.total DESC",
                "`);   // Bia/3000, Ana/2490",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A versão com `WITH` se lê de cima para baixo: primeiro se calcula o total por cliente, depois se " +
                "filtra. Sem a CTE, o mesmo cálculo estaria aninhado dentro do `FROM`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Subqueries para perguntas do tipo \"acima da média\", \"que existe em\" e \"que não existe em\", com `EXISTS` e `NOT EXISTS`.",
                "CTEs para dividir uma consulta longa em partes com nome, reaproveitar um resultado intermediário e melhorar a leitura.",
                "CTEs recursivas para hierarquias: organogramas, categorias com subcategorias e árvores de arquivos.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma subquery correlacionada pode ser executada uma vez por linha externa, e ficar lenta em tabelas grandes; o otimizador costuma reescrevê-la, mas nem sempre, e um `JOIN` pode ser mais claro.",
                "`NOT IN` com uma subquery que devolve algum `NULL` não devolve nenhuma linha; prefira `NOT EXISTS`.",
                "O tratamento de CTEs pelo otimizador varia: em alguns bancos ou versões elas são calculadas uma vez e guardadas, e em outros são incorporadas à consulta; não conte com uma como uma \"barreira\" de desempenho.",
                "Uma CTE recursiva precisa de uma condição de parada: com dados cíclicos, ela não termina; use `UNION` (que descarta repetidas) ou um limite de profundidade.",
                "Aninhar subqueries demais deixa a consulta ilegível; é o sinal para usar `WITH`.",
              ],
            },
          ],
          examples: [
            {
              title: "A armadilha do NOT IN com NULL",
              context: "Um único `NULL` na lista faz `NOT IN` deixar de devolver qualquer linha.",
              code: {
                language: "javascript",
                filename: "not-in-null.js",
                code: [
                  "db.exec(\"INSERT INTO orders VALUES (13, NULL, 100)\");   // um pedido sem cliente informado",
                  "",
                  "// Errado: `id NOT IN (1, 2, NULL)` é desconhecido para todos, e a consulta devolve 0 linhas",
                  "rows(\"SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders)\");   // []  ← Caio deveria aparecer",
                  "",
                  "// Certo: NOT EXISTS não tem esse problema",
                  "rows(\"SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)\");",
                  "// [{ name: \"Caio\" }]",
                ].join("\n"),
              },
              explanation:
                "Por causa da lógica de três valores, comparar com `NULL` resulta em desconhecido, e `NOT IN` exige que " +
                "todas as comparações sejam verdadeiras. `NOT EXISTS` testa a existência, e ignora esse problema.",
            },
            {
              title: "CTEs encadeadas",
              context: "Cada passo usa o resultado do anterior, e a leitura acompanha o raciocínio.",
              code: {
                language: "javascript",
                filename: "chained-ctes.js",
                code: [
                  "rows(`",
                  "  WITH totals AS (",
                  "    SELECT customer_id, SUM(total_cents) AS total FROM orders WHERE customer_id IS NOT NULL GROUP BY customer_id",
                  "  ),",
                  "  average AS (",
                  "    SELECT AVG(total) AS media FROM totals",
                  "  )",
                  "  SELECT c.name, t.total",
                  "  FROM totals t",
                  "  JOIN customers c ON c.id = t.customer_id",
                  "  JOIN average a ON t.total > a.media",
                  "  ORDER BY t.total DESC",
                  "`);   // clientes cujo total está acima da média dos totais",
                ].join("\n"),
              },
              explanation:
                "Primeiro o total por cliente, depois a média desses totais, e por fim quem a supera. Escrito com " +
                "subqueries aninhadas, a mesma consulta seria bem mais difícil de acompanhar.",
            },
            {
              title: "CTE recursiva: percorrer uma hierarquia",
              context: "Uma tabela que aponta para si mesma pode ser percorrida em todos os níveis.",
              code: {
                language: "javascript",
                filename: "recursive-cte.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER);",
                  "  INSERT INTO employees VALUES (1, 'Diana', NULL), (2, 'Eva', 1), (3, 'Fábio', 1), (4, 'Gil', 2);",
                  "`);",
                  "",
                  "// Todos os subordinados de Diana, diretos e indiretos, com o nível de cada um",
                  "rows(`",
                  "  WITH RECURSIVE team(id, name, level) AS (",
                  "    SELECT id, name, 0 FROM employees WHERE id = 1              -- ponto de partida",
                  "    UNION ALL",
                  "    SELECT e.id, e.name, t.level + 1                            -- passo recursivo",
                  "    FROM employees e JOIN team t ON e.manager_id = t.id",
                  "  )",
                  "  SELECT name, level FROM team ORDER BY level, name",
                  "`);   // Diana/0, Eva/1, Fábio/1, Gil/2",
                ].join("\n"),
              },
              explanation:
                "A consulta começa em Diana e, a cada passo, acrescenta quem responde a alguém já encontrado, até não " +
                "haver mais ninguém. Sem um ponto de parada, um ciclo nos dados a faria rodar para sempre.",
            },
          ],
          exercise: {
            problem:
              "A gerência quer saber quais clientes gastaram mais do que a média dos clientes, mostrando o nome, o " +
              "total gasto e a diferença em relação à média. A primeira versão tem três níveis de subqueries aninhadas.",
            problemCode: {
              language: "javascript",
              filename: "above-average.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total_cents INTEGER);",
                "  INSERT INTO customers VALUES (1, 'Ana'), (2, 'Bia'), (3, 'Caio');",
                "  INSERT INTO orders VALUES (10, 1, 1990), (11, 1, 500), (12, 2, 3000), (13, 3, 200);",
                "`);",
                "",
                "// Versão atual, difícil de ler:",
                "// SELECT name, total FROM (SELECT c.name, SUM(o.total_cents) AS total FROM customers c JOIN orders o ON ...",
                "//   GROUP BY c.id) WHERE total > (SELECT AVG(total) FROM (SELECT SUM(total_cents) AS total FROM orders GROUP BY customer_id))",
              ].join("\n"),
            },
            task:
              "Reescreva com CTEs nomeadas (`totals` e `average`), devolvendo `name`, `total` e `above_average` (a " +
              "diferença), em ordem decrescente.",
            hint: "`totals` soma por cliente e faz o `JOIN` com o nome. `average` calcula `AVG(total)` sobre `totals`. Depois, junte e filtre.",
            solution: {
              code: {
                language: "javascript",
                filename: "above-average.fixed.js",
                code: [
                  "db.prepare(`",
                  "  WITH totals AS (",
                  "    SELECT c.id, c.name, SUM(o.total_cents) AS total",
                  "    FROM customers c JOIN orders o ON o.customer_id = c.id",
                  "    GROUP BY c.id, c.name",
                  "  ),",
                  "  average AS (",
                  "    SELECT AVG(total) AS media FROM totals",
                  "  )",
                  "  SELECT t.name, t.total, t.total - a.media AS above_average",
                  "  FROM totals t, average a",
                  "  WHERE t.total > a.media",
                  "  ORDER BY above_average DESC",
                  "`).all().map((row) => ({ ...row }));",
                  "// médias: (2490 + 3000 + 200) / 3 = 1896.67 → só Bia (3000) e Ana (2490) estão acima",
                  "// [{ name: \"Bia\", total: 3000, above_average: 1103.33... }, { name: \"Ana\", total: 2490, above_average: 593.33... }]",
                ].join("\n"),
              },
              explanation:
                "As duas CTEs deixam a lógica em dois passos legíveis: primeiro o total de cada cliente, depois a média " +
                "desses totais. O filtro e a diferença ficam em uma consulta final simples.",
            },
          },
        }),
        concept({
          order: 100,
          title: "Database Schema",
          requires: ["Table", "Constraint"],
          note: "a estrutura do banco: tabelas, colunas, tipos, chaves e constraints",
          collision: "≠ Schema-on-Read (NoSQL) ≠ GraphQL Schema ≠ JSON Schema (AI Engineering)",
          summary:
            "A descrição completa da estrutura de um banco — as tabelas, as colunas e os seus tipos, as chaves, as " +
            "constraints e os índices — e a forma de evoluí-la de maneira controlada, por migrações.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O esquema (schema) de um banco relacional é a sua estrutura: quais tabelas existem, quais colunas cada " +
                "uma tem e de que tipo, como se relacionam (chaves) e que regras valem (constraints), além de índices e " +
                "visões. Ele é o contrato entre o banco e a aplicação. Em bancos como o PostgreSQL, \"schema\" também é " +
                "um espaço de nomes dentro do banco (`public.orders`), o que é um segundo significado. Como o esquema " +
                "muda ao longo da vida do sistema, ele é versionado por migrações, scripts numerados e guardados no " +
                "repositório junto do código.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O esquema é o contrato do banco, e mudá-lo é uma alteração de código como outra qualquer: " +
                "versionada, revisada e aplicada de forma repetível em todos os ambientes.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "O esquema é lido pelo próprio banco (introspecção) e evoluído por migrações: cada uma é um passo " +
                "identificado, aplicado uma única vez e registrado em uma tabela de controle. Quem sobe o sistema em " +
                "qualquer ambiente aplica as migrações pendentes, na ordem, e chega ao mesmo esquema.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "schema.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "// Migrações: passos numerados e imutáveis (uma vez aplicada, uma migração não é editada)",
                "const migrations = [",
                "  { id: 1, name: \"create customers\", sql: \"CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL)\" },",
                "  { id: 2, name: \"add email\", sql: \"ALTER TABLE customers ADD COLUMN email TEXT\" },",
                "  { id: 3, name: \"index email\", sql: \"CREATE UNIQUE INDEX idx_customers_email ON customers(email)\" },",
                "];",
                "",
                "function migrate(db, migrations) {",
                "  db.exec(\"CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT (datetime('now')))\");",
                "  const applied = new Set(db.prepare(\"SELECT id FROM schema_migrations\").all().map((row) => row.id));",
                "",
                "  for (const migration of migrations.filter((m) => !applied.has(m.id)).sort((a, b) => a.id - b.id)) {",
                "    db.exec(\"BEGIN\");",
                "    try {",
                "      db.exec(migration.sql);",
                "      db.prepare(\"INSERT INTO schema_migrations (id, name) VALUES (?, ?)\").run(migration.id, migration.name);",
                "      db.exec(\"COMMIT\");",
                "    } catch (error) {",
                "      db.exec(\"ROLLBACK\");   // uma migração que falha não deixa o esquema pela metade",
                "      throw error;",
                "    }",
                "  }",
                "}",
                "",
                "migrate(db, migrations);   // aplica as 3",
                "migrate(db, migrations);   // repetir não faz nada: todas já foram aplicadas",
                "",
                "// Introspecção: o esquema atual, lido do próprio banco",
                "db.prepare(\"SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name\").all();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Rodar `migrate` em um banco novo o leva do zero à versão atual, e em um banco antigo aplica só o que " +
                "falta. Ferramentas como Flyway, Liquibase, Prisma Migrate e Knex fazem esse trabalho com mais recursos.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Alterar o banco de produção à mão, sem migração, deixa os ambientes com esquemas diferentes (drift), e ninguém sabe ao certo qual é o real.",
                "Editar uma migração já aplicada não muda os bancos que a executaram: crie sempre uma nova migração.",
                "Migrações destrutivas, como apagar uma coluna, perdem dados sem volta; faça cópia e confirme antes.",
                "O esquema novo precisa conviver com a versão antiga da aplicação durante a implantação: renomear ou apagar uma coluna de uma vez quebra o código que ainda roda; a saída é o padrão \"expandir e contrair\".",
                "Em tabelas grandes, alguns `ALTER TABLE` bloqueiam a tabela por muito tempo; avalie o comportamento do banco antes de rodar em produção.",
                "\"Schema\" tem vários sentidos: o do banco relacional, o namespace do PostgreSQL, o GraphQL Schema, o JSON Schema e o schema-on-read dos bancos NoSQL não são a mesma coisa.",
              ],
            },
          ],
          examples: [
            {
              title: "Ler o esquema do próprio banco",
              context: "O esquema é dado como qualquer outro, e pode ser consultado.",
              code: {
                language: "javascript",
                filename: "introspection.js",
                code: [
                  "db.prepare(\"PRAGMA table_info(customers)\").all().map((column) => ({",
                  "  name: column.name, type: column.type, notNull: column.notnull === 1, primaryKey: column.pk === 1,",
                  "}));",
                  "// [{ name: \"id\", type: \"INTEGER\", notNull: false, primaryKey: true },",
                  "//  { name: \"name\", type: \"TEXT\", notNull: true, primaryKey: false },",
                  "//  { name: \"email\", type: \"TEXT\", notNull: false, primaryKey: false }]",
                  "",
                  "// No PostgreSQL, o equivalente é a consulta ao `information_schema.columns`.",
                ].join("\n"),
              },
              explanation:
                "É assim que ferramentas geram diagramas, documentação, tipos de código e comparações entre ambientes: " +
                "lendo o esquema do próprio banco.",
            },
            {
              title: "Expandir e contrair: renomear uma coluna sem derrubar o sistema",
              context: "Trocar o nome de uma vez quebra a versão antiga da aplicação que ainda está no ar.",
              code: {
                language: "text",
                filename: "expand-contract.txt",
                code: [
                  "Objetivo: renomear customers.fullname para customers.name, sem indisponibilidade.",
                  "",
                  "1. EXPANDIR   Migração: adicionar a coluna nova (name), com os dados copiados da antiga.",
                  "              Aplicação v1 (antiga) segue usando fullname; nada quebra.",
                  "2. MIGRAR     Aplicação v2: passa a escrever nas duas colunas e a ler de name.",
                  "3. CONTRAIR   Quando nenhuma instância antiga estiver no ar: migração que remove fullname.",
                  "",
                  "Um renomear direto (ALTER ... RENAME COLUMN) em um passo só quebra a v1 no instante em que roda.",
                ].join("\n"),
              },
              explanation:
                "Cada passo é compatível com a versão da aplicação que está no ar, o que permite implantar sem parada. " +
                "É a mesma ideia de compatibilidade das APIs, aplicada ao banco.",
            },
            {
              title: "Uma migração que falha não deixa rastros",
              context: "A transação garante que a migração é aplicada por inteiro ou não é aplicada.",
              code: {
                language: "javascript",
                filename: "failing-migration.js",
                code: [
                  "const broken = [",
                  "  ...migrations,",
                  "  { id: 4, name: \"partial\", sql: \"ALTER TABLE customers ADD COLUMN phone TEXT; ALTER TABLE customers ADD COLUMN phone TEXT\" },   // a 2ª falha",
                  "];",
                  "",
                  "try { migrate(db, broken); }",
                  "catch (error) { error.message; }   // \"duplicate column name: phone\"",
                  "",
                  "// A transação desfez a 1ª coluna: o esquema não ficou pela metade, e a migração 4 não foi registrada",
                  "db.prepare(\"SELECT id FROM schema_migrations ORDER BY id\").all().map((row) => row.id);   // [1, 2, 3]",
                ].join("\n"),
              },
              explanation:
                "Bancos como o PostgreSQL também tornam a maior parte das alterações de esquema transacionais. Em outros, " +
                "como o MySQL, muitas alterações confirmam sozinhas, e é preciso mais cuidado.",
            },
          ],
          exercise: {
            problem:
              "O time aplica as alterações de esquema executando scripts SQL à mão em cada ambiente. Homologação e " +
              "produção já estão diferentes, e ninguém sabe qual script foi rodado onde.",
            problemCode: {
              language: "javascript",
              filename: "manual-scripts.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "const migrations = [",
                "  { id: 1, name: \"create products\", sql: \"CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL)\" },",
                "  { id: 2, name: \"add price\", sql: \"ALTER TABLE products ADD COLUMN price_cents INTEGER NOT NULL DEFAULT 0\" },",
                "];",
                "",
                "function migrate(db, migrations) {",
                "  // aplicar só as pendentes, na ordem, registrando cada uma; uma falha desfaz a migração inteira",
                "}",
              ].join("\n"),
            },
            task:
              "Implemente `migrate`: crie a tabela de controle, aplique só as migrações ainda não registradas, em ordem, " +
              "cada uma em uma transação, e mostre que rodar duas vezes não repete nada.",
            hint: "Leia os ids já aplicados de `schema_migrations`, filtre e ordene as pendentes, e envolva cada uma em `BEGIN`/`COMMIT` com `ROLLBACK` no erro.",
            solution: {
              code: {
                language: "javascript",
                filename: "manual-scripts.fixed.js",
                code: [
                  "function migrate(db, migrations) {",
                  "  db.exec(`",
                  "    CREATE TABLE IF NOT EXISTS schema_migrations (",
                  "      id INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT (datetime('now'))",
                  "    )",
                  "  `);",
                  "",
                  "  const applied = new Set(db.prepare(\"SELECT id FROM schema_migrations\").all().map((row) => row.id));",
                  "  const pending = migrations.filter((m) => !applied.has(m.id)).sort((a, b) => a.id - b.id);",
                  "",
                  "  for (const migration of pending) {",
                  "    db.exec(\"BEGIN\");",
                  "    try {",
                  "      db.exec(migration.sql);",
                  "      db.prepare(\"INSERT INTO schema_migrations (id, name) VALUES (?, ?)\").run(migration.id, migration.name);",
                  "      db.exec(\"COMMIT\");",
                  "    } catch (error) {",
                  "      db.exec(\"ROLLBACK\");",
                  "      throw error;",
                  "    }",
                  "  }",
                  "  return pending.map((m) => m.id);",
                  "}",
                  "",
                  "migrate(db, migrations);   // [1, 2]",
                  "migrate(db, migrations);   // []  — nada pendente",
                ].join("\n"),
              },
              explanation:
                "Qualquer ambiente, vazio ou antigo, chega ao mesmo esquema aplicando só o que falta, e a tabela de " +
                "controle diz exatamente quais passos foram rodados. Cada migração é aplicada por inteiro ou nenhuma.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "database-design",
      order: 50,
      title: "Database Design",
      requires: ["Database Fundamentals"],
      summary:
        "Data modeling → cardinalidade → normalização → normal forms → denormalização → chave natural × " +
        "surrogate → migração.",
      concepts: [
        concept({
          order: 10,
          title: "Data Modeling",
          requires: ["Database Fundamentals / Database Schema"],
          note: "conceitual → lógico → físico. Revisita Software Design / Domain Modeling / Entity (Entity de domínio vira tabela)",
          revisit: ["Software Design / Domain Modeling / Entity"],
          summary:
            "O trabalho de decidir quais dados o sistema guarda e como eles se organizam — das coisas e relações do " +
            "negócio (modelo conceitual) às tabelas e chaves (lógico) e aos tipos e índices de um banco concreto " +
            "(físico).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Modelar dados é traduzir o que o negócio precisa lembrar em uma estrutura que o banco consiga guardar e " +
                "proteger. O trabalho costuma passar por três níveis. O modelo conceitual fala a língua do negócio: quais " +
                "são as coisas importantes (cliente, pedido, produto), o que se sabe sobre cada uma e como se relacionam. " +
                "O modelo lógico transforma isso em tabelas, colunas, chaves e cardinalidades, ainda sem depender de um " +
                "banco específico. O modelo físico escolhe os tipos, os índices e os detalhes do banco real, como " +
                "PostgreSQL, MySQL ou SQLite.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O modelo de dados nasce das perguntas que o sistema precisa responder e das regras que precisa garantir, " +
                "e não da tela ou do formato do JSON: as telas mudam, e os dados ficam.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "O esquema é a parte mais difícil de mudar em um sistema: o código se reescreve, mas os dados acumulados " +
                "precisam ser migrados, e cada consulta, relatório e integração depende da estrutura. Decisões de " +
                "modelagem, como o que é uma entidade própria, o que é só um atributo e o que precisa de histórico, " +
                "definem o que o sistema vai conseguir responder daqui a anos. É também onde o domínio encontra o banco: " +
                "uma entidade do domínio, com identidade própria, costuma virar uma tabela com chave primária, e um " +
                "objeto de valor, como um endereço, costuma virar colunas na tabela de quem o possui.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "list",
              items: [
                "Liste as coisas do negócio que têm identidade e ciclo de vida próprios (as entidades) e o que se precisa saber sobre cada uma.",
                "Defina como elas se relacionam e em que quantidade: um cliente faz vários pedidos, e um produto aparece em vários pedidos.",
                "Escreva as perguntas que o sistema precisa responder (\"quanto cada cliente comprou no mês?\") e confira se o modelo responde a todas.",
                "Traduza para tabelas, chaves e constraints (modelo lógico) e depois escolha os tipos e os índices do banco real (modelo físico).",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "modeling.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "db.exec(\"PRAGMA foreign_keys = ON\");",
                "",
                "// Conceitual: um cliente faz pedidos; um pedido tem itens; cada item é de um produto.",
                "// Lógico e físico: cada entidade vira uma tabela com chave primária; cada relação, uma chave estrangeira.",
                "db.exec(`",
                "  CREATE TABLE customers (",
                "    id INTEGER PRIMARY KEY,",
                "    name TEXT NOT NULL,",
                "    email TEXT NOT NULL UNIQUE,",
                "    -- o endereço é um valor, sem identidade própria: vira colunas de quem o possui",
                "    address_street TEXT NOT NULL,",
                "    address_city TEXT NOT NULL,",
                "    address_postal_code TEXT NOT NULL",
                "  );",
                "  CREATE TABLE products (",
                "    id INTEGER PRIMARY KEY,",
                "    name TEXT NOT NULL,",
                "    price_cents INTEGER NOT NULL CHECK (price_cents >= 0)",
                "  );",
                "  CREATE TABLE orders (",
                "    id INTEGER PRIMARY KEY,",
                "    customer_id INTEGER NOT NULL REFERENCES customers(id),",
                "    placed_at TEXT NOT NULL",
                "  );",
                "  CREATE TABLE order_items (",
                "    order_id INTEGER NOT NULL REFERENCES orders(id),",
                "    product_id INTEGER NOT NULL REFERENCES products(id),",
                "    quantity INTEGER NOT NULL CHECK (quantity > 0),",
                "    unit_price_cents INTEGER NOT NULL,   -- o preço no momento da compra, e não o preço atual",
                "    PRIMARY KEY (order_id, product_id)",
                "  );",
                "`);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada decisão do esquema responde a uma regra ou a uma pergunta do negócio: o `UNIQUE` no e-mail diz que " +
                "não há dois clientes com o mesmo, e o `unit_price_cents` no item guarda quanto se cobrou, mesmo que o " +
                "preço do produto mude amanhã.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Modelar a partir da tela ou do JSON da API acopla o banco à apresentação: quando a tela muda, o esquema não deveria precisar mudar junto.",
                "Guardar só o estado atual, como um `status`, perde a história: se o negócio vai perguntar \"quando\" ou \"quem\", o modelo precisa registrar as mudanças.",
                "Modelar genérico demais, com tabelas de \"entidades\" e \"atributos\" para qualquer coisa, troca um modelo claro por um que o banco não consegue validar nem otimizar.",
                "O modelo do domínio e o modelo de dados não precisam ser idênticos: uma entidade pode ocupar várias tabelas, e um objeto de valor pode caber em poucas colunas.",
              ],
            },
          ],
          examples: [
            {
              title: "Da entidade do domínio à tabela",
              context: "A identidade da entidade vira a chave primária, e os valores que ela possui viram colunas.",
              code: {
                language: "javascript",
                filename: "customer-mapping.js",
                code: [
                  "class Address {",
                  "  constructor(street, city, postalCode) {",
                  "    Object.assign(this, { street, city, postalCode });",
                  "    Object.freeze(this);",
                  "  }",
                  "}",
                  "",
                  "class Customer {",
                  "  constructor(id, name, email, address) {",
                  "    this.id = id;            // identidade: é por ela que o cliente é reconhecido",
                  "    this.name = name;",
                  "    this.email = email;",
                  "    this.address = address;  // um valor: trocado por inteiro quando muda",
                  "  }",
                  "}",
                  "",
                  "// Uma linha da tabela customers",
                  "function toRow(customer) {",
                  "  return {",
                  "    id: customer.id,",
                  "    name: customer.name,",
                  "    email: customer.email,",
                  "    address_street: customer.address.street,",
                  "    address_city: customer.address.city,",
                  "    address_postal_code: customer.address.postalCode,",
                  "  };",
                  "}",
                  "",
                  "function fromRow(row) {",
                  "  const address = new Address(row.address_street, row.address_city, row.address_postal_code);",
                  "  return new Customer(row.id, row.name, row.email, address);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A entidade é reconhecida pelo `id`, e não pelos dados: o cliente continua o mesmo se mudar de endereço. " +
                "O endereço, um objeto de valor, não tem id próprio e mora nas colunas do cliente. Se um cliente pudesse " +
                "ter vários endereços, eles iriam para uma tabela filha, com a chave do cliente.",
            },
            {
              title: "Estado atual ou histórico?",
              context: "Uma coluna `status` responde \"como está\", mas não \"desde quando\" nem \"quem mudou\".",
              code: {
                language: "javascript",
                filename: "order-history.js",
                code: [
                  "db.exec(\"CREATE TABLE orders (id INTEGER PRIMARY KEY, status TEXT NOT NULL)\");",
                  "db.prepare(\"INSERT INTO orders (id, status) VALUES (?, ?)\").run(1, \"paid\");",
                  "",
                  "// Só o estado atual: cada mudança apaga a anterior",
                  "db.prepare(\"UPDATE orders SET status = ? WHERE id = ?\").run(\"shipped\", 1);",
                  "// Quando o pedido foi pago? Não há mais como saber.",
                  "",
                  "// Estado atual + histórico: cada transição vira uma linha",
                  "db.exec(`",
                  "  CREATE TABLE order_status_changes (",
                  "    order_id INTEGER NOT NULL REFERENCES orders(id),",
                  "    status TEXT NOT NULL,",
                  "    changed_at TEXT NOT NULL DEFAULT (datetime('now')),",
                  "    changed_by TEXT NOT NULL",
                  "  )",
                  "`);",
                  "db.prepare(\"INSERT INTO order_status_changes (order_id, status, changed_by) VALUES (?, ?, ?)\")",
                  "  .run(1, \"shipped\", \"warehouse-service\");",
                ].join("\n"),
              },
              explanation:
                "Se o negócio vai perguntar quanto tempo um pedido leva do pagamento ao envio, a pergunta precisa estar " +
                "no modelo desde o início: o histórico que não foi gravado não pode ser reconstruído depois. A coluna " +
                "`status` pode continuar existindo, para a consulta rápida do estado atual.",
            },
            {
              title: "Tipos diferentes da mesma coisa",
              context: "Clientes pessoa física têm CPF, e clientes pessoa jurídica, CNPJ.",
              code: {
                language: "javascript",
                filename: "customer-kinds.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE customers (",
                  "    id INTEGER PRIMARY KEY,",
                  "    kind TEXT NOT NULL CHECK (kind IN ('person', 'company')),",
                  "    name TEXT NOT NULL,",
                  "    cpf TEXT,",
                  "    cnpj TEXT,",
                  "    CHECK (",
                  "      (kind = 'person'  AND cpf IS NOT NULL AND cnpj IS NULL) OR",
                  "      (kind = 'company' AND cnpj IS NOT NULL AND cpf IS NULL)",
                  "    )",
                  "  )",
                  "`);",
                  "",
                  "const insert = db.prepare(\"INSERT INTO customers (kind, name, cpf, cnpj) VALUES (?, ?, ?, ?)\");",
                  "insert.run(\"person\", \"Ana Souza\", \"123.456.789-09\", null);",
                  "try { insert.run(\"company\", \"Loja Azul\", \"123.456.789-09\", null); }",
                  "catch (error) { error.message; }   // \"CHECK constraint failed: ...\" — empresa sem CNPJ",
                ].join("\n"),
              },
              explanation:
                "Com poucos campos específicos, uma tabela só e um `CHECK` que amarra cada tipo aos seus campos bastam. " +
                "Quando cada tipo tem muitos campos próprios, uma tabela comum mais uma tabela por tipo, ligadas pela " +
                "mesma chave, evita dezenas de colunas quase sempre vazias.",
            },
          ],
          exercise: {
            problem:
              "Uma escola quer um sistema de reservas de salas, e os requisitos chegaram em texto: as salas têm nome e " +
              "capacidade; os professores reservam salas por bloco de horário; uma sala não pode ter duas reservas no " +
              "mesmo bloco; e a secretaria quer saber quem fez cada reserva, e quando.",
            problemCode: {
              language: "javascript",
              filename: "room-booking.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "db.exec(\"PRAGMA foreign_keys = ON\");",
                "",
                "// Requisitos:",
                "// - salas têm nome (único) e capacidade (maior que zero)",
                "// - professores têm nome e e-mail (único)",
                "// - um professor reserva uma sala para um bloco de horário (ex.: \"2026-10-01 08:00\")",
                "// - uma sala não pode ter duas reservas no mesmo bloco",
                "// - é preciso saber quem fez cada reserva e quando ela foi feita",
                "db.exec(`",
                "  -- escreva aqui as tabelas",
                "`);",
              ].join("\n"),
            },
            task:
              "Escreva o modelo: as tabelas, as chaves e as constraints que garantem as regras. Depois, mostre que uma " +
              "segunda reserva da mesma sala, no mesmo bloco, é recusada.",
            hint:
              "Salas e professores são entidades; a reserva liga os dois e tem dados próprios (o bloco e o momento em " +
              "que foi feita). A regra \"uma reserva por sala e bloco\" é um `UNIQUE` composto.",
            solution: {
              code: {
                language: "javascript",
                filename: "room-booking.fixed.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE rooms (",
                  "    id INTEGER PRIMARY KEY,",
                  "    name TEXT NOT NULL UNIQUE,",
                  "    capacity INTEGER NOT NULL CHECK (capacity > 0)",
                  "  );",
                  "  CREATE TABLE teachers (",
                  "    id INTEGER PRIMARY KEY,",
                  "    name TEXT NOT NULL,",
                  "    email TEXT NOT NULL UNIQUE",
                  "  );",
                  "  CREATE TABLE bookings (",
                  "    id INTEGER PRIMARY KEY,",
                  "    room_id INTEGER NOT NULL REFERENCES rooms(id),",
                  "    teacher_id INTEGER NOT NULL REFERENCES teachers(id),",
                  "    slot_start TEXT NOT NULL,",
                  "    created_at TEXT NOT NULL DEFAULT (datetime('now')),",
                  "    UNIQUE (room_id, slot_start)",
                  "  );",
                  "`);",
                  "",
                  "db.prepare(\"INSERT INTO rooms (name, capacity) VALUES (?, ?)\").run(\"Laboratório 1\", 30);",
                  "db.prepare(\"INSERT INTO teachers (name, email) VALUES (?, ?)\").run(\"Ana\", \"ana@escola.test\");",
                  "db.prepare(\"INSERT INTO teachers (name, email) VALUES (?, ?)\").run(\"Bruno\", \"bruno@escola.test\");",
                  "",
                  "const book = db.prepare(\"INSERT INTO bookings (room_id, teacher_id, slot_start) VALUES (?, ?, ?)\");",
                  "book.run(1, 1, \"2026-10-01 08:00\");",
                  "try { book.run(1, 2, \"2026-10-01 08:00\"); }",
                  "catch (error) { error.message; }   // \"UNIQUE constraint failed: bookings.room_id, bookings.slot_start\"",
                ].join("\n"),
              },
              explanation:
                "Cada regra do texto virou uma parte do esquema: a unicidade do nome, o `CHECK` da capacidade, as chaves " +
                "estrangeiras e o `UNIQUE` composto que impede duas reservas da mesma sala no mesmo bloco. \"Quem fez\" é a " +
                "chave do professor, e \"quando\" é o `created_at`. Reservas com duração livre, que podem se sobrepor em " +
                "parte, pediriam uma regra mais forte, como as constraints de exclusão do PostgreSQL.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Relationship Cardinality (1:1 / 1:N / N:M)",
          requires: ["Database Fundamentals / Foreign Key"],
          subtopics: ["1:1 (quando faz sentido)", "1:N (FK no lado 'muitos')", "N:M (tabela de junção, atributos na junção)"],
          note: "consolidada (A4)",
          summary:
            "Quantas linhas de uma tabela podem se ligar a quantas de outra — um para um, um para muitos ou muitos " +
            "para muitos — e onde fica, em cada caso, a chave estrangeira que registra a relação.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A cardinalidade descreve a quantidade em uma relação entre duas entidades. Em um para muitos (1:N), um " +
                "cliente tem vários pedidos, e cada pedido é de um só cliente. Em muitos para muitos (N:M), um aluno " +
                "cursa várias disciplinas, e cada disciplina tem vários alunos. Em um para um (1:1), cada usuário tem no " +
                "máximo um perfil, e cada perfil é de um só usuário. Junto da quantidade vem a obrigatoriedade: um pedido " +
                "precisa ter um cliente, mas um cliente pode ainda não ter pedidos.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "A cardinalidade decide onde fica a chave estrangeira: no lado \"muitos\" em 1:N, em uma tabela de junção " +
                "em N:M, e com um `UNIQUE` em 1:1.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "1:N — a chave estrangeira fica na tabela do lado \"muitos\": `orders.customer_id` aponta para `customers.id`. Se ela for `NOT NULL`, todo pedido precisa de um cliente.",
                "N:M — nenhuma das duas tabelas consegue guardar a relação sozinha; uma tabela de junção guarda um par de chaves estrangeiras por ligação, e a chave composta impede pares repetidos.",
                "1:1 — uma chave estrangeira com `UNIQUE`, ou que seja ela mesma a chave primária, garante que cada linha do outro lado aparece no máximo uma vez.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "cardinality.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "db.exec(\"PRAGMA foreign_keys = ON\");",
                "",
                "db.exec(`",
                "  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE);",
                "",
                "  -- 1:1 — a chave primária do perfil é também a chave estrangeira: no máximo um perfil por usuário",
                "  CREATE TABLE profiles (",
                "    user_id INTEGER PRIMARY KEY REFERENCES users(id),",
                "    bio TEXT",
                "  );",
                "",
                "  -- 1:N — a chave estrangeira fica no lado \"muitos\"",
                "  CREATE TABLE posts (",
                "    id INTEGER PRIMARY KEY,",
                "    author_id INTEGER NOT NULL REFERENCES users(id),",
                "    title TEXT NOT NULL",
                "  );",
                "",
                "  -- N:M — uma tabela de junção, com uma linha por ligação",
                "  CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);",
                "  CREATE TABLE post_tags (",
                "    post_id INTEGER NOT NULL REFERENCES posts(id),",
                "    tag_id INTEGER NOT NULL REFERENCES tags(id),",
                "    PRIMARY KEY (post_id, tag_id)",
                "  );",
                "`);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O banco não tem um comando para \"um para muitos\": a cardinalidade é o efeito combinado de onde a chave " +
                "estrangeira está, de ela aceitar ou não `NULL` e de haver ou não um `UNIQUE`.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "1:N é a relação mais comum: um pai com vários filhos que pertencem a um só pai, como cliente e pedidos, ou post e comentários.",
                "N:M quando os dois lados se repetem livremente, como alunos e disciplinas, ou produtos e categorias.",
                "1:1 para separar dados opcionais ou pouco lidos da tabela principal, ou dados com regras de acesso diferentes, como dados sensíveis.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um 1:1 sem motivo claro só divide uma entidade em duas tabelas e acrescenta um `JOIN` a cada leitura; na dúvida, mantenha as colunas juntas.",
                "Um N:M raramente fica \"puro\": quando a ligação ganha dados próprios, como a nota de uma matrícula, a tabela de junção vira uma entidade e merece um nome do negócio.",
                "As chaves garantem o máximo, mas não o mínimo: \"todo pedido tem pelo menos um item\" não se expressa com chaves, e fica na aplicação, que cria os dois na mesma transação.",
              ],
            },
          ],
          examples: [
            {
              title: "A chave estrangeira no lado errado",
              context: "Pôr a referência no lado \"um\" limita a relação a um único filho.",
              code: {
                language: "javascript",
                filename: "fk-side.js",
                code: [
                  "// Errado: o cliente aponta para o pedido — só cabe um pedido por cliente",
                  "const wrong = `",
                  "  CREATE TABLE orders (id INTEGER PRIMARY KEY, placed_at TEXT NOT NULL);",
                  "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, order_id INTEGER REFERENCES orders(id));",
                  "`;",
                  "// O passo seguinte costuma piorar: order_id_2, order_id_3... ou uma lista de ids em texto",
                  "",
                  "// Certo: cada pedido aponta para o seu cliente, e um cliente pode ter quantos pedidos forem",
                  "const right = `",
                  "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                  "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id), placed_at TEXT NOT NULL);",
                  "`;",
                  "db.exec(right);",
                  "",
                  "db.prepare(\"SELECT id, placed_at FROM orders WHERE customer_id = ?\").all(1);   // todos os pedidos do cliente 1",
                ].join("\n"),
              },
              explanation:
                "A pergunta que resolve é \"de quantos pais um filho pode ser?\". Se a resposta é um, a referência mora no " +
                "filho: um pedido tem um só cliente, e por isso é o pedido que guarda `customer_id`.",
            },
            {
              title: "Quando a ligação tem dados próprios",
              context: "A matrícula não é só um par aluno–disciplina: ela tem semestre e nota.",
              code: {
                language: "javascript",
                filename: "enrollments.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                  "  CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL);",
                  "",
                  "  -- A tabela de junção virou uma entidade do negócio: a matrícula",
                  "  CREATE TABLE enrollments (",
                  "    student_id INTEGER NOT NULL REFERENCES students(id),",
                  "    course_id INTEGER NOT NULL REFERENCES courses(id),",
                  "    term TEXT NOT NULL,                              -- ex.: \"2026.2\"",
                  "    grade REAL CHECK (grade BETWEEN 0 AND 10),       -- vazia até o fim do semestre",
                  "    PRIMARY KEY (student_id, course_id, term)        -- pode refazer a disciplina em outro semestre",
                  "  );",
                  "`);",
                  "",
                  "db.prepare(`",
                  "  SELECT s.name, e.term, e.grade",
                  "  FROM enrollments e JOIN students s ON s.id = e.student_id",
                  "  WHERE e.course_id = ?",
                  "  ORDER BY e.term, s.name",
                  "`).all(1);",
                ].join("\n"),
              },
              explanation:
                "Os atributos que pertencem à ligação, e não a um dos lados, moram na tabela de junção: a nota é do aluno " +
                "naquela disciplina, naquele semestre. Incluir `term` na chave muda a regra de negócio: o aluno pode " +
                "cursar a mesma disciplina de novo, em outro semestre.",
            },
            {
              title: "Um para um de verdade",
              context: "Sem o `UNIQUE`, a relação que parece 1:1 aceita vários registros por usuário.",
              code: {
                language: "javascript",
                filename: "one-to-one.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE);",
                  "  CREATE TABLE billing_details (",
                  "    id INTEGER PRIMARY KEY,",
                  "    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),   -- UNIQUE: no máximo um por usuário",
                  "    tax_id TEXT NOT NULL",
                  "  );",
                  "`);",
                  "",
                  "db.prepare(\"INSERT INTO users (email) VALUES (?)\").run(\"ana@example.test\");",
                  "const insert = db.prepare(\"INSERT INTO billing_details (user_id, tax_id) VALUES (?, ?)\");",
                  "insert.run(1, \"123.456.789-09\");",
                  "try { insert.run(1, \"987.654.321-00\"); }",
                  "catch (error) { error.message; }   // \"UNIQUE constraint failed: billing_details.user_id\"",
                ].join("\n"),
              },
              explanation:
                "Os dados de cobrança ficam em outra tabela porque são opcionais e sensíveis, e só alguns serviços " +
                "precisam lê-los. O `UNIQUE` na chave estrangeira é o que transforma um 1:N em 1:1; sem ele, o banco " +
                "aceita o segundo registro sem reclamar.",
            },
          ],
          exercise: {
            problem:
              "Uma livraria vai registrar livros e autores. Um livro pode ter vários autores, em uma ordem definida " +
              "(primeiro autor, segundo autor), e um autor escreve vários livros. Cada livro tem várias edições, e cada " +
              "edição é de um só livro. A primeira versão do esquema guarda os autores nas colunas `author1`, `author2` " +
              "e `author3`.",
            problemCode: {
              language: "javascript",
              filename: "books.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE books (",
                "    id INTEGER PRIMARY KEY,",
                "    title TEXT NOT NULL,",
                "    author1 TEXT,",
                "    author2 TEXT,",
                "    author3 TEXT,",
                "    edition_year INTEGER   -- e a 2ª edição? outra linha com o mesmo título?",
                "  );",
                "`);",
              ].join("\n"),
            },
            task:
              "Identifique a cardinalidade de cada relação (livro–autor e livro–edição) e reescreva o esquema, " +
              "guardando a ordem de autoria e sem limite de autores ou de edições. Escreva a consulta que lista os " +
              "autores de um livro na ordem certa.",
            hint:
              "Livro–autor é N:M, e a ordem de autoria é um dado da ligação: vai para a tabela de junção. Livro–edição " +
              "é 1:N: a chave estrangeira fica na edição.",
            solution: {
              code: {
                language: "javascript",
                filename: "books.fixed.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "const db = new DatabaseSync(\":memory:\");",
                  "db.exec(\"PRAGMA foreign_keys = ON\");",
                  "",
                  "db.exec(`",
                  "  CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL);",
                  "  CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                  "",
                  "  -- N:M, com a ordem de autoria na ligação",
                  "  CREATE TABLE book_authors (",
                  "    book_id INTEGER NOT NULL REFERENCES books(id),",
                  "    author_id INTEGER NOT NULL REFERENCES authors(id),",
                  "    position INTEGER NOT NULL CHECK (position >= 1),",
                  "    PRIMARY KEY (book_id, author_id),",
                  "    UNIQUE (book_id, position)            -- não há dois \"primeiros autores\"",
                  "  );",
                  "",
                  "  -- 1:N: a edição aponta para o livro",
                  "  CREATE TABLE editions (",
                  "    id INTEGER PRIMARY KEY,",
                  "    book_id INTEGER NOT NULL REFERENCES books(id),",
                  "    number INTEGER NOT NULL,",
                  "    year INTEGER NOT NULL,",
                  "    UNIQUE (book_id, number)",
                  "  );",
                  "`);",
                  "",
                  "db.exec(`",
                  "  INSERT INTO books (id, title) VALUES (1, 'Bancos de Dados na Prática');",
                  "  INSERT INTO authors (id, name) VALUES (1, 'Bruno Lima'), (2, 'Ana Souza');",
                  "  INSERT INTO book_authors (book_id, author_id, position) VALUES (1, 2, 1), (1, 1, 2);",
                  "  INSERT INTO editions (book_id, number, year) VALUES (1, 1, 2019), (1, 2, 2024);",
                  "`);",
                  "",
                  "db.prepare(`",
                  "  SELECT a.name",
                  "  FROM book_authors ba JOIN authors a ON a.id = ba.author_id",
                  "  WHERE ba.book_id = ?",
                  "  ORDER BY ba.position",
                  "`).all(1);   // [{ name: \"Ana Souza\" }, { name: \"Bruno Lima\" }]",
                ].join("\n"),
              },
              explanation:
                "As colunas `author1` a `author3` limitavam o número de autores e obrigavam a olhar três colunas para " +
                "responder \"quais livros este autor escreveu?\". Com a tabela de junção, a relação não tem limite, e a " +
                "ordem é um dado da ligação, protegido por um `UNIQUE`. As edições ganharam a sua tabela e deixaram de " +
                "repetir o título do livro.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Normalization",
          requires: ["Relationship Cardinality (1:1 / 1:N / N:M)"],
          note: "anomalias de inserção/atualização/remoção",
          summary:
            "O processo de organizar as tabelas para que cada fato seja guardado em um só lugar — separando o que " +
            "depende de coisas diferentes —, e assim evitar as anomalias de inserção, de atualização e de remoção.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Normalizar é reorganizar as tabelas até que cada fato fique registrado uma única vez. A ferramenta de " +
                "análise é a dependência funcional: dizer que o professor depende da disciplina (`course_id → professor`) " +
                "significa que, conhecida a disciplina, o professor está determinado. Quando uma tabela guarda fatos que " +
                "dependem de coisas diferentes, ela os repete, e a normalização a divide em tabelas em que cada coluna " +
                "depende só da chave. As formas normais (1NF, 2NF, 3NF) são as regras que tornam esse processo " +
                "sistemático.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada fato em um só lugar: se a mesma informação aparece em várias linhas, uma mudança precisa acertar " +
                "todas, e o banco não tem como garantir que isso aconteça.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text: "Uma tabela que mistura assuntos sofre de três anomalias:",
            },
            {
              type: "list",
              items: [
                "Anomalia de atualização: o mesmo dado repetido em várias linhas precisa mudar em todas; se uma escapa, o banco passa a ter duas versões da verdade.",
                "Anomalia de inserção: não é possível registrar um fato sem outro, como cadastrar uma disciplina que ainda não tem alunos.",
                "Anomalia de remoção: apagar uma linha apaga junto um fato que só existia nela, como o professor de uma disciplina cujo único aluno saiu.",
              ],
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "normalization.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "// Antes: uma tabela, três assuntos (aluno, disciplina e matrícula)",
                "// enrollments(student_id, student_name, course_id, course_title, professor, grade)",
                "//   (1, \"Ana\",   10, \"Bancos de Dados\", \"Prof. Lima\", 9.0)",
                "//   (2, \"Bruno\", 10, \"Bancos de Dados\", \"Prof. Lima\", 7.5)",
                "// → trocar o professor exige alterar as duas linhas; uma disciplina sem alunos não tem onde existir",
                "",
                "// Depois: cada fato em um só lugar",
                "db.exec(`",
                "  CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                "  CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL, professor TEXT NOT NULL);",
                "  CREATE TABLE enrollments (",
                "    student_id INTEGER NOT NULL REFERENCES students(id),",
                "    course_id INTEGER NOT NULL REFERENCES courses(id),",
                "    grade REAL,",
                "    PRIMARY KEY (student_id, course_id)",
                "  );",
                "`);",
                "",
                "// Trocar o professor passa a ser uma alteração em uma linha",
                "db.prepare(\"UPDATE courses SET professor = ? WHERE id = ?\").run(\"Prof. Rocha\", 10);",
                "",
                "// A visão \"achatada\" continua disponível — por consulta, e não por cópia",
                "db.prepare(`",
                "  SELECT s.name, c.title, c.professor, e.grade",
                "  FROM enrollments e",
                "  JOIN students s ON s.id = e.student_id",
                "  JOIN courses c ON c.id = e.course_id",
                "`).all();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A normalização não perde informação: o `JOIN` reconstrói a tabela original a qualquer momento. O que " +
                "muda é que cada fato tem um só dono, e a consistência deixa de depender do cuidado de quem escreve.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Normalizar demais, separando em tabelas o que não se repete nem muda, como as partes de um nome, só acrescenta `JOIN`s, sem evitar anomalia nenhuma.",
                "Nem toda repetição é redundância: o preço cobrado em um pedido antigo é um fato histórico, e não uma cópia do preço atual do produto.",
                "Textos iguais não são, por si, o mesmo fato: o que indica redundância é a dependência, e não a coincidência de valores, como dois clientes com o mesmo sobrenome.",
                "A normalização é o ponto de partida para dados que são escritos; desfazê-la de propósito, para acelerar leituras, é a denormalização, com os custos dela.",
              ],
            },
          ],
          examples: [
            {
              title: "As três anomalias, uma de cada vez",
              context: "A tabela única de matrículas falha de três jeitos diferentes.",
              code: {
                language: "javascript",
                filename: "anomalies.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE enrollments_flat (",
                  "    student_id INTEGER, student_name TEXT,",
                  "    course_id INTEGER, course_title TEXT, professor TEXT,",
                  "    grade REAL",
                  "  );",
                  "  INSERT INTO enrollments_flat VALUES",
                  "    (1, 'Ana',   10, 'Bancos de Dados', 'Prof. Lima', 9.0),",
                  "    (2, 'Bruno', 10, 'Bancos de Dados', 'Prof. Lima', 7.5),",
                  "    (2, 'Bruno', 20, 'Redes',           'Prof. Reis', 8.0);",
                  "`);",
                  "",
                  "// Atualização: um UPDATE que esquece uma linha deixa dois professores na mesma disciplina",
                  "db.exec(\"UPDATE enrollments_flat SET professor = 'Prof. Rocha' WHERE course_id = 10 AND student_id = 1\");",
                  "db.prepare(\"SELECT DISTINCT professor FROM enrollments_flat WHERE course_id = 10\").all();",
                  "// [{ professor: \"Prof. Rocha\" }, { professor: \"Prof. Lima\" }]",
                  "",
                  "// Inserção: uma disciplina nova, sem alunos, só entra com student_id nulo (uma linha \"fantasma\")",
                  "",
                  "// Remoção: se Bruno trancar Redes, apagar a linha dele apaga também quem era o professor de Redes",
                  "db.exec(\"DELETE FROM enrollments_flat WHERE student_id = 2 AND course_id = 20\");",
                  "db.prepare(\"SELECT professor FROM enrollments_flat WHERE course_id = 20\").all();   // [] — o fato sumiu",
                ].join("\n"),
              },
              explanation:
                "As três falhas têm a mesma causa: fatos sobre a disciplina (título e professor) moram na linha da " +
                "matrícula. Com a disciplina em uma tabela própria, o professor muda em um só lugar, e a disciplina " +
                "existe antes do primeiro aluno e depois da saída do último.",
            },
            {
              title: "Dependência funcional: o que determina o quê",
              context: "Escrever as dependências mostra onde cada coluna deveria morar.",
              code: {
                language: "text",
                filename: "dependencies.txt",
                code: [
                  "Tabela: shipments(tracking_code, recipient_name, weight_grams, postal_code, city, state)",
                  "Chave:  tracking_code",
                  "",
                  "Dependências:",
                  "  tracking_code → recipient_name, weight_grams, postal_code",
                  "  postal_code   → city, state          (o CEP determina a cidade e o estado)",
                  "",
                  "city e state não dependem da remessa, e sim do CEP: repetem-se em cada remessa para o mesmo CEP.",
                  "",
                  "Decomposição:",
                  "  shipments(tracking_code, recipient_name, weight_grams, postal_code)",
                  "  postal_codes(postal_code, city, state)",
                ].join("\n"),
              },
              explanation:
                "A pergunta \"conhecido X, Y fica determinado?\" é a mesma que as formas normais formalizam. Cada grupo de " +
                "colunas que depende do mesmo determinante vira uma tabela, com o determinante como chave, e a tabela " +
                "original guarda só a referência.",
            },
            {
              title: "Normalizar não é criar uma tabela para cada coluna",
              context: "Separar o que não se repete nem muda só custa `JOIN`s.",
              code: {
                language: "javascript",
                filename: "over-normalized.js",
                code: [
                  "// Excesso: o nome do cliente em outra tabela, sem nenhum ganho",
                  "const overNormalized = `",
                  "  CREATE TABLE customer_names (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT);",
                  "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name_id INTEGER REFERENCES customer_names(id), email TEXT);",
                  "`;",
                  "// Cada nome pertence a um só cliente: não há repetição, e portanto não há anomalia a evitar.",
                  "",
                  "// Suficiente: o nome é um atributo do cliente",
                  "const enough = `",
                  "  CREATE TABLE customers (",
                  "    id INTEGER PRIMARY KEY,",
                  "    first_name TEXT NOT NULL,",
                  "    last_name TEXT NOT NULL,",
                  "    email TEXT NOT NULL UNIQUE",
                  "  );",
                  "`;",
                  "db.exec(enough);",
                ].join("\n"),
              },
              explanation:
                "A normalização remove fatos repetidos, e não colunas. Uma tabela 1:1 obrigatória, sem dados opcionais " +
                "nem regras de acesso diferentes, costuma ser só uma entidade partida ao meio.",
            },
          ],
          exercise: {
            problem:
              "Uma clínica importou para o banco a planilha de consultas: cada linha tem os dados do paciente, do " +
              "médico e da especialidade. A recepção reclama que o telefone de um mesmo paciente aparece diferente em " +
              "consultas diferentes.",
            problemCode: {
              language: "javascript",
              filename: "appointments.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE appointments (",
                "    id INTEGER PRIMARY KEY,",
                "    scheduled_at TEXT NOT NULL,",
                "    patient_cpf TEXT NOT NULL,",
                "    patient_name TEXT NOT NULL,",
                "    patient_phone TEXT NOT NULL,",
                "    doctor_crm TEXT NOT NULL,",
                "    doctor_name TEXT NOT NULL,",
                "    doctor_specialty TEXT NOT NULL",
                "  );",
                "`);",
              ].join("\n"),
            },
            task:
              "Liste as dependências funcionais, normalize o esquema e escreva a consulta que devolve a agenda de um " +
              "dia com o nome e o telefone do paciente e o nome do médico. Mostre que atualizar o telefone passa a ser " +
              "uma única alteração.",
            hint:
              "O CPF determina o nome e o telefone do paciente; o CRM determina o nome e a especialidade do médico. A " +
              "consulta fica só com o que é dela: o horário e as duas referências.",
            solution: {
              code: {
                language: "javascript",
                filename: "appointments.fixed.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "const db = new DatabaseSync(\":memory:\");",
                  "",
                  "// patient_cpf → patient_name, patient_phone",
                  "// doctor_crm  → doctor_name, doctor_specialty",
                  "db.exec(`",
                  "  CREATE TABLE patients (",
                  "    id INTEGER PRIMARY KEY,",
                  "    cpf TEXT NOT NULL UNIQUE,",
                  "    name TEXT NOT NULL,",
                  "    phone TEXT NOT NULL",
                  "  );",
                  "  CREATE TABLE doctors (",
                  "    id INTEGER PRIMARY KEY,",
                  "    crm TEXT NOT NULL UNIQUE,",
                  "    name TEXT NOT NULL,",
                  "    specialty TEXT NOT NULL",
                  "  );",
                  "  CREATE TABLE appointments (",
                  "    id INTEGER PRIMARY KEY,",
                  "    scheduled_at TEXT NOT NULL,",
                  "    patient_id INTEGER NOT NULL REFERENCES patients(id),",
                  "    doctor_id INTEGER NOT NULL REFERENCES doctors(id)",
                  "  );",
                  "`);",
                  "",
                  "// O telefone mora em um só lugar",
                  "db.prepare(\"UPDATE patients SET phone = ? WHERE cpf = ?\").run(\"(11) 98888-0000\", \"123.456.789-09\");",
                  "",
                  "// A agenda do dia, reconstruída por JOIN",
                  "db.prepare(`",
                  "  SELECT a.scheduled_at, p.name AS patient, p.phone, d.name AS doctor",
                  "  FROM appointments a",
                  "  JOIN patients p ON p.id = a.patient_id",
                  "  JOIN doctors d ON d.id = a.doctor_id",
                  "  WHERE date(a.scheduled_at) = ?",
                  "  ORDER BY a.scheduled_at",
                  "`).all(\"2026-10-01\");",
                ].join("\n"),
              },
              explanation:
                "O telefone divergia porque era copiado em cada consulta. Agora ele é um fato do paciente, guardado uma " +
                "vez, e toda consulta o enxerga pelo `JOIN`. CPF e CRM ganharam `UNIQUE`, e as chaves primárias servem de " +
                "referência. A especialidade poderia ir para uma tabela própria se precisasse de dados além do nome.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Normal Forms (1NF / 2NF / 3NF)",
          requires: ["Normalization"],
          subtopics: ["1NF: valores atômicos", "2NF: sem dependência parcial da PK", "3NF: sem dependência transitiva", "BCNF (menção)"],
          note: "consolidada (A5)",
          summary:
            "As regras que tornam a normalização verificável: valores atômicos (1NF), nenhuma coluna dependendo de só " +
            "uma parte da chave (2NF) e nenhuma coluna dependendo de outra coluna que não é chave (3NF).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "As formas normais são critérios cumulativos: uma tabela na 3NF também está na 2NF e na 1NF. Cada forma " +
                "elimina um tipo de dependência que causa repetição. Na prática, chegar à terceira forma normal resolve a " +
                "grande maioria dos problemas de um esquema transacional; as formas seguintes, como a BCNF, tratam de " +
                "casos mais raros.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Toda coluna deve depender da chave, da chave inteira e de nada além da chave: essa frase resume a 1NF, a " +
                "2NF e a 3NF.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "1NF — cada coluna guarda um único valor (atômico), sem listas nem grupos repetidos (`phone1`, `phone2`, `phone3`), e cada linha é identificável por uma chave.",
                "2NF — está na 1NF, e nenhuma coluna depende de só uma parte de uma chave composta; só se aplica a tabelas cuja chave tem mais de uma coluna.",
                "3NF — está na 2NF, e nenhuma coluna que não é chave depende de outra coluna que não é chave (a dependência transitiva `id → cep → cidade`).",
                "BCNF — uma versão mais estrita da 3NF: todo determinante precisa ser uma chave candidata; a diferença aparece em tabelas com várias chaves candidatas que se sobrepõem.",
              ],
            },
            {
              type: "code",
              language: "text",
              filename: "normal-forms.txt",
              code: [
                "Tabela: order_items(order_id, product_id, product_name, customer_id, customer_email, unit_price_cents, quantity)",
                "Chave:  (order_id, product_id)",
                "",
                "1NF ✓  valores atômicos, linhas identificáveis pela chave",
                "2NF ✗  product_name    depende só de product_id   (parte da chave)",
                "       customer_id     depende só de order_id     (parte da chave)",
                "3NF ✗  customer_email  depende de customer_id     (que não é chave)",
                "",
                "Decomposição (3NF):",
                "  order_items(order_id, product_id, unit_price_cents, quantity)",
                "  products(product_id, product_name)",
                "  orders(order_id, customer_id)",
                "  customers(customer_id, customer_email)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Quantidade e preço cobrado dependem do par (pedido, produto), e ficam no item. Cada uma das outras " +
                "colunas foi para a tabela da coisa de que ela realmente depende.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Ao desenhar as tabelas de um sistema transacional, em que os dados são escritos com frequência e a consistência importa: a 3NF é o ponto de partida padrão.",
                "Para revisar um esquema existente: percorrer as colunas perguntando \"depende da chave, da chave inteira e só da chave?\" aponta as tabelas com anomalias.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Bases analíticas (data warehouses) usam de propósito esquemas denormalizados, como o esquema estrela, porque são carregadas em lote e lidas em grandes consultas.",
                "O que é atômico depende do uso: um endereço em uma só coluna de texto é aceitável até alguém precisar filtrar pela cidade.",
                "As formas normais verificam dependências, e não se o modelo representa bem o negócio: uma tabela pode estar na 3NF e ainda assim modelar o conceito errado.",
              ],
            },
          ],
          examples: [
            {
              title: "1NF: o grupo repetido",
              context: "Colunas numeradas são uma lista com tamanho fixo.",
              code: {
                language: "javascript",
                filename: "first-normal-form.js",
                code: [
                  "// Fora da 1NF: um grupo repetido de colunas",
                  "const before = \"CREATE TABLE contacts (id INTEGER PRIMARY KEY, name TEXT, phone1 TEXT, phone2 TEXT, phone3 TEXT)\";",
                  "// Quem tem o telefone X? WHERE phone1 = ? OR phone2 = ? OR phone3 = ? — e o quarto telefone não cabe",
                  "",
                  "// Na 1NF: um telefone por linha, em uma tabela filha",
                  "db.exec(`",
                  "  CREATE TABLE contacts (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                  "  CREATE TABLE contact_phones (",
                  "    contact_id INTEGER NOT NULL REFERENCES contacts(id),",
                  "    phone TEXT NOT NULL,",
                  "    kind TEXT NOT NULL CHECK (kind IN ('mobile', 'home', 'work')),",
                  "    PRIMARY KEY (contact_id, phone)",
                  "  );",
                  "`);",
                  "",
                  "db.prepare(`",
                  "  SELECT c.name FROM contact_phones p JOIN contacts c ON c.id = p.contact_id WHERE p.phone = ?",
                  "`).all(\"(11) 99999-0000\");",
                ].join("\n"),
              },
              explanation:
                "As colunas numeradas são a mesma lista separada por vírgulas, só que com um limite fixo. Na tabela " +
                "filha, cada telefone é uma linha, que pode ter um tipo, ser indexada e ser buscada com uma condição só.",
            },
            {
              title: "2NF: a dependência parcial",
              context: "Em uma chave composta, uma coluna que depende de só uma parte dela se repete.",
              code: {
                language: "javascript",
                filename: "second-normal-form.js",
                code: [
                  "// Chave: (employee_id, project_id)",
                  "// hours depende da chave inteira; employee_name, só de employee_id; project_deadline, só de project_id",
                  "const before = `",
                  "  CREATE TABLE assignments (",
                  "    employee_id INTEGER, project_id INTEGER,",
                  "    employee_name TEXT, project_deadline TEXT,",
                  "    hours INTEGER,",
                  "    PRIMARY KEY (employee_id, project_id)",
                  "  )`;",
                  "",
                  "// Na 2NF: o que depende de uma parte da chave vai para a tabela daquela parte",
                  "db.exec(`",
                  "  CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                  "  CREATE TABLE projects (id INTEGER PRIMARY KEY, deadline TEXT NOT NULL);",
                  "  CREATE TABLE assignments (",
                  "    employee_id INTEGER NOT NULL REFERENCES employees(id),",
                  "    project_id INTEGER NOT NULL REFERENCES projects(id),",
                  "    hours INTEGER NOT NULL,",
                  "    PRIMARY KEY (employee_id, project_id)",
                  "  );",
                  "`);",
                ].join("\n"),
              },
              explanation:
                "Na versão antiga, adiar um projeto exigia alterar uma linha por pessoa alocada nele. Uma tabela cuja " +
                "chave tem uma coluna só está automaticamente na 2NF: a dependência parcial só existe em chaves " +
                "compostas.",
            },
            {
              title: "3NF: a dependência transitiva",
              context: "Uma coluna que descreve outra coluna, e não a linha, está no lugar errado.",
              code: {
                language: "javascript",
                filename: "third-normal-form.js",
                code: [
                  "// Fora da 3NF: department_name e floor dependem de department_id, e não do funcionário",
                  "const before = \"CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, department_name TEXT, floor INTEGER)\";",
                  "//   id → department_id → (department_name, floor): uma dependência transitiva",
                  "",
                  "db.exec(`",
                  "  CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT NOT NULL, floor INTEGER NOT NULL);",
                  "  CREATE TABLE employees (",
                  "    id INTEGER PRIMARY KEY,",
                  "    name TEXT NOT NULL,",
                  "    department_id INTEGER NOT NULL REFERENCES departments(id)",
                  "  );",
                  "`);",
                ].join("\n"),
              },
              explanation:
                "Mudar o departamento de andar exigia alterar todos os seus funcionários, e um departamento recém-criado, " +
                "ainda sem ninguém, não tinha onde ser registrado. Uma pista frequente da violação da 3NF é um grupo de " +
                "colunas com o mesmo prefixo, como `department_*`, que descreve outra coisa.",
            },
          ],
          exercise: {
            problem:
              "Uma companhia aérea guarda as passagens em uma tabela só, com a chave formada pelo voo e pelo assento (o " +
              "código do voo identifica um voo em uma data). Quando um voo muda de horário, é preciso alterar dezenas " +
              "de linhas, e o modelo da aeronave aparece diferente em passagens do mesmo voo.",
            problemCode: {
              language: "javascript",
              filename: "tickets.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE tickets (",
                "    flight_code TEXT NOT NULL,",
                "    seat TEXT NOT NULL,",
                "    passenger_name TEXT NOT NULL,",
                "    departure_at TEXT NOT NULL,",
                "    aircraft_id TEXT NOT NULL,",
                "    aircraft_model TEXT NOT NULL,",
                "    PRIMARY KEY (flight_code, seat)",
                "  );",
                "`);",
              ].join("\n"),
            },
            task:
              "Classifique cada coluna: depende da chave inteira, de uma parte dela ou de outra coluna que não é chave? " +
              "Diga qual forma normal cada caso viola e decomponha o esquema até a 3NF.",
            hint:
              "`passenger_name` depende do par (voo, assento). `departure_at` e `aircraft_id` dependem só do voo (2NF). " +
              "`aircraft_model` depende da aeronave, que depende do voo (3NF).",
            solution: {
              code: {
                language: "javascript",
                filename: "tickets.fixed.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "const db = new DatabaseSync(\":memory:\");",
                  "",
                  "// passenger_name  ← (flight_code, seat)   ✓ depende da chave inteira",
                  "// departure_at    ← flight_code           ✗ 2NF: depende de uma parte da chave",
                  "// aircraft_id     ← flight_code           ✗ 2NF: depende de uma parte da chave",
                  "// aircraft_model  ← aircraft_id           ✗ 3NF: depende de uma coluna que não é chave",
                  "",
                  "db.exec(`",
                  "  CREATE TABLE aircraft (",
                  "    id TEXT PRIMARY KEY,",
                  "    model TEXT NOT NULL",
                  "  );",
                  "  CREATE TABLE flights (",
                  "    code TEXT PRIMARY KEY,",
                  "    departure_at TEXT NOT NULL,",
                  "    aircraft_id TEXT NOT NULL REFERENCES aircraft(id)",
                  "  );",
                  "  CREATE TABLE tickets (",
                  "    flight_code TEXT NOT NULL REFERENCES flights(code),",
                  "    seat TEXT NOT NULL,",
                  "    passenger_name TEXT NOT NULL,",
                  "    PRIMARY KEY (flight_code, seat)",
                  "  );",
                  "`);",
                  "",
                  "// Mudar o horário de um voo: uma linha, qualquer que seja o número de passagens",
                  "db.prepare(\"UPDATE flights SET departure_at = ? WHERE code = ?\").run(\"2026-10-01 09:30\", \"DV1234-20261001\");",
                ].join("\n"),
              },
              explanation:
                "Cada fato agora tem um dono: o passageiro é da passagem, o horário e a aeronave são do voo, e o modelo é " +
                "da aeronave. Remarcar um voo vira a alteração de uma linha, e o modelo da aeronave não tem mais como " +
                "divergir entre passagens.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Denormalization",
          requires: ["Normal Forms (1NF / 2NF / 3NF)"],
          note: "trade-off leitura × escrita/consistência — mesma tensão de Caching",
          revisit: ["Platform / Caching"],
          summary:
            "Repetir de propósito um dado que poderia ser calculado ou buscado por `JOIN`, para tornar certas " +
            "leituras mais rápidas, assumindo o custo de manter as cópias consistentes a cada escrita.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Denormalizar é guardar de propósito, em mais de um lugar, um dado que o modelo normalizado guardaria uma " +
                "vez só: o número de comentários em cada post, o nome do autor ao lado do título, o total de um pedido. A " +
                "leitura fica mais barata, sem `JOIN` nem agregação, e a escrita fica mais cara, porque cada mudança " +
                "precisa atualizar também as cópias. É a mesma troca de um cache: ganhar velocidade na leitura em troca " +
                "de ter de manter uma cópia em dia.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Denormalização é uma otimização, e não um ponto de partida: comece normalizado, meça, e só repita um " +
                "dado quando uma leitura importante precisar, com um plano para manter a cópia correta.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text: "A cópia precisa ser mantida por alguém. As formas mais comuns, da mais segura para a menos:",
            },
            {
              type: "list",
              items: [
                "Na mesma transação que altera o dado original: a cópia nunca fica diferente, e a escrita fica um pouco mais lenta.",
                "Por um gatilho (trigger) do banco, que atualiza a cópia a cada alteração, inclusive as feitas fora da aplicação.",
                "Por uma visão materializada, que guarda o resultado de uma consulta e é recalculada quando alguém a atualiza.",
                "De forma assíncrona, por um processo que recalcula depois (uma fila, uma tarefa agendada): a escrita fica rápida, e a cópia fica defasada por um tempo.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "denormalization.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE posts (",
                "    id INTEGER PRIMARY KEY,",
                "    title TEXT NOT NULL,",
                "    comment_count INTEGER NOT NULL DEFAULT 0   -- cópia: poderia ser um COUNT(*) em comments",
                "  );",
                "  CREATE TABLE comments (",
                "    id INTEGER PRIMARY KEY,",
                "    post_id INTEGER NOT NULL REFERENCES posts(id),",
                "    body TEXT NOT NULL",
                "  );",
                "`);",
                "",
                "function addComment(postId, body) {",
                "  db.exec(\"BEGIN\");",
                "  try {",
                "    db.prepare(\"INSERT INTO comments (post_id, body) VALUES (?, ?)\").run(postId, body);",
                "    db.prepare(\"UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?\").run(postId);",
                "    db.exec(\"COMMIT\");",
                "  } catch (error) {",
                "    db.exec(\"ROLLBACK\");",
                "    throw error;",
                "  }",
                "}",
                "",
                "// A listagem lê a contagem pronta, sem JOIN nem GROUP BY",
                "db.prepare(\"SELECT id, title, comment_count FROM posts ORDER BY id DESC LIMIT 20\").all();",
              ].join("\n"),
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando uma leitura frequente e importante, como uma listagem ou um painel, fica lenta por causa de `JOIN`s ou agregações, e a medição confirma isso.",
                "Quando o dado copiado muda pouco e é lido muito, como contadores, totais ou o nome de uma categoria.",
                "Em modelos feitos só para leitura (relatórios, busca, um data warehouse), alimentados a partir do modelo normalizado.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Antes de medir: um índice adequado ou uma consulta melhor costumam resolver a lentidão sem criar cópias.",
                "Toda cópia pode divergir do original: se algum caminho de escrita esquecer de atualizá-la, o banco não avisa, e é preciso uma rotina para conferir e corrigir.",
                "Em dados que mudam muito, a denormalização multiplica as escritas e a disputa por bloqueios, e pode deixar o sistema mais lento no total.",
              ],
            },
          ],
          examples: [
            {
              title: "Nem toda cópia é denormalização",
              context: "O preço guardado no item do pedido não é uma cópia do preço do produto: é outro fato.",
              code: {
                language: "javascript",
                filename: "price-snapshot.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price_cents INTEGER NOT NULL);",
                  "  CREATE TABLE order_items (",
                  "    order_id INTEGER NOT NULL,",
                  "    product_id INTEGER NOT NULL REFERENCES products(id),",
                  "    quantity INTEGER NOT NULL,",
                  "    unit_price_cents INTEGER NOT NULL,   -- quanto se cobrou, no dia da compra",
                  "    PRIMARY KEY (order_id, product_id)",
                  "  );",
                  "  INSERT INTO products VALUES (1, 'Caneca', 3500);",
                  "  INSERT INTO order_items VALUES (100, 1, 2, 3500);",
                  "`);",
                  "",
                  "db.exec(\"UPDATE products SET price_cents = 4200 WHERE id = 1\");   // o preço subiu",
                  "",
                  "// O pedido antigo continua valendo o que foi cobrado — e é assim que deve ser",
                  "db.prepare(\"SELECT quantity * unit_price_cents AS total_cents FROM order_items WHERE order_id = 100\").get();",
                  "// { total_cents: 7000 }",
                ].join("\n"),
              },
              explanation:
                "Se o item só referenciasse o produto, o valor de um pedido antigo mudaria a cada reajuste. O " +
                "`unit_price_cents` depende do item do pedido, e não do produto, e por isso não é redundância. A pergunta " +
                "que separa os casos: se o original mudar, a cópia deveria mudar junto? Se não, é outro fato.",
            },
            {
              title: "Conferir se a cópia divergiu",
              context: "Uma consulta de reconciliação compara a cópia com o valor calculado da fonte.",
              code: {
                language: "javascript",
                filename: "reconcile.js",
                code: [
                  "// Algum caminho (um script, uma exclusão em cascata) mexeu em comments sem atualizar a contagem?",
                  "const drifted = db.prepare(`",
                  "  SELECT p.id, p.comment_count, COUNT(c.id) AS actual",
                  "  FROM posts p LEFT JOIN comments c ON c.post_id = p.id",
                  "  GROUP BY p.id",
                  "  HAVING p.comment_count <> COUNT(c.id)",
                  "`).all();",
                  "",
                  "// Corrigir a partir da fonte da verdade, que é a tabela normalizada",
                  "db.exec(`",
                  "  UPDATE posts",
                  "  SET comment_count = (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id)",
                  "`);",
                ].join("\n"),
              },
              explanation:
                "A tabela normalizada continua sendo a fonte da verdade, e a cópia pode ser recalculada a partir dela a " +
                "qualquer momento. Rodar a reconciliação de tempos em tempos transforma uma divergência silenciosa em um " +
                "alerta.",
            },
            {
              title: "Manter a cópia com um gatilho",
              context: "O banco atualiza a contagem sozinho, qualquer que seja o caminho da escrita.",
              code: {
                language: "javascript",
                filename: "triggers.js",
                code: [
                  "db.exec(`",
                  "  CREATE TRIGGER comments_count_insert AFTER INSERT ON comments",
                  "  BEGIN",
                  "    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;",
                  "  END;",
                  "",
                  "  CREATE TRIGGER comments_count_delete AFTER DELETE ON comments",
                  "  BEGIN",
                  "    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;",
                  "  END;",
                  "`);",
                  "",
                  "db.prepare(\"INSERT INTO posts (id, title) VALUES (?, ?)\").run(1, \"Normalizar ou não?\");",
                  "db.prepare(\"INSERT INTO comments (post_id, body) VALUES (?, ?)\").run(1, \"Ótimo texto\");",
                  "db.prepare(\"SELECT comment_count FROM posts WHERE id = 1\").get();   // { comment_count: 1 }",
                ].join("\n"),
              },
              explanation:
                "O gatilho cobre também os scripts e as ferramentas que não passam pela aplicação. Em troca, a regra fica " +
                "escondida no banco, e quem lê só o código não sabe que ela existe; e mover um comentário de post com um " +
                "`UPDATE` pediria um terceiro gatilho.",
            },
          ],
          exercise: {
            problem:
              "A página inicial lista os 20 produtos mais recentes com a nota média das avaliações. Com milhões de " +
              "avaliações, a consulta com `JOIN` e `AVG` ficou lenta, e a medição mostra que ela é o gargalo da página.",
            problemCode: {
              language: "javascript",
              filename: "ratings.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL);",
                "  CREATE TABLE reviews (",
                "    id INTEGER PRIMARY KEY,",
                "    product_id INTEGER NOT NULL REFERENCES products(id),",
                "    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)",
                "  );",
                "`);",
                "",
                "const listing = db.prepare(`",
                "  SELECT p.id, p.name, AVG(r.rating) AS average_rating",
                "  FROM products p LEFT JOIN reviews r ON r.product_id = p.id",
                "  GROUP BY p.id",
                "  ORDER BY p.created_at DESC",
                "  LIMIT 20",
                "`);",
                "",
                "function addReview(productId, rating) {",
                "  db.prepare(\"INSERT INTO reviews (product_id, rating) VALUES (?, ?)\").run(productId, rating);",
                "}",
              ].join("\n"),
            },
            task:
              "Denormalize a nota média: guarde em `products` o que for preciso para devolvê-la sem ler `reviews`, " +
              "mantenha a cópia na mesma transação da avaliação e escreva a consulta de reconciliação.",
            hint:
              "Uma média pronta não tem como incorporar a próxima nota. Guarde a soma e a quantidade, e calcule a média " +
              "na leitura.",
            solution: {
              code: {
                language: "javascript",
                filename: "ratings.fixed.js",
                code: [
                  "db.exec(`",
                  "  ALTER TABLE products ADD COLUMN rating_sum INTEGER NOT NULL DEFAULT 0;",
                  "  ALTER TABLE products ADD COLUMN rating_count INTEGER NOT NULL DEFAULT 0;",
                  "`);",
                  "",
                  "function addReview(productId, rating) {",
                  "  db.exec(\"BEGIN\");",
                  "  try {",
                  "    db.prepare(\"INSERT INTO reviews (product_id, rating) VALUES (?, ?)\").run(productId, rating);",
                  "    db.prepare(\"UPDATE products SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?\")",
                  "      .run(rating, productId);",
                  "    db.exec(\"COMMIT\");",
                  "  } catch (error) {",
                  "    db.exec(\"ROLLBACK\");",
                  "    throw error;",
                  "  }",
                  "}",
                  "",
                  "// A listagem não toca em reviews",
                  "const listing = db.prepare(`",
                  "  SELECT id, name,",
                  "         CASE WHEN rating_count = 0 THEN NULL ELSE 1.0 * rating_sum / rating_count END AS average_rating",
                  "  FROM products",
                  "  ORDER BY created_at DESC",
                  "  LIMIT 20",
                  "`);",
                  "",
                  "// Reconciliação: produtos cuja cópia divergiu da fonte da verdade",
                  "const drifted = db.prepare(`",
                  "  SELECT p.id",
                  "  FROM products p LEFT JOIN reviews r ON r.product_id = p.id",
                  "  GROUP BY p.id",
                  "  HAVING p.rating_count <> COUNT(r.id) OR p.rating_sum <> COALESCE(SUM(r.rating), 0)",
                  "`);",
                ].join("\n"),
              },
              explanation:
                "Soma e quantidade podem ser atualizadas a cada avaliação, e a média sai delas na leitura. A transação " +
                "garante que a avaliação e os contadores mudam juntos, e a reconciliação detecta qualquer caminho que " +
                "escreva em `reviews` por fora. Antes de denormalizar, vale conferir o índice em `created_at`: às vezes " +
                "ele sozinho resolve.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Natural vs Surrogate Key",
          requires: ["Database Fundamentals / Primary Key"],
          note: "UUID vs auto-incremento; implicações de índice",
          summary:
            "A escolha da chave primária entre um dado do próprio negócio que já identifica a linha (chave natural, " +
            "como um código ISO) e um identificador sem significado, criado só para isso (chave substituta, como um " +
            "número sequencial ou um UUID).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma chave natural é um dado que o mundo já usa para identificar a coisa: o código de uma moeda (`BRL`), " +
                "a sigla de um estado, o ISBN de um livro. Uma chave substituta (surrogate) é um identificador sem " +
                "significado, gerado pelo sistema: um inteiro que o banco incrementa (auto-incremento ou `IDENTITY`) ou " +
                "um UUID. A escolha importa porque a chave primária é copiada para todas as chaves estrangeiras que " +
                "apontam para a tabela, e o que for escolhido se espalha pelo esquema.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Na maioria das tabelas do negócio, use uma chave substituta como chave primária e proteja a chave " +
                "natural com `UNIQUE`: a primeira dá estabilidade às referências, e a segunda impede duplicatas.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Chave natural: tem significado, já existe fora do sistema e dispensa um `JOIN` para mostrar o código; em troca, pode mudar, pode ser longa e segue regras de fora, como o formato de um documento.",
                "Auto-incremento: pequeno, rápido e crescente, o que é bom para o índice; em troca, só existe depois do `INSERT`, é previsível e colide quando se juntam bancos diferentes.",
                "UUID: pode ser gerado na aplicação antes de gravar e é único entre bancos; em troca, ocupa 16 bytes, e a versão aleatória (v4) espalha as inserções pelo índice. A versão 7, ordenada pelo tempo, reduz esse problema.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "keys.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  -- Tabela de referência com código estável e padronizado: chave natural",
                "  CREATE TABLE currencies (",
                "    code TEXT PRIMARY KEY CHECK (length(code) = 3),   -- ISO 4217: 'BRL', 'USD'",
                "    name TEXT NOT NULL",
                "  );",
                "",
                "  -- Entidade do negócio: chave substituta + chave natural protegida por UNIQUE",
                "  CREATE TABLE customers (",
                "    id INTEGER PRIMARY KEY,               -- substituta: estável, pequena, sem significado",
                "    tax_id TEXT NOT NULL UNIQUE,          -- natural: impede o mesmo cliente duas vezes",
                "    name TEXT NOT NULL,",
                "    currency_code TEXT NOT NULL REFERENCES currencies(code)",
                "  );",
                "`);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em `customers`, `currency_code = 'BRL'` se lê sem consultar outra tabela, e o código da moeda não muda. " +
                "Já o documento do cliente é digitado por pessoas e pode precisar de correção; por isso ele não é a " +
                "referência que as outras tabelas copiam.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Chave natural em tabelas de referência pequenas, com códigos estáveis e padronizados, como moedas, países e idiomas.",
                "Chave substituta nas entidades do negócio (clientes, pedidos, contas), cujos dados identificadores podem mudar ou ser corrigidos.",
                "UUID quando o id precisa existir antes do `INSERT` ou ser único entre bancos e serviços: criação offline, requisições idempotentes, junção de bases.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma chave substituta sozinha não impede duplicatas: sem `UNIQUE` na chave natural, a mesma pessoa pode ser cadastrada várias vezes, com ids diferentes.",
                "Dados que parecem estáveis mudam, como e-mails, nomes de usuário e documentos digitados com erro; como chave primária, cada mudança se propaga a todas as referências.",
                "Ids sequenciais expostos em URLs revelam o volume de registros e permitem enumerá-los; eles não são segredo, e a autorização precisa ser verificada em cada acesso.",
              ],
            },
          ],
          examples: [
            {
              title: "A chave substituta sozinha não impede duplicatas",
              context: "Três importações do mesmo arquivo, três clientes iguais com ids diferentes.",
              code: {
                language: "javascript",
                filename: "duplicates.js",
                code: [
                  "db.exec(\"CREATE TABLE customers (id INTEGER PRIMARY KEY, tax_id TEXT NOT NULL, name TEXT NOT NULL)\");",
                  "",
                  "const insert = db.prepare(\"INSERT INTO customers (tax_id, name) VALUES (?, ?)\");",
                  "for (let run = 0; run < 3; run++) insert.run(\"123.456.789-09\", \"Ana Souza\");",
                  "",
                  "db.prepare(\"SELECT id FROM customers WHERE tax_id = ?\").all(\"123.456.789-09\");",
                  "// [{ id: 1 }, { id: 2 }, { id: 3 }] — o id é único; o cliente, não",
                  "",
                  "// A correção: a chave natural ganha um UNIQUE (depois de resolver as duplicatas existentes)",
                  "// CREATE UNIQUE INDEX customers_tax_id ON customers (tax_id);",
                ].join("\n"),
              },
              explanation:
                "O id garante que cada linha é distinta, e não que cada cliente aparece uma vez. A unicidade do negócio " +
                "precisa ser declarada à parte, sobre a chave natural.",
            },
            {
              title: "O id gerado antes de gravar",
              context: "Com um UUID, quem cria o registro já tem o id e pode repetir o envio sem duplicar.",
              code: {
                language: "javascript",
                filename: "client-generated-id.js",
                code: [
                  "import { randomUUID } from \"node:crypto\";",
                  "",
                  "db.exec(\"CREATE TABLE notes (id TEXT PRIMARY KEY, body TEXT NOT NULL)\");",
                  "",
                  "// O aplicativo cria o id offline, antes de ter rede, e o envia junto com a nota",
                  "const note = { id: randomUUID(), body: \"Comprar café\" };",
                  "",
                  "const save = db.prepare(\"INSERT INTO notes (id, body) VALUES (?, ?) ON CONFLICT (id) DO NOTHING\");",
                  "save.run(note.id, note.body);",
                  "save.run(note.id, note.body);   // reenvio após uma falha de rede: não duplica",
                  "",
                  "db.prepare(\"SELECT COUNT(*) AS total FROM notes\").get();   // { total: 1 }",
                ].join("\n"),
              },
              explanation:
                "Com auto-incremento, o id só existe depois do `INSERT`, e um reenvio cria outra linha. O UUID gerado na " +
                "origem identifica a nota desde o começo, o que ajuda na sincronização offline e na idempotência. " +
                "`randomUUID` gera a versão 4, aleatória; em tabelas muito grandes, a versão 7, ordenada pelo tempo, é " +
                "mais amigável ao índice.",
            },
            {
              title: "Onde a chave natural funciona bem",
              context: "Em uma tabela de referência, o código ISO se lê sem precisar de um `JOIN`.",
              code: {
                language: "javascript",
                filename: "natural-key.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE countries (code TEXT PRIMARY KEY, name TEXT NOT NULL);   -- ISO 3166: 'BR', 'PT'",
                  "  INSERT INTO countries VALUES ('BR', 'Brasil'), ('PT', 'Portugal');",
                  "",
                  "  CREATE TABLE shipments (",
                  "    id INTEGER PRIMARY KEY,",
                  "    destination_country TEXT NOT NULL REFERENCES countries(code)",
                  "  );",
                  "  INSERT INTO shipments (destination_country) VALUES ('BR'), ('PT'), ('BR');",
                  "`);",
                  "",
                  "// O código já diz o que é: nenhum JOIN para agrupar ou filtrar por país",
                  "db.prepare(`",
                  "  SELECT destination_country, COUNT(*) AS total",
                  "  FROM shipments",
                  "  GROUP BY destination_country",
                  "  ORDER BY destination_country",
                  "`).all();",
                  "// [{ destination_country: \"BR\", total: 2 }, { destination_country: \"PT\", total: 1 }]",
                ].join("\n"),
              },
              explanation:
                "O código do país é curto, padronizado e raramente muda, e aparece legível em logs, em relatórios e na " +
                "própria tabela de envios. Com um id numérico, cada leitura precisaria de um `JOIN` para descobrir que o " +
                "31 é o Brasil.",
            },
          ],
          exercise: {
            problem:
              "Toda noite, uma rotina importa o arquivo de clientes de um parceiro. Ela faz um `INSERT` por linha, e " +
              "cada execução repetida cria novos clientes com os mesmos documentos. As outras tabelas referenciam " +
              "`customers.id`, e esse id não pode mudar.",
            problemCode: {
              language: "javascript",
              filename: "import-customers.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (",
                "    id INTEGER PRIMARY KEY,",
                "    tax_id TEXT NOT NULL,",
                "    name TEXT NOT NULL,",
                "    email TEXT NOT NULL",
                "  );",
                "`);",
                "",
                "function importCustomers(rows) {",
                "  const insert = db.prepare(\"INSERT INTO customers (tax_id, name, email) VALUES (?, ?, ?)\");",
                "  for (const row of rows) insert.run(row.taxId, row.name, row.email);",
                "}",
              ].join("\n"),
            },
            task:
              "Torne a importação idempotente: rodá-la de novo com o mesmo arquivo não cria linhas, e um cliente que " +
              "mudou de e-mail é atualizado, mantendo o mesmo `id`.",
            hint:
              "Proteja a chave natural com `UNIQUE` e use `INSERT ... ON CONFLICT (tax_id) DO UPDATE`: o conflito é " +
              "detectado pela chave natural, e a chave substituta não muda.",
            solution: {
              code: {
                language: "javascript",
                filename: "import-customers.fixed.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "const db = new DatabaseSync(\":memory:\");",
                  "",
                  "db.exec(`",
                  "  CREATE TABLE customers (",
                  "    id INTEGER PRIMARY KEY,",
                  "    tax_id TEXT NOT NULL UNIQUE,",
                  "    name TEXT NOT NULL,",
                  "    email TEXT NOT NULL",
                  "  );",
                  "`);",
                  "",
                  "function importCustomers(rows) {",
                  "  const upsert = db.prepare(`",
                  "    INSERT INTO customers (tax_id, name, email) VALUES (?, ?, ?)",
                  "    ON CONFLICT (tax_id) DO UPDATE SET name = excluded.name, email = excluded.email",
                  "  `);",
                  "  db.exec(\"BEGIN\");",
                  "  try {",
                  "    for (const row of rows) upsert.run(row.taxId, row.name, row.email);",
                  "    db.exec(\"COMMIT\");",
                  "  } catch (error) {",
                  "    db.exec(\"ROLLBACK\");",
                  "    throw error;",
                  "  }",
                  "}",
                  "",
                  "importCustomers([{ taxId: \"123.456.789-09\", name: \"Ana Souza\", email: \"ana@example.test\" }]);",
                  "importCustomers([{ taxId: \"123.456.789-09\", name: \"Ana Souza\", email: \"ana.souza@example.test\" }]);",
                  "",
                  "db.prepare(\"SELECT id, email FROM customers\").all();",
                  "// [{ id: 1, email: \"ana.souza@example.test\" }] — uma linha, o mesmo id, o e-mail novo",
                ].join("\n"),
              },
              explanation:
                "Cada chave faz o que sabe fazer: a natural reconhece que é o mesmo cliente, e a substituta continua a " +
                "mesma, para que pedidos e faturas não percam a referência. Em uma base que já tem duplicatas, é preciso " +
                "mesclá-las antes de criar o `UNIQUE`.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Database Migration",
          requires: ["Database Fundamentals / Database Schema"],
          note: "migrations versionadas, forward-only, expand/contract — revisita Software Craft / Incremental Migration",
          revisit: ["Software Craft / Dependency & Version Management / Incremental Migration"],
          summary:
            "Mudar o esquema e os dados de um banco que já está em uso por meio de passos versionados, pequenos e " +
            "compatíveis com a aplicação no ar — incluindo a cópia de dados em lotes e o padrão expandir e contrair.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma migração de banco é uma mudança versionada no esquema (criar uma tabela, acrescentar uma coluna, " +
                "criar um índice) ou nos dados (preencher uma coluna nova, converter um formato). A mecânica de scripts " +
                "numerados, aplicados uma vez e registrados, é a do esquema. O problema difícil é outro: mudar um banco " +
                "com dados reais enquanto a aplicação continua atendendo, sem parada e sem perder nada. É a migração " +
                "incremental aplicada ao banco: o antigo e o novo convivem durante a transição.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Em produção, toda migração precisa funcionar com a versão da aplicação que está no ar e com a próxima: " +
                "uma mudança incompatível vira vários passos compatíveis, separados por implantações.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "list",
              items: [
                "Separe as mudanças de esquema das de dados: a de esquema é curta e transacional; a cópia de milhões de linhas roda em lotes, fora dela.",
                "Acrescente antes de remover (expandir e contrair): coluna nova opcional, código que escreve nas duas, cópia dos dados antigos, código que lê da nova e, por fim, a remoção da antiga.",
                "Aplique a migração antes do código que depende dela, e mantenha o código compatível com o esquema anterior até a migração estar em todos os ambientes.",
                "Siga sempre para a frente: para desfazer, escreva uma nova migração que corrige, em vez de voltar versões.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "add-required-column.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "db.exec(\"CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL)\");",
                "// ... imagine milhões de linhas já existentes",
                "",
                "// Passo 1 (migração de esquema): a coluna nasce opcional, e nenhuma linha antiga é recusada",
                "db.exec(\"ALTER TABLE customers ADD COLUMN country TEXT\");",
                "",
                "// Passo 2 (migração de dados): preencher em lotes, cada lote em uma transação curta",
                "function backfillCountry(db, batchSize = 1000) {",
                "  const update = db.prepare(`",
                "    UPDATE customers SET country = 'BR'   -- a regra de preenchimento combinada com o negócio",
                "    WHERE id IN (SELECT id FROM customers WHERE country IS NULL LIMIT ?)",
                "  `);",
                "  let changed;",
                "  do {",
                "    changed = Number(update.run(batchSize).changes);",
                "  } while (changed > 0);",
                "}",
                "backfillCountry(db);",
                "",
                "// Passo 3 (migração de esquema, em uma implantação posterior): só agora a coluna vira obrigatória",
                "// PostgreSQL: ALTER TABLE customers ALTER COLUMN country SET NOT NULL;",
                "// (no SQLite, tornar uma coluna existente obrigatória exige recriar a tabela)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Um único `UPDATE` em milhões de linhas seguraria bloqueios por muito tempo e geraria uma transação " +
                "enorme. Em lotes, cada passo é curto, e a rotina pode ser interrompida e retomada, porque só pega as " +
                "linhas que ainda faltam.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Uma migração testada só em um banco vazio esconde os problemas reais: a duração, os bloqueios e os dados antigos que violam a regra nova. Teste com um volume parecido com o de produção.",
                "Migrações de reversão (\"down\") raramente desfazem de verdade: depois de apagar uma coluna, criá-la de novo não traz os dados de volta.",
                "Mudar o significado de uma coluna sem mudar o nome engana o código antigo, que continua lendo o valor com o sentido anterior.",
                "Remover ou renomear algo que a versão no ar ainda usa derruba essa versão no instante em que a migração roda, mesmo que a próxima versão já esteja pronta.",
              ],
            },
          ],
          examples: [
            {
              title: "Seguir para a frente",
              context:
                "A migração 12 criou o índice errado; a correção é a migração 13, e não editar nem desfazer a 12.",
              code: {
                language: "javascript",
                filename: "forward-only.js",
                code: [
                  "const migrations = [",
                  "  // ...",
                  "  { id: 12, name: \"index orders by customer\", sql: \"CREATE INDEX idx_orders_customer ON orders(customer_id)\" },",
                  "  // Depois, descobriu-se que as consultas filtram por cliente E por data — e a 12 já rodou em produção.",
                  "",
                  "  // Errado: editar a 12 (os bancos que já a aplicaram nunca verão a mudança)",
                  "  // Certo: uma nova migração, que leva todos os bancos ao estado desejado",
                  "  {",
                  "    id: 13,",
                  "    name: \"replace orders customer index\",",
                  "    sql: `",
                  "      CREATE INDEX idx_orders_customer_date ON orders(customer_id, placed_at);",
                  "      DROP INDEX idx_orders_customer;",
                  "    `,",
                  "  },",
                  "];",
                ].join("\n"),
              },
              explanation:
                "Seguir para a frente mantém uma só história para todos os ambientes: cada banco aplica as mesmas " +
                "migrações, na mesma ordem. Muitas ferramentas oferecem migrações de reversão, mas elas só são seguras " +
                "para mudanças sem perda, como criar um índice.",
            },
            {
              title: "A ordem entre migração e implantação",
              context: "Remover uma coluna exige que nenhum código em execução ainda a use.",
              code: {
                language: "text",
                filename: "drop-column-order.txt",
                code: [
                  "Objetivo: remover customers.legacy_code, que a aplicação v1 ainda lê.",
                  "",
                  "Implantação 1  Aplicação v2: para de ler e de escrever legacy_code.",
                  "               (o esquema ainda tem a coluna; v1 e v2 funcionam durante a troca)",
                  "Implantação 2  Migração: DROP COLUMN legacy_code.",
                  "               (só depois que nenhuma instância da v1 está no ar)",
                  "",
                  "Na ordem inversa, com a migração primeiro, as instâncias da v1 que ainda atendem",
                  "passam a falhar com \"no such column: legacy_code\" até serem substituídas.",
                ].join("\n"),
              },
              explanation:
                "Acrescentar vem antes do código que usa; remover vem depois do código que parou de usar. Durante uma " +
                "implantação gradual, as duas versões da aplicação rodam ao mesmo tempo, e o esquema precisa servir às " +
                "duas.",
            },
            {
              title: "Mudar o tipo de uma coluna sem parada",
              context: "O preço, guardado em reais com casas decimais (`REAL`), precisa virar centavos inteiros.",
              code: {
                language: "javascript",
                filename: "change-type.js",
                code: [
                  "// 1. Expandir: a coluna nova, ao lado da antiga",
                  "db.exec(\"ALTER TABLE products ADD COLUMN price_cents INTEGER\");",
                  "",
                  "// 2. A aplicação (nova versão) passa a escrever nas duas",
                  "function updatePrice(id, priceCents) {",
                  "  db.prepare(\"UPDATE products SET price_cents = ?, price = ? WHERE id = ?\").run(priceCents, priceCents / 100, id);",
                  "}",
                  "",
                  "// 3. Preencher as linhas antigas, em lotes",
                  "const backfill = db.prepare(`",
                  "  UPDATE products SET price_cents = CAST(ROUND(price * 100) AS INTEGER)",
                  "  WHERE id IN (SELECT id FROM products WHERE price_cents IS NULL LIMIT 1000)",
                  "`);",
                  "while (Number(backfill.run().changes) > 0) {",
                  "  // próximo lote",
                  "}",
                  "",
                  "// 4. A aplicação passa a ler de price_cents",
                  "// 5. Contrair: quando nada mais usa price, uma nova migração remove a coluna",
                ].join("\n"),
              },
              explanation:
                "É o mesmo expandir e contrair do renomear uma coluna, aplicado a uma conversão: em nenhum momento a " +
                "versão no ar encontra um esquema que não entende. O `ROUND` antes do `CAST` evita que 19.99 × 100 vire " +
                "1998 pelo erro do ponto flutuante.",
            },
          ],
          exercise: {
            problem:
              "O cadastro de usuários guarda o nome completo em `full_name`, e o time precisa separá-lo em `first_name` " +
              "e `last_name` para ordenar por sobrenome. A tabela tem milhões de linhas, a aplicação não pode parar, e " +
              "a primeira proposta foi uma única migração que cria as colunas, preenche tudo com um `UPDATE` e apaga " +
              "`full_name`.",
            problemCode: {
              language: "javascript",
              filename: "split-name.js",
              code: [
                "const migrations = [",
                "  {",
                "    id: 20,",
                "    name: \"split full name\",",
                "    sql: `",
                "      ALTER TABLE users ADD COLUMN first_name TEXT;",
                "      ALTER TABLE users ADD COLUMN last_name TEXT;",
                "      UPDATE users SET",
                "        first_name = substr(full_name, 1, instr(full_name, ' ') - 1),",
                "        last_name  = substr(full_name, instr(full_name, ' ') + 1);",
                "      ALTER TABLE users DROP COLUMN full_name;",
                "    `,",
                "  },",
                "];",
              ].join("\n"),
            },
            task:
              "Reescreva a mudança como uma sequência de passos seguros: diga o que é migração de esquema, o que é " +
              "migração de dados e o que é mudança de código, e em que ordem cada um é implantado. Implemente o " +
              "preenchimento em lotes, tratando os nomes sem sobrenome.",
            hint:
              "Expandir (colunas novas opcionais) → código que escreve nas três colunas → preenchimento em lotes das " +
              "linhas antigas → código que lê das novas → contrair (remover `full_name`) em uma implantação posterior.",
            solution: {
              code: {
                language: "javascript",
                filename: "split-name.fixed.js",
                code: [
                  "// Implantação 1 — migração de esquema: só acrescenta (compatível com o código atual)",
                  "const migrations = [",
                  "  {",
                  "    id: 20,",
                  "    name: \"add first and last name\",",
                  "    sql: \"ALTER TABLE users ADD COLUMN first_name TEXT; ALTER TABLE users ADD COLUMN last_name TEXT\",",
                  "  },",
                  "];",
                  "",
                  "// Implantação 2 — código: toda escrita preenche full_name, first_name e last_name",
                  "function splitName(fullName) {",
                  "  const trimmed = fullName.trim();",
                  "  const space = trimmed.indexOf(\" \");",
                  "  return space === -1",
                  "    ? { firstName: trimmed, lastName: \"\" }",
                  "    : { firstName: trimmed.slice(0, space), lastName: trimmed.slice(space + 1) };",
                  "}",
                  "",
                  "// Migração de dados — em lotes e retomável: só pega as linhas que ainda faltam",
                  "function backfillNames(db, batchSize = 1000) {",
                  "  const select = db.prepare(\"SELECT id, full_name FROM users WHERE first_name IS NULL LIMIT ?\");",
                  "  const update = db.prepare(\"UPDATE users SET first_name = ?, last_name = ? WHERE id = ?\");",
                  "  for (let batch = select.all(batchSize); batch.length > 0; batch = select.all(batchSize)) {",
                  "    db.exec(\"BEGIN\");",
                  "    try {",
                  "      for (const row of batch) {",
                  "        const { firstName, lastName } = splitName(row.full_name);",
                  "        update.run(firstName, lastName, row.id);",
                  "      }",
                  "      db.exec(\"COMMIT\");",
                  "    } catch (error) {",
                  "      db.exec(\"ROLLBACK\");",
                  "      throw error;",
                  "    }",
                  "  }",
                  "}",
                  "",
                  "// Implantação 3 — código: lê de first_name e last_name (ORDER BY last_name)",
                  "// Implantação 4 — migração de esquema, quando nenhuma versão antiga está no ar:",
                  "//   { id: 21, name: \"drop full name\", sql: \"ALTER TABLE users DROP COLUMN full_name\" }",
                ].join("\n"),
              },
              explanation:
                "A proposta original fazia tudo de uma vez: o `UPDATE` único travaria a tabela, e apagar `full_name` " +
                "quebraria na hora a versão da aplicação que ainda o lê. Em passos, cada implantação é compatível com a " +
                "anterior, o preenchimento pode parar e recomeçar, e a separação do nome fica em uma função testável. " +
                "Separar nomes é, em si, uma simplificação: há sobrenomes compostos e nomes de uma palavra só.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "database-transactions",
      order: 60,
      title: "Database Transactions",
      requires: ["Database Fundamentals"],
      summary:
        "Transaction → ACID (A/C/D consolidados; Isolation separada) → isolation levels → read phenomena → " +
        "optimistic × pessimistic locking.",
      concepts: [
        concept({
          order: 10,
          title: "Transaction",
          requires: ["Database Fundamentals / SQL"],
          note: "BEGIN/COMMIT/ROLLBACK; unidade de trabalho. Software Design / Enterprise Patterns / Unit of Work abstrai isto (pointer)",
          revisit: ["Software Design / Enterprise & Application Patterns / Unit of Work"],
          summary:
            "Um grupo de comandos que o banco trata como uma unidade: ou todos valem (`COMMIT`), ou nenhum vale " +
            "(`ROLLBACK`) — para que uma operação de várias etapas nunca fique pela metade.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Uma transação agrupa vários comandos em uma unidade de trabalho. Ela começa com `BEGIN`, e termina com " +
                "`COMMIT`, que confirma tudo de uma vez, ou com `ROLLBACK`, que desfaz tudo o que foi feito desde o " +
                "início. Se o processo cair, a conexão cair ou um comando falhar no meio, o banco desfaz a parte já " +
                "executada. Fora de um `BEGIN` explícito, os bancos relacionais tratam cada comando como uma transação " +
                "própria (o modo autocommit).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Toda operação de negócio que exige mais de uma escrita — baixar o estoque e criar o pedido, por exemplo " +
                "— precisa estar dentro de uma transação; sem ela, uma falha no meio deixa o banco em um estado que não " +
                "deveria existir.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "paragraph",
              text:
                "A aplicação abre a transação, executa os comandos e decide o final: confirma se tudo deu certo, desfaz " +
                "se algo falhou. O padrão mais seguro é concentrar isso em uma função que recebe o trabalho a fazer, para " +
                "que nenhum caminho de erro esqueça o `ROLLBACK`.",
            },
            {
              type: "code",
              language: "javascript",
              filename: "checkout.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, stock INTEGER NOT NULL CHECK (stock >= 0));",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL);",
                "  INSERT INTO products VALUES (1, 'Caneca', 3);",
                "`);",
                "",
                "// Executa `work` dentro de uma transação: COMMIT se terminar, ROLLBACK se lançar um erro.",
                "function withTransaction(db, work) {",
                "  db.exec(\"BEGIN\");",
                "  try {",
                "    const result = work();",
                "    db.exec(\"COMMIT\");",
                "    return result;",
                "  } catch (error) {",
                "    db.exec(\"ROLLBACK\");",
                "    throw error;",
                "  }",
                "}",
                "",
                "function checkout(productId, quantity) {",
                "  return withTransaction(db, () => {",
                "    db.prepare(\"UPDATE products SET stock = stock - ? WHERE id = ?\").run(quantity, productId);   // o CHECK recusa estoque negativo",
                "    return db.prepare(\"INSERT INTO orders (product_id, quantity) VALUES (?, ?)\").run(productId, quantity).lastInsertRowid;",
                "  });",
                "}",
                "",
                "checkout(1, 2);   // estoque 3 → 1, pedido criado",
                "try { checkout(1, 5); } catch (error) { error.message; }   // \"CHECK constraint failed: stock >= 0\"",
                "",
                "db.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 1 } — a 2ª compra não deixou rastro",
                "db.prepare(\"SELECT COUNT(*) AS total FROM orders\").get();      // { total: 1 }",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O padrão Unit of Work, da camada de aplicação, organiza as mudanças de uma operação de negócio para " +
                "gravá-las justamente assim: todas em uma única transação.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Sempre que uma operação precisa de mais de uma escrita que só faz sentido junta: pedido e estoque, cabeçalho e itens, crédito e débito.",
                "Quando se lê um dado para decidir uma escrita, e a decisão não pode valer se o dado mudar no meio (o que também depende do nível de isolamento).",
                "Em cargas e migrações, para que uma execução que falha não deixe os dados pela metade.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Transações longas seguram bloqueios e versões antigas dos dados; não chame APIs externas, filas ou e-mails dentro delas.",
                "A transação só vale dentro de um banco: um e-mail enviado ou uma chamada a outro serviço não é desfeita pelo `ROLLBACK`.",
                "Uma transação sozinha não impede que duas execuções simultâneas se atrapalhem; isso depende do isolamento e, às vezes, de locks.",
              ],
            },
          ],
          examples: [
            {
              title: "Sem transação, metade da operação fica gravada",
              context: "Em autocommit, cada comando é confirmado assim que termina.",
              code: {
                language: "javascript",
                filename: "half-done.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE products (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL);",
                  "  CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, customer_id INTEGER NOT NULL);",
                  "  INSERT INTO products VALUES (1, 3);",
                  "`);",
                  "",
                  "function checkoutWithoutTransaction(productId, quantity, customerId) {",
                  "  db.prepare(\"UPDATE products SET stock = stock - ? WHERE id = ?\").run(quantity, productId);              // confirmado na hora",
                  "  db.prepare(\"INSERT INTO orders (product_id, customer_id) VALUES (?, ?)\").run(productId, customerId);    // falha: cliente ausente",
                  "}",
                  "",
                  "try { checkoutWithoutTransaction(1, 2, null); }",
                  "catch (error) { error.message; }   // \"NOT NULL constraint failed: orders.customer_id\"",
                  "",
                  "db.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 1 } — o estoque baixou",
                  "db.prepare(\"SELECT COUNT(*) AS total FROM orders\").get();      // { total: 0 } — e nenhum pedido explica a baixa",
                ].join("\n"),
              },
              explanation:
                "O primeiro comando foi confirmado antes de o segundo falhar, e o estoque ficou diferente do que os " +
                "pedidos explicam. Dentro de uma transação, a falha do `INSERT` desfaria também o `UPDATE`.",
            },
            {
              title: "O que não deve ficar dentro da transação",
              context: "Uma chamada lenta ou externa segura os bloqueios e não é desfeita pelo `ROLLBACK`.",
              code: {
                language: "javascript",
                filename: "external-calls.js",
                code: [
                  "// Errado: a cobrança acontece no meio da transação",
                  "async function payOrderWrong(db, payments, orderId) {",
                  "  db.exec(\"BEGIN\");",
                  "  try {",
                  "    const order = db.prepare(\"SELECT id, total_cents FROM orders WHERE id = ?\").get(orderId);",
                  "    await payments.charge(order.total_cents);   // segundos de rede com a transação aberta",
                  "    db.prepare(\"UPDATE orders SET status = 'paid' WHERE id = ?\").run(orderId);",
                  "    db.exec(\"COMMIT\");                          // se falhar aqui, o cliente foi cobrado e o pedido não diz isso",
                  "  } catch (error) {",
                  "    db.exec(\"ROLLBACK\");                        // não devolve o dinheiro",
                  "    throw error;",
                  "  }",
                  "}",
                  "",
                  "// Melhor: transações curtas antes e depois; a chamada externa fica entre elas",
                  "async function payOrder(db, payments, orderId) {",
                  "  const order = db.prepare(\"UPDATE orders SET status = 'paying' WHERE id = ? AND status = 'pending' RETURNING total_cents\").get(orderId);",
                  "  if (!order) throw new Error(\"pedido não está pendente\");",
                  "  const receipt = await payments.charge(order.total_cents, { idempotencyKey: `order-${orderId}` });",
                  "  db.prepare(\"UPDATE orders SET status = 'paid', receipt = ? WHERE id = ?\").run(receipt.id, orderId);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada escrita da versão melhor é uma transação curta, e o estado `paying` registra que a cobrança está em " +
                "andamento. Se algo falhar entre as duas escritas, o pedido fica em um estado conhecido, que uma rotina " +
                "pode conferir com o provedor; a chave de idempotência evita cobrar duas vezes ao tentar de novo.",
            },
            {
              title: "Savepoint: desfazer só uma parte",
              context:
                "Dentro de uma transação, um `SAVEPOINT` marca um ponto para onde se pode voltar sem perder o resto.",
              code: {
                language: "javascript",
                filename: "savepoint.js",
                code: [
                  "db.exec(\"CREATE TABLE contacts (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE)\");",
                  "",
                  "function importContacts(emails) {",
                  "  const skipped = [];",
                  "  db.exec(\"BEGIN\");",
                  "  try {",
                  "    for (const email of emails) {",
                  "      db.exec(\"SAVEPOINT row\");",
                  "      try {",
                  "        db.prepare(\"INSERT INTO contacts (email) VALUES (?)\").run(email);",
                  "        db.exec(\"RELEASE row\");",
                  "      } catch {",
                  "        db.exec(\"ROLLBACK TO row\");   // desfaz só esta linha",
                  "        db.exec(\"RELEASE row\");",
                  "        skipped.push(email);",
                  "      }",
                  "    }",
                  "    db.exec(\"COMMIT\");",
                  "  } catch (error) {",
                  "    db.exec(\"ROLLBACK\");",
                  "    throw error;",
                  "  }",
                  "  return skipped;",
                  "}",
                  "",
                  "importContacts([\"ana@example.test\", \"bruno@example.test\", \"ana@example.test\"]);   // [\"ana@example.test\"]",
                  "db.prepare(\"SELECT COUNT(*) AS total FROM contacts\").get();                      // { total: 2 }",
                ].join("\n"),
              },
              explanation:
                "O `ROLLBACK TO` volta ao savepoint e mantém tudo o que veio antes dele. A importação inteira continua " +
                "sendo uma transação só: se o processo cair no meio, nenhum contato fica gravado.",
            },
          ],
          exercise: {
            problem:
              "O resgate de um cupom faz três escritas separadas: marca o cupom como usado, cria o pedido com desconto " +
              "e baixa o estoque. Quando o estoque acaba, o cupom fica marcado como usado sem que nenhum pedido tenha " +
              "sido criado.",
            problemCode: {
              language: "javascript",
              filename: "redeem.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE coupons (code TEXT PRIMARY KEY, used INTEGER NOT NULL DEFAULT 0);",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL CHECK (stock >= 0));",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, coupon TEXT);",
                "  INSERT INTO coupons (code) VALUES ('BEMVINDO');",
                "  INSERT INTO products VALUES (1, 0);",
                "`);",
                "",
                "function redeem(code, productId) {",
                "  db.prepare(\"UPDATE coupons SET used = 1 WHERE code = ? AND used = 0\").run(code);",
                "  db.prepare(\"INSERT INTO orders (product_id, coupon) VALUES (?, ?)\").run(productId, code);",
                "  db.prepare(\"UPDATE products SET stock = stock - 1 WHERE id = ?\").run(productId);   // falha: estoque 0",
                "}",
              ].join("\n"),
            },
            task:
              "Escreva uma função `withTransaction` e reescreva `redeem` com ela, de modo que uma falha em qualquer " +
              "etapa não deixe rastro. Aproveite para recusar um cupom que já foi usado.",
            hint:
              "`UPDATE ... WHERE used = 0` devolve `changes` igual a 0 quando o cupom já foi usado: lance um erro nesse " +
              "caso, e a transação desfaz o resto.",
            solution: {
              code: {
                language: "javascript",
                filename: "redeem.fixed.js",
                code: [
                  "function withTransaction(db, work) {",
                  "  db.exec(\"BEGIN\");",
                  "  try {",
                  "    const result = work();",
                  "    db.exec(\"COMMIT\");",
                  "    return result;",
                  "  } catch (error) {",
                  "    db.exec(\"ROLLBACK\");",
                  "    throw error;",
                  "  }",
                  "}",
                  "",
                  "function redeem(code, productId) {",
                  "  return withTransaction(db, () => {",
                  "    const coupon = db.prepare(\"UPDATE coupons SET used = 1 WHERE code = ? AND used = 0\").run(code);",
                  "    if (coupon.changes === 0) throw new Error(\"cupom inválido ou já usado\");",
                  "    db.prepare(\"INSERT INTO orders (product_id, coupon) VALUES (?, ?)\").run(productId, code);",
                  "    db.prepare(\"UPDATE products SET stock = stock - 1 WHERE id = ?\").run(productId);",
                  "  });",
                  "}",
                  "",
                  "try { redeem(\"BEMVINDO\", 1); } catch (error) { error.message; }   // \"CHECK constraint failed: stock >= 0\"",
                  "",
                  "db.prepare(\"SELECT used FROM coupons WHERE code = 'BEMVINDO'\").get();   // { used: 0 } — o cupom continua disponível",
                  "db.prepare(\"SELECT COUNT(*) AS total FROM orders\").get();                // { total: 0 }",
                ].join("\n"),
              },
              explanation:
                "As três escritas passaram a ser uma unidade: a falha do estoque desfaz o pedido e devolve o cupom. A " +
                "condição `used = 0` no próprio `UPDATE` faz a checagem e a marcação em um passo, sem uma consulta " +
                "separada antes.",
            },
          },
        }),
        concept({
          order: 20,
          title: "ACID (A / C / D)",
          requires: ["Transaction"],
          subtopics: ["Atomicity", "Consistency (ACID) — subtopic nomeado, endereçável para a colisão", "Durability"],
          note: "consolidada (A7 + C6). Isolation fica Task própria",
          collision: "Consistency (ACID) ≠ Distributed Consistency (Architecture); Atomicity ≠ Atomic Operation (Programming Foundations / Concurrency)",
          summary:
            "As garantias que um banco transacional dá a cada transação: atomicidade (tudo ou nada), consistência (as " +
            "regras declaradas continuam valendo), isolamento (tratado à parte) e durabilidade (o que foi confirmado " +
            "não se perde).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "ACID é a sigla das quatro propriedades de uma transação. Atomicidade: a transação acontece por inteiro " +
                "ou não acontece. Consistência: ela leva o banco de um estado válido a outro estado válido, segundo as " +
                "regras declaradas (chaves, `CHECK`, `UNIQUE`). Isolamento: transações simultâneas não se atrapalham — ou " +
                "se atrapalham só do jeito permitido pelo nível escolhido. Durabilidade: depois do `COMMIT`, o resultado " +
                "sobrevive a uma queda do processo ou da máquina. O isolamento é o que os bancos mais relaxam na prática, " +
                "e por isso ganha um conceito próprio.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "ACID descreve o que o banco garante sobre cada transação, e não sobre o sistema inteiro: ele só protege " +
                "o que está dentro da transação e só verifica as regras que foram declaradas.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Essas garantias tiram da aplicação um trabalho que ela faria mal: desfazer uma operação pela metade " +
                "depois de uma falha, verificar as regras em todos os caminhos de escrita e garantir que um dado " +
                "confirmado está no disco. Conhecer o limite de cada uma evita a falsa segurança de \"o banco é ACID, " +
                "então está tudo certo\".",
            },
            {
              type: "list",
              items: [
                "Atomicidade é sobre falhas: garante que não sobra metade de uma operação. Ela não impede que duas transações simultâneas leiam o mesmo valor — isso é isolamento.",
                "Consistência, no sentido do ACID, é o respeito às regras declaradas no esquema. Não tem relação com a consistência de sistemas distribuídos (réplicas que concordam entre si).",
                "Durabilidade depende de o banco gravar o log no disco antes de responder ao `COMMIT`; configurações que trocam isso por velocidade podem perder as últimas transações em uma queda.",
              ],
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "acid.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "import { rmSync } from \"node:fs\";",
                "",
                "const file = \"./acid-demo.db\";",
                "rmSync(file, { force: true });",
                "let db = new DatabaseSync(file);",
                "db.exec(\"CREATE TABLE seats (id INTEGER PRIMARY KEY, free INTEGER NOT NULL CHECK (free >= 0))\");",
                "db.exec(\"INSERT INTO seats VALUES (1, 2)\");",
                "",
                "// Atomicidade + consistência: o 2º UPDATE viola o CHECK, e a transação inteira é desfeita",
                "db.exec(\"BEGIN\");",
                "try {",
                "  db.exec(\"UPDATE seats SET free = free - 1 WHERE id = 1\");   // 2 → 1",
                "  db.exec(\"UPDATE seats SET free = free - 5 WHERE id = 1\");   // 1 → -4: recusado pelo CHECK",
                "  db.exec(\"COMMIT\");",
                "} catch {",
                "  db.exec(\"ROLLBACK\");",
                "}",
                "db.prepare(\"SELECT free FROM seats\").get();   // { free: 2 } — nem o 1º UPDATE ficou",
                "",
                "// Durabilidade: o que foi confirmado continua lá depois de fechar e reabrir o banco",
                "db.exec(\"UPDATE seats SET free = 1 WHERE id = 1\");   // autocommit: confirmado",
                "db.close();",
                "db = new DatabaseSync(file);",
                "db.prepare(\"SELECT free FROM seats\").get();   // { free: 1 }",
              ].join("\n"),
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Regras que só existem no código da aplicação não fazem parte da consistência do ACID: o banco só garante o que foi declarado no esquema.",
                "Comandos executados fora de uma transação explícita são confirmados um a um; o ACID de cada comando não faz de uma função inteira uma operação atômica.",
                "Desligar a sincronização com o disco para ganhar desempenho (`synchronous_commit = off` no PostgreSQL, `synchronous = OFF` no SQLite) troca durabilidade por velocidade; faça isso só sabendo o que pode ser perdido.",
                "ACID vale dentro de um banco; uma operação que escreve em dois bancos ou em um banco e uma fila não é atômica por isso.",
              ],
            },
          ],
          examples: [
            {
              title: "O banco garante a regra que foi declarada",
              context: "Um `CHECK` protege o estoque; o limite por cliente, que só existe no código, não é protegido.",
              code: {
                language: "javascript",
                filename: "declared-rules.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE products (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL CHECK (stock >= 0));",
                  "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, quantity INTEGER NOT NULL);",
                  "  INSERT INTO products VALUES (1, 100);",
                  "`);",
                  "",
                  "// Regra de negócio só no código: no máximo 5 unidades por cliente",
                  "const MAX_PER_CUSTOMER = 5;",
                  "",
                  "// Um script interno grava direto no banco, sem passar por essa verificação",
                  "db.prepare(\"INSERT INTO orders (customer_id, quantity) VALUES (?, ?)\").run(7, 40);   // aceito: o banco não conhece o limite",
                  "",
                  "try { db.exec(\"UPDATE products SET stock = stock - 200 WHERE id = 1\"); }",
                  "catch (error) { error.message; }   // \"CHECK constraint failed: stock >= 0\" — esta regra o banco conhece",
                ].join("\n"),
              },
              explanation:
                "A consistência do ACID é a das regras que o banco enxerga. O limite por cliente depende de dados de " +
                "outras linhas e pode ficar na aplicação, mas então vale só para quem passa por ela; é uma escolha " +
                "consciente, e não uma garantia do banco.",
            },
            {
              title: "Durabilidade tem um preço, e às vezes se abre mão dela",
              context: "Confirmar só depois de o log chegar ao disco custo tempo em cada `COMMIT`.",
              code: {
                language: "text",
                filename: "durability.txt",
                code: [
                  "PostgreSQL",
                  "  synchronous_commit = on    (padrão) o COMMIT só responde depois de o log (WAL) estar no disco.",
                  "  synchronous_commit = off   o COMMIT responde antes; em uma queda do servidor, as últimas",
                  "                             transações confirmadas podem se perder. O banco não fica corrompido:",
                  "                             só volta a um ponto um pouco anterior.",
                  "",
                  "SQLite (modo WAL)",
                  "  PRAGMA synchronous = FULL    cada COMMIT é sincronizado com o disco.",
                  "  PRAGMA synchronous = NORMAL  mais rápido; em uma queda de energia, a última transação",
                  "                               confirmada pode ser desfeita. O banco continua íntegro.",
                  "",
                  "Pode fazer sentido para dados que se podem reconstruir (cache, métricas, cargas repetíveis).",
                  "Não faz para pedidos, pagamentos ou qualquer coisa que a pessoa já viu como \"confirmado\".",
                ].join("\n"),
              },
              explanation:
                "A durabilidade não é tudo ou nada: é uma configuração, e em alguns bancos pode ser escolhida por " +
                "transação. Relaxá-la mantém a atomicidade e a consistência; o que se arrisca é perder as confirmações " +
                "mais recentes.",
            },
            {
              title: "Atomicidade não é o mesmo que operação atômica",
              context:
                "O \"A\" do ACID trata de falhas; a operação atômica da concorrência trata de execuções simultâneas.",
              code: {
                language: "text",
                filename: "atomicity-vs-atomic.txt",
                code: [
                  "Atomicidade (ACID)                            Operação atômica (concorrência)",
                  "--------------------------------------------  --------------------------------------------",
                  "\"tudo ou nada\" diante de uma falha            \"indivisível\" diante de outra execução",
                  "protege contra: queda, erro no meio,          protege contra: outra thread ou transação",
                  "ROLLBACK                                      ler ou escrever no meio da operação",
                  "no banco: a transação                         no banco: um único comando, como",
                  "                                              UPDATE ... SET stock = stock - 1",
                  "",
                  "Duas transações atômicas podem, ao mesmo tempo, ler o mesmo estoque (10), calcular 9",
                  "e gravar 9: nenhuma ficou pela metade, e mesmo assim uma venda se perdeu.",
                  "Quem trata disso é o isolamento (ou um único UPDATE que lê e escreve no mesmo passo).",
                ].join("\n"),
              },
              explanation:
                "Os nomes parecidos escondem problemas diferentes. Uma transação pode ser perfeitamente atômica e ainda " +
                "assim sofrer com concorrência; é por isso que o isolamento é uma propriedade separada.",
            },
          ],
          exercise: {
            problem:
              "Em uma revisão de arquitetura, o time afirmou: \"usamos um banco ACID, então estamos protegidos\". Alguém " +
              "listou as situações que preocupam, e é preciso dizer quais o banco de fato garante e o que falta em cada " +
              "uma.",
            problemCode: {
              language: "javascript",
              filename: "acid-claims.js",
              code: [
                "// Para cada situação: o banco garante sozinho? Se não, o que falta?",
                "const claims = [",
                "  { id: 1, text: \"Se o servidor da aplicação cair no meio de checkout(), nada fica pela metade.\" },",
                "  { id: 2, text: \"O estoque nunca fica negativo.\" },",
                "  { id: 3, text: \"Um pedido confirmado não se perde se o servidor do banco reiniciar em seguida.\" },",
                "  { id: 4, text: \"Dois clientes nunca compram a última unidade ao mesmo tempo.\" },",
                "  { id: 5, text: \"O e-mail de confirmação só sai se o pedido for gravado.\" },",
                "];",
              ].join("\n"),
            },
            task:
              "Para cada situação, responda `garantido: true | false` e explique o que é preciso para que ela valha — " +
              "qual letra do ACID está em jogo, e o que a aplicação ou o esquema precisam fazer.",
            hint:
              "Pergunte, em cada caso: isto está dentro de uma transação? É uma regra declarada no esquema? Envolve " +
              "execuções simultâneas? Envolve algo fora do banco?",
            solution: {
              code: {
                language: "javascript",
                filename: "acid-claims.answer.js",
                code: [
                  "const answers = [",
                  "  { id: 1, garantido: false, letra: \"A\",",
                  "    falta: \"Só se todas as escritas de checkout() estiverem em UMA transação; comandos em autocommit são confirmados um a um.\" },",
                  "  { id: 2, garantido: false, letra: \"C\",",
                  "    falta: \"Só se houver CHECK (stock >= 0) no esquema; uma verificação apenas no código não protege scripts e outros caminhos.\" },",
                  "  { id: 3, garantido: true, letra: \"D\",",
                  "    falta: \"Nada, com a configuração padrão; deixaria de valer com synchronous_commit = off (PostgreSQL) ou equivalente.\" },",
                  "  { id: 4, garantido: false, letra: \"I\",",
                  "    falta: \"Depende do isolamento: um único UPDATE condicional (stock > 0), um lock na linha ou o nível Serializable.\" },",
                  "  { id: 5, garantido: false, letra: \"—\",",
                  "    falta: \"O e-mail está fora do banco: envie depois do COMMIT, idealmente a partir de um registro gravado na mesma transação (outbox).\" },",
                  "];",
                ].join("\n"),
              },
              explanation:
                "Só a durabilidade vem pronta. A atomicidade depende de a aplicação usar transações, a consistência " +
                "depende das regras declaradas, e o isolamento depende do nível e da forma de escrever as consultas. " +
                "Efeitos fora do banco nunca são cobertos pelo ACID.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Isolation",
          requires: ["ACID (A / C / D)"],
          note: "por que o 'I' é separado — é o que se relaxa na prática",
          summary:
            "A propriedade que define quanto uma transação enxerga e sofre das outras que rodam ao mesmo tempo — do " +
            "ideal de parecerem executadas uma depois da outra aos níveis mais frouxos que os bancos usam por padrão.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Isolamento é o \"I\" do ACID: o que acontece quando duas transações rodam ao mesmo tempo sobre os mesmos " +
                "dados. O ideal, chamado serializável, é que o resultado seja igual ao de alguma execução em fila, uma " +
                "depois da outra. Garantir isso custa espera ou transações abortadas, e por isso os bancos oferecem " +
                "níveis mais frouxos, e costumam usar um deles por padrão. Para implementar o isolamento, os bancos usam " +
                "bloqueios (quem escreve impede os outros de mexer) e versões (MVCC: cada transação lê uma \"foto\" dos " +
                "dados, sem bloquear quem escreve).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O isolamento é a letra do ACID que os bancos relaxam por padrão: quem escreve código que lê um dado para " +
                "decidir uma escrita precisa saber qual nível está em uso, e o que ele deixa passar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Os problemas de isolamento não aparecem em testes com um usuário só; aparecem em produção, com carga, " +
                "como números que não fecham. O mais comum é a atualização perdida (lost update): duas execuções leem o " +
                "mesmo valor, calculam um novo e gravam, e a segunda apaga o trabalho da primeira.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "snapshot.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "import { rmSync } from \"node:fs\";",
                "",
                "const file = \"./isolation-demo.db\";",
                "for (const suffix of [\"\", \"-wal\", \"-shm\"]) rmSync(file + suffix, { force: true });",
                "const a = new DatabaseSync(file);   // duas conexões ao mesmo banco,",
                "a.exec(\"PRAGMA journal_mode = WAL\");",
                "a.exec(\"CREATE TABLE products (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL)\");",
                "a.exec(\"INSERT INTO products VALUES (1, 10)\");",
                "const b = new DatabaseSync(file);   // como dois usuários",
                "",
                "a.exec(\"BEGIN\");",
                "a.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 10 } — A tira a sua \"foto\"",
                "",
                "b.exec(\"UPDATE products SET stock = 7 WHERE id = 1\");          // B muda e confirma",
                "",
                "a.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 10 } — A continua vendo a foto",
                "try { a.exec(\"UPDATE products SET stock = stock - 1 WHERE id = 1\"); }",
                "catch (error) { error.message; }                              // \"database is locked\": a foto de A ficou velha",
                "a.exec(\"ROLLBACK\");",
                "",
                "a.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 7 } — nova transação, nova foto",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O SQLite oferece o nível mais forte: a transação de A lê sempre a mesma versão dos dados e não pode " +
                "escrever por cima de uma mudança que não viu — ela precisa recomeçar. Outros bancos, com o nível padrão " +
                "mais frouxo, deixariam essa escrita passar.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Ler um valor, calcular na aplicação e gravar o resultado em comandos separados perde atualizações sob concorrência; prefira `UPDATE ... SET stock = stock - 1`, que lê e escreve no mesmo passo.",
                "O nível padrão varia: Read Committed no PostgreSQL, Repeatable Read no MySQL (InnoDB), Serializable no SQLite. Código correto em um banco pode não ser em outro.",
                "Níveis mais fortes não eliminam o problema de graça: eles fazem transações esperarem ou falharem, e a aplicação precisa tentar de novo.",
                "Transações de leitura longas também têm custo: em bancos com MVCC, elas obrigam o banco a guardar versões antigas das linhas enquanto estiverem abertas.",
              ],
            },
          ],
          examples: [
            {
              title: "A atualização perdida",
              context: "Ler, calcular e gravar em comandos separados deixa uma janela entre a leitura e a escrita.",
              code: {
                language: "javascript",
                filename: "lost-update.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "import { rmSync } from \"node:fs\";",
                  "",
                  "rmSync(\"./shop.db\", { force: true });",
                  "const a = new DatabaseSync(\"./shop.db\");",
                  "a.exec(\"CREATE TABLE products (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL)\");",
                  "a.exec(\"INSERT INTO products VALUES (1, 10)\");",
                  "const b = new DatabaseSync(\"./shop.db\");",
                  "",
                  "// Duas vendas simultâneas, cada comando confirmado sozinho (sem transação)",
                  "const stockA = a.prepare(\"SELECT stock FROM products WHERE id = 1\").get().stock;   // 10",
                  "const stockB = b.prepare(\"SELECT stock FROM products WHERE id = 1\").get().stock;   // 10",
                  "a.prepare(\"UPDATE products SET stock = ? WHERE id = 1\").run(stockA - 1);            // grava 9",
                  "b.prepare(\"UPDATE products SET stock = ? WHERE id = 1\").run(stockB - 1);            // grava 9 por cima",
                  "",
                  "a.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 9 } — duas vendas, uma baixa",
                  "",
                  "// Correção: o banco lê e escreve no mesmo comando, e a condição impede estoque negativo",
                  "const sell = (db) => db.prepare(\"UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0\").run().changes === 1;",
                  "sell(a);",
                  "sell(b);",
                  "a.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 7 }",
                ].join("\n"),
              },
              explanation:
                "As duas vendas calcularam o novo valor a partir do mesmo estoque, e a segunda apagou a primeira. Com " +
                "`stock = stock - 1`, a leitura e a escrita são um passo só dentro do banco, e nenhuma venda se perde; " +
                "`changes` diz se a venda aconteceu.",
            },
            {
              title: "Bloqueios ou versões",
              context: "As duas formas de isolar transações têm custos diferentes.",
              code: {
                language: "text",
                filename: "locks-vs-mvcc.txt",
                code: [
                  "Bloqueios (locking)",
                  "  Quem lê ou escreve uma linha a bloqueia; os outros esperam.",
                  "  + simples de entender          - leitores e escritores se bloqueiam; risco de deadlock",
                  "",
                  "Versões (MVCC — PostgreSQL, MySQL/InnoDB, Oracle, SQLite em modo WAL)",
                  "  Cada escrita cria uma nova versão da linha; cada transação lê a versão que valia",
                  "  no seu início (ou no início de cada comando, conforme o nível).",
                  "  + leitores não bloqueiam escritores, nem o contrário",
                  "  - versões antigas ocupam espaço até ninguém mais precisar delas (VACUUM no PostgreSQL)",
                  "  - duas escritas na mesma linha ainda precisam de bloqueio entre si",
                  "",
                  "Na prática, os bancos combinam as duas coisas: MVCC para leituras, bloqueios para escritas.",
                ].join("\n"),
              },
              explanation:
                "Saber qual mecanismo o banco usa explica o comportamento: com MVCC, um relatório longo não trava as " +
                "vendas, mas uma transação esquecida aberta impede a limpeza das versões antigas.",
            },
            {
              title: "A transação esquecida aberta",
              context:
                "Uma conexão que abriu uma transação e não terminou continua segurando a sua foto e os seus bloqueios.",
              code: {
                language: "javascript",
                filename: "idle-transaction.js",
                code: [
                  "// Um trecho que retorna cedo sem COMMIT nem ROLLBACK",
                  "function markAsSeen(db, notificationId) {",
                  "  db.exec(\"BEGIN\");",
                  "  const row = db.prepare(\"SELECT id, seen FROM notifications WHERE id = ?\").get(notificationId);",
                  "  if (!row || row.seen) return;   // a transação fica aberta, na conexão, até alguém a encerrar",
                  "  db.prepare(\"UPDATE notifications SET seen = 1 WHERE id = ?\").run(notificationId);",
                  "  db.exec(\"COMMIT\");",
                  "}",
                  "",
                  "// No PostgreSQL, essas conexões aparecem como \"idle in transaction\":",
                  "//   SELECT pid, state, now() - xact_start AS aberta_ha FROM pg_stat_activity WHERE state = 'idle in transaction';",
                  "// e um limite de tempo encerra as esquecidas:",
                  "//   SET idle_in_transaction_session_timeout = '30s';",
                ].join("\n"),
              },
              explanation:
                "O `return` antecipado deixa a transação aberta. Enquanto ela existir, o banco guarda as versões que ela " +
                "ainda pode ler, e as outras transações esperam pelos bloqueios que ela tem. Uma função como " +
                "`withTransaction`, que sempre termina a transação, evita o problema.",
            },
          ],
          exercise: {
            problem:
              "O endpoint de curtidas lê o contador, soma um na aplicação e grava o resultado. Em uma postagem que " +
              "viralizou, o contador mostra bem menos curtidas do que as linhas registradas na tabela de curtidas.",
            problemCode: {
              language: "javascript",
              filename: "likes.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "import { rmSync } from \"node:fs\";",
                "",
                "rmSync(\"./likes.db\", { force: true });",
                "const setup = new DatabaseSync(\"./likes.db\");",
                "setup.exec(`",
                "  CREATE TABLE posts (id INTEGER PRIMARY KEY, like_count INTEGER NOT NULL DEFAULT 0);",
                "  CREATE TABLE likes (post_id INTEGER NOT NULL, user_id INTEGER NOT NULL, PRIMARY KEY (post_id, user_id));",
                "  INSERT INTO posts (id) VALUES (1);",
                "`);",
                "",
                "function like(db, postId, userId) {",
                "  db.prepare(\"INSERT INTO likes (post_id, user_id) VALUES (?, ?)\").run(postId, userId);",
                "  const { like_count } = db.prepare(\"SELECT like_count FROM posts WHERE id = ?\").get(postId);",
                "  db.prepare(\"UPDATE posts SET like_count = ? WHERE id = ?\").run(like_count + 1, postId);",
                "}",
              ].join("\n"),
            },
            task:
              "Reproduza a perda com duas conexões intercalando a leitura e a escrita, e corrija `like` para que o " +
              "contador nunca perca uma curtida, com a curtida e o contador gravados juntos.",
            hint:
              "Deixe o banco fazer a soma (`like_count = like_count + 1`) e coloque as duas escritas em uma transação.",
            solution: {
              code: {
                language: "javascript",
                filename: "likes.fixed.js",
                code: [
                  "function like(db, postId, userId) {",
                  "  db.exec(\"BEGIN\");",
                  "  try {",
                  "    db.prepare(\"INSERT INTO likes (post_id, user_id) VALUES (?, ?)\").run(postId, userId);",
                  "    db.prepare(\"UPDATE posts SET like_count = like_count + 1 WHERE id = ?\").run(postId);   // lê e soma no mesmo passo",
                  "    db.exec(\"COMMIT\");",
                  "  } catch (error) {",
                  "    db.exec(\"ROLLBACK\");",
                  "    throw error;",
                  "  }",
                  "}",
                  "",
                  "// Reprodução do problema antigo: duas conexões leem 0 e gravam 1",
                  "const a = new DatabaseSync(\"./likes.db\");",
                  "const b = new DatabaseSync(\"./likes.db\");",
                  "const readA = a.prepare(\"SELECT like_count FROM posts WHERE id = 1\").get().like_count;   // 0",
                  "const readB = b.prepare(\"SELECT like_count FROM posts WHERE id = 1\").get().like_count;   // 0",
                  "a.prepare(\"UPDATE posts SET like_count = ? WHERE id = 1\").run(readA + 1);",
                  "b.prepare(\"UPDATE posts SET like_count = ? WHERE id = 1\").run(readB + 1);",
                  "a.prepare(\"SELECT like_count FROM posts WHERE id = 1\").get();   // { like_count: 1 } — duas curtidas, contador 1",
                  "",
                  "// Com a correção, cada curtida soma de verdade",
                  "a.exec(\"UPDATE posts SET like_count = 0\");",
                  "like(a, 1, 10);",
                  "like(b, 1, 20);",
                  "a.prepare(\"SELECT like_count FROM posts WHERE id = 1\").get();   // { like_count: 2 }",
                ].join("\n"),
              },
              explanation:
                "A leitura na aplicação criava uma janela em que outra curtida podia gravar o mesmo valor. Com a soma " +
                "feita pelo banco, cada `UPDATE` parte do valor atual, qualquer que seja o nível de isolamento. A " +
                "transação garante que a curtida e o contador não se separam.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Isolation Levels",
          requires: ["Isolation"],
          note: "Read Uncommitted → Serializable; trade-off com throughput",
          summary:
            "Os quatro níveis de isolamento do padrão SQL — Read Uncommitted, Read Committed, Repeatable Read e " +
            "Serializable —, cada um permitindo menos interferência entre transações, em troca de mais espera ou de " +
            "mais transações abortadas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O padrão SQL define quatro níveis de isolamento, do mais frouxo ao mais forte. Cada nível é definido " +
                "pelas anomalias que ele impede, e os bancos podem oferecer mais do que o mínimo pedido. O nível pode ser " +
                "escolhido para o banco inteiro ou para cada transação, o que permite usar um nível forte só onde ele é " +
                "necessário.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Escolha o nível pela pergunta que a transação faz: o padrão do banco serve para a maioria das operações, " +
                "e o Serializable fica para as que leem dados para decidir uma escrita — com a aplicação pronta para " +
                "repetir a transação quando o banco a recusar.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "list",
              items: [
                "Read Uncommitted — pode ler o que outra transação escreveu e ainda não confirmou. No PostgreSQL, ele se comporta como Read Committed.",
                "Read Committed — cada comando vê só o que já foi confirmado antes de ele começar; dois comandos da mesma transação podem ver dados diferentes. É o padrão do PostgreSQL e do SQL Server.",
                "Repeatable Read — a transação inteira vê os dados como estavam no seu primeiro comando. É o padrão do MySQL (InnoDB). No PostgreSQL, uma escrita sobre uma linha alterada por outra transação confirmada faz esta falhar.",
                "Serializable — o resultado é igual ao de alguma execução em fila. No PostgreSQL, o banco detecta as combinações perigosas e aborta uma das transações, que precisa ser repetida.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "serializable-retry.js",
              code: [
                "import pg from \"pg\";",
                "const pool = new pg.Pool();",
                "",
                "// Executa `work` em uma transação Serializable, repetindo quando o banco a aborta por conflito.",
                "async function withSerializable(work, { attempts = 5 } = {}) {",
                "  for (let attempt = 1; ; attempt++) {",
                "    const client = await pool.connect();",
                "    try {",
                "      await client.query(\"BEGIN ISOLATION LEVEL SERIALIZABLE\");",
                "      const result = await work(client);",
                "      await client.query(\"COMMIT\");",
                "      return result;",
                "    } catch (error) {",
                "      await client.query(\"ROLLBACK\");",
                "      // 40001 = serialization_failure: nada foi gravado, e a transação pode ser refeita do zero",
                "      if (error.code !== \"40001\" || attempt === attempts) throw error;",
                "    } finally {",
                "      client.release();",
                "    }",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A repetição precisa refazer a transação inteira, inclusive as leituras: a decisão tomada na tentativa " +
                "anterior foi baseada em dados que mudaram. Por isso `work` recebe o cliente e executa tudo de novo a " +
                "cada tentativa.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Read Committed (o padrão do PostgreSQL) para a maior parte das escritas simples, sobretudo quando o próprio comando lê e escreve (`SET stock = stock - 1`).",
                "Repeatable Read para relatórios e exportações que fazem várias consultas e precisam de números coerentes entre elas.",
                "Serializable quando a transação lê um conjunto de linhas para decidir uma escrita, e duas execuções simultâneas poderiam, juntas, quebrar uma regra.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Serializable sem código de repetição transforma conflitos em erros para o usuário; ele só funciona junto com o `retry`.",
                "O mesmo nome não garante o mesmo comportamento: o Repeatable Read do MySQL e o do PostgreSQL diferem em como tratam escritas concorrentes.",
                "Níveis fortes em transações longas e muito disputadas aumentam as esperas e as repetições; às vezes um lock explícito em uma linha resolve com menos custo.",
              ],
            },
          ],
          examples: [
            {
              title: "Write skew: o que só o Serializable impede",
              context: "Duas transações leem o mesmo conjunto, decidem a partir dele e escrevem em linhas diferentes.",
              code: {
                language: "text",
                filename: "write-skew.txt",
                code: [
                  "Regra: pelo menos um médico de plantão. Ana e Bruno estão de plantão.",
                  "",
                  "Sessão 1 (Ana)                                Sessão 2 (Bruno)",
                  "BEGIN ISOLATION LEVEL REPEATABLE READ;        BEGIN ISOLATION LEVEL REPEATABLE READ;",
                  "SELECT count(*) FROM doctors                  SELECT count(*) FROM doctors",
                  "  WHERE on_call;          -- 2                  WHERE on_call;          -- 2",
                  "UPDATE doctors SET on_call = false            UPDATE doctors SET on_call = false",
                  "  WHERE name = 'Ana';                           WHERE name = 'Bruno';",
                  "COMMIT;                   -- ok               COMMIT;                   -- ok",
                  "",
                  "Resultado: ninguém de plantão. Cada um mudou uma linha diferente, e nenhuma escrita",
                  "conflitou com a outra; o problema está na decisão tomada a partir de uma leitura.",
                  "",
                  "Com SERIALIZABLE no PostgreSQL, o segundo COMMIT falha com",
                  "  ERROR: could not serialize access due to read/write dependencies among transactions",
                  "e, ao ser repetida, a transação de Bruno vê só um médico de plantão e desiste.",
                ].join("\n"),
              },
              explanation:
                "Nem Read Committed nem Repeatable Read impedem esse caso, porque não há duas escritas na mesma linha. O " +
                "Serializable acompanha o que cada transação leu, e é por isso que ele é o nível certo para regras que " +
                "envolvem várias linhas.",
            },
            {
              title: "Um relatório coerente com Repeatable Read",
              context: "Em Read Committed, cada consulta vê o banco em um momento diferente.",
              code: {
                language: "javascript",
                filename: "report.js",
                code: [
                  "async function monthlyReport(pool, month) {",
                  "  const client = await pool.connect();",
                  "  try {",
                  "    // A transação inteira lê a mesma foto dos dados; READ ONLY deixa claro que nada será escrito",
                  "    await client.query(\"BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY\");",
                  "    const { rows: [summary] } = await client.query(",
                  "      \"SELECT count(*) AS orders, sum(total_cents) AS revenue FROM orders WHERE date_trunc('month', placed_at) = $1\",",
                  "      [month]",
                  "    );",
                  "    const { rows: byProduct } = await client.query(",
                  "      \"SELECT product_id, sum(total_cents) AS revenue FROM orders WHERE date_trunc('month', placed_at) = $1 GROUP BY product_id\",",
                  "      [month]",
                  "    );",
                  "    await client.query(\"COMMIT\");",
                  "    return { summary, byProduct };   // a soma de byProduct bate com summary.revenue",
                  "  } catch (error) {",
                  "    await client.query(\"ROLLBACK\");",
                  "    throw error;",
                  "  } finally {",
                  "    client.release();",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Sem a transação, um pedido gravado entre as duas consultas entraria em uma e não na outra, e o total não " +
                "bateria com a soma por produto. Transações só de leitura em Repeatable Read não entram em conflito de " +
                "escrita, e por isso não precisam de repetição.",
            },
            {
              title: "O nível é escolhido por transação",
              context: "O padrão do banco vale para tudo; o nível forte fica onde é preciso.",
              code: {
                language: "javascript",
                filename: "per-transaction.js",
                code: [
                  "// O padrão do banco (Read Committed) para a operação comum",
                  "await client.query(\"BEGIN\");",
                  "await client.query(\"UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0\", [productId]);",
                  "await client.query(\"COMMIT\");",
                  "",
                  "// Serializable só para a operação que decide com base em várias linhas (com retry)",
                  "await withSerializable(async (tx) => {",
                  "  const { rows: [{ count }] } = await tx.query(\"SELECT count(*) FROM doctors WHERE on_call\");",
                  "  if (Number(count) < 2) throw new Error(\"é preciso manter alguém de plantão\");",
                  "  await tx.query(\"UPDATE doctors SET on_call = false WHERE id = $1\", [doctorId]);",
                  "});",
                  "",
                  "// Para conferir o padrão em uso:  SHOW default_transaction_isolation;",
                ].join("\n"),
              },
              explanation:
                "Subir o nível do banco inteiro para Serializable obrigaria todo o código a lidar com repetições. " +
                "Escolher por transação concentra esse custo nas poucas operações que precisam dele.",
            },
          ],
          exercise: {
            problem:
              "O painel financeiro mostra o total de vendas do dia e, logo abaixo, as vendas por loja. Em dias " +
              "movimentados, a soma das lojas não bate com o total. As duas consultas rodam em sequência, com o nível " +
              "padrão do PostgreSQL.",
            problemCode: {
              language: "javascript",
              filename: "dashboard.js",
              code: [
                "import pg from \"pg\";",
                "const pool = new pg.Pool();",
                "",
                "async function dailyDashboard(day) {",
                "  const total = await pool.query(\"SELECT sum(total_cents) AS revenue FROM sales WHERE sold_on = $1\", [day]);",
                "  const byStore = await pool.query(",
                "    \"SELECT store_id, sum(total_cents) AS revenue FROM sales WHERE sold_on = $1 GROUP BY store_id\",",
                "    [day]",
                "  );",
                "  return { total: total.rows[0], byStore: byStore.rows };",
                "}",
              ].join("\n"),
            },
            task:
              "Explique por que os números divergem e reescreva `dailyDashboard` para que as duas consultas vejam os " +
              "mesmos dados, sem bloquear as vendas que continuam chegando.",
            hint:
              "`pool.query` pode usar uma conexão diferente a cada chamada, e cada consulta é uma transação própria. " +
              "Use um único cliente e uma transação Repeatable Read, só de leitura.",
            solution: {
              code: {
                language: "javascript",
                filename: "dashboard.fixed.js",
                code: [
                  "async function dailyDashboard(day) {",
                  "  const client = await pool.connect();   // uma conexão só, para a transação inteira",
                  "  try {",
                  "    await client.query(\"BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY\");",
                  "    const total = await client.query(\"SELECT sum(total_cents) AS revenue FROM sales WHERE sold_on = $1\", [day]);",
                  "    const byStore = await client.query(",
                  "      \"SELECT store_id, sum(total_cents) AS revenue FROM sales WHERE sold_on = $1 GROUP BY store_id\",",
                  "      [day]",
                  "    );",
                  "    await client.query(\"COMMIT\");",
                  "    return { total: total.rows[0], byStore: byStore.rows };",
                  "  } catch (error) {",
                  "    await client.query(\"ROLLBACK\");",
                  "    throw error;",
                  "  } finally {",
                  "    client.release();",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Em Read Committed, cada consulta vê as vendas confirmadas até o seu próprio início, e uma venda gravada " +
                "entre as duas entra só na segunda. Em Repeatable Read, as duas leem a mesma foto. Como o PostgreSQL usa " +
                "versões, a leitura não bloqueia as vendas novas, que simplesmente não aparecem nesta foto.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Read Phenomena (Dirty / Non-Repeatable / Phantom)",
          requires: ["Isolation Levels"],
          subtopics: ["dirty read", "non-repeatable read", "phantom read", "matriz 'qual nível previne qual'"],
          note: "consolidada (A6)",
          summary:
            "As três anomalias de leitura que definem os níveis de isolamento: ler o que outra transação ainda não " +
            "confirmou (dirty read), ler a mesma linha duas vezes e obter valores diferentes (non-repeatable read) e " +
            "repetir uma consulta e encontrar linhas novas (phantom read).",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Os fenômenos de leitura são os tipos de interferência que uma transação pode sofrer ao ler dados que " +
                "outras estão mudando. O padrão SQL define cada nível de isolamento pelos fenômenos que ele impede. Dirty " +
                "read: ler um valor que outra transação escreveu e ainda pode desfazer. Non-repeatable read: ler a mesma " +
                "linha duas vezes, na mesma transação, e obter valores diferentes, porque outra transação a alterou e " +
                "confirmou no meio. Phantom read: repetir uma consulta com uma condição e encontrar linhas que não " +
                "estavam lá, porque outra transação inseriu ou apagou linhas que atendem à condição.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Cada fenômeno é uma pergunta sobre a mesma transação: posso ver o que não foi confirmado? A mesma linha " +
                "pode mudar? O mesmo conjunto pode ganhar ou perder linhas? O nível de isolamento escolhido responde a " +
                "cada uma.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Saber o nome do fenômeno ajuda a escolher o nível mínimo que resolve um problema, sem subir para o mais " +
                "caro. A matriz do padrão diz o que cada nível impede, no mínimo:",
            },
            {
              type: "code",
              language: "text",
              filename: "matrix.txt",
              code: [
                "                     Dirty read   Non-repeatable read   Phantom read",
                "Read Uncommitted     possível     possível              possível",
                "Read Committed       impedido     possível              possível",
                "Repeatable Read      impedido     impedido              possível (*)",
                "Serializable         impedido     impedido              impedido",
                "",
                "(*) O padrão permite; no PostgreSQL, o Repeatable Read também impede phantom reads,",
                "    porque a transação inteira lê a mesma foto dos dados.",
              ].join("\n"),
            },
            { type: "heading", text: "Na prática" },
            {
              type: "code",
              language: "javascript",
              filename: "no-dirty-read.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "import { rmSync } from \"node:fs\";",
                "",
                "for (const suffix of [\"\", \"-wal\", \"-shm\"]) rmSync(\"./phenomena.db\" + suffix, { force: true });",
                "const a = new DatabaseSync(\"./phenomena.db\");",
                "a.exec(\"PRAGMA journal_mode = WAL\");",
                "a.exec(\"CREATE TABLE accounts_payable (id INTEGER PRIMARY KEY, amount_cents INTEGER NOT NULL)\");",
                "a.exec(\"INSERT INTO accounts_payable VALUES (1, 5000)\");",
                "const b = new DatabaseSync(\"./phenomena.db\");",
                "",
                "a.exec(\"BEGIN\");",
                "a.exec(\"UPDATE accounts_payable SET amount_cents = 999999 WHERE id = 1\");   // ainda não confirmado",
                "",
                "b.prepare(\"SELECT amount_cents FROM accounts_payable WHERE id = 1\").get();   // { amount_cents: 5000 } — sem dirty read",
                "",
                "a.exec(\"ROLLBACK\");   // o valor 999999 nunca existiu, e ninguém chegou a vê-lo",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Se a sessão B tivesse lido 999999 e agido com base nisso — pagado a conta, por exemplo —, teria agido " +
                "sobre um valor que foi desfeito. Por isso quase nenhum banco usa, na prática, um nível que permita dirty " +
                "reads.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A matriz do padrão é o mínimo: bancos diferentes impedem mais do que ela exige em alguns níveis, e o mesmo código pode se comportar de forma diferente em cada um.",
                "Os três fenômenos não cobrem tudo: a atualização perdida e o write skew acontecem mesmo sem nenhum deles, e só um nível mais forte ou um lock os resolve.",
                "Um phantom não é só uma linha nova: uma linha apagada ou alterada para deixar de atender à condição também muda o resultado da consulta repetida.",
                "Fenômenos só aparecem com transações simultâneas; testes com um usuário não os reproduzem, e é preciso intercalar duas conexões de propósito.",
              ],
            },
          ],
          examples: [
            {
              title: "Non-repeatable read em Read Committed",
              context: "A mesma linha, lida duas vezes, muda no meio da transação.",
              code: {
                language: "text",
                filename: "non-repeatable.txt",
                code: [
                  "PostgreSQL, nível padrão (Read Committed). Preço do produto 1: 100.",
                  "",
                  "Sessão 1 (fechamento do carrinho)             Sessão 2 (equipe de preços)",
                  "BEGIN;",
                  "SELECT price FROM products WHERE id = 1;",
                  "  -- 100: mostra o total ao cliente",
                  "                                              BEGIN;",
                  "                                              UPDATE products SET price = 120 WHERE id = 1;",
                  "                                              COMMIT;",
                  "SELECT price FROM products WHERE id = 1;",
                  "  -- 120: cobra um valor diferente do mostrado",
                  "COMMIT;",
                  "",
                  "Em REPEATABLE READ, a segunda leitura também devolveria 100.",
                ].join("\n"),
              },
              explanation:
                "A sessão 1 fez duas leituras na mesma transação e recebeu respostas diferentes. O problema real é o " +
                "valor mostrado não ser o cobrado; ler o preço uma vez só e guardá-lo no pedido, ou usar Repeatable Read, " +
                "resolve.",
            },
            {
              title: "Phantom read: o conjunto que ganha uma linha",
              context: "A mesma consulta com condição, repetida, devolve linhas diferentes.",
              code: {
                language: "text",
                filename: "phantom.txt",
                code: [
                  "Sessão 1 (relatório)                          Sessão 2 (loja)",
                  "BEGIN;  -- Read Committed",
                  "SELECT count(*) FROM orders",
                  "  WHERE status = 'pending';     -- 3",
                  "                                              INSERT INTO orders (status) VALUES ('pending');",
                  "                                              COMMIT;",
                  "SELECT id, total_cents FROM orders",
                  "  WHERE status = 'pending';     -- 4 linhas",
                  "COMMIT;",
                  "",
                  "O relatório diz \"3 pedidos pendentes\" e lista 4. A linha nova é o \"fantasma\".",
                ].join("\n"),
              },
              explanation:
                "Nenhuma linha lida antes mudou; o que mudou foi o conjunto que atende à condição. Locks de linha não " +
                "impedem isso, porque a linha nova não existia para ser bloqueada: é preciso um nível que leia uma foto " +
                "só, ou o Serializable.",
            },
            {
              title: "Reproduzir de propósito, com duas conexões",
              context: "Um teste que intercala duas sessões mostra o fenômeno de forma repetível.",
              code: {
                language: "javascript",
                filename: "reproduce.test.js",
                code: [
                  "import { test } from \"node:test\";",
                  "import assert from \"node:assert/strict\";",
                  "import pg from \"pg\";",
                  "",
                  "test(\"Repeatable Read não enxerga o pedido inserido no meio da transação\", async () => {",
                  "  const pool = new pg.Pool();",
                  "  const report = await pool.connect();",
                  "  const shop = await pool.connect();",
                  "  try {",
                  "    await report.query(\"BEGIN ISOLATION LEVEL REPEATABLE READ\");",
                  "    const before = await report.query(\"SELECT count(*)::int AS n FROM orders WHERE status = 'pending'\");",
                  "",
                  "    await shop.query(\"INSERT INTO orders (status) VALUES ('pending')\");   // autocommit",
                  "",
                  "    const after = await report.query(\"SELECT count(*)::int AS n FROM orders WHERE status = 'pending'\");",
                  "    assert.equal(after.rows[0].n, before.rows[0].n);   // em Read Committed, este teste falharia",
                  "    await report.query(\"COMMIT\");",
                  "  } finally {",
                  "    report.release();",
                  "    shop.release();",
                  "    await pool.end();",
                  "  }",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Duas conexões controladas pelo teste deixam escolher exatamente em que ponto a segunda sessão age. " +
                "Trocar o nível para Read Committed faz o teste falhar, o que demonstra o phantom e documenta a decisão.",
            },
          ],
          exercise: {
            problem:
              "Três incidentes chegaram ao time de dados. Para cada um, é preciso dizer qual fenômeno aconteceu e qual " +
              "o nível de isolamento mínimo, segundo o padrão SQL, que o impediria.",
            problemCode: {
              language: "javascript",
              filename: "incidents.js",
              code: [
                "const incidents = [",
                "  {",
                "    id: \"A\",",
                "    what: \"O job de cobrança leu o valor de uma fatura que outra transação estava ajustando; o ajuste foi desfeito, mas a cobrança saiu com o valor ajustado.\",",
                "  },",
                "  {",
                "    id: \"B\",",
                "    what: \"A tela de conferência lê o saldo de uma conta no início e de novo no fim da mesma transação, e os dois valores não batem, porque um depósito foi confirmado no meio.\",",
                "  },",
                "  {",
                "    id: \"C\",",
                "    what: \"A exportação conta as matrículas do curso e depois lista as matrículas; a lista tem uma linha a mais do que a contagem.\",",
                "  },",
                "];",
              ].join("\n"),
            },
            task:
              "Complete um objeto com, para cada incidente, o fenômeno e o nível mínimo do padrão que o impede. Diga " +
              "também se, no PostgreSQL, algum nível mais baixo já resolveria.",
            hint:
              "Valor não confirmado → dirty read. Mesma linha com valor diferente → non-repeatable read. Conjunto com " +
              "linhas a mais ou a menos → phantom read.",
            solution: {
              code: {
                language: "javascript",
                filename: "incidents.answer.js",
                code: [
                  "const answers = {",
                  "  A: { phenomenon: \"dirty read\", minimumLevel: \"Read Committed\",",
                  "       postgres: \"Nunca acontece: o PostgreSQL não oferece dirty reads em nenhum nível.\" },",
                  "  B: { phenomenon: \"non-repeatable read\", minimumLevel: \"Repeatable Read\",",
                  "       postgres: \"Repeatable Read.\" },",
                  "  C: { phenomenon: \"phantom read\", minimumLevel: \"Serializable\",",
                  "       postgres: \"Repeatable Read já basta: a transação lê uma foto só, e a linha nova não aparece.\" },",
                  "};",
                ].join("\n"),
              },
              explanation:
                "O padrão só exige que o Serializable impeça phantoms, mas o PostgreSQL já os impede no Repeatable Read, " +
                "por usar uma foto por transação. Conhecer o comportamento real do banco evita pagar pelo nível mais " +
                "forte sem necessidade.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Optimistic Locking",
          requires: ["Isolation"],
          note: "versão/timestamp, retry em conflito — revisita Programming Foundations / Concurrency / Race Condition",
          revisit: ["Programming Foundations / Concurrency / Race Condition"],
          summary:
            "Detectar, na hora de gravar, que outra pessoa mudou o registro desde que ele foi lido — com uma coluna " +
            "de versão conferida no `UPDATE` —, em vez de bloquear o registro durante toda a edição.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O lock otimista parte da suposição de que conflitos são raros: ninguém bloqueia nada enquanto lê ou " +
                "edita. Cada linha tem uma versão (um número que sobe a cada alteração). Quem vai gravar diz qual versão " +
                "leu, e o `UPDATE` só acontece se a versão ainda for aquela. Se outra escrita chegou antes, nenhuma linha " +
                "é alterada, e a aplicação sabe que houve conflito. É a solução para a condição de corrida em que duas " +
                "pessoas editam o mesmo registro e a última a salvar apaga o trabalho da outra.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O `UPDATE ... WHERE id = ? AND version = ?` transforma uma escrita cega em uma escrita condicional: ou " +
                "ela parte da versão que a pessoa viu, ou não acontece, e o conflito vira uma decisão explícita.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "optimistic.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE documents (id INTEGER PRIMARY KEY, body TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1);",
                "  INSERT INTO documents (id, body) VALUES (1, 'Rascunho');",
                "`);",
                "",
                "class ConflictError extends Error {}",
                "",
                "function saveDocument(id, body, expectedVersion) {",
                "  const result = db",
                "    .prepare(\"UPDATE documents SET body = ?, version = version + 1 WHERE id = ? AND version = ?\")",
                "    .run(body, id, expectedVersion);",
                "  if (result.changes === 0) throw new ConflictError(\"o documento foi alterado por outra pessoa\");",
                "  return expectedVersion + 1;",
                "}",
                "",
                "// Ana e Bruno abrem o documento na versão 1",
                "const seenByAna = db.prepare(\"SELECT body, version FROM documents WHERE id = 1\").get();     // version 1",
                "const seenByBruno = db.prepare(\"SELECT body, version FROM documents WHERE id = 1\").get();   // version 1",
                "",
                "saveDocument(1, \"Texto da Ana\", seenByAna.version);   // ok: versão 2",
                "try { saveDocument(1, \"Texto do Bruno\", seenByBruno.version); }",
                "catch (error) { error instanceof ConflictError; }     // true — o texto da Ana não foi apagado",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A verificação e a escrita acontecem no mesmo comando, dentro do banco, e por isso não há janela entre " +
                "elas. Um `SELECT` para conferir a versão antes do `UPDATE` recriaria a condição de corrida.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Edições feitas por pessoas, em que entre ler e salvar passam segundos ou minutos, e bloquear o registro todo esse tempo seria inviável.",
                "Quando conflitos são raros e mostrar \"alguém alterou isto\" é aceitável, como em cadastros, documentos e configurações.",
                "Em APIs HTTP, junto com `ETag` e `If-Match`, para que clientes diferentes não sobrescrevam as mudanças uns dos outros.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Com muita disputa pelo mesmo registro, como o estoque de um produto em promoção, a maioria das tentativas falha e é repetida; um `UPDATE` atômico ou um lock pessimista funciona melhor.",
                "Toda escrita precisa respeitar a versão: um caminho que grave sem conferi-la desfaz a proteção sem aviso.",
                "O lock otimista detecta o conflito, mas não o resolve: repetir automaticamente só é seguro quando a operação pode ser refeita sobre o dado novo.",
              ],
            },
          ],
          examples: [
            {
              title: "O conflito vira uma resposta HTTP",
              context: "A versão viaja no `ETag`, e o cliente a devolve em `If-Match`.",
              code: {
                language: "javascript",
                filename: "etag.js",
                code: [
                  "// GET /documents/1  →  200, ETag: \"3\", corpo com o documento",
                  "app.get(\"/documents/:id\", (req, res) => {",
                  "  const doc = db.prepare(\"SELECT id, body, version FROM documents WHERE id = ?\").get(req.params.id);",
                  "  if (!doc) return res.status(404).end();",
                  "  res.set(\"ETag\", `\"${doc.version}\"`).json({ id: doc.id, body: doc.body });",
                  "});",
                  "",
                  "// PUT /documents/1 com If-Match: \"3\"",
                  "app.put(\"/documents/:id\", (req, res) => {",
                  "  const expected = Number(String(req.get(\"If-Match\") || \"\").replaceAll('\"', \"\"));",
                  "  if (!expected) return res.status(428).json({ error: \"envie If-Match com a versão lida\" });   // Precondition Required",
                  "  const result = db",
                  "    .prepare(\"UPDATE documents SET body = ?, version = version + 1 WHERE id = ? AND version = ?\")",
                  "    .run(req.body.body, req.params.id, expected);",
                  "  if (result.changes === 0) return res.status(412).json({ error: \"o documento mudou desde a sua leitura\" });   // Precondition Failed",
                  "  res.set(\"ETag\", `\"${expected + 1}\"`).status(204).end();",
                  "});",
                ].join("\n"),
              },
              explanation:
                "O `412 Precondition Failed` diz ao cliente que a versão dele está velha, e ele pode buscar a atual e " +
                "mostrar a diferença. Exigir o `If-Match` com `428` impede que um cliente desatualizado grave sem " +
                "conferir nada.",
            },
            {
              title: "Repetir sozinho só quando dá para refazer",
              context: "Uma operação calculada pode ser repetida sobre o dado novo; uma edição de texto, não.",
              code: {
                language: "javascript",
                filename: "retry.js",
                code: [
                  "// Somar pontos pode ser refeito: lê de novo, recalcula e tenta outra vez",
                  "function addPoints(customerId, points, attempts = 5) {",
                  "  for (let attempt = 1; attempt <= attempts; attempt++) {",
                  "    const row = db.prepare(\"SELECT points, version FROM loyalty WHERE customer_id = ?\").get(customerId);",
                  "    const result = db",
                  "      .prepare(\"UPDATE loyalty SET points = ?, version = version + 1 WHERE customer_id = ? AND version = ?\")",
                  "      .run(row.points + points, customerId, row.version);",
                  "    if (result.changes === 1) return row.points + points;",
                  "  }",
                  "  throw new Error(\"muita disputa: tente mais tarde\");",
                  "}",
                  "",
                  "// Uma edição de texto não: repetir gravaria o texto antigo da pessoa por cima do novo.",
                  "// O certo é devolver o conflito e deixar a pessoa decidir (mesclar, descartar ou sobrescrever).",
                ].join("\n"),
              },
              explanation:
                "A repetição automática só é correta quando o novo valor é recalculado a partir do dado atual. Quando o " +
                "valor vem de uma decisão humana tomada sobre a versão antiga, só a pessoa pode resolver o conflito.",
            },
            {
              title: "Por que um número, e não a data da alteração",
              context: "Usar `updated_at` como versão parece natural e tem armadilhas.",
              code: {
                language: "text",
                filename: "version-vs-timestamp.txt",
                code: [
                  "Versão inteira                                Data de alteração (updated_at)",
                  "-------------------------------------------   -------------------------------------------",
                  "version = version + 1 a cada escrita          depende do relógio e da precisão da coluna",
                  "duas escritas nunca geram o mesmo valor       duas escritas no mesmo milissegundo (ou no",
                  "                                              mesmo segundo, com precisão menor) geram o",
                  "                                              mesmo valor, e o conflito passa despercebido",
                  "comparação exata e barata                     relógios de servidores diferentes podem",
                  "                                              divergir ou voltar no tempo",
                  "",
                  "A data continua útil para mostrar \"editado há 5 minutos\"; só não deve ser a guarda do conflito.",
                ].join("\n"),
              },
              explanation:
                "A versão inteira muda a cada escrita por definição. A data depende de relógio e de precisão, e em alta " +
                "frequência duas alterações diferentes podem ter a mesma data.",
            },
          ],
          exercise: {
            problem:
              "No painel de administração, dois atendentes editaram o endereço do mesmo cliente quase ao mesmo tempo. O " +
              "segundo a salvar apagou a correção do primeiro, e ninguém foi avisado.",
            problemCode: {
              language: "javascript",
              filename: "customer-edit.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "db.exec(`",
                "  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, address TEXT NOT NULL);",
                "  INSERT INTO customers VALUES (1, 'Ana Souza', 'Rua A, 10');",
                "`);",
                "",
                "function loadCustomer(id) {",
                "  return db.prepare(\"SELECT id, name, address FROM customers WHERE id = ?\").get(id);",
                "}",
                "",
                "function saveCustomer(customer) {",
                "  db.prepare(\"UPDATE customers SET name = ?, address = ? WHERE id = ?\").run(customer.name, customer.address, customer.id);",
                "}",
              ].join("\n"),
            },
            task:
              "Acrescente uma coluna de versão e faça `saveCustomer` recusar a gravação quando o cliente tiver mudado " +
              "desde `loadCustomer`, devolvendo a versão atual para que o atendente possa comparar.",
            hint:
              "Leve a versão lida junto com o cliente, confira-a no `WHERE` do `UPDATE` e olhe `changes`: 0 significa " +
              "conflito.",
            solution: {
              code: {
                language: "javascript",
                filename: "customer-edit.fixed.js",
                code: [
                  "db.exec(\"ALTER TABLE customers ADD COLUMN version INTEGER NOT NULL DEFAULT 1\");",
                  "",
                  "function loadCustomer(id) {",
                  "  return db.prepare(\"SELECT id, name, address, version FROM customers WHERE id = ?\").get(id);",
                  "}",
                  "",
                  "function saveCustomer(customer) {",
                  "  const result = db",
                  "    .prepare(\"UPDATE customers SET name = ?, address = ?, version = version + 1 WHERE id = ? AND version = ?\")",
                  "    .run(customer.name, customer.address, customer.id, customer.version);",
                  "  if (result.changes === 0) return { ok: false, current: loadCustomer(customer.id) };   // conflito: mostra o que mudou",
                  "  return { ok: true, version: customer.version + 1 };",
                  "}",
                  "",
                  "const first = loadCustomer(1);    // atendente 1, versão 1",
                  "const second = loadCustomer(1);   // atendente 2, versão 1",
                  "saveCustomer({ ...first, address: \"Rua A, 10 — apto 2\" });   // { ok: true, version: 2 }",
                  "saveCustomer({ ...second, address: \"Rua B, 5\" });",
                  "// { ok: false, current: { id: 1, name: \"Ana Souza\", address: \"Rua A, 10 — apto 2\", version: 2 } }",
                ].join("\n"),
              },
              explanation:
                "A segunda gravação agora falha em vez de apagar a primeira, e devolve a versão atual para o atendente " +
                "comparar e decidir. Nenhum registro fica bloqueado enquanto os atendentes digitam.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Pessimistic Locking",
          requires: ["Isolation"],
          note: "SELECT … FOR UPDATE, ordem de lock — revisita Programming Foundations / Concurrency / Deadlock",
          revisit: ["Programming Foundations / Concurrency / Deadlock"],
          summary:
            "Bloquear as linhas que se vai alterar no momento da leitura — com `SELECT … FOR UPDATE` —, para que " +
            "nenhuma outra transação as mude até o `COMMIT`: quem chega depois espera, em vez de descobrir o conflito " +
            "ao gravar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O lock pessimista parte da suposição oposta à do otimista: o conflito é provável, então é melhor " +
                "impedi-lo. A transação lê as linhas com `SELECT ... FOR UPDATE`, e o banco as bloqueia: outras " +
                "transações que tentem alterá-las, ou bloqueá-las também, esperam até o `COMMIT` ou o `ROLLBACK`. " +
                "Enquanto isso, a primeira transação decide e grava com a certeza de que os dados não mudam debaixo dela. " +
                "Como qualquer lock, ele traz o risco de deadlock quando duas transações bloqueiam as mesmas linhas em " +
                "ordens diferentes.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Bloqueie só as linhas necessárias, pelo menor tempo possível, e sempre na mesma ordem: o lock pessimista " +
                "troca conflitos por espera, e uma espera mal controlada vira lentidão ou deadlock.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "reserve-stock.js",
              code: [
                "import pg from \"pg\";",
                "const pool = new pg.Pool();",
                "",
                "async function reserve(productId, quantity) {",
                "  const client = await pool.connect();",
                "  try {",
                "    await client.query(\"BEGIN\");",
                "    // Bloqueia a linha do produto: outra reserva do mesmo produto espera aqui",
                "    const { rows: [product] } = await client.query(\"SELECT stock FROM products WHERE id = $1 FOR UPDATE\", [productId]);",
                "    if (!product) throw new Error(\"produto inexistente\");",
                "    if (product.stock < quantity) throw new Error(\"estoque insuficiente\");",
                "    await client.query(\"UPDATE products SET stock = stock - $1 WHERE id = $2\", [quantity, productId]);",
                "    await client.query(\"INSERT INTO reservations (product_id, quantity) VALUES ($1, $2)\", [productId, quantity]);",
                "    await client.query(\"COMMIT\");   // libera o lock",
                "  } catch (error) {",
                "    await client.query(\"ROLLBACK\");   // também libera o lock",
                "    throw error;",
                "  } finally {",
                "    client.release();",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Entre o `SELECT ... FOR UPDATE` e o `COMMIT`, a decisão tomada com o estoque lido continua válida, " +
                "porque ninguém mais pode alterá-lo. Leitores comuns, sem `FOR UPDATE`, continuam lendo normalmente no " +
                "PostgreSQL.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o mesmo registro é muito disputado e as tentativas otimistas falhariam o tempo todo, como o estoque de um produto em promoção.",
                "Quando a decisão depende de ler várias informações antes de escrever, e refazer a operação inteira em caso de conflito seria caro ou impossível.",
                "Em filas de tarefas no banco, com `FOR UPDATE SKIP LOCKED`, para que cada trabalhador pegue uma tarefa diferente.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Nunca durante a interação de uma pessoa: segurar um lock enquanto alguém edita um formulário bloqueia os outros por minutos.",
                "Bloquear em ordens diferentes em transações diferentes causa deadlock; o banco aborta uma delas, e a aplicação precisa estar pronta para repetir.",
                "O lock só vale dentro do banco e da transação; ele não protege nada entre dois serviços nem entre duas requisições HTTP.",
              ],
            },
          ],
          examples: [
            {
              title: "Fila de tarefas com SKIP LOCKED",
              context:
                "Vários trabalhadores pegam tarefas da mesma tabela sem pegar a mesma duas vezes e sem esperar uns pelos " +
                "outros.",
              code: {
                language: "javascript",
                filename: "job-queue.js",
                code: [
                  "async function takeNextJob(client) {",
                  "  await client.query(\"BEGIN\");",
                  "  const { rows: [job] } = await client.query(`",
                  "    SELECT id, payload FROM jobs",
                  "    WHERE status = 'pending'",
                  "    ORDER BY created_at",
                  "    LIMIT 1",
                  "    FOR UPDATE SKIP LOCKED",
                  "  `);   // pula as tarefas que outro trabalhador já bloqueou",
                  "  if (!job) {",
                  "    await client.query(\"COMMIT\");",
                  "    return null;",
                  "  }",
                  "  await client.query(\"UPDATE jobs SET status = 'running', started_at = now() WHERE id = $1\", [job.id]);",
                  "  await client.query(\"COMMIT\");",
                  "  return job;",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Sem `SKIP LOCKED`, todos os trabalhadores esperariam pela mesma primeira tarefa; sem `FOR UPDATE`, dois " +
                "poderiam ler a mesma tarefa como pendente. A transação é curta: ela só marca a tarefa como em execução, " +
                "e o trabalho em si acontece fora dela.",
            },
            {
              title: "Deadlock, e a ordem que o evita",
              context: "Duas transações bloqueiam as mesmas duas linhas em ordens opostas.",
              code: {
                language: "text",
                filename: "deadlock.txt",
                code: [
                  "Reserva do pedido 1: produtos 7 e 3.   Reserva do pedido 2: produtos 3 e 7.",
                  "",
                  "Sessão 1                                      Sessão 2",
                  "BEGIN;                                        BEGIN;",
                  "SELECT ... WHERE id = 7 FOR UPDATE;  -- ok    SELECT ... WHERE id = 3 FOR UPDATE;  -- ok",
                  "SELECT ... WHERE id = 3 FOR UPDATE;           SELECT ... WHERE id = 7 FOR UPDATE;",
                  "  -- espera a sessão 2                          -- espera a sessão 1",
                  "                                              ERROR: deadlock detected   (SQLSTATE 40P01)",
                  "                                              -- o PostgreSQL aborta uma das duas",
                  "",
                  "Correção: bloquear sempre na mesma ordem, em um único comando",
                  "  SELECT id, stock FROM products WHERE id = ANY($1) ORDER BY id FOR UPDATE;",
                ].join("\n"),
              },
              explanation:
                "Cada sessão segura uma linha e espera a outra, o ciclo clássico de deadlock. Com a ordem fixa (pelo id), " +
                "a segunda sessão espera já na primeira linha, e o ciclo não se forma. Mesmo assim, trate o erro `40P01` " +
                "repetindo a transação.",
            },
            {
              title: "No SQLite, o lock é do banco inteiro",
              context:
                "O SQLite não tem `FOR UPDATE`; `BEGIN IMMEDIATE` reserva a escrita no banco todo desde o início.",
              code: {
                language: "javascript",
                filename: "sqlite-immediate.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "import { rmSync } from \"node:fs\";",
                  "",
                  "for (const suffix of [\"\", \"-wal\", \"-shm\"]) rmSync(\"./queue.db\" + suffix, { force: true });",
                  "const a = new DatabaseSync(\"./queue.db\");",
                  "a.exec(\"PRAGMA journal_mode = WAL\");",
                  "a.exec(\"CREATE TABLE products (id INTEGER PRIMARY KEY, stock INTEGER NOT NULL)\");",
                  "a.exec(\"INSERT INTO products VALUES (1, 5)\");",
                  "const b = new DatabaseSync(\"./queue.db\");",
                  "",
                  "a.exec(\"BEGIN IMMEDIATE\");   // A reserva o direito de escrever",
                  "try { b.exec(\"BEGIN IMMEDIATE\"); }",
                  "catch (error) { error.message; }   // \"database is locked\" — B não pode escrever enquanto A não terminar",
                  "",
                  "b.prepare(\"SELECT stock FROM products WHERE id = 1\").get();   // { stock: 5 } — mas B continua lendo",
                  "a.exec(\"UPDATE products SET stock = stock - 1 WHERE id = 1\");",
                  "a.exec(\"COMMIT\");",
                  "b.exec(\"BEGIN IMMEDIATE\");   // agora B consegue",
                  "b.exec(\"COMMIT\");",
                ].join("\n"),
              },
              explanation:
                "Sem locks por linha, o SQLite só permite um escritor por vez no banco inteiro. `BEGIN IMMEDIATE` pega " +
                "esse direito logo no início, o que evita descobrir o conflito no meio da transação. Em aplicações reais, " +
                "um `busy_timeout` faz a segunda conexão esperar em vez de falhar na hora.",
            },
          ],
          exercise: {
            problem:
              "As inscrições de um evento têm limite de 100 vagas. O código conta as inscrições e, se houver vaga, " +
              "insere a nova. Em um lançamento concorrido, o evento terminou com 104 inscritos.",
            problemCode: {
              language: "javascript",
              filename: "register.js",
              code: [
                "import pg from \"pg\";",
                "const pool = new pg.Pool();",
                "",
                "async function register(eventId, userId) {",
                "  const client = await pool.connect();",
                "  try {",
                "    await client.query(\"BEGIN\");",
                "    const { rows: [{ count }] } = await client.query(\"SELECT count(*)::int AS count FROM registrations WHERE event_id = $1\", [eventId]);",
                "    const { rows: [event] } = await client.query(\"SELECT capacity FROM events WHERE id = $1\", [eventId]);",
                "    if (count >= event.capacity) throw new Error(\"evento lotado\");",
                "    await client.query(\"INSERT INTO registrations (event_id, user_id) VALUES ($1, $2)\", [eventId, userId]);",
                "    await client.query(\"COMMIT\");",
                "  } catch (error) {",
                "    await client.query(\"ROLLBACK\");",
                "    throw error;",
                "  } finally {",
                "    client.release();",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Explique por que um `FOR UPDATE` nas inscrições não resolveria, e corrija `register` com um lock " +
              "pessimista que faça as inscrições do mesmo evento acontecerem uma de cada vez.",
            hint:
              "As linhas que causam o problema são as que ainda não existem. Bloqueie uma linha que exista e represente " +
              "o evento inteiro: a do próprio evento.",
            solution: {
              code: {
                language: "javascript",
                filename: "register.fixed.js",
                code: [
                  "async function register(eventId, userId) {",
                  "  const client = await pool.connect();",
                  "  try {",
                  "    await client.query(\"BEGIN\");",
                  "    // A linha do evento funciona como a \"porta\": só uma inscrição por vez passa daqui",
                  "    const { rows: [event] } = await client.query(\"SELECT capacity FROM events WHERE id = $1 FOR UPDATE\", [eventId]);",
                  "    if (!event) throw new Error(\"evento inexistente\");",
                  "    const { rows: [{ count }] } = await client.query(\"SELECT count(*)::int AS count FROM registrations WHERE event_id = $1\", [eventId]);",
                  "    if (count >= event.capacity) throw new Error(\"evento lotado\");",
                  "    await client.query(\"INSERT INTO registrations (event_id, user_id) VALUES ($1, $2)\", [eventId, userId]);",
                  "    await client.query(\"COMMIT\");",
                  "  } catch (error) {",
                  "    await client.query(\"ROLLBACK\");",
                  "    throw error;",
                  "  } finally {",
                  "    client.release();",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Duas transações contavam 99 ao mesmo tempo e inseriam cada uma a sua linha: um phantom, que um lock nas " +
                "inscrições existentes não impede, porque as novas ainda não existiam. Bloquear a linha do evento faz a " +
                "segunda inscrição esperar a primeira terminar e contar de novo, já com 100. Inscrições de eventos " +
                "diferentes continuam em paralelo.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "database-performance",
      order: 70,
      title: "Database Performance",
      requires: ["Database Design"],
      summary:
        "Index (+ selectivity) → composite index → query plan → query optimization → N+1 Query Problem " +
        "(canônico do roadmap) → connection pool → slow query analysis.",
      concepts: [
        concept({
          order: 10,
          title: "Index",
          requires: ["Database Fundamentals / Database Schema"],
          subtopics: ["Index Selectivity — cardinalidade, quando um índice não ajuda"],
          note: "B-tree × hash index — revisita Programming Foundations / Data Structures / BST, Hash Table (absorve o B-Tree só citado antes)",
          revisit: ["Programming Foundations / Data Structures / Binary Search Tree", "Programming Foundations / Data Structures / Hash Table"],
          summary:
            "Uma estrutura auxiliar, mantida pelo banco, que guarda os valores de uma ou mais colunas em ordem e " +
            "aponta para as linhas — para encontrar registros sem ler a tabela inteira, em troca de espaço e de " +
            "escritas mais caras.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Sem índice, encontrar as linhas com um valor exige ler a tabela inteira (uma varredura, ou scan). Um " +
                "índice é uma cópia organizada de uma ou mais colunas, com um ponteiro para cada linha, que o banco " +
                "atualiza a cada escrita. O tipo mais comum é a árvore B (B-tree), parente da árvore binária de busca, " +
                "mas com muitos filhos por nó para caber em páginas de disco: ela mantém os valores em ordem e responde a " +
                "buscas por igualdade, por intervalo e por prefixo, e ainda entrega os dados já ordenados. Há também " +
                "índices hash, que, como uma tabela hash, só servem para igualdade.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um índice troca escrita e espaço por leitura: ele faz uma consulta frequente deixar de ler a tabela " +
                "toda, mas cada `INSERT`, `UPDATE` e `DELETE` passa a atualizá-lo também — por isso se cria índice para " +
                "as consultas que existem, e não para todas as colunas.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "index.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(\"CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL)\");",
                "",
                "plan(\"SELECT * FROM users WHERE email = 'ana@example.test'\");",
                "// [\"SCAN users\"] — lê todas as linhas e confere uma a uma",
                "",
                "db.exec(\"CREATE UNIQUE INDEX idx_users_email ON users(email)\");",
                "",
                "plan(\"SELECT * FROM users WHERE email = 'ana@example.test'\");",
                "// [\"SEARCH users USING INDEX idx_users_email (email=?)\"] — vai direto ao valor na árvore",
                "",
                "plan(\"SELECT * FROM users WHERE email >= 'a' AND email < 'b' ORDER BY email\");",
                "// [\"SEARCH users USING INDEX idx_users_email (email>? AND email<?)\"] — intervalo, já em ordem",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A chave primária e as colunas `UNIQUE` ganham um índice automaticamente, porque o banco precisa dele " +
                "para conferir a unicidade. As chaves estrangeiras, na maioria dos bancos, não ganham: o índice delas " +
                "precisa ser criado à mão.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em colunas usadas com frequência em `WHERE`, `JOIN` e `ORDER BY` de consultas importantes, como a busca de um usuário pelo e-mail.",
                "Quando a condição é seletiva, isto é, separa poucas linhas de muitas: um e-mail aponta para uma pessoa, e não para metade da tabela.",
                "Para garantir unicidade (`UNIQUE`), o que também acelera a busca por aquele valor.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Colunas pouco seletivas, como um booleano ou um status com dois valores, raramente se beneficiam: ler metade da tabela pelo índice custa mais que varrê-la.",
                "Cada índice torna as escritas mais lentas e ocupa espaço; tabelas com muita escrita e pouca leitura pagam caro por índices que ninguém usa.",
                "Um índice sobre uma coluna não ajuda uma condição que aplica uma função sobre ela, como `lower(email) = ?`, a menos que o índice seja sobre essa mesma expressão.",
              ],
            },
          ],
          examples: [
            {
              title: "Seletividade: quando o índice não compensa",
              context: "O banco escolhe entre o índice e a varredura estimando quantas linhas a condição devolve.",
              code: {
                language: "text",
                filename: "selectivity.txt",
                code: [
                  "Tabela orders: 1.000.000 de linhas. Índices em email_confirmed e em customer_id.",
                  "",
                  "WHERE customer_id = 42          -- ~10 linhas (0,001%)",
                  "  Index Scan using idx_orders_customer on orders ...",
                  "  → poucas páginas lidas; o índice vale muito.",
                  "",
                  "WHERE email_confirmed = true    -- ~600.000 linhas (60%)",
                  "  Seq Scan on orders  Filter: email_confirmed",
                  "  → o PostgreSQL IGNORA o índice: buscar 600 mil linhas uma a uma pelo índice",
                  "    exigiria mais leituras aleatórias do que ler a tabela inteira em sequência.",
                  "",
                  "Seletividade = quantas linhas a condição separa. Quanto menos linhas, mais o índice ajuda.",
                ].join("\n"),
              },
              explanation:
                "O índice não é usado só porque existe: o otimizador compara o custo estimado das alternativas. Para " +
                "colunas com poucos valores distintos, um índice parcial (`WHERE email_confirmed = false`) ou um índice " +
                "composto com uma coluna mais seletiva costuma ser a saída.",
            },
            {
              title: "O custo de cada índice na escrita",
              context: "Cada índice é mais uma estrutura para atualizar em cada `INSERT`, `UPDATE` e `DELETE`.",
              code: {
                language: "javascript",
                filename: "write-cost.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE events (id INTEGER PRIMARY KEY, user_id INTEGER, kind TEXT, created_at TEXT, payload TEXT);",
                  "  CREATE INDEX idx_events_user ON events(user_id);",
                  "  CREATE INDEX idx_events_kind ON events(kind);",
                  "  CREATE INDEX idx_events_created ON events(created_at);",
                  "  CREATE INDEX idx_events_user_created ON events(user_id, created_at);   -- já cobre as buscas de idx_events_user",
                  "`);",
                  "",
                  "// Um INSERT nesta tabela escreve 5 estruturas: a tabela e os 4 índices.",
                  "db.prepare(\"SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'events'\").all();",
                  "// [{ name: \"idx_events_user\" }, { name: \"idx_events_kind\" }, { name: \"idx_events_created\" }, { name: \"idx_events_user_created\" }]",
                  "",
                  "// No PostgreSQL, os índices que nunca foram usados aparecem em pg_stat_user_indexes com idx_scan = 0:",
                  "//   SELECT indexrelname, idx_scan FROM pg_stat_user_indexes WHERE relname = 'events' ORDER BY idx_scan;",
                ].join("\n"),
              },
              explanation:
                "Em uma tabela de eventos, que recebe muitas escritas e é lida por poucas consultas, índices sobram com " +
                "facilidade. `idx_events_user` é redundante, porque o composto `(user_id, created_at)` já serve às buscas " +
                "por `user_id`; apagar os índices sem uso deixa as escritas mais rápidas.",
            },
            {
              title: "Árvore B ou hash: o que cada uma sabe fazer",
              context: "A estrutura do índice decide quais consultas ele consegue atender.",
              code: {
                language: "text",
                filename: "btree-vs-hash.txt",
                code: [
                  "                               B-tree (padrão)     Hash",
                  "igualdade      email = ?       sim                 sim",
                  "intervalo      price > ?       sim                 não",
                  "prefixo        name LIKE 'An%' sim (*)             não",
                  "ordenação      ORDER BY email  sim, sem ordenar    não",
                  "unicidade      UNIQUE          sim                 não (no PostgreSQL)",
                  "",
                  "(*) com a configuração de ordenação (collation) adequada.",
                  "",
                  "A B-tree guarda os valores em ordem, como o percurso de uma árvore de busca; o hash",
                  "espalha os valores por baldes, como uma tabela hash, e perde a ordem. Por isso quase",
                  "todo índice é B-tree, e o hash fica para colunas grandes consultadas só por igualdade.",
                ].join("\n"),
              },
              explanation:
                "As mesmas propriedades das estruturas de dados aparecem no banco: a ordem da árvore permite intervalos e " +
                "ordenação, e o hash só responde se um valor exato existe. Na dúvida, `CREATE INDEX` sem tipo cria uma " +
                "B-tree, que é a escolha certa na grande maioria dos casos.",
            },
          ],
          exercise: {
            problem:
              "O login ficou lento depois que a base passou de um milhão de usuários. A consulta procura o usuário pelo " +
              "e-mail, e a tabela só tem a chave primária.",
            problemCode: {
              language: "javascript",
              filename: "login.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(\"CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL, password_hash TEXT NOT NULL)\");",
                "",
                "const findByEmail = db.prepare(\"SELECT id, password_hash FROM users WHERE email = ?\");",
                "plan(\"SELECT id, password_hash FROM users WHERE email = 'ana@example.test'\");   // [\"SCAN users\"]",
              ].join("\n"),
            },
            task:
              "Crie o índice adequado, confirme pelo plano que a consulta passou a usá-lo e explique por que ele deve " +
              "ser `UNIQUE`.",
            hint: "Dois usuários não podem ter o mesmo e-mail: a mesma declaração garante a regra e cria o índice.",
            solution: {
              code: {
                language: "javascript",
                filename: "login.fixed.js",
                code: [
                  "db.exec(\"CREATE UNIQUE INDEX idx_users_email ON users(email)\");",
                  "",
                  "plan(\"SELECT id, password_hash FROM users WHERE email = 'ana@example.test'\");",
                  "// [\"SEARCH users USING INDEX idx_users_email (email=?)\"]",
                  "",
                  "db.prepare(\"INSERT INTO users (email, password_hash) VALUES (?, ?)\").run(\"ana@example.test\", \"h1\");",
                  "try { db.prepare(\"INSERT INTO users (email, password_hash) VALUES (?, ?)\").run(\"ana@example.test\", \"h2\"); }",
                  "catch (error) { error.message; }   // \"UNIQUE constraint failed: users.email\"",
                ].join("\n"),
              },
              explanation:
                "A busca deixou de ler um milhão de linhas e passou a descer a árvore do índice, algumas páginas só. Como " +
                "o e-mail identifica a conta, o índice `UNIQUE` também impede o cadastro duplicado, sem uma verificação à " +
                "parte que poderia falhar sob concorrência.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Composite Index",
          requires: ["Index"],
          note: "regra do prefixo mais à esquerda; ordem das colunas",
          summary:
            "Um índice sobre várias colunas, ordenado pela primeira, depois pela segunda dentro de cada valor da " +
            "primeira, e assim por diante — útil para consultas que filtram por um prefixo dessas colunas, na ordem " +
            "em que foram declaradas.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um índice composto guarda várias colunas juntas, em ordem: primeiro pela primeira coluna; dentro de cada " +
                "valor dela, pela segunda; e assim por diante — como uma lista telefônica ordenada por sobrenome e, " +
                "dentro do sobrenome, pelo nome. Por isso ele só é útil para consultas que usam as colunas a partir da " +
                "primeira, sem pular nenhuma: é a regra do prefixo mais à esquerda. A ordem das colunas na declaração é, " +
                "então, a decisão mais importante.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um índice `(a, b, c)` serve a consultas por `a`, por `a` e `b`, e por `a`, `b` e `c` — mas não por `b` " +
                "ou por `c` sozinhos; a ordem das colunas se escolhe pelas consultas, com as de igualdade primeiro e a de " +
                "intervalo ou ordenação por último.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "composite.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, placed_at TEXT, total_cents INTEGER);",
                "  CREATE INDEX idx_orders_customer_placed ON orders(customer_id, placed_at);",
                "`);",
                "",
                "plan(\"SELECT * FROM orders WHERE customer_id = 7\");",
                "// [\"SEARCH orders USING INDEX idx_orders_customer_placed (customer_id=?)\"] — prefixo: a 1ª coluna",
                "",
                "plan(\"SELECT * FROM orders WHERE customer_id = 7 AND placed_at >= '2026-01-01'\");",
                "// [\"SEARCH ... (customer_id=? AND placed_at>?)\"] — as duas colunas",
                "",
                "plan(\"SELECT * FROM orders WHERE placed_at >= '2026-01-01'\");",
                "// [\"SCAN orders\"] — pulou a 1ª coluna: o índice não ajuda",
                "",
                "plan(\"SELECT * FROM orders WHERE customer_id = 7 ORDER BY placed_at DESC LIMIT 20\");",
                "// [\"SEARCH ... (customer_id=?)\"] — já vem ordenado por data: sem etapa de ordenação",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na última consulta, o banco lê os pedidos do cliente 7 no índice, que já estão em ordem de data, de trás " +
                "para a frente, e para depois de 20. Sem o `placed_at` no índice, ele teria de buscar todos os pedidos do " +
                "cliente e ordená-los antes de devolver os 20 primeiros.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando as consultas importantes filtram sempre pela mesma combinação de colunas, como loja e status, ou cliente e data.",
                "Para atender filtro e ordenação com um índice só: as colunas de igualdade primeiro, e a coluna do `ORDER BY` depois delas.",
                "No lugar de vários índices simples, quando um composto já cobre as mesmas consultas pelo prefixo.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Consultas que não usam a primeira coluna não aproveitam o índice; às vezes é preciso um segundo índice com outra ordem.",
                "Depois de uma condição de intervalo (`>`, `<`, `BETWEEN`), as colunas seguintes do índice já não ajudam a filtrar nem a ordenar.",
                "Índices largos, com muitas colunas, ocupam mais espaço e custam mais a cada escrita; inclua só as colunas que as consultas usam.",
              ],
            },
          ],
          examples: [
            {
              title: "Igualdade antes de intervalo",
              context: "A mesma consulta, com as mesmas duas colunas em ordens diferentes.",
              code: {
                language: "javascript",
                filename: "equality-first.js",
                code: [
                  "db.exec(\"CREATE TABLE orders (id INTEGER PRIMARY KEY, status TEXT, placed_at TEXT, total_cents INTEGER)\");",
                  "const sql = \"SELECT * FROM orders WHERE status = 'paid' AND placed_at >= '2026-01-01'\";",
                  "",
                  "db.exec(\"CREATE INDEX idx_placed_status ON orders(placed_at, status)\");",
                  "plan(sql);   // [\"SEARCH orders USING INDEX idx_placed_status (placed_at>?)\"]",
                  "// usa só a data: lê todos os pedidos desde janeiro e descarta os que não estão pagos",
                  "",
                  "db.exec(\"DROP INDEX idx_placed_status; CREATE INDEX idx_status_placed ON orders(status, placed_at)\");",
                  "plan(sql);   // [\"SEARCH orders USING INDEX idx_status_placed (status=? AND placed_at>?)\"]",
                  "// vai direto aos pagos e, dentro deles, ao intervalo de datas",
                ].join("\n"),
              },
              explanation:
                "Com a data primeiro, o intervalo encerra o uso do índice, e o status só serve de filtro depois. Com o " +
                "status primeiro, a igualdade fixa um trecho da árvore, e o intervalo de datas é percorrido dentro dele: " +
                "as duas condições são resolvidas pelo índice.",
            },
            {
              title: "O índice simples que ficou redundante",
              context: "Um composto já atende às buscas pelo seu prefixo.",
              code: {
                language: "javascript",
                filename: "redundant.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE tickets (id INTEGER PRIMARY KEY, project_id INTEGER, created_at TEXT, title TEXT);",
                  "  CREATE INDEX idx_tickets_project ON tickets(project_id);                       -- antigo",
                  "  CREATE INDEX idx_tickets_project_created ON tickets(project_id, created_at);   -- novo",
                  "`);",
                  "",
                  "db.exec(\"DROP INDEX idx_tickets_project\");",
                  "plan(\"SELECT * FROM tickets WHERE project_id = 3\");",
                  "// [\"SEARCH tickets USING INDEX idx_tickets_project_created (project_id=?)\"] — o composto serve",
                ].join("\n"),
              },
              explanation:
                "O índice `(project_id)` é o prefixo de `(project_id, created_at)`, e tudo o que ele faz o composto " +
                "também faz. Manter os dois só dobra o custo das escritas. O contrário não vale: um índice `(created_at, " +
                "project_id)` não substituiria o simples.",
            },
            {
              title: "Um índice para filtrar e ordenar",
              context: "A listagem filtra por loja e ordena pelos mais recentes.",
              code: {
                language: "javascript",
                filename: "filter-and-sort.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE orders (id INTEGER PRIMARY KEY, store_id INTEGER, placed_at TEXT, total_cents INTEGER);",
                  "  CREATE INDEX idx_orders_store ON orders(store_id);",
                  "`);",
                  "const sql = \"SELECT * FROM orders WHERE store_id = 3 ORDER BY placed_at DESC LIMIT 20\";",
                  "",
                  "plan(sql);",
                  "// [\"SEARCH orders USING INDEX idx_orders_store (store_id=?)\", \"USE TEMP B-TREE FOR ORDER BY\"]",
                  "// busca TODOS os pedidos da loja e os ordena antes de devolver 20",
                  "",
                  "db.exec(\"DROP INDEX idx_orders_store; CREATE INDEX idx_orders_store_placed ON orders(store_id, placed_at)\");",
                  "plan(sql);",
                  "// [\"SEARCH orders USING INDEX idx_orders_store_placed (store_id=?)\"] — lê os 20 mais recentes e para",
                ].join("\n"),
              },
              explanation:
                "A etapa de ordenação (`USE TEMP B-TREE FOR ORDER BY`) desapareceu, porque o índice já entrega os pedidos " +
                "da loja em ordem de data. Em uma loja com cem mil pedidos, isso é a diferença entre ordenar cem mil " +
                "linhas e ler vinte.",
            },
          ],
          exercise: {
            problem:
              "O painel da loja lista os pedidos em aberto, dos mais recentes para os mais antigos, 20 por página. Há " +
              "um índice só em `store_id`, e a consulta ficou lenta nas lojas grandes.",
            problemCode: {
              language: "javascript",
              filename: "store-panel.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, store_id INTEGER, status TEXT, placed_at TEXT, total_cents INTEGER);",
                "  CREATE INDEX idx_orders_store ON orders(store_id);",
                "`);",
                "",
                "const sql = \"SELECT id, total_cents FROM orders WHERE store_id = 3 AND status = 'open' ORDER BY placed_at DESC LIMIT 20\";",
                "plan(sql);",
                "// [\"SEARCH orders USING INDEX idx_orders_store (store_id=?)\", \"USE TEMP B-TREE FOR ORDER BY\"]",
              ].join("\n"),
            },
            task:
              "Projete o índice composto que atende ao filtro e à ordenação, substitua o índice atual e confirme pelo " +
              "plano que a etapa de ordenação sumiu.",
            hint: "Primeiro as colunas comparadas por igualdade (loja e status), por último a coluna da ordenação.",
            solution: {
              code: {
                language: "javascript",
                filename: "store-panel.fixed.js",
                code: [
                  "db.exec(`",
                  "  DROP INDEX idx_orders_store;",
                  "  CREATE INDEX idx_orders_store_status_placed ON orders(store_id, status, placed_at);",
                  "`);",
                  "",
                  "plan(sql);",
                  "// [\"SEARCH orders USING INDEX idx_orders_store_status_placed (store_id=? AND status=?)\"]",
                  "",
                  "plan(\"SELECT * FROM orders WHERE store_id = 3\");",
                  "// [\"SEARCH orders USING INDEX idx_orders_store_status_placed (store_id=?)\"] — o prefixo continua servindo",
                ].join("\n"),
              },
              explanation:
                "Com loja e status fixados pelo índice, os pedidos em aberto daquela loja já estão em ordem de data, e o " +
                "banco lê só os 20 primeiros. O índice antigo pode sair, porque `store_id` é o prefixo do novo.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Query Execution Plan",
          requires: ["Index"],
          note: "EXPLAIN; seq scan × index scan; estimativas do otimizador",
          summary:
            "O roteiro que o otimizador do banco escolhe para executar uma consulta — que índices usar, em que ordem " +
            "juntar as tabelas, onde ordenar —, visível com `EXPLAIN`, junto com as estimativas de custo e de linhas " +
            "que o levaram a essa escolha.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O SQL diz o que se quer, e não como obter. Quem decide o como é o otimizador: ele considera caminhos " +
                "possíveis (varrer a tabela ou usar um índice, qual tabela ler primeiro em um `JOIN`, como ordenar), " +
                "estima o custo de cada um a partir de estatísticas sobre os dados e escolhe o mais barato. `EXPLAIN` " +
                "mostra o plano escolhido; `EXPLAIN ANALYZE`, no PostgreSQL, executa a consulta e mostra também o que " +
                "aconteceu de verdade: tempos e número real de linhas em cada etapa.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Antes de adivinhar por que uma consulta é lenta, leia o plano: ele mostra se o banco varreu a tabela, " +
                "que índice usou, onde ordenou e quanto errou nas estimativas — e quase sempre aponta a correção.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "plan.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, placed_at TEXT);",
                "  CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER);",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT);",
                "  CREATE INDEX idx_orders_customer ON orders(customer_id);",
                "`);",
                "",
                "const sql = `",
                "  SELECT p.name, oi.quantity",
                "  FROM orders o",
                "  JOIN order_items oi ON oi.order_id = o.id",
                "  JOIN products p ON p.id = oi.product_id",
                "  WHERE o.customer_id = 7`;",
                "",
                "plan(sql);",
                "// [\"SCAN oi\",                                          ← varre TODOS os itens de pedido",
                "//  \"SEARCH p USING INTEGER PRIMARY KEY (rowid=?)\",",
                "//  \"SEARCH o USING INTEGER PRIMARY KEY (rowid=?)\"]     ← e só então confere o cliente de cada um",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Cada linha do plano é uma etapa, na ordem em que as tabelas são percorridas. `SCAN` lê a tabela inteira; " +
                "`SEARCH ... USING INDEX` usa um índice; `USE TEMP B-TREE` indica uma ordenação ou agrupamento feitos à " +
                "parte. Aqui, sem índice em `order_items.order_id`, o otimizador preferiu começar pelos itens e varrê-los " +
                "todos.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Sempre que uma consulta estiver lenta, antes de mudar o código ou criar índices por tentativa.",
                "Depois de criar um índice, para confirmar que a consulta passou a usá-lo.",
                "Em revisões de código de consultas novas sobre tabelas grandes, para pegar varreduras antes de chegarem à produção.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O plano depende dos dados e das estatísticas: o mesmo `EXPLAIN` em um banco de desenvolvimento pequeno pode ser bem diferente do de produção.",
                "`EXPLAIN ANALYZE` executa a consulta de verdade; em `UPDATE` e `DELETE`, rode-o dentro de uma transação e faça `ROLLBACK`.",
                "O formato e o vocabulário variam entre bancos (SQLite, PostgreSQL, MySQL); o que se aprende em um se traduz, mas não se copia.",
              ],
            },
          ],
          examples: [
            {
              title: "Seq Scan e Index Scan no PostgreSQL",
              context: "A mesma consulta, antes e depois do índice, com `EXPLAIN ANALYZE`.",
              code: {
                language: "text",
                filename: "explain-analyze.txt",
                code: [
                  "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;",
                  "",
                  "-- sem índice",
                  "Seq Scan on orders  (cost=0.00..1834.00 rows=10 width=24) (actual time=0.015..9.871 rows=12 loops=1)",
                  "  Filter: (customer_id = 42)",
                  "  Rows Removed by Filter: 99988",
                  "Planning Time: 0.080 ms",
                  "Execution Time: 9.902 ms",
                  "",
                  "-- com CREATE INDEX idx_orders_customer ON orders(customer_id)",
                  "Index Scan using idx_orders_customer on orders  (cost=0.29..8.49 rows=10 width=24) (actual time=0.020..0.034 rows=12 loops=1)",
                  "  Index Cond: (customer_id = 42)",
                  "Planning Time: 0.110 ms",
                  "Execution Time: 0.052 ms",
                  "",
                  "cost=inicial..total   estimativa do otimizador, em unidades próprias (não é tempo)",
                  "rows                  linhas estimadas (primeiro parêntese) e reais (segundo)",
                  "Rows Removed by Filter: linhas lidas e descartadas — o sinal de que faltou um índice",
                ].join("\n"),
              },
              explanation:
                "\"Rows Removed by Filter: 99988\" diz que o banco leu cem mil linhas para devolver doze. Com o índice, a " +
                "condição vira `Index Cond`: ela é resolvida na própria busca, e nada é lido à toa.",
            },
            {
              title: "Quando a estimativa erra",
              context: "O otimizador escolhe pelo que acha que os dados são, e as estatísticas podem estar velhas.",
              code: {
                language: "text",
                filename: "bad-estimate.txt",
                code: [
                  "EXPLAIN ANALYZE SELECT * FROM events WHERE kind = 'checkout';",
                  "",
                  "Index Scan using idx_events_kind on events  (cost=0.43..12.51 rows=8 width=64)",
                  "                                            (actual time=0.03..812.40 rows=480113 loops=1)",
                  "",
                  "Estimou 8 linhas, e vieram 480 mil: a tabela recebeu uma carga grande depois da última",
                  "coleta de estatísticas, e o otimizador escolheu o índice achando que 'checkout' era raro.",
                  "",
                  "ANALYZE events;   -- atualiza as estatísticas (o autovacuum também faz isso, periodicamente)",
                  "",
                  "Seq Scan on events  (cost=0.00..21870.00 rows=479950 width=64)",
                  "                    (actual time=0.01..210.33 rows=480113 loops=1)",
                ].join("\n"),
              },
              explanation:
                "A diferença grande entre `rows` estimado e real é a pista mais importante de um plano ruim. Depois de " +
                "cargas em massa, rodar `ANALYZE` na tabela devolve ao otimizador números corretos, e ele volta a " +
                "escolher bem.",
            },
            {
              title: "EXPLAIN ANALYZE também executa escritas",
              context: "Para medir um `DELETE` sem apagar nada, a transação desfaz o efeito.",
              code: {
                language: "javascript",
                filename: "explain-write.js",
                code: [
                  "await client.query(\"BEGIN\");",
                  "const { rows } = await client.query(",
                  "  \"EXPLAIN (ANALYZE, BUFFERS) DELETE FROM sessions WHERE expires_at < now() - interval '30 days'\"",
                  ");",
                  "console.log(rows.map((row) => row[\"QUERY PLAN\"]).join(\"\\n\"));",
                  "await client.query(\"ROLLBACK\");   // o DELETE rodou de verdade; o ROLLBACK o desfaz",
                ].join("\n"),
              },
              explanation:
                "Com `ANALYZE`, o banco executa o comando para medir o tempo real, inclusive escritas. A transação com " +
                "`ROLLBACK` permite ver o plano e o custo de uma limpeza grande sem perder os dados. `BUFFERS` mostra " +
                "quantas páginas vieram da memória e quantas do disco.",
            },
          ],
          exercise: {
            problem:
              "A tela \"Meus pedidos\" junta pedidos, itens e produtos de um cliente. Ela ficou lenta à medida que a " +
              "tabela de itens cresceu, e ninguém sabe por onde começar.",
            problemCode: {
              language: "javascript",
              filename: "my-orders.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, placed_at TEXT);",
                "  CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER);",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT);",
                "  CREATE INDEX idx_orders_customer ON orders(customer_id);",
                "`);",
                "",
                "const sql = `",
                "  SELECT o.id, p.name, oi.quantity",
                "  FROM orders o",
                "  JOIN order_items oi ON oi.order_id = o.id",
                "  JOIN products p ON p.id = oi.product_id",
                "  WHERE o.customer_id = ?`;",
              ].join("\n"),
            },
            task:
              "Leia o plano, diga qual etapa é o problema e por quê, crie o índice que falta e mostre o plano novo, " +
              "explicando a mudança na ordem das tabelas.",
            hint: "Procure a etapa `SCAN`. Qual coluna o `JOIN` usa para chegar a essa tabela?",
            solution: {
              code: {
                language: "javascript",
                filename: "my-orders.fixed.js",
                code: [
                  "plan(sql);",
                  "// [\"SCAN oi\", \"SEARCH p USING INTEGER PRIMARY KEY (rowid=?)\", \"SEARCH o USING INTEGER PRIMARY KEY (rowid=?)\"]",
                  "// o problema: SCAN oi — todos os itens de pedido são lidos, qualquer que seja o cliente",
                  "",
                  "db.exec(\"CREATE INDEX idx_order_items_order ON order_items(order_id)\");",
                  "",
                  "plan(sql);",
                  "// [\"SEARCH o USING COVERING INDEX idx_orders_customer (customer_id=?)\",",
                  "//  \"SEARCH oi USING INDEX idx_order_items_order (order_id=?)\",",
                  "//  \"SEARCH p USING INTEGER PRIMARY KEY (rowid=?)\"]",
                ].join("\n"),
              },
              explanation:
                "Sem índice em `order_items.order_id`, o otimizador não tinha como ir de um pedido aos seus itens, e " +
                "começou pelos itens, varrendo a tabela inteira. Com o índice, ele começa pelo cliente, chega aos seus " +
                "poucos pedidos e, de cada pedido, direto aos seus itens: o trabalho passa a ser proporcional aos pedidos " +
                "do cliente, e não ao total de itens do sistema.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Query Optimization",
          requires: ["Query Execution Plan"],
          note: "SARGability, evitar SELECT *, projeção, covering index",
          summary:
            "Escrever as consultas de um jeito que o banco consiga usar os índices e ler só o necessário — condições " +
            "aplicáveis ao índice (SARGable), só as colunas usadas e, quando vale, um índice que cubra a consulta " +
            "inteira.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Duas consultas com o mesmo resultado podem ter custos muito diferentes. Otimizar uma consulta é, na " +
                "maior parte das vezes, permitir que o banco use o que já tem: uma condição só aproveita um índice se " +
                "compara a coluna, tal como está indexada, com um valor — a condição \"SARGable\" (search argument able). " +
                "Aplicar uma função sobre a coluna, calcular sobre ela ou começar um `LIKE` com `%` esconde a coluna do " +
                "índice. Pedir só as colunas usadas reduz o que se lê e o que se transfere, e às vezes permite responder " +
                "só pelo índice (um índice de cobertura).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Deixe a coluna indexada \"nua\" na condição e mova as transformações para o valor comparado: `created_at " +
                ">= ? AND created_at < ?` usa o índice, `date(created_at) = ?` não.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "sargable.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(`",
                "  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL, created_at TEXT NOT NULL);",
                "  CREATE INDEX idx_users_email ON users(email);",
                "  CREATE INDEX idx_users_created ON users(created_at);",
                "`);",
                "",
                "// Função sobre a coluna: o índice guarda `email`, e não `lower(email)`",
                "plan(\"SELECT * FROM users WHERE lower(email) = 'ana@example.test'\");   // [\"SCAN users\"]",
                "",
                "// Função sobre a data: mesmo problema",
                "plan(\"SELECT * FROM users WHERE date(created_at) = '2026-09-01'\");     // [\"SCAN users\"]",
                "",
                "// A mesma pergunta, com a coluna nua e um intervalo",
                "plan(\"SELECT * FROM users WHERE created_at >= '2026-09-01' AND created_at < '2026-09-02'\");",
                "// [\"SEARCH users USING INDEX idx_users_created (created_at>? AND created_at<?)\"]",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Para o e-mail, as saídas são guardar o valor já normalizado (em minúsculas, na gravação) ou criar um " +
                "índice sobre a expressão, `CREATE INDEX ... ON users(lower(email))`, que o banco usa quando a condição " +
                "repete a mesma expressão.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o plano mostra uma varredura em uma coluna que tem índice: quase sempre há uma função, uma conversão ou um cálculo sobre ela na condição.",
                "Em consultas muito frequentes que usam poucas colunas, que podem ser respondidas só pelo índice (índice de cobertura).",
                "Ao trocar `SELECT *` pelas colunas usadas, em tabelas com colunas grandes (textos, JSON) que a tela não mostra.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Consultas raras sobre tabelas pequenas não pagam o esforço; otimize guiado pelo que o monitoramento mostra como lento ou frequente.",
                "Índices de expressão e de cobertura são mais índices para manter a cada escrita; crie-os para consultas que justifiquem o custo.",
                "Busca por trechos no meio do texto (`LIKE '%termo%'`) não se resolve com um índice comum; ela pede um índice de texto completo, como o `tsvector` do PostgreSQL ou o FTS do SQLite.",
              ],
            },
          ],
          examples: [
            {
              title: "Índice de cobertura: responder sem ler a tabela",
              context: "Se o índice tem todas as colunas que a consulta pede, a tabela nem é consultada.",
              code: {
                language: "javascript",
                filename: "covering.js",
                code: [
                  "db.exec(`",
                  "  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, placed_at TEXT, notes TEXT);",
                  "  CREATE INDEX idx_orders_customer_placed ON orders(customer_id, placed_at);",
                  "`);",
                  "",
                  "plan(\"SELECT * FROM orders WHERE customer_id = 7\");",
                  "// [\"SEARCH orders USING INDEX idx_orders_customer_placed (customer_id=?)\"] — índice + leitura da tabela",
                  "",
                  "plan(\"SELECT placed_at FROM orders WHERE customer_id = 7\");",
                  "// [\"SEARCH orders USING COVERING INDEX idx_orders_customer_placed (customer_id=?)\"] — só o índice",
                ].join("\n"),
              },
              explanation:
                "Com `SELECT *`, o banco encontra as linhas pelo índice e depois vai buscar cada uma na tabela, por causa " +
                "de `notes`. Pedindo só `placed_at`, que está no índice, ele não precisa ir à tabela. No PostgreSQL, " +
                "`INCLUDE` acrescenta colunas extras a um índice só para isso.",
            },
            {
              title: "Contar tudo para saber se existe um",
              context: "A pergunta \"tem algum?\" não precisa da quantidade.",
              code: {
                language: "javascript",
                filename: "exists.js",
                code: [
                  "// Lento em listas grandes: conta todos os pedidos do cliente para comparar com zero",
                  "const hasOrdersSlow = (customerId) =>",
                  "  db.prepare(\"SELECT count(*) AS n FROM orders WHERE customer_id = ?\").get(customerId).n > 0;",
                  "",
                  "// Para no primeiro que encontrar",
                  "const hasOrders = (customerId) =>",
                  "  db.prepare(\"SELECT EXISTS (SELECT 1 FROM orders WHERE customer_id = ?) AS found\").get(customerId).found === 1;",
                ].join("\n"),
              },
              explanation:
                "`count(*)` percorre todas as linhas que atendem à condição, mesmo que só importe se há uma. `EXISTS` " +
                "termina assim que encontra a primeira. Com um cliente de dez pedidos a diferença é pequena; com uma " +
                "tabela de eventos de milhões de linhas, não.",
            },
            {
              title: "O `OR` que impede o índice",
              context: "Condições em colunas diferentes ligadas por `OR` costumam levar a uma varredura.",
              code: {
                language: "text",
                filename: "or-vs-union.txt",
                code: [
                  "-- Busca de contato por e-mail OU por telefone (ambas as colunas têm índice)",
                  "SELECT id FROM contacts WHERE email = $1 OR phone = $2;",
                  "  → muitos bancos varrem a tabela, ou precisam combinar os dois índices (Bitmap OR no PostgreSQL)",
                  "",
                  "-- Duas buscas simples, cada uma com o seu índice, e o resultado unido",
                  "SELECT id FROM contacts WHERE email = $1",
                  "UNION",
                  "SELECT id FROM contacts WHERE phone = $2;",
                ].join("\n"),
              },
              explanation:
                "Cada lado do `UNION` é uma busca por igualdade em uma coluna indexada, fácil para qualquer otimizador. O " +
                "PostgreSQL costuma combinar os dois índices sozinho; em outros bancos, e em consultas mais complexas, " +
                "reescrever o `OR` é o que devolve o índice. O plano diz qual é o caso.",
            },
          ],
          exercise: {
            problem:
              "O relatório de cadastros do dia e a busca de usuário pelo e-mail fazem varredura na tabela de usuários, " +
              "embora `email` e `created_at` tenham índice.",
            problemCode: {
              language: "javascript",
              filename: "users-report.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "const plan = (sql) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all().map((row) => row.detail);",
                "",
                "db.exec(`",
                "  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL, created_at TEXT NOT NULL, bio TEXT);",
                "  CREATE INDEX idx_users_email ON users(email);",
                "  CREATE INDEX idx_users_created ON users(created_at);",
                "`);",
                "",
                "const signupsOfDay = \"SELECT * FROM users WHERE date(created_at) = ?\";",
                "const findByEmail = \"SELECT * FROM users WHERE lower(email) = lower(?)\";",
                "",
                "plan(signupsOfDay.replace(\"?\", \"'2026-09-01'\"));                  // [\"SCAN users\"]",
                "plan(findByEmail.replace(\"?\", \"'Ana@Example.test'\"));             // [\"SCAN users\"]",
              ].join("\n"),
            },
            task:
              "Reescreva as duas consultas para que usem índices, sem mudar o resultado. Para o e-mail, escolha entre " +
              "um índice de expressão e gravar o e-mail normalizado, e justifique.",
            hint:
              "O dia vira um intervalo: do início do dia até o início do dia seguinte. Para o e-mail, o índice precisa " +
              "ter a mesma expressão da condição.",
            solution: {
              code: {
                language: "javascript",
                filename: "users-report.fixed.js",
                code: [
                  "// Dia como intervalo sobre a coluna nua",
                  "const signupsOfDay = \"SELECT id, email, created_at FROM users WHERE created_at >= ? AND created_at < ?\";",
                  "plan(\"SELECT id, email, created_at FROM users WHERE created_at >= '2026-09-01' AND created_at < '2026-09-02'\");",
                  "// [\"SEARCH users USING INDEX idx_users_created (created_at>? AND created_at<?)\"]",
                  "",
                  "// Índice sobre a mesma expressão usada na condição",
                  "db.exec(\"CREATE INDEX idx_users_email_lower ON users(lower(email))\");",
                  "plan(\"SELECT * FROM users WHERE lower(email) = lower('Ana@Example.test')\");",
                  "// [\"SEARCH users USING INDEX idx_users_email_lower (<expr>=?)\"]",
                ].join("\n"),
              },
              explanation:
                "O intervalo devolve os mesmos cadastros de `date(created_at) = ?` e deixa a coluna comparável com o " +
                "índice. O índice de expressão resolve a busca sem mudar os dados; gravar o e-mail já em minúsculas seria " +
                "ainda mais simples, com um índice comum e um `UNIQUE` que também impede \"Ana@\" e \"ana@\" como contas " +
                "diferentes. O relatório também deixou de pedir `bio`, que a tela não usa.",
            },
          },
        }),
        concept({
          order: 50,
          title: "N+1 Query Problem",
          note: "canônico do roadmap — I/O por item × lote; eager loading/IN/join. GraphQL / N+1 in Resolvers revisita daqui",
          collision: "GraphQL / N+1 in Resolvers é a manifestação; aqui é o conceito canônico",
          summary:
            "O padrão em que se faz uma consulta para buscar uma lista e, depois, mais uma consulta para cada item " +
            "dela — N+1 idas ao banco onde uma ou duas bastariam, um custo que cresce com o tamanho da lista.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O problema N+1 aparece quando o código busca uma lista (1 consulta) e, para cada item, busca um dado " +
                "relacionado (N consultas). Cada consulta é rápida, e o código parece correto; o custo está no número de " +
                "idas ao banco, cada uma com a sua latência de rede, e ele cresce com o tamanho da lista. Com 20 itens " +
                "passa despercebido; com 500, a página demora segundos. É comum em laços escritos à mão, em ORMs que " +
                "carregam relações sob demanda (lazy loading) e nos resolvers de GraphQL, onde o DataLoader é a solução " +
                "específica.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Busque em lote: em vez de uma consulta por item, uma consulta com todos os ids (`WHERE id IN (...)`) ou " +
                "um `JOIN` — o número de idas ao banco deixa de depender do tamanho da lista.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "n-plus-1.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "",
                "let queries = 0;",
                "const query = (sql, ...params) => { queries++; return db.prepare(sql).all(...params); };",
                "",
                "db.exec(`",
                "  CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                "  CREATE TABLE posts (id INTEGER PRIMARY KEY, author_id INTEGER NOT NULL, title TEXT NOT NULL);",
                "`);",
                "for (let i = 1; i <= 50; i++) db.prepare(\"INSERT INTO authors VALUES (?, ?)\").run(i, `Autor ${i}`);",
                "for (let i = 1; i <= 50; i++) db.prepare(\"INSERT INTO posts (author_id, title) VALUES (?, ?)\").run(i, `Post ${i}`);",
                "",
                "// N+1: 1 consulta para os posts + 1 por post para o autor",
                "queries = 0;",
                "const posts = query(\"SELECT id, author_id, title FROM posts ORDER BY id\");",
                "const withAuthors = posts.map((post) => ({ ...post, author: query(\"SELECT name FROM authors WHERE id = ?\", post.author_id)[0].name }));",
                "queries;   // 51",
                "",
                "// Em lote: 1 consulta para os posts + 1 para todos os autores",
                "queries = 0;",
                "const posts2 = query(\"SELECT id, author_id, title FROM posts ORDER BY id\");",
                "const ids = [...new Set(posts2.map((post) => post.author_id))];",
                "const authors = query(`SELECT id, name FROM authors WHERE id IN (${ids.map(() => \"?\").join(\", \")})`, ...ids);",
                "const byId = new Map(authors.map((author) => [author.id, author.name]));",
                "const withAuthors2 = posts2.map((post) => ({ ...post, author: byId.get(post.author_id) }));",
                "queries;   // 2 — com 50 posts ou com 5.000",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A versão em lote tem dois passos: buscar todos os relacionados de uma vez e montar um mapa por id para " +
                "ligar cada item ao seu. Um `JOIN` faria o mesmo em uma consulta só; o lote em duas consultas é " +
                "preferível quando a relação é de um para muitos e o `JOIN` repetiria os dados do item em cada linha.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Sempre que um laço sobre uma lista faz uma consulta por item: busque os relacionados em lote antes do laço.",
                "Em ORMs, ao carregar uma lista cujas relações serão usadas: peça o carregamento antecipado (eager loading, `include`, `preload`).",
                "Em GraphQL, com um carregador por requisição (DataLoader), que junta as buscas dos resolvers em uma consulta por lote.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Carregar antecipadamente relações que a tela não usa troca consultas desnecessárias por dados desnecessários.",
                "Listas de ids muito grandes em um `IN` esbarram em limites de parâmetros do banco e do driver; divida em lotes, ou use um array (`= ANY($1)` no PostgreSQL).",
                "Um `JOIN` com várias relações de um para muitos ao mesmo tempo multiplica as linhas; nesses casos, uma consulta por relação costuma ser melhor.",
              ],
            },
          ],
          examples: [
            {
              title: "O N+1 escondido em uma propriedade",
              context: "Com carregamento sob demanda, acessar `post.author` parece ler um campo, mas faz uma consulta.",
              code: {
                language: "javascript",
                filename: "lazy-loading.js",
                code: [
                  "let queries = 0;",
                  "const query = (sql, ...params) => { queries++; return db.prepare(sql).all(...params); };",
                  "",
                  "class Post {",
                  "  constructor(row) { Object.assign(this, row); }",
                  "  get author() {   // \"lazy loading\": busca quando alguém lê a propriedade",
                  "    return query(\"SELECT name FROM authors WHERE id = ?\", this.author_id)[0];",
                  "  }",
                  "}",
                  "",
                  "queries = 0;",
                  "const posts = query(\"SELECT id, author_id, title FROM posts\").map((row) => new Post(row));",
                  "const html = posts.map((post) => `<li>${post.title} — ${post.author.name}</li>`).join(\"\");",
                  "queries;   // 51 — nenhuma linha do template \"parece\" consultar o banco",
                ].join("\n"),
              },
              explanation:
                "É assim que o N+1 costuma entrar em aplicações com ORM: o código do template é inocente, e as consultas " +
                "acontecem dentro de uma propriedade. Contar as consultas por requisição, em desenvolvimento ou nos logs, " +
                "é o que o torna visível; a correção é pedir ao ORM que carregue os autores junto com os posts.",
            },
            {
              title: "Listas grandes: lotes ou um array",
              context: "Um `IN` com milhares de parâmetros esbarra em limites.",
              code: {
                language: "javascript",
                filename: "large-in.js",
                code: [
                  "// PostgreSQL: um único parâmetro do tipo array, qualquer que seja o tamanho da lista",
                  "const { rows } = await client.query(\"SELECT id, name FROM authors WHERE id = ANY($1::int[])\", [ids]);",
                  "",
                  "// Onde não há array: dividir em lotes de tamanho fixo",
                  "async function findAuthorsInChunks(ids, chunkSize = 500) {",
                  "  const found = [];",
                  "  for (let i = 0; i < ids.length; i += chunkSize) {",
                  "    const chunk = ids.slice(i, i + chunkSize);",
                  "    const placeholders = chunk.map((_, j) => `$${j + 1}`).join(\", \");",
                  "    const { rows } = await client.query(`SELECT id, name FROM authors WHERE id IN (${placeholders})`, chunk);",
                  "    found.push(...rows);",
                  "  }",
                  "  return found;   // 10.000 ids → 20 consultas, e não 10.000",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O protocolo do PostgreSQL aceita no máximo 65.535 parâmetros por comando, e outros bancos têm limites " +
                "próprios. O array ocupa um só parâmetro; os lotes mantêm o número de consultas pequeno e previsível " +
                "mesmo em listas enormes.",
            },
            {
              title: "JOIN ou uma consulta por relação",
              context: "Para relações de um para muitos, o `JOIN` repete os dados do lado \"um\".",
              code: {
                language: "text",
                filename: "join-vs-batches.txt",
                code: [
                  "Posts (20) com os seus comentários (média de 30 por post):",
                  "",
                  "JOIN posts × comments",
                  "  1 consulta, 600 linhas; o título e o texto de cada post vêm repetidos 30 vezes.",
                  "  Somando também as tags (JOIN com uma 3ª tabela, 5 por post): 20 × 30 × 5 = 3.000 linhas.",
                  "",
                  "Uma consulta por relação",
                  "  SELECT ... FROM posts WHERE ...                       -- 20 linhas",
                  "  SELECT ... FROM comments WHERE post_id IN (...)       -- 600 linhas",
                  "  SELECT ... FROM post_tags WHERE post_id IN (...)      -- 100 linhas",
                  "  3 consultas, 720 linhas, sem repetição.",
                ].join("\n"),
              },
              explanation:
                "Resolver o N+1 não significa juntar tudo em uma consulta. Para uma relação de muitos para um, como o " +
                "autor do post, o `JOIN` é natural; para várias relações de um para muitos, uma consulta em lote por " +
                "relação evita a multiplicação de linhas e continua com um número fixo de consultas.",
            },
          ],
          exercise: {
            problem:
              "A página \"Pedidos da semana\" lista os pedidos com os seus itens e o nome de cada produto. Em semanas " +
              "movimentadas ela leva vários segundos, e o log mostra centenas de consultas por carregamento.",
            problemCode: {
              language: "javascript",
              filename: "weekly-orders.js",
              code: [
                "import { DatabaseSync } from \"node:sqlite\";",
                "const db = new DatabaseSync(\":memory:\");",
                "let queries = 0;",
                "const query = (sql, ...params) => { queries++; return db.prepare(sql).all(...params); };",
                "",
                "db.exec(`",
                "  CREATE TABLE orders (id INTEGER PRIMARY KEY, placed_at TEXT NOT NULL);",
                "  CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL);",
                "  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
                "  CREATE INDEX idx_order_items_order ON order_items(order_id);",
                "`);",
                "for (let p = 1; p <= 10; p++) db.prepare(\"INSERT INTO products VALUES (?, ?)\").run(p, `Produto ${p}`);",
                "for (let o = 1; o <= 30; o++) {",
                "  db.prepare(\"INSERT INTO orders VALUES (?, '2026-09-21')\").run(o);",
                "  for (let i = 0; i < 3; i++) db.prepare(\"INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, 1)\").run(o, ((o + i) % 10) + 1);",
                "}",
                "",
                "function weeklyOrders() {",
                "  return query(\"SELECT id, placed_at FROM orders ORDER BY id\").map((order) => ({",
                "    ...order,",
                "    items: query(\"SELECT product_id, quantity FROM order_items WHERE order_id = ?\", order.id).map((item) => ({",
                "      ...item,",
                "      product: query(\"SELECT name FROM products WHERE id = ?\", item.product_id)[0].name,",
                "    })),",
                "  }));",
                "}",
                "",
                "weeklyOrders();",
                "queries;   // 1 + 30 + 90 = 121",
              ].join("\n"),
            },
            task:
              "Reescreva `weeklyOrders` para que o número de consultas não dependa da quantidade de pedidos nem de " +
              "itens, devolvendo exatamente a mesma estrutura.",
            hint:
              "Três consultas: os pedidos; os itens de todos esses pedidos, com o nome do produto por `JOIN`; e um " +
              "agrupamento dos itens por pedido na aplicação.",
            solution: {
              code: {
                language: "javascript",
                filename: "weekly-orders.fixed.js",
                code: [
                  "function weeklyOrders() {",
                  "  const orders = query(\"SELECT id, placed_at FROM orders ORDER BY id\");",
                  "  const ids = orders.map((order) => order.id);",
                  "  // itens de todos os pedidos, já com o nome do produto (muitos para um: o JOIN não multiplica nada)",
                  "  const items = query(",
                  "    `SELECT oi.order_id, oi.product_id, oi.quantity, p.name AS product",
                  "     FROM order_items oi JOIN products p ON p.id = oi.product_id",
                  "     WHERE oi.order_id IN (${ids.map(() => \"?\").join(\", \")})",
                  "     ORDER BY oi.id`,",
                  "    ...ids",
                  "  );",
                  "  const byOrder = new Map(ids.map((id) => [id, []]));",
                  "  for (const { order_id, ...item } of items) byOrder.get(order_id).push(item);",
                  "  return orders.map((order) => ({ ...order, items: byOrder.get(order.id) }));",
                  "}",
                  "",
                  "queries = 0;",
                  "weeklyOrders();",
                  "queries;   // 2 — com 30 pedidos ou com 3.000 (em lotes, se a lista de ids for enorme)",
                ].join("\n"),
              },
              explanation:
                "Os itens de todos os pedidos vêm em uma consulta, e o nome do produto vem junto pelo `JOIN`, que é uma " +
                "relação de muitos para um. O agrupamento por pedido é feito em memória com um mapa. A estrutura " +
                "devolvida é a mesma, e o número de consultas passou de 1 + N + N×M para 2.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Connection Pool",
          note: "tamanho do pool, exaustão, timeout — revisita Programming Foundations / Concurrency (recurso compartilhado limitado)",
          revisit: ["Programming Foundations / Concurrency"],
          summary:
            "Um conjunto de conexões ao banco abertas de antemão e reaproveitadas entre as requisições — para não " +
            "pagar o custo de abrir uma conexão a cada consulta e para limitar quantas conexões a aplicação usa ao " +
            "mesmo tempo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Abrir uma conexão com um banco como o PostgreSQL custa caro: rede, autenticação, TLS e, no servidor, um " +
                "processo por conexão. Um pool mantém algumas conexões abertas e as empresta: a requisição pega uma, usa " +
                "e devolve, e a próxima a reaproveita. O pool também é um limite: com todas as conexões emprestadas, quem " +
                "chega espera numa fila, como em qualquer recurso compartilhado limitado da programação concorrente. O " +
                "tamanho do pool, o tempo máximo de espera e a garantia de que toda conexão emprestada volta são as " +
                "decisões que importam.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O pool é um recurso limitado e compartilhado: toda conexão emprestada precisa voltar (sempre em " +
                "`finally`), e o tamanho dele, multiplicado pelo número de instâncias da aplicação, precisa caber no que " +
                "o banco aceita.",
            },
            { type: "heading", text: "Como funciona" },
            {
              type: "code",
              language: "javascript",
              filename: "pool.js",
              code: [
                "import pg from \"pg\";",
                "",
                "const pool = new pg.Pool({",
                "  max: 10,                          // no máximo 10 conexões abertas por esta instância",
                "  idleTimeoutMillis: 30_000,        // fecha conexões paradas há 30 s",
                "  connectionTimeoutMillis: 2_000,   // espera no máximo 2 s por uma conexão livre; depois, erro",
                "});",
                "",
                "// Consulta avulsa: o pool empresta e devolve sozinho",
                "const { rows } = await pool.query(\"SELECT id, name FROM products WHERE id = $1\", [7]);",
                "",
                "// Várias consultas na mesma conexão (uma transação): empresta, usa e devolve — sempre",
                "async function transfer(productId, fromStore, toStore, quantity) {",
                "  const client = await pool.connect();",
                "  try {",
                "    await client.query(\"BEGIN\");",
                "    await client.query(\"UPDATE stock SET quantity = quantity - $1 WHERE product_id = $2 AND store_id = $3\", [quantity, productId, fromStore]);",
                "    await client.query(\"UPDATE stock SET quantity = quantity + $1 WHERE product_id = $2 AND store_id = $3\", [quantity, productId, toStore]);",
                "    await client.query(\"COMMIT\");",
                "  } catch (error) {",
                "    await client.query(\"ROLLBACK\");",
                "    throw error;",
                "  } finally {",
                "    client.release();   // devolve ao pool, com ou sem erro",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "`pool.query` é suficiente para consultas avulsas. Uma transação precisa de `pool.connect()`, porque " +
                "todas as consultas dela têm de rodar na mesma conexão; e aí devolver a conexão passa a ser " +
                "responsabilidade do código.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em qualquer servidor que atende várias requisições e fala com um banco relacional: abrir uma conexão por requisição desperdiça tempo e sobrecarrega o banco.",
                "Com um limite de espera (`connectionTimeoutMillis`), para que um banco sobrecarregado gere erros rápidos, e não uma fila que só cresce.",
                "Com um pool externo, como o PgBouncer, quando muitas instâncias da aplicação (ou funções serverless) somam mais conexões do que o banco suporta.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um pool maior não deixa o banco mais rápido: além do número de núcleos e discos do servidor, mais conexões simultâneas só disputam os mesmos recursos.",
                "Estado de sessão (`SET`, tabelas temporárias, `search_path`) fica na conexão e acompanha quem a pegar depois; limpe-o ou evite-o.",
                "Em ambientes serverless, cada instância tem o seu pool; sem um pool externo, um pico de tráfego abre conexões demais.",
              ],
            },
          ],
          examples: [
            {
              title: "O vazamento: a conexão que não volta",
              context: "Um caminho de erro sem `release` esgota o pool aos poucos, até a aplicação travar.",
              code: {
                language: "javascript",
                filename: "leak.js",
                code: [
                  "// Errado: se a consulta falhar, a conexão nunca volta ao pool",
                  "async function getProfileLeaky(userId) {",
                  "  const client = await pool.connect();",
                  "  const { rows } = await client.query(\"SELECT * FROM profiles WHERE user_id = $1\", [userId]);",
                  "  client.release();   // não é executado quando a linha de cima lança um erro",
                  "  return rows[0];",
                  "}",
                  "",
                  "// Certo: o finally roda em qualquer caminho",
                  "async function getProfile(userId) {",
                  "  const client = await pool.connect();",
                  "  try {",
                  "    const { rows } = await client.query(\"SELECT * FROM profiles WHERE user_id = $1\", [userId]);",
                  "    return rows[0];",
                  "  } finally {",
                  "    client.release();",
                  "  }",
                  "}",
                  "",
                  "// Sinais do vazamento no pg: pool.totalCount === pool.options.max, pool.idleCount === 0",
                  "// e pool.waitingCount crescendo — até as requisições falharem com \"timeout exceeded when trying to connect\".",
                ].join("\n"),
              },
              explanation:
                "Cada erro na versão errada prende uma conexão para sempre. Com um pool de 10, dez erros bastam para a " +
                "aplicação inteira parar de responder, embora o banco esteja folgado. O `finally`, ou o `pool.query` para " +
                "consultas avulsas, elimina o problema.",
            },
            {
              title: "A conta que precisa fechar: pool × instâncias",
              context: "O limite de conexões é do banco, e cada instância da aplicação tem o seu pool.",
              code: {
                language: "text",
                filename: "pool-math.txt",
                code: [
                  "PostgreSQL:  max_connections = 100   (algumas ficam reservadas para administração)",
                  "",
                  "Aplicação:   6 instâncias × pool de 20 = 120 conexões   → acima do limite",
                  "Job worker:  2 instâncias × pool de 10 =  20 conexões",
                  "                                          --------------",
                  "                                          140 pedidas; o banco recusa as excedentes:",
                  "                                          \"sorry, too many clients already\"",
                  "",
                  "Opções: pools menores por instância (6 × 12 + 2 × 5 = 82);",
                  "        ou um PgBouncer entre as aplicações e o banco, que mantém poucas conexões reais",
                  "        e as reparte entre muitas conexões de clientes.",
                ].join("\n"),
              },
              explanation:
                "Aumentar o pool de uma instância parece inofensivo, mas multiplica pelo número de instâncias, e o total " +
                "escala junto com o autoscaling. O tamanho do pool é uma decisão da capacidade do banco, dividida entre " +
                "tudo o que se conecta a ele.",
            },
            {
              title: "Esperar pouco e falhar cedo",
              context: "Sem um tempo máximo de espera, requisições acumulam enquanto o banco está sobrecarregado.",
              code: {
                language: "javascript",
                filename: "fail-fast.js",
                code: [
                  "const pool = new pg.Pool({ max: 10, connectionTimeoutMillis: 1_500 });",
                  "",
                  "app.get(\"/products/:id\", async (req, res) => {",
                  "  try {",
                  "    const { rows } = await pool.query(\"SELECT id, name, price_cents FROM products WHERE id = $1\", [req.params.id]);",
                  "    if (!rows.length) return res.status(404).end();",
                  "    res.json(rows[0]);",
                  "  } catch (error) {",
                  "    if (/timeout exceeded when trying to connect/.test(error.message)) {",
                  "      res.set(\"Retry-After\", \"2\");",
                  "      return res.status(503).json({ error: \"serviço sobrecarregado, tente de novo em instantes\" });",
                  "    }",
                  "    throw error;",
                  "  }",
                  "});",
                ].join("\n"),
              },
              explanation:
                "Com o banco saturado, esperar indefinidamente só empilha requisições e consome memória. Um limite curto " +
                "transforma a sobrecarga em uma resposta `503` com `Retry-After`, que o cliente e o balanceador de carga " +
                "sabem tratar, e dá ao banco a chance de se recuperar.",
            },
          ],
          exercise: {
            problem:
              "Depois de algumas horas no ar, a API passa a demorar e, por fim, a falhar em todas as rotas, e só volta " +
              "ao normal quando é reiniciada. O banco está ocioso nesses momentos. O pool usado é o abaixo, uma versão " +
              "simplificada do que as bibliotecas fazem.",
            problemCode: {
              language: "javascript",
              filename: "exhaustion.js",
              code: [
                "// Pool mínimo: `max` conexões; quem pede com todas ocupadas espera até `timeoutMs`",
                "function createPool({ max, timeoutMs }) {",
                "  let inUse = 0;",
                "  const waiting = [];",
                "  return {",
                "    get inUse() { return inUse; },",
                "    async acquire() {",
                "      if (inUse < max) { inUse++; return { release: () => this.release() }; }",
                "      return new Promise((resolve, reject) => {",
                "        const timer = setTimeout(() => reject(new Error(\"timeout esperando conexão\")), timeoutMs);",
                "        waiting.push(() => { clearTimeout(timer); resolve({ release: () => this.release() }); });",
                "      });",
                "    },",
                "    release() {",
                "      const next = waiting.shift();",
                "      if (next) next(); else inUse--;",
                "    },",
                "  };",
                "}",
                "",
                "const pool = createPool({ max: 2, timeoutMs: 100 });",
                "",
                "async function getOrder(id) {",
                "  const conn = await pool.acquire();",
                "  if (id <= 0) throw new Error(\"id inválido\");   // caminho de erro",
                "  const order = { id };                          // \"consulta\"",
                "  conn.release();",
                "  return order;",
                "}",
              ].join("\n"),
            },
            task:
              "Mostre, com chamadas a `getOrder`, como dois erros derrubam as chamadas seguintes, e corrija a função " +
              "para que o pool se recupere depois de qualquer erro.",
            hint:
              "Conte `pool.inUse` depois de duas chamadas com id inválido. A devolução precisa acontecer em todos os " +
              "caminhos.",
            solution: {
              code: {
                language: "javascript",
                filename: "exhaustion.fixed.js",
                code: [
                  "// Reprodução: dois erros prendem as duas conexões",
                  "await getOrder(0).catch(() => {});",
                  "await getOrder(-1).catch(() => {});",
                  "pool.inUse;   // 2 — nenhuma voltou",
                  "await getOrder(1).catch((error) => error.message);   // \"timeout esperando conexão\"",
                  "",
                  "// Correção: devolver sempre, no finally",
                  "async function getOrderFixed(id) {",
                  "  const conn = await pool.acquire();",
                  "  try {",
                  "    if (id <= 0) throw new Error(\"id inválido\");",
                  "    return { id };",
                  "  } finally {",
                  "    conn.release();",
                  "  }",
                  "}",
                  "",
                  "const healthy = createPool({ max: 2, timeoutMs: 100 });",
                  "// (com getOrderFixed usando `healthy`) dez erros seguidos deixam healthy.inUse === 0",
                ].join("\n"),
              },
              explanation:
                "O caminho de erro saía da função com a conexão emprestada, e bastaram dois erros para esgotar um pool de " +
                "dois. Com `max` de 10 ou 20, o efeito é o mesmo, só mais lento — por isso a API degradava ao longo de " +
                "horas, com o banco ocioso. O `finally` devolve a conexão em qualquer saída.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Slow Query Analysis",
          requires: ["Query Execution Plan"],
          subtopics: ["slow query log", "p95/p99 por query", "EXPLAIN ANALYZE (plano estimado × real)"],
          note: "consolidada (A20) — absorve Database Profiling",
          summary:
            "O trabalho de descobrir quais consultas deixam o sistema lento — pelo registro das consultas demoradas e " +
            "por estatísticas agregadas por forma de consulta — e de escolher, com dados, quais otimizar primeiro.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Analisar consultas lentas é trabalhar a partir de medições, e não de palpites. Há duas fontes " +
                "principais. O registro de consultas lentas (slow query log) grava cada execução que passou de um limite " +
                "de tempo, com o texto e a duração. As estatísticas agregadas, como a extensão `pg_stat_statements` do " +
                "PostgreSQL, somam as execuções de cada forma de consulta — o mesmo SQL, com valores diferentes nos " +
                "parâmetros — e mostram quantas vezes rodou, o tempo total e a média. Com a lista em mãos, cada consulta " +
                "escolhida é investigada com `EXPLAIN ANALYZE`.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Otimize pelo tempo total, e não pela consulta mais lenta: uma consulta de 5 ms executada um milhão de " +
                "vezes por dia pesa mais que um relatório de 30 segundos que roda uma vez.",
            },
            { type: "heading", text: "Como fazer" },
            {
              type: "list",
              items: [
                "Ligue o registro de lentas com um limite realista (`log_min_duration_statement = 250ms` no PostgreSQL) e a extensão `pg_stat_statements`.",
                "Ordene as formas de consulta pelo tempo total; olhe também a latência alta (p95, p99), que é o que os usuários sentem.",
                "Para cada consulta escolhida, rode `EXPLAIN (ANALYZE, BUFFERS)` com parâmetros reais e compare as linhas estimadas com as reais.",
                "Corrija (índice, reescrita, lote), meça de novo e registre o antes e o depois.",
              ],
            },
            {
              type: "code",
              language: "javascript",
              filename: "top-queries.js",
              code: [
                "// pg_stat_statements agrega por forma de consulta: WHERE id = $1 vale para todos os ids",
                "const { rows } = await pool.query(`",
                "  SELECT query,",
                "         calls,",
                "         round(total_exec_time) AS total_ms,",
                "         round(mean_exec_time::numeric, 2) AS mean_ms,",
                "         rows",
                "  FROM pg_stat_statements",
                "  ORDER BY total_exec_time DESC",
                "  LIMIT 10",
                "`);",
                "",
                "for (const row of rows) console.log(`${row.total_ms} ms no total · ${row.calls}× · média ${row.mean_ms} ms\\n  ${row.query}`);",
              ].join("\n"),
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A média esconde a cauda: uma consulta com média de 20 ms pode ter um p99 de 2 segundos, e é esse que aparece como lentidão para alguém.",
                "Uma consulta pode ser lenta por esperar um lock, e não pelo plano; o `EXPLAIN` não mostra espera, e é preciso olhar `pg_stat_activity` (`wait_event`).",
                "Testar a correção com outros parâmetros ou em uma base pequena dá resultados enganosos; use os valores e o volume que causaram a lentidão.",
                "Registrar todas as consultas, sem limite, gera logs enormes e também custa desempenho; comece por um limite e desça se for preciso.",
              ],
            },
          ],
          examples: [
            {
              title: "Ligar o registro de lentas",
              context: "No PostgreSQL, duas configurações dão as duas fontes de dados.",
              code: {
                language: "text",
                filename: "postgresql.conf",
                code: [
                  "# Toda consulta que passar de 250 ms vai para o log, com o texto e a duração",
                  "log_min_duration_statement = 250ms",
                  "",
                  "# Estatísticas agregadas por forma de consulta",
                  "shared_preload_libraries = 'pg_stat_statements'",
                  "# e, no banco: CREATE EXTENSION pg_stat_statements;",
                  "",
                  "# Planos das consultas lentas, direto no log (útil em produção, com moderação)",
                  "session_preload_libraries = 'auto_explain'",
                  "auto_explain.log_min_duration = '1s'",
                  "auto_explain.log_analyze = on",
                  "",
                  "Exemplo de linha no log:",
                  "LOG:  duration: 1843.221 ms  statement: SELECT * FROM orders WHERE lower(email) = 'ana@example.test'",
                ].join("\n"),
              },
              explanation:
                "O log mostra execuções individuais, com os valores; o `pg_stat_statements` mostra o peso acumulado de " +
                "cada forma de consulta. O `auto_explain` registra o plano no momento em que a consulta foi lenta, o que " +
                "ajuda quando o problema não se reproduz depois.",
            },
            {
              title: "Medir na aplicação: p95 por forma de consulta",
              context: "Sem acesso ao banco, a aplicação pode medir as suas próprias consultas.",
              code: {
                language: "javascript",
                filename: "timed-db.js",
                code: [
                  "import { DatabaseSync } from \"node:sqlite\";",
                  "import { performance } from \"node:perf_hooks\";",
                  "",
                  "const db = new DatabaseSync(\":memory:\");",
                  "const timings = new Map();   // forma da consulta → durações em ms",
                  "",
                  "function timedAll(sql, ...params) {",
                  "  const start = performance.now();",
                  "  const rows = db.prepare(sql).all(...params);",
                  "  const elapsed = performance.now() - start;",
                  "  const shape = sql.replace(/\\s+/g, \" \").trim();   // o SQL com \"?\" já é a forma da consulta",
                  "  if (!timings.has(shape)) timings.set(shape, []);",
                  "  timings.get(shape).push(elapsed);",
                  "  if (elapsed > 250) console.warn(`consulta lenta (${elapsed.toFixed(0)} ms): ${shape}`);",
                  "  return rows;",
                  "}",
                  "",
                  "function report() {",
                  "  const percentile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];",
                  "  return [...timings]",
                  "    .map(([shape, list]) => {",
                  "      const sorted = [...list].sort((a, b) => a - b);",
                  "      const total = sorted.reduce((sum, ms) => sum + ms, 0);",
                  "      return { shape, calls: sorted.length, total, p95: percentile(sorted, 95) };",
                  "    })",
                  "    .sort((a, b) => b.total - a.total);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agrupar pela forma da consulta, com os parâmetros como `?`, é o que permite somar as execuções de uma " +
                "mesma consulta. O relatório ordena pelo tempo total e mostra o p95; em produção, as mesmas medidas " +
                "costumam ir para uma ferramenta de métricas ou de rastreamento.",
            },
            {
              title: "Lenta por esperar, e não por calcular",
              context: "A consulta tem um plano bom, e mesmo assim às vezes demora segundos.",
              code: {
                language: "text",
                filename: "lock-wait.txt",
                code: [
                  "-- Quem está esperando o quê, agora",
                  "SELECT pid, state, wait_event_type, wait_event, now() - query_start AS rodando_ha, query",
                  "FROM pg_stat_activity",
                  "WHERE state <> 'idle' AND wait_event_type IS NOT NULL;",
                  "",
                  "  pid  | wait_event_type | wait_event    | rodando_ha | query",
                  " ------+-----------------+---------------+------------+--------------------------------------------",
                  "  4121 | Lock            | transactionid | 00:00:04.2 | UPDATE products SET stock = stock - 1 ...",
                  "  4098 | Client          | ClientRead    | 00:02:31.0 | (idle in transaction) ...",
                  "",
                  "-- E quem está bloqueando cada uma",
                  "SELECT pid, pg_blocking_pids(pid) AS bloqueada_por FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;",
                ].join("\n"),
              },
              explanation:
                "O `UPDATE` do pid 4121 espera um lock que a sessão 4098 segura, uma transação aberta e esquecida há mais " +
                "de dois minutos. Nenhum índice resolve isso: o que resolve é encerrar a transação esquecida e corrigir o " +
                "código que a deixou aberta.",
            },
          ],
          exercise: {
            problem:
              "O time tem tempo para otimizar uma consulta nesta semana. Alguém sugeriu o relatório mensal, \"a consulta " +
              "mais lenta do sistema\". Os números de um dia, tirados do `pg_stat_statements`, estão abaixo.",
            problemCode: {
              language: "javascript",
              filename: "pick-target.js",
              code: [
                "// Um dia de pg_stat_statements (tempos em ms)",
                "const stats = [",
                "  { query: \"SELECT ... FROM monthly_report($1)\",                     calls: 2,       mean_ms: 38_000, p99_ms: 41_000 },",
                "  { query: \"SELECT id, name FROM products WHERE id = $1\",            calls: 900_000, mean_ms: 0.4,    p99_ms: 2 },",
                "  { query: \"SELECT * FROM carts WHERE lower(user_email) = lower($1)\", calls: 120_000, mean_ms: 45,     p99_ms: 380 },",
                "  { query: \"UPDATE sessions SET seen_at = now() WHERE token = $1\",   calls: 650_000, mean_ms: 1.1,    p99_ms: 9 },",
                "];",
              ].join("\n"),
            },
            task:
              "Calcule o tempo total de cada consulta, ordene e escolha qual otimizar primeiro. Diga também o que o " +
              "`p99` da consulta escolhida sugere e qual seria o primeiro passo da investigação.",
            hint:
              "Tempo total = chamadas × média. Uma consulta com `lower(...)` sobre uma coluna costuma ter um problema " +
              "conhecido.",
            solution: {
              code: {
                language: "javascript",
                filename: "pick-target.answer.js",
                code: [
                  "const ranked = stats",
                  "  .map((s) => ({ ...s, total_s: Math.round((s.calls * s.mean_ms) / 1000) }))",
                  "  .sort((a, b) => b.total_s - a.total_s);",
                  "",
                  "ranked.map((s) => `${s.total_s} s — ${s.query}`);",
                  "// [ \"5400 s — SELECT * FROM carts WHERE lower(user_email) = lower($1)\",",
                  "//   \"715 s — UPDATE sessions SET seen_at = now() WHERE token = $1\",",
                  "//   \"360 s — SELECT id, name FROM products WHERE id = $1\",",
                  "//   \"76 s — SELECT ... FROM monthly_report($1)\" ]",
                  "",
                  "// Escolhida: a busca de carrinhos. 1h30 de banco por dia, e p99 de 380 ms na tela do carrinho.",
                  "// Primeiro passo: EXPLAIN (ANALYZE, BUFFERS) com um e-mail real — lower(user_email) deve estar",
                  "// provocando Seq Scan; a correção provável é um índice em lower(user_email) ou o e-mail já normalizado.",
                ].join("\n"),
              },
              explanation:
                "O relatório mensal é a execução mais lenta, mas roda duas vezes por dia e soma pouco mais de um minuto. " +
                "A busca de carrinhos consome 5.400 segundos por dia e ainda tem um p99 alto em uma tela que os clientes " +
                "usam; otimizá-la libera o banco e melhora a experiência de muita gente.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "nosql",
      order: 80,
      title: "NoSQL",
      requires: ["Database Design"],
      summary:
        "SQL vs NoSQL → data models (KV/Document/Wide-Column/Graph consolidados) → schema-on-read → " +
        "escolher SQL vs NoSQL. Story pequena deliberada — modelo mental próprio.",
      concepts: [
        concept({ order: 10, title: "SQL vs NoSQL", requires: ["Database Design / Normalization"], note: "motivação: escala horizontal, esquema flexível, modelo de acesso" }),
        concept({
          order: 20,
          title: "NoSQL Data Models (KV / Document / Wide-Column / Graph)",
          requires: ["SQL vs NoSQL"],
          subtopics: ["key-value (cache, sessão)", "document — revisita Software Design / Domain Modeling / Aggregate (documento ≈ aggregate)", "wide-column (série temporal, escala de escrita)", "graph (relações profundas)"],
          note: "consolidada (A8)",
          revisit: ["Software Design / Domain Modeling / Aggregate"],
        }),
        concept({ order: 30, title: "Schema-on-Read", requires: ["NoSQL Data Models (KV / Document / Wide-Column / Graph)"], collision: "≠ Database Schema (Database Fundamentals) — validação movida para a aplicação" }),
        concept({ order: 40, title: "Choosing SQL vs NoSQL", requires: ["NoSQL Data Models (KV / Document / Wide-Column / Graph)"], note: "polyglot persistence; NoSQL não é 'sem trade-off'" }),
      ],
    }),
    module({
      slug: "caching",
      order: 90,
      title: "Caching",
      requires: ["Web Fundamentals", "Database Fundamentals"],
      summary:
        "Cache (+ hit/miss) → TTL → invalidação → eviction → cache-aside → read/write-through/write-behind → " +
        "in-memory data store → browser & HTTP cache → CDN. Canônico de 'Caching (patterns)' para o roadmap.",
      concepts: [
        concept({
          order: 10,
          title: "Cache",
          subtopics: ["hit / miss", "hit ratio", "cold/warm"],
          note: "canônico p/ todo o roadmap. Memoization = cache em processo (revisita Programming Foundations / Algorithms & Complexity). Absorve Cache Hit / Miss",
          revisit: ["Programming Foundations / Algorithms & Complexity / Memoization"],
        }),
        concept({ order: 20, title: "TTL", requires: ["Cache"], collision: "TTL de cache ≠ TTL de DNS (Web Fundamentals) ≠ TTL de pacote IP" }),
        concept({ order: 30, title: "Cache Invalidation", requires: ["Cache"], note: "o problema difícil; invalidação por evento × por tempo" }),
        concept({ order: 40, title: "Cache Eviction (LRU / LFU / FIFO)", requires: ["Cache"], subtopics: ["LRU", "LFU", "FIFO", "random", "pressão de memória × staleness"], note: "consolidada (A12) — absorve LRU" }),
        concept({ order: 50, title: "Cache-Aside", requires: ["Cache Invalidation"], note: "padrão mais comum; app orquestra" }),
        concept({ order: 60, title: "Read-Through / Write-Through / Write-Behind", requires: ["Cache"], subtopics: ["read-through", "write-through", "write-behind/write-back (risco de perda)"], note: "consolidada (A19)" }),
        concept({ order: 70, title: "In-Memory Data Store", requires: ["Cache"], subtopics: ["Redis", "Valkey", "Memcached"], note: "arquétipo: single-thread, estruturas de dados, persistência, uso como cache × store" }),
        concept({
          order: 80,
          title: "Browser & HTTP Cache",
          requires: ["Cache"],
          subtopics: ["Cache-Control", "ETag / Last-Modified", "revalidação (304)", "private × shared"],
          note: "consolidada (B2) — revisita Web Fundamentals / HTTP Headers",
          revisit: ["Platform / Web Fundamentals / HTTP Headers"],
        }),
        concept({ order: 90, title: "CDN", requires: ["Browser & HTTP Cache"], note: "edge, origin pull/push, invalidação/purge, TTL de borda. Architecture / Caching at Scale revisita" }),
      ],
    }),
    module({
      slug: "authentication",
      order: 100,
      title: "Authentication",
      requires: ["Web Fundamentals"],
      summary:
        "Auth vs authz → password hashing → session × token → JWT → access/refresh → OAuth 2.0 → OIDC → SSO → MFA.",
      concepts: [
        concept({ order: 10, title: "Authentication vs Authorization", note: "framing; 'quem é você' × 'o que você pode'" }),
        concept({ order: 20, title: "Password Hashing", note: "bcrypt/scrypt/argon2, salt, fator de custo; nunca reversível" }),
        concept({
          order: 30,
          title: "Session-Based Authentication",
          requires: ["Web Fundamentals / Sessions"],
          collision: "usa Sessions (Web Fundamentals) como mecanismo",
        }),
        concept({ order: 40, title: "Token-Based Authentication", requires: ["Web Fundamentals / Cookies"], note: "stateless; onde guardar o token (cookie vs storage)" }),
        concept({ order: 50, title: "JWT", requires: ["Token-Based Authentication"], note: "header/payload/signature; claims; JWT ≠ criptografado por padrão" }),
        concept({ order: 60, title: "Access & Refresh Token", requires: ["JWT"], subtopics: ["access (curto)", "refresh (longo, rotação, revogação)"], note: "consolidada (B3)" }),
        concept({ order: 70, title: "OAuth 2.0", requires: ["Token-Based Authentication"], note: "papéis, Authorization Code + PKCE; autorização delegada, não login" }),
        concept({ order: 80, title: "OpenID Connect (OIDC)", requires: ["OAuth 2.0"], note: "camada de identidade sobre OAuth; id_token" }),
        concept({ order: 90, title: "Single Sign-On (SSO)", requires: ["Authentication vs Authorization"], note: "IdP, SAML (menção) × OIDC" }),
        concept({ order: 100, title: "Multi-Factor Authentication (MFA)", requires: ["Authentication vs Authorization"], note: "fatores; TOTP, WebAuthn/passkeys (menção)" }),
      ],
    }),
    module({
      slug: "authorization",
      order: 110,
      title: "Authorization",
      requires: ["Authentication"],
      summary:
        "RBAC → ABAC → permission-based → Principle of Least Privilege (canônico do roadmap) → resource ownership. " +
        "Story pequena mas coerente (authz ≠ authn).",
      concepts: [
        concept({ order: 10, title: "Role-Based Access Control (RBAC)", note: "papéis → permissões → usuários" }),
        concept({ order: 20, title: "Attribute-Based Access Control (ABAC)", note: "políticas sobre atributos (usuário/recurso/ambiente); mais flexível, mais complexo" }),
        concept({ order: 30, title: "Permission-Based Authorization", note: "checagem fina no ponto de uso" }),
        concept({ order: 40, title: "Principle of Least Privilege", note: "canônico do roadmap — Cloud Security / Least Privilege in Cloud e AI Engineering / AI Safety revisitam com Requires para cá" }),
        concept({ order: 50, title: "Resource Ownership", note: "'é seu?'; multi-tenancy; IDOR liga com Application Security / Broken Access Control" }),
      ],
    }),
    module({
      slug: "application-security",
      order: 120,
      title: "Application Security",
      requires: ["Authentication", "Authorization", "Web Fundamentals"],
      summary:
        "Threat modeling → OWASP Top 10 → ataques (SQLi/XSS/CSRF/SSRF/BAC) → input validation (canônico, segurança) → " +
        "output encoding → CSP → security headers → secrets → encryption → dependency vulnerabilities.",
      concepts: [
        concept({ order: 10, title: "Threat Modeling", note: "STRIDE, superfície de ataque, trust boundaries; loose ref a fronteiras de módulo (Epic 04)" }),
        concept({ order: 20, title: "OWASP Top 10", requires: ["Threat Modeling"], note: "framing do resto da Story" }),
        concept({ order: 30, title: "SQL Injection", requires: ["Database Fundamentals / SQL"], note: "queries parametrizadas; ORM não é imunidade automática" }),
        concept({ order: 40, title: "Cross-Site Scripting (XSS)", requires: ["Web Fundamentals / Same-Origin Policy"], note: "stored/reflected/DOM" }),
        concept({ order: 50, title: "Cross-Site Request Forgery (CSRF)", requires: ["Web Fundamentals / Cookies"], note: "tokens anti-CSRF, SameSite" }),
        concept({ order: 60, title: "Server-Side Request Forgery (SSRF)", note: "relevante em cloud (metadata endpoint) — liga com Cloud Security" }),
        concept({
          order: 70,
          title: "Broken Access Control",
          requires: ["Authorization / Resource Ownership"],
          note: "IDOR — revisita Authorization / Resource Ownership",
          revisit: ["Platform / Authorization / Resource Ownership"],
        }),
        concept({
          order: 80,
          title: "Input Validation",
          note: "canônico — allowlist na fronteira, defesa contra entrada inválida/maliciosa. API Fundamentals / Request Validation trata o mesmo tema no contexto de contrato/request (conceitos distintos, pointer)",
          collision: "≠ API Fundamentals / Request Validation — segurança × validação de contrato",
        }),
        concept({ order: 90, title: "Output Encoding", requires: ["Cross-Site Scripting (XSS)"], note: "encoding contextual (HTML/attr/JS/URL)" }),
        concept({ order: 100, title: "Content Security Policy (CSP)", requires: ["Cross-Site Scripting (XSS)", "Web Fundamentals / HTTP Headers"], note: "defesa em profundidade contra XSS; nonce/hash" }),
        concept({ order: 110, title: "Security Headers", requires: ["Web Fundamentals / HTTP Headers"], note: "HSTS, X-Content-Type-Options, frame-ancestors, Referrer-Policy" }),
        concept({
          order: 120,
          title: "Secrets Management",
          note: "rotação, nunca em VCS — revisita Software Craft (.gitignore, história do Git)",
          collision: "≠ Environments & Configuration (CI/CD) ≠ Secret Manager serviço (Cloud Security) ≠ K8s Secret",
        }),
        concept({
          order: 130,
          title: "Encryption at Rest & in Transit",
          requires: ["Web Fundamentals / TLS"],
          subtopics: ["at rest (disco/DB/campo, KMS, envelope)", "in transit — revisita TLS"],
          note: "consolidada (B4)",
          revisit: ["Platform / Web Fundamentals / TLS"],
        }),
        concept({ order: 140, title: "Dependency Vulnerabilities", subtopics: ["SCA", "CVE/CVSS", "dependências transitivas", "auditoria de lockfile", "supply chain (menção)"], note: "mantida aqui (D6 alterada)" }),
      ],
    }),
    module({
      slug: "observability",
      order: 130,
      title: "Observability",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Observability vs monitoring → logging → structured logging → log levels → correlation ID → metrics " +
        "(+ dashboard) → distributed tracing → OpenTelemetry → alerting.",
      concepts: [
        concept({ order: 10, title: "Observability vs Monitoring", note: "consolidada (C1) — absorve Monitoring. 'unknown unknowns' × dashboards pré-definidos" }),
        concept({ order: 20, title: "Logging" }),
        concept({ order: 30, title: "Structured Logging", requires: ["Logging"], note: "JSON, campos consultáveis" }),
        concept({ order: 40, title: "Log Levels", requires: ["Logging"], note: "ERROR/WARN/INFO/DEBUG; custo e ruído" }),
        concept({ order: 50, title: "Correlation ID", requires: ["Structured Logging"], note: "propagação por request; base do tracing" }),
        concept({ order: 60, title: "Metrics", subtopics: ["Dashboard"], note: "counter/gauge/histogram; RED e USE — absorve Dashboard" }),
        concept({ order: 70, title: "Distributed Tracing (Span / trace context)", requires: ["Correlation ID"], subtopics: ["trace", "span (pai/filho)", "propagação de trace context (W3C)", "sampling"], note: "consolidada (A11) — Tracing + Distributed Tracing + Span" }),
        concept({ order: 80, title: "OpenTelemetry", requires: ["Metrics", "Distributed Tracing (Span / trace context)"], note: "padrão CNCF vendor-neutral; SDK + collector, semantic conventions. AI Engineering / AI Observability revisita" }),
        concept({ order: 90, title: "Alerting", requires: ["Metrics"], note: "alertar em sintoma, não causa; fadiga de alerta" }),
      ],
    }),
    module({
      slug: "performance-engineering",
      order: 140,
      title: "Performance Engineering",
      requires: ["Observability"],
      summary:
        "Performance × scalability → latency/throughput (canônicos do roadmap) → CPU vs I/O bound (canônico aqui) → " +
        "profiling (novo lar canônico) → benchmarking → bottleneck analysis → lazy × eager → debounce/throttle → compression.",
      suggestions: ["Performance Budget — retirado para subtopic; Task própria se reforçar o lado frontend"],
      concepts: [
        concept({ order: 10, title: "Performance vs Scalability", collision: "Scalability conceito é canônico em Architecture — aqui é só o contraste 'rápido para 1 × rápido para N'" }),
        concept({ order: 20, title: "Latency", note: "canônico do roadmap — Architecture / System Design Fundamentals revisita 'em escala'. p50/p95/p99" }),
        concept({ order: 30, title: "Throughput", note: "canônico do roadmap. Lei de Little (menção)" }),
        concept({
          order: 40,
          title: "CPU-Bound vs I/O-Bound",
          note: "canônico do roadmap — casa canônica é Platform / Performance Engineering (Fase 1). Revisita Programming Foundations / Concurrency, Asynchronous Programming (pointer, não lacuna do Epic 01)",
          revisit: ["Programming Foundations / Concurrency", "Programming Foundations / Asynchronous Programming"],
        }),
        concept({
          order: 50,
          title: "Profiling",
          requires: ["CPU-Bound vs I/O-Bound"],
          note: "canônico (não tinha lar antes). Revisita Programming Foundations / Memory & Runtime / GC, Memory Leak; Testing & Quality Engineering / Debugging (postura empírica); flame graph",
          revisit: ["Programming Foundations / Memory & Runtime / Garbage Collection", "Programming Foundations / Memory & Runtime / Memory Leak", "Testing & Quality Engineering / Debugging"],
        }),
        concept({ order: 60, title: "Benchmarking", note: "micro × macro; warm-up; variância" }),
        concept({ order: 70, title: "Bottleneck Analysis", requires: ["Profiling"], note: "teoria das restrições; otimizar o gargalo, não o resto" }),
        concept({ order: 80, title: "Lazy vs Eager Loading", subtopics: ["lazy (sob demanda, risco N+1)", "eager (upfront, risco over-fetch)"], note: "consolidada (B5) — revisita Database Performance / N+1", revisit: ["Platform / Database Performance / N+1 Query Problem"] }),
        concept({ order: 90, title: "Debounce / Throttle", subtopics: ["debounce (espera silêncio)", "throttle (taxa máxima)"], note: "consolidada (B6) — par clássico, muito confundido" }),
        concept({ order: 100, title: "Compression", note: "gzip/brotli; Content-Encoding; trade-off CPU × banda" }),
      ],
    }),
    module({
      slug: "reliability-engineering",
      order: 150,
      title: "Reliability Engineering",
      requires: ["Observability"],
      summary:
        "SLI → SLO → SLA → error budget → incident → MTTD/MTTR → incident response → postmortem (blameless).",
      concepts: [
        concept({ order: 10, title: "SLI", requires: ["Observability / Metrics"], note: "o que medir (a métrica do usuário)" }),
        concept({ order: 20, title: "SLO", requires: ["SLI"], note: "o alvo" }),
        concept({ order: 30, title: "SLA", requires: ["SLO"], note: "o contrato (com consequência); SLA ⊂ SLO ⊂ SLI" }),
        concept({ order: 40, title: "Error Budget", requires: ["SLO"], note: "1 − SLO; política de queima; freia release" }),
        concept({ order: 50, title: "Incident", note: "severidade; declarar um incidente" }),
        concept({ order: 60, title: "MTTD / MTTR", requires: ["Incident"], subtopics: ["MTTD", "MTTR", "MTTA", "MTBF (menção)"], note: "consolidada (B7)" }),
        concept({
          order: 70,
          title: "Incident Response",
          requires: ["Incident"],
          note: "revisita Testing & Quality Engineering / Debugging (Reproduction, Hypothesis-Driven Debugging); Software Craft / Runbook (o artefato que guia a resposta)",
          revisit: ["Testing & Quality Engineering / Debugging / Reproduction", "Testing & Quality Engineering / Debugging / Hypothesis-Driven Debugging", "Software Craft / Engineering Documentation / Runbook"],
        }),
        concept({
          order: 80,
          title: "Postmortem (Blameless)",
          requires: ["Incident Response"],
          subtopics: ["timeline", "causa raiz (revisita RCA)", "cultura blameless", "ações com dono/prazo"],
          note: "consolidada (B8) — revisita Testing & Quality Engineering / Debugging / Root Cause Analysis",
          revisit: ["Testing & Quality Engineering / Debugging / Root Cause Analysis"],
        }),
      ],
    }),
    module({
      slug: "containers",
      order: 160,
      title: "Containers",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary:
        "Container (namespaces + cgroups) → container vs VM → Docker → Docker Image (+ Dockerfile) → registry → " +
        "volumes & networks (+ Compose) → multi-stage build.",
      concepts: [
        concept({
          order: 10,
          title: "Container",
          note: "namespaces + cgroups isolam processos — revisita Programming Foundations / Concurrency / Process. Absorve 'Docker Container' do rascunho",
          revisit: ["Programming Foundations / Concurrency / Process"],
        }),
        concept({
          order: 20,
          title: "Container vs Virtual Machine",
          requires: ["Container"],
          note: "kernel compartilhado × hypervisor — revisita Programming Foundations / Concurrency / Process, Thread",
          revisit: ["Programming Foundations / Concurrency / Process", "Programming Foundations / Concurrency / Thread"],
        }),
        concept({ order: 30, title: "Docker", requires: ["Container"], note: "engine, daemon, CLI" }),
        concept({
          order: 40,
          title: "Docker Image",
          requires: ["Docker"],
          subtopics: ["Dockerfile — instruções, ordem e cache de layers", "layers, união, tags, digest"],
          note: "absorve Dockerfile do rascunho",
          collision: "≠ Artifact de build (CI/CD)",
        }),
        concept({ order: 50, title: "Docker Registry", requires: ["Docker Image"], note: "push/pull; público × privado" }),
        concept({
          order: 60,
          title: "Docker Volumes & Networks",
          requires: ["Docker"],
          subtopics: ["volumes (named, bind, tmpfs)", "networks (bridge, host, DNS entre containers)", "Docker Compose — multi-container local, não é orquestrador de produção"],
          note: "consolidada (B9) — absorve Docker Compose",
        }),
        concept({ order: 70, title: "Multi-Stage Build", requires: ["Docker Image"], note: "imagem final enxuta; separar build de runtime" }),
      ],
    }),
    module({
      slug: "ci-cd",
      order: 170,
      title: "CI/CD",
      requires: ["Containers"],
      summary:
        "CI → CD (delivery/deployment) → pipeline → build → artifact → deployment → environments & configuration → " +
        "feature flags → rollback → deployment strategies. Pipeline revisita o Epic 02 (gates de teste).",
      concepts: [
        concept({ order: 10, title: "Continuous Integration", collision: "≠ Integration Testing (Testing & Quality Engineering) — integrar código com frequência × teste multi-componente" }),
        concept({ order: 20, title: "Continuous Delivery", requires: ["Continuous Integration"], note: "sempre pronto para release; passo manual de deploy" }),
        concept({ order: 30, title: "Continuous Deployment", requires: ["Continuous Delivery"], note: "deploy automático após pipeline verde" }),
        concept({ order: 40, title: "CI/CD Pipeline", requires: ["Continuous Integration"], note: "stages, gates, fail-fast. Revisita Epic 02: Test Runner, Assertion, Code Coverage, Test Isolation, Flaky Tests, Regression Testing (sem Task nova)", revisit: ["Testing & Quality Engineering / Testing Strategy / Code Coverage", "Testing & Quality Engineering / Testing Strategy / Test Isolation", "Testing & Quality Engineering / Testing Strategy / Regression Testing"] }),
        concept({ order: 50, title: "Build", note: "reproduzível, hermético — revisita Software Craft (SUGESTÃO Build & Tooling)" }),
        concept({ order: 60, title: "Artifact", requires: ["Build"], collision: "≠ Docker Image (Containers) ≠ Artifact do Jira; imutável, versionado, promovido entre ambientes" }),
        concept({ order: 70, title: "Deployment", requires: ["Artifact"], note: "guarda-chuva real (precede Strategies/Rollback/Feature Flags)" }),
        concept({ order: 80, title: "Environments & Configuration", subtopics: ["dev/staging/prod", "paridade dev-prod", "12-factor config", "environment variables"], note: "consolidada (§D/§G) — funde Environment + Environment Variables", collision: "≠ Secrets Management (Application Security)" }),
        concept({ order: 90, title: "Feature Flags", note: "desacoplar deploy de release; kill switch; dívida de flag" }),
        concept({
          order: 100,
          title: "Rollback",
          requires: ["Deployment"],
          note: "mesma ideia de Software Craft / Git / Revert, nível de deploy; migração compatível com rollback",
          revisit: ["Software Craft / Git / Revert"],
        }),
        concept({ order: 110, title: "Deployment Strategies (Rolling / Blue-Green / Canary)", requires: ["Deployment"], subtopics: ["recreate (menção)", "rolling", "blue-green", "canary — revisita Testing Strategy (teste em produção)"], note: "consolidada (A9)", revisit: ["Testing & Quality Engineering / Testing Strategy"] }),
      ],
    }),
    module({
      slug: "cloud-fundamentals",
      order: 180,
      title: "Cloud Fundamentals",
      requires: ["Containers"],
      summary:
        "Cloud computing → service models → region/AZ → compute & VM → storage types → managed database → " +
        "load balancer e auto scaling (primitivos; conceito canônico em Architecture) → serverless (primitivo canônico aqui).",
      concepts: [
        concept({ order: 10, title: "Cloud Computing", note: "elasticidade, pay-as-you-go, responsabilidade compartilhada (menção → Cloud Security)" }),
        concept({ order: 20, title: "Cloud Service Models (IaaS / PaaS / SaaS)", requires: ["Cloud Computing"], subtopics: ["IaaS", "PaaS", "SaaS", "FaaS (ponte p/ Serverless)", "o que você gerencia em cada"], note: "consolidada (A10)" }),
        concept({ order: 30, title: "Region & Availability Zone", requires: ["Cloud Computing"], subtopics: ["region", "AZ", "latência", "residência de dado", "isolamento de falha"], note: "consolidada (B10)" }),
        concept({ order: 40, title: "Compute & Virtual Machine", requires: ["Cloud Computing"], subtopics: ["instância", "famílias/sizing", "machine image", "spot/reserved"], note: "consolidada (B11)" }),
        concept({ order: 50, title: "Cloud Storage Types (Object / Block)", requires: ["Cloud Computing"], subtopics: ["object (blob, API HTTP, durabilidade 11-noves)", "block (volume, baixa latência)", "file (menção)"], note: "consolidada (B12)" }),
        concept({ order: 60, title: "Managed Database", requires: ["Cloud Service Models (IaaS / PaaS / SaaS)"], note: "o que a nuvem assume (backup, patch, failover) — revisita as Stories de banco", revisit: ["Platform / Database Fundamentals", "Platform / Database Performance"] }),
        concept({
          order: 70,
          title: "Load Balancer",
          requires: ["Compute & Virtual Machine"],
          canonical: false,
          revisitOf: "Architecture / Scalability / Load Balancing",
          note: "o primitivo de cloud (L4/L7, health checks, algoritmos); o conceito Load Balancing permanece canônico em Architecture / Scalability. Recurso concreto de cloud não vira nova casa canônica",
        }),
        concept({
          order: 80,
          title: "Auto Scaling",
          requires: ["Compute & Virtual Machine"],
          canonical: false,
          revisitOf: "Architecture / Scalability / Auto Scaling",
          note: "primitivo aqui (políticas por métrica, min/max, cooldown); conceito em Architecture / Scalability. Requires: Load Balancer removido — LB não é pré-requisito conceitual de Auto Scaling",
        }),
        concept({ order: 90, title: "Serverless", requires: ["Cloud Service Models (IaaS / PaaS / SaaS)"], note: "primitivo canônico — FaaS, cold start, statelessness, limites, modelo de preço. Architecture / Architectural Styles revisita o estilo 'serverless'" }),
      ],
    }),
    module({
      slug: "cloud-networking",
      order: 190,
      title: "Cloud Networking",
      requires: ["Web Fundamentals"],
      summary: "VPC → subnet (public/private) → CIDR & IP → firewall & security group → NAT & internet gateway → DNS in cloud.",
      concepts: [
        concept({ order: 10, title: "VPC", note: "rede isolada logicamente" }),
        concept({ order: 20, title: "Subnet (Public vs Private)", requires: ["VPC"], subtopics: ["subnet", "route table", "pública (rota p/ IGW)", "privada"], note: "consolidada (B13)" }),
        concept({
          order: 30,
          title: "CIDR & IP Address",
          subtopics: ["IPv4/IPv6", "notação CIDR /n", "faixas privadas", "sizing de subnet"],
          note: "consolidada (B14) — revisita Web Fundamentals / DNS, TCP",
          revisit: ["Platform / Web Fundamentals / DNS", "Platform / Web Fundamentals / TCP vs UDP"],
        }),
        concept({ order: 40, title: "Firewall & Security Group", requires: ["Subnet (Public vs Private)"], subtopics: ["security group (stateful, por instância)", "NACL (stateless, por subnet)", "ingress/egress"], note: "consolidada (B15)", collision: "≠ Application Security (controles L7)" }),
        concept({ order: 50, title: "NAT & Internet Gateway", requires: ["Subnet (Public vs Private)"], subtopics: ["IGW (entrada/saída pública)", "NAT gateway (só egress de subnet privada)"], note: "consolidada (B16)" }),
        concept({ order: 60, title: "DNS in Cloud", requires: ["Web Fundamentals / DNS"], note: "zonas privadas, service discovery por DNS, split-horizon", revisit: ["Platform / Web Fundamentals / DNS"] }),
      ],
    }),
    module({
      slug: "cloud-security",
      order: 200,
      title: "Cloud Security",
      requires: ["Authorization", "Cloud Fundamentals"],
      summary: "IAM → user vs role → policy → service account → least privilege in cloud (revisita) → secret manager → shared responsibility.",
      concepts: [
        concept({ order: 10, title: "IAM", requires: ["Authorization / Role-Based Access Control (RBAC)"], note: "identidades, autenticação de máquina, federação — revisita Authorization", revisit: ["Platform / Authorization"] }),
        concept({ order: 20, title: "User vs Role", requires: ["IAM"], note: "credencial de longa duração × assumida temporariamente" }),
        concept({ order: 30, title: "Policy", requires: ["IAM"], collision: "documento de permissão de cloud (allow/deny, recurso, condição) ≠ política ABAC (Authorization)" }),
        concept({ order: 40, title: "Service Account", requires: ["User vs Role"], note: "identidade de workload; evitar chaves estáticas" }),
        concept({
          order: 50,
          title: "Least Privilege in Cloud",
          requires: ["Policy", "Authorization / Principle of Least Privilege"],
          canonical: false,
          revisitOf: "Platform / Authorization / Principle of Least Privilege",
          note: "aplica o canônico da Authorization; escopo mínimo, sem wildcard",
        }),
        concept({ order: 60, title: "Secret Manager", requires: ["IAM"], collision: "o serviço gerenciado (rotação automática, auditoria) ≠ Secrets Management prática (Application Security) ≠ K8s Secret" }),
        concept({ order: 70, title: "Shared Responsibility Model", requires: ["Cloud Fundamentals / Cloud Computing"], note: "o que é do provedor × do cliente, por modelo de serviço" }),
      ],
    }),
    module({
      slug: "kubernetes-fundamentals",
      order: 210,
      title: "Kubernetes Fundamentals",
      requires: ["Containers", "Cloud Networking"],
      summary:
        "Kubernetes → cluster & node → pod → deployment & replicaset → service → ingress → configmap & secret → " +
        "HPA → liveness & readiness probes. Versão enxuta (13→9, 100% consolidação).",
      suggestions: ["Namespace, DaemonSet, StatefulSet, Job/CronJob, PersistentVolume, Helm — caminho 'Advanced'"],
      concepts: [
        concept({ order: 10, title: "Kubernetes", requires: ["Containers / Docker"], note: "orquestrador; estado desejado × reconciliação (control loop)" }),
        concept({ order: 20, title: "Cluster & Node", requires: ["Kubernetes"], subtopics: ["control plane (API server, etcd, scheduler, controller manager)", "worker (kubelet, kube-proxy, runtime)"], note: "consolidada (A22)" }),
        concept({ order: 30, title: "Pod", requires: ["Kubernetes"], note: "menor unidade; 1+ containers; efêmero" }),
        concept({ order: 40, title: "Deployment & ReplicaSet", requires: ["Pod"], subtopics: ["ReplicaSet (réplicas desejadas)", "Deployment (rollout/rollback, histórico de revisão)"], note: "consolidada (A21)" }),
        concept({ order: 50, title: "Service", requires: ["Pod"], collision: "K8s Service ≠ Service Layer/Domain Service (Software Design) ≠ Service Account (Cloud Security); ClusterIP/NodePort/LoadBalancer" }),
        concept({ order: 60, title: "Ingress", requires: ["Service"], note: "roteamento HTTP L7 para dentro do cluster; ingress controller" }),
        concept({ order: 70, title: "ConfigMap & Secret", requires: ["Pod"], subtopics: ["ConfigMap (não sensível)", "Secret (base64, não cifrado em repouso por padrão)", "montar como env/volume"], note: "consolidada (B17)", collision: "K8s Secret é base64 — ver Application Security / Cloud Security" }),
        concept({
          order: 80,
          title: "Horizontal Pod Autoscaler",
          requires: ["Deployment & ReplicaSet", "Observability / Metrics"],
          note: "escala por métrica; análogo a Auto Scaling (Cloud Fundamentals) no nível de pod",
          revisit: ["Platform / Cloud Fundamentals / Auto Scaling"],
        }),
        concept({ order: 90, title: "Liveness & Readiness Probes", requires: ["Pod"], subtopics: ["liveness (reinicia)", "readiness (tira de rotação)", "startup probe"], note: "consolidada (A23) — revisita Architecture / Availability (health check, graceful degradation)", revisit: ["Architecture / Availability & Reliability"] }),
      ],
    }),
  ],
});
