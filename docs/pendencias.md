============================================================
AUDITORIA V3.14 — CRÉDITO RESIDUAL
============================================================

Issue #14: RESOLVIDA QUANTO À CONTAGEM PATRIMONIAL; POLÍTICAS CONTRATUAIS COMPLETAS CONTINUAM PENDENTES.

Problema:
O residual pós-compra era mantido indefinidamente como ativo genérico, embora seu uso seja regulado e dependa de destinação.

Implementado na V3.14:
- residual bruto rastreado separadamente;
- default “não assumir destinação”;
- residual não alocado NÃO entra no patrimônio comparável;
- opção “usar em custos de aquisição”;
- teto configurável, default 10% do principal líquido disponível;
- custos pagos do bolso são reduzidos apenas pelo residual efetivamente aplicado;
- eventual sobra continua não alocada e fora do patrimônio;
- KPIs mostram residual bruto, aplicado em custos e não alocado;
- testes de integração protegem as duas políticas.

Ainda pendente:
- amortização/quitação de prestações;
- devolução em dinheiro;
- mecânica multi-cota e ordem indireta específicas.

============================================================
AUDITORIA V3.13 — TAXA DE TRANSFERÊNCIA
============================================================

Issue #13: RESOLVIDA.

Implementado:
- base = saldo devedor de cada cota no mês da cessão;
- default = 1%;
- teto = R$1.000 por cota;
- cessão conjunta soma as tarifas individuais;
- oferta de compra não altera a tarifa;
- motor expõe saldo e tarifa por cota para auditoria;
- regressão compara ofertas diferentes com os mesmos saldos e exige tarifa idêntica.

Pendência residual:
A taxa de cadastro de R$150 ainda precisa de confirmação sobre cobrança por cota versus por cessionário e não foi misturada à tarifa de transferência.

============================================================
AUDITORIA V3.12 — TIMING DO CASHBACK
============================================================

Issue #12: RESOLVIDA NO MOTOR MENSAL.

Problema:
O cashback era calculado e adicionado ao caixa no mesmo mês da compra, embora a compra seja convencionada no fim do mês e o benefício dependa de registro/pagamento posterior.

Implementado na V3.12:
- defasagem configurável em meses;
- default = 1 mês;
- compra em M não adiciona cashback ao caixa em M;
- default recebe em M+1;
- delay 0 permanece apenas como sensibilidade;
- KPI mostra o mês de recebimento;
- histórico mensal expõe `purchaseCashbackReceived`;
- regressão protege compra M4 → cashback M5.

Pendência documental residual:
O regulamento disponível indica 5 dias úteis; a fala comercial indicou 7. Essa diferença continua aberta, mas não muda o default mensal de M+1 sob a convenção de compra no fim do mês.

============================================================
AUDITORIA V3.11 — TESTES DE INTEGRAÇÃO
============================================================

Issue #8: RESOLVIDA.

Mudança arquitetural:
- `runScenario` saiu do HTML e passou para `scenario-engine.js`;
- navegador e testes usam o mesmo motor;
- não existe cópia paralela da lógica crítica no teste.

Casos cobertos:
- multi-cota 400/400/370/200;
- R$959 mil de principal líquido antes do primeiro reajuste;
- R$95,9 mil de cashback conservador;
- reajuste antes da contemplação no mês 12;
- contemplações escalonadas;
- base de cashback principal vs. disponível;
- financiamento por cota;
- 210 meses remanescentes no caso mês 4;
- vedação de pooling comprovada mês a mês por cota.

CI:
O GitHub Actions executa unitários + integração em cada push/PR.

Pendência removida:
O motor multi-cota deixa de depender apenas de validação manual/desenvolvimento para seus invariantes principais.

============================================================
AUDITORIA V3.10 — BASE DO CASHBACK
============================================================

Issue #7: RESOLVIDA NO SOFTWARE COM POLÍTICA CONSERVADORA.

Problema:
O motor usava todo o `letterBalance` na compra como base potencial de cashback. Como esse saldo inclui rendimentos acumulados, cenários de espera podiam elevar silenciosamente o benefício acima dos R$95,9 mil comercialmente confirmados.

Implementado na V3.10:
- separação entre principal líquido pós-embutido e rendimentos;
- default = principal líquido pós-embutido, limitado ao preço/crédito efetivamente usado;
- rendimentos acumulados excluídos da base por default;
- sensibilidade opcional permite incluir rendimentos, com alerta de que não há confirmação documental;
- KPI exibe a base elegível;
- regressões unitárias protegem R$95,9 mil no cenário canônico.

Pendência residual:
Ainda não existe confirmação documental específica sobre a elegibilidade de rendimentos financeiros acumulados para o cashback. Por isso a alternativa inclusiva permanece apenas como sensibilidade.

============================================================
AUDITORIA V3.9 — FINANCIAMENTO DO LANCE
============================================================

Issue #6: RESOLVIDA.

Implementado:
- três linhas dedicadas na matriz: Financiamento 0%, 50% e 100%;
- contemplação, Lance Livre e rendimento são herdados da Base comparável;
- política de compra/preço permanece comum à matriz.

Resultado que motivou a mudança:
No cenário auditado de imóvel-alvo de R$1 milhão, compra no mês 12 e Lance Livre de 70%, a diferença contra o CDB piorava fortemente conforme aumentava a alavancagem.

A matriz agora permite visualizar esse efeito isoladamente sem confundi-lo com outras mudanças de cenário.

============================================================
AUDITORIA V3.8 — PRESETS DE VERSÕES ANTIGAS
============================================================

Issue #10: RESOLVIDA.

Risco identificado:
Presets antigos podiam carregar silenciosamente 30% de Lance Livre, 98% de Carta/CDI ou 11,5% de CDI e parecer equivalentes aos defaults reconciliados das versões atuais.

Implementado na V3.8:
- `appVersion` ausente passa a ser tratado como `legacy`, não como versão atual;
- `formatVersion` = 2;
- `stateVersion` = 2;
- banner explícito para preset com antigo default reconhecido;
- ação “Manter como está”;
- ação “Criar cópia migrada”;
- o original nunca é alterado;
- valores customizados não são migrados automaticamente;
- migração também cobre a política antiga da matriz.

Pendência removida:
Presets antigos deixam de poder mascarar silenciosamente as premissas atualizadas.

============================================================
AUDITORIA V3.7 — CDI BRUTO × CDB LÍQUIDO
============================================================

Issue #9: RESOLVIDA NO NÍVEL DE PARAMETRIZAÇÃO.

Problema:
O app usava 11,5% a.a. tanto para o CDB benchmark líquido quanto para o CDI de referência bruto.

Implementado na V3.7:
- CDB permanece hipótese líquida independente em 11,5% a.a.;
- CDI passa a 13,65% a.a. como referência spot de 23/10/2026 (BCB/SGS 4389);
- interface rotula explicitamente bruto × líquido;
- 13,65% é tratado como referência editável, não previsão de 214 meses;
- a carta permanece em 80% do CDI como retorno líquido projetado.

Pendência residual:
A trajetória de longo prazo do CDI continua sendo uma sensibilidade macroeconômica. O motor ainda usa taxa constante. Isso não bloqueia o uso do simulador, mas cenários de carta mantida por muitos anos devem testar trajetórias/taxas alternativas.

============================================================
AUDITORIA V3.6 — MATRIZ COMPARÁVEL
============================================================

Issue #5: RESOLVIDA.

A auditoria V3.5 mostrou que a matriz misturava:
- linha Atual sem compra dentro do horizonte;
- linhas alternativas comprando na última contemplação;
- preço do imóvel travado ao crédito, produzindo ativos de valores diferentes por linha.

Implementado na V3.6:
- política comum de compra para todas as linhas;
- default = comprar na última contemplação;
- política comum de preço;
- default = imóvel-alvo fixo de R$1.000.000;
- opção explícita de usar todo o crédito como preço;
- linha “Base comparável” em vez de “Atual”;
- preço do imóvel exibido como output;
- política persistida nos presets;
- migração compatível do antigo `buyAtLastCont`.

Pendência removida:
A matriz deixa de ter como problema estrutural a falta de comparabilidade entre política de compra e tamanho do ativo.

PENDÊNCIAS — SIMULADOR CONSÓRCIO x CDB x IMÓVEL
Base atual de software: V3.11
Estado: documento canônico de incertezas e gaps ainda reais

Objetivo: registrar tudo o que ainda não está suficientemente confirmado ou modelado, deixando explícito:
1) o que precisamos resolver;
2) qual informação falta;
3) uma forma prática de obter a informação.


Rodada de respostas comerciais — 28/09/2026
Fonte: respostas escritas de Michele Ramalho Coelho (QuintoAndar/Bamaq).

Nível de evidência:
- Resposta comercial escrita reduz incerteza, mas regras de alto impacto devem ser confrontadas com contrato/regulamento da Bamaq e, quando possível, com norma do Banco Central.
- Nesta rodada também confrontamos as afirmações legais com fontes oficiais atuais do Banco Central e da Lei nº 11.795/2008.
- O histórico de versões e auditorias permanece no Git e em `docs/follow-up-auditorias.md`. Este arquivo deve registrar prioritariamente o que ainda está aberto na V3.11; referências históricas só são mantidas quando explicam a origem de uma pendência.

============================================================
0. ESTADO ATUAL DO SOFTWARE — V3.11
============================================================

Esta seção descreve o estado canônico atual. O histórico detalhado de versões anteriores fica no follow-up das auditorias e no Git.

IMPLEMENTADO E REAUDITADO NA LINHA ATUAL:
- arquitetura multi-cota configurável;
- proposta QuintoAndar 400 / 400 / 370 / 200 como preset estrutural;
- contemplação independente por cota;
- Lance Livre sobre saldo devedor atualizado de cada cota;
- lance embutido sobre a carta atualizada, limitado a 30% e ao próprio Lance Livre;
- vedação de pooling de rendimentos entre cotas;
- financiamento por tranches independentes;
- rendimento da carta separado do benchmark CDB;
- CDI bruto separado do CDB líquido;
- default líquido da carta em 80% do CDI;
- matriz de cenários com política comum de compra/preço;
- sensibilidades explícitas de financiamento 0% / 50% / 100%;
- cashback conservador sobre principal líquido pós-embutido, sem rendimentos acumulados por default;
- presets versionados com migração explícita e preservação do original;
- motor completo em `scenario-engine.js`, compartilhado pelo navegador e testes;
- regressões unitárias + integração no GitHub Actions;
- política anti-pooling verificada mês a mês por cota.

PENDÊNCIAS DE MODELAGEM / DOCUMENTAÇÃO AINDA REAIS:
- seletor explícito Lance Fixo × Lance Livre;
- compra com subconjunto das cotas já contempladas;
- override das parcelas oficiais cotadas;
- trajetória temporal de CDI/CDB para horizontes longos;
- dia exato e ordem do reajuste quando coincide com contemplação;
- reconciliação documental da ausência de retroativos para entrada no grupo em andamento;
- destino formal do crédito residual após compra;
- confirmação documental sobre inclusão de rendimentos acumulados na base do cashback;
- detalhes operacionais do pedido mensal para usar rendimento na própria parcela;
- módulos de seguro, cessão, resgate, encerramento e substituição de garantia ainda dependentes de regras documentais.

ESTADO DE QUALIDADE:
A V3.11 já passou pela auditoria posterior à V3.5 e pelas correções V3.6–V3.11. As regras críticas possuem testes automatizados. O que permanece aberto está concentrado em premissas externas, documentação contratual e funcionalidades ainda não implementadas.

============================================================
1. PRIORIDADE ALTA — PREMISSAS QUE PODEM MUDAR O RESULTADO
============================================================


1.1. Rendimento da carta contemplada não utilizada [R1]
Status após resposta de 29/09/2026:
REGRA ECONÔMICA E PREMISSA-BASE MAJORITARIAMENTE RESOLVIDAS; PROVA ESPECÍFICA DO GRUPO AINDA OPCIONAL.

Michele reconciliou as referências anteriores:
- 98% a 105% do CDI = rentabilidade BRUTA típica das aplicações do grupo;
- aproximadamente 80% do CDI = rentabilidade LÍQUIDA orientada pela Bamaq para projeções financeiras da carta contemplada.

Ela também informou:
- instituição: Itaú;
- fundo: Itaú Premium Renda Fixa Referenciado DI;
- CNPJ: 03.184.233/0001-80;
- aplicação de perfil conservador e alta liquidez;
- o rendimento líquido é repassado à cota sem nova incidência/cobrança de IR, segundo a explicação comercial.

