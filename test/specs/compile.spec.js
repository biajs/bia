const { compile } = require('../../');

describe('compile', () => {
    it('compiles an sfc', () => {
        const output = compile(`<template><div>Hello world</div></template>`);

        console.log (output);
    });
});