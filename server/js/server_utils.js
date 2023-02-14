// Import Performance
const { performance } = require('perf_hooks');

// ***** Export Functions *****
/**
 * Function to generate a unique 32 character ID with the given prefix
 * @param prefix is the given prefix
 * @returns {*} is the generated ID
 */
function generateID(prefix) {
    let alphaNumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let id = prefix;
    for(let i = 0; i < 32; i++) {
        let index = Math.floor(Math.random() * alphaNumeric.length);
        id += alphaNumeric.charAt(index);
    }
    return id;
}

/**
 * Function to generate a random number between 1 and 2^32
 * @returns {number} the generated number
 */
function generateNum() {
    return Math.floor(Math.random() * Math.pow(2, 32));
}

/**
 * Function to determine if a given string is a valid alphanumeric
 * @param s is the given string
 * @returns {*} is the if the string is a valid alphanumeric
 */
function isAlphanumeric(s) {
    return s.match(/^[0-9a-zA-Z]+$/);
}



// *** Export Functions ***
module.exports = {generateID, generateNum, isAlphanumeric};



// ***** Private Functions *****