Verificação externa:
- o CNPJ 03.184.233/0001-80 corresponde efetivamente ao Itaú Premium Renda Fixa Referenciado DI;
- a lâmina oficial do Itaú de julho/2026 mostra desempenho bruto de:
  - 97,88% do benchmark em 2026 até julho;
  - 97,53% em 12 meses;
  - 98,01% em 24 meses;
  - 100,49% em 36 meses;
- isso é coerente com a descrição de retorno bruto próximo ao CDI.

Conclusão de modelagem:
- cenário-base realista da carta: `p_carta_liquido = 80% do CDI`;
- esse percentual deve ser entendido como retorno líquido efetivo da carta;
- NÃO aplicar IR adicional sobre esse mesmo rendimento no fluxo-base;
- manter sensibilidade editável porque 80% não é taxa garantida;
- 98%–105% deixa de ser faixa líquida do simulador e passa a ser apenas referência da aplicação bruta.

Pontos ainda não fechados:
- não recebemos extrato do Grupo 4012 comprovando que o fundo informado é efetivamente o veículo corrente daquele grupo;
- “conta de investimento exclusiva” ainda precisa ser entendida operacionalmente: conta individual ou segregação contábil;
- eventual tributação/efeito fiscal no recebimento em espécie continua separado;
- a expressão “80% do CDI líquido” é linguagem comercial imprecisa; para o simulador, usar 80% da referência CDI como retorno final líquido da carta, sem novo haircut.

Como obter, se quisermos elevar a prova:
- pedir extrato/anônimo recente de crédito contemplado do Grupo 4012;
- pedir documento Bamaq que identifique o fundo da posição atual.


1.2. Uso do rendimento da carta para pagar parcelas [R1]
Status após resposta de 28/09/2026:
RESPONDIDO COMERCIALMENTE; RESTAM APENAS DETALHES OPERACIONAIS DE USO NO APP.

Michele confirmou expressamente que:
- o rendimento mensal da carta contemplada pode ser usado para abater a parcela da PRÓPRIA cota;
- o abatimento pode chegar a 100% da parcela;
- se o rendimento for maior que a parcela, apenas o necessário para quitá-la é usado;
- o rendimento excedente permanece acumulando no crédito da carta;
- o uso do rendimento não é automático: o consorciado precisa solicitar o abatimento mensalmente pelo aplicativo;
- o rendimento de uma cota NÃO pode ser usado para pagar parcelas de outra cota.

Exemplo dado:
- rendimento do mês = R$ 10 mil;
- parcela da própria cota = R$ 5 mil;
- R$ 5 mil quitam a parcela;
- R$ 5 mil permanecem acumulando no crédito.

Estado atual da V3.11:
A matemática e a arquitetura multi-cota já coincidem com a regra comercial:
- `yieldUsed_j = min(rendimento_j, parcela_j)`;
- o rendimento usado reduz a obrigação de caixa da própria cota;
- o excedente capitaliza na própria carta;
- pooling entre cotas é proibido;
- o invariante é testado mês a mês na suíte de integração.

Diferença operacional ainda não representada:
- quando o modo “usar rendimento para pagar parcela” está ativo, o simulador presume que o consorciado faz corretamente a solicitação em todos os meses elegíveis;
- na operação real, a solicitação precisa ser feita pelo aplicativo segundo a informação comercial.

Conclusão:
A regra econômica e a restrição por cota estão implementadas. O que resta é apenas detalhar a operação mensal da solicitação, se isso se tornar relevante para uma sensibilidade de aderência.

Detalhes operacionais ainda úteis:
- Se o rendimento for menor que a parcela, o abatimento parcial funciona automaticamente pelo valor disponível?
- Até que data do mês a solicitação precisa ser feita?
- A solicitação feita no app vale para a parcela corrente ou para a próxima?
- Se o cliente esquecer de solicitar em um mês, pode usar o rendimento acumulado no mês seguinte para abater uma parcela posterior?
- Há opção de deixar uma instrução permanente ou é obrigatoriamente uma ação manual todo mês?

Como obter:
- perguntar à Michele/Bamaq apenas os detalhes operacionais acima, se não vierem nas próximas respostas.


1.3. Entrada em grupo já em andamento
Status após resposta complementar de 29/09/2026:
MECÂNICA ECONÔMICA E AUSÊNCIA DE RETROATIVOS FORTEMENTE CONFIRMADAS COMERCIALMENTE PARA AS QUATRO COTAS; CONTRADIÇÃO DOCUMENTAL COM O REGULAMENTO GERAL 2025 AINDA NÃO FOI RECONCILIADA POR DOCUMENTO FORMAL.

Michele já havia informado que:
- a nova cota entra no grupo já em andamento com prazo REMANESCENTE de 214 meses;
- não há cobrança mensal retroativa dos meses anteriores à adesão;
- todo o plano da nova cota é diluído pelos 214 meses restantes;
- taxa de administração de 24% e fundo de reserva de 1% são aplicados INTEGRALMENTE sobre o crédito contratado;
- exemplo de cota R$ 200.000:
  - crédito: R$ 200.000;
  - encargos totais: R$ 50.000;
  - saldo devedor inicial: R$ 250.000;
  - prazo remanescente: 214 meses;
  - parcela integral inicial: R$ 1.168,22.

Em 29/09/2026, ao ser confrontada diretamente com a cláusula do Regulamento Geral Bamaq 2025 sobre assembleias anteriores, Michele respondeu de forma expressa e específica para a operação:
- para as quatro cotas do Grupo 4012 / produto QuintoAndar-Bamaq, “NÃO EXISTE e NÃO HAVERÁ” cobrança nem desconto retroativo referente às assembleias anteriores à entrada;
- as cotas seriam cotas NOVAS de lançamento/abertura de vagas em grupo em andamento, e não substituição/assunção de cota cancelada com histórico anterior;
- saldo devedor e parcelas seriam calculados “do zero” para o novo aderente e distribuídos exclusivamente no prazo remanescente;
- quando houver contemplação, o crédito liberado seria o valor integral da carta contratada, sem desconto de “mensalidades passadas”;
- segundo ela, o saldo por cota é estritamente crédito contratado + taxa de administração + fundo de reserva, diluídos nas parcelas futuras;
- ela qualificou os números da proposta comercial como definitivos para essa operação.

Reconciliação matemática:
`R$ 200.000 × 1,25 = R$ 250.000`
`R$ 250.000 / 214 = R$ 1.168,224...`

Logo, o exemplo fecha praticamente de forma exata com:

`D0 = C0 × (1 + 24% + 1%)`

`P0 = D0 / 214`

Isso também reforça a leitura do exemplo de R$ 400 mil, cujo saldo inicial de R$ 500 mil e parcela integral de cerca de R$ 2.336,45 seguem a mesma lógica.

EVIDÊNCIA DOCUMENTAL JÁ EXISTENTE
O Regulamento Geral Bamaq 2025, art. 1º, §3º, afirma que o consorciado admitido em grupo em andamento fica obrigado ao pagamento integral das prestações previstas no instrumento dentro do prazo remanescente para o término do grupo.

Isso é compatível com:
- encargos integrais;
- nenhuma “taxa já consumida” antes da entrada;
- diluição do compromisso pelo prazo que resta.

RESSALVA DOCUMENTAL AINDA ABERTA
No mesmo Regulamento 2025, art. 8º, VI, alínea “a”, existe texto dizendo que, quando a adesão ocorreu em grupo já em andamento e houver contemplação por sorteio ou lance, o consorciado deve pagar mensalidades correspondentes às assembleias realizadas ANTES da adesão; se não pagar, a Administradora pode deduzir esse valor do crédito contemplado.

A nova resposta da Michele não ignora essa contradição: ela apresenta uma interpretação específica de que a cláusula genérica se relacionaria a modelos de substituição/repescagem de cotas canceladas, enquanto a operação QuintoAndar/Bamaq analisada seria de cota nova de lançamento/abertura de vaga. Essa explicação reduz muito o risco operacional, mas continua sendo uma afirmação comercial, não uma cláusula do Regulamento 2026 ou do contrato específico já apresentada por escrito pela administradora.

Decisão de modelagem após a resposta de 29/09:
- NÃO implementar cobrança/dedução retroativa no preset nem no cenário-base desta proposta;
- NÃO criar evento de ajuste de assembleias anteriores para as quatro cotas do Grupo 4012 enquanto a única evidência específica da operação afirmar que esse ajuste não existe;
- manter a contradição documental registrada como risco jurídico/documental residual, a ser conferido no contrato/regulamento aplicável antes da assinatura;
- se surgir documento formal contraditório, reabrir SW-060 e recalcular o impacto antes da decisão.

O que ainda falta para encerramento documental, não para a modelagem-base:
- contrato/proposta final das quatro cotas mostrando o prazo/saldo efetivo;
- Regulamento 2026, aditivo ou cláusula específica aplicável ao produto que permita reconciliar formalmente o art. 8º, VI, “a” de 2025;
- confirmação documental de que “214 meses” é exatamente o número de parcelas contratuais do novo aderente sem ajuste anterior fora da proposta;
- permanece aberta apenas a fórmula comercial da parcela reduzida R$1.167,60 no exemplo de R$400 mil; o rótulo “209 meses” foi reconciliado como erro de apresentação, pois a própria parcela pós-contemplação confirma 210 meses.

Como obter:
- conferir o contrato/proposta final antes de assinar;
- pedir, se necessário, a cláusula/regulamento 2026 que formaliza o tratamento das cotas novas de lançamento/abertura de vagas em grupo em andamento.

1.4. Tributação/custos sobre o rendimento da carta contemplada [R1 / B6]
Status após resposta de 28/09/2026:
FORTEMENTE REDUZIDO COMO RISCO DE MODELAGEM; MANTER APENAS CONFIRMAÇÃO DOCUMENTAL/FISCAL RESIDUAL.

Michele informou que:
- a rentabilidade é repassada ao consorciado de forma líquida;
- a administradora recolhe as obrigações tributárias das aplicações no nível do fundo/aplicação;
- não há taxa adicional de gestão financeira nem nova taxa de administração sobre os rendimentos.

Verificação externa:
A Resolução BCB nº 285/2023, art. 17, determina que o crédito do contemplado seja acrescido dos “rendimentos líquidos financeiros” proporcionais ao período em que permaneceu aplicado.

Impacto na modelagem:
- o motor atual trata a taxa da carta como líquida;
- o campo de “IR/custo do resgate” em 0% é coerente como default;
- aplicar automaticamente outro IR sobre todos os rendimentos provavelmente duplicaria um haircut que já ocorreu antes do crédito líquido ser reconhecido;
- eventual campo de haircut adicional deve ser entendido apenas como sensibilidade para custo/tributação EXTRA, não como regra-base.

O que ainda vale confirmar:
- se o recebimento em espécie após 180 dias gera algum evento fiscal adicional para o consorciado pessoa física além do rendimento já creditado líquido;
- se a Bamaq emite informe de rendimentos ou documento fiscal;
- se há algum custo específico de encerramento do grupo não capturado pelos rendimentos líquidos;
- se desejável, obter extrato/posição específica do Grupo 4012 e documentação fiscal; a antiga divergência 98%–105% versus ~80% foi reconciliada como bruto da aplicação versus líquido projetado da carta.

Como obter:
- contrato/regulamento Bamaq;
- exemplo de extrato/informe;
- se necessário, validação tributária com contador antes da decisão final.




1.5. Índice/regra de reajuste do consórcio
Status após resposta escrita de 29/09/2026:
REGRA ECONÔMICA, DISTINÇÃO ENTRE TABELA COMERCIAL E REAJUSTE ANUAL E MÊS DO PRIMEIRO REAJUSTE RESPONDIDOS COMERCIALMENTE. RESTAM O MARCO FORMAL EXATO DA “TRAVA”, A ORDEM REAJUSTE × CONTEMPLAÇÃO NO MÊS COINCIDENTE E A MEMÓRIA OFICIAL DO RECÁLCULO PÓS-CONTEMPLAÇÃO.

Michele já havia confirmado:
- o reajuste é FIXO em 3% ao ano;
- antes da contemplação, os 3% corrigem crédito/carta e parcelas;
- depois da contemplação, o saldo devedor continua reajustado em 3% a.a.;
- a carta contemplada deixa de seguir o reajuste fixo e passa a render financeiramente;
- o reajuste anual está ligado ao aniversário do grupo, e não deve ser modelado simplesmente como “12 meses depois da adesão individual”.

