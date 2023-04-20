'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-25T07:42:02.383Z',
    '2023-01-07T09:15:04.904Z',
    '2023-01-19T10:17:24.185Z',
    '2023-02-23T16:33:06.386Z',
    '2023-03-11T14:43:26.374Z',
    '2023-04-13T18:49:59.371Z',
    '2023-04-17T12:01:20.894Z',
  ],
  currency: 'KSH',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-10-04T21:31:17.178Z',
    '2022-12-29T07:42:02.383Z',
    '2023-01-02T09:15:04.904Z',
    '2023-01-26T10:17:24.185Z',
    '2023-02-11T16:33:06.386Z',
    '2023-02-21T14:43:26.374Z',
    '2023-04-15T18:49:59.371Z',
    '2023-04-17T12:01:20.894Z',
  ],
  currency: 'KSH',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2023-01-06T21:31:17.178Z',
    '2023-01-28T07:42:02.383Z',
    '2023-01-30T09:15:04.904Z',
    '2023-02-15T10:17:24.185Z',
    '2023-02-23T16:33:06.386Z',
    '2023-03-04T14:43:26.374Z',
    '2023-03-13T18:49:59.371Z',
    '2023-04-21T12:01:20.894Z',
  ],
  currency: 'KSH',
  locale: 'en-US',
};

const account4 = {
  owner: 'Gerald Fitza',
  movements: [258, 2000, 400, 150, 590],
  interestRate: 1,
  pin: 5555,

  movementsDates: [
    '2023-01-05T21:31:17.178Z',
    '2022-01-21T07:42:02.383Z',
    '2023-02-03T09:15:04.904Z',
    '2023-02-15T10:17:24.185Z',
    '2023-02-28T16:33:06.386Z',
    '2023-03-11T14:43:26.374Z',
    '2023-04-08T18:49:59.371Z',
    '2023-04-19T12:01:20.894Z',
  ],
  currency: 'KSH',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

//// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////Functions

function formatMovementsDate(date, locale) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

function createUsernames(acc) {
  acc.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

createUsernames(accounts);

function updateUI(curr) {
  //Display movements
  displayMovements(curr);

  // Display balance
  calcDisplayBalance(curr);

  // Display summary
  calcDisplaySummary(curr);
}

function startLogOutTimer() {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // Each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When t=0s, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease by 1s
    time--;
  };

  // Set Time to 10 mins
  let time = 600;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
}

/////EVENT HANDLERS///////

let curAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  curAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(curAccount);
  if (curAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back ${curAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Display Date
    const now = new Date();
    const options = {
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      curAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(curAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    curAccount.balance >= amount &&
    receiverAcc?.username !== curAccount.username
  ) {
    // Doing the transfer
    curAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Transfer date
    curAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(curAccount);
  }
  // Clear input fields
  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  //Reset Timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && curAccount.movements.some(mov => mov > amount * 0.1)) {
    setTimeout(function () {
      curAccount.movements.push(amount);

      curAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(curAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';

  //Reset Timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === curAccount.username &&
    +inputClosePin.value === curAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === curAccount.username
    );

    //Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear input fields
  inputClosePin.value = '';
  inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(curAccount, !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
