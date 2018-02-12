"use strict"
const catTemplate = document.querySelector("#catTemplate").content;
const prodTemplate = document.querySelector("#productTemplate").content;
const main = document.querySelector("main");
const filterDiv = document.querySelector(".filter");
const plistlink = "http://kea-alt-del.dk/t5/api/productlist";
const imgLink = "http://kea-alt-del.dk/t5/site/imgs/";
const catLink = "http://kea-alt-del.dk/t5/api/categories";
const productLink = "http://kea-alt-del.dk/t5/api/product?id=";
const spinner = document.querySelector(".spinner");


/*window.addEventListener("load", hideSpinner)
function hideSpinner(){
spinner.classList.add("hide");
}*/



fetch(catLink).then(result => result.json()).then(catData => catFunction(catData));

function getPlist(link) {
    fetch(link).then(result => result.json()).then(myData => show(myData));
}


function catFunction(myData) {
    myData.unshift("all");
    myData.forEach(elem => {
        const clone = catTemplate.cloneNode(true);
        clone.querySelector("h2").textContent = elem.charAt(0).toUpperCase() + elem.slice(1);
        clone.querySelector("section").id = elem;
        main.appendChild(clone);

        //create li items
        var li = document.createElement("li");        // Create a <li> element
        filterDiv.appendChild(li);                    // Append <li> to <body>

        //Category filter
        const a = document.createElement("a");
        a.textContent = elem;
        a.href = "#sort";
        a.addEventListener("click", () => filter(elem));
        li.appendChild(a);



    });

    getPlist(plistlink);
    document.querySelector(".filter a").classList.add("active");
}
const modalImg = document.querySelector("#modal-img");

function show(myData) {
    myData.forEach(elem => {
        const modal = document.querySelector("#modal");

        const container = document.querySelector("#" + elem.category);
        const clone = prodTemplate.cloneNode(true);
        clone.querySelector(".read-more").addEventListener("click", () => {
            fetch(productLink + elem.id).then(result => result.json()).then(product => showDetails(product));
            modal.classList.remove("hide");
        });
        clone.querySelector("img").src = imgLink + "small/" + elem.image + "-sm.jpg";
        clone.querySelector("img").title = elem.shortdescription;
        clone.querySelector("img").addEventListener("click", () => {
            fetch(productLink + elem.id).then(result => result.json()).then(product2 => showDetails2(product2));
            modalImg.classList.remove("hide");
        });
        clone.querySelector("h3").textContent = elem.name;
        clone.querySelector("h4 span").textContent = elem.price;
        clone.querySelector(".product-section").dataset.price = elem.price;

        if (elem.vegetarian === true && elem.category != "drinks") {
            clone.querySelector(".green").classList.remove("hide");
            clone.querySelector(".product-section").classList.add("vegi");

        }
        if (elem.soldout === true) {
            clone.querySelector(".orange").classList.remove("hide");
            clone.querySelector("img").style.filter = "grayscale()";

        }
        if (elem.alcohol) { // zero is false = implicit false
            clone.querySelector(".alco").classList.remove("hide");
            const newImage = document.createElement("img");
            newImage.setAttribute("src", "imgs/cocktail-26182.svg");
            newImage.setAttribute("alt", "Contains alcohol" + elem.alcohol + "%");
            newImage.setAttribute("title", "Contains alcohol" + elem.alcohol + "%");
            clone.querySelector(".alco-div").prepend(newImage);
        }
        if (elem.discount > 0) {
            const newPrice = Math.round(elem.price - elem.price * elem.discount / 100);
            clone.querySelector(".discount").textContent = "Now only " + newPrice + " DKK";
            clone.querySelector(".red").classList.remove("hide");
            clone.querySelector(".discount").classList.remove("hide");
            clone.querySelector(".price").style.textDecoration = "line-through";
            clone.querySelector(".price").style.color = "red";
            clone.querySelector(".product-section").classList.add("onSale");
            clone.querySelector(".product-section").dataset.price = newPrice;
        }
        clone.querySelector(".product-section").dataset.category = elem.category;
        container.appendChild(clone);
    })
    sortPriceFunction();
}


function filter(myFilter) {
    document.querySelectorAll("main .cat-section").forEach(section => {
        if (section.id == myFilter || myFilter == "all") {
            section.classList.remove("hide");
        } else {
            section.classList.add("hide");
        }
    })
    document.querySelectorAll(".filter a").forEach(filLink => {
        filLink.addEventListener("click", function () {
            filLink.classList.add("active");
            console.log("works")
        })
        if (filLink.classList.contains("active")){
              filLink.classList.remove("active")
            }
    })
}

function showDetails(product) {
    modal.querySelector(".large-name").textContent = product.name;
    if (product.longdescription) {
        modal.querySelector(".large-description").textContent = product.longdescription;
    } else {
        modal.querySelector(".large-description").textContent = product.shortdescription;
    }
    modal.querySelector(".large-image").src = imgLink + "large/" + product.image + ".jpg";
    setTimeout(function () {
        modal.querySelector(".large-image").style.display = "block";
        modal.querySelector(".spinner").style.display = "none";
    }, 300);
}
document.querySelector(".close").addEventListener("click", x => {
    modal.classList.add("hide");
    modal.querySelector(".large-name").textContent = "Loading...";
    modal.querySelector(".large-description").textContent = "";
    modal.querySelector(".large-image").style.display = "none";
    modal.querySelector(".spinner").style.display = "block";

});

//modal img
function showDetails2(product2) {
    modalImg.querySelector(".large-image2").src = imgLink + "large/" + product2.image + ".jpg";
    setTimeout(function () {
        modalImg.querySelector(".large-image2").style.display = "block";
        modalImg.querySelector(".spinner").style.display = "none";
    }, 300);
}
document.querySelector(".close2").addEventListener("click", x => {
    modalImg.classList.add("hide");
    modalImg.querySelector(".large-image2").style.display = "none";
    modalImg.querySelector(".spinner").style.display = "block";

});


//Sale filter
const checkbox = document.querySelector("#trigger");
checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        //Hide all sections that dont contain class onSale
        document.querySelectorAll(".product-section").forEach((elem) => {
            console.log(elem.classList.contains("onSale"));
            if (!elem.classList.contains("onSale")) {
                elem.classList.add("hide");
            }
        })
    } else { //show everything
        document.querySelectorAll(".product-section").forEach((elem) => {
            elem.classList.remove("hide");
        })
    }
})

//Veggie filter
const checkbox2 = document.querySelector("#trigger2");
checkbox2.addEventListener("change", () => {
    if (checkbox2.checked) {
        //Hide all sections that dont contain class onSale
        document.querySelectorAll(".product-section").forEach((elem) => {
            //console.log(elem.classList.contains("vegi"));
            //const onSale = document.querySelector(".onSale");
            if (!elem.classList.contains("vegi")) {
                elem.classList.add("hide");
            }
        })
    } else { //show everything
        document.querySelectorAll(".product-section").forEach((elem) => {
            elem.classList.remove("hide");
        })
    }
})
//Sort by Price
function sortPriceFunction() {
    //grab the array with all the prices
    //const prices = elem.price;
    const prices = document.querySelectorAll(".product-section");
    const sortButton = document.querySelector(".sort-button");
    sortButton.addEventListener("click", () => {
        //store prices from the nodeList into the array
        let asArray = [...prices];

        asArray.sort(function (a, b) {
            return a.dataset.price - b.dataset.price
        });
        console.log(asArray)

        asArray.forEach(el => {
            console.log(el.dataset)
            document.querySelector("#" + el.dataset.category).appendChild(el);
        })
    })
}

