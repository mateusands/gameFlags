---
name: frontend
description: Desenvolvimento do gameFlags (HTML + CSS + JavaScript puro, sem build). Codifica as convenções do repo — handlers globais exigidos pelos onclick do HTML, as 9 traduções obrigatórias, tolerância a falha das APIs externas, limpeza de timer. Use ao mexer em main.js, index.html ou style.css.
---

# Frontend — gameFlags

Guia para qualquer mexida no jogo. Segue o `CLAUDE.md`: **não introduza framework/bundler/dependência**,
**não commite sem ordem**, **não refatore o que não foi pedido**.

## O que este projeto é (e o que ele não é)

Quatro arquivos estáticos servidos direto pelo GitHub Pages (`index.html`, `main.js`, `style.css` e o
`countries.json` de reserva). **Sem npm, sem build, sem transpilação e —
por ora — sem runner de teste.** O valor dele é abrir e funcionar. Toda proposta de "modernizar" (React, Vite,
TypeScript, módulos ES) muda a natureza do projeto — só com pedido explícito.

---

## As 5 regras que quebram o jogo se ignoradas

### 1. `setLanguage` e `goBackToMenu` **precisam** ficar em `window`

O `index.html` chama esses handlers por atributo:

```html
<button class="lang-btn" onclick="setLanguage('en')">🇺🇸 English</button>
<button id="backBtn" onclick="goBackToMenu()">
```

Por isso são declarados como `window.setLanguage = ...` no `main.js`. Consequências:

- **Não converta `main.js` para `type="module"`** — módulo tem escopo próprio, os `onclick` param de
  achar a função e os botões de idioma morrem **em silêncio** (erro só no console).
- Se quiser modularizar de verdade, troque **antes** os `onclick=` por `addEventListener` no JS.
- Os demais botões (`startBtn`, `restartBtn`) já usam `addEventListener` — a inconsistência é histórica.
  Ao adicionar botão novo, prefira `addEventListener`.

### 2. Toda string visível existe nos **9 idiomas**

`translations` cobre `pt, en, es, ja, zh, ko, ru, fr, it`. Ao adicionar texto na UI:

- Acrescente a chave em **todas as 9 entradas**. Chave faltando renderiza `undefined` na tela — não dá
  erro, só fica feio para quem usa aquele idioma.
- O nome do país (`country.name`) já vem resolvido no idioma atual — `countriesByLang` guarda uma lista
  por idioma. Ao trocar de idioma, `ensureCountries()` recarrega ou usa o cache; não indexe por idioma
  na hora de renderizar.
- Depois de adicionar, **passe pelos 9 idiomas manualmente** e registre isso (ver `/rodar-local`).

### 3. Nenhum caminho pode assumir que os dados chegaram

`loadCountries()` tenta o CDN e cai para o `countries.json` local; valida **status e formato** em ambos.
Quem consome precisa exigir **`countries.length >= MIN_OPTIONS`** — não basta checar se está vazio.
A fonte anterior (restcountries) morreu devolvendo `200` com corpo de erro: `res.ok` sozinho não protege.

⚠️ **Por que o guard existe** (armadilha já corrigida — não a reintroduza): `newRound()` monta as
alternativas com um `while (options.length < MIN_OPTIONS)` sorteando de `countries`. Com menos países do
que alternativas **não existem 4 distintos**, o laço nunca termina e a aba congela. O guard está em três
pontos: `handleStartClick`, `startGame` e `newRound`. Mexer em qualquer um deles exige manter os três.

O caminho de erro tem UI: `setMessage(t().loadError)` e o botão vira `retry`. Não volte ao `catch` mudo.

### 4. Timer sempre com `clearInterval` **e** `clearFlagLoad` antes

`timerInterval` e `flagWatchdog` são globais e únicos. Todo caminho que muda de tela ou de rodada precisa
limpar os dois — `startTimer`, `handleAnswer`, `gameOver`, `goBackToMenu` e `showFlag` já fazem. Esquecer
o `clearInterval` gera **dois intervals correndo juntos** (o contador pula de 2 em 2 e a partida acaba
sozinha); esquecer o `clearFlagLoad` deixa um `setTimeout` órfão que dispara `onFlagFailed` na rodada
seguinte.

