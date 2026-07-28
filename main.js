/* ================= ELEMENTOS ================= */

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const flagEl = document.getElementById("flag");
const optionsEl = document.getElementById("options");
const startBtn = document.getElementById("startBtn");
const messageEl = document.getElementById("message");

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

// Tabela ÚNICA de textos da UI. Toda string visível mora aqui, nas 9 entradas —
// chave faltando renderiza `undefined` na tela, sem erro no console.
const translations = {
  pt: {
    title: "🌍 Adivinhe a Bandeira",
    score: "Pontos",
    record: "Recorde",
    start: "Iniciar Jogo",
    loading: "Carregando...",
    retry: "Tentar Novamente",
    loadError: "Não foi possível carregar os países. Verifique sua conexão.",
    flagError: "As bandeiras não estão carregando. Tente novamente mais tarde.",
    gameOver: "💀 Fim de Jogo!",
    finalScore: "Sua pontuação:",
    restart: "Jogar Novamente"
  },
  en: {
    title: "🌍 Guess the Flag",
    score: "Score",
    record: "Best",
    start: "Start Game",
    loading: "Loading...",
    retry: "Try Again",
    loadError: "Could not load the countries. Check your connection.",
    flagError: "Flags are not loading. Please try again later.",
    gameOver: "💀 Game Over!",
    finalScore: "Your Score:",
    restart: "Play Again"
  },
  es: {
    title: "🌍 Adivina la Bandera",
    score: "Puntos",
    record: "Récord",
    start: "Iniciar Juego",
    loading: "Cargando...",
    retry: "Intentar de Nuevo",
    loadError: "No se pudieron cargar los países. Comprueba tu conexión.",
    flagError: "Las banderas no cargan. Inténtalo más tarde.",
    gameOver: "💀 ¡Fin del Juego!",
    finalScore: "Tu puntuación:",
    restart: "Jugar de Nuevo"
  },
  ja: {
    title: "🌍 国旗を当てよう",
    score: "スコア",
    record: "最高記録",
    start: "ゲームスタート",
    loading: "読み込み中...",
    retry: "再試行",
    loadError: "国データを読み込めませんでした。接続を確認してください。",
    flagError: "国旗を読み込めません。しばらくしてからお試しください。",
    gameOver: "💀 ゲームオーバー！",
    finalScore: "あなたのスコア:",
    restart: "もう一度"
  },
  zh: {
    title: "🌍 猜国旗",
    score: "分数",
    record: "最高分",
    start: "开始游戏",
    loading: "加载中...",
    retry: "重试",
    loadError: "无法加载国家数据，请检查网络连接。",
    flagError: "国旗无法加载，请稍后再试。",
    gameOver: "💀 游戏结束！",
    finalScore: "你的分数:",
    restart: "再玩一次"
  },
  ko: {
    title: "🌍 국기를 맞춰보세요",
    score: "점수",
    record: "최고 기록",
    start: "게임 시작",
    loading: "로딩 중...",
    retry: "다시 시도",
    loadError: "국가 목록을 불러오지 못했습니다. 연결을 확인하세요.",
    flagError: "국기를 불러올 수 없습니다. 잠시 후 다시 시도하세요.",
    gameOver: "💀 게임 오버!",
    finalScore: "당신의 점수:",
    restart: "다시 하기"
  },
  ru: {
    title: "🌍 Угадай флаг",
    score: "Очки",
    record: "Рекорд",
    start: "Начать игру",
    loading: "Загрузка...",
    retry: "Повторить",
    loadError: "Не удалось загрузить страны. Проверьте подключение.",
    flagError: "Флаги не загружаются. Попробуйте позже.",
    gameOver: "💀 Игра окончена!",
    finalScore: "Ваш счёт:",
    restart: "Играть снова"
  },
  fr: {
    title: "🌍 Devine le Drapeau",
    score: "Points",
    record: "Record",
    start: "Commencer",
    loading: "Chargement...",
    retry: "Réessayer",
    loadError: "Impossible de charger les pays. Vérifiez votre connexion.",
    flagError: "Les drapeaux ne se chargent pas. Réessayez plus tard.",
    gameOver: "💀 Fin de partie !",
    finalScore: "Votre score :",
    restart: "Rejouer"
  },
  it: {
    title: "🌍 Indovina la Bandiera",
    score: "Punti",
    record: "Record",
    start: "Inizia il gioco",
    loading: "Caricamento...",
    retry: "Riprova",
    loadError: "Impossibile caricare i paesi. Controlla la connessione.",
    flagError: "Le bandiere non si caricano. Riprova più tardi.",
    gameOver: "💀 Game Over!",
    finalScore: "Il tuo punteggio:",
    restart: "Gioca ancora"
  }
};

