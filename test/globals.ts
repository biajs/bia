declare var compile: Function;
declare var component: Function;
declare var debug: Function;
declare var el: Object;
declare var expect: Function;
declare var render: Function;

const baseCompile = require('../src/index').compile;

// helper function to log code with a bit of spacing
debug = (code) => {
    console.log();
    console.log('====================================================================');
    console.log();
    console.log(code);
    console.log();
    console.log('====================================================================');
    console.log();
}

// helper function to compile a component
compile = (p) => {
    const source = require('fs').readFileSync(p, 'utf8');

    return baseCompile(source, {
        filename: 'Component.bia',
        name: 'Component',
        format: 'fn',
    });
}

// helper function to create a component constructor
component = (p) => {
    const { code } = compile(p);

    return new Function(code)();
}

// helper function to render components
render = (file, instanceOptions = {}, compilerOptions = {}) => {
    const Component = component(file);

    return new Component(instanceOptions);
}

expect = require('chai').expect;

beforeEach(() => {
    el = document.createElement('div');
})