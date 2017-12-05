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

    // helper function to compile source code to a component
    let createComponent = (name, options) => {
        options.format = 'fn';

        const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name + '.bia'), 'utf8');
        
        const { code } = compile(source, options);
        
        return { 
            code, 
            // Component: new Function(code)(),
        };
    }

    it.skip('renders an empty element', () => {
        const { /*Component,*/ code } = createComponent('EmptyNode', {
            filename: 'EmptyNode.bia',
            name: 'EmptyNode',
        });

        // console.log (code);
    });
});