# Backlog de possíveis mudanças no software — Simulador Consórcio × CDB × Imóvel

**Criado em:** 28/09/2026  
**Baseline atual:** V3.2  
**Baseline auditada histórica:** V2.54  
**Objetivo:** registrar mudanças de software potencialmente necessárias a partir de novas evidências operacionais, contratuais ou comerciais recebidas da QuintoAndar/Bamaq.

**Estado canônico da documentação:** pós-rodada `pre_respostas30`.

> P0 antes de nova decisão econômica: concluídos. V3.3 recalibrou o Lance Livre; V3.4 corrigiu o rendimento líquido-base; V3.5 extraiu o núcleo financeiro e adicionou regressões automatizadas.

## Regra de uso

Uma resposta da vendedora **não deve alterar automaticamente o simulador**.

Antes de promover um item deste backlog para implementação, classificar a evidência como:

- `INFORMAÇÃO COMERCIAL NÃO CONFIRMADA`
- `CONFIRMAÇÃO OPERACIONAL`
- `DOCUMENTO/REGULAMENTO`
- `DECISÃO INTERNA DE MODELAGEM`

Mudanças que alterem fórmulas, cronologia ou significado econômico devem também:
1. atualizar `especificacao_modelo_simulador.md`;
2. registrar a decisão no `follow_up_auditorias_simulador.md`;
3. atualizar/remover a pendência correspondente;
4. ganhar teste de regressão.

## Status possíveis

- `CANDIDATA`
- `AGUARDANDO CONFIRMAÇÃO`
- `PRONTA PARA ESPECIFICAR`
- `APROVADA PARA IMPLEMENTAÇÃO`
- `IMPLEMENTADA`
- `REAUDITADA`
- `DESCARTADA`

## Tipo

- `REGRA FINANCEIRA`
- `CRONOLOGIA`
- `MÚLTIPLAS COTAS`
- `UX / EXPLICAÇÃO`
- `NOVO INPUT`
- `NOVO OUTPUT / KPI`
- `VALIDAÇÃO / WARNING`
- `TESTE`
- `DOCUMENTAÇÃO`

## Prioridade

- `ALTA` — muda materialmente o resultado, a arquitetura ou pode induzir decisão errada;
- `MÉDIA` — melhora fidelidade do modelo;
- `BAIXA` — UX, clareza ou conveniência.

---

# Itens


## Reconciliação de status com a linha principal V3.2 — 29/09/2026

As entradas SW-001–SW-070 foram criadas quando a baseline era V2.54. O texto histórico de cada ticket é preservado, mas os status abaixo refletem o software atual.

Já incorporados de forma material:
- SW-001 — motor multi-cota; desde V3.2 generalizado para 1–50 cotas;
- SW-002 — CDI/carta separado do CDB benchmark;
- SW-004 — remuneração da carta como input/sensibilidade;
- SW-006 — bases diferentes para Livre e embutido;
- SW-013 — proibição de pooling;
- SW-015 — parcialmente: rendimento aferido/usado por cota já aparece;
- SW-061 — parcialmente: composição 400/400/370/200 existe, mas não há override completo da cotação oficial;
- SW-064 — parcialmente: há resumo e detalhe multi-cota, mas não um card de reconciliação exata da proposta.

Parcial importante:
- SW-005 — o motor está correto para **Lance Livre**, mas ainda não há modalidade explícita **Fixo × Livre**.

Continuam sem implementação contratual definitiva, entre outros:
- SW-018 compra com subconjunto de cotas;
- SW-060 assembleias anteriores — NÃO IMPLEMENTAR para o preset atual após resposta comercial específica de 29/09; manter apenas como guardrail histórico até conferência contratual;
- SW-062 override da parcela oficial;
- SW-063 cashback por cota conforme regra promocional definitiva;
- SW-067 calendário real do aniversário do grupo;
- SW-068 início posterior do seguro por cota;
- SW-069 metadados formais de validade/trava;
- SW-070 separação explícita entre tabela comercial e reajuste contratual.

Novas features implementadas depois do backlog original são registradas em SW-071–SW-075 ao final deste documento.

### SW-001 — Motor multi-cota com preset real de 4 cotas

**Status:** IMPLEMENTADA — V2.58; GENERALIZADA PARA 1–50 COTAS NA V3.2
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS  
**Origem:** resposta de Michele em 28/09/2026  
**Nível da evidência:** CONFIRMAÇÃO OPERACIONAL / COMERCIAL ESCRITA

**Comportamento atual da V2.54:**  
Uma única carta equivalente de R$ 1,37 milhão.

**Nova informação:**  
A operação real proposta é formada por quatro cotas: R$ 400 mil, R$ 400 mil, R$ 370 mil e R$ 200 mil. Cada cota possui número próprio, pode contemplar em mês diferente ou no mesmo mês e recebe lance individual, inclusive com modalidade Fixa ou Livre.

**Possível mudança:**  
Criar estrutura `cotas[]` com estado independente por cota e um preset inicial correspondente à proposta real.

**Impacto esperado:**  
- Motor: alto; deixa de existir uma única contemplação agregada.  
- Interface: tabela/editor de cotas.  
- Métricas: agregar fluxos sem perder estado individual.  
- Testes: equivalência quando todas contemplam juntas; divergência quando escalonadas.  
- Documentação: atualizar especificação e follow-up.

**Dependências / dúvidas antes de implementar:**  
- regras exatas de lance por cota;
- remuneração por cota;
- combinação dos créditos;
- destino do rendimento;
- uso de cotas parcialmente contempladas.

**Critério de aceite:**  
Quatro cotas podem ter meses de contemplação/lances/rendimentos distintos e, quando configuradas com timing idêntico, reproduzem a carta equivalente.

**Versão-alvo:**  
próxima versão estrutural após fechamento das principais respostas

---

### SW-002 — Separar “% do CDI da carta” de “% do CDB benchmark”

**Status:** IMPLEMENTADA — V2.58; PREMISSA-BASE AGORA RECONCILIADA  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT  
**Origem:** respostas de Michele em 28–29/09/2026 + verificação do fundo informado  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + VERIFICAÇÃO EXTERNA DO FUNDO

**Estrutura confirmada:**  
A carta NÃO rende uma fração do CDB benchmark do usuário.

Separar:
- `i_CDI` = CDI de referência;
- `p_carta` = fração líquida do CDI creditada à carta;
- `i_CDB_benchmark` = retorno do investimento alternativo.

**Nova calibração comercial:**  
- camada bruta da aplicação: aproximadamente 98%–105% do CDI;
- camada líquida para projeção da carta: aproximadamente **80% do CDI**.

**Decisão futura:**  
O default da carta deve migrar para:
`p_carta = 0.80`

sem tributação/haircut adicional sobre o mesmo rendimento.

**Fundo informado:**  
Itaú Premium RF Referenciado DI — CNPJ 03.184.233/0001-80.

**Critério de aceite:**  
- benchmark CDB não controla a carta;
- 80% aparece como premissa líquida editável;
- 98%–105% não é apresentado como faixa líquida;
- nenhum imposto é aplicado duas vezes.

**Versão-alvo:**  
próxima revisão do simulador.

---

### SW-003 — Parâmetros compartilhados no nível do grupo

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** MÚLTIPLAS COTAS / UX  
**Origem:** Michele informou que cotas no mesmo grupo compartilham as mesmas regras  
**Nível da evidência:** CONFIRMAÇÃO OPERACIONAL / COMERCIAL ESCRITA

**Comportamento atual da V2.54:**  
Todos os parâmetros pertencem à única carta equivalente.

**Nova informação:**  
As quatro cotas podem estar no mesmo grupo e, nesse caso, compartilham prazo, taxa administrativa, fundo de reserva e reajuste.

**Possível mudança:**  
Na arquitetura multi-cota, separar:
- parâmetros do grupo: prazo, administração, reserva, reajuste, calendário;
- parâmetros da cota: valor, número, contemplação, lance, crédito/rendimento.

**Impacto esperado:**  
- Motor: melhora consistência e reduz duplicação.  
- Interface: edição mais simples.  
- Testes: uma mudança no grupo deve afetar todas as cotas vinculadas.  
- Documentação: refletir hierarquia grupo → cotas.

**Dependências / dúvidas antes de implementar:**  
- confirmar se todas as quatro efetivamente serão formalizadas no mesmo Grupo 4012;
- confirmar data-base/primeiro reajuste.

**Critério de aceite:**  
Cotas do mesmo grupo herdam parâmetros comuns sem impedir exceções documentadas.

**Versão-alvo:**  
junto com SW-001

---

### SW-004 — Recalibrar sensibilidade da remuneração líquida da carta

**Status:** IMPLEMENTADA — V3.4  
**Prioridade:** MÉDIA  
**Tipo:** UX / EXPLICAÇÃO / SENSIBILIDADE  
**Origem:** esclarecimento de Michele em 29/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL

**Comportamento atual:**  
A sensibilidade foi criada quando 98% era tratado como possível percentual líquido da carta.

**Nova informação:**  
- 98%–105% = camada bruta das aplicações;
- 80% = orientação de projeção para o retorno líquido da carta.

**Implementado na V3.4:**  
- default/base: 80% do CDI líquido;
- campo manual preservado;
- presets de rendimento recalibrados para 70% / 80% / 90%;
- 100% permanece apenas como ponto explícito de sensibilidade no gráfico;
- texto deixa claro que 98%–105% era referência bruta da aplicação;
- nenhum IR adicional é aplicado sobre o percentual líquido configurado.

**Impacto esperado:**  
Material nos resultados de cenários com longa permanência do crédito contemplado aplicado.

**Critério de aceite:**  
A interface deixa claro:
- “80% do CDI — retorno líquido projetado da carta”;
- “editável / não garantido”;
- ausência de novo IR sobre esse rendimento no cenário-base.

**Versão-alvo:**  
próxima revisão.

---

### SW-005 — Modelar modalidade de lance: Fixo × Livre

**Status:** REGRA DO LIVRE CONFIRMADA; IMPLEMENTAÇÃO ATUAL DEVE SER PRESERVADA/VALIDADA  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / MÚLTIPLAS COTAS  
**Origem:** resposta direta de Michele em 29/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL INEQUÍVOCA

**Regra confirmada:**  
- Fixo 30% → base carta atualizada;
- Livre → base saldo devedor atualizado da cota na data da assembleia;
- embutido → carta atualizada.

No Livre:

`lanceLivre = pctLivre × saldoDevedorNaAssembleia`

**Ranking confirmado:**  
O sistema ordena as cotas pelo `pctLivre` em ordem decrescente e contempla até esgotar o Fundo Comum.

**Memória inconsistente:**  
O exemplo de R$225 mil para saldo R$495.330 e 45% não reproduz a regra confirmada. Não adaptar o motor para esse print.

**Mudança necessária:**  
Não é uma mudança conceitual na fórmula atual; é:
- consolidar a regra;
- remover status de incerteza;
- adicionar testes de regressão com saldo diferente da carta;
- separar ranking percentual de valor nominal de lance.

