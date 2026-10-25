# Follow-up das auditorias — Simulador Consórcio × CDB × Imóvel

**Documento vivo de decisões de modelagem e acompanhamento de auditoria**  
**Versão atual de referência do simulador:** V3.2  
**Última baseline com auditoria independente documentada:** V2.54  
**Documentos complementares:** `pendencias_simulador_consorcio_v3_2_pre_respostas17.txt`, relatórios e suítes das auditorias V2.46 e V2.53.

---

## 1. Finalidade deste documento

Este arquivo registra o que aconteceu **depois de cada apontamento de auditoria**.

Ele não substitui o arquivo de pendências.

- `pendencias_simulador_consorcio_v3_2_pre_respostas17.txt` responde: **o que ainda falta descobrir, confirmar, decidir ou implementar?**
- este `follow_up_auditorias_simulador_v3_2_pre_respostas17.md` responde: **o que o auditor apontou, como avaliamos o ponto, que decisão tomamos, o que foi implementado e por que eventualmente não seguimos a sugestão original?**

O objetivo principal é evitar duas perdas de contexto:

1. uma auditoria futura interpretar como esquecimento um comportamento que foi mantido deliberadamente;
2. uma decisão provisória virar, com o tempo, uma “verdade” do modelo sem que ninguém se lembre de sua origem e de suas limitações.

Este documento deve preservar o histórico mesmo depois que uma pendência operacional for resolvida.

---

## 2. Estados usados

| Estado | Significado |
|---|---|
| **IMPLEMENTADO E REAUDITADO** | A solução foi implementada e a auditoria seguinte testou o comportamento com sucesso. |
| **IMPLEMENTADO — PENDENTE DE REAUDITORIA** | A solução já está no simulador, mas ainda não foi submetida novamente à suíte independente depois da mudança. |
| **IMPLEMENTADO DE OUTRA FORMA** | Concordamos com o problema, mas adotamos uma solução diferente da recomendação original. |
| **NÃO IMPLEMENTADO — DECISÃO DE MODELAGEM** | Optamos conscientemente por não fazer a alteração sugerida. |
| **ADIADO — DEPENDE DE EVIDÊNCIA EXTERNA** | Não queremos inventar regra contratual, tributária ou operacional sem documentação. |
| **PENDENTE — UX / BAIXA PRIORIDADE** | O problema existe, mas não altera o núcleo econômico e foi deixado para uma rodada posterior. |
| **RISCO DE PREMISSA** | O motor pode estar correto, mas o resultado depende de uma hipótese externa ainda não confirmada. |
| **SUPERADO POR NOVA ARQUITETURA / DECISÃO** | O tratamento anterior foi substituído por uma decisão mais ampla ou por um novo desenho do modelo. |

---

## 3. Linha do tempo

### Primeira auditoria — V2.46

A primeira auditoria leu o JavaScript integralmente e executou o `simulate()` original em harness headless, com cenários mínimos T0–T32.

Resumo dos achados:

- 1 crítico: A1;
- 3 altos: A2–A4;
- 6 médios: A5–A10;
- 8 baixos: A11–A18;
- 1 risco de premissa central: R1.

A auditoria também verificou como corretos vários invariantes: ausência de dupla contagem de cashback no caixa, benchmark sem receber dinheiro emprestado/cashback como aporte, empréstimo a 0%, quitação na venda/resgate, contemplação nas fronteiras e outros.

### Evolução entre as auditorias

- **V2.47:** estabilização de lance, fluxo negativo do imóvel, cronologia compra/aluguel, cashback e clamps.
- **V2.48:** centralização no motor `runScenario()`.
- **V2.49:** venda do imóvel por valor corrente, patrimônio líquido de realização e TIR real.
- **V2.50:** patrimônio pré-contemplação, ordem reajuste/contemplação, base de rendimento no resgate, preservação de inputs manuais, uso direto de `letterBalance` e sensibilidade R1.
- **V2.51:** TR opcional no empréstimo do lance.
- **V2.52:** KPI de aportes próprios em valores de hoje.
- **V2.53:** seguro/proteção financeira como sensibilidade configurável.

### Segunda auditoria — V2.53

A segunda auditoria executou **92 testes no arquivo original, sem alterações**:

- **81 OK**;
- **10 FALHA**;
- **1 A CONFIRMAR**.

Resumo informado pelo auditor:

- nenhum achado crítico;
- 3 altos;
- 3 médios;
- 5 baixos;
- motor financeiro considerado adequado para análise exploratória nos invariantes testados;
- principais falhas novas concentradas em KPIs/painéis auxiliares;
- principais obstáculos à decisão financeira real passaram a ser premissas externas.

### V2.54 — fechamento dos bugs objetivos da segunda auditoria

A V2.54 implementou correções para B1–B5, Q06 e B7.

**Importante:** esses itens estão marcados neste documento como **IMPLEMENTADO — PENDENTE DE REAUDITORIA**, porque a alteração foi feita depois da segunda auditoria e ainda deve ser validada novamente pela suíte independente.

---

# PARTE I — MATRIZ MESTRA

## 4. Primeira auditoria — A1–A18 + R1

| ID | Severidade original | Tema | Decisão / tratamento | Versão | Estado atual |
|---|---|---|---|---|---|
| A1 | Crítica | Venda usa preço de compra em vez do valor corrente | Tornar a base configurável; default = valor de mercado corrente | V2.49 | **IMPLEMENTADO E REAUDITADO** |
| A2 | Alta | Lance/embutido acima do saldo faz valor desaparecer | Limitar lance efetivo ao saldo amortizável e embutido ao lance/saldo/30% | V2.47 | **IMPLEMENTADO E REAUDITADO** |
| A3 | Alta | Custos do imóvel somem quando maiores que aluguel | Permitir resultado operacional negativo; IR somente sobre base positiva | V2.47 | **IMPLEMENTADO E REAUDITADO** |
| A4 | Alta | Motores duplicados divergem | Centralizar em `runScenario()` | V2.48 | **PARCIAL NA V2.53; reforçado na V2.54, pendente de reauditoria** |
| A5 | Média | Imóvel no horizonte entra bruto | Separar valor bruto e valor líquido de realização; usar líquido na comparação | V2.49 | **IMPLEMENTADO E REAUDITADO** |
| A6 | Média | Compra recebe rendimento da carta + aluguel no mesmo mês | Adotar compra no fim do mês; aluguel só no mês seguinte | V2.47 | **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO** |
| A7 | Média | “Ganho anualizado” não é TIR | Manter múltiplo anualizado com rótulo correto e adicionar TIR real | V2.49 | **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO** |
| A8 | Média | Valores manuais e crédito residual sem semântica temporal completa | Não inventar destino/rendimento do residual; manter decisão aberta | — | **ADIADO — DEPENDE DE EVIDÊNCIA / DECISÃO DE UX** |
| A9 | Média | Patrimônio pré-contemplação artificialmente negativo | Ocultar patrimônio comparável antes da contemplação em vez de estimar valor de desistência | V2.50 | **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO** |
| A10 | Média | Ordem reajuste × contemplação muda o resultado | Tornar a ordem configurável em vez de escolher uma regra única | V2.50 | **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO** |
| A11 | Baixa | Base do IR/custo do resgate omite rendimento consumido | Acumular todo rendimento aferido; não presumir tributação real | V2.50 | **MATEMÁTICA REAUDITADA; FISCALIDADE ADIADA** |
| A12 | Baixa | Fundo de reserva tratado como custo integral | Não presumir devolução sem regra documental | — | **NÃO IMPLEMENTADO — DECISÃO PRUDENCIAL / EVIDÊNCIA EXTERNA** |
| A13 | Baixa | Texto/KPI de cashback não representa corretamente o timing | Cashback entra separadamente ao fim do mês; sem retroagir sobre obrigações | V2.47 | **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO** |
| A14 | Baixa | Taxa/tributação da cessão não confirmadas | Manter parametrização/sensibilidade; não impor IR de 15% nem base “de mercado” sem prova | — | **ADIADO — DEPENDE DE EVIDÊNCIA EXTERNA** |
| A15 | Baixa | Limites da interface não aplicados no motor | Aplicar clamps no motor; seguir auditando pisos que escondam perdas | V2.47 + V2.54 | **PARCIAL NA V2.53; reforçado na V2.54, pendente de reauditoria** |
| A16 | Baixa | Cálculos automáticos sobrescrevem inputs manuais | Separar valores efetivos calculados dos valores digitados | V2.50 | **IMPLEMENTADO E REAUDITADO** |
| A17 | Baixa | Fallback `letterBalance || ...` é frágil | Usar `letterBalance` diretamente | V2.50 | **IMPLEMENTADO E REAUDITADO** |
| A18 | Baixa | Premissas implícitas | Documentar; tratar seguro/TR como sensibilidades; manter fiscal/lance como pendências onde necessário | V2.50–V2.53 | **PARCIAL / DOCUMENTAÇÃO CONTÍNUA** |
| R1 | Risco de premissa | Resultado depende fortemente do rendimento da carta | Criar sensibilidade Δ × %CDB da carta; não tratar hipótese como fato | V2.50 | **IMPLEMENTADO E REAUDITADO; PREMISSA EXTERNA SEGUE ABERTA** |

---

## 5. Segunda auditoria — B1–B11 e achados de premissa

| ID | Severidade | Tema | Decisão / tratamento | Versão | Estado atual |
|---|---|---|---|---|---|
| B1 | Alta | `runScenario()` não devolve `N`; KPIs/warnings quebrados | Devolver `N` pelo motor | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| B2 | Alta | Break-even usa resgate incompatível com contemplação testada | Recalcular resgate efetivo para respeitar `cont + 6` | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| B3 | Alta | Painel da venda da carta usa `cfg.redeemRaw` inexistente | Usar configuração atual de resgate | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| B4 | Média | Painel inventa venda quando não existe janela válida | Exibir “sem janela válida para venda” | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| B5 | Média | Cessão da carta rende um mês cedo demais | Aplicar convenção de fim de mês também à cessão | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| B6 / P01 | Média / a confirmar | Carta mantida até N não sofre haircut configurado no resgate | Não aplicar haircut automaticamente sem saber regra do encerramento | — | **NÃO IMPLEMENTADO — DECISÃO PRUDENCIAL / EVIDÊNCIA EXTERNA** |
| B7 | Baixa | Interface não avisa que é carta única equivalente | Adicionar aviso estrutural explícito | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| B8 | Baixa | Pisos/clamps ainda podem esconder perdas | Corrigir caso concreto Q06; manter regra de revisão de `Math.max(0,...)` | V2.54 | **PARCIAL / CONTROLE CONTÍNUO** |
| B9 | Baixa | `teto = 0` significa “sem teto”, UX ambígua | Não alterado ainda; preferir checkbox/texto explícito no futuro | — | **PENDENTE — UX / BAIXA PRIORIDADE** |
| B10 | Baixa | Convenções do seguro precisam ficar claramente documentadas | Manter seguro como sensibilidade, default desligado, sem alegar regra contratual | V2.53 | **MATEMÁTICA REAUDITADA; DOCUMENTAÇÃO/PREMISSA EXTERNA ABERTA** |
| B11 | Baixa | TIR indefinida aparece apenas como “—” | Ainda não alterado; futuro texto explicativo | — | **PENDENTE — UX / BAIXA PRIORIDADE** |
| Q06 | Falha concreta ligada a B8 | Custos da cessão > proposta tinham perda truncada | Transformar líquido negativo em top-up do bolso | V2.54 | **IMPLEMENTADO — PENDENTE DE REAUDITORIA** |
| M01 | Premissa/arquitetura | 7 cotas iguais contempladas juntas = carta única | Reconhecer linearidade sob timing idêntico | — | **VALIDADO COMO PROPRIEDADE DO MODELO** |
| M02 | Premissa/arquitetura | Contemplações escalonadas quebram equivalência econômica | Elevar múltiplas cotas a próxima mudança estrutural necessária | próximo marco | **DECISÃO ESTRATÉGICA DE ARQUITETURA** |
| P02 | Premissa | Resultado muito sensível a reajuste e nível do CDB | Elevar ambos a prioridade alta; futura matriz CDB × reajuste | próximo marco | **RISCO DE PREMISSA / PENDÊNCIA ALTA** |

