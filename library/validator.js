/**
 * Created by sundeepnarang on 2/18/16.
 */

function checkTypeFunction(type){
    if(type=="string"){
        return function (val){
            return typeof val=="string";
        }
    } else if(type=="number"){
        return function (val){
            return typeof val=="number";
        }
    } else if(type=="object"){
        return function (val){
            return typeof val=="object";
        }
    } else if(type=="boolean"){
        return function (val){
            return typeof val=="boolean";
        }
    } else if(type=="undefined"){
        return function (val){
            return typeof val=="undefined";
        }
    } else if(type=="array"){
        return function (val){
            return typeof val=="object" && val instanceof Array;
        }
    }  else if(type=="date"){
        return function (val){
            return typeof val=="object" && val instanceof Date
        }
    }  else if(type=="null"){
        return function (val){
            return  val ===null;
        }
    } else{
        return function (){ return true};
    }
}
function checkSpcChars(val,char,count){
    return val.split(char).length<=count+1;
}

function stringFunctions(obj){
    var lengthCheck = function (){ return true};
    if(typeof (obj.size) == "number"){
        lengthCheck = function(val){
            return val.length==obj.size;
        }
    }

    var lengthMinCheck = function (){ return true};
    if(typeof (obj.sizeMin) == "number"){
        lengthMinCheck = function(val){
            return val.length>=obj.sizeMin;
        }
    }

    var lengthMaxCheck = function (){ return true};
    if(typeof (obj.sizeMax) == "number"){
        lengthMaxCheck = function(val){
            return val.length<=obj.sizeMax;
        }
    }

    var validValuesCheck = function (){ return true};
    if(typeof (obj.validValues) == "object" && obj.validValues instanceof Array){
        validValuesCheck = function(val){
            return obj.validValues.indexOf(val)!=-1;
        }
    }

    var regexCheck = function (){ return true};
    if(typeof (obj.regExp)=="object" && obj.regExp instanceof RegExp){
        regexCheck = function(val){
            return obj.regExp.test(val);
        }
    }

    var regexAndCheck = function (){ return true};
    if(typeof (obj.regExpAnd) == "object" && obj.regExpAnd instanceof Array && obj.regExpAnd.length){
        obj.regExpAnd.forEach(function(d,i){
            if(!(typeof (d)=="object" && d instanceof RegExp)){
                throw new Error(i+ "th value Not a regex in array of regex and!");
            }
        });
        regexAndCheck = function(val){
            if(obj.regExpAnd.length<2){
                return obj.regExpAnd[0].test(val);
            }
            return obj.regExpAnd.reduce(function(a,b){
                return a.test(val)&& b.test(val);
            });
        }
    }

    var regexOrCheck = function (){ return true};
    if(typeof (obj.regExpOr) == "object" && obj.regExpOr instanceof Array && obj.regExpOr.length){
        obj.regExpOr.forEach(function(d,i){
            if(!(typeof (d)=="object" && d instanceof RegExp)){
                throw new Error(i+ "th value Not a regex in array of regex or!");
            }
        });
        regexOrCheck = function(val){
            if(obj.regExpOr.length<2){
                return obj.regExpOr[0].test(val);
            }
            return obj.regExpOr.reduce(function(a,b){
                return a.test(val)|| b.test(val);
            });
        }
    }

    var spcCharsCountCheck = function (){ return true};
    if(typeof (obj.spcChars)=="object" && obj.spcChars instanceof Array){
        obj.spcChars.forEach(function(d,i){
            if(typeof (d)!="object" || typeof(d.char) != "string" || typeof (d.maxCount)!="number"){
                throw new Error(i+ "th value not a special char object!");
            }
        });
        spcCharsCountCheck = function(val){
            return obj.spcChars.reduce(function(a,b){
                return checkSpcChars(val, a.char, a.maxCount) && checkSpcChars(val, b.char, b.maxCount);
            });
        }
    }


    return function (val,done){
        var errors = [];
        if(!lengthCheck(val)){
            errors.push(new Error("Length Mismatch"));
        }
        if(!lengthMinCheck(val)){
            errors.push(new Error("Length Minimum Mismatch"));
        }
        if(!lengthMaxCheck(val)){
            errors.push(new Error("Length Maximum Mismatch"));
        }
        if(!validValuesCheck(val)){
            errors.push(new Error("Invalid Value"));
        }
        if(!regexCheck(val)){
            errors.push(new Error("Invalid Value Pattern"));
        }
        if(!regexAndCheck(val)){
            errors.push(new Error("Invalid Value And Pattern"));
        }
        if(!regexOrCheck(val)){
            errors.push(new Error("Invalid Value Or Pattern"));
        }
        if(!spcCharsCountCheck(val)){
            errors.push(new Error("Invalid Number of Special Chars"));
        }
        if(!errors.length){
            errors=null;
        }
        if(typeof(done) == "function"){
            done(errors);
            return;
        }
        return errors;
    };
}


function validator(obj){
    if(!obj || typeof obj != "object"){
        return null;
    }

    var typeCheck = function (){ return true};

    if(obj.type){
        typeCheck = checkTypeFunction(obj.type)
    } else {
        throw new Error("Type is needed to perform validate.");
    }

    var typeSpecificFunctions = function (val,done){
        if(typeof(done) == "function"){
            done(null);
            return;
        }
        return null
    };

    switch (obj.type){
        case "string" :
            typeSpecificFunctions = stringFunctions(obj);
            break;
    }

    return function (val,done){
        if(!typeCheck(val)){
            var error = new Error("Type mismatch");
            if(typeof(done) == "function"){
                return done(error)
            }
            return error;
        }

        return typeSpecificFunctions(val,done);

    }
}

module.exports = validator;