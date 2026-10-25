# Backlog de novas perguntas — QuintoAndar / Bamaq

**Criado em:** 28/09/2026  
**Objetivo:** registrar novas perguntas que surgirem a partir das respostas da vendedora, sem misturá-las com as pendências já existentes do simulador.

**Estado canônico:** rodada `pre_respostas30`, com reconciliações posteriores de confiabilidade incorporadas. Perguntas respondidas permanecem no arquivo para rastreabilidade, mas não devem ser reenviadas sem nova evidência contraditória.

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


## Estado atual antes de novas perguntas — V3.15

A numeração de perguntas permanece histórica e rastreável. Mudanças internas de software não consomem novos QNs.

A próxima pergunta genuinamente nova continua sendo **QN-068**.

Perguntas já respondidas permanecem neste arquivo para auditoria, mas NÃO devem ser reenviadas sem nova evidência contraditória.

Pontos comerciais/documentais que ainda podem justificar novas perguntas, se voltarmos a negociar com a Bamaq:
- confirmação documental de que as quatro cotas novas do Grupo 4012 não recebem cobrança/dedução por assembleias anteriores;
- memória/fórmula oficial da parcela reduzida cotada;
- prazo formal do cashback: 5 versus 7 dias úteis;
- tratamento tributário/declaratório do cashback;
- critério de desempate no Lance Livre e tratamento de saldo residual do Fundo Comum, se operacionalmente relevante;
- dia exato do reajuste e ordem reajuste × contemplação no mês coincidente;
- elegibilidade de rendimentos financeiros acumulados na base do cashback, caso queiramos usar a sensibilidade inclusiva;
- regras ainda abertas de substituição de garantia, resgate, cessão e seguro.

Não reabrir apenas por rotina:
- base do Lance Livre;
- ranking do Lance Livre;
- teto de R$400 mil no produto QuintoAndar;
- cashback de R$95,9 mil no cenário canônico com 30% embutido;
- 80% do CDI como premissa líquida-base de modelagem;
- marco operacional histórico de adesão até 30/09.

### QN-001 — Como é determinado o rendimento da carta contemplada?

**Status:** RESPONDIDA COMERCIALMENTE — CAMADAS BRUTA E LÍQUIDA RECONCILIADAS  
**Prioridade:** ALTA  
**Origem:** respostas sucessivas de Michele em 28–29/09/2026  
**Destinatário:** Michele / Bamaq

**Resposta consolidada:**  
Michele distinguiu agora duas camadas:

1. **Rentabilidade bruta das aplicações do grupo:** geralmente entre **98% e 105% do CDI**;
2. **Rentabilidade líquida efetivamente repassada à cota:** para projeção financeira, orientação interna de usar aproximadamente **80% do CDI**.

Segundo ela, o crédito contemplado permanece em aplicação conservadora de renda fixa/alta liquidez e o repasse ao consorciado ocorre já líquido dos efeitos tributários/custos da aplicação.

**Interpretação:**  
A aparente contradição anterior passa a ser entendida como:
- 98%–105% = desempenho bruto da aplicação/fundo em relação ao CDI;
- ~80% = premissa líquida de caixa para a carta contemplada.

**Verificação externa do fundo informado:**  
O Itaú Premium RF Referenciado DI, CNPJ 03.184.233/0001-80, existe e acompanha CDI. A lâmina oficial do Itaú de julho/2026 mostra:
- 2026 até julho: 97,88% do benchmark;
- 12 meses: 97,53%;
- 24 meses: 98,01%;
- 36 meses: 100,49%.

Isso é compatível com a ordem de grandeza bruta informada comercialmente.

**Decisão de modelagem:**  
Para uma projeção-base realista, usar **80% do CDI como rendimento líquido da carta**, sem aplicar novo IR/haircut sobre esse rendimento dentro do fluxo-base.

Manter input editável/sensibilidade, pois não é taxa contratualmente garantida.

**Relação com arquivos:**  
- Pendência: 1.1 / R1  
- Especificação: 19.2–19.3 / 59.4  
- Software: SW-002 / SW-004  
- Follow-up: EVID-003 / EVID-008 / EVID-038

**Resultado posterior:**  
Questão conceitualmente resolvida em 29/09/2026. A única ressalva residual é que a expressão comercial “80% do CDI líquido” é imprecisa; para o simulador, o número deve ser tratado como retorno líquido final equivalente a ~80% da referência CDI, sem nova tributação.

---

### QN-002 — Onde fica aplicado o crédito contemplado e qual é a política de investimento?

**Status:** RESPONDIDA COMERCIALMENTE; IDENTIDADE DO FUNDO VERIFICADA EXTERNAMENTE  
**Prioridade:** ALTA  
**Origem:** resposta de Michele em 29/09/2026  
**Destinatário:** Bamaq, se quisermos prova específica do Grupo 4012

**Resposta recebida:**  
Michele informou:
- instituição: Itaú;
- fundo: **Itaú Premium**;
- CNPJ: **03.184.233/0001-80**;
- natureza: renda fixa conservadora e de alta liquidez;
- recursos ficam vinculados à conta/aplicação do grupo enquanto o crédito não é utilizado.

**Verificação externa:**  
O CNPJ informado corresponde ao **Itaú Premium Renda Fixa Referenciado DI**, fundo existente e administrado/gerido pelo Itaú. A documentação pública o classifica como fundo de renda fixa que busca acompanhar o CDI e informa liquidez diária.

**O que ainda não foi provado documentalmente:**  
Não recebemos extrato do Grupo 4012 mostrando que esse é de fato o veículo em que os recursos daquele grupo estão aplicados hoje.

**Conclusão:**  
A identidade do fundo deixou de ser apenas uma referência vaga e passa a ser uma premissa comercial concreta e verificável. Para auditoria contratual máxima, ainda seria desejável um extrato/posição do Grupo 4012.

**Relação com arquivos:**  
- Pendência: 1.1 / 11.2  
- Especificação: 19.3A  
- Follow-up: EVID-003 / EVID-038

**Resultado posterior:**  
Nome e CNPJ recebidos e identidade do fundo confirmada em fontes públicas. Uso efetivo pelo Grupo 4012 permanece confirmado apenas comercialmente.

