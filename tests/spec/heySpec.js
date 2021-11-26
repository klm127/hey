
const hey = require('../../lib/hey');

describe('hey suite', function() {

    it("should make an app the first time it is called", function() {
        let result = hey('app');
        expect(hey.app).toBeDefined();
        expect(result).toEqual(hey.app);
    })

    it("should be able to make", function() {
        let result = hey.make('component')
        expect(result.name).toEqual('builder');
        let result2 = hey.app.make('component');
        expect(result2.name).toEqual('builder');
    });

})