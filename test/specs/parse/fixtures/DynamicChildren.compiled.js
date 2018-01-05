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
    var div, div_1;

    var if_block = (dynamic) && create_if_block(vm);
    return {
        c: function create() {
            div = createElement('div');
            div_1 = createElement('div');
            setText(div_1, 'static');
            if (if_block) if_block.c();
            this.h();
            return div;
        },
        d: noop,
        h: function hydrate() {
            div_1.className = 'static';
        },
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(div_1, div);
            if (if_block) if_block.m(div, null);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_if_block(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'dynamic');
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function DynamicChildren(options) {
    init(this, options);
    const fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

assign(DynamicChildren.prototype, {
    $emit: emit,
    $on: on,
});

export default DynamicChildren;