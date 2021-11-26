const heyapp = require('./app.js')

/**
 * 
 * @param {string} name - the command name
 */
const heyGlobal = {};

var hey = function(name) {
    if(name=='app') {
        let app = heyapp(heyGlobal);
        for(let key of Object.keys(app)) {
            hey[key] = app[key];
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