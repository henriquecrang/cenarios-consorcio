# Backlog de novas perguntas — QuintoAndar / Bamaq

**Criado em:** 28/09/2026  
**Objetivo:** registrar novas perguntas que surgirem a partir das respostas da vendedora, sem misturá-las com as pendências já existentes do simulador.

## Regra de uso

Este backlog deve receber apenas perguntas **novas ou refinadas** que surjam durante o processamento das respostas.

Quando uma resposta:
- resolver completamente uma pendência existente, atualizar `pendencias_simulador_consorcio_v3_2_pre_respostas17.txt` e não criar item aqui;
- responder parcialmente e abrir uma nova dúvida, registrar a nova dúvida aqui;
- contradizer documento/regulamento existente, registrar aqui a pergunta de reconciliação e apontar as duas fontes;
- exigir confirmação formal da Bamaq, marcar como `CONFIRMAÇÃO FORMAL`;
- depender de contador, banco, Receita, QuintoAndar ou outro terceiro, indicar o destinatário correto.

## Status possíveis

- `ABERTA`
- `AGUARDAR PRÓXIMA RESPOSTA`
- `CONFIRMAÇÃO FORMAL`
- `RESPONDIDA`
- `DESCARTADA`
- `MOVIDA PARA PENDÊNCIAS`

## Prioridade

- `ALTA` — pode mudar materialmente o resultado financeiro ou a arquitetura do simulador;
- `MÉDIA` — relevante para modelagem/uso real, mas não muda sozinho o núcleo do resultado;
- `BAIXA` — detalhe operacional, fiscal, documental ou de UX.

---

# Itens


## Sincronização de software antes da próxima rodada — 29/09/2026

A linha principal do simulador evoluiu para a V3.2.

Essa evolução **não cria, por si só, novas perguntas comerciais à Michele**. Portanto:
- a numeração existente é preservada;
- a próxima pergunta nova continua em **QN-065**;
- não consumir um novo QN apenas para documentar feature interna de software;
- a capacidade da V3.2 de trabalhar com 1–50 cotas é uma decisão de produto para comparar propostas e NÃO deve ser reinterpretada como regra da Bamaq;
- quando respostas futuras forem processadas, elas devem ser comparadas com o comportamento atual da V3.2, não mais com a V2.54;
- diferenças de software já resolvidas (multi-cota, Lance Livre, CDI separado, sem pooling, tranches e matriz) só devem reabrir perguntas se a nova resposta comercial trouxer regra incompatível.

Perguntas comerciais ainda abertas continuam válidas, especialmente as ligadas a:
- cashback com embutido;
- primeiro reajuste/aniversário do grupo;
- assembleias anteriores;
- prazo operacional do lance;
- faixa real de remuneração da carta;
- evento que trava a condição comercial;
- regras de seguro que não são prioritárias para a decisão imediata.

### QN-001 — Como é determinado o rendimento de 98% a 105% do CDI?

**Status:** RESPONDIDA PARCIALMENTE  
**Prioridade:** ALTA  
**Origem:** resposta de Michele em 28/09/2026 sobre cotas contempladas em momentos diferentes  
**Destinatário:** Michele / Bamaq

**O que ela respondeu:**  
A cota contemplada primeiro fica com o crédito em uma “conta de investimento exclusiva”, rendendo de 98% a 105% do CDI de forma líquida enquanto aguarda as demais.

**O que já tínhamos nos documentos:**  
A V2.54 usa uma hipótese pontual de 98% do rendimento líquido do CDB. A pendência R1 já registrava que a remuneração real era uma das premissas mais sensíveis do modelo.

**Nova dúvida gerada:**  
O que determina o ponto da faixa 98%–105% do CDI? É uma taxa contratada, uma remuneração variável ou apenas o resultado efetivo da carteira?

**Por que importa:**  
O resultado financeiro é altamente sensível à remuneração da carta. Uma faixa variável exige modelagem diferente de um percentual fixo.

**Pergunta sugerida:**  
> Quando você fala em 98% a 105% do CDI, o que determina qual percentual a carta recebe? Esse percentual fica definido para a cota, pode variar ao longo do tempo ou é apenas uma referência do rendimento efetivo das aplicações?

**Relação com arquivos:**  
- Pendência: 1.1 / R1  
- Especificação: seções 5, 52, 59.4  
- Follow-up: AUD-DEC-019 / EVID-003

**Resultado posterior:**  
Michele esclareceu que não há taxa fixa garantida; a faixa é apenas referência do rendimento efetivo das aplicações. Depois informou uma faixa diferente (80%–105%), por isso a questão da faixa exata permanece aberta.

---

### QN-002 — Onde fica aplicado o crédito contemplado e qual é a política de investimento?

**Status:** RESPONDIDA PARCIALMENTE  
**Prioridade:** ALTA  
**Origem:** expressão “conta de investimento exclusiva” usada por Michele  
**Destinatário:** Bamaq, preferencialmente com documento

**O que ela respondeu:**  
O crédito contemplado não utilizado fica em conta de investimento exclusiva e rende de 98% a 105% do CDI líquido.

**Nova dúvida gerada:**  
Onde exatamente o dinheiro é aplicado, quem administra/custodia, quais ativos podem ser usados e qual política de risco/liquidez rege essas aplicações?

**Por que importa:**  
Além da rentabilidade, isso define risco de crédito/mercado, liquidez e a natureza econômica do ativo que estamos modelando.

**Pergunta sugerida:**  
> Você consegue me dizer onde exatamente fica aplicado o crédito contemplado? Existe um fundo, conta ou carteira específica? Quem é o custodiante/gestor e qual é a política da Bamaq para escolher os ativos, especialmente em relação a risco, liquidez e diversificação? Se houver um documento sobre essa política, melhor ainda.

**Relação com arquivos:**  
- Pendência: 1.1 / 11.2  
- Especificação: seção 5  
- Follow-up: EVID-003

**Resultado posterior:**  
Michele descreveu aplicações em bancos de primeira linha, títulos públicos/compromissadas e fundos RF. A Resolução BCB nº 285/2023 confirma o universo regulatório. Falta identificar a aplicação efetiva do Grupo 4012 e esclarecer se “conta exclusiva” é conta bancária individual ou segregação contábil.

---

### QN-003 — O que significa “líquido” na remuneração de 98% a 105% do CDI?

**Status:** RESPONDIDA PARCIALMENTE  
**Prioridade:** ALTA  
**Origem:** Michele qualificou a remuneração como “de forma líquida”  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
“Líquido” já é líquido de IR, IOF, taxa de gestão, taxa administrativa da aplicação e qualquer outra retenção para o consorciado?

**Por que importa:**  
A segunda auditoria mostrou que eventual tributação/custo sobre grandes rendimentos pode alterar materialmente o resultado.

**Pergunta sugerida:**  
> Quando você diz que os 98% a 105% do CDI são líquidos, isso já significa o rendimento efetivamente creditado para mim depois de IR, IOF, taxa de gestão e qualquer outro desconto? Ou existe alguma tributação/custo em outro momento?

**Relação com arquivos:**  
- Pendência: 1.4 / R1 / B6  
- Follow-up: AUD-DEC-019 / AUD-DEC-025

**Resultado posterior:**  
Michele afirmou que o retorno é líquido de IR das aplicações e sem taxa adicional de gestão. A Resolução BCB nº 285/2023, art. 17, confirma que o crédito recebe rendimentos líquidos. Resta apenas eventual evento fiscal adicional no saque/recebimento em espécie.

---

### QN-004 — Até quando a conta de investimento continua rendendo?

**Status:** RESPONDIDA PARCIALMENTE  
**Prioridade:** ALTA  
**Origem:** Michele disse que o crédito rende enquanto se aguardam as demais cotas  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
A remuneração depende de ainda existirem outras cotas não contempladas, ou continua até a utilização efetiva do crédito mesmo quando todas já estiverem contempladas? Pode permanecer até o fim do grupo?

