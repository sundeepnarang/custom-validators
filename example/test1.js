/**
 * Created by sundeepnarang on 2/25/16.
 */

var validator = require("../index");

var exampleValdiator = validator({
    type: "string",
    sizeMax: 5,
    sizeMin: 0,
    spcChars : [
        {
            char : "e",
            maxCount : 1
        },{
            char : "t",
            maxCount : 2
        }
    ],
    regExp      : /^[a-z][a-z0-9_\-\.]*$/,
    regExpAnd   : [/^[A-Z][a-z0-9_\-\.]*$/, /^[a-z][a-z0-9_\-\.]*$/],
    regExpOr    : [/^[A-Z][a-z0-9_\-\.]*$/, /^[a-z][a-z0-9_\-\.]*$/]
});

var values = [
    "test", // null
    "test12345", // Array of Error with Length mismatch error
    "testt12345", // Array of Error with Length mismatch error
    "Atest", // Array of Error with Length mismatch error
    1, // Type mismatch error
    true, // Type mismatch error
    false // Type mismatch error
];


values.forEach(function(d){
    console.log(d,exampleValdiator(d));
});

process.exit(0);
