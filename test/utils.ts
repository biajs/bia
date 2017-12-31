import { ParsedNode } from '../src/interfaces';

// helper function to compile a component
export const compile = (p) => {
    const source = require('fs').readFileSync(p, 'utf8');

    return require('../src/index').compile(source, {
        filename: 'Component.bia',
        name: 'Component',
        format: 'fn',
    });
}

// helper function to create parsed nodes
export const createParsedNode = (opts = {}): ParsedNode => {
    // @ts-ignore
    return {
        attributes: {},
        children: [],
        dataAttributes: {},
        directives: [],
        hasDynamicChildren: false,
        innerHTML: '',
        parent: null,
        processingData: {},
        staticClasses: [],
        staticStyles: {},
        tagName: 'DIV',
        textContent: '',
        textInterpolations: [],
        type: 'ELEMENT',
        ...opts,
    }
}

// helper function to create a component constructor
export const component = (p) => {
    const { code } = compile(p);

    return new Function(code)();
}

// helper function to create an empty div
export const div = () => document.createElement('div');

// expose chai expect globally
export const expect = require('chai').expect;

// helper function to render components
export const render = (file, instanceOptions = {}, compilerOptions = {}) => {
    const Component = component(file);

    return new Component(instanceOptions);
}