**Pergunta sugerida:**  
> Se todas as quatro cotas já tiverem sido contempladas e eu ainda não comprar o imóvel, os créditos continuam nessas aplicações rendendo normalmente até a utilização? E, em tese, poderiam permanecer assim por vários anos ou até o encerramento do grupo?

**Relação com arquivos:**  
- Pendência: 1.1 e 1.7  
- Especificação: seções 19 e 54

**Resultado posterior:**  
Michele informou que a carta pode render até a utilização ou até o encerramento do grupo. A regulamentação confirma rendimento até a efetiva utilização. O procedimento específico no encerramento ainda precisa ser esclarecido.

---

### QN-005 — Capacidade do Fundo Comum para contemplar vários lances no mesmo mês

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele condicionou a contemplação simultânea à existência de saldo no Fundo Comum  
**Destinatário:** Bamaq

**Nova dúvida gerada:**  
Como o Fundo Comum determina o número de contemplações por lance em cada assembleia e o que acontece se as quatro ofertas forem competitivas mas não houver recurso para todas?

**Pergunta sugerida:**  
> Você comentou que as quatro cotas podem ser contempladas na mesma assembleia se os lances forem vencedores e houver saldo no Fundo Comum. Como é definido quantos lances podem ser contemplados em cada mês? Se minhas quatro ofertas estiverem entre as melhores, mas o fundo não comportar todas, qual é o critério para escolher quais entram?

**Relação com arquivos:**  
- Pendência: 2.4  
- Especificação futura: múltiplas cotas

**Resultado posterior:**  
—


---

### QN-006 — Qual é a faixa permitida do Lance Livre?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** Michele informou que o Lance Livre usa percentual do saldo devedor e exemplificou 45%  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
45% é apenas o percentual escolhido no exemplo ou existe alguma regra/faixa do grupo? Qual é o mínimo e existe máximo?

**Por que importa:**  
O break-even de lance e a probabilidade de contemplação dependem da faixa realmente ofertável.

**Pergunta sugerida:**  
> No lance livre, esses 45% foram só um exemplo de oferta ou existe alguma faixa específica do grupo? Qual é o percentual mínimo permitido e existe algum máximo?

**Relação com arquivos:**  
- Pendência: 2.4 / 11.1  
- Especificação: seção 11.3

**Resultado posterior:**  
—

---

### QN-007 — Reconciliar a composição “45% total, 10% embutido, 35% do bolso”

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** memória de cálculo da cota de R$ 400 mil  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
Como o Lance Livre é percentual do saldo devedor e o embutido é percentual da carta, os “35% do bolso” não podem ser obtidos simplesmente por 45%-10% sobre a mesma base.

**Por que importa:**  
A fórmula da parte em dinheiro do lance muda materialmente o capital necessário e qualquer eventual empréstimo.

**Pergunta sugerida:**  
> Só para eu conferir a memória: no exemplo dos 45%, entendi agora que os 45% são sobre o saldo devedor, enquanto os 10% embutidos são sobre a carta. Então a parte em dinheiro seria “45% do saldo devedor menos R$ 40 mil”, correto? Quando você escreveu 35% do bolso, foi uma simplificação de linguagem e não 35% da carta?

**Relação com arquivos:**  
- Pendência: 2.4 / 11.1  
- Especificação: seção 11.5

**Resultado posterior:**  
—

---

### QN-008 — Por que restam 209 meses após contemplação na 4ª parcela?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** memória de cálculo da cota de R$ 400 mil  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
Com prazo informado de 214 meses, contemplação na 4ª parcela sugeriria 210 parcelas restantes pela contagem simples, mas a memória usa 209.

**Por que importa:**  
Pode indicar diferença importante na cronologia da parcela do mês da contemplação e no recálculo pós-lance.

**Pergunta sugerida:**  
> Outra continha que eu queria conferir: se o prazo é de 214 meses e a contemplação acontece na 4ª parcela, de onde vêm os 209 meses usados para a nova parcela? Existe alguma parcela adicional considerada antes do recálculo?

**Relação com arquivos:**  
- Pendência: 1.3  
- Especificação: seção 10

**Resultado posterior:**  
—

---

### QN-009 — Diferença na parcela reduzida do exemplo

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** memória de cálculo da cota de R$ 400 mil  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
A parcela integral informada é R$ 2.336,40; 50% seria R$ 1.168,20, mas a reduzida informada é R$ 1.167,60.

**Por que importa:**  
A diferença é pequena, mas pode revelar uma base de cálculo diferente da divisão simples que usamos.

**Pergunta sugerida:**  
> No mesmo exemplo, a parcela integral é R$ 2.336,40 e a reduzida de 50% apareceu como R$ 1.167,60. É só arredondamento/typo ou existe algum componente da parcela que não entra na redução de 50%?

**Relação com arquivos:**  
- Pendência: 1.3  
- Especificação: seção 6.3

**Resultado posterior:**  
—

---

### QN-010 — O lance reduz parcela, prazo ou pode escolher?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** Michele disse que o lance “amortizou no valor da parcela” e apresentou nova parcela de R$ 1.302  
**Destinatário:** Michele / Bamaq

**Nova dúvida gerada:**  
É sempre redução de valor da parcela ou o consorciado pode escolher reduzir prazo / parcelas finais / ordem inversa?

**Por que importa:**  
As duas formas geram cronologias e aportes muito diferentes no simulador.

**Pergunta sugerida:**  
> Nesse exemplo vocês usaram o lance para reduzir o valor das parcelas. Essa é a regra obrigatória do grupo ou eu posso escolher entre reduzir parcela, reduzir prazo ou amortizar parcelas em ordem inversa?

**Relação com arquivos:**  
- Pendência: 2.4  
- Especificação: seção 11.8

**Resultado posterior:**  
—

---

### QN-011 — Qual faixa de rentabilidade está correta: 98%–105% ou 80%–105% do CDI?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** duas respostas sucessivas de Michele  
**Destinatário:** Michele / Bamaq

**O que mudou:**  
Na primeira resposta, a faixa informada foi 98%–105% do CDI líquido. Na resposta seguinte, apareceu aproximadamente 80%–105% do CDI líquido.

**Por que importa:**  
A diferença entre piso de 98% e 80% é material e afeta diretamente a sensibilidade R1.

**Pergunta sugerida:**  
> Em uma mensagem você falou em 98% a 105% do CDI líquido e na seguinte apareceu 80% a 105%. Qual é a faixa correta? Existe algum histórico/extrato que mostre quanto o Grupo 4012 efetivamente tem rendido em % do CDI?

**Relação com arquivos:**  
- Pendência: 1.1 / R1  
- Especificação: 19.3  
- Follow-up: EVID-008

**Resultado posterior:**  
—

---

### QN-012 — “Conta de investimento exclusiva” é conta individual ou segregação contábil?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele usou “no seu nome” em uma resposta e “em nome da Bamaq vinculada ao grupo” na seguinte  
**Destinatário:** Bamaq

**Nova dúvida:**  
Existe conta bancária/investimento individualizado por cota ou a individualização ocorre apenas no controle contábil da administradora?

**Por que importa:**  
Não muda necessariamente a rentabilidade, mas muda a compreensão jurídica/operacional do ativo e o risco de contraparte.

**Pergunta sugerida:**  
> Quando você fala em conta de investimento exclusiva, é uma conta/investimento individual aberto para cada cota ou o recurso fica em aplicação do grupo em nome da Bamaq, com segregação contábil individual por consorciado?

**Relação com arquivos:**  
- Especificação: 17A.3  
- Follow-up: EVID-006

**Resultado posterior:**  
—

---

### QN-013 — Qual aplicação/fundo o Grupo 4012 usa hoje?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele citou “Itaú Premium ou equivalentes”  
**Destinatário:** Bamaq

**Nova dúvida:**  
Qual é o nome/CNPJ da aplicação efetivamente usada atualmente para os recursos vinculados às contemplações do Grupo 4012?