**Critério de aceite:**  
- 45% sobre R$495.330 = R$222.898,50;
- ranking depende do percentual, não do valor nominal;
- nenhum teste tenta reproduzir R$225 mil daquele print.

**Versão-alvo:**  
próxima revisão/teste do simulador.

---

### SW-006 — Calcular embutido e dinheiro com bases diferentes

**Status:** IMPLEMENTADA CONCEITUALMENTE — REGRA AGORA CONFIRMADA  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA  
**Origem:** resposta direta de Michele em 29/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL INEQUÍVOCA

**Regra confirmada:**

`lanceTotal = pctLivre × saldoDevedorNaAssembleia`

`embutido = pctEmb × carta`

`dinheiro = max(0, lanceTotal - embutido)`

**Caso de regressão:**
- saldo = R$495.330;
- Livre = 45%;
- carta = R$400.000;
- embutido = 30%.

Esperado:
- lance total = R$222.898,50;
- embutido = R$120.000;
- dinheiro = R$102.898,50.

**Decisão:**  
A memória que mostrava R$105 mil próprios é descartada como referência matemática.

**Critério de aceite:**  
A implementação reproduz o caso acima e mantém as bases separadas.

**Versão-alvo:**  
próxima bateria de testes/revisão.

---

### SW-007 — Reconciliar contagem de parcelas pós-contemplação

**Status:** DESCARTADA COMO MUDANÇA DE MOTOR — MEMÓRIA NUMÉRICA CONFIRMA 210 MESES  
**Prioridade:** ALTA  
**Tipo:** CRONOLOGIA / REGRA FINANCEIRA  
**Origem:** memória comercial de 29/09/2026  
**Nível da evidência:** MEMÓRIA NUMÉRICA COM RÓTULO INTERNO INCONSISTENTE

**Comportamento da V3.2:**  
`P_pos = saldo / (N - mesCont)`

Para N=214 e contemplação após a 4ª parcela:
`214 - 4 = 210`.

**Nova evidência:**  
A memória mostra:
- saldo final = R$ 270.330;
- rótulo “209 meses”;
- nova parcela = R$ 1.287.

Mas:
- `270.330 / 209 = R$ 1.293,44`;
- `270.330 / 210 = R$ 1.287,29`.

Logo, o valor monetário da própria memória confirma a divisão por **210 meses**.

**Decisão:**  
Não alterar o motor para 209. Tratar “209 meses” como provável erro de rótulo até prova documental em contrário.

**Critério de aceite:**  
Teste de regressão: com saldo R$ 270.330 e 210 meses, a parcela deve ficar aproximadamente R$ 1.287,29 antes de arredondamentos de apresentação.

**Versão-alvo:**  
nenhuma mudança financeira; apenas documentação/teste

---

### SW-008 — Opção de destino da amortização do lance

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT  
**Origem:** áudio de Michele em 29/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL

**Nova informação:**  
Michele afirmou que o lance pode amortizar:
- o valor da parcela; OU
- o prazo.

**Possível mudança:**  
Oferecer por cota:
- `reduzirParcela` — recalcular parcela mantendo o horizonte;
- `reduzirPrazo` — manter a lógica de parcela aplicável e antecipar término conforme regra contratual a detalhar.

**Dependências / dúvidas antes da implementação final:**  
- como exatamente a redução de prazo é operacionalizada;
- se a escolha é feita no momento do lance;
- se pode variar por cota.

**Critério de aceite:**  
Os dois modos ficam explícitos e nenhum deles é inferido silenciosamente.

**Versão-alvo:**  
próxima revisão após detalhar a mecânica do modo “reduzir prazo”

---

### SW-009 — Reconhecer rendimento a partir da disponibilização do crédito, não apenas no mês seguinte

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** CRONOLOGIA / REGRA FINANCEIRA  
**Origem:** resposta de Michele + Resolução BCB nº 285/2023, arts. 16 e 17  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
A carta começa a render somente no mês seguinte à contemplação.

**Nova informação:**  
O crédito deve receber rendimentos líquidos desde a data em que é colocado à disposição após a homologação até a utilização.

**Possível mudança:**  
Adicionar uma convenção pro rata para o primeiro mês de rendimento, por exemplo:
- dia da assembleia/homologação configurável; ou
- fração de mês padrão; ou
- modo simplificado atual claramente identificado.

**Impacto esperado:**  
- Motor: pequeno/médio por cota, potencialmente relevante com várias cotas e contemplações em datas distintas.  
- Interface: opcionalmente dia da assembleia ou convenção mensal.  
- Testes: contemplação no início/fim do mês.  
- Documentação: atualizar cronologia.

**Dependências / dúvidas antes de implementar:**  
- data típica de homologação;
- se queremos manter o simulador estritamente mensal ou introduzir precisão diária apenas nesse evento.

**Critério de aceite:**  
O modelo não ignora rendimento entre a disponibilização efetiva e o primeiro fechamento mensal sem avisar o usuário.

**Versão-alvo:**  
após arquitetura multi-cota ou junto dela

---

### SW-010 — Atualizar fonte normativa do resgate de 180 dias

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** BAIXA  
**Tipo:** DOCUMENTAÇÃO / UX  
**Origem:** verificação oficial em 28/09/2026  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual:**  
A ferramenta usa corretamente 180 dias, mas documentos podem mencionar a Circular nº 3.432.

**Nova informação:**  
A Circular nº 3.432/2009 foi revogada em 1º/07/2024. A regra atual está na Resolução BCB nº 285/2023, art. 15, §2º.

**Possível mudança:**  
Atualizar tooltips/notas/fontes para citar a Resolução vigente.

**Critério de aceite:**  
Nenhuma documentação da versão nova apresenta norma revogada como fonte vigente.

**Versão-alvo:**  
próxima revisão

---

### SW-011 — Reclassificar “IR/custo do resgate” como haircut adicional avançado

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** UX / REGRA FINANCEIRA  
**Origem:** rendimentos líquidos confirmados regulatoriamente  
**Nível da evidência:** DOCUMENTO/REGULAMENTO + CONFIRMAÇÃO COMERCIAL

**Comportamento atual da V2.54:**  
Existe campo de IR/custo do resgate, default 0%, aplicado sobre rendimentos acumulados.

**Nova informação:**  
A regra-base já entrega ao crédito rendimentos líquidos financeiros. Michele afirma ausência de taxa adicional de gestão sobre eles.

**Possível mudança:**  
- manter default 0%;
- renomear para algo como “haircut/custo adicional no recebimento (sensibilidade)”;
- mover para opções avançadas;
- adicionar aviso explícito contra dupla tributação.

**Impacto esperado:**  
Baixo no default, alto na prevenção de erro de usuário.

**Dependências / dúvidas antes de implementar:**  
Confirmar eventual evento fiscal adicional no recebimento em dinheiro.

**Critério de aceite:**  
O usuário não interpreta o campo como IR obrigatório sobre rendimentos que já foram reconhecidos líquidos.

**Versão-alvo:**  
após confirmação fiscal final

---

### SW-012 — Exibir fonte/descrição da aplicação do crédito contemplado

**Status:** CANDIDATA  
**Prioridade:** BAIXA  
**Tipo:** UX / EXPLICAÇÃO  
**Origem:** resposta de Michele + Resolução BCB nº 285/2023  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Adicionar ajuda contextual explicando que:
- o crédito contemplado não utilizado permanece aplicado;
- a regulamentação restringe o universo de investimentos;
- o rendimento exibido é líquido da aplicação;
- não se trata de promessa fixa de x% do CDI.

Opcionalmente permitir registrar o nome/CNPJ da aplicação do grupo quando conhecido.

**Critério de aceite:**  
A interface deixa claro o mecanismo econômico sem prometer rentabilidade garantida.

**Versão-alvo:**  
junto com SW-002

---

### SW-013 — Proibir compensação cruzada de rendimento entre cotas

**Status:** IMPLEMENTADA — V2.59
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS / REGRA FINANCEIRA  
**Origem:** resposta de Michele em 28/09/2026  
**Nível da evidência:** CONFIRMAÇÃO OPERACIONAL / COMERCIAL ESCRITA

**Comportamento atual da V2.54:**  
Existe uma única carta equivalente e um único fluxo agregado de rendimento/parcela.

**Nova informação:**  
O rendimento de cada cota só pode abater a parcela da própria cota.

**Possível mudança:**  
Na arquitetura `cotas[]`, calcular individualmente:
`yieldUsed_j = min(yield_j, installment_j)`
`yieldExcess_j = yield_j - yieldUsed_j`

Proibir qualquer redistribuição de `yieldExcess_j` para parcelas de `k != j`.

**Impacto esperado:**  
- Motor: alto em cenários com contemplações/lances heterogêneos.  
- Interface: mostrar rendimento usado/excedente por cota.  
- Métricas: aportes próprios podem aumentar em relação a um modelo agregado.  
- Testes: caso em que cota A tem excesso e cota B déficit deve exigir aporte em B.

**Dependências / dúvidas antes de implementar:**  
Nenhuma para a regra principal.

**Critério de aceite:**  
Excesso de rendimento de uma cota nunca reduz obrigação de outra.

**Versão-alvo:**  
junto com SW-001

---

### SW-014 — Tornar explícita a hipótese de solicitação mensal perfeita

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** UX / VALIDAÇÃO / WARNING  
**Origem:** Michele informou que o abatimento precisa ser solicitado todo mês no app  
**Nível da evidência:** CONFIRMAÇÃO OPERACIONAL / COMERCIAL ESCRITA

**Comportamento atual da V2.54:**  
Ao selecionar “usar rendimento para pagar parcela”, o motor aplica o abatimento automaticamente em todos os meses elegíveis.

**Possível mudança mínima:**  
Renomear/explicar o modo como:
“Assumir que solicito mensalmente o uso do rendimento para abater a parcela”.

Adicionar aviso:
“A operação real exige solicitação mensal no app.”

**Possível mudança avançada:**  
Criar sensibilidade de aderência:
- 100% dos meses;
- percentual de meses;
- calendário manual por cota.

**Impacto esperado:**  
- Motor: zero na mudança mínima; médio se houver aderência configurável.  
- Interface: melhora transparência operacional.  
- Testes: com 100% de aderência deve reproduzir exatamente o comportamento atual.

**Dependências / dúvidas antes de implementar:**  
Cutoff e consequência de esquecer a solicitação.

**Critério de aceite:**  
O usuário não interpreta o abatimento como automático pela Bamaq.

**Versão-alvo:**  
mudança mínima na próxima revisão; sensibilidade avançada após detalhes operacionais

---

### SW-015 — KPIs de rendimento usado e excedente por cota

