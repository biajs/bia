import { create, compile } from '../../../src/index';
import { expect } from 'chai';
const fs = require('fs');
const path = require('path');

import { JsCode, JsReturn, JsFunction, JsObject } from '../../../src/generators/classes/index';

describe.only('compilation', () => {
    let el; 

    // create a new in-memory div for each test
    beforeEach(() => {
        el = document.createElement('div');
    });

    // helper function to compile source code to a component
    let createComponent = (name, options) => {
        options.format = 'fn';

        const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8');
        
        const { code } = compile(source, options);
        
        return { 
            code, 
            Component: new Function(code)(),
        };
    }

    it('renders an empty element', () => {
        const { Component, code } = createComponent('EmptyNode', {
            filename: 'EmptyNode.bia',
            name: 'EmptyNode',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal(`<div></div>`);
    });

    it('renders static classes and styles', () => {
        const { Component, code } = createComponent('NodeWithAttributes', {
            filename: 'NodeWithAttributes.bia',
            name: 'NodeWithAttributes',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div class="foo" style="color: red;"></div>');
    });
    
    it('renders static data attributes', () => {
        const { Component, code } = createComponent('NodeWithDataAttributes', {
            filename: 'NodeWithDataAttributes.bia',
            name: 'NodeWithDataAttributes',
        });

        const vm = new Component({ el });
    
        expect(vm.$el.outerHTML).to.equal('<div data-foo="bar" data-one-two="three"></div>');
    });

    it('renders static child elements', () => {
        const { Component, code } = createComponent('NodeWithChild', {
            filename: 'NodeWithChild.bia',
            name: 'NodeWithChild',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>\n        <span>Aloha</span>\n    </div>')
    });

    it('renders text content', () => {
        const { Component, code } = createComponent('NodeWithText', {
            filename: 'NodeWithText.bia',
            name: 'NodeWithText',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>Hello world</div>');
    });
    
    it('renders multiple lines of text content', () => {
        const { Component } = createComponent('NodeWithMultipleLinesOfText', {
            filename: 'NodeWithMultipleLinesOfText.bia',
            name: 'NodeWithMultipleLinesOfText',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>\r\n        Hello world\r\n        foo bar baz\r\n    </div>');
    });

    it('renders quotes text content', () => {
        const { Component } = createComponent('NodeWithQuotedText', {
            filename: 'NodeWithQuotedText.bia',
            name: 'NodeWithQuotedText',
        });

        const vm = new Component ({ el });
        
        expect(vm.$el.outerHTML).to.equal('<div>Foo\'s \"bar\"</div>');
    });

    it.skip('renders interpolated text', () => {
        const { Component, code } = createComponent('NodeWithTextExpression', {
            filename: 'NodeWithTextExpression.bia',
            name: 'NodeWithTextExpression',
        });

        // console.log();
        // console.log();
        // console.log('=============================');
        // console.log();
        // console.log();
        // console.log (code);

        // const vm = new Component({ el });
        
        // // <div>{{ 1 + 2 }}</div>
        // expect(vm.$el.outerHTML).to.equal('<div>3</div>');
    });

    // it('NodeWithTextExpressionInChild', () => {
    //     const { Component } = createComponent('NodeWithTextExpressionInChild', {
    //         filename: 'NodeWithTextExpressionInChild.bia',
    //         name: 'NodeWithTextExpressionInChild',
    //     });

    //     const vm = new Component({ el });
        
    //     // <div>
    //     //     <span>{{ 1 + 2 }}</span>
    //     // </div>
    //     expect(vm.$el.outerHTML).to.equal('<div>\n        <span>3</span>\n    </div>');
    // });

    // it('compiles nodes with dynamic children', () => {
    //     const { Component, code } = createComponent('NodeWithDynamicChildren', {
    //         filename: 'NodeWithDynamicChildren.bia',
    //         name: 'NodeWithDynamicChildren',
    //     });

    //     const vm = new Component({ el });
        
    //     expect(vm.$el.outerHTML).to.equal('<div class="foo"><span class="bar">static child</span><span class="baz">dynamic child</span></div>')
    // });

    it('compiles deeply nested dynamic children', () => {
        const { Component, code } = createComponent('NodeWithDeeplyNestedDynamicChildren', {
            filename: 'NodeWithDeeplyNestedDynamicChildren.bia',
            name: 'NodeWithDeeplyNestedDynamicChildren',
        });

        const vm = new Component({ el });

        // foo
        expect(vm.$el.children[0].outerHTML).to.equal('<span class="foo">foo</span>');
        expect(vm.$el.children[1].tagName).to.equal('DIV');
        expect(vm.$el.children[1].classList.contains('foo')).to.be.true;

        // bar
        expect(vm.$el.children[1].children[0].outerHTML).to.equal('<span class="bar">bar</span>');
        expect(vm.$el.children[1].children[1].tagName).to.equal('DIV');
        expect(vm.$el.children[1].children[1].classList.contains('bar')).to.be.true;

        // baz
        expect(vm.$el.children[1].children[1].children[0].outerHTML).to.equal('<span class="baz">baz</span>');
        expect(vm.$el.children[1].children[1].children[1].tagName).to.equal('DIV');
        expect(vm.$el.children[1].children[1].children[1].classList.contains('baz')).to.be.true;
    });

    // it.skip('compiles elements with dynamic and text children', () => {
    //     const { Component, code } = createComponent('NodeWithDynamicChildAndText', {
    //         filename: 'NodeWithDynamicChildAndText.bia',
    //         name: 'NodeWithDynamicChildAndText',
    //     });

    //     console.log (code);
        
    //     const vm = new Component({ el });
    //     expect(vm.$el.outerHTML).to.equal('<div>\r\n        foo\r\n        <span>bar</span></div>');
    // });
});