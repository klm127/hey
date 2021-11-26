# Hey

Just taking a swing at a javascript framework. I want to try something with more natural english grammar, including conjunctions as object properties in builder commands. 

Trying to explore functional programming and javascripts capabilities. Maybe this project will get some more direction soon.

### Usage example
```
let app = hey('app');
let c = app.make('component').named('component1').of.type('cooltype');
let c2 = hey.make('component').with.style({color:"red"});
c.add.child().with.name('hidden c').with.sibling().named('sib1');
```

```
hey('app').make('component').named('main widget').of.type('div').with
    .child().of.type('navbar')
        .with.child().of.type('a').with.content('home page')
        .with.sibling().of.type('a').with.content('about page')
        .with.sibling().of.type('a').with.content('affilates page')
    .whose.parent().whose.parent()
        .has.child().of.type('article').with.content(mycontentfile)
```

### Not implemented stuff but coming:
```
const clock = {
    time: 0
}
let clockWidget = hey('app').make('component').of.type('div');
clockWidget.when(clock, "time").is.greater.than(5000).then.set.content.to("done")


```