**Por que importa:**  
Permite verificar taxa de administração do fundo, benchmark, liquidez e rentabilidade histórica efetiva.

**Pergunta sugerida:**  
> Você consegue confirmar qual fundo/aplicação o Grupo 4012 usa hoje para os créditos contemplados não utilizados? Se tiver nome e CNPJ da aplicação ou um extrato de exemplo, eu consigo conferir a rentabilidade efetiva.

**Relação com arquivos:**  
- Pendência: 1.1  
- Especificação: 17A.2

**Resultado posterior:**  
—

---

### QN-014 — Há evento fiscal adicional quando o crédito é recebido em dinheiro após 180 dias?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** rendimentos líquidos confirmados + possibilidade de saque após 180 dias  
**Destinatário:** Bamaq / contador

**Nova dúvida:**  
O crédito já atualizado por rendimentos líquidos pode ser transferido ao consorciado sem qualquer IR/tarifa adicional no momento do recebimento em espécie?

**Pergunta sugerida:**  
> Como os rendimentos já entram líquidos na carta, quando eu quitar a cota e pedir o crédito em dinheiro depois de 180 dias existe algum imposto, retenção ou tarifa adicional no momento da transferência para minha conta?

**Relação com arquivos:**  
- Pendência: 1.4 / 5.2  
- Follow-up: AUD-DEC-025

**Resultado posterior:**  
—

---

### QN-015 — Como funciona o encerramento do grupo para carta contemplada não utilizada?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** Michele informou rendimento até o encerramento, mas não descreveu a liquidação final  
**Destinatário:** Bamaq

**Nova dúvida:**  
No mês de encerramento, a administradora libera automaticamente crédito + rendimentos? Precisa de pedido? Como é tratado eventual saldo devedor?

**Pergunta sugerida:**  
> E se eu chegar ao encerramento do grupo com a carta contemplada e ainda não utilizada: o crédito + rendimentos é liberado automaticamente para minha conta? Preciso solicitar? E eventual saldo devedor é compensado internamente ou precisa estar quitado antes?

**Relação com arquivos:**  
- Pendência: 1.7  
- Especificação: 54

**Resultado posterior:**  
—

---

### QN-016 — Como funciona o abatimento quando o rendimento é menor que a parcela?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele deu exemplo apenas com rendimento superior à parcela  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
Se a parcela for R$ 5 mil e o rendimento do mês apenas R$ 3 mil, os R$ 3 mil são usados e o cliente paga os R$ 2 mil restantes?

**Por que importa:**  
É exatamente a fórmula usada hoje pelo simulador e vale confirmar o comportamento parcial.

**Pergunta sugerida:**  
> E no sentido contrário: se naquele mês o rendimento for menor que a parcela, por exemplo R$ 3 mil de rendimento para uma parcela de R$ 5 mil, ele abate os R$ 3 mil e eu pago só os R$ 2 mil restantes?

**Relação com arquivos:**  
- Pendência: 1.2  
- Especificação: 21.1

**Resultado posterior:**  
—

---

### QN-017 — Qual é o prazo e a mecânica da solicitação mensal no app?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele informou que o abatimento precisa ser solicitado mensalmente  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
Qual é o cutoff da solicitação, para qual parcela ela vale e existe opção de instrução permanente?

**Por que importa:**  
A regra financeira está clara, mas existe risco operacional de o usuário perder o abatimento de um mês.

**Pergunta sugerida:**  
> Sobre precisar solicitar todo mês pelo app: existe uma data-limite antes do vencimento? A solicitação vale para a parcela daquele mês ou para a seguinte? E não existe opção de deixar isso automático/recorrente?

**Relação com arquivos:**  
- Pendência: 1.2  
- Especificação: 21.3 e 21.5

**Resultado posterior:**  
—

---

### QN-018 — O que acontece se a solicitação mensal não for feita?

**Status:** ABERTA  
**Prioridade:** BAIXA  
**Origem:** necessidade de ação mensal no aplicativo  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
Se o cliente esquecer a solicitação em um mês, o rendimento apenas permanece no crédito? Pode ser usado no mês seguinte para abater a próxima parcela?

**Por que importa:**  
Ajuda a modelar o custo real de falha operacional sem confundir isso com perda de rendimento.

**Pergunta sugerida:**  
> Se eu esquecer de pedir o abatimento em um mês, entendo que o rendimento simplesmente fica acumulado na carta. No mês seguinte eu posso solicitar normalmente o abatimento da nova parcela usando o rendimento que estiver disponível naquele momento?

**Relação com arquivos:**  
- Pendência: 1.2  
- Especificação: 21.5

**Resultado posterior:**  
—

---

### QN-019 — Qual é a data-base e o primeiro reajuste das novas cotas?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** Michele confirmou reajuste fixo de 3% a.a., mas não informou calendário  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
Agora sabemos que a cota entra com 214 meses remanescentes. Falta saber se ela herda a data-base anual já existente do Grupo 4012 ou se o primeiro reajuste ocorre 12 meses depois da adesão individual.

**Por que importa:**  
O simulador precisa posicionar o primeiro aumento de carta/saldo/parcela no mês correto. Um deslocamento de alguns meses altera lance, saldo e aportes.

**Pergunta sugerida:**  
> Perfeito sobre os 3% fixos. Como estou entrando num grupo que já está em andamento, minhas cotas herdam a data-base anual do Grupo 4012 ou contam 12 meses a partir da minha adesão? Em que mês exatamente acontece o primeiro reajuste?

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: 7.2

**Resultado posterior:**  
Michele confirmou que o reajuste anual ocorre no aniversário do grupo. Logo, a cota herda o calendário do Grupo 4012, em vez de contar necessariamente 12 meses desde sua própria adesão. Ainda falta a data exata e saber se a próxima assembleia do dia 18 já será o primeiro reajuste das cotas contratadas agora.


---

### QN-020 — O que acontece quando reajuste e contemplação caem no mesmo mês?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** questão anterior não respondida diretamente  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
A carta e o saldo recebem primeiro o reajuste de 3% e depois ocorre a contemplação/lance, ou a contemplação é processada antes do reajuste?

**Por que importa:**  
A primeira auditoria mostrou que a ordem pode alterar materialmente lance, crédito e saldo.

**Pergunta sugerida:**  
> E se a assembleia de contemplação cair justamente no mês do reajuste anual: primeiro a carta/saldo recebem os 3% e depois é apurado o lance, ou a contemplação acontece primeiro e o reajuste vem depois?

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: seção 8  
- Follow-up: AUD-DEC-010 / EVID-010

**Resultado posterior:**  
—

---

### QN-021 — Como a parcela pós-contemplação reage aos reajustes anuais de 3%?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele confirmou que o saldo devedor continua reajustado após contemplação  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
Quando o saldo pós-contemplação recebe 3%, a parcela mensal sobe proporcionalmente, é recalculada pelo prazo restante ou existe outra fórmula?

**Por que importa:**  
Precisamos validar a fórmula pós-contemplação do motor e a memória de R$ 1.302.

**Pergunta sugerida:**  
> Depois de contemplado, quando chega o reajuste anual de 3% do saldo devedor, como a nova parcela é calculada? Ela simplesmente sobe 3% ou vocês recalculam o saldo reajustado pelo número de parcelas restantes?

**Relação com arquivos:**  
- Pendência: 1.5 / 1.3  
- Especificação: 7.1 e 10

**Resultado posterior:**  
—

---

### QN-022 — Carta posterior pode quitar totalmente o consórcio das primeiras cotas usado no mesmo imóvel?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** resposta de Michele versus art. 8º, XII/XIII, do Regulamento Geral Bamaq  
**Destinatário:** Bamaq

**Contradição:**  
Michele disse que cartas contempladas depois não podem ser usadas para abater a alienação do mesmo imóvel. O Regulamento Geral Bamaq permite quitação total de financiamento ou consórcio da própria titularidade, da mesma categoria.

