// bia v0.0.0

function on(eventName, handler) {
    var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
    
    handlers.push(handler);
    
    return {
        cancel: function () {
            var index = handlers.indexOf(handler);
            if (~index) handlers.splice(index, 1);
        }
    };
}

function init(vm, options) {
    vm.$options = options;
    
    vm._handlers = {};
}

function emit(eventName, payload) {
    var handlers = eventName in this._handlers && this._handlers[eventName].slice();
    
    if (handlers) {
        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i].call(this, payload);
        }
    }
}

function assign(target) {
    var k, source, i = 1, len = arguments.length;
    
    for (; i < len; i++) {
        source = arguments[i];
        for (k in source) target[k] = source[k];
    }
    
    return target;
}

function appendNode(node, target) {
    target.appendChild(node);
}

function createText(text) {
    return document.createTextNode(text);
}

function setText(el, text) {
    el.textContent = text;
}

function detachNode(node) {
    node.parentNode.removeChild(node);
}

function insertNode(node, target, anchor) {
    target.insertBefore(node, anchor);
}

function createElement(tag) {
    return document.createElement(tag);
}

function noop() {}

function create_main_fragment(vm) {
    var div, text, div_1;

    var if_block = (true) && create_if_block(vm);
    return {
        c: function create() {
            div = createElement('div');
            if (if_block) if_block.c();
            text = createText('\r\n        static text\r\n        ');
            div_1 = createElement('div');
            div_1.innerHTML = '\r\n            nested static text\r\n            <p>nested static element</p>\r\n        ';
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block) if_block.m(div, null);
            appendNode(text, div);
            appendNode(div_1, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_if_block(vm) {
    var span;

    return {
        c: function create() {
            span = createElement('span');
            setText(span, 'dynamic');
            return span;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(span, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(span);
        }
    };
}

function Component(options) {
    init(this, options);
    const fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

assign(Component.prototype, {
    $emit: emit,
    $on: on,
});

export default Component;