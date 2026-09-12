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
          summary:
            "O termo guarda-chuva para qualquer objeto que substitui uma dependência real dentro de um teste — " +
            "dummy, stub, fake, spy e mock são cinco variações dessa mesma ideia, cada uma com um propósito diferente.",
          content: [
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Test Double é qualquer objeto que substitui, dentro de um teste, uma dependência real de que o " +
                "código sob teste precisa — um banco de dados, uma API externa, um serviço de e-mail. O nome " +
                "vem de \"stunt double\" (dublê de cinema): assim como um dublê substitui o ator numa cena " +
                "perigosa, um test double substitui a dependência real num cenário onde usá-la de verdade seria " +
                "lento, instável ou impossível.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Test Double é o termo guarda-chuva para qualquer substituto de uma dependência real dentro de um " +
                "teste — dummy, stub, fake, spy e mock são cinco variações dessa mesma ideia, cada uma " +
                "emprestando só o comportamento que o teste precisa.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um dummy é um objeto que existe só para preencher um parâmetro — o código sob teste recebe o " +
                "dummy, mas nunca chama nenhum método nele nem lê nenhuma propriedade sua. Se a assinatura de " +
                "uma função exige três argumentos e o teste só se importa com dois deles, o terceiro pode ser um " +
                "dummy: qualquer valor (às vezes até null ou {}) que satisfaça o tipo esperado, sem nenhum " +
                "comportamento por trás.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um dummy é o dublê mais inerte: existe só para preencher uma assinatura, sem nenhum " +
                "comportamento por trás — o sinal de que aquele parâmetro é irrelevante para o que o teste está " +
                "verificando.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um stub é um dublê que, quando um de seus métodos é chamado, devolve um valor fixo e " +
                "pré-programado — sem lógica real por trás, sem verificar dados de entrada, sem checar se e " +
                "quantas vezes foi chamado. O código sob teste chama o stub e usa a resposta dele como se fosse " +
                "a dependência real, mas o teste em si não faz nenhuma asserção sobre o stub — só sobre o " +
                "resultado do código que o usou.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um stub devolve respostas fixas e pré-programadas quando chamado — usado de fato pelo código " +
                "sob teste, mas nunca verificado quanto a como foi chamado; o teste avalia o efeito da resposta, " +
                "não a chamada em si.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um fake é uma implementação que realmente funciona — tem lógica de verdade por trás, não " +
                "apenas respostas fixas — mas é simplificada em relação à dependência real de produção. O " +
                "exemplo clássico é um repositório em memória: um objeto que guarda dados num array ou Map em " +
                "vez de gravar em um banco de dados de verdade, mas que implementa save, findById, delete etc. " +
                "com comportamento genuíno.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um fake é uma implementação funcional e simplificada da dependência — tem lógica e estado " +
                "reais, ao contrário de um stub (respostas fixas), mas é mais simples e mais rápida que a versão de produção.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um spy é um dublê que, além de (opcionalmente) se comportar como um stub ou delegar para a " +
                "implementação real, registra informações sobre como foi chamado: quantas vezes, com quais " +
                "argumentos, em que ordem. Depois que o código sob teste roda, o teste consulta esses registros " +
                "e faz asserções sobre eles — \"send foi chamado exatamente uma vez, com o e-mail correto\".",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um spy registra como foi chamado — quantas vezes, com quais argumentos — para que o teste " +
                "verifique isso depois do Act; é a ferramenta certa quando o comportamento que importa é um " +
                "efeito colateral, não um valor de retorno.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Um mock é configurado, antes do Act, com uma expectativa explícita sobre como deve ser chamado " +
                "— \"espero que save seja chamado exatamente uma vez, com este argumento\". Depois que o código " +
                "sob teste roda, o próprio mock (ou um passo de verificação dedicado) confirma se a expectativa " +
                "foi cumprida. Se não foi, o mock reporta a falha — a lógica de verificação vive dentro do " +
                "dublê, não só no bloco Assert do teste.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Um mock é pré-programado com uma expectativa sobre como deve ser chamado e verifica essa " +
                "expectativa sozinho — a interação, não só o valor de retorno, é o que decide se o teste passa.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Test-Driven Development (TDD) é uma disciplina de desenvolvimento em que o teste de um " +
                "comportamento é escrito antes do código de produção que o implementa. Em vez de \"escrever a " +
                "função, depois testar\", a ordem se inverte: escrever um teste que descreve o comportamento " +
                "esperado (e que, nesse momento, falha — porque o código ainda não existe), e só então escrever " +
                "o código mínimo necessário para fazer esse teste passar.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "TDD inverte a ordem tradicional: o teste vem primeiro, e o código de produção existe só para " +
                "fazê-lo passar — uma disciplina que usa o teste para guiar o design, não só para verificá-lo depois.",
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
            { type: "heading", text: "O que é?" },
            {
              type: "paragraph",
              text:
                "Red-Green-Refactor é o ciclo operacional concreto por trás do TDD: Red — escrever um teste " +
                "para um comportamento que ainda não existe, e vê-lo falhar (a \"barra vermelha\"); Green — " +
                "escrever o código mais simples possível que faz esse teste passar (a \"barra verde\"), mesmo " +
                "que a implementação não seja elegante; Refactor — com o teste passando como rede de segurança, " +
                "melhorar a estrutura do código sem mudar seu comportamento externo.",
            },
            { type: "heading", text: "Por que existe?" },
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
            { type: "heading", text: "Exemplo mínimo" },
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
            {
              type: "takeaway",
              text:
                "Red-Green-Refactor é o motor operacional do TDD: falhar de propósito, passar com o mínimo, " +
                "depois melhorar em segurança — um passo de cada vez, nunca os três ao mesmo tempo.",
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