---

# PARTE II — REGISTRO DETALHADO DAS DECISÕES

## 6. AUD-DEC-001 — A1 — Base de preço na venda do imóvel

**Origem:** primeira auditoria, A1 — crítica.

**Apontamento:** o imóvel era marcado pelo valor valorizado enquanto permanecia na carteira, mas era vendido por `% × preço de compra`. No cenário original, isso produzia diferença de aproximadamente R$ 925 mil no default com venda tardia.

**Sugestão do auditor:** vender por `% × propertyValue`; se a opção “sobre preço de compra” fosse mantida, torná-la explícita.

**Decisão:** concordamos com o problema e preservamos os dois conceitos como opções explícitas.

**Implementação:**  
- default: percentual sobre valor de mercado corrente;
- alternativa: percentual sobre preço original de compra;
- custo fiscal simplificado passou a considerar preço + ITBI + RGI + outros custos de aquisição;
- patrimônio terminal passou a distinguir bruto e líquido de realização.

**Validação posterior:** D08, D09, D10 e D13 da segunda auditoria passaram.

**Estado:** **IMPLEMENTADO E REAUDITADO.**

---

## 7. AUD-DEC-002 — A2 — Lance maior que o saldo

**Origem:** primeira auditoria, A2 — alta.

**Apontamento:** o excesso de lance podia desaparecer quando `totalLance > outstanding`. A auditoria mostrou perdas artificiais de R$ 33.333 em cenário mínimo e aproximadamente R$ 367 mil em cenário default extremo.

**Decisão:** aceitar a correção.

**Implementação:**  
- lance solicitado e lance efetivo são separados;
- lance efetivo limitado ao saldo amortizável;
- embutido limitado ao lance efetivo, ao saldo e ao teto de 30%;
- parte em dinheiro calculada sobre o lance efetivo.

**Validação posterior:** A09–A12 da segunda auditoria passaram.

**Estado:** **IMPLEMENTADO E REAUDITADO.**

---

## 8. AUD-DEC-003 — A3 — Custos operacionais acima do aluguel

**Origem:** primeira auditoria, A3 — alta.

**Apontamento:** o piso zero apagava custos fixos quando aluguel era insuficiente.

**Decisão:** aceitar integralmente a correção.

**Implementação:** resultado operacional pode ser negativo; imposto incide apenas sobre base positiva.

**Validação posterior:** D04 e D05 passaram; D06 validou o caso positivo.

**Estado:** **IMPLEMENTADO E REAUDITADO.**

---

## 9. AUD-DEC-004 — A4 — Motores financeiros duplicados

**Origem:** primeira auditoria, A4 — alta.

**Apontamento:** `simulate`, break-even e análise de venda da carta continham cópias divergentes do motor.

**Sugestão:** um único `runScenario(cfg, overrides)`.

**Decisão:** aceitar a arquitetura de motor único.

**Implementação:** V2.48 introduziu `runScenario()` como núcleo comum.

**Segunda auditoria:**  
- A4-01 confirmou que “hold” e cenário principal passaram a usar a mesma economia em cenário com venda do imóvel;
- a auditoria, porém, classificou A4 como apenas parcialmente resolvido porque painéis auxiliares ainda passavam estados inválidos ao motor (principalmente B2/B3/B4).

**Follow-up:** V2.54 corrigiu os problemas conhecidos de resgate/janela de venda.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA FINAL DOS PAINÉIS AUXILIARES.**

---

## 10. AUD-DEC-005 — A5 — Patrimônio bruto versus valor realizável

**Origem:** primeira auditoria, A5 — média.

**Apontamento:** o imóvel era comparado ao CDB pelo valor bruto, sem custos de saída.

**Decisão:** aceitar o princípio, mas preservar as duas visões.

**Implementação:**  
- valor de mercado bruto continua visível;
- valor líquido estimado de realização é calculado;
- patrimônio líquido comparável usa a realização líquida.

**Validação posterior:** D09 mostrou equivalência entre vender no horizonte e manter com marcação líquida no cenário testado.

**Estado:** **IMPLEMENTADO E REAUDITADO.**

---

## 11. AUD-DEC-006 — A6 — Convenção temporal da compra

**Origem:** primeira auditoria, A6 — média.

**Apontamento:** o mês da compra recebia um mês inteiro de rendimento da carta e um mês inteiro de aluguel; compra e venda no mesmo mês ainda recebiam aluguel.

**Sugestão:** escolher uma única convenção; auditor sugeriu compra no fim do mês como alternativa preferível.

**Decisão de modelagem:** **compra no fim do mês**.

Regras deliberadas:
- carta pode render durante o mês da compra;
- imóvel começa a gerar aluguel/custos operacionais no mês seguinte;
- compra e venda no mesmo mês não geram aluguel;
- entradas de fim de mês começam a render no mês seguinte.

**Validação posterior:** B04, D01, D02, D03 e D07 passaram.

**Estado:** **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO.**

---

## 12. AUD-DEC-007 — A7 — Múltiplo anualizado versus TIR

**Origem:** primeira auditoria, A7 — média.

**Apontamento:** o KPI “ganho real anualizado” anualizava o múltiplo final e não era TIR.

**Sugestão:** calcular TIR real.

**Decisão:** não eliminar o múltiplo anualizado. Manter **duas métricas com significados distintos**:

1. **Equivalente anual do múltiplo real** — anualização geométrica do múltiplo patrimônio/aportes; explicitamente rotulada como “não é TIR”.
2. **TIR real** — retorno temporal calculado pelos fluxos efetivos.

**Validação posterior:** G01–G08 passaram; benchmark real reproduziu a taxa real esperada, inclusive em séries longas.

**Estado:** **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO.**

---

## 13. AUD-DEC-008 — A8 — Valores manuais e crédito residual

**Origem:** primeira auditoria, A8 — média.

**Apontamento:** valores manuais não tinham semântica temporal inequívoca e o crédito residual ficava parado.

**Sugestão do auditor:** indexar valores manuais e dar destino econômico ao residual.

**Decisão:** **não implementar automaticamente essa sugestão**.

Motivação:
- não sabemos se um campo manual representa “R$ de hoje” ou valor nominal esperado no mês futuro;
- não sabemos se crédito residual pode continuar rendendo, amortizar saldo, pagar custos, ser usado em outro bem ou ser sacado;
- qualquer escolha automática converteria uma dúvida contratual/UX em regra econômica inventada.

**Tratamento histórico até a V2.54:**  
- preservar o residual como ativo vinculado;
- não presumir remuneração ou destinação;
- manter a semântica dos valores manuais como pendência de UX/modelagem.

**Segunda auditoria:** B05 confirmou que esse comportamento estava implementado como projetado.

**Evidência posterior — 28/09/2026:** a Resolução BCB nº 285/2023 e o Regulamento Geral Bamaq definem os destinos permitidos da diferença entre crédito e preço do bem. Logo, a antiga opção prudencial deixou de ser necessária e deve ser substituída.

**Nova decisão:** crédito residual pós-compra deve receber destino explícito entre despesas elegíveis, antecipação/quitação conforme contrato ou devolução em dinheiro quando todas as obrigações estiverem quitadas.

**Estado:** **SUPERADO POR EVIDÊNCIA REGULATÓRIA — MUDANÇA DE SOFTWARE NECESSÁRIA.**

**Gatilho para revisão:** resposta formal sobre crédito residual + decisão explícita sobre “R$ de hoje” versus “R$ nominais futuros”.

---

## 14. AUD-DEC-009 — A9 — Patrimônio antes da contemplação

**Origem:** primeira auditoria, A9 — média.

**Apontamento:** ativo zero antes da contemplação, combinado com dívida, criava patrimônio artificialmente negativo e salto na contemplação.

**Sugestões do auditor:**  
- estimar valor de desistência/restituição; ou
- ocultar a curva.

**Decisão:** **ocultar o patrimônio comparável antes da contemplação**.

Motivação:
- valor zero é enganoso;
- estimar valor de desistência sem regra de restituição, multas e prazo também seria inventar um valor;
- a ausência de curva é mais honesta que uma marcação arbitrária.

**Validação posterior:** A9-01 passou: série nula antes da contemplação e valor apresentado a partir dela.

**Estado:** **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO.**

---

## 15. AUD-DEC-010 — A10 — Reajuste e contemplação no mesmo mês

**Origem:** primeira auditoria, A10 — média.

**Apontamento:** a ordem dos eventos podia alterar materialmente o resultado; no teste original, R$ 9.125 por R$ 100 mil com reajuste de 10%.

**Sugestão:** parametrizar ou documentar uma convenção.

**Decisão:** **parametrizar**:
- reajuste antes da contemplação;
- contemplação antes do reajuste.

Não escolhemos uma delas como “verdade da Bamaq”.

**Motivação:** a ordem real depende de data-base e assembleia, ainda não confirmadas.

**Validação posterior:** A07 e A08 da segunda auditoria passaram para as duas ordens.

**Estado:** **IMPLEMENTADO DE OUTRA FORMA E REAUDITADO.**

**Evidência posterior — 28/09/2026:** Michele confirmou a regra de 3% a.a. e a incidência econômica antes/depois da contemplação, mas não esclareceu a ordem dos eventos quando reajuste e contemplação caem no mesmo mês.

**Gatilho para revisão:** confirmação da data-base e da cronologia real da Bamaq; nessa ocasião, o default de ordem pode ser fixado e a opção configurável eventualmente mantida apenas como sensibilidade.

---

## 16. AUD-DEC-011 — A11 — Base matemática do rendimento no resgate

**Origem:** primeira auditoria, A11 — baixa.

**Apontamento:** rendimentos consumidos para pagar parcelas não entravam na base de rendimento acumulado usada pelo custo/IR do resgate.

**Decisão:** corrigir a base matemática, **sem afirmar que o imposto/custo realmente existe**.

**Implementação:** todo rendimento aferido é acumulado independentemente do destino.

**Validação posterior:** B07 confirmou que a base usada no teste de 15% coincide com a soma de todos os rendimentos aferidos.

**Decisão fiscal:** não assumir alíquota real; manter como sensibilidade.

**Estado:**  
- matemática: **IMPLEMENTADO E REAUDITADO**;
- tributação real: **ADIADO — DEPENDE DE EVIDÊNCIA EXTERNA**.

---



## 17. AUD-DEC-012 — A12 — Devolução do fundo de reserva

**Origem:** primeira auditoria, A12 — baixa.

**Decisão original:** não criar default de devolução sem base documental.

Essa decisão foi prudente porque não sabíamos:
- se haveria direito ao rateio;
- quanto sobraria;
- como o valor seria calculado.

**Evidência acumulada até 28/09/2026:**
- Michele confirmou que eventual saldo do Fundo de Reserva é distribuído proporcionalmente aos cotistas ativos;
- confirmou que os rendimentos das aplicações financeiras integram o próprio Fundo de Reserva;
- confirmou que cotas contempladas, utilizadas ou quitadas continuam elegíveis enquanto permanecerem ativas;
- Regulamento Geral Bamaq, art. 53, inclui expressamente os rendimentos das aplicações na formação do Fundo de Reserva;
- art. 55 prevê disponibilização do saldo remanescente aos ativos não excluídos/desistentes;
- Resolução BCB nº 285/2023 também prevê rateio dos saldos remanescentes.

**Nova decisão:**
- a existência do direito ao rateio está resolvida;
- o valor futuro continua incerto;
- não modelar o Fundo de Reserva como simples aplicação individual do 1% pago;
- manter um input de rateio terminal ou sensibilidade;
- permitir que cota quitada continue ativa para o encerramento;
- default 0% pode continuar apenas como stress conservador.

**Divergência de timing:**
Michele falou em encerramento contábil em até 120 dias e devolução até 60 dias depois. O Regulamento Geral Bamaq disponível determina comunicação/disponibilização dos saldos em até 60 dias da última assembleia e encerramento contábil em até 120 dias da última assembleia.

