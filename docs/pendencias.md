PENDÊNCIAS — SIMULADOR CONSÓRCIO x CDB x IMÓVEL
Base atual de software: V3.2
Baseline auditada histórica: V2.54

Objetivo: registrar tudo o que ainda não está suficientemente confirmado ou modelado, deixando explícito:
1) o que precisamos resolver;
2) qual informação falta;
3) uma forma prática de obter a informação.


Rodada de respostas comerciais — 28/09/2026
Fonte: respostas escritas de Michele Ramalho Coelho (QuintoAndar/Bamaq).

Nível de evidência:
- Resposta comercial escrita reduz incerteza, mas regras de alto impacto devem ser confrontadas com contrato/regulamento da Bamaq e, quando possível, com norma do Banco Central.
- Nesta rodada também confrontamos as afirmações legais com fontes oficiais atuais do Banco Central e da Lei nº 11.795/2008.
- Na rodada comercial de 28/09 não alteramos automaticamente o motor. Depois daquela rodada, porém, houve uma sequência deliberada de evoluções de software até a V3.2. As pendências abaixo continuam preservando a evidência comercial, mas as referências à V2.54 devem ser lidas como histórico quando conflitarem com a seção de sincronização V3.2.

============================================================
0. SINCRONIZAÇÃO DO ESTADO DO SOFTWARE — V3.2 (29/09/2026)
============================================================

Esta seção prevalece sobre descrições antigas de “comportamento atual da V2.54” existentes ao longo deste arquivo. Elas são mantidas como histórico da rodada de respostas de 28/09/2026.

IMPLEMENTADO NA LINHA PRINCIPAL V3.2:
- arquitetura genuinamente multi-cota, com quantidade configurável de 1 a 50 cotas;
- preset estrutural QuintoAndar de 4 cotas: R$400 mil + R$400 mil + R$370 mil + R$200 mil;
- contemplação independente por cota; quando existe apenas 1 cota, a interface volta a usar slider de mês de contemplação;
- Lance Livre calculado como percentual do saldo devedor de cada cota;
- lance embutido calculado sobre a carta atualizada de cada cota, limitado a 30% e ao próprio valor do Lance Livre;
- dinheiro do lance = Lance Livre efetivo - embutido efetivo;
- CDI de referência, percentual do CDI da carta e retorno do benchmark CDB separados;
- vedação de pooling: rendimento de uma cota só pode pagar a parcela daquela própria cota;
- financiamento do lance por tranches independentes, liberadas na data de contemplação de cada cota, com parâmetros de financiamento globais ou por cota;
- painel decisório / matriz de cenários para contemplação, Lance Livre, remuneração da carta e percentual financiado;
- biblioteca de cenários/consórcios em localStorage, com seleção, salvar/salvar como, exportação e importação em JSON;
- layout vertical para evitar rolagem horizontal;
- quantidade de cotas incluída no estado salvo/importado.

PENDÊNCIAS DE MODELAGEM QUE CONTINUAM ABERTAS MESMO NA V3.2:
- o software modela corretamente o Lance Livre, mas ainda não possui seletor explícito para alternar Livre × Fixo; portanto SW-005 continua apenas parcialmente resolvida;
- compra com subconjunto de cotas contempladas ainda não está implementada: a compra continua condicionada à última contemplação;
- cashback ainda não incorpora definitivamente a regra promocional nominal versus crédito líquido pós-embutido;
- calendário real do aniversário do grupo e primeiro reajuste de 3% continuam sem implementação contratual definitiva;
- eventual cobrança/dedução ligada às assembleias anteriores à adesão continua não implementada por falta de confirmação;
- valores oficiais de parcela reduzida/integral da cotação ainda não são usados como override; por isso a proposta pode aparecer como aproximadamente R$4.001 em vez de R$3.999,03;
- regras de resgate, encerramento, cessão, garantia, seguro contratual e residual continuam com as pendências históricas registradas neste arquivo.

STATUS DAS GRANDES PENDÊNCIAS ESTRUTURAIS:
- “carta única equivalente” como limitação estrutural: RESOLVIDA no motor principal;
- base incorreta do Lance Livre: RESOLVIDA;
- dependência indevida entre rendimento da carta e benchmark: RESOLVIDA;
- pooling de rendimento entre cotas: RESOLVIDA;
- financiamento do lance em datas diferentes: RESOLVIDA;
- comparação de cenários: RESOLVIDA na camada de software;
- incertezas externas/comerciais correspondentes continuam abertas quando explicitamente registradas abaixo.

IMPORTANTE:
A V3.2 ainda não passou por uma nova auditoria independente equivalente à realizada sobre a V2.53/V2.54. As implementações acima devem ser tratadas como “implementadas e verificadas durante desenvolvimento”, não como “reauditadas”.

============================================================
1. PRIORIDADE ALTA — PREMISSAS QUE PODEM MUDAR O RESULTADO
============================================================


1.1. Rendimento da carta contemplada não utilizada [R1]
Status após respostas de 28/09/2026:
MAJORITARIAMENTE CONFIRMADO QUANTO À EXISTÊNCIA E À NATUREZA LÍQUIDA DOS RENDIMENTOS; FAIXA/IMPLEMENTAÇÃO AINDA PRECISA DE RECONCILIAÇÃO.

