# Auditoria de generalização do simulador de consórcios — V3.21

**Data:** 05/11/2026  
**Origem:** [issue #24](https://github.com/henriquecrang/cenarios-consorcio/issues/24)  
**Status:** diagnóstico concluído; **implementação das regras alternativas NÃO realizada**.  
**Escopo testado:** arquitetura atual de consórcio imobiliário + benchmark CDB, avaliação conceitual dos modelos Bamaq/QuintoAndar, Rodobens e Santander. Não equivale a parecer jurídico, nem a verificação do contrato particular de qualquer cliente.

## 1. Resultado executivo

O motor tem núcleo multi-cota real e permite configurar valores, datas de contemplação, modalidades fixo/livre, percentuais, financiamento por cota, cashback, compra com subconjunto e benchmark. Porém, algumas regras são acopladas ao caso QuintoAndar/Bamaq: **índice de reajuste constante anual, aplicação de lance fixo sobre carta e teto rígido de embutido em 30%, cálculo uniforme de taxas/prestações, rendimento obrigatoriamente como % do CDI e defaults de campanha Bamaq**. Outras políticas de destino/resgate foram deliberadamente mantidas conservadoras por falta de prova contratual.

**Achado prioritário:** um regulamento de 2025 do Santander para grupos que admitem Lance Fixo define base **preço do bem + taxa de administração e fundo de reserva**, com fixo de **20%** (imóveis/móveis, salvo condições específicas), e **proíbe usar embutido no Lance Fixo**. Isso contradiz duas hipóteses estruturais do nosso motor, que admite combiná-los e usa carta como base de fixo. Uma simples mudança de percentual no wizard não corrigiria o cálculo. [Fonte S2](#fontes-e-hierarquia-da-evidência).

**Segundo achado concreto:** a página de perguntas frequentes da Rodobens afirma não cobrar fundo de reserva no produto imobiliário descrito, enquanto o preset Bamaq inclui 1%. O campo de reserva já é configurável, então **zero pode ser representado**, mas a formação geral das prestações e a política de amortização continuam muito restritivas. [Fonte R1](#fontes-e-hierarquia-da-evidência).

### Separação conceitual indispensável

| Dimensão | O que representa | Não confundir |
|---|---|---|
| Atualização da carta/crédito e obrigações contratuais | Variação do preço do bem, indicador ou índice previsto no contrato; pode afetar prestações e dívida | Não é retorno de investimento sobre carta contemplada |
| Rendimento líquido financeiro da carta já contemplada e não utilizada | Resultado das aplicações permitidas do grupo, acrescido ao crédito até utilização conforme arts. 16–17 da Res. BCB 285 | Não equivale automaticamente a INCC, TR ou taxa contratual de reajuste |
| Benchmark CDB e CDI de referência | Custo de oportunidade versus indicador de referência de aplicação | Nem CDB líquido nem CDI bruto são obrigações da administradora |
| Custo bancário de financiamento externo | Juros, eventual TR e amortização da dívida do lance | Não é rendimento da carta do consórcio |

A remuneração financeira posterior à contemplação é legalmente prevista; **um contrato não deve ser modelado como “pode negar o rendimento”**. Alternativas de parametrização são hipóteses de desempenho da aplicação, não promessa de rentabilidade fixa da administradora. O Banco Central informa não haver prazo geral para aquisição após contemplação; os eventos de término do grupo e crédito não utilizado precisam ser modelados separadamente.

## 2. Comparação de três famílias de modelo e evidências

| Família/produto | Evidência examinada | Reajuste do crédito e prestações | Lance e embutido | Parcelas, reserva, rendimento e destino |
|---|---|---|---|---|
| **QuintoAndar/Bamaq — Grupo 4012 e proposta de 4 cotas** | [Especificação](especificacao-modelo.md), [perguntas/respostas](backlog-perguntas-bamaq.md) e [pendências](pendencias.md); parte vem de comunicação comercial de Michele e contrato/regulamento Bamaq referenciado nesses arquivos | Referência **3% fixo anual**, primeiro reajuste previsto abril/2027 no momento da proposta | Fixo **30% da carta**, Livre **% do saldo devedor**, embutido máximo **30%** na proposta; regras detalhadas precisam ser confrontadas com contrato/ata do grupo | Adm **24% total**, reserva **1%**, 214 meses restantes; rendimento **~80% do CDI líquido de projeção**; uso mensal do rendimento em parcelas é informação operacional/comercial; cashback promocional **10%** conservador |
| **Rodobens — produto imobiliário divulgado no FAQ atual** | [FAQ oficial R1](https://rodobens.com.br/ajuda/consorcio/consorcio-imoveis/perguntas-e-respostas), [FAQ geral R2](https://rodobens.com.br/ajuda/consorcio/perguntas-e-respostas), [regulamento imobiliário histórico R3](https://www03.rodobens.com.br/AreaParceiro/plugins/PDF/Regulamento_Imovel.pdf) | FAQ: critério por índice de preço (em regra anual) ou valor indicado pelo fabricante (sem periodicidade fixa em produtos pertinentes); depende da categoria/contrato | Fixo, Livre e Embutido conforme grupo; Rodobens descreve lance em **número de parcelas**, com valores e modalidades próprios; embutido conforme plano | FAQ imobiliário atual: **não cobra fundo de reserva**; seguro opcional; rendimento financeiro da carta até utilização; residual pode ir a despesas permitidas, parcelas ou dinheiro após quitação |
| **Santander — regulamento unificado dez/2025** | [Regulamento S2](https://cms.santander.com.br/sites/WPS/documentos/arq-consorcios-regulamento-unificado/25-12-29_132429_regulamento_unificado_consorcio_versao_dez2025.pdf), cláusula 4.2 e Anexo V; **o grupo particular depende da proposta e ata inaugural** | Imóveis: **INCC ou IPCA**, tetos de **3/5/7%**, ou indexador pré-fixado **4% a.a.** conforme escolha aplicável no grupo; admite movimento de alta/baixa segundo regras | Em grupos com Lance Fixo: **20% do valor-base da cota que inclui encargos** para imóveis; lance fixo exige recursos próprios/FGTS e **não admite lance embutido**; modalidade condicionada à ata | Regulamento prevê cenários de parcela reduzida, administração, reserva e garantias conforme plano; regras específicas devem ser verificadas na proposta de adesão |

**Limitações da comparação:** o regulamento Rodobens R3 é **histórico, datado de 2013** e não comprova condições vigentes de um grupo concreto em 2026; seu art. 26 mostra apenas que a reserva pode existir **quando cobrada**, mesmo que o FAQ atual indique reserva zero no produto imobiliário anunciado. A evidência Bamaq é mista e tem lacunas documentais de contrato/ata; o regulamento Santander é geral e não substitui a ata do grupo escolhido. As três famílias foram comparadas com **nível de evidência explicitado**, sem atribuir a toda marca uma única política contratual.

## 3. Matriz de classificação e issues de implementação

Categorias: **U** = universal/regulatório; **C** = já configurável no motor; **P** = precisa novo parâmetro/política; **A** = precisa alteração de algoritmo/arquitetura; **O** = específico de oferta/preset; **E** = evidência externa insuficiente. A classificação pode conter mais de uma letra.

| ID | Componente / código atual | Estado V3.21 e classificação | Alternativa documentada / risco | Impacto e issue |
|---|---|---|---|---|
| **G01** | Reajuste: scenario-engine.js, isAdjMonth(m), cfg.reaj e cfg.firstAdj | **C parcial + A** — valor percentual e primeiro mês configuráveis, mas incremento fixo **a cada 12 meses** | INCC/IPCA com limite 3/5/7%, 4% fixo (Santander); preço de referência com periodicidade própria (Rodobens). Alta influência em carta, saldo, parcela e patrimônio | **P0 [#25](https://github.com/henriquecrang/cenarios-consorcio/issues/25)** |
| **G02** | Lance: model-core.js resolveEffectiveBid(); scenario-engine.js embPct e embMaxPct cortados em 0,30 | **C parcial + A** — fixo sobre carta, livre sobre dívida, teto embutido 30%, combinações não validadas por grupo | Santander: fixo 20% sobre base com encargos, e embutido **proibido em fixo**; Rodobens: modalidades e limites específicos por contrato. Afeta crédito líquido, aportes, financiamento | **P0 [#26](https://github.com/henriquecrang/cenarios-consorcio/issues/26)** |
| **G03** | Plano: outstanding = credit0 × (1 + adm + reserva); fullInstall = outstanding / N; reduzida = fullInstall × reduced; redivisão ao contemplar | **C parcial + A** — taxas editáveis, cronologia uniforme e único tipo de amortização | Rodobens reserva zero no FAQ imobiliário; Santander plano de parcela reduzida e modalidades de cobrança; Bamaq opção de reduzir prazo ou parcela ainda não representada de modo geral. Alto risco de diferença de caixa mensal | **P0 [#27](https://github.com/henriquecrang/cenarios-consorcio/issues/27)** |
| **G04** | Rendimento: cartaAnnual = cdiAnnual × cartaPctCdi; mensalização e crédito às cotas elegíveis | **C parcial + A + U** — percentual editável, mas fonte é apenas CDI constante; rendimento financeiro pós-contemplação é obrigação regulatória | CDI de referência, taxa líquida anual e curva mensal da aplicação têm naturezas diferentes; cenários de retorno variável; resgate sem IR duplicado. Alto impacto de espera | **P0 [#28](https://github.com/henriquecrang/cenarios-consorcio/issues/28)** |
| **G05** | Rendimento usado na própria parcela: rendimentoPagaParcela | **C + E + P** — opção atual, mas default e processo operativo dependem de informação Bamaq | Solicitação mês a mês e autorização não comprovadas como regra de outros grupos; separar rendimento devido de abatimento operacional. Não criar pooling | **P1 [#29](https://github.com/henriquecrang/cenarios-consorcio/issues/29)** |
| **G06** | Compra parcial e saldo residual: residualCreditPolicy = unallocated/costs | **C parcial + A** — política prudente, mas falta amortização de prestações, recebimento de sobra após quitação, quitação de financiamento elegível | Art. 15 e art. 18 §3º da Res. 285; FAQ Rodobens confirma usos possíveis. Evita confundir crédito restrito e caixa livre | **P1 [#30](https://github.com/henriquecrang/cenarios-consorcio/issues/30)** |
| **G07** | Resgate/terminal: minRedeemForScenario = cont + 6; fim em N meses; carta não utilizada ao final | **C parcial + A + E** — resgate 180 dias simulado mensalmente, mas sem liquidação/rateio final por grupo | Encerramento do grupo, obrigação quitada, transferência do crédito, fundo de reserva, recursos não procurados; não inventar compensação automática entre carta e dívida | **P1 [#31](https://github.com/henriquecrang/cenarios-consorcio/issues/31)** |
| **G08** | index.html inicializa quatro cotas 400/400/370/200, prazo 214, taxas 24/1, 3% reajuste, 80% CDI, imóvel R$1 milhão e cashback 10% | **O + P** — simulação-padrão específica Bamaq apresentada como base do produto | Perfil genérico deve começar sem cashback não contratado e sem atribuir índices, taxas ou limites Bamaq a outras empresas; preservar migração | **P1 [#32](https://github.com/henriquecrang/cenarios-consorcio/issues/32)** |
| **G09** | Cessão e garantias: tarifa 1% do saldo com teto R$1 mil/cota; substituição de garantia com gate de aprovação | **C parcial + P + E** — regras Bamaq expostas, outros planos têm aprovações/bases/taxas diferentes | Configurar taxa fixa, percentual com base, teto por transferência, cadastro, garantia, aprovação; não inventar autorização ou caixa | **P2 [#33](https://github.com/henriquecrang/cenarios-consorcio/issues/33)** |
| **G10** | scenario-engine.js contém imóvel, ITBI/RGI, aluguel, vacância, valorização, venda, ganho de capital, como parte do mesmo motor | **A** — universo de ativos imobiliários é específico | Consórcio de bens móveis ou serviços tem outros usos e avaliação de patrimônio; não aplicar renda imobiliária a eles | **P2 [#34](https://github.com/henriquecrang/cenarios-consorcio/issues/34)** |

### Invariantes a preservar

- **Regulação:** contemplação por sorteio ou lance; lance homologado segundo prazo contratual; lance embutido descontado do crédito e destinado a prestações vincendas; direito de rendimentos líquidos financeiros de crédito contemplado até uso; crédito em dinheiro após 180 dias e quitação; usos/destinos limitados por norma e contrato. [Fonte B1](#fontes-e-hierarquia-da-evidência).
- **Integridade financeira:** uma cota não pode apropriar rendimento de outra; não contar crédito residual sem destinação como caixa irrestrito; empréstimo do lance é dívida; cashback não pode ser confundido com aporte; benchmark compara capital/fluxos equivalentes e não mistura CDI bruto com CDB líquido.
- **Linha histórica:** Bamaq 400/400/370/200, cashback conservador e pressupostos auditados V3.21 permanecem **reproduzíveis como preset**; generalizar não pode destruí-los.

## 4. Amostras numéricas para dimensionar diferenças

**São testes de sensibilidade matemáticos isolados, NÃO saídas da simulação completa** (não foi modificado nem executado o motor nesta auditoria).

1. **Reajuste:** crédito-base de R$400.000 após três reajustes iguais: 3% a.a. → R$437.090,80; 6% a.a. → R$476.406,40; diferença de **R$39.315,60** por carta. Os 6% são cenário hipotético, não INCC realizado.
2. **Base do lance fixo:** carta de R$400.000, taxa de administração + reserva **hipotéticas** somando 25%, lance fixo 20%. Base carta → R$80.000; base carta + encargos (R$500.000) → **R$100.000**. São R$20.000 de diferença; a regra da segunda base é documentada no Santander, mas as taxas deste exemplo **não são as taxas do Santander**.
3. **Reserva:** mesma carta R$400.000 com 1% contra 0% → **R$4.000** de diferença nominal inicial no componente de reserva, mantendo demais hipóteses; não representa automaticamente restituição final.
4. **Rendimento financeiro:** R$400.000 sem aportes/saques durante dois anos: taxa líquida cenário 80% × CDI bruto referencial 13,65% (=10,92% a.a.) → rendimento **R$92.129,86**; hipótese líquida fixa 7% a.a. → **R$57.960,00**; diferença **R$34.169,86**. São taxas de teste, não rentabilidade contratualmente assegurada.

Na implementação, transformar cada amostra em teste isolado e compará-la com `runScenario`, separando influência de parcelas, lances e compra.

## 5. Plano executável e dependências

### Bloco A — P0, primeiro congelar regras de contrato

- [ ] [#25](https://github.com/henriquecrang/cenarios-consorcio/issues/25) — motor de reajuste, índices, periodicidade, limites e preservação do modo fixo Bamaq;
- [ ] [#26](https://github.com/henriquecrang/cenarios-consorcio/issues/26) — bases/limites e compatibilidade de lances por grupo;
- [ ] [#27](https://github.com/henriquecrang/cenarios-consorcio/issues/27) — estrutura das parcelas, taxas, reduzida e amortização; depende de #25/#26;
- [ ] [#28](https://github.com/henriquecrang/cenarios-consorcio/issues/28) — rendimento líquido financeiro da carta independente do CDI constante; pode avançar em paralelo a #25/#26.

**Sequência sugerida:** #25 → #26 → #28 → #27 (ou #28 em paralelo após proteção de testes). Em cada issue, preservar caso Bamaq e `npm test`.

### Bloco B — P1, completar regras e perfis

- [ ] [#29](https://github.com/henriquecrang/cenarios-consorcio/issues/29) — uso de rendimentos para parcelas; depende de #28 e prova contratual;
- [ ] [#30](https://github.com/henriquecrang/cenarios-consorcio/issues/30) — destinos do residual e crédito; depende de #27 e regras aplicáveis de #31;
- [ ] [#31](https://github.com/henriquecrang/cenarios-consorcio/issues/31) — encerramento do grupo, crédito não utilizado e rateio; depende de #27/#28;
- [ ] [#32](https://github.com/henriquecrang/cenarios-consorcio/issues/32) — perfil genérico e presets específicos, dependente dos P0 necessários; coordenar com [#23 wizard](https://github.com/henriquecrang/cenarios-consorcio/issues/23).

**Sequência proposta:** #31 → #29 → #30 → #32, podendo antecipar estrutura dos presets sem permitir simulação de regras ainda não suportadas.

### Bloco C — P2, ampliar governança e domínios

- [ ] [#33](https://github.com/henriquecrang/cenarios-consorcio/issues/33) — regras/ tarifas de cessão e garantia por plano;
- [ ] [#34](https://github.com/henriquecrang/cenarios-consorcio/issues/34) — desacoplar motor de consórcio do valuation imobiliário e suportar outros bens com segurança.

**Importante para o wizard #23:** a tela guiada deve respeitar as políticas contratuais realmente modeladas, não inferir compatibilidade só pelo nome da administradora. É possível construir UX preparatória, mas não publicar caminhos INCC/fixo+embutido proibido como funcionalidade financeira antes dos P0.

## 6. Pendências de evidência e verificação futura

1. **Bamaq/QuintoAndar:** obter regulamento/aditivo/ata específicos da proposta Grupo 4012 que confirmem ausência de cobrança retroativa em cota nova vs cláusula de ingresso de cota substituta; memória da parcela reduzida, abatimento mensal de rendimento e regra exata de cashback. Essas lacunas **já constam** de `docs/backlog-perguntas-bamaq.md` e `docs/pendencias.md`; vinculá-las às issues filhas correspondentes, sem duplicar perguntas.
2. **Rodobens:** localizar contrato e ata de **grupo imobiliário atual** para confirmar indexador efetivo, limites de lance/embutido, administração/fundo de reserva e cronologia. O PDF histórico R3 serve **somente para demonstrar diversidade contratual**, não como contrato de 2026.
3. **Santander:** cruzar regulamento unificado 2025 S2 com proposta/ata inaugural do grupo selecionado. Não afirmar que todo grupo Santander tem índice ou lance fixo idêntico.
4. **Banco Central:** manter norma consolidada vigente e revisitar alterações futuras; o arquivo consultado contém alterações pela Res. 362/2023.

Se nova prova alterar a leitura, editar o relatório e o requisito da issue correspondente. Não bloquear a execução das partes já demonstradas em cenários tipados e conservadores.

## 7. Fontes e hierarquia da evidência

- **B1 — norma geral primária:** [Resolução BCB 285/2023 (versão consolidada)](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=285&tipo=resolu%C3%A7%C3%A3o+bcb), especialmente arts. 2º, 6º, 10, 12–18, 25-A/B e 26; [FAQ oficial do BCB](https://www.bcb.gov.br/meubc/faqs/s/consorcio).
- **S2 — regulação contratual publicada:** [Santander, Regulamento Unificado — dez/2025](https://cms.santander.com.br/sites/WPS/documentos/arq-consorcios-regulamento-unificado/25-12-29_132429_regulamento_unificado_consorcio_versao_dez2025.pdf), cláusula 4.2, lance fixo e Anexo V. **Não substitui adesão e ata de grupo.**
- **R1 — orientação oficial atual do produto imobiliário:** [Rodobens, FAQ imóveis](https://rodobens.com.br/ajuda/consorcio/consorcio-imoveis/perguntas-e-respostas) — reserva zero anunciada para modalidade descrita.
- **R2 — orientação oficial geral:** [Rodobens, FAQ consórcios](https://rodobens.com.br/ajuda/consorcio/perguntas-e-respostas) — reajustes, lances, destinos do crédito e prazo.
- **R3 — regulamento geral Rodobens antigo:** [Regulamento de imóveis, Dez/2013](https://www03.rodobens.com.br/AreaParceiro/plugins/PDF/Regulamento_Imovel.pdf), art. 26 fundo de reserva **quando cobrado**. Serve somente como evidência histórica de modalidades, não de contrato corrente.
- **R4 — explicação operacional atual:** [Rodobens, lance embutido (2026)](https://rodobens.com.br/blog/consorcio/o-que-e-consorcio-com-lance-embutido-veja-como-funciona), percentuais e combinações dependem do regulamento do grupo.
- **Internas:** [especificação canônica V3.21](especificacao-modelo.md), [pendências históricas](pendencias.md), [perguntas e evidências Bamaq](backlog-perguntas-bamaq.md), [follow-up auditorias](follow-up-auditorias.md).

**Escala:** norma e contrato/ata específica > regulamento geral oficial > cálculos reproduzíveis > FAQ/posicionamento publicado > comunicação comercial > hipótese de modelagem. Nunca promover hipótese ou promessa comercial a contrato universal.

---

**Definição de pronto da #24:** esta matriz + **issues #25–#34 abertas** e interligadas + docs canônicos sincronizados + issue #23 informada. **Não** implica que o simulador suporte os modelos alternativos antes da implementação das issues.
