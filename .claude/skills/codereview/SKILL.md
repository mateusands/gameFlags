---
name: codereview
description: Code review sênior das últimas mudanças do gameFlags (working tree ou últimos commits), focado em robustez do jogo, manutenibilidade e segurança de front estático. Apenas reporta problemas com arquivo/linha e a refatoração sugerida — não aplica correções.
---

# Code Review Sênior — gameFlags

Atue como Engenheiro Sênior e revise criticamente as **últimas mudanças deste repositório**.

## Como identificar o que revisar (nesta ordem)

1. Working tree: `git status` + `git diff` + arquivos novos relevantes.
2. Se limpo, os últimos commits da branch (`git log` + `git show`).
3. O projeto tem só 3 arquivos de código — **leia o arquivo inteiro**, sempre. Não há desculpa para
   revisar no escuro. (`countries.json` é dado gerado: confira formato e contagem, não leia linha a linha.)

## Pilar 1 — Invariantes deste projeto (verifique primeiro)

- **Handlers globais:** o diff mexeu na forma como `main.js` é carregado (`type="module"`, `defer`) ou
  renomeou `setLanguage`/`goBackToMenu`? Os `onclick=` do `index.html` dependem deles em `window` — quebra
  silenciosa, erro só no console. Reporte no topo.
- **Traduções completas:** o diff adicionou string visível? Ela existe nas **9** entradas de `translations`
  (pt, en, es, ja, zh, ko, ru, fr, it)? Chave faltando renderiza `undefined` para o usuário daquele idioma.
- **Guard de `countries.length >= MIN_OPTIONS`:** o diff toca `newRound`, `startGame`, `handleStartClick`
  ou `loadCountries`? O guard existe nos três primeiros e é o que impede o `while (options.length < 4)`
  de **travar a aba em laço infinito** quando há menos países do que alternativas. Remover qualquer um dos
  três é regressão grave — reporte no topo.
- **Limpeza de timer:** todo caminho novo que muda de tela ou encerra rodada chama `clearInterval(timerInterval)`
  **e** `clearFlagLoad()`? Dois intervals simultâneos fazem o contador pular e a partida acabar sozinha;
  watchdog órfão dispara `onFlagFailed` na rodada seguinte.
- **Timer só no `onload`:** o diff moveu `startTimer()` para perto do `flagEl.src`? Isso devolve ao jogador
  uma rodada mais curta que 5s em rede lenta. A ordem é `showFlag` → `onFlagReady` → `startTimer`, com
  `roundReady` bloqueando resposta antecipada.
- **Dependência nova:** o diff introduziu `<script src>` de CDN, npm, bundler ou framework? Isso é
  contrário ao `CLAUDE.md` — reporte, mesmo que o código esteja bom.

## Pilar 2 — Robustez

- **Falha de rede tratada?** `cdn.jsdelivr.net` e `flagcdn.com` são terceiros sem SLA. Novo `fetch` tem
  `catch`, checagem de `res.ok`, validação do **formato** **e** um caminho de UI (`setMessage`) que informa
  o usuário? O padrão do repo hoje é falhar avisando — `catch` que só faz `console.error` é regressão.
- **A cascata de fontes continua inteira?** `loadCountries` tenta o CDN e cai para `./countries.json`. Um
  diff que remove a reserva devolve o jogo ao ponto único de falha que já o derrubou uma vez — reporte.
- **Validar formato, não só status.** A restcountries morreu devolvendo `200` com corpo de erro. Diff que
  confia só em `res.ok` repete o bug que tirou o jogo do ar.
- **Estado global consistente:** `score`, `gameActive`, `timeLeft`, `availableCountries`, `correctAnswer`
  são globais. O caminho novo deixa algum deles inconsistente ao sair pela metade (voltar ao menu no meio
  da rodada, clicar duas vezes rápido)?
- **Clique duplo / corrida:** `handleAnswer` já tem guard `if (!gameActive) return`. Handler novo precisa
  do equivalente, senão dá para pontuar duas vezes na mesma rodada.