**Status:** PARCIALMENTE IMPLEMENTADA — AFERIDO/USADO POR COTA VISÍVEIS; KPIs MENSAIS COMPLETOS AINDA PENDENTES
**Prioridade:** MÉDIA  
**Tipo:** NOVO OUTPUT / KPI / MÚLTIPLAS COTAS  
**Origem:** regra de uso do rendimento confirmada  
**Nível da evidência:** CONFIRMAÇÃO OPERACIONAL / COMERCIAL ESCRITA

**Possível mudança:**  
Na versão multi-cota, mostrar por cota:
- rendimento bruto do mês;
- rendimento usado na parcela;
- parcela restante do bolso;
- rendimento excedente capitalizado;
- rendimento acumulado.

**Por que importa:**  
Permite verificar visualmente que não existe pooling entre cotas e entender quais cotas exigem caixa mesmo quando outras têm rendimento excedente.

**Critério de aceite:**  
A soma dos KPIs individuais reconcilia com os totais agregados sem violar a restrição por cota.

**Versão-alvo:**  
junto com SW-001

---

### SW-016 — Promover reajuste de 3% de “sensibilidade” para regra default da proposta

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** UX / DOCUMENTAÇÃO / REGRA FINANCEIRA  
**Origem:** resposta de Michele em 28/09/2026  
**Nível da evidência:** CONFIRMAÇÃO OPERACIONAL / COMERCIAL ESCRITA

**Comportamento atual da V2.54:**  
O default já é 3% a.a., mas ainda é apresentado em vários lugares como premissa genérica de cenário.

**Nova informação:**  
Para esta proposta, Michele confirmou reajuste fixo de 3% a.a.; antes da contemplação corrige crédito/parcela e depois continua corrigindo o saldo devedor.

**Possível mudança:**  
- manter 3% como default;
- mudar textos de ajuda para “regra comercial informada para esta proposta”;
- preservar campo editável para sensibilidade/auditoria;
- manter a ordem reajuste × contemplação configurável até confirmar a data-base/cronologia.

**Impacto esperado:**  
- Motor: nenhum no cenário default.  
- Interface: maior clareza entre regra do produto e cenário alternativo.  
- Testes: regressão simples de default.  
- Documentação: atualizar rótulos e notas.

**Dependências / dúvidas antes de implementar:**  
Data-base e ordem no mês coincidente.

**Critério de aceite:**  
O usuário distingue “3% é a regra informada” de “posso testar 6%/8% como stress scenario”.

**Versão-alvo:**  
próxima revisão

---

### SW-017 — Validar fórmula de recálculo pós-contemplação após reajuste anual

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / CRONOLOGIA  
**Origem:** Michele confirmou reajuste de 3% no saldo após contemplação  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL PARCIAL

**Comportamento atual da V2.54:**  
Após contemplação, o saldo é reajustado e a parcela é recalculada pelo saldo e meses restantes.

**Nova informação:**  
O saldo realmente continua sofrendo 3% a.a., mas Michele não explicou a fórmula da nova parcela.

**Possível mudança:**  
Nenhuma até obter memória oficial.

**Dependências / dúvidas antes de implementar:**  
- parcela sobe proporcionalmente ou é recalculada;
- prazo-base;
- arredondamentos;
- relação com as 209 parcelas do exemplo anterior.

**Critério de aceite:**  
O motor reproduz uma memória oficial de reajuste pós-contemplação.

**Versão-alvo:**  
a definir após resposta

---

### SW-018 — Compra com subconjunto de cotas contempladas + recursos próprios

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS / REGRA FINANCEIRA  
**Origem:** resposta de Michele + Regulamento Geral Bamaq  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
Uma única carta equivalente é utilizada integralmente ou não.

**Nova informação:**  
É possível selecionar apenas as cotas já contempladas para uma compra e completar o preço com recursos próprios, enquanto as demais cotas continuam independentes.

**Possível mudança:**  
Na etapa de compra, permitir marcar quais cotas contempladas participam:
`creditoCompra = Σ creditosSelecionados`
`complemento = max(0, preco - creditoCompra)`

Cotas não selecionadas permanecem intactas.

**Impacto esperado:**  
- Motor: alto.  
- Interface: seletor de cotas na compra.  
- Métricas: aportes e garantias por operação.  
- Testes: 1/4, 2/4, 3/4 e 4/4 cotas usadas.

**Critério de aceite:**  
Usar 3 cotas não altera saldo/crédito/status da 4ª.

**Versão-alvo:**  
junto com SW-001

---

### SW-019 — Registrar vínculo entre cotas e imóvel/garantia

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS / ARQUITETURA  
**Origem:** combinação de várias cartas + cotas posteriores independentes  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + REGULAMENTO BAMAQ

**Possível mudança:**  
Criar entidade/estado de operação imobiliária com:
- imóvel;
- cotas usadas;
- saldos vinculados;
- garantia/gravame;
- data de aquisição;
- eventual quitação/liberação de cada obrigação.

**Por que importa:**  
Sem esse vínculo, o motor não consegue saber se uma cota posterior está livre, se uma dívida pertence ao imóvel ou qual garantia deve ser liberada.

**Critério de aceite:**  
O patrimônio e as dívidas reconciliam mesmo quando apenas parte das cotas financia o imóvel.

**Versão-alvo:**  
arquitetura multi-cota

---

### SW-020 — Destinos de cotas contempladas depois da compra

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS / REGRA FINANCEIRA  
**Origem:** resposta de Michele + aparente conflito com Regulamento Geral Bamaq  
**Nível da evidência:** INFORMAÇÃO COMERCIAL + DOCUMENTO/REGULAMENTO EM RECONCILIAÇÃO

**Possível mudança:**  
Depois que um imóvel já foi comprado, cada cota contemplada posteriormente deve poder escolher entre destinos válidos:
- permanecer aplicada;
- comprar outro imóvel;
- quitar financiamento elegível;
- quitar consórcio elegível;
- receber em dinheiro quando cumprir regra dos 180 dias;
- outras opções contratuais.

Não incluir “amortização parcial do consórcio anterior” até confirmação.

**Dependências:**  
QN-022 e QN-023.

**Critério de aceite:**  
O motor não proíbe uma opção prevista no regulamento nem permite uma operação que a Bamaq rejeite operacionalmente.

**Versão-alvo:**  
após resposta formal

---

### SW-021 — Não codificar limite fixo de 150 cotas por CPF

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** BAIXA  
**Tipo:** VALIDAÇÃO / DOCUMENTAÇÃO  
**Origem:** verificação de regra atual do Bacen/Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Nova informação:**  
A regra normativa identificada é 10% das cotas ativas por grupo, não 150 cotas totais por CPF.

**Possível mudança:**  
- não criar hard cap de 150;
- futuramente permitir regra de elegibilidade por grupo;
- se surgir política interna de 150, tratá-la separadamente da regra regulatória.

**Critério de aceite:**  
A UI não apresenta 150 como limite do Banco Central sem fonte correspondente.

**Versão-alvo:**  
quando houver validações de elegibilidade

---

### SW-022 — Modelar quitação total de consórcio/financiamento com outra carta

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / MÚLTIPLAS COTAS  
**Origem:** art. 8º, XII/XIII, Regulamento Geral Bamaq + Resolução BCB nº 285/2023  
**Nível da evidência:** DOCUMENTO/REGULAMENTO, APLICAÇÃO ESPECÍFICA A CONFIRMAR

**Possível mudança:**  
Adicionar evento de utilização da carta para `quitacaoTotal` de uma obrigação elegível:
- dívida da mesma categoria;
- titularidade do consorciado;
- saldo <= crédito disponível;
- anuência da administradora.

Em multi-cota, permitir selecionar qual obrigação é quitada.

**Dependências:**  
Confirmar se pode ser usada contra cotas Bamaq anteriores vinculadas ao mesmo imóvel e se múltiplas cartas podem ser combinadas.

**Critério de aceite:**  
A operação só é executada quando todas as condições contratuais estiverem satisfeitas e extingue corretamente a dívida/garantia quitada.

**Versão-alvo:**  
depois de QN-022/QN-023

---

### SW-023 — Substituir “crédito residual congelado” por destino configurável

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT  
**Origem:** Resolução BCB nº 285/2023 + Regulamento Geral Bamaq + resposta de Michele  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
Se o imóvel custa menos que a carta, o residual permanece como ativo vinculado, sem rendimento e sem destino.

**Nova informação:**  
Depois da aquisição, a diferença deve ser destinada a uma das opções permitidas.

**Possível mudança:**  
Adicionar seletor:
- despesas vinculadas ao imóvel;
- antecipar/quitar prestações vincendas;
- devolver em dinheiro, quando elegível.

O motor deve eliminar `residualCredit` como ativo congelado após a escolha e registrar a contrapartida correta.

**Impacto esperado:**  
- Motor: alto.  
- Interface: nova escolha de destino.  
- Patrimônio: remove ativo fictício.  
- Benchmark: aportes/custos podem mudar.  
- Testes: residual 0, despesas, antecipação, devolução.

**Critério de aceite:**  
Nenhum residual pós-compra permanece no patrimônio sem destino econômico válido.

**Versão-alvo:**  
próxima revisão após fechamento das respostas

---

### SW-024 — Implementar antecipação em ordem indireta para residual

**Status:** AGUARDANDO CONFIRMAÇÃO DO GRUPO  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / CRONOLOGIA  
**Origem:** Regulamento Geral Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO GERAL

**Comportamento atual:**  
Residual não amortiza dívida.

**Possível mudança:**  
Ao escolher “antecipar prestações”:
- aplicar residual às prestações vincendas em ordem indireta;
- reduzir prazo/parcelas finais de forma rastreável;
- não simplesmente diminuir todas as parcelas futuras.

**Dependências:**  
Confirmar se Grupo 4012 segue exatamente essa regra ou oferece opção alternativa de redução da parcela.

**Critério de aceite:**  
A soma das prestações antecipadas reconcilia exatamente com o residual aplicado e o novo cronograma.

**Versão-alvo:**  
após QN-026

---

### SW-025 — Modelar despesas vinculadas usando até 10% do crédito

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT  
**Origem:** Resolução BCB nº 285/2023 + Regulamento Geral Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Permitir que despesas elegíveis de aquisição sejam pagas diretamente pelo crédito residual, respeitando teto regulamentar/contratual.

Na arquitetura multi-cota, manter rastreabilidade por cota até confirmar agregação do limite.

**Impacto esperado:**  
Reduz aporte próprio de ITBI/RGI/custos quando houver residual suficiente.

**Dependências:**  
Lista operacional da Bamaq e QN-027/QN-028.

**Critério de aceite:**  
O valor pago por crédito não excede residual disponível nem teto elegível.

**Versão-alvo:**  
junto com SW-023

---

### SW-026 — Devolução do residual em dinheiro quando obrigações estiverem quitadas

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / VALIDAÇÃO  
**Origem:** Resolução BCB nº 285/2023 + Regulamento Geral Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Habilitar opção “receber diferença em dinheiro” somente quando:
`obrigacoesGrupo == 0`
e demais condições contratuais estiverem satisfeitas.