Michele informou que:
- após a homologação da contemplação, o crédito não utilizado é apartado e aplicado;
- os recursos ficam vinculados ao grupo, em aplicações de alta liquidez;
- a remuneração acompanha o resultado efetivo dessas aplicações;
- não existe taxa fixa/promissória garantida de 98% do CDI;
- a rentabilidade pode variar ao longo do tempo;
- o rendimento é repassado de forma líquida ao crédito do consorciado;
- não há taxa adicional de gestão financeira sobre esses rendimentos;
- os rendimentos permanecem até a utilização do crédito ou, segundo ela, até o encerramento do grupo.

Verificação externa em fonte oficial:
- A Lei nº 11.795/2008 estabelece que cada grupo possui patrimônio próprio, separado do patrimônio da administradora e dos demais grupos.
- A Resolução BCB nº 285/2023, vigente para grupos constituídos a partir de 1º/07/2024, exige que recursos do grupo sejam depositados em instituições bancárias e restringe as aplicações a:
  a) títulos públicos federais registrados no Selic, inclusive compromissadas; e
  b) determinados fundos abertos de renda fixa (Curto Prazo, Referenciado ou Simples).
- A mesma Resolução determina que os recursos vinculados à contemplação permaneçam aplicados até o último dia útil anterior à utilização.
- O art. 17 determina que o crédito disponibilizado seja acrescido dos rendimentos líquidos financeiros proporcionais ao período de aplicação.

Conclusão:
A existência de remuneração líquida da carta contemplada não utilizada deixa de ser mera hipótese comercial: há respaldo regulatório atual para o acréscimo dos rendimentos líquidos efetivamente obtidos nas aplicações permitidas.

Pontos ainda não fechados:
- Michele primeiro informou faixa de 98% a 105% do CDI e, nesta resposta, escreveu aproximadamente 80% a 105% do CDI. Precisamos esclarecer qual faixa é correta.
- O percentual do CDI não é contratualmente garantido; ele é uma aproximação do rendimento efetivo. Portanto, não devemos modelá-lo como taxa fixa garantida.
- Ainda precisamos saber como a Bamaq transforma o rendimento efetivo do fundo/aplicação em uma métrica do tipo “x% do CDI” nos extratos.
- Precisamos do nome/CNPJ exato das aplicações usadas atualmente pelo Grupo 4012, se isso puder ser informado.
- Michele citou “Fundo Itaú Premium ou equivalentes”; isso é plausível como exemplo de fundo de renda fixa referenciado, mas não foi confirmado como o fundo efetivamente utilizado pelo Grupo 4012.
- “Conta de investimento exclusiva” precisa ser entendida operacionalmente: conta bancária individual por cota ou apenas segregação/controle contábil individual dentro dos recursos do grupo?
- Precisamos confirmar se a faixa/rentabilidade é igual para todas as cotas contempladas ou depende da aplicação/data.

Como obter:
- Pedir um extrato real/anônimo de cota contemplada não utilizada.
- Pedir o nome/CNPJ da aplicação utilizada pelo Grupo 4012.
- Perguntar qual das faixas está correta: 98%–105% ou 80%–105% do CDI.
- Pedir a cláusula do contrato/regulamento que descreve a aplicação e o repasse dos rendimentos.


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

Comparação com a V2.54:
A matemática principal já coincide com essa descrição:
- `yieldUsed = min(rendimento, parcela)`;
- o rendimento usado reduz a obrigação de caixa;
- o excedente capitaliza na carta.

Diferenças ainda não representadas:
- a V2.54 aplica o abatimento automaticamente em todos os meses quando o modo “usar rendimento para pagar parcela” está ativo;
- na operação real, a solicitação precisa ser feita mensalmente;
- a V2.54 usa uma carta equivalente, portanto ainda não consegue impor a regra “rendimento da cota A só paga a parcela da cota A”.

Conclusão:
A hipótese operacional R1 sobre uso do rendimento para pagar parcelas deixa de ser uma pendência conceitual. O que resta é documentar e, na versão multi-cota, representar corretamente a restrição por cota e a necessidade de solicitação mensal.

Detalhes operacionais ainda úteis:
- Se o rendimento for menor que a parcela, o abatimento parcial funciona automaticamente pelo valor disponível?
- Até que data do mês a solicitação precisa ser feita?
- A solicitação feita no app vale para a parcela corrente ou para a próxima?
- Se o cliente esquecer de solicitar em um mês, pode usar o rendimento acumulado no mês seguinte para abater uma parcela posterior?
- Há opção de deixar uma instrução permanente ou é obrigatoriamente uma ação manual todo mês?

Como obter:
- perguntar à Michele/Bamaq apenas os detalhes operacionais acima, se não vierem nas próximas respostas.


1.3. Entrada em grupo já em andamento
Status após resposta de 28/09/2026:
MECÂNICA ECONÔMICA PRINCIPAL CONFIRMADA COMERCIALMENTE E COERENTE COM O ART. 1º DO REGULAMENTO BAMAQ 2025, MAS EXISTE UMA CONTRADIÇÃO DOCUMENTAL IMPORTANTE SOBRE “PARCELAS RETROATIVAS” EM CASO DE CONTEMPLAÇÃO.

Michele informou:
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

Reconciliação matemática:
`R$ 200.000 × 1,25 = R$ 250.000`
`R$ 250.000 / 214 = R$ 1.168,224...`

Logo, o novo exemplo fecha praticamente de forma exata com a fórmula já usada pela V2.54:

`D0 = C0 × (1 + 24% + 1%)`

`P0 = D0 / 214`

Isso também reforça a leitura anterior do exemplo de R$ 400 mil, cujo saldo inicial de R$ 500 mil e parcela integral de cerca de R$ 2.336,45 seguem a mesma lógica.

