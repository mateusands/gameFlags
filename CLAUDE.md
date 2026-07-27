# CLAUDE.md — gameFlags (Adivinhe a Bandeira)

## Propósito do projeto

Jogo de navegador: uma bandeira é exibida, o jogador tem **5 segundos** para escolher o país correto entre
4 opções. Acertou → ponto e próxima rodada. Errou ou o tempo acabou → fim de jogo. O recorde é salvo
localmente. Suporta **9 idiomas** (pt, en, es, ja, zh, ko, ru, fr, it).

Projeto de portfólio, publicado em **GitHub Pages**: https://mateusands.github.io/gameFlags/

---

## Fonte da verdade

**O estado real do sistema são os arquivos do repositório.** São três, e só três — não presuma build,
framework nem dependência que não esteja aqui.

---

## Stack

- **HTML + CSS + JavaScript puro (ES5/ES6 clássico)** — sem framework, sem bundler, sem `npm install`
- **Sem build step**: `index.html` carrega `main.js` com `<script src>` clássico (**não** é `type="module"`)
- **Persistência**: `localStorage` (apenas o recorde)
- **Deploy**: GitHub Pages servindo a raiz do repo

### Estrutura

```
gameFlags/
├── index.html    # markup + telas (seleção de idioma, jogo, game over)
├── main.js       # tudo: traduções, estado, timer, rodadas, game over
└── style.css     # estilo
```

---

## Dependências externas (o jogo não funciona offline)

| Serviço | Uso | Se cair |
|---|---|---|
| `restcountries.com/v3.1/all` | nomes dos países nos 9 idiomas + código ISO | `countries` fica vazio → ver armadilha nº 1 |
| `flagcdn.com/{code}.svg` | imagem da bandeira | bandeira não renderiza |

Ambos são chamados **sem chave de API**. Não há cache local nem fallback — é a maior fragilidade do projeto.

---

## Armadilhas ativas (conhecidas, ainda no código)

1. **API fora do ar → laço infinito que trava a aba.** `loadCountries()` só faz `console.error` no `catch`
   e deixa `countries = []`. Aí `newRound()` entra em `while (options.length < 4)` sorteando de um array
   vazio: `countries[...]` é `undefined`, o primeiro `push` entra, e a partir daí `options.includes(undefined)`
   é sempre `true` → **o laço nunca termina e o navegador congela**. Qualquer mexida em `newRound` ou
   `loadCountries` precisa considerar isso.

2. **`shuffle()` é enviesado.** `array.sort(() => Math.random() - 0.5)` não produz permutação uniforme — a
   ordem das alternativas e a sequência de países têm viés estatístico. O correto é Fisher-Yates.

3. **`highScore` vem do `localStorage` como string.** `localStorage.getItem` devolve `string | null`; a
   comparação `score > highScore` funciona por coerção, mas o valor exibido antes da primeira partida é
   string. Não confie no tipo sem converter.

4. **Handlers globais no `window`.** `setLanguage` e `goBackToMenu` são atribuídos em `window` porque o
   `index.html` os chama via `onclick=`. **Se `main.js` virar `type="module"`, esses `onclick` param de
   funcionar** — módulos não expõem escopo global.

5. **Nomes de países não são sanitizados**, mas são inseridos via `textContent` (seguro). Se algum dia
   alguém trocar para `innerHTML`, vira XSS com dado de terceiro.

---

## Como trabalhar neste repositório

### Rodar

Abra `index.html` no navegador. Para testar o `fetch` sem esbarrar em restrição de `file://`, sirva por
HTTP local (ver a skill `/rodar-local`).

### Regras de desenvolvimento

- **Não introduza framework, bundler ou dependência npm** sem pedido explícito. O valor deste projeto é
  ser um arquivo que abre e roda.
- **Não converta `main.js` para módulo ES** sem trocar os `onclick=` do HTML por `addEventListener`
  (armadilha nº 4).
- **Todo texto visível precisa existir nos 9 idiomas.** Ao adicionar uma string na UI, acrescente a chave
  em **todas** as entradas de `translations` — uma chave faltando renderiza `undefined` na tela.
- **Não assuma que a API respondeu.** Todo caminho que consome `countries` precisa lidar com lista vazia.
- Mantenha a divisão de seções por comentário que já existe em `main.js` (`ELEMENTOS`, `TRADUÇÕES`,
  `ESTADO`, `TIMER`, `JOGO`, `GAME OVER`, `EVENTOS`).

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
módulo próprio — `shuffle`, montagem das 4 alternativas, cálculo de recorde — e testar essa camada. Isso
esbarra na armadilha nº 4: virar módulo ES quebra os `onclick=` do HTML, então a extração precisa vir
junto da troca por `addEventListener`.

### Convenção de commits

Conventional Commits, descrição no imperativo: `feat: adiciona idioma alemão`, `fix: evita laço infinito
quando a API falha`, `docs: atualiza README`.

---

## Regras gerais

- **O código é a fonte da verdade.** Se algo aqui parecer inconsistente com o código, o código vence —
  e atualize este arquivo.
- Decisão técnica não-óbvia deve ser documentada (no commit e/ou aqui).
- **Não commite nem faça push sem ordem explícita.**