O valor entra no caixa no timing efetivo da transferência.

**Dependências:**  
Prazo/procedimento operacional da Bamaq.

**Critério de aceite:**  
Opção indisponível enquanto houver saldo/obrigações e disponível quando requisitos forem cumpridos.

**Versão-alvo:**  
junto com SW-023

---

### SW-027 — Sensibilidade “reduzir parcela” só após confirmação do Grupo 4012

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA  
**Origem:** Michele disse que residual pode reduzir parcela ou encurtar prazo; regulamento geral menciona ordem indireta  
**Nível da evidência:** CONFLITO ENTRE INFORMAÇÃO COMERCIAL E REGULAMENTO GERAL

**Possível mudança:**  
Se a Bamaq confirmar opção de recálculo da parcela, implementar dois modos:
- ordem indireta / redução de prazo;
- redução de valor da parcela.

**Dependências:**  
QN-026.

**Critério de aceite:**  
Cada modo reproduz memória oficial da administradora.

**Versão-alvo:**  
após confirmação

---

### SW-028 — Implementar regra geral + exceção promocional do cashback

**Status:** PRONTA PARA ESPECIFICAR PARA O PRESET ATUAL  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / MÚLTIPLAS COTAS  
**Origem:** Regulamento da Campanha + respostas específicas de Michele em 29/09/2026  
**Nível da evidência:** DOCUMENTO + CONFIRMAÇÃO COMERCIAL DIRETA DO CASO MULTI-COTA

**Regra confirmada para a proposta atual:**  
Em compra de um único imóvel com múltiplas cotas, a análise é agregada.

`creditoNominalOperacao = soma(cotas.creditoNominal)`

Após embutido:

`creditoLiquidoFaturado = soma(cotas.creditoLiquidoEfetivamenteLiberado)`

Cashback:

`cashback = 10% × creditoLiquidoFaturado`

Caso atual:
- nominal = R$1,37 milhão;
- embutido = R$411 mil;
- líquido faturado = R$959 mil;
- cashback = R$95,9 mil.

**Importante:**  
Não aplicar a exceção cota por cota neste preset.

**Mudança futura necessária:**  
Preservar por cota:
- crédito nominal;
- embutido;
- crédito líquido;
- valor efetivamente faturado.

No nível da operação:
- soma nominal;
- valor do imóvel;
- crédito líquido total faturado;
- cashback final.

**Critério de aceite:**  
O cenário 1,37M nominal + 30% embutido deve retornar exatamente R$95.900 de cashback.

**Guardrail:**  
Se contrato/regulamento final trouxer regra divergente, reabrir antes de release.

**Versão-alvo:**  
próxima revisão do simulador.

---

### SW-029 — Corrigir timing do cashback para pagamento posterior à compra

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** CRONOLOGIA / REGRA FINANCEIRA  
**Origem:** item 4.1.2 do Regulamento da Campanha  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
Compra ocorre no fim do mês e cashback entra no caixa no fim do mesmo mês.

**Nova regra documental:**  
Cashback é pago até 5 dias úteis DEPOIS do registro da alienação e pagamento ao vendedor.

**Possível mudança no modelo mensal:**  
Default:
`mesCashback = mesCompra + 1`

Alternativa:
campo `defasagemCashbackMeses` com default 1.

**Impacto esperado:**  
Pequeno no valor nominal; afeta um mês de rendimento/custo de oportunidade e corrige coerência temporal.

**Critério de aceite:**  
Cashback nunca rende antes de poder ter sido recebido.

**Versão-alvo:**  
próxima revisão

---

### SW-030 — Separar cashback promocional de crédito residual e custos da compra

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / UX  
**Origem:** item 4.1.4 do Regulamento  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Regra:**  
Após recebido, cashback é dinheiro livre em conta do consorciado.

**Possível mudança:**  
Garantir que:
- não seja automaticamente direcionado a ITBI/RGI;
- não reduza retroativamente complemento;
- possa compor caixa e ser usado em meses seguintes;
- continue excluído de aporte próprio.

**Critério de aceite:**  
Cashback só afeta obrigações futuras se o usuário/modelo decidir usar o caixa para isso.

**Versão-alvo:**  
próxima revisão

---

### SW-031 — Não afirmar “cashback isento de IR” sem regra fiscal validada

**Status:** CANDIDATA  
**Prioridade:** BAIXA  
**Tipo:** UX / DOCUMENTAÇÃO / REGRA FISCAL  
**Origem:** afirmação comercial não suportada pelo regulamento promocional  
**Nível da evidência:** INFORMAÇÃO COMERCIAL NÃO CONFIRMADA

**Possível mudança:**  
Na UI:
- não mostrar imposto automático no recebimento;
- escrever “tratamento fiscal a confirmar”;
- se houver modelagem de ganho de capital futuro, permitir ajuste da base fiscal caso o cashback deva ser tratado como redução do custo de aquisição.

**Dependências:**  
QN-033 / orientação fiscal.

**Critério de aceite:**  
A ferramenta não cria obrigação fiscal inexistente nem promete isenção sem base.

**Versão-alvo:**  
após validação fiscal

---

### SW-032 — Alertar sobre elegibilidade/vigência da campanha

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** VALIDAÇÃO / WARNING / UX  
**Origem:** item 2.1 do Regulamento da Campanha  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Adicionar metadata de campanha:
- início;
- fim;
- elegibilidade;
- versão do regulamento.

Quando simulação usar cashback, exibir warning se a adesão não estiver confirmada dentro da vigência.

**Dependências:**  
O marco da proposta analisada foi comercialmente esclarecido: contrato emitido/homologado, aceite eletrônico e primeira parcela paga dentro do prazo. Como 30/09/2026 é histórico, esta issue passa a ser apenas uma regra genérica de elegibilidade por campanha.

**Critério de aceite:**  
Cashback não aparece como benefício disponível para uma operação inelegível.

**Versão-alvo:**  
futura revisão de UX/metadata; não é P0 do motor

---

### SW-033 — Separar resgate pós-180 dias de encerramento do grupo

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / CRONOLOGIA  
**Origem:** resposta de Michele + Resolução BCB nº 285/2023 + Regulamento Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
O módulo de resgate pode simular compensação direta do saldo com a carta.

**Nova informação:**  
No resgate voluntário após 180 dias, obrigações precisam estar quitadas antes do recebimento. Encerramento do grupo tem processo próprio.

**Possível mudança:**  
Criar dois eventos distintos:
1. `cashRedemption180d`
2. `groupClosingSettlement`

No primeiro:
`eligivel = saldo_consorcio == 0`

No segundo:
regra de netting fica configurável/pending até QN-035.

**Impacto esperado:**  
Alto para necessidade de caixa e patrimônio terminal.

**Critério de aceite:**  
Resgate pós-180 dias nunca liquida automaticamente dívida sem fonte explícita de quitação.

**Versão-alvo:**  
próxima revisão

---

### SW-034 — Fonte de quitação antes do resgate em dinheiro

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT  
**Origem:** quitação prévia confirmada  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Quando usuário selecionar resgate pós-180 dias com saldo devedor:
- bloquear cenário até escolher fonte de quitação;
- permitir recursos próprios / caixa da estratégia / outro crédito elegível;
- registrar o desembolso como fluxo e aporte quando aplicável.

**Critério de aceite:**  
Nenhum dinheiro “surge” para quitar a cota.

**Versão-alvo:**  
junto com SW-033

---


### SW-035 — Modelar rateio de Fundo de Reserva no encerramento

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT / NOVO OUTPUT  
**Origem:** Resolução BCB nº 285/2023 + Regulamento Bamaq + respostas de Michele  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
Fundo de reserva é custo integral sem recuperação.

**Nova regra confirmada:**  
Se houver saldo remanescente:
- ele inclui o efeito dos rendimentos das aplicações do próprio Fundo de Reserva;
- é distribuído aos consorciados ativos elegíveis no encerramento.

**Possível mudança:**  
Preferir:
- `rateioReservaFinalR$` manual; ou
- `rateioReservaPctContribuicoes` como sensibilidade.

Não limitar automaticamente o percentual a 100%, pois o saldo pode incorporar rendimentos.

Default conservador:
`0%`

com aviso de que isso ignora eventual rateio.

**Regra de elegibilidade:**  
Cota quitada continua elegível ao rateio enquanto permanecer ativa; não remover do estado do grupo ao zerar saldo devedor.

**Timing:**  
Manter `lagRateioReserva` configurável até reconciliar 60 dias da última assembleia versus a descrição comercial de 120+60 dias.

**Impacto esperado:**  
Baixo/médio no Δ, mas importante para patrimônio terminal e fidelidade do encerramento.

**Critério de aceite:**  
- rateio é fluxo terminal separado;
- cota quitada pode recebê-lo;
- nenhum valor é inventado sem input;
- modelo não confunde contribuição individual com saldo final do fundo.

**Versão-alvo:**  
próxima revisão
---

### SW-036 — Painel de encerramento do grupo

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** NOVO OUTPUT / KPI / UX  
**Origem:** regras de encerramento agora mais definidas  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Exibir no horizonte:
- crédito não utilizado;
- rendimentos acumulados;
- saldo devedor;
- necessidade de quitação externa ou netting, conforme regra escolhida;
- rateio de fundo comum;
- rateio de fundo de reserva;
- caixa líquido final;
- prazo estimado de recebimento.

**Dependências:**  
QN-035 e QN-036/QN-038.

**Critério de aceite:**  
O usuário entende exatamente de onde vem cada componente do patrimônio terminal.

**Versão-alvo:**  
após confirmação da liquidação no encerramento

---

### SW-037 — Remover opção de compensação direta como default do resgate

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** UX / REGRA FINANCEIRA  
**Origem:** resposta comercial + regra Bacen  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
No módulo de resgate pós-180 dias:
- default = “quitação prévia obrigatória”;
- opção de compensação direta só aparece em modo avançado/encerramento se formalmente confirmada.

**Critério de aceite:**  
A UI não sugere que `carta - dívida = saque` é o procedimento normal após 180 dias.

**Versão-alvo:**  
próxima revisão

---

### SW-038 — Manter cota quitada como participante ativo até liquidação do grupo

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** MÚLTIPLAS COTAS / ESTADO / REGRA FINANCEIRA  
**Origem:** resposta de Michele + art. 55 do Regulamento Bamaq  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + DOCUMENTO/REGULAMENTO

**Problema arquitetural:**  
Em um motor multi-cota, é tentador marcar uma cota como “encerrada” assim que `saldoDevedor == 0`.

**Nova regra:**  
Separar:
- `dividaQuitada`;
- `cotaAtivaNoGrupo`;
- `elegivelRateioFinal`.

Uma cota pode ter dívida zero e ainda permanecer ativa até o encerramento oficial.

**Impacto esperado:**  
Evita perder rateio de Fundo de Reserva/fundo comum em cotas quitadas antecipadamente.

**Critério de aceite:**  
Quitar antecipadamente não elimina automaticamente direitos de encerramento.

