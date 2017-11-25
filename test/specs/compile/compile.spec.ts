import { compile } from '../../../src/index'
const fs = require('fs');
const path = require('path');

describe.only('compilation', () => {
    
    // // helper function to get load a fixture
    const getFixture = f => fs.readFileSync(path.resolve(__dirname, './fixtures', f), 'utf8');

    it('hello world', () => {
        const { code } = compile(getFixture('hello_world.bia'), {
            fileName: 'hello_world.bia',
            name: 'HelloWorld',
        });

        console.log ();
        console.log ();
        console.log (code);
        console.log ();
        console.log ();
    })
});