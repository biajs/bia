const { parse } = require('../../../');

describe('template parser output', () => {

    // helper function to parse fixtures
    const parseFixture = f => parse(getFileContents(f, { filename: 'foo.bia' }));
     
    it('element_with_text', () => {
        expect(parseFixture('test/fixtures/element_with_text.bia').template).to.deep.equal({
            tagName: 'DIV',
            type: 'ELEMENT',
            children: [
                {
                    children: [],
                    type: 'TEXT',
                    tagName: undefined,
                }
            ]
        });
    });
});