**Versão-alvo:**  
junto com arquitetura multi-cota

---

### SW-039 — Defasagem do rateio do Fundo de Reserva após a última assembleia

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** BAIXA  
**Tipo:** CRONOLOGIA / REGRA FINANCEIRA  
**Origem:** divergência entre resposta comercial e Regulamento Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO + INFORMAÇÃO COMERCIAL CONFLITANTE

**Comportamento futuro desejado:**  
Não colocar o rateio automaticamente no próprio mês `N`.

**Possível mudança:**  
Campo:
`lagRateioReservaMeses`

Cenário documental provisório:
- disponibilidade/comunicação em até ~2 meses após última assembleia.

Cenário comercial relatado:
- até 120 dias para encerramento + até 60 dias depois.

**Dependência:**  
QN-038.

**Critério de aceite:**  
O timing pode ser ajustado sem alterar o valor econômico do rateio e o benchmark aplica corretamente o custo de oportunidade da espera.

**Versão-alvo:**  
após confirmação

---

### SW-040 — Não modelar Fundo de Reserva como aplicação individual

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** BAIXA  
**Tipo:** REGRA FINANCEIRA / DOCUMENTAÇÃO  
**Origem:** art. 53–55 do Regulamento Bamaq  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Regra:**  
Os recursos do Fundo de Reserva:
- pertencem ao fundo do grupo;
- podem ser consumidos nas finalidades contratuais;
- geram rendimentos para o próprio fundo;
- apenas o saldo final é rateado.

**Possível mudança:**  
Evitar criar uma série do tipo:
`contribuicaoReservaIndividual × CDI`

como se fosse saldo do usuário.

**Critério de aceite:**  
O simulador só reconhece direito econômico individual ao rateio final estimado, não a uma “conta pessoal de reserva”.

**Versão-alvo:**  
junto com SW-035

---

### SW-041 — Tornar substituição de garantia um modo real de venda

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT / UX  
**Origem:** resposta de Michele + Central de Ajuda + Regulamento Bamaq 2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
A venda pode manter o consórcio via substituição de garantia, mas o mecanismo é praticamente um booleano sem requisitos/custos.

**Possível mudança:**  
Ao selecionar “manter consórcio / substituir garantia”, exigir:
- valor de avaliação do novo imóvel;
- indicador `imovelSubstitutoQuitado`;
- indicador `imovelSubstitutoEmNomeDoConsorciado`;
- custos de vistoria/avaliação;
- custos de cartório/registro;
- lag da substituição;
- aprovação da Bamaq.

**Critério de aceite:**  
A venda só ocorre depois de a garantia substituta ser elegível/concluída ou de uma quitação alternativa.

**Versão-alvo:**  
próxima revisão estrutural

---

### SW-042 — Modelar garantia externa sem somá-la ao patrimônio da estratégia

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** ARQUITETURA / PATRIMÔNIO / RISCO  
**Origem:** substituição por imóvel já pertencente ao consorciado  
**Nível da evidência:** DECISÃO INTERNA DE MODELAGEM

**Problema:**  
Um imóvel usado apenas como garantia pode já existir no patrimônio pessoal antes da estratégia. Somá-lo ao patrimônio simulado criaria ganho fictício.

**Possível mudança:**  
Entidade:
`garantiaExterna`
com:
- valor de avaliação;
- proprietário;
- status de gravame;
- cotas garantidas;
- sem entrada automática no patrimônio da estratégia.

Adicionar warning:
“Este cenário compromete patrimônio externo não contabilizado no retorno da estratégia.”

**Critério de aceite:**  
Trocar a garantia não aumenta artificialmente o patrimônio líquido modelado.

**Versão-alvo:**  
junto com SW-041

---

### SW-043 — Custos e lag de substituição de garantia

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** CRONOLOGIA / REGRA FINANCEIRA  
**Origem:** resposta de Michele + Regulamento Bamaq 2026  
**Nível da evidência:** REGRA CONFIRMADA; VALORES AINDA MANUAIS

**Possível mudança:**  
Adicionar:
- `custoAvaliacaoSubstituicao`;
- `custosCartorioSubstituicao`;
- `outrosCustosSubstituicao`;
- `lagSubstituicaoGarantiaMeses`.

No benchmark, qualquer custo bancado pelo usuário entra como aporte próprio.

**Dependências:**  
QN-042 / QN-043 para defaults reais.

**Critério de aceite:**  
Manter o consórcio após vender o imóvel nunca é modelado como operação sem custo/tempo.

**Versão-alvo:**  
próxima revisão

---

### SW-044 — Venda com quitação direta pela fonte pagadora

**Status:** AGUARDANDO CONFIRMAÇÃO FORMAL  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / CRONOLOGIA  
**Origem:** Michele informou uso da Bamaq como interveniente quitante  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL

**Possível mudança:**  
Criar modo de liquidação na venda:
`buyerPaysDebtDirectly = true`

Fluxo:
1. preço bruto da venda;
2. parte vai diretamente à Bamaq para quitar saldo;
3. dívida zera;
4. apenas o residual líquido entra no caixa do usuário;
5. baixa da garantia ocorre conforme procedimento.

Isso evita modelar erroneamente todo o preço entrando no caixa e saindo no mesmo instante.

**Dependências:**  
QN-044.

**Critério de aceite:**  
O fluxo econômico e a quitação reconciliam sem dupla contagem do preço da venda.

**Versão-alvo:**  
após confirmação

---

### SW-045 — Regra parametrizável de suficiência da nova garantia

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** ALTA  
**Tipo:** VALIDAÇÃO / REGRA FINANCEIRA  
**Origem:** formulação ambígua “saldo devedor ou crédito original”  
**Nível da evidência:** INFORMAÇÃO COMERCIAL PARCIAL

**Possível mudança:**  
Não hard-code um critério até QN-040.

Preparar arquitetura para:
- `minGarantia = saldoDevedor × fator`;
- ou `minGarantia = creditoReferencia × fator`;
- ou valor manual aprovado.

**Critério de aceite:**  
O software consegue representar a regra formal assim que ela for confirmada sem refatoração estrutural.

**Versão-alvo:**  
depois de QN-040

---

### SW-046 — Painel comparativo: quitar na venda × substituir garantia

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** NOVO OUTPUT / KPI / UX  
**Origem:** dois caminhos operacionais confirmados  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Comparar no mês de venda:
- caixa líquido recebido;
- dívida remanescente;
- custos adicionais;
- patrimônio externo comprometido;
- prazo até liberação;
- impacto no benchmark;
- patrimônio final.

**Critério de aceite:**  
O usuário consegue ver a consequência financeira de cada caminho sem confundir liquidez imediata com patrimônio.

**Versão-alvo:**  
após SW-041/SW-044

---

### SW-047 — Corrigir base da taxa de transferência para saldo devedor

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA  
**Origem:** Regulamento Geral Bamaq 2026, art. 13, XIV  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Comportamento atual da V2.54:**  
`taxaTransferencia = min(Oferta × pctTaxa, teto)`

**Regra correta documentada:**  
`taxaTransferencia = min(SaldoDevedorCota × 1%, R$ 1.000)`

**Impacto esperado:**  
- normalmente pequeno quando o teto de R$1.000 já é atingido;
- material quando saldo devedor < R$100 mil;
- corrige conceito e evita dependência indevida do preço negociado.

**Testes mínimos:**  
- saldo R$250 mil → R$1.000;
- saldo R$100 mil → R$1.000;
- saldo R$50 mil → R$500;
- mudar a oferta mantendo saldo constante não altera a taxa.

**Critério de aceite:**  
Taxa depende apenas do saldo devedor elegível e do teto contratual.

**Versão-alvo:**  
próxima revisão

---

### SW-048 — Separar taxa de cadastro da taxa de transferência

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT  
**Origem:** Regulamento Bamaq 2026 + resposta de Michele  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Adicionar:
`taxaCadastroTransferencia = R$150`

como componente separado.

Em multi-cota, não multiplicar automaticamente pela quantidade de cotas até QN-045 ser respondida.

**Critério de aceite:**  
KPIs e proceeds mostram separadamente:
- oferta;
- taxa de transferência;
- cadastro;
- custos extras;
- líquido.

**Versão-alvo:**  
junto com SW-047

---

### SW-049 — Criar evento separado para venda promocional de cota não contemplada ao QuintoAndar

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / CRONOLOGIA / UX  
**Origem:** Regulamento da Campanha, seção 4.2  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Problema atual:**  
O painel de venda da carta trata apenas cessão de cota contemplada.

**Nova operação promocional:**  
Para cota não contemplada elegível:
- mínimo de 60 contribuições;
- adimplência;
- comprador = QuintoAndar;
- preço = 100% da contribuição ao fundo comum, conforme regulamento promocional;
- taxa de transferência = isenta.

**Possível mudança:**  
Criar modo distinto:
`vendaPromocionalQuintoAndarNaoContemplada`

sem reaproveitar as fórmulas da cessão contemplada.

**Critério de aceite:**  
A isenção promocional nunca contamina a cessão normal a terceiros.

**Versão-alvo:**  
depois da arquitetura multi-cota / se ainda elegível pela campanha

---

### SW-050 — Aprovação cadastral e lag na cessão

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** CRONOLOGIA / VALIDAÇÃO  
**Origem:** Regulamento Bamaq 2026, art. 60  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Possível mudança:**  
Adicionar:
- `transferenciaAprovada`;
- `lagTransferenciaMeses`;
- opção de falha/rejeição em cenários avançados.

Enquanto não aprovada:
- a cota continua do vendedor;
- dívida/parcelas continuam sob sua responsabilidade;
- proceeds não entra no caixa.

**Dependências:**  
QN-048 para default realista.

**Critério de aceite:**  
Venda não ocorre instantaneamente no mesmo mês apenas porque existe oferta.

**Versão-alvo:**  
após confirmação de SLA

---

### SW-051 — Não quitar novamente o saldo consorcial na cessão

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** ALTA  
**Tipo:** REGRA FINANCEIRA / INVARIANTE  
**Origem:** natureza jurídica da transferência de direitos e obrigações  
**Nível da evidência:** DOCUMENTO/REGULAMENTO

**Regra:**  
Na cessão normal:
- o cessionário assume direitos e obrigações da cota;
- o saldo devedor sai do patrimônio/dívida do vendedor juntamente com a cota;
- o vendedor NÃO deve desembolsar `saldoDevedor` como quitação adicional, salvo negociação específica separada.

**Critério de aceite:**  
O modelo não subtrai simultaneamente a dívida do patrimônio e o mesmo saldo do proceeds da venda.

**Versão-alvo:**  
junto com SW-047

---

### SW-052 — Fiscalidade da cessão permanece módulo de sensibilidade

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FISCAL / UX  
**Origem:** ausência de resposta fiscal  
**Nível da evidência:** PENDENTE

**Possível mudança:**  
Manter:
- alíquota/custo adicional manual;
- default 0% enquanto não houver validação.

