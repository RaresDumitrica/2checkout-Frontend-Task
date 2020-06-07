// $.get("http://private-32dcc-products72.apiary-mock.com/product", function (data) {
//     $(".result").html(data);
//     alert("Load was performed.");
// });

var responseObj;
async function getData()  {
    var response = await fetch('http://private-32dcc-products72.apiary-mock.com/product')
    .then(response => response.json())
    .then(data => data.slice().sort((a,b) => b.price - a.price)) // sorted prices
    .then(data => responseObj = data)
    .then(data => {
        console.log(data)
        addData(data)}
    )
    

    // responseObj.slice().sort((a,b) => b.price - a.price)
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
        labelPrice.innerHTML =  element.price
        divPrice.appendChild(labelPrice)
        div.appendChild(divPrice)

        let buttonAdd = document.createElement("button")
        buttonAdd.classList.add("fa")
        buttonAdd.classList.add("fa-shopping-cart")
        buttonAdd.classList.add("btn")
        buttonAdd.classList.add("btn-success")
        buttonAdd.classList.add("col-md-4")
        buttonAdd.innerHTML = "add to Cart"
        div.appendChild(buttonAdd)
    });
    
}