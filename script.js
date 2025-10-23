// --- Game State Variables ---
let player1Score = 0;
let player2Score = 0;
let isTwoPlayerMode = false;
let player1Choice = null;
let player2Choice = null;
let currentPlayer = 1; // Used for two-player mode

// --- DOM Elements ---
const gameContainer = document.querySelector('.game-container');
const modeBtns = document.querySelectorAll('.mode-btn');
const player1Label = document.getElementById('player1-label');
const player2Label = document.getElementById('player2-label');
const p1Title = document.getElementById('p1-title');
const p2Title = document.getElementById('p2-title');
const player1ScoreEl = document.getElementById('player1-score');
const player2ScoreEl = document.getElementById('player2-score');
const resultMessageEl = document.getElementById('result-message');
const nextRoundBtn = document.getElementById('next-round-btn');
const choiceBtnsP1 = document.querySelectorAll('#player1-section .choice-btn');
const choiceBtnsP2 = document.querySelectorAll('#player2-section .p2-btn');
const p1ChosenTextEl = document.getElementById('p1-chosen-text');
const p2ChosenTextEl = document.getElementById('p2-chosen-text');

// --- Helper Functions ---

/** Generates a random choice for the computer. */
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

/** Determines the winner of a single round. */
function determineWinner(p1Choice, p2Choice) {
    if (p1Choice === p2Choice) {
        return 'draw';
    }

    // Winning conditions for P1
    if (
        (p1Choice === 'rock' && p2Choice === 'scissors') ||
        (p1Choice === 'paper' && p2Choice === 'rock') ||
        (p1Choice === 'scissors' && p2Choice === 'paper')
    ) {
        return 'player1';
    }

    // Otherwise, P2 wins
    return 'player2';
}

/** Updates the displayed scores and result message. */
function updateDisplay(winner) {
    player1ScoreEl.textContent = player1Score;
    player2ScoreEl.textContent = player2Score;

    p1ChosenTextEl.textContent = player1Choice ? `Chose: ${player1Choice}` : '';
    p2ChosenTextEl.textContent = player2Choice ? `Chose: ${player2Choice}` : '';

    if (winner === 'draw') {
        resultMessageEl.textContent = "It's a Draw! 🤝";
        resultMessageEl.style.backgroundColor = '#ffc107'; // Yellow
    } else if (winner === 'player1') {
        resultMessageEl.textContent = `${p1Title.textContent} Wins the Round! 🎉`;
        resultMessageEl.style.backgroundColor = '#28a745'; // Green
    } else if (winner === 'player2') {
        resultMessageEl.textContent = `${p2Title.textContent} Wins the Round! 😢`;
        resultMessageEl.style.backgroundColor = '#dc3545'; // Red
    } else {
        resultMessageEl.textContent = isTwoPlayerMode ? `Player ${currentPlayer}'s turn.` : 'Select your move to play.';
        resultMessageEl.style.backgroundColor = 'transparent';
    }
}

/** Resets choices and enables buttons for the next round. */
function resetRound() {
    player1Choice = null;
    player2Choice = null;
    currentPlayer = 1;

    // Enable all player buttons and clear active states
    choiceBtnsP1.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('active-choice');
    });
    choiceBtnsP2.forEach(btn => {
        btn.disabled = isTwoPlayerMode ? true : true; // P2 buttons are *only* for input in 2-player mode
        btn.classList.remove('active-choice');
    });

    if (isTwoPlayerMode) {
        // Only P1 buttons are initially active in two-player mode
        choiceBtnsP2.forEach(btn => btn.disabled = true);
    } else {
         // All P2 buttons are disabled in single-player mode
        choiceBtnsP2.forEach(btn => btn.disabled = true);
    }

    p1ChosenTextEl.textContent = '';
    p2ChosenTextEl.textContent = '';
    nextRoundBtn.classList.add('hidden');
    updateDisplay(null);
}

// --- Game Logic ---

/** Handles the final reveal, score update, and UI transition. */
function finishRound() {
    // 1. Determine Winner
    const winner = determineWinner(player1Choice, player2Choice);

    // 2. Update Score
    if (winner === 'player1') {
        player1Score++;
    } else if (winner === 'player2') {
        player2Score++;
    }

    // 3. Highlight the chosen moves
    choiceBtnsP1.forEach(btn => {
        if (btn.dataset.choice === player1Choice) {
            btn.classList.add('active-choice');
        }
        btn.disabled = true; // Disable all buttons
    });
    
    // Highlight P2's choice (either computer or human)
    choiceBtnsP2.forEach(btn => {
        if (btn.dataset.choice === player2Choice) {
            btn.classList.add('active-choice');
        }
        btn.disabled = true; // Disable all buttons
    });

    // 4. Update Display and show Next Round button
    updateDisplay(winner);
    nextRoundBtn.classList.remove('hidden');
}


/** Handler for player 1's choice. */
function handlePlayer1Choice(choice) {
    player1Choice = choice;

    // 1. Single Player Mode (vs. Computer)
    if (!isTwoPlayerMode) {
        player2Choice = getComputerChoice();
        finishRound();
        return;
    }

    // 2. Two Player Mode (P1 chosen, switch to P2's turn)
    currentPlayer = 2;
    resultMessageEl.textContent = "Player 2: Make your choice!";
    resultMessageEl.style.backgroundColor = '#007bff';

    // Disable P1 buttons, Enable P2 buttons
    choiceBtnsP1.forEach(btn => btn.disabled = true);
    choiceBtnsP2.forEach(btn => btn.disabled = false);

    // Show P1 choice is registered
    p1ChosenTextEl.textContent = 'Choice Registered!';
}

/** Handler for player 2's choice (only for Two Player Mode). */
function handlePlayer2Choice(choice) {
    if (!isTwoPlayerMode) return; // Should not happen

    player2Choice = choice;
    // P2 has chosen, finish the round
    finishRound();
}

// --- Event Listeners ---

// 1. Mode Selection Listeners
modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const mode = e.target.id;

        // Reset scores and choices
        player1Score = 0;
        player2Score = 0;
        
        if (mode === 'mode-single') {
            isTwoPlayerMode = false;
            player2Label.textContent = 'Computer';
            p2Title.textContent = 'Computer';
            // In single mode, P2 buttons remain disabled
        } else {
            isTwoPlayerMode = true;
            player2Label.textContent = 'Player 2';
            p2Title.textContent = 'Player 2';
        }
        
        player1Label.textContent = 'Player 1';
        p1Title.textContent = 'Player 1';

        // Hide mode selection and show game
        document.querySelector('.game-modes').classList.add('hidden');
        gameContainer.classList.remove('hidden');
        resetRound();
    });
});

// 2. Player Choice Listeners
choiceBtnsP1.forEach(btn => {
    btn.addEventListener('click', () => {
        handlePlayer1Choice(btn.dataset.choice);
    });
});

choiceBtnsP2.forEach(btn => {
    btn.addEventListener('click', () => {
        handlePlayer2Choice(btn.dataset.choice);
    });
});

// 3. Next Round Listener
nextRoundBtn.addEventListener('click', resetRound);

// Initialize display (scores, etc.)
updateDisplay(null);