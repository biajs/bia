// bia v0.0.0

var changedState = {}, isUpdating = false, queue = [];

function setChangedState(namespace) {
    var key, i = 0, len = namespace.length, obj = changedState;
    isUpdating = true;
    for (; i < len; i++) {
        key = namespace[i];
        if (typeof obj[key] === 'undefined') obj[key] = {};
        obj = obj[key];
    }
}

function proxy(target, source) {
    var i = 0, keys = Object.keys(source), len = keys.length;
    for (; i < len; i++) {
        var key = keys[i];
        Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return source[key];
            },
            set: function(val) {
                source[key] = val;
            },
        });
    }
}

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

function observe(obj, namespace, onUpdate) {
    var keys = Object.keys(obj);
    
    for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        defineReactive(obj, key, obj[key], namespace.concat(key), onUpdate);
    }
}

function nextTick(fn) {
    queue.push(fn);
}

function init(vm, options) {
    vm.$options = options;
    
    vm._handlers = {};
}

function executePendingUpdates(onUpdate) {
    if (!isUpdating) return;
    onUpdate(changedState);
    changedState = {};
    isUpdating = false;
    let fns = queue, i = 0, len = fns.length;
    queue = [];
    for (;i < len; i++) fns[i]();
}

function emit(eventName, payload) {
    var handlers = eventName in this._handlers && this._handlers[eventName].slice();
    
    if (handlers) {
        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i].call(this, payload);
        }
    }
}

function defineReactive(obj, key, val, namespace, onUpdate) {
    if (val && typeof val === 'object') observe(val, namespace, onUpdate);
    
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val;
        },
        set: function (newVal) {
            val = newVal;
            setChangedState(namespace);
            Promise.resolve().then(executePendingUpdates.bind(null, onUpdate));
        },
    });
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
    var div, span, span_1, span_2, span_3, span_4, span_5, span_6, span_7, span_8, span_9, span_10, span_11, span_12, span_13;

    return {
        c: function create() {
            div = createElement('div');
            span = createElement('span');
            setText(span, '0');
            span_1 = createElement('span');
            setText(span_1, '1');
            span_2 = createElement('span');
            setText(span_2, '2');
            span_3 = createElement('span');
            setText(span_3, '3');
            span_4 = createElement('span');
            setText(span_4, '4');
            span_5 = createElement('span');
            setText(span_5, '5');
            span_6 = createElement('span');
            setText(span_6, '6');
            span_7 = createElement('span');
            setText(span_7, '7');
            span_8 = createElement('span');
            setText(span_8, '8');
            span_9 = createElement('span');
            setText(span_9, '9');
            span_10 = createElement('span');
            setText(span_10, '10');
            span_11 = createElement('span');
            setText(span_11, '11');
            span_12 = createElement('span');
            setText(span_12, '12');
            span_13 = createElement('span');
            setText(span_13, '13');
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(span, div);
            appendNode(span_1, div);
            appendNode(span_2, div);
            appendNode(span_3, div);
            appendNode(span_4, div);
            appendNode(span_5, div);
            appendNode(span_6, div);
            appendNode(span_7, div);
            appendNode(span_8, div);
            appendNode(span_9, div);
            appendNode(span_10, div);
            appendNode(span_11, div);
            appendNode(span_12, div);
            appendNode(span_13, div);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function Directives(options) {
    init(this, options);
    this.$state = assign({}, options.data);
    
    proxy(this, this.$state);
    
    const fragment = create_main_fragment(this);
    
    observe(this.$state, [], fragment.p);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

assign(Directives.prototype, {
    $emit: emit,
    $nextTick: nextTick,
    $on: on,
});

export default Directives;