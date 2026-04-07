# 🌍 Adivinhe a Bandeira

Um jogo simples e divertido feito para navegador onde o jogador deve adivinhar o país correto a partir da bandeira exibida.

O jogo testa conhecimentos de geografia, rapidez e atenção, errar ou deixar o tempo acabar encerra a partida.

👉 Jogue online: https://mateusands.github.io/gameFlags/

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
- **~250 países** carregados via [RestCountries API](https://restcountries.com) (incluindo países menos comuns)
- Bandeiras em SVG via [flagcdn.com](https://flagcdn.com)
- Timer de **5 segundos** por rodada
- Opções aleatórias sem repetir bandeiras na mesma sessão
- Sistema de pontuação e recorde
- Botão de recomeçar ao perder
- **9 idiomas disponíveis:** Português, English, Español, 日本語, 中文, 한국어, Русский, Français, Italiano
- Nomes dos países traduzidos automaticamente no idioma escolhido

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- [RestCountries API](https://restcountries.com) — dados dos países
- [flagcdn.com](https://flagcdn.com) — imagens das bandeiras em SVG
- GitHub Pages para hospedagem

---

## Estrutura do projeto

├── index.html

├── style.css

├── main.js

└── README.md
