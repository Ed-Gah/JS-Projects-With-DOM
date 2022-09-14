"use-strict";

/* TODO 
  1. add sound winning sound to the game
  2. add wining message to the game
  3. add inputs for players name to the game */

// BUG game background doesn't reset when new game button is pressed
//Selecting elements

const player0Element = document.querySelector(".player--0");
const player1Element = document.querySelector(".player--1");
const score0Element = document.querySelector("#score--0");
const score1Element = document.getElementById("score--1");
const current0Element = document.getElementById("current--0");
const current1Element = document.getElementById("current--1");
const diceElement = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

let scores, currentScore, activePlayer, playing;

//Initilial content
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0Element.textContent = 0;
  score1Element.textContent = 0;
  current0Element.textContent = 0;
  current1Element.textContent = 0;

  diceElement.classList.add("hidden");
  player0Element.classList.remove("player--winner");
  player1Element.classList.remove("player--winner");
  player0Element.classList.add("player--active");
  player1Element.classList.remove("player-active");
};

init();

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;
  //add the class if isn't there or remove it if its there.
  player0Element.classList.toggle("player--active");
  player1Element.classList.toggle("player--active");
};
//the rolling dice functionality

btnRoll.addEventListener("click", function () {
  if (playing) {
    //1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    //2. Display dice
    diceElement.classList.remove("hidden");
    diceElement.src = `dice${dice}.png`;

    //3. chech for rolled1: if true, switch to next player
    if (dice !== 1) {
      // Add dice number to current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
      console.log("active player ", activePlayer);
    } else {
      // Switch to next player
      switchPlayer();
    }
  }
});

//When user clicks the hold button
btnHold.addEventListener("click", function () {
  if (playing) {
    //1. add current score to the score of active player
    scores[activePlayer] += currentScore;
    // scores[1] = scores[1] + currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //2. check if score is at least 100 (>=100)
    if (scores[activePlayer] >= 100) {
      // Finish the game
      playing = false;
      diceElement.classList.add("hidden");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
    }

    //3. if not switch the players
    switchPlayer();
  }
});

//Resetting the pick game;
btnNew.addEventListener("click", init);
