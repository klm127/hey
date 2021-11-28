
const WrapMap = require('../../../util/WrapMap');

/**
 * probs: ondrag, onload
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

class DOMEventLink {
    constructor(componentbuilder, event, f) {
        /** the event to listen for */
        this.event = event;
        /** the text of the callback to write in the <script> tag */
        this.ftext = f.toString();
        componentbuilder.scaffold._eventLinks.add(this);
    }
    getScriptString(id) {
        console.log('script string called!')
        return `document.getElementById("${id}").${this.event} = ${this.ftext};\n`
    }
}

/** adds relevant functionality to a component */
function mixinDomEventFunctionalityToComponent(componentbuilder) {
    componentbuilder.scaffold._eventLinks = new Set();
    let wrapmap = new WrapMap(ON_MAP);
    wrapmap.map.drag._v = "ondrag";
    wrapmap.map.load._v = "onload";
    let makeLinks = function(val, keys, component) {
        return function(DOMeventResultCallbackFunction) {
            let link = new DOMEventLink(component, val, DOMeventResultCallbackFunction);
            return component;
        }
    }
    wrapmap.functionize(makeLinks, [componentbuilder]);
    componentbuilder.on = wrapmap.map;
    return componentbuilder;
}


module.exports = mixinDomEventFunctionalityToComponent;