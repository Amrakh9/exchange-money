const currencyOne = document.querySelectorAll('#currency1'); /*left buttons*/
const currencyTwo = document.querySelectorAll('#currency2'); /*right buttons*/
const inputOne = document.querySelector('#input1'); /*left input*/
const inputTwo = document.querySelector('#input2'); /*right input*/
const exchangeOne = document.querySelector('#exchange1'); /*left exchange*/
const exchangeTwo = document.querySelector('#exchange2'); /*right exchange*/

let one = 'RUB'; /*left selected currency*/
let two = 'USD'; /*right selected currency*/
let sum = inputOne.value = 1; /*left input current value*/
let sumTwo = inputTwo.value; /*right input current value*/
let bool = true;

inputOne.addEventListener('keyup', result);
inputTwo.addEventListener('keyup', result);
inputOne.addEventListener('click', rev);
inputTwo.addEventListener('click', revTwo);

function rev() {
    bool = true;
};

function revTwo() {
    bool = false;
};

/* left side default selection */
currencyOne.forEach((currencyOne) => {
    if (currencyOne.innerText == one) {
        currencyOne.style.background = '#833AE0';
        currencyOne.style.color = '#FFFFFF';
    }
    currencyOne.addEventListener('click', clickButtonCurrencyOne);
});

/* right side default selection */
currencyTwo.forEach((currencyTwo) => {
    if (currencyTwo.innerText == two) {
        currencyTwo.style.background = '#833AE0';
        currencyTwo.style.color = '#FFFFFF';
    }
    currencyTwo.addEventListener('click', clickButtonCurrencyTwo);
});

/*left side click actions */
function clickButtonCurrencyOne(event) {
    currencyOne.forEach((currencyOne) => {
        if (currencyOne.style.background !== '') {
            currencyOne.style.background = '';
            currencyOne.style.color = '#C6C6C6';
        }
    });
    event.target.style.background = '#833AE0';
    event.target.style.color = '#FFFFFF';
    one = event.target.innerText;
    result();
}

/*right side click actions */
function clickButtonCurrencyTwo(event) {
    currencyTwo.forEach((currencyTwo) => {
        if (currencyTwo.style.background !== '') {
            currencyTwo.style.background = '';
            currencyTwo.style.color = '#C6C6C6';
        }
    });
    event.target.style.background = '#833AE0';
    event.target.style.color = '#FFFFFF';
    two = event.target.innerText;
    result();
}

function result() {
    sum = inputOne.value;
    sumTwo = inputTwo.value;
    converter();
}

function converter() {
    /* Update of exchanges */
    let urlTwo = `https://api.exchangerate.host/convert?from=${one}&to=${two}&amount=1`;
    fetch(urlTwo)
        .then(res => res.json())
        .then(data => {
            exchangeOne.innerText = `1 ${one} = ${data.result.toFixed(4)} ${two}`;
        })
    let urlThree = `https://api.exchangerate.host/convert?from=${two}&to=${one}&amount=1`;
    fetch(urlThree)
        .then(res => res.json())
        .then(data => {
            exchangeTwo.innerText = `1 ${two} = ${data.result.toFixed(4)} ${one}`;
        })

    /* Convert operation */

    if (one == two && bool == true) {
        inputTwo.value = inputOne.value;
        return;
    } else if (one == two && bool == false) {
        inputOne.value = inputTwo.value;
        return;
    } else {
        if (bool == true) {
            let url = `https://api.exchangerate.host/convert?from=${one}&to=${two}&amount=${sum}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    inputTwo.value = data.result.toFixed(4);
                })
                .catch((err) => {
                    alert('Something went wrong!');
                })
        } else {
            let url = `https://api.exchangerate.host/convert?from=${two}&to=${one}&amount=${sumTwo}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    inputOne.value = data.result.toFixed(4);
                })
                .catch((err) => {
                    alert('Something went wrong!');
                })
        }
    }
}
converter();