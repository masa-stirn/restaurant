"use strict"
const catTemplate = document.querySelector("#catTemplate").content;
const prodTemplate = document.querySelector("#productTemplate").content;
const main = document.querySelector("main");
const filterDiv = document.querySelector(".filter");
const plistlink = "http://kea-alt-del.dk/t5/api/productlist";
const imgLink = "http://kea-alt-del.dk/t5/site/imgs/";
const catLink = "http://kea-alt-del.dk/t5/api/categories";


fetch(catLink).then(result => result.json()).then(catData => catFunction(catData));

function getPlist(link) {
    fetch(link).then(result => result.json()).then(myData => show(myData));
}

function catFunction(myData) {
    myData.unshift("menu");
    myData.forEach(elem => {
        const clone = catTemplate.cloneNode(true);
        clone.querySelector("h2").textContent = elem.charAt(0).toUpperCase() + elem.slice(1);
        clone.querySelector("section").id = elem;
        main.appendChild(clone);

        //filter
        const a = document.createElement("a");
        a.textContent = elem;
        a.href = "#";
        a.addEventListener("click", ()=>filter(elem));
        filterDiv.appendChild(a);

    });
    getPlist(plistlink);
}

function show(myData) {
    myData.forEach(elem => {

        const model = document.querySelector("#model");
        const container = document.querySelector("#" + elem.category);
        const clone = prodTemplate.cloneNode(true);
        clone.querySelector(".read-more").addEventListener("click", evt => {
            model.classList.remove("hide");
        });
        document.querySelector(".close").addEventListener("click", x => {
            model.classList.add("hide");
        });
        clone.querySelector("img").src = imgLink + "small/" + elem.image + "-sm.jpg";
        clone.querySelector("img").title = elem.shortdescription;
        clone.querySelector("img").addEventListener("click", evt2 => {
            model.classList.remove("hide");
        });
        clone.querySelector("h3").textContent = elem.name;
        clone.querySelector("h4 span").textContent =elem.price;


        if (elem.vegetarian === true && elem.category != "drinks") {
            clone.querySelector(".green").classList.remove("hide");
        }
        if (elem.soldout === true) {
            clone.querySelector(".orange").classList.remove("hide");
        }
        if (elem.alcohol) {// zero is false = implicit false
            clone.querySelector(".alco").classList.remove("hide");
            const newImage = document.createElement("img");
            newImage.setAttribute("src", "imgs/cocktail-26182.svg");
            newImage.setAttribute("alt", "Contains alcohol" + elem.alcohol + "%");
            newImage.setAttribute("title", "Contains alcohol" + elem.alcohol + "%");
            clone.querySelector(".alco-div").prepend(newImage);
        }
        if (elem.discount > 0) {
            const newPrice = Math.ceil(elem.price - elem.price * elem.discount/100);
            clone.querySelector(".discount").textContent = "Now only " + newPrice + " DKK";
            clone.querySelector(".red").classList.remove("hide");
            clone.querySelector(".discount").classList.remove("hide");
            clone.querySelector(".price").style.textDecoration = "line-through";
            clone.querySelector(".price").style.color = "red";
        }
        container.appendChild(clone);
    })
}

function filter(myFilter){
    console.log(document.querySelectorAll("main .cat-section"));
            document.querySelectorAll("main .cat-section").forEach(section=>{
                if (section.id == myFilter || myFilter == "menu"){
                    section.classList.remove("hide");
                }
                else{
                    section.classList.add("hide");
                }
            })
        }
