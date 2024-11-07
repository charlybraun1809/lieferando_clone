let subtotal = 0;
let totalPrice = 0;
let deliveryCosts = 5;

function renderAllDishes() {
    renderMainDishes();
    renderSideDishes();
    renderDesserts();
    responsiveBasket();
}

function renderMainDishes() {
    let contentRef = document.getElementById('contentDishes');
    let filteredMainDishes = myDishes.filter((element) => element['category'] === 'mainDishes');
    for (let indexDish = 0; indexDish < filteredMainDishes.length; indexDish++) {
        contentRef.innerHTML += getDishesTemplate(filteredMainDishes, indexDish);
    }
}

function renderSideDishes() {
    let contentRef = document.getElementById('contentSideDishes');
    let filteredSideDishes = myDishes.filter((element) => element['category'] === 'sideDishes');
    for (let indexDish = 0; indexDish < filteredSideDishes.length; indexDish++) {
        contentRef.innerHTML += getDishesTemplate(filteredSideDishes, indexDish);
    }
}

function renderDesserts() {
    let contentRef = document.getElementById('contentDesserts');
    let filteredDesserts = myDishes.filter((element) => element['category'] === 'desserts');
    for (let indexDish = 0; indexDish < filteredDesserts.length; indexDish++) {
        contentRef.innerHTML += getDishesTemplate(filteredDesserts, indexDish);
    }
}

function renderResponsiveBasket() {
    let tableRef = document.getElementsByClassName('table_basket')[0];
    if (!tableRef) {
        return;
    }
    tableRef.innerHTML = "";
    for (let indexDish = 0; indexDish < basketArr.length; indexDish++) {
        let dish = basketArr[indexDish];
        if (dish.amount > 0) {
            let dish = basketArr[indexDish].name;
            let amount = basketArr[indexDish].amount;
            let price = basketArr[indexDish].price;
            tableRef.innerHTML += getRenderedBasketTemplate(indexDish, dish, amount, price);
        }
    }
}

function toggleDelivery() {
    let toggle = document.getElementById('toggleDelivery').checked;

    if (basketArr != '') {
        totalPrice += toggle ? -deliveryCosts : deliveryCosts;
    }

    if (toggle) {
        localStorage.setItem('toggleState', 'checked');
    } else {
        localStorage.setItem('toggleState', 'unchecked');
    }
    saveToLocalStorage();
    renderBasket();
}

function responsiveBasket() {
    let contentRef = document.getElementById('content');
    
    if (contentRef.offsetWidth <= 430) {
        let responsiveBasketHTML = `
            <div class="lowerBasket" onclick="openBasket()">
                <div id="burger-menu">
                <img src="Material/Img/shopping-cart.png" alt="" class="basketImg"></div>
            </div>
        `;
        contentRef.innerHTML += responsiveBasketHTML;
    }
}

function openBasket() {
    let responsiveBasket = document.getElementsByClassName('basketWrapper')[0];
    let lowerBasket = document.getElementsByClassName('lowerBasket')[0];

    if (responsiveBasket.classList.contains('visible')) {
        responsiveBasket.classList.remove('visible');
        lowerBasket.classList.remove('stickyBasket');
    } else {
        responsiveBasket.classList.add('visible');
        lowerBasket.classList.add('stickyBasket');
    }
}

function addToBasket(dishName) {
    let newDish = myDishes.find(dish => dish.name === dishName);
    let basketIndex = basketArr.findIndex(dish => dish.name === newDish.name);

    if (basketArr.length === 0 || basketIndex === -1) {
        basketArr.push(newDish);
    } else {
        basketArr[basketIndex].amount += 1;
    }

    subtotal += newDish.price;
    totalPrice = subtotal + deliveryCosts;

    saveToLocalStorage();
    renderBasket();
}

function renderBasket() {
    let basketRef = document.getElementsByClassName('basket')[0];
    basketRef.innerHTML = "";

    for (let basketindex = 0; basketindex < basketArr.length; basketindex++) {
        let dish = basketArr[basketindex];
        if (dish.amount > 0) {
            let dish = basketArr[basketindex].name;
            let amount = basketArr[basketindex].amount;
            let price = basketArr[basketindex].price;
            basketRef.innerHTML += getBasketTemplate(basketindex, dish, amount, price);
        }
    }
    renderResponsiveBasket();
    renderBasketSummary(basketRef);
}