CONFIRMAÇÃO DOCUMENTAL PARCIAL
O Regulamento Geral Bamaq 2025, art. 1º, §3º, afirma que o consorciado admitido em grupo em andamento fica obrigado ao pagamento integral das prestações previstas no instrumento dentro do prazo remanescente para o término do grupo.

Isso é compatível com:
- encargos integrais;
- nenhuma “taxa já consumida” antes da entrada;
- diluição do compromisso pelo prazo que resta.

CONTRADIÇÃO DOCUMENTAL IMPORTANTE
No mesmo Regulamento 2025, art. 8º, VI, alínea “a”, existe uma regra adicional dizendo que, quando a adesão ocorreu em grupo já em andamento e houver contemplação por sorteio ou lance, o consorciado deve pagar as mensalidades correspondentes às assembleias realizadas ANTES da adesão; se não pagar, a Administradora pode deduzir esse valor do crédito contemplado.

Essa cláusula é incompatível, ao menos à primeira leitura, com a afirmação comercial de:
“Você não precisa pagar parcelas retroativas dos meses que já se passaram antes de você entrar.”

Possibilidades a reconciliar:
1. o Regulamento 2026 pode ter alterado essa cláusula;
2. o Grupo 4012 / parceria QuintoAndar pode possuir regra específica/aditivo que afasta a cobrança;
3. “cotas novas de lançamento” podem receber tratamento operacional diferente de outra forma de ingresso em grupo em andamento;
4. a resposta comercial pode estar simplificando ou incorreta.

Até resolver isso:
NÃO implementar nenhuma cobrança retroativa no cenário-base, porque a proposta concreta e a memória comercial usam 214 meses sem adicional.
MAS também NÃO considerar a questão definitivamente encerrada, porque uma cobrança/dedução na contemplação poderia alterar de forma material:
- crédito líquido disponível;
- necessidade de aporte;
- lance;
- comparação com CDB;
- estratégia de contemplação precoce.

O que ainda falta:
- cláusula correspondente no Regulamento 2026 aplicável à proposta;
- contrato/proposta específica das quatro cotas;
- resposta formal da Bamaq dizendo se a alínea sobre assembleias anteriores se aplica ou não ao Grupo 4012/QuintoAndar;
- confirmar se “214 meses” é o número de parcelas efetivamente cobradas do novo aderente;
- confirmar data-base do primeiro reajuste para quem entra agora;
- permanecem separadas as dúvidas da memória pós-contemplação: parcela reduzida R$ 1.167,60 no exemplo de R$ 400 mil e 209 meses restantes após contemplação na 4ª parcela.

Como obter:
- pedir à Michele/Bamaq uma resposta expressa confrontando a cláusula;
- pedir proposta/contrato das quatro cotas antes de assinar;
- obter memória de evolução do saldo para uma cota nova no Grupo 4012.

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
- a V2.54 já trata a taxa da carta como líquida;
- o campo de “IR/custo do resgate” em 0% é coerente como default;
- aplicar automaticamente outro IR sobre todos os rendimentos provavelmente duplicaria um haircut que já ocorreu antes do crédito líquido ser reconhecido;
- eventual campo de haircut adicional deve ser entendido apenas como sensibilidade para custo/tributação EXTRA, não como regra-base.

O que ainda vale confirmar:
- se o recebimento em espécie após 180 dias gera algum evento fiscal adicional para o consorciado pessoa física além do rendimento já creditado líquido;
- se a Bamaq emite informe de rendimentos ou documento fiscal;
- se há algum custo específico de encerramento do grupo não capturado pelos rendimentos líquidos;
- esclarecer a inconsistência da faixa 98%–105% versus 80%–105% do CDI.

Como obter:
- contrato/regulamento Bamaq;
- exemplo de extrato/informe;
- se necessário, validação tributária com contador antes da decisão final.




1.5. Índice/regra de reajuste do consórcio
Status após novas mensagens/áudios de 28/09/2026:
REGRA ECONÔMICA PRINCIPAL RESPONDIDA COMERCIALMENTE E DATA-BASE CONCEITUAL PARCIALMENTE RESPONDIDA; FALTA A DATA EXATA E O EFEITO DA PRÓXIMA ASSEMBLEIA.

Michele confirmou:
- o reajuste é FIXO em 3% ao ano;
- antes da contemplação, os 3% corrigem crédito/carta e parcelas;
- depois da contemplação, o saldo devedor continua reajustado em 3% a.a.;
- a carta contemplada deixa de seguir o reajuste fixo e passa a render financeiramente;
- o reajuste anual ocorre no ANIVERSÁRIO DO GRUPO, e não necessariamente 12 meses após a adesão individual.

Essa última informação resolve uma dúvida importante:
A nova cota deve herdar o calendário anual do grupo.

Consequência para modelagem:
A futura arquitetura deve separar:
- data de adesão da cota;
- calendário/aniversário do grupo;
- meses de reajuste.

Não é correto simplesmente aplicar o primeiro reajuste 12 meses depois do mês 1 da simulação.

NOVA INFORMAÇÃO OPERACIONAL
Michele também escreveu:
“A tabela atual está prestes a virar na assembleia do dia 18” e ofereceu alocar as cotas imediatamente/emitir o contrato para “travar esses valores e essa condição”.

Essa frase cria uma questão de alta prioridade:
- a assembleia do dia 18 é justamente o aniversário/reajuste anual do Grupo 4012?
- se as cotas forem contratadas antes dessa assembleia, elas entram com os valores atuais e sofrem 3% já no próximo dia 18?
- ou a “trava” garante a tabela atual até o aniversário seguinte?
- “virar a tabela” significa reajuste de 3%, mudança do prazo remanescente, nova tabela comercial ou mais de uma dessas coisas?

