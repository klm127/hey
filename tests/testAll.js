const Jasmine = require('jasmine');

const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'tests/spec',
    spec_files: [
        "tests/spec/heySpec.js",
        "**/*[sS]pec.?(m)js"
    ],
    helpers: []
});


jasmine.configureDefaultReporter({
    timer: new jasmine.jasmine.Timer(),
    print: function() {
        let outText = '';
        outText += arguments['0'].replaceAll('\n','');
        console.log(outText)
    },
    showColors: true
});

jasmine.execute();