**Decisão:** não incorporar `120 + 60 dias` sem confirmação formal de regra operacional mais recente.

**Estado:** **DIREITO AO RATEIO CONFIRMADO; VALOR E TIMING EXATO AINDA INCERTOS.**

## 18. AUD-DEC-013 — A13 — Cashback

**Origem:** primeira auditoria, A13 — baixa.

**Decisão histórica:** tratar cashback como entrada separada, não como redução retroativa das obrigações do mês.

Essa parte continua correta:
- cashback não é aporte próprio;
- depois de recebido, vira caixa livre;
- não deve simultaneamente reduzir custo e aparecer como novo ativo.

**Evidência documental posterior — Regulamento da Campanha QuintoAndar/Bamaq:**
- item 4.1.2: pagamento em conta em até 5 dias úteis após registro da alienação e pagamento do crédito ao vendedor;
- item 4.1.3: regra geral de 10% sobre crédito liberado;
- item 4.1.3.1: desde 16/06/2026, se o imóvel vale pelo menos o crédito contratado, a base pode ser o crédito total contratado, não o efetivamente liberado;
- item 4.1.4: uso livre do dinheiro após recebimento.

**Resposta comercial de Michele:**
- confirmou livre movimentação;
- informou 10% sobre crédito efetivamente utilizado;
- informou 7 dias úteis;
- afirmou ausência de teto monetário;
- afirmou isenção de IR.

**Reconciliação:**
- “sempre crédito efetivamente utilizado” está incompleto por causa da exceção formal de 16/06/2026;
- “7 dias úteis” diverge dos 5 dias úteis do regulamento;
- uso livre está confirmado;
- tratamento fiscal não está definido no regulamento e requer fonte fiscal própria.

**Decisão atual:**
- manter cashback separado das obrigações da compra;
- alterar o timing-alvo para refletir pagamento posterior à compra;
- implementar a exceção de base promocional;
- não declarar isenção fiscal sem confirmação externa.

**Estado:** **REGRA DOCUMENTAL MAIS PRECISA QUE A RESPOSTA COMERCIAL; V2.54 PRECISA DE REVISÃO EM BASE E TIMING.**


## 19. AUD-DEC-014 — A14 — Taxa e tributação da cessão da cota

**Origem:** primeira auditoria, A14 — baixa.

**Apontamento original:** a taxa de transferência era modelada sobre a proposta/oferta e a auditoria sugeriu tornar a base configurável; também sugeriu usar tributação como sensibilidade.

**Decisão original:** não impor base/taxa fiscal sem evidência.

Essa decisão foi correta.

**Evidência posterior — 28/09/2026:**
Michele informou:
- R$ 150 de análise/cadastro;
- 1% de taxa de transferência;
- teto de R$ 1.000;
- base no valor atualizado da carta;
- ausência de isenção QuintoAndar.

**Verificação no Regulamento Geral Bamaq 2026:**
- art. 13, VIII: taxa de cadastro de R$ 150;
- art. 13, XIV: taxa de transferência = **1% do saldo devedor da conta de consórcio**, limitada a R$ 1.000;
- art. 60: transferência exige aprovação formal da Bamaq e análise cadastral do cessionário.

Portanto, a Michele acertou percentual e teto, mas errou a base ao dizer “valor total do crédito atualizado”.

**Verificação no Regulamento da Campanha QuintoAndar:**
O item 4.2.4 prevê uma isenção da taxa de transferência, mas somente para a operação promocional específica em que o QuintoAndar compra uma cota NÃO contemplada elegível após pelo menos 60 contribuições.

Logo:
- cessão normal de cota contemplada a terceiro → taxa geral Bamaq;
- venda promocional de cota não contemplada ao QuintoAndar → isenção específica.

**Decisão atual de modelagem:**
- substituir `min(Oferta × pct, teto)` por `min(SaldoDevedor × 1%, R$1.000)` na próxima versão;
- separar taxa de cadastro R$150;
- não aplicar isenção promocional à cessão contemplada;
- criar evento separado para a liquidez promocional do QuintoAndar;
- tributação da cessão continua pendente e não deve receber default de 15% sem validação fiscal.

**Estado:** **BASE E TETO DA TARIFA RESOLVIDOS DOCUMENTALMENTE; FISCALIDADE CONTINUA PENDENTE.**

## 20. AUD-DEC-015 — A15 / B8 — Clamps, limites e pisos

**Origem:** primeira auditoria A15; segunda auditoria B8/Q06.

**Primeira auditoria:** limites do HTML podiam ser burlados no código.

**Decisão:** aplicar `clamp` no motor, não apenas na interface.

**Segunda auditoria:** os testes de lance/embutido passaram, mas foi encontrado outro tipo de piso perigoso:
- Q06: quando custos da cessão superavam a proposta, uma parte da perda era truncada.

**Follow-up V2.54:** resultado líquido negativo da cessão vira `top-up` do bolso em vez de desaparecer.

**Decisão estratégica permanente:** todo novo `Math.max(0, ...)`, clamp ou piso em grandeza econômica deve ser tratado como ponto de auditoria: zerar uma variável só é aceitável se a diferença tiver contrapartida explícita.

**Estado:** **PARCIALMENTE REAUDITADO; Q06 CORRIGIDO NA V2.54, PENDENTE DE NOVO TESTE.**

---

## 21. AUD-DEC-016 — A16 — Inputs manuais não podem ser sobrescritos

**Origem:** primeira auditoria, A16 — baixa.

**Decisão:** separar estado calculado de input do usuário.

**Validação posterior:** A16-01 confirmou preservação dos valores digitados na sequência manual → travado → manual.

**Estado:** **IMPLEMENTADO E REAUDITADO.**

---

## 22. AUD-DEC-017 — A17 — `letterBalance` zero é valor válido

**Origem:** primeira auditoria, A17 — baixa.

**Decisão:** eliminar fallback por truthiness e usar `letterBalance` diretamente.

**Estado:** **IMPLEMENTADO E REAUDITADO.**

---

## 23. AUD-DEC-018 — A18 — Premissas implícitas

**Origem:** primeira auditoria, A18 — baixa.

O auditor destacou:
- base do lance;
- simplificação fiscal do aluguel;
- ausência de seguro;
- significado de `%CDB`;
- limites da inflação.

**Decisões subsequentes:**
- **base do lance:** mantida provisoriamente como percentual da carta no simulador; não alterada silenciosamente para saldo até confirmação contratual. **Atualização 28/09/2026:** Michele informou que essa base depende da modalidade: Lance Fixo de 30% usa a carta atualizada; Lance Livre usa o saldo devedor; o embutido usa a carta atualizada, até 30%. A decisão de não mudar silenciosamente a regra foi correta, mas agora existe evidência comercial suficiente para colocar a revisão do motor como prioridade alta, ainda sujeita à reconciliação da memória de cálculo;
- **fiscalidade do aluguel:** mantida como alíquota efetiva simplificada, não calculadora fiscal;
- **seguro:** desde V2.53 existe como sensibilidade configurável, default desligado. **Atualização 28/09/2026:** Michele e a Central de Ajuda Bamaq confirmam que o Seguro Prestamista é opcional; portanto o default desligado foi uma decisão correta. A fórmula real do prêmio continua pendente e os três modos existentes seguem apenas como sensibilidades;
- **TR no empréstimo:** desde V2.51 existe como sensibilidade independente, default 0%;
- **%CDB da carta:** posteriormente substituído conceitualmente pela regra de rendimento líquido da aplicação vinculada;
- **uso do rendimento para parcela:** confirmado comercialmente em 28/09/2026, com solicitação mensal pelo app e restrição à própria cota.

**Estado:** **PARCIAL / DOCUMENTAÇÃO CONTÍNUA.**

---

## 24. AUD-DEC-019 — R1 — Rendimento da carta contemplada

**Origem:** primeira auditoria, R1 — risco de premissa.

**Evidência original:** no default, aproximadamente:
- 98% do CDB → Δ **+R$ 1,30 milhão**;
- 0% de rendimento → Δ **−R$ 3,77 milhões**.

O auditor destacou três hipóteses decisivas:
1. rendimento da carta por período muito longo;
2. possibilidade de usar rendimento para pagar parcelas;
3. ausência de IR/taxa relevante sobre o rendimento.

**Decisão:** não “resolver” isso no código como se fosse fato. Criar ferramenta de sensibilidade.

**Implementação:** gráfico Δ × `% do CDB da carta`, com 0%, hipótese corrente, 100% e break-even aproximado.

**Segunda auditoria:** SENS01–SENS03 passaram; no default o break-even ficou por volta de 71,6% do CDB.

**Evidência comercial posterior — 28/09/2026:** Michele informou que a cota contemplada recebe o rendimento líquido das aplicações vinculadas ao grupo, expresso comercialmente como uma faixa de percentual do CDI. Em uma resposta falou em 98%–105%; em outra, 80%–105%.

**Verificação regulatória posterior:** a Resolução BCB nº 285/2023, arts. 10, 16 e 17, confirma que os recursos vinculados à contemplação permanecem aplicados nos ativos permitidos e que o crédito deve ser acrescido dos **rendimentos líquidos financeiros** proporcionais ao período aplicado.

**Decisão após a verificação:**
- a existência de rendimento líquido deixa de ser apenas premissa comercial;
- separar definitivamente o retorno da carta do retorno do CDB benchmark na próxima arquitetura;
- não tratar qualquer percentual fixo do CDI como garantia contratual;
- manter a faixa como sensibilidade até reconciliar 98%–105% versus 80%–105%.

**Estado:**  
- existência e natureza líquida dos rendimentos: **CONFIRMADAS REGULATORIAMENTE**;
- faixa efetiva em % CDI: **PENDENTE DE RECONCILIAÇÃO**;
- implementação V2.54 `% do CDB`: **LEGADO A SUBSTITUIR**.

---

# PARTE III — SEGUNDA AUDITORIA

## 25. AUD-DEC-020 — B1 — `N` ausente no retorno de `runScenario`

**Origem:** segunda auditoria, B1 — alta.

**Efeito observado na V2.53:**
- cerca de 10 KPIs apareciam como “—”;
- texto do patrimônio real mostrava “NaN anos”;
- warnings dependentes do horizonte não apareciam;
- em um teste, sobravam aproximadamente R$ 128 mil de empréstimo depois do horizonte sem alerta.

**Diagnóstico:** o motor calculava corretamente o Δ e o patrimônio; o problema era de estado retornado à camada de apresentação.

**Decisão:** corrigir imediatamente.

**Implementação V2.54:** `runScenario()` retorna `N`.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA.**

---

## 26. AUD-DEC-021 — B2 — Break-even com resgate incompatível

**Origem:** segunda auditoria, B2 — alta.

**Efeito observado:** a curva variava o mês de contemplação, mas mantinha o mês de resgate da configuração original. Em cenários inválidos o resgate podia:
- ocorrer antes da contemplação;
- violar os 6 meses mínimos;
- gerar Δ de aproximadamente **−R$ 10,47 milhões**.

**Decisão:** o cenário hipotético deve continuar sendo internamente possível.

**Implementação V2.54:**
- `minRedeemForScenario = cont + 6`;
- preserva o mês configurado apenas quando continua válido;
- caso contrário, desloca o resgate para o mínimo permitido;
- se ultrapassar o horizonte, o resgate fica fora da simulação.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA.**

---

## 27. AUD-DEC-022 — B3 — `cfg.redeemRaw` inexistente

**Origem:** segunda auditoria, B3 — alta.

**Efeito observado:** com resgate ativo, painel de cessão mostrava:
- mês `NaN`;
- crédito R$ 0;
- oferta mínima R$ 0;
- status falso “vender ≥ carregar”.

**Decisão:** corrigir referência e usar a configuração corrente de resgate.

**Implementação V2.54:** painel usa `cfg.redeemMonth`.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA.**

---

## 28. AUD-DEC-023 — B4 — Ausência de janela para venda da carta

**Origem:** segunda auditoria, B4 — média.