---

### QN-003 — O que significa “líquido” na remuneração da carta?

**Status:** RESPONDIDA COMERCIALMENTE  
**Prioridade:** ALTA  
**Origem:** respostas de Michele em 28–29/09/2026  
**Destinatário:** Michele / Bamaq

**Resposta consolidada:**  
Michele esclareceu que:
- 98%–105% do CDI se refere à rentabilidade **bruta** típica das aplicações;
- o que efetivamente é repassado à cota já é tratado de forma **líquida**;
- para projeção de caixa, a Bamaq orienta aproximadamente **80% do CDI**;
- não deve haver nova cobrança de IR sobre esse rendimento quando ele é creditado à carta, segundo a explicação comercial.

**Implicação para o simulador:**  
O parâmetro de 80% deve representar o retorno **já líquido** da carta. Portanto, não aplicar simultaneamente:
- `80% do CDI`; e
- outro desconto de IR sobre esse mesmo rendimento,

pois isso produziria dupla penalização.

**Ressalva:**  
O tratamento fiscal de eventual recebimento em espécie/saque continua sendo uma questão separada (QN-014).

**Relação com arquivos:**  
- Pendência: 1.4 / R1 / B6  
- Especificação: 19 / 59.3–59.4  
- Software: SW-011  
- Follow-up: EVID-003 / EVID-038

**Resultado posterior:**  
Respondida para modelagem: 80% do CDI é uma premissa líquida de caixa, não uma taxa bruta que ainda receberá novo haircut tributário.

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

**Status:** RESPONDIDA COMERCIALMENTE QUANTO À ORDEM; DESEMPATE AINDA ABERTO  
**Prioridade:** MÉDIA  
**Origem:** respostas de Michele + atas reais do Grupo 4012  
**Destinatário:** Bamaq, apenas se quisermos fechar desempate

**Nova resposta de 29/09/2026:**  
Michele explicou que o Lance Livre é uma disputa percentual e que o sistema:
1. calcula cada oferta como percentual do saldo devedor atualizado da respectiva cota na data da assembleia;
2. ordena os lances do maior percentual para o menor;
3. contempla nessa ordem até esgotar o saldo disponível no Fundo Comum do mês.

**O que isso resolve:**  
A lógica principal de priorização por Lance Livre passa a ser:

`ranking = pct_livre sobre saldo_devedor_atualizado`

em ordem decrescente, limitada pela capacidade financeira do Fundo Comum.

**Histórico compatível:**  
As atas mostram quantidades variáveis de vencedores por Lance Livre conforme o mês, coerentes com a existência de uma restrição financeira por Fundo Comum.

**O que ainda pode permanecer aberto:**  
- critério de desempate quando duas ou mais cotas ofertam exatamente o mesmo percentual;
- eventual regra adicional se o saldo restante do Fundo Comum não comportar integralmente a próxima contemplação;
- eventual tratamento especial para múltiplas cotas do mesmo CPF, se existir.

**Pergunta residual opcional:**  
> Entendi que o sistema ordena os Lances Livres do maior percentual para o menor até esgotar o Fundo Comum. Se houver empate exato de percentual, qual é o critério de desempate?

**Relação com arquivos:**  
- Pendência: 2.4  
- Especificação: 11.3 / 11.10 / 11.11  
- Follow-up: EVID-042

**Resultado posterior:**  
A regra principal de ordenação/capacidade foi respondida. A única lacuna relevante é o desempate.

---

### QN-006 — Qual é a faixa permitida do Lance Livre?

**Status:** RESPONDIDA PARCIALMENTE POR EVIDÊNCIA EMPÍRICA  
**Prioridade:** ALTA  
**Origem:** Michele informou que o Lance Livre usa percentual do saldo devedor + atas do Grupo 4012  
**Destinatário:** Michele / Bamaq

**Nova evidência:**  
As atas oficiais recebidas mostram Lance Livre vencedor de até **73,0000%**, portanto percentuais nessa faixa são operacionalmente aceitos pelo grupo.

Percentuais vencedores observados:
- abril: 60,1400%;
- maio: 60,9867%;
- julho: 73,0000% e 72,7300%;
- agosto: 70,6877%, 70,5508%, 69,5200% e 68,9081%;
- setembro: 73,0000%, 72,0000%, 72,0000% e 72,0000%.

**Conclusão:**  
45% era apenas um exemplo de estratégia, não uma faixa competitiva observada até aqui. Ainda não sabemos o mínimo/máximo regulamentar permitido, mas sabemos documentalmente que 73% é aceito.

**Pergunta sugerida, se ainda quisermos fechar a regra formal:**  
> Pelas atas vi lances livres vencedores de até 73%. Existe algum mínimo ou máximo regulamentar para ofertar Lance Livre, ou qualquer percentual até o saldo devedor pode ser ofertado?

**Relação com arquivos:**  
- Pendência: 2.4 / 11.1  
- Especificação: 11.3 / 11.11  
- Follow-up: EVID-036

**Resultado posterior:**  
Faixa formal ainda aberta; histórico prova admissibilidade de pelo menos 73%.

---

### QN-007 — Reconciliar a base efetiva do Lance Livre na memória de cálculo

**Status:** RESPONDIDA COMERCIALMENTE DE FORMA INEQUÍVOCA  
**Prioridade:** ALTA  
**Origem:** pergunta direta + resposta específica de Michele em 29/09/2026  
**Destinatário:** Michele / Bamaq

**Resposta recebida:**  
Michele afirmou expressamente que, no sistema da Bamaq:

> a base de cálculo da oferta de Lance Livre é **sempre o saldo devedor da cota na data da assembleia**.

Ela também confirmou que os percentuais de 60%–73% publicados nas atas são calculados sobre essa mesma base:
- saldo devedor atualizado da cota;
- no mês específico da assembleia.

**Regra operacional confirmada:**  

`L_livre = pct_livre × saldo_devedor_atualizado_na_data_da_assembleia`

O sistema classifica os vencedores do maior percentual para o menor até esgotar o Fundo Comum do mês.

