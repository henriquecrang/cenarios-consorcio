# Especificação canônica do modelo — Simulador Consórcio × CDB × Imóvel

**Baseline de implementação atual:** V3.11  
**Status:** especificação funcional e financeira canônica do comportamento esperado do simulador  
**Documentos complementares:**  
- `docs/pendencias.md` — premissas externas, regras contratuais e funcionalidades ainda abertas;  
- `docs/backlog-software.md` — histórico/estado das mudanças de software;  
- `docs/backlog-perguntas-bamaq.md` — perguntas e respostas comerciais/documentais;  
- `docs/follow-up-auditorias.md` — trilha histórica de auditorias e evidências.

O Git e o arquivo de follow-up preservam a evolução histórica. Este documento deve ser lido linearmente como o **estado canônico atual**; descrições de comportamento de versões antigas não prevalecem sobre as regras abaixo.

---

# 1. Finalidade

Este documento define **como o simulador deve funcionar**.

Ele é a referência normativa para:

- implementação;
- manutenção;
- testes;
- auditorias futuras;
- comparação entre versões;
- identificação de regressões;
- separação entre regra do modelo e hipótese externa ainda não confirmada.

Quando houver conflito entre:

1. um label da interface;
2. um comportamento acidental do JavaScript;
3. esta especificação;

a divergência deve ser tratada como possível bug ou como necessidade de atualizar explicitamente esta especificação.

Uma alteração intencional da regra econômica deve ser registrada também em `docs/follow-up-auditorias.md`.

---

# 2. Escopo estrutural

## 2.1 Unidade econômica simulada

A unidade estrutural do motor é a **cota individual**:

`cotas[]`

Cada cota mantém identidade própria para:
- crédito/carta;
- saldo devedor;
- mês de contemplação;
- lance;
- embutido;
- rendimento;
- parcela;
- tranche bancária associada.

O simulador permite 1 a 50 cotas como capacidade de produto. Isso NÃO afirma limite contratual da Bamaq.

O preset QuintoAndar analisado usa:
- R$400 mil;
- R$400 mil;
- R$370 mil;
- R$200 mil.

Agregações são permitidas apenas para KPIs e fluxos consolidados; não podem apagar diferenças de timing ou permitir pooling indevido entre cotas.

A compra com apenas um subconjunto das cotas contempladas ainda é uma funcionalidade pendente e está registrada na seção 79.

---

## 2.2 Horizonte

O horizonte é mensal e contém:

`m = 1, 2, ..., N`

onde:

- `N` = prazo restante do consórcio em meses.

O motor deve devolver `N` explicitamente para a camada de apresentação e para os painéis auxiliares.

---

# 3. Convenções normativas

Neste documento:

- **DEVE** = comportamento obrigatório;
- **NÃO DEVE** = comportamento proibido;
- **PODE** = comportamento opcional/configurável;
- **PENDENTE** = comportamento que não deve ser inventado até haver evidência suficiente.

---

# 4. Notação principal

| Símbolo | Significado |
|---|---|
| `C0` | valor bruto inicial da carta |
| `C_m` | valor corrente da carta antes da contemplação |
| `D_m` | saldo devedor do consórcio |
| `N` | prazo restante, em meses |
| `P_m` | parcela integral corrente |
| `r_red` | percentual da parcela reduzida |
| `r_adm` | taxa administrativa total |
| `r_res` | fundo de reserva |
| `r_reaj` | reajuste anual do consórcio |
| `m_cont` | mês da contemplação |
| `L` | lance efetivo |
| `L_emb` | parcela embutida do lance |
| `L_cash` | parcela do lance em dinheiro |
| `Carta_m` | saldo financeiro da carta contemplada e não utilizada |
| `i_CDB` | taxa mensal equivalente do CDB |
| `i_carta` | taxa mensal equivalente da remuneração da carta |
| `π` | inflação mensal equivalente |
| `Caixa_m` | caixa financeiro da estratégia |
| `Benchmark_m` | saldo do CDB benchmark |
| `Aporte_m` | dinheiro efetivamente necessário do bolso no mês |
| `Δ` | patrimônio final comparável da estratégia menos benchmark |

---

# 5. Conversão de taxas anuais para mensais

Para taxas anuais efetivas:

`i_m = (1 + i_a)^(1/12) - 1`

Essa conversão é utilizada para:

- CDB;
- inflação;
- remuneração da carta;
- TR anual projetada.

A remuneração da carta deve ser parametrizada a partir do CDI, separadamente do CDB benchmark.

Premissa-base líquida atual:

`i_carta,a = i_CDI,a × p_carta`

com:

`p_carta_base = 0,80`

e sua taxa mensal:

`i_carta,m = (1 + i_carta,a)^(1/12) - 1`

**Evidência comercial e regulatória consolidada:**
- Michele informou que o crédito contemplado e ainda não utilizado fica aplicado e recebe o rendimento líquido efetivo das aplicações do grupo;
- a faixa de 98%–105% do CDI foi posteriormente esclarecida como referência **bruta** da aplicação/fundo;
- para projeção financeira da carta, a orientação comercial recebida foi usar aproximadamente **80% do CDI líquido**;
- a Resolução BCB nº 285/2023 determina que os recursos vinculados à contemplação sejam aplicados nos ativos permitidos e que o crédito do consorciado seja acrescido dos **rendimentos líquidos financeiros** proporcionais ao período de aplicação.

**Regra canônica da especificação:** o retorno da carta é independente do CDB benchmark. O benchmark mede custo de oportunidade; a carta recebe o rendimento líquido efetivo da aplicação vinculada à contemplação. Não aplicar um segundo haircut/IR sobre o parâmetro de 80% quando ele já representa retorno líquido.

---



## 5.3 Limites de carta no produto QuintoAndar

Resposta comercial de Michele em 29/09/2026:

- `carta_minima_produto = R$ 200.000`;
- `carta_maxima_produto = R$ 400.000`.

Dentro do produto/grupos QuintoAndar analisados:
- não há cartas individuais de R$600 mil, R$700 mil, R$1 milhão ou R$1,5 milhão;
- valores maiores são estruturados por múltiplas cotas.

Para uma necessidade nominal de R$1,37 milhão:

`qtd_min_cotas = ceil(1.370.000 / 400.000) = 4`

Portanto, a estrutura em quatro cotas é compatível com o limite estrutural do produto e não deve ser tratada na interface como mera preferência configurável por uma carta única equivalente.

A justificativa comercial de que o desmembramento aumenta “chances” por sorteio/lance não deve ser codificada como vantagem probabilística sem dados que a sustentem.

---

# 6. Estado inicial do consórcio

## 6.1 Entrada em grupo já em andamento

Para a proposta analisada, Michele confirmou que a nova cota entra com:

`N = 214 meses remanescentes`

e que o plano integral da nova cota é distribuído nesse prazo.

Não existe, na memória comercial recebida, um saldo previamente amortizado pelo fato de o grupo ter começado antes da adesão.

## 6.2 Taxas integrais

Para a proposta:

`r_adm = 24%`

`r_res = 1%`

Esses percentuais são aplicados integralmente ao valor do crédito contratado pela nova cota.

Logo:

`D0 = C0 × (1 + r_adm + r_res)`

Exemplo comercial confirmado:

`C0 = R$ 200.000`

`D0 = 200.000 × 1,25 = R$ 250.000`

## 6.3 Parcela integral inicial

Com prazo remanescente `N`:

`P0 = D0 / N`

No exemplo:

`P0 = 250.000 / 214 = R$ 1.168,22`

Esse exemplo valida diretamente a fórmula estrutural usada pelo motor atual.

## 6.4 Parcela reduzida

Antes da contemplação:

`Parcela_m = P_m × r_red`

O percentual reduzido é limitado no motor a:

`0% ≤ r_red ≤ 100%`

A memória anterior de R$ 1.167,60 para a parcela reduzida de uma carta de R$ 400 mil continua sem reconciliação, pois não corresponde exatamente a 50% da parcela integral informada.


## 6.4A Coeficientes observados nas cotações

As cotações de R$ 400 mil, R$ 370 mil e R$ 200 mil usam de forma consistente:

`P_integral ≈ C × 0,005841`

`P_reduzida ≈ C × 0,002919`

Logo:

`P_reduzida / P_integral ≈ 49,9743%`

A frase comercial “redução de 50%” deve ser entendida como descrição arredondada até que a Bamaq forneça a memória exata.

Regra de implementação recomendada:
- manter a fórmula estrutural atual para simulação;
- permitir que um preset de proposta carregue os valores oficiais da cotação como override;
- não forçar `P_reduzida = 0,5 × P_integral` quando reproduzindo essa proposta específica.

## 6.5 Grupo original versus prazo da nova cota

A arquitetura futura deve distinguir:
- duração original/cronologia do grupo;
- mês de entrada da cota;
- prazo remanescente contratual da cota na adesão.

O motor financeiro da nova cota deve usar o prazo contratual remanescente aplicável àquele ingresso, e não presumir que toda nova cota começa com a duração original do grupo.

## 6.6 Regra da proposta e ressalva documental — assembleias anteriores à adesão

Para o preset da proposta QuintoAndar/Bamaq do Grupo 4012, a regra-alvo passa a ser:

- NÃO existem parcelas retroativas relativas aos meses anteriores à adesão;
- NÃO existe dedução do crédito contemplado por assembleias anteriores;
- a cota é tratada como cota nova de lançamento/abertura de vaga em grupo em andamento;
- o saldo inicial do novo aderente nasce do crédito contratado + taxa de administração + fundo de reserva;
- esse saldo é distribuído pelo prazo remanescente de 214 meses;
- na contemplação, a carta não deve sofrer desconto de “mensalidades passadas”.

Essa regra foi confirmada comercialmente de forma expressa por Michele em 29/09/2026 para as quatro cotas da operação.

A explicação comercial apresentada foi que a cláusula genérica sobre assembleias anteriores se aplicaria a situações de substituição/repescagem de cotas canceladas, enquanto este produto oferece cotas novas de lançamento/abertura de vagas. A especificação registra essa justificativa como **interpretação comercial**, não como conclusão jurídica independente.

**Ressalva documental:**
O Regulamento Geral Bamaq 2025, art. 8º, VI, “a”, contém redação que, lida isoladamente, prevê obrigação relativa às assembleias anteriores quando uma adesão em grupo em andamento é contemplada. Ainda não foi apresentado o Regulamento 2026, aditivo ou contrato específico que reconcilie formalmente esse texto com a regra comercial acima.

Portanto, para o software:
- o preset atual NÃO DEVE implementar `AjusteAssembleiasAnteriores`;
- o cenário-base NÃO DEVE deduzir qualquer valor retroativo na contemplação;
- eventual regra contrária só pode ser introduzida depois de evidência documental específica e deve aparecer como evento explícito, nunca como ajuste oculto no saldo/parcela.

A conferência do contrato final continua sendo requisito de diligência antes da decisão financeira, mas não altera o comportamento-alvo atual do simulador.

## 6.7 Primeiro reajuste

A cronologia mensal do primeiro reajuste desta proposta foi esclarecida comercialmente.

Evidência acumulada:
- Michele havia informado que o reajuste anual ocorre no **aniversário do grupo**;
- em 29/09/2026, esclareceu que a virada mensal da tabela comercial e o reajuste anual de 3% NÃO são o mesmo evento;
- informou que a próxima assembleia do dia 18 não aplicará os 3% às cotas contratadas agora;
- informou e depois reafirmou que o **primeiro reajuste ocorrerá em abril de 2027**, aproximadamente sete meses após a entrada atual.

Logo, para a proposta analisada e na resolução mensal do simulador:
- a cota NÃO deve esperar 12 meses completos desde a adesão para o primeiro reajuste;
- a cota também NÃO deve sofrer 3% já na próxima assembleia mensal;
- `primeiroMesReajuste = abril/2027`;
- o fechamento/virada da tabela comercial é um evento separado e não deve acionar o reajuste contratual.

A resposta mais recente usou a expressão “aniversário da cota/grupo”, enquanto a resposta anterior dizia “aniversário do grupo”. A especificação deve preservar o dado operacional confirmado para esta proposta (abril/2027) e manter a redação contratual exata como evidência documental desejável, sem transformar a ambiguidade verbal em uma nova regra.

A arquitetura deve suportar:

`mesAniversarioGrupo`

independente de:

`mesAdesaoCota`

Além disso, presets de propostas reais DEVEM poder registrar explicitamente o primeiro mês de reajuste conhecido quando a data de entrada ocorre em grupo já em andamento.

O dia exato dentro de abril/2027 permanece pendente, mas não é necessário para o motor mensal atual. Se houver futura resolução diária/pro rata, esse dado deverá ser confirmado antes da implementação.

# 7. Reajuste do consórcio

## 7.1 Regra comercial confirmada

Para a proposta analisada, Michele confirmou em 28/09/2026:

`r_reaj = 3% a.a. fixos`

Essa taxa não é tratada como INCC, IPCA ou outro índice variável.

A regra econômica informada é:

### Antes da contemplação
Os 3% anuais corrigem:
- o valor atualizado da carta/crédito;
- o saldo devedor;
- as parcelas.

No modelo:

`C ← C × 1,03`

`D ← D × 1,03`

e a parcela aplicável é atualizada de forma coerente com o novo saldo/regras do plano.

### Depois da contemplação
A carta contemplada deixa de seguir o reajuste fixo do consórcio e passa a receber os rendimentos líquidos da aplicação financeira vinculada.

O saldo devedor continua sujeito ao reajuste fixo de 3% a.a.

No modelo:

`D ← D × 1,03`

e a parcela pós-contemplação é recalculada com base no saldo e no prazo restante segundo a convenção vigente.


## 7.2 Data-base e tabela comercial

Confirmado comercialmente:
- reajuste contratual anual = 3%;
- a referência temporal está associada ao aniversário aplicável ao grupo/cota;
- para a proposta atual, o primeiro reajuste será em **abril/2027**;
- a assembleia mensal do dia 18 NÃO é o evento que aplica imediatamente esse reajuste às cotas contratadas agora;
- a “virada da tabela”/fechamento comercial mensal é evento distinto do reajuste anual;
- a tabela comercial fecha antes da assembleia, por volta do dia 12 de cada mês, para definir condições/vagas de novas entradas;
- entrando na tabela atual, o cliente preserva as condições comerciais atuais da proposta; quanto ao reajuste anual, não há 3% antes de abril/2027.

Ainda pendente:
- dia exato dentro de abril em que o reajuste é processado, caso seja necessária precisão diária;
- ordem se reajuste e contemplação coincidirem no mesmo mês;
- memória oficial do recálculo pós-contemplação;

