import { compile } from '../../../src/index'
const fs = require('fs');
const path = require('path');

describe('compilation', () => {    

    // helper functions to render a component
    const isDirectory = p => fs.lstatSync(p).isDirectory();
    const getDirName = p => p.split(path.sep).pop();
    const getDirectories = p => fs.readdirSync(p).map(name => path.join(p, name)).filter(isDirectory);

    // loop over all child directories of the current path
    getDirectories(path.resolve(__dirname)).forEach((dir) => {
        const name = getDirName(dir);
        const source = fs.readFileSync(path.resolve(__dirname, dir, name + '.bia'), 'utf8');

        // compile our fixture into a function
        const { code } = compile(source, {
            fileName: name + '.bia',
            format: 'fn',
            name: name,
        });
        
        const Component = new Function(code)();

        const testFn = require('./' + name + '/test').default;

        // call the test function and hand it our component constructor
        testFn(Component);
    });
});