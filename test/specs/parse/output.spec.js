const { parse } = require('../../../');

describe('template parser output', () => {

    // helper function to parse fixtures
    const parseFixture = f => parse(getFileContents(`test/fixtures/${f}`, { filename: 'foo.bia' })).template;
     
    it('parses an element with text', () => {
        expect(parseFixture('element_with_text.bia')).to.deep.equal({
            attributes: {},
            children: [
                {
                    attributes: {},
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
        expect(parseFixture('element_with_text_and_child.bia')).to.deep.equal({
            attributes: {},
            children: [
                {
                    attributes: {},
                    children: [],
                    tagName: undefined,
                    textContent: "\n        parent text\n        ",
                    type: 'TEXT',
                },
                {
                    attributes: {},
                    children: [
                        {
                            attributes: {},
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
                    attributes: {},
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

    it('parses an elements attributes', () => {
        expect(parseFixture('element_with_attribute.bia')).to.deep.equal({
            attributes: { foo: 'bar' },
            children: [],
            textContent: null,
            tagName: 'DIV',
            type: 'ELEMENT',
        });
    });

    it('parses an element with multiple attributes', () => {
        expect(parseFixture('element_with_multiple_attributes.bia')).to.deep.equal({
            attributes: {
                class: 'abc',
                style: 'def',
                'data-ghi': 'jkl',
                mno: 'pqr',
            },
            children: [],
            textContent: null,
            tagName: 'DIV',
            type: 'ELEMENT',
        });
    });
});