**Pergunta sugerida:**  
> Fiquei com uma dúvida ao comparar sua resposta com o Regulamento Geral da própria Bamaq. O art. 8º, XII e XIII, diz que uma carta contemplada pode quitar totalmente financiamento ou consórcio da minha titularidade, da mesma categoria. Então, se eu comprar um imóvel usando 2 ou 3 cotas Bamaq e outra cota minha for contemplada depois, eu poderia usar essa nova carta para quitar TOTALMENTE o saldo de uma das cotas/consórcios que já financiaram aquele mesmo imóvel? Ou existe alguma restrição específica quando o bem dado em garantia é o mesmo?

**Por que importa:**  
Pode transformar contemplações tardias de simples “segundo imóvel” em mecanismo de desalavancagem da primeira operação.

**Relação com arquivos:**  
- Pendência: 2.8  
- Especificação: 23A.4  
- Follow-up: EVID-012

**Resultado posterior:**  
—

---

### QN-023 — Posso reunir várias cartas posteriores para conseguir a quitação total?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** regra de quitação total exige saldo da dívida <= crédito da carta  
**Destinatário:** Bamaq

**Nova dúvida:**  
Se uma única carta posterior não for suficiente para quitar o saldo devedor existente, podem ser combinadas duas ou mais cartas contempladas posteriores para realizar a quitação total?

**Pergunta sugerida:**  
> E se uma única carta posterior não for suficiente para quitar todo o saldo, eu poderia reunir duas ou mais cartas contempladas para fazer essa quitação total, da mesma forma que vocês permitem reunir créditos na compra do imóvel?

**Por que importa:**  
Com cotas de R$ 200–400 mil, a regra de “saldo <= crédito” pode inviabilizar a quitação se o software não puder combinar cartas.

**Relação com arquivos:**  
- Pendência: 2.8  
- Especificação: 23A.4

**Resultado posterior:**  
—

---

### QN-024 — De onde vem o limite de 150 cotas por CPF?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele chamou 150 de “limite regulamentar”  
**Destinatário:** Michele / Bamaq

**Nova dúvida:**  
A Resolução BCB nº 285/2023 e o Regulamento Geral da Bamaq falam em limite de 10% das cotas ativas por grupo, não em 150 cotas totais por CPF.

**Pergunta sugerida:**  
> Você comentou que existe um limite regulamentar de 150 cotas por CPF. Você consegue me indicar onde aparece essa regra? No regulamento geral da Bamaq e na Resolução 285 do Bacen eu encontrei a regra de até 10% das cotas ativas de cada grupo, então queria entender se as 150 são uma política interna da Bamaq/QuintoAndar ou outra regra específica.

**Relação com arquivos:**  
- Pendência: 2.9  
- Especificação: 57A  
- Follow-up: EVID-013

**Resultado posterior:**  
—

---

### QN-025 — Como fica a garantia quando várias cartas são usadas no mesmo imóvel?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** combinação de créditos confirmada  
**Destinatário:** Bamaq

**Nova dúvida:**  
Há uma única alienação fiduciária garantindo todas as cotas ou contratos/gravames separados? Como é feita a baixa quando uma cota é quitada antes das demais?

**Pergunta sugerida:**  
> Quando eu uso várias cotas Bamaq juntas para comprar um único imóvel, como fica a garantia na matrícula? É uma única alienação fiduciária vinculando o saldo total das cotas ou cada cota fica identificada separadamente? E se eu quitar uma delas antes, isso muda algo no gravame?

**Relação com arquivos:**  
- Pendência: 2.5 / 2.8  
- Especificação: 23A.3

**Resultado posterior:**  
—

---

### QN-026 — No Grupo 4012, o residual amortiza obrigatoriamente em ordem indireta?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** resposta da Michele versus Regulamento Geral Bamaq  
**Destinatário:** Bamaq

**Contexto:**  
Michele disse que o residual pode reduzir o valor das parcelas restantes OU encurtar o prazo. O Regulamento Geral Bamaq que encontramos fala em quitação de prestações vincendas em ordem indireta.

**Pergunta sugerida:**  
> No Grupo 4012, quando sobra crédito depois da compra, a parte destinada ao saldo devedor é obrigatoriamente usada para quitar parcelas em ordem inversa, encurtando o prazo, ou existe também a opção de recalcular/reduzir o valor das parcelas mensais?

**Por que importa:**  
Redução de parcela e redução de prazo geram fluxos financeiros bastante diferentes.

**Relação com arquivos:**  
- Pendência: 3.1  
- Especificação: 23.5 / 56  
- Follow-up: EVID-014

**Resultado posterior:**  
—

---

### QN-027 — Como funciona o limite de 10% quando várias cotas são usadas na mesma compra?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** compra multi-cota + regra de despesas vinculadas  
**Destinatário:** Bamaq

**Nova dúvida:**  
Se três cotas são usadas numa mesma aquisição, o teto de 10% para despesas é calculado:
- cota por cota;
- sobre a soma dos créditos;
- ou proporcionalmente ao crédito efetivamente liberado de cada uma?

**Pergunta sugerida:**  
> Quando eu uso várias cartas juntas no mesmo imóvel, esse limite de 10% para ITBI/registro é calculado sobre cada carta individualmente ou sobre a soma dos créditos usados na compra?

**Por que importa:**  
Pode alterar quanto do residual é consumido em custos e quanto sobra para antecipação da dívida.

**Relação com arquivos:**  
- Pendência: 3.1 / 2.5  
- Especificação: 23.5

**Resultado posterior:**  
—

---

### QN-028 — Quais despesas imobiliárias a Bamaq aceita dentro dos 10%?

**Status:** ABERTA  
**Prioridade:** BAIXA  
**Origem:** Michele citou ITBI, escritura e registro  
**Destinatário:** Bamaq

**Nova dúvida:**  
Além desses itens, entram avaliação do imóvel, seguros, tarifas da administradora, certidões ou outras despesas vinculadas?

**Pergunta sugerida:**  
> Dentro daquele limite de 10% do crédito, além de ITBI, escritura e registro, quais despesas a Bamaq aceita pagar diretamente? Avaliação, seguros, certidões e tarifas entram?

**Relação com arquivos:**  
- Pendência: 3.1  
- Especificação: 23.5

**Resultado posterior:**  
—

---

### QN-029 — Se eu quitar todas as obrigações, o residual pode ser transferido diretamente para minha conta?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** resposta comercial contradiz Resolução BCB nº 285 e Regulamento Bamaq  
**Destinatário:** Bamaq

**Contexto:**  
Michele disse que não existe troco em dinheiro após a compra. A norma e o regulamento preveem devolução em espécie quando as obrigações com grupo/administradora estiverem quitadas.

**Pergunta sugerida:**  
> Vi no art. 15, §3º, III, da Resolução 285 do Bacen e no Regulamento da Bamaq que, se eu tiver comprado um imóvel abaixo do crédito e todas as minhas obrigações com o grupo estiverem integralmente quitadas, a diferença pode ser devolvida em dinheiro para minha conta. É isso mesmo? Nesse caso existe algum prazo ou procedimento específico para solicitar a transferência?

**Relação com arquivos:**  
- Pendência: 3.1  
- Follow-up: EVID-014

**Resultado posterior:**  
—

---

### QN-030 — Como funciona a exceção do cashback de 16/06/2026 em operação multi-cota?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** resposta da Michele versus item 4.1.3.1 do Regulamento da Campanha  
**Destinatário:** QuintoAndar / Bamaq

**Contradição:**  
Michele disse que a base é sempre o crédito efetivamente utilizado. O regulamento prevê, desde 16/06/2026, base no crédito total contratado quando o imóvel vale pelo menos esse crédito.

**Pergunta sugerida:**  
> No regulamento da campanha encontrei uma exceção válida desde 16/06/2026: quando o imóvel tem valor igual ou superior ao crédito contratado, o cashback é de 10% sobre o valor total do crédito contratado, e não sobre o crédito efetivamente liberado. Como isso funciona quando eu uso várias cotas juntas? Vocês comparam o preço do imóvel com a soma dos créditos contratados ou aplicam a regra cota por cota?

