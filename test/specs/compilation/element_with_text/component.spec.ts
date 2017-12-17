import { compile } from '../../../../src/index';
const path = require('path');
const fs = require('fs');

// helper function to compile a component
function compileComponent() {
    const source = fs.readFileSync(path.resolve(__dirname, 'component.bia'), 'utf8');

    return compile(source, {
        filename: 'Component.bia',
        name: 'Component',
    });
}

describe.only('element with text', () => {
    it('renders the correct text', () => {
        const { code } = compileComponent();

        console.log(code);
    });
});