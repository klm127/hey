/**
 * @module hey.app
 * @description application commands
 */

const component = require('./make/component/builder/makeBuilder');


/**
 * @typedef makables
 * @description stuff that can be made with app.make
 * @property {component.makeComponent} component - make component command tree
 */
const makeables = {
    component: component
}

/**
 * 
 */
heyappBuilder = function(heyGlobal) {

    let heyapp = {};
    heyGlobal.app = heyapp;
    heyapp.global = heyGlobal;

    /**
     * starts a make command if key is in the makable object
     */
    heyapp.make = function(name) {
        if(arguments.length == 0) {
            return makeables.component(heyapp.global);
        }
        else if(name in makeables) {
            return makeables[name](heyapp.global)
        } else {
            return `unknown makable: ${name}`
        }
    }

    /**
     * returns app[name] if app[name] is a function
     * @memberof heyapp
     * @param {string} name - the name of the command
     */
    heyapp.process = function(name) {
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