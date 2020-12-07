var inputURL = "https://gist.githubusercontent.com/Minord/bfdf16f5c80136cef273a161b8970588/raw/0b32a03627c5a3c4b8914180b275b2165862e70a/day7";
var inputTestURL = "https://gist.githubusercontent.com/Minord/bfdf16f5c80136cef273a161b8970588/raw/5f2ac7a62f335201201165d62b852f8869ae3fc2/test7";
var inputTest2URL = "https://gist.githubusercontent.com/Minord/bfdf16f5c80136cef273a161b8970588/raw/17cc91a1c2bbd4897d132356047369d3437a0dfd/test72";
/**
 *light red bags contain 1 bright white bag, 2 muted yellow bags.
 * dark orange bags contain 3 bright white bags, 4 muted yellow bags.
 *bright white bags contain 1 shiny gold bag.
 *muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
 *shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
 *dark olive bags contain 3 faded blue bags, 4 dotted black bags.
 *vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
 *faded blue bags contain no other bags.
 *dotted black bags contain no other bags.
 */
//This are not my input i have to build something like it

var objetiveBag = "shiny gold";

var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', inputURL);
httpRequest.onload = function(){
    var groups = httpRequest.responseText.split('\n');

    //Primero tengo que buscar las que directamente contengan la shiny gold
    //Luego buscar las que contenga a las que contengan a la shiny gold
    //Luego buscar a las que contenga a las que contengas a las que contenga la shiny gold
    //Basicamente esa es la logica del algoritmo

    //Crear el diccionario de bolsas.
    var bagMap = new Map();
    for(var i = 0; i < groups.length; i++){
        bagMap.set(i, groups[i].split(' bags contain ')[0]);
    }
    var objetiveBagId = getIdOf(bagMap, objetiveBag);

    var nullCase = "no other bags."
    //Crear el conjunto de reglas.
    var ruleMap = new Map();
    for(var i = 0; i < groups.length; i++){
        var ruleBag = groups[i].split(' bags contain ')[0];
        var contains = groups[i].split(' bags contain ')[1].split(", ");

        var ruleId = getIdOf(bagMap, ruleBag);
        var rules = new Map();

        contains.forEach(bag => {
            if(bag !== nullCase){
                bag = bag.replace(/bag(s)?[,\.]/, '');
                bag = bag.replace(/^ | $/, '')
                number = Number(bag.match(/\d /)[0]);
                bagId = getIdOf(bagMap, bag.match(/[a-z]+ [a-z]+/)[0]);
                rules.set(bagId, number);
            } else {
                rules = null;
            }
        });
        ruleMap.set(ruleId, rules);
    }

    //Iterar para buscar el mejor.
    var validSet = new Set();
    var lookForSet = new Set(); 
    lookForSet.add(objetiveBagId);
    
    var findSomething = true;
    while(findSomething){
        var newLookForSet = new Set();
        findSomething = false;
        ruleMap.forEach((value, key) => {
            lookForSet.forEach(bag => {
                if(value !== null){
                    if(value.has(bag)){
                        newLookForSet.add(key);
                        findSomething = true;
                    }
                }
            });
        });
        lookForSet.delete(objetiveBagId);
        validSet = union(validSet, lookForSet);
        lookForSet = newLookForSet;
    }
    console.log(validSet, validSet.size);
    

    //Part 2
    var counter = downCount(ruleMap, objetiveBagId) - 1;
    console.log("bolsas que contiene ", objetiveBag, " son ", counter);
    //Aqui quiza conviene la recursividad
}
httpRequest.send();

function downCount(ruleMap, node){
    var counter = 1;
    //This is a map
    var subBags = ruleMap.get(node);
    //console.log(subBags, node, ruleMap);
    if(subBags !== null){
        subBags.forEach((value, key) => {
            //Haora he de irme as parar a los nodos nulos
            counter += value * downCount(ruleMap, key);
        });
    }
    return counter;
}

function getIdOf(bagMap, bagName){
    var id = null;
    bagMap.forEach( (value, key) => {
        if(value === bagName){
            id = key;
        }
    });
    return id;
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}