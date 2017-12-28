declare var compile: Function;
declare var component: Function;
// declare var debug: Function;
// declare var el: Object;
declare var expect: Function;
declare var render: Function;

// expose chai expect globally
global.expect = require('chai').expect;

// helper function to compile a component
global.compile = (p) => {
    const source = require('fs').readFileSync(p, 'utf8');

    return require('../src/index').compile(source, {
        filename: 'Component.bia',
        name: 'Component',
        format: 'fn',
    });
}

// helper function to create a component constructor
global.component = (p) => {
    const { code } = compile(p);

    return new Function(code)();
}

// helper function to render components
global.render = (file, instanceOptions = {}, compilerOptions = {}) => {
    const Component = component(file);

    return new Component(instanceOptions);
}

// // // helper function to log code with a bit of spacing
// debug = (code) => {
//     console.log();
//     console.log('====================================================================');
//     console.log();
//     console.log(code);
//     console.log();
//     console.log('====================================================================');
//     console.log();
// }

// expect = require('chai').expect;

// beforeEach(() => {
//     el = document.createElement('div');
// });