A cotação também está marcada como válida até 30/09/2026, o que parece ser uma janela comercial distinta da assembleia do dia 18. Não misturar os dois prazos sem confirmação.

Comparação com a V2.54:
A regra econômica central está alinhada ao motor, mas a cronologia NÃO está:
- hoje o simulador pensa em reajustes por intervalos relativos ao início da simulação;
- a regra real parece seguir o calendário do grupo.

Pontos ainda não respondidos:
- data exata do aniversário anual do Grupo 4012;
- se a assembleia “do dia 18” é a assembleia de aniversário;
- quando ocorre o primeiro reajuste das cotas se contratadas agora;
- o que exatamente fica “travado” ao emitir/assinar o contrato antes da mudança de tabela;
- ordem exata se reajuste e contemplação coincidirem no mesmo mês;
- memória oficial do recálculo da parcela pós-contemplação.

Observação:
A frase comercial “o valor da parcela não vai alterar” deve ser entendida como referência à composição/estrutura inicial da proposta, porque a própria Michele esclareceu em seguida que o reajuste anual no aniversário do grupo NÃO está incluído nesses valores.

Como obter:
- perguntar a data exata do aniversário do Grupo 4012;
- perguntar diretamente se as cotas assinadas agora já recebem 3% na próxima assembleia do dia 18;
- perguntar o que “travar os valores” significa juridicamente/operacionalmente;
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


2.4. Lances em múltiplas cotas
Status após respostas de 28/09/2026:
MAJORITARIAMENTE RESPONDIDO COMERCIALMENTE, COM FÓRMULA DO LANCE LIVRE A RECONCILIAR.

Michele confirmou:
- lance individual por cota;
- possibilidade de ofertar nas quatro cotas na mesma assembleia;
- possibilidade de contemplar 1, 2, 3 ou as 4 no mesmo mês;
- resultado depende de valor ofertado, modalidade (Fixo ou Livre) e disponibilidade do Fundo Comum;
- embutido limitado a 30% da carta atualizada, por cota.

Bases informadas:
- Lance Fixo de 30%: sobre a carta atualizada.
- Lance Livre: sobre o saldo devedor.
- Embutido: sobre a carta atualizada.

Impacto:
A V2.54 usa a carta como base para qualquer “lance total”. Isso representa o Fixo, mas NÃO o Livre.

Exemplo comercial:
Carta R$ 400 mil; lance livre de 45%; embutido de 10% da carta; aproximadamente R$ 180 mil em dinheiro.

Interpretação preliminar:
Com saldo perto de R$ 495 mil, 45% do saldo ≈ R$ 223 mil. Menos R$ 40 mil embutidos ≈ R$ 183 mil em dinheiro. Isso é coerente com os ~R$ 180 mil informados, mas não com “35% da carta”.

Informação que ainda falta:
- faixa/mínimo/máximo do lance livre;
- percentuais diferentes por cota;
- critério de desempate;
- efeito do Fundo Comum quando há mais lances vencedores do que caixa disponível;
- se é possível escolher reduzir parcela versus prazo/ordem inversa;
- memória oficial do exemplo.

Nova mensagem comercial recebida:
- Lance Livre: “você decide o valor; quem oferece o maior lance no grupo é contemplado”;
- Lance Fixo: mesmo valor definido no regulamento;
- Lance Embutido: até 30% da própria carta;
- Lance Fidelidade: para adimplentes por pelo menos 12 meses;
- se o lance não contemplar, nada é pago e pode-se tentar novamente no mês seguinte;
- Michele também escreveu que, quando o lance resulta em contemplação, haveria “3 dias para pagar”.

Leitura:
- a existência de Livre, Fixo, Embutido e Fidelidade reforça as modalidades já identificadas;
- “maior lance no grupo é contemplado” é simplificação comercial e NÃO substitui a regra anterior de múltiplas contemplações conforme recursos do Fundo Comum;
- o prazo de “3 dias” precisa ser reconciliado com a ata do Grupo 4012 já analisada, que indicava vencimento no segundo dia útil;
- a frase “caso você seja sorteado” ao explicar pagamento do lance parece imprecisa: sorteio e contemplação por lance são mecanismos distintos.

Como obter:
- memória de cálculo oficial;
- regulamento/ata do Grupo 4012;
- confirmação escrita do prazo exato para pagamento de lance vencedor.


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


2.7. Cashback com múltiplas cotas
Status após resposta de 28/09/2026:
PARCIALMENTE RESPONDIDO COMERCIALMENTE, MAS A RESPOSTA CONTRADIZ UMA EXCEÇÃO EXPRESSA DO REGULAMENTO DA CAMPANHA.

Michele informou:
- cashback de 10% sobre o crédito efetivamente utilizado na compra;
- em operação com várias cotas, a base seria a soma dos créditos efetivamente utilizados;
- exemplo: R$ 900 mil de crédito líquido utilizado → R$ 90 mil de cashback;
- não haveria teto monetário específico por CPF ou imóvel;
- o pagamento seria em dinheiro de livre movimentação.

Regulamento da Campanha QuintoAndar/Bamaq:
Regra geral (item 4.1.3):
- 10% sobre o montante total do valor da carta de crédito LIBERADO para aquisição do imóvel.

