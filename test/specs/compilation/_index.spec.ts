// this file exists to allow compilation tests to be written
// in their own files, while still being able to focus all
// by appending a .only to this wrapping describe block
describe.skip('compilation', function() {
    const glob = require('glob');
    const path = require('path');

    // require in all of our compilation tests
    glob.sync(path.resolve(__dirname, './*.ts')).forEach(file => {
        if (!file.endsWith('.spec.ts')) require(file);
    });
});