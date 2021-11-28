
/**
 * probs: drag, load
 */

const ON_MAP = {
    abort: "onabort",
    animation: {
        end: "onanimationend",
        iteration: "onanimationiteration",
        start: "onanimationstart",
        cancel: "​onanimationcancel"
    },
    aux: {click: "onauxclick"},
    before: {input: "onbeforeinput"},
    blur: "onblur",
    can:{play: "oncanplay"},
    can:{play:{through: "oncanplaythrough"}},
    change: "onchange",
    click: "onclick",
    close: "onclose",
    context:{menu:"oncontextmenu"},
    copy: "oncopy",
    cue:{change:"oncuechange"},
    cut: "oncut",
    double: {click: "ondblclick"},
    dbl:{click:"ondblclick"},
    drag: "ondrag",
    dragend: "ondragend",
    dragenter: "ondragenter",
    dragexit: "ondragexit",
    dragleave: "ondragleave",
    dragover: "ondragover",
    dragstart: "ondragstart",
    drop: "ondrop",
    duration: {change: "ondurationchange"},
    emptied: "onemptied",
    ended: "onended",
    error: "onerror",
    focus: "onfocus",
    formdata: "onformdata",
    form: {data: "onformdata"},
    full: { screen: { 
            change: "onfullscreenchange",
            error: "onfullscreenerror" }},
    got: {pointer: {capture: "ongotpointercapture"}},
    input: "oninput",
    invalid: "oninvalid",
    key: { down: "onkeydown", up: "onkeyup", press:"onkeypress" },
    load: "onload",
    loaded: {metadata: "onloadedmetadata", data:"onloadeddata"},
    loadend: "onloadend",
    loadstart: "onloadstart",
    lost:{pointer:{capture:"onlostpointercapture"}},
    mouse:{
        down:"onmousedown", leave:"onmouseleave", move:"onmousemove",out:"onmouseout", up:"onmouseup"
    },
    mozfullscreenchange: "onmozfullscreenchange",
    mozfullscreenerror: "onmozfullscreenerror",
    moz: {full:{screen:{
        change:"onmozefullscreenchange", 
        error:"onmozfullscreenerror"}}},
    paste: "onpaste",
    pause: "onpause",
    play: "onplay",
    playing: "onplaying",
    pointer: {
        cancel: "onpointercancel",
        down: "onpointerdown",
        enter: "onpointerenter",
        leave: "onpointerleave",
        move: "onpointermove",
        out: "onpointerout",
        over: "onpointerover",
        up: "onpointerup"
    },
    progress: "onprogress",
    rate:{change: "onratechange"},
    reset: "onreset",
    resize: "onresize",
    scroll: "onscroll",
    security:{policy:{violation: "onsecuritypolicyviolation"}},
    seeked: "onseeked",
    seeking: "onseeking",
    select: "onselect",
    selection: {change:"onselectionchange"},
    selectstart: "onselectstart",
    slotchange: "onslotchange",
    stalled: "onstalled",
    submit: "onsubmit",
    suspend: "onsuspend",
    time:{update:"ontimeupdate"},
    toggle: "ontoggle",
    transition: {
        cancel: "ontransitioncancel",
        end: "ontransitionend",
        run: "ontransitionrun",
        start: "ontransitionstart",
    },
    volume:{change: "onvolumechange"},
    waiting: "onwaiting",
    webkit:{
        animation: {
            end: "onwebkitanimationend",
            iteration: "onwebkitanimationiteration",
            start: "onwebkitanimationstart"
        },
        transitionend: "onwebkittransitionend"
    },
    wheel: "onwheel"
}

/** 
 * wraps events as object with e.g ...click:{_event:onmouseclick} 
 * necessary for handing "drag" and "load" in a special way
 * produces a copy of the object wrapped, non-mutating
 * @param {Object} sourceWrapping - The object whose nested final properties to wrap
 * @param {string} [foundkey="_v"] - The key to put final values in in final value wraps
*/
function makeWrapMap(sourceWrapping, foundkey="_v") {
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
 * @param {boolean} [guess=false] - when path is reached, if foundkey is not found, if there is just 1 property, whether to return that value
 */
function getWrapped(wrapMap, arrOrStr, foundkey="_v", guess=false) {
    function recurse(nextObject, keychain, fk) {
        if(keychain.length == 0) return nextObject[fk];
        else return recurse(nextObject[keychain[0]], keychain.slice(1), fk);
    }
    function recurse2(nextObject, keychain, fk) {
        if(!keychain.length != 0) return recurse2(nextObject[keychain[0]], keychain.slice(1));
        else if(nextObject.hasOwnProperty(fk)) return nextObject[f];
        else {
            let keys = Object.keys(nextObject);
            if(keys.length == 1) return nextObject[keys[0]];
            else throw `could find ${foundkey} in ${arrOrStr} when getting from wrapmap`;
        }
    }
    if(guess) return recurse2(wrapMap, arrOrStr, foundkey);
    else return recurse(wrapMap, arrOrStr, foundkey);
}

/** 
 * Finds the endpoint values of the wrap map and assigns them to the result of calling the modify function, passing the final value as a parameter
 * @param {Object} wrapMap - Object that's been wrapped
 * @param {function} modifyFunction - The function that modifies end point values
 * @param {string} [foundkey="_v"] - The key for final values - only vals assigned to this key will be changed
 */
function modifyEndsWithFunction(wrapMap, modifyFunction, foundkey="_v") {
    function recurse(next, fk, mod) {
        for(key of Object.keys(next)) {
            if(key != fk) recurse(next[key], fk, mod);
        }
        if(next.hasOwnProperty(fk)) {
            next[fk] = modifyFunction(next[fk])
        };
    }
    recurse(wrapMap, foundkey, modifyFunction)
    return wrapMap;
}


class WrapMap {
    constructor(objectToMap, foundkey = "_v") {
        this.map = makeWrapMap(objectToMap, foundkey);
        this.foundkey = foundkey;
    }
    get(arr, guess=false) {
        return getWrapped(this.map, arr, this.foundkey, guess);
    }
    mod(f) {
        return modifyEndsWithFunction(this.map, f, this.foundkey);
    }
}

module.exports = WrapMap;