NOVA RESPOSTA — 29/09/2026
Michele esclareceu expressamente que:
- a “virada da tabela” / fechamento da assembleia mês a mês e o reajuste anual fixo de 3% NÃO são o mesmo evento;
- a tabela comercial fecha antes da assembleia, por volta do dia 12 de cada mês, e funciona como janela para entrada no grupo e garantia das condições comerciais/vaga disponíveis;
- entrando agora, a condição comercial atual é travada com os valores da proposta, incluindo a parcela reduzida agregada de R$ 3.999,03;
- a próxima assembleia do dia 18 NÃO aplica o reajuste anual de 3% às novas cotas desta proposta;
- o primeiro reajuste anual ocorrerá em ABRIL DE 2027, daqui a aproximadamente 7 meses;
- ela reafirmou separadamente que a anotação anterior de “primeiro reajuste daqui a 7 meses” estava correta.

Interpretação para o modelo:
- para a resolução mensal do simulador, o calendário do primeiro reajuste desta proposta passa a estar suficientemente definido: abril/2027;
- “virada da tabela comercial” e “reajuste contratual anual” devem permanecer como eventos distintos;
- o simples fechamento/assembleia mensal não deve disparar os 3% na cota já contratada;
- a ausência do reajuste anual antes de abril/2027 não elimina outros eventos que possam alterar a parcela, como contemplação, lance e recálculo pós-contemplação;
- a arquitetura futura ainda deve separar `mesAdesaoCota` de `mesAniversarioGrupo`/calendário de reajuste.

Observação de redação:
Na resposta mais recente Michele usou a expressão “aniversário da cota/grupo”. Em respostas anteriores ela havia dito “aniversário do grupo”. Como ela fixou operacionalmente o primeiro reajuste desta proposta em abril/2027, essa possível imprecisão de linguagem não impede a simulação mensal atual, mas a redação contratual exata continua desejável antes de transformar o conceito em regra jurídica definitiva.

Pontos que deixam de estar abertos:
- a assembleia do dia 18 NÃO é, para esta entrada, o evento que aplica imediatamente os 3%;
- as novas cotas NÃO recebem 3% na próxima assembleia apenas por terem sido contratadas agora;
- o primeiro reajuste desta proposta ocorre em abril/2027;
- a virada mensal da tabela comercial é um evento distinto do reajuste contratual anual;
- as assembleias regulares são operacionalmente referenciadas ao dia 18 e, quando o dia 18 não é útil, são deslocadas para dia útil; para outubro/2026 Michele informou 19/10 porque 18/10 cai em domingo. O histórico de julho/2026 também é coerente com esse deslocamento, pois a assembleia ocorreu em 20/07.

Pontos ainda não respondidos:
- qual ato formal caracteriza que o cliente “entrou” e efetivamente travou a tabela: emissão, assinatura, primeiro pagamento, alocação da cota ou outro marco;
- dia exato de abril/2027 em que o reajuste é processado, caso no futuro precisemos de precisão diária;
- ordem exata se reajuste e contemplação coincidirem no mesmo mês;
- memória oficial do recálculo da parcela pós-contemplação.

Como obter:
- manter QN-063 aberta somente quanto ao dia exato, se essa precisão se tornar necessária;
- confirmar ordem reajuste × contemplação;
- pedir exemplo oficial de um reajuste pós-contemplação.

1.6. Nível do CDB / taxa de oportunidade ao longo do horizonte
Precisamos resolver:
Tratar o retorno do benchmark e da carta como uma premissa macroeconômica de alta sensibilidade, e não como um único número estático tomado como “verdade”.

Por que virou prioridade alta:
A segunda auditoria mostrou que, mantendo as demais premissas do default:
- CDB de 11,5% a.a. → Δ ≈ +R$ 1,30 milhão;
- CDB de 9% a.a. → Δ ≈ +R$ 397 mil;
- CDB de 7% a.a. → Δ ≈ -R$ 81 mil.

Informação/decisão que falta:
- Qual taxa de oportunidade usar como cenário conservador, base e otimista?
- Faz sentido manter uma taxa anual constante por 17–18 anos?
- Devemos permitir trajetória temporal de CDI/CDB em vez de uma taxa fixa?
- Como combinar essa premissa com o percentual do CDI recebido pela carta?

Como obter:
- Não depende da Bamaq; é decisão de modelagem econômica.
- Usar cenários explícitos e análise de sensibilidade.
- Próxima evolução recomendada: matriz 2D “CDB × reajuste do consórcio”.




1.7. Saída da carta não utilizada no encerramento do grupo [B6]
Status após resposta de 28/09/2026:
PARCIALMENTE RESPONDIDO; O FUNDO DE RESERVA FOI CONFIRMADO, MAS A COMPENSAÇÃO AUTOMÁTICA DO SALDO NO ENCERRAMENTO PRECISA DE RECONCILIAÇÃO.

Michele informou:
- no encerramento do grupo, se a carta contemplada não tiver sido utilizada, a administradora encerraria o contrato;
- segundo ela, eventual saldo devedor pendente seria liquidado com os créditos/recursos da própria cota;
- o saldo líquido seria liberado automaticamente ao consorciado por transferência/PIX;
- além disso, o consorciado receberia sua parcela proporcional do Fundo de Reserva remanescente, se houver.

O que foi confirmado por fontes formais:
1. Resolução BCB nº 285/2023:
   - após a última assembleia, saldos remanescentes do fundo comum e, se houver, do fundo de reserva devem ser rateados proporcionalmente entre os consorciados ativos;
   - a administradora deve comunicar aos consorciados ativos os valores disponíveis;
   - a regulamentação prevê transferência dos valores remanescentes não devolvidos às contas dos consorciados, quando houver autorização prévia.
2. Regulamento Geral Bamaq 2025:
   - art. 55: saldo remanescente do fundo de reserva após a última assembleia é disponibilizado aos consorciados ativos;
   - art. 61: no encerramento, a Bamaq comunica ao consorciado ativo que não utilizou o crédito E que tenha quitado suas obrigações que o crédito está disponível em espécie.

Conclusão:
- a devolução/rateio do Fundo de Reserva está confirmada;
- a disponibilização em dinheiro do crédito não utilizado no encerramento também está confirmada para cota com obrigações quitadas;
- porém, o Regulamento Geral não confirma a frase “a Bamaq automaticamente compensa o saldo devedor com o próprio crédito e paga a diferença”;
- ao contrário, o art. 61 condiciona o recebimento do crédito à quitação das obrigações.

Portanto, a compensação automática no encerramento continua aberta e deve ser confirmada formalmente.

Impacto sobre B6/P01:
- a hipótese de aplicar haircut fiscal de 15% sobre os rendimentos finais fica ainda menos justificável;
- o principal ponto residual passa a ser a mecânica da quitação/compensação no encerramento;
- o patrimônio terminal deve futuramente incluir eventual rateio de fundo comum/reserva, mas não devemos presumir percentual de devolução.

Pontos ainda a confirmar:
- No encerramento, a Bamaq realmente compensa internamente o saldo devedor com o crédito não utilizado?
- Se sim, essa compensação usa apenas os rendimentos acumulados ou também o principal da carta?
- Se não houver compensação automática, o cliente precisa quitar externamente antes de receber o crédito em espécie?
- Qual o prazo operacional entre a última assembleia, a comunicação e o pagamento?
- O valor do fundo de reserva é pago automaticamente ou apenas após atualização/autorização bancária?
- O rateio do fundo de reserva considera exatamente o valor das prestações pagas, como na Resolução 285?
- Há histórico de percentuais efetivamente devolvidos em grupos Bamaq encerrados?

Como obter:
- pedir resposta formal da Bamaq citando o art. 61 do Regulamento;
- pedir exemplo real de encerramento de cota contemplada e não utilizada;
- pedir extrato/rateio de fundo de reserva de grupo encerrado.

============================================================
2. PRIORIDADE ALTA — MÚLTIPLAS COTAS
============================================================

Status após a segunda auditoria:
A necessidade deixou de ser apenas arquitetural. O auditor mostrou que a “carta única equivalente” é linear quando todas as cotas são contempladas juntas, mas pode deixar de representar a operação quando as contemplações são distribuídas no tempo.

Exemplo ilustrativo da auditoria:
- carta única equivalente contemplada no mês 12: Δ ≈ +R$ 1,30 milhão;
- 7 cotas equivalentes contempladas nos meses 12, 30, 60, 90, 120, 150 e 180: soma dos Δ ≈ -R$ 539 mil;
- aportes próprios sobem de cerca de R$ 49 mil para cerca de R$ 580 mil.

Conclusão de modelagem:
Para avaliar a operação real de várias cotas, a modelagem de N cotas independentes passa a ser necessária antes de tratar o resultado como base de decisão.

Estrutura comercial informada em 28/09/2026:
- 4 cotas: R$ 400 mil + R$ 400 mil + R$ 370 mil + R$ 200 mil;
- mesmo grupo possível (ex.: 4012);
- cotas novas;
- contemplação, sorteio e lance individual por cota;
- crédito de cota contemplada pode permanecer aplicado enquanto as demais ainda aguardam contemplação.



2.1. Estrutura exata da proposta
Status após materiais enviados em 28/09/2026:
FORTEMENTE CONFIRMADO POR COTAÇÕES ESCRITAS INDIVIDUAIS.

Foram recebidas cotações nominais para as quatro cotas da operação:

Cota A:
- crédito: R$ 400.000;
- prazo exibido: 214 meses;
- parcela integral: R$ 2.336,40;
- parcela reduzida: R$ 1.167,60;
- cashback destacado: R$ 40.000.

Cota B:
- crédito: R$ 400.000;
- mesmos valores da Cota A;
- cashback destacado: R$ 40.000.

Cota C:
- crédito: R$ 370.000;
- prazo exibido: 214 meses;
- parcela integral: R$ 2.161,17;
- parcela reduzida: R$ 1.080,03;
- cashback destacado: R$ 37.000.

Cota D:
- crédito: R$ 200.000;
- prazo exibido: 214 meses;
- parcela integral: R$ 1.168,20;
- parcela reduzida: R$ 583,80;
- cashback destacado: R$ 20.000.

Totais da proposta:
- crédito contratado: R$ 1.370.000;
- parcela integral inicial: R$ 8.002,17/mês;
- parcela reduzida inicial: R$ 3.999,03/mês;
- cashback destacado nas cotações: R$ 137.000;
- 4 cotas, todas em nome do usuário;
- 2 cotas de R$ 400 mil, 1 de R$ 370 mil e 1 de R$ 200 mil.

Além das cotações individuais, foi recebida uma COTAÇÃO AGREGADA que mostra explicitamente:
- valor total da carta: R$ 1.370.000;
- cashback: R$ 137.000;
- parcela integral: R$ 8.002,17;
- parcela reduzida: R$ 3.999,03;
- prazo: 214 meses.

A cotação agregada também mostra “Cotação válida até 30/09/2026”.

Michele reiterou em áudio:
- quatro cotas em nome do usuário;
- duas de R$400 mil, uma de R$370 mil e uma de R$200 mil;
- taxa administrativa e fundo de reserva já estão incorporados/diluídos nas parcelas mostradas;
- seguro prestamista NÃO está incluído na proposta atual.

Consequência:
A composição nominal deixa de ser apenas uma explicação verbal e passa a ter evidência escrita de proposta comercial. Ainda deve ser conferida no contrato/adesão final, mas já é adequada como preset da próxima versão multi-cota.

PONTO MATEMÁTICO NOVO — PARCELA REDUZIDA
As três faixas de carta usam exatamente os mesmos coeficientes proporcionais:

Parcela integral:
`parcela_integral / carta = 0,005841`

Parcela reduzida:
`parcela_reduzida / carta = 0,002919`

Logo:
`parcela_reduzida / parcela_integral ≈ 49,9743%`

Ou seja, apesar do texto “redução de 50%”, a parcela reduzida NÃO é exatamente 50% da parcela integral exibida.

Exemplos:
- R$ 2.336,40 / 2 = R$ 1.168,20, mas a proposta mostra R$ 1.167,60;
- R$ 2.161,17 / 2 = R$ 1.080,585, mas mostra R$ 1.080,03;
- R$ 1.168,20 / 2 = R$ 584,10, mas mostra R$ 583,80.

Como a diferença é proporcional e idêntica nas três cartas, ela parece resultar de um coeficiente/regra de cálculo da proposta, e não de um erro isolado de digitação.