**Efeito observado:** se a compra ocorria no próprio mês da contemplação, o painel inventava uma “venda” com crédito zero.

**Decisão:** não criar cenário fictício para preencher o painel.

**Implementação V2.54:** quando `latest < cont`, o painel:
- desabilita o slider;
- exibe “sem janela”;
- não calcula proposta mínima;
- mostra status **“sem janela válida para venda”**.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA.**

---

## 29. AUD-DEC-024 — B5 — Timing da venda/cessão da carta

**Origem:** segunda auditoria, B5 — média.

**Teste Q02 na V2.53:**
- esperado com convenção de fim de mês: Δ ≈ **−R$ 3.017**;
- obtido: Δ ≈ **−R$ 2.486**;
- diagnóstico: dinheiro da cessão rendia já no próprio mês.

**Decisão:** todas as entradas extraordinárias seguem a mesma convenção de fim de mês.

**Implementação V2.54:**
1. caixa já existente capitaliza;
2. depois entram cessão, resgate, venda do imóvel e cashback;
3. esses valores passam a render no mês seguinte.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA.**

---


## 30. AUD-DEC-025 — B6 / P01 — Carta mantida até o encerramento

**Origem:** segunda auditoria, B6 / P01.

**Achado original:** manter carta até N não sofria o haircut configurado no resgate, enquanto resgatar no mês N sofria.

**Decisão original:** não aplicar automaticamente 15% ao patrimônio terminal sem evidência.

**Evidência acumulada posterior:**
- regulamentação confirma que o crédito recebe rendimentos líquidos;
- Michele afirma ausência de imposto/multa adicional no recebimento;
- Resolução BCB nº 285/2023 e Regulamento Bamaq confirmam disponibilização em espécie de créditos não utilizados no encerramento para consorciados elegíveis;
- eventual saldo remanescente de fundo comum/reserva é rateado separadamente.

**Questão que permanece:**
Michele afirmou que, no encerramento, a própria administradora liquidaria eventual saldo devedor com recursos da cota e pagaria apenas o líquido. O Regulamento Geral consultado, porém, condiciona o recebimento em espécie à quitação das obrigações e não descreve claramente esse netting automático.

**Decisão atual:**
- não aplicar haircut de 15%;
- separar encerramento de resgate pós-180 dias;
- não assumir compensação automática do saldo até confirmação formal;
- incluir futuro rateio de fundo de reserva como fluxo distinto.

**Estado:** **HAIRCUT REJEITADO COM MAIS CONFIANÇA; MECÂNICA DE LIQUIDAÇÃO NO ENCERRAMENTO AINDA EM RECONCILIAÇÃO.**

## 31. AUD-DEC-026 — B7 — Aviso de “carta única equivalente”

**Origem:** segunda auditoria, B7 — baixa.

**Apontamento:** a interface não deixava suficientemente claro que a V2.53 não modelava N cotas independentes.

**Decisão:** corrigir imediatamente porque é uma limitação estrutural com impacto de interpretação.

**Implementação V2.54:** aviso explícito no topo informa que:
- o simulador representa uma única carta equivalente;
- não representa contemplações/lances/saldos/rendimentos independentes;
- uso para operação real com múltiplas cotas é apenas exploratório.

**Estado:** **IMPLEMENTADO — PENDENTE DE REAUDITORIA.**

---

## 32. AUD-DEC-027 — B8 / Q06 — Pisos que escondem perdas

**Origem:** segunda auditoria, B8; cenário Q06.

**Q06 na V2.53:**
- cessão com custos adicionais equivalentes a 120% da proposta;
- esperado: Δ **−R$ 60 mil**;
- obtido: Δ **−R$ 50 mil**;
- parte da perda era truncada.

**Decisão:** qualquer valor líquido negativo precisa virar obrigação/aporte, não zero silencioso.

**Implementação V2.54:** se `proceeds < 0`, a diferença vira `quotaSaleTopUp` e entra em `cashObrigacoes`.

**Decisão de processo:** manter B8 como regra de auditoria geral, mesmo após corrigir Q06.

**Estado:** **Q06 IMPLEMENTADO — PENDENTE DE REAUDITORIA; B8 PERMANECE COMO CONTROLE CONTÍNUO.**

---

## 33. AUD-DEC-028 — B9 — “Teto = 0” significa “sem teto”

**Origem:** segunda auditoria, B9 — baixa.

**Apontamento:** semanticamente, um campo “teto” com valor zero pode ser entendido como teto R$ 0, enquanto o código usa `0` como ausência de teto.

**Decisão:** não alterar o motor financeiro nesta rodada.

**Possível solução futura:**
- checkbox “sem teto”; ou
- texto explícito “0 = sem teto”.

**Estado:** **PENDENTE — UX / BAIXA PRIORIDADE.**

---

## 34. AUD-DEC-029 — B10 — Convenções do seguro

**Origem:** segunda auditoria, B10 — baixa.

**Resultado técnico:** F01–F08 passaram:
- seguro desligado;
- valor fixo;
- % da parcela;
- % do saldo;
- resgate;
- venda com quitação/troca de garantia;
- saldo zerado;
- invariante de valor futuro dos prêmios.

**Decisão:** manter a implementação, mas **não apresentá-la como regra do produto real**.

Regras atuais são sensibilidades:
- fixo mensal;
- % da parcela bruta;
- % do saldo devedor;
- default desligado.

**Estado:**  
- matemática: **IMPLEMENTADO E REAUDITADO**;
- regra contratual: **ADIADO — EVIDÊNCIA EXTERNA**;
- documentação: **CONTÍNUA**.

---

## 35. AUD-DEC-030 — B11 — TIR indefinida

**Origem:** segunda auditoria, B11 — baixa.

**Apontamento:** quando a TIR não existe, a interface mostra apenas “—”.

**Decisão:** não mexer no motor; resultado `null` é apropriado. Melhorar apenas a explicação ao usuário.

**Possível texto futuro:** “TIR não definida para esta série de fluxos.”

**Estado:** **PENDENTE — UX / BAIXA PRIORIDADE.**

---

# PARTE IV — ACHADOS DE PREMISSA E DECISÕES ESTRATÉGICAS

## 36. AUD-DEC-031 — M01/M02 — Carta única equivalente versus múltiplas cotas

**Origem:** segunda auditoria.

### M01 — caso linear

Sete cotas idênticas, contempladas no mesmo mês, reproduziram exatamente a carta única equivalente:

- soma dos Δ = Δ da carta única.

Isso confirma que a agregação é matematicamente válida **quando o timing e as regras são iguais**.

### M02 — contemplações heterogêneas

Exemplo ilustrativo:
- 7 cotas de aproximadamente R$ 195.714;
- contemplações nos meses 12, 30, 60, 90, 120, 150 e 180;
- lance de 30% embutido em cada.

Resultado:
- soma dos Δ ≈ **−R$ 538.562**;
- aportes ≈ **R$ 580.358**;
- carta única contemplada no mês 12: Δ ≈ **+R$ 1.300.716**;
- aportes ≈ **R$ 48.734**.

**Evidência comercial posterior — 28/09/2026:** Michele informou que a proposta real de R$ 1,37 milhão seria estruturada em **quatro cotas** (R$ 400 mil + R$ 400 mil + R$ 370 mil + R$ 200 mil), todas podendo ficar no mesmo grupo, com números próprios e contemplação individual. Ela confirmou também a possibilidade de ofertar lance nas quatro na mesma assembleia e de mais de uma cota do mesmo titular ser contemplada na mesma assembleia.

O exemplo de sete cotas acima continua válido como teste matemático da auditoria, mas **não representa mais a composição comercial esperada da operação**.

**Decisão estratégica:** a carta única equivalente continua disponível na V2.54 como ferramenta exploratória, mas **não é mais considerada suficiente para representar a operação real com múltiplas contemplações**. A arquitetura futura deve ter como primeiro cenário realista as quatro cotas informadas.

**Evidência comercial posterior:** a operação pode utilizar apenas um subconjunto das cotas já contempladas para comprar o primeiro imóvel, deixando as demais concorrendo. Isso torna ainda mais necessário modelar vínculo `cota → imóvel/garantia`.

**Próximo marco arquitetural:** N cotas independentes, cada uma com:
- valor;
- saldo;
- contemplação;
- lance;
- embutido;
- empréstimo;
- rendimento;
- parcela;
- uso do crédito.

**Estado:** **DECISÃO ESTRATÉGICA DE ARQUITETURA.**

---

## 37. AUD-DEC-032 — P02 — Reajuste e CDB como riscos de cenário

**Origem:** segunda auditoria, P02.

Resultados informativos no default:

### Reajuste
- 3% a.a. → Δ ≈ **+R$ 1.300.716**
- 6% a.a. → Δ ≈ **+R$ 351.564**
- 8% a.a. → Δ ≈ **−R$ 483.800**

### CDB
- 11,5% a.a. → Δ ≈ **+R$ 1.300.716**
- 9% a.a. → Δ ≈ **+R$ 396.785**
- 7% a.a. → Δ ≈ **−R$ 80.735**

**Evidência comercial posterior — 28/09/2026:** Michele informou reajuste **fixo de 3% a.a.** para as cotas do mesmo grupo da proposta. Isso dá suporte comercial ao valor atualmente usado como default, embora data-base, incidência exata e comportamento pós-contemplação ainda devam ser confirmados documentalmente.

**Decisão:** manter 3% a.a. como default da V2.54 e não alterar a fórmula de reajuste até recebermos a mecânica completa. O nível futuro do CDB continua sendo premissa macroeconômica.

**Próxima evolução desejável:** matriz de sensibilidade conjunta:

`Δ = f(CDB, reajuste do consórcio)`

**Estado:** **RISCO DE PREMISSA / PENDÊNCIA ALTA.**

---

## 38. AUD-DEC-033 — TR do empréstimo

**Origem:** evolução pós-primeira auditoria, auditada na segunda rodada.

**Decisão:** oferecer TR como **sensibilidade opcional**, default 0%, sem afirmar que o empréstimo real é corrigido por TR.

**Regra modelada:**
- TR anual → equivalente mensal;
- corrige saldo antes dos juros;
- juros e correção monetária apresentados separadamente.

**Segunda auditoria:** todos os testes Price/SAC + TR passaram, inclusive:
- juros zero;
- juros + TR;
- prazo curto;
- prazo longo;
- quitação no resgate;
- quitação na venda;
- identidade principal + juros + TR = pagamentos + saldo.

**Decisão de negócio/modelagem:** manter o recurso, mas a taxa real e o indexador real permanecem pendentes do contrato do banco.

**Estado:** **IMPLEMENTADO E REAUDITADO; PREMISSA CONTRATUAL ABERTA.**

---

## 39. AUD-DEC-034 — Seguro / proteção financeira

**Origem:** A18 + evolução V2.53, auditada na segunda rodada.

**Decisão:** oferecer capacidade de simulação antes de saber a regra real, mas:
- default desligado;
- três bases genéricas;
- aviso de que é sensibilidade.

**Segunda auditoria:** F01–F08 validaram o efeito econômico e o timing adotado.

**Decisão de negócio/modelagem:** não criar prêmio default nem dizer que o seguro é obrigatório.

**Estado:** **IMPLEMENTADO E REAUDITADO; PREMISSA CONTRATUAL ABERTA.**

---

# PARTE V — CONVENÇÕES DELIBERADAS ATUALMENTE EM VIGOR

## 40. Convenções temporais

Salvo mudança explicitamente documentada:

1. a parcela do mês da contemplação ainda é a parcela reduzida;
2. a nova parcela pós-contemplação vale a partir do mês seguinte;
3. a primeira prestação do empréstimo do lance ocorre no mês seguinte à contemplação;
4. a compra do imóvel ocorre no fim do mês;
5. o aluguel começa no mês seguinte à compra;
6. compra e venda no mesmo mês não geram aluguel;
7. caixa já existente capitaliza primeiro;
8. aportes e entradas extraordinárias de fim de mês passam a render no mês seguinte;
9. cashback não retroage para reduzir obrigações do próprio mês;
10. desde V2.54, cessão da carta segue a mesma convenção de fim de mês;
11. reajuste × contemplação no mesmo mês permanece configurável até confirmação contratual.