**Reconciliação da memória de R$ 400 mil:**  
A memória anterior exibia:
- saldo devedor = R$ 495.330;
- percentual Livre = 45%;
- embutido = R$ 120.000;
- recursos próprios = R$ 105.000.

Pela regra agora confirmada:

`45% × 495.330 = R$ 222.898,50`

e:

`R$ 222.898,50 - R$ 120.000 = R$ 102.898,50`

Portanto, os R$ 105.000 de recursos próprios / R$ 225.000 totais daquela memória NÃO reproduzem a regra oficial/comercial agora explicitamente confirmada.

**Decisão:**  
- tratar a memória de R$225 mil como exemplo/calculadora inconsistente, arredondamento indevido ou erro de composição;
- NÃO alterar a fórmula do simulador para reproduzi-la;
- usar a resposta direta sobre o sistema como regra de modelagem;
- se um contrato ou memória oficial futura contradisser isso, reabrir a questão.

**Relação com arquivos:**  
- Pendência: 2.4 / 11.1  
- Especificação: 11.3 / 11.5  
- Follow-up: EVID-004 / EVID-005 / EVID-035 / EVID-042  
- Software: SW-005 / SW-006

**Resultado posterior:**  
Base do Lance Livre fechada para modelagem: saldo devedor atualizado da cota na data da assembleia.

---

### QN-008 — Por que a memória mostra “209 meses” após contemplação na 4ª parcela?

**Status:** RESPONDIDA PARA MODELAGEM — RÓTULO DA MEMÓRIA É INCONSISTENTE COM O PRÓPRIO CÁLCULO  
**Prioridade:** ALTA  
**Origem:** nova memória de cálculo enviada em 29/09/2026  
**Destinatário:** Michele / Bamaq, apenas se quisermos corrigir/confirmar o rótulo documental

**Nova evidência:**  
A memória mostra:
- prazo inicial: 214 meses;
- 4 parcelas pagas;
- saldo final pós-lance: R$ 270.330;
- “Nova Parcela (209 meses): R$ 1.287”.

**Reconciliação matemática:**  

`R$ 270.330 / 209 = R$ 1.293,44`

Isso NÃO reproduz a parcela exibida.

Já:

`R$ 270.330 / 210 = R$ 1.287,29`

reproduz exatamente, por arredondamento, os R$ 1.287 mostrados.

Além disso:

`214 - 4 = 210`

**Conclusão para o simulador:**  
A própria memória numérica sustenta a convenção já usada no motor:

`P_pos = saldo_remanescente / (N - mesCont)`

para contemplação na 4ª parcela, resultando em 210 parcelas restantes.

O texto “209 meses” deve ser tratado como provável erro de rótulo/contagem no material comercial até que exista documento que demonstre outra convenção.

**Pergunta opcional de saneamento documental:**  
> Notei que o print escreve “209 meses”, mas R$ 270.330 / 209 dá R$ 1.293,44, enquanto a parcela mostrada de R$ 1.287 bate com 210 meses (R$ 270.330 / 210 = R$ 1.287,29). Posso considerar que são 210 parcelas restantes e que “209” no print é apenas um erro de rótulo?

**Relação com arquivos:**  
- Pendência: 1.3 / 2.4  
- Especificação: seção 10  
- Software: SW-007  
- Follow-up: EVID-005 / EVID-035

**Resultado posterior:**  
Resolvida para fins de modelagem: manter 210 meses. Não alterar o motor para 209 com base nesse print.

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

**Status:** RESPONDIDA COMERCIALMENTE  
**Prioridade:** ALTA  
**Origem:** áudio de Michele em 29/09/2026  
**Destinatário:** Michele / Bamaq

**Resposta recebida:**  
Michele afirmou que tanto o Lance Livre quanto o Lance Embutido amortizam o saldo e que o efeito pode ser direcionado:
- para redução do valor da parcela; OU
- para redução do prazo.

**Conclusão:**  
A possibilidade de escolher entre parcela e prazo passa a ser confirmação comercial suficiente para a arquitetura do simulador.

Ainda falta, para reprodução contratual exata:
- saber como a redução de prazo é operacionalizada (quantas parcelas finais são abatidas / regra de ordem);
- confirmar se a opção é feita no momento do lance e se pode variar por cota.

**Relação com arquivos:**  
- Pendência: 2.4  
- Especificação: seção 11  
- Software: SW-008  
- Follow-up: EVID-030 / EVID-035

**Resultado posterior:**  
Respondida comercialmente em 29/09/2026: há opção entre reduzir parcela e reduzir prazo.

---

### QN-011 — Qual faixa de rentabilidade está correta: 98%–105% ou 80%–105% do CDI?

**Status:** RESPONDIDA / RECONCILIADA  
**Prioridade:** ALTA  
**Origem:** esclarecimento de Michele em 29/09/2026  
**Destinatário:** Michele / Bamaq

**Reconciliação recebida:**  
As duas referências tratavam de grandezas diferentes:
- **98%–105% do CDI:** rentabilidade bruta típica do fundo/aplicações;
- **~80% do CDI:** rentabilidade líquida que a Bamaq orienta usar em projeções da carta contemplada.

Logo, não existe mais uma faixa única “80%–105% líquida”.

**Regra de modelagem:**  
- cenário-base líquido: **80% do CDI**;
- 98%–105% NÃO deve ser usado como faixa líquida da carta;
- manter sensibilidade editável para não transformar 80% em garantia.

**Verificação externa:**  
A lâmina oficial do Itaú Premium de julho/2026 mostra rentabilidade bruta acumulada de 97,88% do benchmark no ano e 97,53% nos últimos 12 meses, reforçando que a ordem de grandeza bruta fica próxima de 98% do CDI.

**Relação com arquivos:**  
- Pendência: 1.1 / R1  
- Especificação: 19.3 / 59.4  
- Software: SW-004  
- Follow-up: EVID-008 / EVID-038

**Resultado posterior:**  
Resolvida em 29/09/2026. Usar 80% do CDI como referência líquida de projeção.

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

**Status:** RESPONDIDA COMERCIALMENTE  
**Prioridade:** MÉDIA  
**Origem:** resposta de Michele em 29/09/2026  
**Destinatário:** Bamaq apenas para extrato/prova específica do grupo

