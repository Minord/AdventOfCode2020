

//Input URL
//Saved in a github gist
var inputURL = "https://gist.githubusercontent.com/Minord/e61e15b24277ab6b2b537a826fdefbb6/raw/9a05db60bb743f121cdbb12ab9acfd30316a8cc2/day2";



//Data structures for making the algo.
class Password {
    constructor(min, max, char, textpass) {
        this.min = min;
        this.max = max;
        this.char = char;
        this.textpass = textpass;
    }
}

//This is where i save my data
let passwordList = new Array();

//Use AJAX for get the data
var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', inputURL);
//This is that we do when we make the request
httpRequest.onload = function(){
    //Should return a list of string with string in the from a, b c : asdfghjkqwerty
    var inputData =  httpRequest.responseText.split("\n");
    
    inputData.forEach(passwordLine => {
        //Build a password Object
        var splitline = passwordLine.split(":");
        var rule = splitline[0];
        var textpass = splitline[1];
        textpass = textpass.replace(" ", "");
        var char = rule.slice(-1);
        rule = rule.split("-");
        var min = Number.parseFloat(rule[0]);
        var max = Number.parseFloat(rule[1]);
        var password = new Password(min, max, char, textpass);
        passwordList.push(password);
    });

    //Do something
    ///addPasswordData(passwordList[0]);
}
//Make the request
httpRequest.send();

var letterContainer = document.getElementById("password-container");
var min = document.getElementById("min");
var max = document.getElementById("max");
var char = document.getElementById("char");
var counterElement = document.getElementById("counter");
var intervalElement = document.getElementById("comparation");
var globalCounter = document.getElementById("globalCounter");

//Sleep function for visualizate what the algorimth is doing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Sleep Function that change acording to advace
function sleepVariable(actual, max){
    var advance = actual / max;
    if (advance <= 0.1){
        return sleep(-1490*advance + 150);
    } else if(advance <= 0.9){
        return sleep(1);
    } else {
        return sleep(1490*advance - 1340);
    }
}

//Add Password Data Here
function addPasswordData(password){
    min.textContent = "min = " + password.min;
    max.textContent = "max = " + password.max;
    char.textContent = `char = '${password.char}'`;
    [...password.textpass].forEach(char => {
        let newChar = document.createElement("DIV");
        newChar.classList.add("letter");
        newChar.textContent = char;
        letterContainer.appendChild(newChar);
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function intervalUpdate(min, max, actual)
{
    intervalElement.textContent = min + " <= " + actual + " <= " + max;
    if(min <= actual && actual <= max){
        intervalElement.classList.remove("no");
        intervalElement.classList.add("ok");
        return true;
    } else{
        intervalElement.classList.remove("ok");
        intervalElement.classList.add("no");
        return false;
    }
}

var isWorking = false;

async function part1(){
    if(!isWorking){
        isWorking = true;
        var totalCounter = 0;
        //Do the code good.
        for(var i = 0; i < passwordList.length; i++){
            addPasswordData(passwordList[i]);

            var counter = 0;

            for(var j = 0; j < passwordList[i].textpass.length; j++){
                let element = letterContainer.childNodes.item(j);
                element.classList.add("evaling");

                await sleepVariable(i, passwordList.length);
                
                if(element.textContent.charAt(0) === passwordList[i].char){
                    element.classList.remove("evaling");
                    element.classList.add("ok");

                    counter++;
                    counterElement.textContent = "counter : " + counter;
                    
                    intervalUpdate(passwordList[i].min, passwordList[i].max, counter);

                } else{
                    element.classList.remove("evaling");
                    element.classList.add("no");
                }
                
            }
            if(intervalUpdate(passwordList[i].min, passwordList[i].max, counter)){
                totalCounter++;
                globalCounter.textContent = "Total Solutions : " + totalCounter;
            }
            //Delete the password Data
            removeAllChildNodes(letterContainer);
        }

        isWorking = false;
    }
}



var letterContainer2 = document.getElementById("password-container2");
var firstElement = document.getElementById("first");
var secondElement = document.getElementById("second");
var charElement = document.getElementById("char2");
var counterElement = document.getElementById("counter");
var intervalElement = document.getElementById("comparation");
var globalCounter2 = document.getElementById("globalCounter2");


//Add Password Data Here
function addPasswordData2(password){
    firstElement.textContent = "first = " + password.min;
    secondElement.textContent = "second = " + password.max;
    charElement.textContent = `char = '${password.char}'`;
    [...password.textpass].forEach(char => {
        let newChar = document.createElement("DIV");
        newChar.classList.add("letter");
        newChar.textContent = char;
        letterContainer2.appendChild(newChar);
    });
    
}

async function part2(){
    var counterPass = 0;
    for(var i = 0; i < passwordList.length; i++){
        
        addPasswordData2(passwordList[i]);
        await sleep(50);
        var first = passwordList[i].min;
        var second = passwordList[i].max;
        var textpass = passwordList[i].textpass;
        var char = passwordList[i].char;
        letterContainer2.childNodes.item(first).classList.add("evaling");

        if(textpass.charAt(first - 1) === char){
            if(textpass.charAt(second -1) != char){
                letterContainer2.childNodes.item(second - 1).classList.add("ok");
                counterPass++;
                globalCounter2.textContent = "Total Solutions : " + counterPass;
            }
            else {
                letterContainer2.childNodes.item(second - 1).classList.add("no");
            }
        } else{
            if(textpass.charAt(second - 1) === char){
                letterContainer2.childNodes.item(second - 1).classList.add("ok");
                counterPass++;
                globalCounter2.textContent = "Total Solutions : " + counterPass;
            } else {
                letterContainer2.childNodes.item(second - 1).classList.add("no");
            }
        }
        await sleep(50);
        removeAllChildNodes(letterContainer2);
    }
    console.log(counterPass);
}