Depois de QN-049:
- definir base de custo;
- calcular ganho fiscal separadamente da taxa Bamaq.

**Critério de aceite:**  
Tarifa contratual e imposto sobre eventual ganho nunca são misturados.

**Versão-alvo:**  
após validação tributária

---

### SW-053 — Manter seguro desligado por default e reclassificar modos atuais como “sensibilidade”

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** UX / DOCUMENTAÇÃO / REGRA FINANCEIRA  
**Origem:** resposta de Michele + Central de Ajuda Bamaq  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + FONTE OFICIAL

**Comportamento atual da V2.54:**  
Seguro já vem desligado, mas a UI ainda oferece bases genéricas que podem parecer regras reais.

**Nova informação:**  
Seguro Prestamista é opcional.

**Possível mudança mínima:**  
- manter default “Não incluir”;
- renomear os modos existentes como “sensibilidades genéricas”;
- adicionar texto: “não representa a fórmula contratual da Bamaq”.

**Critério de aceite:**  
Abrir o simulador sem seguro reproduz o cenário contratual sem proteção opcional; ativar o seguro não sugere que a Bamaq cobre por aquela fórmula.

**Versão-alvo:**  
próxima revisão

---

### SW-054 — Criar modo contratual de Seguro Prestamista somente após memória oficial

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / NOVO INPUT / MÚLTIPLAS COTAS  
**Origem:** Michele informou prêmio percentual dividido nas parcelas vincendas  
**Nível da evidência:** INFORMAÇÃO COMERCIAL INSUFICIENTE

**Possível mudança futura:**  
Adicionar `seguroModo = bamaqPrestamista` com:
- taxa;
- base;
- prêmio total/periódico;
- parcelas restantes;
- capital segurado;
- início/fim da cobertura.

**Dependências:**  
QN-050 e QN-051.

**Critério de aceite:**  
Uma cota de exemplo reproduz exatamente a memória de cálculo emitida pela Bamaq/seguradora.

**Versão-alvo:**  
depois da documentação do seguro

---

### SW-055 — Seguro individual por cota e regras de elegibilidade separadas

**Status:** AGUARDANDO CONFIRMAÇÃO  
**Prioridade:** BAIXA  
**Tipo:** MÚLTIPLAS COTAS / VALIDAÇÃO  
**Origem:** cobertura máxima e regra etária informadas por Michele  
**Nível da evidência:** INFORMAÇÃO COMERCIAL NÃO DOCUMENTADA

**Possível mudança:**  
Na arquitetura multi-cota:
- `seguroAtivo_j`;
- `capitalSegurado_j`;
- `premio_j`;
- elegibilidade própria.

Não aplicar regra de idade/avalista até confirmação.

**Por que importa:**  
Cobertura de R$800 mil “por cota” e prêmio individual não podem ser modelados corretamente na carta equivalente agregada.

**Dependências:**  
QN-052/QN-053.

**Critério de aceite:**  
Seguro de uma cota não altera prêmio/cobertura de outra e regras de crédito não são confundidas com regras securitárias.

**Versão-alvo:**  
junto com motor multi-cota, se o seguro for usado

---

### SW-056 — Catálogo explícito de custos da operação

**Status:** CANDIDATA  
**Prioridade:** MÉDIA  
**Tipo:** UX / NOVO OUTPUT / VALIDAÇÃO  
**Origem:** consolidação da resposta de custos ponta a ponta  
**Nível da evidência:** MISTA

**Possível mudança:**  
Criar painel “Custos e cobranças” separando:
- recorrentes: administração, reserva, seguro opcional;
- contratação: adesão/cadastro;
- contemplação: análise, avaliação/vistoria;
- aquisição: ITBI/RGI/cartório;
- substituição de garantia;
- transferência de cota;
- empréstimo externo do lance;
- custos fiscais.

Cada item deve mostrar:
- valor/modelo;
- status: confirmado / configurável / pendente;
- momento do fluxo.

**Critério de aceite:**  
O usuário consegue auditar se existe algum custo omitido sem misturar encargos contratuais, impostos e despesas eventuais.

**Versão-alvo:**  
após fechamento das respostas

---

### SW-057 — Não criar taxa de adesão/cadastro inicial por default na proposta QuintoAndar

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** BAIXA  
**Tipo:** REGRA FINANCEIRA / DEFAULT  
**Origem:** resposta de Michele em 28/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL; PROPOSTA FORMAL A CONFIRMAR

**Regra provisória:**  
Para o preset QuintoAndar:
`taxaAdesaoInicial = 0`

Não generalizar para todos os produtos Bamaq.

**Dependência:**  
QN-054/proposta final.

**Critério de aceite:**  
O preset desta proposta não inventa uma taxa que a vendedora declarou inexistente, mas a arquitetura continua aceitando taxa de adesão em outros produtos.

**Versão-alvo:**  
próxima revisão / preset do produto

---

### SW-058 — Distinguir duração original do grupo de prazo remanescente da nova cota

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** ARQUITETURA / MÚLTIPLAS COTAS / UX  
**Origem:** resposta de Michele sobre ingresso em grupo já iniciado  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + REGULAMENTO GERAL

**Comportamento atual da V2.54:**  
Existe basicamente um único `N`, sem semântica explícita de “prazo original” versus “prazo remanescente de entrada”.

**Nova regra:**  
Para a proposta:
`prazoRemanescenteNaAdesao = 214`

A arquitetura futura deve separar:
- `prazoOriginalGrupo` / calendário do grupo;
- `mesEntradaCota`;
- `prazoRemanescenteCota`.

**Impacto esperado:**  
Pequeno no default atual, importante para:
- data-base de reajuste;
- cotas entrando em datas diferentes;
- encerramento comum do grupo;
- explicação da parcela inicial.

**Critério de aceite:**  
Uma cota nova pode entrar num grupo já iniciado sem o motor tratá-la como se o grupo tivesse começado naquele mês.

**Versão-alvo:**  
junto com SW-001/SW-003

---

### SW-059 — Preservar 25% integrais no saldo inicial da nova cota

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** BAIXA  
**Tipo:** REGRA FINANCEIRA / REGRESSÃO  
**Origem:** resposta de Michele + art. 1º, §3º, Regulamento Bamaq  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL + DOCUMENTO/REGULAMENTO

**Regra:**  
Não prorratear taxa administrativa/fundo de reserva porque parte da duração original do grupo já passou.

Para esta proposta:
`D0 = C0 × 1,25`

e:
`P0 = D0 / 214`

antes de reduções/promos/reajustes aplicáveis.

**Teste de referência:**
- C0 = R$200.000;
- D0 = R$250.000;
- N = 214;
- P0 ≈ R$1.168,22.

**Critério de aceite:**  
O teste acima fecha e nenhuma “taxa consumida antes da adesão” é subtraída.

**Versão-alvo:**  
regressão da próxima revisão

---

### SW-060 — Suportar eventual ajuste de assembleias anteriores apenas se confirmado

**Status:** DESCARTADA PARA A PROPOSTA ATUAL — REABRIR SOMENTE SE DOCUMENTO FORMAL CONTRADISSER  
**Prioridade:** ALTA COMO GUARDA DE REGRESSÃO / SEM IMPLEMENTAÇÃO ATUAL  
**Tipo:** REGRA FINANCEIRA / CONTEMPLAÇÃO / GRUPO EM ANDAMENTO  
**Origem:** conflito entre Regulamento Bamaq 2025 e resposta comercial específica  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL ESCRITA ESPECÍFICA PARA AS 4 COTAS + RESSALVA DOCUMENTAL

**Situação após 29/09/2026:**  
Michele afirmou expressamente que, para as quatro cotas novas do Grupo 4012/QuintoAndar:
- não existe nem existirá cobrança retroativa por assembleias anteriores;
- não haverá dedução dessas parcelas no crédito contemplado;
- as cotas são novas de lançamento/abertura de vagas, não cotas canceladas assumidas de terceiro;
- saldo e parcelas nascem do crédito contratado + administração + fundo de reserva e são distribuídos no prazo remanescente.

**Decisão de software:**  
NÃO implementar `ajusteAnterior` no preset nem no cenário-base desta proposta.

A antiga regra candidata permanece documentada apenas como guardrail: se contrato, Regulamento 2026 ou documento específico futuro comprovar que existe cobrança/dedução para esse produto, o item deve ser reaberto e o ajuste deve ser modelado como evento explícito na contemplação — nunca silenciosamente incorporado ao saldo.

**Dependências residuais:**  
- conferência do contrato/proposta final;
- reconciliação formal do Regulamento 2025 com a regra específica alegada para cotas novas de lançamento/abertura de vagas.

**Impacto esperado atual:**  
Nenhum no motor: a regra correta para o preset permanece **sem retroativos**.

**Critério de aceite atual:**  
O preset da proposta reproduz 214 parcelas e o crédito contemplado não sofre dedução por assembleias anteriores. Um eventual futuro modo de ajuste só pode existir mediante evidência documental explícita.

**Versão-alvo:**  
nenhuma enquanto não houver evidência formal contraditória

---

### SW-061 — Criar preset “Proposta QuintoAndar 28/09/2026 — R$1,37 mi”

**Status:** PARCIALMENTE IMPLEMENTADA — COMPOSIÇÃO 400/400/370/200; OVERRIDE DAS PARCELAS OFICIAIS AINDA PENDENTE
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS / PRESET / UX  
**Origem:** cotações individualizadas recebidas  
**Nível da evidência:** COTAÇÃO COMERCIAL ESCRITA

**Preset:**
- 400k / 214 meses / integral 2.336,40 / reduzida 1.167,60;
- 400k / idem;
- 370k / integral 2.161,17 / reduzida 1.080,03;
- 200k / integral 1.168,20 / reduzida 583,80;
- cashback nominal exibido na cotação: 10% por cota;
- no cenário com 30% de lance embutido em todas as cotas, cashback efetivo comercialmente confirmado: R$95.900 sobre R$959 mil faturados/liberados;
- total reduzido: R$3.999,03;
- total integral: R$8.002,17;
- cotação agregada confirma explicitamente R$1,37 mi / R$137 mil nominais / R$3.999,03 / R$8.002,17;
- R$137 mil é valor nominal da cotação, não o cashback final do cenário com embutido;
- proposta atual sem Seguro Prestamista;
- validade comercial mostrada: 30/09/2026.

**Critério de aceite:**  
Selecionar o preset reproduz exatamente os números da cotação antes de contemplação/reajustes.

**Versão-alvo:**  
primeira versão multi-cota

---

### SW-062 — Permitir override de parcela inicial por cotação oficial

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** REGRA FINANCEIRA / UX / AUDITORIA  
**Origem:** parcela reduzida não é exatamente 50% da integral  
**Nível da evidência:** COTAÇÃO COMERCIAL ESCRITA

**Problema:**  
Forçar `reduzida = 50% × integral` não reproduz a proposta recebida.