- **`localStorage`:** o diff chama `localStorage` direto? Deve passar por `readHighScore`/`writeHighScore`.
  Acesso cru **no topo do arquivo** derruba o `main.js` inteiro com `SecurityError` quando o armazenamento
  está bloqueado — e aí nem os botões de idioma funcionam. `setItem` pode lançar `QuotaExceededError` em
  modo privado; nunca coloque uma escrita antes de algo que precisa aparecer na tela.

## Pilar 3 — SDD/BDD/TDD (obrigatório neste repo)

Não há runner aqui — a dívida é consciente (ver `CLAUDE.md`). O que se revisa é a **disciplina**:

- **A mudança veio com spec?** O commit (ou um comentário sobre a função) declara o contrato e o porquê,
  ou é código solto sem justificativa?
- **O comportamento foi declarado antes** no formato "deve `<resultado>` quando `<condição>`"?
- **Os cenários exercitados estão registrados?** "Testei" sem lista de cenários não conta — e num projeto
  sem suíte, esse registro é a única evidência que sobra.
- **A mudança tornou a lógica MENOS testável?** Regra de negócio nova enfiada dentro de um handler de DOM,
  quando poderia ser função pura, aumenta a dívida. Aponte.
- **Alguém introduziu `package.json`/bundler** para "poder testar"? É decisão do dono, não do diff.

## Pilar 4 — Manutenibilidade

- O código novo está na **seção comentada certa** de `main.js`?
- Referência ao DOM foi para o topo, junto das outras, ou ficou perdida no meio da lógica?
- Função nova faz uma coisa só? `newRound` já acumula sorteio + render + disparo da bandeira — não piore.
- **Tabela de tradução paralela:** `translations` é a única fonte de texto da UI. Já houve um `loadingText`
  inline em `setLanguage` (e faltava a chave `en` nele). Se o diff criar outro objeto de tradução fora de
  `translations`, aponte a consolidação.
- **Constantes nomeadas:** `MIN_OPTIONS`, `ROUND_SECONDS`, `FLAG_TIMEOUT_MS`, `MAX_FLAG_FAILURES` existem
  para não haver `4`, `5`, `8000` e `3` soltos pelo arquivo. Número mágico novo, aponte.

## Pilar 5 — Segurança de front estático

Não há backend, sessão nem dado sensível — **não** aplique checklist de API. O que importa aqui:

- **XSS:** algum `innerHTML`/`insertAdjacentHTML` recebendo nome de país (dado de API de terceiro) ou
  qualquer string dinâmica? O padrão do repo é `textContent`; sair dele é o único vetor real de XSS aqui.
  `optionsEl.innerHTML = ""` para limpar é aceitável (string vazia constante).
- **URL montada com input externo:** `flagcdn.com/${code}.svg` usa o código ISO da fonte de dados, que
  `parseSingleLang`/`parseAllLangs` filtram por `/^[a-z]{2}$/i`. Se o diff afrouxar esse filtro ou montar
  URL com algo controlável pelo usuário, reporte.
- **`localStorage` não é confiável** — é editável pelo usuário. Não é problema para um recorde local, mas
  não use para nada que precise ser íntegro.
- **Nada de chave de API no código.** É um repositório público servido por GitHub Pages: qualquer segredo
  no `main.js` está publicado.

## Pilar 6 — Acessibilidade e mobile

O jogo é publicado e aberto no celular:

- Elemento clicável que não é `<button>`/`<a>` precisa de `role`, `tabIndex` e teclado.
- `alt` significativo em imagem (a bandeira hoje é `alt="Flag"` fixo — não diz qual país, o que é correto
  para não entregar a resposta, mas vale saber que é intencional).
- Alvo de toque com tamanho razoável; texto que não estoura a tela nos idiomas mais longos (ru, fr).

## Formato da resposta

- Nada de micro-otimização irrelevante.
- Para cada problema: **arquivo e linha**, impacto, e o código refatorado. Ordene por severidade —
  quebra de invariante primeiro (laço infinito e handler global são os mais graves).
- **Apenas revise e reporte. Não aplique as correções** sem ordem explícita.