Essas regras são **decisões conscientes de modelagem**, não acidentes de implementação.

---

## 41. Convenções de patrimônio e métricas

1. patrimônio comparável pré-contemplação é ocultado, não marcado a zero;
2. imóvel mantido tem valor bruto informativo e valor líquido de realização para comparação;
3. “equivalente anual do múltiplo real” não é TIR;
4. TIR real usa fluxos temporais reais;
5. TIR inexistente retorna valor indefinido; falta apenas explicação melhor na UI;
6. dinheiro emprestado não é aporte próprio;
7. cashback não é aporte próprio;
8. rendimento da carta usado para parcela não é aporte próprio;
9. toda obrigação efetivamente bancada pelo usuário deve ter contrapartida no benchmark.

---

## 42. Convenções propositalmente conservadoras

Até haver evidência melhor:

- fundo de reserva é tratado como custo, sem devolução presumida;
- crédito residual é preservado, mas sem remuneração/destinação automática;
- não aplicamos haircut fiscal inventado à carta mantida no encerramento;
- não impomos 15% de IR na cessão como verdade;
- seguro permanece desligado por padrão;
- TR permanece 0% por padrão;
- carta única equivalente é apenas exploração quando a operação real tiver várias cotas.

---

# PARTE VI — ITENS QUE UMA FUTURA AUDITORIA NÃO DEVE “REDESCOBRIR” COMO BUG SEM CONTEXTO

## 43. Decisões que podem parecer estranhas no código, mas são intencionais

### 43.1 Patrimônio ausente antes da contemplação
Não é esquecimento. É uma escolha para não inventar valor de desistência.

### 43.2 Crédito residual sem rendimento
Não é afirmação de que ele “não rende”. É ausência deliberada de uma regra ainda não confirmada.

### 43.3 Fundo de reserva sem devolução
É uma postura conservadora temporária, não uma afirmação contratual.

### 43.4 Ordem reajuste/contemplação configurável
A ferramenta não escolhe uma verdade porque a cronologia real ainda não foi confirmada.

### 43.5 Taxas fiscais parametrizadas
Alíquotas em campos de sensibilidade não devem ser confundidas com conclusão tributária.

### 43.6 TR e seguro
A existência da funcionalidade não significa que a operação real terá TR ou seguro.

### 43.7 Carta única equivalente
Até V2.54 é uma simplificação explicitamente assumida. A segunda auditoria mostrou que ela não representa bem contemplações heterogêneas.

### 43.8 Haircut terminal da carta
Não aplicar automaticamente o “IR/custo de 15%” é uma decisão consciente enquanto não sabemos a regra de liquidação no encerramento.

---

# PARTE VII — PONTOS A REVALIDAR NA PRÓXIMA AUDITORIA

## 44. Regressões prioritárias V2.54

A próxima execução independente deve confirmar especificamente:

- B1 / KPI01–KPI04: `N` retornado e KPIs/warnings preenchidos;
- B2 / BE01–BE02: break-even nunca resgata antes de `cont + 6`;
- B3 / Q04: painel da cessão com resgate ativo não produz `NaN`;
- B4 / Q05: ausência de janela de venda é explicitamente reconhecida;
- B5 / Q02: cessão rende apenas a partir do mês seguinte;
- Q06: custos superiores à proposta geram top-up integral;
- B7: aviso de carta única equivalente permanece visível.

Meta de regressão:
- transformar os **10 FALHA** da suíte V2.53 em **OK**;
- manter P01/B6 como **A CONFIRMAR**, até haver evidência externa;
- não quebrar os 81 testes que já estavam OK.

---

## 45. Pontos externos que continuam fora do alcance da auditoria puramente matemática

Mesmo com o código correto, uma decisão financeira real depende de confirmar:

- remuneração da carta contemplada;
- possibilidade de usar rendimentos para pagar parcelas;
- tributação/custos do rendimento;
- índice e regra de reajuste do grupo;
- saída da carta não utilizada no encerramento;
- fundo de reserva;
- crédito residual;
- base do lance;
- taxa e tributação da cessão;
- seguro real;
- indexador/CET real do empréstimo;
- combinação e independência de múltiplas cotas;
- cashback em múltiplas cotas;
- substituição de garantia.

Esses pontos pertencem ao arquivo de pendências e devem ser convertidos em regras apenas quando houver evidência suficiente.

---


# PARTE VIII — VALIDAÇÃO COMERCIAL PÓS-AUDITORIAS

## 46. Rodada de respostas da vendedora — 28/09/2026

**Fonte:** resposta escrita de Michele Ramalho Coelho (QuintoAndar/Bamaq).

**Natureza da evidência:** confirmação comercial escrita. É mais forte do que uma hipótese interna, mas não substitui contrato/regulamento da administradora em pontos de alto impacto.

### EVID-001 — Estrutura real da operação

Informado:
- limite máximo comercial por cota: R$ 400.000;
- operação de R$ 1,37 milhão: 4 cotas de R$ 400 mil, R$ 400 mil, R$ 370 mil e R$ 200 mil;
- possibilidade de alocar todas no mesmo grupo, como o 4012;
- cotas novas de lançamento;
- regras informadas para o grupo: 214 meses, 24% de administração, 1% de fundo de reserva e 3% a.a. fixos de reajuste.

**Efeito nas decisões:** fortalece a prioridade da arquitetura multi-cota e fornece um primeiro preset realista para ela. A resposta posterior sobre entrada em grupo já em andamento confirmou que os 214 meses são o prazo remanescente da nova cota e que os 25% de encargos são integralmente diluídos nesse prazo; ver EVID-026.

### EVID-002 — Independência operacional das cotas

Informado:
- cada cota recebe identificação própria;
- sorteios e lances são tratados individualmente;
- uma cota pode contemplar antes das demais;
- mais de uma cota do mesmo CPF pode contemplar na mesma assembleia;
- é possível ofertar lance nas quatro cotas na mesma assembleia;
- contemplação simultânea por lance depende também de disponibilidade do Fundo Comum.

**Efeito nas decisões:** a futura versão multi-cota precisa manter estado, lance e mês de contemplação próprios por cota. Não assumir uma única contemplação agregada.

### EVID-003 — Crédito contemplado aplicado

Informado:
- se uma cota contemplar antes das outras, seu crédito fica em “conta de investimento exclusiva”;
- rendimento informado: 98% a 105% do CDI, “de forma líquida”;
- o crédito pode ficar investido enquanto se aguardam as outras cotas para compra conjunta.

**Efeito nas decisões:** confirma comercialmente a existência de remuneração, mas mostra que a V2.54 não descreve perfeitamente a regra ao usar `% do CDB`. Não alterar o motor até esclarecer o critério da faixa, aplicação, custodiante, tributação/taxas e duração.

---


### EVID-004 — Bases distintas para Lance Fixo, Livre e Embutido

Informado por Michele em 28/09/2026:
- Lance Fixo de 30% → base no valor atualizado da carta;
- Lance Livre → base no saldo devedor;
- embutido → até 30% do valor atualizado da carta;
- apuração individual por cota;
- possibilidade de ofertar nas quatro cotas na mesma assembleia;
- contemplação de 1 a 4 cotas conforme competitividade e disponibilidade do Fundo Comum.

**Efeito nas decisões:** a V2.54 possui divergência conhecida para Lance Livre, porque usa `% da carta` para o lance total. A próxima revisão do motor deve introduzir modalidade e base de cálculo próprias.

**Estado:** CONFIRMAÇÃO COMERCIAL ESCRITA; REGRA FORMAL E DETALHES OPERACIONAIS AINDA PENDENTES.

### EVID-005 — Memória comercial da cota de R$ 400 mil

Informado:
- carta R$ 400 mil;
- saldo inicial R$ 500 mil;
- 214 meses;
- parcela integral R$ 2.336,40;
- reduzida R$ 1.167,60;
- contemplação na 4ª parcela;
- lance livre de 45%, com 10% embutido e aproximadamente R$ 180 mil em dinheiro;
- crédito líquido R$ 360 mil;
- nova parcela R$ 1.302 por 209 meses.

**Reconciliação preliminar:**
- saldo inicial de R$ 500 mil é coerente com 25% de encargos;
- parcela integral é coerente, por arredondamento, com R$ 500 mil / 214;
- parcela reduzida informada não é exatamente 50% da parcela integral;
- a contagem de 209 meses não decorre diretamente de 214 menos 4;
- os aproximadamente R$ 180 mil em dinheiro fazem sentido se 45% for sobre saldo devedor e o embutido de R$ 40 mil for subtraído em valor, mas não como “35% da carta”.

**Decisão:** usar o exemplo como evidência de direção da regra, não como memória matemática definitiva. Não alterar fórmula pós-contemplação nem cronologia até receber cálculo oficial detalhado.

**Estado:** EVIDÊNCIA COMERCIAL ÚTIL, MAS COM INCONSISTÊNCIAS/ARREDONDAMENTOS A ESCLARECER.

---


### EVID-006 — Aplicação dos recursos e rendimento líquido

**Resposta de Michele:**
- recursos do grupo ficam segregados do caixa da administradora/parceiro;
- crédito contemplado não utilizado é aplicado com alta liquidez;
- aplicações mencionadas: títulos públicos/compromissadas e fundos de renda fixa;
- rendimento efetivo é repassado de forma líquida;
- não há taxa adicional de gestão financeira sobre o rendimento.

**Verificação oficial:**
- Lei nº 11.795/2008: grupo possui patrimônio próprio e recursos contabilizados separadamente;
- Resolução BCB nº 285/2023, art. 10: recursos só podem ser aplicados em títulos públicos federais/compromissadas e determinados fundos abertos de renda fixa;
- art. 16: recursos vinculados à contemplação permanecem aplicados até a utilização;
- art. 17: crédito do contemplado deve ser acrescido dos rendimentos líquidos financeiros.

**Correções de linguagem:**
- preferir “patrimônio próprio/segregado do grupo” à expressão informal “patrimônio de afetação”;
- “fundo dedicado” não deve ser entendido como “fundo exclusivo”, pois fundos exclusivos são vedados pela Resolução;
- referência a Itaú Premium é plausível como exemplo de fundo RF Referenciado DI, mas ainda não prova que seja o fundo efetivamente utilizado pelo Grupo 4012.

**Estado:** REGRA GERAL CONFIRMADA; APLICAÇÃO ESPECÍFICA DO GRUPO AINDA A DOCUMENTAR.

### EVID-007 — Regra dos 180 dias: referência normativa atual

Michele citou a Circular BCB nº 3.432/2009 para o recebimento em dinheiro após 180 dias.

**Verificação:**
- a regra substantiva está correta;
- a Circular nº 3.432 foi revogada a partir de 1º/07/2024;
- a regra atual está na Resolução BCB nº 285/2023, art. 15, §2º;
- exige crédito ainda não utilizado e quitação das obrigações financeiras com o grupo e a administradora.

**Decisão documental:** futuras referências do simulador e dos documentos devem citar a Resolução BCB nº 285/2023, não a Circular revogada.

**Estado:** REGRA CONFIRMADA; FONTE NORMATIVA ATUALIZADA.

### EVID-008 — Divergência 98%–105% versus 80%–105% do CDI

A mesma fonte comercial informou duas faixas diferentes em respostas sucessivas:
- 98%–105% do CDI líquido;
- aproximadamente 80%–105% do CDI líquido.

**Decisão:** não escolher silenciosamente uma faixa. Registrar pergunta de reconciliação e manter o software preparado para sensibilidade ampla.

**Estado:** ABERTO / RECONCILIAÇÃO NECESSÁRIA.

---


### EVID-009 — Uso do rendimento para pagar a parcela da própria cota

Michele confirmou em 28/09/2026:
- o rendimento mensal da carta contemplada pode quitar até 100% da parcela da própria cota;
- quando o rendimento supera a parcela, o excedente permanece acumulado no crédito;
- o consorciado precisa solicitar esse uso mensalmente pelo aplicativo;
- o rendimento de uma cota não pode ser usado para pagar parcelas de outra.