Exceção vigente a partir de 16/06/2026 (item 4.1.3.1):
- quando o imóvel adquirido tiver valor IGUAL OU SUPERIOR ao valor da carta de crédito CONTRATADA, a base do cashback passa a ser o VALOR TOTAL DO CRÉDITO CONTRATADO E DISPOSTO NA COTA, e não o valor efetivamente liberado.

Conclusão:
A afirmação comercial “é sempre sobre o efetivamente utilizado” não está completa para adesões abrangidas pela exceção de 16/06/2026.

Em cenário com lance embutido, essa diferença pode ser material:
- crédito contratado nominal pode ser maior que o crédito líquido disponível após embutido;
- se o imóvel preencher a condição da exceção, o cashback pode ser calculado sobre base superior ao crédito líquido efetivamente usado.

Pontos ainda a confirmar:
- Em operação multi-cota, a condição “imóvel >= crédito contratado” é testada:
  a) cota por cota; ou
  b) sobre a soma das cotas usadas na aquisição?
- “Valor total do crédito contratado e disposto na cota” significa o crédito nominal contratado original ou o valor atualizado da carta no momento da utilização?
- Se houver lance embutido, a exceção permite cashback sobre o valor contratado antes da redução do crédito pelo embutido?
- Existe qualquer teto operacional interno além das regras da campanha?
- A afirmação de “150 cotas por CPF” continua pendente de fonte e não deve ser usada como limite regulamentar.

Impacto de modelagem:
A V2.54 calcula cashback simplesmente como percentual do crédito usado. Isso representa apenas a regra geral e NÃO a exceção de 16/06/2026.

Como obter:
- perguntar ao QuintoAndar/Bamaq usando exemplo numérico com várias cotas e lance embutido;
- pedir confirmação escrita de como o item 4.1.3.1 é aplicado em operação multi-cota.

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

Impacto direto na V2.54:
A V2.54 hoje preserva o crédito residual como ativo vinculado, sem rendimento e sem destinação automática. Esse comportamento agora está comprovadamente inadequado após a conclusão da compra.

A próxima versão deve substituir “crédito residual congelado” por uma escolha explícita de destino, limitada às opções contratuais/regulatórias:
A. despesas vinculadas ao bem, até o teto permitido;
B. quitação de prestações vincendas / antecipação do saldo conforme contrato;
C. devolução em dinheiro apenas quando as obrigações estiverem integralmente quitadas.

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
A V2.54 é conservadora demais ao tratar todo o Fundo de Reserva como custo perdido.

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

Impacto na V2.54:
A V2.54 hoje calcula a taxa sobre a OFERTA de compra da cota:
`taxa = min(oferta × pct_taxa, teto)`

Isso está incorreto para a regra documental da Bamaq.

A próxima versão deve usar:
`taxaTransferencia = min(saldoDevedorCota × 1%, R$ 1.000)`

e separar:
- taxa de cadastro;
- taxa de transferência;
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

Impacto de modelagem:
A V2.54 já permite escolher entre:
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

Status após materiais de 28/09/2026:
A natureza de livre movimentação está confirmada pelo Regulamento da Campanha. As novas COTAÇÕES INDIVIDUAIS reforçam a leitura de que, para esta proposta, o benefício está sendo vendido como 10% DO VALOR NOMINAL DE CADA CARTA:

- R$ 400 mil → R$ 40 mil;
- R$ 400 mil → R$ 40 mil;
- R$ 370 mil → R$ 37 mil;
- R$ 200 mil → R$ 20 mil;
- total nominal de cashback destacado: R$ 137 mil.

Isso é mais coerente com a exceção promocional vigente desde 16/06/2026 do que com a explicação verbal anterior de “10% do crédito efetivamente utilizado”.

Ainda assim, a proposta não mostra um cenário com lance embutido efetivamente executado, então a aplicação exata da exceção continua a exigir confirmação formal.


8.0. Evidência nova da própria cotação

As três cotações recebidas exibem o cashback como 10% exatos do valor nominal da carta.

Isso fortalece o uso, como regra-alvo desta campanha, de uma base de cashback que pode ser superior ao crédito líquido efetivamente liberado após lance embutido.

Pergunta crítica ainda aberta:
Se uma carta de R$ 400 mil usar R$ 40 mil de lance embutido e liberar R$ 360 mil, a proposta continua garantindo os R$ 40 mil de cashback destacados no material?

Essa resposta deve prevalecer sobre inferências.

8.1. Momento do pagamento

Michele informou:
- pagamento em até 7 dias úteis após a conclusão integral da compra.

Regulamento da Campanha, item 4.1.2:
- pagamento em conta bancária do consorciado em até 5 DIAS ÚTEIS;
- o prazo conta do registro da alienação na matrícula E do pagamento do crédito ao vendedor.

Conclusão:
Para especificação contratual, usar 5 dias úteis como regra documental, salvo aditivo/regulamento mais novo.

Impacto na V2.54:
O modelo assume cashback como entrada ao fim do próprio mês da compra. Como a compra também é modelada no fim do mês, isso é temporalmente incompatível com um pagamento que ocorre até 5 dias úteis DEPOIS do registro/pagamento ao vendedor.

Mudança desejável:
- no modelo mensal simplificado, considerar cashback no mês seguinte à compra; ou
- permitir defasagem configurável de 0/1 mês se quisermos acomodar diferentes posições do fechamento dentro do mês.

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

O Regulamento anexado estabelece vigência para adesões entre 01/09/2025 e 30/09/2026.
As novas cotações comerciais também estão marcadas como válidas até 30/09/2026.

Michele agora propôs:
- “alocar as cotas agora”;
- “seguir com a emissão do contrato”;
- com o objetivo de “travar esses valores e essa condição”.