Pendente:
- obter a memória de cálculo/coefficient usado para a parcela reduzida;
- confirmar se o “50%” é arredondamento comercial;
- confirmar se esses valores são os que constarão efetivamente nos boletos iniciais.


2.1A. Alternativas com cartas individuais maiores / outros grupos
Status após resposta de 29/09/2026:
RESOLVIDO PARA O PRODUTO QUINTOANDAR.

Michele informou que, nos grupos do produto QuintoAndar:
- carta mínima = R$200 mil;
- carta máxima = R$400 mil;
- não há cartas individuais de R$600 mil, R$700 mil, R$1 milhão ou R$1,5 milhão dentro desse produto;
- por isso valores maiores são estruturados por desmembramento em várias cotas.

Consequência para a operação de R$1,37 milhão:
- permanecendo no produto QuintoAndar, não é possível concentrar o valor em uma ou duas cartas grandes;
- o número mínimo teórico de cotas, respeitando teto de R$400 mil, é 4;
- a estrutura atual de R$400 mil + R$400 mil + R$370 mil + R$200 mil é compatível com esse limite.

Racional comercial apresentado pela vendedora:
- mais cotas dão mais números para participar dos sorteios;
- cotas menores reduzem o valor nominal associado a cada lance;
- a fragmentação ajudaria a “saúde” do grupo e a competição.

Essas justificativas devem ser tratadas como narrativa comercial até demonstração quantitativa. O benefício objetivo e verificável da fragmentação é:
- múltiplas oportunidades independentes de contemplação;
- maior flexibilidade de combinar créditos;
- porém com maior complexidade operacional e risco de contemplações desencontradas.

Escopo residual:
A resposta foi sobre “nossos grupos do QuintoAndar”. Não foi esclarecido se existem outros grupos Bamaq fora do produto QuintoAndar com cartas maiores e, caso existam, se manteriam cashback/condições.

Decisão:
- para o desenho atual QuintoAndar, considerar o teto de R$400 mil resolvido;
- não manter “cartas maiores dentro do mesmo produto” como alternativa de cenário;
- só reabrir se decidirmos comparar um produto Bamaq fora do QuintoAndar.


2.2. Contemplação individual
Status após respostas de 28/09/2026:
RESPONDIDO COMERCIALMENTE.

Michele informou:
- cada cota recebe número próprio;
- sorteios e lances são apurados individualmente;
- uma cota pode contemplar antes das demais;
- mais de uma cota do mesmo CPF pode contemplar na mesma assembleia;
- cota contemplada antes pode ter o crédito aplicado enquanto as demais continuam concorrendo.

Consequência:
A futura arquitetura multi-cota deve manter status, saldo, lance, contemplação e crédito aplicado próprios para cada cota.


2.3. Probabilidade de sorteio com várias cotas
Status após resposta de 28/09/2026:
PARCIALMENTE RESPONDIDO.

Michele confirmou:
- cada cota tem número próprio;
- mais de uma cota do mesmo titular pode ser contemplada na mesma assembleia;
- por sorteio, múltiplas cotas podem ser contempladas conforme a regra de proximidade da pedra-chave.

Atenção:
“Funcionam de forma independente” operacionalmente não significa necessariamente independência estatística.

Informação que ainda falta:
- quantas cotas são contempladas por sorteio em cada assembleia;
- regra exata da pedra-chave/proximidade;
- universo de cotas ativas concorrentes;
- eventual limite/critério por CPF;
- histórico de assembleias do Grupo 4012.

Como obter:
- regulamento/ata do Grupo 4012;
- histórico das assembleias;
- confirmação operacional da Bamaq.


2.4. Lances, base de cálculo e contemplação por cota
Status após resposta direta de 29/09/2026:
BASE DO LANCE LIVRE E ORDEM DE CLASSIFICAÇÃO RESOLVIDAS COMERCIALMENTE; MEMÓRIA ANTIGA PASSA A SER TRATADA COMO INCONSISTENTE.

Michele confirmou expressamente:
- Lance Livre = percentual do saldo devedor atualizado da cota na data da assembleia;
- os percentuais publicados nas atas (60%–73%) usam exatamente essa mesma base;
- o sistema ordena as ofertas do maior percentual para o menor;
- as contemplações seguem essa ordem até esgotar o saldo disponível no Fundo Comum do mês;
- Lance Embutido continua sendo calculado sobre a carta;
- o embutido reduz o poder de compra;
- a amortização pode reduzir parcela ou prazo;
- lance vencedor deve ser pago em até 2 dias úteis.

REGRA CANÔNICA DO LANCE LIVRE
`L_livre = pct_livre × saldo_devedor_atualizado_na_assembleia`

PARTE EM DINHEIRO COM EMBUTIDO
`L_cash = max(0, L_livre - L_embutido)`

onde o embutido é calculado sobre a carta conforme a regra própria.

RECONCILIAÇÃO DA MEMÓRIA DE 29/09
A memória mostrava:
- saldo R$495.330;
- 45% de Lance Livre;
- R$120 mil embutidos;
- R$105 mil próprios.

Pela regra agora explicitamente confirmada:
- `45% × 495.330 = R$222.898,50`;
- `222.898,50 - 120.000 = R$102.898,50`.

Logo, os R$105 mil próprios / R$225 mil totais do print não devem ser usados como teste oficial do motor. O print é internamente incompatível com a regra confirmada e deve ser tratado como memória/exemplo comercial com erro de cálculo/composição.

ORDEM DE CLASSIFICAÇÃO
`ranking = percentual_livre_descendente`

com contemplação sucessiva enquanto houver capacidade no Fundo Comum.

Pontos ainda abertos:
- faixa/mínimo/máximo regulamentar do Lance Livre;
- critério de desempate quando percentuais forem idênticos;
- mecânica exata do modo “reduzir prazo”;
- eventual detalhe operacional quando o saldo remanescente do Fundo Comum não comportar a próxima cota integralmente.

Decisão:
- não perguntar novamente qual é a base do Lance Livre;
- não alterar o motor para reproduzir R$225 mil;
- considerar a base “saldo devedor atualizado na data da assembleia” fechada para modelagem.


2.4A. Histórico empírico do Lance Livre — Grupo 4012
Status após incorporação da Ata 003 / junho:
SÉRIE DOCUMENTAL COMPLETA DE ABRIL A SETEMBRO; DISTRIBUIÇÃO COMPLETA DE OFERTAS CONTINUA INACESSÍVEL.

Atas incorporadas:
- 27/04/2026 — Assembleia 001;
- 18/05/2026 — Assembleia 002;
- 18/06/2026 — Assembleia 003;
- 20/07/2026 — Assembleia 004;
- 18/08/2026 — Assembleia 005;
- 18/09/2026 — Assembleia 006.

Lances Livres vencedores observados:
- abril: 60,1400% (1 vencedor);
- maio: 60,9867% (1);
- junho: nenhum vencedor por Lance Livre exibido;
- julho: 73,0000% e 72,7300% (2);
- agosto: 70,6877%, 70,5508%, 69,5200%, 68,9081% (4);
- setembro: 73,0000%, 72,0000%, 72,0000%, 72,0000% (4).

Ata 003 / junho:
- 792 cotas ativas não contempladas aptas;
- saldo para assembleia: R$ 501.927,02;
- Lance Fixo vencedor: 30,0000%;
- nenhum Lance Livre vencedor registrado;
- 2 cotas ativas contempladas no total.

Universo de cotas aptas:
- abril: 473;
- maio: 509;
- junho: 792;
- julho: 1.013;
- agosto: 1.258;
- setembro: 1.502.

Leitura:
- 45% permanece abaixo de TODOS os Lances Livres vencedores documentados;
- junho não fornece um Lance Livre “baixo”; fornece ausência de vencedor Livre e um vencedor Fixo de 30%;
- portanto, não misturar o 30% Fixo com a série do Livre;
- a fala comercial de “média ~65%” e “tendência de queda” não é corroborada diretamente pela série de vencedores Livre;
- o crescimento do número de cotas aptas foi forte e monotônico ao longo das seis assembleias.

Limitação estrutural:
Michele informou que os lances individuais são sigilosos e que o conjunto completo de ofertas não é disponibilizado ao cliente.

Logo, não podemos calcular:
- % de lances que perderam;
- taxa de sucesso;
- distribuição de percentuais ofertados;
- tendência no número total de ofertantes.

Decisão:
- encerrar a busca pelo denominador como limitação de dados;
- usar vencedores oficiais apenas como calibração descritiva;
- não criar probabilidade de contemplação;
- manter Lance Fixo e Lance Livre separados.


2.5. Combinação de várias cartas em um único imóvel
Status após resposta de 28/09/2026:
RESPONDIDO COMERCIALMENTE E CONFIRMADO NO REGULAMENTO GERAL DA BAMAQ.

Michele informou:
- é permitido somar duas ou mais cotas contempladas para comprar um único imóvel de maior valor;
- não há, segundo ela, limite numérico rígido de cartas para uma mesma aquisição, desde que as cartas estejam contempladas e pertençam ao mesmo titular/cotitular cadastrado;
- as cartas não precisam pertencer ao mesmo grupo;
- para esta operação, basta que sejam administradas pela Bamaq e estejam sob o mesmo titular/cotitular;
- é possível usar apenas as cotas já contempladas e completar o preço do imóvel com recursos próprios/FGTS, se aplicável.

Confirmação documental:
O Regulamento Geral 2025 da Bamaq, art. 8º, XI, prevê expressamente que o consorciado contemplado pode “reunir créditos para aquisição de bem de valor superior”, inclusive com cotas provenientes do mesmo grupo ou de grupos diferentes.

Consequência:
A futura arquitetura multi-cota deve permitir:
- selecionar um subconjunto das cotas contempladas para uma compra;
- somar os créditos líquidos selecionados;
- complementar eventual diferença com recursos próprios;
- registrar que as cotas não contempladas continuam fora daquela aquisição;
- permitir cotas de grupos Bamaq diferentes, desde que compatíveis com a operação e titularidade.

Pontos residuais:
- confirmar como a garantia/alienação é formalizada quando várias cotas garantem o mesmo imóvel;
- confirmar se “cotitular cadastrado” é suficiente em qualquer combinação;
- confirmar se existe limite operacional interno da Bamaq para quantidade de créditos em uma mesma escritura, ainda que não haja limite regulamentar específico;
- separar essa questão da alegação de “até 150 cotas por CPF”, que precisa de reconciliação própria no item 2.9.

2.6. Rendimento de uma cota pagando outra
Status após resposta de 28/09/2026:
RESPONDIDO.

Regra informada:
O rendimento de cada cota só pode ser usado para abater as parcelas da PRÓPRIA cota.

Logo:
- não existe compensação cruzada de rendimento entre cotas;
- uma cota com rendimento excedente mantém esse excedente no próprio crédito;
- esse excedente não pode cobrir parcela de outra cota que esteja com rendimento insuficiente.

Impacto de modelagem:
Essa regra reforça a necessidade de motor multi-cota. Um modelo agregado pode esconder simultaneamente excesso de rendimento em uma cota e déficit de caixa em outra.

Conclusão:
Na futura arquitetura, cada cota deve manter:
- rendimento próprio;
- parcela própria;
- valor usado para abatimento próprio;
- excedente próprio capitalizado;
- aporte próprio residual, se houver.


2.7. Cashback com múltiplas cotas e lance embutido
Status após resposta de 29/09/2026:
RESOLVIDO COMERCIALMENTE PARA O CENÁRIO ATUAL.

Michele esclareceu expressamente que:
- quando várias cartas são usadas para comprar um único imóvel, a operação é tratada de forma agregada/unificada para faturamento e garantia;
- a comparação imóvel × crédito contratado é feita sobre a soma das cotas da operação;
- no cenário de R$1 milhão de imóvel versus R$1,37 milhão nominais de cartas, o imóvel é inferior ao crédito agregado contratado;
- com 30% de lance embutido, o crédito efetivamente faturado/liberado ao vendedor é R$959 mil;
- o cashback é 10% desse valor líquido.

Cálculo:
`credito_nominal = R$ 1.370.000`
`embutido = R$ 411.000`
`credito_liquido_faturado = R$ 959.000`
`cashback = 10% × 959.000 = R$ 95.900`

A hipótese de R$137 mil fica descartada para este cenário.

Regra operacional:
`Cashback = 10% × credito_liquido_efetivamente_faturado_e_liberado`

No caso multi-cota:
- a análise é agregada;
- não avaliar a exceção cota por cota.

