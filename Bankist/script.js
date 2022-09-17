"use strict";

//Data
const account1 = {
  owner: "Edwin Gah",
  movements: [200, 4500, -300, 3200, -543, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Rouclec Assonganyi",
  movements: [5000, 2500, -200, 300, -5403, 700, 5300, -90],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Evaristus Tambua",
  movements: [200, 400, -200, -20, -540, 50, -90],
  interestRate: 0.7,
  pin: 3333,
};
const account4 = {
  owner: "Alain Fortune",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const continerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");

const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan--amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  //empty movement contianer before adding elements
  continerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //display the sorted array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "widrawal";
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}F</div>
         </div>`;
    //  Adding html elements to div movement
    continerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

//Calculating and displaying the balance
const calDisplayBalance = function (acc) {
  //creating an account property on accounts object
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}F`;
};
// calDisplayBalance(account1.movements);

const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}F`;

  const outgoing = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoing)}F`;

  //Pineline chaining
  //Calculating the interest rates
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}F`;
};
// calDisplaySummary(account1.movements);

const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    //creating a username property on accounts
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name.at(0))
      .join("");
  });
};
creatUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display Balance
  calDisplayBalance(acc);

  // Display Summary
  calDisplaySummary(acc);
};

// Event handlers

// Global variables
let currentAccount;
let sorted = false;
// In html a button in a form element when click reloads the page
btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  //Transfer process
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  //Transfer check
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  //any is a good usecase for some()
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    //Delete element in an array;
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted
});

// challenge 1 on array
// const checkDogs = function (dogsJulia, dogsKate) {
//   //removing the first and second to the last element of dogsJulia array
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`${i + 1} is an adult`);
//     } else {
//       console.log(`${i + 1} is a puppy`);
//     }
//   });
// };

//map filter and reduce methods of arrays (maps returns the array's copy)
//returns a new array base on the original array
//reduce boil down all the element of the original array to 1 single value
//eg adding up all the numbers in the array.
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov, i) {
//   return mov * eurToUsd;
// });

// const movementArr = movements.map((mov) => mov * eurToUsd);

//filter method example
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);
// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

//reduce method.

// const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 300);
// // console.log(balance);

// const balanceArr = movements.reduce((acc, cur) => acc + cur, 400);
// // console.log(balanceArr);

//coding challenge2
// const calcAverageHumanAge = (ages) =>
//   //solution with arrow function with chaining and pipelining methodes (map, filter, reduce)
//   ages
//     .map((age) => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter((age) => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//1.
//   const humanAges = ages.map(function (age, i) {
//     return age <= 2 ? age * 2 : 16 + age * 4;
//   });
//   console.log(humanAges);
//   //2.
//   const includedDogs = humanAges.filter((age) => {
//     return age >= 18;
//   });
//   //3.
//   const average =
//     includedDogs.reduce((acc, age) => acc + age, 0) / includedDogs.length;
//   return average;

//4.
// const av1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const av2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(av1, av2);

//Its not advicable to chain splice method in an array.

// const movements = [200, 400, -200, -20, -540, 50, -90];
// //find method returns the first element that match the condition
// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(firstWithdrawal);
// const account = accounts.find((acc) => acc.owner === "Evaristus Tambua");
// console.log(account);
// for (const account of accounts) {
//   account.owner === "Evaristus Tambua" && console.log(account);
// }

// include methods check an array base on equality
// some method check and array based on some condition
// console.log(movements.some((mov) => mov > 0));

// // every method returns true if all the arry element passes the test
// console.log(movements.every((mov) => mov > 0));

// //Separate callback
// const deposit = (mov) => mov > 0;
// console.log(movements.some(deposit));

// //flat and flatMap method
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// const arrDeep = [[[1, 2], 3], [4, 5, 6], 7, 8];
// console.log(arr.flat(1));

// const overalBal = accounts
//   .map((acc) => acc.movements)
//   .flat(1)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBal);

// sort method
// string
const owners = ["Edwin", "Gah", "Chu"];
console.log(owners.sort());

// return < 0, a, before b (keep order)
// retrun > 0, b, before a (switch order)

//accending
// account1.movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(account1.movements);

// //decending
// account1.movements.sort((a, b) => {
//     if (a > b) return -1;
//     if (b > a) return 1;
//   });

account1.movements.sort((a, b) => b - a);
console.log(account1.movements);