A especificação DEVE manter distinção entre:
- **fechamento/mudança de tabela comercial para novas adesões**;
- **reajuste contratual anual de 3% de cotas ativas**.

A frase “a tabela vai virar” NÃO deve ser traduzida como reajuste automático da cota já contratada.

Para o preset da proposta atual:

`primeiroMesReajuste = abril/2027`

A opção configurável de ordem reajuste × contemplação deve permanecer enquanto a cronologia do mês coincidente não estiver formalmente confirmada.

## 7.3 Interpretação de previsibilidade

O fato de o reajuste ser fixo em 3% a.a. aumenta a previsibilidade da regra de correção, mas NÃO significa que o valor nominal exato de todas as parcelas seja conhecido desde a adesão.

A trajetória depende também de:
- mês de contemplação;
- lance;
- embutido;
- forma de amortização;
- saldo devedor remanescente;
- eventual recálculo pós-contemplação.

A interface não deve usar a frase “sabe exatamente quanto vai pagar do início ao fim” como descrição técnica do modelo.

---

# 8. Reajuste e contemplação no mesmo mês

A ordem é configurável.

## 8.1 Modo A — reajuste antes da contemplação

O reajuste atinge:

- carta;
- saldo devedor;
- parcela aplicável.

Depois ocorre a contemplação.

## 8.2 Modo B — contemplação antes do reajuste

Nesse modo:

1. a parcela reduzida do mês é paga;
2. a contemplação usa a carta anterior ao reajuste;
3. ocorre o lance;
4. o reajuste daquele mês incide apenas sobre o saldo devedor remanescente;
5. a parcela pós-contemplação é recalculada.

O simulador NÃO deve afirmar qual dessas ordens corresponde à Bamaq enquanto a cronologia contratual não estiver confirmada.

---

# 9. Ordem dos principais eventos mensais

A ordem canônica é importante porque altera resultados.

Em cada mês, conceitualmente:

1. reajuste do consórcio, salvo quando diferido pelo modo “contemplação antes”;
2. aniversário do imóvel, quando aplicável;
3. cálculo e pagamento da parcela do consórcio;
4. cobrança do seguro, se ativo;
5. prestação do empréstimo do lance;
6. contemplação, quando `m = m_cont`;
7. eventual reajuste diferido no mesmo mês da contemplação;
8. rendimento da carta contemplada, quando elegível;
9. resgate, se configurado;
10. compra do imóvel, se configurada;
11. aluguel/custos operacionais do imóvel, apenas se `m > mês_compra`;
12. venda do imóvel, se configurada;
13. venda/cessão da carta, se configurada;
14. acerto final do saldo do consórcio em `m = N`;
15. capitalização do CDB benchmark e do caixa já existente;
16. entrada de valores extraordinários de fim de mês;
17. cálculo do aporte efetivo do bolso;
18. aplicação do aporte no benchmark;
19. atualização do patrimônio do mês.

Os painéis auxiliares DEVEM gerar cenários economicamente válidos sob essa mesma ordem.

---


## 9.1 Calendário operacional das assembleias

Michele informou em 29/09/2026:
- assembleias regulares têm referência no dia 18 de cada mês;
- se o dia 18 cair em fim de semana/não útil, a assembleia é deslocada para dia útil;
- para outubro/2026, 18/10 cai em domingo e a assembleia foi informada para **19/10/2026**.

A série documental do Grupo 4012 é coerente com essa convenção:
- maio/2026: 18/05;
- julho/2026: 20/07, quando 18/07 caiu em sábado;
- agosto/2026: 18/08;
- setembro/2026: 18/09.

**Regra de especificação operacional:**
`diaBaseAssembleia = 18`

Se houver futura resolução diária:
`dataAssembleia = próximo_dia_util_em_ou_apos(dia 18)`

Ressalvas:
- a primeira assembleia do grupo (abril/2026) ocorreu fora desse padrão e deve ser tratada como evento de implantação/lançamento;
- o motor mensal atual não precisa deslocar datas em dias;
- essa regra NÃO define o aniversário/reajuste anual de 3%.

---

# 10. Parcela no mês da contemplação

A parcela do próprio mês da contemplação DEVE continuar sendo a parcela reduzida.

A parcela pós-contemplação passa a valer a partir do mês seguinte.

Depois do lance:

`P_pos = saldo_remanescente / (N - m_cont)`

quando ainda houver meses restantes.

Essa é a decisão canônica de modelagem.

## 10.1 Reconciliação da memória de 29/09/2026

A memória enviada por Michele para uma cota de R$ 400 mil mostra:
- prazo inicial: 214 meses;
- 4 parcelas pagas;
- saldo final pós-lance: R$ 270.330;
- rótulo “Nova Parcela (209 meses)”;
- valor da nova parcela: R$ 1.287.

A matemática interna do próprio documento demonstra:

`270.330 / 209 = 1.293,44`

enquanto:

`270.330 / 210 = 1.287,29`

Portanto:
- o valor monetário exibido é compatível com **210 meses**;
- `214 - 4 = 210`;
- o rótulo “209 meses” é internamente inconsistente.

**Regra canônica:** NÃO alterar o motor para 209 meses com base nesse material. Manter `N - m_cont`.

Se surgir documento formal que demonstre cronologia diferente, reabrir SW-007 com memória que feche simultaneamente prazo, saldo e parcela.

---

# 11. Lance

## 11.0 Evidência comercial recebida em 28/09/2026

Michele distinguiu explicitamente as bases de cálculo por modalidade:

- **Lance Fixo (30%)**: 30% do valor atualizado da carta;
- **Lance Livre**: percentual sobre o saldo devedor;
- **Lance embutido**: até 30% do valor atualizado da carta, aplicado individualmente por cota.

Ela também confirmou que:
- o lance é ofertado e apurado cota por cota;
- as quatro cotas podem receber lance na mesma assembleia;
- podem contemplar de 1 a 4 cotas no mesmo mês;
- o resultado depende também do saldo financeiro disponível no Fundo Comum.

A arquitetura atual implementa Lance Livre e embutido com bases distintas, por cota. A modalidade Lance Fixo permanece especificada, mas ainda não possui seletor explícito na interface.

## 11.2 Lance Fixo

Para Lance Fixo de 30%:

`L_fixo_solicitado = C × 30%`

onde `C` é o valor atualizado da carta da cota.

A confirmação documental da modalidade ainda é desejável.

## 11.3 Regra canônica — Lance Livre

Resposta direta de Michele em 29/09/2026:

- a base do Lance Livre é **sempre o saldo devedor atualizado da cota na data da assembleia**;
- os percentuais publicados nas atas usam essa mesma base;
- o sistema classifica os lances do maior percentual para o menor até esgotar o Fundo Comum.

Fórmula canônica:

`L_livre_solicitado = D_assembleia × pct_livre`

onde:

`D_assembleia = saldo_devedor_atualizado_da_cota_na_data_da_assembleia`

Regra de ranking:

`ranking_livre = ordenar_desc(pct_livre)`

O valor nominal do lance NÃO é a variável de classificação entre cotas; a classificação é pelo percentual ofertado sobre o saldo atualizado de cada cota.

A faixa formal permitida de `pct_livre` ainda precisa ser confirmada.

### 11.3.1 Memória comercial inconsistente

A memória de 29/09 exibia:
- saldo devedor: R$495.330;
- 45% de Lance Livre;
- embutido: R$120 mil;
- recursos próprios: R$105 mil.

Pela regra canônica:

`45% × 495.330 = R$222.898,50`

e:

`L_cash = 222.898,50 - 120.000 = R$102.898,50`

Portanto, R$225 mil de lance / R$105 mil próprios daquela memória NÃO devem ser usados para calibrar a fórmula. O exemplo é tratado como inconsistente.

Reabrir esta regra somente se contrato, regulamento específico ou memória oficial posterior contradisserem a resposta direta.

## 11.4 Lance embutido

O embutido é calculado sobre a carta atualizada:

`L_emb_solicitado = C × pct_emb`

com:

`0 ≤ pct_emb ≤ 30%`

e o limite é individual por cota.

O embutido efetivo também NÃO pode exceder o lance total efetivo.

## 11.5 Parte em dinheiro quando as bases são diferentes

No Lance Livre, as bases são distintas:

`L_livre = pct_livre × D_assembleia`

`L_emb = pct_emb × C`

Logo:

`L_cash = max(0, L_livre_efetivo - L_emb_efetivo)`

NÃO calcular:

`(pct_livre - pct_emb) × C`

porque o percentual Livre usa saldo devedor e o embutido usa carta.

### Exemplo da memória de 29/09/2026

Com:
- `D_assembleia = R$495.330`;
- `pct_livre = 45%`;
- `C = R$400.000`;
- `pct_emb = 30%`;

temos:

`L_livre = R$222.898,50`

`L_emb = R$120.000`

`L_cash = R$102.898,50`

O valor R$105 mil do print comercial não fecha com a regra confirmada e deve ser ignorado como referência matemática.

## 11.6 Limite pelo saldo amortizável

Independentemente da modalidade:

`L_efetivo = min(L_solicitado, D)`

O excesso solicitado NÃO pode desaparecer economicamente.

## 11.7 Efeito no saldo e na carta

Após o lance:

`D ← D - L_efetivo`

`Carta ← C - L_emb_efetivo`

Nenhuma parcela do lance pode reduzir a carta ou sair do bolso sem contrapartida no saldo devedor, salvo custos explicitamente modelados.

## 11.8 Prazo de pagamento do lance vencedor

Em 29/09/2026, Michele corrigiu/precisou a informação: o lance vencedor deve ser pago em **até dois dias úteis**, usando também a expressão “48 horas”.

A ata do Grupo 4012 anteriormente analisada já apontava vencimento no segundo dia útil.

Regra operacional canônica para esta proposta:
- prazo = **2 dias úteis / até o segundo dia útil**;
- não usar “3 dias”;
- não converter automaticamente em 48 horas corridas, porque fins de semana e feriados quebram essa equivalência.

Esse prazo é metadado operacional de liquidez; o motor mensal não precisa criar um mês adicional.

## 11.9 Destino da amortização do lance

Michele confirmou em áudio que o lance pode amortizar:
- o valor da parcela; OU
- o prazo.

A arquitetura deve suportar por cota:

`modoAmortizacaoLance ∈ {reduzirParcela, reduzirPrazo}`

O modo `reduzirParcela` já corresponde à lógica predominante do motor.

O modo `reduzirPrazo` ainda precisa de detalhe contratual para determinar:
- quais parcelas são consideradas antecipadas;
- como o prazo residual é recalculado;
- se a escolha é feita no momento do lance;
- se pode variar entre cotas.

## 11.10 Pendências antes da implementação

Já resolvido:
- base do Lance Livre = saldo devedor atualizado da cota na data da assembleia;
- percentuais das atas usam essa mesma base;
- classificação por percentual decrescente;
- contemplação nessa ordem até esgotar o Fundo Comum.

Ainda precisamos confirmar:
- faixa/mínimo/máximo formal do Lance Livre;
- critério de desempate em percentuais idênticos;
- modalidades adicionais;
- mecânica exata do modo `reduzirPrazo`;
- eventual regra quando o saldo residual do Fundo Comum é insuficiente para a próxima contemplação integral.

---

## 11.11 Histórico empírico do Grupo 4012 — calibração, não regra contratual

A série documental das seis primeiras assembleias está completa:

| Mês | Lance Livre vencedor | Nº vencedores Livre | Cotas aptas |
|---|---:|---:|---:|
| abr/2026 | 60,1400% | 1 | 473 |
| mai/2026 | 60,9867% | 1 | 509 |
| jun/2026 | nenhum | 0 | 792 |
| jul/2026 | 73,0000%; 72,7300% | 2 | 1.013 |
| ago/2026 | 70,6877%; 70,5508%; 69,5200%; 68,9081% | 4 | 1.258 |
| set/2026 | 73,0000%; 72,0000%; 72,0000%; 72,0000% | 4 | 1.502 |

Pisos mensais do Lance Livre quando houve vencedor:
`[60.1400, 60.9867, null, 72.7300, 68.9081, 72.0000]`

Na Ata 003 / junho:
- saldo para assembleia = R$ 501.927,02;
- houve Lance Fixo vencedor a 30,0000%;
- não houve vencedor por Lance Livre registrado.

**Regra de interpretação:**  
Lance Fixo e Lance Livre são modalidades distintas. O 30% de junho NÃO deve preencher o `null` da série de Lance Livre.

Reconstrução das afirmações comerciais:
- antes de recebermos as atas, a vendedora afirmou por escrito que, até a 6ª assembleia, o Lance Livre teria “variado a média entre 45% e 66%”;
- as atas oficiais não sustentam essa faixa como descrição dos vencedores observados;
- depois de confrontada com os documentos, a explicação mudou para “média/exemplo didático”, tendência de queda e referência aproximada de 65%, sem memória oficial.

A especificação não deve usar nenhuma dessas referências verbais como premissa. Para calibração, prevalece a série documental de vencedores.

**Limitação estrutural de dados:**  
O total de ofertas é sigiloso/inacessível ao cliente. Portanto, a série não possui denominador.

A série pode ser usada apenas para:
- calibração descritiva;
- comparar o lance simulado com vencedores históricos;
- identificar cenários muito abaixo/acima dos cortes observados.

A série NÃO deve ser usada para:
- probabilidade de contemplação;
- taxa de sucesso;
- distribuição de lances perdedores;
- previsão automática;
- inferência do número total de ofertantes.

**Implicação atual:**  
45% está abaixo de todos os Lances Livres vencedores documentados. Junho não altera essa conclusão.

**Regra de UX futura:**  
- mostrar “sem vencedor por Lance Livre” em junho, não 0%;
- separar Fixo e Livre;
- rotular “histórico de vencedores — não é probabilidade nem garantia”.

---

# 12. Empréstimo para financiar o lance

O empréstimo pode financiar uma fração da parte em dinheiro do lance.

## 12.1 Principal

`Principal = L_cash × pct_financiado`

O principal recebido NÃO é aporte próprio.

A parcela não financiada:

`L_cash_proprio = L_cash - Principal`

é obrigação do usuário no mês da contemplação.

## 12.2 Início dos pagamentos

A primeira prestação ocorre no mês seguinte à contemplação.

Não há prestação no próprio mês da contemplação.

---

# 13. TR do empréstimo

A TR é uma sensibilidade opcional.

Default:

`TR anual = 0%`

A existência do campo NÃO significa que o empréstimo real utiliza TR.

## 13.1 Conversão

`TR_m = (1 + TR_a)^(1/12) - 1`

