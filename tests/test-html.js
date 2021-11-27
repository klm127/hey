const hey = require('../lib/hey');



let app = hey('app');
app.add.child().named('top').with.child().named('left').with.sibling().named('right');
app.add.child().named('middle').with.child().named('left');
app.render('html');