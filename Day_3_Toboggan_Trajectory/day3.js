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
    console.log(part1());
    //Part2
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

//Visualization Code.

var canvas = document.getElementById('drawing-canvas');

let secondsPassed = 0;
let oldTimeStamp = 0;
//let movingSpeed = 50;

function mainLoop(timeStamp){
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);
    update(secondsPassed);
    draw();
    window.requestAnimationFrame(mainLoop);
}

let actualPos = [0, 0];
let movingSpeed = 5;


let timePassed = 0;
function update(secondsPassed){
    timePassed += secondsPassed;

    //Do my updates here
}

function posToPixels(pos){
    //unit per pixel
    const PixelPerUnit = 20;
    const PixelCenter = [canvas.width, canvas.height];
    
    return [pos[0]*PixelPerUnit + PixelCenter[0],
            pos[1]*PixelPerUnit + PixelCenter[1]];
}

function getForestTile(index){
    if(index[1] >= 0 && index[1] < forestMatrix.length){
        if(index[0] >= 0){
            return forestMatrix[index[1]][index[0] % forestMatrix[0].length];
        } else {
            return null;
        }
    } else {
        return null;
    }
}
var ctx = canvas.getContext('2d');

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    var xFloor = Math.floor(actualPos[0]);
    var yFloor = Math.floor(actualPos[1]);

    const rad = 20;
    
    for(var i = -rad/2; i < rad/2; i++){
        for(var j = -rad/2; j < rad/2; j++){
            var titlepos = [xFloor + i, yFloor + j];
            drawSquare(titlepos, getForestTile(titlepos));
        }
    }
}

function drawSquare(pos , isTree, ponderation = 1){
    if(isTree){
        context.fillStyle = '#ff8080';
        context.fillRect(pos[0], pos[1], 19 * ponderation, 19 * ponderation);
    }
    else{
        context.fillStyle = '#ff8080';
        context.fillRect(pos[0], pos[1], 15 * ponderation, 15 * ponderation);
    }
}

/*Data Model
I will discuss here about the data model here
how i define the data model.

Data model for me is the part of program that define the data
that can exist actually giving meaning full and eficent ways to
get update remove operations. with deferent queries.

I can say that the The is the data model that define the thing.
and there are the

Now i have to define what is all the data that we need for making our
aplications.

Wee Need a grid Map this map is an array defined to i [0, +OO] and j [0, len]
here in the i index we have a infinite that is because the array actually repeats
a pattern for ever in i > 0. then that data storage is not infinite.


USES CASES FOR THIS DATA:
    * get a value for i, j indexes
    * get mapping for actual values to i, j indexes.
    
    * pointer object.
    * paths list.
    * this thing are defined by a diferent functions.
*/

class Step{
    constructor(x, y, isTree){
        this.x = x;
        this.y = y;
        this.isTree =  isTree;
    }
}

class Toboggan{
    constructor(id ,xStep, yStep){
        this.id = id;
        this.xStep = xStep;
        this.yStep = yStep;
        this.stepList = new Array();
        this.treeCounter = 0;
    }
    //Get Steps around this Point.
    getStepsAround(x, y, radius){
        var listStepsAround = new Array();
        this.stepList.forEach(step => {
            var xdiff = Math.abs(x - step.x);
            var ydiff = Math.abs(y - step.y);
            if(xdiff <= radius && ydiff <= radius){
                listStepsAround.push(step);    
            }
        });
        return listStepsAround;
    }
    addStep(value){
        var actualSteps = this.getStepCounter();
        this.stepList.push(new Step(this.xStep * actualSteps,
                                    this.yStep * actualSteps,
                                    value));
    }
    getStepCounter(){
        return this.stepList.length;
    }
}

class Camera{
    //This is for making a movement of camera to each 
    //Update that is made  in the algorimt.
    constructor(x, y, pixelsPerUnit = 10){
        this.x = x;
        this.y = y;
        this.pixelsPerUnit = pixelsPerUnit;
    }

