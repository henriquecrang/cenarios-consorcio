# Cenários de Consórcio

Simulador e documentação de investigação para análise de cenários de consórcio imobiliário, contemplação por lance, crédito contemplado, cashback e comparação com alternativas de investimento.

## Estado atual

- **Aplicação:** V3.2 do simulador em `app/simulador.html`.
- **Documentação canônica:** consolidada a partir da rodada `pre_respostas30`, com limpeza de inconsistências residuais e a divergência posterior sobre o histórico de lances.
- **Histórico:** preservado pelo Git; não mantemos cópias versionadas redundantes na árvore atual.

## Estrutura

- `app/simulador.html` — simulador standalone em HTML/JS.
- `docs/especificacao-modelo.md` — especificação canônica do modelo.
- `docs/pendencias.md` — somente pendências e riscos ainda relevantes.
- `docs/backlog-software.md` — backlog técnico e estado das mudanças.
- `docs/backlog-perguntas-bamaq.md` — perguntas, respostas e reconciliações comerciais/documentais.
- `docs/follow-up-auditorias.md` — trilha de auditorias e evidências.

## P0 antes de nova decisão econômica

1. **Lance Livre:** recalibrar defaults e matriz com o histórico real do Grupo 4012; 30%/45% não são referências competitivas suportadas pelas atas.
2. **Rendimento da carta:** alterar a premissa-base líquida de 98% para aproximadamente 80% do CDI.
3. **Regressão:** proteger por testes a base do Lance Livre, o lance embutido e o cashback multi-cota.

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