Ressalva:
Antes do aceite definitivo, conferir o contrato/regulamento aplicável. Se houver cláusula conflitante, reabrir a interpretação.

Tratamento fiscal:
Michele afirmou que o cashback é isento de IR. Para o motor:
- considerar entrada líquida de R$95,9 mil;
- não aplicar retenção de IR.
Mas:
- natureza fiscal;
- obrigação de declaração;
- eventual ajuste no custo de aquisição para ganho de capital

continuam fora do escopo até validação tributária específica.


2.8. Compra antes de todas as cotas contemplarem
Status após resposta de 28/09/2026:
PARCIALMENTE RESPONDIDO, COM UMA CONTRADIÇÃO IMPORTANTE ENTRE A RESPOSTA COMERCIAL E O REGULAMENTO GERAL DA BAMAQ.

Michele confirmou:
- se apenas parte das cotas estiver contemplada, é possível usar somente essas cartas + recursos próprios/FGTS e comprar o imóvel;
- as cotas ainda não contempladas continuam normalmente no consórcio;
- segundo ela, quando forem contempladas depois, não poderiam ser usadas para “pagar a si mesmo” nem para simplesmente abater a alienação do mesmo imóvel, porque a Bamaq não admite alienação duplicada;
- ela sugeriu como destinos futuros comprar outro imóvel ou quitar/amortizar outro financiamento imobiliário.

Ponto de reconciliação:
O Regulamento Geral 2025 da própria Bamaq, art. 8º, XII e XIII, prevê que o consorciado contemplado pode optar pela QUITAÇÃO TOTAL de financiamento OU CONSÓRCIO de sua titularidade, com prévia anuência da administradora, desde que:
- o objeto seja da mesma categoria;
- o saldo devedor do financiamento/consórcio seja menor ou igual ao crédito recebido.

A Resolução BCB nº 285/2023 também considera, para essa finalidade, operação de consórcio com crédito já utilizado como “financiamento” e admite quitação total de financiamento de titularidade do consorciado da mesma categoria.

Conclusão provisória:
- a afirmação de que cotas posteriores não podem ser usadas para “amortizar parcialmente” a mesma operação pode estar correta;
- porém, a proibição absoluta de usar cotas posteriores na dívida já existente parece ampla demais, porque o regulamento da Bamaq admite quitação total de consórcio próprio;
- precisamos confirmar especificamente se uma ou mais cotas contempladas posteriormente podem quitar TOTALMENTE o saldo devedor das cotas Bamaq que já foram usadas na compra daquele mesmo imóvel, com substituição/liberação das garantias.

Informação que ainda falta:
- Pode uma cota Bamaq posterior quitar integralmente outra cota/consórcio Bamaq já utilizado no mesmo imóvel?
- Se uma única carta posterior não cobrir o saldo total, podem ser reunidas 2 ou mais cartas posteriores para atingir a quitação total?
- A quitação total precisa ocorrer cota a cota ou pode quitar o saldo agregado das cotas que financiaram o imóvel?
- Como ficam os gravames/alienação fiduciária após essa quitação?
- Existe algum intervalo mínimo ou restrição operacional?
- “Amortizar outro financiamento imobiliário” é realmente permitido de forma parcial ou a regra formal é apenas QUITAÇÃO TOTAL?

Impacto de modelagem:
Este ponto pode mudar muito o valor econômico das contemplações escalonadas. Não implementar uma proibição rígida antes da resposta formal.

Como obter:
- perguntar diretamente à Michele/Bamaq citando o art. 8º, XII e XIII do Regulamento Geral;
- pedir um exemplo operacional de “carta posterior quitando consórcio já utilizado”;
- pedir como é feita a baixa/substituição da garantia.

2.9. Limite de cotas por CPF / por grupo
Status após resposta de 28/09/2026:
INFORMAÇÃO COMERCIAL A RECONCILIAR.

Michele mencionou “limite regulamentar para compra/posse por CPF de até 150 cotas no total”.

Verificação documental/regulatória:
- a Resolução BCB nº 285/2023, art. 9º, estabelece limite de 10% das cotas ativas de um mesmo grupo para um mesmo consorciado, com cálculo cumulativo para cônjuge/companheiro;
- o Regulamento Geral 2025 da Bamaq repete o limite de 10% por grupo;
- não encontramos, nessas fontes atuais, uma regra geral de “150 cotas no total por CPF”.

Conclusão:
Não usar 150 como limite regulamentar no software ou nos documentos até identificar a fonte.

Possibilidades:
- pode ser política interna de crédito/comercial da Bamaq;
- pode ser limite específico da parceria QuintoAndar;
- pode ser regra de outro produto/grupo;
- ou apenas erro de comunicação.

Como obter:
Perguntar à Michele qual norma, cláusula ou política estabelece as 150 cotas.

============================================================
3. PRIORIDADE MÉDIA — CRÉDITO RESIDUAL E VALORES MANUAIS [A8]
============================================================


3.1. Crédito residual após comprar imóvel mais barato [A8]
Status após resposta de 28/09/2026:
REGRA GERAL CONFIRMADA REGULATORIAMENTE; RESPOSTA COMERCIAL DA MICHELE TEM DUAS IMPRECISÕES IMPORTANTES.

Michele informou, usando exemplo de R$ 1 milhão de crédito e imóvel de R$ 900 mil:
- até 10% do valor da carta pode ser usado para ITBI, escritura, registro/cartório;
- o restante não utilizado seria automaticamente destinado a abater o saldo devedor;
- esse abatimento poderia reduzir parcelas restantes ou encurtar prazo;
- não seria possível receber o “troco” em dinheiro após a compra;
- antes da conclusão da compra, o saldo ainda não usado continuaria aplicado/rendendo;
- não seria permitido usar a sobra para reforma livre ou móveis planejados.

Verificação oficial — Resolução BCB nº 285/2023, art. 15, §3º:
Se o bem adquirido custar menos que o crédito, a diferença deve ser utilizada, A CRITÉRIO DO CONSORCIADO, para uma das seguintes finalidades:
1. pagamento de obrigações financeiras vinculadas ao bem/serviço, observado limite total de 10% do crédito, incluindo despesas de transferência, tributos, registros, seguros, tarifas/ressarcimentos permitidos;
2. quitação de prestações vincendas, na forma estabelecida no contrato;
3. devolução em espécie/transferência ao consorciado, desde que suas obrigações financeiras perante o grupo e a administradora estejam quitadas.

Verificação no Regulamento Geral 2025 da Bamaq:
O art. 8º, VIII, repete a lógica:
- até 10% para despesas vinculadas;
- quitação de prestações vincendas em ORDEM INDIRETA;
- devolução em espécie se as obrigações com o grupo estiverem integralmente quitadas.
O art. 15 também prevê antecipação do saldo devedor em ordem indireta, inclusive com a diferença do crédito quando o bem adquirido custa menos.

Conclusões importantes:
- NÃO é correto tratar a sobra como “automaticamente destinada à dívida” sem escolha do consorciado;
- NÃO é correto afirmar de forma absoluta que nunca pode haver devolução em dinheiro: ela é permitida quando as obrigações com grupo/administradora estiverem quitadas;
- no Regulamento Geral Bamaq, a forma identificada para usar a sobra na dívida é quitação de prestações vincendas em ORDEM INDIRETA, o que tende a encurtar prazo; não encontramos nessa regra geral autorização expressa para simplesmente reduzir o valor de todas as parcelas futuras;
- a negativa para reforma livre/móveis planejados é compatível com as destinações listadas para a diferença após aquisição do bem;
- enquanto a compra ainda não foi concluída/valor não utilizado, a parcela do crédito continua vinculada à contemplação e remunerada até sua utilização, conforme a regra geral já documentada.

Estado atual do software — V3.14:
PARCIALMENTE RESOLVIDO COM POLÍTICA CONSERVADORA.

O motor deixou de preservar a sobra como ativo genérico.

Implementado:
A. “não assumir destinação”: residual rastreado, mas excluído do patrimônio comparável;
B. “usar em custos de aquisição”: reduz o desembolso do bolso até o teto configurável; eventual sobra continua não alocada e fora do patrimônio comparável.

Ainda não implementado:
C. quitação de prestações vincendas / antecipação do saldo conforme contrato;
D. devolução em dinheiro quando as obrigações estiverem integralmente quitadas.

Portanto, a falha de superestimar patrimônio com “residual congelado” está resolvida. A pendência remanescente é ampliar as políticas quando a mecânica contratual estiver suficientemente definida.

Pontos ainda a confirmar com a Bamaq:
- no Grupo 4012, a antecipação com crédito residual é obrigatoriamente em ordem indireta?
- existe alguma opção específica do contrato do grupo para reduzir valor da parcela, além de encurtar prazo?
- quais despesas imobiliárias exatamente a Bamaq aceita dentro dos 10% (ITBI, RGI, escritura, avaliação, seguros, outras)?
- quando há várias cotas na mesma compra, o limite de 10% é calculado individualmente por cota/crédito ou sobre a soma dos créditos utilizados?
- se todas as obrigações forem quitadas no próprio fechamento, o residual pode ser transferido ao consorciado imediatamente ou existe prazo/procedimento adicional?

Como obter:
- pedir à Bamaq confirmação específica do Grupo 4012;
- usar o art. 15, §3º, da Resolução BCB nº 285/2023 e art. 8º, VIII / art. 15 do Regulamento Geral Bamaq como referência.

3.2. Valores manuais em compra futura
Precisamos resolver:
Definir se preço, aluguel, RGI e custos digitados manualmente são:
- valores em R$ de hoje; ou
- valores nominais esperados no mês futuro.

Como obter:
Não depende de terceiros; é decisão de UX/modelagem.

Possível solução:
Adicionar seletor:
[ ] valor em R$ de hoje — corrigir pela inflação
[ ] valor nominal no mês da compra

============================================================


4. PRIORIDADE MÉDIA — FUNDO DE RESERVA [A12]
============================================================

Status após respostas de 28/09/2026:
REGRA ECONÔMICA PRINCIPAL CONFIRMADA; PERCENTUAL DE RATEIO E TIMING EXATO CONTINUAM ABERTOS.

Michele confirmou:
- se houver saldo remanescente no Fundo de Reserva ao final do grupo, ele é devolvido proporcionalmente aos cotistas ativos;
- os recursos do Fundo de Reserva permanecem aplicados durante a vida do grupo;
- os rendimentos da aplicação também integram o montante do próprio Fundo de Reserva;
- cotas contempladas, utilizadas ou quitadas continuam participando do rateio enquanto permanecerem ativas e não tiverem sido canceladas/desistidas;
- segundo ela, o Fundo de Reserva seria aplicado em fundo conservador como o Itaú Premium.

Confirmação formal no Regulamento Geral Bamaq:
- art. 53: o Fundo de Reserva é constituído pelas contribuições destinadas à sua formação E pelos rendimentos da aplicação dos recursos do próprio fundo;
- art. 55: eventual saldo remanescente após a última assembleia é disponibilizado aos consorciados ativos que não tenham sido excluídos nem solicitado desistência;
- art. 61: em até 60 dias contados da última assembleia, a Bamaq deve comunicar aos consorciados que os saldos remanescentes de fundo comum/reserva estão disponíveis para devolução em espécie, proporcionalmente às prestações pagas;
- art. 62: o encerramento contábil deve ocorrer em até 120 dias contados da última assembleia.

Confirmação regulatória:
A Resolução BCB nº 285/2023 determina o rateio dos saldos remanescentes do fundo comum e, se houver, do fundo de reserva entre os consorciados ativos.

Conclusões:
1. A12 está resolvido quanto à existência do direito ao rateio: se houver saldo, ele é distribuído.
2. A cota quitada não deve ser eliminada do estado “ativo” do modelo apenas porque sua dívida chegou a zero; ela pode continuar elegível ao rateio final.
3. O rateio não é simplesmente “devolver o 1% pago”. O Fundo de Reserva pode ter sido parcialmente consumido e também recebe rendimentos financeiros.
4. Por isso, o melhor input futuro é um valor/percentual de RATEIO FINAL estimado, e não uma devolução mecânica da contribuição original.

Divergência de timing:
Michele informou:
- até 120 dias após a última assembleia para o encerramento contábil;
- devolução do Fundo de Reserva em até 60 dias APÓS o encerramento contábil.

Isso não coincide com o Regulamento Geral Bamaq atualmente disponível:
- art. 61: comunicação/disponibilização em até 60 dias DA ÚLTIMA ASSEMBLEIA;
- art. 62: encerramento contábil em até 120 dias DA ÚLTIMA ASSEMBLEIA.

