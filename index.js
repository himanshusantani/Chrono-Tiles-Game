
const ROWS = 4, COLS = 5, GAME_DURATION = 60;
let score = 0, timer = GAME_DURATION, streak = 0, interval, soundOn = true;
const board = document.getElementById("game-board");
const scoreBox = document.getElementById("score");
const timerBox = document.getElementById("timer");
const gameOverBox = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const soundBtn = document.getElementById("sound-btn");
let tiles = [];
let activeTileIndex = -1;
let audio = new AudioContext();

function playSound(type) {
  if (!soundOn) return;
  const o = audio.createOscillator(), g = audio.createGain();
  o.connect(g); g.connect(audio.destination);
  g.gain.value = 0.1;
  o.type = type === "success" ? "sine" : type === "miss" ? "triangle" : "square";
  o.frequency.value = type === "success" ? 880 : type === "miss" ? 220 : 440;
  o.start();
  o.stop(audio.currentTime + 0.21);
}

function setupBoard() {
  board.innerHTML = "";
  tiles = [];
  for(let i=0; i<ROWS*COLS; ++i) {
    const div = document.createElement("div");
    div.className = "tile";
    div.dataset.index = i;
    div.onclick = () => handleTileClick(i);
    tiles.push(div);
    board.appendChild(div);
  }
}

function activateTile() {
  if (activeTileIndex !== -1) clearActiveTile();
  activeTileIndex = Math.floor(Math.random() * tiles.length);
  const tile = tiles[activeTileIndex];
  tile.classList.add("active");
  setTimeout(() => {
    if (tile.classList.contains("active")) {
      tile.classList.remove("active");
      tile.classList.add("missed");
      playSound("miss");
      streak = 0;
      updateScore(-6);
      setTimeout(() => tile.classList.remove("missed"), 700);
      activeTileIndex = -1;
      setTimeout(activateTile, 450);
    }
  }, 1200);
}

function clearActiveTile() {
  if (activeTileIndex === -1) return;
  tiles[activeTileIndex].classList.remove("active");
  activeTileIndex = -1;
}

function handleTileClick(idx) {
  if (activeTileIndex !== idx) return;
  tiles[idx].classList.remove("active");
  tiles[idx].classList.add("correct");
  playSound("success");
  streak++;
  let pts = 10 + (streak >= 5 ? streak*2 : 0);
  updateScore(pts);
  setTimeout(() => tiles[idx].classList.remove("correct"), 400);
  activeTileIndex = -1;
  setTimeout(activateTile, 350);
}

function updateScore(val) {
  score += val;
  if(score < 0) score = 0;
  scoreBox.textContent = score;
}

function startGame() {
  setupBoard();
  score = 0; streak = 0; timer = GAME_DURATION;
  scoreBox.textContent = score;
  timerBox.textContent = timer;
  interval = setInterval(() => {
    timer--;
    timerBox.textContent = timer;
    if(timer <= 0) endGame();
  }, 1000);
  activateTile();
}

function endGame() {
  clearInterval(interval);
  clearActiveTile();
  gameOverBox.style.display = "";
  finalScore.innerHTML = `Final Score: <b>${score}</b><br>Max Streak: <b>${streak}</b>`;
}

soundBtn.onclick = () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "🔊" : "🔇";
}

window.onload = startGame;
