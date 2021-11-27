const Uplinker = require('../../lib/make/updater/UpLinker');

// only tests UpLinker class, no other portions of project required

describe('uplinker suite', function() {

    var fkc1 = {
        scaffold: {
            name: "c1",
            content: "some content",
            flag: false
        }
    }
    var fkc2 = {
        scaffold: {
            name: "c2",
            content: "xxx",
            flag2: true
        }
    }
    var fkbldr = {
        _children: new Set()
    };

    it('should construct', function() {
        let u = new Uplinker(fkbldr, fkc1)
        expect(u.startc).toEqual(fkc1);
        expect(u.upBuilder).toEqual(fkbldr);
        expect(u.is).toBeFalsy();
        expect(u.endc).toBeFalsy();
        expect(u.endk).toBeFalsy();
        expect(u.loaded).toBeFalsy();
    });
    it('should have an initial commands object path with first component scaffold property names', function() {
        let u = new Uplinker(fkbldr, fkc1)
        let c = u.getCommandsObject();
        for(let key of Object.keys(fkc1.scaffold)) {
            expect(c[key]).toBeDefined();
        }
    });
    it('should have comparison keys', function() {
        let u = new Uplinker(fkbldr, fkc1);
        let c = u.getCommandsObject();
        c = c['name'];
        for(let key of 
            [ 
            '==',     '>=',
            '>',      '<=',
            '<',      '!=',
            'equals', 'greater',
            'is',     'less',
            'not'
          ]) {
            expect(c[key]).toBeDefined();
          }
        expect(c.is.equal.to).toBeDefined();
        expect(c.is.greater.than.or.equal.to).toBeDefined();
    })
    it('should ask for an end component and create chains from that', function() {
        let u = new Uplinker(fkbldr, fkc1);
        let c = u.getCommandsObject();
        c = c['name'].is.not.equal.to(fkc2);
        for(let key of Object.keys(fkc2.scaffold)) {
            expect(c[key]).toBeDefined();
        }
    });
    it('should put all selections in the class when done', function() {
        let u = new Uplinker(fkbldr, fkc1);
        let c = u.getCommandsObject();
        c = c.flag.is.less.than.or.equal.to(fkc2).flag2();
        expect(u.startk).toEqual('flag');
        expect(u.is).toEqual('<=');
        expect(u.endc.scaffold.name).toEqual('c2');
        expect(u.endk).toEqual('flag2');
    });
    it('should add to the upbuilders children when done', function() {
        let bldr = {
            _children: new Set()
        };
        let u = new Uplinker(bldr, fkc1);
        let c = u.getCommandsObject();
        c.flag.is.less.than.or.equal.to(fkc2).flag2();
        expect(bldr._children.size).toEqual(1);
    })

})