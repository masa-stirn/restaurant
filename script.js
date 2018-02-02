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
        console.log(clone);
        main.appendChild(clone);
    });
    getPlist(plistlink);
}

function show(myData){
    myData.forEach(elem=>{
        console.log(elem.category);
        const container = document.querySelector("#"+elem.category);
        const clone = prodTemplate.cloneNode(true);
        clone.querySelector("img").src=imgLink + "small/" + elem.image + "-sm.jpg";
        clone.querySelector("h3").textContent=elem.name;
        clone.querySelector("h4").textContent=elem.price + " DKK";
        //if (elem.
        container.appendChild(clone);
    })
}

