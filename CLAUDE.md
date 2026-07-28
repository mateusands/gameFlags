# CLAUDE.md — flag-rush (Adivinhe a Bandeira)

## Propósito do projeto

Jogo de navegador: uma bandeira é exibida, o jogador tem **5 segundos** para escolher o país correto entre
4 opções. Acertou → ponto e próxima rodada. Errou ou o tempo acabou → fim de jogo. O recorde é salvo
localmente. Suporta **9 idiomas** (pt, en, es, ja, zh, ko, ru, fr, it).

Projeto de portfólio, publicado em **GitHub Pages**: https://mateusands.github.io/flag-rush/

---

## Fonte da verdade

**O estado real do sistema são os arquivos do repositório.** O jogo em si são **quatro arquivos** —
`index.html`, `main.js`, `style.css` e `countries.json`. Todo o resto é documentação. Não presuma build,
framework nem dependência que não esteja aqui.

---

## Stack

- **HTML + CSS + JavaScript puro (ES5/ES6 clássico)** — sem framework, sem bundler, sem `npm install`
- **Sem build step**: `index.html` carrega `main.js` com `<script src>` clássico (**não** é `type="module"`)
- **Persistência**: `localStorage` (apenas o recorde)
- **Deploy**: GitHub Pages servindo a raiz do repo

### Estrutura

```
flag-rush/
├── index.html      # markup + telas (seleção de idioma, jogo, game over)
├── main.js         # tudo: traduções, estado, timer, rodadas, game over
├── style.css       # estilo
├── countries.json  # reserva: 249 países × 9 idiomas, usada quando o CDN falha
├── README.md       # documentação pública do projeto
├── CLAUDE.md       # este arquivo
├── .gitignore      # ignora .claude/sessions/
└── .claude/
    └── skills/     # iniciar-sessao, frontend, rodar-local, codereview, finalizar-sessao
```

Os quatro primeiros são servidos pelo GitHub Pages; o resto é documentação.

---

## Dependências externas (o jogo não funciona offline)

| Serviço | Uso | Se cair |
|---|---|---|
| `cdn.jsdelivr.net/gh/umpirsky/country-list@2.0.6` | nomes dos 249 países no idioma escolhido | cai automaticamente para o `countries.json` local |
| `./countries.json` (deste repo) | reserva com os 249 países nos 9 idiomas | se **também** falhar: botão vira "Tentar novamente" + mensagem `loadError`; a partida não inicia |
| `flagcdn.com/{code}.svg` | imagem da bandeira | a rodada sorteia outro país; após **3 falhas seguidas** (ou 8s sem resposta) a partida encerra com `flagError` |

Nenhum deles pede **chave de API** — requisito inegociável, já que o repo é público e servido pelo Pages.

### Por que existe uma reserva local

A fonte original era a `restcountries.com/v3.1`. Em **julho de 2026** ela foi desligada junto com toda a
linha v1–v4, **sem aviso**, e o jogo publicado parou de funcionar. Pior: o endpoint desligado responde
**HTTP 200** com um corpo de erro —

```json
{ "success": false, "data": null, "errors": [{ "message": "This API version has been deprecated…" }] }
```

— então qualquer checagem baseada só em `res.ok` passa batido. É por isso que o parsing valida o
**formato** dos dados, não só o status.

A v5 da restcountries exige conta e chave em `Authorization: Bearer`, o que conflita com a regra de não
ter segredo no código. Daí a arquitetura atual: **CDN primeiro, arquivo do próprio repo como reserva.**
Serviço de terceiro deixou de ser ponto único de falha.

**Sobre o `countries.json`:** 249 países × 9 idiomas, ~48 KB, gerado a partir da mesma fonte ICU/CLDR
(`umpirsky/country-list`). É dado congelado — envelhece. Ao atualizar, mantenha o formato
`{ "BR": { "pt": "Brasil", "en": "Brazil", … } }` com os 9 idiomas em **todos** os países, e confirme que
todo código tem bandeira no `flagcdn` (hoje os 249 têm).

---

## Armadilhas ativas (conhecidas, ainda no código)

1. **Handlers globais no `window`.** `setLanguage` e `goBackToMenu` são atribuídos em `window` porque o
   `index.html` os chama via `onclick=` (os 9 botões de idioma e o `#backBtn`). **Se `main.js` virar
   `type="module"`, esses `onclick` param de funcionar** — módulos não expõem escopo global. A quebra é
   silenciosa: erro só no console.

2. **Nomes de países não são sanitizados**, mas são inseridos via `textContent` (seguro). Se algum dia
   alguém trocar para `innerHTML`, vira XSS com dado de terceiro.

3. **`setInterval` é estrangulado em aba de fundo.** O timer de 5s usa `setInterval(…, 1000)`; navegadores
   reduzem a frequência quando a aba perde o foco, então trocar de aba efetivamente pausa a contagem. Não
   há detecção de foco. É trapaça possível, e o placar é local — a decisão de conviver com isso é
   consciente.

4. **`flagEl.src` com o mesmo valor não redispara `load` em alguns navegadores.** O retry de bandeira
   (`onFlagFailed` → `newRound`) depende de sortear um país **diferente**. Se alguém mudar o retry para
   repetir a mesma bandeira, o `onload` pode nunca vir — sobra só o watchdog de 8s.

5. **O `#message` depende de `z-index: 1000`, acima do `#gameOver` (999).** É de propósito: o aviso de
   `flagError` chega junto com a tela de resultado. Baixar esse `z-index` esconde o único aviso de falha
   de rede que existe durante a partida.

### Armadilhas já corrigidas (não reintroduza)

