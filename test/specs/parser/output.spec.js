const { parse } = require('../../../');

describe.only('template parser output', () => {

    // helper function to parse fixtures
    const parseFixture = f => parse(getFileContents(f, { filename: 'foo.bia' })).template;
     
    it('parses an element with text', () => {
        expect(parseFixture('test/fixtures/element_with_text.bia')).to.deep.equal({
            children: [
                {
                    children: [],
                    type: 'TEXT',
                    textContent: 'Hello world',
                    tagName: undefined,
                },
            ],
            tagName: 'DIV',
            textContent: null,
            type: 'ELEMENT',
        });
    });

    it('parses an element with text and child element', () => {
        expect(parseFixture('test/fixtures/element_with_text_and_child.bia')).to.deep.equal({
            children: [
                {
                    children: [],
                    tagName: undefined,
                    textContent: "\n        parent text\n        ",
                    type: 'TEXT',
                },
                {
                    children: [
                        {
                            //
                            children: [],
                            tagName: undefined,
                            textContent: "\n            child text\n        ",
                            type: 'TEXT',
                        }
                    ],
                    tagName: 'SPAN',
                    textContent: null,
                    type: 'ELEMENT',
                },
                {
                    children: [],
                    tagName: undefined,
                    textContent: '\n    ',
                    type: 'TEXT',
                }    
            ],            
            tagName: 'DIV',
            type: 'ELEMENT',
            textContent: null
        });
    });
});