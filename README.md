# Cenários de Consórcio

Simulador e documentação de investigação para análise de cenários de consórcio imobiliário, contemplação por lance, crédito contemplado, cashback e comparação com alternativas de investimento.

## Estado atual

- **Aplicação:** V3.19 em `index.html`, servida diretamente pelo GitHub Pages.
- **Documentação canônica:** consolidada a partir da rodada `pre_respostas30`, com limpeza de inconsistências residuais e a divergência posterior sobre o histórico de lances.
- **Histórico:** preservado pelo Git; não mantemos cópias versionadas redundantes na árvore atual.

## Estrutura

- `index.html` — interface e orquestração do simulador; entry point do GitHub Pages.
- `model-core.js` — regras financeiras puras de baixo nível.
- `scenario-engine.js` — motor completo `runScenario`, sem dependência do DOM e compartilhado pelo navegador e pelos testes.
- `tests/model-core.test.js` — regressões unitárias das regras críticas.
- `tests/scenario-engine.test.js` — regressões de integração da operação multi-cota.
- `.github/workflows/test.yml` — CI sem dependências externas; executa `npm test` a cada push/PR.
- `docs/especificacao-modelo.md` — especificação canônica do modelo.
- `docs/pendencias.md` — somente pendências e riscos ainda relevantes.
- `docs/backlog-software.md` — backlog técnico e estado das mudanças.
- `docs/backlog-perguntas-bamaq.md` — perguntas, respostas e reconciliações comerciais/documentais.
- `docs/follow-up-auditorias.md` — trilha de auditorias e evidências.

## GitHub Pages

O projeto é um site estático puro, sem build:

- entry point: `/index.html`;
- processamento Jekyll desativado por `.nojekyll`;
- documentação permanece em `/docs`.

Para publicar, configure o GitHub Pages para servir a branch `main` a partir de `/(root)`.

URL esperada após a publicação:

`https://henriquecrang.github.io/cenarios-consorcio/`

## Estado após a auditoria da V3.5

As issues #5–#10 abertas pela auditoria foram concluídas nas versões V3.6–V3.11:

- **V3.6 / #5:** matriz economicamente comparável com política comum de compra e preço;
- **V3.7 / #9:** CDI bruto separado do benchmark CDB líquido;
- **V3.8 / #10:** presets antigos recebem alerta/migração explícita;
- **V3.9 / #6:** sensibilidades de financiamento do lance em 0% / 50% / 100%;
- **V3.10 / #7:** cashback conservador exclui rendimentos acumulados da base por default;
- **V3.11 / #8:** motor completo extraído para `scenario-engine.js` e protegido por testes de integração;
- **V3.12 / #12:** cashback recebido no mês seguinte à compra por default;
- **V3.13 / #13:** taxa de transferência calculada sobre saldo devedor por cota;
- **V3.14 / #14:** crédito residual pós-compra deixa de ser contado como ativo livre sem política explícita.
- **V3.15 / #15:** Lance Fixo e Lance Livre passam a ser modalidades explícitas, com bases distintas e testes;
- **V3.16 / #16:** compra pode usar apenas um subconjunto das cotas; cotas não usadas permanecem independentes no motor;
- **V3.17 / #17:** modalidade, percentual de lance e embutido passam a ser configuráveis por cota; campos globais viram defaults copiáveis;
- **V3.18 / #18:** painel reconcilia a cotação comercial com os valores calculados pelo motor sem transformar a cotação em override financeiro;
- **V3.19 / #19:** interface explicita prazo de 2 dias úteis para o lance vencedor e a necessidade de solicitação mensal para usar rendimento na parcela.

A documentação canônica foi saneada na **#11** e continua sincronizada com V3.19; o histórico permanece no Git e em `docs/follow-up-auditorias.md`.

Os gaps ainda reais ficam concentrados em `docs/pendencias.md` e em novas issues de implementação quando necessário.

## Governança de evidências

Quando fontes divergem, usamos esta hierarquia:

1. contrato, regulamento e norma oficial aplicável;
2. atas e documentos operacionais oficiais;
3. memórias de cálculo reproduzíveis;
4. respostas comerciais escritas;
5. respostas comerciais verbais.

Afirmações comerciais conflitantes com documentos oficiais não viram premissa canônica do simulador.

## Privacidade

O repositório é público. Dados cadastrais pessoais (CPF, endereço, documentos, e-mail etc.) não fazem parte da documentação do projeto.

## Observação

Este projeto é um modelo de análise. Não constitui recomendação de investimento nem substitui contrato, regulamento ou validação jurídica/tributária.
