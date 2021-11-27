/**
 * @module make/component/builder/parentChildCommands
 * @description A mixin module which is called on a component builder during construction of the builder. It adds function paths for navigating and adding parent and child elements
 */

/**
 * Adds functions to change scaffold props on a builder. Mixed in AFTER getSet scaffold commands are mixed in because it uses the get command path.
 * @param {componentBuilder} builder - The make component builder function
 * @param {context} hey - the hey global context
 * @returns {module:make/component/builder/getSetCommands~componentBuilderChanges} builder - The builder, with new properties and methods added
 */
function _parentChildCommands(b, hey) {
    if(!b._children) b._children = new Set();

    b.add = addChildCb(b, hey) 
    b.add = addChildCb(b, hey);
    b.add.child = addChildCb(b, hey);
    b.add.new = addChildCb(b, hey);
    b.add.new.child = addChildCb(b, hey);
    b.add.children = addChildCb(b, hey, true);
    b.add.all = addChildCb(b, hey, true);
    b.add.all.children = addChildCb(b, hey, true);
    b.add.a = addChildCb(b, hey);
    b.add.a.child = addChildCb(b,hey);
    b.add.to = addToParentCb(b);
    b.add.to.parent = addToParentCb(b);
    b.add.sibling = addSiblingCb(b)
    b.add.new.sibling = addSiblingCb(b);
    b.add.a.sibling = addSiblingCb(b);
    b.add.siblings = addSiblingCb(b);    

    b.attach = addChildCb(b, hey);
    b.attach.child = addChildCb(b, hey);
    b.attach.all = addChildCb(b, hey);
    b.attach.a = addChildCb(b, hey);
    b.attach.children = addChildCb(b, hey, true);

    b.detach = detachCb(b);
    b.detach.from = {};
    b.detach.from.parent = detachCb(b);

    b.remove = detachChildCb(b);
    b.remove.parent = detachCb(b);
    b.remove.from = detachCb(b);
    b.remove.from.parent = detachCb(b);
    b.parent = getParentCb(b);

    // todo - finish these functions
    b.get.parent = getParentCb(b);
    b.get.grandparent = getGrandparent(b);
    if(!b.get.first) b.get.first = {};
    b.get.first.child = {};
    b.get.first.parent = getParentCb(b);
    if(!b.get.last) b.get.last = {};
    b.get.last.child = {};
    b.get.last.parent = {};
    b.get.children = b._children;
    b.with.child = addChildCb(b, hey);
    b.with.parent = addToParentCb(b);
    b.with.sibling = addSiblingCb(b);
    return b;
}

function addChildCb(b, hey, returnParent=false) {
    return function(builders) {
        let bs = [];
        let finalBuilders = [];
        if(!builders || builders == undefined) {
            bs.push(hey.app.make('component'))
        } else {
            bs.push(...arguments)
        }
        let i = 0;
        for(let newB of bs) {
            if(typeof newB == "string") {
                newB = hey.app.make(newB);
            }
            if(newB._parent) newB.detach();
            newB._parent = b;
            b._children.add(newB);
            finalBuilders.push(newB);
        }
        if(returnParent || bs.length > 1) return b;
        else return finalBuilders[0];
    }
}

function addSiblingCb(b) {
    return function(sib) {
        if(!b._parent) return b;
        return b._parent.add.new.child(sib);
    }
}

function detachChildCb(b) {
    return function(newb) {
        b._children.delete(newb);
        newb._parent = undefined;
        return b;
    }
}

function detachCb(b) {
    return function() {
        if(b._parent) {
            b._parent._children.delete(b);
        }
        b._parent = undefined;
        return b;
    }
}

function addToParentCb(b) {
    return function(newParent) {
        b.detach();
        return newParent.attach(b);
    }
}

function getParentCb(b, hey) {
    return function() {
        // insert error log
        return b._parent;
    }
}

function getGrandparent(b, hey) {
    return function() {
        return b.parent().get.parent();
    }
}

module.exports = _parentChildCommands;