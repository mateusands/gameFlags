# 🌍 Adivinhe a Bandeira

Um jogo simples e divertido feito para navegador onde o jogador deve adivinhar o país correto a partir da bandeira exibida.

O jogo testa conhecimentos de geografia, rapidez e atenção, errar ou deixar o tempo acabar encerra a partida.

👉 Jogue online: https://mateusands.github.io/flag-rush/

---

## 🎮 Como funciona

- Uma bandeira é exibida no centro da tela
- Quatro opções de países aparecem abaixo
- O jogador tem **5 segundos** para escolher
- ✅ Acertou → ganha ponto e continua
- ❌ Errou ou o tempo acabou → **Game Over**
- O jogo salva o **recorde local** (localStorage)

---

## Funcionalidades

- Tema escuro
- **249 países** com nomes ICU/CLDR, carregados de um CDN com reserva local versionada no repo
- Bandeiras em SVG via [flagcdn.com](https://flagcdn.com)
- Timer de **5 segundos** por rodada, que só começa a contar **depois que a bandeira aparece**
- A bandeira sorteada não se repete dentro da mesma partida (as alternativas erradas podem)
- Sistema de pontuação e recorde
- Botão de recomeçar ao perder, e troca de idioma acessível em qualquer tela
- **9 idiomas disponíveis:** Português, English, Español, 日本語, 中文, 한국어, Русский, Français, Italiano
- Nomes dos países traduzidos automaticamente no idioma escolhido
- Interface, `<title>` e `<html lang>` acompanham o idioma escolhido
- Falha de rede é avisada na tela, com opção de tentar novamente — o jogo não trava nem fica mudo

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- [umpirsky/country-list](https://github.com/umpirsky/country-list) via [jsDelivr](https://www.jsdelivr.com) — nomes dos países (ICU/CLDR)
- [flagcdn.com](https://flagcdn.com) — imagens das bandeiras em SVG
- GitHub Pages para hospedagem

---

## Estrutura do projeto

```
flag-rush/
├── index.html      # markup e telas
├── style.css       # estilo
├── main.js         # traduções, estado, timer, rodadas
├── countries.json  # reserva de países, usada quando o CDN não responde
├── README.md
└── CLAUDE.md       # notas de arquitetura e armadilhas do código
```

Sem build, sem `npm install`, sem dependência: são arquivos estáticos. Para rodar local, sirva a
pasta por HTTP (`python -m http.server 8000`) — abrir por `file://` pode bloquear o `fetch` da API.