Logo, não registrar “120 + 60 dias” como regra até confirmação de procedimento operacional mais recente.

Pontos ainda abertos:
- qual percentual/valor costuma efetivamente sobrar em grupos imobiliários Bamaq;
- prazo real de crédito em conta, distinto da mera comunicação de disponibilidade;
- se houve regulamento/aditivo posterior alterando os prazos dos arts. 61 e 62;
- nome/CNPJ exato da aplicação utilizada atualmente pelo Grupo 4012 para o Fundo de Reserva;
- se o Itaú Premium citado é a aplicação efetiva deste grupo ou apenas um exemplo;
- como são tratados rateios adicionais decorrentes de recuperações posteriores.

Impacto de modelagem:
O motor atual continua conservador demais ao tratar todo o Fundo de Reserva como custo perdido.

Mudança futura recomendada:
- manter default conservador de rateio = 0 apenas como stress;
- adicionar `rateioFinalReserva` manual ou sensibilidade sobre as contribuições pagas;
- permitir valor superior a 100% das contribuições originais se o input for definido como razão de rateio, pois o fundo incorpora rendimentos;
- manter a cota quitada como participante ativo elegível ao encerramento;
- modelar o recebimento com defasagem própria, depois de confirmar o timing correto.

Como obter:
- pedir histórico de grupos Bamaq encerrados;
- pedir extrato real de rateio;
- pedir confirmação do prazo 60 dias × 120+60;
- pedir nome/CNPJ da aplicação efetiva do Grupo 4012.

============================================================
5. PRIORIDADE MÉDIA — RESGATE EM DINHEIRO
============================================================



5.1. Compensação do saldo com a própria carta
Status após resposta de 28/09/2026:
RESGATE PÓS-180 DIAS: QUITAÇÃO PRÉVIA CONFIRMADA.
COMPENSAÇÃO DIRETA: NÃO CONFIRMADA; RESPOSTA COMERCIAL INDICA QUE NORMALMENTE NÃO HÁ NETTING AUTOMÁTICO.

Michele informou:
- é necessário aguardar 180 dias da contemplação;
- a cota precisa estar 100% quitada para o crédito ser transferido em dinheiro;
- a Bamaq não faria simplesmente `carta - saldo devedor = líquido` no resgate após 180 dias;
- o saldo deveria ser integralmente quitado antes;
- a quitação pode vir de recursos próprios e, segundo ela, em alguns casos de encerramento, rendimentos acumulados poderiam ser usados internamente.

Verificação formal:
- Resolução BCB nº 285/2023, art. 15, §2º, exige que as obrigações financeiras perante o grupo e a administradora estejam quitadas antes do recebimento em espécie;
- o FAQ do Banco Central traz a mesma regra;
- o Regulamento Geral Bamaq, art. 61, também condiciona o recebimento em espécie no encerramento a obrigações quitadas.

Conclusão:
Para o RESGATE APÓS 180 DIAS, o simulador não deve assumir compensação automática `carta - saldo`.

Ponto residual:
Michele afirma que, NO ENCERRAMENTO DO GRUPO, pode haver liquidação interna usando recursos/rendimentos da própria cota. Isso precisa de confirmação formal, pois o Regulamento Geral encontrado não descreve esse mecanismo de netting.

Impacto de software:
- separar claramente dois modos:
  1. resgate voluntário pós-180 dias: exige quitação prévia;
  2. encerramento do grupo: regra de liquidação interna ainda pendente.
- o atual modo de “compensação direta” não deve permanecer como default do resgate pós-180 dias.

Como obter:
- pedir à Bamaq procedimento formal de resgate pós-180 dias;
- perguntar especificamente sobre a liquidação no encerramento.

5.2. Tributação do rendimento no resgate [A11 / R1]
Status:
FORTEMENTE REDUZIDO COMO PENDÊNCIA.

A Resolução BCB nº 285/2023 exige que o crédito seja acrescido dos rendimentos líquidos financeiros da aplicação. Michele afirmou que a Bamaq repassa o rendimento líquido ao crédito e não cobra taxa adicional de gestão financeira sobre ele.

Conclusão de modelagem:
- não aplicar automaticamente outro IR sobre os rendimentos já líquidos;
- manter qualquer “IR/custo adicional do resgate” apenas como sensibilidade avançada, default 0%;
- evitar dupla tributação no simulador.

Pontos residuais:
- confirmar se existe evento fiscal adicional no recebimento em espécie pelo consorciado;
- confirmar informe de rendimentos;
- confirmar custos operacionais específicos do resgate, se houver.

============================================================
6. PRIORIDADE MÉDIA — VENDA/TRANSFERÊNCIA DA COTA [A14]
============================================================


6.1. Base da taxa de transferência
Status após resposta de 28/09/2026:
REGRA PRINCIPAL CONFIRMADA NO REGULAMENTO BAMAQ 2026; A RESPOSTA DA MICHELE ERROU A BASE DE CÁLCULO.

Michele informou:
- taxa de análise de crédito/cadastro: R$ 150;
- taxa de transferência: 1%;
- base: valor total do crédito atualizado da cota;
- teto: R$ 1.000;
- não haveria isenção QuintoAndar.

Regulamento Geral Bamaq 2026 — art. 13:
- taxa de cadastro: R$ 150;
- taxa de transferência do contrato: 1% do SALDO DEVEDOR DA CONTA DE CONSÓRCIO;
- teto da taxa de transferência: R$ 1.000;
- se a cota estiver contemplada e já houver bem em posse/garantia, podem existir ainda despesas adicionais com cadastros, gravames/baixa, registros e despachantes.

Regulamento Geral Bamaq 2026 — art. 60:
- a transferência depende de anuência/aprovação da Administradora;
- para cota contemplada, o novo titular passa por análise cadastral e apresentação de documentos;
- a cessão só se aperfeiçoa após aprovação do cadastro;
- não é permitida cessão sem manifestação formal favorável da Bamaq.

Conclusão:
Para transferência normal de uma cota contemplada ainda NÃO utilizada em imóvel:
- base documental da taxa = saldo devedor, não carta/crédito atualizado;
- taxa = min(1% × saldo devedor, R$ 1.000);
- taxa de cadastro de R$ 150 existe no regulamento e Michele informou que ela é cobrada na análise do novo titular;
- como ainda não há bem alienado, despesas de baixa/gravame não deveriam existir nesse cenário específico, salvo outra exigência operacional.

Exemplo:
Se a cota tiver:
- carta/crédito atualizado: R$ 400 mil;
- saldo devedor: R$ 250 mil;

a fórmula documental seria:
1% × R$ 250 mil = R$ 2.500 → taxa limitada a R$ 1.000.

Portanto, neste exemplo o teto esconde a diferença de base. Para saldos abaixo de R$ 100 mil, porém, usar carta em vez de saldo devedor produziria cobrança errada no simulador.

EXCEÇÃO PROMOCIONAL QUINTOANDAR
A afirmação “não há isenção QuintoAndar” é ampla demais.

O Regulamento da Campanha QuintoAndar/Bamaq, item 4.2.4, prevê ISENÇÃO DA TAXA DE TRANSFERÊNCIA quando:
- a cota é NÃO CONTEMPLADA;
- houve pelo menos 60 contribuições;
- o consorciado está adimplente;
- o próprio QuintoAndar adquire a cota no mecanismo promocional “Saque do Saldo Acumulado”.

Logo:
- para a venda de uma COTA CONTEMPLADA a um terceiro, objeto da pergunta atual, não identificamos isenção promocional;
- para a venda promocional de COTA NÃO CONTEMPLADA diretamente ao QuintoAndar nos termos da campanha, existe isenção expressa.

Estado atual do software:
RESOLVIDO NA V3.13.

A cessão agora calcula, para cada cota:

`taxa_j = min(saldoDevedorCota_j × pct_taxa, teto_por_cota)`

e soma as tarifas das cotas transferidas.

A oferta de compra não participa da base da tarifa.

Ainda permanece separado:
- taxa de cadastro;
- demais custos;
- eventual isenção promocional específica.

O que ainda falta:
- confirmar se os R$ 150 são cobrados uma vez por cota transferida ou por cadastro/cessionário;
- confirmar quem paga cada tarifa por padrão (cedente, cessionário ou livre negociação);
- confirmar se a taxa de cadastro também é dispensada em alguma condição;
- obter o procedimento/prazo operacional de aprovação da transferência;
- confirmar se existe tarifa adicional específica para cota contemplada SEM bem já adquirido.

Como obter:
- pedir à Bamaq a tabela/tarifário vigente;
- pedir exemplo de memória de transferência de cota contemplada ainda sem uso do crédito.


6.2. Tributação da cessão
Status:
CONTINUA PENDENTE.

A resposta de Michele tratou apenas das tarifas cobradas pela Bamaq e não esclareceu o tratamento tributário da negociação entre cedente e comprador.

O simulador continua usando eventual imposto/custo fiscal apenas como sensibilidade.

Precisamos resolver:
- qual é a natureza tributária da venda/cessão da cota por pessoa física;
- qual é a base de custo fiscal;
- quais parcelas, lances e tarifas podem compor o custo;
- se eventual ágio recebido sobre o custo representa ganho de capital;
- se existe isenção aplicável;
- como declarar a operação.

Observação:
A administradora não define o preço de negociação entre cedente e cessionário; a operação econômica entre as partes deve permanecer separada das tarifas Bamaq.

Como obter:
Consultar contador/tributarista e, se necessário, Receita Federal antes de transformar qualquer alíquota em default.

============================================================
7. PRIORIDADE MÉDIA — VENDA DO IMÓVEL E GARANTIA
============================================================


7.1. Venda do imóvel antes da quitação / substituição de garantia
Status após resposta de 28/09/2026:
REGRA PRINCIPAL CONFIRMADA COMERCIALMENTE E EM FONTES OFICIAIS DA BAMAQ; CRITÉRIO EXATO DE VALOR, CUSTOS E PRAZO AINDA PRECISAM DE FORMALIZAÇÃO.

Michele confirmou que existem dois caminhos principais para vender um imóvel ainda alienado à Bamaq:

A) SUBSTITUIÇÃO DE GARANTIA
- o consórcio permanece ativo;
- outro imóvel passa a garantir a dívida;
- o novo bem passa por análise jurídica/documental e vistoria/avaliação;
- só depois da conclusão da substituição e da baixa da alienação do imóvel original ele é liberado para venda;
- Michele informou prazo operacional típico de 15 a 30 dias úteis;
- informou custo de vistoria em torno de 1 salário mínimo, além de custos cartorários para novo gravame e baixa do antigo.

B) QUITAÇÃO NA PRÓPRIA VENDA
- se o comprador pagar à vista ou por financiamento, o saldo devedor pode ser quitado diretamente junto à Bamaq;
- a Bamaq atua operacionalmente como interveniente quitante;
- após quitação, o gravame é liberado sem necessidade de substituir a garantia por outro imóvel.

Confirmação em fonte oficial Bamaq:
A Central de Ajuda QuintoAndar/Bamaq informa que:
- a venda do bem alienado só é permitida se a cota estiver quitada OU mediante substituição de garantia;
- na substituição, o novo bem precisa estar QUITADO e registrado em nome do consorciado;
- após cumprimento das exigências e conclusão do processo, a Bamaq retira a alienação do bem original, permitindo a venda.

Regulamento Bamaq 2026:
- art. 38: o bem móvel ou imóvel dado em alienação/hipoteca pode ser substituído mediante prévia autorização da Administradora e pagamento das taxas/despesas;
- art. 36: a Administradora pode recusar a garantia apresentada;
- art. 37, §1º: a Bamaq dispõe de 5 dias úteis para apreciar a documentação relativa às garantias a partir da entrega completa;
- art. 37, §2º: para imóveis, a Bamaq emite documento autorizando a baixa da alienação/hipoteca;
- o regulamento também prevê despesas de avaliação, registros, gravames e respectivas baixas como encargos do consorciado.

Ponto muito importante que Michele não mencionou explicitamente:
A Central de Ajuda oficial afirma que o imóvel substituto precisa estar:
- quitado; e
- registrado em nome do próprio consorciado.

Isso torna a substituição menos flexível do que simplesmente “indicar qualquer outro imóvel de valor suficiente”.

CRITÉRIO DE VALOR — AINDA AMBÍGUO
Michele informou:
“o novo imóvel precisa ter avaliação igual ou superior ao saldo devedor restante da cota (ou ao valor do crédito original, dependendo da análise patrimonial).”

