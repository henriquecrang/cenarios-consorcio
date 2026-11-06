# Fluxo de desenvolvimento GitHub — Consórcio × CDB × Imóvel

**Adotado na [issue #36](https://github.com/henriquecrang/cenarios-consorcio/issues/36).** O processo é baseado na [Netresearch git-workflow-skill](https://github.com/netresearch/git-workflow-skill) e implementado na [skill local](../.agents/skills/git-workflow/SKILL.md), adaptada sob CC BY-SA 4.0. O `AGENTS.md` é o ponto de entrada obrigatório para agentes.

## O ciclo por issue

1. Selecionar uma **issue** e conferir critérios, dependências, documentação do motor e escopo parcial já incorporado.
2. Criar branch da `main`: `feat/NN-descricao`, `fix/NN-descricao`, `docs/NN-descricao`, `chore/NN-descricao`. Nunca commitar diretamente na `main`.
3. Implementar a issue na branch com **Conventional Commits**, testes, documentação e revisão de diffs. Evitar mudanças de outra issue na mesma branch.
4. Abrir **Pull Request** para `main`, preenchendo template. Usar `Closes #NN` só quando realmente completa; usar `Refs #NN` para entrega parcial.
5. Confirmar **`npm test` executado** e **job `regression` do PR aprovado no GitHub**. Nenhum resultado ausente/pending/fail vale como sucesso. Revisar diff e resolver os comentários na cabeça atual.
6. Fazer **merge sem squash**, preservando commits atômicos conforme Netresearch, exceto se o mantenedor solicitar squash. Confirmar estado integrado, atualizar documentação e fechar issue somente quando os critérios de aceite estiverem totalmente satisfeitos.
7. Se houver bloqueio, deixar PR aberto com status factual e próxima ação; não fazer commit na `main` para contornar a proteção.

O usuário autorizou execução autônoma e decisões técnicas reversíveis: não pedir aprovação de cada PR, mas registrar no PR premissas econômicas/contratuais, possíveis breaking changes e decisões que mereçam revisão posterior.

## O que já existe no repositório

- `.github/workflows/test.yml`: `pull_request` em qualquer branch, e `push` para `main`; job **`regression`** com Node 22 e `npm test`.
- `package.json`: testes do núcleo, políticas, imóvel, motor integrado e configuração estática da UI.
- `docs/especificacao-modelo.md`: regras financeiras canônicas. `docs/pendencias.md` e `docs/backlog-software.md`: limites e plano de trabalho.
- A V3.22 tem histórico de alterações diretas na `main` anteriores à adoção; **não reescrever** esses commits para criar branches retroativas.

## Proteção da main — configuração administrativa separada

**Importante:** os arquivos deste PR, por si só, **não ativam proteção no servidor**. É necessário criar um **branch ruleset no GitHub**. Quando a integração de GitHub não expõe operação de regras administrativas, o mantenedor deve fazer o seguinte:

1. Abrir [Settings → Rules → Rulesets](https://github.com/henriquecrang/cenarios-consorcio/settings/rules) no repositório.
2. Escolher **New ruleset → New branch ruleset**.
3. Nome: `main — PR + regression`; **Enforcement status: Active**.
4. Em **Target branches**, incluir **default branch** (ou padrão exato `main`).
5. Marcar **Require a pull request before merging**. Para trabalho autônomo, **não** exigir um número de approvals humanas por enquanto; exigir apenas PR e revisão de diff documentada. Não habilitar `Require review from Code Owners` sem equipe de reviewers disponível.
6. Marcar **Require status checks to pass** e selecionar o check **`regression`** do workflow `.github/workflows/test.yml`. Se ainda não aparecer, executar um PR de testes primeiro e voltar para selecioná-lo.
7. Opcional/recomendado: **Block force pushes**, **Restrict deletions**. Não adicionar pessoas/apps a uma lista de bypass que permita atualizar a `main` diretamente; evitar liberar bypass de administradores sem motivo.
8. Salvar e verificar que o ruleset aparece como **Active** e que um push direto à `main` está proibido. Não supor que a configuração foi aplicada só porque a documentação existe.

Documentação oficial: [GitHub — Creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).

### Confirmação de CI

O job `regression` é a condição exigida. Não confundir o nome do workflow **`tests`** com o nome do job. Conferir no PR em **Checks** o estado `success` para o commit atual; se houver conflito com ruleset e PR, não fazer merge.

### Quando o merge pode ser autônomo?

- PR inteiramente dentro do escopo, com CI aprovado no GitHub, diff revisado e sem discussões pendentes: agente pode integrar sem pedir aprovação por item, respeitadas permissões e regras ativas.
- PR com regras financeiras incertas, regressão, testes não executados, proteção em configuração ou alteração destrutiva: manter aberto e registrar a ressalva, sem afirmar aprovação.
- A skill original Netresearch evita squash por padrão, ao contrário da sugestão anterior de squash; neste projeto prevalece **não fazer squash** salvo instrução específica.

## Proteções contratuais que independem do Git

O simulador preserva as regras V3.21 QuintoAndar/Bamaq como base regressiva, mas não pode presumir seus parâmetros como condições de Rodobens/Santander. Para qualquer nova política de índice, lance, remuneração da carta, saldo residual ou amortização, exigir evidência de contrato/ata quando ela for apresentada como regra específica de um grupo. Documentar teste numérico e efeito no patrimônio/comparabilidade.

## Limitações operacionais do ambiente

O conector GitHub autoriza criar branches, editar arquivos, abrir PRs e integrar quando possível; **não oferece atualmente operação de proteção de branch/rulesets** neste fluxo. O ambiente pode não ter `gh`, `git` ou scripts Netresearch. Quando faltar ferramenta, reconhecer a limitação e deixar a configuração administrativa em aberto — nunca dizer que a `main` está protegida sem confirmação explícita.
