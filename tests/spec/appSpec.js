const hey = require('../../lib/hey');

describe('app suite', function() {

    var app = hey('app');

    it('should have a global circular reference', function() {
        expect(app.hey).toBeDefined();
        expect(hey.app).toBeDefined();
    });
})