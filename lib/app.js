
const element = require('./element');



const makeables = {
    element: element
}

const heyapp = function() {

    heyapp.baseElement = "";

    heyapp.components = function() {

    }

    heyapp.make = function(name, callerContext) {

    }

    heyapp.process = function(name, callerContext) {
        callerContext ? callerContext.log ? callerContext.log(`app processinging ${name}`) : null : null;
        return name=='make' ? heyapp.make : 'unknown command'
    }

    return heyapp;
}


module.exports = heyapp;