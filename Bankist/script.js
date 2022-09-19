"use strict";

//Data
// const account1 = {
//   owner: "Edwin Gah",
//   movements: [200, 4500, -300, 3200, -543, 70, 1300],
//   interestRate: 1.2,
//   pin: 1111,
// };

// const account2 = {
//   owner: "Rouclec Assonganyi",
//   movements: [5000, 2500, -200, 300, -5403, 700, 5300, -90],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Evaristus Tambua",
//   movements: [200, 400, -200, -20, -540, 50, -90],
//   interestRate: 0.7,
//   pin: 3333,
// };
// const account4 = {
//   owner: "Alain Fortune",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// ================== Different Data! Contains movement dates, currency and locale ===============
const account1 = {
  owner: "Edwin Gah",
  movements: [200.12, 4500.76, -300, 3200.65, -543.4, 70.3, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    "2022-09-16T21:31:17.178Z",
    "2022-09-17T07:31:17.178Z",
    "2022-09-18T07:21:12.904Z",
    "2022-09-01T10:17:24.185Z",
    "2020-05-27T14:11:29.178Z",
    "2022-05-27T14:11:29.178Z",
    "2022-01-28T07:21:12.904Z",
    "2022-09-09T07:21:12.904Z",
  ],
  currency: "XAF",
  locale: "pt-PT",
};

const account2 = {
  owner: "Rouclec Asonganyi",
  movements: [5000, 2500, -200, 300, -5403, 700, 5300, -90],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T13:31:33.178Z",
    "2019-12-23T09:31:16.178Z",
    "2020-01-28T06:21:23.904Z",
    "2020-04-01T17:17:46.185Z",
    "2020-05-27T11:11:06.178Z",
    "2022-05-27T14:11:26.178Z",
    "2022-01-28T18:21:59.904Z",
    "2022-01-28T12:21:20.904Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

//=========================== Functions =======================

//=================== movements dates =========================
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 3600 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};

// ======================= Format Currency ======================
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//========================== Logout timer =======================
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when time is 0s, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Login to get started";
      containerApp.style.opacity = 0;
    }

    // decrease time by 1s
    time--;
  };
  // set time to 5 minutes
  let time = 100;
  // call the timer ever second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//===================== Movements Display =======================
const displayMovements = function (acc, sort = false) {
  //empty movement contianer before adding elements
  continerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //display the sorted array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "widrawal";

    // Date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    console.log(displayDate);

    const formatedMovementAmount = formatCur(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formatedMovementAmount}</div>
         </div>`;
    //  Adding html elements to div movement
    continerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//======================== Calculating and displaying the balance ==================
const calDisplayBalance = function (acc) {
  //creating an account property on accounts object
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  //`${acc.balance.toFixed(2)}F`;
};

//==================== calculating summery for accounts=================
const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  //`${incomes.toFixed(2)}F`;

  const outgoing = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outgoing),
    acc.locale,
    acc.currency
  );
  //`${Math.abs(outgoing.toFixed(2))}F`;

  //Pineline chaining
  //Calculating the interest rates
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
  //`${interest.toFixed(2)}F`;
};

//============  getting usernames ============
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
  displayMovements(acc);

  // Display Balance
  calDisplayBalance(acc);

  // Display Summary
  calDisplaySummary(acc);
};

//======================== Event handlers =======================

// Global variables
let currentAccount, timer;
let sorted = false;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//TODO check out iso languages

// In html a button in a form element when click reloads the page

//====================== Login handler ===========================
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

    // Create current date and time
    const now = new Date();
    const dateOptions = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };

    // locale coming from the browser
    const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      dateOptions
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // start timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  //Transfer process
  const amount = Math.round(Number(inputTransferAmount.value));
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

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
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
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
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
  sorted = !sorted;
});

// Practice.
// const future = new Date(2037, 10, 19, 15, 23);

// const calcDaysPassed = (date1, date2) => (date2 - date1) / (1000 * 3600 * 24);

// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);

//Formating numbers

//TODO check on Intl formater for dates and numbers
// const num = 3084985.23;
// const options = {
//   // unit, percent or currency
//   // the currency is not depending by the local so it should be defined manually
//   style: "unit",
//   unit: "mile-per-hour",
// };
// console.log("This the US formater", new Intl.NumberFormat("en-US").format(num));
// console.log(
//   "This the Germany formater",
//   new Intl.NumberFormat("de-DE").format(num)
// );
// console.log(
//   "This the Syria formater",
//   new Intl.NumberFormat("ar-SY").format(num)
// );
// console.log("This the US formater", new Intl.NumberFormat("en-US").format(num));

// Timers
//==================== setTimeout() ========================

// const ingredients = ["olives", "spinach"];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`'Here is your pizza' with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );
// console.log("Waiting....");

// //Clearing the set timeout function
// if (ingredients.includes("spinach")) clearTimeout(pizzaTimer);

//====================== setInterval() =====================
// setInterval(function () {
//   const now = new Date();
//   // console.log(now);
// }, 3000);
