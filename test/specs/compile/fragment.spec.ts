import Fragment from '../../../src/generators/dom/fragment/fragment';
import parseTemplate from '../../../src/parse/template';
import { CompileOptions } from '../../../src/interfaces';
import { expect } from 'chai';

describe('Fragment', () => {

    const opts = {
        name: 'foo',
    }

    function template(source: string, options: CompileOptions = { filename: 'test.bia', name: 'test' }) {
        return parseTemplate(`<template>${source.trim()}</template>`, { filename: 'test.bia', name: 'test' });
    }

    it('sets it\'s node on construction', () => {
        const node = template(`<div>Hello world</div>`);
        const fragment = new Fragment({ template: node }, opts);

        expect(fragment.node).to.equal(node);
    });

    it('determines which variables need to be defined', () => {
        const staticNode = template(`<div><span></span></div>`);
        const dynamicNode = template(`<div><p><span b-if="bar"></span></p></div>`);

        const staticEls = new Fragment({ template: staticNode }, opts).getElementNodes();
        expect(staticEls[0]).to.deep.equal(staticNode);
        expect(staticEls.length).to.equal(1);
        
        const dynamicEls = new Fragment({ template: dynamicNode }, opts).getElementNodes();
        expect(dynamicEls[0]).to.deep.equal(dynamicNode);
        expect(dynamicEls[1]).to.deep.equal(dynamicNode.children[0]);
        expect(dynamicEls.length).to.equal(2);
    });

    it('defines a single variable for nodes with purely static content', () => {
        const node = template(`
            <div>
                <p>
                    <span>hello world</span>
                </p>
            </div>
        `);

        const fragment = new Fragment({ template: node }, opts);

        expect(String(fragment.getElementVariables())).to.equal('var div;');
    });

    it('defines variables for each node in dynamic content', () => {
        const node = template(`
            <div>
                foo
                <span>
                    <u b-if="false"></u>
                    <i>
                        this span has dynamic content, so this
                        i tag should be assigned a variable name
                    </i>
                </span>
                baz
                <div>
                    <b>
                        this div has purely static content, so this
                        b tag shouldn't assigned a variable name
                    </b>
                </div>
            </div>
        `);
        
        expect(String(new Fragment({ template: node }, opts).getElementVariables())).to.equal(
            'var div, text, span, i, text_1, div_1;'
        );
    });
});