**Por que importa:**  
Pode mudar materialmente o cashback, principalmente com lance embutido.

**Relação com arquivos:**  
- Pendência: 2.7 / 8  
- Especificação: 25.3–25.4  
- Follow-up: EVID-015

**Resultado posterior:**  
—

---

### QN-031 — Lance embutido reduz ou não a base da exceção do cashback?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** item 4.1.3.1 fala em crédito contratado, enquanto lance embutido reduz o crédito líquido disponível  
**Destinatário:** QuintoAndar / Bamaq

**Pergunta sugerida:**  
> E nessa exceção, se uma carta de R$ 400 mil tiver R$ 40 mil de lance embutido e liberar só R$ 360 mil para a compra, mas o imóvel custar pelo menos R$ 400 mil, o cashback é 10% de R$ 400 mil ou 10% dos R$ 360 mil liberados?

**Por que importa:**  
É exatamente a diferença entre a regra geral e a exceção promocional.

**Relação com arquivos:**  
- Especificação: 25.3  
- Backlog software: SW-028

**Resultado posterior:**  
—

---

### QN-032 — O prazo contratual do cashback é 5 ou 7 dias úteis?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele disse 7 dias; regulamento diz 5  
**Destinatário:** QuintoAndar

**Pergunta sugerida:**  
> Você comentou em até 7 dias úteis, mas o regulamento que recebi diz até 5 dias úteis contados do registro da alienação e do pagamento ao vendedor. Houve alguma atualização posterior do prazo ou continuam valendo os 5 dias do regulamento?

**Relação com arquivos:**  
- Pendência: 8.1  
- Especificação: 25.5

**Resultado posterior:**  
—

---

### QN-033 — Qual é o tratamento fiscal do cashback e ele reduz o custo de aquisição do imóvel?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele afirmou “isento de IR”, mas o regulamento é silencioso  
**Destinatário:** contador/tributarista; eventualmente QuintoAndar para informe/documento

**Nova dúvida:**  
Além de não haver IR no recebimento, o cashback deve ser tratado como desconto/rebate que reduz o custo fiscal do imóvel para um ganho de capital futuro?

**Pergunta sugerida para contador:**  
> Recebendo um cashback promocional de 10% ligado à aquisição de um imóvel por consórcio, como devo tratar isso no IRPF? É rendimento isento/não tributável, simples desconto no preço/custo de aquisição ou outra categoria? O cashback reduz o custo fiscal do imóvel para futuro cálculo de ganho de capital?

**Por que importa:**  
Mesmo que não haja imposto no recebimento, reduzir o custo fiscal pode aumentar o imposto numa venda futura.

**Relação com arquivos:**  
- Pendência: 8.3  
- Especificação: 25.8 / 29.5

**Resultado posterior:**  
—

---

### QN-034 — A campanha termina em 30/09/2026 ou foi prorrogada?

**Status:** ABERTA — URGENTE  
**Prioridade:** ALTA  
**Origem:** item 2.1 do Regulamento da Campanha  
**Destinatário:** Michele / QuintoAndar

**Contexto:**  
O regulamento disponível limita a elegibilidade a adesões realizadas até 30/09/2026.

**Pergunta sugerida:**  
> Vi agora um detalhe importante no regulamento: ele diz que a campanha vale para quem aderir até 30/09/2026. Como estamos em 28/09, queria confirmar o que exatamente precisa estar concluído até quarta-feira para garantir os benefícios: assinatura da adesão, pagamento da primeira parcela, emissão das cotas ou algum outro marco? A campanha foi prorrogada?

**Por que importa:**  
Sem elegibilidade, o cashback de 10% e outros benefícios promocionais podem deixar de existir.

**Relação com arquivos:**  
- Pendência: 8.4  
- Follow-up: EVID-016

**Resultado posterior:**  
—

---

### QN-035 — No encerramento, a Bamaq compensa automaticamente o saldo devedor com a própria carta?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** resposta de Michele versus art. 61 do Regulamento Geral Bamaq  
**Destinatário:** Bamaq

**Contradição/nuance:**  
Michele disse que no encerramento a administradora liquida o saldo devedor com os créditos/recursos da própria cota e transfere o líquido. O art. 61 do Regulamento diz que o crédito está disponível em espécie ao consorciado ativo que tenha quitado suas obrigações.

**Pergunta sugerida:**  
> No encerramento do grupo, você comentou que a Bamaq usa os próprios recursos da carta para liquidar eventual saldo devedor e me transfere só o saldo líquido. Queria confirmar esse ponto porque o art. 61 do Regulamento Geral diz que o crédito fica disponível em espécie para o consorciado que já tenha quitado suas obrigações. Existe realmente uma compensação interna automática no encerramento? Se sim, ela usa o principal da carta ou apenas rendimentos acumulados?

**Por que importa:**  
Muda completamente a necessidade de caixa no fim do horizonte.

**Relação com arquivos:**  
- Pendência: 1.7 / 5.1  
- Especificação: 22.5 / 54  
- Follow-up: EVID-018

**Resultado posterior:**  
—

---

### QN-036 — Quanto costuma sobrar do Fundo de Reserva em grupos Bamaq encerrados?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** direito ao rateio confirmado  
**Destinatário:** Bamaq

**Nova dúvida:**  
A regra existe, mas o simulador precisa de uma premissa razoável de valor.

**Pergunta sugerida:**  
> Sobre o Fundo de Reserva: vocês têm algum histórico dos grupos imobiliários encerrados mostrando quanto, em média, foi devolvido aos consorciados em relação ao 1% originalmente pago? Mesmo alguns exemplos reais já ajudariam bastante a calibrar a simulação.

**Por que importa:**  
Permite substituir o cenário conservador de 0% por uma distribuição mais realista.

**Relação com arquivos:**  
- Pendência: 4  
- Especificação: 55

**Resultado posterior:**  
—

---

### QN-037 — Cota quitada antecipadamente continua participando do rateio do Fundo de Reserva?

**Status:** RESPONDIDA COMERCIALMENTE  
**Prioridade:** MÉDIA  
**Origem:** regra fala em consorciados ativos no encerramento  
**Destinatário:** Bamaq

**Nova dúvida:**  
Se a cota for totalmente quitada muitos anos antes do encerramento, ela continua classificada como ativa e recebe o rateio proporcional do saldo remanescente?

**Pergunta sugerida:**  
> Se eu quitar uma cota integralmente antes do fim do grupo, ela continua tendo direito normalmente ao rateio do Fundo de Reserva no encerramento, desde que eu não tenha desistido/transferido a cota?

**Relação com arquivos:**  
- Pendência: 4  
- Follow-up: AUD-DEC-012

**Resultado posterior:**  
Michele confirmou que cotas contempladas, utilizadas ou quitadas continuam como cotistas ativos para o rateio final, desde que não tenham sido canceladas/desistidas. Isso é consistente com o art. 55 do Regulamento Bamaq, que exclui do rateio apenas cotas excluídas/desistentes.


---


### QN-038 — Qual é o prazo real de pagamento dos valores no encerramento?

**Status:** ABERTA — RESPOSTA CONTRADITÓRIA COM O REGULAMENTO  
**Prioridade:** MÉDIA  
**Origem:** resposta de Michele em 28/09/2026 versus arts. 61 e 62 do Regulamento Geral Bamaq  
**Destinatário:** Bamaq

**O que Michele respondeu:**  
- encerramento contábil em até 120 dias após a última assembleia;
- devolução do Fundo de Reserva em até 60 dias depois do encerramento contábil.

**O que diz o Regulamento Bamaq disponível:**  
- art. 61: em até 60 dias da última assembleia, a Bamaq deve comunicar que os saldos remanescentes estão disponíveis para devolução;
- art. 62: encerramento contábil em até 120 dias da última assembleia.

