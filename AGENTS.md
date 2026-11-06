# Instruções do projeto para agentes de desenvolvimento

Este repositório adota **GitHub Flow orientado por issues**. Antes de desenvolver, revisar ou integrar código, leia a skill local [git-workflow](.agents/skills/git-workflow/SKILL.md) (adaptação atribuída à [Netresearch git-workflow-skill](https://github.com/netresearch/git-workflow-skill)) e o [procedimento do projeto](docs/workflow-desenvolvimento.md).

## Regras obrigatórias

1. **Nunca fazer commits ou pushes diretamente na `main`.** Abrir uma issue (ou reutilizar uma existente), criar uma branch a partir da `main` atualizada e trabalhar somente nessa branch.
2. Nome da branch: `feat/<issue>-assunto`, `fix/<issue>-assunto`, `docs/<issue>-assunto` ou `chore/<issue>-assunto`. Ex.: `feat/32-perfis-contratuais`.
3. Usar **Conventional Commits** com escopo/issue quando útil, mudanças pequenas e rastreáveis; não reescrever o histórico da `main` nem usar `git push --force`. Nunca fazer squash por padrão: preservar commits atômicos salvo solicitação explícita.
4. Implementar **código, testes e documentação** na mesma branch. As fontes de verdade financeiras são `docs/especificacao-modelo.md`, `docs/pendencias.md`, `docs/backlog-software.md` e `docs/follow-up-auditorias.md` quando uma regra do modelo é alterada.
5. Abrir PR direcionado à `main`, vincular issue com `Closes #N` **apenas quando todos os critérios de aceite estiverem atendidos**, e preencher o template com evidências, riscos e decisões. Caso contrário, usar `Refs #N`, deixar a issue aberta e listar pendências.
6. **Não fazer merge sem verificação de CI aprovada no GitHub**, revisão explícita do diff no commit atual e ausência de discussões de revisão pendentes. `npm test` local, avaliação JS isolada e a existência do workflow **não substituem** a confirmação do job `regression` no PR.
7. O usuário autorizou decisões técnicas autônomas: seguir com mudanças reversíveis, testadas e documentadas sem solicitar aprovação a cada etapa. Decisões financeiras/contratuais incertas devem ser registradas e não apresentadas como fatos; alterações destrutivas, incompatíveis ou inseguras exigem cautela e gates objetivos.
8. Fechar uma issue **só após a entrega verificável**, ou mantê-la aberta com checklist do trabalho faltante. Uma implementação parcial não é uma issue concluída.
9. Proteger o caso histórico **QuintoAndar/Bamaq V3.21** como baseline de regressão, sem aplicar premissas específicas desse produto a todos os grupos. Não alterar patrimônio, fluxo, crédito, lance, taxas ou cashback sem testes e documentação correspondente.
10. Se o conector ou o ambiente não oferecer o comando necessário (p. ex. proteção de branch), registrar o bloqueio claramente; **não substituir uma regra de servidor por uma simples instrução ao agente nem afirmar que a proteção está ativa**.

## Entradas e comandos de validação

- `npm test`: suíte de testes de modelo, políticas, imóvel, integração e wiring da interface.
- `.github/workflows/test.yml`: job `regression` roda em PRs e pushes na `main`. Verificar o resultado do **PR atual** antes do merge.
- Para resultados financeiros, documentar invariantes e casos numéricos; para alterações no navegador, realizar teste de interface quando houver acesso real ao navegador.
- Ferramentas autorizadas podem ser GitHub API/conector, Git/gh CLI quando disponíveis ou outra integração equivalente; **não presumir** que os scripts opcionais da skill upstream foram instalados.

## Primeira mudança depois desta adoção

Retomar a issue [#32](https://github.com/henriquecrang/cenarios-consorcio/issues/32) em branch própria e, se necessário, abrir issue de QA para a V3.22. Seguir a priorização já registrada em `docs/pendencias.md`.