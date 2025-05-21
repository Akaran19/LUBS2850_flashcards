// app.js

let allItems = [];
let score = 0;
let questionCount = 0;
const MAX_QUESTIONS = 20;
let currentCorrectAnswer = '';
let timerId = null;
let timeLeft = 0;

// DOM refs
const COLORS = ['red', 'blue', 'yellow', 'green'];
const scoreEl      = document.getElementById('score');
const timerEl      = document.getElementById('timer');
const questionEl   = document.getElementById('question');
const optionsEl    = document.getElementById('options');
const feedbackEl   = document.getElementById('feedback');
const progressEl   = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

// Leaderboard persistence
function loadLeaderboard() {
  const raw = localStorage.getItem('rapidRecallLeaderboard');
  return raw ? JSON.parse(raw) : [];
}
function saveLeaderboard(board) {
  localStorage.setItem('rapidRecallLeaderboard', JSON.stringify(board));
}

// Render the sidebar leaderboard
function renderSidebar() {
  const board = loadLeaderboard();
  const listEl = document.getElementById('sidebar-leaderboard');
  listEl.innerHTML = '';
  board.forEach(entry => {
    const li = document.createElement('li');
    const date = new Date(entry.date).toLocaleString();
    li.textContent = `${entry.score} — ${date}`;
    listEl.append(li);
  });
}

// 1. Load JSON data
fetch('./terms.json')
  .then(res => {
    console.log('terms.json HTTP status:', res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(raw => {
    console.log('Loaded terms.json, first item:', raw[0]);
    allItems = raw.map(item => ({
      ...item,
      answer: item.answer.replace(/\\/g, ' ').trim()
    }));
    // Initialize progress
    if (progressEl) {
      progressEl.max = allItems.length;
      progressEl.value = 0;
    }
    if (progressText) {
      progressText.textContent = `0/${allItems.length}`;
    }
    renderSidebar();
    startGame();
  })
  .catch(err => {
    console.error('Fetch error:', err);
    questionEl.textContent = 'Error loading data.';
  });


// 2. Start or restart
function startGame() {
  score = 0;
  questionCount = 0;
  scoreEl.textContent = `Score: ${score}`;
  feedbackEl.textContent = '';
  // Reset progress bar and text
  if (progressEl) progressEl.value = 0;
  if (progressText) progressText.textContent = `0/${allItems.length}`;
  
  // Clear any existing timer
  clearInterval(timerId);
  
  nextQuestion();
}

// 3. Utilities
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickDecoys(arr, n, correctAnswer) {
  const pool = arr.filter(item => item.answer !== correctAnswer);
  return shuffle(pool).slice(0, n).map(item => item.answer);
}

// 4. Question cycle
function nextQuestion() {
  questionCount++;
  // Update progress bar and text
  if (progressEl) progressEl.value = questionCount;
  if (progressText) progressText.textContent = `${questionCount}/${allItems.length}`;

  feedbackEl.textContent = '';
  const item = pickRandom(allItems);
  const term = item.question;
  currentCorrectAnswer = item.answer;

  const defs = shuffle([
    currentCorrectAnswer,
    ...pickDecoys(allItems, 3, currentCorrectAnswer)
  ]);

  questionEl.textContent = term;
  optionsEl.innerHTML = '';
  defs.forEach((defText, idx) => {
    const btn = document.createElement('button');
    // give it both the base class and one of the color classes
    btn.className = `option-btn ${COLORS[idx]}`;
    
    // (optional) if you want the little shape icons too:
    const shape = document.createElement('span');
    shape.className = `shape ${['triangle','diamond','circle','square'][idx]}`;
    btn.append(shape);
  
    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = defText;
    btn.append(text);
  
    btn.onclick = () => checkAnswer(defText);
    optionsEl.append(btn);
  });
  
  // Start a 30-second timer for this question
  startTimer(30);
}

// 5. Timer
function startTimer(seconds) {
  clearInterval(timerId);
  timeLeft = seconds;
  timerEl.textContent = `Time: ${timeLeft}s`;
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleWrong();
    }
  }, 1000);
}

// 6. Answer handling
function checkAnswer(selection) {
  clearInterval(timerId);
  if (selection === currentCorrectAnswer) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    feedbackEl.textContent = '✅ Correct!';
    setTimeout(nextQuestion, 1000);
  } else {
    handleWrong();
  }
}

// Handle wrong answer or timeout by ending run and starting fresh
function handleWrong() {
  feedbackEl.textContent = `❌ Wrong or timed out! Answer was: ${currentCorrectAnswer}`;
  const board = loadLeaderboard();
  board.push({ score, date: new Date().toISOString() });
  board.sort((a, b) => b.score - a.score);
  if (board.length > 5) board.length = 5;
  saveLeaderboard(board);
  renderSidebar();
  setTimeout(startGame, 1500);
}

// 7. End game (not used)
function endGame() {}
