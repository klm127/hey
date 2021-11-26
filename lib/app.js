
const component = require('./makeComponent');



const makeables = {
    component: component
}

/**
 * @implements heypi.component
 */
heyappBuilder = function(heyGlobal) {

    let heyapp = {};
    heyGlobal.app = heyapp;
    heyapp.global = heyGlobal;

    heyapp.make = function(name) {

        if(name in makeables) {
            return makeables[name](heyapp.global)
        } else {
            return `unknown makable: ${name}`
        }
    }

    heyapp.process = function(name, callerContext) {
        if(heyapp.hasOwnProperty(name)) {
            targ = heyapp[name];
            if(typeof targ == "function") {
                return targ;
            }
        }
        else {
            return `unknown app command ${name}`
        }
    }

    return heyapp;
}


module.exports = heyappBuilder;