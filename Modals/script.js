"use strict";

// Select the element needed and store in variables

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll(".show-modal");

//Open the modal

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//Closing the modal
const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

//Handling key press events.

document.addEventListener("keydown", function (e) {
  // checking if an element has a certain class
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
