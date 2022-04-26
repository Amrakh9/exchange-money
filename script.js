const currencyOne = document.querySelectorAll('#currency1'); /*left buttons*/
const currencyTwo = document.querySelectorAll('#currency2'); /*right buttons*/
const inputOne = document.querySelector('#input1'); /*left input*/
const inputTwo = document.querySelector('#input2'); /*right input*/
const exchangeOne = document.querySelector('#exchange1'); /*left exchange*/
const exchangeTwo = document.querySelector('#exchange2'); /*right exchange*/

let one = 'RUB'; /*left selected currency*/
let two = 'USD'; /*right selected currency*/
let bool = true;

inputOne.value = 1;
inputOne.addEventListener('keyup', converter);
inputTwo.addEventListener('keyup', converter);
inputOne.addEventListener('click', () => bool = true);
inputTwo.addEventListener('click', () => bool = false);

currencyOne.forEach((currencyOne) => {
    if (currencyOne.innerText == one) {
        currencyOne.style.background = '#833AE0';
        currencyOne.style.color = '#FFFFFF';
    }
    currencyOne.addEventListener('click', clickButtonCurrencyOne);
});

currencyTwo.forEach((currencyTwo) => {
    if (currencyTwo.innerText == two) {
        currencyTwo.style.background = '#833AE0';
        currencyTwo.style.color = '#FFFFFF';
    }
    currencyTwo.addEventListener('click', clickButtonCurrencyTwo);
});

function clickButtonCurrencyOne(event) { /*left side click actions */
    currencyOne.forEach((currencyOne) => {
        if (currencyOne.style.background !== '') {
            currencyOne.style.background = '';
            currencyOne.style.color = '#C6C6C6';
        }
    });
    event.target.style.background = '#833AE0';
    event.target.style.color = '#FFFFFF';
    one = event.target.innerText;
    converter();
}

function clickButtonCurrencyTwo(event) { /*right side click actions */
    currencyTwo.forEach((currencyTwo) => {
        if (currencyTwo.style.background !== '') {
            currencyTwo.style.background = '';
            currencyTwo.style.color = '#C6C6C6';
        }
    });
    event.target.style.background = '#833AE0';
    event.target.style.color = '#FFFFFF';
    two = event.target.innerText;
    converter();
}

function converter() {
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
    if (one == two) {
        if (bool == true) {
            inputTwo.value = inputOne.value;
            return;
        } else {
            inputOne.value = inputTwo.value;
            return;
        }
    } else {
        if (bool == true) {
            let url = `https://api.exchangerate.host/convert?from=${one}&to=${two}&amount=${inputOne.value}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (inputOne.value == '') {
                        inputTwo.value = '';
                    } else {
                        inputTwo.value = data.result.toFixed(4);
                    }
                })
                .catch((err) => {
                    alert('Something went wrong!');
                })
        } else {
            let url = `https://api.exchangerate.host/convert?from=${two}&to=${one}&amount=${inputTwo.value}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (inputTwo.value == '') {
                        inputOne.value = '';
                    } else {
                        inputOne.value = data.result.toFixed(4);
                    }
                })
                .catch((err) => {
                    alert('Something went wrong!');
                })
        }
    }
}
converter();