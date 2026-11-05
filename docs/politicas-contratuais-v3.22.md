# Políticas contratuais configuráveis — V3.22

**Data:** 05/11/2026. **Referência:** [auditoria #24](auditoria-generalizacao-consorcios.md), [pesquisa de contratos #35](fontes-contratuais-2026.md), issues #25, #26, #28, #27, #29, #32, #33 e #34.

**Status:** versão implementada no motor/controles avançados com regressões de JavaScript. **Não houve validação manual em navegador nem emissão de parecer jurídico**. A V3.21 permanece a referência funcional da proposta Bamaq/QuintoAndar; as mudanças devem preservar resultados quando novos modos não são usados.

## 1. Camadas arquiteturais

- `model-core.js`: resolução dos lances e cashback. O núcleo de lances agora aceita política contratual tipada opcional.
- `contract-policies.js`: política de índice/reajuste, remuneração financeira da carta, abatimento autorizado e tarifa de cessão. Não usa DOM nem busca índices de mercado.
- `scenario-engine.js`: motor mensal multi-cota, aplica as políticas, mantém as obrigações e fornece histórico/indicadores. Continua concentrando cronologia de eventos de compra/consórcio.
- `property-economics.js`: adaptador **exclusivo para imóvel**, com custos de compra, aluguel líquido, valor líquido de realização e custos de venda.
- `index.html`: coleta dados contratuais, aplica presets e renderiza. O app é estático: não faz consulta automática de CDI, IPCA, INCC ou preço de bem.
- `tests/*`: quatro suítes (model-core, contract-policies, property-economics e scenario-engine).

**Política de origem:** `bamaq` = exemplo histórico específico; `generic` = nova proposta sem taxa administrativa, fundo de reserva, prazo, carta, correção e rendimento previamente assumidos; `custom` = valores atuais mantidos com alerta para conferir. Abrir/selecionar um contrato **não atesta** validade ou elegibilidade da administradora. A pesquisa #35 continua aberta para documentos de grupos reais.

## 2. Configurações implementadas

| Questão | Campos `cfg` / controles | Opções implementadas | Default legado e limitação |
|---|---|---|---|
| **#25 Atualização contratual** | `adjustmentMode`, `adjustmentSeries`, `adjustmentCap`, `adjustmentFloor`, `firstAdj`, `reaj` / `ajusteModelo`, `reajusteSerie`, `ajusteTeto`, `ajustePiso` | Taxa fixa a cada 12 meses; **série de taxas anuais** a partir de primeiro reajuste; **eventos em meses específicos**, com taxas/caps/floors em cada ocorrência | `fixed_annual` 3%, primeiro mês 7; série não é índice oficial obtido online. Projeções INCC/IPCA devem ser preenchidas com taxas exógenas e validadas contra cláusula de índice/limite real. |
| **#26 Lance** | `bidPolicy` global ou por cota: `fixedBase`, `freeBase`, `maxEmbeddedPct`, `allowFixedEmbedded`, `feeRatio`, `strict` | Fixo/Livre sobre carta, saldo ou carta com encargos; limite embutido 0–100%; possibilidade de proibir Fixo + embutido com erro explícito | Fixo sobre carta, Livre sobre saldo, embutido teto 30%, permissão Fixo + embutido. **Não calcula diretamente lance ofertado como número de parcelas (Rodobens)** ou lance com FGTS e aprovação probabilística. |
| **#28 Remuneração financeira do crédito contemplado** | `letterYieldMode`, `cartaPctCdi`, `letterNetAnnual`, `letterAnnualRates`, `letterMonthlyRates` / `cartaYieldMode`, `cartaYieldNetAnnual`, `cartaYieldSeries` | CDI × % líquido projetado, taxa líquida anual, série anual de taxas líquidas ou série **mensal** líquida (inclui perdas negativas limitadas ao saldo) | `cdi_pct` com 80% do CDI spot. São rendimentos financeiros das aplicações do grupo, **não** o índice de reajuste contratual. Taxas líquidas não recebem desconto de IR duplicado. Série insuficiente bloqueia cálculo. |
| **#27 Formação de parcela e amortização** | `adminFeeUpfrontShare`, `reducedUntilMonth`, `lanceAmortization` / `adminAntecipada`, `fimParcelaReduzida`, `amortizacaoLance` | Taxa administrativa total, quota antecipada da taxa no mês 1, fundo de reserva 0 ou positivo, fase reduzida até mês informado, redução da prestação ou do prazo pós-lance | 0% de taxa antecipada, reduzida até contemplação e lance reduzindo prestação; a antecipação **não é cobrada novamente nas parcelas**. Ainda faltam taxa administrativa com *múltiplas* janelas escalonadas, bases individuais por cota e produto com número variável de vencimentos por cota. |
| **#29 Uso do rendimento para abater prestações** | `yieldInstallmentMode`, `yieldInstallmentApproved`, `yieldRequestMonths` / `rendimentoAbatimentoModo`, `abatimentoAutorizado`, `mesesAbatimento` | Capitalizar integralmente; aplicar todo mês com autorização; usar apenas meses solicitados com autorização; modo legado conforme rádio | O legado Bamaq preserva simulador com abatimento automático mensal **como hipótese operacional comercial**, não prova documental. Qualquer novo modo de abatimento exige marcar autorização contratual; rendimento da carta continua existindo mesmo sem autorização de abatimento. |
| **#32 Perfis/presets** | `contractProfile`, `assetType` e controles `perfilContrato` etc. | Perfil Bamaq, **genérico** (apaga pressupostos promocionais e exige dados essenciais), custom (mantém números e pede conferência) | No genérico, carta inicial zero, cotas = 1, cashback = 0, carta sem compra até informar dados; imóvel de referência e renda são zerados. **Não é um catálogo de propostas certificadas**. |
| **#33 Cessão** | `transferFeePolicy`, `transferApprovalRequired`, `transferApproved` / `tarifaTransferenciaModelo`, `tarifaTransferenciaFixa`, `cadastroTransferenciaPorCota`, `cessaoExigeAprovacao`, `cessaoAprovada` | Tarifa % dívida/carta/oferta, fixa por cota/cessão, cadastro/cota; opção de **bloquear venda sem autorização** | Legado 1% da dívida com teto R$1.000/cota, aprovação não modelada. Cessão conjunta do lote: ainda não modela venda de subconjunto das cotas ou análise real de crédito do cessionário. |
| **#34 Destino do crédito/ativo** | `assetType` / `assetType` + `property-economics.js` | `property` = compra/aluguel/venda com adaptador exclusivo; `none` = acompanhar carta sem comprar até fim do horizonte; outros tipos rejeitados explicitamente | Ainda não há adaptadores para veículos, serviços, construção ou crédito para quitação de financiamento. O motor principal permanece responsável pelos eventos de consórcio e compra; refatoração além do adaptador pode ser útil. |

### Sintaxe de entradas manuais

- **Série anual de reajuste:** `6;4;5` significa primeira, segunda e terceira ocorrências programadas, em percentuais. O primeiro mês vem de `primeiroReajuste`.
- **Reajustes em meses específicos:** `7:6;19:4;31:-1` significa 6% no mês 7, 4% no 19 e -1% no 31. Contratos podem vedar reajustes negativos; configure piso 0% se necessário.
- **Rendimento anual líquido:** `8;7;6` significa retorno líquido projetado para os meses 1–12, 13–24 e 25–36, sucessivamente.
- **Rendimento mensal líquido:** `0.8;0.7;0.9` representa taxas **mensais** de 0,8%, 0,7% e 0,9%. Exigir toda a série no horizonte, sem extrapolar silenciosamente.
- **Solicitações de abatimento:** `13;14;18;19` — meses de efetiva autorização/solicitação, não períodos automaticamente consecutivos.

**Validação:** o motor interrompe simulação de política configurada com série insuficiente, período inválido ou lance embutido proibido; a UI mostra o erro no banner de premissa contratual. Contratos com reajuste por preço do bem, parcelas e mecanismos distintos não ficam automaticamente certificados só por serem expressáveis como série.

## 3. Propriedades econômicas e invariantes preservados

1. O crédito de uma cota não paga livremente a obrigação de outra; não há pooling de rendimento, salvo regra expressa ainda não suportada.
2. A correção contratual de carta/dívida antes da contemplação e os rendimentos financeiros líquidos do crédito contemplado permanecem conceitos separados.
3. Abatimento dos rendimentos nas parcelas **não** é inferido da simples existência de remuneração da carta.
4. Cashback de 10% permanece um benefício do preset Bamaq, não do perfil genérico. Seus parâmetros não foram alterados nesta rodada.
5. O usuário do perfil genérico precisa informar dados contratuais e taxas antes que o motor produza resultados. `assetType=none` significa crédito vinculado, e **não** liquidação automática em dinheiro no fim do grupo.
6. O comportamento de resgate, crédito residual e encerramento não foi generalizado nesta rodada; permanecem pendências vinculadas às **issues #30 e #31**, que não integravam a sequência solicitada.
7. Venda/cessão e garantias dependem de autorização quando a política configurada exigir; não criar receita de uma cessão bloqueada.
8. Valor do imóvel e seu aluguel são calculados pelo adaptador próprio; veículo e serviço não herdam receita de aluguel imobiliário.

## 4. Evidências e limitações de validade

- [Bamaq regulamento oficial 2026](https://bamaqconsorcio.com.br/upload/pdf/regulamento_2026.pdf). O **art. 8º VI a** prevê retroativos para ingresso em grupos em andamento. A vendedora afirmou exceção para a entrada específica no Grupo 4012, **ainda não reconciliada contratualmente**; não converter essa informação em regra universal.
- [Santander regulamento unificado maio/2026](https://cms.santander.com.br/sites/WPS/documentos/arq-consorcios-regulamento-unificado/26-06-02_205842_regulamento-consorcio-santander-maio-2026.pdf), com exemplos de indexador variável, limites e modalidade de lance fixo.
- [Rodobens FAQ imobiliário](https://rodobens.com.br/ajuda/consorcio/consorcio-imoveis/perguntas-e-respostas) descreve fundo de reserva zero para o produto anunciado; número e regras exatas dependem do grupo. [#35](https://github.com/henriquecrang/cenarios-consorcio/issues/35) permanece **aberta para obter contrato/ata de grupos atuais**.
- Rendimentos futuros, curvas de taxas e índices são hipóteses de cenário exógenas, não capturas automáticas de mercado.

## 5. Verificação

- `npm test` invoca quatro suítes independentes.
- As quatro suítes foram executadas contra os arquivos do repositório usando avaliação JavaScript isolada, e todas passaram na rodada de 05/11/2026; **a execução do GitHub Actions e o teste visual no navegador não foram confirmados nesta sessão**.
- O JavaScript inline de `index.html` foi compilado com sucesso; esse teste sintático **não prova** interação E2E, compatibilidade responsiva ou persistência ao trocar perfis.
- Casos cobertos: base de lance Bamaq e alternativa com taxa, teto, proibição de embutido; índices anuais/eventos; rendimento independente com taxas fixas e curvas; cobrança de taxa antecipada; parcelas reduzidas e amortização por prazo; autorização/solicitação mensal; tarifas de cessão; fórmulas imobiliárias extraídas; não compra/asset não suportado.

## 6. Próximas lacunas

- **#23** wizard de nova simulação: deve conhecer políticas parametrizadas e exigir cláusulas/validação ao abrir um perfil específico.
- **#30/#31** residuais, encerramento, rateio e transferência para dinheiro continuam pendentes e podem alterar patrimônio terminal.
- **#35** contrato/ata atual de grupo Rodobens e Santander e aditivo/ata Bamaq Grupo 4012 continuam faltando; evitar rotular perfil como certificado.
- **#34** ampliações futuras a veículos, serviços e reutilização de motor sem imóvel demandam adaptadores próprios, além da extração inicial do cálculo do imóvel.
- **#27** planos com parcelas/administração escalonadas em cronogramas individuais por cota ainda exigem trabalho se forem necessários para contratos reais.

**Decisões do produto tomadas sem revisão do usuário:** não inventar série de INCC, não assumir cashback/abatimento em contratos genéricos, exigir autorização explícita nas opções novas, preservar a lógica legada da proposta Bamaq, e recusar cálculo de veículo/serviço pelo adaptador de imóvel.