Isso reforça a urgência temporal, mas NÃO esclarece qual ato efetivamente garante:
- elegibilidade ao cashback;
- preço/tabela atual;
- número de parcelas;
- demais condições comerciais.

Precisamos distinguir:
1. emissão do contrato;
2. assinatura eletrônica;
3. pagamento da primeira parcela;
4. efetiva alocação/emissão das cotas no grupo;
5. eventual aprovação/cadastro pela administradora.

Os benefícios podem ser exercidos durante o prazo do consórcio por quem aderiu dentro da vigência.

Como a rodada atual ocorre em 28/09/2026, é necessário confirmar imediatamente:
- qual ato caracteriza “adesão” para garantir a campanha;
- se basta assinatura/proposta/pagamento inicial até 30/09/2026;
- se a campanha foi ou será prorrogada;
- se existe regulamento mais recente substituindo o documento atual.

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
- o default `seguro = desativado` da V2.54 está correto para esta proposta;
- o simulador NÃO deve incluir custo de seguro por padrão;
- a atual seção de seguro continua útil como sensibilidade;
- porém, os três modos genéricos da V2.54 (fixo, % parcela, % saldo) ainda NÃO representam necessariamente a fórmula real do produto.

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
Status após resposta de 28/09/2026:
PARCIALMENTE RESOLVIDO COMERCIALMENTE E COM IMPACTO DIRETO NO SOFTWARE.

Michele distinguiu:
- Fixo 30% → carta atualizada;
- Livre → saldo devedor;
- Embutido → até 30% da carta atualizada, por cota.

Conclusão:
A V2.54 não deve continuar tratando toda modalidade como percentual da carta na próxima revisão.

Pendente:
- confirmação formal no regulamento/ata;
- faixa do Lance Livre;
- composição exata do exemplo;
- modalidades adicionais.


11.2. Significado de “Carta rende X% do CDB”
Status após resposta de 28/09/2026:
A FORMULAÇÃO ORIGINAL ESTÁ SUPERADA.

Não devemos mais descrever a regra como “a carta rende X% do CDB benchmark”.

O que agora sabemos:
- o crédito contemplado recebe os rendimentos líquidos financeiros das aplicações permitidas para os recursos do grupo;
- a Bamaq comercialmente expressa esse resultado como uma faixa aproximada em % do CDI;
- não é uma promessa de taxa fixa;
- o resultado pode variar ao longo do tempo.

Verificação regulatória:
A Resolução BCB nº 285/2023, arts. 10, 16 e 17, confirma a aplicação dos recursos vinculados à contemplação e o acréscimo dos rendimentos líquidos ao crédito.

Pendente:
- esclarecer se a faixa correta é 98%–105% ou 80%–105% do CDI;
- obter extrato real e/ou aplicação/CNPJ do Grupo 4012;
- decidir como representar rendimento variável no software.

============================================================
12. DECISÕES DE MODELAGEM INTERNAS
============================================================

12.1. Valores manuais
Status:
Pendente de decisão nossa.

Possível solução:
Definir convenção global ou seletor por campo.


12.2. Patrimônio antes da contemplação
Status:
Na V2.50 optamos por não exibir patrimônio comparável antes da contemplação; essa decisão permanece na V2.53.

Pendência futura:
Se quisermos curva completa, modelar valor econômico de desistência/restituição.


12.3. Reajuste e contemplação no mesmo mês
Status:
Resolvido desde a V2.50 como opção configurável e mantido na V2.54.

Pendência futura:
Quando soubermos a ordem real da Bamaq, definir default específico.


12.4. Pisos/clamps que ainda podem esconder perdas [B8]
Status:
A V2.54 corrigiu o caso identificado na venda da carta em que custos superiores à proposta podiam desaparecer. A segunda auditoria, porém, recomendou continuar procurando outros `Math.max(0, ...)`, clamps ou pisos que possam transformar uma posição econômica negativa em zero sem gerar aporte compensatório.

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
13. CHECKLIST PARA A MICHELLE/BAMAQ
============================================================