    transform(x, y, canvas){
        let x = (x * this.pixelsPerUnit) + (canvas.width / 2);
        let y = (y * this.pixelsPerUnit) + (canvas.height / 2);
        return {x, y};
    }

    scaleNumber(num){
        return num * this.pixelsPerUnit;
    }
}

class AlgoDataModel{
    constructor(forestMatrix){
        //Constant Part of program
        this.forestMatrix = forestMatrix;   //Matrix que contiene la matrix normal que no se repite
        this.toboggan = new Toboggan();     //ActualToboggan
        this.camera = new Camera();         //Heyy
    }
    isTree(x, y){
        let horizontalLen = this.forestMatrix[0].length;
        let verticalLen = this.forestMatrix.length;
        let xValid = x >= 0;
        let yValid = y >= 0 && y < verticalLen;
        if(xValid && yValid){
            let xPattern = x % horizontalLen;
            return this.forestMatrix[y][xPattern];
        } 
        return null;
    }
    resetToboggan(){
        this.toboggan = new Toboggan(); 
    }
    getForestAround(x, y, radius){

    }
    addStep(){

    }
}

/*Program and User Data Entry
In this part we will handle the user data entry making parsing and validatons
And to we put the data that the software part put as ajax request or variables.
*/


/**
 * Algorithnm and Data Logic
 * 
 *  Here we will define that control the changes that will be made by the program.
 *  this part will need of data part
 */

function solve(dataModel){

}

/* User Data View
Here is Where we will define the data view for the user prob making a animation
loop and canvas 2d Drawing

this part will make use of Algo and Data Part
*/

//TODO: making the code here
const colorPallete = {
    backGround :    "#000000",
    groundNormal :  "#161814",
    groundLit :     "#38482a",
    treeNormal :    "#234b3e",
    treeLit :       "#319034",
    actual :        "#67dde7"
};

class Drawer{
    constructor(canvas, camera){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.camera = camera;
    }
    drawClean(){
        //Here we clean the context with the choosen BackGroundColor
        console.log(colorPallete.backGround);
        this.ctx.fillStyle = colorPallete.backGround;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawGround(x, y, rad){
        const offset = this.camera.scaleNumber((0.8 / 2) * rad);
        const pos = this.camera.transform(x, y, canvas);
        this.ctx.fillStyle = colorPallete.actual;
        this.ctx.fillRect(pos.x - offset, pos.y - offset, pos.x + offset, pos.y + offset);
    }
    drawGroundLit(x, y, rad){
        const offset = (0.95 / 2) * rad;
        this.ctx.fillStyle = colorPallete.groundLit;
        this.ctx.rect(x - offset, y - offset, x + offset, y + offset);
        this.ctx.fill();
    }
    drawTree(x, y, rad){
        this.ctx.fillStyle = colorPallete.treeNormal;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 0.8 * rad, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    drawTreeLit(x, y, rad){
        this.ctx.fillStyle = colorPallete.treeNormal;
        this.ctx.beginPath();
        this.ctx.arc(x, y, rad, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    drawPointer(x, y){
        //This is the thing that mark the center
        this.ctx.strokeStyle = colorPallete.actual;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 0.4, y);
        this.ctx.lineTo(x + 0.4, y);
        this.ctx.moveTo(x, y - 0.4);
        this.ctx.lineTo(x, y + 0.4);
        this.ctx.stroke();
    }
};


/*
* Executions and events magnament
* Here is were we register the buttons and the logic that will control 
* everi thing.
*/

//TODO: making the code here



//TESTING CODE
var camera = new Camera(0 , 0);
var canvasS = document.getElementById('drawing-canvas');
var drawer = new Drawer(canvasS, camera);
drawer.drawClean();
drawer.drawPointer(0,0);
drawer.drawTree(2, 2, 1);
drawer.drawGround(0,0, 1);
drawer.drawGround(35,5, 1);
drawer.drawGround(2,4, 1);
drawer.drawGround(223,4, 1);

////////////////FUCK i cant do it