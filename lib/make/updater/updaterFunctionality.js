/**
 * @module app/updaterFunctionality
 */

const UpLinker = require('./UpLinker');

/** adds "when" command to app */
function addUpdaterFunctionality(app, hey) {

    let upBuilder = function (scaffold) {
        // stuff for adding updates to the scaffold? Or at least to compress to a javascript
        for(let c of upBuilder._children) {
            hey.config.log(`upbuilder child: ${c}`)
        }
    }
    upBuilder._children = new Set();

    app.when = addWhenCb(upBuilder);
    app._upBuilder = upBuilder;

    return upBuilder;

}

function addWhenCb(upBuilder) {
    return function(component) {
        let u = new UpLinker(upBuilder, component)
        return u.getCommandsObject();
    }
}

module.exports = addUpdaterFunctionality;

