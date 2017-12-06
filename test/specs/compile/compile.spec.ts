import { create, compile } from '../../../src/index';
import { expect } from 'chai';
const fs = require('fs');
const path = require('path');

describe('compilation', () => {
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

    // helper function to log code with a bit of spacing
    let debug = (code) => {
        console.log();
        console.log('====================================================================');
        console.log();
        console.log(code);
        console.log();
        console.log('====================================================================');
        console.log();
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
    });

    it('renders static and dynamic siblings', () => {
        const { Component, code } = createComponent('NodeWithStaticAndDynamicChildren');

        const vm = new Component({ el });
        
        expect(vm.$el.outerHTML).to.equal('<div>\r\n        text node\r\n        <span>static</span></div>')
    });

    //
    // conditional branches
    //
    describe('conditional branches', () => {
        it('renders a stand-alone if block', () => {
            const { Component, code } = createComponent('IfBlock');

            const vm = new Component({ el });
            
            expect(vm.$el.outerHTML).to.equal('<div><span>i should be visible</span></div>');
        });

        it('renders nested if blocks', () => {
            const { Component, code } = createComponent('NestedIfBlock');
            
            const vm = new Component({ el });

            expect(vm.$el.outerHTML).to.equal('<div><div><p><span>hooray</span></p></div></div>');
        });
    });
});