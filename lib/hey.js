const heyapp = require('./app.js');
const configBuilder = require('./config/configBuilder');

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
const globalConfigUpdates = {
    launch_directory: process.cwd()
};
const configurator = configBuilder(globalConfigUpdates)

/**
 * All app methods can be called on hey. E.g. hey.make is the same as hey.app.make
 * @param {string} name - the command name
 * @returns {hey.app} the app
 */
var hey = function(name) {
    hey.config = configurator
    if(name=='app') {
        let app = heyapp(hey);
        for(let key of Object.keys(app)) {
            if(!hey.hasOwnProperty(key)) {
                hey[key] = app[key];
            }
        }
        return app;
    }
    else if(name=='config') {
        return configurator;
    }
    else {
        return hey.app.process(name)
    }
}

module.exports = hey;