**Nova dúvida:**  
Existe procedimento/aditivo mais recente que realmente desloca o pagamento para até 60 dias APÓS o encerramento contábil, ou a regra aplicável continua sendo a do regulamento?

**Pergunta sugerida:**  
> Sobre o prazo do Fundo de Reserva, fiquei com uma dúvida ao olhar o Regulamento Geral. Você comentou em até 120 dias para o encerramento contábil e depois mais 60 dias para a devolução. Mas os arts. 61 e 62 dizem que a comunicação/disponibilização dos saldos ocorre em até 60 dias da última assembleia e que o encerramento contábil ocorre em até 120 dias da última assembleia. Existe algum procedimento ou aditivo mais novo que mudou isso?

**Por que importa:**  
Define se o fluxo terminal entra aproximadamente em N+2 ou pode se estender até algo como N+6 no modelo.

**Relação com arquivos:**  
- Pendência: 4 / 1.7  
- Especificação: 55.5  
- Follow-up: EVID-019

**Resultado posterior:**  
—

---

### QN-039 — Qual é o fundo/CNPJ efetivamente usado pelo Grupo 4012 para o Fundo de Reserva?

**Status:** ABERTA  
**Prioridade:** BAIXA  
**Origem:** Michele citou “Fundo Itaú Premium”  
**Destinatário:** Bamaq

**Nova dúvida:**  
“Itaú Premium” possui mais de um veículo/classe e a documentação geral não identifica qual fundo é usado pelo Grupo 4012.

**Pergunta sugerida:**  
> Você comentou que o Fundo de Reserva fica aplicado no Itaú Premium. Consegue me passar o nome completo ou CNPJ da aplicação usada hoje pelo Grupo 4012? É o mesmo fundo usado para os créditos contemplados ainda não utilizados ou são aplicações diferentes?

**Por que importa:**  
Permite verificar rentabilidade histórica, taxa do fundo e confirmar se a mesma referência de CDI usada nas cartas também vale para o Fundo de Reserva.

**Relação com arquivos:**  
- Pendência: 4  
- Especificação: 55.6  
- Follow-up: EVID-019

**Resultado posterior:**  
—

---

### QN-040 — Qual é a regra objetiva de valor mínimo do imóvel substituto?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** Michele informou “saldo devedor ou crédito original, dependendo da análise patrimonial”  
**Destinatário:** Bamaq

**Nova dúvida:**  
A regra é ambígua demais para ser colocada no simulador.

**Pergunta sugerida:**  
> Na substituição de garantia, qual é exatamente o critério mínimo de avaliação do novo imóvel? Ele precisa valer pelo menos o saldo devedor atualizado das cotas, o valor do crédito originalmente liberado, ou existe uma margem/percentual definido pela análise de garantia? Se eu tiver várias cotas garantidas pelo mesmo imóvel, vocês consideram a soma dos saldos?

**Por que importa:**  
Pode determinar se a estratégia de vender o primeiro imóvel mantendo o consórcio é factível.

**Relação com arquivos:**  
- Pendência: 7.1  
- Especificação: 30.3  
- Follow-up: EVID-020

**Resultado posterior:**  
—

---

### QN-041 — O imóvel substituto precisa estar quitado e em meu nome?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Central de Ajuda oficial Bamaq afirma essa condição; Michele não a mencionou  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Vi na Central de Ajuda da Bamaq que, para substituir a garantia, o novo imóvel precisa estar quitado e registrado em nome do próprio consorciado. Essa regra vale exatamente assim para o Grupo 4012? Um imóvel financiado ou pertencente a terceiro não poderia ser usado como garantia substituta?

**Por que importa:**  
Restringe fortemente quais ativos podem sustentar a estratégia de substituição.

**Relação com arquivos:**  
- Pendência: 7.1  
- Especificação: 30.2

**Resultado posterior:**  
—

---

### QN-042 — Qual é o custo oficial atual da substituição de garantia?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele citou vistoria “em torno de 1 salário mínimo”  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Sobre os custos da substituição: existe uma tabela atual da Bamaq/empresa de engenharia? O “cerca de 1 salário mínimo” é uma tarifa fixa de vistoria ou varia por cidade/imóvel? Além disso, existe alguma taxa administrativa da Bamaq além dos custos de cartório e registro?

**Por que importa:**  
São custos incrementais que precisam entrar no fluxo da venda com manutenção do consórcio.

**Relação com arquivos:**  
- Pendência: 7.1  
- Especificação: 30.5

**Resultado posterior:**  
—

---

### QN-043 — O prazo de 15–30 dias úteis é SLA formal ou média operacional?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele informou prazo médio de 15–30 dias úteis; Regulamento fala em 5 dias para análise documental  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Esses 15 a 30 dias úteis são um SLA formal da Bamaq para a substituição completa ou uma média operacional? Vi que o Regulamento 2026 fala em 5 dias úteis para apreciação da documentação de garantia; os demais dias são normalmente vistoria, emissão do aditivo e cartório?

**Por que importa:**  
A defasagem altera o mês efetivo da venda e pode afetar aluguel, custos e custo de oportunidade.

**Relação com arquivos:**  
- Pendência: 7.1  
- Especificação: 30.6

**Resultado posterior:**  
—

---

### QN-044 — Como funciona formalmente a venda com a Bamaq como interveniente quitante?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele informou alternativa de quitação direta pelo comprador/banco  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Na alternativa sem substituição de garantia, como funciona formalmente a Bamaq como interveniente quitante? O comprador ou o banco financiador paga diretamente o saldo atualizado para a Bamaq e o restante do preço vem para mim? Existe algum documento/prazo específico para emissão do termo de quitação e baixa da alienação?

**Por que importa:**  
Precisamos modelar corretamente a ordem do fluxo de caixa na venda e o prazo de liberação do gravame.

**Relação com arquivos:**  
- Pendência: 7.1  
- Especificação: 30.1

**Resultado posterior:**  
—

---

### QN-045 — Os R$ 150 de cadastro são cobrados por cota ou por cessionário?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** Michele informou R$ 150 de “análise de crédito”; Regulamento 2026 prevê taxa de cadastro de R$ 150  
**Destinatário:** Bamaq

**Nova dúvida:**  
Se eu vender duas ou mais cotas para a mesma pessoa em uma única operação, há uma taxa de R$ 150 por cota ou apenas uma análise/cadastro do comprador?

**Pergunta sugerida:**  
> Sobre os R$ 150 da análise/cadastro: se eu transferir mais de uma cota para a mesma pessoa no mesmo processo, são R$ 150 por cota ou uma única taxa de cadastro do cessionário?

**Por que importa:**  
Na operação real com quatro cotas, a diferença pode multiplicar o custo por quatro.

**Relação com arquivos:**  
- Pendência: 6.1  
- Especificação: 31.4  
- Follow-up: EVID-022

**Resultado posterior:**  
—

---

### QN-046 — Confirmar a base da taxa: saldo devedor, não carta atualizada

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** divergência entre resposta de Michele e Regulamento Bamaq 2026  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Só queria confirmar uma diferença que encontrei no Regulamento 2026. Você me disse que o 1% é sobre o valor atualizado da carta, mas o art. 13, XIV, diz que a taxa de transferência é 1% do saldo devedor da conta de consórcio, limitada a R$ 1.000. Para o Grupo 4012 vale exatamente essa regra do saldo devedor?

**Por que importa:**  
Com saldos abaixo de R$ 100 mil, o teto deixa de neutralizar a diferença entre as bases.

**Relação com arquivos:**  
- Pendência: 6.1  
- Especificação: 31.3

**Resultado posterior:**  
—

---

### QN-047 — Quem paga as tarifas da transferência?

**Status:** ABERTA  
**Prioridade:** BAIXA  
**Origem:** tarifa confirmada, mas responsável econômico não explicitado  
**Destinatário:** Bamaq / negociação entre as partes

**Pergunta sugerida:**  
> Na prática, a taxa de transferência e os R$ 150 de cadastro são cobrados de quem pela Bamaq: do atual consorciado, do comprador da cota, ou isso pode ser definido entre as partes na negociação?