**Resposta recebida:**  
- Fundo: **Itaú Premium Renda Fixa Referenciado DI**;
- CNPJ: **03.184.233/0001-80**;
- instituição: Itaú.

**Verificação externa:**  
Nome/CNPJ correspondem a fundo real e ativo, com benchmark CDI e perfil de renda fixa de baixa volatilidade/alta liquidez.

**Pendente apenas para auditoria documental forte:**  
Receber extrato/posição do Grupo 4012 ou documento Bamaq que demonstre que os recursos daquele grupo estão efetivamente nesse veículo hoje.

**Relação com arquivos:**  
- Pendência: 1.1 / 11.2  
- Especificação: 19.3A  
- Follow-up: EVID-038

**Resultado posterior:**  
Respondida comercialmente; identidade do fundo verificada externamente.

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

**Status:** RESPONDIDA COMERCIALMENTE  
**Prioridade:** ALTA  
**Origem:** Michele confirmou reajuste fixo de 3% a.a. e posteriormente informou o primeiro reajuste da proposta  
**Destinatário:** Michele / Bamaq

**Nova dúvida original:**  
Saber se a cota herda a data-base do grupo ou se conta 12 meses a partir da adesão individual, e em que mês ocorre o primeiro reajuste.

**Por que importa:**  
O simulador precisa posicionar o primeiro aumento de carta/saldo/parcela no mês correto. Um deslocamento de alguns meses altera lance, saldo e aportes.

**Pergunta sugerida original:**  
> Perfeito sobre os 3% fixos. Como estou entrando num grupo que já está em andamento, minhas cotas herdam a data-base anual do Grupo 4012 ou contam 12 meses a partir da minha adesão? Em que mês exatamente acontece o primeiro reajuste?

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: 6.7 / 7.2  
- Backlog software: SW-067

**Resultado posterior:**  
Michele primeiro informou que o reajuste anual ocorre no aniversário do grupo. Em 29/09/2026, esclareceu operacionalmente que as novas cotas contratadas agora NÃO recebem 3% na próxima assembleia do dia 18 e que o primeiro reajuste ocorrerá em **abril de 2027**, daqui a aproximadamente sete meses. Em resposta específica ao item 1.1, reafirmou que a anotação anterior de “primeiro reajuste daqui a 7 meses” estava correta.

Para a resolução mensal do simulador, a questão do primeiro reajuste está respondida. O dia exato dentro de abril/2027 permanece separado em QN-063 caso seja necessária precisão diária.

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

**Status:** RESPONDIDA COMERCIALMENTE PARA O CENÁRIO ATUAL  
**Prioridade:** ALTA  
**Origem:** item 4.1.3.1 do Regulamento da Campanha + resposta específica de Michele em 29/09/2026  
**Destinatário:** QuintoAndar / Bamaq apenas se houver divergência no contrato/documento final

**Resposta recebida:**  
Michele esclareceu que, quando várias cartas contempladas são usadas para comprar um único imóvel, Bamaq/QuintoAndar tratam a operação de forma **unificada** para faturamento, garantia e alienação fiduciária.

No cenário:
- imóvel = aproximadamente R$ 1.000.000;
- soma nominal das quatro cartas = R$ 1.370.000;
- lance embutido de 30% = R$ 411.000;
- crédito líquido efetivamente faturado/liberado ao vendedor = R$ 959.000.

Segundo ela, a comparação do item 4.1.3.1 é feita sobre a **operação agregada**, e não cota por cota.

Como:
`R$ 1.000.000 < R$ 1.370.000`

o imóvel não alcança o valor nominal contratado agregado. Com o lance embutido, o montante efetivamente faturado/liberado fica em R$ 959 mil.

**Base informada para o cashback:**

`base_cashback = credito_liquido_efetivamente_faturado_e_liberado`

Logo:

`10% × R$ 959.000 = R$ 95.900`

**Consequência:**  
A hipótese de R$ 137 mil de cashback fica descartada para este cenário com 30% de embutido nas quatro cotas.

**Ressalva:**  
A resposta resolve comercialmente a interpretação multi-cota. Antes da contratação definitiva, conferir se contrato/regulamento aplicável não traz redação conflitante.

**Relação com arquivos:**  
- Pendência: 2.7 / 8  
- Especificação: 25.3A–25.4  
- Software: SW-028  
- Follow-up: EVID-015 / EVID-037 / EVID-045

**Resultado posterior:**  
Respondida: a comparação é agregada e o cashback do cenário é R$ 95.900.

---

### QN-031 — Lance embutido reduz ou não a base da exceção do cashback?

**Status:** RESPONDIDA COMERCIALMENTE — SIM  
**Prioridade:** ALTA  
**Origem:** respostas específicas de Michele em 29/09/2026  
**Destinatário:** QuintoAndar / Bamaq apenas se houver divergência documental

**Resposta consolidada:**  
Sim. No cenário atual, o lance embutido reduz o crédito que efetivamente é faturado e liberado ao vendedor e, por consequência, reduz a base de cashback.

Cálculo confirmado:
- crédito nominal = R$ 1.370.000;
- embutido 30% = R$ 411.000;
- crédito líquido = R$ 959.000;
- cashback = 10% × R$ 959.000 = **R$ 95.900**.

**Regra operacional informada:**

`base_cashback = credito_liquido_faturado_e_liberado`

**Relação com arquivos:**  
- Pendência: 2.7 / 8  
- Especificação: 25.3A / 25.4  
- Software: SW-028  
- Follow-up: EVID-037 / EVID-045

**Resultado posterior:**  
Respondida. Não aplicar cashback sobre os R$ 1,37 milhão nominais quando 30% são consumidos como lance embutido.

---

### QN-032 — O prazo contratual do cashback é 5 ou 7 dias úteis?

**Status:** ABERTA — DIVERGÊNCIA REITERADA  
**Prioridade:** MÉDIA  
**Origem:** Michele reiterou 7 dias úteis; regulamento disponível diz 5 dias úteis  
**Destinatário:** QuintoAndar

**Nova resposta:**  
Michele voltou a afirmar que o cashback seria pago por PIX/depósito em conta em **até 7 dias úteis após a compra no cartório**.

