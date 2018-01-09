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
    var div;

    var current_block_type = select_block_type(vm);
    var if_block = current_block_type(vm);
    return {
        c: function create() {
            div = createElement('div');
            if_block.c();
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if_block.m(div, null);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_else_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, '3');
            return p;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(p);
        }
    };
}

function create_else_if_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, '2');
            return p;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(p);
        }
    };
}

function create_if_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, '1');
            return p;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(p);
        }
    };
}

function Component(options) {
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

function select_block_type(vm) {
    if (false) return create_if_block;
    if (true) return create_else_if_block;
    return create_else_block;
}

assign(Component.prototype, {
    $emit: emit,
    $nextTick: nextTick,
    $on: on,
});

export default Component;