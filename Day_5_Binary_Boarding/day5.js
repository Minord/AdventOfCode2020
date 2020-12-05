var inputURL = "https://gist.githubusercontent.com/Minord/75b8d4d2f981b2ff66042bea95df618e/raw/f170af9c6440d3529482e90c6289f3af73e7c545/day5";

var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', inputURL);
httpRequest.onload = function(){
    var input = httpRequest.responseText.split('\n');
    var maxid = 0;
    var idsSet = new Set();
    input.forEach(code => {
        var rowcode = code.substr(0, 7);
        var colcode = code.substring(7, 10);
        var row = 0;
        for(var i = 0; i < rowcode.length; i++){
            row += getBinaryPart(rowcode.length - i, rowcode.charAt(i));
        }
        var col = 0;
        for(var i = 0; i < colcode.length; i++){
            col += getBinaryPart(colcode.length - i, colcode.charAt(i));
        }
        var id = ((row) * 8) + (col);
        if(id > maxid){
            maxid = id;
        }
        idsSet.add(id);
        console.log(rowcode, rowcode.length, row, colcode, colcode.length, col, id);
    });
    var myId = null;
    for(var id = 0; id < 128*8; id++){
        if(idsSet.has(id - 1) && idsSet.has(id + 1) && !idsSet.has(id)){
            console.log(id - 1, id + 1);
            myId = id;
        }
    }
    console.log(maxid, myId);
}
httpRequest.send();

function  getBinaryPart(i, char){
    if(char =="B" || char =="R"){
        return 2**(i - 1); 
    }
    return 0;
}