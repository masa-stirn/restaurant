"use strict"
const catTemplate = document.querySelector("#catTemplate").content;
const prodTemplate = document.querySelector("#productTemplate").content;
const main = document.querySelector("main");
const plistlink = "http://kea-alt-del.dk/t5/api/productlist";
const imgLink = "http://kea-alt-del.dk/t5/site/imgs/";
const catLink = "http://kea-alt-del.dk/t5/api/categories";


fetch(catLink).then(result=>result.json()).then(catData=>catFunction(catData));

function getPlist(link){
    fetch(link).then(result=>result.json()).then(myData=>show(myData));
}

function catFunction(myData){
    myData.forEach(elem=>{
        const clone = catTemplate.cloneNode(true);
        clone.querySelector("h2").textContent=elem;
        clone.querySelector("section").id=elem;
        main.appendChild(clone);
    });
    getPlist(plistlink);
}

function show(myData){
    myData.forEach(elem=>{
        console.log(elem);
        const model = document.querySelector("#model");
        const container = document.querySelector("#"+elem.category);
        const clone = prodTemplate.cloneNode(true);
        clone.querySelector(".read-more").addEventListener("click", evt=>{
                                                       model.classList.remove("hide");
                                                       })
        document.querySelector(".close").addEventListener("click", x=>{
                                                       model.classList.add("hide");
                                                       })


        clone.querySelector("img").src=imgLink + "small/" + elem.image + "-sm.jpg";
        clone.querySelector("h3").textContent=elem.name;
        clone.querySelector("h4").textContent="Price " + elem.price + " DKK";
        let newPrice = elem.price - elem.discount;
        clone.querySelector(".discount").textContent="NOW ONLY " + newPrice + " DKK";


        if (elem.vegetarian===true) {
            clone.querySelector(".green").classList.remove("hide");
            if(elem.category==="drinks"){
              clone.querySelector(".green").classList.add("hide");
            }
        }
        if (elem.soldout===true) {
            clone.querySelector(".orange").classList.remove("hide");
        }
        if (elem.alcohol>0) {
            clone.querySelector(".alco").classList.remove("hide");
        }
        if (elem.discount>0) {
            clone.querySelector(".red").classList.remove("hide");
            clone.querySelector(".discount").classList.remove("hide");
            clone.querySelector(".price").style.textDecoration = "line-through";

        }

        container.appendChild(clone);
    })
}


//document.querySelector(link).addEventListener("click", ()=>{
//})
