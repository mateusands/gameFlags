---
name: iniciar-sessao
description: Inicializa a sessão de trabalho no gameFlags — lê o CLAUDE.md, o estado do git e as pendências da última sessão, em modo somente leitura, e confirma o alinhamento de escopo antes de qualquer código. Use no começo de cada sessão.
---

# Inicialização de Sessão — gameFlags

Jogo de navegador em **HTML + CSS + JS puro**, sem build, publicado no GitHub Pages.
A fonte da verdade é **o código** — e são só três arquivos.

Antes de qualquer ação, execute os passos de leitura abaixo:

1. **Leia o `CLAUDE.md` da raiz** — propósito, stack, dependências externas e, principalmente, a seção
   **"Armadilhas ativas"**. Elas continuam no código; não as descubra de novo do zero.

2. **Leia a última sessão**, se houver: `.claude/sessions/` (arquivo mais recente). É onde ficam as
   pendências deixadas para hoje.

3. **Levante o estado real do git** (somente leitura):
   ```bash
   git status --short && git branch --show-current && git log --oneline -10
   ```

4. **Leia os três arquivos.** `main.js` (318 linhas), `index.html` e `style.css`. O projeto é pequeno o
   bastante para caber inteiro no contexto — aproveite isso, é a vantagem dele.

5. **MODO SOMENTE LEITURA:** é proibido alterar código, criar ou apagar arquivo nesta etapa.

## Gates que valem nesta sessão

Confirme explicitamente que estão ativos:

- **Zero dependências.** Nada de npm, bundler, framework ou `<script>` de CDN sem pedido explícito. O
  valor do projeto é ser um arquivo que abre e roda.
- **`main.js` não é módulo ES.** `setLanguage` e `goBackToMenu` vivem em `window` porque o HTML os chama
  por `onclick=`. Mudar o carregamento do script quebra os botões de idioma em silêncio.
- **9 idiomas.** Toda string visível precisa existir em `pt, en, es, ja, zh, ko, ru, fr, it`.
- **`main` publica.** O GitHub Pages serve a raiz da `main` — **push aqui é deploy imediato**. Nada de
  commit/push sem ordem explícita.
- **SDD + BDD + TDD obrigatório**, mesmo sem runner: spec antes do código, comportamento declarado no
  formato "deve `<resultado>` quando `<condição>`", cenários exercitados **e registrados**. Não anuncie
  "pronto" sem a lista de cenários que você de fato rodou (ver `/rodar-local`).
- **Não introduza `package.json`/bundler** para montar suíte — é decisão do dono, e muda a natureza do
  projeto.

## O que responder ao usuário

Retorno **curto**: branch atual, se o working tree está limpo, o que vamos mexer, e se havia pendência da
sessão anterior. Confirme numa frase que os gates acima estão ativos.
