import { parse } from '../../../src/parse/parse';
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('parsing', () => {

    // helper function to parse fixtures
    const parseTemplate = (name, opts) => {
        const parseOptions = {
            name: name,
            filename: name + '.bia',
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

    it('NodeWithStaticClasses', () => {
        expect(parseTemplate('NodeWithStaticClasses', {})).to.containSubset({
            staticClasses: ['foo', 'bar'],
        });
    });

    it('NodeWithStaticStyles', () => {
        expect(parseTemplate('NodeWithStaticStyles', {})).to.containSubset({
            staticStyles: {
                color: 'red',
                'font-size': '20px',
            },
        });
    });

    it('NodeWithTextExpression', () => {
        expect(parseTemplate('NodeWithTextExpression', {})).to.containSubset({
            children: [
                {
                    type: 'TEXT',
                    textInterpolations: [
                        {
                            expression: '2 + 2',
                            text: '{{ 2 + 2 }}',
                        },
                    ],
                },
            ],
        });
    });

    it('NodeWithDataAttributes', () => {
        expect(parseTemplate('NodeWithDataAttributes', {})).to.containSubset({
            dataAttributes: {
                foo: 'bar',
                helloWorld: 'yar',
            },
        });
    })
});