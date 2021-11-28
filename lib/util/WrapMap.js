/** 
 * @author Karl Miller
 * WrapMap uses recursive functions to transform objects which map primitive values.
 * 
 * Its primary purpose is to convert Primitive Endpoints of a Map to Functional Endpoints and to add Functional and Wrapped Endpoints to locations on the WrapMap where they could not be added otherwise, taking advantage of javascript first order functions having properties.
 * 
 * TERMS
 * -----
 * 
 * Map - An object which may contain nested objects having primitive value end points.
 * Primitive Endpoint - A final primitive value of a map traversal.
 * Wrapping - An object which wraps a Primitive Endpoint.
 * Functional Endpoint - An endpoint that has been wrapped in a function that is scoped to be able to access the original Primitive Endpoint value.
 * Path - A path to an Endpoint. Typically an array of strings representing keys which will be followed to the endpoint.
 * WrapMap - A map which has Wrappings or Functional Endpoints
 * 
 * USE
 * ---
 * const WrapMap = require('WrapMap');
 * const primitiveMap = {
 *      drag: {
 *          end: "ondragend",
 *          start: "ondragstart",      
 *      } };
 * const eventList = [];
 * const myCallBack = function(val,keys,list) {
 *      return function() {
 *          list.push(val)
 *      }
 * }
 * let wrapped = new WrapMap(primitiveMap, "_v");
 * wrapped.map.drag._v = "ondrag"
 * wrapped.functionize(myCallBack, [eventList]);
 * 
 * wrapped.map.drag.end() // pushes "ondragend to eventList"
 * wrapped.map.drag() // pushes "ondrag" to eventList
 * wrapped.map.drag.start() // pushes "ondragstart" to eventList
 * 
 * ---
 * You'll probably want to assign WrapMap.map to some other object after it's been functionalized.
 * 
 * */

const DEFAULT_FOUND_KEY = "_v";
const DEFAULT_KEYCHAIN_KEY = "_k";


/** 
 * wraps events as object with e.g ...click:{_event:onmouseclick} 
 * necessary for handing "drag" and "load" in a special way
 * produces a copy of the object wrapped, non-mutating
 * @param {Object} sourceWrapping - The object whose nested final properties to wrap
 * @param {string} [foundkey="_v"] - The key to put final values in in final value wraps
*/
function makeWrapMap(sourceWrapping, foundkey=DEFAULT_FOUND_KEY) {
    function recurse(nextObject, foundkey) {
        if(typeof nextObject != "object") {
            let finalObject = {};
            finalObject[foundkey] = nextObject;
            return finalObject;
        }
        let keys = Object.keys(nextObject);
        let fragment = {};
        for(let key of keys) {
            fragment[key] = recurse(nextObject[key], foundkey);
        }
        return fragment;
    }
    return recurse(sourceWrapping, foundkey);
}

/**
 * Gets a final value from a wrap map given a path in the form of an array
 * @param {Object} wrapMap - Object that's been wrapped
 * @param {Array} arrOrStr - path to the value
 * @param {string} [foundkey="_v"] - The special key final values are stored in
 * @param {boolen} [getObject=false] - Whether to return the wrapper object or the value wrapped
 * @param {boolean} [guess=false] - when path is reached, if foundkey is not found, if there is just 1 property, whether to return that value
 */
function getWrapped(wrapMap, arrOrStr, foundkey=DEFAULT_FOUND_KEY, getObject=false, guess=false) {
    if(typeof arrOrStr == "string") arrOrStr = [arrOrStr];
    function recurse(nextObject, keychain, fk, gettingObject) {
        if(keychain.length == 0) return gettingObject ? nextObject : nextObject[fk];
        else return recurse(nextObject[keychain[0]], keychain.slice(1), fk, gettingObject);
    }
    function recurse2(nextObject, keychain, fk, getobject) {
        if(!keychain.length != 0) return recurse2(nextObject[keychain[0]], keychain.slice(1),fk, getobject);
        else if(nextObject.hasOwnProperty(fk)) return nextObject[f];
        else {
            let keys = Object.keys(nextObject);
            if(keys.length == 1) return getobject ? nextObject : nextObject[keys[0]];
            else throw `could not find ${foundkey} in ${keychain} when getting from wrapmap`;
        }
    }
    if(guess) return recurse2(wrapMap, arrOrStr, foundkey, getObject);
    else return recurse(wrapMap, arrOrStr, foundkey, getObject);
}

/** 
 * Finds the endpoint values of the wrap map and assigns them to the result of calling the modify function, passing the final value as a parameter
 * @param {Object} wrapMap - Object that's been wrapped
 * @param {function} modifyFunction - The function that modifies end point values
 * @param {Array} args - Arguments to pass to the modify function
 * @param {string} [foundkey="_v"] - The key for final values - only vals assigned to this key will be changed
 * @param {boolean} wantsWrapper - Causes the wrapper to be passed to modifyFunction instead of just the value
 */