**Possível mudança:**  
Separar:
- parcela calculada pelo motor;
- parcela oficial cotada;
- flag `usarValoresCotados`.

Exibir diferença de reconciliação.

**Critério de aceite:**  
O usuário consegue reproduzir o boleto/cotação sem esconder a fórmula teórica.

**Versão-alvo:**  
junto com SW-061

---

### SW-063 — Cashback por cota com base nominal/promocional

**Status:** SUPERADA PELA RECONCILIAÇÃO DE SW-028 — NÃO IMPLEMENTAR COMO REGRA FINAL  
**Prioridade:** ALTA  
**Tipo:** MÚLTIPLAS COTAS / CASHBACK  
**Origem:** cotações exibem 10% exatos do valor nominal por cota  
**Nível da evidência:** COTAÇÃO + REGULAMENTO PROMOCIONAL

**Possível mudança:**  
Guardar por cota:
- crédito nominal/contratado;
- crédito líquido após embutido;
- crédito efetivamente utilizado;
- base de cashback;
- cashback prometido/cotado.

Para o preset atual:
- 400k → 40k;
- 370k → 37k;
- 200k → 20k.

**Resultado posterior:**  
QN-058 foi respondida: para o cenário atual, o cashback é calculado sobre o crédito líquido efetivamente faturado/liberado. Com R$1,37 milhão nominal e 30% de embutido, a base é R$959 mil e o cashback é R$95,9 mil.

**Decisão:**  
Não implementar esta issue como exceção nominal. Preservar apenas os campos por cota para auditoria da cotação e usar SW-028 como regra financeira canônica.

**Versão-alvo:**  
nenhuma; item superseded

---

### SW-064 — Painel-resumo da proposta multi-cota

**Status:** PARCIALMENTE IMPLEMENTADA — RESUMOS E DETALHE MULTI-COTA EXISTEM; FALTA CARD ÚNICO DE CONFERÊNCIA DA COTAÇÃO E DO CENÁRIO EFETIVO
**Prioridade:** MÉDIA  
**Tipo:** UX / NOVO OUTPUT  
**Origem:** material comercial apresenta a proposta de forma simples por carta  
**Nível da evidência:** DECISÃO DE UX

**Possível mudança:**  
Mostrar no topo:
- crédito total;
- quantidade de cotas;
- parcela reduzida total;
- parcela integral total;
- cashback nominal total da cotação;
- cashback efetivo do cenário após embutido/uso do crédito;
- prazo remanescente;
- distribuição das cotas.

**Critério de aceite:**  
O usuário consegue conferir em segundos tanto a proposta nominal (R$1,37 mi / R$3.999,03 / R$8.002,17 / R$137 mil nominais) quanto o cenário efetivo; com 30% de embutido, o cashback deve aparecer como R$95,9 mil.

**Versão-alvo:**  
primeira versão multi-cota

---

### SW-065 — Não hard-code R$123,3 mil como teto de despesas

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** VALIDAÇÃO / REGRA FINANCEIRA  
**Origem:** inconsistência na mensagem comercial  
**Nível da evidência:** VALOR COMERCIAL NÃO EXPLICADO

**Regra:**  
O teto de despesas deve ser calculado a partir da base formal aplicável, nunca como constante.

**Dependência:**  
QN-059 para esclarecer base em cenário multi-cota/embutido.

**Critério de aceite:**  
Mudar cartas/embutido recalcula automaticamente o limite e não preserva R$123,3 mil por acidente.

**Versão-alvo:**  
junto com SW-023/SW-025

---

### SW-066 — Parametrizar prazo operacional do pagamento do lance

**Status:** PRONTA PARA ESPECIFICAR — 2 DIAS ÚTEIS CONFIRMADOS COMERCIALMENTE E ALINHADOS À ATA  
**Prioridade:** BAIXA  
**Tipo:** CRONOLOGIA / LIQUIDEZ  
**Origem:** resposta de Michele em 29/09/2026 + ata do Grupo 4012 já analisada  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL COERENTE COM DOCUMENTO DO GRUPO

**Regra operacional:**  
`prazoPagamentoLanceDiasUteis = 2`

Michele também usou a expressão “48 horas”, mas a referência operacional deve ser “até dois dias úteis / segundo dia útil”, porque 48 horas corridas não são equivalentes quando há fim de semana ou feriado.

**Uso futuro:**  
Não altera o motor mensal padrão, mas pode alimentar:
- warning de liquidez;
- calendário operacional;
- eventual financiamento ponte.

**Critério de aceite:**  
A interface informa “até o 2º dia útil” e não “3 dias”.

**Versão-alvo:**  
próxima revisão de UX/cronologia operacional

---

### SW-067 — Reajuste anual pelo calendário/aniversário do grupo

**Status:** PRONTA PARA ESPECIFICAR — MÊS DO PRIMEIRO REAJUSTE CONFIRMADO  
**Prioridade:** ALTA  
**Tipo:** CRONOLOGIA / GRUPO EM ANDAMENTO / MÚLTIPLAS COTAS  
**Origem:** respostas de Michele em 28–29/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL ESCRITA

**Comportamento atual da V3.2:**  
O motor ainda não usa o calendário contratual real do Grupo 4012 para posicionar o primeiro reajuste.

**Nova regra/evidência:**  
- o reajuste anual ocorre no calendário de aniversário aplicável ao grupo/cota;
- para a proposta atual, a próxima assembleia do dia 18 NÃO dispara o reajuste anual;
- o primeiro reajuste das novas cotas será em **abril de 2027**, cerca de sete meses após a entrada;
- a “virada da tabela” mensal é evento comercial distinto.

A arquitetura deve suportar:
- `dataBaseReajusteGrupo` ou, na resolução mensal atual, `mesAniversarioGrupo`;
- `mesEntradaCota`;
- primeira ocorrência do aniversário aplicável após a entrada;
- calendário comum de reajuste para cotas do mesmo grupo;
- override/preset da proposta atual com primeiro reajuste em abril/2027.

**Impacto esperado:**  
Material: impede que o simulador aplique 3% cedo demais na próxima assembleia ou tarde demais após 12 meses completos da adesão.

**Dependências:**  
- QN-061 resolvida;
- QN-063 só permanece relevante para o dia exato caso haja futura resolução diária;
- QN-020 continua necessária para a ordem reajuste × contemplação quando coincidirem no mesmo mês.

**Critério de aceite:**  
No preset desta proposta, uma cota contratada agora mantém o calendário sem reajuste anual até março/2027 e aplica o primeiro evento anual em abril/2027, sem associá-lo à assembleia mensal do dia 18.

**Versão-alvo:**  
próxima revisão estrutural, após a rodada documental e antes da nova auditoria.

---

### SW-068 — Permitir mês de início do Seguro Prestamista por cota

**Status:** PRONTA PARA ESPECIFICAR  
**Prioridade:** MÉDIA  
**Tipo:** SEGURO / MÚLTIPLAS COTAS / CRONOLOGIA  
**Origem:** inclusão posterior confirmada por Michele  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL

**Comportamento atual da V2.54:**  
Se seguro está ativo, ele é cobrado desde o início da simulação.

**Nova regra:**  
Adicionar por cota:
- `seguroAtivo`;
- `mesInicioSeguro`;
- fórmula/taxa vigente a partir desse mês.

Nenhum prêmio deve ser criado antes da adesão efetiva ao seguro.

**Dependências:**  
QN-050/QN-051 para fórmula e QN-064 para carência/regras de inclusão.

**Critério de aceite:**  
Ativar seguro no mês 24 deixa meses 1–23 idênticos ao cenário sem seguro.

**Versão-alvo:**  
próxima revisão após arquitetura multi-cota

---

### SW-069 — Metadados de cotação, validade e “trava” comercial

**Status:** PRONTA PARA ESPECIFICAR — MARCO OPERACIONAL CONFIRMADO COMERCIALMENTE  
**Prioridade:** MÉDIA  
**Tipo:** UX / RASTREABILIDADE / VALIDAÇÃO  
**Origem:** cotação válida até 30/09/2026 + resposta específica de Michele em 29/09/2026  
**Nível da evidência:** COTAÇÃO + CONFIRMAÇÃO COMERCIAL DIRETA

**Fluxo confirmado:**  
`documentos → contrato emitido/homologado → e-mail → aceite eletrônico → primeira parcela paga`

Com aceite e primeira parcela:
- entrada no plano;
- alocação de grupo/cota;
- acesso ao aplicativo;
- participação nas assembleias;
- preservação da condição comercial/cashback, segundo Michele.

**Regra de estado sugerida:**

`condicaoComercialTravada = contratoEmitido && aceiteEletronico && primeiraParcelaPaga`

Deadline do preset:
`30/09/2026`

**Metadados futuros:**
- data da cotação;
- validade;
- data de envio de documentos;
- emissão/homologação;
- aceite eletrônico;
- primeiro pagamento;
- grupo;
- cota;
- acesso ao app;
- status de efetivação.

**Cronologia adicional:**  
Segunda parcela informada para 15/11/2026.

**Guardrail:**  
Não marcar condição como travada apenas com emissão do contrato. Conferir contrato final antes de tornar o preset definitivo.

**Critério de aceite:**  
A interface consegue distinguir:
- cotação válida;
- contrato emitido;
- contrato aceito;
- primeira parcela paga;
- adesão efetivada.

**Versão-alvo:**  
próxima revisão de rastreabilidade/UX.

---

### SW-070 — Não confundir mudança da tabela comercial com reajuste contratual

**Status:** PRONTA PARA ESPECIFICAR — REGRA CONFIRMADA COMERCIALMENTE  
**Prioridade:** MÉDIA  
**Tipo:** ARQUITETURA / CRONOLOGIA / DOCUMENTAÇÃO  
**Origem:** respostas de Michele sobre “virada da tabela” e reajuste anual  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL ESCRITA

**Regra confirmada:**  
Manter eventos separados:
- `mudancaTabelaNovasAdesoes` / fechamento comercial mensal;
- `reajusteAnualCotaAtiva`.

Michele esclareceu que são “dois eventos completamente diferentes”: a tabela comercial fecha antes da assembleia (por volta do dia 12) para novas entradas, enquanto o reajuste contratual de 3% ocorre uma vez por ano. Para a proposta atual, o próximo dia 18 não aplica os 3%; o primeiro reajuste será em abril/2027.

A mudança da tabela para novos clientes NÃO deve alterar automaticamente uma cota já formalizada, e o reajuste anual NÃO deve ser tratado como expiração da cotação ou fechamento mensal da tabela.

**Dependências:**  
Nenhuma para a separação conceitual. QN-062 foi respondida comercialmente: a condição é efetivada após emissão do contrato, aceite eletrônico e pagamento da primeira parcela dentro do prazo.

**Critério de aceite:**  
O motor/estado consegue representar as duas datas sem dupla aplicação ou supressão de 3%, e o preset atual não aplica reajuste anual na próxima assembleia mensal.

