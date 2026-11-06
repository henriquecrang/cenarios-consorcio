---
name: git-workflow
description: "Use ao iniciar, implementar, revisar ou concluir uma issue, criar branch/commit/PR, verificar CI e integrar mudanças do cenarios-consorcio."
license: "CC-BY-SA-4.0 (adapted from Netresearch DTT GmbH git-workflow-skill)"
compatibility: "GitHub connector/API or git+gh CLI; no external skill scripts required"
metadata:
  original-author: "Netresearch DTT GmbH"
  adapted-for: "henriquecrang/cenarios-consorcio"
  upstream-repository: "https://github.com/netresearch/git-workflow-skill"
  upstream-version: "1.39.0"
  upstream-skill-blob: "3706c2c8ad791fc73cd9c9dc076c58822df84a51"
---

# Git workflow — adaptação local da Netresearch

**Procedência.** Skill baseada nas regras e práticas de [Netresearch git-workflow-skill](https://github.com/netresearch/git-workflow-skill/blob/main/skills/git-workflow/SKILL.md), de Netresearch DTT GmbH, versão 1.39.0 (blob `3706c2c8ad791fc73cd9c9dc076c58822df84a51`). **Adaptação realizada:** versão autocontida para GitHub API/conector, backlog e economia do consórcio, sem instalar os scripts opcionais de Netresearch. Atribuição e compartilhamento desta adaptação sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); ver [licença local](LICENSE-CC-BY-SA-4.0). Para as instruções originais completas e referências, consultar o repositório upstream.

## Princípios que preservamos da Netresearch

- **Jamais atualizar a `main` diretamente**; toda alteração passa por PR.
- **Commits atômicos e Conventional Commits**; sem squash por padrão; só usar squash com pedido explícito.
- Só declarar teste, CI ou revisão como concluído com **evidência de execução** no commit correto.
- Resolver todas as conversas de revisão e corrigir todos os bloqueios antes de integrar.
- Evitar `--force`; se necessário ao rebase da branch própria, usar apenas `--force-with-lease` com base verificada.
- Documentar decisões, não ocultar diferenças entre testes locais e gates reais.
- Não reescrever o histórico de branches protegidas; não executar scripts externos não instalados.

## Protocolo para cada issue

### 1. Preparação

1. Ler issue, critérios de aceite, dependências, histórico/estado das issues relacionadas e documentação canônica.
2. Confirmar se o trabalho já está implementado parcialmente na `main` para evitar duplicatas ou reverts acidentais.
3. Criar branch da `main` atualizada: `feat/<n>-<slug>`, `fix/<n>-<slug>` ou `chore/<n>-<slug>`. Não utilizar a branch de outra issue.
4. Manter mudanças relacionadas a uma issue por PR; dependências críticas exigem merge prévio ou PR explicitamente empilhado.

### 2. Implementação e validação

1. Alterar código e testes em conjunto; manter comportamento legado sob regressões.
2. Executar `npm test` em ambiente real, quando disponível. Se não houver Node/local checkout, identificar exatamente qual teste foi possível executar; não declarar `npm test` aprovado sem execução do comando.
3. Para regra financeira: adicionar teste numérico, cenário V3.21 preservado, confirmação de bases/datas e atualização de `docs/especificacao-modelo.md`, `docs/pendencias.md`, `docs/backlog-software.md` e `docs/follow-up-auditorias.md`.
4. Revisar diffs e garantir ausência de dados privados, alteração lateral acidental ou documentação contraditória.

### 3. Pull Request

1. Publicar branch e abrir PR para `main`.
2. Título Conventional Commit: `feat(#N): ...`; body conforme `.github/pull_request_template.md`.
3. Inserir `Closes #N` apenas se os critérios estiverem totalmente atendidos; do contrário, `Refs #N` e descrever o que falta.
4. Citar testes executados **e seus resultados**, decisões autônomas, compatibilidade e pendências contratuais. O PR é o registro de auditoria.

### 4. Gate de integração

Verificar **todos**, no head atual do PR:

- PR não está em draft; diff revisado (autorrevisão documentada quando não há outro revisor disponível).
- CI exigido `regression` **concluído com sucesso no GitHub**; falha, ausência de resultado e pendência **não são aprovação**.
- Sem comentários de revisão não respondidos ou threads sem resolução.
- Branch atualizada em relação à `main` ou sem conflito; nenhum commit inesperado.
- A mudança não introduz fórmula, default comercial, comportamento jurídico ou migração destrutiva não documentados.
- A política atual de proteção da `main` e permissões de merge é respeitada.

Depois do gate: integrar via **merge commit/rebase**, sem squash por padrão; conferir estado `merged` do PR, atualizar/fechar issue conforme entrega e excluir branch integrada quando seguro.

### 5. Se houver bloqueio

Não fazer push direto na `main` para contornar CI/PR. Deixar PR aberto, registrar o bloqueio, próxima ação concreta e consequências. Quando faltar documentação contratual, seguir apenas com opções conservadoras comprováveis; não inventar condições de administradoras.

## Configuração de servidor (não se resolve com a skill)

Um arquivo `AGENTS.md` **não** configura branch protection. A regra efetiva requer **GitHub Settings → Rules → Rulesets**, branch `main`, PR obrigatório e check `regression`. Ver `docs/workflow-desenvolvimento.md`. Se a integração não oferecer API administrativa, a ativação depende de ação do mantenedor.

## Referências upstream

- [SKILL.md original](https://github.com/netresearch/git-workflow-skill/blob/main/skills/git-workflow/SKILL.md)
- [Conventional Commits](https://github.com/netresearch/git-workflow-skill/blob/main/skills/git-workflow/references/commit-conventions.md)
- [Pull request workflow](https://github.com/netresearch/git-workflow-skill/blob/main/skills/git-workflow/references/pull-request-workflow.md)
- [CI/CD integration](https://github.com/netresearch/git-workflow-skill/blob/main/skills/git-workflow/references/ci-cd-integration.md)

**Nota de portabilidade:** os scripts opcionais upstream (`pr-status.sh`, `pr-merge.sh`, `verify-git-workflow.sh`) **não** são copiados ou instalados aqui; nunca agir como se tivessem sido executados.