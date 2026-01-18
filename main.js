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
  }
};

const countries = [
  // --- AMÉRICAS ---
  { name: { pt: "Brasil", en: "Brazil" }, code: "br" },
  { name: { pt: "Argentina", en: "Argentina" }, code: "ar" },
  { name: { pt: "Chile", en: "Chile" }, code: "cl" },
  { name: { pt: "Uruguai", en: "Uruguay" }, code: "uy" },
  { name: { pt: "Paraguai", en: "Paraguay" }, code: "py" },
  { name: { pt: "Bolívia", en: "Bolivia" }, code: "bo" },
  { name: { pt: "Peru", en: "Peru" }, code: "pe" },
  { name: { pt: "Colômbia", en: "Colombia" }, code: "co" },
  { name: { pt: "México", en: "Mexico" }, code: "mx" },
  { name: { pt: "Canadá", en: "Canada" }, code: "ca" },
  { name: { pt: "Estados Unidos", en: "United States" }, code: "us" },
  { name: { pt: "Equador", en: "Ecuador" }, code: "ec" },
  { name: { pt: "Venezuela", en: "Venezuela" }, code: "ve" },
  { name: { pt: "Guatemala", en: "Guatemala" }, code: "gt" },
  { name: { pt: "Cuba", en: "Cuba" }, code: "cu" },
  { name: { pt: "Haiti", en: "Haiti" }, code: "ht" },
  { name: { pt: "Rep. Dominicana", en: "Dominican Rep." }, code: "do" },
  { name: { pt: "Honduras", en: "Honduras" }, code: "hn" },
  { name: { pt: "El Salvador", en: "El Salvador" }, code: "sv" },
  { name: { pt: "Nicarágua", en: "Nicaragua" }, code: "ni" },
  { name: { pt: "Costa Rica", en: "Costa Rica" }, code: "cr" },
  { name: { pt: "Panamá", en: "Panama" }, code: "pa" },
  { name: { pt: "Jamaica", en: "Jamaica" }, code: "jm" },
  { name: { pt: "Bahamas", en: "Bahamas" }, code: "bs" },
  { name: { pt: "Barbados", en: "Barbados" }, code: "bb" },
  { name: { pt: "Guiana", en: "Guyana" }, code: "gy" },
  { name: { pt: "Suriname", en: "Suriname" }, code: "sr" },
  { name: { pt: "Trindade e Tobago", en: "Trinidad & Tobago" }, code: "tt" },
  { name: { pt: "Antígua e Barbuda", en: "Antigua & Barbuda" }, code: "ag" },
  { name: { pt: "Dominica", en: "Dominica" }, code: "dm" },
  { name: { pt: "Granada", en: "Grenada" }, code: "gd" },
  { name: { pt: "Santa Lúcia", en: "Saint Lucia" }, code: "lc" },
  { name: { pt: "São Cristóvão e Neves", en: "Saint Kitts & Nevis" }, code: "kn" },
  { name: { pt: "São Vicente e Granadinas", en: "St. Vincent & Grenadines" }, code: "vc" },

  // --- EUROPA ---
  { name: { pt: "Alemanha", en: "Germany" }, code: "de" },
  { name: { pt: "França", en: "France" }, code: "fr" },
  { name: { pt: "Itália", en: "Italy" }, code: "it" },
  { name: { pt: "Espanha", en: "Spain" }, code: "es" },
  { name: { pt: "Portugal", en: "Portugal" }, code: "pt" },
  { name: { pt: "Holanda", en: "Netherlands" }, code: "nl" },
  { name: { pt: "Bélgica", en: "Belgium" }, code: "be" },
  { name: { pt: "Áustria", en: "Austria" }, code: "at" },
  { name: { pt: "Suíça", en: "Switzerland" }, code: "ch" },
  { name: { pt: "Suécia", en: "Sweden" }, code: "se" },
  { name: { pt: "Noruega", en: "Norway" }, code: "no" },
  { name: { pt: "Finlândia", en: "Finland" }, code: "fi" },
  { name: { pt: "Polônia", en: "Poland" }, code: "pl" },
  { name: { pt: "Reino Unido", en: "United Kingdom" }, code: "gb" },
  { name: { pt: "Irlanda", en: "Ireland" }, code: "ie" },
  { name: { pt: "Grécia", en: "Greece" }, code: "gr" },
  { name: { pt: "Turquia", en: "Turkey" }, code: "tr" },
  { name: { pt: "Rússia", en: "Russia" }, code: "ru" },
  { name: { pt: "Ucrânia", en: "Ukraine" }, code: "ua" },
  { name: { pt: "Dinamarca", en: "Denmark" }, code: "dk" },
  { name: { pt: "Rep. Tcheca", en: "Czech Republic" }, code: "cz" },
  { name: { pt: "Hungria", en: "Hungary" }, code: "hu" },
  { name: { pt: "Romênia", en: "Romania" }, code: "ro" },
  { name: { pt: "Bulgária", en: "Bulgaria" }, code: "bg" },
  { name: { pt: "Croácia", en: "Croatia" }, code: "hr" },
  { name: { pt: "Sérvia", en: "Serbia" }, code: "rs" },
  { name: { pt: "Eslováquia", en: "Slovakia" }, code: "sk" },
  { name: { pt: "Lituânia", en: "Lithuania" }, code: "lt" },
  { name: { pt: "Letônia", en: "Latvia" }, code: "lv" },
  { name: { pt: "Estônia", en: "Estonia" }, code: "ee" },
  { name: { pt: "Luxemburgo", en: "Luxembourg" }, code: "lu" },
  { name: { pt: "Islândia", en: "Iceland" }, code: "is" },
  { name: { pt: "Malta", en: "Malta" }, code: "mt" },
  { name: { pt: "Chipre", en: "Cyprus" }, code: "cy" },
  { name: { pt: "Mônaco", en: "Monaco" }, code: "mc" },
  { name: { pt: "Albânia", en: "Albania" }, code: "al" },
  { name: { pt: "Andorra", en: "Andorra" }, code: "ad" },
  { name: { pt: "Bósnia e Herzegovina", en: "Bosnia & Herzegovina" }, code: "ba" },
  { name: { pt: "Eslovênia", en: "Slovenia" }, code: "si" },
  { name: { pt: "Geórgia", en: "Georgia" }, code: "ge" },
  { name: { pt: "Liechtenstein", en: "Liechtenstein" }, code: "li" },
  { name: { pt: "Moldávia", en: "Moldova" }, code: "md" },
  { name: { pt: "Montenegro", en: "Montenegro" }, code: "me" },
  { name: { pt: "Macedônia do Norte", en: "North Macedonia" }, code: "mk" },
  { name: { pt: "San Marino", en: "San Marino" }, code: "sm" },
  { name: { pt: "Vaticano", en: "Vatican" }, code: "va" },

  // --- ÁSIA ---
  { name: { pt: "Japão", en: "Japan" }, code: "jp" },
  { name: { pt: "China", en: "China" }, code: "cn" },
  { name: { pt: "Coreia do Sul", en: "South Korea" }, code: "kr" },
  { name: { pt: "Índia", en: "India" }, code: "in" },
  { name: { pt: "Tailândia", en: "Thailand" }, code: "th" },
  { name: { pt: "Vietnã", en: "Vietnam" }, code: "vn" },
  { name: { pt: "Indonésia", en: "Indonesia" }, code: "id" },
  { name: { pt: "Filipinas", en: "Philippines" }, code: "ph" },
  { name: { pt: "Malásia", en: "Malaysia" }, code: "my" },
  { name: { pt: "Singapura", en: "Singapore" }, code: "sg" },
  { name: { pt: "Paquistão", en: "Pakistan" }, code: "pk" },
  { name: { pt: "Bangladesh", en: "Bangladesh" }, code: "bd" },
  { name: { pt: "Irã", en: "Iran" }, code: "ir" },
  { name: { pt: "Iraque", en: "Iraq" }, code: "iq" },
  { name: { pt: "Arábia Saudita", en: "Saudi Arabia" }, code: "sa" },
  { name: { pt: "Israel", en: "Israel" }, code: "il" },
  { name: { pt: "Emirados Árabes", en: "UAE" }, code: "ae" },
  { name: { pt: "Catar", en: "Qatar" }, code: "qa" },
  { name: { pt: "Cazaquistão", en: "Kazakhstan" }, code: "kz" },
  { name: { pt: "Uzbequistão", en: "Uzbekistan" }, code: "uz" },
  { name: { pt: "Sri Lanka", en: "Sri Lanka" }, code: "lk" },
  { name: { pt: "Afeganistão", en: "Afghanistan" }, code: "af" },
  { name: { pt: "Armênia", en: "Armenia" }, code: "am" },
  { name: { pt: "Azerbaijão", en: "Azerbaijan" }, code: "az" },
  { name: { pt: "Bahrein", en: "Bahrain" }, code: "bh" },
  { name: { pt: "Butão", en: "Bhutan" }, code: "bt" },
  { name: { pt: "Brunei", en: "Brunei" }, code: "bn" },
  { name: { pt: "Camboja", en: "Cambodia" }, code: "kh" },
  { name: { pt: "Coreia do Norte", en: "North Korea" }, code: "kp" },
  { name: { pt: "Kuwait", en: "Kuwait" }, code: "kw" },
  { name: { pt: "Laos", en: "Laos" }, code: "la" },
  { name: { pt: "Líbano", en: "Lebanon" }, code: "lb" },
  { name: { pt: "Mongólia", en: "Mongolia" }, code: "mn" },
  { name: { pt: "Myanmar", en: "Myanmar" }, code: "mm" },
  { name: { pt: "Nepal", en: "Nepal" }, code: "np" },
  { name: { pt: "Omã", en: "Oman" }, code: "om" },
  { name: { pt: "Quirguistão", en: "Kyrgyzstan" }, code: "kg" },
  { name: { pt: "Síria", en: "Syria" }, code: "sy" },
  { name: { pt: "Tajiquistão", en: "Tajikistan" }, code: "tj" },
  { name: { pt: "Turcomenistão", en: "Turkmenistan" }, code: "tm" },
  { name: { pt: "Jordânia", en: "Jordan" }, code: "jo" },
  { name: { pt: "Iêmen", en: "Yemen" }, code: "ye" },

  // --- ÁFRICA ---
  { name: { pt: "África do Sul", en: "South Africa" }, code: "za" },
  { name: { pt: "Egito", en: "Egypt" }, code: "eg" },
  { name: { pt: "Nigéria", en: "Nigeria" }, code: "ng" },
  { name: { pt: "Quênia", en: "Kenya" }, code: "ke" },
  { name: { pt: "Marrocos", en: "Morocco" }, code: "ma" },
  { name: { pt: "Argélia", en: "Algeria" }, code: "dz" },
  { name: { pt: "Etiópia", en: "Ethiopia" }, code: "et" },
  { name: { pt: "Gana", en: "Ghana" }, code: "gh" },
  { name: { pt: "Senegal", en: "Senegal" }, code: "sn" },
  { name: { pt: "Angola", en: "Angola" }, code: "ao" },
  { name: { pt: "Moçambique", en: "Mozambique" }, code: "mz" },
  { name: { pt: "Camarões", en: "Cameroon" }, code: "cm" },
  { name: { pt: "Tunísia", en: "Tunisia" }, code: "tn" },
  { name: { pt: "Congo", en: "Congo" }, code: "cg" },
  { name: { pt: "Madagascar", en: "Madagascar" }, code: "mg" },
  { name: { pt: "Costa do Marfim", en: "Ivory Coast" }, code: "ci" },
  { name: { pt: "Uganda", en: "Uganda" }, code: "ug" },
  { name: { pt: "Zâmbia", en: "Zambia" }, code: "zm" },
  { name: { pt: "Benim", en: "Benin" }, code: "bj" },
  { name: { pt: "Botsuana", en: "Botswana" }, code: "bw" },
  { name: { pt: "Burquina Faso", en: "Burkina Faso" }, code: "bf" },
  { name: { pt: "Burundi", en: "Burundi" }, code: "bi" },
  { name: { pt: "Cabo Verde", en: "Cape Verde" }, code: "cv" },
  { name: { pt: "Chade", en: "Chad" }, code: "td" },
  { name: { pt: "Comores", en: "Comoros" }, code: "km" },
  { name: { pt: "Djibuti", en: "Djibouti" }, code: "dj" },
  { name: { pt: "Eritreia", en: "Eritrea" }, code: "er" },
  { name: { pt: "Gabão", en: "Gabon" }, code: "ga" },
  { name: { pt: "Gâmbia", en: "Gambia" }, code: "gm" },
  { name: { pt: "Guiné", en: "Guinea" }, code: "gn" },
  { name: { pt: "Guiné-Bissau", en: "Guinea-Bissau" }, code: "gw" },
  { name: { pt: "Guiné Equatorial", en: "Equatorial Guinea" }, code: "gq" },
  { name: { pt: "Lesoto", en: "Lesotho" }, code: "ls" },
  { name: { pt: "Libéria", en: "Liberia" }, code: "lr" },
  { name: { pt: "Líbia", en: "Libya" }, code: "ly" },
  { name: { pt: "Malaui", en: "Malawi" }, code: "mw" },
  { name: { pt: "Mali", en: "Mali" }, code: "ml" },
  { name: { pt: "Maurícia", en: "Mauritius" }, code: "mu" },
  { name: { pt: "Mauritânia", en: "Mauritania" }, code: "mr" },
  { name: { pt: "Namíbia", en: "Namibia" }, code: "na" },
  { name: { pt: "Níger", en: "Niger" }, code: "ne" },
  { name: { pt: "Ruanda", en: "Rwanda" }, code: "rw" },
  { name: { pt: "São Tomé e Príncipe", en: "Sao Tome & Principe" }, code: "st" },
  { name: { pt: "Seychelles", en: "Seychelles" }, code: "sc" },
  { name: { pt: "Serra Leoa", en: "Sierra Leone" }, code: "sl" },
  { name: { pt: "Somália", en: "Somalia" }, code: "so" },
  { name: { pt: "Sudão", en: "Sudan" }, code: "sd" },
  { name: { pt: "Sudão do Sul", en: "South Sudan" }, code: "ss" },
  { name: { pt: "Tanzânia", en: "Tanzania" }, code: "tz" },
  { name: { pt: "Togo", en: "Togo" }, code: "tg" },
  { name: { pt: "Zimbábue", en: "Zimbabwe" }, code: "zw" },

  // --- OCEANIA E ILHAS ---
  { name: { pt: "Austrália", en: "Australia" }, code: "au" },
  { name: { pt: "Nova Zelândia", en: "New Zealand" }, code: "nz" },
  { name: { pt: "Fiji", en: "Fiji" }, code: "fj" },
  { name: { pt: "Papua Nova Guiné", en: "Papua New Guinea" }, code: "pg" },
  { name: { pt: "Samoa", en: "Samoa" }, code: "ws" },
  { name: { pt: "Maldivas", en: "Maldives" }, code: "mv" },
  { name: { pt: "Kiribati", en: "Kiribati" }, code: "ki" },
  { name: { pt: "Ilhas Marshall", en: "Marshall Islands" }, code: "mh" },
  { name: { pt: "Micronésia", en: "Micronesia" }, code: "fm" },
  { name: { pt: "Nauru", en: "Nauru" }, code: "nr" },
  { name: { pt: "Palau", en: "Palau" }, code: "pw" },
  { name: { pt: "Ilhas Salomão", en: "Solomon Islands" }, code: "sb" },
  { name: { pt: "Tonga", en: "Tonga" }, code: "to" },
  { name: { pt: "Tuvalu", en: "Tuvalu" }, code: "tv" },
  { name: { pt: "Vanuatu", en: "Vanuatu" }, code: "vu" },

  // --- OUTROS ---
  
  { name: { pt: "Belize", en: "Belize" }, code: "bz" },
  { name: { pt: "Bielorrússia", en: "Belarus" }, code: "by" },
  { name: { pt: "Kosovo", en: "Kosovo" }, code: "xk" },
  { name: { pt: "República Democrática do Congo", en: "DR Congo" }, code: "cd" },
  { name: { pt: "República Centro-Africana", en: "Central African Republic" }, code: "cf" },
  { name: { pt: "Essuatíni", en: "Eswatini" }, code: "sz" },
  { name: { pt: "Timor-Leste", en: "East Timor" }, code: "tl" },
  { name: { pt: "Taiwan", en: "Taiwan" }, code: "tw" },
  { name: { pt: "Palestina", en: "Palestine" }, code: "ps" }
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

/* ================= CONFIG IDIOMA ================= */

window.setLanguage = function(lang) {
  currentLang = lang;
  languageSelectionEl.classList.add("hidden");
  gameContainerEl.classList.remove("hidden");
  startBtn.classList.remove("hidden");
  updateUIText();
}

window.goBackToMenu = function() {
  // Para o jogo se estiver rodando
  gameActive = false;
  clearInterval(timerInterval);
  
  // Reseta UI
  flagEl.style.display = "none";
  optionsEl.innerHTML = "";
  score = 0;
  scoreEl.textContent = "0";
  timerEl.textContent = "5";
  
  // Troca as telas
  gameContainerEl.classList.add("hidden");
  languageSelectionEl.classList.remove("hidden");
  
  // Garante que o Game Over suma
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

  flagEl.src = `https://flagcdn.com/w320/${correctAnswer.code}.png`;
  flagEl.style.display = "block";

  options.forEach(country => {
    const btn = document.createElement("button");
    // Seleciona nome baseado no idioma
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