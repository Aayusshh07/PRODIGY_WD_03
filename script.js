const board = document.getElementById("board");
const message = document.getElementById("message");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let isAgainstAI = false;
let scores = { X: 0, O: 0, Draw: 0 };

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

// Mode Change
document.querySelectorAll("input[name='mode']").forEach(input => {
  input.addEventListener("change", (e) => {
    isAgainstAI = e.target.value === "ai";
    restartGame();
  });
});

function createBoard() {
  board.innerHTML = "";
  gameState.fill("");
  currentPlayer = "X";
  message.textContent = "❌ Player X's turn";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (gameState[index] === "") {
    makeMove(index);
    if (isAgainstAI && currentPlayer === "O" && !checkWinner() && gameState.includes("")) {
      setTimeout(aiMove, 500);
    }
  }
}

function makeMove(index) {
  gameState[index] = currentPlayer;
  const cell = document.querySelector(`[data-index='${index}']`);
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner()) {
    message.textContent = `🎉 Player ${currentPlayer} wins!`;
    scores[currentPlayer]++;
    updateScores();
    highlightWinner();
    endGame();
  } else if (!gameState.includes("")) {
    message.textContent = "🤝 It's a draw!";
    scores.Draw++;
    updateScores();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    message.textContent = currentPlayer === "X" ? "❌ Player X's turn" : "⭕ Player O's turn";
  }
}

function checkWinner() {
  return winningCombinations.some(combination => {
    return combination.every(index => gameState[index] === currentPlayer);
  });
}

function highlightWinner() {
  winningCombinations.forEach(combination => {
    if (combination.every(index => gameState[index] === currentPlayer)) {
      combination.forEach(index => {
        document.querySelector(`[data-index='${index}']`).classList.add("winner");
      });
    }
  });
}

function endGame() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.add("taken");
  });
}

function restartGame() {
  createBoard();
}

/* ---------------- SMART AI ---------------- */
function aiMove() {
  let bestMove = findBestMove();
  makeMove(bestMove);
}

function findBestMove() {
  // 1. Check if AI can win in the next move
  for (let combo of winningCombinations) {
    let [a, b, c] = combo;
    if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") return c;
    if (gameState[a] === "O" && gameState[b] === "" && gameState[c] === "O") return b;
    if (gameState[a] === "" && gameState[b] === "O" && gameState[c] === "O") return a;
  }

  // 2. Check if player is about to win, block them
  for (let combo of winningCombinations) {
    let [a, b, c] = combo;
    if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") return c;
    if (gameState[a] === "X" && gameState[b] === "" && gameState[c] === "X") return b;
    if (gameState[a] === "" && gameState[b] === "X" && gameState[c] === "X") return a;
  }

  // 3. Otherwise, pick random available cell
  let emptyCells = gameState.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.Draw;
}

createBoard();
