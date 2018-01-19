import code from '../../generators/code';

//
// append one node to another
//
export const appendNode = code(`
    function appendNode(node, target) {
        target.appendChild(node);
    }
`);

//
// object assignment helper
//
export const assign = code(`
    function assign(target) {
        var k, source, i = 1, len = arguments.length;

        for (; i < len; i++) {
            source = arguments[i];
            for (k in source) target[k] = source[k];
        }

        return target;
    }
`);

//
// create an html comment
//
export const createComment = code(`
    function createComment(text) {
        return document.createComment(text);
    }
`);

//
// create an html element
//
export const createElement = code(`
    function createElement(tag) {
        return document.createElement(tag);
    }
`);

//
// create an html text node
//
export const createText = code(`
    function createText(text) {
        return document.createTextNode(text);
    }
`);

//
// initialize a component
//
export const init = code(`
    function init(vm, options) {
        vm.$options = options;
        vm._handlers = [];
    }
`);

//
// proxy one object to another
//
export const proxy = code(`
    function proxy(target, source) {
        for (let key in source) Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get: function() { return source[key] },
            set: function(val) { source[key] = val },
        });
    }
`);