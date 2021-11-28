
const WrapMap = require('./WrapMap');

let testObject = {
    abort: {the: {program: "aborttheprogram"}}
};

function KeyWrap(originalmap) {
    let map = new WrapMap(originalmap);

}

module.exports = KeyWrap;