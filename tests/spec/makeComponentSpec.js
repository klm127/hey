
const hey = require('../../lib/hey');

describe('makeComponent suite', function() {

    var h = hey('app');

    it('should be able to set component properties', function() {
        let c = h.make('component').named('karl').of.type('boolean');
        expect(c().type).toEqual('boolean');
        expect(c().name).toEqual('karl');
        expect(c().children).toBeDefined();
        c.with.content("cont").with.name("k2").with.type("poop");
        expect(c().type).toEqual('poop');
        expect(c().name).toEqual("k2");
        c.change.style({a:0});
        expect(c().style.a).toEqual(0);
        c.change.style.to({a:1});
        expect(c().style.a).toEqual(1);
        c.change.name('bob').change.type('arf').change.style({a:5});
        expect(c().name).toEqual('bob');
        expect(c().type).toEqual('arf');
        expect(c().style.a).toEqual(5);
    });

    it('should be able to attach children', function() {
        let c = h.make('component').named('karl').with.child().get.parent();
        expect(c().children.length).toEqual(1);
        let c2 = h.make('component').named('isla');
        c.add.child(c2);
        expect(c().children.length).toEqual(2);
    });

    it('should be able to attach siblings', function() {
        let top = h.make('component').named('top');
        let right = top.add.child().named('left').add.sibling().named('right');
        expect(top._children.size).toEqual(2);
        let bottom = right.add.child().named('bottom');
        expect(bottom.get.grandparent()._children.size).toEqual(2);
    })

});