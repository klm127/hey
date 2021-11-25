const Jasmine = require('jasmine');

const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'tests/spec',
    spec_files: [
        "**/*[sS]pec.?(m)js"
    ],
    helpers: []
});


jasmine.configureDefaultReporter({
    timer: new jasmine.jasmine.Timer(),
    print: function() {
        let outText = '';
        outText += arguments['0'] != '\n' ? '>>>>'+arguments['0'] : '';
        console.log(outText)
    },
    showColors: true
});

jasmine.execute();