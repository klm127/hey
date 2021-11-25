
const hey = require('../../lib/hey');

describe('hey suite', function() {

    it("should make an app the first time it is called", function() {
        expect(hey.app).toBeUndefined();
        hey('app');
        expect(hey.app).toBeDefined();
    })

})