1. [MAJORITARIAMENTE RESPONDIDA] Crédito contemplado recebe rendimentos líquidos das aplicações do grupo; falta reconciliar faixa CDI e detalhes do extrato/aplicação.
2. [RESPONDIDA] Sim. Pode quitar até 100% da parcela da própria cota; excedente permanece no crédito; solicitação precisa ser feita mensalmente no app.
3. [RESPONDIDA COMERCIALMENTE + RESPALDO REGULATÓRIO] Crédito recebe rendimentos líquidos; Michele afirma ausência de taxa adicional de gestão. Confirmar apenas eventual evento fiscal no saque.
4. [RESPONDIDA] Até a utilização; Michele também informa até o encerramento do grupo. Regulamentação confirma rendimento até a efetiva utilização.
5. [RESPONDIDA] 4 cotas: R$ 400 mil + R$ 400 mil + R$ 370 mil + R$ 200 mil.
6. [RESPONDIDA COMERCIALMENTE] Podem ficar no mesmo grupo (ex.: 4012); confirmar na proposta final.
7. [RESPONDIDA] Sim, número e apuração próprios.
8. [RESPONDIDA] Sim, inclusive por lance, sujeito ao Fundo Comum.
9. [RESPONDIDA] Sim. Créditos contemplados podem ser reunidos para um único imóvel, inclusive de grupos Bamaq diferentes; confirmado pelo Regulamento Geral da Bamaq.
10. [RESPONDIDA] Não. O rendimento de cada cota só pode abater parcelas da própria cota.
11. Como funciona o cashback com várias cotas?
12. [MAJORITARIAMENTE RESPONDIDA/VERIFICADA] Residual pode, a critério do consorciado, ir para despesas vinculadas até 10%, antecipação de prestações conforme contrato ou devolução em dinheiro se obrigações estiverem quitadas. Falta regra específica do Grupo 4012 e cálculo multi-cota.
13. O fundo de reserva não utilizado é devolvido?
14. [RESPONDIDA PARA RESGATE PÓS-180 DIAS] Não há netting simples; obrigações precisam estar quitadas antes. [ABERTA NO ENCERRAMENTO] Michele diz que pode haver liquidação interna no fim do grupo; falta regra formal.
15. [RESPONDIDA DOCUMENTALMENTE] Taxa de transferência = 1% do saldo devedor da cota, limitada a R$ 1.000; Regulamento 2026 também prevê taxa de cadastro de R$ 150. Falta confirmar aplicação exata do cadastro por operação.
16. [MAJORITARIAMENTE RESPONDIDA] Sim, mas a substituição precisa ser concluída antes da liberação do imóvel original. Novo bem deve estar quitado e em nome do consorciado segundo a Central de Ajuda. Falta regra exata de valor, tarifário e SLA.
17. [MAJORITARIAMENTE RESPONDIDA] Seguro prestamista é opcional; adesão/cadastro na entrada e análise de crédito pós-contemplação foram informados como gratuitos. Permanecem avaliação/vistoria, cartório/ITBI e custos eventuais de garantia/transferência.
18. [MAJORITARIAMENTE RESPONDIDA] 24% de administração + 1% de reserva são integrais e diluídos no prazo remanescente de 214 meses; conferir proposta final e a questão das assembleias anteriores em caso de contemplação.
19. [PARCIAL] Fixo 30% sobre carta atualizada; Livre sobre saldo devedor; embutido até 30% da carta. Falta formalização e faixa do Livre.
20. [PARCIAL] Recebemos exemplo comercial de R$ 400 mil; falta memória oficial para reconciliar parcela reduzida, 209 meses e lance.
21. [PARCIALMENTE RESPONDIDA] Seguro Prestamista é opcional. Michele diz que é percentual e distribuído nas parcelas vincendas, com teto de cobertura de R$ 800 mil/cota; falta base, taxa, certificado e regra etária formal.
22. Para qualquer crédito usado para financiar o lance: a taxa é prefixada ou acrescida de TR/IPCA/CDI/outro indexador? Qual é o CET e a fórmula de atualização do saldo?
23. Qual é exatamente o índice/regra de reajuste da carta, do saldo e das parcelas? Qual a data-base e o que acontece após a contemplação?
24. [PARCIAL] Crédito não usado e fundo de reserva remanescente são disponibilizados no encerramento; falta confirmar se há compensação interna automática de eventual saldo devedor.
25. [MAJORITARIAMENTE RESPONDIDA] Rendimentos são líquidos e sem taxa adicional de gestão segundo Michele; falta confirmar informe e eventual evento fiscal no recebimento em espécie.

26. [ABERTA] A regra de “até 150 cotas por CPF” vem de qual norma ou política? A regulação atual e o regulamento Bamaq apontam limite de 10% por grupo.
27. [ALTA] Uma cota contemplada posteriormente pode quitar TOTALMENTE uma ou mais cotas Bamaq já utilizadas para comprar o mesmo imóvel, conforme art. 8º, XII/XIII do Regulamento?
28. [ALTA] Se uma carta posterior não cobrir o saldo total, posso reunir várias cartas posteriores para realizar essa quitação total?

29. [ALTA] Cashback: como aplicar a exceção de 16/06/2026 em várias cotas e com lance embutido?
30. [MÉDIA] O prazo oficial de cashback é 5 dias úteis (regulamento) ou existe aditivo atualizando para 7?
31. [FISCAL] O cashback recebido altera o custo fiscal do imóvel ou precisa ser informado de forma específica no IRPF?
32. [URGENTE] A campanha termina em 30/09/2026? O que precisa estar formalizado até essa data para garantir o cashback?

33. [ALTA] Na substituição de garantia do Grupo 4012, qual é a fórmula objetiva do valor mínimo do novo imóvel: saldo devedor, crédito liberado/original ou saldo + margem?
34. [MÉDIA] Confirmar formalmente que o imóvel substituto precisa estar quitado e registrado em nome do consorciado.
35. [MÉDIA] Qual é o tarifário atual de vistoria/engenharia, custos administrativos e cartório na substituição?
36. [MÉDIA] O prazo total de 15–30 dias úteis é SLA formal ou média operacional? Como se compatibiliza com os 5 dias úteis de análise documental do Regulamento?
37. [MÉDIA] Na venda com quitação, comprador/financiador pode pagar diretamente a Bamaq como interveniente quitante? Qual é o procedimento formal?

38. [MÉDIA] Na transferência de cota contemplada sem bem adquirido, os R$ 150 de cadastro são cobrados por cota ou apenas uma vez por cessionário?
39. [BAIXA] Quem é formalmente responsável pelas tarifas da transferência — cedente ou cessionário — ou isso pode ser negociado entre as partes?
40. [MÉDIA] Qual é o prazo/SLA para análise e aprovação do cessionário de uma cota contemplada?
41. [FISCAL] Qual é o tratamento tributário da venda/cessão da cota e a base de custo fiscal correta?

