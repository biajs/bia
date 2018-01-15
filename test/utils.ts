import { ParsedNode } from '../src/interfaces';
import { create, compile } from '../src/index';

// helper function to compile components
export const code = (source, compilerOpts: any = {}) => {
    return compile(source, {
        filename: 'Component.bia',
        format: 'fn',
        htmlMinifier: {
            collapseWhitespace: true,
        },
        name: 'Component',
        ...compilerOpts,
    }).code;
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

// helper function to create an empty div
export const div = () => document.createElement('div');

// expose chai expect globally
export const expect = require('chai').expect;

// helper function to render components
export const render = (source = null, opts: any = {}, compilerOpts: any = {}) => {
    if (!source) {
        source = `<template><div></div></template>`;
    }

    const Component = create(source, {
        filename: 'Component.bia',
        format: 'fn',
        htmlMinifier: {
            collapseWhitespace: true,
        },
        name: 'Component',
        ...compilerOpts,
    });

    if (typeof opts.el === 'undefined') {
        opts.el = div();
    }

    return new Component(opts);
}