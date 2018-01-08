// bia v0.0.0

var changedState = {}, isUpdating = false;

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

function nextTick(cb) {
    Promise.resolve().then(cb);
}

function init(vm, options) {
    vm.$options = options;
    
    vm._handlers = {};
}

function executePendingUpdates(onUpdate) {
    if (!isUpdating) return;
    isUpdating = false;
    onUpdate(changedState);
    changedState = {};
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
            nextTick(executePendingUpdates.bind(null, onUpdate));
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

    var if_block = (true) && create_if_block(vm);
    return {
        c: function create() {
            div = createElement('div');
            if (if_block) if_block.c();
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            if (if_block) if_block.m(div, null);
        },
        p: noop,
        u: function unmount() {
            detachNode(div);
        }
    };
}

function create_if_block_3(vm) {
    var u;

    return {
        c: function create() {
            u = createElement('u');
            setText(u, 'no');
            return u;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(u, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(u);
        }
    };
}

function create_if_block_2(vm) {
    var i;

    return {
        c: function create() {
            i = createElement('i');
            setText(i, 'yes');
            return i;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(i, target, anchor);
        },
        p: noop,
        u: function unmount() {
            detachNode(i);
        }
    };
}

function create_if_block_1(vm) {
    var span;

    var if_block_2 = (true) && create_if_block_2(vm);
    var if_block_3 = (false) && create_if_block_3(vm);
    return {
        c: function create() {
            span = createElement('span');
            if (if_block_2) if_block_2.c();
            if (if_block_3) if_block_3.c();
            return span;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(span, target, anchor);
            if (if_block_2) if_block_2.m(span, null);
            if (if_block_3) if_block_3.m(span, null);
        },
        p: noop,
        u: function unmount() {
            detachNode(span);
        }
    };
}

function create_if_block(vm) {
    var p;

    var if_block_1 = (true) && create_if_block_1(vm);
    return {
        c: function create() {
            p = createElement('p');
            if (if_block_1) if_block_1.c();
            return p;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(p, target, anchor);
            if (if_block_1) if_block_1.m(p, null);
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

assign(Component.prototype, {
    $emit: emit,
    $on: on,
});

export default Component;