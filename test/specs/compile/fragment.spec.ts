import Fragment from '../../../src/generators/dom/fragment/fragment';
import parseTemplate from '../../../src/parse/template';
import { CompileOptions } from '../../../src/interfaces';
import { expect } from 'chai';

describe.only('Fragment', () => {

    function template(source: string, options: CompileOptions = { filename: 'test.bia', name: 'test' }) {
        return parseTemplate(`<template>${source.trim()}</template>`, { filename: 'test.bia', name: 'test' });
    }

    it('sets it\'s node on construction', () => {
        const node = template(`<div>Hello world</div>`);
        const fragment = new Fragment(node);

        expect(fragment.node).to.equal(node);
    });

    it('determines which variables need to be defined', () => {
        const node = template(`
            <div>
                <span></span>
            </div>
        `);

        const elementNodes = new Fragment(node).getElementNodes();

        expect(elementNodes[0]).to.deep.equal(node);
        expect(elementNodes[1]).to.deep.equal(node.children[0]);
        expect(elementNodes.length).to.equal(2);
    });

    it('defines each element node as a javascript variable', () => {
        const node = template(`
            <div>
                <span></span>
            </div>
        `);

        const defs = new Fragment(node).getVariables();
    })
});