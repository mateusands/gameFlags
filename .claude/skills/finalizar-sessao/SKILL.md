---
name: finalizar-sessao
description: Encerra a sessão de trabalho no gameFlags — gera o relatório da sessão em .claude/sessions/ e atualiza o CLAUDE.md se algo que ele afirma mudou. Use ao final de cada sessão.
---

# Encerramento de Sessão — gameFlags

O objetivo agora **não é codar**, e sim consolidar o que a sessão mudou.

## 1. Relatório da sessão

- Crie `.claude/sessions/YYYY-MM-DD.md` (data de hoje). Se já existir arquivo com a data de hoje,
  **acrescente** uma seção em vez de sobrescrever.
- Conteúdo exigido:
  - **O que foi feito** — o que mudou em `main.js` / `index.html` / `style.css`.
  - **Decisões técnicas não-óbvias** — e o porquê.
  - **Spec e comportamento** — o contrato declarado antes do código (exigência do `CLAUDE.md`).
  - **Cenários exercitados** — quais itens do checklist de `/rodar-local` você realmente executou. Seja
    honesto: se testou 3 dos 9 idiomas, escreva 3.
  - **Pendências** — explícitas o bastante para retomar sem contexto.
  - **Estado do git** — branch, se ficou coisa não commitada, se algo foi publicado.

> `.claude/sessions/` é **gitignorado** — caderno de bordo local, não documentação do repo.

## 2. Atualização do CLAUDE.md

Avalie se a sessão mudou algo que o `CLAUDE.md` afirma. Gatilhos:

- **Armadilha resolvida** — se você corrigiu o laço infinito, o `shuffle` enviesado ou o `highScore`
  string, **remova o item da seção "Armadilhas ativas"**. Documento que descreve bug já corrigido é pior
  que documento nenhum.
- **Armadilha nova descoberta** — acrescente. É o item mais valioso deste arquivo.
- Idioma novo adicionado (a lista de 9 aparece em vários pontos).
- Mudança na forma de carregar o script, ou nas dependências externas (APIs).
- Arquivo novo no projeto (a estrutura de 3 arquivos está documentada).

## 3. Validação final

Não há runner (dívida consciente, ver `CLAUDE.md`) — a validação é manual, e **o registro dela é a única
evidência que sobra**. Antes de encerrar, confirme e **relate o que de fato foi testado**:

- Os 9 idiomas renderizam sem `undefined`
- Acerto, erro e timeout levam ao resultado certo
- Recorde persiste após recarregar
- Voltar ao menu no meio da partida não deixa timer correndo

Se não deu para testar tudo, diga o que ficou de fora. Não afirme verde que você não viu.

## O que responder ao usuário

1. Caminho do relatório gerado.
2. Se o `CLAUDE.md` foi atualizado, e o que mudou (ou que nada foi necessário).
3. O que foi validado manualmente e o que não foi.
4. **Não commite nem faça push** — lembre que push na `main` publica no GitHub Pages na hora.