**Por que importa:**  
O simulador precisa saber se o custo reduz o proceeds do vendedor ou é suportado pelo cessionário.

**Relação com arquivos:**  
- Pendência: 6.1  
- Especificação: 31.3–31.4

**Resultado posterior:**  
—

---

### QN-048 — Qual é o prazo de análise para transferir uma cota contemplada?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** art. 60 exige aprovação cadastral, mas não foi informado SLA específico  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Depois que comprador e vendedor enviam toda a documentação para transferir uma cota contemplada, qual é o prazo médio/SLA da Bamaq para aprovar o cadastro do novo titular e concluir a cessão?

**Por que importa:**  
Determina em que mês o valor da venda entra no caixa e por quanto tempo a cota continua sob responsabilidade do vendedor.

**Relação com arquivos:**  
- Pendência: 6.1  
- Especificação: 31.5 / 31.11

**Resultado posterior:**  
—

---

### QN-049 — Tratamento fiscal da cessão da cota

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele respondeu custos Bamaq, mas não tributação da venda  
**Destinatário:** contador/tributarista

**Pergunta sugerida:**  
> Se eu vender/ceder uma cota de consórcio contemplada para terceiro por valor acima do que efetivamente desembolsei, qual é a base de custo correta para o IRPF? Entram parcelas pagas, lance em dinheiro, taxa administrativa, fundo de reserva e tarifas? O eventual ganho é tratado como ganho de capital?

**Por que importa:**  
Pode alterar significativamente o proceeds líquido da estratégia de saída por venda da cota.

**Relação com arquivos:**  
- Pendência: 6.2  
- Especificação: 31.10  
- Follow-up: AUD-DEC-014

**Resultado posterior:**  
—

---

### QN-050 — Qual é a fórmula exata do Seguro Prestamista?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele disse “percentual e dividido nas parcelas vincendas”  
**Destinatário:** Bamaq / seguradora

**Nova dúvida:**  
Ainda não sabemos qual é a base do percentual nem se o prêmio é calculado uma única vez e parcelado ou recalculado mensalmente.

**Pergunta sugerida:**  
> Sobre o seguro prestamista, você consegue me passar uma memória de cálculo concreta? Por exemplo, para uma cota de R$ 400 mil: qual é o percentual, sobre qual base ele incide e como chega ao valor que é acrescentado em cada parcela? O prêmio total é calculado uma vez e dividido pelas parcelas restantes ou é recalculado mês a mês?

**Por que importa:**  
Os dois métodos geram séries de custo muito diferentes.

**Relação com arquivos:**  
- Pendência: 10.1  
- Especificação: 17.3  
- Follow-up: EVID-024

**Resultado posterior:**  
—

---

### QN-051 — Qual é a seguradora e onde estão as condições do Seguro Prestamista?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** cobertura/regras ainda apenas comerciais  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Você consegue me enviar o certificado/condições gerais do Seguro Prestamista e informar qual é a seguradora? Queria conferir cobertura, exclusões, carência, capital segurado e forma de indenização.

**Por que importa:**  
Permite substituir sensibilidades genéricas por regra contratual e entender o real benefício econômico do seguro.

**Relação com arquivos:**  
- Pendência: 10.1  
- Especificação: 17.4–17.7

**Resultado posterior:**  
—

---

### QN-052 — Confirmar teto de R$ 800 mil e regra de idade/avalista

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** Michele informou condições que não aparecem no Regulamento Geral consultado  
**Destinatário:** Bamaq / seguradora

**Pergunta sugerida:**  
> E consegue confirmar em documento as regras que você comentou de cobertura máxima de R$ 800 mil por cota e impossibilidade de contratar o seguro acima de 70 anos? A exigência de avalista na contemplação para quem tem mais de 70 anos vem de uma política de crédito da Bamaq ou das condições do seguro?

**Por que importa:**  
São regras de elegibilidade diferentes: seguro e garantia de crédito não devem ser confundidos no software.

**Relação com arquivos:**  
- Pendência: 10.1  
- Especificação: 17.4

**Resultado posterior:**  
—

---

### QN-053 — É possível contratar o Seguro Prestamista depois da adesão?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** BAIXA  
**Origem:** Michele disse que pode ser incluído ao longo do contrato; Central de Ajuda pública só menciona aquisição na contratação  
**Destinatário:** Bamaq / seguradora

**Pergunta sugerida:**  
> Você comentou que o seguro pode ser incluído também depois que o consórcio já começou. Isso pode ser solicitado a qualquer momento ou existe janela, nova análise, carência ou limite de idade específico para a inclusão posterior?

**Relação com arquivos:**  
- Pendência: 10.1  
- Especificação: 17.4

**Resultado posterior:**  
Sim, comercialmente confirmado: Michele reiterou que o seguro pode ser incluído depois e que o financeiro recalcula o valor no momento da inclusão. Permanecem abertas carência, janela, elegibilidade, nova análise e fórmula do prêmio.


---

### QN-054 — Confirmar ausência de taxa de adesão/cadastro e de liberação do crédito nesta proposta

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** BAIXA  
**Origem:** Michele informou custo zero na entrada e análise de crédito gratuita  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Só para eu fechar a planilha de custos: nas quatro cotas dessa proposta QuintoAndar, a adesão/cadastro inicial é realmente R$ 0 e não existe nenhuma tarifa adicional de análise/liberação do crédito depois da contemplação, ficando à parte apenas vistoria/avaliação, cartório e demais despesas do imóvel?

**Por que importa:**  
Evita deixar um custo fixo omitido no fluxo.

**Relação com arquivos:**  
- Pendência: 10.2–10.3  
- Follow-up: EVID-025

**Resultado posterior:**  
—

---

### QN-055 — Existe cobrança/dedução das assembleias anteriores à adesão quando a cota contempla?

**Status:** CONFIRMAÇÃO FORMAL — CRÍTICA  
**Prioridade:** ALTA  
**Origem:** contradição entre resposta de Michele e Regulamento Geral Bamaq 2025  
**Destinatário:** Bamaq

**Contradição:**  
Michele afirmou que a nova cota não paga qualquer parcela retroativa e que todo o plano é diluído nos 214 meses restantes.

Porém, o Regulamento Geral Bamaq 2025, art. 8º, VI, “a”, diz que, se uma cota aderida a grupo já em andamento for contemplada, o consorciado deve pagar as mensalidades correspondentes às assembleias anteriores à adesão; caso contrário, o valor pode ser deduzido do crédito.

**Pergunta sugerida:**  
> Encontrei um ponto importante no Regulamento Geral e queria confirmar especificamente para o Grupo 4012/QuintoAndar. Você me explicou que a cota nova entra com 214 parcelas e não paga nada retroativo. Porém, o art. 8º, VI, “a”, do Regulamento 2025 diz que, se uma cota que entrou em grupo já em andamento for contemplada, devem ser pagas as mensalidades correspondentes às assembleias anteriores à adesão, ou o valor é deduzido do crédito. Essa regra ainda existe no Regulamento 2026 e se aplica às nossas cotas novas do Grupo 4012? Ou há uma condição específica da parceria que afasta essa cobrança?

**Por que importa:**  
Se houver dedução na contemplação, o crédito líquido e a necessidade de caixa podem mudar bastante, especialmente em contemplações precoces.

**Relação com arquivos:**  
- Pendência: 1.3  
- Especificação: 6.6  
- Follow-up: EVID-026

**Resultado posterior:**  
—

---

### QN-056 — A proposta formal mostrará exatamente 214 parcelas sem qualquer saldo anterior?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** memória comercial de entrada no grupo em andamento  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Na proposta/contrato das quatro cotas vai aparecer explicitamente que meu saldo inicial é só crédito + 24% + 1%, dividido pelas 214 parcelas restantes, sem qualquer saldo/parcela referente aos meses anteriores? Se puder, queria uma proposta ou memória oficial de uma cota de R$ 200 mil mostrando isso.

