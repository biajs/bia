const { createComponent, parse } = require('../../../');

describe('generators', () => {

    // helper function to parse fixtures
    const parseFixture = f => parse(getFileContents(`test/fixtures/${f}`, { filename: 'foo.bia' }));

    it('generates a text element', () => {
        const parsedElement = parseFixture('element_with_text.bia');
        const output = createComponent(parsedElement);

        console.log ('output', output);
        
        // function c(data) {
	    //     const el = document.createElement(data.tagName),
        //     return el;
        // }
    });
});