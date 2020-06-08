let shopCart = [];
let productList = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let currency = urlParams.get('currency');

if (currency == null) {
    currency = "USD"
}
else {
    document.getElementById("currency").value = currency;
}

async function getData() {
    var response = await fetch('http://private-32dcc-products72.apiary-mock.com/product')
        .then(response => response.json())
        .then(data => data.slice().sort((a, b) => b.price - a.price)) // sorted prices
        .then(data => productList = data)
        .then(data => {
            // console.log(data)
            //addData(data)
            changeSelectValue();
        }
        )
}


getData();

function addData(data) {
    data.forEach(element => {
        let div = document.createElement('div')
        div.classList.add('box')
        div.classList.add('row')
        div.id = element.id;

        let divPrName = document.createElement('div')
        divPrName.classList.add("productName")
        divPrName.classList.add("col-md-4")

        let labelName = document.createElement('label')
        labelName.innerHTML = element.name
        divPrName.appendChild(labelName)

        div.appendChild(divPrName)
        document.getElementsByClassName("card")[0].appendChild(div)

        let divPrice = document.createElement('div')
        divPrice.classList.add("price")
        divPrice.classList.add("col-md-4")

        let labelPrice = document.createElement("label")
        let labelPriceTag = document.createElement("label")
        labelPriceTag.innerHTML = "Price:"
        divPrice.appendChild(labelPriceTag)
        labelPrice.innerHTML = element.price
        divPrice.appendChild(labelPrice)
        div.appendChild(divPrice)

        let buttonAdd = document.createElement("button")
        buttonAdd.classList.add("fa")
        buttonAdd.classList.add("fa-shopping-cart")
        buttonAdd.classList.add("btn")
        buttonAdd.classList.add("btn-success")
        buttonAdd.classList.add("col-md-4")
        buttonAdd.innerHTML = "add to Cart"
        buttonAdd.addEventListener('click', function (e) {
            addToCart(element.id)
        })
        div.appendChild(buttonAdd)

    });
}

function addToCart(id) {

    productList.forEach(element => {
        if (element.id === id) {
            shopCart.push(element);
        }

    })
    let index = productList.map(function (e) { return e.id; }).indexOf(id);
    productList.splice(index, 1);


    let productBox = document.getElementById(id);
    productBox.parentNode.removeChild(productBox);

    if (shopCart.length == 1) {
        createShop();
    }
    else if (shopCart.length > 1) {
        addProductToTable();
    }
}

function createShop() {
    let shopTitle = document.getElementsByClassName("shopTitle")[0];
    shopTitle.innerHTML = "Products in your shopping cart";

    let shopTable = document.createElement("table");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    let th3 = document.createElement("th");
    let th4 = document.createElement("th");
    th1.innerHTML = "Products";
    th2.innerHTML = "Quantity";
    th3.innerHTML = "Value";
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    thead.appendChild(tr);
    shopTable.appendChild(thead);

    let tbody = document.createElement("tbody");
    shopTable.appendChild(tbody);

    document.getElementsByClassName("card")[1].appendChild(shopTable); // append shopTable to the 2nd element of the "card"


    let divTotal = document.createElement("div");
    divTotal.classList.add("row");

    let divEmpty = document.createElement("div");
    divEmpty.classList.add("col-md-7");

    let labelTotal = document.createElement("div");
    labelTotal.classList.add("col-md-2");
    labelTotal.classList.add("labelTotal");
    labelTotal.innerText = "Total: ";

    let divTotalSum = document.createElement("div");
    divTotalSum.id = "priceTotal";
    divTotalSum.classList.add("col-md-3");
    divTotalSum.innerText = 0;

    divTotal.appendChild(divEmpty);
    divTotal.appendChild(labelTotal);
    divTotal.appendChild(divTotalSum);

    document.getElementsByClassName("card")[1].appendChild(divTotal);

    let divButton = document.createElement("div");
    divButton.classList.add("shopButton");

    let buttonContinue = document.createElement("button");
    buttonContinue.classList.add("btn");
    buttonContinue.classList.add("btn-success");
    buttonContinue.innerText = "Continue";

    divButton.appendChild(buttonContinue);
    document.getElementsByClassName("card")[1].appendChild(divButton);

    addProductToTable();

}