### 5. O timer começa no `onload` da bandeira, nunca no `src`

`showFlag()` registra `onload`/`onerror` + watchdog de 8s e só então atribui o `src`. O `startTimer()`
mora em `onFlagReady`. Isso existe porque os 5 segundos corriam durante o download — em rede lenta o
jogador perdia metade da rodada olhando tela vazia. `roundReady` bloqueia resposta antes da bandeira
aparecer. Se separar essas peças, o jogo volta a ser injusto ou fica sem timer.

---

## Convenções do código

- **Estrutura por seção comentada** em `main.js` (`ELEMENTOS`, `TRADUÇÕES`, `PAÍSES (DADOS)`, `ESTADO`,
  `CONFIG IDIOMA`, `UTIL`, `TIMER`, `JOGO`, `GAME OVER`, `EVENTOS`). Coloque o código novo na seção certa.
- **Referências ao DOM ficam no topo**, em `const` com `getElementById`. Não busque elemento no meio da
  lógica de jogo.
- **Troca de tela é `classList.add/remove("hidden")`** — não mexa em `style.display` para telas (o `flag`
  é exceção histórica).
- **Texto sempre por `textContent`**, nunca `innerHTML`. Os nomes de país vêm de API de terceiro; com
  `innerHTML` isso vira XSS.
- **Português** nos comentários; nomes de variável em inglês ou português conforme o vizinho — o arquivo
  já é misto, siga o local.

## Pontos de atenção conhecidos (não corrija sem pedido, mas saiba que existem)

- **`setInterval` é estrangulado em aba de fundo** — trocar de aba efetivamente pausa os 5 segundos. Não
  há detecção de foco; conviver com isso é decisão consciente (o placar é local).
- **`#message` usa `z-index: 1000`** para ficar acima do overlay `#gameOver` (999). Baixar isso esconde o
  aviso de falha de rede durante a partida.
- **`flagEl.src` com o mesmo valor não redispara `load`** em alguns navegadores — o retry de bandeira
  depende de `newRound()` sortear um país diferente.
- **`localStorage` está encapsulado** em `readHighScore`/`writeHighScore` com `try/catch`. Não chame
  `localStorage` direto: acesso cru no topo do arquivo derruba o `main.js` inteiro quando o armazenamento
  está bloqueado, e aí nem os botões de idioma funcionam.

## SDD + BDD + TDD (obrigatório) — como se aplica sem runner

O `CLAUDE.md` exige spec → comportamento → teste antes do código. **Este repo ainda não tem runner**, e
isso é dívida consciente: montá-lo exige `npm install` num projeto cuja característica é não ter build.
Não introduza `package.json` por conta própria.

Enquanto isso, a disciplina se aplica assim:

1. **Spec antes do código.** Uma frase: qual é o contrato e por que existe. Se veio de bug, descreva o bug.
2. **Comportamento descrito antes**, no formato "deve `<resultado>` quando `<condição>`" — no commit e/ou
   num comentário sobre a função.
3. **Cenários executados à mão e registrados.** "Testei" sem lista de cenários não conta.

Exemplo, para uma mudança em `newRound()`:

```
Spec: as 4 alternativas têm que conter a resposta correta e 3 países distintos.
      Existe porque com `countries` vazio o laço nunca termina e trava a aba.
Comportamento: deve exibir 4 opções distintas quando há ≥4 países carregados;
               deve não iniciar a partida quando há menos de 4.
Cenários exercitados: (1) API ok → 4 opções distintas em 10 rodadas seguidas;
                      (2) API bloqueada no DevTools → botão não habilita, aba não trava.
```

**Quando o runner entrar** (decisão do dono), a lógica pura sai primeiro: `shuffle`, montagem das
alternativas, cálculo de recorde. Isso esbarra na regra nº 1 desta skill — virar módulo ES quebra os
`onclick=`, então a extração vem junto da troca por `addEventListener`.

## Validar antes de dizer "pronto"

O checklist manual está na skill `/rodar-local` — passe por ele, incluindo os 9 idiomas e o teste de
timeout. E lembre: **push na `main` publica no GitHub Pages na hora.**
