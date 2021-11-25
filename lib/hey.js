const heyapp = require('./app.js')

/**
 * 
 * @param {string} name - 
 * @param {callerContext} callerContext - 
 */
const hey = function(name, callerContext) {
    if(name=='app') {
        if(!hey.app) {
            hey.app = heyapp();
            callerContext ? callerContext.log ? callerContext.log('new app created') : null : null;
            return hey.app.process;
        } else {
            return hey.app.process;
        }
    }
    else {
        return hey.app.process(name, callerContext);
    }
}

module.exports = hey;