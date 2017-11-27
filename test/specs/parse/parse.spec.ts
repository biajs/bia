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
    });

    it('Directives', () => {
        const node = parseTemplate('Directives', {});
        const span = node.children.filter(n => n.tagName === 'SPAN');

        // there should be directives on all but the first child
        expect(span[0].directives.length).to.equal(0);
        expect(span[1].directives.length).to.equal(1);
        expect(span[2].directives.length).to.equal(1);
        expect(span[3].directives.length).to.equal(1);
        expect(span[4].directives.length).to.equal(1);
        expect(span[5].directives.length).to.equal(1);
        expect(span[6].directives.length).to.equal(1);
        expect(span[7].directives.length).to.equal(1);
        expect(span[8].directives.length).to.equal(1);
        expect(span[9].directives.length).to.equal(1);
        expect(span[10].directives.length).to.equal(1);
        expect(span[11].directives.length).to.equal(1);
        expect(span[12].directives.length).to.equal(1);

        // check name parsing
        expect(span[1].directives[0].name).to.equal('name');
        expect(span[2].directives[0].name).to.equal('name');
        expect(span[3].directives[0].name).to.equal('name');
        expect(span[4].directives[0].name).to.equal('name');
        expect(span[5].directives[0].name).to.equal('name');
        expect(span[6].directives[0].name).to.equal('name');
        expect(span[7].directives[0].name).to.equal('name');
        expect(span[8].directives[0].name).to.equal('name');
        expect(span[9].directives[0].name).to.equal('name');
        expect(span[10].directives[0].name).to.equal('name');
        expect(span[11].directives[0].name).to.equal('name');
        expect(span[12].directives[0].name).to.equal('name');
        
        // modifiers
        expect(span[1].directives[0].modifiers).to.deep.equal([]);
        expect(span[2].directives[0].modifiers).to.deep.equal(['one']);
        expect(span[3].directives[0].modifiers).to.deep.equal(['one', 'two']);
        expect(span[4].directives[0].modifiers).to.deep.equal([]);
        expect(span[5].directives[0].modifiers).to.deep.equal(['one']);
        expect(span[6].directives[0].modifiers).to.deep.equal(['one', 'two']);
        expect(span[7].directives[0].modifiers).to.deep.equal([]);
        expect(span[8].directives[0].modifiers).to.deep.equal(['one']);
        expect(span[9].directives[0].modifiers).to.deep.equal(['one', 'two']);
        expect(span[10].directives[0].modifiers).to.deep.equal([]);
        expect(span[11].directives[0].modifiers).to.deep.equal(['one']);
        expect(span[12].directives[0].modifiers).to.deep.equal(['one', 'two']);

        // args
        expect(span[1].directives[0].arg).to.equal(null);
        expect(span[2].directives[0].arg).to.equal(null);
        expect(span[3].directives[0].arg).to.equal(null);
        expect(span[4].directives[0].arg).to.equal('arg');
        expect(span[5].directives[0].arg).to.equal('arg');
        expect(span[6].directives[0].arg).to.equal('arg');
        expect(span[7].directives[0].arg).to.equal(null);
        expect(span[8].directives[0].arg).to.equal(null);
        expect(span[9].directives[0].arg).to.equal(null);
        expect(span[10].directives[0].arg).to.equal('arg');
        expect(span[11].directives[0].arg).to.equal('arg');
        expect(span[12].directives[0].arg).to.equal('arg');
        
        // exressions
        expect(span[1].directives[0].expression).to.equal('');
        expect(span[2].directives[0].expression).to.equal('');
        expect(span[3].directives[0].expression).to.equal('');
        expect(span[4].directives[0].expression).to.equal('');
        expect(span[5].directives[0].expression).to.equal('');
        expect(span[6].directives[0].expression).to.equal('');
        expect(span[7].directives[0].expression).to.equal('expression');
        expect(span[8].directives[0].expression).to.equal('expression');
        expect(span[9].directives[0].expression).to.equal('expression');
        expect(span[10].directives[0].expression).to.equal('expression');
        expect(span[11].directives[0].expression).to.equal('expression');
        expect(span[12].directives[0].expression).to.equal('expression');
    });
});