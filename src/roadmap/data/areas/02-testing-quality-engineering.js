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
            "Verificar automaticamente que a menor unidade de comportamento — uma função, um método — faz o que " +
            "deveria, isolada de rede, banco de dados ou UI, e em milissegundos.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Unit Testing é a prática de escrever código que executa uma unidade pequena e isolada do sistema " +
                "— tipicamente uma função ou método — e verifica automaticamente se o resultado bate com o " +
                "esperado. \"Unidade\" aqui não é um tamanho fixo: é o menor pedaço de comportamento que faz " +
                "sentido testar sozinho, sem depender de colaboradores externos como banco de dados, rede ou " +
                "sistema de arquivos.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Unit Testing isola a menor unidade de comportamento e verifica automaticamente se ela continua " +
                "correta — rápido o bastante para rodar a cada mudança, e preciso o bastante para apontar " +
                "exatamente o que quebrou.",
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
            "A verificação atômica que compara um valor real com um valor esperado e decide, sozinha, se aquele " +
            "pedaço do teste passa ou falha — o bloco de construção sobre o qual todo teste automatizado é montado.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma assertion é uma instrução que afirma que algo deveria ser verdade — normalmente que um valor " +
                "real (o que o código produziu) é igual a um valor esperado (o que deveria ter produzido). Se a " +
                "afirmação é verdadeira, nada acontece; se é falsa, a assertion lança um erro que interrompe o " +
                "teste e o marca como falho.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Uma assertion compara um valor real com o esperado e falha ruidosamente quando eles divergem — é " +
                "o mecanismo atômico de pass/fail sobre o qual todo teste automatizado é construído.",
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
          summary:
            "As três fases universais de um teste de unidade: preparar o cenário (Arrange), executar a ação sob " +
            "teste (Act) e verificar o resultado (Assert) — sempre nessa ordem, sempre separadas.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Arrange-Act-Assert (AAA) é um padrão que divide o corpo de um teste em três blocos sequenciais e " +
                "claramente separados: Arrange prepara tudo que o teste precisa (dados, objetos, dublês); Act " +
                "executa a única ação que está sendo testada; Assert verifica se o resultado da ação é o esperado.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "AAA separa um teste em preparar, executar e verificar — a mesma sequência em todo teste, o que " +
                "torna qualquer teste legível de relance, mesmo por quem nunca o viu antes.",
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
            "A mesma estrutura de três fases do Arrange-Act-Assert, na fraseologia do Behavior-Driven Development: " +
            "dado um contexto (Given), quando uma ação acontece (When), então um resultado é esperado (Then).",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Given-When-Then é uma forma de descrever um teste em três frases: Given estabelece o contexto " +
                "inicial (\"dado que o carrinho tem dois itens\"), When descreve a ação (\"quando o usuário remove " +
                "um item\"), Then descreve o resultado esperado (\"então o carrinho tem um item\"). " +
                "Estruturalmente é a mesma ideia de Arrange-Act-Assert — a diferença é o vocabulário, voltado " +
                "para descrever comportamento em linguagem próxima da de negócio.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Given-When-Then é Arrange-Act-Assert com outro nome, pensado para ler como uma especificação de " +
                "comportamento em linguagem de negócio — útil quando o teste também documenta um requisito.",
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
          summary:
            "O estado ou conjunto de dados conhecido e fixo que um teste precisa existir antes de rodar — o " +
            "cenário reutilizável que o bloco Arrange constrói (ou reconstrói) a cada execução.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Uma fixture é o estado base sobre o qual um teste roda: um objeto pré-configurado, um conjunto " +
                "de registros num banco de teste, um arquivo temporário — qualquer coisa que o teste espera " +
                "encontrar pronta antes de começar. \"Fixture\" tanto se refere ao dado em si quanto ao código " +
                "que o prepara (e, às vezes, o desfaz depois).",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Uma fixture é o estado conhecido e reutilizável que um teste assume como ponto de partida — " +
                "construída (e, quando necessário, desfeita) de forma consistente para que cada teste comece do " +
                "mesmo lugar, isolado dos demais.",
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
            "A ferramenta que descobre os arquivos de teste, executa cada um isoladamente, coleta o resultado de " +
            "cada assertion e reporta o que passou, o que falhou e por quê — a maquinaria que transforma testes " +
            "soltos em uma suíte executável.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um test runner é o programa que encontra os arquivos/funções de teste num projeto (geralmente " +
                "por convenção de nome, como *.test.js), executa cada um, captura o resultado das assertions " +
                "dentro dele, e produz um relatório: quantos passaram, quantos falharam, e a mensagem de erro de " +
                "cada falha. Jest, Vitest, JUnit e pytest são exemplos de test runners.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um test runner descobre, executa isoladamente e reporta o resultado de cada teste — é a camada " +
                "de infraestrutura que transforma um punhado de funções de teste soltas numa suíte confiável e automatizável.",
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
            "Testar como duas ou mais unidades — já testadas isoladamente — funcionam quando combinadas de " +
            "verdade: um serviço e seu banco de dados, um componente e a API que ele chama.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Integration Testing verifica que múltiplas unidades do sistema — que já passaram por unit tests " +
                "individualmente — funcionam corretamente quando conectadas entre si. Em vez de isolar uma " +
                "função com dublês, um teste de integração deixa componentes reais interagirem: um repositório " +
                "conversa com um banco de dados de verdade (ou um banco de teste), um client HTTP conversa com " +
                "uma API real.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Integration Testing verifica a fronteira entre unidades reais — sem substituir dependências por " +
                "dublês — para pegar falhas que só aparecem quando as peças se encaixam de verdade, como " +
                "incompatibilidades de schema ou de contrato.",
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
          summary:
            "Exercitar o sistema inteiro, de ponta a ponta, do jeito que um usuário real o usaria — a interface, " +
            "o backend, o banco de dados e tudo entre eles, numa única jornada.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "End-to-End (E2E) Testing verifica o sistema completo, simulando o caminho que um usuário real " +
                "percorreria: abrir a aplicação, clicar em botões, preencher formulários, esperar respostas — " +
                "tudo através da interface real, contra um backend real (ou o mais próximo disso possível). Não " +
                "há nenhuma parte do sistema substituída por dublê; é o caso limite de Integration Testing, " +
                "levado ao sistema inteiro.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "E2E Testing exercita o sistema inteiro pela ótica do usuário, sem nenhuma parte substituída — o " +
                "teste mais próximo da realidade, mas também o mais lento e caro, reservado para os fluxos mais críticos.",
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
        }),
        concept({ order: 20, title: "Dummy", isNew: true, requires: ["Test Doubles"], note: "objeto passado mas nunca usado — só preenche uma assinatura" }),
        concept({ order: 30, title: "Stub", requires: ["Test Doubles"], note: "respostas prontas, sem verificação" }),
        concept({
          order: 40,
          title: "Fake",
          requires: ["Test Doubles"],
          note: "implementação real porém simplificada (ex.: repositório em memória)",
          collision: "≠ Fake Model (AI Engineering / deck harness) — mesmo padrão, outro domínio",
        }),
        concept({ order: 50, title: "Spy", requires: ["Test Doubles"], note: "registra chamadas para asserção posterior" }),
        concept({
          order: 60,
          title: "Mock",
          requires: ["Test Doubles"],
          note: "pré-programado com expectativas; verifica interação. Conceitualmente próximo de Spy (registra + verifica) — relação, não Requires.",
          collision: "\"mock\" coloquial = qualquer dublê; aqui é o sentido preciso",
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
        concept({ order: 10, title: "Test-Driven Development", requires: ["Testing Fundamentals / Arrange-Act-Assert"], note: "disciplina test-first; por que TDD dirige o design; benefícios e custos" }),
        concept({
          order: 20,
          title: "Red-Green-Refactor",
          isNew: true,
          requires: ["Test-Driven Development"],
          note:
            "o loop concreto: teste mínimo que falha → código mínimo que passa → melhorar com a barra verde. " +
            "Passo \"Refactor\": aprofundamento posterior em Epic 03 / Software Craft / Refactoring — pointer, não Requires.",
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
        }),
        concept({
          order: 20,
          title: "Code Coverage",
          isNew: true,
          requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
          note: "% de código exercitado pelos testes. Cuidado com \"coverage as a target\" (Goodhart)",
          subtopics: ["line", "statement", "branch", "path coverage"],
          revisit: ["CI/CD Pipeline", "Software Craft / Code Review"],
        }),
        concept({
          order: 30,
          title: "Testability",
          requires: ["Test Doubles", "Programming Foundations / Programming Fundamentals / Coupling"],
          note: "propriedades do código que permitem testá-lo (seams, injeção de dependência, poucos colaboradores)",
          revisit: ["Functional Programming / Pure Functions (o caso ideal)", "Software Design / Dependency Injection & IoC (DI é aplicação da testabilidade)"],
        }),
        concept({
          order: 40,
          title: "Test Isolation",
          requires: ["Testing Fundamentals / Test Fixture", "Programming Foundations / Concurrency / Shared State"],
          note: "testes não dependem uns dos outros nem de estado compartilhado; ordem-agnósticos",
        }),
        concept({
          order: 50,
          title: "Flaky Tests",
          requires: ["Test Isolation", "Programming Foundations / Concurrency / Race Condition"],
          note: "testes não determinísticos: corrida, tempo, ordem, rede",
        }),
        concept({
          order: 60,
          title: "Regression Testing",
          requires: ["Testing Fundamentals / Unit Testing", "Testing Fundamentals / Test Runner"],
          note: "re-executar testes para impedir que bugs corrigidos voltem",
          revisit: ["AI Engineering / AI Evaluation / Regression Evaluation"],
        }),
        concept({
          order: 70,
          title: "Property-Based Testing",
          isNew: true,
          requires: ["Testing Fundamentals / Unit Testing", "Programming Foundations / Programming Fundamentals / Contract"],
          note: "gerar muitas entradas a partir de propriedades/invariantes, em vez de exemplos",
          revisit: ["Functional Programming / Pure Functions (onde funciona melhor)"],
        }),
        concept({
          order: 80,
          title: "Contract Testing",
          requires: ["Programming Foundations / Programming Fundamentals / Contract", "Testing Fundamentals / Integration Testing"],
          note: "provedor e consumidor concordam numa interface",
          collision: "≠ Contract (Epic 01 / PF) · ≠ API Contract (Platform / API)",
          revisit: ["Platform / API (API Contract)", "Architecture / Service Communication (consumer-driven contracts)"],
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
        concept({ order: 10, title: "Reproduction", requires: ["Testing Fundamentals / Unit Testing"], note: "tornar o bug confiável antes de investigar — um teste que falha é a repro ideal" }),
        concept({ order: 20, title: "Hypothesis-Driven Debugging", requires: ["Reproduction"], note: "método científico: hipótese → previsão → teste" }),
        concept({
          order: 30,
          title: "Stack Trace",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "ler a pilha de chamadas no ponto da falha — é uma renderização do call stack",
          collision: "≠ Call Stack (Epic 01 / Memory & Runtime) · ≠ Stack ADT (Epic 01 / Data Structures)",
        }),
        concept({
          order: 40,
          title: "Breakpoints",
          requires: ["Programming Foundations / Memory & Runtime / Call Stack"],
          note: "pausar a execução para inspecionar estado/frames. Complementa Stack Trace",
        }),
        concept({
          order: 50,
          title: "Binary Search Debugging",
          requires: ["Programming Foundations / Algorithms & Complexity / Binary Search", "Hypothesis-Driven Debugging"],
          note: "bisseccionar o espaço de código/entrada para localizar",
        }),
        concept({
          order: 60,
          title: "Git Bisect",
          requires: ["Binary Search Debugging", "Software Craft / Git"],
          note: "busca binária automatizada sobre o histórico de commits. Canônico aqui — Bisect no Epic 03 / Git é revisita/referência",
        }),
        concept({
          order: 70,
          title: "Root Cause Analysis",
          requires: ["Hypothesis-Driven Debugging"],
          note: "ir além do sintoma; 5 Whys — teste de hipótese iterativo",
          revisit: ["Platform / Reliability Engineering"],
        }),
      ],
    }),
  ],
});
