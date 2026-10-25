# Cenários de Consórcio

Simulador e documentação de investigação para análise de cenários de consórcio imobiliário, contemplação por lance, crédito contemplado, cashback e comparação com alternativas de investimento.

## Estado atual

- **Aplicação:** V3.2 do simulador em `index.html`, servido diretamente pelo GitHub Pages.
- **Documentação canônica:** consolidada a partir da rodada `pre_respostas30`, com limpeza de inconsistências residuais e a divergência posterior sobre o histórico de lances.
- **Histórico:** preservado pelo Git; não mantemos cópias versionadas redundantes na árvore atual.

## Estrutura

- `index.html` — interface e orquestração do simulador; entry point do GitHub Pages.
- `model-core.js` — núcleo financeiro puro compartilhado pelo navegador e pelos testes.
- `tests/model-core.test.js` — regressões das regras críticas.
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

## P0 antes de nova decisão econômica

Os três P0s identificados após a investigação estão concluídos.

- **V3.3:** Lance Livre recalibrado — default analítico de 70%, presets históricos de 60,1%–73% e alertas quando o lance configurado fica abaixo do histórico observado.
- **V3.4:** rendimento líquido-base da carta alterado para 80% do CDI; presets de rendimento passam a 70% / 80% / 90%, sem tratar 98%–105% bruto como retorno líquido.
- **V3.5:** regras críticas extraídas para `model-core.js` e protegidas por regressões automatizadas de Lance Livre, embutido e cashback multi-cota.

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