**Documento disponível:**  
O Regulamento da Campanha estabelece **até 5 dias úteis**, contados do registro da alienação na matrícula e do pagamento do crédito ao vendedor.

**Conclusão:**  
A divergência 5 × 7 dias não foi resolvida; foi reiterada.

**Pergunta sugerida:**  
> Sobre o prazo: você mencionou novamente até 7 dias úteis, mas o regulamento que tenho diz até 5 dias úteis após o registro da alienação e o pagamento ao vendedor. Existe um aditivo/regulamento mais recente mudando para 7 dias? Se sim, consegue me enviar?

**Relação com arquivos:**  
- Pendência: 8.1  
- Especificação: 25.5–25.6  
- Software: SW-029  
- Follow-up: EVID-015 / EVID-037

**Resultado posterior:**  
Pendente de documento posterior; por enquanto a especificação contratual continua usando 5 dias úteis.

---

### QN-033 — Qual é o tratamento fiscal do cashback e ele reduz o custo de aquisição do imóvel?

**Status:** PARCIALMENTE RESPONDIDA COMERCIALMENTE — ISENÇÃO DE IR ALEGADA, MAS NÃO DOCUMENTADA  
**Prioridade:** MÉDIA  
**Origem:** resposta de Michele em 29/09/2026  
**Destinatário:** contador / QuintoAndar, se necessário

**Nova informação:**  
Michele afirmou que os R$ 95.900 de cashback seriam enviados por PIX e seriam “totalmente isentos de Imposto de Renda”.

**O que isso resolve:**  
Do ponto de vista comercial, a empresa está apresentando o cashback como valor líquido recebido pelo cliente, sem retenção de IR.

**O que NÃO está resolvido:**  
A fala da vendedora não substitui:
- regra tributária aplicável ao beneficiário;
- eventual obrigação de declaração;
- definição de natureza jurídica/fiscal do cashback;
- eventual impacto no custo de aquisição do imóvel para ganho de capital futuro.

**Decisão de modelagem:**  
No fluxo financeiro principal, registrar entrada de caixa de **R$ 95.900 sem retenção na fonte**, conforme a condição comercial informada.

Não concluir a partir disso que:
- não existe obrigação declaratória; ou
- o cashback não altera a base/custo fiscal do imóvel.

Essas questões continuam fora do motor até validação tributária específica.

**Relação com arquivos:**  
- Pendência: 8.3  
- Especificação: 25.7–25.8  
- Follow-up: EVID-045

**Resultado posterior:**  
Isenção de IR foi alegada comercialmente, mas o tratamento fiscal completo continua pendente.

---

### QN-034 — A campanha termina em 30/09/2026 ou foi prorrogada?

**Status:** RESPONDIDA COMERCIALMENTE — MARCO OPERACIONAL DE ADESÃO ESCLARECIDO  
**Prioridade:** ALTA / URGENTE  
**Origem:** Regulamento da Campanha + resposta específica de Michele em 29/09/2026  
**Destinatário:** Michele / QuintoAndar / Bamaq

**Resposta recebida:**  
Michele esclareceu que, para entrar no grupo/participar da próxima assembleia e preservar a condição de cashback dentro do prazo atual, o fluxo precisa ocorrer até 30/09:

1. emissão/homologação do contrato;
2. recebimento do contrato por e-mail;
3. aceite eletrônico pelo cliente;
4. pagamento da primeira parcela.

Segundo ela, com o aceite eletrônico e o pagamento da primeira parcela:
- o cliente “já entra no plano”;
- grupo e número de cota são alocados;
- passa a ter acesso ao aplicativo;
- já fica apto a participar da assembleia seguinte.

Ela também informou que a **segunda parcela vence em 15/11/2026**.

**Conclusão operacional:**  
Para a proposta atual, NÃO basta apenas enviar documentos ou receber o contrato. O marco comercial indicado pela vendedora exige **aceite eletrônico + pagamento da primeira parcela até 30/09/2026**, após a emissão do contrato.

**Ressalva:**  
Essa é uma confirmação comercial específica. O contrato final deve ser conferido antes do aceite para garantir que:
- cashback;
- valores das parcelas;
- quatro cotas;
- grupo;
- prazo;
- demais condições

estejam coerentes com a proposta negociada.

**Relação com arquivos:**  
- Pendência: 8.4  
- Especificação: 25.9–25.10  
- Software: SW-069  
- Follow-up: EVID-016 / EVID-034 / EVID-039 / EVID-044

**Resultado posterior:**  
Marco operacional comercial fechado: emissão do contrato → aceite eletrônico → pagamento da primeira parcela até 30/09. Não houve indicação de prorrogação.

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

**Status:** RESPONDIDA COMERCIALMENTE — CONFIRMAÇÃO DOCUMENTAL RESIDUAL  
**Prioridade:** ALTA  
**Origem:** contradição entre resposta de Michele e Regulamento Geral Bamaq 2025  
**Destinatário:** Bamaq / contrato-regulamento aplicável

**Contradição original:**  
Michele havia afirmado que a nova cota não paga qualquer parcela retroativa e que todo o plano é diluído nos 214 meses restantes.

Porém, o Regulamento Geral Bamaq 2025, art. 8º, VI, “a”, diz que, se uma cota aderida a grupo já em andamento for contemplada, o consorciado deve pagar as mensalidades correspondentes às assembleias anteriores à adesão; caso contrário, o valor pode ser deduzido do crédito.

**Pergunta enviada:**  
> Encontrei um ponto importante no Regulamento Geral e queria confirmar especificamente para o Grupo 4012/QuintoAndar. Você me explicou que a cota nova entra com 214 parcelas e não paga nada retroativo. Porém, o art. 8º, VI, “a”, do Regulamento 2025 diz que, se uma cota que entrou em grupo já em andamento for contemplada, devem ser pagas as mensalidades correspondentes às assembleias anteriores à adesão, ou o valor é deduzido do crédito. Essa regra ainda existe no Regulamento 2026 e se aplica às nossas cotas novas do Grupo 4012? Ou há uma condição específica da parceria que afasta essa cobrança?