## 13.2 Ordem mensal

Quando TR > 0:

1. corrige-se o saldo do empréstimo;
2. depois calculam-se juros;
3. depois amortização/prestação.

Correção do mês:

`Correcao_TR_m = Saldo_anterior × TR_m`

`Saldo_corrigido = Saldo_anterior + Correcao_TR_m`

A correção acumulada deve ser apresentada separadamente dos juros.

---

# 14. Sistema SAC com TR

Sem TR:

`Amortizacao_base = Principal / prazo`

Com TR, a amortização-alvo acompanha o fator acumulado do indexador.

Juros:

`Juros_m = Saldo_corrigido × taxa_juros_mensal`

Prestação:

`Prestacao_m = Amortizacao_m + Juros_m`

O saldo não pode tornar-se negativo; a amortização final é limitada ao saldo restante.

---

# 15. Sistema Price com TR

Sem TR, a prestação-base usa a fórmula Price usual:

`PMT = Principal × i / [1 - (1+i)^(-n)]`

Se `i = 0`:

`PMT = Principal / n`

Com TR, a prestação-base é atualizada pelo fator acumulado da TR.

A segunda auditoria validou a matemática usada na V2.53 para os cenários testados.

Essa modelagem continua sendo uma sensibilidade financeira até que exista contrato real para comparar a fórmula do banco.

---

# 16. Saldo de empréstimo no horizonte

Se o empréstimo ultrapassa o horizonte:

- o saldo remanescente NÃO é quitado ficticiamente;
- ele permanece como dívida;
- é descontado do patrimônio final da estratégia;
- a interface deve alertar o usuário.

---


# 17. Seguro / proteção financeira

## 17.1 Status real do produto

Michele confirmou em 28/09/2026 que o Seguro Prestamista do Consórcio QuintoAndar/Bamaq é **opcional**.

A Central de Ajuda oficial da Bamaq também descreve o Seguro Prestamista como pagamento opcional, adquirido na contratação, e afirma que ele compõe a parcela apenas “se houver”.

Portanto:

`seguro_default = desativado`

Esse default deixa de ser apenas prudencial e passa a estar alinhado à condição comercial informada.

## 17.2 Sensibilidades implementadas

O simulador oferece três sensibilidades genéricas:
- valor fixo mensal;
- percentual da parcela bruta;
- percentual do saldo devedor.

Essas sensibilidades continuam matematicamente válidas para stress testing, mas NÃO devem ser apresentadas como fórmula contratual do Seguro Prestamista.

## 17.3 Informação comercial sobre a cobrança

Michele informou que:
- o prêmio não é valor fixo em reais;
- é calculado percentualmente;
- é “dividido nas parcelas vincendas”.

Essa frase não define suficientemente a fórmula.

Duas interpretações possíveis, ainda não escolhidas:

### Modelo A — prêmio total parcelado

`PremioTotal = BaseSeguro × taxa`

`Seguro_m = PremioTotal / parcelas_vincendas`

### Modelo B — prêmio periódico

`Seguro_m = Base_m × taxa_m`

A memória de cálculo/certificado deve decidir qual é a regra real.

## 17.4 Cobertura e elegibilidade — informação comercial ainda não documentada

Michele informou:
- cobertura máxima de até R$ 800 mil por cota;
- participantes com mais de 70 anos não poderiam contratar;
- em caso de contemplação desse perfil, seria obrigatório apresentar avalista;
- seria possível solicitar inclusão do seguro ao longo do contrato.

Em áudio posterior, Michele reforçou:
- a proposta atual não inclui seguro;
- contratação desde o início é opcional;
- inclusão posterior também é possível;
- quando incluído posteriormente, o prêmio é recalculado naquele momento conforme a situação então vigente.

A possibilidade de inclusão posterior passa a ser **confirmada comercialmente**, mas ainda não conhecemos:
- carência;
- janela exata;
- nova análise/elegibilidade;
- taxa/base usada na data de inclusão.

Até receber certificado/condições:
- NÃO hard-code a idade de 70 anos;
- NÃO hard-code R$ 800 mil;
- NÃO inferir automaticamente necessidade de avalista a partir da idade.

## 17.5 Coberturas

A página oficial da Bamaq informa que o Seguro Prestamista pode ser acionado em caso de morte ou invalidez total/permanente decorrente de acidente de trabalho.

As condições exatas, exclusões, carência, capital segurado e mecanismo de indenização devem vir do documento da seguradora.

## 17.6 Efeito econômico quando o seguro estiver ativo

Independentemente da fórmula contratual futura, o prêmio:
- é obrigação do mês;
- aumenta o dinheiro necessário do bolso;
- entra nos aportes equivalentes do benchmark;
- NÃO amortiza diretamente o saldo consorcial.

Se a indenização quitar a dívida em evento coberto, isso é um evento de seguro distinto e não deve ser confundido com amortização normal das parcelas.

## 17.7 Requisito para próxima implementação

Não substituir os modos genéricos de sensibilidade por um “modo Bamaq” antes de obter:
- seguradora/apólice/certificado;
- taxa;
- base;
- fórmula na contratação inicial e na inclusão posterior;
- regras de carência/elegibilidade;
- prazo/cobertura;
- exemplo numérico de prêmio.

A arquitetura multi-cota deve permitir seguro individual por cota.

# 17A. Natureza dos recursos e aplicações permitidas

## 17A.1 Segregação patrimonial

A Lei nº 11.795/2008 estabelece que:
- o grupo de consórcio possui patrimônio próprio;
- esse patrimônio não se confunde com o de outros grupos nem com o da administradora;
- os recursos de cada grupo são contabilizados separadamente.

A expressão comercial “patrimônio de afetação” pode ser usada de forma descritiva, mas a especificação deve preferir a linguagem normativa: **patrimônio próprio e segregado do grupo**.

## 17A.2 Aplicações permitidas

Para grupos sujeitos à Resolução BCB nº 285/2023, os recursos do grupo só podem ser aplicados em:
- títulos públicos federais registrados no Selic, inclusive operações compromissadas; ou
- fundos abertos de renda fixa classificados de forma compatível com Curto Prazo, Referenciado ou Simples.

A regulamentação veda aplicações em fundos exclusivos e em fundos destinados exclusivamente a investidores qualificados.

Portanto, referências comerciais a “fundo dedicado” NÃO devem ser interpretadas automaticamente como “fundo exclusivo” no sentido regulatório.

## 17A.3 Controle dos recursos

A administradora deve manter controle diário e identificação analítica dos recursos por grupo e por consorciado.

A especificação não deve presumir que exista uma conta bancária individual juridicamente titulada pelo consorciado; a segregação pode ser operacional/contábil dentro dos recursos vinculados ao grupo.

---


# 18. Carta contemplada

No mês da contemplação:

`Carta = C - L_emb`

O saldo inicial da carta contemplada após o lance é guardado também como principal de referência para métricas de resgate.

Após a homologação, o crédito deve ser colocado à disposição do consorciado no prazo regulamentar e os recursos vinculados à contemplação permanecem aplicados até sua utilização.

O motor trabalha em resolução mensal e, por convenção, só começa a reconhecer rendimento no mês seguinte à contemplação. Essa é uma **simplificação conhecida**: a regra regulatória real prevê rendimento a partir da data em que o crédito é colocado à disposição, e não necessariamente apenas no mês-calendário seguinte.

---

# 19. Rendimento da carta contemplada

## 19.1 Regra econômica/regulatória

Enquanto:
- contemplada;
- ainda não utilizada;
- ainda não resgatada/recebida em espécie;
- ainda não cedida;

o crédito deve ser acrescido dos **rendimentos líquidos financeiros** das aplicações vinculadas à contemplação.

A remuneração NÃO deve ser conceitualmente modelada como “um percentual fixo do CDB benchmark”.

## 19.2 Parâmetros implementados

O motor separa:

`i_CDI` = referência bruta de mercado;

`p_carta` = rendimento líquido final da carta expresso como fração do CDI;

`i_carta = função(i_CDI, p_carta)`;

`i_CDB_benchmark` = retorno líquido independente do benchmark.

O benchmark não controla automaticamente `i_carta`.

Estado atual:
- taxa fixa de cenário para CDI e `p_carta`;
- presets/sensibilidades conservador/base/otimista.

Gap atual:
- trajetória temporal/série de CDI e do percentual da carta ainda não está implementada.

## 19.3 Premissa-base líquida reconciliada

A resposta de 29/09/2026 separou duas camadas que antes pareciam contraditórias:

**Aplicação/fundo — bruto:**
- rentabilidade típica informada de 98% a 105% do CDI;
- acompanha o desempenho efetivo das aplicações;
- não é taxa garantida.

**Carta contemplada — líquido para projeção:**
- orientação comercial/interna: aproximadamente 80% do CDI;
- esse número representa o rendimento líquido efetivamente creditado à carta para fins de caixa/projeção.

Regra-base do simulador:

`p_carta_base = 0.80`

`i_carta_liquido = função(i_CDI, 0.80)`

Importante:
- NÃO aplicar novo IR/haircut sobre `i_carta_liquido` no cenário-base;
- 80% deve continuar editável;
- não apresentar 80% como promessa contratual;
- 98%–105% NÃO deve ser usado como faixa líquida da carta.

## 19.3A Aplicação informada

Michele informou como veículo:
- **Itaú Premium Renda Fixa Referenciado DI**;
- CNPJ **03.184.233/0001-80**.

A identidade do fundo foi verificada externamente.

A lâmina oficial do Itaú de julho/2026 mostra:
- retorno acumulado 2026 até julho: 97,88% do benchmark;
- 12 meses: 97,53%;
- 24 meses: 98,01%;
- 36 meses: 100,49%.

Esses percentuais são de desempenho divulgado do fundo e **não são líquidos de impostos**, conforme a própria lâmina.

Uso na especificação:
- serve como validação de plausibilidade da camada bruta próxima ao CDI;
- NÃO substitui o parâmetro líquido de 80% informado pela Bamaq;
- não prova, por si só, que o Grupo 4012 está atualmente alocado integralmente nesse fundo.

## 19.4 Destino contábil

Todos os rendimentos aferidos devem ser acumulados em uma métrica independente do uso posterior.

---

# 20. Modo “capitalizar rendimento”

Quando selecionado:

`Carta ← Carta + Rendimento_m`

A obrigação da parcela não é reduzida pelo rendimento.

---


# 21. Modo “usar rendimento para pagar parcela”

## 21.1 Regra confirmada comercialmente

Michele confirmou em 28/09/2026 que o rendimento mensal de uma cota contemplada pode ser solicitado para abater a parcela da própria cota.

A regra econômica é:

`Rendimento_usado = min(Rendimento_m, parcela_bruta_da_cota)`

A obrigação de caixa da própria cota é reduzida por esse valor.

Excedente:

`Rendimento_excedente = max(0, Rendimento_m - Rendimento_usado)`

e:

`Carta ← Carta + Rendimento_excedente`

Exemplo confirmado:
- rendimento = R$ 10 mil;
- parcela = R$ 5 mil;
- R$ 5 mil quitam a parcela;
- R$ 5 mil permanecem no crédito.

## 21.2 Restrição por cota

O rendimento de uma cota:
- PODE pagar até 100% da parcela da própria cota;
- NÃO PODE pagar parcela de outra cota.

Logo, em arquitetura multi-cota:

`Rendimento_usado_j = min(Rendimento_j, Parcela_j)`

e é proibido somar rendimentos de todas as cotas antes de distribuí-los pelas parcelas.

Essa restrição é um invariante da arquitetura atual e é protegida por teste de integração.

## 21.3 Solicitação mensal

O uso do rendimento não é automático na operação real.

Michele informou que:
- o consorciado precisa solicitar o abatimento mensalmente pelo aplicativo.

Portanto, o comportamento atual do simulador — aplicar o abatimento automaticamente em todo mês quando o modo está selecionado — representa o cenário:

**“assumir que o consorciado faz corretamente a solicitação em todos os meses elegíveis”.**

A interface deve manter essa hipótese explícita enquanto não houver modelagem de falhas/omissões na solicitação mensal.

## 21.4 Excedente

O rendimento usado para pagar parcela:
- NÃO é aporte próprio;
- NÃO deve ser simultaneamente capitalizado;
- continua fazendo parte do histórico de rendimentos aferidos.

O excedente:
- permanece no crédito da mesma cota;
- continua elegível a rendimentos posteriores;
- não pode ser transferido para abater parcela de outra cota.

## 21.5 Detalhes operacionais ainda não especificados

Ainda não sabemos:
- se rendimento inferior à parcela é aplicado parcialmente exatamente da mesma forma;
- prazo/cutoff mensal da solicitação;
- se a solicitação vale para parcela corrente ou seguinte;
- se existe instrução permanente;
- o que acontece operacionalmente quando o cliente esquece de solicitar em determinado mês.

Esses pontos não alteram a regra econômica principal, mas podem justificar uma sensibilidade de aderência operacional.

---


# 22. Resgate / recebimento do crédito em dinheiro

Compra do imóvel e recebimento em dinheiro são caminhos alternativos para o crédito não utilizado.

## 22.1 Regra dos 180 dias

Pela Resolução BCB nº 285/2023, art. 15, §2º:

Depois de 180 dias da contemplação, o consorciado pode receber o crédito em espécie/transferência quando:
- o crédito ainda não tiver sido utilizado;
- as obrigações financeiras perante o grupo e a administradora estiverem QUITADAS.

A antiga referência à Circular BCB nº 3.432/2009 está desatualizada como norma vigente.

## 22.2 Não existe netting automático no resgate voluntário como regra-base

Para o resgate pós-180 dias, a especificação NÃO deve assumir:

`valor_liquido = carta - saldo_devedor`

Michele confirmou comercialmente que a Bamaq exige quitação integral do saldo antes da liberação do dinheiro.

Portanto, na regra-alvo:

`elegivel_resgate = (meses_desde_contemplacao >= 6) AND (obrigacoes_grupo == 0)`

Se houver saldo devedor:
- o usuário precisa modelar sua fonte de quitação;
- só depois o crédito fica elegível ao recebimento em dinheiro.

## 22.3 Rendimentos acumulados

O crédito recebido inclui os rendimentos líquidos acumulados da aplicação até a data aplicável.

Não aplicar automaticamente um novo IR sobre esses rendimentos.

## 22.4 Custos/multas

Michele informou que não há multa específica pelo recebimento em dinheiro após cumprimento das regras.

Até surgir evidência contrária:
- custo adicional default = 0;
- eventual custo continua apenas como sensibilidade avançada.

## 22.5 Encerramento do grupo é evento diferente

