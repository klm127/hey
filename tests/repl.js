const repl = require('repl');

const WrapMap = require('../lib/util/WrapMap');
const KeyWrap = require('../lib/util/KeyWrap');
const hey = require('../lib/hey');

const r = repl.start('hey? > ')

r.context.WrapMap = WrapMap;
r.context.KeyWrap = KeyWrap;



r.context.ON = {
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

r.context.m = new WrapMap(r.context.ON);

r.context.f = function(val, keyc) {
    return function() {
        return `val = ${val}, keyc = ${keyc}`;
    }
}

r.context.l = console.log

r.context.hey = hey;