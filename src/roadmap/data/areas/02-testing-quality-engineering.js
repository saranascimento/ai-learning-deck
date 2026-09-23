import { area, module, concept } from "../builders.js";

export default area({
  slug: "testing-quality-engineering",
  order: 20,
  title: "Testing & Quality Engineering",
  color: "#57C98A",
  summary:
    "Como testar, projetar para testabilidade e diagnosticar: fundamentos, dublês, TDD, " +
    "estratégia e debugging. A Story Debugging foi movida de Software Craft.",
  phase: "Fase 2 concluída (2026-09-03)",
  modules: [
    module({
      slug: "testing-fundamentals",
      order: 10,
      title: "Testing Fundamentals",
      requires: ["Programming Foundations / Programming Fundamentals"],
      summary: "O conceito e o porquê → o primitivo (Assertion) → como um teste é estruturado → a maquinaria de apoio → escopo crescente.",
      suggestions: ["Test Case", "Test Suite", "Setup / Teardown (mecânica do Fixture)", "Parameterized Tests", "Snapshot Testing"],
      concepts: [
        concept({
          order: 10,
          title: "Unit Testing",
          requires: ["Programming Foundations / Programming Fundamentals"],
          revisit: ["Functional Programming / Pure Functions (alvo trivial)", "AI Engineering / AI Evaluation (offline eval ≈ teste)"],
          note: "testar a menor unidade de comportamento, isolada do resto do sistema",
          summary:
            "Unit Testing é verificar automaticamente, e em isolamento, se a menor unidade de comportamento de um " +
            "sistema faz o que deveria.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Na prática, o teste executa uma unidade pequena — tipicamente uma função ou método — e compara o " +
                "resultado com o esperado. \"Unidade\" aqui não é um tamanho fixo: é o menor pedaço de comportamento que " +
                "faz sentido testar sozinho, sem depender de colaboradores externos como banco de dados, rede ou sistema " +
                "de arquivos.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um unit test que falha diz qual função quebrou, e é essa precisão que deixa você mudar código sem medo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quanto menor o escopo de um teste, mais rápido ele roda e mais precisamente ele aponta onde algo " +
                "quebrou. Um teste de unidade que falha aponta para uma função específica — não para \"alguma " +
                "coisa no sistema\". Isso dá feedback em segundos, não minutos, e permite rodar milhares de " +
                "testes a cada salvamento de arquivo.",
            },
            {
              type: "paragraph",
              text:
                "Sem unit tests, mudar código vira um ato de fé: você só descobre se quebrou algo quando um " +
                "humano (ou um usuário em produção) tropeça no bug. Com eles, o próprio código diz se ainda " +
                "funciona depois de uma mudança — a rede de segurança que permite refatorar sem medo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "abaixo, uma função pura e um teste de unidade escrito à mão, sem framework:" },
            {
              type: "code",
              language: "javascript",
              filename: "discount.test.js",
              code: [
                "function calculateDiscount(price, percent) {",
                "  return price - price * (percent / 100);",
                "}",
                "",
                "function testCalculateDiscount() {",
                "  const result = calculateDiscount(100, 20);",
                "  if (result !== 80) {",
                "    throw new Error(`esperava 80, recebeu ${result}`);",
                "  }",
                "}",
                "",
                "testCalculateDiscount();",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "testCalculateDiscount roda calculateDiscount com uma entrada conhecida e verifica o resultado — " +
                "nada de rede, banco ou tempo de espera. Se a lógica do desconto mudar amanhã e quebrar esse caso, " +
                "essa função lança um erro na hora, sem precisar de um humano clicando na tela.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para regras de negócio e lógica com entradas e saídas claras, onde o feedback em milissegundos compensa.",
                "Para receber, a cada mudança, um aviso preciso de qual unidade quebrou.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não prova que as unidades funcionam juntas: incompatibilidades de schema ou de contrato só aparecem em " +
                "testes de integração.",
                "Testar detalhes internos, em vez do comportamento observável, faz o teste quebrar a cada refatoração.",
              ],
            },
          ],
          examples: [
            {
              title: "Testando uma função pura de validação",
              context: "Funções puras (sem efeito colateral) são o alvo mais fácil e barato de testar.",
              code: {
                language: "javascript",
                filename: "validators.js",
                code: "function isValidAge(age) {\n  return Number.isInteger(age) && age >= 0 && age <= 120;\n}",
              },
              explanation:
                "Para cada entrada, isValidAge sempre devolve o mesmo resultado — basta chamar a função com " +
                "alguns valores (0, -1, 30, 121) e comparar com o esperado. Nenhum estado externo entra na equação.",
            },
            {
              title: "Testando um método com estado interno",
              context: "Objetos com estado também são testáveis em unidade, desde que o estado fique isolado por teste.",
              code: {
                language: "javascript",
                filename: "counter.js",
                code: ["class Counter {", "  constructor() {", "    this.value = 0;", "  }", "  increment() {", "    this.value += 1;", "    return this.value;", "  }", "}"].join("\n"),
              },
              explanation:
                "Um teste cria um Counter novo, chama increment() duas vezes e verifica this.value === 2. Cada " +
                "teste começa com uma instância nova — o estado de um teste nunca vaza para o próximo.",
            },
            {
              title: "Isolando uma dependência externa",
              context: "Quando a unidade testada depende de algo externo, essa dependência é substituída para manter o teste isolado.",
              code: {
                language: "javascript",
                filename: "order-service.js",
                code: ["function calculateTotal(items, taxRate) {", "  const subtotal = items.reduce((sum, item) => sum + item.price, 0);", "  return subtotal + subtotal * taxRate;", "}"].join("\n"),
              },
              explanation:
                "calculateTotal não chama nenhuma API nem banco — recebe items e taxRate como parâmetros. Isso a " +
                "torna trivial de testar: nenhuma dependência externa para isolar ou substituir (ver Test " +
                "Doubles, no próximo módulo, para o caso em que isso não é possível).",
            },
          ],
          exercise: {
            problem:
              "A função abaixo mistura o cálculo do frete com a leitura de uma variável global de configuração, o " +
              "que dificulta testá-la isoladamente.",
            problemCode: {
              language: "javascript",
              filename: "shipping.js",
              code: ["let currentRegion = \"BR-SP\";", "", "function calculateShipping(weightKg) {", "  const rate = currentRegion === \"BR-SP\" ? 2.5 : 4.0;", "  return weightKg * rate;", "}"].join("\n"),
            },
            task:
              "Reescreva calculateShipping para que ela não dependa de currentRegion como variável global, " +
              "tornando-a uma unidade testável de forma isolada e determinística.",
            hint: "Uma função testável em unidade recebe tudo que precisa como parâmetro — nada de ler estado externo escondido.",
            solution: {
              code: {
                language: "javascript",
                filename: "shipping.js",
                code: ["function calculateShipping(weightKg, region) {", "  const rate = region === \"BR-SP\" ? 2.5 : 4.0;", "  return weightKg * rate;", "}"].join("\n"),
              },
              explanation:
                "Com region como parâmetro, um teste chama calculateShipping(10, \"BR-SP\") e " +
                "calculateShipping(10, \"BR-RJ\") e compara os resultados sem precisar manipular estado global " +
                "antes e depois de cada teste.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Assertion",
          isNew: true,
          note: "a verificação atômica: valor real × esperado; base de pass/fail",
          collision: "≠ assert / invariante em runtime (relacionado a Programming Foundations / Contract) — a asserção de teste roda no teste",
          summary:
            "Uma Assertion é a verificação que compara um valor real com o esperado e decide se o teste passa ou " +
            "falha.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Ela afirma que algo deveria ser verdade: o valor real (o que o código produziu) é igual ao esperado (o " +
                "que deveria ter produzido). Se a afirmação é verdadeira, nada acontece; se é falsa, a assertion lança um " +
                "erro que interrompe o teste e o marca como falho.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um teste sem uma assertion capaz de falhar não testa nada, só executa código.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem uma forma padronizada de \"afirmar e falhar\", cada teste teria que implementar sua própria " +
                "lógica de comparação e seu próprio jeito de reportar erro. Assertions dão um vocabulário comum " +
                "— assertEqual, assertTrue, expect(...).toBe(...) — que qualquer test runner sabe interpretar e " +
                "reportar de forma consistente.",
            },
            {
              type: "paragraph",
              text:
                "Assertions também são o que torna um teste automático em vez de manual: sem elas, o teste só " +
                "executaria código e um humano teria que olhar a saída para decidir se está certa. A assertion " +
                "decide isso sozinha, todas as vezes, sem fadiga nem distração.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma assertion simples, escrita à mão:" },
            {
              type: "code",
              language: "javascript",
              filename: "assert.js",
              code: [
                "function assertEqual(actual, expected, message) {",
                "  if (actual !== expected) {",
                "    throw new Error(message || `esperava ${expected}, recebeu ${actual}`);",
                "  }",
                "}",
                "",
                "assertEqual(2 + 2, 4);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "assertEqual compara actual com expected. Se forem diferentes, lança um erro — é esse erro que o " +
                "test runner captura para marcar o teste como falho. Frameworks como Jest ou Vitest oferecem uma " +
                "API mais rica (expect(actual).toBe(expected)), mas a ideia por baixo é exatamente essa.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Um teste sem assertion passa sempre e não verifica nada; confira que ele falharia se o código estivesse errado.",
                "Assertions vagas, como `toBeTruthy()`, aprovam resultados errados; compare com o valor esperado exato.",
                "Muitas assertions em um só teste escondem qual delas falhou e o que realmente está sendo verificado.",
              ],
            },
          ],
          examples: [
            {
              title: "Assertion de igualdade",
              context: "A forma mais comum: comparar um valor calculado com um valor conhecido.",
              code: {
                language: "javascript",
                filename: "math.test.js",
                code: ["function assertEqual(actual, expected) {", "  if (actual !== expected) throw new Error(`esperava ${expected}, recebeu ${actual}`);", "}", "", "assertEqual(Math.max(3, 7), 7);"].join("\n"),
              },
              explanation:
                "Compara o retorno de Math.max(3, 7) com o valor 7 que sabemos ser correto. Se Math.max estivesse " +
                "quebrado, essa linha lançaria um erro imediatamente.",
            },
            {
              title: "Assertion de verdade/falsidade",
              context: "Quando o que importa é uma condição booleana, não um valor exato.",
              code: {
                language: "javascript",
                filename: "validators.test.js",
                code: ["function assertTrue(condition, message) {", "  if (!condition) throw new Error(message || \"esperava true, recebeu false\");", "}", "", "assertTrue(isValidEmail(\"a@b.com\"));"].join("\n"),
              },
              explanation:
                "Em vez de comparar valores, assertTrue verifica que uma expressão booleana é verdadeira. É útil " +
                "quando o teste quer afirmar uma propriedade (\"isso é válido\") em vez de um valor específico.",
            },
            {
              title: "Assertion de exceção esperada",
              context: "Às vezes o comportamento correto é o código falhar de propósito.",
              code: {
                language: "javascript",
                filename: "parser.test.js",
                code: [
                  "function assertThrows(fn) {",
                  "  try {",
                  "    fn();",
                  "  } catch (error) {",
                  "    return;",
                  "  }",
                  "  throw new Error(\"esperava que a função lançasse um erro, mas não lançou\");",
                  "}",
                  "",
                  "assertThrows(() => parseAge(\"não é um número\"));",
                ].join("\n"),
              },
              explanation:
                "assertThrows chama a função dentro de um try/catch e só considera a asserção bem-sucedida se um " +
                "erro foi lançado — o oposto de uma assertion comum, que falha quando algo dá errado.",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo compara dois objetos com === e sempre falha, mesmo quando os campos são idênticos, " +
              "porque a comparação é por referência.",
            problemCode: {
              language: "javascript",
              filename: "assert.test.js",
              code: ["function assertEqual(actual, expected) {", "  if (actual !== expected) throw new Error(\"valores diferentes\");", "}", "", "assertEqual({ id: 1, name: \"Ana\" }, { id: 1, name: \"Ana\" });"].join("\n"),
            },
            task:
              "Escreva uma assertEqual capaz de comparar dois objetos por valor (campo a campo), não por " +
              "referência, para que este teste passe quando os campos forem iguais.",
            hint: "JSON.stringify pode servir para uma comparação simples e boa o suficiente para objetos planos.",
            solution: {
              code: {
                language: "javascript",
                filename: "assert.test.js",
                code: [
                  "function assertEqual(actual, expected) {",
                  "  const same = JSON.stringify(actual) === JSON.stringify(expected);",
                  "  if (!same) {",
                  "    throw new Error(`esperava ${JSON.stringify(expected)}, recebeu ${JSON.stringify(actual)}`);",
                  "  }",
                  "}",
                  "",
                  "assertEqual({ id: 1, name: \"Ana\" }, { id: 1, name: \"Ana\" });",
                ].join("\n"),
              },
              explanation:
                "Serializar os dois valores para JSON e comparar as strings resolve a comparação por valor para " +
                "objetos simples (sem métodos, datas ou referências circulares). Frameworks reais usam " +
                "comparação estrutural mais robusta, mas o princípio — comparar conteúdo, não identidade — é o mesmo.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Arrange-Act-Assert",
          requires: ["Unit Testing", "Assertion"],
          note: "a estrutura de 3 fases de um teste",
          summary: "Arrange-Act-Assert é o padrão que divide um teste em três fases: preparar, executar e verificar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Os três blocos vêm em sequência e bem separados: Arrange prepara tudo que o teste precisa (dados, " +
                "objetos, dublês); Act executa a única ação que está sendo testada; Assert verifica se o resultado da " +
                "ação é o esperado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Um teste bem escrito em AAA tem um Arrange curto, uma única ação e uma verificação sobre ela.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem uma estrutura, testes tendem a misturar preparação, execução e verificação em qualquer " +
                "ordem, o que dificulta ler o teste e entender rapidamente o que ele está validando. AAA impõe " +
                "uma ordem previsível: qualquer pessoa que abre o teste sabe onde procurar o cenário, onde " +
                "procurar a ação e onde procurar a expectativa.",
            },
            {
              type: "paragraph",
              text:
                "A separação também ajuda a manter um teste focado em uma única coisa: se o bloco Act tem mais de " +
                "uma linha fazendo coisas diferentes, é sinal de que o teste está testando mais de um " +
                "comportamento ao mesmo tempo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "as três fases marcadas explicitamente com comentários:" },
            {
              type: "code",
              language: "javascript",
              filename: "discount.test.js",
              code: [
                "function testApplyDiscount() {",
                "  // Arrange",
                "  const cart = { total: 100 };",
                "  const discountPercent = 10;",
                "",
                "  // Act",
                "  const result = applyDiscount(cart, discountPercent);",
                "",
                "  // Assert",
                "  if (result.total !== 90) {",
                "    throw new Error(`esperava 90, recebeu ${result.total}`);",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Arrange monta o carrinho e o percentual de desconto; Act chama a única função sob teste, " +
                "applyDiscount; Assert compara o total resultante com o esperado. Não há preparação misturada " +
                "com verificação — cada bloco tem uma responsabilidade.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em todo teste de unidade, para que qualquer pessoa reconheça as três fases de relance.",
                "Ao revisar um teste confuso: separar as três fases costuma mostrar o que está sobrando.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Um Arrange muito longo indica código difícil de testar ou fixture que deveria ser extraída.",
                "Várias fases Act e Assert no mesmo teste indicam que ele verifica mais de um comportamento; divida-o.",
              ],
            },
          ],
          examples: [
            {
              title: "AAA testando uma função pura",
              context: "O caso mais simples: nenhum estado para preparar, então Arrange fica curto.",
              code: {
                language: "javascript",
                filename: "math.test.js",
                code: ["function testDouble() {", "  // Arrange", "  const input = 5;", "", "  // Act", "  const result = double(input);", "", "  // Assert", "  if (result !== 10) throw new Error(`esperava 10, recebeu ${result}`);", "}"].join("\n"),
              },
              explanation:
                "Mesmo quando Arrange é uma única linha, mantê-lo separado do Act deixa claro qual valor está " +
                "sendo testado.",
            },
            {
              title: "AAA testando um objeto com estado",
              context: "Quando o cenário tem mais peças, Arrange cresce — mas continua sendo só preparação, sem chamar a ação sob teste.",
              code: {
                language: "javascript",
                filename: "cart.test.js",
                code: [
                  "function testRemoveItem() {",
                  "  // Arrange",
                  "  const cart = new Cart();",
                  "  cart.addItem({ id: 1, price: 20 });",
                  "  cart.addItem({ id: 2, price: 30 });",
                  "",
                  "  // Act",
                  "  cart.removeItem(1);",
                  "",
                  "  // Assert",
                  "  if (cart.items.length !== 1) throw new Error(\"item não foi removido\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As duas chamadas a addItem fazem parte do cenário (Arrange), não da ação testada — a ação sob " +
                "teste é a chamada única a removeItem no bloco Act.",
            },
            {
              title: "Quando o Assert precisa de mais de uma verificação",
              context: "É comum um Assert verificar mais de uma propriedade do resultado, desde que todas pertençam ao mesmo comportamento testado.",
              code: {
                language: "javascript",
                filename: "user.test.js",
                code: [
                  "function testCreateUser() {",
                  "  // Arrange",
                  "  const input = { name: \"Ana\", email: \"ana@example.com\" };",
                  "",
                  "  // Act",
                  "  const user = createUser(input);",
                  "",
                  "  // Assert",
                  "  if (user.name !== \"Ana\") throw new Error(\"nome incorreto\");",
                  "  if (!user.id) throw new Error(\"id não foi gerado\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As duas verificações continuam no bloco Assert porque checam facetas do mesmo resultado — o " +
                "objeto user retornado por uma única chamada a createUser.",
            },
          ],
          exercise: {
            problem: "O teste abaixo mistura preparação, execução e verificação sem nenhuma separação clara.",
            problemCode: {
              language: "javascript",
              filename: "stock.test.js",
              code: [
                "function testUpdateStock() {",
                "  const product = { id: 1, stock: 10 };",
                "  const result = updateStock(product, -3);",
                "  if (result.stock !== 7) throw new Error(\"estoque incorreto\");",
                "  const secondResult = updateStock(product, -20);",
                "  if (secondResult.stock >= 0) throw new Error(\"estoque não deveria ficar negativo sem checagem\");",
                "}",
              ].join("\n"),
            },
            task: "Reorganize (ou separe em dois testes) usando Arrange-Act-Assert, de forma que cada teste tenha um único Act.",
            hint: "Esse código na verdade testa dois comportamentos diferentes de updateStock — um teste, um comportamento.",
            solution: {
              code: {
                language: "javascript",
                filename: "stock.test.js",
                code: [
                  "function testUpdateStockReducesQuantity() {",
                  "  // Arrange",
                  "  const product = { id: 1, stock: 10 };",
                  "",
                  "  // Act",
                  "  const result = updateStock(product, -3);",
                  "",
                  "  // Assert",
                  "  if (result.stock !== 7) throw new Error(\"estoque incorreto\");",
                  "}",
                  "",
                  "function testUpdateStockRejectsNegativeResult() {",
                  "  // Arrange",
                  "  const product = { id: 1, stock: 10 };",
                  "",
                  "  // Act",
                  "  const result = updateStock(product, -20);",
                  "",
                  "  // Assert",
                  "  if (result.stock < 0) throw new Error(\"estoque não deveria ficar negativo\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Separar em dois testes dá a cada um um único Act e um nome que descreve exatamente o que está " +
                "sendo verificado — muito mais fácil de ler e de saber qual comportamento quebrou quando um deles falha.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Given-When-Then",
          requires: ["Unit Testing", "Assertion"],
          note: "a mesma estrutura de 3 fases, na fraseologia BDD — não depende de AAA",
          summary:
            "Given-When-Then é a estrutura de três fases do Arrange-Act-Assert escrita no vocabulário do " +
            "Behavior-Driven Development.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Given estabelece o contexto inicial (\"dado que o carrinho tem dois itens\"), When descreve a ação " +
                "(\"quando o usuário remove um item\"), Then descreve o resultado esperado (\"então o carrinho tem um " +
                "item\"). A diferença para o AAA é só o vocabulário, voltado para descrever comportamento em linguagem " +
                "próxima da de negócio.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Escolha Given-When-Then quando alguém de negócio vai ler o teste, e AAA quando só quem programa vai.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Given-When-Then nasceu do Behavior-Driven Development (BDD), que busca escrever testes que " +
                "também sirvam como especificação legível por quem não é desenvolvedor — um product owner, por " +
                "exemplo. A fraseologia \"dado / quando / então\" é a mesma usada em critérios de aceite, o que " +
                "aproxima o teste da conversa que gerou o requisito.",
            },
            {
              type: "paragraph",
              text:
                "Não é uma técnica diferente de AAA — é outra forma de nomear as mesmas três fases. Times " +
                "escolhem uma ou outra fraseologia por convenção, ou por já usarem ferramentas de BDD (como " +
                "Cucumber) que esperam esse vocabulário nos arquivos de especificação.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o mesmo teste de desconto do exemplo anterior, com a fraseologia Given-When-Then:" },
            {
              type: "code",
              language: "javascript",
              filename: "discount.test.js",
              code: [
                "function testApplyDiscount() {",
                "  // Given um carrinho com total 100 e desconto de 10%",
                "  const cart = { total: 100 };",
                "  const discountPercent = 10;",
                "",
                "  // When o desconto é aplicado",
                "  const result = applyDiscount(cart, discountPercent);",
                "",
                "  // Then o total final é 90",
                "  if (result.total !== 90) {",
                "    throw new Error(`esperava 90, recebeu ${result.total}`);",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O código é idêntico ao exemplo de AAA — só os comentários mudam de vocabulário. Em ferramentas " +
                "de BDD como Cucumber, Given/When/Then viram literalmente linhas de um arquivo .feature, " +
                "separadas do código que as implementa (\"step definitions\").",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o teste também documenta um requisito e será lido por quem não programa.",
                "Em BDD, com cenários escritos em linguagem de negócio, como em arquivos `.feature`.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em testes técnicos de unidade, a cerimônia de linguagem de negócio acrescenta pouco sobre o AAA.",
                "Só compensa se alguém de negócio de fato lê os cenários; do contrário, vira burocracia.",
              ],
            },
          ],
          examples: [
            {
              title: "Given-When-Then em um cenário de autenticação",
              context: "Casos de negócio como login costumam ser descritos naturalmente nessa fraseologia.",
              code: {
                language: "javascript",
                filename: "login.test.js",
                code: [
                  "function testLoginWithValidCredentials() {",
                  "  // Given um usuário cadastrado com senha válida",
                  "  const user = createUser({ email: \"ana@example.com\", password: \"segredo123\" });",
                  "",
                  "  // When ele tenta logar com a senha correta",
                  "  const result = login(\"ana@example.com\", \"segredo123\");",
                  "",
                  "  // Then o login é aceito",
                  "  if (!result.success) throw new Error(\"login deveria ter sido aceito\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A frase \"dado um usuário cadastrado, quando ele loga com a senha correta, então o login é " +
                "aceito\" é literalmente o critério de aceite da funcionalidade — o teste só transcreve isso em código.",
            },
            {
              title: "Um arquivo .feature de BDD (fora do código de teste)",
              context: "Ferramentas como Cucumber separam a especificação (em Given/When/Then puro) da implementação.",
              code: {
                language: "javascript",
                filename: "login.feature",
                code: [
                  "Feature: Login de usuário",
                  "",
                  "  Scenario: Login com senha correta",
                  "    Given um usuário cadastrado com senha válida",
                  "    When ele tenta logar com a senha correta",
                  "    Then o login é aceito",
                ].join("\n"),
              },
              explanation:
                "Esse arquivo não é JavaScript — é texto em Gherkin, a linguagem que o Cucumber usa. Cada linha " +
                "Given/When/Then é ligada, por um passo de \"step definition\", a uma função real que executa " +
                "aquela parte do teste.",
            },
            {
              title: "O mesmo teste, AAA vs. Given-When-Then",
              context: "As duas fraseologias descrevem exatamente a mesma estrutura de três fases.",
              code: {
                language: "javascript",
                filename: "comparison.test.js",
                code: [
                  "// Arrange-Act-Assert",
                  "function testRemoveItem_AAA() {",
                  "  const cart = new Cart();",
                  "  cart.addItem({ id: 1 });",
                  "  const result = cart.removeItem(1);",
                  "  if (result.items.length !== 0) throw new Error(\"item não removido\");",
                  "}",
                  "",
                  "// Given-When-Then",
                  "function testRemoveItem_GWT() {",
                  "  const cart = new Cart();",
                  "  cart.addItem({ id: 1 });",
                  "  const result = cart.removeItem(1);",
                  "  if (result.items.length !== 0) throw new Error(\"item não removido\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O código dos dois testes é idêntico — a única diferença seria o vocabulário dos comentários " +
                "(Arrange/Act/Assert vs. Given/When/Then). A escolha é de convenção do time, não de comportamento do teste.",
            },
          ],
          exercise: {
            problem: "O comentário abaixo descreve um cenário em prosa solta, sem seguir a estrutura Given-When-Then.",
            problemCode: {
              language: "javascript",
              filename: "cart.test.js",
              code: [
                "// testa que remover um produto que não existe no carrinho não quebra nada",
                "function testRemoveNonexistentItem() {",
                "  const cart = new Cart();",
                "  cart.addItem({ id: 1 });",
                "  const result = cart.removeItem(999);",
                "  if (result.items.length !== 1) throw new Error(\"carrinho não deveria ter mudado\");",
                "}",
              ].join("\n"),
            },
            task: "Reescreva o comentário do teste seguindo explicitamente a estrutura Given-When-Then.",
            hint: "Given é o estado antes da ação; When é a única ação sob teste; Then é o que se espera depois dela.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart.test.js",
                code: [
                  "function testRemoveNonexistentItem() {",
                  "  // Given um carrinho com um item (id 1)",
                  "  const cart = new Cart();",
                  "  cart.addItem({ id: 1 });",
                  "",
                  "  // When um item que não existe no carrinho (id 999) é removido",
                  "  const result = cart.removeItem(999);",
                  "",
                  "  // Then o carrinho permanece inalterado",
                  "  if (result.items.length !== 1) throw new Error(\"carrinho não deveria ter mudado\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Nomear explicitamente cada fase deixa claro, sem precisar ler o corpo do teste, qual é o " +
                "cenário, qual é a ação testada e qual é o resultado esperado — a mesma clareza que AAA daria, só " +
                "que com vocabulário de comportamento.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Test Fixture",
          isNew: true,
          requires: ["Unit Testing"],
          note: "o estado/dado base fixo sobre o qual um teste roda",
          summary: "Uma Test Fixture é o estado conhecido que um teste espera encontrar pronto antes de começar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Pode ser um objeto pré-configurado, um conjunto de registros num banco de teste, um arquivo temporário. " +
                "\"Fixture\" tanto se refere ao dado em si quanto ao código que o prepara (e, às vezes, o desfaz depois).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Centralize na fixture o cenário que vários testes repetem, e crie nela só os dados que eles realmente " +
                "usam.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Vários testes costumam precisar do mesmo tipo de cenário — por exemplo, \"um usuário " +
                "autenticado\" ou \"um carrinho com três itens\". Repetir essa preparação em cada teste é ruído e " +
                "risco de inconsistência; fixtures centralizam essa construção num lugar, geralmente chamado " +
                "antes de cada teste (setup) e às vezes desfeito depois (teardown).",
            },
            {
              type: "paragraph",
              text:
                "Fixtures também existem para garantir isolamento: cada teste deve receber uma fixture nova e " +
                "limpa, sem restos do teste anterior. Um framework de testes chama a função de setup antes de " +
                "cada caso justamente para isso — sem fixtures frescas, testes passam a depender da ordem em que rodam.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma fixture construída por uma função auxiliar, chamada no início de cada teste:" },
            {
              type: "code",
              language: "javascript",
              filename: "cart.test.js",
              code: [
                "function createCartFixture() {",
                "  const cart = new Cart();",
                "  cart.addItem({ id: 1, price: 10 });",
                "  cart.addItem({ id: 2, price: 20 });",
                "  return cart;",
                "}",
                "",
                "function testCartTotal() {",
                "  const cart = createCartFixture();",
                "  if (cart.total() !== 30) {",
                "    throw new Error(`esperava 30, recebeu ${cart.total()}`);",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "createCartFixture monta um carrinho com dois itens conhecidos — esse é o dado fixo que qualquer " +
                "teste sobre esse carrinho pode assumir como ponto de partida. Se outro teste também precisar de " +
                "um carrinho com itens, ele chama a mesma função e recebe uma instância nova, sem interferir " +
                "neste teste.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando vários testes partem do mesmo cenário, para não repetir o Arrange em cada um.",
                "Quando é preciso desfazer o estado depois, como limpar banco ou arquivos, com setup e teardown explícitos.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Fixture compartilhada e mutável cria dependência entre testes: um altera o estado e o outro falha.",
                "Fixtures grandes demais escondem do teste o que importa; crie só os dados que o teste usa.",
              ],
            },
          ],
          examples: [
            {
              title: "Fixture reaproveitada em vários testes",
              context: "A mesma fixture serve de base para verificar comportamentos diferentes.",
              code: {
                language: "javascript",
                filename: "cart.fixtures.js",
                code: ["function createCartWithTwoItems() {", "  const cart = new Cart();", "  cart.addItem({ id: 1, price: 10 });", "  cart.addItem({ id: 2, price: 20 });", "  return cart;", "}"].join("\n"),
              },
              explanation:
                "Um teste usa essa fixture para verificar o total; outro, para verificar a contagem de itens; " +
                "outro, para verificar remoção — todos partem do mesmo estado inicial conhecido, sem repetir a montagem.",
            },
            {
              title: "Fixture com setup e teardown explícitos",
              context: "Quando a fixture envolve um recurso externo (como um arquivo), ela precisa ser desfeita depois.",
              code: {
                language: "javascript",
                filename: "file-fixture.test.js",
                code: ["let tempFilePath;", "", "function setup() {", "  tempFilePath = createTempFile(\"conteúdo de teste\");", "}", "", "function teardown() {", "  deleteFile(tempFilePath);", "}"].join("\n"),
              },
              explanation:
                "setup cria o arquivo temporário antes de cada teste que precisa dele; teardown o remove depois, " +
                "garantindo que o disco não acumule arquivos de teste e que o próximo teste não encontre um " +
                "arquivo já existente por engano.",
            },
            {
              title: "Fixture como dado estático (sem função)",
              context: "Nem toda fixture precisa de uma função — às vezes é só um objeto constante.",
              code: {
                language: "javascript",
                filename: "users.fixtures.js",
                code: ["const validUser = {", "  id: 1,", "  name: \"Ana\",", "  email: \"ana@example.com\",", "};"].join("\n"),
              },
              explanation:
                "Quando o dado não precisa ser recriado (não tem estado mutável nem recurso externo), uma " +
                "constante simples já serve como fixture — desde que nenhum teste a modifique.",
            },
          ],
          exercise: {
            problem:
              "Os dois testes abaixo duplicam a mesma preparação de carrinho, e um deles reaproveita a MESMA " +
              "instância de cart do outro, criada fora das funções de teste.",
            problemCode: {
              language: "javascript",
              filename: "cart.test.js",
              code: [
                "const cart = new Cart();",
                "cart.addItem({ id: 1, price: 10 });",
                "",
                "function testCartHasOneItem() {",
                "  if (cart.items.length !== 1) throw new Error(\"esperava 1 item\");",
                "}",
                "",
                "function testCartTotalIsTen() {",
                "  cart.addItem({ id: 2, price: 5 });",
                "  if (cart.total() !== 15) throw new Error(\"esperava 15\");",
                "}",
              ].join("\n"),
            },
            task:
              "Extraia a preparação para uma função de fixture chamada dentro de cada teste, de forma que os dois " +
              "testes deixem de compartilhar a mesma instância de cart.",
            hint: "O problema aqui é a fixture compartilhada ser mutada por um teste e afetar o outro, dependendo da ordem de execução.",
            solution: {
              code: {
                language: "javascript",
                filename: "cart.test.js",
                code: [
                  "function createCartFixture() {",
                  "  const cart = new Cart();",
                  "  cart.addItem({ id: 1, price: 10 });",
                  "  return cart;",
                  "}",
                  "",
                  "function testCartHasOneItem() {",
                  "  const cart = createCartFixture();",
                  "  if (cart.items.length !== 1) throw new Error(\"esperava 1 item\");",
                  "}",
                  "",
                  "function testCartTotalIsTen() {",
                  "  const cart = createCartFixture();",
                  "  cart.addItem({ id: 2, price: 5 });",
                  "  if (cart.total() !== 15) throw new Error(\"esperava 15\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada teste agora chama createCartFixture() e recebe sua própria instância — testCartTotalIsTen " +
                "pode adicionar um item sem afetar testCartHasOneItem, não importa em qual ordem rodem.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Test Runner",
          isNew: true,
          requires: ["Unit Testing", "Assertion"],
          note: "a ferramenta que descobre, executa e reporta testes",
          summary:
            "Um Test Runner é a ferramenta que encontra os testes de um projeto, executa cada um e reporta o que " +
            "passou e o que falhou.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "A descoberta costuma ser por convenção de nome, como *.test.js. Para cada teste, o runner captura o " +
                "resultado das assertions e, no fim, produz um relatório com quantos passaram, quantos falharam e a " +
                "mensagem de erro de cada falha. Jest, Vitest, JUnit e pytest são exemplos de test runners.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text: "Sem um runner que isole cada teste, uma falha interrompe a suíte e esconde o resultado dos outros.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem um runner, rodar testes significaria executar cada arquivo manualmente e ler o console para " +
                "saber se algo lançou erro — inviável a partir de algumas dezenas de testes. O runner automatiza " +
                "a descoberta (nenhum teste precisa ser listado à mão), o isolamento (um teste que trava não " +
                "impede os outros de rodar) e o relatório (uma saída consistente, legível por humano e por CI).",
            },
            {
              type: "paragraph",
              text:
                "O runner também é o que torna testes parte do fluxo de desenvolvimento: rodando em watch mode a " +
                "cada salvamento, ou como gate obrigatório num pipeline de CI, é o runner — não os testes " +
                "individualmente — que decide se a suíte como um todo passou.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um runner mínimo, escrito à mão, que executa uma lista de funções de teste:" },
            {
              type: "code",
              language: "javascript",
              filename: "runner.js",
              code: [
                "function runTests(testFunctions) {",
                "  let passed = 0;",
                "  let failed = 0;",
                "",
                "  for (const test of testFunctions) {",
                "    try {",
                "      test();",
                "      passed++;",
                "    } catch (error) {",
                "      failed++;",
                "      console.error(`FALHOU: ${test.name} — ${error.message}`);",
                "    }",
                "  }",
                "",
                "  console.log(`${passed} passaram, ${failed} falharam`);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "runTests recebe uma lista de funções de teste, executa cada uma dentro de um try/catch — para " +
                "que uma falha não interrompa as demais — e acumula o resultado. Frameworks reais fazem a mesma " +
                "coisa, só que descobrem os testes automaticamente (varrendo arquivos) e produzem relatórios " +
                "muito mais ricos.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em qualquer suíte automatizada: ele descobre, executa e reporta, localmente e no CI.",
                "Com relatório legível por máquina, para o CI falhar o build quando um teste falha.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O runner não garante testes bons: ele apenas executa o que foi escrito.",
                "Isolamento entre testes depende de como você os escreve; estado global compartilhado ainda os acopla.",
              ],
            },
          ],
          examples: [
            {
              title: "Descoberta de testes por convenção de nome",
              context: "Runners reais não recebem uma lista manual — eles varrem o projeto.",
              code: {
                language: "javascript",
                filename: "runner-config.js",
                code: ["const testFiles = findFiles(\"**/*.test.js\");", "", "for (const file of testFiles) {", "  runTestsInFile(file);", "}"].join("\n"),
              },
              explanation:
                "A convenção *.test.js é o que permite ao runner descobrir sozinho onde estão os testes, sem que " +
                "ninguém precise registrar cada arquivo manualmente numa lista.",
            },
            {
              title: "Isolamento de falhas entre testes",
              context: "Um teste que lança erro não deveria impedir os demais de rodar.",
              code: {
                language: "javascript",
                filename: "isolated-runner.js",
                code: ["function runTest(test) {", "  try {", "    test();", "    return { name: test.name, status: \"passed\" };", "  } catch (error) {", "    return { name: test.name, status: \"failed\", message: error.message };", "  }", "}"].join("\n"),
              },
              explanation:
                "Envolver cada teste no seu próprio try/catch garante que um erro não capturado em um teste não " +
                "derrube o processo inteiro — os testes seguintes ainda rodam e ainda são reportados.",
            },
            {
              title: "Saída de relatório legível por CI",
              context: "Além do console, runners produzem formatos que outras ferramentas conseguem ler.",
              code: {
                language: "javascript",
                filename: "report.js",
                code: ["function toJUnitXml(results) {", "  const failures = results.filter((r) => r.status === \"failed\").length;", "  return `<testsuite tests=\"${results.length}\" failures=\"${failures}\">`;", "}"].join("\n"),
              },
              explanation:
                "Um pipeline de CI não lê a saída colorida do terminal — ele lê um formato estruturado como " +
                "JUnit XML para decidir automaticamente se o build passa ou falha (ponte com CI/CD Pipeline, na " +
                "Área de Platform Engineering).",
            },
          ],
          exercise: {
            problem: "O runner abaixo para de executar assim que o primeiro teste falha, porque o erro não é capturado.",
            problemCode: {
              language: "javascript",
              filename: "runner.js",
              code: ["function runTests(testFunctions) {", "  for (const test of testFunctions) {", "    test();", "    console.log(`passou: ${test.name}`);", "  }", "}"].join("\n"),
            },
            task:
              "Corrija runTests para que um teste que falha não impeça os testes seguintes de rodar, e para que " +
              "o relatório final mostre quantos passaram e quantos falharam.",
            hint: "Envolva a chamada de cada teste num try/catch, como no exemplo mínimo acima.",
            solution: {
              code: {
                language: "javascript",
                filename: "runner.js",
                code: [
                  "function runTests(testFunctions) {",
                  "  let passed = 0;",
                  "  let failed = 0;",
                  "",
                  "  for (const test of testFunctions) {",
                  "    try {",
                  "      test();",
                  "      passed++;",
                  "      console.log(`passou: ${test.name}`);",
                  "    } catch (error) {",
                  "      failed++;",
                  "      console.error(`falhou: ${test.name} — ${error.message}`);",
                  "    }",
                  "  }",
                  "",
                  "  console.log(`${passed} passaram, ${failed} falharam`);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com o try/catch dentro do loop, uma exceção lançada por um teste é capturada e registrada como " +
                "falha, mas o loop continua para o próximo teste — nenhum teste deixa de rodar por causa da " +
                "falha de outro.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Integration Testing",
          requires: ["Unit Testing"],
          note: "\"integração\" pressupõe \"unidades\"",
          collision: "≠ Continuous Integration (Platform / CI-CD)",
          summary:
            "Integration Testing é testar se unidades já verificadas isoladamente funcionam quando conectadas de " +
            "verdade.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Em vez de isolar uma função com dublês, um teste de integração deixa componentes reais interagirem: um " +
                "repositório conversa com um banco de dados de verdade (ou um banco de teste), um client HTTP conversa " +
                "com uma API real.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Coloque os testes de integração nas fronteiras, onde um dublê esconderia exatamente o erro que você quer " +
                "pegar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Unit tests provam que cada peça funciona sozinha, mas não provam que as peças se encaixam. Um " +
                "serviço pode ter 100% de unit tests passando e ainda quebrar em produção porque a query SQL que " +
                "ele monta não bate com o schema real do banco, ou porque o formato do JSON que ele espera de " +
                "uma API mudou. Integration testing existe para pegar exatamente esse tipo de falha — na " +
                "fronteira entre unidades.",
            },
            {
              type: "paragraph",
              text:
                "O nome pressupõe as unidades: só faz sentido falar em \"integrar\" coisas que já existem " +
                "separadamente e já foram verificadas em isolamento. É por isso que Integration Testing " +
                "normalmente vem depois de Unit Testing na progressão de um projeto, não no lugar dele.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um teste que exercita um repositório contra um banco de dados de teste de verdade (não um dublê):" },
            {
              type: "code",
              language: "javascript",
              filename: "user-repository.integration.test.js",
              code: [
                "async function testSaveAndFindUser() {",
                "  const repository = new UserRepository(testDatabase);",
                "",
                "  const saved = await repository.save({ name: \"Ana\", email: \"ana@example.com\" });",
                "  const found = await repository.findById(saved.id);",
                "",
                "  if (found.email !== \"ana@example.com\") {",
                "    throw new Error(\"usuário salvo não foi encontrado corretamente\");",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Diferente de um unit test, esse teste não substitui testDatabase por um dublê — ele salva e " +
                "busca de verdade, exercitando a query real, a serialização real e o driver real do banco. É " +
                "mais lento que um unit test (envolve I/O), mas prova algo que nenhum dublê provaria: que save e " +
                "findById realmente funcionam juntos contra o banco de verdade.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Nas fronteiras entre unidades reais: serviço e banco de dados, componente e API.",
                "Para verificar consultas, schemas e contratos que um dublê de teste nunca revelaria.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "São mais lentos e frágeis que os de unidade; não os use para cobrir cada regra de negócio.",
                "Exigem ambiente e dados controlados, como um banco de teste, o que aumenta o custo de manutenção.",
              ],
            },
          ],
          examples: [
            {
              title: "Serviço + banco de dados de teste",
              context: "O caso mais comum: verificar que a camada de persistência funciona contra um banco real (geralmente efêmero, criado só para os testes).",
              code: {
                language: "javascript",
                filename: "order-repository.integration.test.js",
                code: [
                  "async function testOrderPersistsAllFields() {",
                  "  const repository = new OrderRepository(testDatabase);",
                  "  const order = await repository.create({ items: [{ id: 1, price: 10 }] });",
                  "",
                  "  const reloaded = await repository.findById(order.id);",
                  "  if (reloaded.items.length !== 1) throw new Error(\"itens não persistidos corretamente\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se o mapeamento entre o objeto Order e as tabelas do banco estiver errado, nenhum unit test " +
                "pegaria isso — só um teste que realmente grava e lê do banco revela esse tipo de falha.",
            },
            {
              title: "Dois serviços internos se comunicando",
              context: "Integração não é só \"com o banco\" — pode ser entre módulos internos do próprio sistema.",
              code: {
                language: "javascript",
                filename: "checkout-flow.integration.test.js",
                code: [
                  "async function testCheckoutChargesCorrectAmount() {",
                  "  const cart = new CartService();",
                  "  const payment = new PaymentService();",
                  "  const checkout = new CheckoutService(cart, payment);",
                  "",
                  "  await cart.addItem({ id: 1, price: 50 });",
                  "  const receipt = await checkout.process();",
                  "",
                  "  if (receipt.amountCharged !== 50) throw new Error(\"valor cobrado incorreto\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "CheckoutService recebe instâncias reais de CartService e PaymentService, não dublês — o teste " +
                "verifica que os dois módulos, combinados, produzem o comportamento correto de ponta a ponta " +
                "dentro do sistema.",
            },
            {
              title: "Client HTTP contra uma API real de teste",
              context: "Quando o sistema depende de uma API externa, um teste de integração pode rodar contra um ambiente de teste dela.",
              code: {
                language: "javascript",
                filename: "payment-gateway.integration.test.js",
                code: [
                  "async function testGatewayAcceptsValidCard() {",
                  "  const gateway = new PaymentGateway(TEST_API_URL);",
                  "  const result = await gateway.charge({ cardToken: \"tok_test_valid\", amount: 100 });",
                  "",
                  "  if (result.status !== \"approved\") throw new Error(\"cobrança de teste deveria ser aprovada\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "TEST_API_URL aponta para o ambiente sandbox do provedor de pagamento — o teste exercita a " +
                "chamada HTTP real, a autenticação real e o parsing real da resposta, sem substituir nada por um dublê.",
            },
          ],
          exercise: {
            problem:
              "O time escreveu só unit tests para UserRepository, substituindo o banco por um dublê em memória " +
              "em todos eles. Um bug em produção revelou que a query real tinha um erro de sintaxe SQL que " +
              "nenhum teste pegou.",
            problemCode: {
              language: "javascript",
              filename: "user-repository.js",
              code: [
                "class UserRepository {",
                "  constructor(db) {",
                "    this.db = db;",
                "  }",
                "  async findByEmail(email) {",
                "    return this.db.query(\"SELECT * FORM users WHERE email = ?\", [email]);",
                "  }",
                "}",
              ].join("\n"),
            },
            task:
              "Explique por que um unit test com dublê não pegaria o erro de sintaxe (\"FORM\" em vez de \"FROM\") " +
              "e descreva, em código, que tipo de teste pegaria.",
            hint: "Pense no que exatamente um dublê em memória está simulando: ele reimplementa o comportamento esperado, ou reimplementa o parsing da string SQL?",
            solution: {
              code: {
                language: "javascript",
                filename: "user-repository.integration.test.js",
                code: [
                  "async function testFindByEmailAgainstRealDatabase() {",
                  "  const repository = new UserRepository(testDatabase);",
                  "  await testDatabase.seed({ email: \"ana@example.com\" });",
                  "",
                  "  const user = await repository.findByEmail(\"ana@example.com\");",
                  "  if (!user) throw new Error(\"usuário deveria ter sido encontrado\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um dublê em memória nunca interpreta a string SQL — ele só simula \"dado um email, devolva um " +
                "usuário\", então um erro de sintaxe na query real passa despercebido. Só um teste de integração, " +
                "que roda a query de verdade contra um banco de verdade (mesmo que efêmero), teria acusado o " +
                "\"FORM\" quebrado.",
            },
          },
        }),
        concept({
          order: 80,
          title: "E2E Testing",
          requires: ["Integration Testing"],
          note: "o caso máximo de integração — sistema inteiro, ótica do usuário",
          summary: "E2E Testing é testar o sistema inteiro, de ponta a ponta, pelo caminho que um usuário real percorreria.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "O teste abre a aplicação, clica em botões, preenche formulários e espera respostas — tudo através da " +
                "interface real, contra um backend real (ou o mais próximo disso possível). Não há nenhuma parte do " +
                "sistema substituída por dublê; é o caso limite de Integration Testing, levado ao sistema inteiro.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Reserve o E2E para as poucas jornadas que não podem quebrar, e deixe as regras de negócio para testes " +
                "menores.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Unit e integration tests provam que peças e conjuntos de peças funcionam, mas nenhum dos dois " +
                "garante que a jornada completa do usuário funciona — o roteamento do frontend, a autenticação, " +
                "a chamada de API, a renderização do resultado, tudo encadeado. E2E existe para responder uma " +
                "pergunta que nenhum teste mais granular consegue: \"um usuário real consegue completar essa " +
                "tarefa, do início ao fim?\"",
            },
            {
              type: "paragraph",
              text:
                "É também o teste mais caro de manter: mais lento (minutos, não milissegundos), mais frágil a " +
                "mudanças de UI, e mais difícil de depurar quando falha (o erro pode estar em qualquer camada do " +
                "sistema). Por isso, times tendem a ter poucos E2E tests, cobrindo só os fluxos mais críticos — " +
                "não é uma substituição para unit e integration tests, é um complemento no topo.",
            },
            { type: "heading", text: "Na prática" },
            {
              type: "paragraph",
              text: "um teste E2E usando uma ferramenta de automação de navegador (a API abaixo é ilustrativa, no estilo Playwright/Cypress):",
            },
            {
              type: "code",
              language: "javascript",
              filename: "checkout.e2e.test.js",
              code: [
                "async function testUserCanCompleteCheckout(page) {",
                "  await page.goto(\"/products/42\");",
                "  await page.click(\"text=Adicionar ao carrinho\");",
                "  await page.click(\"text=Finalizar compra\");",
                "  await page.fill(\"#card-number\", \"4242424242424242\");",
                "  await page.click(\"text=Confirmar pagamento\");",
                "",
                "  const confirmation = await page.textContent(\"#confirmation-message\");",
                "  if (!confirmation.includes(\"Pedido confirmado\")) {",
                "    throw new Error(\"mensagem de confirmação não apareceu\");",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Esse teste abre um navegador de verdade, navega até uma página de produto, clica em botões " +
                "reais e preenche um formulário real — contra uma aplicação rodando de ponta a ponta. Se " +
                "qualquer camada quebrar (frontend, API, banco, gateway de pagamento), esse teste falha, porque " +
                "ele depende de todas elas funcionando juntas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para os fluxos mais críticos do negócio, como cadastro, login e pagamento.",
                "Para confirmar que o sistema inteiro funciona no ambiente mais próximo de produção.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "São os mais lentos, caros e instáveis; cobrir tudo com E2E torna a suíte lenta e pouco confiável.",
                "Quando falham, indicam que algo quebrou, mas raramente onde; regras de negócio ficam melhor em testes menores.",
              ],
            },
          ],
          examples: [
            {
              title: "Um fluxo crítico de negócio",
              context: "E2E vale mais em jornadas onde uma falha é cara — como o checkout de um e-commerce.",
              code: {
                language: "javascript",
                filename: "checkout.e2e.test.js",
                code: [
                  "async function testGuestCheckoutFlow(page) {",
                  "  await page.goto(\"/cart\");",
                  "  await page.click(\"text=Continuar como convidado\");",
                  "  await page.fill(\"#email\", \"convidado@example.com\");",
                  "  await page.click(\"text=Finalizar pedido\");",
                  "",
                  "  const status = await page.textContent(\"#order-status\");",
                  "  if (status !== \"Pedido recebido\") throw new Error(\"checkout de convidado falhou\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Esse fluxo envolve carrinho, autenticação de convidado, criação de pedido e confirmação — " +
                "dezenas de linhas de código de produção, em várias camadas, todas exercitadas de uma vez.",
            },
            {
              title: "Verificando um estado visível na tela, não um retorno de função",
              context: "E2E tests verificam o que o usuário veria, não o valor de retorno de uma função interna.",
              code: {
                language: "javascript",
                filename: "search.e2e.test.js",
                code: [
                  "async function testSearchShowsResults(page) {",
                  "  await page.goto(\"/search\");",
                  "  await page.fill(\"#search-input\", \"notebook\");",
                  "  await page.press(\"#search-input\", \"Enter\");",
                  "",
                  "  const resultsCount = await page.locator(\".search-result\").count();",
                  "  if (resultsCount === 0) throw new Error(\"nenhum resultado apareceu na tela\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A asserção olha para o DOM renderizado (.search-result contado na tela), não para o retorno de " +
                "uma função de busca — é isso que torna o teste fiel à experiência real do usuário.",
            },
            {
              title: "E2E contra um ambiente próximo de produção",
              context: "Para ser confiável, o ambiente do teste E2E precisa se parecer o máximo possível com produção.",
              code: {
                language: "javascript",
                filename: "ci-e2e-config.js",
                code: ["const config = {", "  baseUrl: process.env.STAGING_URL,", "  browser: \"chromium\",", "  retries: 1,", "};"].join("\n"),
              },
              explanation:
                "E2E tests geralmente rodam contra um ambiente de staging — o mais parecido com produção possível " +
                "— em vez de contra mocks locais, porque o objetivo é detectar problemas de integração real " +
                "entre todos os sistemas envolvidos.",
            },
          ],
          exercise: {
            problem:
              "O time tem 200 unit tests e 40 integration tests, mas nenhum E2E test. Um bug em produção " +
              "aconteceu porque o botão \"Finalizar compra\" ficava desabilitado por um erro de CSS que nenhum " +
              "teste automatizado pegou — apesar da lógica de checkout estar 100% coberta por testes.",
            task:
              "Explique por que unit e integration tests não pegariam esse bug específico, e escreva, em código, " +
              "o tipo de teste que pegaria.",
            hint: "Pense em qual camada do sistema o bug estava — e em quais camadas cada tipo de teste realmente executa.",
            solution: {
              code: {
                language: "javascript",
                filename: "checkout.e2e.test.js",
                code: [
                  "async function testCheckoutButtonIsClickable(page) {",
                  "  await page.goto(\"/cart\");",
                  "  const button = page.locator(\"text=Finalizar compra\");",
                  "",
                  "  const isEnabled = await button.isEnabled();",
                  "  if (!isEnabled) throw new Error(\"botão de finalizar compra está desabilitado\");",
                  "",
                  "  await button.click();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Unit e integration tests não renderizam CSS nem verificam o estado visual real de um elemento na " +
                "tela — eles testam lógica e dados. Só um teste que roda num navegador de verdade, como este, " +
                "interage com o botão exatamente como um usuário faria e teria detectado que ele estava " +
                "desabilitado por um problema de estilo.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "test-doubles",
      order: 20,
      title: "Test Doubles",
      requires: ["Testing Fundamentals", "Programming Foundations / Programming Fundamentals / Interface"],
      summary:
        "Guarda-chuva → do mais inerte ao mais acoplado ao teste: dummy → stub → fake → spy → mock. " +
        "Todos dependem só de Test Doubles — a progressão é de complexidade, não de pré-requisito.",
      suggestions: ["Seam", "Mocking Framework", "Over-Mocking / Mock Hell", "Classicist vs Mockist (Chicago vs London)"],
      concepts: [
        concept({
          order: 10,
          title: "Test Doubles",
          requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Interface"],
          note: "termo guarda-chuva (taxonomia de Meszaros)",
          collision: "nome da Story = nome desta Task — esta é a Task do conceito-guarda-chuva",
          summary:
            "O termo guarda-chuva para qualquer objeto que substitui uma dependência real dentro de um teste — " +
            "dummy, stub, fake, spy e mock são cinco variações dessa mesma ideia, cada uma com um propósito diferente.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Test Double é qualquer objeto que substitui, dentro de um teste, uma dependência real de que o " +
                "código sob teste precisa — um banco de dados, uma API externa, um serviço de e-mail. O nome " +
                "vem de \"stunt double\" (dublê de cinema): assim como um dublê substitui o ator numa cena " +
                "perigosa, um test double substitui a dependência real num cenário onde usá-la de verdade seria " +
                "lento, instável ou impossível.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Test Double é o termo guarda-chuva para qualquer substituto de uma dependência real dentro de um " +
                "teste — dummy, stub, fake, spy e mock são cinco variações dessa mesma ideia, cada uma " +
                "emprestando só o comportamento que o teste precisa.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Algumas dependências tornam um teste de unidade impraticável: chamar uma API de pagamento de " +
                "verdade a cada teste é lento, custa dinheiro e depende de rede; ler de um banco de produção " +
                "pode até ser destrutivo. Test Doubles existem para que o código sob teste continue recebendo " +
                "algo que satisfaz a mesma interface, sem pagar o custo (ou o risco) da dependência real.",
            },
            {
              type: "paragraph",
              text:
                "A taxonomia com cinco nomes — dummy, stub, fake, spy, mock — vem do livro de Gerard Meszaros " +
                "(xUnit Test Patterns) e existe porque \"dublê\" sozinho não diz o suficiente: cada variação " +
                "responde de menos comportamento para mais e de nenhuma verificação para verificação ativa. " +
                "Escolher o dublê certo é escolher o mínimo necessário para o teste, não o mais sofisticado disponível.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um código que depende de um serviço de e-mail, e um dublê mínimo que o substitui no teste:" },
            {
              type: "code",
              language: "javascript",
              filename: "welcome-email-sender.test.js",
              code: [
                "class WelcomeEmailSender {",
                "  constructor(emailService) {",
                "    this.emailService = emailService;",
                "  }",
                "  send(user) {",
                "    this.emailService.send(user.email, \"Bem-vindo!\");",
                "  }",
                "}",
                "",
                "function testWelcomeEmailIsSent() {",
                "  const fakeEmailService = { send: () => {} };",
                "  const sender = new WelcomeEmailSender(fakeEmailService);",
                "",
                "  sender.send({ email: \"ana@example.com\" });",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "fakeEmailService satisfaz a mesma interface que emailService real esperaria (um método send), " +
                "mas não envia e-mail nenhum de verdade. O teste consegue exercitar WelcomeEmailSender sem " +
                "depender de um provedor de e-mail real — esse objeto simples já é um Test Double, mesmo antes " +
                "de decidirmos que tipo específico ele é.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Dublês só são possíveis quando a dependência entra por fora, por injeção; sem isso, o código cria a " +
                "dependência real por dentro.",
                "Dublê demais deixa o teste preso à implementação e distante do comportamento real, e ele pode passar com o " +
                "sistema quebrado.",
                "Escolha o tipo mais simples que resolve: dummy, stub, fake, spy ou mock servem a propósitos diferentes.",
              ],
            },
          ],
          examples: [
            {
              title: "Substituindo uma dependência de rede",
              context: "O caso mais comum: evitar chamadas de rede reais dentro de um unit test.",
              code: {
                language: "javascript",
                filename: "weather.test.js",
                code: ["function fetchWeather(httpClient, city) {", "  return httpClient.get(`/weather/${city}`);", "}", "", "const fakeHttpClient = { get: (url) => ({ temperature: 25 }) };", "fetchWeather(fakeHttpClient, \"São Paulo\");"].join("\n"),
              },
              explanation:
                "fakeHttpClient substitui uma chamada HTTP real por uma resposta fixa, sem tocar rede — o teste " +
                "roda em milissegundos, não em segundos.",
            },
            {
              title: "Substituindo o relógio do sistema",
              context: "Dependências de tempo também costumam ser substituídas por um dublê determinístico.",
              code: {
                language: "javascript",
                filename: "token.test.js",
                code: ["function isExpired(token, clock) {", "  return clock.now() > token.expiresAt;", "}", "", "const fixedClock = { now: () => 1700000000000 };", "isExpired({ expiresAt: 1600000000000 }, fixedClock);"].join("\n"),
              },
              explanation:
                "Sem fixedClock, o teste dependeria do momento exato em que roda — um dublê de relógio torna o " +
                "comportamento previsível e repetível, não importa quando o teste seja executado.",
            },
            {
              title: "Injeção de dependência como pré-requisito",
              context: "Um Test Double só é possível quando o código aceita a dependência de fora, em vez de criá-la internamente.",
              code: {
                language: "javascript",
                filename: "report-generator.js",
                code: ["class ReportGenerator {", "  constructor(database) {", "    this.database = database;", "  }", "  generate() {", "    return this.database.query(\"SELECT * FROM sales\");", "  }", "}"].join("\n"),
              },
              explanation:
                "database é recebido no construtor (injeção de dependência), não instanciado dentro da classe — " +
                "é isso que permite passar um dublê no lugar do banco real durante o teste (ver Testability, no " +
                "módulo Testing Strategy).",
            },
          ],
          exercise: {
            problem:
              "A classe abaixo cria sua própria conexão com o banco dentro do construtor, o que torna impossível " +
              "substituí-la por um Test Double.",
            problemCode: {
              language: "javascript",
              filename: "order-service.js",
              code: ["class OrderService {", "  constructor() {", "    this.database = new PostgresConnection(PROD_DATABASE_URL);", "  }", "  save(order) {", "    return this.database.insert(\"orders\", order);", "  }", "}"].join("\n"),
            },
            task:
              "Reescreva OrderService para aceitar a dependência de banco de dados como parâmetro, tornando " +
              "possível substituí-la por um Test Double em testes.",
            hint: "A dependência precisa entrar de fora (via construtor ou parâmetro), não ser criada dentro da classe.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-service.js",
                code: [
                  "class OrderService {",
                  "  constructor(database) {",
                  "    this.database = database;",
                  "  }",
                  "  save(order) {",
                  "    return this.database.insert(\"orders\", order);",
                  "  }",
                  "}",
                  "",
                  "function testSaveCallsDatabase() {",
                  "  const fakeDatabase = { insert: () => ({ id: 1 }) };",
                  "  const service = new OrderService(fakeDatabase);",
                  "",
                  "  service.save({ total: 100 });",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com database recebido no construtor, um teste pode passar fakeDatabase no lugar da conexão real " +
                "— a classe não sabe (nem precisa saber) se está recebendo o banco de produção ou um dublê.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Dummy",
          isNew: true,
          requires: ["Test Doubles"],
          note: "objeto passado mas nunca usado — só preenche uma assinatura",
          summary:
            "O dublê mais inerte de todos: um objeto passado como argumento só porque a assinatura exige, mas " +
            "que nunca é de fato usado dentro do código sob teste.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um dummy é um objeto que existe só para preencher um parâmetro — o código sob teste recebe o " +
                "dummy, mas nunca chama nenhum método nele nem lê nenhuma propriedade sua. Se a assinatura de " +
                "uma função exige três argumentos e o teste só se importa com dois deles, o terceiro pode ser um " +
                "dummy: qualquer valor (às vezes até null ou {}) que satisfaça o tipo esperado, sem nenhum " +
                "comportamento por trás.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um dummy é o dublê mais inerte: existe só para preencher uma assinatura, sem nenhum " +
                "comportamento por trás — o sinal de que aquele parâmetro é irrelevante para o que o teste está " +
                "verificando.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Nem toda dependência precisa de um comportamento simulado — às vezes ela só precisa \"estar " +
                "lá\" para que o código compile ou rode sem erro de tipo. Criar um dublê mais elaborado (um " +
                "stub, um mock) para algo que nunca é usado seria trabalho desperdiçado; o dummy existe " +
                "justamente para o caso em que nada mais é necessário.",
            },
            {
              type: "paragraph",
              text:
                "Um dummy também comunica intenção: ao ler um teste, ver um valor claramente marcado como dummy " +
                "(por exemplo, um objeto vazio nomeado unusedLogger) sinaliza para quem lê que aquele parâmetro " +
                "é irrelevante para o comportamento sendo testado — sem precisar investigar se ele é usado em " +
                "algum lugar escondido.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função que recebe um logger mas, no caminho testado, nunca chama nada nele:" },
            {
              type: "code",
              language: "javascript",
              filename: "calculate-total.test.js",
              code: [
                "function calculateTotal(items, logger) {",
                "  return items.reduce((sum, item) => sum + item.price, 0);",
                "}",
                "",
                "function testCalculateTotal() {",
                "  const dummyLogger = {};",
                "  const result = calculateTotal([{ price: 10 }, { price: 20 }], dummyLogger);",
                "",
                "  if (result !== 30) throw new Error(`esperava 30, recebeu ${result}`);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "dummyLogger é um objeto vazio — calculateTotal recebe logger como parâmetro (a assinatura " +
                "exige), mas nunca chama nenhum método nele. O teste passa qualquer coisa ali só para satisfazer " +
                "a assinatura; se calculateTotal um dia passar a usar logger.info(...), esse teste quebraria e " +
                "sinalizaria que o dummy não é mais suficiente.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Se o dummy for chamado, o teste quebra; isso é sinal de que o parâmetro não era irrelevante.",
                "Muitos dummies em um teste indicam código mal desenhado: parâmetros demais ou responsabilidades misturadas.",
              ],
            },
          ],
          examples: [
            {
              title: "Dummy para satisfazer um construtor",
              context: "Quando uma classe exige uma dependência no construtor, mas o teste não exercita nenhum caminho que a use.",
              code: {
                language: "javascript",
                filename: "invoice-printer.test.js",
                code: [
                  "class InvoicePrinter {",
                  "  constructor(printer, auditLogger) {",
                  "    this.printer = printer;",
                  "    this.auditLogger = auditLogger;",
                  "  }",
                  "  formatTotal(invoice) {",
                  "    return `Total: R$${invoice.total.toFixed(2)}`;",
                  "  }",
                  "}",
                  "",
                  "const dummyPrinter = {};",
                  "const dummyAuditLogger = {};",
                  "new InvoicePrinter(dummyPrinter, dummyAuditLogger).formatTotal({ total: 42 });",
                ].join("\n"),
              },
              explanation:
                "formatTotal não usa printer nem auditLogger — os dois são dummies só para satisfazer o " +
                "construtor. Testar formatTotal não exige simular impressão nem auditoria.",
            },
            {
              title: "Dummy vs. valor primitivo simples",
              context: "Às vezes o dummy nem precisa ser um objeto — um valor qualquer do tipo certo já resolve.",
              code: {
                language: "javascript",
                filename: "greet.test.js",
                code: ["function greet(name, unusedRequestId) {", "  return `Olá, ${name}!`;", "}", "", "greet(\"Ana\", \"qualquer-coisa\");"].join("\n"),
              },
              explanation:
                "unusedRequestId nunca é lido dentro de greet — passar a string \"qualquer-coisa\" é tão válido " +
                "quanto um objeto elaborado, porque o valor em si é irrelevante.",
            },
            {
              title: "Quando um dummy vira sinal de código mal desenhado",
              context: "Muitos parâmetros dummy num mesmo teste podem indicar que a função tem responsabilidade demais.",
              code: {
                language: "javascript",
                filename: "process-order.js",
                code: ["function processOrder(order, paymentGateway, emailService, inventorySystem, auditLog) {", "  return order.items.length > 0;", "}"].join("\n"),
              },
              explanation:
                "Se um teste de processOrder precisa passar quatro dummies para testar uma verificação simples, " +
                "é sinal de que a função recebe dependências que a maioria dos seus caminhos nem usa — " +
                "candidato a ser dividida (ver Cohesion, na Área 1).",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo cria um EmailService falso inteiro, com um método send() que nunca é chamado no " +
              "caminho testado, só para satisfazer o construtor de UserRegistrar.",
            problemCode: {
              language: "javascript",
              filename: "user-registrar.test.js",
              code: [
                "class UserRegistrar {",
                "  constructor(emailService) {",
                "    this.emailService = emailService;",
                "  }",
                "  isValidEmail(email) {",
                "    return email.includes(\"@\");",
                "  }",
                "}",
                "",
                "function testIsValidEmail() {",
                "  const fakeEmailService = {",
                "    send: (to, subject, body) => { console.log(`enviando para ${to}`); },",
                "  };",
                "  const registrar = new UserRegistrar(fakeEmailService);",
                "",
                "  if (!registrar.isValidEmail(\"ana@example.com\")) throw new Error(\"deveria ser válido\");",
                "}",
              ].join("\n"),
            },
            task: "Simplifique fakeEmailService para um dummy, já que isValidEmail não usa emailService de forma nenhuma.",
            hint: "Um dummy não precisa de nenhum método implementado — só precisa existir para satisfazer o construtor.",
            solution: {
              code: {
                language: "javascript",
                filename: "user-registrar.test.js",
                code: [
                  "function testIsValidEmail() {",
                  "  const dummyEmailService = {};",
                  "  const registrar = new UserRegistrar(dummyEmailService);",
                  "",
                  "  if (!registrar.isValidEmail(\"ana@example.com\")) throw new Error(\"deveria ser válido\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "dummyEmailService não precisa de um método send simulado — isValidEmail nunca chama " +
                "emailService.send, então qualquer objeto (mesmo vazio) satisfaz o construtor sem trabalho extra.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Stub",
          requires: ["Test Doubles"],
          note: "respostas prontas, sem verificação",
          summary:
            "Um dublê que devolve respostas pré-programadas e fixas quando chamado — ao contrário do dummy, o " +
            "stub é de fato usado, mas nunca verificado sobre como foi chamado.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um stub é um dublê que, quando um de seus métodos é chamado, devolve um valor fixo e " +
                "pré-programado — sem lógica real por trás, sem verificar dados de entrada, sem checar se e " +
                "quantas vezes foi chamado. O código sob teste chama o stub e usa a resposta dele como se fosse " +
                "a dependência real, mas o teste em si não faz nenhuma asserção sobre o stub — só sobre o " +
                "resultado do código que o usou.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um stub devolve respostas fixas e pré-programadas quando chamado — usado de fato pelo código " +
                "sob teste, mas nunca verificado quanto a como foi chamado; o teste avalia o efeito da resposta, " +
                "não a chamada em si.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Muitas vezes o comportamento que se quer testar depende do valor que uma dependência devolve, " +
                "não de como a dependência foi chamada. Um stub existe para controlar exatamente essa resposta: " +
                "\"faça de conta que a API de câmbio devolveu 5.2\" — permitindo testar como o código reage a " +
                "diferentes respostas (incluindo casos de erro) sem depender da dependência real produzir " +
                "aquele cenário.",
            },
            {
              type: "paragraph",
              text:
                "A diferença de um dummy é que o stub é de fato chamado e seu retorno é usado pelo código sob " +
                "teste — não é só um preenchedor de assinatura. A diferença de um spy ou mock é que ninguém " +
                "verifica como o stub foi chamado; o teste só olha para o efeito indireto da resposta que ele devolveu.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um stub que devolve uma taxa de câmbio fixa, para testar a conversão de moeda:" },
            {
              type: "code",
              language: "javascript",
              filename: "currency.test.js",
              code: [
                "function convertToUSD(amountInBRL, exchangeRateProvider) {",
                "  const rate = exchangeRateProvider.getRate(\"USD\");",
                "  return amountInBRL / rate;",
                "}",
                "",
                "function testConvertToUSD() {",
                "  const stubProvider = { getRate: () => 5.0 };",
                "  const result = convertToUSD(100, stubProvider);",
                "",
                "  if (result !== 20) throw new Error(`esperava 20, recebeu ${result}`);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "stubProvider.getRate sempre devolve 5.0, não importa o argumento — é uma resposta fixa e " +
                "pré-programada. O teste verifica que convertToUSD calcula corretamente a partir dessa taxa " +
                "conhecida, sem depender de uma API de câmbio real (que poderia devolver um valor diferente a " +
                "cada execução).",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para simular respostas que são difíceis de provocar de verdade, como erros de rede ou dados específicos.",
                "Quando o teste avalia o efeito da resposta, e não como a dependência foi chamada.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não faça assertion sobre o stub: se importa como ele foi chamado, o dublê certo é um spy ou um mock.",
                "Respostas fixas não têm lógica nem estado; quando o cenário precisa disso, um fake é mais adequado.",
              ],
            },
          ],
          examples: [
            {
              title: "Stub simulando um cenário de erro",
              context: "Stubs são especialmente úteis para forçar cenários difíceis de reproduzir com a dependência real, como uma falha.",
              code: {
                language: "javascript",
                filename: "user-profile.test.js",
                code: [
                  "function fetchUserProfile(userId, apiClient) {",
                  "  const response = apiClient.get(`/users/${userId}`);",
                  "  if (response.status === 404) return null;",
                  "  return response.body;",
                  "}",
                  "",
                  "const stubClient = { get: () => ({ status: 404 }) };",
                  "fetchUserProfile(999, stubClient);",
                ].join("\n"),
              },
              explanation:
                "Provocar um 404 real exigiria um usuário inexistente de verdade numa API real; o stub simula " +
                "essa resposta instantaneamente e de forma determinística, permitindo testar o caminho null.",
            },
            {
              title: "Stub com respostas diferentes por chamada",
              context: "Um stub pode ser programado para devolver valores diferentes em chamadas sucessivas.",
              code: {
                language: "javascript",
                filename: "retry.test.js",
                code: [
                  "let callCount = 0;",
                  "const flakyStub = {",
                  "  fetch: () => {",
                  "    callCount++;",
                  "    return callCount === 1 ? { status: 500 } : { status: 200, data: \"ok\" };",
                  "  },",
                  "};",
                ].join("\n"),
              },
              explanation:
                "flakyStub simula uma API que falha na primeira tentativa e funciona na segunda — útil para " +
                "testar lógica de retry sem depender de uma falha real e imprevisível de rede.",
            },
            {
              title: "Stub vs. asserção sobre o stub (o que NÃO fazer)",
              context: "Verificar como um stub foi chamado mistura os papéis de stub e spy/mock.",
              code: {
                language: "javascript",
                filename: "user-lookup.test.js",
                code: ["const stubDatabase = { findById: () => ({ id: 1, name: \"Ana\" }) };", "const user = repository.findUser(1, stubDatabase);", "", "if (user.name !== \"Ana\") throw new Error(\"nome incorreto\");"].join("\n"),
              },
              explanation:
                "O teste verifica o resultado (user.name), não se findById foi chamado com o argumento certo — " +
                "essa é a linha que separa um uso de stub de um uso de spy/mock sobre o mesmo objeto.",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo tenta testar um cenário de estoque insuficiente, mas depende de um serviço de " +
              "inventário real que só retorna estoque baixo em condições específicas do banco de teste, " +
              "tornando o teste instável (flaky).",
            problemCode: {
              language: "javascript",
              filename: "availability.test.js",
              code: [
                "function checkAvailability(productId, inventoryService) {",
                "  const stock = inventoryService.getStock(productId);",
                "  return stock > 0;",
                "}",
                "",
                "function testCheckAvailabilityWhenOutOfStock() {",
                "  const realInventoryService = new InventoryService(testDatabase);",
                "  const available = checkAvailability(42, realInventoryService);",
                "  if (available) throw new Error(\"produto 42 deveria estar sem estoque no banco de teste\");",
                "}",
              ].join("\n"),
            },
            task: "Substitua realInventoryService por um stub que devolve estoque zero de forma determinística, eliminando a dependência do estado do banco de teste.",
            hint: "Um stub para este caso só precisa de um método getStock que sempre devolve 0.",
            solution: {
              code: {
                language: "javascript",
                filename: "availability.test.js",
                code: [
                  "function testCheckAvailabilityWhenOutOfStock() {",
                  "  const stubInventoryService = { getStock: () => 0 };",
                  "  const available = checkAvailability(42, stubInventoryService);",
                  "",
                  "  if (available) throw new Error(\"deveria estar indisponível quando estoque é 0\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "stubInventoryService sempre devolve 0, independente de qualquer dado no banco de teste — o " +
                "teste passa a ser determinístico e independente de estado externo, exercitando só a lógica de checkAvailability.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Fake",
          requires: ["Test Doubles"],
          note: "implementação real porém simplificada (ex.: repositório em memória)",
          collision: "≠ Fake Model (AI Engineering / deck harness) — mesmo padrão, outro domínio",
          summary:
            "Uma implementação de fato funcional da dependência, só que simplificada — como um repositório em " +
            "memória no lugar de um banco de dados real — em vez de respostas fixas ou verificações de chamada.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um fake é uma implementação que realmente funciona — tem lógica de verdade por trás, não " +
                "apenas respostas fixas — mas é simplificada em relação à dependência real de produção. O " +
                "exemplo clássico é um repositório em memória: um objeto que guarda dados num array ou Map em " +
                "vez de gravar em um banco de dados de verdade, mas que implementa save, findById, delete etc. " +
                "com comportamento genuíno.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um fake é uma implementação funcional e simplificada da dependência — tem lógica e estado " +
                "reais, ao contrário de um stub (respostas fixas), mas é mais simples e mais rápida que a versão de produção.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um stub responde a uma chamada fixa; mas alguns testes precisam de comportamento consistente " +
                "através de várias operações — salvar um item e depois buscá-lo de volta, por exemplo, exige " +
                "que o \"banco falso\" realmente lembre o que foi salvo. Um stub sozinho não dá conta disso sem " +
                "virar uma teia de condicionais; um fake resolve isso tendo estado e lógica real, só que mais " +
                "simples e mais rápida que a versão de produção.",
            },
            {
              type: "paragraph",
              text:
                "Fakes também são úteis além dos testes: às vezes servem como implementação de desenvolvimento " +
                "local (por exemplo, rodar a aplicação inteira com um banco em memória, sem precisar instalar " +
                "Postgres) — um fake bem feito é reutilizável em mais de um contexto.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um repositório em memória com comportamento real de salvar e buscar:" },
            {
              type: "code",
              language: "javascript",
              filename: "in-memory-user-repository.js",
              code: [
                "class InMemoryUserRepository {",
                "  constructor() {",
                "    this.users = new Map();",
                "    this.nextId = 1;",
                "  }",
                "  save(user) {",
                "    const id = this.nextId++;",
                "    const saved = { ...user, id };",
                "    this.users.set(id, saved);",
                "    return saved;",
                "  }",
                "  findById(id) {",
                "    return this.users.get(id) || null;",
                "  }",
                "}",
                "",
                "function testSaveAndFindUser() {",
                "  const repository = new InMemoryUserRepository();",
                "  const saved = repository.save({ name: \"Ana\" });",
                "  const found = repository.findById(saved.id);",
                "",
                "  if (found.name !== \"Ana\") throw new Error(\"usuário não encontrado corretamente\");",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "InMemoryUserRepository tem lógica real: gera IDs, guarda em um Map, devolve o que foi salvo " +
                "quando buscado por ID. Não é um banco de dados de verdade (some quando o processo termina, não " +
                "tem transações, não valida constraints), mas o comportamento de save + findById é genuíno o " +
                "bastante para exercitar o código que depende de um repositório.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o teste precisa de comportamento real e com estado, como um repositório em memória no lugar do banco.",
                "Quando a dependência real é lenta, cara ou instável, e o fake pode ser reutilizado em vários testes.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "O fake é código que também pode ter bugs e divergir da versão de produção; teste-o contra o mesmo contrato.",
                "Para uma resposta única e fixa, um stub é mais simples que manter uma implementação inteira.",
              ],
            },
          ],
          examples: [
            {
              title: "Fake de um serviço de fila de mensagens",
              context: "Filas assíncronas também podem ganhar uma versão em memória para testes.",
              code: {
                language: "javascript",
                filename: "in-memory-queue.js",
                code: ["class InMemoryQueue {", "  constructor() {", "    this.messages = [];", "  }", "  publish(message) {", "    this.messages.push(message);", "  }", "  consume() {", "    return this.messages.shift();", "  }", "}"].join("\n"),
              },
              explanation:
                "InMemoryQueue implementa publish/consume de verdade (com ordem FIFO real), sem depender de um " +
                "broker de mensagens de verdade rodando durante o teste.",
            },
            {
              title: "Fake reutilizado como ambiente de desenvolvimento local",
              context: "Um fake bem escrito pode servir tanto para testes quanto para rodar a aplicação localmente sem infraestrutura externa.",
              code: {
                language: "javascript",
                filename: "repository-factory.js",
                code: [
                  "const repository =",
                  "  process.env.NODE_ENV === \"test\" || process.env.NODE_ENV === \"development\"",
                  "    ? new InMemoryUserRepository()",
                  "    : new PostgresUserRepository(DATABASE_URL);",
                ].join("\n"),
              },
              explanation:
                "O mesmo fake usado nos testes evita que um desenvolvedor precise instalar e configurar Postgres " +
                "localmente só para rodar a aplicação — uma dependência a menos para começar a contribuir.",
            },
            {
              title: "Fake vs. stub para o mesmo cenário",
              context: "Quando testar salvar-e-buscar, um fake é a escolha certa; um stub não conseguiria simular esse comportamento com estado sem virar complexo demais.",
              code: {
                language: "javascript",
                filename: "stub-that-tries-to-fake.js",
                code: [
                  "const stubThatTriesToFake = {",
                  "  saved: null,",
                  "  save: function (user) { this.saved = user; return user; },",
                  "  findById: function () { return this.saved; },",
                  "};",
                ].join("\n"),
              },
              explanation:
                "Esse objeto já começou a ganhar lógica real (guardar o valor salvo) — no momento em que um " +
                "stub ganha estado e comportamento como esse, ele deixou de ser um stub e virou, na prática, um fake.",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo usa um stub que sempre devolve o mesmo usuário fixo, mas o cenário testado precisa " +
              "verificar que um usuário deletado deixa de ser encontrado — algo que um stub sem estado não " +
              "consegue simular.",
            problemCode: {
              language: "javascript",
              filename: "user-repository.test.js",
              code: [
                "function testDeletedUserIsNotFound() {",
                "  const stubRepository = { findById: () => ({ id: 1, name: \"Ana\" }) };",
                "  const repository = stubRepository;",
                "",
                "  repository.delete(1);",
                "  const found = repository.findById(1);",
                "",
                "  if (found !== null) throw new Error(\"usuário deletado não deveria ser encontrado\");",
                "}",
              ].join("\n"),
            },
            task:
              "Substitua stubRepository por um fake com estado real (InMemoryUserRepository, com delete " +
              "implementado), capaz de refletir a exclusão numa busca subsequente.",
            hint: "O comportamento precisa persistir entre chamadas — delete afetando o resultado de findById — o que exige estado real, não uma resposta fixa.",
            solution: {
              code: {
                language: "javascript",
                filename: "user-repository.test.js",
                code: [
                  "class InMemoryUserRepository {",
                  "  constructor() {",
                  "    this.users = new Map([[1, { id: 1, name: \"Ana\" }]]);",
                  "  }",
                  "  findById(id) {",
                  "    return this.users.get(id) || null;",
                  "  }",
                  "  delete(id) {",
                  "    this.users.delete(id);",
                  "  }",
                  "}",
                  "",
                  "function testDeletedUserIsNotFound() {",
                  "  const repository = new InMemoryUserRepository();",
                  "",
                  "  repository.delete(1);",
                  "  const found = repository.findById(1);",
                  "",
                  "  if (found !== null) throw new Error(\"usuário deletado não deveria ser encontrado\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "InMemoryUserRepository mantém estado real num Map — delete de fato remove a entrada, e " +
                "findById reflete isso na chamada seguinte. Um stub sem estado nunca conseguiria esse " +
                "comportamento sem virar, na prática, um fake.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Spy",
          requires: ["Test Doubles"],
          note: "registra chamadas para asserção posterior",
          summary:
            "Um dublê que envolve um comportamento real (ou simplificado) e, além disso, registra como foi " +
            "chamado — quantas vezes, com quais argumentos — para que o teste verifique isso depois.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um spy é um dublê que, além de (opcionalmente) se comportar como um stub ou delegar para a " +
                "implementação real, registra informações sobre como foi chamado: quantas vezes, com quais " +
                "argumentos, em que ordem. Depois que o código sob teste roda, o teste consulta esses registros " +
                "e faz asserções sobre eles — \"send foi chamado exatamente uma vez, com o e-mail correto\".",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um spy registra como foi chamado — quantas vezes, com quais argumentos — para que o teste " +
                "verifique isso depois do Act; é a ferramenta certa quando o comportamento que importa é um " +
                "efeito colateral, não um valor de retorno.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Alguns comportamentos importantes não têm um valor de retorno para verificar — eles são " +
                "efeitos colaterais. Enviar um e-mail, disparar um evento de analytics, chamar um serviço de " +
                "log: a única forma de confirmar que isso aconteceu é observar que a chamada ocorreu. Um spy " +
                "existe para tornar esse tipo de efeito colateral observável e verificável dentro de um teste.",
            },
            {
              type: "paragraph",
              text:
                "A diferença central para um stub é o momento da verificação: um stub é consultado só sobre o " +
                "que ele devolve (usado durante o Act); um spy é consultado sobre como ele foi usado (verificado " +
                "no Assert, depois do Act). É comum um spy também funcionar como stub ao mesmo tempo — " +
                "registrando chamadas E devolvendo um valor programado.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um spy que registra as chamadas a send, sem nenhum comportamento real por trás:" },
            {
              type: "code",
              language: "javascript",
              filename: "welcome-email-sender.test.js",
              code: [
                "function createSpy() {",
                "  const calls = [];",
                "  const spy = (...args) => calls.push(args);",
                "  spy.calls = calls;",
                "  return spy;",
                "}",
                "",
                "function testWelcomeEmailIsSentToCorrectAddress() {",
                "  const sendSpy = createSpy();",
                "  const sender = new WelcomeEmailSender({ send: sendSpy });",
                "",
                "  sender.send({ email: \"ana@example.com\" });",
                "",
                "  if (sendSpy.calls.length !== 1) throw new Error(\"send deveria ter sido chamado uma vez\");",
                "  if (sendSpy.calls[0][0] !== \"ana@example.com\") throw new Error(\"e-mail incorreto\");",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "createSpy devolve uma função que, a cada chamada, registra os argumentos recebidos em calls. " +
                "Depois de chamar sender.send, o teste inspeciona sendSpy.calls para verificar quantas vezes " +
                "send foi chamado e com que argumento — algo que um stub comum, sem esse registro, não permitiria verificar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o comportamento que importa é um efeito colateral, como disparar um evento ou enviar um e-mail, e " +
                "não um valor de retorno.",
                "Para verificar depois do Act quantas vezes e com quais argumentos algo foi chamado.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Verificar chamadas prende o teste à implementação; se há valor de retorno ou estado observável, verifique isso.",
                "Assertions sobre argumentos exatos quebram com qualquer mudança inofensiva; verifique só o que importa.",
              ],
            },
          ],
          examples: [
            {
              title: "Spy verificando que um evento de analytics foi disparado",
              context: "Efeitos colaterais como telemetria são um caso clássico para spy.",
              code: {
                language: "javascript",
                filename: "checkout.test.js",
                code: [
                  "function createSpy() {",
                  "  const calls = [];",
                  "  const spy = (...args) => calls.push(args);",
                  "  spy.calls = calls;",
                  "  return spy;",
                  "}",
                  "",
                  "const trackSpy = createSpy();",
                  "checkoutFlow.complete({ analytics: { track: trackSpy } });",
                  "",
                  "if (trackSpy.calls.length === 0) throw new Error(\"evento de analytics não foi disparado\");",
                ].join("\n"),
              },
              explanation:
                "O teste não se importa com o que track() devolve — se importa que ele foi chamado, confirmando " +
                "que o evento de conversão foi registrado.",
            },
            {
              title: "Spy envolvendo um objeto real (wrapping)",
              context: "Um spy pode registrar chamadas e ainda delegar para o comportamento real por trás.",
              code: {
                language: "javascript",
                filename: "spy-on.test.js",
                code: [
                  "function spyOn(obj, methodName) {",
                  "  const original = obj[methodName];",
                  "  const calls = [];",
                  "  obj[methodName] = (...args) => {",
                  "    calls.push(args);",
                  "    return original.apply(obj, args);",
                  "  };",
                  "  obj[methodName].calls = calls;",
                  "}",
                  "",
                  "spyOn(logger, \"warn\");",
                  "riskyOperation();",
                  "if (logger.warn.calls.length === 0) throw new Error(\"warn deveria ter sido chamado\");",
                ].join("\n"),
              },
              explanation:
                "spyOn substitui o método original por uma versão que registra a chamada e ainda executa o " +
                "comportamento real (original.apply) — útil quando o teste quer verificar a chamada sem perder " +
                "o efeito colateral verdadeiro.",
            },
            {
              title: "Verificando os argumentos exatos de uma chamada",
              context: "Spies não servem só para contar chamadas — também para verificar com que dados exatos algo foi chamado.",
              code: {
                language: "javascript",
                filename: "checkout-order.test.js",
                code: [
                  "const saveSpy = createSpy();",
                  "orderService.checkout({ repository: { save: saveSpy } });",
                  "",
                  "const [savedOrder] = saveSpy.calls[0];",
                  "if (savedOrder.status !== \"pending\") throw new Error(\"pedido deveria ser salvo como pending\");",
                ].join("\n"),
              },
              explanation:
                "O teste extrai o argumento da primeira chamada a save e verifica um campo específico — spies " +
                "dão acesso ao \"o quê\" exato que foi passado, não só \"quantas vezes\".",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo tenta verificar que uma notificação foi enviada, mas checkNotificationWasSent() " +
              "não existe — não há como saber, olhando de fora, se send foi chamado.",
            problemCode: {
              language: "javascript",
              filename: "order-service.test.js",
              code: [
                "function testOrderShippedNotifiesCustomer() {",
                "  const notificationService = { send: (to, message) => {} };",
                "  const orderService = new OrderService(notificationService);",
                "",
                "  orderService.markAsShipped({ customerEmail: \"ana@example.com\" });",
                "",
                "  if (!checkNotificationWasSent()) throw new Error(\"notificação não foi enviada\");",
                "}",
              ].join("\n"),
            },
            task: "Substitua notificationService.send por um spy, e reescreva a asserção final para usar os registros do spy em vez de checkNotificationWasSent().",
            hint: "O spy precisa registrar as chamadas para que o teste consulte esse registro depois, no lugar de uma função externa inexistente.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-service.test.js",
                code: [
                  "function createSpy() {",
                  "  const calls = [];",
                  "  const spy = (...args) => calls.push(args);",
                  "  spy.calls = calls;",
                  "  return spy;",
                  "}",
                  "",
                  "function testOrderShippedNotifiesCustomer() {",
                  "  const sendSpy = createSpy();",
                  "  const notificationService = { send: sendSpy };",
                  "  const orderService = new OrderService(notificationService);",
                  "",
                  "  orderService.markAsShipped({ customerEmail: \"ana@example.com\" });",
                  "",
                  "  if (sendSpy.calls.length !== 1) throw new Error(\"notificação não foi enviada\");",
                  "  if (sendSpy.calls[0][0] !== \"ana@example.com\") throw new Error(\"destinatário incorreto\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "sendSpy registra cada chamada a send — o teste passa a verificar diretamente esse registro " +
                "(quantidade e argumento) em vez de depender de uma função externa que não existia.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Mock",
          requires: ["Test Doubles"],
          note: "pré-programado com expectativas; verifica interação. Conceitualmente próximo de Spy (registra + verifica) — relação, não Requires.",
          collision: "\"mock\" coloquial = qualquer dublê; aqui é o sentido preciso",
          summary:
            "Um dublê pré-programado com expectativas sobre como deve ser chamado, que verifica essa interação " +
            "sozinho — se a expectativa não é cumprida, o próprio mock falha o teste, em vez de o teste " +
            "consultar um registro depois.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um mock é configurado, antes do Act, com uma expectativa explícita sobre como deve ser chamado " +
                "— \"espero que save seja chamado exatamente uma vez, com este argumento\". Depois que o código " +
                "sob teste roda, o próprio mock (ou um passo de verificação dedicado) confirma se a expectativa " +
                "foi cumprida. Se não foi, o mock reporta a falha — a lógica de verificação vive dentro do " +
                "dublê, não só no bloco Assert do teste.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um mock é pré-programado com uma expectativa sobre como deve ser chamado e verifica essa " +
                "expectativa sozinho — a interação, não só o valor de retorno, é o que decide se o teste passa.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um spy exige que o teste, depois do Act, escreva a lógica de verificação (\"tinha uma chamada? " +
                "com quais argumentos?\"). Um mock inverte isso: a expectativa é declarada antes, e o mock sabe " +
                "sozinho dizer se foi satisfeita. Para interações complexas — várias chamadas esperadas, em " +
                "ordem específica, com argumentos variados — declarar a expectativa de antemão pode deixar o " +
                "teste mais direto de ler do que reconstruir a verificação manualmente depois.",
            },
            {
              type: "paragraph",
              text:
                "Mock é também o termo mais usado coloquialmente para \"qualquer dublê\" — mas no sentido " +
                "técnico da taxonomia, mock é especificamente o dublê que verifica interação com base numa " +
                "expectativa pré-programada. É o mais próximo de spy (ambos verificam como foram chamados), mas " +
                "a verificação de um mock é interna e declarada antes; a de um spy é externa e consultada depois.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um mock simples, com expectativa declarada antes e verificação explícita depois:" },
            {
              type: "code",
              language: "javascript",
              filename: "welcome-email-sender.test.js",
              code: [
                "function createMock() {",
                "  const calls = [];",
                "  let expectedCalls = null;",
                "",
                "  const mock = (...args) => calls.push(args);",
                "  mock.expectCalledTimes = (n) => { expectedCalls = n; };",
                "  mock.verify = () => {",
                "    if (expectedCalls !== null && calls.length !== expectedCalls) {",
                "      throw new Error(`esperava ${expectedCalls} chamadas, recebeu ${calls.length}`);",
                "    }",
                "  };",
                "  return mock;",
                "}",
                "",
                "function testSendIsCalledExactlyOnce() {",
                "  const sendMock = createMock();",
                "  sendMock.expectCalledTimes(1);",
                "",
                "  const sender = new WelcomeEmailSender({ send: sendMock });",
                "  sender.send({ email: \"ana@example.com\" });",
                "",
                "  sendMock.verify();",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "sendMock.expectCalledTimes(1) declara a expectativa antes do Act; sendMock.verify() depois " +
                "confirma (ou lança erro) se ela foi cumprida. A diferença para o exemplo de Spy é sutil no " +
                "código, mas conceitual: aqui a expectativa é explícita e verificada por um método do próprio " +
                "dublê, não reconstruída manualmente pelo teste a partir de um array de chamadas.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a interação, como a ordem ou o número de chamadas, faz parte do comportamento a verificar.",
                "Em fronteiras com sistemas externos, onde a chamada correta é o único resultado observável.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Over-mocking: quando quase tudo é mock, o teste verifica a si mesmo e quebra a cada refatoração.",
                "Não use mock para simples respostas de dados; um stub basta e deixa o teste menos acoplado.",
              ],
            },
          ],
          examples: [
            {
              title: "Mock verificando ordem de chamadas",
              context: "Alguns cenários dependem da ordem em que métodos são chamados, não só de quantas vezes.",
              code: {
                language: "javascript",
                filename: "transaction.test.js",
                code: [
                  "function createOrderedMock() {",
                  "  const calls = [];",
                  "  return {",
                  "    call: (name) => calls.push(name),",
                  "    verifyOrder: (expected) => {",
                  "      if (JSON.stringify(calls) !== JSON.stringify(expected)) {",
                  "        throw new Error(`ordem incorreta: ${calls.join(\", \")}`);",
                  "      }",
                  "    },",
                  "  };",
                  "}",
                  "",
                  "const transactionMock = createOrderedMock();",
                  "transactionMock.call(\"begin\");",
                  "transactionMock.call(\"commit\");",
                  "transactionMock.verifyOrder([\"begin\", \"commit\"]);",
                ].join("\n"),
              },
              explanation:
                "transactionMock verifica não só que begin e commit foram chamados, mas que begin veio antes de " +
                "commit — uma expectativa sobre ordem que um stub ou spy simples não capturariam sem lógica extra.",
            },
            {
              title: "Mock de biblioteca (estilo Jest)",
              context: "Frameworks de teste oferecem mocks prontos, com a mesma ideia de expectativa declarada.",
              code: {
                language: "javascript",
                filename: "welcome-email-sender.test.js",
                code: [
                  "const sendMock = jest.fn();",
                  "const sender = new WelcomeEmailSender({ send: sendMock });",
                  "",
                  "sender.send({ email: \"ana@example.com\" });",
                  "",
                  "expect(sendMock).toHaveBeenCalledWith(\"ana@example.com\", \"Bem-vindo!\");",
                  "expect(sendMock).toHaveBeenCalledTimes(1);",
                ].join("\n"),
              },
              explanation:
                "jest.fn() cria um mock pronto para uso; toHaveBeenCalledWith e toHaveBeenCalledTimes são as " +
                "asserções específicas de interação que só fazem sentido para um dublê que registra e verifica chamadas.",
            },
            {
              title: "Quando um mock é exagero (over-mocking)",
              context: "Mockar demais acopla o teste aos detalhes de implementação, não ao comportamento.",
              code: {
                language: "javascript",
                filename: "cart-service.test.js",
                code: [
                  "expect(cartService.calculateSubtotal).toHaveBeenCalled();",
                  "expect(cartService.applyDiscount).toHaveBeenCalled();",
                  "expect(cartService.calculateTax).toHaveBeenCalled();",
                  "expect(cartService.formatTotal).toHaveBeenCalled();",
                ].join("\n"),
              },
              explanation:
                "Verificar que quatro métodos internos foram chamados, em vez de verificar só o total final, " +
                "acopla o teste a como checkout() é implementado por dentro — qualquer refatoração interna " +
                "(mesmo sem mudar o comportamento externo) quebraria esse teste.",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo declara uma expectativa no mock, mas nunca chama verify() — então o mock nunca " +
              "reportaria uma falha mesmo que send não tivesse sido chamado.",
            problemCode: {
              language: "javascript",
              filename: "welcome-email-sender.test.js",
              code: [
                "function testWelcomeEmailIsSent() {",
                "  const sendMock = createMock();",
                "  sendMock.expectCalledTimes(1);",
                "",
                "  const sender = new WelcomeEmailSender({ send: sendMock });",
                "  sender.send({ email: \"ana@example.com\" });",
                "}",
              ].join("\n"),
            },
            task: "Corrija o teste para que a expectativa declarada no mock seja de fato verificada antes do teste terminar.",
            hint: "createMock() (do exemplo mínimo) expõe um método verify() — ele precisa ser chamado explicitamente.",
            solution: {
              code: {
                language: "javascript",
                filename: "welcome-email-sender.test.js",
                code: [
                  "function testWelcomeEmailIsSent() {",
                  "  const sendMock = createMock();",
                  "  sendMock.expectCalledTimes(1);",
                  "",
                  "  const sender = new WelcomeEmailSender({ send: sendMock });",
                  "  sender.send({ email: \"ana@example.com\" });",
                  "",
                  "  sendMock.verify();",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Sem chamar sendMock.verify(), a expectativa declarada fica só documentada, nunca checada — o " +
                "teste passaria mesmo que send jamais fosse chamado. verify() é o passo que efetivamente compara " +
                "o que aconteceu com o que era esperado.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "test-driven-development",
      order: 30,
      title: "Test-Driven Development",
      requires: ["Testing Fundamentals"],
      summary:
        "A filosofia/disciplina (o \"quê\" e o \"porquê\") → o loop operacional (o \"como\"). " +
        "Test Doubles é usado na prática com colaboradores, mas não é pré-requisito do conceito.",
      suggestions: [
        "Behavior-Driven Development (BDD)",
        "Test-First vs Test-After",
        "Baby Steps",
        "Triangulation",
        "Fake It Till You Make It",
        "Outside-In vs Inside-Out TDD",
        "Test-Induced Design Damage",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Test-Driven Development",
          requires: ["Testing Fundamentals / Arrange-Act-Assert"],
          note: "disciplina test-first; por que TDD dirige o design; benefícios e custos",
          summary:
            "Escrever o teste antes do código que ele testa — uma disciplina que usa o próprio ato de testar " +
            "para guiar o design da solução, não só para verificá-la depois de pronta.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Test-Driven Development (TDD) é uma disciplina de desenvolvimento em que o teste de um " +
                "comportamento é escrito antes do código de produção que o implementa. Em vez de \"escrever a " +
                "função, depois testar\", a ordem se inverte: escrever um teste que descreve o comportamento " +
                "esperado (e que, nesse momento, falha — porque o código ainda não existe), e só então escrever " +
                "o código mínimo necessário para fazer esse teste passar.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "TDD inverte a ordem tradicional: o teste vem primeiro, e o código de produção existe só para " +
                "fazê-lo passar — uma disciplina que usa o teste para guiar o design, não só para verificá-lo depois.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Escrever o teste primeiro força quem programa a pensar na interface e no comportamento " +
                "desejado antes de pensar na implementação — o teste é, na prática, a primeira especificação " +
                "executável do que o código deve fazer. Isso tende a produzir código mais simples: só existe o " +
                "que é necessário para passar em algum teste, nada especulativo.",
            },
            {
              type: "paragraph",
              text:
                "TDD também garante, por construção, que todo código de produção tem cobertura de teste — é " +
                "impossível escrever código sem antes ter escrito (e visto falhar) o teste correspondente. O " +
                "custo é disciplina: escrever testes primeiro exige uma mudança de hábito e desacelera o ritmo " +
                "no curto prazo, em troca de design mais limpo e uma rede de segurança mais completa no longo prazo.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "o teste é escrito e roda (falhando) antes de calculateTotal existir:" },
            {
              type: "code",
              language: "javascript",
              filename: "cart-total.test.js",
              code: [
                "// Passo 1 — escrever o teste primeiro (ainda falha: calculateTotal não existe)",
                "function testCalculateTotalWithTwoItems() {",
                "  const result = calculateTotal([{ price: 10 }, { price: 20 }]);",
                "  if (result !== 30) throw new Error(`esperava 30, recebeu ${result}`);",
                "}",
                "",
                "// Passo 2 — só agora escrever o código mínimo para o teste passar",
                "function calculateTotal(items) {",
                "  return items.reduce((sum, item) => sum + item.price, 0);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O comentário marca a ordem real dos eventos: testCalculateTotalWithTwoItems foi escrito e " +
                "executado (e falhou, com \"calculateTotal is not defined\") antes de calculateTotal existir. Só " +
                "depois de ver essa falha é que calculateTotal foi escrito — o mínimo necessário para o teste " +
                "passar, nada além disso.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o design ainda está aberto: escrever o teste primeiro força a pensar na interface antes da " +
                "implementação.",
                "Em lógica com regras claras, onde cada teste vira um pequeno passo verificável.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Em exploração ou protótipo, quando ainda não se sabe o que construir, os testes escritos primeiro podem ser " +
                "descartados.",
                "TDD não substitui outros níveis de teste nem garante um bom design: os testes guiam, mas a decisão continua " +
                "sendo sua.",
              ],
            },
          ],
          examples: [
            {
              title: "TDD guiando uma decisão de interface",
              context: "Escrever o teste primeiro obriga a decidir como a função será chamada antes de decidir como ela funciona por dentro.",
              code: {
                language: "javascript",
                filename: "password.test.js",
                code: ["function testIsValidPassword() {", "  if (!isValidPassword(\"Senha123!\")) throw new Error(\"deveria ser válida\");", "  if (isValidPassword(\"123\")) throw new Error(\"deveria ser inválida\");", "}"].join("\n"),
              },
              explanation:
                "Antes de implementar qualquer regra de validação, esse teste já decidiu que isValidPassword " +
                "recebe uma string e devolve um boolean — uma decisão de design tomada antes de qualquer linha " +
                "de implementação existir.",
            },
            {
              title: "TDD produzindo só o código necessário",
              context: "Sem um teste pedindo por mais, TDD tende a evitar código especulativo.",
              code: {
                language: "javascript",
                filename: "currency.test.js",
                code: ["function testFormatCurrency() {", "  if (formatCurrency(10) !== \"R$10.00\") throw new Error(\"formato incorreto\");", "}", "", "function formatCurrency(value) {", "  return `R$${value.toFixed(2)}`;", "}"].join("\n"),
              },
              explanation:
                "formatCurrency não suporta outras moedas, localização ou negativos porque nenhum teste ainda " +
                "pediu por isso — TDD implementa o suficiente para os testes existentes passarem, não o que " +
                "\"pode ser útil um dia\".",
            },
            {
              title: "Um ciclo TDD completo em miniatura",
              context: "TDD em ação: teste → falha → implementação mínima → passa.",
              code: {
                language: "javascript",
                filename: "sum.test.js",
                code: ["// 1. Teste (falha: sum não existe)", "function testSumOfEmptyArray() {", "  if (sum([]) !== 0) throw new Error(\"soma de array vazio deveria ser 0\");", "}", "", "// 2. Implementação mínima (passa)", "function sum(numbers) {", "  return 0;", "}"].join("\n"),
              },
              explanation:
                "Note que sum sempre devolve 0 — é o código mínimo para passar nesse único teste. Um próximo " +
                "teste (\"soma de [1, 2, 3] deveria ser 6\") forçaria a implementação real; TDD avança em passos " +
                "pequenos, um teste de cada vez.",
            },
          ],
          exercise: {
            problem:
              "O código abaixo foi escrito antes de qualquer teste (test-after), e já inclui suporte a moedas " +
              "que ninguém pediu ainda.",
            problemCode: {
              language: "javascript",
              filename: "currency.js",
              code: ["function formatCurrency(value, currency = \"BRL\", locale = \"pt-BR\") {", "  const symbols = { BRL: \"R$\", USD: \"$\", EUR: \"€\" };", "  return `${symbols[currency]}${value.toFixed(2)}`;", "}"].join("\n"),
            },
            task:
              "Escreva o teste que, seguindo TDD, justificaria a existência do parâmetro currency — e " +
              "identifique se algum comportamento no código atual NÃO tem teste que o justifique.",
            hint: "Em TDD, cada trecho de comportamento só existe porque um teste específico o exige — se não há teste para algo, é código especulativo.",
            solution: {
              code: {
                language: "javascript",
                filename: "currency.test.js",
                code: [
                  "function testFormatCurrencyDefaultsToBRL() {",
                  "  if (formatCurrency(10) !== \"R$10.00\") throw new Error(\"padrão deveria ser BRL\");",
                  "}",
                  "",
                  "function testFormatCurrencySupportsUSD() {",
                  "  if (formatCurrency(10, \"USD\") !== \"$10.00\") throw new Error(\"deveria suportar USD\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Esses dois testes justificam o parâmetro currency e o suporte a BRL/USD. Mas o parâmetro locale " +
                "nunca é lido dentro da função — nenhum teste o exercitaria, porque é código especulativo que " +
                "TDD, seguido à risca, nunca teria produzido.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Red-Green-Refactor",
          isNew: true,
          requires: ["Test-Driven Development"],
          note:
            "o loop concreto: teste mínimo que falha → código mínimo que passa → melhorar com a barra verde. " +
            "Passo \"Refactor\": aprofundamento posterior em Epic 03 / Software Craft / Refactoring — pointer, não Requires.",
          summary:
            "O loop concreto de três passos que dá vida ao TDD: escrever um teste mínimo que falha (Red), " +
            "escrever o código mínimo que o faz passar (Green), melhorar o código com a segurança da barra " +
            "verde (Refactor) — e repetir.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Red-Green-Refactor é o ciclo operacional concreto por trás do TDD: Red — escrever um teste " +
                "para um comportamento que ainda não existe, e vê-lo falhar (a \"barra vermelha\"); Green — " +
                "escrever o código mais simples possível que faz esse teste passar (a \"barra verde\"), mesmo " +
                "que a implementação não seja elegante; Refactor — com o teste passando como rede de segurança, " +
                "melhorar a estrutura do código sem mudar seu comportamento externo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Red-Green-Refactor é o motor operacional do TDD: falhar de propósito, passar com o mínimo, " +
                "depois melhorar em segurança — um passo de cada vez, nunca os três ao mesmo tempo.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "TDD como filosofia diz \"escreva o teste primeiro\", mas não diz, por si só, o que fazer minuto " +
                "a minuto. Red-Green-Refactor é a receita prática: um ciclo curto e repetível que qualquer " +
                "pessoa consegue seguir, com um critério objetivo de \"o que fazer agora\" em cada passo — nunca " +
                "mais de uma coisa por vez (só fazer passar, ou só melhorar, nunca os dois ao mesmo tempo).",
            },
            {
              type: "paragraph",
              text:
                "O passo Refactor é o que garante que TDD não vira só \"escrever testes antes\" sem cuidar da " +
                "qualidade do código — a barra verde dá a confiança de que refatorar não vai quebrar nada " +
                "silenciosamente. Sem esse passo, código escrito só para \"passar no teste mais rápido " +
                "possível\" tende a acumular dívida técnica.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "os três passos do ciclo, em sequência, sobre a mesma função:" },
            {
              type: "code",
              language: "javascript",
              filename: "double.test.js",
              code: [
                "// RED — teste escrito primeiro, falha (double não existe ainda)",
                "function testDouble() {",
                "  if (double(5) !== 10) throw new Error(\"esperava 10\");",
                "}",
                "",
                "// GREEN — implementação mais simples possível, só para passar",
                "function double(n) {",
                "  return 10; // \"hardcoded\" — só precisa passar neste único teste",
                "}",
                "",
                "// Um segundo teste força a generalização",
                "function testDoubleOfThree() {",
                "  if (double(3) !== 6) throw new Error(\"esperava 6\");",
                "}",
                "",
                "// GREEN de novo — agora precisa de uma implementação real",
                "function double(n) {",
                "  return n * 2;",
                "}",
                "",
                "// REFACTOR — código já correto, sem mudança de comportamento a fazer aqui",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O primeiro Green (return 10) parece estranho, mas é o passo mínimo válido para o primeiro " +
                "teste sozinho — é assim mesmo que o ciclo funciona em passos pequenos. Só quando um segundo " +
                "teste (testDoubleOfThree) exige mais é que a implementação precisa generalizar. O Refactor, " +
                "nesse exemplo simples, não teve o que melhorar; em exemplos maiores, é aqui que nomes, " +
                "duplicação e estrutura são revisados com a segurança da barra verde.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Em cada ciclo curto de TDD, um comportamento de cada vez.",
                "Para refatorar com segurança: a barra verde garante que o comportamento se manteve.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Não pule o Red: um teste que nunca falhou não prova que verifica algo.",
                "No Green, escreva o mínimo que passa; o Refactor melhora o código sem alterar o comportamento nem " +
                "acrescentar testes novos.",
              ],
            },
          ],
          examples: [
            {
              title: "Red — um teste que intencionalmente ainda falha",
              context: "O primeiro passo do ciclo é sempre ver o teste falhar por um motivo esperado (função inexistente), não por um erro de digitação.",
              code: {
                language: "javascript",
                filename: "palindrome.test.js",
                code: ["function testIsPalindrome() {", "  if (!isPalindrome(\"arara\")) throw new Error(\"arara deveria ser palíndromo\");", "}", "// Rodar agora: falha com \"isPalindrome is not defined\" — Red esperado"].join("\n"),
              },
              explanation:
                "Ver a falha correta (função não existe) antes de implementar confirma que o teste de fato " +
                "exercita algo que ainda não está pronto — evita o erro de escrever um teste que passaria mesmo " +
                "sem implementação nenhuma.",
            },
            {
              title: "Green — a implementação mais simples possível, não a mais elegante",
              context: "O objetivo do passo Green não é código bonito, é a barra verde no menor caminho possível.",
              code: {
                language: "javascript",
                filename: "palindrome.js",
                code: ["function isPalindrome(text) {", "  return text === text.split(\"\").reverse().join(\"\");", "}"].join("\n"),
              },
              explanation:
                "Essa implementação não lida com maiúsculas, acentos ou espaços — mas é suficiente para o único " +
                "teste existente. Refinamentos vêm de novos testes (Red) seguidos de novo Green, não de antecipação.",
            },
            {
              title: "Refactor — melhorando sem quebrar o teste",
              context: "Refactor só é seguro porque o teste (verde) continua rodando durante e depois da mudança.",
              code: {
                language: "javascript",
                filename: "palindrome.js",
                code: [
                  "function isPalindrome(text) {",
                  "  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, \"\");",
                  "  return normalized === normalized.split(\"\").reverse().join(\"\");",
                  "}",
                  "// testIsPalindrome ainda passa — comportamento externo preservado",
                ].join("\n"),
              },
              explanation:
                "A implementação mudou (agora normaliza antes de comparar), mas o teste original continua " +
                "passando sem alteração — prova de que o Refactor não alterou o comportamento observável, só a " +
                "estrutura interna.",
            },
          ],
          exercise: {
            problem:
              "O código abaixo foi escrito misturando Green e Refactor no mesmo passo: a pessoa tentou fazer o " +
              "teste passar e deixar o código \"genérico\" ao mesmo tempo, e acabou com um bug na tentativa de " +
              "generalização precoce.",
            problemCode: {
              language: "javascript",
              filename: "sum.test.js",
              code: [
                "function testSumTwoNumbers() {",
                "  if (sum(2, 3) !== 5) throw new Error(\"esperava 5\");",
                "}",
                "",
                "function sum(...numbers) {",
                "  return numbers.reduce((acc, n) => acc * n, 0); // bug: deveria somar, não multiplicar",
                "}",
              ].join("\n"),
            },
            task:
              "Separe em dois passos corretos: primeiro um Green mínimo que só faz sum(2, 3) passar sem tentar " +
              "generalizar para N argumentos; depois, mostre como um novo teste evoluiria a implementação.",
            hint: "Green mínimo para este único teste não precisa de rest parameters nem de reduce — só precisa somar dois números.",
            solution: {
              code: {
                language: "javascript",
                filename: "sum.js",
                code: [
                  "// GREEN mínimo — só o necessário para este teste",
                  "function sum(a, b) {",
                  "  return a + b;",
                  "}",
                  "",
                  "// Se um novo teste pedir suporte a N números, aí sim generaliza:",
                  "// function testSumThreeNumbers() { if (sum(1, 2, 3) !== 6) throw new Error(...); }",
                  "function sum(...numbers) {",
                  "  return numbers.reduce((acc, n) => acc + n, 0);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O primeiro Green resolve só o teste que existe, sem generalização prematura. A generalização " +
                "para N argumentos só aconteceria depois, guiada por um novo teste (Red) — é assim que " +
                "Red-Green-Refactor evita bugs como o do reduce com operador errado: cada passo é pequeno o bastante para não errar.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "testing-strategy",
      order: 40,
      title: "Testing Strategy",
      requires: ["Testing Fundamentals", "Test Doubles"],
      summary:
        "Enquadramento (pyramid) → métrica (coverage) → o que torna testável (testability) → isolar → flaky → " +
        "regressão → property-based → contratos entre serviços. Só Flaky Tests ← Test Isolation entre elas.",
      suggestions: [
        "Testing Trophy (contraponto à Pyramid)",
        "Test Smells",
        "Mutation Testing",
        "Test Data Builders",
        "CI Test Gates (ponte para Platform / CI-CD)",
        "Non-Functional Testing (já é SUGESTÃO de Story na Fase 1)",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Test Pyramid",
          requires: ["Testing Fundamentals / Integration Testing", "Testing Fundamentals / E2E Testing"],
          note: "como distribuir tipos de teste (unit ≫ integration ≫ e2e) — as camadas são esses tipos",
          summary:
            "Um modelo que orienta a proporção entre os tipos de teste de um sistema: muitos unit tests rápidos " +
            "e baratos na base, menos integration tests no meio, e poucos E2E tests caros no topo.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Test Pyramid é um modelo visual — proposto por Mike Cohn — que representa como distribuir o " +
                "esforço de teste entre as diferentes camadas: uma base larga de unit tests (muitos, rápidos, " +
                "baratos), uma camada intermediária de integration tests (menos numerosos, mais lentos), e um " +
                "topo estreito de E2E tests (poucos, os mais lentos e caros de todos). A forma de pirâmide " +
                "comunica a proporção esperada, não um número exato.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "O Test Pyramid orienta a proporção entre tipos de teste — muitos unit tests na base, menos " +
                "integration no meio, poucos E2E no topo — porque cada camada abaixo é mais rápida, mais barata " +
                "e mais precisa que a de cima.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem uma diretriz, times tendem a inverter a pirâmide sem perceber: confiar demais em E2E tests " +
                "porque \"parecem mais realistas\", e de menos em unit tests. O resultado é uma suíte lenta " +
                "(minutos ou horas para rodar), frágil (qualquer mudança de UI quebra dezenas de testes) e " +
                "difícil de depurar quando falha. A pirâmide existe para lembrar que a maior parte da confiança " +
                "deveria vir da camada mais barata e mais precisa: o unit test.",
            },
            {
              type: "paragraph",
              text:
                "Cada camada tem um papel diferente, não redundante: unit tests provam que as peças funcionam " +
                "isoladamente; integration tests provam que elas se encaixam; E2E tests provam que a jornada " +
                "completa do usuário funciona. A pirâmide não diz \"não faça E2E\" — diz \"faça pouco E2E, o " +
                "suficiente para os fluxos mais críticos\".",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma suíte de testes representada como contagem por camada, ilustrando a proporção esperada:" },
            {
              type: "code",
              language: "javascript",
              filename: "test-suite-shape.js",
              code: [
                "const testSuite = {",
                "  unit: 240,       // rápidos, isolados — a base larga",
                "  integration: 30, // componentes reais combinados",
                "  e2e: 5,          // fluxos críticos completos, pela UI",
                "};",
                "",
                "function testSuiteFollowsPyramidShape(suite) {",
                "  return suite.unit > suite.integration && suite.integration > suite.e2e;",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "testSuiteFollowsPyramidShape não verifica números exatos — verifica a forma relativa: unit " +
                "tests são a maioria, integration tests vêm em seguida, E2E tests são os mais raros. Uma suíte " +
                "com 5 unit tests e 50 E2E tests teria a pirâmide invertida, mesmo tendo o mesmo total de 55 testes.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "A pirâmide invertida, com muitos E2E e poucos testes de unidade, dá uma suíte lenta, frágil e cara de manter.",
                "É um modelo de proporção, não uma regra exata: o formato ideal depende do sistema.",
                "Testar a mesma regra de negócio em várias camadas gera duplicação; escolha a camada mais barata que a verifica.",
              ],
            },
          ],
          examples: [
            {
              title: "Uma suíte com a pirâmide invertida (anti-padrão)",
              context: "É comum, especialmente em times que começam testando pela UI, acabar com o formato invertido — um \"cone de sorvete\".",
              code: {
                language: "javascript",
                filename: "ice-cream-cone.js",
                code: ["const iceCreamCone = {", "  unit: 10,", "  integration: 15,", "  e2e: 80,", "};"].join("\n"),
              },
              explanation:
                "Com 80 E2E tests contra apenas 10 unit tests, essa suíte provavelmente demora dezenas de " +
                "minutos para rodar e é frágil a qualquer mudança de interface — o formato oposto do que a " +
                "pirâmide recomenda.",
            },
            {
              title: "Escolhendo em que camada testar um caso específico",
              context: "A pirâmide também orienta a decisão de onde testar um comportamento novo.",
              code: {
                language: "javascript",
                filename: "test-placement.js",
                code: ["function shouldTestAsUnit(scenario) {", "  return !scenario.involvesRealDatabase && !scenario.involvesRealUI;", "}"].join("\n"),
              },
              explanation:
                "Antes de escrever um novo teste, perguntar se ele realmente precisa de integração ou de um " +
                "navegador ajuda a manter a suíte na base da pirâmide — testar como unit sempre que o " +
                "comportamento permitir.",
            },
            {
              title: "Cobertura da mesma regra de negócio em duas camadas diferentes",
              context: "A mesma regra pode (e deve) ser verificada tanto em unit quanto, uma única vez, em E2E.",
              code: {
                language: "javascript",
                filename: "discount-layers.test.js",
                code: [
                  "// Camada unit — várias variações da regra, rápido",
                  "function testDiscountAppliesAbove100() {",
                  "  if (calculateDiscount(150) !== 15) throw new Error(\"desconto incorreto\");",
                  "}",
                  "",
                  "// Camada E2E — só o caminho feliz, uma vez, pela UI real",
                  "async function testCheckoutShowsDiscountedTotal(page) {",
                  "  await page.goto(\"/cart\");",
                  "  const total = await page.textContent(\"#total\");",
                  "  if (!total.includes(\"R$135\")) throw new Error(\"desconto não refletido na tela\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "As variações da regra de desconto (limites, casos extremos) ficam nos unit tests, rápidos de " +
                "rodar em quantidade; o E2E confirma só que a regra chega até a tela, sem repetir todas as " +
                "variações ali.",
            },
          ],
          exercise: {
            problem:
              "O time decidiu testar toda regra de negócio via E2E, \"porque é mais parecido com o que o " +
              "usuário vê\". A suíte atual tem 3 unit tests e 60 E2E tests, e leva 40 minutos para rodar no CI.",
            task:
              "Proponha, em código, o critério que decidiria quais E2E tests virar unit tests, sem escrever os " +
              "60 testes.",
            hint: "Pergunte, para cada E2E test: ele está verificando uma regra de negócio isolada (candidata a unit) ou uma jornada completa que depende de várias camadas reais (deveria continuar E2E)?",
            solution: {
              code: {
                language: "javascript",
                filename: "reclassify-tests.js",
                code: [
                  "function shouldRemainE2E(testCase) {",
                  "  return testCase.isCriticalUserJourney && testCase.spansMultipleSystems;",
                  "}",
                  "// Aplicar esse critério aos 60 E2E tests: os que testam uma única",
                  "// regra de cálculo/validação viram unit tests; só os que de fato",
                  "// exercitam uma jornada completa continuam E2E.",
                ].join("\n"),
              },
              explanation:
                "A maioria das 60 regras testadas por E2E provavelmente são cálculos ou validações isoladas que " +
                "não precisam de navegador nem backend real — reescritas como unit tests, rodam em milissegundos " +
                "em vez de segundos, e só um punhado de jornadas críticas de fato precisa continuar em E2E.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Code Coverage",
          isNew: true,
          requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
          note: "% de código exercitado pelos testes. Cuidado com \"coverage as a target\" (Goodhart)",
          subtopics: ["line", "statement", "branch", "path coverage"],
          revisit: ["CI/CD Pipeline", "Software Craft / Code Review"],
          summary:
            "A porcentagem do código-fonte que é de fato executada quando a suíte de testes roda — uma métrica " +
            "útil para achar código não testado, perigosa quando vira meta em si mesma.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Code Coverage mede que fração do código-fonte é executada durante a suíte de testes, " +
                "geralmente expressa em porcentagem. Existem variações do que exatamente é medido: line coverage " +
                "(linhas executadas), statement coverage (instruções executadas), branch coverage (cada ramo de " +
                "um if/else exercitado) e path coverage (cada caminho possível através do código) — cada uma " +
                "mais rigorosa que a anterior.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Code Coverage mede que fração do código roda durante os testes — útil para achar pontos cegos, " +
                "mas mede execução, não correção; perseguir um número alto sem cuidar da qualidade das " +
                "assertions é otimizar a métrica errada.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Coverage responde a uma pergunta objetiva e fácil de automatizar: \"que parte do código nunca " +
                "roda durante os testes?\". Isso ajuda a encontrar pontos cegos — uma função inteira, ou um " +
                "ramo de erro, que nenhum teste toca. Ferramentas de coverage instrumentam o código e produzem " +
                "um relatório visual (linhas verdes/vermelhas) sem esforço manual.",
            },
            {
              type: "paragraph",
              text:
                "O perigo é a Lei de Goodhart: quando uma métrica vira meta, ela deixa de medir bem o que " +
                "queria medir. \"100% de coverage\" não significa \"sem bugs\" — código pode ser executado por " +
                "um teste sem que nenhuma assertion relevante verifique o resultado. Coverage mede execução, " +
                "não verificação; um número alto pode esconder testes fracos, não ausentes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma função com um ramo não coberto, e o que o relatório de coverage revelaria:" },
            {
              type: "code",
              language: "javascript",
              filename: "classify-age.test.js",
              code: [
                "function classifyAge(age) {",
                "  if (age < 0) {",
                "    throw new Error(\"idade inválida\");",
                "  }",
                "  if (age < 18) {",
                "    return \"menor\";",
                "  }",
                "  return \"adulto\";",
                "}",
                "",
                "function testClassifyAgeAdult() {",
                "  if (classifyAge(30) !== \"adulto\") throw new Error(\"esperava adulto\");",
                "}",
                "// Só este teste existe: o ramo \"menor\" e o ramo de erro nunca rodam",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Com só testClassifyAgeAdult, um relatório de branch coverage mostraria dois ramos de " +
                "classifyAge nunca exercitados: o if (age < 0) e o if (age < 18). O código funciona; a suíte, " +
                "não — coverage é exatamente o tipo de sinal que aponta esse ponto cego, sem alguém precisar " +
                "revisar o código linha por linha.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Coverage mede execução, não correção: uma linha executada sem assertion conta como coberta.",
                "Virar meta obrigatória, como num PR, leva a testes escritos só para subir o número; quando uma medida vira " +
                "meta, deixa de ser boa medida.",
                "Use coverage para achar pontos cegos, como um caminho de erro nunca exercitado, e não para provar qualidade.",
              ],
            },
          ],
          examples: [
            {
              title: "Coverage alto, verificação fraca (o alerta de Goodhart)",
              context: "É possível ter 100% de coverage numa função e ainda assim não testar nada de útil.",
              code: {
                language: "javascript",
                filename: "weak-coverage.test.js",
                code: ["function calculateTotal(items) {", "  return items.reduce((sum, item) => sum + item.price, 0);", "}", "", "function testCalculateTotal() {", "  calculateTotal([{ price: 10 }]); // executa a função, mas não verifica nada", "}"].join("\n"),
              },
              explanation:
                "Esse teste dá 100% de coverage em calculateTotal — a linha roda — mas não tem nenhuma " +
                "assertion. Se a função tivesse um bug e devolvesse o valor errado, esse teste passaria do mesmo jeito.",
            },
            {
              title: "Branch coverage revelando um caso de erro esquecido",
              context: "Branch coverage é mais rigoroso que line coverage porque cobra cada ramo de decisão, não só cada linha.",
              code: {
                language: "javascript",
                filename: "divide.test.js",
                code: ["function divide(a, b) {", "  if (b === 0) throw new Error(\"divisão por zero\");", "  return a / b;", "}", "", "function testDivide() {", "  if (divide(10, 2) !== 5) throw new Error(\"esperava 5\");", "}"].join("\n"),
              },
              explanation:
                "Line coverage marcaria as três linhas como \"cobertas\" (a função inteira roda), mas branch " +
                "coverage revelaria que o ramo if (b === 0) nunca foi exercitado — falta um teste para o caso de " +
                "divisão por zero.",
            },
            {
              title: "Usando coverage para achar um ponto cego, não como meta de PR",
              context: "O uso saudável de coverage é diagnóstico, não um portão obrigatório de \"todo PR precisa manter 100%\".",
              code: {
                language: "javascript",
                filename: "find-gaps.js",
                code: ["function findUncoveredBranches(coverageReport) {", "  return coverageReport.branches.filter((branch) => branch.hits === 0);", "}"].join("\n"),
              },
              explanation:
                "Consultar o relatório para achar ramos com zero execuções e decidir, caso a caso, se merecem " +
                "um teste é um uso melhor de coverage do que travar o merge em um número fixo — um branch de " +
                "log de debug pode legitimamente não precisar de teste.",
            },
          ],
          exercise: {
            problem:
              "O time definiu uma regra de \"coverage mínimo de 90% por PR\", e para bater a meta alguém " +
              "escreveu o teste abaixo, que passa e aumenta o número, mas não verifica nada de útil.",
            problemCode: {
              language: "javascript",
              filename: "apply-discount.test.js",
              code: [
                "function applyDiscount(price, percent) {",
                "  if (percent < 0 || percent > 100) throw new Error(\"percentual inválido\");",
                "  return price - price * (percent / 100);",
                "}",
                "",
                "function testApplyDiscount() {",
                "  applyDiscount(100, 20);",
                "  applyDiscount(100, -5);",
                "}",
              ].join("\n"),
            },
            task:
              "Reescreva o teste para de fato verificar o comportamento de applyDiscount (incluindo o caso de " +
              "erro), em vez de só executar as linhas para inflar o coverage.",
            hint: "Cada chamada precisa de uma assertion que verifique o resultado esperado — inclusive o caso que deveria lançar erro.",
            solution: {
              code: {
                language: "javascript",
                filename: "apply-discount.test.js",
                code: [
                  "function testApplyDiscountCalculatesCorrectly() {",
                  "  const result = applyDiscount(100, 20);",
                  "  if (result !== 80) throw new Error(`esperava 80, recebeu ${result}`);",
                  "}",
                  "",
                  "function testApplyDiscountRejectsInvalidPercent() {",
                  "  try {",
                  "    applyDiscount(100, -5);",
                  "    throw new Error(\"deveria ter lançado erro para percentual inválido\");",
                  "  } catch (error) {",
                  "    if (error.message !== \"percentual inválido\") throw error;",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Agora cada chamada tem uma assertion que verifica o resultado — inclusive o caso de erro, que " +
                "antes só era executado sem checar se o erro certo foi lançado. O coverage numérico pode até ser " +
                "o mesmo, mas a suíte de fato verifica o comportamento, não só o executa.",
            },
          },
        }),
        concept({
          order: 30,
          title: "Testability",
          requires: ["Test Doubles", "Programming Foundations / Programming Fundamentals / Coupling"],
          note: "propriedades do código que permitem testá-lo (seams, injeção de dependência, poucos colaboradores)",
          revisit: ["Functional Programming / Pure Functions (o caso ideal)", "Software Design / Dependency Injection & IoC (DI é aplicação da testabilidade)"],
          summary:
            "As propriedades de um código que determinam quão fácil (ou difícil) é escrever testes para ele — " +
            "poucos colaboradores, dependências injetáveis, pontos de costura onde um dublê pode entrar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Testability é a qualidade de um código ser fácil de testar: poucas dependências acopladas " +
                "internamente, pontos onde uma dependência pode ser trocada por um dublê (\"seams\", costuras), " +
                "funções que recebem o que precisam como parâmetro em vez de buscar de variáveis globais ou " +
                "instanciar colaboradores internamente. Código testável permite escrever um teste de unidade " +
                "rápido; código não testável exige contorcer o teste (ou desistir de testar aquele trecho).",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Testability é a propriedade de um código permitir a entrada de dublês e o controle de suas " +
                "dependências — resultado de decisões de design (seams, injeção de dependência, poucos " +
                "colaboradores), não uma característica dos testes em si.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Testability não é uma propriedade acidental — é resultado de decisões de design tomadas antes " +
                "de qualquer teste ser escrito. Um código que cria sua própria conexão de banco dentro do " +
                "construtor, ou que lê uma variável global, é difícil de testar não porque \"os testes são " +
                "ruins\", mas porque o próprio design não deixou nenhum ponto de entrada para um dublê. Entender " +
                "testability como propriedade do design, não do teste, é o que permite melhorá-la de propósito.",
            },
            {
              type: "paragraph",
              text:
                "Testability se conecta diretamente com princípios de design já conhecidos: baixo Coupling " +
                "facilita testar uma peça isoladamente; funções puras (sem efeito colateral) são as mais fáceis " +
                "de testar de todas, porque não precisam de nenhum dublê. Melhorar a testabilidade de um " +
                "código, portanto, costuma melhorar seu design de forma mais geral, não só a experiência de " +
                "escrever testes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "a mesma responsabilidade, antes e depois de ganhar um seam para injeção de dependência:" },
            {
              type: "code",
              language: "javascript",
              filename: "report-service.js",
              code: [
                "// Difícil de testar: cria sua própria dependência internamente",
                "class ReportService {",
                "  generate() {",
                "    const db = new PostgresConnection(PROD_DATABASE_URL);",
                "    return db.query(\"SELECT * FROM sales\");",
                "  }",
                "}",
                "",
                "// Testável: a dependência entra de fora (o \"seam\")",
                "class ReportService {",
                "  constructor(database) {",
                "    this.database = database;",
                "  }",
                "  generate() {",
                "    return this.database.query(\"SELECT * FROM sales\");",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na primeira versão, não existe nenhum ponto onde um teste possa entrar com um dublê — " +
                "PostgresConnection é criado dentro do método, inacessível de fora. Na segunda versão, o " +
                "construtor é o seam: um teste passa um fakeDatabase no lugar da conexão real, sem precisar de " +
                "um banco de verdade rodando.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Código difícil de testar costuma ser sinal de design: muitos colaboradores e dependências criadas por dentro.",
                "Não distorça o código de produção só para testá-lo, como expor internos; melhore o design em vez disso.",
                "Funções puras são o caso ideal: entram valores, saem valores, sem dublês.",
              ],
            },
          ],
          examples: [
            {
              title: "Um seam criado por injeção de dependência",
              context: "O caso mais comum: receber a dependência de fora em vez de criá-la internamente.",
              code: {
                language: "javascript",
                filename: "notification-service.js",
                code: ["class NotificationService {", "  constructor(emailClient) {", "    this.emailClient = emailClient;", "  }", "  notify(user, message) {", "    this.emailClient.send(user.email, message);", "  }", "}"].join("\n"),
              },
              explanation:
                "emailClient é o seam — um teste substitui por um dublê; código de produção passa o client " +
                "real. A classe não sabe (nem precisa saber) a diferença.",
            },
            {
              title: "Funções puras: o caso ideal de testabilidade",
              context: "Uma função pura não precisa de nenhum dublê — ela já não tem dependências para substituir.",
              code: {
                language: "javascript",
                filename: "shipping.js",
                code: ["function calculateShippingCost(weightKg, distanceKm) {", "  return weightKg * 0.5 + distanceKm * 0.1;", "}"].join("\n"),
              },
              explanation:
                "calculateShippingCost não lê banco, não chama rede, não depende de tempo — um teste chama a " +
                "função com valores conhecidos e compara o resultado, sem preparar dublê nenhum.",
            },
            {
              title: "Testabilidade prejudicada por muitos colaboradores",
              context: "Quanto mais dependências uma classe recebe, mais dublês um teste precisa montar antes de sequer chegar ao comportamento que quer verificar.",
              code: {
                language: "javascript",
                filename: "checkout-service.js",
                code: ["class CheckoutService {", "  constructor(cart, payment, inventory, shipping, notification, analytics, audit) {", "    // sete colaboradores — cada teste precisa montar sete dublês", "  }", "}"].join("\n"),
              },
              explanation:
                "Um construtor com sete dependências torna qualquer teste de CheckoutService caro de montar, " +
                "mesmo que o comportamento testado use só duas delas — sinal de que a classe provavelmente tem " +
                "responsabilidade demais (ver Cohesion, na Área 1).",
            },
          ],
          exercise: {
            problem:
              "A função abaixo lê a taxa de câmbio de uma variável global, o que a torna impossível de testar " +
              "de forma determinística sem manipular estado global antes e depois de cada teste.",
            problemCode: {
              language: "javascript",
              filename: "currency.js",
              code: ["let currentExchangeRate = 5.0;", "", "function convertToUSD(amountInBRL) {", "  return amountInBRL / currentExchangeRate;", "}"].join("\n"),
            },
            task: "Melhore a testabilidade de convertToUSD tornando a taxa de câmbio um parâmetro em vez de uma variável global.",
            hint: "Um seam para essa dependência é simplesmente recebê-la como argumento da função.",
            solution: {
              code: {
                language: "javascript",
                filename: "currency.js",
                code: ["function convertToUSD(amountInBRL, exchangeRate) {", "  return amountInBRL / exchangeRate;", "}", "", "function testConvertToUSD() {", "  const result = convertToUSD(100, 5.0);", "  if (result !== 20) throw new Error(`esperava 20, recebeu ${result}`);", "}"].join("\n"),
              },
              explanation:
                "Com exchangeRate como parâmetro, cada teste passa a taxa que quiser, sem tocar em estado global " +
                "— a função se torna tão testável quanto uma função pura, porque, de fato, agora é uma.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Test Isolation",
          requires: ["Testing Fundamentals / Test Fixture", "Programming Foundations / Concurrency / Shared State"],
          note: "testes não dependem uns dos outros nem de estado compartilhado; ordem-agnósticos",
          summary:
            "A propriedade de um teste não depender de nenhum outro teste, nem de estado deixado para trás — " +
            "cada teste passa (ou falha) da mesma forma, não importa em que ordem a suíte roda.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Test Isolation é a garantia de que um teste não depende do resultado, da ordem de execução ou " +
                "do estado deixado por outro teste. Um teste isolado pode rodar sozinho, em qualquer posição da " +
                "suíte, em paralelo com outros, e ainda assim produzir o mesmo resultado. A falta de isolamento " +
                "aparece quando um teste só passa se rodar depois de outro específico, ou quando rodar a suíte " +
                "inteira duas vezes seguidas dá resultados diferentes.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Test Isolation garante que um teste não depende de nenhum outro nem de estado deixado para " +
                "trás — o mesmo resultado, em qualquer ordem, sozinho ou junto de toda a suíte, o que também é " +
                "o que torna a paralelização segura.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Testes existem para dar confiança rápida e confiável. Se o resultado de um teste depende da " +
                "ordem em que a suíte roda, essa confiança desaparece: um teste que passava sozinho pode falhar " +
                "quando outro roda antes dele (porque deixou o banco, um arquivo ou uma variável global em um " +
                "estado inesperado). Isolamento também é o que permite rodar testes em paralelo para acelerar o " +
                "CI — testes que compartilham estado não podem ser paralelizados com segurança.",
            },
            {
              type: "paragraph",
              text:
                "Isolamento se conecta diretamente com Test Fixture: cada teste deve receber uma fixture " +
                "fresca, não reaproveitar uma instância compartilhada entre testes. Também se conecta com " +
                "Shared State (Área 1, Concurrency) — a mesma classe de problema que causa race conditions em " +
                "produção (múltiplas partes mexendo no mesmo estado) causa testes não isolados quando esse " +
                "estado é global aos testes.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um par de testes que quebra sem isolamento, e a correção com fixture nova por teste:" },
            {
              type: "code",
              language: "javascript",
              filename: "cart.test.js",
              code: [
                "// SEM isolamento — os dois testes compartilham a mesma lista",
                "const sharedCart = [];",
                "",
                "function testAddItem() {",
                "  sharedCart.push({ id: 1 });",
                "  if (sharedCart.length !== 1) throw new Error(\"esperava 1 item\");",
                "}",
                "",
                "function testCartStartsEmpty() {",
                "  if (sharedCart.length !== 0) throw new Error(\"carrinho deveria começar vazio\");",
                "  // falha se testAddItem rodar antes deste teste",
                "}",
                "",
                "// COM isolamento — cada teste cria seu próprio cart",
                "function testCartStartsEmptyIsolated() {",
                "  const cart = [];",
                "  if (cart.length !== 0) throw new Error(\"carrinho deveria começar vazio\");",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "testCartStartsEmpty só passa se rodar antes de testAddItem — uma dependência de ordem " +
                "escondida. testCartStartsEmptyIsolated cria seu próprio array a cada execução, então o " +
                "resultado é sempre o mesmo, não importa quando (ou se) outros testes rodaram antes.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Estado compartilhado, como variável de módulo mutável ou registros no banco, faz um teste afetar o seguinte.",
                "Testes que só passam em uma certa ordem quebram ao serem paralelizados ou rodados sozinhos.",
                "Limpar o estado depois de cada teste não basta se um teste que falha pula a limpeza; prefira criar o estado " +
                "a cada teste.",
              ],
            },
          ],
          examples: [
            {
              title: "Isolamento em testes que usam banco de dados",
              context: "Testes de integração precisam de uma estratégia explícita para não vazar estado entre execuções.",
              code: {
                language: "javascript",
                filename: "user-repository.integration.test.js",
                code: [
                  "async function setup() {",
                  "  await testDatabase.clear();",
                  "}",
                  "",
                  "async function testSaveUser() {",
                  "  await setup();",
                  "  await repository.save({ name: \"Ana\" });",
                  "  const users = await repository.findAll();",
                  "  if (users.length !== 1) throw new Error(\"esperava 1 usuário\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "setup() limpa o banco de teste antes de cada execução — sem isso, rodar testSaveUser duas " +
                "vezes (ou depois de outro teste que também salva usuários) acumularia registros e quebraria a " +
                "asserção de \"1 usuário\".",
            },
            {
              title: "Isolamento quebrado por uma variável de módulo mutável",
              context: "Estado compartilhado nem sempre é óbvio — pode estar escondido no escopo do módulo.",
              code: {
                language: "javascript",
                filename: "request-tracker.js",
                code: ["let requestCount = 0;", "", "function trackRequest() {", "  requestCount++;", "  return requestCount;", "}"].join("\n"),
              },
              explanation:
                "Qualquer teste que chame trackRequest afeta o resultado de todos os testes seguintes que " +
                "também a chamem, porque requestCount nunca é resetado entre execuções — um exemplo de estado " +
                "compartilhado silencioso.",
            },
            {
              title: "Paralelização segura graças ao isolamento",
              context: "Um test runner só pode rodar testes em paralelo com segurança se eles forem isolados entre si.",
              code: {
                language: "javascript",
                filename: "runner-config.js",
                code: ["const config = { workers: 4, testIsolation: \"process-per-file\" };"].join("\n"),
              },
              explanation:
                "Rodar cada arquivo de teste em um processo separado é uma forma de garantir isolamento mesmo " +
                "quando o código sob teste usa alguma forma de estado global — cada processo tem sua própria " +
                "cópia, evitando interferência entre execuções paralelas.",
            },
          ],
          exercise: {
            problem:
              "Os dois testes abaixo passam quando rodados na ordem em que aparecem, mas falham se a suíte " +
              "rodar testUserCountAfterDeletion antes de testUserCountAfterCreation.",
            problemCode: {
              language: "javascript",
              filename: "user-count.test.js",
              code: [
                "const users = [];",
                "",
                "function testUserCountAfterCreation() {",
                "  users.push({ id: 1 });",
                "  if (users.length !== 1) throw new Error(\"esperava 1 usuário\");",
                "}",
                "",
                "function testUserCountAfterDeletion() {",
                "  users.pop();",
                "  if (users.length !== 0) throw new Error(\"esperava 0 usuários\");",
                "}",
              ].join("\n"),
            },
            task: "Reescreva os dois testes para que cada um monte seu próprio estado inicial, eliminando a dependência de ordem entre eles.",
            hint: "Cada teste precisa criar (ou receber via fixture) sua própria lista de usuários, em vez de compartilhar o array users do módulo.",
            solution: {
              code: {
                language: "javascript",
                filename: "user-count.test.js",
                code: [
                  "function testUserCountAfterCreation() {",
                  "  const users = [];",
                  "  users.push({ id: 1 });",
                  "  if (users.length !== 1) throw new Error(\"esperava 1 usuário\");",
                  "}",
                  "",
                  "function testUserCountAfterDeletion() {",
                  "  const users = [{ id: 1 }];",
                  "  users.pop();",
                  "  if (users.length !== 0) throw new Error(\"esperava 0 usuários\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Cada teste agora começa com seu próprio array users, criado dentro da função — não importa " +
                "mais em que ordem rodam, nem se rodam sozinhos ou junto de toda a suíte, o resultado é sempre o mesmo.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Flaky Tests",
          requires: ["Test Isolation", "Programming Foundations / Concurrency / Race Condition"],
          note: "testes não determinísticos: corrida, tempo, ordem, rede",
          summary:
            "Um teste que às vezes passa e às vezes falha, sem que o código sob teste tenha mudado — um " +
            "sintoma de não determinismo escondido em corrida, tempo, ordem ou rede.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um teste flaky é aquele cujo resultado varia entre execuções do mesmo código, sem que nada " +
                "relevante tenha mudado: às vezes passa, às vezes falha, de forma aparentemente aleatória. " +
                "Diferente de um teste que falha consistentemente (sinal de um bug real), um flaky test mina a " +
                "confiança na suíte inteira — ninguém sabe se uma falha é um bug de verdade ou \"só aquele " +
                "teste de novo\".",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um flaky test passa ou falha de forma inconsistente porque depende de algo não controlado — " +
                "corrida assíncrona, tempo, ordem ou rede — e corrigi-lo significa eliminar essa fonte de não " +
                "determinismo, não só re-rodar até passar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Flakiness quase sempre vem de alguma fonte de não determinismo que o teste não controla: uma " +
                "race condition entre operações assíncronas, um timeout apertado demais para uma máquina " +
                "ocasionalmente mais lenta, uma dependência de ordem de execução (falta de Test Isolation), ou " +
                "uma chamada de rede real sujeita a latência variável. O teste em si está correto sobre o " +
                "comportamento esperado — o problema é que algo fora do seu controle às vezes interfere.",
            },
            {
              type: "paragraph",
              text:
                "O custo de ignorar flaky tests é alto: times acabam re-rodando a suíte \"até passar\", ou " +
                "pior, ignorando falhas reais achando que \"é só flakiness\". Identificar e corrigir (ou " +
                "isolar) testes flaky é necessário para que uma falha vermelha continue significando \"algo " +
                "quebrou\", não \"tente de novo\".",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um teste flaky causado por uma corrida entre duas operações assíncronas, e a correção esperando o resultado certo:" },
            {
              type: "code",
              language: "javascript",
              filename: "user-save.test.js",
              code: [
                "// FLAKY — não espera a operação assíncrona terminar",
                "function testUserIsSaved() {",
                "  saveUserAsync({ name: \"Ana\" }); // não aguardado",
                "  const user = repository.findByName(\"Ana\"); // pode rodar antes de salvar",
                "  if (!user) throw new Error(\"usuário deveria existir\");",
                "}",
                "",
                "// CORRIGIDO — aguarda a operação antes de verificar",
                "async function testUserIsSaved() {",
                "  await saveUserAsync({ name: \"Ana\" });",
                "  const user = repository.findByName(\"Ana\");",
                "  if (!user) throw new Error(\"usuário deveria existir\");",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Na versão flaky, saveUserAsync dispara a gravação mas o teste não espera ela terminar antes de " +
                "consultar o repositório — às vezes a gravação termina a tempo (teste passa), às vezes não " +
                "(teste falha), dependendo de fatores como carga da máquina naquele momento. Adicionar await " +
                "elimina a corrida: o teste só verifica depois que a gravação de fato terminou.",
            },
            { type: "heading", text: "Armadilhas" },
            {
              type: "list",
              items: [
                "Re-rodar até passar esconde o problema e faz a equipe perder a confiança na suíte; elimine a fonte de não " +
                "determinismo.",
                "Aumentar o timeout costuma apenas empurrar a falha; espere pela condição e não por um tempo fixo.",
                "Dependência de ordem e de rede real são causas comuns: isole os testes e use dublês para a rede.",
              ],
            },
          ],
          examples: [
            {
              title: "Flakiness por timeout apertado demais",
              context: "Um limite de tempo rígido demais pode falhar ocasionalmente em máquinas mais lentas ou sob carga.",
              code: {
                language: "javascript",
                filename: "api-latency.test.js",
                code: ["async function testApiRespondsQuickly() {", "  const start = Date.now();", "  await fetchData();", "  const elapsed = Date.now() - start;", "  if (elapsed > 100) throw new Error(\"resposta demorou demais\");", "}"].join("\n"),
              },
              explanation:
                "100ms pode ser suficiente na máquina de quem escreveu o teste, mas falhar ocasionalmente num " +
                "CI compartilhado sob carga variável — um sintoma clássico de flakiness relacionada a tempo.",
            },
            {
              title: "Flakiness por dependência de ordem (falta de isolamento)",
              context: "Testes que dependem do estado deixado por outros são flaky por natureza — passam ou falham dependendo da ordem em que o runner os executa.",
              code: {
                language: "javascript",
                filename: "user-order.test.js",
                code: [
                  "let lastCreatedUserId = null;",
                  "",
                  "function testCreateUser() {",
                  "  lastCreatedUserId = createUser({ name: \"Ana\" }).id;",
                  "}",
                  "",
                  "function testFindLastUser() {",
                  "  const user = findById(lastCreatedUserId); // depende de testCreateUser ter rodado antes",
                  "  if (!user) throw new Error(\"usuário não encontrado\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Se o runner rodar testFindLastUser antes de testCreateUser (paralelização, reordenação, ou " +
                "rodar um teste isolado), lastCreatedUserId é null e o teste falha — não por um bug, mas por " +
                "falta de Test Isolation.",
            },
            {
              title: "Flakiness por dependência de rede real",
              context: "Testes que fazem chamadas de rede reais herdam a instabilidade da própria rede.",
              code: {
                language: "javascript",
                filename: "external-api.test.js",
                code: ["async function testExternalApiIsUp() {", "  const response = await fetch(\"https://api.terceiro.com/status\");", "  if (response.status !== 200) throw new Error(\"API deveria estar disponível\");", "}"].join("\n"),
              },
              explanation:
                "Esse teste depende de uma API externa estar no ar, sem latência excessiva, no exato momento em " +
                "que o CI roda — qualquer instabilidade momentânea da rede ou do serviço terceiro faz o teste " +
                "falhar sem que o código tenha nenhum problema (candidato a virar um Stub, ver módulo Test Doubles).",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo falha aproximadamente 1 vez a cada 10 execuções, sem nenhuma mudança no código. A " +
              "causa é uma corrida entre a chamada de processQueue (assíncrona) e a verificação do resultado.",
            problemCode: {
              language: "javascript",
              filename: "queue.test.js",
              code: ["function testQueueIsProcessed() {", "  processQueue(); // função assíncrona, não aguardada", "  if (queue.length !== 0) throw new Error(\"fila deveria estar vazia após processamento\");", "}"].join("\n"),
            },
            task: "Corrija o teste para eliminar a flakiness, garantindo que a verificação só rode depois que processQueue realmente terminar.",
            hint: "Se processQueue devolve uma Promise, a correção é a mesma do exemplo mínimo: aguardar antes de verificar.",
            solution: {
              code: {
                language: "javascript",
                filename: "queue.test.js",
                code: ["async function testQueueIsProcessed() {", "  await processQueue();", "  if (queue.length !== 0) throw new Error(\"fila deveria estar vazia após processamento\");", "}"].join("\n"),
              },
              explanation:
                "Com await, o teste só chega à linha de verificação depois que processQueue de fato terminou — " +
                "elimina a corrida entre a operação assíncrona e a asserção, tornando o resultado determinístico " +
                "em toda execução.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Regression Testing",
          requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
          note: "re-executar testes para impedir que bugs corrigidos voltem",
          revisit: ["AI Engineering / AI Evaluation / Regression Evaluation"],
          summary:
            "Re-executar a suíte de testes existente depois de uma mudança, para confirmar que nenhum " +
            "comportamento que já funcionava — incluindo bugs já corrigidos — voltou a quebrar.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Regression Testing é a prática de rodar novamente testes já existentes depois de uma mudança " +
                "no código, para garantir que nada que já funcionava passou a falhar. O termo \"regressão\" vem " +
                "exatamente disso: o sistema regrediu, voltou a ter um problema que já tinha sido resolvido " +
                "antes. Não é um tipo novo de teste — é o reuso disciplinado de unit, integration e E2E tests " +
                "já escritos, rodados de novo a cada mudança.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Regression Testing é reexecutar a suíte existente a cada mudança para garantir que nada que já " +
                "funcionava quebrou — e, quando nasce de um bug real corrigido, garante especificamente que " +
                "aquele problema não volta a acontecer.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sistemas de software mudam o tempo todo, e cada mudança tem o risco de quebrar algo que não " +
                "tinha relação aparente — um efeito colateral inesperado numa parte distante do código. " +
                "Regression testing existe para pegar exatamente esse tipo de quebra silenciosa, sem depender " +
                "de um humano lembrar de testar manualmente todos os cantos do sistema a cada mudança.",
            },
            {
              type: "paragraph",
              text:
                "Um padrão específico e valioso é o teste de regressão nascido de um bug real: quando um bug é " +
                "corrigido, escrever um teste que reproduz exatamente aquele cenário garante que, se alguém " +
                "(inclusive a própria pessoa que corrigiu) reintroduzir o mesmo problema no futuro, a suíte " +
                "aponta imediatamente — sem depender de o bug ser notado de novo em produção.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um teste de regressão escrito depois de corrigir um bug real de divisão por zero:" },
            {
              type: "code",
              language: "javascript",
              filename: "average.test.js",
              code: [
                "// Bug encontrado em produção: calculateAverage([]) lançava",
                "// \"Division by zero\" em vez de devolver 0.",
                "",
                "function calculateAverage(numbers) {",
                "  if (numbers.length === 0) return 0; // correção",
                "  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;",
                "}",
                "",
                "// Teste de regressão: garante que esse bug específico não volta",
                "function testCalculateAverageOfEmptyArrayDoesNotThrow() {",
                "  const result = calculateAverage([]);",
                "  if (result !== 0) throw new Error(`esperava 0, recebeu ${result}`);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "testCalculateAverageOfEmptyArrayDoesNotThrow existe especificamente por causa do bug que já " +
                "aconteceu — não é um teste genérico de \"boas práticas\", é a prova de que aquele cenário " +
                "exato continua funcionando. Se uma refatoração futura remover acidentalmente o if " +
                "(numbers.length === 0), esse teste falha imediatamente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "A cada mudança, rodando a suíte existente para confirmar que nada que funcionava quebrou.",
                "Ao corrigir um bug, escrevendo antes um teste que o reproduz, para que ele não volte.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Só protege o que já está coberto: comportamento sem teste pode regredir sem aviso.",
                "Uma suíte de regressão lenta deixa de ser rodada a cada mudança; mantenha-a rápida ou divida-a por camadas.",
              ],
            },
          ],
          examples: [
            {
              title: "Um teste de regressão nascido de um incidente de produção",
              context: "O padrão mais valioso de regression test: reproduzir exatamente o cenário que já quebrou uma vez.",
              code: {
                language: "javascript",
                filename: "discount-edge-case.test.js",
                code: [
                  "// Incidente: desconto de 100% resultava em preço negativo",
                  "// por causa de arredondamento de ponto flutuante.",
                  "function testDiscountOf100PercentNeverGoesNegative() {",
                  "  const result = applyDiscount(99.99, 100);",
                  "  if (result < 0) throw new Error(\"desconto não deveria resultar em valor negativo\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Esse teste não existiria se o incidente nunca tivesse acontecido — ele documenta, em código " +
                "executável, um caso extremo real que já surpreendeu o time uma vez.",
            },
            {
              title: "Rodando a suíte de regressão inteira a cada mudança",
              context: "Regression testing acontece de forma automática sempre que a suíte completa roda no CI, não é uma etapa separada.",
              code: {
                language: "javascript",
                filename: "pipeline-config.js",
                code: ["const pipeline = {", "  onEveryCommit: [\"runUnitTests\", \"runIntegrationTests\"],", "  onEveryMerge: [\"runUnitTests\", \"runIntegrationTests\", \"runE2ETests\"],", "};"].join("\n"),
              },
              explanation:
                "Não existe uma suíte \"de regressão\" separada da suíte normal — a suíte inteira, rodada de " +
                "novo a cada commit, É o mecanismo de regression testing (ponte com CI/CD Pipeline, na Área de " +
                "Platform Engineering).",
            },
            {
              title: "Regression testing pegando uma quebra não intencional",
              context: "O caso comum: uma mudança em uma área quebra, sem querer, um comportamento em outra.",
              code: {
                language: "javascript",
                filename: "discount.test.js",
                code: ["function testExistingDiscountLogicStillWorks() {", "  // Esse teste já existia antes da nova feature de cupons", "  const result = applyDiscount(100, 10);", "  if (result !== 90) throw new Error(\"lógica de desconto existente quebrou\");", "}"].join("\n"),
              },
              explanation:
                "Ao adicionar uma feature de cupons, alguém pode ter alterado applyDiscount sem perceber que " +
                "quebraria o caso de desconto simples — esse teste, que já existia antes da nova feature, é o " +
                "que pega essa regressão.",
            },
          ],
          exercise: {
            problem:
              "Um bug em produção causou que sortByDate([]) (lista vazia) lançasse um erro em vez de devolver " +
              "uma lista vazia. O bug foi corrigido, mas nenhum teste foi escrito para documentar a correção.",
            problemCode: {
              language: "javascript",
              filename: "sort-by-date.js",
              code: [
                "function sortByDate(items) {",
                "  return items.sort((a, b) => a.date - b.date);",
                "}",
                "// Correção aplicada (não mostrada) — lista vazia agora funciona.",
                "// Nenhum teste garante que o bug não volta.",
              ].join("\n"),
            },
            task: "Escreva o teste de regressão que faltou, capturando exatamente o cenário que causou o bug original.",
            hint: "O teste de regressão deve reproduzir o input exato que quebrou em produção — uma lista vazia — e verificar o comportamento correto.",
            solution: {
              code: {
                language: "javascript",
                filename: "sort-by-date.test.js",
                code: [
                  "function testSortByDateWithEmptyArrayDoesNotThrow() {",
                  "  const result = sortByDate([]);",
                  "  if (!Array.isArray(result) || result.length !== 0) {",
                  "    throw new Error(\"sortByDate([]) deveria devolver uma lista vazia sem lançar erro\");",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Esse teste reproduz exatamente o cenário que já causou um incidente — uma lista vazia — e vira " +
                "parte permanente da suíte. Se uma futura mudança em sortByDate reintroduzir esse bug, o teste " +
                "falha imediatamente, antes de chegar a produção de novo.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Property-Based Testing",
          isNew: true,
          requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Contract"],
          note: "gerar muitas entradas a partir de propriedades/invariantes, em vez de exemplos",
          revisit: ["Functional Programming / Pure Functions (onde funciona melhor)"],
          summary:
            "Em vez de escrever exemplos específicos de entrada e saída, descrever uma propriedade que deve " +
            "valer para qualquer entrada — e deixar a ferramenta gerar centenas de entradas aleatórias tentando " +
            "quebrá-la.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Property-based testing inverte a forma tradicional de escrever um teste: em vez de escolher " +
                "exemplos específicos (\"reverse([1,2,3]) deveria devolver [3,2,1]\"), você descreve uma " +
                "propriedade — um invariante que deve ser verdade para qualquer entrada válida (\"reverter uma " +
                "lista duas vezes deveria devolver a lista original\") — e uma ferramenta gera automaticamente " +
                "centenas ou milhares de entradas aleatórias, tentando encontrar uma que quebre essa propriedade.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Property-based testing descreve uma propriedade que deve valer para qualquer entrada e deixa a " +
                "ferramenta gerar muitas entradas tentando quebrá-la — encontrando casos extremos que testes " +
                "baseados em exemplos específicos tendem a deixar passar.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Testes baseados em exemplos só provam que o código funciona para os casos específicos " +
                "escolhidos por quem escreveu o teste — e quem escreve o teste tende a pensar nos mesmos casos " +
                "óbvios que pensou ao escrever a implementação, deixando pontos cegos comuns. Property-based " +
                "testing existe para explorar o espaço de entradas de forma muito mais ampla do que um humano " +
                "conseguiria escrever à mão, incluindo casos extremos (listas vazias, números negativos, " +
                "strings com caracteres especiais) que ninguém pensaria em testar manualmente.",
            },
            {
              type: "paragraph",
              text:
                "Quando a ferramenta encontra uma entrada que quebra a propriedade, ela normalmente faz " +
                "\"shrinking\": reduz essa entrada ao menor caso possível que ainda reproduz a falha, para " +
                "facilitar a depuração. Property-based testing funciona melhor sobre funções puras e com " +
                "contratos claros (pré/pós-condições) — é por isso que se conecta tão naturalmente a Pure Functions.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma propriedade sobre reverter uma lista, verificada com entradas geradas aleatoriamente:" },
            {
              type: "code",
              language: "javascript",
              filename: "reverse.property.test.js",
              code: [
                "function reverseList(list) {",
                "  return [...list].reverse();",
                "}",
                "",
                "function testReversingTwiceReturnsOriginal() {",
                "  for (let i = 0; i < 100; i++) {",
                "    const randomList = generateRandomArray();",
                "    const result = reverseList(reverseList(randomList));",
                "    if (JSON.stringify(result) !== JSON.stringify(randomList)) {",
                "      throw new Error(`propriedade quebrada para entrada: ${JSON.stringify(randomList)}`);",
                "    }",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em vez de um único exemplo fixo, o teste gera 100 listas aleatórias diferentes e verifica, " +
                "para cada uma, que reverter duas vezes devolve a lista original — a propriedade que deve valer " +
                "sempre, não importa o conteúdo específico da lista. Ferramentas reais de property-based " +
                "testing (como fast-check em JavaScript) fazem essa geração de forma mais sofisticada, incluindo " +
                "casos extremos deliberados.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando é possível enunciar uma propriedade geral, como idempotência ou uma invariante estrutural.",
                "Para achar casos extremos que os exemplos escritos à mão deixam passar.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Nem toda regra tem uma propriedade simples de enunciar; nesses casos, exemplos concretos são mais claros.",
                "Uma propriedade que reimplementa o código testado só repete o mesmo erro; a propriedade deve ser mais " +
                "simples que a implementação.",
              ],
            },
          ],
          examples: [
            {
              title: "Propriedade de idempotência",
              context: "Uma propriedade comum: aplicar uma operação duas vezes dá o mesmo resultado que aplicar uma vez.",
              code: {
                language: "javascript",
                filename: "normalize-email.property.test.js",
                code: [
                  "function normalizeEmail(email) {",
                  "  return email.trim().toLowerCase();",
                  "}",
                  "",
                  "function testNormalizeIsIdempotent() {",
                  "  for (const email of generateRandomEmails(50)) {",
                  "    const once = normalizeEmail(email);",
                  "    const twice = normalizeEmail(once);",
                  "    if (once !== twice) throw new Error(`não é idempotente para: ${email}`);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A propriedade \"normalizar já normalizado não muda nada\" deveria valer para qualquer e-mail, " +
                "não só para um exemplo escolhido a dedo — gerar vários e-mails aleatórios aumenta a chance de " +
                "achar um caso que quebre essa expectativa.",
            },
            {
              title: "Propriedade sobre uma invariante estrutural",
              context: "Propriedades também podem verificar que uma estrutura de dados permanece consistente, não só um valor final.",
              code: {
                language: "javascript",
                filename: "insert-sorted.property.test.js",
                code: [
                  "function insertSorted(sortedArray, value) {",
                  "  return [...sortedArray, value].sort((a, b) => a - b);",
                  "}",
                  "",
                  "function testResultIsAlwaysSorted() {",
                  "  for (let i = 0; i < 100; i++) {",
                  "    const arr = generateRandomSortedArray();",
                  "    const value = Math.floor(Math.random() * 1000);",
                  "    const result = insertSorted(arr, value);",
                  "    for (let j = 1; j < result.length; j++) {",
                  "      if (result[j] < result[j - 1]) throw new Error(\"resultado não está ordenado\");",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A propriedade verificada — \"o resultado está sempre ordenado\" — não depende de nenhum valor " +
                "específico de entrada; vale para qualquer array ordenado e qualquer valor inserido.",
            },
            {
              title: "Shrinking: reduzindo a entrada que quebrou a propriedade",
              context: "Quando uma propriedade falha, encontrar o menor caso que reproduz o problema facilita a depuração.",
              code: {
                language: "javascript",
                filename: "shrink.js",
                code: ["function shrink(failingInput, property) {", "  let smallest = failingInput;", "  for (const candidate of generateSmallerVariants(failingInput)) {", "    if (!property(candidate)) smallest = candidate;", "  }", "  return smallest;", "}"].join("\n"),
              },
              explanation:
                "Se uma propriedade falha para uma lista de 50 elementos aleatórios, shrinking tenta variantes " +
                "cada vez menores (49, 30, 5, 1 elemento) até achar a menor lista que ainda reproduz a falha — " +
                "muito mais fácil de depurar do que a original.",
            },
          ],
          exercise: {
            problem:
              "O teste abaixo verifica a função sortArray só com um único exemplo fixo, deixando passar " +
              "despercebido um bug que só aparece com arrays contendo números negativos.",
            problemCode: {
              language: "javascript",
              filename: "sort-array.test.js",
              code: [
                "function sortArray(arr) {",
                "  return arr.sort(); // bug: sort() sem comparador ordena como string",
                "}",
                "",
                "function testSortArray() {",
                "  const result = sortArray([3, 1, 2]);",
                "  if (JSON.stringify(result) !== JSON.stringify([1, 2, 3])) throw new Error(\"não ordenou corretamente\");",
                "}",
              ].join("\n"),
            },
            task:
              "Escreva uma propriedade (não um exemplo fixo) que verifique que o array resultante está sempre " +
              "ordenado, para várias entradas aleatórias incluindo números negativos, e mostre como ela " +
              "revelaria o bug.",
            hint: "A propriedade \"cada elemento é ≥ o anterior\" deve valer para qualquer array de números, positivos ou negativos.",
            solution: {
              code: {
                language: "javascript",
                filename: "sort-array.property.test.js",
                code: [
                  "function testSortArrayResultIsAlwaysAscending() {",
                  "  for (let i = 0; i < 50; i++) {",
                  "    const arr = generateRandomIntArray({ includeNegatives: true });",
                  "    const result = sortArray(arr);",
                  "    for (let j = 1; j < result.length; j++) {",
                  "      if (result[j] < result[j - 1]) {",
                  "        throw new Error(`resultado não ordenado para entrada: ${JSON.stringify(arr)}`);",
                  "      }",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Com números negativos incluídos na geração aleatória, essa propriedade eventualmente gera um " +
                "array como [-1, -20, 3] — sort() sem comparador o ordenaria como string (\"-1\" < \"-20\" " +
                "lexicograficamente), quebrando a propriedade e revelando o bug que o teste de exemplo único " +
                "nunca pegaria.",
            },
          },
        }),
        concept({
          order: 80,
          title: "Contract Testing",
          requires: ["Programming Foundations / Programming Fundamentals / Contract", "Testing Fundamentals / Integration Testing"],
          note: "provedor e consumidor concordam numa interface",
          collision: "≠ Contract (Epic 01 / PF) · ≠ API Contract (Platform / API)",
          revisit: ["Platform / API (API Contract)", "Architecture / Service Communication (consumer-driven contracts)"],
          summary:
            "Verificar que um provedor de uma API e seus consumidores concordam sobre o formato da interface " +
            "entre eles — sem precisar rodar os dois sistemas inteiros juntos para descobrir uma incompatibilidade.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Contract testing verifica que dois serviços que se comunicam — um provedor (que expõe uma " +
                "API) e um consumidor (que a chama) — concordam sobre o formato dessa comunicação: quais campos " +
                "existem, quais tipos têm, quais são obrigatórios. Em vez de subir os dois serviços reais " +
                "juntos para um teste de integração completo, cada lado testa separadamente contra um " +
                "\"contrato\" compartilhado — um documento (geralmente gerado automaticamente) que descreve " +
                "exatamente o que é esperado.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Contract Testing verifica que provedor e consumidor concordam sobre a interface entre eles, " +
                "cada lado testado isoladamente contra um contrato compartilhado — pegando incompatibilidades " +
                "de formato sem o custo de subir o sistema inteiro.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Em sistemas com múltiplos serviços desenvolvidos por times diferentes, testar a integração " +
                "completa entre todos eles a cada mudança é caro e lento — exigiria subir o sistema inteiro " +
                "para testar uma mudança pequena em um único serviço. Contract testing existe para pegar " +
                "incompatibilidades de interface (um campo renomeado, um tipo alterado) sem esse custo: o " +
                "provedor verifica que ainda cumpre o contrato, o consumidor verifica que ainda usa o contrato " +
                "corretamente, cada um isoladamente.",
            },
            {
              type: "paragraph",
              text:
                "Uma variação comum é o consumer-driven contract: o consumidor define o que espera da API (só " +
                "os campos que de fato usa), e esse contrato vira o critério que o provedor precisa respeitar. " +
                "Isso evita que o provedor quebre consumidores por mudar um campo que nenhum consumidor sequer " +
                "usava, e detecta cedo quando o provedor muda algo que um consumidor específico realmente depende.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um contrato simples e os dois lados verificados contra ele, separadamente:" },
            {
              type: "code",
              language: "javascript",
              filename: "user-api.contract.test.js",
              code: [
                "// O contrato: o que o consumidor espera da resposta da API",
                "const userApiContract = {",
                "  id: \"number\",",
                "  name: \"string\",",
                "  email: \"string\",",
                "};",
                "",
                "// Lado do provedor: a resposta real cumpre o contrato?",
                "function testProviderFulfillsContract() {",
                "  const response = userApiHandler({ id: 1 });",
                "  for (const field in userApiContract) {",
                "    if (typeof response[field] !== userApiContract[field]) {",
                "      throw new Error(`campo ${field} não cumpre o contrato`);",
                "    }",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "userApiContract descreve o formato esperado, independente de qual serviço o implementa. O " +
                "lado do provedor roda esse teste contra sua implementação real, sem precisar de nenhum " +
                "consumidor de verdade rodando; um teste espelhado do lado do consumidor verificaria que ele " +
                "consegue processar uma resposta nesse mesmo formato, sem precisar do provedor real no ar.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Entre serviços mantidos por times diferentes, para detectar uma quebra de formato antes da integração real.",
                "Quando subir os dois sistemas juntos é caro ou lento demais.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Verifica o formato da interface, não o comportamento do negócio; não substitui os testes de integração.",
                "Exige manter o contrato compartilhado e um processo entre provedor e consumidor; com um só time e um só " +
                "repositório, pode ser exagero.",
              ],
            },
          ],
          examples: [
            {
              title: "Consumer-driven contract",
              context: "O consumidor define o contrato com base só no que de fato usa da resposta.",
              code: {
                language: "javascript",
                filename: "consumer-contract.js",
                code: ["const consumerExpectation = {", "  // Este consumidor só usa id e email — não se importa com outros campos", "  id: \"number\",", "  email: \"string\",", "};"].join("\n"),
              },
              explanation:
                "Se o provedor adicionar um campo novo, ou remover um campo que este consumidor específico não " +
                "usa, o contrato continua válido — o provedor só quebra o contrato se mexer em algo que o " +
                "consumidor de fato depende.",
            },
            {
              title: "Detectando uma quebra de contrato antes da integração real",
              context: "O objetivo central: pegar a incompatibilidade cedo, sem precisar dos dois sistemas reais rodando juntos.",
              code: {
                language: "javascript",
                filename: "user-api-handler.js",
                code: [
                  "// Provedor mudou o campo \"email\" para \"emailAddress\" sem avisar",
                  "function userApiHandler(query) {",
                  "  return { id: query.id, name: \"Ana\", emailAddress: \"ana@example.com\" };",
                  "}",
                  "// testProviderFulfillsContract falharia aqui: \"email\" não existe mais na resposta",
                ].join("\n"),
              },
              explanation:
                "O teste de contrato do lado do provedor falha imediatamente com essa mudança — antes de " +
                "qualquer consumidor real tentar integrar e quebrar em produção por depender de um campo email " +
                "que não existe mais.",
            },
            {
              title: "Contract testing vs. integration testing completo",
              context: "Contract testing é mais barato porque não exige os dois sistemas reais simultaneamente.",
              code: {
                language: "javascript",
                filename: "test-strategy.js",
                code: [
                  "// Integration testing completo: exige provedor E consumidor rodando juntos",
                  "// Contract testing: cada lado roda contra o contrato, separadamente",
                  "const testStrategy = {",
                  "  fullIntegration: { providerRunning: true, consumerRunning: true },",
                  "  contractTesting: { providerRunning: true, consumerRunning: false },",
                  "};",
                ].join("\n"),
              },
              explanation:
                "Contract testing troca a certeza total de um teste de integração completo (os dois sistemas " +
                "reais, juntos) por um teste muito mais barato e rápido que ainda pega a maioria das " +
                "incompatibilidades reais — o formato da interface.",
            },
          ],
          exercise: {
            problem:
              "O provedor abaixo renomeou o campo total para totalAmount numa resposta de pedido, sem " +
              "coordenar com o time consumidor, que ainda espera total.",
            problemCode: {
              language: "javascript",
              filename: "order-api.js",
              code: [
                "function orderApiHandler(orderId) {",
                "  return { id: orderId, totalAmount: 150.0, status: \"pending\" };",
                "}",
                "",
                "const consumerContract = {",
                "  id: \"number\",",
                "  total: \"number\",",
                "  status: \"string\",",
                "};",
              ].join("\n"),
            },
            task: "Escreva o teste de contrato do lado do provedor que detectaria essa quebra antes que o consumidor real fosse afetado.",
            hint: "O teste percorre os campos do contrato e verifica se cada um existe (com o tipo certo) na resposta real do provedor.",
            solution: {
              code: {
                language: "javascript",
                filename: "order-api.contract.test.js",
                code: [
                  "function testProviderFulfillsConsumerContract() {",
                  "  const response = orderApiHandler(42);",
                  "  for (const field in consumerContract) {",
                  "    if (typeof response[field] !== consumerContract[field]) {",
                  "      throw new Error(`contrato quebrado: campo \"${field}\" ausente ou com tipo incorreto`);",
                  "    }",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Esse teste falha imediatamente com a mensagem \"contrato quebrado: campo 'total' ausente\" — a " +
                "incompatibilidade é detectada do lado do provedor, sem precisar que o time consumidor descubra " +
                "em produção que seu código quebrou.",
            },
          },
        }),
      ],
    }),
    module({
      slug: "debugging",
      order: 50,
      title: "Debugging",
      requires: [
        "Testing Fundamentals",
        "Programming Foundations / Memory & Runtime / Call Stack",
        "Programming Foundations / Algorithms & Complexity / Binary Search",
      ],
      summary:
        "Reproduzir → método (hipótese) → ler o artefato gratuito do runtime (stack trace) → parar a execução " +
        "(breakpoints) → localizar (binary search → git bisect) → não parar no sintoma (RCA).",
      suggestions: [
        "Logging for Debugging / printf Debugging",
        "Rubber Duck Debugging",
        "Debugger (a ferramenta)",
        "Conditional Breakpoints",
        "Watch Expressions",
        "git blame",
        "Heisenbug",
        "Core Dump",
        "Delta Debugging",
        "Time-Travel Debugging",
        "Observability-Driven Debugging (ponte para Platform)",
      ],
      concepts: [
        concept({
          order: 10,
          title: "Reproduction",
          requires: ["Testing Fundamentals / Unit Testing"],
          note: "tornar o bug confiável antes de investigar — um teste que falha é a repro ideal",
          summary:
            "Tornar um bug confiável e repetível antes de investigar sua causa — sem uma reprodução confiável, " +
            "qualquer tentativa de correção é só um palpite.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Reproduction é o passo de conseguir fazer um bug acontecer de forma confiável, sob controle, " +
                "sempre que necessário — em vez de depender de esperar que ele aconteça de novo por acaso. Um " +
                "bug \"reproduzido\" tem passos conhecidos (ou uma entrada conhecida) que, seguidos, disparam o " +
                "comportamento incorreto de forma consistente.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Reproduction transforma um bug incerto em um experimento repetível — sem essa base, qualquer " +
                "tentativa de correção é um palpite sem forma de confirmar se de fato resolveu o problema.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem reprodução, depurar vira adivinhação: qualquer mudança feita no código pode parecer ter " +
                "corrigido o bug simplesmente porque ele não aconteceu de novo por acaso — sem prova de que a " +
                "causa real foi endereçada. Reproduction transforma um evento incerto (\"aconteceu uma vez, não " +
                "sei por quê\") em um experimento repetível, condição necessária para qualquer investigação séria.",
            },
            {
              type: "paragraph",
              text:
                "A forma ideal de reprodução é um teste automatizado que falha exatamente pelo motivo do bug — " +
                "isso cria uma ponte direta com Regression Testing (módulo Testing Strategy): o mesmo teste que " +
                "serve para reproduzir o bug agora vira, depois da correção, a prova permanente de que ele não volta.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um bug relatado de forma vaga, transformado num teste que o reproduz de forma confiável:" },
            {
              type: "code",
              language: "javascript",
              filename: "discount-bug.repro.js",
              code: [
                "// Relato vago: \"às vezes o total do carrinho vem errado com desconto\"",
                "",
                "function testReproduceDiscountBug() {",
                "  const cart = { items: [{ price: 33.33 }, { price: 33.33 }, { price: 33.33 }] };",
                "  const result = applyDiscount(cart, 10);",
                "  if (result.total !== 90) {",
                "    throw new Error(`bug reproduzido: esperava 90, recebeu ${result.total}`);",
                "  }",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em vez de continuar com um relato vago (\"às vezes dá errado\"), testReproduceDiscountBug fixa " +
                "uma entrada exata (três itens de 33.33) que reproduz a falha de forma determinística. Agora " +
                "existe um experimento repetível para investigar — e, quando corrigido, o mesmo código vira um " +
                "teste de regressão permanente.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Antes de investigar qualquer bug: sem reprodução confiável, não há como confirmar que a correção funcionou.",
                "Quando possível, como teste automatizado, que depois fica como proteção contra regressão.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Alguns bugs dependem de ambiente, tempo ou carga e resistem a uma reprodução simples; registre as condições " +
                "em vez de desistir.",
                "Se não dá para reproduzir, colete logs e dados do ambiente em vez de corrigir no palpite.",
              ],
            },
          ],
          examples: [
            {
              title: "De um relato vago a uma reprodução mínima",
              context: "O primeiro passo é sempre reduzir o relato original ao menor caso que ainda dispara o problema.",
              code: {
                language: "javascript",
                filename: "import-crash.repro.js",
                code: ["// Relato original: \"o app trava ao importar uma planilha grande\"", "function testReproduceImportCrash() {", "  const minimalSpreadsheet = [{ id: 1, value: null }]; // reduzido de 10.000 linhas", "  importSpreadsheet(minimalSpreadsheet); // ainda trava", "}"].join("\n"),
              },
              explanation:
                "Reduzir de uma planilha de 10.000 linhas para uma única linha com um valor null revela que o " +
                "problema não é volume — é um valor específico que a lógica de importação não trata.",
            },
            {
              title: "Reprodução via teste automatizado (o caso ideal)",
              context: "Sempre que possível, a reprodução vira um teste, não um passo manual repetido.",
              code: {
                language: "javascript",
                filename: "null-profile.repro.js",
                code: ["function testReproduceNullPointerOnEmptyProfile() {", "  const user = { name: \"Ana\", profile: null };", "  const result = formatUserSummary(user); // deveria lidar com profile ausente", "}"].join("\n"),
              },
              explanation:
                "Ter isso como um teste (em vez de um passo a passo manual num ticket) significa que qualquer " +
                "pessoa do time pode rodar e ver a falha, sem precisar seguir instruções escritas em prosa.",
            },
            {
              title: "Quando a reprodução exige condições específicas de ambiente",
              context: "Alguns bugs só reproduzem sob condições específicas — identificar exatamente quais é parte do trabalho de reprodução.",
              code: {
                language: "javascript",
                filename: "race-condition.repro.js",
                code: ["function testReproduceRaceConditionUnderConcurrentRequests() {", "  const requests = Array.from({ length: 50 }, () => incrementCounter());", "  return Promise.all(requests); // só falha com concorrência real, não sequencial", "}"].join("\n"),
              },
              explanation:
                "Esse bug não reproduz com uma chamada sequencial — só aparece com 50 chamadas concorrentes, o " +
                "que precisou ser descoberto experimentando com a condição até isolar o que de fato disparava a falha.",
            },
          ],
          exercise: {
            problem:
              "Um usuário relatou: \"quando eu clico em salvar duas vezes rápido, às vezes cria dois registros " +
              "duplicados\". Ninguém ainda tentou reproduzir isso de forma confiável.",
            task:
              "Escreva, em código, uma reprodução determinística desse bug — não uma explicação, uma chamada de " +
              "função (ou sequência delas) que dispara o comportamento incorreto de forma repetível.",
            hint: "\"Duas vezes rápido\" sugere uma condição de concorrência — duas chamadas próximas no tempo, não necessariamente sequenciais uma esperando a outra.",
            solution: {
              code: {
                language: "javascript",
                filename: "duplicate-save.repro.js",
                code: [
                  "async function testReproduceDuplicateOnDoubleClick() {",
                  "  const savePromises = [saveRecord({ title: \"Nota\" }), saveRecord({ title: \"Nota\" })];",
                  "  await Promise.all(savePromises);",
                  "",
                  "  const records = await findAllByTitle(\"Nota\");",
                  "  if (records.length > 1) {",
                  "    console.log(`bug reproduzido: ${records.length} registros duplicados`);",
                  "  }",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Disparar as duas chamadas de saveRecord ao mesmo tempo (sem esperar a primeira terminar) " +
                "simula o clique duplo rápido — se o bug for uma race condition na criação, essa reprodução " +
                "deveria disparar o mesmo comportamento de forma consistente, transformando o relato vago em um " +
                "experimento repetível.",
            },
          },
        }),
        concept({
          order: 20,
          title: "Hypothesis-Driven Debugging",
          requires: ["Reproduction"],
          note: "método científico: hipótese → previsão → teste",
          summary:
            "Aplicar o método científico à depuração: formular uma hipótese sobre a causa do bug, prever o que " +
            "ela implicaria, testar essa previsão — e repetir, descartando ou confirmando hipóteses uma de cada vez.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Hypothesis-Driven Debugging é a prática de investigar um bug formulando hipóteses explícitas " +
                "sobre sua causa, cada uma testável: \"eu acho que o problema é X; se for X, então observar Y " +
                "deveria confirmar isso\". Em vez de mudar código aleatoriamente na esperança de que algo " +
                "resolva, cada passo é uma pergunta específica com uma resposta que confirma ou descarta uma hipótese.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Hypothesis-Driven Debugging aplica hipótese → previsão → teste de forma iterativa, garantindo " +
                "que cada mudança seja guiada por evidência, não por tentativa e erro — ao final, você sabe por " +
                "que o bug acontecia, não só que parou.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Sem uma hipótese explícita, é fácil cair em depuração por tentativa e erro: mudar várias " +
                "coisas ao mesmo tempo, sem saber qual mudança (se alguma) resolveu o problema, ou pior, sem " +
                "saber por que o problema acontecia. Método científico aplicado à depuração garante que, ao " +
                "final, você sabe exatamente por que o bug acontecia — não só que ele parou de acontecer.",
            },
            {
              type: "paragraph",
              text:
                "O ciclo se apoia em Reproduction: sem uma reprodução confiável, não é possível testar uma " +
                "previsão de forma confiável. Cada hipótese testada e descartada também reduz o espaço de " +
                "possibilidades — mesmo uma hipótese errada produz informação (\"não é isso, então deve ser " +
                "outra coisa\"), o que evita repetir a mesma investigação.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma hipótese formulada, testada e refinada até a causa real:" },
            {
              type: "code",
              language: "javascript",
              filename: "age-nan.debug.js",
              code: [
                "// Bug reproduzido: getUserAge(user) às vezes devolve NaN",
                "",
                "// Hipótese 1: user.birthDate está no formato errado",
                "function testHypothesis1() {",
                "  console.log(typeof user.birthDate); // previsão: deveria ser \"string\" ou Date",
                "}",
                "// Resultado: user.birthDate é undefined em alguns casos — hipótese 1 confirmada em parte",
                "",
                "// Hipótese refinada: getUserAge não trata birthDate ausente",
                "function getUserAge(user) {",
                "  if (!user.birthDate) return null; // correção baseada na causa confirmada",
                "  return calculateAgeFromDate(user.birthDate);",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A primeira hipótese (\"formato errado\") levou a uma observação inesperada (birthDate " +
                "undefined), que por sua vez gerou uma hipótese mais precisa. Cada passo teve uma previsão " +
                "clara antes de rodar código, e o resultado observado (não uma suposição) guiou o próximo passo.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando a causa não é óbvia e a tentativa e erro começa a virar mudanças aleatórias.",
                "Para registrar o que já foi descartado e não repetir o mesmo caminho.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Uma hipótese vaga, sem previsão que possa falhar, não pode ser testada; formule algo específico.",
                "Mude uma coisa por vez: várias mudanças juntas impedem saber o que resolveu.",
              ],
            },
          ],
          examples: [
            {
              title: "Descartando uma hipótese com uma observação simples",
              context: "Uma hipótese errada ainda é útil — ela elimina uma possibilidade.",
              code: {
                language: "javascript",
                filename: "cache-hypothesis.debug.js",
                code: ["// Hipótese: o cache está devolvendo dados desatualizados", "function testHypothesisCacheIsStale() {", "  cache.clear();", "  const result = getUserProfile(42);", "  console.log(result); // se o bug ainda acontece sem cache, a hipótese está errada", "}"].join("\n"),
              },
              explanation:
                "Limpar o cache e ver o bug persistir descarta a hipótese do cache — a causa está em outro " +
                "lugar, e essa informação evita continuar investigando essa direção.",
            },
            {
              title: "Uma previsão específica, não vaga",
              context: "Uma boa hipótese gera uma previsão concreta que pode ser confirmada ou refutada com uma única observação.",
              code: {
                language: "javascript",
                filename: "type-hypothesis.debug.js",
                code: ["// Hipótese: a função está recebendo strings quando espera números", "function testHypothesisTypeIsWrong() {", "  console.log(typeof calculateTotal.arguments); // previsão: deveria mostrar \"string\" em algum ponto", "}"].join("\n"),
              },
              explanation:
                "A previsão é específica (\"vou ver um tipo string onde esperava number\"), não genérica " +
                "(\"algo está errado com os tipos\") — isso torna a hipótese realmente testável, com um " +
                "resultado claro de confirmação ou refutação.",
            },
            {
              title: "Ciclo completo até a causa confirmada",
              context: "Múltiplas iterações do ciclo, cada uma restringindo o espaço de possibilidades.",
              code: {
                language: "javascript",
                filename: "date-null.debug.js",
                code: [
                  "// H1: é um problema de timezone → testado, descartado",
                  "// H2: é um problema de arredondamento → testado, descartado",
                  "// H3: a data vem de uma API que às vezes devolve null → testado, CONFIRMADO",
                  "function testHypothesis3ApiReturnsNull() {",
                  "  const response = { date: null }; // reproduz a resposta real observada",
                  "  const result = formatDate(response.date);",
                  "  if (result === \"Invalid Date\") console.log(\"H3 confirmada\");",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Três hipóteses testadas em sequência, cada uma eliminando uma possibilidade até chegar à causa " +
                "real (a API às vezes devolve null) — o processo documentado mostra exatamente o caminho da " +
                "investigação, não só o resultado final.",
            },
          ],
          exercise: {
            problem:
              "Um bug faz um relatório de vendas mostrar valores duplicados às vezes. Alguém já suspeita de " +
              "\"algo com o banco\", mas ainda não formulou uma hipótese testável nem fez nenhuma previsão específica.",
            task: "Formule uma hipótese testável específica para essa suspeita vaga, com uma previsão concreta que confirmaria ou refutaria.",
            hint: "\"Algo com o banco\" não é testável; \"a query tem um JOIN que duplica linhas quando um vendedor tem mais de um pedido\" é.",
            solution: {
              code: {
                language: "javascript",
                filename: "join-duplicates.debug.js",
                code: [
                  "// Hipótese: o JOIN entre orders e sellers duplica linhas quando",
                  "// um vendedor aparece em mais de um pedido no período.",
                  "function testHypothesisJoinDuplicatesRows() {",
                  "  const rawRows = runReportQuery({ sellerId: 7, period: \"2026-Q1\" });",
                  "  const uniqueOrderIds = new Set(rawRows.map((r) => r.orderId));",
                  "",
                  "  // Previsão: se a hipótese estiver certa, rawRows.length > uniqueOrderIds.size",
                  "  console.log(rawRows.length, uniqueOrderIds.size);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A previsão é concreta e verificável: se rawRows.length for maior que o número de orderId " +
                "únicos, a hipótese do JOIN duplicando linhas está confirmada — uma pergunta específica com uma " +
                "resposta objetiva, em vez de continuar suspeitando vagamente \"do banco\".",
            },
          },
        }),
        concept({
          order: 30,
          title: "Stack Trace",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "ler a pilha de chamadas no ponto da falha — é uma renderização do call stack",
          collision: "≠ Call Stack (Epic 01 / Memory & Runtime) · ≠ Stack ADT (Epic 01 / Data Structures)",
          summary:
            "A pilha de chamadas capturada no momento exato de uma falha — uma renderização legível do Call " +
            "Stack que mostra, função por função, o caminho que levou até o erro.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um stack trace é a lista de chamadas de função ativas no momento em que um erro ocorreu, da " +
                "mais recente (onde o erro aconteceu) até a mais antiga (o ponto de entrada que iniciou toda a " +
                "cadeia). É, na prática, uma fotografia do call stack naquele instante — cada linha mostra uma " +
                "função, e geralmente o arquivo e o número da linha onde ela chamou a próxima.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um stack trace mostra a cadeia exata de chamadas até o ponto da falha — uma renderização " +
                "gratuita do call stack no momento do erro, que transforma \"algo deu errado\" em \"isto deu " +
                "errado, chamado por isto, chamado por isto\".",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando um erro acontece, saber só \"deu erro\" é quase inútil — o stack trace responde \"onde " +
                "exatamente, e por qual caminho de chamadas chegou até lá\". Ele existe porque o runtime já " +
                "mantém essa informação naturalmente (é o próprio call stack em execução); capturá-la no " +
                "momento da falha é essencialmente gratuito, e economiza a etapa de adivinhar manualmente qual " +
                "função poderia ter causado o problema.",
            },
            {
              type: "paragraph",
              text:
                "Ler um stack trace de baixo para cima (ou de cima para baixo, dependendo da linguagem) revela " +
                "a cadeia causal: a função no topo é onde o erro estourou, mas a causa raiz pode estar várias " +
                "chamadas abaixo — quem passou um dado inválido para quem, e de onde esse dado veio.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um erro lançado em uma função chamada por outras duas, e o stack trace resultante:" },
            {
              type: "code",
              language: "javascript",
              filename: "app.js",
              code: [
                "function parseAge(value) {",
                "  if (typeof value !== \"number\") {",
                "    throw new Error(\"idade deve ser um número\");",
                "  }",
                "  return value;",
                "}",
                "",
                "function buildUserProfile(data) {",
                "  return { name: data.name, age: parseAge(data.age) };",
                "}",
                "",
                "function handleUserRequest(request) {",
                "  return buildUserProfile(request.body);",
                "}",
                "",
                "// Stack trace resultante ao chamar handleUserRequest({ body: { name: \"Ana\", age: \"30\" } }):",
                "// Error: idade deve ser um número",
                "//     at parseAge (app.js:3)",
                "//     at buildUserProfile (app.js:9)",
                "//     at handleUserRequest (app.js:13)",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "O stack trace mostra exatamente o caminho: o erro estourou em parseAge (linha 3), chamada por " +
                "buildUserProfile (linha 9), chamada por handleUserRequest (linha 13). Sem essa informação, " +
                "seria preciso adivinhar em qual das três funções (ou em outra parte do sistema) o problema começou.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Ao investigar uma exceção, para ver a cadeia de chamadas até o ponto da falha.",
                "Para decidir onde colocar o primeiro breakpoint.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Mostra onde o erro foi lançado, não necessariamente onde a causa está; o valor errado pode ter vindo de antes.",
                "Em código assíncrono, a pilha pode não mostrar quem iniciou a operação.",
              ],
            },
          ],
          examples: [
            {
              title: "Lendo um stack trace de bibliotecas de terceiros",
              context: "Nem toda linha de um stack trace é código próprio — algumas vêm de dependências.",
              code: {
                language: "javascript",
                filename: "trace-example.txt",
                code: ["// TypeError: Cannot read properties of undefined (reading 'map')", "//     at formatItems (utils.js:12)", "//     at node_modules/lodash/lodash.js:5432", "//     at renderList (components.js:8)"].join("\n"),
              },
              explanation:
                "A linha do meio vem de uma biblioteca (lodash) — geralmente o foco de investigação está nas " +
                "linhas de código próprio (formatItems, renderList), já que o bug quase sempre está em como a " +
                "biblioteca foi chamada, não na biblioteca em si.",
            },
            {
              title: "Stack trace de uma exceção assíncrona",
              context: "Código assíncrono pode produzir stack traces menos óbvios, cortados no ponto onde o await aconteceu.",
              code: {
                language: "javascript",
                filename: "fetch-user.js",
                code: [
                  "async function fetchUserData(id) {",
                  "  const response = await fetch(`/users/${id}`);",
                  "  return response.json();",
                  "}",
                  "// Stack trace de um erro de rede pode mostrar só fetchUserData,",
                  "// sem quem a chamou originalmente — depende do runtime e das flags de stack trace assíncrono",
                ].join("\n"),
              },
              explanation:
                "Stack traces assíncronos às vezes perdem parte da cadeia de chamada original por causa de como " +
                "promises são agendadas — algumas ferramentas (e flags do runtime) existem justamente para " +
                "preservar esse contexto.",
            },
            {
              title: "Usando o stack trace para decidir onde colocar o primeiro breakpoint",
              context: "O stack trace é frequentemente o ponto de partida para uma sessão de debugging com breakpoints.",
              code: {
                language: "javascript",
                filename: "pricing.js",
                code: ["// Stack trace aponta para calculateDiscount (pricing.js:45)", "// Próximo passo: colocar um breakpoint ali, não em todo o arquivo", "function calculateDiscount(price, percent) {", "  debugger; // dentro de calculateDiscount, no ponto indicado pelo stack trace", "  return price - price * (percent / 100);", "}"].join("\n"),
              },
              explanation:
                "Em vez de colocar breakpoints espalhados por todo o código, o stack trace já indica exatamente " +
                "onde a execução estava — o ponto natural para começar a inspecionar variáveis com Breakpoints.",
            },
          ],
          exercise: {
            problem:
              "O stack trace abaixo foi capturado, mas a pessoa investigando só olhou a primeira linha e " +
              "concluiu (errado) que o bug está em validateInput.",
            problemCode: {
              language: "javascript",
              filename: "trace.txt",
              code: ["// Error: Cannot convert undefined to a number", "//     at validateInput (validators.js:20)", "//     at processOrder (orders.js:15)", "//     at handleCheckoutRequest (checkout.js:8)"].join("\n"),
            },
            task:
              "Interprete o stack trace completo e escreva, em código, qual das três funções provavelmente " +
              "causou o valor undefined que chegou até validateInput — não apenas onde o erro estourou.",
            hint: "O erro estoura onde o valor inválido é finalmente usado, mas a causa costuma estar mais acima na cadeia — em quem produziu ou passou adiante esse valor.",
            solution: {
              code: {
                language: "javascript",
                filename: "checkout.js",
                code: [
                  "function handleCheckoutRequest(request) {",
                  "  // Se request.body.quantity não existir, processOrder recebe undefined",
                  "  // e repassa para validateInput sem checar antes.",
                  "  return processOrder(request.body);",
                  "}",
                  "",
                  "function processOrder(orderData) {",
                  "  return validateInput(orderData.quantity); // não verifica se quantity existe",
                  "}",
                ].join("\n"),
              },
              explanation:
                "O stack trace mostra onde o erro estourou (validateInput), mas a causa provável está em " +
                "handleCheckoutRequest ou processOrder não terem garantido que quantity existia antes de " +
                "repassá-lo — ler a cadeia inteira, não só o topo, é o que revela onde o valor inválido de fato se originou.",
            },
          },
        }),
        concept({
          order: 40,
          title: "Breakpoints",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "pausar a execução para inspecionar estado/frames. Complementa Stack Trace",
          summary:
            "Um ponto marcado no código onde a execução pausa completamente, permitindo inspecionar o valor de " +
            "cada variável e o estado exato do programa naquele instante — sem precisar prever de antemão o que " +
            "um print mostraria.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Um breakpoint é um ponto marcado numa linha de código onde, ao rodar sob um debugger, a " +
                "execução para completamente. Com o programa pausado, é possível inspecionar o valor de " +
                "qualquer variável visível naquele escopo, percorrer o call stack completo (ver o estado de " +
                "cada função que chamou a atual), e avançar a execução linha por linha (step) para observar " +
                "exatamente como o estado muda.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Um breakpoint pausa a execução num ponto exato, dando acesso completo ao estado do programa " +
                "naquele instante — a ferramenta certa para observar como e por que um valor chega errado, não " +
                "só onde um erro foi lançado.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Um stack trace mostra onde um erro já aconteceu, depois do fato; um breakpoint permite " +
                "observar o estado antes e durante a execução, mesmo quando não há erro nenhum lançado — útil " +
                "para entender por que um valor está errado silenciosamente, sem lançar exceção alguma. Também " +
                "elimina a necessidade de adivinhar antecipadamente que um print mostraria algo útil: o " +
                "debugger dá acesso a tudo que está no escopo, não só ao que alguém pensou em imprimir.",
            },
            {
              type: "paragraph",
              text:
                "Breakpoints complementam o stack trace: depois de ler um stack trace e identificar a linha " +
                "suspeita, colocar um breakpoint ali (em vez de em todo o arquivo) foca a investigação " +
                "exatamente onde é mais provável que a causa esteja, sem gastar tempo pausando em código irrelevante.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "um breakpoint colocado dentro de uma função para inspecionar por que um cálculo dá resultado errado:" },
            {
              type: "code",
              language: "javascript",
              filename: "discount.js",
              code: [
                "function calculateDiscount(price, percent) {",
                "  const discountAmount = price * (percent / 100);",
                "  debugger; // execução pausa aqui quando rodado com um debugger anexado",
                "  return price - discountAmount;",
                "}",
                "",
                "calculateDiscount(100, 20);",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A instrução debugger pausa a execução exatamente naquele ponto, quando rodada com as " +
                "ferramentas de desenvolvedor (ou um debugger de IDE) conectadas. Com a execução parada, é " +
                "possível inspecionar price, percent e discountAmount ao mesmo tempo, ver se algum tem um valor " +
                "inesperado, e decidir se o problema está antes ou depois daquela linha.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Para observar o estado exato do programa e entender como um valor chegou errado.",
                "Com condição, quando o problema só acontece em uma iteração ou entrada específica.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Pausar a execução altera o tempo: bugs de concorrência e de timing podem desaparecer sob o depurador.",
                "Em ambientes sem depurador, como produção, logs e traces são o recurso disponível.",
              ],
            },
          ],
          examples: [
            {
              title: "Breakpoint condicional",
              context: "Um breakpoint pode ser configurado para só pausar quando uma condição específica é verdadeira, útil dentro de um loop.",
              code: {
                language: "javascript",
                filename: "process-orders.js",
                code: ["function processOrders(orders) {", "  for (const order of orders) {", "    // Breakpoint condicional configurado na IDE: só pausa quando order.total < 0", "    processOrder(order);", "  }", "}"].join("\n"),
              },
              explanation:
                "Sem um breakpoint condicional, pausar dentro de um loop de 1000 pedidos exigiria continuar " +
                "manualmente 1000 vezes até achar o pedido problemático — a condição faz o debugger pausar só " +
                "na iteração que interessa.",
            },
            {
              title: "Inspecionando o call stack inteiro a partir de um breakpoint",
              context: "Um breakpoint dá acesso não só ao escopo local, mas a todo o call stack até ali.",
              code: {
                language: "javascript",
                filename: "config-flow.js",
                code: ["function outer() {", "  const config = { retries: 3 };", "  inner(config);", "}", "", "function inner(config) {", "  debugger; // aqui, a IDE mostra também o frame de outer() e o valor de config lá", "  return config.retries * 2;", "}"].join("\n"),
              },
              explanation:
                "Parado dentro de inner, um debugger permite navegar para o frame de outer e ver o valor de " +
                "config naquele escopo também — útil para entender de onde um argumento veio, sem precisar " +
                "adicionar logs manualmente em cada função.",
            },
            {
              title: "Step over vs. step into",
              context: "Debugadores oferecem controle fino sobre como avançar a partir de um breakpoint.",
              code: {
                language: "javascript",
                filename: "payment.js",
                code: [
                  "function processPayment(order) {",
                  "  debugger;",
                  "  const total = calculateTotal(order); // step over: executa e vai para a próxima linha",
                  "                                         // step into: entra dentro de calculateTotal",
                  "  chargeCard(total);",
                  "}",
                ].join("\n"),
              },
              explanation:
                "step over executa calculateTotal inteira de uma vez e para na linha seguinte; step into entra " +
                "dentro da função para observar seu comportamento interno passo a passo — a escolha depende de " +
                "onde a suspeita da causa está.",
            },
          ],
          exercise: {
            problem:
              "Um relatório de vendas mostra um total errado, sem lançar nenhum erro — o código roda até o fim " +
              "silenciosamente com o valor incorreto. Não há stack trace, porque nada quebrou.",
            problemCode: {
              language: "javascript",
              filename: "report-total.js",
              code: ["function calculateReportTotal(sales) {", "  let total = 0;", "  for (const sale of sales) {", "    total += sale.amount;", "  }", "  return total; // valor final está errado, mas nenhuma exceção foi lançada", "}"].join("\n"),
            },
            task:
              "Escreva onde colocar um breakpoint (debugger;) e mostre em código o que inspecionar para " +
              "descobrir por que o total está incorreto, já que não há erro lançado para gerar um stack trace.",
            hint: "Sem erro lançado, o breakpoint precisa ficar dentro do loop, não depois dele — para observar o valor de sale.amount a cada iteração e achar a iteração onde algo estranho acontece.",
            solution: {
              code: {
                language: "javascript",
                filename: "report-total.js",
                code: ["function calculateReportTotal(sales) {", "  let total = 0;", "  for (const sale of sales) {", "    debugger; // pausa a cada iteração — inspecionar sale.amount e total aqui", "    total += sale.amount;", "  }", "  return total;", "}"].join("\n"),
              },
              explanation:
                "Colocar o breakpoint dentro do loop permite inspecionar sale.amount a cada iteração — " +
                "revelando, por exemplo, que um sale.amount é uma string (\"10\") em vez de número, o que faria " +
                "total += sale.amount concatenar em vez de somar em algumas iterações, sem nunca lançar um erro.",
            },
          },
        }),
        concept({
          order: 50,
          title: "Binary Search Debugging",
          requires: ["Programming Foundations / Algorithms & Complexity / Binary Search", "Hypothesis-Driven Debugging"],
          note: "bisseccionar o espaço de código/entrada para localizar",
          summary:
            "Localizar a causa de um bug bisseccionando repetidamente o espaço de possibilidades — código, " +
            "histórico ou dados — em vez de inspecionar tudo sequencialmente do início ao fim.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Binary Search Debugging aplica a mesma ideia de Binary Search (Área 1, Algorithms & " +
                "Complexity) para localizar a causa de um bug: em vez de investigar sequencialmente do início " +
                "ao fim de um trecho grande de código (ou de um conjunto grande de dados), você testa o ponto " +
                "médio, decide de que lado está o problema, e repete só naquela metade — reduzindo o espaço de " +
                "busca pela metade a cada passo.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Binary Search Debugging bisseciona o espaço de possibilidades — código, histórico de commits, " +
                "ou dados — testando o meio a cada passo, reduzindo uma investigação sequencial de N passos " +
                "para log₂(N) testes.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Investigar sequencialmente uma função de 500 linhas, ou um histórico de 1000 commits, um por " +
                "um, é lento e desnecessário quando existe uma forma de testar se o problema está \"antes\" ou " +
                "\"depois\" de um ponto específico. Bisseccionar reduz um espaço de N possibilidades a log₂(N) " +
                "testes — 1000 commits, por exemplo, levam no máximo 10 verificações para isolar o culpado, não 1000.",
            },
            {
              type: "paragraph",
              text:
                "A técnica exige uma forma de \"testar o meio e saber de que lado está o problema\" — " +
                "normalmente através de uma reprodução confiável (Reproduction) combinada com uma hipótese " +
                "sobre o formato da falha (Hypothesis-Driven Debugging): \"se o bug estiver antes deste ponto, " +
                "X deveria falhar; se estiver depois, X deveria passar\".",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "isolando qual das várias etapas de um pipeline de processamento introduz um dado corrompido:" },
            {
              type: "code",
              language: "javascript",
              filename: "pipeline.debug.js",
              code: [
                "function pipeline(data) {",
                "  const step1 = normalize(data);",
                "  const step2 = deduplicate(step1);",
                "  const step3 = enrich(step2);",
                "  const step4 = validate(step3);",
                "  return step4;",
                "}",
                "",
                "// Em vez de inspecionar as 4 etapas em ordem, testar o ponto médio primeiro:",
                "function testMidpoint(data) {",
                "  const afterStep2 = deduplicate(normalize(data));",
                "  console.log(isDataValid(afterStep2)); // true: problema em enrich/validate",
                "                                          // false: problema em normalize/deduplicate",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Em vez de checar normalize, depois deduplicate, depois enrich, depois validate em sequência, " +
                "testMidpoint verifica o estado depois da segunda etapa — o \"meio\" do pipeline. Um único " +
                "teste já elimina metade das possibilidades, restando investigar só duas etapas em vez de quatro.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando o espaço de busca é grande e ordenado, como um arquivo, um dataset ou um histórico, e é possível " +
                "testar o meio.",
                "Para reduzir N passos de inspeção a cerca de log₂(N) testes.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Precisa de um teste que separe \"bom\" de \"ruim\" de forma confiável; um bug intermitente engana a busca.",
                "Não funciona se as partes dependem umas das outras e não podem ser isoladas.",
              ],
            },
          ],
          examples: [
            {
              title: "Bisseccionando um arquivo grande de configuração",
              context: "Quando um bug some ao remover metade das configurações, o culpado está naquela metade.",
              code: {
                language: "javascript",
                filename: "config-bisect.js",
                code: ["function testWithHalfConfig(fullConfig) {", "  const firstHalf = fullConfig.slice(0, fullConfig.length / 2);", "  return runAppWithConfig(firstHalf); // bug some? culpado está na segunda metade", "}"].join("\n"),
              },
              explanation:
                "Remover metade das entradas de configuração e observar se o bug desaparece ou persiste indica " +
                "em qual metade a entrada problemática está, sem precisar remover uma por uma.",
            },
            {
              title: "Bisseccionando um dataset grande",
              context: "Um bug de processamento que só aparece com certos registros pode ser isolado dividindo o dataset ao meio repetidamente.",
              code: {
                language: "javascript",
                filename: "dataset-bisect.js",
                code: ["function testWithFirstHalf(records) {", "  const half = records.slice(0, Math.floor(records.length / 2));", "  return processRecords(half); // ainda falha? o registro problemático está aqui", "}"].join("\n"),
              },
              explanation:
                "Dividir um dataset de 10.000 registros em metades sucessivas até isolar um único registro " +
                "problemático leva cerca de 14 testes (log₂ 10000 ≈ 14), muito menos que inspecionar registro " +
                "por registro.",
            },
            {
              title: "Bisseccionando código comentando metade dele",
              context: "Quando não há uma forma óbvia de dividir o problema, comentar temporariamente metade de uma sequência de operações é uma forma direta de bissecção.",
              code: {
                language: "javascript",
                filename: "code-bisect.js",
                code: [
                  "function suspiciousFunction(input) {",
                  "  const a = stepOne(input);",
                  "  const b = stepTwo(a);",
                  "  // const c = stepThree(b); // comentado temporariamente",
                  "  // const d = stepFour(c);",
                  "  return b; // se o bug some aqui, ele está em stepThree ou stepFour",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Comentar a segunda metade das operações e observar se o problema desaparece localiza o bug na " +
                "metade removida, sem precisar entender ainda o que cada etapa faz.",
            },
          ],
          exercise: {
            problem:
              "Uma função de renderização com 12 etapas sequenciais produz uma imagem corrompida. Investigar " +
              "etapa por etapa (12 verificações manuais) seria lento.",
            problemCode: {
              language: "javascript",
              filename: "render.js",
              code: [
                "function render(scene) {",
                "  const s1 = loadAssets(scene);",
                "  const s2 = applyLighting(s1);",
                "  const s3 = applyShadows(s2);",
                "  const s4 = applyTextures(s3);",
                "  const s5 = applyReflections(s4);",
                "  const s6 = applyPostProcessing(s5);",
                "  // ... mais 6 etapas até s12",
                "  return s12;",
                "}",
              ].join("\n"),
            },
            task:
              "Escreva o primeiro teste de bissecção que reduziria o espaço de 12 etapas pela metade, e explique " +
              "o que cada resultado possível indicaria.",
            hint: "O ponto médio de 12 etapas é a etapa 6 — testar o estado logo depois dela decide se o problema está nas 6 primeiras ou nas 6 últimas.",
            solution: {
              code: {
                language: "javascript",
                filename: "render.debug.js",
                code: [
                  "function testAfterStep6(scene) {",
                  "  const s1 = loadAssets(scene);",
                  "  const s2 = applyLighting(s1);",
                  "  const s3 = applyShadows(s2);",
                  "  const s4 = applyTextures(s3);",
                  "  const s5 = applyReflections(s4);",
                  "  const s6 = applyPostProcessing(s5);",
                  "  console.log(isImageValid(s6));",
                  "  // true  → problema está nas etapas 7-12",
                  "  // false → problema está nas etapas 1-6",
                  "}",
                ].join("\n"),
              },
              explanation:
                "Um único teste no ponto médio (depois da etapa 6) já elimina metade das 12 etapas — restando 6 " +
                "candidatas, não 12. Repetir a bissecção nessa metade restante leva a isolar a etapa exata em " +
                "cerca de 4 testes no total, em vez de até 12.",
            },
          },
        }),
        concept({
          order: 60,
          title: "Git Bisect",
          requires: ["Binary Search Debugging", "Software Craft / Git"],
          note: "busca binária automatizada sobre o histórico de commits. Canônico aqui — Bisect no Epic 03 / Git é revisita/referência",
          summary:
            "A busca binária automatizada sobre o histórico de commits: em vez de bisseccionar código ou dados " +
            "manualmente, o Git testa commits sucessivos até isolar exatamente qual commit introduziu um bug.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "git bisect é uma ferramenta do Git que aplica Binary Search Debugging diretamente sobre o " +
                "histórico de commits. Você informa um commit \"bom\" (onde o bug não existia) e um commit " +
                "\"ruim\" (onde o bug existe); o Git faz checkout automaticamente do commit no meio desse " +
                "intervalo, você testa se o bug está presente ali, informa o resultado (good ou bad), e o Git " +
                "bissecciona de novo — repetindo até isolar o commit exato que introduziu o problema.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "git bisect automatiza Binary Search Debugging sobre o histórico de commits: informa um bom e " +
                "um mau, testa o meio repetidamente, e isola o commit exato que introduziu o bug em log₂(N) passos.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Quando um bug aparece depois de um período sem investigação (\"isso funcionava semana " +
                "passada\"), e o histórico de commits entre então e agora tem centenas de mudanças, procurar " +
                "manualmente qual commit causou o problema seria proibitivamente lento. git bisect automatiza " +
                "exatamente o processo de bissecção — reduzindo, por exemplo, 500 commits candidatos a cerca de " +
                "9 testes (log₂ 500 ≈ 9).",
            },
            {
              type: "paragraph",
              text:
                "O requisito para usar git bisect de forma eficiente é ter uma forma rápida e confiável de " +
                "testar se um commit específico tem o bug — idealmente um teste automatizado que passa/falha " +
                "(conectando de volta com Reproduction). Com git bisect run, esse teste pode até ser executado " +
                "automaticamente a cada passo, sem intervenção manual nenhuma.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma sessão de git bisect isolando o commit que introduziu uma regressão:" },
            {
              type: "code",
              language: "javascript",
              filename: "bisect-session.js",
              code: [
                "// No terminal (comandos git, não JavaScript):",
                "// git bisect start",
                "// git bisect bad HEAD              // o commit atual tem o bug",
                "// git bisect good v1.2.0           // essa tag antiga não tinha o bug",
                "// (o Git faz checkout do commit do meio automaticamente)",
                "// git bisect good                  // ou \"git bisect bad\", conforme o teste manual",
                "// ... repete até o Git apontar o commit exato ...",
                "// git bisect reset                 // volta para o HEAD original",
                "",
                "function isBugPresent() {",
                "  const result = calculateDiscount(100, 50);",
                "  return result !== 50; // true = commit ruim, false = commit bom",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "A cada passo, o Git faz checkout de um commit no meio do intervalo restante; a pessoa (ou o " +
                "script isBugPresent, via git bisect run) verifica se o bug está presente ali e informa good ou " +
                "bad. Depois de log₂(N) testes, o Git aponta exatamente qual commit introduziu o problema — sem " +
                "ninguém precisar ler o diff de cada commit intermediário.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Quando um bug é uma regressão e há um commit bom conhecido no passado.",
                "Com `git bisect run` e um teste automatizado, para achar o commit sem intervenção.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Depende de commits pequenos e que compilam; commits quebrados por outros motivos exigem `git bisect skip`.",
                "Sem um teste confiável que reproduza o bug, o resultado não é confiável.",
              ],
            },
          ],
          examples: [
            {
              title: "git bisect run com um teste automatizado",
              context: "Quando existe um teste que detecta o bug, o processo inteiro pode rodar sem intervenção manual.",
              code: {
                language: "javascript",
                filename: "bisect-run.js",
                code: ["// git bisect start", "// git bisect bad HEAD", "// git bisect good v1.2.0", "// git bisect run npm test -- --grep \"discount calculation\""].join("\n"),
              },
              explanation:
                "git bisect run executa o comando de teste em cada commit candidato automaticamente, " +
                "interpretando exit code 0 como good e diferente de 0 como bad — o Git isola o commit culpado " +
                "sem nenhuma verificação manual.",
            },
            {
              title: "Marcando um commit como 'skip' quando não é testável",
              context: "Alguns commits intermediários podem não compilar ou não serem testáveis por razões alheias ao bug investigado.",
              code: {
                language: "javascript",
                filename: "bisect-skip.js",
                code: ["// git bisect skip", "// (usado quando o commit atual não pode ser testado — build quebrado por outro motivo)"].join("\n"),
              },
              explanation:
                "git bisect skip avisa o Git para escolher outro ponto médio próximo, sem invalidar a bissecção " +
                "em andamento — útil quando um commit específico está temporariamente quebrado por um motivo " +
                "não relacionado ao bug procurado.",
            },
            {
              title: "Bisect encontrando o commit e sua mensagem",
              context: "Ao final, o Git aponta o commit específico, com hash e mensagem, pronto para investigação do diff.",
              code: {
                language: "javascript",
                filename: "bisect-result.js",
                code: ["// Saída final típica do git bisect:", "// a3f9c21 is the first bad commit", "// commit a3f9c21", "// Author: ...", "// Date: ...", "//     fix: simplify discount rounding logic"].join("\n"),
              },
              explanation:
                "A mensagem do commit encontrado (\"simplify discount rounding logic\") já é uma pista forte da " +
                "causa — o próximo passo natural é olhar o diff exato desse commit para confirmar a hipótese.",
            },
          ],
          exercise: {
            problem:
              "Um bug de performance apareceu em algum ponto dos últimos 200 commits, mas ninguém sabe qual. " +
              "Existe um script de benchmark (npm run benchmark) que sai com código diferente de zero quando a " +
              "performance está abaixo do esperado.",
            task: "Escreva a sequência de comandos git bisect (incluindo bisect run) que isolaria automaticamente o commit responsável, usando esse benchmark.",
            hint: "git bisect run aceita qualquer comando que termine com exit code 0 (bom) ou diferente de zero (ruim) — o benchmark já se comporta assim.",
            solution: {
              code: {
                language: "javascript",
                filename: "bisect-perf.js",
                code: [
                  "// git bisect start",
                  "// git bisect bad HEAD",
                  "// git bisect good HEAD~200",
                  "// git bisect run npm run benchmark",
                  "// (o Git testa automaticamente commits sucessivos, interpretando",
                  "//  o exit code do benchmark, até isolar o commit culpado)",
                  "// git bisect reset",
                ].join("\n"),
              },
              explanation:
                "Como o benchmark já sinaliza sucesso/falha via exit code, git bisect run automatiza todo o " +
                "processo — sem precisar rodar manualmente o benchmark em cada um dos possíveis ~8 commits " +
                "candidatos (log₂ 200 ≈ 8) até chegar ao culpado.",
            },
          },
        }),
        concept({
          order: 70,
          title: "Root Cause Analysis",
          requires: ["Hypothesis-Driven Debugging"],
          note: "ir além do sintoma; 5 Whys — teste de hipótese iterativo",
          revisit: ["Platform / Reliability Engineering"],
          summary:
            "Continuar investigando além do primeiro sintoma óbvio até chegar à causa real e mais profunda de " +
            "um problema — perguntando \"por quê\" repetidamente em vez de corrigir só o que aparece na superfície.",
          content: [
            { type: "heading", text: "Conceito" },
            {
              type: "paragraph",
              text:
                "Root Cause Analysis (RCA) é a prática de não parar a investigação no primeiro sintoma " +
                "encontrado, mas continuar perguntando \"por que isso aconteceu?\" repetidamente até chegar à " +
                "causa real e mais profunda — muitas vezes uma decisão de design, um processo, ou uma suposição " +
                "incorreta, não só a linha de código onde o sintoma apareceu. A técnica dos \"5 Whys\" é a " +
                "versão mais conhecida: perguntar \"por quê\" cinco vezes seguidas, cada resposta alimentando a " +
                "próxima pergunta.",
            },
            {
              type: "callout",
              title: "Ideia principal",
              text:
                "Root Cause Analysis vai além do sintoma perguntando \"por quê\" repetidamente até chegar a uma " +
                "causa acionável e profunda o bastante para que corrigi-la evite a recorrência — não só faça o " +
                "sintoma atual desaparecer.",
            },
            { type: "heading", text: "Por que importa" },
            {
              type: "paragraph",
              text:
                "Corrigir só o sintoma mais visível de um bug frequentemente deixa a causa real intacta — o " +
                "mesmo problema reaparece de outra forma, ou em outro lugar do sistema, mais tarde. RCA existe " +
                "para que uma correção resolva o problema de verdade, não apenas faça o sintoma imediato desaparecer.",
            },
            {
              type: "paragraph",
              text:
                "RCA é, na prática, Hypothesis-Driven Debugging aplicado de forma iterativa e mais ampla: cada " +
                "\"por quê\" é uma nova hipótese sobre uma causa mais profunda, testada contra a evidência " +
                "disponível, até que a cadeia de causas pare em algo que, se corrigido, realmente impede a " +
                "recorrência — não necessariamente em exatamente cinco perguntas; o número é uma heurística, " +
                "não uma regra rígida.",
            },
            { type: "heading", text: "Na prática" },
            { type: "paragraph", text: "uma cadeia de \"por quês\" partindo de um sintoma até uma causa raiz acionável:" },
            {
              type: "code",
              language: "javascript",
              filename: "rca.js",
              code: [
                "// Sintoma: o servidor caiu às 3h da manhã.",
                "// Por quê? -> Ficou sem memória (OutOfMemoryError).",
                "// Por quê ficou sem memória? -> Um cache cresceu sem limite.",
                "// Por quê o cache cresceu sem limite? -> Nunca havia política de expiração configurada.",
                "// Por quê não havia política de expiração? -> Não fazia parte do checklist de code review.",
                "// CAUSA RAIZ ACIONÁVEL: adicionar verificação de política de expiração",
                "// ao checklist de code review para qualquer cache novo.",
                "",
                "function cacheReviewChecklist() {",
                "  return [\"tem limite de tamanho?\", \"tem política de expiração (TTL)?\", \"é thread-safe?\"];",
                "}",
              ].join("\n"),
            },
            {
              type: "paragraph",
              text:
                "Corrigir só o sintoma imediato (reiniciar o servidor, ou até só limitar o tamanho daquele " +
                "cache específico) deixaria a causa raiz intacta: nenhum processo garante que o próximo cache " +
                "criado por outra pessoa também terá uma política de expiração. A causa raiz encontrada — falta " +
                "de um item no checklist de revisão — é o que, corrigido, evita a recorrência em qualquer cache " +
                "futuro, não só neste.",
            },
            { type: "heading", text: "Quando usar" },
            {
              type: "list",
              items: [
                "Depois de incidentes e bugs recorrentes, para corrigir a causa e não só o sintoma.",
                "Registrada num post-mortem, para que a equipe aprenda com o problema.",
              ],
            },
            { type: "heading", text: "Quando não usar / Limitações" },
            {
              type: "list",
              items: [
                "Parar cedo demais, no primeiro sintoma, deixa o problema voltar; parar tarde demais leva a causas fora do " +
                "seu alcance.",
                "Nem todo bug pequeno justifica uma análise formal; ajuste o esforço ao impacto.",
              ],
            },
          ],
          examples: [
            {
              title: "Parando cedo demais (contra-exemplo)",
              context: "Parar na primeira resposta é o erro mais comum ao tentar aplicar RCA.",
              code: {
                language: "javascript",
                filename: "shallow-rca.js",
                code: ["// Sintoma: usuário não conseguiu fazer login.", "// Por quê? -> A senha estava incorreta.", "// CORREÇÃO (insuficiente): resetar a senha do usuário.", "// Isso resolve o caso individual, mas não investiga", "// se há um padrão maior (ex.: UX de senha confuso levando a muitos resets)."].join("\n"),
              },
              explanation:
                "Parar em \"a senha estava incorreta\" resolve o ticket individual, mas se dezenas de usuários " +
                "erram a senha pelo mesmo motivo (um requisito de senha mal comunicado, por exemplo), a causa " +
                "real do problema recorrente nunca é investigada.",
            },
            {
              title: "5 Whys aplicado a uma falha de deploy",
              context: "A técnica funciona também para incidentes de infraestrutura, não só bugs de código.",
              code: {
                language: "javascript",
                filename: "deploy-rca.js",
                code: ["// Por quê o deploy falhou? -> A migration de banco deu timeout.", "// Por quê deu timeout? -> A tabela tinha 50 milhões de linhas e faltava um índice.", "// Por quê faltava o índice? -> A migration foi testada só em ambiente de dev, com poucos dados.", "// CAUSA RAIZ: ambiente de teste de migrations não reflete volume de produção."].join("\n"),
              },
              explanation:
                "A cadeia de \"por quês\" chega a uma causa estrutural (ambiente de teste não representativo) " +
                "que, corrigida, evita futuras migrations com o mesmo tipo de falha — não só resolve o deploy " +
                "travado daquela vez.",
            },
            {
              title: "RCA registrado como parte de um post-mortem",
              context: "O resultado de uma RCA geralmente vira um documento reutilizável, não só uma correção silenciosa.",
              code: {
                language: "javascript",
                filename: "post-mortem.js",
                code: ["const postMortem = {", "  symptom: \"servidor caiu às 3h\",", "  rootCause: \"checklist de code review não cobria política de expiração de cache\",", "  actionItems: [\"atualizar checklist\", \"adicionar alerta de crescimento de memória\"],", "};"].join("\n"),
              },
              explanation:
                "Documentar a causa raiz (não só o sintoma) permite que o time inteiro aprenda com o incidente, " +
                "e os actionItems focam em prevenir a classe do problema, não só consertar a instância " +
                "específica que já aconteceu.",
            },
          ],
          exercise: {
            problem:
              "Um time corrigiu um bug de \"pedido duplicado\" simplesmente adicionando uma checagem de " +
              "duplicidade na função de criar pedido, sem investigar por que o pedido estava sendo enviado " +
              "duas vezes em primeiro lugar.",
            problemCode: {
              language: "javascript",
              filename: "create-order.js",
              code: ["function createOrder(orderData) {", "  if (recentDuplicateExists(orderData)) return null; // corrige o sintoma", "  return saveOrder(orderData);", "}"].join("\n"),
            },
            task:
              "Aplique a técnica dos 5 Whys (em comentário de código) para investigar a causa raiz provável de " +
              "pedidos duplicados serem enviados, além do sintoma já corrigido, e proponha uma correção estrutural.",
            hint: "A pergunta \"por que o pedido foi enviado duas vezes\" provavelmente leva ao frontend, não ao backend — considere cliques duplos, retries automáticos, ou falta de desabilitar o botão após o clique.",
            solution: {
              code: {
                language: "javascript",
                filename: "submit-button.js",
                code: [
                  "// Por quê pedidos duplicados chegavam ao backend?",
                  "//   -> O botão \"Finalizar Compra\" permitia múltiplos cliques.",
                  "// Por quê o botão permitia múltiplos cliques?",
                  "//   -> Não havia lógica de desabilitar o botão após o primeiro clique.",
                  "// Por quê essa lógica não existia?",
                  "//   -> Não fazia parte do padrão de componentes de formulário do time.",
                  "// CAUSA RAIZ: falta de um padrão de componente reutilizável para",
                  "// botões de submit que previna duplo clique.",
                  "",
                  "function createSubmitButton(onClick) {",
                  "  let isSubmitting = false;",
                  "  return async function handleClick() {",
                  "    if (isSubmitting) return;",
                  "    isSubmitting = true;",
                  "    await onClick();",
                  "    isSubmitting = false;",
                  "  };",
                  "}",
                ].join("\n"),
              },
              explanation:
                "A checagem de duplicidade no backend continua sendo uma boa defesa, mas a causa raiz (falta de " +
                "proteção contra duplo clique na UI) é o que, corrigido de forma reutilizável, evita a classe " +
                "inteira de problemas — não só pedidos, mas qualquer formulário futuro que sofresse do mesmo " +
                "padrão de duplo clique.",
            },
          },
        }),
      ],
    }),
  ],
});
