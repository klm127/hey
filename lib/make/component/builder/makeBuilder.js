/**
 * @module make/component/builder/make
 * @description the component builder, called with app.make('component')
 */

const addGettersAndSetters = require('./getSet');
const addParentChildFunctions = require('./parentChild')

function* idGenerator(prepend) {
    id = 1;
    while(true) {
        yield prepend + id++;        
    }
}

const componentIdGenerator = idGenerator('component');

/**
 * 
 */
function _MakeBuilder(hey) {
    
    let scaffold = {
        name: componentIdGenerator.next(),
        type:"div",
        style: {}
    }

    let builder = function(parent) {
        if(!parent) parent = hey.app;
        scaffold.parent = parent;
        scaffold.children = [];
        for(child of builder._children) {
            let childScaffold = child(scaffold);
            scaffold.children.push(childScaffold);
        }
        return scaffold;
    }
    builder.scaffold = scaffold;
    builder._parent = null;

    builder = addGettersAndSetters(builder);
    builder = addParentChildFunctions(builder, hey);
    return builder;
}

module.exports = _MakeBuilder;