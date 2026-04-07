/* ================= ELEMENTOS ================= */

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const flagEl = document.getElementById("flag");
const optionsEl = document.getElementById("options");
const startBtn = document.getElementById("startBtn");

// Telas
const languageSelectionEl = document.getElementById("languageSelection");
const gameContainerEl = document.getElementById("gameContainer");
const gameOverEl = document.getElementById("gameOver");

const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

// UI Text
const uiTitle = document.getElementById("uiTitle");
const uiScoreLabel = document.getElementById("uiScoreLabel");
const uiHighScoreLabel = document.getElementById("uiHighScoreLabel");
const uiGameOver = document.getElementById("uiGameOver");
const uiFinalScoreLabel = document.getElementById("uiFinalScoreLabel");

/* ================= TRADUÇÕES ================= */

let currentLang = 'pt';

const translations = {
  pt: {
    title: "🌍 Adivinhe a Bandeira",
    score: "Pontos",
    record: "Recorde",
    start: "Iniciar Jogo",
    gameOver: "💀 Fim de Jogo!",
    finalScore: "Sua pontuação:",
    restart: "Jogar Novamente"
  },
  en: {
    title: "🌍 Guess the Flag",
    score: "Score",
    record: "Best",
    start: "Start Game",
    gameOver: "💀 Game Over!",
    finalScore: "Your Score:",
    restart: "Play Again"
  },
  es: {
    title: "🌍 Adivina la Bandera",
    score: "Puntos",
    record: "Récord",
    start: "Iniciar Juego",
    gameOver: "💀 ¡Fin del Juego!",
    finalScore: "Tu puntuación:",
    restart: "Jugar de Nuevo"
  },
  ja: {
    title: "🌍 国旗を当てよう",
    score: "スコア",
    record: "最高記録",
    start: "ゲームスタート",
    gameOver: "💀 ゲームオーバー！",
    finalScore: "あなたのスコア:",
    restart: "もう一度"
  },
  zh: {
    title: "🌍 猜国旗",
    score: "分数",
    record: "最高分",
    start: "开始游戏",
    gameOver: "💀 游戏结束！",
    finalScore: "你的分数:",
    restart: "再玩一次"
  },
  ko: {
    title: "🌍 국기를 맞춰보세요",
    score: "점수",
    record: "최고 기록",
    start: "게임 시작",
    gameOver: "💀 게임 오버!",
    finalScore: "당신의 점수:",
    restart: "다시 하기"
  },
  ru: {
    title: "🌍 Угадай флаг",
    score: "Очки",
    record: "Рекорд",
    start: "Начать игру",
    gameOver: "💀 Игра окончена!",
    finalScore: "Ваш счёт:",
    restart: "Играть снова"
  },
  fr: {
    title: "🌍 Devine le Drapeau",
    score: "Points",
    record: "Record",
    start: "Commencer",
    gameOver: "💀 Fin de partie !",
    finalScore: "Votre score :",
    restart: "Rejouer"
  },
  it: {
    title: "🌍 Indovina la Bandiera",
    score: "Punti",
    record: "Record",
    start: "Inizia il gioco",
    gameOver: "💀 Game Over!",
    finalScore: "Il tuo punteggio:",
    restart: "Gioca ancora"
  }
};

let countries = [];

/* ================= PAÍSES (API) ================= */

async function loadCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,translations");
    const data = await res.json();
    countries = data
      .filter(c => c.cca2 && c.name?.common)
      .map(c => ({
        name: {
          en: c.name.common,
          pt: c.translations?.por?.common || c.name.common,
          es: c.translations?.spa?.common || c.name.common,
          ja: c.translations?.jpn?.common || c.name.common,
          zh: c.translations?.zho?.common || c.name.common,
          ko: c.translations?.kor?.common || c.name.common,
          ru: c.translations?.rus?.common || c.name.common,
          fr: c.translations?.fra?.common || c.name.common,
          it: c.translations?.ita?.common || c.name.common
        },
        code: c.cca2.toLowerCase()
      }));
  } catch (e) {
    console.error("Erro ao carregar países:", e);
  }
}

/* ================= ESTADO ================= */

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 5;
let timerInterval = null;
let gameActive = false;

let availableCountries = [];
let correctAnswer = null;

highScoreEl.textContent = highScore;

/* ================= CONFIG IDIOMA ================= */

window.setLanguage = async function(lang) {
  currentLang = lang;
  languageSelectionEl.classList.add("hidden");
  gameContainerEl.classList.remove("hidden");
  updateUIText();

  if (countries.length === 0) {
    const loadingText = { pt: "Carregando...", es: "Cargando...", ja: "読み込み中...", zh: "加载中...", ko: "로딩 중...", ru: "Загрузка...", fr: "Chargement...", it: "Caricamento..." };
    startBtn.textContent = loadingText[currentLang] || "Loading...";
    startBtn.disabled = true;
    startBtn.classList.remove("hidden");
    await loadCountries();
    startBtn.disabled = false;
  }

  startBtn.textContent = translations[currentLang].start;
  startBtn.classList.remove("hidden");
}

window.goBackToMenu = function() {
  gameActive = false;
  clearInterval(timerInterval);

  flagEl.style.display = "none";
  optionsEl.innerHTML = "";
  score = 0;
  scoreEl.textContent = "0";
  timerEl.textContent = "5";

  gameContainerEl.classList.add("hidden");
  languageSelectionEl.classList.remove("hidden");

  gameOverEl.classList.add("hidden");
}

function updateUIText() {
  const t = translations[currentLang];
  uiTitle.textContent = t.title;
  uiScoreLabel.textContent = t.score;
  uiHighScoreLabel.textContent = t.record;
  startBtn.textContent = t.start;
  uiGameOver.textContent = t.gameOver;
  uiFinalScoreLabel.textContent = t.finalScore;
  restartBtn.textContent = t.restart;
}

/* ================= UTIL ================= */

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* ================= TIMER ================= */

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 5;
  timerEl.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

/* ================= JOGO ================= */

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  gameActive = true;

  availableCountries = shuffle([...countries]);

  gameOverEl.classList.add("hidden");
  startBtn.classList.add("hidden");

  newRound();
}

function newRound() {
  if (!gameActive) return;

  optionsEl.innerHTML = "";

  if (availableCountries.length === 0) {
    availableCountries = shuffle([...countries]);
  }

  correctAnswer = availableCountries.pop();

  let options = [correctAnswer];

  while (options.length < 4) {
    const random = countries[Math.floor(Math.random() * countries.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  options = shuffle(options);

  flagEl.src = `https://flagcdn.com/${correctAnswer.code}.svg`;
  flagEl.style.display = "block";

  options.forEach(country => {
    const btn = document.createElement("button");
    btn.textContent = country.name[currentLang];
    btn.onclick = () => handleAnswer(country.code === correctAnswer.code);
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function handleAnswer(correct) {
  if (!gameActive) return;

  clearInterval(timerInterval);

  if (!correct) {
    gameOver();
    return;
  }

  score++;
  scoreEl.textContent = score;
  newRound();
}

/* ================= GAME OVER ================= */

function gameOver() {
  gameActive = false;
  clearInterval(timerInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreEl.textContent = highScore;
  }

  finalScoreEl.textContent = score;
  gameOverEl.classList.remove("hidden");

  flagEl.style.display = "none";
  optionsEl.innerHTML = "";
}

/* ================= EVENTOS ================= */

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
  gameOverEl.classList.add("hidden");
  startGame();
});
