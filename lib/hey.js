const heyapp = require('./app.js')

/**
 * @module hey
 * @description call with hey(cmdtxt)
 */

/** 
 * @typedef global 
 * @description passed as context to functions
 * @property {hey.app} app - the app
 * @property {hey} - hey function
 */
const heyGlobal = {};

/**
 * All app methods can be called on hey. E.g. hey.make is the same as hey.app.make
 * @param {string} name - the command name
 * @returns {hey.app} the app
 */
var hey = function(name) {
    if(name=='app') {
        let app = heyapp(heyGlobal);
        for(let key of Object.keys(app)) {
            if(!hey.hasOwnProperty(key)) {
                hey[key] = app[key];
            }
        }
        hey.app = app;
        return app;
    }
    else {
        return hey.app.process(name, callerContext)
    }
}

heyGlobal.hey = hey;

module.exports = hey;