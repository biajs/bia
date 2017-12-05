import { create, compile } from '../../../src/index';
import { expect } from 'chai';
const fs = require('fs');
const path = require('path');

describe.only('compilation', () => {
    let el; 
    
    // create a new in-memory div for each test
    beforeEach(() => {
        el = document.createElement('div');
    });

    let createFromSource = (source, options = {}) => {
        const { code } = compile(source, {
            format: 'fn',
            filename: 'Test.bia',
            name: 'Test',
            ...options,
        });
        
        return { 
            code, 
            Component: new Function(code)(),
        };
    }

    // helper function to compile source code to a component
    let createComponent = (name, options = {}) => {
        const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8');
        
        return createFromSource(source, options);
    }

    it('renders an empty element', () => {
        const { Component, code } = createComponent('EmptyNode');

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal(`<div></div>`);
    });

    it('renders purely static child text', () => {
        const { Component, code } = createComponent('NodeWithText');

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>Hello world</div>');
    });

    it('renders purely static child elements', () => {
        const { Component, code } = createComponent('NodeWithChildAndText');

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>\n        <span>Hello world</span>\n    </div>');
    });
    
    it('renders multiple lines of text content', () => {
        const { Component, code } = createComponent('NodeWithMultipleLinesOfText');

        const vm = new Component({ el });
        
        expect(vm.$el.outerHTML).to.equal('<div>\r\n        Hello world\r\n        foo bar baz\r\n    </div>');
    });

    it('renders text with quotes', () => {
        const { Component, code } = createComponent('NodeWithQuotedText');

        const vm = new Component({ el });
        
        expect(vm.$el.outerHTML).to.equal('<div>Foo\'s \"bar\"</div>');
    })
});