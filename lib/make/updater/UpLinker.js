

/** 
 * syntax: 
 * 
 * hey.when(component1).flag.is.equal.to(component2).flag
 *  .then.set.style.to(BIGRED)
 * 
 * hey.when(component1).num.is.greater.than(5).set.content.to("you win!")
 * 
 * hey.when(component1).is.clicked.add(1).to.clickCount
 * 
 * hey.when(component1).is.clicked.execute( (htmlElement, appGlobal)=> {
 *      appGlobal.n += 2;
 * })
 * 
 * @todo currently the conditional is working but needs the effect
 *  */
class UpLinker {
    constructor(upBuilder, component) {
        this.upBuilder = upBuilder;
        this.startc = component;
        this.startk = null;
        this.is = null;
        this.endc = null;
        this.endtype = null;
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
    
    loadSelections(startkey, equalityType, endComponent, endValType, endKey) {
        this.startk = startkey;
        this.is = equalityType;
        this.endc = endComponent;
        this.endk = endKey;
        this.endtype = endValType;
        this.upBuilder._children.add(this);
        if(this.upBuilder._children.has(this)) this.loaded = true;
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
    return function(endVal) {
        let valType = typeof endVal;
        if(["object", "function"].includes(valType)) {
            let chain = {}
            let keySource = endVal;
            if(endVal.scaffold) {
                keySource = endVal.scaffold;
            }
            for(let key of Object.keys(keySource)) {
                chain[key] = applyOptionsCb(uplinker, startkey, equalityType, endVal, valType, key);
            }
            return chain;
        } else {
            return applyOptionsCb(uplinker, startkey, equalityType, endVal, valType)
        }
    }
}

function applyOptionsCb(uplinker, startkey, equalityType, endComponent, valType, endKey) {
    return function() {
        uplinker.loadSelections(startkey, equalityType, endComponent, valType, endKey);
        return uplinker;
    }
}


module.exports = UpLinker;