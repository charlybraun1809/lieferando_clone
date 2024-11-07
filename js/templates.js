function getDishesTemplate(filteredDishes, indexDish) {
    return `
    <div class="dishDiv">
        ${filteredDishes[indexDish].name} 
        <img src="Material/Img/plus.png" onclick="addToBasket('${filteredDishes[indexDish].name}'); showAddedMessage()" class="plus"><br>
        ${filteredDishes[indexDish].price} €<br>
        ${filteredDishes[indexDish].description}<br>
    </div>
    `;
}

function getBasketTemplate(basketindex, dish, amount, price,) {
    let contentWrapper = document.getElementsByClassName('contentWrapper')[0];
    if (contentWrapper.offsetWidth >= 430) {
        return `
        <div class = "basketDish">
            ${dish}<br>
            <div class = "amountDiv">
            <img src = "Material/Img/minus.png" onclick = "decreaseAmountAndPrice(${basketindex})"class = "minusBasket"></img>
             ${amount} x
             <img src = "Material/Img/plus.png" onclick = "increaseAmount(${basketindex})" class = "plusBasket"></img> 
            ${price.toFixed(2)} €
            <img src = "Material/Img/delete.png" onclick = "deleteDish(${basketindex})"class = "trash"></img>
            </div>
            </div>
    `
    } else {
        let tableBasket = document.getElementsByClassName('table_basket')[0];
        if (!tableBasket) {
            return `
        <table class="table_basket"></table>`
        }
        return '';
    }
}

function getRenderedBasketTemplate(indexDish, dish, amount, price) {
    let tableRef = document.getElementsByClassName('table_basket')[0];
    if (!tableRef) {
        return;
    }
    return `
    <tr>
        <td>${dish}</td>
        <td><img src="Material/Img/minus.png" onclick="decreaseAmountAndPrice(${indexDish})" class="minusBasket"></img></td>
        <td>${amount} x</td>
        <td><img src="Material/Img/plus.png" onclick="increaseAmount(${indexDish})" class="plusBasket"></img></td>
        <td>${price} €</td>
        <td><img src="Material/Img/delete.png" onclick="deleteDish(${indexDish})" class="trash"></img></td>
    </tr>`;
}