No encerramento, há evidência comercial de possível liquidação interna do saldo usando recursos da própria cota, mas isso NÃO está suficientemente descrito no Regulamento Geral consultado.

Portanto:
- não reutilizar automaticamente a lógica do resgate pós-180 dias;
- tratar encerramento como evento próprio;
- aguardar confirmação sobre netting interno.

## 22.6 Timing

O valor líquido recebido entra no caixa somente quando efetivamente transferido ao consorciado.

---

# 23. Compra do imóvel

A compra ocorre no **fim do mês configurado**.

Ela só pode ocorrer após a contemplação.

## 23.1 Crédito disponível

`Credito_compra = Carta`

Zero é um valor válido.

NÃO deve haver fallback por truthiness para outra base.

## 23.2 Preço travado

No modo travado:

`Preco_imovel = Credito_compra`

## 23.3 Preço manual

No modo manual, usa-se o valor digitado.

A semântica “R$ de hoje” versus “valor nominal futuro” continua pendente e NÃO deve ser inferida silenciosamente.

## 23.4 Crédito utilizado

`Credito_usado = min(Preco_imovel, Credito_compra)`


## 23.5 Crédito residual

A convenção anterior de preservar a sobra como ativo vinculado, sem rendimento e sem destinação, está SUPERADA como regra econômica definitiva.

Quando:

`Credito_compra > Preco_imovel`

a diferença:

`Residual = Credito_compra - Preco_imovel`

não deve permanecer indefinidamente como “ativo residual” depois da conclusão da compra.

A Resolução BCB nº 285/2023 determina que a diferença seja destinada, a critério do consorciado, a uma das alternativas permitidas.

### Opção A — despesas vinculadas ao bem

Pode ser usada para obrigações vinculadas ao bem/serviço, respeitado o limite regulamentar de até 10% do crédito objeto da contemplação.

Uma mensagem comercial posterior citou “até R$ 123,3 mil” para a operação de R$ 1,37 milhão. Esse número NÃO corresponde a 10% do total nominal (R$ 137 mil) e, portanto, não deve ser usado como regra até a Bamaq explicar sua base.

Para imóvel, exemplos comercialmente mencionados:
- ITBI;
- escritura;
- registro/cartório.

A lista exata aceita pela Bamaq deve seguir contrato/regulamento e pode incluir outras despesas regulatoriamente admitidas.

### Opção B — antecipação das prestações vincendas

No Regulamento Geral Bamaq, a diferença pode quitar prestações vincendas em **ordem indireta**.

A regra-alvo é:

`Residual_para_divida = min(Residual_disponivel, valor_elegivel_para_antecipacao)`

e a obrigação correspondente deve ser efetivamente extinta/reduzida.

Não assumir redução linear do valor de todas as parcelas futuras até confirmação específica do Grupo 4012.

### Opção C — devolução em dinheiro

Só é elegível quando:

- obrigações financeiras perante o grupo e a administradora estiverem integralmente quitadas.

Nesse caso, a diferença pode ser transferida para conta do consorciado.

### Antes da conclusão da compra

Enquanto parte do crédito ainda não foi efetivamente utilizada, ela permanece vinculada à contemplação e continua sujeita à regra de rendimento líquido até a utilização.

### Regra multi-cota

Em compra com várias cotas, o motor futuro deve manter rastreabilidade da origem do residual por cota, até confirmar se limites e destinações podem ser agregados entre créditos.

---

## 23.6 Complemento de preço

`Complemento = max(0, Preco_imovel - Credito_compra)`

É obrigação do bolso.

---


# 23A. Compra de imóvel com múltiplas cotas

## 23A.1 Combinação de créditos contemplados

Regra comercial confirmada e prevista no Regulamento Geral da Bamaq:

- duas ou mais cotas contempladas podem ter seus créditos reunidos para adquirir um único imóvel de maior valor;
- os créditos podem vir do mesmo grupo ou de grupos Bamaq diferentes;
- a operação deve respeitar titularidade/cotitularidade e as exigências de garantia/documentação da administradora.

Na arquitetura multi-cota:

`Credito_total_selecionado = Σ Credito_j`

para todas as cotas `j` contempladas e escolhidas para a operação.

## 23A.2 Compra antes de todas as cotas contemplarem

É permitido comprar o imóvel usando apenas o subconjunto de cotas já contempladas e complementar:

`Complemento_proprio = max(0, Preco_imovel - Credito_total_selecionado)`

As cotas ainda não contempladas:
- continuam concorrendo normalmente;
- não devem ser marcadas como “usadas” apenas porque pertencem ao mesmo titular;
- mantêm seus próprios estados, saldos e futuras opções de utilização.

## 23A.3 Vínculo da garantia

O imóvel adquirido deve registrar as garantias exigidas pela administradora.

A arquitetura futura deve registrar explicitamente:
- quais cotas foram usadas naquele imóvel;
- quais dívidas/garantias estão ligadas ao imóvel;
- quais cotas permanecem livres para outra destinação.

## 23A.4 Cotas contempladas posteriormente

Não codificar ainda uma regra definitiva de “não podem ser usadas no mesmo imóvel”.

Michele informou que cotas posteriores não podem simplesmente ser usadas para pagar o próprio proprietário nem realizar alienação duplicada.

Entretanto, o Regulamento Geral da Bamaq admite **quitação total de financiamento ou consórcio de titularidade do consorciado**, da mesma categoria, com anuência prévia e desde que o saldo da dívida seja menor ou igual ao crédito.

Portanto, até esclarecimento formal:
- **amortização parcial** do consórcio já utilizado com carta posterior: NÃO confirmada;
- **quitação total** de consórcio já utilizado com carta posterior: possibilidade documentalmente prevista, aplicação ao mesmo imóvel precisa ser confirmada;
- **reunião de várias cartas posteriores para atingir a quitação total**: pendente.

A próxima arquitetura deve tratar “destino da cota contemplada posteriormente” como escolha configurável, não como proibição hard-coded.

---

# 24. Custos de aquisição

`Custos_compra = ITBI + RGI + outros`

No modelo:

`ITBI = Preco_imovel × pct_ITBI`

RGI pode ser:

- manual; ou
- travado como percentual do imóvel.

Outros custos são valor nominal configurado.

Os custos brutos entram como obrigação no mês da compra.

---


# 25. Cashback

## 25.1 Elegibilidade básica

O benefício depende de:
- cota regularmente contemplada;
- utilização do crédito para aquisição de imóvel intermediado pelo QuintoAndar;
- cumprimento das condições da campanha e adimplência.

## 25.2 Regra geral de cálculo

Regulamento da Campanha, item 4.1.3:

`Cashback = 10% × credito_liberado_para_aquisicao`

Essa é a regra geral.

## 25.3 Exceção vigente desde 16/06/2026

Para clientes abrangidos pela alteração de 16/06/2026, se:

`valor_imovel >= valor_credito_contratado`

então a base passa a ser:

`Cashback = 10% × valor_total_credito_contratado_e_disposto_na_cota`

e NÃO necessariamente o valor efetivamente liberado.

Essa exceção é material em cenários com:
- lance embutido;
- crédito líquido inferior ao contratado;
- complemento com recursos próprios.

A aplicação exata em operações com múltiplas cotas ainda precisa ser confirmada.


## 25.3A Evidência concreta das cotações e resposta com embutido

As cotações individualizadas exibem cashback nominal de 10%:
- R$400 mil → R$40 mil;
- R$400 mil → R$40 mil;
- R$370 mil → R$37 mil;
- R$200 mil → R$20 mil;
- total nominal destacado = R$137 mil.

Para o cenário com 30% de lance embutido em todas as quatro cotas:

`Credito_nominal = R$ 1.370.000`

`Lance_embutido_total = R$ 411.000`

`Credito_liquido_faturado = R$ 959.000`

Resposta final de Michele:

`Cashback = 10% × Credito_liquido_faturado`

portanto:

`Cashback = R$ 95.900`

Os R$137 mil só seriam atingidos se os R$1,37 milhão nominais fossem efetivamente faturados/utilizados na compra, sem a redução decorrente do lance embutido.

## 25.4 Múltiplas cotas

### 25.4.1 Regra multi-cota confirmada comercialmente

Quando várias cartas são usadas para adquirir um único imóvel, Bamaq/QuintoAndar tratam a operação de forma unificada para:
- faturamento;
- garantia;
- alienação fiduciária;
- comparação imóvel × crédito contratado.

A comparação relevante é agregada:

`credito_contratado_operacao = soma_creditos_nominais_das_cotas_usadas`

No cenário atual:

`imovel = R$ 1.000.000`

`credito_contratado_operacao = R$ 1.370.000`

Como:

`1.000.000 < 1.370.000`

a operação não utiliza todo o crédito nominal agregado.

Após lance embutido:

`credito_liquido_faturado = R$ 959.000`

Base do cashback:

`base_cashback = credito_liquido_faturado`

Logo:

`cashback = 10% × 959.000 = R$ 95.900`

### 25.4.2 Regra canônica para o cenário atual

Para múltiplas cotas usadas em um único imóvel:

1. somar o crédito nominal contratado da operação;
2. aplicar reduções por lance embutido;
3. determinar o crédito líquido efetivamente faturado/liberado ao vendedor;
4. calcular cashback sobre esse crédito líquido.

Não calcular a exceção cota por cota.

### 25.4.4 Base elegível do cashback e rendimentos acumulados

A V3.10 separa:
- crédito principal líquido pós-embutido;
- rendimentos financeiros acumulados;
- crédito total disponível na compra;
- base elegível de cashback.

Política-base conservadora:

`base_cashback = min(preco_imovel, credito_disponivel, principal_liquido_pos_embutido)`

Essa política **exclui rendimentos acumulados** da base promocional.

Sensibilidade alternativa, não confirmada documentalmente:

`base_cashback = min(preco_imovel, credito_disponivel)`

Essa alternativa inclui rendimentos acumulados e deve permanecer claramente rotulada como hipótese.

No cenário canônico:
- principal líquido pós-embutido = R$959.000;
- mesmo que o crédito disponível tenha crescido acima disso por rendimentos;
- cashback conservador = 10% × R$959.000 = R$95.900.

A política escolhida deve ser persistida junto ao cenário.

### 25.4.3 Guardrail documental

A regra acima está comercialmente confirmada para esta proposta. Se o contrato/regulamento final estabelecer tratamento diferente, reabrir a regra antes da implementação definitiva.

## 25.5 Pagamento

**Regra documental disponível — Regulamento da Campanha, item 4.1.2:**
- pagamento em conta bancária de titularidade do consorciado;
- até 5 dias úteis;
- contados do registro da alienação na matrícula e do pagamento do crédito ao vendedor.

**Resposta comercial reiterada em 29/09/2026:**
- pagamento por PIX/conta;
- até 7 dias úteis após a compra no cartório.

A divergência 5 × 7 dias permanece.

**Regra canônica de especificação enquanto não houver aditivo posterior:**
`prazo_cashback_dias_uteis = 5`

Não substituir por 7 apenas com resposta comercial. Se for apresentado regulamento/aditivo posterior, atualizar a especificação e a cronologia.

## 25.6 Convenção temporal do modelo mensal

Desde a V3.12, o cashback possui defasagem mensal explícita.

Default:

`cashbackDelayMonths = 1`

`mes_cashback = mes_compra + cashbackDelayMonths`

Justificativa:
- a compra é modelada no fim do mês;
- o cashback depende de evento posterior de registro/pagamento;
- portanto, o cenário-base não disponibiliza o benefício no mesmo fechamento mensal da compra.

Sensibilidade:
- `cashbackDelayMonths = 0` permite testar recebimento no mesmo mês;
- esse não é o default.

O cashback começa a render no caixa da estratégia somente depois de efetivamente recebido.

O prazo documental exato em dias úteis (5 no regulamento disponível versus 7 na fala comercial) continua pendente, mas essa divergência não exige precisão diária no motor mensal.

## 25.7 Livre movimentação

Confirmado pelo item 4.1.4:
- o valor é depositado em conta bancária do consorciado;
- pode ser utilizado livremente;
- pode inclusive quitar parcelas futuras do consórcio.

Logo:
- não é crédito residual;
- não fica preso ao imóvel;
- não é aporte próprio;
- após recebido, compõe caixa livre da estratégia.

## 25.8 Tratamento fiscal

A afirmação comercial de que o cashback é “isento de IR” ainda NÃO foi confirmada por fonte fiscal oficial específica.

Até confirmação:
- não aplicar IR automático no recebimento;
- não descrever juridicamente como “isento”;
- manter pendente o efeito sobre custo fiscal de aquisição e ganho de capital futuro.

## 25.9 Vigência da campanha

O regulamento disponível estabelece adesões elegíveis até 30/09/2026 e Michele reiterou o mesmo deadline comercial.

Em 29/09/2026, ela esclareceu o marco operacional exigido para efetivar a entrada dentro da condição atual.

Para esta proposta:

`validadeProposta = 30/09/2026`

Não assumir prorrogação automática.

Para fins de estado operacional, a adesão comercial é considerada efetivada quando, dentro do prazo:
- o contrato tiver sido emitido/homologado;
- o cliente tiver realizado o aceite eletrônico;
- a primeira parcela tiver sido paga.

A alocação de grupo/número de cota ocorre como consequência do ingresso no plano, segundo a explicação comercial.

A especificação deve continuar separando:
- validade da cotação;
- vigência da campanha;
- efetivação operacional da adesão;
- data do reajuste anual.

## 25.10 Validade comercial / evento de trava

A cotação atual é válida até 30/09/2026.

Fluxo confirmado comercialmente:

`documentacao`
→ `contrato_emitido_homologado`
→ `contrato_enviado_email`
→ `aceite_eletronico`
→ `primeira_parcela_paga`
→ `cota_alocada / acesso_app`

Para esta proposta, usar:

`condicaoComercialTravada = contratoEmitido && aceiteEletronico && primeiraParcelaPaga`

e:

`dataLimiteEfetivacao = 30/09/2026`

A emissão isolada NÃO deve mudar `condicaoComercialTravada` para verdadeiro.

Metadados relevantes:
- `dataCotacao`;
- `validadeCotacao`;
- `dataEnvioDocumentos`;
- `dataEmissaoContrato`;
- `dataAceiteEletronico`;
- `dataPrimeiroPagamento`;
- `dataAlocacaoCota`;
- `numeroGrupo`;
- `numeroCota`;
- `dataAcessoApp`;
- `condicaoComercialTravada`.

Cronologia informada para a proposta atual:
- primeira parcela: pagamento necessário até 30/09/2026 para efetivação;
- segunda parcela: vencimento informado em **15/11/2026**.

