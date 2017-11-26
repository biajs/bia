import { parse } from '../../../src/parse/parse';
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('parsing', () => {

    // helper function to parse fixtures
    const parseTemplate = (name, opts) => {
        const parseOptions = {
            name: name,
            fileName: name + '.bia',
            ...opts,   
        }

        return parse(fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8'), parseOptions).template;
    }
     
    it('EmptyNode', () => {
        expect(parseTemplate('EmptyNode', {})).to.containSubset({
            attributes: {},
            tagName: 'DIV',
            textContent: null,
            type: 'ELEMENT',
            children: [],
        });
    });

    it('NodeWithAttributes', () => {
        expect(parseTemplate('NodeWithAttributes', {})).to.containSubset({
            attributes: {
                foo: 'bar',
                'data-baz': 'yar',
            },
            tagName: 'DIV',
            textContent: null,
            type: 'ELEMENT',
            children: [],
        });
    });
    
    it('NodeWithText', () => {
        expect(parseTemplate('NodeWithText', {})).to.containSubset({
            attributes: {},
            tagName: 'DIV',
            textContent: null,
            type: 'ELEMENT',
            children: [
                {
                    attributes: {},
                    children: [],
                    tagName: null,
                    textContent: 'Hello world',
                    type: 'TEXT',
                }
            ],
        });
    });

    it('NodeWithChild', () => {
        expect(parseTemplate('NodeWithChild', {})).to.containSubset({
            attributes: {},
            tagName: 'DIV',
            textContent: null,
            type: 'ELEMENT',
            children: [
                {
                    attributes: {},
                    children: [],
                    tagName: 'SPAN',
                    textContent: null,
                    type: 'ELEMENT',
                }
            ],
        });
    });
});