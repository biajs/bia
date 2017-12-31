import { ParsedNode } from '../../../src/interfaces';
import { createDomTree } from '../../../src/parse/template';
import { expect } from 'chai';

import { 
    namespaceIdentifiers,
} from '../../../src/utils/code';

describe('code utilities', () => {
    // // helper factories to create ParsedNode objects
    // function createElementNode(tagName: string = 'div'): ParsedNode {
    //     return createDomTree(document.createElement(tagName));
    // }

    // function createTextNode(textContent: string = ''): ParsedNode {
    //     let el = document.createElement('div');
    //     let text = document.createTextNode(textContent);
    //     el.appendChild(text);

    //     return createDomTree(el).children[0];
    // }

    it('namespaceIdentifiers', () => {
        // free variables should be prefixed
        expect(namespaceIdentifiers('foo')).to.equal('vm.foo');

        // nested vars should also be prefixed
        expect(namespaceIdentifiers('foo && [bar]')).to.equal('vm.foo && [vm.bar]');

        // primitives and js objects shouldn't be touched
        expect(namespaceIdentifiers('123')).to.equal('123');
        expect(namespaceIdentifiers('null')).to.equal('null');
        expect(namespaceIdentifiers('true')).to.equal('true');
        expect(namespaceIdentifiers('false')).to.equal('false');
        expect(namespaceIdentifiers('"hello"')).to.equal('"hello"');
    });
});