const hey = require('../../lib/hey');

describe('app suite', function() {

    var app = hey('app');

    

    it('should have a global circular reference', function() {
        expect(app.hey).toBeDefined();
        expect(hey.app).toBeDefined();
    });

    it('should have a when function', function() {
        expect(app.when).toBeDefined();
        let c = hey.app.make('component').named('c1').with.properties({flag:true});
        let c2 = hey.app.make('component').named('c2').with.properties({flag:false});
        let cmd = hey.when(c).style.is.equal.to(c2).style();

        expect(app._upBuilder._children.size).toEqual(1)
    });
})