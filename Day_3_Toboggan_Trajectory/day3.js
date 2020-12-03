//Fetch Data
var inputURL = "https://gist.githubusercontent.com/Minord/6c948d3c980f1d930a0fe22779e899f6/raw/646d9d2c28a1d00e942b96e424881710bf3ad9a8/day3";

var forestMatrix = [];

var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', inputURL);
httpRequest.onload = function(){
    var input = httpRequest.responseText.split('\n');
    for(var i = 0; i < input.length; i++){
        forestMatrix.push([]);
        for(var j = 0; j < input[i].length; j++){
            var char = input[i].charAt(j);
            if (char === '#')
                forestMatrix[i][j] = true;
            else
                forestMatrix[i][j] = false;
        }
    }
    //Par1
    //console.log(part1());
    //Part2
    //console.log(general(1, 1), general(3, 1), general(5, 1), general(7, 1), general(1, 2));
    console.log(general(1, 1) * general(3, 1) * general(5, 1) *
                general(7, 1) * general(1, 2));
}
httpRequest.send();

//Part 1
function part1(){
    var counter = 0;
    for(var y = 0; y < forestMatrix.length; y++){
        var x = (y*3) % (forestMatrix[y].length);
        if(forestMatrix[y][x]){
            counter++;
        }
    }
    return counter;
}
//Part 2
function general(xStep, yStep){
    var counter = 0;
    for(var i = 0; i < (forestMatrix.length / yStep); i++){
        var y = i*yStep;
        var x = (i*xStep) % (forestMatrix[y].length);
        console.log(x, y);
        if(forestMatrix[y][x]){
            counter++;
        }
    }
    return counter;
}