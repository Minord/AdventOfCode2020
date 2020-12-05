var inputURL = "https://gist.githubusercontent.com/Minord/400c952b5b5bbdb8b20e7178674b0a8d/raw/2ad54a40e45d0bffc1062d47b6cef9b308e13b46/day4";

var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', inputURL);
httpRequest.onload = function(){
    var input = httpRequest.responseText.split('\n\n');

    //Obligatory Fields
    var requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
    //Optional Fiels
    var optionalField = "cid";

    var validCounter = 0;


    input.forEach(passport => {
        var fields = passport.replace(/\n/g, " ").split(' ');
        var validity = passportValid();
        fields.forEach(passportField => {
            var values = passportField.split(':');
            var key = values[0].replace(' ', '');
            var value = values[1];
            if(requiredFields.includes(key)){
                validity[key] = validField(key, value);
            }
        });
        if(checkValidity(validity)){
            validCounter++;
        }
    });

    console.log(validCounter);
}
httpRequest.send();


function passportValid(){
    var passport = {
        "byr": false,
        "iyr": false,
        "eyr": false,
        "hgt": false,
        "hcl": false,
        "ecl": false,
        "pid": false
    };
    return passport;
}

function checkValidity(passport){
    var valid = true;
    Object.keys(passport).forEach(key => {
        if(passport[key] == false){
            valid = false;
        }
    });
    return valid;
}

function validField(key , value){
    if(key === "byr"){
        //byr (Birth Year) - four digits; at least 1920 and at most 2002.
        year = parseInt(value);
        if (year >= 1920 && year <= 2002){
            return true;
        }
    } else if(key === "iyr"){
        //iyr (Issue Year) - four digits; at least 2010 and at most 2020.
        year = parseInt(value);
        if (year >= 2010 && year <= 2020){
            return true;
        }
    } else if(key === "eyr"){
        //eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
        year = parseInt(value);
        if (year >= 2020 && year <= 2030){
            return true;
        }
    } else if(key === "hgt"){ 
        //hgt (Height) - a number followed by either cm or in:
        //If cm, the number must be at least 150 and at most 193.
        //If in, the number must be at least 59 and at most 76.
        if(/^(\d+)(cm|in)$/.test(value)){
            var num = Number(/\d+/.exec(value)); //Do the regext
            if (/cm$/.test(value)){
                if(num >= 150 && num <= 193){
                    return true;
                } 
            } 
            else if(/in$/.test(value)){
                if(num >= 59 && num <= 76){
                    return true;
                } 
            }
        }
    } else if(key === "hcl"){ 
        //hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        return /^#(\d|[a-f]){6}$/.test(value);
    } else if(key === "ecl"){
        //ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        valid_str = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
        if(valid_str.includes(value)){
            return true;
        }
    } else if(key === "pid"){
        //pid (Passport ID) - a nine-digit number, including leading zeroes.
        return /^\d{9}$/.test(value);       
    }
    return false;
}