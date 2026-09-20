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
        concept({ order: 10, title: "API" }),
        concept({
          order: 20,
          title: "API Contract",
          requires: ["Programming Foundations / Programming Fundamentals / Contract"],
          note: "aplica Contract (pré/pós-condições) a fronteira de serviço; Testing & Quality Engineering / Contract Testing verifica isto",
          revisit: ["Programming Foundations / Programming Fundamentals / Contract", "Testing & Quality Engineering / Testing Strategy / Contract Testing"],
        }),
        concept({ order: 30, title: "REST", requires: ["API"], note: "restrições REST, HATEOAS (menção), maturidade de Richardson" }),
        concept({ order: 40, title: "Resource Modeling & RESTful URLs", requires: ["REST"], subtopics: ["recursos como substantivos", "coleção × item", "aninhamento/hierarquia", "path × query param"], note: "consolidada (A15)" }),
        concept({
          order: 50,
          title: "Request Validation",
          requires: ["REST"],
          note: "validação do contrato/boundary da API: shape, tipos, campos obrigatórios, formato. Pointer para Application Security / Input Validation (não revisitOf)",
          collision: "≠ Application Security / Input Validation — validar o contrato de API × defender contra entrada maliciosa (conceitos distintos)",
          revisit: ["Platform / Application Security / Input Validation"],
        }),
        concept({ order: 60, title: "Response Design", requires: ["REST"], note: "envelope, status coerente, Location em criação" }),
        concept({
          order: 70,
          title: "Error Response Design",
          requires: ["Response Design"],
          note: "revisita Software Craft / Error Handling / Result Pattern; RFC 7807 (problem+json)",
          revisit: ["Software Craft / Error Handling / Result Pattern"],
        }),
        concept({ order: 80, title: "Pagination (Offset / Cursor)", requires: ["Response Design"], subtopics: ["offset/limit: simples, page drift, custo de página profunda", "cursor/keyset: estável, sem página N, requer ordenação total"], note: "consolidada (A3)" }),
        concept({ order: 90, title: "Filtering & Sorting", requires: ["Response Design"], subtopics: ["operadores de filtro", "ordenação multi-campo", "whitelist de campos ordenáveis"], note: "consolidada (A16)" }),
        concept({
          order: 100,
          title: "Idempotency Key",
          requires: ["Web Fundamentals / HTTP Methods"],
          note: "canônico — mecânica HTTP (header + store de dedup + replay de resposta; retry seguro de POST). Mudança não silenciosa vs Fase 1 (que dizia 'Platform/API referencia')",
          collision: "≠ Idempotency conceito de resiliência (Architecture / Resilience Patterns)",
        }),
        concept({
          order: 110,
          title: "Rate Limiting",
          subtopics: ["token bucket", "leaky bucket", "janela fixa/deslizante"],
          note: "canônico — 429 + Retry-After + headers de quota. Mudança não silenciosa vs Fase 1 (que colocava em Architecture / Resilience Patterns). Architecture e AI Engineering revisitam",
          collision: "≠ Query Complexity (GraphQL) ≠ Throttle client-side (Performance Engineering)",
        }),
        concept({
          order: 120,
          title: "API Versioning",
          requires: ["API Contract"],
          note: "revisita Software Craft / Semantic Versioning, Backward Compatibility (URL vs header vs media type)",
          revisit: ["Software Craft / Dependency & Version Management / Semantic Versioning", "Software Craft / Dependency & Version Management / Backward Compatibility"],
        }),
        concept({
          order: 130,
          title: "API Deprecation",
          requires: ["API Versioning"],
          note: "revisita Software Craft / Deprecation (sunset headers, janelas de migração)",
          revisit: ["Software Craft / Dependency & Version Management / Deprecation"],
        }),
        concept({
          order: 140,
          title: "OpenAPI",
          requires: ["API Contract"],
          note: "spec-as-doc, Swagger UI, contract-first — absorve o SUGESTÃO 'API Documentation' deixado pelo Epic 03",
        }),
        concept({
          order: 150,
          title: "Middleware / Request Pipeline",
          requires: ["API"],
          isNew: true,
          note: "cadeia de handlers (auth, logging, rate limiting, validação) antes do controller. Ancora o Chain of Responsibility que o Epic 04 deixou como Advanced/Optional — o pattern continua SUGESTÃO no Epic 04, não é movido",
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