Esses eventos são operacionais e NÃO devem ser confundidos com:
- assembleia mensal;
- fechamento da tabela para novas adesões;
- reajuste anual de 3%.

**Guardrail documental:**  
Se o contrato final trouxer regra diferente, o documento deve substituir a premissa comercial antes da implementação definitiva.

# 26. Início da locação

O imóvel NÃO gera aluguel no mês da compra.

O primeiro mês de operação é:

`m = mes_compra + 1`

Compra e venda no mesmo mês geram:

`aluguel = 0`

---

# 27. Reajuste do imóvel, aluguel e custos

A cada aniversário anual após a compra:

- valor do imóvel pode ser reajustado;
- aluguel pode ser reajustado;
- custos fixos travados como percentual do aluguel acompanham o novo aluguel.

Os campos de:

- inflação usada para valores de hoje;
- reajuste do aluguel;
- valorização do imóvel;

podem seguir a inflação projetada ou ser configurados separadamente.

---

# 28. Fluxo operacional do imóvel

Receita efetivamente recebida:

`Receita = Aluguel × (1 - vacancia)`

Custos variáveis simplificados:

`Custos_variaveis = Receita × (administracao + manutencao)`

Resultado antes do imposto:

`Operacional = Receita - Custos_variaveis - Custos_fixos`

O resultado operacional PODE ser negativo.

Imposto simplificado:

`Imposto_aluguel = max(0, Operacional) × aliquota`

Aluguel líquido:

`Aluguel_liquido = Operacional - Imposto_aluguel`

Se negativo:

- é obrigação econômica da estratégia;
- não pode ser truncado silenciosamente em zero.

A tributação do aluguel é uma sensibilidade simplificada, não um cálculo fiscal completo.

---

# 29. Venda do imóvel

A venda pode usar uma de duas bases explícitas.

## 29.1 Base “valor de mercado”

`Base_venda = valor_corrente_do_imovel`

Esse é o default.

## 29.2 Base “preço de compra”

`Base_venda = preco_original`

Essa alternativa é mantida para cenários específicos.

## 29.3 Preço de venda

`Preco_venda = Base_venda × percentual_de_venda`

## 29.4 Corretagem e custos

`Corretagem = Preco_venda × pct_corretagem`

Outros custos podem ser informados em valor nominal.

## 29.5 Ganho de capital simplificado

Base de custo simplificada:

`Base_fiscal = preco_compra + custos_brutos_de_aquisicao`

Ganho:

`Ganho = max(0, Preco_venda - Base_fiscal)`

Imposto estimado:

`IR_venda = Ganho × aliquota_configurada`

Esse cálculo é uma sensibilidade e NÃO substitui GCAP/regras fiscais reais.

---


# 30. Venda do imóvel com dívida em aberto

Quando o imóvel ainda garante saldo do consórcio, a venda não deve ser tratada como simples recebimento do preço. Existem caminhos operacionais distintos.

## 30.1 Caminho A — quitar a dívida na própria venda

O preço de venda pode ser usado para quitar o saldo do consórcio antes da liberação definitiva do gravame.

Michele informou que comprador à vista ou banco financiador pode direcionar o valor devido diretamente à Bamaq, que atua operacionalmente como interveniente quitante.

Regra econômica:

`QuitacaoConsorcio = saldo_devedor_elegivel`

`LiquidoVendedor = PrecoVenda - custosVenda - QuitacaoConsorcio - outrasQuitacoes`

A parcela do preço enviada diretamente à Bamaq:
- NÃO entra primeiro no caixa do usuário;
- extingue a dívida;
- o restante líquido, se positivo, é recebido pelo usuário.

Essa alternativa precisa de procedimento formal da Bamaq para ser considerada operacionalmente confirmada.

## 30.2 Caminho B — substituição de garantia

A Bamaq permite substituir o imóvel alienado por outro bem, mediante autorização prévia.

Fontes oficiais Bamaq confirmam:
- substituição de garantia é permitida;
- o novo imóvel deve estar quitado e registrado em nome do consorciado;
- a Bamaq pode recusar a garantia;
- há avaliação e documentação;
- há custos e despesas de substituição;
- a baixa do gravame do imóvel antigo só ocorre após conclusão das exigências.

O consórcio continua ativo; a dívida NÃO é quitada.

## 30.3 Critério de valor do imóvel substituto

Ainda NÃO existe regra suficientemente confirmada para codificar um único limite.

Michele informou:
- valor de avaliação igual ou superior ao saldo devedor restante; OU
- em algumas análises, valor relacionado ao crédito original.

O Regulamento 2026 usa conceitos mais gerais de garantia compatível e prévia aprovação.

Até confirmação, a futura UI deve ter:

`valorMinimoGarantia` = input/regra externa

e não hard-code:
`novoImovel >= saldoDevedor`
como verdade contratual universal.

## 30.4 Imóvel substituto fora do portfólio da estratégia

Se o bem oferecido em garantia já pertencia ao usuário antes da estratégia:
- seu valor NÃO deve ser somado ao patrimônio da estratégia;
- mas deve ser registrado como garantia externa comprometida;
- o simulador deve avisar que a operação aumenta o patrimônio pessoal exposto ao risco da dívida.

Se o próprio simulador modelar a aquisição desse segundo imóvel, então seu valor pode integrar o patrimônio conforme a origem dos recursos.

## 30.5 Custos da substituição

Podem incluir:
- avaliação/vistoria;
- análise/documentação;
- registro da nova alienação/hipoteca;
- baixa do gravame anterior;
- cartório/emolumentos;
- outros custos comprovados permitidos pelo contrato.

Michele citou custo de vistoria em torno de 1 salário mínimo, mas esse valor ainda não possui confirmação tarifária formal.

No motor, usar:
- valor manual; ou
- tarifário documentado.

## 30.6 Prazo da substituição

Michele informou 15–30 dias úteis como prazo médio do processo completo.

O Regulamento 2026 prevê 5 dias úteis para apreciação da documentação relativa à garantia após entrega completa.

Esses prazos não são equivalentes.

A futura modelagem deve permitir:

`lagSubstituicaoGarantiaMeses`

ou data efetiva, sem assumir que a venda possa ocorrer no mesmo instante da solicitação.

## 30.7 Ordem obrigatória

No caminho de substituição:
1. novo imóvel é apresentado;
2. análise documental/jurídica e avaliação;
3. aprovação;
4. formalização/registro da nova garantia;
5. baixa/liberação do imóvel original;
6. venda do imóvel original.

O simulador NÃO deve liberar o imóvel original antes de existir garantia substituta aprovada/registrada, salvo quitação da dívida.

## 30.8 Relação com empréstimo do lance

A venda do imóvel pode também quitar ou não eventual empréstimo do lance, conforme contrato desse empréstimo.

Isso deve permanecer decisão separada da quitação/substituição do consórcio.

## 30.9 Resultado líquido

No caminho de quitação:

`LiquidoVenda = PrecoVenda - custosVenda - quitacaoConsorcio - quitacaoEmprestimo`

No caminho de substituição:

`LiquidoVenda = PrecoVenda - custosVenda - custosSubstituicao - eventualQuitacaoEmprestimo`

e:
`saldoConsorcio` permanece em aberto.

Se qualquer resultado for negativo:
- a diferença deve virar top-up explícito;
- nenhuma perda pode ser truncada.

---


# 31. Venda/cessão da cota contemplada

A cessão é um evento alternativo ao uso do crédito.

No cenário principal deste simulador, ela só pode ser exercida enquanto a cota:
- já foi contemplada;
- ainda não teve seu crédito utilizado para imóvel;
- ainda não foi resgatada/recebida em espécie;
- permanece transferível e adimplente;
- obtém aprovação formal da Bamaq para o cessionário.

A cessão transfere direitos E obrigações da cota ao novo titular. Portanto, o saldo devedor do consórcio acompanha a cota e NÃO deve ser automaticamente quitado pelo vendedor, salvo se isso fizer parte de uma negociação separada.

## 31.1 Janela válida

Se não existir mês entre contemplação e compra/resgate em que a cota esteja disponível:
- o painel deve indicar **“sem janela válida para venda”**;
- não deve inventar venda com crédito zero;
- não deve calcular oferta mínima fictícia.

## 31.2 Preço de venda da cota

`Oferta`

é o preço econômico negociado entre vendedor e comprador da cota.

A Bamaq:
- aprova a cessão;
- cobra as tarifas contratuais;
- não deve ser tratada pelo motor como definidora da oferta de compra de terceiro.

## 31.3 Taxa de transferência — regra Bamaq 2026

O Regulamento Geral Bamaq 2026 estabelece, por cota:

`TaxaTransferencia_j = min(pct_taxa × SaldoDevedorCota_j, teto_por_cota)`

Defaults documentais:

`pct_taxa = 1%`

`teto_por_cota = R$ 1.000`

Em cessão conjunta de várias cotas:

`TaxaTransferenciaTotal = Σ TaxaTransferencia_j`

A base NÃO é:
- oferta de compra;
- valor da carta;
- crédito atualizado.

Desde a V3.13, essa é a fórmula implementada no motor. A oferta só afeta o valor bruto recebido e custos explicitamente definidos como percentuais da oferta; não altera a tarifa de transferência.

## 31.4 Taxa de cadastro

O Regulamento Bamaq 2026 prevê:

`TaxaCadastro = R$ 150`

Michele informou que esse valor corresponde à análise de crédito/cadastro do cessionário.

Até confirmação operacional:
- tratar R$ 150 como custo configurável/default documental;
- não assumir se é cobrado uma vez por cota ou uma vez por cessionário em transferência múltipla.

## 31.5 Aprovação do cessionário

Para cota contemplada:
- novo titular deve apresentar documentação cadastral;
- a transferência só se aperfeiçoa depois da aprovação pela Bamaq;
- cessão sem anuência formal da administradora não deve ser considerada concluída.

Logo, o motor futuro pode possuir:

`transferenciaAprovada = true/false`

e eventual defasagem entre negociação e recebimento.

## 31.6 Custos adicionais

Se a cota já estiver vinculada a bem/garantia, podem existir custos adicionais de:
- cadastro;
- gravame e baixa;
- registros;
- despachantes;
- outras despesas comprovadas.

Para a cota contemplada ainda SEM uso do crédito, esses custos de garantia não devem ser inventados.

Custo adicional manual continua permitido:

`CustoExtraTransferencia`

## 31.7 Exceção promocional QuintoAndar

Existe uma operação distinta no Regulamento da Campanha:

**“Saque do Saldo Acumulado” / venda da cota não contemplada ao QuintoAndar.**

Quando cumpridos os requisitos promocionais:
- cota ainda não contemplada;
- mínimo de 60 contribuições;
- adimplência;
- compra da cota pelo próprio QuintoAndar;

o item 4.2.4 concede isenção da taxa de transferência.

Essa exceção NÃO deve ser aplicada automaticamente à venda de cota contemplada para terceiro.

São dois eventos diferentes no software:
1. `cessaoCotaContempladaTerceiro`;
2. `vendaPromocionalCotaNaoContempladaQuintoAndar`.

## 31.8 Resultado líquido da cessão contemplada

Sem quitação separada do saldo consorcial:

`Proceeds = Oferta - TaxaTransferencia - TaxaCadastro - CustoExtraTransferencia`

Se houver empréstimo externo do lance e a estratégia decidir quitá-lo:

`Proceeds = Proceeds - SaldoEmprestimo`

O saldo do CONSÓRCIO não é subtraído do `Proceeds` porque a própria obrigação da cota é transferida ao cessionário.

## 31.9 Resultado negativo

Se:

`Proceeds < 0`

então:

`TopUp = -Proceeds`

e o top-up deve virar obrigação do bolso.

Nenhuma perda pode desaparecer por piso/clamp.

## 31.10 Tributação da cessão

Ainda não há especificação fiscal fechada.

Qualquer alíquota de ganho de capital/custo deve permanecer sensibilidade até definirmos:
- custo fiscal da cota;
- valor de alienação;
- despesas dedutíveis;
- regras/isenções aplicáveis.

## 31.11 Timing

O valor líquido entra no caixa apenas quando:
- a Bamaq aprovar a transferência; e
- as condições de pagamento entre cedente e cessionário forem cumpridas.

Na simplificação mensal:
- entrada no fim do mês da efetiva cessão;
- rendimento financeiro a partir do mês seguinte.

---

# 32. Acerto final do consórcio

No último mês, se ainda houver saldo devedor positivo:

`Acerto_final = saldo_devedor`

Esse valor sai do bolso.

Depois:

`saldo_devedor = 0`

A existência de uma carta contemplada não utilizada no encerramento e o eventual custo/haircut para transformá-la em dinheiro continuam PENDENTES de regra externa.

---

# 33. Capitalização do caixa e do benchmark

A convenção é de **fim de mês**.

Primeiro:

`Benchmark ← Benchmark × (1 + i_CDB)`

`Caixa ← Caixa × (1 + i_CDB)`

Depois entram:

- venda/cessão da carta;
- resgate;
- venda do imóvel;
- cashback;
- excedentes líquidos do mês.

Entradas do mês NÃO rendem no próprio mês.

---

# 34. Definição de obrigação e renda da estratégia

## 34.1 Obrigações

Podem incluir, conforme o cenário:

- parcela do consórcio;
- seguro;
- prestação do empréstimo;
- lance próprio;
- complemento do imóvel;
- custos de aquisição;
- custos operacionais líquidos negativos;
- top-up de resgate;
- top-up de venda do imóvel;
- custos de substituição de garantia, quando a venda ocorrer sem quitação do consórcio;
- taxa de transferência e cadastro na cessão da cota;
- custos adicionais de cessão, quando aplicáveis;
- top-up de cessão da carta;
- acerto final.

## 34.2 Rendas do mês

Podem incluir:

- aluguel líquido positivo.

Entradas extraordinárias como:

- cashback;
- venda do imóvel;
- resgate;
- cessão da carta;

entram diretamente no caixa no fim do mês e não são tratadas como aporte próprio.

---

# 35. Aporte próprio

O aporte do bolso é:

`Aporte_m = max(0, Obrigacoes_m - Renda_operacional_m)`

O excedente operacional é:

`Excedente_m = max(0, Renda_operacional_m - Obrigacoes_m)`

Então:

- `Aporte_m` entra no benchmark;
- `Excedente_m` entra no caixa da estratégia.

---

# 36. O que NÃO é aporte próprio

NÃO entram como aporte:

- principal de empréstimo;
- cashback;
- rendimento da carta usado para pagar parcela;
- renda de aluguel;
- valor recebido em venda;
- valor recebido em resgate;
- valor recebido em cessão.