Essa formulação ainda não é suficientemente objetiva para o simulador.

Fontes formais consultadas:
- Regulamento 2026, art. 8º, III: garantia imobiliária deve ser compatível com o crédito liberado;
- art. 38: permite substituição, mas não fixa no texto geral uma fórmula única de `valor mínimo = saldo devedor` ou `valor mínimo = crédito original`;
- Central de Ajuda: exige bem que atenda às características de aquisição, quitado e em nome do consorciado.

Precisamos confirmar:
- qual é a regra objetiva de valor para o Grupo 4012;
- se o mínimo é saldo devedor, saldo devedor com margem, crédito originalmente liberado ou outro critério;
- em que situações a análise patrimonial exige garantia superior ao saldo;
- se várias cotas estão garantidas pelo mesmo imóvel, o valor mínimo considera soma dos saldos;
- se um mesmo novo imóvel pode substituir simultaneamente a garantia de várias cotas.

CUSTOS
Michele informou:
- vistoria/engenharia em torno de 1 salário mínimo;
- cartório para registro da nova alienação e baixa da antiga.

O Regulamento confirma que avaliação, registros, gravames/baixas e despesas da substituição podem ser cobrados, mas não fixa o valor de “1 salário mínimo”.

Precisamos obter:
- tabela/tarifário atualizado da avaliação;
- custos administrativos adicionais, se houver;
- se a avaliação é paga diretamente à empresa credenciada ou à Bamaq;
- se o valor varia por cidade/tipo de imóvel;
- se existe nova análise de crédito/cadastro.

PRAZO
Michele informou 15 a 30 dias úteis para o processo completo.
O Regulamento 2026 prevê 5 dias úteis apenas para apreciação da documentação de garantia após entrega completa. Isso NÃO contradiz necessariamente os 15–30 dias totais, pois avaliação, documentos, aditivo e cartório podem ampliar o prazo.

Precisamos confirmar:
- SLA formal, se existir;
- qual parte do prazo depende da Bamaq e qual depende do cartório;
- se a venda pode ser assinada sob condição antes da baixa ou se a escritura/registro da venda só pode ocorrer depois da substituição concluída.

Estado atual do software:
O simulador permite escolher entre:
- quitar o consórcio na venda; ou
- manter a dívida com substituição de garantia.

Mas hoje a opção “substituir garantia” é abstrata demais. A próxima versão deve poder representar:
- existência de imóvel substituto elegível;
- valor do imóvel substituto;
- custo de avaliação;
- custos cartorários;
- defasagem de tempo;
- garantia externa ao patrimônio modelado;
- ou quitação direta pelo comprador/financiador na venda.

Como obter:
- pedir procedimento formal/tarifário da Bamaq;
- confirmar a regra de valor do novo imóvel;
- pedir confirmação da condição “quitado e em nome do consorciado”;
- pedir exemplo/documento de operação com interveniente quitante.

7.2. Empréstimo do lance — quitação, taxa e indexador
Precisamos resolver:
A mecânica financeira está modelada, inclusive com sensibilidade opcional de TR, mas ainda precisamos reproduzir as condições contratuais do crédito real.

Status da modelagem:
- Desde a V2.51, o simulador aceita uma TR projetada anual independente, com default de 0%.
- Quando informada, a TR é convertida em equivalente mensal e corrige o saldo antes dos juros.
- Essa implementação é uma sensibilidade de cenário; não afirma que o empréstimo real terá TR nem que a fórmula contratual será exatamente essa.

Informação que falta:
- A taxa informada para o empréstimo é prefixada ou acrescida de indexador?
- Se houver indexador: TR, IPCA, CDI ou outro?
- Qual é a periodicidade e a fórmula exata de atualização do saldo?
- A correção monetária ocorre antes dos juros/amortização?
- Qual é o CET efetivo?
- Há IOF, tarifa de contratação ou seguro embutido?
- Há multa/tarifa na quitação antecipada?
- Qual é a regra para cálculo do saldo de quitação em determinada data?

Como obter:
- Quando houver proposta concreta de crédito, pedir CET e minuta/contrato da instituição financeira.
- Confirmar por escrito se a taxa anunciada é “fixa” ou “+ indexador”.
- Pedir uma memória de cálculo de pelo menos uma prestação e do saldo após alguns meses para validar a fórmula do simulador.

============================================================

8. PRIORIDADE MÉDIA — CASHBACK: BASE, TIMING E TRATAMENTO FISCAL
============================================================

Status após resposta final de 29/09/2026:
A REGRA MULTI-COTA FOI RECONCILIADA COMERCIALMENTE PARA O CENÁRIO ATUAL.

As cotações exibem cashback nominal:
- R$ 400 mil → R$ 40 mil;
- R$ 400 mil → R$ 40 mil;
- R$ 370 mil → R$ 37 mil;
- R$ 200 mil → R$ 20 mil;
- total destacado = R$ 137 mil.

Entretanto, Michele agora respondeu especificamente que, usando 30% de lance embutido nas quatro cotas:
- crédito líquido = R$ 959 mil;
- cashback = R$ 95,9 mil.

Portanto, os R$137 mil das propostas não devem ser tratados como benefício fixo independente do embutido.

8.0. Interpretação agregada da exceção do regulamento

Segundo a resposta comercial final:
- a comparação imóvel × crédito contratado é feita sobre a operação agregada, e não cota por cota;
- no exemplo, R$1 milhão de imóvel < R$1,37 milhão de crédito nominal agregado;
- com 30% de embutido, a base efetiva do cashback é o crédito líquido faturado/liberado de R$959 mil;
- cashback do cenário = R$95,9 mil.

A antiga bifurcação R$95,9 mil versus R$137 mil fica encerrada comercialmente para este cenário. Reabrir apenas se contrato/regulamento final trouxer regra divergente.

8.1. Momento do pagamento

Michele reiterou:
- pagamento por PIX/conta;
- até 7 dias úteis após a compra no cartório.

Regulamento da Campanha, item 4.1.2:
- pagamento em conta bancária de titularidade do consorciado;
- até 5 dias úteis;
- contados do registro da alienação na matrícula E do pagamento do crédito ao vendedor.

Conclusão:
- comercialmente, 7 dias foi reiterado;
- documentalmente, 5 dias continua sendo a regra disponível;
- pedir eventual aditivo/regulamento mais novo;
- para especificação contratual, manter 5 dias úteis até prova posterior.

Estado atual do software:
Desde a V3.12, o cashback entra por default no mês seguinte à compra. A divergência documental residual é apenas 5 versus 7 dias úteis.

8.2. Livre movimentação

Confirmado pelo Regulamento, item 4.1.4:
- cashback é creditado em conta bancária de titularidade do consorciado;
- pode ser usado livremente;
- inclusive pode pagar parcelas futuras do consórcio.

Portanto:
- cashback NÃO é crédito vinculado ao imóvel;
- cashback NÃO é aporte próprio;
- depois de recebido, é caixa livre da estratégia.

8.3. Tratamento fiscal

Michele afirmou que o cashback recebido “não é tributado / é isento de IR”.

O Regulamento da Campanha NÃO contém essa conclusão fiscal.

Não encontramos nesta rodada uma fonte oficial da Receita Federal específica para esse benefício promocional que permita tratar a frase como regra fiscal definitiva.

Pendência fiscal real:
- confirmar se o cashback é tratado como desconto/rebate de aquisição, rendimento isento/não tributável ou outra categoria;
- confirmar se ele altera o custo fiscal de aquisição do imóvel para futuro cálculo de ganho de capital;
- confirmar eventual obrigação de informar o valor na DIRPF.

Até confirmação:
- não cobrar IR no momento do recebimento no simulador;
- mas também não afirmar “isento” como fato jurídico;
- manter possível impacto na base fiscal da futura venda como pendência.

8.4. Vigência da campanha / trava da proposta — URGENTE
Status após resposta específica de 29/09/2026:
MARCO OPERACIONAL COMERCIALMENTE RESOLVIDO.

Fluxo informado para efetivar a entrada dentro da condição atual:
1. emissão/homologação do contrato;
2. recebimento por e-mail;
3. aceite eletrônico;
4. pagamento da primeira parcela até 30/09.

Após aceite + pagamento, segundo a vendedora:
- o cliente entra no plano;
- grupo e número de cota são alocados;
- acesso ao aplicativo é liberado;
- passa a participar das assembleias.

Regra operacional registrada:
`adesao_operacional = contrato_emitido AND aceite_eletronico AND primeira_parcela_paga`

A emissão isolada do contrato não deve ser tratada como suficiente. Conferir o contrato final antes do aceite e pagamento.

Estado:
- validade comercial até 30/09: CONFIRMADA;
- marco operacional de adesão/lock: RESPONDIDO COMERCIALMENTE;
- segunda parcela em 15/11: INFORMADA COMERCIALMENTE.

============================================================
9. PRIORIDADE BAIXA — PREMISSAS FISCAIS DO ALUGUEL [A18]
============================================================

Precisamos resolver:
Hoje usamos alíquota efetiva fixa como aproximação.

Informação que falta:
- Despesas dedutíveis.
- Alíquota efetiva correta.
- Tratamento de condomínio, IPTU, administração e manutenção.

Como obter:
Consultar contador ou Receita Federal.

============================================================

10. PRIORIDADE BAIXA — SEGUROS E CUSTOS ACESSÓRIOS [A18]
============================================================

Status após resposta de 28/09/2026:
SEGURO PRESTAMISTA CONFIRMADO COMO OPCIONAL; REGRA EXATA DE CÁLCULO, COBERTURA E ELEGIBILIDADE AINDA PRECISA DE DOCUMENTO DA SEGURADORA/BAMAQ.

10.1. Seguro prestamista

Michele informou:
- o Seguro Prestamista é 100% opcional no Consórcio QuintoAndar/Bamaq;
- se contratado, o custo não seria um valor fixo em reais;
- seria calculado percentualmente e distribuído nas parcelas vincendas;
- cobertura máxima informada: até R$ 800 mil por cota;
- participantes com mais de 70 anos não poderiam contratar o seguro;
- para esse perfil, na contemplação seria obrigatória a apresentação de avalista;
- segundo ela, o seguro poderia ser contratado na adesão ou solicitado ao longo do contrato.

Em áudio posterior, Michele reforçou esse ponto:
- a proposta atual está SEM seguro;
- se o cliente quiser, pode contratar o seguro desde o início;
- também pode solicitar inclusão depois;
- se entrar depois, o valor é calculado no momento da inclusão, conforme a situação da cota naquele momento.

Confirmação em fonte oficial Bamaq:
A Central de Ajuda da Bamaq diz que o Seguro Prestamista:
- é opcional;
- pode ser adquirido no momento da contratação;
- compõe a parcela somente “se houver”.

O Regulamento Geral Bamaq 2026 também prevê que prestações podem incluir seguro de vida/acidentes pessoais “caso tenha contrato”, o que é compatível com caráter facultativo.

Conclusão:
- o default atual `seguro = desativado` está correto para esta proposta;
- o simulador NÃO deve incluir custo de seguro por padrão;
- a atual seção de seguro continua útil como sensibilidade;
- porém, os três modos genéricos atuais (fixo, % parcela, % saldo) ainda NÃO representam necessariamente a fórmula real do produto.

Ponto de modelagem importante:
A frase “calculado percentualmente e dividido nas parcelas vincendas” pode significar:
A) prêmio total calculado como percentual de uma base e parcelado pelo prazo restante; ou
B) prêmio mensal calculado percentualmente a cada parcela/saldo.

Essas duas mecânicas são economicamente diferentes. Não escolher uma sem memória de cálculo.

Informação que ainda falta:
- nome da seguradora e certificado/condições gerais;
- qual é a base exata do percentual: crédito, saldo devedor, capital segurado, parcela ou outra;
- qual é a taxa do prêmio;
- se o percentual muda com idade, prazo ou risco;
- contratação posterior está agora confirmada comercialmente; ainda faltam janela, carência, elegibilidade e fórmula aplicada no momento da inclusão;
- quando a cobrança começa e termina;
- quais coberturas exatas existem (morte, invalidez etc.);
- se a cobertura é sobre saldo devedor, parcelas futuras ou valor segurado fixo;
- confirmar documentalmente o teto de R$ 800 mil por cota;
- confirmar documentalmente a regra etária (>70 anos) e a exigência de avalista;
- em caso de várias cotas, se seguro/elegibilidade é analisado individualmente por cota.

