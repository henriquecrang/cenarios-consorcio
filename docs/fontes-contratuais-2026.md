# Evidências contratuais comparadas — situação em 05/11/2026

**Origem:** pesquisa da [issue #35](https://github.com/henriquecrang/cenarios-consorcio/issues/35), vinculada à [auditoria #24](auditoria-generalizacao-consorcios.md). **Status:** pesquisa documental pública avançada; **não há contrato particular/ata inaugural atual de grupo Rodobens ou Santander identificado**. Portanto, nenhum perfil dessas empresas pode ser vendido/apresentado como "contrato do grupo validado".

## Fontes oficiais mais atuais localizadas

| Administradora e documento | Data/abrangência | Regras explícitas | Nível de prova | Limitação |
|---|---|---|---|---|
| [Bamaq — Regulamento Geral 2026](https://bamaqconsorcio.com.br/upload/pdf/regulamento_2026.pdf) | Publicado como "Regulamento Atualizado Bamaq Consórcio 2026" no [portal oficial](https://bamaqconsorcio.com.br/regulamento) | Art. 1º: fundo de reserva **se grupo possuir**, taxa admin e seguros conforme contrato; art. 2º: adendo pode estipular parcelas menores até contemplação e majoradas depois; art. 3º §2º: imóveis indexados ao **INCC ou percentual prefixado no contrato**; art. 5º e art. 7º: rendimentos financeiros entre disponibilização e utilização; art. 8º: destinos, créditos residuais, recebimento em espécie e obrigações retroativas | **Regulamento geral oficial vigente**, não é contrato particular do Grupo 4012 | Precisam contrato/ata/aditivo da adesão QuintoAndar para saber qual exceção à regra geral vale |
| [Bamaq — Grupo 4012](https://ajuda.bamaqconsorcio.com.br/2026/03/23/caracteristicas-do-grupo-4012/) | Página oficial 23/03/2026 | Identifica material informativo do grupo; dados individuais e condições finais precisam ser confirmados | Informação pública de grupo | Não substitui proposta específica assinada e ata/condições particulares |
| [Santander — Regulamento Unificado maio/2026](https://cms.santander.com.br/sites/WPS/documentos/arq-consorcios-regulamento-unificado/26-06-02_205842_regulamento-consorcio-santander-maio-2026.pdf) | Atualizado em 2026 e linkado na [documentação oficial](https://www.santander.com.br/consorciado-documentacao) | Cláusula 4.2: imóveis INCC ou IPCA com limites 3%, 5% ou 7%, ou reajuste prefixado 4% a.a. conforme grupo; **Anexo V item 1.4**: Lance Fixo 20% do bem + administração + reserva para imóveis/móveis (exceto motos), limitado à dívida; item 1.5: recurso próprio/FGTS; item 1.1 exige aprovação do lance na assembleia inaugural; Anexo IV: período de parcela reduzida | **Regulamento geral oficial atual**, documenta alternativas matemáticas reais | Proposta e ata do grupo necessárias para saber qual índice, limite, modalidade e plano foram escolhidos |
| [Rodobens — FAQ consórcio imobiliário](https://rodobens.com.br/ajuda/consorcio/consorcio-imoveis/perguntas-e-respostas) | Página oficial pública consultada 05/11/2026 | Informa **não cobrar fundo de reserva** no produto de imóveis descrito, seguro prestamista opcional, lances livre/fixo/embutido conforme grupo | Orientação oficial de oferta, não contrato | Necessários número do grupo, proposta, regulamento e ata atuais; documentação geral histórica de 2013 NÃO prova contrato de 2026 |
| [Rodobens — FAQ geral](https://rodobens.com.br/ajuda/consorcio/perguntas-e-respostas) | Página pública consultada 05/11/2026 | Lance é descrito como **quantidade de parcelas**; mínimo divulgado de 10% do saldo e máximo de 100% das parcelas faltantes; modalidades e atualização dependem de contrato | Orientação pública operacional | Bases, limites e cálculo por grupo ainda não confirmados em proposta/ata |

## Contradição relevante a resolver: entrada no Grupo 4012

O Regulamento Geral **Bamaq 2026**, art. 8º, inciso VI, alínea **a**, afirma que o consorciado que aderiu a grupo já em andamento deve pagar mensalidades relativas a assembleias anteriores à adesão, autorizando dedução no crédito contemplado em caso de não pagamento. O mesmo regulamento (art. 1º, §3º) prevê pagar integralmente as prestações previstas no prazo remanescente.

Na pesquisa QuintoAndar/Bamaq, Michele informou por escrito que **a proposta específica de quatro cotas do Grupo 4012 não teria cobrança retroativa**, atribuindo a regra genérica a substituição/repescagem de cotas. A explicação comercial **não prevalece por si só** contra o regulamento geral. Sem contrato, aditivo ou ata particular que explicite a exceção, manter esse ponto **NÃO RECONCILIADO**; não ativar automaticamente retroatividade nem afirmar inexistência contratualmente garantida.

**Encaminhamento documental:** solicitar à Bamaq o instrumento particular/aditivo aplicável à entrada de cota nova no Grupo 4012, com memória do saldo inicial, prazo remanescente e desconto retroativo (sim/não, cláusula). Ver [backlog-perguntas-bamaq.md](backlog-perguntas-bamaq.md).

## Matriz de fixtures de contrato (não certificadas)

| Fixture de teste | Campos verificáveis | Dependências de implementação | Validade |
|---|---|---|---|
| Bamaq/QuintoAndar cenário-base V3.21 | crédito 400/400/370/200, prazo 214, admin 24%, reserva 1%, fixo 3%, lances e cashback previstos comercialmente | #25, #26, #27, #28 e #32 devem preservar comportamento histórico | **Preset de proposta/comunicação comercial**, com lacunas formais |
| Santander regulamentar hipotético | `adjustmentMode=annual_series` com limites e curva exógena; `fixedBase=credit_plus_fees`, `allowFixedEmbedded=false`, fixo 20% | #25 e #26, taxa/índice real da ata não fornecidos | **Teste de algoritmo**, NÃO contrato real de grupo |
| Rodobens orientativo hipotético | `reserva=0` no produto imobiliário FAQ; lance pode usar quantidade de parcelas, índice precisa de documento do grupo | #27 e #26; parâmetros de grupo não fornecidos | **Teste de viabilidade**, NÃO contrato real de grupo |

**Regras de aprovação de fonte:** (1) norma obrigatória; (2) regulamento/contrato/ata específica; (3) memória oficial e proposta; (4) informação pública da administradora; (5) comunicação comercial; (6) simulação hipotética. Não preencher campos sem prova usando defaults específicos de outra marca.

## Próximas evidências necessárias (issue #35 ainda aberta)

- [ ] Rodobens: contrato/proposta atual, número/grupo e ata inaugural com modo de correção, lance, taxas e reserva.
- [ ] Santander: proposta e ata inaugural do grupo relevante, com indexador e limite, opção Fixo, embutido e plano reduzido.
- [ ] Bamaq 4012: proposta/adesão/aditivo que reconcilie a alínea do art. 8º, VI, a, com a dispensa comercial informada.
- [ ] Publicar fixtures **efetivamente** vinculadas a grupos específicos, quando houver autorização para usar material; nunca inventar parâmetros.

A implementação de alternativas matemáticas por **parâmetros genéricos** pode continuar antes dessas provas, mas **rotular preset de administradora/grupo como validado** fica bloqueado até obter contrato e ata.
