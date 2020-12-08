
var inputTestURL = "https://gist.githubusercontent.com/Minord/9b595b17613ebe1868fb8fe23357a46e/raw/da9950aaf83fb9b3ea81534f1b783d3968831d32/day8test";
var inputURL = "https://gist.githubusercontent.com/Minord/9b595b17613ebe1868fb8fe23357a46e/raw/da9950aaf83fb9b3ea81534f1b783d3968831d32/day8";


fetch(inputURL)
    .then(response => response.text())
    .then((response) => {
        var input = response.split('\n');

        var instructions = [];

        input.forEach(text => {
            var instuction = text.match(/^[a-z]{3}/g);
            var value = Number(text.match(/[+|-]\d+/g));
            instructions.push([instuction[0], value]);
        });
        //Part one
        var executedInstructions = new Set();

        var header = 0;
        var acc = 0;
        while(!executedInstructions.has(header)){
            var instruction = instructions[header][0];
            var value = instructions[header][1];
            executedInstructions.add(header);
            if(instruction == 'acc'){
                acc += value;
                header += 1;
            }
            else if(instruction == 'jmp'){
                header += value;
            }
            else if(instruction == 'nop'){
                header += 1;
            }
        }

        //I can try with brute force
        //Part 2 brute force
        var responseAcc = null;

        for(var i = 0; i < instructions.length; i++){
            if(instructions[i][0] === 'jmp' || instructions[i][0] === 'nop'){
                //Change for check
                instructions[i][0] = flip(instructions[i][0]);

                var acc = executeDebugProgram(instructions);

                if(acc !== null){
                    responseAcc = acc;
                    break;
                }
                //Undo the change
                instructions[i][0] = flip(instructions[i][0]);
            }
        }

        console.log("El acumulador es",acc);
    });


    function flip(instruction){
        if(instruction === 'jmp'){
            return 'nop';
        } else if(instruction === 'nop'){
            return 'jmp';
        }
        return instruction;
    }

    function executeDebugProgram(instructions){
        var executedInstructions = new Set();

        var header = 0;
        var acc = 0;
        while(!executedInstructions.has(header)){
            var instruction = instructions[header][0];
            var value = instructions[header][1];
            executedInstructions.add(header);
            if(instruction == 'acc'){
                acc += value;
                header += 1;
            }
            else if(instruction == 'jmp'){
                header += value;
            }
            else if(instruction == 'nop'){
                header += 1;
            }

            if(header === instructions.length - 1){
                return acc;
            }
        }
        return null;
    }