function addProductToTable() {

    let element = shopCart[shopCart.length - 1];

    let tr = document.createElement("tr");
    tr.id = element.id;
    let th1 = document.createElement("td");
    let th2 = document.createElement("td");
    let th3 = document.createElement("td");
    let th4 = document.createElement("td");

    th1.innerHTML = element.name;
    let icon = document.createElement("i");
    icon.innerHTML = "&copy;";
    icon.addEventListener("mouseover", function (e) {
        // obtii cordonate mouse
        // pune coordonate pe span
        // make it visible
        if (element.description != undefined) {
            showTooltip(e, element.description);
        }
        else {
            showTooltip(e, "No descrition available");
        }
    })
    icon.addEventListener("mouseout", function (e) {
        //make it invisible
        hideTooltip(e);
    })

    th1.appendChild(icon);
    let spanHover = document.createElement("span");
    spanHover.style.display = "none";
    spanHover.id = "tooltiptext";

    document.body.appendChild(spanHover);


    let inputQuantity = document.createElement("input");
    inputQuantity.type = "number";
    inputQuantity.min = 1;
    inputQuantity.value = 1;
    inputQuantity.addEventListener("change", function (e) {
        calculateValue(e, element);
    })
    th2.appendChild(inputQuantity);

    th3.innerHTML = inputQuantity.value * element.price;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-danger");
    deleteButton.classList.add("btn-sm");
    deleteButton.innerText = "X"
    deleteButton.addEventListener("click", function (e) {
        removeProductFromCart(e);
    })
    th4.appendChild(deleteButton);

    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);

    document.getElementsByTagName("tbody")[0].appendChild(tr);

    calculateTotalPrice();
}

function showTooltip(e, description) {
    // e = event;
    let spanShop = document.getElementById("tooltiptext");
    spanShop.innerText = description;
    spanShop.style.display = "block";
    spanShop.style.left = (e.clientX) + "px";
    spanShop.style.top = (e.clientY) + "px";
}

function hideTooltip() {
    let spanShop = document.getElementById("tooltiptext");
    spanShop.style.display = "none";

}

function calculateValue(e, element) {
    let inputValue = e.target.value;

    document.getElementById(element.id).childNodes[2].innerText = inputValue * element.price;

    calculateTotalPrice();

}

function calculateTotalPrice() {
    let totalSum = 0;
    let tbody = document.getElementsByTagName("tbody")[0];
    tbody.childNodes.forEach(tr => {
            totalSum += parseFloat(tr.childNodes[2].innerText);        
    });
    totalSum = totalSum.toFixed(2);
    document.getElementById("priceTotal").innerText = totalSum;
}

function removeProductFromCart(e) {
    //stergem din shopCart din obiect si front
    // adaugi in ProductList si in frontend
    //recalculam suma
    let productId = parseInt(e.target.parentNode.parentNode.id);

    shopCart.forEach(element => {

        if (element.id === productId) {
            productList.push(element);
        }

    })
    let index = shopCart.map(function (e) { return e.id; }).indexOf(productId);
    shopCart.splice(index, 1);

    let product = document.getElementById(productId);
    product.parentNode.removeChild(product);

    document.getElementsByClassName("card")[0].innerHTML = '';
    productList = productList.slice().sort((a, b) => b.price - a.price)
    addData(productList);

    if (shopCart.length == 0) {
        document.getElementsByClassName("card")[1].innerHTML = '';
        let divTitle = document.createElement("div");
        divTitle.classList.add("shopTitle");
        divTitle.innerText = "No products in your shopping cart";
        document.getElementsByClassName("card")[1].appendChild(divTitle);
    }
    calculateTotalPrice();
}

/////////////////////////// Task 3
let currencyFrom = "USD";
let currencyTo = "USD";

fx.base = "USD";
fx.rates = {
    "EUR": 0.745101, // eg. 1 USD === 0.745101 EUR
    "GBP": 0.647710, // etc...
    "HKD": 7.781919,
    "USD": 1,        // always include the base rate (1:1)
}

document.getElementById("currency").addEventListener("change", function (e) {
    changeSelectValue();
})

