/* ================= ELEMENTOS ================= */

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const flagEl = document.getElementById("flag");
const optionsEl = document.getElementById("options");
const startBtn = document.getElementById("startBtn");

const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

/* ================= DADOS ================= */

const countries = [
  // --- AMÉRICAS ---
  { name: "Brasil", code: "br" }, { name: "Argentina", code: "ar" }, { name: "Chile", code: "cl" },
  { name: "Uruguai", code: "uy" }, { name: "Paraguai", code: "py" }, { name: "Bolívia", code: "bo" },
  { name: "Peru", code: "pe" }, { name: "Colômbia", code: "co" }, { name: "México", code: "mx" },
  { name: "Canadá", code: "ca" }, { name: "Estados Unidos", code: "us" }, { name: "Equador", code: "ec" },
  { name: "Venezuela", code: "ve" }, { name: "Guatemala", code: "gt" }, { name: "Cuba", code: "cu" },
  { name: "Haiti", code: "ht" }, { name: "República Dominicana", code: "do" }, { name: "Honduras", code: "hn" },
  { name: "Paraguai", code: "py" }, { name: "El Salvador", code: "sv" }, { name: "Nicarágua", code: "ni" },
  { name: "Costa Rica", code: "cr" }, { name: "Panamá", code: "pa" }, { name: "Jamaica", code: "jm" },
  { name: "Bahamas", code: "bs" }, { name: "Barbados", code: "bb" }, { name: "Guiana", code: "gy" },
  { name: "Suriname", code: "sr" }, { name: "Trindade e Tobago", code: "tt" },

  // --- EUROPA ---
  { name: "Alemanha", code: "de" }, { name: "França", code: "fr" }, { name: "Itália", code: "it" },
  { name: "Espanha", code: "es" }, { name: "Portugal", code: "pt" }, { name: "Holanda", code: "nl" },
  { name: "Bélgica", code: "be" }, { name: "Áustria", code: "at" }, { name: "Suíça", code: "ch" },
  { name: "Suécia", code: "se" }, { name: "Noruega", code: "no" }, { name: "Finlândia", code: "fi" },
  { name: "Polônia", code: "pl" }, { name: "Reino Unido", code: "gb" }, { name: "Irlanda", code: "ie" },
  { name: "Grécia", code: "gr" }, { name: "Turquia", code: "tr" }, { name: "Rússia", code: "ru" },
  { name: "Ucrânia", code: "ua" }, { name: "Dinamarca", code: "dk" }, { name: "República Tcheca", code: "cz" },
  { name: "Hungria", code: "hu" }, { name: "Romênia", code: "ro" }, { name: "Bulgária", code: "bg" },
  { name: "Croácia", code: "hr" }, { name: "Sérvia", code: "rs" }, { name: "Eslováquia", code: "sk" },
  { name: "Lituânia", code: "lt" }, { name: "Letônia", code: "lv" }, { name: "Estônia", code: "ee" },
  { name: "Luxemburgo", code: "lu" }, { name: "Islândia", code: "is" }, { name: "Malta", code: "mt" },
  { name: "Chipre", code: "cy" }, { name: "Mônaco", code: "mc" }, { name: "Albânia", code: "al" }, { name: "Andorra", code: "ad" }, { name: "Bósnia e Herzegovina", code: "ba" },
  { name: "Eslovênia", code: "si" }, { name: "Geórgia", code: "ge" }, { name: "Liechtenstein", code: "li" },
  { name: "Moldávia", code: "md" }, { name: "Montenegro", code: "me" }, { name: "Macedônia do Norte", code: "mk" },
  { name: "San Marino", code: "sm" }, { name: "Vaticano", code: "va" },

  // --- ÁSIA ---
  { name: "Japão", code: "jp" }, { name: "China", code: "cn" }, { name: "Coreia do Sul", code: "kr" },
  { name: "Índia", code: "in" }, { name: "Tailândia", code: "th" }, { name: "Vietnã", code: "vn" },
  { name: "Indonésia", code: "id" }, { name: "Filipinas", code: "ph" }, { name: "Malásia", code: "my" },
  { name: "Singapura", code: "sg" }, { name: "Paquistão", code: "pk" }, { name: "Bangladesh", code: "bd" },
  { name: "Irã", code: "ir" }, { name: "Iraque", code: "iq" }, { name: "Arábia Saudita", code: "sa" },
  { name: "Israel", code: "il" }, { name: "Emirados Árabes", code: "ae" }, { name: "Catar", code: "qa" },
  { name: "Cazaquistão", code: "kz" }, { name: "Uzbequistão", code: "uz" }, { name: "Sri Lanka", code: "lk" }, { name: "Afeganistão", code: "af" }, { name: "Armênia", code: "am" }, { name: "Azerbaijão", code: "az" },
  { name: "Bahrein", code: "bh" }, { name: "Butão", code: "bt" }, { name: "Brunei", code: "bn" },
  { name: "Camboja", code: "kh" }, { name: "Coreia do Norte", code: "kp" }, { name: "Kuwait", code: "kw" },
  { name: "Laos", code: "la" }, { name: "Líbano", code: "lb" }, { name: "Mongólia", code: "mn" },
  { name: "Myanmar", code: "mm" }, { name: "Nepal", code: "np" }, { name: "Omã", code: "om" },
  { name: "Quirguistão", code: "kg" }, { name: "Síria", code: "sy" }, { name: "Tajiquistão", code: "tj" },
  { name: "Turcomenistão", code: "tm" }, { name: "Jordânia", code: "jo" }, { name: "Iêmen", code: "ye" },

  // --- ÁFRICA ---
  { name: "África do Sul", code: "za" }, { name: "Egito", code: "eg" }, { name: "Nigéria", code: "ng" },
  { name: "Quênia", code: "ke" }, { name: "Marrocos", code: "ma" }, { name: "Argélia", code: "dz" },
  { name: "Etiópia", code: "et" }, { name: "Gana", code: "gh" }, { name: "Senegal", code: "sn" },
  { name: "Angola", code: "ao" }, { name: "Moçambique", code: "mz" }, { name: "Camarões", code: "cm" },
  { name: "Tunísia", code: "tn" }, { name: "Congo", code: "cg" }, { name: "Madagascar", code: "mg" },
  { name: "Costa do Marfim", code: "ci" }, { name: "Uganda", code: "ug" }, { name: "Zâmbia", code: "zm" }, { name: "Benim", code: "bj" }, { name: "Botsuana", code: "bw" }, { name: "Burquina Faso", code: "bf" }, { name: "Burundi", code: "bi" }, { name: "Cabo Verde", code: "cv" }, { name: "Chade", code: "td" },
  { name: "Comores", code: "km" }, { name: "Djibuti", code: "dj" }, { name: "Eritreia", code: "er" },
  { name: "Gabão", code: "ga" }, { name: "Gâmbia", code: "gm" }, { name: "Guiné", code: "gn" },
  { name: "Guiné-Bissau", code: "gw" }, { name: "Guiné Equatorial", code: "gq" }, { name: "Lesoto", code: "ls" },
  { name: "Libéria", code: "lr" }, { name: "Líbia", code: "ly" }, { name: "Malaui", code: "mw" },
  { name: "Mali", code: "ml" }, { name: "Maurícia", code: "mu" }, { name: "Mauritânia", code: "mr" },
  { name: "Namíbia", code: "na" }, { name: "Níger", code: "ne" }, { name: "Ruanda", code: "rw" },
  { name: "São Tomé e Príncipe", code: "st" }, { name: "Seychelles", code: "sc" }, { name: "Serra Leoa", code: "sl" },
  { name: "Somália", code: "so" }, { name: "Sudão", code: "sd" }, { name: "Sudão do Sul", code: "ss" },
  { name: "Tanzânia", code: "tz" }, { name: "Togo", code: "tg" }, { name: "Zimbábue", code: "zw" },

  // --- OCEANIA E ILHAS ---
  { name: "Austrália", code: "au" }, { name: "Nova Zelândia", code: "nz" }, { name: "Fiji", code: "fj" },
  { name: "Papua Nova Guiné", code: "pg" }, { name: "Samoa", code: "ws" }, { name: "Maldivas", code: "mv" }, { name: "Antígua e Barbuda", code: "ag" }, { name: "Dominica", code: "dm" }, { name: "Granada", code: "gd" },
  { name: "Kiribati", code: "ki" }, { name: "Ilhas Marshall", code: "mh" }, { name: "Micronésia", code: "fm" },
  { name: "Nauru", code: "nr" }, { name: "Palau", code: "pw" }, { name: "Santa Lúcia", code: "lc" },
  { name: "São Cristóvão e Neves", code: "kn" }, { name: "São Vicente e Granadinas", code: "vc" },
  { name: "Ilhas Salomão", code: "sb" }, { name: "Tonga", code: "to" }, { name: "Tuvalu", code: "tv" },
  { name: "Vanuatu", code: "vu" }
];

/* ================= ESTADO ================= */

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeLeft = 5;
let timerInterval = null;
let gameActive = false;

let availableCountries = [];
let correctAnswer = null;

highScoreEl.textContent = highScore;

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

  gameOverEl.classList.add("hidden"); // ESCONDE OVERLAY
  startBtn.style.display = "none";

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

  flagEl.src = `https://flagcdn.com/w320/${correctAnswer.code}.png`;
  flagEl.style.display = "block";

  options.forEach(country => {
    const btn = document.createElement("button");
    btn.textContent = country.name;
    btn.onclick = () => handleAnswer(country.name === correctAnswer.name);
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

/* ================= ESTADO INICIAL ================= */

gameActive = false;
gameOverEl.classList.add("hidden");
flagEl.style.display = "none";
optionsEl.innerHTML = "";
startBtn.style.display = "inline-block";
timerEl.textContent = 5;
scoreEl.textContent = 0;