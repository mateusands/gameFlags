---
name: rodar-local
description: Rodar o gameFlags localmente (sem build, sem npm) e as pegadinhas do ambiente — por que abrir por file:// pode falhar, dependência das APIs externas, como simular queda de rede e como testar os 9 idiomas. Use ao rodar, testar manualmente ou debugar o jogo.
---

# Rodar o gameFlags localmente

## Não há build

Sem `npm install`, sem bundler, sem watch. São três arquivos estáticos: `index.html`, `main.js`, `style.css`.

## Jeito rápido

```bash
xdg-open index.html
```

Funciona na maioria dos casos, mas **prefira servir por HTTP** (abaixo) — em `file://` o navegador aplica
regras de origem diferentes, e o `fetch` para `restcountries.com` pode ser bloqueado dependendo do
navegador e da política de CORS do momento. Sintoma: a tela de idioma aparece, o botão fica em
"Carregando..." e nunca habilita.

## Jeito correto (servidor HTTP local)

```bash
python -m http.server 8000
# abra http://localhost:8000
```

Não precisa de nada instalado além do Python, que já está na máquina. Qualquer servidor estático serve.

## Pegadinhas

- **Botão preso em "Carregando..."** → o `fetch` de `restcountries.com/v3.1/all` falhou. Abra o console:
  `loadCountries()` só faz `console.error`, não avisa na tela. Cheque rede, CORS e se a API mudou o
  contrato (`name.common`, `cca2`, `translations.*.common`).

- **A aba congela ao iniciar a partida** → é a armadilha nº 1 do `CLAUDE.md`: `countries` está vazio e
  `newRound()` entra em laço infinito montando as 4 alternativas. Acontece exatamente quando a API falhou
  mas o jogador conseguiu clicar em "Iniciar". Para reproduzir de propósito: bloqueie
  `restcountries.com` no DevTools (Network → Block request domain) e clique em iniciar.

- **Bandeira não carrega, resto funciona** → `flagcdn.com` fora do ar ou código de país inválido. A `<img>`
  não tem handler de erro; fica só o `alt`.

- **Cache do navegador** esconde sua edição em `main.js`/`style.css`. Use hard reload
  (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) ou desabilite cache no DevTools.

- **Testar o recorde:** ele vive em `localStorage` na chave `highScore`. Para zerar:
  ```js
  localStorage.removeItem("highScore")   // no console do DevTools
  ```
  Lembre que ele volta como **string**.

- **`onclick=` no HTML** exige que `setLanguage` e `goBackToMenu` estejam em `window`. Se você mexer no
  carregamento do script (ex.: `type="module"` ou `defer`), teste os botões de idioma — eles quebram
  silenciosamente com erro só no console.

## Checklist de teste manual

Não há runner (dívida consciente, ver `CLAUDE.md`) — **este checklist é a validação**, e registrá-lo é
exigência da regra de SDD/BDD/TDD. Antes de dizer "pronto", passe por:

1. **Os 9 idiomas** — clique em cada um e confirme que nenhum texto renderiza `undefined`.
2. **Acerto** → pontuação sobe, próxima rodada começa, timer reinicia em 5.
3. **Erro** → vai direto para game over.
4. **Timeout** → deixe os 5s acabarem sem clicar; deve dar game over igual ao erro.
5. **Recorde** → faça pontuação maior que a anterior e recarregue a página; o recorde persiste.
6. **Voltar ao menu** no meio da partida → timer para (confirme que não há contagem rodando por baixo) e
   o estado zera.
7. **Responsividade** — o jogo é publicado no GitHub Pages e aberto no celular.

## Deploy

GitHub Pages serve a raiz da `main`. Push na `main` publica — **por isso, não commite sem ordem**: um
push aqui é publicação imediata em https://mateusands.github.io/gameFlags/