**Comparação com a V2.54:**
A fórmula central já estava correta:
`yieldUsed = min(monthlyLetterYield, installment)`
e o excedente era capitalizado.

Duas limitações ficaram explicitadas:
1. o software assume solicitação automática todos os meses, enquanto a operação real exige ação mensal do usuário;
2. a carta única equivalente não consegue impor a vedação de compensação cruzada entre cotas.

**Decisão:**
- manter a fórmula atual como representação de “aderência perfeita” na V2.54;
- atualizar a documentação para deixar essa premissa explícita;
- na arquitetura multi-cota, transformar a restrição “rendimento só paga a própria cota” em invariante obrigatório;
- não criar pooling de rendimentos entre cotas.

**Estado:** REGRA OPERACIONAL PRINCIPAL CONFIRMADA COMERCIALMENTE; DETALHES DE CUTOFF/ADERÊNCIA AINDA ABERTOS.

---


### EVID-010 — Reajuste fixo de 3% antes e depois da contemplação

Michele confirmou em 28/09/2026:
- reajuste fixo de 3% a.a.;
- antes da contemplação, o reajuste corrige o valor do crédito e as parcelas;
- depois da contemplação, o saldo devedor continua recebendo 3% a.a.;
- a carta contemplada deixa de seguir o reajuste do consórcio e passa a render pela aplicação vinculada ao CDI.

**Comparação com a V2.54:** a regra econômica central já estava alinhada ao comportamento descrito.

**Decisão:**
- manter 3% a.a. como default do produto/proposta;
- manter carta pós-contemplação separada do reajuste do saldo;
- não remover ainda a opção de ordem reajuste × contemplação, porque Michele não respondeu qual evento ocorre primeiro quando coincidem no mesmo mês;
- não tratar a frase comercial “sabe exatamente quanto vai pagar do início ao fim” como especificação financeira, pois contemplação/lance alteram a trajetória das parcelas.

**Estado:** REGRA PRINCIPAL CONFIRMADA COMERCIALMENTE; CRONOLOGIA ANUAL AINDA PARCIALMENTE ABERTA.

---


### EVID-011 — Combinação de várias cartas no mesmo imóvel

Michele confirmou:
- é permitido reunir várias cotas contempladas para comprar um único imóvel;
- as cotas podem vir de grupos diferentes da Bamaq;
- é possível usar apenas as cotas já contempladas e completar a diferença com recursos próprios.

**Verificação documental:** o Regulamento Geral 2025 da Bamaq, art. 8º, XI, prevê expressamente a reunião de créditos para aquisição de bem de valor superior, com cotas do mesmo grupo ou de grupos diferentes.

**Decisão:** essa regra deixa de ser pendência e passa a requisito da futura arquitetura multi-cota.

**Estado:** CONFIRMADO COMERCIAL E DOCUMENTALMENTE.

### EVID-012 — Uso de cotas posteriores após compra feita com parte das cotas

Michele informou que cotas contempladas posteriormente não poderiam ser usadas para “pagar a si mesmo” nem para abater a alienação do mesmo imóvel, sugerindo compra de outro imóvel ou quitação/amortização de outro financiamento.

**Verificação documental:** há uma nuance material. O Regulamento Geral da Bamaq, art. 8º, XII e XIII, permite ao consorciado contemplado optar pela **quitação total de financiamento ou consórcio de sua titularidade**, da mesma categoria, sujeita à anuência da administradora e desde que o saldo devedor seja menor ou igual ao crédito. A Resolução BCB nº 285/2023 também enquadra consórcio já utilizado como “financiamento” para essa finalidade.

**Interpretação atual:**
- a vedação a “pagar a si mesmo” na compra é plausível;
- amortização parcial com nova carta não está confirmada;
- mas uma proibição absoluta de usar carta posterior na obrigação já existente não deve ser registrada, porque a quitação total de consórcio próprio está prevista no regulamento.

**Decisão:** não hard-code a resposta comercial como proibição. Abrir pergunta formal sobre quitação total do consórcio das primeiras cotas usando cartas posteriores.

**Estado:** CONTRADIÇÃO / RECONCILIAÇÃO NECESSÁRIA — ALTA PRIORIDADE.

### EVID-013 — Alegação de limite de 150 cotas por CPF

Michele mencionou “limite regulamentar” de até 150 cotas por CPF.

**Verificação oficial/documental:**
- Resolução BCB nº 285/2023, art. 9º: limite de 10% das cotas ativas de um mesmo grupo por consorciado;
- Regulamento Geral 2025 da Bamaq: também 10% por grupo;
- não foi localizada nessas fontes atuais uma regra geral de 150 cotas totais por CPF.

**Decisão:** não registrar 150 como regra normativa. Tratar como possível política interna/comercial até a fonte ser apresentada.

**Estado:** INFORMAÇÃO COMERCIAL NÃO CONFIRMADA / POSSÍVEL CONFLITO COM FORMULAÇÃO REGULATÓRIA.

---


### EVID-014 — Destino do crédito residual após compra de imóvel mais barato

Michele informou:
- até 10% do valor da carta pode ser usado para ITBI/escritura/registro;
- a sobra seria automaticamente destinada ao saldo devedor;
- poderia reduzir parcelas ou encurtar prazo;
- não haveria devolução direta em dinheiro após a compra;
- antes de fechar a compra, o saldo ainda não utilizado continuaria rendendo;
- não poderia ser usado para reforma livre ou móveis planejados.

**Verificação oficial — Resolução BCB nº 285/2023, art. 15, §3º:**
a diferença entre crédito e preço do bem é utilizada **a critério do consorciado** para:
1. despesas vinculadas ao bem/serviço, até 10% do crédito;
2. quitação de prestações vincendas conforme contrato;
3. devolução em espécie/transferência quando as obrigações financeiras com grupo e administradora estiverem quitadas.

**Verificação no Regulamento Geral Bamaq:**
- art. 8º, VIII, contém as mesmas três saídas;
- a quitação das prestações é prevista em ordem indireta;
- art. 15 prevê antecipação do saldo devedor em ordem indireta, inclusive com diferença de crédito.

**Conclusão:**
A resposta comercial está correta quanto ao uso de até 10% para despesas e quanto à possibilidade de destinar a sobra à dívida, mas é imprecisa em dois pontos:
- a destinação não é automaticamente imposta; a norma dá opções ao consorciado;
- devolução em dinheiro é possível quando as obrigações estiverem integralmente quitadas.

Também não há base suficiente, no regulamento geral consultado, para afirmar que o residual reduz o valor mensal das parcelas; a regra encontrada é antecipação em ordem indireta.

**Decisão de modelagem:**
- abandonar a convenção antiga de “residual congelado”;
- criar, na próxima versão, destino explícito do residual;
- não implementar automaticamente “reduzir parcela” até confirmação do Grupo 4012;
- permitir devolução em dinheiro somente sob a condição de quitação integral.

**Estado:** REGRA GERAL CONFIRMADA; DETALHES DO GRUPO E MULTI-COTA A CONFIRMAR.

---


### EVID-015 — Cashback: resposta comercial versus regulamento formal

Michele informou:
- 10% sobre crédito efetivamente utilizado;
- soma dos créditos usados quando várias cotas participam;
- sem teto monetário próprio;
- até 7 dias úteis;
- pagamento por PIX/conta com livre movimentação;
- “isento de IR”.

**Regulamento da Campanha:**
- pagamento em conta em até 5 dias úteis após registro da alienação e pagamento ao vendedor;
- regra geral de 10% sobre crédito liberado;
- exceção desde 16/06/2026: quando o imóvel vale pelo menos o crédito contratado, a base é o crédito total contratado e disposto na cota, não o efetivamente liberado;
- utilização livre do valor recebido;
- não há, no texto do regulamento, regra fiscal qualificando o cashback como isento.

**Decisão:**
- em conflitos, priorizar o regulamento formal;
- abrir reconciliação sobre base multi-cota/lance embutido e prazo 5×7 dias;
- tratar fiscalidade como pendência independente;
- revisar motor, pois a V2.54 usa apenas `credito_usado × 10%`.

**Estado:** REGRA PROMOCIONAL PARCIALMENTE CONFIRMADA; DIVERGÊNCIAS DOCUMENTAIS RELEVANTES.

### EVID-016 — Vigência da campanha

O regulamento disponível prevê adesões entre 01/09/2025 e 30/09/2026 e afirma que os benefícios permanecem exercíveis durante o prazo do consórcio para participantes elegíveis.

Como a análise está ocorrendo em 28/09/2026, a elegibilidade é uma questão temporal imediata.

**Decisão:** confirmar antes da contratação qual evento formal precisa ocorrer até 30/09/2026 e se existe prorrogação/aditivo mais recente.

**Estado:** URGENTE / A CONFIRMAR.

---


### EVID-017 — Resgate em dinheiro após 180 dias

Michele confirmou:
- espera mínima de 180 dias após contemplação;
- necessidade de quitação integral das obrigações antes do recebimento em dinheiro;
- ausência de simples cálculo automático “carta - saldo devedor” no resgate voluntário;
- ausência de multa específica;
- rendimentos já creditados de forma líquida.

**Verificação oficial:**
A Resolução BCB nº 285/2023, art. 15, §2º, e o FAQ do Banco Central confirmam que o crédito pode ser recebido em espécie após 180 dias apenas se as obrigações financeiras com grupo/administradora estiverem quitadas.

**Correção documental:**
Michele voltou a citar a Circular nº 3.432. A regra substantiva é equivalente, mas a referência vigente é a Resolução BCB nº 285/2023.

**Decisão de modelagem:**
O modo de resgate pós-180 dias deve exigir uma etapa explícita de quitação antes da liberação do crédito.

**Estado:** REGRA PRINCIPAL CONFIRMADA COMERCIAL E REGULATORIAMENTE.

### EVID-018 — Encerramento do grupo e fundo de reserva

Michele informou:
- no encerramento, saldo devedor poderia ser liquidado com recursos da própria cota e o líquido transferido ao consorciado;
- haveria devolução proporcional do Fundo de Reserva remanescente.

**Verificação formal:**
- Resolução BCB nº 285/2023, arts. 37–38: saldos remanescentes de fundo comum/reserva são rateados entre consorciados ativos e disponibilizados em espécie;
- Regulamento Geral Bamaq, art. 55: saldo remanescente do Fundo de Reserva é disponibilizado aos consorciados ativos;
- art. 61: crédito não utilizado é comunicado para recebimento em espécie ao consorciado ativo que tenha quitado suas obrigações.

**Reconciliação:**
A devolução do Fundo de Reserva está confirmada.
A compensação automática do saldo devedor com o crédito no encerramento NÃO está claramente prevista no regulamento consultado.

**Decisão:**
- incluir rateio de reserva como futura entrada terminal configurável;
- manter a liquidação automática do saldo como hipótese a confirmar, não regra.

**Estado:** RATEIO CONFIRMADO; NETTING NO ENCERRAMENTO A CONFIRMAR.

---


### EVID-019 — Fundo de Reserva: rendimentos, elegibilidade e prazo

Michele confirmou:
- saldo remanescente é devolvido proporcionalmente aos cotistas ativos;
- o Fundo de Reserva permanece aplicado e seus rendimentos integram o montante final;
- cotas contempladas, utilizadas ou quitadas permanecem elegíveis se continuarem ativas;
- cancelados/desistentes não participam do rateio final;
- o Fundo Itaú Premium foi citado como aplicação conservadora;
- prazo informado: até 120 dias para encerramento contábil + até 60 dias depois para devolução.

**Verificação no Regulamento Geral Bamaq vigente disponível:**
- art. 53: rendimentos das aplicações integram o Fundo de Reserva;
- art. 55: saldo remanescente é disponibilizado aos consorciados ativos não excluídos/desistentes;
- art. 61: comunicação/disponibilização dos saldos remanescentes em até 60 dias da última assembleia;
- art. 62: encerramento contábil em até 120 dias da última assembleia.

