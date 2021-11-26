
const hey = require('../../lib/hey');

describe('config suite', function() {

    var h = hey('app');

    it('should be able to get a config object', function() {
        let c = hey('config');
        expect(c).toBeDefined();
    })

    it('should be able to log and should be global', function() {
        let c = hey('config');
        c.log('hi').log('mom').log('how').log('are').log('you');
        expect(c.config.logger.logLines.length).toBe(5);
        let d = hey('config');
        d.log('1').log('2');
        expect(c.config.logger.logLines.length).toBe(7);
        d.log.clear();
    })
    
    it('should be able to print to a custom printer', function() {
        let array = [];
        function print(val) {
            array.push(val);
        }
        let c = hey('config').print(print);
        let current_length = c.config.logger.logLines.length;
        c.log('new');
        c.print(print);
        expect(array.length).toBe(current_length+1);
        c.log.clear();
    })
})