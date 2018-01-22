import Code from '../../generators/code';

//
// appendNode
//
export const appendNode = new Code(`
    function #appendNode(node, target) {
        target.appendChild(node);
    }
`);

//
// assign
//
export const assign = new Code(`
    function #assign(target) {
        var k, source, i = 1, len = arguments.length;

        for (; i < len; i++) {
            source = arguments[i];
            for (k in source) target[k] = source[k];
        }

        return target;
    }
`);

//
// createComment
//
export const createComment = new Code(`
    function #createComment(text) {
        return document.createComment(text);
    }
`);

//
// createElement
//
export const createElement = new Code(`
    function #createElement(tag) {
        return document.createElement(tag);
    }
`);

//
// createText
//
export const createText = new Code(`
    function #createText(text) {
        return document.createTextNode(text);
    }
`);

//
// defineReactive
//
export const defineReactive = new Code(`
    function #defineReactive(obj, key, val, namespace, onUpdate) {
        if (val && typeof val === 'object') observe(val, namespace, onUpdate);
        
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                return val;
            },
            set: function (newVal) {
                val = newVal;
                @setChangedState(namespace);
                Promise.resolve().then(@executePendingUpdates.bind(null, onUpdate));
            },
        });
    }
`);

//
// executePendingUpdates
//
export const executePendingUpdates = new Code(`
    function #executePendingUpdates(onUpdate) {
        if (!#isUpdating) return;
        #onUpdate(#changedState);
        #changedState = {};
        #isUpdating = false;
        let fns = queue, i = 0, len = fns.length;
        #queue = [];
        for (;i < len; i++) fns[i]();
    }
`);

//
// init
//
export const init = new Code(`
    function #init(vm, options) {
        vm.$options = options;
        vm._handlers = [];
    }
`);

//
// noop
//
export const noop = new Code(`
    function #noop() {}
`);

//
// observe
//
export const observe = new Code(`
    function #observe(obj, namespace, onUpdate) {
        for (var key in obj) {
            @defineReactive(obj, key, obj[key], namespace.concat(key), onUpdate);
        }
    }
`);

//
// proxy
//
export const proxy = new Code(`
    function #proxy(target, source) {
        for (let key in source) Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get: function() { return source[key] },
            set: function(val) { source[key] = val },
        });
    }
`);

//
// setChangedState
//
export const setChangedState = new Code(`
    function #setChangedState(namespace) {
        var key, i = 0, len = namespace.length, obj = changedState;
        isUpdating = true;
        for (; i < len; i++) {
            key = namespace[i];
            if (typeof obj[key] === 'undefined') obj[key] = {};
            obj = obj[key];
        }
    }
`);

//
// setText
//
export const setText = new Code(`
    function #setText(el, text) {
        el.textContent = text;
    }
`);