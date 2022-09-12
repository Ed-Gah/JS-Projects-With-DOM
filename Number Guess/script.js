"use strict";
//Global verables.
//secret number

// TODO Imbeed sound in the guess number game

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highScore = 0;

//Message display function
const displayMessage = (message) => {
  document.querySelector(".message").textContent = message;
};

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);
  console.log(guess);
  //When there is no input
  if (!guess) {
    displayMessage("No number!");
    //when play wins
  } else if (guess === secretNumber) {
    displayMessage("Correct Number :)");
    document.querySelector(".number").textContent = secretNumber;
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.fontSize = "3rem";

    //check highScore
    if (score > highScore) {
      highScore = score;
      document.querySelector(".highscore").textContent = highScore;
    }
    //when guess is too high
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? "Too high!!" : "Too low!!");
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      displayMessage("You lose the game!");
      document.querySelector(".score").textContent = 0;
    }
  }
});

//Reseting the game
document.querySelector(".again").addEventListener("click", function () {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  displayMessage("Start guessing....");
  document.querySelector(".number").textContent = "?";
  document.querySelector(".score").textContent = score;
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
  document.querySelector(".guess").value = "";
});