| Era | Correção |
|---|---|
| `countries` vazio → `while (options.length < 4)` em laço infinito, aba congelada | guard `countries.length >= MIN_OPTIONS` em `newRound`, `startGame` e `handleStartClick` |
| `shuffle()` com `sort(() => Math.random() - 0.5)`, permutação enviesada | Fisher-Yates em `shuffle()` |
| `highScore` lido como string; `localStorage` lançando derrubava o `main.js` inteiro | `readHighScore()` / `writeHighScore()` com `try/catch` e `Number.isFinite` |
| timer começava junto com o download da bandeira, comendo os 5s | `startTimer()` só no `onload` da imagem, com watchdog de 8s |
| `catch` mudo no `loadCountries` — usuário sem nenhum aviso | validação de status **e** formato, mensagem `loadError` e botão `retry` |
| tabela de tradução paralela (`loadingText`, sem a chave `en`) | tudo em `translations`, 14 chaves × 9 idiomas |
| `restcountries.com` como ponto único de falha — API desligada derrubou o jogo | cascata CDN → `countries.json` local |

---

## Como trabalhar neste repositório

### Rodar

Abra `index.html` no navegador. Para testar o `fetch` sem esbarrar em restrição de `file://`, sirva por
HTTP local (ver a skill `/rodar-local`).

### Regras de desenvolvimento

- **Não introduza framework, bundler ou dependência npm** sem pedido explícito. O valor deste projeto é
  ser um arquivo que abre e roda.
- **Não converta `main.js` para módulo ES** sem trocar os `onclick=` do HTML por `addEventListener`
  (armadilha nº 1).
- **Todo texto visível precisa existir nos 9 idiomas.** Ao adicionar uma string na UI, acrescente a chave
  em **todas** as entradas de `translations` — uma chave faltando renderiza `undefined` na tela.
  `translations` é a **única** tabela de texto: não crie um objeto de tradução paralelo.
- **Não assuma que os dados chegaram.** Todo caminho que consome `countries` precisa exigir
  `countries.length >= MIN_OPTIONS` — não basta checar se está vazio: com 1 a 3 países o sorteio de 4
  alternativas distintas também não termina.
- **Valide formato, não só status.** A fonte anterior morreu devolvendo `200` com corpo de erro. `res.ok`
  sozinho não protege de nada; `parseSingleLang`/`parseAllLangs` checam a forma do que chegou.
- **Nunca deixe a reserva local de fora.** Se mexer em `loadCountries`, a cascata CDN → `countries.json`
  precisa continuar inteira. Foi ela que tirou o jogo do ponto único de falha.
- **O timer nasce do `onload` da bandeira, não do `src`.** `showFlag` → `onFlagReady` → `startTimer` é a
  ordem; `roundReady` bloqueia respostas antes disso. Mantenha os três juntos.
- **Toda saída de rodada passa por `clearInterval(timerInterval)` e `clearFlagLoad()`.** Esquecer o
  segundo deixa um `setTimeout` órfão que dispara `onFlagFailed` fora de contexto.
- Mantenha a divisão de seções por comentário que já existe em `main.js` (`ELEMENTOS`, `TRADUÇÕES`,
  `PAÍSES (DADOS)`, `ESTADO`, `CONFIG IDIOMA`, `UTIL`, `TIMER`, `JOGO`, `GAME OVER`, `EVENTOS`).

---

## Regra inegociável: SDD + BDD + TDD

Nenhum código de produção é escrito sem spec (SDD) → comportamento (BDD) → teste vermelho (TDD).

⚠️ **Este repo ainda não tem runner de teste**, e isso é uma dívida consciente, não um esquecimento.
Montá-lo exige `npm install` num projeto cuja característica declarada é **não ter build nem
dependência**. A decisão de pagar esse preço é do dono — não introduza `package.json` por conta própria.

**Enquanto o runner não existe, a regra se aplica assim:**

1. **A spec vem antes do código, sempre.** Antes de escrever, declare em uma frase qual é o contrato e
   por que existe. Se a mudança nasceu de um bug, descreva o bug.
2. **O comportamento é descrito antes**, no formato "deve `<resultado>` quando `<condição>`" — no commit
   e/ou num comentário sobre a função. É a mesma disciplina do BDD, sem o runner.
3. **O caso de teste é executado à mão, e registrado.** Escreva quais cenários você exercitou no
   navegador (ver `/rodar-local`). "Testei" sem lista de cenários não conta.

**Quando o runner entrar** (decisão do dono), o caminho de menor atrito é extrair a lógica pura para um
módulo próprio — `shuffle`, montagem das 4 alternativas, `readHighScore`/`writeHighScore` — e testar essa
camada. Isso esbarra na armadilha nº 1: virar módulo ES quebra os `onclick=` do HTML, então a extração
precisa vir junto da troca por `addEventListener`.

**Verificação estática sem runner.** Dá para checar bastante coisa carregando o `main.js` num contexto
`vm` do Node com `document`/`localStorage` falsos — pega TDZ, `ReferenceError`, ID pedido ao DOM que não
existe no `index.html`, chave de tradução faltando e uniformidade do `shuffle`. Não substitui o navegador
(nada de layout, `fetch` real ou evento de imagem), mas cobre o que é puramente lógico. Não é código de
produção — mantenha fora do repo.

### Convenção de commits

Conventional Commits, descrição no imperativo: `feat: adiciona idioma alemão`, `fix: evita laço infinito
quando a API falha`, `docs: atualiza README`.

---

## Regras gerais

- **O código é a fonte da verdade.** Se algo aqui parecer inconsistente com o código, o código vence —
  e atualize este arquivo.
- Decisão técnica não-óbvia deve ser documentada (no commit e/ou aqui).
- **Não commite nem faça push sem ordem explícita.**
