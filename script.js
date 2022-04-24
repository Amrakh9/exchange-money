const fromPanel = document.querySelector('.from');
const toPanel = document.querySelector('.to');

const fromInput = fromPanel.querySelector('.calc-input-field');
const toInput = toPanel.querySelector('.calc-input-field');

const fromButtonList = fromPanel.querySelector('.calc-currency');
const toButtonList = toPanel.querySelector('.calc-currency');

const fromRate = fromPanel.querySelector('.calc-input-rate');
const toRate = toPanel.querySelector('.calc-input-rate');

const fromSelector = fromPanel.querySelector('select.calc-currency-item');
const toSelector = toPanel.querySelector('select.calc-currency-item');

// current state of currencies

const state = { from: 'RUB', to: 'USD', amount: 1 }



// Receiveing data from the server with query parameters immediately with the amount to be converted:

async function convert(from, to, amount) {
    const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}&places=4`);
    const data = await response.json();
    return [data.result, data.info.rate];
}

function activateButton(button) {
    button.classList.add('active');
}

function disableButton(button) {
    button.classList.remove('active');
}

function getActiveButton(buttonList) {
    return buttonList.querySelector('.active');
}

function getButtonByCurrency(currency, buttonList) {
    return buttonList.querySelector(`.calc-currency-item[value=${currency}]`);
}

function initialApp() {
    activateButton(getButtonByCurrency(state.from, fromButtonList));
    activateButton(getButtonByCurrency(state.to, toButtonList));
}
initialApp();


// Event handlers for inputs, currency selection buttons and selects

fromInput.addEventListener('input', async (event) => {
    let rate;
    let currencyFrom = fromButtonList.querySelector('.active').value;
    let currencyTo = toButtonList.querySelector('.active').value;
    [toInput.value, rate] = await convert(currencyFrom, currencyTo, event.target.value);

    fromRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo.toFixed(0)}`:  `1 ${currencyFrom} = ${rate} ${currencyTo}`; 
    toRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo.toFixed(0)}` : `1 ${currencyTo} = ${(1/ rate).toFixed(4)} ${currencyFrom}`;
})

toInput.addEventListener('input', async (event) => {
    let currencyFrom = fromButtonList.querySelector('.active').value;
    let currencyTo = toButtonList.querySelector('.active').value;
    [fromInput.value, rate] = await convert(currencyTo, currencyFrom, event.target.value);

    fromRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo.toFixed(0)}`:  `1 ${currencyFrom} = ${rate} ${currencyTo}`; 
    toRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo.toFixed(0)}` : `1 ${currencyTo} = ${(1/ rate).toFixed(4)} ${currencyFrom}`;

})

// Events that make buttons "active" when clicked:

fromButtonList.addEventListener('click', (event) => {
    if (event.target.classList.contains('calc-currency-item')) {
        disableButton(getActiveButton(fromButtonList));
        activateButton(event.target);
    }

})

toButtonList.addEventListener('click', (event) => {
    if (event.target.classList.contains('calc-currency-item')) {
        disableButton(getActiveButton(toButtonList));
        activateButton(event.target);
    }
})

// We check whether the selected control is a button or a select - and depending on this we calculate:

fromButtonList.addEventListener("click", async (event) => {
    if (event.target.tagName === "BUTTON") {
        let rate;
        let currencyFrom = event.target.value;
        let currencyTo = toButtonList.querySelector('.active').value;
        [toInput.value, rate] = await convert(currencyFrom, currencyTo, fromInput.value);


        // exchange rate

        fromRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}`:  `1 ${currencyFrom} = ${rate} ${currencyTo}`; 
        toRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}` : `1 ${currencyTo} = ${(1/ rate).toFixed(4)} ${currencyFrom}`;
    }
    
});

fromSelector.addEventListener("change", async (event) => {
    if (event.target.tagName === "SELECT") {
        let rate;
        let currencyFrom = event.target.value;
        let currencyTo = toButtonList.querySelector('.active').value;

        [toInput.value, rate] = await convert(currencyFrom, currencyTo, fromInput.value);

        // exchange rate

        fromRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}`:  `1 ${currencyFrom} = ${rate} ${currencyTo}`; 
        toRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}` : `1 ${currencyTo} = ${(1/ rate).toFixed(4)} ${currencyFrom}`;

    }
    
})



toButtonList.addEventListener("click", async (event) => {

    if (event.target.tagName === "BUTTON") {
        let currencyFrom = event.target.value;
        let currencyTo = fromButtonList.querySelector('.active').value;
        [toInput.value, rate] = await convert(currencyTo, currencyFrom, fromInput.value);

        // exchange rate

        fromRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}`:  `1 ${currencyFrom} = ${rate} ${currencyTo}`; 
        toRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}` : `1 ${currencyTo} = ${(1/ rate).toFixed(4)} ${currencyFrom}`;

    }
});


toSelector.addEventListener("change", async (event) => {
    if (event.target.tagName === "SELECT") {
        let currencyFrom = event.target.value;
        let currencyTo = fromButtonList.querySelector('.active').value;

        [toInput.value, rate] = await convert(currencyTo, currencyFrom, fromInput.value);

        // exchange rate

        fromRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}`:  `1 ${currencyFrom} = ${rate} ${currencyTo}`; 
        toRate.innerText = (currencyFrom === currencyTo) ? `1 ${currencyFrom} = 1 ${currencyTo}` : `1 ${currencyTo} = ${(1/ rate).toFixed(4)} ${currencyFrom}`;

    }
});



// Request to get all currency options from the server:
async function getCurrency() {
    const resp = await fetch("https://api.exchangerate.host/latest")
    const data = await resp.json()
    return data;
}

//Getting data from the server
getCurrency()
    .then((data) => {
        const currencyArr = Object.keys(data.rates);
        renderSelect(currencyArr, fromSelector);
        renderSelect(currencyArr, toSelector);
    })

// Draw selectors based on data from the server: *https://javascript.info/form-elements

function renderSelect(arr, whereToAppend) {
    arr.forEach(element => {
        let option = new Option(`${element}`, `${element}`);
        whereToAppend.append(option);
    });
}