# Cenários de Consórcio

Simulador e documentação de investigação para análise de cenários de consórcio imobiliário, contemplação por lance, crédito contemplado, cashback e comparação com alternativas de investimento.

## Baseline importada

- **Aplicação:** simulador V3.2 em `app/simulador.html`.
- **Documentação reenviada pelo usuário:** snapshot `pre_respostas17`, organizado em `docs/`.
- O histórico da investigação continuou depois desse snapshot. Portanto, os arquivos de documentação importados preservam a baseline recebida, mas **não representam sozinhos todas as conclusões posteriores da conversa**.

## Estrutura

- `app/simulador.html` — simulador standalone em HTML/JS.
- `docs/especificacao-modelo.md` — especificação do modelo no snapshot importado.
- `docs/pendencias.md` — pendências de modelagem, contrato e validação.
- `docs/backlog-software.md` — backlog de alterações do simulador.
- `docs/backlog-perguntas-bamaq.md` — perguntas comerciais/documentais.
- `docs/follow-up-auditorias.md` — trilha de auditorias e evidências.
- `docs/backlog-legado.md` — anotações antigas preservadas do pacote recebido.

## P0s descobertos após a baseline

Antes de voltar a usar o simulador para uma decisão econômica, revisar pelo menos:

1. **Lance Livre:** recalibrar defaults e matriz de cenários com o histórico real observado do Grupo 4012; os 30%/45% usados como referência ficaram muito abaixo dos vencedores documentados.
2. **Rendimento da carta:** alterar a premissa-base líquida de 98% para aproximadamente 80% do CDI.
3. **Regressão:** validar por testes a base do Lance Livre, o lance embutido e o cashback multi-cota.
4. **Documentação:** consolidar no repositório as respostas posteriores ao snapshot `pre_respostas17`.

## Observação

Este projeto é um modelo de análise. Não constitui recomendação de investimento nem substitui contrato, regulamento ou validação jurídica/tributária.