**Reconciliação:**
- natureza econômica do fundo e direito ao rateio: confirmados;
- elegibilidade de cotas quitadas: consistente com a resposta comercial e com a exclusão explícita apenas de desistentes/excluídos, mas vale manter rastreabilidade de status;
- prazo “120 + 60”: não coincide com o regulamento atual e deve ser confirmado;
- Itaú Premium: plausível, mas aplicação efetiva do Grupo 4012 ainda precisa de documento/CNPJ.

**Decisão de modelagem:**
- rateio terminal configurável;
- cota quitada permanece participante do grupo;
- não limitar taxa de rateio a 100% das contribuições;
- timing configurável até reconciliação.

**Estado:** REGRA ECONÔMICA CONFIRMADA; TIMING E APLICAÇÃO ESPECÍFICA EM RECONCILIAÇÃO.

---


### EVID-020 — Venda do imóvel antes da quitação e substituição de garantia

Michele informou:
- a Bamaq permite substituição de garantia;
- novo imóvel passa por análise jurídica, documental e vistoria;
- novo bem deve ter valor compatível com a dívida/crédito segundo análise patrimonial;
- custo de vistoria em torno de 1 salário mínimo, além de cartório;
- prazo médio total de 15–30 dias úteis;
- substituição/baixa precisam estar concluídas antes de liberar o imóvel original;
- alternativamente, comprador ou banco financiador pode quitar o saldo diretamente na Bamaq na própria venda.

**Verificação oficial Bamaq — Central de Ajuda QuintoAndar:**
- venda do bem alienado só é possível com cota quitada ou substituição de garantia;
- na substituição, o novo bem precisa estar quitado e registrado em nome do consorciado;
- somente após conclusão do processo a Bamaq retira a alienação do bem original.

**Regulamento Bamaq 2026:**
- art. 36: administradora pode recusar a garantia;
- art. 37: análise documental de garantias em até 5 dias úteis após entrega completa e emissão de documento para baixa de alienação/hipoteca;
- art. 38: substituição do bem em garantia é permitida mediante autorização prévia, com taxas/despesas a cargo do consorciado;
- art. 13: avaliação, registro, gravames e baixas podem gerar despesas ao consorciado.

**Pontos não formalmente confirmados:**
- fórmula objetiva do valor mínimo do novo imóvel;
- “1 salário mínimo” como preço atual da vistoria;
- 15–30 dias como SLA contratual;
- procedimento específico de interveniente quitante na venda.

**Decisão de modelagem:**
- manter os dois caminhos de venda: quitação e substituição;
- promover substituição de garantia de hipótese externa para operação confirmada;
- acrescentar elegibilidade do imóvel substituto, custos e defasagem;
- não incluir valor de bem externo dado em garantia no patrimônio da estratégia;
- não hard-code valor mínimo do novo imóvel até resposta formal.

**Estado:** MECÂNICA PRINCIPAL CONFIRMADA; PARÂMETROS OPERACIONAIS AINDA A DOCUMENTAR.

### EVID-021 — Regulamento Bamaq 2026 passa a ser referência corrente

A página oficial de regulamentos da Bamaq disponibiliza atualmente um Regulamento Atualizado 2026, além das versões 2025 e 2022.

**Decisão documental:**
- para novos confrontos regulatórios, priorizar a versão 2026;
- preservar referências históricas a 2025 quando elas documentam o que estava disponível na data da decisão;
- revalidar gradualmente regras materiais já extraídas da versão 2025 quando forem tocadas por novas respostas.

**Estado:** REFERÊNCIA CORRENTE ATUALIZADA.

---


### EVID-022 — Transferência de cota contemplada: taxa, cadastro e aprovação

Michele informou:
- R$ 150 de análise de crédito;
- 1% de taxa de transferência;
- base no crédito atualizado;
- teto R$ 1.000;
- nenhuma isenção QuintoAndar.

**Regulamento Bamaq 2026:**
- taxa de cadastro: R$ 150;
- transferência: 1% do **saldo devedor da conta de consórcio**, limitada a R$ 1.000;
- transferência de cota contemplada depende de documentação cadastral e aprovação formal da Administradora;
- se houver bem já em posse/garantia, podem existir despesas adicionais de gravame, baixa, registro e despachante.

**Conclusão:**
- percentual e teto informados por Michele estão corretos;
- base de cálculo informada por ela está incorreta em relação ao regulamento 2026;
- para a cota contemplada ainda não utilizada, a base correta a modelar é saldo devedor e não há motivo para presumir custos de gravame de um bem inexistente.

**Estado:** REGRA TARIFÁRIA PRINCIPAL CONFIRMADA DOCUMENTALMENTE.

### EVID-023 — Isenção QuintoAndar existe, mas em cenário diferente

O Regulamento da Campanha, item 4.2.4, concede isenção da taxa de transferência quando a transferência ocorre no mecanismo promocional de venda da cota NÃO contemplada ao próprio QuintoAndar, sujeito aos critérios da cláusula 4.2.

Portanto, a frase comercial “não há isenção QuintoAndar” é correta apenas se limitada ao cenário perguntado de venda de cota contemplada a terceiro.

**Decisão:**
Não misturar:
- cessão de cota contemplada a terceiro;
- mecanismo promocional de liquidez da cota não contemplada.

**Estado:** EXCEÇÃO PROMOCIONAL CONFIRMADA DOCUMENTALMENTE.

---


### EVID-024 — Seguro Prestamista é opcional; fórmula ainda não fechada

Michele informou:
- Seguro Prestamista 100% opcional;
- prêmio calculado percentualmente e dividido nas parcelas vincendas;
- cobertura máxima de R$ 800 mil por cota;
- idade superior a 70 anos impediria contratação;
- nesse perfil, contemplação exigiria avalista;
- possibilidade de solicitar seguro também durante o contrato.

**Verificação oficial Bamaq:**
- Central de Ajuda: Seguro Prestamista é opcional e pode ser adquirido na contratação;
- Regulamento Geral 2026: parcelas podem incluir seguro de vida/acidentes pessoais “caso tenha contrato”.

**O que NÃO foi confirmado em documento público consultado:**
- taxa/base do prêmio;
- cobertura máxima de R$ 800 mil;
- corte etário de 70 anos;
- obrigatoriedade de avalista por idade;
- possibilidade de inclusão posterior;
- seguradora/certificado específico.

**Decisão de modelagem:**
- manter `seguro = desligado` como default;
- preservar os modos V2.53/V2.54 como sensibilidades genéricas;
- não implementar “modo Bamaq” até obter memória de cálculo e condições do seguro;
- seguro deve ser individual por cota na arquitetura multi-cota.

**Estado:** OPCIONALIDADE CONFIRMADA; FÓRMULA/CONDIÇÕES ESPECÍFICAS PENDENTES.

### EVID-025 — Custos de ponta a ponta da proposta

Michele informou para a proposta QuintoAndar:
- 24% de administração;
- 1% de Fundo de Reserva;
- seguro apenas se contratado;
- taxa de adesão/cadastro na entrada = zero;
- análise de crédito pós-contemplação gratuita;
- avaliação/vistoria do imóvel cobrada em torno de 1 salário mínimo;
- ITBI e cartório por conta do comprador, podendo usar crédito residual dentro da regra de até 10%;
- substituição de garantia gera nova vistoria + custos cartorários;
- transferência de cota teria R$150 + 1% “do crédito”, teto R$1.000.

**Reconciliação documental:**
- Regulamento 2026 permite taxa de adesão “se for o caso”, portanto zero deve ser tratado como condição desta proposta;
- Regulamento 2026 contém taxa de cadastro R$150 em seu tarifário geral, mas não prova cobrança na adesão específica;
- avaliação prévia do imóvel é confirmada, mas o valor de 1 salário mínimo não aparece como tarifa fixa no regulamento;
- a base da taxa de transferência continua em conflito: Regulamento 2026 determina 1% do saldo devedor, não do crédito.

**Decisão:**
- reduzir a probabilidade de custos recorrentes ocultos no cenário-base;
- preservar custos transacionais como eventos separados;
- usar proposta oficial/tarifário para qualquer valor de custo não fixado no regulamento;
- continuar priorizando a base documental do saldo devedor na transferência.

**Estado:** ESTRUTURA DE CUSTOS PARCIALMENTE CONFIRMADA; VALORES TRANSACIONAIS AINDA A DOCUMENTAR.

---


### EVID-026 — Entrada de nova cota em grupo em andamento

Michele confirmou:
- 214 meses = prazo contratual remanescente da nova cota;
- não haveria parcelas retroativas dos meses anteriores;
- 24% de administração + 1% de Fundo de Reserva são integralmente devidos sobre o crédito contratado;
- esses valores são diluídos no prazo restante;
- exemplo: carta de R$ 200 mil → saldo inicial R$ 250 mil → R$ 1.168,22 em 214 meses.

**Reconciliação matemática:**
A conta fecha exatamente:
`200.000 × 1,25 / 214 = 1.168,22`.

**Verificação no Regulamento Bamaq 2025:**
- art. 1º, §3º confirma que quem entra em grupo em andamento fica obrigado ao pagamento integral das prestações no prazo remanescente;
- porém, art. 8º, VI, “a” afirma que, se houver contemplação, o consorciado deve pagar mensalidades correspondentes às assembleias anteriores à adesão ou sofrer dedução no crédito.

**Contradição:**
Essa segunda cláusula não combina com a afirmação comercial de “nenhuma parcela retroativa”.

**Decisão de modelagem:**
- manter a V2.54 sem retroativos, pois é o que corresponde à proposta/memória comercial atualmente apresentada;
- elevar a cláusula conflitante para confirmação formal;
- se ela for aplicável ao Grupo 4012, implementar ajuste separado no momento da contemplação;
- manter 214 meses e 25% integrais como default da proposta.

**Estado:** FÓRMULA INICIAL CONFIRMADA; REGRA DE EVENTUAL AJUSTE DE ASSEMBLEIAS ANTERIORES EM CONFLITO DOCUMENTAL.

---


### EVID-027 — Cotações individualizadas da operação de R$ 1,37 milhão

Foram recebidas imagens de cotação emitidas pela consultora QuintoAndar para:
- 2 × R$ 400 mil;
- 1 × R$ 370 mil;
- 1 × R$ 200 mil.

Cada cotação informa 214 meses e cashback de 10% do valor nominal da carta.

Valores:
- 400k: integral R$2.336,40; reduzida R$1.167,60; cashback R$40k;
- 370k: integral R$2.161,17; reduzida R$1.080,03; cashback R$37k;
- 200k: integral R$1.168,20; reduzida R$583,80; cashback R$20k.

Michele confirmou duas cotas de R$400 mil.

Totais:
- crédito R$1,37 milhão;
- integral R$8.002,17/mês;
- reduzida R$3.999,03/mês;
- cashback nominal R$137 mil.

**Decisão:** usar essa composição como preset real da futura arquitetura multi-cota, sujeito ao contrato final.

**Estado:** EVIDÊNCIA COMERCIAL ESCRITA FORTE.

### EVID-028 — “50% reduzida” não é metade exata, mas o desvio é sistemático

Nas três faixas de cotação:
- coeficiente integral = 0,005841 × carta;
- coeficiente reduzido = 0,002919 × carta;
- razão reduzida/integral ≈ 49,9743%.

Como o mesmo desvio aparece proporcionalmente em todas as cartas, ele provavelmente decorre de regra/coefficient do sistema e não de erro isolado.

**Decisão:** não corrigir a proposta para “metade exata”; pedir memória oficial e permitir override de valores cotados.

**Estado:** INCONSISTÊNCIA PEQUENA, SISTEMÁTICA E A EXPLICAR.

### EVID-029 — Cashback nominal e teto de despesas de R$123,3 mil

As cotações exibem cashback exatamente igual a 10% de cada carta nominal, totalizando R$137 mil.

Em outra mensagem, Michele escreveu que até 10% da carta poderia pagar ITBI/cartório, mas indicou “até R$123,3 mil”.

Matematicamente:
- 10% de R$1,37 milhão = R$137 mil;
- R$123,3 mil = 10% de R$1,233 milhão;
- R$1,233 milhão = 90% de R$1,37 milhão.