Esses fluxos podem alterar a estratégia, mas não representam novo capital externo aportado pelo usuário.

---

# 37. Benchmark

O benchmark responde à pergunta:

> “Quanto teria ao final se, em vez de fazer a operação, eu aplicasse no CDB exatamente o dinheiro que efetivamente precisei tirar do bolso, nos mesmos meses?”

Logo:

- recebe os mesmos `Aporte_m`;
- capitaliza pela taxa configurada do CDB;
- não recebe dinheiro emprestado;
- não recebe cashback;
- não recebe aluguel;
- não recebe rendimento da carta.

---

# 38. Aportes em valores de hoje

Cada aporte é deflacionado individualmente pelo mês em que ocorreu.

Com inflação mensal `π`:

`Aporte_real_m = Aporte_m / (1 + π)^m`

Total:

`Aportes_reais = Σ Aporte_real_m`

NÃO se deve simplesmente pegar o total nominal de aportes e dividi-lo pelo fator de inflação do horizonte inteiro.

---

# 39. Patrimônio da estratégia

## 39.1 Antes da contemplação

O patrimônio comparável NÃO deve ser exibido.

Motivo:

- não marcamos a cota a zero;
- não inventamos valor de desistência/restituição.

Internamente, o gráfico deve usar valor ausente/nulo para patrimônio comparável pré-contemplação.

## 39.2 Carta contemplada ainda não usada

Ativo comparável:

`Carta`

Patrimônio:

`Carta - saldo_consorcio - saldo_emprestimo + Caixa`

## 39.3 Imóvel em carteira

Valor bruto do ativo:

`valor_mercado_imovel + credito_residual`

Valor comparável:

`valor_liquido_estimado_de_realizacao + credito_residual`

Patrimônio comparável:

`ativo_comparavel - saldo_consorcio - saldo_emprestimo + Caixa`

## 39.4 Depois da venda do imóvel

O imóvel não pode continuar no patrimônio.

Ativo residual:

`credito_residual`

mais caixa financeiro.

## 39.5 Depois do resgate ou cessão

Carta e saldo devedor quitado não podem permanecer como ativo/dívida.

---

# 40. Valor líquido estimado de realização do imóvel

Para marcação comparável do imóvel mantido:

`Valor_liquido = max(0, valor_mercado - corretagem_estimada - outros_custos - IR_estimado)`

Esse valor serve para comparação econômica com o benchmark.

O valor bruto continua disponível como informação separada.

A marcação líquida não significa que uma venda realmente ocorreu.

---

# 41. Patrimônio em valores de hoje

Ao fim do horizonte:

`Patrimonio_hoje = Patrimonio_final_nominal / (1 + inflacao_anual)^(N/12)`

Benchmark real:

`Benchmark_hoje = Benchmark_final / (1 + inflacao_anual)^(N/12)`

---

# 42. Ganho real sobre aportes

Estratégia:

`Ganho_real = Patrimonio_hoje / Aportes_reais - 1`

Benchmark:

`Ganho_real_benchmark = Benchmark_hoje / Aportes_reais - 1`

Só é definido quando:

`Aportes_reais > 0`

---

# 43. Equivalente anual do múltiplo real

Estratégia:

`EA = (Patrimonio_hoje / Aportes_reais)^(1/(N/12)) - 1`

Benchmark:

`EA_bench = (Benchmark_hoje / Aportes_reais)^(1/(N/12)) - 1`

Esse indicador:

- NÃO é TIR;
- não considera o timing individual dos aportes da mesma forma que a TIR;
- deve permanecer explicitamente rotulado como equivalente anual do múltiplo.

---

# 44. TIR real

Fluxos reais:

- cada aporte próprio no mês `m`: fluxo negativo;
- patrimônio final real no mês `N`: fluxo positivo terminal.

A TIR mensal é calculada por bisseção.

Condições:

- precisa existir pelo menos um fluxo positivo e um negativo;
- se não houver raiz válida na faixa pesquisada, retorna `null`.

Anualização:

`TIR_a = (1 + TIR_m)^12 - 1`

Quando a TIR for indefinida:

- o motor deve retornar `null`;
- a interface atualmente pode mostrar “—”;
- melhoria futura de UX deve explicar “TIR não definida para esta série de fluxos”.

---

# 45. Delta estratégia × benchmark

A principal comparação é:

`Δ = Patrimonio_final_comparavel - Benchmark_final`

Interpretação:

- `Δ > 0`: estratégia termina acima do benchmark sob as premissas selecionadas;
- `Δ < 0`: benchmark termina acima da estratégia;
- `Δ = 0`: equivalência econômica no horizonte.

O Δ não elimina a necessidade de examinar:

- aportes;
- liquidez;
- risco;
- trajetória mensal;
- premissas externas.

---

# 46. Sensibilidade ao rendimento da carta

O painel R1 deve:

- usar o mesmo motor central;
- variar apenas o percentual do CDB recebido pela carta;
- manter as demais premissas;
- reproduzir o cenário principal no percentual corrente;
- mostrar 0%, percentual atual, 100% e break-even aproximado quando existir.

O resultado dessa sensibilidade NÃO confirma a remuneração contratual real.

---

# 47. Break-even de contemplação/lance

O painel de break-even deve usar o mesmo motor da simulação principal.

Ao testar um mês hipotético de contemplação:

- o lance deve respeitar todos os clamps do motor;
- o resgate deve ser recalculado para um mês válido;
- nunca pode haver resgate antes da contemplação;
- nunca pode violar o prazo mínimo de 6 meses;
- se o resgate válido não couber no horizonte, ele fica fora do horizonte.

Nenhum painel auxiliar pode gerar cenário economicamente impossível apenas para produzir uma curva.

---

# 48. Regras para valores negativos

Princípio central:

> um piso zero só é permitido quando a diferença econômica é explicitamente direcionada a outro fluxo.

Exemplos:

- venda do imóvel líquida negativa → top-up do bolso;
- resgate líquido negativo → top-up do bolso;
- cessão líquida negativa → top-up do bolso;
- operação de aluguel negativa → obrigação econômica;
- lance solicitado acima do saldo → lance efetivo limitado antes de gerar desembolso.

É proibido fazer uma perda desaparecer simplesmente por:

`Math.max(0, valor)`

sem contrapartida explícita.

---

# 49. Invariantes financeiros obrigatórios

A suíte de testes deve preservar, no mínimo:

1. cenário neutro sem custos → `Δ = 0`;
2. principal de empréstimo não é aporte;
3. cashback não é aporte;
4. rendimento da carta usado para parcela não é aporte;
5. toda obrigação efetivamente paga pelo usuário deve alimentar o benchmark;
6. ativo vendido não permanece no patrimônio;
7. dívida quitada não permanece no patrimônio;
8. um mesmo valor não pode reduzir custo, aumentar caixa e continuar como ativo;
9. TR = 0 deve reproduzir a versão sem TR;
10. seguro desligado não pode alterar os resultados;
11. custo do seguro deve afetar o Δ pelo custo de oportunidade correspondente;
12. mudar somente TR deve afetar apenas os fluxos do empréstimo;
13. venda/cessão/resgate/cashback de fim de mês não rendem no próprio mês;
14. top-ups não podem desaparecer;
15. inputs manuais não devem ser sobrescritos por valores calculados;
16. `letterBalance = 0` deve continuar sendo valor válido;
17. painéis auxiliares devem usar o mesmo motor econômico;
18. rendimento de uma cota não pode abater parcela de outra cota;
19. modo “rendimento paga parcela” deve ser interpretado como hipótese de solicitação mensal bem-sucedida, salvo modelagem explícita de falhas de aderência;
20. apenas cotas contempladas e explicitamente selecionadas entram na compra do imóvel;
21. cotas não contempladas não podem ser marcadas como usadas só porque outras do mesmo titular foram usadas;
22. o motor deve distinguir amortização parcial de quitação total de uma obrigação já vinculada a imóvel;
23. crédito residual pós-compra não pode permanecer como ativo sem destino;
24. toda destinação do residual deve ser uma das opções elegíveis e mutuamente reconciliada com dívida/despesa/caixa;
25. cashback só entra no caixa depois do gatilho contratual de pagamento;
26. base de cashback deve respeitar a exceção promocional aplicável, não apenas `credito_usado`;
27. cashback recebido não é aporte próprio e não permanece vinculado ao imóvel;
28. resgate voluntário pós-180 dias não pode subtrair saldo devedor da carta sem uma etapa explícita de quitação;
29. eventual rateio do fundo de reserva deve ser fluxo terminal separado e nunca presumido como 100% do valor pago;
30. encerramento do grupo e resgate pós-180 dias devem ser eventos distintos no motor;
31. quitação da dívida de uma cota não remove automaticamente sua elegibilidade ao rateio final do grupo;
32. rateio do Fundo de Reserva é fluxo terminal separado e não simples devolução da contribuição individual;
33. venda de imóvel alienado exige ou quitação explícita da dívida ou substituição de garantia concluída;
34. imóvel externo oferecido como garantia não pode entrar automaticamente como patrimônio da estratégia;
35. custos e lag da substituição devem ser fluxos/tempo explícitos quando o cenário usar essa alternativa;
36. taxa de transferência da Bamaq deve usar saldo devedor como base, não oferta nem valor da carta;
37. cessão da cota transfere o saldo consorcial ao cessionário; não quitar essa dívida duas vezes;
38. isenção QuintoAndar de transferência só pode ser aplicada ao evento promocional elegível de cota não contemplada;
39. seguro prestamista deve permanecer desligado por default e nunca ser tratado como custo obrigatório;
40. parâmetros comerciais de seguro ainda não documentados (idade, cobertura, taxa/base) não podem virar validações rígidas;
41. na futura arquitetura multi-cota, seguro deve ser associado à cota individual, não ao agregado;
42. prazo de uma nova cota em grupo em andamento deve ser o prazo remanescente contratual, não a duração original do grupo;
43. no preset QuintoAndar/Grupo 4012 atual, não deve existir cobrança/dedução por assembleias anteriores; qualquer regra futura contrária só pode ocorrer como evento explícito e documentado, nunca implícito;
44. taxa administrativa e fundo de reserva da nova cota não devem ser prorateados pelo tempo já decorrido do grupo quando a proposta determinar cobrança integral;
45. presets de proposta podem carregar parcelas oficiais sem obrigar que “50% reduzida” seja exatamente metade aritmética da parcela integral;
46. cashback de proposta deve ser rastreado por cota e sua base não pode ser inferida apenas do crédito líquido quando houver regra promocional especial;
47. limite de despesas de aquisição não pode usar R$123,3 mil como constante sem explicar a base;
48. calendário de reajuste deve seguir o aniversário do grupo, independentemente do mês de adesão da cota;
49. inclusão posterior de seguro deve ter mês de início explícito e nunca gerar prêmios retroativos;
50. validade de cotação e reajuste anual são eventos distintos e não podem ser confundidos.

---

# 50. Modos travados e inputs manuais

Os valores calculados em modos travados NÃO devem sobrescrever o conteúdo persistente dos inputs manuais.

Alternar:

`manual → travado → manual`

deve recuperar o valor manual previamente digitado.

Isso vale especialmente para:

- preço do imóvel;
- aluguel;
- RGI;
- custos fixos.

---

# 51. Defaults atuais — V3.11

Os defaults abaixo descrevem a configuração atual do simulador. Eles são **premissas de cenário**, não recomendações financeiras nem garantias contratuais.

## 51.1 Macroeconomia

| Campo | Default atual |
|---|---:|
| Inflação projetada | 4,0% a.a. |
| CDB benchmark | 11,5% a.a. líquido projetado |
| CDI de referência | 13,65% a.a. bruto — spot BCB/SGS 4389 de 23/10/2026 |
| Carta contemplada | 80% do CDI como retorno líquido projetado |
| Inflação para valores de hoje | segue inflação projetada |
| Reajuste do aluguel | segue inflação projetada |
| Valorização do imóvel | segue inflação projetada |

O CDI spot é uma referência editável, não uma previsão constante para os 214 meses.

## 51.2 Consórcio

| Campo | Default atual |
|---|---:|
| Cotas | R$400 mil + R$400 mil + R$370 mil + R$200 mil |
| Carta bruta agregada | R$1.370.000 |
| Prazo restante | 214 meses |
| Contemplação | mês 12 em cada cota |
| Parcela reduzida | 50% |
| Taxa administrativa | 24% |
| Fundo de reserva | 1% |
| Reajuste | 3% a.a. |
| Primeiro reajuste | mês 7 |
| Ordem no mesmo mês | reajuste antes da contemplação |
| Compra na simulação principal | após o horizonte |
| Lance Livre | 70% do saldo devedor da própria cota |
| Lance embutido | até 30% da carta atualizada da própria cota |

O 70% é hipótese analítica calibrada pelo histórico oficial, não probabilidade nem corte garantido.

## 51.3 Empréstimo do lance

| Campo | Default atual |
|---|---:|
| Usar empréstimo | sim |
| Parte do lance em dinheiro financiada | 100% |
| Juros | 1,55% a.m. |
| TR projetada | 0% a.a. |
| Prazo | 120 meses |
| Sistema | Price |

A matriz contém linhas específicas de 0%, 50% e 100% financiado para isolar o efeito da alavancagem.

## 51.4 Seguro

| Campo | Default atual |
|---|---:|
| Seguro ativo | não |
| Base | valor fixo |
| Valor | R$0 |

## 51.5 Carta contemplada

| Campo | Default atual |
|---|---:|
| Rendimento | 80% do CDI bruto de referência, tratado como líquido final |
| Uso do rendimento | abater parcela da própria cota |
| Pooling entre cotas | proibido |
| Resgate | desativado |
| IR/custo adicional do resgate | 0% como sensibilidade |

## 51.6 Compra do imóvel

| Campo | Default atual |
|---|---:|
| Preço na simulação principal | travado ao crédito disponível |
| ITBI | 3% |
| RGI | 0,6% do imóvel |
| Outros custos | R$0 |
| Cashback | 10% |
| Base do cashback | principal líquido pós-embutido, sem rendimentos acumulados |

A inclusão de rendimentos acumulados na base existe apenas como sensibilidade não confirmada.

## 51.7 Matriz de cenários

| Campo | Default atual |
|---|---:|
| Política de compra | comprar na última contemplação |
| Preço comparável | imóvel-alvo fixo de R$1.000.000 |
| Lance Livre | presets entre 60,1% e 73% |
| Carta/CDI | sensibilidades 70% / 80% / 90% |
| Financiamento | inclui linhas isoladas 0% / 50% / 100% |