42. [MÉDIA] Seguro Prestamista: qual é a taxa percentual e a base exata de cálculo do prêmio?
43. [MÉDIA] A contratação do Seguro Prestamista pode ocorrer depois da adesão? Há carência/nova análise?
44. [MÉDIA] Confirmar certificado/apólice, seguradora, teto de R$ 800 mil/cota e regra de idade >70 anos/avalista.
45. [BAIXA] Confirmar na proposta oficial que taxa de adesão/cadastro inicial = R$ 0 e que não existe tarifa separada de liberação de crédito.

46. [ALTA] Grupo em andamento: o art. 8º, VI, “a”, do Regulamento Bamaq 2025 ainda vale para a proposta 2026? Em caso de contemplação, haverá qualquer cobrança/dedução correspondente às assembleias anteriores à adesão?
47. [ALTA] Confirmar documentalmente que a nova cota terá exatamente 214 parcelas contratuais e nenhum valor retroativo fora delas.

48. [MÉDIA] Por que a parcela “reduzida 50%” usa coeficiente 0,2919% da carta e fica sistematicamente abaixo de metade da parcela integral?
49. [ALTA] As cotações garantem cashback nominal de R$40k/R$37k/R$20k mesmo quando houver lance embutido reduzindo o crédito líquido liberado?
50. [MÉDIA] De onde vem o valor de R$123,3 mil citado como teto de 10% para ITBI/cartório, se 10% de R$1,37 milhão são R$137 mil?
51. [MÉDIA] O prazo para pagar lance vencedor é 3 dias, como na mensagem, ou 2º dia útil, como constava na ata analisada?

52. [ALTA] Qual é a data exata do aniversário/reajuste do Grupo 4012? A assembleia “do dia 18” é esse aniversário?
53. [ALTA] Se eu contratar/alocar agora, os R$3.999,03 e R$8.002,17 já sofrem 3% na próxima assembleia do dia 18 ou ficam travados até o aniversário seguinte?
54. [URGENTE] Qual ato até 30/09 efetivamente garante a cotação/cashback: emissão do contrato, assinatura, pagamento da primeira parcela ou alocação efetiva das cotas?
55. [BAIXA] Seguro contratado posteriormente: há carência/janela e qual é a fórmula usada na data de inclusão?









============================================================
14. ITENS JÁ RESOLVIDOS NA FERRAMENTA
============================================================

- A1: base de preço de venda configurável.
- A2: lance limitado ao saldo amortizável.
- A3: custos do imóvel podem gerar fluxo negativo.
- A4: motor financeiro unificado.
- A5: patrimônio líquido de realização.
- A6: compra no fim do mês; aluguel a partir do seguinte.
- A7: múltiplo anualizado separado da TIR real.
- A9: patrimônio pré-contemplação não é mais artificialmente exibido.
- A10: ordem reajuste/contemplação configurável.
- A11: base matemática dos rendimentos no resgate corrigida.
- A13: cashback separado do caixa do mês da compra.
- A15: limites do lance aplicados no motor.
- A16: inputs manuais não são mais sobrescritos.
- A17: uso direto do saldo real da carta.
- R1: gráfico de sensibilidade ao rendimento da carta implementado.

Extensões posteriores à auditoria original:
- V2.51: TR projetada opcional no empréstimo do lance, com default de 0%, separada da inflação.
- V2.52: KPI explícito de “Aportes próprios acumulados em valores de hoje”.
- V2.53: seção opcional de seguro/proteção financeira, com três bases de cálculo configuráveis e KPIs próprios.
- V2.54 / B1: `N` voltou a ser devolvido pelo motor para os KPIs e warnings dependentes do horizonte.
- V2.54 / B2: cenários hipotéticos do break-even recalculam o resgate para respeitar contemplação + 6 meses.
- V2.54 / B3-B4: painel de venda da carta trata corretamente inexistência de janela válida e não usa mais `cfg.redeemRaw`.
- V2.54 / B5: valor recebido na cessão da carta passa a render somente no mês seguinte, coerente com a convenção de fim de mês.
- V2.54 / Q06: custos da cessão superiores à proposta viram aporte do bolso; a perda não é mais truncada em zero.
- V2.54 / B7: interface avisa explicitamente que o modelo atual é de uma carta única equivalente.

============================================================
15. PRÓXIMO MARCO
============================================================

Situação após a segunda auditoria:
- o motor financeiro da V2.53 foi considerado adequado para análise exploratória nos invariantes testados;
- a V2.54 corrige os principais bugs objetivos encontrados nos painéis auxiliares e na exibição;
- as maiores incertezas agora estão nas premissas contratuais/macroeconômicas e na estrutura de múltiplas cotas.

Próximos passos:
1. Obter respostas formais sobre:
   - rendimento da carta e possibilidade de pagar parcelas;
   - tributação/custos dos rendimentos;
   - índice/regra de reajuste;
   - saída da carta não utilizada no encerramento;
   - uso conjunto de créditos de múltiplas cotas.
2. Definir cenários macroeconômicos explícitos para CDB e reajuste, idealmente com matriz de sensibilidade conjunta.
3. Implementar a estrutura de N cotas independentes, com contemplação, lance, saldo, rendimento e compra/uso do crédito por cota.
4. Reexecutar a suíte da segunda auditoria após cada mudança estrutural.

Até lá, a V2.54 deve ser interpretada como uma simulação exploratória de “carta única equivalente”. A segunda auditoria mostrou que essa aproximação pode mudar inclusive o sinal do resultado quando as cotas reais são contempladas em momentos diferentes. Os campos de TR e seguro continuam sendo sensibilidades configuráveis e não devem ser lidos como confirmação das condições contratuais reais.