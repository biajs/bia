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

        // create a test block for each component
        it(name, () => {
            const { code } = compile(source, {
                fileName: name + '.bia',
                format: 'es',
                name: name,
            });

            // save the compiled code to a js file
            fs.writeFileSync(path.resolve(__dirname, name, 'component.js'), code);

            // @todo...
            // import the file we just created
            // render it into an in-memory dom element
            // assert that it looks the way it should
        });
    });
});