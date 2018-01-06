// bia v0.0.0

function walk(obj) {
    var i = 0, keys = Object.keys(obj), len = keys.length;
    for (;i < len; i++) defineReactive(obj, keys[i], obj[keys[i]]);
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

function Dep() {
    // @todo: refactor this to something that will work below ie11
    this.subs = new Set();
}

Dep.prototype.addSub = function (sub) {
    this.subs.add(sub);
}

Dep.prototype.depend = function () {
    if (Dep.target) Dep.target.addDep(this);
}

Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update());
}

Dep.target = null

var targetStack = [];

function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target);
    Dep.target = _target;
}

function popTarget() {
    Dep.target = targetStack.pop();
}

function Watcher(getter, cb) {
    this.getter = getter;
    this.cb = cb;
    this.value = this.get();
    this.cb(this.value, null)
}

Watcher.prototype.get = function () {
    pushTarget(this);
    var value = this.getter();
    popTarget();
    return value;
}

Watcher.prototype.addDep = function (dep) {
    dep.addSub(this);
}

Watcher.prototype.update = function () {
    var value = this.get(), oldValue = this.value;
    this.value = value;
    this.cb(value, oldValue);
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
    var span;

    return {
        c: function create() {
            span = createElement('span');
            setText(span, 'else branch');
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

function create_if_block(vm) {
    var p;

    return {
        c: function create() {
            p = createElement('p');
            setText(p, 'if branch');
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
    const fragment = create_main_fragment(this);
    
    if (options.el) {
        this.$el = fragment.c();
        fragment.m(options.el, options.anchor || null);
    }
}

function select_block_type(vm) {
    if (false) return create_if_block;
    return create_else_block;
}

assign(Component.prototype, {
    $emit: emit,
    $on: on,
});

export default Component;