function t() {
  return translations[currentLang];
}

let countries = [];
let countriesPromise = null;

/* ================= PAÍSES (API) ================= */

// Contrato: `countries` só recebe uma lista utilizável (>= MIN_OPTIONS países com
// código ISO e nome). Qualquer outra coisa — HTTP != 2xx, corpo que não é lista,
// lista curta demais — deixa `countries` vazio, e quem consome trata isso.
async function loadCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,translations");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Resposta da API não é uma lista");

    const parsed = data
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

    if (parsed.length < MIN_OPTIONS) throw new Error(`Só ${parsed.length} países utilizáveis`);

    countries = parsed;
  } catch (e) {
    countries = [];
    console.error("Erro ao carregar países:", e);
  }
}

// Deve reaproveitar o fetch em voo quando chamada de novo antes do anterior terminar
// (dois cliques rápidos em idiomas diferentes disparavam dois carregamentos).
// Resolve para `true` quando há países suficientes para jogar.
async function ensureCountries() {
  if (countries.length >= MIN_OPTIONS) return true;
  if (countriesPromise) return countriesPromise;

  setMessage("");
  startBtn.disabled = true;
  startBtn.textContent = t().loading;

  countriesPromise = loadCountries()
    .then(() => {
      const ok = countries.length >= MIN_OPTIONS;
      startBtn.disabled = false;
      startBtn.textContent = ok ? t().start : t().retry;
      if (!ok) setMessage(t().loadError);
      return ok;
    })
    .finally(() => {
      countriesPromise = null;
    });

  return countriesPromise;
}

/* ================= ESTADO ================= */

const MIN_OPTIONS = 4;        // alternativas por rodada — também o mínimo de países para jogar
const ROUND_SECONDS = 5;      // tempo de cada rodada
const FLAG_TIMEOUT_MS = 8000; // limite para a bandeira carregar antes de contar como falha
const MAX_FLAG_FAILURES = 3;  // falhas seguidas de imagem antes de encerrar a partida

let score = 0;
let timeLeft = ROUND_SECONDS;
let timerInterval = null;
let gameActive = false;
let roundReady = false;       // true só depois que a bandeira da rodada apareceu

let availableCountries = [];
let correctAnswer = null;

let flagWatchdog = null;
let flagFailures = 0;

// `localStorage` pode lançar (SecurityError com armazenamento bloqueado,
// QuotaExceededError em modo privado). Nenhuma dessas falhas pode derrubar o jogo:
// deve tratar o recorde como 0 quando o valor não puder ser lido ou não for numérico.
function readHighScore() {
  try {
    const raw = Number(localStorage.getItem("highScore"));
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  } catch (e) {
    console.warn("Recorde indisponível (localStorage bloqueado):", e);
    return 0;
  }
}

// Deve seguir o jogo normalmente quando a escrita falhar — o recorde é conveniência, não requisito.
function writeHighScore(value) {
  try {
    localStorage.setItem("highScore", String(value));
  } catch (e) {
    console.warn("Não foi possível salvar o recorde:", e);
  }
}

let highScore = readHighScore();
highScoreEl.textContent = highScore;

/* ================= CONFIG IDIOMA ================= */

window.setLanguage = async function(lang) {
  currentLang = lang;

  languageSelectionEl.classList.add("hidden");
  gameContainerEl.classList.remove("hidden");

  setMessage("");
  updateUIText();
  startBtn.classList.remove("hidden");

  await ensureCountries();
}

window.goBackToMenu = function() {
  gameActive = false;
  roundReady = false;
  clearInterval(timerInterval);
  clearFlagLoad();

  flagEl.style.display = "none";
  optionsEl.innerHTML = "";
  score = 0;
  scoreEl.textContent = "0";
  timerEl.textContent = String(ROUND_SECONDS);
  setMessage("");

  startBtn.disabled = false;
  startBtn.textContent = countries.length >= MIN_OPTIONS ? t().start : t().retry;
  startBtn.classList.remove("hidden");

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

// Fisher-Yates: permutação uniforme. O antigo `sort(() => Math.random() - 0.5)`
// enviesava tanto a ordem das alternativas quanto a sequência de países do baralho.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Aviso ao usuário. String vazia esconde. Sempre `textContent` — nunca `innerHTML`.
function setMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.toggle("hidden", !text);
}

