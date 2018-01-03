// bia v0.0.0

function init(vm, options) {
    vm.$options = options;
    
    // foo
}

function Watcher(getter, cb) {
    this.getter = getter;
    this.cb = cb;
    this.value = this.get();
    this.cb(this.value, null);
}

Watcher.prototype.addDep = function (dep) {
    dep.addSub(this);
};

Watcher.prototype.get = function () {
    pushTarget(this);
    var value = this.getter();
    popTarget();
    return value;
};

Watcher.prototype.update = function () {
    const value = this.get();
    const oldValue = this.value;
    this.value = value;
    this.cb(value, oldValue);
};

function Dep() {
    this.subs = new Set();
}

Dep.prototype.addSub = function () {
    this.subs.add(sub);
};

Dep.prototype.depend = function () {
    if (Dep.target) {
        Dep.target.addDep(this);
    }
};

Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update());
};

Dep.target = null;
var targetStack = [];

function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target);
    Dep.target = _target
}

function popTarget() {
    Dep.target = targetStack.pop();
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

export default Component;