**Interpretação:** o valor de R$123,3 mil pode estar associado a um cenário de crédito líquido reduzido, por exemplo por embutido, mas isso não foi explicitado.

**Decisão:** não usar R$123,3 mil como teto geral até confirmação. A evidência das cotações fortalece, para cashback, a base nominal de 10% desta proposta.

**Estado:** CASHBACK MAIS FORTE; LIMITE DE DESPESAS A RECONCILIAR.

### EVID-030 — Nova mensagem sobre modalidades de lance

Michele reiterou:
- Lance Livre;
- Lance Fixo;
- Lance Embutido de até 30% da carta;
- Lance Fidelidade para adimplentes há pelo menos 12 meses;
- lance não vencedor não gera pagamento;
- possibilidade de nova tentativa no mês seguinte.

Ela também citou “3 dias” para pagamento do lance contemplado.

**Reconciliação:** a ata do Grupo 4012 anteriormente analisada indicava prazo no segundo dia útil. A mensagem comercial deve ser tratada como explicação simplificada até confirmação.

**Decisão:** não alterar cronologia de pagamento do lance ainda.

**Estado:** MODALIDADES REFORÇADAS; PRAZO DE PAGAMENTO EM CONFLITO.

---


### EVID-031 — Reajuste ocorre no aniversário do grupo

Em áudio posterior, Michele esclareceu que o reajuste anual de 3% não está incluído nos valores mostrados na proposta e ocorre no **aniversário do grupo**.

Ela também afirmou que “a tabela atual está prestes a virar na assembleia do dia 18” e ofereceu alocar as cotas/emitir o contrato para “travar” os valores e condições.

**Leitura:**
- data-base passa a ser calendário do grupo, não aniversário individual da adesão;
- ainda NÃO sabemos se a assembleia do dia 18 é exatamente o aniversário anual;
- ainda NÃO sabemos se uma cota emitida agora recebe 3% já na próxima assembleia;
- “travar tabela” pode se referir às condições de entrada e não necessariamente impedir o reajuste contratual posterior.

**Decisão de modelagem:**
- futura arquitetura deve ter calendário de grupo;
- não aplicar automaticamente primeiro reajuste após 12 meses da adesão;
- manter o primeiro reajuste configurável até receber a data exata;
- não interpretar “trava” comercial como isenção de reajuste.

**Estado:** DATA-BASE CONCEITUAL CONFIRMADA; PRIMEIRO REAJUSTE AINDA CRÍTICO.

### EVID-032 — Cotação agregada da operação

Foi recebida cotação agregada mostrando explicitamente:
- carta total: R$ 1.370.000;
- cashback: R$ 137.000;
- 214 meses;
- parcela integral: R$ 8.002,17;
- parcela reduzida: R$ 3.999,03;
- validade: 30/09/2026.

Michele reiterou que a operação é formada por:
- 2 × R$400 mil;
- 1 × R$370 mil;
- 1 × R$200 mil.

**Decisão:**
O preset comercial de R$1,37 milhão passa a ter confirmação tanto individual quanto agregada.

**Estado:** PROPOSTA COMERCIAL FORTEMENTE DOCUMENTADA.

### EVID-033 — Seguro pode ser incluído depois da adesão

Michele reiterou em áudio que:
- a proposta atual está sem seguro;
- o Seguro Prestamista é opcional;
- pode ser contratado desde o início;
- pode também ser incluído depois;
- quando incluído posteriormente, o cálculo é feito naquele momento conforme a situação da cota.

**Decisão:**
- opcionalidade e contratação posterior passam a ser premissas comerciais confirmadas;
- fórmula, carência e elegibilidade continuam pendentes;
- futura arquitetura deve permitir `mesInicioSeguro` por cota.

**Estado:** INCLUSÃO POSTERIOR CONFIRMADA COMERCIALMENTE; PREÇO/REGRAS PENDENTES.

### EVID-034 — Validade da cotação e evento de “trava”

Michele solicitou autorização para emitir o contrato/alocar as cotas para “garantir a janela”, enquanto as cotações indicam validade até 30/09/2026.

**Questão ainda aberta:**
Não está definido qual marco efetivamente fixa:
- cashback;
- tabela de entrada;
- parcela inicial;
- prazo remanescente;
- demais benefícios.

**Decisão:**
Tratar emissão, assinatura, pagamento e alocação como eventos distintos até confirmação.

**Estado:** URGENTE — ELEGIBILIDADE/LOCK A CONFIRMAR.

---

# PARTE IX — FONTES E RASTREABILIDADE


## 47. Primeira auditoria

Fonte principal:
- `auditoria_simulador_consorcio_v2_46.md`

Suíte original:
- `testes_auditoria.zip`
- testes T0–T32.

Principais identificadores:
- A1–A18;
- R1.

---

## 48. Segunda auditoria

Fontes:
- resposta consolidada do auditor da V2.53;
- `testes_auditoria_v2_53.zip`;
- `testes_auditoria_v2_53/tabela_testes.md`.

Estatística da suíte:
- 92 testes;
- 81 OK;
- 10 FALHA;
- 1 A CONFIRMAR.

Principais identificadores:
- B1–B11;
- Q01–Q06;
- BE01–BE02;
- SENS01–SENS03;
- M01–M02;
- P01–P02;
- KPI01–KPI04;
- TR-*;
- F01–F08;
- G01–G09.

---

## 49. Regra de manutenção deste documento

Sempre que uma auditoria gerar um novo achado:

1. registrar o apontamento original;
2. registrar a evidência/teste que o sustenta;
3. registrar a decisão tomada;
4. indicar explicitamente se a recomendação foi:
   - aceita;
   - adaptada;
   - rejeitada;
   - adiada;
5. registrar a motivação;
6. registrar a versão da implementação;
7. registrar risco residual;
8. registrar gatilho de revisão;
9. após nova auditoria, mudar o status de “pendente de reauditoria” para “reauditado” somente quando houver evidência independente.

**Princípio:** o histórico de decisão não deve ser apagado quando o código muda. A razão da decisão faz parte do modelo tanto quanto a fórmula implementada.

---

# PARTE X — EVOLUÇÃO PÓS-V2.54 ATÉ A V3.2

## 50. Decisão de abandonar branches isoladas como linha de evolução

Durante a implementação dos P0 foram criadas inicialmente branches isoladas para:
- Lance Livre + embutido;
- remuneração da carta separada do benchmark;
- multi-cota.

A estratégia foi revista porque uma decisão real exigia uma linha principal cumulativa.

**Decisão:** branches isoladas passam a ser artefatos de teste/histórico; a partir da V2.57/V2.58, cada melhoria nova deve ser integrada sobre a versão cumulativa anterior.

**Estado:** ACEITA E IMPLEMENTADA.

## 51. V2.58 — integração dos três primeiros P0

A V2.58 consolidou em uma única linha principal:
- multi-cota;
- Lance Livre sobre saldo devedor + embutido sobre carta;
- remuneração da carta referenciada ao CDI e separada do CDB benchmark.

Também restaurou warnings diagnósticos perdidos durante a primeira integração.

**Decisão:** V2.58 tornou-se a baseline cumulativa para os P0 seguintes.

**Estado:** IMPLEMENTADO; NÃO REAUDITADO INDEPENDENTEMENTE.

## 52. V2.59 — proibição de pooling entre cotas

Foi implementado o invariante:

`yieldUsed_j = min(yield_j, installment_j)`

O excedente de uma cota não pode reduzir obrigação de outra.

A interface passou a exibir, por cota:
- rendimento aferido acumulado;
- rendimento usado na própria parcela.

**Estado:** IMPLEMENTADO; NÃO REAUDITADO INDEPENDENTEMENTE.

## 53. V2.60 — financiamento do lance em múltiplas datas

Cada cota pode gerar uma tranche própria no mês de contemplação.

A tranche mantém:
- principal;
- percentual financiado;
- taxa;
- TR;
- prazo;
- sistema;
- parcelas;
- juros;
- saldo.

Condições podem ser globais ou individualizadas por cota.

**Estado:** IMPLEMENTADO; NÃO REAUDITADO INDEPENDENTEMENTE.

## 54. V2.61 — painel decisório / matriz de cenários

Foi adicionada uma matriz que reutiliza o motor principal para comparar cenários de:
- contemplação;
- Lance Livre;
- remuneração da carta;
- percentual financiado.

A linha “Atual” deve reproduzir a configuração principal.

**Estado:** IMPLEMENTADO; NÃO REAUDITADO INDEPENDENTEMENTE.

## 55. V3.0 — persistência de cenários

Mudança de objetivo do produto: o simulador passa a ser usado para comparar propostas de administradoras/consórcios diferentes.

Foi implementado:
- N cenários no localStorage;
- selecionar;
- salvar;
- salvar como;
- excluir;
- exportar JSON;
- importar JSON;
- persistir também linhas editáveis da matriz decisória.

**Decisão:** JSON foi escolhido como formato de transporte por simplicidade, legibilidade, versionamento e compatibilidade com a estrutura JavaScript.

**Estado:** IMPLEMENTADO; NÃO REAUDITADO INDEPENDENTEMENTE.

## 56. V3.1 — reorganização vertical da interface

As tabelas multi-cota, tranches e matriz decisória cresceram a ponto de exigir rolagem horizontal.

**Decisão:** manter o conteúdo, mas trocar a apresentação por cartões/sublinhas verticais.

**Estado:** IMPLEMENTADO COMO DECISÃO DE UX.

## 57. V3.2 — quantidade dinâmica de cotas

Para comparar concorrentes, a arquitetura deixou de assumir quatro cotas fixas.

A V3.2 permite:
- 1 a 50 cotas;
- criação dinâmica de cotas e tranches;
- serialização/restauração da quantidade de cotas;
- adaptação da matriz decisória;
- compatibilidade com presets antigos de quatro cotas;
- slider de contemplação quando há exatamente uma cota.

**Decisão de interpretação:** o intervalo 1–50 é capacidade do software, não afirmação de regra comercial de nenhuma administradora.

**Estado:** IMPLEMENTADO; NÃO REAUDITADO INDEPENDENTEMENTE.

## 58. Reconciliação dos P0 definidos para a decisão de 30/09

| P0 | Estado na V3.2 |
|---|---|
| Motor multi-cota real | IMPLEMENTADO e generalizado para N cotas |
| Lance Livre + embutido corretos | IMPLEMENTADO para Lance Livre; modalidade Fixa explícita ainda pendente |
| Rendimento da carta separado do benchmark | IMPLEMENTADO |
| Sem pooling entre cotas | IMPLEMENTADO |
| Financiamento do lance em múltiplas datas | IMPLEMENTADO |
| Painel decisório / matriz de cenários | IMPLEMENTADO |

## 59. Risco residual de qualidade

A última auditoria independente documentada incidiu sobre a família V2.53/V2.54.

Desde então foram alterados:
- arquitetura de cotas;
- regra de lance;
- remuneração;
- fluxo de parcelas via rendimento;
- financiamento bancário;
- matriz de cenários;
- persistência;
- estrutura dinâmica da interface.

Consequentemente, a ausência de falha observada durante desenvolvimento **não equivale a reauditoria**.

A próxima auditoria deve, no mínimo:
1. executar novamente a suíte histórica da V2.53/V2.54;
2. testar equivalência N=1;
3. testar equivalência entre cotas sincronizadas e agregado equivalente;
4. testar contemplações heterogêneas;
5. testar ausência de pooling;
6. testar tranches em datas diferentes;
7. testar matriz “Atual” = simulação principal;
8. testar salvar/carregar/exportar/importar sem alterar resultados;
9. testar aumento/redução dinâmica do número de cotas;
10. testar compatibilidade de presets antigos;
11. testar que cenários financeiros não ganham/ perdem fluxos na serialização;
12. manter os gaps contratuais como hipóteses, sem transformá-los em defaults silenciosos.

**Estado geral:** V3.2 É A BASELINE FUNCIONAL ATUAL; REAUDITORIA INDEPENDENTE PENDENTE.