**Resultado posterior — 29/09/2026:**  
Michele respondeu de forma categórica e específica que, para as quatro cotas do Grupo 4012 / produto QuintoAndar-Bamaq, **não existe e não haverá cobrança ou desconto retroativo** relativo às assembleias anteriores à entrada.

Ela explicou que, segundo a operação comercial oferecida:
- são cotas novas de lançamento/abertura de vagas em grupo já em andamento;
- não existe assunção de dívida ou histórico de outra cota;
- saldo e parcelas são recalculados do zero para o novo aderente e distribuídos pelo prazo remanescente;
- na contemplação, o crédito liberado seria o valor integral da carta contratada, sem desconto por mensalidades anteriores.

Ela atribuiu a cláusula genérica do regulamento a situações de substituição/repescagem de cotas canceladas. Essa justificativa deve ser registrada como **interpretação comercial da Michele**, não como reconciliação documental já comprovada.

**Conclusão para modelagem:**  
Para a proposta atual, não modelar qualquer ajuste retroativo. Reabrir somente se contrato/regulamento aplicável trouxer regra contraditória.

**Pendência residual:**  
Conferir no contrato, Regulamento 2026 ou documento específico do produto a base formal que afasta a cláusula do Regulamento 2025.

**Relação com arquivos:**  
- Pendência: 1.3  
- Especificação: 6.6  
- Follow-up: EVID-026  
- Backlog software: SW-060

---

### QN-056 — A proposta formal mostrará exatamente 214 parcelas sem qualquer saldo anterior?

**Status:** RESPONDIDA COMERCIALMENTE — AGUARDAR DOCUMENTO FINAL  
**Prioridade:** ALTA  
**Origem:** memória comercial de entrada no grupo em andamento  
**Destinatário:** Michele / Bamaq

**Pergunta sugerida:**  
> Na proposta/contrato das quatro cotas vai aparecer explicitamente que meu saldo inicial é só crédito + 24% + 1%, dividido pelas 214 parcelas restantes, sem qualquer saldo/parcela referente aos meses anteriores? Se puder, queria uma proposta ou memória oficial de uma cota de R$ 200 mil mostrando isso.

**Resultado posterior — 29/09/2026:**  
Michele afirmou que o saldo devedor por cota é estritamente o valor da carta de crédito + taxa de administração + fundo de reserva, diluídos nas parcelas futuras, e que os números apresentados na proposta comercial são definitivos para a operação. Também reafirmou que não existe valor anterior a ser pago ou deduzido na contemplação.

Isso responde comercialmente à pergunta, mas não substitui a conferência da proposta/contrato final solicitada no próprio item.

**Pendência residual:**  
Verificar no documento final:
- 214 parcelas contratuais;
- saldo inicial correspondente a crédito + 24% + 1%;
- inexistência de qualquer saldo, ajuste ou dedução por assembleias anteriores.

**Relação com arquivos:**  
- Pendência: 1.3  
- Especificação: 6.1–6.6  
- Follow-up: EVID-026

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

**Status:** RESPONDIDA — NÃO  
**Prioridade:** ALTA  
**Origem:** respostas específicas de Michele em 29/09/2026  
**Destinatário:** QuintoAndar / Bamaq

**Resposta consolidada:**  
Não.

No cenário das quatro cotas:
- cashback nominal destacado nas propostas = R$ 137.000;
- 30% de embutido = R$ 411.000;
- crédito líquido faturado/liberado = R$ 959.000;
- cashback aplicável = **R$ 95.900**.

Michele também esclareceu que a análise multi-cota é agregada e que os R$137 mil somente seriam atingidos se o valor efetivamente faturado/utilizado na compra fosse os R$1,37 milhão nominais, sem redução promovida pelo lance embutido.

**Consequência:**  
Para o cenário atual, R$137 mil deixa de ser uma hipótese plausível de cashback.

**Relação com arquivos:**  
- Pendência: 2.7 / 8  
- Especificação: 25.3A / 25.4  
- Follow-up: EVID-029 / EVID-037 / EVID-045  
- Software: SW-028

**Resultado posterior:**  
Fechada em R$95,9 mil para o cenário com 30% de embutido.

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

**Status:** RESPONDIDA / RECONCILIADA  
**Prioridade:** MÉDIA  
**Origem:** nova resposta de Michele em 29/09/2026 + ata do Grupo 4012 já analisada  
**Destinatário:** Bamaq

**Resposta recebida:**  
Michele afirmou em áudio que o lance vencedor deve ser pago em **até dois dias úteis**, acrescentando a expressão “48 horas”.

**Reconciliação:**  
A regra “até dois dias úteis” converge com a ata do Grupo 4012 anteriormente analisada, que apontava vencimento no segundo dia útil. A referência anterior a “3 dias” fica superada para esta proposta.

Para modelagem operacional, usar **2 dias úteis**. A expressão “48 horas” deve ser lida como explicação informal, pois 48 horas corridas e dois dias úteis não são sempre equivalentes em fins de semana/feriados.

**Por que importa:**  
Afeta a liquidez necessária para lance agressivo e eventual empréstimo de curto prazo.

**Relação com arquivos:**  
- Pendência: 2.4  
- Especificação: 11.8  
- Software: SW-066  
- Follow-up: EVID-030 / EVID-035

**Resultado posterior:**  
Prazo operacional reconciliado em 29/09/2026: segundo dia útil / até 2 dias úteis.

---

### QN-061 — A assembleia do dia 18 é o aniversário/reajuste anual do Grupo 4012?

**Status:** RESPONDIDA — E CALENDÁRIO OPERACIONAL MENSAL AGORA MAIS CLARO  
**Prioridade:** MÉDIA  
**Origem:** esclarecimentos de Michele em 29/09/2026  
**Destinatário:** Michele / Bamaq

**Conclusão já confirmada:**  
Não. A assembleia mensal e o reajuste anual fixo de 3% são eventos distintos.

**Novo detalhe operacional:**  
Michele informou que:
- as assembleias regulares são programadas para o dia 18;
- quando o dia 18 cai em fim de semana/não útil, a assembleia é deslocada para dia útil;
- em outubro/2026, como 18/10 cai em domingo, a próxima assembleia será **19/10/2026**.

