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

function toggleVisibility(el, isVisible) {
    if (isVisible) el.style.removeProperty('display');
    else el.style.setProperty('display', 'none');
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
    var div, p, span;

    return {
        c: function create() {
            div = createElement('div');
            p = createElement('p');
            setText(p, 'hidden');
            span = createElement('span');
            setText(span, 'visible');
            this.h();
            return div;
        },
        d: noop,
        h: function hydrate() {
            toggleVisibility(p, false);
            toggleVisibility(span, true);
        },
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(p, div);
            appendNode(span, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
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