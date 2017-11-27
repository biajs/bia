import { create, compile } from '../../../src/index';
import { expect } from 'chai';
const fs = require('fs');
const path = require('path');

import { JsCode, JsReturn, JsFunction, JsObject } from '../../../src/generators/classes/index';

describe('compilation', () => {
    let el; 

    // create a new in-memory div for each test
    beforeEach(() => {
        el = document.createElement('div');
    });

    // helper function to compile source code to a component
    let createComponent = (name, options) => {
        const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8');

        return create(source, options);
    }

    // helper function to make debugging a bit easier
    let compileComponent = (name, options) => {
        const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8');

        return compile(source, options);
    }

    it('EmptyNode', () => {
        const Component = createComponent('EmptyNode', {
            filename: 'EmptyNode.bia',
            name: 'EmptyNode',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal(`<div></div>`);
    });

    it('NodeWithAttributes', () => {
        const Component = createComponent('NodeWithAttributes', {
            filename: 'NodeWithAttributes.bia',
            name: 'NodeWithAttributes',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div class="foo" style="color: red;"></div>');
    });

    it('NodeWithChild', () => {
        const Component = createComponent('NodeWithChild', {
            filename: 'NodeWithChild.bia',
            name: 'NodeWithChild',
        });

        const vm = new Component({
            el: document.createElement('div'),
        });

        expect(vm.$el.outerHTML).to.equal('<div>\n        <span>Aloha</span>\n    </div>')
    });

    it('NodeWithMultipleLinesOfText', () => {
        const Component = createComponent('NodeWithMultipleLinesOfText', {
            filename: 'NodeWithMultipleLinesOfText.bia',
            name: 'NodeWithMultipleLinesOfText',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>\r\n        Hello world\r\n        foo bar baz\r\n    </div>');
    });

    it('NodeWithQuotedText', () => {
        const Component = createComponent('NodeWithQuotedText', {
            filename: 'NodeWithQuotedText.bia',
            name: 'NodeWithQuotedText',
        });

        const vm = new Component ({ el });
        
        expect(vm.$el.outerHTML).to.equal('<div>Foo\'s \"bar\"</div>');
    });

    it('NodeWithText', () => {
        const Component = createComponent('NodeWithText', {
            filename: 'NodeWithText.bia',
            name: 'NodeWithText',
        });

        const vm = new Component({ el });

        expect(vm.$el.outerHTML).to.equal('<div>Hello world</div>');
    });

    it('NodeWithTextExpression', () => {
        const Component = createComponent('NodeWithTextExpression', {
            filename: 'NodeWithTextExpression.bia',
            name: 'NodeWithTextExpression',
        });

        const vm = new Component({ el });
        
        // <div>{{ 1 + 2 }}</div>
        expect(vm.$el.outerHTML).to.equal('<div>3</div>');
    });

    it('NodeWithTextExpressionInChild', () => {
        const Component = createComponent('NodeWithTextExpressionInChild', {
            filename: 'NodeWithTextExpressionInChild.bia',
            name: 'NodeWithTextExpressionInChild',
        });

        const vm = new Component({ el });
        
        // <div>
        //     <span>{{ 1 + 2 }}</span>
        // </div>
        expect(vm.$el.outerHTML).to.equal('<div>\n        <span>3</span>\n    </div>');
    });

    it('NodeWithDataAttributes', () => {
        const Component = createComponent('NodeWithDataAttributes', {
            filename: 'NodeWithDataAttributes.bia',
            name: 'NodeWithDataAttributes',
        });

        const vm = new Component({ el });
    
        expect(vm.$el.outerHTML).to.equal('<div data-foo="bar" data-one-two="three"></div>');
    });

    it.skip('NodeWithDynamicChildren', () => {
        const Component = compileComponent('NodeWithDynamicChildren', {
            filename: 'NodeWithDynamicChildren.bia',
            name: 'NodeWithDynamicChildren',
        });

        console.log (Component.code);
    });
});