/* ================= TIMER ================= */

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = ROUND_SECONDS;
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

// Deve carregar os países antes de começar, e deve virar "Tentar novamente"
// quando a fonte não responder — o botão nunca inicia uma partida sem dados.
async function handleStartClick() {
  if (gameActive || countriesPromise) return;

  if (countries.length < MIN_OPTIONS) {
    const ok = await ensureCountries();
    if (!ok) return;
  }

  startGame();
}

function startGame() {
  if (countries.length < MIN_OPTIONS) {
    setMessage(t().loadError);
    return;
  }

  score = 0;
  scoreEl.textContent = score;
  gameActive = true;
  flagFailures = 0;
  setMessage("");

  availableCountries = shuffle([...countries]);

  gameOverEl.classList.add("hidden");
  startBtn.classList.add("hidden");

  newRound();
}

// Deve exibir MIN_OPTIONS alternativas distintas, uma delas correta.
// O guard de `countries.length` é o que impede o laço abaixo de nunca terminar:
// com menos países do que alternativas não existem 4 distintos para sortear.
function newRound() {
  if (!gameActive) return;

  if (countries.length < MIN_OPTIONS) {
    setMessage(t().loadError);
    gameOver();
    return;
  }

  roundReady = false;
  optionsEl.innerHTML = "";

  if (availableCountries.length === 0) {
    availableCountries = shuffle([...countries]);
  }

  correctAnswer = availableCountries.pop();

  const options = [correctAnswer];

  while (options.length < MIN_OPTIONS) {
    const random = countries[Math.floor(Math.random() * countries.length)];
    if (!options.some(c => c.code === random.code)) {
      options.push(random);
    }
  }

  shuffle(options);

  options.forEach(country => {
    const btn = document.createElement("button");
    btn.textContent = country.name[currentLang];
    btn.onclick = () => handleAnswer(country.code === correctAnswer.code);
    optionsEl.appendChild(btn);
  });

  showFlag(correctAnswer.code);
}

/* ---- Carregamento da bandeira ----
   Deve iniciar o timer só quando a imagem estiver visível: antes, os 5 segundos
   corriam durante o download e o jogador perdia parte da rodada com a tela vazia.
   Deve sortear outro país quando a imagem falha, e encerrar após MAX_FLAG_FAILURES. */

function clearFlagLoad() {
  clearTimeout(flagWatchdog);
  flagWatchdog = null;
  flagEl.onload = null;
  flagEl.onerror = null;
}

function showFlag(code) {
  clearFlagLoad();

  flagEl.style.display = "none";
  flagEl.onload = onFlagReady;
  flagEl.onerror = onFlagFailed;
  // Imagem que nem carrega nem dá erro (rede pendurada) travaria a rodada para sempre.
  flagWatchdog = setTimeout(onFlagFailed, FLAG_TIMEOUT_MS);

  flagEl.src = `https://flagcdn.com/${code}.svg`;
}

function onFlagReady() {
  clearFlagLoad();
  if (!gameActive) return;

  flagFailures = 0;
  roundReady = true;
  flagEl.style.display = "block";
  startTimer();
}

function onFlagFailed() {
  clearFlagLoad();
  if (!gameActive) return;

  flagFailures++;

  if (flagFailures >= MAX_FLAG_FAILURES) {
    setMessage(t().flagError);
    gameOver();
    return;
  }

  newRound();
}

// `roundReady` evita responder (e pontuar) antes da bandeira aparecer.
function handleAnswer(correct) {
  if (!gameActive || !roundReady) return;

  roundReady = false;
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
  roundReady = false;
  clearInterval(timerInterval);
  clearFlagLoad();

  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore;
    // Persistir por último: falha de escrita não pode impedir a tela de resultado.
    writeHighScore(highScore);
  }

  finalScoreEl.textContent = score;
  gameOverEl.classList.remove("hidden");

  flagEl.style.display = "none";
  optionsEl.innerHTML = "";
}

/* ================= EVENTOS ================= */

startBtn.addEventListener("click", handleStartClick);

restartBtn.addEventListener("click", () => {
  gameOverEl.classList.add("hidden");
  startGame();
});