**Por que importa:**  
Uma memória oficial resolve de forma objetiva a ambiguidade entre a explicação comercial e o regulamento geral.

**Relação com arquivos:**  
- Pendência: 1.3  
- Especificação: 6.1–6.6

**Resultado posterior:**  
—

---

### QN-057 — Por que a “parcela reduzida 50%” não é exatamente metade?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** cotações oficiais/comerciais das cartas de 400k, 370k e 200k  
**Destinatário:** Michele / Bamaq

**Observação:**  
As três cotações usam o mesmo coeficiente e mostram parcela reduzida aproximadamente 49,9743% da integral, não 50% exatos.

**Pergunta sugerida:**  
> Vi um detalhe pequeno, mas como estou montando a memória de cálculo queria entender. Na carta de R$400 mil, metade de R$2.336,40 seria R$1.168,20, mas a cotação mostra R$1.167,60. O mesmo desvio proporcional aparece nas cartas de R$370 mil e R$200 mil. Qual é a fórmula/coefficient que a Bamaq usa para chegar à parcela reduzida?

**Por que importa:**  
Provavelmente não muda a decisão econômica, mas permite reproduzir exatamente os boletos e validar o motor.

**Relação com arquivos:**  
- Pendência: 2.1 / 1.3  
- Especificação: 6.4A  
- Follow-up: EVID-028

**Resultado posterior:**  
—

---

### QN-058 — O cashback nominal continua igual com lance embutido?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** ALTA  
**Origem:** cotações exibem 10% da carta nominal; explicação verbal anterior falou em crédito efetivamente usado  
**Destinatário:** QuintoAndar / Bamaq

**Pergunta sugerida:**  
> Nas cotações, a carta de R$400 mil aparece com R$40 mil de cashback. Se eu usar, por exemplo, R$40 mil de lance embutido e ficar com R$360 mil de crédito líquido para a compra, o cashback continua sendo os R$40 mil mostrados na cotação ou cai para R$36 mil?

**Por que importa:**  
Diferença material no retorno da operação e teste direto da exceção do regulamento da campanha.

**Relação com arquivos:**  
- Pendência: 2.7 / 8  
- Especificação: 25.3A  
- Follow-up: EVID-029

**Resultado posterior:**  
—

---

### QN-059 — De onde vem o limite de R$123,3 mil para ITBI/cartório?

**Status:** ABERTA  
**Prioridade:** MÉDIA  
**Origem:** mensagem comercial informa 10% e, ao mesmo tempo, R$123,3 mil  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Você comentou que eu poderia usar até 10% da carta para ITBI/cartório e colocou “até R$123,3 mil”. Como as quatro cartas somam R$1,37 milhão, 10% seriam R$137 mil. Os R$123,3 mil estão sendo calculados sobre qual base? É porque vocês já estão considerando algum lance embutido no exemplo?

**Por que importa:**  
Define quanto dos custos de aquisição pode ser financiado com o próprio crédito.

**Relação com arquivos:**  
- Pendência: 3.1 / 10.3  
- Especificação: 23.5  
- Follow-up: EVID-029

**Resultado posterior:**  
—

---

### QN-060 — Prazo para pagar o lance vencedor: 3 dias ou 2º dia útil?

**Status:** CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Origem:** nova mensagem de Michele versus ata do Grupo 4012 já analisada  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Na sua mensagem você comentou que, quando o lance contempla, eu tenho 3 dias para pagar. Na ata/regra do Grupo 4012 que eu li, aparecia vencimento no 2º dia útil. Para esse grupo e essas cotas, qual é o prazo que efetivamente vale?

**Por que importa:**  
Afeta a liquidez necessária para lance agressivo e eventual empréstimo de curto prazo.

**Relação com arquivos:**  
- Pendência: 2.4  
- Especificação: 11.8  
- Follow-up: EVID-030

**Resultado posterior:**  
—

---

### QN-061 — A assembleia do dia 18 é o aniversário/reajuste anual do Grupo 4012?

**Status:** ABERTA — CRÍTICA  
**Prioridade:** ALTA  
**Origem:** Michele disse que o reajuste ocorre no aniversário do grupo e que “a tabela vai virar na assembleia do dia 18”  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Você comentou duas coisas que eu queria conectar: o reajuste anual de 3% acontece no aniversário do grupo e a tabela atual vai virar na assembleia do dia 18. Essa assembleia do dia 18 é justamente o aniversário anual do Grupo 4012? Se eu contratar agora, minhas cotas já recebem os 3% nessa próxima assembleia?

**Por que importa:**  
Se o primeiro reajuste ocorrer poucas semanas após a adesão, carta, saldo e parcelas mudam quase imediatamente.

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: 6.7 / 7.2  
- Follow-up: EVID-031

**Resultado posterior:**  
—

---

### QN-062 — O que exatamente fica “travado” ao emitir o contrato agora?

**Status:** ABERTA — URGENTE  
**Prioridade:** ALTA  
**Origem:** cotação válida até 30/09 + proposta de emissão/alocação imediata  
**Destinatário:** Michele / QuintoAndar / Bamaq

**Pergunta sugerida:**  
> Quando você diz que consegue alocar as cotas agora e emitir o contrato para travar esses valores e condições, qual é exatamente o marco que garante a proposta? Basta a emissão do contrato, eu preciso assinar, pagar a primeira parcela ou as cotas precisam estar efetivamente alocadas no grupo até 30/09? E essa “trava” vale só para a tabela de entrada/cashback ou também impede um reajuste de 3% já na assembleia seguinte?

**Por que importa:**  
Evita assinar sob urgência sem saber qual benefício está sendo preservado e por quanto tempo.

**Relação com arquivos:**  
- Pendência: 1.5 / 8.4  
- Especificação: 25.10  
- Follow-up: EVID-034

**Resultado posterior:**  
—

---

### QN-063 — Qual é a data exata do aniversário do Grupo 4012?

**Status:** ABERTA  
**Prioridade:** ALTA  
**Origem:** regra de reajuste vinculada ao aniversário do grupo  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Qual é a data/mês exato do aniversário contratual do Grupo 4012 usado para aplicar os 3% anuais? Quero colocar essa data certa na simulação.

**Por que importa:**  
Permite substituir o calendário relativo da V2.54 pelo calendário real do grupo.

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: 6.7 / 7  
- Backlog software: SW-067

**Resultado posterior:**  
—

---

### QN-064 — Seguro incluído depois: há carência ou nova análise?

**Status:** ABERTA  
**Prioridade:** BAIXA  
**Origem:** contratação posterior confirmada comercialmente  
**Destinatário:** Bamaq / seguradora

**Pergunta sugerida:**  
> Perfeito, então o seguro pode ser colocado depois. Quando eu pedir a inclusão posteriormente, existe carência, nova análise de saúde/crédito ou alguma janela específica? E o prêmio passa a ser cobrado só dali para frente, sem nenhum valor retroativo, certo?

**Por que importa:**  
Define o primeiro mês de custo e evita retroatividade indevida no software.

**Relação com arquivos:**  
- Pendência: 10.1  
- Especificação: 17.4  
- Backlog software: SW-068

**Resultado posterior:**  
—
---

## Modelo de registro

### QN-001 — [Título curto]

**Status:** ABERTA  
**Prioridade:** ALTA / MÉDIA / BAIXA  
**Origem:** resposta da vendedora sobre [tema]  
**Destinatário:** Michelle / Bamaq / QuintoAndar / banco / contador / outro

**O que ela respondeu:**  
[resumo fiel]

**O que já tínhamos nos documentos:**  
[regra/premissa/pendência anterior]

**Nova dúvida gerada:**  
[pergunta]

**Por que importa:**  
[impacto financeiro, contratual ou de modelagem]

**Pergunta sugerida:**  
> [texto pronto para enviar]

**Relação com arquivos:**  
- Pendência relacionada:
- Especificação relacionada:
- Follow-up relacionado:

**Resultado posterior:**  
[preencher quando respondida]