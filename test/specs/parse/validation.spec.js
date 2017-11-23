const { parse } = require('../../../');

describe('parser validation', () => {
    it('throws an error if no template is defined', () => {
        expect(() => parse(``, { filename: 'foo.bia' })).to.throw(
            'Failed to parse foo.bia, no template block is defined.'
        );
    });

    it('throws an error if multiple templates are defined', () => {
        expect(() => parse(`
            <template><div></div></template>
            <template><div></div></template>
        `, { filename: 'foo.bia' })).to.throw(
            `Failed to parse foo.bia, only one template block may be defined.`
        );
    });

    it('throws an error if the template has more than one root element', () => {
        expect(() => parse(`
            <template>
                <div>foo</div>
                <div>bar</div>
            </template>
        `, { filename: 'foo.bia' })).to.throw(
            `Failed to parse foo.bia, template must contain exactly one root element.`
        );
    });
});