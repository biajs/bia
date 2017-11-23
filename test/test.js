var glob = require('glob');
var path = require('path');

// set up our test environment
require('./setup');

// require all files that end in .spec.js
glob.sync('./**/*.spec.js').forEach(function(file) {
    require(path.resolve(file));
});