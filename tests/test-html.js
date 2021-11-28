const hey = require('../lib/hey');



// let app = hey('app');
// app.add.child().named('top').set.content("top!").with.child().named('left').with.sibling().named('right');
// app.add.child().named('middle').with.child().named('left').with.content("leftwards").with.style({"color":"red","font-size":"22px"});
// app.render('html');

let big = {
    color: "darkslategray",
    "font-size": "22px",
    "background-color": "orange"
}

let h1 = {
    color: "maroon",
    "font-size": "16px",
    "background-color": "yellow"
}

let block = {
    border: "4px dotted darkgray",
    "box-shadow": "2px 2px 2px black",
    "padding": "5px",
}

let highlight = {
    "background-color": "goldenrod",
    "font-size": "14px"
}

let pointerEnter = function(ev) {
    ev.target.style.fontSize = "22px";
}
let pointerOut = function(ev) {
    ev.target.style.fontSize = "10px";
}

let app = hey('app');

let last = app.add.child().with.style(block)
        .add.child().with.style(big).set.content(`Isla's freaky webpage`)
        .with.sibling().of.style(block)
        .with.child().of.style(h1).set.content("Some great content I made:")
        .with.child().of.type('ul')

for(let k of ["dogs", "turtles","cats", "other stuff"]) {
    last = last.add.child().with.content(">"+k).on.pointer.enter(pointerEnter).on.pointer.leave(pointerOut);
    console.log(last());
}

last = last.get.parent().add.sibling().with.content("Something scaary")
    .add.child().of.type('span').with.style(highlight).with.content(" WOOOOOO ");



app.render('html');