function changeSelectValue() {
    currencyFrom = currencyTo;
    currencyTo = document.getElementById("currency").value;

    productList.forEach(element => {
        element.price = fx.convert(element.price, { from: currencyFrom, to: currencyTo })
        element.price = element.price.toFixed(2);
    })

    document.getElementsByClassName("card")[0].innerHTML = '';
    addData(productList);


    shopCart.forEach(element => {
        element.price = fx.convert(element.price, { from: currencyFrom, to: currencyTo })
        element.price = element.price.toFixed(2);
    })

    if (shopCart.length != 0) {
        document.getElementsByClassName("card")[1].innerHTML = '';
        let divTitle = document.createElement("div");
        divTitle.classList.add("shopTitle");
        divTitle.innerText = "Products in your shopping cart";
        document.getElementsByClassName("card")[1].appendChild(divTitle);
        redrawShop();
    }
}


// Not so practical
// Basically same as createShop() and addProductToTable() but it creates table element for each element of the shop Cart instead of the last one. 
function redrawShop() {
    let shopTitle = document.getElementsByClassName("shopTitle")[0];
    shopTitle.innerHTML = "Products in your shopping cart";

    let shopTable = document.createElement("table");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    let th3 = document.createElement("th");
    let th4 = document.createElement("th");
    th1.innerHTML = "Products";
    th2.innerHTML = "Quantity";
    th3.innerHTML = "Value";
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    thead.appendChild(tr);
    shopTable.appendChild(thead);

    let tbody = document.createElement("tbody");
    shopTable.appendChild(tbody);

    document.getElementsByClassName("card")[1].appendChild(shopTable); // append shopTable to the 2nd element of the "card"


    let divTotal = document.createElement("div");
    divTotal.classList.add("row");

    let divEmpty = document.createElement("div");
    divEmpty.classList.add("col-md-7");

    let labelTotal = document.createElement("div");
    labelTotal.classList.add("col-md-2");
    labelTotal.classList.add("labelTotal");
    labelTotal.innerText = "Total: ";

    let divTotalSum = document.createElement("div");
    divTotalSum.id = "priceTotal";
    divTotalSum.classList.add("col-md-3");
    divTotalSum.innerText = 0;

    divTotal.appendChild(divEmpty);
    divTotal.appendChild(labelTotal);
    divTotal.appendChild(divTotalSum);

    document.getElementsByClassName("card")[1].appendChild(divTotal);

    let divButton = document.createElement("div");
    divButton.classList.add("shopButton");

    let buttonContinue = document.createElement("button");
    buttonContinue.classList.add("btn");
    buttonContinue.classList.add("btn-success");
    buttonContinue.innerText = "Continue";

    divButton.appendChild(buttonContinue);
    document.getElementsByClassName("card")[1].appendChild(divButton);

    getProducts();
}

function getProducts() {

    shopCart.forEach(element => {

        let tr = document.createElement("tr");
        tr.id = element.id;
        let th1 = document.createElement("td");
        let th2 = document.createElement("td");
        let th3 = document.createElement("td");
        let th4 = document.createElement("td");

        th1.innerHTML = element.name;
        let icon = document.createElement("i");
        icon.innerHTML = "&copy;";
        icon.addEventListener("mouseover", function (e) {
            if (element.description != undefined) {
                showTooltip(e, element.description);
            }
            else {
                showTooltip(e, "No descrition available");
            }
        })
        icon.addEventListener("mouseout", function (e) {
            hideTooltip(e);
        })

        th1.appendChild(icon);
        let spanHover = document.createElement("span");
        spanHover.style.display = "none";
        spanHover.id = "tooltiptext";

        document.body.appendChild(spanHover);


        let inputQuantity = document.createElement("input");
        inputQuantity.type = "number";
        inputQuantity.min = 1;
        inputQuantity.value = 1;
        inputQuantity.addEventListener("change", function (e) {
            calculateValue(e, element);
        })
        th2.appendChild(inputQuantity);

        th3.innerHTML = inputQuantity.value * element.price;

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("btn");
        deleteButton.classList.add("btn-danger");
        deleteButton.classList.add("btn-sm");
        deleteButton.innerText = "X"
        deleteButton.addEventListener("click", function (e) {
            removeProductFromCart(e);
        })
        th4.appendChild(deleteButton);

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        tr.appendChild(th4);

        document.getElementsByTagName("tbody")[0].appendChild(tr);

        calculateTotalPrice();
    })
}









