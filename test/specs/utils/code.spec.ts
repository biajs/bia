import { VariableNamer } from '../../../src/utils/code';
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

    describe('VariableNamer', () => {
        it('names variables with a set prefix', () => {
            let namer = new VariableNamer;
            expect(namer.getName(createElementNode(), 'if_block')).to.equal('if_block');
            expect(namer.getName(createElementNode(), 'if_block')).to.equal('if_block_0');
            expect(namer.getName(createElementNode(), 'if_block')).to.equal('if_block_1');
        });

        it('names element variables by their tag name', () => {
            let namer = new VariableNamer;
            expect(namer.getName(createElementNode('div'))).to.equal('div');
            expect(namer.getName(createElementNode('div'))).to.equal('div_0');
            expect(namer.getName(createElementNode('span'))).to.equal('span');
            expect(namer.getName(createElementNode('span'))).to.equal('span_0');
        });

        it('names text nodes', () => {
            let namer = new VariableNamer;
            expect(namer.getName(createTextNode('foo'))).to.equal('text');
            expect(namer.getName(createTextNode('foo'))).to.equal('text_0');
            expect(namer.getName(createTextNode('foo'))).to.equal('text_1');
        });

        it('returns already named nodes', () => {
            let namer = new VariableNamer;
            let node = createElementNode('p');
            expect(namer.getName(node)).to.equal('p');
            expect(namer.getName(node)).to.equal('p');
        });
    });
});