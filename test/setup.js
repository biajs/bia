const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

// alias chai expect so we don't have to import it everywhere
global.expect = expect;

// get the contents of a file relative to the project root
global.getFileContents = function(filePath) {
    return fs.readFileSync(path.resolve(__dirname, '../', filePath), 'utf8');
}