**Versão-alvo:**  
próxima revisão estrutural.

---

### SW-071 — Financiamento do lance em múltiplas datas / tranches

**Status:** IMPLEMENTADA — V2.60  
**Prioridade:** P0 CONCLUÍDA  
**Tipo:** FINANCIAMENTO / MÚLTIPLAS COTAS / CRONOLOGIA  
**Origem:** decisão interna de modelagem para contemplações independentes  
**Nível da evidência:** DECISÃO INTERNA DE MODELAGEM

**Regra implementada:**  
Cada cota contemplada pode gerar uma tranche de financiamento própria, liberada no mês daquela contemplação.

Cada tranche mantém:
- percentual financiado;
- principal;
- taxa;
- TR;
- prazo;
- Price/SAC;
- primeira parcela;
- juros;
- saldo.

Condições podem ser iguais para todas as cotas ou individualizadas.

**Critério de aceite:**  
Cotas contempladas em meses diferentes começam a gerar dívida/parcelas bancárias em datas diferentes; se todas contemplarem juntas com termos idênticos, a soma deve equivaler ao empréstimo agregado.

---

### SW-072 — Painel decisório / matriz de cenários

**Status:** IMPLEMENTADA — V2.61  
**Prioridade:** P0 CONCLUÍDA  
**Tipo:** ANÁLISE / SENSIBILIDADE / UX  
**Origem:** decisão interna para suportar a decisão até 30/09  
**Nível da evidência:** DECISÃO INTERNA DE MODELAGEM

**Regra implementada:**  
Comparar múltiplos cenários usando o mesmo motor financeiro, variando:
- contemplação por cota;
- Lance Livre;
- rendimento da carta como % do CDI;
- percentual financiado do dinheiro do lance.

**Outputs:**  
Δ vs CDB, patrimônio final, aportes, aportes em valor presente, pico mensal, lance em dinheiro, principal financiado, pico da dívida bancária, mês da compra, complemento e cashback.

**Critério de aceite:**  
A linha “Atual” reproduz a simulação principal; presets de cenário não são apresentados como probabilidades.

---

### SW-073 — Biblioteca de consórcios/cenários no localStorage + JSON

**Status:** IMPLEMENTADA — V3.0  
**Prioridade:** ALTA PARA COMPARAÇÃO ENTRE CONCORRENTES  
**Tipo:** PERSISTÊNCIA / UX / RASTREABILIDADE  
**Origem:** necessidade de comparar propostas diferentes  
**Nível da evidência:** DECISÃO INTERNA DE PRODUTO

**Regra implementada:**  
Permitir N cenários salvos localmente com:
- selecionar;
- salvar;
- salvar como;
- excluir;
- exportar JSON versionado;
- importar JSON.

O estado persistido inclui controles financeiros e matriz decisória.

**Critério de aceite:**  
Alternar entre propostas não altera silenciosamente seus parâmetros; exportar/importar preserva os cenários.

---

### SW-074 — Layout vertical sem rolagem horizontal

**Status:** IMPLEMENTADA — V3.1  
**Prioridade:** MÉDIA  
**Tipo:** UX / RESPONSIVIDADE  
**Origem:** crescimento das tabelas após multi-cota, tranches e matriz  
**Nível da evidência:** DECISÃO INTERNA DE UX

**Regra implementada:**  
Tabelas largas de:
- cotas;
- tranches;
- condições individuais;
- matriz decisória

são apresentadas em cartões/sublinhas verticais.

**Critério de aceite:**  
A aplicação permanece utilizável sem scroll horizontal nas larguras de tela suportadas.

---

### SW-075 — Quantidade dinâmica de cotas e modo de uma única cota

**Status:** IMPLEMENTADA — V3.2  
**Prioridade:** ALTA PARA COMPARAÇÃO ENTRE CONCORRENTES  
**Tipo:** ARQUITETURA / UX / PERSISTÊNCIA  
**Origem:** necessidade de comparar propostas com quantidades diferentes de cotas  
**Nível da evidência:** DECISÃO INTERNA DE PRODUTO

**Regra implementada:**  
O usuário escolhe de 1 a 50 cotas.

O motor, tranches, resultados, matriz decisória e persistência são reconstruídos para a quantidade ativa.

Quando `numeroCotas == 1`:
- a contemplação volta a ser exibida em slider;
- a arquitetura interna continua sendo `cotas[]`.

Presets antigos de quatro cotas devem continuar compatíveis.

**Importante:**  
1–50 é capacidade do software, não regra comercial de qualquer administradora.

**Critério de aceite:**  
Cenários com 1, 4 ou N cotas podem ser salvos, carregados, exportados e importados sem perda de estado.

---


### SW-076 — Camada de calibração por histórico real de lances

**Status:** IMPLEMENTADA PARCIALMENTE — V3.3  
**Prioridade:** MÉDIA  
**Tipo:** ANÁLISE / SENSIBILIDADE / EVIDÊNCIA EMPÍRICA  
**Origem:** atas 001–006 do Grupo 4012 + resposta de Michele sobre sigilo dos lances  
**Nível da evidência:** DOCUMENTOS OFICIAIS DOS RESULTADOS; SEM DENOMINADOR DE TODAS AS OFERTAS

**Histórico verificado:**  
- abr: 60,1400%;
- mai: 60,9867%;
- jun: nenhum vencedor por Lance Livre; Lance Fixo vencedor a 30%;
- jul: 73,0000% / 72,7300%;
- ago: 70,6877% / 70,5508% / 69,5200% / 68,9081%;
- set: 73,0000% / 72,0000% / 72,0000% / 72,0000%.

**Modelagem de dados recomendada:**  
Por assembleia:
- `data`;
- `vencedoresLivre[]`;
- `vencedorFixoPct`;
- `qtdVencedoresLivre`;
- `qtdCotasAptas`;
- `saldoAssembleia`.

Para junho:
- `vencedoresLivre = []`;
- `qtdVencedoresLivre = 0`;
- NÃO armazenar `0%` como lance vencedor.

**Limitação confirmada:**  
O total de ofertas é sigiloso/inacessível ao cliente.

**Guardrails obrigatórios:**  
- NÃO calcular probabilidade;
- NÃO calcular “% de sucesso”;
- NÃO inferir distribuição dos perdedores;
- NÃO misturar Fixo 30% com Livre;
- não converter mês sem vencedor em lance de 0%;
- rotular claramente o histórico como descritivo.

**Critério de aceite:**  
O histórico melhora interpretação sem produzir estatística inexistente.

**Implementado na V3.3:**  
- default analítico do Lance Livre em 70%;
- presets da matriz entre 60,1% e 73%;
- contexto histórico explícito;
- alerta para lances abaixo do histórico observado;
- sem cálculo de probabilidade/taxa de sucesso.

---

### SW-077 — Calendário operacional da assembleia: dia 18 com ajuste para dia útil

**Status:** CANDIDATA — NÃO IMPLEMENTAR NESTA RODADA  
**Prioridade:** BAIXA  
**Tipo:** CRONOLOGIA OPERACIONAL / UX  
**Origem:** resposta de Michele em 29/09/2026 + histórico de atas do Grupo 4012  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL COERENTE COM DADOS DO GRUPO

**Regra informada:**  
- assembleia regular: dia 18;
- se 18 não for dia útil, deslocar para dia útil seguinte;
- outubro/2026: 19/10 porque 18/10 é domingo.

**Validação empírica:**  
Julho/2026 teve assembleia em 20/07; 18/07/2026 caiu em sábado.

**Possível mudança futura:**  
Adicionar:
- `diaBaseAssembleia = 18`;
- calendário de feriados/fins de semana apenas em modo operacional diário;
- próxima data estimada de assembleia;
- prazo limite de pagamento do lance em 2 dias úteis após o evento aplicável.

**Impacto:**  
Nenhum no motor mensal padrão. Útil para planejamento de liquidez, lances e checklist contratual.

**Guardrail:**  
Não vincular essa data ao reajuste anual de 3%.

**Versão-alvo:**  
somente quando houver cronologia diária/operacional.

---


### SW-078 — Limites de carta do produto QuintoAndar

**Status:** CANDIDATA — NÃO IMPLEMENTAR NESTA RODADA  
**Prioridade:** BAIXA  
**Tipo:** PRESET / VALIDAÇÃO DE INPUT / UX  
**Origem:** resposta de Michele em 29/09/2026  
**Nível da evidência:** CONFIRMAÇÃO COMERCIAL

**Regra informada:**  
No produto QuintoAndar:
- carta mínima = R$200 mil;
- carta máxima = R$400 mil.

**Possível mudança futura:**  
No preset QuintoAndar:
- validar `200000 <= carta <= 400000`;
- ao informar necessidade agregada acima de R$400 mil, sugerir múltiplas cotas;
- para R$1,37 milhão, indicar mínimo estrutural de 4 cotas.

**Guardrail:**  
Não exibir afirmações como “mais cotas aumentam a probabilidade de contemplação” sem modelagem probabilística sustentada por dados.

**Impacto:**  
Nenhum na matemática atual; melhora consistência do preset e evita cenários impossíveis dentro do produto.

**Versão-alvo:**  
futura revisão de UX/presets.

---


### SW-079 — Núcleo financeiro testável e regressões automatizadas

**Status:** IMPLEMENTADA — V3.5  
**Prioridade:** P0  
**Tipo:** ARQUITETURA / TESTES  
**Origem:** issue #3

**Implementado:**  
- `model-core.js` com as regras puras de Lance Livre/embutido e cashback;
- `index.html` passa a consumir o mesmo núcleo testado;
- `tests/model-core.test.js` com regressões dos casos reconciliados;
- `package.json` sem dependências externas;
- GitHub Actions executa `npm test` em push/PR.

**Casos protegidos:**  
- 45% × R$495.330 = R$222.898,50;
- embutido de 30% sobre carta de R$400 mil = R$120.000;
- parte em dinheiro = R$102.898,50;
- embutido limitado ao valor total do lance;
- cashback de 10% sobre R$959 mil = R$95.900.

**Critério de aceite:**  
A aplicação e os testes usam as mesmas funções de núcleo; não há duplicação dessas fórmulas críticas.

**Versão:** V3.5.

---

## Modelo de registro

### SW-001 — [Título curto]

**Status:** CANDIDATA  
**Prioridade:** ALTA / MÉDIA / BAIXA  
**Tipo:** [categoria]  
**Origem:** resposta da vendedora sobre [tema]  
**Nível da evidência:** [classificação]

**Comportamento atual da V2.54:**  
[como funciona hoje]

**Nova informação:**  
[o que a resposta indica]

**Possível mudança:**  
[alteração sugerida]

**Impacto esperado:**  
- Motor:
- Interface:
- Métricas:
- Testes:
- Documentação:

**Dependências / dúvidas antes de implementar:**  
[confirmações necessárias]

**Critério de aceite:**  
[o que deve ser verdadeiro depois da implementação]

**Versão-alvo:**  
[a definir]