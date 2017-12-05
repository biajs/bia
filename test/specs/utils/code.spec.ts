import { ParsedNode } from '../../../src/interfaces';
import { createDomTree } from '../../../src/parse/template';
import { expect } from 'chai';

describe('code utilities', () => {
    // helper factories to create ParsedNode objects
    function createElementNode(tagName: string = 'div'): ParsedNode {
        return createDomTree(document.createElement(tagName));
    }

    function createTextNode(textContent: string = ''): ParsedNode {
        let el = document.createElement('div');
        let text = document.createTextNode(textContent);
        el.appendChild(text);

        return createDomTree(el).children[0];
    }
});