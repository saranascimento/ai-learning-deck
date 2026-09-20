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
        concept({ order: 10, title: "GraphQL Schema & Type System", subtopics: ["SDL", "scalars/object/enum/input types", "nullability", "schema como contrato"], note: "consolidada (A13) — absorve Nullability" }),
        concept({ order: 20, title: "Query / Mutation / Subscription", requires: ["GraphQL Schema & Type System"], subtopics: ["query (leitura)", "mutation (escrita)", "subscription (tempo real — revisita WebSocket)"], note: "consolidada (A14)" }),
        concept({ order: 30, title: "Resolver", requires: ["GraphQL Schema & Type System"], note: "função por campo; resolver chain" }),
        concept({
          order: 40,
          title: "N+1 in Resolvers",
          requires: ["Resolver"],
          canonical: false,
          revisitOf: "Platform / Database Performance / N+1 Query Problem",
          note: "manifestação GraphQL (resolver dispara 1 query por item); GraphQL revisita, não cria 2ª canônica",
        }),
        concept({ order: 50, title: "Batching & Per-Request Caching", requires: ["N+1 in Resolvers"], subtopics: ["DataLoader"], note: "estratégia vendor-agnostic de mitigação do N+1: batching + cache por request" }),
        concept({ order: 60, title: "Query Complexity", requires: ["Resolver"], note: "custo/profundidade, limites, timeout — superfície de ataque DoS" }),
        concept({ order: 70, title: "GraphQL vs REST", requires: ["API Fundamentals / REST", "GraphQL Schema & Type System"], note: "quando cada um; over/under-fetching; caching; tooling" }),
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
        concept({ order: 10, title: "Relational Database", note: "modelo relacional, tuplas/relações" }),
        concept({ order: 20, title: "SQL", requires: ["Relational Database"], note: "DDL/DML/DQL" }),
        concept({ order: 30, title: "Table", requires: ["Relational Database"], note: "a unidade que PK/FK/Constraint referenciam" }),
        concept({ order: 40, title: "Primary Key", requires: ["Table"], collision: "≠ Natural vs Surrogate Key (Database Design) — que discute a escolha" }),
        concept({ order: 50, title: "Foreign Key", requires: ["Primary Key"], note: "integridade referencial" }),
        concept({ order: 60, title: "Constraint", requires: ["Table"], note: "NOT NULL, UNIQUE, CHECK, DEFAULT" }),
        concept({ order: 70, title: "JOIN", requires: ["Foreign Key"], subtopics: ["INNER", "LEFT/RIGHT OUTER", "FULL OUTER", "CROSS", "self-join"], note: "consolidada (A17)" }),
        concept({ order: 80, title: "Aggregate Functions & GROUP BY", requires: ["SQL"], subtopics: ["COUNT/SUM/AVG/MIN/MAX", "GROUP BY", "HAVING × WHERE"], note: "consolidada (A18)" }),
        concept({ order: 90, title: "Subqueries & CTEs", requires: ["SQL"], subtopics: ["correlacionada × não-correlacionada", "WITH", "CTE recursiva (menção)"], note: "consolidada (§D) — absorve CTE do rascunho" }),
        concept({
          order: 100,
          title: "Database Schema",
          requires: ["Table", "Constraint"],
          collision: "≠ Schema-on-Read (NoSQL) ≠ GraphQL Schema ≠ JSON Schema (AI Engineering)",
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
        }),
        concept({ order: 20, title: "Relationship Cardinality (1:1 / 1:N / N:M)", requires: ["Database Fundamentals / Foreign Key"], subtopics: ["1:1 (quando faz sentido)", "1:N (FK no lado 'muitos')", "N:M (tabela de junção, atributos na junção)"], note: "consolidada (A4)" }),
        concept({ order: 30, title: "Normalization", requires: ["Relationship Cardinality (1:1 / 1:N / N:M)"], note: "anomalias de inserção/atualização/remoção" }),
        concept({ order: 40, title: "Normal Forms (1NF / 2NF / 3NF)", requires: ["Normalization"], subtopics: ["1NF: valores atômicos", "2NF: sem dependência parcial da PK", "3NF: sem dependência transitiva", "BCNF (menção)"], note: "consolidada (A5)" }),
        concept({ order: 50, title: "Denormalization", requires: ["Normal Forms (1NF / 2NF / 3NF)"], note: "trade-off leitura × escrita/consistência — mesma tensão de Caching", revisit: ["Platform / Caching"] }),
        concept({ order: 60, title: "Natural vs Surrogate Key", requires: ["Database Fundamentals / Primary Key"], note: "UUID vs auto-incremento; implicações de índice" }),
        concept({
          order: 70,
          title: "Database Migration",
          requires: ["Database Fundamentals / Database Schema"],
          note: "migrations versionadas, forward-only, expand/contract — revisita Software Craft / Incremental Migration",
          revisit: ["Software Craft / Dependency & Version Management / Incremental Migration"],
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
        }),
        concept({
          order: 20,
          title: "ACID (A / C / D)",
          requires: ["Transaction"],
          subtopics: ["Atomicity", "Consistency (ACID) — subtopic nomeado, endereçável para a colisão", "Durability"],
          note: "consolidada (A7 + C6). Isolation fica Task própria",
          collision: "Consistency (ACID) ≠ Distributed Consistency (Architecture); Atomicity ≠ Atomic Operation (Programming Foundations / Concurrency)",
        }),
        concept({ order: 30, title: "Isolation", requires: ["ACID (A / C / D)"], note: "por que o 'I' é separado — é o que se relaxa na prática" }),
        concept({ order: 40, title: "Isolation Levels", requires: ["Isolation"], note: "Read Uncommitted → Serializable; trade-off com throughput" }),
        concept({ order: 50, title: "Read Phenomena (Dirty / Non-Repeatable / Phantom)", requires: ["Isolation Levels"], subtopics: ["dirty read", "non-repeatable read", "phantom read", "matriz 'qual nível previne qual'"], note: "consolidada (A6)" }),
        concept({
          order: 60,
          title: "Optimistic Locking",
          requires: ["Isolation"],
          note: "versão/timestamp, retry em conflito — revisita Programming Foundations / Concurrency / Race Condition",
          revisit: ["Programming Foundations / Concurrency / Race Condition"],
        }),
        concept({
          order: 70,
          title: "Pessimistic Locking",
          requires: ["Isolation"],
          note: "SELECT … FOR UPDATE, ordem de lock — revisita Programming Foundations / Concurrency / Deadlock",
          revisit: ["Programming Foundations / Concurrency / Deadlock"],
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
        }),
        concept({ order: 20, title: "Composite Index", requires: ["Index"], note: "regra do prefixo mais à esquerda; ordem das colunas" }),
        concept({ order: 30, title: "Query Execution Plan", requires: ["Index"], note: "EXPLAIN; seq scan × index scan; estimativas do otimizador" }),
        concept({ order: 40, title: "Query Optimization", requires: ["Query Execution Plan"], note: "SARGability, evitar SELECT *, projeção, covering index" }),
        concept({
          order: 50,
          title: "N+1 Query Problem",
          note: "canônico do roadmap — I/O por item × lote; eager loading/IN/join. GraphQL / N+1 in Resolvers revisita daqui",
          collision: "GraphQL / N+1 in Resolvers é a manifestação; aqui é o conceito canônico",
        }),
        concept({
          order: 60,
          title: "Connection Pool",
          note: "tamanho do pool, exaustão, timeout — revisita Programming Foundations / Concurrency (recurso compartilhado limitado)",
          revisit: ["Programming Foundations / Concurrency"],
        }),
        concept({ order: 70, title: "Slow Query Analysis", requires: ["Query Execution Plan"], subtopics: ["slow query log", "p95/p99 por query", "EXPLAIN ANALYZE (plano estimado × real)"], note: "consolidada (A20) — absorve Database Profiling" }),
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
