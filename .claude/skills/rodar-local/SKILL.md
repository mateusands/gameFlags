---
name: rodar-local
description: Rodar o flag-rush localmente (sem build, sem npm) e as pegadinhas do ambiente — por que abrir por file:// pode falhar, dependência das APIs externas, como simular queda de rede e como testar os 9 idiomas. Use ao rodar, testar manualmente ou debugar o jogo.
---

# Rodar o flag-rush localmente

## Não há build

Sem `npm install`, sem bundler, sem watch. São quatro arquivos estáticos: `index.html`, `main.js`,
`style.css` e `countries.json`.

## Jeito rápido

```bash
xdg-open index.html
```

Funciona na maioria dos casos, mas **prefira servir por HTTP** (abaixo) — em `file://` o navegador aplica
regras de origem diferentes, e o `fetch` dos países pode ser bloqueado dependendo do
navegador e da política de CORS do momento. Sintoma: a tela de idioma aparece, o botão fica em
"Carregando..." e nunca habilita.

## Jeito correto (servidor HTTP local)

```bash
python -m http.server 8000
# abra http://localhost:8000
```

Não precisa de nada instalado além do Python, que já está na máquina. Qualquer servidor estático serve.

## Pegadinhas

- **Botão vira "Tentar novamente" + faixa vermelha no topo** → as **duas** fontes falharam: o CDN
  (jsDelivr) e o `countries.json` local. Só o CDN cair não produz esse estado — ele cai para o arquivo
  local em silêncio, com um `console.warn`. Se você vê a mensagem, o `countries.json` também não foi
  servido: em `file://` isso é comum, sirva por HTTP.

  ⚠️ Ao depurar, olhe o `console.warn` antes do `console.error`: o warn diz por que o CDN caiu, o error
  diz por que a reserva caiu.

- **Botão preso em "Carregando..."** → o `fetch` não resolveu nem rejeitou. Diferente do caso acima: aqui
  a requisição está pendurada, não falhou.

- **A aba congela ao iniciar a partida** → **não deve mais acontecer.** Era a armadilha do laço infinito
  com `countries` vazio, corrigida pelo guard `countries.length >= MIN_OPTIONS`. Se voltar a acontecer,
  alguém removeu o guard de `newRound`/`startGame`/`handleStartClick` — reporte, é regressão. Para testar
  o caminho: bloqueie `cdn.jsdelivr.net` **e** sirva sem o `countries.json` e clique em iniciar; o
  esperado é a mensagem de erro, não o congelamento.

- **Bandeira não carrega** → `flagcdn.com` fora do ar ou código de país inválido. O jogo sorteia outro
  país automaticamente; após **3 falhas seguidas** (ou 8s sem resposta da imagem) encerra com a mensagem
  `flagError`. Para reproduzir: bloqueie `flagcdn.com` no DevTools e inicie uma partida.

- **Rodada sem timer correndo** → o `startTimer()` só dispara no `onload` da bandeira. Se a imagem está
  visível e o contador não anda, o `onFlagReady` não rodou — é bug, não lentidão.

- **Cache do navegador** esconde sua edição em `main.js`/`style.css`. Use hard reload
  (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) ou desabilite cache no DevTools.

- **Testar o recorde:** ele vive em `localStorage` na chave `highScore`. Para zerar:
  ```js
  localStorage.removeItem("highScore")   // no console do DevTools
  ```
  A leitura passa por `readHighScore()`, que converte para número e trata lixo como `0` — dá para testar
  isso com `localStorage.setItem("highScore", "abc")` e recarregar: o placar deve mostrar `0`, não `NaN`.

- **Testar `localStorage` bloqueado:** o pior caso do jogo. Nas configurações do navegador, bloqueie todo
  armazenamento para o site (ou use uma janela privada do Safari) e recarregue. O jogo deve **abrir e
  funcionar normalmente**, só sem persistir o recorde, com um `console.warn`. Se a tela ficar morta e os
  botões de idioma não responderem, alguém voltou a chamar `localStorage` direto no topo do `main.js`.

- **`onclick=` no HTML** exige que `setLanguage` e `goBackToMenu` estejam em `window`. Se você mexer no
  carregamento do script (ex.: `type="module"` ou `defer`), teste os botões de idioma — eles quebram
  silenciosamente com erro só no console.

## Checklist de teste manual

Não há runner (dívida consciente, ver `CLAUDE.md`) — **este checklist é a validação**, e registrá-lo é
exigência da regra de SDD/BDD/TDD. Antes de dizer "pronto", passe por:

1. **Os 9 idiomas** — clique em cada um e confirme que nenhum texto renderiza `undefined`. Confira também
   que a aba do navegador (`document.title`) e o `<html lang>` mudaram junto.
2. **Acerto** → pontuação sobe, próxima rodada começa, timer reinicia em 5.
3. **Erro** → vai direto para game over.
4. **Timeout** → deixe os 5s acabarem sem clicar; deve dar game over igual ao erro.
5. **Recorde** → faça pontuação maior que a anterior e recarregue a página; o recorde persiste.
6. **Voltar ao menu** no meio da partida → timer para (confirme que não há contagem rodando por baixo) e
   o estado zera. Teste pelos **dois** botões: o `#backBtn` do jogo e o `#gameOverBackBtn` do resultado.
7. **Responsividade** — o jogo é publicado no GitHub Pages e aberto no celular. Confirme que o **pinch-zoom
   funciona** (o `user-scalable=no` foi removido de propósito).
8. **CDN bloqueado** (`cdn.jsdelivr.net` no DevTools) → o jogo deve carregar **igual**, usando o
   `countries.json` local, com um `console.warn`. O jogador não vê diferença.
9. **CDN e reserva bloqueados** → mensagem de erro + botão "Tentar novamente"; a aba **não** congela.
   Desbloqueie e clique: deve carregar e jogar normalmente.
10. **CDN de bandeira bloqueado** (`flagcdn.com`) → o jogo tenta outros países e encerra com `flagError`
    depois de 3 falhas, sem deixar timer correndo.
11. **Timer só depois da bandeira** → com throttling de rede (DevTools → Slow 3G), o contador deve ficar
    parado em 5 até a bandeira aparecer, e as alternativas não devem aceitar clique antes disso.
12. **`localStorage` bloqueado** → o jogo abre e roda; só o recorde não persiste.

## Deploy

GitHub Pages serve a raiz da `main`. Push na `main` publica — **por isso, não commite sem ordem**: um
push aqui é publicação imediata em https://mateusands.github.io/flag-rush/
