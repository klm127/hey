


class UpLinker {
    constructor(upBuilder, component) {
        this.upBuilder = upBuilder;
        this.startc = component;
        this.startk = null;
        this.is = null;
        this.endc = null;
        this.endk = null;
        this.loaded = false;
    }

    getCommandsObject() {
        let chain = {};
        if(!this.startk) return addStartKeyProps(this, chain);
        else if(!this.is) return addStartKeyProps(this, chain)[this.startk]
        else if(!this.endc) return addStartKeyProps(this, chain)[this.startk][this.is]
        else if(!this.endk) return addStartKeyProps(this, chain)[this.startk][this.is](this.endc)
        else return addStartKeyProps(this, chain)[this.startk][this.is](this.endc)[this.endk]
    }

    toString() {
        let sb = `uplinker:${this.startc.scaffold.name}`
        if(!this.startk) return sb + ` ❌ incomplete, no key defined`;
        sb += `.${this.startk} `;
        if(!this.is) return sb + ` ❌ incomplete, no test defined`;
        sb += `${this.is} `;
        if(!this.endc) return sb + ` ❌ incomplete, no end component to test against`;
        sb += `${this.endc.scaffold.name}`;
        if(!this.endk) return sb + ` ❌ incomplete, no end property to test`;
        return sb += `.${this.endk} 👍`
    }
    
    loadSelections(startkey, equalityType, endComponent, endKey) {
        this.startk = startkey;
        this.is = equalityType;
        this.endc = endComponent;
        this.endk = endKey;
        this.upBuilder._children.add(this);
    }
}

/** adds linkages to ask initial key: e.g: when('obj').propertyName <-- adds .propertyName for each property */
function addStartKeyProps(uplinker, chain) {
    for(let key of Object.keys(uplinker.startc.scaffold)) {
        chain[key] = {};
        addConditionProps(uplinker, chain[key], key)
    }
    return chain;
}

/** adds linkages to ask type of operator: e.g: when('obj').propertyName.is.equal.to <-- adds chains like 'is.equal.to' for each type of test */
function addConditionProps(uplinker, chain, startkey) {
    chain["=="] = askEndComponentCb(uplinker, startkey, "==");
    chain[">="] = askEndComponentCb(uplinker, startkey, ">=");
    chain[">"] = askEndComponentCb(uplinker, startkey, ">");
    chain["<="] = askEndComponentCb(uplinker, startkey, "<=");
    chain["<"] = askEndComponentCb(uplinker, startkey, "<");
    chain["!="] = askEndComponentCb(uplinker, startkey, "!=");
    chain.equals = askEndComponentCb(uplinker, startkey, "==");
    chain.greater = askEndComponentCb(uplinker, startkey, ">");
    chain.greater.than = askEndComponentCb(uplinker, startkey, ">");
    chain.is = askEndComponentCb(uplinker, startkey, "==");
    chain.is.equal = askEndComponentCb(uplinker, startkey, "==");
    chain.is.equal.to = askEndComponentCb(uplinker, startkey, "==");
    chain.is.greater = askEndComponentCb(uplinker, startkey, ">");
    chain.is.greater.or = askEndComponentCb(uplinker, startkey, ">=");
    chain.is.greater.or.equal = askEndComponentCb(uplinker, startkey, ">=");
    chain.is.greater.or.equal.to = askEndComponentCb(uplinker, startkey, ">=");
    chain.is.greater.than = askEndComponentCb(uplinker, startkey, ">");
    chain.is.greater.than.or = askEndComponentCb(uplinker, startkey, ">=");
    chain.is.greater.than.or.equal = askEndComponentCb(uplinker, startkey, ">=");
    chain.is.greater.than.or.equal.to = askEndComponentCb(uplinker, startkey, ">=");
    chain.is.less = askEndComponentCb(uplinker, startkey, "<");
    chain.is.less.than = askEndComponentCb(uplinker, startkey, "<");
    chain.is.less.than.or = askEndComponentCb(uplinker, startkey, "<=");
    chain.is.less.than.or.equal = askEndComponentCb(uplinker, startkey, "<=");
    chain.is.less.than.or.equal.to = askEndComponentCb(uplinker, startkey, "<=");
    chain.is.not = askEndComponentCb(uplinker, startkey, "!=");
    chain.is.not.equal = askEndComponentCb(uplinker, startkey, "!=");
    chain.is.not.equal.to = askEndComponentCb(uplinker, startkey, "!=");
    chain.less = askEndComponentCb(uplinker, startkey, "<");
    chain.less.than = askEndComponentCb(uplinker, startkey, "<");
    chain.less.than.or = askEndComponentCb(uplinker, startkey, "<=");
    chain.less.than.or.equal = askEndComponentCb(uplinker, startkey, "<=");
    chain.less.than.or.equal.to = askEndComponentCb(uplinker, startkey, "<=");
    chain.not = askEndComponentCb(uplinker, startkey, "!=");
    chain.not.equal = askEndComponentCb(uplinker, startkey, "!=");
    chain.not.equal.to = askEndComponentCb(uplinker, startkey, "!=");
}

function askEndComponentCb(uplinker, startkey, equalityType) {
    return function(endComponent) {
        let chain = {}
        for(let key of Object.keys(endComponent.scaffold)) {
            chain[key] = applyOptionsCb(uplinker, startkey, equalityType, endComponent, key);
        }
        return chain;
    }
}

function applyOptionsCb(uplinker, startkey, equalityType, endComponent, endKey) {
    return function() {
        uplinker.loadSelections(startkey, equalityType, endComponent, endKey);
        return uplinker;
    }
}


module.exports = UpLinker;