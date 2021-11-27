/**
 * @module hey.app
 * @description application commands
 */

const component = require('./make/component/builder/makeBuilder');
const parentChildMixin = require('./make/component/builder/parentChild');


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
heyappBuilder = function(hey) {

    let heyapp = {};
    hey.app = heyapp;
    heyapp.hey = hey;

    /**
     * starts a make command if key is in the makable object
     */
    heyapp.make = function(name) {
        if(arguments.length == 0) {
            return makeables.component(hey);
        }
        else if(name in makeables) {
            return makeables[name](hey)
        } else {
            return `unknown makable: ${name}`
        }
    }

    heyapp.render = function(type, specificPath) {
        if(type == "html") {
            let render = require('./render/html');
            render(hey, specificPath);
        } else {

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

    heyapp.get = {};
    heyapp.with = {};

    parentChildMixin(heyapp, hey);

    return heyapp;
}



module.exports = heyappBuilder;