function modifyEndsWithFunction(wrapMap, modifyFunction, args=[], foundkey=DEFAULT_FOUND_KEY, wantsWrapper=false) {
    function recurse(next, fk, params, mod, wantsWrapper) {
        for(key of Object.keys(next)) {
            if(key != fk) recurse(next[key], fk, params, mod, wantsWrapper);
        }
        if(next.hasOwnProperty(fk)) {
            next[fk] = wantsWrapper ? mod(next, ...params) : mod(next[fk], ...params);
        };
    }
    recurse(wrapMap, foundkey, args, modifyFunction, wantsWrapper)
    return wrapMap;
}

/**
 * Adds an array to each final value wrapper representing the keys chained to get there
 */
function addKeyChain(wrapMap, keychainkey=DEFAULT_KEYCHAIN_KEY, foundkey=DEFAULT_FOUND_KEY) {
    function recurse(next, chain, fk, kck) {
        for(let key of Object.keys(next)) {
            if(key == fk) {
                next[kck] = chain;
            }
            else {
                let newArray = Array.from(chain);
                newArray.push(key);
                recurse(next[key], newArray, fk, kck);
            }
        }
    }
    recurse(wrapMap, [], foundkey, keychainkey);
}

/**
 * Converts the wrapped end points to functions. Calls the function generator with the found value and the found keychain (if extant). Replaces the wrapper area with that function. Assigns other nested object paths to the function as properties, excluding the final key and keychain key from the function properties.
 * @param {Object} wrapMap - The object with wrapped props
 * @param {function} functionGenerator - A function which returns a function
 * @param {string} foundkey - The key representing a found value
 * @param {string} keychainkey - The keychain key
 * @param {array} additionalArgs - Additional arguments to pass to the generator function
 */
function getFunctionizedWrapMap(wrapMap, functionGenerator, foundkey=DEFAULT_FOUND_KEY, keychainkey=DEFAULT_KEYCHAIN_KEY, additionalArgs=[]) {
    if(!functionGenerator) functionGenerator = (val) => {return ()=> {return val}}
    function recurse(next, funcmaker, fk, kck, args) {
        if(next[fk]) {
            let newFunction = funcmaker(next[fk], next[kck], ...args);
            for(let key of Object.keys(next)) {
                if(key != fk && key != kck) {
                    newFunction[key] = recurse(next[key], funcmaker, fk, kck, args);
                }
                else {
                }
            }
            return newFunction;
        }  
        else {
            let newNext = {};
            for(let key of Object.keys(next)) {
                if(key != kck) {
                    newNext[key] = recurse(next[key], funcmaker, fk, kck, args);
                }
            }
            return newNext;
        }
    }
    return recurse(wrapMap, functionGenerator, foundkey, keychainkey, additionalArgs);
}


/**
 * @classdesc uses recursive functions to transform objects which map primitive values.
 */
class WrapMap {
    /**
     * @param {Object} objectToMap - The object to map
     * @param {string} foundkey - The key of the primitive in the final wrapper
     */
    constructor(objectToMap, foundkey=DEFAULT_FOUND_KEY, keychainkey=DEFAULT_KEYCHAIN_KEY) {
        /** A wrapped map - non mutating */
        this.map = makeWrapMap(objectToMap, foundkey);
        /** The found key */
        this.foundkey = foundkey;
        this.keychainkey = keychainkey;
    }
    /**
     * Gets a final value from the map from an array path
     * @param {Array} arr - The path to the value in the wrap map
     * @param {boolean} getobject - whether to return the wrapper object or the value as defined by found key
     * @param {boolean} guess - whether to guess the primitive final value if the found key isn't found when path is finished recursing
     */
    get(path, getobject=false, guess=false) {
        return getWrapped(this.map, path, this.foundkey, getobject, guess);
    }
    /**
     * Modifies all final values in the wrap by calling the function on them, passing the final value as a param and assigning the final value to the return of the function
     * @param {function} f - The function to call on all final values
     */
    mod(f, args=[]) {
        return modifyEndsWithFunction(this.map, f, args, this.foundkey);
    }

    /** 
     * Turns endpoints into functions. funcMaker should return a function. funcMaker will be passed (_val, _keychain, ...additionalArgs). The function returned will be assigned to that position in the wrap map. _val and _keychain will be excluded as properties and the rest of the paths will be assigned as normal.
     * @param {function} funcMaker - A function which returns a function
     * @param {array} additionalArgs - Additional arguments to pass to funcmaker besides value and keychain
     */
    functionize(funcMaker, additionalArgs=[]) {
        this.map = getFunctionizedWrapMap(this.map, funcMaker, this.foundkey, this.keychainkey, additionalArgs);
        this.addkeychains = ()=> {return "cant add keychains after functionizing"}
        this.mod = ()=>{return "cant mod after functionizing"};
        this.get = (path, getObject=false, guess=true) =>{ return this.get(path, getObject, guess)};
    }
    /** adds keychains to end points */
    addkeychains() {
        addKeyChain(this.map, this.keychainkey, this.foundkey);
    }
}

module.exports = WrapMap;