Como obter:
- solicitar certificado/apólice/condições do Seguro Prestamista;
- pedir uma simulação real de uma cota de R$ 400 mil COM seguro, mostrando prêmio total, percentual, base e parcela;
- pedir regra de elegibilidade/idade por escrito.

10.2. Custos recorrentes da proposta

Além da mensagem comercial, os materiais de cotação reforçam:
- Taxa de Adesão / Entrada: R$ 0,00;
- Seguro Prestamista: opcional;
- avaliação/vistoria pós-contemplação: aproximadamente 1 salário mínimo por imóvel;
- cashback de 10% destacado por cota.

Michele informou, para esta operação:
- Taxa de Administração: 24% total ao longo do plano;
- Fundo de Reserva: 1% total;
- Seguro Prestamista: somente se contratado;
- Taxa de cadastro/adesão na entrada: R$ 0.

Observação documental:
O Regulamento Geral 2026 é genérico e admite taxa de adesão “se for o caso” e contém taxa de cadastro de R$ 150 entre pagamentos possíveis. Portanto, “R$ 0 na entrada” deve ser tratado como condição específica da proposta QuintoAndar, não como regra universal da Bamaq.

Confirmação desejável:
- proposta/contrato das quatro cotas mostrando taxa de adesão = 0;
- primeira cobrança sem tarifa adicional.

10.3. Pós-contemplação / liberação do crédito

Nova inconsistência numérica nas mensagens:
Michele escreveu que seria possível usar até 10% do valor da carta para ITBI/cartório e colocou entre parênteses “até R$ 123,3 mil”.

Porém:
- 10% de R$ 1,37 milhão = R$ 137 mil;
- R$ 123,3 mil = 10% de R$ 1,233 milhão;
- R$ 1,233 milhão corresponde exatamente a R$ 1,37 milhão menos 10% (R$ 137 mil).

Esse número pode estar refletindo, por exemplo, um cenário em que 10% das cartas foram usados como lance embutido, mas isso NÃO foi explicitado na mensagem. Portanto, não devemos registrar R$ 123,3 mil como teto geral.

Michele informou:
- análise de crédito do consorciado: gratuita;
- vistoria/avaliação do imóvel: cobrada, em torno de 1 salário mínimo;
- cartório/registro e ITBI: responsabilidade do comprador;
- até 10% do crédito pode ser usado para despesas elegíveis de documentação, conforme regra já tratada no item 3.1.

O Regulamento 2026 confirma a existência de avaliação prévia do imóvel por empresa terceira indicada pela Bamaq, mas não fixa no texto geral o preço de “1 salário mínimo”.

Pendente:
- tarifário oficial da avaliação/vistoria;
- confirmar se existe qualquer outra tarifa de liberação do crédito;
- confirmar se há custo de cadastro específico nessa etapa para esta proposta;
- lista exata de despesas que a Bamaq admite dentro do limite de 10%.

10.4. Operações eventuais

Substituição de garantia:
- nova avaliação/vistoria;
- cartório/registro/baixa;
- demais custos operacionais comprovados.

Transferência/cessão de cota:
Michele repetiu:
- R$ 150 de análise/cadastro;
- 1% “do crédito”, teto R$ 1.000.

A base “crédito” CONTRADIZ novamente o Regulamento Geral Bamaq 2026, que estabelece:
`1% do saldo devedor`, limitado a R$ 1.000.

Para modelagem, continuar usando a regra documental e manter QN-046 para reconciliação.

Conclusão geral dos custos:
A resposta reduz bastante o risco de “custos ocultos recorrentes”:
- não há seguro obrigatório;
- não foi informada tarifa de adesão/cadastro na entrada;
- análise de crédito pós-contemplação foi informada como gratuita.

Ainda assim, custos transacionais de imóvel/garantia continuam relevantes e devem ser modelados separadamente quando o evento ocorrer.

============================================================
11. DOCUMENTAÇÃO DE PREMISSAS [A18]
============================================================


11.1. Base do lance
Status após resposta direta de 29/09/2026:
RESOLVIDO COMERCIALMENTE PARA A MODELAGEM.

Michele distinguiu e confirmou:
- Fixo 30% → carta atualizada;
- Livre → saldo devedor atualizado da cota na data da assembleia;
- Embutido → até 30% da carta atualizada, por cota.

Para o Lance Livre:
`L_livre = pct_livre × D_assembleia`

onde `D_assembleia` é o saldo devedor atualizado da própria cota no momento da assembleia.

Ela confirmou também que:
- os percentuais de 60%–73% das atas usam essa mesma base;
- o sistema classifica do maior percentual para o menor;
- a contemplação segue até o Fundo Comum disponível do mês se esgotar.

A memória comercial que usava R$225 mil para 45% com saldo exibido de R$495.330 é incompatível com essa regra e não deve servir como referência matemática.

Pendente apenas:
- faixa formal permitida do Lance Livre;
- critério de desempate;
- eventual detalhe do corte quando o Fundo Comum residual não comporta outra contemplação.


11.2. Significado de “Carta rende X% do CDB”
Status após resposta de 29/09/2026:
RESOLVIDO PARA A MODELAGEM-BASE.

Não devemos mais descrever a regra como “a carta rende X% do CDB benchmark”.

Estrutura correta:
- crédito contemplado recebe rendimentos líquidos das aplicações permitidas do grupo;
- aplicação informada: Itaú Premium RF Referenciado DI, CNPJ 03.184.233/0001-80;
- retorno bruto da aplicação é próximo ao CDI e pode oscilar;
- orientação Bamaq para projeção líquida da carta: aproximadamente 80% do CDI;
- benchmark CDB do usuário é variável independente.

Verificação externa:
A identidade do fundo e seu perfil CDI foram confirmados em fontes públicas do Itaú/CVM. A lâmina oficial de julho/2026 mostra retorno bruto próximo de 98% do CDI nas janelas recentes.

Decisão:
- input do simulador deve continuar separado do CDB benchmark;
- default/preset base futuro da carta deve migrar para 80% do CDI;
- 98%–105% não deve mais aparecer como faixa líquida;
- preservar input manual e sensibilidade;
- evitar dupla tributação do retorno que já é modelado como líquido.

Pendente apenas:
- extrato real do Grupo 4012, se desejarmos validar o veículo efetivamente utilizado e o repasse líquido observado.


============================================================
12. DECISÕES DE MODELAGEM INTERNAS
============================================================

12.1. Valores manuais
Status:
Pendente de decisão nossa.

Possível solução:
Definir convenção global ou seletor por campo.


12.2. Patrimônio antes da contemplação
Status atual:
O simulador não exibe patrimônio comparável antes da contemplação.

Pendência futura:
Se quisermos curva completa, modelar valor econômico de desistência/restituição.


12.3. Reajuste e contemplação no mesmo mês
Status atual:
A ordem entre reajuste e contemplação no mesmo mês é configurável.

Pendência futura:
Quando soubermos a ordem real da Bamaq, definir default específico.


12.4. Pisos/clamps que ainda podem esconder perdas [B8]
Status atual:
O caso histórico da venda da carta foi corrigido, mas continua válido o princípio de procurar `Math.max(0, ...)`, clamps ou pisos que possam transformar uma posição econômica negativa em zero sem gerar aporte compensatório.

Ação:
- manter teste de regressão específico para fluxos líquidos negativos;
- revisar novos módulos sempre que forem adicionados;
- não alterar pisos necessários sem um cenário numérico que prove perda escondida.


12.5. “Teto = 0” em taxas [B9]
Precisamos resolver:
Evitar ambiguidade de UX quando um campo de teto igual a zero significa “sem teto”, e não teto efetivamente igual a R$ 0.

Possível solução:
- usar checkbox “sem teto”; ou
- exibir texto explícito “0 = sem teto” ao lado do campo.


12.6. Convenções do seguro [B10]
Status:
A modelagem matemática passou nos testes da segunda auditoria.

Pendência:
Documentar de forma ainda mais explícita que os três modos (fixo, % parcela, % saldo) são sensibilidades genéricas e não representam a regra contratual real até termos documentação da Bamaq.

Ver também:
Item 10 — Seguros e custos acessórios.


12.7. TIR indefinida [B11]
Precisamos resolver:
Quando não existe TIR válida (por ausência de troca de sinal, múltiplas raízes não tratadas ou outra condição matemática), a interface hoje pode apenas exibir “—”.

Possível solução:
Exibir uma explicação contextual, por exemplo:
“TIR não definida para esta série de fluxos.”

============================================================
12.8. CONFIABILIDADE DAS FONTES COMERCIAIS
============================================================

A investigação revelou divergências materiais entre afirmações comerciais e documentos oficiais.

Caso mais relevante:
- em mensagem anterior, a vendedora afirmou que, até a 6ª assembleia, o Lance Livre teria “variado a média entre 45% e 66%”;
- as atas oficiais 001–006 mostram vencedores de Lance Livre em 60,14%, 60,99%, nenhum em junho, 72,73%–73% em julho, 68,91%–70,69% em agosto e 72%–73% em setembro;
- após ser confrontada com as atas, a explicação mudou para “média didática” e para uma referência aproximada de ~65%.

Não é possível inferir intenção, mas a afirmação comercial original é materialmente incompatível ou, no mínimo, não verificável à luz dos documentos apresentados e foi posteriormente reformulada.

Hierarquia de fontes para o projeto:
1. contrato/regulamento/norma oficial aplicável;
2. atas e documentos operacionais oficiais;
3. memórias de cálculo matematicamente reproduzíveis;
4. respostas comerciais escritas;
5. respostas comerciais verbais/áudios.

Regra de governança:
- afirmação comercial conflitante com fonte oficial NÃO vira premissa canônica;
- resposta comercial sem confirmação documental permanece rotulada como comercial;
- discrepâncias relevantes ficam preservadas na trilha de auditoria.

============================================================
13. CHECKLIST RESIDUAL — SOMENTE QUESTÕES AINDA ABERTAS
============================================================

ALTA / PODE ALTERAR RESULTADO
1. Confirmar documentalmente que as quatro cotas novas do Grupo 4012 não sofrem cobrança/dedução por assembleias anteriores à adesão, apesar da redação genérica do Regulamento 2025.
2. Confirmar se uma cota contemplada posteriormente pode quitar integralmente uma ou mais cotas Bamaq já utilizadas no mesmo imóvel e se várias cartas posteriores podem ser combinadas para essa quitação.
3. Confirmar regra de encerramento quando carta contemplada não utilizada ainda possui saldo devedor: existe compensação interna automática ou o crédito em espécie só é liberado após quitação externa?
4. Confirmar fórmula objetiva do valor mínimo do imóvel em substituição de garantia e o procedimento de venda com interveniente quitante.
5. Definir a trajetória/sensibilidade de CDI/CDB de longo prazo; não depende da Bamaq, mas altera fortemente o resultado econômico.

MÉDIA / CONTRATUAL-OPERACIONAL
6. Cashback: confirmar se existe aditivo alterando o prazo documental de 5 dias úteis para os 7 dias úteis informados comercialmente.
7. Confirmar tratamento tributário/declaratório do cashback e eventual impacto no custo fiscal do imóvel.
8. Confirmar fórmula da parcela reduzida “50%”, que não coincide exatamente com metade da parcela integral nas cotações.
9. Confirmar faixa regulamentar permitida do Lance Livre e critério de desempate em percentuais idênticos.
10. Confirmar o dia exato do reajuste em abril/2027 e a ordem reajuste × contemplação se os eventos coincidirem.
11. Confirmar custos e SLA de substituição de garantia, vistoria/engenharia e cartório.
12. Confirmar regras completas do seguro prestamista: taxa, base, teto, idade e contratação posterior.
13. Confirmar origem/política da alegação de limite de 150 cotas por CPF; a norma localizada aponta 10% das cotas ativas por grupo.
14. Confirmar taxa de cadastro na transferência, responsável pelo pagamento, SLA de análise do cessionário e tratamento fiscal da cessão.
15. Confirmar eventual evento fiscal adicional no resgate em espécie após 180 dias e existência de informe de rendimentos.

BAIXA / UX E DOCUMENTAÇÃO
16. Confirmar origem do valor de R$123,3 mil citado comercialmente para despesas vinculadas, pois 10% de R$1,37 milhão são R$137 mil.
17. Obter, apenas se necessário, extrato/posição específica do Grupo 4012 no fundo Itaú Premium para elevar o grau de prova.
18. Manter revisão contratual final como gate antes de transformar respostas comerciais em regras definitivas.