Essa regra é coerente com o histórico do próprio Grupo 4012: a assembleia de julho/2026 ocorreu em 20/07, quando o dia 18 caiu em sábado.

**Implicação:**  
“Dia 18” é calendário operacional recorrente da assembleia, e não a data-base do reajuste anual.

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: 7.2 / 9.1  
- Software: SW-077  
- Follow-up: EVID-039

**Resultado posterior:**  
Respondida. Próxima assembleia informada: 19/10/2026. Primeiro reajuste continua em abril/2027.

---

### QN-062 — O que exatamente fica “travado” ao emitir o contrato agora?

**Status:** RESPONDIDA COMERCIALMENTE  
**Prioridade:** ALTA  
**Origem:** respostas de Michele em 29/09/2026  
**Destinatário:** Michele / QuintoAndar / Bamaq

**Resposta consolidada:**  
A emissão do contrato, sozinha, NÃO é o último marco.

Para efetivar a entrada dentro da condição atual, Michele descreveu:

`documentação → emissão/homologação do contrato → envio por e-mail → aceite eletrônico → pagamento da primeira parcela`

Com o aceite e pagamento:
- o cliente entra no plano;
- grupo e cota são alocados;
- há acesso ao aplicativo;
- passa a participar normalmente do consórcio;
- preserva a condição/campanha dentro do prazo de 30/09, segundo a orientação comercial.

**Marco operacional canônico para esta proposta:**  
`condicaoComercialEfetivada = contrato_emitido && aceite_eletronico && primeira_parcela_paga`

com prazo limite comercial de **30/09/2026**.

A alocação de grupo/número de cota aparece na fala como consequência dessa efetivação, e não como uma etapa que o cliente precise concluir separadamente antes do pagamento.

**Cronologia adicional:**  
Michele informou a segunda parcela para **15/11/2026**.

**Ressalva documental:**  
A confirmação final deve ser conferida no contrato recebido. Se o contrato estabelecer marco diferente, prevalece o documento.

**Relação com arquivos:**  
- Pendência: 1.5 / 8.4  
- Especificação: 25.10  
- Software: SW-069  
- Follow-up: EVID-034 / EVID-044

**Resultado posterior:**  
Questão encerrada comercialmente. Não é necessário perguntar novamente qual ato produz a trava, salvo divergência no contrato.

---

### QN-063 — Qual é a data exata do aniversário do Grupo 4012?

**Status:** RESPONDIDA PARCIALMENTE — MÊS CONFIRMADO  
**Prioridade:** MÉDIA PARA O MODELO MENSAL  
**Origem:** regra de reajuste vinculada ao aniversário do grupo  
**Destinatário:** Bamaq

**Pergunta sugerida:**  
> Qual é a data/mês exato do aniversário contratual do Grupo 4012 usado para aplicar os 3% anuais? Quero colocar essa data certa na simulação.

**Por que importa:**  
Permite substituir o calendário relativo pelo calendário real do grupo. Como o simulador trabalha em resolução mensal, o mês é suficiente para a implementação atual; o dia exato só se torna necessário se introduzirmos cronologia diária/pro rata.

**Relação com arquivos:**  
- Pendência: 1.5  
- Especificação: 6.7 / 7  
- Backlog software: SW-067

**Resultado posterior:**  
Michele informou e depois reafirmou que o **primeiro reajuste será em abril de 2027**, aproximadamente sete meses após a entrada atual. Isso resolve o mês do primeiro reajuste para a simulação mensal. Ela não informou o dia exato dentro de abril nem apresentou a cláusula contratual que define formalmente a data-base.

**Pendência residual:**  
Confirmar o dia exato apenas se precisarmos modelar eventos em resolução diária ou reconciliar reajuste e contemplação dentro do mesmo mês.

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


### QN-065 — Histórico real dos lances do Grupo 4012

**Status:** RESPONDIDA PARCIALMENTE — SÉRIE DE ABRIL A SETEMBRO AGORA COMPLETA; 45% CONFIRMADO COMO EXEMPLO DIDÁTICO  
**Prioridade:** ALTA  
**Origem:** pergunta enviada à Michele + atas oficiais do Grupo 4012 + respostas de 29/09/2026  
**Destinatário:** Michele / Bamaq

**Série documental completa recebida — Assembleias 001 a 006:**

| Assembleia | Lance Livre vencedor | Menor vencedor Livre | Nº vencedores Livre | Cotas aptas não contempladas |
|---|---:|---:|---:|---:|
| Abr/2026 | 60,1400% | 60,1400% | 1 | 473 |
| Mai/2026 | 60,9867% | 60,9867% | 1 | 509 |
| Jun/2026 | **nenhum vencedor por Lance Livre** | — | 0 | 792 |
| Jul/2026 | 73,0000%; 72,7300% | 72,7300% | 2 | 1.013 |
| Ago/2026 | 70,6877%; 70,5508%; 69,5200%; 68,9081% | 68,9081% | 4 | 1.258 |
| Set/2026 | 73,0000%; 72,0000%; 72,0000%; 72,0000% | 72,0000% | 4 | 1.502 |

**O que a Ata 003 / junho acrescenta:**  
- Assembleia nº 003 em 18/06/2026;
- saldo para assembleia: R$ 501.927,02;
- 792 cotas ativas não contempladas aptas;
- contemplação por Lance Fixo: cota 0053 a 30,0000%;
- não há percentual/cota vencedora exibida na coluna de Lance Livre;
- total de cotas ativas contempladas na assembleia: 2.

Assim, junho NÃO fornece evidência de Lance Livre vencedor abaixo de 60%. O dado de 30% é Lance Fixo e deve permanecer separado.

**Reconstrução das afirmações comerciais:**  
Antes do envio das atas, Michele havia escrito que, até a 6ª assembleia, o Lance Livre teria “variado a média entre 45% e 66%”. A formulação foi apresentada como descrição do histórico do grupo.

Depois de confrontada com as atas, ela passou a dizer que:
- 45% era apenas média/exemplo didático;
- os lances tenderiam a cair ao longo do tempo;
- aproximadamente 65% seria uma referência anterior a setembro, sem certeza;
- houve contemplação com Lance Fixo de 30%;
- haveria “lances menores”.