function renderBasketSummary(basketRef) {
    const summaryHTML = `
        <div class="seperator_basket"></div>
        <div class="subtotal">Subtotal Price: ${subtotal.toFixed(2)} €</div>
        <div class="deliveryCosts">Delivery costs: ${deliveryCosts.toFixed(2)} €</div>
        <div class="totalPrice">Total Price: ${totalPrice.toFixed(2)} €</div>
        <div class="orderButtonDiv">
            <button class="orderButton" onclick="order()">Order</button>
        </div>
    `;

    basketRef.innerHTML += summaryHTML;
}

function increaseAmount(i) {
    basketArr[i].amount += 1;
    increasePrice(i);
    saveToLocalStorage();
    renderBasket();
}

function increasePrice(indexPrice) {
    let priceForOne = basketArr[indexPrice].price;
    subtotal += priceForOne;
    totalPrice += priceForOne;

    saveToLocalStorage();
}

function decreaseAmountAndPrice(i) {
    let priceForOne = basketArr[i].price;
    if (basketArr[i].amount > 1) {
        basketArr[i].amount -= 1;
        subtotal -= priceForOne;
        totalPrice -= priceForOne;
    } else {
        subtotal -= priceForOne;
        totalPrice -= priceForOne;
        basketArr[i].amount = 0;
        basketArr.splice(i, 1);
        totalPrice = basketArr == 0 ? 0 : totalPrice;
    }
    saveToLocalStorage();
    renderBasket();
}

function deleteDish(i) {
    subtotal -= basketArr[i].price * basketArr[i].amount;
    totalPrice -= basketArr[i].price * basketArr[i].amount;
    basketArr[i].amount = 0;
    basketArr.splice(i, 1);
    totalPrice = basketArr == 0 ? 0 : totalPrice;

    saveToLocalStorage();
    renderBasket();
}

function order() {
    let basketWrapperRef = document.getElementsByClassName('basketWrapper')[0];
    let lowerBasketRef = document.getElementsByClassName('lowerBasket')[0];
    lowerBasketRef.classList.remove('stickyBasket');
    basketWrapperRef.classList.remove('visible');

    basketArr = [];
    subtotal = 0;
    totalPrice = 0;
    showOrderMessage();
    saveToLocalStorage();
    renderBasket();
}

function saveToLocalStorage() {
    localStorage.setItem('dish', JSON.stringify(basketArr));
    localStorage.setItem('subtotal', JSON.stringify(subtotal));
    localStorage.setItem('totalprice', JSON.stringify(totalPrice));
    renderBasket();
}

function getFromLocalStorage() {
    let storedDishes = JSON.parse(localStorage.getItem('dish'));
    let storedSubtotalPrice = JSON.parse(localStorage.getItem('subtotal'));
    let storedTotalPrice = JSON.parse(localStorage.getItem('totalprice'));
    let storedToggleState = localStorage.getItem('toggleState');

    if (storedDishes) basketArr = storedDishes;
    if (storedSubtotalPrice) subtotal = storedSubtotalPrice;
    if (storedTotalPrice) totalPrice = storedTotalPrice;

    let toggle = document.getElementById('toggleDelivery');
    if (storedToggleState === 'checked') {
        toggle.checked = true;
    } else {
        toggle.checked = false;
    }
    renderBasket();
}

function init() {
    getFromLocalStorage();
    renderAllDishes();
    renderBasket();
    renderResponsiveBasket();
}

function showAddedMessage() {
    let messageBox = document.getElementById('messageBox');
    messageBox.classList.add('show');

    setTimeout(function () {
        messageBox.classList.remove('show');
        messageBox.classList.add('hidden');
    }, 2000);
}

function showOrderMessage() {
    let dishAvailable = localStorage.getItem('dish');
    if (dishAvailable !== '[]') {
    let messageBox2 = document.getElementById('messageBox2');
    messageBox2.classList.add('show');

    setTimeout(function () {
        messageBox2.classList.remove('show');
        messageBox2.classList.add('hidden');
    }, 2000);
}
}

