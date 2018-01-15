import { ParsedNode } from '../../../src/interfaces';
import { createDomTree } from '../../../src/parse/template';
import { expect } from 'chai';

import { 
    findRootIdentifiers,
    namespaceRootIdentifiers,
} from '../../../src/utils/code';

describe.skip('code utilities', () => {
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

    it('findRootIdentifiers', () => {
        expect(findRootIdentifiers('one && foo.bar.baz')).to.deep.equal(['one', 'foo']);
    });

    it('namespaceRootIdentifiers', () => {
        // free variables should be prefixed
        expect(namespaceRootIdentifiers('foo')).to.equal('vm.foo');

        // nested vars should also be prefixed
        expect(namespaceRootIdentifiers('foo && [bar]')).to.equal('vm.foo && [vm.bar]');

        // primitives and js objects shouldn't be touched
        expect(namespaceRootIdentifiers('123')).to.equal('123');
        expect(namespaceRootIdentifiers('null')).to.equal('null');
        expect(namespaceRootIdentifiers('true')).to.equal('true');
        expect(namespaceRootIdentifiers('false')).to.equal('false');
        expect(namespaceRootIdentifiers('"hello"')).to.equal('"hello"');

        // exclude specific vars
        expect(namespaceRootIdentifiers('foo && bar && baz', 'vm', ['bar'])).to.equal('vm.foo && bar && vm.baz');
    });
});