const { parse } = require('../../../');

describe.only('template parser output', () => {

    // helper function to parse fixtures
    const parseFixture = f => parse(getFileContents(f, { filename: 'foo.bia' })).template;
     
    it('parses an element with text', () => {
        expect(parseFixture('test/fixtures/element_with_text.bia')).to.deep.equal({
            tagName: 'DIV',
            type: 'ELEMENT',
            children: [
                {
                    children: [],
                    type: 'TEXT',
                    tagName: undefined,
                },
            ],
        });
    });

    it('parses an element with text and child element', () => {
        expect(parseFixture('test/fixtures/element_with_text_and_child.bia')).to.deep.equal({
            children: [
                {
                    children: [],
                    tagName: undefined,
                    type: 'TEXT',
                },
                {
                    children: [
                        {
                            //
                            children: [],
                            tagName: undefined,
                            type: 'TEXT',
                        }
                    ],
                    tagName: 'SPAN',
                    type: 'ELEMENT',
                },
                {
                    children: [],
                    tagName: undefined,
                    type: 'TEXT',
                }    
            ],            
            tagName: 'DIV',
            type: 'ELEMENT',
        })
    });
});