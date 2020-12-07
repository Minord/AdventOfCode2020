var inputURL = "";

var inputURL = "https://gist.githubusercontent.com/Minord/e9f28907925932391d831b6466690913/raw/c0a7f52e147ed3fe4bd7b374cde9d5dcf159d017/day6";

var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', inputURL);
httpRequest.onload = function(){
    var groups = httpRequest.responseText.split('\n\n');
    var totalAnyone = 0;
    var totalEveryOne = 0;
    groups.forEach(group => {
        //Part 1
        var responses = new Set();
        var personForms = group.split('\n');
        personForms.forEach(personForm => {
            for(var i = 0; i < personForm.length; i++)
                responses.add(personForm.charAt(i));
        });
        totalAnyone += responses.size;

        //Part 2
        //Here i have to implement an interception
        var responsesSets = new Array();
        personForms.forEach(personForm => {
            var formSet = new Set();
            for(var i = 0; i < personForm.length; i++)
                formSet.add(personForm.charAt(i));
            responsesSets.push(formSet);
        });
        var finalSet = responsesSets.pop();
        while(responsesSets.length > 0){
            finalSet = interception(finalSet, responsesSets.pop());
        }
        totalEveryOne += finalSet.size;
    });
    console.log("Numero total : ", totalAnyone, "Numero todos", totalEveryOne);
}
httpRequest.send();


function interception(setA, setB){
    var _interception = new Set();
    setB.forEach(element => {
        if(setA.has(element)){
            _interception.add(element);
        }
    });
    return _interception;
}