A explicação posterior não corresponde de forma clara à redação original e deve ser tratada como reformulação comercial, não como evidência documental.

**Leitura crítica após incorporar junho:**  
1. 45% permanece abaixo de TODOS os Lances Livres vencedores documentados.
2. Junho não contradiz isso; simplesmente não houve vencedor por Lance Livre registrado.
3. A menção ao Lance Fixo de 30% é confirmada pela ata de junho, mas NÃO pode ser usada como benchmark do Lance Livre.
4. A série de vencedores de Lance Livre não demonstra tendência de queda: após 60%–61% em abril/maio, os vencedores de julho–setembro ficaram aproximadamente entre 68,9% e 73%.
5. A referência verbal de “~65%” não deve virar premissa sem memória/documento adicional.
6. A mensagem anterior de “45%–66%” é incompatível com a série oficial de vencedores e reduz a confiabilidade das estimativas comerciais não documentadas.

**Relação com arquivos:**  
- Pendência: 2.4A / 11.1  
- Especificação: 11.11  
- Follow-up: EVID-036 / EVID-040 / EVID-041  
- Software: SW-076

**Resultado posterior:**  
Série oficial 001–006 completa. 45% segue sendo cenário abaixo do histórico vencedor observado do Lance Livre; junho confirma apenas contemplação por Lance Fixo de 30%, não um Lance Livre baixo.

---

### QN-066 — Ata de junho e número total de ofertas por assembleia

**Status:** RESPONDIDA NO LIMITE DOS DADOS DISPONÍVEIS  
**Prioridade:** ALTA  
**Origem:** Ata 003 recebida + resposta de Michele sobre sigilo das ofertas  
**Destinatário:** Michele / Bamaq

**Ata de junho:**  
Recebida e incorporada.

Ela mostra:
- Assembleia nº 003 em 18/06/2026;
- Grupo 4012;
- 792 cotas ativas não contempladas aptas;
- saldo para assembleia de R$ 501.927,02;
- um Lance Fixo vencedor de 30,0000%;
- nenhum vencedor por Lance Livre exibido;
- 2 cotas ativas contempladas no total.

**Número total de ofertas:**  
Michele informou que:
- os lances são sigilosos;
- não existe para o cliente um relatório com todas as ofertas;
- o cliente visualiza apenas os resultados divulgados/contemplados.

**Consequência:**  
Não é possível calcular com rigor:
- quantos Lances Livres foram ofertados no total;
- percentual de lances abaixo do corte;
- taxa de sucesso empírica por faixa de lance;
- distribuição dos lances perdedores;
- se o número de ofertantes está diminuindo.

**Decisão:**  
Encerrar esta pergunta como respondida no limite de transparência disponível ao cliente.

No simulador/análise:
- usar vencedores oficiais como histórico descritivo;
- não calcular probabilidade/taxa de sucesso;
- não inferir distribuição dos perdedores;
- não insistir com Michele no mesmo pedido.

**Relação com arquivos:**  
- Pendência: 2.4A  
- Especificação: 11.11  
- Follow-up: EVID-036 / EVID-041  
- Software: SW-076

**Resultado posterior:**  
Ata 003 incorporada; denominador de ofertas permanece indisponível por sigilo.

---

### QN-067 — Existem grupos/produtos com cartas individuais maiores que R$ 400 mil?

**Status:** RESPONDIDA PARA O PRODUTO QUINTOANDAR; ESCOPO FORA DO QUINTOANDAR NÃO FOI TRATADO  
**Prioridade:** ALTA  
**Origem:** pergunta direta + áudio de Michele em 29/09/2026  
**Destinatário:** Michele / Bamaq apenas se quisermos explorar produto fora do QuintoAndar

**Resposta recebida:**  
Michele informou que, nos grupos do produto QuintoAndar:
- carta mínima = **R$ 200 mil**;
- carta máxima = **R$ 400 mil**;
- não existem, dentro desse produto/grupo, cartas individuais de R$600 mil, R$700 mil, R$1 milhão ou R$1,5 milhão;
- por isso operações maiores são estruturadas por desmembramento em várias cotas.

Ela também apresentou como racional comercial:
- mais cotas aumentariam a quantidade de números para sorteio;
- cotas menores manteriam lances nominais menores;
- a estrutura fragmentada seria mais “saudável” para o grupo e ampliaria a competição/contemplação.

**Leitura para nossa análise:**  
O ponto factual relevante para a decisão está resolvido:
- **dentro do produto QuintoAndar, o teto por cota é R$400 mil**;
- logo, para R$1,37 milhão, a estrutura necessariamente precisa de pelo menos quatro cotas se permanecermos nesse produto.

As justificativas de que a fragmentação gera “mais chances” ou grupo “mais saudável” devem ser tratadas como explicação comercial, não como vantagem quantitativa comprovada.

**Escopo ainda não respondido:**  
A resposta não esclareceu se a Bamaq possui **outros produtos/grupos fora do QuintoAndar** com cartas maiores e se seria possível contratá-los mantendo:
- cashback da campanha;
- taxas/prazo semelhantes;
- possibilidade de combinar cartas em imóvel QuintoAndar.

Se o objetivo for permanecer na campanha QuintoAndar atual, essa lacuna deixa de ser relevante.

**Pergunta residual opcional, somente se quisermos explorar alternativa fora da campanha atual:**  
> Entendi que, no produto QuintoAndar, o intervalo é R$200 mil a R$400 mil por cota. Fora desse produto, a Bamaq tem hoje grupos imobiliários com cartas maiores? E, se tiver, eles poderiam ser usados numa compra pelo QuintoAndar com o mesmo cashback/condições, ou seriam produtos totalmente diferentes?

**Relação com arquivos:**  
- Pendência: 2.1A  
- Especificação: 5.3 / 6.1 / arquitetura multi-cota  
- Follow-up: EVID-043

**Resultado posterior:**  
Respondida para o produto em análise: R$200 mil–R$400 mil por cota. A estrutura de R$1,37 milhão em quatro cotas não é mero desenho comercial opcional; ela decorre do teto de R$400 mil dentro do produto QuintoAndar.

---

## Modelo de registro

## Modelo de registro

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