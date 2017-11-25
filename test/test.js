var glob = require('glob');
var path = require('path');

// set up our test environment
require('./setup');

// require in all of our test files
glob.sync('./test/**/*.spec.ts').forEach(function(file) {
    require(path.resolve(file));
});