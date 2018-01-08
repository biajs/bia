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

function appendNode(node, target) {
    target.appendChild(node);
}

function createText(text) {
    return document.createTextNode(text);
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

function create_else_block_1(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'false 5');
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

function create_else_if_block_1(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'false 4');
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

function create_else_block(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'false 3');
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

function create_else_if_block(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'true 2');
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

function create_if_block_2(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'false 2');
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

function create_if_block_1(vm) {
    var div;

    return {
        c: function create() {
            div = createElement('div');
            setText(div, 'false 1');
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

function create_if_block(vm) {
    var div, text;

    var if_block_1 = (false) && create_if_block_1(vm);
    var current_block_type = select_block_type_1(vm);
    var if_block = current_block_type(vm);
    return {
        c: function create() {
            div = createElement('div');
            text = createText('\r\n            true 1\r\n            ');
            if (if_block_1) if_block_1.c();
            if_block.c();
            return div;
        },
        d: noop,
        h: noop,
        m: function mount(target, anchor) {
            insertNode(div, target, anchor);
            appendNode(text, div);
            if (if_block_1) if_block_1.m(div, null);
            if_block.m(div, null);
        },
        p: function update() {
            if (false) {
                if (!if_block_1) {
                    if_block_1 = create_if_block_1(vm);
                    if_block_1.c();
                    if_block_1.m(div, null);
                }
            } else if (if_block_1) {
                if_block_1.u();
                if_block_1.d();
                if_block_1 = null;
            }
        },
        u: function unmount() {
            detachNode(div);
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
    if (true) return create_if_block;
    if (false) return create_else_if_block_1;
    return create_else_block_1;
}

function select_block_type_1(vm) {
    if (false) return create_if_block_2;
    if (true) return create_else_if_block;
    return create_else_block;
}

assign(Component.prototype, {
    $emit: emit,
    $on: on,
});

export default Component;