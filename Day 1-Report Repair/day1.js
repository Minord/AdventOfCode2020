//The URL of github gist Input
let inputURL = "https://gist.githubusercontent.com/Minord/797bdc7ac64aa7930082d9b3b7c1b037/raw/0970e25f029ef5825bd314194963415620cac427/input1";



var dataDOM = new Array();

//This part make an ajax request and
//prosses the returned text.
var httpRequest = new XMLHttpRequest;
httpRequest.open('GET', inputURL);
httpRequest.onload = function(){
    var inputData =  httpRequest.responseText.split("\n");
    inputData = inputData.map(Number.parseFloat)
    input = inputData;

    //Populate the DOM.
    input.forEach(element => {
        var inputContainerElement = document.getElementById("input-container");
        var newNumberElement = document.createElement("DIV");
        newNumberElement.textContent = element.toString();
        newNumberElement.classList.add("num-container");
        inputContainerElement.appendChild(newNumberElement);
        dataDOM.push([element, newNumberElement]);
    });
}
httpRequest.send();

//Sleep function for visualizate what the algorimth is doing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var inExecution = false;

async function findNumbers(){
    if(!inExecution){
        inExecution = true;
        dataDOM.forEach(element => {
            element[1].classList.remove("selected-num");
            element[1].classList.remove("selected-num-2");
            element[1].classList.remove("analized-num");
            element[1].classList.remove("analized-num-2");
            element[1].classList.remove("finded");
            document.getElementById("response").classList.remove("finded-text");
        });
    
        for(var i = 0; i < dataDOM.length; i++){
            //HigthLight i
            //HigthLight i
            let toRemove = new Array();
    
            dataDOM[i][1].classList.add("selected-num");
            for(var j = i + 1; j < dataDOM.length; j++){
                dataDOM[j][1].classList.add("selected-num-2");
                toRemove.push(j);
                await sleep(2);
                if(dataDOM[i][0] + dataDOM[j][0] === 2020){
                    dataDOM[i][1].classList.add("finded");
                    dataDOM[j][1].classList.add("finded");
                    document.getElementById("response").textContent = "X * Y = " + dataDOM[i][0] * dataDOM[j][0];
                    document.getElementById("response").classList.add("finded-text");
                }

                dataDOM[j][1].classList.remove("selected-num-2");
                dataDOM[j][1].classList.add("analized-num-2");
            }
            toRemove.forEach(index => {
                dataDOM[index][1].classList.remove("analized-num-2");
            });
    
            dataDOM[i][1].classList.remove("selected-num");
            dataDOM[i][1].classList.add("analized-num");
        }
        inExecution = false;
    }
}

//Parte 2




//Now i need mak