const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const sinonChai = require('sinon-chai');
const { deindent } = require('../src/utils/string');

chai.use(sinonChai);
chai.use(chaiSubset);

// add a custom code assertion
chai.use(function(_chai, utils) {
    _chai.Assertion.addMethod('equalCode', function(expected) {
        const actual = typeof this._obj === 'string'
            ? this._obj
            : String(this._obj);
            
        new _chai.Assertion(deindent(actual)).to.equal(deindent(expected));
    });
});

// simulate a global browser environment
require('browser-env')();

// pull in any globals we want to define
// require('./globals');

// // alias chai expect so we don't have to import it everywhere
// global.expect = expect;

// // get the contents of a file relative to the project root
// global.getFileContents = function(filePath) {
//     return fs.readFileSync(path.resolve(__dirname, '../', filePath), 'utf8');
// }