## 51.8 Persistência e testes

| Item | Estado atual |
|---|---|
| Formato de presets | `formatVersion = 2` |
| Estado financeiro | `stateVersion = 2` |
| Migração de antigos defaults | explícita, cria cópia e preserva original |
| Núcleo financeiro | `model-core.js` |
| Motor de cenários | `scenario-engine.js` sem DOM |
| Testes | unitários + integração em GitHub Actions |

## 51.9 Locação e venda

| Campo | Default atual |
|---|---:|
| Aluguel | 0,5% do preço / mês |
| Vacância | 8,3% |
| Administração | 8% |
| Manutenção | 5% |
| IR estimado do aluguel | 27,5% |
| Custos fixos | 7% do aluguel |
| Venda do imóvel | após horizonte |
| Corretagem na venda | 5% |
| IR simplificado sobre ganho | 15% |

# 52. Defaults que são sensibilidades, não fatos

Não tratar como “regra real” sem documentação ou cenário explícito:

- CDI spot de 13,65% constante por todo o horizonte;
- CDB líquido de 11,5% a.a. constante por todo o horizonte;
- 80% do CDI como rendimento líquido futuro da carta;
- Lance Livre de 70%;
- TR de 0%;
- juros bancários de 1,55% a.m.;
- ausência de seguro;
- IR/custo de resgate de 0%;
- IR de 15% na venda do imóvel;
- tributação simplificada do aluguel;
- cashback de 10% fora das condições formais da campanha;
- inclusão de rendimentos acumulados na base de cashback;
- valorização do imóvel e reajuste de aluguel iguais à inflação projetada.

Regras confirmadas que NÃO são meras sensibilidades:
- Lance Livre usa saldo devedor atualizado;
- embutido usa a carta e é limitado a 30%;
- rendimento de uma cota só pode abater a parcela da própria cota;
- operação multi-cota pode reunir créditos;
- para o cenário comercial confirmado com R$959 mil líquidos, cashback = R$95,9 mil.

# 53. Premissas propositalmente NÃO resolvidas dentro do motor

Enquanto constarem em `docs/pendencias.md`, o simulador não deve inventar regras definitivas para:

- trajetória temporal de CDI/CDB em horizonte longo;
- dia exato e ordem contratual do reajuste quando coincidente com contemplação;
- cobrança/dedução ligada a assembleias anteriores à adesão, ainda pendente de reconciliação documental;
- fórmula oficial da parcela reduzida da cotação;
- modalidade explícita Lance Fixo × Lance Livre em todos os fluxos;
- compra usando subconjunto das cotas contempladas;
- elegibilidade de rendimentos acumulados para cashback;
- destino/remuneração do crédito residual depois da compra;
- encerramento e compensação interna de carta contemplada não utilizada;
- regras finais do fundo de reserva;
- tributação do cashback, resgate e cessão;
- seguro contratual;
- substituição de garantia;
- custos/SLA de engenharia, cartório e transferência.

Quando uma hipótese for necessária para simulação, ela deve ser identificada como sensibilidade configurável.

# 54. Carta mantida até o horizonte / encerramento do grupo

Se uma carta contemplada permanecer não utilizada até o fim do grupo:

- ela continua como ativo até a liquidação;
- acumula rendimentos líquidos enquanto os recursos permanecerem aplicados;
- o consorciado ativo com obrigações quitadas tem direito ao crédito em espécie;
- a administradora deve comunicar os valores disponíveis após a última assembleia conforme regulamentação aplicável.

Michele informou adicionalmente que, no encerramento:
- eventual saldo devedor pendente seria liquidado com recursos da própria cota;
- o saldo líquido seria transferido automaticamente.

Essa mecânica de compensação automática ainda NÃO foi confirmada no Regulamento Geral consultado, que condiciona o recebimento em espécie à quitação das obrigações.

Portanto, a especificação-alvo deve manter dois estados possíveis até confirmação:
1. `quitacao_externa_antes_do_recebimento`;
2. `liquidacao_interna_no_encerramento`.

Nenhum deles deve ser escolhido silenciosamente como regra definitiva.

Não aplicar haircut fiscal automático aos rendimentos terminais.



# 55. Fundo de reserva

A convenção antiga de tratar o fundo de reserva integralmente como custo perdido está SUPERADA como descrição econômica completa.

## 55.1 Constituição econômica do fundo

O Regulamento Geral Bamaq estabelece que o Fundo de Reserva é formado por:
- contribuições destinadas à sua formação;
- rendimentos das aplicações financeiras dos próprios recursos do fundo.

Portanto, o saldo final não é necessariamente igual à soma nominal das contribuições pagas.

## 55.2 Utilização durante a vida do grupo

Os recursos podem ser consumidos nas finalidades previstas no regulamento, incluindo cobertura de insuficiências do fundo comum e outras despesas autorizadas.

Logo, não se deve capitalizar individualmente o “1% pago pelo usuário” como se fosse uma aplicação particular.

## 55.3 Rateio final

Se, após a última assembleia, houver saldo remanescente:
- ele é disponibilizado aos consorciados ativos elegíveis;
- o rateio é proporcional conforme a regra aplicável do grupo/regulação.

Michele confirmou comercialmente que cotas contempladas, utilizadas ou quitadas continuam participando do rateio se permanecerem ativas e não tiverem sido canceladas/desistidas.

Consequência de arquitetura:
- `saldoDevedor == 0` NÃO deve transformar automaticamente uma cota em “encerrada/inativa” para fins de rateio;
- deve existir estado separado de participação no grupo até a liquidação oficial.

## 55.4 Modelagem recomendada

Como o simulador não conhece:
- quanto do fundo será consumido;
- rendimentos efetivos;
- recuperações futuras;
- saldo total do grupo;

o modelo NÃO deve tentar reconstruir deterministicamente o saldo do Fundo de Reserva apenas a partir da contribuição individual.

Inputs preferíveis:
- `rateioReservaFinalR$` manual; ou
- `rateioReservaPctContribuicoes` como sensibilidade.

Esse percentual NÃO deve necessariamente ser limitado a 100%, porque o saldo do fundo incorpora rendimentos financeiros.

Default conservador:
`rateioReserva = 0`

com aviso explícito de que o cenário ignora eventual rateio positivo.

## 55.5 Timing

O Regulamento Geral Bamaq disponível estabelece:
- comunicação/disponibilização dos saldos remanescentes em até 60 dias da última assembleia;
- encerramento contábil em até 120 dias da última assembleia.

Michele descreveu prazo diferente: devolução em até 60 dias depois do encerramento contábil.

Até a divergência ser esclarecida:
- o software não deve hard-code `N + 6 meses`;
- o timing do rateio deve permanecer configurável;
- cenário documental pode usar janela de até 60 dias após a última assembleia para disponibilidade, sem confundir isso com encerramento contábil.

## 55.6 Aplicação financeira

Michele citou o Fundo Itaú Premium como veículo utilizado para o Fundo de Reserva.

A existência do fundo e seu perfil de renda fixa/DI são verificáveis, mas ainda não há documento ligando especificamente o Grupo 4012 a um CNPJ/fundo determinado.

Portanto, a aplicação específica deve permanecer como metadado/documentação, não como premissa rígida do motor.

# 56. Crédito residual

A convenção antiga de congelar o residual está revogada como especificação-alvo.

Depois da compra de bem com valor inferior ao crédito utilizado, a diferença NÃO deve ficar simplesmente congelada como ativo.

Destinos permitidos, conforme Resolução BCB nº 285/2023 e Regulamento Geral Bamaq:

1. despesas vinculadas ao bem, até o limite regulamentar/contratual;
2. quitação/antecipação de prestações vincendas conforme contrato;
3. devolução em dinheiro quando todas as obrigações financeiras com grupo e administradora estiverem quitadas.

Para o Regulamento Geral Bamaq, a antecipação identificada é em ordem indireta.

A escolha do destino deve ser representada explicitamente no software.

Pendências:
- regra específica do Grupo 4012;
- possibilidade de reduzir valor de parcela versus apenas ordem indireta;
- teto de despesas em operação multi-cota;
- procedimento e timing da devolução em dinheiro.

# 57. Múltiplas cotas — arquitetura atual e gaps residuais

**Estrutura comercial documentada em cotações individuais para a operação de R$ 1,37 milhão e implementada no motor:**
- Cota 1: R$ 400.000 — integral R$ 2.336,40 — reduzida R$ 1.167,60 — cashback R$ 40.000;
- Cota 2: R$ 400.000 — integral R$ 2.336,40 — reduzida R$ 1.167,60 — cashback R$ 40.000;
- Cota 3: R$ 370.000 — integral R$ 2.161,17 — reduzida R$ 1.080,03 — cashback R$ 37.000;
- Cota 4: R$ 200.000 — integral R$ 1.168,20 — reduzida R$ 583,80 — cashback R$ 20.000.

Totais exibidos/derivados:
- crédito: R$ 1.370.000;
- parcela integral inicial: R$ 8.002,17;
- parcela reduzida inicial: R$ 3.999,03;
- cashback nominal destacado: R$ 137.000.
- mesmo grupo possível (ex.: Grupo 4012);
- cotas novas;
- prazo informado: 214 meses;
- taxa administrativa total informada: 24%;
- fundo de reserva informado: 1%;
- reajuste informado: 3% a.a. fixos;
- contemplação e lance tratados individualmente por cota;
- créditos contemplados podem ser reunidos para um único imóvel;
- créditos usados em conjunto podem vir de grupos Bamaq diferentes;
- é possível comprar com apenas parte das cotas contempladas + recursos próprios;
- cotas futuras permanecem independentes e seu uso posterior precisa ser modelado separadamente.

A arquitetura multi-cota representa os principais estados abaixo por cota `j`; itens ainda ausentes permanecem como gaps explícitos:

- `C_j`;
- `D_j`;
- prazo;
- taxa administrativa;
- fundo de reserva;
- reajuste;
- contemplação;
- lance;
- embutido;
- empréstimo;
- carta contemplada;
- rendimento;
- parcela;
- status;
- utilização do crédito;
- imóvel/garantia vinculada;
- conjunto de outras cotas usadas na mesma aquisição;
- destino posterior: comprar outro bem, permanecer aplicada ou quitar obrigação elegível.

O agregador mensal deve somar os fluxos das cotas sem perder a identidade de cada uma.

A arquitetura não deve assumir que uma única contemplação representa todas as cotas.

Também não deve permitir pooling indevido dos rendimentos:
- rendimento da cota `j` só pode abater `Parcela_j`;
- excedente de `j` permanece em `Carta_j`;
- déficit de outra cota deve continuar exigindo aporte próprio, mesmo que exista excedente financeiro em `j`.

---


# 57A. Limite de cotas por consorciado

Não implementar limite geral de “150 cotas por CPF” como regra normativa.

A regra regulatória atual identificada é:
- limite de 10% das cotas ativas de um mesmo grupo para um mesmo consorciado;
- com consideração cumulativa das cotas do cônjuge/companheiro.

O Regulamento Geral da Bamaq também contém limite de 10% por grupo.

Se a Bamaq possuir limite interno adicional de 150 cotas por CPF, ele deve ser modelado apenas depois de receber a fonte/política correspondente.

---

# 58. Critério para equivalência entre uma carta e N cotas

A carta equivalente só pode ser tratada como economicamente equivalente a N cotas se, no cenário analisado, as regras relevantes forem lineares e suficientemente sincronizadas, especialmente:

- mesmo timing de contemplação;
- mesmas regras de reajuste;
- mesmo rendimento;
- mesma utilização do crédito;
- mesmo timing de lances.

Contemplações heterogêneas quebram essa equivalência.

---

# 59. Sensibilidades prioritárias futuras

## 59.5 CDI bruto separado do benchmark líquido

Desde a V3.7, o modelo separa explicitamente:

- `cdbAnnual`: retorno líquido projetado do benchmark;
- `cdiAnnual`: CDI bruto de referência;
- `cartaPctCdi`: fração do CDI usada como retorno líquido final da carta.

Default da V3.7:
- CDB benchmark líquido = 11,5% a.a.;
- CDI bruto spot = 13,65% a.a., referência BCB/SGS 4389 em 23/10/2026;
- carta = 80% do CDI.

Essas taxas NÃO são economicamente equivalentes e não devem ser sincronizadas automaticamente.

O CDI spot serve como referência inicial editável. O motor ainda assume taxa constante ao longo do horizonte; portanto, em cenários longos, o campo deve ser interpretado como hipótese/sensibilidade, não como previsão.

Regra:
`i_carta,a = i_CDI_bruto,a × p_carta_liquido`

O parâmetro `p_carta_liquido` já representa o resultado líquido projetado da carta e não recebe um novo haircut de IR.



Além da sensibilidade R1, o simulador deve futuramente priorizar:

## 59.1 Matriz CDB × reajuste

`Δ = f(CDB, reajuste_consorcio)`

A segunda auditoria mostrou mudança de sinal do resultado em faixas plausíveis.

## 59.2 Múltiplas contemplações

Distribuição de meses de contemplação por cota.

## 59.3 Tributação/custo da carta

Especialmente sobre grandes rendimentos acumulados.

## 59.4 Remuneração da carta contemplada

A modelagem atual separa:
- CDI bruto de referência;
- percentual líquido do CDI atribuído à carta;
- remuneração por cota;
- retorno do benchmark CDB, que é independente.

Continua futura apenas a possibilidade de variar temporalmente o CDI/percentual da carta ao longo do horizonte.

Após a reconciliação de 29/09/2026:

**Default/preset base recomendado para projeção:**
`p_carta = 80% do CDI`

Interpretação:
- rendimento líquido efetivo da carta;
- sem aplicação de novo IR/haircut no fluxo-base;
- variável/sensibilidade, não garantia.

A referência de 98%–105% deve aparecer apenas, se necessário, como informação sobre a camada bruta das aplicações, nunca como faixa líquida do crédito contemplado.

A arquitetura deve manter input manual para testar cenários alternativos.

---

# 60. Requisitos de interface ligados à correção financeira

A interface deve:

- diferenciar valor bruto de líquido;
- informar quando uma premissa é sensibilidade;
- não exibir número fictício quando não existe cenário válido;
- alertar sobre dívida de empréstimo remanescente no horizonte;
- indicar explicitamente que o modelo é de carta única equivalente;
- não esconder perdas atrás de “0”;
- distinguir TIR de equivalente anual;
- distinguir aporte nominal de aporte em valores de hoje.

---

# 61. Painel de venda da carta

O painel deve informar, quando houver janela válida:

- crédito da carta;
- saldo devedor do consórcio;
- saldo do empréstimo;
- custos da cessão;
- proposta líquida;
- top-up, se houver;
- oferta mínima para empatar com carregar;
- oferta mínima para empatar com benchmark.

Quando não houver janela:

- deve mostrar estado inválido/indisponível;
- não deve produzir recomendação econômica.

---

# 62. Painel de venda do imóvel

Deve distinguir:

- preço bruto de venda;
- corretagem;
- outros custos;
- IR estimado;
- quitação do consórcio;
- quitação do empréstimo;
- top-up;
- valor líquido aplicado no CDB.

---

# 63. KPIs finais mínimos

O bloco final deve apresentar de forma consistente:

- aportes próprios nominais;
- aportes próprios acumulados em valores de hoje;
- resultado final do benchmark;
- patrimônio total comparável da estratégia;
- patrimônio final em valores de hoje;
- ganho real da estratégia;
- ganho real do benchmark;
- equivalente anual do múltiplo real;
- TIR real da estratégia;
- TIR real do benchmark.

---

# 64. Critério de consistência entre painel e motor

Todo KPI deve ser derivado do resultado devolvido pelo motor ou de transformação puramente apresentacional.

A camada de UI NÃO deve:

- recalcular uma versão alternativa da economia;
- introduzir cronologia diferente;
- alterar saldo;
- inventar mês;
- aplicar clamp econômico adicional sem contrapartida.

---

# 65. Regra para análises auxiliares

Break-even, venda da carta e sensibilidades devem usar:

`runScenario(cfg, overrides)`

ou motor equivalente único.

Os `overrides` podem alterar apenas os parâmetros necessários ao cenário auxiliar.

Os demais parâmetros devem permanecer iguais ao cenário principal, salvo ajuste necessário para manter a validade temporal do cenário.

---

# 66. Critério de alteração futura desta especificação

Uma regra econômica só deve mudar quando houver pelo menos uma destas razões:

1. evidência contratual/operacional nova;
2. descoberta de bug;
3. decisão consciente de modelagem;
4. mudança de objetivo do produto.

Toda mudança deve produzir:

- atualização desta especificação;
- entrada correspondente no follow-up das auditorias;
- atualização das pendências, quando aplicável;
- teste de regressão.

---

# 67. Qualidade e regressão

O histórico detalhado das auditorias antigas está preservado em `docs/follow-up-auditorias.md` e no Git.

Regra atual:
- toda mudança econômica relevante atualiza esta especificação;
- toda mudança que feche/abra uma incerteza atualiza `docs/pendencias.md`;
- regras críticas recebem regressão automatizada;
- `npm test` roda no GitHub Actions em push/PR;
- navegador e testes de integração usam o mesmo `scenario-engine.js`.

A situação atual de qualidade está sintetizada nas seções 79–80.

---

# 69. Relação entre os três documentos

## Especificação

**Pergunta:** como o modelo deve funcionar?

Arquivo:

`docs/especificacao-modelo.md`

## Follow-up das auditorias

**Pergunta:** por que tomamos essas decisões e como reagimos aos auditores?

Arquivo:

`follow_up_auditorias_simulador_v3_2_pre_respostas17.md`

## Pendências

**Pergunta:** o que ainda não sabemos, não decidimos ou não conseguimos confirmar?

Arquivo:

`docs/pendencias.md`

Os três documentos devem evoluir em conjunto, mas não devem duplicar integralmente a mesma função.

---

# 70. Princípio final

O simulador deve privilegiar:

1. coerência econômica;
2. rastreabilidade;
3. comparabilidade justa com o benchmark;
4. transparência de hipóteses;
5. ausência de fluxos invisíveis;
6. ausência de precisão falsa em regras externas ainda não confirmadas.

Uma hipótese desconhecida deve aparecer como hipótese.

Uma decisão de modelagem deve aparecer como decisão.

Um valor que sai do bolso deve aparecer como fluxo.

Um ativo ou dívida que deixa de existir deve deixar o patrimônio.

E uma limitação estrutural deve ser apresentada ao usuário antes que o resultado seja interpretado como decisão financeira real.

---

# PARTE XI — ARQUITETURA DE IMPLEMENTAÇÃO ATUAL — V3.11

# 71. Arquitetura de cotas

A linha principal usa arquitetura multi-cota como padrão.

O motor trabalha com:

`cotas[]`

A quantidade de cotas é configurável pelo usuário entre 1 e 50.

Cada cota mantém, no mínimo:
- identificador;
- crédito/carta inicial;
- carta atualizada;
- saldo devedor;
- mês de contemplação;
- Lance Livre efetivo;
- embutido efetivo;
- dinheiro do lance;
- crédito líquido pós-embutido;
- parcela pós-contemplação;
- rendimento aferido;
- rendimento usado na própria parcela;
- eventual tranche bancária associada.

O preset estrutural QuintoAndar continua disponível com:
- R$400 mil;
- R$400 mil;
- R$370 mil;
- R$200 mil.

A possibilidade de configurar 1–50 cotas é uma **decisão de produto para comparar propostas**, não uma afirmação sobre limites contratuais da Bamaq ou de qualquer concorrente.

Quando existe apenas uma cota, a interface volta a apresentar um slider de mês de contemplação. Isso é comportamento de UX; o motor continua usando a mesma estrutura `cotas[]`.

# 72. Regra de lance implementada

A versão atual implementa como regra principal:

`lanceLivre_j = pctLivre × saldoDevedor_j_no_mes_da_contemplacao`

`embutidoSolicitado_j = pctEmbutido × cartaAtualizada_j`

`embutidoEfetivo_j = min(embutidoSolicitado_j, lanceLivre_j, 30% × cartaAtualizada_j)`

`dinheiro_j = lanceLivre_j - embutidoEfetivo_j`

O software alerta quando o embutido solicitado precisa ser limitado pelo próprio Lance Livre.

Limitação atual:
- a interface principal está modelada como **Lance Livre**;
- ainda não existe um seletor explícito de modalidade Fixo × Livre por cota;
- portanto, a parte de SW-005 referente à modalidade Fixa continua pendente.

# 73. Remuneração da carta e benchmark

A versão atual separa três conceitos:

1. retorno do CDB benchmark;
2. CDI de referência;
3. percentual do CDI recebido pela carta contemplada.

A taxa anual usada para a carta é:

`taxaCarta = CDI × percentualDoCDI`

Essa fórmula é uma parametrização de cenário. Ela não transforma a faixa comercial informada pela vendedora em garantia contratual.

O benchmark CDB pode mudar sem alterar a taxa da carta, e vice-versa.

# 74. Uso do rendimento sem pooling

Para cada cota `j`:

`yieldUsed_j = min(yield_j, installment_j)`

O excesso de rendimento permanece na própria cota.

É proibido:

`yieldExcess_A -> installment_B`

A versão atual exibe por cota:
- rendimento aferido acumulado;
- rendimento usado na própria parcela.

A especificação-alvo ainda pode ampliar os KPIs para mostrar explicitamente rendimento mensal, excedente e parcela restante do bolso.

# 75. Financiamento do lance em múltiplas datas

Cada contemplação pode criar uma tranche bancária independente.

Por tranche/cota, a versão atual suporta:
- mês de liberação = mês da contemplação;
- percentual do dinheiro do lance financiado;
- principal;
- taxa mensal;
- TR;
- prazo;
- Price ou SAC;
- parcelas pagas;
- juros;
- correção;
- saldo remanescente.

A primeira prestação da tranche ocorre no mês seguinte à sua liberação.

O usuário pode:
- aplicar as mesmas condições a todas as cotas; ou
- definir condições por cota/tranche.

Quando cotas contemplam no mesmo mês e usam termos idênticos, a soma das tranches deve ser financeiramente equivalente a um empréstimo agregado do mesmo principal.

# 76. Painel decisório / matriz de cenários

A V3.6 reutiliza o mesmo motor financeiro para comparar cenários sem substituir a simulação principal.

A matriz permite variar:
- mês de contemplação de cada cota;
- Lance Livre;
- percentual líquido do CDI atribuído à carta;
- percentual do dinheiro do lance financiado.

## 76.1 Invariante de comparabilidade

A matriz possui uma política própria, comum a todas as linhas, para evitar comparação entre estratégias/ativos diferentes.

Por default:
- compra no mês da última contemplação de cada linha;
- imóvel-alvo fixo em R$1.000.000;
- o preço do ativo NÃO varia com o crédito acumulado.

Alternativas explícitas:
- herdar o mês de compra da simulação principal;
- não comprar no horizonte;
- usar todo o crédito disponível como preço do imóvel.

A linha antes chamada “Atual” passa a ser **Base comparável**: preserva contemplação/lance/rendimento/financiamento da configuração principal, mas obedece à mesma política comum de compra e preço da matriz.

## 76.2 Persistência

A política da matriz é persistida junto ao cenário:
- `purchasePolicy`;
- `pricePolicy`;
- `propertyPrice`.

Estados antigos com `buyAtLastCont` são migrados de forma compatível para `last` ou `main`.

## 76.3 Outputs

Incluem:
- Δ contra CDB;
- patrimônio final;
- aportes próprios nominais;
- aportes em valores de hoje;
- maior desembolso mensal;
- dinheiro exigido nos lances;
- principal financiado;
- pico da dívida bancária;
- mês da compra;
- preço do imóvel;
- complemento de caixa na compra;
- cashback.

Os presets da matriz são **cenários de sensibilidade**, não probabilidades nem previsões de contemplação.

## 76.4 Sensibilidade isolada de financiamento

Desde a V3.9, três linhas adicionais preservam:
- meses de contemplação da Base comparável;
- Lance Livre da Base comparável;
- rendimento da carta da Base comparável;
- política comum de compra/preço;

e variam apenas a fração do dinheiro do lance financiada:
- 0%;
- 50%;
- 100%.

Isso permite medir separadamente o custo econômico da alavancagem bancária.

# 77. Biblioteca de consórcios / cenários

A versão atual possui gerenciamento local de N cenários salvos.

Persistência:
- `localStorage` do navegador.

Operações:
- selecionar;
- salvar;
- salvar como;
- excluir;
- exportar;
- importar.

Formato de transporte:
- JSON versionado.

O estado persistido inclui:
- controles da simulação;
- quantidade e valores das cotas dinâmicas;
- condições por tranche;
- linhas editáveis da matriz decisória.

Preferências puramente visuais continuam fora do estado financeiro salvo.

A biblioteca é ferramenta de comparação e rastreabilidade. Salvar um cenário com o nome de uma administradora **não constitui evidência** de que seus parâmetros foram confirmados pela administradora.

# 77A. Migração de presets por versão

Desde a V3.8, presets salvos registram e usam `appVersion` e `formatVersion` para detectar premissas antigas.

Regra de segurança:
- nunca alterar silenciosamente um preset existente;
- só sugerir migração quando o preset é anterior à mudança e o valor salvo coincide exatamente com um antigo default conhecido;
- preservar o original;
- criar uma cópia migrada.

Migrações reconhecidas:
- versão < 3.3 e Lance Livre = 30% → sugerir 70%;
- versão < 3.4 e Carta/CDI = 98% → sugerir 80%;
- versão < 3.7 e CDI = 11,5% → sugerir 13,65%.

Valores customizados não são modificados automaticamente.

A política da matriz também migra o antigo `buyAtLastCont` para `purchasePolicy`.

O formato de persistência passa a `formatVersion = 2` e o estado financeiro a `stateVersion = 2`.

# 78. Layout vertical

Detalhamentos que cresceram com a arquitetura multi-cota são apresentados em cartões/sublinhas, sem exigir tabela horizontal larga.

A versão atual deve permanecer utilizável apenas com rolagem vertical nas larguras de tela suportadas.

Essa regra é de UX e não altera o motor financeiro.

# 79. Gaps conhecidos — estado atual V3.11

Continuam pendentes no produto ou na documentação externa:

1. compra usando apenas subconjunto das cotas contempladas;
2. seletor explícito Lance Fixo × Lance Livre;
3. override das parcelas oficiais cotadas;
4. trajetória temporal de CDI/CDB em vez de taxa constante;
5. dia exato e ordem do reajuste em mês coincidente com contemplação;
6. reconciliação documental da ausência de cobrança por assembleias anteriores à adesão;
7. destino formal do crédito residual depois da compra;
8. confirmação documental sobre rendimentos acumulados na base de cashback;
9. módulos contratuais de seguro, cessão, resgate, encerramento e substituição de garantia;
10. detalhes operacionais do pedido mensal de uso do rendimento para pagar parcela.

Esses gaps devem permanecer explícitos; o motor não deve preencher lacunas contratuais silenciosamente.

# 80A. Arquitetura de testes de integração

Desde a V3.11:
- `model-core.js` contém regras financeiras puras de baixo nível;
- `scenario-engine.js` contém o motor completo `runScenario`, sem dependência do DOM;
- `index.html` usa `scenario-engine.js`;
- os testes Node usam exatamente o mesmo módulo do navegador.

Regressões de integração cobrem:
1. operação de quatro cotas R$400k + R$400k + R$370k + R$200k;
2. contemplação conjunta no mês 4 antes do reajuste;
3. crédito líquido pós-embutido de R$959 mil;
4. cashback conservador de R$95,9 mil;
5. contemplação no mês 12 após reajuste de 3%;
6. contemplações escalonadas;
7. separação entre principal e rendimentos;
8. política alternativa de cashback;
9. financiamento de 100% da parte em dinheiro do lance;
10. cronologia de 210 meses remanescentes após contemplação no mês 4;
11. invariante mensal anti-pooling por cota:
   `yieldUsed_j <= min(yield_j, installment_j)`.

O histórico mensal do motor expõe, para auditoria/teste:
- parcela por cota;
- rendimento por cota;
- rendimento usado por cota.

# 80. Estado de qualidade atual — V3.11

A linha atual já passou pela auditoria independente posterior à V3.5 e pelas correções V3.6–V3.11.

Estado:
- fórmulas críticas de Lance Livre/embutido/cashback possuem testes unitários;
- `runScenario` está fora do DOM e é compartilhado por navegador e testes;
- operação multi-cota possui regressões de integração;
- no-pooling é testado mês a mês por cota;
- matriz usa política comum de compra/preço;
- CDI bruto e benchmark líquido estão separados;
- presets antigos possuem migração explícita;
- cashback exclui rendimentos acumulados por default.

A suíte do GitHub Actions deve permanecer como gate de regressão a cada push/PR.

Riscos restantes são majoritariamente:
- premissas macro de longo prazo;
- regras contratuais/documentais ainda abertas;
- funcionalidades ainda não implementadas listadas na seção 79.



