/* ================= ELEMENTOS ================= */

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const flagEl = document.getElementById("flag");
const optionsEl = document.getElementById("options");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const messageEl = document.getElementById("message");

// Telas
const languageSelectionEl = document.getElementById("languageSelection");
const gameContainerEl = document.getElementById("gameContainer");
const gameOverEl = document.getElementById("gameOver");

const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const gameOverBackBtn = document.getElementById("gameOverBackBtn");

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
// `htmlLang`   → valor aplicado em <html lang> (acessibilidade / leitor de tela)
// `dataLocale` → pasta de idioma na fonte de países (ver seção PAÍSES)
const translations = {
  pt: {
    htmlLang: "pt-BR",
    dataLocale: "pt_BR",
    title: "🌍 Adivinhe a Bandeira",
    score: "Pontos",
    record: "Recorde",
    start: "Iniciar Jogo",
    loading: "Carregando...",
    retry: "Tentar Novamente",
    back: "← Mudar Idioma",
    loadError: "Não foi possível carregar os países. Verifique sua conexão.",
    flagError: "As bandeiras não estão carregando. Tente novamente mais tarde.",
    gameOver: "💀 Fim de Jogo!",
    finalScore: "Sua pontuação:",
    restart: "Jogar Novamente"
  },
  en: {
    htmlLang: "en",
    dataLocale: "en",
    title: "🌍 Guess the Flag",
    score: "Score",
    record: "Best",
    start: "Start Game",
    loading: "Loading...",
    retry: "Try Again",
    back: "← Change Language",
    loadError: "Could not load the countries. Check your connection.",
    flagError: "Flags are not loading. Please try again later.",
    gameOver: "💀 Game Over!",
    finalScore: "Your Score:",
    restart: "Play Again"
  },
  es: {
    htmlLang: "es",
    dataLocale: "es",
    title: "🌍 Adivina la Bandera",
    score: "Puntos",
    record: "Récord",
    start: "Iniciar Juego",
    loading: "Cargando...",
    retry: "Intentar de Nuevo",
    back: "← Cambiar Idioma",
    loadError: "No se pudieron cargar los países. Comprueba tu conexión.",
    flagError: "Las banderas no cargan. Inténtalo más tarde.",
    gameOver: "💀 ¡Fin del Juego!",
    finalScore: "Tu puntuación:",
    restart: "Jugar de Nuevo"
  },
  ja: {
    htmlLang: "ja",
    dataLocale: "ja",
    title: "🌍 国旗を当てよう",
    score: "スコア",
    record: "最高記録",
    start: "ゲームスタート",
    loading: "読み込み中...",
    retry: "再試行",
    back: "← 言語を変更",
    loadError: "国データを読み込めませんでした。接続を確認してください。",
    flagError: "国旗を読み込めません。しばらくしてからお試しください。",
    gameOver: "💀 ゲームオーバー！",
    finalScore: "あなたのスコア:",
    restart: "もう一度"
  },
  zh: {
    htmlLang: "zh-CN",
    dataLocale: "zh_CN",
    title: "🌍 猜国旗",
    score: "分数",
    record: "最高分",
    start: "开始游戏",
    loading: "加载中...",
    retry: "重试",
    back: "← 更改语言",
    loadError: "无法加载国家数据，请检查网络连接。",
    flagError: "国旗无法加载，请稍后再试。",
    gameOver: "💀 游戏结束！",
    finalScore: "你的分数:",
    restart: "再玩一次"
  },
  ko: {
    htmlLang: "ko",
    dataLocale: "ko",
    title: "🌍 국기를 맞춰보세요",
    score: "점수",
    record: "최고 기록",
    start: "게임 시작",
    loading: "로딩 중...",
    retry: "다시 시도",
    back: "← 언어 변경",
    loadError: "국가 목록을 불러오지 못했습니다. 연결을 확인하세요.",
    flagError: "국기를 불러올 수 없습니다. 잠시 후 다시 시도하세요.",
    gameOver: "💀 게임 오버!",
    finalScore: "당신의 점수:",
    restart: "다시 하기"
  },
  ru: {
    htmlLang: "ru",
    dataLocale: "ru",
    title: "🌍 Угадай флаг",
    score: "Очки",
    record: "Рекорд",
    start: "Начать игру",
    loading: "Загрузка...",
    retry: "Повторить",
    back: "← Сменить язык",
    loadError: "Не удалось загрузить страны. Проверьте подключение.",
    flagError: "Флаги не загружаются. Попробуйте позже.",
    gameOver: "💀 Игра окончена!",
    finalScore: "Ваш счёт:",
    restart: "Играть снова"
  },
  fr: {
    htmlLang: "fr",
    dataLocale: "fr",
    title: "🌍 Devine le Drapeau",
    score: "Points",
    record: "Record",
    start: "Commencer",
    loading: "Chargement...",
    retry: "Réessayer",
    back: "← Changer de langue",
    loadError: "Impossible de charger les pays. Vérifiez votre connexion.",
    flagError: "Les drapeaux ne se chargent pas. Réessayez plus tard.",
    gameOver: "💀 Fin de partie !",
    finalScore: "Votre score :",
    restart: "Rejouer"
  },
  it: {
    htmlLang: "it",
    dataLocale: "it",
    title: "🌍 Indovina la Bandiera",
    score: "Punti",
    record: "Record",
    start: "Inizia il gioco",
    loading: "Caricamento...",
    retry: "Riprova",
    back: "← Cambia lingua",
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

/* ================= PAÍSES (DADOS) ================= */

// Duas fontes, em cascata:
//   1. jsDelivr servindo os dados ICU/CLDR do umpirsky/country-list, fixados na tag
//      2.0.6 (cache imutável). Um arquivo por idioma, 4–16 KB.
//   2. `countries.json` deste próprio repo, com os 9 idiomas de uma vez.
// A reserva existe porque a restcountries v3.1 — a fonte anterior — foi desligada sem
// aviso e levou o jogo junto. Serviço de terceiro não pode ser ponto único de falha.
const COUNTRIES_CDN = "https://cdn.jsdelivr.net/gh/umpirsky/country-list@2.0.6/data/{locale}/country.json";
const COUNTRIES_FALLBACK = "./countries.json";

let countriesByLang = {};   // cache por idioma: { pt: [{ code, name }], ... }
let countries = [];         // lista já resolvida para o idioma atual
let countriesPromise = null;

// Territórios cujo flagcdn.com serve o MESMO SVG, byte a byte, do país-sede — não têm
// bandeira própria. Verificado baixando as 249 bandeiras do countries.json e comparando
// hash: bv (Ilha Bouvet) e sj (Svalbard e Jan Mayen) = no (Noruega); mf (São Martinho) =
// fr (França); um (Ilhas Menores Distantes dos EUA) = us (Estados Unidos). Sem isso, quando
// um deles é sorteado como resposta certa, a imagem exibida é indistinguível da do país-sede
// e o nome do país-sede nem aparece nas opções — a rodada não tem como ser acertada.
// Deve excluir esses códigos da lista jogável, nas duas fontes (CDN e reserva local).
const DUPLICATE_FLAG_CODES = new Set(["bv", "sj", "mf", "um"]);

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json();
}

// Formato do CDN: { "BR": "Brasil", ... } → [{ code: "br", name: "Brasil" }]
function parseSingleLang(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return [];

  return Object.entries(data)
    .filter(([code, name]) => /^[a-z]{2}$/i.test(code) && typeof name === "string" && name.trim())
    .filter(([code]) => !DUPLICATE_FLAG_CODES.has(code.toLowerCase()))
    .map(([code, name]) => ({ code: code.toLowerCase(), name }));
}

// Formato local: { "BR": { pt: "Brasil", en: "Brazil", ... } }.
// Preenche o cache dos 9 idiomas de uma vez — depois disso trocar de idioma é instantâneo.
function parseAllLangs(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;

  const langs = Object.keys(translations);
  const byLang = {};
  langs.forEach(lang => { byLang[lang] = []; });

  Object.entries(data).forEach(([code, names]) => {
    if (!/^[a-z]{2}$/i.test(code) || !names || typeof names !== "object") return;
    if (DUPLICATE_FLAG_CODES.has(code.toLowerCase())) return;

    langs.forEach(lang => {
      const name = names[lang] || names.en;
      if (typeof name === "string" && name.trim()) {
        byLang[lang].push({ code: code.toLowerCase(), name });
      }
    });
  });

  if (byLang[currentLang].length < MIN_OPTIONS) return false;

  countriesByLang = byLang;
  return true;
}

// Deve tentar o CDN primeiro e cair para o arquivo local quando ele falhar;
// deve reportar falha só quando as DUAS fontes falharem.
async function loadCountries(lang) {
  try {
    const url = COUNTRIES_CDN.replace("{locale}", translations[lang].dataLocale);
    const list = parseSingleLang(await fetchJson(url));

    if (list.length < MIN_OPTIONS) throw new Error(`só ${list.length} países utilizáveis`);

    countriesByLang[lang] = list;
    return true;
  } catch (e) {
    console.warn("CDN de países indisponível, tentando o arquivo local:", e);
  }

  try {
    if (parseAllLangs(await fetchJson(COUNTRIES_FALLBACK))) return true;
    throw new Error("countries.json não tem países utilizáveis");
  } catch (e) {
    console.error("Erro ao carregar países:", e);
  }

  return false;
}

// Deve reaproveitar o carregamento em voo quando chamada de novo antes do anterior
// terminar (dois cliques rápidos em idiomas diferentes disparavam dois fetches).
// Resolve para `true` quando há países suficientes para jogar no idioma atual.
async function ensureCountries() {
  countries = countriesByLang[currentLang] || [];
  if (countries.length >= MIN_OPTIONS) return true;
  if (countriesPromise) return countriesPromise;

  setMessage("");
  startBtn.disabled = true;
  startBtn.textContent = t().loading;

  countriesPromise = loadCountries(currentLang)
    .then(() => {
      countries = countriesByLang[currentLang] || [];
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
  gameOverEl.classList.add("hidden");

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
  const text = t();

  // O documento inteiro segue o idioma escolhido, não só os textos da tela.
  document.documentElement.lang = text.htmlLang;
  document.title = text.title;

  uiTitle.textContent = text.title;
  uiScoreLabel.textContent = text.score;
  uiHighScoreLabel.textContent = text.record;
  startBtn.textContent = text.start;
  backBtn.textContent = text.back;
  gameOverBackBtn.textContent = text.back;
  uiGameOver.textContent = text.gameOver;
  uiFinalScoreLabel.textContent = text.finalScore;
  restartBtn.textContent = text.restart;
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
    btn.textContent = country.name;
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

gameOverBackBtn.addEventListener("click", () => window.goBackToMenu());
